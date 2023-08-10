import type { IPointLike, IMatrix } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isArray, isNil, isNumber, Matrix } from '@visactor/vutils';
import type { CoordinateTransform, CoordinateType, IBaseCoordinate, IDimensionType } from './interface';

export abstract class Coordinate implements IBaseCoordinate {
  readonly type: CoordinateType;

  /** coordinate range start point */
  protected startPoint: IPointLike = { x: 0, y: 0 };
  /** coordinate range end point */
  protected endPoint: IPointLike = { x: 0, y: 0 };
  /** coordinate origin point */
  protected originPoint: IPointLike = { x: 0, y: 0 };
  /** coordinate range width */
  protected width: number = 0;
  /** coordinate range height */
  protected height: number = 0;

  /** coordinate transforms, such as translate / rotate / scale...  */
  protected transforms: CoordinateTransform[] = [];
  /** compute all coordinate transforms with single matrix */
  protected convertMatrix: IMatrix | null;
  protected invertMatrix: IMatrix | null;

  /** set start point */
  start(): IPointLike;
  start(point: IPointLike): this;
  start(point: [number, number]): this;
  start(x: number, y: number): this;
  start(x?: number | IPointLike | [number, number], y?: number) {
    if (isNil(x)) {
      return this.startPoint;
    }
    this.startPoint = this._parsePoint(x, y);
    this._updateSize();
    return this;
  }

  /** set end point */
  end(): IPointLike;
  end(point: IPointLike): this;
  end(point: [number, number]): this;
  end(x: number, y: number): this;
  end(x?: number | IPointLike | [number, number], y?: number) {
    if (isNil(x)) {
      return this.endPoint;
    }
    this.endPoint = this._parsePoint(x, y);
    this._updateSize();
    return this;
  }

  /** convert point from current coordinate into canvas coordinate */
  abstract convert(...args: any[]): any;
  /** convert point from canvas coordinate into current coordinate */
  abstract invert(...args: any[]): any;

  abstract getRangeByDimension(dim: IDimensionType, isSubshaft?: boolean, reversed?: boolean): [number, number];

  abstract getVisualPositionByDimension(dim: IDimensionType, isSubshaft?: boolean, reversed?: boolean): string;

  abstract getAxisPointsByDimension(
    dim: IDimensionType,
    isSubshaft?: boolean,
    reversed?: boolean,
    baseValue?: number
  ): [IPointLike, IPointLike] | null;

  protected _parsePoint(x: number | IPointLike | [number, number], y?: number) {
    const point: IPointLike = { x: 0, y: 0 };
    if (isArray(x)) {
      point.x = x[0];
      point.y = x[1];
    } else if (isNumber(x)) {
      point.x = x;
      point.y = y as number;
    } else {
      point.x = x.x;
      point.y = x.y;
    }
    return point;
  }

  protected _updateSize() {
    this.width = this.endPoint.x - this.startPoint.x;
    this.height = this.endPoint.y - this.startPoint.y;
  }

  isTransposed() {
    return this.transforms && this.transforms.filter(transform => transform.type === 'transpose').length % 2 !== 0;
  }

  isMainDimension(dim: IDimensionType) {
    let isMain = dim === 'x' || dim === 'theta' || dim === '0';

    if (this.isTransposed()) {
      isMain = !isMain;
    }

    return isMain;
  }

  /** apply coordinate transforms */
  applyTransforms(transforms: CoordinateTransform[]) {
    this.transforms = transforms.slice();
    this._invokeTransforms();
    return this;
  }

  protected _invokeTransforms() {
    this.invertMatrix = null;
    this.convertMatrix = null;
    this.invertMatrix = new Matrix();
    // origin point is handled by translate transform
    this.invertMatrix.translate(this.originPoint.x, this.originPoint.y);
    // multiply all coordinate transform matrix
    this.transforms.forEach(transform => {
      switch (transform.type) {
        case 'translate':
          this.invertMatrix.translate(transform.offset.x, transform.offset.y);
          break;
        case 'rotate':
          this.invertMatrix.rotateByCenter(transform.angle, this.originPoint.x, this.originPoint.y);
          break;
        case 'scale':
          this.invertMatrix.scale(transform.scale.x, transform.scale.y);
          break;
        case 'transpose':
          if (this.type !== 'polar') {
            this.invertMatrix.transpose();
          }
          break;
      }
    });
    this.invertMatrix;
    this.convertMatrix = this.invertMatrix.getInverse();
  }
}
