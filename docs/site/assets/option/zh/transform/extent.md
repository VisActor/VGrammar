{{ target: transform-extent }}

## transform.extent(Object)

### type(string) = 'extent'

将数据变换类型设置为`'extent'`

### field

设置数据字段，支持两种类型：

- string - 字符串，获取数组元素指定字段下的值，支持'a.b'的格式，获取数据元素 `{ a: { b: 12 } }` 中的值
- function - 函数类型，自定义获取数据的回调函数
