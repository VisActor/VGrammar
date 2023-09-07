# Charts

In addition to the core VGrammar package, VGrammar also provides some optional extension packages to support additional charting capabilities:

- VGrammar-hierarchy: Provides a partial hierarchy of chart transform encapsulation, such as sunburst charts, etc.;
- VGrammar-sankey: Provides the Sankey chart's transform encapsulation;
- VGrammar-wordcloud: Provides the Wordcloud chart's transform encapsulation;
- VGrammar-wordcloud-shape: Provides the Shape Wordcloud chart's transform encapsulation.

Developers can use the transforms provided by these extension packages to quickly create various common charts, such as Sankey charts, Wordclouds, etc.

## Hierarchical Charts

Hierarchical charts are a type of chart that uses hierarchical nodes at its core to organize data into layers according to classification hierarchy relationships. Hierarchical charts help us better understand the relationships and hierarchical structures between data.

Through the vgrammar-hierarchy package, VGrammar currently provides four hierarchical charts: Circle-packing charts, Sunburst charts, Tree charts, and Treemap charts.

### Circle-packing Charts

Circle-packing charts are a type of chart that presents multi-level hierarchical relationships by nesting concentric circles. The size of the data layers is usually represented by the size of each circle, and the hierarchical relationship is represented by the containment relationship between concentric circles. Circle-packing charts are suitable for showing the size comparison and hierarchical relationship distribution of multi-level structured data in the same domain, such as global population distribution of countries and regions, and sales performance of company business departments.

Developers can call the `registerCirclePackingTransforms()` or `registerAllHierarchyTransforms()` methods provided by vgrammar-hierarchy to register the `circlePacking` transform.

The `circlePacking` transform calculates the layout information of the circle-packing chart based on the user's input data and stores the layout results in data fields such as x and y. Developers can then flatten the hierarchical data after calculating the layout using the `flattenNodes` method and apply it to the data mapping declaration of the circle mark.

Here is a simple transform usage example:

```js
{
  type: 'circlePacking',
  width: { signal: 'viewWidth' },
  height: { signal: 'viewHeight' },
  padding: [10, 5, 0],
  includeRoot: false
}
```

<div class="examples-ref-container" id="examples-ref-circlepacking" data-path="hierarchy/circlepacking">
</div>

### Sunburst Charts

Sunburst charts are a type of chart that displays multi-level data relationships in a ring-shaped structure. Each sector of a sunburst chart represents a hierarchical node, with the center being the root node and the outer layers representing the leaf nodes. The sector size usually represents node weight or other relative importance values. Sunburst charts are suitable for displaying complex hierarchical data relationships and comparing weights, such as file system storage allocation, and employee proportions within organizational structures.

Developers can call the `registerSunburstTransforms()` or `registerAllHierarchyTransforms()` methods provided by vgrammar-hierarchy to register the `sunburst` transform.

The `sunburst` transform calculates layout information for sunburst charts based on the user's input data and stores the layout results in data fields such as x, y, innerRadius, outerRadius, etc. Developers can then flatten the hierarchical data after calculating the layout using the `flattenNodes` method and apply it to the data mapping declaration of the mark.

Here is a simple transform usage example:

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

<div class="examples-ref-container" id="examples-ref-sunburst" data-path="hierarchy/sunburst">
</div>

### Tree Charts

Tree charts are a type of chart that uses connecting lines to link tree-structured hierarchical nodes. Tree charts start from the root node and branch out along the connecting lines until the leaf nodes, forming a complete hierarchical relationship diagram. Tree charts are suitable for displaying hierarchical relationships with clear boundaries and limited depths, such as company organizational structures and regional divisions.

Developers can call the `registerTreeTransforms()` or `registerAllHierarchyTransforms()` methods provided by vgrammar-hierarchy to register the `tree` transform.

The `tree` transform calculates layout information for tree charts based on user input data and stores the layout results in data fields such as x and y, etc. Developers can then flatten the hierarchical data after calculating the layout using the `flattenNodes` method and apply it to the data mapping declaration of the mark.

Here is a simple transform usage example:

```js
{
  type: 'tree',
  width: { signal: 'viewWidth' },
  height: { signal: 'viewHeight' },
  alignType: 'leaf',
  direction: 'vertical'
}
```

<div class="examples-ref-container" id="examples-ref-tree" data-path="hierarchy/tree">
</div>

### Treemap Charts

Treemap charts are a type of chart that segments hierarchical data into nested rectangles. The area of the rectangles represents node weight or other relative importance values, and the nesting relationship represents hierarchical structure. Treemap charts are suitable for displaying hierarchical relationships with relative weight differences, such as disk space usage and sales data.

Developers can call the `registerSunburstTransforms()` or `registerAllHierarchyTransforms()` methods provided by vgrammar-hierarchy to register the `sunburst` transform.

The `sunburst` transform calculates layout information for sunburst charts based on user input data and stores the layout results in data fields such as x, y, innerRadius, outerRadius, etc. Developers can then flatten the hierarchical data after calculating the layout using the `flattenNodes` method and apply it to the data mapping declaration of the mark.

Here is a simple transform usage example:

<div class="examples-ref-container" id="examples-ref-treemap" data-path="hierarchy/treemap">
</div>

## Sankey Charts

Sankey charts are a type of chart used to represent the flow transfer relationship between nodes. The nodes in a Sankey chart represent data entities, and the flow size is usually represented by the width of the connecting lines. Sankey charts are suitable for displaying flow transfer situations between multiple independent nodes, such as energy flow analysis and website visit paths.

### Installation

To implement a Sankey chart, you need to install the npm package `@visactor/vgrammar-sankey`:

```sh
npm add --save @visactor/vgrammar-sankey
```

### Registering Transform

When using it, you need to first call `registerSankeyTransforms` to register the corresponding transform for the Sankey layout algorithm; Meanwhile, VGrammar's main package provides the `linkPath` composite glyph for displaying links in the Sankey chart;

```js
import { registerSankeyTransforms } from '@visactor/vgrammar-sankey';
import { registerLinkPathGlyph } from '@visactor/vgrammar';

registerSankeyTransforms();
registerLinkPathGlyph();
```

### Usage of sankey transform

The `sankey` transform calculates the layout for the input data and returns the result as: `[{ nodes, links }]`;
You can use the `map` transform to get the data you want or do some formatting logic;

```js
{
  data: [
    {
      id: 'source'
    },
    {
      id: 'sankey',
      transform: [
        {
          type: 'sankey',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          nodeKey: datum => datum.name
        }
      ]
    },
    {
      id: 'nodes',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            return datum[0].nodes;
          }
        }
      ]
    },
    {
      id: 'links',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            return datum[0].links;
          }
        }
      ]
    }
  ];
}
```

### Displaying Sankey Nodes and Links

After obtaining the formatted data, we use two sets of glyphs to display the corresponding data:

Example:

```js
{
  marks: [
    {
      type: 'rect',
      id: 'sankeyNode',
      from: { data: 'nodes' },
      key: 'key',
      encode: {
        update: {
          x: { field: 'x0' },
          x1: { field: 'x1' },
          y: { field: 'y0' },
          y1: { field: 'y1' },
          fill: { scale: 'colorScale', field: 'key' }
        },
        blur: {
          fillOpacity: 0.2
        }
      }
    },

    {
      type: 'glyph',
      id: 'sankeyLink',
      glyphType: 'linkPath',
      from: { data: 'links' },
      key: 'index',
      dependency
```
