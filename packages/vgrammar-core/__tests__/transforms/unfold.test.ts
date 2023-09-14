import { transform } from '../../src/transforms/data/unfold';

test('unfold with not groupBy', () => {
  const data = [
    { type: 'a', value: 1 },
    { type: 'b', value: 1 }
  ];

  expect(
    transform(
      {
        keyField: 'type',
        valueField: 'value'
      },
      data
    )
  ).toEqual([{ a: 1, b: 1 }]);
});

test('unfold with groupBy', () => {
  const data = [
    { country: 'A', type: 'a', value: 1 },
    { country: 'A', type: 'a', value: 10 },
    { country: 'A', type: 'b', value: 1 },
    { country: 'B', type: 'a', value: 1 },
    { country: 'B', type: 'b', value: 1 },
    { country: 'C', type: 'a', value: 1 }
  ];

  expect(
    transform(
      {
        groupBy: 'country',
        keyField: 'type',
        valueField: 'value'
      },
      data
    )
  ).toEqual([
    { country: 'A', a: 11, b: 1 },
    { country: 'B', a: 1, b: 1 },
    { country: 'C', a: 1 }
  ]);
});

test('unfold with groupBy and aaggregateType is min ', () => {
  const data = [
    { country: 'A', type: 'a', value: 1 },
    { country: 'A', type: 'a', value: 10 },
    { country: 'A', type: 'b', value: 1 },
    { country: 'B', type: 'a', value: 1 },
    { country: 'B', type: 'b', value: 1 },
    { country: 'C', type: 'a', value: 1 }
  ];

  expect(
    transform(
      {
        groupBy: 'country',
        keyField: 'type',
        valueField: 'value',
        aggregateType: 'min'
      },
      data
    )
  ).toEqual([
    { country: 'A', a: 1, b: 1 },
    { country: 'B', a: 1, b: 1 },
    { country: 'C', a: 1 }
  ]);
});

test('unfold with groupBy and aaggregateType is max ', () => {
  const data = [
    { country: 'A', type: 'a', value: 1 },
    { country: 'A', type: 'a', value: 10 },
    { country: 'A', type: 'b', value: 1 },
    { country: 'B', type: 'a', value: 1 },
    { country: 'B', type: 'b', value: 1 },
    { country: 'C', type: 'a', value: 1 }
  ];

  expect(
    transform(
      {
        groupBy: 'country',
        keyField: 'type',
        valueField: 'value',
        aggregateType: 'max'
      },
      data
    )
  ).toEqual([
    { country: 'A', a: 10, b: 1 },
    { country: 'B', a: 1, b: 1 },
    { country: 'C', a: 1 }
  ]);
});

test('unfold with groupBy and aaggregateType is count ', () => {
  const data = [
    { country: 'A', type: 'a', value: 1 },
    { country: 'A', type: 'a', value: 10 },
    { country: 'A', type: 'b', value: 1 },
    { country: 'B', type: 'a', value: 1 },
    { country: 'B', type: 'b', value: 1 },
    { country: 'C', type: 'a', value: 1 }
  ];

  expect(
    transform(
      {
        groupBy: 'country',
        keyField: 'type',
        valueField: 'value',
        aggregateType: 'count'
      },
      data
    )
  ).toEqual([
    { country: 'A', a: 2, b: 1 },
    { country: 'B', a: 1, b: 1 },
    { country: 'C', a: 1 }
  ]);
});

test('unfold with groupBy and aaggregateType is mean ', () => {
  const data = [
    { country: 'A', type: 'a', value: 2 },
    { country: 'A', type: 'a', value: 10 },
    { country: 'A', type: 'b', value: 1 },
    { country: 'B', type: 'a', value: 1 },
    { country: 'B', type: 'b', value: 1 },
    { country: 'C', type: 'a', value: 1 }
  ];

  expect(
    transform(
      {
        groupBy: 'country',
        keyField: 'type',
        valueField: 'value',
        aggregateType: 'mean'
      },
      data
    )
  ).toEqual([
    { country: 'A', a: 6, b: 1 },
    { country: 'B', a: 1, b: 1 },
    { country: 'C', a: 1 }
  ]);
});
