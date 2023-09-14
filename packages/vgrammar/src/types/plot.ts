import type {
  AxisBaseAttributes,
  BaseCrosshairAttrs,
  BaseLabelAttrs,
  ColorLegendAttributes,
  DataZoomAttributes,
  DiscreteLegendAttrs,
  GridBaseAttributes,
  PlayerAttributes,
  SizeLegendAttributes,
  SliderAttributes
} from '@visactor/vrender-components';
import type { CoordinateType } from '@visactor/vgrammar-coordinate';
import type { IColor } from '@visactor/vrender';
import type { IEnvironmentOptions, IRendererOptions, IRunningConfig, ViewSpec, srIOption3DType, IView } from './view';
import type { CommonPaddingSpec, ValueOf } from './base';
import type { BasicEncoderSpecMap, LinkPathEncoderSpec, MarkRelativeItemSpec } from './mark';
import type { BaseEventHandler } from './event';
import type { TransformSpec } from './transform';
import type { IAnimationConfig } from './animate';
import type { ScaleSpec } from './scale';
import type { DataSpec } from './data';
import type { GridShape } from './component';

export interface IPlotOptions extends IEnvironmentOptions, IRendererOptions {
  width?: number;
  height?: number;
  padding?: CommonPaddingSpec;
  autoFit?: boolean;
  options3d?: srIOption3DType;
  theme?: string;
  logLevel?: number;
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

export type PlotIntervalEncoderSpec = Omit<BasicEncoderSpecMap['interval'], 'y'> & {
  y?: number | number[];
  y1?: number;
  x1?: number;
};

export type PlotRectEncoderSpec = Omit<BasicEncoderSpecMap['rect'], 'y' | 'x'> & {
  y?: number | number[];
  x?: number | number[];
  y1?: number;
  x1?: number;
};

export type PlotRectXEncoderSpec = Omit<BasicEncoderSpecMap['rect'], 'x'> & {
  x?: number | number[];
  y1?: number;
  x1?: number;
};

export type PlotRectYEncoderSpec = Omit<BasicEncoderSpecMap['rect'], 'y'> & {
  y?: number | number[];
  y1?: number;
  x1?: number;
};

export type PlotAreaEncoderSpec = Omit<BasicEncoderSpecMap['area'], 'x' | 'y'> & {
  x?: number | number[];
  y?: number | number[];
};

export type PlotRuleEncoderSpec = Omit<BasicEncoderSpecMap['rule'], 'x' | 'y'> & {
  x?: number | number[];
  y?: number | number[];
};

export type PlotImageEncoderSpec = Omit<BasicEncoderSpecMap['image'], 'x' | 'y'> & {
  x?: number | number[];
  y?: number | number[];
};
export type PlotPolygonEncoderSpec = Omit<BasicEncoderSpecMap['polygon'], 'x' | 'y'> & {
  x?: number[];
  y?: number[];
};

export type PlotSankeyEncoderSpec = Partial<LinkPathEncoderSpec>;
export type PlotSunburstEncodeSpec = BasicEncoderSpecMap['arc'];
export type PlotTreeEncodeSpec = BasicEncoderSpecMap['symbol'];
export type PlotTreemapEncodeSpec = BasicEncoderSpecMap['rect'];
export type PlotCirclePackingEncodeSpec = BasicEncoderSpecMap['circle'];
export type PlotWordcloudEncodeSpec = BasicEncoderSpecMap['text'];
export type PlotWordcloudShapeEncodeSpec = BasicEncoderSpecMap['text'];

export type CoordinateOption = CartesianCoordinateOption | PolarCoordinateOption;
export type PlotIntervalSpec = Partial<ISemanticMarkSpec<PlotIntervalEncoderSpec, IntervalEncodeChannels>> & {
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
export type PlotSymbolSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['symbol'], SymbolEncodeChannels>> & {
  type: 'symbol';
};
export type PlotTextSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['text'], TextEncodeChannels>> & {
  type: 'text';
};
export type PlotRectSpec = Partial<ISemanticMarkSpec<PlotRectEncoderSpec, RectEncodeChannels>> & {
  type: 'rect';
};
export type PlotRectXSpec = Partial<ISemanticMarkSpec<PlotRectXEncoderSpec, RectXEncodeChannels>> & {
  type: 'rectX';
};
export type PlotRectYSpec = Partial<ISemanticMarkSpec<PlotRectYEncoderSpec, RectYEncodeChannels>> & {
  type: 'rectY';
};
export type PlotPolygonSpec = Partial<ISemanticMarkSpec<PlotPolygonEncoderSpec, PolygonEncodeChannels>> & {
  type: 'polygon';
};
export type PlotRuleSpec = Partial<ISemanticMarkSpec<PlotRuleEncoderSpec, RuleEncodeChannels>> & {
  type: 'rule';
};
export type PlotImageSpec = Partial<ISemanticMarkSpec<PlotImageEncoderSpec, ImageEncodeChannels>> & {
  type: 'image';
};
export type PlotPathSpec = Partial<ISemanticMarkSpec<BasicEncoderSpecMap['path'], PathEncodeChannels>> & {
  type: 'path';
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
    | PlotSymbolSpec
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
  readonly view: IView;

  theme: (theme: string) => this;
  /**
   * todo: 直接接text图元还是title组件
   */
  // title: (text: ITextAttribute['text'], style: Omit<ITextAttribute, 'text'>) => this;
  coordinate: (type: CoordinateType, option?: Omit<CoordinateOption, 'type'>) => this;
  // interaction: (type: string, options: boolean | any) => this;

  // facet: (type: string, options: any) => this;

  ///--------- life cycle ---------///

  run: (runningConfig?: IRunningConfig) => this;
  runAsync: (runningConfig?: IRunningConfig) => Promise<this>;
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
  image: () => IImage;
  line: () => ILine;
  ruleX: () => IRuleX;
  ruleY: () => IRectY;
  symbol: () => ISymbol;
  polygon: () => IPolygon;
  text: () => IText;
  rect: () => IRect;
  rectX: () => IRectX;
  rectY: () => IRectY;
  rule: () => IRule;

  // wordcloud 包如果没注册，会存在问题
  wordcloud: () => IWordcloud;
  wordcloudShape: () => IWordcloudShape;
  circlePacking: () => ICirclePacking;
  treemap: () => ITreemap;
  tree: () => ITree;
  sunburst: () => ISunburst;
  sankey: () => ISankey;

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

export interface SemanticTooltipContentItem {
  key?: ISemanticEncodeValue<string | number>;
  value?: ISemanticEncodeValue<string | number>;
  symbol?: ISemanticEncodeValue<string>;
}
export type SemanticTooltipOption = {
  disableGraphicTooltip?: boolean;
  disableDimensionTooltip?: boolean;
  staticTitle?: string;
  staticContentKey?: string | string[];
  title?: ISemanticEncodeValue<string | number>;
  dimensionTooltipChannel?: 'x' | 'y';
  content?: SemanticTooltipContentItem[];
};

export interface SemanticAxisOption extends Partial<AxisBaseAttributes> {
  tickCount?: number;
}

export interface SemanticGridOption extends Partial<GridBaseAttributes> {
  type?: GridShape;
  tickCount?: number;
  inside?: boolean;
  baseValue?: number;
  sides?: number;
}
export type SemanticDataZoomOption = Partial<DataZoomAttributes>;
export type SemanticSliderOption = Partial<SliderAttributes>;
export type SemanticLegendOption = Partial<ColorLegendAttributes | DiscreteLegendAttrs | SizeLegendAttributes>;
export type SemanticCrosshairOption = Partial<BaseCrosshairAttrs>;
export type SemanticLabelOption = Partial<BaseLabelAttrs>;
export type SemanticPlayerOption = Partial<PlayerAttributes>;

export interface ISemanticMark<EncodeSpec, K extends string> {
  readonly uid: number;
  readonly type: string;
  data: (values: any, transform?: TransformSpec[], id?: string) => this;
  style: (style: Partial<EncodeSpec & any>) => this;
  encode: (channel: K, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>) => this;
  scale: (channel: K, option: Partial<ScaleSpec>) => this;
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
  style?: Partial<EncodeSpec & any>;
  axis?: Partial<
    Record<K, { option?: SemanticAxisOption | boolean; layout?: MarkRelativeItemSpec } | SemanticAxisOption | boolean>
  >;
  grid?: Partial<Record<K, SemanticGridOption | boolean>>;
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

export type SemanticEncodeChannels = 'x' | 'y' | 'group' | 'color';
export type IntervalEncodeChannels = 'x' | 'y' | 'group' | 'color' | 'stroke';
export type CellEncodeChannels = 'x' | 'y' | 'group' | 'color' | 'stroke';
export type LineEncodeChannels = 'x' | 'y' | 'group' | 'color';
export type AreaEncodeChannels = 'x' | 'y' | 'group' | 'color' | 'stroke';
export type RuleXEncodeChannels = 'x' | 'x' | 'color' | 'group';
export type RuleYEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type SymbolEncodeChannels = 'x' | 'y' | 'color' | 'group' | 'size' | 'shape' | 'stroke';
export type TextEncodeChannels = 'x' | 'y' | 'color' | 'group' | 'text' | 'stroke';
export type RectEncodeChannels = 'x' | 'y' | 'color' | 'group' | 'stroke';
export type RectXEncodeChannels = 'x' | 'color' | 'group' | 'stroke';
export type RectYEncodeChannels = 'y' | 'color' | 'group' | 'stroke';
export type PolygonEncodeChannels = 'x' | 'y' | 'color' | 'group' | 'stroke';
export type RuleEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type ImageEncodeChannels = 'x' | 'y' | 'color' | 'group' | 'src' | 'stroke';
export type PathEncodeChannels = 'color' | 'stroke';
export type SankeyEncodeChannels = 'node' | 'value' | 'color' | 'stroke';
export type SunburstEncodeChannels = 'node' | 'value' | 'color' | 'stroke';
export type TreeEncodeChannels = 'node' | 'value' | 'color' | 'stroke';
export type TreemapEncodeChannels = 'node' | 'value' | 'color' | 'stroke';
export type CirclepackingEncodeChannels = 'node' | 'value' | 'color' | 'stroke';
export type WordcloudEncodeChannels = 'text' | 'color' | 'stroke';
export type WordcloudShapeEncodeChannels = 'text' | 'color' | 'stroke';

export type IInterval = ISemanticMark<PlotIntervalEncoderSpec, IntervalEncodeChannels>;
export type ILine = ISemanticMark<BasicEncoderSpecMap['line'], LineEncodeChannels>;
export type ICell = ISemanticMark<BasicEncoderSpecMap['cell'], CellEncodeChannels>;
export type IRuleX = ISemanticMark<BasicEncoderSpecMap['rule'], RuleXEncodeChannels>;
export type IRuleY = ISemanticMark<BasicEncoderSpecMap['rule'], RuleYEncodeChannels>;
export type IArea = ISemanticMark<PlotAreaEncoderSpec, AreaEncodeChannels>;
export type ISymbol = ISemanticMark<BasicEncoderSpecMap['symbol'], SymbolEncodeChannels>;
export type IText = ISemanticMark<BasicEncoderSpecMap['text'], TextEncodeChannels>;
export type IRect = ISemanticMark<PlotRectEncoderSpec, RectEncodeChannels>;
export type IRectX = ISemanticMark<BasicEncoderSpecMap['rect'], RectXEncodeChannels>;
export type IRectY = ISemanticMark<BasicEncoderSpecMap['rect'], RectYEncodeChannels>;
export type IPolygon = ISemanticMark<PlotPolygonEncoderSpec, PolygonEncodeChannels>;
export type IRule = ISemanticMark<BasicEncoderSpecMap['rule'], RuleEncodeChannels>;
export type IImage = ISemanticMark<PlotImageEncoderSpec, ImageEncodeChannels>;
export type IPath = ISemanticMark<BasicEncoderSpecMap['path'], PathEncodeChannels>;
export type ISankey = ISemanticMark<PlotSankeyEncoderSpec, SankeyEncodeChannels>;
export type ISunburst = ISemanticMark<PlotSunburstEncodeSpec, SunburstEncodeChannels>;
export type IWordcloud = ISemanticMark<PlotWordcloudEncodeSpec, WordcloudEncodeChannels>;
export type IWordcloudShape = ISemanticMark<PlotWordcloudShapeEncodeSpec, WordcloudShapeEncodeChannels>;
export type ITree = ISemanticMark<PlotTreeEncodeSpec, TreeEncodeChannels>;
export type ITreemap = ISemanticMark<PlotTreemapEncodeSpec, TreemapEncodeChannels>;
export type ICirclePacking = ISemanticMark<PlotCirclePackingEncodeSpec, CirclepackingEncodeChannels>;

export type PlotMark =
  | IInterval
  | IRuleX
  | IRuleY
  | ICell
  | ILine
  | IArea
  | ISymbol
  | IText
  | IRect
  | IRectX
  | IRectY
  | IPolygon
  | IRule
  | IImage
  | IPath
  | ISankey
  | ISunburst
  | ICirclePacking
  | ITreemap
  | ITree
  | IWordcloud
  | IWordcloudShape;

export interface IPlotMarkConstructor {
  readonly type: string;

  new (id?: string): PlotMark;
}
