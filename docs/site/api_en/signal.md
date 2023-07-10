# Signal

Graphical Grammar Element - Signal

## Instance Methods

### value

Set the signal value

```ts
(value: T | Nil) => this;
```

### update

Set the signal update function

```ts
(update: SignalFunctionType<T> | Nil) => this;
```

### getValue

Get the signal value

```ts
() => T;
```

### id

Set or read the unique identifier `id` of the component.

### name

Set or read the component name `name`.

### depend

Set the dependent grammar element with the following ts Type Definition:

```ts
(grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;
```

The parameter can be an instance of another grammar element or the `id` of a corresponding grammar element.

### clear

Clear all configurations of the current grammar element

### release

Destroy and release the grammar element instance
