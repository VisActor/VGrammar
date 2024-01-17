{{ target: marks-common-channels }}

{{ if: ${type} === 'rect' || ${type} === 'group' || ${type} === 'glyph' || ${type} === 'rect3d' }}

#${prefix} width(number)
图元的宽度

#${prefix} height(number)
图元的高度

#${prefix} borderRadius

设置圆角，默认为 0，支持两种格式的设置：

- `number`: 给四个角度设置统一的圆角
- `number[]`: 分别给四个角度设置不同的圆角
  - 当数组的长度为`1`，给四个角设置相同的圆角
  - 当数组的长度为`2`或者`3`，给**左上角**和**右下角**设置圆角长度为`borderRadius[0]`,给**右上角**和**左下角**设置圆角长度为`borderRadius[1]`
  - 当数组的长度为`4`及以上，四个角度设置不同的圆角

{{ elif: ${type} === 'arc' || ${type} === 'arc3d' }}

#${prefix} innerRadius(number)
内半径

#${prefix} outerRadius(number)
外半径

#${prefix} startAngle(number)
圆弧的起始角度；
以弧度的形式指定，0 表示 12 点钟方向并且顺时针方向为正。
如果 `|endAngle - startAngle| ≥ τ` 则会绘制一个完整的扇形或圆环

#${prefix} endAngle(number)
圆弧的终止角度；
以弧度的形式指定，0 表示 12 点钟方向并且顺时针方向为正。
如果 `|endAngle - startAngle| ≥ τ` 则会绘制一个完整的扇形或圆环

#${prefix} padAngle(number)

间隙角度；间隔角度会转换为一个在两个相邻的弧之间的确定的线性距离，定义为 `padRadius * | padAngle |`

这个距离在弧的开始和结束处都是相等的；
间隔角度通常只应用于环形扇区（即当内半径大于 0）

#${prefix} padRadius(number)

配合`padAngle`一起使用

#${prefix} cap

对应了线段的 lineCap 属性，lineCap 表示的是线段末端如何绘制，支持两种类型的设置

- `boolean`: `cap: true` 表示在弧线的起始位置都增加一个角度，角度是 `| outerRadius - innerRadius | / outerRadius`

- `[boolean, boolean]`: 针对首尾设置不同的末端绘制策略

#${prefix} forceShowCap(boolean)
当 cap = true 并且 使用了渐变填充的时候，自动实现 conical 渐变，也就是环形的渐变

{{ elif: ${type} === 'line' || ${type} === 'area' }}

#${prefix} curveType(string)

线的类型，支持如下选项：

- 'basis'
- 'basisClosed'
- 'basisOpen'
- 'bundle'
- 'cardinal'
- 'cardinalClosed'
- 'cardinalOpen'
- 'stepBefore'
- 'stepAfter'
- 'catmullRom'
- 'catmullRomClosed'
- 'catmullRomOpen'
- 'linear'
- 'linearClosed'
- 'monotoneX'
- 'monotoneY'
- 'natural'
- 'radial'
- 'step'

{{ elif: ${type} === 'circle' }}

#${prefix} radius(number)
圆的半径

#${prefix} startAngle(number)
圆的起始角度；
以弧度的形式指定，0 表示 12 点钟方向并且顺时针方向为正。
如果 `|endAngle - startAngle| ≥ τ` 则会绘制一个完整的圆，默认是整圆

#${prefix} endAngle(number)

圆的终止角度；
以弧度的形式指定，0 表示 12 点钟方向并且顺时针方向为正。
如果 `|endAngle - startAngle| ≥ τ` 则会绘制一个完整的圆，默认是整圆

{{ elif: ${type} === 'image' }}

#${prefix} width(number)
图元的宽度

#${prefix} height(number)
图元的高度

#${prefix} repeatX(string)
x 方向重复的类型，可选值为：

- `'no-repeat'` 不重复
- `'repeat'` 重复
- `'stretch'` 拉伸

#${prefix} repeatY(string)
y 方向重复的类型，可选值为：

- `'no-repeat'` 不重复
- `'repeat'` 重复
- `'stretch'` 拉伸

#${prefix} image

{{ use: common-image() }}

{{ elif: ${type} === 'path' }}

#${prefix} path

设置路径，支持两种格式：

