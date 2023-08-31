# Basic Mark

Basic marks in VGrammar describe a specific type of drawing shape.

## Group Mark (Group)

Group mark are used to group multiple primitives for unified operations such as scaling and translation. The graphic type is declared as `'group'`.

It should be noted that group mark is different from other basic marks and do not support data mapping. A declared Group Mark can only correspond to a single final group graphic element.

## Rectangle Mark (Rect)

Rectangle mark is used to draw rectangles and can create visualization effects such as bar charts. The graphic type is declared as `'rect'`.

Rendering example of rectangle mark:

<div class="examples-ref-container" id="examples-ref-rect" data-path="basic-mark-rect/basic-rect">
</div>

## Arc Mark (Arc)

Arc mark s used to draw arcs and can create visualization effects such as pie charts and ring charts. The graphic type is declared as `'arc'`.

Rendering example of arc mark:

<div class="examples-ref-container" id="examples-ref-arc" data-path="basic-mark-arc/basic-arc">
</div>

## Area Mark (Area)

Area mark is used to draw areas between closed curves and coordinate axes, creating visualization effects such as area charts. The graphic type is declared as `'area'`.

Rendering example of area mark:

<div class="examples-ref-container" id="examples-ref-area" data-path="basic-mark-area/basic-area">
</div>

## Line Mark (Line)

Line mark is used to draw lines and can create visualization effects such as line charts. The graphic type is declared as `'line'`.

Rendering example of line mark:

<div class="examples-ref-container" id="examples-ref-line" data-path="basic-mark-line/basic-line">
</div>

## Symbol Mark (Symbol)

Symbol mark is used to draw specific shapes such as circles and rectangles, and can create visualization effects like scatter plots. The graphic type is declared as `'symbol'`.

Rendering example of symbol mark:

<div class="examples-ref-container" id="examples-ref-symbol" data-path="basic-mark-symbol/basic-symbol">
</div>

## Path Mark (Path)

Path mark is used to draw arbitrary shapes of paths, creating visualization effects such as custom shapes and geographic trajectories. The graphic type is declared as `'path'`.

<!--
Rendering example of path mark:
![Path graphics]()
 -->

## Rule Mark (Rule)

Rule mark is used to draw straight lines and can create visualization effects such as guide lines and reference lines. The graphic type is declared as `'rule'`.

Rendering example of rule mark:

<div class="examples-ref-container" id="examples-ref-rule" data-path="basic-mark-rule/basic-rule">
</div>

## Shape Mark (Shape)

Shape mark is used to draw custom shapes and can create visualization effects such as maps. The graphic type is declared as `'shape'`.

<!--
Rendering example of shape mark:
![Shape graphics]()
 -->

## Image Mark (Image)

Image mark is used to insert images in visualization scenes, creating visualization effects such as backgrounds and icons. The graphic type is declared as `'image'`.

<!--
Rendering example of image mark:
![Image graphics]()
 -->

## Text Mark (Text)

Text mark is used to draw text and can create visualization effects such as labels and titles. The graphic type is declared as `'text'`.

Rendering example of text mark:

<div class="examples-ref-container" id="examples-ref-text" data-path="basic-mark-text/basic-text">
</div>

## Rich Text Mark (Richtext)

Rich text mark is used to draw styled text and can create visualization effects such as highlights and links. The graphic type is declared as `'richtext'`.

Rendering example of rich text mark:

<div class="examples-ref-container" id="examples-ref-richtext" data-path="basic-mark-richtext/basic-richtext">
</div>

## Polygon Mark (Polygon)

Polygon mark is used to draw polygons and can create visualization effects such as funnel charts and convex hulls. The graphic type is declared as `'polygon'`.

Rendering example of polygon mark:

<div class="examples-ref-container" id="examples-ref-polygon" data-path="basic-mark-polygon/basic-polygon">
</div>

## 3D Rectangle Mark (Rect3d)

3D rectangle mark is used to draw cuboids and can create visualization effects such as bar charts in 3D visualizations. The graphic type is declared as `'rect3d'`.

Rendering example of 3D rectangle mark:

<div class="examples-ref-container" id="examples-ref-rect3d" data-path="3d-mark/rect3d">
</div>

## 3D Arc Mark (Arc3d)

3D arc mark is used to draw cylinders and can create visualization effects such as pie charts and ring charts in 3D visualizations. The graphic type is declared as `'arc3d'`.

Rendering example of 3D arc mark:

<div class="examples-ref-container" id="examples-ref-arc3d" data-path="3d-mark/arc3d">
</div>

## 3D Pyramid Mark (Pyramid3d)

3D pyramid marks is used to draw pyramid-shaped hexahedrons and can create visualization effects such as funnel charts in 3D visualizations. The graphic type is declared as `'pyramid3d'`.

Rendering example of 3D pyramid mark:

<div class="examples-ref-container" id="examples-ref-pyramid3d" data-path="3d-mark/pyramid3d">
</div>
