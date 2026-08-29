import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

const safeSlug = value => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fff-]+/g, '-')
  .replace(/^-+|-+$/g, '');

const siteAsset = (value, depth = '../../') => {
  const source = String(value || '');
  if (!source) return '';
  if (/^(https?:|data:)/.test(source)) return source;
  return `${depth}${source.replace(/^\/+/, '')}`;
};

async function copyIfExists(source, target) {
  try {
    await cp(path.join(ROOT, source), path.join(DIST, target || source), { recursive: true });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function articleTemplate(post) {
  const cover = siteAsset(post.cover);
  const coverMarkup = cover ? `<figure class="article-cover"><img src="${escapeHtml(cover)}" alt="${escapeHtml(post.title)}"></figure>` : '';
  const tags = post.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(post.summary)}">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; frame-src https://music.163.com; connect-src 'self'">
  <title>${escapeHtml(post.title)} · Kotori</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@500;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Yusei+Magic&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../homepage.css">
  <link rel="stylesheet" href="../../blog.css">
</head>
<body class="article-page book-open">
  <div id="reading-progress" class="reading-progress" aria-hidden="true"></div>
  <div id="bg-layer"></div><div class="paper-noise" aria-hidden="true"></div>
  <header class="article-topbar"><a href="../../#blog">← 返回博客随笔</a><a href="../../">Kotori's Homepage</a></header>
  <main class="article-shell">
    <article class="article-card glow-region">
      <header class="article-header">
        <p class="article-kicker">BLOG ESSAY · ${escapeHtml(post.date)}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(post.summary)}</p>
        <div class="article-tags">${tags}</div>
      </header>
      ${coverMarkup}
      <div class="article-body">${post.html}</div>
    </article>
  </main>
  <script type="module" src="../../scripts/article.js"></script>
</body>
</html>`;
}

async function buildPosts() {
  const entries = await readdir(POSTS_DIR, { withFileTypes: true });
  const posts = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const raw = await readFile(path.join(POSTS_DIR, entry.name), 'utf8');
    const parsed = matter(raw);
    const slug = safeSlug(parsed.data.slug || entry.name.replace(/\.md$/, ''));
    const tags = Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [];
    const post = {
      slug,
      title: String(parsed.data.title || slug),
      date: String(parsed.data.date || ''),
      summary: String(parsed.data.summary || ''),
      cover: String(parsed.data.cover || ''),
      tags,
      draft: parsed.data.draft === true,
      source: raw,
      html: markdown.render(parsed.content)
    };
    if (!post.slug || post.draft) continue;
    posts.push(post);
  }
  posts.sort((a, b) => b.date.localeCompare(a.date));
  await mkdir(path.join(DIST, 'content'), { recursive: true });
  await mkdir(path.join(DIST, 'content', 'posts'), { recursive: true });
  await writeFile(path.join(DIST, 'content', 'posts.json'), JSON.stringify(posts.map(({ html, draft, source, ...post }) => post), null, 2));
  for (const post of posts) {
    const target = path.join(DIST, 'blog', post.slug);
    await mkdir(target, { recursive: true });
    await writeFile(path.join(target, 'index.html'), articleTemplate(post));
    await writeFile(path.join(DIST, 'content', 'posts', `${post.slug}.md`), post.source);
  }
}

async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  for (const item of ['index.html', 'homepage.css', 'blog.css', 'site-config.js', 'README.md']) await copyIfExists(item);
  for (const item of ['assets', 'vendor', 'scripts', 'editor', 'politics-recite', 'ai-recite']) await copyIfExists(item);
  await mkdir(path.join(DIST, 'content'), { recursive: true });
  for (const item of ['site.json', 'projects.json', 'music.json']) await copyIfExists(`content/${item}`);
  await copyIfExists('node_modules/markdown-it/dist/markdown-it.min.js', 'vendor/markdown-it.min.js');
  await writeFile(path.join(DIST, '.nojekyll'), '');
  await buildPosts();
}

build().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
