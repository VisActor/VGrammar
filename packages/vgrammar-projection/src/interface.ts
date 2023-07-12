import type { GenericFunctionType, IGrammarBase } from '@visactor/vgrammar';

export interface IProjection extends IGrammarBase {
  grammarType: 'projection';
}

export interface GeometryData {
  type: 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon' | 'GeometryCollection';
  coordinates?: [number, number] | [number, number][];
  arcs?: number[][];
}

export interface FeatureData {
  type: 'Feature';
  geometry: GeometryData[];
  properties: Record<string, any>;
}

export interface FeatureCollectionData {
  type: 'FeatureCollection';
  features: FeatureData[];
}

export type ProjectionFunctionCallback<T> = (projection: any, parameters: any) => T;

export type ProjectionFunctionType<T> = GenericFunctionType<ProjectionFunctionCallback<T>, T>;

export interface ProjectionSpec {
  type: string;
  name?: string;
  pointRadius?: ProjectionFunctionType<number>;
  extent?: ProjectionFunctionType<[[number, number], [number, number]]>;
  fit?: ProjectionFunctionType<
    FeatureCollectionData | FeatureCollectionData[] | FeatureData | FeatureData[] | GeometryData | GeometryData[]
  >;
  size?: ProjectionFunctionType<[number, number]>;

  // standard properties in d3-geo

  clipAngle?: ProjectionFunctionType<number>;
  clipExtent?: ProjectionFunctionType<[number, number]>;
  scale?: ProjectionFunctionType<number>;
  translate?: ProjectionFunctionType<[number, number]>;
  center?: ProjectionFunctionType<[number, number]>;
  rotate?: ProjectionFunctionType<[number, number] | [number, number, number]>;
  parallels?: ProjectionFunctionType<[number, number]>;
  precision?: ProjectionFunctionType<number>;
  reflectX?: ProjectionFunctionType<boolean>;
  reflectY?: ProjectionFunctionType<number>;

  // extended properties in d3-geo-projections

  coefficient?: ProjectionFunctionType<number>;
  distance?: ProjectionFunctionType<number>;
  fraction?: ProjectionFunctionType<number>;
  lobes?: ProjectionFunctionType<number>;
  parallel?: ProjectionFunctionType<number>;
  radius?: ProjectionFunctionType<number>;
  ratio?: ProjectionFunctionType<number>;
  spacing?: ProjectionFunctionType<number>;
  tilt?: ProjectionFunctionType<number>;
}
