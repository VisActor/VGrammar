import {
  cloneTransformAttributes,
  getLineSegmentConfigs,
  getConnectLineSegmentConfigs,
  isPositionOrSizeChannel,
  transformAttributes
} from '../../src/graph/attributes';
import { createSimpleElement, emptyFunction } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

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

test('getLineSegmentConfigs() when stroke is an array', () => {
  const items = [
    { stroke: ['red', false, false, false] },
    { stroke: ['red', false, false, false] },
    { stroke: ['red', false, false, false] },
    { stroke: ['red', false, false, false] }
  ];
  const points = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 }
  ];

  expect(getLineSegmentConfigs(items, points)).toBeNull();
  const area = createSimpleElement('area');
  expect(getLineSegmentConfigs(items, points, area)).toBeNull();
});

test('getLineSegmentConfigs() when fill is an array of an area mark', () => {
  const items = [
    { fill: ['red', false, false, false] },
    { fill: ['red', false, false, false] },
    { fill: ['red', false, false, false] },
    { fill: ['red', false, false, false] }
  ];
  const points = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 }
  ];

  expect(getLineSegmentConfigs(items, points)).toBeNull();
  const area = createSimpleElement('area');
  expect(getLineSegmentConfigs(items, points, area)).toBeNull();
});

test('getLineSegmentConfigs() when fill is a gradient color', () => {
  const items = [
    {
      fill: {
        gradient: 'linear',
        x0: 0.5,
        y0: 0,
        x1: 0.5,
        y1: 1,
        stops: [
          {
            offset: 0,
            opacity: 0.2
          },
          {
            offset: 1,
            opacity: 0
          }
        ]
      }
    },
    {
      fill: {
        gradient: 'linear',
        x0: 0.5,
        y0: 0,
        x1: 0.5,
        y1: 1,
        stops: [
          {
            offset: 0,
            opacity: 0.2
          },
          {
            offset: 1,
            opacity: 0
          }
        ]
      }
    },
    {
      fill: {
        gradient: 'linear',
        x0: 0.5,
        y0: 0,
        x1: 0.5,
        y1: 1,
        stops: [
          {
            offset: 0,
            opacity: 0.2
          },
          {
            offset: 1,
            opacity: 0
          }
        ]
      }
    },
    {
      fill: {
        gradient: 'linear',
        x0: 0.5,
        y0: 0,
        x1: 0.5,
        y1: 1,
        stops: [
          {
            offset: 0,
            opacity: 0.2
          },
          {
            offset: 1,
            opacity: 0
          }
        ]
      }
    }
  ];
  const points = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 }
  ];

  expect(getLineSegmentConfigs(items, points)).toBeNull();
  const area = createSimpleElement('area');
  expect(getLineSegmentConfigs(items, points, area)).toBeNull();
});

test('isPositionOrSizeChannel()', () => {
  expect(isPositionOrSizeChannel('arc', 'x')).toBe(true);
  expect(isPositionOrSizeChannel('arc', 'innerRadius')).toBe(true);
  expect(isPositionOrSizeChannel('rect', 'innerRadius')).toBe(false);
  expect(isPositionOrSizeChannel('rect', 'height')).toBe(true);
  expect(isPositionOrSizeChannel('text', 'text')).toBe(true);
});

test('cloneTransformAttributes()', () => {
  expect(cloneTransformAttributes('rect', { width: 100, x: 10, fill: 'red', fillOpacity: 1 })).toEqual({});
  expect(cloneTransformAttributes('area', { x: 10, x1: 20, fill: 'red', fillOpacity: 1 })).toEqual({});
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
    width: 20,
    x: 10,
    y: 20
  });
  expect(
    transformAttributes('rect', { x: 10, x1: 30, y: 20, y1: 60 }, { getGraphicAttribute: emptyFunction } as any)
  ).toEqual({
    x1: 30,
    y1: 60,
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

test('transformAttributes() of "text"', () => {
  expect(
    transformAttributes('text', { x: 10, y: 20, maxLineWidth: 50, text: '测试文本' }, {
      getGraphicAttribute: emptyFunction
    } as any)
  ).toEqual({
    x: 10,
    y: 20,
    maxLineWidth: 50,
    text: '测试文本',
    limitAttrs: {
      text: '测试文本',
      limit: undefined,
      autoLimit: undefined,
      maxLineWidth: 50
    }
  });

  expect(
    transformAttributes('text', { maxLineWidth: 50, x: 10, y: 20, text: '测试文本' }, {
      getGraphicAttribute: emptyFunction
    } as any)
  ).toEqual({
    x: 10,
    y: 20,
    maxLineWidth: 50,
    text: '测试文本',
    limitAttrs: {
      text: '测试文本',
      limit: undefined,
      autoLimit: undefined,
      maxLineWidth: 50
    }
  });

  expect(
    transformAttributes('text', { limit: 20, maxLineWidth: 50, x: 10, y: 20, text: '测试文本' }, {
      getGraphicAttribute: emptyFunction
    } as any)
  ).toEqual({
    x: 10,
    y: 20,
    maxLineWidth: 20,
    text: '测试文本',
    limitAttrs: {
      text: '测试文本',
      limit: 20,
      autoLimit: undefined,
      maxLineWidth: 50
    }
  });

  expect(
    transformAttributes('text', { limit: 20, autoLimit: 10, maxLineWidth: 50, x: 10, y: 20, text: '测试文本' }, {
      getGraphicAttribute: emptyFunction
    } as any)
  ).toEqual({
    x: 10,
    y: 20,
    maxLineWidth: 10,
    text: '测试文本',
    limitAttrs: {
      text: '测试文本',
      limit: 20,
      autoLimit: 10,
      maxLineWidth: 50
    }
  });

  expect(
    transformAttributes('text', { maxLineWidth: 50, x: 10, y: 20, text: ['测试文本', '测试文本'] }, {
      getGraphicAttribute: emptyFunction
    } as any)
  ).toEqual({
    x: 10,
    y: 20,
    maxLineWidth: 50,
    text: ['测试文本', '测试文本'],
    limitAttrs: {
      text: ['测试文本', '测试文本'],
      limit: undefined,
      autoLimit: undefined,
      maxLineWidth: 50
    }
  });

  expect(
    transformAttributes('text', { x: 10, y: 20, text: ['测试文本', '测试文本'] }, {
      getGraphicAttribute: emptyFunction
    } as any)
  ).toEqual({
    x: 10,
    y: 20,
    maxLineWidth: undefined,
    text: ['测试文本', '测试文本'],
    limitAttrs: {
      text: ['测试文本', '测试文本'],
      limit: undefined,
      autoLimit: undefined,
      maxLineWidth: undefined
    }
  });
});

test('getConnectLineSegmentConfigs()', () => {
  expect(getConnectLineSegmentConfigs([], [])).toBeNull();
  expect(getConnectLineSegmentConfigs([{}, {}, {}], [])).toBeNull();

  expect(
    getConnectLineSegmentConfigs(
      [{ lineDash: [1, 1] }, { lineDash: [1, 1] }, { lineDash: [1, 1] }, { lineDash: [1, 1] }],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0, defined: false },
        { x: 2, y: 0 },
        { x: 3, y: 0 }
      ]
    )
  ).toEqual([
    { lineDash: [1, 1], points: [{ x: 0, y: 0 }] },
    {
      isConnect: true,
      points: [{ x: 2, y: 0 }]
    },
    {
      lineDash: [1, 1],
      points: [{ x: 3, y: 0 }]
    }
  ]);
});
