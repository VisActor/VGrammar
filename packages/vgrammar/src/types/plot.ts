import type { ScaleSpec } from './scale';
import type { TransformSpec } from './transform';
import type {
  AxisBaseAttributes,
  BaseCrosshairAttrs,
  BaseLabelAttrs,
  BasePlayerAttributes,
  DataZoomAttributes,
  LegendBaseAttributes,
  PlayerAttributes,
  SliderAttributes
} from '@visactor/vrender-components';
import type { BasicEncoderSpecMap, MarkAnimationSpec, MarkRelativeItemSpec } from './mark';
import type { IEnvironmentOptions, IRendererOptions, ViewSpec, srIOption3DType } from './view';
import type { CommonPaddingSpec, ValueOf } from './base';
import type { DataSpec } from './data';
import type { IAnimationConfig } from './animate';

export interface IPlotOptions extends IEnvironmentOptions, IRendererOptions {
  width?: number;
  height?: number;
  padding?: CommonPaddingSpec;
  autoFit?: boolean;
  options3d?: srIOption3DType;
  theme?: string;
}

export interface IPlot {
  /**
   * todo: 直接接text图元还是title组件
   */
  // title: (text: ITextAttribute['text'], style: Omit<ITextAttribute, 'text'>) => this;
  // coordinate: (type: CoordinateType, spec: CoordinateSpec) => this;
  // interaction: (type: string, options: boolean | any) => this;

  // facet: (type: string, options: any) => this;

  render: () => this;
  release: () => this;

  interval: () => IInterval;
  // cell: () => ICell;
  // area: () => ISemanticMark;
  // image: () => ISemanticMark;
  // line: () => ISemanticMark;
  // lineX: () => ISemanticMark;
  // lineY: () => ISemanticMark;
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
  [Key in K]?: Key extends keyof T ? ISemanticEncodeValue<T[Key]> : ISemanticEncodeValue<string>;
};
export type ISemanticEncodeValue<T> = T extends any[] ? string[] | ((datum: any) => T)[] : string | ((datum: any) => T);
export type ISemanticEncodeSpec<T> = {
  [Key in keyof T]?: ISemanticEncodeValue<T[Key]>;
};
export type ISemanticStyle<T, K extends string> = Omit<T, K>;

export type SemanticTooltipOption = {
  title?: ISemanticEncodeValue<string | number>;
  content?: Array<{
    key?: ISemanticEncodeValue<string | number>;
    value?: ISemanticEncodeValue<string | number>;
    symbol?: ISemanticEncodeValue<string>;
  }>;
};

export interface ISemanticMark<EncodeSpec, K extends string> {
  readonly type: string;
  data: (values: any) => this;
  style: (style: ISemanticStyle<EncodeSpec, K>) => this;
  encode: (channel: K, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>) => this;
  scale: (channel: K, option: ScaleSpec) => this;
  transform: (option: TransformSpec[]) => this;
  animate: (state: string, option: IAnimationConfig | IAnimationConfig[]) => this;
  state: (state: string, option: Partial<EncodeSpec>) => this;

  axis: (channel: string, option?: AxisBaseAttributes | boolean, layout?: MarkRelativeItemSpec) => this;
  legend: (channel: string, option?: LegendBaseAttributes | boolean, layout?: MarkRelativeItemSpec) => this;
  crosshair: (channel: string, option?: BaseCrosshairAttrs | boolean) => this;
  tooltip: (option: SemanticTooltipOption | boolean) => this;

  slider: (channel: string, option?: SliderAttributes | boolean, layout?: MarkRelativeItemSpec) => this;
  datazoom: (channel: string, option?: DataZoomAttributes | boolean, layout?: MarkRelativeItemSpec) => this;
  label: (channel: string, option?: Partial<BaseLabelAttrs> | boolean) => this;
  player: (data?: any[], option?: PlayerAttributes | boolean, layout?: MarkRelativeItemSpec) => this;

  toViewSpec: () => ViewSpec;
}

export interface ISemanticMarkSpec<EncodeSpec, K extends string> {
  id: string | number;
  data?: DataSpec;
  encode?: WithDefaultEncode<EncodeSpec, K>;
  scale?: Partial<Record<K, ScaleSpec>>;
  style?: ISemanticStyle<EncodeSpec, K>;
  axis?: Partial<Record<K, AxisBaseAttributes | boolean>>;
  transform?: TransformSpec[];
  state?: Record<string, Partial<EncodeSpec>>;
  animation?: Record<string, IAnimationConfig | IAnimationConfig[]>;
  legend?: Record<string, { option?: LegendBaseAttributes | boolean; layout?: MarkRelativeItemSpec }>;
  crosshair?: Record<string, { option?: BaseCrosshairAttrs | boolean }>;
  tooltip?: SemanticTooltipOption | boolean;
  slider?: Record<string, { option?: SliderAttributes | boolean; layout?: MarkRelativeItemSpec }>;
  datazoom?: Record<string, { option?: DataZoomAttributes | boolean; layout?: MarkRelativeItemSpec }>;
  label?: Record<string, { option?: Partial<BaseLabelAttrs> | boolean }>;
  player?: { data?: any[]; option?: PlayerAttributes | boolean; layout?: MarkRelativeItemSpec };
}

export type ParsedSimpleEncode<T, K extends string> = {
  [Key in K]?: {
    field: Key extends keyof T ? ISemanticEncodeValue<T[Key]> : ISemanticEncodeValue<string>;
    scale: string;
  };
};

export type SemanticEncodeChannels = 'x' | 'y' | 'color' | 'group';
export type IntervalEncodeChannels = SemanticEncodeChannels;
export type CellEncodeChannels = SemanticEncodeChannels;

export type IInterval = ISemanticMark<BasicEncoderSpecMap['interval'], SemanticEncodeChannels>;
export type ICell = ISemanticMark<BasicEncoderSpecMap['interval'], CellEncodeChannels>;
