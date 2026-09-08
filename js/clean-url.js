// Clean URLs: Strips 'index.html' and '.html' from the browser address bar
(function () {
  try {
    var path = window.location.pathname;
    if (path.endsWith('/index.html') || path === '/index.html' || path === 'index.html') {
      var newPath = path.replace(/index\.html$/, '') || '/';
      window.history.replaceState(null, '', newPath + window.location.search + window.location.hash);
    } else if (path.endsWith('.html')) {
      var cleanPath = path.replace(/\.html$/, '');
      window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
    }
  } catch (e) {}
})();
