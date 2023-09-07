{{ target: marks-component-crosshair }}

## componentType.crosshair(Object)

### componentType(string)='crosshair'

Set the component type to `crosshair`

### crosshairType(string)

Supports the following types:

- 'x'
- 'y'
- 'angle'
- 'radius'
- 'radius-polygon'

### crosshairShape(string)

Supports the following types:

- 'line'
- 'rect';

{{ use: marks-encode(type = 'crosshair', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}