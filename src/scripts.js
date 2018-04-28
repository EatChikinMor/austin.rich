import React from 'react';
import ReactDOM from 'react-dom';

import Application from './components/Application';


function renderApp() {
  const app = document.getElementById('app');
  ReactDOM.render(<Application />, app);
}

renderApp();
