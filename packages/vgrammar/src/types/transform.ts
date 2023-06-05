import type { SignalReference } from './signal';
import type { IView } from './view';

export type AggregateOperatorType =
  | 'argmax'
  | 'argmin'
  | 'average'
  | 'count'
  | 'distinct'
  | 'max'
  | 'mean'
  | 'median'
  | 'min'
  | 'missing'
  | 'product'
  | 'q1'
  | 'q3'
  | 'ci0'
  | 'ci1'
  | 'stderr'
  | 'stdev'
  | 'stdevp'
  | 'sum'
  | 'valid'
  | 'values'
  | 'variance'
  | 'variancep';

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

export interface BaseTransformSpec {
  /** the type of transform */
  type: string;
  [key: string]: TransformSpecValue | TransformSpecValue[];
}

export interface AggregateTransformSpec extends BaseTransformSpec {
  type: 'aggregate';
  /** 数据源对应的名称 */
  from?: string;
  groupBy?: string[] | SignalReference;
  fields?: string[] | SignalReference;
  operations?: AggregateOperatorType[] | SignalReference;
  as?: string[] | SignalReference;
  drop?: boolean | SignalReference;
  cross?: boolean | SignalReference;
  key?: string | SignalReference;
}

export type TransformSpec = AggregateTransformSpec | BaseTransformSpec;

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
