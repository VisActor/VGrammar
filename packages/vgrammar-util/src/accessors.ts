/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/accessors.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { accessor } from './accessor';
import { field } from './field';

export const id = field('id');

export const identity = accessor(
  function (_: any) {
    return _;
  },
  [],
  'identity'
);

export const zero = accessor(
  function () {
    return 0;
  },
  [],
  'zero'
);

export const one = accessor(
  function () {
    return 1;
  },
  [],
  'one'
);

export const truthy = accessor(
  function () {
    return true;
  },
  [],
  'true'
);

export const falsy = accessor(
  function () {
    return false;
  },
  [],
  'false'
);

export const emptyObject = accessor(
  function () {
    return {};
  },
  [],
  'emptyObject'
);
