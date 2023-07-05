<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VGrammar</h1>
</div>

<div align="center">

VGrammar，不只是生成万千图表的可视化语法，更是化枯燥为神奇的数据魔法师。

<p align="center">
  <a href="">简介</a> •
  <a href="">demo</a> •
  <a href="">教程</a> •
  <a href="">API</a>•
  <a href="">跨端</a>
</p>

![image test](https://github.com/visactor/vchart/actions/workflows/bug-server.yml/badge.svg?branch=main)
![unit test](https://github.com/visactor/vchart/actions/workflows/unit-test.yml/badge.svg?branch=main)
[![npm Version](https://img.shields.io/npm/v/@visactor/vgrammar.svg)](https://www.npmjs.com/package/@visactor/vgrammar)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vgrammar.svg)](https://www.npmjs.com/package/@visactor/vgrammar)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vgrammar/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | 简体中文

</div>

<div align="center">

（演示视频）

</div>

# 简介

VGrammar 是 VisActor 可视化体系中的可视化语法库，基于可视化渲染引擎 [VRender](https://github.com/VisActor/VRender) 进行组件封装。核心能力如下：

1. 默认好用：语法简洁，接口完备，组件丰富，开发简单；
2. 能力丰富：图表定义，动画编排，艺术表达，完整覆盖；
3. 灵活扩展：图元渲染，数据映射，自动布局，轻松扩展；

# 仓库简介

本仓库包含如下 package

1. VGrammar: 图形语法

# 使用

## 安装

[npm package](https://www.npmjs.com/package/@visactor/vgrammar)

```bash
// npm
npm install @visactor/vgrammar

// yarn
yarn add @visactor/vgrammar
```

## 快速上手

```javascript
const spec = {
  type: 'common',
  data: {
    values: [
      {
        time: '2:00',
        value: 8,
        type: '抖音'
      },
      {
        time: '4:00',
        value: 9,
        type: '抖音'
      },
      {
        time: '6:00',
        value: 11,
        type: '抖音'
      },
      {
        time: '8:00',
        value: 14,
        type: '抖音'
      },
      {
        time: '10:00',
        value: 16,
        type: '抖音'
      },
      {
        time: '12:00',
        value: 17,
        type: '抖音'
      },
      {
        time: '14:00',
        value: 17,
        type: '抖音'
      },
      {
        time: '16:00',
        value: 16,
        type: '抖音'
      },
      {
        time: '18:00',
        value: 15,
        type: '抖音'
      },

      {
        time: '2:00',
        value: 7,
        type: 'B站'
      },
      {
        time: '4:00',
        value: 8,
        type: 'B站'
      },
      {
        time: '6:00',
        value: 9,
        type: 'B站'
      },
      {
        time: '8:00',
        value: 10,
        type: 'B站'
      },
      {
        time: '10:00',
        value: 9,
        type: 'B站'
      },
      {
        time: '12:00',
        value: 12,
        type: 'B站'
      },
      {
        time: '14:00',
        value: 14,
        type: 'B站'
      },
      {
        time: '16:00',
        value: 12,
        type: 'B站'
      },
      {
        time: '18:00',
        value: 14,
        type: 'B站'
      }
    ]
  },
  color: ['#6690F2', '#70D6A3'],
  series: [
    {
      type: 'bar',
      xField: 'time',
      yField: 'value',
      stack: true,
      seriesField: 'type'
    }
  ],
  legends: {
    visible: true,
    orient: 'right'
  },
  axes: [
    {
      orient: 'bottom',
      type: 'band'
    },
    {
      orient: 'left',
      type: 'linear'
    }
  ]
};

/**
 * 图表容器 dom id: CHART_CONTAINER_DOM_ID
 * ChartSpace 类: ChartSpace
 *
 */
const chartSpace = new ChartSpace(spec, { dom: CHART_CONTAINER_DOM_ID });
await chartSpace.renderAsync();
```

##

[更多 demo 和详细教程](https://visactor.io/vgrammar)

# 相关链接

- [官网](https://visactor.io/vgrammar)

# 生态

| 项目 | 介绍 |
| ---- | ---- |

| [VChart](https://visactor.io/vchart) | 基于 [VisActor/VGrammar](https://visactor.io/vgrammar) 封装的图表库。 |
| [React 组件库](https://visactor.io/react-vgrammar) | 基于 [VisActor/VChart](https://visactor.io/vgrammar) 的 React 图表 组件库。 |
| [智能生成组件](https://visactor.io/ai-vgrammar) | 基于 AI 的智能图表生成组件 |

# 参与贡献

如想参与贡献，请先阅读 [行为准则](./CODE_OF_CONDUCT.md) 和 [贡献指南](./CONTRIBUTING.zh-CN.md)。

细流成河，终成大海！

<a href="https://github.com/visactor/vgrammar/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vgrammar" /></a>

# 许可证

[MIT 协议](./LICENSE)
