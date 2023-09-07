{{ target: marks-common-channels }}

{{ if: ${type} === 'rect' || ${type} === 'group' || ${type} === 'glyph' || ${type} === 'rect3d' }}

#${prefix} width(number)
The width of the shape

#${prefix} height(number)
The height of the shape

#${prefix} borderRadius

Set the border radius, default is 0, support two types of setting:

- `number`: Set the same border radius for all four corners
- `number[]`: Set different border radius for each corner
  - When the array length is `1`, set the same border radius for all four corners
  - When the array length is `2` or `3`, set border radius of **top-left** and **bottom-right** corners to `borderRadius[0]`, and border radius of **top-right** and **bottom-left** corners to `borderRadius[1]`
  - When the array length is `4` or more, set different border radius for each corner

{{ elif: ${type} === 'arc' || ${type} === 'arc3d' }}

#${prefix} innerRadius(number)
Inner radius

#${prefix} outerRadius(number)
Outer radius

#${prefix} startAngle(number)
The starting angle of the arc;
Specified in radians, 0 represents the 12 o'clock direction and the clockwise direction is positive.
If `|endAngle - startAngle| ≥ τ`, a complete sector or ring will be drawn

#${prefix} endAngle(number)
The ending angle of the arc;
Specified in radians, 0 represents the 12 o'clock direction and the clockwise direction is positive.
If `|endAngle - startAngle| ≥ τ`, a complete sector or ring will be drawn

#${prefix} padAngle(number)

Gap angle; the gap angle is converted into a fixed linear distance between two adjacent arcs, defined as `padRadius * | padAngle |`

This distance is equal at the beginning and end of the arc;
The gap angle should generally only be applied to annular sectors (i.e. when the inner radius is greater than 0)

#${prefix} padRadius(number)

Used in conjunction with `padAngle`

#${prefix} cap

Corresponds to the lineCap attribute of the line segment, lineCap represents how the line segment is drawn at the end, supporting two types of settings

- `boolean`: `cap: true` means to add an angle at the starting position of the arc line, and the angle is `| outerRadius - innerRadius | / outerRadius`

- `[boolean, boolean]`: set different end drawing strategies for the head and tail

#${prefix} forceShowCap(boolean)
When cap = true and gradient fill is used, automatically implement conical gradient, which is the circular gradient

{{ elif: ${type} === 'line' || ${type} === 'area' }}

#${prefix} enableSegments(boolean)
Whether to enable segmented style; because parsing segmented style requires a certain amount of performance consumption, this function will only be turned on when the style of all points is detected to be different

#${prefix} curveType(string)

The type of line, supporting the following options：

- 'basis'
- 'basisClosed'
- 'basisOpen'
- 'bundle'
- 'cardinal'
- 'cardinalClosed'
- 'cardinalOpen'
- 'stepBefore'
- 'stepAfter'
- 'catmullRom'
- 'catmullRomClosed'
- 'catmullRomOpen'
- 'linear'
- 'linearClosed'
- 'monotoneX'
- 'monotoneY'
- 'natural'
- 'radial'
- 'step'

{{ elif: ${type} === 'circle' }}

#${prefix} radius(number)
The radius of the circle

#${prefix} startAngle(number)
The starting angle of the circle;
Specified in radians, 0 represents the 12 o'clock direction and the clockwise direction is positive.
If `|endAngle - startAngle| ≥ τ`, a complete circle will be drawn, by default it is a full circle

#${prefix} endAngle(number)

The ending angle of the circle;
Specified in radians, 0 represents the 12 o'clock direction and the clockwise direction is positive.
If `|endAngle - startAngle| ≥ τ`, a complete circle will be drawn, by default it is a full circle

{{ elif: ${type} === 'image' }}

#${prefix} width(number)
The width of the shape

#${prefix} height(number)
The height of the shape

#${prefix} repeatX(string)

The type of repetition in the x direction, optional values are:

- `'no-repeat'` No-repeat
- `'repeat'` Repeat
- `'stretch'` Stretch

#${prefix} repeatY(string)

The type of repetition in the y direction, optional values are:

- `'no-repeat'` No-repeat
- `'repeat'` Repeat
- `'stretch'` Stretch

#${prefix} image

{{ use: common-image() }}

{{ elif: ${type} === 'path' }}

