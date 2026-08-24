import { SITE_CONFIG } from '../site-config.js';
import {
  initStorage,
  getState,
  updateState,
  imageUrl,
  saveImage,
  removeImage,
  exportHomepage,
  importHomepage
} from './storage.js';
import { initRevealMotion, initBookIntro } from './motion.js';
import { parseMusicId, renderPlayer } from './player.js';

const DEFAULT_COVER = 'assets/book-cover-cherry.webp';

const interests = [
  { title: 'ACGN Works', items: ['动画：小林家的龙女仆、冰菓、JoJo、刀剑神域、缘之空', '漫画：点兔、碧蓝之海', '游戏：FGO、さくら、もゆ、饥荒、anemoi', '轻小说：约会大作战、春物、樱花庄、败犬女主、游戏人生'] },
  { title: 'Science & Fantasy', items: ['沙丘、黑暗的左手、三体、基地、微宇宙的上帝', '侏罗纪公园、异形、变形金刚', '哈利·波特、克苏鲁神话、好兆头、指环王、加勒比海盗'] },
  { title: 'Musicians', items: ['Pop：Ed Sheeran、Justin Bieber、Charlie Puth、Selena Gomez', 'Japanese：YOASOBI、ヨルシカ', 'ACG：霜月はるか、忍、三輪学、麻枝准、乐正绫'] },
  { title: 'Current Interests', items: ['二十世纪电气目录', 'アストラエアの白き永遠', '把学习过程整理成可复用的工具'] }
];

const links = [
  { label: 'Bangumi', note: '动画与书影音记录', href: 'https://bangumi.tv/user/1151382' },
  { label: 'GitHub', note: '代码与小工具', href: 'https://github.com/Kotori-cjk' },
  { label: 'X', note: '偶尔出现的碎片', href: 'https://x.com/KotoriMare' },
  { label: 'Email', note: '3259617604@qq.com', href: 'mailto:3259617604@qq.com' }
];

function renderFixedContent() {
  document.getElementById('interest-grid').innerHTML = interests.map((interest, index) => `
    <article class="interest-card reveal-section" data-reveal="${index % 2 ? 'right' : 'left'}" data-index="${String(index + 1).padStart(2, '0')}">
      <h3>${interest.title}</h3>
      <ul>${interest.items.map(item => `<li>${item}</li>`).join('')}</ul>
    </article>`).join('');
  document.getElementById('external-links').innerHTML = links.map(link => `
    <a class="external-link" href="${link.href}" target="_blank" rel="noreferrer">
      <b>${link.label}</b><span>${link.note}</span>
    </a>`).join('');
}

function coverSrc() {
  return imageUrl(getState().coverImage) || DEFAULT_COVER;
}

function applyCover() {
  const source = coverSrc();
  document.getElementById('cover-art').style.backgroundImage = `url("${source}")`;
  document.querySelector('.photo-main img').src = source;
  document.getElementById('cover-preview').style.backgroundImage = `url("${source}")`;
}

function applyBackground() {
  const state = getState();
  const key = state.backgrounds[state.currentBg];
  const layer = document.getElementById('bg-layer');
  if (key) {
    layer.style.backgroundImage = `url("${imageUrl(key)}")`;
    layer.classList.add('has-bg');
  } else {
    layer.style.backgroundImage = '';
    layer.classList.remove('has-bg');
  }
}

function renderBackgrounds() {
  const state = getState();
  const list = document.getElementById('bg-preview-list');
  if (!state.backgrounds.length) {
    list.innerHTML = '<p class="empty-hint">暂无自定义背景</p>';
    return;
  }
  list.innerHTML = state.backgrounds.map((key, index) => `
    <div class="bg-preview-item${state.currentBg === index ? ' active' : ''}" data-bg-index="${index}">
      <img src="${imageUrl(key)}" alt="自定义背景 ${index + 1}">
      <button type="button" data-delete-bg="${index}" aria-label="删除背景 ${index + 1}">×</button>
    </div>`).join('');
}

function renderMusic() {
  const ids = getState().musicIds;
  renderPlayer(document.getElementById('music-container'), ids);
  const list = document.getElementById('music-manage-list');
  list.innerHTML = ids.length ? ids.map((id, index) => `
    <div class="music-manage-item"><span>网易云 ID：${id}</span><button type="button" data-delete-music="${index}" aria-label="删除歌曲">×</button></div>`).join('') : '<p class="empty-hint">暂无音乐</p>';
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function setupDialogs() {
  const settingsDialog = document.getElementById('settings-dialog');
  const openSpace = () => { window.location.href = SITE_CONFIG.spaceUrl; };
  document.getElementById('enter-space-btn').addEventListener('click', openSpace);
  document.getElementById('gate-space-btn').addEventListener('click', openSpace);
  document.getElementById('settings-btn').addEventListener('click', () => openDialog(settingsDialog));
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  [settingsDialog].forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  }));
}

