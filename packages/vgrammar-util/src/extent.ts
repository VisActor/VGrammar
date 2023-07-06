/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/extent.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { isFunction, isNumber, isNil } from '@visactor/vutils';
import type { ReturnNumberFunction } from './types';

/**
 * Return an array with minimum and maximum values, in the
 * form [min, max]. Ignores null, undefined, and NaN values.
 */
export const extent = (array: any[], func?: ReturnNumberFunction) => {
  const valueGetter = isFunction(func) ? func : (val: any) => val;
  let min: number;
  let max: number;

  if (array && array.length) {
    const n = array.length;

    // find first valid value
    for (let i = 0; i < n; i += 1) {
      const value = valueGetter(array[i]);
      if (isNumber(value) && !Number.isNaN(value)) {
        if (isNil(min)) {
          min = value;
          max = value;
        } else {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      }
    }

    return [min, max];
  }

  return [min, max];
};
