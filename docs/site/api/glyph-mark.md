# GlyphMark

组合图元
继承`Mark`，所有`Mark`支持的 API，都能在`Component`实例上调用

## glyphType(string)

组合图元的类型，现在内置了以下几种类型：

- 'linkPath'

## getGlyphMeta(function)

获取组合图元的元数据

```ts
() => IGlyphMeta;
```

## configureGlyph(function)

配置组合图元

```ts
(glyph: IGlyph) => => this;
```

## getGlyphConfig(function)

获取组合图元的配置

```ts
() => any;
```
