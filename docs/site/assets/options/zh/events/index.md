{{ target: events-index }}

# events(Array)

事件配置

## type(string)

事件选择器对应的字体串，支持 5 种解析规则：

- 1. `mousedown` 最简单的事件名称，会在整个 view 上监听对应的事件
- 2.  `rect:mousedown` 监听所有类型为`rect`的 mark，任意图形元素对应的`mousedown`事件
- 3.  `window:mousemove` 监听页面全局的的`mousemove`事件
- 4.  `#foo:mousedown` 监听`id`为`foo`的 mark，所有的图形元素对应的`mousedown`事件
- 5.  `@foo:mousedown` 监听`name`为`foo`的 mark 下，所有的图形元素对应的`mousedown`事件

图形元素支持的事件类型如下：

- 鼠标事件

  - `pointerdown`
  - `pointerup`
  - `pointerupoutside` 指针抬起与按下的图形不同时触发
  - `pointertap`
  - `pointerover`
  - `pointerenter`
  - `pointerleave`
  - `pointerout`
  - `mousedown`
  - `mouseup`
  - `dblclick` 双击
  - `mousemove`
  - `mouseover`
  - `mouseout`
  - `mouseenter` 不会冒泡
  - `mouseleave` 不会冒泡

- 右键相关事件

  - `rightdown`
  - `rightup`
  - `rightupoutside`
  - `click`

- 滚轮事件

  - `wheel`

- 触摸屏相关事件

  - `tap`
  - `touchstart`
  - `touchend`
  - `touchendoutside`
  - `touchmove`
  - `touchcancel`

  - `dragstart`
  - `drag`
  - `dragenter`
  - `dragleave`
  - `dragover`
  - `dragend`
  - `drop`

- 手势相关事件

  - `pan`
  - `panstart`
  - `panend`
  - `press`
  - `pressup`
  - `pressend`
  - `pinch`
  - `pinchstart`
  - `pinchend`
  - `swipe`

- dom 原生事件

  - `resize` 注意，图形元素不支持该事件，只支持`window:resize`事件绑定

  ## filter

  过滤函数，接受事件对象作为参数，如果返回值为`true`，则执行相应的回调函数或者`signal`更新逻辑；否则，不执行；

  ## throttle(number)

  设置节流的时长，单位为`ms`；如果设置为 0 则不节流；如果设置的值为合理的正数，则会给事件的回调函数包裹上 `throttle`方法，达到节流的效果；

  ## debounce(number)

  设置防抖的时长，单位为`ms`；如果设置的值为 0，则不防抖；如果设置的值为合理的正数，则会给事件的回调函数包裹上 `deboundce`方法，达到防抖的的效果；

  ## consume(boolean)

  阻止事件的执行和传播；如果值为`true`，会在执行为事件的回调函数或者更新行为后，调用`stopPropagation()`，阻止事件的传播；

  ## callback(EventCallback)

  事件的回调函数，格式如：

  ```
  (context: EventCallbackContext, params?: any) => any;
  ```

  ## dependency

  申明依赖的语法元素，如`signal`、`scale`等

  ## target

  设置事件更新的对象，支持两种类型：

  - `string` 类型： 需要更新的`signal`对应的 id
  - `array` 类型：事件需要触发多个`signal`的更新的时候，可以使用这种类型的配置，具体的类型格式为：

  ```ts
  Array<{
    target: string;
    callback: (context: EventCallbackContext, params?: any) => any;
  }>;
  ```
