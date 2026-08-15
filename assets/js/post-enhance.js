(function () {
  var root = document.documentElement;
  var tries = 0;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function renderMath() {
    if (typeof renderMathInElement !== 'function') return false;
    renderMathInElement(document.getElementById('post-content') || document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false
    });
    return true;
  }

  function collectMermaidSources() {
    var nodes = document.querySelectorAll(
      'div.language-mermaid pre code, pre.language-mermaid code, code.language-mermaid'
    );
    nodes.forEach(function (code) {
      var pre = code.closest('pre') || code.parentElement;
      var wrap = pre && pre.closest('div.highlighter-rouge');
      var host = wrap || pre || code;
      if (host.classList && host.classList.contains('post-mermaid')) return;
      if (host.getAttribute && host.getAttribute('data-mermaid-ready')) return;
      var source = code.textContent || '';
      var out = document.createElement('div');
      out.className = 'post-mermaid';
      out.setAttribute('data-mermaid-source', source);
      out.setAttribute('data-mermaid-ready', '1');
      host.replaceWith(out);
    });
  }

  function renderMermaid() {
    if (typeof mermaid === 'undefined') return false;
    collectMermaidSources();
    var targets = document.querySelectorAll('.post-mermaid');
    if (!targets.length) return true;

    mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme() === 'light' ? 'default' : 'dark',
      securityLevel: 'loose'
    });

    targets.forEach(function (el, i) {
      var source = el.getAttribute('data-mermaid-source') || '';
      el.removeAttribute('data-processed');
      el.id = 'mermaid-diagram-' + i;
      el.textContent = source;
    });

    mermaid.run({ nodes: targets });
    return true;
  }

  function enhance() {
    var mathOk = renderMath();
    var mermaidOk = renderMermaid();
    if ((!mathOk || !mermaidOk) && tries < 40) {
      tries += 1;
      setTimeout(enhance, 100);
    }
  }

  window.__rerenderPostMermaid = renderMermaid;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance);
  } else {
    enhance();
  }
})();
