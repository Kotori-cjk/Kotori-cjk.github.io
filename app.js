const STORAGE_KEY = 'kotori-seika-v1';
const EMOJIS = ['✿','❀','🌸','⭐','💫','🎀','🦋','🌙'];
const PARENTS = {
  math:    { name:'数学', icon:'📐' },
  physics: { name:'物理', icon:'⚛️' }
};
const SUBJECTS = {
  'math-analysis': { name:'数分', icon:'📊', color:'var(--c-math)', parent:'math' },
  'math-linalg':   { name:'高代', icon:'📏', color:'var(--c-math)', parent:'math' },
  'physics-mech':  { name:'力学', icon:'🔧', color:'var(--c-physics)', parent:'physics' },
  'physics-elec':  { name:'电学', icon:'⚡', color:'var(--c-physics)', parent:'physics' },
  'cs':            { name:'程设', icon:'💻', color:'var(--c-cs)' },
  'ai':            { name:'AI引论', icon:'🤖', color:'var(--c-ai)' }
};
const SUBJECT_KEYS = Object.keys(SUBJECTS);

/* ===== IndexedDB Image Store (50MB+) ===== */
const IDB_NAME = 'kotori-seika-images';
const IDB_STORE = 'images';
let idb = null;
let imageCache = {}; // key → dataURL, loaded on init

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

/* ===== State ===== */
let state = {
  currentView: 'math-analysis',
  notes: { 'math-analysis':{}, 'math-linalg':{}, 'physics-mech':{}, 'physics-elec':{}, cs:{}, ai:{} },
  tasks: [],
  subjectLinks: {
    'math-analysis':{ notebookLM:'' }, 'math-linalg':{ notebookLM:'' },
    'physics-mech':{ notebookLM:'' }, 'physics-elec':{ notebookLM:'' },
    cs:{ notebookLM:'' }, ai:{ notebookLM:'' }
  },
  settings: {
    obsidianVault: 'Obsidian Vault',
    obsidianFolders: { 'math-analysis':'', 'math-linalg':'', 'physics-mech':'', 'physics-elec':'', cs:'', ai:'' },
    musicIds: [],
    backgrounds: [],
    currentBg: -1
  }
};

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateSaveStatus(true);
  } catch(e) {
    console.warn('Save failed', e);
    updateSaveStatus(false);
    showToast('⚠ 保存失败：存储空间可能不足（' + Math.round(JSON.stringify(state).length/1024) + 'KB），建议导出备份');
  }
}
function updateSaveStatus(ok) {
  const el = document.getElementById('save-indicator');
  if (!el) return;
  const t = new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  el.textContent = ok ? `💾 已保存 ${t}` : '⚠ 保存失败';
  el.className = 'save-indicator ' + (ok ? 'ok' : 'err');
}
function showToast(msg) {
  const el = document.getElementById('save-toast');
  if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 5000);
}
function load() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) {
      const p = JSON.parse(d);
      state = {...state, ...p, settings:{...state.settings,...(p.settings||{})},
        subjectLinks:{...state.subjectLinks,...(p.subjectLinks||{})},
        notes:{...state.notes,...(p.notes||{})}};
      if (!state.tasks) state.tasks = [];
      if (state.currentView==='math') state.currentView='math-analysis';
      if (state.currentView==='physics') state.currentView='physics-mech';
      ['notes','subjectLinks'].forEach(field => {
        if (state[field].math) { if(!state[field]['math-analysis']) state[field]['math-analysis']=state[field].math; delete state[field].math; }
        if (state[field].physics) { if(!state[field]['physics-mech']) state[field]['physics-mech']=state[field].physics; delete state[field].physics; }
      });
      const of = state.settings.obsidianFolders || {};
      if (of.math) { if(!of['math-analysis']) of['math-analysis']=of.math; delete of.math; }
      if (of.physics) { if(!of['physics-mech']) of['physics-mech']=of.physics; delete of.physics; }
      state.settings.obsidianFolders = of;
      SUBJECT_KEYS.forEach(k => {
        if (!state.notes[k]) state.notes[k] = {};
        if (!state.subjectLinks[k]) state.subjectLinks[k] = { notebookLM:'' };
        if (!state.settings.obsidianFolders[k]) state.settings.obsidianFolders[k] = '';
      });
    }
  } catch(e) { console.warn('Load failed',e); }
}

