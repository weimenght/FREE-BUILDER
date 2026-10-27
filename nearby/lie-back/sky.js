/* Sora — the sky is the interface.
   - drag across the sky: the breeze follows your finger and the trail you leave puffs into a little cloud and drifts off
     (write a worry, draw anything: it evaporates)
   - press and hold: breathe in as the ring grows, let go to breathe out
   - double-tap: the clouds gather into a shape; now and then they do it on their own
   - tap the grass: dandelion seeds
   - the sky follows your clock; each visit brings something else (a rainbow, a plane, shooting stars, fireflies, and a visitor that belongs to the place: geese, an eagle, gulls, herons, falling leaves, a hawk, snowflakes)
   Uses the engine's globals: state, cw, ch, setSkyPalette, triggerRandomPareidolia, spawnDandelionGust, toggleAudioEngine … */
(function () {
  "use strict";
  if (typeof state !== "object" || typeof setSkyPalette !== "function") return;
  var TAU = Math.PI * 2, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nothing on screen but sky ---------- */
  var css = "#topHudBar,#bottomHudDock,#skyHintLine,#soundMixerPanel,#pareidoliaPickerPanel,#thoughtReleasePanel,#pareidoliaWhisper,#breathingGuideContainer{display:none!important}" +
    "#skyFx{position:fixed;inset:0;width:100%;height:100%;z-index:6;pointer-events:none}" +
    "#skyCanvas{transition:transform .8s ease-out}" +
    ".sk-breath{position:fixed;z-index:8;left:0;top:0;width:220px;height:220px;margin:-110px 0 0 -110px;border-radius:50%;pointer-events:none;border:1.5px solid rgba(255,255,255,.75);background:radial-gradient(circle,rgba(255,255,255,.22),rgba(255,255,255,.04) 70%);box-shadow:0 0 60px rgba(255,255,255,.35),inset 0 0 40px rgba(255,255,255,.2);transform:scale(.15);opacity:0;transition:transform 4s cubic-bezier(.3,.1,.3,1),opacity .6s}" +
    ".sk-breath.in{transform:scale(1);opacity:1}.sk-breath.out{transform:scale(.15);opacity:0;transition:transform 6s cubic-bezier(.3,.1,.3,1),opacity 6s ease-in}" +
    ".sk-breath::after{content:'';position:absolute;inset:34%;border-radius:50%;border:1px solid rgba(255,255,255,.6)}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var fx = document.createElement("canvas"); fx.id = "skyFx"; fx.setAttribute("aria-hidden", "true"); document.body.appendChild(fx);
  var g = fx.getContext("2d"), W = 0, H = 0, DPR = 1;
  function size() { DPR = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; fx.width = W * DPR; fx.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0); }
  size(); addEventListener("resize", size);

  /* ---------- the sky keeps your time ---------- */
  function byClock() { var h = window.FBWorld ? FBWorld.hour() : new Date().getHours() + new Date().getMinutes() / 60;   /* Nearby's hour for this visit */ return h >= 5 && h < 10.5 ? "morning" : h >= 10.5 && h < 16.5 ? "noon" : h >= 16.5 && h < 19.5 ? "dusk" : "night"; }
  var sky = byClock(); setSkyPalette(sky);
  setInterval(function () { var k = byClock(); if (k !== sky) { sky = k; setSkyPalette(k); } }, 60e3);
  function night() { return sky === "night"; }

  /* ---------- each visit, somewhere else to lie down: a meadow, a mountain, the sea… (drawn by land.js) ---------- */
  var pick = function (a) { return a[(Math.random() * a.length) | 0]; };
  var SCENE = (function () { var all = ["meadow", "mountain", "sea", "lake", "forest", "dunes", "snow"], last = null; try { last = localStorage.getItem("sora_scene"); } catch (e) {} var k, want = null; try { want = new URLSearchParams(location.search).get("place"); } catch (e) {} if (all.indexOf(want) >= 0) k = want; else do { k = pick(all); } while (k === last); try { localStorage.setItem("sora_scene", k); } catch (e) {} return k; })();
  window.SORA_SCENE = SCENE;
  /* dandelions belong to meadows (and a few drift up a mountain); the sea, the lake, the forest, the dunes and the snow do without */
  var SEEDS = { meadow: 99, mountain: 5 }[SCENE] || 0;
  function trimSeeds() { try { if (state.dandelions && state.dandelions.length > SEEDS) state.dandelions.length = SEEDS; } catch (e) {} }
  trimSeeds(); setInterval(trimSeeds, 500);
  if (!SEEDS) try { window.spawnDandelionGust = function () {}; } catch (e) {}
  /* what grows by your face in each place */
  var FLORA = {
    meadow: { n: 1, tall: 1, far: null, near: null, flowers: ["#ffffff", "#ffe066", "#c9a6ff", "#ff9fb2"], fl: 0.07, seed: 0.08 },
    mountain: { n: 0.6, tall: 0.7, far: [110, 140, 90], near: [70, 100, 60], flowers: ["#ffffff", "#4a6cff", "#ffe066"], fl: 0.1, seed: 0.02 },
    sea: { n: 0.32, tall: 1.25, far: [196, 176, 120], near: [150, 140, 90], flowers: [], fl: 0, seed: 0.15 },
    lake: { n: 0.45, tall: 1.7, far: [96, 130, 80], near: [60, 90, 50], flowers: [], fl: 0, seed: 0.22, reed: true },
    forest: { n: 0.5, tall: 0.9, far: [60, 100, 55], near: [34, 70, 40], flowers: ["#ffffff", "#f6f3d8"], fl: 0.05, seed: 0 },
    dunes: { n: 0.14, tall: 1.3, far: [200, 170, 110], near: [170, 140, 90], flowers: [], fl: 0, seed: 0.1 },
    snow: { n: 0.1, tall: 0.6, far: [150, 160, 140], near: [120, 130, 110], flowers: [], fl: 0, seed: 0 }
  }[SCENE];
  var X = night() ? { stars: true, flies: Math.random() < 0.7 } : { rainbow: Math.random() < 0.3, shower: Math.random() < 0.3, visitor: Math.random() < 0.6, plane: Math.random() < 0.6, flies: sky === "dusk" && Math.random() < 0.6 };
  try { var WW = window.FBWorld && FBWorld.weather(); if (WW && !night()) { X.shower = WW === "rain" || WW === "storm"; if (WW === "fog" || WW === "snow") X.rainbow = false; } } catch (e) {}   /* rain in Nearby rains here too */
  if (X.shower) X.rainbow = false;   /* a passing shower brings its own rainbow afterwards */
  if (SCENE === "snow") { X.flies = false; X.shower = false; X.rainbow = false; } if (SCENE === "dunes") { X.shower = false; X.rainbow = false; }
  try { if (typeof setBreezeSpeed === "function") setBreezeSpeed(pick([50, 90, 130, 180])); } catch (e) {}

  /* ---------- sound starts with your first touch ---------- */
  var heard = false;
  function wake() {
    if (heard) return; heard = true;
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    try { var a = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="); a.loop = true; a.volume = 0; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
    try { if (!isAudioPlaying) toggleAudioEngine(); } catch (e) {}
    try { if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") DeviceOrientationEvent.requestPermission().then(tilt, function () {}); else tilt(); } catch (e) {}
  }
  /* ---------- tilt the phone: the sky shifts a little, like turning your head in the grass ---------- */
  var tilted = false;
  function tilt() {
    if (tilted || reduce) return; tilted = true;
    addEventListener("deviceorientation", function (e) { if (e.gamma == null) return; var x = Math.max(-1, Math.min(1, e.gamma / 30)), y = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30)); $sky.style.transform = "scale(1.04) translate(" + (x * 10) + "px," + (y * 6) + "px)"; try { state.breezeSpeed = Math.max(0.2, Math.min(2.4, (state.breezeSpeed || 1) * 0.98 + (1 + x) * 0.02)); } catch (er) {} });
  }
  var $sky = document.getElementById("skyCanvas");

  /* ---------- gestures ---------- */
  var down = null, trail = [], ring = null, holdT = null, lastTap = 0, breathing = false;
  addEventListener("pointerdown", function (e) {
    if (e.target.closest && e.target.closest("button,a,input,.fbl-menu,.fbg,.fbc-card")) return;
    wake();
    down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
    trail = [{ x: e.clientX, y: e.clientY, a: 1 }];
    clearTimeout(holdT); holdT = setTimeout(function () { if (down && !down.moved) breatheIn(down.x, down.y); }, 420);
  });
  addEventListener("pointermove", function (e) {
    if (!down) return;
    if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) { down.moved = true; clearTimeout(holdT); }
    if (down.moved && !breathing) trail.push({ x: e.clientX, y: e.clientY, a: 1 });
  });
  addEventListener("pointerup", function (e) {
    if (!down) return; clearTimeout(holdT);
    var d = down; down = null;
    if (breathing) { breatheOut(); return; }
    if (d.moved && trail.length > 3) { evaporate(trail); trail = []; return; }
    trail = [];
    var now = performance.now();
    if (now - lastTap < 330) { lastTap = 0; if (e.pointerType !== "mouse") try { triggerRandomPareidolia(e.clientX, e.clientY); } catch (er) {} return; }   /* mice get the engine's own double-click */
    lastTap = now;
    if (e.clientY > H * 0.8) setTimeout(function () { if (lastTap === now) try { spawnDandelionGust(); } catch (er) {} }, 340);
  });
  addEventListener("pointercancel", function () { down = null; trail = []; if (breathing) breatheOut(); });

  /* breathing: the ring grows while you hold (breathe in), and shrinks slowly when you let go (breathe out) */
  function breatheIn(x, y) {
    breathing = true; if (!ring) { ring = document.createElement("div"); ring.className = "sk-breath"; document.body.appendChild(ring); }
    ring.style.left = x + "px"; ring.style.top = y + "px"; ring.className = "sk-breath"; void ring.offsetWidth; ring.className = "sk-breath in";
    try { triggerSingleWindChime(0); } catch (e) {}
  }
  function breatheOut() { breathing = false; if (ring) ring.className = "sk-breath out"; try { setTimeout(function () { triggerSingleWindChime(0.2); }, 5800); } catch (e) {} }

  /* whatever you drew rises and becomes a small cloud, then thins away */
  function evaporate(pts) {
    var step = Math.max(1, Math.floor(pts.length / 40));
    for (var i = 0; i < pts.length; i += step) {
      state.thoughtParticles.push({ char: "", x: pts[i].x, y: pts[i].y, vx: (Math.random() - 0.5) * 0.3 + 0.15, vy: -0.35 - Math.random() * 0.35, age: 40 + i / step * 1.5, puffRadius: 9 + Math.random() * 12, phase: Math.random() * TAU });
    }
    try { triggerSingleWindChime(-0.3); setTimeout(function () { triggerSingleWindChime(0.35); }, 240); } catch (e) {}
  }

  /* the clouds take a shape on their own from time to time */
  setTimeout(function auto() { if (!document.hidden) try { triggerRandomPareidolia(); } catch (e) {} setTimeout(auto, 80e3 + Math.random() * 70e3); }, 25e3 + Math.random() * 20e3);

  /* ---------- the overlay: your trail, and the visit's extras ---------- */
  /* ---------- the grass right by your face, and what grows in it ---------- */
  var blades = [], motes = [];
  function grow() {
    blades = []; var n = Math.round(Math.min(260, Math.round(W / 6)) * FLORA.n);
    for (var i = 0; i < n; i++) {
      var near = Math.random() < 0.35, r = Math.random();
      blades.push({ x: Math.random() * (W + 80) - 40, h: H * FLORA.tall * (near ? 0.12 + Math.random() * 0.14 : 0.05 + Math.random() * 0.08), w: (near ? 5 + Math.random() * 6 : 2 + Math.random() * 3) * (FLORA.reed ? 0.7 : 1), near: near, lean: (Math.random() - 0.5) * 0.5, p: Math.random() * TAU, bend: 0,
        flower: !near && r < FLORA.fl && FLORA.flowers.length ? pick(FLORA.flowers) : null, seed: near && r < FLORA.seed });
    }
    blades.sort(function (a, b) { return a.near - b.near; });
    motes = []; for (var m = 0; m < 22; m++) motes.push({ x: Math.random(), y: Math.random() * 0.8, r: 6 + Math.random() * 22, v: 0.2 + Math.random() * 0.5, p: Math.random() * TAU });
  }
  grow(); addEventListener("resize", grow);
  function rgb(a, al) { return "rgba(" + (a[0] | 0) + "," + (a[1] | 0) + "," + (a[2] | 0) + "," + al + ")"; }
  function mixc(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  var px = -999, py = -999;
  addEventListener("pointermove", function (e) { px = e.clientX; py = e.clientY; }, { passive: true });
  function grass(t) {
    var ac = (typeof activeColors !== "undefined") ? activeColors : null, far = FLORA.far || (ac ? ac.meadowFar : [90, 140, 80]), nearC = FLORA.near || (ac ? ac.meadowNear : [50, 90, 50]), sunC = ac ? ac.sunColor : [255, 240, 200];
    var dark = night() ? 0.75 : sky === "dusk" ? 0.35 : 0, breeze = (state.breezeSpeed || 1);
    for (var i = 0; i < blades.length; i++) {
      var b = blades[i], sway = Math.sin(t * (0.6 + breeze * 0.4) + b.x * 0.012 + b.p) * 0.06 * breeze;
      var dx = b.x - px, dy = (H - b.h * 0.6) - py; if (dx * dx + dy * dy < 14000) b.bend += (dx > 0 ? 0.03 : -0.03); b.bend *= 0.94;
      var ang = b.lean + sway + b.bend, tipX = b.x + Math.sin(ang) * b.h, tipY = H - Math.cos(ang) * b.h, midX = b.x + Math.sin(ang * 0.5) * b.h * 0.55, midY = H - b.h * 0.55;
      var base = b.near ? nearC : far, col = mixc(mixc(base, b.near ? [70, 120, 60] : [120, 170, 90], night() ? 0 : sky === "dusk" ? 0.15 : 0.5), [8, 12, 18], dark), lit = mixc(col, sunC, night() ? 0.05 : 0.35);
      var gr = g.createLinearGradient(b.x, H, tipX, tipY); gr.addColorStop(0, rgb(mixc(col, [0, 0, 0], 0.35), 1)); gr.addColorStop(1, rgb(lit, b.near ? 0.98 : 0.9));
      g.fillStyle = gr; g.beginPath(); g.moveTo(b.x - b.w / 2, H + 2); g.quadraticCurveTo(midX - b.w * 0.3, midY, tipX, tipY); g.quadraticCurveTo(midX + b.w * 0.3, midY, b.x + b.w / 2, H + 2); g.closePath(); g.fill();
      if (b.flower) { var fc = night() ? "rgba(200,200,220,.35)" : b.flower; g.fillStyle = fc; for (var q = 0; q < 5; q++) { g.beginPath(); g.arc(tipX + Math.cos(q * 1.257 + t * 0.2) * 3, tipY + Math.sin(q * 1.257 + t * 0.2) * 3, 2.4, 0, TAU); g.fill(); } g.fillStyle = night() ? "rgba(120,110,80,.5)" : "#f2b632"; g.beginPath(); g.arc(tipX, tipY, 1.8, 0, TAU); g.fill(); }
      if (b.seed) { g.fillStyle = FLORA.reed ? rgb(mixc([92, 58, 32], [10, 10, 15], dark), 0.95) : rgb(mixc(lit, [230, 220, 170], 0.5), 0.9); g.beginPath(); g.ellipse(tipX, tipY + (FLORA.reed ? 12 : 8), FLORA.reed ? 4 : 3, FLORA.reed ? 16 : 11, ang, 0, TAU); g.fill(); }
    }
  }
  /* sunlight in the lens: a soft glare and a few ghosts by day, rays through the clouds at dusk */
  function light(t) {
    if (night() || typeof activeColors === "undefined") return;
    var sx = W * activeColors.sunPos.x, sy = H * activeColors.sunPos.y, sc = activeColors.sunColor;
    g.save(); g.globalCompositeOperation = "lighter";
    var gl = g.createRadialGradient(sx, sy, 0, sx, sy, Math.max(W, H) * 0.45); gl.addColorStop(0, rgb(sc, 0.22)); gl.addColorStop(0.3, rgb(sc, 0.06)); gl.addColorStop(1, rgb(sc, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    if (sky === "dusk") { for (var k = 0; k < 9; k++) { var a = Math.PI * 0.55 + k * 0.11 + Math.sin(t * 0.05 + k) * 0.02, L = Math.max(W, H) * 1.2; g.fillStyle = rgb(sc, 0.035); g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a - 0.02) * L, sy + Math.sin(a - 0.02) * L); g.lineTo(sx + Math.cos(a + 0.02) * L, sy + Math.sin(a + 0.02) * L); g.closePath(); g.fill(); } }
    else { var cx = W / 2, cy = H / 2; [[0.35, 26, 0.05], [0.6, 12, 0.07], [0.9, 40, 0.035], [1.25, 18, 0.05]].forEach(function (f) { var fx2 = sx + (cx - sx) * f[0] * 2, fy2 = sy + (cy - sy) * f[0] * 2; var hg = g.createRadialGradient(fx2, fy2, 0, fx2, fy2, f[1]); hg.addColorStop(0, rgb([200, 230, 255], f[2])); hg.addColorStop(0.7, rgb([255, 220, 180], f[2] * 0.6)); hg.addColorStop(1, rgb([255, 255, 255], 0)); g.fillStyle = hg; g.beginPath(); g.arc(fx2, fy2, f[1], 0, TAU); g.fill(); }); }
    /* dust and pollen catching the light */
    motes.forEach(function (m) { m.p += 0.004 * m.v; var x = ((m.x + t * 0.004 * m.v) % 1) * W, y = m.y * H + Math.sin(m.p * 3) * 20, mg = g.createRadialGradient(x, y, 0, x, y, m.r); mg.addColorStop(0, rgb(sc, 0.06)); mg.addColorStop(1, rgb(sc, 0)); g.fillStyle = mg; g.fillRect(x - m.r, y - m.r, m.r * 2, m.r * 2); });
    g.restore();
  }
  /* a passing shower: the light dims, rain slants across, and a rainbow comes out after */
  var drops = [];
  function shower(t) {
    if (!X.shower) return 0;
    var k = Math.max(0, Math.sin(Math.min(Math.PI, (t - 30) / 35 * Math.PI))); if (t > 66 && !X.rainbow) { X.rainbow = true; bow.start = t; }
    if (k <= 0.01) return 0;
    g.fillStyle = "rgba(60,70,90," + 0.22 * k + ")"; g.fillRect(0, 0, W, H);
    while (drops.length < 180 * k) drops.push({ x: Math.random() * (W + 200), y: Math.random() * H, l: 10 + Math.random() * 14, v: 9 + Math.random() * 6 });
    g.strokeStyle = "rgba(220,230,245," + 0.35 * k + ")"; g.lineWidth = 1; g.beginPath();
    drops.forEach(function (d) { d.y += d.v; d.x -= d.v * 0.25 * (state.breezeSpeed || 1); if (d.y > H) { d.y = -20; d.x = Math.random() * (W + 200); } g.moveTo(d.x, d.y); g.lineTo(d.x + d.l * 0.25, d.y - d.l); });
    g.stroke(); return k;
  }
  function vignette() { var vg = g.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H * 0.45, Math.max(W, H) * 0.8); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, night() ? "rgba(0,0,10,.35)" : "rgba(20,30,50,.18)"); g.fillStyle = vg; g.fillRect(0, 0, W, H); }

  var stars = [], flies = [], vis = null, plane = null, shoot = null, bow = { a: 0, t: 0 }, t0 = performance.now();
  for (var i = 0; i < 40; i++) flies.push({ x: Math.random(), y: 0.8 + Math.random() * 0.17, p: Math.random() * TAU, v: 0.3 + Math.random() * 0.7 });
  /* geese over the meadow, an eagle over the pasture, gulls at the cove, herons at the lake, leaves in the wood, a hawk over the dunes, snow on the peaks */
  var KIND = { meadow: "geese", mountain: "eagle", sea: "gulls", lake: "herons", forest: "leaves", dunes: "hawk", snow: "flakes" }[SCENE] || "geese";
  function bird(x, y, s, flap, col) { var w = Math.sin(flap) * 0.6 * s; g.strokeStyle = col; g.lineWidth = Math.max(1.2, s * 0.18); g.lineCap = "round"; g.beginPath(); g.moveTo(x - s, y - w); g.quadraticCurveTo(x - s * 0.4, y - s * 0.2 - w * 0.4, x, y); g.quadraticCurveTo(x + s * 0.4, y - s * 0.2 - w * 0.4, x + s, y - w); g.stroke(); }
  function visitor(t) {
    if (!vis) { if (Math.random() > 0.004) return;
      var birdy = KIND !== "leaves" && KIND !== "flakes", ph0 = "day", w0 = "clear"; try { ph0 = FBWorld.phase(); w0 = FBWorld.weather(); } catch (e) {}
      if (birdy && (ph0 === "night" || w0 === "rain" || w0 === "storm" || w0 === "snow")) return;   /* birds roost at night and sit out the rain */ var dir = Math.random() < 0.5 ? 1 : -1; vis = { t0: t, dir: dir, y: H * (0.12 + Math.random() * 0.2), n: 5 + Math.floor(Math.random() * 6), seed: Math.random() * 100, p: [] }; }
    var k = t - vis.t0, dir = vis.dir, ink = sky === "dusk" ? "rgba(40,30,40,.75)" : "rgba(40,48,60,.6)";
    g.save();
    if (KIND === "geese" || KIND === "herons" || KIND === "gulls") {
      var speed = KIND === "herons" ? 18 : KIND === "gulls" ? 26 : 34, x0 = dir > 0 ? -80 + k * speed : W + 80 - k * speed;
      for (var i = 0; i < (KIND === "gulls" ? 3 : vis.n); i++) {
        var row = Math.ceil(i / 2), side = i % 2 ? 1 : -1, bx, by, sz;
        if (KIND === "geese") { bx = x0 - dir * row * 15; by = vis.y + side * row * 8; sz = 7; }   /* a V: two arms trailing the leader */
        else if (KIND === "herons") { bx = x0 - dir * i * 46; by = vis.y + 40 + Math.sin(k * 0.6 + i) * 6; sz = 12; }
        else { bx = x0 - dir * i * 70 + Math.sin(k * 0.4 + i * 2) * 30; by = vis.y + Math.sin(k * 0.5 + i) * 18; sz = 9; }
        bird(bx, by, sz, k * (KIND === "herons" ? 3 : KIND === "gulls" ? 2.2 : 5) + i, KIND === "gulls" ? "rgba(255,255,255,.9)" : ink);
      }
      if ((dir > 0 && x0 - vis.n * 46 > W + 100) || (dir < 0 && x0 + vis.n * 46 < -100)) vis = null;
    } else if (KIND === "eagle" || KIND === "hawk") {   /* slow circles on a thermal, then away */
      var cx = W * (0.3 + 0.4 * ((vis.seed % 10) / 10)), cy = vis.y + 20, r = KIND === "eagle" ? 70 : 50, a = k * 0.35;
      var ex = cx + Math.cos(a) * r + (k > 40 ? (k - 40) * 20 * dir : 0), ey = cy + Math.sin(a) * r * 0.35;
      bird(ex, ey, KIND === "eagle" ? 16 : 11, Math.sin(k * 0.8) > 0.92 ? k * 6 : 0.4, ink);
      if (ex < -60 || ex > W + 60) vis = null;
    } else {   /* leaves or snowflakes falling for a while */
      if (vis.p.length < 26 && Math.random() < 0.25 && k < 30) vis.p.push({ x: Math.random() * W, y: -10, v: 0.4 + Math.random() * 0.6, ph: Math.random() * 6, c: KIND === "leaves" ? ["#c8742a", "#e0a03a", "#a8502a", "#d8b44a"][Math.floor(Math.random() * 4)] : "#ffffff" });
      vis.p.forEach(function (q) { q.y += q.v * (KIND === "leaves" ? 1.2 : 0.7); q.ph += 0.03; var qx = q.x + Math.sin(q.ph) * (KIND === "leaves" ? 22 : 10);
        g.fillStyle = q.c; g.globalAlpha = KIND === "leaves" ? 0.9 : 0.85;
        if (KIND === "leaves") { g.save(); g.translate(qx, q.y); g.rotate(Math.sin(q.ph * 1.7)); g.beginPath(); g.ellipse(0, 0, 6, 3, 0, 0, TAU); g.fill(); g.restore(); } else { g.beginPath(); g.arc(qx, q.y, 2.2, 0, TAU); g.fill(); } });
      vis.p = vis.p.filter(function (q) { return q.y < H * 0.95; }); g.globalAlpha = 1;
      if (k > 30 && !vis.p.length) vis = null;
    }
    g.restore();
  }
  function frame(now) {
    var t = (now - t0) / 1000; g.clearRect(0, 0, W, H);
    light(t); shower(t);
    /* your finger's trail: soft vapour that fades if you stop */
    if (trail.length > 1) {
      g.save(); g.lineCap = g.lineJoin = "round";
      for (var k = 1; k < trail.length; k++) { var a = trail[k - 1], b = trail[k]; g.strokeStyle = "rgba(255,255,255," + 0.55 * b.a + ")"; g.lineWidth = 14; g.shadowColor = "rgba(255,255,255,.8)"; g.shadowBlur = 16; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
      g.restore();
    }
    /* a rainbow after rain that never came, fading in and out */
    if (X.rainbow) { bow.a = Math.min(1, Math.max(0, Math.sin(Math.min(Math.PI, (t - (bow.start || 6)) / 70 * Math.PI)))); if (bow.a > 0.01) { var cx = W * 0.78, cy = H * 0.95, R = Math.max(W, H) * 0.55, cols = ["255,80,80", "255,160,60", "255,230,90", "110,220,120", "90,170,255", "150,110,255"]; g.save(); g.globalAlpha = 0.16 * bow.a; g.lineWidth = R * 0.018; cols.forEach(function (c, i) { g.strokeStyle = "rgb(" + c + ")"; g.beginPath(); g.arc(cx, cy, R - i * g.lineWidth, Math.PI * 1.05, Math.PI * 1.75); g.stroke(); }); g.restore(); } }
    /* a visitor that belongs to this place, drifting through now and then */
    if (X.visitor && !night()) visitor(t);
    /* a plane high up, drawing a contrail that spreads and fades */
    if (X.plane) { if (!plane && Math.random() < 0.002) plane = { x: -20, y: H * (0.08 + Math.random() * 0.15), v: 0.35 + Math.random() * 0.3, trail: [] };
      if (plane) { plane.x += plane.v; plane.y -= plane.v * 0.08; plane.trail.push({ x: plane.x, y: plane.y, a: 1 }); if (plane.trail.length > 600) plane.trail.shift();
        g.save(); g.lineCap = "round"; for (var j = 1; j < plane.trail.length; j += 2) { var p0 = plane.trail[j], age = (plane.trail.length - j) / 600; g.strokeStyle = "rgba(255,255,255," + (0.5 * (1 - age)) + ")"; g.lineWidth = 1.5 + age * 9; g.beginPath(); g.moveTo(plane.trail[j - 1].x, plane.trail[j - 1].y); g.lineTo(p0.x, p0.y); g.stroke(); }
        g.fillStyle = "rgba(255,255,255,.95)"; g.fillRect(plane.x, plane.y - 1, 6, 2); g.restore(); if (plane.x > W + 400) plane = null; } }
    /* shooting stars at night */
    if (X.stars) { if (!shoot && Math.random() < (window.FBWorld && FBWorld.weather() === "clear" ? 0.007 : 0.003)) shoot = { x: W * (0.3 + Math.random() * 0.6), y: H * (0.05 + Math.random() * 0.25), l: 1 };
      if (shoot) { shoot.x -= 9; shoot.y += 3; shoot.l -= 0.025; var sg = g.createLinearGradient(shoot.x, shoot.y, shoot.x + 70, shoot.y - 23); sg.addColorStop(0, "rgba(255,250,225," + shoot.l + ")"); sg.addColorStop(1, "rgba(255,250,225,0)"); g.strokeStyle = sg; g.lineWidth = 2; g.beginPath(); g.moveTo(shoot.x, shoot.y); g.lineTo(shoot.x + 70, shoot.y - 23); g.stroke(); if (shoot.l <= 0) shoot = null; } }
    /* fireflies over the grass */
    if (X.flies && (night() || sky === "dusk")) flies.forEach(function (f) { f.p += 0.02 * f.v; var x = ((f.x * W + Math.sin(f.p) * 30 + t * 6 * f.v) % W + W) % W, y = f.y * H + Math.cos(f.p * 1.3) * 12, a = 0.5 + 0.5 * Math.sin(f.p * 3); var fg = g.createRadialGradient(x, y, 0, x, y, 10); fg.addColorStop(0, "rgba(230,255,140," + 0.8 * a + ")"); fg.addColorStop(1, "rgba(230,255,140,0)"); g.fillStyle = fg; g.fillRect(x - 10, y - 10, 20, 20); });
    grass(t); vignette();
    /* the trail fades when you hold still */
    for (var m = 0; m < trail.length; m++) trail[m].a = Math.max(0.15, trail[m].a - 0.002);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
