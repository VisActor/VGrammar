{{ target: marks-component-crosshair }}

## componentType.crosshair(Object)

### componentType(string)='crosshair'

将组件类型设置为 `crosshair`

### crosshairType(string)

支持一下类型：

- 'x'
- 'y'
- 'angle'
- 'radius'
- 'radius-polygon'

### crosshairShape(string)

支持一下类型：

- 'line'
- 'rect';

{{ use: marks-encode(type = 'crosshair', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
