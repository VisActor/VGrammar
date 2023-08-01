import { transform } from '../../src/transforms/data/stack';

test('basic stack', () => {
  const data = [
    {
      month: 'Jan.',
      product: 'A',
      value: 203
    },
    {
      month: 'Jan.',
      product: 'B',
      value: 120
    },
    {
      month: 'Jan.',
      product: 'C',
      value: 230
    },
    {
      month: 'Feb.',
      product: 'A',
      value: 129
    },
    {
      month: 'Feb.',
      product: 'B',
      value: 430
    },
    {
      month: 'Feb.',
      product: 'C',
      value: 233
    },
    {
      month: 'Mar.',
      product: 'A',
      value: 100
    },
    {
      month: 'Mar.',
      product: 'B',
      value: 100
    },
    {
      month: 'Mar.',
      product: 'C',
      value: 100
    },
    {
      month: 'Apr.',
      product: 'A',
      value: 100
    },
    {
      month: 'Apr.',
      product: 'B',
      value: 100
    },
    {
      month: 'Apr.',
      product: 'C',
      value: 300
    },
    {
      month: 'May',
      product: 'A',
      value: 221
    },
    {
      month: 'May',
      product: 'B',
      value: 410
    },
    {
      month: 'May',
      product: 'C',
      value: 309
    },
    {
      month: 'Jun.',
      product: 'A',
      value: 221
    },
    {
      month: 'Jun.',
      product: 'B',
      value: 221
    },
    {
      month: 'Jun.',
      product: 'C',
      value: 221
    },
    {
      month: 'Jul.',
      product: 'A',
      value: 235
    },
    {
      month: 'Jul.',
      product: 'B',
      value: 153
    },
    {
      month: 'Jul.',
      product: 'C',
      value: 159
    },
    {
      month: 'Aug.',
      product: 'A',
      value: 220
    },
    {
      month: 'Aug.',
      product: 'B',
      value: 220
    },
    {
      month: 'Aug.',
      product: 'C',
      value: 209
    },
    {
      month: 'Sep.',
      product: 'A',
      value: 129
    },
    {
      month: 'Sep.',
      product: 'B',
      value: 131
    },
    {
      month: 'Sep.',
      product: 'C',
      value: 219
    },
    {
      month: 'Oct.',
      product: 'A',
      value: 415
    },
    {
      month: 'Oct.',
      product: 'B',
      value: 215
    },
    {
      month: 'Oct.',
      product: 'C',
      value: 315
    },
    {
      month: 'Nov.',
      product: 'A',
      value: 219
    },
    {
      month: 'Nov.',
      product: 'B',
      value: 319
    },
    {
      month: 'Nov.',
      product: 'C',
      value: 149
    },
    {
      month: 'Dec.',
      product: 'A',
      value: 155
    },
    {
      month: 'Dec.',
      product: 'B',
      value: 115
    },
    {
      month: 'Dec.',
      product: 'C',
      value: 125
    }
  ];

  const stackedData = transform(
    {
      // orient: 'positive',
      dimensionField: 'month',
      stackField: 'value',
      asStack: 'value',
      asPrevStack: 'lastValue',
      asPercent: 'percent',
      asPercentStack: 'percent1',
      asPrevPercentStack: 'percent0',
      asSum: 'sum'
    },
    data
  );
  expect(stackedData[0]).toEqual({
    month: 'Jan.',
    product: 'A',
    value: 203,
    sum: 553,
    percent: 203 / 553,
    percent1: 203 / 553,
    percent0: 0,
    lastValue: 0
  });
});

test('basic stack', () => {
  const data = [
    {
      month: 'Jan.',
      product: 'A',
      value: 203
    },
    {
      month: 'Jan.',
      product: 'B',
      value: 120
    },
    {
      month: 'Jan.',
      product: 'C',
      value: 230
    },
    {
      month: 'Feb.',
      product: 'A',
      value: 129
    },
    {
      month: 'Feb.',
      product: 'B',
      value: 430
    },
    {
      month: 'Feb.',
      product: 'C',
      value: 233
    },
    {
      month: 'Mar.',
      product: 'A',
      value: 100
    },
    {
      month: 'Mar.',
      product: 'B',
      value: 100
    },
    {
      month: 'Mar.',
      product: 'C',
      value: 100
    },
    {
      month: 'Apr.',
      product: 'A',
      value: 100
    },
    {
      month: 'Apr.',
      product: 'B',
      value: 100
    },
    {
      month: 'Apr.',
      product: 'C',
      value: 300
    },
    {
      month: 'May',
      product: 'A',
      value: 221
    },
    {
      month: 'May',
      product: 'B',
      value: 410
    },
    {
      month: 'May',
      product: 'C',
      value: 309
    },
    {
      month: 'Jun.',
      product: 'A',
      value: 221
    },
    {
      month: 'Jun.',
      product: 'B',
      value: 221
    },
    {
      month: 'Jun.',
      product: 'C',
      value: 221
    },
    {
      month: 'Jul.',
      product: 'A',
      value: 235
    },
    {
      month: 'Jul.',
      product: 'B',
      value: 153
    },
    {
      month: 'Jul.',
      product: 'C',
      value: 159
    },
    {
      month: 'Aug.',
      product: 'A',
      value: 220
    },
    {
      month: 'Aug.',
      product: 'B',
      value: 220
    },
    {
      month: 'Aug.',
      product: 'C',
      value: 209
    },
    {
      month: 'Sep.',
      product: 'A',
      value: 129
    },
    {
      month: 'Sep.',
      product: 'B',
      value: 131
    },
    {
      month: 'Sep.',
      product: 'C',
      value: 219
    },
    {
      month: 'Oct.',
      product: 'A',
      value: 415
    },
    {
      month: 'Oct.',
      product: 'B',
      value: 215
    },
    {
      month: 'Oct.',
      product: 'C',
      value: 315
    },
    {
      month: 'Nov.',
      product: 'A',
      value: 219
    },
    {
      month: 'Nov.',
      product: 'B',
      value: 319
    },
    {
      month: 'Nov.',
      product: 'C',
      value: 149
    },
    {
      month: 'Dec.',
      product: 'A',
      value: 155
    },
    {
      month: 'Dec.',
      product: 'B',
      value: 115
    },
    {
      month: 'Dec.',
      product: 'C',
      value: 125
    }
  ];

  const negativeStackedData = transform(
    {
      orient: 'negative',
      dimensionField: 'month',
      stackField: 'value',
      asStack: 'value',
      asPrevStack: 'lastValue',
      asPercent: 'percent',
      asPercentStack: 'percent1',
      asPrevPercentStack: 'percent0',
      asSum: 'sum'
    },
    data
  );

  expect(negativeStackedData[0]).toEqual({
    month: 'Jan.',
    product: 'A',
    value: 553,
    sum: 553,
    percent: 203 / 553,
    percent1: 1,
    percent0: 350 / 553,
    lastValue: 350
  });
});
