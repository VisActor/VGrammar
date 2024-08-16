import { identity, zero } from '../src';

test('accessor identity()', () => {
  const a = { a: 3 };
  expect(identity(a)).toBe(a);
});

test('accessor zero()', () => {
  const a = { a: 3 };
  expect(zero(a)).toBe(0);
});
