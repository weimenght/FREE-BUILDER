/* Sleeper Car No. 04 — the cabin layer.
   - Board with one tap; the journey then drives itself: hours pass, weather drifts, tunnels open onto
     new landscapes, stations come and go. You just look out of the window.
   - The glass is the interface: write in the mist with a fingertip (it fogs back over), double-tap to knock.
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
    homeScreen: "Add to Home Screen", getOff: "Get off here", stay: "Stay aboard", bar: "Wei's Bar & Coffee", books: "The Dog-Eared Corner", copy: "Copy link", copied: "Link copied", joinLbl: "Got a friend's code?", join: "Join", badCode: "Four letters, like KTRB", yourCode: "Your cabin", close: "Close", leave: "Leave the shared cabin", alone: "Just you in this car",
    aboard: "{n} aboard", joined: "Someone boarded", left: "Someone stepped off", knock: "knock knock", write: "Write on the glass…",
    sound: "Sound", controls: "All controls", connecting: "Joining the cabin…", lost: "Lost the cabin's signal — retrying", host: "You're steering the journey",
    tunnelOut: "Out of the tunnel —", pass: "An express train thunders past", star: "A shooting star — make a wish", rainIn: "Rain on the glass", fogIn: "Fog rolls in", snowIn: "Snow begins to fall", clearIn: "The sky clears"
  };
  var cfg = { url: "", key: "", rt: "" };
  var S = { boarded: false, code: "", tx: null, me: rid(), joined: Date.now(), peers: {}, notes: {}, lastSync: 0, net: "" };
  function rid() { return Math.random().toString(36).slice(2, 10); }
  var say = window.showWindowToast;
  window.showWindowToast = function (m) { if (!document.body.classList.contains("cb-on") || toast.ok) try { say(m); } catch (e) {} };
  function toast(m) { toast.ok = true; try { window.showWindowToast(m); } catch (e) {} toast.ok = false; }

  /* ---------- look & feel ---------- */
  var css = "#sanctuaryWelcomeOverlay,#zenFloatingControls,#portraitBanner{display:none!important}" +
    "#glassWhisperContainer,#notebookModal,[onclick='cycleWarmDrink()'],[onclick='openNotebookModal(false)'],#drawerWhisperBtn,[onclick='toggleWindowWhispers()'],[onclick='cycleWindowWhisperPrompt()']{display:none!important}" +
    "body.cb-on #glassWhisperContainer,body.cb-on #windowToast:empty{display:none!important}body.cb-on #cabinContainer>div>div:first-child{display:none!important}" +
    "body.cb-on #cabinContainer{max-width:none;padding:6px 8px}body.cb-on #cabinContainer>div>div:last-child{grid-column:1/-1}" +
    ".cb-ticket{padding:30px 34px 26px;border-radius:18px;background:linear-gradient(#f6ead2,#ead9b8);color:#2a1a10;box-shadow:0 30px 80px -30px #000;position:relative;min-width:min(22rem,86vw)}" +
    ".cb-ticket::before,.cb-ticket::after{content:'';position:absolute;top:50%;width:22px;height:22px;margin-top:-11px;border-radius:50%;background:#140c08}.cb-ticket::before{left:-11px}.cb-ticket::after{right:-11px}" +
    ".cb-ticket h1{color:#2a1a10}.cb-ticket .cb-go{background:#2a1a10;color:#f6ead2;margin-top:8px}.cb-ticket .cb-q{position:absolute;top:10px;right:12px;margin:0;text-decoration:none;font-size:16px;opacity:.55}" +
    ".cb-finger{position:absolute;left:-14px;top:-14px;z-index:30;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.75),rgba(255,255,255,.15) 60%,transparent 70%);pointer-events:none;transition:opacity .2s}.cb-finger.tap{animation:cbTap .5s 2}@keyframes cbTap{50%{transform:var(--t) scale(.7)}}" +
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
    ".cb-tip{position:fixed;left:50%;bottom:calc(max(12px,env(safe-area-inset-bottom)) + 62px);max-width:min(86vw,640px);text-align:center;transform:translateX(-50%);z-index:55;color:#f5e6c8;font:12px/1.4 system-ui,sans-serif;letter-spacing:.02em;opacity:0;transition:opacity 1.2s;pointer-events:none;text-shadow:0 1px 6px #000;white-space:normal}.cb-tip.on{opacity:.8}" +
    ".cb-note{position:absolute;z-index:6;max-width:46%;transform:translate(-50%,-50%) rotate(-3deg);font:italic 22px/1.2 'Segoe Print','Bradley Hand','Comic Sans MS',cursive;color:rgba(255,255,255,.78);text-shadow:0 0 6px rgba(255,255,255,.35),0 0 1px rgba(0,0,0,.6);pointer-events:none;transition:opacity 4s;white-space:pre-wrap;text-align:center}" +
    ".cb-ink{position:absolute;z-index:7;transform:translate(-50%,-50%);width:min(70%,22rem)}.cb-ink input{width:100%;font:italic 20px 'Segoe Print','Bradley Hand',cursive;background:rgba(255,255,255,.08);border:1px dashed rgba(255,255,255,.5);color:#fff;border-radius:10px;padding:8px 12px;outline:none}" +
    ".cb-ring{position:absolute;z-index:7;width:14px;height:14px;margin:-7px 0 0 -7px;border:2px solid rgba(255,255,255,.8);border-radius:50%;pointer-events:none;animation:cbRing 1s ease-out forwards}@keyframes cbRing{to{transform:scale(7);opacity:0}}" +
    ".cb-sheet{position:fixed;inset:0;z-index:90;display:grid;place-items:center;background:rgba(8,6,5,.6);padding:16px}.cb-card{width:min(26rem,100%);background:#f8efe0;color:#2a1a10;border-radius:22px;padding:22px;font:15px/1.55 system-ui,-apple-system,sans-serif;box-shadow:0 30px 80px -30px #000}" +
    ".cb-card h2{font:400 24px Georgia,serif;margin:0 0 8px}.cb-card .code{font:600 30px/1 ui-monospace,Menlo,monospace;letter-spacing:.3em;margin:14px 0;text-align:center}.cb-card .row{display:flex;gap:8px;margin-top:14px}.cb-card button{flex:1;min-height:44px;border-radius:999px;border:1.5px solid #2a1a10;background:transparent;font:600 14px system-ui,sans-serif;cursor:pointer;color:inherit}.cb-card button.pri{background:#2a1a10;color:#f8efe0}.cb-card .mut{font-size:13px;opacity:.7}" +
    ".cb-join{margin-top:18px;padding-top:14px;border-top:1px dashed rgba(42,26,16,.3)}.cb-join label{font:600 13px system-ui,sans-serif;opacity:.8}.cb-join .row{margin-top:8px}.cb-join input{flex:1.4;min-width:0;min-height:44px;border-radius:999px;border:1.5px solid currentColor;background:transparent;color:inherit;font:600 20px ui-monospace,Menlo,monospace;letter-spacing:.35em;text-align:center;text-transform:uppercase}.cb-jerr{min-height:1em;margin:6px 0 0}" +
    ".cb-dock .fbg{position:static;opacity:.75;margin-left:2px}.cb-dock .fbg:hover,.cb-dock .fbg:focus-within{opacity:1}.cb-dock .fbg-mini{flex-direction:row}.cb-dock .fbg button,.cb-dock .fbg a{background:none;border:0;padding:4px 6px}" +
    ".cb-home{position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translate(-50%,-140%);z-index:70;display:flex;align-items:center;gap:8px;padding:8px 8px 8px 14px;border-radius:999px;background:rgba(248,239,224,.96);color:#2a1a10;font:600 13px system-ui,-apple-system,sans-serif;box-shadow:0 10px 30px -10px #000;transition:transform .5s}.cb-home.on{transform:translate(-50%,0)}.cb-home svg{width:18px;height:18px;color:#1a73e8}.cb-home b{display:grid;place-items:center;width:20px;height:20px;border:1.5px solid currentColor;border-radius:5px;font-size:13px}.cb-home button{width:28px;height:28px;border:0;border-radius:50%;background:rgba(42,26,16,.08);font-size:16px;cursor:pointer;color:inherit}" +
    ".cb-stn{display:block;font:11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;opacity:.6;margin-bottom:12px;text-align:center}.cb-doors{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
    ".cb-door{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 10px;border-radius:16px;border:1.5px solid rgba(42,26,16,.25);text-decoration:none;color:inherit;text-align:center;transition:.2s}.cb-door b{font-size:34px;line-height:1}.cb-door span{font:400 17px/1.2 Georgia,'Songti SC',serif}.cb-door small{font:600 12px system-ui,sans-serif;opacity:.7}.cb-door.on,.cb-door:hover,.cb-door:focus-visible{border-color:currentColor;background:rgba(255,190,110,.18)}" +
    ".cb-cat{position:absolute;left:0;bottom:2%;z-index:24;width:clamp(56px,9%,96px);aspect-ratio:64/40;padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(0 4px 6px rgba(0,0,0,.5))}.cb-cat svg{width:100%;height:100%;overflow:visible}.cb-cat.rev svg{transform:scaleX(-1)}" +
    ".cb-cat .legs{animation:cbStep .38s steps(2) infinite}.cb-cat.sit .legs{animation:none}.cb-cat .tail{transform-origin:8px 22px;animation:cbTail 1.6s ease-in-out infinite}@keyframes cbStep{50%{transform:translateY(-1px)}}@keyframes cbTail{50%{transform:rotate(-14deg)}}" +
    ".cb-heart{position:absolute;left:60%;top:-30%;color:#ff8fa0;font:700 18px system-ui;animation:cbUp 1.2s ease-out forwards;pointer-events:none}@keyframes cbUp{to{transform:translateY(-34px);opacity:0}}" +
    ".cb-rotate{display:none}@media (orientation:portrait) and (max-width:700px){.cb-rotate{position:fixed;inset:0;z-index:200;display:grid;place-items:center;text-align:center;padding:32px;background:#0a0705;color:#f5e6c8;font:28px/1 Georgia,serif}.cb-rotate b{display:block;font-size:56px;margin-bottom:18px;animation:cbTurn 2.4s ease-in-out infinite}.cb-rotate span{opacity:.5}}" +
    "@keyframes cbTurn{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(90deg)}}" +
    "@media (prefers-color-scheme:dark){.cb-card{background:#1f1915;color:#f2e8d8}.cb-card button{border-color:#f2e8d8}.cb-card button.pri{background:#f2e8d8;color:#1f1915}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- every time you board: somewhere else, some other hour, other weather, another tape ---------- */
  function shuffle() {
    try {
      var pick = function (a) { return a[(Math.random() * a.length) | 0]; };
      var st = pick(STATION_CATALOG.filter(function (x) { return x.name !== "Gulou Hutong" || Math.random() < 0.5; }));
      state.station = st; setBiome(st.biome, false);
      /* you board from the neighbourhood: same hour and weather as Wei's Bar, then the journey changes them */
      var W = window.FBWorld, ph = W ? W.phase() : null;
      setTimeOfDay(ph ? { dawn: "dawn", day: "afternoon", dusk: "sunset", night: "night" }[ph] : pick(["dawn", "afternoon", "sunset", "night", "night", "sunset"]));
      setWeather(W ? W.weather() : pickWeather());
      state.stationScrollOffset = -cw * 6; state.trainState = "CRUISING";
      if (typeof RADIO_TRACKS !== "undefined") { state.trackIndex = (Math.random() * RADIO_TRACKS.length) | 0; var tt = $("radioTrackTitle"); if (tt) tt.textContent = RADIO_TRACKS[state.trackIndex].title; }
      if (typeof DRINKS_MENU !== "undefined") state.drinkIndex = (Math.random() * DRINKS_MENU.length) | 0;
      syncHUDAndButtons();
    } catch (e) {}
  }
  /* iPhone: Web Audio stays silent under the mute switch unless a media element starts the session */
  function unlockAudio() {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    try { var a = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="); a.loop = true; a.volume = 0; a.setAttribute("playsinline", ""); var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }

  /* ---------- boarding ---------- */
  var qs = new URLSearchParams(location.search), invite = (qs.get("cabin") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  function boardCard() {
    var d = document.createElement("div"); d.className = "cb-board";
    d.innerHTML = '<div class="cb-ticket"><small>Sleeper Car No. 04</small><h1>' + (invite ? "🎟️ " + invite : "Train Window") + '</h1>' +
      '<button class="cb-go" type="button">' + T.board + ' <span aria-hidden="true">→</span></button><button class="cb-q" type="button" aria-label="' + T.quiet + '" title="' + T.quiet + '">🔇</button></div>';
    document.body.appendChild(d);
    var go = function (sound) {
      d.style.opacity = "0"; setTimeout(function () { d.remove(); }, 800);
      full(); unlockAudio();
      try { if (sound && !isAudioPlaying) toggleAudioEngine(); if (sound && typeof audioCtx !== "undefined" && audioCtx && audioCtx.resume) audioCtx.resume(); } catch (e) {}
      boarded();
    };
    d.querySelector(".cb-go").onclick = function () { go(true); };
    d.querySelector(".cb-q").onclick = function () { go(false); };
  }
  /* boarding takes the whole screen (browsers allow it only from a tap), sideways on phones */
  function full() {
    var de = document.documentElement, rq = de.requestFullscreen || de.webkitRequestFullscreen;
    if (rq && !document.fullscreenElement && !document.webkitFullscreenElement) {
      try { var p = rq.call(de, { navigationUI: "hide" }); if (p && p.then) p.then(lock, function () {}); else lock(); } catch (e) {}
    }
    else if (!rq && !standalone()) homeHint();
    function lock() { try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(function () {}); } catch (e) {} setTimeout(fit, 400); }
  }
  function heart(k) { var t = Math.PI - k * 2 * Math.PI, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); return { x: 0.7 + x / 260, y: 0.42 - y / 150 }; }
  function standalone() { return (window.matchMedia && matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches) || navigator.standalone === true; }
  function homeHint() {   /* iPhone Safari has no full screen for pages: show the two taps that give one */
    try { if (localStorage.getItem("train_home_hint")) return; localStorage.setItem("train_home_hint", "1"); } catch (e) {}
    var h = document.createElement("div"); h.className = "cb-home"; h.setAttribute("role", "status");
    h.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span aria-hidden="true">→</span><b aria-hidden="true">＋</b><span>' + T.homeScreen + '</span><button type="button" aria-label="' + T.close + '">×</button>';
    document.body.appendChild(h); h.querySelector("button").onclick = function () { h.remove(); }; setTimeout(function () { h.classList.add("on"); }, 2500); setTimeout(function () { h.remove(); }, 14000);
  }
  /* fill the screen: the window takes whatever height is left, on any landscape screen */
  function fit() {
    if (!document.body.classList.contains("cb-on")) return;
    var el = $("windowViewport"); if (!el) return;
    var bezel = el.closest(".window-bezel") || el.parentElement;
    var chrome = bezel.getBoundingClientRect().height - el.getBoundingClientRect().height;   /* frame + sill around the glass */
    var h = Math.min(innerHeight - chrome - 20, el.getBoundingClientRect().width * (innerHeight > innerWidth ? 1.1 : 0.68));   /* fill the height, but stay a wide window */
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
    setTimeout(function () { if (Math.random() < 0.6) catWalk(Math.random() < 0.5 ? "Yuzu" : "Miso", 1, true); }, 20000 + Math.random() * 20000);
    if (invite) join(invite, false); else director.start();
  }

  /* ---------- the dock: sound, share, everything else ---------- */
  var D, seatsEl, idleT;
  function dock() {
    D = document.createElement("div"); D.className = "cb-dock"; D.setAttribute("role", "toolbar"); D.setAttribute("aria-label", "Cabin");
    D.innerHTML = '<span class="cb-seats" aria-live="polite"></span><button type="button" data-a="sound" aria-label="' + T.sound + '">🔊</button><button type="button" data-a="share" aria-label="' + T.share + '">🎟️</button><button type="button" data-a="more" aria-label="' + T.controls + '">☰</button>';
    document.body.appendChild(D); seatsEl = D.querySelector(".cb-seats");
    var credit = document.querySelector(".fbg"); if (credit) D.appendChild(credit); else setTimeout(function () { var c = document.querySelector(".fbg"); if (c && D) D.appendChild(c); }, 1500);
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
  function tip() {   /* a ghost fingertip wipes a clear swoop through the fog, then knocks twice */
    if (reduce) return;
    var vp = $("windowViewport"); if (!vp) return;
    setTimeout(function () {
      try { replenishMistLayer(0.2); } catch (e) {}
      var r = vp.getBoundingClientRect(), dot = document.createElement("div"); dot.className = "cb-finger"; vp.appendChild(dot);
      var t0 = performance.now(), dur = 2600, prevK = 0;
      (function step(now) {
        var k = Math.min(1, (now - t0) / dur), hp0 = heart(k), x = r.width * hp0.x, y = r.height * hp0.y;
        dot.style.transform = "translate(" + x + "px," + y + "px)"; dot.style.opacity = k < 0.08 ? k * 12 : k > 0.92 ? (1 - k) * 12 : 1;
        for (var kk = prevK; kk < k; kk += 0.004) finger(heart(kk), heart(Math.min(k, kk + 0.004))); prevK = k;
        if (k < 1) requestAnimationFrame(step); else { dot.classList.add("tap"); setTimeout(function () { knock({ x: 0.78, y: 0.5 }, false); }, 300); setTimeout(function () { dot.remove(); }, 900); }
      })(t0);
    }, 1600);
  }
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
      var now = Date.now(); if (now - lastTap < 320) { start = null; knock(rel(e), true); } lastTap = now;
      pen = [rel(e)]; finger(pen[0], pen[0]); try { c.setPointerCapture(e.pointerId); } catch (x) {}
    });
    c.addEventListener("pointermove", function (e) {
      if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12) start = null;
      if (!pen) return; var p = rel(e), q = pen[pen.length - 1]; finger(q, p); pen.push(p);
      if (pen.length > 6) flush();
    });
    addEventListener("pointerup", function (e) {
      if (pen) { flush(); pen = null; }
      var s0 = start; start = null;
      if (s0 && e.target === c && window.TrainView) { var r = vp().getBoundingClientRect(), k = TrainView.hit(e.clientX - r.left, e.clientY - r.top); if (k) setTimeout(function () { if (Date.now() - lastTap > 300) stopFor(k); }, 330); }
    });
  }
  /* ---------- Yuzu and Miso ride along: along the sill, past the glass ---------- */
  var CAT = { Yuzu: { body: "#e8913a", belly: "#f8dcae", eye: "#4f9a62", stripe: "#b5611d" }, Miso: { body: "#231b17", belly: "#3a2f29", eye: "#f2c94c", stripe: "#231b17" } };
  function catSvg(c) {
    var k = CAT[c];
    return '<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M8 26c0-9 10-14 24-14s20 4 22 10l-2 6H10z" fill="' + k.body + '"/><path d="M14 28h34" stroke="' + k.belly + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path class="tail" d="M8 22c-6-2-8-8-4-12" fill="none" stroke="' + k.body + '" stroke-width="4" stroke-linecap="round"/><circle cx="52" cy="17" r="9" fill="' + k.body + '"/><path d="M45 11l2-8 5 6zM59 11l-2-8-5 6z" fill="' + k.body + '"/>' +
      '<circle cx="49" cy="16" r="1.6" fill="' + k.eye + '"/><circle cx="55" cy="16" r="1.6" fill="' + k.eye + '"/><path d="M20 16l2 6M28 14l1 6" stroke="' + k.stripe + '" stroke-width="2" opacity=".6"/>' +
      '<g class="legs" fill="' + k.body + '"><rect x="14" y="28" width="4" height="10" rx="2"/><rect x="22" y="28" width="4" height="10" rx="2"/><rect x="40" y="28" width="4" height="10" rx="2"/><rect x="47" y="28" width="4" height="10" rx="2"/></g></svg>';
  }
  function catWalk(name, dir, sit) {
    if (!S.boarded || document.querySelector(".cb-cat")) return;
    name = CAT[name] ? name : "Yuzu"; dir = dir === -1 ? -1 : 1;
    var v = vp(); if (!v) return;
    var c = document.createElement("button"); c.type = "button"; c.className = "cb-cat" + (dir < 0 ? " rev" : ""); c.innerHTML = catSvg(name); c.setAttribute("aria-label", name);
    v.appendChild(c);
    var W = v.getBoundingClientRect().width, cw2 = c.getBoundingClientRect().width, from = dir > 0 ? -cw2 : W, to = dir > 0 ? W : -cw2, mid = W * (0.35 + Math.random() * 0.3), speed = W / 14000;
    var t0 = performance.now(), paused = 0, sat = false;
    c.onclick = function (e) { e.stopPropagation(); purr(c); };
    (function step(now) {
      if (!c.isConnected) return;
      var x = from + (now - t0 - paused) * speed * dir;
      if (sit && !sat && (dir > 0 ? x >= mid : x <= mid)) { sat = true; c.classList.add("sit"); var ps = now; setTimeout(function () { c.classList.remove("sit"); paused += performance.now() - ps; requestAnimationFrame(step); }, 6000 + Math.random() * 5000); c.style.transform = "translateX(" + x + "px)"; return; }
      c.style.transform = "translateX(" + x + "px)";
      if (dir > 0 ? x < to : x > to) requestAnimationFrame(step); else c.remove();
    })(t0);
  }
  function purr(c) {
    var h = document.createElement("span"); h.className = "cb-heart"; h.textContent = "♥"; c.appendChild(h); setTimeout(function () { h.remove(); }, 1200);
    try { kctx = kctx || new (window.AudioContext || window.webkitAudioContext)(); var t0 = kctx.currentTime, o = kctx.createOscillator(), g = kctx.createGain(); o.type = "triangle"; o.frequency.setValueAtTime(520, t0); o.frequency.exponentialRampToValueAtTime(880, t0 + 0.12); o.frequency.exponentialRampToValueAtTime(600, t0 + 0.3); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35); o.connect(g); g.connect(kctx.destination); o.start(t0); o.stop(t0 + 0.4); } catch (e) {}
  }
  var catBoarded = "";
  setInterval(function () {   /* at the hutong the cats from the bar hop on */
    if (atHutong() && state.trainState === "STOPPED" && catBoarded !== state.station.name + state.scrollDist.toFixed(0).slice(0, -3)) { catBoarded = state.station.name + state.scrollDist.toFixed(0).slice(0, -3); if (Math.random() < 0.7) { var c = Math.random() < 0.5 ? "Yuzu" : "Miso"; setTimeout(function () { catWalk(c, -1, true); }, 3000); } }
  }, 2000);

  /* ---------- getting off at the hutong: Wei's Bar and the book corner ---------- */
  var HUTONG = "Gulou Hutong", wantOff = null;
  function atHutong() { return state.station && state.station.name === HUTONG; }
  function stopFor(k) {
    wantOff = k;
    if (atHutong() && state.trainState === "STOPPED") return offCard(k);
    var st = STATION_CATALOG.filter(function (x) { return x.name === HUTONG; })[0]; if (!st) return;
    if (state.trainState === "CRUISING") { state.station = st; if (state.biome !== "hutong") setBiome("hutong", false); triggerStationStopOrDepart(); sync && S.code && sync(); }
  }
  setInterval(function () { if (wantOff && atHutong() && state.trainState === "STOPPED" && !document.querySelector(".cb-off")) offCard(wantOff); }, 500);
  function offCard(k) {
    wantOff = null; director.next.depart = Date.now() + 60e3;
    var w = document.createElement("div"); w.className = "cb-sheet cb-off";
    var door = function (id, icon, name, href) { return '<a class="cb-door' + (id === k ? " on" : "") + '" href="' + href + '"><b aria-hidden="true">' + icon + "</b><span>" + name + "</span><small>" + T.getOff + ' <span aria-hidden="true">→</span></small></a>'; };
    w.innerHTML = '<div class="cb-card" role="dialog" aria-modal="true" aria-label="' + HUTONG + '"><small class="cb-stn">' + HUTONG + '</small><div class="cb-doors">' + door("bar", "🍸", T.bar, "../bar/") + door("books", "📚", T.books, "../books/") + '</div><div class="row"><button type="button" data-a="stay">' + T.stay + "</button></div></div>";
    document.body.appendChild(w);
    w.addEventListener("click", function (e) { if (e.target === w || e.target.closest('[data-a="stay"]')) { w.remove(); director.next.depart = Date.now() + 3000; } });
  }
  /* writing on the glass is wiping the mist with a fingertip; friends in the cabin see the same strokes */
  var pen = null;
  function finger(a, b, w) {
    try {
      mistCtx.save(); mistCtx.globalCompositeOperation = "destination-out"; mistCtx.lineCap = mistCtx.lineJoin = "round";
      mistCtx.strokeStyle = "rgba(0,0,0,0.92)"; mistCtx.lineWidth = w || Math.max(12, Math.min(26, cw * 0.016));
      mistCtx.beginPath(); mistCtx.moveTo(a.x * cw, a.y * ch); mistCtx.lineTo(b.x * cw + 0.01, b.y * ch); mistCtx.stroke(); mistCtx.restore();
    } catch (e) {}
  }
  function flush() { if (!pen || pen.length < 2) return; var pts = pen.map(function (p) { return [+p.x.toFixed(4), +p.y.toFixed(4)]; }); send("ink", { pts: pts }); pen = [pen[pen.length - 1]]; }
  function inkFrom(p) { if (!p || !p.pts) return; for (var i = 1; i < p.pts.length; i++) finger({ x: p.pts[i - 1][0], y: p.pts[i - 1][1] }, { x: p.pts[i][0], y: p.pts[i][1] }); }
  window.wipeGlassAt = function () {};   /* the engine's hover-wipe would erase writing; the finger does it now */
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
        if (Math.random() < 0.65) { var biomes = ["metropolis", "hutong", "alpine", "coastal", "countryside", "desert", "forest", "lake", "snow"].filter(function (b) { return b !== state.biome; }); setBiome(biomes[(Math.random() * biomes.length) | 0], true); }
        toggleMountainTunnel(); n.tunnel = now + 120e3 + Math.random() * 160e3; changed = true;
      }
      if (now > n.time) { setTimeOfDay(TIMES[(TIMES.indexOf(state.timeOfDay) + 1) % 4]); n.time = now + 150e3 + Math.random() * 90e3; changed = true; }
      if (now > n.weather) { var w = pickWeather(); if (w !== state.weather) setWeather(w); n.weather = now + 100e3 + Math.random() * 140e3; changed = true; }
      if (now > n.surprise) {
        if (state.timeOfDay === "night" && Math.random() < 0.6) { spawnShootingStarWish(); send("fx", { k: "star" }); }
        else if (!state.inTunnel && state.trainState === "CRUISING") { triggerPassingExpressTrain(); send("fx", { k: "express" }); }
        if (Math.random() < 0.3 && !state.inTunnel) { var cc = Math.random() < 0.5 ? "Yuzu" : "Miso", dd = Math.random() < 0.5 ? 1 : -1, ss = Math.random() < 0.6; catWalk(cc, dd, ss); send("fx", { k: "cat", c: cc, dir: dd, sit: ss }); }
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
    if (ev === "ink") inkFrom(p);
    if (ev === "knock") knock(p, false);
    if (ev === "fx") { try { if (p.k === "star") spawnShootingStarWish(); if (p.k === "express") triggerPassingExpressTrain(); if (p.k === "cat") catWalk(p.c, p.dir, p.sit); } catch (e) {} }
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
    w.innerHTML = '<div class="cb-card" role="dialog" aria-modal="true" aria-labelledby="cb-sh"><h2 id="cb-sh">' + T.share + '</h2><p class="mut">' + T.shareLead + '</p><div class="code" aria-label="' + T.yourCode + '">' + S.code + '</div>' +
      '<div class="row"><button type="button" class="pri" data-a="copy">' + T.copy + '</button><button type="button" data-a="close">' + T.close + '</button></div>' +
      '<form class="cb-join"><label for="cb-jc">' + T.joinLbl + '</label><div class="row"><input id="cb-jc" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="····" inputmode="text"><button type="submit">' + T.join + '</button></div><p class="mut cb-jerr" aria-live="polite"></p></form>' +
      '<div class="row"><button type="button" data-a="leave">' + T.leave + '</button></div></div>';
    document.body.appendChild(w);
    var jc = w.querySelector("#cb-jc");
    jc.addEventListener("input", function () { jc.value = jc.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4); });
    w.querySelector(".cb-join").addEventListener("submit", function (e) {
      e.preventDefault(); var c = jc.value;
      if (c.length !== 4) { w.querySelector(".cb-jerr").textContent = T.badCode; jc.focus(); return; }
      w.remove(); if (c !== S.code) { if (S.tx) send("bye", {}); S.peers = {}; join(c, false); }
    });
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
    if (!invite) shuffle();
    glass(); boardCard();
    var r = document.createElement("div"); r.className = "cb-rotate"; r.setAttribute("role", "img"); r.setAttribute("aria-label", "Turn your phone sideways"); r.innerHTML = "<div><b>📱</b><span>↻</span></div>"; document.body.appendChild(r);
  });
})();
