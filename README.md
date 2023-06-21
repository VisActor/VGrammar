<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VGrammar</h1>
</div>

<div align="center">

VGrammar, not only generate charts, but also provide data visualization tools.

<p align="center">
  <a href="">Introduction</a> •
  <a href="">Demo</a> •
  <a href="">Tutorial</a> •
  <a href="">API</a>•
  <a href="">Cross-Platform</a>
</p>

![image test](https://github.com/visactor/vchart/actions/workflows/bug-server.yml/badge.svg)
![unit test](https://github.com/visactor/vchart/actions/workflows/unit-test.yml/badge.svg)
[![npm Version](https://img.shields.io/npm/v/@visactor/vgrammar.svg)](https://www.npmjs.com/package/@visactor/vgrammar)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vgrammar.svg)](https://www.npmjs.com/package/@visactor/vgrammar)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vgrammar/blob/main/LICENSE)

</div>

<div align="center">

English| [简体中文](./README.zh-CN.md)

</div>

<div align="center">

（video）

</div>

# Introduction

VGrammar is a visual grammar library based on visual rendering engine [VRender](https://github.com/VisActor/VRender). The core capabilities are as follows:

1. Easy to Use by Default: VGrammar features a concise syntax, comprehensive interface, rich component library, and simplified development process.
2. Rich in Capabilities: VGrammar provides extensive capabilities for chart definition, animation arrangement, artistic expression, and complete coverage of various needs.
3. Flexible and Extensible: VGrammar offers flexible extension options, including custom rendering of graphical elements, data mapping, automatic layout, and effortless expansion possibilities.

# Repo Intro

This repository includes the following packages:

1. VGrammar: The main package of VGrammar

# Usage

## Installation

[npm package](https://www.npmjs.com/package/@visactor/vgrammar)

```bash
// npm
npm install @visactor/vgrammar

// yarn
yarn add @visactor/vgrammar
```

## Quick Start

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

##

[More demos and detailed tutorials](https://visactor.io/vgrammar)

# Related Links

- [Official website](https://visactor.io/vgrammar)

# Ecosystem

| Project                                                     | Description                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [VChart](https://visactor.io/vchart)                        | A charts lib based on [VisActor/VGrammar](https://visactor.io/vgrammar)                |
| [React Component Library](https://visactor.io/react-vchart) | A React chart component library based on [VisActor/VChart](https://visactor.io/vchart) |
| [AI-generated Components](https://visactor.io/ai-vchart)    | AI-generated chart component.                                                          |

# Contribution

If you would like to contribute, please read the [Code of Conduct ](./CODE_OF_CONDUCT.md) and [ Guide](./CONTRIBUTING.zh-CN.md) first。

Small streams converge to make great rivers and seas!

<a href="https://github.com/visactor/vgrammar/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vgrammar" /></a>

# License

[MIT License](./LICENSE)
