declare module 'styled-components' {
  interface DefaultTheme {
    color: ColorTheme;
  }
}

interface ColorTheme {
  TwitterColor: typeof TwitterColor;
  navBackground: string;
  cellBackground: string;
  cellsBackground: string;
  primaryButtonPushed: string;
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
  lightestMidnightGray: '#2b7bb9',
  lightMidnightGray: '#3d5466',
  midnightGray: '#1c2938',
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
  navBackground: TwitterColor.midnightGray,
  cellBackground: TwitterColor.midnightDarkGray,
  cellsBackground: TwitterColor.midnightDarkestGray,
  primaryButtonPushed: TwitterColor.lightMidnightGray,
  border: TwitterColor.deepBlack,
};

export const lightTheme: ColorTheme = {
  TwitterColor,
  navBackground: TwitterColor.midnightGray,
  cellBackground: TwitterColor.white,
  cellsBackground: TwitterColor.lighterGray,
  primaryButtonPushed: TwitterColor.lightestMidnightGray,
  border: TwitterColor.lighterGray,
};
