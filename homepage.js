const HOME_KEY = 'kotori-homepage-v1';
const SEIKA_KEY = 'kotori-seika-v1';
const AUTH_KEY = 'kotori-space-auth';
const SPACE_PASSWORD = 'Favorite is my favorite!';
const IDB_NAME = 'kotori-seika-images';
const IDB_STORE = 'images';

const defaultHome = {
  profileMarkdown: `## こんにちは，Kotori です

这里是我的个人入口。可以写番剧、游戏、音乐、角色、轻小说，也可以放一点日常碎碎念。

> May every ordinary day have a little color.

- 喜欢的作品：待补充
- 最近在看：待补充
- 最近在听：待补充`,
  links: {
    bangumi: 'https://bangumi.tv/user/1151382',
    github: 'https://github.com/Kotori-cjk',
    x: '',
    email: ''
  },
};

const defaultSeika = {
  settings: {
    musicIds: [],
    backgrounds: [],
    currentBg: -1
  }
};

let homeState = structuredClone(defaultHome);
let seikaState = structuredClone(defaultSeika);
let idb = null;
let imageCache = {};
let nextId = Date.now();

function uid() { return String(nextId++); }
function escHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function normalizeUrl(url) {
  const value = String(url || '').trim();
  if (!value) return '';
  if (/^(https?:|mailto:)/i.test(value)) return value;
  return 'https://' + value;
}

function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(IDB_STORE);
    req.onsuccess = e => { idb = e.target.result; resolve(); };
    req.onerror = e => reject(e.target.error);
  });
}
function idbPut(key, data) {
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(data, key);
    tx.oncomplete = resolve;
    tx.onerror = e => reject(e.target.error);
  });
}
function idbDel(key) {
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete(key);
    tx.oncomplete = resolve;
    tx.onerror = e => reject(e.target.error);
  });
}
function idbGetAll() {
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req = store.openCursor();
    const result = {};
    req.onsuccess = e => {
      const c = e.target.result;
      if (c) { result[c.key] = c.value; c.continue(); }
      else resolve(result);
    };
    req.onerror = e => reject(e.target.error);
  });
}

function loadState() {
  try {
    const home = JSON.parse(localStorage.getItem(HOME_KEY) || 'null');
    if (home) homeState = { ...defaultHome, ...home, links: { ...defaultHome.links, ...(home.links || {}) } };
  } catch (_) {}
  try {
    const seika = JSON.parse(localStorage.getItem(SEIKA_KEY) || 'null');
    if (seika) seikaState = { ...defaultSeika, ...seika, settings: { ...defaultSeika.settings, ...(seika.settings || {}) } };
  } catch (_) {}
}
function saveHome() {
  localStorage.setItem(HOME_KEY, JSON.stringify(homeState));
}
function saveSeika() {
  localStorage.setItem(SEIKA_KEY, JSON.stringify(seikaState));
}

function renderMarkdown(text) {
  if (typeof marked !== 'undefined') {
    marked.setOptions({ breaks: true, gfm: true });
    return marked.parse(String(text || ''));
  }
  return escHtml(text).replace(/\n/g, '<br>');
}
function renderProfile() {
  document.getElementById('profile-rendered').innerHTML = renderMarkdown(homeState.profileMarkdown);
}
function setLink(id, href, fallbackDisabled) {
  const el = document.getElementById(id);
  if (!href) {
    el.removeAttribute('href');
    el.setAttribute('aria-disabled', 'true');
    el.style.opacity = fallbackDisabled ? '.48' : '';
    return;
  }
  el.href = href;
  el.removeAttribute('aria-disabled');
  el.style.opacity = '';
}
function renderLinks() {
  setLink('link-bangumi', normalizeUrl(homeState.links.bangumi), true);
  setLink('link-github', normalizeUrl(homeState.links.github), true);
  setLink('link-x', normalizeUrl(homeState.links.x), true);
  const email = String(homeState.links.email || '').trim();
  setLink('link-email', email ? `mailto:${email}` : '', true);
}

