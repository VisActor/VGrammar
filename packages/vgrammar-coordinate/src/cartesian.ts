import type { IPointLike } from '@visactor/vutils';
import { isArray } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValidNumber, isNil } from '@visactor/vutils';
import { Coordinate } from './base';
import type { ICartesianCoordinate, IDimensionType } from './interface';

export class CartesianCoordinate extends Coordinate implements ICartesianCoordinate {
  readonly type = 'cartesian';

  convert(point: IPointLike | [number, number]): IPointLike {
    if (isValidNumber((point as IPointLike).x1) || isValidNumber((point as IPointLike).y1)) {
      const convertedPoint = this.convertPoint(point as IPointLike);
      const convertedPoint1 = this.convertPoint({
        x: (point as IPointLike).x1 ?? (point as IPointLike).x,
        y: (point as IPointLike).y1 ?? (point as IPointLike).y
      });
      convertedPoint.x1 = convertedPoint1.x;
      convertedPoint.y1 = convertedPoint1.y;
      return convertedPoint;
    }
    return this.convertPoint(point);
  }

  invert(point: IPointLike): IPointLike {
    if (isValidNumber(point.x1) || isValidNumber(point.y1)) {
      const invertedPoint = this.invertPoint(point);
      const invertedPoint1 = this.invertPoint({ x: point.x1 ?? point.x, y: point.y1 ?? point.y });
      invertedPoint.x1 = invertedPoint1.x;
      invertedPoint.y1 = invertedPoint1.y;
      return invertedPoint;
    }
    return this.invertPoint(point);
  }

  getRangeByDimension(dim: IDimensionType, isSubshaft?: boolean, reversed?: boolean): [number, number] {
    const start = this.start();
    const end = this.end();
    const isMain = this.isMainDimension(dim);

    const res: [number, number] = isMain ? [start.x, end.x] : [end.y, start.y];

    return reversed ? [res[1], res[0]] : res;
  }

  getVisualPositionByDimension(dim: IDimensionType, isSubshaft?: boolean, reversed?: boolean) {
    const isMain = this.isMainDimension(dim);

    return isMain ? (isSubshaft ? 'top' : 'bottom') : isSubshaft ? 'right' : 'left';
  }

  getAxisPointsByDimension(
    dim: IDimensionType,
    isSubshaft?: boolean,
    reversed?: boolean,
    baseValue?: number
  ): [IPointLike, IPointLike] {
    const start = this.start();
    const end = this.end();
    const isMain = this.isMainDimension(dim);

    if (isMain) {
      const res: [IPointLike, IPointLike] = !isNil(baseValue)
        ? [
            { x: start.x, y: baseValue },
            { x: end.x, y: baseValue }
          ]
        : isSubshaft
        ? [
            { x: start.x, y: start.y },
            { x: end.x, y: start.y }
          ]
        : [
            { x: start.x, y: end.y },
            { x: end.x, y: end.y }
          ];

      return reversed ? [res[1], res[0]] : res;
    }

    const res: [IPointLike, IPointLike] = !isNil(baseValue)
      ? [
          { x: baseValue, y: end.y },
          { x: baseValue, y: start.y }
        ]
      : isSubshaft
      ? [
          { x: end.x, y: end.y },
          { x: end.x, y: start.y }
        ]
      : [
          { x: start.x, y: end.y },
          { x: start.x, y: start.y }
        ];

    return reversed ? [res[1], res[0]] : res;
  }

  private convertPoint(point: IPointLike | [number, number]) {
    const originPoint = isArray(point) ? ({ x: point[0], y: point[1] } as IPointLike) : (point as IPointLike);

    const transformedPoint = Object.assign({}, originPoint);
    this.convertMatrix.transformPoint(originPoint, transformedPoint);
    return transformedPoint;
  }

  private invertPoint(point: IPointLike): IPointLike {
    const untransformedPoint = Object.assign({}, point);
    this.invertMatrix.transformPoint(point, untransformedPoint);
    return untransformedPoint;
  }
}
