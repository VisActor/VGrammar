{{ target: marks-component-slider }}

## componentType.slider(Object)

### componentType(string) = 'slider'

将组件类型设置为 `slider`

### min(number)

设置最小值

### max(number)

设置最大值

{{ use: marks-common-target(
  prefix = '##',
  type = 'slider',
  filterValueType = '{ start: number; end: number }'
) }}

{{ use: marks-encode(type = 'slider', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
