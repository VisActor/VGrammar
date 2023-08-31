{{target: transform-treemap}}

## transform.treemap(Object)

Transform hierarchical data and calculate treemap layout

### type(string) = treemap

Set the data conversion type to `treemap` and calculate the treemap layout

### gapWidth

Set the gap between two nodes with the same depth, supporting two formats of configuration

- 1. number type: Set the gap for nodes at all levels to the specified value
- 2. number[] array type: `number[i]` indicates the gap between nodes with `depth = i`

### padding

Type: `number | number[]`

Set the padding, supporting two formats:

- number: Set padding for each level
- `number[]`: number[i] represents the padding of the node with depth = i

### aspectRatio(number)

Set the aspect ratio, the default value is `(1 + Math.sqrt(5)) / 2`. It only takes effect when `splitType` is set to `squarify`, other partition algorithms do not care about this parameter.

### labelPadding

For non-leaf nodes, set the padding of the label. When and only when there is enough position available, the space for displaying the label will be reserved;
Optional values:

- `number`: Set the padding of the label for all levels
- `number[]`: number[i] represents the padding of the label for the node with depth = i

### labelPosition(string)='top'

For non-leaf nodes, set the label position, optional values:

- `'top'` Top
- `'bottom'` Bottom
- `'left'` Left
- `'right'` Right

The configuration will be taken into account, and the space in the corresponding direction will be reserved before calculating the division of child nodes.

### splitType(string)='binary'

The algorithm type for partitioning rectangles, optional values:

- `'binary'` Binary method
- `'squarify'` Squarify algorithm
- `'slice'` Slice algorithm, partition along the horizontal direction
- `'dice'` Dice algorithm, partition along the vertical direction
- `'slice-dice'` Slice-dice algorithm, alternate horizontal direction and vertical direction partitioning

### nodeKey

Type: `string|number`
Set the field corresponding to the globally unique key of the node. If not set, the internal algorithm will generate it based on the hierarchy information.

### maxDepth(number)

Set the maximum depth. When the depth of the node is greater than maxDepth, the layout of the next level will not be calculated. This configuration can be left unset.

### minVisibleArea(number)=10

Set the minimum visible area. When the node's area is smaller than minVisibleArea, the layout of the next level will not be calculated. This configuration can be left unset.

### minChildrenVisibleArea

Set the minimum visible area for child nodes. When the node's area is smaller than `minChildrenVisibleArea`, this child node will be hidden. This configuration can be left unset.
When the value is of array type, `minChildrenVisibleArea[i]` represents the minimum visible area of child nodes for the node with `depth = i`.

### minChildrenVisibleSize

Set the minimum visible size for child nodes. When the width or height of the node is smaller than `minChildrenVisibleSize`, this child node will be hidden. This configuration can be left unset.
When the value is of array type, `minChildrenVisibleSize[i]` represents the minimum visible size of child nodes for the node with `depth = i`.
