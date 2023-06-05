/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/test/compare-test.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { compare } from '../src/compare';
import { accessorFields } from '../src/accessor';
import { field } from '../src/field';

test('compare compares numbers', () => {
  const c = compare('x');
  expect(c({ x: 1 }, { x: 0 })).toEqual(1);
  expect(c({ x: 0 }, { x: 1 })).toEqual(-1);
  expect(c({ x: 1 }, { x: 1 })).toEqual(0);
  expect(c({ x: 0 }, { x: null })).toEqual(1);
  expect(c({ x: null }, { x: 0 })).toEqual(-1);
  expect(c({ x: -1 }, { x: null })).toEqual(1);
  expect(c({ x: null }, { x: -1 })).toEqual(-1);
  expect(c({ x: 0 }, { x: undefined })).toEqual(1);
  expect(c({ x: undefined }, { x: 0 })).toEqual(-1);
  expect(c({ x: 0 }, { x: NaN })).toEqual(1);
  expect(c({ x: NaN }, { x: 0 })).toEqual(-1);
});

test('compare compares strings', () => {
  const c = compare('x');
  expect(c({ x: 'b' }, { x: 'a' })).toEqual(1);
  expect(c({ x: 'a' }, { x: 'b' })).toEqual(-1);
  expect(c({ x: 'b' }, { x: 'b' })).toEqual(0);
  expect(c({ x: 'a' }, { x: '' })).toEqual(1);
  expect(c({ x: '' }, { x: 'a' })).toEqual(-1);
  expect(c({ x: '' }, { x: null })).toEqual(1);
  expect(c({ x: null }, { x: '' })).toEqual(-1);
  expect(c({ x: '' }, { x: undefined })).toEqual(1);
  expect(c({ x: undefined }, { x: '' })).toEqual(-1);
  expect(c({ x: '' }, { x: NaN })).toEqual(1);
  expect(c({ x: NaN }, { x: '' })).toEqual(-1);
});

test('compare compares dates', () => {
  const c = compare('x');
  expect(c({ x: new Date(1) }, { x: new Date(0) })).toEqual(1);
  expect(c({ x: new Date(0) }, { x: new Date(1) })).toEqual(-1);
  expect(c({ x: new Date(1) }, { x: new Date(1) })).toEqual(0);
  expect(c({ x: new Date(0) }, { x: new Date(NaN) })).toEqual(1);
  expect(c({ x: new Date(NaN) }, { x: new Date(0) })).toEqual(-1);
  expect(c({ x: new Date(NaN) }, { x: new Date(NaN) })).toEqual(0);
  expect(c({ x: new Date(0) }, { x: null })).toEqual(1);
  expect(c({ x: null }, { x: new Date(0) })).toEqual(-1);
  expect(c({ x: new Date(0) }, { x: undefined })).toEqual(1);
  expect(c({ x: undefined }, { x: new Date(0) })).toEqual(-1);
  expect(c({ x: new Date(0) }, { x: NaN })).toEqual(1);
  expect(c({ x: NaN }, { x: new Date(0) })).toEqual(-1);
});

test('compare compares null, undefined and NaN', () => {
  const c = compare('x');
  // null and undefined are treated as equivalent
  expect(c({ x: null }, { x: undefined })).toEqual(0);
  expect(c({ x: undefined }, { x: null })).toEqual(0);
  // NaN is greater than null or undefined
  expect(c({ x: null }, { x: NaN })).toEqual(-1);
  expect(c({ x: NaN }, { x: null })).toEqual(1);
  expect(c({ x: undefined }, { x: NaN })).toEqual(-1);
  expect(c({ x: NaN }, { x: undefined })).toEqual(1);
  // values are equivalent to themselves
  expect(c({ x: null }, { x: null })).toEqual(0);
  expect(c({ x: undefined }, { x: undefined })).toEqual(0);
  expect(c({ x: NaN }, { x: NaN })).toEqual(0);
});

test('compare supports descending order', () => {
  const c = compare('x', 'desc');
  expect(c({ x: 1 }, { x: 0 })).toEqual(-1);
  expect(c({ x: 0 }, { x: 1 })).toEqual(1);
  expect(c({ x: 1 }, { x: 1 })).toEqual(-0);
  expect(accessorFields(c)).toEqual(['x']);
});

test('compare supports nested comparison', () => {
  const c = compare(['x', 'y'], ['desc', 'asc']);

  expect(c({ x: 1, y: 0 }, { x: 0, y: 1 })).toEqual(-1);
  expect(c({ x: 0, y: 1 }, { x: 1, y: 0 })).toEqual(1);
  expect(c({ x: 0, y: 0 }, { x: 0, y: 1 })).toEqual(-1);
  expect(c({ x: 0, y: 1 }, { x: 0, y: 0 })).toEqual(1);
  expect(c({ x: 0, y: 0 }, { x: 0, y: 0 })).toEqual(0);

  expect(accessorFields(c)).toEqual(['x', 'y']);
});

test('compare supports accessor functions', () => {
  const fx = field('x');
  const fy = field('y');
  const c = compare([fx, fy], ['desc', 'asc']);

  expect(c({ x: 1, y: 0 }, { x: 0, y: 1 })).toEqual(-1);
  expect(c({ x: 0, y: 1 }, { x: 1, y: 0 })).toEqual(1);
  expect(c({ x: 0, y: 0 }, { x: 0, y: 1 })).toEqual(-1);
  expect(c({ x: 0, y: 1 }, { x: 0, y: 0 })).toEqual(1);
  expect(c({ x: 0, y: 0 }, { x: 0, y: 0 })).toEqual(0);
  expect(accessorFields(c)).toEqual(['x', 'y']);
});
