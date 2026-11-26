/* Loader → welcome (bride & groom greeting) */
(function () {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.getElementById('loader');
  const fill = document.getElementById('ldFill');
  const cover = document.getElementById('cover');
  if (!loader || !cover) return;

  const urls = ['assets/img/stamp.png', 'assets/img/peony.jpg', 'assets/img/rose.jpg',
    'assets/img/marigold.jpg', 'assets/img/lotus.jpg', 'assets/img/ganesha.svg', 'assets/img/main-image.webp'];
  let done = 0;
  const total = urls.length + 1;
  const step = () => { done++; if (fill) fill.style.width = Math.min(100, done / total * 100) + '%'; };
  const loads = urls.map(u => new Promise(r => {
    const i = new Image(); i.onload = i.onerror = () => { step(); r(); }; i.src = u;
  }));
  loads.push(((document.fonts && document.fonts.ready) || Promise.resolve()).then(step));

  const minWait = new Promise(r => setTimeout(r, reduced ? 200 : 1400));
  const maxWait = new Promise(r => setTimeout(r, 5000));
  Promise.race([Promise.all([Promise.all(loads), minWait]), maxWait]).then(() => {
    if (fill) fill.style.width = '100%';
    setTimeout(() => { loader.classList.add('done'); cover.classList.add('go'); }, 250);
  });

  // personalised greeting: ?to=Name
  const name = new URLSearchParams(location.search).get('to');
  const g = document.getElementById('guest');
  if (name && g) { g.textContent = 'प्रिय ' + name.slice(0, 40) + ' जी,'; g.hidden = false; }
})();
