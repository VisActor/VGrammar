# Change Log - @visactor/vgrammar-core

This log was last generated on Mon, 29 Jan 2024 10:52:16 GMT and should not be manually modified.

## 0.11.6
Mon, 29 Jan 2024 10:52:16 GMT

### Updates

- fix: symbol animation of `update` may lead all the points of overlaped show again



## 0.11.5
Thu, 25 Jan 2024 12:20:07 GMT

### Updates

- perf: optimize the performance of element-highlight



## 0.11.4
Thu, 25 Jan 2024 08:14:38 GMT

### Updates

- feat: support data of component


- fix: fix bug of line animation when defined of line change


- fix: support `stateSort` in `mark.configure()`


- fix: fix issue with set `alphabetic` in wordcloud-shape

## 0.11.3
Thu, 18 Jan 2024 11:25:11 GMT

### Updates

- fix: fix bug of `stateSort`, wrong useage of `stateSort`



## 0.11.2
Thu, 18 Jan 2024 02:43:49 GMT

### Updates

- feat: add new params `supportsTouchEvents` and `supportsPointerEvents`

## 0.11.1
Wed, 17 Jan 2024 02:53:26 GMT

### Updates

- fix: fix bug of `evaluate()` in View



## 0.11.0
Mon, 15 Jan 2024 11:12:26 GMT

### Updates

- feat: support `connectNulls` of line/area mark
- feat: upgrade @visactor/vrender-core to locked 0.17.14
- refactor!: rename `resetTrigger` to `triggerOff` in interactions


- refactor!: remove `runAsync` and `runSync` in view
- refactor: refactor wordcloud-shape to support renderSync



## 0.10.7
Thu, 11 Jan 2024 02:31:38 GMT

### Updates

- fix: custom animtion with no attributes did not take effect
- fix: growPoints animtion not work for area mark 
- fix: fix the bug of invalid animation when no type and channel


- fix: fix the issue of mark-overlap which may show hidden points by user


- fix(wordcloud): slove problem of addtional padding error. fix @Visactor/VChart#1873
- feat(wordcloud): add shape of rect

## 0.10.6
Sat, 06 Jan 2024 02:08:51 GMT

### Updates

- fix: growPoints animtion not work for area mark 
- fix: fix the bug of invalid animation when no type and channel


- fix: fix the issue of mark-overlap which may show hidden points by user



## 0.10.5
Wed, 03 Jan 2024 13:41:42 GMT

### Updates

- fix: fix the bug of invalid animation when no type and channel



## 0.10.4
Fri, 29 Dec 2023 07:42:10 GMT

### Updates

- fix: upgrade vrender to ~0.17.8



## 0.10.3
Wed, 20 Dec 2023 09:35:01 GMT

### Updates

- fix: fix the register of VRender mark in registerTextGraphic and registerBoxplotGlyph()

## 0.10.2
Thu, 14 Dec 2023 11:26:29 GMT

### Updates

- fix: upgrade vrender to ~0.17.4



## 0.10.1
Thu, 14 Dec 2023 06:26:49 GMT

### Updates

- fix: upgrade vrender and vutils, fix Math.min.apply and Math.max.apply


- feat: add context api for mark
- feat: support delay after animation config
- feat: dispatch event in interactions


- fix: fix `applyGraphicAttributes()` when update elements


- fix: fix errof of animator when the graphicItem of element is null


- fix: add `clear` to `encode()` and `encodeState()` in mark


- fix: fix error of dataflow when some grammar element is release


- fix: fix the issue that hierarchy sankey cannot sort link


- fix: fix the animation issue of line when defined is set to line mark


- fix: element should reset graphicItem when `removeAllGraphicItems()` is called


- fix: fix `loadImage()` of word-cloud-shape


- perf: optimize the performance of `initGraphicItem()`, dont call hooks of adding/creating graphics


- perf: optmize the performance of initGraphicItem(), only call `onBeforeAttributeUpdate()` when need


- perf: move `enableSegments` to spec


- perf: grammar Scale and Coordinate can be registered, fix #266

## 0.9.0
Thu, 16 Nov 2023 03:42:57 GMT

### Updates

- feat: add `skipTheme` to mark to allow theme merge



