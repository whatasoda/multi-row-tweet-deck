import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import '../shared/browser';

const render = () => {
  ReactDOM.render(<App />, document.getElementById('app'));
};

render();
