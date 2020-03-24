import { createGlobalStyle, css } from 'styled-components';
import { TDClassName } from '../../shared/utils/TDClassName';
import { ROOT_SELECTOR, HEADER_HEIGHT } from '../../shared/constants';
import { createDrawerStyle, createColumnHeaderStyle, createCellStylesInColumn } from '../../shared/styleFactory';

const createStyles = (profile: MultiRowProfile) => {
  const { drawer, header } = profile;
  const styles = {
    ...createDrawerStyle(drawer),
    ...createColumnHeaderStyle(header),
    column: applyPseudoSelectors(profile),
  };
  return (Object.entries(TDClassName.css) as [keyof typeof styles, string][]).map<Style>(([key, name]) => {
    return css`
      ${name} {
        ${styles[key]}
      }
    `;
  }, []);
};

const applyPseudoSelectors = ({ cells, header }: MultiRowProfile) => {
  let count = 0;
  const { columnOrder, columns, gap } = cells;
  const items = columnOrder.map((columnId, idx) => {
    const column = columns[columnId];
    const isLastColumn = idx === columnOrder.length - 1;
    const [width, heightMap] = createCellStylesInColumn(column, HEADER_HEIGHT[header.height], gap);
    const { rowOrder } = column;
    const rowCount = rowOrder.length;

    return css`
      &:nth-child(n + ${count + 1}):nth-child(${isLastColumn ? '-' : 0}n + ${count + rowCount + 1}) {
        width: ${width};
      }
      ${rowOrder.map(
        (rowId) => css`
          &:nth-child(${isLastColumn ? rowCount : 0}n + ${++count}) {
            height: ${heightMap[rowId]};
          }
        `,
      )}
    `;
  });

  return css`
    flex: 0 0 auto;
    ${items}
  `;
};

const staticStyle = css`
  .column-drag-handle {
    visibility: hidden;
  }

  .app-columns {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
  }

  .wide {
    .compose-account {
      margin-right: 16px;
    }

    .is-minigrid {
      .compose-account {
        margin-right: 9px;
      }
    }
  }

  .compose-account {
    margin-right: 16px;
  }

  .is-minigrid {
    .compose-account {
      margin-right: 9px;
    }
  }
`;

export const StyleInjection = createGlobalStyle<{ profile: MultiRowProfile }>`
  ${ROOT_SELECTOR} {
    ${staticStyle}
    ${({ profile }) => createStyles(profile)}
    
  }
`;
