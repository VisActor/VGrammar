# Projection

图形语法元素 - 投影

## id(function)

设置或者读取组件的唯一标识符`id`。

## name(function)

设置或者读取组件的名称`name`。

## depend(function)

设置依赖的语法元素，ts 类型定义如下：

```ts
(grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;
```

参数可以是其他语法元素的实例，也可以是一个语法元素对应的`id`。

## clear(function)

清除当前语法元素所有的配置

## release(function)

释放销毁该语法元素实例
