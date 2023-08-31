{{target: transform-join}}

## transform.join(Object)

Data Transformation - Query

### type(string) = join

Set the data transformation type to `join`, similar to SQL's `join`, that is, to cross-query two data sources

### from

Original data for query

### key(string)

The field corresponding to the unique identifier of the original data, supporting the format `a.b`

### fields

Type: string[]

Fields to query for the data to be transformed

### values

Type: string[]

Fields to query in the source data

### as

Type: string[]

Fields to save

### default

Default value used when data is missing
