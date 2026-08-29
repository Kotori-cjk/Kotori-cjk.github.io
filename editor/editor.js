const OWNER = 'Kotori-cjk';
const REPO = 'Kotori-cjk.github.io';
const BRANCH = 'main';
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const DRAFT_DB = 'kotori-content-studio';
const DRAFT_STORE = 'drafts';
const DRAFT_KEY = 'homepage-v1';
const markdown = window.markdownit({ html: false, linkify: true, typographer: true });

let token = '';
let activeTab = 'site';
let connected = false;
let baseSha = '';
let baseData;
let state = { site: {}, projects: [], music: [], posts: [], assets: [], pendingAssets: [], deletedPaths: [] };
let history = [];
let draftTimer;
let previewUrl = '';

const panel = document.getElementById('editor-panel');
const saveState = document.getElementById('save-state');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

function clone(value) { return structuredClone(value); }
function slugify(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff-]+/g, '-').replace(/^-+|-+$/g, '') || `item-${Date.now()}`; }
function tagsFrom(value) { return String(value || '').split(/[,，]/).map(item => item.trim()).filter(Boolean); }
function listFrom(value) { return String(value || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean); }
function json(value) { return `${JSON.stringify(value, null, 2)}\n`; }

function parseFrontmatter(raw, path) {
  const match = String(raw).match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  const meta = {};
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const separator = line.indexOf(':'); if (separator < 0) continue;
      const key = line.slice(0, separator).trim(); let value = line.slice(separator + 1).trim();
      if (value === 'true' || value === 'false') value = value === 'true';
      else if (value.startsWith('[')) { try { value = JSON.parse(value.replace(/'/g, '"')); } catch (_) { value = tagsFrom(value.slice(1, -1)); } }
      else value = value.replace(/^['"]|['"]$/g, '');
      meta[key] = value;
    }
  }
  const slug = slugify(meta.slug || path.split('/').pop().replace(/\.md$/, ''));
  return { path, slug, title: meta.title || slug, date: String(meta.date || ''), summary: meta.summary || '', cover: meta.cover || '', tags: Array.isArray(meta.tags) ? meta.tags : [], draft: meta.draft === true, body: match ? match[2] : raw };
}

function postRaw(post) {
  return `---\ntitle: ${JSON.stringify(post.title || post.slug)}\ndate: ${JSON.stringify(post.date || '')}\nsummary: ${JSON.stringify(post.summary || '')}\ncover: ${JSON.stringify(post.cover || '')}\ntags: ${JSON.stringify(post.tags || [])}\ndraft: ${Boolean(post.draft)}\n---\n\n${post.body || ''}`;
}

function markDirty() {
  const dirty = baseData ? prepareChanges().length > 0 : true;
  saveState.textContent = dirty ? '有未发布修改' : '没有未发布修改';
  saveState.classList.toggle('dirty', dirty);
  clearTimeout(draftTimer);
  if (dirty) draftTimer = setTimeout(saveDraft, 450);
  else clearDraft().catch(() => {});
}

function checkpoint() {
  history.push(clone(state)); if (history.length > 25) history.shift();
}

function mutate(callback, rerender = false) {
  checkpoint(); callback(); markDirty(); if (rerender) render();
}

async function openDraftDb() {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(DRAFT_DB, 1);
    request.onupgradeneeded = event => event.target.result.createObjectStore(DRAFT_STORE);
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

async function saveDraft() {
  const db = await openDraftDb();
  const payload = clone(state);
  await new Promise((resolve, reject) => { const transaction = db.transaction(DRAFT_STORE, 'readwrite'); transaction.objectStore(DRAFT_STORE).put(payload, DRAFT_KEY); transaction.oncomplete = resolve; transaction.onerror = event => reject(event.target.error); });
  saveState.textContent = '草稿已自动保存';
}

async function readDraft() {
  const db = await openDraftDb();
  return await new Promise((resolve, reject) => { const request = db.transaction(DRAFT_STORE, 'readonly').objectStore(DRAFT_STORE).get(DRAFT_KEY); request.onsuccess = () => resolve(request.result); request.onerror = event => reject(event.target.error); });
}

async function clearDraft() {
  const db = await openDraftDb();
  await new Promise((resolve, reject) => { const transaction = db.transaction(DRAFT_STORE, 'readwrite'); transaction.objectStore(DRAFT_STORE).delete(DRAFT_KEY); transaction.oncomplete = resolve; transaction.onerror = event => reject(event.target.error); });
}

async function fetchJson(path, fallback) {
  try { const response = await fetch(`../${path}`, { cache: 'no-cache' }); return response.ok ? await response.json() : fallback; }
  catch (_) { return fallback; }
}

async function loadPublished() {
  const [site, projects, music, manifest] = await Promise.all([fetchJson('content/site.json', {}), fetchJson('content/projects.json', []), fetchJson('content/music.json', []), fetchJson('content/posts.json', [])]);
  const posts = [];
  for (const item of manifest) {
    try { const response = await fetch(`../content/posts/${encodeURIComponent(item.slug)}.md`, { cache: 'no-cache' }); if (response.ok) posts.push(parseFrontmatter(await response.text(), `content/posts/${item.slug}.md`)); }
    catch (_) { /* keep loading remaining posts */ }
  }
  state = { site, projects, music, posts, assets: [], pendingAssets: [], deletedPaths: [] };
  baseData = clone(state);
  const draft = await readDraft();
  if (draft?.site) { state = draft; state.pendingAssets = (state.pendingAssets || []).map(asset => ({ ...asset, objectUrl: asset.blob ? URL.createObjectURL(asset.blob) : asset.objectUrl })); saveState.textContent = '已恢复本机草稿'; saveState.classList.add('dirty'); }
  else saveState.textContent = '已载入公开内容';
}

function field(label, name, value, options = {}) {
  const type = options.type || 'text';
  const control = type === 'textarea' ? `<textarea data-field="${name}" ${options.rows ? `rows="${options.rows}"` : ''}>${escapeHtml(value)}</textarea>` : `<input data-field="${name}" type="${type}" value="${escapeHtml(value)}" ${options.placeholder ? `placeholder="${escapeHtml(options.placeholder)}"` : ''}>`;
  return `<label class="field${options.wide ? ' wide' : ''}"><span>${escapeHtml(label)}</span>${control}</label>`;
}

function section(title, description, body, action = '') { return `<section class="editor-section"><div class="section-title"><div><h2>${title}</h2><p>${description}</p></div>${action}</div>${body}</section>`; }

function renderSite() {
  const site = state.site; site.hero ||= {}; site.about ||= {}; site.defaults ||= {};
  panel.innerHTML = section('站点资料', '编辑 Hero、自我介绍和所有访客看到的默认视觉路径。', `<div class="form-grid">${field('Hero 小标题','hero.eyebrow',site.hero.eyebrow || '')}${field('主按钮文字','hero.primaryLabel',site.hero.primaryLabel || '')}${field('Hero 两行文字（每行一项）','hero.lines',(site.hero.lines || []).join('\n'),{type:'textarea',wide:true})}${field('关于页手写句','about.quote',site.about.quote || '',{type:'textarea',wide:true})}${field('个人介绍','about.text',site.about.text || '',{type:'textarea',wide:true})}${field('公共默认封面','defaults.cover',site.defaults.cover || '')}${field('公共默认背景','defaults.background',site.defaults.background || '')}</div>`);
  bindSiteFields();
}

function getPath(object, path) { return path.split('.').reduce((value, key) => value?.[key], object); }
function setPath(object, path, value) { const keys = path.split('.'); const last = keys.pop(); const target = keys.reduce((item, key) => item[key] ||= {}, object); target[last] = value; }

function bindSiteFields() {
  panel.querySelectorAll('[data-field]').forEach(input => {
    input.addEventListener('focus', () => { if (!input.dataset.checkpoint) { checkpoint(); input.dataset.checkpoint = '1'; } });
    input.addEventListener('blur', () => { delete input.dataset.checkpoint; });
    input.addEventListener('input', () => { const name = input.dataset.field; const value = name === 'hero.lines' ? listFrom(input.value) : input.value; setPath(state.site, name, value); markDirty(); });
  });
}

function renderCollection(type, title, description, schema) {
  const items = type === 'interests' || type === 'links' ? (state.site[type] ||= []) : state[type];
  const cards = items.map((item, index) => `<article class="collection-card"><div class="collection-head"><strong>${escapeHtml(item.title || item.label || `条目 ${index + 1}`)}</strong><div class="card-actions"><button type="button" data-move="up" data-index="${index}" aria-label="上移">↑</button><button type="button" data-move="down" data-index="${index}" aria-label="下移">↓</button><button type="button" data-delete data-index="${index}" aria-label="删除">×</button></div></div><div class="form-grid">${schema.map(entry => field(entry.label, `${index}.${entry.key}`, entry.format ? entry.format(item[entry.key]) : item[entry.key] ?? '', { type: entry.type, wide: entry.wide, placeholder: entry.placeholder })).join('')}<label class="visibility-row wide"><input data-visible data-index="${index}" type="checkbox" ${item.visible !== false ? 'checked' : ''}> 对访客显示</label></div></article>`).join('');
  panel.innerHTML = section(title, description, `<div class="collection-list">${cards || '<p class="empty-state">暂无条目</p>'}</div>`, '<button id="add-item" class="add-button" type="button">＋ 新增</button>');
  panel.querySelector('#add-item').addEventListener('click', () => mutate(() => items.push(defaultItem(type)), true));
  panel.querySelectorAll('[data-field]').forEach(input => {
    input.addEventListener('focus', () => { if (!input.dataset.checkpoint) { checkpoint(); input.dataset.checkpoint = '1'; } });
    input.addEventListener('blur', () => { delete input.dataset.checkpoint; });
    input.addEventListener('input', () => { const [index, key] = input.dataset.field.split('.', 2); const spec = schema.find(entry => entry.key === key); items[index][key] = spec?.parse ? spec.parse(input.value) : input.value; markDirty(); });
  });
  panel.querySelectorAll('[data-visible]').forEach(input => input.addEventListener('change', () => mutate(() => { items[Number(input.dataset.index)].visible = input.checked; })));
  panel.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => mutate(() => items.splice(Number(button.dataset.index), 1), true)));
  panel.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => mutate(() => { const index = Number(button.dataset.index); const target = button.dataset.move === 'up' ? index - 1 : index + 1; if (target < 0 || target >= items.length) return; [items[index], items[target]] = [items[target], items[index]]; }, true)));
}

function defaultItem(type) {
  if (type === 'interests') return { id: `interest-${Date.now()}`, title: '新的兴趣切片', items: [], visible: true };
  if (type === 'projects') return { id: `project-${Date.now()}`, title: '新项目', description: '', url: 'https://github.com/Kotori-cjk/', tags: [], cover: '', order: state.projects.length + 1, visible: true };
  if (type === 'links') return { id: `link-${Date.now()}`, label: '新链接', note: '', href: 'https://', icon: '↗', visible: true };
  return { id: '', title: '新曲目', artist: '', cover: '', order: state.music.length + 1, visible: true };
}

function schemas(type) {
  if (type === 'interests') return [{key:'title',label:'标题'},{key:'items',label:'内容（每行一项）',type:'textarea',wide:true,format:value=>(value||[]).join('\n'),parse:listFrom}];
  if (type === 'projects') return [{key:'title',label:'项目名'},{key:'url',label:'GitHub 链接'},{key:'description',label:'简介',type:'textarea',wide:true},{key:'tags',label:'标签（逗号分隔）',format:value=>(value||[]).join(', '),parse:tagsFrom},{key:'cover',label:'封面素材路径'}];
  if (type === 'links') return [{key:'label',label:'名称'},{key:'href',label:'链接'},{key:'note',label:'说明',wide:true},{key:'icon',label:'图标类型（github / bangumi / x / email）'}];
  return [{key:'id',label:'网易云链接或 ID'},{key:'title',label:'曲名'},{key:'artist',label:'歌手'},{key:'cover',label:'封面素材路径'}];
}

function renderPosts() {
  if (!state.posts.length) {
    panel.innerHTML = section('博客随笔','Markdown 写作、实时预览和草稿发布。连接 GitHub 后会载入仓库内未公开草稿。','<p class="empty-state">还没有文章。点击右上角开始第一篇随笔。</p>','<button id="add-first-post" class="add-button" type="button">＋ 新建文章</button>');
    panel.querySelector('#add-first-post').addEventListener('click',()=>mutate(()=>{const slug=`new-post-${Date.now()}`;state.posts.push({path:`content/posts/${slug}.md`,slug,title:'新随笔',date:new Date().toISOString().slice(0,10),summary:'',cover:'',tags:[],draft:true,body:''});panel.dataset.postIndex=0;},true));
    return;
  }
  const selected = Math.min(Number(panel.dataset.postIndex || 0), state.posts.length - 1); panel.dataset.postIndex = selected;
  const post = state.posts[selected];
  const list = state.posts.map((item,index)=>`<button class="${index===selected?'active':''}" type="button" data-post-index="${index}"><strong>${escapeHtml(item.title)}</strong><small>${item.draft?'草稿':'公开'} · ${escapeHtml(item.date)}</small></button>`).join('');
  const editor = `<div class="form-grid">${field('标题','post.title',post.title)}${field('发布日期','post.date',post.date,{type:'date'})}${field('摘要','post.summary',post.summary,{type:'textarea',wide:true})}${field('封面素材路径','post.cover',post.cover)}${field('标签（逗号分隔）','post.tags',(post.tags||[]).join(', '))}<label class="visibility-row wide"><input id="post-draft" type="checkbox" ${post.draft?'checked':''}> 保存为草稿，不公开</label>${field('Markdown 正文','post.body',post.body,{type:'textarea',wide:true,rows:16})}<div class="wide"><p>实时预览</p><div id="markdown-preview" class="markdown-preview">${markdown.render(post.body||'')}</div></div></div><div class="publish-actions"><button id="delete-post" type="button">删除文章</button></div>`;
  panel.innerHTML = section('博客随笔','Markdown 写作、实时预览和草稿发布。连接 GitHub 后会载入仓库内未公开草稿。',`<div class="post-layout"><aside class="post-list">${list}<button id="add-post" type="button">＋ 新建文章</button></aside><article class="post-editor">${editor}</article></div>`);
  panel.querySelectorAll('[data-post-index]').forEach(button=>button.addEventListener('click',()=>{panel.dataset.postIndex=button.dataset.postIndex;renderPosts();}));
  panel.querySelector('#add-post').addEventListener('click',()=>mutate(()=>{const slug=`new-post-${Date.now()}`;state.posts.unshift({path:`content/posts/${slug}.md`,slug,title:'新随笔',date:new Date().toISOString().slice(0,10),summary:'',cover:'',tags:[],draft:true,body:''});panel.dataset.postIndex=0;},true));
  panel.querySelector('#delete-post').addEventListener('click',()=>mutate(()=>{const [removed]=state.posts.splice(selected,1);if(baseData.posts.some(item=>item.path===removed.path))state.deletedPaths.push(removed.path);panel.dataset.postIndex=0;},true));
  panel.querySelector('#post-draft').addEventListener('change',event=>mutate(()=>{post.draft=event.target.checked;}));
  panel.querySelectorAll('[data-field]').forEach(input=>{input.addEventListener('focus',()=>{if(!input.dataset.checkpoint){checkpoint();input.dataset.checkpoint='1';}});input.addEventListener('blur',()=>delete input.dataset.checkpoint);input.addEventListener('input',()=>{const key=input.dataset.field.split('.')[1];post[key]=key==='tags'?tagsFrom(input.value):input.value;if(key==='title'&&!baseData.posts.some(item=>item.path===post.path)){post.slug=slugify(input.value);post.path=`content/posts/${post.slug}.md`;}if(key==='body')panel.querySelector('#markdown-preview').innerHTML=markdown.render(post.body);markDirty();});});
}

function assetUrl(asset) { return asset.objectUrl || `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${asset.path}`; }

function renderAssets() {
  const all = [...state.assets, ...state.pendingAssets];
  const cards = all.map(asset=>`<article class="asset-card"><img src="${escapeHtml(assetUrl(asset))}" alt="${escapeHtml(asset.path)}"><div class="asset-copy"><strong title="${escapeHtml(asset.path)}">${escapeHtml(asset.path)}</strong><button type="button" data-copy-path="${escapeHtml(asset.path)}">复制路径</button><button type="button" data-default-cover="${escapeHtml(asset.path)}">设为封面</button><button type="button" data-default-bg="${escapeHtml(asset.path)}">设为背景</button><button type="button" data-delete-asset="${escapeHtml(asset.path)}">删除</button></div></article>`).join('');
  panel.innerHTML=section('素材库','上传图片会压缩为 WebP 并放入 assets/uploads/。删除前会检查当前内容引用。',`<div class="asset-grid">${cards||'<p class="empty-state">尚未上传公共素材。</p>'}</div>`,'<button id="upload-assets" class="add-button" type="button">＋ 上传图片</button>');
  panel.querySelector('#upload-assets').addEventListener('click',()=>document.getElementById('asset-upload').click());
  panel.querySelectorAll('[data-copy-path]').forEach(button=>button.addEventListener('click',async()=>{await navigator.clipboard.writeText(button.dataset.copyPath);button.textContent='已复制';}));
  panel.querySelectorAll('[data-default-cover]').forEach(button=>button.addEventListener('click',()=>mutate(()=>{state.site.defaults||={};state.site.defaults.cover=button.dataset.defaultCover;},true)));
  panel.querySelectorAll('[data-default-bg]').forEach(button=>button.addEventListener('click',()=>mutate(()=>{state.site.defaults||={};state.site.defaults.background=button.dataset.defaultBg;},true)));
  panel.querySelectorAll('[data-delete-asset]').forEach(button=>button.addEventListener('click',()=>deleteAsset(button.dataset.deleteAsset)));
}

function isAssetReferenced(path) { const text=JSON.stringify({site:state.site,projects:state.projects,music:state.music,posts:state.posts}); return text.includes(path); }
function deleteAsset(path) { if(isAssetReferenced(path)){window.alert('该素材仍被内容引用，请先替换对应封面或背景。');return;}mutate(()=>{const pending=state.pendingAssets.find(item=>item.path===path);if(pending){URL.revokeObjectURL(pending.objectUrl);state.pendingAssets=state.pendingAssets.filter(item=>item.path!==path);}else{state.assets=state.assets.filter(item=>item.path!==path);state.deletedPaths.push(path);}},true); }

async function compressImage(file) {
  const bitmap=await createImageBitmap(file);const scale=Math.min(1,1800/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();return await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.84));
}

