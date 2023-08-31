{{ target: marks-glyph-barboxplot }}

## glyphType.barBoxplot(Object)

Execute `registerBarBoxplotGlyph()` to register the barBoxplot glyph before using the boxplot glyph

### glyphType(string) = 'barBoxplot'

Set the glyph type to `barBoxplot`

### glyphConfig

Supported glyph configurations include:

- `direction`('vertical'|'horizontal'): The direction of the barBoxplot glyph, default is `'vertical'`

### animation

Supported built-in animation types include:

- `barBoxplotScaleIn`/`barBoxplotScaleOut`: Animation of the barBoxplot glyph growing along the median line

{{ use: marks-encode(type = 'barBoxplot', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}