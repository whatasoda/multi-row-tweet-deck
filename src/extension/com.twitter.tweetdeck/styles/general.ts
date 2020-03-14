import { GeneralStyles } from '../../../shared/styles/general';
import { createGlobalStyle, css } from 'styled-components';
import { TDClassName } from '../../../shared/utils/TDClassName';
import { ROOT_SELECTOR } from '../../../shared/constants';

const createStyleList = (styles: GeneralStyles) => {
  return (Object.entries(TDClassName.css) as [OneOfTDClassName, string][]).reduce<Style[]>((acc, [key, name]) => {
    const style = styles[key];
    if (style) {
      acc.push(css`
        ${name} {
          ${style}
        }
      `);
    }
    return acc;
  }, []);
};

export const GeneralStylesInjection = createGlobalStyle<{ styles: GeneralStyles }>`
  ${ROOT_SELECTOR} {
    ${({ styles }) => createStyleList(styles)}
  }
`;