async function uploadAssets(files) {
  checkpoint();
  for(const file of files){try{const blob=await compressImage(file);if(!blob)throw new Error('压缩失败');const name=`${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/,''))}-${crypto.randomUUID().slice(0,8)}.webp`;const path=`assets/uploads/${name}`;state.pendingAssets.push({path,blob,objectUrl:URL.createObjectURL(blob)});}catch(error){window.alert(`${file.name}：${error.message}`);}}
  markDirty();renderAssets();
}

function render() {
  document.querySelectorAll('#studio-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.tab===activeTab));
  if(activeTab==='site')renderSite();
  else if(activeTab==='interests')renderCollection('interests','兴趣切片','管理兴趣卡片和每张卡片的条目。',schemas('interests'));
  else if(activeTab==='posts')renderPosts();
  else if(activeTab==='projects')renderCollection('projects','项目一览','手选公开项目，排序即为访客看到的顺序。',schemas('projects'));
  else if(activeTab==='links')renderCollection('links','外部链接','管理所有访客可见的个人链接。',schemas('links'));
  else if(activeTab==='music')renderCollection('music','音乐清单','网易云曲目会出现在 Homepage 右下角播放器。',schemas('music'));
  else renderAssets();
}

async function github(path, options={}) {
  const response=await fetch(path.startsWith('http')?path:`${API}${path}`,{...options,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${token}`,...options.headers}});
  if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);return response.status===204?null:await response.json();
}

async function rawFile(path) {
  const response=await fetch(`${API}/contents/${path}?ref=${BRANCH}`,{headers:{Accept:'application/vnd.github.raw+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28'}});
  if(!response.ok)throw new Error(`${path}: ${response.status}`);return await response.text();
}

async function connect() {
  token=document.getElementById('token-input').value.trim();if(!token){window.alert('请粘贴仅授权 Homepage 仓库的 fine-grained token。');return;}
  const button=document.getElementById('connect-btn');button.disabled=true;button.textContent='连接中…';
  try{
    const ref=await github(`/git/ref/heads/${BRANCH}`);baseSha=ref.object.sha;const commit=await github(`/git/commits/${baseSha}`);const tree=await github(`/git/trees/${commit.tree.sha}?recursive=1`);
    const paths=tree.tree.filter(item=>item.type==='blob').map(item=>item.path);const [siteRaw,projectsRaw,musicRaw]=await Promise.all(['content/site.json','content/projects.json','content/music.json'].map(rawFile));
    const postPaths=paths.filter(path=>path.startsWith('content/posts/')&&path.endsWith('.md'));const posts=[];for(const path of postPaths)posts.push(parseFrontmatter(await rawFile(path),path));
    const assets=paths.filter(path=>path.startsWith('assets/uploads/')&&/\.(png|jpe?g|webp|gif)$/i.test(path)).map(path=>({path}));
    const remoteState={site:JSON.parse(siteRaw),projects:JSON.parse(projectsRaw),music:JSON.parse(musicRaw),posts,assets,pendingAssets:[],deletedPaths:[]};baseData=clone(remoteState);const draft=await readDraft();
    if(draft?.site){const draftPaths=new Set((draft.posts||[]).map(post=>post.path));state={...draft,posts:[...(draft.posts||[]),...remoteState.posts.filter(post=>!draftPaths.has(post.path))],assets:remoteState.assets,pendingAssets:(draft.pendingAssets||[]).map(asset=>({...asset,objectUrl:asset.blob?URL.createObjectURL(asset.blob):asset.objectUrl}))};}else state=remoteState;
    connected=true;history=[];
    document.getElementById('connection-title').textContent=`已连接 ${OWNER}`;document.getElementById('connection-note').textContent=`基础提交 ${baseSha.slice(0,7)} · 可安全发布`;document.getElementById('token-input').value='';saveState.textContent=draft?.site?'已连接并保留本机草稿':'已载入远程 main';saveState.classList.toggle('dirty',Boolean(draft?.site));render();
  }catch(error){token='';window.alert(`连接失败：${error.message}\n请确认令牌只授权该仓库并具有 Contents 读写权限。`);}finally{button.disabled=false;button.textContent='连接 Homepage 仓库';}
}

function prepareChanges() {
  const postPaths=state.posts.map(post=>post.path);if(new Set(postPaths).size!==postPaths.length)throw new Error('存在重复的文章路径，请修改文章标题后再发布。');if(state.posts.some(post=>!post.title.trim()))throw new Error('文章标题不能为空。');
  const changes=[];const addText=(path,content,baseContent)=>{if(content!==baseContent)changes.push({path,content,type:'text'});};
  addText('content/site.json',json(state.site),json(baseData.site));addText('content/projects.json',json(state.projects),json(baseData.projects));addText('content/music.json',json(state.music),json(baseData.music));
  const basePosts=new Map(baseData.posts.map(post=>[post.path,postRaw(post)]));for(const post of state.posts){const raw=postRaw(post);if(raw!==basePosts.get(post.path))changes.push({path:post.path,content:raw,type:'text'});basePosts.delete(post.path);}for(const path of basePosts.keys())changes.push({path,delete:true});
  for(const asset of state.pendingAssets)changes.push({path:asset.path,blob:asset.blob,type:'binary'});for(const path of new Set(state.deletedPaths))if(!changes.some(item=>item.path===path))changes.push({path,delete:true});
  for(const change of changes){if(!isAllowedPath(change.path))throw new Error(`编辑器拒绝修改范围外文件：${change.path}`);}return changes;
}

function isAllowedPath(path) {
  return ['content/site.json','content/projects.json','content/music.json'].includes(path) || /^content\/posts\/[a-z0-9\u4e00-\u9fff-]+\.md$/.test(path) || /^assets\/uploads\/[a-z0-9-]+\.(webp|png|jpg|jpeg|gif)$/i.test(path);
}

function bytesToBase64(bytes){let result='';const chunk=0x8000;for(let i=0;i<bytes.length;i+=chunk)result+=String.fromCharCode(...bytes.subarray(i,i+chunk));return btoa(result);}
async function changeBase64(change){if(change.type==='binary')return bytesToBase64(new Uint8Array(await change.blob.arrayBuffer()));return bytesToBase64(new TextEncoder().encode(change.content));}

async function publish(changes,message) {
  const status=document.getElementById('publish-status');const button=document.getElementById('confirm-publish');button.disabled=true;
  try{
    status.textContent='检查远程分支…';const current=await github(`/git/ref/heads/${BRANCH}`);if(current.object.sha!==baseSha)throw new Error('远程 main 已发生变化，请关闭发布窗口并重新连接后再编辑。');
    const baseCommit=await github(`/git/commits/${baseSha}`);const entries=[];let completed=0;
    for(const change of changes){status.textContent=`准备文件 ${++completed} / ${changes.length}`;if(change.delete){entries.push({path:change.path,mode:'100644',type:'blob',sha:null});continue;}const blob=await github('/git/blobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:await changeBase64(change),encoding:'base64'})});entries.push({path:change.path,mode:'100644',type:'blob',sha:blob.sha});}
    status.textContent='创建原子提交…';const tree=await github('/git/trees',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({base_tree:baseCommit.tree.sha,tree:entries})});const commit=await github('/git/commits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,tree:tree.sha,parents:[baseSha]})});await github(`/git/refs/heads/${BRANCH}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({sha:commit.sha,force:false})});
    baseSha=commit.sha;baseData=clone(state);state.pendingAssets=[];state.deletedPaths=[];await clearDraft();history=[];saveState.textContent=`已发布 ${commit.sha.slice(0,7)}`;saveState.classList.remove('dirty');status.textContent='发布成功，GitHub Actions 正在构建 Homepage。';setTimeout(()=>document.getElementById('publish-dialog').close(),1300);
  }catch(error){status.textContent=`发布失败：${error.message}`;}finally{button.disabled=false;}
}

