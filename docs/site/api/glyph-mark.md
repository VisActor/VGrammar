# GlyphMark

组合图元
继承`Mark`，所有`Mark`支持的 API，都能在`Component`实例上调用

## 实例属性

### glyphType

类型： `string`

组合图元的类型，现在内置了以下几种类型：

- 'linkPath'

## 实例方法

### getGlyphMeta

获取组合图元的元数据

```ts
() => IGlyphMeta;
```

### configureGlyph

配置组合图元

```ts
(glyph: IGlyph) => => this;
```

### getGlyphConfig

获取组合图元的配置

```ts
() => any;
```
