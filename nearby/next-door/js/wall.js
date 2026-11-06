/* ===== The Wall: postcards sent to Next Door from Say Hello, newest first; it keeps going as you scroll =====
   (📌 Find a friend, the Wall's own board, is NDFriend below) */
(function () {
  const PAGE = 18;
  let cBefore = null, cDone = false, busy = false, first = true, P = null;
  const one = () => document.getElementById('wall-one');
  async function cardPage() {
    if (cDone || !SUPABASE_CONFIG.url) { cDone = true; return []; }
    try {
      const u = SUPABASE_CONFIG.url + '/rest/v1/rpc/postcard_wall_page?p_limit=' + PAGE + (cBefore ? '&p_before=' + encodeURIComponent(cBefore) : '');
      const r = await fetch(u, { headers: { apikey: SUPABASE_CONFIG.anonKey, Authorization: 'Bearer ' + SUPABASE_CONFIG.anonKey } });
      const rows = r.ok ? await r.json() : [];
      if (!Array.isArray(rows) || rows.length < PAGE) cDone = true; if (rows.length) cBefore = rows[rows.length - 1].sent;
      return rows || [];
    } catch (e) { cDone = true; return []; }
  }
  function card(c) {
    const W = window.WallCards; const b = document.createElement('button'); b.type = 'button'; b.className = 'pcm hang' + (c.sealed ? ' sealed' : ''); b.style.setProperty('--r', W ? W.rot(c.id) : '0deg');
    const cv = document.createElement('canvas'); b.appendChild(cv); if (P) P.draw(cv, c.scene, c.id);
    const cap = document.createElement('span'); cap.className = 'cap'; cap.textContent = c.sealed ? '🔒 ' + T('wall.opens').replace('{d}', W ? W.when(c.open_at) : '') : (c.place ? c.place + ' · ' : '') + c.from; b.appendChild(cap);
    b.onclick = () => { SoundEngine.playClick(); if (W) W.show(c, P); };
    return b;
  }
  async function more() {
    if (busy || cDone) return; busy = true;
    if (!P && window.WallCards) { try { P = await WallCards.scenes(); } catch (e) {} }
    const items = (await cardPage()).map(x => () => card(x));
    const el = one();
    if (first) { el.innerHTML = ''; first = false; if (!items.length) el.innerHTML = `<p class="font-hand text-[22px] text-[#fff3dc] p-3" style="grid-column:1/-1;text-shadow:1px 1px 0 #000">${esc(T('wall.emptyWall'))}</p>`; }
    items.forEach(n => el.appendChild(n()));
    busy = false;
    const s = document.getElementById('wall-more'); if (s && s.getBoundingClientRect().top < innerHeight + 200 && !cDone) more();
  }
  function reload() { cBefore = null; cDone = false; first = true; one().innerHTML = '<p class="label">' + esc(T('common.loading')) + '</p>'; more(); }
  try { new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) more(); }, { rootMargin: '300px' }).observe(document.getElementById('wall-more')); } catch (e) {}
  /* the bricks fill the room down to the bottom, however few postcards hang on them */
  function fit() { const el = one(); if (!el || !el.getClientRects().length) return;
    el.style.minHeight = Math.max(200, Math.round(innerHeight - 16 - (el.getBoundingClientRect().top + scrollY) - 12)) + 'px'; }
  addEventListener('resize', fit); addEventListener('orientationchange', () => setTimeout(fit, 300));
  window.Wall = { reload: reload, onEnter() { if (first || !one().children.length) reload(); requestAnimationFrame(fit); setTimeout(fit, 400); } };
})();
