import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import TabRow from './TabRow';

class Tabs extends Component {
  render() {
    var rows = _(this.props.tabs).pairs().sortBy('1.createdAt').map(([id, tab]) =>
      <TabRow
        key={id}
        tabId={id}
        latestUrl={_.last(tab.visits) ? _.last(tab.visits).url : ''}
        createdAt={tab.createdAt}
        removedAt={tab.removedAt}
      />
    ).value();
    return (
      <div>
        <h2>Tabs</h2>
        <table>
          <thead>
            <tr>
              <th>tab ids</th>
              <th>latest URL</th>
              <th>is live?</th>
              <th>lifetime</th>
              <th>created at</th>
              <th>removed at</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}

Tabs.propTypes = {
  tabs: PropTypes.object.isRequired
}

Tabs.defaultProps = {
  tabs: {}
}

export default Tabs;
