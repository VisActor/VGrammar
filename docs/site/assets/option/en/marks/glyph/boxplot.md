{{ target: marks-glyph-boxplot }}

## glyphType.boxplot(Object)

Before using the boxplot glyph, you need to execute `registerBoxplotGlyph()` to register the boxplot glyph

### glyphType(string) = 'boxplot'

Set the glyph type to `boxplot`

### glyphConfig

The supported glyph configurations include:

- `direction`('vertical'|'horizontal'): The direction of the boxplot glyph, default to `'vertical'`

### animation

The supported built-in animation types include:

- `boxplotScaleIn`/`boxplotScaleOut`: The animation of the boxplot glyph growing along the median line

{{ use: marks-encode(type = 'boxplot', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}