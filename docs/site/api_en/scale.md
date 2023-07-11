# Scale

The syntactic element Scale can be translated as "scale".

## Instance Methods

### domain

Set the scale's domain, its ts type definition is as follows:

```ts
(domain: ScaleFunctionType<any[]> | ScaleData | Nil) => this;
```

### range

Set the scale's range, its ts type definition is as follows:

```ts
(range: ScaleFunctionType<any[]> | ScaleData | Nil) => this;
```

### configure

Configure the scale, its ts type definition is as follows:

```ts
(config: ScaleConfigureSpec | Nil) => this;
```

### getScaleType

Get the scale's type, its ts type definition is as follows:

```ts
() => GrammarScaleType;
```

### getScale

Get the scale's instance, its ts type definition is as follows:

```ts
() => IBaseScale;
```

### ticks

Get the scale's ticks, its ts type definition is as follows:

```ts
(count?: number) => TickData[];
```

### getCoordinateAxisPoints

Get the starting and end points of the coordinate axis corresponding to the scale, its ts type definition is as follows:

```ts
(baseValue?: number) => [IPointLike, IPointLike];
```

### getCoordinate

Get the coordinate system corresponding to the scale, its ts type definition is as follows:

```ts
() => IPolarCoordinate | ICartesianCoordinate;
```

### getCoordinateAxisPosition

Get the position of the coordinate axis corresponding to the scale, its ts type definition is as follows:

```ts
() => 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'outside' | 'start' | 'end';
```

### id

Set or read the unique identifier `id` of the component.

### name

Set or read the component's name `name`.

### depend

Set the dependent syntactic elements. Its ts type definition is as follows:

```ts
(grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;
```

The argument can be an instance of another syntax element, or an `id` corresponding to a syntax element.

### clear

Clear all configurations of the current grammar element

### release

Release and destroy the grammar element instance
