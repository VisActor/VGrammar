{{ target: transform-pick }}

## transform.pick(Object)

Filtering transformation of data

### type(string) = pick

Set the data transformation type to `'pick'`, i.e., pick a part of the fields from the original data as the new data

### fields(Array)

Set the original data fields or the callback function for data calculation, supporting two types:

- string[] - An array of strings, each element is used to specify the values obtained for a given field in the array element, such as the format 'a.b' to obtain the values in the data element `{ a: { b: 12 } }`
- function[] - An array of functions, each element is a custom callback function for obtaining data

### as

Type of `string[]`, set the key in the return result. If not set, it will read the values of `fields`. When the values in `fields` are of a function type, it will read the `fname` attribute of the function.