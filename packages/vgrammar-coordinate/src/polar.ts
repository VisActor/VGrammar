import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import {
  clampRadian,
  isNumberClose,
  isValidNumber,
  isNil,
  polarToCartesian,
  isArray,
  minInArray,
  maxInArray
} from '@visactor/vutils';
import { Coordinate } from './base';
import type { IPolarCoordinate, IDimensionType, IPolarPointLike } from './interface';

export class PolarCoordinate extends Coordinate implements IPolarCoordinate {
  readonly type = 'polar';

  private _isUserOrigin: boolean = false;
  private _isUserRadius: boolean = false;
  protected startAngle: number = 0;
  protected endAngle: number = 2 * Math.PI;
  protected innerRadius: number = 0;
  protected outerRadius: number = 0;

  private _updateStartEndPoint() {
    const origin = this.origin();
    const minAngle = Math.min(this.startAngle, this.endAngle);
    const maxAngle = Math.max(this.startAngle, this.endAngle);
    const init0 = (2 * minAngle) / Math.PI;
    const init1 = (2 * maxAngle) / Math.PI;
    const angles = [minAngle, maxAngle];
    let i = Math.ceil(init0);

    while (i <= init1) {
      angles.push((i * Math.PI) / 2);
      i++;
    }
    const len = angles.length;
    const xs: number[] = [];
    const ys: number[] = [];

    for (i = 0; i < len; i++) {
      const p0 = polarToCartesian(origin, this.innerRadius, angles[i]);
      const p1 = polarToCartesian(origin, this.outerRadius, angles[i]);

      xs.push(p0.x);
      xs.push(p1.x);
      ys.push(p0.y);
      ys.push(p1.y);
    }
    const minX = minInArray(xs);
    const minY = minInArray(ys);

    const maxX = maxInArray(xs);
    const maxY = maxInArray(ys);

    this.startPoint = { x: minX, y: minY };
    this.endPoint = { x: maxX, y: maxY };
  }

  protected _updateSize() {
    super._updateSize();

    if (!this._isUserOrigin) {
      this.originPoint = { x: this.width / 2, y: this.height / 2 };
      this._invokeTransforms();
    }

    if (!this._isUserRadius) {
      this.outerRadius = Math.min(
        Math.abs(this.startPoint.x - this.originPoint.x),
        Math.abs(this.endPoint.x - this.originPoint.x),
        Math.abs(this.startPoint.y - this.originPoint.y),
        Math.abs(this.endPoint.y - this.originPoint.y)
      );
    }
  }

  angle(): [number, number];
  angle(startAngle: number, endAngle: number): this;
  angle(angle: [number, number]): this;
  angle(angle?: [number, number] | number, endAngle?: number) {
    if (isNil(angle)) {
      return [this.startAngle, this.endAngle];
    }
    if (Array.isArray(angle)) {
      this.startAngle = angle[0];
      this.endAngle = angle[1];
    } else {
      this.startAngle = angle;
      this.endAngle = endAngle ?? angle;
    }

    this._updateStartEndPoint();
    return this;
  }

  radius(): [number, number];
  radius(innerRadius: number, outerRadius: number): this;
  radius(radius: [number, number]): this;
  radius(radius?: [number, number] | number, outerRadius?: number) {
    if (isNil(radius)) {
      return [this.innerRadius, this.outerRadius];
    }
    this._isUserRadius = true;
    if (Array.isArray(radius)) {
      this.innerRadius = Math.min(radius[0], radius[1]);
      this.outerRadius = Math.max(radius[1], radius[1]);
    } else {
      this.innerRadius = Math.min(radius, outerRadius);
      this.outerRadius = Math.max(radius, outerRadius);
    }

    this._updateStartEndPoint();
    return this;
  }

  /** set origin point */
  origin(): IPointLike;
  origin(point: IPointLike): this;
  origin(point: [number, number]): this;
  origin(x: number, y: number): this;
  origin(x?: number | IPointLike | [number, number], y?: number) {
    if (isNil(x)) {
      return this.originPoint;
    }
    this._isUserOrigin = true;
    this.originPoint = this._parsePoint(x, y);
    this._updateStartEndPoint();
    // TODO: maybe use dirty flag to update matrix instead
    this._invokeTransforms();
    return this;
  }

