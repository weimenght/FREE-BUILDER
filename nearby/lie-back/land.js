/* Sora · the place you're lying in
   Each visit picks somewhere new (sky.js chooses, this draws and sounds it): a meadow, a mountain, the sea,
   a lake, a forest, desert dunes or a snowfield. The land sits at the bottom of your view, lit by the same sky,
   and each place has its own quiet sound under the wind. */
(function () {
  "use strict";
  var SCENE = window.SORA_SCENE || "meadow", TAU = Math.PI * 2;
  var cv = document.createElement("canvas"); cv.id = "skyLand"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:5;pointer-events:none";
  document.body.appendChild(cv);
  var g = cv.getContext("2d"), W = 0, H = 0, DPR = 1;
  function size() { DPR = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0); build(); }
  function rnd(seed) { var x = seed >>> 0 || 7; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  var R = rnd((Math.random() * 1e9) | 0), seed = (R() * 1e9) | 0;
  function rgb(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (a == null ? 1 : a) + ")"; }
  function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function pal() {   /* the sky's light, borrowed from the engine */
    var ac = (typeof activeColors !== "undefined") ? activeColors : null, key = (typeof targetPaletteKey !== "undefined") ? targetPaletteKey : "noon";
    var night = key === "night", dusk = key === "dusk", morning = key === "morning";
    var haze = ac && ac.skyHorizon ? ac.skyHorizon : night ? [20, 30, 50] : dusk ? [240, 160, 120] : [200, 225, 245];
    var sun = ac && ac.sunColor ? ac.sunColor : [255, 240, 210];
    var shade = night ? 0.18 : dusk ? 0.55 : morning ? 0.85 : 1;
    return { haze: haze, sun: sun, shade: shade, night: night, dusk: dusk, sunX: ac && ac.sunPos ? ac.sunPos.x : 0.7 };
  }
  function lit(c, P, depth) { return mix(mix(c, [6, 8, 16], 1 - P.shade), P.haze, Math.min(0.85, depth)); }

  /* ---------- shapes, made once per screen size ---------- */
  var ridges = [], trees = [], dunes = [], flakes = [], leaves = [], glints = [];
  function noise1(f, oct, s) { var r = rnd(s), ph = [], a = []; for (var i = 0; i < oct; i++) { ph.push(r() * 100); a.push(Math.pow(0.5, i)); } return function (x) { var v = 0; for (var i = 0; i < oct; i++) v += Math.sin(x * f * Math.pow(2.1, i) + ph[i]) * a[i]; return v; }; }
  function build() {
    ridges = []; trees = []; dunes = []; flakes = []; leaves = []; glints = [];
    if (SCENE === "mountain") for (var i = 0; i < 4; i++) ridges.push({ n: noise1(0.006 + i * 0.002, 4, seed + i), base: H * (0.70 + i * 0.06), amp: H * (0.16 - i * 0.03), depth: 0.65 - i * 0.2, snow: i === 0 });
    if (SCENE === "dunes") for (var j = 0; j < 4; j++) dunes.push({ n: noise1(0.004 + j * 0.0015, 2, seed + 10 + j), base: H * (0.78 + j * 0.055), amp: H * (0.05 + j * 0.01), depth: 0.5 - j * 0.15 });
    if (SCENE === "lake" || SCENE === "sea" || SCENE === "meadow" || SCENE === "snow") for (var k = 0; k < 2; k++) ridges.push({ n: noise1(0.005 + k * 0.003, 3, seed + 20 + k), base: H * (SCENE === "lake" ? 0.79 : SCENE === "snow" ? 0.8 + k * 0.07 : 0.86 + k * 0.04), amp: H * (SCENE === "lake" ? 0.02 : 0.035), depth: 0.6 - k * 0.3, snow: SCENE === "snow" });
    if (SCENE === "forest") {
      var r = rnd(seed + 30);
      /* you are lying on the forest floor: trunks rise up the sides and lean in toward the sky */
      for (var t = 0; t < 7; t++) { var left = t % 2 === 0, d = r(); trees.push({ x: left ? -20 + r() * W * 0.22 : W + 20 - r() * W * 0.22, w: 18 + d * 34, lean: (left ? 1 : -1) * (0.06 + r() * 0.14), h: H * (0.55 + r() * 0.3), depth: 0.5 - d * 0.45, crown: 40 + d * 55, seed: (r() * 1e6) | 0 }); }
      trees.sort(function (a, b) { return b.depth - a.depth; });
      for (var l = 0; l < 14; l++) leaves.push({ x: r() * W, y: r() * H, v: 0.3 + r() * 0.6, p: r() * TAU, s: 3 + r() * 4 });
    }
    if (SCENE === "snow") { var rs = rnd(seed + 40); for (var f = 0; f < 120; f++) flakes.push({ x: rs() * W, y: rs() * H, v: 0.3 + rs() * 0.9, r: 0.8 + rs() * 2.2, p: rs() * TAU }); }
    if (SCENE === "sea" || SCENE === "lake") { var rg = rnd(seed + 50); for (var q = 0; q < 70; q++) glints.push({ x: rg(), y: rg(), p: rg() * TAU, s: 0.5 + rg() }); }
  }
  size(); addEventListener("resize", size);

  /* ---------- drawing ---------- */
  function ridge(rd, P, col, t) {
    g.beginPath(); g.moveTo(0, H);
    for (var x = 0; x <= W + 8; x += 8) { var y = rd.base - Math.abs(rd.n(x)) * rd.amp - rd.n(x * 0.5) * rd.amp * 0.3; g.lineTo(x, y); }
    g.lineTo(W, H); g.closePath();
    var c = lit(col, P, rd.depth); g.fillStyle = rgb(c); g.fill();
    if (rd.snow && SCENE === "mountain") {   /* snow on the high peaks */
      g.save(); g.clip(); g.fillStyle = rgb(mix([240, 245, 255], P.haze, rd.depth * 0.5 + (P.night ? 0.5 : 0)), 0.92);
      g.beginPath(); for (var x2 = 0; x2 <= W + 8; x2 += 8) { var top = rd.base - Math.abs(rd.n(x2)) * rd.amp - rd.n(x2 * 0.5) * rd.amp * 0.3, line = rd.base - rd.amp * 0.55 + Math.sin(x2 * 0.05) * 6; g.rect(x2, top - 2, 8, Math.max(0, line - top)); } g.fill(); g.restore();
    }
  }
  function water(top, P, t, deep, calm) {
    var sky = P.haze, gr = g.createLinearGradient(0, top, 0, H);
    gr.addColorStop(0, rgb(mix(sky, [255, 255, 255], 0.15))); gr.addColorStop(1, rgb(lit(deep, P, 0.15)));
    g.fillStyle = gr; g.fillRect(0, top, W, H - top);
    /* the path of light on the water, and ripples */
    var sx = W * P.sunX;
    glints.forEach(function (q) { var y = top + Math.pow(q.y, 1.6) * (H - top), spread = 10 + (y - top) * 0.9, x = P.night ? q.x * W : sx + (q.x - 0.5) * spread * 2, a = Math.max(0, Math.sin(t * (1.2 + q.s) + q.p)) * (P.night ? 0.25 : 0.7) * (1 - q.y * 0.6);
      if (a > 0.05) { g.fillStyle = rgb(P.night ? [220, 230, 255] : P.sun, a); g.fillRect(x, y, 3 + q.s * 5 * (y - top) / (H - top), 1.2); } });
    g.strokeStyle = rgb(mix(sky, [255, 255, 255], 0.4), calm ? 0.12 : 0.22); g.lineWidth = 1;
    for (var i = 0; i < (calm ? 6 : 12); i++) { var yy = top + Math.pow((i + ((t * (calm ? 0.02 : 0.06)) % 1)) / (calm ? 6 : 12), 1.8) * (H - top); g.beginPath(); for (var x = 0; x <= W; x += 12) g.lineTo(x, yy + Math.sin(x * 0.03 + t * (calm ? 0.6 : 1.4) + i) * (1 + (yy - top) * 0.02)); g.stroke(); }
  }
  function frame(now) {
    var t = now / 1000, P = pal(); g.clearRect(0, 0, W, H);
    if (SCENE === "mountain") { ridges.forEach(function (rd, i) { ridge(rd, P, [[120, 130, 150], [80, 100, 95], [60, 85, 60], [45, 70, 45]][i], t); }); }
    else if (SCENE === "sea") {
      var hz = H * 0.8; water(hz, P, t, [20, 70, 110], false);
      /* surf rolling in at the bottom */
      var sw = Math.sin(t * 0.5) * 0.5 + 0.5; g.fillStyle = rgb(mix(P.haze, [255, 255, 255], 0.6), 0.35 * sw); g.beginPath(); g.moveTo(0, H); for (var x = 0; x <= W; x += 10) g.lineTo(x, H - 18 - sw * 14 - Math.sin(x * 0.02 + t) * 4); g.lineTo(W, H); g.fill();
      g.fillStyle = rgb(lit([214, 190, 140], P, 0.1)); g.beginPath(); g.moveTo(0, H); for (var x3 = 0; x3 <= W; x3 += 10) g.lineTo(x3, H - 10 - Math.sin(x3 * 0.01) * 5); g.lineTo(W, H); g.fill();
    }
    else if (SCENE === "lake") {
      ridge(ridges[0], P, [40, 70, 60], t);   /* the far shore and its trees */
      var top = H * 0.8; g.fillStyle = rgb(lit([30, 60, 45], P, 0.5)); for (var x4 = 0; x4 < W; x4 += 9) { var th = 14 + Math.abs(Math.sin(x4 * 0.13 + seed)) * 26; g.beginPath(); g.moveTo(x4 - 6, top); g.lineTo(x4, top - th); g.lineTo(x4 + 6, top); g.fill(); }
      water(top, P, t, [30, 60, 80], true);
    }
    else if (SCENE === "forest") {
      trees.forEach(function (tr) {
        var c = lit([40, 34, 28], P, tr.depth), cc = lit([30, 70, 40], P, tr.depth), sway = Math.sin(t * 0.3 + tr.seed) * 0.01;
        var x0 = tr.x, x1 = tr.x + Math.sin(tr.lean + sway) * tr.h, y1 = H - Math.cos(tr.lean) * tr.h;
        g.strokeStyle = rgb(c); g.lineWidth = tr.w; g.lineCap = "round"; g.beginPath(); g.moveTo(x0, H + 20); g.lineTo(x1, y1); g.stroke();
        var rr = rnd(tr.seed); g.fillStyle = rgb(cc, 0.82);
        for (var k = 0; k < 11; k++) { var u = 0.5 + rr() * 0.55, bx = x0 + (x1 - x0) * u + (rr() - 0.5) * tr.crown, by = H + 20 + (y1 - H - 20) * u + (rr() - 0.5) * tr.crown * 0.6; g.beginPath(); g.arc(bx, by, tr.crown * (0.25 + rr() * 0.35), 0, TAU); g.fill(); }
      });
      leaves.forEach(function (l) { l.p += 0.02; l.y += l.v; l.x += Math.sin(l.p) * 0.8; if (l.y > H) { l.y = -10; l.x = Math.random() * W; } g.save(); g.translate(l.x, l.y); g.rotate(l.p); g.fillStyle = rgb(lit(P.dusk ? [190, 120, 50] : [120, 160, 60], P, 0.1), 0.85); g.beginPath(); g.ellipse(0, 0, l.s, l.s * 0.5, 0, 0, TAU); g.fill(); g.restore(); });
    }
    else if (SCENE === "dunes") { dunes.forEach(function (d, i) { g.beginPath(); g.moveTo(0, H); for (var x5 = 0; x5 <= W + 8; x5 += 8) g.lineTo(x5, d.base - (d.n(x5) * 0.5 + 0.5) * d.amp * 2); g.lineTo(W, H); g.closePath(); var gr = g.createLinearGradient(0, d.base - d.amp * 2, 0, H); gr.addColorStop(0, rgb(lit([235, 190, 130], P, d.depth))); gr.addColorStop(1, rgb(lit([190, 140, 90], P, d.depth))); g.fillStyle = gr; g.fill(); }); }
    else if (SCENE === "snow") {
      ridges.forEach(function (rd) { ridge(rd, P, [228, 236, 248], t); });
      flakes.forEach(function (f) { f.p += 0.01; f.y += f.v; f.x += Math.sin(f.p) * 0.4 - 0.15 * ((typeof state !== "undefined" && state.breezeSpeed) || 1); if (f.y > H) { f.y = -5; f.x = Math.random() * W; } if (f.x < -5) f.x = W + 5; g.fillStyle = "rgba(255,255,255," + (0.5 + f.r * 0.18) + ")"; g.beginPath(); g.arc(f.x, f.y, f.r, 0, TAU); g.fill(); });
    }
    else { ridges.forEach(function (rd, i) { ridge(rd, P, i ? [70, 120, 70] : [100, 140, 100], t); }); }   /* meadow: soft rolling hills */
    neighbour(t, P);
    requestAnimationFrame(frame);
  }
  /* someone else is lying out here right now (anonymous presence from the shell): a far-off figure on the grass,
     knees up, and at night a small warm lantern beside them. No name, nothing to tap. */
  var nb = { a: 0, x: 0.62 + Math.random() * 0.22, seen: 0 };
  function others() { try { var P = window.parent; if (P === window || !P.FBShell || !P.FBShell.others) return 0; return P.FBShell.others(window.FBWorld && FBWorld.here ? FBWorld.here(location.pathname) : "cloud"); } catch (e) { return 0; } }
  function neighbour(t, P) {
    if (t - nb.seen > 3) { nb.seen = t; nb.on = others() > 0; }
    nb.a += ((nb.on ? 1 : 0) - nb.a) * 0.01; if (nb.a < 0.01) return;
    var x = nb.x * W, y = SCENE === "sea" ? H - 14 : SCENE === "lake" ? H * 0.8 - 2 : H * 0.86, s = Math.max(0.7, Math.min(1.3, W / 900)), c = lit([24, 22, 26], P, 0.25);
    g.save(); g.globalAlpha = nb.a * 0.9; g.fillStyle = rgb(c);
    g.beginPath(); g.ellipse(x, y - 3 * s, 15 * s, 3.2 * s, 0, 0, TAU); g.fill();                 /* lying down */
    g.beginPath(); g.arc(x - 15 * s, y - 5 * s, 3.6 * s, 0, TAU); g.fill();                         /* head */
    g.beginPath(); g.moveTo(x + 4 * s, y - 4 * s); g.lineTo(x + 9 * s, y - 11 * s + Math.sin(t * 0.4) * 0.6 * s); g.lineTo(x + 14 * s, y - 4 * s); g.fill();   /* knees up */
    if (P.night) { var gl = g.createRadialGradient(x + 24 * s, y - 5 * s, 0, x + 24 * s, y - 5 * s, 14 * s); gl.addColorStop(0, "rgba(255,196,110," + (0.55 + Math.sin(t * 2.3) * 0.08) + ")"); gl.addColorStop(1, "rgba(255,160,60,0)"); g.fillStyle = gl; g.beginPath(); g.arc(x + 24 * s, y - 5 * s, 14 * s, 0, TAU); g.fill(); }
    g.restore();
  }
  requestAnimationFrame(frame);

  /* ---------- each place sounds like itself ---------- */
  var A = null;
  function audio() {
    if (A || typeof audioCtx === "undefined" || !audioCtx) return A;
    var c = audioCtx, out = c.createGain(); out.gain.value = 0; out.connect(c.destination);
    var len = c.sampleRate * 3, buf = c.createBuffer(2, len, c.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = buf.getChannelData(ch), b0 = 0, b1 = 0, b2 = 0; for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.18; } }
    A = { c: c, out: out, buf: buf };
    function bed(type, f, q, vol) { var s = c.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = Math.random(); var fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q || 0.7; var gn = c.createGain(); gn.gain.value = vol; s.connect(fl); fl.connect(gn); gn.connect(out); s.start(); return { g: gn, f: fl }; }
    function swell(node, base, depth, rate) { (function go() { if (!A) return; var n = c.currentTime, d = (1 / rate) * (0.7 + Math.random() * 0.6); node.g.gain.setTargetAtTime(base + depth * Math.random(), n, d / 3); setTimeout(go, d * 1000); })(); }
    var every = function (min, max, fn) { (function go() { setTimeout(function () { if (playing()) fn(); go(); }, (min + Math.random() * (max - min)) * 1000); })(); };
    var P = pal();
    if (SCENE === "sea") { var surf = bed("lowpass", 700, 0.5, 0.2), hiss = bed("highpass", 2500, 0.5, 0.04); swell(surf, 0.08, 0.55, 0.12); swell(hiss, 0.01, 0.12, 0.12); every(9, 22, gull); }
    else if (SCENE === "lake") { var lap = bed("bandpass", 650, 1.2, 0.05); swell(lap, 0.02, 0.1, 1.2); if (P.night || P.dusk) every(2, 6, frog); else every(6, 14, warbler); }
    else if (SCENE === "mountain") { var gust = bed("bandpass", 380, 0.6, 0.06); swell(gust, 0.02, 0.22, 0.15); every(8, 18, bell); if (!P.night) every(25, 50, raptor); }
    else if (SCENE === "forest") { var rustle = bed("highpass", 3200, 0.6, 0.02); swell(rustle, 0.005, 0.07, 0.6); if (P.night) every(10, 20, owl); else { every(3, 8, warbler); every(20, 40, peck); } }
    else if (SCENE === "dunes") { var sand = bed("bandpass", 1800, 0.5, 0.03); swell(sand, 0.01, 0.08, 0.2); if (P.night) every(0.6, 1.4, cricket); }
    else if (SCENE === "snow") { var hush = bed("lowpass", 260, 0.5, 0.08); swell(hush, 0.04, 0.12, 0.08); every(12, 26, tinkle); }
    else { if (P.night || P.dusk) every(0.5, 1.2, cricket); else every(10, 20, bee); }
    function tone(f0, f1, dur, type, vol, pan, at) { var n = (at || c.currentTime), o = c.createOscillator(), e = c.createGain(), p = c.createStereoPanner ? c.createStereoPanner() : null; o.type = type || "sine"; o.frequency.setValueAtTime(f0, n); o.frequency.exponentialRampToValueAtTime(f1, n + dur); e.gain.setValueAtTime(0.0001, n); e.gain.linearRampToValueAtTime(vol, n + Math.min(0.03, dur * 0.2)); e.gain.exponentialRampToValueAtTime(0.0001, n + dur); o.connect(e); if (p) { p.pan.value = pan || 0; e.connect(p); p.connect(out); } else e.connect(out); o.start(n); o.stop(n + dur + 0.05); }
    function gull() { var pan = Math.random() * 1.6 - 0.8, n = c.currentTime; for (var i = 0; i < 2 + (Math.random() * 3 | 0); i++) tone(1400, 900, 0.28, "sawtooth", 0.012, pan, n + i * 0.32); }
    function frog() { var n = c.currentTime, pan = Math.random() * 1.6 - 0.8, f = 110 + Math.random() * 60; for (var i = 0; i < 3; i++) tone(f, f * 0.8, 0.07, "square", 0.02, pan, n + i * 0.09); }
    function warbler() { var n = c.currentTime, pan = Math.random() * 1.6 - 0.8, b = 1800 + Math.random() * 1600, k = 3 + (Math.random() * 5 | 0); for (var i = 0; i < k; i++) tone(b * (1 + Math.sin(i * 1.7) * 0.15), b * (0.9 + Math.random() * 0.3), 0.07 + Math.random() * 0.08, "sine", 0.03, pan, n + i * 0.13); }
    function bell() { var n = c.currentTime, pan = Math.random() * 1.4 - 0.7, f = 700 + Math.random() * 300; [1, 2.4, 3.9].forEach(function (m, i) { tone(f * m, f * m * 0.995, 1.6 - i * 0.4, "sine", 0.012 / (i + 1), pan, n); }); }
    function raptor() { tone(2600, 1800, 1.1, "sine", 0.02, Math.random() - 0.5); }
    function owl() { var n = c.currentTime, pan = Math.random() * 1.2 - 0.6; tone(420, 380, 0.35, "sine", 0.04, pan, n); tone(420, 370, 0.7, "sine", 0.035, pan, n + 0.6); }
    function peck() { var n = c.currentTime, pan = Math.random() * 1.6 - 0.8; for (var i = 0; i < 10; i++) tone(900, 600, 0.03, "triangle", 0.03 * (1 - i / 12), pan, n + i * 0.06); }
    function cricket() { var n = c.currentTime, pan = Math.random() * 1.6 - 0.8; for (var i = 0; i < 3; i++) tone(4600, 4500, 0.04, "sine", 0.01, pan, n + i * 0.06); }
    function bee() { tone(220, 240, 2.2, "sawtooth", 0.006, Math.random() * 1.6 - 0.8); }
    function tinkle() { var n = c.currentTime; for (var i = 0; i < 4; i++) tone(2400 + Math.random() * 1600, 2300, 0.4, "sine", 0.008, Math.random() - 0.5, n + i * 0.12); }
    return A;
  }
  function playing() { try { return typeof isAudioPlaying !== "undefined" && isAudioPlaying && !document.hidden; } catch (e) { return false; } }
  setInterval(function () { var a = audio(); if (a) a.out.gain.setTargetAtTime(playing() ? 1 : 0.0001, a.c.currentTime, 0.6); }, 500);
})();
