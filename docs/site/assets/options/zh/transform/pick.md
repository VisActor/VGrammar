{{ target: transform-pick }}

## transform.pick(Object)

对数据实现过滤变换

### type(string) = pick

将数据变换的类型设置为`'pick'`，即从原始数据中挑选部分字段作为新数据

### fields(Array)

设置原始的数据字段或者数据计算的回调函数，支持两种类型：

- string[] - 字符串数组，每个元素都是用于指定获取数组元素指定字段下的值，支持'a.b'的格式，获取数据元素 `{ a: { b: 12 } }` 中的值
- function[] - 函数数组，每个元素都是自定义获取数据的回调函数

### as

类型为`string[]`，设置返回结果中的 key，如果不设置，会读取`fields`的值，当`fields`中的值为函数类型的时候，会读取函数的`fname`属性
