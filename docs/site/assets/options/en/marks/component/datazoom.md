{{ target: marks-component-datazoom }}

## componentType.datazoom(Object)

### componentType(string) = 'datazoom'

Set the component type to `datazoom`

### preview(object)

Set the data corresponding to the preview

#### data

Set the `data` syntax element corresponding to the preview data, supporting two types of settings:

- `string` id corresponding to the data syntax element
- `IData` an instance corresponding to the data syntax element, mainly used for API creation mode

#### x

Same as the visual channel settings in `encode`

#### y

Same as the visual channel settings in `encode`

#### x1

Same as the visual channel settings in `encode`

#### y1

Same as the visual channel settings in `encode`

{{ use: marks-common-target(
  prefix = '##',
  type = 'datazoom',
  filterValueType = '{ start: number; end: number; startRatio: number; endRatio: number }'
) }}

{{ use: marks-encode(type = 'datazoom', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}