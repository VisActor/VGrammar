{{ target: transform-sunburst }}

## transform.sunburst(Object)

对层次数据进行变换，计算 sunburst 布局

### type(string) = sunburst

将数据变换类型设置为 `sunburst`，主要用于旭日图的展示

### startAngle(number)

旭日图的起始角度，默认值为`Math.PI / 2`，也就是时钟 12 点的方向

### endAngle(number)

旭日图的起始角度，默认值为 `(-3 * Math.PI) / 2`

### center(Array)

圆心的位置，默认值为`['50%', '50%']`，也就是画布的中心点
值的类型为长度为 2 的数组，数组的元素支持两种格式：

- `number` 数值类型，指定中心点的坐标
- `string` 百分比字符串，`center[0]`相对于画布的宽度计算一个坐标，`center[1]`相对于画布的高度计算一个坐标

### innerRadius

最小内径对应的值，支持三种格式：

- `number` 数值类型，指定最内层的内径的大小，单位为`px`
- `string` 百分比字符串，指定所有层级的最小内径，相对于画布的宽度、高度的最小值，按照百分比，计算一个内径的大小
- `Array<number|string>` 数组类型中的每个元素都支持数值类型和百分比类型，数组用于设置每个层级层级的内径大小

### outerRadius

最大外径对应的值，支三种格式：

- `number` 数值类型，指定最外层的内径的大小，单位为`px`
- `string` 百分比字符串，指定最外层的内径的大小，相对于画布的宽度、高度的最小值，按照百分比，计算一个外径的大小
- `Array<number|string>` 数组类型中的每个元素都支持数值类型和百分比类型，数组用于设置每个层级层级的外径大小

### gapRadius

设置相邻层级之间的半径间距，支持两种格式：

- `number` 数值类型，指定相邻层级之间的半径间距，单位为`px`
- `number[]` 数组类型，`gapRadius[i]`表示第`i`层和第`i+1`层之间间隔的半径大小

### nodeKey

类型：`string|number`
设置节点的全局唯一 key 对应的字段，如果不设置，内部会根据层级等信息自动生成

### label

设置节点的文本标签，如果不设置，则不返回标签相关的数据，支持三种格式：

- `boolean` 布尔类型，设置是否显示文本标签，对所有的层级生效
- `SunburstLabelOptions` 设置所有层级的文本标签配置，配置的具体含义见下文
- `SunburstLabelOptions[]` `label[i]`表示第 i 层的文本标签配置

`SunburstLabelOptions`的具体类型定义为：

```ts
interface SunburstLabelConfig {
  align?: 'start' | 'end' | 'center';
  rotate?: 'tangential' | 'radial';
  offset?: number;
}
```

其中，每个参数的含义如下：

- `align` 表示标签的对齐方式，`start` 表示沿着内径的方向对齐，`end` 表示沿着外径的方向对齐，`center` 表示沿着中间的半径对齐
- `rotate` 表示标签的旋转方式，`tangetial` 表示沿着切线方向旋转，`radial` 表示沿着半径方向旋转
- `offset` 表示标签的偏移量，单位为`px`
