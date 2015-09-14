import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import VisitPatternRow from './VisitPatternRow';

class VisitPatterns extends Component {
  render() {
    var domains = _(this.props.referringDomains).pairs().sortBy(1).reverse().value();
    var rows = _.map(domains, ([domain, referringCount]) =>
      <VisitPatternRow
        key={domain}
        domain={domain}
        referringCount={referringCount}
      />
    );
    return (
      <div>
        <h2>Visit Patterns</h2>
        <table>
          <thead>
            <tr>
              <th>domains</th>
              <th>referring visit counts</th>
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

VisitPatterns.propTypes = {
  referringDomains: PropTypes.objectOf(PropTypes.number).isRequired
}

VisitPatterns.defaultProps = {
  referringDomains: {}
}

export default VisitPatterns;
