import React, {Component, PropTypes} from 'react';

class VisitPatternRow extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.domain}</td>
        <td>{this.props.referringCount}</td>
      </tr>
    )
  }
}

VisitPatternRow.propTypes = {
  domain: PropTypes.string.isRequired,
  referringCount: PropTypes.number.isRequired,
};

VisitPatternRow.defaultProps = {
  domain: '<domain>',
  referringCount: 0
};

export default VisitPatternRow;
