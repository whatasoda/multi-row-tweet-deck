import React from 'react';
import { CustomThemeProvider } from '../shared/utils/ThemeProvider';
import { DragProvider } from './utils/useDrag';
import { GlobalStyle } from './GlobalStyle';
import { MultiRowFrame } from './containers/MultiRowFrame';

export const App = () => (
  <CustomThemeProvider defaultTheme="light">
    <>
      <GlobalStyle />
      <DragProvider mode="animationFrame">
        <MultiRowFrame />
      </DragProvider>
    </>
  </CustomThemeProvider>
);
