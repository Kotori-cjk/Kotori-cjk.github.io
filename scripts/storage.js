const STATE_KEY = 'kotori-homepage-v2';
const LEGACY_KEY = 'kotori-seika-v1';
const DB_NAME = 'kotori-seika-images';
const STORE_NAME = 'images';

const defaultState = {
  version: 2,
  coverImage: '',
  backgrounds: [],
  currentBg: -1,
  musicIds: []
};

let db;
let state = structuredClone(defaultState);
let images = {};

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = event => event.target.result.createObjectStore(STORE_NAME);
    request.onsuccess = event => { db = event.target.result; resolve(); };
    request.onerror = event => reject(event.target.error);
  });
}

function readImages() {
  return new Promise((resolve, reject) => {
    const result = {};
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).openCursor();
    request.onsuccess = event => {
      const cursor = event.target.result;
      if (!cursor) { resolve(result); return; }
      result[cursor.key] = cursor.value;
      cursor.continue();
    };
    request.onerror = event => reject(event.target.error);
  });
}

function putImage(key, value) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(value, key);
    transaction.oncomplete = resolve;
    transaction.onerror = event => reject(event.target.error);
  });
}

function deleteImageRecord(key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(key);
    transaction.oncomplete = resolve;
    transaction.onerror = event => reject(event.target.error);
  });
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (saved) {
      state = { ...defaultState, ...saved, version: 2 };
      return;
    }
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null');
    const settings = legacy?.settings || {};
    state = {
      ...defaultState,
      backgrounds: Array.isArray(settings.backgrounds) ? settings.backgrounds : [],
      currentBg: Number.isInteger(settings.currentBg) ? settings.currentBg : -1,
      musicIds: Array.isArray(settings.musicIds) ? settings.musicIds : []
    };
    saveState();
  } catch (_) {
    state = structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function imageUrl(key) {
  return key ? images[key] || key : '';
}

async function saveImage(file, prefix) {
  const dataUrl = await fileToDataUrl(file);
  const key = `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  await putImage(key, dataUrl);
  images[key] = dataUrl;
  return key;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function removeImage(key) {
  if (!key || key.startsWith('data:')) return;
  await deleteImageRecord(key);
  delete images[key];
}

async function exportHomepage() {
  const usedKeys = new Set([state.coverImage, ...state.backgrounds].filter(Boolean));
  const exportImages = Object.fromEntries([...usedKeys].filter(key => images[key]).map(key => [key, images[key]]));
  const blob = new Blob([JSON.stringify({ state, images: exportImages }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'kotori-homepage-backup.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importHomepage(file) {
  const payload = JSON.parse(await file.text());
  if (!payload?.state || typeof payload.state !== 'object') throw new Error('Invalid Homepage backup');
  for (const [key, value] of Object.entries(payload.images || {})) {
    await putImage(key, value);
    images[key] = value;
  }
  state = { ...defaultState, ...payload.state, version: 2 };
  saveState();
}

export async function initStorage() {
  await openDb();
  images = await readImages();
  loadState();
  return state;
}

export function getState() { return state; }
export function updateState(patch) { state = { ...state, ...patch, version: 2 }; saveState(); return state; }
export { imageUrl, saveImage, removeImage, exportHomepage, importHomepage };
