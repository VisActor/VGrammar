# Marks

Marks are the core grammar elements in VGrammar. The declarative logic of VGrammar visualization scenarios essentially lies in describing the data mapping (data join), visual channel encoding (visual encoding), and animation transition (animation) logic corresponding to the marks.

Marks in VGrammar can be understood as graphic elements with specific shapes or capabilities, such as basic lines, points, planes, and more complex axes, legend components, etc. By combining these basic elements, various complex visualization effects can be constructed.

Marks in VGrammar include several categories:

- Basic Mark: Describes the basic drawing mark of a specific shape, such as a rectangular mark, Rect;
- Semantic Mark: A mark with a specific semantic, such as a mark that describes a data interval, Interval;
- Glyph Mark: A mark obtained by combining any basic marks, used to describe a complex graphic effect, such as RipplePoint;
- Component Mark: Components with specific interaction, animation, and data logic, such as Axis.

![Composition of Marks](To be added)

## transform

Marks also support transform operations, and the difference between the data grammar elements Data is that the transform of marks now supports execution in two stages

1. Before executing `join`, perform data transformation on **join data**;
2. After completing the graphic channel mapping, before creating the graphic elements, perform data transformation on **graphic elements**;

So when VGrammar registers a transform, it will declare the stage of the `transform` when it is executed in the mark. Therefore, all the transforms supported by the data grammar element Data are also supported on the mark;

Example:

```js
{
  marks: [
    {
      type: 'rect',
      transform: [
        {
          type: 'filter',
          callback: datum => {
            return datum.value > 0;
          }
        }
      ]
    }
  ];
}
```

## Custom Graphics

In addition to the built-in mark rendering effects of VGrammar, developers can use the `marks.setCustomizedShape` interface to declare the rendering logic of marks and implement custom mark effects.

Custom graphics example:

<div class="examples-ref-container" id="examples-ref-customized-shape" data-path="basic-mark-rect/customized-shape">
</div>

Key configuration is as follows:

```js
{
  type: 'rect',
  setCustomizedShape: (data, attrs, path) => {
    path.moveTo(attrs.width / 2, 0);
    path.quadraticCurveTo(0.55 * attrs.width, 0.67 * attrs.height, attrs.width, attrs.height);
    path.lineTo(0, attrs.height);
    path.quadraticCurveTo(0.45 * attrs.width, 0.67 * attrs.height, attrs.width / 2, 0);
    path.closePath();
    return path;
  }
}
```

## Performance

### Progressive Rendering

Rendering large data visualizations requires high performance. To solve the performance problem that may be encountered when rendering large data volume, VGrammar provides a progressive rendering feature. By setting the `marks.progressiveStep` and `marks.progressiveThreshold` configuration items, large data volume graphics can be rendered in segments to optimize performance.

Progressive rendering example:

```js
{
  type: 'rect',
  progressiveStep: 3000,
  progressiveThreshold: 50000,
}
```

<div class="examples-ref-container" id="examples-ref-progressive-rect" data-path="performance/progressive-rect">
</div>

### Simplification of Large Data Volume Graphics

After enabling progressive rendering, the rendering effect of specific graphic elements will be simplified to improve rendering speed.

In common situations, graphic elements under large data volume only have position-related visual channel differences. During the progressive rendering process, VGrammar will extract non-reusable visual channels related to positioning and simplify the visual encoding process of each mark to improve rendering performance.
