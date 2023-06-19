# 图表

在 VGrammar 的核心包之外，VGrammar 也提供了一些可选的扩展包以支持额外的图表能力：

- VGrammar-hierarchy：提供了部分层级图表的 transform 封装，例如旭日图等；
- VGrammar-sankey：提供了桑基图的 transform 封装；
- VGrammar-wordcloud：提供了词云的 transform 封装；
- VGrammar-wordcloud-shape：提供了形状词云的 transform 封装。

开发者可以使用这些扩展包所提供的 transform 快速创建各种常用的图表，例如桑基图、词云等。

## 层级图表

层级图表是一类以层级节点为核心，将数据按照分类层级关系进行分层组织的图表。层级图表帮助我们更好地理解数据之间的关联性和层次结构。

VGrammar 目前通过 vgrammar-hierarchy 包提供了四种层级图表：Circle-packing 图、旭日图、树图和矩形树图。

### Circle-packing 图

Circle-packing 图是一种通过嵌套放置同心圆的方式呈现多层次层级关系的图表。数据层的大小通常由每个圆的大小来表示，层级关系由同心圆之间的包含关系体现。Circle-packing 图适用于展示多层次结构数据在同一领域的大小比较以及层级关系分布情况。例如，Circle-packing 图可以用于显示全球各国家地区的人口分布情况、公司经营业务部门的销售业绩等。

开发者可以调用 vgrammar-hierarchy 中的 `registerCirclePackingTransforms()` 或者 `registerAllHierarchyTransforms()` 对 `circlePacking` transform 进行注册。

`circlePacking` transform 基于用户传入的层级数据计算 circle-packing 图的布局信息，并将布局结果放入数据字段中，例如 x、y。随后开发者可以将计算布局后的层级数据通过 `flattenNodes` 方法进行展平，并应用于 circle mark 的数据映射声明中。

一个简单的 transform 使用示例为：

```js
{
  type: 'circlePacking',
  width: { signal: 'viewWidth' },
  height: { signal: 'viewHeight' },
  padding: [10, 5, 0],
  includeRoot: false
}
```

![circle-packing](https://s1.ax1x.com/2023/06/19/pC33uiF.png)

### 旭日图

旭日图（Sunburst）是一种以环形结构展示多层级数据关系的图表。旭日图的每个扇区代表一个层级节点，从中心向外表示从根节点到叶节点的层级结构。扇区的大小通常表示节点权重或者其他相对重要度数值。旭日图适用于显示复杂数量的层级数据关系和比较权重，例如文件系统的存储分布、组织架构的人员比例等。

开发者可以调用 vgrammar-hierarchy 中的 `registerSunburstTransforms()` 或者 `registerAllHierarchyTransforms()` 对 `sunburst` transform 进行注册。

`sunburst` transform 基于用户传入的层级数据计算旭日图的布局信息，并将布局结果放入数据字段中，例如 x、y、innerRadius、outerRadius 等。随后开发者可以将计算布局后的层级数据通过 `flattenNodes` 方法进行展平，并应用于 mark 的数据映射声明中。

一个简单的 transform 使用示例为：

```js
{
  type: 'sunburst',
  width: { signal: 'viewWidth' },
  height: { signal: 'viewHeight' },
  innerRadius: ['15%', '37%', '67', '74%'],
  outerRadius: ['35%', '65%', '72%', '80%'],
  label: [
    {
      align: 'center',
      rotate: 'tangential'
    },
    { rotate: 'radial', align: 'end' },
    { rotate: 'radial', align: 'start', offset: 10 }
  ]
}
```

![sunburst](https://s1.ax1x.com/2023/06/19/pC33YdK.png)

### 树图

树图（Tree）是一种以连接线将树形结构的层级节点串联起来的图表。树图从根节点开始，沿着连接线不断分支，直至叶子节点，形成一个完整的层级关系图。树图适用于显示层级关系明确、深度有限的数据结构，例如公司组织架构、地区政区划分等。

开发者可以调用 vgrammar-hierarchy 中的 `registerTreeTransforms()` 或者 `registerAllHierarchyTransforms()` 对 `tree` transform 进行注册。

`tree` transform 基于用户传入的层级数据计算旭日图的布局信息，并将布局结果放入数据字段中，例如 x、y 等。随后开发者可以将计算布局后的层级数据通过 `flattenNodes` 方法进行展平，并应用于 mark 的数据映射声明中。

一个简单的 transform 使用示例为：

```js
{
  type: 'tree',
  width: { signal: 'viewWidth' },
  height: { signal: 'viewHeight' },
  alignType: 'leaf',
  direction: 'vertical'
}
```

### 矩形树图

矩形树图（Treemap）是一种将层级数据分隔成嵌套矩形的图表。矩形的面积表示节点的权重或者其他相对重要度数值，嵌套关系表示层级结构。矩形树图适用于展示节点间相对权重的层级关系，例如磁盘空间占用情况、销售数据等。

开发者可以调用 vgrammar-hierarchy 中的 `registerSunburstTransforms()` 或者 `registerAllHierarchyTransforms()` 对 `sunburst` transform 进行注册。

`sunburst` transform 基于用户传入的层级数据计算旭日图的布局信息，并将布局结果放入数据字段中，例如 x、y、innerRadius、outerRadius 等。随后开发者可以将计算布局后的层级数据通过 `flattenNodes` 方法进行展平，并应用于 mark 的数据映射声明中。

一个简单的 transform 使用示例为：

```js

```

## 桑基图

桑基图（Sankey）是一种用来表示节点之间流量转移关系的图表。桑基图的节点表示数据实体，而流的大小通常由连接线的宽度来表示。桑基图适用于展示多个相互独立的节点之间的流量转移情况，例如能源流向分析、网站访问路径等。

## 词云

词云（Wordcloud）是一种将文字数据呈现为词汇组成的云形图像的图表。每个词汇的大小表示其权重或其他数值，视觉上呈现出数据中关键词的重要性差异。词云适用于展示关键词的权重差异，例如文本内容关键词分析、搜索热点关键词等。

## 形状词云

形状词云（WordcloudShape）是一种基于词云将文字数据呈现在特定形状的图表。与词云相同，每个词汇的大小表示其权重或其他数值，同时形状词云还具较强的视觉美感。形状词云适用于展示关键词的权重差异，同时具有较高的视觉冲击力，例如品牌宣传、商业推广等。
