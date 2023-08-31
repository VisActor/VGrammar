# Events and Interactions

After creating a visualization chart with VGrammar, users interacting with the visualization chart will trigger a series of events. VGrammar supports custom event listeners, various handle through callback functions, and implements various custom behaviors. Below we will introduce how to listen for events in **Spec mode** and **API mode** and implement custom interaction behaviors.

## Event listening in Spec mode

In Spec mode, we need to configure event listening through the `events` field. Example:

```js
const spec = {
  signals: [
    // ...
  ],
  events: [
    {
      type: 'rect:mousedown',
      callback: (context, params) => {
        console.log('The shape element was clicked');
      }
    }
  ]
};
```

### Event Types

When configuring `events`, the `type` is mainly used to set a string corresponding to the event selector, and supports 5 parsing rules:

- `mousedown`: The simplest event name, will listen for the corresponding event on the entire view.
- `rect:mousedown`: Listens to all marks of type rect, and any shape element corresponding to the mousedown event.
- `window:mousemove`: Listen for global mousemove events on the page.
- `#foo:mousedown`: Listen for id foo's mark, all graphic elements corresponding to the mousedown event.
- `@foo:mousedown`: Listen for name foo's mark, all graphic elements corresponding to the mousedown event.

The event names supported by graphic elements are basically consistent with DOM event names. Details can be found in the [spec documentation](/vgrammar/option).

### Event triggers signal update

After listening to the event, if we want to update a specific signal, we only need to configure the target attribute of the event.

Example:

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

If you need to trigger updates to multiple `signals`, refer to the following example:

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

### Listening to events to update element states

When we need to trigger element state updates through events, we can call the API of `element` in the `callback` when configuring events, add or remove states

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

### Other configurations

In addition to configuring the type, events also support the following configurations

- `filter`: Filter function, accepts the event object as a parameter. If the return value is true, execute the corresponding callback function or signal update logic; otherwise, do not execute.
- `throttle`: Sets the duration of throttling, in ms; if set to 0, no throttling; if the value is set to a reasonable positive number, the throttle method will be wrapped around the event callback function to achieve a throttling effect.
- `debounce`: Sets the debounce duration, in ms; if the value is set to 0, no debounce; if the value is set to a reasonable positive number, the debounce method will be wrapped around the event callback function to achieve a debounce effect.
- `consume`: Stop the execution and propagation of events; if the value is true, `stopPropagation()` will be called after executing the callback function or updating the behavior of the event, preventing event propagation.

## Event listening in API mode

In API mode, you can call the `addEventListener()` of `View` for custom listening events and implement the event callback function

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

At the same time, `View` also provides the `removeEventListener()` method to remove event bindings.
