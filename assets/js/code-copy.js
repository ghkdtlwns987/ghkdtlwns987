(function () {
  var content = document.getElementById('post-content');
  if (!content) return;

  function getCodeText(pre) {
    var code = pre.querySelector('code');
    return (code ? code.textContent : pre.textContent) || '';
  }

  function markCopied(btn) {
    var prev = btn.textContent;
    btn.textContent = 'Copied';
    btn.classList.add('is-copied');
    setTimeout(function () {
      btn.textContent = prev;
      btn.classList.remove('is-copied');
    }, 1400);
  }

  function attach(pre) {
    if (pre.closest('.post-mermaid')) return;
    if (pre.getAttribute('data-copy-ready')) return;
    pre.setAttribute('data-copy-ready', '1');

    var wrap = pre.closest('div.highlighter-rouge') || pre.parentElement;
    if (!wrap) wrap = pre;
    if (wrap.classList) wrap.classList.add('code-block');
    if (getComputedStyle(wrap).position === 'static') {
      wrap.style.position = 'relative';
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', '코드 복사');
    btn.addEventListener('click', function () {
      var text = getCodeText(pre);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          markCopied(btn);
        }).catch(function () {
          fallbackCopy(text, btn);
        });
      } else {
        fallbackCopy(text, btn);
      }
    });
    wrap.appendChild(btn);
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      markCopied(btn);
    } catch (e) {}
    document.body.removeChild(ta);
  }

  content.querySelectorAll('div.highlighter-rouge pre, pre').forEach(attach);
})();
