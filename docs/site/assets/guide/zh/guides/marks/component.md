# 组件图元

VGrammar 中的组件图元（Component）是包含特定交互、动画、数据逻辑的组件，用于提供某一类特定的可视化功能。

所有组件图元的图元类型均为 `'component'`，开发者需要配置 `componetType` 以声明其为何种类型的组合图元：

```js
{
  type: 'component',
  componentType: 'axis',
  encode: {}
}
```

## 轴 (Axis)

轴是一种基本的图形组件，用于表示图表的基准值和数据的映射关系。轴通常包括一个刻度线一个标签，分别表示值域和数据的具体值。此外，轴可以额外设置网格线部分等，以强化数据的可读性。

在笛卡尔坐标系中，包括两种轴：横轴（X 轴）和纵轴（Y 轴）。不同类型的轴也可能用于不同类型的图表，如径向图表需极轴和角轴。

轴组件的 componentType 为 `'axis'` ，同时 View 上也提供了 `View.component()` 接口以便捷的创建一个轴。

一个简单的直角坐标系轴示例为：

<div class="examples-ref-container" id="examples-ref-axis-rect" data-path="basic-mark-rect/basic-rect"></div>

一个简单的极坐标系轴示例为：

<div class="examples-ref-container" id="examples-ref-axis-polar" data-path="mark-interval/polar-interval"></div>

## 图例 (Legend)

图例组件主要用于呈现图表中不同数据系列的标识，帮助用户理解图表内容。对于不同类型的图表，如折线图、柱状图等，图例可以表示多种信息（如颜色、形状等）。

依据图例所对应的 Scale 形式的差异，目前 VGrammar 提供的图例包含三种：

- 离散图例：用于描述离散型 Scale；
- 颜色图例：用于描述连续的颜色型 Scale；
- 尺寸图例：用于描述连续的数值型 Scale。

图例组件的 componentType 为 `'legend'` ，同时 View 上也提供了 `View.legend()` 接口以便捷的创建一个图例。

不同类型图例的示例：

<div class="examples-ref-container" id="examples-ref-legend" data-path="component/legend"></div>

## 筛选器 (Slider)

筛选器是一种实现数据过滤和缩放的交互组件。用户通过拖动筛选器条，实现对数据范围的调整。用户可以通过拖动滑块间距和位置来控制数据范围。通过操作筛选器，用户可根据需要查看指定范围的数据。

筛选器组件的 componentType 为 `'slider'` ，同时 View 上也提供了 `View.slider()` 接口以便捷的创建一个筛选器。

筛选器的示例：

<div class="examples-ref-container" id="examples-ref-slider" data-path="component/slider"></div>

## 缩略轴 (Datazoom)

缩略轴用于在较长的数据序列中进行局部查看。它可以方便地放大和缩小数据可视化范围，并提供一个较为直观的交互体验。通过设置缩略轴，用户可以更轻松地查看或筛选感兴趣的信息，提高数据分析效率。

缩略轴组件的 componentType 为 `'datazoom'` ，同时 View 上也提供了 `View.datazoom()` 接口以便捷的创建一个缩略轴。

缩略轴的示例：

<div class="examples-ref-container" id="examples-ref-dataZoom" data-path="component/dataZoom"></div>

## 标签 (Label)

标签通常用于向可视化图形元素添加文字说明，帮助用户快速了解数据点的具体信息。

标签组件的 componentType 为 `'label'` ，同时 View 上也提供了 `View.label()` 接口以便捷的创建标签。

标签的示例：

<div class="examples-ref-container" id="examples-ref-label" data-path="component/label"></div>

## 播放器 (Player)

在可视化场景中，有时需要展示数据随时间变化的过程。通过使用放器功能，用户可以通过时间线轴观察数据的动态变化。

播放器组件的 componentType 为 `'player'` ，同时 View 上也提供了 `View.player()` 接口以便捷的创建一个播放器。

播放器的示例：

<div class="examples-ref-container" id="examples-ref-player" data-path="component/player"></div>
