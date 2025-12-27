# Bucket List Tiles

This is a small Vue 3 app. It loads data from Google Apps Script (JSONP) and shows it as tiles.

You can see the live page here:
https://freddiefujiwara.com/bucket-list/

## Setup

```bash
npm install
```

## Run the app

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Change the data URL

Set `VITE_DATA_URL` to your Apps Script endpoint. Do not add the `callback` param.

```bash
VITE_DATA_URL="https://script.google.com/macros/s/XXXX/exec" npm run dev
```

## Deploy to GitHub Pages

This publishes `dist` to the `gh-pages` branch.

```bash
npm run deploy
```

If your repo is not at the root, set `VITE_BASE` to the repo path.

```bash
VITE_BASE="/your-repo-name/" npm run build
```
