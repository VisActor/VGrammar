import type { ICustomPath2D } from '@visactor/vrender';
import type { Bounds } from '@visactor/vutils';
import type { IAnimationConfig, IStateAnimationConfig } from './animate';
import type { IElement } from './element';
import type { IMark, IScale, IGroupMark, ICoordinate, GrammarSpec, IData } from './grammar';
import type { GenericFunctionType } from './signal';
import type { TransformSpec } from './transform';
import type { CommonPaddingSpec } from './base';
import type { ILayoutOptions } from './view';
import type { BuiltInComponentSpec } from './component';
import type { GrammarMarkType } from '../graph/enums';

export type MarkFunctionCallback<T> = (datum: any, element: IElement, parameters: any) => T;

export type MarkFunctionType<T> = GenericFunctionType<MarkFunctionCallback<T>, T>;

export type MarkType = keyof typeof GrammarMarkType;

export interface MarkFromSpec {
  data: string | IData;
  transform?: {
    name: string;
    transform?: TransformSpec[];
  };
}

export type MarkStateSpec = MarkFunctionType<string | string[]>;

export type ScaleEncodeType = {
  scale: IScale | string;
  field?: string;
  value?: any;
  band?: number;
  offset?: number;
};

export type FieldEncodeType = {
  field: string;
};

export type ChannelEncodeType = MarkFunctionType<any> | ScaleEncodeType | FieldEncodeType;

/**
 *  the common channel supported by graphic marks
 */
export interface GraphicChannelEncoderSpec {
  fill?: ChannelEncodeType;
  stroke?: ChannelEncodeType;
  strokeSeg?: ChannelEncodeType;
  boundsPadding?: ChannelEncodeType;
  opacity?: ChannelEncodeType;
  background?: ChannelEncodeType;
  blur?: ChannelEncodeType;
  cursor?: ChannelEncodeType;
  fillOpacity?: ChannelEncodeType;
  shadowBlur?: ChannelEncodeType;
  shadowColor?: ChannelEncodeType;
  shadowOffsetX?: ChannelEncodeType;
  shadowOffsetY?: ChannelEncodeType;
  outerBorder?: ChannelEncodeType;
  innerBorder?: ChannelEncodeType;
  strokeOpacity?: ChannelEncodeType;
  lineDash?: ChannelEncodeType;
  lineWidth?: ChannelEncodeType;
  lineCap?: ChannelEncodeType;
  lineJoin?: ChannelEncodeType;
  miterLimit?: ChannelEncodeType;
  strokeBoundsBuffer?: ChannelEncodeType;
}

export interface ChannelEncoderSpec extends GraphicChannelEncoderSpec {
  [channel: string]: ChannelEncodeType;
}

export interface IntervalChannelEncoderSpec extends ChannelEncoderSpec {
  x?: ChannelEncodeType;
  y?: ChannelEncodeType;
  maxSize?: number;
  minSize?: number;
}

export interface CellChannelEncoderSpec extends ChannelEncoderSpec {
  x?: ChannelEncodeType;
  y?: ChannelEncodeType;
  padding?: ChannelEncodeType;
  size?: ChannelEncodeType;
  shape?: ChannelEncodeType;
}

export type BaseEncodeSpec =
  | ChannelEncoderSpec
  | IntervalChannelEncoderSpec
  | CellChannelEncoderSpec
  | MarkFunctionType<Record<string, any>>;

export type StateProxyEncodeSpec = (datum: any, element: IElement, state: string, nextStates: string[]) => any;

export type StateEncodeSpec = {
  [state: string]: BaseEncodeSpec | StateProxyEncodeSpec;
};

export type MarkAnimationSpec = Record<string, IAnimationConfig | IAnimationConfig[]> & {
  state?: IStateAnimationConfig;
};

// TODO: support string[]
export type MarkKeySpec = string | ((datum: any) => string);

export type MarkSortSpec = (datumA: any, datumB: any) => number;

export type MarkStateSortSpec = (stateA: string, stateB: string) => number;

