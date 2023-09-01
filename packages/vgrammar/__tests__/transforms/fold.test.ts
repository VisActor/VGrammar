import { transform } from '../../src/transforms/data/fold';

test('fold without retains', () => {
  const data = [
    { type: 'a', cat: '0', value0: 10, value1: 122, value2: 1000 },
    { type: 'b', cat: '1', value0: 13, value1: 102 }
  ];

  expect(
    transform(
      {
        fields: ['value0', 'value1', 'value2']
      },
      data
    )
  ).toEqual([
    { key: 'value0', value: 10, type: 'a', cat: '0' },
    { key: 'value1', value: 122, type: 'a', cat: '0' },
    { key: 'value2', value: 1000, type: 'a', cat: '0' },
    { key: 'value0', value: 13, type: 'b', cat: '1' },
    { key: 'value1', value: 102, type: 'b', cat: '1' },
    { key: 'value2', value: undefined, type: 'b', cat: '1' }
  ]);
});

test('fold with empty retains', () => {
  const data = [
    { type: 'a', cat: '0', value0: 10, value1: 122, value2: 1000 },
    { type: 'b', cat: '1', value0: 13, value1: 102 }
  ];

  expect(
    transform(
      {
        fields: ['value0', 'value1', 'value2'],
        retains: []
      },
      data
    )
  ).toEqual([
    { key: 'value0', value: 10 },
    { key: 'value1', value: 122 },
    { key: 'value2', value: 1000 },
    { key: 'value0', value: 13 },
    { key: 'value1', value: 102 },
    { key: 'value2', value: undefined }
  ]);
});

test('fold with retains', () => {
  const data = [
    { type: 'a', cat: '0', value0: 10, value1: 122, value2: 1000 },
    { type: 'b', cat: '1', value0: 13, value1: 102 }
  ];

  expect(
    transform(
      {
        fields: ['value0', 'value1', 'value2'],
        retains: ['type']
      },
      data
    )
  ).toEqual([
    { key: 'value0', value: 10, type: 'a' },
    { key: 'value1', value: 122, type: 'a' },
    { key: 'value2', value: 1000, type: 'a' },
    { key: 'value0', value: 13, type: 'b' },
    { key: 'value1', value: 102, type: 'b' },
    { key: 'value2', value: undefined, type: 'b' }
  ]);
});
