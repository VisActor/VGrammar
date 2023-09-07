{{ target: marks-glyph-wave }}

## glyphType.wave(Object)

使用 wave 图元前需要执行 `registerWaveGlyph()` 对 wave 图元进行注册

### glyphType(string) = 'wave'

将 glyph 类型设置为 `wave`

### animation

可以通过 `wave` 通道实现涟漪的循环播放：

```json
{
  "channel": { "wave": { "from": 0, "to": 1 } },
  "loop": true
}
```

{{ use: marks-encode(type = 'wave', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
