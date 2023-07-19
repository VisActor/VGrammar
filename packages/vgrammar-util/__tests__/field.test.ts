/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/test/field-test.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { field } from '../src/field';
import { accessorName, accessorFields } from '../src/accessor';

test('field creates a field accessor', () => {
  let f = field('x');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x');
  expect(accessorFields(f)).toEqual(['x']);
  expect(f({ x: 'foo' })).toBe('foo');
  expect(f({ x: 0 })).toBe(0);

  f = field('x\\.y');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x.y');
  expect(accessorFields(f)).toEqual(['x.y']);
  expect(f({ 'x.y': 'foo' })).toBe('foo');
  expect(f({ 'x.y': 0 })).toBe(0);

  f = field('[x.y]');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x.y');
  expect(accessorFields(f)).toEqual(['x.y']);
  expect(f({ 'x.y': 'foo' })).toBe('foo');
  expect(f({ 'x.y': 0 })).toBe(0);

  // eslint-disable-next-line quotes
  f = field("['x.y']");
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x.y');
  expect(accessorFields(f)).toEqual(['x.y']);
  expect(f({ 'x.y': 'foo' })).toBe('foo');
  expect(f({ 'x.y': 0 })).toBe(0);

  f = field('[1].x');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('[1].x');
  expect(accessorFields(f)).toEqual(['[1].x']);
  expect(f([{ x: 'foo' }, { x: 'bar' }])).toBe('bar');
  expect(f([{ x: 1 }, { x: 0 }])).toBe(0);

  f = field('x["y"].z');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x["y"].z');
  expect(accessorFields(f)).toEqual(['x["y"].z']);
  expect(f({ x: { y: { z: 'bar' } } })).toBe('bar');
  expect(f({ x: { y: { z: 0 } } })).toBe(0);

  f = field('x[y].z');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x[y].z');
  expect(accessorFields(f)).toEqual(['x[y].z']);
  expect(f({ x: { y: { z: 'bar' } } })).toBe('bar');
  expect(f({ x: { y: { z: 0 } } })).toBe(0);

  f = field('x["a.b"].z');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x["a.b"].z');
  expect(accessorFields(f)).toEqual(['x["a.b"].z']);
  expect(f({ x: { 'a.b': { z: 'bar' } } })).toBe('bar');
  expect(f({ x: { 'a.b': { z: 0 } } })).toBe(0);

  f = field('x[a.b].z');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x[a.b].z');
  expect(accessorFields(f)).toEqual(['x[a.b].z']);
  expect(f({ x: { 'a.b': { z: 'bar' } } })).toBe('bar');
  expect(f({ x: { 'a.b': { z: 0 } } })).toBe(0);

  f = field('x[a b].z');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x[a b].z');
  expect(accessorFields(f)).toEqual(['x[a b].z']);
  expect(f({ x: { 'a b': { z: 'bar' } } })).toBe('bar');
  expect(f({ x: { 'a b': { z: 0 } } })).toBe(0);

  f = field('x.a b.z');
  expect(typeof f).toBe('function');
  expect(accessorName(f)).toBe('x.a b.z');
  expect(accessorFields(f)).toEqual(['x.a b.z']);
  expect(f({ x: { 'a b': { z: 'bar' } } })).toBe('bar');
  expect(f({ x: { 'a b': { z: 0 } } })).toBe(0);
});

test('field(function(){})', () => {
  const func = (datum: any) => datum.x;
  const f = field(func);
  expect(typeof f).toBe('function');
  expect(f).toBe(func);
  expect(f({ x: 'foo' })).toBe('foo');
  expect(f({ x: 0 })).toBe(0);
});

test('field() of function array', () => {
  const funcA = (datum: any) => datum.x;
  const funcB = (datum: any) => datum.x1;

  const f = field([funcA, funcB]);
  expect(typeof f).toBe('function');
  expect(f({ x: 'foo', x1: '6' })).toEqual(['foo', '6']);
  expect(f({ x: 0 })).toEqual([0, undefined]);
});

test('field() of string array', () => {
  const f = field(['x', 'x1']);
  expect(typeof f).toBe('function');
  expect(f({ x: 'foo', x1: '6' })).toEqual(['foo', '6']);
  expect(f({ x: 0 })).toEqual([0, undefined]);
});
