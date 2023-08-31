{{ target: projections-function }}

Supports two types of setting methods

- `${returnType}` type
- `function` type, calculating the result through a custom function, with the ts type definition of the function being:

```
(projection: any, parameters: any) => ${returnType};
```

where `parameters` are the other syntax elements that this `projection` syntax element depends on.