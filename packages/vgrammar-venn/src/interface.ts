import type { IPoint } from '@visactor/vutils';
import type { IVennParams, VennCircleName } from './utils/interface';

export interface IVennTransformOptions extends IVennParams {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  orientation?: number;
  orientationOrder?: any;
}

export interface IVennTransformMarkOptions {
  datumType: 'circle' | 'overlap';
}

export interface IVennCircleDatum extends IPoint, IVennLabelDatum {
  type: 'circle';
  sets: VennCircleName[];
  size: number;
  radius: number;
}

export interface IVennOverlapDatum extends IVennLabelDatum {
  type: 'overlap';
  sets: VennCircleName[];
  size: number;
}

export interface IVennLabelDatum {
  labelX: number;
  labelY: number;
  label?: string;
}
