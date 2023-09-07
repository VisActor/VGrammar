# Component Marks

In VGrammar, component Marks (Component) are components containing specific interactions, animations, and data logic, used to provide specific visualization functions.

The primitive type of all component marks is `'component'`. Developers need to configure `componetType` to declare its type of combination primitive:

```js
{
  type: 'component',
  componentType: 'axis',
  encode: {}
}
```

## Axis

An axis is a basic graphical component used to represent the baseline value of a chart and the mapping relationship of data. An axis usually includes a tick line and a label, representing the value range and the specific value of the data, respectively. In addition, the axis can be set with additional grid lines to enhance the readability of the data.

In the Cartesian coordinate system, there are two types of axes: horizontal axis (X-axis) and vertical axis (Y-axis). Different types of axes may be used for different types of charts, such as polar and angular axes for radial charts.

The componentType of the axis component is `'axis'`. The View also provides a `View.component()` interface for conveniently creating an axis.

A simple Cartesian coordinate axis example is:

<div class="examples-ref-container" id="examples-ref-axis-rect" data-path="basic-mark-rect/basic-rect"></div>

A simple polar coordinate axis example is:

<div class="examples-ref-container" id="examples-ref-axis-polar" data-path="mark-interval/polar-interval"></div>

## Legend

Legends are mainly used to display the identification of different data series in charts, helping users understand the chart content. For different types of charts, such as line charts and bar charts, legends can represent various information (such as color, shape, etc.).

According to the differences in the form of the corresponding Scale, VGrammar currently provides three types of legends:

- Discrete Legend: used to describe discrete Scale;
- Color Legend: used to describe continuous color scale;
- Size Legend: used to describe continuous numeric Scale.

The componentType of the legend component is `'legend'`. The View also provides a `View.legend()` interface for conveniently creating a legend.

Examples of different types of legends:

<div class="examples-ref-container" id="examples-ref-legend" data-path="component/legend"></div>

## Crosshair

The crosshair is an auxiliary element that helps users lock a precise data point, making it easier to read the specific data value of that point.

The crosshair usually intersects with the axis corresponding to the data point, consisting of horizontal and vertical lines. It is displayed when the user's mouse hovers or clicks, assisting the user in quickly understanding the data information of a point.

The componentType of the crosshair component is `'crosshair'`. The View also provides a `View.crosshair()` interface for conveniently creating a crosshair.

Crosshair example:

<div class="examples-ref-container" id="examples-ref-crosshair" data-path="basic-mark-symbol/basic-symbol"></div>

## Slider

The slider is an interactive component for filtering and scaling data. Users can adjust the data range by dragging the slider bar. Users can control the data range by dragging the slider gap and position. By operating the slider, users can view the data in a specified range according to their needs.

The componentType of the slider component is `'slider'`. The View also provides a `View.slider()` interface for conveniently creating a slider.

Slider example:

<div class="examples-ref-container" id="examples-ref-slider" data-path="component/slider"></div>

## Datazoom

The datazoom is used to view specific parts of long data sequences. It can easily expand and contract the data visualization range, providing a more intuitive interactive experience. By setting the datazoom, users can more easily view or filter information of interest, improving data analysis efficiency.

The componentType of the datazoom component is `'datazoom'`. The View also provides a `View.datazoom()` interface for conveniently creating a datazoom.

Datazoom example:

<div class="examples-ref-container" id="examples-ref-dataZoom" data-path="component/dataZoom"></div>

## Label

Labels are used to add text descriptions to visualization graphical elements, helping users quickly understand the specific information of data points.

The componentType of the label component is `'label'`. The View also provides a `View.label()` interface for conveniently creating a label.

Label example:

<div class="examples-ref-container" id="examples-ref-label" data-path="component/label"></div>

## Tooltip

Tooltips are temporarily displayed information prompts. When the user's cursor hovers over a data item in the chart, the tooltip appears near the cursor, displaying information to help users better understand the data.

The componentType of the tooltip component is `'tooltip' | 'dimensionTooltip'`, and the View also provides `View.tooltip()` and `View.dimensionTooltip()` interfaces to easily create a tooltip. These two tooltips are respectively aimed at the cases where tooltip is displayed on primitives and tooltip is displayed on data dimensions. Different tooltips can be mixed to adapt to flexible business scenarios.

Tooltip example:

<div class="examples-ref-container" id="examples-ref-tooltip" data-path="basic-mark-rect/percent-rect"></div>

## Player

In visualization scenarios, sometimes it is necessary to display the process of data changing over time. By using the player feature, users can observe the dynamic changes of data through the timeline.

The componentType of the player component is `'player'`. The View also provides a `View.player()` interface for conveniently creating a player.

Player example:

<div class="examples-ref-container" id="examples-ref-player" data-path="component/player"></div>
