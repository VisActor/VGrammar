{{ target: marks-component-datazoom }}

## componentType.datazoom(Object)

### componentType(string) = 'datazoom'

将组件类型设置为 `datazoom`

### preview(object)

设置预览对应的数据

#### data

设置预览数据对应的`data`语法元素，支持两种类型的设置：

- `string` data 语法元素对应的 id
- `IData` data 语法元素对应的实例，主要用于 API 创建模式

#### x

同`encode`中视觉通道设置

#### y

同`encode`中视觉通道设置

#### x1

同`encode`中视觉通道设置

#### y1

同`encode`中视觉通道设置

{{ use: marks-common-target(
  prefix = '##',
  type = 'datazoom',
  filterValueType = '{ start: number; end: number; startRatio: number; endRatio: number }'
) }}

{{ use: marks-encode(type = 'datazoom', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
