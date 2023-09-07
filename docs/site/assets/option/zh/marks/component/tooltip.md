{{ target: marks-component-tooltip }}

## componentType.tooltip(Object)

### componentType(string) = 'tooltip'

将组件类型设置为 `tooltip`

### title

{{ use: marks-common-tooltipRow( prefix = '###' ) }}

### content

设置 tooltip 的内容，支持两种类型：

- `ITooltipRow` 具体配置如下：
- `ITooltipRow[]` 将下面的配置，通过数组对象传入

{{ use: marks-common-tooltipRow( prefix = '###' ) }}

{{ use: marks-common-markTarget( prefix = '##' ) }}

{{ use: marks-encode(type = 'tooltip', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
