# 高级指引

VGrammar 作为图形语法，提供了非常强大的自定义的能力，方便用户去扩展，本教程将会介绍一些自定义拓展的能力

## 自定义 transform

### 实现

数据变换 tranform ，其实就是一个纯函数；我们要实现自定义的 transform，就是实现一下类型的纯函数：

```ts
export type IFunctionTransform<Options = any, Input = any, Output = any> = (
  options?: Options,
  data?: Input,
  params?: Record<string, any>,
  view?: IView
) => Output | Promise<Output> | IProgressiveTransformResult<Output>;
```

所有的 transform 都接收四个参数：

- opionts 配置
- data 执行变换的数据
- params 配置数据变换的语法元素，依赖的其他语法元素的结果
- view 全局的 VGrammar 可视化实例，一般只有少数布局算法，可能需要用到，不建议使用

以内置的`filter` transform 的实现为例：

```ts
export const filter = (
  options: {
    callback: (entry: any, params: any) => boolean;
  },
  data: any[],
  parameters?: any
) => {
  return data.filter(entry => {
    return options.callback(entry, parameters);
  });
};
```

### 注册

注册 transform 只需要调用`registerTransform`进行注册

示例：

```ts
import { registerTransform } from '@visactor/vgrammar';

registerTransform('filter2', {
  transform: filter,
  markPhase: 'beforeJoin'
});
```

### 使用

注册完毕，可以和内置的 transform 类似使用，只需要传入需要的配置即可

```js
{
  data: [
    {
      id: 'table',
      values: [{ a: 1 }],
      transform: [
        {
          type: 'filter2',
          callback: datum => {
            return datum.a > 0;
          }
        }
      ]
    }
  ];
}
```

## 自定义组合图元

VGrammar 内置了一些常见的组合图元，当基础图元以及内置的组合图元均不能满足需求的时候，用户可以通过自定义组合图元的方式，来进行扩展

### 注册

以内置的`wave`组合图元的实现为例，在实现自定义组合图元的时候，首先我们需要注册一个全局唯一的`name`，以及组成图元的基础图元的类型和`name`；
例如`wave`图元是由三条面积填充线组成的，所以我们实现的代码如下：

```ts
import { registerGlyph } from '@visactor/vgrammar';

const waveGlyphMeta = registerGlyph('wave', {
  wave0: 'area',
  wave1: 'area',
  wave2: 'area'
});
```

接下来，我们可以设置组合图元需要支持的视觉通道，VGrammar 支持三种类型的视觉通道设置：

- `registerDefaultEncoder()` 设置子图元的默认图形属性
- `registerChannelEncoder()` 设置自定义的图形通道，用户需要实现当组合图元设置了该视觉通道的时候，哪些子图元需要更新对应的图形属性
- `registerFunctionEncoder()` 当组合图元的多个图形属性，最终只需要映射到某个子图元的单个属性的时候，可以注册函数类型的视觉通道解析函数；

`registerDefaultEncoder()` 和 `registerChannelEncoder()` 的实现示例如下：

```ts
waveGlyphMeta
  .registerChannelEncoder('wave', (channel, encodeValue, encodeValues, datum, element) => {
    const originPoints: IPointLike[] = new Array(21).fill(0).map((v, index) => {
      const waveHeight = index % 2 === 0 ? 20 : 0;
      return { x: -500 + 50 * index, y: encodeValues.y + waveHeight, y1: encodeValues.y + encodeValues.height };
    });
    const points0 = originPoints.map(point => {
      return { x: point.x + encodeValue * 100, y: point.y, y1: point.y1 };
    });
    const points1 = originPoints.map(point => {
      return { x: point.x + encodeValue * 200 - 40, y: point.y, y1: point.y1 };
    });
    const points2 = originPoints.map(point => {
      return { x: point.x + encodeValue * 300 - 20, y: point.y, y1: point.y1 };
    });
    return {
      wave0: { points: points0, x: 0, y: 0 },
      wave1: { points: points1, x: 0, y: 0 },
      wave2: { points: points2, x: 0, y: 0 }
    };
  })
  .registerDefaultEncoder(() => {
    return {
      wave0: { curveType: 'monotoneX', fillOpacity: 1 },
      wave1: { curveType: 'monotoneX', fillOpacity: 0.66 },
      wave2: { curveType: 'monotoneX', fillOpacity: 0.33 }
    };
  });
```

`registerFunctionEncoder()` 的实现可以参考`linkPath`组合图元的实现：

