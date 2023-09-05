import { Axis } from '../../src/component/axis';
import { Scale } from '../../src/view/scale';
import { emptyFunction, getMockedView } from '../util';

test('line axis', function () {
  const view = getMockedView() as any;
  const xScale = new Scale(view, 'point').domain(['A', 'B', 'C']).range([0, 270]).configure({
    padding: 0.5
  });
  const axis = new Axis(view)
    .scale(xScale)
    .axisType('line')
    .encode({
      x: 40,
      y: 310,
      start: { x: 0, y: 0 },
      end: { x: 270, y: 0 }
    });
  (axis as any).graphicParent = { appendChild: emptyFunction };
  (axis as any).evaluateJoin();
  (axis as any).evaluateEncode(axis.elements, (axis as any)._getEncoders(), {});

  expect(axis.elements.length).toBe(1);
  expect(axis.elements[0].getGraphicItem().attribute).toEqual({
    end: {
      x: 270,
      y: 0
    },
    items: [
      [
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
      ]
    ],
    label: {
      inside: false,
      padding: 0,
      space: 4,
      style: {
        fill: '#89909d',
        fillOpacity: 1,
        fontSize: 12,
        fontWeight: 'normal'
      },
      visible: true
    },
    line: {
      style: {
        lineWidth: 1,
        stroke: '#D9DDE4',
        strokeOpacity: 1
      },
      visible: true
    },
    start: {
      x: 0,
      y: 0
    },
    subTick: {
      count: 4,
      inside: false,
      length: 2,
      style: {
        lineWidth: 1,
        stroke: '#D9DDE4',
        strokeOpacity: 1
      },
      visible: false
    },
    tick: {
      alignWithLabel: true,
      inside: false,
      length: 4,
      style: {
        lineWidth: 1,
        stroke: '#D9DDE4',
        strokeOpacity: 1
      },
      visible: true
    },
    title: {
      padding: 0,
      space: 4,
      textStyle: {
        fill: '#333333',
        fillOpacity: 1,
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    x: 40,
    y: 310
  });
});

test('circle axis', function () {
  const view = getMockedView() as any;
  const thetaScale = new Scale(view, 'point')
    .domain(['A', 'B', 'C'])
    .range([0, Math.PI * 2])
    .configure({ padding: 0.5 });
  const axis = new Axis(view)
    .scale(thetaScale)
    .axisType('circle')
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
    endAngle: Math.PI * 2,
    grid: {
      visible: true
    },
    innerRadius: 0,
    items: [
      [
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
      ]
    ],
    label: {
      inside: false,
      padding: 0,
      space: 4,
      style: {
        fill: '#6F6F6F',
        fillOpacity: 1,
        fontSize: 12,
        fontWeight: 'normal'
      },
      visible: true
    },
    line: {
      style: {
        lineWidth: 1,
        stroke: '#D9DDE4',
        strokeOpacity: 1
      },
      visible: true
    },
    radius: 160,
    start: {
      x: 0,
      y: 0
    },
    startAngle: 0,
    subTick: {
      count: 4,
      inside: false,
      length: 2,
      style: {
        lineWidth: 1,
        stroke: '#D9DDE4',
        strokeOpacity: 1
      },
      visible: false
    },
    tick: {
      alignWithLabel: true,
      inside: false,
      length: 4,
      style: {
        lineWidth: 1,
        stroke: '#D9DDE4',
        strokeOpacity: 1
      },
      visible: true
    },
    title: {
      padding: [0, 0, 0, 0],
      space: 4,
      text: 'theta',
      textStyle: {
        fill: '#333333',
        fillOpacity: 1,
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    x: 0,
    y: 0
  });
});
