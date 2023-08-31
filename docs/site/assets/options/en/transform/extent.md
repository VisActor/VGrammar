{{target: transform-extent}}

## transform.extent(Object)

### type(string) = 'extent'

Set the data transformation type to `'extent'`

### field

Set the data field, supporting two types:

- string - A string to get the value under the specified field in the array element, supports the format of 'a.b', to get the value in the data element `{ a: { b: 12 } }`
- function - Function type, a custom callback function for obtaining data