- `'string'` 路径字符串
- `'ICustomPath2D'` VRrender 提供的设置自定义路径的一个工具类，返回对应的实例

{{ elif: ${type} === 'polygon' || ${type} === 'pyramid3d' }}

#${prefix} points

多边形对应的点

#${prefix} borderRadius

设置圆角，默认为 0，支持两种格式的设置：

- `number`: 给所有的角设置统一的圆角
- `number[]`: 分别给每个角设置不同的圆角

{{ elif: ${type} === 'richtext' }}

#${prefix} width(number)
图元的宽度

#${prefix} height(number)
图元的高度

#${prefix} textConfig(array)

设置子文本的样式，类型为`IRichTextCharacter[]`，具体的定义如下：

```ts
type IRichTextBasicCharacter = {
  lineHeight?: number;
  textAlign?: CanvasTextAlign; // left, right, center
  textBaseline?: CanvasTextBaseline;
  direction?: RichTextLayoutDirectionType;
};

type IRichTextParagraphCharacter = IRichTextBasicCharacter & {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: boolean;
  stroke?: boolean;
  fillColor?: IColor;
  strokeColor?: IColor;
  fontWeight?: string;
  // lineHeight?: number;
  fontStyle?: RichTextFontStyle; // normal, italic, oblique
  textDecoration?: RichTextTextDecoration; // none, underline, line-through
  // textAlign?: RichTextTextAlign; // left, right, center
  script?: RichTextScript; // normal, sub, super
  underline?: boolean;
  lineThrough?: boolean;
  // direction?: RichTextLayoutDirectionType;
};

type IRichTextImageCharacter = IRichTextBasicCharacter & {
  // 图片基础属性
  image: string | HTMLImageElement | HTMLCanvasElement;
  width: number;
  height: number;

  // hover相关属性
  // backgroundShow?: boolean; // 是否显示background
  backgroundShowMode?: 'always' | 'hover';
  backgroundFill?: boolean;
  backgroundFillColor?: IColor; // 背景矩形填充颜色
  backgroundFillOpacity?: number; // 背景矩形填充透明度
  backgroundStroke?: boolean;
  backgroundStrokeColor?: IColor; // 背景矩形边框颜色
  backgroundStrokeOpacity?: number; // 背景矩形边框透明度
  backgroundRadius?: number; // 背景矩形圆角
  // background size 同时控制了该icon的响应范围
  backgroundWidth?: number;
  backgroundHeight?: number;

  // 唯一标识符
  id?: string;

  // lineHeight?: number;
  // textAlign?: RichTextTextAlign; // left, right, center
  // direction?: RichTextLayoutDirectionType;
  margin?: number | number[];

  funcType?: string;
  hoverImage?: string | HTMLImageElement | HTMLCanvasElement;
};

type IRichTextCharacter = IRichTextParagraphCharacter | IRichTextImageCharacter;
```

#${prefix} ellipsis
文本超长的时候，缩略符相关配置，支持两种类型的配置：

- `'string'` 开启自动省略，并设置省略符号
- `'boolean'` 是否开启自动省略，默认的省略符号为`'...'`

#${prefix} wordBreak(string)

文字断开设置，支持两个配置值：

- `'break-word'`
- `'break-all'`

#${prefix} verticalDirection(string)

数值方向对齐方式，支持配置：

- `'top'`
- `'middle'`
- `'bottom'`

#${prefix} layoutDirection(string)

布局方向，支持配置：

- `'horizontal'`
- `'vertical'`

#${prefix} singleLine(boolean)

是否单行展示

#${prefix} maxHeight(number)

最大高度

#${prefix} maxWidth(number)

最大宽度

#${prefix} textAlign(string)

文字的对齐方式，支持配置：

- 'left'
- 'right'
- 'center'

#${prefix} textBaseline(string)

文字的竖直对齐线，支持配置：

- 'top'
- 'middle'
- 'bottom'

{{ elif: ${type} === 'symbol'}}

#${prefix} symbolType(string)

设置类型，支持传入内置的类型，也可以设置为自定义的路径，内置的类型有：

