// Движение декоративной композиции; на сенсорных экранах отключено.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const art = document.querySelector('.hero-image');
  if (art && !reducedMotion.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    art.addEventListener('pointermove', event => {
      const rect = art.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      art.style.setProperty('--hero-x', x.toFixed(3));
      art.style.setProperty('--hero-y', y.toFixed(3));
    });
    art.addEventListener('pointerleave', () => {
      art.style.setProperty('--hero-x', '0');
      art.style.setProperty('--hero-y', '0');
    });
  }

  // Контент доступен без JavaScript. Анимация включается только для блоков ниже экрана.
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  const blocks = document.querySelectorAll('main > section, .benefits > div, .bento > article, .stages > a, .result-grid > div, .format-grid > article, .equipment-grid > article, .future-grid > article, #modules > details');
  blocks.forEach(block => {
    const rect = block.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    block.classList.add('reveal-pending');
    observer.observe(block);
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    blocks.forEach(block => block.classList.add('is-visible'));
  });
})();

