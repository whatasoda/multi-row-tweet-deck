import { createGlobalStyle, css } from 'styled-components';
import { CellStyles } from '../../../shared/styles/cell';
import { TDClassName } from '../../../shared/utils/TDClassName';
import { ROOT_SELECTOR } from '../../../shared/constants';

const applyPseudoSelectorToCells = ({ cells, orders }: CellStyles) => {
  let count = 0;
  return orders.map(([columnId, rowOrders], idx) => {
    const isLast = idx === orders.length - 1;
    const [columnStyle, rowStyles] = cells[columnId];

    return css`
      &:nth-child(n + ${count + 1}):nth-child(${isLast ? '-' : 0}n + ${count + rowOrders.length + 1}) {
        ${columnStyle}
      }
      ${rowOrders.map(
        (rowId) => css`
          &:nth-child(${isLast ? rowOrders.length : 0}n + ${++count}) {
            ${rowStyles[rowId]}
          }
        `,
      )}
    `;
  });
};

export const CellStylesInjection = createGlobalStyle<{ styles: CellStyles }>`
  ${ROOT_SELECTOR} {
    ${TDClassName.css.column} {
      ${({ styles }) => styles.common}
      ${({ styles }) => applyPseudoSelectorToCells(styles)}
    }
  }
`;
