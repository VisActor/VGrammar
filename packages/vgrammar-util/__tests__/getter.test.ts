import { getter } from '../src';

test('getter(arr)', () => {
  expect(getter(['a'])({ a: 1 })).toEqual(1);
  expect(getter(['a', 'b'])({ a: { b: 1 } })).toEqual(1);
  expect(getter(['a', 'b'])({ a: { b: { c: 2 } } })).toEqual({ c: 2 });
});