- 'circle'
- 'cross'
- 'diamond'
- 'square'
- 'arrow'
- 'arrow2Left'
- 'arrow2Right'
- 'wedge'
- 'thinTriangle'
- 'triangle'
- 'triangleUp'
- 'triangleDown'
- 'triangleRight'
- 'triangleLeft'
- 'stroke'
- 'star'
- 'wye'
- 'rect'

#${prefix} size

设置`symbol`的外接圆的直径，支持两种格式的设置

- `number` 外接圆直径
- `[number, number]` 当`symbolType: 'rect'` 时，设置宽高

{{ elif: ${type} === 'text'}}

#${prefix} text

文本，支持传入数组

#${prefix} maxLineWidth(number)

最大宽度，当设置该值，并开启了自动省略策略，会自动添加省略符

#${prefix} ellipsis
文本超长的时候，缩略符相关配置，支持两种类型的配置：

- `'string'` 开启自动省略，并设置省略符号
- `'boolean'` 是否开启自动省略，默认的省略符号为`'...'`

#${prefix} textAlign(string)

文字的对齐方式，支持配置：

- 'left'
- 'right'
- 'center'

#${prefix} textBaseline(string)

文字的竖直对齐线，支持配置：

- 'top'
- 'middle'
- 'bottom'

#${prefix} fontSize(number)

字号，同[CSS font-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-size)

#${prefix} fontFamily(string)

字体，同[CSS font-family](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-family)

#${prefix} fontVariant(string)

同[CSS font-variant](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variant)

#${prefix} fontStyle(string)

字体样式，同[CSS font-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style)

#${prefix} fontWeight(string|number)

字重，同[CSS font-weight](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-weight)

#${prefix} lineHeight(number)

行高

#${prefix} underline(boolean)

是否展示下划线

#${prefix} lineThrough(boolean)

是否展示中划线

{{ /if }}

<!-- arc3d -->

{{ if: ${type} === 'arc3d' }}

#${prefix} height(number)
圆弧的高度

{{ /if }}

<!-- pyramid3d -->

{{ if: ${type} === 'pyramid3d' }}

#${prefix} depthRatio(number)
深度比例

#${prefix} face

设置上下左右前后 6 个面，ts 类型定义为：

```ts
[boolean, boolean, boolean, boolean, boolean, boolean];
```

{{ /if }}

<!-- rect3d -->

{{ if: ${type} === 'rect3d' }}

#${prefix} length(number)
长度

{{ /if }}

<!-- component -->

{{ if: ${type} === 'axis' }}

#${prefix} start
设置坐标轴左上角的点坐标，格式为: `{ x: number; y: number }`

#${prefix} end
设置坐标轴右下角的点坐标，格式为: `{ x: number; y: number }`

#${prefix} title
设置轴的标题配置

#${prefix} label
设置轴的标签配置

#${prefix} line
设置轴的连线配置

#${prefix} tick
设置轴的 tick 网格配置

#${prefix} subTick
设置轴的次级 tick 配置

#${prefix} grid
设置轴的网格配置

#${prefix} subGrid
设置轴的次级网格配置

{{ /if }}

{{ if: ${type} === 'crosshair' }}

#${prefix} start

在直角坐标系下使用时，设置坐标轴左上角的点坐标，格式为: `{ x: number; y: number }`

#${prefix} end
在直角坐标系下使用时，设置坐标轴右下角的点坐标，格式为: `{ x: number; y: number }`

#${prefix} center(number)
极坐标系下使用时，设置坐标系原点坐标

#${prefix} radius(number)
极坐标系下使用时，设置坐标系半径

#${prefix} startAngle(number)
极坐标系下使用时，设置坐标系起始角度，默认为 `0`

#${prefix} endAngle(number)
极坐标系下使用时，设置坐标系终止角度，默认为 `2 * PI`

#${prefix} lineStyle
设置`crosshairShape = 'line'`类型的`crosshair`的线条样式

#${prefix} rectStyle
设置`crosshairShape = 'rect'`类型的`crosshair`的矩形的样式

#${prefix} sectorStyle
设置`crosshairShape = 'rect' & crosshairType = 'angle'` 类型的`crosshair`的图形的样式

#${prefix} innerRadius(number)
设置`crosshairShape = 'rect' & crosshairType = 'angle'` 类型的`crosshair`的图形的内半径

#${prefix} sides(number)
设置`crosshairShape = 'line' & crosshairType = 'radius'` 类型的`crosshair`的图形的多边形边数

