{{ target: scales-common-range }}

<!-- 语法元素 data, DataSpec -->

#${prefix} range(Object)

设置`scale`的值域，可以是坐标，也可以颜色，或者其他的内容

支持的格式有三种：

- 对象类型，通过解析某个数据，来设置`range`的值，具体类型定义如下：

```ts
{
  data: string | IData;
  field: string | string[];
  sort?: (datumA: any, datumB: any) => number
}
```

- 自定义函数类型，具体的类型定义如下：

```ts
(scale: IBaseScale, parameters: any) => any;
```

- 对象类型，通过和坐标系的某个轴进行绑定，来设置`range`的值，这种情况，`range`对应的是坐标系某个轴的坐标范围，具体的配置如下：

```ts
{
  coordinate: string;
  dimension: 'x' | 'y';
  isSubshaft?: boolean;
  reversed?: boolean
}
```
