import type { IGraphic, ACustomAnimate, EasingType } from '@visactor/vrender';
import type { IPointLike } from '@visactor/vutils';
import type { MarkFunctionCallback, MarkFunctionType } from './mark';
import type { IMark } from './grammar';
import type { IElement } from './element';

export type TypeAnimation<T extends IElement> = (
  element: T,
  options: any,
  animationParameters: IAnimationParameters
) => { from?: { [channel: string]: any }; to?: { [channel: string]: any } };

export interface IClipAnimationOptions {
  clipDimension?: 'x' | 'y' | 'auto' | 'default';
}

export interface IGrowCartesianAnimationOptions {
  orient?: 'positive' | 'negative';
  overall?: boolean | number;
  direction?: 'x' | 'y' | 'xy';
}

export interface IGrowAngleAnimationOptions {
  orient?: 'clockwise' | 'anticlockwise';
  overall?: boolean | number;
}

export interface IGrowRadiusAnimationOptions {
  orient?: 'inside' | 'outside';
  overall?: boolean | number;
}

export interface IGrowPointsAnimationOptions {
  orient?: 'positive' | 'negative';
}

export interface IGrowPointsOverallAnimationOptions extends IGrowPointsAnimationOptions {
  center?: IPointLike;
}

export interface IScaleAnimationOptions {
  direction?: 'x' | 'y' | 'xy';
}

export interface IMoveAnimationOptions {
  direction?: 'x' | 'y' | 'xy';
  orient?: 'positive' | 'negative';
  offset?: number;
  point?: { x?: number; y?: number };
}

export interface IRotateAnimationOptions {
  orient?: 'clockwise' | 'anticlockwise';
  angle?: number;
}

/** VGrammar 层提供的图元text上的图形属性，现在暂时会和VRender不一致 */
export interface TextItemAttributes {
  fontSize?: number;
  lineHeight?: number;
  font?: string;
  fontStyle?: string;
  fontVariant?: string;
  fontWeight?: string | number;
  lineBreak?: string;
  text?: string | string[];
  limit?: number;
  align?: string;
  baseline?: string;
  ellipsis?: string | boolean;
  dir?: string;
}

/** animation */
export type MarkFunctionValueType<T> = MarkFunctionCallback<T> | T;

export type IAnimationConfig = IAnimationTimeline | IAnimationTypeConfig;

/**
 * state动画，暂时只支持简单配置
 */
export interface IStateAnimationConfig {
  duration?: number;
  easing?: EasingType;
}

/**
 * 动画 config 简化配置
 */
export interface IAnimationTypeConfig {
  type?: string;
  channel?: IAnimationChannelAttrs | IAnimationChannelAttributes;
  custom?: IAnimationChannelInterpolator | IAnimationCustomConstructor;
  customParameters?: MarkFunctionValueType<any>;
  easing?: EasingType;
  delay?: MarkFunctionValueType<number>;
  duration?: MarkFunctionValueType<number>;
  oneByOne?: MarkFunctionValueType<boolean | number>;
  startTime?: MarkFunctionValueType<number>;
  totalTime?: MarkFunctionValueType<number>;
  /** loop: true 无限循环; loop: 正整数，表示循环的次数 */
  loop?: boolean | number;
  /** 动画 effect 配置项 */
  options?: MarkFunctionValueType<any>;
  /** 动画执行相关控制配置项 */
  controlOptions?: IAnimationControlOptions;
}

/**
 * 动画 timeline 完整配置，一条时间线内的动画单元只能串行
 * 多个timeline是可以并行的
 * 考虑到同一图元不能在多个timeline上，所以timeline不应该提供数组配置的能力
 */
export interface IAnimationTimeline {
  /** 为了方便动画编排，用户可以设置 id 用于识别时间线 */
  id?: string;
  /** 时间切片 */
  timeSlices: IAnimationTimeSlice | IAnimationTimeSlice[];
  /** 动画开始的相对时间，可以为负数 */
  startTime?: MarkFunctionValueType<number>;
  /** 动画时长 */
  totalTime?: MarkFunctionValueType<number>;
  /** 动画依次执行的延迟 */
  oneByOne?: MarkFunctionValueType<number | boolean>;
  /** loop: true 无限循环; loop: 正整数，表示循环的次数 */
  loop?: MarkFunctionValueType<number | boolean>;
  /** 对图元元素进行划分，和过滤类似，但是不同时间线不能同时作用在相同的元素上 */
  partitioner?: MarkFunctionCallback<boolean>;
  /** 对同一时间线上的元素进行排序 */
  sort?: (datumA: any, datumB: any, elementA: IElement, elementB: IElement, parameters: any) => number;
  /** 动画执行相关控制配置项 */
  controlOptions?: IAnimationControlOptions;
}

export interface IAnimationTimeSlice {
  effects: IAnimationEffect | IAnimationEffect[];
  duration?: MarkFunctionValueType<number>;
  delay?: MarkFunctionValueType<number>;
}

