import type { ICircle, IPointLike } from '@visactor/vutils';

// eg. 'A', 'B'
export type VennCircleName = string;

// eg. 'A', 'B', 'A,B'
export type VennAreaName = string;

export interface IVennCircle extends ICircle {
  setId: VennCircleName;
  parent?: IVennCircle;
}

export interface IVennArea {
  sets: VennCircleName[];
  size: number;
  weight?: number;
  label?: string;
}

export interface IVennSingleArea {
  set: VennCircleName;
  size: number;
  weight?: number;
}

export interface IVennParams {
  maxIterations?: number;
  initialLayout?: (areas: IVennArea[], params: IVennParams) => Record<VennCircleName, IVennCircle>;
  lossFunction?: (sets: Record<VennCircleName, IVennCircle>, overlaps: IVennArea[]) => number;
  restarts?: number;
  history?: any;
}

export interface ICluster extends Array<IVennCircle> {
  size?: number;
  bounds?: {
    xRange: {
      max: number;
      min: number;
    };
    yRange: {
      max: number;
      min: number;
    };
  };
}

export interface IVennOverlapArc {
  p1: IPointLike;
  p2: IPointLike;
  radius: number;
  largeArcFlag: boolean;
  setId: VennCircleName;
}
