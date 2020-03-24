export type ColumnStyle = Required<Pick<CSSObject, 'width'>>;
export type RowStyle = Required<Pick<CSSObject, 'height'>>;

export const createColumnStyle = ({ rowOrder, rows, width }: ColumnProfile, headerHeight: number, gap: number) => {
  const rowCount = rowOrder.length;
  const staticHeight = gap * (rowCount - 1) + headerHeight * rowCount;

  const columnStyle: ColumnStyle = {
    width: `${width}px`,
  };

  const rowStyles = rowOrder.reduce<Record<string, RowStyle>>((acc, rowId) => {
    const { height: pct } = rows[rowId];
    acc[rowId] = {
      height: `calc(${headerHeight}px + (100% - ${staticHeight}px) * ${pct / 100})`,
    };
    return acc;
  }, {});

  return [columnStyle, rowStyles] as const;
};
