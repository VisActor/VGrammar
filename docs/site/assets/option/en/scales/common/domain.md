{{target: scales-common-domain}}

<!-- Syntax Element: data, DataSpec -->

#${prefix} domain(Object)

Set the domain of the `scale`, supporting two formats of settings:

- Object type, with the specific type definition as follows:

```ts
{
  data: string | IData;
  field: string | string[];
  sort?: (datumA: any, datumB: any) => number
}
```

- Custom function type, with the specific type definition as follows:

```ts
(scale: IBaseScale, parameters: any) => any;
```
