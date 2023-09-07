{{target: marks-base}}

#${prefix} zIndex(number)

Set the zIndex of the container shape (group) corresponding to the `mark` graphic primitive

#${prefix} interactive(boolean)

Type: `boolean`
Required: No

#${prefix} context(Object)

Custom context, this data will be saved to the graphic primitive

#${prefix} setCustomizedShape

Set the callback function of custom shape. The corresponding ts type is as follows:

```ts
(datum: any[], attrs: any, path: ICustomPath2D) => ICustomPath2D;
```

Where `ICustomPath2D` is a utility class provided by VRender for drawing custom paths.

#${prefix} support3d(boolean)

Whether to support 3d mode when the canvas is set to 3d view.

#${prefix} group

Set the parent graphic primitive. Supports two formats:

- `'string'` The id of the corresponding parent graphic primitive
- `'IGroupMark'` The corresponding grammar element of the parent graphic primitive, generally used in API call scenarios.

If not set, it will be attached to the root node of the canvas by default.

#${prefix} from

ts type definition is:

```ts
interface MarkFromSpec {
  data: string | IData;
}
```

Declare the data on which the graphic primitive depends through the `data` attribute.

#${prefix} key

Set the unique identifier for the graphic primitive data element, which is used to calculate the data state of the graphic element. The corresponding ts type definition is:

```ts
type MarkKeySpec = string | ((datum: any) => string);
```

That is to say, it supports two formats:

- `string` Set the field corresponding to the `key`
- `function` Customize the callback function for parsing the `key`

#${prefix} sort

Sort all graphic elements in the graphic primitive and set the corresponding sorting callback function:

```ts
(datumA: any, datumB: any) => number;
```

#${prefix} groupBy

Set the grouping attribute, the corresponding ts type definition is:

```ts
type MarkKeySpec = string | ((datum: any) => string);
```

That is to say, it supports two formats:

- `string` Set the field corresponding to the grouping `key`
- `function` Customize the callback function for parsing the grouping `key`

#${prefix} groupSort

Sort the groups in the graphic primitive and set the corresponding sorting callback function:

```ts
(datumA: any, datumB: any) => number;
```

#${prefix} context(object)

Set the context parameters of the graphic primitive

#${prefix} coordinate(string)

Set the id or graphic element corresponding to the associated coordinate system of this graphic primitive

#${prefix} state

Set the state values ​​of all graphical elements of the current graphic primitive, supporting three formats:

- `string` Set the state of the graphic, for example, `{ state: 'selected'}` sets the state of all graphics to `'selected'`, usually in this case, the `encode` also sets the graphic channel mapping corresponding to the `'selected'` state
- `string[]` Set multiple states for the graphic, you can configure `stateSort` to influence the order of executing the graphic channel mapping corresponding to the state
- `function` Customize the callback function for parsing the state value, and the return parameter is `string | string[]`, the corresponding ts type definition is:

```ts
(datum: any, element: IElement, parameters: any) => string | string[];
```

#${prefix} stateSort

Set the sorting function of the state values ​​of all graphics elements of the current graphic primitive, which will affect the order of the graphic channel mapping corresponding to the state. The result of the graphic channel mapping executed earlier may be covered by subsequent states. The corresponding ts type definition is:

```ts
(stateA: string, stateB: string) => number;
```

#${prefix} transform

Set the corresponding transformation of the graphic primitive. All data transformations can be configured on the graphic primitive and are used for the `join data` execution transformation;
Another type of transformation is the transformation executed by graphical elements, such as `dodge`;
The general type definition is as follows:

```ts
interface BaseTransformSpec {
  /** the type of transform */
  type: string;
  [key: string]: TransformSpecValue | TransformSpecValue[];
}
```

The parameters supported by each transformation are different

#${prefix} layout

Set the layout parameters of the graphic primitive. There are two roles when the graphic primitive participates in the layout:

- 'container' Container graphic primitive, usually `group` graphic primitive
- 'item' layout child element, as a child node of the container graphic primitive

Please note that we only support one layer of layout. If it is a multi-layer nested layout, it is recommended to use a custom layout scheme for implementation;

