import type { ScaleSpec } from './scale';
import type { TransformSpec } from './transform';
import type {
  AxisBaseAttributes,
  BaseCrosshairAttrs,
  BaseLabelAttrs,
  ColorLegendAttributes,
  DataZoomAttributes,
  DiscreteLegendAttrs,
  PlayerAttributes,
  SizeLegendAttributes,
  SliderAttributes
} from '@visactor/vrender-components';
import type { BasicEncoderSpecMap, MarkRelativeItemSpec } from './mark';
import type { IEnvironmentOptions, IRendererOptions, ViewSpec, srIOption3DType } from './view';
import type { CommonPaddingSpec, ValueOf } from './base';
import type { DataSpec } from './data';
import type { IAnimationConfig } from './animate';
import type { CoordinateType } from '@visactor/vgrammar-coordinate';
import type { IColor } from '@visactor/vrender';
import type { BaseEventHandler } from './event';

export interface IPlotOptions extends IEnvironmentOptions, IRendererOptions {
  width?: number;
  height?: number;
  padding?: CommonPaddingSpec;
  autoFit?: boolean;
  options3d?: srIOption3DType;
  theme?: string;
}

export interface CartesianCoordinateOption {
  id?: string;
  type: 'cartesian';
  transpose?: boolean;
}

export interface PolarCoordinateOption {
  id?: string;
  type: 'polar';
  origin?: [string | number, string | number];
  transpose?: boolean;
}

export type PlotAreaEncoderSpec = Omit<BasicEncoderSpecMap['area'], 'x' | 'y'> & {
  x?: number | number[];
  y?: number | number[];
};

export type CoordinateOption = CartesianCoordinateOption | PolarCoordinateOption;
export type PlotIntervalSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['interval'], IntervalEncodeChannels>> & {
  type: 'interval';
};
export type PlotLineSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['line'], LineEncodeChannels>> & {
  type: 'line';
};
export type PlotCellSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['cell'], CellEncodeChannels>> & {
  type: 'cell';
};
export type PlotRuleXSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['rule'], RuleXEncodeChannels>> & {
  type: 'ruleX';
};
export type PlotRuleYSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['rule'], RuleYEncodeChannels>> & {
  type: 'ruleY';
};
export type PlotAreaSpec = Partial<ISemanticMarkSpec<PlotAreaEncoderSpec, AreaEncodeChannels>> & {
  type: 'area';
};
export type PlotPointSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['symbol'], PointEncodeChannels>> & {
  type: 'point';
};
export type PlotTextSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['text'], TextEncodeChannels>> & {
  type: 'point';
};
export type PlotRectSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['rect'], RectEncodeChannels>> & {
  type: 'point';
};
export type PlotRectXSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['rect'], RectXEncodeChannels>> & {
  type: 'point';
};
export type PlotRectYSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['rect'], RectYEncodeChannels>> & {
  type: 'point';
};
export type PlotPolygonSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['polygon'], PolygonEncodeChannels>> & {
  type: 'point';
};
export type PlotRuleSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['rule'], RuleEncodeChannels>> & {
  type: 'point';
};
export type PlotImageSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['image'], ImageEncodeChannels>> & {
  type: 'point';
};
export type PlotPathSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['path'], PathEncodeChannels>> & {
  type: 'point';
};

export interface PlotSpec {
  background?: IColor;
  width?: number;
  height?: number;
  padding?: number;
  coordinate?: CoordinateOption;
  marks?: Array<
    | PlotIntervalSpec
    | PlotLineSpec
    | PlotCellSpec
    | PlotRuleXSpec
    | PlotRuleYSpec
    | PlotAreaSpec
    | PlotPointSpec
    | PlotTextSpec
    | PlotRectSpec
    | PlotRectXSpec
    | PlotRectYSpec
    | PlotPolygonSpec
    | PlotRuleSpec
    | PlotImageSpec
    | PlotPathSpec
  >;
}

export interface IPlot {
  /**
   * todo: 直接接text图元还是title组件
   */
  // title: (text: ITextAttribute['text'], style: Omit<ITextAttribute, 'text'>) => this;
  coordinate: (type: CoordinateType, option?: Omit<CoordinateOption, 'type'>) => this;
  // interaction: (type: string, options: boolean | any) => this;

  // facet: (type: string, options: any) => this;

  ///--------- life cycle ---------///

  render: () => this;
  release: () => this;
  parseSpec: (spec: PlotSpec) => this;
  updateSpec: (spec: PlotSpec) => this;
  getImageBuffer: () => Buffer;

  ///--------- events api ---------///
  on: (type: string, handler: BaseEventHandler) => this;
  off: (type: string, handler?: BaseEventHandler) => this;

