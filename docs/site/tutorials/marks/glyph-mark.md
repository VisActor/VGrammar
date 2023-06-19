# 组合图元

VGrammar 中的组合图元（Glyph）是通过任意基础图元组合得到的图元，用于描述某一复杂的图形效果。

所有组合图元的图元类型均为 `'glyph'`，开发者需要配置 `glyphType` 以声明其为何种类型的组合图元：

```js
{
  type: 'glyph',
  glyphType: 'boxplot',
  encode: {}
}
```

与基础图元相比，组合图元具有特殊的视觉通道以及相应的动画逻辑。除去 VGrammar 内置提供的部分组合图元，开发者还可以注册自定义的组合图元以创建更为丰富的可视化效果

## 箱形图元 (Boxplot)

箱形图，又称箱线图，是一种用于展示一组数据分布情况的统计图。它能显示出一组数据的最大值、最小值、中位数、上四分位数（Q1）、下四分位数（Q3），使我们可以从图表中快速了解数据的分布况。使用场景包括对比各个类别的数据分布，识别异常值等。

VGrammar 提供了两种箱形图元以支持箱形图可视化：

- boxplot: 普通箱形图元，glyphType 为 `'boxplot'`。在使用普通箱形图元之前，需要执行 `registerBoxplotGlyph()` 对图元进行注册。示例：
  ![普通箱形图元](https://s1.ax1x.com/2023/06/19/pC33RJg.png)

- barBoxplot: 变种箱形图元，glyphType 为 `'barBoxplot'`。在使用变种箱形图元之前，需要执行 `registerBarBoxplotGlyph()` 对图元进行注册。示例：
  ![变种箱形图元](https://s1.ax1x.com/2023/06/19/pC33fzj.png)

## 涟漪点图元 (RipplePoint)

涟漪点图元是一种具有涟漪效果的点图元，通常用于强调某个特定的数据点或者表示某个位置上的数据变化。在地图可视化、时间序列分析等场景中，涟漪点图元可以表达数据的空间分布、数据变化的动态过程等。使用场景包括表示地震、疫情、新闻事件等的传播过程。

涟漪点图元 glyphType 为 `'ripplePoint'`。
在使用涟漪点图元之前，需要执行 `registerRippleGlyph()` 对图元进行注册。示例：
![涟漪点图元](TODO)

## 波浪图元 (Wave)

波浪图元是一种模拟波动的图元，用于表现数据随时间的波动情况。在股票交易、天气预报等领域，波浪图元可以展示数据的波动趋势、周期性变化等。使用场景包括展示股票价格、气温/降水量的波动。

波浪图元 glyphType 为 `'wave'`。
在使用波浪图元之前，需要执行 `registerWaveGlyph()` 对图元进行注册。示例：
![波浪图元](TODO)

## 连线图元 (LinkPath)

连线图元是一种用于表示数据间的联系的图元，常用于表示网络关系、空间联系等。社交网络、物流运输、知图谱等领域的可视化中，连线元可以表示数据间的连接关系、传播过程等。使用场景包括展示用户之间的关注关系、货物的传递等。

连线图元 glyphType 为 `'wave'`。
在使用连线图元之前，需要执行 `registerLinkPathGlyph()` 对图元进行注册。示例：
![连线图元](https://s1.ax1x.com/2023/06/19/pC33LYF.png)

## 自定义组合图元

在 VGrammar 中，开发者不仅可以使用以上几种内置的组合图元，还可以通过组合现有的基本图元，自定义创建更丰富的可视化效果。

图元之间的组合核心在于视觉通道的组合。开发者可以通过 `registerGlyph` 接口注册 glyph 类型并声明默认的视觉通道以及特定的视觉通道。默认情况下所有 glyph 图元的视觉通道都会应用于所有子图元中，开发者可以自由变更视觉通道在子图元中的应用逻辑，例如声明一个额外的 `color` 视觉通道并将其应用于子 rect 图元的 `fill` 通道以及子 rule 图元的 `stroke` 通道。

声明一个简单的 K 线图组合图元示例：

```js
registerGlyph('candle', {
  minMax: 'rule',
  startEnd: 'rect'
})
  .registerChannelEncoder('x', (channel, encodeValue) => {
    return {
      minMax: { x: encodeValue, x1: encodeValue },
      startEnd: { x: encodeValue }
    };
  })
  .registerChannelEncoder('min', (channel, encodeValue) => {
    return {
      minMax: { y: encodeValue }
    };
  })
  .registerChannelEncoder('max', (channel, encodeValue) => {
    return {
      minMax: { y1: encodeValue }
    };
  })
  .registerChannelEncoder('start', (channel, encodeValue) => {
    return {
      startEnd: { y: encodeValue }
    };
  })
  .registerChannelEncoder('end', (channel, encodeValue) => {
    return {
      startEnd: { y1: encodeValue }
    };
  })
  .registerChannelEncoder('boxWidth', (channel, encodeValue) => {
    return {
      startEnd: { width: encodeValue, dx: -encodeValue / 2 }
    };
  });
```

除此之外，开发者还可以通过 `registerAnimationType` 接口注册额外的动画类型以搭配 glyph 图元使用。

K 线图示例：
![K 线图](TODO)
