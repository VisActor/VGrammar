{{ target: transform-tree }}

## transform.tree(Object)

Transforms hierarchical data and calculates the tree layout

### type(string) = tree

Sets the data transformation type to `tree`

### direction(string)='horizontal'

Set the alignment of the tree diagram, optional values are:

- `'horizontal'` Sets the layout direction to horizontal, from left to right
- `'vertical'` Sets the layout direction to vertical, from top to bottom
- `'LR'` Sets the layout direction from left to right
- `'RL'` Sets the layout direction from right to left
- `'TB'` Sets the layout direction from top to bottom
- `'BT'` Sets the layout direction from bottom to top

### layoutType(string)='orthogonal'

Set the layout type, the default value is `orthogonal`, which means layout in the Cartesian coordinate system; when the value is set to `radial`, it means layout in the polar coordinate system.

### alignType(string)='depth'

Set the alignment of the layout, optional values are:

- `'depth'` Align according to the depth of the tree
- `'leaf'` Align the leaf nodes of the tree

### linkWidth

Type: `number | number[]`
Is it required: No

- Specify the width of the link, if not specified,
- Compute the depth-most nodes for extents.

Set the width of tree diagram connections, if vertical layout, it means the height of the connection, supporting two formats:

- number: Set the width of all connections
- number[]: Set the width of connections for each level

If not set, the maximum depth will be calculated, and then the width of connections for each level will be calculated.

### minNodeGap(number)

Set the minimum spacing between siblings, if not set, it will be automatically calculated based on the width of the node.

### nodeKey

Type: `string|number`
Sets the field corresponding to the globally unique key of the node, if not set, it will be generated internally based on the level information.