# v0.11.12

2024-02-07

upgrade dependency

[more detail about v0.11.12](https://github.com/VisActor/VGrammar/releases/tag/v0.11.12)

# v0.11.11

2024-02-23


**🆕 New feature**

- **@visactor/vgrammar-core**: support `clipPath` in mark



[more detail about v0.11.11](https://github.com/VisActor/VGrammar/releases/tag/v0.11.11)

# v0.11.10

2024-02-04


**🐛 Bug fix**

- **@visactor/vgrammar-core**: fix render error when update marks



[more detail about v0.11.10](https://github.com/VisActor/VGrammar/releases/tag/v0.11.10)

# v0.11.9

2024-02-04


**🔨 Refactor**

- **@visactor/vgrammar-core**: refactor progressive render of mark, fix render glyph in progressive



[more detail about v0.11.9](https://github.com/VisActor/VGrammar/releases/tag/v0.11.9)

# v0.11.8

2024-02-02


**🐛 Bug fix**

- **@visactor/vgrammar-core**: update datazoom when reusing



[more detail about v0.11.8](https://github.com/VisActor/VGrammar/releases/tag/v0.11.8)

# v0.11.7

2024-02-01


**🐛 Bug fix**

- **@visactor/vgrammar-core**: fix the bug of line/area when has only one point
- **@visactor/vgrammar-core**: fix the error of tooltip that tooltip may be released after chart update



[more detail about v0.11.7](https://github.com/VisActor/VGrammar/releases/tag/v0.11.7)

# v0.11.6

2024-01-31


**🐛 Bug fix**

- **@visactor/vgrammar-core**: symbol animation of `update` may lead all the points of overlaped show again



[more detail about v0.11.6](https://github.com/VisActor/VGrammar/releases/tag/v0.11.6)

# v0.11.5

2024-01-26


**⚡ Performance optimization**

- **@visactor/vgrammar-core**: optimize the performance of element-highlight



[more detail about v0.11.5](https://github.com/VisActor/VGrammar/releases/tag/v0.11.5)

# v0.11.4

2024-01-25


**🆕 New feature**

- **@visactor/vgrammar-core**: support data of component

**🐛 Bug fix**

- **@visactor/vgrammar-core**: fix bug of line animation when defined of line change
- **@visactor/vgrammar-core**: support `stateSort` in `mark.configure()`
- **@visactor/vgrammar-core**: fix issue with set `alphabetic` in wordcloud-shape



[more detail about v0.11.4](https://github.com/VisActor/VGrammar/releases/tag/v0.11.4)

# v0.11.3

2024-01-22


**🐛 Bug fix**

- **@visactor/vgrammar-core**: fix bug of `stateSort`, wrong useage of `stateSort`



[more detail about v0.11.3](https://github.com/VisActor/VGrammar/releases/tag/v0.11.3)

# v0.11.2

2024-01-18


**🆕 New feature**

- **@visactor/vgrammar-core**: add new params `supportsTouchEvents` and `supportsPointerEvents`



[more detail about v0.11.2](https://github.com/VisActor/VGrammar/releases/tag/v0.11.2)

# v0.11.1

2024-01-17


**🐛 Bug fix**

- **@visactor/vgrammar-core**: fix bug of `evaluate()` in View



[more detail about v0.11.1](https://github.com/VisActor/VGrammar/releases/tag/v0.11.1)

# v0.11.0

2024-01-17


**🆕 New feature**

- **@visactor/vgrammar-core**: support `connectNulls` of line/area mark
- **@visactor/vgrammar-core**: upgrade @visactor/vrender-core to locked 0.17.14

**🔨 Refactor**

- **BREAKING** **@visactor/vgrammar-core**: rename `resetTrigger` to `triggerOff` in interactions
- **BREAKING** **@visactor/vgrammar-core**: remove `runAsync` and `runSync` in view
- **@visactor/vgrammar-core**: refactor wordcloud-shape to support renderSync



[more detail about v0.11.0](https://github.com/VisActor/VGrammar/releases/tag/v0.11.0)

# v0.10.12

2024-02-28


**What's Changed**


* Fix/upgrade vrender 0.17.18 by @xile611 in https://github.com/VisActor/VGrammar/pull/334

**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.10.11...v0.10.12

[more detail about v0.10.12](https://github.com/VisActor/VGrammar/releases/tag/v0.10.12)

# v0.10.11

2024-01-22


**🆕 New feature**

- **@visactor/vgrammar-core**: upgrade vrender



[more detail about v0.10.11](https://github.com/VisActor/VGrammar/releases/tag/v0.10.11)

# v0.10.10

2024-01-18


**Bug fix**


* fix: fix bug of `getMarksBySelector()`


**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.10.9...v0.10.10

[more detail about v0.10.10](https://github.com/VisActor/VGrammar/releases/tag/v0.10.10)

# v0.10.9

2024-01-17


**What's Changed**


* feat: upgrade @visactor/vrender-core to locked 0.17.14 by @neuqzxy in https://github.com/VisActor/VGrammar/pull/310


**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.10.8...v0.10.9

[more detail about v0.10.9](https://github.com/VisActor/VGrammar/releases/tag/v0.10.9)

# v0.10.8

2024-01-12


**What's Changed**

* Fix/custom animation not take effect by @xiaoluoHe in https://github.com/VisActor/VGrammar/pull/303
* Fix/wordcloud additional padding by @skie1997 in https://github.com/VisActor/VGrammar/pull/302
* fix: fix bug of element-select and element-highlight by @xile611 in https://github.com/VisActor/VGrammar/pull/305


**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.10.7...v0.10.8

[more detail about v0.10.8](https://github.com/VisActor/VGrammar/releases/tag/v0.10.8)

# v0.10.7

2024-01-08


**What's Changed**

* fix: growPoints animtion not work for area mark by @xiaoluoHe in https://github.com/VisActor/VGrammar/pull/295
* Fix/mark overlap by @xile611 in https://github.com/VisActor/VGrammar/pull/296


**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.10.6...v0.10.7

[more detail about v0.10.7](https://github.com/VisActor/VGrammar/releases/tag/v0.10.7)

# v0.10.6

2024-01-04


**Bug fix**


* fix invalid animation when no `type` and `channel` 


**Refactor**


* expot wordcloud shapes 



[more detail about v0.10.6](https://github.com/VisActor/VGrammar/releases/tag/v0.10.6)

# v0.10.5

2023-12-29


**Bug fix**


* export gestureController in canvas-renderder



[more detail about v0.10.5](https://github.com/VisActor/VGrammar/releases/tag/v0.10.5)

# v0.10.4

2023-12-20


**What's Changed**

* Fix/shaodow host by @xile611 in https://github.com/VisActor/VGrammar/pull/286


**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.10.3...v0.10.4

[more detail about v0.10.4](https://github.com/VisActor/VGrammar/releases/tag/v0.10.4)

# v0.10.3

2023-12-19


**🐛 Bug fix**

- **@visactor/vgrammar-core**: fix the register of VRender mark in registerTextGraphic and registerBoxplotGlyph()



[more detail about v0.10.3](https://github.com/VisActor/VGrammar/releases/tag/v0.10.3)

# v0.10.2

2023-12-19


**🐛 Bug fix**

- **@visactor/vgrammar-core**: upgrade vrender to ~0.17.4

**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.10.1...v0.10.2

[more detail about v0.10.2](https://github.com/VisActor/VGrammar/releases/tag/v0.10.2)

# v0.10.1

2023-12-14


**🆕 New feature**

- **@visactor/vgrammar-core**: dispatch event in interactions



[more detail about v0.10.1](https://github.com/VisActor/VGrammar/releases/tag/v0.10.1)

# v0.10.0

2023-12-13


**What's Changed**


* Perf/differ  by @xile611 in https://github.com/VisActor/VGrammar/pull/258
* Feat/mark load on demand by @xiaoluoHe in   https://github.com/VisActor/VGrammar/pull/257
* Perf/graphic transform by @xile611 in https://github.com/VisActor/VGrammar/pull/267
* Fix/animation by @xile611  in https://github.com/VisActor/VGrammar/pull/269
* Perf/scale coordinate on need by @xile611 in https://github.com/VisActor/VGrammar/pull/270
* Size/load mark on need by @xiaoluoHe in https://github.com/VisActor/VGrammar/pull/271
* Fix/element prev attributes  by @xile611  in https://github.com/VisActor/VGrammar/pull/273
* Fix/interaction to vchart by @xile611  in https://github.com/VisActor/VGrammar/pull/276

**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.9.4...v0.10.0

[more detail about v0.10.0](https://github.com/VisActor/VGrammar/releases/tag/v0.10.0)

# v0.9.4

2023-11-29


**What's Changed**

* Fix/clear encode by @xile611 in https://github.com/VisActor/VGrammar/pull/261


**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.9.3...v0.9.4

[more detail about v0.9.4](https://github.com/VisActor/VGrammar/releases/tag/v0.9.4)

# v0.9.3

2023-11-28


**What's Changed**

* Fix/hierarchy sankey sort link by @xile611 in https://github.com/VisActor/VGrammar/pull/256
* Fix/line animation with defined by @xile611 in https://github.com/VisActor/VGrammar/pull/259


**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.9.2...v0.9.3

[more detail about v0.9.3](https://github.com/VisActor/VGrammar/releases/tag/v0.9.3)

# v0.8.7

2023-12-20


**Bug fix**


* fix the error of Dataflow

**Full Changelog**: https://github.com/VisActor/VGrammar/compare/v0.8.6...v0.8.7

[more detail about v0.8.7](https://github.com/VisActor/VGrammar/releases/tag/v0.8.7)

# v0.6.2

2023-08-21


**🆕 New feature**

- **@visactor/vgrammar**: support enableExitAnimation running config

**🐛 Bug fix**

- **vgrammar-util**: extent() should return right min, max when input string numbers
- **vgrammar**: the runtime state should not read encode from cache
- **wordcloud-shape**: fix angle of word and fix linear colorMode
- **wordcloud-shape**: fix the shapeurl of wordcloud-shape, add some test case
- **@visactor/vgrammar**: fix the invocation time for reuse



[more detail about v0.6.2](https://github.com/VisActor/VGrammar/releases/tag/v0.6.2)

