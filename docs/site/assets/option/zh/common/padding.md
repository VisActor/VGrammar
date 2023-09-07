{{ target: common-padding }}

${componentName}内边距，单位 px，默认各方向内边距为 0，接受数值、数值数组以及对象设置。

使用示例：

```ts
// 数值类型，设置内边距为 5
padding: 5;
// 数值数组，设置上下的内边距为 5，左右的内边距为 10，用法同 CSS 盒模型
padding: [5, 10];
// 数值数组，分别设置四个方向的内边距
padding: [
  5, // 上
  10, // 右
  5, // 下
  10 // 左
];
// 对象类型
padding: {
  top: 5,
  right: 10,
  bottom: 5,
  left: 10
}
```
