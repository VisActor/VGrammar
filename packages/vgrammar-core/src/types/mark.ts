import type {
  ICustomPath2D,
  IPyramid3dGraphicAttribute,
  IArc3dGraphicAttribute,
  IRect3dGraphicAttribute,
  ISymbolAttribute,
  IRectGraphicAttribute,
  ILineGraphicAttribute,
  ICircleGraphicAttribute,
  IArcGraphicAttribute,
  IPolygonGraphicAttribute,
  IAreaGraphicAttribute,
  IGlyphGraphicAttribute,
  IImageGraphicAttribute,
  IPathGraphicAttribute,
  ISymbolGraphicAttribute,
  ITextGraphicAttribute,
  IGraphicAttribute,
  IGroupGraphicAttribute,
  IRichTextGraphicAttribute
} from '@visactor/vrender-core';
import type { Bounds, IPointLike } from '@visactor/vutils';
import type { IAnimationConfig, IStateAnimationConfig } from './animate';
import type { IElement } from './element';
import type { IMark, IScale, IGroupMark, ICoordinate, GrammarSpec, IData } from './grammar';
import type { GenericFunctionType } from './signal';
import type { TransformSpec } from './transform';
import type { CommonPaddingSpec } from './base';
import type { ILayoutOptions } from './view';
import type {
  AxisSpec,
  BuiltInComponentSpec,
  CrosshairSpec,
  DatazoomSpec,
  LabelSpec,
  LegendSpec,
  PlayerSpec,
  SliderSpec
} from './component';
import type { GrammarMarkType } from '../graph/enums';

export type MarkFunctionCallback<T> = (datum: any, element: IElement, parameters: any) => T;

export type MarkFunctionType<T> = GenericFunctionType<MarkFunctionCallback<T>, T>;

export type MarkType = keyof typeof GrammarMarkType | string;

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
  field?: string | ((datum: any) => any) | string[] | ((datum: any) => any)[];
  value?: any;
  band?: number;
  offset?: number;
};

export type FieldEncodeType = {
  field: string | ((datum: any) => any) | string[] | ((datum: any) => any)[];
};

export type ChannelEncodeType<T = any> = MarkFunctionType<T> | ScaleEncodeType | FieldEncodeType;

export type GenerateEncoderSpec<T> = {
  [Key in keyof T]?: ChannelEncodeType<T[Key]>;
};

/**
 *  the common channel supported by graphic marks
 */
export type GenerateBasicEncoderSpec<T> = Partial<
  Omit<
    T,
    | 'strokeSeg'
    | 'boundsPadding'
    | 'pickMode'
    | 'boundsMode'
    | 'customPickShape'
    | 'pickable'
    | 'childrenPickable'
    | 'visible'
    | 'zIndex'
    | 'layout'
    | 'keepDirIn3d'
    | 'postMatrix'
    | 'anchor'
    | 'anchor3d'
  >
>;

