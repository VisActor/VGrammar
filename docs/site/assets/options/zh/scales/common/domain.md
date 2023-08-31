{{ target: scales-common-domain }}

<!-- 语法元素 data, DataSpec -->

#${prefix} domain(Object)

设置`scale`的定义域，支持两种格式的设置：

- 对象类型，具体类型定义如下：

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