{{ /if }}

{{ if: ${type} === 'datazoom' }}

#${prefix} orient(string)
组件朝向

- 'top'
- 'bottom'
- 'left'
- 'right'

#${prefix} showDetail(boolean | string)
是否显示前后内容文本

#${prefix} brushSelect(boolean)
是否启用刷选

#${prefix} backgroundStyle
背景样式

#${prefix} dragMaskStyle
拖拽区域样式

#${prefix} backgroundChartStyle
缩略图样式

#${prefix} selectedBackgroundStyle
选中区域背景央视

#${prefix} selectedBackgroundChartStyle
选中区域缩略图样式

#${prefix} middleHandlerStyle
中央手柄样式

#${prefix} startHandlerStyle
初始手柄样式

#${prefix} endHandlerStyle
终止手柄样式

#${prefix} startTextStyle
首部文字样式

#${prefix} endTextStyle
尾部文字样式

{{ /if }}

{{ if: ${type} === 'label' }}

#${prefix} size
标签防重叠计算的范围

{{ /if }}

{{ if: ${type} === 'legend' }}

layout
title
padding(array)

#${prefix} select(boolean)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例是否允许选中

#${prefix} hover(boolean)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例是否允许 hover

#${prefix} items
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的图例项

#${prefix} defaultSelected
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的默认选中图例项

#${prefix} selectMode(string)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的图例选中模式

- 'single'
- 'multiple'

#${prefix} allowAllCanceled(boolean)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例是否允许全部取消

#${prefix} reversed(boolean)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例是否逆序展示图例项

#${prefix} item
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的图例项样式

#${prefix} maxWidth(number)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的最大宽度

#${prefix} maxHeight(number)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的最大高度

#${prefix} maxRow(number)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的最大行数

#${prefix} maxCol(number)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的最大列数

#${prefix} autoPage(boolean)
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例是否支持自动翻页

#${prefix} pager
设置`legendType = 'discrete'` 或者自动计算为 `'discrete'` 时的离散图例的翻页器样式

#${prefix} colors(array)
设置`legendType = 'color'` 或者自动计算为 `'color'` 类型的颜色图例的色板

#${prefix} sizeBackground
设置`legendType = 'size'` 或者自动计算为 `'size'` 类型的大小图例的背景样式

#${prefix} slider
设置`legendType = 'color'` 或者自动计算为 `'color'` 类型的颜色图例以及设置`legendType = 'size'` 或者自动计算为 `'size'` 类型的大小图例包含 slider 组件的相应样式

{{ /if }}

{{ if: ${type} === 'player' }}

#${prefix} data
数据项内容

#${prefix} dataIndex(number)
数据项索引

#${prefix} orient(string)
播放器朝向

- 'top'
- 'bottom'
- 'left'
- 'right'

#${prefix} size
播放器尺寸

#${prefix} slider
播放器滑条样式

#${prefix} controller
播放器控制器样式

#${prefix} interval(number)
播放间隔

#${prefix} totalDuration(number)
设置 `playerType = 'continuous'` 或者自动计算为 `'continuous'` 类型播放器的总时长，与 `interval` 配置项互斥

{{ /if }}

{{ if: ${type} === 'slider' }}

#${prefix} slidable(boolean)
是否允许拖动

#${prefix} layout(string)
布局方式

- 'horizontal'
- 'vertical'

#${prefix} align(string)
手柄与文字的摆放位置

- 'top'
- 'bottom'
- 'left'
- 'right'

#${prefix} range(array)
滑条数值范围

#${prefix} min(number)
滑条最大值

#${prefix} max(number)
滑条最大值

#${prefix} value(number)
滑条当前值

#${prefix} step(number)
滑动步长

#${prefix} railWidth(number)
滑轨宽度

#${prefix} railHeight(number)
滑轨高度

#${prefix} showHandler(boolean)
是否显示滑块

#${prefix} handlerSize(number)
滑块大小

#${prefix} handlerStyle
滑块样式

#${prefix} railStyle
滑轨样式

#${prefix} trackStyle
选中区域样式

#${prefix} startText
首部文字样式

#${prefix} endText
尾部文字样式

#${prefix} handlerText
滑块文字央视

