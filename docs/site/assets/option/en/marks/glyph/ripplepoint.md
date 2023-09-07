{{ target: marks-glyph-ripplepoint }}

## glyphType.ripplePoint(Object)

Execute `registerRippleGlyph()` to register the ripplePoint glyph before using it.

### glyphType(string) = 'ripplePoint'

Set the glyph type to `ripplePoint`

### animation

Implement the loop playback of ripples through the `ripple` channel:

```json
{
  "channel": { "ripple": { "from": 0, "to": 1 } },
  "loop": true
}
```

{{ use: marks-encode(type = 'ripplePoint', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}