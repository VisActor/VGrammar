export interface IPoint {
  x: number;
  y: number;
}

export interface IVennCircle extends IPoint {
  radius: number;
  size?: number;
  setId?: VennCircleName;
  parent?: IVennCircle;
}

export interface IIntersectPoint extends IPoint {
  parentIndex?: number[];
  angle?: number;
}

export interface IVennArc {
  circle: IVennCircle;
  width: number;
  p1: IIntersectPoint;
  p2: IIntersectPoint;
}

export interface IVennAreaStats {
  area?: number;
  arcArea?: number;
  polygonArea?: number;
  arcs?: IVennArc[];
  innerPoints?: IPoint[];
  intersectionPoints?: IIntersectPoint[];
}

// eg. 'A', 'B'
export type VennCircleName = string;

// eg. 'A', 'B', 'A,B'
export type VennAreaName = string;

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
  p1: IPoint;
  p2: IPoint;
  radius: number;
  largeArcFlag: boolean;
  setId: VennCircleName;
}
