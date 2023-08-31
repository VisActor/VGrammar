{{ target: marks-component-slider }}

## componentType.slider(Object)

### componentType(string) = 'slider'

Set the component type to `slider`

### min(number)

Set the minimum value

### max(number)

Set the maximum value

{{ use: marks-common-target(
  prefix = '##',
  type = 'slider',
  filterValueType = '{ start: number; end: number }'
) }}

{{ use: marks-encode(type = 'slider', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}