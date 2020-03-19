declare module 'styled-components' {
  interface DefaultTheme {
    color: ColorTheme;
  }
}

interface ColorTheme {
  TwitterColor: typeof TwitterColor;
  cellBackground: string;
  cellsBackground: string;
  border: string;
}

export const TwitterColor = {
  white: '#fff',
  lightestGray: '#f5f8fa',
  lighterGray: '#e1e8ed',
  lightGray: '#ccd6dd',
  gray: '#aab8c2',
  darkGray: '#8899a6',
  darkerGray: '#657786',
  darkBlack: '#38444d',
  midnightDarkGray: '#15202b',
  deepBlack: '#14171a',
  midnightDarkestGray: '#10171e',
  black: '#000',
  blue: '#1da1f2',
  deepBlue: '#005fd1',
  red: '#e0245e',
  deepRed: '#a01744',
  green: '#17bf63',
  yellow: '#ffad1f',
};

export const darkThmee: ColorTheme = {
  TwitterColor,
  cellBackground: TwitterColor.midnightDarkGray,
  cellsBackground: TwitterColor.midnightDarkestGray,
  border: TwitterColor.deepBlack,
};

export const lightTheme: ColorTheme = {
  TwitterColor,
  cellBackground: TwitterColor.white,
  cellsBackground: TwitterColor.lighterGray,
  border: TwitterColor.lighterGray,
};
