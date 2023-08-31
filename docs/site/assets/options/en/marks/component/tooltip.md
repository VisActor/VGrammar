{{ target: marks-component-tooltip }}

## componentType.tooltip(Object)

### componentType(string) = 'tooltip'

Set the component type to `tooltip`

### title

{{ use: marks-common-tooltipRow( prefix = '###' ) }}

### content

Set the content of the tooltip, supporting two types:

- `ITooltipRow` The specific configuration is as follows:
- `ITooltipRow[]` Pass the following configuration through an array object

{{ use: marks-common-tooltipRow( prefix = '###' ) }}

{{ use: marks-common-markTarget( prefix = '##' ) }}

{{ use: marks-encode(type = 'tooltip', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}