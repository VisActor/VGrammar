import { id, identity, zero, one, truthy, falsy, emptyObject } from '../src';

test('accessor id()', () => {
  expect(id.fields).toEqual(['id']);
  expect(id.fname).toBe('id');
  expect(id({ id: 2 })).toBe(2);
});

test('accessor identity()', () => {
  expect(identity.fields).toEqual([]);
  expect(identity.fname).toBe('identity');

  const a = { a: 3 };
  expect(identity(a)).toBe(a);
});

test('accessor zero()', () => {
  expect(zero.fields).toEqual([]);
  expect(zero.fname).toBe('zero');

  const a = { a: 3 };
  expect(zero(a)).toBe(0);
});

test('accessor one()', () => {
  expect(one.fields).toEqual([]);
  expect(one.fname).toBe('one');

  const a = { a: 3 };
  expect(one(a)).toBe(1);
});

test('accessor truthy()', () => {
  expect(truthy.fields).toEqual([]);
  expect(truthy.fname).toBe('true');

  const a = { a: 3 };
  expect(truthy(a)).toBeTruthy();
});

test('accessor falsy()', () => {
  expect(falsy.fields).toEqual([]);
  expect(falsy.fname).toBe('false');

  const a = { a: 3 };
  expect(falsy(a)).toBeFalsy();
});

test('accessor emptyObject()', () => {
  expect(emptyObject.fields).toEqual([]);
  expect(emptyObject.fname).toBe('emptyObject');

  const a = { a: 3 };
  expect(emptyObject(a)).toEqual({});
});
