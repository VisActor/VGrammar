# Change Log - @visactor/vgrammar-core

This log was last generated on Thu, 27 Feb 2025 04:26:31 GMT and should not be manually modified.

## 0.15.7
Thu, 27 Feb 2025 04:26:31 GMT

### Updates

- fix: when sankey has `setNodeLayer`, the maxDepth should be updated by this



## 0.15.6
Thu, 13 Feb 2025 09:57:00 GMT

### Updates

- fix: upgrade vrender to 0.21.15, vutils to 0.19.14


- fix: fix default param for animator stop

## 0.15.5
Thu, 16 Jan 2025 02:27:52 GMT

_Version update only_

## 0.15.4
Wed, 15 Jan 2025 07:59:52 GMT

### Updates

- feat: add customInsertZerosToArray in wordcloud #619
- fix loop animation release

## 0.15.3
Tue, 07 Jan 2025 02:01:38 GMT

_Version update only_

## 0.15.2
Mon, 23 Dec 2024 10:47:20 GMT

### Updates

- feat: add `clickInterval` and `autoPreventDefault` event config
- fix: fix `minNodeHeight` of sankey when set `nodeGap`



## 0.15.1
Fri, 13 Dec 2024 02:22:10 GMT

_Version update only_

## 0.15.0
Thu, 05 Dec 2024 09:52:00 GMT

### Updates

- feat: support overflow of mark


-  feat: add interaction for highlight/select by graphic name
- feat: add `graphicName` in markOption

## 0.14.18
Thu, 05 Dec 2024 08:32:52 GMT

_Version update only_

## 0.14.17
Wed, 04 Dec 2024 08:35:52 GMT

### Updates

- feat: support `maxNodeHeight` and `maxLinkHeight`, `crossNodeAlign` value `parent` in sankey


- feat: add `autoRefresh` to stage


-   fix: fix the issue of animation cannot be cleared for reused mark
- fix: glyph state should work when resize


- fix: support react and html attributes in textmark



## 0.14.16
Thu, 21 Nov 2024 07:41:48 GMT

### Updates

- fix: fix reset of interactions



## 0.14.15
Fri, 15 Nov 2024 10:20:09 GMT

_Version update only_

## 0.14.14
Wed, 13 Nov 2024 08:04:50 GMT

### Updates

- fix: fix error of shrink in wordcloud when set markShape to be "triangle"



## 0.14.13
Thu, 31 Oct 2024 06:06:34 GMT

_Version update only_

## 0.14.12
Thu, 31 Oct 2024 01:16:05 GMT

_Version update only_

## 0.14.11
Wed, 23 Oct 2024 12:22:58 GMT

### Updates

-  feat: add animation control option `ignoreLoopFinalAttributes`

## 0.14.10
Tue, 15 Oct 2024 05:53:02 GMT

### Updates

- fix: fix error when clear states



## 0.14.9
Fri, 27 Sep 2024 06:59:12 GMT

_Version update only_

## 0.14.8
Thu, 26 Sep 2024 11:24:04 GMT

### Updates

- fix: fix animation state of wordcloud



## 0.14.7
Fri, 20 Sep 2024 07:21:17 GMT

### Updates

- fix: fix event delegate of view


-  fix: disable morph when resize

## 0.14.6
Thu, 12 Sep 2024 07:43:11 GMT

### Updates

- fix: limit of layout-try-count not as expected
- fix: fix error of wordcloud when no animate



## 0.14.5
Sat, 07 Sep 2024 11:11:13 GMT

### Updates

- fix: fix error of vchart when no `animate`



## 0.14.4
Thu, 05 Sep 2024 04:10:51 GMT

_Version update only_

## 0.14.3
Thu, 05 Sep 2024 02:50:22 GMT

_Version update only_

## 0.14.2
Mon, 02 Sep 2024 10:59:02 GMT

### Updates

- fix: fix the issue of merging data in label component
- fix: fix animation of word-cloud-shape



## 0.14.1
Mon, 02 Sep 2024 02:02:24 GMT

### Updates

- feat: treemap transform supports custom valueField
- feat: support inverse of sankey


- fix: fix error of no animation when direction change


- fix: fix warning about `willReadFrequently`


- perf: optimize performance of label component

## 0.14.0
Thu, 15 Aug 2024 08:29:53 GMT

### Updates

- feat: support event `afterWordcloudShapeDraw`


- feat: support text mask in wordcloud
- fix: optimize size of text mask in word-cloud-shape when fontStyle is italic



## 0.13.20
Tue, 13 Aug 2024 10:55:34 GMT

_Version update only_

## 0.13.19
Tue, 06 Aug 2024 05:55:48 GMT

_Version update only_

## 0.13.18
Mon, 05 Aug 2024 10:07:22 GMT

_Version update only_

## 0.13.17
Thu, 01 Aug 2024 01:58:50 GMT

### Updates

- fix: upgrade to vrender 0.19.20



## 0.13.16
Wed, 24 Jul 2024 10:07:24 GMT

### Updates

- fix: fix error style of line,area when has segments


- fix: fix error of mark overlap when data is invalid


- fix: fix initial attributes for reused glyph
- fix: fix wrong gap between node when `minNodeHeight` is very big


