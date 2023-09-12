import { Grid, registerGrid } from '../../src/component/grid';
import { Scale } from '../../src/view/scale';
import { emptyFunction, getMockedView } from '../util';

registerGrid();
test('line axis grid', function () {
  const view = getMockedView() as any;
  const xScale = new Scale(view, 'point').domain(['A', 'B', 'C']).range([0, 270]).configure({
    padding: 0.5
  });
  const grid = new Grid(view).scale(xScale).encode({
    x: 40,
    y: 310,
    start: { x: 0, y: 0 },
    end: { x: 270, y: 0 }
  });
  (grid as any).graphicParent = { appendChild: emptyFunction };
  (grid as any).evaluateJoin();
  (grid as any).evaluateEncode(grid.elements, (grid as any)._getEncoders(), {});

  expect(grid.elements.length).toBe(1);
  expect(grid.elements[0].getGraphicItem().attribute).toEqual({
    end: {
      x: 270,
      y: 0
    },
    items: [
      {
        id: 0,
        label: undefined,
        rawValue: undefined,
        value: NaN
      },
      {
        id: 1,
        label: undefined,
        rawValue: undefined,
        value: NaN
      }
    ],
    length: 270,
    start: {
      x: 0,
      y: 0
    },
    style: {
      lineDash: [4, 4],
      lineWidth: 1,
      stroke: '#f1f2f5',
      strokeOpacity: 1
    },
    subGrid: {
      style: {
        lineDash: [4, 4],
        lineWidth: 1,
        stroke: '#999',
        strokeOpacity: 1
      },
      visible: false
    },
    type: 'line',
    x: 40,
    y: 310
  });
});

test('circle axis grid', function () {
  const view = getMockedView() as any;
  const thetaScale = new Scale(view, 'point')
    .domain(['A', 'B', 'C'])
    .range([0, Math.PI * 2])
    .configure({ padding: 0.5 });
  const axis = new Grid(view)
    .scale(thetaScale)
    .gridType('circle')
    .encode({
      center: { x: 200, y: 200 },
      radius: 160,
      grid: { visible: true }
    });
  (axis as any).graphicParent = { appendChild: emptyFunction };
  (axis as any).evaluateJoin();
  (axis as any).evaluateEncode(axis.elements, (axis as any)._getEncoders(), {});

  expect(axis.elements.length).toBe(1);
  expect(axis.elements[0].getGraphicItem().attribute).toEqual({
    center: {
      x: 200,
      y: 200
    },
    end: {
      x: 0,
      y: 0
    },
    grid: {
      visible: true
    },
    items: [
      {
        id: 0,
        label: undefined,
        rawValue: undefined,
        value: NaN
      },
      {
        id: 1,
        label: undefined,
        rawValue: undefined,
        value: NaN
      }
    ],
    radius: 160,
    start: {
      x: 0,
      y: 0
    },
    style: {
      lineDash: [4, 4],
      lineWidth: 1,
      stroke: '#f1f2f5',
      strokeOpacity: 1
    },
    subGrid: {
      style: {
        lineDash: [4, 4],
        lineWidth: 1,
        stroke: '#999',
        strokeOpacity: 1
      },
      visible: false
    },
    x: 0,
    y: 0
  });
});
