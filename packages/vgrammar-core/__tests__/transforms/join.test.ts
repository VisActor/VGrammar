import { transform } from '../../src/transforms/data/join';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('basic join', () => {
  const fromData = [
    { id: 'A', name: 'label A' },
    { id: 'B', name: 'label B' },
    { id: 'C', name: 'label C' }
  ];
  const selfData = [
    { foo: 'A', bar: 28 },
    { foo: 'B', bar: 55 },
    { foo: 'C', bar: 43 },
    { foo: 'C', bar: 91 },
    { foo: 'D', bar: 81 }
  ];

  expect(
    transform(
      {
        from: fromData,
        key: 'id',
        fields: ['foo'],
        as: ['obj']
      },
      selfData
    )
  ).toEqual([
    { foo: 'A', bar: 28, obj: { id: 'A', name: 'label A' } },
    { foo: 'B', bar: 55, obj: { id: 'B', name: 'label B' } },
    { foo: 'C', bar: 43, obj: { id: 'C', name: 'label C' } },
    { foo: 'C', bar: 91, obj: { id: 'C', name: 'label C' } },
    { foo: 'D', bar: 81, obj: null }
  ]);
});

test('basic pivot', () => {
  const fromData = [
    { id: 'A', name: 'label A' },
    { id: 'B', name: 'label B' },
    { id: 'C', name: 'label C' }
  ];
  const selfData = [
    { foo: 'A', bar: 28 },
    { foo: 'B', bar: 55 },
    { foo: 'C', bar: 43 },
    { foo: 'C', bar: 91 },
    { foo: 'D', bar: 81 }
  ];

  expect(
    transform(
      {
        from: fromData,
        key: 'id',
        fields: ['foo'],
        values: ['name'],
        as: ['obj'],
        default: 'some label'
      },
      selfData
    )
  ).toEqual([
    { foo: 'A', bar: 28, obj: 'label A' },
    { foo: 'B', bar: 55, obj: 'label B' },
    { foo: 'C', bar: 43, obj: 'label C' },
    { foo: 'C', bar: 91, obj: 'label C' },
    { foo: 'D', bar: 81, obj: 'some label' }
  ]);
});
