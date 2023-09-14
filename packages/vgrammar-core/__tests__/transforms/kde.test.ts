import { transform } from '../../src/transforms/data/kde';

test('basic kde 1d', () => {
  const data = [
    { category: 'A', amount: 28, index: 0 },
    { category: 'B', amount: 55, index: 1 },
    { category: 'C', amount: 43, index: 2 },
    { category: 'D', amount: 91, index: 3 },
    { category: 'E', amount: 81, index: 4 },
    { category: 'F', amount: 53, index: 5 },
    { category: 'G', amount: 19, index: 6 },
    { category: 'H', amount: 87, index: 7 }
  ];

  const kdeData = transform(
    {
      field: 'amount',
      extent: [0, 100],
      bandwidth: 5,
      as: ['value', 'kde']
    },
    data
  );
  expect(kdeData.length).toEqual(256);
  expect(kdeData[0]).toEqual({ value: 0.1953125, kde: 0.00000846207405429779 });
  expect(kdeData[1]).toEqual({ value: 0.5859375, kde: 0.000011318064583672924 });
  expect(kdeData[255]).toEqual({ value: 99.8046875, kde: 0.0024999618629102703 });
});

test('basic kde 2d', () => {
  const data = [
    { x: 62, y: 95, index: 0 },
    { x: 84, y: 63, index: 1 },
    { x: 94, y: 31, index: 2 },
    { x: 42, y: 56, index: 3 },
    { x: 22, y: 83, index: 4 },
    { x: 76, y: 39, index: 5 },
    { x: 17, y: 89, index: 6 },
    { x: 29, y: 21, index: 7 },
    { x: 31, y: 16, index: 8 },
    { x: 38, y: 72, index: 9 },
    { x: 59, y: 96, index: 10 },
    { x: 17, y: 77, index: 11 },
    { x: 83, y: 78, index: 12 },
    { x: 83, y: 48, index: 13 },
    { x: 2, y: 5, index: 14 },
    { x: 75, y: 84, index: 15 },
    { x: 29, y: 11, index: 16 },
    { x: 50, y: 27, index: 17 },
    { x: 31, y: 1, index: 18 },
    { x: 75, y: 89, index: 19 }
  ];
  const kdeData = transform(
    {
      dimension: '2d',
      field: ['x', 'y'],
      extent: [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ],
      bandwidth: 3,
      bins: 100,
      as: ['x', 'y', 'kde']
    },
    data
  );
  expect(kdeData.length).toEqual(10000);
  expect(kdeData[0]).toEqual({ x: 0.5, y: 0.5, kde: 0.0019462093359728773 });
  expect(kdeData[1]).toEqual({ x: 1.5, y: 0.5, kde: 0.0019776097794730408 });
  expect(kdeData[9999]).toEqual({ x: 99.5, y: 99.5, kde: 0.0000643197688344554 });
});
