# せんのぼうけん

タッチペンで道をなぞり、キャラをゴールまで進める練習アプリです。

## 公開URL

GitHub Pagesを有効にすると、次のURLで公開されます。

https://haruki-ai-lab.github.io/touch_pen_practice/

## 機能

- キャラ選択: でんしゃ、くるま、どうぶつ、きょうりゅう
- 道テーマ: せんろ、どうろ、くさのみち、ジャングルのみち
- せんのみち: 全50コース
- ひらがなへのみち: 現代仮名遣いの基本46字を五十音順に収録
- カタカナへのみち: 現代仮名遣いの基本46字を五十音順に収録
- かんじへのみち: 小学1年生80字、2年生160字、3年生200字の全440字。学年ごとにページを切り替え、一画ずつ順番に書いて画ごとにペンを離す
- 難易度: かんたん、ふつう、むずかしい。最初の画面で選択
- 入力: Pointer Eventsでタッチペン、指、マウスに対応
- 判定: かんたんは従来方式。ふつう・むずかしいは、道への近さ、ゴール進度、往復、余分な移動距離、速すぎなさを100点満点で表示。ふつうは丁寧に書けた95点以上の高得点帯を少し取りやすく調整
- 記録: 難易度別・コース別の最高得点をブラウザ内に保存

かなと漢字の筆順パスにはKanjiVGを利用しています。ライセンスと変更内容は `THIRD_PARTY_NOTICES.md` に記載しています。

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
├── THIRD_PARTY_NOTICES.md
├── .nojekyll
└── src/
    ├── app.js
    ├── courses.js
    ├── kana-courses.js
    ├── kanji-courses.js
    ├── styles.css
    └── themes.js
```
