function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

export function parseMusicId(input) {
  const value = String(input || '').trim();
  if (/^\d+$/.test(value)) return value;
  return value.match(/[?&]id=(\d+)/)?.[1] || value.match(/song\/(\d+)/)?.[1] || '';
}

export function renderPlayer(container, ids) {
  if (!ids.length) {
    container.innerHTML = '<div class="empty-music">还没有唱片。可以在设置中粘贴网易云歌曲链接或 ID。</div>';
    return;
  }
  container.innerHTML = ids.map((id, index) => `
    <article class="record-card">
      <div class="record-head">
        <div class="record-disc" aria-hidden="true"></div>
        <div class="record-copy"><small>TRACK ${String(index + 1).padStart(2, '0')}</small><h3>网易云歌曲 · ${esc(id)}</h3><button class="record-toggle" type="button" aria-expanded="false">展开播放器</button></div>
      </div>
      <div class="record-embed"><iframe title="网易云歌曲 ${esc(id)}" loading="lazy" src="https://music.163.com/outchain/player?type=2&id=${encodeURIComponent(id)}&auto=0&height=66"></iframe></div>
    </article>`).join('');
  container.querySelectorAll('.record-toggle').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.record-card');
    const expanded = card.classList.toggle('expanded');
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? '收起播放器' : '展开播放器';
  }));
}
