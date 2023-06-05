import { transform } from '../../src/transforms/data/filter';

test('basic filter', () => {
  const data = [
    { foo: 1, bar: 1 },
    { foo: 1, bar: 2 },
    { foo: null, bar: 3 }
  ];

  expect(
    transform(
      {
        callback: (entry: any) => entry.bar > 2
      },
      data
    )
  ).toEqual([{ foo: null, bar: 3 }]);
});