#${prefix} showTooltip(boolean)
是否显示提示信息

#${prefix} tooltip
提示信息样式

{{ /if }}

{{ if: ${type} === 'tooltip' }}

#${prefix} padding(number)
内边距

#${prefix} positionX(string)
X 方向上提示信息相对于光标的位置

- 'left'
- 'right'
- 'center'

#${prefix} positionY(string)
Y 方向上提示信息相对于光标的位置

- 'top'
- 'bottom'
- 'middle'

#${prefix} offsetX(number)
X 方向上提示信息的额外偏移

#${prefix} offsetY(number)
X 方向上提示信息的额外偏移

#${prefix} parentBounds
父节点的包围盒

#${prefix} autoCalculatePosition(boolean)
是否自动计算位置

#${prefix} autoMeasure(boolean)
是否自动测量内容文字宽高

#${prefix} panel
背景样式

#${prefix} titleStyle
标题样式

#${prefix} contentStyle
内容样式

{{ /if }}

<!-- glyph -->

{{ if: ${type} === 'barBoxplot' }}

#${prefix} max(number)
图元最大值坐标

#${prefix} min(number)
图元最小值坐标

#${prefix} q1(number)
图元 1/4 值坐标

#${prefix} q3(number)
图元 3/4 值坐标

#${prefix} median(number)
图元中值坐标

#${prefix} minMaxFillOpacity(number)
最大最小值柱子的填充不透明度

#${prefix} minMaxWidth(number)
最大最小值柱子的宽度

#${prefix} minMaxHeight(number)
最大最小值柱子的高度

#${prefix} q1q3Width(number)
q1q3 值柱子的宽度

#${prefix} q1q3Height(number)
q1q3 值柱子的高度

{{ /if }}

{{ if: ${type} === 'boxplot' }}

#${prefix} max(number)
图元最大值坐标

#${prefix} min(number)
图元最小值坐标

#${prefix} q1(number)
图元 1/4 值坐标

#${prefix} q3(number)
图元 3/4 值坐标

#${prefix} median(number)
图元中值坐标

#${prefix} boxWidth(number)
q1q3 箱形部分的宽度

#${prefix} boxHeight(number)
q1q3 箱形部分的高度

#${prefix} ruleWidth(number)
minMax 线段部分的宽度

#${prefix} ruleHeight(number)
minMax 线段部分的高度

{{ /if }}

{{ if: ${type} === 'linkPath' }}

#${prefix} x0(number)
最小水平位置

#${prefix} x1(number)
最大水平位置

#${prefix} y0(number)
最小垂直位置

#${prefix} y1(number)
最大垂直位置

#${prefix} thickness(number)
图元的厚度

#${prefix} curvature(number)
图元的曲率，默认为 0.5

#${prefix} round(boolean)
图元路径计算是否取整

#${prefix} ratio(number)
普通路径的厚度占比

#${prefix} align(string)
图元的对齐方式

- 'start'
- 'end'
- 'center'

#${prefix} pathType(string)
图元的渲染形状

- 'line'
- 'smooth'
- 'polyline'

#${prefix} startArrow(boolean)
是否开启开端的箭头

#${prefix} endArrow(boolean)
是否开启终端的箭头

#${prefix} backgroundStyle(object)
图元背景的样式

#${prefix} direction(string)
图元的朝向

- 'horizontal'
- 'vertical'
- 'LR'
- 'RL'
- 'TB'
- 'BL'
- 'radial'

{{ /if }}

{{ if: ${type} === 'ripplePoint' }}

#${prefix} ripple(number)
涟漪的变化状态，范围为 `[0, 1]`

{{ /if }}

{{ if: ${type} === 'wave' }}

#${prefix} wave(number)
波浪的变化状态，范围为 `[0, 1]`

{{ /if }}

<!-- base channels -->

#${prefix} x(number)

图元的 x 坐标

#${prefix} y(number)
图元 y 坐标

#${prefix} z(number)
图元 z 坐标，仅适用于 3D 图元

#${prefix} opacity(number)
图元渲染的不透明度

#${prefix} fill(string|Object)

图元的填充颜色。支持使用 `rgb(255,255,255)`，`rgba(255,255,255,1)`，`#fff` 等方式设置为纯色，也支持设置为渐变色填充。

