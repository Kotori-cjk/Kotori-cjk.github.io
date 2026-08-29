import { initRippleEffects } from './interactions.js';

const progress = document.getElementById('reading-progress');
const updateProgress = () => {
  const maximum = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maximum > 0 ? Math.min(window.scrollY / maximum, 1) : 1})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
initRippleEffects();
updateProgress();
