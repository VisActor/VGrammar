import { TreemapLayout, flattenNodes, TreeLayout, flattenTreeLinks } from '../src';
import { mockData } from './data/tree';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

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
test('formatNodeRect(mockData) ', () => {
  const layout = new TreemapLayout();
  const result = layout.layout(mockData, { width: 200, height: 200 });
  const rects = flattenNodes(result, [], { maxDepth: 2 });

  expect(rects.length).toBe(22);
  expect(rects[0]).toMatchObject({ x0: 0, x1: 200, y0: 0, y1: 200, depth: 0, maxDepth: 3, flattenIndex: 0, index: 0 });
  expect(rects[1]).toMatchObject({ x0: 0, x1: 100, y0: 0, depth: 1, maxDepth: 3, flattenIndex: 1, index: 0 });
  expect(rects[7]).toMatchObject({
    depth: 2,
    flattenIndex: 22,
    index: 5,
    maxDepth: 3,
    x1: 100
  });
});

test('flattenTreeLinks()', () => {
  const layout = new TreeLayout({ nodeKey: 'name' });
  const result = layout.layout(mockData, { width: 800, height: 400 });
  const links = flattenTreeLinks(result);

  expect(links.length).toBe(75);
  expect(links[0].source.key).toBe('root');
  expect(links[0].target.key).toBe('品牌 A');
  expect(links[0].key).toBe(`root~品牌 A`);
  expect(links[0].x0).toBeCloseTo(0);
  expect(links[0].x1).toBeCloseTo(266.66666666667);
  expect(links[0].y0).toBeCloseTo(200);
  expect(links[0].y1).toBeCloseTo(66.66666666667);

  const lastLink = links[links.length - 1];
  expect(lastLink.source.key).toBe('西南');
  expect(lastLink.target.key).toBe('电子设备');
  expect(lastLink.key).toBe(`西南~电子设备`);

  expect(lastLink.x0).toBeCloseTo(533.3333333333334);
  expect(lastLink.x1).toBeCloseTo(800);
  expect(lastLink.y0).toBeCloseTo(388.88888888888886);
  expect(lastLink.y1).toBeCloseTo(394.44444444444446);
});
