{{ target: marks-common-target }}

#${prefix} target

Set the data elements that need to be updated after ${type} triggers the data update

##${prefix} data

Set the `data` syntax element corresponding to the updated data, supporting two types of settings:

- `string` The id corresponding to the data syntax element
- `IData` The instance corresponding to the data syntax element, mainly used for API creation mode

{{ if: ${type} !== 'player' }}

##${prefix} filter

Perform filter operation on the target data element, supporting two types of settings:

- `string` The field corresponding to the updated data element
- `function` Custom filter function, defined as: `(datum: any, value: ${filterValueType}) => boolean`

{{ else }}

##${prefix} source

Set data source, support three types of settings:

- `string` The id corresponding to the data syntax element
- `IData` The instance corresponding to the data syntax element, mainly used for API creation mode
- `any[]` custom data

{{ /if }}
