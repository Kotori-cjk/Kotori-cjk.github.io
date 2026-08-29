import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const PORT = 8000;
const MIME = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2'
};

function json(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(data));
}

async function getSong(id) {
  const endpoint = `https://music.163.com/api/song/detail/?id=${id}&ids=%5B${id}%5D`;
  const response = await fetch(endpoint, { headers: { Referer: 'https://music.163.com/', 'User-Agent': 'Mozilla/5.0 Kotori-Editor' } });
  if (!response.ok) throw new Error(`网易云返回 ${response.status}`);
  const data = JSON.parse(await response.text());
  const song = data.songs?.[0];
  if (!song) throw new Error('没有找到这首歌');
  let playable = song.fee === 0;
  try {
    const playback = await fetch(`https://music.163.com/api/song/enhance/player/url?id=${id}&ids=%5B${id}%5D&br=128000`, { headers: { Referer: 'https://music.163.com/', 'User-Agent': 'Mozilla/5.0 Kotori-Editor' } });
    if (playback.ok) playable = Boolean(JSON.parse(await playback.text()).data?.[0]?.url);
  } catch (_) { /* fee remains the fallback signal */ }
  return { id: String(song.id), title: song.name || `网易云歌曲 ${id}`, artist: (song.artists || []).map(item => item.name).filter(Boolean).join(' / '), cover: song.album?.picUrl || '', playable };
}

async function resolveSongId(input) {
  const value = String(input || '').trim();
  const direct = /^\d+$/.test(value) ? value : value.match(/[?&]id=(\d+)/)?.[1] || value.match(/song\/(\d+)/)?.[1];
  if (direct) return direct;
  let shared;
  try { shared = new URL(value); } catch (_) { throw new Error('请输入有效的网易云歌曲链接或 ID'); }
  const allowed = shared.hostname === '163cn.tv' || shared.hostname === 'music.163.com' || shared.hostname.endsWith('.music.163.com');
  if (!allowed) throw new Error('只支持网易云音乐歌曲链接');
  const response = await fetch(shared, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 Kotori-Editor' } });
  const resolved = response.url.match(/[?&]id=(\d+)/)?.[1] || response.url.match(/song\/(\d+)/)?.[1];
  if (resolved) return resolved;
  const html = await response.text();
  const embedded = html.match(/(?:song\?id=|song\/)(\d+)/)?.[1];
  if (!embedded) throw new Error('这个链接中没有识别到单曲 ID');
  return embedded;
}

async function handleApi(requestUrl, response) {
  try {
    const input = requestUrl.searchParams.get('input') || requestUrl.searchParams.get('id') || '';
    if (input.length > 600) throw new Error('歌曲链接过长');
    const id = await resolveSongId(input);
    const song = await getSong(id);
    if (requestUrl.pathname === '/api/netease-song') return json(response, 200, song);
    if (!song.cover) return json(response, 404, { error: '歌曲没有封面' });
    const coverUrl = new URL(song.cover);
    if (!coverUrl.hostname.endsWith('.music.126.net')) return json(response, 400, { error: '封面来源不受支持' });
    const cover = await fetch(coverUrl, { headers: { Referer: 'https://music.163.com/', 'User-Agent': 'Mozilla/5.0 Kotori-Editor' } });
    if (!cover.ok) return json(response, 502, { error: `封面下载失败：${cover.status}` });
    response.writeHead(200, { 'Content-Type': cover.headers.get('content-type') || 'image/jpeg', 'Cache-Control': 'no-store' });
    response.end(Buffer.from(await cover.arrayBuffer()));
  } catch (error) {
    json(response, 502, { error: error.message || '网易云歌曲信息读取失败' });
  }
}

async function serveStatic(pathname, response) {
  let relative = decodeURIComponent(pathname);
  if (relative.endsWith('/')) relative += 'index.html';
  const target = resolve(DIST, `.${relative}`);
  if (target !== DIST && !target.startsWith(`${DIST}${sep}`)) return json(response, 403, { error: 'Forbidden' });
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': MIME[extname(target).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(await readFile(target));
  } catch (_) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
  if (requestUrl.pathname === '/api/netease-song' || requestUrl.pathname === '/api/netease-cover') await handleApi(requestUrl, response);
  else await serveStatic(requestUrl.pathname, response);
}).listen(PORT, 'localhost', () => {
  console.log(`Kotori editor: http://localhost:${PORT}/editor/`);
  console.log('Press Ctrl+C to stop.');
});
