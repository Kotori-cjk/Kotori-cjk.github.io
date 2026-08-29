const PLAYER_STATE_KEY = 'kotori-public-player-v1';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

export function parseMusicId(input) {
  const value = String(input || '').trim();
  if (/^\d+$/.test(value)) return value;
  return value.match(/[?&]id=(\d+)/)?.[1] || value.match(/song\/(\d+)/)?.[1] || '';
}

function readState() {
  try { return { index: 0, expanded: false, ...JSON.parse(localStorage.getItem(PLAYER_STATE_KEY) || '{}') }; }
  catch (_) { return { index: 0, expanded: false }; }
}

function writeState(state) { localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(state)); }

export function initPlayer(tracks) {
  const player = document.getElementById('music-player');
  const summary = document.getElementById('player-summary');
  const panel = document.getElementById('player-panel');
  const cover = document.getElementById('player-cover');
  const title = document.getElementById('player-title');
  const artist = document.getElementById('player-artist');
  const count = document.getElementById('player-count');
  const embed = document.getElementById('player-embed');
  const list = document.getElementById('player-list');
  const visibleTracks = (Array.isArray(tracks) ? tracks : []).filter(track => track?.visible !== false && parseMusicId(track?.id)).sort((a, b) => (a.order || 0) - (b.order || 0));
  const state = readState();
  state.index = Math.min(Math.max(Number(state.index) || 0, 0), Math.max(visibleTracks.length - 1, 0));

  function render() {
    const track = visibleTracks[state.index];
    player.classList.toggle('is-empty', !track);
    player.classList.toggle('is-expanded', Boolean(state.expanded));
    summary.setAttribute('aria-expanded', String(Boolean(state.expanded)));
    panel.hidden = !state.expanded;
    title.textContent = track?.title || (track ? `网易云歌曲 ${track.id}` : '暂无公开曲目');
    artist.textContent = track?.artist || (track ? 'NetEase Cloud Music' : '在内容编辑器中添加');
    cover.style.backgroundImage = track?.cover ? `url("${track.cover}")` : '';
    count.textContent = track ? `${state.index + 1} / ${visibleTracks.length}` : '0 / 0';
    embed.innerHTML = track && state.expanded ? `<iframe title="${escapeHtml(track.title || `网易云歌曲 ${track.id}`)}" loading="lazy" src="https://music.163.com/outchain/player?type=2&id=${encodeURIComponent(parseMusicId(track.id))}&auto=0&height=66"></iframe>` : '';
    list.innerHTML = visibleTracks.map((item, index) => `<button class="player-list-item ripple-target${index === state.index ? ' active' : ''}" type="button" data-track-index="${index}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(item.title || `网易云歌曲 ${item.id}`)}</strong><small>${escapeHtml(item.artist || '')}</small></button>`).join('');
    writeState(state);
  }

  summary.addEventListener('click', () => { state.expanded = !state.expanded; render(); });
  document.getElementById('player-prev').addEventListener('click', () => { if (!visibleTracks.length) return; state.index = (state.index - 1 + visibleTracks.length) % visibleTracks.length; render(); });
  document.getElementById('player-next').addEventListener('click', () => { if (!visibleTracks.length) return; state.index = (state.index + 1) % visibleTracks.length; render(); });
  list.addEventListener('click', event => { const button = event.target.closest('[data-track-index]'); if (!button) return; state.index = Number(button.dataset.trackIndex); render(); });
  render();
}
