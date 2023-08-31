{{ target: marks-common-functionType }}

Support two types of setting methods:

- `${returnType}` type
- `function` type, calculate the result through custom function, where the ts type definition of the function is:

```
(datum: any, el: IElement, parameters: any) => ${returnType};
```

The `parameters` are the other syntax elements that this mark syntax element depends on.