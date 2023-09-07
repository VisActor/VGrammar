{{ target: marks-glyph-barboxplot }}

## glyphType.barBoxplot(Object)

使用 boxplot 图元前需要执行 `registerBarBoxplotGlyph()` 对 barBoxplot 图元进行注册

### glyphType(string) = 'barBoxplot'

将 glyph 类型设置为 `barBoxplot`

### glyphConfig

支持的 glyph 配置包含：

- `direction`('vertical'|'horizontal'): barBoxplot 图元的方向，默认为 `'vertical'`

### animation

支持的内置动画类型包含：

- `barBoxplotScaleIn`/`barBoxplotScaleOut`: barBoxplot 图元沿着中值线生长的动画

{{ use: marks-encode(type = 'barBoxplot', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
