/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/accessor.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { isNil } from '@visactor/vutils';

export const accessor = (fn: any, fields?: string[], name?: string) => {
  fn.fields = fields || [];
  fn.fname = name;
  return fn;
};

export function accessorName(fn: any) {
  return isNil(fn) ? null : (fn.fname as string);
}

export function accessorFields(fn: any) {
  return isNil(fn) ? null : fn.fields;
}
