import {
  cloneTransformAttributes,
  getLineSegmentConfigs,
  isPositionOrSizeChannel,
  transformAttributes
} from '../../src/graph/attributes';
import { emptyFunction } from '../util';

test('getLineSegmentConfigs()', () => {
  expect(getLineSegmentConfigs([], [])).toBeNull();
  expect(getLineSegmentConfigs([{}, {}, {}], [])).toBeNull();
  expect(
    getLineSegmentConfigs(
      [{ lineDash: [1, 1] }, { lineDash: [1, 1, 1] }, { lineDash: [1, 1, 1, 1] }],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 }
      ]
    )
  ).toEqual([
    { lineDash: [1, 1], points: [{ x: 0, y: 0 }] },
    { lineDash: [1, 1, 1], points: [{ x: 1, y: 0 }] },
    { lineDash: [1, 1, 1, 1], points: [{ x: 2, y: 0 }] }
  ]);

  expect(
    getLineSegmentConfigs(
      [{ lineDash: [1, 1] }, { lineDash: [1, 1] }, { lineDash: [1, 1] }],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 }
      ]
    )
  ).toBeNull();

  expect(
    getLineSegmentConfigs(
      [{ lineWidth: null }, { lineWidth: undefined }, {}],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 }
      ]
    )
  ).toBeNull();

  expect(
    getLineSegmentConfigs(
      [
        { stroke: 'red' },
        { stroke: 'red' },
        { stroke: { gradient: 'linear', x0: 0, y0: 0, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] } }
      ],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 }
      ]
    )
  ).toEqual([
    {
      stroke: 'red',
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 0 }
      ]
    },
    {
      stroke: { gradient: 'linear', x0: 0, y0: 0, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] },
      points: [{ x: 2, y: 0 }]
    }
  ]);

  expect(
    getLineSegmentConfigs(
      [
        { stroke: { gradient: 'linear', x0: 0, y0: 0, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] } },
        { stroke: { gradient: 'linear', x0: 0, y0: 0, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] } },
        { stroke: { gradient: 'linear', x0: 0, y0: 0, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] } }
      ],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 }
      ]
    )
  ).toBeNull();

  expect(
    getLineSegmentConfigs(
      [
        { stroke: { gradient: 'linear', x0: 0, y0: 1, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] } },
        { stroke: { gradient: 'linear', x0: 0, y0: 0, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] } },
        { stroke: { gradient: 'linear', x0: 0, y0: 0, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] } }
      ],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 }
      ]
    )
  ).toEqual([
    {
      stroke: { gradient: 'linear', x0: 0, y0: 1, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] },
      points: [{ x: 0, y: 0 }]
    },
    {
      stroke: { gradient: 'linear', x0: 0, y0: 0, x1: 1, y1: 1, stops: [{ offset: 0, color: 'red' }] },
      points: [
        { x: 1, y: 0 },
        { x: 2, y: 0 }
      ]
    }
  ]);
});

test('isPositionOrSizeChannel()', () => {
  expect(isPositionOrSizeChannel('arc', 'x')).toBe(true);
  expect(isPositionOrSizeChannel('arc', 'innerRadius')).toBe(true);
  expect(isPositionOrSizeChannel('rect', 'innerRadius')).toBe(false);
  expect(isPositionOrSizeChannel('rect', 'height')).toBe(true);
  expect(isPositionOrSizeChannel('text', 'text')).toBe(true);
});

test('cloneTransformAttributes()', () => {
  expect(cloneTransformAttributes('rect', { width: 100, x: 10, fill: 'red', fillOpacity: 1 })).toEqual({
    width: 100,
    x: 10
  });
  expect(cloneTransformAttributes('area', { x: 10, x1: 20, fill: 'red', fillOpacity: 1 })).toEqual({
    x: 10,
    x1: 20
  });
  expect(
    cloneTransformAttributes('text', { x: 10, x1: 20, fill: 'red', fillOpacity: 1, text: 'aaa', limit: 100 })
  ).toEqual({
    text: 'aaa',
    limit: 100
  });
});

test('transformAttributes()', () => {
  expect(
    transformAttributes('rect', { x: 10, width: 20, y: 20, height: 30 }, { getGraphicAttribute: emptyFunction } as any)
  ).toEqual({
    height: 30,
    sizeAttrs: {
      height: 30,
      width: 20,
      x: 10,
      x1: undefined,
      y: 20,
      y1: undefined
    },
    width: 20,
    x: 10,
    y: 20
  });
  expect(
    transformAttributes('rect', { x: 10, x1: 30, y: 20, y1: 60 }, { getGraphicAttribute: emptyFunction } as any)
  ).toEqual({
    height: 40,
    sizeAttrs: {
      height: undefined,
      width: undefined,
      x: 10,
      x1: 30,
      y: 20,
      y1: 60
    },
    width: 20,
    x: 10,
    y: 20
  });
  expect(
    transformAttributes('rule', { x: 10, x1: 30, y: 20, y1: 60 }, { getGraphicAttribute: emptyFunction } as any)
  ).toEqual({
    pointAttrs: {
      x: 10,
      x1: 30,
      y: 20,
      y1: 60
    },
    points: [
      {
        x: 10,
        y: 20
      },
      {
        x: 30,
        y: 60
      }
    ],
    x: 0,
    y: 0
  });
});
