import React from 'react';
import ReactDOM from 'react-dom';
import { ROOT_CLASS_NAME } from '../../shared/constants';
import { updateVanillaTweetDeck } from '../../shared/styleFactory';
import { App } from './App';

const render = () => {
  const root = document.documentElement;
  const body = document.body;
  root.classList.add(ROOT_CLASS_NAME);
  body.classList.add(ROOT_CLASS_NAME);

  updateVanillaTweetDeck();
  const container = document.createElement('div');
  container.style.display = 'none';
  document.documentElement.appendChild(container);

  ReactDOM.render(<App />, container);
};

render();
