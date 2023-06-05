import { transform } from '../../src/transforms/data/map';

test('basic map', () => {
  const data = [
    { foo: 1, bar: 1 },
    { foo: 1, bar: 2 },
    { foo: null, bar: 3 }
  ];

  expect(
    transform(
      {
        callback: (entry: any) => `${entry.bar}${entry.foo ?? 0}`,
        as: 'test'
      },
      data
    )
  ).toEqual([
    { foo: 1, bar: 1, test: '11' },
    { foo: 1, bar: 2, test: '21' },
    { foo: null, bar: 3, test: '30' }
  ]);
});
