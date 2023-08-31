{{ target: scales-common-function }}

支持两种格式的设置方式

- `${returnType}` 类型
- `function` 类型，通过自定义函数计算结果，函数的 ts 类型定义为：

```
(scale: IBaseScale, parameters: any) => ${returnType};
```

其中 `parameters` 为该 scale 语法元素依赖的其他语法元素
