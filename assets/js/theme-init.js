(function () {
  var storageKey = 'site-theme';
  var root = document.documentElement;
  var theme = localStorage.getItem(storageKey);
  if (theme !== 'light' && theme !== 'dark') {
    theme = 'dark';
  }
  root.setAttribute('data-theme', theme);
})();
