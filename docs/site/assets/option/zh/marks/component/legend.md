{{ target: marks-component-legend }}

## componentType.legend(Object)

### componentType(string) = 'legend'

将组件类型设置为 `legend`

### legendType(string)

设置图例类型

- 'auto' 根据关联的`scale`自动解析
- 'discrete' 离散类型
- 'color' 颜色类型
- 'size' 大小类型

{{ use: marks-common-scale( prefix = '##' ) }}

{{ use: marks-common-target(
  prefix = '##',
  type = 'legend',
  filterValueType = 'any[]'
) }}

{{ use: marks-encode(type = 'legend', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
