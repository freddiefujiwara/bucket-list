# Bucket List: A Dynamic Tiled Gallery

人生でやりたいことリストを、タイル形式で美しく表示するウェブアプリケーションです。Google Apps Scriptからデータを取得し、フィルタリングや詳細表示が可能です。

[ライブデモはこちら](https://freddiefujiwara.com/bucket-list/)

## Features

- **タイル表示**: やりたいことリストをタイル形式で表示
- **詳細表示**: 各タイルをクリックすると、詳細情報をモーダルで表示
- **フィルタリング**: カテゴリや目標年齢で表示するタイルを絞り込み
- **レスポンシブデザイン**: スマートフォンやデスクトップなど、さまざまなデバイスに対応

## Technology Stack

- **Vue 3**: リアクティブなUIを構築するためのプログレッシブフレームワーク
- **Vite**: 高速な開発サーバーとビルドツール
- **Vitest**: Vite上で動作する単体テストフレームワーク

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bucket-list.git
   ```
2. Navigate to the project directory:
   ```bash
   cd bucket-list
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the local development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

The output files will be generated in the `dist` directory.

### Running Tests

To run the unit tests, use the following command:

```bash
npm test
```

## Configuration

### Data Source

The application fetches data from a JSONP endpoint. You can specify the URL of your data source by setting the `VITE_DATA_URL` environment variable.

```bash
VITE_DATA_URL="https://script.google.com/macros/s/XXXX/exec" npm run dev
```

**Note:** Do not include the `callback` parameter in the URL.

### Deployment

This project can be deployed to GitHub Pages.

1. **Build the application.** If your repository is not at the root of your custom domain, you may need to set the `VITE_BASE` environment variable to the repository path.
   ```bash
   VITE_BASE="/your-repo-name/" npm run build
   ```
2. **Deploy.** The following command will publish the contents of the `dist` directory to the `gh-pages` branch.
   ```bash
   npm run deploy
   ```

## Data Structure

このアプリケーションは、Google Apps ScriptなどのJSONPエンドポイントからデータを取得します。データソースは、以下の形式のJSONオブジェクトの配列を返す必要があります。

```json
[
  {
    "id": "一意のID",
    "category": "カテゴリ名",
    "target_age": "目標年齢",
    "title": "タイトル",
    "note": "メモ",
    "image_url": "画像のURL",
    "completed": true,
    "completed_at": "2023-10-27"
  }
]
```
