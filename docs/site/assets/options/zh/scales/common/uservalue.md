{{ target: scales-common-uservalue }}

<!-- 语法元素 data, DataSpec -->

#${prefix} zero(boolean)

对于 scale，根据数据计算出一个原始的值域，也就是`domain`，然后在如下两种情况下，更新`domain`的值：

- 如果最小值大于`0`，将`domain`的最小值设置为`0`
- 如果最大值小于`0`，将`domain`的最大值设置为`0`

当用户非常关心`0`这个基准值的时候，可以设置为`true`，默认为`false`。

#${prefix} min(number)

根据数据计算出一个原始的值域，也就是`domain`，如果最小值大于用户配置的`min`，将`domain`的最小值设置为`min`

#${prefix} max(number)

根据数据计算出一个原始的值域，也就是`domain`，如果最大值大于用户配置的`max`，将`domain`的最大值设置为`max`
