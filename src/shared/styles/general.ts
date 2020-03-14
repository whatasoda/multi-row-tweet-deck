import { HEADER_HEIGHT } from '../constants';
import { css } from 'styled-components';

export interface GeneralStyles extends Partial<Record<OneOfTDClassName, Style>> {}

export const createGeneralStyles = ({ drawer, header }: MultiRowProfile, vanilla: VanillaTweetDeck): GeneralStyles => {
  const drawerDiff = vanilla.drawerWidth - drawer.width;
  const headerHeight = HEADER_HEIGHT[header.height];

  const headerTransform = `translateY(${(headerHeight - vanilla.headerHeight) / 2}px)`;

  return {
    appContent: css`
      margin-left: ${-drawerDiff}px;
      &:not(.is-open) {
        margin-left: 0;
      }
    `,
    drawer: css`
      width: ${drawer.width}px;
      left: ${-drawer.width}px;
    `,
    // columnsContainer: css``,
    // columns: css``,
    columnHeader: css`
      height: ${headerHeight}px;
      max-height: ${headerHeight}px;
      line-height: ${headerHeight}px;
    `,
    columnHeaderTitle: css`
      transform: ${headerTransform};
    `,
    columnTitleBackIcon: css`
      transform: ${headerTransform};
    `,
  };
};
