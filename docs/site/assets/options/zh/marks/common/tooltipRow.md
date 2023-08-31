{{ target: marks-common-tooltipRow }}

#${prefix} visible
是否显示

#${prefix} key
设置`key` 对应的内容，支持多种格式：

**第一种**： 通过两种格式，返回`key`对应的值

{{ use: marks-common-functionType(
  returnType = 'string',
) }}

**第二种**：通过两种格式，返回`key`对应的`text`类型的图形展示的图形属性，可以参考`type: 'text'`的 mark 对应的 encode 设置

{{ use: marks-common-functionType(
  returnType = 'ITextGraphicAttribute',
) }}

**第三种**：通过字段，设置`key`对应的值

{{ use: marks-common-fieldEncode() }}

#${prefix} value
设置`value` 对应的内容，支持多种格式：

**第一种**： 通过两种格式，返回`value`对应的值

{{ use: marks-common-functionType(
  returnType = 'string',
) }}

**第二种**：通过两种格式，返回`value`对应的`text`类型的图形展示的图形属性，可以参考`type: 'text'`的 mark 对应的 encode 设置

{{ use: marks-common-functionType(
  returnType = 'ISymbolGraphicAttribute',
) }}

第三种：通过字段，设置`value`对应的值

{{ use: marks-common-fieldEncode() }}

#${prefix} symbol
设置`symbol` 对应的内容，支持多种格式：

**第一种**： 通过两种格式，返回`symbol`对应类型

{{ use: marks-common-functionType(
  returnType = 'string',
) }}

**第二种**：通过两种格式，返回`symbol`对应的图形属性，可以参考`type: 'symbol'`的 mark 对应的 encode 设置

{{ use: marks-common-functionType(
  returnType = 'ISymbolGraphicAttribute',
) }}

**第三种**：通过字段，设置`symbol`对应的对应

{{ use: marks-common-fieldEncode() }}
