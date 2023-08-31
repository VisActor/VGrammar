{{ target: transform-map }}

## transform.map(Object)

Implement filtering transformation for data

### type(string) = map

Type of transformation

### callback

The callback function to perform the transformation. The callback function will receive two parameters

{{ use: common-callback() }}

### as(string)

Perform a transformation for each element in the array, and set the result of the transformation to the key declared by `as`

### all(boolean) = false

Whether to get the entire data and perform a custom transformation. By default, the transformation is performed on a specific element in the array.