/* ===== Migrate old base64 data into IndexedDB ===== */
async function migrateImages() {
  let changed = false;
  // Backgrounds: move base64 → IndexedDB key
  for (let i = 0; i < state.settings.backgrounds.length; i++) {
    const val = state.settings.backgrounds[i];
    if (val && val.startsWith('data:')) {
      const key = 'bg_' + uid();
      await idbPut(key, val);
      imageCache[key] = val;
      state.settings.backgrounds[i] = key;
      changed = true;
    }
  }
  // Note images: replace inline data:image URLs with idb: references
  for (const subj of SUBJECT_KEYS) {
    for (const date of Object.keys(state.notes[subj] || {})) {
      for (const note of (state.notes[subj][date] || [])) {
        if (note.content && note.content.includes('](data:image')) {
          const re = /!\[([^\]]*)\]\((data:image[^)]+)\)/g;
          const replacements = [];
          let m;
          while ((m = re.exec(note.content)) !== null) {
            const key = 'note_' + uid();
            await idbPut(key, m[2]);
            imageCache[key] = m[2];
            replacements.push([m[0], `![${m[1]}](idb:${key})`]);
          }
          for (const [from, to] of replacements) {
            note.content = note.content.replace(from, to);
          }
          if (replacements.length) changed = true;
        }
      }
    }
  }
  if (changed) save();
}

/* ===== Utils ===== */
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function now() { return new Date().toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}); }
function today() { return new Date().toISOString().slice(0,10); }
let saveTimer = null;
function debounceSave() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 500); }
let nextId = Date.now();
function uid() { return ''+(nextId++); }

function looksLikeMathBlock(content) {
  return /\\[a-zA-Z]+|[_^{}=+\-*/]|[∫∑√πηΔ]/.test(content);
}

function normalizeLatexBlocks(text) {
  return String(text).replace(/(^|\n)\s*\[\s*\n([\s\S]*?)\n\s*\]\s*(?=\n|$)/g, (match, prefix, body) => {
    const content = body.trim();
    if (!content || !looksLikeMathBlock(content)) return match;
    return `${prefix}$$\n${content}\n$$`;
  });
}

function protectDisplayMath(text) {
  const blocks = [];
  const protectedText = normalizeLatexBlocks(text).replace(/(^|\n)\s*\$\$\s*\n([\s\S]*?)\n\s*\$\$\s*(?=\n|$)/g, (match, prefix, body) => {
    const token = `KOTORI_MATH_BLOCK_${blocks.length}`;
    blocks.push({
      token,
      html: `<div class="math-block">$$\n${escHtml(body.trim())}\n$$</div>`
    });
    return `${prefix}${token}\n`;
  });
  return { text: protectedText, blocks };
}

function restoreDisplayMath(html, blocks) {
  return blocks.reduce((out, block) => {
    const wrapped = new RegExp(`<p>\\s*${block.token}\\s*</p>`, 'g');
    return out.replace(wrapped, block.html).replaceAll(block.token, block.html);
  }, html);
}

function renderMarkdown(text) {
  if (!text) return '';
  // Resolve idb: image references from cache
  text = text.replace(/\(idb:([^)]+)\)/g, (m, key) => '(' + (imageCache[key] || '#') + ')');
  const math = protectDisplayMath(text);
  if (typeof marked !== 'undefined') {
    marked.setOptions({breaks:true,gfm:true});
    return restoreDisplayMath(marked.parse(math.text), math.blocks);
  }
  return escHtml(text).replace(/\n/g,'<br>');
}
function renderLatex(root) {
  if (!root || typeof renderMathInElement === 'undefined') return;
  renderMathInElement(root, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false }
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    throwOnError: false
  });
}
function compressImage(file, maxW, q) {
  maxW=maxW||800; q=q||0.7;
  return new Promise(r => {
    const reader = new FileReader();
    reader.onload = e => { const img = new Image(); img.onload = () => {
      const c = document.createElement('canvas'); let w=img.width, h=img.height;
      if(w>maxW){h=h*maxW/w;w=maxW;} c.width=w;c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h); r(c.toDataURL('image/jpeg',q));
    }; img.src=e.target.result; }; reader.readAsDataURL(file);
  });
}
async function saveImageToIDB(dataUrl) {
  const key = 'img_' + uid();
  await idbPut(key, dataUrl);
  imageCache[key] = dataUrl;
  return key;
}
function insertImageAtCursor(ta, ref) {
  const pos = ta.selectionStart||ta.value.length;
  const before = ta.value.substring(0,pos), after = ta.value.substring(ta.selectionEnd||pos);
  ta.value = before + (before.endsWith('\n')||!before?'':'\n') + `![image](${ref})\n` + after;
  ta.dispatchEvent(new Event('input',{bubbles:true}));
}

