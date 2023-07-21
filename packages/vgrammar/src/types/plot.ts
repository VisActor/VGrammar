import type { ScaleSpec } from './scale';
import type { TransformSpec } from './transform';
import type {
  AxisBaseAttributes,
  BaseCrosshairAttrs,
  BaseLabelAttrs,
  BasePlayerAttributes,
  DataZoomAttributes,
  LegendBaseAttributes,
  SliderAttributes
} from '@visactor/vrender-components';
import type { BasicEncoderSpecMap, MarkAnimationSpec } from './mark';
import type { IEnvironmentOptions, IRendererOptions, ViewSpec, srIOption3DType } from './view';
import type { CommonPaddingSpec, ValueOf } from './base';
import type { DataSpec } from './data';

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

export interface ISemanticMark<EncodeSpec, K extends string> {
  readonly type: string;
  data: (values: any) => this;
  style: (style: ISemanticStyle<EncodeSpec, K>) => this;
  encode: (channel: K, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>) => this;
  scale: (channel: K, option: ScaleSpec) => this;
  transform: (option: TransformSpec[]) => this;
  animate: (state: string, option: MarkAnimationSpec) => this;
  state: (state: string, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>) => this;

  axis: (channel: string, option?: AxisBaseAttributes | boolean) => this;
  legend: (channel: string, option?: LegendBaseAttributes) => this;
  slider: (channel: string, option?: SliderAttributes) => this;
  datazoom: (channel: string, option?: DataZoomAttributes) => this;
  tooltip: (option: { title?: string; content?: Array<{ key?: string; value?: string; symbol?: string }> }) => this;
  label: (channel: string, option?: BaseLabelAttrs) => this;
  player: (channel: string, option?: BasePlayerAttributes) => this;
  crosshair: (channel: string, option?: BaseCrosshairAttrs) => this;

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
