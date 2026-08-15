(function () {
  var root = document.getElementById('site-search');
  if (!root) return;

  var input = root.querySelector('.site-search-input');
  var panel = root.querySelector('.site-search-results');
  var indexUrl = root.getAttribute('data-index');
  var posts = null;
  var active = -1;

  function loadIndex() {
    if (posts) return Promise.resolve(posts);
    return fetch(indexUrl)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        posts = Array.isArray(data) ? data : [];
        return posts;
      })
      .catch(function () {
        posts = [];
        return posts;
      });
  }

  function normalize(s) {
    return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function typeLabel(p) {
    if (p.type === 'page') return 'Page';
    if (p.type === 'publication') return 'Publication';
    return p.category || 'Post';
  }

  function search(query) {
    var q = normalize(query);
    if (!q || q.length < 1) return [];
    var terms = q.split(' ').filter(Boolean);
    return posts.filter(function (p) {
      var hay = normalize([
        p.title,
        p.description,
        p.category,
        p.subcategory,
        p.date,
        p.type,
        typeLabel(p)
      ].join(' '));
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    }).slice(0, 10);
  }

  function metaText(p) {
    if (p.type === 'page') return 'Page';
    if (p.type === 'publication') {
      return ['Publication', p.date].filter(Boolean).join(' · ');
    }
    return [p.category, p.subcategory, p.date].filter(Boolean).join(' · ');
  }

  function render(results, query) {
    active = -1;
    if (!query.trim()) {
      panel.hidden = true;
      panel.innerHTML = '';
      return;
    }
    if (!results.length) {
      panel.hidden = false;
      panel.innerHTML = '<p class="site-search-empty">검색 결과가 없습니다.</p>';
      return;
    }
    panel.hidden = false;
    panel.innerHTML = results.map(function (p, i) {
      var meta = metaText(p);
      return (
        '<a class="site-search-item" href="' + p.url + '" data-index="' + i + '">' +
          '<span class="site-search-item-title"></span>' +
          (meta ? '<span class="site-search-item-meta"></span>' : '') +
        '</a>'
      );
    }).join('');
    var items = panel.querySelectorAll('.site-search-item');
    results.forEach(function (p, i) {
      items[i].querySelector('.site-search-item-title').textContent = p.title;
      var metaEl = items[i].querySelector('.site-search-item-meta');
      if (metaEl) metaEl.textContent = metaText(p);
    });
  }

  function run() {
    loadIndex().then(function () {
      render(search(input.value), input.value);
    });
  }

  function focusSearch() {
    input.focus();
    input.select();
    run();
  }

  input.addEventListener('input', run);
  input.addEventListener('focus', run);

  input.addEventListener('keydown', function (e) {
    var items = panel.querySelectorAll('.site-search-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(active + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(active - 1, 0);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      window.location.href = items[active].getAttribute('href');
      return;
    } else if (e.key === 'Escape') {
      panel.hidden = true;
      return;
    } else {
      return;
    }
    items.forEach(function (el, i) {
      el.classList.toggle('is-active', i === active);
    });
  });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    var typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable);
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      focusSearch();
      return;
    }
    if (!typing && e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      focusSearch();
    }
  });

  document.addEventListener('click', function (e) {
    if (!root.contains(e.target)) {
      panel.hidden = true;
    }
  });
})();
