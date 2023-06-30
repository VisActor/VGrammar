# 简介

VGrammar 是一个面向数据可视化的语法引擎，提供了一套声明式的 Specification 以及等价的 API 形式接口，允许用户自由创作属于自己的可视化作品。

![VGrammar 宣传图片](待补充)

# 获取 VGrammar

目前，开发者可以通过 npm 以及 github 两种方式获取 VGrammar 资源。

## 从 npm 获取

开发者可以通过包管理器安装 VGrammar：

```shell
npm install @visactor/vgrammar
```

## 从 GitHub 获取

开发者可以在 @visactor/vgrammar 项目的 [release 页面](https://github.com/VisActor/VGrammar/releases) 可以找到各个版本的打包产物。

# 使用

## 可视化实例

开发者需要首先为 VGrammar 声明对应的 dom 容器：

```html
<div id="vgrammar-container"></div>
```

并声明相应的可视化实例：

```js
import { View } from '@visactor/vgrammar';

const view = new View({
  width: 300,
  height: 300,
  renderer: 'canvas',
  container: 'vgrammar-container'
});
```

目前 VGrammar 提供了两种等价的使用形式，开发者可以根据自己的编码习惯自由选择某一方式创建自己的可视化内容：

- specification 形式
- api 形式

## 通过 spec 形式创建

开发者可以声明可视化场景的 specification，并通过可视化实例执行解析以及渲染：

<div class="examples-ref-container" id="examples-ref-rect" data-path="basic-mark-rect/basic-rect">
</div>

## 通过 API 形式创建

开发者可以通过 api 接口创建可视化场景中的所有语法元素，并使用可视化实例执行渲染：

<div class="examples-ref-container" id="examples-ref-rect-api" data-path="basic-mark-rect/api-rect">
</div>

## 销毁可视化实例

当容器被销毁，或者需要创建新的实例的时候，调用可视化实例的销毁方法，能够更好释放内存，避免内存泄露问题：

```js
view.release();
```
