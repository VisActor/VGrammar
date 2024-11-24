<div align="center">
  <a href="https://github.com/VisActor#gh-light-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_light.svg"/>
  </a>
  <a href="https://github.com/VisActor#gh-dark-mode-only" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/logo_500_200_dark.svg"/>
  </a>
</div>

<div align="center">
  <h1>VGrammar</h1>
</div>

<div align="center">

VGrammarは、チャートを生成するだけでなく、データビジュアライゼーションツールも提供します。

<p align="center">
  <a href="https://www.visactor.io/vgrammar">紹介</a> •
  <a href="https://www.visactor.io/vgrammar/example">デモ</a> •
  <a href="https://www.visactor.io/vgrammar/guide/guides/quick-start">チュートリアル</a> •
  <a href="https://www.visactor.io/vgrammar/api/API/View">API</a>•
  <a href="https://www.visactor.io/vgrammar/option/">オプション</a>
</p>

![image test](https://github.com/visactor/vgrammar/actions/workflows/bug-server.yml/badge.svg?event=push)
![unit test](https://github.com/visactor/vgrammar/actions/workflows/unit-test.yml/badge.svg?event=push)
[![npm Version](https://img.shields.io/npm/v/@visactor/vgrammar.svg)](https://www.npmjs.com/package/@visactor/vgrammar)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vgrammar.svg)](https://www.npmjs.com/package/@visactor/vgrammar)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vgrammar/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | [简体中文](./README.zh-CN.md) | 日本語

</div>

<div align="center">

（ビデオ）

</div>

# 紹介

VGrammarは、ビジュアルレンダリングエンジン[VRender](https://github.com/VisActor/VRender)に基づくビジュアルグラマライブラリです。主な機能は以下の通りです：

1. デフォルトで使いやすい：VGrammarは簡潔な構文、包括的なインターフェース、豊富なコンポーネントライブラリ、簡素化された開発プロセスを特徴としています。
2. 機能が豊富：VGrammarは、チャート定義、アニメーションの配置、芸術的表現など、さまざまなニーズを完全にカバーする広範な機能を提供します。
3. 柔軟で拡張可能：VGrammarは、カスタムレンダリング、データマッピング、自動レイアウトなど、柔軟な拡張オプションを提供し、簡単に拡張できます。

# リポジトリの紹介

このリポジトリには以下のパッケージが含まれています：

1. VGrammar: VGrammarのメインパッケージ

# 使用方法

## インストール

[npm package](https://www.npmjs.com/package/@visactor/vgrammar)

```bash
// npm
npm install @visactor/vgrammar

// yarn
yarn add @visactor/vgrammar
```

## クイックスタート

```javascript
import { View } from '@visactor/vgrammar';

const spec = {
  data: [
    {
      id: 'table',
      values: [
        {
          value: 3676,
          name: ' ~ 29'
        },
        {
          value: 3872,
          name: '30 ~ 39'
        },
        {
          value: 1668,
          name: '40 ~ 49'
        },
        {
          value: 610,
          name: '50 ~'
        }
      ]
    },
    {
      id: 'pie',
      source: 'table',
      transform: [
        {
          type: 'pie',
          field: 'value',
          asStartAngle: 'startAngle',
          asEndAngle: 'endAngle'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'colorScale',
      type: 'ordinal',
      domain: { data: 'table', field: 'name' },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
      ]
    }
  ],

  marks: [
    {
      type: 'arc',
      from: { data: 'pie' },
      dependency: ['viewBox', 'colorScale'],
      encode: {
        update: (datum, element, params) => {
          const viewBox = params.viewBox;
          const maxR = Math.min(viewBox.width() / 2, viewBox.height() / 2);
          return {
            x: viewBox.x1 + viewBox.width() / 2,
            y: viewBox.y1 + viewBox.height() / 2,
            startAngle: datum.startAngle,
            endAngle: datum.endAngle,
            innerRadius: 100,
            outerRadius: maxR,
            fill: params.colorScale.scale(datum.name)
          };
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: 'chart',
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();
```

##

[詳細なチュートリアルとデモ](https://visactor.io/vgrammar)

# 関連リンク

- [公式サイト](https://visactor.io/vgrammar)

# エコシステム

| プロジェクト                                                     | 説明                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [VChart](https://visactor.io/vchart)                        | [VisActor/VGrammar](https://visactor.io/vgrammar)に基づくチャートライブラリ                |
| [Reactコンポーネントライブラリ](https://visactor.io/react-vchart) | [VisActor/VChart](https://visactor.io/vchart)に基づくReactチャートコンポーネントライブラリ |
| [AI生成コンポーネント](https://visactor.io/ai-vchart)    | AI生成のチャートコンポーネント                                                          |

# 貢献

貢献したい場合は、まず[行動規範](./CODE_OF_CONDUCT.md)と[ガイド](./CONTRIBUTING.md)をお読みください。

小さな流れが大きな川や海に集まります！

<a href="https://github.com/visactor/vgrammar/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vgrammar" /></a>

# ライセンス

[MITライセンス](./LICENSE)
