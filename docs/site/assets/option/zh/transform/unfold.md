{{ target: transform-unfold }}

## transform.unfold(Object)

对数据实现过滤变换

### type(string) = unfold

将变换的类型设置为`unfold`

### groupBy

类型为`string[]`，根据申明的字段进行分组，支持单个字段分组，也支持多个字段分组

### field

读取申明的`field`对应的字段的值，作为返回结果中的 key

### value

类型：`string`

读取申明的`value`对应的字段的值，作为返回结果中的 值

### operation

设置聚合函数的类型

{{ use: common-aggregateop() }}

### limit(number) = 0

对原始数据，获取唯一 key 后，返回前 `limit` 个元素，如果`limit`为 0，就返回全部

### key(string)

设置全局唯一的 key 字段，这个字段对应的结果会被设置到返回结果中；如果未设置，会根据分组字段`groupBy`的配置，自动创建唯一的 key
