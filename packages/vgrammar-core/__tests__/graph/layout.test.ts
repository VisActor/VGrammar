import { doGridLayout } from '../../src/graph/layout/grid';
import { doRelativeLayout } from '../../src/graph/layout/relative';
import { emptyFunction } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('grid layout', function () {
  const group = {
    getSpec: () => {
      return {
        layout: { display: 'grid', gridTemplateRows: [100, 200], gridTemplateColumns: [100, 200, 100] }
      };
    }
  } as any;
  const bounds = { width: () => 300, height: () => 400 } as any;
  const marks = [
    {
      getSpec: () => {
        return { layout: { gridRowStart: 0, gridRowEnd: 1, gridColumnStart: 0, gridColumnEnd: 2 } };
      },
      commit: emptyFunction
    },
    {
      getSpec: () => {
        return { layout: { gridRowStart: 0, gridRowEnd: 2, gridColumnStart: 0, gridColumnEnd: 3 } };
      },
      commit: emptyFunction
    }
  ] as any[];

  doGridLayout(group, marks, bounds, {});
  expect(marks[0].layoutBounds.x1).toBe(0);
  expect(marks[0].layoutBounds.x2).toBe(0);
  expect(marks[0].layoutBounds.y1).toBe(0);
  expect(marks[0].layoutBounds.y2).toBe(100);

  expect(marks[1].layoutBounds.x1).toBe(0);
  expect(marks[1].layoutBounds.x2).toBe(100);
  expect(marks[1].layoutBounds.y1).toBe(0);
  expect(marks[1].layoutBounds.y2).toBe(300);
});

test('relative layout', function () {
  const group = {
    getSpec: () => {
      return {
        layout: { display: 'relative' }
      };
    }
  } as any;
  const bounds = {
    x1: 0,
    y1: 0,
    x2: 300,
    y2: 400,
    width: () => 300,
    height: () => 400,
    clone: () => ({ x1: 0, y1: 0, x2: 300, y2: 400, width: () => 300, height: () => 400 })
  } as any;
  const marks = [
    {
      getSpec: () => {
        return { layout: {} };
      },
      getBounds: () => ({ x1: 0, y1: 0, x2: 50, y2: 50, width: () => 50, height: () => 50 }),
      commit: emptyFunction
    },
    {
      getSpec: () => {
        return { layout: { position: 'top', align: 'center', padding: 20 } };
      },
      getBounds: () => ({ x1: 0, y1: 0, x2: 50, y2: 50, width: () => 50, height: () => 50 }),
      commit: emptyFunction
    }
  ] as any[];

  doRelativeLayout(group, marks, bounds, {});

  expect(marks[0].layoutBounds.x1).toBe(0);
  expect(marks[0].layoutBounds.x2).toBe(300);
  expect(marks[0].layoutBounds.y1).toBe(90);
  expect(marks[0].layoutBounds.y2).toBe(400);

  expect(marks[1].layoutBounds.x1).toBe(105);
  expect(marks[1].layoutBounds.x2).toBe(195);
  expect(marks[1].layoutBounds.y1).toBe(0);
  expect(marks[1].layoutBounds.y2).toBe(90);
});