## 0.8.3
Fri, 10 Nov 2023 06:09:06 GMT

### Updates

- fix: fix the issue that vrender may auto render during the asynchronous rendering


- fix: fix the error that happens when releas view during renderAsync, fix #75



## 0.8.2
Tue, 07 Nov 2023 01:49:57 GMT

_Version update only_

## 0.8.1
Wed, 25 Oct 2023 03:52:34 GMT

### Updates

- feat(vgrammar): support animation config in view spec
- feat: support DataLabel in line/area mark


- feat(sampling): add aggregation sampling methods. 

## 0.8.0
Mon, 16 Oct 2023 09:32:28 GMT

### Updates

- feat: add interactions
- fix: fix animate performance issue
- fix(vgrammar): exclude invalid animation channels when animating
- refactor: access vrender core, closed #203

## 0.7.7
Wed, 11 Oct 2023 03:13:43 GMT

### Updates

- fix: ripple should update size when update atttribute `size`



## 0.7.6
Mon, 25 Sep 2023 11:30:00 GMT

### Updates

- feat(label): pass over labelIndex in label component
- fix: the DragNDrop and Gesture's root should be stage

## 0.7.5
Fri, 22 Sep 2023 10:00:55 GMT

### Updates

- fix: rollup the parsing of scale field data, dont concat array data



## 0.7.4
Fri, 22 Sep 2023 03:30:25 GMT

### Updates

- chore: fix exports in package.json


- fix(vgrammar): exclude invalid animation channels when animating

## 0.7.3
Tue, 19 Sep 2023 04:05:09 GMT

_Version update only_

## 0.7.2
Fri, 15 Sep 2023 06:47:03 GMT

_Version update only_

## 0.7.1
Fri, 15 Sep 2023 03:38:22 GMT

### Updates

- fix: fix the register functions of animations
- chore: fix the release workflow

## 0.7.0
Thu, 14 Sep 2023 12:34:20 GMT

_Version update only_

## 0.6.6
Fri, 01 Sep 2023 07:09:07 GMT

### Updates

- fix(grammar): rebuild layout tree when grammar updated
- fix: fix unit animation parameters

## 0.6.5
Wed, 30 Aug 2023 02:56:06 GMT

### Updates

- fix: when add `enableSegments` in group encode, the area should be render rightly


- fix: group mark has no groupKey, but can still has group encode


- perf: group mark use simple evaluateJoin()



## 0.6.4
Fri, 25 Aug 2023 10:01:25 GMT

### Updates

- fix: fix the exit mark animation error
- fix: group mark should support group encode


- fix(vgrammar): fix hooks of vgrammar


- fix: when a symbol has `symbolType` and `shape` at the same time, use `shape` in higher Priority


- fix: fix `maxLineWidth` of text attributes, the order of attribute may produce different result


- ix(wordCloud): layout stack when size is decimal. fix VisActor/VChart #561

## 0.6.3
Thu, 24 Aug 2023 06:39:36 GMT

### Updates

- fix: fix the exit mark animation error
- fix(vgrammar): fix hooks of vgrammar


- fix: when a symbol has `symbolType` and `shape` at the same time, use `shape` in higher Priority


- fix: fix `maxLineWidth` of text attributes, the order of attribute may produce different result



## 0.6.2
Fri, 18 Aug 2023 11:16:01 GMT

### Patches

- fix: fix the invocation time for reuse
- feat: support enableExitAnimation running config

### Updates

- fix(vgrammar-util): extent() should return right min, max when input string numbers


- fix(vgrammar): the runtime state should not read encode from cache


- fix(wordcloud-shape): fix angle of word and fix linear colorMode


- fix(wordcloud-shape): fix the shapeurl of wordcloud-shape, add some test case



## 0.6.1
Mon, 14 Aug 2023 14:32:16 GMT

### Updates

- fix: fix the exit animation parameters, fix #111
- fix: fix the grow animation problem caused by x1y1 channel
- fix: group encode may throw error when data is empty in line/area


- fix: fix the error of undefined stage
- fix(wordcloud): fix type of wordcloud and same bad cases

## 0.6.0
Fri, 11 Aug 2023 12:36:20 GMT

### Minor changes

