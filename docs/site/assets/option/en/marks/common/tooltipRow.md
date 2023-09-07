{{ target: marks-common-tooltipRow }}

#${prefix} visible
Whether to display

#${prefix} key
Set the content corresponding to `key`, supporting multiple formats:

**First Type**: Return the value corresponding to `key` through two formats

{{ use: marks-common-functionType(
  returnType = 'string',
) }}

**Second Type**: Return the graphic attributes of the `text` type graphic presentation corresponding to `key` through two formats, which can refer to the encode settings of the `type: 'text'` mark

{{ use: marks-common-functionType(
  returnType = 'ITextGraphicAttribute',
) }}

**Third Type**: Set the value corresponding to `key` through the field

{{ use: marks-common-fieldEncode() }}

#${prefix} value
Set the content corresponding to `value`, supporting multiple formats:

**First Type**: Return the value corresponding to `value` through two formats

{{ use: marks-common-functionType(
  returnType = 'string',
) }}

**Second Type**: Return the graphic attributes of the `text` type graphic presentation corresponding to `value` through two formats, which can refer to the encode settings of the `type: 'text'` mark

{{ use: marks-common-functionType(
  returnType = 'ISymbolGraphicAttribute',
) }}

Third Type: Set the value corresponding to `value` through the field

{{ use: marks-common-fieldEncode() }}

#${prefix} symbol
Set the content corresponding to `symbol`, supporting multiple formats:

**First Type**: Return the type corresponding to `symbol` through two formats

{{ use: marks-common-functionType(
  returnType = 'string',
) }}

**Second Type**: Return the graphic attributes corresponding to `symbol` through two formats, which can refer to the encode settings of the `type: 'symbol'` mark

{{ use: marks-common-functionType(
  returnType = 'ISymbolGraphicAttribute',
) }}

**Third Type**: Set the corresponding content of `symbol` through the field

{{ use: marks-common-fieldEncode() }}