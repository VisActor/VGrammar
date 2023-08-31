{{ target: common-callback }}

`callback` can accept two parameters, the first parameter is the data object, and the second parameter is the syntax element `data` dependent on the parameters,

In the following example, the data depends on the `test` signal

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
