# Bucket List Tiles

Google Apps Script の JSONP データを取得してタイル状に表示する Vue 3 アプリです。

## セットアップ

```bash
npm install
```

## 開発サーバー

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## テスト

```bash
npm test
```

## データ取得先の変更

`VITE_DATA_URL` に Apps Script のエンドポイントを指定できます。`callback` パラメータは不要です。

```bash
VITE_DATA_URL="https://script.google.com/macros/s/XXXX/exec" npm run dev
```

## GitHub Pages デプロイ

`gh-pages` ブランチに `dist` を公開します。

```bash
npm run deploy
```

必要に応じて `VITE_BASE` にリポジトリ名のパスを指定してください。

```bash
VITE_BASE="/your-repo-name/" npm run build
```
