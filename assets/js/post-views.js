(function () {
  var cfg = window.__POST_VIEWS__;
  var wrap = document.getElementById("post-views");
  var countEl = document.getElementById("post-views-count");
  if (!cfg || !wrap || !countEl) return;

  var namespace = String(cfg.namespace || "site")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 48);
  var key = String(cfg.key || location.pathname || "page")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .replace(/\/+/g, "_")
    .slice(0, 96) || "home";

  var host = location.hostname;
  var isLocal =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".local");
  var action = isLocal ? "get" : "hit";
  var url =
    "https://abacus.jasoncameron.dev/" +
    action +
    "/" +
    encodeURIComponent(namespace) +
    "/" +
    encodeURIComponent(key);

  fetch(url, { credentials: "omit" })
    .then(function (res) {
      if (!res.ok) throw new Error("views request failed");
      return res.json();
    })
    .then(function (data) {
      var n = data && (data.value ?? data.count);
      if (typeof n !== "number") throw new Error("invalid count");
      countEl.textContent = n.toLocaleString("ko-KR");
      wrap.hidden = false;
    })
    .catch(function () {
      // 카운터 API 실패 시 조용히 숨김
    });
})();
