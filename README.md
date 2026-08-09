# せんのぼうけん

タッチペンで道をなぞり、キャラをゴールまで進める練習アプリです。

## 公開URL

GitHub Pagesを有効にすると、次のURLで公開されます。

https://haruki-ai-lab.github.io/touch_pen_practice/

## 機能

- キャラ選択: でんしゃ、くるま、どうぶつ、きょうりゅう
- 道テーマ: せんろ、どうろ、くさのみち、ジャングルのみち
- コース: 全50コース
- かんじへのみち: 二、十、人、川、三、小の6コース。一画ずつ順番に書き、画ごとにペンを離す
- 難易度: かんたん、ふつう、むずかしい。最初の画面で選択
- 入力: Pointer Eventsでタッチペン、指、マウスに対応
- 判定: かんたんは従来方式。ふつう・むずかしいは、道への近さ、ゴール進度、往復、余分な移動距離、速すぎなさを100点満点で表示
- 記録: 難易度別・コース別の最高得点をブラウザ内に保存

## GitHub Pages設定

リポジトリのSettingsで次のように設定します。

- Source: Deploy from a branch
- Branch: main
- Folder: /(root)

## 構成

```text
.
├── index.html
├── manifest.json
├── .nojekyll
└── src/
    ├── app.js
    ├── courses.js
    ├── kanji-courses.js
    ├── styles.css
    └── themes.js
```