function applyBackground() {
  const bg = document.getElementById('bg-layer');
  const settings = seikaState.settings || defaultSeika.settings;
  const idx = settings.currentBg;
  const bgs = settings.backgrounds || [];
  if (idx >= 0 && bgs[idx]) {
    const src = imageCache[bgs[idx]] || bgs[idx];
    bg.style.backgroundImage = `url(${src})`;
    bg.classList.add('has-bg');
  } else {
    bg.style.backgroundImage = '';
    bg.classList.remove('has-bg');
  }
}
function renderBgPreviews() {
  const list = document.getElementById('bg-preview-list');
  const settings = seikaState.settings;
  const bgs = settings.backgrounds || [];
  if (!bgs.length) {
    list.innerHTML = '<p class="empty-hint">暂无自定义背景</p>';
    return;
  }
  list.innerHTML = bgs.map((key, i) => {
    const src = imageCache[key] || key;
    return `<div class="bg-preview-item${settings.currentBg === i ? ' active' : ''}" data-bg-select="${i}">
      <img src="${src}" alt="background"><button data-bg-del="${i}" aria-label="删除">×</button>
    </div>`;
  }).join('');
}

function parseMusicId(input) {
  input = String(input || '').trim();
  if (/^\d+$/.test(input)) return input;
  let m = input.match(/[?&]id=(\d+)/);
  if (m) return m[1];
  m = input.match(/song\/(\d+)/);
  if (m) return m[1];
  return null;
}
function renderMusic() {
  const container = document.getElementById('music-container');
  const ids = seikaState.settings.musicIds || [];
  if (!ids.length) {
    container.innerHTML = '<p class="empty-hint">还没有添加音乐。</p>';
    return;
  }
  container.innerHTML = ids.map(id =>
    `<iframe frameborder="no" width="100%" height="86" src="https://music.163.com/outchain/player?type=2&id=${escHtml(id)}&auto=0&height=66"></iframe>`
  ).join('');
}
function renderMusicManageList() {
  const el = document.getElementById('music-manage-list');
  const ids = seikaState.settings.musicIds || [];
  if (!ids.length) {
    el.innerHTML = '<p class="empty-hint">暂无音乐</p>';
    return;
  }
  el.innerHTML = ids.map((id, i) =>
    `<div class="music-manage-item"><span>网易云 ID: ${escHtml(id)}</span><button data-music-del="${i}" aria-label="删除">×</button></div>`
  ).join('');
}

async function hashPassword(password) {
  const text = String(password || '');
  if (window.crypto?.subtle) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return 'sha256:' + Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 'fnv:' + (h >>> 0).toString(16);
}
async function enterSpace() {
  const hint = document.getElementById('password-hint');
  const input = document.getElementById('space-password-input');
  if (SPACE_PASSWORD === 'CHANGE_ME') {
    hint.textContent = '站点密码还没有从占位值改掉。';
    return;
  }
  if (input.value === SPACE_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, 'ok');
    window.location.href = 'space/';
    return;
  }
  hint.textContent = '密码不正确。';
  input.select();
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
function openSettings() {
  document.getElementById('profile-input').value = homeState.profileMarkdown || '';
  document.getElementById('set-bangumi').value = homeState.links.bangumi || '';
  document.getElementById('set-github').value = homeState.links.github || '';
  document.getElementById('set-x').value = homeState.links.x || '';
  document.getElementById('set-email').value = homeState.links.email || '';
  renderBgPreviews();
  renderMusicManageList();
  openModal('settings-modal');
}
async function closeSettings(saveChanges = true) {
  if (saveChanges) {
    homeState.profileMarkdown = document.getElementById('profile-input').value;
    homeState.links.bangumi = document.getElementById('set-bangumi').value.trim();
    homeState.links.github = document.getElementById('set-github').value.trim();
    homeState.links.x = document.getElementById('set-x').value.trim();
    homeState.links.email = document.getElementById('set-email').value.trim();
    saveHome();
    renderProfile();
    renderLinks();
  }
  closeModal('settings-modal');
}

