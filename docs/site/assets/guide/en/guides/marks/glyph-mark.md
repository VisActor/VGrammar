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

```javascript livedemo template=vgrammar
VGrammar.registerBoxplotGlyph();

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },

  data: [
    {
      id: 'table',
      values: [
        {
          test: 'test0',
          value1: 1600,
          value2: 1200,
          value3: 800,
          value4: 700,
          value5: 500
        },
        {
          test: 'test1',
          value1: 1900,
          value2: 1000,
          value3: 400,
          value4: 300,
          value5: 100
        },
        {
          test: 'test2',
          value1: 1300,
          value2: 1200,
          value3: 200,
          value4: -100,
          value5: -500
        },
        {
          test: 'test3',
          value1: 1400,
          value2: 1000,
          value3: 900,
          value4: 800,
          value5: 500
        },
        {
          test: 'test4',
          value1: 1200,
          value2: 500,
          value3: 400,
          value4: -100,
          value5: -400
        },
        {
          test: 'test5',
          value1: 1400,
          value2: 1000,
          value3: 900,
          value4: 700,
          value5: 300
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xScale',
      type: 'point',
      domain: { data: 'table', field: 'test' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.5,
      round: true
    },
    {
      id: 'yScale',
      type: 'linear',
      domain: { data: 'table', field: ['value1', 'value2', 'value3', 'value4', 'value5'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'test' },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
      ]
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xScale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      encode: {
        update: (datum, element, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yScale',
      tickCount: 5,
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: 0, y: -params.viewBox.height() },
            verticalFactor: -1
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'glyph',
      from: { data: 'table' },
      glyphType: 'boxplot',
      encode: {
        update: {
          x: { scale: 'xScale', field: 'test' },
          max: { scale: 'yScale', field: 'value1' },
          q3: { scale: 'yScale', field: 'value2' },
          median: { scale: 'yScale', field: 'value3' },
          q1: { scale: 'yScale', field: 'value4' },
          min: { scale: 'yScale', field: 'value5' },

          boxWidth: 60,
          ruleWidth: 40,

          stroke: 'black',
          fill: { scale: 'colorScale', field: 'test' },
          opacity: 1
        },
        hover: {
          opacity: 0.7
        }
      },
      animation: {
        enter: {
          type: 'boxplotScaleIn',
          duration: 1000
        },
        state: {
          duration: 500
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

- barBoxplot: Variant boxplot glyph, with glyphType as `'barBoxplot'`. Before using a variant boxplot glyph, you need to execute `registerBarBoxplotGlyph()` to register the glyph. Example:

<div class="examples-ref-container" id="examples-ref-bar-boxplot" data-path="glyph-mark/bar-boxplot">
</div>

```javascript livedemo template=vgrammar
VGrammar.registerBarBoxplotGlyph();

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },

  data: [
    {
      id: 'table',
      values: [
        {
          test: 'test0',
          value1: 1600,
          value2: 1200,
          value3: 800,
          value4: 700,
          value5: 500
        },
        {
          test: 'test1',
          value1: 1900,
          value2: 1000,
          value3: 400,
          value4: 300,
          value5: 100
        },
        {
          test: 'test2',
          value1: 1300,
          value2: 1200,
          value3: 200,
          value4: -100,
          value5: -500
        },
        {
          test: 'test3',
          value1: 1400,
          value2: 1000,
          value3: 900,
          value4: 800,
          value5: 500
        },
        {
          test: 'test4',
          value1: 1200,
          value2: 500,
          value3: 400,
          value4: -100,
          value5: -400
        },
        {
          test: 'test5',
          value1: 1400,
          value2: 1000,
          value3: 900,
          value4: 700,
          value5: 300
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xScale',
      type: 'point',
      domain: { data: 'table', field: 'test' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.5,
      round: true
    },
    {
      id: 'yScale',
      type: 'linear',
      domain: { data: 'table', field: ['value1', 'value2', 'value3', 'value4', 'value5'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'test' },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
      ]
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xScale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      encode: {
        update: (datum, element, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yScale',
      tickCount: 5,
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: 0, y: -params.viewBox.height() },
            verticalFactor: -1
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'glyph',
      from: { data: 'table' },
      glyphType: 'barBoxplot',
      encode: {
        update: {
          x: { scale: 'xScale', field: 'test' },
          max: { scale: 'yScale', field: 'value1' },
          q3: { scale: 'yScale', field: 'value2' },
          median: { scale: 'yScale', field: 'value3' },
          q1: { scale: 'yScale', field: 'value4' },
          min: { scale: 'yScale', field: 'value5' },

          q1q3Width: 60,
          minMaxWidth: 40,
          lineWidth: 2,

          fill: { scale: 'colorScale', field: 'test' },
          stroke: 'black',
          minMaxFillOpacity: 0.5,
          opacity: 1
        },
        hover: {
          opacity: 0.7
        }
      },
      animation: {
        enter: {
          type: 'barBoxplotScaleIn',
          duration: 1000
        },
        state: {
          duration: 500
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## RipplePoint Glyph

RipplePoint is a point glyph with a ripple effect, typically used to emphasize a specific data point or indicate data changes at a specific location. In map visualization and time series analysis, RipplePoint glyphs can express the spatial distribution of data and the dynamic process of data change. Application scenarios include showing the spread of earthquakes, epidemics, news events, etc.

The glyphType of the "RipplePoint" glyph is `'ripplePoint'`. Before using the "RipplePoint" glyph, you need to execute `registerRippleGlyph()` to register the glyph. Example:
![RipplePoint Glyph](TODO)

<div class="examples-ref-container" id="examples-ref-ripple" data-path="glyph-mark/ripple">
</div>

```javascript livedemo template=vgrammar
VGrammar.registerRippleGlyph();

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },
  signals: [
    {
      id: 'test',
      value: 'testValue'
    }
  ],

  data: [
    {
      id: 'table',
      values: [
        {
          time: '2:00',
          value: 8
        },
        {
          time: '4:00',
          value: 9
        },
        {
          time: '6:00',
          value: 11
        },
        {
          time: '8:00',
          value: 14
        },
        {
          time: '10:00',
          value: 16
        },
        {
          time: '12:00',
          value: 17
        },
        {
          time: '14:00',
          value: 17
        },
        {
          time: '16:00',
          value: 16
        },
        {
          time: '18:00',
          value: 15
        }
      ]
    },
    {
      id: 'normalData',
      source: 'table',
      transform: [
        {
          type: 'filter',
          callback: (datum, params) => {
            return datum.time !== '16:00';
          },
          dependency: ['test']
        }
      ]
    },
    {
      id: 'highlightData',
      source: 'table',
      transform: [
        {
          type: 'filter',
          callback: (datum, params) => {
            return datum.time === '16:00';
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xScale',
      type: 'point',
      domain: { data: 'table', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.5,
      round: true
    },
    {
      id: 'yScale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xScale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      encode: {
        update: (datum, element, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yScale',
      tickCount: 5,
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: 0, y: -params.viewBox.height() },
            verticalFactor: -1
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'line',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xScale', field: 'time' },
          y: { scale: 'yScale', field: 'value' },
          stroke: '#6690F2',
          lineWidth: 2
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'normalData' },
      encode: {
        update: {
          x: { scale: 'xScale', field: 'time' },
          y: { scale: 'yScale', field: 'value' },
          size: 30,
          fill: '#6690F2'
        }
      }
    },
    {
      type: 'glyph',
      glyphType: 'ripplePoint',
      from: { data: 'highlightData' },
      encode: {
        update: {
          x: { scale: 'xScale', field: 'time' },
          y: { scale: 'yScale', field: 'value' },
          size: 30,
          fill: '#6690F2',
          ripple: 0
        }
      },
      animation: {
        enter: {
          channel: {
            ripple: { from: 0, to: 1 }
          },
          easing: 'linear',
          loop: true
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Wave Glyph

The wave glyph is a glyph that simulates fluctuations and is used to express data fluctuations over time. In fields such as stock trading and weather forecasting, wave glyphs can display data fluctuation trends and periodic changes. Application scenarios include displaying stock prices and temperature/precipitation fluctuations.

The glyphType of the "Wave" glyph is `'wave'`. Before using the "Wave" glyph, you need to execute `registerWaveGlyph()` to register the glyph. Example:

<div class="examples-ref-container" id="examples-ref-wave" data-path="glyph-mark/wave">
</div>

```javascript livedemo template=vgrammar
VGrammar.registerWaveGlyph();

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },

  data: [
    {
      id: 'table',
      values: [{ value: 0.35 }]
    }
  ],

  signals: [
    {
      id: 'size',
      update: (value, params) => {
        return Math.min(params.viewWidth, params.viewHeight);
      },
      dependency: ['viewWidth', 'viewHeight', 'padding']
    }
  ],

  scales: [
    {
      id: 'yScale',
      type: 'linear',
      domain: [0, 1],
      range: (scale, params) => {
        return [params.size, 0];
      },
      dependency: ['size']
    }
  ],

  marks: [
    {
      type: 'group',
      clip: true,
      encode: {
        update: (datum, element, params) => {
          const size = params.size;
          const arc = VRender.createArc({
            x: size / 2,
            y: size / 2,
            outerRadius: size / 2,
            innerRadius: 0,
            startAngle: 0,
            endAngle: Math.PI * 2,
            fill: true
          });
          return {
            x: (params.viewBox.x1 + params.viewBox.x2) / 2 - size / 2,
            y: (params.viewBox.y1 + params.viewBox.y2) / 2 - size / 2,
            width: size,
            height: size,
            stroke: '#6690F2',
            lineWidth: 2,
            fillOpacity: 0.7,
            path: [arc]
          };
        }
      },
      dependency: ['viewBox', 'size'],

      marks: [
        {
          type: 'glyph',
          glyphType: 'wave',
          from: { data: 'table' },
          encode: {
            update: {
              y: { scale: 'yScale', field: 'value' },
              height: 1000,
              fill: '#6690F2',
              wave: 0
            }
          },
          animation: {
            enter: {
              channel: {
                wave: { from: 0, to: 1 }
              },
              duration: 2000,
              easing: 'linear',
              loop: true
            }
          }
        },
        {
          type: 'text',
          from: { data: 'table' },
          encode: {
            update: (datum, element, params) => {
              return {
                x: params.size / 2,
                y: params.size / 2,
                text: `${(datum.value * 100).toFixed()}%`,
                fontSize: 60,
                fontWeight: 'bold',
                textBaseline: 'middle',
                textAlign: 'center',
                fill: '#6690F2',
                stroke: '#fff'
              };
            }
          },
          dependency: ['size']
        }
      ]
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## LinkPath Glyph

The LinkPath glyph is a glyph used to represent connections between data, commonly used to represent network relationships, spatial relationships, etc. In visualizations of social networks, transportation, and knowledge graphs, LinkPath glyphs can represent relationships and propagate processes between data. Application scenarios include displaying relationships between users, goods delivery, etc.

The glyphType of the "LinkPath" glyph is `'linkPath'`. Before using the "LinkPath" glyph, you need to execute `registerLinkPathGlyph()` to register the glyph. Example:

<div class="examples-ref-container" id="examples-ref-link-path" data-path="glyph-mark/link-path">
</div>

```javascript livedemo template=vgrammar
VGrammarSankey.registerSankeyTransforms();
VGrammar.registerLinkPathGlyph();

const spec = {
  padding: { top: 30, right: 5, bottom: 30, left: 5 },

  data: [
    {
      id: 'energy',
      values: {
        nodes: [
          { name: "Agricultural 'waste'" },
          { name: 'Bio-conversion' },
          { name: 'Liquid' },
          { name: 'Losses' },
          { name: 'Solid' },
          { name: 'Gas' },
          { name: 'Biofuel imports' },
          { name: 'Biomass imports' },
          { name: 'Coal imports' },
          { name: 'Coal' },
          { name: 'Coal reserves' },
          { name: 'District heating' },
          { name: 'Industry' },
          { name: 'Heating and cooling - commercial' },
          { name: 'Heating and cooling - homes' },
          { name: 'Electricity grid' },
          { name: 'Over generation / exports' },
          { name: 'H2 conversion' },
          { name: 'Road transport' },
          { name: 'Agriculture' },
          { name: 'Rail transport' },
          { name: 'Lighting & appliances - commercial' },
          { name: 'Lighting & appliances - homes' },
          { name: 'Gas imports' },
          { name: 'Ngas' },
          { name: 'Gas reserves' },
          { name: 'Thermal generation' },
          { name: 'Geothermal' },
          { name: 'H2' },
          { name: 'Hydro' },
          { name: 'International shipping' },
          { name: 'Domestic aviation' },
          { name: 'International aviation' },
          { name: 'National navigation' },
          { name: 'Marine algae' },
          { name: 'Nuclear' },
          { name: 'Oil imports' },
          { name: 'Oil' },
          { name: 'Oil reserves' },
          { name: 'Other waste' },
          { name: 'Pumped heat' },
          { name: 'Solar PV' },
          { name: 'Solar Thermal' },
          { name: 'Solar' },
          { name: 'Tidal' },
          { name: 'UK land based bioenergy' },
          { name: 'Wave' },
          { name: 'Wind' }
        ],
        links: [
          { source: 0, target: 1, value: 124.729 },
          { source: 1, target: 2, value: 0.597 },
          { source: 1, target: 3, value: 26.862 },
          { source: 1, target: 4, value: 280.322 },
          { source: 1, target: 5, value: 81.144 },
          { source: 6, target: 2, value: 35 },
          { source: 7, target: 4, value: 35 },
          { source: 8, target: 9, value: 11.606 },
          { source: 10, target: 9, value: 63.965 },
          { source: 9, target: 4, value: 75.571 },
          { source: 11, target: 12, value: 10.639 },
          { source: 11, target: 13, value: 22.505 },
          { source: 11, target: 14, value: 46.184 },
          { source: 15, target: 16, value: 104.453 },
          { source: 15, target: 14, value: 113.726 },
          { source: 15, target: 17, value: 27.14 },
          { source: 15, target: 12, value: 342.165 },
          { source: 15, target: 18, value: 37.797 },
          { source: 15, target: 19, value: 4.412 },
          { source: 15, target: 13, value: 40.858 },
          { source: 15, target: 3, value: 56.691 },
          { source: 15, target: 20, value: 7.863 },
          { source: 15, target: 21, value: 90.008 },
          { source: 15, target: 22, value: 93.494 },
          { source: 23, target: 24, value: 40.719 },
          { source: 25, target: 24, value: 82.233 },
          { source: 5, target: 13, value: 0.129 },
          { source: 5, target: 3, value: 1.401 },
          { source: 5, target: 26, value: 151.891 },
          { source: 5, target: 19, value: 2.096 },
          { source: 5, target: 12, value: 48.58 },
          { source: 27, target: 15, value: 7.013 },
          { source: 17, target: 28, value: 20.897 },
          { source: 17, target: 3, value: 6.242 },
          { source: 28, target: 18, value: 20.897 },
          { source: 29, target: 15, value: 6.995 },
          { source: 2, target: 12, value: 121.066 },
          { source: 2, target: 30, value: 128.69 },
          { source: 2, target: 18, value: 135.835 },
          { source: 2, target: 31, value: 14.458 },
          { source: 2, target: 32, value: 206.267 },
          { source: 2, target: 19, value: 3.64 },
          { source: 2, target: 33, value: 33.218 },
          { source: 2, target: 20, value: 4.413 },
          { source: 34, target: 1, value: 4.375 },
          { source: 24, target: 5, value: 122.952 },
          { source: 35, target: 26, value: 839.978 },
          { source: 36, target: 37, value: 504.287 },
          { source: 38, target: 37, value: 107.703 },
          { source: 37, target: 2, value: 611.99 },
          { source: 39, target: 4, value: 56.587 },
          { source: 39, target: 1, value: 77.81 },
          { source: 40, target: 14, value: 193.026 },
          { source: 40, target: 13, value: 70.672 },
          { source: 41, target: 15, value: 59.901 },
          { source: 42, target: 14, value: 19.263 },
          { source: 43, target: 42, value: 19.263 },
          { source: 43, target: 41, value: 59.901 },
          { source: 4, target: 19, value: 0.882 },
          { source: 4, target: 26, value: 400.12 },
          { source: 4, target: 12, value: 46.477 },
          { source: 26, target: 15, value: 525.531 },
          { source: 26, target: 3, value: 787.129 },
          { source: 26, target: 11, value: 79.329 },
          { source: 44, target: 15, value: 9.452 },
          { source: 45, target: 1, value: 182.01 },
          { source: 46, target: 15, value: 19.013 },
          { source: 47, target: 15, value: 289.366 }
        ]
      },
      transform: [
        {
          type: 'sankey',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          nodeAlign: 'justify',
          nodeWidth: 10,
          nodeGap: 8,
          minNodeHeight: 4
        }
      ]
    },
    {
      id: 'nodes',
      source: 'energy',
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
      source: 'energy',
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
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'nodes', field: 'index' },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
      ]
    }
  ],

  marks: [
    {
      type: 'group',
      marks: [
        {
          type: 'rect',
          from: { data: 'nodes' },
          encode: {
            update: {
              x: { field: 'x0' },
              x1: { field: 'x1' },
              y: { field: 'y0' },
              y1: { field: 'y1' },
              fill: { scale: 'colorScale', field: 'index' }
            }
          }
        },
        {
          type: 'glyph',
          glyphType: 'linkPath',
          from: { data: 'links' },
          encode: {
            update: {
              x0: { field: 'x0' },
              x1: { field: 'x1' },
              y0: { field: 'y0' },
              y1: { field: 'y1' },
              thickness: { field: 'thickness' },
              round: true,
              fill: { scale: 'colorScale', field: 'source' },
              fillOpacity: 0.5
            },
            hover: {
              fillOpacity: 0.3
            }
          },
          animation: {
            enter: {
              type: 'linkPathGrowIn',
              easing: 'linear',
              duration: 1000
            },
            state: {
              duration: 500
            }
          }
        }
      ]
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## TreePath Glyph

TreePath has a similar meaning to LinkPath, used to display connections without width

<div class="examples-ref-container" id="examples-ref-tree-path" data-path="hierarchy/tree">
</div>

```javascript livedemo template=vgrammar
VGrammarHierarchy.registerTreeTransforms();
VGrammar.registerTreePathGlyph();

const flattenNodes = VGrammarHierarchy.flattenNodes;
const flattenTreeLinks = VGrammarHierarchy.flattenTreeLinks;

const spec = {
  padding: { top: 30, right: 10, bottom: 80, left: 10 },

  data: [
    {
      id: 'table',
      values: [
        {
          name: 'root',
          children: [
            {
              name: '品牌 A',
              children: [
                {
                  name: '东北',
                  children: [
                    {
                      name: '办公用品',
                      value: 824
                    },
                    {
                      name: '家具',
                      value: 920
                    },
                    {
                      name: '电子设备',
                      value: 936
                    }
                  ]
                },
                {
                  name: '中南',
                  children: [
                    {
                      name: '办公用品',
                      value: 1270
                    },
                    {
                      name: '家具',
                      value: 1399
                    },
                    {
                      name: '电子设备',
                      value: 1466
                    }
                  ]
                },
                {
                  name: '华东',
                  children: [
                    {
                      name: '办公用品',
                      value: 1408
                    },
                    {
                      name: '家具',
                      value: 1676
                    },
                    {
                      name: '电子设备',
                      value: 1559
                    }
                  ]
                },
                {
                  name: '华北',
                  children: [
                    {
                      name: '办公用品',
                      value: 745
                    },
                    {
                      name: '家具',
                      value: 919
                    },
                    {
                      name: '电子设备',
                      value: 781
                    }
                  ]
                },
                {
                  name: '西北',
                  children: [
                    {
                      name: '办公用品',
                      value: 267
                    },
                    {
                      name: '家具',
                      value: 316
                    },
                    {
                      name: '电子设备',
                      value: 230
                    }
                  ]
                },
                {
                  name: '西南',
                  children: [
                    {
                      name: '办公用品',
                      value: 347
                    },
                    {
                      name: '家具',
                      value: 501
                    },
                    {
                      name: '电子设备',
                      value: 453
                    }
                  ]
                }
              ]
            },
            {
              name: '品牌 B',
              children: [
                {
                  name: '东北',
                  children: [
                    {
                      name: '办公用品',
                      value: 824
                    },
                    {
                      name: '家具',
                      value: 920
                    },
                    {
                      name: '电子设备',
                      value: 936
                    }
                  ]
                },
                {
                  name: '中南',
                  children: [
                    {
                      name: '办公用品',
                      value: 1270
                    },
                    {
                      name: '家具',
                      value: 1399
                    },
                    {
                      name: '电子设备',
                      value: 1466
                    }
                  ]
                },
                {
                  name: '华东',
                  children: [
                    {
                      name: '办公用品',
                      value: 1408
                    },
                    {
                      name: '家具',
                      value: 1676
                    },
                    {
                      name: '电子设备',
                      value: 1559
                    }
                  ]
                },
                {
                  name: '华北',
                  children: [
                    {
                      name: '办公用品',
                      value: 745
                    },
                    {
                      name: '家具',
                      value: 919
                    },
                    {
                      name: '电子设备',
                      value: 781
                    }
                  ]
                },
                {
                  name: '西北',
                  children: [
                    {
                      name: '办公用品',
                      value: 267
                    },
                    {
                      name: '家具',
                      value: 316
                    },
                    {
                      name: '电子设备',
                      value: 230
                    }
                  ]
                },
                {
                  name: '西南',
                  children: [
                    {
                      name: '办公用品',
                      value: 347
                    },
                    {
                      name: '家具',
                      value: 501
                    },
                    {
                      name: '电子设备',
                      value: 453
                    }
                  ]
                }
              ]
            },
            {
              name: '品牌 C',
              children: [
                {
                  name: '东北',
                  children: [
                    {
                      name: '办公用品',
                      value: 824
                    },
                    {
                      name: '家具',
                      value: 920
                    },
                    {
                      name: '电子设备',
                      value: 936
                    }
                  ]
                },
                {
                  name: '中南',
                  children: [
                    {
                      name: '办公用品',
                      value: 1270
                    },
                    {
                      name: '家具',
                      value: 1399
                    },
                    {
                      name: '电子设备',
                      value: 1466
                    }
                  ]
                },
                {
                  name: '华东',
                  children: [
                    {
                      name: '办公用品',
                      value: 1408
                    },
                    {
                      name: '家具',
                      value: 1676
                    },
                    {
                      name: '电子设备',
                      value: 1559
                    }
                  ]
                },
                {
                  name: '华北',
                  children: [
                    {
                      name: '办公用品',
                      value: 745
                    },
                    {
                      name: '家具',
                      value: 919
                    },
                    {
                      name: '电子设备',
                      value: 781
                    }
                  ]
                },
                {
                  name: '西北',
                  children: [
                    {
                      name: '办公用品',
                      value: 267
                    },
                    {
                      name: '家具',
                      value: 316
                    },
                    {
                      name: '电子设备',
                      value: 230
                    }
                  ]
                },
                {
                  name: '西南',
                  children: [
                    {
                      name: '办公用品',
                      value: 347
                    },
                    {
                      name: '家具',
                      value: 501
                    },
                    {
                      name: '电子设备',
                      value: 453
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      transform: [
        {
          type: 'tree',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          alignType: 'leaf',
          direction: 'vertical'
        }
      ]
    },

    {
      id: 'flattenData',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            const res = [];
            flattenNodes(datum, res);

            return res;
          }
        }
      ]
    },

    {
      id: 'pathData',
      source: 'table',
      transform: [
        {
          type: 'map',
          all: true,
          callback: datum => {
            const res = [];
            flattenTreeLinks(datum, res);
            return res;
          }
        }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',
      dependency: ['flattenData'],
      domain: (scale, params) => {
        const data = params.flattenData;

        return (data || []).map(d => d.datum[d.datum.length - 1].name);
      },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
      ]
    }
  ],

  marks: [
    {
      type: 'group',
      dependency: ['viewBox'],
      encode: {
        update: (datum, el, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1
          };
        }
      },

      marks: [
        {
          type: 'glyph',
          glyphType: 'treePath',
          from: { data: 'pathData' },
          key: 'key',
          encode: {
            update: {
              direction: 'vertical',
              // pathType: 'line',
              x0: { field: 'x0' },
              x1: { field: 'x1' },
              y0: { field: 'y0' },
              y1: { field: 'y1' },
              thickness: 1,
              lineWidth: 1,
              // round: true,
              stroke: '#333'
            }
          }
        },

        {
          type: 'circle',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              radius: 10,
              lineWidth: datum => {
                return datum.depth % 2 ? 1 : 2;
              },
              stroke: '#fff',
              fill: (datum, el, params) => {
                const scale = params.colorScale;

                return scale.scale(datum.datum[datum.datum.length - 1].name);
              }
            }
          }
        },

        {
          type: 'text',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          dependency: ['colorScale'],
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y', offset: 10 },
              textAlign: datum => {
                return datum.depth === 0 || datum.isLeaf ? 'start' : 'center';
              },
              textBaseline: 'middle',
              text: datum => {
                return datum.datum[datum.datum.length - 1].name;
              },
              angle: datum => {
                return datum.isLeaf ? Math.PI / 2 : 0;
              },
              maxLineWidth: datum => {
                return 200;
              },
              fill: '#333'
            }
          }
        }
      ]
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

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

```javascript livedemo template=vgrammar
VGrammar.Factory.registerGlyph('candle', {
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

const spec = {
  padding: { top: 30, right: 40, bottom: 30, left: 40 },

  data: [
    {
      id: 'table',
      values: [
        {
          time: '02-11',
          start: 6.91,
          max: 7.31,
          min: 6.48,
          end: 7.18
        },
        {
          time: '02-12',
          start: 7.01,
          max: 7.14,
          min: 6.8,
          end: 6.85
        },
        {
          time: '02-13',
          start: 7.05,
          max: 7.2,
          min: 6.8,
          end: 6.9
        },
        {
          time: '02-14',
          start: 6.98,
          max: 7.27,
          min: 6.84,
          end: 7.18
        },
        {
          time: '02-15',
          start: 7.09,
          max: 7.44,
          min: 6.93,
          end: 7.17
        },
        {
          time: '02-16',
          start: 7.1,
          max: 7.17,
          min: 6.82,
          end: 7
        },
        {
          time: '02-17',
          start: 7.01,
          max: 7.5,
          min: 7.01,
          end: 7.46
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xScale',
      type: 'point',
      domain: { data: 'table', field: 'time' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.5,
      round: true
    },
    {
      id: 'yScale',
      type: 'linear',
      domain: { data: 'table', field: ['start', 'end', 'min', 'max'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      }
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xScale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      encode: {
        update: (datum, element, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yScale',
      tickCount: 5,
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: 0, y: -params.viewBox.height() },
            verticalFactor: -1
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xScale',
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      },
      dependency: ['viewBox']
    },
    {
      type: 'glyph',
      from: { data: 'table' },
      glyphType: 'candle',
      encode: {
        update: {
          x: { scale: 'xScale', field: 'time' },
          max: { scale: 'yScale', field: 'max' },
          start: { scale: 'yScale', field: 'start' },
          end: { scale: 'yScale', field: 'end' },
          min: { scale: 'yScale', field: 'min' },

          boxWidth: 60,
          lineWidth: 2,
          stroke: (datum, element, params) => {
            return datum.end >= datum.start ? '#eb5454' : '#46b262';
          },
          fill: (datum, element, params) => {
            return datum.end >= datum.start ? '#eb5454' : '#46b262';
          }
        },
        hover: {
          stroke: '#000'
        }
      },
      animation: {
        state: {
          duration: 500
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