export type BasicEncoderSpecMap = {
  rect: GenerateBasicEncoderSpec<IRectGraphicAttribute & { y1?: number; x1?: number }>;
  line: Omit<GenerateBasicEncoderSpec<ILineGraphicAttribute>, 'points' | 'segments'>;
  circle: GenerateBasicEncoderSpec<ICircleGraphicAttribute>;
  arc: GenerateBasicEncoderSpec<IArcGraphicAttribute>;
  polygon: GenerateBasicEncoderSpec<IPolygonGraphicAttribute>;
  arc3d: GenerateBasicEncoderSpec<IArc3dGraphicAttribute>;
  pyramid3d: GenerateBasicEncoderSpec<IPyramid3dGraphicAttribute>;
  area: Omit<GenerateBasicEncoderSpec<IAreaGraphicAttribute>, 'points' | 'segments'>;
  group: GenerateBasicEncoderSpec<IGroupGraphicAttribute>;
  glyph: GenerateBasicEncoderSpec<IGlyphGraphicAttribute & any>;
  image: GenerateBasicEncoderSpec<IImageGraphicAttribute>;
  rect3d: GenerateBasicEncoderSpec<IRect3dGraphicAttribute>;
  path: GenerateBasicEncoderSpec<IPathGraphicAttribute>;
  rule: Omit<GenerateBasicEncoderSpec<ILineGraphicAttribute>, 'points' | 'segments'> & { x1?: number; y1?: number };
  shape: GenerateBasicEncoderSpec<IPathGraphicAttribute>;
  symbol: GenerateBasicEncoderSpec<ISymbolGraphicAttribute> & {
    shape?: ISymbolGraphicAttribute['symbolType'];
    image?: ISymbolGraphicAttribute['background'];
  };
  text: GenerateBasicEncoderSpec<ITextGraphicAttribute> & {
    limit?: number;
    autoLimit?: number;
  };
  richtext: GenerateBasicEncoderSpec<IRichTextGraphicAttribute>;
  interval: Omit<GenerateBasicEncoderSpec<IRectGraphicAttribute>, 'width' | 'height'> & {
    /**
     * the gap for two graphic elements
     */
    innerGap?: number | string;
    /**
     * only used for rect / interval mark
     */
    maxWidth?: number;
    minWidth?: number;
    /** the gap between two category */
    categoryGap?: number | string;
  };
  cell: GenerateBasicEncoderSpec<ISymbolGraphicAttribute> & {
    padding?: number | [number, number];
    shape?: ISymbolAttribute['symbolType'];
  };
};
export type GenerateBaseEncodeSpec<BasicSpec = GenerateBasicEncoderSpec<IGraphicAttribute>> =
  | GenerateEncoderSpec<BasicSpec>
  | MarkFunctionCallback<BasicSpec>;

export type StateProxyEncodeSpec<T = any> = (datum: any, element: IElement, state: string, nextStates: string[]) => T;

export type StateEncodeSpec<BasicSpec = GenerateBasicEncoderSpec<IGraphicAttribute>> =
  | {
      enter?: GenerateBaseEncodeSpec<BasicSpec>;
      update?: GenerateBaseEncodeSpec<BasicSpec>;
      exit?: GenerateBaseEncodeSpec<BasicSpec>;
    }
  | {
      [state: string]: GenerateEncoderSpec<BasicSpec> | StateProxyEncodeSpec<BasicSpec>;
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
  order?: number;
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
  /** transforms of attributes */
  attributeTransforms?: AttributeTransform[];
}

/**
 * Base mark specification type
 */
export interface GenerateMarkSpec<T extends MarkType = string, P = any> extends IMarkConfig, GrammarSpec {
  type: T;
  name?: string;
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
  encode?: GetEncoderSpecByType<T, P>;
  // animation attributes
  animationState?: MarkFunctionType<string>;
  animation?: MarkAnimationSpec;
  transform?: TransformSpec[];
  layout?: MarkLayoutSpec | MarkLayoutCallback;
}

export type CircleMarkSpec = GenerateMarkSpec<'circle'>;
export type ArcMarkSpec = GenerateMarkSpec<'arc'>;
export type AreaMarkSpec = GenerateMarkSpec<'area'>;
export type LineMarkSpec = GenerateMarkSpec<'line'>;
export type RectMarkSpec = GenerateMarkSpec<'rect'>;
export type ImageMarkSpec = GenerateMarkSpec<'image'>;
export type PathMarkSpec = GenerateMarkSpec<'path'>;
export type RuleMarkSpec = GenerateMarkSpec<'rule'>;
export type ShapeMarkSpec = GenerateMarkSpec<'shape'>;
export type SymbolMarkSpec = GenerateMarkSpec<'symbol'>;
export type TextMarkSpec = GenerateMarkSpec<'text'>;
export type RichTextMarkSpec = GenerateMarkSpec<'richtext'>;
export type PolygonMarkSpec = GenerateMarkSpec<'polygon'>;
export type CellMarkSpec = GenerateMarkSpec<'cell'>;
export type IntervalMarkSpec = GenerateMarkSpec<'interval'>;
export type Arc3dMarkSpec = GenerateMarkSpec<'arc3d'>;
export type Pyramid3dMarkSpec = GenerateMarkSpec<'pyramid3d'>;
export type Rect3dMarkSpec = GenerateMarkSpec<'rect3d'>;

