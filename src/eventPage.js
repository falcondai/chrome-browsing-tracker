import _ from 'lodash';

// IDEA: save events by tabs?
// sessionId-tabId: [event1, event2, ...]
function saveEvent(eventName, tab) {
  var timestamp = Date.now(),
      sessionId = sessionStorage.getItem('sessionId');
  if (sessionId === null) {
    sessionId = timestamp
    sessionStorage.setItem('sessionId', timestamp)
  }
  console.log('[save]', sessionId, timestamp, eventName, tab);
  const record = {};
  record[`${sessionId}-${timestamp}`] = [sessionId, timestamp, eventName, tab];
  chrome.storage.local.set(record);
}

// new browsing session
chrome.runtime.onStartup.addListener(() => {
  var sessionId = Date.now(),
      timestamp = sessionId;
  sessionStorage.setItem('sessionId', sessionId)
  sessionStorage.setItem('browserFocused', JSON.stringify(true))
  saveEvent('browser started', {})
  console.log('new session', sessionId)
})

// listen for window events
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Chrome is out of focus, including computer sleeps
    saveEvent('browser defocused', {})
    sessionStorage.setItem('browserFocused', JSON.stringify(false))
  } else {
    chrome.tabs.query({active: true, windowId: windowId}, (tabs) => {
      if (tabs.length > 0) {
        saveEvent('activated', tabs[0])
      }
    })
    if (!JSON.parse(sessionStorage.getItem('browserFocused'))) {
      saveEvent('browser focused', {})
      sessionStorage.setItem('browserFocused', JSON.stringify(true))
    }
  }
})

// listen for tab events
chrome.tabs.onCreated.addListener((tab) => {
  saveEvent('created', tab)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    saveEvent('loaded', tab)
  } else if (changeInfo.url) {
    saveEvent('jumped', tab)
  }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => saveEvent('activated', tab))

  if (!JSON.parse(sessionStorage.getItem('browserFocused'))) {
    saveEvent('browser focused', {})
    sessionStorage.setItem('browserFocused', JSON.stringify(true))
  }
})

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  saveEvent('removed', {id: tabId})
})
