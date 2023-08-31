{{ target: scales-common-niceminmax }}

<!-- 语法元素 data, DataSpec -->

#${prefix} niceMin

只对`domain`的最小值进行优化，最大值不变，支持多种值：

- `boolean`：`true`表示自动计算，`false`表示不进行优化
- `number`：表示优化后的刻度个数

#${prefix} niceMax

只对`domain`的最大值进行优化，最小值不变，支持多种值：

- `boolean`：`true`表示自动计算，`false`表示不进行优化
- `number`：表示优化后的刻度个数
