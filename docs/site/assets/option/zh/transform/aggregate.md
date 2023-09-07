{{ target: transform-aggregate }}

## transform.aggregate(Object)

### type(string) = 'aggregate'

将数据变换的变换设置为`'aggregate'`，实现对数据的聚合变换，支持多种聚合类型的配置

### groupBy(Array)

类型为`string[]`，根据申明的字段进行分组，支持单个字段分组，也支持多个字段分组

### operations(Array) = ['count']

类型：`string[]`，用于设置聚合函数对应的类型

{{ use: common-aggregateop() }}

当 `ops` 未设置，默认值为 `['count']`，也就是默认会做计数的聚合计算

### fields(Array)

- 类型：`string[]`
- 是否必传： 否

设置聚合计算对应的维度字段，需要和 `ops` 一一对应

### as(Array)

- 类型：`string[]`
- 是否必传： 否

设置聚合计算结果对应的字段名称，会将结果通过这些字段设置到返回结果中，需要和 `ops`、`fields` 一一对应，如果未设置，默认值为 会根据`${ops[index]}_${fields[index]}` 生成对应的字段名称

### drop(boolean)

- 类型：`boolean`
- 是否必传： 否

是否丢弃空的数据

### cross(boolean)

类型：`boolean`
是否必传： 否

是否补充 group-by 叉乘后的所有元素

### key(string)

设置全局唯一的 key 字段，这个字段对应的结果会被设置到返回结果中；如果未设置，会根据分组字段`groupBy`的配置，自动创建唯一的 key
