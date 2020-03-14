type OneOfHeaderHeight = keyof typeof import('../constants')['HEADER_HEIGHT'];

interface VanillaTweetDeck {
  drawerWidth: number;
  headerHeight: number;
}

interface MultiRowProfile {
  readonly id: string;
  displayName: string;
  drawer: {
    width: number;
  };
  header: {
    height: OneOfHeaderHeight;
  };
  cells: {
    gap: number;
    columns: Record<string, Column>;
    columnOrder: string[];
  };
}

interface Column extends ColumnInit {
  readonly id: string;
  rows: Record<string, Row>;
  rowOrder: string[];
}
interface ColumnInit {
  width: number;
}

interface Row extends RowInit {
  readonly columnId: string;
  readonly id: string;
}
interface RowInit {
  height: number;
}
