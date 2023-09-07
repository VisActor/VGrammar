{{ target: scales-common-nice }}

<!-- 语法元素 data, DataSpec -->

#${prefix} nice

对于 scale，计算出优化后的刻度，根据刻度值，来更新`domain`，支持多种值：

- `boolean`：`true`表示自动计算，`false`表示不进行优化
- `number`：表示优化后的刻度个数
