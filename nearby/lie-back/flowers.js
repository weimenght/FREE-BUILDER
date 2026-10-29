/* Wildflower Meadow: lying in the flowers. A few wildflowers lean in by your face; tap one and you breathe it in:
   it nods toward you, a curl of scent drifts up, and now and then a bee comes to see what you found.
   Only in the meadow (?place=meadow, or when the visit lands there). No words, nothing to count. */
(function () {
  "use strict";
  if ((window.SORA_SCENE || "") !== "meadow") return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cv = document.createElement("canvas"); cv.id = "skyFlowers"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:7;pointer-events:none;image-rendering:pixelated";
  document.body.appendChild(cv);
  var g = (window.FBWorld && FBWorld.seasonCanvas ? FBWorld.seasonCanvas(cv.getContext("2d")) : cv.getContext("2d")), W = 0, H = 0, U = 3, t = 0;
  var KINDS = [
    { p: "#ffffff", c: "#f2c230", n: 8 },   /* daisy */
    { p: "#e0473a", c: "#2a1a14", n: 5 },   /* poppy */
    { p: "#5a7ad8", c: "#2f3f8a", n: 7 },   /* cornflower */
    { p: "#f6d640", c: "#d89a20", n: 5 },   /* buttercup */
    { p: "#e88ab0", c: "#b8507a", n: 9 }    /* clover */
  ];
  var fl = [], puffs = [], bee = null;
  function size() {
    W = innerWidth; H = innerHeight; U = Math.max(3, Math.round(Math.min(W, H) / 110));
    cv.width = Math.ceil(W / U); cv.height = Math.ceil(H / U); g.imageSmoothingEnabled = false;
    var n = Math.max(4, Math.min(8, Math.round(W / 140))); fl = [];
    for (var i = 0; i < n; i++) fl.push({ k: KINDS[(i * 3 + (Math.random() * 5 | 0)) % KINDS.length], x: (i + .5 + (Math.random() - .5) * .5) / n, h: .14 + Math.random() * .16, r: 3 + (Math.random() * 2 | 0), ph: Math.random() * 6.3, nod: 0 });
  }
  size(); addEventListener("resize", size);
  function wetSky() { try { var w = FBWorld.weather(); return w !== "clear"; } catch (e) { return false; } }   /* bees only come out in the sun */
  function night() { var h = window.FBWorld ? (FBWorld.solar ? FBWorld.solar() : FBWorld.hour()) : new Date().getHours(); h = ((h % 24) + 24) % 24; return h < 5.5 || h >= 20; }
  function R(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function head(f) { var gw = cv.width, gh = cv.height, sway = Math.sin(t / 40 + f.ph) * 1.5 + f.nod * 3; return { x: f.x * gw + sway, y: gh - f.h * gh }; }
  function draw() {
    var gw = cv.width, gh = cv.height, nt = night(); g.clearRect(0, 0, gw, gh);
    fl.forEach(function (f) {
      var hd = head(f), bx = f.x * gw;
      for (var y = gh; y > hd.y; y--) { var k = (gh - y) / (gh - hd.y); R(bx + (hd.x - bx) * k * k, y, 1, 1, nt ? "#2a4a34" : "#4a8a3a"); }   /* the stem, bending */
      R(bx + (hd.x - bx) * .4 - 2, gh - (gh - hd.y) * .45, 2, 1, nt ? "#2a4a34" : "#5a9a48");   /* a leaf */
      var r = f.r, open = nt ? .35 : 1;
      for (var i = 0; i < f.k.n; i++) { var a = i / f.k.n * 6.283 + f.ph * .2, px = hd.x + Math.cos(a) * r * open, py = hd.y + Math.sin(a) * r * open * .8; R(px - 1, py - 1, 2, 2, nt ? "rgba(200,205,230,.55)" : f.k.p); }
      R(hd.x - 1, hd.y - 1, 2, 2, f.k.c);
    });
    puffs.forEach(function (q) { R(q.x, q.y, 1, 1, "rgba(" + q.c + "," + (q.a * .8) + ")"); });
    if (bee) { var wing = (t % 4 < 2) ? 1 : 0; R(bee.x - 1, bee.y, 3, 2, "#f2c230"); R(bee.x, bee.y, 1, 2, "#2a1a14"); R(bee.x - 1, bee.y - 1 - wing, 2, 1, "rgba(255,255,255,.85)"); }
  }
  function tick() {
    t++;
    fl.forEach(function (f) { f.nod *= .95; });
    puffs.forEach(function (q) { q.x += Math.sin((t + q.s) / 9) * .25 + q.vx; q.y -= .35; q.a -= .012; }); puffs = puffs.filter(function (q) { return q.a > 0; });
    if (bee) { bee.a += .07; var tg = bee.f ? head(bee.f) : { x: bee.tx, y: bee.ty }; bee.x += (tg.x + Math.cos(bee.a) * 6 - bee.x) * .05; bee.y += (tg.y - 3 + Math.sin(bee.a * 1.3) * 4 - bee.y) * .05; if (--bee.life < 0) { bee.f = null; bee.tx = cv.width + 20; bee.ty = -10; if (bee.x > cv.width + 10 || bee.y < -5) bee = null; } }
    draw(); requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* the breath: a soft inhale and a note from the flower */
  var A = null;
  function sniffSound(i) {
    try {
      A = A || new (window.AudioContext || window.webkitAudioContext)(); if (A.state === "suspended") A.resume();
      var n = A.currentTime, len = A.sampleRate * .9, b = A.createBuffer(1, len, A.sampleRate), d = b.getChannelData(0); for (var k = 0; k < len; k++) d[k] = Math.random() * 2 - 1;
      var s = A.createBufferSource(), bp = A.createBiquadFilter(), gg = A.createGain(); s.buffer = b; bp.type = "bandpass"; bp.frequency.setValueAtTime(900, n); bp.frequency.linearRampToValueAtTime(1800, n + .8); bp.Q.value = .8;
      gg.gain.setValueAtTime(.0001, n); gg.gain.linearRampToValueAtTime(.03, n + .35); gg.gain.exponentialRampToValueAtTime(.0001, n + .9); s.connect(bp); bp.connect(gg); gg.connect(A.destination); s.start(n); s.stop(n + .95);
      var o = A.createOscillator(), og = A.createGain(), f = [523.25, 587.33, 659.25, 783.99, 880][i % 5]; o.type = "sine"; o.frequency.value = f; og.gain.setValueAtTime(.0001, n + .7); og.gain.linearRampToValueAtTime(.035, n + .75); og.gain.exponentialRampToValueAtTime(.0001, n + 2.4); o.connect(og); og.connect(A.destination); o.start(n + .7); o.stop(n + 2.5);
    } catch (e) {}
  }
  function hit(e) {
    var gx = e.clientX / U, gy = e.clientY / U, best = -1, bd = 1e9;
    fl.forEach(function (f, i) { var hd = head(f), dd = Math.hypot(gx - hd.x, gy - hd.y); if (dd < f.r + 7 && dd < bd) { bd = dd; best = i; } });
    return best;
  }
  addEventListener("pointerdown", function (e) {
    var i = hit(e); if (i < 0) return;
    e.stopImmediatePropagation(); e.preventDefault();   /* a flower, not the sky: no seeds, no breathing ring */
    var f = fl[i], hd = head(f), rgb = f.k.p === "#ffffff" ? "255,250,235" : parseInt(f.k.p.slice(1, 3), 16) + "," + parseInt(f.k.p.slice(3, 5), 16) + "," + parseInt(f.k.p.slice(5, 7), 16);
    f.nod = 1; sniffSound(i);
    for (var k = 0; k < (reduce ? 8 : 26); k++) puffs.push({ x: hd.x + (Math.random() - .5) * 4, y: hd.y - Math.random() * 3, vx: (Math.random() - .5) * .15, a: .5 + Math.random() * .5, s: Math.random() * 60, c: rgb });
    if (!bee && !night() && !wetSky() && Math.random() < .45) bee = { x: -10, y: cv.height * .5, a: 0, f: f, life: 260 };
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (x) {}
  }, true);
})();
