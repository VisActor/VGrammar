{{ target: marks-component-player }}

## componentType.player(Object)

### componentType(string) = 'player'

Sets the component type to `player`

### playerType(string)

Supported types:

- 'auto'
- 'discrete'
- 'continuous'

{{ use: marks-common-target(
  prefix = '##',
  type = 'player'
) }}

{{ use: marks-encode(type = 'player', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}