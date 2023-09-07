{{ target: marks-common-morph }}

#${prefix} morph(boolean)

Whether to enable global transition morph animations for the current graphic element

#${prefix} morphKey(string)

Used to match graphic elements for global transition morph animations, graphic elements with the same `morphKey` will undergo morph animations

#${prefix} morphElementKey(string)

For the matched graphic elements before and after, use this configuration to match the graphic element; if not declared, we will read the `key` configuration by default to match the graphic element for morph animations;
Supports one-to-one, one-to-many, and many-to-one graphic morph animations by default