Now support two content layouts: `grid` layout and `relative` layout, the related type definition is as follows

```ts
type MarkLayoutCallback = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: Bounds,
  options?: ILayoutOptions
) => void;

interface MarkBaseLayoutSpec {
  callback?: MarkLayoutCallback;
  skipBeforeLayouted?: boolean;
  updateViewSignals?: boolean;
}

interface MarkGridContainerSpec extends MarkBaseLayoutSpec {
  display: 'grid';
  gridTemplateRows?: (number | string | 'auto')[];
  gridTemplateColumns?: (number | string | 'auto')[];
  gridRowGap?: number;
  gridColumnGap?: number;
}

interface MarkGridItemSpec extends MarkBaseLayoutSpec {
  gridRowStart?: number;
  gridRowEnd?: number;
  gridColumnStart?: number;
  gridColumnEnd?: number;
}

interface MarkRelativeContainerSpec extends MarkBaseLayoutSpec {
  display: 'relative';
  maxChildWidth?: string | number;
  maxChildHeight?: string | number;
}

interface MarkRelativeItemSpec extends MarkBaseLayoutSpec {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'content' | 'auto' | string;
  padding?: CommonPaddingSpec;
}
```

If you want to set a custom layout scheme, `layout` also supports setting callback functions directly. The definition of the callback function is as follows:

```ts
type MarkLayoutCallback = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: Bounds,
  options?: ILayoutOptions
) => void;
```

##${prefix} display

The container graphic primitive sets the layout type and supports two configurations:

- `'relative'` Relative layout
- `'grid'` Grid layout

##${prefix} callback

Customize the callback function for this graphic primitive, the ts type definition is:

```ts
type MarkLayoutCallback = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: Bounds,
  options?: ILayoutOptions
) => void;
```

##${prefix} skipBeforeLayouted(boolean)

Skip the execution stage before the layout is completed

##${prefix} updateViewSignals(boolean)

Whether to update the default view signals, that is: `padding`, `viewWidth` and `viewHeight`

This property can only be set on a container graphic primitive with `'relative'` layout.

##${prefix} maxChildWidth

The parent graphic primitives of the relative layout set the maximum width of the child graphic primitives, supporting two formats:

- `'string'` Percentage string, such as `'20%'`, the denominator corresponds to the width of the bounding box of the container graphic primitive
- `'number'` Unit is `px`, set the absolute width

##${prefix} maxChildHeight

The parent graphic primitives of the relative layout set the maximum height of the child graphic primitives, supporting two formats:

- `'string'` Percentage string, such as `'20%'`, the denominator corresponds to the height of the bounding box of the container graphic primitive
- `'number'` Unit is `px`, set the absolute width

##${prefix} position

Set the position of the child graphic primitive of the relative layout. The supported settings are:

- 'top' Relative to the top of the parent graphic primitive
- 'bottom' Relative to the bottom of the parent graphic primitive
- 'left' Relative to the left side of the parent graphic primitive
- 'right' Relative to the right side of the parent graphic primitive
- 'content' Relative to the center of the parent graphic primitive, that is, the content area
- 'auto' When the graphic primitive sets the coordinate system, the position relative to the parent graphic primitive is automatically calculated according to the associated `scale`

##${prefix} padding

{{ use: common-padding(
 componentName = 'Child graphic primitive'
) }}

##${prefix} gridTemplateRows

The parent graphic primitive of the grid layout sets the row height

##${prefix} gridTemplateColumns

The parent graphic primitive of the grid layout sets the column width

##${prefix} gridRowGap(number)

The parent graphic primitive of the grid layout sets the row spacing

##${prefix} gridColumnGap(number)

The parent graphic primitive of the grid layout sets the column spacing

##${prefix} gridRowStart(number)

The child graphic primitive of the grid layout sets the row start position

##${prefix} gridRowEnd(number)

The child graphic primitive of the grid layout sets the row end position

##${prefix} gridColumnStart(number)

The child graphic primitive of the grid layout sets the column start position

##${prefix} gridColumnEnd(number)

The child graphic primitive of the grid layout sets the column end position