#${prefix} path

Set the path, support two formats:

- `'string'` Path string
- `'ICustomPath2D'` A utility class provided by VRrender for setting custom paths, returning the corresponding instance

{{ elif: ${type} === 'polygon' || ${type} === 'pyramid3d' }}

#${prefix} points

Points corresponding to the polygon

#${prefix} borderRadius

Set the border radius, default is 0, support two formats:

- `number`: Set a uniform border radius for all corners
- `number[]`: Set different border radius for each corner separately

{{ elif: ${type} === 'richtext' }}

#${prefix} width(number)

The width of the graphic element

#${prefix} height(number)

The height of the graphic element

#${prefix} textConfig(array)

Set the style for the subtext, type is `IRichTextCharacter[]`, the specific definition is as follows:

```ts
type IRichTextBasicCharacter = {
  lineHeight?: number;
  textAlign?: CanvasTextAlign; // left, right, center
  textBaseline?: CanvasTextBaseline;
  direction?: RichTextLayoutDirectionType;
};

type IRichTextParagraphCharacter = IRichTextBasicCharacter & {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: boolean;
  stroke?: boolean;
  fillColor?: IColor;
  strokeColor?: IColor;
  fontWeight?: string;
  // lineHeight?: number;
  fontStyle?: RichTextFontStyle; // normal, italic, oblique
  textDecoration?: RichTextTextDecoration; // none, underline, line-through
  // textAlign?: RichTextTextAlign; // left, right, center
  script?: RichTextScript; // normal, sub, super
  underline?: boolean;
  lineThrough?: boolean;
  // direction?: RichTextLayoutDirectionType;
};

type IRichTextImageCharacter = IRichTextBasicCharacter & {
  // 图片基础属性
  image: string | HTMLImageElement | HTMLCanvasElement;
  width: number;
  height: number;

  // hover相关属性
  // backgroundShow?: boolean; // 是否显示background
  backgroundShowMode?: 'always' | 'hover';
  backgroundFill?: boolean;
  backgroundFillColor?: IColor; // 背景矩形填充颜色
  backgroundFillOpacity?: number; // 背景矩形填充透明度
  backgroundStroke?: boolean;
  backgroundStrokeColor?: IColor; // 背景矩形边框颜色
  backgroundStrokeOpacity?: number; // 背景矩形边框透明度
  backgroundRadius?: number; // 背景矩形圆角
  // background size 同时控制了该icon的响应范围
  backgroundWidth?: number;
  backgroundHeight?: number;

  // 唯一标识符
  id?: string;

  // lineHeight?: number;
  // textAlign?: RichTextTextAlign; // left, right, center
  // direction?: RichTextLayoutDirectionType;
  margin?: number | number[];

  funcType?: string;
  hoverImage?: string | HTMLImageElement | HTMLCanvasElement;
};

type IRichTextCharacter = IRichTextParagraphCharacter | IRichTextImageCharacter;
```

#${prefix} ellipsis

Abbreviation-related configuration when the text is too long, supporting two types of configuration:

- `'string'` Enable automatic ellipsis and set the ellipsis symbol
- `'boolean'` Whether to enable automatic ellipsis, the default ellipsis symbol is `'...'`

#${prefix} wordBreak(string)

Text break setting, supports two configuration values:

- `'break-word'`
- `'break-all'`

#${prefix} verticalDirection(string)

Value direction alignment method, supports configuration:

- `'top'`
- `'middle'`
- `'bottom'`

#${prefix} layoutDirection(string)

Layout direction, supports configuration:

- `'horizontal'`
- `'vertical'`

#${prefix} singleLine(boolean)

Whether to display in a single line

#${prefix} maxHeight(number)

Maximum height

#${prefix} maxWidth(number)

Maximum width

#${prefix} textAlign(string)

Text alignment method, supports configuration:

- 'left'
- 'right'
- 'center'

#${prefix} textBaseline(string)

Text vertical alignment line, supports configuration:

- 'top'
- 'middle'
- 'bottom'

{{ elif: ${type} === 'symbol'}}

#${prefix} symbolType(string)

Set the type, support for passing in built-in types, or you can set it to a custom path. The built-in types include:

