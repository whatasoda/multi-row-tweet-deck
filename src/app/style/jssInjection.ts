import jss, { StyleSheet } from 'jss';
import jssCamelCase from 'jss-plugin-camel-case';
import jssGlobal from 'jss-plugin-global';
import jssNested from 'jss-plugin-nested';
import { CSSProperties } from 'react';
import { AppStyle, NativeClassName } from './appStyle';

jss.use(jssNested(), jssGlobal(), jssCamelCase());

let sheet: StyleSheet | null = null;
const JssInjection = (styleElement: HTMLStyleElement, { cellCols, cellRows, cellCommon, ...appStyle }: AppStyle) => {
  let cellCount = 0;
  const column = cellCols.reduce<Record<string, CSSProperties>>(
    (acc, style, i) => {
      const isLastCol = cellCols.length - 1 === i;
      const col = cellRows[i];
      const prefix = isLastCol ? `${col.length}n + ` : '';
      Object.assign(acc, { [`&:nth-child(n + ${cellCount})`]: style });
      col.forEach((style) =>
        Object.assign(acc, {
          [`&:nth-child(${prefix}${++cellCount})`]: style,
        }),
      );
      return acc;
    },
    cellCommon as any,
  );

  const styleEntries = Object.entries(appStyle) as Array<[keyof typeof appStyle, CSSProperties]>;

  if (sheet) sheet.detach();
  sheet = jss.createStyleSheet(
    {
      '@global': {
        'html.dark .column': column,
        ...styleEntries.reduce<Record<string, CSSProperties>>(
          (acc, [key, style]) =>
            Object.assign(acc, {
              [`html.dark ${NativeClassName.css[key]}`]: style,
              [`html ${NativeClassName.css[key]}`]: style,
            }),
          {},
        ),
      },
    } as any,
    {
      element: styleElement,
    },
  );

  sheet.attach();
};

export default JssInjection;