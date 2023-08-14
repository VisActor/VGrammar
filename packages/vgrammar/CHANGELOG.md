# Change Log - @visactor/vgrammar

This log was last generated on Mon, 14 Aug 2023 14:32:16 GMT and should not be manually modified.

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

