const STORAGE_KEY = 'kotori-seika-v1';
const EMOJIS = ['✿','❀','🌸','⭐','💫','🎀','🦋','🌙'];
const SUBJECTS = {
  math:    { name:'数学',   icon:'📐', color:'var(--c-math)' },
  physics: { name:'物理',   icon:'⚛️', color:'var(--c-physics)' },
  cs:      { name:'程设',   icon:'💻', color:'var(--c-cs)' },
  ai:      { name:'AI引论', icon:'🤖', color:'var(--c-ai)' }
};
const SUBJECT_KEYS = Object.keys(SUBJECTS);

/* ===== State ===== */
let state = {
  currentView: 'math', // math|physics|cs|ai|tasks
  notes: { math:{}, physics:{}, cs:{}, ai:{} },
  tasks: [],
  subjectLinks: {
    math:{ notebookLM:'' }, physics:{ notebookLM:'' },
    cs:{ notebookLM:'' }, ai:{ notebookLM:'' }
  },
  settings: {
    obsidianVault: 'Obsidian Vault',
    obsidianFolders: { math:'', physics:'', cs:'', ai:'' },
    musicIds: [],
    backgrounds: [],
    currentBg: -1
  }
};

function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) { console.warn('Save failed',e); } }
function load() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) {
      const p = JSON.parse(d);
      state = {...state, ...p, settings:{...state.settings,...(p.settings||{})},
        subjectLinks:{...state.subjectLinks,...(p.subjectLinks||{})},
        notes:{...state.notes,...(p.notes||{})}};
      if (!state.tasks) state.tasks = [];
      SUBJECT_KEYS.forEach(k => {
        if (!state.notes[k]) state.notes[k] = {};
        if (!state.subjectLinks[k]) state.subjectLinks[k] = { notebookLM:'' };
        if (!state.settings.obsidianFolders[k]) state.settings.obsidianFolders[k] = '';
      });
    }
  } catch(e) { console.warn('Load failed',e); }
}

/* ===== Utils (reused) ===== */
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function now() { return new Date().toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}); }
function today() { return new Date().toISOString().slice(0,10); }
let saveTimer = null;
function debounceSave() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 500); }
let nextId = Date.now();
function uid() { return ''+(nextId++); }

