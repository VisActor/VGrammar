{{ target: transform-tree }}

## transform.tree(Object)

对层次数据进行变换，计算 tree 布局

### type(string) = tree

将数据变换类型设置为 `tree`

### direction(string)='horizontal'

设置树图的对齐方式，可选值为：

- `'horizontal'` 将布局方向设置为水平方向，从左到右布局
- `'vertical'` 将布局方向设置为垂直方向，从上到下布局
- `'LR'` 将布局方向设置为从左到右
- `'RL'` 将布局方向设置为从右到左
- `'TB'` 将布局方向设置为从上到下
- `'BT'` 将布局方向设置为从下到上

### layoutType(string)='orthogonal'

设置布局的类型，默认值为`orthogonal`，表示在直角坐标系中进行布局；当值设置为`radial`时，表示在极坐标系中进行布局

### alignType(string)='depth'

设置布局的对齐方式，可选值为：

- `'depth'` 按照树的深度进行对齐
- `'leaf'` 对齐树的叶子节点

### linkWidth

类型：`number\|number[]`
是否必传： 否

- Specify the width of link, if not specified,
- Compute the depth-most nodes for extents.

设置树图的连线宽度，如果是垂直布局，表示连线的高度，支持两种格式:

- number: 设置所有连线的宽度
- number[]: 为每个层级连线设置宽度

如果不设置，会计算最大深度，然后计算每个层级的连线宽度

### minNodeGap(nunber)

设置兄弟节点之间的最小间距，如果不设置，会根据节点的宽度自动计算

### nodeKey

类型：`string|number`
设置节点的全局唯一 key 对应的字段，如果不设置，内部会根据层级等信息自动生成
