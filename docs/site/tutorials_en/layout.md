# Layout

Layout in VGrammar is used to set the position and arrangement of elements on the canvas. This article will introduce layout configurations in VGrammar canvas in detail, helping you quickly grasp the layout functionality of VGrammar.

This article will be divided into the following sections:

1. Types of Layout
2. Custom Layout

## Basics

VGrammar provides layouts that are implemented on the graphics. In the layout process, there are two roles:

1. Parent graphics
2. Sub graphics

The graphics type of the parent graphics must be `group`, and the sub graphics can be any type of graphics.

## Types of Layout

VGrammar supports two types of layouts: relative layout and grid layout. We will next introduce their configuration methods and usage scenarios.

### Relative Layout

Relative layout allows sub-graphics to be arranged according to certain rules relative to the position set by their parent graphics. First, set the parent-graphics's layout attribute `display` to `'relative'` to enable relative layout:

```js
marks: [{
  type: 'group',
  layout: {
    display: 'relative';
  },
}]
```

Note that the type of the parent graphics must be `group`. Other types of graphics do not support setting sub-graphics;
In relative layout, we can set the maximum width (maxChildWidth) and maximum height (maxChildHeight) of sub-graphics for the parent graphics, and also the position (position) and padding of sub-graphics.

The maximum width and height of sub-graphics support the following two formats:

- 'string': Percentage string, such as '20%', the denominator corresponds to the width or height of the bounding box of the container graphics;
- 'number': In px unit, set absolute width or height;

As for the position of sub-graphics, the following configurations are supported:

- 'top': relative to the top of the parent graphics;
- 'bottom': relative to the bottom of the parent graphics;
- 'left': relative to the left side of the parent graphics;
- 'right': relative to the right side of the parent graphics;
- 'content': relative to the center of the parent graphics, that is, the content area;
- 'auto': When a graphics has set a coordinate system, the position relative to the parent graphics is automatically calculated according to the associated coordinate system;

Sample code:

```javascript
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

In this example, the position of the sub-graphics will be arranged relative to the top of the parent graphics, the maximum width will occupy 20% of the parent graphics' width, the maximum height will be 100px, and a 5px padding will be set on all sides.

### Grid Layout

Grid layout divides the parent graphics into specified rows and columns, and places sub-graphics in these divided cells. First, set the parent graphics's layout attribute `layout.display` to 'grid', to enable grid layout:

```js
marks: [{
  type: 'group',
  layout: {
    display: 'grid';
  }
}]
```

In the grid layout, we need to set the height of rows (gridTemplateRows) and width of columns (gridTemplateColumns) for the parent graphics, and set the start (gridRowStart) and end (gridRowEnd) position of rows, and the start (gridColumnStart) and end (gridColumnEnd) position of columns for the sub-graphics. We can also set row spacing (gridRowGap) and column spacing (gridColumnGap) for the parent graphics.

Sample code:

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

In this example, the parent graphics will be divided into a 3x3 grid, with each cell being 100x100px in size, and row and column spacing both being 20px. Sub-graphics will be placed in the cells of the first row and first column.

## Custom Layout

In addition to relative layout and grid layout, VGrammar also supports custom layout schemes. To use a custom layout scheme, set the `layout` attribute to a custom callback function:

```js
marks: [{
  type: 'group',
  layout: (group, children, parentLayoutBounds, options) => {
    // Custom layout code
  };
}]
```

The callback function accepts the following parameters:

- group: container graphics (IGroupMark type);
- children: child nodes of the container graphics (IMark[] type);
- parentLayoutBounds: bounding box of the container graphics
