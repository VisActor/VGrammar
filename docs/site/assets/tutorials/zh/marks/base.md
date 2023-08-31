# 图元

图元是 VGrammar 中的核心语法元素。VGrammar 可视化场景的声明逻辑本质就在于描述图元所对应的数据映射（data join）、视觉通道编码（visual encoding）以及动画过渡（animation）逻辑。

VGrammar 中的图元可以理解为具有特定形状或是特定能力的图形元素，例如基础线、点、面，以及复杂的轴、图例组件等。通过组合这些基本元素，可以构建出各种复杂的可视化效果。

VGrammar 中的图元包含多种类别：

- 基础图元 Basic Mark：描述了某种特定的形状的基础绘图图元，例如矩形图元 Rect；
- 语义图元 Semantic Mark：具有特定语义的图元，例如描述数据区间的图元 Interval；
- 组合图元 Glyph Mark：任意基础图元组合得到的图元，用于描述某一复杂的图形效果，例如涟漪点图元 RipplePoint；
- 组件图元 Component Mark：包含特定交互、动画、数据逻辑的组件，例如轴 Axis。

![图元组成](待补充)

## transform

图元也支持 transform 变换，和数据语法元素 Data 不同的点在于，图元的变换现在支持在两个阶段执行

1. 在执行`join`之前，对 **join 数据** 进行数据变换
2. 在执行完图形通道映射之后，创建图形元素之前，对 **图形 elements** 进行数据变换；

所以 VGrammar 在注册 transform 的时候，会申明该`transform`如果在 图元中执行的阶段；因此，所有语法元素 Data 支持的 transform， 在 mark 上也是同样支持的；

示例：

```js
{
  marks: [
    {
      type: 'rect',
      transform: [
        {
          type: 'filter',
          callback: datum => {
            return datum.value > 0;
          }
        }
      ]
    }
  ];
}
```

## 自定义图形

除了 VGrammar 内置的图元渲染效果，开发者还可以通过 `marks.setCustomizedShape` 接口对图元的渲染逻辑逻辑进行声明，从而实现自定义图元效果。

自定义图形示例：

<div class="examples-ref-container" id="examples-ref-customized-shape" data-path="basic-mark-rect/customized-shape">
</div>

关键配置如下：

```js
{
  type: 'rect',
  setCustomizedShape: (data, attrs, path) => {
    path.moveTo(attrs.width / 2, 0);
    path.quadraticCurveTo(0.55 * attrs.width, 0.67 * attrs.height, attrs.width, attrs.height);
    path.lineTo(0, attrs.height);
    path.quadraticCurveTo(0.45 * attrs.width, 0.67 * attrs.height, attrs.width / 2, 0);
    path.closePath();
    return path;
  }
}
```

## 性能

### 渐进渲染

渲染大数据可视化对性能要求较高，为了解决大数据量绘制时可能遇到的性能问题，VGrammar 提供了渐进渲染功能。通过设置 `marks.progressiveStep` 和 `marks.progressiveThreshold` 配置项，可以分片渲染大数据量的图形，从而优化性能表现。

渐进式渲染示例：

```js
{
  type: 'rect',
  progressiveStep: 3000,
  progressiveThreshold: 50000,
}
```

<div class="examples-ref-container" id="examples-ref-progressive-rect" data-path="performance/progressive-rect">
</div>

### 大数据量图形简化

在开启渐进式渲染之后，具体图形元素的渲染效果将会被简化以提升渲染速率。

在常见的情况下，大数据量下的图形元素之间仅仅具有位置相关视觉通道的差异。在渐进式渲染的过程中，VGrammar 会抽离出定位相关的不可复用视觉通道，并由此简化每个图元的视觉编码过程以提升渲染性能。
