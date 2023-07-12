# Introduction

VGrammar is a grammar engine for data visualization, providing a set of declarative Specifications and equivalent API-style interfaces, allowing users to freely create their own visualization works.

# Getting VGrammar

Currently, developers can obtain VGrammar resources through npm and GitHub in two ways.

## Get from npm

Developers can install VGrammar through the package manager:

```shell
npm install @visactor/vgrammar
```

## Get from GitHub

Developers can find the packaging artifacts of each version at the [release page](https://github.com/VisActor/VGrammar/releases) of the @visactor/vgrammar project.

# Usage

## Visualization Instance

Developers need to declare the corresponding DOM container for VGrammar first:

```html
<div id="vgrammar-container"></div>
```

And declare the corresponding visualization instance:

```js
import { View } from '@visactor/vgrammar';

const view = new View({
  width: 300,
  height: 300,
  renderer: 'canvas',
  container: 'vgrammar-container'
});
```

At present, VGrammar offers two equivalent forms of use, allowing developers to freely choose one way to create their own visualization content according to their coding habits:

- specification form
- api form

## Create through spec form

Developers can declare the specification of a visualization scene, and execute parsing and rendering through the visualization instance:

<div class="examples-ref-container" id="examples-ref-rect" data-path="basic-mark-rect/basic-rect">
</div>

## Create through API form

Developers can create all grammar elements in the visualization scene through the API interface and use the visualization instance to perform rendering:

<div class="examples-ref-container" id="examples-ref-rect-api" data-path="basic-mark-rect/api-rect">
</div>

## Destroy Visualization Instance

When the container is destroyed or a new instance needs to be created, calling the visualization instance's destroy method can better release memory and avoid memory leakage problems:

```js
view.release();
```
