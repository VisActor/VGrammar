# Change Log - @visactor/vgrammar

This log was last generated on Wed, 12 Jul 2023 10:47:26 GMT and should not be manually modified.

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

