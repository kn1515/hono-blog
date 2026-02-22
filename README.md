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
