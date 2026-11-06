// Generates one static OGP shell page per bucket-list item into
// public/item/<id>.html. The blog article places each shell URL on its
// own line, and blog-gas turns it into a link card using the shell's
// OGP tags (title, illustration, note). Human visitors are forwarded
// to the blog article itself.
//
// Usage: node scripts/generate-item-pages.mjs
// Source data: scripts/items.json (snapshot of the BucketList sheet;
// refresh it from the sheet when items change, then re-run this).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARTICLE_URL =
  'https://freddiefujiwara.com/blog/1WPrZI3RqXZcBIrVfrvY7Qn6AF-pFBHdNWXcK7PIwokM';
const ARTICLE_TITLE = '死ぬまでにやりたいことリスト';
const SITE_BASE = 'https://freddiefujiwara.com/bucket-list/item';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const items = JSON.parse(readFileSync(join(root, 'scripts', 'items.json'), 'utf8'));

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const formatDateJa = (iso) => {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(d);
  return parts;
};

const descriptionFor = (item) => {
  if (item.note) return item.note;
  let desc = `${ARTICLE_TITLE}の項目です。目標：${item.target_age}歳台`;
  if (item.completed && item.completed_at) {
    desc += `／達成済み（${formatDateJa(item.completed_at)}）`;
  }
  return desc;
};

const pageFor = (item) => {
  const title = escapeHtml(item.title);
  const description = escapeHtml(descriptionFor(item));
  const image = escapeHtml(item.image_url);
  const selfUrl = `${SITE_BASE}/${item.id}.html`;
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>${title} | ${ARTICLE_TITLE}</title>
<meta name="description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${selfUrl}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${ARTICLE_URL}">
<meta http-equiv="refresh" content="0; url=${ARTICLE_URL}">
</head>
<body>
<p>「${ARTICLE_TITLE}」の項目「${title}」です。記事へ移動します。</p>
<p><a href="${ARTICLE_URL}">${ARTICLE_TITLE}（ブログ記事）</a></p>
</body>
</html>
`;
};

mkdirSync(join(root, 'public', 'item'), { recursive: true });
for (const item of items) {
  writeFileSync(join(root, 'public', 'item', `${item.id}.html`), pageFor(item));
}
console.log(`generated ${items.length} item pages`);
