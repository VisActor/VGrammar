{{ target: transform-join }}

## transform.join(Object)

数据变换 - 查询

### type(string) = join

将数据变换的类型设置为`join`，和 SQL 的`join`类似，即将两个数据源交叉查询

### from

查询的原始数据

### key(string)

原始数据的唯一标识对应的字段，支持`a.b`的格式

### fields

类型为：string[]

待执行数据变换的数据需要查询的字段

### values

类型为：string[]

来源数据中，需要查询的字段

### as

类型为：string[]

保存的字段

### default

数据缺失的时候，使用的默认值
