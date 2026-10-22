/* FREE//BUILDER Jukebox · the machine
   The same jukebox stands in the studio, in Wei's Bar and in the Dog-Eared Corner, and plays the same record at the same second.
   JBW.mount(el, {venue})  → the machine and its record shelf, inline (the studio)
   JBW.corner({venue, dock}) → a little jukebox in a venue; tap it and the machine opens
   Venues hear about it through a window event: "jukebox" {detail:{on:true|false}} — so their own music can step aside. */
(function () {
  "use strict";
  if (window.JBW || !window.JB) return;
  var JB = window.JB;
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var PX = "'Press Start 2P','Pixelify Sans',ui-monospace,monospace", VT = "'VT323','Pixelify Sans',ui-monospace,'PingFang SC','Microsoft YaHei',monospace";
  var css = "" +
    ".jbm{--h:30;position:relative;width:100%;max-width:340px;margin:0 auto;color:#fbeedd;font:400 20px/1.05 " + VT + ";user-select:none;-webkit-user-select:none;image-rendering:pixelated}" +
    ".jbm-px{display:block;width:100%;height:auto;image-rendering:pixelated;image-rendering:crisp-edges}" +
    ".jbm-body{position:relative;margin-top:-4px;padding:10px 12px 12px;background:#4a2412;border:4px solid #1a0c06;border-top:0;box-shadow:6px 6px 0 #000;background-image:repeating-conic-gradient(rgba(0,0,0,.18) 0 25%,transparent 0 50%);background-size:4px 4px}" +
    ".jbm-card{margin:0 auto;min-height:62px;padding:8px 10px 6px;background:#f6ead0;color:#2a1a0e;text-align:center;border:3px solid #000;box-shadow:inset -3px -3px 0 #d9c49a,inset 3px 3px 0 #fffaf0}" +
    ".jbm-card b{display:block;font:400 11px/1.5 " + PX + ";white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#2a1a0e}" +
    ".jbm-card span{display:block;font:400 18px/1 " + VT + ";color:#7a4a26;margin-top:2px}.jbm-card small{display:block;margin-top:2px;font:400 16px/1 " + VT + ";color:#b3261e;min-height:16px}" +
    ".jbm-card.fresh{animation:jbFresh .6s steps(4)}@keyframes jbFresh{0%{background:#fff}50%{background:#ffe680}}" +
    ".jbm-low{display:flex;align-items:stretch;gap:8px;margin-top:10px}" +
    ".jbm-spk{flex:none;width:56px;height:56px;border:3px solid #000;cursor:pointer;background:#2a1a10;background-image:repeating-conic-gradient(#1a0c06 0 25%,#5a3a22 0 50%);background-size:6px 6px;color:#ffe6b0;font-size:22px;display:grid;place-items:center;box-shadow:inset -3px -3px 0 rgba(0,0,0,.5),inset 3px 3px 0 rgba(255,220,170,.25);padding:0}" +
    ".jbm-spk:active{box-shadow:inset 3px 3px 0 rgba(0,0,0,.6)}" +
    ".jbm.off .jbm-spk{animation:jbBlink 1s steps(2) infinite}@keyframes jbBlink{50%{border-color:#ffd27a}}" +
    ".jbm-spk:focus-visible,.jbm-sl:focus-visible,.jbm-coin:focus-visible{outline:3px solid #ffd27a;outline-offset:2px}" +
    ".jbm-vu{flex:1;min-width:0;height:56px;background:#0d0705;border:3px solid #000;image-rendering:pixelated;display:block;width:100%}" +
    ".jbm-slot{flex:none;width:28px;border:3px solid #000;background:#c9a46a;position:relative;box-shadow:inset -3px -3px 0 #8a6a3a}.jbm-slot:after{content:'';position:absolute;left:8px;top:10px;width:6px;bottom:10px;background:#000}" +
    ".jbm-next{display:flex;gap:6px;justify-content:center;margin-top:10px;min-height:22px;flex-wrap:wrap}.jbm-next span{display:inline-flex;align-items:center;gap:6px;max-width:48%;padding:2px 8px 2px 4px;background:#1a0c06;border:2px solid #000;font:400 16px/1 " + VT + ";white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".jbm-next i{flex:none;width:10px;height:10px;background:hsl(var(--c),80%,60%);box-shadow:0 0 0 2px #000}" +
    ".jbs{margin:18px auto 0;max-width:720px;display:flex;gap:14px;overflow-x:auto;padding:16px 8px 12px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;scrollbar-width:thin}" +
    ".jbm-sl{position:relative;flex:none;width:96px;scroll-snap-align:start;border:0;padding:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;transition:transform .15s steps(3)}" +
    ".jbm-sl svg{display:block;width:96px;height:96px;border:3px solid #000;box-shadow:4px 4px 0 #000;image-rendering:pixelated;box-sizing:border-box}" +
    ".jbm-sl .vin{position:absolute;top:8px;left:26px;width:80px;height:80px;background:#111;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%);z-index:-1;transition:left .2s steps(3)}" +
    ".jbm-sl:hover .vin,.jbm-sl.sel .vin{left:38px}.jbm-sl.sel{transform:translateY(-8px)}.jbm-sl b{display:block;margin-top:8px;font:400 18px/1 " + VT + ";max-height:2em;overflow:hidden}.jbm-sl em{display:block;font:400 15px/1 " + VT + ";font-style:normal;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".jbm-sl.playing svg{border-color:#ffd27a}.jbm-sl.mine:before{content:'';position:absolute;top:-5px;left:-5px;width:10px;height:10px;background:#ffd27a;border:2px solid #000;z-index:1}" +
    ".jbm-coin{position:absolute;left:50%;top:48px;transform:translate(-50%,-50%) scale(0);width:48px;height:48px;border:3px solid #000;background:#ffd23f;color:#5a3a0a;font:400 14px/1 " + PX + ";cursor:pointer;clip-path:polygon(25% 0,75% 0,100% 25%,100% 75%,75% 100%,25% 100%,0 75%,0 25%);box-shadow:inset -4px -4px 0 #c08a10,inset 4px 4px 0 #fff3a8;transition:transform .2s steps(3);z-index:2;padding:0}" +
    ".jbm-sl.sel .jbm-coin{transform:translate(-50%,-50%) scale(1)}.jbm-x{position:absolute;top:-8px;right:-8px;width:24px;height:24px;border:2px solid #000;background:#b3261e;color:#fff;font:400 12px/1 " + PX + ";cursor:pointer;z-index:2;display:none;padding:0}.jbm-sl.sel .jbm-x{display:block}" +
    ".jbm-fly{position:fixed;z-index:9999;width:28px;height:28px;background:#ffd23f;border:3px solid #000;clip-path:polygon(25% 0,75% 0,100% 25%,100% 75%,75% 100%,25% 100%,0 75%,0 25%);pointer-events:none;transition:transform .6s steps(8),opacity .1s .55s}" +
    ".jbm-toast{position:absolute;left:50%;bottom:-12px;transform:translate(-50%,100%);padding:6px 10px;background:#f6ead0;color:#2a1a0e;border:3px solid #000;box-shadow:4px 4px 0 #000;font:400 18px/1 " + VT + ";white-space:nowrap;opacity:0;pointer-events:none;z-index:3}.jbm-toast.show{opacity:1}" +
    ".jbc{position:fixed;z-index:60;width:40px;height:52px;border:0;padding:0;background:none;cursor:pointer;filter:drop-shadow(3px 3px 0 #000);image-rendering:pixelated}.jbc:hover{transform:translateY(-2px)}.jbc canvas{width:100%;height:100%;display:block;image-rendering:pixelated;image-rendering:crisp-edges}" +
    ".jbc .note{position:absolute;top:-12px;right:-8px;font:400 10px/1 " + PX + ";color:#ffd27a;text-shadow:2px 2px 0 #000;opacity:0}.jbc.live .note{opacity:1;animation:jbNote 1s steps(2) infinite}@keyframes jbNote{50%{transform:translateY(-4px)}}" +
    ".jbc-scrim{position:fixed;inset:0;z-index:9000;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;overflow-y:auto;padding:max(18px,env(safe-area-inset-top)) 12px 28px;background:rgba(12,6,3,.9);background-image:repeating-conic-gradient(rgba(0,0,0,.35) 0 25%,transparent 0 50%);background-size:4px 4px}" +
    ".jbc-close{position:sticky;top:0;align-self:flex-end;width:44px;height:44px;border:3px solid #000;background:#b3261e;color:#fff;font:400 14px/1 " + PX + ";cursor:pointer;z-index:2;box-shadow:3px 3px 0 #000;padding:0}" +
    ".jbc-make{display:inline-flex;align-items:center;gap:8px;margin:18px auto 0;padding:12px 14px;background:#ffd27a;color:#2a1205;border:3px solid #000;box-shadow:4px 4px 0 #000;font:400 10px/1.4 " + PX + ";text-decoration:none}.jbc-make:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #000}" +
    ".jbc-scrim .jbs{width:100%;color:#fbeedd}" +
    "@media (prefers-reduced-motion:reduce){.jbm.off .jbm-spk,.jbc.live .note{animation:none}}";
  var st = el("style"); st.textContent = css; document.head.appendChild(st);

  /* a record sleeve shows its own tune: the melody as lights, the beat as a strip */
  function sleeve(code, title) {
    var s = JB.decode(code), h = JB.hue(code + title), dots = "";
    if (s) {
      for (var r = 0; r < JB.ROWS; r++) for (var c = 0; c < JB.STEPS; c++) if (s.mel[r][c]) dots += '<rect x="' + (6 + c * 5) + '" y="' + (12 + r * 7) + '" width="4" height="4" fill="hsl(' + ((h + r * 18) % 360) + ',90%,72%)"/>';
      for (var d = 0; d < 3; d++) for (c = 0; c < JB.STEPS; c++) if (s.drum[d][c]) dots += '<rect x="' + (6 + c * 5) + '" y="' + (76 + d * 5) + '" width="4" height="3" fill="rgba(255,255,255,' + (0.75 - d * 0.18) + ')"/>';
    }
    var mood = s ? s.mood : 0, pats = ['<rect x="76" y="8" width="12" height="12" fill="rgba(255,240,180,.45)"/><rect x="72" y="12" width="20" height="4" fill="rgba(255,240,180,.3)"/>', '<rect x="70" y="6" width="2" height="6" fill="rgba(200,230,255,.5)"/><rect x="80" y="4" width="2" height="6" fill="rgba(200,230,255,.5)"/><rect x="88" y="8" width="2" height="6" fill="rgba(200,230,255,.5)"/>', '<rect x="78" y="8" width="10" height="14" fill="rgba(255,120,90,.5)"/><rect x="80" y="6" width="6" height="2" fill="rgba(255,220,120,.6)"/>', '<rect x="80" y="6" width="8" height="12" fill="rgba(255,240,200,.45)"/><rect x="84" y="8" width="6" height="8" fill="url(#g' + h + ')"/>'];
    return '<svg viewBox="0 0 96 96" shape-rendering="crispEdges" aria-hidden="true"><defs><pattern id="g' + h + '" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="hsl(' + h + ',50%,32%)"/><rect width="2" height="2" fill="hsl(' + ((h + 40) % 360) + ',55%,26%)"/><rect x="2" y="2" width="2" height="2" fill="hsl(' + ((h + 40) % 360) + ',55%,26%)"/></pattern></defs><rect width="96" height="96" fill="url(#g' + h + ')"/>' + (pats[mood] || "") + dots + '<rect x="0" y="0" width="96" height="96" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="2"/></svg>';
  }

  var machines = [], venueMine = {}, recs = [];
  function venueOf(o) { return (o && o.venue) || (/\/game\/bar\//.test(location.pathname) ? "bar" : /\/game\/books\//.test(location.pathname) ? "books" : "studio"); }

  function mount(host, o) {
    o = o || {}; var venue = venueOf(o);
    var m = el("div", "jbm off", '<canvas class="jbm-px" width="80" height="62" aria-hidden="true"></canvas><div class="jbm-body">' +
      '<div class="jbm-card"><b>·</b><span></span><small></small></div>' +
      '<div class="jbm-low"><button type="button" class="jbm-spk" aria-label="Listen" data-jb-ia="listen">🔇</button><canvas class="jbm-vu" width="48" height="18"></canvas><div class="jbm-slot" aria-hidden="true"></div></div>' +
      '<div class="jbm-next" aria-live="polite"></div><div class="jbm-toast" role="status"></div></div>');
    var shelf = el("div", "jbs"); shelf.setAttribute("role", "list");
    host.appendChild(m); if (o.shelf !== false) host.appendChild(shelf);
    var M = { el: m, shelf: shelf, venue: venue, sel: null };
    machines.push(M);
    m.querySelector(".jbm-spk").addEventListener("click", function () { JB.listen(!JB.listening()); paintAll(); fire(); });
    drawVu(M); cabinet(M);
    paint(M, JB.state()); fillShelf(M);
    return M;
  }
  function fire() { try { window.dispatchEvent(new CustomEvent("jukebox", { detail: { on: JB.listening() } })); } catch (e) {} }

  function paint(M, s) {
    var m = M.el, p = s.now, on = JB.listening();
    m.classList.toggle("off", !on); m.classList.toggle("on", on);
    var spk = m.querySelector(".jbm-spk"); spk.textContent = on ? "🔊" : "🔇"; spk.setAttribute("aria-pressed", on ? "true" : "false");
    var card = m.querySelector(".jbm-card");
    var key = p ? p.record_id + "@" + p.s : "";
    M.playing = !!p; if (p) M.h = JB.hue(p.song + p.title);
    if (M.key !== key) {
      M.key = key;
      card.querySelector("b").textContent = p ? p.title : "· · ·";
      card.querySelector("span").textContent = p ? (p.house ? "♪ " + p.name : JB.w("by", { n: p.name })) : "";
      card.querySelector("small").textContent = p && p.venue ? "📍 " + JB.where(p) : "";
      card.classList.remove("fresh"); void card.offsetWidth; if (p) card.classList.add("fresh");
    }
    var nx = m.querySelector(".jbm-next"); nx.innerHTML = "";
    s.next.filter(function (q) { return q.queued; }).slice(0, 3).forEach(function (q) { var e = el("span", "", '<i style="--c:' + JB.hue(q.song + q.title) + '"></i>' + esc(q.title)); e.title = JB.w("next") + " · " + q.title + (q.venue ? " · " + JB.where(q) : ""); nx.appendChild(e); });
    M.shelf.querySelectorAll(".jbm-sl").forEach(function (b) { b.classList.toggle("playing", !!p && b.getAttribute("data-id") === p.record_id); });
  }
  function paintAll() { var s = JB.state(); machines.forEach(function (M) { paint(M, s); }); corners.forEach(paintCorner); }
  JB.onChange(function () { paintAll(); });

  function drawVu(M) {
    var c = M.el.querySelector(".jbm-vu"), g = c.getContext("2d"), data = null, t0 = performance.now(), last = 0;
    (function loop(now) {
      if (M.dead) return; requestAnimationFrame(loop); if (now - last < 66) return; last = now;
      var a = JB.listening() ? JB.analyser() : null, p = JB.state().now, n = 12, segs = 5;
      if (a && (!data || data.length !== a.frequencyBinCount)) data = new Uint8Array(a.frequencyBinCount);
      if (a) a.getByteFrequencyData(data);
      g.fillStyle = "#0d0705"; g.fillRect(0, 0, 48, 18);
      for (var i = 0; i < n; i++) {
        var v = a ? data[Math.min(data.length - 1, Math.floor(Math.pow(i / n, 1.6) * data.length * 0.7) + 1)] / 255 : (p ? 0.3 + 0.25 * Math.sin((now - t0) / 260 + i * 1.3) : 0.04);
        for (var k = 0; k < segs; k++) { g.fillStyle = v * segs > k ? (k > 3 ? "#ff5a4a" : k > 2 ? "#ffd27a" : "#5dff8a") : "#241612"; g.fillRect(1 + i * 4, 15 - k * 3, 3, 2); }
      }
    })(0);
  }

  /* the cabinet, drawn as pixel art at 80×62 and scaled up */
  var RING = ["#ff5f6d", "#ffa94d", "#fff27a", "#7affc1", "#5fd4ff", "#8f7bff", "#ff5fd2", "#ff8fa0"];
  function hsl(h, s, l) { return "hsl(" + h + "," + s + "%," + l + "%)"; }
  function arch(W, H, top, y) { var r = top; if (y >= r) return W / 2; var d = (r - y) / r; return Math.round(W / 2 * Math.sqrt(Math.max(0, 1 - d * d))); }
  function paintCab(g, W, H, f, on, playing, h, mini) {
    g.clearRect(0, 0, W, H);
    var cx = W / 2, top = Math.round(W * 0.38), ringW = mini ? 1 : 3, base = H - (mini ? 3 : 6);
    for (var y = 0; y < H; y++) {
      var half = arch(W, H, top, y); if (half <= 0) continue;
      for (var x = cx - half; x < cx + half; x++) {
        var edge = Math.min(x - (cx - half), cx + half - 1 - x), col;
        var halfUp = y > 0 ? arch(W, H, top, y - 1) : 0, topEdge = y < ringW || halfUp < Math.abs(x + 0.5 - cx) + 0.5;
        if (edge < ringW || topEdge) { var ci = Math.floor((x + y) / (mini ? 2 : 4) + (on ? f : f / 4)) % RING.length; col = on ? RING[ci] : (ci % 2 ? "#5a3a2a" : "#6a4a32"); }
        else if (y >= base) col = (x + y) % 2 ? "#2a140b" : "#331a0e";
        else col = (x * 3 + y * 7) % 11 === 0 ? "#6b3620" : "#7a3e22";
        g.fillStyle = col; g.fillRect(x, y, 1, 1);
      }
    }
    /* the glass and the record */
    var gi = mini ? 3 : 8, gtop = mini ? 3 : 7, gb = Math.round(H * (mini ? 0.62 : 0.78));
    for (y = gtop; y < gb; y++) { var gh = arch(W - gi * 2, H, top - gtop, y - gtop); if (gh <= 0) continue; g.fillStyle = y === gtop || gh < 2 ? "#c9a46a" : (y < gtop + 3 ? "#2b1f2e" : "#170f15"); g.fillRect(cx - gh, y, gh * 2, 1); g.fillStyle = "#c9a46a"; g.fillRect(cx - gh, y, 1, 1); g.fillRect(cx + gh - 1, y, 1, 1); }
    g.fillStyle = "#c9a46a"; g.fillRect(cx - (W / 2 - gi), gb, W - gi * 2, 1);
    var dx = cx, dy = Math.round(gb - (mini ? 4 : 13)), R = mini ? 3.5 : 12, th = playing ? f * 0.55 : 0.6;
    for (y = -R; y <= R; y++) for (x = -R; x <= R; x++) {
      var d = Math.sqrt(x * x + y * y); if (d > R) continue;
      var an = Math.atan2(y, x), shine = Math.abs(((an - th) % Math.PI + Math.PI * 1.5) % Math.PI - Math.PI / 2) < 0.07 && d > R * 0.45;
      g.fillStyle = d < R * 0.12 ? "#000" : d < R * 0.38 ? hsl(h, 75, d < R * 0.25 ? 62 : 50) : shine ? "#3c3c3c" : (Math.floor(d) % 2 ? "#141414" : "#202020");
      g.fillRect(dx + x, dy + y, 1, 1);
    }
    if (!mini) { /* tone arm */
      var px0 = cx + 26, py0 = gtop + 8, ex = playing ? cx + 10 : cx + 28, ey = playing ? dy - 4 : dy + 6, steps = 24;
      g.fillStyle = "#d8d8d8"; for (var i = 0; i <= steps; i++) { var t = i / steps; g.fillRect(Math.round(px0 + (ex - px0) * t), Math.round(py0 + (ey - py0) * t), 2, 1); }
      g.fillStyle = "#f2f2f2"; g.fillRect(px0 - 1, py0 - 1, 3, 3); g.fillStyle = "#aaa"; g.fillRect(ex - 1, ey, 3, 3);
      /* bubble tubes */
      [[5, 1], [W - 8, -1]].forEach(function (tb) { for (var yy = top + 2; yy < base - 2; yy++) { g.fillStyle = on ? "#d0904a" : "#7a5030"; g.fillRect(tb[0], yy, 3, 1); }
        if (on) for (var b = 0; b < 3; b++) { var by = base - 3 - ((f * 1.5 + b * 9 + tb[0]) % (base - top - 5)); g.fillStyle = "#fff6d8"; g.fillRect(tb[0] + 1, Math.round(by), 1, 1); } });
      /* the speaker grille under the glass */
      for (y = gb + 2; y < base - 1; y += 2) for (x = cx - 18; x < cx + 18; x += 2) { g.fillStyle = "#3a1c0e"; g.fillRect(x, y, 1, 1); }
    }
  }
  function cabinet(M) {
    var c = M.el.querySelector(".jbm-px"), g = c.getContext("2d"), f = 0, last = 0;
    (function loop(now) { if (M.dead) return; requestAnimationFrame(loop); if (now - last < 83) return; last = now; f++;
      paintCab(g, c.width, c.height, f, JB.listening(), !!M.playing, M.h || 30, false); })(0);
  }

  /* ---------------- the record shelf ---------------- */
  var mineIds = {}, loaded = null;
  function load(force) {
    if (loaded && !force) return loaded;
    loaded = Promise.all([JB.records(80), JB.mine()]).then(function (r) { recs = r[0]; mineIds = {}; r[1].forEach(function (id) { mineIds[id] = 1; }); return recs; });
    return loaded;
  }
  function fillShelf(M, highlight) {
    load().then(function () {
      var sh = M.shelf; sh.innerHTML = "";
      recs.forEach(function (r) {
        var b = el("div", "jbm-sl" + (mineIds[r.id] ? " mine" : ""), '<span class="vin"></span>' + sleeve(r.song, r.title) + '<b></b><em></em><button type="button" class="jbm-coin" aria-label="Play for everyone" data-jb-ia="coin">🪙</button>' + (mineIds[r.id] ? '<button type="button" class="jbm-x" aria-label="Take out" data-jb-ia="out">×</button>' : ""));
        b.setAttribute("data-id", r.id); b.setAttribute("role", "listitem"); b.tabIndex = 0;
        b.querySelector("b").textContent = r.title; b.querySelector("em").textContent = r.house ? "♪ " + r.name : r.name;
        b.style.setProperty("--h", JB.hue(r.song + r.title));
        b.addEventListener("click", function (e) {
          if (e.target.closest(".jbm-coin")) { coin(M, r, e.target); return; }
          if (e.target.closest(".jbm-x")) { takeOut(M, r); return; }
          var was = b.classList.contains("sel"); sh.querySelectorAll(".sel").forEach(function (x) { x.classList.remove("sel"); }); if (!was) b.classList.add("sel");
          if (!was) { JB.unlock(); var s = JB.decode(r.song); if (s && !JB.listening()) { for (var rr = JB.ROWS - 1; rr >= 0; rr--) if (s.mel[rr].indexOf(true) >= 0) { JB.note(s.inst, JB.rowNote(s.mood, rr), 0.5); break; } } }
        });
        b.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target === b) b.click(); });
        sh.appendChild(b);
        if (highlight && highlight === r.id) { b.classList.add("sel"); setTimeout(function () { b.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); }, 60); }
      });
      paint(M, JB.state());
    });
  }
  function toast(M, msg) { var t = M.el.querySelector(".jbm-toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(M.tt); M.tt = setTimeout(function () { t.classList.remove("show"); }, 2600); }
  function coin(M, r, btn) {
    JB.unlock();
    var a = btn.getBoundingClientRect(), slot = M.el.querySelector(".jbm-slot").getBoundingClientRect(), f = el("div", "jbm-fly");
    f.style.left = (a.left + a.width / 2 - 17) + "px"; f.style.top = (a.top + a.height / 2 - 17) + "px"; document.body.appendChild(f);
    requestAnimationFrame(function () { f.style.transform = "translate(" + (slot.left + slot.width / 2 - a.left - a.width / 2) + "px," + (slot.top + 14 - a.top - a.height / 2) + "px) scale(.5) rotateY(80deg)"; f.style.opacity = "0"; });
    setTimeout(function () { f.remove(); try { var c = JB.audio(), o = c.createOscillator(), g = c.createGain(); o.type = "triangle"; o.frequency.setValueAtTime(2200, c.currentTime); o.frequency.setValueAtTime(1650, c.currentTime + .08); g.gain.setValueAtTime(.12, c.currentTime); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .35); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + .4); } catch (e) {} }, 700);
    btn.closest(".jbm-sl").classList.remove("sel");
    JB.spin(r.id, M.venue).then(function () { toast(M, JB.w("queued")); if (!JB.listening()) { JB.listen(true); fire(); } paintAll(); })
      .catch(function (e) { var s = String(e && e.message || e); toast(M, /full/.test(s) ? JB.w("full") : /fast|three/.test(s) ? JB.w("fast") : JB.w("away")); });
  }
  function takeOut(M, r) {
    JB.hide(r.id).then(function () { delete mineIds[r.id]; recs = recs.filter(function (x) { return x.id !== r.id; }); machines.forEach(function (m) { fillShelf(m); }); }).catch(function () {});
  }
  function refresh(highlight) { loaded = null; machines.forEach(function (m) { fillShelf(m, highlight); }); }

  /* ---------------- the jukebox in a corner of a venue ---------------- */
  var corners = [];
  function corner(o) {
    o = o || {}; var venue = venueOf(o), b = el("button", "jbc quiet", '<canvas width="20" height="26" aria-hidden="true"></canvas><span class="note">♪</span>');
    b.type = "button"; b.setAttribute("aria-label", "Jukebox"); b.setAttribute("data-jb-ia", "jukebox");
    var pos = o.pos || { right: "14px", bottom: "max(84px, calc(env(safe-area-inset-bottom) + 84px))" };
    for (var k in pos) b.style[k] = pos[k];
    if (o.dock) { b.style.position = "absolute"; b.style.zIndex = "5"; o.dock.appendChild(b); } else document.body.appendChild(b);
    var C = { el: b, venue: venue, o: o }; corners.push(C);
    b.addEventListener("click", function () { JB.unlock(); open(C); });
    JB.watch(); paintCorner(C);
    var cv = b.querySelector("canvas"), cg = cv.getContext("2d"), f = 0, last = 0;
    (function loop(now) { requestAnimationFrame(loop); if (now - last < 120) return; last = now; f++; var st = JB.state(); paintCab(cg, 20, 26, f, JB.listening() || !!(st.now && st.now.queued), !!st.now, st.now ? JB.hue(st.now.song + st.now.title) : 30, true); })(0);
    return C;
  }
  function paintCorner(C) { var s = JB.state(), live = !!(s.now && (JB.listening() || s.now.queued)); C.el.classList.toggle("live", live); C.el.classList.toggle("quiet", !JB.listening()); }
  function open(C) {
    var sc = el("div", "jbc-scrim"); sc.setAttribute("role", "dialog"); sc.setAttribute("aria-label", "Jukebox");
    var x = el("button", "jbc-close", "×"); x.type = "button"; x.setAttribute("aria-label", "Close");
    sc.appendChild(x); document.body.appendChild(sc);
    var M = mount(sc, { venue: C.venue });
    var make = el("a", "jbc-make", '<span aria-hidden="true">🎛️</span><span data-jb-t="make"></span>'); make.href = C.o.studio || "/game/jukebox/"; make.target = "_top";
    make.querySelector("[data-jb-t]").textContent = JB.w("make"); sc.appendChild(make);
    if (!JB.listening()) { JB.listen(true); fire(); paintAll(); }
    function close() { M.dead = true; machines.splice(machines.indexOf(M), 1); sc.remove(); document.removeEventListener("keydown", esc1); paintAll(); }
    function esc1(e) { if (e.key === "Escape") close(); }
    x.addEventListener("click", close); sc.addEventListener("click", function (e) { if (e.target === sc) close(); }); document.addEventListener("keydown", esc1);
    x.focus();
  }

  window.JBW = { mount: mount, corner: corner, refresh: refresh, sleeve: sleeve, paint: paintAll, fire: fire };
})();
