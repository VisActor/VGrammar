# Coordinate

图形语法元素 - 坐标系。

## 实例方法

### start

设置坐标系的起始点

```ts
(start: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### end

设置坐标系的结束点

```ts
(end: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### origin

设置坐标系的原点

```ts
(origin: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### translate

设置坐标系的平移

```ts
(offset: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### rotate

设置坐标系的旋转

```ts
(angle: CoordinateFunctionType<number> | Nil) => this;
```

### scale

设置坐标系的缩放

```ts
(ratio: CoordinateFunctionType<[number, number]> | Nil) => this;
```

### transpose

设置坐标系是否进行转置

```ts
(isTransposed: CoordinateFunctionType<boolean> | Nil) => this;
```

### id

设置或者读取组件的唯一标识符`id`。

### name

设置或者读取组件的名称`name`。

### depend

设置依赖的语法元素，ts 类型定义如下：

```ts
(grammar: IGrammarBase[] | IGrammarBase | string[] | string) => this;
```

参数可以是其他语法元素的实例，也可以是一个语法元素对应的`id`。

### clear

清除当前语法元素所有的配置

### release

释放销毁该语法元素实例
