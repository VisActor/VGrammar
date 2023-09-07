{{target: transform-sort}}

## transform.sort(Object)

"sort" is mainly used for sorting data

### type(string) = sort

Set the type of data transformation to `sort`

### sort(Object | Function)

Sorting configuration, supporting two types of configurations:

- Object type, supported formats are as follows:

```ts
/**
 * the type of sort
 */
type SortOrderType = 'desc' | 'asc';

/**
 * config of sort
 */
interface SortConfigSpec {
  /** the field to be sort */
  field: string | string[];
  /**
   * the order of each field
   */
  order?: SortOrderType | SortOrderType[];
}
```

In the simplest scenario, if you need to sort according to a certain field, you can configure as follows:

```ts
{
  data: [
    {
      id: 'table',
      data: [
        { categary: 'A', value: 10, value2: 33 },
        { categary: 'B', value: 15, value2: 22 },
        { categary: 'C', value: 20, value2: 444 }
      ],
      transform: [
        {
          type: 'sort',
          sort: { field: 'value' }
        }
      ]
    }
  ];
}
```

When `order` is not declared, the default value is `asc`, which is ascending order

If you want to sort by multiple fields, just set `field` and `order` to array types

- Function type, used to set custom sorting functions

```ts
(a: any, b: any) => number;
```
