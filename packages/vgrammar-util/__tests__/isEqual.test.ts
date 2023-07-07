import { isEqual } from '../src';

test('isEqual() of simple type', function () {
  expect(isEqual('any', 1, 1)).toBeTruthy();
  expect(isEqual('any', undefined, undefined)).toBeTruthy();
  expect(isEqual('any', undefined, null)).toBeTruthy();
  expect(isEqual('any', null, null)).toBeTruthy();
  expect(isEqual('any', null, 1)).toBeFalsy();
  expect(isEqual('any', undefined, 1)).toBeFalsy();
  expect(isEqual('any', 1, null)).toBeFalsy();
  expect(isEqual('any', 1, undefined)).toBeFalsy();
  expect(isEqual('any', 'test', 'test')).toBeTruthy();
  expect(isEqual('any', true, true)).toBeTruthy();
  expect(isEqual('any', false, false)).toBeTruthy();
});

test('isEqual() of array', function () {
  const arrA = ['a', 'b'];
  const arrB = ['a', 'b'];
  const arrC = ['b', 'b'];
  const objD = { '0': 'a', '1': 'b' };

  expect(isEqual('any', arrA, arrA)).toBeTruthy();
  expect(isEqual('0', arrA, arrA)).toBeTruthy();
  expect(isEqual('0', arrA, arrB)).toBeTruthy();
  expect(isEqual('0', arrB, arrC)).toBeFalsy();
  expect(isEqual('1', arrB, arrC)).toBeFalsy();
  expect(isEqual('1', arrB, arrC, false)).toBeFalsy();
  expect(isEqual('0', arrA, objD)).toBeFalsy();
});

test('isEqual() of object', function () {
  const objA = { '0': 'a', '1': 'b', '2': { test: '1' } };
  const objB = { '0': [1, 2], '1': 'c', '2': { test: '1' } };
  const objC = { '0': [1, 2], '1': 'd' };
  const objD = { '0': 'a', '1': 'b' };

  expect(isEqual('0', objA, objD)).toBeTruthy();
  expect(isEqual('1', objA, objD)).toBeTruthy();
  expect(isEqual('2', objA, objB, false)).toBeFalsy();
  expect(isEqual('2', objA, objB)).toBeTruthy();
  expect(isEqual('0', objC, objB)).toBeTruthy();
  expect(isEqual('0', objC, objB, false)).toBeFalsy();
});
