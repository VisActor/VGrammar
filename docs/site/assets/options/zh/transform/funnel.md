{{ target: transform-funnel }}

## transform.funnel(Object)

用于计算`funnel`布局，实现常见的漏斗图

### type(string) = funnel

将数据变换的类型设置为 `funnel`，用于计算`funnel`布局，实现常见的漏斗图

### field(string)

设置数据对应的字段

### asTransformRatio(string)

设置 **转化率（当前层到下一层的比例）**数据保存的字段，如果没有设置，则不存储转化率对应的数据

### asReachRatio(string)

设置 **到达率 （上一层到当前层的比例）**数据保存的字段，如果没有设置，则不存储到达率对应的数据

### asHeightRatio(string)

高度轴占总量的比例

### asValueRatio(string)

当前值大小占比

### asLastValueRatio(string)

上一层值大小占比

### asNextValueRatio(string)

下一层值大小占比

### asCurrentValue(string)

当前层的值

### asLastValue(string)

上一层的值

### asNextValue(string)

下一层的值

### isCone(boolean)

最底层漏斗是否为锥形

### heightVisual(boolean)

高度是否进行数据映射

### range(object)

数值范围，格式为`{ min: number; max: number }`，设置数据的最大范围，用于计算最后一层的转化率相关指标
