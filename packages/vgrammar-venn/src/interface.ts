import type { IVennArea, IVennParams } from './utils/interface';

export interface IVennTransformOptions extends IVennParams {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  setField?: string;
  valueField?: string;
  orientation?: number;
  orientationOrder?: any;
}

export interface IVennTransformMarkOptions {
  datumType: 'circle' | 'overlap';
}

export interface IVennCommonDatum extends IVennArea, IVennLabelDatum {
  datum: any;
  x: number;
  y: number;
}

export interface IVennCircleDatum extends IVennCommonDatum {
  type: 'circle';
  radius: number;
}

export interface IVennOverlapDatum extends IVennCommonDatum {
  type: 'overlap';
  path: string;
}

export interface IVennLabelDatum {
  labelX?: number;
  labelY?: number;
}
