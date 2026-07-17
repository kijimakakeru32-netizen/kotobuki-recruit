# 公開手順（GitHub → Netlify）

このフォルダは、そのまま公開できる状態になっています。
所要時間は初回で15〜20分ほどです。

---

## 公開前チェック（重要）

- [ ] `js/config.js` の `line.url` を**本物のLINE URL**に変更する
      （現在は仮の `https://lin.ee/XXXXXXX` です。ここを直さないと全ボタンが無効なリンクになります）
- [ ] 研修制度セクションの本文・写真（仮テキストのまま）
- [ ] 入社までの流れの説明文（仮テキストのまま）

上2つは公開後に直しても問題ありません（後述の「更新のしかた」参照）。
LINE URLだけは公開前に必ず差し替えてください。

---

## STEP 1. GitHubにリポジトリを作る

1. https://github.com/ にログイン（アカウントがなければ無料で作成）
2. 右上の「＋」→ **New repository**
3. 入力内容：
   - Repository name: `kotobuki-recruit`
   - 公開設定: **Private**（非公開）でOK。Netlifyとは連携できます
   - 「Add a README file」等のチェックは**すべて外す**
4. **Create repository** をクリック

## STEP 2. ファイルをアップロードする

作成直後の画面に **uploading an existing file** というリンクがあるのでクリック。
（見当たらない場合は Add file → Upload files）

1. このフォルダの中身を**フォルダごと全部**ドラッグ＆ドロップ
   - `index.html` `story.html` などのHTML
   - `css` `js` `assets` の3フォルダ
   - `netlify.toml` `.gitignore` `README.md` `DEPLOY.md`
   - ※ zipのままではなく、**解凍した中身**を入れてください
2. 下の「Commit changes」ボタンを押す

これでGitHub側の準備は完了です。

## STEP 3. Netlifyと連携する

1. https://www.netlify.com/ にアクセス → **Sign up**
2. 「Sign up with GitHub」を選ぶと連携が楽です
3. ログイン後 **Add new site** → **Import an existing project**
4. **Deploy with GitHub** を選択 → 初回は権限の許可を求められるので承認
5. リポジトリ一覧から `kotobuki-recruit` を選ぶ
6. 設定画面が出ますが、`netlify.toml` を用意してあるので**そのまま**でOK
   - Build command: 空欄
   - Publish directory: `.`
7. **Deploy site** をクリック

1〜2分で公開されます。`https://ランダムな名前.netlify.app` というURLが発行されます。

## STEP 4. サイト名を変える（任意）

Site configuration → Site details → **Change site name** で
`kotobuki-recruit` などに変更すると `https://kotobuki-recruit.netlify.app` になります。

## STEP 5. 独自ドメインを使う（任意）

Domain management → **Add a domain** から独自ドメイン（例: recruit.kotobuki-seitai.jp）を設定できます。
ドメイン提供会社側でDNS設定が必要になるため、必要であればご相談ください。
SSL（https化）はNetlifyが自動で行います。

---

## 更新のしかた

### 文言・写真を変えたいとき

1. GitHubでリポジトリを開く
2. 変えたいファイルを開く（文言なら `js/config.js`）
3. 鉛筆アイコン（Edit this file）をクリックして編集
4. 下の **Commit changes** を押す

→ **1〜2分で自動的に本番サイトへ反映されます。**（Netlifyが自動で公開し直します）

写真を差し替えるときは、`assets/img` フォルダを開いて Add file → Upload files から
**同じファイル名**でアップロードすれば置き換わります。

### 公開前に見た目を確認したいとき

Netlifyは、変更のたびに本番とは別の「プレビューURL」も作ります。
Deploys タブから各更新の内容と、失敗していないかを確認できます。

---

## 困ったときは

- **サイトが真っ白になった** → `js/config.js` の編集ミスの可能性大。カンマ `,` や引用符 `"` の消し忘れが原因のことが多いです。GitHubのHistoryから1つ前に戻せます
- **画像が表示されない** → ファイル名の大文字小文字を確認（`Photo.jpg` と `photo.jpg` は別物として扱われます）
- **変更が反映されない** → Netlifyの Deploys タブで公開が完了しているか確認。ブラウザの再読み込み（Ctrl+F5 / Cmd+Shift+R）もお試しください
