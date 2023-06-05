/** 获取字段值的函数 */
export type FieldGetterFunction = (val: any) => any;

/** 根据字段路径，返回获取相应路径属性的函数 */
export type Getter = (path: string[]) => FieldGetterFunction;

/** field函数对应的参数 */
export interface FieldGetterGeneratorOptions {
  get?: Getter;
}

export type ParameterFieldEntry = string | FieldGetterFunction;
/** 获取若干字段的值对应的参数 */
export type ParameterFields = ParameterFieldEntry[] | ParameterFieldEntry;

/** 返回值为数值类型的函数 */
export type ReturnNumberFunction = (val: any) => number;

/** 输入值、返回值都为数值类型的函数 */
export type NumberTransformFunction = (val: number) => number;

/** 返回值为布尔类型的函数 */
export type ReturnBooleanFunction = (val: any) => boolean;

export type CompareFunction = (a: any, b: any) => number;
