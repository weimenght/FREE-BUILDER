/* The shelves' things can be moved (Nov 5, the owner's direction): drag any of them along the shelves and it snaps into a spot
   on the nearest shelf, staying there for the visit (per set of things, sessionStorage nd_shelf). A tap still gets the host's
   own reaction (the click handler in "Next Door, simply"); a drag never counts as a tap. Popo's tin moves too and still opens. */
(function () {
  const stage = document.getElementById('stage-counter-box'); if (!stage) return;
  const rows = () => [...stage.querySelectorAll('.shelf')].slice(0, 2);
  const spans = () => { const r = rows(); if (r.length < 2) return []; return [r[0].querySelector('#shelf-icon-left'), r[0].querySelector('#shelf-icon-right'), r[1].children[0], r[1].children[1]]; };
  const EM = /(?:[☀-➿⬀-⯿⌀-⏿]|[\uD83C-\uD83E][\uDC00-\uDFFF])(?:️|‍(?:[☀-➿]|[\uD83C-\uD83E][\uDC00-\uDFFF])|\uD83C[\uDFFB-\uDFFF])*/g;
  const emo = () => { try { return !!(window.FBL && FBL.emo && FBL.emo()); } catch (e) { return false; } };
  const hash = t => { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  const load = () => { try { return JSON.parse(sessionStorage.getItem('nd_shelf') || '{}') || {}; } catch (e) { return {}; } };
  const keep = o => { try { sessionStorage.setItem('nd_shelf', JSON.stringify(o)); } catch (e) {} };
  const css = document.createElement('style');
  css.textContent = '.shelf .hshelf,#nd-tin{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.shelf .hshelf{cursor:grab}' +
    '.nd-drag-src{opacity:.3}.nd-ghost{position:absolute;z-index:10;pointer-events:none;filter:drop-shadow(2px 4px 0 rgba(0,0,0,.55));transform:translateY(-3px) rotate(-6deg)}.nd-ghost .fbpx{width:100%;height:100%}' +
    '#nd-tin.nd-dragging{cursor:grabbing;z-index:10;filter:drop-shadow(2px 5px 0 rgba(0,0,0,.55))}';
  document.head.appendChild(css);

  /* every thing on a shelf is one item (.hshelf): the hosts' sets already are; Wei's cellar is a run of emoji, split here */
  function wrap(html, k, text) { const it = document.createElement('span'); it.className = 'hshelf'; it.dataset.k = k; if (text != null) it.textContent = text; else it.innerHTML = html; return it; }
  let sig = '';
  function itemize() {
    const sp = spans(); if (sp.length < 4 || sp.some(e => !e)) return;
    sp.forEach(e => {
      [...e.childNodes].forEach(n => {
        if (n.nodeType === 1 && n.classList.contains('hshelf')) return;
        if (n.nodeType === 3) {
          if (!/\S/.test(n.nodeValue)) return;
          const f = document.createDocumentFragment();
          (n.nodeValue.match(EM) || []).forEach(m => { const h = !emo() && window.FBWorld && FBWorld.px ? FBWorld.px(m) : ''; f.appendChild(h.indexOf('<') >= 0 ? wrap(h, 'e' + m) : wrap('', 'e' + m, m)); });
          n.replaceWith(f);
        } else if (n.nodeType === 1) n.replaceWith(wrap(n.outerHTML, 'p' + hash(n.outerHTML)));
      });
    });
    const all = sp.flatMap(e => [...e.querySelectorAll(':scope > .hshelf')]);
    if (!all.some(it => !it.dataset.sid)) return;
    const n = {}; all.forEach(it => { const k = it.dataset.k || '?'; n[k] = (n[k] || 0) + 1; it.dataset.sid = k + '#' + n[k]; });
    sig = hash(all.map(it => it.dataset.sid).sort().join('|'));
    const st = load()[sig]; if (!st) return;   /* put things back where they were moved to this visit */
    const by = {}; all.forEach(it => { by[it.dataset.sid] = it; });
    st.forEach((list, i) => (list || []).forEach(id => { if (by[id] && sp[i]) { sp[i].appendChild(by[id]); delete by[id]; } }));
  }
  function save() {
    const sp = spans(); if (sp.length < 4 || !sig) return;
    const o = load(); o[sig] = sp.map(e => e ? [...e.querySelectorAll(':scope > .hshelf')].map(it => it.dataset.sid) : []); keep(o);
  }
  let queued = 0;
  const later = () => { if (!queued) queued = setTimeout(() => { queued = 0; itemize(); }, 0); };
  rows().forEach(r => new MutationObserver(later).observe(r, { childList: true, subtree: true, characterData: true }));
  itemize(); setTimeout(itemize, 700);

  /* Popo's tin sits wherever it was put along a shelf */
  const tin = document.getElementById('nd-tin');
  function tinTo(pct, ri) {
    const r = rows()[ri]; if (!tin || !r) return;
    const sr = stage.getBoundingClientRect(), rr = r.getBoundingClientRect();
    tin.style.left = Math.max(1, Math.min(96, pct)) + '%'; tin.style.top = Math.round(rr.bottom - sr.top - tin.offsetHeight + 1) + 'px';
  }
  function tinBack() { const t = load().tin; if (t && tin) tinTo(t.l, t.r); }
  setTimeout(tinBack, 300); addEventListener('resize', tinBack);

  /* dragging */
  let d = null, just = 0;
  stage.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    const it = e.target.closest && e.target.closest('.shelf .hshelf, #nd-tin'); if (!it) return;
    d = { it, id: e.pointerId, x0: e.clientX, y0: e.clientY, on: false };
  });
  function nearRow(y) { let best = 0, bd = 1e9; rows().forEach((r, i) => { const b = r.getBoundingClientRect().bottom, dd = Math.abs(y - (b - 12)); if (dd < bd) { bd = dd; best = i; } }); return best; }
  function start() {
    d.on = true;
    if (d.it === tin) { tin.classList.add('nd-dragging'); return; }
    const r = d.it.getBoundingClientRect(), g = d.it.cloneNode(true); g.classList.add('nd-ghost'); g.classList.remove('nd-fid', 'hshelf'); g.removeAttribute('data-sid');
    g.style.width = r.width + 'px'; g.style.height = r.height + 'px'; stage.appendChild(g); d.g = g; d.w = r.width; d.h = r.height;
    d.it.classList.add('nd-drag-src');
  }
  function move(e) {
    const sr = stage.getBoundingClientRect(), ri = nearRow(e.clientY);
    if (d.it === tin) { tinTo((e.clientX - sr.left - tin.offsetWidth / 2) / sr.width * 100, ri); return; }
    d.g.style.left = (e.clientX - sr.left - d.w / 2) + 'px'; d.g.style.top = (e.clientY - sr.top - d.h * .8) + 'px';
    const sp = spans(), cand = ri === 0 ? [sp[0], sp[1]] : [sp[2], sp[3]];
    /* the nearest run of things on that shelf (an empty one sits at its end of the shelf), then the gap the finger is over */
    let span = cand[0], bd = 1e9;
    cand.forEach(s => { if (!s) return; const b = s.getBoundingClientRect(), dd = e.clientX < b.left ? b.left - e.clientX : e.clientX > b.right ? e.clientX - b.right : 0; if (dd < bd) { bd = dd; span = s; } });
    if (!span) return;
    const sibs = [...span.querySelectorAll(':scope > .hshelf')].filter(x => x !== d.it);
    const before = sibs.find(x => { const b = x.getBoundingClientRect(); return e.clientX < b.left + b.width / 2; }) || null;
    if (d.it.parentNode !== span || d.it.nextElementSibling !== before) span.insertBefore(d.it, before);
  }
  addEventListener('pointermove', e => {
    if (!d || e.pointerId !== d.id) return;
    if (!d.on) { const dx = e.clientX - d.x0, dy = e.clientY - d.y0; if (dx * dx + dy * dy < 64) return; start(); }
    e.preventDefault(); move(e);
  }, { passive: false });
  function end(e, cancel) {
    if (!d || (e && e.pointerId !== d.id)) return;
    const was = d; d = null; if (!was.on) return;
    just = Date.now();
    if (was.it === tin) {
      tin.classList.remove('nd-dragging');
      const sr = stage.getBoundingClientRect(), tr = tin.getBoundingClientRect(), o = load(); o.tin = { l: (tr.left - sr.left) / sr.width * 100, r: nearRow(tr.bottom) }; keep(o);
    } else { if (was.g) was.g.remove(); was.it.classList.remove('nd-drag-src'); save(); }
    if (!cancel) { try { SoundEngine.playBlip(0.7); } catch (x) {} }
    try { resetIdle(); } catch (x) {}
  }
  addEventListener('pointerup', e => end(e)); addEventListener('pointercancel', e => end(e, true));
  /* the tap that ends a drag is not a tap */
  addEventListener('click', e => { if (Date.now() - just < 450 && e.target && e.target.closest && e.target.closest('#stage-counter-box')) { e.stopPropagation(); e.preventDefault(); } }, true);
})();
