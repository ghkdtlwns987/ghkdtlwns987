(function () {
  function posterBadgeUrl(badge) {
    var base = document.body.getAttribute('data-poster-url') || '/poster/';
    var url = new URL(base, window.location.origin);
    url.searchParams.set('badge', badge);
    return url.pathname + url.search;
  }

  function posterCategoryUrl(category) {
    var base = document.body.getAttribute('data-poster-url') || '/poster/';
    var url = new URL(base, window.location.origin);
    url.searchParams.set('category', category);
    return url.pathname + url.search;
  }

  document.addEventListener('click', function (e) {
    var badgeBtn = e.target.closest('[data-badge-filter]');
    if (badgeBtn) {
      // /poster/ 페이지는 poster-filter.js가 처리
      if (document.getElementById('poster-filters')) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.href = posterBadgeUrl(badgeBtn.getAttribute('data-badge-filter') || '');
      return;
    }
    var catBtn = e.target.closest('[data-category-filter]');
    if (catBtn) {
      if (document.getElementById('poster-filters')) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.href = posterCategoryUrl(catBtn.getAttribute('data-category-filter') || '');
    }
  }, true);
})();
