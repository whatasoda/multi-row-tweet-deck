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
    columns: Record<string, ColumnProfile>;
    columnOrder: string[];
  };
}

interface ColumnProfile extends ColumnProfileInit {
  readonly id: string;
  rows: Record<string, RowProfile>;
  rowOrder: string[];
}
interface ColumnProfileInit {
  width: number;
}

interface RowProfile extends RowProfileInit {
  readonly columnId: string;
  readonly id: string;
}
interface RowProfileInit {
  height: number;
}
