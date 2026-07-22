const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

function setMenu(open) {
  if (!nav || !toggle) return;
  nav.dataset.open = String(open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  document.body.classList.toggle('nav-open', open);
}

if (nav && toggle) {
  toggle.addEventListener('click', () => {
    setMenu(nav.dataset.open !== 'true');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.dataset.open === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && nav.dataset.open === 'true') {
      setMenu(false);
    }
  });
}
