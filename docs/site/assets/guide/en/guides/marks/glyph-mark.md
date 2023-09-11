# Composite Glyphs

In VGrammar, composite glyphs (Glyph) are glyphs obtained by combining any base glyphs to describe a complex graphic effect.

The glyph type of all composite glyphs is `'glyph'`, and developers need to configure `glyphType` to declare its type of composite glyph:

```js
{
  type: 'glyph',
  glyphType: 'boxplot',
  encode: {}
}
```

Compared with basic glyphs, composite glyphs have special visual channels and corresponding animation logic. In addition to some built-in composite glyphs provided by VGrammar, developers can also register custom composite glyphs to create richer visualization effects.

## Boxplot Glyph

Boxplot, also known as box-and-whisker plot, is a statistical chart used to display the distribution of a set of data. It can display the maximum, minimum, median, upper quartile (Q1), and lower quartile (Q3) of a set of data, allowing us to quickly understand the data distribution from the chart. Application scenarios include comparing the data distribution of different categories, identifying outliers, etc.

VGrammar provides two types of boxplot glyphs to support boxplot visualization:

- boxplot: Normal boxplot glyph, with glyphType as `'boxplot'`. Before using a general boxplot glyph, you need to execute `registerBoxplotGlyph()` to register the glyph. Example:

<div class="examples-ref-container" id="examples-ref-boxplot" data-path="glyph-mark/boxplot">
</div>

- barBoxplot: Variant boxplot glyph, with glyphType as `'barBoxplot'`. Before using a variant boxplot glyph, you need to execute `registerBarBoxplotGlyph()` to register the glyph. Example:

<div class="examples-ref-container" id="examples-ref-bar-boxplot" data-path="glyph-mark/bar-boxplot">
</div>

## RipplePoint Glyph

RipplePoint is a point glyph with a ripple effect, typically used to emphasize a specific data point or indicate data changes at a specific location. In map visualization and time series analysis, RipplePoint glyphs can express the spatial distribution of data and the dynamic process of data change. Application scenarios include showing the spread of earthquakes, epidemics, news events, etc.

The glyphType of the "RipplePoint" glyph is `'ripplePoint'`. Before using the "RipplePoint" glyph, you need to execute `registerRippleGlyph()` to register the glyph. Example:
![RipplePoint Glyph](TODO)

<div class="examples-ref-container" id="examples-ref-ripple" data-path="glyph-mark/ripple">
</div>

## Wave Glyph

The wave glyph is a glyph that simulates fluctuations and is used to express data fluctuations over time. In fields such as stock trading and weather forecasting, wave glyphs can display data fluctuation trends and periodic changes. Application scenarios include displaying stock prices and temperature/precipitation fluctuations.

The glyphType of the "Wave" glyph is `'wave'`. Before using the "Wave" glyph, you need to execute `registerWaveGlyph()` to register the glyph. Example:

<div class="examples-ref-container" id="examples-ref-wave" data-path="glyph-mark/wave">
</div>

## LinkPath Glyph

The LinkPath glyph is a glyph used to represent connections between data, commonly used to represent network relationships, spatial relationships, etc. In visualizations of social networks, transportation, and knowledge graphs, LinkPath glyphs can represent relationships and propagate processes between data. Application scenarios include displaying relationships between users, goods delivery, etc.

The glyphType of the "LinkPath" glyph is `'linkPath'`. Before using the "LinkPath" glyph, you need to execute `registerLinkPathGlyph()` to register the glyph. Example:

<div class="examples-ref-container" id="examples-ref-link-path" data-path="glyph-mark/link-path">
</div>

## TreePath Glyph

TreePath has a similar meaning to LinkPath, used to display connections without width

<div class="examples-ref-container" id="examples-ref-tree-path" data-path="hierarchy/tree">
</div>

## Custom Composite Glyph

In VGrammar, developers can not only use the built-in composite glyphs mentioned above, but also create richer visualization effects by combining existing basic glyphs.

The combination of glyphs lies in the combination of visual channels. Developers can register the glyph type through the `Factory.registerGlyph()` interface, and declare the default visual channels as well as specific visual channels. By default, all glyph glyph visual channels will be applied to all child glyphs. Developers can freely change the application logic of visual channels in child glyphs, such as declaring an additional `color` visual channel and applying it to the `fill` channel of the child rect glyph and the `stroke` channel of the child rule glyph.

Declare a simple K-line chart composite glyph example:

```js
Factory.registerGlyph('candle', {
  minMax: 'rule',
  startEnd: 'rect'
})
  .registerChannelEncoder('x', (channel, encodeValue) => {
    return {
      minMax: { x: encodeValue, x1: encodeValue },
      startEnd: { x: encodeValue }
    };
  })
  .registerChannelEncoder('min', (channel, encodeValue) => {
    return {
      minMax: { y: encodeValue }
    };
  })
  .registerChannelEncoder('max', (channel, encodeValue) => {
    return {
      minMax: { y1: encodeValue }
    };
  })
  .registerChannelEncoder('start', (channel, encodeValue) => {
    return {
      startEnd: { y: encodeValue }
    };
  })
  .registerChannelEncoder('end', (channel, encodeValue) => {
    return {
      startEnd: { y1: encodeValue }
    };
  })
  .registerChannelEncoder('boxWidth', (channel, encodeValue) => {
    return {
      startEnd: { width: encodeValue, dx: -encodeValue / 2 }
    };
  });
```

In addition, developers can register additional animation types through the `registerAnimationType` interface to match the glyph glyphs.

K-line chart example:

<div class="examples-ref-container" id="examples-ref-candle" data-path="glyph-mark/candle">
</div>
