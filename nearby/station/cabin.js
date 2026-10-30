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
    board: "Board", quiet: "board quietly", lead: "A sleeper car through cities, mountains and sea. A window seat, a cup of tea, the world going by.",
    saved: "A friend saved you a seat in cabin", tip: "Drag to wipe the glass · hold to write · double-tap to knock",
    share: "With a friend", shareLead: "Friends who open this link sit in your car and see the same window, live. No names, nothing saved: the cabin disappears when everyone leaves.",
    homeScreen: "Add to Home Screen", getOff: "Get off here", stay: "Stay aboard", bar: "Next Door", books: "Borrowed Pages", copy: "↗ Send the link", copied: "Link copied", joinLbl: "or type their code", join: "Join", badCode: "Four letters, like KTRB", yourCode: "Your cabin", close: "Close", leave: "Go alone", alone: "Just you in this car",
    aboard: "{n} aboard", joined: "Your friend is here", left: "Your friend left", knock: "knock knock", write: "Write on the glass…",
    sound: "Sound", controls: "All controls", shuffle: "Somewhere else", connecting: "Joining the cabin…", lost: "Lost the cabin's signal — retrying", host: "You're steering the journey",
    tunnelOut: "Out of the tunnel —", pass: "An express train thunders past", star: "A shooting star — make a wish", rainIn: "Rain on the glass", fogIn: "Fog rolls in", snowIn: "Snow begins to fall", clearIn: "The sky clears"
  };
  var cfg = { url: "", key: "", rt: "" };
  var S = { boarded: false, code: "", tx: null, me: rid(), joined: Date.now(), peers: {}, notes: {}, lastSync: 0, net: "" };
  function rid() { return Math.random().toString(36).slice(2, 10); }
  var say = window.showWindowToast;
  window.showWindowToast = function (m) { if (!document.body.classList.contains("cb-on") || toast.ok) try { say(m); } catch (e) {} };
  function toast(m) { toast.ok = true; try { window.showWindowToast(m); } catch (e) {} toast.ok = false; }

  /* ---------- look & feel ---------- */
  var css = "#sanctuaryWelcomeOverlay,#zenFloatingControls,#portraitBanner,.tw-learn,[onclick='cycleCabinLamp()']{display:none!important}" +   /* no lamp switch: the car's light follows the hour */
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
    ".cb-cat{position:absolute;left:0;bottom:2%;z-index:24;width:clamp(56px,9%,96px);aspect-ratio:18/14;padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(2px 2px 0 rgba(0,0,0,.35))}.cb-cat svg{width:100%;height:100%;overflow:visible;image-rendering:pixelated}.cb-cat.rev svg{transform:scaleX(-1)}" +
    ".cb-cat .legs{animation:cbStep .3s steps(1) infinite}.cb-cat .legs.l2{animation-direction:reverse}.cb-cat.sit .legs{animation:none}.cb-cat .tail{transform-origin:3px 6px;animation:cbTail 1.6s steps(2) infinite}@keyframes cbStep{50%{opacity:0}}@keyframes cbTail{50%{transform:rotate(-14deg)}}" +
    ".cb-heart{position:absolute;left:60%;top:-30%;color:#ff8fa0;font:700 18px system-ui;animation:cbUp 1.2s ease-out forwards;pointer-events:none}@keyframes cbUp{to{transform:translateY(-34px);opacity:0}}" +
    ".cb-rotate{display:none!important}" +   /* upright phones ride too: the window just grows tall */
    "@media (orientation:portrait){body.cb-on #cabinContainer{padding:4px}body.cb-on .windowsill-ledge{flex-wrap:wrap}}" +
    "@media (prefers-color-scheme:dark){.cb-card{background:#1f1915;color:#f2e8d8}.cb-card button{border-color:#f2e8d8}.cb-card button.pri{background:#f2e8d8;color:#1f1915}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- every time you board: somewhere else, some other hour, other weather, another tape ---------- */
  function shuffle() {
    try {
      var pick = function (a) { return a[(Math.random() * a.length) | 0]; };
      var st = pick(STATION_CATALOG.filter(function (x) { return x.name !== "Gulou Hutong" || Math.random() < 0.5; }));
      state.station = st; setBiome(st.biome, false);
      /* you board from Nearby: same hour and weather as Next Door, then the journey changes them */
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
  var qs = new URLSearchParams(location.search), invite = (qs.get("with") || qs.get("cabin") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  function boardCard() {
    var d = document.createElement("div"); d.className = "cb-board";
    d.innerHTML = '<div class="cb-ticket"><small>Sleeper Car No. ' + String(CAR).padStart(2, "0") + '</small><h1>' + (invite ? "🎟️ " + invite : "Train Window") + '</h1>' +
      '<button class="cb-go" type="button">' + T.board + ' <span aria-hidden="true">→</span></button><button class="cb-q" type="button" data-fb-snd aria-label="' + T.quiet + '" title="' + T.quiet + '">🔇</button></div>';
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
    setTimeout(fit, 400); return;   /* boarding never takes over the screen by itself (less intrusive); the window just fits */
    var de = document.documentElement, rq = de.requestFullscreen || de.webkitRequestFullscreen;
    if (rq && !document.fullscreenElement && !document.webkitFullscreenElement) {
      try { var p = rq.call(de, { navigationUI: "hide" }); if (p && p.then) p.then(lock, function () {}); else lock(); } catch (e) {}
    }
    else if (!rq && !standalone()) homeHint();
    function lock() { setTimeout(fit, 400); }   /* any way up: no forced landscape */
  }
  function heart(k) {   /* drawn in real pixels, so it stays a heart on a tall phone window too */
    var t = Math.PI - k * 2 * Math.PI, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    var W = cw || 1, H = ch || 1, u = Math.min(W / 260, H / 150), cx = W > H ? 0.7 : 0.5;
    return { x: cx + x * u / W, y: 0.42 - y * u / H };
  }
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
    var h = Math.min(innerHeight - chrome - 20, el.getBoundingClientRect().width * (innerHeight > innerWidth ? 1.9 : 0.68));   /* upright: a tall window; sideways: a wide one */
    el.style.setProperty("height", Math.max(170, Math.round(h)) + "px", "important");
    setTimeout(function () { try { resizeCanvas(); } catch (e) {} }, 60);
  }
  addEventListener("resize", function () { clearTimeout(fit.t); fit.t = setTimeout(fit, 120); });
  addEventListener("orientationchange", function () { setTimeout(fit, 300); });
  function boarded() {
    S.boarded = true;
    document.body.classList.add("cb-on");
    try { if (!state.zenMode) { toggleZenMode(); var wt = $("windowToast"); if (wt) wt.style.opacity = "0"; } } catch (e) {}
    setTimeout(fit, 560); dock(); tip(); setTimeout(function () { document.documentElement.classList.remove("cb-pre"); }, 640);
    setTimeout(function () { if (Math.random() < 0.6) catWalk(Math.random() < 0.5 ? "Yuzu" : "Miso", 1, true); }, 20000 + Math.random() * 20000);
    if (invite) join(invite, false); else director.start();
  }

  function inTown() { try { return document.documentElement.classList.contains("fbsh-in") || (window.parent !== window && !!window.parent.FBShell); } catch (e) { return false; } }
  /* a real city on the line: when you get there, the town keeps that city's own hour (its real local time) and the sky you
     arrived under. Slow Clock can still change both. Made-up stops keep the town as it was. */
  var TZ = { fr: "Europe/Paris", de: "Europe/Berlin", ch: "Europe/Zurich", it: "Europe/Rome", es: "Europe/Madrid", ca: "Europe/Madrid", uk: "Europe/London", cy: "Europe/London", cn: "Asia/Shanghai", hk: "Asia/Hong_Kong", jp: "Asia/Tokyo" };
  var TZ_US = { "Grand Central": "America/New_York", "Flagstaff": "America/Phoenix", "Glacier Park": "America/Denver", "Santa Barbara": "America/Los_Angeles" };
  var lastCity = null;
  function tzOf(st) { if (!st || !st.look) return null; if (st.look === "us") return TZ_US[st.name] || null; return TZ[st.tongue] || TZ[st.look] || null; }
  function cityHour(tz) { try { var p = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()), h = 0, m = 0; p.forEach(function (x) { if (x.type === "hour") h = +x.value; if (x.type === "minute") m = +x.value; }); return (h % 24) + m / 60; } catch (e) { return null; } }
  function townTakesCity(st) {
    var tz = tzOf(st), W = window.FBWorld; if (!tz || !W || !W.setHour || (st && st.name === lastCity)) return;
    var h = cityHour(tz); if (h == null) return; lastCity = st.name;
    var w = state.weather || "clear"; if (w === "snow" && !/snow|alpine/.test(st.biome || "")) w = "rain";
    try { W.setHour(h); W.set(w); } catch (e) {}
    var tod = h < 5 ? "night" : h < 7.5 ? "dawn" : h < 17 ? "afternoon" : h < 19.5 ? "sunset" : "night"; if (tod !== state.timeOfDay) setTimeOfDay(tod); if (w !== state.weather) setWeather(w);
    try { var hh = Math.floor(h), mm = Math.floor((h - hh) * 60); toast("🕰 " + st.name + " · " + ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2)); } catch (e) {}
  }

  /* 🔀: the window goes dark for a breath and opens somewhere else (in a shared cabin everyone aboard sees the new view) */
  function somewhereElse() {
    var vpEl = vp(); if (vpEl) { vpEl.style.transition = "opacity .5s"; vpEl.style.opacity = "0"; }
    setTimeout(function () {
      try {
        var pick = function (a) { return a[(Math.random() * a.length) | 0]; };
        if (state.inTunnel) toggleMountainTunnel();
        var st = pick(STATION_CATALOG.filter(function (x) { return x !== state.station; }));
        state.station = st; setBiome(st.biome, false); setTimeOfDay(pick(TIMES)); setWeather(pickWeather());
        state.trainState = "CRUISING"; state.stationScrollOffset = -cw * 6; syncHUDAndButtons();
      } catch (e) { shuffle(); }
      if (vpEl) vpEl.style.opacity = "1";
      try { if (state.station) toast("🚉 " + state.station.name); } catch (e) {}
      setTimeout(function () { townTakesCity(state.station); }, 1800);
      try { if (S.code) sync(); } catch (e) {}
    }, 520);
  }

  /* ---------- the dock: shuffle and share (sound lives in the top bar in town) ---------- */
  var D, seatsEl, idleT;
  function dock() {
    D = document.createElement("div"); D.className = "cb-dock"; D.setAttribute("role", "toolbar"); D.setAttribute("aria-label", "Cabin");
    D.innerHTML = '<span class="cb-seats" aria-live="polite"></span><button type="button" data-a="sound" data-fb-snd aria-label="' + T.sound + '">🔊</button><button type="button" data-a="shuffle" aria-label="' + T.shuffle + '" title="' + T.shuffle + '">🔀</button><button type="button" data-a="share" aria-label="' + T.share + '" title="' + T.share + '">👥</button>';
    document.body.appendChild(D); seatsEl = D.querySelector(".cb-seats");
    var credit = document.querySelector(".fbg"); if (credit) D.appendChild(credit); else setTimeout(function () { var c = document.querySelector(".fbg"); if (c && D) D.appendChild(c); }, 1500);
    D.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.a === "sound") { try { toggleAudioEngine(); } catch (x) {} paintDock(); }
      if (b.dataset.a === "share") shareSheet();
      if (b.dataset.a === "shuffle") somewhereElse();
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
  /* the same pixel cats as everywhere in town (FBWorld.PETS, drawn like Next Door's sprites) */
  var PET = (window.FBWorld && FBWorld.PETS) || { miso: { b: "#231b17", d: "#3a2f29", e: "#f2c94c", nose: "#c98272" }, yuzu: { b: "#e8913a", d: "#b5611d", belly: "#f8dcae", e: "#4f9a62", nose: "#e07a8a" } };
  var CAT = { Yuzu: PET.yuzu, Miso: PET.miso };
  function catSvg(c) {
    if (window.FBWorld && FBWorld.petSvg) return FBWorld.petSvg(c.toLowerCase());
    var C = CAT[c], r = function (x, y, w, h, f) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"/>'; };
    return '<svg viewBox="0 0 18 14" shape-rendering="crispEdges" aria-hidden="true">' + r(4, 6, 11, 5, C.b) + r(13, 2, 5, 5, C.b) + r(13, 0, 2, 2, C.b) + r(16, 0, 2, 2, C.b) + r(14, 3, 1, 1, C.e) + r(16, 3, 1, 1, C.e) + '</svg>';
  }
  function catWalk(name, dir, sit) {
    if (!S.boarded || document.querySelector(".cb-cat")) return;
    try { var cw = window.FBWorld && FBWorld.cats ? FBWorld.cats() : null; if (cw) { var on = ["Yuzu", "Miso"].filter(function (k) { return cw[k.toLowerCase()] === "train"; }); if (!on.length) return; if (on.indexOf(name) < 0) name = on[0]; } } catch (e) {}   /* only a cat who's on the train walks the aisle */
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

  /* ---------- getting off at the hutong: Next Door and the book corner ---------- */
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
    w.innerHTML = '<div class="cb-card" role="dialog" aria-modal="true" aria-label="' + HUTONG + '"><small class="cb-stn">' + HUTONG + '</small><div class="cb-doors">' + door("bar", "🍸", T.bar, "../next-door/") + door("books", "📚", T.books, "../borrowed-pages/") + '</div><div class="row"><button type="button" data-a="stay">' + T.stay + "</button></div></div>";
    document.body.appendChild(w);
    w.addEventListener("click", function (e) { if (e.target === w || e.target.closest('[data-a="stay"]')) { w.remove(); director.next.depart = Date.now() + 3000; } });
  }
  /* ---------- the line passes the town's wild places: pull the cord and step off there ---------- */
  var WILDSTOP = { lake: "lake", snow: "peaks", alpine: "pasture", coastal: "sea", forest: "forest", countryside: "meadow" }, cordFor = null;
  var CW = { cord: ["Pull the cord", "拉一下停车绳", "拉一下停車繩", "Tira de la cuerda", "Estira la corda"], off: ["Step off at {p}", "在{p}下车", "在{p}下車", "Bájate en {p}", "Baixa a {p}"], stay: ["Stay aboard", "继续坐车", "繼續坐車", "Quédate a bordo", "Queda't a bord"], stop: ["Request stop · Nearby", "请求停车 · 近邻", "請求停車 · 近鄰", "Parada solicitada · Cerca", "Parada sol·licitada · A Prop"] };
  function cw5(k, p) { var i = { en: 0, zh: 1, "zh-Hant": 2, es: 3, ca: 4 }[(window.FBL && FBL.get && FBL.get()) || "en"] || 0; return (CW[k][i] || CW[k][0]).replace("{p}", p || ""); }
  function wildHere() { var k = WILDSTOP[state.biome]; return k && window.FBWorld && FBWorld.PLACES && FBWorld.PLACES[k] && !state.inTunnel ? k : null; }
  function wildName(k) { try { return FBWorld.name(k); } catch (e) { return k; } }
  function cord() {
    var k = wildHere(), el = $("cbCord"), bz = document.querySelector(".window-bezel"); if (!bz) return;
    if (!el) { el = document.createElement("button"); el.type = "button"; el.id = "cbCord"; el.setAttribute("data-fbt-skip", ""); el.innerHTML = '<i aria-hidden="true"></i><b aria-hidden="true"></b><span></span>'; bz.appendChild(el);
      el.addEventListener("click", function () { var kk = wildHere(); if (!kk) return; el.classList.add("pull"); setTimeout(function () { el.classList.remove("pull"); }, 600); bell(); cordFor = kk;
        if (state.trainState === "STOPPED") wildCard(kk); else if (state.trainState === "CRUISING") { triggerStationStopOrDepart(); director.next.depart = Date.now() + 60e3; } }); }
    el.hidden = !k || !S.boarded; if (k) { var lab = cw5("cord") + " · " + wildName(k); el.querySelector("span").textContent = lab; el.setAttribute("aria-label", lab); el.title = lab; }
    if (cordFor && state.trainState === "STOPPED" && !document.querySelector(".cb-off")) wildCard(cordFor);
  }
  function bell() { try { kctx = kctx || new (window.AudioContext || window.webkitAudioContext)(); var t0 = kctx.currentTime; [1320, 1760].forEach(function (f, i) { var o = kctx.createOscillator(), g = kctx.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0 + i * 0.12); g.gain.exponentialRampToValueAtTime(0.18, t0 + i * 0.12 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.12 + 0.9); o.connect(g); g.connect(kctx.destination); o.start(t0 + i * 0.12); o.stop(t0 + i * 0.12 + 1); }); } catch (e) {} }
  function wildCard(k) {
    cordFor = null; director.next.depart = Date.now() + 60e3;
    var w = document.createElement("div"), ic = (FBWorld.icon && FBWorld.icon(k)) || "🌿"; w.className = "cb-sheet cb-off";
    w.innerHTML = '<div class="cb-card" role="dialog" aria-modal="true"><small class="cb-stn"></small><div class="cb-doors" style="grid-template-columns:1fr"><a class="cb-door on"><b aria-hidden="true"></b><span></span><small></small></a></div><div class="row"><button type="button" data-a="stay"></button></div></div>';
    w.querySelector(".cb-stn").textContent = cw5("stop"); w.querySelector(".cb-door").href = FBWorld.url(k); w.querySelector(".cb-door b").textContent = ic; w.querySelector(".cb-door span").textContent = wildName(k);
    w.querySelector(".cb-door small").textContent = cw5("off", wildName(k)) + " →"; w.querySelector('[data-a="stay"]').textContent = cw5("stay");
    document.body.appendChild(w);
    w.addEventListener("click", function (e) { if (e.target === w || e.target.closest('[data-a="stay"]')) { w.remove(); director.next.depart = Date.now() + 3000; } });
  }
  var cordCss = document.createElement("style"); cordCss.textContent = "#cbCord{position:absolute;z-index:46;top:6px;right:22px;display:flex;flex-direction:column;align-items:flex-end;gap:0;padding:0 4px 4px;border:0;background:none;cursor:pointer;color:#f6e7c8;font:600 10px/1.2 ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}" +
    "#cbCord i{display:block;width:2px;height:34px;margin-right:5px;background:linear-gradient(#5a3b20,#c99a56)}#cbCord b{display:block;width:12px;height:22px;border-radius:5px;background:linear-gradient(#b9772c,#6b3a1b);box-shadow:inset 0 2px 0 rgba(255,230,180,.45),0 2px 4px rgba(0,0,0,.5)}" +
    "#cbCord span{max-width:0;overflow:hidden;white-space:nowrap;margin-top:4px;padding:2px 0;border-radius:3px;background:rgba(20,12,8,.7);transition:max-width .4s,padding .4s}#cbCord:hover span,#cbCord:focus-visible span{max-width:220px;padding:2px 6px}" +
    "#cbCord.pull i{animation:cbPull .6s ease}@keyframes cbPull{40%{height:50px}}#cbCord[hidden]{display:none}#cbCord:focus-visible{outline:2px solid #f6b73c;outline-offset:2px}@media (hover:none){#cbCord span{max-width:180px;padding:2px 6px;opacity:.85}}";
  document.head.appendChild(cordCss);
  setInterval(cord, 1000);

  /* writing on the glass is wiping the mist with a fingertip; friends in the cabin see the same strokes */
  var pen = null;
  function finger(a, b, w) {
    try {
      mistCtx.save(); mistCtx.globalCompositeOperation = "destination-out"; mistCtx.lineCap = mistCtx.lineJoin = "round";
      mistCtx.strokeStyle = "rgba(0,0,0,0.92)"; mistCtx.lineWidth = w || Math.max(12, Math.min(26, cw * 0.016));
      mistCtx.beginPath(); mistCtx.moveTo(a.x * cw, a.y * ch); mistCtx.lineTo(b.x * cw + 0.01, b.y * ch); mistCtx.stroke(); mistCtx.restore();
    } catch (e) {}
  }
  /* strokes travel in shape-safe units (from the centre, in multiples of the window's short side), so a heart drawn on a wide screen is still a heart on a phone held upright */
  function sq() { return Math.min(cw, ch) || 1; }
  function toS(p) { var S = sq(); return [+((p.x * cw - cw / 2) / S).toFixed(4), +((p.y * ch - ch / 2) / S).toFixed(4)]; }
  function fromS(q) { var S = sq(); return { x: (cw / 2 + q[0] * S) / cw, y: (ch / 2 + q[1] * S) / ch }; }
  function flush() { if (!pen || pen.length < 2) return; send("ink", { s: 1, pts: pen.map(toS) }); pen = [pen[pen.length - 1]]; }
  function inkFrom(p) { if (!p || !p.pts) return; var P = p.pts.map(function (q) { return p.s ? fromS(q) : { x: q[0], y: q[1] }; }); for (var i = 1; i < P.length; i++) finger(P[i - 1], P[i]); }
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
      else if (now > n.station && state.trainState === "CRUISING" && !state.inTunnel) { triggerStationStopOrDepart(); n.depart = now + 22e3; changed = true; setTimeout(function () { townTakesCity(state.station); }, 2500); }
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
      if (v.station && (!state.station || state.station.name !== v.station)) { var st = STATION_CATALOG.filter(function (s) { return s.name === v.station; })[0]; if (st) { state.station = st; setTimeout(function () { townTakesCity(st); }, 2500); } }
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
  function link() { var u = new URL(location.href); u.search = "?with=" + S.code; u.hash = ""; return u.toString(); }
  function join(code, creating) {
    S.code = code; seats();
    if (S.tx) S.tx.close();
    S.tx = transport(code, onMsg, function (st) { S.net = st; if (st === "bad") toast(T.lost); });
    if (creating) director.start(); else { director.stop(); toast(T.connecting); setTimeout(reelect, 8000); }
    try { history.replaceState(null, "", "?with=" + code); } catch (e) {}
  }
  function leave() { if (S.tx) { send("bye", {}); S.tx.close(); } S.tx = null; S.code = ""; S.peers = {}; seats(); director.start(); try { history.replaceState(null, "", location.pathname); } catch (e) {} }
  function shareSheet() {
    if (!S.code) join(newCode(), true);
    var w = document.createElement("div"); w.className = "cb-sheet";
    w.innerHTML = '<div class="cb-card" role="dialog" aria-modal="true" aria-labelledby="cb-sh"><h2 id="cb-sh"><span aria-hidden="true">👥 </span>' + T.share + '</h2><div class="code" aria-label="' + T.yourCode + '">' + S.code + '</div>' +
      '<div class="row"><button type="button" class="pri" data-a="copy">' + T.copy + '</button><button type="button" data-a="close">' + T.close + '</button></div>' +
      '<form class="cb-join"><label for="cb-jc">' + T.joinLbl + '</label><div class="row"><input id="cb-jc" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="····" inputmode="text"><button type="submit">' + T.join + '</button></div><p class="mut cb-jerr" aria-live="polite"></p></form>' +
      '<div class="row"><button type="button" data-a="leave">' + T.leave + '</button></div></div>';
    document.body.appendChild(w);
    var jc = w.querySelector("#cb-jc");
    jc.addEventListener("input", function () { jc.value = jc.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4); });
    w.querySelector(".cb-join").addEventListener("submit", function (e) {
      e.preventDefault(); var c = jc.value;
      if (c.length !== 4) { jc.focus(); if (jc.animate) jc.animate([{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 240 }); return; }   /* a nudge, not a sentence */
      w.remove(); if (c !== S.code) { if (S.tx) send("bye", {}); S.peers = {}; join(c, false); }
    });
    w.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (e.target === w) return w.remove(); if (!b) return;
      if (b.dataset.a === "copy") { var u = link(), why = window.FBG && FBG.invite ? FBG.invite("train") : ""; if (navigator.share) navigator.share({ title: "Sleeper Car No. " + String(CAR).padStart(2, "0"), text: why, url: u }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText((why ? why + " " : "") + u).then(function () { b.textContent = T.copied; }); }
      if (b.dataset.a === "close") w.remove();
      if (b.dataset.a === "leave") { leave(); w.remove(); }
    });
  }

  /* Supabase Realtime broadcast over the raw Phoenix protocol (same relay as Room Mode, works in mainland China) */
  function transport(code, onMsg, onStatus) {
    var topic = "realtime:fbtrain-" + code;
    if (!cfg.done) {   /* an invite link can join before the keys have loaded: wait for them, so both sides meet on the same channel */
      var inner = null, gone = false, q = [];
      (function wait() { if (gone) return; if (!cfg.done) return setTimeout(wait, 100); inner = transport(code, onMsg, onStatus); q.forEach(function (a) { inner.send(a[0], a[1]); }); })();
      return { send: function (ev, p) { if (inner) inner.send(ev, p); else q.push([ev, p]); }, close: function () { gone = true; if (inner) inner.close(); } };
    }
    if (!cfg.url) {   /* no keys yet (offline preview): connect tabs on this device */
      var bc = null; try { bc = new BroadcastChannel("fb_train_" + code); bc.onmessage = function (e) { onMsg(e.data.event, e.data.payload); }; } catch (e) {}
      setTimeout(function () { onMsg("_ready", {}); }, 0);
      return { send: function (ev, p) { try { bc && bc.postMessage({ event: ev, payload: p }); } catch (e) {} }, close: function () { try { bc && bc.close(); } catch (e) {} } };
    }
    var att = 0, ws = null, ref = 0, hb = null, closed = false, tries = 0, joined = false;
    var base = (cfg.rt || cfg.url.replace(/^http/, "ws") + "/realtime/v1/websocket").replace(/\/$/, "");
    var url = base + (base.indexOf("?") >= 0 ? "&" : "?") + "apikey=" + encodeURIComponent(cfg.key) + "&vsn=1.0.0";
    var raw = function (m) { try { ws && ws.readyState === 1 && ws.send(JSON.stringify(m)); } catch (e) {} };
    function connect() {
      onStatus("connecting");
      try { if (window.FBWorld && FBWorld.rtUrl) url = FBWorld.rtUrl(cfg, att++); ws = new WebSocket(url); } catch (e) { return retry(); }
      ws.onopen = function () { tries = 0; raw({ topic: topic, event: "phx_join", ref: String(++ref), payload: { config: { broadcast: { self: false, ack: false }, presence: { key: "" }, private: !!(window.FBWorld && FBWorld.rtPriv && FBWorld.rtPriv()) }, access_token: cfg.key } }); clearInterval(hb); hb = setInterval(function () { raw({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++ref) }); }, 25000); };
      ws.onmessage = function (e) {
        var m; try { m = JSON.parse(e.data); } catch (_) { return; }
        if (m.event === "phx_reply" && m.topic === topic && m.payload && m.payload.status === "ok" && !joined) { joined = true; if (window.FBWorld && FBWorld.rtGood) FBWorld.rtGood(url); onStatus("ok"); onMsg("_ready", {}); }
        else if (m.event === "phx_reply" && m.topic === topic && m.payload && m.payload.status === "error" && !joined) { if (window.FBWorld && FBWorld.rtPriv) FBWorld.rtPriv(true); att--; try { ws.close(); } catch (_) {} }   /* a project that only allows private channels: rejoin as private */
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
  (function keys() { var sc = document.createElement("script"); sc.src = "/config.js"; sc.onload = sc.onerror = function () { var c = window.FB_SUPABASE || {}; cfg.url = c.url || ""; cfg.key = c.anonKey || ""; cfg.rt = c.realtimeUrl || ""; cfg.done = true; }; document.head.appendChild(sc); })();

  window.FBCabin = { T: T, state: S, director: director, join: join, leave: leave };
  setTimeout(function () { document.documentElement.classList.remove("cb-pre"); }, 6000);   /* never leave the car dark */
  /* every boarding finds a different car and seat: a small brass plate on the frame */
  var CAR = window.FB_CAR = 1 + Math.floor(Math.random() * 12), SEAT = 1 + Math.floor(Math.random() * 40);
  function plate() {
    var l = (window.FBL && FBL.get && FBL.get()) || "en", t = { en: "CAR {c} · SEAT {s}", zh: "{c} 号车厢 · {s} 座", "zh-Hant": "{c} 號車廂 · {s} 座", es: "COCHE {c} · ASIENTO {s}", ca: "COTXE {c} · SEIENT {s}" }[l] || "CAR {c} · SEAT {s}";
    var el = $("cbPlate"), bz = document.querySelector(".window-bezel"); if (!bz) return;
    if (!el) { el = document.createElement("div"); el.id = "cbPlate"; el.setAttribute("aria-hidden", "true"); el.setAttribute("data-fbt-skip", ""); bz.appendChild(el); }
    el.textContent = t.replace("{c}", CAR).replace("{s}", SEAT);
    var hud = $("hudLineCode"); if (hud && state && state.station) hud.textContent = "CAR " + String(CAR).padStart(2, "0") + " • " + state.station.code;
  }
  var pcss = document.createElement("style"); pcss.textContent = "#cbPlate{position:absolute;z-index:45;top:14px;left:22px;padding:2px 7px;border-radius:3px;background:linear-gradient(#d9b46a,#a9802f);color:#2a1a08;font:700 10px/1.3 ui-monospace,'SF Mono',Menlo,monospace;letter-spacing:.12em;box-shadow:0 1px 0 rgba(255,240,200,.5) inset,0 2px 4px rgba(0,0,0,.5);opacity:.88;pointer-events:none}@media (max-width:640px){#cbPlate{top:12px;left:16px;font-size:9px}}"; document.head.appendChild(pcss);
  /* the coach you board matches where the line starts: a city commuter, a mountain railway in pine, a seaside tram, or the old wooden sleeper */
  var COACH = { metropolis: "commuter", alpine: "mountain", coastal: "tram" };
  function coach() { try { var k = COACH[state.station && state.station.biome] || "sleeper"; document.body.classList.add("cb-coach-" + k); } catch (e) {} }
  var ccss = document.createElement("style"); ccss.textContent =
    "body.cb-coach-commuter.wood-wall{background-color:#1b2026;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.03) 0 1px,transparent 1px 46px),linear-gradient(#232a31,#14181d)!important}" +
    "body.cb-coach-commuter .window-bezel{background:linear-gradient(145deg,#59626b,#363d44 50%,#22272c)!important;border-color:#6b747d!important;border-top-color:#8a939b!important;border-bottom-color:#1c2024!important;box-shadow:inset 0 6px 18px rgba(0,0,0,.8),inset 0 0 0 2px #9aa3ab,0 18px 48px rgba(0,0,0,.9)!important}" +
    "body.cb-coach-commuter .windowsill-ledge{background:linear-gradient(#4a535b,#2b3136)!important;border-top-color:#7d868e!important}body.cb-coach-commuter .window-recess{border-color:#1e2328!important;border-radius:10px!important}body.cb-coach-commuter #cbPlate{background:linear-gradient(#e9edf0,#b9c1c7);color:#1d2329}" +
    "body.cb-coach-mountain.wood-wall{background-color:#2a1a0c;background-image:repeating-linear-gradient(90deg,rgba(255,220,160,.05) 0 3px,transparent 3px 30px),radial-gradient(circle at 30% 40%,rgba(255,190,110,.12),transparent 60%),linear-gradient(#3a2512,#22150a)!important}" +
    "body.cb-coach-mountain .window-bezel{background:linear-gradient(145deg,#a0703c,#7a5128 50%,#543617)!important;border-color:#b78550!important;border-top-color:#cf9c62!important;border-bottom-color:#3c250f!important}" +
    "body.cb-coach-mountain .windowsill-ledge{background:repeating-linear-gradient(90deg,rgba(255,230,180,.06) 0 3px,transparent 3px 26px),linear-gradient(#9a6a36,#6a4520)!important;border-top-color:#c99358!important}" +
    "body.cb-coach-tram.wood-wall{background-color:#1d3a30;background-image:linear-gradient(#24493c 0 62%,#e6dcc1 62% 64%,#1b342b 64%)!important}" +
    "body.cb-coach-tram .window-bezel{background:linear-gradient(145deg,#efe5cb,#d6c9a6 50%,#b7a77f)!important;border-color:#2f5d4a!important;border-top-color:#3d7560!important;border-bottom-color:#1d3a2f!important;box-shadow:inset 0 6px 18px rgba(0,0,0,.55),inset 0 0 0 2px #2f5d4a,0 18px 48px rgba(0,0,0,.85)!important}" +
    "body.cb-coach-tram .windowsill-ledge{background:linear-gradient(#2f5d4a,#1d3a2f)!important;border-top-color:#4c8a72!important}body.cb-coach-tram .window-recess{border-color:#1d3a2f!important;border-radius:26px!important}body.cb-coach-tram #cbPlate{background:linear-gradient(#2f5d4a,#1f4033);color:#efe5cb}";
  document.head.appendChild(ccss);
  /* someone else is on the train right now (anonymous presence from the shell): their reflection in the glass, across the
     aisle, a cup of tea steaming in front of them. No name, nothing to tap; it fades in and out with them. */
  function aboard() { try { var P = window.parent; return P !== window && P.FBShell && P.FBShell.others ? P.FBShell.others("train") : 0; } catch (e) { return 0; } }
  function across() {
    var vpEl = vp(); if (!vpEl) return; var r = $("cbAcross");
    if (!r) { r = document.createElement("div"); r.id = "cbAcross"; r.setAttribute("aria-hidden", "true");
      r.innerHTML = '<svg viewBox="0 0 120 140" width="100%" height="100%"><g fill="#ffe2b8"><circle cx="64" cy="38" r="17"/><path d="M30 140c0-38 14-62 34-62s36 24 36 62z"/><path d="M58 30c4-12 22-14 26 2-8-6-18-6-26-2z" opacity=".6"/></g><g fill="#fff3dc"><rect x="22" y="104" width="22" height="18" rx="3"/><path d="M44 108h5a5 5 0 0 1 0 10h-5" fill="none" stroke="#fff3dc" stroke-width="2.5"/></g><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" class="st"><path d="M28 98c-4-6 4-8 0-14"/><path d="M37 98c-4-6 4-8 0-14"/></g></svg>';
      vpEl.appendChild(r); }
    r.classList.toggle("on", aboard() > 0);
  }
  var acss = document.createElement("style"); acss.textContent = "#cbAcross{position:absolute;z-index:4;right:7%;bottom:6%;width:min(22%,150px);aspect-ratio:120/140;pointer-events:none;opacity:0;transition:opacity 6s ease;mix-blend-mode:screen;filter:blur(1.2px)}#cbAcross.on{opacity:.16}#cbAcross .st{animation:cbSt 3.2s ease-in-out infinite;opacity:.7}@keyframes cbSt{50%{transform:translateY(-4px);opacity:.25}}@media (prefers-reduced-motion:reduce){#cbAcross .st{animation:none}}";
  document.head.appendChild(acss);
  addEventListener("load", function () { across(); setInterval(across, 5000); });
  addEventListener("load", plate); setInterval(function () { if (plate.l !== ((window.FBL && FBL.get && FBL.get()) || "en")) { plate.l = (window.FBL && FBL.get && FBL.get()) || "en"; plate(); } }, 800);
  /* phones: dragging the shade or drawing on the mist must not pull the page down to refresh */
  ["windowViewport", "shadeDragHandle"].forEach(function (id) { var el = $(id); if (el) el.addEventListener("touchmove", function (e) { if (e.cancelable) e.preventDefault(); }, { passive: false }); });
  addEventListener("load", function () {
    if (!invite) shuffle(); coach();
    glass();
    /* in town the shell's first tap already woke the sound: no ticket, you are simply on the train */
    if (inTown()) { boarded(); (window.FB_SOUND_ON = window.FB_SOUND_ON || []).push(function () { unlockAudio(); try { if (!isAudioPlaying) toggleAudioEngine(); if (typeof audioCtx !== "undefined" && audioCtx && audioCtx.resume) audioCtx.resume(); } catch (e) {} paintDock(); }); }
    else boardCard();
    /* (no "turn your phone" screen: the train runs upright too) */
  });
})();
