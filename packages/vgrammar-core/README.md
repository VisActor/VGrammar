# @visactor/vgrammar

## Description

@visactor/vgrammar is the core package of VGrammar, which is a visual grammar library based on visual rendering engine [VRender](https://github.com/VisActor/VRender).

## Usage

### Installation

[npm package](https://www.npmjs.com/package/@visactor/vgrammar)

```bash
// npm
npm install @visactor/vgrammar

// yarn
yarn add @visactor/vgrammar
```

### Quick Start

```javascript
import { View } from '@visactor/vgrammar';

const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },
  data: [
    {
      id: 'table',
      values: [
        {
          name: 'A',
          value: 214480
        },
        {
          name: 'B',
          value: 155506
        },
        {
          name: 'C',
          value: 100764
        },
        {
          name: 'D',
          value: 92715
        }
      ]
    }
  ],
  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
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
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
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
      type: 'component',
      componentType: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { y: params.viewBox.y1 },
            rectStyle: { height: params.viewBox.height() }
          };
        }
      }
    },
    {
      type: 'rect',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'value' },
          y1: {
            callback: (datum, element, params) => {
              return params.yscale.scale(params.yscale.domain()[0]);
            },
            dependency: ['yscale']
          },
          fill: '#6690F2'
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  width: spec.width,
  height: spec.height,
  container: 'chart',
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();
```
