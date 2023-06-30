# Signal

图形语法元素 - Signal

## 实例方法

### value

设置信号的值

```ts
(value: T | Nil) => this;
```

### update

设置信号的更新函数

```ts
(update: SignalFunctionType<T> | Nil) => this;
```

### getValue

获取信号的值

```ts
() => T;
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
