export function initRevealMotion() {
  const items = document.querySelectorAll('.reveal-section');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.14, rootMargin: '-5% 0px -8%' });
  items.forEach(item => observer.observe(item));
}

export function initBookIntro({ onOpen }) {
  const button = document.getElementById('open-book-btn');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false;
  let pageFlip;

  if (!reduced && window.St?.PageFlip) {
    pageFlip = new window.St.PageFlip(document.getElementById('intro-book'), {
      width: 430,
      height: 610,
      size: 'stretch',
      minWidth: 270,
      maxWidth: 430,
      minHeight: 380,
      maxHeight: 610,
      showCover: true,
      usePortrait: true,
      mobileScrollSupport: false,
      flippingTime: 1050,
      maxShadowOpacity: 0.42
    });
    pageFlip.loadFromHTML(document.querySelectorAll('.book-page'));
  }

  const open = () => {
    if (opened) return;
    opened = true;
    document.body.classList.add('book-opening');
    if (pageFlip) pageFlip.flipNext('top');
    window.setTimeout(() => {
      document.body.classList.remove('cover-closed', 'book-opening');
      document.body.classList.add('book-open');
      document.getElementById('homepage').setAttribute('aria-hidden', 'false');
      onOpen?.();
    }, reduced ? 80 : 1180);
  };

  button.addEventListener('click', open);
  document.addEventListener('keydown', event => {
    if (!opened && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); open(); }
  });
  requestAnimationFrame(() => document.body.classList.add('cover-ready'));
  return open;
}
