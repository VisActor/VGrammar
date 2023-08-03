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

test('negative stack', () => {
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
      order: 'negative',
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

test('offset stack', () => {
  const originData = [
    { category: 'A', amount: 28, index: 0, type: 'First' },
    { category: 'B', amount: 55, index: 1, type: 'First' },
    { category: 'C', amount: 43, index: 2, type: 'First' },
    { category: 'D', amount: 91, index: 3, type: 'First' },

    { category: 'A', amount: 81, index: 4, type: 'Second' },
    { category: 'B', amount: 53, index: 5, type: 'Second' },
    { category: 'C', amount: -19, index: 6, type: 'Second' },
    { category: 'D', amount: -87, index: 7, type: 'Second' },

    { category: 'A', amount: -81, index: 8, type: 'Third' },
    { category: 'B', amount: -53, index: 9, type: 'Third' },
    { category: 'C', amount: -19, index: 10, type: 'Third' },
    { category: 'D', amount: -87, index: 11, type: 'Third' }
  ];

  const noneOffsetData = transform(
    {
      dimensionField: 'category',
      stackField: 'amount',
      asStack: 'amount',
      asPrevStack: 'lastAmount',
      offset: 'none'
    },
    originData.map(datum => Object.assign({}, datum))
  );
  expect(noneOffsetData).toEqual([
    {
      category: 'A',
      amount: 28,
      index: 0,
      type: 'First',
      lastAmount: 0
    },
    {
      category: 'B',
      amount: 55,
      index: 1,
      type: 'First',
      lastAmount: 0
    },
    {
      category: 'C',
      amount: 43,
      index: 2,
      type: 'First',
      lastAmount: 0
    },
    {
      category: 'D',
      amount: 91,
      index: 3,
      type: 'First',
      lastAmount: 0
    },
    {
      category: 'A',
      amount: 109,
      index: 4,
      type: 'Second',
      lastAmount: 28
    },
    {
      category: 'B',
      amount: 108,
      index: 5,
      type: 'Second',
      lastAmount: 55
    },
    {
      category: 'C',
      amount: 62,
      index: 6,
      type: 'Second',
      lastAmount: 43
    },
    {
      category: 'D',
      amount: 178,
      index: 7,
      type: 'Second',
      lastAmount: 91
    },
    {
      category: 'A',
      amount: 190,
      index: 8,
      type: 'Third',
      lastAmount: 109
    },
    {
      category: 'B',
      amount: 161,
      index: 9,
      type: 'Third',
      lastAmount: 108
    },
    {
      category: 'C',
      amount: 81,
      index: 10,
      type: 'Third',
      lastAmount: 62
    },
    {
      category: 'D',
      amount: 265,
      index: 11,
      type: 'Third',
      lastAmount: 178
    }
  ]);

  const divergingOffsetData = transform(
    {
      dimensionField: 'category',
      stackField: 'amount',
      asStack: 'amount',
      asPrevStack: 'lastAmount',
      offset: 'diverging'
    },
    originData.map(datum => Object.assign({}, datum))
  );
  expect(divergingOffsetData).toEqual([
    {
      category: 'A',
      amount: 28,
      index: 0,
      type: 'First',
      lastAmount: 0
    },
    {
      category: 'B',
      amount: 55,
      index: 1,
      type: 'First',
      lastAmount: 0
    },
    {
      category: 'C',
      amount: 43,
      index: 2,
      type: 'First',
      lastAmount: 0
    },
    {
      category: 'D',
      amount: 91,
      index: 3,
      type: 'First',
      lastAmount: 0
    },
    {
      category: 'A',
      amount: 109,
      index: 4,
      type: 'Second',
      lastAmount: 28
    },
    {
      category: 'B',
      amount: 108,
      index: 5,
      type: 'Second',
      lastAmount: 55
    },
    {
      category: 'C',
      amount: -19,
      index: 6,
      type: 'Second',
      lastAmount: 0
    },
    {
      category: 'D',
      amount: -87,
      index: 7,
      type: 'Second',
      lastAmount: 0
    },
    {
      category: 'A',
      amount: -81,
      index: 8,
      type: 'Third',
      lastAmount: 0
    },
    {
      category: 'B',
      amount: -53,
      index: 9,
      type: 'Third',
      lastAmount: 0
    },
    {
      category: 'C',
      amount: -38,
      index: 10,
      type: 'Third',
      lastAmount: -19
    },
    {
      category: 'D',
      amount: -174,
      index: 11,
      type: 'Third',
      lastAmount: -87
    }
  ]);

  const silhouetteOffsetData = transform(
    {
      dimensionField: 'category',
      stackField: 'amount',
      asStack: 'amount',
      asPrevStack: 'lastAmount',
      offset: 'silhouette'
    },
    originData.map(datum => Object.assign({}, datum))
  );
  expect(silhouetteOffsetData).toEqual([
    {
      category: 'A',
      amount: -67,
      index: 0,
      type: 'First',
      lastAmount: -95
    },
    {
      category: 'B',
      amount: -25.5,
      index: 1,
      type: 'First',
      lastAmount: -80.5
    },
    {
      category: 'C',
      amount: 2.5,
      index: 2,
      type: 'First',
      lastAmount: -40.5
    },
    {
      category: 'D',
      amount: -41.5,
      index: 3,
      type: 'First',
      lastAmount: -132.5
    },
    {
      category: 'A',
      amount: 14,
      index: 4,
      type: 'Second',
      lastAmount: -67
    },
    {
      category: 'B',
      amount: 27.5,
      index: 5,
      type: 'Second',
      lastAmount: -25.5
    },
    {
      category: 'C',
      amount: 21.5,
      index: 6,
      type: 'Second',
      lastAmount: 2.5
    },
    {
      category: 'D',
      amount: 45.5,
      index: 7,
      type: 'Second',
      lastAmount: -41.5
    },
    {
      category: 'A',
      amount: 95,
      index: 8,
      type: 'Third',
      lastAmount: 14
    },
    {
      category: 'B',
      amount: 80.5,
      index: 9,
      type: 'Third',
      lastAmount: 27.5
    },
    {
      category: 'C',
      amount: 40.5,
      index: 10,
      type: 'Third',
      lastAmount: 21.5
    },
    {
      category: 'D',
      amount: 132.5,
      index: 11,
      type: 'Third',
      lastAmount: 45.5
    }
  ]);

  const wiggleOffsetData = transform(
    {
      dimensionField: 'category',
      stackField: 'amount',
      asStack: 'amount',
      asPrevStack: 'lastAmount',
      offset: 'wiggle'
    },
    originData.map(datum => Object.assign({}, datum))
  );
  expect(wiggleOffsetData).toEqual([
    {
      category: 'A',
      amount: -12.5,
      index: 0,
      type: 'First',
      lastAmount: -40.5
    },
    {
      category: 'B',
      amount: 28.5,
      index: 1,
      type: 'First',
      lastAmount: -26.5
    },
    {
      category: 'C',
      amount: 33.5,
      index: 2,
      type: 'First',
      lastAmount: -9.5
    },
    {
      category: 'D',
      amount: 47.5,
      index: 3,
      type: 'First',
      lastAmount: -43.5
    },
    {
      category: 'A',
      amount: 68.5,
      index: 4,
      type: 'Second',
      lastAmount: -12.5
    },
    {
      category: 'B',
      amount: 81.5,
      index: 5,
      type: 'Second',
      lastAmount: 28.5
    },
    {
      category: 'C',
      amount: 52.5,
      index: 6,
      type: 'Second',
      lastAmount: 33.5
    },
    {
      category: 'D',
      amount: 134.5,
      index: 7,
      type: 'Second',
      lastAmount: 47.5
    },
    {
      category: 'A',
      amount: 149.5,
      index: 8,
      type: 'Third',
      lastAmount: 68.5
    },
    {
      category: 'B',
      amount: 134.5,
      index: 9,
      type: 'Third',
      lastAmount: 81.5
    },
    {
      category: 'C',
      amount: 71.5,
      index: 10,
      type: 'Third',
      lastAmount: 52.5
    },
    {
      category: 'D',
      amount: 221.5,
      index: 11,
      type: 'Third',
      lastAmount: 134.5
    }
  ]);
});
