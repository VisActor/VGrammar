import { transform } from '../../src/transforms/data/circular-relation';

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
  expect(res[1].x).toBeCloseTo(77.97900707726004);
  expect(res[1].y).toBeCloseTo(574.0636372927803);

  expect(res[2].radius).toBeCloseTo(14.382022471910112);
  expect(res[2].x).toBeCloseTo(68.53932584269663);
  expect(res[2].y).toBeCloseTo(300);

  expect(res[3].radius).toBeCloseTo(15.50561797752809);
  expect(res[3].x).toBeCloseTo(199.99999999999997);
  expect(res[3].y).toBeCloseTo(134.8314606741573);
});
