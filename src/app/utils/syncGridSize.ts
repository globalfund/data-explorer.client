import {
  RBReportItem,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";

type GridLikeData = ReportItemOf<"grid" | "column">;
type GridItem = RBReportItem;

const MIN_SIZE = 1;

const parseSize = (size: string | number | undefined, fallback = 0): number => {
  if (typeof size === "number") return size;
  if (typeof size === "string") {
    if (size.endsWith("%")) return Number(size.slice(0, -1));
    return isNaN(Number(size)) ? fallback : Number(size);
  }
  return fallback;
};

const toPercent = (value: number) => `${Number(value.toFixed(2))}%`;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getItemAt = (
  items: GridItem[],
  row: number,
  col: number,
  columns: number,
): GridItem | undefined => {
  return items[row * columns + col];
};

const getDefaultColumnWidth = (columns: number) => 100 / columns;

const getDefaultRowHeight = (rows: number) => 100 / rows;

const getColumnWidth = (
  items: GridItem[],
  columnIndex: number,
  columns: number,
): number => {
  const firstItemInColumn = items[columnIndex];
  return parseSize(
    firstItemInColumn?.options?.width,
    getDefaultColumnWidth(columns),
  );
};

const getRowHeight = (
  items: GridItem[],
  rowIndex: number,
  columns: number,
  rows: number,
): number => {
  const firstItemInRow = items[rowIndex * columns];
  return parseSize(firstItemInRow?.options?.height, getDefaultRowHeight(rows));
};

const setColumnWidth = (
  items: GridItem[],
  columnIndex: number,
  columns: number,
  rows: number,
  width: number,
) => {
  for (let row = 0; row < rows; row++) {
    const item = getItemAt(items, row, columnIndex, columns);
    if (!item) continue;

    item.options = {
      ...item.options,
      width: toPercent(width),
    };
  }
};

const setRowHeight = (
  items: GridItem[],
  rowIndex: number,
  columns: number,
  height: number,
) => {
  for (let col = 0; col < columns; col++) {
    const item = getItemAt(items, rowIndex, col, columns);
    if (!item) continue;

    item.options = {
      ...item.options,
      height: toPercent(height),
    };
  }
};

const syncColumnWidth = (
  items: GridItem[],
  itemColumn: number,
  requestedWidth: number,
  columns: number,
  rows: number,
) => {
  const nextColumnIndex = itemColumn + 1;
  const currentColumnWidth = getColumnWidth(items, itemColumn, columns);

  if (nextColumnIndex >= columns) {
    setColumnWidth(items, itemColumn, columns, rows, currentColumnWidth);
    return;
  }

  const nextColumnWidth = getColumnWidth(items, nextColumnIndex, columns);
  const totalWidth = currentColumnWidth + nextColumnWidth;

  const clampedCurrentWidth = clamp(
    requestedWidth,
    MIN_SIZE,
    totalWidth - MIN_SIZE,
  );

  const newNextWidth = totalWidth - clampedCurrentWidth;

  setColumnWidth(items, itemColumn, columns, rows, clampedCurrentWidth);
  setColumnWidth(items, nextColumnIndex, columns, rows, newNextWidth);
};

const syncRowHeight = (
  items: GridItem[],
  itemRow: number,
  requestedHeight: number,
  columns: number,
  rows: number,
) => {
  const nextRowIndex = itemRow + 1;
  const currentRowHeight = getRowHeight(items, itemRow, columns, rows);

  if (nextRowIndex >= rows) {
    setRowHeight(items, itemRow, columns, currentRowHeight);
    return;
  }

  const nextRowHeight = getRowHeight(items, nextRowIndex, columns, rows);
  const totalHeight = currentRowHeight + nextRowHeight;

  const clampedCurrentHeight = clamp(
    requestedHeight,
    MIN_SIZE,
    totalHeight - MIN_SIZE,
  );

  const newNextHeight = totalHeight - clampedCurrentHeight;

  setRowHeight(items, itemRow, columns, clampedCurrentHeight);
  setRowHeight(items, nextRowIndex, columns, newNextHeight);
};

export const syncGridSize = (
  prev: GridLikeData,
  newItem: RBReportItem,
  itemIndex: number,
): GridLikeData => {
  const columns = prev.data.columns || 1;
  const rows = prev.type === "grid" ? prev.data.rows || 1 : 1;

  const items = prev.data.items.map((item) =>
    item ? { ...item, options: { ...item.options } } : item,
  ) as GridItem[];

  const prevItem = items[itemIndex];
  if (!prevItem) {
    return {
      ...prev,
      data: {
        ...prev.data,
        items,
      },
    } as GridLikeData;
  }

  const itemColumn = itemIndex % columns;
  const itemRow = Math.floor(itemIndex / columns);

  const prevWidth = parseSize(
    prevItem.options?.width,
    getDefaultColumnWidth(columns),
  );
  const nextWidth = parseSize(newItem.options?.width, prevWidth);

  const prevHeight = parseSize(
    prevItem.options?.height,
    getDefaultRowHeight(rows),
  );
  const nextHeight = parseSize(newItem.options?.height, prevHeight);

  if (nextWidth !== prevWidth) {
    syncColumnWidth(items, itemColumn, nextWidth, columns, rows);
  }

  if (nextHeight !== prevHeight) {
    syncRowHeight(items, itemRow, nextHeight, columns, rows);
  }

  const { ...restOptions } = newItem.options || {};

  delete restOptions.width;
  delete restOptions.height;

  items[itemIndex] = {
    ...items[itemIndex],
    ...newItem,
    options: {
      ...items[itemIndex]?.options, // ← keeps clamped width/height
      ...restOptions, // ← only apply other props
    },
  };

  return {
    ...prev,
    data: {
      ...prev.data,
      items,
    },
  } as GridLikeData;
};
