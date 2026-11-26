/* =========================================================
   Premium motion layer for Deepa & Aman invitation
   ========================================================= */
(function () {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const GOLD = ['#f3dd9a', '#e8c979', '#c9a24a', '#fff3c4', '#ffd36b'];
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function mkCanvas(id) {
    const c = document.createElement('canvas');
    c.id = id; document.body.appendChild(c);
    const ctx = c.getContext('2d');
    const size = () => { c.width = innerWidth * DPR; c.height = innerHeight * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); };
    size(); addEventListener('resize', size);
    return { c, ctx };
  }

  /* ---------- 1. SPARKLE BURSTS (seal tap, finale, trail) ---------- */
  const fx = mkCanvas('fx');
  let sparks = [], fxRun = false;
  function star(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4, rr = i % 2 ? r * .35 : r;
      ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  }
  function fxLoop() {
    const { ctx } = fx;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    sparks = sparks.filter(p => p.life > 0);
    for (const p of sparks) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .985; p.life -= p.decay; p.rot += .08;
      ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); star(ctx, 0, 0, p.r); ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (sparks.length) requestAnimationFrame(fxLoop); else fxRun = false;
  }
  function burst(x, y, n = 70, power = 7) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = Math.random() * power + 1.5;
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, g: .09, life: 1, decay: .008 + Math.random() * .012,
        r: 2 + Math.random() * 5, rot: Math.random() * 6, color: GOLD[(Math.random() * GOLD.length) | 0] });
    }
    if (!fxRun) { fxRun = true; requestAnimationFrame(fxLoop); }
  }
  // seal tap → gold burst
  const seal = $('#seal');
  if (seal) addEventListener('pointerdown', e => {
    if (e.target.closest('#cover')) { const r = seal.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 90, 9); }
  }, { once: true });
  // finger/mouse sparkle trail
  let lastT = 0;
  addEventListener('pointermove', e => {
    if (reduced || e.pointerType === 'touch' && e.buttons === 0) return;
    const t = performance.now(); if (t - lastT < 60) return; lastT = t;
    sparks.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - .5) * 1.2, vy: Math.random() * .6, g: .03, life: .9, decay: .03,
      r: 2 + Math.random() * 3, rot: 0, color: GOLD[(Math.random() * GOLD.length) | 0] });
    if (!fxRun) { fxRun = true; requestAnimationFrame(fxLoop); }
  }, { passive: true });
  addEventListener('touchmove', e => {
    const t = e.touches[0]; if (!t || reduced) return;
    const n = performance.now(); if (n - lastT < 70) return; lastT = n;
    sparks.push({ x: t.clientX, y: t.clientY, vx: (Math.random() - .5), vy: Math.random() * .5, g: .03, life: .8, decay: .035,
      r: 2 + Math.random() * 3, rot: 0, color: GOLD[(Math.random() * GOLD.length) | 0] });
    if (!fxRun) { fxRun = true; requestAnimationFrame(fxLoop); }
  }, { passive: true });

  /* ---------- 2. AMBIENT GOLD DUST ---------- */
  if (!reduced) {
    const dust = mkCanvas('dust');
    const N = innerWidth < 700 ? 34 : 60;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: .6 + Math.random() * 2, vy: -(.1 + Math.random() * .35), vx: (Math.random() - .5) * .25,
      ph: Math.random() * 6.28, sp: .01 + Math.random() * .03
    }));
    (function loop() {
      if (!document.hidden) {
        const { ctx } = dust;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (const p of ps) {
          p.x += p.vx + Math.sin(p.ph) * .15; p.y += p.vy; p.ph += p.sp;
          if (p.y < -5) { p.y = innerHeight + 5; p.x = Math.random() * innerWidth; }
          const a = .25 + .5 * Math.abs(Math.sin(p.ph));
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, `rgba(255,236,170,${a})`); g.addColorStop(1, 'rgba(255,236,170,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.28); ctx.fill();
        }
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 3. TORAN (marigold strands) + Ganesha aura ---------- */
  function toran(scene) {
    const wrap = document.createElement('div'); wrap.className = 'toran';
    const small = innerWidth < 700, cnt = small ? 7 : 13;
    for (let i = 0; i < cnt; i++) {
      const len = 22 + (i % 2 ? 36 : 0) + (small ? 6 : 14) * Math.abs(Math.sin(i));
      const s = document.createElement('div'); s.className = 'strand';
      s.style.animationDelay = (-i * .35) + 's'; s.style.animationDuration = (3.6 + (i % 3) * .5) + 's';
      let html = `<i style="height:${len}px"></i>`;
      const beads = 2 + (i % 3);
      for (let b = 0; b < beads; b++) html += `<b class="${b === beads - 1 ? 'm' : 's'}"></b>`;
      s.innerHTML = html; wrap.appendChild(s);
    }
    scene.prepend(wrap);
  }
  ['#s-invocation', '#s-directions'].forEach(id => { const el = $(id); if (el) toran(el); });
  const gan = $('.ganesha');
  if (gan) {
    const w = document.createElement('div'); w.className = 'ganesha-wrap';
    gan.parentNode.insertBefore(w, gan);
    const a = document.createElement('div'); a.className = 'aura';
    w.appendChild(a); w.appendChild(gan);
    w.classList.add('reveal');
  }

  /* ---------- 4. PROGRESS BAR + SECTION DOTS ---------- */
  const bar = document.createElement('div'); bar.id = 'progress'; document.body.appendChild(bar);
  const scenes = $$('.scene');
  const dots = document.createElement('div'); dots.id = 'dots';
  scenes.forEach((s, i) => {
    const b = document.createElement('button'); b.setAttribute('aria-label', 'Section ' + (i + 1));
    b.onclick = () => s.scrollIntoView({ behavior: 'smooth' }); dots.appendChild(b);
  });
  document.body.appendChild(dots);
  const dotBtns = $$('button', dots);
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    let idx = 0;
    scenes.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .5) idx = i; });
    dotBtns.forEach((b, i) => b.classList.toggle('on', i === idx));
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const inv = $('#invitation');
  new MutationObserver(() => dots.classList.toggle('show', inv.classList.contains('revealed')))
    .observe(inv, { attributes: true, attributeFilter: ['class'] });

  /* ---------- 5. GSAP SCROLL CHOREOGRAPHY ---------- */
  if (window.gsap && window.ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);

    // dividers draw outward
    $$('.divider').forEach(d => {
      gsap.from($$('.line', d), { scaleX: 0, duration: 1.2, ease: 'power3.out', stagger: 0, scrollTrigger: { trigger: d, start: 'top 88%' } });
    });

    // big names: tracking collapse + de-blur
    $$('.display, .venue-name').forEach(h => {
      gsap.from(h, { letterSpacing: '.22em', filter: 'blur(10px)', duration: 1.8, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 85%' } });
    });

    // hero photo parallax inside frame
    const pimg = $('.photo-frame img');
    if (pimg) gsap.to(pimg, { yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: '.photo-frame', start: 'top bottom', end: 'bottom top', scrub: true } });

    // couple cards sweep in from opposite sides, "weds" pops
    const pc = $$('.person-card');
    if (pc[0]) gsap.from(pc[0], { x: -90, rotate: -3, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.couple-grid', start: 'top 80%' } });
    if (pc[1]) gsap.from(pc[1], { x: 90, rotate: 3, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.couple-grid', start: 'top 80%' } });
    const weds = $('.weds');
    if (weds) gsap.from(weds, { scale: 0, rotate: -40, duration: 1.1, ease: 'back.out(2.4)', scrollTrigger: { trigger: '.couple-grid', start: 'top 70%' } });

    // timeline: line draws with scroll; cards alternate; dots light when reached
    const tl = $('.timeline');
    if (tl) {
      gsap.fromTo(tl, { '--p': 0 }, { '--p': 1, ease: 'none',
        scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 70%', scrub: true } });
      $$('.tl-item', tl).forEach((it, i) => {
        gsap.from($('.tl-card', it), { x: i % 2 ? 70 : -70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: it, start: 'top 88%' } });
        ScrollTrigger.create({ trigger: it, start: 'top 70%', onEnter: () => it.classList.add('hit') });
      });
    }

    // names list cascade
    const li = $$('.names-list li');
    if (li.length) gsap.from(li, { opacity: 0, x: -20, duration: .6, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: '.names-list', start: 'top 85%' } });

    // verse lines
    const verse = $('.verse');
    if (verse) gsap.from(verse, { scale: .92, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: verse, start: 'top 85%' } });

    // finale: gold + petal-like burst when the last section arrives
    const fin = $('#s-directions');
    if (fin) ScrollTrigger.create({ trigger: fin, start: 'top 55%', once: true, onEnter: () => {
      burst(innerWidth * .2, innerHeight * .35, 50, 8); burst(innerWidth * .8, innerHeight * .35, 50, 8);
      setTimeout(() => burst(innerWidth * .5, innerHeight * .3, 80, 10), 450);
    } });
  }

  /* ---------- 6. COUNTDOWN tick animation ---------- */
  const sEl = $('#cd-s');
  if (sEl) new MutationObserver(() => {
    const box = sEl.closest('.cd-box'); box.classList.add('tick'); setTimeout(() => box.classList.remove('tick'), 220);
  }).observe(sEl, { childList: true, characterData: true, subtree: true });

  /* ---------- 7. 3D tilt on cards (desktop) ---------- */
  if (fine && !reduced) $$('.person-card, .date-plaque').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* ---------- 8. ADD TO CALENDAR (.ics) + WhatsApp share ---------- */
  const VENUE = 'Green Lounge Fusion Banquet, B-6, G.T. Karnal Road, Delhi 110033';
  const EVENTS = [
    ['Sundarkand Path', '2026-12-08', '11:00', '13:00', ''],
    ['Telban — Deepa & Aman', '2026-12-09', '17:00', '19:00', ''],
    ['Haldi — Deepa & Aman', '2026-12-10', '11:00', '13:00', ''],
    ['Mehendi — Deepa & Aman', '2026-12-10', '18:00', '21:00', ''],
    ['Baraat Welcome — Deepa & Aman Wedding', '2026-12-11', '19:00', '21:00', VENUE],
    ['Wedding Dinner — Deepa & Aman', '2026-12-11', '21:00', '23:30', VENUE]
  ];
  function utc(d, t) { // IST → UTC
    const [y, m, dd] = d.split('-').map(Number), [h, mi] = t.split(':').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, dd, h, mi) - 330 * 60000);
    return dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
  function downloadICS() {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Deepa weds Aman//EN'];
    EVENTS.forEach((e, i) => lines.push('BEGIN:VEVENT', `UID:deepa-aman-${i}@wedding`, 'DTSTAMP:' + utc('2026-11-27', '00:00'),
      'DTSTART:' + utc(e[1], e[2]), 'DTEND:' + utc(e[1], e[3]), 'SUMMARY:' + e[0], e[4] ? 'LOCATION:' + e[4].replace(/,/g, '\\,') : 'DESCRIPTION:Please join us with your blessings.', 'END:VEVENT'));
    lines.push('END:VCALENDAR');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
    a.download = 'Deepa-weds-Aman.ics'; document.body.appendChild(a); a.click(); a.remove();
  }
  const note = $('.ist-note');
  if (note) {
    const b = document.createElement('button');
    b.className = 'btn-gold btn-cal reveal'; b.type = 'button';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> Add to Calendar';
    b.onclick = downloadICS; note.after(b);
  }
  const acts = $('.dir-actions');
  if (acts) {
    const w = document.createElement('a');
    w.className = 'btn-gold btn-wa reveal'; w.target = '_blank'; w.rel = 'noopener';
    w.href = 'https://wa.me/?text=' + encodeURIComponent('शुभ विवाह • Deepa weds Aman\n11 December 2026, Delhi\nआप सादर आमंत्रित हैं 🙏\n' + location.href);
    w.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 0 0 3.2 17.1L2 22l5-1.3A11 11 0 1 0 20.5 3.5zM12 20a9 9 0 0 1-4.6-1.3l-.3-.2-3 .8.8-2.9-.2-.3A9 9 0 1 1 12 20zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6 0a7.4 7.4 0 0 1-3.700-3.200c-.3-.5.3-.5.8-1.600.1-.2 0-.3 0-.5l-.8-1.900c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.200 5.200 5.200 0 0 0 1.100 2.800 11.900 11.900 0 0 0 4.600 4c1.700.7 2.400.8 3.200.7a2.700 2.700 0 0 0 1.800-1.300 2.200 2.200 0 0 0 .2-1.300c-.1-.1-.3-.2-.6-.3z"/></svg> Share on WhatsApp';
    acts.after(w);
  }
})();
