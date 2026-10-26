/* FBWild: a little life over a wild place, on its own see-through layer (it never touches the place's own drawing or taps).
   Birds cross the sky by day (a skein, a pair flitting, gulls wheeling, swallows skimming low); fish jump from the water and leave
   a ring. Night: birds roost, only the fish still jump now and then. Pixel size follows the place's own (o.px or the screen).
     FBWild({ birds: { kind: "skein" | "flit" | "gull" | "swallow", band: [top, bottom] (fractions of the height), rate: 1 },
              fish: { area: [x0, y0, x1, y1] (fractions) | function () { return [..] }, colour: "#e8a040", rate: 1 },
              px: 3, z: 4 }) */
(function () {
  "use strict";
  if (window.FBWild) return;
  window.FBWild = function (o) {
    o = o || {};
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.createElement("canvas"); cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;image-rendering:pixelated;z-index:" + (o.z || 4);
    document.body.appendChild(cv);
    var g = cv.getContext("2d"), P = 3, W = 0, H = 0, t = 0, flocks = [], jumps = [], rings = [];
    function size() { P = o.px || Math.max(2, Math.round(Math.min(innerWidth, innerHeight) / 150)); W = Math.ceil(innerWidth / P); H = Math.ceil(innerHeight / P); cv.width = W; cv.height = H; g.imageSmoothingEnabled = false; }
    size(); addEventListener("resize", size);
    function phase() { try { return window.FBWorld ? FBWorld.phase() : "day"; } catch (e) { return "day"; } }
    function wet() { try { var w = FBWorld.weather(); return w === "storm" || w === "rain"; } catch (e) { return false; } }
    function R(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function asleep() { return document.hidden || window.__fbAsleep; }

    function newFlock() {
      var b = o.birds, band = b.band || [.05, .3], y = rnd(band[0], band[1]) * H, dir = Math.random() < .5 ? 1 : -1, k = b.kind || "skein";
      var n = k === "skein" ? 3 + (Math.random() * 5 | 0) : k === "flit" ? 1 + (Math.random() * 2 | 0) : k === "gull" ? 1 + (Math.random() * 3 | 0) : 2 + (Math.random() * 3 | 0);
      var sp = (k === "skein" ? .35 : k === "gull" ? .25 : k === "swallow" ? .9 : .6) * dir;
      flocks.push({ k: k, x: dir > 0 ? -10 : W + 10, y: y, vx: sp, n: n, ph: Math.random() * 6, dir: dir, col: k === "gull" ? "#f4f4f0" : "#2a2a34" });
    }
    function drawBird(x, y, flap, col) { var up = flap ? 1 : 0; R(x - 2, y - up, 2, 1, col); R(x, y, 1, 1, col); R(x + 1, y - up, 2, 1, col); }
    function birds() {
      var b = o.birds; if (!b) return; var night = phase() === "night";
      if (!night && !wet() && flocks.length < 2 && Math.random() < .004 * (b.rate || 1)) newFlock();
      flocks.forEach(function (F) {
        F.x += F.vx; F.ph += .2;
        for (var i = 0; i < F.n; i++) {
          var bx, by;
          if (F.k === "skein") { bx = F.x - F.dir * i * 4; by = F.y + Math.ceil(i / 2) * 2 * (i % 2 ? 1 : -1) + Math.sin(F.ph / 4) * .5; }
          else if (F.k === "flit") { bx = F.x - F.dir * i * 7; by = F.y + Math.sin(F.ph / 2 + i * 2) * 4; }
          else if (F.k === "gull") { bx = F.x + Math.cos(F.ph / 9 + i * 2.1) * 10; by = F.y + Math.sin(F.ph / 9 + i * 2.1) * 4; }
          else { bx = F.x - F.dir * i * 9 + Math.sin(F.ph / 3 + i) * 3; by = F.y + Math.sin(F.ph / 2 + i * 1.7) * 6; }
          drawBird(bx, by, ((t + i * 3) % 6) < 3, F.col);
        }
      });
      flocks = flocks.filter(function (F) { return F.x > -60 && F.x < W + 60; });
    }
    function fish() {
      var f = o.fish; if (!f) return; var a = typeof f.area === "function" ? f.area() : f.area; if (!a) return;
      var night = phase() === "night";
      if (jumps.length < 2 && Math.random() < (night ? .0015 : .004) * (f.rate || 1)) {
        var x = rnd(a[0], a[2]) * W, y = rnd(a[1], a[3]) * H, dir = Math.random() < .5 ? 1 : -1;
        jumps.push({ x: x, y: y, dir: dir, k: 0, len: 9 + (Math.random() * 6 | 0) });
        rings.push({ x: x, y: y, r: 1, a: .7 });
      }
      jumps.forEach(function (j) {
        j.k++; var u = j.k / j.len, fx = j.x + j.dir * u * 8, fy = j.y - Math.sin(u * Math.PI) * 6;
        R(fx - 1, fy, 3, 1, f.colour || "#c8d4dc"); R(fx + (j.dir > 0 ? 2 : -2), fy - 1, 1, 1, f.colour || "#c8d4dc");
        if (j.k === j.len) rings.push({ x: j.x + j.dir * 8, y: j.y, r: 1, a: .8 });
      });
      jumps = jumps.filter(function (j) { return j.k < j.len; });
      rings.forEach(function (r) { r.r += .25; r.a -= .025; g.strokeStyle = "rgba(255,255,255," + Math.max(0, r.a) + ")"; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(r.x) + .5, Math.round(r.y) + .5, r.r * 2, r.r * .8, 0, 0, 6.283); g.stroke(); });
      rings = rings.filter(function (r) { return r.a > 0; });
    }
    var last = 0;
    (function loop(ts) {
      requestAnimationFrame(loop);
      if (reduce || asleep() || ts - last < 60) return; last = ts; t++;
      g.clearRect(0, 0, W, H); birds(); fish();
    })(0);
    return { canvas: cv };
  };
})();
