# Mark

图形语法元素 - 图元。

## 实例属性

### markType

类型： `string`
图元的类型

### group

类型：`IGroupMark`

图元的父图元

## 实例方法

### join

设置关联数据，ts 类型定义如下：

```ts
(data: IData | string | Nil, key?: MarkKeySpec, sort?: MarkSortSpec, groupBy?: MarkKeySpec, groupSort?: MarkSortSpec) =>
  this;
```

参数`data`: 用于设置依赖的数据元素，支持设置数据元素对应的`id`，也可以设置数据元素对应的实例；当该参数为空是，相当于删除对旧的数据元素的依赖；
参数`key`: 设置图元数据元素的唯一标志符，用于计算图形元素的数据状态，详细定义可参考：[配置项/mark/spec](#mark)
参数`sort`: 对图元中的所有图形元素进行排序，设置对应的排序回调函数
参数`groupBy`:设置分组的属性
参数`groupSort`:对图元中的分组进行排序，设置对应的排序回调函数

### state

设置图元的状态，ts 类型定义如下：

```ts
(state: MarkFunctionType<string | string[]> | Nil) => this;
```

### encode

设置图元的编码，ts 类型定义如下：

```ts
((encoders: BaseEncodeSpec) => this) & ((channel: string, value: ChannelEncodeType) => this);
```

### encodeState

设置图元的编码状态，ts 类型定义如下：

```ts
((state: string, channel: string, value: ChannelEncodeType) => this) &
  ((state: string, encoders: BaseEncodeSpec) => this);
```

### animation

设置图元的动画配置，ts 类型定义如下：

```ts
(animationConfig: MarkAnimationSpec | Nil) => this;
```

### animationState

设置图元的动画状态，ts 类型定义如下：

```ts
(animationState: MarkFunctionType<string> | Nil) => this;
```

### layout

设置图元的布局配置，ts 类型定义如下：

```ts
(layout: MarkLayoutSpec | MarkLayoutCallback | Nil) => this;
```

### configure

设置图元的配置，ts 类型定义如下：

```ts
(config: IMarkConfig | Nil) => this;
```

### transform

设置图元的转换，ts 类型定义如下：

```ts
(transform: TransformSpec[] | Nil) => this;
```

### getBounds

获取图元的边界

```ts
() => IBounds;
```

### isCollectionMark

判断图元是否是集合图元

```ts
() => boolean;
```

### getAllElements

获取图元中的所有图形元素

```ts
() => IElement[];
```

### coordinate

设置该图元关联的坐标系对应的 id 或者坐标系对应的图形元素

### isProgressive

是否启动了增量渲染模式

### isDoingProgressive

是否正在执行增量渲染

### clearProgressive

清除增量渲染相关状态

### restartProgressive

从第一帧开始增量计算

### evaluateProgressive

分片执行

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
