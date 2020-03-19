import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  html, body, #app {
    height: 100%;
  }
  button {
    appearance: none;
    writing-mode: unset;
    background: none;
    border: none;
    box-shadow: none;
    cursor: pointer;
  }
`;