- fix: fix group grammar releasing

## 0.13.15
Tue, 16 Jul 2024 03:36:00 GMT

### Updates

- fix: fix height of link when set `minNodeHeight`



## 0.13.11
Fri, 28 Jun 2024 13:42:24 GMT

### Updates

- fix: fix the animation config update
- fix: fix the points generation for grow animation

## 0.13.10
Wed, 26 Jun 2024 10:56:09 GMT

### Updates

- fix: animation attr not update when updatespec twice immediately
- fix: fix the defined channel when it change from `update` to `group`


- feat: add options to avoid finalAttr undefined of animation
- fix: fix circular reference in hierarchy-data in sankey


- fix: upgrade vrender to 0.19.14, vutils to 0.18.10



## 0.13.9
Fri, 14 Jun 2024 13:12:38 GMT

### Updates

- fix: upgrade vrender to 0.19.11


- fix: fix issue of fade animation error

## 0.13.6
Wed, 05 Jun 2024 09:41:14 GMT

### Updates

- fix: fix useState when realtime encoder is assigned


- feat: optimize the option `minLinkHeight` of sankey



## 0.13.4
Fri, 24 May 2024 10:35:14 GMT

### Updates

- fix: upgrade vrender to 0.19.5, vutils to 0.18.9



## 0.13.3
Fri, 17 May 2024 09:45:56 GMT

### Updates

- feat: upgrade vrender version to 0.19.3
- fix: adapt custom animation to different vrender version

## 0.13.2
Wed, 08 May 2024 06:09:28 GMT

### Updates

- feat: update version of vutils and use `seedRandom`



## 0.13.1
Tue, 07 May 2024 07:49:59 GMT

### Updates

- fix: sankey should return right style when value is string value



## 0.13.0
Mon, 06 May 2024 02:27:58 GMT

### Updates

- fix: upgrade vrender to 0.19.0


- feat: add more options of sankey



## 0.12.11
Wed, 24 Apr 2024 11:28:37 GMT

_Version update only_

## 0.12.10
Tue, 23 Apr 2024 03:09:31 GMT

### Updates

- fix: aniamtion will produce error status when a mark is encode twice, and to is empty



## 0.12.9
Tue, 23 Apr 2024 02:53:09 GMT

### Updates

- fix: fix `calculateNodeValue()` in vgrammar-hierrachy to support string value, fix #433


- fix: upgrade vrender from 0.18.8 to 0.18.13



## 0.12.8
Thu, 28 Mar 2024 01:56:55 GMT

### Updates

- fix: fix error when release element in stage event


- fix: upgrade vrender to 0.18.8



## 0.12.7
Mon, 25 Mar 2024 10:45:05 GMT

### Updates

- feat: interaction app new api `getStarState()`



## 0.12.6
Fri, 22 Mar 2024 09:09:47 GMT

### Updates

- feat: support `ReactDOM` in view options


- fix: prevent animation attributes when binding
- fix: fix error of component when the graphic component is not registered



## 0.12.5
Wed, 20 Mar 2024 02:34:58 GMT

### Updates

- feat: support `graphicItem` in `BEFORE_ADD_VRENDER_MARK` and `AFTER_ADD_VRENDER_MARK` hooks


- feat: support event of roam when no scale and bind components


- fix: `triggerOff: none` should close end event of interactions


- fix: unmount interaction component before releasing
- fix: fix memory leak when reuse a mark


- fix: the `pickable` in encoder should overwrite the `spec.pickable`


- fix: fix rangeFactor of view-scroll



## 0.12.4
Wed, 13 Mar 2024 02:24:03 GMT

### Updates

- fix: upgrade vrender to 0.18.5 to fix issue of brush



## 0.12.3
Tue, 12 Mar 2024 11:51:39 GMT

### Updates

- fix: stage events should be released



## 0.12.2
Tue, 12 Mar 2024 02:20:55 GMT

### Updates

- fix: fix end attributes of conflict animation



## 0.12.1
Tue, 05 Mar 2024 07:23:56 GMT

### Updates

- fix: upgrade vrender to 0.18.1



## 0.12.0
Thu, 29 Feb 2024 12:26:20 GMT

_Version update only_

## 0.11.14
Wed, 28 Feb 2024 08:33:40 GMT

_Version update only_

## 0.11.12
Wed, 28 Feb 2024 05:16:58 GMT

### Updates

- feat: pass ticker to createStage params

## 0.11.11
Wed, 07 Feb 2024 03:12:22 GMT

### Updates

- feat: support `clipPath` in mark

## 0.11.10
Sun, 04 Feb 2024 05:45:15 GMT

### Updates

- fix: fix render error when update marks



## 0.11.9
Fri, 02 Feb 2024 09:27:19 GMT

### Updates

- refactor: refactor progressive render of mark, fix render glyph in progressive



## 0.11.8
Thu, 01 Feb 2024 10:33:55 GMT

### Updates

- fix: update datazoom when reusing

## 0.11.7
Wed, 31 Jan 2024 09:11:36 GMT

### Updates

- fix: fix the bug of line/area when has only one point


- fix: fix the error of tooltip that tooltip may be released after chart update



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

