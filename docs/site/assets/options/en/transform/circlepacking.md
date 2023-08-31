{{ target: transform-circlepacking }}

## transform.circlePacking(Object)

Transform hierarchical data and calculate circle packing layout

### type(string) = circlePacking

Set the data transformation type to `circlePacking` for calculating `circlePacking` layout

### nodeSort(boolean|Function)

Set the sorting of nodes, supporting two formats:

- `boolean` type: When the value is `false`, no sorting is performed; otherwise, the default sorting method is used, which is to sort the nodes by `value` from large to small;
- `Function` type: Customize the sorting function, which takes two node data and returns a number. The corresponding type definition is:

```ts
(a: CirclePackingNodeElement, b: CirclePackingNodeElement) => number;
```

### padding

Type: `number|number[]`
Required: No

Set the spacing between circles, supporting two formats:

- `number` Set a uniform padding for circles at all levels
- `number[]` Set different paddings for circles at each level

### setRadius(Function)

Customize the setting of the radius for each node. The function takes a single node data and returns a radius value. The corresponding type definition is:

```ts
(node: CirclePackingNodeElement) => number;
```

The default value is:

```ts
(node: CirclePackingNodeElement) => {
  return Math.sqrt(node.value);
};
```

### nodeKey(string)

Type: `string|number`

Set the field corresponding to the globally unique key of the node. If not set, it will be generated internally based on the level and other information.

### includeRoot(boolean)=false

Whether to include the root node