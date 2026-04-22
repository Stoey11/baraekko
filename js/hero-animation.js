// ===== HERO VIDEO ANIMATION =====
// Fade in text after video starts playing

(function() {
  if (typeof gsap === 'undefined') return;

  const video = document.querySelector('.hero__video');
  const heroTitle = document.querySelector('.hero__title');
  const heroTagline = document.querySelector('.hero__tagline');
  const scrollIndicator = document.getElementById('scrollIndicator');

  if (!video) return;

  // Set initial states
  gsap.set([heroTitle, heroTagline, scrollIndicator], { opacity: 0 });
  gsap.set(heroTitle, { y: 20 });

  // When video starts playing, fade in text
  function revealText() {
    const tl = gsap.timeline({ delay: 1.5 });

    tl.to(heroTitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    tl.to(heroTagline, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3');

    tl.to(scrollIndicator, {
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out'
    }, '-=0.2');
  }

  // Trigger on video play or after a short delay as fallback
  video.addEventListener('playing', revealText, { once: true });

  // Fallback if video doesn't fire playing event
  setTimeout(() => {
    if (heroTitle && getComputedStyle(heroTitle).opacity === '0') {
      revealText();
    }
  }, 2000);
})();
