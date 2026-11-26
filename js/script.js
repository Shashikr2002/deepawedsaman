/* =========================================================
   Deepa & Aman — Royal Wedding Invitation
   Interactions, animations & audio
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     AUDIO
  --------------------------------------------------------- */
  const bgm      = $('#bgm');
  const musicBtn = $('#musicBtn');
  let musicWanted = false;

  function playBgm() {
    if (!bgm) return;
    bgm.volume = 0;
    const p = bgm.play();
    if (p && p.then) {
      p.then(() => { fade(bgm, 0.5, 1800); markMusic(true); })
       .catch(() => markMusic(false));
    }
  }
  function pauseBgm() { fade(bgm, 0, 600, () => bgm.pause()); markMusic(false); }
  function markMusic(on) { musicWanted = on; musicBtn.classList.toggle('paused', !on); }
  function fade(audio, target, dur, done) {
    if (!audio) return;
    const start = audio.volume, t0 = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      audio.volume = start + (target - start) * k;
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    })(performance.now());
  }
  musicBtn.addEventListener('click', () => { if (musicWanted) pauseBgm(); else playBgm(); });

  /* ---------------------------------------------------------
     ENVELOPE OPEN
  --------------------------------------------------------- */
  const cover      = $('#cover');
  const seal       = $('#seal');
  const invitation = $('#invitation');
  const topbar     = $('#topbar');
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;
    playBgm();
    cover.classList.add('opening');
    setTimeout(() => {
      cover.classList.add('open');
      invitation.classList.add('revealed');
      topbar.classList.remove('hidden');
      document.body.style.overflow = '';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      startCountdown();
    }, 1050);
  }

  document.body.style.overflow = 'hidden';
  topbar.classList.add('hidden');
  seal.addEventListener('click', e => { e.stopPropagation(); openEnvelope(); });
  seal.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });
  cover.addEventListener('click', openEnvelope);

  /* ---------------------------------------------------------
     COUNTDOWN → 11 Dec 2026, 19:00 IST
  --------------------------------------------------------- */
  const target = new Date('2026-12-11T19:00:00+05:30').getTime();
  let cdTimer = null;
  function startCountdown() {
    if (cdTimer) return;
    const d = $('#cd-d'), h = $('#cd-h'), m = $('#cd-m'), s = $('#cd-s');
    const pad = n => String(Math.max(0, n)).padStart(2, '0');
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) { d.textContent = h.textContent = m.textContent = s.textContent = '00'; clearInterval(cdTimer); return; }
      const sec = Math.floor(diff / 1000);
      d.textContent = pad(Math.floor(sec / 86400));
      h.textContent = pad(Math.floor((sec % 86400) / 3600));
      m.textContent = pad(Math.floor((sec % 3600) / 60));
      s.textContent = pad(sec % 60);
    }
    tick();
    cdTimer = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     DEVOTIONAL SOUND on the FINAL slide
  --------------------------------------------------------- */
  const dir = $('#s-directions');
  const soundNote = $('#soundNote');
  let blessed = false;
  function blessIfVisible() {
    if (blessed || !opened) return;
    const r = dir.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.6 && r.bottom > 0) {
      blessed = true;
      if (!musicWanted) playBgm();
    }
  }
  window.addEventListener('scroll', blessIfVisible, { passive: true });
  if (soundNote) soundNote.addEventListener('click', () => { if (!musicWanted) playBgm(); else pauseBgm(); });

  /* ---------------------------------------------------------
     FALLING PETALS
  --------------------------------------------------------- */
  const petalLayer = $('#petals');
  const PETAL_COLORS = ['#e3a9b5', '#c9a24a', '#e8c979', '#b5485f', '#f3dd9a', '#d98c4a'];
  function petalSVG(color) {
    return `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 2C9 7 4 8 4 13a8 8 0 0 0 16 0c0-5-5-6-8-11z" fill="${color}"/><path d="M12 4c-1.5 3-4 4-4 8a4 4 0 0 0 8 0c0-4-2.5-5-4-8z" fill="rgba(255,255,255,.25)"/></svg>`;
  }
  function spawnPetal() {
    if (prefersReduced) return;
    const el = document.createElement('div');
    el.className = 'petal';
    el.innerHTML = petalSVG(PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]);
    const size = 10 + Math.random() * 20;
    const startX = Math.random() * 100;
    const drift = (Math.random() * 2 - 1) * 18;
    const dur = 8 + Math.random() * 8;
    el.style.left = startX + 'vw';
    el.style.opacity = 0.35 + Math.random() * 0.5;
    petalLayer.appendChild(el);
    const anim = el.animate(
      [
        { transform: `translate(0, -10vh) rotate(0deg) scale(${size / 24})`, opacity: 0 },
        { opacity: 0.8, offset: 0.1 },
        { transform: `translate(${drift}vw, 110vh) rotate(${(Math.random() * 2 - 1) * 540}deg) scale(${size / 24})`, opacity: 0.1 }
      ],
      { duration: dur * 1000, easing: 'linear' }
    );
    anim.onfinish = () => el.remove();
  }
  if (!prefersReduced) {
    for (let i = 0; i < 8; i++) setTimeout(spawnPetal, i * 400);
    setInterval(spawnPetal, 1100);
  }

  /* ---------------------------------------------------------
     SCROLL-REVEAL ANIMATIONS
  --------------------------------------------------------- */
  function initAnimations() {
    if (prefersReduced || !window.gsap) { $$('.reveal').forEach(el => { el.style.opacity = 1; }); return; }
    gsap.registerPlugin(ScrollTrigger);

    $$('.scene').forEach(scene => {
      const items = $$('.reveal', scene);
      gsap.set(items, { opacity: 0, y: 46 });
      ScrollTrigger.create({
        trigger: scene, start: 'top 72%',
        onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }),
        onEnterBack: () => gsap.to(items, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05 })
      });
      $$('.corner', scene).forEach((c, i) => {
        gsap.to(c, { y: (i % 2 ? 50 : -50), ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });

    const pf = $('.photo-frame');
    if (pf) gsap.fromTo(pf, { scale: 0.86, rotateZ: -1.5 },
      { scale: 1, rotateZ: 0, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: pf, start: 'top 80%' } });
  }
  initAnimations();

  /* ---------------------------------------------------------
     "View Location" → smooth scroll to directions
  --------------------------------------------------------- */
  const venueBtn = $('#venueMapBtn');
  if (venueBtn) venueBtn.addEventListener('click', e => { e.preventDefault(); dir.scrollIntoView({ behavior: 'smooth' }); });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && musicWanted) bgm.pause();
    else if (!document.hidden && musicWanted) bgm.play().catch(() => {});
  });
})();
