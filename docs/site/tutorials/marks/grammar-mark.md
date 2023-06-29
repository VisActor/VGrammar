# 语义图元

VGrammar 中的语义图元描述了某一类特定的数据语义。

## 区间图元 (Interval)

区间图元用于表示数据集某个区间范围，以柱状区间形式呈现。在不同坐标系下，区间图元可以用来创建柱状图、直方图、玫瑰图等可视化效果。

开发者可以选择直角坐标系或极坐标系，以满足不同的可视化需求。在直角坐标系中，interval 图形元素呈现为矩形；在极坐标系中，interval 图形元素则会呈现为弧形。

区间图元类型声明为 `'interval'`。

区间图元渲染示例：

<div class="examples-ref-container" id="examples-ref-interval" data-path="mark-interval/polar-interval">
</div>

## 单元图元 (Cell)

单元图元通常用于表示数据集某一个单位范围内的数值比例，可以用于创建热力图等可视化效果。单元图元类型声明为 `'cell'`。

单元图元渲染示例：

<div class="examples-ref-container" id="examples-ref-cell" data-path="mark-cell/calender-cell">
</div>
