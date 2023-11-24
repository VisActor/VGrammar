# 组合图元

VGrammar 中的组合图元（Glyph）是通过任意基础图元组合得到的图元，用于描述某一复杂的图形效果。

所有组合图元的图元类型均为 `'glyph'`，开发者需要配置 `glyphType` 以声明其为何种类型的组合图元：

```js
{
  type: 'glyph',
  glyphType: 'boxplot',
  encode: {}
}
```

与基础图元相比，组合图元具有特殊的视觉通道以及相应的动画逻辑。除去 VGrammar 内置提供的部分组合图元，开发者还可以注册自定义的组合图元以创建更为丰富的可视化效果

## 箱形图元 (Boxplot)

箱形图，又称箱线图，是一种用于展示一组数据分布情况的统计图。它能显示出一组数据的最大值、最小值、中位数、上四分位数（Q1）、下四分位数（Q3），使我们可以从图表中快速了解数据的分布况。使用场景包括对比各个类别的数据分布，识别异常值等。

VGrammar 提供了两种箱形图元以支持箱形图可视化：

- boxplot: 普通箱形图元，glyphType 为 `'boxplot'`。在使用普通箱形图元之前，需要执行 `registerBoxplotGlyph()` 对图元进行注册。示例：

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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
- barBoxplot: 变种箱形图元，glyphType 为 `'barBoxplot'`。在使用变种箱形图元之前，需要执行 `registerBarBoxplotGlyph()` 对图元进行注册。示例：

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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
## 涟漪点图元 (RipplePoint)

涟漪点图元是一种具有涟漪效果的点图元，通常用于强调某个特定的数据点或者表示某个位置上的数据变化。在地图可视化、时间序列分析等场景中，涟漪点图元可以表达数据的空间分布、数据变化的动态过程等。使用场景包括表示地震、疫情、新闻事件等的传播过程。

涟漪点图元 glyphType 为 `'ripplePoint'`。
在使用涟漪点图元之前，需要执行 `registerRippleGlyph()` 对图元进行注册。示例：
![涟漪点图元](TODO)

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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
## 波浪图元 (Wave)

波浪图元是一种模拟波动的图元，用于表现数据随时间的波动情况。在股票交易、天气预报等领域，波浪图元可以展示数据的波动趋势、周期性变化等。使用场景包括展示股票价格、气温/降水量的波动。

波浪图元 glyphType 为 `'wave'`。
在使用波浪图元之前，需要执行 `registerWaveGlyph()` 对图元进行注册。示例：

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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
## 连线图元 (LinkPath)

连线图元是一种用于表示数据间连接的图元，常用于表示网络关系、空间联系等。社交网络、物流运输、知图谱等领域的可视化中，连线图元可以表示数据间的连接关系、传播过程等。使用场景包括展示用户之间的关注关系、货物的传递等。

连线图元 glyphType 为 `'linkPath'`。
在使用连线图元之前，需要执行 `registerLinkPathGlyph()` 对图元进行注册。示例：

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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
## 树线图元(TreePath)

TreePath 和 LinkPath 的含义差不多，用于展示没有宽度的连线

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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
## 小提琴图元(Violin)

Violin 图元是箱型图元与概率密度图元的组合，一组数据统计以及概率密度分布情况。它包含数据的最大值、最小值、中位数、上四分位数（Q1）、下四分位数（Q3）以及概率密度分布。

小提琴图元 glyphType 为 `'violin'`。
在使用小提琴图元之前，需要执行 `registerViolinGlyph()` 对图元进行注册。示例：
![小提琴图元](TODO)

<div class="examples-ref-container" id="examples-ref-ripple" data-path="glyph-mark/violin">
</div>