- 'circle'
- 'cross'
- 'diamond'
- 'square'
- 'arrow'
- 'arrow2Left'
- 'arrow2Right'
- 'wedge'
- 'thinTriangle'
- 'triangle'
- 'triangleUp'
- 'triangleDown'
- 'triangleRight'
- 'triangleLeft'
- 'stroke'
- 'star'
- 'wye'
- 'rect'

#${prefix} size

Set the diameter of the circumscribed circle of the `symbol`, supporting two formats of settings

- `number` Circumscribed circle diameter
- `[number, number]` When `symbolType: 'rect'`, set the width and height

{{ elif: ${type} === 'text'}}

#${prefix} text

Text, supports passing in arrays

#${prefix} maxLineWidth(number)

Maximum width, when this value is set, and the automatic ellipsis strategy is enabled, ellipsis symbols will be automatically added

#${prefix} ellipsis
When the text is too long, the ellipsis related configuration, supports two types of configuration:

- `'string'` Enable automatic ellipsis and set the ellipsis symbol
- `'boolean'` Whether to enable automatic ellipsis, the default ellipsis symbol is `'...'`

#${prefix} textAlign(string)

Text alignment, supports configuration:

- 'left'
- 'right'
- 'center'

#${prefix} textBaseline(string)

Text vertical alignment line, supports configuration:

- 'top'
- 'middle'
- 'bottom'

#${prefix} fontSize(number)

Font size, same as [CSS font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)

#${prefix} fontFamily(string)

Font, same as [CSS font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)

#${prefix} fontVariant(string)

Same as [CSS font-variant](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant)

#${prefix} fontStyle(string)

Font style, same as [CSS font-style](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style)

#${prefix} fontWeight(string|number)

Font weight, same as [CSS font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight)

#${prefix} lineHeight(number)

Line height

#${prefix} underline(boolean)

Whether to display underline

#${prefix} lineThrough(boolean)

Whether to display strikethrough

{{ /if }}

<!-- arc3d -->

{{ if: ${type} === 'arc3d' }}

#${prefix} height(number)
Height of the arc

{{ /if }}

<!-- pyramid3d -->

{{ if: ${type} === 'pyramid3d' }}

#${prefix} depthRatio(number)
Depth ratio

#${prefix} face

Set the 6 faces of up, down, left, right, front, and back. The ts type definition is:

```ts
[boolean, boolean, boolean, boolean, boolean, boolean];
```

{{ /if }}

<!-- rect3d -->

{{ if: ${type} === 'rect3d' }}

#${prefix} length(number)
Length

{{ /if }}

<!-- component -->

{{ if: ${type} === 'axis' }}

#${prefix} start
Set the point coordinates of the upper left corner of the axis. The format is: `{ x: number; y: number }`

#${prefix} end
Set the point coordinates of the lower right corner of the axis. The format is: `{ x: number; y: number }`

#${prefix} title
Set the axis title configuration

#${prefix} label
Set the axis label configuration

#${prefix} line
Set the axis connection line configuration

#${prefix} tick
Set the axis tick grid configuration

#${prefix} subTick
Set the axis secondary tick configuration

#${prefix} grid
Set the axis grid configuration

#${prefix} subGrid
Set the axis secondary grid configuration

{{ /if }}

{{ if: ${type} === 'crosshair' }}

#${prefix} start
When used in Cartesian coordinate system, set the coordinate of the upper left corner of the axis, in the format: `{ x: number; y: number }`

#${prefix} end
When used in Cartesian coordinate system, set the coordinate of the lower right corner of the axis, in the format: `{ x: number; y: number }`

#${prefix} center(number)
When used in polar coordinate system, set the origin coordinate of the coordinate system

#${prefix} radius(number)
When used in polar coordinate system, set the radius of the coordinate system

#${prefix} startAngle(number)
When used in polar coordinate system, set the starting angle of the coordinate system, default is `0`

#${prefix} endAngle(number)
When used in polar coordinate system, set the ending angle of the coordinate system, default is `2 * PI`

#${prefix} lineStyle
Set the line style of `crosshair` of type `crosshairShape = 'line'`

#${prefix} rectStyle
Set the rectangle style of `crosshair` of type `crosshairShape = 'rect'`

#${prefix} sectorStyle
Set the graphics style of `crosshair` of type `crosshairShape = 'rect' & crosshairType = 'angle'`

