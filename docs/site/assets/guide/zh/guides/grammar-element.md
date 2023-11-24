# 语法元素

VGrammar 的可视化场景由多种不同含义的语法元素构成。

目前 VGrammar 支持的语法元素包含：

- 信号量 Signal
- 数据 Data
- 映射 Scale
- 坐标系 Coordinate
- 图元 Mark

除此之外，开发者还可以通过 `registerGrammar` 接口注册自己的语法元素。

## 信号量 Signal

信号量（signal）语法元素描述了可视化场景中的一个变量。signal 可以是简单的值或者由特定的计算逻辑生成，并动态影响可视化场景的计算。

VGrammar 提供了一些内置的信号量，包括：

- width & height: 可视化场景宽高
- viewWidth & viewHeight: 去除内边距后的宽高
- viewBox: 去除内边距后的包围盒
- padding: 可视化场景内边距
- autoFit: 可视化场景是否自适应容器宽高

Spec 形式 Signal 元素使用示例：

```js
{
  signals: [{
    id: 'threshold',
    value: 40
  }],
  data: [{
    id: 'data',
    values: [
      { type: 'A', value: 22 },
      { type: 'B', value: 45 },
      { type: 'C', value: 77 },
      { type: 'D', value: 31 }
    ],
    // apply signal to data transform
    transform: [
      {
        type: 'filter',
        callback: (datum, params) => datum.value >= params.threshold,
      }
    ],
    // declare the reference to signal
    dependency: 'threshold'
  }]
}
```

API 形式 Signal 元素使用示例：

```js
const threshold = view.signal(40).id('threshold');
const data = view
  .data([
    { type: 'A', value: 22 },
    { type: 'B', value: 45 },
    { type: 'C', value: 77 },
    { type: 'D', value: 31 }
  ])
  .transform([
    {
      type: 'filter',
      callback: (datum, params) => datum.value >= params.threshold
    }
  ])
  .depend(threshold);
```

## 数据 Data

数据（data）语法元素用于管理一组数据，同时 VGrammar 提供了内置的数据转换 transform 以支持数据分析逻辑。

VGrammar 可视化场景中图元渲染基于数据驱动的逻辑，除了特殊的组件以及 Group 图元以外，其他的图元类型均基于 data 元素执行相应的数据映射（data join）计算。

Spec 形式 Data 元素使用示例：

```js
{
  data: [{
    id: 'data',
    values: [
      { type: 'A', value: 22 },
      { type: 'B', value: 45 },
      { type: 'C', value: 77 },
      { type: 'D', value: 31 }
    ],
    transform: [
      {
        type: 'filter',
        callback: (datum) => datum.value >= 40
      }
    ]
  }],
  marks: [{
    type: 'rect',
    // apply data join to mark
    from: { data: 'data' }
  }]
}
```

API 形式 Data 元素使用示例：

```js
const data = view
  .data([
    { type: 'A', value: 22 },
    { type: 'B', value: 45 },
    { type: 'C', value: 77 },
    { type: 'D', value: 31 }
  ])
  .transform([
    {
      type: 'filter',
      callback: datum => datum.value >= 40
    }
  ]);
// apply data join to mark
const bar = view.mark('rect', view.rootMark).join({ data: 'data' });
```

## 映射 Scale

映射（scale）语法元素负责将数据映射到视觉通道上，例如将 `['A', 'B']` 的数据映射到颜色通道上 `['red', 'blue']`。

目前 VGrammar 提供多种不同类型的 Scale 语法元素，例如线性映射 LinearScale、顺序映射的 OrdinalScale 等。

开发者可以依据需求自由选择映射方式、配置映射参数，并将声明好的 scale 元素应用到 mark 的视觉编码计算中：

Spec 形式 Scale 元素使用示例：

```js
{
  scales: [{
    id: 'colorScale',
    type: 'ordinal',
    domain: ['A', 'B'],
    range: ['red', 'blue']
  }],
  marks: [{
    type: 'rect',
    encode: {
      update: {
        // apply visual scale to mark
        fill: { scale: 'colorScale', field: 'type' }
      }
    }
  }]
}
```

