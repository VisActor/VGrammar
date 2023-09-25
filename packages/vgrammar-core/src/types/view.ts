import type { EventEmitter, IBounds, ILogger } from '@visactor/vutils';
import type { EnvType, IStage, IColor, IOption3D, ILayer, IStageParams } from '@visactor/vrender-core';
import type { CoordinateType } from '@visactor/vgrammar-coordinate';
import type { DataSpec } from './data';
import type { SignalFunctionType, SignalSpec } from './signal';
import type {
  IData,
  ISignal,
  IScale,
  IMark,
  IGrammarBase,
  ICoordinate,
  IGlyphMark,
  IGroupMark,
  IComponent
} from './grammar';
import type { ScaleSpec, GrammarScaleType } from './scale';
import type { MarkSpec, MarkType } from './mark';
import type { Hooks } from './hooks';
import type { ProjectionSpec } from './projection';
import type { BaseEventHandler, EventSpec } from './event';
import type { CommonPaddingSpec } from './base';
import type { IMorphAnimationConfig } from './morph';
import type { IBaseAnimate } from './animate';
import type { IRenderer } from './renderer';
import type {
  IAxis,
  ICrosshair,
  IDatazoom,
  IDimensionTooltip,
  IGrid,
  ILabel,
  ILegend,
  IPlayer,
  IScrollbar,
  ISlider,
  ITitle,
  ITooltip
} from './component';
import type { CoordinateSpec } from './coordinate';
import type { ITheme } from './theme';
import type { InteractionSpec } from './interaction';

export interface IViewThemeConfig {
  labelMonospace?: boolean;
}

/**
 * 获取state相关配置
 */
export interface IViewStateOptions {
  signals?: (name?: string, operator?: any) => boolean;
  data?: (name?: string, object?: any) => boolean;
  recurse?: boolean;
}

export interface IEnvironmentOptions {
  /** 环境参数 */
  mode?: EnvType;
  /**
   * 环境带的配置
   */
  modeParams?: any;
}

export interface IRendererOptions extends Partial<IStageParams> {
  /** 非浏览器环境下，如小程序，需要传入经过包装的伪 canvas 实例 */
  renderCanvas?: string | HTMLCanvasElement;
  /** vRender stage */
  stage?: IStage;
  rendererTitle?: string;
  /** vRender layer */
  layer?: ILayer;
}

export interface ILayoutOptions {
  parseMarkBounds?: (bounds: IBounds, mark: IMark) => IBounds;
  doLayout?: (marks: IMark[], options: ILayoutOptions, view: IView) => void;
}

/** 事件配置 */
export interface IViewEventConfig {
  /**
   * preventDefaults相关配置
   */
  defaults?: {
    prevent?: boolean | Record<string, boolean>;
    allow?: boolean | Record<string, boolean>;
  };
  /**
   * whether permit events of view
   */
  view?: boolean | Record<string, boolean>;
  /** disable all the events */
  disable?: boolean;
  /** use gesture events or not  */
  gesture?: boolean;
  /** use drag events or not */
  drag?: boolean;
}

export interface srIOption3DType extends IOption3D {
  enable?: boolean;
  /* 是否支持3d视角变换 */
  enableView3dTranform?: boolean;
}
export interface IViewOptions extends IEnvironmentOptions, IRendererOptions, ILayoutOptions {
  width?: number;
  height?: number;
  padding?: CommonPaddingSpec;
  autoFit?: boolean;

  options3d?: srIOption3DType;
  /** 外部传入的logger方法 */
  logger?: ILogger;
  /**
   * 0 - None
   * 1 - Error
   * 2 - Warn
   * 3 - Info
   * 4 - Debug
   */
  logLevel?: number;

  /** 生命周期等事件钩子 */
  hooks?: Hooks;

  /**
   * 事件相关配置
   * {
   *    defaults: {
   *      prevent: ['mousemove', 'mouseenter']
   *    }
   * }
   */
  eventConfig?: IViewEventConfig;
  background?: IColor;
}

export interface IRunningConfig {
  /** whether enable reusing of grammar */
  reuse?: boolean;
  /** whether enable morph */
  morph?: boolean;
  /** force all marks to participate in morphing */
  morphAll?: boolean;
  /** morphing animation config */
  animation?: IMorphAnimationConfig;
  /** whether apply exit animations for released marks */
  enableExitAnimation?: boolean;
}

export interface IView {
  readonly renderer: IRenderer;
  readonly rootMark: IGroupMark;
  readonly animate: IBaseAnimate;
  readonly grammars: IRecordedGrammars;
  readonly logger: ILogger;

  // --- Grammar API ---
  signal: <T>(value?: T, update?: SignalFunctionType<T>) => ISignal<T>;
  data: (values?: any[]) => IData;
  scale: (type: GrammarScaleType) => IScale;
  coordinate: (type: CoordinateType) => ICoordinate;
  mark: (
    type: MarkType,
    group: IGroupMark | string,
    markOptions?: { glyphType?: string; componentType?: string; mode?: '2d' | '3d' }
  ) => IMark;
  group: (group: IGroupMark | string) => IGroupMark;
  glyph: (glyphType: string, group: IGroupMark | string) => IGlyphMark;
  component: (componentType: string, group: IGroupMark | string, mode?: '2d' | '3d') => IComponent;
  axis: (group: IGroupMark | string, mode?: '2d' | '3d') => IAxis;
  grid: (group: IGroupMark | string, mode?: '2d' | '3d') => IGrid;
  legend: (group: IGroupMark | string) => ILegend;
  crosshair: (group: IGroupMark | string) => ICrosshair;
  slider: (group: IGroupMark | string) => ISlider;
  label: (group: IGroupMark | string) => ILabel;
  datazoom: (group: IGroupMark | string) => IDatazoom;
  player: (group: IGroupMark | string) => IPlayer;
  tooltip: (group: IGroupMark | string) => ITooltip;
  dimensionTooltip: (group: IGroupMark | string) => IDimensionTooltip;
  title: (group: IGroupMark | string) => ITitle;
  scrollbar: (group: IGroupMark | string) => IScrollbar;

