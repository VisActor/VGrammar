# 动画

在 VGrammar 中，动画（动画效果）是一种表现形式，可以使得视化场景更加生动，让用户更好地理解数据的变化。VGrammar 支持使用配置的方式来定义图形元素的动画效果。VGrammar 支持两种类型的动画：

- 图元动画
- 全局形变动画

## 图元动画

为了在 VGrammar 中配置一个图元动画，我们需要使用一系列预定义的配置参数。主要通过两个配置来设置图元的动画：

- `animationState`: 该图元需要开启哪些状态的动画
- `animation`: 各种状态对应的具体动画配置

下面我们逐一介绍这些配置参数的作用和使用方法。

### animationState

示：

```js
{
  marks: [{
    type: 'rect',
    animationState: 'enter';
  }]
}
```

此参数可用于设置需要进行动画的状态，默认支持三种数据变化状态：`enter`、`update`、`exit`。用户也可以将`animationState`设置为相应的`signal`，自己来控制什么是否触发动画

### animation

`animation`用于设置该图元在不同的状态下，动画的类型以及时长、缓动函数等具体的配置；

示例：

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

每种状态下，都支持多种动画配置：

- 内置动画
- 视觉通道动画
- 自定义动画

#### 内置动画

为了方便大家的使用，VGrammar 内置了一些动画类型，例如下表中的所有动画类型，可以配置在任意图元上：

| 动画的类型(type) | 动画效果                           |
| ---------------- | ---------------------------------- |
| fadeIn           | 渐入效果                           |
| fadeOut          | 渐出效果                           |
| scaleIn          | 缩放入场                           |
| scaleOut         | 缩放出场                           |
| moveIn           | 移动入场                           |
| moveOut          | 移动出场                           |
| rotateIn         | 旋转进入                           |
| rotateOut        | 旋转退出                           |
| update           | 对有变化的视觉通道，执行默认的插值 |

还有特定图元支持的内置动画类型，大家可以在[spec 文档](/vgrammar/option/marks-symbol#animation.type)中查询

#### 视觉通道动画

当希望指定某些视觉通道，当这些视觉通道的值发生变化的时候，执行相应的动画效果，我们可以如下配置：

示例：

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

对于指定的视觉通道，如果希望指定动画的开始值或者结束值，我们可以如下配置：

示例：

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

#### 自定义动画

通过`custom`传入自定义的动画类，我们可以执行自定义的视觉通道插值逻辑；可以配置`type`动画或者`channel`动画一起使用，也可以独立使用，因为`custom`指定的自定义视觉通道插值逻辑的优先级是最高的

示例：

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

同时我们还提供了配置`customParameters`，用于设置自定义动画需要接收的参数。

### 循环动画

在特定场景下，如果我们希望循环执行某些动画，我们可以通过`animation`下的`loop`设置循环动画的次数

```js
{
  marks: [
    {
      type: 'rect',
      animation: {
        type: 'fadeIn',
        loop: 2
      }
    }
  ];
}
```

当`loop`设置为`true`的时候，表示无限循环动画

### 其他动画配置

`animation`除了支持动画类型的配置，还有一些通用的动画配置：

- `easing` 缓动函数配置
- `delay` 动画延迟配置
- `duration` 动画时长配置
- `oneByOne` 按元素依次执行的延迟时长，如果配置为 `true` 则会在上一个元素动画执行结束后执行下一个元素的动画，默认为 `false`

## 图元间的动画编排

对于一些非常复杂的动画需求，如果想要控制图元之间的动画顺序和执行关系，VGrammar 提供了动画编排相关的功能：

示例：

```js
const title = vGrammarView.getMarkById('title');
const leftAxis = vGrammarView.getMarkById('leftAxis');
const bottomAxis = vGrammarView.getMarkById('bottomAxis');
const bar = vGrammarView.getMarkById('bar');
const viewBox = vGrammarView.getSignalById('viewBox');

const animation0 = title.animate.run({
  channel: {
    text: {
      from: '',
      to: '全年产品销售额统计'
    }
  },
  custom: VRender.InputText,
  duration: 2000,
  easing: 'linear'
});
const animation1 = leftAxis.animate
  .run({
    custom: VRender.GroupFadeIn,
    duration: 2000
  })
  .after(animation0);
const animation2 = bottomAxis.animate
  .run({
    custom: VRender.GroupFadeIn,
    duration: 2000
  })
  .parallel(animation1);
const animation3 = bar.animate
  .run({
    type: 'growHeightIn',
    duration: 2000,
    options: { overall: viewBox.getValue().y2, orient: 'negative' }
  })
  .after(animation2);
```

## 全局形变动画

当我们通过 VGrammar 创建了可视化实例，VGrammar 支持在更新可视化实例的时候，执行全局形变动画；

示例：

```js
const vGrammarView = new VGrammarView({
  width: roseSpec.width,
  height: roseSpec.height,
  container: CHART_CONTAINER_DOM_ID,
  hover: true
});
vGrammarView.parseSpec(roseSpec);

vGrammarView.run();

setTimeout(() => {
  vGrammarView.updateSpec(radarSpec);
  vGrammarView.run({ morph: true });
}, 500);

setTimeout(() => {
  vGrammarView.updateSpec(funnelSpec);
  vGrammarView.run({ morph: true });
}, 2000);
```

VGrammar 会解析图元上的三个配置：

- morph
- morphKey
- morphElementKey

开启了`morph: true`的图元，会执行全局形变动画；`morphKey`用于匹配图元，具有相对的`morphKey`的图元，会进行形变动画；
对于匹配上的前后图元，通过配置`morphElementKey`，进行图形元素的匹配；如果图元上没有设置该配置，默认读取`key`配置，用于匹配图形元素，进行形变动画；

## 如何监听动画相关事件

VGrammar 的图元支持自定义事件的监听，动画相关的事件也可以在在图元上监听：

示例：

```js
const title = vGrammarView.getMarkById('title');

title.on('animationStart', evt => {
  const { mark, animationState, animationConfig } = evt;

  // you customized handle
});
```

动画相关事件的回调函数，会返回一下类型的参数：

```ts
type AnimationEvent = {
  mark: IMark;
  animationState: string;
  animationConfig: IAnimationConfig;
};
```

图元支持的动画事件，现在有：

- 'animationStart'
- 'animationEnd'
- 'elementAnimationStart'
- 'elementAnimationEnd'