function setupCoverSettings() {
  const upload = document.getElementById('cover-upload');
  document.getElementById('cover-upload-btn').addEventListener('click', () => upload.click());
  upload.addEventListener('change', async () => {
    const file = upload.files?.[0];
    if (!file) return;
    const previous = getState().coverImage;
    const key = await saveImage(file, 'cover');
    updateState({ coverImage: key });
    if (previous) await removeImage(previous);
    applyCover();
    upload.value = '';
  });
  document.getElementById('cover-reset-btn').addEventListener('click', async () => {
    const previous = getState().coverImage;
    updateState({ coverImage: '' });
    if (previous) await removeImage(previous);
    applyCover();
  });
}

function setupBackgroundSettings() {
  const upload = document.getElementById('bg-upload');
  document.getElementById('bg-upload-btn').addEventListener('click', () => upload.click());
  upload.addEventListener('change', async () => {
    const keys = [];
    for (const file of upload.files || []) keys.push(await saveImage(file, 'background'));
    if (keys.length) {
      const backgrounds = [...getState().backgrounds, ...keys];
      updateState({ backgrounds, currentBg: getState().currentBg < 0 ? 0 : getState().currentBg });
      applyBackground();
      renderBackgrounds();
    }
    upload.value = '';
  });
  document.getElementById('bg-preview-list').addEventListener('click', async event => {
    const deleteButton = event.target.closest('[data-delete-bg]');
    if (deleteButton) {
      const index = Number(deleteButton.dataset.deleteBg);
      const backgrounds = [...getState().backgrounds];
      const [removed] = backgrounds.splice(index, 1);
      let currentBg = getState().currentBg;
      if (!backgrounds.length) currentBg = -1;
      else if (currentBg === index) currentBg = Math.min(index, backgrounds.length - 1);
      else if (currentBg > index) currentBg -= 1;
      updateState({ backgrounds, currentBg });
      await removeImage(removed);
      applyBackground();
      renderBackgrounds();
      return;
    }
    const preview = event.target.closest('[data-bg-index]');
    if (preview) {
      updateState({ currentBg: Number(preview.dataset.bgIndex) });
      applyBackground();
      renderBackgrounds();
    }
  });
  document.getElementById('bg-reset-btn').addEventListener('click', () => {
    updateState({ currentBg: -1 });
    applyBackground();
    renderBackgrounds();
  });
}

function setupMusicSettings() {
  const input = document.getElementById('music-input');
  const add = () => {
    const id = parseMusicId(input.value);
    if (!id) { input.focus(); return; }
    if (!getState().musicIds.includes(id)) updateState({ musicIds: [...getState().musicIds, id] });
    input.value = '';
    renderMusic();
  };
  document.getElementById('music-add-btn').addEventListener('click', add);
  input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); add(); } });
  document.getElementById('music-manage-list').addEventListener('click', event => {
    const button = event.target.closest('[data-delete-music]');
    if (!button) return;
    const musicIds = [...getState().musicIds];
    musicIds.splice(Number(button.dataset.deleteMusic), 1);
    updateState({ musicIds });
    renderMusic();
  });
}

function setupBackup() {
  const input = document.getElementById('import-home-file');
  document.getElementById('export-home-btn').addEventListener('click', exportHomepage);
  document.getElementById('import-home-btn').addEventListener('click', () => input.click());
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      await importHomepage(file);
      applyCover();
      applyBackground();
      renderBackgrounds();
      renderMusic();
    } catch (error) {
      window.alert(`导入失败：${error.message}`);
    }
    input.value = '';
  });
}

async function init() {
  renderFixedContent();
  await initStorage();
  applyCover();
  applyBackground();
  renderBackgrounds();
  renderMusic();
  setupDialogs();
  setupCoverSettings();
  setupBackgroundSettings();
  setupMusicSettings();
  setupBackup();
  initRevealMotion();
  initBookIntro({ onOpen: () => window.scrollTo({ top: 0 }) });
  document.getElementById('reopen-cover-btn').addEventListener('click', () => window.location.reload());
}

init().catch(error => {
  console.error(error);
  document.body.classList.remove('cover-closed');
  document.body.classList.add('book-open');
});
