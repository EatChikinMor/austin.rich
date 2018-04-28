'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Particles from 'react-particles-js';
import particleConfig from './particlesjs-config.json';
import pcss from './BPCSS.pcss'; // CSS can be scoped using either Post CSS
import css from './Boilerplate.css'; // Or vanilla CSS

/**
* @module Boilerplategit stat
*/
export default class Boilerplate extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			exampleState : 'initial state'
		};
	}

	componentWillMount() {
	}

	componentDidMount() {
	}

	componentWillUpdate() {
	}

	componentDidUpdate() {
	}

	componentWillUnmount() {
	}

	render() {
		return (
			<div id="particles"  class={pcss.background} style={{ position:'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        <Particles style={{position: 'fixed', width: '100%'}} params={particleConfig}/>
        <div id={css.background} style={{position: 'relative', zIndex: 2, width: '550px', margin: '0 auto', border: '5px solid #FFF', borderTop: 'none', borderRadius: '0 0 10px 10px', paddingBottom: '70px'}}>
          <h1 style={{fontFamily: 'Coolvetica', fontSize: '278px', width: '100%', textAlign: 'center', color: '#FFF', margin: 0, letterSpacing: '-20px'}}>AR</h1>
          <h3 style={{fontFamily: 'Helvetica, Sans Serif', fontSize: '90px', width: '100%', textAlign: 'center', color: '#FFF', margin: 0, letterSpacing: '-7px'}}>Boilerplate</h3>
        </div>
      </div>
		);
	}
}
Boilerplate.defaultProps = {
  defaultPropGoesHere: 'default prop'
};

Boilerplate.propTypes = {
  example: PropTypes.string
};

Boilerplate.displayName = 'Boilerplate';