#${prefix} innerRadius(number)
Set the inner radius of the graphics of `crosshair` of type `crosshairShape = 'rect' & crosshairType = 'angle'`

#${prefix} sides(number)
Set the polygon side count of the graphics of `crosshair` of type `crosshairShape = 'line' & crosshairType = 'radius'`

{{ /if }}

{{ if: ${type} === 'datazoom' }}

#${prefix} orient(string)
Component orientation

- 'top'
- 'bottom'
- 'left'
- 'right'

#${prefix} showDetail(boolean | string)
Whether to show the front and back content text

#${prefix} brushSelect(boolean)
Whether to enable brush selection

#${prefix} backgroundStyle
Background style

#${prefix} dragMaskStyle
Drag area style

#${prefix} backgroundChartStyle
Thumbnail style

#${prefix} selectedBackgroundStyle
Selected area background style

#${prefix} selectedBackgroundChartStyle
Selected area thumbnail style

#${prefix} middleHandlerStyle
Central handle style

#${prefix} startHandlerStyle
Initial handle style

#${prefix} endHandlerStyle
End handle style

#${prefix} startTextStyle
Header text style

#${prefix} endTextStyle
Footer text style

{{ /if }}

{{ if: ${type} === 'label' }}

#${prefix} size
The range of label overlap prevention calculation

{{ /if }}

{{ if: ${type} === 'legend' }}

#${prefix}layout
#${prefix}title
#${prefix}padding(array)

#${prefix} select(boolean)
Allow selection for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} hover(boolean)
Allow hover for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} items
Legend items for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} defaultSelected
Default selected legend items for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} selectMode(string)
Legend selection mode for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

- 'single'
- 'multiple'

#${prefix} allowAllCanceled(boolean)
Allow all canceling for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} reversed(boolean)
Display legend items in reversed order for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} item
Legend item style for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} maxWidth(number)
Maximum width for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} maxHeight(number)
Maximum height for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} maxRow(number)
Maximum row count for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} maxCol(number)
Maximum column count for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} autoPage(boolean)
Support automatic page turning for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} pager
Pager style for discrete legends when `legendType = 'discrete'` or automatically calculated as `'discrete'`

#${prefix} colors(array)
Color palette for color legends when `legendType = 'color'` or automatically calculated as `'color'`

#${prefix} sizeBackground
Background style for size legends when `legendType = 'size'` or automatically calculated as `'size'`

#${prefix} slider
Slider component styles when the color legend is set to `legendType = 'color'` or automatically calculated as `'color'`, and when the size legend is set to `legendType = 'size'` or automatically calculated as `'size'`

{{ /if }}

{{ if: ${type} === 'player' }}

#${prefix} data
Data item content

#${prefix} dataIndex(number)
Data item index

#${prefix} orient(string)
Player orientation

- 'top'
- 'bottom'
- 'left'
- 'right'

#${prefix} size
Player size

#${prefix} slider
Player slider style

#${prefix} controller
Player controller style

#${prefix} interval(number)
Play interval

#${prefix} totalDuration(number)
Set the total duration for the `playerType = 'continuous'` or automatically calculated as `'continuous'` type player, mutually exclusive with the `interval` configuration item

{{ /if }}

{{ if: ${type} === 'slider' }}

#${prefix} slidable(boolean)
Allow dragging

#${prefix} layout(string)
Layout mode

- 'horizontal'
- 'vertical'

#${prefix} align(string)
Handle and text placement

- 'top'
- 'bottom'
- 'left'
- 'right'

#${prefix} range(array)
Slider value range

#${prefix} min(number)
Slider minimum value

#${prefix} max(number)
Slider maximum value

#${prefix} value(number)
Slider current value

#${prefix} step(number)
Sliding step size

#${prefix} railWidth(number)
Rail width

#${prefix} railHeight(number)
Rail height

#${prefix} showHandler(boolean)
Show slider handle

#${prefix} handlerSize(number)
Handle size

#${prefix} handlerStyle
Handle style

#${prefix} railStyle
Rail style

#${prefix} trackStyle
Selected area style

#${prefix} startText
Head text style

#${prefix} endText
Tail text style

#${prefix} handlerText
Slider handle text style

#${prefix} showTooltip(boolean)
Show tooltip

#${prefix} tooltip
Tooltip style

{{ /if }}

{{ if: ${type} === 'tooltip' }}

