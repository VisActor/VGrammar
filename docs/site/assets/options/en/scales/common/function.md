{{ target: scales-common-function }}

Supports two formats for settings

- `${returnType}` type
- `function` type, calculating the result through custom functions, and the ts type definition of the function is:

```
(scale: IBaseScale, parameters: any) => ${returnType};
```

Where `parameters` are the other syntax elements that the scale syntax element depends on.