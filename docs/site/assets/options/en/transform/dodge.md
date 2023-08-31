{{target: transform-dodge}}

## transform.dodge(Object)

A transformation that adjusts the position of all graphic elements in **mark** for group position adjustment.

### type(string) = dodge

Sets the transformation type to `dodge` for implementing group position adjustment of graphic elements; it can be applied to multiple primitives:

- interval
- rect
- symbol
- text

### innerGap

Type: `number|string`

The spacing between two graphic elements within the same group supports two types of values:

- `number` type, specifying the distance between graphic elements, measured in `px`
- `string` type, formatted like `12%`, for declaring a percentage value, specifying the distance between graphic elements, with the denominator as the total width of the group

### maxWidth(number)

Sets the maximum width of `rect` and `interval` primitives, measured in `px`; if the primitive has undergone a coordinate system transposition transformation, the value corresponds to the height.

### minWidth(number)

Sets the minimum width of `rect` and `interval` primitives, measured in `px`; if the primitive has undergone a coordinate system transposition transformation, the value corresponds to the height.

### categoryGap

Sets the spacing between two groups, supporting two types of values:

- `number` type, specifying the distance between two groups, measured in `px`
- `string` type, formatted like `12%`, for declaring a percentage value, specifying the distance between two groups, with the denominator as the total width of the group

### dodgeBy

Sets the grouping field; if not set, the default is to use the `Element`'s `groupKey` field.

### dodgeChannel

Specifies the channel for group position adjustment. If not set, it will try to parse the associated `scale` of the primitive and will use the graphic channel associated with the `band` type scale as the visual channel for group adjustment by default.
Available options are:

- 'x'
- 'y'
