# Scale

语法元素 Scale，可以翻译为尺度

## 实例方法

### domain

设置 scale 的 domain，ts 类型定义如下：

```ts
(domain: ScaleFunctionType<any[]> | ScaleData | Nil) => this;
```

### range

设置 scale 的 range，ts 类型定义如下：

```ts
(range: ScaleFunctionType<any[]> | ScaleData | Nil) => this;
```

### configure

配置 scale，ts 类型定义如下：

```ts
(config: ScaleConfigureSpec | Nil) => this;
```

### getScaleType

获取 scale 的类型，ts 类型定义如下：

```ts
() => GrammarScaleType;
```

### getScale

获取 scale 的实例，ts 类型定义如下：

```ts
() => IBaseScale;
```

### ticks

获取 scale 的刻度，ts 类型定义如下：

```ts
(count?: number) => TickData[];
```

### getCoordinateAxisPoints

获取 scale 对应的坐标轴的起始点和结束点，ts 类型定义如下：

```ts
(baseValue?: number) => [IPointLike, IPointLike];
```

### getCoordinate

获取 scale 对应的坐标系，ts 类型定义如下：

```ts
() => IPolarCoordinate | ICartesianCoordinate;
```

### getCoordinateAxisPosition

获取 scale 对应的坐标轴的位置，ts 类型定义如下：

```ts
() => 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'outside' | 'start' | 'end';
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