function renderMarkdown(text) {
  if (!text) return '';
  if (typeof marked !== 'undefined') { marked.setOptions({breaks:true,gfm:true}); return marked.parse(text); }
  return escHtml(text).replace(/\n/g,'<br>');
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
function insertImageAtCursor(ta, url) {
  const pos = ta.selectionStart||ta.value.length;
  const before = ta.value.substring(0,pos), after = ta.value.substring(ta.selectionEnd||pos);
  ta.value = before + (before.endsWith('\n')||!before?'':'\n') + `![image](${url})\n` + after;
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

  sh.className = 'subject-header ' + subj;
  sh.innerHTML = `<h2>${s.icon} ${s.name}</h2>
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

  // Count all notes
  let totalNotes = 0;
  dates.forEach(d => { totalNotes += (notes[d]||[]).length; });

  // Input area with title
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
    </div>
  </div>`;

  // Catalog
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

  // Notes grouped by date
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
      html += `<div class="note-card" id="note-anchor-${n.id}">
        ${n.title ? `<div class="note-title-heading">${escHtml(n.title)}</div>` : ''}
        <div class="note-time">${n.time}</div>
        <div class="note-body">${renderMarkdown(n.content)}</div>
        <button class="note-delete" data-note-del='${JSON.stringify({subj,date,idx:realIdx})}'>✕</button>
      </div>`;
    });
    html += `</div>`;
  });

  el.innerHTML = html;
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

  // Group by date
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
  if (idx>=0 && bgs[idx]) { bg.style.backgroundImage=`url(${bgs[idx]})`; bg.classList.add('has-bg'); }
  else { bg.style.backgroundImage=''; bg.classList.remove('has-bg'); }
}
function renderBgPreviews() {
  const el = document.getElementById('bg-preview-list');
  el.innerHTML = state.settings.backgrounds.map((url,i) =>
    `<div class="bg-preview-item${state.settings.currentBg===i?' active':''}" data-bg-select="${i}">
      <img src="${url}" alt="bg"><button class="bg-preview-delete" data-bg-del="${i}">✕</button></div>`
  ).join('');
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

/* ===== Export / Import ===== */
function exportData() {
  const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='kotori-seika-backup.json'; a.click(); URL.revokeObjectURL(a.href);
}
function importData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const d=JSON.parse(e.target.result);
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

  // ---- Notes view events (delegated on view-notes) ----
  const vn = document.getElementById('view-notes');

  vn.addEventListener('click', e => {
    // Catalog scroll
    const scrollEntry = e.target.closest('[data-scroll-to]');
    if (scrollEntry) {
      const target = document.getElementById('note-anchor-' + scrollEntry.dataset.scrollTo);
      if (target) {
        target.scrollIntoView({behavior:'smooth', block:'start'});
        target.classList.remove('note-highlight');
        // retrigger animation
        void target.offsetWidth;
        target.classList.add('note-highlight');
        setTimeout(() => target.classList.remove('note-highlight'), 1700);
      }
      return;
    }
    // Catalog toggle
    if (e.target.closest('#catalog-toggle')) {
      const body = document.getElementById('catalog-body');
      const caret = document.querySelector('.catalog-caret');
      const collapsed = body.classList.toggle('collapsed');
      if (caret) caret.textContent = collapsed ? '▶' : '▼';
      return;
    }
    // Submit note
    if (e.target.id === 'note-submit-btn') {
      const titleInput = document.getElementById('note-title-input');
      const ta = document.getElementById('note-textarea');
      const title = titleInput ? titleInput.value.trim() : '';
      const content = ta.value.trim();
      if (!content && !title) return;
      const subj = state.currentView;
      const d = today();
      if (!state.notes[subj][d]) state.notes[subj][d] = [];
      state.notes[subj][d].push({ id:uid(), title, content, time:now() });
      save(); renderNotes(subj);
      const ti = document.getElementById('note-title-input');
      if (ti) ti.focus();
      return;
    }
    // Preview toggle
    if (e.target.id === 'note-preview-btn') {
      const ta = document.getElementById('note-textarea');
      const pv = document.getElementById('note-preview');
      if (pv.style.display==='none') {
        pv.innerHTML=renderMarkdown(ta.value); pv.style.display='block'; ta.style.display='none';
        e.target.textContent='✏️ 编辑';
      } else {
        pv.style.display='none'; ta.style.display=''; e.target.textContent='👁 预览';
      }
      return;
    }
    // Delete note
    const del = e.target.closest('[data-note-del]');
    if (del) {
      const d = JSON.parse(del.dataset.noteDel);
      if (state.notes[d.subj] && state.notes[d.subj][d.date]) {
        state.notes[d.subj][d.date].splice(d.idx,1);
        if (!state.notes[d.subj][d.date].length) delete state.notes[d.subj][d.date];
        save(); renderNotes(d.subj);
      }
    }
  });

  // Image upload
  vn.addEventListener('change', e => {
    if (e.target.id === 'note-img-input' && e.target.files[0]) {
      compressImage(e.target.files[0]).then(url => {
        const ta = document.getElementById('note-textarea');
        if (ta) insertImageAtCursor(ta, url);
        e.target.value = '';
      });
    }
  });

  // Catalog search filter
  vn.addEventListener('input', e => {
    if (e.target.id === 'catalog-search') {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.catalog-entry').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
      // Hide empty date groups
      document.querySelectorAll('.catalog-date-group').forEach(g => {
        const hasVisible = Array.from(g.querySelectorAll('.catalog-entry')).some(e => e.style.display !== 'none');
        g.style.display = hasVisible ? '' : 'none';
      });
    }
  });

  // Image paste
  vn.addEventListener('paste', async e => {
    if (!e.target.matches || !e.target.matches('#note-textarea')) return;
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (let i=0;i<items.length;i++) {
      if (items[i].type.indexOf('image')!==-1) {
        e.preventDefault();
        const url = await compressImage(items[i].getAsFile());
        insertImageAtCursor(e.target, url);
        break;
      }
    }
  });

  // ---- Task view events (delegated on view-tasks) ----
  const vt = document.getElementById('view-tasks');

  vt.addEventListener('click', e => {
    // Add task
    if (e.target.id === 'task-add-btn') {
      const title = document.getElementById('task-title-input').value.trim();
      if (!title) return;
      const detail = document.getElementById('task-detail-input').value.trim();
      const subject = document.getElementById('task-subject-select').value;
      state.tasks.push({ id:uid(), title, detail, subject, date:today(), done:false });
      save(); renderAll();
      return;
    }
    // Toggle done
    const tog = e.target.closest('[data-task-toggle]');
    if (tog) {
      const idx = +tog.dataset.taskToggle;
      state.tasks[idx].done = !state.tasks[idx].done;
      save(); renderAll(); return;
    }
    // Delete task
    const del = e.target.closest('[data-task-del]');
    if (del) {
      state.tasks.splice(+del.dataset.taskDel, 1);
      save(); renderAll();
    }
  });

  // ---- Settings ----
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.querySelector('.modal-close').addEventListener('click', closeSettings);
  document.querySelector('.modal-overlay').addEventListener('click', closeSettings);

  // Background
  document.getElementById('bg-upload').addEventListener('change', e => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        state.settings.backgrounds.push(ev.target.result);
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
      const i=+del.dataset.bgDel; state.settings.backgrounds.splice(i,1);
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
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('import-file').addEventListener('change', e => {
    if (e.target.files[0]) importData(e.target.files[0]); e.target.value='';
  });

  // Esc
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') {
      if (document.body.classList.contains('bg-viewing')) { document.body.classList.remove('bg-viewing'); }
      else { closeSettings(); }
    }
  });

  // Background viewing mode
  document.getElementById('bg-view-btn').addEventListener('click', () => {
    if (state.settings.currentBg < 0) { alert('请先在设置中上传背景图片'); return; }
    document.body.classList.add('bg-viewing');
  });
  document.getElementById('bg-view-exit').addEventListener('click', () => {
    document.body.classList.remove('bg-viewing');
  });
}

/* ===== Init ===== */
function init() {
  load();
  initParticles();
  updateObsidianLink();
  applyBackground();
  renderMusic();
  setupEvents();
  renderAll();
}
document.addEventListener('DOMContentLoaded', init);