{{ use: common-gradient() }}

#${prefix} fillOpacity(number)
图元填充的不透明度

#${prefix} stroke
图元的描边颜色。支持使用 `rgb(255,255,255)`，`rgba(255,255,255,1)`，`#fff` 等方式设置为纯色，也支持设置为渐变色填充。

{{ use: common-gradient() }}

#${prefix} strokeOpacity(number)
图元描边的不透明度

#${prefix} lineWidth(number)
图元描边的线宽

#${prefix} lineDash(Array)
类型为： number[]
图元描边的线段模式

#${prefix} lineDashOffset(number)
图元描边线段模式的偏移

#${prefix} lineCap(string)
图元描边的线端形状，配置可选项如下：

- 'butt'
- 'round'
- 'square'

#${prefix} lineJoin(string)
图元描边的连线方式，配置可选项如下：

- 'bevel'
- 'miter'
- 'round'

#${prefix} miterLimit(number)
当 `lineJoin` 类型是 miter 时，miter 效果生效的限制值

#${prefix} strokeBoundsBuffer(number)
图元描边的 boundsBuffer，用于控制 bounds 的 buffer

#${prefix} outerBorder(object)

外描边

#${prefix} innerBorder(object)

内描边

#${prefix} shadowBlur(number)

图元阴影的虚化半径大小

#${prefix} shadowColor(number)

图元的阴影颜色。支持使用 `rgb(255,255,255)`，`rgba(255,255,255,1)`，`#fff` 等方式设置为纯色，也支持设置为渐变色填充。

{{ use: common-gradient() }}

#${prefix} shadowOffsetX(number)

图元阴影的 x 偏移

#${prefix} shadowOffsetY(number)

图元阴影的 y 偏移

#${prefix} dx(number)
图元在 x 方向上的偏移

#${prefix} dy(number)
图元在 y 方向上的偏移

#${prefix} dz(number)
图元在 z 方向上的偏移

#${prefix} scrollX(number)

图元在 X 方向上的滚动偏移量

#${prefix} scrollY(number)

图元在 y 方向上的滚动偏移量

#${prefix} scaleX(number)

图元在 x 方向上的缩放比例，默认无缩放，也就是相当于值为 1

#${prefix} scaleY(number)

图元在 y 方向上的缩放比例，默认无缩放，也就是相当于值为 1

#${prefix} scaleZ(number)

图元在 z 方向上的缩放比例，默认无缩放，也就是相当于值为 1

#${prefix} angle(number)

图元在 x-y 平面 旋转的角度，在 3d 模式下，对应了绕 z 轴的转角

#${prefix} alpha(number)

3d 模式下绕 y 轴的转角

#${prefix} beta(number)

3d 模式下绕 x 轴的转角

#${prefix} background
图元背景颜色，或者背景图片；

当设置背景颜色的时候，支持使用 `rgb(255,255,255)`，`rgba(255,255,255,1)`，`#fff` 等方式设置为纯色，也支持设置为渐变色填充。

{{ use: common-gradient() }}

当设置图片的时候：

{{ use: common-image() }}

#${prefix} backgroundMode
图元背景的填充模式，与具体图元有关

#${prefix} texture
图元纹理

#${prefix} textureColor
图元纹理颜色

#${prefix} textureSize
图元纹理大小

#${prefix} texturePadding(number)
图元纹理间隙

#${prefix} blur(number)
图元边缘模糊

#${prefix} cursor
图元鼠标样式，同[DOM 样式](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor):

- 'auto'
- 'default'
- 'none'
- 'context-menu'
- 'help'
- 'pointer'
- 'progress'
- 'wait'
- 'cell'
- 'crosshair'
- 'text'
- 'vertical-text'
- 'alias'
- 'copy'
- 'move'
- 'no-drop'
- 'not-allowed'
- 'grab'
- 'grabbing'
- 'all-scroll'
- 'col-resize'
- 'row-resize'
- 'n-resize'
- 'e-resize'
- 's-resize'
- 'w-resize'
- 'ne-resize'
- 'nw-resize'
- 'se-resize'
- 'sw-resize'
- 'ew-resize'
- 'ns-resize'
- 'nesw-resize'
- 'nwse-resize'
- 'zoom-in'
- 'zoom-out';