/* ===== Particles ===== */
function initParticles() {
  const c = document.getElementById('particles');
  for (let i=0;i<12;i++) {
    const p = document.createElement('span'); p.className='particle';
    p.textContent = EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
    p.style.left = Math.random()*100+'%';
    p.style.animationDelay = Math.random()*6+'s';
    p.style.animationDuration = (5+Math.random()*4)+'s';
    c.appendChild(p);
  }
}

/* ===== Render ===== */
function renderAll() {
  renderSubjectNav();
  renderTaskSummary();
  if (state.currentView === 'tasks') { renderTaskView(); }
  else { renderSubjectView(state.currentView); }
}

function renderSubjectNav() {
  document.querySelectorAll('.subject-btn[data-subject]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subject === state.currentView);
  });
  document.querySelector('.task-nav-btn').classList.toggle('active', state.currentView === 'tasks');
}

function renderTaskSummary() {
  const todayStr = today();
  const pending = state.tasks.filter(t => !t.done && t.date === todayStr).length;
  document.getElementById('task-count').textContent = pending ? `${pending} 项待办` : '今日无待办';
}

/* ===== Subject View ===== */
function renderSubjectView(subj) {
  const s = SUBJECTS[subj];
  if (!s) return;
  const sh = document.getElementById('subject-header');
  const vault = encodeURIComponent(state.settings.obsidianVault);
  const folder = state.settings.obsidianFolders[subj];
  const nlm = state.subjectLinks[subj]?.notebookLM;
  const parent = s.parent ? PARENTS[s.parent] : null;
  const heading = parent ? `${parent.icon} ${parent.name} / ${s.icon} ${s.name}` : `${s.icon} ${s.name}`;

  sh.className = 'subject-header ' + subj;
  sh.innerHTML = `<h2>${heading}</h2>
    <div class="subject-links">
      ${folder ? `<a class="link-obsidian" href="obsidian://open?vault=${vault}&file=${encodeURIComponent(folder)}" title="打开Obsidian">📒 Obsidian</a>` : ''}
      ${nlm ? `<a class="link-nlm" href="${escHtml(nlm)}" target="_blank" title="NotebookLM">📓 NotebookLM</a>` : ''}
    </div>`;
  sh.style.display = '';

  document.getElementById('view-notes').classList.add('active');
  document.getElementById('view-tasks').classList.remove('active');
  renderNotes(subj);
}