function openPublish() {
  if(!connected||!token){window.alert('请先粘贴 token 并连接 Homepage 仓库。');return;}let changes;try{changes=prepareChanges();}catch(error){window.alert(error.message);return;}if(!changes.length){window.alert('没有需要发布的修改。');return;}document.getElementById('change-list').innerHTML=changes.map(change=>`<div class="change-item"><code>${escapeHtml(change.path)}</code><span>${change.delete?'删除':baseData.posts.some(item=>item.path===change.path)||['content/site.json','content/projects.json','content/music.json'].includes(change.path)?'修改':'新增'}</span></div>`).join('');document.getElementById('publish-status').textContent='';document.getElementById('publish-dialog').showModal();
}

function previewHtml() {
  const interests=(state.site.interests||[]).filter(x=>x.visible!==false).map(x=>`<article><h3>${escapeHtml(x.title)}</h3><p>${(x.items||[]).map(escapeHtml).join(' · ')}</p></article>`).join('');const projects=state.projects.filter(x=>x.visible!==false).map(x=>`<article><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.description)}</p></article>`).join('');const posts=state.posts.filter(x=>!x.draft).map(x=>`<article><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.summary)}</p></article>`).join('');const links=(state.site.links||[]).filter(x=>x.visible!==false).map(x=>`<a href="#">${escapeHtml(x.label)}</a>`).join('');return `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:35px;font-family:system-ui;background:#eee8dc;color:#403b4e}header{min-height:45vh;display:grid;place-content:center;text-align:center}h1{color:#527d70;font-family:serif}section{max-width:1000px;margin:auto;padding:45px 0}h2{color:#527d70}main>section>div{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:15px}article{padding:20px;border-radius:20px;background:#fffdf8;box-shadow:0 15px 35px #44342c16}a{display:inline-block;margin:8px;padding:12px;border-radius:12px;background:#fffdf8;color:#a85f35}</style><header><p>${escapeHtml(state.site.hero?.eyebrow)}</p><h1>${(state.site.hero?.lines||[]).map(escapeHtml).join('<br>')}</h1></header><main><section><h2>01 关于 Kotori</h2><article><h3>${escapeHtml(state.site.about?.quote)}</h3><p>${escapeHtml(state.site.about?.text)}</p></article></section><section><h2>02 兴趣切片</h2><div>${interests}</div></section><section><h2>03 博客随笔</h2><div>${posts||'<p>暂无公开文章</p>'}</div></section><section><h2>04 项目一览</h2><div>${projects}</div></section><section><h2>05 外部链接</h2><div>${links}</div></section></main>`; }

