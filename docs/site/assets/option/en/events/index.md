{{ target: events-index }}

# events(Array)

Event configuration

## type(string)

The font string corresponding to the event selector, supporting 5 parsing rules:

- 1. `mousedown` The simplest event name, which will listen for the corresponding event on the entire view
- 2.  `rect:mousedown` Listens to the `mousedown` event corresponding to any graphic element of all marks of type `rect`
- 3.  `window:mousemove` Listens to the global `mousemove` event of the page
- 4.  `#foo:mousedown` Listens to the `mousedown` event corresponding to all graphic elements of the mark with `id` of `foo`
- 5.  `@foo:mousedown` Listens to the `mousedown` event corresponding to all graphic elements under the mark with `name` of `foo`

The event types supported by graphic elements are as follows:

- Mouse events

  - `pointerdown`
  - `pointerup`
  - `pointerupoutside` Triggered when the pointer is lifted and the shape is different from the pressed one
  - `pointertap`
  - `pointerover`
  - `pointerenter`
  - `pointerleave`
  - `pointerout`
  - `mousedown`
  - `mouseup`
  - `dblclick` Double-click
  - `mousemove`
  - `mouseover`
  - `mouseout`
  - `mouseenter` No propagation
  - `mouseleave` No propagation

- Right-click related events

  - `rightdown`
  - `rightup`
  - `rightupoutside`
  - `click`

- Wheel events

  - `wheel`

- Touch screen related events

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

- Gesture related events

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

- Native DOM events

  - `resize` Note that graphic elements do not support this event, only `window:resize` event binding is supported

## filter

The filter function accepts the event object as a parameter. If the return value is `true`, the corresponding callback function or `signal` update logic is executed; otherwise, it is not executed;

## throttle(number)

Sets the throttling duration in `ms`; if set to 0, no throttling; if set to a reasonable positive number, the event callback function will be wrapped with the `throttle` method, achieving the effect of throttling;

## debounce(number)

Sets the debounce duration in `ms`; if set to 0, no debounce; if set to a reasonable positive number, the event callback function will be wrapped with the `deboundce` method, achieving the effect of debounce;

## consume(boolean)

Prevents the execution and propagation of events; if set to `true`, `stopPropagation()` will be called after executing the callback function or update behavior of the event, preventing event propagation;

## callback(EventCallback)

Event callback function with the format:

```
(context: EventCallbackContext, params?: any) => any;
```

## dependency

Declare dependent syntax elements, such as `signal`- and `scale`-related

## target

Sets the object to be updated by the event, supporting two types:

  - `string` type: The corresponding id of the `signal` to be updated
  - `array` type: When the event needs to trigger updates for multiple signals, this type of configuration can be used. The specific format is:

  ```ts
  Array<{
    target: string;
    callback: (context: EventCallbackContext, params?: any) => any;
  }>;
  ```