import type { FieldGetterFunction } from '@visactor/vgrammar-util';
import type { SignalFunction, SignalReference } from './signal';
import type { IView } from './view';
import type { IData } from './grammar';
import type { SortConfigSpec } from './data';

export type TransformSpecValue =
  | {
      /** transform will depend a signal grammar instance as params */
      signal?: string;
      /** transform will depend a scale grammar instance as params, this should only be used in the transform of mark */
      scale?: string;
      /** transform will depend a data grammar instance as params, this should only be used in the transform of mark */
      data?: string;
      /** transform will depend a customized grammar instance as params, this should only be used in the transform of mark */
      customized?: string;
    }
  | any;

export type TransformFunctionCallback<T> = (parameters: any) => T;

export type TransformFunctionType<T> = T | SignalReference<T> | SignalFunction<TransformFunctionCallback<T>, T>;

export type ConvertTransformOptionToSpec<TransformOptionType> = {
  [Key in keyof TransformOptionType]?: TransformFunctionType<TransformOptionType[Key]>;
};

export interface FilterTransformOption {
  callback: (entry: any, params: any) => boolean;
}

export interface FunnelTransformOption {
  /** the field to of measure */
  field: string;
  /** 转化率（当前层到下一层的比例) **/
  asTransformRatio?: string;
  /** 到达率 （上一层到当前层的比例）*/
  asReachRatio?: string;
  /** 高度轴占总量的比例 **/
  asHeightRatio?: string;
  /** 当前值大小占比 */
  asValueRatio?: string;
  /** 上一层值大小占比 */
  asLastValueRatio?: string;
  /** 下一层值大小占比 */
  asNextValueRatio?: string;
  /** 当前层的值 */
  asCurrentValue?: string;
  /** 上一层的值 **/
  asLastValue?: string;
  /** 下一层的值 **/
  asNextValue?: string;
  /** 最底层漏斗是否为锥形 */
  isCone?: boolean;
  /** 高度是否进行数据映射 **/
  heightVisual?: boolean;

  /** 数值范围 */
  range?: { min: number; max: number };
}

export interface JoinTransformOption {
  from?: any[];
  key: string;
  fields: string[];
  values?: string[];
  as?: string[];
  default?: any;
}

export interface MapTransformOption {
  callback: (entry: any, params?: any) => any;
  as?: string;
  all?: boolean;
}

export interface PickTransformOption {
  as?: string[];
  fields: string[] | FieldGetterFunction[];
}

export interface PieTransformOption {
  field: string;
  startAngle?: number;
  endAngle?: number;
  asStartAngle?: string;
  asEndAngle?: string;
  asMiddleAngle?: string;
  asRadian?: string;
  asRatio?: string;
  asQuadrant?: string;
  asK?: string;
}

export interface RangeTransformOptions {
  start: number;
  stop: number;
  step?: number;
  as?: string;
}

export interface SortTransformOptions {
  sort: SortConfigSpec | ((a: any, b: any) => number);
}

export interface StackTransformOptions {
  orient: 'positive' | 'negative';
  stackField: string;
  dimensionField: string;
  asStack?: string;
  asPrevStack?: string;
  asPercent?: string;
  asPercentStack?: string;
  asPrevPercentStack?: string;
  asSum?: string;
}

export interface DodgeTransformOptions {
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
  /**
   * specify the field to dodge, if this field is not specified, we'll use the `groupKey` of Element to dodge
   */
  dodgeBy?: string | string[];
  /**
   * specify the channel to dodge, if this field is not specified, we'll use the channel which is associated to a band scale
   */
  dodgeChannel?: 'x' | 'y';
}

export interface IdentifierTransformOptions {
  as: string;
}

export interface MarkOverlapTransformOptions {
  direction: number;
  delta?: number;
  deltaMul?: number;
  radius?: boolean;
  hideMode?: number;
  forceUpdate?: boolean;
  forceUpdateStamp?: number;
  groupBy?: string;
}

export interface LttbSampleTransformOptions {
  size: number;
  factor?: number;
  skipfirst?: boolean;
  xfield?: string;
  yfield?: string;
  groupBy?: string;
}

export interface FilterTransformSpec extends ConvertTransformOptionToSpec<FilterTransformOption> {
  type: 'filter';
}

export interface FunnelTransformSpec extends FunnelTransformOption {
  type: 'funnel';
}
export interface PieTransformSpec extends PieTransformOption {
  type: 'pie';
}

export interface JoinTransformSpec extends ConvertTransformOptionToSpec<Omit<JoinTransformOption, 'from'>> {
  type: 'join';
  from?: TransformFunctionType<JoinTransformOption['from']> | { data: string | IData };
}
export interface MapTransformSpec extends ConvertTransformOptionToSpec<Omit<MapTransformOption, 'callback'>> {
  type: 'map';
  callback: MapTransformOption['callback'];
}

export interface PickTransformSpec extends ConvertTransformOptionToSpec<PickTransformOption> {
  type: 'pick';
}
export interface RangeTransformSpec extends ConvertTransformOptionToSpec<RangeTransformOptions> {
  type: 'range';
}

export interface SortTransformSpec extends ConvertTransformOptionToSpec<SortTransformOptions> {
  type: 'sort';
}
export interface StackTransformSpec extends ConvertTransformOptionToSpec<StackTransformOptions> {
  type: 'stack';
}
export interface DodgeTransformSpec extends ConvertTransformOptionToSpec<DodgeTransformOptions> {
  type: 'dodge';
}

export interface IdentifierTransformSpec extends ConvertTransformOptionToSpec<IdentifierTransformOptions> {
  type: 'identifier';
}

export interface MarkOverlapTransformSpec extends ConvertTransformOptionToSpec<MarkOverlapTransformOptions> {
  type: 'markoverlap';
}
export interface LttbSampleTransformSpec extends ConvertTransformOptionToSpec<LttbSampleTransformOptions> {
  type: 'lttbsample';
}

export interface BaseTransformSpec {
  /** the type of transform */
  type: string;
  [key: string]: TransformSpecValue | TransformSpecValue[];
}

export type TransformSpec =
  | FilterTransformSpec
  | FunnelTransformSpec
  | PieTransformSpec
  | JoinTransformSpec
  | MapTransformSpec
  | PickTransformSpec
  | RangeTransformSpec
  | SortTransformSpec
  | StackTransformSpec
  | DodgeTransformSpec
  | IdentifierTransformSpec
  | BaseTransformSpec
  | MarkOverlapTransformSpec
  | LttbSampleTransformSpec;

export interface IProgressiveTransformResult<Output = any> {
  /** is progressive finished */
  unfinished: () => boolean;
  /** return all the result */
  output: () => Output;
  /** the output result of current progressive run */
  progressiveOutput: () => Output;
  /** run in progressive mode */
  progressiveRun: () => void;
  /** release the progressive context */
  release: () => void;
}

export interface IProgressiveTransform<Output = any> {
  progressive: IProgressiveTransformResult<Output>;
}

export type IFunctionTransform<Options = any, Input = any, Output = any> = (
  options?: Options,
  data?: Input,
  params?: Record<string, any>,
  view?: IView
) => Output | Promise<Output> | IProgressiveTransformResult<Output>;
export interface ITransform<Options = any, Input = any, Output = any> {
  type: string;
  markPhase?: 'beforeJoin' | 'afterEncode' | 'afterEncodeItems';
  /** 是否支持渐进流程 */
  canProgressive?: boolean;
  /** transform function */
  transform: IFunctionTransform<Options, Input, Output>;
}
