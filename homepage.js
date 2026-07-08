const SEIKA_KEY = 'kotori-seika-v1';
const AUTH_KEY = 'kotori-space-auth';
const SPACE_PASSWORD = 'Favorite is my favorite!';
const IDB_NAME = 'kotori-seika-images';
const IDB_STORE = 'images';

/*
  HOMEPAGE_CONTENT is the itemized modifier for the public homepage.
  Edit the values below when you want to change the fixed website content.
*/
const HOMEPAGE_CONTENT = {
  mark: 'ことり',
  greeting: 'こんにちは、Kotoriです~',
  quote: 'そして始まる、きみとはぐ、のセカイ!',
  sections: [
    {
      title: 'ACGN works:',
      items: [
        { label: 'Anime', text: '小林家的龙女仆、冰菓、JoJo的奇妙冒险系列、刀剑神域、缘之空' },
        { label: 'Cartoon', text: '点兔、碧蓝之海' },
        { label: 'Game', text: 'FGO、さくら、もゆ、饥荒、anemoi' },
        { label: 'Light Novel', text: '约会大作战、春物、樱花庄的宠物女孩、败犬女主、游戏人生、通往夏天的隧道，再见的出口' }
      ]
    },
    {
      title: 'Scientific and Fantasy Novels:',
      items: [
        { text: '沙丘、黑暗的左手、三体、侏罗纪公园、基地、微宇宙的上帝' },
        { text: 'HP、克苏鲁神话系列、好兆头、指环王' }
      ]
    },
    {
      title: 'Current Interests:',
      items: [
        { text: '二十世纪电气目录、アストラエアの白き永遠' }
      ]
    }
  ],
  links: {
    bangumi: 'https://bangumi.tv/user/1151382',
    github: 'https://github.com/Kotori-cjk',
    x: 'https://x.com/KotoriMare',
    email: '3259617604@qq.com'
  }
};

const defaultSeika = {
  settings: {
    musicIds: [],
    backgrounds: [],
    currentBg: -1
  }
};

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
    const seika = JSON.parse(localStorage.getItem(SEIKA_KEY) || 'null');
    if (seika) seikaState = { ...defaultSeika, ...seika, settings: { ...defaultSeika.settings, ...(seika.settings || {}) } };
  } catch (_) {}
}
function saveSeika() {
  localStorage.setItem(SEIKA_KEY, JSON.stringify(seikaState));
}

function renderProfile() {
  localStorage.removeItem('kotori-homepage-v1');
  document.querySelector('.profile-mark').textContent = HOMEPAGE_CONTENT.mark;
  const sections = HOMEPAGE_CONTENT.sections.map(section => {
    const items = section.items.map(item => {
      const label = item.label ? `<strong>${escHtml(item.label)}:</strong> ` : '';
      return `<li>${label}${escHtml(item.text)}</li>`;
    }).join('');
    return `<section class="profile-section"><h2>${escHtml(section.title)}</h2><ul>${items}</ul></section>`;
  }).join('');

  document.getElementById('profile-rendered').innerHTML = `
    <h2 class="profile-greeting">${escHtml(HOMEPAGE_CONTENT.greeting)}</h2>
    <div class="profile-quote">${escHtml(HOMEPAGE_CONTENT.quote)}</div>
    ${sections}
  `;
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
  setLink('link-bangumi', normalizeUrl(HOMEPAGE_CONTENT.links.bangumi), true);
  setLink('link-github', normalizeUrl(HOMEPAGE_CONTENT.links.github), true);
  setLink('link-x', normalizeUrl(HOMEPAGE_CONTENT.links.x), true);
  const email = String(HOMEPAGE_CONTENT.links.email || '').trim();
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
    container.classList.remove('record-grid');
    container.innerHTML = '<p class="empty-hint">还没有添加音乐。</p>';
    return;
  }
  container.classList.add('record-grid');
  container.innerHTML = ids.map((id, index) =>
    `<div class="record-player">
      <div class="record-disc" aria-hidden="true"></div>
      <div class="record-arm" aria-hidden="true"></div>
      <div class="record-embed">
        <p class="record-label">Track ${index + 1}</p>
        <iframe frameborder="no" width="100%" height="86" src="https://music.163.com/outchain/player?type=2&id=${escHtml(id)}&auto=0&height=66"></iframe>
      </div>
    </div>`
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

async function enterSpace() {
  const hint = document.getElementById('password-hint');
  const input = document.getElementById('space-password-input');
  if (SPACE_PASSWORD === 'CHANGE_ME') {
    hint.textContent = '站点密码还没有从占位值改掉。';
    return;
  }
  if (input.value === SPACE_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, 'ok');
    localStorage.setItem(AUTH_KEY, 'ok');
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
  renderBgPreviews();
  renderMusicManageList();
  openModal('settings-modal');
}

function setupEvents() {
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.querySelector('[data-close-settings]').addEventListener('click', () => closeModal('settings-modal'));
  document.querySelector('#settings-modal .modal-overlay').addEventListener('click', () => closeModal('settings-modal'));

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