  interaction: (type: string, spec: Omit<InteractionSpec, 'type'>) => this;
  removeInteraction: (type: string) => this;

  addGrammar: (grammar: IGrammarBase) => this;
  removeGrammar: (grammar: string | IGrammarBase) => this;
  removeAllGrammars: () => this;

  getGrammarById: (id: string) => IGrammarBase | null;
  getCustomizedById: (id: string) => IGrammarBase | null;
  getSignalById: <T>(id: string) => ISignal<T> | null;
  getDataById: (id: string) => IData | null;
  getScaleById: (id: string) => IScale | null;
  getCoordinateById: (id: string) => ICoordinate | null;
  getMarkById: (id: string) => IMark | null;
  getGrammarsByName: (name: string) => IGrammarBase[];
  getGrammarsByType: (grammarType: string) => IGrammarBase[];
  getMarksByType: (markType: string) => IMark[];
  getMarksByName: (name: string) => IMark[] | null;
  getMarksBySelector: (selector: string | string[] | IMark | IMark[]) => IMark[] | null;

  commit: (grammar: IGrammarBase) => this;

  // --- Spec API ---
  parseSpec: (spec: ViewSpec) => this;
  updateSpec: (spec: ViewSpec) => this;

  // --- Evaluate API ---
  run: (runningConfig?: IRunningConfig) => this;
  runNextTick: (runningConfig?: IRunningConfig) => Promise<this>;
  runAsync: (runningConfig?: IRunningConfig) => Promise<this>;
  runSync: (runningConfig?: IRunningConfig) => this;
  runBefore: (callback: (view: IView) => void) => this;
  runAfter: (callback: (view: IView) => void) => this;

  // --- Theme API ---
  theme: (theme: ITheme | string) => this;
  getCurrentTheme: () => ITheme;
  setCurrentTheme: (theme: ITheme | string, render?: boolean) => Promise<this>;

  // --- Global Config API ---
  background: (value?: IColor) => IColor;
  width: (value?: number) => number;
  height: (value?: number) => number;
  viewWidth: (value?: number) => number;
  viewHeight: (value?: number) => number;
  padding: (p?: number | { left?: number; right?: number; top?: number; bottom?: number }) => {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  getViewBox: () => IBounds;

  // --- Event API ---
  addEventListener: (type: string, handler: BaseEventHandler, options?: any) => this;
  removeEventListener: (type: string, handler: BaseEventHandler) => this;

  // --- Other API ---
  emit: <T extends EventEmitter.EventNames<string | symbol>>(
    event: T,
    ...args: EventEmitter.EventArgs<string | symbol, T>
  ) => boolean;

  resize: (width: number, height: number, render?: boolean) => Promise<this>;
  traverseMarkTree: (apply: (mark: IMark) => any, filter?: (mark: IMark) => boolean, leafFirst?: boolean) => this;

  getLayoutState: () => string;
  updateLayoutTag: () => this;

  pauseProgressive: () => boolean;
  resumeProgressive: () => boolean;
  restartProgressive: () => boolean;

  release: () => void;
  getImageBuffer: () => Buffer;
}

export interface IViewConstructor {
  new (options?: IViewOptions, config?: IViewThemeConfig): IView;
}

export interface ViewSpec {
  /** 梳理详细配置 */
  theme?: string;
  background?: IColor;
  width?: number;
  height?: number;
  padding?: number | { left?: number; right?: number; top?: number; bottom?: number };
  signals?: SignalSpec<any>[];
  projections?: ProjectionSpec[];
  data?: DataSpec[];
  scales?: ScaleSpec[];
  coordinates?: CoordinateSpec[];
  marks?: MarkSpec[];
  events?: EventSpec[];
  interactions?: InteractionSpec[];
}

export interface IRecordedGrammars {
  record: (grammar: IGrammarBase) => this;
  unrecord: (grammar: IGrammarBase) => this;

  size: () => number;

  getSignal: <T>(key: string) => ISignal<T> | null;
  getData: (key: string) => IData | null;
  getScale: (key: string) => IScale | null;
  getCoordinate: (key: string) => ICoordinate | null;
  getMark: (key: string) => IMark | null;
  getCustomized: (key: string) => IGrammarBase | null;
  getGrammar: (key: string) => IGrammarBase | null;

  getAllSignals: () => ISignal<any>[];
  getAllData: () => IData[];
  getAllScales: () => IScale[];
  getAllCoordinates: () => ICoordinate[];
  getAllMarks: () => IMark[];
  getAllCustomized: () => IGrammarBase[];

  clear: () => void;

  traverse: (func: (grammar: IGrammarBase) => boolean | void) => void;
  find: (func: (grammar: IGrammarBase) => boolean) => IGrammarBase | null;
  filter: (func: (grammar: IGrammarBase) => boolean) => IGrammarBase[];

  release: () => void;
}

export interface IMarkTreeNode {
  mark: IMark;
  parent: IMarkTreeNode;
  children: IMarkTreeNode[];
}

export interface IRecordedTreeGrammars extends IRecordedGrammars {
  getAllMarkNodes: () => IMarkTreeNode[];
}
