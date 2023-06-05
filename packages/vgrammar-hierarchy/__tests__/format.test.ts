import { TreemapLayout, flattenNodes } from '../src';

test('formatNodeRect()', () => {
  const data = [
    { children: [{ value: 50 }, { value: 30 }, { value: 20 }], value: 100 },
    { children: [{ value: 40 }, { value: 30 }, { value: 10 }], value: 100 }
  ];

  const layout = new TreemapLayout();
  const result = layout.layout(data, { width: 200, height: 200 });
  const rects = flattenNodes(result);

  expect(rects.length).toBe(8);
  expect(rects[0]).toMatchObject({ x0: 0, x1: 200, y0: 0, y1: 100, depth: 0, maxDepth: 1, flattenIndex: 0, index: 0 });
  expect(rects[1]).toMatchObject({ x0: 0, x1: 100, y0: 0, y1: 100, depth: 1, maxDepth: 1, flattenIndex: 1, index: 0 });
  expect(rects[7]).toMatchObject({
    x0: 140,
    x1: 200,
    y0: 100,
    y1: 200,
    depth: 1,
    maxDepth: 1,
    flattenIndex: 7,
    index: 2
  });
});
