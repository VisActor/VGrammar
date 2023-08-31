# Animation

In VGrammar, animation (animation effects) is a form of expression that can make the visualization scene more vivid and help users better understand the changes in data. VGrammar supports defining the animation effects of graphic elements by using a configuration method. VGrammar supports two types of animations:

- Graphic element animation
- Global deformation animation

## Graphic Element Animation

To configure a graphic element animation in VGrammar, we need to use a series of predefined configuration parameters. The animation of the graphic element is mainly set through two configurations:

- `animationState`: Which animation states the graphics element needs to enable
- `animation`: The specific animation configurations for various states

Below, we will introduce these configuration parameters one by one.

### animationState

Example:

```js
{
  marks: [{
    type: 'rect',
    animationState: 'enter';
  }]
}
```

This parameter can be used to set the states that need to be animated. Three data change states are supported by default: `enter`, `update`, `exit`. Users can also set `animationState` as the corresponding `signal` to control whether the animation is triggered or not.

### animation

`animation` is used to set the type, duration, easing function, and other specific configurations of the animation for this graphics element in different states;

Example:

```js
{
  marks: [
    {
      type: 'rect',
      animation: {
        enter: {
          type: 'fadeIn'
        },
        exit: {
          type: 'fadeOut'
        }
      }
    }
  ];
}
```

Each state supports multiple animation configurations:

- Built-in animations
- Visual channel animations
- Custom animations

#### Built-in Animations

For ease of use, VGrammar has built-in animations types. All animation types in the table below can be configured on any graphics element:

| Animation type (type) | Animation effect                                                 |
| --------------------- | ---------------------------------------------------------------- |
| fadeIn                | Fade-in effect                                                   |
| fadeOut               | Fade-out effect                                                  |
| scaleIn               | Scale-in effect                                                  |
| scaleOut              | Scale-out effect                                                 |
| moveIn                | Move-in effect                                                   |
| moveOut               | Move-out effect                                                  |
| rotateIn              | Rotate-in effect                                                 |
| rotateOut             | Rotate-out effect                                                |
| update                | Interpolate default changes for the visual channels with changes |

In addition, there are built-in animation types for specific graphic elements, which can be found in the [spec document](/vgrammar/option).

#### Visual Channel Animations

When you want to specify certain visual channels to perform corresponding animation effects when their values change, you can configure as follows:

Example:

```js
{
  marks: [
    {
      type: 'rect',
      animation: {
        update: {
          channel: ['fillOpacity', 'height']
        }
      }
    }
  ];
}
```

For the specified visual channel, if you want to specify the starting value or ending value of the animation, you can configure as follows:

Example:

```js
{
  marks: [
    {
      type: 'rect',
      animation: {
        update: {
          channel: {
            fillOpacity: { from: 0.5, to: 0.8 },
            height: { to: 10 }
          }
        }
      }
    }
  ];
}
```

#### Custom Animations

By passing a custom animation class through `custom`, we can execute a custom visual channel interpolation logic. It can be configured with `type` animation or `channel` animation for joint use or can be used independently, as the custom visual channel interpolation logic specified by `custom` has the highest priority.

Example:

```js
{
  marks: [
    {
      type: 'rect',
      animation: {
        enter: {
          custom: customAnimateFunction,
          customParameters: {
            customParam1: 'value',
            customParam2: 'value2'
          }
        }
      }
    }
  ];
}
```

We also provide a `customParameters` configuration for setting the parameters required for custom animations.
