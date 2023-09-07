export type TagItemAttribute<T> = T | ((d?: any) => T);

export type TagItemFunction<T> = (d?: any) => T;

export type Bounds = [{ x: number; y: number }, { x: number; y: number }];
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export type FieldOption = { field: string };
export type CallbackOption = (datum: any) => any;
export type AsType = {
  x: string;
  y: string;
  fontFamily: string;
  fontSize: string;
  fontStyle: string;
  fontWeight: string;
  angle: string;
  opacity: string;
  visible: string;
  isFillingWord: string;
  color: string;
};
export type SegmentationInputType = {
  shapeUrl: string;
  size: [number, number];
  ratio: number;
  tempCanvas?: HTMLCanvasElement | any;
  tempCtx?: CanvasRenderingContext2D | null;
  removeWhiteBorder: boolean;
  boardSize: [number, number];
  random: boolean;
  randomGenerator?: any;
};
export type ShapeConfigType = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
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
  shapeConfig: ShapeConfigType;
  shapeBounds: ShapeBoundsType;
  shapeMaxR: number;
  shapeRatio: number;
  shapeCenter: number[];
  shapeArea: number;

  fillingInitialFontSize?: number;
  fillingDeltaFontSize?: number;
}
export type wordsConfigType = {
  getText: TagItemFunction<string>;
  getFontSize?: TagItemFunction<number>;
  fontSizeRange?: [number, number];

  colorMode: 'linear' | 'ordinal';
  getColor: TagItemFunction<string>;
  getFillingColor?: TagItemFunction<string>;
  colorList?: string[];
  getColorHex?: TagItemFunction<string>;

  getFontFamily: TagItemFunction<string>;
  rotateList: number[];
  getPadding: TagItemFunction<number>;
  getFontStyle: TagItemFunction<string>;
  getFontWeight: TagItemFunction<string>;
  getFontOpacity: TagItemFunction<number>;

  fontSizeScale?: TagItemFunction<number>;
  colorScale?: TagItemFunction<string>;
  fillingColorScale?: TagItemFunction<string>;
};
export type LayoutConfigType = {
  size: [number, number];
  ratio: number;

  shapeUrl: string;
  random: boolean;
  textLayoutTimes: number;
  removeWhiteBorder: boolean;
  layoutMode: 'default' | 'ensureMapping' | 'ensureMappingEnlarge';
  fontSizeShrinkFactor: number;
  stepFactor: number;
  importantWordCount: number;
  globalShinkLimit: number;
  fontSizeEnlargeFactor: number;

  fillingRatio: number;
  fillingTimes: number;
  fillingXStep: number;
  fillingYStep: number;
  fillingInitialFontSize?: number;
  fillingDeltaFontSize?: number;
  fillingInitialOpacity: number;
  fillingDeltaOpacity: number;

  getFillingFontFamily: TagItemFunction<string>;
  getFillingFontStyle: TagItemFunction<string>;
  getFillingFontWeight: TagItemFunction<string>;
  getFillingPadding: TagItemFunction<number>;
  fillingRotateList: number[];
  fillingDeltaFontSizeFactor: number;

  // fill color 相关
  fillingColorList: string[];

  // 经过计算，补充的内容
  sameColorList: boolean;
  board?: number[];

  minInitFontSize: number;
  minFontSize: number;
  minFillFoontSize: number;
};
export type CloudWordType = {
  x: number;
  y: number;
  weight: number;
  text: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  rotate: number;
  fontSize: number;
  opacity: number;
  padding: number;
  color: string;
  fillingColor: string;
  datum: any;
  visible: boolean;
  hasPlaced: boolean;

  wordSize?: [number, number];
  bounds?: any;
  hasText?: boolean;
  sprite?: number[];
  LT?: [number, number]; // 左上角点
};
