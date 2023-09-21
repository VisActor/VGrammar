import { registerAllHierarchyTransforms } from '../src';
import { Factory } from '@visactor/vgrammar-core';
import { mockData } from './data/tree';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

registerAllHierarchyTransforms();

test('transform of circle-packing', () => {
  const circlePacking = Factory.getTransform('circlePacking');

  expect(circlePacking).not.toBeUndefined();
  expect(circlePacking.transform).not.toBeUndefined();

  const res = circlePacking.transform({ width: 200, height: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res.length).toBe(1);

  const res2 = circlePacking.transform({ x0: 0, x1: 200, y0: 0, y1: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);

  const res3 = circlePacking.transform({ x0: 0, x1: 200, y0: 0, y1: 200, flatten: true }, mockData);
  expect(res3.length).toBe(76);
});

test('transform of tree', () => {
  const tree = Factory.getTransform('tree');
  expect(tree).not.toBeUndefined();
  expect(tree.transform).not.toBeUndefined();

  expect(tree).not.toBeUndefined();
  expect(tree.transform).not.toBeUndefined();

  const res = tree.transform({ width: 200, height: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res.length).toBe(1);

  const res2 = tree.transform({ x0: 0, x1: 200, y0: 0, y1: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);

  const res3 = tree.transform({ x0: 0, x1: 200, y0: 0, y1: 200, flatten: true }, mockData);
  expect(res3.nodes.length).toBe(76);
  expect(res3.links.length).toBe(75);
});

test('transform of treemap', () => {
  const treemap = Factory.getTransform('treemap');
  expect(treemap).not.toBeUndefined();
  expect(treemap.transform).not.toBeUndefined();

  expect(treemap).not.toBeUndefined();
  expect(treemap.transform).not.toBeUndefined();

  const res = treemap.transform({ width: 200, height: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res.length).toBe(1);

  const res2 = treemap.transform({ x0: 0, x1: 200, y0: 0, y1: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);

  const res3 = treemap.transform({ x0: 0, x1: 200, y0: 0, y1: 200, flatten: true }, mockData);
  expect(res3.length).toBe(76);
});

test('transform of sunburst', () => {
  const sunburst = Factory.getTransform('sunburst');
  expect(sunburst).not.toBeUndefined();
  expect(sunburst.transform).not.toBeUndefined();

  expect(sunburst).not.toBeUndefined();
  expect(sunburst.transform).not.toBeUndefined();

  const res = sunburst.transform({ width: 200, height: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res.length).toBe(1);

  const res2 = sunburst.transform({ x0: 0, x1: 200, y0: 0, y1: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);

  const res3 = sunburst.transform({ x0: 0, x1: 200, y0: 0, y1: 200, flatten: true }, mockData);
  expect(res3.length).toBe(76);
});
