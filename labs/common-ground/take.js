/* Take it with you: what a person made here, carried to their other device by a link, a square to scan, or a file.
   Shared by Little Things, Home Ground and Common Ground; the same file sits in each app's folder (keep the copies identical).
   Everything happens on the device: the link's payload is after the #, so no server ever sees it; the file is saved
   and opened locally; the QR code is drawn here, by the small encoder below (byte mode, error correction M or L,
   versions 1 to 25). Nothing is fetched and nothing is sent. Each app keeps its own words, look and merge. */
(function () {
"use strict";

/* ---------------- QR code ---------------- */
/* error correction codewords per block, and number of blocks, by version (index 0 unused) */
var ECC_L = [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
var BLK_L = [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25];
var ECC_M = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
var BLK_M = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
var LV = { L: { e: ECC_L, b: BLK_L, f: 1 }, M: { e: ECC_M, b: BLK_M, f: 0 } };
var MAXV = 25;

function rawModules(v) {
  var r = (16 * v + 128) * v + 64;
  if (v >= 2) { var n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
  return r;
}
function dataCodewords(v, L) { return Math.floor(rawModules(v) / 8) - L.e[v] * L.b[v]; }
function fits(len, v, L) { var bits = 4 + (v < 10 ? 8 : 16) + len * 8; return bits <= dataCodewords(v, L) * 8; }

/* Reed–Solomon over GF(256), polynomial 0x11D */
function gmul(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 255; }
function rsDivisor(d) {
  var r = []; for (var i = 0; i < d - 1; i++) r.push(0); r.push(1);
  var root = 1;
  for (var k = 0; k < d; k++) {
    for (var j = 0; j < r.length; j++) { r[j] = gmul(r[j], root); if (j + 1 < r.length) r[j] ^= r[j + 1]; }
    root = gmul(root, 2);
  }
  return r;
}
function rsRem(data, div) {
  var r = div.map(function () { return 0; });
  data.forEach(function (b) {
    var f = b ^ r.shift(); r.push(0);
    div.forEach(function (c, i) { r[i] ^= gmul(c, f); });
  });
  return r;
}

function utf8(s) { return Array.prototype.slice.call(new TextEncoder().encode(s)); }

function encode(text) {
  var bytes = utf8(text), v, L = null, ecl = "L";
  for (v = 1; v <= MAXV; v++) if (fits(bytes.length, v, LV.L)) break;
  if (v > MAXV) return null;
  L = LV.L; if (fits(bytes.length, v, LV.M)) { L = LV.M; ecl = "M"; }
  var size = v * 4 + 17, cap = dataCodewords(v, L);
  /* the bit stream: byte mode, the length, the bytes, a terminator, padding */
  var bits = [];
  function put(val, n) { for (var i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
  put(4, 4); put(bytes.length, v < 10 ? 8 : 16); bytes.forEach(function (b) { put(b, 8); });
  put(0, Math.min(4, cap * 8 - bits.length)); put(0, (8 - bits.length % 8) % 8);
  for (var pad = 0xEC; bits.length < cap * 8; pad ^= 0xEC ^ 0x11) put(pad, 8);
  var data = []; for (var i = 0; i < bits.length; i += 8) { var x = 0; for (var j = 0; j < 8; j++) x = (x << 1) | bits[i + j]; data.push(x); }
  /* blocks, error correction, interleaving */
  var nb = L.b[v], el = L.e[v], raw = Math.floor(rawModules(v) / 8), nShort = nb - raw % nb, shortLen = Math.floor(raw / nb), div = rsDivisor(el), blocks = [], k = 0;
  for (i = 0; i < nb; i++) {
    var dat = data.slice(k, k + shortLen - el + (i < nShort ? 0 : 1)); k += dat.length;
    var ec = rsRem(dat, div); if (i < nShort) dat.push(0); blocks.push(dat.concat(ec));
  }
  var cw = [];
  for (i = 0; i < blocks[0].length; i++) for (j = 0; j < nb; j++) if (i !== shortLen - el || j >= nShort) cw.push(blocks[j][i]);
  /* the grid */
  var M = [], F = [];
  for (i = 0; i < size; i++) { M.push(new Array(size).fill(false)); F.push(new Array(size).fill(false)); }
  function fn(x, y, d) { M[y][x] = d; F[y][x] = true; }
  for (i = 0; i < size; i++) { fn(6, i, i % 2 === 0); fn(i, 6, i % 2 === 0); }
  function finder(cx, cy) { for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) { var d = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx + dx, yy = cy + dy; if (xx >= 0 && xx < size && yy >= 0 && yy < size) fn(xx, yy, d !== 2 && d !== 4); } }
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
  if (v > 1) {
    var na = Math.floor(v / 7) + 2, step = v === 32 ? 26 : Math.ceil((v * 4 + 4) / (na * 2 - 2)) * 2, pos = [6];
    for (var p = size - 7; pos.length < na; p -= step) pos.splice(1, 0, p);
    for (i = 0; i < na; i++) for (j = 0; j < na; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) continue;
      for (var ay = -2; ay <= 2; ay++) for (var ax = -2; ax <= 2; ax++) fn(pos[i] + ax, pos[j] + ay, Math.max(Math.abs(ax), Math.abs(ay)) !== 1);
    }
  }
  function format(mask) {
    var d = (L.f << 3) | mask, r = d; for (var q = 0; q < 10; q++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    var b = ((d << 10) | r) ^ 0x5412, g = function (n) { return ((b >>> n) & 1) === 1; };
    for (q = 0; q <= 5; q++) fn(8, q, g(q));
    fn(8, 7, g(6)); fn(8, 8, g(7)); fn(7, 8, g(8));
    for (q = 9; q < 15; q++) fn(14 - q, 8, g(q));
    for (q = 0; q < 8; q++) fn(size - 1 - q, 8, g(q));
    for (q = 8; q < 15; q++) fn(8, size - 15 + q, g(q));
    fn(8, size - 8, true);
  }
  format(0);
  if (v >= 7) {
    var r = v; for (i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
    var vb = (v << 12) | r;
    for (i = 0; i < 18; i++) { var bt = ((vb >>> i) & 1) === 1, a = size - 11 + i % 3, c = Math.floor(i / 3); fn(a, c, bt); fn(c, a, bt); }
  }
  /* the codewords, in the zigzag */
  var bi = 0;
  for (var right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (var vert = 0; vert < size; vert++) for (j = 0; j < 2; j++) {
      var xx = right - j, up = ((right + 1) & 2) === 0, yy = up ? size - 1 - vert : vert;
      if (!F[yy][xx] && bi < cw.length * 8) { M[yy][xx] = ((cw[bi >>> 3] >>> (7 - (bi & 7))) & 1) === 1; bi++; }
    }
  }
  /* the mask with the lowest penalty */
  function maskBit(m, x, y) {
    switch (m) {
      case 0: return (x + y) % 2 === 0; case 1: return y % 2 === 0; case 2: return x % 3 === 0; case 3: return (x + y) % 3 === 0;
      case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; case 5: return x * y % 2 + x * y % 3 === 0;
      case 6: return (x * y % 2 + x * y % 3) % 2 === 0; default: return ((x + y) % 2 + x * y % 3) % 2 === 0;
    }
  }
  function applyMask(m) { for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) if (!F[y][x] && maskBit(m, x, y)) M[y][x] = !M[y][x]; }
  function penalty() {
    var s = 0, dark = 0, x, y;
    function line(get) {
      var run = 0, col = null, str = "";
      for (var q = 0; q < size; q++) { var d = get(q); str += d ? "1" : "0"; if (d === col) { run++; if (run === 5) s += 3; else if (run > 5) s++; } else { col = d; run = 1; } }
      var pat = /(?=(10111010000|00001011101))/g; while (pat.exec(str)) { s += 40; pat.lastIndex++; }
    }
    for (y = 0; y < size; y++) line(function (q) { return M[y][q]; });
    for (x = 0; x < size; x++) line(function (q) { return M[q][x]; });
    for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) { var c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) s += 3; }
    for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (M[y][x]) dark++;
    var tot = size * size; s += (Math.ceil(Math.abs(dark * 20 - tot * 10) / tot) - 1) * 10;
    return s;
  }
  var best = 0, low = Infinity;
  for (var m = 0; m < 8; m++) { applyMask(m); format(m); var pn = penalty(); if (pn < low) { low = pn; best = m; } applyMask(m); }
  applyMask(best); format(best);
  return { size: size, version: v, ecl: ecl, dark: function (x, y) { return M[y][x]; } };
}
/* an SVG of the code with its quiet border, black on white whatever the page's colours; null when it's too big for one square */
function qrSvg(text, label) {
  var q = encode(text); if (!q) return null;
  var n = q.size, d = "";
  for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.dark(x, y)) { var x0 = x; while (x + 1 < n && q.dark(x + 1, y)) x++; d += "M" + (x0 + 4) + " " + (y + 4) + "h" + (x - x0 + 1) + "v1H" + (x0 + 4) + "z"; }
  var px = (n + 8) * Math.max(2, Math.floor(264 / (n + 8)));   /* whole pixels per module, so the square stays sharp for a camera */
  return '<svg viewBox="0 0 ' + (n + 8) + " " + (n + 8) + '" width="' + px + '" height="' + px + '" shape-rendering="crispEdges" role="img"' + (label ? ' aria-label="' + String(label).replace(/[&<>"]/g, "") + '"' : "") + ' data-qr-v="' + q.version + '"><rect width="100%" height="100%" fill="#fff"/><path fill="#000" d="' + d + '"/></svg>';
}

/* ---------------- packing: JSON, deflate-raw, base64url (z…), or plain base64url JSON (j…) where the browser can't compress ---------------- */
function b64u(a) { var s = ""; for (var i = 0; i < a.length; i += 8192) s += String.fromCharCode.apply(null, a.subarray(i, i + 8192)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function unb64u(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
function pack(obj) {
  var bytes = new TextEncoder().encode(JSON.stringify(obj));
  if (!window.CompressionStream) return Promise.resolve("j" + b64u(bytes));
  return new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer()
    .then(function (b) { return "z" + b64u(new Uint8Array(b)); }).catch(function () { return "j" + b64u(bytes); });
}
function unpack(s) {
  try {
    s = String(s || ""); var bytes = unb64u(s.slice(1));
    if (s.charAt(0) === "z") return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text().then(function (x) { return JSON.parse(x); }).catch(function () { return null; });
    if (s.charAt(0) === "j") return Promise.resolve(JSON.parse(new TextDecoder().decode(bytes)));
  } catch (e) {}
  return Promise.resolve(null);
}
/* the payload, if the address holds one (#take=…); the address is cleaned at once so a reload doesn't ask again */
function fromHash() {
  var m = /[#&]take=([zj][A-Za-z0-9_-]+)/.exec(location.hash); if (!m) return null;
  try { history.replaceState(history.state, "", location.pathname + location.search); } catch (e) {}
  return unpack(m[1]);
}

/* ---------------- sending, saving, opening ---------------- */
function send(o) {   /* o: {title, text, url, done(how)}: the phone's own share sheet, else the clipboard, else a box to copy from */
  var done = o.done || function () {};
  var coarse = false; try { coarse = matchMedia("(pointer: coarse)").matches; } catch (e) {}
  if (navigator.share && coarse) return navigator.share({ title: o.title, text: o.text, url: o.url }).then(function () { done("shared"); }).catch(function () {});
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(o.url).then(function () { done("copied"); }).catch(function () { prompt("", o.url); });
  prompt("", o.url);
}
function day() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
function save(name, obj) {
  var blob = new Blob([JSON.stringify(obj, null, 1)], { type: "application/json" }), url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = name + "-" + day() + ".json"; a.rel = "noopener"; a.style.display = "none"; document.body.appendChild(a); a.click();
  setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 4000);
  return a.download;
}
function open() {   /* resolves with the parsed file, or null (not JSON, too big, or nothing chosen) */
  return new Promise(function (res) {
    var inp = document.createElement("input"); inp.type = "file"; inp.accept = ".json,application/json"; inp.style.display = "none";
    inp.addEventListener("change", function () {
      var f = inp.files && inp.files[0]; inp.remove(); if (!f) return res(undefined);
      if (f.size > 4e6) return res(null);
      var r = new FileReader(); r.onload = function () { try { res(JSON.parse(String(r.result))); } catch (e) { res(null); } }; r.onerror = function () { res(null); }; r.readAsText(f);
    });
    document.body.appendChild(inp); inp.click();
  });
}

window.FBTake = { qr: encode, qrSvg: qrSvg, pack: pack, unpack: unpack, fromHash: fromHash, send: send, save: save, open: open, MAXV: MAXV };
})();
