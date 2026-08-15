(function () {
  var filters = document.getElementById('poster-filters');
  var list = document.getElementById('poster-archive-list');
  var empty = document.getElementById('poster-filter-empty');
  if (!filters || !list) return;

  var state = { category: 'all', year: 'all' };

  function syncAria() {
    filters.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var key = group.getAttribute('data-filter-group');
      group.querySelectorAll('.poster-filter-chip').forEach(function (btn) {
        var value = btn.getAttribute('data-filter') || 'all';
        var active = state[key] === value;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
  }

  function apply() {
    var cards = list.querySelectorAll('.post-list-card');
    var visible = 0;
    cards.forEach(function (card) {
      var cat = card.getAttribute('data-category') || '';
      var year = card.getAttribute('data-year') || '';
      var okCat = state.category === 'all' || cat === state.category;
      var okYear = state.year === 'all' || year === state.year;
      var show = okCat && okYear;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
    syncAria();
  }

  function writeUrl() {
    var url = new URL(window.location.href);
    ['category', 'year'].forEach(function (key) {
      if (state[key] && state[key] !== 'all') url.searchParams.set(key, state[key]);
      else url.searchParams.delete(key);
    });
    var next = url.pathname + url.search + url.hash;
    window.history.replaceState({}, '', next);
  }

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    var category = params.get('category') || 'all';
    var year = params.get('year') || 'all';
    state.category = category;
    state.year = year;
  }

  filters.addEventListener('click', function (e) {
    var btn = e.target.closest('.poster-filter-chip');
    if (!btn) return;
    var group = btn.closest('[data-filter-group]');
    if (!group) return;
    var key = group.getAttribute('data-filter-group');
    state[key] = btn.getAttribute('data-filter') || 'all';
    writeUrl();
    apply();
  });

  readUrl();
  apply();
})();
