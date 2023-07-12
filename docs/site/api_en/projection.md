# Projection

Graphic Syntax Element - Projection

## Instance Methods

### id

Set or read the unique identifier `id` of the component.

### name

Set or read the name `name` of the component.

### depend

Set the dependent syntax elements, ts type definition as follows:

```ts
(grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;
```

The parameter can be an instance of other syntax elements or an `id` corresponding to a syntax element.

### clear

Clears all configurations of the current syntax element

### release

Release and destroy this syntax element instance