export type IAnimationChannelFunction = (datum: any, element: IElement, parameters: IAnimationParameters) => any;
export type IAnimationChannelAttrs = Record<
  string,
  {
    from?: any | IAnimationChannelFunction;
    to?: any | IAnimationChannelFunction;
  }
>;
export type IAnimationChannelAttributes = string[];
export type IAnimationChannelInterpolator = (
  ratio: number,
  from: any,
  to: any,
  nextAttributes: any,
  datum: any,
  element: IElement,
  parameters: IAnimationParameters
) => boolean | void;

// TODO: fix ACustomAnimate<any>
export interface IAnimationCustomConstructor {
  new (from: any, to: any, duration: number, ease: EasingType, parameters?: any): ACustomAnimate<any>;
}

export interface IAnimationEffect {
  type?: string;
  channel?: IAnimationChannelAttrs | IAnimationChannelAttributes;
  custom?: IAnimationChannelInterpolator | IAnimationCustomConstructor;
  customParameters?: MarkFunctionValueType<any>;
  easing?: EasingType;
  /** options暂时没有处理 */
  options?: MarkFunctionValueType<any>;
}

export interface IAnimationControlOptions {
  /** 当动画状态变更时清空动画 */
  stopWhenStateChange?: boolean;
  /** 是否立即应用动画初始状态 */
  immediatelyApply?: boolean;
}

/**
 * Animation timeline should be parsed into animation units,
 * which record all necessary configs for animator to execute animation.
 *
 * animation unit time:
 * |<--initialDelay-->| |<--loopDelay--><--Slices--><--looDelayAfter-->| |<--loopDuration-->|
 *                      |<-----------------loopDuration--------------->|
 */
export interface IAnimationUnit {
  /**
   * initial delay time before any animation loop
   */
  initialDelay: number;
  /**
   * total time for one animation loop
   */
  loopDuration: number;
  /**
   * delay time before time slices
   */
  loopDelay: number;
  /**
   * delay time after time slices
   */
  loopDelayAfter: number;
  /**
   * animating time in one animation loop
   */
  loopAnimateDuration: number;
  loopCount: number;
  totalTime: number;
  timeSlices: IAnimationTimeSlice[];
}

export interface IAnimationRecord {
  start: IGraphic;
  end: IGraphic;
  changes: any[];
}

export interface IAnimationParameters {
  width: number;
  height: number;
  mark: IMark;
  group: IMark | null;
  view: any;
}

export interface IParsedAnimationConfig {
  state: string;
  timeline: IAnimationTimeline;
  originConfig: IAnimationConfig;
  id: string;
}

export interface IParsedAnimationAttrs {
  from?: any;
  to?: any;
  custom?: IAnimationChannelInterpolator | IAnimationCustomConstructor;
  customParameters?: any;
}

// animate structure

export interface IAnimatorOptions {
  state: string;
  timeline: IAnimationTimeline;
  id: string;
}

export interface IAnimator {
  id: number;
  element: IElement;
  animationOptions: IAnimatorOptions;
  isAnimating: boolean;

  /** execute animation */
  animate: (animationParameters: IAnimationParameters) => this;
  /** set animation callback */
  callback: (callbackFunction: (...args: any[]) => void) => this;

  // animation control
  stop: (stopState?: 'start' | 'end', invokeCallback?: boolean) => this;
  pause: () => this;
  resume: () => this;

  /** set additional initial animation delay */
  startAt: (startTime: number) => this;
  /** get total animation execution time */
  getTotalAnimationTime: () => number;
}

export interface IAnimateArranger {
  // animation control api
  parallel: (arranger: IAnimateArranger) => this;
  after: (arranger: IAnimateArranger) => this;

  // internal properties
  afterArranger: IAnimateArranger;
  parallelArrangers: IAnimateArranger[];
  animators: IAnimator[];
  totalTime: number;
  startTime: number;
  endTime: number;
  arrangeTime: () => void;
}

export interface IBaseAnimate {
  // animation control
  stop: () => this;
  pause: () => this;
  resume: () => this;

  // internal animation process api
  animate: () => this;
  enable: () => this;
  disable: () => this;
  enableAnimationState: (state: string | string[]) => this;
  disableAnimationState: (state: string | string[]) => this;

  release: () => void;
}

export interface IAnimate extends IBaseAnimate {
  mark: IMark;

  // additional animation control
  run: (config: IAnimationConfig | IAnimationConfig[]) => IAnimateArranger;
  runAnimationByState: (animationState: string) => IAnimateArranger;
  stopAnimationByState: (animationState: string) => this;
  pauseAnimationByState: (animationState: string) => this;
  resumeAnimationByState: (animationState: string) => this;
  reverse: () => this;
  restart: () => this;
  record: () => this;
  recordEnd: () => this;

  // internal animation process api
  updateConfig: (config: Record<string, IAnimationConfig | IAnimationConfig[]>) => void;
  updateState: (state: MarkFunctionType<string> | null) => void;
  isElementAnimating: (element: IElement) => boolean;
  getAnimatorCount: () => number;
  getElementAnimators: (element: IElement | IElement[], animationState?: string) => IAnimator[];
  release: () => void;
}
