# Advanced Guide

VGrammar, as a graphic grammar, provides a very powerful customization capability for users to expand. This tutorial will introduce some customization capabilities.

## Custom Transform

### Implementation

Data transformation `transform` is actually a pure function. To implement a custom transform, we need to implement a pure function with the following type:

```ts
export type IFunctionTransform<Options = any, Input = any, Output = any> = (
  options?: Options,
  data?: Input,
  params?: Record<string, any>,
  view?: IView
) => Output | Promise<Output> | IProgressiveTransformResult<Output>;
```

All transforms accept four parameters:

- options: configuration
- data: data to be transformed
- params: configuration data transformation syntax elements, depending on other syntax elements results
- view: global VGrammar visualization instance, generally only a few layout algorithms may need to use, not recommended

Take the built-in `filter` transform implementation as an example:

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

### Registration

To register a transform, just call `registerTransform` for registration.

Example:

```ts
import { registerTransform } from '@visactor/vgrammar';

registerTransform('filter2', {
  transform: filter,
  markPhase: 'beforeJoin'
});
```

### Usage

After registration, you can use it like the built-in transform, just pass in the required configuration.

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

## Custom Composite Glyph

VGrammar has some built-in composite glyphs. When basic glyphs and built-in composite glyphs cannot meet the requirements, users can expand them by customizing the composite glyphs.

### Registration

Taking the built-in `wave` composite glyph as an example, when implementing a custom composite glyph, first, we need to register a globally unique `name` and the types and `name` of the basic glyphs that make up the glyph. For example, the `wave` glyph is composed of three area-filled lines, so our implementation code is as follows:

```ts
import { registerGlyph } from '@visactor/vgrammar';

const waveGlyphMeta = registerGlyph('wave', {
  wave0: 'area',
  wave1: 'area',
  wave2: 'area'
});
```

Next, we can set the visual channels that the composite glyph needs to support. VGrammar supports three types of visual channel settings:

- `registerDefaultEncoder()` sets the default graphic attributes of the sub-glyph
- `registerChannelEncoder()` sets the custom graphic channel, users need to implement which sub-glyphs need to update the corresponding graphic attributes when the composite glyph sets this visual channel
- `registerFunctionEncoder()` when multiple graphic attributes of a composite glyph ultimately need to be mapped to a single attribute of a sub-glyph, the function type visual channel parsing function can be registered.

The implementation examples of `registerDefaultEncoder()` and `registerChannelEncoder()` are as follows:

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

The implementation of `registerFunctionEncoder()` can refer to the implementation of the `linkPath` composite glyph:

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

### Usage

After the registration of the composite glyph is complete, it can be used like the built-in composite glyph:

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

## Custom Syntax Elements

All VGrammar syntax elements run according to dependencies. When the existing syntax elements do not meet the requirements, users can try to implement custom syntax elements. Next, take the `vgrammar-projection` implementation of the `Projection` syntax element as an example, explain how to customize the syntax element and use it in the VGrammar visual chart.

### Implementation of Syntax Class

When we implement custom syntax elements, we need to inherit the base class `GrammarBase` and implement the following three main methods:

- `parse(spec: CustomizedSpec)` method for parsing the configuration, the configuration type needs to be defined
- `evaluate(upstream: any, parameters: any)` execution logic, when the syntax element is executed, the upstream dependent data and other dependent parameters will be passed in
- `output()` returns the output object of the syntax element, which will be obtained by the downstream nodes and perform subsequent logic

Example:

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

### Registration

Next, just call the registration method to register the custom syntax element:

```js
import { registerGrammar } from '@visactor
```
