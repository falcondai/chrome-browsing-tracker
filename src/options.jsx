import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import App from './components/App';

// empty app
// TODO: add spinning wheels
var globalProps = {
      tabs: {},
      domains: {},
      referringDomains: {},
    },
    app = React.render(<App globalProps={globalProps} />, document.getElementById('root'));

chrome.storage.local.get(null, (allEvents) => {
  var eventIds = _.keys(allEvents).map((x) => {
    var s = x.split('-');
    return [+s[0], +s[1]];
  }).sort();

  chrome.storage.local.getBytesInUse(null, (bytes) => {
    console.info(`recorded ${eventIds.length} events using ${bytes} bytes`);
  });

  var bySession = _.groupBy(eventIds, 0),
      latestSession = _.max(_.keys(bySession)),
      lastActiveTab = null,
      tabs = {};

  // types:
  // tab
  // └── visits
  //     └── activePeriods
  function closePreviousVisit() {
    if (tabs[tabId].visits.length > 0) {
      closePreviousActivePeriod(tabId)
      _.last(tabs[tabId].visits).leftAt = timestamp
    }
  }

  function closePreviousActivePeriod(tabId) {
    if (!tabId) return;
    if (tabs[tabId].visits.length > 0) {
      if (_.last(tabs[tabId].visits).activePeriods.length > 0) {
        _.last(_.last(tabs[tabId].visits).activePeriods).deactivatedAt = timestamp
      }
    }
  }

  function extractHost(url) {
    var match = url.match(/(.+?:\/\/.+?)\//);
    if (match && match.length > 1) return match[1];
    return '?';
  }

  // sort events by timestamps
  bySession[latestSession] = _.sortBy(bySession[latestSession], 1);
  console.info(`session ${latestSession} has ${bySession[latestSession].length} events`);
  // generate tabs, visits, activePeriods
  for (var eventId of bySession[latestSession]) {
    var event = allEvents[eventId.join('-')];
    // console.log(event);

    // skip events with undefined data
    if (!event[3]) {
      continue;
    }

    var timestamp = event[1],
        eventName = event[2],
        data = event[3],
        tabId = data.tabId || data.id;
    if (eventName === 'created') {
      tabs[tabId] = {
        createdAt: timestamp,
        visits: [],
      }
    } else if (eventName === 'jumped') {
      if (!(tabId in tabs)) {
        tabs[tabId] = {
          createdAt: timestamp,
          visits: [],
        }
      }

      closePreviousVisit()
      tabs[tabId].visits.push({
        visitedAt: timestamp,
        url: data.url,
        activePeriods: []
      });
    } else if (eventName === 'loaded') {
      if (!(tabId in tabs)) {
        continue;
      }
      _.last(tabs[tabId].visits).url = data.url;
    } else if (eventName === 'removed') {
      if (!(tabId in tabs)) {
        continue;
      }

      closePreviousVisit()
      tabs[tabId].removedAt = timestamp;
    } else if (eventName === 'browser focused') {

    } else if (eventName === 'browser defocused') {
      closePreviousActivePeriod(lastActiveTab)

    } else if (eventName === 'activated') {
      closePreviousActivePeriod(lastActiveTab)

      if (!(tabId in tabs)) {
        tabs[tabId] = {
          createdAt: timestamp,
          visits: [],
        }
      }

      if (tabs[tabId].visits.length === 0) {
        tabs[tabId].visits.push({
          visitedAt: timestamp,
          url: data.url,
          activePeriods: [],
        });
      }

      _.last(tabs[tabId].visits).activePeriods.push({
        activatedAt: timestamp
      })
      lastActiveTab = tabId;
    }
  }

  // tab lifetimes and status (still alive?)
  // update tabs UI
  globalProps.tabs = tabs
  app = React.render(<App globalProps={globalProps} />, document.getElementById('root'))

  // time used on each domain
  var now = Date.now(),
      timeOnDomains = {};
  for (var i in tabs) {
    var tab = tabs[i];
    for (var visit of tab.visits) {
      var host = extractHost(visit.url);
      if (!(host in timeOnDomains)) timeOnDomains[host] = 0;
      for (var activePeriod of visit.activePeriods) {
        activePeriod.deactivatedAt = activePeriod.deactivatedAt || now
        timeOnDomains[host] += activePeriod.deactivatedAt - activePeriod.activatedAt;
      }
    }
  }

  // update domain UI
  globalProps.domains = timeOnDomains
  app = React.render(<App globalProps={globalProps} />, document.getElementById('root'));

  // what domains branch out the most

  // promisify `chrome.history.getVisits`
  var getVisits = (url) => new Promise((resolve, reject) => chrome.history.getVisits({url: url}, (visits) => resolve(visits)));

  chrome.history.search({text: '', maxResults: 0}, (historyItems) => {
    var urls = _.pluck(historyItems, 'url');
    Promise.all(_.map(urls, getVisits)).then((visits) =>
      _.flatten(_.map(_.zip(urls, visits), ([url, visits]) => _.map(visits, (visit) => _.assign(visit, {url: url}))))
    ).then((visits) =>
      [_.pluck(visits, 'referringVisitId'), _.zipObject(_.pluck(visits, 'visitId'), visits)]
    ).then(([referringVisitIds, visits]) => {
      var referringDomains = {},
          counts = _.countBy(referringVisitIds);
      for (var id in counts) {
        if (id in visits) {
          var domain = extractHost(visits[id].url);
          referringDomains[domain] = (referringDomains[domain] || 0) + counts[id];
        }
      }
      return referringDomains;
    }).then((referringDomains) => {
      globalProps.referringDomains = referringDomains;
      app = React.render(<App globalProps={globalProps} />, document.getElementById('root'));
    })
  })
});
