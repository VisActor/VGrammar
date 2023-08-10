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

export interface BinTransformOption {
  field: string;
  extent: [number, number];
  step?: number;
  bins?: number;
  as?: [string, string];
}

export interface ContourTransformOption {
  field: string;
  row: number;
  column: number;
  thresholds?: number[];
  levels?: number;
  asThreshold?: string;
  asPoints?: string;
}

export interface FilterTransformOption {
  callback: (entry: any, params: any) => boolean;
}

export interface FunnelTransformOption {
  /** the field to of measure */
  field: string;
  /** the filed of transform ration(the value of next level/ the value of current level)**/
  asTransformRatio?: string;
  /**  the filed of reach ration(the value of current level/ the value of prev level)）*/
  asReachRatio?: string;
  /** the field of height ratio **/
  asHeightRatio?: string;
  /** the field of value ration(this value of current level / this value of first level ) */
  asValueRatio?: string;
  /** the field of last value ratio(the value of last level / this value of first level) */
  asLastValueRatio?: string;
  /** the field of next value ratio(the value of next level / this value of first level) */
  asNextValueRatio?: string;
  /** the field of current value */
  asCurrentValue?: string;
  /** the field of last value **/
  asLastValue?: string;
  /** the field of next value **/
  asNextValue?: string;
  /** whether or not the last level of the funnel is  a cone */
  isCone?: boolean;
  /** whether or not the height will be encode to value**/
  heightVisual?: boolean;

  /** the range of value */
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

export interface KDETransformOption {
  dimension?: '1d' | '2d';
  field: string | string[];
  bandwidth?: number;
  extent?: [number, number] | [{ x: number; y: number }, { x: number; y: number }];
  bins?: number | number[];
  as?: string[];
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
  // TODO: provide more order option referring to d3-shape
  order?: 'positive' | 'negative';
  offset?: 'none' | 'diverging' | 'silhouette' | 'wiggle';
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

export interface BinTransformSpec extends BinTransformOption {
  type: 'bin';
}

export interface ContourTransformSpec extends ContourTransformOption {
  type: 'contour';
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

export interface KDETransformSpec extends KDETransformOption {
  type: 'kde';
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
