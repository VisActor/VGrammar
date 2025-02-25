import type { GeometricMaskShape, TextShapeMask } from './wordcloud';

export type SegmentationInputType = {
  shapeUrl: string | TextShapeMask | GeometricMaskShape;
  size: [number, number];
  ratio: number;
  blur?: number;
  maskCanvas?: HTMLCanvasElement;
  tempCanvas?: HTMLCanvasElement | any;
  boardSize: [number, number];
  random: boolean;
  randomGenerator?: any;
  isEmptyPixel?: (imageData: ImageData, i: number, j: number) => boolean;
};

export type segmentationType = {
  regions: any;
  labels: number[];
  labelNumber: number;
};
export type ShapeBoundsType = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  width: number;
  height: number;
};

export interface SegmentationOutputType extends SegmentationInputType {
  segmentation: segmentationType;
  shapeBounds: ShapeBoundsType;
  shapeMaxR: number;
  shapeRatio: number;
  shapeCenter: number[];
  shapeArea: number;
}
