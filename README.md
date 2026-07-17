# 整体KOTOBUKI 採用サイト｜更新マニュアル

コードが書けなくても大丈夫です。**編集するファイルは `js/config.js` の1つだけ**です。

---

## 1. 文章・リンクを変更する

1. `js/config.js` をメモ帳やVSCodeなどで開く
2. `"ダブルクォート"` の中の文字だけを書き換える
3. 保存してブラウザを再読み込み（更新されないときは Ctrl+Shift+R）

### よく使う場所
| 変更したいもの | config.js の場所 |
|---|---|
| LINEのURL | `line.url` ※最初に必ず本物のURLに差し替えてください |
| LINEボタンの文言 | `line.buttonText` / `line.stickyText` |
| ファーストビューのコピー | `hero.copyLines` / `hero.sub` |
| 店舗の追加・削除 | `map.prefectures` に1行足す／消すだけ |
| インタビュー本文 | `interview.people` の `answers` |
| 募集要項 | `requirements.rows` |

### ルール
- 行末の `,`（カンマ）は消さない
- 文中で改行したいときは `\n` と書く（募集要項などで使用済み）

## 2. 写真を差し替える

1. 写真を `assets/img/` フォルダに入れる（例: `mochizuki.jpg`）
2. `config.js` の該当箇所にファイル名を書く
   ```js
   photo: "assets/img/mochizuki.jpg",
   ```
3. `img: ""` のまま空にしておくと、グレーの仮枠が表示されます

**推奨サイズ（目安）**
- ファーストビュー: 横1920px以上（横長）
- スライダー: 横1200px程度（4:3）
- インタビュー顔写真: 縦長（3:3.5くらい）

## 3. 公開する（GitHub → Netlify / Vercel）

このサイトはビルド不要の静的サイトです。フォルダをそのままアップすれば動きます。

1. GitHubにこのフォルダ一式をリポジトリとしてアップロード
2. Netlify（または Vercel）で「Import from Git」→ このリポジトリを選択
3. Build command: **なし（空欄）** / Publish directory: **/（ルート）**
4. Deploy を押すだけで公開されます。以後はGitHubにpushするたび自動反映

## 4. ファイル構成

```
index.html                 トップページ
story.html                 創業ストーリー（ワイヤーフレーム）
message.html               代表メッセージ（ワイヤーフレーム）
interview-mochizuki.html   インタビュー：望月さん
interview-kikuchi.html     インタビュー：菊池さん
interview-utsugi.html      インタビュー：打木さん
css/style.css              デザイン（触らなくてOK）
js/config.js               ★ここだけ編集する
js/main.js                 表示プログラム（触らなくてOK）
assets/img/                写真を入れるフォルダ
```