```ts
linkPathGlyphMeta.registerFunctionEncoder(
  (encodeValues: LinkPathEncodeValues, datum: any, element: IElement, config: LinkPathConfig) => {
    const direction = encodeValues.direction ?? config?.direction;
    const parsePath = ['vertical', 'TB', 'BT'].includes(direction) ? getVerticalPath : getHorizontalPath;
    const isRatioShow = typeof encodeValues.ratio === 'number' && encodeValues.ratio >= 0 && encodeValues.ratio <= 1;

    const encodeChannels = Object.keys(encodeValues);
    // parse path when all required channels are included
    if (['x0', 'y0', 'x1', 'y1'].every(channel => encodeChannels.includes(channel))) {
      return {
        back: {
          path: isRatioShow ? parsePath(encodeValues, 1) : ''
        },
        front: {
          path: parsePath(encodeValues, isRatioShow ? encodeValues.ratio : 1)
        }
      };
    }

    return {};
  }
);
```

### 使用

组合图元注册完成后，就可以和内置的组合图元一样使用了：

```js
{
  marks: [
    {
      type: 'glyph',
      glyphType: 'wave',
      encode: {
        update: {
          y: 100,
          height: 100,
          fill: 'DarkOrange',
          wave: 0
        }
      }
    }
  ];
}
```

## 自定义语法元素

VGrammar 所有的语法元素，都是按照依赖关系进行运行的，当现有的语法元素不能满足要求的时候，用户可以试着实现自定义的语法元素；接下来以`vgrammar-projection`中实现的语法元素`Projection`为例，讲述如何自定义语法元素，并在 VGrammar 可视化图表中使用；

### 实现语法类

我们实现自定义的语法元素的时候，需要继承语法元素的基类`GrammarBase`，实现一下三个主要的方法：

- `parse(spec: CustomizedSpec)` 解析配置的方法，配置的类型需要定义
- `evaluate(upstream: any, parameters: any)` 执行逻辑，在语法元素被执行的时候，会传入上游依赖的数据，和其他依赖参数
- `output()` 返回语法元素的输出对象，会被下游节点获取到并执行后续的逻辑

示例：

```ts
import { GrammarBase } from '@visactor/vgrammar';

export class Projection extends GrammarBase implements IProjection {
  readonly grammarType: GrammarType = 'projection';

  private projection: any;

  constructor(view: IView) {
    super(view);
  }

  parse(spec: ProjectionSpec) {
    super.parse(spec);
    this.spec = mergeConfig(this.spec, spec);
    this.attach(parseProjection(spec, this.view));

    return this;
  }

  evaluate(upstream: any, parameters: any) {
    if (!this.projection || this.projection.type !== this.spec.type) {
      this.projection = create(this.spec.type);
      this.projection.type = this.spec.type;
    }
    projectionProperties.forEach(prop => {
      if (!isNil(this.spec[prop])) {
        set(this.projection, prop, invokeFunctionType(this.spec[prop], parameters, projection));
      }
    });

    if (!isNil(this.spec.pointRadius)) {
      this.projection.path.pointRadius(invokeFunctionType(this.spec.pointRadius, parameters, projection));
    }
    if (!isNil(this.spec.fit)) {
      const fit = invokeFunctionType(this.spec.fit, parameters, projection);
      const data = collectGeoJSON(fit);

      if (this.spec.extent) {
        this.projection.fitExtent(invokeFunctionType(this.spec.extent, parameters, projection), data);
      } else if (this.spec.size) {
        this.projection.fitSize(invokeFunctionType(this.spec.size, parameters, projection), data);
      }
    }

    return this.projection;
  }

  output() {
    return this.projection;
  }
}
```

### 注册

接下来只需要调用注册方法对自定义的语法元素进行注册:

```js
import { registerGrammar } from '@visactor/vgrammar';

registerGrammar('projection', Projection, 'projections');
```

`registerGrammar` 接收三个参数：

- type: 唯一标志符，对应了语法元素实例中的`grammarType`
- grammarClass: 自定义语法类
- specKey: 可选参数；在 spec 模式下，申明语法元素的`key`，注意，不能和内置的语法元素重复，如果不传则保持和`type`一致

### 使用

在 Spec 模式下，可以通过注册语法元素时候，申明的`specKey`进行设置

```js
vGrammarView.parseSpec({
  projections: [
    {
      id: 'firstProjection',
      size: [10, 10]
    }
  ]
});
```

在 API 模式下，可以通过`customized()` API 创建自定义的语法元素

```js
vGrammarView
  .customized('projection', {
    size: [10, 10]
  })
  .id('firstProjection');
```
