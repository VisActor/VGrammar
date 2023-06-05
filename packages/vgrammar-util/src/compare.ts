/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/compare.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { isNil, array, isFunction } from '@visactor/vutils';
import { accessor, accessorFields } from './accessor';
import { field } from './field';
import type { FieldGetterFunction, ParameterFields } from './types';

const DESCENDING = 'desc';

export const ascending = (u?: any, v?: any) => {
  if ((u < v || isNil(u)) && !isNil(v)) {
    return -1;
  }

  if ((u > v || isNil(v)) && !isNil(u)) {
    return 1;
  }

  const numericV = v instanceof Date ? +v : v;
  const numericU = u instanceof Date ? +u : u;

  if (Number.isNaN(numericU) && !Number.isNaN(numericV)) {
    return -1;
  }

  if (Number.isNaN(numericV) && !Number.isNaN(numericU)) {
    return 1;
  }

  return 0;
};

const compare1 = (fieldGetter: FieldGetterFunction, order: number) => (a: any, b: any) => {
  return ascending(fieldGetter(a), fieldGetter(b)) * order;
};

const compareN = (fields: FieldGetterFunction[], orders: number[], n: number) => {
  orders.push(0); // pad zero for convenient lookup
  return (a: any, b: any) => {
    let f;
    let c = 0;
    let i = -1;
    while (c === 0 && i + 1 < n) {
      i += 1;
      f = fields[i];
      c = ascending(f(a), f(b));
    }

    return c * orders[i];
  };
};

const comparator = (fields: FieldGetterFunction[], orders: number[]) =>
  fields.length === 1 ? compare1(fields[0], orders[0]) : compareN(fields, orders, fields.length);

export const compare = (fields: ParameterFields, orders?: string | string[], opt: any = {}) => {
  const arrayOrders: string[] = array(orders) || [];

  const ord: number[] = [];
  const get: FieldGetterFunction[] = [];
  const fmap = {};
  const gen = opt.comparator || comparator;

  array(fields).forEach((f, i) => {
    if (isNil(f)) {
      return;
    }
    ord.push(arrayOrders[i] === DESCENDING ? -1 : 1);
    const fieldGetter = isFunction(f) ? f : field(f, null, opt);
    get.push(fieldGetter);

    (accessorFields(fieldGetter) || []).forEach((fieldStr: string) => {
      fmap[fieldStr] = 1;
    });
  });

  return get.length === 0 ? null : accessor(gen(get, ord), Object.keys(fmap));
};
