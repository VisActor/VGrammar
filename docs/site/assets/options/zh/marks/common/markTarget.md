{{ target: marks-common-markTarget }}

#${prefix} target

关联的图元，支持关联单个图元或者多个图元，支持四种格式的配置：

- `string` 关联单个图元，配置关联图元对应的 id
- `string[]` 关联多个图元，配置关联图元对应的 id
- `IMark` 关联单个图元，配置关联图元对应的实例，主要用于 API 创建模式
- `IMark[]` 关联多个图元，配置关联图元对应的实例，主要用于 API 创建模式
