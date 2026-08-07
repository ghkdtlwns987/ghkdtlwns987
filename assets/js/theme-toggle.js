(function () {
  var storageKey = 'site-theme';
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(storageKey, theme);
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Light mode로 변경' : 'Dark mode로 변경');
  }

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });

  applyTheme(root.getAttribute('data-theme') || 'dark');
})();
