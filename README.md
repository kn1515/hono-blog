## hono-blog

Hono / Honox + Vite で構築したブログ用プロジェクトです。Cloudflare Pages にデプロイすることを前提にしています。

## 必要環境

- Node.js
- pnpm
- Cloudflare アカウント（Pages / API トークン用）

## セットアップ

依存関係のインストール:

```bash
pnpm install
```

## 開発サーバーの起動

ローカルでブログを確認する場合:

```bash
pnpm dev
```

Vite の開発サーバーが起動し、ブラウザから確認できます。

## ビルド

本番用のビルドを作成する場合:

```bash
pnpm build
```

`dist/` ディレクトリに Cloudflare Pages へデプロイ可能な成果物が生成されます。

## デプロイ（Cloudflare Pages）

wrangler を使って Cloudflare Pages にデプロイします。

1. Cloudflare ダッシュボードで API トークンを作成し、`CLOUDFLARE_API_TOKEN` として CI / ローカル環境に設定します。
2. 以下のスクリプトでビルドとデプロイを行えます:

```bash
pnpm deploy
```

`package.json` 内のスクリプトは以下のようになっています:

- `pnpm dev` : 開発サーバー起動
- `pnpm build` : クライアント + サーバーのビルド
- `pnpm preview` : wrangler pages dev でローカル確認
- `pnpm deploy` : ビルドして Cloudflare Pages へデプロイ

## ライセンス

詳細は LICENSE ファイルを参照してください。

---

## 記事の作成方法

### 1. ファイルを作成

`app/routes/posts/<slug>/index.mdx` にファイルを作成します。`<slug>` が記事の URL パスになります。

```
app/routes/posts/
  my-new-post/
    index.mdx          ← 記事本文
    thumbnail.png      ← 記事内で使う画像（任意）
```

### 2. Frontmatter を記述

ファイルの先頭に YAML 形式の frontmatter を書きます。

```yaml
---
title: "記事タイトル"
date: 2026-02-23T00:00:00
description: "記事の概要（一覧やOGPに使われます）"
categories:
  - カテゴリ名
tags:
  - タグ1
  - タグ2
image: "/posts/my-new-post/thumbnail.png"
pinned: true
---
```

| プロパティ | 型 | 必須 | 説明 |
|---|---|---|---|
| `title` | `string` | ✅ | 記事タイトル |
| `date` | `string` | ✅ | 公開日（ISO 8601 形式） |
| `description` | `string` | ✅ | 記事の概要 |
| `categories` | `string[]` | ✅ | カテゴリ一覧 |
| `tags` | `string[]` | — | タグ一覧 |
| `image` | `string` | — | サムネイル画像パス |
| `ogImage` | `string` | — | OGP 画像パス |
| `pinned` | `boolean` | — | `true` にするとトップページのヒーローセクションに表示 |

### 3. 本文を書く

Frontmatter の下に Markdown（MDX）で本文を書きます。`{/* <!--more--> */}` を挿入すると、その位置までが一覧ページの抜粋として使われます。

```mdx
---
title: "サンプル記事"
date: 2026-02-23T00:00:00
description: "これはサンプル記事です。"
categories:
  - よもやま
---

ここに導入文を書きます。

{/* <!--more--> */}

## 見出し

本文の続き...
```

### 4. 画像の追加

記事と同じディレクトリに画像を配置し、相対パスで参照します。

```mdx
![代替テキスト](./screenshot.png)
```

---

## カスタムタグ一覧

MDX 内で使えるカスタムコンポーネントです。`import` は**不要**です（`useMDXComponents` で自動登録済み）。

---

### `<Toc>` — 目次

記事に目次を表示します。アクセントカラー付きの枠線ボックスでスタイリングされます。

```mdx
<Toc>
- セクション1
- セクション2
  - サブセクション2-1
- セクション3
</Toc>
```

タイトルを変更する場合:

```mdx
<Toc title="Contents">
- ...
</Toc>
```

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `title` | `string` | `"目次"` | 目次ヘッダーのテキスト |

---

### `<Marker>` — 蛍光ペンハイライト

テキストに蛍光ペン風のハイライトを付けます。

```mdx
<Marker>黄色ハイライト（デフォルト）</Marker>
<Marker color="pink">ピンクハイライト</Marker>
<Marker color="green">グリーンハイライト</Marker>
<Marker color="blue">ブルーハイライト</Marker>
```

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `color` | `"yellow"` \| `"pink"` \| `"green"` \| `"blue"` | `"yellow"` | ハイライトの色 |

---

### `<Bold>` — 太字＋色付き

太字テキストを表示します。色を指定すると文字色も変わります。

```mdx
<Bold>太字テキスト</Bold>
<Bold color="red">赤い太字</Bold>
<Bold color="#e11d48">カスタムカラーの太字</Bold>
```

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `color` | `string` | 継承 | CSS カラー値 |

---

### `<Underline>` — 下線

テキストに下線を引きます。デフォルトはアクセントカラーです。

```mdx
<Underline>アクセントカラーの下線</Underline>
<Underline color="red">赤い下線</Underline>
<Underline color="#3b82f6">ブルーの下線</Underline>
```

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `color` | `string` | `var(--c-accent)` | 下線の CSS カラー値 |

---

### `<TextColor>` — 文字色変更

テキストの色を変更します。

```mdx
<TextColor color="red">赤いテキスト</TextColor>
<TextColor color="#8b5cf6">紫のテキスト</TextColor>
<TextColor>アクセントカラー（デフォルト）</TextColor>
```

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `color` | `string` | `var(--c-accent)` | 文字の CSS カラー値 |

---

### `<Note>` — 補足情報ボックス

青色の背景にインフォアイコン付きの補足ボックスを表示します。

```mdx
<Note>
  これは補足情報です。重要なポイントを伝えたい時に使います。
</Note>
```

---

### `<BlockLink>` — ブロックリンク

ブロック要素として目立つリンクを配置します。

```mdx
<BlockLink href="https://amzn.asia/d/example">
  おすすめの書籍タイトル
</BlockLink>
```

| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `href` | `string` | ✅ | リンク先 URL |

---

### `<ExLinkCard>` — 外部リンクカード

URL を指定すると OGP 情報を取得し、サムネイル・タイトル・説明文付きのリッチカードを表示します。

```mdx
<ExLinkCard url="https://example.com/article" />
```

| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `url` | `string` | ✅ | 対象の URL |

---

### `<Twitter>` — ツイート埋め込み

ツイートを埋め込み表示します。

```mdx
<Twitter url="https://twitter.com/user/status/123456789" />
```

| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| `url` | `string` | ✅ | ツイートの URL |

---

## 見出しのスタイル

Markdown の `##` (h2) と `###` (h3) は自動的にアクセントカラーの左ボーダー付きで表示されます。

- **`## 見出し2`** → 左に太い縦線 + 下線ボーダー
- **`### 見出し3`** → 左に細めの縦線
