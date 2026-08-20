// ===== TÆLLER TALLENE OP, NÅR DE RULLER I BILLEDET =====
(function () {
  const tal = document.querySelectorAll('[data-count]');
  if (!tal.length) return;

  const stilleOgRoligt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function taelOp(el) {
    const slut = parseInt(el.dataset.count, 10);
    if (isNaN(slut)) return;

    if (stilleOgRoligt) {
      el.textContent = slut;
      return;
    }

    const varighed = 1100;
    const start = performance.now();

    function trin(nu) {
      const fremgang = Math.min((nu - start) / varighed, 1);
      const lempet = 1 - Math.pow(1 - fremgang, 3);
      el.textContent = Math.round(slut * lempet);
      if (fremgang < 1) requestAnimationFrame(trin);
    }

    requestAnimationFrame(trin);
  }

  // Tallene står i HTML'en fra start. Vi nulstiller dem kun i det øjeblik,
  // vi rent faktisk kan tælle dem op, så de aldrig bliver hængende på nul.
  if (!('IntersectionObserver' in window) || stilleOgRoligt) return;

  const observer = new IntersectionObserver(function (poster) {
    poster.forEach(function (post) {
      if (post.isIntersecting) {
        observer.unobserve(post.target);
        taelOp(post.target);
      }
    });
  }, { threshold: 0.4 });

  tal.forEach(function (el) {
    observer.observe(el);
  });
})();
