# 简介

VGrammar 是一个面向数据可视化的语法引擎，提供了一套声明式的 Specification 以及等价的 API 形式接口，允许用户自由创作属于自己的可视化作品。

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

<div class="examples-ref-container" id="examples-ref-rect" data-path="basic-mark-rect/basic-rect">
</div>

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          name: 'Apple',
          value: 214480
        },
        {
          name: 'Google',
          value: 155506
        },
        {
          name: 'Amazon',
          value: 100764
        },
        {
          name: 'Microsoft',
          value: 92715
        },
        {
          name: 'Coca-Cola',
          value: 66341
        },
        {
          name: 'Samsung',
          value: 59890
        },
        {
          name: 'Toyota',
          value: 53404
        },
        {
          name: 'Mercedes-Benz',
          value: 48601
        },
        {
          name: 'Facebook',
          value: 45168
        },
        {
          name: "McDonald's",
          value: 43417
        },
        {
          name: 'Intel',
          value: 43293
        },
        {
          name: 'IBM',
          value: 42972
        },
        {
          name: 'BMW',
          value: 41006
        },
        {
          name: 'Disney',
          value: 39874
        },
        {
          name: 'Cisco',
          value: 34575
        },
        {
          name: 'GE',
          value: 32757
        },
        {
          name: 'Nike',
          value: 30120
        },
        {
          name: 'Louis Vuitton',
          value: 28152
        },
        {
          name: 'Oracle',
          value: 26133
        },
        {
          name: 'Honda',
          value: 23682
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
        return [0, params.viewBox.width()];
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
        return [params.viewBox.height(), 0];
      },
      nice: true
    }
  ],

  marks: [
    {
      type: 'group',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            width: params.viewBox.width(),
            height: params.viewBox.height()
          };
        }
      },

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
                x: 0,
                y: params.viewBox.height(),
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
                x: 0,
                y: 0,
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
          crosshairType: 'x'
        },
        {
          type: 'rect',
          id: 'rect',
          from: { data: 'table' },
          dependency: ['yscale'],
          encode: {
            update: {
              x: { scale: 'xscale', field: 'name', band: 0.25 },
              width: { scale: 'xscale', band: 0.5 },
              y: { scale: 'yscale', field: 'value' },
              y1: (datum, element, params) => {
                return params.yscale.scale(params.yscale.domain()[0]);
              },
              fill: '#6690F2'
            },
            hover: {
              fill: 'red'
            }
          }
        },
        {
          type: 'component',
          componentType: 'tooltip',
          target: 'rect',
          title: { visible: false, value: 'value' },
          content: [
            {
              key: { field: 'name' },
              value: { field: 'value' },
              symbol: {
                symbolType: 'circle',
                fill: '#6690F2'
              }
            }
          ]
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

## 通过 API 形式创建

开发者可以通过 api 接口创建可视化场景中的所有语法元素，并使用可视化实例执行渲染：

<div class="examples-ref-container" id="examples-ref-rect-api" data-path="basic-mark-rect/api-rect">
</div>

```javascript livedemo template=vgrammar
const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  padding: { top: 5, right: 5, bottom: 30, left: 60 }
});
const data = vGrammarView.data([
  {
    name: 'Apple',
    value: 214480
  },
  {
    name: 'Google',
    value: 155506
  },
  {
    name: 'Amazon',
    value: 100764
  },
  {
    name: 'Microsoft',
    value: 92715
  }
]);

const xScale = vGrammarView
  .scale('band')
  .id('xscale')
  .domain({ data, field: 'name' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [0, params.viewBox.width()];
  })
  .configure({ padding: 0.05, round: true });

const yScale = vGrammarView
  .scale('linear')
  .id('yscale')
  .domain({ data, field: 'value' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [params.viewBox.height(), 0];
  })
  .configure({ nice: true });

const group = vGrammarView
  .group(vGrammarView.rootMark)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: params.viewBox.x1,
      y: params.viewBox.y1,
      width: params.viewBox.width(),
      height: params.viewBox.height()
    };
  });

const xAxis = vGrammarView
  .axis(group)
  .scale(xScale)
  .tickCount(-1)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: params.viewBox.height(),
      start: { x: 0, y: 0 },
      end: { x: params.viewBox.width(), y: 0 }
    };
  });
const yAxis = vGrammarView
  .axis(group)
  .scale(yScale)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: 0,
      start: { x: 0, y: params.viewBox.height() },
      end: { x: 0, y: 0 },
      verticalFactor: -1
    };
  });

const rect = vGrammarView
  .mark('rect', group)
  .join(data)
  .depend(['yscale'])
  .encode({
    x: { scale: 'xscale', field: 'name', band: 0.25 },
    width: { scale: 'xscale', band: 0.5 },
    y: { scale: 'yscale', field: 'value' },
    y1: (datum, element, params) => {
      return params.yscale.scale(params.yscale.domain()[0]);
    },
    fill: '#6690F2'
  })
  .encodeState('hover', 'fill', 'red');

vGrammarView.interaction('tooltip', {
  selector: rect,
  title: { visible: false, value: 'value' },
  content: [
    {
      key: { field: 'name' },
      value: { field: 'value' },
      symbol: {
        symbolType: 'circle',
        fill: '#6690F2'
      }
    }
  ]
});
vGrammarView.interaction('crosshair', {
  container: group,
  scale: xScale,
  crosshairType: 'x',
  crosshairShape: 'rect'
});

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 销毁可视化实例

当容器被销毁，或者需要创建新的实例的时候，调用可视化实例的销毁方法，能够更好释放内存，避免内存泄露问题：

```js
view.release();
```
