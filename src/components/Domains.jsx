import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import DomainRow from './DomainRow';

class Domains extends Component {
  render() {
    var rows = _(this.props.domains).pairs().sortBy(1).reverse().map(([domain, duration]) =>
      <DomainRow
        key={domain}
        domain={domain}
        duration={duration}
      />
    ).value();
    return (
      <div>
        <h2>Domains</h2>
        <table>
          <thead>
            <tr>
              <th>domain</th>
              <th>active duration</th>
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

Domains.propTypes = {
  domains: PropTypes.object.isRequired
}

Domains.defaultProps = {
  domains: {}
}

export default Domains;
