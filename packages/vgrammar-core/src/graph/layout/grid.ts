import type { IBounds } from '@visactor/vutils';
import { Bounds, isValidNumber } from '@visactor/vutils';
import type { IGroupMark, ILayoutOptions, IMark, MarkGridItemSpec, MarkGridContainerSpec } from '../../types';

interface IGrid {
  rows: number[];
  columns: number[];
  rowGap: number;
  columnGap: number;
}

function parseTemplate(template: number | string | 'auto', total: number) {
  if (isValidNumber(template)) {
    return template;
  }
  const trimmedTemplate = template.trim();
  if (trimmedTemplate === 'auto') {
    // handle auto later
    return 0;
  } else if (trimmedTemplate.endsWith('%')) {
    const percent = parseFloat(trimmedTemplate.substring(0, trimmedTemplate.length - 1));
    if (isValidNumber(percent)) {
      return percent * total;
    }
    return 0;
  }
  return 0;
}

function computeGrid(layout: MarkGridContainerSpec, width: number, height: number): IGrid {
  const templateRows = layout.gridTemplateRows ?? [height];
  const templateColumns = layout.gridTemplateColumns ?? [width];
  const rowGap = layout.gridRowGap ?? 0;
  const columnGap = layout.gridColumnGap ?? 0;

  // compute simple cell size
  const rows = templateRows.map(row => parseTemplate(row, height));
  const columns = templateColumns.map(column => parseTemplate(column, width));

  // compute auto grid
  const rowLeftSize = Math.max(0, rows.reduce((left, row) => left - row, height) - rows.length * rowGap);
  const rowAuto = rowLeftSize / templateRows.filter(row => row === 'auto').length;
  const columnLeftSize = Math.max(
    0,
    columns.reduce((left, column) => left - column, width) - columns.length * columnGap
  );
  const columnAuto = columnLeftSize / templateColumns.filter(column => column === 'auto').length;
  // accumulate grid size
  let lastRow = 0;
  const accumulateRows = rows.map((row, index) => {
    const finalRow = templateRows[index] === 'auto' ? rowAuto : row;
    const last = lastRow;
    lastRow += finalRow + rowGap;
    return last;
  });
  accumulateRows.push(lastRow);
  let lastColumn = 0;
  const accumulateColumns = columns.map((column, index) => {
    const finalColumn = templateColumns[index] === 'auto' ? columnAuto : column;
    const last = lastColumn;
    lastColumn += finalColumn + columnGap;
    return last;
  });
  accumulateColumns.push(lastColumn);

  return {
    rows: accumulateRows,
    columns: accumulateColumns,
    rowGap,
    columnGap
  };
}

function normalizeIndex(index: number, count: number) {
  return Math.min(index < 0 ? index + count : index - 1, count);
}

function normalizeStartEndIndex(start: number, end: number, count: number) {
  let finalStart = normalizeIndex(start, count);
  let finalEnd = normalizeIndex(end, count);
  if (!isValidNumber(start) && !isValidNumber(end)) {
    finalStart = 1;
    finalEnd = 2;
  } else if (!isValidNumber(start)) {
    finalEnd = normalizeIndex(finalStart + 1, count);
  } else if (!isValidNumber(end)) {
    finalStart = normalizeIndex(Math.max(0, finalEnd - 1), count);
  }
  if (finalStart > finalEnd) {
    const temp = finalEnd;
    finalEnd = finalStart;
    finalStart = temp;
  }
  return { start: finalStart, end: finalEnd };
}

function getCellBounds(grid: IGrid, rowStart: number, rowEnd: number, columnStart: number, columnEnd: number): Bounds {
  const rowCount = grid.rows.length;
  const columnCount = grid.columns.length;
  const { start: finalRowStart, end: finalRowEnd } = normalizeStartEndIndex(rowStart, rowEnd, rowCount);
  const { start: finalColumnStart, end: finalColumnEnd } = normalizeStartEndIndex(columnStart, columnEnd, columnCount);

  const x1 = grid.columns[finalRowStart];
  const x2 = grid.columns[finalRowEnd] - (finalColumnEnd === columnCount ? 0 : grid.columnGap);
  const y1 = grid.rows[finalColumnStart];
  const y2 = grid.rows[finalColumnEnd] - (finalRowEnd === rowCount ? 0 : grid.rowGap);
  return new Bounds().set(x1, y1, x2, y2);
}

export const doGridLayout = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: IBounds,
  options?: ILayoutOptions
) => {
  const layout = group.getSpec().layout as MarkGridContainerSpec;
  const grid = computeGrid(layout, parentLayoutBounds.width(), parentLayoutBounds.height());
  if (children) {
    children.forEach(mark => {
      const markLayout = mark.getSpec().layout as MarkGridItemSpec;
      mark.layoutBounds = getCellBounds(
        grid,
        markLayout.gridRowStart,
        markLayout.gridRowEnd,
        markLayout.gridColumnStart,
        markLayout.gridColumnEnd
      );
      mark.commit();
    });
  }
};
