/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/field.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { accessor } from './accessor';
import { getter } from './getter';
import { splitAccessPath } from './splitAccessPath';
import type { FieldGetterGeneratorOptions } from './types';

export const field = (fieldStr: string, name?: string, opt: FieldGetterGeneratorOptions = {}) => {
  const path = splitAccessPath(fieldStr);
  const parsedField = path.length === 1 ? path[0] : fieldStr;

  return accessor(((opt && opt.get) || getter)(path), [parsedField], name || parsedField);
};
