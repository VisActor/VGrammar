import { registerSankeyTransforms } from '../src';
import { Factory } from '@visactor/vgrammar-core';

registerSankeyTransforms();

test('transform of sankey', () => {
  const transform = Factory.getTransform('sankey');

  expect(transform).not.toBeUndefined();
  expect(transform.transform).not.toBeUndefined();

  const res = transform.transform({ width: 200, height: 200 }, { links: [{ source: 'A', target: 'B', value: 1 }] });

  expect(res.length).toBe(1);

  const res2 = transform.transform(
    { x0: 0, x1: 200, y0: 0, y1: 200 },
    { links: [{ source: 'A', target: 'B', value: 1 }] }
  );

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);
});
