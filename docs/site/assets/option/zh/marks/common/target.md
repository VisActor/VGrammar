{{ target: marks-common-target }}

#${prefix} target

设置 ${type} 触发数据更新后，需要更新的数据元素

##${prefix} data

设置更新数据对应的`data`语法元素，支持两种类型的设置：

- `string` data 语法元素对应的 id
- `IData` data 语法元素对应的实例，主要用于 API 创建模式

{{ if: ${type} !== 'player' }}

##${prefix} filter

对目标数据元素，执行 filter 操作，支持两种类型的设置：

- `string` 更新数据元素中对应的字段
- `function` 自定义过滤函数，定义为：`(datum: any, value: ${filterValueType}) => boolean`

{{ else }}

##${prefix} source

设置数据来源，支持三种类型的设置：

- `string` data 语法元素对应的 id
- `IData` data 语法元素对应的实例，主要用于 API 创建模式
- `any[]` 自定义的数据

{{ /if }}
