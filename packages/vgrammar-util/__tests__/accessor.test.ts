import { accessor } from '../src';

test('accessor a arrow function', () => {
  const func = () => {
    return 'a';
  };
  const fields = ['a', 'b', 'c'];
  const fname = 'accessor';

  const a1 = accessor(func);
  expect(a1).toBe(func);
  expect(a1.fields).toEqual([]);
  expect(a1.fname).toBeUndefined();

  const a2 = accessor(func, fields);
  expect(a2).toBe(func);
  expect(a2.fields).toBe(fields);
  expect(a2.fname).toBeUndefined();

  const a3 = accessor(func, null, fname);
  expect(a3).toBe(func);
  expect(a3.fields).toEqual([]);
  expect(a3.fname).toBe(fname);

  const a4 = accessor(func, fields, fname);
  expect(a4).toBe(func);
  expect(a4.fields).toBe(fields);
  expect(a4.fname).toBe(fname);
});

test('accessor a simple function', () => {
  function test() {
    return 'test';
  }
  const fields = ['a', 'b', 'c'];
  const fname = 'accessor';

  const a1 = accessor(test);
  expect(a1).toBe(test);
  expect(a1.fields).toEqual([]);
  expect(a1.fname).toBeUndefined();

  const a2 = accessor(test, fields);
  expect(a2).toBe(test);
  expect(a2.fields).toBe(fields);
  expect(a2.fname).toBeUndefined();

  const a3 = accessor(test, null, fname);
  expect(a3).toBe(test);
  expect(a3.fields).toEqual([]);
  expect(a3.fname).toBe(fname);

  const a4 = accessor(test, fields, fname);
  expect(a4).toBe(test);
  expect(a4.fields).toBe(fields);
  expect(a4.fname).toBe(fname);
});
