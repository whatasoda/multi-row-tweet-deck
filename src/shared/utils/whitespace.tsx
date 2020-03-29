import React, { createElement, Fragment } from 'react';

export const ws = (text: string) => {
  const children = text
    .trim()
    .split('\n')
    .reduce<React.ReactNode[]>((acc, text) => (acc.push(text, <br />), acc), []);
  return createElement(Fragment, {}, ...children);
};
