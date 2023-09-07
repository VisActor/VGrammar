{{ target: marks-common-morph }}

#${prefix} morph(boolean)

是否对当前图元开启全局的过渡形变动画

#${prefix} morphKey(string)

用于匹配全局过渡形变动画的图元，具有相对的`morphKey`的图元，会进行形变动画

#${prefix} morphElementKey(string)

对于匹配上的前后图元，通过该配置，进行图形元素的匹配；如果不申明，我们默认会读取`key`配置，用于匹配图形元素，进行形变动画；
默认支持一对一、一对多、多对一的图形形变动画
