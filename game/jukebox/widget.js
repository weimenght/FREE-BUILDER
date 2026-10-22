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

  var css = "" +
    ".jbm{--h:30;position:relative;width:100%;max-width:340px;margin:0 auto;padding:22px 18px 16px;border-radius:170px 170px 26px 26px;background:linear-gradient(180deg,#5a2e1a,#3a1d10 40%,#2a140b);box-shadow:inset 0 2px 0 rgba(255,220,180,.25),inset 0 -8px 20px rgba(0,0,0,.5),0 30px 60px -24px rgba(0,0,0,.8);color:#fbeedd;font:500 13px/1.3 'Plus Jakarta Sans',system-ui,sans-serif;user-select:none;-webkit-user-select:none;isolation:isolate}" +
    ".jbm-ring{position:absolute;inset:6px;border-radius:164px 164px 22px 22px;padding:9px;background:conic-gradient(from 0deg,#ff5f6d,#ffc371,#fff27a,#7affc1,#5fd4ff,#b77bff,#ff5fd2,#ff5f6d);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:.85;filter:saturate(1.1) blur(.3px);animation:jbHue 9s linear infinite;pointer-events:none;z-index:-1}" +
    ".jbm.off .jbm-ring{opacity:.35;animation-duration:30s}" +
    "@keyframes jbHue{to{filter:hue-rotate(360deg) saturate(1.1) blur(.3px)}}" +
    ".jbm-tube{position:absolute;top:36%;bottom:72px;width:12px;border-radius:8px;background:linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,180,90,.35),rgba(255,255,255,.1));overflow:hidden;box-shadow:inset 0 0 6px rgba(0,0,0,.5)}" +
    ".jbm-tube.l{left:14px}.jbm-tube.r{right:14px}.jbm-tube i{position:absolute;left:3px;width:6px;height:6px;border-radius:50%;background:rgba(255,250,230,.85);animation:jbBub 3.2s linear infinite}" +
    "@keyframes jbBub{from{transform:translateY(240px)}to{transform:translateY(-20px)}}.jbm.off .jbm-tube i{animation-play-state:paused}" +
    ".jbm-glass{position:relative;margin:4px auto 0;width:78%;aspect-ratio:1.25;border-radius:120px 120px 14px 14px;background:radial-gradient(120% 90% at 50% 0%,#2b1f2e,#120c14 70%);box-shadow:inset 0 0 0 3px #c9a46a,inset 0 0 0 6px #6a4a2a,inset 0 10px 30px rgba(0,0,0,.8);overflow:hidden}" +
    ".jbm-glass:after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.16),transparent 35%,transparent 70%,rgba(255,255,255,.06));pointer-events:none}" +
    ".jbm-disc{position:absolute;left:50%;top:58%;width:62%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:repeating-radial-gradient(circle,#111 0 2px,#1d1d1d 2px 3px),#111;box-shadow:0 6px 16px rgba(0,0,0,.6),inset 0 0 0 2px #000}" +
    ".jbm-disc:before{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 20deg,transparent 0 40deg,rgba(255,255,255,.14) 55deg,transparent 70deg 210deg,rgba(255,255,255,.1) 225deg,transparent 240deg)}" +
    ".jbm-disc b{position:absolute;inset:32%;border-radius:50%;background:hsl(var(--h),70%,58%);box-shadow:inset 0 0 0 3px hsl(var(--h),60%,42%)}.jbm-disc b:after{content:'';position:absolute;inset:44%;border-radius:50%;background:#1a1a1a}" +
    ".jbm-disc.spin{animation:jbSpin 1.8s linear infinite}@keyframes jbSpin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}" +
    ".jbm-arm{position:absolute;right:9%;top:16%;width:6px;height:52%;border-radius:4px;background:linear-gradient(90deg,#d8d8d8,#8d8d8d);transform-origin:50% 4px;transform:rotate(-8deg);transition:transform .9s cubic-bezier(.5,0,.3,1)}" +
    ".jbm-arm:before{content:'';position:absolute;top:-6px;left:-6px;width:18px;height:18px;border-radius:50%;background:radial-gradient(#eee,#777)}.jbm-arm:after{content:'';position:absolute;bottom:-4px;left:-3px;width:12px;height:14px;border-radius:2px;background:#bbb}" +
    ".jbm.on .jbm-arm.down{transform:rotate(22deg)}.jbm-arm.down{transform:rotate(22deg)}" +
    ".jbm-card{margin:12px auto 0;width:86%;min-height:58px;padding:8px 10px;border-radius:8px;background:linear-gradient(#fdf6e6,#f1e3c4);color:#3a2214;text-align:center;box-shadow:inset 0 0 0 2px hsl(var(--h),55%,55%),0 4px 10px rgba(0,0,0,.4);transition:box-shadow .6s}" +
    ".jbm-card b{display:block;font:600 17px/1.15 'Fraunces','Cormorant Garamond',Georgia,'Songti SC',serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.jbm-card span{display:block;font-size:12px;color:#7a5236;margin-top:2px}" +
    ".jbm-card small{display:block;margin-top:3px;font-size:11px;color:#a0522d;min-height:14px}.jbm-card.fresh{animation:jbFresh 1.2s ease}@keyframes jbFresh{0%{transform:scale(.94);filter:brightness(1.4)}100%{transform:none}}" +
    ".jbm-low{display:flex;align-items:center;gap:12px;margin:14px 6px 0}" +
    ".jbm-spk{position:relative;flex:none;width:68px;height:68px;border-radius:50%;border:0;cursor:pointer;background:radial-gradient(circle,#2a1a10 0 30%,transparent 31%),repeating-radial-gradient(circle,#1b0f08 0 3px,#4a2c1a 3px 5px);box-shadow:inset 0 0 0 3px #c9a46a,0 4px 10px rgba(0,0,0,.5);color:#ffe6b0;font-size:22px;display:grid;place-items:center}" +
    ".jbm-spk:focus-visible,.jbm-sl:focus-visible,.jbm-coin:focus-visible{outline:2px solid #ffd27a;outline-offset:3px}" +
    ".jbm.off .jbm-spk:after{content:'';position:absolute;inset:-6px;border-radius:50%;border:2px solid rgba(255,210,122,.7);animation:jbPing 1.8s ease-out infinite}@keyframes jbPing{from{transform:scale(.9);opacity:1}to{transform:scale(1.25);opacity:0}}" +
    ".jbm-vu{flex:1;height:48px;border-radius:8px;background:#140b06;box-shadow:inset 0 0 0 2px #6a4a2a;display:block;width:100%}" +
    ".jbm-slot{flex:none;width:30px;height:48px;border-radius:6px;background:linear-gradient(#c9a46a,#8a6a3a);box-shadow:inset 0 0 0 2px #5a3a1a;position:relative}.jbm-slot:after{content:'';position:absolute;left:12px;top:10px;width:5px;height:28px;border-radius:3px;background:#1a0e06}" +
    ".jbm-next{display:flex;gap:6px;justify-content:center;margin-top:10px;min-height:24px;flex-wrap:wrap}.jbm-next span{display:inline-flex;align-items:center;gap:5px;max-width:46%;padding:3px 8px 3px 4px;border-radius:999px;background:rgba(255,230,190,.1);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".jbm-next i{flex:none;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle,hsl(var(--c),70%,60%) 0 30%,#111 32%)}" +
    ".jbs{margin:16px auto 0;max-width:720px;display:flex;gap:12px;overflow-x:auto;padding:14px 6px 10px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;scrollbar-width:thin}" +
    ".jbm-sl{position:relative;flex:none;width:96px;scroll-snap-align:start;border:0;padding:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;transition:transform .25s}" +
    ".jbm-sl svg{display:block;width:96px;height:96px;border-radius:4px;box-shadow:0 8px 16px -8px rgba(0,0,0,.7)}.jbm-sl .vin{position:absolute;top:6px;left:24px;width:84px;height:84px;border-radius:50%;background:repeating-radial-gradient(circle,#111 0 2px,#222 2px 3px);z-index:-1;transition:left .3s}" +
    ".jbm-sl:hover .vin,.jbm-sl.sel .vin{left:34px}.jbm-sl.sel{transform:translateY(-8px)}.jbm-sl b{display:block;margin-top:6px;font-size:12px;line-height:1.2;max-height:2.4em;overflow:hidden}.jbm-sl em{display:block;font-style:normal;font-size:11px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".jbm-sl.playing svg{box-shadow:0 0 0 2px #ffd27a,0 8px 16px -8px rgba(0,0,0,.7)}.jbm-sl.mine:before{content:'';position:absolute;top:-4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#ffd27a;box-shadow:0 0 8px #ffd27a;z-index:1}" +
    ".jbm-coin{position:absolute;left:50%;top:48px;transform:translate(-50%,-50%) scale(0);width:52px;height:52px;border-radius:50%;border:2px solid #fff3c4;background:radial-gradient(circle at 35% 30%,#fff6c8,#e6b43a 45%,#a8751a);color:#5a3a0a;font:800 20px/1 system-ui;cursor:pointer;box-shadow:0 6px 14px rgba(0,0,0,.5);transition:transform .25s cubic-bezier(.3,1.6,.5,1);z-index:2}" +
    ".jbm-sl.sel .jbm-coin{transform:translate(-50%,-50%) scale(1)}.jbm-x{position:absolute;top:-6px;right:-6px;width:24px;height:24px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:#2a1a10;color:#fbeedd;font-size:13px;line-height:1;cursor:pointer;z-index:2;display:none}.jbm-sl.sel .jbm-x{display:block}" +
    ".jbm-fly{position:fixed;z-index:9999;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff6c8,#e6b43a 45%,#a8751a);box-shadow:0 4px 10px rgba(0,0,0,.5);pointer-events:none;transition:transform .7s cubic-bezier(.5,-0.3,.6,1),opacity .2s .65s}" +
    ".jbm-toast{position:absolute;left:50%;bottom:-14px;transform:translate(-50%,100%);padding:6px 12px;border-radius:999px;background:#fbeedd;color:#3a2214;font-size:12px;white-space:nowrap;box-shadow:0 6px 14px rgba(0,0,0,.4);opacity:0;transition:opacity .3s;pointer-events:none;z-index:3}.jbm-toast.show{opacity:1}" +
    /* the corner jukebox in a venue */
    ".jbc{position:fixed;z-index:60;width:56px;height:72px;border:0;padding:0;background:none;cursor:pointer;filter:drop-shadow(0 8px 10px rgba(0,0,0,.45));transition:transform .2s}.jbc:hover{transform:translateY(-3px)}.jbc svg{width:100%;height:100%;display:block}" +
    ".jbc .glow{animation:jbHueS 6s linear infinite}@keyframes jbHueS{to{filter:hue-rotate(360deg)}}.jbc.quiet .glow{animation-duration:24s;opacity:.55}" +
    ".jbc .note{position:absolute;top:-8px;right:-6px;font-size:16px;opacity:0;transition:opacity .4s}.jbc.live .note{opacity:1;animation:jbNote 1.6s ease-in-out infinite}@keyframes jbNote{50%{transform:translateY(-6px) rotate(10deg)}}" +
    ".jbc-scrim{position:fixed;inset:0;z-index:9000;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;overflow-y:auto;padding:max(18px,env(safe-area-inset-top)) 12px 28px;background:rgba(12,6,3,.86);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);animation:jbIn .3s ease}" +
    "@keyframes jbIn{from{opacity:0}}.jbc-close{position:sticky;top:0;align-self:flex-end;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,220,170,.4);background:#2a1a10;color:#fbeedd;font-size:20px;cursor:pointer;z-index:2}" +
    ".jbc-make{display:inline-flex;align-items:center;gap:8px;margin:16px auto 0;padding:10px 16px;border-radius:999px;background:linear-gradient(135deg,#ffd27a,#f08a5d);color:#2a1205;font:700 14px 'Plus Jakarta Sans',system-ui,sans-serif;text-decoration:none;box-shadow:0 8px 20px -8px rgba(240,138,93,.8)}" +
    ".jbc-scrim .jbs{width:100%;color:#fbeedd}" +
    "@media (prefers-reduced-motion:reduce){.jbm-ring,.jbm-tube i,.jbm-disc.spin,.jbc .glow{animation:none}}";
  var st = el("style"); st.textContent = css; document.head.appendChild(st);

  /* a record sleeve shows its own tune: the melody as lights, the beat as a strip */
  function sleeve(code, title) {
    var s = JB.decode(code), h = JB.hue(code + title), dots = "";
    if (s) {
      for (var r = 0; r < JB.ROWS; r++) for (var c = 0; c < JB.STEPS; c++) if (s.mel[r][c]) dots += '<circle cx="' + (8 + c * 5.33).toFixed(1) + '" cy="' + (14 + r * 7.5) + '" r="2.6" fill="hsl(' + ((h + r * 18) % 360) + ',90%,78%)"/>';
      for (var d = 0; d < 3; d++) for (c = 0; c < JB.STEPS; c++) if (s.drum[d][c]) dots += '<rect x="' + (6.5 + c * 5.33).toFixed(1) + '" y="' + (78 + d * 4.5) + '" width="3.4" height="2.6" rx="1" fill="rgba(255,255,255,' + (0.75 - d * 0.18) + ')"/>';
    }
    var mood = s ? s.mood : 0, pats = ['<circle cx="80" cy="16" r="9" fill="rgba(255,240,180,.35)"/>', '<path d="M70 8l-3 9M80 6l-3 9M90 10l-3 9" stroke="rgba(200,230,255,.4)" stroke-width="1.5"/>', '<ellipse cx="82" cy="17" rx="7" ry="9" fill="rgba(255,120,90,.4)"/>', '<path d="M86 10a8 8 0 1 0 4 12a6 6 0 1 1-4-12z" fill="rgba(255,240,200,.35)"/>'];
    return '<svg viewBox="0 0 96 96" aria-hidden="true"><defs><linearGradient id="g' + h + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(' + h + ',55%,38%)"/><stop offset="1" stop-color="hsl(' + ((h + 40) % 360) + ',60%,22%)"/></linearGradient></defs><rect width="96" height="96" fill="url(#g' + h + ')"/>' + (pats[mood] || "") + dots + '<rect x="0" y="0" width="96" height="96" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="2"/></svg>';
  }

  var machines = [], venueMine = {}, recs = [];
  function venueOf(o) { return (o && o.venue) || (/\/game\/bar\//.test(location.pathname) ? "bar" : /\/game\/books\//.test(location.pathname) ? "books" : "studio"); }

  function mount(host, o) {
    o = o || {}; var venue = venueOf(o);
    var m = el("div", "jbm off", '<div class="jbm-ring"></div><div class="jbm-tube l">' + "<i></i>".repeat(4) + '</div><div class="jbm-tube r">' + "<i></i>".repeat(4) + '</div>' +
      '<div class="jbm-glass"><div class="jbm-disc"><b></b></div><div class="jbm-arm"></div></div>' +
      '<div class="jbm-card"><b>·</b><span></span><small></small></div>' +
      '<div class="jbm-low"><button type="button" class="jbm-spk" aria-label="Listen" data-jb-ia="listen">🔇</button><canvas class="jbm-vu" width="200" height="48"></canvas><div class="jbm-slot" aria-hidden="true"></div></div>' +
      '<div class="jbm-next" aria-live="polite"></div><div class="jbm-toast" role="status"></div>');
    var shelf = el("div", "jbs"); shelf.setAttribute("role", "list");
    host.appendChild(m); if (o.shelf !== false) host.appendChild(shelf);
    var M = { el: m, shelf: shelf, venue: venue, sel: null };
    machines.push(M);
    m.querySelector(".jbm-spk").addEventListener("click", function () { JB.listen(!JB.listening()); paintAll(); fire(); });
    drawVu(M);
    paint(M, JB.state()); fillShelf(M);
    return M;
  }
  function fire() { try { window.dispatchEvent(new CustomEvent("jukebox", { detail: { on: JB.listening() } })); } catch (e) {} }

  function paint(M, s) {
    var m = M.el, p = s.now, on = JB.listening();
    m.classList.toggle("off", !on); m.classList.toggle("on", on);
    var spk = m.querySelector(".jbm-spk"); spk.textContent = on ? "🔊" : "🔇"; spk.setAttribute("aria-pressed", on ? "true" : "false");
    var disc = m.querySelector(".jbm-disc"), arm = m.querySelector(".jbm-arm"), card = m.querySelector(".jbm-card");
    var key = p ? p.record_id + "@" + p.s : "";
    disc.classList.toggle("spin", !!p); arm.classList.toggle("down", !!p);
    if (p) m.style.setProperty("--h", JB.hue(p.song + p.title));
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
    var c = M.el.querySelector(".jbm-vu"), g = c.getContext("2d"), data = null, t0 = performance.now();
    (function loop() {
      if (!document.body.contains(c)) { if (M.dead) return; }
      var w = c.width, h = c.height, n = 14, a = JB.listening() ? JB.analyser() : null, p = JB.state().now;
      if (a && (!data || data.length !== a.frequencyBinCount)) data = new Uint8Array(a.frequencyBinCount);
      if (a) a.getByteFrequencyData(data);
      g.clearRect(0, 0, w, h);
      for (var i = 0; i < n; i++) {
        var v = a ? data[Math.min(data.length - 1, Math.floor(Math.pow(i / n, 1.6) * data.length * 0.7) + 1)] / 255 : (p ? 0.25 + 0.2 * Math.sin((performance.now() - t0) / 300 + i) : 0.05);
        var bw = (w - 16) / n, x = 8 + i * bw, segs = 7;
        for (var k = 0; k < segs; k++) {
          var lit = v * segs > k, y = h - 6 - k * ((h - 10) / segs);
          g.fillStyle = lit ? (k > 5 ? "#ff6b5b" : k > 3 ? "#ffd27a" : "#7dffb0") : "rgba(255,255,255,.06)";
          g.fillRect(x + 2, y - 3, bw - 4, 3.5);
        }
      }
      requestAnimationFrame(loop);
    })();
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
  function cornerSvg() {
    return '<svg viewBox="0 0 56 72" aria-hidden="true"><defs><linearGradient id="jbcw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a3e22"/><stop offset="1" stop-color="#3a1d10"/></linearGradient>' +
      '<linearGradient id="jbcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5f6d"/><stop offset=".3" stop-color="#ffc371"/><stop offset=".6" stop-color="#5fd4ff"/><stop offset="1" stop-color="#b77bff"/></linearGradient></defs>' +
      '<path d="M4 70V28a24 24 0 0 1 48 0v42z" fill="url(#jbcw)"/><path class="glow" d="M8 68V28a20 20 0 0 1 40 0v40" fill="none" stroke="url(#jbcg)" stroke-width="4"/>' +
      '<path d="M15 30a13 13 0 0 1 26 0v8H15z" fill="#1a1016" stroke="#c9a46a" stroke-width="1.5"/><circle cx="28" cy="33" r="6" fill="#111"/><circle cx="28" cy="33" r="2.2" fill="#ffb347"/>' +
      '<rect x="15" y="42" width="26" height="8" rx="2" fill="#f6ead0"/><circle cx="28" cy="59" r="6.5" fill="#2a1a10" stroke="#c9a46a" stroke-width="1.2"/><circle cx="28" cy="59" r="3" fill="none" stroke="#6a4a2a"/></svg><span class="note">♪</span>';
  }
  function corner(o) {
    o = o || {}; var venue = venueOf(o), b = el("button", "jbc quiet", cornerSvg());
    b.type = "button"; b.setAttribute("aria-label", "Jukebox"); b.setAttribute("data-jb-ia", "jukebox");
    var pos = o.pos || { right: "14px", bottom: "max(84px, calc(env(safe-area-inset-bottom) + 84px))" };
    for (var k in pos) b.style[k] = pos[k];
    if (o.dock) { b.style.position = "absolute"; b.style.zIndex = "5"; o.dock.appendChild(b); } else document.body.appendChild(b);
    var C = { el: b, venue: venue, o: o }; corners.push(C);
    b.addEventListener("click", function () { JB.unlock(); open(C); });
    JB.watch(); paintCorner(C);
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
