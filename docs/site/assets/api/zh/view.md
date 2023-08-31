### runBefore

设置每次 view 运行更新之前的回调函数，ts 类型定义如下:

```ts
(callback: (view: IView) => void) => this;
```

### runAfter

设置每次 view 运行完成之后的回调函数，ts 类型定义如下:

```ts
(callback: (view: IView) => void) => this;
```

### background

设置或者读取背景颜色，ts 类型定义如下:

```ts
(value?: IColor) => IColor;
```

### width

设置或者读取 整个 canvas 的宽度，ts 类型定义如下:

```ts
(value?: number) => number;
```

### height

设置或者读取 整个 canvas 的高度，ts 类型定义如下:

```ts
(value?: number) => number;
```

### viewWidth

设置或者读取 view 去掉`padding`后的 画布宽度，ts 类型定义如下:

```ts
(value?: number) => number;
```

### viewHeight

设置或者读取 view 去掉`padding`后的 画布高度，ts 类型定义如下:

```ts
(value?: number) => number;
```

### padding

设置或者读取 `padding`，ts 类型定义如下:

```ts
(p?: number | { left?: number; right?: number; top?: number; bottom?: number }) => {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
```

### addEventListener

添加事件监听，ts 类型定义如下:

```ts
(type: string, handler: BaseEventHandler, options?: any) => this;
```

### removeEventListener

移除事件监听，ts 类型定义如下:

```ts
(type: string, handler: BaseEventHandler) => this;
```

### emit

触发自定义事件，ts 类型定义如下:

```ts
(event: string | symbol, ...args: EventEmitter.EventArgs<string | symbol, T>) => boolean;
```

第一个参数为自定义的事件名称；
其他参数为，事件对应的自定义参数

### resize

调整 canvas 的宽度高度，ts 类型定义如下:

```ts
(width: number, height: number, render?: boolean) => Promise<this>;
```

当`width`或者`height`发生改变的时候，`render`不为`false` 的话，会触发底层图形的重绘

### tranverseMarkTree

遍历整个 mark 实例树，执行相应逻辑，ts 类型定义如下:

```ts
(apply: (mark: IMark) => any, filter?: (mark: IMark) => boolean, leafFirst?: boolean) => this;
```

第一个参数用于设置针对每个`mark`实例执行的回调函数；
第二个参数用于设置针对每个`mark`实例执行的过滤函数；
第三个参数用于设置是否叶子节点优先执行

### pauseProgressive

暂停渐进渲染流程，如果有的话

### resumeProgressive

重启渐进渲染流程，如果有的话

### restartProgressive

重启渐进渲染流程，如果有的话

### release

释放销毁 view
