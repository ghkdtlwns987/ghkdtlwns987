(function () {
  var toggle = document.getElementById('nav-toggle');
  var sidebar = document.querySelector('.sidebar-left');
  if (!toggle || !sidebar) return;

  var overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = 'nav-overlay';
    overlay.hidden = true;
    document.body.appendChild(overlay);
  }

  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    overlay.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });

  overlay.addEventListener('click', function () {
    setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  sidebar.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 768px)').matches) setOpen(false);
    });
  });

  window.addEventListener('resize', function () {
    if (!window.matchMedia('(max-width: 768px)').matches) setOpen(false);
  });
})();