API 形式 Scale 元素使用示例：

```js
const scale = view.scale('ordinal').domain(['A', 'B']).range(['red', 'blue']);

// apply visual scale to mark
const bar = view.mark('rect', view.rootMark).encode('fill', { scale: 'colorScale', field: 'type' });
```

## 坐标系 Coordinate

坐标系（coordinate）语法元素描述了特定的坐标系转换逻辑，将坐标位置从画布坐标系转换到目标的坐标系中。

坐标系的功能包括不同坐标系类别之间的转换（例如直角坐标系到极坐标系的转换）以及额外的坐标系转换逻辑（例如平移、旋转、缩放、转置）。语义图元会依据其对应的坐标系适配其展现的形式。

目前 VGrammar 提供了两种坐标系类型：

- 直角坐标系：VGrammar 提供的直角坐标系由两个相互垂直的 x 与 y 构成
- 极坐标系：VGrammar 提供的极坐标系由角度 theta 与半径 r 构成

Spec 形式 Coordinate 元素使用示例：

```js
{
  coordinates: [
    {
      id: 'polar',
      type: 'polar',
      origin: [200, 200],
      transpose: true
    }
  ],
  marks: [{
    type: 'interval',
    // apply coordinate to mark
    coordinate: 'polar'
  }]
}
```

API 形式 Coordinate 元素使用示例：

```js
const polar = view.coordinate('polar').origin([200, 200]).transpose(true);
const interval = view.mark('interval', view.rootMark).coordinate(polar);
```

## 图元 Mark

图元（mark）语法元素描述了一组具有相同数据映射以及视觉编码逻辑的图形元素。开发者可以通过 mark 元素创建数据驱动的图形内容。

Spec 形式 Mark 元素使用示例：

```js
{
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
  ],
}
```

API 形式 Mark 元素使用示例：

```js
const bar = view
  .mark('rect', view.rootMark)
  .join(data)
  .encode({
    x: { scale: 'xscale', field: 'type' },
    width: { scale: 'xscale', band: 1 },
    y: { scale: 'yscale', field: 'value' },
    y1: 200,
    fill: '#1890ff'
  });
```

## 语法元素的相互引用

所有的语法元素都是可以相互引用的

在 Spec 形式下，语法元素可以通过 `dependency` 配置，引用另一个语法元素：

```js
{
  "data": [
    {
      "id": "table",
      "values": [{ "a": 0, "b": 2 }]
    }
  ],

  "scales": [
    {
      "id": "colorScale",
      "type": "ordinal",
      "dependency": ["table"],
      "domain": (scale, params) => {
        const data = params.table;

        return data.map(entry => 'a');
      },
      "range": ["red", "blue"]
    }
  ]
}
```

在 API 形式下，可以通过`depend`API，引用另一个语法元素：

```js
const tableData = view.data([{ a: 0, b: 2 }]).id('table');

const colorScale = view
  .scale('ordinal')
  .depend('table')
  .domain((scale, params) => {
    const data = params.table;

    return data.map(entry => 'a');
  })
  .range(['red', 'blue']);
```

注意，各个语法元素分别提供了语义化的配置，用于依赖特定的语法元素，效果和`depend()`、 `dependency`都是一致的，使用自定义的回调函数申明特定的配置的时候，所有的依赖元素，都能够通过全局唯一的`id`被获取到；

```js
const tableData = view
  .data([
    { cat: 'A', value: 2 },
    { cat: 'B', value: 2 }
  ])
  .id('table');

const colorScale = view.scale('ordinal').id('xScale').domain({ data: 'table', field: 'cat' }).range(['red', 'blue']);

const mark = view
  .mark('rect', view.rootMark)
  .join('table')
  .denpend('xScale')
  .encode((datum, element, params) => {
    const data = params.table;
    const xScale = params.xScale;

    return {
      /***/
    };
  });
```
