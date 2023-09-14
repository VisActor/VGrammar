import { transform } from '../../src/transforms/data/pick';

test('basic pick', () => {
  const data = [
    { foo: { a: 5, b: 'abc' }, bar: 0 },
    { foo: { a: 6, b: 'def' }, bar: 1 },
    { foo: { a: 7, b: 'ghi' }, bar: 2 }
  ];

  expect(
    transform(
      {
        fields: ['bar', 'foo.a', 'foo.b'],
        as: ['bar', 'a', 'b']
      },
      data
    )
  ).toEqual([
    { bar: 0, a: 5, b: 'abc' },
    { bar: 1, a: 6, b: 'def' },
    { bar: 2, a: 7, b: 'ghi' }
  ]);
});