function renderNotes(subj) {
  const el = document.getElementById('view-notes');
  const notes = state.notes[subj] || {};
  const todayStr = today();
  const dates = Object.keys(notes).sort().reverse();

  let totalNotes = 0;
  dates.forEach(d => { totalNotes += (notes[d]||[]).length; });

  let html = `<div class="note-input-area">
    <h4>📝 写笔记</h4>
    <input type="text" id="note-title-input" class="note-title-input" placeholder="标题（知识点名称）...">
    <div class="note-toolbar">
      <button class="note-tool-btn" id="note-preview-btn">👁 预览</button>
      <label class="note-tool-btn">📷 贴图<input type="file" accept="image/*" id="note-img-input"></label>
    </div>
    <textarea id="note-textarea" placeholder="支持 Markdown 语法，可直接粘贴图片..."></textarea>
    <div class="note-preview" id="note-preview" style="display:none"></div>
    <div class="note-input-row">
      <button class="btn btn-primary btn-sm" id="note-submit-btn">发布笔记</button>
      <button class="btn btn-secondary btn-sm hidden" id="note-cancel-edit-btn">取消编辑</button>
    </div>
  </div>`;

  if (totalNotes > 0) {
    html += `<div class="catalog-card">
      <div class="catalog-header" id="catalog-toggle">
        <h4>📑 笔记目录 (${totalNotes})</h4>
        <span class="catalog-caret">▼</span>
      </div>
      <div class="catalog-body" id="catalog-body">
        <input type="text" class="catalog-search" id="catalog-search" placeholder="搜索标题...">`;
    dates.forEach(date => {
      const dayNotes = notes[date] || [];
      if (!dayNotes.length) return;
      const label = date===todayStr ? `今天 (${date})` : date;
      html += `<div class="catalog-date-group"><div class="catalog-date-label">📅 ${label}</div>`;
      dayNotes.slice().reverse().forEach(n => {
        const t = n.title || n.content?.substring(0,20) || '无标题';
        html += `<a class="catalog-entry" data-scroll-to="${n.id}">→ ${escHtml(t)}</a>`;
      });
      html += `</div>`;
    });
    html += `</div></div>`;
  }

  if (!totalNotes) {
    html += `<div class="task-empty"><div class="big-icon">📝</div><p>还没有笔记，写下你的第一条吧~</p></div>`;
  }
  dates.forEach(date => {
    const dayNotes = notes[date];
    if (!dayNotes || !dayNotes.length) return;
    const label = date===todayStr ? `📅 今天 (${date})` : `📅 ${date}`;
    html += `<div class="note-date-group"><div class="note-date-label">${label}</div>`;
    dayNotes.slice().reverse().forEach((n,i) => {
      const realIdx = dayNotes.length - 1 - i;
      html += `<div class="note-card${n.collapsed ? ' collapsed' : ''}" id="note-anchor-${n.id}">
        <div class="note-card-head">
          <div>
            ${n.title ? `<div class="note-title-heading">${escHtml(n.title)}</div>` : ''}
            <div class="note-time">${n.time}${n.updatedAt ? ` · 更新于 ${n.updatedAt}` : ''}</div>
          </div>
          <div class="note-card-actions">
            <button class="note-fold" data-note-edit='${JSON.stringify({subj,date,idx:realIdx})}'>编辑</button>
            <button class="note-fold" data-note-fold='${JSON.stringify({subj,date,idx:realIdx})}'>${n.collapsed ? '展开' : '折叠'}</button>
          </div>
        </div>
        <div class="note-body">${renderMarkdown(n.content)}</div>
        <button class="note-delete" data-note-del='${JSON.stringify({subj,date,idx:realIdx})}'>✕</button>
      </div>`;
    });
    html += `</div>`;
  });

  el.innerHTML = html;
  renderLatex(el);
}

/* ===== Task View ===== */
function renderTaskView() {
  document.getElementById('subject-header').style.display = 'none';
  document.getElementById('view-notes').classList.remove('active');
  document.getElementById('view-tasks').classList.add('active');

  const el = document.getElementById('view-tasks');
  const todayStr = today();

  let html = `<div class="task-input-area">
    <h4>➕ 添加任务</h4>
    <div class="task-form">
      <input type="text" id="task-title-input" placeholder="任务标题">
      <textarea id="task-detail-input" placeholder="详情 (选填)"></textarea>
      <div class="task-form-bottom">
        <select id="task-subject-select">
          <option value="">通用</option>
          <option value="math">📐 数学</option>
          <option value="physics">⚛️ 物理</option>
          <option value="cs">💻 程设</option>
          <option value="ai">🤖 AI引论</option>
        </select>
        <button class="btn btn-orange btn-sm" id="task-add-btn">添加</button>
      </div>
    </div>
  </div>`;

  const byDate = {};
  state.tasks.forEach((t,i) => {
    if (!byDate[t.date]) byDate[t.date] = [];
    byDate[t.date].push({...t, _idx:i});
  });
  const dates = Object.keys(byDate).sort().reverse();

  if (!dates.length) {
    html += `<div class="task-empty"><div class="big-icon">✅</div><p>还没有任务~</p></div>`;
  }
  dates.forEach(date => {
    const label = date===todayStr ? `📅 今天 (${date})` : `📅 ${date}`;
    html += `<div class="task-date-group"><div class="task-date-label">${label}</div>`;
    byDate[date].forEach(t => {
      const tagCls = t.subject ? `task-tag-${t.subject}` : 'task-tag-general';
      const tagName = t.subject ? SUBJECTS[t.subject]?.name : '通用';
      html += `<div class="task-card${t.done?' done':''}" data-task-idx="${t._idx}">
        <div class="task-check" data-task-toggle="${t._idx}">${t.done?'✓':''}</div>
        <div class="task-content">
          <div class="task-title">${escHtml(t.title)}</div>
          ${t.detail ? `<div class="task-detail">${escHtml(t.detail)}</div>` : ''}
          <div class="task-meta"><span class="task-tag ${tagCls}">${tagName}</span></div>
        </div>
        <button class="task-delete" data-task-del="${t._idx}">✕</button>
      </div>`;
    });
    html += `</div>`;
  });

  el.innerHTML = html;
}

