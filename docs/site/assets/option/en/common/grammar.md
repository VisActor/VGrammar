{{ target: common-grammar }}

<!-- GrammarSpec, general configuration for grammar elements -->

#${prefix} id(string)

The id of the ${grammarType}, which can be used for reference in other elements

#${prefix} name(string)

The name of the ${grammarType}, which can be used for querying the ${grammarType}

#${prefix} dependency

Type that can be passed: (IGrammarBase[] | IGrammarBase | string[] | string)

The other elements that the current ${grammarType} depends on, can be the id of the element, or the element itself
