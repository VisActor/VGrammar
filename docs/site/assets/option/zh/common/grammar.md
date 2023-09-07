{{ target: common-grammar }}

<!-- GrammarSpec，语法元素通用配置 -->

#${prefix} id(string)

${grammarType}的 id，可以用于在其他元素中引用

#${prefix} name(string)

${grammarType}的 name，可以用于查询该 ${grammarType}

#${prefix} dependency

可传类型： (IGrammarBase[] | IGrammarBase | string[] | string)

当前${grammarType}依赖的其他元素，可以是元素的 id，也可以是元素本身
