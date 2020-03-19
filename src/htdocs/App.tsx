import React from 'react';
import { CustomThemeProvider } from '../shared/utils/ThemeProvider';
import { Routes } from './routes';
import { DragProvider } from './utils/useDrag';
import { GlobalStyle } from './GlobalStyle';

export const App = () => (
  <CustomThemeProvider defaultTheme="dark">
    <>
      <GlobalStyle />
      <DragProvider mode="animationFrame">
        <Routes />
      </DragProvider>
    </>
  </CustomThemeProvider>
);
