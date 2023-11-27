import type { EventEmitter, IBounds, IPointLike } from '@visactor/vutils';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import type { IBaseScale, ScaleFishEyeOptions, TickData } from '@visactor/vscale';
import type { ITransform, TransformSpec } from './transform';
import type { DataFormatSpec, IDataFilter } from './data';
import type { ParameterFunctionType, SignalFunctionType } from './signal';
import type { IAnimate } from './animate';
import type { IGlyphMeta } from './glyph';
import type { GrammarTypeEnum } from '../graph/enums';
import type { Nil } from './base';
import type { CoordinateFunctionType } from './coordinate';
import type { IElement } from './element';
import type {
  MarkFunctionType,
  MarkAnimationSpec,
  MarkType,
  MarkLayoutSpec,
  MarkLayoutCallback,
  MarkSortSpec,
  MarkKeySpec,
  IMarkConfig,
  ChannelEncodeType,
  AttributeTransform,
  BaseSingleEncodeSpec
} from './mark';
import type { ScaleConfigureSpec, ScaleData, ScaleFunctionType, GrammarScaleType, MultiScaleData } from './scale';
import type { IView } from './view';
import type { BaseEventHandler } from './event';
import type { ICartesianCoordinate, IPolarCoordinate } from '@visactor/vgrammar-coordinate';

export type BuiltInGrammarType = keyof typeof GrammarTypeEnum;
export type GrammarType = BuiltInGrammarType | string;

/** 语法元素内置运行的任务 */
export interface IGrammarTask extends ITransform {
  /**
   * 参数依赖
   * 只做一级解析
   */
  options?: Record<string, any | IGrammarBase> | (IGrammarBase | any)[];
  /**
   * 依赖的语法元素
   */
  references?: IGrammarBase[];
  /**
   * 是否只支持简单的options配置，不支持在options引用语法元素
   */
  isRawOptions?: boolean;
}

export interface GrammarSpec {
  id?: string;
  dependency?: IGrammarBase[] | IGrammarBase | string[] | string;
}

export interface IGrammarBase {
  readonly grammarType: GrammarType;
  readonly view: IView;
  readonly uid: number;
  /**
   * 执行的上游节点
   */
  grammarSource: IGrammarBase;
  /**
   * 影响的下游节点
   */
  targets: IGrammarBase[];
  /**
   * 依赖的上游节点，由于不同 spec 配置项中可能引用同一个节点，需要进行计数
   */
  references: Map<IGrammarBase, number>;

  depend: (grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;

  addEventListener: (type: string, handler: BaseEventHandler, options?: any) => this;
  removeEventListener: (type: string, handler: BaseEventHandler) => this;

  // extended from EventEmitter
  emit: <T extends EventEmitter.EventNames<string | symbol>>(
    event: T,
    ...args: EventEmitter.EventArgs<string | symbol, T>
  ) => boolean;
  emitGrammarEvent: <T extends EventEmitter.EventNames<string | symbol>>(
    event: T,
    ...args: EventEmitter.EventArgs<string | symbol, T>
  ) => boolean;

  tasks?: IGrammarTask[];
  // value?: any;
  /** FIXME: operator执行顺序，改造后，dataflow执行元素，应该抽象出来 */
  rank?: number;
  // todo
  set: (value: any) => boolean;
  id: (() => string) & ((id: string) => this);
  name: (() => string) & ((name: string) => this);
  attach: (reference: IGrammarBase | IGrammarBase[], count?: number) => this;
  detach: (reference: IGrammarBase | IGrammarBase[], count?: number) => this;
  detachAll: () => void;
  commit: () => void;
  output: () => any;
  parse: (spec: any) => this;
  parameters: () => { [key: string]: any };
  evaluateSync?: (upstream: any, parameters: any) => this;
  getSpec: () => any;
  reuse: (grammar: IGrammarBase) => this;
  /** clear references */
  clear: () => void;
  /** release all memory storage */
  release: () => void;
}

export interface IData extends IGrammarBase {
  values: (values: any | Nil, format?: ParameterFunctionType<DataFormatSpec>, load?: boolean) => this;
  url: (
    url: ParameterFunctionType<string> | Nil,
    format?: ParameterFunctionType<DataFormatSpec>,
    load?: boolean
  ) => this;
  source: (
    source: string | string[] | IData | IData[],
    format?: ParameterFunctionType<DataFormatSpec>,
    load?: boolean
  ) => this;
  transform: (transform: TransformSpec[] | Nil) => this;

  // only used in VGrammar
  addDataFilter: (filter: IDataFilter | IDataFilter[]) => this;
  removeDataFilter: (filter: IDataFilter | IDataFilter[]) => this;

  // data util methods
  field: (field: string) => any[];
  getValue: () => any[];
  getInput: () => any[];
  getDataIDKey: () => string;
}

/** 语法元素,TODO */
export interface ISignal<T> extends IGrammarBase {
  value: (value: T | Nil) => this;
  update: (update: SignalFunctionType<T> | Nil) => this;

  getValue: () => T;
}

/** 语法元素,TODO */
export interface IScale extends IGrammarBase {
  domain: (domain: ScaleFunctionType<any[]> | ScaleData | MultiScaleData | Nil) => this;
  range: (range: ScaleFunctionType<any[]> | ScaleData | MultiScaleData | Nil) => this;
  configure: (config: ScaleConfigureSpec | Nil) => this;
  tickCount: (tickCount: ScaleFunctionType<number> | Nil) => this;

