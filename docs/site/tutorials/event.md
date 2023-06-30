# 事件与交互

通过 VGrammar 创建可视化图表后，用户在可视化图表上进行交互，会触发一系列的事件。VGrammar 支持自定义的事件监听，通过回调函数进行各种处理，实现各种自定义的行为。下面我们将分别介绍，在 **Spec 模式** 和 **API 模式** 下，如何监听事件，实现自定义的交互行为。

## Spec 模式下的事件监听

在 Spec 模式下，我们需要通过`events`字段配置事件监听。示例如下：

```js
const spec = {
  signals: [
    // ...
  ],
  events: [
    {
      type: 'rect:mousedown',
      callback: (context, params) => {
        console.log('图形元素被点击了');
      }
    }
  ]
};
```

### 事件类型

配置`events`的时候，`type`主要用于设置事件选择器对应的字符串，支持 5 种解析规则：

- `mousedown`： 最简单的事件名称，会在整个 view 上监听对应的事件。
- `rect:mousedown`： 监听所有类型为 rect 的 mark，任意图形元素对应的 mousedown 事件。
- `window:mousemove`：监听页面全局的的 mousemove 事件。
- `#foo:mousedown`： 监听 id 为 foo 的 mark，所有的图形元素对应的 mousedown 事件。
- `@foo:mousedown`： 监听 name 为 foo 的 mark 下，所有的图形元素对应的 mousedown 事件。

图形元素支持的事件名称和 DOM 事件名称基本保持一致，具体可以查询[spec 文档](todo)

### 事件触发 signal 更新

监听事件后，如果我们想要更新特定的信号量(signal)，我们只需要配置事件的 target 属性。

示例：

```js
const spec = {
  signals: [
    {
      id: 'activeRectDatum',
      value: null
    }
  ],
  events: [
    {
      type: 'rect:mousedown',
      target: 'activeRectDatum',
      callback: (evt, params) => {
        return evt.element.getDatum();
      }
    }
  ]
};
```

如果需要触发多个`signal` 的更新，可以参考下面的案例：

```js
const spec = {
  signals: [
    {
      id: 'activeRectDatum',
      value: null
    },
    {
      id: 'activeRect',
      value: null
    }
  ],
  events: [
    {
      type: 'rect:mousedown',
      target: [
        {
          target: 'activeRectDatum',
          callback: (evt, params) => {
            return evt.element.getDatum();
          }
        },
        {
          target: 'activeRect',
          callback: (evt, params) => {
            return evt.element;
          }
        }
      ]
    }
  ]
};
```

### 监听事件更新图元状态

当我们需要通过事件触发图元状态更新的时候，我们可以在配置事件的`callback`，调用`element`的 API，增加或者删除状态

```js
const spec = {
  events: [
    {
      type: 'rect:click',
      callback: (evt, params) => {
        return evt.element.addState('selected');
      }
    },
    {
      type: 'rect:dbclick',
      callback: (evt, params) => {
        return evt.element.removeState('selected');
      }
    }
  ],
  marks: [
    {
      type: 'rect',
      encode: {
        update: {},
        selected: {
          fill: 'red'
        }
      }
    }
  ]
};
```

### 其他配置

除了配置类型，事件还支持下列配置

- `filter`：过滤函数，接受事件对象作为参数。如果返回值为 true，则执行相应的回调函数或者信号更新逻辑；否则，不执行。
- `throttle`：设置节流的时长，单位为 ms；如果设置为 0，则不节流；如果设置的值为合理的正数，则会给事件的回调函数包裹上 throttle 方法，达到节流的效果。
- `debounce`：设置防抖的时长，单位为 ms；如果设置的值为 0，则不防抖；如果设置的值为合理的正数，则会给事件的回调函数包裹上 debounce 方法，达到防抖的效果。
- `consume`：阻止事件的执行和传播；如果值为 true，会在执行为事件的回调函数或者更新行为后，调用 stopPropagation()，阻止事件的传播。

## API 模式下的事件监听

API 模式下，可以调用`View` 的 `addEventListener()`自定义的监听事件，实现事件回调函数

```ts
view.addEventListener('pointerover', (evt: any) => {
  if (!evt.element) {
    return;
  }
  const element: IElement = evt.element;
  element.addState(state);
});

view.addEventListener('pointerout', (evt: any) => {
  if (!evt.element) {
    return;
  }
  const element: IElement = evt.element;
  element.removeState(state);
});
```

同时，`View` 也提供了`removeEventListener()` 方法，移除事件绑定
