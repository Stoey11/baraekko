// ===== LET PARALLAX PÅ BILLEDERNE I RENOVERINGSREJSEN =====
(function () {
  const rammer = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!rammer.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const synlige = new Set();
  let venter = false;

  function flyt() {
    venter = false;
    const midte = window.innerHeight / 2;

    synlige.forEach(function (ramme) {
      const billede = ramme.firstElementChild;
      if (!billede) return;

      const kasse = ramme.getBoundingClientRect();
      const afstand = (kasse.top + kasse.height / 2 - midte) / midte;
      const skub = Math.max(-1, Math.min(1, afstand)) * 24;

      billede.style.transform = 'translate3d(0, ' + skub.toFixed(1) + 'px, 0) scale(1.12)';
    });
  }

  function planlaeg() {
    if (venter) return;
    venter = true;
    requestAnimationFrame(flyt);
  }

  const observer = new IntersectionObserver(function (poster) {
    poster.forEach(function (post) {
      if (post.isIntersecting) synlige.add(post.target);
      else synlige.delete(post.target);
    });
    planlaeg();
  }, { rootMargin: '10% 0px' });

  rammer.forEach(function (ramme) {
    observer.observe(ramme);
  });

  window.addEventListener('scroll', planlaeg, { passive: true });
  window.addEventListener('resize', planlaeg);
  planlaeg();
})();
