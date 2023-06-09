import { registerAllHierarchyTransforms } from '../src';
import { getTransform } from '@visactor/vgrammar';

registerAllHierarchyTransforms();

test('transform of circle-packing', () => {
  const circlePacking = getTransform('circlePacking');

  expect(circlePacking).not.toBeUndefined();
  expect(circlePacking.transform).not.toBeUndefined();

  const res = circlePacking.transform({ width: 200, height: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res.length).toBe(1);

  const res2 = circlePacking.transform({ x0: 0, x1: 200, y0: 0, y1: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);
});

test('transform of tree', () => {
  const tree = getTransform('tree');
  expect(tree).not.toBeUndefined();
  expect(tree.transform).not.toBeUndefined();

  expect(tree).not.toBeUndefined();
  expect(tree.transform).not.toBeUndefined();

  const res = tree.transform({ width: 200, height: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res.length).toBe(1);

  const res2 = tree.transform({ x0: 0, x1: 200, y0: 0, y1: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);
});

test('transform of treemap', () => {
  const treemap = getTransform('treemap');
  expect(treemap).not.toBeUndefined();
  expect(treemap.transform).not.toBeUndefined();

  expect(treemap).not.toBeUndefined();
  expect(treemap.transform).not.toBeUndefined();

  const res = treemap.transform({ width: 200, height: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res.length).toBe(1);

  const res2 = treemap.transform({ x0: 0, x1: 200, y0: 0, y1: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);
});

test('transform of sunburst', () => {
  const sunburst = getTransform('sunburst');
  expect(sunburst).not.toBeUndefined();
  expect(sunburst.transform).not.toBeUndefined();

  expect(sunburst).not.toBeUndefined();
  expect(sunburst.transform).not.toBeUndefined();

  const res = sunburst.transform({ width: 200, height: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res.length).toBe(1);

  const res2 = sunburst.transform({ x0: 0, x1: 200, y0: 0, y1: 200 }, [{ children: [{ value: 1 }] }]);

  expect(res2.length).toBe(1);
  expect(res2[0]).toEqual(res[0]);
});