  convert(point: IPolarPointLike | IPointLike | [number, number]): IPointLike {
    if (isValidNumber((point as IPolarPointLike).r1) || isValidNumber((point as IPolarPointLike).theta1)) {
      const convertedPoint = this.convertPoint(point as IPolarPointLike);
      const convertedPoint1 = this.convertPoint({
        r: (point as IPolarPointLike).r1 ?? (point as IPolarPointLike).r,
        theta: (point as IPolarPointLike).theta1 ?? (point as IPolarPointLike).theta
      });
      convertedPoint.x1 = convertedPoint1.x;
      convertedPoint.y1 = convertedPoint1.y;
      return convertedPoint;
    } else if (isValidNumber((point as IPointLike).x1) || isValidNumber((point as IPointLike).y1)) {
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

  invert(point: IPointLike): IPolarPointLike {
    if (isValidNumber(point.x1) || isValidNumber(point.y1)) {
      const invertedPoint = this.invertPoint(point);
      const invertedPoint1 = this.invertPoint({ x: point.x1 ?? point.x, y: point.y1 ?? point.y });
      invertedPoint.r1 = invertedPoint1.r;
      invertedPoint.theta1 = invertedPoint1.theta;
      return invertedPoint;
    }
    return this.invertPoint(point);
  }

  /**
   *
   * @param dim        dim: 'x' | 'theta', associated to the angle, dim: 'y' | 'r', associated to the radius
   * @param isSubshaft
   * @param reversed
   * @returns
   */
  getRangeByDimension(dim: IDimensionType, isSubshaft?: boolean, reversed?: boolean): [number, number] {
    const isAngle = this.isMainDimension(dim);
    const res: [number, number] = isAngle ? [this.startAngle, this.endAngle] : [this.innerRadius, this.outerRadius];

    return reversed ? [res[1], res[0]] : res;
  }

  getVisualPositionByDimension(dim: IDimensionType, isSubshaft?: boolean, reversed?: boolean) {
    const isAngle = this.isMainDimension(dim);

    return isAngle ? (isSubshaft ? 'inside' : 'outside') : isSubshaft ? 'end' : 'start';
  }

  getAxisPointsByDimension(
    dim: IDimensionType,
    isSubshaft?: boolean,
    reversed?: boolean,
    baseValue?: number
  ): [IPointLike, IPointLike] {
    const isAngle = this.isMainDimension(dim);

    if (!isAngle) {
      const origin = this.origin();
      const res: [IPointLike, IPointLike] = !isNil(baseValue)
        ? [polarToCartesian(origin, this.innerRadius, baseValue), polarToCartesian(origin, this.outerRadius, baseValue)]
        : isSubshaft
        ? [
            polarToCartesian(origin, this.innerRadius, this.endAngle),
            polarToCartesian(origin, this.outerRadius, this.endAngle)
          ]
        : [
            polarToCartesian(origin, this.innerRadius, this.startAngle),
            polarToCartesian(origin, this.outerRadius, this.startAngle)
          ];

      return reversed ? [res[1], res[0]] : res;
    }

    return null;
  }

  private convertPoint(point: IPolarPointLike | IPointLike | [number, number]) {
    const isTransposed = this.isTransposed();
    let theta: number;
    let r: number;

    if (!isNil((point as IPolarPointLike).r) && !isNil((point as IPolarPointLike).theta)) {
      theta = isTransposed ? (point as IPolarPointLike).r : (point as IPolarPointLike).theta;
      r = isTransposed ? (point as IPolarPointLike).theta : (point as IPolarPointLike).r;
    } else if (isArray(point)) {
      theta = isTransposed ? (point as [number, number])[0] : (point as [number, number])[1];
      r = isTransposed ? (point as [number, number])[1] : (point as [number, number])[0];
    } else {
      theta = isTransposed ? (point as IPointLike).y : (point as IPointLike).x;
      r = isTransposed ? (point as IPointLike).x : (point as IPointLike).y;
    }

    const convertedPoint: IPointLike = {
      x: Math.cos(theta) * r,
      y: Math.sin(theta) * r
    };
    if ((point as IPointLike).defined === false) {
      convertedPoint.defined = false;
    }
    const transformedPoint = Object.assign({}, convertedPoint);
    this.convertMatrix.transformPoint(convertedPoint, transformedPoint);

    return transformedPoint;
  }

  private invertPoint(point: IPointLike): IPolarPointLike {
    const untransformedPoint = Object.assign({}, point);
    this.invertMatrix.transformPoint(point, untransformedPoint);

    const cos = untransformedPoint.x;
    const sin = untransformedPoint.y;
    if (isNumberClose(cos, 0) && isNumberClose(sin, 0)) {
      const invertedPoint: IPolarPointLike = { r: 0, theta: 0 };
      if (untransformedPoint.defined === false) {
        invertedPoint.defined = false;
      }
      return invertedPoint;
    }

    let theta = Math.atan(sin / cos);
    if (cos >= 0) {
      theta += Math.PI * 2;
    } else {
      theta += Math.PI;
    }
    // when theta is Math.PI*2, it should be set to zero
    if (theta >= Math.PI * 2) {
      theta -= Math.PI * 2;
    }
    theta = clampRadian(theta);
    const radius = isNumberClose(sin, 0) ? cos / Math.cos(theta) : sin / Math.sin(theta);
    const invertedPoint: IPolarPointLike = this.isTransposed()
      ? {
          r: theta,
          theta: radius
        }
      : {
          r: radius,
          theta
        };

    if (untransformedPoint.defined === false) {
      invertedPoint.defined = false;
    }
    return invertedPoint;
  }
}