#${prefix} padding(number)
Padding

#${prefix} positionX(string)
The relative position of the tooltip information to the cursor on the X-axis

- 'left'
- 'right'
- 'center'

#${prefix} positionY(string)
The relative position of the tooltip information to the cursor on the Y-axis

- 'top'
- 'bottom'
- 'middle'

#${prefix} offsetX(number)
Additional offset of the tooltip information on the X-axis

#${prefix} offsetY(number)
Additional offset of the tooltip information on the Y-axis

#${prefix} parentBounds
Bounding box of the parent node

#${prefix} autoCalculatePosition(boolean)
Whether to automatically calculate the position

#${prefix} autoMeasure(boolean)
Whether to automatically measure the width and height of the content text

#${prefix} panel
Background style

#${prefix} titleStyle
Title style

#${prefix} contentStyle
Content style

{{ /if }}

<!-- glyph -->

{{ if: ${type} === 'barBoxplot' }}

#${prefix} max(number)
Max value coordinate of the element

#${prefix} min(number)
Min value coordinate of the element

#${prefix} q1(number)
1/4 value coordinate of the element

#${prefix} q3(number)
3/4 value coordinate of the element

#${prefix} median(number)
Median value coordinate of the element

#${prefix} minMaxFillOpacity(number)
Fill opacity of the min and max value bars

#${prefix} minMaxWidth(number)
Width of the min and max value bars

#${prefix} minMaxHeight(number)
Height of the min and max value bars

#${prefix} q1q3Width(number)
Width of the q1q3 value bars

#${prefix} q1q3Height(number)
Height of the q1q3 value bars

{{ /if }}

{{ if: ${type} === 'boxplot' }}

#${prefix} max(number)
Max value coordinate of the element

#${prefix} min(number)
Min value coordinate of the element

#${prefix} q1(number)
1/4 value coordinate of the element

#${prefix} q3(number)
3/4 value coordinate of the element

#${prefix} median(number)
Median value coordinate of the element

#${prefix} boxWidth(number)
Width of the q1q3 box part

#${prefix} boxHeight(number)
Height of the q1q3 box part

#${prefix} ruleWidth(number)
Width of the minMax line part

#${prefix} ruleHeight(number)
Height of the minMax line part

{{ /if }}

{{ if: ${type} === 'linkPath' }}

#${prefix} x0(number)
Minimum horizontal position

#${prefix} x1(number)
Maximum horizontal position

#${prefix} y0(number)
Minimum vertical position

#${prefix} y1(number)
Maximum vertical position

#${prefix} thickness(number)
Thickness of the graphic element

#${prefix} curvature(number)
Curvature of the graphic element, default is 0.5

#${prefix} round(boolean)
Whether to round the calculated path of the graphic element

#${prefix} ratio(number)
Thickness percentage of the normal path

#${prefix} align(string)
Alignment of the graphic element

- 'start'
- 'end'
- 'center'

#${prefix} pathType(string)
Rendering shape of the graphic element

- 'line'
- 'smooth'
- 'polyline'

#${prefix} startArrow(boolean)
Enable arrow at starting point

#${prefix} endArrow(boolean)
Enable arrow at the end point

#${prefix} backgroundStyle(object)
Style of the graphic element background

#${prefix} direction(string)
Direction of the graphic element

- 'horizontal'
- 'vertical'
- 'LR'
- 'RL'
- 'TB'
- 'BL'
- 'radial'

{{ /if }}

{{ if: ${type} === 'ripplePoint' }}

#${prefix} ripple(number)
Ripple change state, range is `[0, 1]`

{{ /if }}

{{ if: ${type} === 'wave' }}

#${prefix} wave(number)
Wave change state, range is `[0, 1]`

{{ /if }}

<!-- base channels -->

#${prefix} x(number)

Graphic element's x coordinate

#${prefix} y(number)
Graphic element's y coordinate

#${prefix} z(number)
Graphic element's z coordinate, only applicable to 3D graphics

#${prefix} opacity(number)
Opacity of the graphic element rendering

#${prefix} fill(string|Object)

Graphic element's fill color. Supports setting solid color using `rgb(255,255,255)`, `rgba(255,255,255,1)`, `#fff`, and gradient color fills.

{{ use: common-gradient() }}

