# 布局

VGrammar 中的布局（layout）用于设置元素在画布中的位置和排列方式。本文将详细介绍 VGrammar 画布中的布局配置，帮助您快速掌握 VGrammar 的布局功能。

本文将分为以下几个部分：

1. 布局的类型
2. 自定义布局

## 基础

VGrammar 提供的布局都是在图元上实现的，在布局的流程中，存在两种角色：

1. 父图元
2. 子图元

父图元的图元类型一定为`group`，子图元可以是任意类型的图元；

## 布局的类型

VGrammar 支持两种布局类型：相对布局（relative）和网格布局（grid）。下面我们将分别介绍它们的配置方式和使用场景。

### 相对布局

相对布局可以让子图元相对于其父图元设定的位置，根据一定的规则进行排列。首先将父图元的布局属性 `display` 设置为 `'relative'`，即可启用相对布局：

```js
marks: [{
  type: 'group',
  layout: {
    display: 'relative';
  },
}]
```

注意，父图元的类型一定为`group`，其他类型的图元，都不支持设置子图元；
在相对布局中，我们可以为父图元，设置子图元的最大宽度（maxChildWidth）和最大高度（maxChildHeight），还可以设置子图元的位置 position）及内边距（padding）。

关于子图元的大宽度和最大高度，支持以下两种格式：

- 'string'：百分比字符串，如 '20%'，分母对应的是容器图元的包围盒的宽度或高度；
- 'number'：单位为 px，设置绝对宽度或高度；

关于子图元的位置，支持以下几种配置：

- 'top'：相对于父图元的顶部；
- 'bottom'：相对于父图元的底部；
- 'left'：相对于父图元的左侧；
- 'right'：相对于父图元的右侧；
- 'content'：相对于父图元的中心，也就是内容区域；
- 'auto'：图元设置了坐标系的时候，根据关联的坐标系，自动计算相对于父图元的位置；

示例代码：

```js
marks: [
  {
    type: 'group',
    layout: {
      display: 'relative',
      maxChildWidth: '20%',
      maxChildHeight: 100,
      padding: 5
    },

    marks: [
      {
        type: 'rect',
        layout: {
          position: 'top'
        }
      }
    ]
  }
];
```

在这个示例中，子图元的位置将相对于父图元的顶部进行排列，最大宽度占父图元宽度的 20%，最大高度为 100px，并在四周设置 5px 的内边距。

### 网格布局

网格布局会将父图元按照指定的行和列进行划分，并将子图元放置在这些划分的单元格内。首先设置父图元的布局属性 `layout.display` 为 'grid'，即可启用网格布局：

```js
marks: [{
  type: 'group',
  layout: {
    display: 'grid';
  }
}]
```

在网格布局中，我们需要为父图元设置行的高度（gridTemplateRows）和列的宽度（gridTemplateColumns），并为子图元设置行的开始（gridRowStart）和结束（gridRowEnd）位置、列的开始（gridColumnStart）和结束（gridColumnEnd）位置。还可以为父图元设置行间距（gridRowGap）和列间距（gridColumnGap）。

示例代码：

```js
marks: [
  {
    type: 'group',
    layout: {
      display: 'grid',
      gridTemplateRows: [100, 100, 100],
      gridTemplateColumns: [100, 100, 100],
      gridRowGap: 20,
      gridColumnGap: 20
    },
    marks: [
      {
        type: 'rect',
        layout: {
          gridRowStart: 1,
          gridRowEnd: 2,
          gridColumnStart: 1,
          gridColumnEnd: 2
        }
      }
    ]
  }
];
```

在这个示例中，父图元将被划分为 3x3 的网格，每个单元格的尺寸为 100x100px，行间距和列间距均为 20px。子图元将被放置在第 1 行、第 1 列的单元格中。

## 自定义布局

除了相对布局和网格布局，VGrammar 也支持自定义布局方案。要自定义布局方，需要将 `layout` 属性设置为自定义的回调函数：

```js
marks: [{
  type: 'group',
  layout: (group, children, parentLayoutBounds, options) => {
    // 自定义布局代码
  };
}]
```

其中，回调函数的参数接收以下几个参数：

- group：容器图元（IGroupMark 类型）；
- children：容器图元的子节点（IMark[] 类型）；
- parentLayoutBounds：容器图元的包围盒
