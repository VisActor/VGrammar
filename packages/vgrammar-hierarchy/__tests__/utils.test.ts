import { calculateNodeValue } from '../src';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();
test('calculateNodeValue()', () => {
  const data = [
    {
      name: 'Grandpa',
      children: [
        {
          name: 'Uncle Leo',
          value: 15,
          children: [
            {
              name: 'Cousin Jack',
              value: 2
            },
            {
              name: 'Cousin Mary',
              children: [
                {
                  name: 'Jackson',
                  value: 5
                }
              ]
            },
            {
              name: 'Cousin Ben',
              value: 4
            }
          ]
        },
        {
          name: 'Father',
          value: 10,
          children: [
            {
              name: 'Me',
              value: 5
            },
            {
              name: 'Brother Peter',
              value: 1
            }
          ]
        }
      ]
    },
    {
      name: 'Nancy',
      children: [
        {
          name: 'Uncle Nike',
          children: [
            {
              name: 'Cousin Betty',
              value: 1
            },
            {
              name: 'Cousin Jenny',
              value: 2
            }
          ]
        }
      ]
    }
  ];
  const result: any[] = [];
  const res = calculateNodeValue(data, result);

  expect(res.maxDepth).toBe(3);
});

test('calculateNodeValue with custom valueField', () => {
  const data = [
    {
      name: 'Grandpa',
      children: [
        {
          name: 'Uncle Leo',
          value1: 15,
          children: [
            {
              name: 'Cousin Jack',
              value1: 2
            },
            {
              name: 'Cousin Mary',
              children: [
                {
                  name: 'Jackson',
                  value1: 5
                }
              ]
            },
            {
              name: 'Cousin Ben',
              value1: 4
            }
          ]
        },
        {
          name: 'Father',
          value1: 10,
          children: [
            {
              name: 'Me',
              value1: 5
            },
            {
              name: 'Brother Peter',
              value1: 1
            }
          ]
        }
      ]
    },
    {
      name: 'Nancy',
      children: [
        {
          name: 'Uncle Nike',
          children: [
            {
              name: 'Cousin Betty',
              value1: 1
            },
            {
              name: 'Cousin Jenny',
              value1: 2
            }
          ]
        }
      ]
    }
  ];
  const result: any[] = [];
  const res = calculateNodeValue(data as any, result, undefined, undefined, undefined, undefined, 'value1');

  expect(res.maxDepth).toBe(3);
  expect(res.sum).toBe(28);
});