#${prefix} fillOpacity(number)
Graphic element's fill opacity

#${prefix} stroke
Graphic element's stroke color. Supports setting solid color using `rgb(255,255,255)`, `rgba(255,255,255,1)`, `#fff`, and gradient color fills.

{{ use: common-gradient() }}

#${prefix} strokeOpacity(number)
Opacity of the graphic element's stroke

#${prefix} lineWidth(number)
Line width of the graphic element's stroke

#${prefix} lineDash(Array)
Type: number[]
Line pattern mode of the graphic element's stroke

#${prefix} lineDashOffset(number)
Offset of the graphic element's stroke line pattern mode

#${prefix} lineCap(string)
Line cap style of the graphic stroke, with the following optional options:

- 'butt'
- 'round'
- 'square'

#${prefix} lineJoin(string)
Line join style of the graphic stroke, with the following optional options:

- 'bevel'
- 'miter'
- 'round'

#${prefix} miterLimit(number)
The limit value for the miter effect when the `lineJoin` type is miter

#${prefix} strokeBoundsBuffer(number)
The boundsBuffer of the graphic stroke for controlling the buffer of the bounds

#${prefix} outerBorder(object)

Outer border

#${prefix} innerBorder(object)

Inner border

#${prefix} shadowBlur(number)

The blur radius size of the graphic shadow

#${prefix} shadowColor(number)

The shadow color of the graphic. Supports setting to solid colors using `rgb(255,255,255)`, `rgba(255,255,255,1)`, `#fff`, etc., and also supports setting to gradient color fills.

{{ use: common-gradient() }}

#${prefix} shadowOffsetX(number)

The x offset of the graphic shadow

#${prefix} shadowOffsetY(number)

The y offset of the graphic shadow

#${prefix} dx(number)
The offset of the graphic in the x direction

#${prefix} dy(number)
The offset of the graphic in the y direction

#${prefix} dz(number)
The offset of the graphic in the z direction

#${prefix} scrollX(number)

The scrolling offset of the graphic in the X direction

#${prefix} scrollY(number)

The scrolling offset of the graphic in the y direction

#${prefix} scaleX(number)

The scaling factor of the graphic in the x direction, default is no scaling, which is equivalent to a value of 1

#${prefix} scaleY(number)

The scaling factor of the graphic in the y direction, default is no scaling, which is equivalent to a value of 1

#${prefix} scaleZ(number)

The scaling factor of the graphic in the z direction, default is no scaling, which is equivalent to a value of 1

#${prefix} angle(number)

The rotation angle of the graphic in the x-y plane, in 3d mode, corresponds to the rotation angle around the z-axis

#${prefix} alpha(number)

The rotation angle around the y-axis in 3d mode

#${prefix} beta(number)

The rotation angle around the x-axis in 3d mode

#${prefix} background
The background color of the graphic, or the background image;

When setting the background color, supports using `rgb(255,255,255)`, `rgba(255,255,255,1)`, `#fff`, etc. to set solid colors, and also supports setting gradient color fills.

{{ use: common-gradient() }}

When setting images:

{{ use: common-image() }}

#${prefix} backgroundMode
The fill mode of the graphic background, depending on the specific graphic

#${prefix} texture
The texture of the graphic

#${prefix} textureColor
The color of the graphic texture

#${prefix} textureSize
The size of the graphic texture

#${prefix} texturePadding(number)
The gap between the graphic textures

#${prefix} blur(number)
The edge blur of the graphic

#${prefix} cursor
The mouse cursor style of the graphic, similar to [DOM styles](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor):

- 'auto'
- 'default'
- 'none'
- 'context-menu'
- 'help'
- 'pointer'
- 'progress'
- 'wait'
- 'cell'
- 'crosshair'
- 'text'
- 'vertical-text'
- 'alias'
- 'copy'
- 'move'
- 'no-drop'
- 'not-allowed'
- 'grab'
- 'grabbing'
- 'all-scroll'
- 'col-resize'
- 'row-resize'
- 'n-resize'
- 'e-resize'
- 's-resize'
- 'w-resize'
- 'ne-resize'
- 'nw-resize'
- 'se-resize'
- 'sw-resize'
- 'ew-resize'
- 'ns-resize'
- 'nesw-resize'
- 'nwse-resize'
- 'zoom-in'
- 'zoom-out'
