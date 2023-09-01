import { toPercent } from '../src/toPercent';

test('percent string', function () {
  expect(toPercent('10%', 100)).toBe(10);
  expect(toPercent('200%', 100)).toBe(200);
});

test('null / undefined', function () {
  expect((toPercent as any)(undefined, 100)).toBe(100);
  expect((toPercent as any)(null, 100)).toBe(100);
});

test('percent value', function () {
  expect(toPercent(50, 100)).toBe(50);
  expect(toPercent(200, 100)).toBe(200);
});
