(function () {
  var filters = document.getElementById('poster-filters');
  var list = document.getElementById('poster-archive-list');
  var empty = document.getElementById('poster-filter-empty');
  if (!filters || !list) return;

  var state = { category: 'all', year: 'all', badge: 'all' };

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

  function normalizeBadge(value) {
    try {
      return decodeURIComponent(String(value || '')).trim();
    } catch (err) {
      return String(value || '').trim();
    }
  }

  function cardHasBadge(card, badge) {
    var want = normalizeBadge(badge);
    if (!want || want === 'all') return true;
    var raw = card.getAttribute('data-badges') || '';
    if (!raw) return false;
    var parts = raw.split('|').map(function (part) {
      return normalizeBadge(part);
    });
    // 정확히 포함되면 통과 (ASE|2026|Paper Review 에서도 ASE 매칭)
    return parts.indexOf(want) !== -1;
  }

  function apply() {
    var cards = list.querySelectorAll('.post-list-card');
    var visible = 0;
    cards.forEach(function (card) {
      var cat = card.getAttribute('data-category') || '';
      var year = card.getAttribute('data-year') || '';
      var okCat = state.category === 'all' || cat === state.category;
      var okYear = state.year === 'all' || year === state.year;
      var okBadge = cardHasBadge(card, state.badge);
      var show = okCat && okYear && okBadge;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
    syncAria();
  }

  function writeUrl() {
    var url = new URL(window.location.href);
    ['category', 'year', 'badge'].forEach(function (key) {
      if (state[key] && state[key] !== 'all') url.searchParams.set(key, state[key]);
      else url.searchParams.delete(key);
    });
    var next = url.pathname + url.search + url.hash;
    window.history.replaceState({}, '', next);
  }

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    state.category = params.get('category') || 'all';
    state.year = params.get('year') || 'all';
    state.badge = normalizeBadge(params.get('badge') || 'all') || 'all';
  }

  function setFilter(key, value, options) {
    options = options || {};
    state[key] = normalizeBadge(value) || 'all';

    // Badge 검색은 "해당 뱃지를 가진 모든 글"이 보이도록 다른 필터를 초기화
    if (options.fromBadge && key === 'badge' && state.badge !== 'all') {
      state.category = 'all';
      state.year = 'all';
    }
    // 카테고리 뱃지 클릭 시 badge 필터는 해제
    if (options.fromBadge && key === 'category' && state.category !== 'all') {
      state.badge = 'all';
    }

    writeUrl();
    apply();
  }

  filters.addEventListener('click', function (e) {
    var btn = e.target.closest('.poster-filter-chip');
    if (!btn) return;
    var group = btn.closest('[data-filter-group]');
    if (!group) return;
    var key = group.getAttribute('data-filter-group');
    var value = btn.getAttribute('data-filter') || 'all';
    // Badge 칩을 누르면 카테고리/연도 초기화해서 포함 글 전부 노출
    if (key === 'badge' && value !== 'all') {
      setFilter('badge', value, { fromBadge: true });
    } else {
      setFilter(key, value);
    }
  });

  document.addEventListener('click', function (e) {
    var badgeBtn = e.target.closest('[data-badge-filter]');
    if (badgeBtn) {
      e.preventDefault();
      e.stopPropagation();
      setFilter('badge', badgeBtn.getAttribute('data-badge-filter') || 'all', {
        fromBadge: true,
      });
      var archive = document.getElementById('poster-archive');
      if (archive) archive.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    var catBtn = e.target.closest('[data-category-filter]');
    if (catBtn) {
      e.preventDefault();
      e.stopPropagation();
      setFilter('category', catBtn.getAttribute('data-category-filter') || 'all', {
        fromBadge: true,
      });
      var archive2 = document.getElementById('poster-archive');
      if (archive2) archive2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, true);

  window.__posterSetFilter = setFilter;

  readUrl();
  // URL로 badge만 들어온 경우에도 카테고리/연도에 가리지 않도록
  if (state.badge && state.badge !== 'all') {
    state.category = 'all';
    state.year = 'all';
    writeUrl();
  }
  apply();
})();
