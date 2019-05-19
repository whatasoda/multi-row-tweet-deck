import jss, { StyleSheet } from 'jss';
import jssCamelCase from 'jss-plugin-camel-case';
import jssGlobal from 'jss-plugin-global';
import jssNested from 'jss-plugin-nested';
import { CSSProperties } from 'react';
import { AppStyle, NativeClassNames } from './appStyle';

jss.use(jssNested(), jssGlobal(), jssCamelCase());

let sheet: StyleSheet | null = null;
const JssInjection = (styleElement: HTMLStyleElement, { cellCols, cellRows, cellCommon, ...appStyle }: AppStyle) => {
  let cellCount = 0;
  const column = cellCols.reduce<Record<string, CSSProperties>>(
    (acc, style, i) =>
      Object.assign(
        acc,
        {
          [`&:nth-child(${cellCount} + n)`]: style,
        },
        ...cellRows[i].map<Record<string, CSSProperties>>((style) => ({
          [`&:nth-child(${++cellCount})`]: style,
        })),
      ),
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
              [`html.dark .${NativeClassNames[key]}`]: style,
              [`html .${NativeClassNames[key]}`]: style,
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
