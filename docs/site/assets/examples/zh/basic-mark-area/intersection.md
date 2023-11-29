---
category: examples
group: basic-mark-area
title: 区间面积图
order: 2-4
cover: /vgrammar/preview/basic-mark-area-intersection_0.7.6.png
---

# 区间面积图

## 代码演示

```javascript livedemo template=vgrammar
const { createGroup, createLine, createText } = VRender;
const { Factory } = VGrammar;
const { getIntersectPoint, isNil } = VisUtil;

const intersectionTransform = (options, upstreamData) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }
  const [positiveColor, negativeColor] = options?.colors ?? ['red', 'green'];
  const intersectionLabels = options?.intersectionLabels;
  const regionLabels = options?.regionLabels;
  const attrs = upstreamData[0].getItemAttribute();
  const channel = attrs.some(entry => !isNil(entry.y1)) ? 'y' : 'x';
  const channel1 = `${channel}1`;
  const posChannel = channel === 'x' ? 'y' : 'x';

  const stops = [];
  const intersections = [];

  for (let i = 0, len = attrs.length; i < len; i++) {
    const cur = attrs[i];
    const next = attrs[i + 1];
    const channelVal = channel === 'x' ? cur.x : cur.y;
    const channel1Val = channel === 'x' ? cur.x1 : cur.y1;
    const color = channel1Val >= channelVal ? positiveColor : negativeColor;

    if (!isNil(cur[posChannel])) {
      if (stops.length === 0) {
        stops.push({ color, pos: cur[posChannel] });
      } else if (stops.length > 1) {
        stops[stops.length - 1].pos = cur[posChannel];
      }
    }

    if (cur && next && (cur[channel] - cur[channel1]) * (next[channel] - next[channel1]) < 0) {
      const cross =
        channel === 'x'
          ? getIntersectPoint([cur.x, cur.y], [next.x, next.y], [cur.x1, cur.y], [next.x1, next.y])
          : getIntersectPoint([cur.x, cur.y], [next.x, next.y], [cur.x, cur.y1], [next.x, next.y1]);
      let pos;
      if (cross && cross !== true && !isNil((pos = cross[posChannel === 'x' ? 0 : 1]))) {
        const nextColor = color === positiveColor ? negativeColor : positiveColor;

        intersections.push({ x: cross[0], y: cross[1] });
        stops.push({ color, pos: pos });
        stops.push({
          color: nextColor,
          pos: pos
        });
        stops.push({
          color: nextColor,
          pos: next[posChannel]
        });
      }
    }
  }

  if (intersections.length) {
    const gradient =
      channel === 'y'
        ? {
            gradient: 'linear',
            x0: 0,
            y0: 0.5,
            x1: 1,
            y1: 0.5
          }
        : {
            gradient: 'linear',
            x0: 0.5,
            y0: 0,
            x1: 0.5,
            y1: 1
          };
    const start = stops[0].pos;
    const totalSize = stops[stops.length - 1].pos - stops[0].pos;

    gradient.stops = stops.map(stop => {
      return {
        color: stop.color,
        offset: (stop.pos - start) / totalSize
      };
    });

    upstreamData[0].setItemAttributes(
      attrs.map(entry => ({
        fill: gradient
      }))
    );
  }

  if (intersectionLabels && intersectionLabels.length) {
    const mark = upstreamData[0].mark;
    const graphicItem = mark.graphicItem;
    const labels = graphicItem.findChildrenByName('intersection-label');

    for (let i = 0, count = Math.max(labels.length, intersections.length); i < count; i++) {
      const point = intersections[i];
      const label = labels[i];

      if (point && label && intersectionLabels[i]) {
        // update label
        label.setAttributes({
          x: point.x,
          y: point.y
        });
        label.getElementsByType('text')[0].setAttributes({
          text: intersectionLabels[i]
        });
      } else if (point && intersectionLabels[i]) {
        // create label
        const group = createGroup({
          x: point.x,
          y: point.y
        });
        group.name = 'intersection-label';
        const line = createLine({
          points: [
            { x: 0, y: 10 },
            { x: 0, y: 50 }
          ],
          stroke: '#999'
        });
        const text = createText({
          x: 10,
          y: 60,
          textAlign: 'center',
          textBaseline: 'top',
          text: intersectionLabels[i],
          fill: '#666'
        });
        group.appendChild(line);
        group.appendChild(text);
        graphicItem.appendChild(group);
      } else if (label) {
        // remove label
        graphicItem.removeChild(label);
      }
    }
  }

  return upstreamData;
};

Factory.registerTransform('areaIntersection', { transform: intersectionTransform, markPhase: 'afterEncodeItems' });

const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        { year: 1700, exports: 35, imports: 70 },
        { year: 1710, exports: 59, imports: 81 },
        { year: 1720, exports: 76, imports: 96 },
        { year: 1730, exports: 65, imports: 97 },
        { year: 1740, exports: 67, imports: 93 },
        { year: 1750, exports: 79, imports: 90 },
        { year: 1760, exports: 115, imports: 79 },
        { year: 1770, exports: 163, imports: 85 },
        { year: 1780, exports: 185, imports: 93 }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'point',
      domain: { data: 'table', field: 'year' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: ['exports', 'imports'] },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      zero: true
    }
  ],

  interactions: [
    {
      type: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'x',
      dependencies: ['viewBox'],
      attributes: (scale, elment, params) => {
        return {
          start: { y: params.viewBox.y1 },
          end: { y: params.viewBox.y2 }
        };
      }
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      tickCount: -1,
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },

    {
      type: 'area',
      from: { data: 'table' },
      dependency: ['yscale'],
      transform: [
        {
          type: 'areaIntersection',
          colors: ['#6690F2', '#70D6A3'],
          intersectionLabels: [
            ['1755 年在印度周边', '建立诸多殖民地与附属国，', '垄断出口贸易，导致', '出品总额激增。']
          ]
        }
      ],
      encode: {
        enter: {
          fill: '#6690F2',
          fillOpacity: 0.3
        },
        update: {
          x: { scale: 'xscale', field: 'year' },
          y: { scale: 'yscale', field: 'exports' },
          y1: { scale: 'yscale', field: 'imports' }
        },
        hover: {
          fill: 'red'
        }
      }
    },
    {
      type: 'line',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        enter: {
          stroke: '#6690F2',
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'year' },
          y: { scale: 'yscale', field: 'exports' }
        },
        hover: {
          stroke: 'red'
        }
      }
    },
    {
      type: 'line',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        enter: {
          stroke: '#70D6A3',
          lineWidth: 2
        },
        update: {
          x: { scale: 'xscale', field: 'year' },
          y: { scale: 'yscale', field: 'imports' }
        },
        hover: {
          stroke: 'red'
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

## 相关教程
