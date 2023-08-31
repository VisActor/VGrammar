{{ target: marks-glyph-linkpath }}

## glyphType.linkPath(Object)

Execute `registerLinkPathGlyph()` to register the linkPath glyph before using it

### glyphType(string) = 'linkPath'

Set the glyph type to `linkPath`

### glyphConfig

Supported glyph configurations include:

- `direction`: `'vertical'|'horizontal'`, the direction of the linkPath glyph, default is `'vertical'`

### animation

{{ use: marks-encode(type = 'linkPath', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}