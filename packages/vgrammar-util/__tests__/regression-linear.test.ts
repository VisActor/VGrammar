import { regressionLinear } from '../src';

test('regressionLinear()', function () {
  const arr = [
    {
      x: 1,
      y: 2
    },
    {
      x: 2,
      y: 4
    }
  ];
  const res = regressionLinear(arr);
  expect(res.coef).toEqual([0, 2]);
  expect(res.predict(1)).toBeCloseTo(2);
});
