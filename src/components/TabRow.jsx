import React, {Component, PropTypes} from 'react';
import moment from 'moment';

class TabRow extends Component {
  render() {
    var isLive = !this.props.removedAt,
        removedAt = this.props.removedAt || Date.now();

    return (
      <tr>
        <td>{this.props.tabId}</td>
        <td>{_.trunc(this.props.latestUrl, 64)}</td>
        <td>{isLive? 'live' : 'removed'}</td>
        <td>{moment.duration(removedAt - this.props.createdAt).humanize()}</td>
        <td>{moment(this.props.createdAt).format()}</td>
        <td>{isLive? '' : moment(removedAt).fromNow()}</td>
      </tr>
    )
  }
}

TabRow.propTypes = {
  tabId: PropTypes.string,
  latestUrl: PropTypes.string,
  createdAt: PropTypes.number,
  removedAt: PropTypes.number,
};

TabRow.defaultProps = {
  tabId: '0',
  createdAt: 0,
};

export default TabRow;
