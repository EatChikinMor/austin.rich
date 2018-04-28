import React from 'react';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import background from './../assets/images/pineapple-supply-co-124390.jpg'

import Boilerplate from './BoilerplateHome/Boilerplate';

export default class Application extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div id="application" style={{position:'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        <Boilerplate />
      </div>
    )
  }
}