  ///--------- marks ---------///

  interval: () => IInterval;
  cell: () => ICell;
  area: () => IArea;
  // image: () => ISemanticMark;
  line: () => ILine;
  ruleX: () => IRuleX;
  ruleY: () => IRuleY;
  // point: () => ISemanticMark;
  // link: () => ISemanticMark;
  // polygon: () => ISemanticMark;
  // text: () => ISemanticMark;
  // rect: () => ISemanticMark;
  // rectX: () => ISemanticMark;
  // rectY: () => ISemanticMark;
  /**
   * 用于绘制区块，绘制四象限
   */
  // range: () => ISemanticMark;
  // rangeX: () => ISemanticMark;
  // rangeY: () => ISemanticMark;

  // wordcloud 包如果没注册，会存在问题
  // wordcloud: () => ISemanticMark;
  // wordcloudShape: () => ISemanticMark;
  // circlePacking: () => ISemanticMark;
  // treemap: () => ISemanticMark;
  // tree: () => ISemanticMark;
  // sunburst: () => ISemanticMark;
  // sankey: () => ISemanticMark;

  // P2
  // forceGraph: () => ISemanticMark;
  // geoPath: () => ISemanticMark;
  // vector: () => ISemanticMark;
  // shape: () => ISemanticMark;
  // gauge: () => ISemanticMark;
  // heatmap: () => ISemanticMark;
  // density: () => ISemanticMark;
  // boxplot: () => ISemanticMark;
  // box: () => ISemanticMark;
  // contour: () => ISemanticMark;

  // observable auto define type by data
  // auto: () => ISemanticMark;
}

export interface IPlotConstructor {
  new (options?: IPlotOptions): IPlot;
}

export type WithDefaultEncode<T, K extends string> = {
  [Key in K]?: Key extends keyof T ? ISemanticEncodeValue<T[Key]> : ISemanticEncodeValue<string | number>;
};
export type ISemanticEncodeValue<T> = T extends any[]
  ? string[] | ((datum: any) => any)[]
  : string | ((datum: any) => T);
export type ISemanticEncodeSpec<T> = {
  [Key in keyof T]?: ISemanticEncodeValue<T[Key]>;
};
export type ISemanticStyle<T, K extends string> = Omit<T, K>;

export type SemanticTooltipOption = {
  disableGraphicTooltip?: boolean;
  disableDimensionTooltip?: boolean;
  staticTitle?: string;
  staticContentKey?: string | string[];
  title?: ISemanticEncodeValue<string | number>;
  content?: Array<{
    key?: ISemanticEncodeValue<string | number>;
    value?: ISemanticEncodeValue<string | number>;
    symbol?: ISemanticEncodeValue<string>;
  }>;
};

export interface SemanticAxisOption extends Partial<AxisBaseAttributes> {
  tickCount?: number;
}

export type SemanticDataZoomOption = Partial<DataZoomAttributes>;
export type SemanticSliderOption = Partial<SliderAttributes>;
export type SemanticLegendOption = Partial<ColorLegendAttributes | DiscreteLegendAttrs | SizeLegendAttributes>;
export type SemanticCrosshairOption = Partial<BaseCrosshairAttrs>;
export type SemanticLabelOption = Partial<BaseLabelAttrs>;
export type SemanticPlayerOption = Partial<PlayerAttributes>;

export interface ISemanticMark<EncodeSpec, K extends string> {
  readonly type: string;
  data: (values: any, id?: string) => this;
  style: (style: ISemanticStyle<EncodeSpec, K>) => this;
  encode: (channel: K, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>) => this;
  scale: (channel: K, option: ScaleSpec) => this;
  transform: (option: TransformSpec[]) => this;
  animate: (state: string, option: IAnimationConfig | IAnimationConfig[]) => this;
  state: (state: string, option: Partial<EncodeSpec>) => this;

  axis: (channel: string, option?: SemanticAxisOption | boolean, layout?: MarkRelativeItemSpec) => this;
  legend: (channel: string, option?: SemanticLegendOption | boolean, layout?: MarkRelativeItemSpec) => this;
  crosshair: (channel: string, option?: SemanticCrosshairOption | boolean) => this;
  tooltip: (option: SemanticTooltipOption | boolean) => this;
  coordinate: (option: CoordinateOption) => this;

  slider: (channel: string, option?: SemanticSliderOption | boolean, layout?: MarkRelativeItemSpec) => this;
  datazoom: (channel: string, option?: SemanticDataZoomOption | boolean, layout?: MarkRelativeItemSpec) => this;
  label: (channel: string, option?: SemanticLabelOption | boolean) => this;
  player: (data?: any[], option?: SemanticPlayerOption | boolean, layout?: MarkRelativeItemSpec) => this;