```javascript livedemo template=vgrammar
VGrammar.registerViolinGlyph();

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
          value5: 500,
          density: [
            [0, 0],
            [100, 0.00005],
            [200, 0.0001],
            [300, 0.0001],
            [400, 0.0002],
            [500, 0.0003],
            [600, 0.0007],
            [700, 0.0008],
            [800, 0.0009],
            [900, 0.0008],
            [1000, 0.0008],
            [1200, 0.0006],
            [1300, 0.0005],
            [1400, 0.0004],
            [1500, 0.0003],
            [1600, 0.0003],
            [1700, 0.0002],
            [1800, 0.0001],
            [1900, 0.00005],
            [2000, 0]
          ]
        },
        {
          test: 'test1',
          value1: 1900,
          value2: 1000,
          value3: 400,
          value4: 300,
          value5: 100,
          density: [
            [-100, 0],
            [0, 0.0001],
            [100, 0.0002],
            [200, 0.0004],
            [300, 0.0006],
            [400, 0.0008],
            [500, 0.0007],
            [600, 0.0007],
            [700, 0.0006],
            [800, 0.0006],
            [900, 0.0005],
            [1000, 0.0005],
            [1200, 0.0004],
            [1300, 0.0003],
            [1400, 0.0002],
            [1500, 0.0002],
            [1600, 0.0003],
            [1700, 0.0004],
            [1800, 0.0003],
            [1900, 0.0002],
            [2000, 0.0001],
            [2100, 0]
          ]
        },
        {
          test: 'test2',
          value1: 1300,
          value2: 1200,
          value3: 200,
          value4: -100,
          value5: -500,
          density: [
            [-500, 0],
            [-400, 0.0001],
            [-300, 0.0002],
            [-200, 0.0004],
            [-100, 0.0008],
            [0, 0.0007],
            [100, 0.0003],
            [200, 0.0004],
            [300, 0.0003],
            [400, 0.0003],
            [500, 0.0003],
            [600, 0.0002],
            [700, 0.0002],
            [800, 0.0003],
            [900, 0.0004],
            [1000, 0.0002],
            [1200, 0.0003],
            [1300, 0.0004],
            [1400, 0.0005],
            [1500, 0.0006],
            [1600, 0.0003],
            [1700, 0.0002],
            [1800, 0.0001],
            [1900, 0.0001],
            [2000, 0]
          ]
        },
        {
          test: 'test3',
          value1: 1400,
          value2: 1000,
          value3: 900,
          value4: 800,
          value5: 500,
          density: [
            [0, 0],
            [100, 0],
            [200, 0],
            [300, 0.0001],
            [400, 0.0001],
            [500, 0.0002],
            [600, 0.0003],
            [700, 0.0007],
            [800, 0.0006],
            [900, 0.0006],
            [1000, 0.0002],
            [1200, 0.0001],
            [1300, 0]
          ]
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
      domain: [-800, 2500],
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
      glyphType: 'violin',
      encode: {
        update: {
          x: { scale: 'xScale', field: 'test' },
          max: { scale: 'yScale', field: 'value1' },
          q3: { scale: 'yScale', field: 'value2' },
          median: { scale: 'yScale', field: 'value3' },
          q1: { scale: 'yScale', field: 'value4' },
          min: { scale: 'yScale', field: 'value5' },
          density: { scale: 'yScale', field: 'density' },
          densitySize: 50,

          width: 10,
          size: 6,

          stroke: 'black',
          violinFill: { scale: 'colorScale', field: 'test' },
          opacity: 1
        },
        hover: {
          opacity: 0.7
        }
      },
      animation: {
        enter: {
          type: 'fadeIn',
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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
## 自定义组合图元

在 VGrammar 中，开发者不仅可以使用以上几种内置的组合图元，还可以通过组合现有的基本图元，自定义创建更丰富的可视化效果。

图元之间的组合核心在于视觉通道的组合。开发者可以通过 `Factory.registerGlyph()` 接口注册 glyph 类型并声明默认的视觉通道以及特定的视觉通道。默认情况下所有 glyph 图元的视觉通道都会应用于所有子图元中，开发者可以自由变更视觉通道在子图元中的应用逻辑，例如声明一个额外的 `color` 视觉通道并将其应用于子 rect 图元的 `fill` 通道以及子 rule 图元的 `stroke` 通道。

声明一个简单的 K 线图组合图元示例：

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

除此之外，开发者还可以通过 `registerAnimationType` 接口注册额外的动画类型以搭配 glyph 图元使用。

K 线图示例：

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

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```