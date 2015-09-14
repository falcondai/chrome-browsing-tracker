import React, {Component, PropTypes} from 'react';
import Tabs from './Tabs'
import Domains from './Domains'
import VisitPatterns from './VisitPatterns'

class App extends Component {
  render() {
    return (
      <div>
        <h1>History</h1>
        <Tabs
          tabs={this.props.globalProps.tabs}
        />
        <Domains
          domains={this.props.globalProps.domains}
        />
        <VisitPatterns
          referringDomains={this.props.globalProps.referringDomains}
        />
      </div>
    )
  }
}

export default App;
