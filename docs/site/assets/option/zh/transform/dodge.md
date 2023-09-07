{{ target: transform-dodge }}

## transform.dodge(Object)

对 **mark** 中的所有图形元素进行位置调整的变换，用于实现图形元素的分组位置调整

### type(string) = dodge

将变换的类型设置为 `dodge`，用于实现图形元素的分组位置调整；可以用于多种图元：

- interval
- rect
- symbol
- text

### innerGap

类型：`number|string`

同一组内，两个图形元素之间的间距，支持两种类型的值：

- `number`类型，指定图形元素之间的间距，单位为`px`
- `string`类型，格式如`12%`，用于申明一个百分比的值，指定图形元素之间的间距，分母为该组的总宽度

### maxWidth(number)

设置`rect`图元、`interval`图元的最大宽度，单位为`px`；如果图元进行了坐标系转置变换，则该值对应的是高度

### minWidth(number)

设置`rect`图元、`interval`图元的最小宽度，单位为`px`；如果图元进行了坐标系转置变换，则该值对应的是高度

### categoryGap

设置两个分组之间的间距，支持两种类型的值：

- `number`类型，指定两个分组之间的间距，单位为`px`
- `string`类型，格式如`12%`，用于申明一个百分比的值，指定两个分组之间的间距，分母为该组的总宽度

### dodgeBy

设置分组的字段，如果不设置，则默认使用`Element`的`groupKey`字段

### dodgeChannel

指定进行分组位置调整的通道，如果不设置，则会尝试解析图元关联的`scale`，默认会使用和`band`类型的 scale 关联的图形通道，作为分组调整的视觉通道
可选值有：

- 'x'
- 'y'
