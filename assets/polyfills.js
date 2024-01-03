if (!window.fetch) {
  var script = document.createElement('script');
  script.src = 'https://unpkg.com/unfetch/polyfill';
  document.head.prepend(script);
}

if (!window.Promise) {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js';
  document.head.prepend(script);
}
