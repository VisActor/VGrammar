{{ target: scales-common-range }}

<!-- Syntax elements data, DataSpec -->

#${prefix} range(Object)

Set the `scale` value domain, which can be coordinates, colors, or other content

There are three supported formats:

- Object type, setting the `range` value by parsing specific data, with the specific type defined as follows:

```ts
{
  data: string | IData;
  field: string | string[];
  sort?: (datumA: any, datumB: any) => number
}
```

- Custom function type, with the specific type defined as follows:

```ts
(scale: IBaseScale, parameters: any) => any;
```

- Object type, setting the `range` value by binding with an axis of the coordinate system. In this case, the `range` corresponds to the coordinate range of a certain axis of the coordinate system. The specific configuration is as follows:

```ts
{
  coordinate: string;
  dimension: 'x' | 'y';
  isSubshaft?: boolean;
  reversed?: boolean
}
```