/* ===== Background ===== */
function applyBackground() {
  const bg = document.getElementById('bg-layer');
  const idx = state.settings.currentBg, bgs = state.settings.backgrounds;
  if (idx>=0 && bgs[idx]) {
    const data = imageCache[bgs[idx]] || bgs[idx]; // key from cache, or legacy raw data
    bg.style.backgroundImage=`url(${data})`; bg.classList.add('has-bg');
  } else { bg.style.backgroundImage=''; bg.classList.remove('has-bg'); }
}
function renderBgPreviews() {
  const el = document.getElementById('bg-preview-list');
  el.innerHTML = state.settings.backgrounds.map((key,i) => {
    const src = imageCache[key] || key;
    return `<div class="bg-preview-item${state.settings.currentBg===i?' active':''}" data-bg-select="${i}">
      <img src="${src}" alt="bg"><button class="bg-preview-delete" data-bg-del="${i}">✕</button></div>`;
  }).join('');
}

/* ===== Music ===== */
function renderMusic() {
  const c = document.getElementById('music-container');
  const ids = state.settings.musicIds;
  if (!ids.length) { c.innerHTML='<p class="empty-hint">在设置中添加网易云音乐~</p>'; return; }
  c.innerHTML = ids.map(id =>
    `<iframe frameborder="no" width="100%" height="86" src="https://music.163.com/outchain/player?type=2&id=${id}&auto=0&height=66" style="margin-bottom:6px;border-radius:8px"></iframe>`
  ).join('');
}
function renderMusicManageList() {
  const el = document.getElementById('music-manage-list');
  const ids = state.settings.musicIds;
  if (!ids.length) { el.innerHTML='<p class="empty-hint">暂未添加</p>'; return; }
  el.innerHTML = ids.map((id,i) =>
    `<div class="music-manage-item"><span>🎵 ID: ${id}</span><button data-music-del="${i}">✕</button></div>`
  ).join('');
}
function parseMusicId(input) {
  input=input.trim(); if(/^\d+$/.test(input)) return input;
  let m=input.match(/[?&]id=(\d+)/); if(m) return m[1];
  m=input.match(/song\/(\d+)/); if(m) return m[1]; return null;
}

/* ===== Settings ===== */
function openSettings() {
  document.getElementById('set-obsidian-vault').value = state.settings.obsidianVault;
  SUBJECT_KEYS.forEach(k => {
    document.getElementById('set-obs-'+k).value = state.settings.obsidianFolders[k]||'';
    document.getElementById('set-nlm-'+k).value = state.subjectLinks[k]?.notebookLM||'';
  });
  renderBgPreviews(); renderMusicManageList();
  document.getElementById('settings-modal').classList.add('open');
}
function closeSettings() {
  state.settings.obsidianVault = document.getElementById('set-obsidian-vault').value.trim()||'Obsidian Vault';
  SUBJECT_KEYS.forEach(k => {
    state.settings.obsidianFolders[k] = document.getElementById('set-obs-'+k).value.trim();
    if (!state.subjectLinks[k]) state.subjectLinks[k]={};
    state.subjectLinks[k].notebookLM = document.getElementById('set-nlm-'+k).value.trim();
  });
  save(); updateObsidianLink();
  document.getElementById('settings-modal').classList.remove('open');
  renderAll();
}
function updateObsidianLink() {
  const vault = encodeURIComponent(state.settings.obsidianVault);
  document.getElementById('obsidian-link').href = `obsidian://open?vault=${vault}`;
}

