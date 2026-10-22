/* Sleeper Car No. 04 — the cabin layer.
   - Board with one tap; the journey then drives itself: hours pass, weather drifts, tunnels open onto
     new landscapes, stations come and go. You just look out of the window.
   - The glass is the interface: drag to wipe the fog, hold to write on it, double-tap to knock.
   - Share the cabin: friends who open the link sit in the same car and see the same window, live.
     Seat lights show who's aboard, notes on the glass and knocks reach everyone.
     Nothing is stored anywhere: the cabin exists only while someone is in it.
   Uses the engine's own globals (state, setBiome, setWeather, …) and FREE//BUILDER's shared Realtime relay. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var T = {   /* every word the cabin layer shows */
    board: "Board", quiet: "board quietly", lead: "A sleeper car through cities, mountains and sea. Nothing to do but look out of the window.",
    saved: "A friend saved you a seat in cabin", tip: "Drag to wipe the glass · hold to write · double-tap to knock",
    share: "Share this cabin", shareLead: "Friends who open this link sit in your car and see the same window, live. No names, nothing saved: the cabin disappears when everyone leaves.",
    copy: "Copy link", copied: "Link copied", close: "Close", leave: "Leave the shared cabin", alone: "Just you in this car",
    aboard: "{n} aboard", joined: "Someone boarded", left: "Someone stepped off", knock: "knock knock", write: "Write on the glass…",
    sound: "Sound", controls: "All controls", connecting: "Joining the cabin…", lost: "Lost the cabin's signal — retrying", host: "You're steering the journey",
    tunnelOut: "Out of the tunnel —", pass: "An express train thunders past", star: "A shooting star — make a wish", rainIn: "Rain on the glass", fogIn: "Fog rolls in", snowIn: "Snow begins to fall", clearIn: "The sky clears"
  };
  var cfg = { url: "", key: "", rt: "" };
  var S = { boarded: false, code: "", tx: null, me: rid(), joined: Date.now(), peers: {}, notes: {}, lastSync: 0, net: "" };
  function rid() { return Math.random().toString(36).slice(2, 10); }
  function toast(m) { try { showWindowToast(m); } catch (e) {} }

  /* ---------- look & feel ---------- */
  var css = "#sanctuaryWelcomeOverlay,#zenFloatingControls,#portraitBanner{display:none!important}" +
    "body.cb-on.zen-mode #footerBar,body.cb-on.zen-mode #glassWipePill,body.cb-on.zen-mode #windowLatchBtn,body.cb-on.zen-mode #shadeDragHandle span{display:none!important}" +
    "body.cb-on.zen-mode>header,body.cb-on.zen-mode header.zen-hidable{display:none!important}" +
    "body.cb-on.zen-mode .windowsill-ledge>*{display:none!important}body.cb-on.zen-mode .windowsill-ledge{min-height:16px;padding:0!important}" +
    "body.cb-on.zen-mode .window-viewport-sizing{height:calc(100dvh - 112px)!important}body.cb-on.zen-mode #glassWhisperContainer{opacity:.7}" +
    ".cb-board{position:fixed;inset:0;z-index:80;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 40%,rgba(40,24,14,.55),rgba(8,6,5,.92));color:#f5e6c8;font-family:Georgia,'Songti SC',serif;text-align:center;padding:24px;transition:opacity .8s}" +
    ".cb-board h1{font-size:clamp(28px,6vw,52px);font-weight:400;letter-spacing:.02em;margin:0 0 10px}.cb-board p{max-width:30rem;margin:0 auto 26px;line-height:1.6;opacity:.82;font-size:16px}" +
    ".cb-board small{display:block;font:11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;opacity:.6;margin-bottom:14px}" +
    ".cb-go{font:600 16px/1 system-ui,-apple-system,sans-serif;padding:16px 34px;border-radius:999px;border:1px solid rgba(245,230,200,.5);background:#f5e6c8;color:#2a1a10;cursor:pointer}" +
    ".cb-q{display:block;margin:16px auto 0;background:none;border:0;color:inherit;opacity:.6;font:13px system-ui,sans-serif;text-decoration:underline;cursor:pointer}" +
    ".cb-dock{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:6px;padding:6px;border-radius:999px;background:rgba(20,12,8,.42);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,230,190,.14);transition:opacity .6s}" +
    ".cb-dock.idle{opacity:.12}.cb-dock button{width:38px;height:38px;border-radius:50%;border:0;background:transparent;color:#f5e6c8;font-size:16px;cursor:pointer;display:grid;place-items:center}.cb-dock button:hover,.cb-dock button:focus-visible{background:rgba(255,230,190,.14);outline:none}" +
    ".cb-seats{display:flex;gap:4px;padding:0 6px}.cb-seat{width:8px;height:8px;border-radius:50%;background:#f5c27a;box-shadow:0 0 8px #f5c27a;opacity:.85}.cb-seat.me{background:#fff;box-shadow:0 0 8px #fff}" +
    ".cb-tip{position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:55;color:#f5e6c8;font:12px/1.4 system-ui,sans-serif;letter-spacing:.02em;opacity:0;transition:opacity 1.2s;pointer-events:none;text-shadow:0 1px 6px #000;white-space:nowrap}.cb-tip.on{opacity:.8}" +
    ".cb-note{position:absolute;z-index:6;max-width:46%;transform:translate(-50%,-50%) rotate(-3deg);font:italic 22px/1.2 'Segoe Print','Bradley Hand','Comic Sans MS',cursive;color:rgba(255,255,255,.78);text-shadow:0 0 6px rgba(255,255,255,.35),0 0 1px rgba(0,0,0,.6);pointer-events:none;transition:opacity 4s;white-space:pre-wrap;text-align:center}" +
    ".cb-ink{position:absolute;z-index:7;transform:translate(-50%,-50%);width:min(70%,22rem)}.cb-ink input{width:100%;font:italic 20px 'Segoe Print','Bradley Hand',cursive;background:rgba(255,255,255,.08);border:1px dashed rgba(255,255,255,.5);color:#fff;border-radius:10px;padding:8px 12px;outline:none}" +
    ".cb-ring{position:absolute;z-index:7;width:14px;height:14px;margin:-7px 0 0 -7px;border:2px solid rgba(255,255,255,.8);border-radius:50%;pointer-events:none;animation:cbRing 1s ease-out forwards}@keyframes cbRing{to{transform:scale(7);opacity:0}}" +
    ".cb-sheet{position:fixed;inset:0;z-index:90;display:grid;place-items:center;background:rgba(8,6,5,.6);padding:16px}.cb-card{width:min(26rem,100%);background:#f8efe0;color:#2a1a10;border-radius:22px;padding:22px;font:15px/1.55 system-ui,-apple-system,sans-serif;box-shadow:0 30px 80px -30px #000}" +
    ".cb-card h2{font:400 24px Georgia,serif;margin:0 0 8px}.cb-card .code{font:600 30px/1 ui-monospace,Menlo,monospace;letter-spacing:.3em;margin:14px 0;text-align:center}.cb-card .row{display:flex;gap:8px;margin-top:14px}.cb-card button{flex:1;min-height:44px;border-radius:999px;border:1.5px solid #2a1a10;background:transparent;font:600 14px system-ui,sans-serif;cursor:pointer;color:inherit}.cb-card button.pri{background:#2a1a10;color:#f8efe0}.cb-card .mut{font-size:13px;opacity:.7}" +
    ".cb-rotate{display:none}@media (orientation:portrait) and (max-width:820px){.cb-rotate{position:fixed;inset:0;z-index:95;display:grid;place-items:center;text-align:center;padding:32px;background:rgba(10,7,5,.94);color:#f5e6c8;font:16px/1.6 Georgia,serif}.cb-rotate b{display:block;font-size:44px;margin-bottom:12px;animation:cbTurn 2.4s ease-in-out infinite}}" +
    "@keyframes cbTurn{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(90deg)}}" +
    "@media (prefers-color-scheme:dark){.cb-card{background:#1f1915;color:#f2e8d8}.cb-card button{border-color:#f2e8d8}.cb-card button.pri{background:#f2e8d8;color:#1f1915}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- boarding ---------- */
  var qs = new URLSearchParams(location.search), invite = (qs.get("cabin") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  function boardCard() {
    var d = document.createElement("div"); d.className = "cb-board";
    d.innerHTML = '<div><small>Sleeper Car No. 04</small><h1>' + (invite ? T.saved + " " + invite : "Train Window") + '</h1><p>' + T.lead + '</p>' +
      '<button class="cb-go" type="button">🎧 ' + T.board + '</button><button class="cb-q" type="button">' + T.quiet + '</button></div>';
    document.body.appendChild(d);
    var go = function (sound) {
      d.style.opacity = "0"; setTimeout(function () { d.remove(); }, 800);
      try { if (sound && !isAudioPlaying) toggleAudioEngine(); } catch (e) {}
      boarded();
    };
    d.querySelector(".cb-go").onclick = function () { go(true); };
    d.querySelector(".cb-q").onclick = function () { go(false); };
  }
  /* fill the screen: the window takes whatever height is left, on any landscape screen */
  function fit() {
    if (!document.body.classList.contains("cb-on")) return;
    var el = $("windowViewport"); if (!el) return;
    var bezel = el.closest(".window-bezel") || el.parentElement;
    var chrome = bezel.getBoundingClientRect().height - el.getBoundingClientRect().height;   /* frame + sill around the glass */
    var h = Math.min(innerHeight - chrome - 20, el.getBoundingClientRect().width * 0.56);   /* fill the height, but stay a wide window */
    el.style.setProperty("height", Math.max(170, Math.round(h)) + "px", "important");
    setTimeout(function () { try { resizeCanvas(); } catch (e) {} }, 60);
  }
  addEventListener("resize", function () { clearTimeout(fit.t); fit.t = setTimeout(fit, 120); });
  addEventListener("orientationchange", function () { setTimeout(fit, 300); });
  function boarded() {
    S.boarded = true;
    document.body.classList.add("cb-on");
    try { if (!state.zenMode) { toggleZenMode(); var wt = $("windowToast"); if (wt) wt.style.opacity = "0"; } } catch (e) {}
    setTimeout(fit, 560); dock(); tip();
    if (invite) join(invite, false); else director.start();
  }

  /* ---------- the dock: sound, share, everything else ---------- */
  var D, seatsEl, idleT;
  function dock() {
    D = document.createElement("div"); D.className = "cb-dock"; D.setAttribute("role", "toolbar"); D.setAttribute("aria-label", "Cabin");
    D.innerHTML = '<span class="cb-seats" aria-live="polite"></span><button type="button" data-a="sound" aria-label="' + T.sound + '">🔊</button><button type="button" data-a="share" aria-label="' + T.share + '">🎟️</button><button type="button" data-a="more" aria-label="' + T.controls + '">☰</button>';
    document.body.appendChild(D); seatsEl = D.querySelector(".cb-seats");
    D.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.a === "sound") { try { toggleAudioEngine(); } catch (x) {} paintDock(); }
      if (b.dataset.a === "share") shareSheet();
      if (b.dataset.a === "more") { try { toggleZenMode(); } catch (x) {} }
    });
    var wake = function () { D.classList.remove("idle"); clearTimeout(idleT); idleT = setTimeout(function () { D.classList.add("idle"); }, 4000); };
    ["pointermove", "pointerdown", "keydown"].forEach(function (ev) { addEventListener(ev, wake, { passive: true }); });
    wake(); paintDock(); seats();
  }
  function paintDock() { if (!D) return; var b = D.querySelector('[data-a="sound"]'); try { b.textContent = isAudioPlaying ? "🔊" : "🔈"; } catch (e) {} }
  function tip() { var t = document.createElement("div"); t.className = "cb-tip"; t.textContent = T.tip; document.body.appendChild(t); setTimeout(function () { t.classList.add("on"); }, 1200); setTimeout(function () { t.classList.remove("on"); }, 9000); setTimeout(function () { t.remove(); }, 11000); }
  function seats() {
    if (!seatsEl) return;
    var ids = [S.me].concat(Object.keys(S.peers));
    seatsEl.innerHTML = S.code ? ids.map(function (id) { return '<span class="cb-seat' + (id === S.me ? " me" : "") + '"></span>'; }).join("") : "";
    seatsEl.title = S.code ? T.aboard.replace("{n}", ids.length) + " · " + S.code : T.alone;
    seatsEl.setAttribute("aria-label", seatsEl.title);
  }

  /* ---------- the glass: wipe (engine), hold to write, double-tap to knock ---------- */
  function vp() { return $("windowViewport"); }
  function rel(e) { var r = vp().getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; }
  function glass() {
    var c = $("windowCanvas"), holdT = null, start = null, lastTap = 0;
    c.addEventListener("pointerdown", function (e) {
      start = { x: e.clientX, y: e.clientY, p: rel(e) };
      clearTimeout(holdT); holdT = setTimeout(function () { if (start) ink(start.p); start = null; }, 650);
      var now = Date.now(); if (now - lastTap < 320) { clearTimeout(holdT); start = null; knock(rel(e), true); } lastTap = now;
    });
    c.addEventListener("pointermove", function (e) { if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12) { clearTimeout(holdT); start = null; } });
    addEventListener("pointerup", function () { clearTimeout(holdT); start = null; });
  }
  function ink(p) {
    var box = document.createElement("div"); box.className = "cb-ink"; place(box, p);
    box.innerHTML = '<input maxlength="80" enterkeyhint="done" aria-label="' + T.write + '" placeholder="' + T.write + '">';
    vp().appendChild(box); var i = box.querySelector("input"); i.focus();
    var over = false, done = function (keep) { if (over) return; over = true; var v = i.value.trim(); box.remove(); if (keep && v) { var n = { id: rid(), x: p.x, y: p.y, t: v }; note(n); send("note", n); } };
    i.addEventListener("keydown", function (e) { if (e.key === "Enter") done(true); if (e.key === "Escape") done(false); });
    i.addEventListener("blur", function () { done(true); });
  }
  function place(el, p) { el.style.left = (p.x * 100) + "%"; el.style.top = (p.y * 100) + "%"; }
  function note(n) {
    if (S.notes[n.id]) return;
    var el = document.createElement("div"); el.className = "cb-note"; el.textContent = String(n.t).slice(0, 80); place(el, n);
    vp().appendChild(el); S.notes[n.id] = el;
    try { var r = vp().getBoundingClientRect(); wipeGlassAt(n.x * r.width, n.y * r.height); } catch (e) {}
    setTimeout(function () { el.style.opacity = "0"; }, 170000); setTimeout(function () { el.remove(); delete S.notes[n.id]; }, 175000);
  }
  var kctx = null;
  function knock(p, mine) {
    var r = document.createElement("div"); r.className = "cb-ring"; place(r, p); vp().appendChild(r); setTimeout(function () { r.remove(); }, 1100);
    try {
      kctx = kctx || new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.16].forEach(function (dt) {
        var o = kctx.createOscillator(), g = kctx.createGain(), f = kctx.createBiquadFilter(), t0 = kctx.currentTime + dt;
        o.type = "triangle"; o.frequency.setValueAtTime(180, t0); o.frequency.exponentialRampToValueAtTime(70, t0 + 0.09);
        f.type = "lowpass"; f.frequency.value = 900; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
        var pan = kctx.createStereoPanner ? kctx.createStereoPanner() : null; if (pan) pan.pan.value = (p.x - 0.5) * 1.6;
        o.connect(f); f.connect(g); (pan ? (g.connect(pan), pan) : g).connect(kctx.destination); o.start(t0); o.stop(t0 + 0.16);
      });
    } catch (e) {}
    if (mine) send("knock", p);
  }

  /* ---------- the director: the journey drives itself (only one director per cabin) ---------- */
  var TIMES = ["dawn", "afternoon", "sunset", "night"], WEATHER = { clear: 5, rain: 3, fog: 2, snow: 1.2, storm: 0.6 };
  function pickWeather() { var tot = 0, k; for (k in WEATHER) tot += WEATHER[k]; var r = Math.random() * tot; for (k in WEATHER) { r -= WEATHER[k]; if (r <= 0) return k; } return "clear"; }
  var director = {
    on: false, iv: null, next: {},
    start: function () {
      if (this.on) return; this.on = true; var now = Date.now();
      this.next = { time: now + 150e3, weather: now + 95e3, tunnel: now + 70e3, station: now + 210e3, surprise: now + 35e3 };
      clearInterval(this.iv); this.iv = setInterval(this.tick.bind(this), 4000);
    },
    stop: function () { this.on = false; clearInterval(this.iv); },
    tick: function () {
      if (!S.boarded) return;
      if (document.hidden) { if (S.code) syncIfChanged(); return; }
      var now = Date.now(), n = this.next, changed = false;
      if (state.trainState === "STOPPED" && now > n.depart) { triggerStationStopOrDepart(); n.station = now + 240e3 + Math.random() * 120e3; changed = true; }
      else if (now > n.station && state.trainState === "CRUISING" && !state.inTunnel) { triggerStationStopOrDepart(); n.depart = now + 22e3; changed = true; }
      else if (now > n.tunnel && state.trainState === "CRUISING") {
        if (!state.inTunnel) { toggleMountainTunnel(); n.tunnelOut = now + 10e3 + Math.random() * 14e3; n.tunnel = Infinity; }
        changed = true;
      }
      if (state.inTunnel && now > (n.tunnelOut || 0)) {   /* the surprise: you come out somewhere else */
        if (Math.random() < 0.65) { var biomes = ["metropolis", "alpine", "coastal", "countryside", "desert"].filter(function (b) { return b !== state.biome; }); setBiome(biomes[(Math.random() * biomes.length) | 0], true); }
        toggleMountainTunnel(); toast(T.tunnelOut + " " + state.station.name); n.tunnel = now + 120e3 + Math.random() * 160e3; changed = true;
      }
      if (now > n.time) { setTimeOfDay(TIMES[(TIMES.indexOf(state.timeOfDay) + 1) % 4]); n.time = now + 150e3 + Math.random() * 90e3; changed = true; }
      if (now > n.weather) { var w = pickWeather(); if (w !== state.weather) { setWeather(w); toast({ rain: T.rainIn, fog: T.fogIn, snow: T.snowIn, clear: T.clearIn, storm: T.rainIn }[w]); } n.weather = now + 100e3 + Math.random() * 140e3; changed = true; }
      if (now > n.surprise) {
        if (state.timeOfDay === "night" && Math.random() < 0.6) { spawnShootingStarWish(); send("fx", { k: "star" }); }
        else if (!state.inTunnel && state.trainState === "CRUISING") { triggerPassingExpressTrain(); send("fx", { k: "express" }); }
        n.surprise = now + 45e3 + Math.random() * 75e3;
      }
      if (changed || now - S.lastSync > 9000) sync(); else syncIfChanged();
    }
  };

  /* ---------- the shared cabin ---------- */
  function snapshot() { return { biome: state.biome, time: state.timeOfDay, weather: state.weather, tunnel: state.inTunnel, train: state.trainState, station: state.station && state.station.name, by: S.me, since: S.joined }; }
  function sync() { S.lastSync = Date.now(); S.lastView = JSON.stringify(snapshot()); send("view", snapshot()); }
  function syncIfChanged() { if (JSON.stringify(snapshot()) !== S.lastView) sync(); }
  function apply(v) {
    try {
      if (v.station && (!state.station || state.station.name !== v.station)) { var st = STATION_CATALOG.filter(function (s) { return s.name === v.station; })[0]; if (st) { state.station = st; } }
      if (v.biome !== state.biome) setBiome(v.biome, false);
      if (v.time !== state.timeOfDay) setTimeOfDay(v.time);
      if (v.weather !== state.weather) setWeather(v.weather);
      if (!!v.tunnel !== !!state.inTunnel) toggleMountainTunnel();
      if (v.train === "BRAKING" && state.trainState === "CRUISING") triggerStationStopOrDepart();
      if (v.train === "DEPARTING" && (state.trainState === "STOPPED" || state.trainState === "BRAKING")) triggerStationStopOrDepart();
      syncHUDAndButtons();
    } catch (e) {}
  }
  function isDirector() { /* the longest-seated passenger steers */ var oldest = S.joined, id = S.me, k; for (k in S.peers) { var p = S.peers[k]; if (p.since < oldest || (p.since === oldest && k < id)) { oldest = p.since; id = k; } } return id === S.me; }
  function reelect() { if (isDirector()) director.start(); else director.stop(); }
  function onMsg(ev, p) {
    if (!p || p.by === S.me) return;
    if (ev === "_ready") { hello(); if (!S.code) return; return; }
    if (ev === "hello" || ev === "here") {
      var isNew = !S.peers[p.by]; S.peers[p.by] = { since: +p.since || Date.now(), seen: Date.now() };
      if (isNew) { seats(); if (ev === "hello") { toast(T.joined); if (isDirector()) sync(); send("here", { by: S.me, since: S.joined }); } reelect(); }
      return;
    }
    if (ev === "bye") { delete S.peers[p.by]; seats(); toast(T.left); reelect(); return; }
    if (S.peers[p.by]) S.peers[p.by].seen = Date.now();
    if (ev === "view" && !isDirector()) apply(p);
    if (ev === "note") note(p);
    if (ev === "knock") knock(p, false);
    if (ev === "fx") { try { if (p.k === "star") spawnShootingStarWish(); if (p.k === "express") triggerPassingExpressTrain(); } catch (e) {} }
  }
  function hello() { send("hello", { by: S.me, since: S.joined }); }
  function send(ev, p) { if (!S.tx) return; p = Object.assign({ by: S.me }, p); S.tx.send(ev, p); }
  setInterval(function () {   /* presence: a quiet heartbeat; passengers who vanish step off after 45s */
    if (!S.tx) return; send("here", { since: S.joined }); var now = Date.now(), gone = false, k;
    for (k in S.peers) if (now - S.peers[k].seen > 45e3) { delete S.peers[k]; gone = true; }
    if (gone) { seats(); reelect(); }
  }, 15e3);
  addEventListener("pagehide", function () { if (S.tx) send("bye", {}); });

  function newCode() { var A = "BCDFGHJKLMNPQRSTVWXZ", s = ""; for (var i = 0; i < 4; i++) s += A[(Math.random() * A.length) | 0]; return s; }
  function link() { var u = new URL(location.href); u.search = "?cabin=" + S.code; u.hash = ""; return u.toString(); }
  function join(code, creating) {
    S.code = code; seats();
    if (S.tx) S.tx.close();
    S.tx = transport(code, onMsg, function (st) { S.net = st; if (st === "bad") toast(T.lost); });
    if (creating) director.start(); else { director.stop(); toast(T.connecting); setTimeout(reelect, 8000); }
    try { history.replaceState(null, "", "?cabin=" + code); } catch (e) {}
  }
  function leave() { if (S.tx) { send("bye", {}); S.tx.close(); } S.tx = null; S.code = ""; S.peers = {}; seats(); director.start(); try { history.replaceState(null, "", location.pathname); } catch (e) {} }
  function shareSheet() {
    if (!S.code) join(newCode(), true);
    var w = document.createElement("div"); w.className = "cb-sheet";
    w.innerHTML = '<div class="cb-card" role="dialog" aria-modal="true" aria-labelledby="cb-sh"><h2 id="cb-sh">' + T.share + '</h2><p class="mut">' + T.shareLead + '</p><div class="code">' + S.code + '</div>' +
      '<div class="row"><button type="button" class="pri" data-a="copy">' + T.copy + '</button><button type="button" data-a="close">' + T.close + '</button></div>' +
      '<div class="row"><button type="button" data-a="leave">' + T.leave + '</button></div></div>';
    document.body.appendChild(w);
    w.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (e.target === w) return w.remove(); if (!b) return;
      if (b.dataset.a === "copy") { var u = link(); if (navigator.share) navigator.share({ title: "Sleeper Car No. 04", url: u }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { b.textContent = T.copied; }); }
      if (b.dataset.a === "close") w.remove();
      if (b.dataset.a === "leave") { leave(); w.remove(); }
    });
  }

  /* Supabase Realtime broadcast over the raw Phoenix protocol (same relay as Room Mode, works in mainland China) */
  function transport(code, onMsg, onStatus) {
    var topic = "realtime:fbtrain-" + code;
    if (!cfg.url) {   /* no keys yet (offline preview): connect tabs on this device */
      var bc = null; try { bc = new BroadcastChannel("fb_train_" + code); bc.onmessage = function (e) { onMsg(e.data.event, e.data.payload); }; } catch (e) {}
      setTimeout(function () { onMsg("_ready", {}); }, 0);
      return { send: function (ev, p) { try { bc && bc.postMessage({ event: ev, payload: p }); } catch (e) {} }, close: function () { try { bc && bc.close(); } catch (e) {} } };
    }
    var ws = null, ref = 0, hb = null, closed = false, tries = 0, joined = false;
    var base = (cfg.rt || cfg.url.replace(/^http/, "ws") + "/realtime/v1/websocket").replace(/\/$/, "");
    var url = base + (base.indexOf("?") >= 0 ? "&" : "?") + "apikey=" + encodeURIComponent(cfg.key) + "&vsn=1.0.0";
    var raw = function (m) { try { ws && ws.readyState === 1 && ws.send(JSON.stringify(m)); } catch (e) {} };
    function connect() {
      onStatus("connecting");
      try { ws = new WebSocket(url); } catch (e) { return retry(); }
      ws.onopen = function () { tries = 0; raw({ topic: topic, event: "phx_join", ref: String(++ref), payload: { config: { broadcast: { self: false, ack: false }, presence: { key: "" }, private: false }, access_token: cfg.key } }); clearInterval(hb); hb = setInterval(function () { raw({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++ref) }); }, 25000); };
      ws.onmessage = function (e) {
        var m; try { m = JSON.parse(e.data); } catch (_) { return; }
        if (m.event === "phx_reply" && m.topic === topic && m.payload && m.payload.status === "ok" && !joined) { joined = true; onStatus("ok"); onMsg("_ready", {}); }
        else if (m.event === "broadcast" && m.payload) onMsg(m.payload.event, m.payload.payload);
        else if (m.event === "phx_error" || m.event === "phx_close") { joined = false; onStatus("bad"); }
      };
      ws.onclose = function () { joined = false; clearInterval(hb); if (!closed) retry(); };
      ws.onerror = function () { try { ws.close(); } catch (_) {} };
    }
    function retry() { onStatus("bad"); setTimeout(function () { if (!closed) connect(); }, Math.min(15000, 800 * Math.pow(2, tries++))); }
    connect();
    return { send: function (ev, p) { if (joined) raw({ topic: topic, event: "broadcast", ref: String(++ref), payload: { type: "broadcast", event: ev, payload: p } }); }, close: function () { closed = true; clearInterval(hb); try { ws && ws.close(); } catch (e) {} } };
  }
  (function keys() { var sc = document.createElement("script"); sc.src = "/config.js"; sc.onload = function () { var c = window.FB_SUPABASE || {}; cfg.url = c.url || ""; cfg.key = c.anonKey || ""; cfg.rt = c.realtimeUrl || ""; }; document.head.appendChild(sc); })();

  window.FBCabin = { T: T, state: S, director: director, join: join, leave: leave };
  addEventListener("load", function () {
    glass(); boardCard();
    var r = document.createElement("div"); r.className = "cb-rotate"; r.innerHTML = "<div><b>📱</b>Turn your phone sideways — the window is wide.</div>"; document.body.appendChild(r);
  });
})();
