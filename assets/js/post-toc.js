(function () {
  var content = document.getElementById("post-content");
  var toc = document.getElementById("post-toc");
  var list = document.getElementById("post-toc-list");
  var nav = document.getElementById("post-toc-nav");
  var article = document.getElementById("post-article");
  var recent = document.getElementById("post-toc-recent");
  if (!content || !toc || !list || !article) return;

  function slugify(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\uac00-\ud7a3\- ]+/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section";
  }

  var headings = Array.prototype.slice.call(content.querySelectorAll("h2, h3"));
  var items = [];

  if (headings.length) {
    var usedIds = {};
    headings.forEach(function (heading) {
      if (!heading.id) {
        var base = slugify(heading.textContent || "section");
        var id = base;
        var n = 2;
        while (usedIds[id] || document.getElementById(id)) {
          id = base + "-" + n;
          n += 1;
        }
        heading.id = id;
      }
      usedIds[heading.id] = true;
    });

    var firstHeading = headings[0];
    var hasIntro = false;
    var node = content.firstElementChild;
    while (node && node !== firstHeading) {
      if (node.textContent && node.textContent.trim()) {
        hasIntro = true;
        break;
      }
      node = node.nextElementSibling;
    }
    if (hasIntro) {
      if (!article.id) article.id = "post-top";
      items.push({ id: article.id, text: "들어가며", level: 2, el: article });
    }

    headings.forEach(function (heading) {
      items.push({
        id: heading.id,
        text: (heading.textContent || "").trim(),
        level: heading.tagName === "H3" ? 3 : 2,
        el: heading,
      });
    });

    var frag = document.createDocumentFragment();
    items.forEach(function (item, index) {
      var li = document.createElement("li");
      li.className =
        "post-toc-item" + (item.level === 3 ? " post-toc-item--h3" : "");
      var a = document.createElement("a");
      a.className = "post-toc-link";
      a.href = "#" + item.id;
      a.textContent = item.text;
      a.title = item.text;
      a.dataset.tocIndex = String(index);
      li.appendChild(a);
      frag.appendChild(li);
    });
    list.appendChild(frag);
  } else if (nav) {
    nav.hidden = true;
  }

  if (!items.length && !recent) return;
  toc.hidden = false;

  var details = document.getElementById("post-toc-details");
  if (details && window.matchMedia("(max-width: 1100px)").matches) {
    details.removeAttribute("open");
  }

  var links = Array.prototype.slice.call(list.querySelectorAll(".post-toc-link"));

  function setActive(index) {
    links.forEach(function (link, i) {
      link.classList.toggle("is-active", i === index);
    });
  }

  function currentIndex() {
    var offset = 96;
    var best = 0;
    for (var i = 0; i < items.length; i++) {
      var top = items[i].el.getBoundingClientRect().top;
      if (top - offset <= 0) best = i;
      else break;
    }
    return best;
  }

  if (items.length) {
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        setActive(currentIndex());
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    setActive(currentIndex());

    list.addEventListener("click", function (e) {
      var link = e.target.closest(".post-toc-link");
      if (!link) return;
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var id = decodeURIComponent(href.slice(1));
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
      history.replaceState(null, "", "#" + id);
    });
  }
})();
