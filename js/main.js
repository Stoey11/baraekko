// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Scroll-based nav background
function updateNav() {
  if (window.scrollY > 80) {
    navbar.classList.add('nav--scrolled');
  } else {
    navbar.classList.remove('nav--scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Hamburger toggle
if (hamburger && mobileMenu) {
  const closeMenu = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on tap outside menu links (overlay area)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ===== PAGE TRANSITIONS =====
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.endsWith('.html') && !href.startsWith('http')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  }
});

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
