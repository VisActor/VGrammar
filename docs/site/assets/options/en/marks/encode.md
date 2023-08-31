{{ target: marks-encode }}

#${prefix} encode

Set the visual channel encoding of the graphics elements, supporting three data change states by default:

- `enter` newly added data items
- `update` data items have been updated
- `exit` data items are deleted

Note that the data state here is automatically generated based on the `mark`'s `key`. We will calculate the unique identifier for the data bound to the `mark` based on the `key` configuration. After the data is updated, if the corresponding unique identifier no longer exists, the state is `exit`; if it exists, it is `update`. If the previous data does not exist for the unique identifier, the data item's state is `enter`.

Supports one interaction state by default:

- `hover` when the mouse hovers over a specific shape, set the corresponding visual channel encoding for the shape

##${prefix} enter

Set the visual channel mapping executed by the graphics elements in the data initialization state. Note that it will not be executed again when the data is updated.

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} update

Set the visual channel mapping executed by the graphics elements in the data update state.

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} exit

Set the visual channel mapping executed by the graphics elements in the data deletion state.

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} hover

Set the visual channel mapping corresponding to the graphics elements when in the `hover` state.

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}