function setupEvents() {
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.getElementById('edit-profile-btn').addEventListener('click', openSettings);
  document.querySelector('[data-close-settings]').addEventListener('click', () => closeSettings(true));
  document.querySelector('#settings-modal .modal-overlay').addEventListener('click', () => closeSettings(true));

  document.getElementById('enter-space-btn').addEventListener('click', () => {
    document.getElementById('space-password-input').value = '';
    document.getElementById('password-hint').textContent = SPACE_PASSWORD === 'CHANGE_ME' ? '站点密码还没有从占位值改掉。' : '';
    openModal('password-modal');
    setTimeout(() => document.getElementById('space-password-input').focus(), 0);
  });
  document.getElementById('password-submit-btn').addEventListener('click', enterSpace);
  document.getElementById('space-password-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') enterSpace();
  });
  document.querySelector('[data-close-password]').addEventListener('click', () => closeModal('password-modal'));
  document.querySelector('#password-modal .modal-overlay').addEventListener('click', () => closeModal('password-modal'));

  document.getElementById('bg-upload-btn').addEventListener('click', () => document.getElementById('bg-upload').click());
  document.getElementById('bg-upload').addEventListener('change', e => {
    Array.from(e.target.files || []).forEach(file => {
      const reader = new FileReader();
      reader.onload = async ev => {
        const key = 'bg_' + uid();
        await idbPut(key, ev.target.result);
        imageCache[key] = ev.target.result;
        seikaState.settings.backgrounds.push(key);
        if (seikaState.settings.currentBg < 0) seikaState.settings.currentBg = 0;
        saveSeika();
        applyBackground();
        renderBgPreviews();
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  });
  document.getElementById('bg-preview-list').addEventListener('click', e => {
    const del = e.target.closest('[data-bg-del]');
    if (del) {
      const i = Number(del.dataset.bgDel);
      const key = seikaState.settings.backgrounds[i];
      if (key && !key.startsWith('data:')) idbDel(key).catch(() => {});
      delete imageCache[key];
      seikaState.settings.backgrounds.splice(i, 1);
      if (seikaState.settings.currentBg >= seikaState.settings.backgrounds.length) {
        seikaState.settings.currentBg = seikaState.settings.backgrounds.length - 1;
      }
      saveSeika();
      applyBackground();
      renderBgPreviews();
      return;
    }
    const selected = e.target.closest('[data-bg-select]');
    if (selected) {
      seikaState.settings.currentBg = Number(selected.dataset.bgSelect);
      saveSeika();
      applyBackground();
      renderBgPreviews();
    }
  });
  document.getElementById('bg-reset-btn').addEventListener('click', () => {
    seikaState.settings.currentBg = -1;
    saveSeika();
    applyBackground();
    renderBgPreviews();
  });
  document.getElementById('bg-view-btn').addEventListener('click', () => document.body.classList.add('bg-viewing'));
  document.getElementById('bg-view-exit').addEventListener('click', () => document.body.classList.remove('bg-viewing'));

  document.getElementById('music-add-btn').addEventListener('click', () => {
    const input = document.getElementById('music-input');
    const id = parseMusicId(input.value);
    if (!id) {
      input.focus();
      return;
    }
    seikaState.settings.musicIds.push(id);
    saveSeika();
    renderMusic();
    renderMusicManageList();
    input.value = '';
  });
  document.getElementById('music-manage-list').addEventListener('click', e => {
    const del = e.target.closest('[data-music-del]');
    if (!del) return;
    seikaState.settings.musicIds.splice(Number(del.dataset.musicDel), 1);
    saveSeika();
    renderMusic();
    renderMusicManageList();
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('bg-viewing')) document.body.classList.remove('bg-viewing');
    closeModal('password-modal');
    closeModal('settings-modal');
  });
}

async function init() {
  await idbOpen();
  imageCache = await idbGetAll();
  loadState();
  renderProfile();
  renderLinks();
  applyBackground();
  renderMusic();
  setupEvents();
  if (new URLSearchParams(window.location.search).get('space') === 'locked') {
    document.getElementById('locked-message').hidden = false;
  }
}

document.addEventListener('DOMContentLoaded', () => init());



