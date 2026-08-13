(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".js-page-rail-link[data-rail-target]")
  );
  if (!links.length) return;

  var targets = links
    .map(function (link) {
      var id = link.getAttribute("data-rail-target");
      var el = id ? document.getElementById(id) : null;
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  if (!targets.length) return;

  function setActive(activeLink) {
    document.querySelectorAll("#page-rail-list .post-toc-link").forEach(function (a) {
      a.classList.remove("is-active");
    });
    if (activeLink) activeLink.classList.add("is-active");
  }

  function current() {
    var offset = 96;
    var best = targets[0];
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].el.getBoundingClientRect().top - offset <= 0) {
        best = targets[i];
      } else {
        break;
      }
    }
    return best;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var best = current();
      setActive(best && best.link);
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.getElementById("page-rail-list").addEventListener("click", function (e) {
    var link = e.target.closest(".js-page-rail-link");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;
    var target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({ top: top, behavior: "smooth" });
    history.replaceState(null, "", href);
    setActive(link);
  });
})();
