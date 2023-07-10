# Data

Graphic grammar elements - data.

## Instance Methods

### values

Set the value of a data element

```ts
(values: any[] | Nil, load?: boolean) => this;
```

### source

Set the source of a data element

```ts
(source: string | string[] | IData | IData[], load?: boolean) => this;
```

### transform

Set the transformation of a data element

```ts
(transform: TransformSpec[] | Nil) => this;
```

### field

Get the fields in a data element

```ts
(field: string) => any[];
```

### getValue

Get the value of a data element

```ts
() => any[];
```

### getInput

Get the input of a data element

```ts
() => any[];
```

### getDataIDKey

Get the unique identifier of a data element

```ts
() => string;
```

### id

Set or read the unique identifier `id` of the component.

### name

Set or read the component's name `name`.

### depend

Set dependent grammar elements, ts type definition is as follows:

```ts
(grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;
```

The parameter can be an instance of another grammar element, or an ID corresponding to a grammar element.

### clear

Clear all configurations of the current grammar element

### release

Release and destroy the grammar element instance
