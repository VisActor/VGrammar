{{ target: marks-glyph-boxplot }}

## glyphType.boxplot(Object)

使用 boxplot 图元前需要执行 `registerBoxplotGlyph()` 对 boxplot 图元进行注册

### glyphType(string) = 'boxplot'

将 glyph 类型设置为 `boxplot`

### glyphConfig

支持的 glyph 配置包含：

- `direction`('vertical'|'horizontal'): boxplot 图元的方向，默认为 `'vertical'`

### animation

支持的内置动画类型包含：

- `boxplotScaleIn`/`boxplotScaleOut`: boxplot 图元沿着中值线生长的动画

{{ use: marks-encode(type = 'boxplot', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