/* ===== Export / Import (includes IndexedDB images) ===== */
async function exportData() {
  const allImages = await idbGetAll();
  const exportObj = { ...state, _images: allImages };
  const blob = new Blob([JSON.stringify(exportObj,null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='kotori-seika-backup.json'; a.click(); URL.revokeObjectURL(a.href);
  showToast('📤 导出成功（含全部图片）');
}
async function importData(file) {
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const d=JSON.parse(e.target.result);
      // Restore images to IndexedDB
      if (d._images) {
        for (const [key, data] of Object.entries(d._images)) {
          await idbPut(key, data);
          imageCache[key] = data;
        }
        delete d._images;
      }
      state={...state,...d,settings:{...state.settings,...(d.settings||{})},
        subjectLinks:{...state.subjectLinks,...(d.subjectLinks||{})},
        notes:{...state.notes,...(d.notes||{})}};
      if(!state.tasks) state.tasks=[];
      save(); applyBackground(); renderMusic(); updateObsidianLink(); renderAll();
      alert('导入成功！');
    } catch(err) { alert('导入失败：文件格式不正确'); }
  };
  reader.readAsText(file);
}

/* ===== Events ===== */
function setupEvents() {
  // Subject navigation
  document.getElementById('sidebar').addEventListener('click', e => {
    const btn = e.target.closest('.subject-btn[data-subject]');
    if (btn) { state.currentView = btn.dataset.subject; save(); renderAll(); return; }
    const taskBtn = e.target.closest('.task-nav-btn');
    if (taskBtn) { state.currentView = 'tasks'; save(); renderAll(); }
  });

  const vn = document.getElementById('view-notes');

  vn.addEventListener('click', e => {
    const scrollEntry = e.target.closest('[data-scroll-to]');
    if (scrollEntry) {
      const target = document.getElementById('note-anchor-' + scrollEntry.dataset.scrollTo);
      if (target) {
        target.scrollIntoView({behavior:'smooth', block:'start'});
        target.classList.remove('note-highlight');
        void target.offsetWidth;
        target.classList.add('note-highlight');
        setTimeout(() => target.classList.remove('note-highlight'), 1700);
      }
      return;
    }
    if (e.target.closest('#catalog-toggle')) {
      const body = document.getElementById('catalog-body');
      const caret = document.querySelector('.catalog-caret');
      const collapsed = body.classList.toggle('collapsed');
      if (caret) caret.textContent = collapsed ? '▶' : '▼';
      return;
    }
    if (e.target.id === 'note-submit-btn') {
      const titleInput = document.getElementById('note-title-input');
      const ta = document.getElementById('note-textarea');
      const title = titleInput ? titleInput.value.trim() : '';
      const content = ta.value.trim();
      if (!content && !title) return;
      const subj = state.currentView;
      const editing = ta.dataset.editingNote ? JSON.parse(ta.dataset.editingNote) : null;
      if (editing) {
        const note = state.notes[editing.subj]?.[editing.date]?.[editing.idx];
        if (note) {
          note.title = title;
          note.content = content;
          note.updatedAt = now();
          save(); renderNotes(editing.subj);
        }
        return;
      }
      const d = today();
      if (!state.notes[subj][d]) state.notes[subj][d] = [];
      state.notes[subj][d].push({ id:uid(), title, content, time:now() });
      save(); renderNotes(subj);
      const ti = document.getElementById('note-title-input');
      if (ti) ti.focus();
      return;
    }
    if (e.target.id === 'note-cancel-edit-btn') {
      const titleInput = document.getElementById('note-title-input');
      const ta = document.getElementById('note-textarea');
      if (titleInput) titleInput.value = '';
      if (ta) {
        ta.value = '';
        delete ta.dataset.editingNote;
        ta.style.display = '';
      }
      const pv = document.getElementById('note-preview');
      if (pv) { pv.style.display = 'none'; pv.innerHTML = ''; }
      const submit = document.getElementById('note-submit-btn');
      if (submit) submit.textContent = '发布笔记';
      e.target.classList.add('hidden');
      return;
    }
    if (e.target.id === 'note-preview-btn') {
      const ta = document.getElementById('note-textarea');
      const pv = document.getElementById('note-preview');
      if (pv.style.display==='none') {
        pv.innerHTML=renderMarkdown(ta.value); renderLatex(pv); pv.style.display='block'; ta.style.display='none';
        e.target.textContent='✏️ 编辑';
      } else {
        pv.style.display='none'; ta.style.display=''; e.target.textContent='👁 预览';
      }
      return;
    }
    const del = e.target.closest('[data-note-del]');
    if (del) {
      const d = JSON.parse(del.dataset.noteDel);
      if (state.notes[d.subj] && state.notes[d.subj][d.date]) {
        state.notes[d.subj][d.date].splice(d.idx,1);
        if (!state.notes[d.subj][d.date].length) delete state.notes[d.subj][d.date];
        save(); renderNotes(d.subj);
      }
    }
    const edit = e.target.closest('[data-note-edit]');
    if (edit) {
      const d = JSON.parse(edit.dataset.noteEdit);
      const note = state.notes[d.subj]?.[d.date]?.[d.idx];
      if (!note) return;
      const titleInput = document.getElementById('note-title-input');
      const ta = document.getElementById('note-textarea');
      const pv = document.getElementById('note-preview');
      if (titleInput) titleInput.value = note.title || '';
      if (ta) {
        ta.value = note.content || '';
        ta.dataset.editingNote = JSON.stringify(d);
        ta.style.display = '';
      }
      if (pv) { pv.style.display = 'none'; pv.innerHTML = ''; }
      const submit = document.getElementById('note-submit-btn');
      const cancel = document.getElementById('note-cancel-edit-btn');
      if (submit) submit.textContent = '更新笔记';
      if (cancel) cancel.classList.remove('hidden');
      document.querySelector('.note-input-area')?.scrollIntoView({behavior:'smooth', block:'start'});
      if (titleInput) titleInput.focus();
      return;
    }
    const fold = e.target.closest('[data-note-fold]');
    if (fold) {
      const d = JSON.parse(fold.dataset.noteFold);
      const note = state.notes[d.subj]?.[d.date]?.[d.idx];
      if (note) {
        note.collapsed = !note.collapsed;
        save(); renderNotes(d.subj);
      }
    }
  });

  // Image upload → IndexedDB
  vn.addEventListener('change', e => {
    if (e.target.id === 'note-img-input' && e.target.files[0]) {
      compressImage(e.target.files[0]).then(async dataUrl => {
        const key = await saveImageToIDB(dataUrl);
        const ta = document.getElementById('note-textarea');
        if (ta) insertImageAtCursor(ta, 'idb:' + key);
        e.target.value = '';
      });
    }
  });

  vn.addEventListener('input', e => {
    if (e.target.id === 'catalog-search') {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.catalog-entry').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
      document.querySelectorAll('.catalog-date-group').forEach(g => {
        const hasVisible = Array.from(g.querySelectorAll('.catalog-entry')).some(e => e.style.display !== 'none');
        g.style.display = hasVisible ? '' : 'none';
      });
    }
  });

  // Image paste → IndexedDB
  vn.addEventListener('paste', async e => {
    if (!e.target.matches || !e.target.matches('#note-textarea')) return;
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (let i=0;i<items.length;i++) {
      if (items[i].type.indexOf('image')!==-1) {
        e.preventDefault();
        const dataUrl = await compressImage(items[i].getAsFile());
        const key = await saveImageToIDB(dataUrl);
        insertImageAtCursor(e.target, 'idb:' + key);
        break;
      }
    }
  });

  // Task view
  const vt = document.getElementById('view-tasks');
  vt.addEventListener('click', e => {
    if (e.target.id === 'task-add-btn') {
      const title = document.getElementById('task-title-input').value.trim();
      if (!title) return;
      const detail = document.getElementById('task-detail-input').value.trim();
      const subject = document.getElementById('task-subject-select').value;
      state.tasks.push({ id:uid(), title, detail, subject, date:today(), done:false });
      save(); renderAll();
      return;
    }
    const tog = e.target.closest('[data-task-toggle]');
    if (tog) { const idx=+tog.dataset.taskToggle; state.tasks[idx].done=!state.tasks[idx].done; save(); renderAll(); return; }
    const del = e.target.closest('[data-task-del]');
    if (del) { state.tasks.splice(+del.dataset.taskDel,1); save(); renderAll(); }
  });

  // Settings
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.querySelector('.modal-close').addEventListener('click', closeSettings);
  document.querySelector('.modal-overlay').addEventListener('click', closeSettings);

  // Background upload → IndexedDB
  document.getElementById('bg-upload').addEventListener('change', e => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = async ev => {
        const key = await saveImageToIDB(ev.target.result);
        state.settings.backgrounds.push(key);
        if (state.settings.currentBg<0) state.settings.currentBg=0;
        save(); applyBackground(); renderBgPreviews();
      }; reader.readAsDataURL(file);
    }); e.target.value='';
  });
  document.getElementById('bg-preview-list').addEventListener('click', e => {
    const sel = e.target.closest('[data-bg-select]');
    if (sel && !e.target.closest('.bg-preview-delete')) {
      state.settings.currentBg=+sel.dataset.bgSelect; save(); applyBackground(); renderBgPreviews(); return;
    }
    const del = e.target.closest('[data-bg-del]');
    if (del) {
      const i=+del.dataset.bgDel;
      const key = state.settings.backgrounds[i];
      if (key && !key.startsWith('data:')) idbDel(key).catch(()=>{});
      delete imageCache[key];
      state.settings.backgrounds.splice(i,1);
      if(state.settings.currentBg>=state.settings.backgrounds.length) state.settings.currentBg=state.settings.backgrounds.length-1;
      save(); applyBackground(); renderBgPreviews();
    }
  });
  document.getElementById('bg-reset-btn').addEventListener('click', () => {
    state.settings.currentBg=-1; save(); applyBackground(); renderBgPreviews();
  });

  // Music
  document.getElementById('music-add-btn').addEventListener('click', () => {
    const input = document.getElementById('music-input');
    const id = parseMusicId(input.value);
    if (!id) { alert('请输入有效的网易云音乐链接或歌曲ID'); return; }
    state.settings.musicIds.push(id); save(); renderMusic(); renderMusicManageList(); input.value='';
  });
  document.getElementById('music-manage-list').addEventListener('click', e => {
    const del = e.target.closest('[data-music-del]');
    if (del) { state.settings.musicIds.splice(+del.dataset.musicDel,1); save(); renderMusic(); renderMusicManageList(); }
  });

  // Export / Import
  document.getElementById('export-btn').addEventListener('click', () => exportData());
  document.getElementById('import-file').addEventListener('change', e => {
    if (e.target.files[0]) importData(e.target.files[0]); e.target.value='';
  });

  // Esc + bg viewing
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') {
      if (document.body.classList.contains('bg-viewing')) { document.body.classList.remove('bg-viewing'); }
      else { closeSettings(); }
    }
  });
  document.getElementById('bg-view-btn').addEventListener('click', () => {
    if (state.settings.currentBg < 0) { alert('请先在设置中上传背景图片'); return; }
    document.body.classList.add('bg-viewing');
  });
  document.getElementById('bg-view-exit').addEventListener('click', () => {
    document.body.classList.remove('bg-viewing');
  });
}

/* ===== Init (async: opens IndexedDB first) ===== */
async function init() {
  await idbOpen();
  imageCache = await idbGetAll();
  load();
  await migrateImages();
  initParticles();
  updateObsidianLink();
  applyBackground();
  renderMusic();
  setupEvents();
  renderAll();
  window.addEventListener('beforeunload', () => save());
  setInterval(save, 30000);
}
document.addEventListener('DOMContentLoaded', () => init());
