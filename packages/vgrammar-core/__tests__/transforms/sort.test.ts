import { transform } from '../../src/transforms/data/sort';

test('sort by simple field', () => {
  const data = [
    { a: 3, b: 1 },
    { a: 2, b: 2 },
    { a: 1, b: 4 },
    { a: 1, b: 3 }
  ];

  expect(
    transform(
      {
        sort: {
          field: 'a'
        }
      },
      data
    )
  ).toEqual([
    { a: 1, b: 4 },
    { a: 1, b: 3 },
    { a: 2, b: 2 },
    { a: 3, b: 1 }
  ]);
});

test('sort by multi field', () => {
  const data = [
    { a: 3, b: 1 },
    { a: 2, b: 2 },
    { a: 1, b: 4 },
    { a: 1, b: 3 }
  ];

  expect(
    transform(
      {
        sort: {
          field: ['a', 'b'],
          order: ['desc', 'asc']
        }
      },
      data
    )
  ).toEqual([
    { a: 3, b: 1 },
    { a: 2, b: 2 },
    { a: 1, b: 3 },
    { a: 1, b: 4 }
  ]);
});
