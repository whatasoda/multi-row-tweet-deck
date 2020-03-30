import '../shared/browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './i18n';

const render = () => {
  ReactDOM.render(<App />, document.getElementById('app'));
};

render();
