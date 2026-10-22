/* Sleeper Car No. 04 — the view out of the window.
   Replaces the engine's scenery painter with a layered, lit landscape:
   eight kinds of country (city, farmland, mountains, coast, desert, forest, a long lake bridge, snowfields),
   four times of day that melt into each other, weather that rolls in and out (rain on the glass, snow piling on
   the sill, fog in the valleys, storms), and stations with their own roofs, lamps, signs and people.
   Everything is drawn from the train's own distance travelled, so the scenery never repeats the same way twice.
   Uses the engine's globals: state, ctx, cw, ch, mistCanvas, mistCtx, lastFrameTime, shootingStars, … */
(function () {
  "use strict";
  if (typeof renderScene !== "function" || typeof state !== "object") return;
  var TAU = Math.PI * 2, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- noise ---------- */
  function hash(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); }
  function noise(x, s) { var i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i, s) * (1 - u) + hash(i + 1, s) * u; }
  function fbm(x, s, o) { var a = 0, amp = 0.5, fr = 1, n = 0; for (var k = 0; k < o; k++) { a += amp * noise(x * fr, s + k * 17); n += amp; amp *= 0.5; fr *= 2.03; } return a / n; }
  function ridgeN(x, s, o) { var a = 0, amp = 0.5, fr = 1, n = 0; for (var k = 0; k < o; k++) { var v = 1 - Math.abs(noise(x * fr, s + k * 17) * 2 - 1); a += amp * v * v; n += amp; amp *= 0.5; fr *= 2.1; } return a / n; }

  /* ---------- colour ---------- */
  function hex(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function mul(a, m) { return [a[0] * m[0], a[1] * m[1], a[2] * m[2]]; }
  function css(c, al) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (al == null ? 1 : al) + ")"; }
  function lum(c) { return c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11; }
  function gray(c, t) { var l = lum(c); return mix(c, [l, l, l], t); }

  /* ---------- light by time of day ---------- */
  var TIME = {
    dawn: { top: "#283358", mid: "#9a7aa6", low: "#ffc39a", shade: [0.66, 0.62, 0.8], haze: "#d9a8b0", hazeAmt: 0.55, lights: 0.55, orbY: 0.5, orb: "#ffd9a8", stars: 0.25, moon: 0, water: "#8a7aa0" },
    afternoon: { top: "#3a78cc", mid: "#86b9e8", low: "#dcecf5", shade: [1, 1, 1], haze: "#bcd4e6", hazeAmt: 0.5, lights: 0.05, orbY: 0.14, orb: "#fff8e0", stars: 0, moon: 0, water: "#5f93c2" },
    sunset: { top: "#2b2a5a", mid: "#c1607a", low: "#ffb469", shade: [0.82, 0.56, 0.55], haze: "#e48e7a", hazeAmt: 0.55, lights: 0.8, orbY: 0.47, orb: "#ffc26b", stars: 0.15, moon: 0, water: "#a8607a" },
    night: { top: "#04070f", mid: "#0c1531", low: "#25305a", shade: [0.15, 0.18, 0.3], haze: "#1b2447", hazeAmt: 0.5, lights: 1, orbY: 0.2, orb: "#f4ecd2", stars: 1, moon: 1, water: "#14204a" }
  };
  var KEYS = ["top", "mid", "low", "haze", "orb", "water"], NUMS = ["hazeAmt", "lights", "orbY", "stars", "moon"];
  function target() { var t = TIME[state.timeOfDay] || TIME.sunset, o = {}; KEYS.forEach(function (k) { o[k] = hex(t[k]); }); NUMS.forEach(function (k) { o[k] = t[k]; }); o.shade = t.shade.slice(); return o; }
  var P = target();
  var WX = { rain: 0, snow: 0, fog: 0, storm: 0, over: 0 };
  function wxTarget() {
    var w = state.weather;
    return { rain: w === "rain" ? 1 : w === "storm" ? 1.6 : 0, snow: w === "snow" ? 1 : 0, fog: w === "fog" ? 1 : 0, storm: w === "storm" ? 1 : 0, over: w === "clear" ? 0 : w === "fog" ? 0.55 : w === "snow" ? 0.75 : w === "storm" ? 1 : 0.85 };
  }
  function ease(dt) {
    var T = target(), k = Math.min(1, 0.012 * dt), kw = Math.min(1, 0.008 * dt), W = wxTarget();
    KEYS.forEach(function (key) { P[key] = mix(P[key], T[key], k); });
    NUMS.forEach(function (key) { P[key] += (T[key] - P[key]) * k; });
    P.shade = mix(P.shade, T.shade, k);
    for (var q in W) WX[q] += (W[q] - WX[q]) * kw;
  }
  /* the light this frame, after the weather has had its say */
  var L = {};
  function light() {
    var o = WX.over, st = WX.storm;
    L.top = mix(gray(P.top, o * 0.75), [20, 22, 30], st * 0.45);
    L.mid = mix(gray(P.mid, o * 0.75), [40, 44, 56], st * 0.45);
    L.low = mix(gray(P.low, o * 0.6), [60, 64, 74], st * 0.4);
    L.haze = mix(gray(P.haze, o * 0.55), mix(L.low, [235, 238, 242], 0.35 * P.shade[0]), WX.fog * 0.6);
    L.hazeAmt = Math.min(0.92, P.hazeAmt + WX.fog * 0.35 + o * 0.08);
    var dim = 1 - o * 0.22 - st * 0.25; L.shade = [P.shade[0] * dim, P.shade[1] * dim, P.shade[2] * (dim + o * 0.05)];
    L.lights = Math.min(1, P.lights + o * 0.25 + st * 0.2);
    L.water = mix(gray(P.water, o * 0.6), L.haze, 0.2);
    L.orbA = Math.max(0, 1 - o * 1.3);
  }
  /* a landscape colour: its daylight base, lit, then faded into the air by distance (0 near … 1 far) */
  function land(base, depth) { return mix(mul(hex(base), L.shade), L.haze, Math.min(0.95, L.hazeAmt * depth)); }

  /* ---------- geometry ---------- */
  var H, S;   /* horizon line, scale */
  function off(par) { return state.scrollDist * par * S; }
  function ridge(par, base, amp, freq, seed, col, sharp, step) {
    var o = off(par); step = step || 5;
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, ch);
    for (var x = 0; x <= cw + step; x += step) { var wx = (x + o) / S; ctx.lineTo(x, base - amp * (sharp ? ridgeN(wx * freq, seed, 5) : fbm(wx * freq, seed, 4))); }
    ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();
  }
  function ridgeY(x, par, base, amp, freq, seed, sharp) { var wx = (x + off(par)) / S; return base - amp * (sharp ? ridgeN(wx * freq, seed, 5) : fbm(wx * freq, seed, 4)); }
  /* walk over evenly spaced slots that are on screen; fn(screenX, slotIndex) */
  function slots(par, every, fn, pad) {
    var o = off(par), w = every * S, first = Math.floor((o - (pad || 200)) / w);
    for (var i = first; i * w - o < cw + (pad || 200); i++) fn(i * w - o, i);
  }

  /* ---------- clouds and fog as soft sprites, re-tinted as the light changes ---------- */
  var sprites = [], fogBlob = null, spriteKey = "";
  function makeSprites() {
    var lit = mix(mix([255, 250, 244], L.low, 0.35), L.top, 0.1), shd = mix(L.mid, L.top, 0.35);
    if (WX.over > 0.5) { lit = mix(lit, [150, 156, 168], WX.over * 0.6 * (1 - P.shade[0] * 0.3)); shd = mix(shd, [70, 74, 86], WX.over * 0.6); }
    lit = mul(lit, [Math.max(0.22, L.shade[0] * 0.9 + 0.1), Math.max(0.24, L.shade[1] * 0.9 + 0.1), Math.max(0.32, L.shade[2] * 0.9 + 0.1)]);
    shd = mul(shd, [Math.max(0.2, L.shade[0]), Math.max(0.2, L.shade[1]), Math.max(0.28, L.shade[2])]);
    var key = lit.map(Math.round).join() + shd.map(Math.round).join(); if (key === spriteKey) return; spriteKey = key;
    sprites = [];
    for (var v = 0; v < 6; v++) {
      var c = document.createElement("canvas"), w = 360, h = 150; c.width = w; c.height = h; var g = c.getContext("2d");
      try { g.filter = "blur(3px)"; } catch (e) {}
      for (var k = 0; k < 34; k++) {
        var u = hash(k, v + 3), px = 30 + u * (w - 60), arch = Math.sin(u * Math.PI), py = h * 0.72 - arch * h * (0.18 + hash(k, v + 9) * 0.22), r = (12 + hash(k, v + 21) * 26) * (0.5 + arch * 0.7);
        var gr = g.createRadialGradient(px, py, 0, px, py, r);
        gr.addColorStop(0, css(lit, 0.55)); gr.addColorStop(0.55, css(lit, 0.38)); gr.addColorStop(1, css(lit, 0));
        g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, TAU); g.fill();
      }
      try { g.filter = "none"; } catch (e) {}
      g.globalCompositeOperation = "source-atop"; var sh = g.createLinearGradient(0, h * 0.35, 0, h); sh.addColorStop(0, css(shd, 0)); sh.addColorStop(1, css(shd, 0.75)); g.fillStyle = sh; g.fillRect(0, 0, w, h);
      sprites.push(c);
    }
    fogBlob = document.createElement("canvas"); fogBlob.width = 256; fogBlob.height = 96; var f = fogBlob.getContext("2d"), fc = mix(L.haze, [235, 238, 244], 0.3 * P.shade[0]);
    var fg = f.createRadialGradient(128, 48, 4, 128, 48, 128); fg.addColorStop(0, css(fc, 0.55)); fg.addColorStop(1, css(fc, 0)); f.setTransform(1, 0, 0, 0.375, 0, 30); f.fillStyle = fg; f.beginPath(); f.arc(128, 48, 128, 0, TAU); f.fill();
  }
  var spriteT = 0;
  function clouds(now) {
    if (!sprites.length) return;
    var n = Math.round(4 + WX.over * 10 + WX.storm * 4), drift = now * 0.004;
    for (var i = 0; i < n; i++) {
      var depth = 0.4 + hash(i, 5) * 0.6, span = cw + 500, x = ((hash(i, 2) * span - drift * (0.6 + depth) - off(0.01 + depth * 0.02)) % span + span) % span - 250;
      var y = ch * (0.04 + hash(i, 3) * (0.26 + WX.over * 0.1)) + (WX.over > 0.6 ? -10 * S : 0), sc = S * (0.55 + depth * 0.9) * (1 + WX.over * 0.4);
      ctx.globalAlpha = Math.min(1, 0.55 + WX.over * 0.5) * (state.timeOfDay === "night" ? 0.75 : 1);
      ctx.drawImage(sprites[i % sprites.length], x, y, 360 * sc, 150 * sc);
    }
    ctx.globalAlpha = 1;
    if (WX.over > 0.4) {   /* a low ceiling of cloud when it's grey out */
      var g = ctx.createLinearGradient(0, 0, 0, ch * 0.35); g.addColorStop(0, css(mix(L.top, [30, 32, 40], WX.storm * 0.5), (WX.over - 0.4) * 1.2)); g.addColorStop(1, css(L.mid, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch * 0.35);
    }
  }
  function fogBands(now, lo, hi) {
    if (WX.fog < 0.02 || !fogBlob) return;
    for (var i = 0; i < 18; i++) {
      var d = hash(i, 41), span = cw + 600, x = ((hash(i, 42) * span - off(0.05 + d * 0.5) - now * 0.006 * (1 + d)) % span + span) % span - 300;
      var y = lo + (hi - lo) * hash(i, 43); ctx.globalAlpha = WX.fog * (0.5 + d * 0.5);
      ctx.drawImage(fogBlob, x, y - 50 * S * (1 + d), 600 * S * (1 + d), 120 * S * (1 + d));
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- the sky ---------- */
  var starField = [], milky = null, milkyW = 0;
  function initStars() { starField = []; for (var i = 0; i < 260; i++) starField.push({ x: Math.random(), y: Math.pow(Math.random(), 1.4) * 0.62, r: Math.random() < 0.08 ? 1.6 : 0.5 + Math.random() * 0.9, p: Math.random() * TAU, s: 0.01 + Math.random() * 0.03, c: Math.random() < 0.2 ? [200, 215, 255] : Math.random() < 0.15 ? [255, 220, 190] : [255, 250, 240] }); }
  function makeMilky() {
    milky = document.createElement("canvas"); milky.width = Math.max(300, cw | 0); milky.height = Math.max(150, (ch * 0.62) | 0); milkyW = cw;
    var g = milky.getContext("2d"), w = milky.width, h = milky.height;
    g.save(); g.translate(w * 0.5, h * 0.4); g.rotate(-0.42);
    var band = g.createLinearGradient(0, -h * 0.25, 0, h * 0.25); band.addColorStop(0, "rgba(180,190,255,0)"); band.addColorStop(0.5, "rgba(200,205,255,0.16)"); band.addColorStop(1, "rgba(180,190,255,0)");
    g.fillStyle = band; g.fillRect(-w, -h * 0.25, w * 2, h * 0.5);
    for (var i = 0; i < 1400; i++) { var x = (Math.random() - 0.5) * w * 2, y = (Math.random() + Math.random() + Math.random() - 1.5) * h * 0.18; g.fillStyle = "rgba(255,255,255," + (0.15 + Math.random() * 0.5) + ")"; g.fillRect(x, y, Math.random() < 0.1 ? 1.4 : 0.8, Math.random() < 0.1 ? 1.4 : 0.8); }
    for (var j = 0; j < 22; j++) { var dx = (Math.random() - 0.5) * w * 1.6, dy = (Math.random() - 0.5) * h * 0.14, rr = 20 + Math.random() * 50, dg = g.createRadialGradient(dx, dy, 0, dx, dy, rr); dg.addColorStop(0, "rgba(10,8,20,0.35)"); dg.addColorStop(1, "rgba(10,8,20,0)"); g.fillStyle = dg; g.beginPath(); g.arc(dx, dy, rr, 0, TAU); g.fill(); }
    g.restore();
  }
  function sky(now, dt) {
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, css(L.top)); g.addColorStop(0.55, css(L.mid)); g.addColorStop(1, css(L.low));
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
    var starA = P.stars * (1 - WX.over * 0.95);
    if (starA > 0.02) {
      var wide = { desert: 1, snow: 1, alpine: 1, countryside: 0.6, coastal: 0.7, lake: 0.8 }[state.biome] || 0;
      if (wide && P.stars > 0.6) { if (!milky || Math.abs(milkyW - cw) > 40) makeMilky(); ctx.globalAlpha = starA * wide; ctx.drawImage(milky, 0, 0, cw, ch * 0.62); ctx.globalAlpha = 1; }
      for (var i = 0; i < starField.length; i++) {
        var s = starField[i]; s.p += s.s * dt; var a = starA * (0.55 + 0.45 * Math.sin(s.p)), x = ((s.x * cw - off(0.002)) % cw + cw) % cw;
        ctx.fillStyle = css(s.c, a); ctx.fillRect(x, s.y * ch, s.r, s.r);
      }
    }
    /* sun or moon */
    var ox = cw * 0.72, oy = ch * P.orbY, r = (P.moon > 0.5 ? 16 : state.timeOfDay === "afternoon" ? 26 : 34) * S;
    if (L.orbA > 0.01 && oy < H + r) {
      ctx.save(); ctx.globalAlpha = L.orbA;
      var glow = ctx.createRadialGradient(ox, oy, r * 0.4, ox, oy, r * (P.moon > 0.5 ? 5 : 7));
      glow.addColorStop(0, css(P.orb, P.moon > 0.5 ? 0.3 : 0.55)); glow.addColorStop(1, css(P.orb, 0)); ctx.fillStyle = glow; ctx.fillRect(ox - r * 7, oy - r * 7, r * 14, r * 14);
      ctx.fillStyle = css(P.orb); ctx.beginPath(); ctx.arc(ox, oy, r, 0, TAU); ctx.fill();
      if (P.moon > 0.5) { ctx.fillStyle = "rgba(160,150,130,0.22)"; [[-0.3, -0.2, 0.25], [0.25, 0.15, 0.18], [-0.05, 0.35, 0.12]].forEach(function (c) { ctx.beginPath(); ctx.arc(ox + c[0] * r, oy + c[1] * r, c[2] * r, 0, TAU); ctx.fill(); }); }
      ctx.restore();
    }
    /* shooting stars (the engine's own, plus wishes) */
    if (typeof shootingStars !== "undefined") for (var k = shootingStars.length - 1; k >= 0; k--) {
      var st = shootingStars[k]; st.x += st.vx * dt; st.y += st.vy * dt; st.life -= 0.02 * dt; if (st.life <= 0) { shootingStars.splice(k, 1); continue; }
      var tg = ctx.createLinearGradient(st.x, st.y, st.x - st.vx * 7, st.y - st.vy * 7); tg.addColorStop(0, "rgba(255,250,225," + st.life + ")"); tg.addColorStop(1, "rgba(255,250,225,0)");
      ctx.strokeStyle = tg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(st.x, st.y); ctx.lineTo(st.x - st.vx * 7, st.y - st.vy * 7); ctx.stroke();
    }
    if ((P.stars > 0.3 || state.timeOfDay === "sunset") && WX.over < 0.3 && Math.random() < 0.0018 * dt && typeof shootingStars !== "undefined")
      shootingStars.push({ x: cw * (0.3 + Math.random() * 0.6), y: ch * (0.05 + Math.random() * 0.22), vx: -8 - Math.random() * 5, vy: 2 + Math.random() * 2, life: 1 });
    /* aurora over snow and mountains on clear nights */
    if (P.stars > 0.7 && WX.over < 0.3 && (state.biome === "snow" || state.biome === "alpine") && extras.aurora) aurora(now);
    clouds(now);
    birds(now);
  }
  function aurora(now) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (var band = 0; band < 2; band++) {
      for (var x = 0; x < cw; x += 3) {
        var t = now * 0.00012, nx = x / cw, y0 = ch * (0.1 + band * 0.07) + Math.sin(nx * 5 + t * 6 + band) * 18 * S + fbm(nx * 3 + t + band * 9, 77, 3) * 40 * S;
        var len = (70 + 60 * fbm(nx * 8 - t * 2, 78 + band, 3)) * S, a = 0.09 * (0.4 + fbm(nx * 6 + t * 3, 79 + band, 2)) * P.stars;
        var g = ctx.createLinearGradient(0, y0, 0, y0 + len); g.addColorStop(0, "rgba(120,255,190,0)"); g.addColorStop(0.3, "rgba(110,255,170," + a + ")"); g.addColorStop(1, band ? "rgba(200,120,255,0)" : "rgba(80,220,160,0)");
        ctx.fillStyle = g; ctx.fillRect(x, y0, 3, len);
      }
    }
    ctx.restore();
  }
  var flock = null;
  function birds(now) {
    if (P.stars > 0.6 || WX.rain > 0.5) return;
    if (!flock && Math.random() < 0.0015) flock = { x: cw + 40, y: ch * (0.15 + Math.random() * 0.2), n: 3 + (Math.random() * 6 | 0), v: 0.6 + Math.random() * 0.6 };
    if (!flock) return;
    flock.x -= flock.v * 2.2 + state.speed * 0.6; if (flock.x < -200) { flock = null; return; }
    ctx.strokeStyle = css(mul([40, 36, 44], [1, 1, 1]), 0.7); ctx.lineWidth = 1.4;
    for (var i = 0; i < flock.n; i++) {
      var bx = flock.x + i * 14 * S + (i % 2) * 6, by = flock.y + Math.abs(i - flock.n / 2) * 6 * S, f = Math.sin(now * 0.012 + i) * 3 * S;
      ctx.beginPath(); ctx.moveTo(bx - 5 * S, by - f); ctx.quadraticCurveTo(bx - 2 * S, by - 2 * S, bx, by); ctx.quadraticCurveTo(bx + 2 * S, by - 2 * S, bx + 5 * S, by - f); ctx.stroke();
    }
  }

  /* ---------- things in the landscape ---------- */
  function win(x, y, w, h, seed, alpha, warm) {
    if (alpha <= 0.02) return;
    ctx.fillStyle = css(warm === 2 ? [190, 225, 255] : warm === 3 ? [255, 150, 210] : [255, 214, 140], alpha); ctx.fillRect(x, y, w, h);
  }
  function buildings(par, base, minH, maxH, wMin, wMax, seed, depth, colBase, opt) {
    opt = opt || {}; var col = land(colBase, depth), every = wMax + 8, lit = L.lights;
    var edge = mix(col, L.low, 0.18 * (1 - depth));
    slots(par, every, function (x, i) {
      var w = (wMin + hash(i, seed) * (wMax - wMin)) * S, h = (minH + Math.pow(hash(i, seed + 1), 1.6) * (maxH - minH)) * S, bx = x + hash(i, seed + 2) * (every * S - w), top = base - h;
      ctx.fillStyle = css(col); ctx.fillRect(bx, top, w, h + 2);
      ctx.fillStyle = css(edge); ctx.fillRect(bx, top, w, 2);   /* lit roofline */
      var r = hash(i, seed + 3);
      if (r < 0.3) { ctx.fillStyle = css(col); ctx.fillRect(bx + w * 0.3, top - 6 * S, w * 0.4, 6 * S); }
      if (r > 0.82 && h > maxH * 0.55 * S) { ctx.fillStyle = css(col); ctx.fillRect(bx + w * 0.5 - 1, top - 26 * S, 2, 26 * S); if (lit > 0.3) { var on = Math.sin(performance.now() * 0.004 + i) > 0.6; ctx.fillStyle = on ? "rgba(255,70,60,0.95)" : "rgba(120,30,30,0.6)"; ctx.fillRect(bx + w * 0.5 - 2, top - 28 * S, 4, 4); } }
      if (opt.windows && lit > 0.03) {
        var cw2 = opt.windows * S, rows = Math.floor((h - 10 * S) / (cw2 * 1.6)), cols = Math.floor((w - 6 * S) / (cw2 * 1.5));
        for (var a = 0; a < rows; a++) for (var b = 0; b < cols; b++) {
          var hh = hash(i * 131 + a * 17 + b, seed + 4); if (hh > 0.42 + (1 - lit) * 0.35) continue;
          var flick = hash(i * 7 + a * 3 + b + Math.floor(performance.now() / 23000), seed + 6) < 0.08 ? 0 : 1;
          win(bx + 4 * S + b * cw2 * 1.5, top + 8 * S + a * cw2 * 1.6, cw2, cw2 * 0.9, 0, lit * (0.55 + hh * 0.5) * flick, hh < 0.07 ? 2 : 1);
        }
      }
      if (opt.neon && lit > 0.4 && hash(i, seed + 7) < 0.35) {
        var nc = [[255, 80, 160], [80, 220, 255], [255, 200, 80], [160, 120, 255]][(hash(i, seed + 8) * 4) | 0], ny = top + h * 0.25, nh = Math.min(h * 0.5, 70 * S), nx = hash(i, seed + 9) < 0.5 ? bx - 4 * S : bx + w - 6 * S;
        var on2 = Math.sin(performance.now() * 0.002 + i * 2) > -0.9;
        ctx.fillStyle = css(nc, on2 ? 0.95 * lit : 0.3 * lit); ctx.fillRect(nx, ny, 10 * S, nh);
        ctx.fillStyle = css(nc, 0.12 * lit); ctx.fillRect(nx - 12 * S, ny - 10 * S, 34 * S, nh + 20 * S);
      }
    });
  }
  function treeAt(x, base, h, col, kind) {
    ctx.fillStyle = col;
    if (kind === 0) { /* conifer */ ctx.beginPath(); ctx.moveTo(x, base - h); ctx.lineTo(x + h * 0.26, base - h * 0.12); ctx.lineTo(x - h * 0.26, base - h * 0.12); ctx.closePath(); ctx.fill(); ctx.fillRect(x - h * 0.03, base - h * 0.14, h * 0.06, h * 0.14); }
    else if (kind === 1) { /* broadleaf */ ctx.fillRect(x - h * 0.04, base - h * 0.45, h * 0.08, h * 0.45); ctx.beginPath(); ctx.arc(x, base - h * 0.62, h * 0.3, 0, TAU); ctx.arc(x - h * 0.18, base - h * 0.5, h * 0.2, 0, TAU); ctx.arc(x + h * 0.18, base - h * 0.52, h * 0.22, 0, TAU); ctx.fill(); }
    else if (kind === 2) { /* birch */ ctx.fillRect(x - h * 0.02, base - h, h * 0.04, h); ctx.beginPath(); ctx.ellipse(x, base - h * 0.7, h * 0.14, h * 0.3, 0, 0, TAU); ctx.fill(); }
    else { /* cypress / poplar */ ctx.beginPath(); ctx.ellipse(x, base - h * 0.5, h * 0.1, h * 0.5, 0, 0, TAU); ctx.fill(); }
  }
  function forestRow(par, base, minH, maxH, every, seed, depth, colBase, kinds) {
    var col = css(land(colBase, depth));
    slots(par, every, function (x, i) { var h = (minH + hash(i, seed) * (maxH - minH)) * S; treeAt(x + hash(i, seed + 1) * every * S * 0.8, base + hash(i, seed + 3) * 4 * S, h, col, kinds[(hash(i, seed + 2) * kinds.length) | 0]); });
  }
  function house(x, base, w, h, col, roof, lit, seed) {
    ctx.fillStyle = col; ctx.fillRect(x, base - h, w, h);
    ctx.fillStyle = roof; ctx.beginPath(); ctx.moveTo(x - w * 0.12, base - h); ctx.lineTo(x + w * 0.5, base - h - h * 0.7); ctx.lineTo(x + w * 1.12, base - h); ctx.closePath(); ctx.fill();
    if (lit > 0.05 && hash(seed, 3) < 0.8) { win(x + w * 0.2, base - h * 0.65, w * 0.18, h * 0.3, 0, lit); if (hash(seed, 4) < 0.6) win(x + w * 0.6, base - h * 0.65, w * 0.18, h * 0.3, 0, lit * 0.8);
      var gl = ctx.createRadialGradient(x + w * 0.4, base - h * 0.5, 0, x + w * 0.4, base - h * 0.5, w * 1.2); gl.addColorStop(0, "rgba(255,200,120," + 0.18 * lit + ")"); gl.addColorStop(1, "rgba(255,200,120,0)"); ctx.fillStyle = gl; ctx.fillRect(x - w, base - h * 2, w * 3, h * 2.5); }
  }
  function poles(par, every, top, base, col, wires) {
    var pts = [];
    slots(par, every, function (x, i) { ctx.fillStyle = col; ctx.fillRect(x, top, 3 * S, base - top); ctx.fillRect(x - 9 * S, top + 6 * S, 21 * S, 2 * S); pts.push(x); }, 400);
    if (wires) { ctx.strokeStyle = col; ctx.lineWidth = 1; for (var k = 0; k < pts.length - 1; k++) for (var j = 0; j < 2; j++) { var y = top + 7 * S + j * 0.5; ctx.beginPath(); ctx.moveTo(pts[k] - 8 * S + j * 18 * S, y); ctx.quadraticCurveTo((pts[k] + pts[k + 1]) / 2, y + 12 * S, pts[k + 1] - 8 * S + j * 18 * S, y); ctx.stroke(); } }
  }
  function glowDot(x, y, r, c, a) { var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, css(c, a)); g.addColorStop(1, css(c, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function ground(top, colA, colB) { var g = ctx.createLinearGradient(0, top, 0, ch); g.addColorStop(0, css(colA)); g.addColorStop(1, css(colB)); ctx.fillStyle = g; ctx.fillRect(0, top, cw, ch - top); }
  function water(top, bottom, ripple) {
    var g = ctx.createLinearGradient(0, top, 0, bottom); g.addColorStop(0, css(mix(L.low, L.haze, 0.3))); g.addColorStop(1, css(mix(L.water, L.top, 0.3)));
    ctx.fillStyle = g; ctx.fillRect(0, top, cw, bottom - top);
    var t = performance.now() * 0.001;
    for (var y = top + 2; y < bottom; y += 3 + (y - top) * 0.04) {   /* little horizontal glints */
      var k = (y - top) / (bottom - top), n = 6 + (k * 10 | 0);
      for (var j = 0; j < n; j++) { var x = ((hash(j, y | 0) * cw * 1.3 - off(ripple * (0.2 + k)) - t * 12 * (j % 3)) % (cw + 60) + cw + 60) % (cw + 60) - 30; ctx.fillStyle = css(mix(L.low, [255, 255, 255], 0.3), 0.08 + k * 0.08); ctx.fillRect(x, y, (8 + hash(j, 5) * 30) * S * (0.4 + k), 1); }
    }
    /* the path of light under the sun or moon */
    if (L.orbA > 0.05 && P.orbY < 0.56) {
      var ox = cw * 0.72;
      for (var yy = top + 1; yy < bottom; yy += 2.2) {
        var kk = (yy - top) / (bottom - top), wdt = (14 + kk * 70) * S;
        for (var q = 0; q < 3; q++) { var sx = ox + (hash(q, (yy * 7 | 0) + Math.floor(t * 3)) - 0.5) * wdt * 2; ctx.fillStyle = css(P.orb, (0.25 + 0.4 * hash(q + 3, yy | 0)) * L.orbA * (1 - kk * 0.5)); ctx.fillRect(sx, yy, (4 + 14 * hash(q, yy | 0)) * S, 1.2); }
      }
    }
  }
  function reflectRidge(par, base, amp, freq, seed, col, sharp, top, bottom, alpha) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, top, cw, bottom - top); ctx.clip(); ctx.globalAlpha = alpha;
    var o = off(par); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, top);
    for (var x = 0; x <= cw + 5; x += 5) { var wx = (x + o) / S, hgt = amp * (sharp ? ridgeN(wx * freq, seed, 5) : fbm(wx * freq, seed, 4)); ctx.lineTo(x, top + (hgt - (base - top)) * 0.9 + Math.sin(x * 0.08 + performance.now() * 0.002) * 1.2); }
    ctx.lineTo(cw, top); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  /* ---------- the eight kinds of country ---------- */
  var extras = { aurora: false, petals: false, flies: false };
  var BIOMES = {
    metropolis: function (now) {
      var lp = L.lights; if (lp > 0.4) { var g = ctx.createLinearGradient(0, H - 160 * S, 0, H); g.addColorStop(0, "rgba(255,150,90,0)"); g.addColorStop(1, "rgba(255,150,90," + 0.18 * lp + ")"); ctx.fillStyle = g; ctx.fillRect(0, H - 160 * S, cw, 160 * S); }
      buildings(0.03, H, 50, 150, 26, 64, 11, 0.85, "#7f8bb0", { windows: 1.6 });
      buildings(0.09, H + 6 * S, 70, 230, 40, 110, 12, 0.5, "#5a6386", { windows: 3.2, neon: true });
      fogBands(now, H - 120 * S, H);
      ground(H + 4 * S, land("#2a2d3a", 0.3), land("#16171e", 0));
      /* streetlights and a road below the viaduct */
      slots(0.45, 150, function (x, i) { var y = H + 34 * S; ctx.fillStyle = css(land("#1e2028", 0.15)); ctx.fillRect(x, y - 48 * S, 2 * S, 48 * S); ctx.fillRect(x, y - 48 * S, 14 * S, 2 * S); if (lp > 0.2) glowDot(x + 14 * S, y - 45 * S, 26 * S, [255, 190, 110], 0.6 * lp); });
      slots(0.6, 260, function (x, i) { if (hash(i, 31) < 0.5 || lp < 0.3) return; ctx.fillStyle = "rgba(255,240,220," + 0.9 * lp + ")"; var y = H + 48 * S; ctx.fillRect(x, y, 3 * S, 2 * S); ctx.fillStyle = "rgba(255,60,60," + 0.8 * lp + ")"; ctx.fillRect(x + 60 * S, y + 4 * S, 3 * S, 2 * S); });
      buildings(0.7, ch * 0.98, 40, 120, 70, 170, 13, 0.08, "#262a36", { windows: 5, neon: true });
    },
    countryside: function (now) {
      ridge(0.025, H - 6 * S, 46 * S, 0.004, 21, css(land("#8ea886", 0.9)));
      forestRow(0.04, H - 4 * S, 6, 12, 28, 22, 0.85, "#5d7a55", [1, 3]);
      ridge(0.07, H + 6 * S, 26 * S, 0.006, 23, css(land("#6f9a5c", 0.6)));
      slots(0.08, 420, function (x, i) { if (hash(i, 24) < 0.45) return; var b = ridgeY(x, 0.07, H + 6 * S, 26 * S, 0.006, 23) + 3 * S, w = 26 * S; house(x, b, w, 16 * S, css(land("#d8c7a6", 0.55)), css(land("#7a3b2a", 0.55)), L.lights, i);
        if (hash(i, 25) < 0.4) { ctx.strokeStyle = css(land("#ece2cc", 0.55)); ctx.lineWidth = 2 * S; var cx = x + 60 * S, cy = b - 40 * S, a = now * 0.0016 * state.speed + i; ctx.fillStyle = css(land("#ece2cc", 0.55)); ctx.fillRect(cx - 2 * S, cy, 4 * S, 40 * S); for (var k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a + k * TAU / 4) * 18 * S, cy + Math.sin(a + k * TAU / 4) * 18 * S); ctx.stroke(); } } });
      forestRow(0.1, H + 10 * S, 14, 30, 90, 26, 0.5, "#4f7a42", [1, 1, 3]);
      /* rice paddies holding the sky */
      var top = H + 14 * S;
      var bottom = ch * 0.86, wg = ctx.createLinearGradient(0, top, 0, bottom); wg.addColorStop(0, css(mix(L.low, L.haze, 0.35))); wg.addColorStop(1, css(mix(L.mid, L.top, 0.35)));
      ctx.fillStyle = wg; ctx.fillRect(0, top, cw, bottom - top);
      for (var r = 0; r < 5; r++) {
        var yb = top + Math.pow((r + 1) / 5.4, 1.7) * (bottom - top), par = 0.12 + r * 0.14, o = off(par), bank = css(land("#4a6a34", 0.42 - r * 0.07));
        ctx.fillStyle = bank; ctx.beginPath(); ctx.moveTo(0, yb);
        for (var x = 0; x <= cw + 8; x += 8) ctx.lineTo(x, yb + (noise((x + o) / S * 0.01, 30 + r) - 0.5) * (2 + r * 2) * S);
        ctx.lineTo(cw, yb + (1.5 + r * 1.2) * S); ctx.lineTo(0, yb + (1.5 + r * 1.2) * S); ctx.fill();
        if (r > 1) slots(par, 10 + r * 5, function (x, i) { if (hash(i, 40 + r) < 0.55) return; ctx.fillStyle = css(land("#5d8a3e", 0.3 - r * 0.05), 0.85); var hh = (2 + r * 1.6) * S; ctx.fillRect(x, yb - hh, (0.8 + r * 0.25) * S, hh); ctx.fillRect(x + 2 * S, yb - hh * 0.8, (0.8 + r * 0.25) * S, hh * 0.8); }, 30);
      }
      poles(0.5, 380, H - 60 * S, ch * 0.86, css(land("#2a2420", 0.1)), true);
      ground(ch * 0.86, land("#3e5a2a", 0.1), land("#24361a", 0));
      slots(1.3, 26, function (x, i) { var h = (10 + hash(i, 27) * 24) * S; ctx.fillStyle = css(land("#2f4a22", 0)); ctx.beginPath(); ctx.moveTo(x, ch); ctx.quadraticCurveTo(x + 4 * S, ch - h, x + (hash(i, 28) - 0.3) * 14 * S, ch - h); ctx.lineTo(x + 6 * S, ch); ctx.fill(); }, 60);
    },
    alpine: function (now) {
      var snowCol = function (d) { return css(land("#f4f7ff", d)); };
      ctx.save(); ridge(0.012, H - 30 * S, 230 * S, 0.0022, 31, css(land("#8a9cc0", 0.82)), true, 4);
      /* snow on the high peaks */
      ctx.globalCompositeOperation = "source-atop";
      ctx.restore();
      peakSnow(0.012, H - 30 * S, 230 * S, 0.0022, 31, 0.82);
      ridge(0.035, H - 6 * S, 120 * S, 0.004, 32, css(land("#56708a", 0.55)), true, 4);
      peakSnow(0.035, H - 6 * S, 120 * S, 0.004, 32, 0.55, 0.62);
      forestRow(0.045, H + 2 * S, 10, 22, 14, 33, 0.5, "#2f4a3a", [0]);
      fogBands(now, H - 160 * S, H);
      water(H + 6 * S, ch * 0.84, 0.05);
      reflectRidge(0.012, H - 30 * S, 230 * S, 0.0022, 31, css(land("#8a9cc0", 0.9)), true, H + 6 * S, ch * 0.84, 0.28);
      reflectRidge(0.035, H - 6 * S, 120 * S, 0.004, 32, css(land("#56708a", 0.6)), true, H + 6 * S, ch * 0.84, 0.32);
      ground(ch * 0.84, land("#3a4a3e", 0.1), land("#1c2620", 0));
      forestRow(1.1, ch * 1.02, 120, 220, 70, 34, 0.02, "#1b2b22", [0, 0, 0, 2]);
    },
    coastal: function (now) {
      ridge(0.02, H, 34 * S, 0.0035, 41, css(land("#7a8ca8", 0.85)));
      water(H, ch * 0.8, 0.04);
      /* a lighthouse on the far point, sweeping at dusk */
      slots(0.02, 2600, function (x, i) { var lx = x + 900 * S, ly = ridgeY(lx, 0.02, H, 34 * S, 0.0035, 41); ctx.fillStyle = css(land("#efe8dc", 0.75)); ctx.fillRect(lx - 3 * S, ly - 30 * S, 6 * S, 30 * S); ctx.fillStyle = css(land("#a33a2a", 0.75)); ctx.fillRect(lx - 3 * S, ly - 20 * S, 6 * S, 5 * S);
        if (L.lights > 0.3) { var a = now * 0.0012, bx = lx, by = ly - 30 * S; glowDot(bx, by, 12 * S, [255, 240, 190], 0.9); ctx.save(); ctx.globalCompositeOperation = "lighter"; var len = 380 * S, sp = Math.cos(a); ctx.fillStyle = "rgba(255,240,190," + (0.12 * L.lights * Math.abs(sp)) + ")"; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + sp * len, by - 14 * S); ctx.lineTo(bx + sp * len, by + 14 * S); ctx.closePath(); ctx.fill(); ctx.restore(); } }, 1200);
      /* boats */
      slots(0.05, 700, function (x, i) { if (hash(i, 42) < 0.5) return; var y = H + (6 + hash(i, 43) * 30) * S, sc = 0.5 + hash(i, 44) * 0.6; ctx.fillStyle = css(land("#2c2a30", 0.5)); ctx.fillRect(x, y - 3 * S * sc, 30 * S * sc, 4 * S * sc); ctx.beginPath(); ctx.moveTo(x + 12 * S * sc, y - 3 * S * sc); ctx.lineTo(x + 12 * S * sc, y - 26 * S * sc); ctx.lineTo(x + 26 * S * sc, y - 4 * S * sc); ctx.closePath(); ctx.fillStyle = css(land("#efe8dc", 0.5)); ctx.fill(); if (L.lights > 0.3) glowDot(x + 12 * S * sc, y - 26 * S * sc, 6 * S, [255, 210, 140], L.lights); });
      fogBands(now, H - 40 * S, H + 60 * S);
      /* surf rolling onto the sand */
      var shore = ch * 0.8, t = now * 0.0006;
      for (var k = 0; k < 3; k++) { var yy = shore - (4 + k * 9) * S - Math.sin(t * 3 + k) * 3 * S; ctx.strokeStyle = css(mix(L.low, [255, 255, 255], 0.6), 0.35 - k * 0.08); ctx.lineWidth = (2 - k * 0.4) * S; ctx.beginPath(); for (var x = 0; x <= cw; x += 8) ctx.lineTo(x, yy + Math.sin((x + off(0.3)) * 0.02 + t * 4 + k) * 2 * S); ctx.stroke(); }
      ground(shore, land("#cdb48c", 0.2), land("#8a7458", 0));
      slots(1.0, 120, function (x, i) { var h = (20 + hash(i, 45) * 30) * S; ctx.fillStyle = css(land("#4a5a36", 0)); for (var q = 0; q < 5; q++) { ctx.beginPath(); ctx.moveTo(x + q * 4 * S, ch); ctx.quadraticCurveTo(x + q * 4 * S, ch - h, x + q * 4 * S + (q - 2) * 6 * S, ch - h * (0.8 + hash(q, i) * 0.3)); ctx.lineTo(x + q * 4 * S + 2 * S, ch); ctx.fill(); } }, 80);
      slots(1.4, 90, function (x, i) { ctx.fillStyle = css(land("#3a2e24", 0)); ctx.fillRect(x, ch * 0.88, 5 * S, ch * 0.12); });
    },
    desert: function (now) {
      /* mesas: flat tops, steep sides */
      var o = off(0.015); ctx.fillStyle = css(land("#b07a5a", 0.75)); ctx.beginPath(); ctx.moveTo(0, ch);
      for (var x = 0; x <= cw + 4; x += 4) { var n = fbm((x + o) / S * 0.004, 51, 3), hgt = n > 0.63 ? 92 + (noise((x + o) / S * 0.05, 50) - 0.5) * 4 : n > 0.6 ? (n - 0.6) / 0.03 * 92 : 18 * n; ctx.lineTo(x, H - hgt * S); }
      ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();
      ridge(0.05, H + 10 * S, 40 * S, 0.005, 52, css(land("#d39a62", 0.45)));
      if (state.timeOfDay === "afternoon" && WX.over < 0.3) { ctx.fillStyle = "rgba(255,240,220,0.05)"; for (var y = H - 20 * S; y < H + 20 * S; y += 3) ctx.fillRect(Math.sin(y * 0.3 + now * 0.01) * 3, y, cw, 1); }
      ground(H + 14 * S, land("#c99060", 0.3), land("#8a5a38", 0));
      poles(0.35, 420, H - 30 * S, ch * 0.8, css(land("#3a2a20", 0.15)), true);
      slots(0.5, 230, function (x, i) { if (hash(i, 53) < 0.4) return; var b = ch * (0.78 + hash(i, 54) * 0.08), h = (40 + hash(i, 55) * 60) * S, c = css(land("#3d5a34", 0.08)); ctx.fillStyle = c; ctx.fillRect(x - 4 * S, b - h, 8 * S, h); ctx.beginPath(); ctx.arc(x, b - h, 4 * S, 0, TAU); ctx.fill();
        var ah = h * 0.5; ctx.fillRect(x - 14 * S, b - ah, 10 * S, 5 * S); ctx.fillRect(x - 14 * S, b - ah - 18 * S, 5 * S, 20 * S); if (hash(i, 56) < 0.6) { ctx.fillRect(x + 4 * S, b - ah - 10 * S, 10 * S, 5 * S); ctx.fillRect(x + 10 * S, b - ah - 26 * S, 5 * S, 20 * S); } });
      slots(1.3, 40, function (x, i) { ctx.fillStyle = css(land("#6a5030", 0)); ctx.beginPath(); ctx.ellipse(x, ch * 0.97, (8 + hash(i, 57) * 14) * S, (4 + hash(i, 58) * 6) * S, 0, 0, TAU); ctx.fill(); }, 60);
    },
    forest: function (now) {
      ridge(0.02, H - 20 * S, 60 * S, 0.003, 61, css(land("#6f8a7a", 0.85)));
      forestRow(0.03, H - 10 * S, 8, 16, 10, 62, 0.8, "#4a6a58", [0]);
      forestRow(0.09, H + 6 * S, 30, 60, 22, 63, 0.55, "#33503f", [0, 0, 3]);
      fogBands(now, H - 60 * S, H + 40 * S);
      forestRow(0.22, H + 40 * S, 70, 120, 34, 64, 0.32, "#25402f", [0, 0, 1]);
      /* light coming down through the trees */
      if (P.stars < 0.5 && WX.over < 0.5 && (state.timeOfDay === "dawn" || state.timeOfDay === "afternoon")) { ctx.save(); ctx.globalCompositeOperation = "lighter"; for (var k = 0; k < 5; k++) { var bx = ((hash(k, 65) * cw * 1.4 - off(0.05)) % (cw * 1.4) + cw * 1.4) % (cw * 1.4) - cw * 0.2, g = ctx.createLinearGradient(bx, 0, bx - 120 * S, ch); g.addColorStop(0, "rgba(255,230,170,0.09)"); g.addColorStop(1, "rgba(255,230,170,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx + 40 * S, 0); ctx.lineTo(bx - 80 * S, ch); ctx.lineTo(bx - 160 * S, ch); ctx.closePath(); ctx.fill(); } ctx.restore(); }
      ground(H + 40 * S, land("#2a3a26", 0.2), land("#141c12", 0));
      slots(0.6, 46, function (x, i) { ctx.fillStyle = css(land(hash(i, 70) < 0.5 ? "#2e4a28" : "#3a5a2c", 0.12)); var h = (16 + hash(i, 66) * 30) * S, w = (24 + hash(i, 67) * 40) * S; ctx.beginPath(); ctx.moveTo(x - w, ch); for (var q = 0; q <= 6; q++) { var a = q / 6; ctx.lineTo(x - w + a * w * 2, ch - h * Math.sin(a * Math.PI) * (0.7 + 0.3 * hash(i + q, 71))); } ctx.lineTo(x + w, ch); ctx.fill(); }, 80);
      /* trunks right by the line, flicking past */
      slots(1.6, 160, function (x, i) { if (hash(i, 68) < 0.35) return; var w = (14 + hash(i, 69) * 20) * S; ctx.fillStyle = css(land("#1a1410", 0)); ctx.fillRect(x, 0, w, ch); ctx.fillStyle = css(land("#3a2c20", 0), 0.35); ctx.fillRect(x + w * 0.65, 0, w * 0.2, ch); }, 120);
    },
    lake: function (now) {
      ridge(0.015, H - 4 * S, 40 * S, 0.003, 71, css(land("#7e8eaa", 0.85)));
      forestRow(0.02, H - 2 * S, 5, 10, 9, 72, 0.8, "#53667a", [0, 3]);
      slots(0.02, 1500, function (x, i) { if (hash(i, 73) < 0.4) return; var b = ridgeY(x, 0.015, H - 4 * S, 40 * S, 0.003, 71) + 6 * S; house(x, b, 12 * S, 8 * S, css(land("#e6dccb", 0.8)), css(land("#5a3a2a", 0.8)), L.lights, i); });
      water(H, ch, 0.04);
      reflectRidge(0.015, H - 4 * S, 40 * S, 0.003, 71, css(land("#7e8eaa", 0.9)), false, H, ch, 0.35);
      fogBands(now, H - 30 * S, H + 80 * S);
      slots(0.06, 900, function (x, i) { if (hash(i, 74) < 0.5) return; var y = H + (10 + hash(i, 75) * 50) * S, sc = 0.5 + hash(i, 76); ctx.fillStyle = css(land("#efe8dc", 0.5)); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 24 * S * sc); ctx.lineTo(x + 14 * S * sc, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = css(land("#3a3036", 0.5)); ctx.fillRect(x - 6 * S * sc, y, 24 * S * sc, 3 * S * sc); });
      /* the bridge: steel trusses whipping past right outside */
      var c = css(land("#2a2a30", 0)), bot = ch * 0.9;
      ctx.fillStyle = c; ctx.fillRect(0, bot, cw, ch - bot); ctx.fillRect(0, bot - 6 * S, cw, 4 * S);
      slots(2.2, 300, function (x, i) { ctx.fillStyle = c; ctx.fillRect(x, 0, 10 * S, ch); ctx.strokeStyle = c; ctx.lineWidth = 7 * S; ctx.beginPath(); ctx.moveTo(x, bot); ctx.lineTo(x + 300 * S, 0); ctx.moveTo(x, 0); ctx.lineTo(x + 300 * S, bot); ctx.stroke(); }, 340);
      ctx.fillStyle = c; ctx.fillRect(0, 0, cw, 8 * S);
    },
    hutong: function (now) {
      buildings(0.025, H - 4 * S, 30, 90, 30, 70, 101, 0.88, "#8a90a8", { windows: 1.4 });
      /* the Drum Tower over the rooftops */
      slots(0.035, 2200, function (x, i) { var tx = x + 700 * S, b = H + 4 * S, c = css(land("#6a3a30", 0.7)), r = css(land("#3a3a40", 0.7)); ctx.fillStyle = css(land("#7a6a60", 0.7)); ctx.fillRect(tx - 70 * S, b - 40 * S, 140 * S, 40 * S); ctx.fillStyle = c; ctx.fillRect(tx - 50 * S, b - 80 * S, 100 * S, 40 * S); ctx.fillStyle = r; ctx.beginPath(); ctx.moveTo(tx - 74 * S, b - 78 * S); ctx.quadraticCurveTo(tx - 40 * S, b - 92 * S, tx - 30 * S, b - 104 * S); ctx.lineTo(tx + 30 * S, b - 104 * S); ctx.quadraticCurveTo(tx + 40 * S, b - 92 * S, tx + 74 * S, b - 78 * S); ctx.fill(); ctx.fillStyle = c; ctx.fillRect(tx - 34 * S, b - 124 * S, 68 * S, 22 * S); ctx.fillStyle = r; ctx.beginPath(); ctx.moveTo(tx - 54 * S, b - 122 * S); ctx.quadraticCurveTo(tx - 26 * S, b - 132 * S, tx - 20 * S, b - 142 * S); ctx.lineTo(tx + 20 * S, b - 142 * S); ctx.quadraticCurveTo(tx + 26 * S, b - 132 * S, tx + 54 * S, b - 122 * S); ctx.fill(); if (L.lights > 0.3) glowDot(tx, b - 60 * S, 120 * S, [255, 160, 90], 0.2 * L.lights); });
      forestRow(0.07, H + 6 * S, 40, 70, 160, 102, 0.5, "#4a6a40", [1]);
      slots(0.1, 110, function (x, i) { hutongHouse(x, H + 30 * S, (80 + hash(i, 103) * 20) * S, 44 * S, i); });
      fogBands(now, H - 40 * S, H + 40 * S);
      ground(H + 30 * S, land("#6a6a68", 0.25), land("#3a3a3a", 0));
      /* the lane with the bar and the book corner, passing by every so often */
      if (!(state.station && state.station.name === "Gulou Hutong" && Math.abs(state.stationScrollOffset) < cw * 3)) slots(0.3, 2400, function (x, i) { if (i % 2) return; shopfronts(x + 600 * S, ch * 0.88, 0.95); }, 600);
      slots(0.6, 220, function (x, i) { ctx.fillStyle = css(land("#2a2a2c", 0.05)); ctx.fillRect(x, ch * 0.62, 3 * S, ch * 0.3); if (L.lights > 0.2) glowDot(x + 1, ch * 0.62, 30 * S, [255, 200, 120], 0.5 * L.lights);
        if (hash(i, 104) < 0.35) { ctx.strokeStyle = css(land("#1e1e22", 0.03)); ctx.lineWidth = 2 * S; var by = ch * 0.92, bx = x + 40 * S; ctx.beginPath(); ctx.arc(bx, by, 9 * S, 0, TAU); ctx.arc(bx + 30 * S, by, 9 * S, 0, TAU); ctx.moveTo(bx, by); ctx.lineTo(bx + 12 * S, by - 14 * S); ctx.lineTo(bx + 30 * S, by); ctx.moveTo(bx + 12 * S, by - 14 * S); ctx.lineTo(bx + 24 * S, by - 14 * S); ctx.stroke(); } }, 100);
    },
    snow: function (now) {
      var glowSnow = function (d) { return css(mix(land("#eef3fa", d), mix(L.low, [190, 205, 240], 0.5), P.stars * 0.5)); };
      ridge(0.015, H - 4 * S, 50 * S, 0.003, 81, glowSnow(0.75));
      forestRow(0.03, H, 8, 18, 12, 82, 0.6, "#3c4f5a", [0, 0, 2]);
      slots(0.05, 520, function (x, i) { if (hash(i, 83) < 0.45) return; var b = H + 10 * S, w = 24 * S; house(x, b, w, 14 * S, css(land("#6a4a3a", 0.45)), css(land("#f2f5fb", 0.45)), L.lights, i + 9);
        ctx.fillStyle = css(land("#dfe6f0", 0.45), 0.35); for (var k = 0; k < 4; k++) { var t = (now * 0.0004 + k * 0.25) % 1; ctx.beginPath(); ctx.arc(x + w * 0.75 - t * 20 * S, b - 26 * S - t * 34 * S, (3 + t * 8) * S, 0, TAU); ctx.fill(); } });
      fogBands(now, H - 30 * S, H + 30 * S);
      var g = ctx.createLinearGradient(0, H, 0, ch); g.addColorStop(0, glowSnow(0.4)); g.addColorStop(1, glowSnow(0.05)); ctx.fillStyle = g; ctx.fillRect(0, H + 6 * S, cw, ch - H);
      for (var r = 0; r < 4; r++) { ctx.fillStyle = css(land("#a8b8d4", 0.3), 0.25); ctx.beginPath(); var y = H + (30 + r * 40) * S; ctx.moveTo(0, y); for (var x = 0; x <= cw; x += 10) ctx.lineTo(x, y + Math.sin((x + off(0.2 + r * 0.25)) * 0.01 + r) * 6 * S); ctx.lineTo(cw, y + 14 * S); ctx.lineTo(0, y + 14 * S); ctx.fill(); }
      forestRow(0.4, ch * 0.86, 40, 90, 160, 84, 0.12, "#2a3640", [2, 0]);
      slots(1.2, 70, function (x, i) { ctx.fillStyle = css(land("#3a2e28", 0)); ctx.fillRect(x, ch * 0.9, 4 * S, ch * 0.1); ctx.fillStyle = css(land("#f4f7fc", 0)); ctx.fillRect(x - 1, ch * 0.9 - 3 * S, 6 * S, 3 * S); }, 60);
    }
  };
  /* Wei's Bar and the book corner, side by side on the lane; rects remembered so a tap can find them */
  var HITS = [];
  function shopfronts(x, base, k) {
    k = k || 1; var lit = L.lights, w = 150 * S * k, h = 120 * S * k, gap = 44 * S * k, bx = x - w - gap / 2, kx = x + gap / 2;
    /* Wei's Bar: dark wood, two arched amber windows, a neon name */
    ctx.fillStyle = css(land("#3a2414", 0.1)); ctx.fillRect(bx, base - h, w, h);
    ctx.fillStyle = css(land("#2a2a30", 0.1)); ctx.beginPath(); ctx.moveTo(bx - 10 * S * k, base - h); ctx.lineTo(bx + w / 2, base - h - 26 * S * k); ctx.lineTo(bx + w + 10 * S * k, base - h); ctx.fill();
    for (var q = 0; q < 2; q++) { var wx = bx + 18 * S * k + q * 72 * S * k, wy = base - h * 0.72, ww = 44 * S * k, wh = 50 * S * k, g = ctx.createRadialGradient(wx + ww / 2, wy + wh * 0.8, 2, wx + ww / 2, wy + wh * 0.6, ww);
      g.addColorStop(0, css([255, 214, 140], 0.5 + lit * 0.5)); g.addColorStop(1, css([200, 110, 40], 0.4 + lit * 0.5)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx, wy + ww / 2); ctx.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(wx + ww, wy + wh); ctx.fill(); }
    if (lit > 0.2) glowDot(bx + w / 2, base - h * 0.45, w * 0.9, [255, 180, 100], 0.22 * lit);
    ctx.save(); ctx.font = "italic 600 " + Math.round(15 * S * k) + "px Georgia,'Songti SC',serif"; ctx.textAlign = "center"; ctx.fillStyle = lit > 0.3 ? "#ffd9a8" : "#e8c39a"; if (lit > 0.3) { ctx.shadowColor = "#ff8a3a"; ctx.shadowBlur = 12; }
    fitText("Wei's Bar & Coffee", bx + w / 2, base - h - 30 * S * k, w + gap * 0.8); ctx.restore();
    /* two cats on the step, sometimes */
    if (Math.floor(state.scrollDist / 4000) % 2 === 0) { ctx.fillStyle = "#e8913a"; ctx.beginPath(); ctx.ellipse(bx + 20 * S * k, base - 5 * S * k, 8 * S * k, 5 * S * k, 0, 0, TAU); ctx.arc(bx + 27 * S * k, base - 10 * S * k, 4 * S * k, 0, TAU); ctx.fill(); ctx.fillStyle = "#231b17"; ctx.beginPath(); ctx.ellipse(bx + w - 22 * S * k, base - 5 * S * k, 8 * S * k, 5 * S * k, 0, 0, TAU); ctx.arc(bx + w - 29 * S * k, base - 10 * S * k, 4 * S * k, 0, TAU); ctx.fill(); }
    /* the book corner: green door, a wide window of shelves */
    ctx.fillStyle = css(land("#5a4a3a", 0.1)); ctx.fillRect(kx, base - h, w, h);
    ctx.fillStyle = css(land("#2a2a30", 0.1)); ctx.beginPath(); ctx.moveTo(kx - 10 * S * k, base - h); ctx.lineTo(kx + w / 2, base - h - 26 * S * k); ctx.lineTo(kx + w + 10 * S * k, base - h); ctx.fill();
    var sx = kx + 12 * S * k, sy = base - h * 0.8, sw = w * 0.55, sh = h * 0.6;
    ctx.fillStyle = css(mix([255, 226, 170], [120, 90, 60], 1 - (0.35 + lit * 0.65))); ctx.fillRect(sx, sy, sw, sh);
    for (var r = 0; r < 3; r++) { var shelfY = sy + sh * (r + 1) / 3; ctx.fillStyle = "#6b4426"; ctx.fillRect(sx, shelfY - 2 * S * k, sw, 2 * S * k);
      for (var b = 0, bxx = sx + 2 * S * k; bxx < sx + sw - 6 * S * k; b++) { var bw = (3 + hash(b, r + 7) * 4) * S * k, bh = sh / 3 * (0.55 + hash(b, r + 9) * 0.35); ctx.fillStyle = ["#7c2513", "#1e3a5f", "#2f4a2a", "#c8a050", "#5a3a6e"][(hash(b, r) * 5) | 0]; ctx.fillRect(bxx, shelfY - 2 * S * k - bh, bw, bh); bxx += bw + 1; } }
    ctx.strokeStyle = "#3a2414"; ctx.lineWidth = 3 * S * k; ctx.strokeRect(sx, sy, sw, sh);
    ctx.fillStyle = css(land("#2f5a3a", 0.1)); ctx.fillRect(kx + w * 0.7, base - h * 0.78, w * 0.22, h * 0.78);
    ctx.fillStyle = "#c8a050"; ctx.beginPath(); ctx.arc(kx + w * 0.74, base - h * 0.4, 2 * S * k, 0, TAU); ctx.fill();
    if (lit > 0.2) glowDot(sx + sw / 2, sy + sh / 2, w * 0.8, [255, 210, 140], 0.2 * lit);
    ctx.save(); ctx.font = "600 " + Math.round(13 * S * k) + "px Georgia,'Songti SC',serif"; ctx.textAlign = "center"; ctx.fillStyle = "#f3dfb8"; fitText("📖 The Dog-Eared Corner", kx + w / 2, base - h - 30 * S * k, w + gap * 0.8); ctx.restore();
    HITS.push({ k: "bar", x: bx, y: base - h - 30 * S * k, w: w, h: h + 30 * S * k }, { k: "books", x: kx, y: base - h - 30 * S * k, w: w, h: h + 30 * S * k });
  }
  function hutongHouse(x, base, w, h, i) {
    ctx.fillStyle = css(land("#8a8a86", 0.35)); ctx.fillRect(x, base - h, w, h);
    ctx.fillStyle = css(land("#3a3c40", 0.35)); ctx.beginPath(); ctx.moveTo(x - 10 * S, base - h + 2 * S); ctx.quadraticCurveTo(x - 4 * S, base - h - 4 * S, x + 4 * S, base - h - 14 * S); ctx.lineTo(x + w - 4 * S, base - h - 14 * S); ctx.quadraticCurveTo(x + w + 4 * S, base - h - 4 * S, x + w + 10 * S, base - h + 2 * S); ctx.fill();
    ctx.fillStyle = css(land("#8a2a20", 0.3)); ctx.fillRect(x + w * 0.4, base - h * 0.62, w * 0.2, h * 0.62);
    if (L.lights > 0.15) { glowDot(x + w * 0.32, base - h * 0.7, 18 * S, [255, 90, 60], 0.7 * L.lights); ctx.fillStyle = "rgba(230,60,40,0.95)"; ctx.beginPath(); ctx.ellipse(x + w * 0.32, base - h * 0.7, 5 * S, 6 * S, 0, 0, TAU); ctx.fill(); }
    else { ctx.fillStyle = "rgba(200,50,40,0.9)"; ctx.beginPath(); ctx.ellipse(x + w * 0.32, base - h * 0.7, 5 * S, 6 * S, 0, 0, TAU); ctx.fill(); }
    if (hash(i, 5) < 0.5) win(x + w * 0.72, base - h * 0.6, w * 0.14, h * 0.22, 0, L.lights);
  }
  function peakSnow(par, base, amp, freq, seed, depth, line) {
    line = line || 0.55; var o = off(par); ctx.fillStyle = css(land("#f2f5fc", depth * 0.85)); ctx.beginPath(); var on = false;
    for (var x = 0; x <= cw + 4; x += 4) {
      var wx = (x + o) / S, n = ridgeN(wx * freq, seed, 5);
      if (n > line) { var y = base - amp * n, y2 = base - amp * (line + (n - line) * 0.25) + Math.sin(wx * 0.3) * 3; if (!on) { ctx.moveTo(x, y2); on = true; } ctx.lineTo(x, y); pts.push([x, y2]); }
      else if (on) { closeSnow(); on = false; }
    }
    if (on) closeSnow();
    function closeSnow() { for (var k = pts.length - 1; k >= 0; k--) ctx.lineTo(pts[k][0], pts[k][1]); ctx.closePath(); ctx.fill(); ctx.beginPath(); pts = []; }
  }
  var pts = [];

  /* ---------- things close to the train ---------- */
  var lastPole = -1;
  function catenary() {
    var c = css(mix([16, 14, 18], L.low, 0.08), 0.85);
    ctx.strokeStyle = css([20, 18, 24], 0.55); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(0, 30 * S); ctx.quadraticCurveTo(cw * 0.5, 44 * S, cw, 30 * S); ctx.stroke();
    ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(0, 46 * S); ctx.quadraticCurveTo(cw * 0.5, 54 * S, cw, 46 * S); ctx.stroke();
    if (state.biome === "lake") return;
    slots(2.0, 560, function (x, i) {
      ctx.fillStyle = c; ctx.fillRect(x, 0, 8 * S, ch); ctx.fillRect(x - 30 * S, 26 * S, 60 * S, 4 * S);
      if (i !== lastPole && x < cw * 0.55 && x > cw * 0.3 && state.speed > 0.4) { lastPole = i; try { playSpatialPoleWhoosh(); } catch (e) {} }
    }, 100);
  }
  var bellAt = -1;
  function crossing(now) {
    if (state.biome === "lake" || state.biome === "forest") return;
    slots(1.35, 3200, function (x, i) {
      if (hash(i, 91) < 0.4) return; var y = ch * 0.86, c = css(land("#d8dde4", 0.05));
      ctx.fillStyle = c; ctx.fillRect(x, y - 70 * S, 5 * S, 70 * S);
      ctx.fillStyle = "#1a1a1a"; ctx.fillRect(x - 14 * S, y - 64 * S, 33 * S, 4 * S);
      var f = Math.sin(now * 0.012) > 0; glowDot(x - 10 * S, y - 56 * S, (f ? 22 : 8) * S, [255, 60, 50], f ? 0.9 : 0.3); glowDot(x + 15 * S, y - 56 * S, (!f ? 22 : 8) * S, [255, 60, 50], !f ? 0.9 : 0.3);
      ctx.fillStyle = "#e8c200"; for (var k = 0; k < 5; k++) ctx.fillRect(x + 5 * S + k * 24 * S, y - 30 * S, 12 * S, 4 * S);
      if (i !== bellAt && Math.abs(x - cw * 0.5) < 260 && state.speed > 0.2) { bellAt = i; try { playSpatialCrossingBell(Math.max(-1, Math.min(1, x / cw * 2 - 1))); } catch (e) {} }
    }, 200);
  }
  function rails() {
    var y = ch * 0.965; ctx.fillStyle = css(land("#2a2622", 0)); ctx.fillRect(0, y, cw, ch - y);
    ctx.fillStyle = css(mix(land("#8a8680", 0), L.low, 0.15), 0.8); ctx.fillRect(0, y + 2 * S, cw, 1.5 * S);
    if (state.speed > 0.02) { ctx.fillStyle = css(land("#1a1612", 0), 0.6); slots(3.2, 34, function (x) { ctx.fillRect(x, y + 4 * S, 14 * S * (1 + state.speed * 2), 4 * S); }, 60); }
  }
  /* the express that thunders past on the other line */
  function express(dt) {
    if (state.passingTrainX <= -2600) { if (state.speed > 0.5 && Math.random() < 0.0003) { try { triggerPassingExpressTrain(); } catch (e) {} } return; }
    state.passingTrainX -= (26 + state.speed * 18) * dt * S;
    var x0 = state.passingTrainX, len = 2400 * S, top = ch * 0.3, bot = ch * 0.94, body = css(mix([18, 22, 34], L.low, 0.12));
    if (x0 > cw || x0 + len < 0) return;
    ctx.fillStyle = body; ctx.fillRect(Math.max(0, x0), top, Math.min(cw, x0 + len) - Math.max(0, x0), bot - top);
    ctx.fillStyle = "rgba(200,40,40,0.9)"; ctx.fillRect(Math.max(0, x0), top + (bot - top) * 0.72, Math.min(cw, x0 + len) - Math.max(0, x0), 6 * S);
    for (var wx = x0 + 60 * S; wx < x0 + len - 80 * S; wx += 120 * S) {
      if (wx < -140 * S || wx > cw) continue; var g = ctx.createLinearGradient(wx, 0, wx + 100 * S, 0); g.addColorStop(0, "rgba(255,236,190,0.15)"); g.addColorStop(0.5, "rgba(255,236,190,0.75)"); g.addColorStop(1, "rgba(255,236,190,0.15)");
      ctx.fillStyle = g; ctx.fillRect(wx, top + (bot - top) * 0.22, 100 * S, (bot - top) * 0.3);
    }
    for (var gx = x0; gx < x0 + len; gx += 300 * S) { if (gx < -10 || gx > cw) continue; ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(gx, top, 4 * S, bot - top); }
  }
  /* the tunnel: rock, lamps whipping past, and your own cabin looking back at you */
  function tunnel(now) {
    var b = state.tunnelBlend; if (b < 0.01) return;
    ctx.save(); ctx.globalAlpha = b; ctx.fillStyle = "#07060a"; ctx.fillRect(0, 0, cw, ch);
    slots(2.6, 200, function (x) { ctx.fillStyle = "#121016"; ctx.fillRect(x, 0, 22 * S, ch); }, 60);
    slots(2.6, 420, function (x) { glowDot(x, ch * 0.42, 110 * S, [255, 170, 80], 0.45); ctx.fillStyle = "#ffe9a8"; ctx.fillRect(x - 24 * S * (1 + state.speed), ch * 0.42 - 2 * S, 48 * S * (1 + state.speed), 4 * S); }, 200);
    /* reflection of the cabin in the black glass */
    ctx.globalAlpha = b * 0.16; glowDot(cw * 0.12, ch * 0.32, 160 * S, [255, 190, 110], 0.9);
    ctx.fillStyle = "rgba(255,220,180,0.5)"; ctx.fillRect(cw * 0.04, ch * 0.62, cw * 0.3, 4 * S); ctx.fillRect(cw * 0.7, ch * 0.18, 4 * S, ch * 0.6);
    ctx.restore();
  }

  /* ---------- stations ---------- */
  var STYLE = { hutong: "open", metropolis: "city", coastal: "open", desert: "open", lake: "open", countryside: "halt", forest: "halt", alpine: "chalet", snow: "chalet" };
  function station(now) {
    var sx = state.stationScrollOffset; if (!(sx > -cw * 3 && sx < cw * 3)) return;
    var st = state.station || {}, style = STYLE[state.biome] || "halt", cx = cw * 0.5 + sx, wid = cw * (style === "city" ? 2.6 : 1.6), x0 = cx - wid / 2, x1 = cx + wid / 2;
    var py = ch * 0.8, lit = L.lights, seed = (st.name || "x").length * 7 + (st.name || "x").charCodeAt(0);
    /* back wall for the big city stations */
    if (style === "city") { ctx.fillStyle = css(land("#3a3c44", 0.15)); ctx.fillRect(x0, ch * 0.14, wid, py - ch * 0.14);
      for (var a = x0 + 80 * S; a < x1 - 120 * S; a += 260 * S) { ctx.fillStyle = css(lit > 0.3 ? [250, 245, 230] : land("#d8d2c4", 0.1), 0.85); ctx.fillRect(a, ch * 0.34, 150 * S, 80 * S); ctx.fillStyle = css([[200, 80, 70], [60, 120, 180], [230, 170, 60], [90, 150, 100]][(hash(a | 0, seed) * 4) | 0], 0.75); ctx.fillRect(a + 10 * S, ch * 0.34 + 10 * S, 130 * S, 50 * S); }
      for (var v = x0 + 40 * S; v < x1; v += 700 * S) { ctx.fillStyle = css(land("#c8443a", 0.1)); ctx.fillRect(v, py - 90 * S, 40 * S, 90 * S); if (lit > 0.2) { ctx.fillStyle = "rgba(220,240,255," + 0.8 * lit + ")"; ctx.fillRect(v + 5 * S, py - 82 * S, 30 * S, 44 * S); } } }
    if (st.name === "Gulou Hutong") shopfronts(cx, py, 1.25);
    /* platform */
    ctx.fillStyle = css(land(style === "halt" ? "#8a8070" : "#9a9890", 0.08)); ctx.fillRect(x0, py, wid, ch - py);
    ctx.fillStyle = css(land("#e8c84a", 0.05)); ctx.fillRect(x0, py + 8 * S, wid, 5 * S);
    ctx.fillStyle = css(land("#5a5650", 0.05)); ctx.fillRect(x0, py, wid, 3 * S);
    /* roof and pillars */
    var roofY = style === "open" ? 0 : ch * (style === "city" ? 0.1 : 0.16), roofCol = css(land(style === "chalet" ? "#5a3a2a" : style === "halt" ? "#6a4a32" : "#4a4e58", 0.1));
    var rx0 = style === "halt" || style === "chalet" ? cx - wid * 0.3 : x0, rx1 = style === "halt" || style === "chalet" ? cx + wid * 0.3 : x1;
    if (roofY) { ctx.fillStyle = roofCol; ctx.fillRect(rx0, 0, rx1 - rx0, roofY); ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(rx0, roofY, rx1 - rx0, 6 * S);
      if (style === "chalet") { ctx.fillStyle = css(land("#f2f5fb", 0.1)); ctx.fillRect(rx0, roofY - 10 * S, rx1 - rx0, 10 * S); for (var ic = rx0; ic < rx1; ic += 26 * S) { ctx.beginPath(); ctx.moveTo(ic, roofY); ctx.lineTo(ic + 3 * S, roofY + (6 + hash(ic | 0, 3) * 14) * S); ctx.lineTo(ic + 6 * S, roofY); ctx.fill(); } }
      for (var p = rx0 + 60 * S; p < rx1; p += 240 * S) { ctx.fillStyle = roofCol; ctx.fillRect(p, roofY, 9 * S, py - roofY); } }
    /* lamps */
    var every = style === "city" ? 240 : 300;
    for (var lx = x0 + 120 * S; lx < x1; lx += every * S) {
      var ly = roofY ? roofY + 30 * S : ch * 0.42;
      if (!roofY) { ctx.fillStyle = css(land("#2a2a30", 0.05)); ctx.fillRect(lx - 2 * S, ly, 4 * S, py - ly); ctx.fillRect(lx - 10 * S, ly, 20 * S, 4 * S); }
      else { ctx.strokeStyle = roofCol; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx, roofY); ctx.lineTo(lx, ly); ctx.stroke(); }
      ctx.fillStyle = css(lit > 0.3 ? [255, 236, 190] : [200, 200, 200]); ctx.beginPath(); ctx.arc(lx, ly + 4 * S, 6 * S, 0, TAU); ctx.fill();
      if (lit > 0.2) { glowDot(lx, ly + 4 * S, 90 * S, [255, 200, 120], 0.5 * lit); var pool = ctx.createRadialGradient(lx, py + 10 * S, 0, lx, py + 10 * S, 90 * S); pool.addColorStop(0, "rgba(255,210,140," + 0.22 * lit + ")"); pool.addColorStop(1, "rgba(255,210,140,0)"); ctx.fillStyle = pool; ctx.fillRect(lx - 90 * S, py, 180 * S, 40 * S); }
    }
    /* the name board */
    var bw = Math.min(360 * S, cw * 0.5), bh = 70 * S, by = roofY ? roofY + 40 * S : st.name === "Gulou Hutong" ? ch * 0.06 : ch * 0.26, bx = cx - bw / 2;
    if (!roofY) { ctx.fillStyle = css(land("#2a2a30", 0.05)); ctx.fillRect(bx + 20 * S, by + bh, 5 * S, py - by - bh); ctx.fillRect(bx + bw - 25 * S, by + bh, 5 * S, py - by - bh); }
    else { ctx.strokeStyle = roofCol; ctx.beginPath(); ctx.moveTo(bx + 30 * S, roofY); ctx.lineTo(bx + 30 * S, by); ctx.moveTo(bx + bw - 30 * S, roofY); ctx.lineTo(bx + bw - 30 * S, by); ctx.stroke(); }
    ctx.fillStyle = css(mix([246, 244, 236], L.low, 0.1)); ctx.fillRect(bx, by, bw, bh); if (lit > 0.3) glowDot(cx, by + bh / 2, bw * 0.7, [255, 250, 230], 0.25 * lit);
    ctx.fillStyle = st.ink || "#1d4ed8"; ctx.fillRect(bx, by + bh - 9 * S, bw, 9 * S);
    ctx.fillStyle = "#1c1c22"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "600 " + Math.round(24 * S) + "px 'Plus Jakarta Sans','PingFang SC','Microsoft YaHei',system-ui,sans-serif"; fitText(st.name || "", cx, by + bh * 0.38, bw - 24 * S);
    if (st.jp) { ctx.font = Math.round(12 * S) + "px 'Hiragino Sans','Noto Sans JP','PingFang SC',sans-serif"; ctx.fillStyle = "#55555e"; ctx.fillText(st.jp, cx, by + bh * 0.74); }
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    /* benches, a clock, people waiting */
    for (var bi = 0; bi < 3; bi++) { var bxx = x0 + wid * (0.18 + bi * 0.3); ctx.fillStyle = css(land("#5a3e2a", 0.05)); ctx.fillRect(bxx, py - 22 * S, 60 * S, 6 * S); ctx.fillRect(bxx, py - 36 * S, 60 * S, 4 * S); ctx.fillRect(bxx + 4 * S, py - 16 * S, 4 * S, 16 * S); ctx.fillRect(bxx + 52 * S, py - 16 * S, 4 * S, 16 * S); }
    var n = 2 + (hash(seed, 2) * 5 | 0), umb = WX.rain > 0.4 && !roofY;
    for (var k = 0; k < n; k++) person(st.name === "Gulou Hutong" ? x0 + wid * (hash(k, seed) < 0.5 ? 0.06 + hash(k, seed) * 0.4 : 0.54 + hash(k, seed) * 0.4) : x0 + wid * (0.1 + hash(k, seed) * 0.8), py, 0.85 + hash(k, seed + 1) * 0.3, k + seed, umb, now);
    if (hash(seed, 9) < 0.5) { var catX = x0 + wid * (0.3 + hash(seed, 10) * 0.4); ctx.fillStyle = hash(seed, 11) < 0.5 ? "#e8913a" : "#231b17"; ctx.beginPath(); ctx.ellipse(catX, py - 7 * S, 11 * S, 7 * S, 0, 0, TAU); ctx.arc(catX + 10 * S, py - 13 * S, 6 * S, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(catX + 6 * S, py - 17 * S); ctx.lineTo(catX + 8 * S, py - 24 * S); ctx.lineTo(catX + 11 * S, py - 18 * S); ctx.moveTo(catX + 11 * S, py - 18 * S); ctx.lineTo(catX + 15 * S, py - 24 * S); ctx.lineTo(catX + 16 * S, py - 15 * S); ctx.fill(); ctx.lineWidth = 3 * S; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.moveTo(catX - 10 * S, py - 6 * S); ctx.quadraticCurveTo(catX - 22 * S, py - 10 * S, catX - 18 * S, py - 22 * S + Math.sin(now * 0.003) * 3 * S); ctx.stroke(); }
  }
  function fitText(t, x, y, max) { var s = 1; while (ctx.measureText(t).width > max && s > 0.5) { s -= 0.06; var f = ctx.font.replace(/(\d+)px/, function (m, p) { return Math.round(p * 0.94) + "px"; }); ctx.font = f; } ctx.fillText(t, x, y); }
  function person(x, base, sc, seed, umb, now) {
    var h = 62 * S * sc, col = css(land(["#2a2a34", "#3a2a2a", "#2a3a34", "#3a3428"][(hash(seed, 1) * 4) | 0], 0.03)), sway = Math.sin(now * 0.0015 + seed) * 0.6 * S;
    ctx.fillStyle = col;
    ctx.fillRect(x - 5 * S * sc, base - h * 0.45, 4 * S * sc, h * 0.45); ctx.fillRect(x + 1 * S * sc, base - h * 0.45, 4 * S * sc, h * 0.45);
    ctx.beginPath(); ctx.moveTo(x - 8 * S * sc + sway, base - h * 0.85); ctx.lineTo(x + 8 * S * sc + sway, base - h * 0.85); ctx.lineTo(x + 9 * S * sc, base - h * 0.42); ctx.lineTo(x - 9 * S * sc, base - h * 0.42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(x + sway, base - h * 0.93, 6 * S * sc, 0, TAU); ctx.fill();
    var r = hash(seed, 2);
    if (umb) { ctx.fillStyle = css([[180, 50, 60], [40, 70, 120], [30, 30, 36], [200, 160, 60]][(r * 4) | 0], 0.95); ctx.beginPath(); ctx.arc(x + sway, base - h * 1.05, 20 * S * sc, Math.PI, 0); ctx.fill(); ctx.fillRect(x + sway - 0.7, base - h * 1.05, 1.4, h * 0.3); }
    else if (r < 0.3) { ctx.fillRect(x + 10 * S * sc, base - h * 0.28, 14 * S * sc, h * 0.28); }   /* suitcase */
    else if (r < 0.55 && L.lights > 0.4) glowDot(x + 6 * S * sc + sway, base - h * 0.7, 10 * S, [170, 210, 255], 0.6);   /* a phone */
  }

  /* ---------- weather on the window ---------- */
  var drops = [], flakes = [], streaks = [], petals = [], flies = [], bolt = null, sill = 0;
  function weather(now, dt) {
    var sp = state.speed, tun = state.tunnelBlend > 0.5;
    /* rain falling outside */
    var nRain = tun ? 0 : Math.round(WX.rain * 230);
    while (streaks.length < nRain) streaks.push({ x: Math.random() * cw, y: Math.random() * ch, d: Math.random() });
    if (streaks.length > nRain) streaks.length = nRain;
    if (streaks.length) {
      ctx.strokeStyle = css(mix(L.low, [220, 230, 240], 0.5), 0.28 + WX.storm * 0.1); ctx.lineWidth = 1; ctx.beginPath();
      for (var i = 0; i < streaks.length; i++) { var s = streaks[i], vy = (12 + s.d * 12) * dt * S, vx = -(2 + sp * 16 * (0.5 + s.d)) * dt * S; s.x += vx; s.y += vy; if (s.y > ch || s.x < -20) { s.y = -10 - Math.random() * 40; s.x = Math.random() * (cw + 200); } ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - vx * 1.6, s.y - vy * 1.6); }
      ctx.stroke();
    }
    /* snow */
    var nSnow = tun ? 0 : Math.round(WX.snow * 200);
    while (flakes.length < nSnow) flakes.push({ x: Math.random() * cw, y: Math.random() * ch, d: Math.random(), p: Math.random() * TAU });
    if (flakes.length > nSnow) flakes.length = nSnow;
    for (var f = 0; f < flakes.length; f++) { var fl = flakes[f]; fl.p += 0.03 * dt; fl.x += (-(0.4 + sp * 9 * (0.4 + fl.d)) + Math.sin(fl.p) * 0.5) * dt * S; fl.y += (0.6 + fl.d * 1.6) * dt * S; if (fl.y > ch || fl.x < -10) { fl.y = -5; fl.x = Math.random() * (cw + 300); } ctx.fillStyle = "rgba(255,255,255," + (0.5 + fl.d * 0.45) + ")"; ctx.beginPath(); ctx.arc(fl.x, fl.y, (0.8 + fl.d * 2.2) * S, 0, TAU); ctx.fill(); }
    /* blossom on spring mornings, fireflies on warm nights */
    if (extras.petals && !tun && WX.over < 0.3 && P.stars < 0.4) { while (petals.length < 40) petals.push({ x: Math.random() * cw, y: Math.random() * ch, r: Math.random() * TAU, d: Math.random() }); petals.forEach(function (q) { q.r += 0.04 * dt; q.x -= (0.8 + sp * 7 * (0.4 + q.d)) * dt * S; q.y += (0.4 + Math.sin(q.r) * 0.6) * dt * S; if (q.x < -10 || q.y > ch) { q.x = cw + Math.random() * 200; q.y = Math.random() * ch * 0.7; } ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.r); ctx.fillStyle = "rgba(255,190,205," + (0.6 + q.d * 0.35) + ")"; ctx.beginPath(); ctx.ellipse(0, 0, (3 + q.d * 3) * S, (1.6 + q.d) * S, 0, 0, TAU); ctx.fill(); ctx.restore(); }); } else petals.length = 0;
    if (extras.flies && !tun && P.stars > 0.5 && WX.rain < 0.3) { while (flies.length < 34) flies.push({ x: Math.random() * cw, y: H + Math.random() * (ch - H) * 0.8, p: Math.random() * TAU, v: Math.random() }); flies.forEach(function (q) { q.p += 0.02 * dt; q.x -= (0.2 + sp * 1.5) * dt * S * (0.5 + q.v); q.y += Math.sin(q.p * 1.3) * 0.3; if (q.x < -10) q.x = cw + 10; glowDot(q.x, q.y, 9 * S, [220, 255, 120], 0.55 * (0.5 + 0.5 * Math.sin(q.p * 3))); }); } else flies.length = 0;
    /* fog close to the glass */
    fogBands(now, H - 80 * S, ch);
    /* lightning */
    if (WX.storm > 0.5 && !tun && !bolt && Math.random() < 0.0035 * dt) {
      var bx = cw * (0.15 + Math.random() * 0.7), path = [[bx, 0]], y = 0; while (y < H - 20 * S) { y += (16 + Math.random() * 30) * S; bx += (Math.random() - 0.5) * 50 * S; path.push([bx, y]); }
      bolt = { path: path, t: 1 }; state.lightningAlpha = 0.7; try { setTimeout(triggerThunderSound, 300 + Math.random() * 1200); } catch (e) {}
    }
    if (state.lightningAlpha > 0) { ctx.fillStyle = "rgba(225,235,255," + state.lightningAlpha * 0.6 + ")"; ctx.fillRect(0, 0, cw, ch); state.lightningAlpha = Math.max(0, state.lightningAlpha - 0.06 * dt); }
    if (bolt) { ctx.save(); ctx.strokeStyle = "rgba(240,245,255," + bolt.t + ")"; ctx.lineWidth = 2.5 * S; ctx.shadowColor = "rgba(180,200,255,0.9)"; ctx.shadowBlur = 18; ctx.beginPath(); bolt.path.forEach(function (p, k) { k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore(); bolt.t -= 0.08 * dt; if (bolt.t <= 0) bolt = null; }
  }
  /* water beading on the glass and running back along it as the train picks up speed */
  function glass(dt) {
    var wet = WX.rain > 0.2 && state.tunnelBlend < 0.6, sp = state.speed;
    if (wet && drops.length < 90 * Math.min(1, WX.rain) && Math.random() < 0.6) drops.push({ x: Math.random() * cw, y: Math.random() * ch, r: (1.2 + Math.random() * 3.4) * S, run: Math.random() < 0.3, life: 1 });
    if (!wet) drops.forEach(function (d) { d.life -= 0.004 * dt; });
    for (var i = drops.length - 1; i >= 0; i--) {
      var d = drops[i]; if (d.life <= 0) { drops.splice(i, 1); continue; }
      if (d.run && sp > 0.15) { var vx = -(0.4 + d.r * 0.25) * sp * dt * 2.2, vy = (0.3 + d.r * 0.08) * dt;
        if (typeof mistCtx !== "undefined") { mistCtx.save(); mistCtx.globalCompositeOperation = "destination-out"; mistCtx.strokeStyle = "rgba(0,0,0,0.3)"; mistCtx.lineCap = "round"; mistCtx.lineWidth = d.r * 0.8; mistCtx.beginPath(); mistCtx.moveTo(d.x, d.y); mistCtx.lineTo(d.x + vx, d.y + vy); mistCtx.stroke(); mistCtx.restore(); }
        d.x += vx; d.y += vy; }
      if (d.x < -10 || d.y > ch + 10) { drops.splice(i, 1); continue; }
      var a = d.life, g = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.1, d.x, d.y, d.r);
      g.addColorStop(0, css(mix(L.low, [255, 255, 255], 0.6), 0.55 * a)); g.addColorStop(0.7, css(L.mid, 0.25 * a)); g.addColorStop(1, css([0, 0, 0], 0.35 * a));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(d.x, d.y, d.run && sp > 0.15 ? d.r * 1.3 : d.r, d.r, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255," + 0.8 * a + ")"; ctx.fillRect(d.x - d.r * 0.4, d.y - d.r * 0.5, Math.max(1, d.r * 0.35), Math.max(1, d.r * 0.35));
    }
    /* snow gathers along the bottom of the window */
    sill += ((WX.snow > 0.5 ? 1 : 0) - sill) * 0.0008 * dt;
    if (sill > 0.02) { var hgt = 16 * S * sill; ctx.fillStyle = "rgba(245,248,255," + Math.min(0.95, sill * 1.4) + ")"; ctx.beginPath(); ctx.moveTo(0, ch); for (var x = 0; x <= cw; x += 12) ctx.lineTo(x, ch - hgt * (0.6 + 0.4 * noise(x * 0.03, 99))); ctx.lineTo(cw, ch); ctx.fill(); }
  }
  /* the glass itself: depth at the edges, a little sheen */
  function vignette() {
    var g = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.45, cw / 2, ch / 2, Math.max(cw, ch) * 0.75); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.38)"); ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
    var s = ctx.createLinearGradient(0, 0, cw, ch); s.addColorStop(0, "rgba(255,255,255,0.05)"); s.addColorStop(0.35, "rgba(255,255,255,0)"); s.addColorStop(0.6, "rgba(255,255,255,0.025)"); s.addColorStop(0.7, "rgba(255,255,255,0)"); ctx.fillStyle = s; ctx.fillRect(0, 0, cw, ch);
  }

  /* ---------- changing country: a soft cross-fade instead of a jump ---------- */
  var shown = state.biome, prev = null, fade = 1;
  function rollExtras() {
    extras.aurora = Math.random() < 0.75;
    extras.petals = (state.biome === "countryside" || state.biome === "forest" || state.biome === "lake") && Math.random() < 0.45;
    extras.flies = (state.biome === "countryside" || state.biome === "forest" || state.biome === "lake") && Math.random() < 0.8;
  }
  rollExtras();

  /* ---------- the frame ---------- */
  var lastT = 0, first = true;
  window.renderScene = function (now) {
    var dt = Math.min((now - (lastFrameTime || now)) / 16.667, 3); lastFrameTime = now;
    try {
      if (state.trainState === "BRAKING") { state.speed += (0 - state.speed) * 0.022 * dt; if (Math.abs(state.stationScrollOffset) < 6 && state.speed < 0.04) { state.speed = 0; state.trainState = "STOPPED"; try { onStationArrived(); } catch (e) {} } }
      else if (state.trainState === "DEPARTING") { state.speed += (1 - state.speed) * 0.018 * dt; if (state.speed > 0.96) { state.speed = 1; state.trainState = "CRUISING"; try { updateTrainStateHUD(); } catch (e) {} } }
      else if (state.trainState === "CRUISING") state.speed += (1 - state.speed) * 0.04 * dt;
      state.tunnelBlend += ((state.inTunnel ? 1 : 0) - state.tunnelBlend) * 0.045 * dt;
      state.scrollDist += state.speed * 3.8 * dt;
      if (state.trainState === "BRAKING") state.stationScrollOffset += (0 - state.stationScrollOffset) * 0.03 * dt;
      else if (state.stationScrollOffset > -cw * 4 && state.trainState !== "STOPPED") state.stationScrollOffset -= state.speed * 9 * dt;

      S = Math.max(0.55, Math.min(1.6, ch / 450)); H = ch * 0.6; HITS.length = 0;
      if (first) { first = false; if (state.trainState === "CRUISING") state.stationScrollOffset = -cw * 6; }   /* no half-drawn platform at the start, however wide the screen */
      ease(dt); light();
      if (now - spriteT > 500) { spriteT = now; makeSprites(); }
      if (!starField.length) initStars();
      if (state.biome !== shown) { prev = shown; shown = state.biome; fade = state.tunnelBlend > 0.6 || !document.body.classList.contains("cb-on") ? 1 : 0; rollExtras(); }
      if (fade < 1) fade = Math.min(1, fade + (now - (lastT || now)) / 2200);   /* by the clock, not by frames: slow devices fade just as fast */
      lastT = now;

      if (state.tunnelBlend < 0.995) {
        sky(now, dt);
        if (prev && fade < 1 && BIOMES[prev]) BIOMES[prev](now);
        if (BIOMES[shown]) { if (fade < 1) { ctx.save(); ctx.globalAlpha = fade; } BIOMES[shown](now); if (fade < 1) ctx.restore(); }
        crossing(now); rails(); station(now); express(dt); catenary();
      }
      tunnel(now);
      weather(now, dt);
      try { renderReleasedThoughtSparks(dt); } catch (e) {}
      var wetGlass = state.weather === "rain" || state.weather === "storm" || state.weather === "snow" || state.weather === "fog";
      if (wetGlass && typeof mistCanvas !== "undefined") { if (Math.random() < 0.06 && state.tunnelBlend < 0.5) replenishMistLayer(0.002);
        /* fogged glass takes the colour of the light outside: pale by day, a soft blue-grey at night */
        ctx.save(); ctx.globalAlpha = 0.22 + 0.3 * Math.min(1, lum(L.low) / 200); ctx.drawImage(mistCanvas, 0, 0, cw, ch); ctx.restore(); }
      glass(dt);
      vignette();
    } catch (err) { if (!window.__viewErr) { window.__viewErr = err; console.error(err); } }
    requestAnimationFrame(window.renderScene);
  };

  /* ---------- getting off: tap Wei's Bar or the book corner ---------- */
  window.TrainView = { hit: function (x, y) { for (var i = HITS.length - 1; i >= 0; i--) { var h = HITS[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h.k; } return null; } };

  /* ---------- more places to go ---------- */
  try {
    [
      { name: "Gulou Hutong", jp: "鼓楼胡同", region: "Old Beijing Lanes", biome: "hutong", ink: "#9e2a2b", icon: "fa-mug-hot", code: "GL-00" },
      { name: "Kodama Hollow", jp: "木霊谷駅", region: "Old Cedar Forest", biome: "forest", ink: "#2f6b3a", icon: "fa-tree", code: "KH-21" },
      { name: "Lantern Moss Halt", jp: "灯苔停車場", region: "Fern Valley", biome: "forest", ink: "#4d7c0f", icon: "fa-leaf", code: "LM-22" },
      { name: "Kagami Causeway", jp: "鏡橋駅", region: "Twelve-Mile Lake", biome: "lake", ink: "#0e7490", icon: "fa-water", code: "KC-31" },
      { name: "Heron Point", jp: "鷺ヶ崎", region: "Reedwater", biome: "lake", ink: "#1e40af", icon: "fa-feather", code: "HP-32" },
      { name: "Yukimi Junction", jp: "雪見分岐", region: "White Steppe", biome: "snow", ink: "#475569", icon: "fa-snowflake", code: "YJ-41" },
      { name: "Aurora Siding", jp: "極光信号場", region: "Northern Plain", biome: "snow", ink: "#0f766e", icon: "fa-star", code: "AS-42" }
    ].forEach(function (s) { if (!STATION_CATALOG.some(function (x) { return x.name === s.name; })) STATION_CATALOG.push(s); });
  } catch (e) {}
})();