  // only used in VGrammar
  getRangeFactor: () => [number, number] | Nil;
  setRangeFactor: (range?: [number, number]) => this;
  getFishEye: () => ScaleFishEyeOptions | Nil;
  setFishEye: (option?: ScaleFishEyeOptions) => this;

  // scale util methods
  getScaleType: () => GrammarScaleType;
  getScale: () => IBaseScale;
  ticks: (count?: number) => TickData[];
  getCoordinateAxisPoints: (baseValue?: number) => [IPointLike, IPointLike];
  getCoordinate: () => IPolarCoordinate | ICartesianCoordinate;
  getCoordinateAxisPosition: () => 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'outside' | 'start' | 'end';
}

export interface ICoordinate extends IGrammarBase {
  start: (start: CoordinateFunctionType<[number, number]> | Nil) => this;
  end: (end: CoordinateFunctionType<[number, number]> | Nil) => this;
  origin: (origin: CoordinateFunctionType<[number, number]> | Nil) => this;

  translate: (offset: CoordinateFunctionType<[number, number]> | Nil) => this;
  rotate: (angle: CoordinateFunctionType<number> | Nil) => this;
  scale: (ratio: CoordinateFunctionType<[number, number]> | Nil) => this;
  transpose: (isTransposed: CoordinateFunctionType<boolean> | Nil) => this;

  // coordinate util methods
}

/** 语法元素,TODO */

/** group mark */
export interface IGroupMark extends IMark {
  children: (IMark | IGroupMark | IGlyphMark)[];

  layoutChildren?: (IMark | IGroupMark | IGlyphMark)[];

  appendChild: (mark: IMark | IGroupMark | IGlyphMark) => this;
  removeChild: (mark: IMark | IGroupMark | IGlyphMark) => this;
  includesChild: (mark: IMark, descendant?: boolean) => boolean;

  updateLayoutChildren: () => this;
}

export interface IGlyphMark extends IMark {
  glyphType: string;
  getGlyphMeta: () => IGlyphMeta;
  configureGlyph: (config: any) => this;
  getGlyphConfig: () => any;
}

export interface IComponent extends IMark {
  componentType: string;
  configureComponent: (config: any) => this;
}

export interface IProgressiveGrammar {
  /** 是否启动了增量渲染模式 */
  isProgressive: () => boolean;
  /** 是否正在执行增量渲染 */
  isDoingProgressive: () => boolean;
  /** 清除增量渲染相关状态 */
  clearProgressive: () => void;
  /** 从第一帧开始增量计算 */
  restartProgressive: () => void;
  /** 分片执行 */
  evaluateProgressive: () => void;
}

export interface IMark extends IGrammarBase, IProgressiveGrammar {
  group?: IGroupMark;

  markType: MarkType;
  coord: ICoordinate;
  /**
   * disable coordinate transform when need
   */
  disableCoordinateTransform?: boolean;
  elements: IElement[];
  elementMap: Map<string, IElement>;
  graphicIndex: number;
  graphicItem?: IGroup;
  animate?: IAnimate;

  join: (
    data: IData | string | Nil,
    key?: MarkKeySpec,
    sort?: MarkSortSpec,
    groupBy?: MarkKeySpec,
    groupSort?: MarkSortSpec
  ) => this;
  coordinate: (coordinate: ICoordinate | string | Nil) => this;
  state: (state: MarkFunctionType<string | string[]> | Nil) => this;
  encode: ((encoders: BaseSingleEncodeSpec, clear?: boolean) => this) &
    ((channel: string, value: ChannelEncodeType, clear?: boolean) => this);
  encodeState: ((state: string, channel: string, value: ChannelEncodeType, clear?: boolean) => this) &
    ((state: string, encoders: BaseSingleEncodeSpec, clear?: boolean) => this);
  animation: (animationConfig: MarkAnimationSpec | Nil) => this;
  animationState: (animationState: MarkFunctionType<string> | Nil) => this;
  layout: (layout: MarkLayoutSpec | MarkLayoutCallback | Nil) => this;
  configure: (config: IMarkConfig | Nil) => this;
  context: (context: any) => this;
  transform: (transform: TransformSpec[] | Nil) => this;

  needAnimate: () => boolean;
  getBounds: () => IBounds;
  isCollectionMark: () => boolean;
  getAllElements: () => IElement[];
  getContext: () => any;

  // position: () => this;
  // color: () => this;
  // shape: () => this;

  // mark 执行流程相关接口

  isUpdated: boolean;
  getGroupGraphicItem: () => any;
  cleanExitElements: () => void;
  addGraphicItem: (attrs: any, groupKey?: string) => IGraphic;
  getMorphConfig: () => { morph: boolean; morphKey: string | undefined; morphElementKey: string | undefined };
  prepareRelease: () => void;

  layoutBounds?: IBounds;
  relativePosition?: { top?: number; bottom?: number; left?: number; right?: number };
  needLayout: () => boolean;
  handleLayoutEnd: () => void;
  handleRenderEnd: () => void;
  isLargeMode: () => boolean;
  getAttributeTransforms: () => AttributeTransform[];

  getScalesByChannel: () => Record<string, IBaseScale> | undefined;
  getFieldsByChannel: () => Record<string, string> | undefined;
  getScales: () => Record<string, IBaseScale> | undefined;
}

export interface IGrammarBaseConstructor {
  new (view: IView): IGrammarBase;
}

export interface ProgressiveContext {
  currentIndex: number;
  totalStep: number;
  step: number;
  data: any[];
  groupKeys?: string[];
  groupedData?: Map<string, any[]>;
}
