import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  html {
    background-color: ${({ theme: { color } }) => color.cellsBackground};
  }
  html, body, #app {
    height: 100%;
  }
  button {
    font-size: inherit;
    appearance: none;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    color: inherit;
  }
  select {
    appearance: none;
    border: unset;
    border-radius: unset;
    outline: none;
  }
`;