export interface MarkGridContainerSpec extends MarkBaseLayoutSpec {
  display: 'grid';
  gridTemplateRows?: (number | string | 'auto')[];
  gridTemplateColumns?: (number | string | 'auto')[];
  gridRowGap?: number;
  gridColumnGap?: number;
}

export interface MarkGridItemSpec extends MarkBaseLayoutSpec {
  gridRowStart?: number;
  gridRowEnd?: number;
  gridColumnStart?: number;
  gridColumnEnd?: number;
}

export interface MarkBaseLayoutSpec {
  callback?: MarkLayoutCallback;
  skipBeforeLayouted?: boolean;
  updateViewSignals?: boolean;
}

export interface MarkRelativeItemSpec extends MarkBaseLayoutSpec {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'content' | 'auto' | string;
  padding?: CommonPaddingSpec;
  align?: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle';
}

export interface MarkRelativeContainerSpec extends MarkBaseLayoutSpec {
  display: 'relative';
  maxChildWidth?: string | number;
  maxChildHeight?: string | number;
}

export type MarkLayoutSpec =
  | MarkGridContainerSpec
  | MarkGridItemSpec
  | MarkRelativeContainerSpec
  | MarkRelativeItemSpec;

export type MarkLayoutCallback = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: Bounds,
  options?: ILayoutOptions
) => void;

export interface IMarkConfig {
  clip?: boolean;
  zIndex?: number;
  interactive?: boolean;
  context?: any;
  /**
   * set customized shape
   */
  setCustomizedShape?: (datum: any[], attrs: any, path: ICustomPath2D) => ICustomPath2D;
  /** 是否开启大数据渲染模式 */
  large?: boolean;
  /** 开启大数据渲染优化的阀值，对应的是data的长度 */
  largeThreshold?: number;
  /** 分片长度 */
  progressiveStep?: number;
  /** 开启分片渲染的阀值，对应的是单系列data的长度 */
  progressiveThreshold?: number;
  /**
   * use 'sequential' for symbol chart
   * use 'mod' for bar/line chart
   */
  // largeChunkMode?: 'sequential' | 'mod';
  support3d?: boolean;
  /**
   * enable global morphing animation of the mark
   */
  morph?: boolean;
  /**
   * this key will be used to match the mark to morph
   */
  morphKey?: string;
  /**
   * this key will be used to match the element of two marks to morph
   * If not specified, we'll use the "key" of the mark by default
   */
  morphElementKey?: string;
}

/**
 * Base mark specification type
 */
export interface BaseMarkSpec extends IMarkConfig, GrammarSpec {
  name?: string;
  type: MarkType;
  group?: string | IGroupMark;
  // data attributes
  from?: MarkFromSpec;
  key?: MarkKeySpec;
  /**
   * sort all the elements in the mark
   */
  sort?: MarkSortSpec;
  /**
   * set the group key of the mark
   */
  groupBy?: MarkKeySpec;
  /**
   * sort the data of each group
   */
  groupSort?: MarkSortSpec;
  context?: any;
  // coordinate attributes
  coordinate?: string | ICoordinate;
  // encode attributes
  state?: MarkStateSpec;
  stateSort?: MarkStateSortSpec;
  encode?: StateEncodeSpec;
  // animation attributes
  animationState?: MarkFunctionType<string>;
  animation?: MarkAnimationSpec;
  transform?: TransformSpec[];
  layout?: MarkLayoutSpec | MarkLayoutCallback;
}

export interface GroupMarkSpec extends BaseMarkSpec {
  type: 'group';
  marks?: MarkSpec[];
}

export interface GlyphMarkSpec extends BaseMarkSpec {
  type: 'glyph';
  glyphType: string;
  glyphConfig?: any;
}

export interface ComponentSpec extends BaseMarkSpec {
  type: 'component';
  componentType: string;
  componentConfig?: any;
  mode?: '2d' | '3d';
}

export type MarkSpec = BaseMarkSpec | GroupMarkSpec | GlyphMarkSpec | ComponentSpec | BuiltInComponentSpec;

export interface AttributeTransform {
  channels: string[];
  transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => void;
  storedAttrs?: string;
}
