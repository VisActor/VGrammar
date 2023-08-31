{{ target: marks-component-player }}

## componentType.player(Object)

### componentType(string) = 'player'

将组件类型设置为 `player`

### playerType(string)

支持一下类型：

- 'auto'
- 'discrete'
- 'continuous'

{{ use: marks-common-target(
  prefix = '##',
  type = 'player'
) }}

{{ use: marks-encode(type = 'player', prefix = '##') }}

{{ use: marks-base( prefix = '##' ) }}
