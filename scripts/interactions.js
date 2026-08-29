export function initRippleEffects(root = document) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.addEventListener('pointerdown', event => {
    if (reduced || event.button !== 0) return;
    const target = event.target.closest('.ripple-target, a, button');
    if (!target || target.matches(':disabled')) return;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    target.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
}
