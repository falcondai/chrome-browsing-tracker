import React, {Component, PropTypes} from 'react';
import moment from 'moment';

class DomainRow extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.domain}</td>
        <td>{moment.duration(this.props.duration).humanize()}</td>
      </tr>
    )
  }
}

DomainRow.propTypes = {
  domain: PropTypes.string,
  duration: PropTypes.number
};

DomainRow.defaultProps = {
  domain: '?',
  duration: 0
};

export default DomainRow;
