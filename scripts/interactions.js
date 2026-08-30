export function initRippleEffects(root = document) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.addEventListener('pointerdown', event => {
    if (reduced || event.button !== 0) return;
    const target = event.target.closest('.ripple-target, a, button');
    if (target?.matches(':disabled')) return;
    const pageRipple = !target && document.body.classList.contains('book-open') && event.target.closest('#homepage');
    if (!target && !pageRipple) return;
    const rect = target?.getBoundingClientRect();
    const size = target ? Math.max(rect.width, rect.height) * 1.8 : 130;
    const ripple = document.createElement('span');
    ripple.className = `click-ripple${pageRipple ? ' page-click-ripple' : ''}`;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - (rect?.left || 0) - size / 2}px`;
    ripple.style.top = `${event.clientY - (rect?.top || 0) - size / 2}px`;
    (target || document.body).append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
}
