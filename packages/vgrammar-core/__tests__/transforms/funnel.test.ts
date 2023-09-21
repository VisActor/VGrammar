import { transform } from '../../src/transforms/data/funnel';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('basic funnel', () => {
  const data = [
    { value: 100, category: 'A' },
    { value: 80, category: 'B' },
    { value: 60, category: 'C' },
    { value: 40, category: 'D' },
    { value: 20, category: 'E' }
  ];

  const funnelData = transform(
    {
      field: 'value',
      asTransformRatio: 'transformRatio',
      asReachRatio: 'reachRatio',
      asHeightRatio: 'heightRatio',
      asNextValueRatio: 'nextValueRatio',
      asLastValueRatio: 'lastValueRatio',
      asLastValue: 'lastValue',
      asCurrentValue: 'currentValue',
      asNextValue: 'nextValue'
    },
    data
  );

  expect(funnelData).toEqual([
    {
      value: 100,
      category: 'A',
      lastValue: NaN,
      nextValue: 80,
      transformRatio: 0.8,
      reachRatio: 1,
      heightRatio: 0.2,
      nextValueRatio: 0.8,
      lastValueRatio: 1,
      currentValue: 100
    },
    {
      value: 80,
      category: 'B',
      lastValue: 100,
      nextValue: 60,
      transformRatio: 0.75,
      reachRatio: 0.8,
      heightRatio: 0.2,
      nextValueRatio: 0.6,
      lastValueRatio: 1,
      currentValue: 80
    },
    {
      value: 60,
      category: 'C',
      lastValue: 80,
      nextValue: 40,
      transformRatio: 2 / 3,
      reachRatio: 0.75,
      heightRatio: 0.2,
      nextValueRatio: 0.4,
      lastValueRatio: 0.8,
      currentValue: 60
    },
    {
      value: 40,
      category: 'D',
      lastValue: 60,
      nextValue: 20,
      transformRatio: 0.5,
      reachRatio: 2 / 3,
      heightRatio: 0.2,
      nextValueRatio: 0.2,
      lastValueRatio: 0.6,
      currentValue: 40
    },
    {
      value: 20,
      category: 'E',
      lastValue: 40,
      nextValue: NaN,
      transformRatio: null,
      reachRatio: 0.5,
      heightRatio: 0.2,
      nextValueRatio: 0,
      lastValueRatio: 0.4,
      currentValue: 20
    }
  ]);
});

test('cone funnel with height visual', () => {
  const data = [
    { value: 100, category: 'A' },
    { value: 80, category: 'B' },
    { value: 60, category: 'C' },
    { value: 40, category: 'D' },
    { value: 20, category: 'E' }
  ];

  const funnelData = transform(
    {
      field: 'value',
      asTransformRatio: 'transformRatio',
      asReachRatio: 'reachRatio',
      asHeightRatio: 'heightRatio',
      asNextValueRatio: 'nextValueRatio',
      asLastValueRatio: 'lastValueRatio',
      asLastValue: 'lastValue',
      asCurrentValue: 'currentValue',
      asNextValue: 'nextValue',
      heightVisual: true,
      isCone: true
    },
    data
  );

  expect(funnelData).toEqual([
    {
      value: 100,
      category: 'A',
      lastValue: NaN,
      nextValue: 80,
      transformRatio: 0.8,
      reachRatio: 1,
      heightRatio: 0.8,
      nextValueRatio: 0.8,
      lastValueRatio: 1,
      currentValue: 100
    },
    {
      value: 80,
      category: 'B',
      lastValue: 100,
      nextValue: 60,
      transformRatio: 0.75,
      reachRatio: 0.8,
      heightRatio: 0.75,
      nextValueRatio: 0.6,
      lastValueRatio: 1,
      currentValue: 80
    },
    {
      value: 60,
      category: 'C',
      lastValue: 80,
      nextValue: 40,
      transformRatio: 0.6666666666666666,
      reachRatio: 0.75,
      heightRatio: 0.6666666666666666,
      nextValueRatio: 0.4,
      lastValueRatio: 0.8,
      currentValue: 60
    },
    {
      value: 40,
      category: 'D',
      lastValue: 60,
      nextValue: 20,
      transformRatio: 0.5,
      reachRatio: 0.6666666666666666,
      heightRatio: 0.5,
      nextValueRatio: 0.2,
      lastValueRatio: 0.6,
      currentValue: 40
    },
    {
      value: 20,
      category: 'E',
      lastValue: 40,
      nextValue: NaN,
      transformRatio: null,
      reachRatio: 0.5,
      heightRatio: null,
      nextValueRatio: 0,
      lastValueRatio: 0.4,
      currentValue: 20
    }
  ]);
});
