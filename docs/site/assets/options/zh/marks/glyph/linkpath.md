{{ target: marks-glyph-linkpath }}

## glyphType.linkPath(Object)

使用 linkPath 图元前需要执行 `registerLinkPathGlyph()` 对 linkPath 图元进行注册

### glyphType(string) = 'linkPath'

将 glyph 类型设置为 `linkPath`

### glyphConfig

支持的 glyph 配置包含：

- `direction`: `'vertical'|'horizontal'`，linkPath 图元的方向，默认为 `'vertical'`

### animation

{{ use: marks-encode(type = 'linkPath', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
