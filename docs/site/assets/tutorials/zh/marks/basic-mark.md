# 基础图元

VGrammar 中的基础图元描述了某一类特定的绘图形状。

## 分组图元 (Group)

分组图元用于对多个图元进行收拢，以便对其进行统一操作，如缩放、平移等。图元类型声明为 `'group'`。

需要注意的是，分组图元与其他基础图元不同，并不支持数据映射。声明的一个 Group Mark 只能对应到一个最终的 group 图形元素。

## 矩形图元 (Rect)

矩形图元用于绘制矩形，可以用来创建柱状图等可视化效果。图元类型声明为 `'rect'`。

矩形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-rect" data-path="basic-mark-rect/basic-rect">
</div>

## 弧形图元 (Arc)

弧形图元用于绘制圆弧，可以用来创建饼图、环形图等可视化效果。图元类型声明为 `'arc'`。

弧形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-arc" data-path="basic-mark-arc/basic-arc">
</div>

## 面积图元 (Area)

面积图元用于绘制封闭曲线与坐标轴之间的区域，可以用来创建面积图等可视化效果。图元类型声明为 `'area'`。

面积图元渲染示例：

<div class="examples-ref-container" id="examples-ref-area" data-path="basic-mark-area/basic-area">
</div>
## 线图元 (Line)

线图元用于绘制折线，可以用来创建折线图等可视化效果。图元类型声明为 `'line'`。

线图元渲染示例：

<div class="examples-ref-container" id="examples-ref-line" data-path="basic-mark-line/basic-line">
</div>

## 符号图元 (Symbol)

符号图元用于绘制特定图形，如圆、矩形等，可以用来创建散点图等可视化效果。图元类型声明为 `'symbol'`。

符号图元渲染示例：

<div class="examples-ref-container" id="examples-ref-symbol" data-path="basic-mark-symbol/basic-symbol">
</div>

## 路径图元 (Path)

路径图元用于绘制任意形状的路径，可以用来创建自定义的图形和地理轨迹等可视化效果。图元类型声明为 `'path'`。

<!--
路径图元渲染示例：
![路径图元]()
 -->

## 连线图元 (Rule)

连线图元用于绘制直线，可以用来创建辅助线、参考线等可视化效果。图元类型声明为 `'rule'`。

连线图元渲染示例：

<div class="examples-ref-container" id="examples-ref-rule" data-path="basic-mark-rule/basic-rule">
</div>

## 形状图元 (Shape)

形状图元用于绘制自定义形状，可以用来创建地图等可视化效果。图元类型声明为 `'shape'`。

<!--
形状图元渲染示例：
![形状图元]()
 -->

## 图像图元 (Image)

图像图元用于在视化场景中插入图片，可以用来创建背景、图标等可视化效果。图元类型声明为 `'image'`。

<!--
图像图元渲染示例：
![图像图元]()
 -->

## 文本图元 (Text)

文本图元用于绘制文本，可以用来创建标签、标题等可视化效果。图元类型声明为 `'text'`。

文本图元渲染示例：

<div class="examples-ref-container" id="examples-ref-text" data-path="basic-mark-text/basic-text">
</div>

## 富文本图元 (Richtext)

富文本图元用于绘制带有样式的文本，可以用来创建高亮、链接等可视化效果。图元类型声明为 `'richtext'`。

富文本图元渲染示例：

<div class="examples-ref-container" id="examples-ref-richtext" data-path="basic-mark-richtext/basic-richtext">
</div>

## 多边形图元 (Polygon)

多边形图元用于绘制多边形，可以用来创建漏斗图、凸包等可视化效果。图元类型声明为 `'polygon'`。

多边形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-polygon" data-path="basic-mark-polygon/basic-polygon">
</div>

## 三维矩形图元 (Rect3d)

三维矩形图元用于绘制长方体，可以用来创建三维可视化中的柱状图等可视化效果。图元类型声明为 `'rect3d'`。

三维矩形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-rect3d" data-path="3d-mark/rect3d">
</div>

## 三维弧形图元 (Arc3d)

三维弧形图元用于绘制柱体，可以用来创建三维可视化中的饼图、环形图等可视化效果。图元类型声明为 `'arc3d'`。

三维弧形图元渲染示例：

<div class="examples-ref-container" id="examples-ref-arc3d" data-path="3d-mark/arc3d">
</div>

## 三维金字塔图元 (Pyramid3d)

三维金字塔图元用于绘制金字塔形状的六面体，可以用来创建三维可视化中的漏斗图等可视化效果。图元类型声明为 `'pyramid3d'`。

三维金字塔图元渲染示例：

<div class="examples-ref-container" id="examples-ref-pyramid3d" data-path="3d-mark/pyramid3d">
</div>
