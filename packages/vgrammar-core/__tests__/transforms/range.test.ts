import { transform } from '../../src/transforms/data/range';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('basic range', () => {
  expect(
    transform({
      start: 0,
      stop: 5
    })
  ).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }]);
});

test('basic aggregate', () => {
  expect(
    transform({
      start: 1,
      stop: 10,
      step: 2,
      as: 'value'
    })
  ).toEqual([{ value: 1 }, { value: 3 }, { value: 5 }, { value: 7 }, { value: 9 }]);
});
