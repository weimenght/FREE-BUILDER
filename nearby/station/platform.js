/* Nearby Station, the app: the platform you step off onto (journey.js asks FBPlat for the scene; in town none of this runs).
   Every stop is built its own way and looks out at its own view:
     a Japanese platform (yellow tactile strip, the white name board, vending machines), an iron-and-glass shed (Paris, Hamburg,
     Madrid, Firenze, Grand Central…), a British canopy with its wooden valance, a modern Chinese hall, a chalet halt in the
     mountains, a country halt, the seaside, adobe in the desert, a hutong's red pillars, a Jiangnan water town;
   and beyond the track the place itself: Paris's roofs and the tower, the Matterhorn, St Michael's Mount, Guilin's karst,
   Dunhuang's dunes, Kamakura's sea… The sky is the one the train arrived under (cabin.js gives each stop its own weather and,
   for real cities, their own hour); the season is the visitor's month. The people dress for the place, the season and the
   sky, and come and go with the trains. Pixels at the canvas's own size; nothing fetched. */
(function () {
  "use strict";
  if (!/[?&]app=1/.test(location.search)) return;
  var OFF = 140, LH = 262;   /* the view's layers are drawn once, from y = -140 to 122 */

  /* ---------- colour ---------- */
  function hx(c) { if (c[0] === "#") { if (c.length === 4) c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; var n = parseInt(c.slice(1, 7), 16); return [n >> 16, n >> 8 & 255, n & 255]; } var m = c.match(/[\d.]+/g); return [+m[0], +m[1], +m[2]]; }
  var MC = {};
  function mix(a, b, t) { var k = a + b + t, r = MC[k]; if (r) return r; var A = hx(a), B = hx(b); r = "#"; for (var i = 0; i < 3; i++) { var v = Math.max(0, Math.min(255, Math.round(A[i] + (B[i] - A[i]) * t))); r += (v < 16 ? "0" : "") + v.toString(16); } return (MC[k] = r); }
  function dk(c, t) { return mix(c, "#000000", t == null ? 0.22 : t); }
  function lt(c, t) { return mix(c, "#ffffff", t == null ? 0.22 : t); }
  function seed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; }
  function pk(r, a) { return a[(r() * a.length) | 0]; }

  /* ---------- the stop: its style, its view, its sky ---------- */
  var VIEW = {
    "Paris Gare de Lyon": "paris", "Arles": "provence", "Annecy": "annecy", "Saint-Malo": "malo", "Hamburg Hbf": "hamburg", "Heidelberg": "heidelberg",
    "Garmisch-Partenkirchen": "bavaria", "Titisee": "blackforest", "Madrid Atocha": "madrid", "Almería": "tabernas", "Ronda": "ronda", "Sitges": "sitges",
    "Girona": "girona", "Grand Central": "manhattan", "Flagstaff": "flagstaff", "Glacier Park": "rockies", "Santa Barbara": "mission",
    "Edinburgh Waverley": "edinburgh", "Penzance": "mount", "Windermere": "windermere", "Aviemore": "cairngorms", "北京南": "beijing", "桂林": "karst",
    "苏州": "suzhou", "厦门": "xiamen", "哈尔滨": "harbin", "敦煌": "dunes", "京都": "kyoto", "箱根湯本": "hakone", "鎌倉": "kamakura", "美瑛": "biei",
    "Firenze S.M.N.": "firenze", "Vernazza": "vernazza", "Zermatt": "matterhorn", "Grindelwald": "eiger", "香港西九龍": "hongkong", "大埔墟": "taipo",
    "Aberystwyth": "aber", "Betws-y-Coed": "eryri", "Gulou Hutong": "gulou", "Saffron Valley": "windmills", "Hotaru-no-Sato": "paddies",
    "Cape Lantern": "lighthouse", "Aurora Siding": "aurora", "Fernwood Trestle": "trestle", "Mirage Water Tower": "mesas", "Shin-Minato Platform 3": "harbour"
  };
  function styleOf(st) {
    var L = st.look || "", b = st.biome;
    if (b === "hutong") return "hutong";
    if (st.name === "苏州") return "jiangnan";
    if (L === "jp" || (!L && b === "metropolis")) return "jp";
    if (L === "uk") return "uk";
    if (b === "metropolis") return L === "cn" ? "modern" : "shed";
    if (st.name === "哈尔滨") return "shed";
    if (b === "alpine" || b === "snow") return "chalet";
    if (b === "coastal") return "seaside";
    if (b === "desert") return "adobe";
    return "halt";
  }
  function envOf(st, o) {
    var d = new Date(), m = d.getMonth(), b = st.biome, L = st.look || "";
    var season = m === 11 || m < 2 ? "winter" : m < 5 ? "spring" : m < 8 ? "summer" : "autumn";
    var warm = /es|ca|it/.test(L) || st.tongue === "hk" || st.name === "Santa Barbara" || st.name === "厦门";
    var tod = o.tod || "afternoon", wx = o.wx || "clear";
    var E = { st: st, b: b, L: L, season: season, warm: warm, tod: tod, wx: wx, night: tod === "night", dusk: tod === "sunset", dawn: tod === "dawn", day: tod === "afternoon" };
    E.wet = wx === "rain" || wx === "storm"; E.fog = wx === "fog"; E.snowing = wx === "snow"; E.grey = E.wet || E.fog || E.snowing;
    E.snowy = E.snowing || (!warm && season === "winter" && (b === "snow" || b === "alpine")) || (b === "snow" && season !== "summer" && !warm);
    E.cold = E.snowy || (season === "winter" && !warm) || ((b === "alpine" || b === "snow") && season !== "summer") || (E.night && b === "desert" && season !== "summer");
    E.hot = !E.cold && !E.wet && ((season === "summer" && b !== "alpine") || (warm && season !== "winter") || (b === "desert" && !E.night && season === "spring"));
    var SK = { dawn: ["#4f5a98", "#d99a96", "#fbd9b4"], afternoon: ["#4a8ed8", "#8dbfec", "#d2e8f6"], sunset: ["#2c2963", "#b45678", "#f3a25a"], night: ["#050918", "#0f1834", "#202c52"] }[tod] || ["#4a8ed8", "#8dbfec", "#d2e8f6"];
    if (E.grey) SK = SK.map(function (c, i) { return mix(c, E.night ? "#1c2029" : E.snowing ? "#c6cbd3" : E.fog ? "#bcc1c7" : "#7d8590", E.night ? 0.45 : 0.6 + i * 0.06); });
    E.sky = SK; E.haze = SK[2];
    var cache = {};
    E.tone = function (c, dd) {
      if (dd < 0) return c; var k = c + dd, r = cache[k]; if (r) return r; r = c;
      r = mix(r, E.haze, Math.min(0.92, dd * (E.fog ? 1.05 : E.grey ? 0.72 : 0.5)));
      if (E.night) r = mix(r, "#0a1124", 0.62 - dd * 0.14); else if (E.dusk) r = mix(r, "#4c2a4c", 0.2 - dd * 0.05); else if (E.dawn) r = mix(r, "#e8a088", 0.1);
      if (E.grey && !E.night) r = mix(r, "#80878f", 0.18);
      return (cache[k] = r);
    };
    E.lit = E.night || E.dusk || wx === "storm" || (E.grey && !E.day);
    return E;
  }

  /* ---------- drawing on a layer or the deck: g.r rect, g.L rect that glows (not darkened), g.p polygon, g.e ellipse ---------- */
  function api(cx, E, d, off) {
    var g = {
      cx: cx, d: d,
      c: function (c) { return E.tone(c, d); },
      r: function (c, x, y, w, h) { cx.fillStyle = E.tone(c, d); cx.fillRect(Math.round(x), Math.round(y + off), Math.round(w), Math.round(h)); },
      L: function (c, x, y, w, h) { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y + off), Math.round(w), Math.round(h)); },
      p: function (c, pts) { cx.fillStyle = E.tone(c, d); cx.beginPath(); for (var i = 0; i < pts.length; i += 2) cx[i ? "lineTo" : "moveTo"](pts[i], pts[i + 1] + off); cx.closePath(); cx.fill(); },
      e: function (c, x, y, rx, ry, a0, a1) { cx.fillStyle = E.tone(c, d); cx.beginPath(); cx.ellipse(x, y + off, Math.max(0.5, rx), Math.max(0.5, ry), 0, a0 || 0, a1 == null ? Math.PI * 2 : a1); cx.fill(); },
      t: function (c, s, x, y, font, al) { cx.fillStyle = c; cx.font = font; cx.textAlign = al || "center"; cx.fillText(s, x, y + off); cx.textAlign = "left"; }
    };
    return g;
  }

  /* ---------- the view's pieces ---------- */
  function range(g, col, base, lo, hi, step, r, snowH, w) {
    var pts = [-10, base], x = -10, pk2 = [];
    while (x <= w + step) { var h = lo + r() * (hi - lo); pts.push(x, base - h); pk2.push([x, base - h, h]); x += step * (0.55 + r() * 0.8); var vy = base - h * (0.4 + r() * 0.3); pts.push(x, vy); pk2[pk2.length - 1].push(x, vy); x += step * (0.35 + r() * 0.5); }
    pts.push(x, base); g.p(col, pts);
    pk2.forEach(function (k) { if (k[3] != null) g.p(dk(col, 0.14), [k[0], k[1], k[3], k[4], k[3] + (k[3] - k[0]) * 0.4, base, k[0] + 2, base]); });
    if (snowH != null) pk2.forEach(function (k) { if (k[2] > snowH) { var s = Math.min(k[2] - snowH + 3, k[2] * 0.45); g.p("#f2f5f9", [k[0] - s * 0.8, k[1] + s, k[0], k[1], k[0] + s * 0.75, k[1] + s * 0.95, k[0] + s * 0.3, k[1] + s * 0.7, k[0] - s * 0.15, k[1] + s * 1.15]); } });
  }
  function rolling(g, col, base, amp, r, w, wl) {
    var a = r() * 6, b = r() * 6, pts = [-4, base + 3]; wl = wl || 120;
    for (var x = -4; x <= w + 4; x += 3) pts.push(x, base - amp * (0.55 + 0.3 * Math.sin(x / wl + a) + 0.15 * Math.sin(x / (wl * 0.37) + b)));
    pts.push(w + 4, base + 3); g.p(col, pts);
  }
  function water(g, col, y0, y1, w, r) {
    g.r(col, 0, y0, w, y1 - y0); g.r(lt(col, 0.2), 0, y0, w, 1);
    for (var i = 0; i < w / 7; i++) g.r(lt(col, 0.16 + r() * 0.12), r() * w, y0 + 2 + r() * (y1 - y0 - 3), 2 + r() * 7, 1);
  }
  var LEAF = {
    spring: { round: "#79ad4c", plane: "#82b250", maple: "#8ab84e", sakura: "#f3b6c6", birch: "#a2c75c", willow: "#a9c95a", larch: "#9cc25a", olive: "#7d8f5a", banyan: "#3f7a3a", oak: "#77a84a" },
    summer: { round: "#3f7a3a", plane: "#457f3a", maple: "#3f7a3a", sakura: "#3f7a3a", birch: "#5d9a40", willow: "#6f9f45", larch: "#4f8a3f", olive: "#6f7f4f", banyan: "#2f6a32", oak: "#3a6e34" },
    autumn: { round: "#c98a2a", plane: "#c8963a", maple: "#c8402a", sakura: "#c0603a", birch: "#e0b83a", willow: "#c8b04a", larch: "#d8a030", olive: "#6f7f4f", banyan: "#2f6a32", oak: "#a8642a" }
  };
  function tree(g, k, x, b, h, r, E) {
    var s = E.season, sn = E.snowy, i;
    if (k === "pine" || k === "fir" || k === "cedar") {
      var w0 = h * (k === "cedar" ? 0.62 : 0.5), c1 = k === "cedar" ? "#2e5536" : "#24503a", c2 = k === "cedar" ? "#38623e" : "#2c5a3a";
      g.r("#4a3424", x - 1, b - h * 0.22, 2, h * 0.22);
      for (i = 0; i < 3; i++) { var yy = b - h * 0.18 - i * h * 0.25, ww = w0 * (1 - i * 0.24); g.p(i % 2 ? c2 : c1, [x - ww / 2, yy, x, yy - h * 0.44, x + ww / 2, yy]); g.p(dk(c1, 0.18), [x, yy - h * 0.44, x + ww / 2, yy, x + 1, yy]);
        if (sn) g.p("#eef3f7", [x - ww * 0.24, yy - h * 0.29, x, yy - h * 0.44, x + ww * 0.24, yy - h * 0.29]); }
      return;
    }
    if (k === "scots") { g.r("#8a4a2a", x - 1, b - h * 0.7, 2, h * 0.7); g.e("#2f553a", x, b - h * 0.78, h * 0.28, h * 0.16); g.e("#3a6544", x - h * 0.1, b - h * 0.82, h * 0.16, h * 0.1); if (sn) g.e("#eef3f7", x, b - h * 0.9, h * 0.2, h * 0.05); return; }
    if (k === "cypress") { g.e("#2a4c32", x, b - h * 0.5, Math.max(1.5, h * 0.12), h * 0.5); g.e("#3a6640", x - h * 0.03, b - h * 0.56, Math.max(1, h * 0.05), h * 0.38); return; }
    if (k === "palm") {
      var tx = x + h * 0.14, ty = b - h; g.p("#7a5a3a", [x - 1, b, x + 1.4, b, tx + 1, ty, tx - 1, ty]);
      [[-1, 0.25], [-0.65, -0.35], [0, -0.5], [0.65, -0.35], [1, 0.25], [0.35, 0.55], [-0.35, 0.55]].forEach(function (f) { g.p(f[1] > 0.3 ? "#2c6430" : "#3d7d38", [tx, ty, tx + f[0] * h * 0.42, ty + f[1] * h * 0.3 + h * 0.1, tx + f[0] * h * 0.3, ty + f[1] * h * 0.3 + h * 0.2]); });
      return;
    }
    if (k === "bamboo") { for (i = -2; i <= 2; i++) { g.r(i % 2 ? "#5f8a3a" : "#6f9a42", x + i * 2, b - h + Math.abs(i) * 2, 1, h - Math.abs(i) * 2); g.e("#4f8034", x + i * 2 + 2, b - h + Math.abs(i) * 2 + 2, 3, 1.5); } return; }
    if (k === "saguaro") { var c = "#4f7a3e"; g.r(c, x - 2, b - h, 4, h); g.r(c, x - 6, b - h * 0.6, 2, h * 0.3); g.r(c, x - 6, b - h * 0.32, 5, 2); g.r(c, x + 4, b - h * 0.75, 2, h * 0.3); g.r(c, x + 2, b - h * 0.47, 4, 2); g.r(lt(c, 0.2), x - 1, b - h, 1, h); return; }
    if (k === "joshua" || k === "scrub") { g.e(k === "scrub" ? "#8a8a5a" : "#6a7a4a", x, b - h * 0.3, h * 0.5, h * 0.3); return; }
    /* broadleaf: round, plane, maple, sakura, birch, willow, larch, olive, banyan, oak */
    var bare = s === "winter" && !/olive|banyan/.test(k) && !(E.warm && k !== "sakura");
    var trunk = k === "birch" ? "#e6e2d8" : "#5a4030";
    g.r(trunk, x - 1, b - h * 0.5, k === "oak" || k === "banyan" || k === "plane" ? 3 : 2, h * 0.5);
    if (k === "birch") for (i = 0; i < 4; i++) g.r("#3a3a36", x - 1, b - h * 0.45 + i * h * 0.1, 1, 1);
    if (bare) {
      var bc = k === "birch" ? "#cfcac0" : "#6a5040";
      for (i = 0; i < 5; i++) { var a = -1.2 + i * 0.6, L = h * (0.25 + (i % 2) * 0.12); g.p(bc, [x, b - h * 0.45, x + Math.sin(a) * L, b - h * 0.45 - Math.cos(a) * L, x + Math.sin(a) * L + 1, b - h * 0.45 - Math.cos(a) * L, x + 1, b - h * 0.45]); }
      if (sn) g.e("#eef3f7", x, b - h * 0.72, h * 0.22, h * 0.05);
      return;
    }
    var leaf = (LEAF[s] || LEAF.summer)[k] || LEAF.summer.round;
    if (s === "autumn" && (k === "round" || k === "oak")) leaf = pk(r, ["#c98a2a", "#b8562a", "#d8a83a", "#a8642a"]);
    if (k === "willow") { g.e(leaf, x, b - h * 0.62, h * 0.32, h * 0.26); for (i = -3; i <= 3; i++) g.r(dk(leaf, 0.1), x + i * h * 0.09, b - h * 0.62, 1, h * (0.38 + (i % 2) * 0.1)); return; }
    if (k === "larch") { g.p(leaf, [x - h * 0.22, b - h * 0.32, x, b - h * 1.05, x + h * 0.22, b - h * 0.32]); g.p(dk(leaf, 0.16), [x, b - h * 1.05, x + h * 0.22, b - h * 0.32, x + 1, b - h * 0.32]); return; }
    if (k === "birch") { g.e(leaf, x, b - h * 0.7, h * 0.18, h * 0.3); g.e(lt(leaf, 0.15), x - 1, b - h * 0.78, h * 0.1, h * 0.14); return; }
    var rw = h * (k === "olive" || k === "banyan" ? 0.5 : k === "sakura" || k === "plane" ? 0.42 : 0.36), cy = b - h * (k === "olive" ? 0.55 : 0.68);
    g.e(dk(leaf, 0.12), x + rw * 0.25, cy + rw * 0.15, rw * 0.8, rw * 0.62);
    g.e(leaf, x - rw * 0.2, cy, rw * 0.78, rw * 0.66);
    g.e(lt(leaf, 0.14), x - rw * 0.35, cy - rw * 0.25, rw * 0.38, rw * 0.3);
    if (k === "sakura" && s === "spring") for (i = 0; i < 6; i++) g.r("#fde4ea", x - rw + r() * rw * 2, cy - rw * 0.5 + r() * rw, 1, 1);
    if (sn) g.e("#eef3f7", x - rw * 0.2, cy - rw * 0.55, rw * 0.6, rw * 0.15);
  }
  function wood(g, kind, base, r, E, w, gap, hlo, hhi, mix2) { for (var x = r() * gap; x < w + gap; x += gap * (0.6 + r() * 0.8)) tree(g, mix2 && r() < 0.35 ? mix2 : kind, x, base + r() * 2, hlo + r() * (hhi - hlo), r, E); }

  /* windows that light up in the evening (lit ones aren't darkened by the night) */
  var LITC = ["#ffd98a", "#ffe6a6", "#f6c56c", "#ffdf9a"];
  function wins(g, E, r, x, y, w, h, gx, gy, ww, wh, dayC, p) {
    for (var yy = y; yy + wh <= y + h + 0.01; yy += gy) for (var xx = x; xx + ww <= x + w + 0.01; xx += gx) {
      var q = r(), on = E.night ? q < (p || 0.5) : E.dusk || (E.grey && !E.day) ? q < (p || 0.5) * 0.55 : E.grey ? q < 0.12 : false;
      if (on) g.L(pk(r, LITC), xx, yy, ww, wh); else g.r(dayC, xx, yy, ww, wh);
    }
  }
  function roofSnow(g, E, x, y, w) { if (E.snowy) g.r("#f2f5f8", x, y - 1, w, 2); }
  function house(g, kind, x, b, w, h, r, E) {
    var c, rc, i;
    switch (kind) {
      case "haus": c = pk(r, ["#e4d8bf", "#ddd0b4", "#e8dfca", "#d8c9aa"]); g.r(c, x, b - h, w, h); g.r(dk(c, 0.1), x, b - h * 0.18, w, 1);
        g.p("#5c6470", [x - 1, b - h, x + 2, b - h - 7, x + w - 2, b - h - 7, x + w + 1, b - h]); for (i = x + 3; i < x + w - 3; i += 6) { g.r("#6a7280", i, b - h - 6, 3, 4); g.L(E.lit && r() < 0.4 ? pk(r, LITC) : E.tone("#3a4050", d0(g)), i + 1, b - h - 5, 1, 2); }
        g.r("#b5653f", x + 2, b - h - 10, 2, 3); g.r("#b5653f", x + w - 5, b - h - 10, 2, 3);
        wins(g, E, r, x + 2, b - h + 3, w - 4, h - 6, 5, 6, 2, 4, "#4a5260", 0.45); g.r("#2a2e36", x, b - h + 8, w, 1); roofSnow(g, E, x + 1, b - h - 7, w - 2); break;
      case "brick": c = pk(r, ["#9a4a32", "#8a3e2c", "#a65a3a"]); g.r(c, x, b - h, w, h);
        if (r() < 0.5) { for (i = 0; i < 4; i++) g.r(c, x + i * w / 8, b - h - i * 3, w - i * w / 4, 3); } else g.p("#5f9a84", [x - 1, b - h, x + w / 2, b - h - 8, x + w + 1, b - h]);
        wins(g, E, r, x + 2, b - h + 3, w - 4, h - 5, 5, 6, 3, 3, "#e8dcc6", 0.5); break;
      case "tene": c = pk(r, ["#5b5650", "#6a645c", "#4e4a46"]); g.r(c, x, b - h, w, h); g.r("#3e434a", x, b - h - 3, w, 3); for (i = x + 2; i < x + w - 2; i += 5) g.r("#7a6a5a", i, b - h - 6, 2, 3);
        wins(g, E, r, x + 2, b - h + 3, w - 4, h - 5, 4, 5, 2, 3, "#2e3036", 0.5); roofSnow(g, E, x, b - h - 3, w); break;
      case "tower": c = pk(r, ["#5d7790", "#7a92a8", "#4d6478", "#8aa0b2", "#6a7f90"]); g.r(c, x, b - h, w, h); g.r(lt(c, 0.12), x, b - h, 2, h); g.r(dk(c, 0.15), x + w - 2, b - h, 2, h);
        wins(g, E, r, x + 2, b - h + 2, w - 4, h - 3, 3, 3, 2, 1, lt(c, 0.25), 0.4); if (r() < 0.4) { g.r("#9aa4ae", x + w / 2, b - h - 6, 1, 6); if (E.lit) g.L("#ff4a3a", x + w / 2, b - h - 7, 1, 1); } break;
      case "white": c = pk(r, ["#f0eadc", "#ece4d2", "#f4efe4"]); g.r(c, x, b - h, w, h); g.p("#b9603a", [x - 1, b - h, x + w / 2, b - h - 4, x + w + 1, b - h]); wins(g, E, r, x + 2, b - h + 3, w - 4, h - 5, 5, 5, 2, 3, "#3a5a4a", 0.4); break;
      case "pastel": c = pk(r, ["#e8a86a", "#d8604a", "#f0d27a", "#e88a8a", "#9ab8c8", "#c8d89a", "#e8c0a0", "#f2b880"]); g.r(c, x, b - h, w, h); g.r(dk(c, 0.12), x + w - 1, b - h, 1, h);
        g.p("#a8503a", [x - 1, b - h, x + w / 2, b - h - 3, x + w + 1, b - h]); wins(g, E, r, x + 2, b - h + 3, w - 4, h - 5, 4, 5, 2, 3, "#2f5a3a", 0.45); break;
      case "chalet": g.r("#e6e0d2", x, b - h * 0.35, w, h * 0.35); g.r("#6a4428", x, b - h, w, h * 0.65); g.r("#7a5232", x, b - h, w, 1);
        for (i = x + 2; i < x + w - 1; i += 3) g.r("#5a3820", i, b - h * 0.7, 1, h * 0.35); g.r("#5a3820", x - 1, b - h * 0.62, w + 2, 1);
        if (!E.snowy && E.season !== "winter") for (i = x + 1; i < x + w - 1; i += 2) g.r(i % 4 ? "#d8303a" : "#e8505a", i, b - h * 0.66, 1, 1);
        g.p(E.snowy ? "#f2f5f8" : "#4a3828", [x - 4, b - h, x + w / 2, b - h - w * 0.42, x + w + 4, b - h]); wins(g, E, r, x + 2, b - h + 3, w - 4, h * 0.3, 5, 5, 2, 2, "#2a2018", 0.6); break;
      case "jp": c = pk(r, ["#c8c0b0", "#b8ae9c", "#5a4a3a", "#d6cfc0"]); g.r(c, x, b - h, w, h);
        g.p("#4a5058", [x - 3, b - h + 1, x + 1, b - h - 4, x + w - 1, b - h - 4, x + w + 3, b - h + 1]); roofSnow(g, E, x - 1, b - h - 4, w + 2); wins(g, E, r, x + 2, b - h + 3, w - 4, h - 5, 5, 5, 3, 2, "#dcd6c8", 0.55); break;
      case "jn": g.r("#ece9e2", x, b - h, w, h); g.r("#33363a", x - 2, b - h - 2, w + 4, 2); g.p("#33363a", [x - 3, b - h - 1, x + w / 2, b - h - 5, x + w + 3, b - h - 1]);
        g.r("#ece9e2", x - 1, b - h - 6, 3, 6); g.r("#33363a", x - 2, b - h - 7, 5, 1); g.r("#ece9e2", x + w - 2, b - h - 6, 3, 6); g.r("#33363a", x + w - 3, b - h - 7, 5, 1);
        wins(g, E, r, x + 3, b - h + 3, w - 6, h - 6, 6, 6, 3, 2, "#3a3a3a", 0.5); break;
      case "terra": c = pk(r, ["#e4c79a", "#d9b07a", "#ecd8b0", "#e0b888"]); g.r(c, x, b - h, w, h); g.p("#b5563a", [x - 1, b - h, x + w / 2, b - h - 3, x + w + 1, b - h]); g.r(dk("#b5563a", 0.15), x - 1, b - h, w + 2, 1); wins(g, E, r, x + 2, b - h + 3, w - 4, h - 5, 4, 5, 2, 3, "#5a4a3a", 0.4); break;
      case "brown": c = pk(r, ["#7a4a3a", "#8a5440", "#6a4034", "#9a5a42"]); g.r(c, x, b - h, w, h); g.r(dk(c, 0.2), x, b - h, w, 2);
        if (r() < 0.5) { var tx = x + 2 + r() * (w - 6); g.r("#4a3424", tx, b - h - 3, 1, 3); g.r("#4a3424", tx + 3, b - h - 3, 1, 3); g.r("#7a5a3a", tx - 1, b - h - 8, 6, 5); g.p("#5a4030", [tx - 1, b - h - 8, tx + 2, b - h - 10, tx + 5, b - h - 8]); }
        wins(g, E, r, x + 2, b - h + 3, w - 4, h - 4, 4, 4, 2, 2, "#2a2a30", 0.5); break;
      case "adobe": c = pk(r, ["#c98a5a", "#d49a6a", "#b87a4a"]); g.r(c, x, b - h, w, h); g.r(lt(c, 0.12), x, b - h, w, 1); for (i = x + 2; i < x + w - 1; i += 4) g.r("#5a3a22", i, b - h + 2, 1, 1); wins(g, E, r, x + 3, b - h + 4, w - 6, h - 6, 7, 6, 2, 3, "#3a2618", 0.4); break;
      case "nt": c = pk(r, ["#e8e4d8", "#d8dcd6", "#efe2c8", "#cfe0e0"]); g.r(c, x, b - h, w, h); g.r("#8a8a84", x, b - h - 2, w, 1); g.r("#8a8a84", x, b - h - 2, 1, 2); g.r("#8a8a84", x + w - 1, b - h - 2, 1, 2); wins(g, E, r, x + 2, b - h + 2, w - 4, h - 4, 4, 5, 3, 2, "#5a6a70", 0.5); break;
      case "stone": c = pk(r, ["#8a8a84", "#9a948a", "#7a7a76", "#a49a8a"]); g.r(c, x, b - h, w, h); g.p("#4a5058", [x - 1, b - h, x + w / 2, b - h - 5, x + w + 1, b - h]); g.r("#6a6560", x + w - 4, b - h - 6, 2, 4); roofSnow(g, E, x, b - h - 2, w); wins(g, E, r, x + 2, b - h + 2, w - 4, h - 4, 5, 5, 2, 2, "#2a2e34", 0.45); break;
      case "hut": g.r("#8a8a88", x, b - h, w, h); g.r("#5a5c60", x - 2, b - h - 3, w + 4, 3); g.r("#5a5c60", x - 3, b - h - 1, 2, 1); g.r("#5a5c60", x + w + 1, b - h - 1, 2, 1); roofSnow(g, E, x - 2, b - h - 3, w + 4); if (r() < 0.5) g.r("#a83a2a", x + w / 2 - 1, b - 4, 3, 4); break;
      case "neon": c = pk(r, ["#2a2a3a", "#3a3448", "#24283a", "#34303e"]); g.r(c, x, b - h, w, h); wins(g, E, r, x + 2, b - h + 2, w - 4, h - 4, 3, 3, 1, 1, "#4a4a5a", 0.5);
        if (r() < 0.55) { var nc = pk(r, ["#ff4a8a", "#4ae0ff", "#ffd24a", "#8a6aff", "#4aff9a"]), ny = b - h + 3 + r() * (h - 10); if (E.lit) g.L(nc, x + 1, ny, 2, 6); else g.r(dk(nc, 0.35), x + 1, ny, 2, 6); } break;
      default: g.r("#999", x, b - h, w, h);
    }
  }
  function d0(g) { return g.d; }
  function town(g, kind, x0, x1, b, r, E, hlo, hhi, wlo, whi, kinds) { for (var x = x0; x < x1;) { var w = wlo + r() * (whi - wlo); house(g, kinds ? pk(r, kinds) : kind, x, b, w, hlo + r() * (hhi - hlo), r, E); x += w + (r() < 0.3 ? 1 + r() * 3 : 0); } }

  /* landmarks */
  var LM = {
    eiffel: function (g, x, b, h) { var c = "#5a4a3c"; g.p(c, [x - h * 0.28, b, x - h * 0.06, b - h * 0.5, x - h * 0.02, b - h, x + h * 0.02, b - h, x + h * 0.06, b - h * 0.5, x + h * 0.28, b]); g.p(E0(g, "#c9b9a0"), [x - h * 0.17, b, x, b - h * 0.2, x + h * 0.17, b]); g.r(c, x - h * 0.13, b - h * 0.36, h * 0.26, 2); g.r(c, x - h * 0.06, b - h * 0.62, h * 0.12, 1); g.r(c, x, b - h - 4, 1, 4); },
    domeF: function (g, x, b, s) { var c = "#c8603a"; g.r("#e2d4b8", x - 9 * s, b - 12 * s, 18 * s, 12 * s); g.r("#4a6a4a", x - 9 * s, b - 10 * s, 18 * s, 1); g.e("#e2d4b8", x, b - 12 * s, 7 * s, 3 * s); g.e(c, x, b - 15 * s, 6 * s, 8 * s, Math.PI, 0); for (var i = -2; i <= 2; i++) g.r("#f0e8d8", x + i * 2.4 * s, b - 22 * s, 1, 7 * s); g.r("#f0e8d8", x - 1.5 * s, b - 25 * s, 3 * s, 3 * s); g.r("#d8c8a0", x - 0.5, b - 28 * s, 1, 3 * s); },
    campanile: function (g, x, b, h, c, top) { g.r(c, x - 2, b - h, 5, h); g.r(dk(c, 0.15), x + 2, b - h, 1, h); g.r("#3a3632", x - 1, b - h + 3, 3, 3); if (top === "spire") g.p(dk(c, 0.2), [x - 3, b - h, x + 0.5, b - h - 10, x + 4, b - h]); else if (top === "cap") g.p("#b5563a", [x - 3, b - h, x + 0.5, b - h - 3, x + 4, b - h]); else { g.r(c, x - 3, b - h - 2, 7, 2); } },
    onion: function (g, x, b, h, c, dome) { g.r(c, x - 3, b - h, 7, h); g.e(dome, x + 0.5, b - h - 4, 4.5, 4.5); g.p(dome, [x - 2, b - h - 6, x + 0.5, b - h - 12, x + 3, b - h - 6]); g.r("#d8b84a", x, b - h - 15, 1, 3); wins(g, ENV, Math.random, x - 1, b - h + 4, 3, h - 6, 2, 5, 1, 2, "#3a3a3a", 0.5); },
    pagoda: function (g, x, b, n, s, c, rf) { for (var i = 0; i < n; i++) { var w = (14 - i * 1.6) * s, y = b - i * 6 * s; g.r(c, x - w * 0.32, y - 5 * s, w * 0.64, 5 * s); g.p(rf, [x - w / 2 - 2, y - 4 * s, x - w * 0.3, y - 6.5 * s, x + w * 0.3, y - 6.5 * s, x + w / 2 + 2, y - 4 * s]); } g.r(rf, x - 0.5, b - n * 6 * s - 8 * s, 1, 8 * s); },
    castleRock: function (g, x, b) { g.p("#4a4a44", [x - 50, b, x - 34, b - 18, x - 20, b - 26, x + 12, b - 30, x + 30, b - 22, x + 52, b]); g.p("#5a5a52", [x - 34, b - 18, x - 20, b - 26, x - 10, b - 12]); g.r("#6a645a", x - 18, b - 40, 34, 12); for (var i = 0; i < 7; i++) g.r("#6a645a", x - 18 + i * 5, b - 42, 3, 2); g.r("#6a645a", x - 6, b - 48, 8, 8); g.r("#6a645a", x + 8, b - 46, 6, 6); wins(g, ENV, Math.random, x - 16, b - 37, 30, 6, 4, 4, 2, 2, "#2a2a2a", 0.5); },
    ruin: function (g, x, b) { var c = "#a8604a"; g.r(c, x - 18, b - 14, 36, 14); g.r(c, x - 14, b - 24, 9, 10); g.r(c, x + 4, b - 22, 12, 8); for (var i = 0; i < 5; i++) g.r("#2e2620", x - 15 + i * 7, b - 11, 2, 4); g.r("#2e2620", x - 12, b - 21, 2, 3); },
    island: function (g, x, b, w, h, castle) { g.p("#5a6a4a", [x - w / 2, b, x - w * 0.2, b - h * 0.7, x, b - h, x + w * 0.25, b - h * 0.65, x + w / 2, b]); g.p("#7a7a6a", [x - w / 2, b, x - w * 0.3, b - h * 0.3, x + w * 0.4, b - h * 0.25, x + w / 2, b]); if (castle) { g.r("#8a8478", x - 6, b - h - 7, 12, 8); g.r("#8a8478", x - 2, b - h - 13, 4, 6); g.r("#8a8478", x - 8, b - h - 9, 3, 2); } },
    lighthouse: function (g, x, b, h) { g.r("#eee8dc", x - 2, b - h, 5, h); for (var i = 0; i < 3; i++) g.r("#c8302a", x - 2, b - h + 4 + i * h / 3.2, 5, 2); g.r("#3a3a3a", x - 3, b - h - 1, 7, 1); g.L(ENV.lit ? "#fff2a8" : ENV.tone("#d8d4c4", g.d), x - 1, b - h - 4, 3, 3); g.p("#3a3a3a", [x - 2, b - h - 4, x + 0.5, b - h - 7, x + 3, b - h - 4]); },
    pier: function (g, x, b, w) { g.r("#6a5a4a", x, b - 6, w, 2); for (var i = 0; i < w; i += 6) g.r("#4a3e34", x + i, b - 4, 1, 4); g.r("#e8e0d0", x + w - 14, b - 12, 12, 6); g.p("#c8402a", [x + w - 15, b - 12, x + w - 8, b - 16, x - 1 + w, b - 12]); },
    bridge: function (g, x, b, w, h, c) { g.r(c, x, b - h, w, 3); var n = Math.max(1, Math.round(w / 14)); for (var i = 0; i < n; i++) { var ax = x + i * w / n; g.r(c, ax, b - h + 3, w / n, h - 3); g.e(E0(g, ENV.haze), ax + w / n / 2, b, w / n * 0.36, (h - 4) * 0.8, Math.PI, 0); } },
    mission: function (g, x, b) { var c = "#efe6d4"; g.r(c, x - 16, b - 14, 32, 14); g.r(c, x - 22, b - 22, 7, 22); g.r(c, x + 15, b - 22, 7, 22); g.e("#b5563a", x - 18.5, b - 22, 3.5, 3, Math.PI, 0); g.e("#b5563a", x + 18.5, b - 22, 3.5, 3, Math.PI, 0); g.p(c, [x - 16, b - 14, x, b - 20, x + 16, b - 14]); g.r("#5a4030", x - 2, b - 8, 4, 8); g.r("#3a3020", x - 20, b - 19, 3, 3); g.r("#3a3020", x + 17, b - 19, 3, 3); },
    matterhorn: function (g, x, b, h) { g.p("#6a7280", [x - h * 0.9, b, x - h * 0.15, b - h * 0.85, x - h * 0.02, b - h, x + h * 0.12, b - h * 0.9, x + h * 0.85, b]); g.p("#4f5662", [x - h * 0.02, b - h, x + h * 0.12, b - h * 0.9, x + h * 0.85, b, x + h * 0.15, b]); g.p("#f2f5f9", [x - h * 0.32, b - h * 0.62, x - h * 0.15, b - h * 0.85, x - h * 0.02, b - h, x + h * 0.12, b - h * 0.9, x + h * 0.28, b - h * 0.62, x + h * 0.1, b - h * 0.72, x - h * 0.08, b - h * 0.6]); },
    fuji: function (g, x, b, w, h) { g.p("#6a7a96", [x - w / 2, b, x - w * 0.08, b - h, x + w * 0.08, b - h, x + w / 2, b]); g.p("#f2f5f9", [x - w * 0.21, b - h * 0.6, x - w * 0.08, b - h, x + w * 0.08, b - h, x + w * 0.22, b - h * 0.6, x + w * 0.12, b - h * 0.66, x + w * 0.04, b - h * 0.56, x - w * 0.05, b - h * 0.66, x - w * 0.13, b - h * 0.58]); },
    karst: function (g, x, b, w, h, c) { g.p(c, [x - w / 2, b, x - w * 0.42, b - h * 0.6, x - w * 0.25, b - h * 0.92, x, b - h, x + w * 0.25, b - h * 0.9, x + w * 0.42, b - h * 0.55, x + w / 2, b]); g.p(dk(c, 0.1), [x, b - h, x + w * 0.25, b - h * 0.9, x + w * 0.42, b - h * 0.55, x + w / 2, b, x + w * 0.1, b]); },
    mesa: function (g, x, b, w, h, c) { g.p(c, [x - w / 2 - 8, b, x - w / 2, b - h, x + w / 2, b - h, x + w / 2 + 8, b]); g.r(lt(c, 0.12), x - w / 2, b - h, w, 2); for (var i = 1; i < 4; i++) g.r(dk(c, 0.08), x - w / 2 - i * 2, b - h + i * h / 4, w + i * 4, 1); },
    dunes: function (g, c, b, r, w, amp) { for (var k = 0; k < 4; k++) { var pts = [-4, b + 3], ph = r() * 6, A = amp * (1 - k * 0.18); for (var x = -4; x <= w + 4; x += 3) { var s = ((x / (90 - k * 10) + ph) % 1 + 1) % 1; pts.push(x, b - A * (0.4 + 0.6 * (s < 0.7 ? s / 0.7 : (1 - s) / 0.3)) * (0.7 + 0.3 * Math.sin(x / 200 + ph))); } pts.push(w + 4, b + 3); g.p(k % 2 ? dk(c, 0.06 + k * 0.03) : lt(c, 0.05 - k * 0.02), pts); b += 4; } },
    windmill: function (g, x, b, h) { g.p("#ece4d4", [x - 4, b, x - 2.5, b - h, x + 2.5, b - h, x + 4, b]); g.p("#8a5a3a", [x - 3.5, b - h, x, b - h - 4, x + 3.5, b - h]); g.r("#3a3030", x - 1, b - 5, 2, 5); },
    templeHeaven: function (g, x, b) { g.r("#e8e4dc", x - 12, b - 3, 24, 3); for (var i = 0; i < 3; i++) { var w = 18 - i * 4; g.r("#a8302a", x - w / 2 + 2, b - 6 - i * 6, w - 4, 4); g.p("#2f5a9a", [x - w / 2 - 1, b - 6 - i * 6, x, b - 9 - i * 6, x + w / 2 + 1, b - 6 - i * 6]); } g.r("#d8b84a", x - 0.5, b - 24, 1, 4); },
    drumTower: function (g, x, b) { g.r("#9a3a2a", x - 18, b - 16, 36, 16); g.r("#7a6a5a", x - 20, b - 10, 40, 10); for (var i = 0; i < 3; i++) g.e("#3a2a22", x - 10 + i * 10, b, 3, 5, Math.PI, 0); g.p("#3a4a4a", [x - 24, b - 16, x - 16, b - 22, x + 16, b - 22, x + 24, b - 16]); g.r("#a8302a", x - 14, b - 28, 28, 6); g.p("#3a4a4a", [x - 20, b - 28, x - 12, b - 34, x + 12, b - 34, x + 20, b - 28]); g.r("#3a4a4a", x - 22, b - 17, 2, 1); g.r("#3a4a4a", x + 20, b - 17, 2, 1); },
    empire: function (g, x, b, h) { var c = "#8a8c92"; g.r(c, x - 8, b - h * 0.55, 16, h * 0.55); g.r(c, x - 6, b - h * 0.75, 12, h * 0.2); g.r(c, x - 4, b - h * 0.88, 8, h * 0.13); g.r(c, x - 2, b - h * 0.95, 4, h * 0.07); g.r(c, x - 0.5, b - h, 1, h * 0.05); wins(g, ENV, Math.random, x - 7, b - h * 0.86, 14, h * 0.84, 3, 3, 1, 1, "#6a6c72", 0.45); },
    chrysler: function (g, x, b, h) { var c = "#9a9ca4"; g.r(c, x - 5, b - h * 0.8, 10, h * 0.8); for (var i = 0; i < 4; i++) g.e("#c8ccd4", x, b - h * 0.8 - i * 3, 5 - i, 3, Math.PI, 0); g.p("#c8ccd4", [x - 1, b - h * 0.92, x, b - h, x + 1, b - h * 0.92]); wins(g, ENV, Math.random, x - 4, b - h * 0.78, 8, h * 0.76, 3, 3, 1, 1, "#6a6c72", 0.45); },
    icc: function (g, x, b, h) { var c = "#6a8aa8"; g.p(c, [x - 7, b, x - 6, b - h, x + 6, b - h + 3, x + 7, b]); wins(g, ENV, Math.random, x - 5, b - h + 4, 10, h - 6, 2, 3, 1, 1, lt(c, 0.25), 0.5); },
    sophia: function (g, x, b) { var c = "#a85a44"; g.r(c, x - 14, b - 14, 28, 14); g.e("#3f7a62", x, b - 20, 7, 8); g.p("#3f7a62", [x - 3, b - 26, x, b - 32, x + 3, b - 26]); g.r("#d8b84a", x - 0.5, b - 35, 1, 3); g.e("#3f7a62", x - 11, b - 16, 3, 3); g.e("#3f7a62", x + 11, b - 16, 3, 3); g.r(lt(c, 0.1), x - 14, b - 14, 28, 1); for (var i = 0; i < 4; i++) g.e("#2a2420", x - 9 + i * 6, b - 7, 1.5, 3); },
    buddha: function (g, x, b) { g.e("#4a6a5a", x, b - 9, 9, 9, Math.PI, 0); g.e("#4a6a5a", x, b - 18, 5, 5); g.e("#5a7a6a", x, b - 22, 3, 2); },
    mount: function (g, x, b, w, h, c) { g.p(c, [x - w / 2, b, x - w * 0.1, b - h, x + w * 0.15, b - h * 0.92, x + w / 2, b]); }
  };
  var ENV = null;
  function E0(g, c) { return c; }

  /* the view, by place (far / middle / near layers; each runs from x = 0 to its own width) */
  function buildView(E, key, F, M, N, wF, wM, wN, r) {
    var b = 104, s = E.season, sn = E.snowy, cst = E.st, i, x;
    var grass = { spring: "#7aa850", summer: "#6a9a48", autumn: "#a8a04a", winter: "#8a9070" }[s];
    if (sn) grass = "#e6ecf0";
    function hillsFar(c, a) { rolling(F, c, b - 6, a || 22, r, wF, 140); }
    function sea(y, c) { water(M, c || "#3f7fae", y, b, wM, r); }
    function seaN(y, c) { water(N, c || "#3f7fae", y, b, wN, r); }
    function lake(y) { water(M, "#4a86a0", y, b, wM, r); }
    function fieldN(c) { N.r(c || grass, 0, b - 6, wN, 10); }
    switch (key) {
      case "paris":
        LM.eiffel(F, wF * 0.42, b - 18, 56); town(F, "haus", 0, wF, b - 14, r, E, 10, 16, 14, 24);
        town(M, "haus", 0, wM, b - 2, r, E, 24, 36, 20, 34); LM.campanile(M, wM * 0.12, b - 2, 46, "#e0d2b6", "clock");
        wood(N, "plane", b, r, E, wN, 46, 22, 30); break;
      case "provence":
        F.r("#9a9ab4", 0, b - 14, wF, 2); range(F, "#a8a6b8", b - 6, 8, 18, 40, r, null, wF);
        for (x = 0; x < wM; x += 5) M.r(s === "summer" ? (x % 10 ? "#e8b82a" : "#c89020") : s === "spring" ? (x % 10 ? "#8a78c0" : "#6a5aa0") : x % 10 ? "#a89a5a" : "#8a7a4a", x, b - 12, 4, 12);
        house(M, "terra", wM * 0.3, b - 10, 22, 12, r, E); wood(M, "cypress", b - 8, r, E, wM, 60, 16, 26); wood(N, "olive", b, r, E, wN, 70, 14, 20); break;
      case "annecy":
        range(F, "#6b7f96", b - 10, 26, 54, 46, r, sn || s !== "summer" ? 34 : 46, wF); lake(b - 22); town(M, "pastel", wM * 0.2, wM * 0.6, b - 22, r, E, 8, 14, 8, 12);
        wood(N, "plane", b, r, E, wN, 60, 22, 30); break;
      case "malo":
        sea(b - 30, "#3a7a9e"); LM.island(M, wM * 0.6, b - 30, 40, 12, true); town(F, "stone", wF * 0.15, wF * 0.6, b - 30, r, E, 14, 22, 10, 14);
        F.r("#7a786e", wF * 0.12, b - 32, wF * 0.52, 6); LM.campanile(F, wF * 0.38, b - 44, 18, "#7a786e", "spire"); break;
      case "hamburg":
        LM.campanile(F, wF * 0.4, b - 12, 50, "#7a4a34", "spire"); LM.campanile(F, wF * 0.6, b - 12, 40, "#7a4a34", "spire"); town(F, "brick", 0, wF, b - 10, r, E, 10, 18, 12, 18);
        M.r("#3a5a6a", 0, b - 8, wM, 8); town(M, "brick", 0, wM, b - 8, r, E, 22, 32, 18, 30); break;
      case "heidelberg":
        rolling(F, "#3f6a46", b - 8, 40, r, wF, 110); LM.ruin(F, wF * 0.4, b - 34); town(M, "terra", 0, wM, b - 8, r, E, 12, 20, 10, 16); LM.campanile(M, wM * 0.45, b - 8, 34, "#b07050", "spire");
        M.r("#4a7a90", 0, b - 8, wM, 8); LM.bridge(M, wM * 0.6, b - 4, 60, 9, "#a8604a"); break;
      case "bavaria":
        range(F, "#77889e", b - 8, 40, 70, 54, r, 44, wF); rolling(M, grass, b - 2, 12, r, wM, 90); LM.onion(M, wM * 0.35, b - 8, 26, "#efe6d6", "#3a6a4a"); town(M, "chalet", wM * 0.45, wM * 0.9, b - 6, r, E, 12, 16, 14, 20);
        wood(N, "fir", b, r, E, wN, 34, 20, 34); break;
      case "blackforest":
        rolling(F, "#2f4a38", b - 6, 34, r, wF, 100); rolling(F, "#3a5a42", b - 4, 22, r, wF, 70); lake(b - 18); house(M, "chalet", wM * 0.3, b - 18, 26, 16, r, E);
        wood(N, "fir", b, r, E, wN, 16, 26, 44); break;
      case "madrid":
        town(F, "terra", 0, wF, b - 8, r, E, 14, 30, 14, 24); M.r("#5a6068", 0, b - 34, wM, 4); for (x = 0; x < wM; x += 24) { M.e("#7a8a98", x + 12, b - 34, 12, 10, Math.PI, 0); M.r("#3a4048", x, b - 34, 1, 30); }
        wood(N, "palm", b, r, E, wN, 34, 30, 46); break;
      case "tabernas":
        range(F, "#c49a6a", b - 6, 14, 30, 34, r, null, wF); for (i = 0; i < 9; i++) LM.mesa(M, r() * wM, b - 2, 20 + r() * 30, 8 + r() * 14, pk(r, ["#c88a5a", "#d8a06a", "#b8784a"]));
        M.r("#d8b080", 0, b - 4, wM, 6); wood(N, "scrub", b, r, E, wN, 40, 6, 10); break;
      case "ronda":
        range(F, "#8a8a6a", b - 6, 18, 34, 40, r, null, wF); M.p("#9a8a6a", [0, b, 0, b - 30, wM * 0.42, b - 30, wM * 0.44, b, wM * 0.5, b, wM * 0.52, b - 30, wM, b - 30, wM, b]);
        LM.bridge(M, wM * 0.43, b - 30, wM * 0.1, 30, "#b09070"); town(M, "white", 0, wM * 0.4, b - 30, r, E, 8, 12, 8, 12); town(M, "white", wM * 0.54, wM, b - 30, r, E, 8, 12, 8, 12); wood(N, "olive", b, r, E, wN, 40, 12, 18); break;
      case "sitges":
        rolling(F, "#8a9a6a", b - 10, 18, r, wF, 120); sea(b - 26, "#2f8ab0"); M.p("#a89a7a", [wM * 0.2, b - 26, wM * 0.24, b - 34, wM * 0.38, b - 34, wM * 0.42, b - 26]);
        house(M, "white", wM * 0.25, b - 34, 16, 8, r, E); LM.campanile(M, wM * 0.33, b - 34, 18, "#e8dcc0", "flat"); wood(N, "palm", b, r, E, wN, 40, 30, 44); break;
      case "girona":
        rolling(F, "#6a8a5a", b - 8, 22, r, wF, 120); LM.campanile(F, wF * 0.45, b - 26, 30, "#c8b490", "flat"); F.r("#c8b490", wF * 0.4, b - 30, 40, 24);
        M.r("#4a7a90", 0, b - 6, wM, 6); town(M, "pastel", 0, wM, b - 6, r, E, 18, 28, 8, 14); wood(N, "plane", b, r, E, wN, 60, 22, 30); break;
      case "manhattan":
        town(F, "tower", 0, wF, b - 10, r, E, 30, 64, 8, 14); LM.empire(F, wF * 0.42, b - 10, 84); LM.chrysler(F, wF * 0.58, b - 10, 74);
        town(M, "brown", 0, wM, b - 2, r, E, 18, 34, 14, 22); break;
      case "flagstaff":
        range(F, "#6a7a8a", b - 10, 34, 54, 70, r, s === "summer" ? 60 : 42, wF); wood(M, "pine", b - 2, r, E, wM, 12, 18, 30); N.r("#a8804a", 0, b - 4, wN, 6);
        N.r("#efe6d4", wN * 0.3, b - 22, 10, 10); N.r("#3a3a3a", wN * 0.3 + 4, b - 12, 2, 12); N.t("#1a1a1a", "66", wN * 0.3 + 5, b - 15, "7px VT323, monospace"); break;
      case "rockies":
        range(F, "#5d6a7e", b - 8, 50, 80, 40, r, 52, wF); lake(b - 14); wood(M, "pine", b - 14, r, E, wM, 9, 14, 22); wood(N, "pine", b, r, E, wN, 22, 28, 44); break;
      case "mission":
        range(F, "#7a8a6a", b - 6, 24, 40, 60, r, null, wF); LM.mission(M, wM * 0.35, b - 6); town(M, "white", wM * 0.5, wM, b - 6, r, E, 8, 12, 12, 18); wood(N, "palm", b, r, E, wN, 46, 34, 50); break;
      case "edinburgh":
        rolling(F, "#5a6a4a", b - 10, 30, r, wF, 60); LM.castleRock(M, wM * 0.32, b - 10); town(M, "tene", wM * 0.5, wM, b - 8, r, E, 20, 36, 10, 16); LM.campanile(M, wM * 0.55, b - 8, 44, "#5a564e", "spire");
        wood(N, "round", b, r, E, wN, 40, 18, 26); break;
      case "mount":
        F.r("#6a7a5a", 0, b - 34, wF, 4); sea(b - 30, "#3a7898"); LM.island(M, wM * 0.4, b - 30, 50, 20, true); LM.pier(N, 0, b, wN * 0.3); seaN(b - 6, "#3a7898"); break;
      case "windermere":
        rolling(F, "#6a7a5a", b - 18, 34, r, wF, 90); lake(b - 24); wood(N, "oak", b, r, E, wN, 56, 20, 30); for (x = 0; x < wN; x += 30) N.r("#8a8478", x, b - 4, 22, 3); break;
      case "cairngorms":
        rolling(F, "#7a7a86", b - 8, 40, r, wF, 120); if (s !== "summer") rolling(F, "#eef2f6", b - 26, 14, r, wF, 120); wood(M, "scots", b - 2, r, E, wM, 18, 22, 34);
        N.r(s === "summer" || s === "autumn" ? "#8a5a8a" : grass, 0, b - 6, wN, 10); break;
      case "beijing":
        range(F, "#7a8090", b - 14, 12, 24, 50, r, sn ? 18 : null, wF); town(M, "tower", 0, wM, b - 4, r, E, 20, 46, 10, 16); LM.templeHeaven(M, wM * 0.3, b - 4); wood(N, "willow", b, r, E, wN, 46, 20, 28); break;
      case "karst":
        for (i = 0; i < 14; i++) LM.karst(F, r() * wF, b - 10, 16 + r() * 18, 26 + r() * 34, pk(r, ["#6a8a8a", "#7a9a96", "#5f7f80"]));
        for (i = 0; i < 9; i++) LM.karst(M, r() * wM, b - 16, 24 + r() * 20, 30 + r() * 30, pk(r, ["#3f6a52", "#4a7a5a", "#36604a"]));
        water(M, "#5a9a9a", b - 16, b, wM, r); M.r("#c8a868", wM * 0.4, b - 12, 16, 2); M.r("#3a3a3a", wM * 0.4 + 9, b - 18, 1, 6); wood(N, "bamboo", b, r, E, wN, 26, 22, 32); break;
      case "suzhou":
        LM.pagoda(F, wF * 0.45, b - 8, 7, 1, "#a8886a", "#5a4a3a"); rolling(F, "#6a8a6a", b - 6, 10, r, wF, 80);
        M.r("#5a8a8a", 0, b - 8, wM, 8); town(M, "jn", 0, wM, b - 8, r, E, 12, 18, 16, 26); LM.bridge(M, wM * 0.5, b - 4, 26, 9, "#9a9a92"); wood(N, "willow", b, r, E, wN, 50, 22, 30); break;
      case "xiamen":
        sea(b - 28, "#2f80a8"); LM.island(M, wM * 0.45, b - 28, 70, 18, false); town(M, "terra", wM * 0.33, wM * 0.58, b - 34, r, E, 5, 8, 6, 10); wood(N, "banyan", b, r, E, wN, 60, 24, 32); break;
      case "harbin":
        town(F, "terra", 0, wF, b - 10, r, E, 12, 22, 12, 18); LM.sophia(M, wM * 0.35, b - 4); town(M, "brick", wM * 0.5, wM, b - 4, r, E, 16, 24, 14, 20); wood(N, "birch", b, r, E, wN, 34, 26, 36); break;
      case "dunes":
        LM.dunes(F, "#d8a860", b - 12, r, wF, 34); LM.dunes(M, "#e0b46a", b - 2, r, wM, 18); M.r("#4a8a9a", wM * 0.5, b - 8, 30, 3); LM.pagoda(M, wM * 0.5 + 15, b - 8, 2, 0.7, "#a8402a", "#3a3a3a"); wood(N, "scrub", b, r, E, wN, 60, 5, 8); break;
      case "kyoto":
        rolling(F, "#4a6a4a", b - 8, 30, r, wF, 90); LM.pagoda(M, wM * 0.32, b - 6, 5, 1.2, "#5a3a2a", "#3a3c40"); M.r("#e8e4dc", wM * 0.62, b - 40, 3, 34); M.r("#e8e4dc", wM * 0.6, b - 44, 7, 4); M.r("#c8402a", wM * 0.62, b - 47, 3, 3);
        town(M, "jp", 0, wM, b - 2, r, E, 8, 14, 14, 22); wood(N, s === "autumn" ? "maple" : "sakura", b, r, E, wN, 52, 18, 26); break;
      case "hakone":
        if (!E.grey) LM.fuji(F, wF * 0.5, b - 18, 110, 48); rolling(F, "#4a6a4a", b - 8, 26, r, wF, 70); rolling(M, "#3f6a46", b - 4, 18, r, wM, 50); town(M, "jp", wM * 0.3, wM * 0.7, b - 4, r, E, 10, 16, 18, 26);
        wood(N, "maple", b, r, E, wN, 44, 18, 26); break;
      case "kamakura":
        rolling(F, "#4a6a4a", b - 14, 20, r, wF, 70); sea(b - 26, "#3a80a8"); LM.island(M, wM * 0.55, b - 26, 46, 14, false); M.r("#e8e4dc", wM * 0.55 - 1, b - 46, 3, 8); LM.buddha(F, wF * 0.25, b - 14);
        wood(N, "pine", b, r, E, wN, 60, 22, 30); break;
      case "biei":
        range(F, "#7a8298", b - 14, 24, 40, 60, r, s === "summer" ? 36 : 22, wF);
        for (i = 0; i < 6; i++) rolling(M, sn ? lt("#e6ecf0", i * 0.02) : s === "summer" ? pk(r, ["#8a6ac0", "#e8c84a", "#d85a6a", "#7aa850", "#e8e0c8"]) : s === "autumn" ? pk(r, ["#c8a84a", "#a8884a", "#8a9a4a"]) : pk(r, ["#8ab858", "#7aa850"]), b - 2 + i, 12 - i * 1.6, r, wM, 60 + i * 10);
        tree(M, "round", wM * 0.4, b - 8, 22, r, E); tree(M, "round", wM * 0.43, b - 8, 18, r, E); wood(N, "birch", b, r, E, wN, 60, 24, 34); break;
      case "firenze":
        rolling(F, "#7a8a5a", b - 8, 22, r, wF, 120); wood(F, "cypress", b - 14, r, E, wF, 40, 8, 12); town(M, "terra", 0, wM, b - 2, r, E, 10, 18, 10, 16);
        LM.domeF(M, wM * 0.35, b - 4, 1.4); LM.campanile(M, wM * 0.35 + 22, b - 4, 40, "#efe6d4", "flat"); LM.campanile(M, wM * 0.55, b - 4, 34, "#c8a878", "flat"); break;
      case "vernazza":
        rolling(F, "#6a8a4a", b - 8, 40, r, wF, 60); for (x = 0; x < wF; x += 6) F.r("#5a7a3a", x, b - 30 + (x % 18), 4, 1); sea(b - 18, "#2f8ab0");
        for (i = 0; i < 4; i++) town(M, "pastel", wM * 0.2 + i * 6, wM * 0.5 - i * 6, b - 18 - i * 9, r, E, 9, 12, 6, 9); LM.campanile(M, wM * 0.44, b - 18, 26, "#d8c8a8", "flat"); LM.campanile(M, wM * 0.24, b - 46, 14, "#a89a7a", "flat"); break;
      case "matterhorn":
        range(F, "#6a7282", b - 8, 30, 46, 50, r, 30, wF); LM.matterhorn(F, wF * 0.45, b - 8, 92); town(M, "chalet", 0, wM, b - 4, r, E, 12, 18, 14, 20); wood(N, "larch", b, r, E, wN, 30, 26, 40); break;
      case "eiger":
        LM.mount(F, wF * 0.35, b - 8, 160, 80, "#5a6272"); range(F, "#6a7282", b - 8, 40, 64, 40, r, 40, wF); rolling(M, grass, b - 2, 16, r, wM, 80); town(M, "chalet", wM * 0.2, wM * 0.8, b - 6, r, E, 10, 16, 12, 18); wood(N, "fir", b, r, E, wN, 30, 26, 40); break;
      case "hongkong":
        rolling(F, "#3f5a46", b - 10, 44, r, wF, 70); town(M, "tower", 0, wM, b - 10, r, E, 24, 54, 8, 14); LM.icc(M, wM * 0.4, b - 10, 80); water(M, "#3a6a8a", b - 10, b, wM, r); break;
      case "taipo":
        rolling(F, "#3f6a46", b - 8, 44, r, wF, 90); town(M, "nt", 0, wM, b - 4, r, E, 14, 20, 12, 16); wood(N, "banyan", b, r, E, wN, 70, 24, 32, "palm"); break;
      case "aber":
        rolling(F, "#5a7a4a", b - 14, 36, r, wF, 80); sea(b - 22, "#3a7898"); LM.pier(M, wM * 0.5, b - 18, 60); town(M, "pastel", 0, wM * 0.45, b - 22, r, E, 14, 20, 8, 12); break;
      case "eryri":
        range(F, "#5a6474", b - 10, 34, 58, 50, r, sn ? 40 : null, wF); wood(M, "oak", b - 4, r, E, wM, 14, 20, 30); M.r("#4a7a8a", 0, b - 6, wM, 6); LM.bridge(M, wM * 0.4, b - 2, 40, 9, "#7a786e"); wood(N, "fir", b, r, E, wN, 36, 24, 38); break;
      case "gulou":
        LM.drumTower(F, wF * 0.42, b - 10); town(F, "hut", 0, wF, b - 8, r, E, 6, 9, 16, 26); town(M, "hut", 0, wM, b - 2, r, E, 10, 14, 18, 30); wood(N, "willow", b, r, E, wN, 60, 18, 26); break;
      case "windmills":
        rolling(F, "#8aa060", b - 8, 24, r, wF, 110); for (i = 0; i < 5; i++) LM.windmill(M, 60 + i * wM / 5 + r() * 30, b - 8 - r() * 8, 18); rolling(M, s === "summer" ? "#c8a040" : grass, b, 10, r, wM, 90); wood(N, "round", b, r, E, wN, 80, 18, 24); break;
      case "paddies":
        rolling(F, "#4a6a4a", b - 10, 26, r, wF, 90); for (x = 0; x < wM; x += 34) { M.r(s === "summer" ? "#6aa84a" : s === "autumn" ? "#d8b04a" : "#7aa0a8", x, b - 10, 32, 10); M.r("#5a7a3a", x + 32, b - 10, 2, 10); } town(M, "jp", wM * 0.6, wM * 0.8, b - 10, r, E, 8, 12, 14, 18); break;
      case "lighthouse":
        sea(b - 30, "#3a6a98"); M.p("#7a7a6a", [wM * 0.35, b - 30, wM * 0.4, b - 44, wM * 0.62, b - 44, wM * 0.68, b - 30]); LM.lighthouse(M, wM * 0.5, b - 44, 28); break;
      case "aurora":
        rolling(F, "#c8d0dc", b - 8, 10, r, wF, 140); wood(M, "pine", b - 2, r, E, wM, 30, 14, 24); break;
      case "trestle":
        range(F, "#5d7466", b - 8, 40, 60, 46, r, sn ? 46 : null, wF); M.r("#4a6a7a", 0, b - 6, wM, 6); for (x = 20; x < wM; x += 12) { M.p("#6a4a2a", [x, b - 6, x + 6, b - 30, x + 7, b - 30, x + 1, b - 6]); M.p("#6a4a2a", [x + 12, b - 6, x + 6, b - 30, x + 7, b - 30, x + 13, b - 6]); } M.r("#5a3a20", 0, b - 31, wM, 2); wood(N, "pine", b, r, E, wN, 26, 26, 40); break;
      case "mesas":
        for (i = 0; i < 8; i++) LM.mesa(F, r() * wF, b - 6, 30 + r() * 40, 20 + r() * 24, pk(r, ["#c46a3a", "#b85a32", "#d07a4a"])); M.r("#d8a26a", 0, b - 6, wM, 6);
        M.r("#6a5a4a", wM * 0.4, b - 28, 2, 22); M.r("#6a5a4a", wM * 0.4 + 12, b - 28, 2, 22); M.r("#8a6a4a", wM * 0.4 - 2, b - 40, 18, 12); M.p("#6a4a3a", [wM * 0.4 - 3, b - 40, wM * 0.4 + 7, b - 46, wM * 0.4 + 17, b - 40]); wood(N, "saguaro", b, r, E, wN, 60, 14, 22); break;
      case "harbour":
        town(F, "tower", 0, wF, b - 10, r, E, 24, 48, 8, 14); water(M, "#2a4a6a", b - 10, b, wM, r); town(M, "neon", 0, wM * 0.6, b - 10, r, E, 16, 28, 10, 16); for (x = wM * 0.65; x < wM; x += 40) { M.r("#c8402a", x, b - 40, 2, 30); M.r("#c8402a", x - 14, b - 40, 26, 2); } break;
      default: buildBiome(E, F, M, N, wF, wM, wN, r, grass);
    }
  }
  /* the made-up stops, by their kind of country */
  function buildBiome(E, F, M, N, wF, wM, wN, r, grass) {
    var b = 104, s = E.season, sn = E.snowy, i;
    switch (E.b) {
      case "metropolis": town(F, "tower", 0, wF, b - 10, r, E, 26, 60, 8, 14); town(M, "neon", 0, wM, b - 2, r, E, 18, 36, 10, 18); M.r("#3a3a44", 0, b - 16, wM, 3); for (i = 0; i < wM; i += 40) M.r("#3a3a44", i, b - 13, 3, 13); break;
      case "alpine": range(F, "#6b7f96", b - 8, 40, 70, 46, r, sn || s !== "summer" ? 44 : 60, wF); wood(M, "fir", b - 2, r, E, wM, 10, 14, 24); town(M, "chalet", wM * 0.3, wM * 0.45, b - 4, r, E, 10, 14, 12, 16); wood(N, "fir", b, r, E, wN, 26, 26, 40); break;
      case "coastal": rolling(F, "#6a8a5a", b - 18, 20, r, wF, 120); water(M, "#3f7fae", b - 26, b, wM, r); LM.lighthouse(M, wM * 0.7, b - 26, 20); M.p("#8a8270", [wM * 0.64, b - 26, wM * 0.66, b - 30, wM * 0.76, b - 30, wM * 0.78, b - 26]); break;
      case "countryside": rolling(F, "#7a9a5a", b - 10, 24, r, wF, 120); rolling(M, grass, b - 2, 14, r, wM, 90); house(M, "stone", wM * 0.4, b - 8, 18, 10, r, E); wood(M, "round", b - 8, r, E, wM, 70, 14, 20); wood(N, "round", b, r, E, wN, 90, 20, 28); break;
      case "desert": for (i = 0; i < 8; i++) LM.mesa(F, r() * wF, b - 6, 30 + r() * 40, 18 + r() * 24, pk(r, ["#c46a3a", "#b85a32", "#d07a4a"])); M.r("#d8a26a", 0, b - 6, wM, 6); wood(N, "saguaro", b, r, E, wN, 70, 14, 22); break;
      case "forest": rolling(F, "#2f4a38", b - 6, 30, r, wF, 90); wood(M, "cedar", b - 2, r, E, wM, 9, 26, 40); wood(N, "cedar", b, r, E, wN, 18, 36, 56); break;
      case "lake": rolling(F, "#5f7a6e", b - 18, 26, r, wF, 90); water(M, "#4a86a0", b - 22, b, wM, r); for (i = 0; i < wN; i += 3) if (r() < 0.6) N.r(s === "winter" ? "#a89a6a" : "#6a8a4a", i, b - 4 - r() * 6, 1, 10); break;
      case "snow": rolling(F, "#c9d2de", b - 8, 16, r, wF, 140); wood(M, "pine", b - 2, r, E, wM, 24, 12, 22); wood(N, "pine", b, r, E, wN, 60, 24, 36); break;
      default: rolling(F, "#7a9a5a", b - 10, 24, r, wF, 120);
    }
  }
  var WATERV = { annecy: "#4a86a0", malo: "#3a7a9e", hamburg: "#3a5a6a", heidelberg: "#4a7a90", blackforest: "#4a86a0", sitges: "#2f8ab0", girona: "#4a7a90", rockies: "#4a86a0", mount: "#3a7898", windermere: "#4a86a0",
    karst: "#5a9a9a", suzhou: "#5a8a8a", xiamen: "#2f80a8", kamakura: "#3a80a8", vernazza: "#2f8ab0", hongkong: "#3a6a8a", aber: "#3a7898", eryri: "#4a7a8a", lighthouse: "#3a6a98", harbour: "#2a4a6a", trestle: "#4a6a7a" };
  function apronOf(E, key) { return WATERV[key] || (!key && E.b === "coastal" ? "#3f7fae" : !key && E.b === "lake" ? "#4a86a0" : null); }
  function groundOf(E, key) {
    var s = E.season; if (E.snowy) return "#e4eaee";
    if (/tabernas|mesas|flagstaff|dunes/.test(key) || E.b === "desert") return "#d4a06a";
    if (/mount|malo|sitges|kamakura|xiamen|aber|lighthouse|vernazza|mission/.test(key) || E.b === "coastal") return "#d6c6a0";
    if (E.b === "metropolis" || E.b === "hutong" || /paris|hamburg|madrid|manhattan|beijing|hongkong|harbour|firenze|kyoto|edinburgh/.test(key)) return "#6c7076";
    return { spring: "#76a24c", summer: "#68954a", autumn: "#9a9448", winter: "#828a6a" }[s];
  }

  /* ---------- the people ---------- */
  var SKIN = ["#f6dcc4", "#f1c9a5", "#e6b48e", "#d6a07a", "#c68c62", "#a86e4a", "#8d5a3b", "#6a4128", "#4e3020"];
  var HAIRC = ["#1a1412", "#2a1d16", "#3a2618", "#4a2e1d", "#6a4428", "#8a5a2b", "#b07a3a", "#c9a15a", "#d8b878", "#a83a2a", "#1a1a1a"];
  var GREYH = ["#c8c4bc", "#dcd8d0", "#9a9894", "#e8e4dc"];
  var COAT = ["#3a3f4a", "#6a3a2e", "#2f4a5e", "#7a6a52", "#8a2e2e", "#2e4a3a", "#c9b48a", "#4a3a5a", "#d8a040", "#a8a49a", "#5a2e3a", "#2a2a2e", "#b85a3a"];
  var TOP = ["#c8452e", "#2c6e8a", "#3f7a4a", "#e0a43a", "#6a4a8a", "#2a2a34", "#d98aa0", "#e8e0cc", "#3a5a8c", "#f2f0ea", "#8ac0c8", "#e8c84a", "#a8c88a", "#c8a0d8"];
  var BOT = ["#2a2a34", "#3d4a6a", "#4a5a7a", "#5a4632", "#2f3a52", "#7a2e3a", "#2f5a4a", "#c9b48a", "#6a6a6a", "#1e1e24"];
  var DRESS = ["#c8452e", "#2c6e8a", "#e8c84a", "#d98aa0", "#3f7a4a", "#f2f0ea", "#6a4a8a", "#e88a5a", "#2a3a5a", "#a8c8e0", "#7a2e3a"];
  var SHOE = ["#2a2420", "#3a2a1e", "#1a1a1e", "#6a4a2e", "#e8e4dc", "#8a2e2e"];
  var BAG = ["#7a4a2a", "#3a3a48", "#8a2e2e", "#2e5a6a", "#c8a06a", "#2a2a2a", "#5a6a3a", "#d8603a"];
  /* someone on the platform, dressed for the place, the season and the sky */
  function folk(r, E, o) {
    o = o || {}; var VK = o.view || "";
    var age = o.age || (r() < 0.09 ? "kid" : r() < 0.16 ? "old" : "adult"), f = { age: age, skin: pk(r, SKIN), hc: age === "old" ? pk(r, GREYH) : pk(r, HAIRC), shoe: pk(r, SHOE) };
    var femme = r() < 0.52;
    f.hair = femme ? pk(r, ["long", "long", "bob", "ponytail", "bun", "curly", "short", "plait"]) : pk(r, ["short", "short", "crop", "curly", "bob", "ponytail", "bald"]);
    if (age === "kid") f.hair = pk(r, ["short", "bob", "pigtails", "ponytail", "curly"]); if (f.hair === "bald" && age !== "old" && r() < 0.6) f.hair = "crop";
    var cold = E.cold, hot = E.hot;
    if (cold) {
      f.outer = r() < 0.55 ? "coat" : "puffer"; f.oc = pk(r, COAT); f.top = pk(r, TOP);
      f.low = femme && r() < 0.45 ? (r() < 0.5 ? "skirt" : "dress") : "trousers"; f.lc = f.low === "dress" ? pk(r, DRESS) : pk(r, BOT); f.tights = pk(r, ["#2a2a30", "#3a2a2a", "#4a3a3a", "#2a2a3a"]);
      if (r() < 0.65) f.scarf = pk(r, ["#c8302a", "#e8c84a", "#2c6e8a", "#e8e0cc", "#3f7a4a", "#d98aa0", "#8a5a8a"]);
      if (r() < 0.4) f.hat = "beanie"; f.hatc = pk(r, ["#c8302a", "#2a2a34", "#e8e0cc", "#3a5a8c", "#d8a040", "#6a8a4a"]); f.boots = r() < 0.5;
    } else if (hot) {
      f.top = pk(r, TOP); f.sleeve = "short";
      f.low = femme ? pk(r, ["dress", "dress", "skirt", "shorts", "trousers"]) : pk(r, ["shorts", "shorts", "trousers", "trousers"]); f.lc = f.low === "dress" ? pk(r, DRESS) : pk(r, BOT.concat(["#c9b48a", "#e8e0cc", "#8ab0d0"]));
      if (r() < 0.22) f.hat = "sun"; f.hatc = pk(r, ["#e8d8a8", "#d8c088", "#f2f0ea"]); if (r() < 0.3) f.shades = 1; if (r() < 0.25) f.shoe = "#e8e4dc";
    } else {
      f.top = pk(r, TOP); if (r() < 0.55) { f.outer = r() < 0.5 ? "jacket" : r() < 0.6 ? "coat" : "cardigan"; f.oc = pk(r, COAT); }
      f.low = femme ? pk(r, ["dress", "skirt", "trousers", "trousers", "long"]) : "trousers"; f.lc = f.low === "dress" ? pk(r, DRESS) : pk(r, BOT); f.tights = r() < 0.5 ? "#2a2a30" : null;
      if (r() < 0.12) { f.hat = pk(r, ["cap", "brim", "beret"]); f.hatc = pk(r, ["#2a2a34", "#7a2e2e", "#3a5a8c", "#c9b48a"]); }
    }
    if (f.low === "dress" && r() < 0.5) f.print = lt(f.lc, 0.45);
    if (age === "old" && r() < 0.35) f.cane = 1;
    if (r() < 0.22 && age !== "kid") f.glasses = 1;
    var q = r();
    if (age === "kid") { if (r() < 0.4) f.pack = pk(r, ["#e85a4a", "#4a8ae8", "#e8c84a", "#5ab86a"]); if (E.L === "jp" && r() < 0.6) { f.hat = "cap"; f.hatc = "#f2d23a"; } }
    else if (q < 0.22) f.pack = pk(r, BAG); else if (q < 0.48) f.bag = pk(r, BAG); else if (q < 0.66 && !o.noCase) f.cas = pk(r, ["#2a3a5a", "#8a2e2e", "#3a3a3a", "#c8a06a", "#5a8a8a", "#e8c84a"]); else if (q < 0.72) f.brief = "#3a2a1e";
    var h = r();
    f.hold = h < 0.24 ? "phone" : h < 0.32 ? "book" : h < 0.42 ? "cup" : h < 0.46 ? "paper" : h < 0.49 ? "flowers" : null;
    if (VK === "paris" && f.bag && r() < 0.6) f.baguette = 1;
    if ((VK === "paris" || E.L === "fr") && !f.hat && !hot && r() < 0.12) { f.hat = "beret"; f.hatc = pk(r, ["#2a2a34", "#7a2e2e", "#c8302a"]); }
    if ((E.b === "alpine" || E.b === "snow") && E.snowy && age === "adult" && r() < 0.25) { f.skis = pk(r, ["#c8302a", "#2a6ae8", "#e8c84a"]); f.cas = null; }
    if ((E.b === "alpine" || E.b === "forest") && !E.snowy && age === "adult" && r() < 0.25) { f.pack = pk(r, ["#c8502a", "#3a6a4a", "#2a4a7a"]); f.big = 1; f.cas = null; f.stick = 1; }
    if (E.b === "coastal" && hot && age === "adult" && r() < 0.14) { f.board = pk(r, ["#f2f0ea", "#e8c84a", "#4ab8c8", "#e85a4a"]); f.cas = null; f.hold = null; }
    if (E.b === "lake" && age === "adult" && r() < 0.07) { f.rod = 1; f.cas = null; }
    if (E.wet && age !== "kid") f.umb = pk(r, ["#2a2a34", "#c8302a", "#2c6e8a", "#e8c84a", "#3f7a4a", "#e8e0cc", "#6a4a8a"]);
    f.walk = 26 + r() * 14;
    return f;
  }

  /* drawn at the deck's own pixels: feet at (x, y), facing right unless face < 0. o: {frame 0-3, face, sit (seat y), tone, look, open (under the sky)} */
  function person(cx, E, f, x, y, o) {
    o = o || {}; x = Math.round(x); y = Math.round(y);
    var T = function (c) { return E.tone(c, 0.04); }, R = function (c, a, b, w, h) { cx.fillStyle = T(c); cx.fillRect(a, b, w, h); }, Lr = function (c, a, b, w, h) { cx.fillStyle = c; cx.fillRect(a, b, w, h); };
    var kid = f.age === "kid", old = f.age === "old";
    var leg = kid ? 7 : 12, torso = kid ? 6 : 10, head = kid ? 5 : 6;
    var fr = o.frame || 0, dx = [0, 2, 0, -2][fr & 3], sit = o.sit;
    cx.save(); if ((o.face || 1) < 0) { cx.translate(x * 2 + 1, 0); cx.scale(-1, 1); }
    /* shadow */
    if (!o.noShadow) { cx.fillStyle = "rgba(0,0,0," + (E.night ? 0.25 : 0.16) + ")"; cx.fillRect(x - 5, y, 11, 1); cx.fillRect(x - 3, y + 1, 7, 1); }
    var hipY = sit ? sit : y - leg - 1, top = hipY - torso, hy = top - 1 - head;
    if (old) { hy += 1; top += 1; }
    var lc = f.low === "shorts" || f.low === "skirt" || f.low === "dress" ? f.skin : f.lc;
    var tights = (f.low === "skirt" || f.low === "dress") && f.tights ? f.tights : null;
    var legC = f.low === "dress" || f.low === "skirt" ? (tights || f.skin) : f.low === "shorts" ? f.skin : f.lc;
    /* suitcase behind (pulled) */
    if (f.cas && !sit) { var cxp = x - 10; R(dk(f.cas, 0.2), cxp + 1, y - 1, 2, 1); R(f.cas, cxp - 1, y - 9, 7, 8); R(lt(f.cas, 0.15), cxp - 1, y - 9, 7, 1); R(dk(f.cas, 0.15), cxp + 2, y - 8, 1, 6); R("#5a5a5a", cxp + 5, y - 13 - (kid ? -4 : 0), 1, 4); R("#5a5a5a", cxp + 5, y - 14, 4, 1); }
    /* back leg / sitting legs */
    if (sit) {
      R(f.low === "dress" || f.low === "skirt" ? f.lc : f.lc, x - 2, hipY - 2, 7, 3);
      R(legC, x + 4, hipY + 1, 2, y - hipY - 2); R(f.boots ? "#2a2018" : f.shoe, x + 4, y - 1, 4, 1);
      if (f.low === "shorts") R(f.skin, x + 2, hipY - 1, 3, 2);
    } else {
      var shoeC = f.boots ? "#2a2018" : f.shoe;
      R(dk(legC, 0.2), x - 2 - Math.round(dx / 2), hipY + 1, 2, Math.ceil(leg / 2)); R(dk(legC, 0.2), x - 2 - dx, hipY + 1 + Math.ceil(leg / 2), 2, Math.floor(leg / 2) - 1); R(dk(shoeC, 0.2), x - 2 - dx, y - 1, 3, 1);
      R(legC, x + Math.round(dx / 2), hipY + 1, 2, Math.ceil(leg / 2)); R(legC, x + dx, hipY + 1 + Math.ceil(leg / 2), 2, Math.floor(leg / 2) - 1); R(lt(legC, 0.08), x + 1 + dx, hipY + 1 + Math.ceil(leg / 2), 1, Math.floor(leg / 2) - 1); R(shoeC, x + dx, y - 1, 3, 1);
      if (f.low === "trousers" || f.low === "long") R(dk(f.lc, 0.1), x - 2, hipY, 5, 2);
      if (f.boots) { R("#2a2018", x - 2 - dx, y - 4, 2, 3); R("#2a2018", x + dx, y - 4, 2, 3); }
    }
    /* the back arm */
    var aSw = sit ? 0 : -Math.round(dx / 2);
    R(dk(f.outer ? f.oc : f.top, 0.25), x - 2 + aSw, top + 1, 2, torso - 2); R(dk(f.skin, 0.15), x - 2 + aSw, top + torso - 1, 2, 1);
    /* backpack */
    if (f.pack) { var ph = f.big ? torso + 3 : torso - 2; R(f.pack, x - 6, top - (f.big ? 2 : 0), 3, ph); R(dk(f.pack, 0.2), x - 6, top + ph - (f.big ? 4 : 2), 3, 2); if (f.big) R("#d8c8a0", x - 6, top - 3, 3, 1); }
    if (f.skis) { cx.fillStyle = T(f.skis); for (var si = 0; si < 22; si++) cx.fillRect(x - 6 + Math.round(si * 0.3), top - 10 + si, 1, 1); for (si = 0; si < 22; si++) cx.fillRect(x - 5 + Math.round(si * 0.3), top - 10 + si, 1, 1); }
    /* skirt, dress, long coat */
    var bodyC = f.low === "dress" ? f.lc : f.top;
    if (f.low === "dress" || f.low === "skirt" || f.low === "long") {
      var sk = f.lc, sl = f.low === "long" ? leg - 1 : Math.round(leg * 0.55);
      if (sit) R(sk, x - 3, hipY - 2, 8, 3); else for (var k2 = 0; k2 < sl; k2++) R(k2 === sl - 1 ? dk(sk, 0.1) : sk, x - 3 - (k2 >> 2), hipY + k2 - 1, 6 + (k2 >> 1), 1);
      if (f.print && !sit) { Lr(T(f.print), x - 2, hipY + 1, 1, 1); Lr(T(f.print), x + 1, hipY + 3, 1, 1); Lr(T(f.print), x - 3, hipY + 4, 1, 1); Lr(T(f.print), x + 2, hipY, 1, 1); }
    } else if (!sit) R(f.lc, x - 2, hipY - 1, 5, 2);
    /* torso */
    R(bodyC, x - 3, top, 6, torso + 1); R(lt(bodyC, 0.15), x - 3, top, 6, 1); R(dk(bodyC, 0.15), x - 3, top + 1, 1, torso);
    if (f.print && f.low === "dress") { Lr(T(f.print), x - 1, top + 3, 1, 1); Lr(T(f.print), x + 1, top + 6, 1, 1); }
    if (f.outer) {
      var oc = f.oc, ol = f.outer === "coat" ? Math.round(leg * 0.7) : f.outer === "puffer" ? 1 : 0;
      R(oc, x - 3, top, 6, torso + 1 + ol); R(lt(oc, 0.12), x - 3, top, 6, 1); R(dk(oc, 0.16), x - 3, top + 1, 1, torso + ol);
      if (f.outer === "coat" && !sit) for (var k3 = 0; k3 < ol; k3++) R(oc, x - 3 - (k3 >> 2), hipY + k3, 6 + (k3 >> 1), 1);
      if (f.outer === "puffer") { R(dk(oc, 0.12), x - 3, top + 3, 6, 1); R(dk(oc, 0.12), x - 3, top + 6, 6, 1); }
      if (f.outer === "jacket" || f.outer === "cardigan") R(f.top, x + 1, top + 1, 1, torso - 1);
    }
    if (f.scarf) { R(f.scarf, x - 2, top - 1, 5, 2); R(dk(f.scarf, 0.15), x + 1, top + 1, 2, 4); }
    if (f.bag && !f.cas) { R(dk(f.bag, 0.25), x - 2, top + 1, 1, 1); cx.fillStyle = T(dk(f.bag, 0.25)); for (var b2 = 0; b2 < 5; b2++) cx.fillRect(x - 2 + b2, top + 1 + b2, 1, 1); R(f.bag, x - 5, hipY - 3, 4, 4); R(lt(f.bag, 0.12), x - 5, hipY - 3, 4, 1);
      if (f.baguette) { R("#d8a048", x - 4, hipY - 9, 2, 7); R("#b8802e", x - 4, hipY - 7, 2, 1); } }
    if (f.board) { R(f.board, x - 9, top + 2, 20, 3); R(dk(f.board, 0.12), x - 9, top + 4, 20, 1); }
    /* the front arm and what's in the hand */
    var hand = f.hold, armC = f.outer ? f.oc : f.sleeve === "short" ? f.skin : f.top;
    var hx0 = x + 1, hy0 = top + torso - 1;
    if (o.open && f.umb) hand = "umb";
    if (f.cas && !sit) { R(armC, x - 1, top + 1, 2, 3); R(armC, x - 3, top + 3, 3, 2); R(f.skin, x - 4, top + 4, 1, 1); hand = null; }
    else if (hand === "phone" || hand === "book" || hand === "paper" || hand === "cup" || hand === "flowers") {
      R(armC, x + 1, top + 1, 2, 3); R(armC, x + 2, top + 3, 2, 2); R(f.skin, x + 3, top + 3, 1, 2);
      if (hand === "phone") { Lr(E.lit ? "#bfe6ff" : T("#2a2a30"), x + 3, top + 1, 1, 2); if (E.night && !o.noShadow) { cx.fillStyle = "rgba(180,220,255,.16)"; cx.fillRect(x + 1, hy - 1, 4, head + 1); } }
      else if (hand === "book") { R(pk(seed(f.top + f.lc), ["#c8452e", "#2c6e8a", "#3f7a4a", "#e0a43a"]), x + 3, top, 3, 4); R("#f2ede0", x + 4, top, 1, 4); }
      else if (hand === "paper") { R("#e8e4da", x + 2, top - 1, 4, 6); R("#9a968e", x + 3, top, 2, 1); R("#9a968e", x + 3, top + 2, 2, 1); }
      else if (hand === "cup") { R("#f2ede0", x + 4, top + 1, 2, 3); R("#8a5a34", x + 4, top + 1, 2, 1); }
      else { R("#3f7a4a", x + 4, top, 1, 4); Lr(T("#e85a6a"), x + 3, top - 2, 2, 2); Lr(T("#f2c94c"), x + 5, top - 1, 1, 1); Lr(T("#f2ede0"), x + 4, top - 3, 1, 1); }
      hx0 = x + 3; hy0 = top + 4;
    } else if (hand === "umb") {
      R(armC, x + 1, top + 1, 2, 3); R(armC, x + 2, top + 2, 2, 2); R(f.skin, x + 3, top + 2, 1, 1);
      R("#3a3a3a", x + 3, top - 12, 1, 14); var uc = f.umb; cx.fillStyle = T(uc); cx.beginPath(); cx.ellipse(x + 3.5, top - 11, 9, 5, 0, Math.PI, 0); cx.fill(); R(dk(uc, 0.2), x - 5, top - 11, 18, 1); R(lt(uc, 0.18), x, top - 15, 4, 1);
    } else if (f.brief && !sit) { R(armC, x, top + 1, 2, torso - 2); R(f.skin, x, hy0, 2, 1); R(f.brief, x - 1, hy0 + 1, 5, 4); R("#c8a06a", x + 1, hy0 + 1, 1, 1); }
    else if (f.rod && !sit) { R(armC, x + 1, top + 1, 2, torso - 3); R(f.skin, x + 1, hy0 - 1, 2, 1); cx.fillStyle = T("#6a4a2a"); for (var rr = 0; rr < 18; rr++) cx.fillRect(x + 2 - Math.round(rr * 0.25), hy0 - 1 - rr, 1, 1); }
    else if (f.cane) { R(armC, x + 1, top + 1, 2, torso - 2); R(f.skin, x + 2, hy0, 2, 1); R("#6a4a2a", x + 3, hy0, 1, y - hy0); }
    else if (f.stick && !sit) { R(armC, x + 1, top + 1, 2, torso - 2); R(f.skin, x + 2, hy0, 2, 1); R("#8a6a4a", x + 3, hy0 - 6, 1, y - hy0 + 6); }
    else { var sw = sit ? 0 : Math.round(dx / 2); R(dk(armC, 0.3), x + sw, top + 2, 1, torso - 4); R(armC, x + 1 + sw, top + 1, 2, torso - 2); R(f.skin, x + 1 + sw, top + torso - 1, 2, 1); }
    if (f.sleeve === "short" && !f.outer) { R(f.top, x + 1, top + 1, 2, 2); }
    /* neck and head */
    R(f.skin, x - 1, top - 1, 2, 1);
    var hx1 = x - 2 + (old ? 1 : 0), down = hand === "phone" || hand === "book" || hand === "paper" || o.look === "down";
    R(f.skin, hx1, hy, 5, head); R(dk(f.skin, 0.12), hx1, hy + head - 1, 5, 1); R(f.skin, hx1 + 5, hy + 2 + (down ? 1 : 0), 1, 2);
    var ey = hy + 2 + (down ? 1 : 0);
    if (!o.asleep) R("#20160f", hx1 + 3, ey, 1, 1); else R(dk(f.skin, 0.35), hx1 + 3, ey + 1, 2, 1);
    if (f.glasses || f.shades) { R(f.shades ? "#1a1a1e" : "#3a3a3a", hx1 + 2, ey, 3, 1); if (f.shades) R("#1a1a1e", hx1 + 3, ey + 1, 2, 1); }
    if (!kid && !o.asleep) R(dk(f.skin, 0.25), hx1 + 3, ey + 2, 1, 1);
    /* hair */
    var hc = f.hc, hl = lt(hc, 0.14);
    switch (f.hair) {
      case "crop": R(hc, hx1, hy - 1, 5, 2); R(hc, hx1, hy, 2, 2); break;
      case "short": R(hc, hx1 - 1, hy - 1, 6, 2); R(hc, hx1 - 1, hy, 2, 3); R(hl, hx1 + 1, hy - 1, 2, 1); break;
      case "bob": R(hc, hx1 - 1, hy - 1, 7, 2); R(hc, hx1 - 1, hy, 3, head - 1); R(hc, hx1 + 4, hy, 1, 2); R(hl, hx1 + 1, hy - 1, 2, 1); break;
      case "long": R(hc, hx1 - 1, hy - 1, 7, 2); R(hc, hx1 - 1, hy, 3, head + 4); R(hc, hx1 + 4, hy, 1, 2); R(dk(hc, 0.12), hx1 - 1, hy + head, 2, 4); R(hl, hx1 + 1, hy - 1, 2, 1); break;
      case "plait": R(hc, hx1 - 1, hy - 1, 7, 2); R(hc, hx1 - 1, hy, 2, head); for (var p2 = 0; p2 < 6; p2++) R(p2 % 2 ? dk(hc, 0.15) : hc, hx1 - 2, hy + head - 1 + p2, 2, 1); R(hl, hx1 + 1, hy - 1, 2, 1); break;
      case "ponytail": R(hc, hx1 - 1, hy - 1, 6, 2); R(hc, hx1 - 1, hy, 2, 3); R(hc, hx1 - 3, hy, 2, 1); R(hc, hx1 - 3, hy + 1, 2, head); R(dk(hc, 0.2), hx1 - 1, hy, 1, 1); R(hl, hx1 + 1, hy - 1, 2, 1); break;
      case "pigtails": R(hc, hx1 - 1, hy - 1, 6, 2); R(hc, hx1 - 1, hy, 2, 2); R(hc, hx1 - 3, hy + 1, 2, 3); R(hc, hx1 + 4, hy + 1, 2, 3); break;
      case "bun": R(hc, hx1 - 1, hy - 1, 6, 2); R(hc, hx1 - 1, hy, 2, 3); R(hc, hx1 - 2, hy - 3, 4, 3); R(hl, hx1 - 1, hy - 3, 2, 1); break;
      case "curly": R(hc, hx1 - 2, hy - 2, 8, 3); R(hc, hx1 - 2, hy, 3, head - 1); R(hc, hx1 + 4, hy - 1, 2, 2); R(hl, hx1, hy - 2, 1, 1); R(hl, hx1 + 3, hy - 2, 1, 1); R(hl, hx1 - 2, hy + 1, 1, 1); break;
      case "bald": R(hc, hx1 - 1, hy + 1, 2, 2); break;
    }
    /* hats */
    if (f.hat === "beanie") { R(f.hatc, hx1 - 1, hy - 2, 7, 3); R(dk(f.hatc, 0.15), hx1 - 1, hy, 7, 1); R(lt(f.hatc, 0.3), hx1 + 1, hy - 3, 2, 1); }
    else if (f.hat === "cap") { R(f.hatc, hx1 - 1, hy - 2, 6, 2); R(dk(f.hatc, 0.15), hx1 + 4, hy - 1, 3, 1); }
    else if (f.hat === "brim") { R(f.hatc, hx1, hy - 3, 5, 2); R(dk(f.hatc, 0.15), hx1 - 2, hy - 1, 9, 1); R("#3a2a1e", hx1, hy - 2, 5, 1); }
    else if (f.hat === "sun") { R(f.hatc, hx1, hy - 3, 5, 2); R(f.hatc, hx1 - 3, hy - 1, 11, 1); R("#c8452e", hx1, hy - 2, 5, 1); }
    else if (f.hat === "beret") { R(f.hatc, hx1 - 1, hy - 2, 6, 2); R(f.hatc, hx1 - 2, hy - 1, 2, 1); R(f.hatc, hx1 + 2, hy - 3, 1, 1); }
    cx.restore();
  }

  /* ---------- the scene: everything for one stop ---------- */
  function scene(st, o) {
    var E = envOf(st, o), sty = styleOf(st), key = VIEW[st.name] || "", R0 = seed(st.name + "|" + E.season);
    ENV = E;
    var W = o.W, ink = st.ink || "#3a3a48";
    /* where the platform is under a roof (rain and snow don't fall there) */
    var COVER = { jp: [0, W - 320], shed: [0, W - 280], uk: [0, 1520], modern: [0, W - 240], chalet: [0, 980], halt: [440, 620], seaside: [1040, 1120], adobe: [200, 1260], hutong: [0, W - 300], jiangnan: [0, W - 300] }[sty] || [0, 0];
    function covered(x) { return x > COVER[0] && x < COVER[1]; }

    /* the view, drawn once into three layers */
    var PAR = [0.07, 0.18, 0.4], DEP = [0.9, 0.55, 0.22], layers = [];
    var widths = PAR.map(function (p) { return Math.ceil(W * p) + 980; });
    var cv = PAR.map(function (p, i) { var c = document.createElement("canvas"); c.width = widths[i]; c.height = LH; return c; });
    var G = cv.map(function (c, i) { var x = c.getContext("2d"); x.imageSmoothingEnabled = false; return api(x, E, DEP[i], OFF); });
    var rv = seed(st.name + "view");
    try { buildView(E, key, G[0], G[1], G[2], widths[0], widths[1], widths[2], rv); } catch (e) { console.warn(e); }
    cv.forEach(function (c, i) { layers.push({ c: c, par: PAR[i] }); });
    var gnd = groundOf(E, key), apW = apronOf(E, key), apron = apW || (E.snowy ? "#dfe6eb" : dk(gnd, 0.06)), ar = seed(st.name + "apron"), rip = []; for (i = 0; i < 60; i++) rip.push([ar() * 1400, ar(), 2 + ar() * 6]);

    /* things that move in the view: clouds, birds, boats, smoke, the lighthouse, camels, aurora */
    var rs = seed(st.name + "sky"), clouds = [], i;
    var nCl = E.wet ? 10 : E.grey ? 8 : E.b === "desert" ? 1 : 2 + ((rs() * 4) | 0);
    for (i = 0; i < nCl; i++) clouds.push({ x: rs() * 1200, y: -80 + rs() * (E.grey ? 90 : 70), w: 26 + rs() * 50, s: 0.6 + rs() * 1.4 });
    var stars = []; for (i = 0; i < 70; i++) stars.push([rs() * 900, -130 + rs() * 200, rs()]);
    var birds = []; var nb = E.night || E.wet || E.snowing ? 0 : (E.b === "coastal" || /mount|malo|sitges|kamakura|xiamen|aber|vernazza|lighthouse/.test(key)) ? 4 : E.season === "winter" ? 1 : 3;
    for (i = 0; i < nb; i++) birds.push({ x: rs() * 600, y: -40 + rs() * 60, v: 8 + rs() * 10, p: rs() * 6, gull: E.b === "coastal" || /mount|malo|sitges|kamakura|xiamen|aber|vernazza|lighthouse/.test(key) });
    var boats = []; if (/annecy|windermere|mount|kamakura|sitges|vernazza|xiamen|aber|hongkong|karst|suzhou|harbour/.test(key) || E.b === "lake" || E.b === "coastal") for (i = 0; i < 2; i++) boats.push({ x: 60 + rs() * 500, y: 104 - 6 - rs() * 12, v: (rs() < 0.5 ? -1 : 1) * (1 + rs() * 2), k: key === "karst" ? "raft" : key === "hongkong" || key === "harbour" ? "ferry" : key === "windermere" && i === 0 ? "steamer" : "sail" });
    var camels = key === "dunes" ? [{ x: 260, v: 4 }] : [];
    var steam = key === "hakone" ? [[180, 96], [240, 98], [320, 95]] : [];
    var chim = E.cold && /bavaria|blackforest|matterhorn|eiger|cairngorms|edinburgh|biei|harbin|annecy|eryri|gulou/.test(key + "|" + E.b) ? [[120, 70], [210, 76], [330, 72]] : [];
    if (E.cold && !key && (E.b === "alpine" || E.b === "snow")) chim = [[150, 84], [240, 86]];
    var aurora = E.night && !E.grey && (E.b === "snow" || key === "aurora");
    var lightBeam = E.lit && (key === "lighthouse" || (!key && E.b === "coastal"));
    var fireflies = []; if (E.night && !E.wet && E.season === "summer" && (key === "paddies" || E.b === "forest" || E.b === "countryside" || E.b === "lake")) for (i = 0; i < 18; i++) fireflies.push([rs() * 800, 60 + rs() * 50, rs() * 6]);
    var petals = E.season === "spring" && /kyoto|kamakura|hakone/.test(key) ? 26 : E.season === "autumn" && !E.wet ? 12 : 0, pts = []; for (i = 0; i < petals; i++) pts.push([rs(), rs(), rs()]);
    var drops = []; for (i = 0; i < (E.snowing ? 140 : E.wet ? 180 : 0); i++) drops.push([Math.random(), Math.random(), 0.5 + Math.random()]);
    var puddles = []; if (E.wet) for (i = 0; i < 12; i++) puddles.push([rs() * W, 128 + rs() * 50, 8 + rs() * 14]);

    /* the deck's things that don't move: posts, lamps, what decorates the platform (by style) */
    var decor = [], dX = function (k, x, extra) { var d = { k: k, x: x }; for (var q in extra) d[q] = extra[q]; decor.push(d); };
    var POST = { jp: 160, shed: 200, uk: 180, modern: 220, chalet: 160, hutong: 160, jiangnan: 160, adobe: 150 }[sty];
    if (sty === "jp") { dX("vend", 1150); dX("vend2", 1178); dX("bin", 640); dX("bin", 1260); }
    if (sty === "shed" || sty === "uk") { dX("trolley", 680); dX("bin", 1240); }
    if (sty === "uk" && E.season !== "winter") { for (i = 260; i < 1500; i += 360) dX("basket", i); }
    if (sty === "chalet") { dX("logs", 640); dX("sledge", 1250); }
    if (sty === "halt") dX("milk", 700);
    if (sty === "seaside") { dX("buoy", 700); dX("bin", 1260); }
    if (sty === "adobe") { dX("tower", 1480); dX("cactus", 700); dX("cactus", 2160); dX("barrel", 1260); }
    if (sty === "hutong" || sty === "jiangnan") { dX("pot", 680); dX("bike", 1250); }
    if (sty === "modern") { dX("screen", 680); dX("bin", 1250); }
    /* lamps where the platform is open */
    var lamps = []; for (i = 100; i < W; i += 200) if (!covered(i)) lamps.push(i);
    var fr = seed(st.name + "floor"), specks = []; for (i = 0; i < 260; i++) specks.push([fr() * W, 121 + fr() * 70, fr()]);

    /* ---------- the sky (each frame) ---------- */
    function sky(cx, Wc, Hc, oy, cam, t) {
      var g = cx.createLinearGradient(0, 0, 0, oy + 106); g.addColorStop(0, E.sky[0]); g.addColorStop(0.55, E.sky[1]); g.addColorStop(1, E.sky[2]);
      cx.fillStyle = g; cx.fillRect(0, 0, Wc, oy + 110);
      var sx = Wc * 0.72 - cam * 0.015;
      if (E.night && !E.grey) {
        stars.forEach(function (s) { var x = ((s[0] - cam * 0.03) % (Wc + 40) + Wc + 40) % (Wc + 40) - 20, y = oy + s[1]; if (y > oy + 90) return; var tw = 0.5 + 0.5 * Math.sin(t * (1 + s[2] * 3) + s[2] * 40); cx.fillStyle = "rgba(230,236,255," + (0.35 + tw * 0.55) * (s[2] < 0.15 ? 1 : 0.7) + ")"; cx.fillRect(x | 0, y | 0, s[2] < 0.08 ? 2 : 1, s[2] < 0.08 ? 2 : 1); });
        var my = oy - 40; cx.fillStyle = "#f4efd8"; cx.beginPath(); cx.arc(sx, my, 7, 0, 7); cx.fill(); cx.fillStyle = E.sky[0]; cx.beginPath(); cx.arc(sx + 3, my - 2, 6, 0, 7); cx.fill();
        if (aurora) { for (var a = 0; a < 3; a++) { cx.fillStyle = ["rgba(90,240,170,.10)", "rgba(120,200,255,.08)", "rgba(200,120,255,.06)"][a]; for (var ax = 0; ax < Wc; ax += 2) { var ah = 26 + 14 * Math.sin(ax / 40 + t * 0.3 + a * 2) + 8 * Math.sin(ax / 13 + t * 0.7); cx.fillRect(ax, oy - 90 + a * 8 + 10 * Math.sin(ax / 70 + t * 0.2), 2, ah); } } }
      } else if (!E.grey) {
        var sy = E.dawn ? oy + 70 : E.dusk ? oy + 80 : oy - 80, sc = E.dawn ? "#ffe2b0" : E.dusk ? "#ffb070" : "#fff6dc";
        cx.fillStyle = E.dusk || E.dawn ? "rgba(255,190,120,.25)" : "rgba(255,250,220,.25)"; cx.beginPath(); cx.arc(sx, sy, 16, 0, 7); cx.fill();
        cx.fillStyle = sc; cx.beginPath(); cx.arc(sx, sy, E.dusk ? 11 : 9, 0, 7); cx.fill();
      }
      /* clouds */
      var cc = E.night ? (E.grey ? "#2a2e38" : "#1e2640") : E.dusk ? "#e8a090" : E.dawn ? "#f6d0c0" : E.wet ? "#8a9098" : E.grey ? "#d0d4da" : "#ffffff";
      clouds.forEach(function (c) {
        var x = ((c.x + t * c.s - cam * 0.04) % (Wc + 160) + Wc + 160) % (Wc + 160) - 80, y = oy + c.y;
        cx.fillStyle = dk(cc, 0.08); cx.beginPath(); cx.ellipse(x + c.w * 0.1, y + 3, c.w * 0.55, 5, 0, 0, 7); cx.fill();
        cx.fillStyle = cc; cx.beginPath(); cx.ellipse(x, y, c.w * 0.5, 5, 0, 0, 7); cx.ellipse(x - c.w * 0.2, y - 3, c.w * 0.22, 5, 0, 0, 7); cx.ellipse(x + c.w * 0.15, y - 5, c.w * 0.25, 6, 0, 0, 7); cx.fill();
        if (E.dusk || E.dawn) { cx.fillStyle = "rgba(255,230,190,.35)"; cx.fillRect(x - c.w * 0.4, y - 5, c.w * 0.6, 1); }
      });
      if (E.wet) { cx.fillStyle = "rgba(60,66,76,.25)"; cx.fillRect(0, 0, Wc, oy + 40); }
    }
    /* ---------- the view (each frame: three layers, then what moves in them) ---------- */
    function view(cx, Wc, oy, cam, t) {
      var LV = VLIFT, LF = [1, 0.6, 0.22];
      for (var l = 0; l < 3; l++) {
        var L = layers[l], x = -Math.round(cam * L.par); cx.drawImage(L.c, x, oy - OFF - Math.round(LV * LF[l]));
        if (l === 0 && LV > 0) {   /* the stretch between: water, or the place's ground */
          var y0 = oy + 104 - LV; cx.fillStyle = E.tone(apron, 0.35); cx.fillRect(0, y0, Wc, LV + 2);
          if (apW) rip.forEach(function (q) { var rx = ((q[0] - cam * 0.3) % (Wc + 20) + Wc + 20) % (Wc + 20) - 10; cx.fillStyle = E.tone(lt(apron, 0.22), 0.3); cx.fillRect(rx | 0, (y0 + 2 + q[1] * (LV - 3)) | 0, q[2] | 0, 1); });
          else { cx.fillStyle = E.tone(dk(apron, 0.1), 0.3); for (var hy = y0 + 6; hy < oy + 100; hy += 7) cx.fillRect(0, hy, Wc, 1); }
        }
      }
      var M6 = Math.round(LV * 0.6);
      var tone = function (c) { return E.tone(c, 0.5); };
      boats.forEach(function (b) {
        var bx = ((b.x + t * b.v - cam * 0.18) % (Wc + 120) + Wc + 120) % (Wc + 120) - 60, by = oy + b.y - M6 + Math.sin(t + b.x) * 0.5;
        if (b.k === "sail") { cx.fillStyle = tone("#6a4a34"); cx.fillRect(bx - 5, by, 11, 2); cx.fillStyle = tone("#f4efe2"); cx.beginPath(); cx.moveTo(bx, by - 1); cx.lineTo(bx, by - 11); cx.lineTo(bx + 6, by - 1); cx.fill(); }
        else if (b.k === "steamer") { cx.fillStyle = tone("#2a2a34"); cx.fillRect(bx - 10, by - 1, 22, 3); cx.fillStyle = tone("#efe6d4"); cx.fillRect(bx - 6, by - 5, 14, 4); cx.fillStyle = tone("#c8402a"); cx.fillRect(bx + 1, by - 9, 3, 4); if (E.lit) { cx.fillStyle = "#ffd98a"; for (var q = 0; q < 4; q++) cx.fillRect(bx - 5 + q * 3, by - 4, 1, 1); } }
        else if (b.k === "ferry") { cx.fillStyle = tone("#2f6a4a"); cx.fillRect(bx - 9, by - 1, 19, 3); cx.fillStyle = tone("#efe6d4"); cx.fillRect(bx - 7, by - 5, 15, 4); if (E.lit) { cx.fillStyle = "#ffd98a"; for (var q2 = 0; q2 < 5; q2++) cx.fillRect(bx - 6 + q2 * 3, by - 4, 1, 1); } }
        else { cx.fillStyle = tone("#c8a868"); cx.fillRect(bx - 7, by, 15, 2); cx.fillStyle = tone("#3a3a3a"); cx.fillRect(bx + 3, by - 6, 1, 6); cx.fillRect(bx - 1, by - 5, 2, 5); }
        if (E.lit) { cx.fillStyle = "#ffe6a0"; cx.fillRect(bx, by - 2, 1, 1); }
      });
      camels.forEach(function (c) { var bx = ((c.x + t * c.v - cam * 0.18) % (Wc + 200) + Wc + 200) % (Wc + 200) - 100, by = oy + 100 - M6, st2 = ((t * 3) | 0) % 2;
        for (var k = 0; k < 3; k++) { var x0 = bx - k * 14; cx.fillStyle = tone(k === 1 ? "#3a3030" : "#8a6a4a"); if (k === 1) { cx.fillRect(x0, by - 8, 2, 8); cx.fillRect(x0 - 1, by - 10, 4, 3); continue; }
          cx.fillRect(x0 - 4, by - 7, 8, 3); cx.fillRect(x0 - 2, by - 9, 4, 2); cx.fillRect(x0 + 4, by - 9, 2, 4); cx.fillRect(x0 + 5, by - 10, 3, 2); cx.fillRect(x0 - 4 + st2, by - 4, 1, 4); cx.fillRect(x0 + 2 - st2, by - 4, 1, 4); } });
      steam.concat(chim).forEach(function (s, k) { for (var p = 0; p < 5; p++) { var age = ((t * 0.25 + p / 5 + k * 0.3) % 1); cx.fillStyle = "rgba(240,240,244," + (0.35 * (1 - age)) + ")"; cx.beginPath(); cx.arc(s[0] - cam * 0.18 + age * 8 + Math.sin(age * 6 + k) * 2, oy + s[1] - M6 - age * 26, 1.5 + age * 4, 0, 7); cx.fill(); } });
      if (lightBeam) { var ang = t * 0.8, bxp = (key === "lighthouse" ? 0.5 : 0.7) * widths[1] - cam * 0.18, byp = oy - M6 + (key === "lighthouse" ? 104 - 44 - 26 : 104 - 26 - 18); cx.fillStyle = "rgba(255,240,170," + (0.1 + 0.08 * Math.max(0, Math.cos(ang))) + ")"; cx.beginPath(); cx.moveTo(bxp, byp); cx.lineTo(bxp + Math.cos(ang) * 160, byp - 8); cx.lineTo(bxp + Math.cos(ang) * 160, byp + 8); cx.fill(); }
      birds.forEach(function (b) { var bx = ((b.x + t * b.v) % (Wc + 60) + Wc + 60) % (Wc + 60) - 30, by = oy + b.y + Math.sin(t * 0.6 + b.p) * 4, fl = Math.sin(t * 7 + b.p) > 0;
        cx.fillStyle = b.gull ? E.tone("#f4f4f0", 0.3) : E.tone("#2a2a30", 0.3); cx.fillRect(bx, by, 1, 1); cx.fillRect(bx - 2, by - (fl ? 1 : -1), 2, 1); cx.fillRect(bx + 1, by - (fl ? 1 : -1), 2, 1); });
      fireflies.forEach(function (f) { var a = 0.5 + 0.5 * Math.sin(t * 2 + f[2] * 9); cx.fillStyle = "rgba(220,255,120," + a + ")"; cx.fillRect(((f[0] - cam * 0.3 + Math.sin(t * 0.5 + f[2]) * 6) % Wc + Wc) % Wc, oy + f[1] + Math.sin(t + f[2]) * 3, 1, 1); });
      /* the ground between the view and the track */
      cx.fillStyle = E.tone(gnd, 0.1); cx.fillRect(0, oy + 100, Wc, 6);
      if (E.fog) { var fg = cx.createLinearGradient(0, oy + 20, 0, oy + 106); fg.addColorStop(0, "rgba(220,226,232,0)"); fg.addColorStop(1, "rgba(220,226,232,.5)"); cx.fillStyle = fg; cx.fillRect(0, oy + 20, Wc, 86); }
    }
    /* ---------- the track ---------- */
    function track(cx, Wc, oy, cam) {
      var bal = { desert: "#a88a6a", snow: "#c8ccd0" }[E.b] || "#6a645c"; if (E.snowy) bal = "#d8dde2";
      cx.fillStyle = E.tone(bal, 0); cx.fillRect(0, oy + 105, Wc, 13);
      for (var q = -((cam | 0) % 7); q < Wc; q += 7) { cx.fillStyle = E.tone(E.snowy ? "#a8a29a" : "#4a3a2e", 0); cx.fillRect(q, oy + 109, 4, 6); }
      cx.fillStyle = E.tone("#b8b4ac", 0); cx.fillRect(0, oy + 110, Wc, 1); cx.fillRect(0, oy + 114, Wc, 1);
      cx.fillStyle = E.tone("#5a5652", 0); cx.fillRect(0, oy + 111, Wc, 1); cx.fillRect(0, oy + 115, Wc, 1);
      /* masts and wires for the electric lines */
      if (/jp|modern|shed|chalet/.test(sty) && !(key === "rockies" || key === "flagstaff")) {
        cx.fillStyle = E.tone("#4a4e54", 0.1); for (var m = Math.floor(cam / 240) - 1; m < Math.floor((cam + Wc) / 240) + 2; m++) { var mx = m * 240 + 120 - cam; cx.fillRect(mx, oy + 30, 2, 75); cx.fillRect(mx - 4, oy + 32, 14, 1); }
        cx.fillStyle = E.tone("#2a2e34", 0.1); cx.fillRect(0, oy + 36, Wc, 1); cx.fillRect(0, oy + 40, Wc, 1);
      }
    }
    /* ---------- a train (the coaches by type; people in the windows) ---------- */
    var COACHES = o.coaches;
    function train(cx, T, cam, oy, nc, CL, GAP, mineCar) {
      if (!T) return; var C = COACHES[T.k], y = oy + 58, lit = E.lit;
      var R = function (c, a, b, w, h) { cx.fillStyle = E.tone(c, 0); cx.fillRect(Math.round(a), Math.round(b), Math.round(w), Math.round(h)); };
      var Lr = function (c, a, b, w, h) { cx.fillStyle = c; cx.fillRect(Math.round(a), Math.round(b), Math.round(w), Math.round(h)); };
      for (var c = 0; c < nc; c++) {
        var x = T.x + c * (CL + GAP) - cam; if (x > cx.canvas.width + 10 || x + CL < -10) continue; var rr = seed((T.to ? T.to.name : "mine") + T.k + c);
        R(dk(C.roof, 0.1), x + 3, y - 5, CL - 6, 2); R(C.roof, x + 1, y - 3, CL - 2, 4); R(C.body, x, y, CL, 54); R(lt(C.body, 0.1), x, y, CL, 1); R(dk(C.body, 0.12), x, y + 48, CL, 6); R(C.stripe, x, y + 37, CL, 4);
        if (T.k === "tram") R(C.stripe, x, y + 41, CL, 9);
        if (T.k === "commuter" || T.k === "mountain" || T.k === "tram") if (c % 2 === 0) { R("#3a3a40", x + 40, y - 6, 22, 1); R("#3a3a40", x + 44, y - 12, 1, 6); R("#3a3a40", x + 58, y - 12, 1, 6); R("#3a3a40", x + 42, y - 12, 18, 1); }
        for (var wv = 0; wv < 5; wv++) {
          var wx = x + 12 + wv * 21; R("#1d2228", wx - 1, y + 8, 16, 17);
          if (lit) Lr(E.tone(C.win, -1), wx, y + 9, 14, 15); else { R("#9fb6c6", wx, y + 9, 14, 15); R("rgba(255,255,255,.35)", wx + 1, y + 10, 5, 2); R(lt("#9fb6c6", 0.2), wx + 9, y + 18, 3, 1); }
          var q = rr(); if (q < 0.55) { var sk = pk(rr, SKIN), hc = pk(rr, HAIRC.concat(GREYH)), px0 = wx + 3 + ((q * 20) | 0) % 6; var hC = lit ? dk(sk, 0.25) : E.tone(dk(sk, 0.2), 0.2);
            Lr(lit ? dk(hc, 0.3) : E.tone(hc, 0.2), px0 - 1, y + 13, 6, 2); Lr(hC, px0, y + 14, 4, 4); Lr(lit ? dk(pk(rr, TOP), 0.3) : E.tone(pk(rr, TOP), 0.25), px0 - 1, y + 18, 6, 6); } else { rr(); rr(); rr(); }
        }
        var dx0 = x + CL - 31; R("#1d2228", dx0, y + 5, 20, 47); var open = T.mine && c === mineCar && T.mode === "stopped";
        if (open) { Lr(lit ? "#c8a86a" : E.tone("#3a2a1a", 0), dx0 + 1, y + 6, 18, 45); }
        else { R(C.body, dx0 + 1, y + 6, 9, 45); R(C.body, dx0 + 10, y + 6, 9, 45); R(lit ? E.tone(C.win, -1) : "#9fb6c6", dx0 + 3, y + 10, 5, 12); R(lit ? E.tone(C.win, -1) : "#9fb6c6", dx0 + 12, y + 10, 5, 12); }
        R("#f2eadc", x + 4, y + 28, 8, 6); cx.fillStyle = "#1d2228"; cx.font = "6px monospace"; cx.fillText(String(c + 1), x + 6, y + 33);
        R("#20201f", x + 10, y + 54, 26, 3); R("#20201f", x + CL - 38, y + 54, 26, 3); R("#3a3a3a", x + 13, y + 55, 5, 2); R("#3a3a3a", x + 28, y + 55, 5, 2); R("#3a3a3a", x + CL - 35, y + 55, 5, 2); R("#3a3a3a", x + CL - 20, y + 55, 5, 2);
        if (E.snowy) R("#f2f5f8", x + 1, y - 4, CL - 2, 2);
        if (E.wet) R("rgba(255,255,255,.08)", x, y + 1, CL, 2);
      }
      var head = T.x - cam;
      if (head + 8 > 0 && head < cx.canvas.width) { R(C.roof, head - 8, y + 4, 10, 50); R(dk(C.roof, 0.2), head - 8, y + 4, 2, 50); Lr(E.lit ? "#fff6c8" : E.tone("#e8e0c8", 0), head - 7, y + 40, 4, 4); if (E.lit) { cx.fillStyle = "rgba(255,246,200,.12)"; cx.beginPath(); cx.moveTo(head - 7, y + 42); cx.lineTo(head - 70, y + 30); cx.lineTo(head - 70, y + 56); cx.fill(); } }
      var tail = T.x + nc * (CL + GAP) - GAP - cam; if (tail > 0 && tail < cx.canvas.width + 10) { R(C.roof, tail - 2, y + 4, 6, 50); Lr(E.lit ? "#ff5a4a" : E.tone("#9a3a2a", 0), tail, y + 42, 2, 3); }
    }

    /* ---------- the platform itself, in its style ---------- */
    var deckRand = seed(st.name + "deck");
    var FLOOR = { jp: "#a9a59d", shed: "#8f8a82", uk: "#8c8780", modern: "#c4c6c8", chalet: "#8a847a", halt: "#8a8478", seaside: "#c8c2b4", adobe: "#a8865e", hutong: "#7e7c78", jiangnan: "#8a8a86" }[sty];
    if (E.b === "lake" && sty === "halt") FLOOR = "#8a6a4a";
    function deckBack(cx, Wc, Hc, oy, cam, t) {
      var g = api(cx, E, 0, oy), rx = function (x) { return x - cam; };
      /* edge and floor */
      var fl = E.snowy && sty !== "shed" ? mix(FLOOR, "#eef2f5", 0.55) : FLOOR;
      g.r(sty === "uk" ? "#e8e2d0" : sty === "adobe" ? "#7a5a3a" : "#c8c4bc", 0, 118, Wc, 3); g.r(dk(fl, 0.25), 0, 121, Wc, 1);
      g.r(fl, 0, 122, Wc, Hc - oy - 122);
      /* the floor's own pattern, in perspective */
      var rows = [122, 127, 134, 143, 155, 170, 190, 214, 244];
      if (sty === "jp" || sty === "modern") { for (var k = 1; k < rows.length; k++) g.r(dk(fl, 0.07), 0, rows[k], Wc, 1); var step = sty === "modern" ? 40 : 30; for (var q = -(cam % step); q < Wc; q += step) g.r(dk(fl, 0.06), q, 122, 1, Hc - oy - 122);
        g.r("#e8c33a", 0, 124, Wc, 3); for (q = -(cam % 3); q < Wc; q += 3) g.r("#c9a52a", q, 125, 1, 1); }
      else if (sty === "shed" || sty === "uk" || sty === "jiangnan" || sty === "hutong") { for (k = 1; k < rows.length; k++) { g.r(dk(fl, 0.08), 0, rows[k], Wc, 1); var sp = 10 + k * 6, off = (k % 2) * sp / 2; for (q = -((cam + off) % sp); q < Wc; q += sp) g.r(dk(fl, 0.08), q, rows[k - 1], 1, rows[k] - rows[k - 1]); }
        if (sty !== "uk") g.r(sty === "shed" ? "#e8e4da" : "#a8a49c", 0, 125, Wc, 1); }
      else if (sty === "chalet" || (sty === "halt" && E.b === "lake")) { for (k = 122; k < Hc - oy; k += 4) g.r(dk(fl, 0.12), 0, k, Wc, 1); for (q = -(cam % 46); q < Wc; q += 46) g.r(dk(fl, 0.16), q, 122, 1, Hc - oy); }
      else if (sty === "adobe") { for (k = 122; k < Hc - oy; k += 5) g.r(dk(fl, 0.1), 0, k, Wc, 1); for (q = -(cam % 38); q < Wc; q += 38) g.r(dk(fl, 0.14), q, 122, 1, Hc - oy); }
      else { specks.forEach(function (s) { var x = s[0] - cam; if (x < -2 || x > Wc) return; g.r(s[2] < 0.5 ? dk(fl, 0.12) : lt(fl, 0.1), x, s[1], 1, 1); }); g.r("#e8e2d2", 0, 124, Wc, 1); }
      /* grass and flowers at the edges of a country halt */
      if ((sty === "halt" || sty === "seaside" || sty === "chalet") && !E.snowy) for (q = -(cam % 9); q < Wc; q += 9) { var gx = q + ((q + cam) * 7 % 5); g.r(E.season === "autumn" ? "#9a8a4a" : "#5a8a3a", gx, 120, 1, 2); if (E.season !== "winter" && ((q + cam) | 0) % 27 === 0) g.r(pk(seed("" + ((q + cam) | 0)), ["#e85a6a", "#f2c94c", "#f4efe2", "#a86ad8"]), gx, 119, 1, 1); }
      if (sty === "halt" && Hc - oy > 186) { for (q = -(cam % 12); q < Wc; q += 12) g.r("#7a5a3a", q, 176, 2, 14); g.r("#8a6a4a", 0, 179, Wc, 1); g.r("#8a6a4a", 0, 184, Wc, 1); }
      /* puddles */
      if (E.wet) puddles.forEach(function (p) { var x = p[0] - cam; if (x < -30 || x > Wc + 30 || covered(p[0])) return; cx.fillStyle = E.tone(mix(FLOOR, E.sky[1], 0.5), 0); cx.beginPath(); cx.ellipse(x, oy + p[1], p[2], 1.6, 0, 0, 7); cx.fill(); var rp = (t * 1.3 + p[0]) % 1; cx.strokeStyle = "rgba(255,255,255," + (0.3 * (1 - rp)) + ")"; cx.lineWidth = 1; cx.beginPath(); cx.ellipse(x + Math.sin(p[0]) * p[2] * 0.4, oy + p[1], 1 + rp * 4, 0.6 + rp, 0, 0, 7); cx.stroke(); });
      /* the station house at the near end */
      stationHouse(g, rx(0), E);
      /* the roof over the platform */
      canopy(g, cx, Wc, oy, cam, t);
      cam_oy = oy; decor.forEach(function (d) { var x = d.x - cam; if (x < -60 || x > Wc + 60) return; deco(g, d, x, t); });
      lamps.forEach(function (lx) { var x = lx - cam; if (x < -40 || x > Wc + 40) return; lamp(g, cx, x, oy, t); });
    }
    function stationHouse(g, x, E) {
      if (x > g.cx.canvas.width + 10 || x + 180 < 0) return;
      var r = seed(st.name + "house"), b = 147;
      if (sty === "jp") { g.r("#d8d2c4", x, b - 74, 150, 74); g.r("#4a5058", x - 4, b - 80, 158, 6); g.r("#5a4a3a", x, b - 20, 150, 3); g.r("#e8e2d4", x + 10, b - 60, 40, 16); g.t("#1a1a1a", st.jp || st.name, x + 30, b - 48 + 0, "bold 9px 'Hiragino Sans','Noto Sans CJK JP',sans-serif"); for (var i = 0; i < 4; i++) { g.r("#2a2e36", x + 60 + i * 18, b - 46, 10, 26); g.L(E.lit ? "#e6f0ff" : E.tone("#5a6a7a", 0), x + 61 + i * 18, b - 45, 8, 24); } g.r("#9aa0a8", x + 60, b - 18, 82, 18); }
      else if (sty === "shed") { g.r("#d8c8a8", x, b - 100, 160, 100); g.r(dk("#d8c8a8", 0.15), x, b - 104, 160, 4); for (i = 0; i < 3; i++) { g.e("#3a3e46", x + 30 + i * 50, b - 52, 14, 18, Math.PI, 0); g.r("#3a3e46", x + 16 + i * 50, b - 52, 28, 52); g.L(E.lit ? "#ffe0a0" : E.tone("#6a7480", 0), x + 18 + i * 50, b - 64, 24, 64); } g.e("#f4efe2", x + 80, b - 84, 9, 9); g.r("#2a2a30", x + 80, b - 90, 1, 6); g.r("#2a2a30", x + 80, b - 84, 5, 1); }
      else if (sty === "uk") { g.r("#9a4a32", x, b - 70, 150, 70); for (var yy = b - 70; yy < b; yy += 3) g.r(dk("#9a4a32", 0.1), x, yy, 150, 1); g.r("#4a5058", x - 4, b - 78, 158, 8); for (i = 0; i < 3; i++) { g.r("#e8e2d0", x + 16 + i * 44, b - 54, 22, 30); g.L(E.lit ? "#ffe0a0" : E.tone("#4a5460", 0), x + 18 + i * 44, b - 52, 18, 26); } g.r(ink, x + 120, b - 30, 18, 30); }
      else if (sty === "modern") { g.r("#e8ecef", x, b - 90, 170, 90); for (i = 0; i < 8; i++) g.L(E.lit ? "#dff0ff" : E.tone("#9ab4c8", 0), x + 6 + i * 20, b - 82, 16, 70); g.r("#c8302a", x, b - 90, 170, 4); }
      else if (sty === "chalet") { g.r("#e6e0d2", x, b - 30, 150, 30); g.r("#6a4428", x, b - 70, 150, 40); g.p(E.snowy ? "#f2f5f8" : "#4a3828", [x - 12, b - 70, x + 75, b - 110, x + 162, b - 70]); g.r("#e8dcc0", x + 20, b - 62, 26, 8); for (i = 0; i < 3; i++) { g.r("#3a2818", x + 70 + i * 22, b - 60, 12, 18); g.L(E.lit ? "#ffd98a" : E.tone("#6a7480", 0), x + 71 + i * 22, b - 59, 10, 16); if (!E.snowy && E.season !== "winter") for (var fx = 0; fx < 12; fx += 2) g.r(fx % 4 ? "#d8303a" : "#3f7a4a", x + 70 + i * 22 + fx, b - 42, 2, 2); } }
      else if (sty === "halt" || sty === "seaside") { var c = sty === "seaside" ? "#efe9dc" : "#9a948a"; g.r(c, x + 20, b - 52, 110, 52); g.p(sty === "seaside" ? ink : "#4a5058", [x + 12, b - 52, x + 75, b - 76, x + 138, b - 52]); roofSnow(g, E, x + 30, b - 60, 90); g.r(sty === "seaside" ? ink : "#5a3a22", x + 60, b - 30, 16, 30); for (i = 0; i < 2; i++) { g.r("#e8e2d0", x + 30 + i * 64, b - 40, 18, 16); g.L(E.lit ? "#ffd98a" : E.tone("#4a5460", 0), x + 32 + i * 64, b - 38, 14, 12); } }
      else if (sty === "adobe") { house(g, "adobe", x + 10, b, 140, 60, r, E); g.r("#5a3a22", x + 70, b - 30, 16, 30); g.r("#e8d8b0", x + 30, b - 52, 90, 10); g.t("#5a3a22", st.name.toUpperCase(), x + 75, b - 44, "8px VT323, monospace"); }
      else if (sty === "hutong" || sty === "jiangnan") { var wc = sty === "jiangnan" ? "#ece9e2" : "#8a8a88"; g.r(wc, x, b - 60, 160, 60); g.r("#33363a", x - 6, b - 66, 172, 6); g.r("#a8302a", x + 60, b - 46, 36, 46); g.r("#d8b84a", x + 76, b - 26, 2, 2); g.r("#d8b84a", x + 80, b - 26, 2, 2); g.r("#2a2420", x + 58, b - 54, 40, 8); g.t("#d8b84a", st.name, x + 78, b - 48, "8px 'Noto Sans CJK SC',sans-serif"); }
    }
    function canopy(g0, cx, Wc, oy, cam, t) {
      var L = LIFT, g = api(cx, E, 0, oy - L), post = function (c, x, y, w, h) { g.r(c, x, y, w, h + L); }; oy -= L;
      var x0 = COVER[0] - cam, x1 = COVER[1] - cam, a = Math.max(-10, x0), b = Math.min(Wc + 10, x1), k, px;
      if (b <= a) return;
      if (sty === "jp") {
        g.r("#d6d8d8", a, -2, b - a, 8); g.r("#a8acae", a, 6, b - a, 2); g.r(E.snowy ? "#f2f5f8" : "#b8bcbe", a, -4, b - a, 2);
        for (k = Math.ceil((cam + a) / POST); k * POST - cam < b; k++) { px = k * POST - cam; if (k * POST < COVER[0] + 20 || k * POST > COVER[1] - 10) continue; post("#c8ccce", px - 2, 8, 4, 139); post(dk("#c8ccce", 0.2), px + 1, 8, 1, 139); g0.r("#9a9ea2", px - 4, 145, 8, 2);
          g.L(E.lit ? "#f4fbff" : E.tone("#e8eef0", 0), px + 30, 9, 40, 2); if (k % 2 === 0) { g.r("#2a2a2e", px + 50, 8, 1, 6); g.r("#f4f4f0", px + 32, 13, 38, 11); g.r("#2a5aa8", px + 32, 22, 38, 2); g.r(k % 4 === 0 ? "#f2d23a" : "#f4f4f0", px + 32, 13, 38, 1); g.t("#1a1a1a", k % 4 === 0 ? "出口 →" : (k % 3 + 1) + "番線", px + 51, 21, "bold 8px 'Hiragino Sans','Noto Sans CJK JP',sans-serif"); } }
        if (E.lit) { cx.fillStyle = "rgba(230,245,255,.08)"; cx.fillRect(a, oy + 10, b - a, 140); }
      } else if (sty === "shed") {
        var irn = "#2d3a45", gl = E.lit ? (E.night ? "#1a2238" : "#5a5070") : mix(E.sky[1], "#c8d4dc", 0.4);
        g.r(gl, a, -60, b - a, 64); for (k = Math.floor((cam + a) / 24); k * 24 - cam < b; k++) { px = k * 24 - cam; g.r(irn, px, -60, 1, 64); }
        g.r(irn, a, -60, b - a, 2); g.r(irn, a, -24, b - a, 1); g.r(irn, a, 2, b - a, 3); if (E.snowy) g.r("rgba(240,244,248,.6)", a, -60, b - a, 4);
        for (k = Math.ceil((cam + a) / POST); k * POST - cam < b; k++) { px = k * POST - cam; if (k * POST < COVER[0] + 20 || k * POST > COVER[1] - 10) continue;
          cx.strokeStyle = E.tone(irn, 0); cx.lineWidth = 2; cx.beginPath(); cx.arc(px + POST / 2, oy + 30, POST / 2, Math.PI, 0); cx.stroke(); cx.lineWidth = 1; cx.beginPath(); cx.arc(px + POST / 2, oy + 30, POST / 2 - 6, Math.PI, 0); cx.stroke();
          post(irn, px - 2, 4, 4, 143); post(lt(irn, 0.2), px - 2, 4, 1, 143); g.r(irn, px - 4, 28, 8, 3); g0.r(irn, px - 5, 141, 10, 6); g.r("#c8a84a", px - 3, 29, 6, 1);
          var lx = px + POST / 2; g.r(irn, lx, 4, 1, 18); g.e(E.lit ? "#ffe8b0" : "#e8e4d4", lx + 0.5, oy - oy + 24, 4, 4); if (E.lit) { cx.fillStyle = "rgba(255,220,150,.10)"; cx.beginPath(); cx.moveTo(lx - 3, oy + 26); cx.lineTo(lx - 34, oy + L + 150); cx.lineTo(lx + 36, oy + L + 150); cx.lineTo(lx + 4, oy + 26); cx.fill(); } }
        if (E.day && !E.grey) { cx.fillStyle = "rgba(255,246,220,.07)"; for (k = Math.floor((cam + a) / 120); k * 120 - cam < b; k++) { px = k * 120 - cam; cx.beginPath(); cx.moveTo(px, oy + 4); cx.lineTo(px + 26, oy + 4); cx.lineTo(px + 66, oy + L + 150); cx.lineTo(px + 40, oy + L + 150); cx.fill(); } }
      } else if (sty === "uk") {
        g.r("#4a5058", a, -8, b - a, 10); g.r(E.snowy ? "#f2f5f8" : "#5a6068", a, -10, b - a, 2);
        for (k = Math.floor((cam + a) / 6); k * 6 - cam < b; k++) { px = k * 6 - cam; g.r(k % 2 ? "#efe8d4" : ink, px, 2, 6, 8); g.p(k % 2 ? "#efe8d4" : ink, [px, 10, px + 3, 14, px + 6, 10]); }
        for (k = Math.ceil((cam + a) / POST); k * POST - cam < b; k++) { px = k * POST - cam; if (k * POST < COVER[0] + 20 || k * POST > COVER[1] - 10) continue; post(ink, px - 2, 10, 4, 137); post(lt(ink, 0.2), px - 2, 10, 1, 137);
          cx.strokeStyle = E.tone(ink, 0); cx.lineWidth = 1.5; cx.beginPath(); cx.arc(px - 10, oy + 10, 10, 0, Math.PI / 2); cx.stroke(); cx.beginPath(); cx.arc(px + 10, oy + 10, 10, Math.PI / 2, Math.PI); cx.stroke(); g0.r(ink, px - 4, 142, 8, 5); }
        for (k = Math.ceil((cam + a + 90) / POST); k * POST + 90 - cam < b; k++) { px = k * POST + 90 - cam; g.r("#2a2a2e", px, 14, 1, 6); g.e(E.lit ? "#ffe6a0" : "#e8e2c8", px + 0.5, 22, 3, 3); if (E.lit) { cx.fillStyle = "rgba(255,220,150,.09)"; cx.beginPath(); cx.moveTo(px - 2, oy + 24); cx.lineTo(px - 30, oy + L + 150); cx.lineTo(px + 31, oy + L + 150); cx.lineTo(px + 3, oy + 24); cx.fill(); } }
      } else if (sty === "modern") {
        g.r("#f0f2f4", a, -6, b - a, 9); g.r("#c8ccd0", a, 3, b - a, 2); g.L(E.lit ? "#e8f4ff" : E.tone("#d8e0e8", 0), a, 5, b - a, 1);
        for (k = Math.ceil((cam + a) / POST); k * POST - cam < b; k++) { px = k * POST - cam; if (k * POST < COVER[0] + 20 || k * POST > COVER[1] - 10) continue; g.p("#e0e4e8", [px - 12, 5, px - 9, 5, px + 1, 147 + L, px - 2, 147 + L]); g.p("#e0e4e8", [px + 9, 5, px + 12, 5, px + 2, 147 + L, px - 1, 147 + L]); g0.r("#c8ccd0", px - 4, 145, 8, 2);
          if (k % 2) { g.r("#1a1a1e", px + 40, 10, 50, 10); g.L(E.tone("#ffb040", -1), px + 43, 13, 22, 1); g.L("#ffb040", px + 43, 16, 30, 1); g.L("#ffb040", px + 70, 13, 16, 1); } }
        if (E.lit) { cx.fillStyle = "rgba(230,245,255,.07)"; cx.fillRect(a, oy + 8, b - a, 140); }
      } else if (sty === "chalet") {
        g.p(E.snowy ? "#f2f5f8" : "#4a3828", [a - 6, 8, a + 4, -12, b - 4, -12, b + 6, 8]); g.r("#6a4428", a, 6, b - a, 4);
        for (k = Math.floor((cam + a) / 5); k * 5 - cam < b; k++) { px = k * 5 - cam; g.p("#efe6d0", [px, 10, px + 2.5, 13, px + 5, 10]); }
        for (k = Math.ceil((cam + a) / POST); k * POST - cam < b; k++) { px = k * POST - cam; if (k * POST < COVER[0] + 20 || k * POST > COVER[1] - 10) continue; post("#5a3820", px - 2, 10, 4, 137); g.p("#5a3820", [px - 14, 10, px - 2, 10, px - 2, 22]); g.p("#5a3820", [px + 2, 10, px + 14, 10, px + 2, 22]);
          if (E.season !== "winter" && !E.snowy) { g.r("#6a4428", px - 8, 30, 16, 4); for (var f2 = 0; f2 < 8; f2++) g.r(f2 % 2 ? "#d8303a" : "#e8505a", px - 8 + f2 * 2, 28, 2, 2); g.r("#3f7a4a", px - 8, 30, 16, 1); }
          g.r("#2a2420", px + 40, 10, 1, 10); g.r("#3a2a1e", px + 37, 20, 7, 8); g.L(E.lit ? "#ffd98a" : E.tone("#c8b890", 0), px + 38, 21, 5, 6); if (E.lit) { cx.fillStyle = "rgba(255,210,130,.10)"; cx.beginPath(); cx.moveTo(px + 38, oy + 28); cx.lineTo(px + 10, oy + L + 150); cx.lineTo(px + 72, oy + L + 150); cx.lineTo(px + 44, oy + 28); cx.fill(); } }
      } else if (sty === "hutong" || sty === "jiangnan") {
        var tile = sty === "jiangnan" ? "#2e3134" : "#4a5254", pil = sty === "jiangnan" ? "#5a3a2a" : "#a8302a";
        for (k = Math.floor((cam + a) / POST); k * POST - cam < b; k++) { px = k * POST - cam; g.p(tile, [px - 4, 6, px + 4, -6, px + POST - 4, -6, px + POST + 4, 6]); g.r(dk(tile, 0.15), px - 4, 6, POST + 8, 2); g.p(tile, [px - 8, 4, px - 4, 6, px - 6, 7]); for (var q = 0; q < POST; q += 3) g.r(dk(tile, 0.2), px + q, -5, 1, 11); }
        roofSnow(g, E, a, -6, b - a); g.r(sty === "jiangnan" ? "#3a2a22" : "#2a4a5a", a, 8, b - a, 4); for (k = Math.floor((cam + a) / 8); k * 8 - cam < b; k++) g.r(sty === "jiangnan" ? "#5a4a3a" : "#3f8a6a", k * 8 - cam, 9, 4, 2);
        for (k = Math.ceil((cam + a) / POST); k * POST - cam < b; k++) { px = k * POST - cam; if (k * POST < COVER[0] + 20 || k * POST > COVER[1] - 10) continue; post(pil, px - 2, 12, 5, 135); post(lt(pil, 0.15), px - 2, 12, 1, 135); g0.r("#7a766e", px - 4, 143, 9, 4);
          var lx2 = px + POST / 2, sway = Math.sin(t * 1.2 + k) * 1; g.r("#2a2420", lx2, 12, 1, 6); g.e(E.lit ? "#ff5a3a" : "#c8302a", lx2 + 0.5 + sway, 22, 4, 5); g.r("#d8b84a", lx2 - 1 + sway, 16, 3, 1); g.r("#d8b84a", lx2 - 1 + sway, 27, 3, 1); g.r("#d8b84a", lx2 + sway, 28, 1, 3);
          if (E.lit) { cx.fillStyle = "rgba(255,110,60,.12)"; cx.beginPath(); cx.arc(lx2 + 0.5, oy + 22, 12, 0, 7); cx.fill(); } }
      } else if (sty === "adobe") {
        g.r("#7a5232", a, 4, b - a, 3); for (k = Math.floor((cam + a) / 4); k * 4 - cam < b; k++) g.r(k % 2 ? "#a8805a" : "#8a6440", k * 4 - cam, 0, 3, 4); for (k = Math.floor((cam + a) / 14); k * 14 - cam < b; k++) g.r("#5a3a22", k * 14 - cam, 3, 3, 3);
                for (k = Math.ceil((cam + a) / POST); k * POST - cam < b; k++) { px = k * POST - cam; if (k * POST < COVER[0] + 20 || k * POST > COVER[1] - 10) continue; post("#6a4a2e", px - 2, 6, 4, 141); g.r("#5a3a22", px - 8, 6, 16, 2); }
      } else if (sty === "halt") {
        /* a little wooden shelter by the first bench */
        g = g0; g.r("#6a4a2e", a, 92, b - a, 4); g.p(E.snowy ? "#f2f5f8" : "#5a4a3a", [a - 6, 94, a + 10, 80, b - 10, 80, b + 6, 94]); g.r("#7a5a3a", a + 2, 96, 3, 51); g.r("#7a5a3a", b - 5, 96, 3, 51); g.r(dk("#7a5a3a", 0.1), a + 2, 96, b - a - 4, 30);
        for (q = a + 4; q < b - 6; q += 4) g.r(dk("#7a5a3a", 0.2), q, 96, 1, 30);
      } else if (sty === "seaside") {
        g = g0; for (k = 0; k < 8; k++) g.r(k % 2 ? "#f4efe2" : ink, a + k * (b - a) / 8, 96, (b - a) / 8 + 1, 6);
      }
      /* bunting at the seaside in summer, strung from lamp to lamp */
      g = g0; if (sty === "seaside" && (E.season === "summer" || E.season === "spring") && !E.wet) for (var bx = Math.floor(cam / 200) * 200 + 100; bx - cam < Wc + 200; bx += 200) { var x1b = bx - cam, x2b = bx + 200 - cam; for (var s2 = 0; s2 < 14; s2++) { var u = s2 / 14, xx = x1b + (x2b - x1b) * u, yy = 22 + Math.sin(u * Math.PI) * 9; g.p(["#e85a4a", "#f2c94c", "#4a8ae8", "#f4efe2", "#5ab86a"][s2 % 5], [xx, yy, xx + 5, yy, xx + 2.5, yy + 5]); } }
    }
    function lamp(g, cx, x, oy, t) {
      var on = E.lit;
      if (sty === "seaside") { g.r("#e8e4dc", x - 1, 20, 3, 127); g.r("#e8e4dc", x - 4, 144, 9, 3); g.r("#e8e4dc", x - 5, 20, 11, 2); g.e(on ? "#fff2c0" : "#f0ece0", x - 4, 24, 2.5, 3); g.e(on ? "#fff2c0" : "#f0ece0", x + 5, 24, 2.5, 3); }
      else if (sty === "adobe" || sty === "halt" && E.b !== "lake") { g.r("#3a3a3a", x - 1, 40, 2, 107); g.r("#3a3a3a", x - 1, 40, 8, 1); g.r("#3a3a3a", x + 6, 40, 1, 4); g.e(on ? "#ffe0a0" : "#d8d0b8", x + 6.5, 46, 3, 2, Math.PI, 0); g.L(on ? "#ffe8b0" : E.tone("#c8c0a8", 0), x + 5, 46, 3, 1); }
      else { g.r("#2a2a30", x - 1, 30, 2, 117); g.r("#2a2a30", x - 3, 143, 6, 4); g.r("#2a2a30", x - 3, 26, 6, 4); g.L(on ? "#ffe6a8" : E.tone("#d8d4c8", 0), x - 2, 22, 4, 4); g.r("#2a2a30", x - 3, 20, 6, 2); if (E.snowy) g.r("#f2f5f8", x - 3, 19, 6, 1); }
      if (on) { cx.fillStyle = "rgba(255,215,140,.10)"; cx.beginPath(); cx.moveTo(x - 3, oy + 26); cx.lineTo(x - 30, oy + 150); cx.lineTo(x + 30, oy + 150); cx.lineTo(x + 3, oy + 26); cx.fill(); cx.fillStyle = "rgba(255,215,140,.12)"; cx.beginPath(); cx.ellipse(x, oy + 150, 26, 4, 0, 0, 7); cx.fill(); }
    }
    function deco(g, d, x, t) {
      var b = 147;
      switch (d.k) {
        case "vend": case "vend2": var vc = d.k === "vend" ? "#c8302a" : "#2a6ab8"; g.r(vc, x - 12, b - 38, 24, 38); g.r(dk(vc, 0.2), x - 12, b - 6, 24, 6); g.L(E.lit ? "#f4fbff" : E.tone("#e8eef0", 0), x - 9, b - 34, 18, 16); for (var i = 0; i < 8; i++) g.r(pk(seed("v" + i + d.k), ["#e8c84a", "#5ab86a", "#e85a4a", "#4a8ae8", "#f4efe2", "#8a5a34"]), x - 8 + (i % 4) * 4, b - 32 + ((i / 4) | 0) * 7, 3, 4); g.r("#2a2a2e", x - 6, b - 12, 12, 3); break;
        case "bin": g.r("#5a6068", x - 4, b - 12, 8, 12); g.r("#3a3e44", x - 5, b - 13, 10, 2); break;
        case "trolley": g.r("#4a4a4e", x - 14, b - 6, 28, 2); g.r("#4a4a4e", x + 14, b - 16, 2, 12); g.r("#8a5a3a", x - 12, b - 14, 12, 8); g.r("#2a3a5a", x, b - 12, 10, 6); g.r("#c8a06a", x - 10, b - 19, 8, 5); g.r("#2a2a2a", x - 12, b - 3, 4, 3); g.r("#2a2a2a", x + 8, b - 3, 4, 3); break;
        case "basket": g = api(g.cx, E, 0, cam_oy - LIFT); g.r("#2a2a2e", x, 10, 1, 16); g.e("#6a4a2e", x + 0.5, 28, 6, 3); g.e(E.season === "autumn" ? "#c8803a" : "#3f7a4a", x + 0.5, 26, 7, 4); for (i = 0; i < 6; i++) g.r(["#e85a6a", "#f2c94c", "#a86ad8", "#f4efe2"][i % 4], x - 5 + i * 2, 24 + (i % 2) * 3, 1, 1); g.r("#3f7a4a", x - 4, 29, 1, 4); g.r("#3f7a4a", x + 4, 29, 1, 5); break;
        case "logs": for (i = 0; i < 3; i++) for (var j = 0; j < 4 - i; j++) { g.e("#8a5a3a", x - 9 + j * 6 + i * 3, b - 3 - i * 5, 3, 3); g.e("#c89a6a", x - 9 + j * 6 + i * 3, b - 3 - i * 5, 1.6, 1.6); } if (E.snowy) g.r("#f2f5f8", x - 4, b - 15, 8, 2); break;
        case "sledge": g.r("#8a3a2a", x - 10, b - 6, 20, 3); g.r("#3a3a3a", x - 11, b - 2, 22, 1); g.r("#3a3a3a", x - 8, b - 4, 1, 2); g.r("#3a3a3a", x + 7, b - 4, 1, 2); g.r("#3a3a3a", x + 10, b - 4, 2, 1); break;
        case "milk": g.r("#a8aab0", x - 4, b - 12, 8, 12); g.r("#c8ccd0", x - 3, b - 15, 6, 3); g.r("#a8aab0", x + 6, b - 10, 7, 10); g.r("#c8ccd0", x + 7, b - 12, 5, 2); break;
        case "buoy": g.e("#e85a4a", x, b - 10, 8, 8); g.e("#f4efe2", x, b - 10, 5, 5); g.e("#e85a4a", x, b - 10, 3, 3); g.r("#5a4a3a", x - 1, b - 20, 2, 3); break;
        case "tower": g.r("#5a3a22", x - 12, b - 40, 2, 40); g.r("#5a3a22", x + 10, b - 40, 2, 40); g.r("#5a3a22", x - 12, b - 22, 24, 1); g.r("#6a4a2e", x - 16, b - 66, 32, 26); for (i = 0; i < 32; i += 4) g.r("#5a3a22", x - 16 + i, b - 66, 1, 26); g.p("#4a3020", [x - 18, b - 66, x, b - 76, x + 18, b - 66]); g.r("#3a3a3a", x + 12, b - 46, 2, 10); break;
        case "cactus": g.r("#7a5a3a", x - 6, b - 6, 12, 6); tree(g, "saguaro", x, b - 6, 16, Math.random, E); break;
        case "barrel": g.e("#7a5232", x, b - 7, 6, 7); g.r("#3a3a3a", x - 6, b - 10, 12, 1); g.r("#3a3a3a", x - 6, b - 4, 12, 1); break;
        case "pot": g.e("#3a5a7a", x, b - 6, 7, 6); g.r("#e8e4dc", x - 6, b - 7, 12, 2); tree(g, "bamboo", x, b - 10, 22, Math.random, E); break;
        case "bike": var bkc = "#2a2a2e";
          g.e(bkc, x - 8, b - 6, 6, 6); g.e(E.tone(FLOOR, 0), x - 8, b - 6, 5, 5); g.e(bkc, x + 8, b - 6, 6, 6); g.e(E.tone(FLOOR, 0), x + 8, b - 6, 5, 5); g.p("#2f6a8a", [x - 8, b - 6, x - 2, b - 15, x + 6, b - 15, x + 8, b - 6, x + 6, b - 6, x + 1, b - 13, x - 1, b - 13, x - 6, b - 6]); g.r("#3a2a1e", x - 5, b - 17, 5, 2); g.r(bkc, x + 5, b - 19, 4, 1); g.r("#c8a06a", x + 3, b - 15, 6, 4); break;
        case "screen": g.r("#3a3e44", x - 1, b - 40, 2, 40); g.r("#1a1a1e", x - 18, b - 56, 36, 18); g.L(E.tone("#4ab0ff", -1), x - 16, b - 54, 32, 14); g.L("#e8f4ff", x - 14, b - 51, 14, 1); g.L("#e8f4ff", x - 14, b - 48, 22, 1); g.L("#ffd27a", x - 14, b - 45, 10, 1); break;
      }
    }
    var cam_ = 0, cam_oy = 0, LIFT = 0, VLIFT = 0;
    /* the things you can use, in the platform's style */
    function item(g, cx, it, x, oy, t, P, clockHM) {
      var b = 147, ink2 = ink, i, gH = api(cx, E, 0, oy - LIFT);
      if (it.k === "sign") {
        if (sty === "jp") { var kanji = st.jp || st.name, roma = /^[\x00-\x7f]+$/.test(st.name) ? st.name : st.sub || "";
          g.r("#9a9ea2", x - 28, 30, 2, 40); g.r("#9a9ea2", x + 26, 30, 2, 40); g.r("#2a2a2e", x - 31, 70, 62, 2);
          g.r("#f6f6f2", x - 32, 30, 64, 30); g.r("#2a2a2e", x - 32, 30, 64, 1); g.r("#2a5aa8", x - 32, 54, 64, 6);
          g.t("#1a1a1a", kanji.length > 7 ? kanji.slice(0, 7) : kanji, x, 44, "bold 11px 'Hiragino Sans','Noto Sans CJK JP','Noto Sans JP',sans-serif"); g.t("#3a3a3a", roma.length > 18 ? roma.slice(0, 17) + "…" : roma, x, 52, "7px VT323, monospace"); g.t("#ffffff", "◀   ▶", x, 59, "6px VT323, monospace"); }
        else if (sty === "uk") { g.r("#2a2a2e", x - 26, 40, 2, 107); g.r("#2a2a2e", x + 24, 40, 2, 107); g.r(ink2, x - 34, 36, 68, 18); g.r("#f4efe0", x - 32, 38, 64, 14); g.t("#1a1a1a", fit(st.name, 14), x, 49, "10px VT323, monospace"); }
        else if (sty === "chalet") { g.r("#5a3820", x - 24, 40, 2, 107); g.r("#5a3820", x + 22, 40, 2, 107); g.r("#c89a62", x - 32, 34, 64, 16); g.r("#a87a48", x - 32, 48, 64, 2); g.r("#e0b880", x - 32, 34, 64, 1); g.t("#3a2414", fit(st.name, 14), x, 45, "10px VT323, monospace"); if (E.snowy) g.r("#f2f5f8", x - 32, 33, 64, 2); }
        else if (sty === "halt" || sty === "seaside") { g.r("#2a2a2e", x - 20, 112, 2, 35); g.r("#2a2a2e", x + 18, 112, 2, 35); g.r(sty === "seaside" ? ink2 : "#f4f0e6", x - 30, 98, 60, 16); g.r("#1a1a1e", x - 30, 98, 60, 1); g.t(sty === "seaside" ? "#ffffff" : "#1a1a1a", fit(st.name, 13), x, 109, "10px VT323, monospace"); if (E.snowy) g.r("#f2f5f8", x - 30, 97, 60, 2); }
        else if (sty === "adobe") { g.r("#5a3a22", x - 22, 108, 3, 39); g.r("#5a3a22", x + 19, 108, 3, 39); g.r("#c89a62", x - 30, 96, 60, 14); for (i = 0; i < 3; i++) g.r("#a87a48", x - 30, 99 + i * 4, 60, 1); g.t("#3a2414", fit(st.name.toUpperCase(), 13), x, 106, "9px VT323, monospace"); }
        else if (sty === "hutong" || sty === "jiangnan") { g = gH; g.r("#a8302a", x - 30, 30, 60, 20); g.r("#1a1414", x - 27, 33, 54, 14); g.t("#e8c84a", fit(st.name, 8), x, 44, "10px 'Noto Sans CJK SC','PingFang SC',sans-serif"); g.r("#2a2420", x - 20, 12, 1, 18); g.r("#2a2420", x + 20, 12, 1, 18); }
        else if (sty === "modern") { g = gH; g.r("#2a2e34", x - 30, 22, 60, 22); g.r("#2a5aa8", x - 30, 40, 60, 4); var cn = st.name, en = (st.sub || "").split("·")[0].trim(); g.t("#ffffff", fit(cn, 9), x, 33, "10px 'Noto Sans CJK SC','PingFang SC',sans-serif"); g.t("#c8d4e0", fit(en, 16), x, 39, "6px VT323, monospace"); g.r("#2a2e34", x - 1, 6, 2, 16); }
        else { g = gH; g.r("#2a2a30", x - 21, 6, 1, 16); g.r("#2a2a30", x + 21, 6, 1, 16); g.r(ink2, x - 30, 22, 60, 16); g.r("#f4efe2", x - 30, 22, 60, 1); g.r("#f4efe2", x - 30, 37, 60, 1); g.t("#ffffff", fit(st.name, 15), x, 33, "10px VT323, monospace"); }
      } else if (it.k === "clock") {
        var hm = clockHM(), a1 = (hm[0] % 12 + hm[1] / 60) / 12 * Math.PI * 2, a2 = hm[1] / 60 * Math.PI * 2, cy = 30, rad = 8, swiss = E.L === "ch";
        if (!/halt|seaside|adobe/.test(sty)) { g = gH; oy -= LIFT; }
        if (sty === "modern" || (sty === "jp" && E.L !== "jp" && !st.jp)) { g.r("#2a2a2e", x - 1, 6, 2, 18); g.r("#1a1a1e", x - 14, 24, 28, 11); g.t("#ff9a3a", ("0" + hm[0]).slice(-2) + ":" + ("0" + hm[1]).slice(-2), x, 33, "10px VT323, monospace"); return; }
        if (sty === "halt" || sty === "seaside" || sty === "adobe") { g.r("#2a2a2e", x - 1, 40, 2, 107); cy = 36; }
        else g.r("#2a2a30", x, 6, 1, 16);
        if (sty === "shed" || sty === "uk") { rad = 10; cy = 32; g.e("#2a2a30", x + 0.5, cy, rad + 2, rad + 2); }
        g.e("#f6f2e6", x + 0.5, cy, rad, rad); cx.strokeStyle = E.tone("#2a2a30", 0); cx.lineWidth = 1;
        for (i = 0; i < 12; i++) { var ta = i / 12 * Math.PI * 2; g.r("#2a2a30", x + 0.5 + Math.sin(ta) * (rad - 2), cy - Math.cos(ta) * (rad - 2), 1, 1); }
        cx.lineWidth = swiss ? 1.6 : 1; cx.beginPath(); cx.moveTo(x + 0.5, oy + cy); cx.lineTo(x + 0.5 + Math.sin(a1) * rad * 0.5, oy + cy - Math.cos(a1) * rad * 0.5); cx.moveTo(x + 0.5, oy + cy); cx.lineTo(x + 0.5 + Math.sin(a2) * rad * 0.8, oy + cy - Math.cos(a2) * rad * 0.8); cx.stroke();
        if (swiss) { var sa = (Date.now() / 1000 % 60) / 60 * Math.PI * 2; cx.strokeStyle = "#c8302a"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x + 0.5, oy + cy); cx.lineTo(x + 0.5 + Math.sin(sa) * (rad - 2), oy + cy - Math.cos(sa) * (rad - 2)); cx.stroke(); cx.fillStyle = "#c8302a"; cx.beginPath(); cx.arc(x + 0.5 + Math.sin(sa) * (rad - 3), oy + cy - Math.cos(sa) * (rad - 3), 1.4, 0, 7); cx.fill(); }
      } else if (it.k === "bench") {
        var bc = { jp: "#2a6ab8", modern: "#9aa0a8", shed: "#7a4a2a", uk: "#7a4a2a", hutong: "#a8302a", jiangnan: "#5a3a2a" }[sty] || "#7a5232", fc = { jp: "#8a8e92", modern: "#6a7078", uk: ink2, shed: "#2d3a45" }[sty] || dk(bc, 0.3);
        if (sty === "jp") { for (i = 0; i < 4; i++) { g.r(i % 2 ? "#e8643a" : bc, x - 18 + i * 9, 138, 8, 3); g.r(i % 2 ? "#e8643a" : bc, x - 18 + i * 9, 130, 8, 6); } g.r(fc, x - 18, 141, 36, 2); g.r(fc, x - 14, 143, 2, 4); g.r(fc, x + 12, 143, 2, 4); }
        else { g.r(bc, x - 18, 138, 36, 2); g.r(lt(bc, 0.12), x - 18, 138, 36, 1); g.r(bc, x - 18, 131, 36, 2); g.r(bc, x - 18, 134, 36, 2); g.r(fc, x - 17, 131, 2, 16); g.r(fc, x + 15, 131, 2, 16); g.r(fc, x - 18, 145, 4, 2); g.r(fc, x + 14, 145, 4, 2); if (E.snowy && !covered(it.x)) g.r("#f2f5f8", x - 18, 137, 36, 1); }
        if (it.cat && P.cat && window.FBWorld && FBWorld.drawPet) FBWorld.drawPet(cx, P.cat, x + 8, oy + 138, 1, { asleep: !P.sit });
        if (it.dog && P.dog && window.FBWorld && FBWorld.drawPet) FBWorld.drawPet(cx, "mantou", x + 26, oy + 148, 1, { asleep: E.night });
      } else if (it.k === "kiosk") kiosk(g, cx, x, oy, t);
      else if (it.k === "board") {
        var bw = 52, bh = 30, bx0 = x - 26, by0 = 98, led = sty === "uk" ? "#ffa030" : sty === "jp" || sty === "modern" ? "#5aff8a" : "#ffd27a";
        if (sty === "halt" || sty === "adobe") { g.r("#5a3a22", x - 20, 126, 2, 21); g.r("#5a3a22", x + 18, 126, 2, 21); g.r("#7a5232", bx0 - 2, by0 - 2, bw + 4, bh + 4); g.r("#2a3430", bx0, by0, bw, bh); for (i = 0; i < 4; i++) { g.L(E.tone("#e8e4da", 0), bx0 + 4, by0 + 5 + i * 6, 18 + (i * 7 % 13), 1); g.L(E.tone("#e8e4da", 0), bx0 + 34, by0 + 5 + i * 6, 10, 1); } g.r("#e8e4da", bx0 + 2, by0 + bh - 2, 6, 1); return; }
        g.r("#2a2a30", x - 18, 128, 2, 19); g.r("#2a2a30", x + 16, 128, 2, 19); g.r("#141418", bx0, by0, bw, bh); g.r("#2a2a30", bx0, by0, bw, 2);
        for (var rr = 0; rr < 4; rr++) for (var c2 = 0; c2 < 10; c2++) if ((c2 * 7 + rr * 3 + ((Date.now() / 700) | 0)) % 5) g.L(rr === 0 ? lt(led, 0.3) : led, bx0 + 4 + c2 * 4.6, by0 + 5 + rr * 6, 3, 2);
      } else if (it.k === "plant") {
        if (sty === "adobe") { g.r("#a8603a", x - 8, b - 10, 16, 10); tree(g, "saguaro", x, b - 10, 18, Math.random, E); }
        else if (sty === "jp" || sty === "hutong" || sty === "jiangnan") { g.r("#3a3e44", x - 8, b - 8, 16, 8); g.r("#5a3a22", x - 1, b - 18, 2, 10); g.e("#3f6a3a", x - 4, b - 20, 6, 3); g.e("#4a7a42", x + 4, b - 23, 6, 3); }
        else { g.r("#7a5a3a", x - 10, b - 10, 20, 10); g.r(dk("#7a5a3a", 0.2), x - 10, b - 10, 20, 1); var fcs = E.season === "winter" ? ["#3f6a3a"] : E.season === "autumn" ? ["#c8803a", "#e8a83a", "#a8402a"] : ["#e85a6a", "#f2c94c", "#f4efe2", "#a86ad8"];
          for (var p = 0; p < 7; p++) { g.r("#3f7a4a", x - 8 + p * 2.6, b - 17 + (p % 2) * 2, 1, 7); g.r(fcs[p % fcs.length], x - 9 + p * 2.6, b - 19 + (p % 2) * 2, 3, 3); } if (E.snowy) g.r("#f2f5f8", x - 10, b - 11, 20, 1); }
      } else if (it.k === "exit") {
        var lbl = it.ex.map(o.pname).join(" · "); cx.font = "9px VT323, monospace"; var tw = Math.max(44, Math.ceil(cx.measureText(lbl).width) + 18);
        g.r("#3a3a40", x - 1, 96, 3, 51); g.r("#2e6a4a", x - tw / 2, 92, tw, 16); g.r("rgba(255,255,255,.22)", x - tw / 2, 92, tw, 1); g.t("#ffffff", lbl + " ›", x, 103, "9px VT323, monospace");
        g.r("#3a3632", x + 26, 124, 44, 23); for (var sx = 0; sx < 5; sx++) { g.r("#7a766f", x + 28 + sx * 8, 126 + sx * 4, 40 - sx * 8, 1); g.r("#57524c", x + 28 + sx * 8, 127 + sx * 4, 40 - sx * 8, 3); }
        g.r("#c9b48a", x + 24, 116, 2, 31); g.r("#c9b48a", x + 24, 116, 46, 1); g.r("#c9b48a", x + 68, 116, 2, 31);
      }
    }
    function fit(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
    /* where you get a drink: a vending machine in Japan, a café counter, a tea kiosk, a hut… */
    var keeper = folk(seed(st.name + "keeper"), E, { age: "adult", noCase: 1 }); keeper.cas = keeper.pack = keeper.bag = keeper.hold = keeper.umb = keeper.skis = keeper.board = keeper.rod = keeper.brief = null; keeper.outer = null; keeper.hat = sty === "hutong" ? null : keeper.hat;
    function kiosk(g, cx, x, oy, t) {
      var b = 147, i;
      if (sty === "jp") { var vc = "#e8e4dc"; g.r(vc, x - 14, b - 40, 28, 40); g.r("#c8302a", x - 14, b - 40, 28, 4); g.L(E.lit ? "#f4fbff" : E.tone("#dfe8ee", 0), x - 11, b - 34, 22, 18); for (i = 0; i < 10; i++) g.r(["#8a5a34", "#e8c84a", "#5ab86a", "#e85a4a", "#4a8ae8"][i % 5], x - 10 + (i % 5) * 4, b - 32 + ((i / 5) | 0) * 8, 3, 5); g.r("#2a2a2e", x - 8, b - 12, 16, 4); g.r("#c8302a", x + 8, b - 22, 3, 4); return; }
      var roof, wall, aw, sign = null;
      if (sty === "shed") { wall = "#2d3a45"; aw = ["#c8302a", "#f4efe2"]; sign = "CAFÉ"; }
      else if (sty === "uk") { wall = "#2e5a3a"; aw = [ink, "#efe8d4"]; sign = "TEA"; }
      else if (sty === "modern") { wall = "#e8ecef"; aw = ["#2a6ab8", "#2a6ab8"]; }
      else if (sty === "chalet") { wall = "#6a4428"; aw = null; roof = E.snowy ? "#f2f5f8" : "#4a3828"; }
      else if (sty === "seaside") { wall = "#efe9dc"; aw = ["#e85a6a", "#f4efe2"]; }
      else if (sty === "adobe") { wall = "#c98a5a"; aw = ["#c8302a", "#e8c84a", "#2a6ab8", "#f4efe2"]; }
      else if (sty === "hutong" || sty === "jiangnan") { wall = sty === "jiangnan" ? "#ece9e2" : "#8a8a88"; aw = null; roof = "#3a3e40"; }
      else { wall = "#7a5a3a"; aw = null; roof = "#5a4a3a"; }
      g.r(wall, x - 24, b - 42, 48, 42); g.r(dk(wall, 0.15), x + 22, b - 42, 2, 42);
      g.r("#2a1d14", x - 18, b - 36, 36, 18); g.L(E.lit ? "#ffd98a" : E.tone("#f1e2c2", 0), x - 17, b - 35, 34, 16);
      g.r("#7a5a3a", x - 13, b - 31, 26, 1); for (i = 0; i < 5; i++) g.r(["#f4efe2", "#8a5a34", "#c8452e", "#2c6e8a", "#e8c84a"][i], x - 12 + i * 5, b - 34, 3, 3);
      stamp(cx, keeper, x + 2, oy + b - 10, { face: 1 });
      g.r(dk(wall, 0.2), x - 24, b - 19, 48, 3); g.r(wall, x - 24, b - 16, 48, 16); g.r(dk(wall, 0.25), x - 20, b - 12, 40, 1);
      g.r("#f4efe2", x - 15, b - 23, 4, 4); g.r("#8a5a34", x - 15, b - 23, 4, 1);
      if (sty === "hutong" || sty === "jiangnan") { g.e("#c8b88a", x + 13, b - 22, 5, 2); g.r("#c8b88a", x + 8, b - 25, 10, 3); g.e("#d8c89a", x + 13, b - 26, 5, 1.5); for (var s = 0; s < 3; s++) { var a = ((t * 0.4 + s / 3) % 1); g.cx.fillStyle = "rgba(240,240,244," + (0.4 * (1 - a)) + ")"; g.cx.beginPath(); g.cx.arc(x + 13 + Math.sin(a * 5 + s) * 2, oy + b - 28 - a * 14, 1 + a * 2, 0, 7); g.cx.fill(); } }
      if (aw) { for (i = 0; i < 8; i++) g.r(aw[i % aw.length], x - 26 + i * 6.5, b - 48, 6.5, 6); for (i = 0; i < 8; i++) g.p(aw[i % aw.length], [x - 26 + i * 6.5, b - 42, x - 26 + i * 6.5 + 3.25, b - 40, x - 26 + i * 6.5 + 6.5, b - 42]); }
      else { g.p(roof, [x - 30, b - 42, x - 20, b - 54, x + 20, b - 54, x + 30, b - 42]); if (sty === "hutong" || sty === "jiangnan") { g.r(roof, x - 32, b - 44, 3, 2); g.r(roof, x + 29, b - 44, 3, 2); g.e(E.lit ? "#ff5a3a" : "#c8302a", x - 20, b - 36, 3, 4); g.e(E.lit ? "#ff5a3a" : "#c8302a", x + 20, b - 36, 3, 4); } }
      if (sign) { g.r("#1a1a1e", x - 12, b - 56, 24, 8); g.t("#f4efe2", sign, x, b - 50, "8px VT323, monospace"); }
      if (E.lit) { g.cx.fillStyle = "rgba(255,210,140,.10)"; g.cx.beginPath(); g.cx.ellipse(x, oy + b + 4, 34, 5, 0, 0, 7); g.cx.fill(); }
    }

    /* ---------- in front of everyone: rain and snow where it's open, fog, lightning ---------- */
    var flash = 0;
    function front(cx, Wc, Hc, oy, cam, t) {
      if (E.wet || E.snowing) {
        cx.fillStyle = E.snowing ? "rgba(255,255,255,.92)" : "rgba(200,215,230,.5)";
        for (var i = 0; i < drops.length; i++) { var d = drops[i], wx = E.snowing ? Math.sin(t * 0.8 + d[1] * 9) * 6 : -t * 40 * d[2];
          var x = ((d[0] * (Wc + 40) + wx) % (Wc + 40) + Wc + 40) % (Wc + 40) - 20, y = ((d[1] * (Hc + 20) + t * (E.snowing ? 16 : 190) * d[2]) % (Hc + 20)) - 10;
          if (y > oy + 116 && covered(x + cam)) continue; if (y > oy - 10 && y < oy + 14 && covered(x + cam) && /shed|jp|modern|uk|hutong|jiangnan/.test(sty)) continue;
          if (E.snowing) cx.fillRect(x | 0, y | 0, d[2] > 1.2 ? 2 : 1, d[2] > 1.2 ? 2 : 1); else cx.fillRect(x | 0, y | 0, 1, 3 + (d[2] * 2 | 0)); }
        if (E.wx === "storm") { if (Math.random() < 0.003) flash = t; if (t - flash < 0.12) { cx.fillStyle = "rgba(255,255,255,.35)"; cx.fillRect(0, 0, Wc, Hc); } }
      }
      if (pts.length) { cx.fillStyle = E.season === "spring" ? "#fbd0dc" : "#d8902a"; pts.forEach(function (p) { var x = ((p[0] * (Wc + 40) + t * 9 + Math.sin(t + p[2] * 9) * 10) % (Wc + 40) + Wc + 40) % (Wc + 40) - 20, y = ((p[1] * (Hc + 10) + t * 12 * (0.6 + p[2])) % (Hc + 10)); cx.fillRect(x | 0, y | 0, 1, 1); }); }
      if (E.fog) { cx.fillStyle = "rgba(225,230,236,.12)"; cx.fillRect(0, oy, Wc, Hc - oy); }
      if (E.night) { var v = cx.createRadialGradient(Wc / 2, oy + 140, 40, Wc / 2, oy + 140, Math.max(Wc, 200)); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,10,.28)"); cx.fillStyle = v; cx.fillRect(0, 0, Wc, Hc); }
    }

    /* each person is drawn once per pose into a little sprite with a soft dark outline, then stamped */
    var OUTL = E.night ? "rgba(6,6,14,.7)" : "rgba(24,18,22,.5)";
    function sprite(f, o) {
      var key = (o.frame || 0) + "|" + (o.face || 1) + "|" + (o.sit ? 1 : 0) + "|" + (o.open ? 1 : 0), c = f._spr || (f._spr = {});
      if (c[key]) return c[key];
      var W2 = 48, H2 = 64, ox = 24, oy2 = 56, a = document.createElement("canvas"); a.width = W2; a.height = H2;
      person(a.getContext("2d"), E, f, ox, oy2, { frame: o.frame, face: o.face, sit: o.sit ? oy2 - 8 : null, open: o.open, noShadow: 1 });
      var out = document.createElement("canvas"); out.width = W2; out.height = H2; var q = out.getContext("2d");
      q.drawImage(a, -1, 0); q.drawImage(a, 1, 0); q.drawImage(a, 0, -1); q.drawImage(a, 0, 1);
      q.globalCompositeOperation = "source-in"; q.fillStyle = OUTL; q.fillRect(0, 0, W2, H2); q.globalCompositeOperation = "source-over"; q.drawImage(a, 0, 0);
      return (c[key] = { c: out, ox: ox, oy: oy2 });
    }
    function stamp(cx, f, x, y, o) {
      x = Math.round(x); y = Math.round(y);
      cx.fillStyle = "rgba(0,0,0," + (E.night ? 0.25 : 0.16) + ")"; cx.fillRect(x - 5, y, 11, 1); cx.fillRect(x - 3, y + 1, 7, 1);
      var s2 = sprite(f, o); cx.drawImage(s2.c, x - s2.ox, y - s2.oy);
      if (E.night && f.hold === "phone" && !(o.open && f.umb)) { cx.fillStyle = "rgba(180,220,255,.14)"; cx.fillRect(x + (o.face < 0 ? -6 : 1), y - 30, 5, 10); }
    }
    /* ---------- the people on the platform: they wait, read, pace, sit, and come and go with the trains ---------- */
    var rp = seed(st.name + "|" + new Date().toDateString() + "|" + E.tod), crowd = [];
    var busy = { jp: 7, shed: 7, modern: 7, uk: 5, hutong: 5, jiangnan: 5, chalet: 4, seaside: 4, adobe: 3, halt: 3 }[sty] || 4;
    if (E.night) busy = Math.ceil(busy * 0.45); else if (E.dawn) busy = Math.ceil(busy * 0.7); if (E.wet) busy = Math.ceil(busy * 0.8);
    function spawn(o2) {
      var f = folk(rp, E, { view: key, age: o2.age, noCase: o2.noCase });
      var p = { f: f, x: o2.x, y: o2.y || (rp() < 0.5 ? 143 + rp() * 6 : 156 + rp() * 6), face: o2.face || (rp() < 0.5 ? -1 : 1), mode: o2.mode || "wait", step: 0, t: rp() * 9, to: o2.to, v: f.walk, sit: o2.sit, look: o2.look };
      if (f.age === "kid") p.v *= 0.8; if (f.age === "old") p.v *= 0.6; crowd.push(p); return p;
    }
    function populate(items) {
      var benches = items.filter(function (it) { return it.k === "bench"; }), used = {};
      for (var i = 0; i < busy; i++) {
        var q = rp(), x = 220 + rp() * (W - 520);
        if (q < 0.2 && benches.length) { var bn = benches[(rp() * benches.length) | 0]; if (!used[bn.x]) { used[bn.x] = 1; spawn({ x: bn.x - 10, y: 147, mode: "sit", sit: 139, face: 1 }); continue; } }
        if (q < 0.35) { var a = spawn({ x: x, face: 1, mode: "chat" }), b2 = spawn({ x: x + 11, y: a.y + 1, face: -1, mode: "chat", age: rp() < 0.25 ? "kid" : null }); continue; }
        if (q < 0.5) { spawn({ x: x, mode: "pace", to: x + (rp() < 0.5 ? -1 : 1) * (60 + rp() * 120) }); continue; }
        spawn({ x: x });
      }
    }
    function nearestDoor(T, x, nc, CL, GAP) { var best = null, bd = 1e9; for (var c = 0; c < nc; c++) { var d = T.x + c * (CL + GAP) + CL - 21; if (Math.abs(d - x) < bd) { bd = Math.abs(d - x); best = d; } } return best; }
    var lastStop = null;
    function update(dt, P, nc, CL, GAP) {
      var T = P.train, stopped = T && T.mode === "stopped";
      /* a train has just stopped: people get off, and some who were waiting get on */
      if (stopped && lastStop !== T) {
        lastStop = T; var n = 1 + ((rp() * (busy > 4 ? 4 : 2)) | 0);
        for (var i = 0; i < n; i++) { var c = (rp() * nc) | 0, dx0 = T.x + c * (CL + GAP) + CL - 21; if (T.mine && Math.abs(dx0 - P.x) < 20) continue; spawn({ x: dx0, y: 146 + rp() * 14, face: -1, mode: "leave", to: -60, noCase: false }); }
        if (!T.mine) crowd.forEach(function (p) { if ((p.mode === "wait" || p.mode === "pace") && p.x > T.x && p.x < T.x + T.len && rp() < 0.6) { p.mode = "board"; p.to = nearestDoor(T, p.x, nc, CL, GAP); p.delay = 0.6 + rp() * 2.5; } });
      }
      if (!stopped) lastStop = null;
      /* now and then someone arrives to wait */
      if (crowd.length < busy && rp() < dt * 0.05) spawn({ x: -20, face: 1, mode: "arrive", to: 240 + rp() * (W - 600) });
      for (var j = crowd.length - 1; j >= 0; j--) {
        var p = crowd[j];
        if (p.delay > 0) { p.delay -= dt; continue; }
        if (p.mode === "wait" || p.mode === "chat" || p.mode === "sit") { p.t += dt; if (p.mode === "wait" && rp() < dt * 0.04) p.face = -p.face; if (p.mode === "wait" && rp() < dt * 0.01) { p.mode = "pace"; p.to = p.x + (rp() < 0.5 ? -1 : 1) * (40 + rp() * 100); } continue; }
        var goal = p.to; if (p.mode === "board" && !(T && T.mode === "stopped")) { p.mode = "wait"; continue; }
        var dx = goal - p.x; if (Math.abs(dx) < 1.5) {
          if (p.mode === "board" || p.mode === "leave") { crowd.splice(j, 1); continue; }
          p.mode = rp() < 0.5 ? "wait" : "pace"; p.to = p.x + (rp() < 0.5 ? -1 : 1) * (40 + rp() * 120); if (p.to < 200 || p.to > W - 260) p.to = 240 + rp() * (W - 600); p.step = 0; continue;
        }
        p.face = dx > 0 ? 1 : -1; var sp = p.mode === "pace" ? p.v * 0.55 : p.v; p.x += Math.sign(dx) * Math.min(Math.abs(dx), sp * dt); p.step += sp * dt;
        if (p.mode === "board" && Math.abs(dx) < 3) p.y += (140 - p.y) * Math.min(1, dt * 4);
      }
    }
    function people(cx, Wc, oy, cam, P, me, drink) {
      var list = crowd.slice(); list.push({ me: 1, x: P.x, y: P.sit ? 147 : 160, f: me });
      list.sort(function (a, b) { return a.y - b.y; });
      list.forEach(function (p) {
        var x = p.x - cam; if (x < -30 || x > Wc + 30) return;
        if (p.me) {
          var sitting = !!P.sit, fr = P.vx ? (((P.step / 5) | 0) % 4) : 0;
          stamp(cx, me, x, oy + p.y, { frame: fr, face: P.face, sit: sitting, open: !covered(P.x) });
          if (drink && drink.c && !sitting && !me.umb) { cx.fillStyle = E.tone(drink.c, 0.05); cx.fillRect(Math.round(x + (P.face > 0 ? 4 : -6)), Math.round(oy + p.y - 14), 2, 3); }
          if (P.heart && Date.now() - P.heart < 1600) { var hy = oy + 126 - (Date.now() - P.heart) / 60; cx.fillStyle = "#ff8fa0"; cx.font = "8px VT323, monospace"; cx.fillText("♥", x + 6, hy); }
          return;
        }
        var moving = p.mode === "pace" || p.mode === "arrive" || p.mode === "leave" || (p.mode === "board" && !(p.delay > 0));
        var fr2 = moving ? (((p.step / 4) | 0) % 4) : 0, face = p.face;
        if (p.mode === "chat") face = p.face;
        stamp(cx, p.f, x, oy + p.y, { frame: fr2, face: face, sit: p.mode === "sit", open: !covered(p.x) });
      });
    }

    /* the stop's own hour on the platform clock (a real city's local time, otherwise the hour the sky says) */
    var tz = null; try { tz = FBCabin.tz && FBCabin.tz(st); } catch (e) {}
    var t0 = Date.now(), base = { dawn: [6, 12], afternoon: [14, 25], sunset: [18, 4], night: [23, 37] }[E.tod] || [14, 25];
    function clockHM() {
      if (tz) { try { var h = FBCabin.hourAt(tz); if (h != null) return [Math.floor(h), Math.floor((h % 1) * 60)]; } catch (e) {} }
      var m = base[0] * 60 + base[1] + Math.floor((Date.now() - t0) / 60000); return [Math.floor(m / 60) % 24, m % 60];
    }

    return {
      E: E, style: sty, view: key, covered: covered, populate: populate, update: update, folk: function (r) { return folk(r, E, { view: key, age: "adult", noCase: 1 }); },
      draw: function (cx, Wc, Hc, oy, cam, P, me, drink, items, nc, CL, GAP, mineCar) {
        var t = (Date.now() - t0) / 1000; cam_ = cam; LIFT = Math.max(0, Math.min(44, Math.round((Hc - 200) * 0.45))); VLIFT = Math.max(0, Math.min(46, Math.round((Hc - 196) * 0.5)));
        sky(cx, Wc, Hc, oy, cam, t);
        view(cx, Wc, oy, cam, t);
        track(cx, Wc, oy, cam);
        train(cx, P.train, cam, oy, nc, CL, GAP, mineCar);
        deckBack(cx, Wc, Hc, oy, cam, t);
        var g = api(cx, E, 0, oy);
        items.forEach(function (it) { var x = it.x - cam; if (x < -90 || x > Wc + 90) return; item(g, cx, it, x, oy, t, P, clockHM); });
        people(cx, Wc, oy, cam, P, me, drink);
        front(cx, Wc, Hc, oy, cam, t);
      }
    };
  }

  /* you: the same person all ride (kept for the visit), dressed for wherever you get off */
  function me(E, st) {
    var s = null; try { s = sessionStorage.getItem("jn_me"); } catch (e) {}
    if (!s) { s = String(Math.random()); try { sessionStorage.setItem("jn_me", s); } catch (e) {} }
    var f = folk(seed("me" + s), E, { age: "adult", noCase: 1 }); f.cas = f.brief = f.skis = f.board = f.rod = f.cane = null; f.hold = null; f.bag = f.bag || null;
    return f;
  }
  window.FBPlat = { scene: scene, me: me, styleOf: styleOf, VIEW: VIEW, person: person, folk: folk };
})();