  toViewSpec: () => ViewSpec;
  parseSpec: (spec: Partial<ISemanticMarkSpec<EncodeSpec, K>>) => this;
}

export interface ISemanticMarkSpec<EncodeSpec, K extends string> {
  id: string | number;
  data?: DataSpec;
  encode?: WithDefaultEncode<EncodeSpec, K>;
  scale?: Partial<Record<K, ScaleSpec>>;
  style?: ISemanticStyle<EncodeSpec, K>;
  axis?: Partial<
    Record<K, { option?: SemanticAxisOption | boolean; layout?: MarkRelativeItemSpec } | SemanticAxisOption | boolean>
  >;
  transform?: TransformSpec[];
  state?: Record<string, Partial<EncodeSpec>>;
  animation?: Record<string, IAnimationConfig | IAnimationConfig[]>;
  legend?: Record<
    string,
    { option: SemanticLegendOption | boolean; layout?: MarkRelativeItemSpec } | SemanticLegendOption | boolean
  >;
  crosshair?: Record<string, SemanticCrosshairOption | boolean>;
  tooltip?: SemanticTooltipOption | boolean;
  slider?: Record<
    string,
    { option: SemanticSliderOption | boolean; layout?: MarkRelativeItemSpec } | SemanticSliderOption | boolean
  >;
  datazoom?: Record<
    string,
    { option: SemanticDataZoomOption | boolean; layout?: MarkRelativeItemSpec } | SemanticDataZoomOption | boolean
  >;
  label?: Record<string, SemanticLabelOption | boolean>;
  player?: { data?: any[]; option?: SemanticPlayerOption | boolean; layout?: MarkRelativeItemSpec };
}

export type ParsedSimpleEncode<T, K extends string> = {
  [Key in K]?: {
    field: Key extends keyof T ? ISemanticEncodeValue<T[Key]> : ISemanticEncodeValue<string>;
    scale: string;
  };
};

export type SemanticEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type IntervalEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type CellEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type LineEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type AreaEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type RuleXEncodeChannels = 'x' | 'color' | 'group';
export type RuleYEncodeChannels = 'y' | 'color' | 'group';
export type PointEncodeChannels = 'x' | 'y' | 'color' | 'group' | 'size';
export type TextEncodeChannels = 'x' | 'y' | 'color' | 'group' | 'text';
export type RectEncodeChannels = 'x' | 'y' | 'width' | 'height' | 'color' | 'group';
export type RectXEncodeChannels = 'x' | 'color' | 'group';
export type RectYEncodeChannels = 'y' | 'color' | 'group';
export type PolygonEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type RuleEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type ImageEncodeChannels = 'x' | 'y' | 'width' | 'height' | 'color' | 'group' | 'src';
export type PathEncodeChannels = null;

export type IInterval = ISemanticMark<BasicEncoderSpecMap['interval'], IntervalEncodeChannels>;
export type ILine = ISemanticMark<BasicEncoderSpecMap['line'], LineEncodeChannels>;
export type ICell = ISemanticMark<BasicEncoderSpecMap['cell'], CellEncodeChannels>;
export type IRuleX = ISemanticMark<BasicEncoderSpecMap['rule'], RuleXEncodeChannels>;
export type IRuleY = ISemanticMark<BasicEncoderSpecMap['rule'], RuleYEncodeChannels>;
export type IArea = ISemanticMark<PlotAreaEncoderSpec, AreaEncodeChannels>;
export type IPoint = ISemanticMark<BasicEncoderSpecMap['symbol'], PointEncodeChannels>;
export type IText = ISemanticMark<BasicEncoderSpecMap['text'], TextEncodeChannels>;
export type IRect = ISemanticMark<BasicEncoderSpecMap['rect'], RectEncodeChannels>;
export type IRectX = ISemanticMark<BasicEncoderSpecMap['rect'], RectXEncodeChannels>;
export type IRectY = ISemanticMark<BasicEncoderSpecMap['rect'], RectYEncodeChannels>;
export type IPolygon = ISemanticMark<BasicEncoderSpecMap['polygon'], PolygonEncodeChannels>;
export type IRule = ISemanticMark<BasicEncoderSpecMap['rule'], RuleEncodeChannels>;
export type IImage = ISemanticMark<BasicEncoderSpecMap['image'], ImageEncodeChannels>;
export type IPath = ISemanticMark<BasicEncoderSpecMap['path'], PathEncodeChannels>;

export type PlotMark =
  | IInterval
  | IRuleX
  | IRuleY
  | ICell
  | ILine
  | IArea
  | IPoint
  | IText
  | IRect
  | IRectX
  | IRectY
  | IPolygon
  | IRule
  | IImage
  | IPath;
