import { transform } from '../../src/transforms/data/circular-relation';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('circular-relation', () => {
  const data = [
    {
      text: '测试',
      relation: 111
    },
    {
      text: '测试',
      relation: 200
    },
    {
      text: '测试',
      relation: 150
    },
    {
      text: '测试',
      relation: 160
    }
  ];
  const res = transform(
    {
      field: 'relation',
      width: 400,
      height: 600,
      radiusRange: [10, 20]
    },
    data
  );

  expect(res[0].radius).toBeCloseTo(10);
  expect(res[0].x).toBeCloseTo(200);
  expect(res[0].y).toBeCloseTo(300);

  expect(res[1].radius).toBeCloseTo(20);
  expect(res[1].x).toBeCloseTo(23.664424312258234);
  expect(res[1].y).toBeCloseTo(57.29490168751562);

  expect(res[2].radius).toBeCloseTo(14.382022471910112);
  expect(res[2].x).toBeCloseTo(200);
  expect(res[2].y).toBeCloseTo(431.4606741573034);

  expect(res[3].radius).toBeCloseTo(15.50561797752809);
  expect(res[3].x).toBeCloseTo(199.99999999999997);
  expect(res[3].y).toBeCloseTo(134.8314606741573);
});
