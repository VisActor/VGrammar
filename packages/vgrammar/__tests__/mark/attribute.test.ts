import { getLineSegmentConfigs } from '../../src/graph/attributes';

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