function openPreview(){if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(new Blob([previewHtml()],{type:'text/html'}));document.getElementById('site-preview').src=previewUrl;document.getElementById('preview-dialog').showModal();}

document.getElementById('studio-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-tab]');if(!button)return;activeTab=button.dataset.tab;render();});
document.getElementById('connect-btn').addEventListener('click',connect);
document.getElementById('publish-btn').addEventListener('click',openPublish);
document.getElementById('confirm-publish').addEventListener('click',event=>{event.preventDefault();publish(prepareChanges(),document.getElementById('commit-message').value.trim()||'Update public homepage content');});
document.getElementById('preview-btn').addEventListener('click',openPreview);
document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('[data-preview-size]').forEach(button=>button.addEventListener('click',()=>document.getElementById('preview-dialog').classList.toggle('mobile',button.dataset.previewSize==='mobile')));
document.getElementById('undo-btn').addEventListener('click',()=>{const previous=history.pop();if(!previous)return;state=previous;markDirty();render();});
document.getElementById('discard-btn').addEventListener('click',async()=>{if(!window.confirm('放弃当前本机草稿并恢复最近载入的内容？'))return;state=clone(baseData);history=[];await clearDraft();saveState.textContent='草稿已放弃';saveState.classList.remove('dirty');render();});
document.getElementById('asset-upload').addEventListener('change',event=>{uploadAssets(event.target.files||[]);event.target.value='';});
window.addEventListener('beforeunload',event=>{if(saveState.classList.contains('dirty')){event.preventDefault();event.returnValue='';}});

loadPublished().then(render).catch(error=>{panel.innerHTML=`<section class="editor-section"><h2>载入失败</h2><p>${escapeHtml(error.message)}</p></section>`;});