export type BasicGlyphEncoderSpec = BasicEncoderSpecMap['glyph'];
export type BasicGroupEncoderSpec = BasicEncoderSpecMap['group'];
export interface GroupMarkSpec extends GenerateMarkSpec<'group'> {
  marks?: MarkSpec[];
}

export interface GlyphMarkSpec<CustomizedEncoderSpec = any> extends GenerateMarkSpec<'glyph', CustomizedEncoderSpec> {
  glyphType: string;
  glyphConfig?: any;
}

export interface BoxPlotEncoderSpec extends BasicGlyphEncoderSpec {
  boxWidth?: number;
  boxHeight?: number;
  ruleWidth?: number;
  ruleHeight?: number;
  q1?: number;
  q3?: number;
  min?: number;
  max?: number;
  median?: number;
  angle?: number;
  anchor?: [number, number];
}

export interface BarBoxPlotEncoderSpec extends BasicGlyphEncoderSpec {
  minMaxWidth?: number;
  q1q3Width?: number;
  minMaxHeight?: number;
  q1q3Height?: number;
  q1?: number;
  q3?: number;
  min?: number;
  max?: number;
  median?: number;
  angle?: number;
  lineWidth?: number;
  minMaxFillOpacity?: number;
  anchor?: [number, number];
}

export interface LinkPathEncoderSpec extends BasicGlyphEncoderSpec {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  thickness: number;
  curvature?: number;
  /** round all the coordinates */
  round?: boolean;
  /** the ratio of normal style path */
  ratio?: number;
  align?: 'start' | 'end' | 'center';
  pathType?: 'line' | 'smooth' | 'polyline';
  endArrow?: boolean;
  startArrow?: boolean;
  backgroundStyle?: any;
  direction?: 'horizontal' | 'vertical' | 'LR' | 'RL' | 'TB' | 'BL' | 'radial';
}
export interface TreePathEncoderSpec extends BasicGlyphEncoderSpec {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  curvature?: number;
  /** round all the coordinates */
  round?: boolean;
  /** the ratio of normal style path */
  align?: 'start' | 'end' | 'center';
  pathType?: 'line' | 'smooth' | 'polyline';
  startArrowStyle?: Partial<IGraphicAttribute>;
  endArrowStyle?: Partial<IGraphicAttribute>;
  endArrow?: boolean;
  startArrow?: boolean;
  arrowSize?: number;
  backgroundStyle?: any;
  direction?: 'horizontal' | 'vertical' | 'LR' | 'RL' | 'TB' | 'BL' | 'radial';
}

export interface RipplePointEncoderSpec extends BasicGlyphEncoderSpec {
  ripple?: number;
  size?: number;
}

export interface ViolinEncoderSpec extends BasicGlyphEncoderSpec {
  violinFill: string;
  violinStroke: string;
  medianFill?: string;
  density?: IPointLike[];
  boxWidth?: number;
  q1?: number;
  q3?: number;
  min?: number;
  max?: number;
  median?: number;
  angle?: number;
  anchor?: [number, number];
}

export interface WaveEncoderSpec extends BasicGlyphEncoderSpec {
  wave?: number;
}
export interface BoxPlotGlyphSpec extends GlyphMarkSpec<BoxPlotEncoderSpec> {
  glyphType: 'boxplot';
}
export interface BarBoxPlotGlyphSpec extends GlyphMarkSpec<BarBoxPlotEncoderSpec> {
  glyphType: 'barBoxplot';
}
export interface LinkPathGlyphSpec extends GlyphMarkSpec<LinkPathEncoderSpec> {
  glyphType: 'linkPath';
}
export interface TreePathGlyphSpec extends GlyphMarkSpec<TreePathEncoderSpec> {
  glyphType: 'treePath';
}
export interface RipplePointGlyphSpec extends GlyphMarkSpec<RipplePointEncoderSpec> {
  glyphType: 'ripplePoint';
}
export interface ViolinGlyphSpec extends GlyphMarkSpec<ViolinEncoderSpec> {
  glyphType: 'violin';
}
export interface WaveGlyphSpec extends GlyphMarkSpec<WaveEncoderSpec> {
  glyphType: 'wave';
}

export interface ComponentSpec<
  BasicEncoderSpec extends GenerateBasicEncoderSpec<IGraphicAttribute> = GenerateBasicEncoderSpec<IGraphicAttribute>
