# Data

图形语法元素 - 数据。

## 实例方法

### values

设置数据元素的值

```ts
(values: any[] | Nil, load?: boolean) => this;
```

### source

设置数据元素的来源

```ts
(source: string | string[] | IData | IData[], load?: boolean) => this;
```

### transform

设置数据元素的转换

```ts
(transform: TransformSpec[] | Nil) => this;
```

### field

获取数据元素中的字段

```ts
(field: string) => any[];
```

### getValue

获取数据元素的值

```ts
() => any[];
```

### getInput

获取数据元素的输入

```ts
() => any[];
```

### getDataIDKey

获取数据元素的唯一标识符

```ts
() => string;
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
