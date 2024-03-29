/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/field.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { isArray, isFunction } from '@visactor/vutils';
import { accessor } from './accessor';
import { getter } from './getter';
import { splitAccessPath } from './splitAccessPath';
import type { FieldGetterFunction, FieldGetterGeneratorOptions } from './types';

const fieldSingle = (fieldStr: string | FieldGetterFunction, name?: string, opt: FieldGetterGeneratorOptions = {}) => {
  if (isFunction(fieldStr)) {
    return fieldStr;
  }

  const path = splitAccessPath(fieldStr);
  const parsedField = path.length === 1 ? path[0] : fieldStr;

  return accessor(((opt && opt.get) || getter)(path), [parsedField], name || parsedField);
};

export const field = (
  fieldStr: string | string[] | FieldGetterFunction | FieldGetterFunction[],
  name?: string,
  opt: FieldGetterGeneratorOptions = {}
) => {
  if (isArray(fieldStr)) {
    const funcs = fieldStr.map(entry => fieldSingle(entry, name, opt));

    return (datum: any) => {
      return funcs.map(func => func(datum));
    };
  }

  return fieldSingle(fieldStr, name, opt);
};
