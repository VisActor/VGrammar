{{ target: transform-treemap }}

## transform.treemap(Object)

对层次数据进行变换，计算 treemap 布局

### type(string) = treemap

将数据变换类型设置为 `treemap`，计算 treemap 布局

### gapWidth

设置相同深度的两个节点之间的间距，支持两种格式的配置

- 1. number 类型: 给所有层级的节点设置间距为指定的数值
- 2. number[] 数组类型: `number[i]`表示`depth = i`的节点之间的间距

### padding

类型：`number | number[]`

设置内边距，支持两种格式:

- number: 设置每一层的内边距
- `number[]`: number[i] 表示 depth = i 的节点的 内边距

### aspectRatio(number)

设置宽高比，默认值为`(1 + Math.sqrt(5)) / 2`，仅当`splitType`为`squarify`时，有效果，其他划分算法不关心这个参数

### labelPadding

对于非叶子节点，设置 label 的内边距，当且仅当有足够位置的时候，才会预留 label 展示的位置；
可选值为：

- `number`: 设置所有层级的 label 的内边距
- `number[]`: number[i] 表示 depth = i 的节点的 label 的内边距

### labelPosition(string)='top'

对于非叶子节点，设置 label 的位置，可选值为：

- `'top'` 顶部
- `'bottom'` 底部
- `'left'` 左侧
- `'right'` 右侧

会根据这个配置，在相应的方向留下对应的空间后，再去计算子节点的划分

### splitType(string)='binary'

划分矩形的算法类型，可选值为：

- `'binary'` 二分法
- `'squarify'` squarify 算法
- `'slice'` slice 算法，沿着水平方向划分
- `'dice'` dice 算法，沿着垂直方向划分
- `'slice-dice'` slice-dice 算法，水平方向-垂直方向交替换分

### nodeKey

类型：`string|number`
设置节点的全局唯一 key 对应的字段，如果不设置，内部会根据层级等信息自动生成

### maxDepth(number)

设置最大的深度，当节点的深度大于 maxDepth 时，不再计算下一层级的布局；这个配置可以不传

### minVisibleArea(number)=10

设置最小可见面积，当节点的面积小于 minVisibleArea 时，不再计算下一层级的布局；这个配置可以不传

### minChildrenVisibleArea

设置子节点的最小可见面积，当节点的面积小于 `minChildrenVisibleArea` 时，这个子节点会被隐藏；这个配置可以不传；
当值的类型为数组的时候，`minChildrenVisibleArea[i]` 表示 `depth = i` 的节点，对应的子节点的最小可见面积

### minChildrenVisibleSize

设置子节点的最小可见尺寸，当节点的宽度或者高度小于 `minChildrenVisibleSize` 时，这个子节点会被隐藏；这个配置可以不传；
当值的类型为数组的时候，`minChildrenVisibleSize[i]` 表示 `depth = i` 的节点，对应的子节点的最小可见尺寸
