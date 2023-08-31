{{target: transform-sankey}}

## transform.sankey(Object)

Transform hierarchical data and calculate sankey layout

### type(string) = sankey

Set the data transformation type to `sankey` for calculating sankey layout

### direction(string)='horizontal'

The layout direction of the Sankey diagram, default value is horizontal, optional values are:

- `'horizontal'` sets the layout direction to horizontal
- `'vertical'` sets the layout direction to vertical

### nodeAlign(string)='justify'

Set the alignment of nodes in the same level, optional values are:

- `'left'` if the layout direction is horizontal, align nodes to the left, if the layout direction is vertical, align nodes to the top
- `'right'` if the layout direction is horizontal, align nodes to the right, if the layout direction is vertical, align nodes to the bottom
- `'center'` align nodes to the center
- `'justify'` align nodes to both ends
- `'start'` same meaning as `'left'`
- `'end'` same meaning as `'right'`

### nodeGap(number)=8

Set the gap size between nodes in the same level

### nodeWidth

Set the width of the nodes. If the layout direction is vertical, this value corresponds to the node's height, and supports three types of values:

- 1. `string` percentage string, e.g. { nodeWidth: '12%' }
- 2. `number` simple number, in px, e.g. { nodeWidth: 20 }
- 3. `function` function, custom calculation of node width

### linkWidth(number)

Specify the width of the edges between nodes, in `px`; if the layout direction is vertical, this value corresponds to the height of the edge;
This value can be unset, and if unset, a suitable value will be calculated based on the number of levels

### minStepWidth(number)

The minimum width ( = single node width + single edge width) corresponding to each level; if the layout is vertical, this value corresponds to the height;
If not set, a suitable value will be calculated based on the number of nodes;
For special layout scenarios, it is recommended to use this property in conjunction with a scrollbar when displaying the graph

### minNodeHeight(number)

For non-empty nodes, set the minimum node height, in `px`; if the layout is vertical, this value corresponds to the width;

This configuration mainly solves the problem that the node height will be very small when the data is very small, making it hard to see the node;

It is recommended not to set this value too large, generally not more than `5`

### minLinkHeight(number)

Set the minimum height of the link, in `px`; if the layout is vertical, this value corresponds to the width;
This configuration mainly solves the problem that the link height will be very small when the data is very small, making it hard to see the link;
It is recommended not to set this value too large, generally not more than `5`
Can be used in conjunction with `minNodeHeight`; it is recommended that this value be less than the value set for `minNodeHeight`

### iterations(number)=6

Set the number of iterations for the layout calculation, the more iterations, the more accurate the layout calculation result, but the calculation time will also be longer

### nodeKey

Type: `string|number`
Set the field corresponding to the globally unique key of the node, if not set, it will be generated internally based on the level and other information

### linkSortBy(function)

Set the edge sorting function, if not set, no sorting will be done on the edge-related data

### nodeSortBy(function)

Set the node sorting function, if not set, no sorting will be done on the node data

### setNodeLayer

Custom set the node to ultimately display in which level, no need to set by default, only need to set for special customization needs
