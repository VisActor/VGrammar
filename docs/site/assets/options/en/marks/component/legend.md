{{ target: marks-component-legend }}

## componentType.legend(Object)

### componentType(string) = 'legend'

Set the component type to `legend`

### legendType(string)

Set the legend type

- 'auto' Automatically resolve based on the associated `scale`
- 'discrete' Discrete type
- 'color' Color type
- 'size' Size type

{{ use: marks-common-scale( prefix = '##' ) }}

{{ use: marks-common-target(
  prefix = '##',
  type = 'legend',
  filterValueType = 'any[]'
) }}

{{ use: marks-encode(type = 'legend', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}