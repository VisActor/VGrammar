{{ target: transform-sort }}

## transform.sort(Object)

"sort" 主要用于对数据进行排序

### type(string) = sort

将数据变换的类型设置为`sort`

### sort(Object | Function)

排序配置，支持两种类型的配置：

- Object 类型，支持的格式如下：

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

最简单的场景，需要根据某个字段排序，可以如下配置：

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

`order` 未申明的时候，默认值为`asc`，也就是升序

如果要按照多个字段排序，只需要将`field`和`order`,设置为数组类型即可

- Function 类型，用于设置自定义的排序函数

```ts
(a: any, b: any) => number;
```
