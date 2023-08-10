import type { GrammarSpec, IData } from './grammar';
import type { GenericFunctionType, ParameterFunctionType } from './signal';
import type { TransformSpec } from './transform';

export type Datum = any;

export type DataFunctionCallback<T> = (datum: any, parameters: any) => T;

export type DataFunctionType<T> = GenericFunctionType<DataFunctionCallback<T>, T>;

export type DataType = 'boolean' | 'number' | 'date' | 'string';
export type DataParseSpec =
  | 'auto'
  | {
      [f: string]: DataType | string;
    };
export interface FormatJSONSpec {
  type: 'json';
  parse?: DataParseSpec;
  property?: string;
  copy?: boolean;
}
export interface FormatSVSpec {
  type: 'csv' | 'tsv';
  header?: string[];
  parse?: DataParseSpec;
}
export interface FormatDSVSpec {
  type: 'dsv';
  header?: string[];
  parse?: DataParseSpec;
  delimiter: string;
}
export type FormatTopoJSONSpec = {
  type: 'topojson';
  property?: string;
} & (
  | {
      feature: string;
    }
  | {
      mesh: string;
      filter: 'interior' | 'exterior' | null;
    }
);
export type DataFormatSpec = FormatJSONSpec | FormatSVSpec | FormatDSVSpec;
// | FormatTopoJSONSpec
// | { parse: DataParseSpec };

export interface IDataFilter {
  source?: string;
  rank?: number;
  filter: (data: Datum[], parameters?: any) => Datum[];
}

/** 语法元素 Data 配置 */
export interface DataSpec extends GrammarSpec {
  /** 数据的唯一标识符 */
  name?: string;
  /** 数据变换配置 */
  transform?: TransformSpec[];
  /**
   * 原始数据配置，解析优先级最高
   */
  values?: Datum[];
  /**
   * 数据url配置，解析优先级第二
   */
  url?: ParameterFunctionType<string>;
  /**
   * 数据源配置，对应的其他Data元素的name
   */
  source?: string | string[] | IData | IData[];
  /**
   * 格式化方法
   */
  format?: ParameterFunctionType<DataFormatSpec>;
}
/**
 * the type of sort
 */
export type SortOrderType = 'desc' | 'asc';

/**
 * config of sort
 */
export interface SortConfigSpec {
  /** the field to be sort */
  field: string | string[];
  /**
   * the order of each field
   */
  order?: SortOrderType | SortOrderType[];
}
