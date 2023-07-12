# GlyphMark

Composite glyphs
Inherits `Mark`, all APIs supported by `Mark` can be called on `Component` instances

## Instance Attributes

### glyphType

Type: `string`

The type of composite glyph, with the following built-in types currently available:

- 'linkPath'

## Instance Methods

### getGlyphMeta

Get metadata for the composite glyph

```ts
() => IGlyphMeta;
```

### configureGlyph

Configure the composite glyph

```ts
(glyph: IGlyph) => => this;
```

### getGlyphConfig

Get the configuration for the composite glyph

```ts
() => any;
```
