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
