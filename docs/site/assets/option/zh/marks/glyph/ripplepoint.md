{{ target: marks-glyph-ripplepoint }}

## glyphType.ripplePoint(Object)

使用 ripplePoint 图元前需要执行 `registerRippleGlyph()` 对 ripplePoint 图元进行注册

### glyphType(string) = 'ripplePoint'

将 glyph 类型设置为 `ripplePoint`

### animation

可以通过 `ripple` 通道实现涟漪的循环播放：

```json
{
  "channel": { "ripple": { "from": 0, "to": 1 } },
  "loop": true
}
```

{{ use: marks-encode(type = 'ripplePoint', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
