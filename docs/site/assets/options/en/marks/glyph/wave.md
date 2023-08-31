{{ target: marks-glyph-wave }}

## glyphType.wave(Object)

You need to perform `registerWaveGlyph()` to register the wave glyph before using it

### glyphType(string) = 'wave'

Set the glyph type to `wave`

### animation

You can implement the ripple loop playback through the `wave` channel:

```json
{
  "channel": { "wave": { "from": 0, "to": 1 } },
  "loop": true
}
```

{{ use: marks-encode(type = 'wave', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}