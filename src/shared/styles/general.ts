import { HEADER_HEIGHT } from '../constants';

export interface GeneralStyles extends Readonly<ReturnType<typeof createGeneralStyles>> {}

export const createGeneralStyles = ({ drawer, header }: MultiRowProfile, vanilla: VanillaTweetDeck) => {
  const drawerDiff = vanilla.drawerWidth - drawer.width;
  const headerHeight = HEADER_HEIGHT[header.height];

  const headerTransform = `translateY(${(headerHeight - vanilla.headerHeight) / 2}px)`;

  return helper({
    appContent: {
      marginLeft: `${-drawerDiff}px`,
      '&:not(.is-open)': {
        marginLeft: 0,
      },
    },
    drawer: {
      width: `${drawer.width}px`,
      left: `${-drawer.width}px`,
    },
    // columnsContainer: {},
    // columns: {},
    columnHeader: {
      height: `${headerHeight}px`,
      maxHeight: `${headerHeight}px`,
      lineHeight: `${headerHeight}px`,
    },
    columnHeaderTitle: {
      transform: headerTransform,
    },
    columnTitleBackIcon: {
      transform: headerTransform,
    },
  });
};

type Expected = Partial<Record<OneOfTDClassName, CSSObject>>;
const helper = <T extends Expected>(styles: T & Expected): T => styles;
