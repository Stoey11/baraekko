// ===== SCROLL-TRIGGERED ANIMATIONS =====
// Shared across all pages

(function() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Set initial hidden state via JS (not CSS)
  gsap.set('[data-animate="fade-up"]', { y: 40, opacity: 0 });
  gsap.set('[data-animate="fade-in"]', { opacity: 0 });
  gsap.set('[data-animate="stagger-children"]', { opacity: 1 });
  document.querySelectorAll('[data-animate="stagger-children"]').forEach(parent => {
    gsap.set(parent.children, { y: 30, opacity: 0 });
  });

  // Fade up animation
  gsap.utils.toArray('[data-animate="fade-up"]').forEach(el => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Stagger children animation
  gsap.utils.toArray('[data-animate="stagger-children"]').forEach(parent => {
    gsap.to(parent.children, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Fade in (no movement)
  gsap.utils.toArray('[data-animate="fade-in"]').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      duration: 0.8,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });
})();
