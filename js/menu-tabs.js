// ===== MENU CATEGORY TABS =====
(function() {
  const tabs = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');

  if (!tabs.length) return;

  // Tab click → scroll to section
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      const target = document.getElementById(targetId);
      if (!target) return;

      const offset = document.querySelector('.nav').offsetHeight +
                     document.querySelector('.menu-tabs').offsetHeight + 8;

      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    });
  });

  // Scroll spy — highlight active tab
  function updateActiveTab() {
    const offset = document.querySelector('.nav').offsetHeight +
                   document.querySelector('.menu-tabs').offsetHeight + 50;

    let activeId = null;

    sections.forEach(section => {
      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < bottom) {
        activeId = section.id;
      }
    });

    if (activeId) {
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.target === activeId);
      });
    }
  }

  window.addEventListener('scroll', updateActiveTab, { passive: true });
  updateActiveTab();
})();
