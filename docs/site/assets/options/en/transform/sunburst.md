{{ target: transform-sunburst }}

## transform.sunburst(Object)

Transform the hierarchical data and calculate the sunburst layout.

### type(string) = sunburst

Set the data transformation type to `sunburst`, mainly used for the display of the sunburst chart.

### startAngle(number)

The starting angle of the sunburst chart, the default value is `Math.PI / 2`, which is the 12 o'clock direction.

### endAngle(number)

The starting angle of the sunburst chart, the default value is `(-3 * Math.PI) / 2`.

### center(Array)

The position of the center, the default value is `['50%', '50%']`, which is the center of the canvas.
The value type is an array of length 2, and the elements of the array support two formats:

- `number` Numeric type, specifying the center coordinate.
- `string` Percentage string, `center[0]` calculates a coordinate relative to the width of the canvas, and `center[1]` calculates a coordinate relative to the height of the canvas.

### innerRadius

The value corresponding to the minimum inner diameter, supporting three formats:

- `number` Numeric type, specifying the size of the inner diameter of the innermost layer, in `px`.
- `string` Percentage string, specifying the minimum inner diameter of all levels relative to the minimum value of the canvas width and height, calculating an inner diameter size according to the percentage.
- `Array<number|string>` Each element in the array type supports both numeric and percentage types, and the array is used to set the inner diameter size of each level.

### outerRadius

The value corresponding to the maximum outer diameter, supporting three formats:

- `number` Numeric type, specifying the size of the inner diameter of the outermost layer, in `px`.
- `string` Percentage string, specifying the size of the maximum outer diameter, relative to the minimum value of the canvas-width and height, calculating an outer diameter size according to the percentage.
- `Array<number|string>` Each element in the array type supports both numeric and percentage types, and the array is used to set the outer diameter size of each level.

### gapRadius

Set the radial spacing between adjacent levels, supporting two formats:

- `number` Numeric type, specifying the radial spacing between adjacent levels, in `px`.
- `number[]` Array type, `gapRadius[i]` represents the radial spacing between the `i`th and `i+1`th levels.

### nodeKey

Type: `string|number`
Set the field corresponding to the globally unique key of the node. If not set, it will be generated internally based on the level information.

### label

Set the text label of the node. If not set, no label-related data will be returned. Supports three formats:

- `boolean` Boolean type, sets whether to display a text label, valid for all levels.
- `SunburstLabelOptions` Set the text label configuration for all levels, see below for the specific meaning of the configuration.
- `SunburstLabelOptions[]` `label[i]` represents the text label configuration for the i-th level.

The specific type definition for `SunburstLabelOptions` is:

```ts
interface SunburstLabelConfig {
  align?: 'start' | 'end' | 'center';
  rotate?: 'tangential' | 'radial';
  offset?: number;
}
```

The meaning of each parameter is as follows:

- `align` represents the alignment of the label, `start` means aligned along the inner diameter direction, `end` means aligned along the outer diameter direction, `center` means aligned along the middle radius.
- `rotate` means the rotation of the label, `tangetial` means rotating along the tangent direction, `radial` means rotating along the radial direction.
- `offset` represents the offset of the label, in `px`.