- feat: add bin & kde & contour transform
-  feat: scale can use multiple data to calculate domain and range
- feat: provide silhouette & wiggle offset for stack transform to support stream graph
- feat: support group tooltip & dimension tooltip
- feat: add violin glyph
- feat: tooltip support custom callback
- feat: access arc label component

### Patches

- feat: add option `flatten` and `maxDepth` of  hierarchy transforms


- feat: support mark reenter
- style: use latest vrender and rename global to vglobal

## 0.5.5
Fri, 11 Aug 2023 09:49:40 GMT

### Updates

- fix(wordcloud): minFontSize should be greater than 0 in CloudLayout, dont try infinity, fix #117

## 0.5.4
Thu, 10 Aug 2023 01:56:52 GMT

### Updates

- fix(vgrammar): fix the issue when parse segements of an area mark and fill is a gradient, fix #101



## 0.5.3
Fri, 04 Aug 2023 09:34:18 GMT

### Updates

- fix(wordCloud): support wordCloud Chart with negative data and one data. fix VisActor/VChart#299, fix VisActor/VChart#373

## 0.5.2
Thu, 03 Aug 2023 08:39:42 GMT

### Patches

- fix(vgrammar-wordcloud): fix the issue of wordcloud error reporting in non-integer canvas wh
- fix(vgrammar): glyph should merge prev attrs when add a state, fix the issue of sankey state



### Updates

- fix(wordcloud): wordcloud should not throw error when the size is very small, fix #91



## 0.5.1
Thu, 27 Jul 2023 09:58:52 GMT

_Version update only_

## 0.5.0
Thu, 27 Jul 2023 07:37:24 GMT

### Minor changes

- add all animation start&end events

### Patches

- fix(vgrammar): wordcloud may return a empty value which cause a error



## 0.4.1
Fri, 21 Jul 2023 11:04:10 GMT

### Patches

- fix: upgrade vutils from ~0.13.0 to ~0.13.3, use Logger of vutils



## 0.4.0
Wed, 19 Jul 2023 11:20:25 GMT

### Minor changes

- feat: emit event AFTER_VRENDER_NEXT_RENDER when finished render of VRender stage



### Patches

- fix animation parameters for callbacks
- feat: add new parameters `pluginList` of IRendererOptions


- feat(vgrammar-projection): update api of Projection


- stop all animations when release

## 0.3.3
Wed, 12 Jul 2023 10:47:26 GMT

### Patches

- fix(vgrammar): fix issue when update state, data of line/area, the graphic item may use old points



## 0.3.2
Fri, 07 Jul 2023 04:16:33 GMT

### Patches

- fix: remove useless api of View: `ignoreRender()`, fix the definition of `IViewConstructor`
- feat: add a new api `getImageBuffer` to View


- fix: crosshair can read `radius` and `center` from encode result, fix #42


- feat: add config `align` to layout config, fix #43



## 0.3.1
Fri, 30 Jun 2023 09:22:01 GMT

### Patches

- fix: remove deprecated options of view


- fix: remove unneed transform of interval


- fix: the component should read the new spec not old spec

## 0.3.0
Wed, 28 Jun 2023 03:31:17 GMT

### Minor changes

- fix: remove useless function


- chore: update tsconfig.test.json for every package



### Patches

- fix: update `cornerRadius` channels:

remove `cornerRadiusTopLeft`, `cornerRadiusTopRight`,
cornerRadiusBottomRight`, `cornerRadiusBottomLeft`
of rect and group mark


- call render immediately in evaluateSync

## 0.2.1
Tue, 20 Jun 2023 11:14:05 GMT

### Patches

- fix: update version to 0.2.0



## 0.1.0
Tue, 20 Jun 2023 10:58:16 GMT

### Minor changes

- fix: implement tree-path by glyph with three path, close #27

### Patches

- fix: update version of VRender from 0.9.2-fill-stroke.9 to 0.10.3
- fix: update version of @visactor/vrender
- fix the animation error when element is released
- chore: fix change-all when no commit


- fix: add global.d.ts to every package


- refactor: update version of VRender, remove fillColor and strokeColor

## 0.0.10
Wed, 07 Jun 2023 08:59:10 GMT

### Patches

- init

