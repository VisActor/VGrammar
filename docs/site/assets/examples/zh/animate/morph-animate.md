---
category: examples
group: animate
title: morph 动画
order: 60-2
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar/animate-morph-animate.gif
---

# morph 动画

全局形变动画，主要用于图表更新、切换等场景，用于转场效果

## 代码演示

```javascript livedemo template=vgrammar
const data = [
  {
    ratio: '7.95%',
    name: '广东',
    value: 21197
  },
  {
    ratio: '7.64%',
    name: '江苏',
    value: 20383
  },
  {
    ratio: '7.41%',
    name: '山东',
    value: 19764
  },
  {
    ratio: '7.28%',
    name: '河南',
    value: 19408
  },
  {
    ratio: '6.98%',
    name: '河北',
    value: 18608
  },
  {
    ratio: '5.2%',
    name: '浙江',
    value: 13860
  },
  {
    ratio: '5.19%',
    name: '四川',
    value: 13850
  },
  {
    ratio: '4.34%',
    name: '安徽',
    value: 11567
  },
  {
    ratio: '3.9%',
    name: '辽宁',
    value: 10387
  },
  {
    ratio: '3.61%',
    name: '陕西',
    value: 9629
  },
  {
    ratio: '3.25%',
    name: '山西',
    value: 8664
  },
  {
    ratio: '3.15%',
    name: '湖北',
    value: 8395
  },
  {
    ratio: '3.09%',
    name: '北京',
    value: 8241
  },
  {
    ratio: '2.78%',
    name: '湖南',
    value: 7424
  },
  {
    ratio: '2.62%',
    name: '黑龙江',
    value: 6984
  },
  {
    ratio: '2.23%',
    name: '云南',
    value: 5951
  },
  {
    ratio: '2.2%',
    name: '江西',
    value: 5858
  },
  {
    ratio: '2.18%',
    name: '重庆',
    value: 5819
  },
  {
    ratio: '2.18%',
    name: '上海',
    value: 5807
  },
  {
    ratio: '2.02%',
    name: '贵州',
    value: 5377
  },
  {
    ratio: '1.99%',
    name: '吉林',
    value: 5295
  },
  {
    ratio: '1.74%',
    name: '天津',
    value: 4629
  },
  {
    ratio: '1.73%',
    name: '广西',
    value: 4626
  },
  {
    ratio: '1.44%',
    name: '甘肃',
    value: 3840
  },
  {
    ratio: '1.33%',
    name: '新疆',
    value: 3546
  },
  {
    ratio: '0.54%',
    name: '宁夏',
    value: 1431
  },
  {
    ratio: '0.52%',
    name: '海南',
    value: 1388
  },
  {
    ratio: '0.33%',
    name: '青海',
    value: 887
  },
  {
    ratio: '0.21%',
    name: '西藏',
    value: 552
  },
  {
    ratio: '0.05%',
    name: '中国香港',
    value: 146
  },
  {
    ratio: '0.03%',
    name: '中国台湾',
    value: 92
  },
  {
    ratio: '0.02%',
    name: '澳门',
    value: 49
  }
];

const roseSpec = {
  padding: { top: 30, right: 30, bottom: 30, left: 30 },

  data: [
    {
      id: 'table',
      values: data
    }
  ],

  signals: [
    {
      id: 'polarValue',
      update: (signal, params) => {
        return {
          x: params.viewBox.x1 + params.viewBox.width() / 2,
          y: params.viewBox.y1 + params.viewBox.height() / 2,
          radius: Math.min(params.viewBox.width(), params.viewBox.height()) / 2
        };
      },
      dependency: ['viewBox']
    }
  ],

  scales: [
    {
      id: 'angleScale',
      type: 'point',
      domain: { data: 'table', field: 'name' },
      range: [0, Math.PI * 2],
      padding: 0.5
    },
    {
      id: 'radiusScale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      range: (scale, params) => [0, params.polarValue.radius],
      zero: true,
      dependency: 'polarValue'
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'angleScale',
      axisType: 'circle',
      encode: {
        update: (datum, element, params) => {
          return {
            center: { x: params.polarValue.x, y: params.polarValue.y },
            radius: params.polarValue.radius,
            grid: { visible: true }
          };
        }
      },
      dependency: 'polarValue'
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'radiusScale',
      tickCount: 5,
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.polarValue.x,
            y: params.polarValue.y,
            start: { x: 0, y: 0 },
            end: { x: params.polarValue.radius, y: 0 },
            grid: { visible: true, center: { x: 0, y: 0 }, type: 'circle', closed: true, sides: 10 }
          };
        }
      },
      dependency: 'polarValue'
    },
    {
      type: 'arc',
      from: { data: 'table' },
      morph: true,
      morphKey: 'dataMark',
      encode: {
        update: (datum, element, params) => {
          const angle = params.angleScale.scale(datum.name);
          const radius = params.radiusScale.scale(datum.value);
          return {
            x: params.polarValue.x,
            y: params.polarValue.y,
            startAngle: angle - 0.075,
            endAngle: angle + 0.075,
            outerRadius: radius,
            fill: '#6690F2'
          };
        }
      },
      dependency: ['polarValue', 'radiusScale', 'angleScale']
    }
  ]
};

const radarSpec = {
  padding: { top: 30, right: 30, bottom: 30, left: 30 },

  data: [
    {
      id: 'table',
      values: data
    }
  ],

  signals: [
    {
      id: 'polarValue',
      update: (signal, params) => {
        return {
          x: params.viewBox.x1 + params.viewBox.width() / 2,
          y: params.viewBox.y1 + params.viewBox.height() / 2,
          radius: Math.min(params.viewBox.width(), params.viewBox.height()) / 2
        };
      },
      dependency: ['viewBox']
    }
  ],

  scales: [
    {
      id: 'angleScale',
      type: 'point',
      domain: { data: 'table', field: 'name' },
      range: [0, Math.PI * 2],
      padding: 0.5
    },
    {
      id: 'radiusScale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      range: (scale, params) => [0, params.polarValue.radius],
      zero: true,
      dependency: 'polarValue'
    }
  ],

  coordinates: [
    {
      id: 'polarCoord',
      type: 'polar',
      origin: (coord, params) => {
        return { x: params.polarValue.x, y: params.polarValue.y };
      },
      dependency: ['polarValue']
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'angleScale',
      axisType: 'circle',
      encode: {
        update: (datum, element, params) => {
          return {
            center: { x: params.polarValue.x, y: params.polarValue.y },
            radius: params.polarValue.radius,
            grid: { visible: true }
          };
        }
      },
      dependency: 'polarValue'
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'radiusScale',
      tickCount: 5,
      encode: {
        update: (datum, element, params) => {
          return {
            x: params.polarValue.x,
            y: params.polarValue.y,
            start: { x: 0, y: 0 },
            end: { x: params.polarValue.radius, y: 0 },
            grid: { visible: true, center: { x: 0, y: 0 }, type: 'circle', closed: true, sides: 10 }
          };
        }
      },
      dependency: 'polarValue'
    },
    {
      type: 'line',
      from: { data: 'table' },
      coordinate: 'polarCoord',
      encode: {
        update: {
          r: { scale: 'radiusScale', field: 'value' },
          theta: { scale: 'angleScale', field: 'name' },
          curveType: 'linearClosed',
          stroke: '#6690F2'
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'table' },
      coordinate: 'polarCoord',
      morph: true,
      morphKey: 'dataMark',
      encode: {
        update: {
          r: { scale: 'radiusScale', field: 'value' },
          theta: { scale: 'angleScale', field: 'name' },
          size: 10,
          fill: '#6690F2'
        }
      }
    }
  ]
};

const funnelSpec = {
  padding: { top: 30, right: 30, bottom: 30, left: 30 },

  data: [
    {
      id: 'table',
      values: data,
      transform: [
        {
          type: 'funnel',
          field: 'value',
          isCone: false,
          asValueRatio: 'valueRatio',
          asNextValueRatio: 'nextValueRatio'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'lengthScale',
      type: 'linear',
      domain: [0, 1],
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      zero: true,
      nice: true
    },
    {
      id: 'heightScale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      round: true
    },
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'name' },
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
      type: 'polygon',
      from: { data: 'table' },
      morph: true,
      morphKey: 'dataMark',
      encode: {
        update: (datum, element, params) => {
          const currentLength = params.lengthScale.scale(datum.valueRatio);
          const nextLength = params.lengthScale.scale(datum.nextValueRatio);
          const height = params.heightScale.bandwidth();
          const currentX = params.viewBox.x1 + params.viewBox.width() / 2 - currentLength / 2;
          const currentX1 = params.viewBox.x1 + params.viewBox.width() / 2 + currentLength / 2;
          const nextX = params.viewBox.x1 + params.viewBox.width() / 2 - nextLength / 2;
          const nextX1 = params.viewBox.x1 + params.viewBox.width() / 2 + nextLength / 2;
          const y = params.heightScale.scale(datum.name);
          const y1 = y + height;

          const points = [
            { x: currentX, y: y },
            { x: currentX1, y: y },
            { x: nextX1, y: y1 },
            { x: nextX, y: y1 }
          ];

          const maxLength = params.lengthScale.scale(1);
          const deltaZ = (maxLength - currentLength) / 2;

          return {
            fill: params.colorScale.scale(datum.name),
            points: points,
            z: deltaZ
          };
        }
      },
      dependency: ['viewBox', 'lengthScale', 'heightScale', 'colorScale']
    }
  ]
};

const vGrammarView = new View({
  width: roseSpec.width,
  height: roseSpec.height,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(roseSpec);

vGrammarView.runAsync();

setTimeout(() => {
  vGrammarView.updateSpec(radarSpec);
  vGrammarView.runAsync({ morph: true });
}, 500);

setTimeout(() => {
  vGrammarView.updateSpec(funnelSpec);
  vGrammarView.runAsync({ morph: true });
}, 2000);

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```
