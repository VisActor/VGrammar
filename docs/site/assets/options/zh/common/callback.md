{{ target: common-callback }}

`callback` 可以接受接受到两个参数，第一个参数是数据对象，第二个参数是语法元素 data 上依赖的参数，

如下案例中，数据依赖`test`signal

```
{
  signals: [{
    id: 'test',
    value: 0,
  }],
  data: [
    {
      id: 'table',
      values: [
        { a: 1, b: 3, c: 5 },
      ]
    },
    {
      id: 'filter',
      source: 'table',
      dependency: ['test'],
      transform: [
        {
          type: 'filter',
          callback: (datum, params) => {
            return data.a > params.test;
          },
        }
      ]
    }
  ]
}

```
