{{ target: marks-component-axis }}

## componentType.axis(Object)

### componentType(string) = 'axis'

Set the component type to `axis`

### axisType(string)

Set the type of axis, supporting two types of configuration:

- 'line'
- 'circle';

### tickCount(number)

Set the number of ticks

### inside(boolean)

Whether the coordinate axis points to the inside of the coordinate system

### baseValue(number)

Set the base value corresponding to the coordinate value, for example, the `x` axis corresponds to the `y` axis base value of `0`

{{ use: marks-common-scale( prefix = '##' ) }}

{{ use: marks-encode(type = 'axis', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}