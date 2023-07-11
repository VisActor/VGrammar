# Mark

The elemenet of grammar element - Mark.

## Instance Properties

### markType

Type: `string`
Mark type

### group

Type: `IGroupMark`
Parent Mark

## Instance Methods

### join

Set the associated data, ts type definition is as follows:

```ts
(data: IData | string | Nil, key?: MarkKeySpec, sort?: MarkSortSpec, groupBy?: MarkKeySpec, groupSort?: MarkSortSpec) =>
  this;
```

Parameter `data`: Set the data element to depend on, support setting the `id` of the corresponding data element, or setting the instance of the corresponding data element; when this parameter is empty, it is equivalent to deleting the dependency on the old data element;
Parameter `key`: Set the unique identifier of the mark data element, which is used to calculate the data state of the graphic element. For a detailed definition, please refer to [Configuration/mark/spec](#mark).
Parameter `sort`: Sort all graphic elements in the mark and set the corresponding sorting callback function.
Parameter `groupBy`: Set the grouping attribute.
Parameter `groupSort`: Sort the grouping in the mark and set the corresponding sorting callback function.

### state

Set the mark state, ts type definition is as follows:

```ts
(state: MarkFunctionType<string | string[]> | Nil) => this;
```

### encode

Set the mark encoding, ts type definition is as follows:

```ts
((encoders: BaseEncodeSpec) => this) & ((channel: string, value: ChannelEncodeType) => this);
```

### encodeState

Set the mark encoding state, ts type definition is as follows:

```ts
((state: string, channel: string, value: ChannelEncodeType) => this) &
  ((state: string, encoders: BaseEncodeSpec) => this);
```

### animation

Set the mark animation configuration, ts type definition is as follows:

```ts
(animationConfig: MarkAnimationSpec | Nil) => this;
```

### animationState

Set the mark animation state, ts type definition is as follows:

```ts
(animationState: MarkFunctionType<string> | Nil) => this;
```

### layout

Set the mark layout configuration, ts type definition is as follows:

```ts
(layout: MarkLayoutSpec | MarkLayoutCallback | Nil) => this;
```

### configure

Set the mark configuration, ts type definition is as follows:

```ts
(config: IMarkConfig | Nil) => this;
```

### transform

Set the mark transformation, ts type definition is as follows:

```ts
(transform: TransformSpec[] | Nil) => this;
```

### getBounds

Get the boundary of the mark

```ts
() => IBounds;
```

### isCollectionMark

Determine if the mark is a collection mark

```ts
() => boolean;
```

### getAllElements

Get all graphic elements in the mark

```ts
() => IElement[];
```

### coordinate

Set the associated coordinate system id or the graphic element corresponding to the coordinate system

### isProgressive

Is incremental rendering mode enabled

### isDoingProgressive

Is incremental rendering in progress

### clearProgressive

Clear the incremental rendering related state

### restartProgressive

Start incremental calculation from the first frame

### evaluateProgressive

Execute in slices

### id

Set or read the unique identifier `id` of the component.

### name

Set or read the name `name` of the component.

### depend

Set dependent syntax elements, ts type definition is as follows:

```ts
(grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;
```

Parameters can be instances of other grammar elements or the `id` corresponding to a grammar element.

### clear

Clear all configurations of the current syntax element

### release

Release and destroy the syntax element instance
