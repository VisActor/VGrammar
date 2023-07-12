# Coordinate

Graphics grammar element - coordinate system.

## Instance Methods

### start

Set the starting point of the coordinate system

```ts
(start: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### end

Set the ending point of the coordinate system

```ts
(end: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### origin

Set the origin of the coordinate system

```ts
(origin: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### translate

Set the translation of the coordinate system

```ts
(offset: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### rotate

Set the rotation of the coordinate system

```ts
(angle: CoordinateFunctionType<number> | Nil) => this;
```

### scale

Set the scaling of the coordinate system

```ts
(ratio: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### transpose

Set whether the coordinate system needs to be transposed

```ts
(isTransposed: CoordinateFunctionType<boolean> | Nil) => this;
```

### id

Set or read the unique identifier `id` of the component.

### name

Set or read the name `name` of the component.

### depend

Set the dependent grammar elements, with the ts type definition as follows:

```ts
(grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;
```

The parameter can be an instance of other grammar elements, or an `id` corresponding to a grammar element.

### clear

Clear all configurations of the current grammar element

### release

Release and destroy the grammar element instance