> extends GenerateMarkSpec<'component', BasicEncoderSpec> {
  componentType: string;
  componentConfig?: any;
  mode?: '2d' | '3d';
}

export type BaseMarkSpec = GenerateMarkSpec<MarkType>;
export type MarkSpecMap = {
  circle: CircleMarkSpec;
  arc: ArcMarkSpec;
  area: AreaMarkSpec;
  image: ImageMarkSpec;
  line: LineMarkSpec;
  path: PathMarkSpec;
  rule: RuleMarkSpec;
  shape: ShapeMarkSpec;
  symbol: SymbolMarkSpec;
  text: TextMarkSpec;
  richtext: RichTextMarkSpec;
  polygon: PolygonMarkSpec;
  cell: CellMarkSpec;
  interval: IntervalMarkSpec;
  rect: RectMarkSpec;
  rect3d: Rect3dMarkSpec;
  arc3d: Arc3dMarkSpec;
  pyramid3d: Pyramid3dMarkSpec;
  group: GroupMarkSpec;
  glyph: GlyphMarkSpec;
  linkPath: LinkPathGlyphSpec;
  treePath: TreePathGlyphSpec;
  wave: WaveEncoderSpec;
  ripplePoint: RipplePointGlyphSpec;
  barBoxplot: BarBoxPlotGlyphSpec;
  boxPlot: BoxPlotGlyphSpec;
  component: ComponentSpec;
  axis: AxisSpec;
  legend: LegendSpec;
  corsshair: CrosshairSpec;
  slider: SliderSpec;
  datazoom: DatazoomSpec;
  label: LabelSpec;
  player: PlayerSpec;
};

export type GetMarkSpecByType<T, P = any> = T extends keyof MarkSpecMap ? MarkSpecMap[T] : GenerateMarkSpec<string, P>;
export type GetBasicEncoderSpecByType<T, P = any> = T extends keyof BasicEncoderSpecMap
  ? BasicEncoderSpecMap[T]
  : GenerateBasicEncoderSpec<IGraphicAttribute & P>;
export type GetEncoderSpecByType<T, P = any> = T extends keyof BasicEncoderSpecMap
  ? StateEncodeSpec<BasicEncoderSpecMap[T]>
  : StateEncodeSpec<GenerateBasicEncoderSpec<IGraphicAttribute> & P>;

export type BaseEncodeSpec<P = any> = StateEncodeSpec<GenerateBasicEncoderSpec<IGraphicAttribute & P>>;
export type BaseSignleEncodeSpec<P = any> =
  | GenerateEncoderSpec<GenerateBasicEncoderSpec<IGraphicAttribute & P>>
  | StateProxyEncodeSpec<GenerateBasicEncoderSpec<IGraphicAttribute & P>>;

export type GetSignleEncodeSpecByType<T, P = any> = T extends keyof BasicEncoderSpecMap
  ? GenerateEncoderSpec<BasicEncoderSpecMap[T]> | StateProxyEncodeSpec<BasicEncoderSpecMap[T]>
  : BaseSignleEncodeSpec<P>;

export type MarkSpec =
  | GenerateMarkSpec<string, any>
  | CircleMarkSpec
  | ArcMarkSpec
  | AreaMarkSpec
  | ImageMarkSpec
  | LineMarkSpec
  | PathMarkSpec
  | RuleMarkSpec
  | ShapeMarkSpec
  | SymbolMarkSpec
  | TextMarkSpec
  | RichTextMarkSpec
  | PolygonMarkSpec
  | CellMarkSpec
  | IntervalMarkSpec
  | RectMarkSpec
  | Rect3dMarkSpec
  | Arc3dMarkSpec
  | Pyramid3dMarkSpec
  | GroupMarkSpec
  | GlyphMarkSpec
  | LinkPathGlyphSpec
  | TreePathGlyphSpec
  | WaveGlyphSpec
  | RipplePointGlyphSpec
  | BarBoxPlotGlyphSpec
  | BoxPlotGlyphSpec
  | ViolinGlyphSpec
  | ComponentSpec
  | BuiltInComponentSpec;

export interface AttributeTransform {
  channels: string[];
  transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => void;
  storedAttrs?: string;
}
