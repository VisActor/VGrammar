# 简介

VGrammar 是一个面向数据可视化的语法引擎，提供了一套声明式的 Specification 以及等价的 API 形式接口，允许用户自由创作属于自己的可视化作品。

![VGrammar 宣传图片](待补充)

# 获取 VGrammar

目前，开发者可以通过 npm 以及 github 两种方式获取 VGrammar 资源。

## 从 npm 获取

开发者可以通过包管理器安装 VGrammar：

```shell
npm install @visactor/vgrammar
```

## 从 GitHub 获取

开发者可以在 @visactor/vgrammar 项目的 [release 页面](https://github.com/VisActor/VGrammar/releases) 可以找到各个版本的打包产物。

# 使用

## 可视化实例

开发者需要首先为 VGrammar 声明对应的 dom 容器：

```html
<div id="vgrammar-container"></div>
```

并声明相应的可视化实例：

```js
import { View } from '@visactor/vgrammar';

const view = new View({
  width: 300,
  height: 300,
  renderer: 'canvas',
  container: 'vgrammar-container'
});
```

目前 VGrammar 提供了两种等价的使用形式，开发者可以根据自己的编码习惯自由选择某一方式创建自己的可视化内容：

- specification 形式
- api 形式

## 通过 spec 形式创建

开发者可以声明可视化场景的 specification，并通过可视化实例执行解析以及渲染：

```js
const spec = {
  data: [
    {
      id: 'data',
      values: [
        { type: 'A', value: 22 },
        { type: 'B', value: 45 },
        { type: 'C', value: 77 },
        { type: 'D', value: 31 }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'data', field: 'type' },
      range: [0, 200],
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: [0, 100],
      range: [200, 0],
      nice: true
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      encode: {
        update: {
          x: 50,
          y: 210,
          start: { x: 0, y: 0 },
          end: { x: 200, y: 0 }
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      encode: {
        update: {
          x: 50,
          y: 210,
          start: { x: 0, y: 0 },
          end: { x: 0, y: -200 },
          verticalFactor: -1
        }
      }
    },
    {
      type: 'group',
      encode: {
        enter: {
          x: 50,
          y: 10
        }
      },
      marks: [
        {
          type: 'rect',
          from: { data: 'data' },
          encode: {
            update: {
              x: { scale: 'xscale', field: 'type' },
              width: { scale: 'xscale', band: 1 },
              y: { scale: 'yscale', field: 'value' },
              y1: 200,
              fill: '#1890ff'
            }
          }
        }
      ]
    }
  ]
};
view.parseSpec(spec);
view.runAsync();
```

## 通过 API 形式创建

开发者可以通过 api 接口创建可视化场景中的所有语法元素，并使用可视化实例执行渲染：

```js
const data = view.data([
  { type: 'A', value: 22 },
  { type: 'B', value: 45 },
  { type: 'C', value: 77 },
  { type: 'D', value: 31 }
]);
const xScale = view
  .scale('band')
  .domain({ data, field: 'type' })
  .range([0, 200])
  .configure({ padding: 0.05, round: true });
const yScale = view.scale('linear').domain([0, 100]).range([200, 0]).configure({ nice: true });
const xAxis = view
  .axis(view.rootMark)
  .scale(xScale)
  .encode({
    x: 50,
    y: 210,
    start: { x: 0, y: 0 },
    end: { x: 200, y: 0 }
  });
const yAxis = view
  .axis(view.rootMark)
  .scale(yScale)
  .encode({
    x: 50,
    y: 210,
    start: { x: 0, y: 0 },
    end: { x: 0, y: -200 },
    verticalFactor: -1
  });
const group = view.group(view.rootMark).encode({ x: 50, y: 10 });
const bar = view
  .mark('rect', group)
  .join(data)
  .encode({
    x: { scale: xScale, field: 'type' },
    width: { scale: xScale, band: 1 },
    y: { scale: yScale, field: 'value' },
    y1: 200,
    fill: '#1890ff'
  });

view.runAsync();
```

## 销毁可视化实例

当容器被销毁，或者需要创建新的实例的时候，调用可视化实例的销毁方法，能够更好释放内存，避免内存泄露问题：

```js
view.release();
```
