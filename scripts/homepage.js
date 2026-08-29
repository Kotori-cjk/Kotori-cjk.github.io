import { SITE_CONFIG } from '../site-config.js';
import { initStorage, getState, updateState, imageUrl, saveImage, removeImage, exportHomepage, importHomepage } from './storage.js';
import { initRevealMotion, initBookIntro } from './motion.js';
import { initPlayer } from './player.js';
import { initRippleEffects } from './interactions.js';

let publicSite;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

function safeUrl(value) {
  const url = String(value || '').trim();
  return /^(https?:|mailto:)/.test(url) ? url : '#';
}

async function loadJson(path, fallback) {
  try {
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(error);
    return fallback;
  }
}

function renderPublicContent(site, projects, posts) {
  document.getElementById('hero-eyebrow').textContent = site.hero?.eyebrow || '';
  document.getElementById('hero-lines').innerHTML = (site.hero?.lines || []).map((line, index) => `<span class="hero-line${index === 0 ? ' hero-line-ink' : ''}">${escapeHtml(line)}</span>`).join('');
  document.getElementById('hero-primary').textContent = site.hero?.primaryLabel || '翻阅画册';
  document.getElementById('about-quote').innerHTML = escapeHtml(site.about?.quote || '').replace(/\n/g, '<br>');
  document.getElementById('about-text').textContent = site.about?.text || '';

  const interests = (site.interests || []).filter(item => item.visible !== false);
  document.getElementById('interest-grid').innerHTML = interests.length ? interests.map((interest, index) => `<article class="interest-card reveal-section glow-region ripple-target" data-reveal="${index % 2 ? 'right' : 'left'}" data-index="${String(index + 1).padStart(2, '0')}"><h3>${escapeHtml(interest.title)}</h3><ul>${(interest.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`).join('') : '<p class="empty-public">暂时还没有兴趣切片。</p>';

  const links = (site.links || []).filter(link => link.visible !== false);
  document.getElementById('external-links').innerHTML = links.length ? links.map(link => `<a class="external-link glow-region ripple-target" href="${escapeHtml(safeUrl(link.href))}" target="_blank" rel="noreferrer"><i>${escapeHtml(link.icon || '↗')}</i><b>${escapeHtml(link.label)}</b><span>${escapeHtml(link.note)}</span></a>`).join('') : '<p class="empty-public">暂时还没有外部链接。</p>';

  const publicProjects = (projects || []).filter(item => item.visible !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  document.getElementById('project-grid').innerHTML = publicProjects.length ? publicProjects.map(project => `<a class="project-card glow-region ripple-target" href="${escapeHtml(safeUrl(project.url))}" target="_blank" rel="noreferrer"><div class="project-cover${project.cover ? '' : ' project-cover-placeholder'}"${project.cover ? ` style="background-image:url('${escapeHtml(project.cover)}')"` : ''}></div><div class="project-copy"><small>GITHUB PROJECT</small><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><div class="tag-row">${(project.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div></div></a>`).join('') : '<p class="empty-public">项目正在整理中。</p>';

  document.getElementById('blog-grid').innerHTML = posts.length ? posts.slice(0, 6).map((post, index) => `<a class="blog-card reveal-section glow-region ripple-target" data-reveal="${index % 2 ? 'right' : 'left'}" href="blog/${encodeURIComponent(post.slug)}/"><div class="blog-cover${post.cover ? '' : ' blog-cover-placeholder'}"${post.cover ? ` style="background-image:url('${escapeHtml(post.cover)}')"` : ''}></div><div class="blog-copy"><small>${escapeHtml(post.date || 'UNDATED')}</small><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.summary)}</p><div class="tag-row">${(post.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div></div></a>`).join('') : '<div class="empty-public glow-region"><strong>第一篇随笔正在酝酿。</strong><span>发布 Markdown 后，它会自动出现在这里。</span></div>';
}

function defaultCover() { return publicSite?.defaults?.cover || 'assets/book-cover-cherry.webp'; }
function coverSrc() { return imageUrl(getState().coverImage) || defaultCover(); }
function applyCover() { const source = coverSrc(); document.getElementById('cover-art').style.backgroundImage = `url("${source}")`; document.getElementById('hero-cover').src = source; document.getElementById('cover-preview').style.backgroundImage = `url("${source}")`; }

function applyBackground() {
  const state = getState();
  const key = state.backgrounds[state.currentBg];
  const source = key ? imageUrl(key) : publicSite?.defaults?.background || '';
  const layer = document.getElementById('bg-layer');
  layer.style.backgroundImage = source ? `url("${source}")` : '';
  layer.classList.toggle('has-bg', Boolean(source));
}

function renderBackgrounds() {
  const state = getState();
  const list = document.getElementById('bg-preview-list');
  list.innerHTML = state.backgrounds.length ? state.backgrounds.map((key, index) => `<div class="bg-preview-item${state.currentBg === index ? ' active' : ''}" data-bg-index="${index}"><img src="${imageUrl(key)}" alt="个人背景 ${index + 1}"><button type="button" data-delete-bg="${index}" aria-label="删除背景 ${index + 1}">×</button></div>`).join('') : '<p class="empty-hint">暂无个人背景</p>';
}

function setupDialogs() {
  const dialog = document.getElementById('settings-dialog');
  const openSpace = () => { window.location.href = SITE_CONFIG.spaceUrl; };
  document.getElementById('enter-space-btn').addEventListener('click', openSpace);
  document.getElementById('gate-space-btn').addEventListener('click', openSpace);
  document.getElementById('settings-btn').addEventListener('click', () => { if (!dialog.open) dialog.showModal(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

function setupCoverSettings() {
  const upload = document.getElementById('cover-upload');
  document.getElementById('cover-upload-btn').addEventListener('click', () => upload.click());
  upload.addEventListener('change', async () => {
    const file = upload.files?.[0]; if (!file) return;
    const previous = getState().coverImage; const key = await saveImage(file, 'cover'); updateState({ coverImage: key });
    if (previous) await removeImage(previous); applyCover(); upload.value = '';
  });
  document.getElementById('cover-reset-btn').addEventListener('click', async () => { const previous = getState().coverImage; updateState({ coverImage: '' }); if (previous) await removeImage(previous); applyCover(); });
}

function setupBackgroundSettings() {
  const upload = document.getElementById('bg-upload');
  document.getElementById('bg-upload-btn').addEventListener('click', () => upload.click());
  upload.addEventListener('change', async () => {
    const keys = []; for (const file of upload.files || []) keys.push(await saveImage(file, 'background'));
    if (keys.length) updateState({ backgrounds: [...getState().backgrounds, ...keys], currentBg: getState().currentBg < 0 ? 0 : getState().currentBg });
    applyBackground(); renderBackgrounds(); upload.value = '';
  });
  document.getElementById('bg-preview-list').addEventListener('click', async event => {
    const deleteButton = event.target.closest('[data-delete-bg]');
    if (deleteButton) {
      const index = Number(deleteButton.dataset.deleteBg); const backgrounds = [...getState().backgrounds]; const [removed] = backgrounds.splice(index, 1); let currentBg = getState().currentBg;
      if (!backgrounds.length) currentBg = -1; else if (currentBg === index) currentBg = Math.min(index, backgrounds.length - 1); else if (currentBg > index) currentBg -= 1;
      updateState({ backgrounds, currentBg }); await removeImage(removed); applyBackground(); renderBackgrounds(); return;
    }
    const preview = event.target.closest('[data-bg-index]'); if (preview) { updateState({ currentBg: Number(preview.dataset.bgIndex) }); applyBackground(); renderBackgrounds(); }
  });
  document.getElementById('bg-reset-btn').addEventListener('click', () => { updateState({ currentBg: -1 }); applyBackground(); renderBackgrounds(); });
}

function setupBackup() {
  const input = document.getElementById('import-home-file');
  document.getElementById('export-home-btn').addEventListener('click', exportHomepage);
  document.getElementById('import-home-btn').addEventListener('click', () => input.click());
  input.addEventListener('change', async () => { const file = input.files?.[0]; if (!file) return; try { await importHomepage(file); applyCover(); applyBackground(); renderBackgrounds(); } catch (error) { window.alert(`导入失败：${error.message}`); } input.value = ''; });
}

async function init() {
  const [site, projects, music, posts] = await Promise.all([loadJson('content/site.json', {}), loadJson('content/projects.json', []), loadJson('content/music.json', []), loadJson('content/posts.json', [])]);
  publicSite = site; renderPublicContent(site, projects, posts);
  await initStorage(); applyCover(); applyBackground(); renderBackgrounds(); initPlayer(music);
  setupDialogs(); setupCoverSettings(); setupBackgroundSettings(); setupBackup(); initRevealMotion();
  document.getElementById('reopen-cover-btn').addEventListener('click', () => window.location.reload());
}

initRippleEffects();
initBookIntro({ onOpen: () => window.scrollTo({ top: 0 }) });
init().catch(error => { console.error(error); document.body.classList.remove('cover-closed'); document.body.classList.add('book-open'); });
