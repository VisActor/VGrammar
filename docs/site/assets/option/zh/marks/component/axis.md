{{ target: marks-component-axis }}

## componentType.axis(Object)

### componentType(string) = 'axis'

将组件类型设置为 `axis`

### axisType(string)

设置轴的类型，支持两种类型的配置：

- 'line'
- 'circle';

### tickCount(number)

设置刻度的个数

### inside(boolean)

坐标轴是否朝向坐标系的内部

### baseValue(number)

设置坐标值对应的基准值，比如说`x`轴对应了`y`轴基准值为`0`

{{ use: marks-common-scale( prefix = '##' ) }}

{{ use: marks-encode(type = 'axis', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
