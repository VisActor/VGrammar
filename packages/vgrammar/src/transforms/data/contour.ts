import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValid, isValidNumber } from '@visactor/vutils';
import type { ContourTransformOption } from '../../types';

type InteractionPoint = {
  id: string;
  currentCell: number;
  nextCell: number;
  point: IPointLike;
  siblingPoint: InteractionPoint;
};

const computeInteractionPoint = (
  xIndex: number,
  yIndex: number,
  cell: [number, number, number, number],
  cellRow: number,
  cellColumn: number,
  threshold: number
) => {
  const thresholdCell = [
    cell[0] >= threshold ? 1 : 0,
    cell[1] >= threshold ? 1 : 0,
    cell[2] >= threshold ? 1 : 0,
    cell[3] >= threshold ? 1 : 0
  ];

  const points: InteractionPoint[] = [];
  if (thresholdCell[0] !== thresholdCell[1]) {
    points.push({
      id: `${xIndex}-${yIndex - 1}-${xIndex}-${yIndex}`,
      currentCell: yIndex * cellColumn + xIndex,
      nextCell: (yIndex - 1) * cellColumn + xIndex,
      point: {
        x: xIndex + (threshold - cell[0]) / (cell[1] - cell[0]),
        y: yIndex
      },
      siblingPoint: null
    });
  }
  if (thresholdCell[1] !== thresholdCell[2]) {
    points.push({
      id: `${xIndex}-${yIndex}-${xIndex + 1}-${yIndex}`,
      currentCell: yIndex * cellColumn + xIndex,
      nextCell: yIndex * cellColumn + xIndex + 1,
      point: {
        x: xIndex + 1,
        y: yIndex + (threshold - cell[0]) / (cell[1] - cell[0])
      },
      siblingPoint: null
    });
  }
  if (thresholdCell[2] !== thresholdCell[3]) {
    points.push({
      id: `${xIndex}-${yIndex}-${xIndex}-${yIndex + 1}`,
      currentCell: yIndex * cellColumn + xIndex,
      nextCell: (yIndex + 1) * cellColumn + xIndex,
      point: {
        x: xIndex + (threshold - cell[0]) / (cell[1] - cell[0]),
        y: yIndex + 1
      },
      siblingPoint: null
    });
  }
  if (thresholdCell[3] !== thresholdCell[0]) {
    points.push({
      id: `${xIndex - 1}-${yIndex}-${xIndex}-${yIndex}`,
      currentCell: yIndex * cellColumn + xIndex,
      nextCell: yIndex * cellColumn + xIndex - 1,
      point: {
        x: xIndex,
        y: yIndex + (threshold - cell[0]) / (cell[1] - cell[0])
      },
      siblingPoint: null
    });
  }

  const thresholdFlag =
    (thresholdCell[0] & 0b1000) +
    (thresholdCell[1] & 0b0100) +
    (thresholdCell[2] & 0b0010) +
    (thresholdCell[3] & 0b0001);
  if (thresholdFlag === 0b0110 || thresholdFlag === 0b1001) {
    points[0].siblingPoint = points[1];
    points[1].siblingPoint = points[0];
    points[2].siblingPoint = points[3];
    points[3].siblingPoint = points[2];
  } else if (points.length === 2) {
    points[0].siblingPoint = points[1];
    points[1].siblingPoint = points[0];
  }
  return points;
};

const connectPoints = (point: InteractionPoint, grid: InteractionPoint[][]) => {
  const siblingPoint = point.siblingPoint;

  const connectResult = connectNextPoints(point, grid);
  if (connectResult.result === 'loop') {
    return connectResult.points;
  }
  const frontConnect = connectNextPoints(siblingPoint, grid);
  return frontConnect.points.reverse().concat(connectResult.points);
};

const connectNextPoints = (point: InteractionPoint, grid: InteractionPoint[][]) => {
  const connectedPoints: InteractionPoint[] = [];
  let currentPoint: InteractionPoint = point;
  const find = (p: InteractionPoint) => p.id === currentPoint.id;
  let result = 'loop';
  do {
    const nextCell = grid[currentPoint.nextCell];
    const nextCellPoint = nextCell?.find(find);
    if (nextCellPoint) {
      currentPoint = nextCellPoint.siblingPoint;
      if (connectedPoints.includes(currentPoint)) {
        result = 'break';
        break;
      }
      connectedPoints.push(currentPoint);
    } else {
      currentPoint = null;
    }
  } while (currentPoint);
  return { points: connectedPoints, result };
};

export const transform = (options: ContourTransformOption, upstreamData: any[]) => {
  if (!upstreamData || upstreamData.length === 0) {
    return upstreamData;
  }

  const row = options.row;
  const column = options.column;
  const cellRow = row - 1;
  const cellColumn = column - 1;

  const data = upstreamData.map(datum => datum[options.field]);
  const extent = [Math.min.apply(null, data), Math.max.apply(null, data)];
  const thresholds = options.thresholds ?? [];
  if (!isValid(options.thresholds) && isValidNumber(options.levels)) {
    const step = (extent[1] - extent[0]) / options.levels;
    for (let i = 1; i < options.levels; i++) {
      thresholds.push(extent[0] + i * step);
    }
  }

  // the cell value is stored like this:
  //  top-left, top-right, bottom-right, bottom-left
  //  tl - tr   O - X
  //  |     |   |
  //  bl - br   Y
  // the actually position in canvas does not effect the result of contouring
  const cells: [number, number, number, number][] = [];
  // data grid is row*column
  for (let yIndex = 1; yIndex < row; yIndex++) {
    for (let xIndex = 1; xIndex < column; xIndex++) {
      const topLeft = data[(yIndex - 1) * column + xIndex - 1];
      const topRight = data[(yIndex - 1) * column + xIndex];
      const bottomRight = data[yIndex * column + xIndex];
      const bottomLeft = data[yIndex * column + xIndex - 1];
      cells.push([topLeft, topRight, bottomRight, bottomLeft]);
    }
  }

  const contours: any[] = [];

  thresholds.forEach(threshold => {
    // compute intersection points
    const points: InteractionPoint[] = [];
    const gridPoints: InteractionPoint[][] = [];
    // cell grid is (row-1)*(column-1)
    for (let yIndex = 0; yIndex < cellRow; yIndex++) {
      for (let xIndex = 0; xIndex < cellColumn; xIndex++) {
        const cell = cells[yIndex * cellColumn + xIndex];
        const gridPoint = computeInteractionPoint(xIndex, yIndex, cell, cellRow, cellColumn, threshold);
        points.push(...gridPoint);
        gridPoints.push(gridPoint);
      }
    }

    // connect points
    let processingPoints = points.slice();
    do {
      const connectedPoints = connectPoints(processingPoints[0], gridPoints);
      processingPoints.splice(0, 1);
      if (connectedPoints.length) {
        const connectedPointIds = connectedPoints.map(point => point.id);
        processingPoints = processingPoints.filter(point => !connectedPointIds.includes(point.id));

        const contour = {
          [options.asThreshold ?? 'threshold']: threshold,
          [options.asPoints ?? 'points']: connectedPoints.map(point => {
            // normalize grid index into [0, 1]
            return {
              x: point.point.x / row,
              y: point.point.y / column
            };
          })
        };
        contours.push(contour);
      }
    } while (processingPoints.length > 0);
  });

  return contours;
};
