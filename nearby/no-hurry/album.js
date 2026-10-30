Object.assign(window.POPO_PHOTOS = window.POPO_PHOTOS || {}, (function () {
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function lin(c, x0, y0, x1, y1, st) { var g = c.createLinearGradient(x0, y0, x1, y1); st.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; }
  function rad(c, x, y, r0, r1, st) { var g = c.createRadialGradient(x, y, r0, x, y, r1); st.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; }
  function ell(c, x, y, rx, ry, col) { c.beginPath(); c.ellipse(x, y, Math.max(rx, .1), Math.max(ry, .1), 0, 0, 7); c.fillStyle = col; c.fill(); }
  function poly(c, pts, col) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fillStyle = col; c.fill(); }
  function line(c, x0, y0, x1, y1, w, col) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.lineWidth = w; c.strokeStyle = col; c.lineCap = 'round'; c.stroke(); }
  // fill a path, then shade it from light side (x0) to dark side (x1)
  function shape(c, build, col, x0, x1, dark) {
    c.save(); c.beginPath(); build(); c.fillStyle = col; c.fill(); c.clip();
    c.fillStyle = lin(c, x0, 0, x1, 0, [[0, 'rgba(255,255,255,.22)'], [.45, 'rgba(255,255,255,0)'], [1, 'rgba(0,0,0,' + (dark || .38) + ')']]);
    c.fillRect(-2000, -2000, 5000, 5000); c.restore();
  }
  function limb(c, pts, w, col, sh) {
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.lineWidth = w; c.strokeStyle = col; c.stroke();
    if (sh !== false) { c.save(); c.translate(w * .18, w * .12); c.lineWidth = w * .45; c.strokeStyle = 'rgba(0,0,0,.18)'; c.stroke(); c.restore(); }
  }
  function hand(c, x, y, r, skin) { ell(c, x, y, r, r * 1.1, skin); ell(c, x + r * .25, y + r * .3, r * .6, r * .6, 'rgba(0,0,0,.12)'); }

  // ---- a head: x,y centre, u = head height
  function head(c, x, y, u, o) {
    var rx = u * .4, ry = u * .5, skin = o.skin || '#e9bf98', hair = o.hair || '#1b1612', t = o.turn || 0, fx = t * rx * .28;
    var lk = o.look || [0, 0];
    c.save(); c.translate(x, y); c.rotate(o.tilt || 0);
    if (o.style === 'bob') {
      c.beginPath(); c.ellipse(0, -u * .06, rx * 1.22, ry * 1.04, 0, Math.PI * .92, Math.PI * 2.08);
      c.quadraticCurveTo(rx * 1.3, u * .36, rx * 1.02, u * .4); c.lineTo(-rx * 1.02, u * .4); c.quadraticCurveTo(-rx * 1.3, u * .36, -rx * 1.22, u * .02);
      c.fillStyle = hair; c.fill();
    }
    if (o.style === 'scarf') { c.beginPath(); c.ellipse(0, -u * .02, rx * 1.25, ry * 1.08, 0, Math.PI * .85, Math.PI * 2.15); c.lineTo(rx * .7, u * .55); c.lineTo(-rx * .7, u * .55); c.closePath(); c.fillStyle = o.scarf; c.fill(); }
    // ears
    if (t < .6) ell(c, -rx * .98, u * .04, rx * .14, ry * .2, skin);
    if (t > -.6) ell(c, rx * .98, u * .04, rx * .14, ry * .2, skin);
    // face
    c.beginPath(); c.moveTo(-rx, -u * .05); c.bezierCurveTo(-rx, -ry * 1.05, rx, -ry * 1.05, rx, -u * .05);
    c.bezierCurveTo(rx, u * .32, rx * .45, ry, 0 + fx * .3, ry); c.bezierCurveTo(-rx * .45, ry, -rx, u * .32, -rx, -u * .05);
    c.fillStyle = skin; c.fill();
    c.save(); c.clip();
    c.fillStyle = rad(c, -rx * .3 + fx, -u * .1, u * .05, u * .7, [[0, 'rgba(255,240,225,.35)'], [.6, 'rgba(0,0,0,0)'], [1, 'rgba(60,20,0,.35)']]); c.fillRect(-u, -u, 2 * u, 2 * u);
    ell(c, -rx * .55 + fx, u * .15, rx * .22, ry * .12, 'rgba(225,110,100,.22)'); ell(c, rx * .55 + fx, u * .15, rx * .22, ry * .12, 'rgba(225,110,100,.22)');
    c.restore();
    // eyes
    var ey = u * .02, es = u * .17, ink = '#2a1a12';
    [-1, 1].forEach(function (s) {
      var ex = s * es + fx, w = u * .075 * (1 - s * t * .25);
      if (o.eyes === 'happy') {
        c.beginPath(); c.moveTo(ex - w, ey + u * .01); c.quadraticCurveTo(ex, ey - u * .05, ex + w, ey + u * .01); c.lineWidth = u * .028; c.strokeStyle = ink; c.lineCap = 'round'; c.stroke();
        c.beginPath(); c.moveTo(ex - w * .7, ey + u * .07); c.quadraticCurveTo(ex, ey + u * .05, ex + w * .7, ey + u * .07); c.lineWidth = u * .012; c.strokeStyle = 'rgba(80,30,10,.5)'; c.stroke();
      } else {
        ell(c, ex, ey, w, u * .042, '#f4efe8');
        ell(c, ex + lk[0] * w * .45, ey + lk[1] * u * .016, u * .036, u * .037, '#3a2416');
        ell(c, ex + lk[0] * w * .45, ey + lk[1] * u * .016, u * .018, u * .018, '#0d0806');
        ell(c, ex + lk[0] * w * .45 - u * .012, ey + lk[1] * u * .016 - u * .014, u * .009, u * .009, 'rgba(255,255,255,.85)');
        c.beginPath(); c.ellipse(ex, ey + u * .004, w * 1.05, u * .046, 0, Math.PI * 1.05, Math.PI * 1.95); c.lineWidth = u * .022; c.strokeStyle = ink; c.stroke();
        if (o.crinkle) { line(c, ex + s * w * 1.1, ey + u * .01, ex + s * w * 1.4, ey - u * .015, u * .01, 'rgba(80,40,20,.5)'); line(c, ex + s * w * 1.1, ey + u * .03, ex + s * w * 1.4, ey + u * .045, u * .01, 'rgba(80,40,20,.5)'); }
      }
      // brows
      var by = ey - u * (o.brUp ? .14 : .1);
      c.beginPath(); c.moveTo(ex - w * 1.1, by + u * .02); c.quadraticCurveTo(ex, by - u * .025, ex + w * 1.15, by + u * .012 * s);
      c.lineWidth = u * (o.thick ? .045 : .026); c.strokeStyle = o.brow || hair; c.lineCap = 'round'; c.stroke();
    });
    // nose
    c.beginPath(); c.moveTo(fx + u * .01, ey + u * .02); c.quadraticCurveTo(fx + u * .045 + t * u * .04, ey + u * .13, fx + u * .02, ey + u * .16);
    c.lineWidth = u * .02; c.strokeStyle = 'rgba(110,55,30,.45)'; c.stroke();
    ell(c, fx - u * .03, ey + u * .165, u * .018, u * .01, 'rgba(90,40,20,.5)'); ell(c, fx + u * .04, ey + u * .165, u * .018, u * .01, 'rgba(90,40,20,.5)');
    // moustache
    if (o.moust) { c.beginPath(); c.moveTo(fx - u * .13, ey + u * .245); c.quadraticCurveTo(fx, ey + u * .17, fx + u * .13, ey + u * .245); c.quadraticCurveTo(fx, ey + u * .215, fx - u * .13, ey + u * .245); c.fillStyle = hair; c.fill(); }
    // mouth
    var my = ey + u * .27;
    if (o.mouth === 'laugh') {
      c.beginPath(); c.moveTo(fx - u * .11, my - u * .01); c.quadraticCurveTo(fx, my + u * .16, fx + u * .11, my - u * .01); c.quadraticCurveTo(fx, my + u * .02, fx - u * .11, my - u * .01); c.fillStyle = '#5a1e1a'; c.fill();
      c.beginPath(); c.moveTo(fx - u * .09, my); c.quadraticCurveTo(fx, my + u * .035, fx + u * .09, my); c.lineTo(fx + u * .085, my + u * .02); c.quadraticCurveTo(fx, my + u * .05, fx - u * .085, my + u * .02); c.fillStyle = '#f2ece2'; c.fill();
    } else {
      var d = o.mouth === 'smile' ? .06 : .028;
      c.beginPath(); c.moveTo(fx - u * .09, my); c.quadraticCurveTo(fx, my + u * d, fx + u * .09, my); c.lineWidth = u * .025; c.strokeStyle = '#8a3b33'; c.lineCap = 'round'; c.stroke();
      ell(c, fx, my + u * (d * .7 + .03), u * .05, u * .015, 'rgba(200,110,100,.35)');
    }
    // hair front
    if (o.style === 'bob') {
      c.beginPath(); c.moveTo(-rx * 1.06, u * .12); c.bezierCurveTo(-rx * 1.25, -ry * 1.25, rx * 1.25, -ry * 1.25, rx * 1.06, u * .12);
      c.quadraticCurveTo(rx * .95, -u * .2, rx * .3, -u * .24); c.quadraticCurveTo(-rx * .4, -u * .26, -rx * .62, -u * .38); c.quadraticCurveTo(-rx * .95, -u * .15, -rx * 1.06, u * .12);
      c.fillStyle = hair; c.fill();
      c.beginPath(); c.moveTo(-rx * .45, -ry * .92); c.quadraticCurveTo(rx * .3, -ry * 1.02, rx * .8, -u * .25); c.lineWidth = u * .03; c.strokeStyle = 'rgba(255,255,255,.22)'; c.stroke();
    } else if (o.style === 'wavy') {
      c.beginPath(); c.moveTo(-rx * 1.03, -u * .02); c.bezierCurveTo(-rx * 1.2, -ry * 1.35, rx * 1.2, -ry * 1.35, rx * 1.03, -u * .02);
      c.quadraticCurveTo(rx * .9, -u * .3, rx * .35, -u * .33); c.quadraticCurveTo(0, -u * .3, -rx * .35, -u * .34); c.quadraticCurveTo(-rx * .9, -u * .3, -rx * 1.03, -u * .02); c.fillStyle = hair; c.fill();
      for (var i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-rx * .7 + i * rx * .45, -u * .36); c.quadraticCurveTo(-rx * .5 + i * rx * .45, -u * .55, -rx * .1 + i * rx * .45, -u * .58); c.lineWidth = u * .025; c.strokeStyle = 'rgba(255,255,255,.18)'; c.stroke(); }
    } else if (o.style === 'short') {
      c.beginPath(); c.moveTo(-rx * 1.02, 0); c.bezierCurveTo(-rx * 1.15, -ry * 1.3, rx * 1.15, -ry * 1.3, rx * 1.02, 0); c.quadraticCurveTo(rx * .8, -u * .32, 0, -u * .32); c.quadraticCurveTo(-rx * .8, -u * .32, -rx * 1.02, 0); c.fillStyle = hair; c.fill();
    } else if (o.style === 'scarf') {
      c.beginPath(); c.moveTo(-rx * 1.1, u * .2); c.bezierCurveTo(-rx * 1.3, -ry * 1.35, rx * 1.3, -ry * 1.35, rx * 1.1, u * .2); c.quadraticCurveTo(rx * .9, -u * .3, 0, -u * .32); c.quadraticCurveTo(-rx * .9, -u * .3, -rx * 1.1, u * .2); c.fillStyle = o.scarf; c.fill();
      ell(c, 0, u * .5, rx * .35, u * .08, o.scarf);
    }
    if (o.hat) { // trilby
      ell(c, 0, -u * .3, rx * 1.65, u * .1, o.hat);
      c.beginPath(); c.moveTo(-rx * 1.05, -u * .3); c.quadraticCurveTo(-rx * 1.1, -u * .8, 0, -u * .72); c.quadraticCurveTo(rx * 1.1, -u * .8, rx * 1.05, -u * .3); c.fillStyle = o.hat; c.fill();
      c.fillRect(-rx * 1.05, -u * .4, rx * 2.1, u * .08); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-rx * 1.05, -u * .4, rx * 2.1, u * .08);
    }
    if (o.cap) { // porter's peaked cap
      c.beginPath(); c.moveTo(-rx * 1.1, -u * .25); c.lineTo(-rx * 1.0, -u * .62); c.lineTo(rx * 1.0, -u * .62); c.lineTo(rx * 1.1, -u * .25); c.fillStyle = o.cap; c.fill();
      ell(c, fx, -u * .23, rx * .9, u * .06, '#111'); c.fillStyle = '#c8b46a'; c.fillRect(-rx * .3, -u * .45, rx * .6, u * .06);
    }
    c.restore();
  }

  // ---- a standing body; returns anchors. f: x, y (feet), h, dress, top, bottom, coat, legs override, collar, print
  function body(c, f, R) {
    var u = f.h / 7.4, top = f.y - f.h, m = !f.dress, sw = (m ? .95 : .78) * u, x = f.x, skin = f.skin || '#e9bf98';
    var shY = top + 1.3 * u, wY = top + 2.95 * u, hip = top + 3.7 * u, hem = top + (f.dress ? 5.35 : (f.coat || 4.0)) * u;
    var legs = f.legs || [[[x - .24 * u, hip], [x - .26 * u, f.y - .2 * u]], [[x + .24 * u, hip], [x + .26 * u, f.y - .2 * u]]];
    legs.forEach(function (L) {
      limb(c, L, (m ? .38 : .2) * u, m ? (f.bottom || '#555') : (f.stock || '#d9b694'));
      var e = L[L.length - 1]; ell(c, e[0] + .06 * u, e[1] + .14 * u, (m ? .26 : .17) * u, .11 * u, f.shoe || '#1d1714');
    });
    c.fillStyle = skin; c.fillRect(x - .15 * u, top + .85 * u, .3 * u, .5 * u);
    shape(c, function () {
      c.moveTo(x - sw, shY + .1 * u); c.quadraticCurveTo(x - sw, shY - .15 * u, x - sw * .5, shY - .2 * u); c.lineTo(x + sw * .5, shY - .2 * u); c.quadraticCurveTo(x + sw, shY - .15 * u, x + sw, shY + .1 * u);
      if (f.dress) { c.lineTo(x + .52 * u, wY); c.quadraticCurveTo(x + .7 * u, hip, x + .9 * u, hem); c.quadraticCurveTo(x, hem + .12 * u, x - .9 * u, hem); c.quadraticCurveTo(x - .7 * u, hip, x - .52 * u, wY); }
      else { c.lineTo(x + .78 * u, wY); c.lineTo(x + .8 * u, hem); c.lineTo(x - .8 * u, hem); c.lineTo(x - .78 * u, wY); }
      c.closePath();
    }, f.top, x - sw, x + sw);
    if (f.print) { var r = R || rng(7); c.save(); c.beginPath(); c.rect(x - u, shY - .2 * u, 2 * u, hem - shY + .2 * u); c.clip(); for (var i = 0; i < 70; i++) { var px = x - .9 * u + r() * 1.8 * u, py = shY + r() * (hem - shY); ell(c, px, py, u * .035, u * .035, f.print); } c.restore(); }
    if (f.dress) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x - .55 * u, wY - .04 * u, 1.1 * u, .08 * u); }
    if (f.collar) { c.fillStyle = f.collar; c.fillRect(x - .2 * u, top + 1.02 * u, .4 * u, .16 * u); line(c, x + .02 * u, top + 1.18 * u, x + .25 * u, top + 1.45 * u, u * .03, 'rgba(0,0,0,.25)'); }
    return { u: u, top: top, shL: [x - sw * .85, shY + .05 * u], shR: [x + sw * .85, shY + .05 * u], wY: wY, hip: hip, hem: hem, hx: x, hy: top + .55 * u };
  }

  // ---- the station's round clock
  function clock(c, x, y, r, hh, mm) {
    ell(c, x + r * .08, y + r * .08, r * 1.12, r * 1.12, 'rgba(0,0,0,.25)');
    c.beginPath(); c.arc(x, y, r * 1.12, 0, 7); c.fillStyle = lin(c, x - r, y - r, x + r, y + r, [[0, '#6c6a60'], [1, '#26261f']]); c.fill();
    c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = rad(c, x - r * .3, y - r * .3, r * .1, r * 1.1, [[0, '#fbf8ee'], [1, '#d4cfbe']]); c.fill();
    var N = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    c.fillStyle = '#1a1814'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = 'bold ' + Math.max(5, r * .2) + 'px serif';
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; c.fillText(N[i], x + Math.sin(a) * r * .78, y - Math.cos(a) * r * .78); }
    for (i = 0; i < 60; i++) { a = i * Math.PI / 30; line(c, x + Math.sin(a) * r * .93, y - Math.cos(a) * r * .93, x + Math.sin(a) * r * (i % 5 ? .97 : 1), y - Math.cos(a) * r * (i % 5 ? .97 : 1), r * .015, '#333'); }
    var ah = (hh % 12 + mm / 60) * Math.PI / 6, am = mm * Math.PI / 30;
    line(c, x, y, x + Math.sin(ah) * r * .5, y - Math.cos(ah) * r * .5, r * .07, '#111');
    line(c, x, y, x + Math.sin(am) * r * .74, y - Math.cos(am) * r * .74, r * .045, '#111');
    ell(c, x, y, r * .05, r * .05, '#111');
  }

  // ---- the train shed seen down its length (two arched naves)
  function shed(c, W, H, VX, VY, R) {
    function P(x, y, k) { return [VX + (x - VX) * k, VY + (y - VY) * k]; }
    c.fillStyle = lin(c, 0, 0, 0, H, [[0, '#cbcdbf'], [.45, '#e7e5d8'], [1, '#8e8c80']]); c.fillRect(0, 0, W, H);
    var naves = [[-60, 330, 420], [560, 330, 420]], KF = .17, ks = [1.25, .95, .72, .55, .42, .32, .245, .2];
    // far end screens: bright glass
    naves.forEach(function (n) {
      var cx = P(n[0], 150, KF), rx = n[1] * KF, ry = n[2] * KF;
      c.beginPath(); c.ellipse(cx[0], cx[1], rx, ry, 0, Math.PI, 2 * Math.PI); c.lineTo(cx[0] + rx, P(0, 420, KF)[1]); c.lineTo(cx[0] - rx, P(0, 420, KF)[1]); c.closePath();
      c.fillStyle = '#fbf9f0'; c.fill();
      for (var j = -4; j <= 4; j++) line(c, cx[0] + j * rx / 5, cx[1] - Math.sqrt(Math.max(0, 1 - j * j / 25)) * ry, cx[0] + j * rx / 5, P(0, 420, KF)[1], .8, 'rgba(60,60,50,.5)');
      line(c, cx[0] - rx, cx[1] - ry * .45, cx[0] + rx, cx[1] - ry * .45, .8, 'rgba(60,60,50,.5)');
    });
    // purlins (lines down the roof toward the far end) and glass panes
    naves.forEach(function (n) {
      for (var i = 0; i <= 18; i++) {
        var a = Math.PI + i * Math.PI / 18, ox = n[0] + Math.cos(a) * n[1], oy = 150 + Math.sin(a) * n[2];
        var p0 = P(ox, oy, 1.3), p1 = P(ox, oy, KF); line(c, p0[0], p0[1], p1[0], p1[1], i % 3 ? .7 : 1.4, 'rgba(45,52,46,.4)');
      }
    });
    // ribs
    ks.forEach(function (k, ki) {
      naves.forEach(function (n) {
        var cx = P(n[0], 150, k); c.beginPath(); c.ellipse(cx[0], cx[1], n[1] * k, n[2] * k, 0, Math.PI, 2 * Math.PI);
        c.lineWidth = 2 + 7 * k; c.strokeStyle = '#2f3631'; c.stroke();
        c.lineWidth = 1 + 2 * k; c.strokeStyle = 'rgba(255,255,255,.12)'; c.stroke();
        // lattice inside the rib
        if (k > .5) for (var i = 1; i < 24; i += 2) { var a = Math.PI + i * Math.PI / 24, a2 = a + Math.PI / 24; line(c, cx[0] + Math.cos(a) * n[1] * k, cx[1] + Math.sin(a) * n[2] * k, cx[0] + Math.cos(a2) * (n[1] * k - 6 * k), cx[1] + Math.sin(a2) * (n[2] * k - 6 * k), 1, '#2f3631'); }
      });
      // central column row
      var t = P(270, 150, k), b = P(270, 420, k); c.fillStyle = '#2b312d'; c.fillRect(t[0] - 5 * k, t[1], 10 * k, b[1] - t[1]);
      c.fillStyle = 'rgba(255,255,255,.1)'; c.fillRect(t[0] - 5 * k, t[1], 3 * k, b[1] - t[1]);
    });
    return P;
  }
  function puff(c, R, x, y, n, s, a) { for (var i = 0; i < n; i++) ell(c, x + (R() - .5) * s * 2.2, y - i * s * .25 + (R() - .5) * s, s * (.5 + R() * .6), s * (.4 + R() * .5), 'rgba(235,235,228,' + (a * (0.4 + R() * .6)) + ')'); }
  function person(c, R, x, y, h, o) {
    var b = body(c, { x: x, y: y, h: h, dress: o.dress, top: o.top, bottom: o.bottom, coat: o.coat, stock: o.stock }, R);
    limb(c, [b.shL, [b.shL[0] - b.u * .1, b.wY + b.u * .5]], b.u * .32, o.top); limb(c, [b.shR, [b.shR[0] + b.u * .1, b.wY + b.u * .5]], b.u * .32, o.top);
    hand(c, b.shL[0] - b.u * .1, b.wY + b.u * .6, b.u * .12, '#e2b48c'); hand(c, b.shR[0] + b.u * .1, b.wY + b.u * .6, b.u * .12, '#e2b48c');
    head(c, b.hx, b.hy, b.u, o.head);
    return b;
  }

  var POPO_SKIN = '#ecc49e', DRESS = '#e8dcc0', PRINT = '#7d8fb0';

  return {
    arrive: function (c, W, H) {
      var R = rng(1968), VX = 228, VY = 168;
      var P = shed(c, W, H, VX, VY, R);
      // track bed on the left, platform on the right
      poly(c, [P(-400, 470, 1.4), P(60, 470, 1.4), P(60, 470, .17), P(-400, 470, .17)], '#4a443b');
      for (var i = 0; i < 2; i++) { var a = P(-170 + i * 120, 470, 1.4), b2 = P(-170 + i * 120, 470, .17); line(c, a[0], a[1], b2[0], b2[1], 1.5, '#a8a294'); }
      poly(c, [P(60, 420, 1.4), P(1200, 420, 1.4), P(1200, 420, .17), P(60, 420, .17)], lin(c, 0, VY, 0, H, [[0, '#a7a294'], [1, '#d8d2c2']]));
      poly(c, [P(60, 420, 1.4), P(60, 470, 1.4), P(60, 470, .17), P(60, 420, .17)], '#6c675c');
      var e0 = P(60, 420, 1.4), e1 = P(60, 420, .17); line(c, e0[0], e0[1], e1[0], e1[1], 3, '#efeadc');
      // RENFE carriage, dark green, on the left track
      function car(k0, k1) {
        var s = [P(40, 175, k0), P(40, 175, k1), P(40, 455, k1), P(40, 455, k0)];
        poly(c, s, '#2d4634');
        poly(c, [P(40, 175, k0), P(40, 175, k1), P(-120, 140, k1), P(-120, 140, k0)], '#3e463f');
        poly(c, [P(40, 395, k0), P(40, 395, k1), P(40, 455, k1), P(40, 455, k0)], '#1c2620');
        for (var j = 0; j < 5; j++) {
          var ka = k0 - (k0 - k1) * (j * .2 + .03), kb = k0 - (k0 - k1) * (j * .2 + .15);
          poly(c, [P(40, 215, ka), P(40, 215, kb), P(40, 290, kb), P(40, 290, ka)], '#b9c0b4');
          poly(c, [P(40, 215, ka), P(40, 215, kb), P(40, 235, kb), P(40, 235, ka)], 'rgba(0,0,0,.25)');
        }
        var l0 = P(40, 320, k0), l1 = P(40, 320, k1); line(c, l0[0], l0[1], l1[0], l1[1], 1.2 * k0, '#c9b778');
        var w0 = P(40, 455, k0 - (k0 - k1) * .15), w1 = P(40, 455, k1 + (k0 - k1) * .15); ell(c, w0[0], w0[1], 10 * k0, 14 * k0, '#111'); ell(c, w1[0], w1[1], 10 * k1, 14 * k1, '#111');
      }
      car(.32, .2); car(1.3, .33);
      c.save(); c.fillStyle = '#d8c98c'; c.font = 'bold 9px sans-serif'; c.setTransform(1, -.09, 0, 1, 0, 0); c.fillText('RENFE', 92, 271); c.restore();
      // steam drifting under the roof
      puff(c, R, 175, 145, 9, 18, .55); puff(c, R, 120, 110, 10, 24, .45); puff(c, R, 70, 80, 8, 30, .3); puff(c, R, 205, 130, 5, 10, .6);
      // the great clock hanging from the ironwork
      line(c, 190, 0, 190, 40, 2.5, '#2b312d'); c.fillStyle = '#2b312d'; c.fillRect(178, 36, 24, 5);
      clock(c, 190, 66, 23, 7, 40);
      // travellers
      var bt = R;
      // porter with cap and trolley, far down
      (function () {
        var x = 178, y = 252, h = 64, u = h / 7.4;
        poly(c, [[x + 6, y - 2], [x + 30, y - 2], [x + 30, y - 8], [x + 6, y - 8]], '#3a2f25'); ell(c, x + 10, y, 3, 3, '#111'); ell(c, x + 27, y, 3, 3, '#111');
        c.fillStyle = '#7a5b3a'; c.fillRect(x + 9, y - 20, 18, 12); c.fillStyle = '#4c5966'; c.fillRect(x + 11, y - 30, 14, 10); c.fillStyle = '#9a8460'; c.fillRect(x + 13, y - 36, 10, 6);
        person(c, bt, x, y, h, { top: '#3b4150', bottom: '#2c303a', coat: 4.4, head: { skin: '#dcae86', cap: '#2a2d36', style: 'short', mouth: 'soft' } });
      })();
      person(c, bt, 242, 284, 98, { top: '#5a5249', bottom: '#38342f', coat: 5.2, head: { skin: '#e2b48c', style: 'short', hat: '#2c2824', mouth: 'soft', turn: .3 } });
      person(c, bt, 418, 300, 116, { dress: 1, top: '#6d5e58', stock: '#8a7462', head: { skin: '#e6b994', style: 'scarf', scarf: '#9b8f7a', mouth: 'soft', turn: -.3, look: [-.5, 0] } });
      // Popo, 19, in the foreground
      var x = 322, y = 334, f = body(c, { x: x, y: y, h: 210, dress: 1, top: DRESS, print: PRINT, collar: '#efe6d0', skin: POPO_SKIN, stock: '#e2bd98', shoe: '#2a1d16' }, rng(19)), u = f.u;
      // suitcase in her right hand (screen left)
      shape(c, function () { c.rect(x - 1.95 * u, f.top + 3.75 * u, 1.5 * u, 1.15 * u); }, '#8a5c38', x - 1.95 * u, x - .45 * u, .45);
      c.fillStyle = '#5c3a22'; c.fillRect(x - 1.95 * u, f.top + 4.2 * u, 1.5 * u, .1 * u); c.fillStyle = '#c9b07a'; c.fillRect(x - 1.75 * u, f.top + 3.8 * u, .12 * u, .12 * u); c.fillRect(x - .8 * u, f.top + 3.8 * u, .12 * u, .12 * u);
      c.beginPath(); c.moveTo(x - 1.45 * u, f.top + 3.75 * u); c.quadraticCurveTo(x - 1.2 * u, f.top + 3.45 * u, x - .95 * u, f.top + 3.75 * u); c.lineWidth = .1 * u; c.strokeStyle = '#3b2616'; c.stroke();
      limb(c, [f.shL, [f.shL[0] - .15 * u, f.wY], [x - 1.2 * u, f.top + 3.55 * u]], .3 * u, DRESS);
      hand(c, x - 1.2 * u, f.top + 3.6 * u, .13 * u, POPO_SKIN);
      // the jar of salt lemons hugged to her
      var jx = x + .25 * u, jy = f.top + 2.75 * u, jw = .52 * u, jh = .7 * u;
      ell(c, jx, jy, jw, jh, 'rgba(210,220,200,.55)');
      ell(c, jx, jy + jh * .1, jw * .92, jh * .85, 'rgba(225,205,120,.45)');
      [[-.45, .45], [.4, .5], [0, .1], [-.5, -.15], [.45, -.1], [0, -.5], [-.35, -.6], [.38, -.62]].forEach(function (q, i) { var lx = jx + q[0] * jw, ly = jy + q[1] * jh; ell(c, lx, ly, u * .23, u * .2, '#8a6c14'); ell(c, lx - u * .02, ly - u * .02, u * .2, u * .17, ['#e6c63c', '#d8b42a', '#efd76a'][i % 3]); ell(c, lx - u * .07, ly - u * .06, u * .05, u * .04, 'rgba(255,255,220,.7)'); });
      ell(c, jx, jy + jh * .2, jw * .9, jh * .6, 'rgba(230,220,150,.25)');
      c.fillStyle = '#8f8a80'; c.fillRect(jx - jw * .7, jy - jh - .1 * u, jw * 1.4, .2 * u);
      c.beginPath(); c.ellipse(jx - jw * .45, jy - jh * .1, jw * .12, jh * .65, 0, 0, 7); c.fillStyle = 'rgba(255,255,255,.45)'; c.fill();
      c.beginPath(); c.ellipse(jx, jy, jw, jh, 0, 0, 7); c.lineWidth = 1.2; c.strokeStyle = 'rgba(80,90,80,.6)'; c.stroke();
      limb(c, [f.shR, [x + 1.0 * u, f.top + 2.6 * u], [x - .05 * u, f.top + 3.05 * u]], .3 * u, DRESS);
      hand(c, x - .1 * u, f.top + 3.05 * u, .13 * u, POPO_SKIN);
      head(c, f.hx, f.hy, u, { skin: POPO_SKIN, style: 'bob', tilt: -.12, look: [-.7, -1], brUp: 1, mouth: 'soft', turn: -.15 });
    },

    clock: function (c, W, H) {
      var R = rng(1969), VX = 300, VY = 175;
      var P = shed(c, W, H, VX, VY, R);
      poly(c, [[0, 250], [W, 250], [W, H], [0, H]], lin(c, 0, 230, 0, H, [[0, '#a29d8f'], [1, '#d5cfbf']]));
      poly(c, [P(-500, 420, .17), P(1200, 420, .17), [W, 250], [0, 250]], '#a39e90');
      // distant people
      person(c, R, 445, 238, 46, { top: '#4d4740', bottom: '#2c2a27', head: { style: 'short', hat: '#2a2622', mouth: 'soft' } });
      person(c, R, 470, 236, 42, { dress: 1, top: '#7a6b60', head: { style: 'scarf', scarf: '#8d8070', mouth: 'soft' } });
      puff(c, R, 60, 120, 8, 26, .35);
      // iron canopy beam and the bracket holding the clock
      c.fillStyle = '#2b312d'; c.fillRect(0, 0, W, 16); for (var i = 0; i < 30; i++) ell(c, 8 + i * 16.5, 9, 1.6, 1.6, '#55605a');
      for (i = 0; i < 12; i++) line(c, i * 42, 16, i * 42 + 21, 36, 2, '#2b312d'), line(c, i * 42 + 42, 16, i * 42 + 21, 36, 2, '#2b312d');
      c.fillStyle = '#2b312d'; c.fillRect(0, 34, W, 5);
      line(c, 165, 38, 165, 70, 6, '#2b312d'); c.beginPath(); c.arc(165, 52, 18, Math.PI, 0); c.lineWidth = 2; c.strokeStyle = '#2b312d'; c.stroke();
      clock(c, 165, 128, 62, 10, 8);
      // the iron column the ladder leans on
      c.fillStyle = '#2b312d'; c.fillRect(256, 30, 14, 222); c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(258, 30, 3, 222); c.fillRect(252, 245, 22, 8);
      // ladder
      function rail(x0, y0, x1, y1) { line(c, x0, y0, x1, y1, 7, '#8a6038'); line(c, x0 - 1.5, y0, x1 - 1.5, y1, 2, 'rgba(255,230,190,.35)'); }
      var L = [[232, 150, 270, 345], [272, 150, 318, 345]];
      for (i = 0; i < 9; i++) { var t = (i + .5) / 9; line(c, L[0][0] + (L[0][2] - L[0][0]) * t, 150 + 195 * t, L[1][0] + (L[1][2] - L[1][0]) * t, 150 + 195 * t, 4, '#7a5430'); }
      rail(L[0][0], L[0][1] - 6, L[0][2], L[0][3]);
      // Josep on the ladder
      var x = 268, y = 262, J = '#2f4f86', f = body(c, { x: x, y: y, h: 196, top: J, bottom: '#3b3a3c', coat: 4.6, skin: '#e2b088',
        legs: [[[x - 7, y - 108], [x - 16, y - 68], [x - 7, y - 40]], [[x + 7, y - 108], [x + 9, y - 60], [x + 8, y - 18]]] }), u = f.u;
      // oil stains on the work coat
      ell(c, x + .3 * u, f.top + 3.4 * u, .14 * u, .1 * u, 'rgba(20,20,30,.45)'); ell(c, x - .4 * u, f.top + 4.1 * u, .1 * u, .08 * u, 'rgba(20,20,30,.4)');
      c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x - .03 * u, f.top + 1.4 * u, .06 * u, 3.1 * u);
      for (i = 0; i < 4; i++) ell(c, x + .14 * u, f.top + (1.6 + i * .7) * u, .05 * u, .05 * u, '#c9c3b0');
      c.fillStyle = '#e8e2d2'; c.beginPath(); c.moveTo(x - .25 * u, f.top + 1.05 * u); c.lineTo(x, f.top + 1.5 * u); c.lineTo(x + .25 * u, f.top + 1.05 * u); c.fill();
      rail(L[1][0], L[1][1] - 6, L[1][2], L[1][3]);
      // arm up to the clock with the oil can
      limb(c, [f.shL, [x - 1.1 * u, f.top + .6 * u], [x - 1.75 * u, f.top - .1 * u]], .34 * u, J);
      hand(c, x - 1.75 * u, f.top - .12 * u, .15 * u, '#e2b088');
      poly(c, [[x - 2.0 * u, f.top - .25 * u], [x - 1.6 * u, f.top - .25 * u], [x - 1.55 * u, f.top + .25 * u], [x - 2.05 * u, f.top + .25 * u]], '#9a9a90');
      line(c, x - 1.95 * u, f.top - .2 * u, x - 2.6 * u, f.top - .6 * u, 2, '#7d7d74');
      // other hand on the rail
      limb(c, [f.shR, [x + 1.0 * u, f.top + 2.2 * u], [x + 1.3 * u, f.top + 2.8 * u]], .34 * u, J);
      hand(c, x + 1.3 * u, f.top + 2.85 * u, .15 * u, '#e2b088');
      head(c, f.hx, f.hy, u, { skin: '#e2b088', hair: '#2a1d16', style: 'wavy', thick: 1, tilt: .2, turn: .35, look: [.8, .9], mouth: 'smile', crinkle: 1 });
      // Popo below with her paper map, laughing
      var px = 395, pf = body(c, { x: px, y: 334, h: 182, dress: 1, top: DRESS, print: PRINT, collar: '#efe6d0', skin: POPO_SKIN, stock: '#e2bd98' }, rng(21)), pu = pf.u;
      var my = pf.top + 2.35 * pu;
      limb(c, [pf.shL, [px - 1.0 * pu, pf.top + 2.6 * pu], [px - .9 * pu, my + .3 * pu]], .28 * pu, DRESS);
      limb(c, [pf.shR, [px + 1.0 * pu, pf.top + 2.6 * pu], [px + .9 * pu, my + .3 * pu]], .28 * pu, DRESS);
      poly(c, [[px - 1.25 * pu, my - .1 * pu], [px + 1.3 * pu, my - .2 * pu], [px + 1.2 * pu, my + .95 * pu], [px - 1.2 * pu, my + 1.0 * pu]], '#efe8d4');
      for (i = 1; i < 4; i++) line(c, px - 1.25 * pu + i * .63 * pu, my - .13 * pu, px - 1.2 * pu + i * .6 * pu, my + .98 * pu, 1, 'rgba(0,0,0,.2)');
      c.beginPath(); c.moveTo(px - 1.0 * pu, my + .7 * pu); c.bezierCurveTo(px - .3 * pu, my, px + .2 * pu, my + .9 * pu, px + 1.0 * pu, my + .2 * pu); c.lineWidth = 1.5; c.strokeStyle = 'rgba(150,60,50,.7)'; c.stroke();
      line(c, px - .9 * pu, my + .2 * pu, px + .5 * pu, my + .5 * pu, 1, 'rgba(60,80,120,.6)');
      hand(c, px - .95 * pu, my + .35 * pu, .13 * pu, POPO_SKIN); hand(c, px + .95 * pu, my + .3 * pu, .13 * pu, POPO_SKIN);
      head(c, pf.hx, pf.hy, pu, { skin: POPO_SKIN, style: 'bob', tilt: -.22, turn: -.35, eyes: 'happy', mouth: 'laugh', brUp: 1 });
    },

    montserrat: function (c, W, H) {
      var R = rng(1930);
      c.fillStyle = lin(c, 0, 0, 0, H, [[0, '#9cbbd8'], [.6, '#dfe6e6'], [1, '#e9e4d6']]); c.fillRect(0, 0, W, H);
      ell(c, 420, 40, 60, 14, 'rgba(255,255,255,.6)'); ell(c, 380, 55, 40, 9, 'rgba(255,255,255,.5)');
      // far hills across the Llobregat valley
      c.beginPath(); c.moveTo(0, 230); for (var x = 0; x <= W; x += 20) c.lineTo(x, 214 + Math.sin(x * .02) * 10 + Math.sin(x * .053) * 6); c.lineTo(W, H); c.lineTo(0, H); c.fillStyle = '#a7ae9f'; c.fill();
      // the mountain: a crown of rounded pinnacles
      var top = [], xx = -14;
      while (xx < 420) { var w = 16 + R() * 22, env = 165 - 125 * Math.exp(-Math.pow((xx - 190) / 165, 2)); top.push([xx, w, env + R() * 26 - (R() < .25 ? 18 : 0)]); xx += w * (.55 + R() * .3); }
      c.beginPath(); c.moveTo(-10, 300);
      top.forEach(function (p) { c.lineTo(p[0], p[2] + p[1] * .9); c.bezierCurveTo(p[0] - p[1] * .05, p[2] - p[1] * .1, p[0] + p[1] * 1.05, p[2] - p[1] * .1, p[0] + p[1], p[2] + p[1] * .9); });
      c.lineTo(430, 190); c.lineTo(470, 240); c.lineTo(470, 300); c.closePath();
      c.fillStyle = lin(c, 0, 20, 0, 260, [[0, '#d1b7a2'], [.5, '#b9967f'], [1, '#8f7563']]); c.fill();
      c.save(); c.clip();
      top.forEach(function (p) {
        c.fillStyle = lin(c, p[0], 0, p[0] + p[1], 0, [[0, 'rgba(255,240,225,.28)'], [.5, 'rgba(0,0,0,0)'], [1, 'rgba(60,30,20,.35)']]); c.fillRect(p[0], p[2], p[1], 300);
        line(c, p[0] + p[1], p[2] + p[1] * .8, p[0] + p[1] + (R() - .5) * 6, p[2] + 40 + R() * 50, 2, 'rgba(70,40,30,.4)');
      });
      for (var i = 0; i < 300; i++) ell(c, R() * 430, 40 + R() * 220, .8 + R() * 1.5, .7 + R(), 'rgba(' + (R() > .5 ? '90,60,45' : '235,215,195') + ',.3)');
      for (i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-10, 150 + i * 22); c.quadraticCurveTo(200, 140 + i * 22 + R() * 10, 440, 160 + i * 20); c.lineWidth = 1; c.strokeStyle = 'rgba(80,50,40,.18)'; c.stroke(); }
      c.restore();
      // the green scrub on the lower slopes
      for (i = 0; i < 140; i++) ell(c, R() * 470, 205 + R() * 60 + (R() * 30), 4 + R() * 6, 3 + R() * 3, ['#5f6e47', '#71804f', '#4d5a3b'][i % 3]);
      // the monastery on its ledge
      poly(c, [[70, 184], [300, 180], [312, 196], [60, 200]], '#8a7a68');
      shape(c, function () { c.rect(78, 150, 175, 34); }, '#d9cdb6', 78, 253, .3);
      for (var r = 0; r < 3; r++) for (i = 0; i < 22; i++) { c.fillStyle = '#4a4037'; c.fillRect(82 + i * 7.8, 155 + r * 10, 3, 5); }
      c.fillStyle = '#b8a991'; c.fillRect(78, 146, 175, 5);
      shape(c, function () { c.moveTo(150, 150); c.lineTo(150, 128); c.lineTo(168, 114); c.lineTo(186, 128); c.lineTo(186, 150); }, '#e2d7c2', 150, 186, .3);
      c.beginPath(); c.arc(168, 138, 6, Math.PI, 0); c.lineTo(174, 150); c.lineTo(162, 150); c.fillStyle = '#4a4037'; c.fill();
      ell(c, 168, 124, 3, 3, '#4a4037');
      shape(c, function () { c.rect(253, 160, 50, 24); }, '#cfc2aa', 253, 303, .3);
      for (i = 0; i < 6; i++) { c.fillStyle = '#4a4037'; c.fillRect(257 + i * 8, 166, 3, 5); c.fillRect(257 + i * 8, 175, 3, 5); }
      shape(c, function () { c.rect(222, 126, 14, 26); c.moveTo(220, 126); c.lineTo(229, 116); c.lineTo(238, 126); }, '#d9cdb6', 222, 236, .3);
      // the river winding in the valley
      c.beginPath(); c.moveTo(190, 262); c.bezierCurveTo(260, 250, 300, 272, 360, 258); c.bezierCurveTo(410, 248, 440, 262, 480, 255); c.lineWidth = 4; c.strokeStyle = '#c9d6d8'; c.stroke();
      // cable and the Aeri cabin
      line(c, 300, 168, 480, 238, 1, '#333'); line(c, 300, 172, 480, 243, 1, '#333');
      var cx = 352, cy = 190; line(c, cx, cy - 2, cx, cy + 9, 1.4, '#222'); ell(c, cx - 3, cy - 2, 2.2, 2.2, '#222'); ell(c, cx + 3, cy, 2.2, 2.2, '#222');
      shape(c, function () { c.rect(cx - 10, cy + 9, 20, 15); }, '#c8452f', cx - 10, cx + 10, .3);
      c.fillStyle = '#e6e2d6'; c.fillRect(cx - 8, cy + 12, 16, 5); c.fillStyle = '#333'; for (i = 0; i < 4; i++) c.fillRect(cx - 7.5 + i * 4, cy + 12, .8, 5);
      // the lower station and its railing
      poly(c, [[0, 300], [W, 292], [W, H], [0, H]], '#8a8274');
      // Josep pointing up at the monastery, Popo holding his arm
      var JS = '#f2efe6', x1 = 318, j = body(c, { x: x1, y: 420, h: 300, top: JS, bottom: '#6b6b6b', coat: 3.9, skin: '#e2b088' }), u = j.u;
      c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x1 - .02 * u, j.top + 1.3 * u, .04 * u, 2.6 * u);
      c.fillStyle = '#e7e2d6'; c.beginPath(); c.moveTo(x1 - .3 * u, j.top + 1.0 * u); c.lineTo(x1, j.top + 1.35 * u); c.lineTo(x1 + .3 * u, j.top + 1.0 * u); c.lineTo(x1 + .2 * u, j.top + 1.4 * u); c.lineTo(x1 - .2 * u, j.top + 1.4 * u); c.fill();
      c.fillStyle = '#4a4a4c'; c.fillRect(x1 - .8 * u, j.top + 3.3 * u, 1.6 * u, .12 * u);
      limb(c, [j.shL, [x1 - 1.5 * u, j.top + .6 * u], [x1 - 2.3 * u, j.top - .4 * u]], .36 * u, JS);
      hand(c, x1 - 2.32 * u, j.top - .45 * u, .15 * u, '#e2b088'); line(c, x1 - 2.4 * u, j.top - .55 * u, x1 - 2.6 * u, j.top - .85 * u, .09 * u, '#e2b088');
      var x2 = 405, p = body(c, { x: x2, y: 420, h: 255, dress: 1, top: '#e6d8b8', print: '#9a5a5a', collar: '#efe6d0', skin: POPO_SKIN }, rng(69)), pu = p.u;
      // Josep's left arm, Popo's arms wrapped round it
      limb(c, [j.shR, [x1 + 1.05 * u, j.top + 2.4 * u], [x1 + 1.5 * u, j.top + 3.1 * u]], .36 * u, JS);
      limb(c, [p.shL, [x2 - 1.0 * pu, p.top + 2.4 * pu], [x1 + 1.05 * u, j.top + 2.2 * u]], .28 * pu, '#e6d8b8');
      hand(c, x1 + 1.0 * u, j.top + 2.2 * u, .14 * pu, POPO_SKIN);
      limb(c, [p.shR, [x2 + .5 * pu, p.top + 2.9 * pu], [x1 + 1.3 * u, j.top + 2.75 * u]], .28 * pu, '#e6d8b8');
      hand(c, x1 + 1.3 * u, j.top + 2.8 * u, .14 * pu, POPO_SKIN);
      head(c, j.hx, j.hy, u, { skin: '#e2b088', hair: '#2a1d16', style: 'wavy', thick: 1, tilt: -.12, turn: -.45, look: [-.9, -.8], mouth: 'smile', crinkle: 1 });
      head(c, p.hx, p.hy, pu, { skin: POPO_SKIN, style: 'bob', tilt: -.1, turn: -.3, look: [-.8, -.9], mouth: 'smile', brUp: 1 });
      // iron railing in front
      line(c, 0, 296, W, 288, 4, '#2d2b28'); line(c, 0, 320, W, 313, 3, '#2d2b28');
      for (i = 0; i < 13; i++) line(c, 10 + i * 38, 297 - i * .25, 10 + i * 38, H, 3, '#2d2b28');
      line(c, 0, 294, W, 286, 1, 'rgba(255,255,255,.3)');
    }
  };
})());
Object.assign(window.POPO_PHOTOS=window.POPO_PHOTOS||{},function(){function a(a){return function(){a=(a|=0)+1831565813|0;var e=Math.imul(a^a>>>15,1|a);return(((e=e+Math.imul(e^e>>>7,61|e)^e)^e>>>14)>>>0)/4294967296}}function e(a,e,r,o,t,i){for(var l=a.createLinearGradient(e,r,o,t),n=0;n<i.length;n+=2)l.addColorStop(i[n],i[n+1]);return l}function r(a,e,r,o,t,i){for(var l=a.createRadialGradient(e,r,o,e,r,t),n=0;n<i.length;n+=2)l.addColorStop(i[n],i[n+1]);return l}function o(a,e,r,o,t,i,l){a.beginPath(),a.ellipse(e,r,Math.max(o,.1),Math.max(t,.1),l||0,0,7),a.fillStyle=i,a.fill()}function t(a,e,r,o,t,i){a.fillStyle=i,a.fillRect(e,r,o,t)}function i(a,e,r){a.beginPath(),a.moveTo(e[0],e[1]);for(var o=2;o<e.length;o+=2)a.lineTo(e[o],e[o+1]);a.closePath(),a.fillStyle=r,a.fill()}function l(a,e,r,o,t,i,l){a.beginPath(),a.moveTo(e,r),a.lineTo(o,t),a.strokeStyle=i,a.lineWidth=l,a.lineCap="round",a.stroke()}function n(a,e){var r=parseInt(a.slice(1),16),o=r>>8&255,t=255&r;function i(a){return Math.max(0,Math.min(255,Math.round(e<0?a*(1+e):a+(255-a)*e)))}return"rgb("+i(r>>16)+","+i(o)+","+i(t)+")"}function c(a,c){var u=c.x,d=c.y,s=c.h,b=s*(c.kid?.085:.072),h=c.turn||0,v=u+h*b*.25,T=d-s+1.05*b,g=T+1.6*b,k=s*(c.sw||.115),m=d-.5*s,p=d-.26*s,C=c.top,P=c.low||"trousers",q=c.lc||C,y=c.skin,S=n(y,-.18),x={};a.save(),a.lineJoin="round",o(a,u,d+1,1.2*k,.02*s,"rgba(0,0,0,.25)");var M=.42*k;if([-1,1].forEach("trousers"===P?function(e){l(a,u+e*M*.8,m+4,u+e*M*(c.wide||1.05),d-.02*s,e<0?n(q,-.15):q,.085*s)}:function(e){l(a,u+e*M*.7,p-4,u+e*M*(c.wide||.8),d-.025*s,c.tights||y,.045*s)}),[-1,1].forEach(function(e){o(a,u+e*M*(c.wide||1)+e*s*.015,d-.015*s,.042*s,.018*s,c.shoe||"#2a1d17")}),"trousers"!==P&&(a.beginPath(),a.moveTo(u-.78*k,m),a.lineTo(u+.78*k,m),a.quadraticCurveTo(u+1.15*k,p-10,u+1.25*k,p),a.quadraticCurveTo(u,p+5,u-1.25*k,p),a.quadraticCurveTo(u-1.15*k,p-10,u-.78*k,m),a.closePath(),a.fillStyle=e(a,u-1.2*k,0,u+1.2*k,0,[0,n(q,.12),.6,q,1,n(q,-.25)]),a.fill(),c.print&&(a.save(),a.clip(),f(a,u-1.3*k,m,2.6*k,p-m+5,c.print,.09*b),a.restore())),a.beginPath(),a.moveTo(u-.55*k,g-.1*b),a.quadraticCurveTo(u-1.02*k,g-.05*b,u-k,g+.5*b),a.lineTo(u-.8*k,m+4),a.lineTo(u+.8*k,m+4),a.lineTo(u+k,g+.5*b),a.quadraticCurveTo(u+1.02*k,g-.05*b,u+.55*k,g-.1*b),a.closePath(),a.fillStyle=e(a,u-k,0,u+k,0,[0,n(C,.15),.55,C,1,n(C,-.28)]),a.fill(),c.print&&(a.save(),a.clip(),f(a,u-k,g-b,2*k,m-g+b+6,c.print,.09*b),a.restore()),c.belt&&t(a,u-.8*k,m-1,1.6*k,.018*s,c.belt),c.collar&&i(a,[u-.55*b,g-.15*b,u,g+.55*b,u+.55*b,g-.15*b,u+.25*b,g+.15*b,u,g+.25*b,u-.25*b,g+.15*b],c.collar),c.vneck&&i(a,[u-.4*b,g-.1*b,u,g+1*b,u+.4*b,g-.1*b],c.vneck),c.buttons)for(var w=0;w<4;w++)o(a,u,g+b*(.6+.8*w),.07*b,.07*b,c.buttons);if(c.apron&&(a.beginPath(),a.moveTo(u-.5*k,g+.4*b),a.lineTo(u+.5*k,g+.4*b),a.lineTo(u+.62*k,m),a.quadraticCurveTo(u+1*k,p-5,u+.95*k,p+4),a.lineTo(u-.95*k,p+4),a.quadraticCurveTo(u-1*k,p-5,u-.62*k,m),a.closePath(),a.fillStyle=e(a,u-k,0,u+k,0,[0,"#fbf7ee",.7,c.apron,1,n(c.apron,-.2)]),a.fill(),l(a,u-.5*k,g+.4*b,u-.45*b,g-.2*b,c.apron,.14*b),l(a,u+.5*k,g+.4*b,u+.45*b,g-.2*b,c.apron,.14*b),t(a,u-.8*k,m-2,1.6*k,.2*b,n(c.apron,-.12)),a.strokeStyle="rgba(0,0,0,.12)",a.lineWidth=1,a.strokeRect(u-.32*k,m+.5*b,.64*k,.9*b)),c.towel){a.beginPath(),a.moveTo(u-.85*k,g+.1*b),a.quadraticCurveTo(u-.3*k,g-.45*b,u-.05*k,g-.1*b),a.lineTo(u-.2*k,g+2.4*b),a.lineTo(u-.7*k,g+2.6*b),a.closePath(),a.fillStyle=c.towel,a.fill();for(var W=0;W<3;W++)l(a,u-.78*k+W*k*.02,g+b*(.9+.6*W),u-.2*k,g+b*(.8+.6*W),"#f6f1e6",.14*b)}t(a,v-.28*b,T+.7*b,.56*b,g-T-.55*b,S),c.collar&&!c.vneck&&i(a,[u-.5*b,g-.25*b,u,g+.4*b,u+.5*b,g-.25*b,u+.3*b,g+.05*b,u,g+.15*b,u-.3*b,g+.05*b],c.collar);var E=c.hc||"#17110e";!function(a,e,r,t,i,l,n){a.fillStyle=l,a.beginPath(),"bob"===e?(a.moveTo(r-1.08*i,t+.85*i),a.quadraticCurveTo(r-1.25*i,t-.3*i,r-.7*i,t-.95*i),a.quadraticCurveTo(r,t-1.35*i,r+.75*i,t-.95*i),a.quadraticCurveTo(r+1.28*i,t-.3*i,r+1.1*i,t+.85*i),a.quadraticCurveTo(r+.85*i,t+1*i,r+.6*i,t+.75*i),a.lineTo(r-.6*i,t+.75*i),a.quadraticCurveTo(r-.85*i,t+1*i,r-1.08*i,t+.85*i)):"shoulder"===e?(a.moveTo(r-1.1*i,t+1.7*i),a.quadraticCurveTo(r-1.3*i,t-.3*i,r-.7*i,t-.95*i),a.quadraticCurveTo(r,t-1.35*i,r+.75*i,t-.95*i),a.quadraticCurveTo(r+1.32*i,t-.3*i,r+1.12*i,t+1.7*i),a.quadraticCurveTo(r+.75*i,t+1.8*i,r+.62*i,t+1.3*i),a.lineTo(r+.6*i,t+.5*i),a.lineTo(r-.6*i,t+.5*i),a.lineTo(r-.62*i,t+1.3*i),a.quadraticCurveTo(r-.75*i,t+1.8*i,r-1.1*i,t+1.7*i)):"kid"===e?(a.moveTo(r-1.05*i,t+.7*i),a.quadraticCurveTo(r-1.2*i,t-.3*i,r-.7*i,t-.95*i),a.quadraticCurveTo(r,t-1.3*i,r+.75*i,t-.95*i),a.quadraticCurveTo(r+1.22*i,t-.3*i,r+1.05*i,t+.7*i),a.lineTo(r-1.05*i,t+.7*i)):"pig"===e?(o(a,r-1.15*i,t+.25*i,.32*i,.5*i,l,.4),o(a,r+1.15*i,t+.25*i,.32*i,.5*i,l,-.4),a.arc(r,t-.1*i,1.02*i,0,7)):"bun"===e?(o(a,r-n*i*.3,t-1.05*i,.45*i,.38*i,l),a.arc(r,t-.1*i,1*i,0,7)):a.arc(r,t-.12*i,.98*i,.95*Math.PI,2.05*Math.PI);a.fill(),"pig"===e&&(o(a,r-.95*i,t-.05*i,.12*i,.1*i,"#d23b3b"),o(a,r+.95*i,t-.05*i,.12*i,.1*i,"#d23b3b"))}(a,c.hair,v,T,b,E,h),o(a,v-.86*b,T+.1*b,.17*b,.26*b,S),o(a,v+.86*b,T+.1*b,.17*b,.26*b,S),a.beginPath(),a.ellipse(v,T,.84*b,b,0,0,7),a.fillStyle=r(a,v-.3*b,T-.3*b,.1*b,1.25*b,[0,n(y,.12),.65,y,1,S]),a.fill();var O=v+h*b*.28,I=T+.08*b;o(a,O-.45*b,T+.42*b,.2*b,.13*b,"rgba(220,110,100,.28)"),o(a,O+.45*b,T+.42*b,.2*b,.13*b,"rgba(220,110,100,.28)");var R=.34*b,z=c.expr||"smile",A="#1b1210";[-1,1].forEach(function(e){var r=O+e*R*(1-e*h*.15);"laugh"===z?(a.beginPath(),a.arc(r,I+.07*b,.14*b,1.1*Math.PI,1.9*Math.PI),a.strokeStyle=A,a.lineWidth=Math.max(1,.1*b),a.stroke()):(o(a,r,I,.15*b,.1*b,"#f4ece2"),o(a,r+h*b*.04,I,.09*b,.1*b,A),o(a,r+.03*b,I-.03*b,.03*b,.03*b,"#fff"),a.beginPath(),a.arc(r,I+.05*b,.16*b,1.15*Math.PI,1.85*Math.PI),a.strokeStyle=A,a.lineWidth=Math.max(.8,.06*b),a.stroke()),c.crinkle&&l(a,r+e*b*.2,I+.02*b,r+e*b*.3,I+.1*b,"rgba(90,50,40,.5)",.04*b),a.beginPath(),a.moveTo(r-.17*b,I-b*("up"===z?.3:.22)),a.quadraticCurveTo(r,I-b*("up"===z?.42:.34),r+.18*b,I-b*("up"===z?.3:.24)),a.strokeStyle=n(E,.05),a.lineWidth=b*(c.brow||.08),a.stroke()}),a.beginPath(),a.moveTo(O+h*b*.1,I+.05*b),a.quadraticCurveTo(O+b*(.1+.15*h),I+.3*b,O+h*b*.1-.03*b,I+.36*b),a.strokeStyle="rgba(120,60,40,.5)",a.lineWidth=.07*b,a.stroke(),o(a,O+h*b*.1,I+.38*b,.12*b,.05*b,"rgba(120,60,40,.2)");var B=T+.6*b;"laugh"===z||"open"===z?(a.beginPath(),a.moveTo(O-.28*b,B-.04*b),a.quadraticCurveTo(O,B-0*b,O+.28*b,B-.04*b),a.quadraticCurveTo(O,B+.38*b,O-.28*b,B-.04*b),a.fillStyle="#6a2220",a.fill(),a.beginPath(),a.moveTo(O-.24*b,B-.02*b),a.quadraticCurveTo(O,B+.02*b,O+.24*b,B-.02*b),a.lineTo(O+.2*b,B+.06*b),a.quadraticCurveTo(O,B+.1*b,O-.2*b,B+.06*b),a.fillStyle="#f6efe6",a.fill()):(a.beginPath(),a.moveTo(O-.25*b,B-.03*b),a.quadraticCurveTo(O,B+.18*b,O+.25*b,B-.03*b),a.strokeStyle="#8e3a30",a.lineWidth=.09*b,a.stroke()),c.lips&&(a.beginPath(),a.moveTo(O-.22*b,B-.02*b),a.quadraticCurveTo(O,B+.16*b,O+.22*b,B-.02*b),a.strokeStyle=c.lips,a.lineWidth=.1*b,a.stroke()),c.mou&&(a.beginPath(),a.moveTo(O-.34*b,B-.02*b),a.quadraticCurveTo(O-.15*b,B-.26*b,O,B-.18*b),a.quadraticCurveTo(O+.15*b,B-.26*b,O+.34*b,B-.02*b),a.quadraticCurveTo(O,B-.1*b,O-.34*b,B-.02*b),a.fillStyle=E,a.fill()),function(a,e,r,o,t,i){a.fillStyle=i,a.beginPath(),"bob"===e||"shoulder"===e?(a.moveTo(r-.98*t,o+.2*t),a.quadraticCurveTo(r-1.05*t,o-.85*t,r-.1*t,o-1.07*t),a.quadraticCurveTo(r+1*t,o-1*t,r+.95*t,o+.15*t),a.quadraticCurveTo(r+.6*t,o-.55*t,r-.25*t,o-.58*t),a.quadraticCurveTo(r-.75*t,o-.4*t,r-.98*t,o+.2*t)):"kid"===e||"pig"===e?(a.moveTo(r-.95*t,o+.1*t),a.quadraticCurveTo(r-1*t,o-.95*t,r,o-1.08*t),a.quadraticCurveTo(r+1*t,o-.95*t,r+.95*t,o+.1*t),a.lineTo(r+.7*t,o-.35*t),a.lineTo(r-.7*t,o-.35*t)):"back"===e?(a.moveTo(r-.9*t,o-.05*t),a.quadraticCurveTo(r-1.05*t,o-1.05*t,r-.1*t,o-1.25*t),a.quadraticCurveTo(r+.55*t,o-1.35*t,r+.85*t,o-.95*t),a.quadraticCurveTo(r+1*t,o-.55*t,r+.88*t,o-.05*t),a.quadraticCurveTo(r+.78*t,o-.5*t,r+.35*t,o-.62*t),a.quadraticCurveTo(r,o-.7*t,r-.4*t,o-.6*t),a.quadraticCurveTo(r-.78*t,o-.5*t,r-.9*t,o-.05*t)):"bun"===e?(a.moveTo(r-.9*t,o+.05*t),a.quadraticCurveTo(r-.95*t,o-1*t,r,o-1.08*t),a.quadraticCurveTo(r+.95*t,o-1*t,r+.9*t,o+.05*t),a.quadraticCurveTo(r+.7*t,o-.6*t,r,o-.66*t),a.quadraticCurveTo(r-.7*t,o-.6*t,r-.9*t,o+.05*t)):(a.moveTo(r-.88*t,o-.1*t),a.quadraticCurveTo(r-.9*t,o-1.05*t,r,o-1.1*t),a.quadraticCurveTo(r+.9*t,o-1.05*t,r+.88*t,o-.1*t),a.quadraticCurveTo(r+.7*t,o-.6*t,r,o-.65*t),a.quadraticCurveTo(r-.7*t,o-.6*t,r-.88*t,o-.1*t));if(a.fill(),"back"===e){a.strokeStyle="rgba(255,255,255,.12)",a.lineWidth=.07*t;for(var l=-2;l<=2;l++)a.beginPath(),a.moveTo(r+l*t*.25,o-.7*t),a.quadraticCurveTo(r+l*t*.3+.1*t,o-1*t,r+l*t*.2+.2*t,o-1.2*t),a.stroke()}}(a,c.hair,v,T,b,E),c.cap&&(a.beginPath(),a.ellipse(v,T-.55*b,1*b,.5*b,0,Math.PI,0),a.fillStyle=c.cap,a.fill(),o(a,v+.25*b,T-.5*b,1*b,.16*b,n(c.cap,-.2)));var G=.165*s,H=.16*s,J=s*(c.kid?.055:.06);return["l","r"].forEach(function(e){var r,t,i="l"===e?-1:1,f=u+i*k*.82,d=g+.35*b,h=c.arms&&c.arms[e]||{};if(h.abs)r=h.abs[0],t=h.abs[1];else{var v=h.t||[.06,.32];r=f+i*v[0]*s,t=d+v[1]*s}var T=function(a,e,r,o,t,i,l){var n=r-a,c=o-e,f=Math.min(Math.hypot(n,c),t+i-.01),u=Math.atan2(c,n)+Math.acos(Math.max(-1,Math.min(1,(t*t+f*f-i*i)/(2*t*f))))*l,d=a+t*Math.cos(u),s=e+t*Math.sin(u),b=Math.atan2(o-s,r-d);return[d,s,d+i*Math.cos(b),s+i*Math.sin(b)]}(f,d,r,t,G,H,null!=h.b?h.b:-i),m=h.col||C;a.beginPath(),a.moveTo(f,d),a.lineTo(T[0],T[1]),a.lineTo(T[2],T[3]),h.short?(l(a,f,d,f+.5*(T[0]-f),d+.5*(T[1]-d),n(m,-.08),J),l(a,f+.5*(T[0]-f),d+.5*(T[1]-d),T[0],T[1],y,.75*J),l(a,T[0],T[1],T[2],T[3],y,.7*J)):(a.strokeStyle=n(m,i>0?-.15:0),a.lineWidth=J,a.lineCap="round",a.lineJoin="round",a.stroke()),o(a,T[2],T[3],.5*J,.58*J,y),x[e]=[T[2],T[3]]}),x.head=[v,T,b],a.restore(),x}function f(a,e,r,o,t,i,l){a.fillStyle=i;for(var n=0;n<t;n+=7*l)for(var c=0;c<o;c+=7*l)a.beginPath(),a.arc(e+c+(n/(7*l)&1)*l*3.5,r+n,l,0,7),a.fill()}function u(a,r,o,i,l){t(a,0,0,r,o,e(a,0,0,0,o,[0,i,1,l]))}function d(a,e,r,t){[[0,0,1],[.9,.15,.8],[-.9,.2,.75],[.4,-.4,.7]].forEach(function(i){o(a,e+20*i[0]*t,r+20*i[1]*t,22*t*i[2],14*t*i[2],"rgba(255,255,255,.75)")})}function s(a,e,r,o,t,i){a.strokeStyle=i,a.lineWidth=1.4,a.strokeRect(e,r,o,t);for(var n=e+4;n<e+o;n+=5)l(a,n,r,n,r+t,i,1);a.beginPath();for(var c=e+8;c<e+o-4;c+=12)a.moveTo(c+4,r+.5*t),a.arc(c,r+.5*t,4,0,7);a.lineWidth=1,a.stroke()}function b(a,r,o,i,c,f,u){if(t(a,r,o,i,c,"#2b2420"),u)t(a,r-.32*i,o,.3*i,c,f),t(a,r+1.02*i,o,.3*i,c,f),t(a,r+2,o+2,i-4,c-4,e(a,r,o,r,o+c,[0,"#5b4b3c",1,"#2b221d"]));else{t(a,r,o,i,c,f),a.strokeStyle=n(f,-.3),a.lineWidth=1;for(var d=o+3;d<o+c;d+=3)a.beginPath(),a.moveTo(r+1,d),a.lineTo(r+i-1,d),a.stroke();l(a,r+i/2,o,r+i/2,o+c,n(f,-.4),1)}}function h(a,r,o,i,l,c,f,u){t(a,r,o,i,l,e(a,r,0,r+i,0,[0,n(c,.08),1,n(c,-.12)])),t(a,r-2,o-4,i+4,5,n(c,-.2));for(var d=o+8;d<o+l-20;d+=30)for(var h=r+6;h<r+i-14;h+=22)b(a,h,d,12,19,f()<.5?"#5f7d5a":"#6a7f62",f()<.4),t(a,h-3,d+19,18,2,n(c,-.3)),s(a,h-3,d+12,18,7,"#1f1a18")}function v(a,r,t,l,n,c){i(a,[r-5*c,t,r+5*c,t,r+3*c,l,r-3*c,l],e(a,r-6*c,0,r+6*c,0,[0,"#b9ad8c",1,"#7d7258"]));for(var f=0;f<12;f++)o(a,r+6*(n()-.5)*c,t-n()*(t-l),2*c,3*c,n()<.5?"#d8d0b4":"#6d634d");for(f=0;f<26;f++){var u=7*n(),d=n();o(a,r+Math.cos(u)*d*48*c,l-14*c+Math.sin(u)*d*28*c,(14+10*n())*c,(10+7*n())*c,["#5f7d3d","#76924a","#4c6a33","#8aa65a"][f%4])}}function T(a,r,c,f,u,d,s,b,h){var v=e(a,r-u/2,0,r+u/2,0,[0,n(d,.2),.45,d,1,n(d,-.35)]);a.beginPath(),a.moveTo(r-u/2,c),a.bezierCurveTo(r-.5*u,c-.55*(c-f),r-.3*u,f+14,r-.1*u,f),a.lineTo(r+.1*u,f),a.bezierCurveTo(r+.3*u,f+14,r+.5*u,c-.55*(c-f),r+u/2,c),a.closePath(),a.fillStyle=v,a.fill(),a.save(),a.clip();for(var T=c-6,g=0;T>f+16;T-=5.5,g++)for(var k=(c-T)/(c-f),m=u*(1-k*k*.75)*.9,p=-1;p<=1;p++){var C=r+p*m*.3+g%2*m*.12;i(a,[C-1.6,T,C+1.6,T-1.5,C+1.6,T-3.6,C-1.6,T-2.2],"rgba(30,22,18,.75)")}if(a.restore(),!h&&b){var P=f-.9*u;i(a,[r-.26*u,f+2,r+.26*u,f+2,r+.12*u,P+6,r-.12*u,P+6],"#d9c27a");for(var q=0;q<4;q++){t(a,r-.22*u+.5*q,f-q*(f-P)/4.5-3,.44*u-q,2,["#c23a2e","#e8e0c8","#d4a52a","#c23a2e"][q])}o(a,r,P+4,.16*u,.16*u,"#e6dccb"),o(a,r-.14*u,P+7,.09*u,.09*u,"#d4a52a"),o(a,r+.14*u,P+7,.09*u,.09*u,"#d4a52a"),l(a,r,P+2,r,P-6,"#f0e8d6",2),l(a,r-3,P-3,r+3,P-3,"#f0e8d6",2)}}return{sagrada:function(r,f,s){var b=a(1972);u(r,f,260,"#7fa9cf","#d7e2e4"),d(r,70,40,1),d(r,420,70,.8),d(r,230,18,.6),[[118,104],[140,96],[166,98],[188,108]].forEach(function(a){r.save(),r.beginPath(),r.rect(0,a[1],480,200),r.clip(),T(r,a[0],200,a[1]-60,18,"#d8c9ab",0,!1,!0),r.restore();var e=9*(1-.75*Math.pow((200-a[1])/160,2));t(r,a[0]-e,a[1]-2,2*e,3,"#b7a588")}),r.strokeStyle="rgba(70,55,40,.8)",r.lineWidth=.8;for(var g=106;g<=200;g+=6)r.beginPath(),r.moveTo(g,200),r.lineTo(g,80),r.stroke();for(var k=82;k<=200;k+=7)r.beginPath(),r.moveTo(104,k),r.lineTo(201,k),r.stroke();r.strokeStyle="#c99a1f",r.lineWidth=1.6,r.beginPath(),r.moveTo(212,205),r.lineTo(212,36),r.moveTo(217,205),r.lineTo(217,36),r.stroke(),r.lineWidth=.8;for(var m=205;m>40;m-=6)r.beginPath(),r.moveTo(212,m),r.lineTo(217,m-6),r.stroke();r.lineWidth=1.5,r.beginPath(),r.moveTo(150,38),r.lineTo(300,38),r.moveTo(150,42),r.lineTo(300,42),r.moveTo(214,22),r.lineTo(150,38),r.moveTo(214,22),r.lineTo(300,38),r.stroke(),t(r,186,37,12,9,"#7a7a7a"),t(r,206,44,16,8,"#c99a1f"),l(r,168,42,168,70,"#333",.8),t(r,164,70,8,5,"#555"),i(r,[372,205,372,150,384,140,396,132,412,128,428,132,440,140,448,150,448,205],e(r,372,0,448,0,[0,"#a99877",1,"#7e6f57"]));for(var p=0;p<7;p++){var C=376+11*p,P=120+5*Math.abs(p-3);i(r,[C-3,150,C,P,C+3,150],"#8d7d63"),o(r,C,P,2.4,2.4,p%2?"#c9a34a":"#b8473a")}for(p=0;p<5;p++)t(r,380+13*p,160,6,24,"#3b2f27"),o(r,383+13*p,160,3,3,"#3b2f27");r.beginPath(),r.moveTo(246,205),r.lineTo(246,130),r.quadraticCurveTo(275,120,290,104),r.lineTo(310,80),r.lineTo(330,104),r.quadraticCurveTo(345,120,374,130),r.lineTo(374,205),r.closePath(),r.fillStyle=e(r,246,0,374,0,[0,"#b3a383",.5,"#a08f72",1,"#7c6c55"]),r.fill();for(var q=0;q<160;q++)o(r,250+120*b(),112+90*b(),1+2.2*b(),1+1.6*b(),b()<.5?"rgba(60,45,35,.35)":"rgba(230,215,185,.3)");for([[268,150,18],[310,140,24],[352,150,18]].forEach(function(a){i(r,[a[0]-a[2],205,a[0]-a[2],a[1]+.7*a[2],a[0],a[1],a[0]+a[2],a[1]+.7*a[2],a[0]+a[2],205],"#4a3b30"),i(r,[a[0]-.6*a[2],205,a[0]-.6*a[2],a[1]+1.2*a[2],a[0],a[1]+.65*a[2],a[0]+.6*a[2],a[1]+1.2*a[2],a[0]+.6*a[2],205],"#2a211b")}),i(r,[310,84,302,118,318,118],"#4f7a4d"),i(r,[310,92,304,112,310,112],"#6c9a62"),q=0;q<6;q++)o(r,304+12*b(),95+22*b(),1.3,1,"#f3f0e6");for(T(r,262,200,46,26,"#9c8a6c",0,!0),T(r,358,200,46,26,"#93826a",0,!0),T(r,292,200,28,28,"#a69476",0,!0),T(r,328,200,28,28,"#9a8a6e",0,!0),h(r,0,92,96,160,"#d9c3a0",b),h(r,452,105,40,150,"#cfb593",b),t(r,90,196,364,46,e(r,0,196,0,242,[0,"#cdb995",1,"#b39d79"])),t(r,90,193,364,5,"#9d8768"),q=0;q<20;q++)l(r,95+350*b(),205+30*b(),98+350*b(),207+30*b(),"rgba(90,70,50,.18)",1);for(t(r,300,204,40,38,"#6b4a33"),q=0;q<6;q++)l(r,302+7*q,205,302+7*q,241,"#4f3524",1);for(t(r,350,208,36,22,"#e7dcc0"),r.fillStyle="#7a2a22",r.font="bold 6px sans-serif",r.fillText("OBRES",357,218),r.fillText("TEMPLE",355,226),t(r,0,242,f,26,"#c4b8a4"),q=0;q<f;q+=16)l(r,q,242,q-6,268,"rgba(0,0,0,.08)",1);t(r,0,266,f,4,"#9a8f80"),t(r,0,270,f,70,e(r,0,270,0,340,[0,"#7d7a75",1,"#5f5c58"])),v(r,46,260,130,b,1.05),v(r,452,262,150,b,.9),function(a,r,c,f,u){a.save(),a.translate(r,c),a.scale(f,f),o(a,52,2,58,5,"rgba(0,0,0,.3)"),a.beginPath(),a.moveTo(0,-6),a.quadraticCurveTo(-2,-24,12,-26),a.quadraticCurveTo(22,-46,48,-46),a.quadraticCurveTo(78,-46,86,-28),a.quadraticCurveTo(104,-26,104,-8),a.lineTo(104,-4),a.lineTo(0,-4),a.closePath(),a.fillStyle=e(a,0,-46,0,0,[0,n(u,.3),.5,u,1,n(u,-.3)]),a.fill(),i(a,[24,-27,32,-42,50,-42,50,-27],"#3f5560"),i(a,[54,-27,54,-42,72,-42,82,-27],"#3f5560"),l(a,30,-40,46,-40,"rgba(255,255,255,.35)",1.5),l(a,52,-27,52,-6,"rgba(0,0,0,.3)",1),t(a,42,-20,6,1.6,"#ddd"),t(a,-2,-10,10,4,"#ccc"),t(a,96,-10,10,4,"#ccc"),o(a,5,-20,4,3,"#f5f0d8"),[22,82].forEach(function(e){o(a,e,-4,10,10,"#1a1a1a"),o(a,e,-4,5,5,"#bbb")}),a.restore()}(r,330,312,1.25,"#9fbcc9");var y=c(r,{x:168,y:334,h:178,skin:"#ddb08a",hair:"back",hc:"#211813",top:"#f3f1ea",low:"trousers",lc:"#77797b",shoe:"#2d221c",expr:"laugh",mou:1,crinkle:1,brow:.12,collar:"#ffffff",sw:.13,turn:.25,belt:"#3a2a20",arms:{r:{t:[.22,-.3],b:1},l:{t:[.02,.3]}}});t(r,y.r[0]-2,y.r[1]-12,3.5,10,"#ddb08a");var S=c(r,{x:246,y:334,h:150,skin:"#e9c29a",hair:"bob",hc:"#120d0b",top:"#e7a7a0",low:"dress",print:"#fff6ea",collar:"#e7a7a0",shoe:"#7a2f2a",expr:"up",turn:.35,lips:"rgba(170,50,50,.5)",arms:{r:{abs:[256,189],b:1,short:1},l:{t:[.02,.3],short:1}}});o(r,251,189.5,8,2.6,"#e9c29a",-.1),i(r,[S.l[0]-9,S.l[1]+2,S.l[0]+9,S.l[1]+2,S.l[0]+11,S.l[1]+20,S.l[0]-11,S.l[1]+20],"#6e3b27")},noodles:function(f,d,h){var v=a(1979),T="#e2cfae",g=300;function k(a,e,r,o,t,i){return function(l,n){var c=r+(o-r)*l;return[a+(e-a)*l,c+(t+(i-t)*l-c)*n]}}function m(a,e,r,o,t,l){var n=a(e,r),c=a(o,r),u=a(o,t),d=a(e,t);i(f,[n[0],n[1],c[0],c[1],u[0],u[1],d[0],d[1]],l)}u(f,d,120,"#86afd2","#cfdde6");var p=k(0,150,50,0,286,g),C=k(330,480,0,50,g,286);i(f,[0,50,150,0,150,g,0,286],e(f,0,0,150,0,[0,"#bda784",1,"#cdb894"])),i(f,[330,0,480,50,480,286,330,g],e(f,330,0,480,0,[0,"#d6c19e",1,"#b39c78"])),t(f,150,0,180,g,e(f,150,0,330,0,[0,n(T,.1),1,n(T,-.05)])),[p,C].forEach(function(a){for(var e=0;e<3;e++)for(var r=.03+.2*e,o=0;o<3;o++){var t=.12+.3*o;m(a,t,r,t+.13,r+.13,"#61805d"),m(a,t+.02,r+.015,t+.11,r+.13,v()<.4?"#2d241e":"#6f8d68"),m(a,t-.03,r+.13,t+.16,r+.145,"#8f7c62"),m(a,t-.03,r+.095,t+.16,r+.1,"#1f1a18")}m(a,0,.6,1,.63,"#a6916f");for(var i=0;i<3;i++)m(a,.1+.3*i,.68,.26+.3*i,.97,"#3a2e26")});for(var P=0;P<3;P++){var q=8+52*P;[178,262].forEach(function(a,e){b(f,a,q,26,38,"#5d7e59",(P+e)%2==0)}),t(f,160,q+38,160,5,"#9a8466"),t(f,164,q+43,152,3,"rgba(0,0,0,.2)"),s(f,162,q+24,156,14,"#1d1816"),o(f,172+40*P,q+22,6,4,"#c0392b"),t(f,168+40*P,q+23,8,4,"#a0522d")}t(f,300,60,18,10,"#f2eee5"),l(f,300,60,320,60,"#555",.6),f.strokeStyle="#a58c68",f.lineWidth=2,f.beginPath();for(var y=150;y<330;y+=20)f.moveTo(y,6),f.quadraticCurveTo(y+10,-2,y+20,6);f.stroke(),t(f,150,162,180,138,"#7b2a1f"),t(f,154,166,172,30,e(f,0,166,0,196,[0,"#d23a2c",1,"#a82317"])),f.strokeStyle="#e8c35a",f.lineWidth=1.5,f.strokeRect(157,168,166,26),f.fillStyle="#f2d36b",f.font="bold 18px serif",f.textAlign="center",f.fillText("婆婆麵家",240,184),f.fillStyle="#f4ead2",f.font="bold 8px sans-serif",f.fillText("FIDEUS POPO",240,193),f.textAlign="left";var S=e(f,0,212,0,300,[0,"#f2c27a",1,"#a8642f"]);t(f,158,214,52,76,S),t(f,270,214,52,76,S),t(f,216,214,48,86,e(f,0,214,0,300,[0,"#d9a060",1,"#6e3f22"])),t(f,270,262,52,28,"#6b3a22"),o(f,296,258,15,5,"#555"),t(f,281,244,30,15,e(f,281,0,311,0,[0,"#b8b8b8",1,"#666"])),o(f,296,244,15,4,"#8a8a8a"),f.strokeStyle="rgba(255,255,255,.7)",f.lineWidth=3;for(var x=0;x<3;x++)f.beginPath(),f.moveTo(288+8*x,240),f.bezierCurveTo(282+8*x,230,296+8*x,224,290+8*x,214),f.stroke();for(x=0;x<4;x++)t(f,166+11*x,224,7,14,x%2?"#c8a26a":"#e8d2a0");function M(a,e,i){l(f,a,e-12*i,a,e-6*i,"#3a2a1a",1),o(f,a,e,8*i,9*i,r(f,a-2*i,e-2*i,1,10*i,[0,"#ff7a55",1,"#b31d14"])),t(f,a-4*i,e-10*i,8*i,2.5*i,"#e3b341"),t(f,a-4*i,e+8*i,8*i,2.5*i,"#e3b341"),l(f,a,e+10*i,a,e+17*i,"#e3b341",1.4)}t(f,162,238,44,2,"#5a3a22"),f.fillStyle="#7b2a1f",[158,210,264,322].forEach(function(a){f.fillRect(a-3,212,6,88)}),f.fillStyle="#ffffff",f.font="bold 7px sans-serif",f.fillText("OBERT",164,252),i(f,[0,286,150,g,330,g,480,286,480,312,0,312],"#bdb2a0"),t(f,0,312,d,4,"#8f8577"),t(f,0,316,d,24,"#6e6b66"),M(170,198,1.15),M(310,198,1.15),[{x:22,h:88,skin:"#e0b18d",hair:"short",hc:"#4a3a30",top:"#4e6c8a",lc:"#3a3a40",turn:.7},{x:44,h:70,kid:1,skin:"#e8be97",hair:"kid",hc:"#5a3d2a",top:"#d9a338",lc:"#3d5c8a",turn:.6},{x:66,h:100,skin:"#dcae88",hair:"bun",hc:"#cfcac2",top:"#2c2a2e",low:"skirt",lc:"#2c2a2e",tights:"#5a4d48",turn:.6},{x:96,h:108,skin:"#dcac85",hair:"short",hc:"#2b211b",top:"#8a7760",lc:"#4b4a4a",turn:.5,mou:1},{x:126,h:80,kid:1,skin:"#e8be97",hair:"pig",hc:"#2a1d16",top:"#cf5a5a",low:"skirt",lc:"#3b6aa0",turn:.5},{x:146,h:112,skin:"#e6bb94",hair:"shoulder",hc:"#6a4228",top:"#7aa36a",low:"skirt",lc:"#7a5a3a",turn:.4}].forEach(function(a,e){a.y=292+4*e,a.expr="smile",2===e&&(a.arms={r:{t:[.12,.3]}}),3===e&&(a.arms={l:{t:[-.05,.22]},r:{t:[-.08,.22]}});var r=c(f,a);if(2===e&&l(f,r.r[0],r.r[1],r.r[0]+4,a.y,"#3a2a20",2),3===e){i(f,[r.l[0]-2,r.l[1]-14,r.r[0]+6,r.r[1]-16,r.r[0]+6,r.r[1]+2,r.l[0]-2,r.l[1]+4],"#ece6d6");for(var o=0;o<4;o++)l(f,r.l[0]+1,r.l[1]-10+4*o,r.r[0]+3,r.r[1]-12+4*o,"rgba(0,0,0,.35)",.8)}}),f.strokeStyle="#8a6a44",f.lineWidth=4,f.beginPath(),f.moveTo(352,330),f.lineTo(372,236),f.lineTo(392,330),f.stroke(),f.lineWidth=3;for(var w=0;w<4;w++){var W=250+21*w;f.beginPath(),f.moveTo(372-.21*(W-236),W),f.lineTo(372+.21*(W-236),W),f.stroke()}t(f,360,234,24,5,"#7a5a38"),c(f,{x:372,y:236,h:132,skin:"#dcac85",hair:"back",hc:"#231a14",top:"#3f5f8a",low:"trousers",lc:"#5a5b5e",expr:"smile",mou:1,crinkle:1,brow:.12,turn:-.6,sw:.13,buttons:"#d9d2c2",arms:{l:{abs:[344,150],b:1},r:{abs:[356,158],b:-1}}}),l(f,344,150,344,166,"#3a2a1a",1),M(344,178,1.15),c(f,{x:240,y:330,h:128,skin:"#e9c29a",hair:"shoulder",hc:"#120d0b",top:"#c45a4a",low:"skirt",lc:"#4b4a63",apron:"#f2ece0",expr:"open",turn:-.1,lips:"rgba(170,50,50,.45)",arms:{l:{t:[.12,.26],b:1},r:{t:[.18,.06],b:1}}}),c(f,{x:206,y:330,h:80,kid:1,skin:"#ecc59d",hair:"kid",hc:"#100b09",top:"#f1d34b",low:"skirt",lc:"#d65a7a",tights:"#f3f0ea",shoe:"#8a2a2a",expr:"smile",turn:.55,arms:{r:{abs:[226,290],b:1},l:{t:[.03,.3]}}})},girls:function(n,f,d){var s=a(1983);u(n,f,60,"#79a8d6","#bcd4e8"),t(n,0,46,f,200,e(n,0,46,0,246,[0,"#f7f3ea",1,"#e8e0d0"])),t(n,0,42,f,8,"#d9cdb9"),t(n,0,40,f,3,"#b8553a");for(var h=0;h<30;h++)o(n,s()*f,60+170*s(),4+10*s(),2+4*s(),"rgba(180,165,140,.12)");b(n,36,82,44,64,"#4f7b54",!0),t(n,32,146,52,4,"#c8bba5"),t(n,404,90,50,156,"#5c7a5a"),t(n,409,96,40,60,"#4a6649"),t(n,409,166,40,74,"#4a6649"),o(n,442,172,2.5,2.5,"#c9a64a"),o(n,300,120,80,46,"rgba(120,110,90,.12)"),t(n,0,240,f,100,"#c56f4b"),n.strokeStyle="rgba(90,40,25,.4)",n.lineWidth=1;for(var v=240,T=0;v<340;T++)n.beginPath(),n.moveTo(0,v),n.lineTo(f,v),n.stroke(),v+=10+4*T;for(h=-14;h<=14;h++)n.beginPath(),n.moveTo(240+22*h,240),n.lineTo(240+60*h,340),n.stroke();function g(a,e,r){i(n,[a-10*r,e-16*r,a+10*r,e-16*r,a+7*r,e,a-7*r,e],"#b8643c"),t(n,a-11*r,e-18*r,22*r,4*r,"#a5532f");for(var l=0;l<9;l++)o(n,a+26*(s()-.5)*r,e-22*r-12*s()*r,6*r,4*r,l%2?"#4f7a3a":"#6a9646");for(l=0;l<5;l++)for(var c=a+22*(s()-.5)*r,f=e-30*r-10*s()*r,u=0;u<5;u++)o(n,c+3*Math.cos(1.3*u)*r,f+3*Math.sin(1.3*u)*r,2.4*r,2.4*r,u%2?"#e0283a":"#f0485a")}g(110,250,1.1),g(140,252,.9),g(380,250,1.1),g(460,254,1.2),g(60,40,.8),g(150,40,.7),g(330,40,.8),g(440,40,.75),o(n,250,312,120,14,"rgba(70,30,20,.25)");var k=240;for(i(n,[228,312,252,312,248,150,243,96,236,96,232,150],e(n,228,0,252,0,[0,"#a99778",.45,"#8a7558",1,"#5e4c38"])),l(n,k,110,200,70,"#6e5a42",6),l(n,k,104,286,62,"#6e5a42",6),l(n,220,88,180,80,"#6e5a42",3),h=0;h<70;h++){var m=7*s(),p=Math.sqrt(s());o(n,k+Math.cos(m)*p*110,60+Math.sin(m)*p*44,9+5*s(),5+3*s(),["#3f6a2e","#5a8a3a","#2f5426","#6f9e48"][h%4],3*s())}for(h=0;h<16;h++){var C=7*s(),P=.85*Math.sqrt(s()),q=k+Math.cos(C)*P*100,y=64+Math.sin(C)*P*38;o(n,q,y,5.5,4.2,r(n,q-1.5,y-1.5,.5,6,[0,"#fff27a",1,"#e0b818"]),.4)}var S=[[200,"6·80"],[186,"6·81"],[176,"5·82"],[212,"5·82"],[196,"5·83"],[162,"5·83"]];n.font="bold 6px sans-serif",n.fillStyle="#2a2420",S.forEach(function(a){l(n,233,a[0],247,a[0],"#262220",1.4),n.fillText(a[1],234,a[0]-2)}),c(n,{x:256,y:316,h:120,kid:1,skin:"#eac39b",hair:"pig",hc:"#120c09",top:"#6fa7d8",low:"skirt",lc:"#e37a8b",tights:"#f4f0e8",shoe:"#c23b3b",expr:"smile",turn:.95,sw:.09,arms:{l:{t:[0,.3],short:1},r:{t:[.04,.3],short:1}}}),c(n,{x:226,y:318,h:154,kid:1,skin:"#e8c098",hair:"kid",hc:"#100a08",top:"#f2e2a8",low:"trousers",lc:"#3d5f92",shoe:"#e9e6df",expr:"laugh",turn:-.95,sw:.09,wide:.7,arms:{l:{t:[.03,.3],short:1},r:{t:[0,.3],short:1}}}),S.slice(-1).forEach(function(a){l(n,233,a[0],249,a[0],"#262220",1.6)}),c(n,{x:156,y:326,h:182,skin:"#dcac85",hair:"back",hc:"#221913",top:"#f4f2ec",low:"trousers",lc:"#6d6f72",expr:"smile",mou:1,crinkle:1,brow:.12,turn:.55,sw:.13,collar:"#fff",belt:"#3b2b20",arms:{r:{abs:[236,161],b:1},l:{t:[.08,.28]}}}),l(n,234,163,242,160,"#e2b23a",2.4),c(n,{x:334,y:322,h:152,skin:"#e9c29a",hair:"shoulder",hc:"#120d0b",top:"#d98e5b",low:"skirt",lc:"#5a4e70",apron:"#f2ece0",towel:"#7fb3d6",expr:"laugh",turn:-.5,lips:"rgba(170,50,50,.45)",arms:{l:{abs:[318,222],b:1,short:1},r:{t:[0,.18],b:-1,short:1}}})}}}());Object.assign(window.POPO_PHOTOS = window.POPO_PHOTOS || {},(function () {
function rng(a) { return function () { a |= 0; a = a+0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15,1 | a); t = t + Math.imul(t ^ t >>> 7,61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function lg(c,x0,y0,x1,y1,st) { var g = c.createLinearGradient(x0,y0,x1,y1); for (var i = 0; i < st.length; i += 2) g.addColorStop(st[i],st[i+1]); return g; }
function rg(c,x,y,r0,r,st) { var g = c.createRadialGradient(x,y,r0,x,y,r); for (var i = 0; i < st.length; i += 2) g.addColorStop(st[i],st[i+1]); return g; }
function el(c,x,y,rx,ry,f,rot) { c.beginPath(); c.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot || 0,0,7); if (f) { c.fillStyle = f; c.fill(); } }
function ln(c,pts,w,s,cap) { c.beginPath(); c.moveTo(pts[0],pts[1]); for (var i = 2; i < pts.length; i += 2) c.lineTo(pts[i],pts[i+1]); c.lineWidth = w; c.strokeStyle = s; c.lineCap = cap || 'round'; c.lineJoin = 'round'; c.stroke(); }
function poly(c,pts,f) { c.beginPath(); c.moveTo(pts[0],pts[1]); for (var i = 2; i < pts.length; i += 2) c.lineTo(pts[i],pts[i+1]); c.closePath(); if (f) { c.fillStyle = f; c.fill(); } }
function ik(sx,sy,tx,ty,a,b,side) {
var dx = tx-sx,dy = ty-sy,d = Math.sqrt(dx*dx+dy*dy); d = Math.min(Math.max(d,0.01),a+b-0.01);
var ang = Math.atan2(dy,dx),k = Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b) / (2*a*d))));
var e = ang+k*side; return [sx + Math.cos(e)*a,sy + Math.sin(e)*a];
}
function shade(hex,f) { var n = parseInt(hex.slice(1),16),r = n >> 16,g = n >> 8 & 255,b = n & 255;
function m(v) { return Math.round(f < 0 ? v*(1+f) : v+(255-v)*f); } return 'rgb('+m(r) + ','+m(g) + ','+m(b) + ')'; }

function head(c,o) {
var x = o.x,y = o.y,u = o.u,sk = o.skin || '#e8b98f',hr = o.hair || '#1b1410',lk = (o.look || 0)*u,up = (o.up || 0)*u;
var hs = o.hs || 'short';
c.fillStyle = hr;
if (hs == 'bob' || hs == 'fringe') { c.beginPath(); c.ellipse(x,y+0.1*u,1.12*u,1.2*u,0,Math.PI*1.05,Math.PI*1.95,false); c.lineTo(x+1.1*u,y+0.95*u); c.quadraticCurveTo(x,y+1.15*u,x-1.1*u,y+0.95*u); c.closePath(); c.fill(); }
if (hs == 'shoulder') { c.beginPath(); c.moveTo(x-1.1*u,y-0.2*u); c.quadraticCurveTo(x-1.4*u,y+1.4*u,x-1.3*u,y+1.9*u); c.lineTo(x+1.3*u,y+1.9*u); c.quadraticCurveTo(x+1.4*u,y+1.4*u,x+1.1*u,y-0.2*u); c.closePath(); c.fill(); }
if (hs == 'pony') { el(c,x+1.0*u,y+0.3*u,0.4*u,0.9*u,hr,-0.4); }
if (hs == 'perm') { for (var i = 0; i < 11; i++) { var a = Math.PI*(0.85+i*0.13); el(c,x + Math.cos(a)*1.05*u,y-0.1*u + Math.sin(a)*1.05*u+(i < 2 || i > 8 ? 0.5*u : 0),0.42*u,0.42*u,hr); } }
if (o.back) { el(c,x,y,1.0*u,1.1*u,hr); return; }
c.fillStyle = shade(sk,-0.18); c.fillRect(x-0.38*u,y+0.6*u,0.76*u,0.9*u);
el(c,x-0.92*u+lk*0.3,y+0.12*u,0.2*u,0.3*u,shade(sk,-0.1)); el(c,x+0.92*u+lk*0.3,y+0.12*u,0.2*u,0.3*u,shade(sk,-0.1));
el(c,x,y,0.92*u,1.05*u,rg(c,x-0.3*u+lk*0.4,y-0.35*u,0.1*u,1.3*u,[0,shade(sk,0.18),0.6,sk,1,shade(sk,-0.22)]));
if (o.old) { c.strokeStyle = shade(sk,-0.3); c.lineWidth = Math.max(0.6,u*0.05); c.beginPath(); c.moveTo(x-0.45*u+lk,y+0.3*u); c.quadraticCurveTo(x-0.5*u+lk,y+0.55*u,x-0.35*u+lk,y+0.7*u); c.moveTo(x+0.45*u+lk,y+0.3*u); c.quadraticCurveTo(x+0.5*u+lk,y+0.55*u,x+0.35*u+lk,y+0.7*u); c.stroke(); }
el(c,x-0.5*u+lk,y+0.35*u,0.22*u,0.13*u,'rgba(225,110,100,0.35)'); el(c,x+0.5*u+lk,y+0.35*u,0.22*u,0.13*u,'rgba(225,110,100,0.35)');
var ey = y+0.05*u-up*0.2,ex = 0.36*u,ew = Math.max(0.6,u*0.09);
var bc = o.brow || hr,bw = Math.max(0.8,u*(o.thickBrow ? 0.16 : 0.1)),br = o.browRaise ? 0.12*u : 0;
ln(c,[x-ex-0.22*u+lk,ey-0.26*u-br,x-ex+lk,ey-0.4*u-br,x-ex+0.2*u+lk,ey-0.4*u-br*1.5],bw,bc);
ln(c,[x+ex-0.2*u+lk,ey-0.4*u-br*1.5,x+ex+lk,ey-0.4*u-br,x+ex+0.22*u+lk,ey-0.26*u-br],bw,bc);
for (var s = -1; s <= 1; s += 2) {
var cx = x+s*ex+lk;
if (o.eyes == 'happy' || o.eyes == 'closed') { c.beginPath(); if (o.eyes == 'happy') c.arc(cx,ey+0.06*u,0.14*u,Math.PI*1.1,Math.PI*1.9); else c.arc(cx,ey-0.03*u,0.14*u,Math.PI*0.1,Math.PI*0.9); c.lineWidth = ew*1.3; c.strokeStyle = '#2a1a14'; c.stroke(); }
else { el(c,cx,ey,0.17*u,0.12*u,'#f6efe6'); el(c,cx+lk*0.12,ey-up*0.12,0.1*u,0.11*u,'#2a1810'); el(c,cx+lk*0.12-0.03*u,ey-up*0.12-0.04*u,0.03*u,0.03*u,'#fff');
ln(c,[cx-0.17*u,ey-0.04*u,cx,ey-0.12*u,cx+0.17*u,ey-0.04*u],ew*0.8,'#2a1a14'); }
if (o.crinkle) ln(c,[x+s*(ex+0.24*u)+lk,ey-0.02*u,x+s*(ex+0.32*u)+lk,ey+0.08*u],ew*0.7,shade(sk,-0.35));
}
if (o.glasses) { c.strokeStyle = o.glasses; c.lineWidth = Math.max(0.8,u*0.08); c.beginPath(); c.arc(x-ex+lk,ey,0.25*u,0,7); c.moveTo(x+ex+lk+0.25*u,ey); c.arc(x+ex+lk,ey,0.25*u,0,7); c.stroke(); }
ln(c,[x+lk*1.1+0.03*u,ey+0.12*u,x+lk*1.15+0.1*u,ey+0.38*u,x+lk*1.1-0.06*u,ey+0.43*u],Math.max(0.6,u*0.07),shade(sk,-0.3));
var my = y+0.62*u,mx = x+lk*1.05;
if (o.mous) { c.fillStyle = o.mousC || hr; c.beginPath(); c.moveTo(mx-0.32*u,my-0.02*u); c.quadraticCurveTo(mx,my-0.22*u,mx+0.32*u,my-0.02*u); c.quadraticCurveTo(mx,my-0.09*u,mx-0.32*u,my-0.02*u); c.fill(); }
var m = o.mouth || 'smile';
if (m == 'smile') { c.beginPath(); c.arc(mx,my-0.14*u,0.24*u,Math.PI*0.2,Math.PI*0.8); c.lineWidth = Math.max(0.8,u*0.08); c.strokeStyle = '#7a3428'; c.stroke(); }
if (m == 'grin' || m == 'open') { c.beginPath(); c.moveTo(mx-0.26*u,my-0.04*u); c.quadraticCurveTo(mx,my+(m == 'open' ? 0.42 : 0.28)*u,mx+0.26*u,my-0.04*u); c.closePath(); c.fillStyle = '#6a2020'; c.fill(); c.fillStyle = '#fff'; c.fillRect(mx-0.18*u,my-0.03*u,0.36*u,0.07*u); }
if (m == 'o') el(c,mx,my+0.04*u,0.12*u,0.16*u,'#6a2020');
if (m == 'flat') ln(c,[mx-0.16*u,my,mx+0.16*u,my+0.02*u],Math.max(0.8,u*0.07),'#7a3428');
c.fillStyle = hr;
if (hs == 'short' || hs == 'wavy') { c.beginPath(); c.moveTo(x-0.95*u,y+0.05*u); c.quadraticCurveTo(x-1.05*u,y-1.25*u,x+0.1*u,y-1.22*u); c.quadraticCurveTo(x+1.1*u,y-1.15*u,x+0.95*u,y+0.05*u); c.quadraticCurveTo(x+0.85*u,y-0.55*u,x+0.3*u,y-0.7*u); c.quadraticCurveTo(x-0.3*u,y-0.82*u,x-0.8*u,y-0.5*u); c.closePath(); c.fill();
if (hs == 'wavy') { c.strokeStyle = shade(hr,0.25); c.lineWidth = Math.max(0.6,u*0.06); for (var w = 0; w < 3; w++) { c.beginPath(); c.moveTo(x-0.6*u+w*0.35*u,y-0.85*u); c.quadraticCurveTo(x-0.4*u+w*0.35*u,y-1.2*u,x-0.05*u+w*0.38*u,y-1.1*u); c.stroke(); } } }
if (hs == 'bob' || hs == 'shoulder') { c.beginPath(); c.moveTo(x-1.0*u,y+0.5*u); c.quadraticCurveTo(x-1.15*u,y-1.3*u,x+0.2*u,y-1.2*u); c.quadraticCurveTo(x+1.15*u,y-1.05*u,x+1.0*u,y+0.5*u); c.quadraticCurveTo(x+0.85*u,y-0.4*u,x+0.5*u,y-0.65*u); c.quadraticCurveTo(x-0.2*u,y-0.6*u,x-0.3*u,y-0.95*u); c.quadraticCurveTo(x-0.7*u,y-0.5*u,x-0.85*u,y-0.1*u); c.closePath(); c.fill(); }
if (hs == 'fringe' || hs == 'pony') { c.beginPath(); c.moveTo(x-1.0*u,y+0.4*u); c.quadraticCurveTo(x-1.15*u,y-1.3*u,x,y-1.2*u); c.quadraticCurveTo(x+1.15*u,y-1.3*u,x+1.0*u,y+0.4*u); c.lineTo(x+0.85*u,y-0.42*u); c.lineTo(x-0.85*u,y-0.42*u); c.closePath(); c.fill(); }
if (hs == 'perm') { for (var j = 0; j < 7; j++) el(c,x-0.75*u+j*0.25*u,y-0.85*u - Math.sin(j / 6*Math.PI)*0.3*u,0.3*u,0.28*u,hr); }
if (hs == 'balding') { c.fillStyle = hr; el(c,x-0.85*u,y-0.2*u,0.2*u,0.4*u,hr); el(c,x+0.85*u,y-0.2*u,0.2*u,0.4*u,hr); }
if (o.hat == 'sun') { el(c,x,y-0.85*u,2.0*u,0.42*u,lg(c,x-2*u,0,x+2*u,0,[0,'#f0dca0',1,'#c9a865']),-0.08); c.beginPath(); c.ellipse(x,y-1.0*u,0.95*u,0.85*u,0,Math.PI,0); c.fillStyle = '#e8cf8e'; c.fill(); ln(c,[x-0.93*u,y-1.02*u,x+0.93*u,y-1.1*u],u*0.22,'#c0392b','butt'); }
}

function person(c,o) {
var u = o.u,x = o.x,y = o.y,k = o.kid ? 0.82 : 1,sk = o.skin || '#e8b98f';
var sy = y+1.55*u,sw = (o.wide || 1.45)*u*k,hy = sy+3.2*u*k,hw = 1.15*u*k,L = 5.0*u*k;
var top = o.top || '#ffffff',bot = o.botC || '#555';
var hip = { x: x+(o.hipDx || 0)*u,y: hy };
var a1 = 1.8*u*k,a2 = 1.7*u*k;
function leg(side,ft) {
var px = hip.x+side*0.55*u*k,py = hip.y-0.2*u;
var t = ft || [px+side*0.25*u,py + L];
var kn = ik(px,py,t[0],t[1],L / 2,L / 2,o.kneeSide || side*(t[0] > px ? -1 : 1)*-1);
var lc = (o.bot == 'trousers') ? bot : sk;
ln(c,[px,py,kn[0],kn[1],t[0],t[1]],1.0*u*k,lc);
if (o.bot == 'trousers') ln(c,[px,py,kn[0],kn[1]],1.05*u*k,shade(bot,0.08));
el(c,t[0]+side*0.15*u,t[1]+0.1*u,0.5*u*k,0.25*u,o.shoe || (o.bot == 'trousers' ? '#2a211b' : shade(sk,-0.1)));
}
if (o.legs !== false) { leg(-1,o.lf); leg(1,o.rf); }
function arm(side,t,front) {
var px = x+side*(sw-0.35*u),py = sy+0.25*u;
if (!t) t = [px+side*0.45*u,py+a1+a2-0.3*u];
var e = o.elb ? ik(px,py,t[0],t[1],a1,a2,o.elb[side < 0 ? 0 : 1]) : ik(px,py,t[0],t[1],a1,a2,side*(o.elbowIn && o.elbowIn[side < 0 ? 0 : 1] ? 1 : -1)*(t[1] < py ? -1 : 1)*-1);
var sl = o.sleeve || 'short';
ln(c,[px,py,e[0],e[1],t[0],t[1]],0.78*u*k,sk);
if (sl == 'long') ln(c,[px,py,e[0],e[1],t[0]+(e[0]-t[0])*0.12,t[1]+(e[1]-t[1])*0.12],0.92*u*k,o.sleeveC || top);
if (sl == 'short') ln(c,[px,py,px+(e[0]-px)*0.5,py+(e[1]-py)*0.5],0.98*u*k,o.sleeveC || top);
el(c,t[0],t[1],0.42*u*k,0.42*u*k,shade(sk,0.05));
return t;
}
var g = lg(c,x-sw,0,x+sw,0,[0,shade(top,0.15),0.55,top,1,shade(top,-0.25)]);
c.beginPath(); c.moveTo(x-sw+0.3*u,sy); c.quadraticCurveTo(x-sw,sy,x-sw,sy+0.6*u);
c.lineTo(x-hw,hy); c.lineTo(x+hw,hy); c.lineTo(x+sw,sy+0.6*u); c.quadraticCurveTo(x+sw,sy,x+sw-0.3*u,sy); c.closePath();
c.fillStyle = o.bare ? lg(c,x-sw,0,x+sw,0,[0,shade(sk,0.12),0.6,sk,1,shade(sk,-0.2)]) : g; c.fill();
if (o.stripes) { c.save(); c.clip(); for (var i = 0; i < 8; i++) { c.fillStyle = o.stripes; c.fillRect(x-sw,sy+0.3*u+i*0.55*u,2*sw,0.22*u); } c.restore(); }
if (o.print) { c.save(); c.clip(); var r = rng(7); for (var p = 0; p < 30; p++) el(c,x-sw+r()*2*sw,sy+r()*3.4*u,0.09*u,0.09*u,o.print); c.restore(); }
if (o.bare && !o.kid) { ln(c,[x-0.5*u,sy+0.9*u,x-0.1*u,sy+1.1*u],0.08*u,shade(sk,-0.18)); ln(c,[x+0.5*u,sy+0.9*u,x+0.1*u,sy+1.1*u],0.08*u,shade(sk,-0.18)); }
if (o.vneck) poly(c,[x-0.45*u,sy,x+0.45*u,sy,x,sy+0.9*u],sk);
if (o.collar) { poly(c,[x-0.55*u,sy-0.05*u,x,sy+0.55*u,x-0.05*u,sy-0.1*u],o.collar); poly(c,[x+0.55*u,sy-0.05*u,x,sy+0.55*u,x+0.05*u,sy-0.1*u],o.collar); }
if (o.cardi) { poly(c,[x-sw,sy+0.5*u,x-sw+0.3*u,sy,x-0.35*u,sy,x-0.5*u,hy,x-hw,hy],o.cardi); poly(c,[x+sw,sy+0.5*u,x+sw-0.3*u,sy,x+0.35*u,sy,x+0.5*u,hy,x+hw,hy],shade(o.cardi,-0.15)); }
if (o.apron) { c.beginPath(); c.moveTo(x-0.75*u,sy+0.5*u); c.lineTo(x+0.75*u,sy+0.5*u); c.lineTo(x+0.95*u,hy); c.lineTo(x+1.05*u,hy+2.2*u); c.lineTo(x-1.05*u,hy+2.2*u); c.lineTo(x-0.95*u,hy); c.closePath(); c.fillStyle = o.apron; c.fill(); ln(c,[x-0.7*u,sy+0.5*u,x-0.35*u,sy-0.05*u],0.12*u,o.apron); ln(c,[x+0.7*u,sy+0.5*u,x+0.35*u,sy-0.05*u],0.12*u,o.apron); }
if (o.bot == 'trunks') { poly(c,[x-hw-0.05*u,hy-0.5*u,x+hw+0.05*u,hy-0.5*u,x+hw+0.25*u,hy+1.0*u,x+0.1*u,hy+0.9*u,x,hy+0.4*u,x-0.1*u,hy+0.9*u,x-hw-0.25*u,hy+1.0*u],bot); }
if (o.bot == 'swim') { poly(c,[x-hw,hy-0.3*u,x+hw,hy-0.3*u,x+hw*0.9,hy+0.5*u,x,hy+0.7*u,x-hw*0.9,hy+0.5*u],top); }
if (o.bot == 'trousers') { poly(c,[x-hw,hy-0.3*u,x+hw,hy-0.3*u,x+hw+0.1*u,hy+0.6*u,x-hw-0.1*u,hy+0.6*u],bot); }
if (o.bot == 'skirt' && !o.apron) { poly(c,[x-hw,hy-0.3*u,x+hw,hy-0.3*u,x+hw+0.9*u,hy+2.4*u,x-hw-0.9*u,hy+2.4*u],lg(c,x-2*u,0,x+2*u,0,[0,shade(bot,0.12),1,shade(bot,-0.25)])); }
if (o.apron && o.bot == 'skirt') { poly(c,[x-hw,hy-0.3*u,x+hw,hy-0.3*u,x+hw+0.7*u,hy+2.4*u,x-hw-0.7*u,hy+2.4*u],bot); c.beginPath(); c.moveTo(x-0.95*u,hy); c.lineTo(x+0.95*u,hy); c.lineTo(x+1.15*u,hy+2.2*u); c.lineTo(x-1.15*u,hy+2.2*u); c.closePath(); c.fillStyle = o.apron; c.fill(); }
if (o.belt) ln(c,[x-hw-0.05*u,hy-0.3*u,x+hw+0.05*u,hy-0.3*u],0.3*u,o.belt,'butt');
if (o.beforeArms) o.beforeArms();
var h1 = arm(-1,o.lh),h2 = arm(1,o.rh);
head(c,o);
if (o.afterHead) o.afterHead(h1,h2);
return { lh: h1,rh: h2,hip: hip,sy: sy };
}

function wave(c,x,y,w,col) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(x,y,6,-2.4,-1.6); c.stroke(); c.beginPath(); c.arc(x,y,10,-2.4,-1.6); c.stroke(); }

function tossa(c,W,H) {
var R = rng(1984);
c.fillStyle = lg(c,0,0,0,150,[0,'#5c9fd8',1,'#cfe6f2']); c.fillRect(0,0,W,160);
for (var i = 0; i < 5; i++) el(c,30+i*70 + R()*20,30 + R()*25,30 + R()*20,8,'rgba(255,255,255,0.55)');
poly(c,[0,120,40,108,90,112,140,122,160,128,0,130],'#8aa48c');
c.beginPath(); c.moveTo(150,132); c.quadraticCurveTo(230,120,290,70); c.quadraticCurveTo(330,42,380,40); c.quadraticCurveTo(440,42,480,60); c.lineTo(480,140); c.lineTo(150,140); c.closePath();
c.fillStyle = lg(c,150,40,480,140,[0,'#a4a068',0.5,'#8d8a56',1,'#6e7044']); c.fill();
c.beginPath(); c.moveTo(250,140); c.quadraticCurveTo(300,120,360,128); c.quadraticCurveTo(420,118,480,128); c.lineTo(480,145); c.lineTo(250,145); c.fill();
c.fillStyle = '#9b8b6c'; c.fill();
var hc = ['#efe4cf','#e8d6b6','#f3ece0','#dcc6a2'];
for (i = 0; i < 16; i++) { var hx = 270 + R()*150,hy0 = 80+(hx-270)*-0.15 + R()*30+10; c.fillStyle = hc[i % 4]; c.fillRect(hx,hy0,12 + R()*8,10 + R()*6); poly(c,[hx-1,hy0,hx+10,hy0-4,hx+21,hy0],'#b9624a'); }
function tower(tx,ty,r,h) {
c.fillStyle = lg(c,tx-r,0,tx+r,0,[0,'#c6ae84',0.4,'#e2cda2',1,'#94805e']); c.fillRect(tx-r,ty-h,2*r,h);
el(c,tx,ty,r,r*0.3,'#94805e');
for (var m = 0; m < 4; m++) { c.fillStyle = m % 2 ? '#d8c296' : '#b8a078'; c.fillRect(tx-r+m*r*0.5,ty-h-4,r*0.32,5); }
ln(c,[tx-r,ty-h,tx+r,ty-h],1.5,'#8a7654','butt');
c.fillStyle = '#4e4232'; c.fillRect(tx-1,ty-h*0.6,2,5);
}
var wall = [[205,132],[240,118],[272,100],[300,80],[330,62],[358,54]];
c.beginPath(); c.moveTo(wall[0][0],wall[0][1]); for (i = 1; i < wall.length; i++) c.lineTo(wall[i][0],wall[i][1]-4);
for (i = wall.length-1; i >= 0; i--) c.lineTo(wall[i][0],wall[i][1]+14); c.closePath();
c.fillStyle = '#cdb68c'; c.fill();
c.strokeStyle = '#a28b64'; c.lineWidth = 1; c.stroke();
for (i = 0; i < wall.length; i++) tower(wall[i][0],wall[i][1]+12,7+(i % 2),26+(i % 3)*4);
var lx = 392,ly = 44;
c.fillStyle = '#f4f1ea'; c.fillRect(lx-14,ly-12,22,14); poly(c,[lx-16,ly-12,lx-3,ly-18,lx+10,ly-12],'#b55b45');
c.fillStyle = lg(c,lx,0,lx+10,0,[0,'#ffffff',1,'#cfcac0']); c.fillRect(lx+2,ly-34,9,34);
c.fillStyle = '#3a4a52'; c.fillRect(lx+1,ly-40,11,6); el(c,lx+6.5,ly-41,6,3,'#38484f');
for (i = 0; i < 6; i++) { var px = 420+i*12 + R()*6,py = 58+i*3; el(c,px,py,9,5,'#4d6a3a'); }
c.fillStyle = lg(c,0,128,0,230,[0,'#1d8ab0',0.45,'#2fb5c4',1,'#7fe0d6']); c.fillRect(0,128,W,110);
c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 1;
for (i = 0; i < 40; i++) { var wx = R()*W,wy = 135 + R()*90; c.beginPath(); c.moveTo(wx,wy); c.lineTo(wx+6 + R()*10,wy); c.stroke(); }
c.beginPath(); c.moveTo(0,228); for (var xx = 0; xx <= W; xx += 20) c.quadraticCurveTo(xx+10,222 + R()*6,xx+20,228); c.lineTo(W,240); c.lineTo(0,240); c.closePath(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.fill();
c.beginPath(); c.moveTo(0,234); for (xx = 0; xx <= W; xx += 30) c.quadraticCurveTo(xx+15,230,xx+30,234); c.lineTo(W,H); c.lineTo(0,H); c.closePath();
c.fillStyle = lg(c,0,230,0,H,[0,'#e9d3a6',1,'#d8b47c']); c.fill();
c.fillStyle = 'rgba(160,120,70,0.25)'; for (i = 0; i < 160; i++) c.fillRect(R()*W,236 + R()*104,1.5,1);
function boat(bx,by,s,hull,band,flip) {
c.save(); c.translate(bx,by); c.scale(flip ? -s : s,s);
c.beginPath(); c.moveTo(-50,-10); c.quadraticCurveTo(-56,-26,-46,-30); c.lineTo(46,-30); c.quadraticCurveTo(58,-28,52,-10); c.quadraticCurveTo(0,6,-50,-10); c.closePath();
c.fillStyle = lg(c,0,-30,0,0,[0,shade(hull,0.2),1,shade(hull,-0.25)]); c.fill();
ln(c,[-50,-24,50,-24],4,band,'butt'); ln(c,[-48,-30,47,-30],2.5,'#6a4a2c','butt');
ln(c,[-46,-30,-50,-44],3,'#7a5534'); ln(c,[52,-28,56,-38],3,'#7a5534');
c.restore(); el(c,bx,by+2,50*s,5*s,'rgba(120,80,40,0.25)');
}
boat(70,262,0.95,'#2f6fb3','#f4f1e8',false);
boat(170,250,0.7,'#f2efe6','#c43b2e',true);
boat(30,300,0.8,'#d9a52b','#2f8c6a',true);
function splash(x,y) { for (var k = 0; k < 14; k++) { var a = -Math.PI*(0.1 + R()*0.8),d = 8 + R()*20; el(c,x + Math.cos(a)*d,y + Math.sin(a)*d,1.6 + R()*1.5,2 + R()*2,'rgba(255,255,255,0.9)'); } }
function waterline(x,y,w) { c.beginPath(); c.moveTo(x-w,y); c.quadraticCurveTo(x,y+4,x+w,y); c.lineTo(x+w,226); c.lineTo(x-w,226); c.closePath(); c.fillStyle = lg(c,0,128,0,230,[0,'#1d8ab0',0.45,'#2fb5c4',1,'#7fe0d6']); c.fill(); el(c,x,y+2,w*0.8,3,'rgba(255,255,255,0.35)'); ln(c,[x-w,y,x-w / 2,y-2,x,y+1,x+w / 2,y-2,x+w,y],1.5,'rgba(255,255,255,0.9)'); }
person(c,{ x: 200,y: 150,u: 10,kid: 1,skin: '#dcaa80',hs: 'pony',top: '#e04e6a',bare: false,bot: 'swim',legs: false,sleeve: 'none',eyes: 'happy',mouth: 'open',look: 0.15,
lh: [176,140],rh: [222,134] });
waterline(200,192,30); splash(175,140); splash(224,134);
person(c,{ x: 262,y: 170,u: 9,kid: 1,skin: '#e2b088',hs: 'fringe',top: '#f2c230',bot: 'swim',legs: false,sleeve: 'none',mouth: 'grin',look: -0.2,eyes: 'happy',
lh: [244,156],rh: [282,162] });
waterline(262,206,28); splash(246,154);
c.save(); c.translate(360,300); c.rotate(-0.06);
c.beginPath(); c.rect(-70,-22,140,44); c.clip();
for (i = 0; i < 10; i++) { c.fillStyle = ['#e2483d','#f4efe2','#2f78b7','#f4efe2','#f2b531'][i % 5]; c.fillRect(-70+i*14,-22,14,44); }
c.restore();
person(c,{ x: 382,y: 222,u: 13,skin: '#e6b48a',hs: 'shoulder',hat: 'sun',top: '#2b8f8a',print: 'rgba(255,255,255,0.7)',bot: 'swim',sleeve: 'none',
eyes: 'happy',mouth: 'open',look: -0.25,lf: [318,300],rf: [330,312],kneeSide: 1,hipDx: 0,
lh: [356,300],rh: [418,168] });
var J = { x: 300,y: 190,u: 12,skin: '#d9a47a',hs: 'wavy',hair: '#2a1c14',mous: 1,thickBrow: 1,crinkle: 1,bare: 1,bot: 'trunks',botC: '#1f4f8c',sleeve: 'none',mouth: 'grin',eyes: 'open',look: 0.15,
lh: [282,254],rh: [322,254],lf: [288,320],rf: [314,322] };
J.afterHead = function () {
var mx = 302,my = 252;
el(c,mx,my,24,15,lg(c,mx-24,my-15,mx+10,my+15,[0,'#5fa04a',1,'#2e5e24']));
c.strokeStyle = '#1f4a1a'; c.lineWidth = 2.5; for (var s = -2; s <= 2; s++) { c.beginPath(); c.ellipse(mx,my,Math.abs(s)*7+2,14,0,-1.3,1.3); c.stroke(); }
el(c,mx-8,my-6,8,4,'rgba(255,255,255,0.18)');
el(c,279,254,5,5,'#d9a47a'); el(c,325,254,5,5,'#d9a47a');
};
person(c,J);
el(c,440,318,9,4,'#7a4a2a'); el(c,452,322,9,4,'#7a4a2a');
}

function roof(c,W,H) {
var R = rng(1987);
c.fillStyle = lg(c,0,0,0,200,[0,'#3f86d6',1,'#bcdcf0']); c.fillRect(0,0,W,220);
el(c,90,40,40,9,'rgba(255,255,255,0.6)'); el(c,380,28,34,7,'rgba(255,255,255,0.5)');
poly(c,[0,150,70,118,150,132,240,108,330,126,410,104,480,120,480,220,0,220],'#b7a774');
poly(c,[0,180,90,150,200,166,300,148,400,160,480,146,480,230,0,230],'#a6935a');
for (var i = 0; i < 60; i++) el(c,R()*W,120 + R()*70,3 + R()*3,2 + R()*2,'rgba(88,98,52,0.55)');
function pine(x,y,h,s) {
ln(c,[x,y,x+s*4,y-h*0.6,x+s*2,y-h],h*0.06,'#5a3d27');
var cx = x+s*2,cy = y-h;
el(c,cx,cy,h*0.42,h*0.16,'#30502a'); el(c,cx-h*0.18,cy+4,h*0.28,h*0.12,'#3c6232'); el(c,cx+h*0.2,cy-3,h*0.25,h*0.12,'#45703a');
el(c,cx-h*0.1,cy-h*0.06,h*0.2,h*0.07,'rgba(140,180,90,0.35)');
}
pine(40,210,110,1); pine(110,196,80,-1); pine(450,210,120,-1); pine(395,190,70,1); pine(250,170,50,1);
c.fillStyle = lg(c,0,220,0,H,[0,'#c7b27a',1,'#a8905a']); c.fillRect(0,222,W,H);
for (i = 0; i < 120; i++) { var gx = R()*W,gy = 225 + R()*115; ln(c,[gx,gy,gx + R()*4-2,gy-4 - R()*5],1,R() < 0.5 ? '#8b7a44' : '#6e7a3c'); }
var fx = 200,fy = 150,fw = 170,fh = 92,sx = fx+fw,sw2 = 60;
poly(c,[sx,fy,sx+sw2,fy-14,sx+sw2,fy+fh-12,sx,fy+fh],'#a89a86');
poly(c,[sx,fy,sx+sw2 / 2,fy-58,sx+sw2,fy-14],'#b3a590');
c.fillStyle = lg(c,fx,0,sx,0,[0,'#d9ccb4',1,'#bcae96']); c.fillRect(fx,fy,fw,fh);
for (var r = 0; r < 7; r++) for (var q = 0; q < 9; q++) { var stx = fx+q*20+(r % 2)*10-4 + R()*3,sty = fy+4+r*13 + R()*2; c.beginPath(); c.ellipse(stx+8,sty+5,9,5.5,R()*0.3-0.15,0,7); c.fillStyle = shade(['#c9b89a','#b8a78a','#d6c8ad','#a99a80'][(r*3+q) % 4],R()*0.1-0.05); c.fill(); c.strokeStyle = 'rgba(80,66,50,0.45)'; c.lineWidth = 0.8; c.stroke(); }
c.save(); c.beginPath(); c.rect(sx,fy-60,sw2,fh+60); c.clip(); for (r = 0; r < 10; r++) for (q = 0; q < 3; q++) { c.beginPath(); c.ellipse(sx+8+q*20+(r % 2)*8,fy-40+r*13-q*4,8,5,-0.2,0,7); c.strokeStyle = 'rgba(70,58,44,0.4)'; c.stroke(); } c.restore();
c.fillStyle = lg(c,0,0,40,0,[0,'#8a5a32',1,'#6a4222']); c.fillRect(fx+26,fy+30,36,62);
for (i = 1; i < 4; i++) ln(c,[fx+26+i*9,fy+31,fx+26+i*9,fy+91],1,'#4a2e18');
ln(c,[fx+28,fy+44,fx+60,fy+44],3,'#3a2a1e','butt'); ln(c,[fx+28,fy+78,fx+60,fy+78],3,'#3a2a1e','butt'); el(c,fx+55,fy+62,2,2,'#222');
c.fillStyle = '#7a5434'; c.fillRect(fx+108,fy+28,34,32); c.fillStyle = '#2c3a44'; c.fillRect(fx+112,fy+32,26,24); ln(c,[fx+125,fy+32,fx+125,fy+56],2,'#7a5434','butt'); ln(c,[fx+112,fy+44,fx+138,fy+44],2,'#7a5434','butt');
var e0 = [fx-12,fy+2],e1 = [sx+6,fy+2],r1 = [sx+sw2 / 2+4,fy-60],r0 = [fx+18,fy-60];
poly(c,[e0[0],e0[1],e1[0],e1[1],r1[0],r1[1],r0[0],r0[1]],'#7c5a38');
for (i = 0; i <= 8; i++) { var t = i / 8; ln(c,[e0[0]+(r0[0]-e0[0])*t,e0[1]+(r0[1]-e0[1])*t,e1[0]+(r1[0]-e1[0])*t,e1[1]+(r1[1]-e1[1])*t],2.5,'#b08654','butt'); }
for (i = 0; i <= 6; i++) { var s2 = i / 6; ln(c,[e0[0]+(e1[0]-e0[0])*s2,e0[1],r0[0]+(r1[0]-r0[0])*s2,r0[1]],3,'#6a4a2c','butt'); }
var cols = 15,rows = 8;
for (var rw = 0; rw < rows; rw++) { var tt = rw / rows,tt2 = (rw+1) / rows;
var lim = Math.floor(cols*(0.62-rw*0.045))+(rw % 2);
for (var cl = 0; cl < lim; cl++) {
var a = cl / cols,b = (cl+1) / cols;
function P(sv,tv) { var ex = e0[0]+(e1[0]-e0[0])*sv,ey = e0[1]; var rx = r0[0]+(r1[0]-r0[0])*sv,ry = r0[1]; return [ex+(rx-ex)*tv,ey+(ry-ey)*tv]; }
var p1 = P(a,tt2),p2 = P(b,tt2),p3 = P(b,tt-0.02),p4 = P(a,tt-0.02);
c.beginPath(); c.moveTo(p1[0],p1[1]); c.lineTo(p2[0],p2[1]); c.lineTo(p3[0],p3[1]); c.quadraticCurveTo((p3[0]+p4[0]) / 2,p3[1]+4,p4[0],p4[1]); c.closePath();
c.fillStyle = lg(c,p4[0],0,p3[0],0,[0,'#c4572e',0.5,'#e07a46',1,'#a2401f']); c.fill(); c.strokeStyle = 'rgba(90,30,14,0.5)'; c.lineWidth = 0.8; c.stroke();
} }
for (i = 0; i < 4; i++) { c.beginPath(); c.ellipse(332,112-i*3,12,4,-0.15,Math.PI,0); c.lineTo(344,114-i*3); c.fillStyle = shade('#cf6436',-i*0.05); c.fill(); }
for (i = 0; i < 6; i++) { c.beginPath(); c.ellipse(420,296-i*4,18,6,0,Math.PI,0); c.closePath(); c.fillStyle = shade('#cf6436',(i % 2)*-0.1); c.fill(); }
ln(c,[160,300,196,140],4,'#9a7444'); ln(c,[178,304,214,144],4,'#9a7444');
for (i = 1; i < 9; i++) { var lt = i / 9; ln(c,[160+36*lt,300-160*lt,178+36*lt,304-160*lt],3,'#86603a','butt'); }
el(c,285,fy+fh+6,110,6,'rgba(70,50,30,0.25)');
person(c,{ x: 282,y: 46,u: 11,skin: '#d29c72',hs: 'wavy',hair: '#2a1c14',mous: 1,thickBrow: 1,crinkle: 1,top: '#f2f0ea',sleeve: 'short',bot: 'trousers',botC: '#6f7378',mouth: 'grin',look: -0.2,
lf: [262,128],rf: [298,126],lh: [244,22],rh: [312,96],elbowIn: [0,0],
afterHead: function (l,rr) { ln(c,[rr[0],rr[1],rr[0]+4,rr[1]-18],3,'#7a5534'); c.fillStyle = '#4a4a50'; c.save(); c.translate(rr[0]+4,rr[1]-20); c.rotate(0.2); c.fillRect(-7,-3,14,6); c.restore(); wave(c,l[0],l[1],1.5,'rgba(255,255,255,0.8)'); } });
var px0 = 108,py0 = 200;
person(c,{ x: px0,y: py0,u: 13,skin: '#e6b48a',hs: 'shoulder',top: '#e9d27a',print: 'rgba(160,70,40,0.55)',collar: '#fff6e0',sleeve: 'short',bot: 'skirt',botC: '#3d5d8a',apron: '#f4f0e6',mouth: 'open',look: 0.3,up: 1,browRaise: 1,
lh: [96,150],rh: [142,156],lf: [96,336],rf: [120,336],
afterHead: function (l,rr) {
var cx = 92,cy = 140;
el(c,cx,cy-10,22,6,'#b7bcc2');
c.beginPath(); c.moveTo(cx-22,cy-10); c.lineTo(cx-19,cy+10); c.quadraticCurveTo(cx,cy+16,cx+19,cy+10); c.lineTo(cx+22,cy-10); c.closePath(); c.fillStyle = lg(c,cx-22,0,cx+22,0,[0,'#e2e6ea',0.5,'#a9afb6',1,'#6e747c']); c.fill();
el(c,cx,cy-10,19,4.5,'#c87a3a'); ln(c,[cx-22,cy-6,cx-30,cy-8],3,'#555'); ln(c,[cx+22,cy-6,cx+30,cy-8],3,'#555');
el(c,l[0],l[1],5.5,5.5,'#e6b48a');
c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 3; for (var s = 0; s < 3; s++) { c.beginPath(); c.moveTo(cx-10+s*10,cy-16); c.bezierCurveTo(cx-18+s*10,cy-30,cx-2+s*10,cy-40,cx-10+s*10,cy-56); c.stroke(); }
ln(c,[rr[0],rr[1],rr[0]+10,rr[1]-34],3,'#8e949a'); el(c,rr[0]+12,rr[1]-38,6,4,'#8e949a',-0.3);
ln(c,[px0+20,py0-14,px0+30,py0-22],2,'#fff'); ln(c,[px0+24,py0-4,px0+36,py0-8],2,'#fff');
} });
}

function olympics(c,W,H) {
var R = rng(1992);
c.fillStyle = lg(c,0,0,0,200,[0,'#d8c08a',1,'#c9ab6e']); c.fillRect(0,0,W,H);
c.fillStyle = '#e8e0cc'; c.fillRect(0,190,W,150);
c.strokeStyle = 'rgba(120,110,90,0.35)'; c.lineWidth = 1; for (var tx = 0; tx < W; tx += 14) { c.beginPath(); c.moveTo(tx,190); c.lineTo(tx,H); c.stroke(); } for (var ty = 190; ty < H; ty += 14) { c.beginPath(); c.moveTo(0,ty); c.lineTo(W,ty); c.stroke(); }
ln(c,[0,190,W,190],4,'#7a2a20','butt');
c.fillStyle = rg(c,250,40,10,330,[0,'rgba(255,230,160,0.55)',1,'rgba(60,30,10,0.35)']); c.fillRect(0,0,W,H);
ln(c,[262,0,262,24],2,'#333'); c.beginPath(); c.moveTo(248,34); c.quadraticCurveTo(262,18,276,34); c.closePath(); c.fillStyle = '#2f6b4a'; c.fill(); el(c,262,35,6,3,'#fff6c8');
c.fillStyle = '#5a3a22'; c.fillRect(392,20,82,170); c.fillStyle = lg(c,0,26,0,120,[0,'#0e1630',1,'#24305a']); c.fillRect(400,28,66,90);
for (var i = 0; i < 4; i++) el(c,410+i*16,60+(i % 2)*18,2,2,'#ffd27a');
c.fillStyle = '#b8282a'; c.fillRect(316,30,54,70); c.fillStyle = '#f2d45a'; c.font = 'bold 28px serif'; c.textAlign = 'center'; c.fillText('麵',343,64); c.font = 'bold 9px sans-serif'; c.fillText('FIDEOS',343,86);
c.save(); c.translate(170,40); c.rotate(-0.04);
c.fillStyle = '#f7f5ef'; c.fillRect(0,0,84,54); ln(c,[2,2,2,2],3,'#c00');
var rc = [['#1d6ec9',20,22],['#111',42,22],['#d6262c',64,22],['#f0b21a',31,32],['#1f9a48',53,32]];
for (i = 0; i < 5; i++) { c.beginPath(); c.arc(rc[i][1],rc[i][2],9,0,7); c.lineWidth = 2.6; c.strokeStyle = rc[i][0]; c.stroke(); }
el(c,3,3,2,2,'#c33'); el(c,81,3,2,2,'#c33');
c.restore();
c.fillStyle = '#6a4424'; c.fillRect(8,120,140,8); poly(c,[20,128,30,128,20,146],'#5a381c'); poly(c,[136,128,126,128,136,146],'#5a381c');
c.fillStyle = lg(c,0,30,0,120,[0,'#8a6a48',1,'#5c4228']); c.fillRect(18,32,120,88);
c.fillStyle = '#2a2a2c'; c.fillRect(24,38,86,76);
var sx = 28,sy = 42,sw = 78,sh = 68;
c.save(); c.beginPath(); c.roundRect ? c.roundRect(sx,sy,sw,sh,8) : c.rect(sx,sy,sw,sh); c.clip();
c.fillStyle = lg(c,0,sy,0,sy+sh,[0,'#0b1a3e',1,'#1d2e5c']); c.fillRect(sx,sy,sw,sh);
c.beginPath(); c.ellipse(sx+34,sy+60,46,18,0,Math.PI,0); c.lineTo(sx+80,sy+70); c.lineTo(sx-12,sy+70); c.closePath(); c.fillStyle = '#3a3248'; c.fill();
for (i = 0; i < 70; i++) el(c,sx + R()*80,sy+46 + R()*22,0.8,0.8,R() < 0.5 ? '#ffe6a0' : '#ffffff');
c.fillStyle = '#9a9aa8'; c.fillRect(sx+62,sy+18,3,30); poly(c,[sx+56,sy+18,sx+71,sy+18,sx+66,sy+24,sx+61,sy+24],'#c0c0cc');
c.strokeStyle = 'rgba(255,200,90,0.9)'; c.lineWidth = 1.5; c.setLineDash([2,2]); c.beginPath(); c.moveTo(sx+10,sy+50); c.quadraticCurveTo(sx+30,sy-2,sx+52,sy+10); c.stroke(); c.setLineDash([]);
el(c,sx+52,sy+10,5,3,rg(c,sx+52,sy+10,0,6,[0,'#fff6c0',0.5,'#ffa020',1,'rgba(255,80,0,0)']));
el(c,sx+52,sy+10,9,6,'rgba(255,140,40,0.35)');
c.fillStyle = 'rgba(255,255,255,0.06)'; for (i = 0; i < sh; i += 3) c.fillRect(sx,sy+i,sw,1);
c.restore();
c.fillStyle = 'rgba(170,200,255,0.18)'; c.fillRect(sx,sy,sw,sh);
el(c,124,52,4,4,'#333'); el(c,124,66,4,4,'#333'); el(c,124,100,3,3,'#c33');
ln(c,[60,32,44,10],1.5,'#888'); ln(c,[70,32,88,12],1.5,'#888');
c.fillStyle = rg(c,70,80,10,220,[0,'rgba(150,180,255,0.18)',1,'rgba(150,180,255,0)']); c.fillRect(0,0,W,H);
var bk = [[190,150,'#7c5a3e','short','#3f5f8a'],[236,140,'#1c1410','perm','#a23a3a'],[296,146,'#24180f','short','#4e6a3a'],[350,138,'#3a2a1e','wavy','#d8d2c2'],[430,150,'#111','bob','#6a4a8a'],[140,160,'#888','balding','#5e5244']];
for (i = 0; i < bk.length; i++) { var b = bk[i]; person(c,{ x: b[0],y: b[1],u: 10,skin: ['#e6b48a','#d6a07a','#c9926a'][i % 3],hair: b[2],hs: b[3],top: b[4],legs: false,sleeve: 'short',look: -0.25,up: 1,mouth: i % 2 ? 'o' : 'grin',eyes: 'open',mous: i == 3,old: i == 5 }); }
function table(x,y,w) { c.fillStyle = '#8a5c34'; c.fillRect(x,y,w,8); c.fillStyle = '#6a4424'; c.fillRect(x+6,y+8,6,60); c.fillRect(x+w-12,y+8,6,60); poly(c,[x-6,y,x+w+6,y,x+w,y-14,x,y-14],'#a8794a'); }
function bowl(x,y) { c.beginPath(); c.moveTo(x-12,y-4); c.quadraticCurveTo(x,y+10,x+12,y-4); c.closePath(); c.fillStyle = '#f2efe6'; c.fill(); ln(c,[x-10,y-1,x+10,y-1],1.5,'#2f6bb0','butt'); el(c,x,y-4,12,3,'#e8c27a'); ln(c,[x+4,y-6,x+16,y-20],1.5,'#5a3a20'); ln(c,[x+7,y-6,x+18,y-19],1.5,'#5a3a20');
c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x-4,y-8); c.bezierCurveTo(x-9,y-16,x+1,y-20,x-4,y-28); c.stroke(); }
person(c,{ x: 70,y: 196,u: 14,skin: '#d4a07a',hair: '#cfcac0',hs: 'balding',old: 1,top: '#8a7a62',cardi: '#6a5a44',sleeve: 'long',legs: false,eyes: 'closed',mouth: 'smile',look: -0.15,brow: '#bdb8ae',
lh: [40,300],rh: [82,200],
afterHead: function (l,rr) { poly(c,[rr[0]-8,rr[1]+2,rr[0]+6,rr[1]-4,rr[0]+10,rr[1]+10,rr[0]-4,rr[1]+14],'#f4f2ea'); el(c,rr[0],rr[1]+2,6,6,'#d4a07a'); el(c,60,204,1.6,2.4,'rgba(180,220,255,0.95)'); } });
table(0,290,120); bowl(30,288); bowl(94,290);
person(c,{ x: 400,y: 200,u: 13,skin: '#e2ae86',hs: 'perm',hair: '#1a120e',top: '#e8457a',sleeve: 'short',legs: false,mouth: 'open',eyes: 'happy',look: -0.2,lh: [372,150],rh: [430,148] });
person(c,{ x: 446,y: 214,u: 12,skin: '#e6b48a',hs: 'pony',hair: '#16100c',top: '#2fa3b0',stripes: 'rgba(255,255,255,0.5)',sleeve: 'short',legs: false,mouth: 'open',eyes: 'open',up: 1,look: -0.3,lh: [424,168],rh: [470,172] });
table(344,300,136); bowl(372,298); bowl(450,300);
var J = person(c,{ x: 262,y: 186,u: 15,skin: '#d29c72',hs: 'wavy',hair: '#2a1c14',mous: 1,thickBrow: 1,crinkle: 1,top: '#f1eee6',sleeve: 'short',collar: '#ffffff',legs: false,mouth: 'grin',look: -0.25,up: 1,
lh: [234,240],rh: [290,290] });
ln(c,[236,240,192,238],10,'#d29c72');
person(c,{ x: 212,y: 214,u: 15,skin: '#e6b48a',hs: 'perm',hair: '#1a120e',top: '#c43b4a',cardi: '#a8303e',sleeve: 'long',sleeveC: '#b23544',legs: false,apron: '#f4f0e4',eyes: 'open',browRaise: 1,mouth: 'none',look: -0.2,up: 1,
lh: [203,233],rh: [219,233],elb: [1,-1],
afterHead: function () { el(c,205,231,7,8.5,'#eab98f',0.3); el(c,218,231,7,8.5,'#e0ae84',-0.3); ln(c,[205,224,205,236],0.8,'rgba(150,90,60,0.6)'); ln(c,[218,224,218,236],0.8,'rgba(150,90,60,0.6)'); } });
el(c,191,238,7,6,'#d29c72'); ln(c,[186,236,186,243],1,'rgba(120,70,40,0.5)');
for (i = 0; i < 2; i++) { var stx = 170+i*110; el(c,stx,322,22,7,'#c0392b'); c.fillStyle = '#888'; c.fillRect(stx-14,326,3,20); c.fillRect(stx+11,326,3,20); }
}

return { tossa: tossa,roof: roof,olympics: olympics };
})());
Object.assign(window.POPO_PHOTOS=window.POPO_PHOTOS||{},(function (){
var PI=Math.PI,TAU=PI*2;
function rng(a){return function (){a |= 0;a=a+0x6D2B79F5 | 0;var t=Math.imul(a ^ a >>> 15,1 | a);t=t+Math.imul(t ^ t >>> 7,61 | t) ^ t;return ((t ^ t >>> 14) >>> 0)/4294967296;};}
function E(c,x,y,rx,ry,f,rot){c.beginPath();c.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot||0,0,TAU);c.fillStyle=f;c.fill();}
function LG(c,x0,y0,x1,y1,st){var g=c.createLinearGradient(x0,y0,x1,y1);st.forEach(function (s){g.addColorStop(s[0],s[1]);});return g;}
function RG(c,x,y,r0,r1,st,x1,y1){var g=c.createRadialGradient(x,y,r0,x1==null?x:x1,y1==null?y:y1,r1);st.forEach(function (s){g.addColorStop(s[0],s[1]);});return g;}
function P(c,pts,open){
c.beginPath();c.moveTo(pts[0][0],pts[0][1]);
for (var i=1;i<pts.length;i++){var p=pts[i];
if (p.length==2) c.lineTo(p[0],p[1]);else if (p.length==4) c.quadraticCurveTo(p[0],p[1],p[2],p[3]);else c.bezierCurveTo(p[0],p[1],p[2],p[3],p[4],p[5]);}
if (!open) c.closePath();
}
function F(c,pts,f){P(c,pts);c.fillStyle=f;c.fill();}
function S(c,pts,col,w){P(c,pts,1);c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke();}
function glow(c,x,y,r,col){c.fillStyle=RG(c,x,y,0,r,[[0,col],[1,'rgba(0,0,0,0)']]);c.fillRect(x-r,y-r,r*2,r*2);}
function eye(c,x,y,r,sc,o,s){
var w=.14*r*sc,h=.085*r,lw=Math.max(1,.04*r),dk=o.dark||'#24160f';
c.strokeStyle=dk;c.lineCap='round';
if (o.eyes=='laugh'){
c.lineWidth=lw*1.3;c.beginPath();c.moveTo(x-w,y+.03*r);c.quadraticCurveTo(x,y-.11*r,x+w,y+.03*r);c.stroke();
c.lineWidth=lw*.5;c.strokeStyle=o.shade;var ox=x+s*w*1.15;
c.beginPath();c.moveTo(ox,y+.01*r);c.lineTo(ox+s*.08*r,y-.03*r);c.moveTo(ox,y+.04*r);c.lineTo(ox+s*.08*r,y+.07*r);c.stroke();
return;
}
var hh=o.eyes=='squint'?h*.62:h,lk=o.look||[0,0];
c.save();c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x,y-hh*2,x+w,y);c.quadraticCurveTo(x,y+hh*1.4,x-w,y);c.closePath();
c.fillStyle='#f2ebe2';c.fill();c.clip();
var ix=x+lk[0]*w*.45,iy=y-hh*.2+lk[1]*hh*.5;
E(c,ix,iy,.078*r,.078*r,o.iris||'#3b2414');E(c,ix,iy,.042*r,.042*r,'#110906');
E(c,ix+.026*r,iy-.03*r,.02*r,.02*r,'#fff');
c.fillStyle='rgba(60,30,20,.25)';c.fillRect(x-w,y-hh*2,2*w,hh*.9);
c.restore();
c.lineWidth=lw;c.beginPath();c.moveTo(x-w*1.05,y+.005*r);c.quadraticCurveTo(x,y-hh*2.1,x+w*1.1,y-.01*r);c.stroke();
if (o.eyes=='squint'){c.lineWidth=lw*.5;c.strokeStyle=o.shade;c.beginPath();c.moveTo(x-w,y+.05*r);c.quadraticCurveTo(x,y+.08*r,x+w,y+.04*r);c.stroke();}
}
function mouthPath(c,mx,my,w,dep,r){P(c,[[mx-w,my-.03*r],[mx,my+.04*r,mx+w,my-.03*r],[mx+w*.75,my+dep,mx-w*.75,my+dep,mx-w,my-.03*r]]);}
function face(c,x,y,r,o){
c.save();c.translate(x,y);c.rotate(o.tilt||0);
var t=o.turn||0,up=(o.up||0)*r,fx=t*.27*r,sk=o.skin,sd=o.shade;
if (o.back) o.back(c,r);
if (o.neck) o.neck(c,r);
if (t<.55) E(c,-.86*r+t*.12*r,.12*r,.13*r,.21*r,sd);
if (t>-.55) E(c,.86*r+t*.12*r,.12*r,.13*r,.21*r,sd);
var jx=fx*.6,jw=o.jaw||.45;
P(c,[[0,-r],[.62*r,-r,.9*r,-.55*r,.88*r,.05*r],[.86*r,.6*r,jw*r+jx*.3,.97*r,jx,r],[-jw*r+jx*.3,.97*r,-.86*r,.6*r,-.88*r,.05*r],[-.9*r,-.55*r,-.62*r,-r,0,-r]]);
c.fillStyle=RG(c,-.25*r+fx*.5,-.3*r,.05*r,1.25*r,[[0,o.light||sk],[.55,sk],[1,sd]]);c.fill();
c.save();c.clip();
c.fillStyle=RG(c,1.05*r,.25*r,.1*r,.75*r,[[0,'rgba(110,55,35,.28)'],[1,'rgba(110,55,35,0)']]);c.fillRect(0,-r,2*r,2.2*r);
var ey=.06*r+up,sp=.33*r*(1-Math.abs(t)*.18),bl=o.blush==null?.3:o.blush;
[-1,1].forEach(function (s){var bx=fx+s*(sp+.08*r),byy=ey+.33*r;c.fillStyle=RG(c,bx,byy,0,.2*r,[[0,'rgba(225,105,95,'+bl+')'],[1,'rgba(225,105,95,0)']]);c.fillRect(bx-.2*r,byy-.2*r,.4*r,.4*r);});
c.restore();
[-1,1].forEach(function (s){var sc=1-(s*t>0?Math.abs(t)*.3:0);eye(c,fx+s*sp,ey,r,sc,o,s);});
var by=ey-.21*r-(o.brow=='up'?.04*r:0);
c.strokeStyle=o.browC||o.hair;c.lineWidth=o.browW||.05*r;c.lineCap='round';
[-1,1].forEach(function (s){
var bx=fx+s*sp;c.beginPath();
if (o.brow=='knit'){c.moveTo(bx-s*.13*r,by+.06*r);c.quadraticCurveTo(bx,by-.02*r,bx+s*.15*r,by-.01*r);}
else {c.moveTo(bx-s*.13*r,by+.02*r);c.quadraticCurveTo(bx,by-.07*r,bx+s*.16*r,by+.03*r);}
c.stroke();
});
var ny=ey+.36*r,nx=fx+t*.1*r;
c.strokeStyle=sd;c.lineWidth=.035*r;
c.beginPath();c.moveTo(fx+.07*r,ey+.08*r);c.quadraticCurveTo(nx+.11*r,ny-.12*r,nx+.08*r,ny-.02*r);c.stroke();
c.beginPath();c.moveTo(nx-.1*r,ny-.01*r);c.quadraticCurveTo(nx,ny+.07*r,nx+.1*r,ny-.01*r);c.stroke();
E(c,nx-.02*r,ny-.07*r,.04*r,.035*r,'rgba(255,240,225,.5)');
var my=.6*r+up,mx=fx+t*.06*r,m=o.mouth,lip=o.lip||'#a4524a';
if (m=='laugh'||m=='grin'){
var w=m=='laugh'?.27*r:.25*r,dep=m=='laugh'?.3*r:.18*r;
mouthPath(c,mx,my,w,dep,r);c.fillStyle='#4a1515';c.fill();
c.save();c.clip();c.fillStyle='#f4eee4';c.fillRect(mx-w,my-.06*r,2*w,.115*r);E(c,mx,my+dep*.9,w*.55,dep*.35,'#b84a46');c.restore();
mouthPath(c,mx,my,w,dep,r);c.strokeStyle=lip;c.lineWidth=.03*r;c.stroke();
c.strokeStyle=sd;c.lineWidth=.03*r;[-1,1].forEach(function (s){c.beginPath();c.moveTo(mx+s*(w+.02*r),my-.08*r);c.quadraticCurveTo(mx+s*(w+.07*r),my,mx+s*(w+.03*r),my+.06*r);c.stroke();});
} else if (m=='smile'){
c.strokeStyle='#6a2c26';c.lineWidth=.04*r;c.beginPath();c.moveTo(mx-.2*r,my-.02*r);c.quadraticCurveTo(mx,my+.12*r,mx+.2*r,my-.02*r);c.stroke();
E(c,mx,my+.1*r,.11*r,.035*r,lip);
} else if (m=='twitch'){
var sd2=o.side||1;
c.strokeStyle='#6a2c26';c.lineWidth=.04*r;c.beginPath();c.moveTo(mx-sd2*.18*r,my+.03*r);c.quadraticCurveTo(mx,my+.02*r,mx+sd2*.15*r,my-.02*r);c.quadraticCurveTo(mx+sd2*.22*r,my-.05*r,mx+sd2*.25*r,my-.12*r);c.stroke();
E(c,mx-sd2*.01*r,my+.09*r,.1*r,.03*r,lip);
c.lineWidth=.025*r;c.strokeStyle=sd;c.beginPath();c.arc(mx+sd2*.26*r,my-.05*r,.04*r,-.5,1.2);c.stroke();
}
if (o.age){
c.strokeStyle='rgba(120,70,50,'+(.35*o.age)+')';c.lineWidth=.025*r;
[-1,1].forEach(function (s){
c.beginPath();c.moveTo(nx+s*.14*r,ny-.02*r);c.quadraticCurveTo(mx+s*.3*r,my-.02*r,mx+s*.3*r,my+.14*r);c.stroke();
c.beginPath();c.moveTo(fx+s*(sp-.1*r),ey+.1*r);c.quadraticCurveTo(fx+s*sp,ey+.15*r,fx+s*(sp+.12*r),ey+.09*r);c.stroke();
});
}
if (o.glasses){
c.strokeStyle=o.glasses;c.lineWidth=Math.max(1.2,.055*r);
[-1,1].forEach(function (s){
var sc=1-(s*t>0?Math.abs(t)*.3:0),gx=fx+s*sp;
c.beginPath();c.ellipse(gx,ey-.01*r,.21*r*sc,.19*r,0,0,TAU);c.fillStyle='rgba(255,255,255,.1)';c.fill();c.stroke();
c.save();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=.025*r;c.beginPath();c.arc(gx,ey-.01*r,.15*r*sc,-2.6,-1.9);c.stroke();c.restore();
if (s*t<=.3){c.beginPath();c.moveTo(gx+s*.21*r*sc,ey-.03*r);c.lineTo(s*.84*r+t*.1*r,ey);c.stroke();}
});
c.beginPath();c.moveTo(fx-sp+.2*r,ey-.04*r);c.quadraticCurveTo(fx,ey-.1*r,fx+sp-.2*r,ey-.04*r);c.stroke();
}
if (o.front) o.front(c,r);
c.restore();
}
function pigeon(c,x,y,s,up,flip){
c.save();c.translate(x,y);c.scale(flip?-s:s,s);
var wy=up?-18:8;
function wing(dx,col,tip){
P(c,[[-2+dx,-2],[-4+dx,wy-8,-14+dx,wy-12],[-12+dx,wy-6],[-16+dx,wy-4],[-12+dx,wy-1],[-15+dx,wy+2],[-8+dx,wy+4,-2+dx,3]]);
c.fillStyle=col;c.fill();
F(c,[[-14+dx,wy-12],[-12+dx,wy-6],[-16+dx,wy-4],[-18+dx,wy-9]],tip);
}
wing(4,'#8a8e96','#43474f');
F(c,[[-8,0],[-17,1],[-16,6],[-7,4]],'#5e626a');
E(c,0,0,10,5.5,'#9da1a9',-.15);E(c,2,2,7,3.5,'#b9bcc2',-.15);
E(c,8,-4,4,3.8,'#6c7480');E(c,6,-1.5,3,2.5,'#6f8a80');
E(c,9,-5,.9,.9,'#d26a2a');
F(c,[[11.5,-4.5],[14.5,-3.6],[11.5,-2.8]],'#d8b070');
wing(-2,'#a6aab2','#4a4e56');
c.restore();
}
function dog(c,x,y,s){
c.save();c.translate(x,y);c.scale(s,s);
var fur='#dcb47c',fd='#b88d55',wh='#f5ede0';
c.lineCap='round';
F(c,[[-50,-40],[-46,-78,-10,-96,14,-112],[30,-110],[38,-84,34,-50,30,-20],[-40,0]],LG(c,-40,-90,30,-10,[[0,fur],[1,fd]]));
E(c,-26,-22,30,24,LG(c,-50,-40,0,0,[[0,fur],[1,fd]]));
E(c,-6,-2,16,6,fd);
S(c,[[-46,-36],[-60,-60,-52,-92,-34,-94],[-18,-95,-16,-78,-28,-76]],fd,14);
S(c,[[-46,-38],[-58,-60,-51,-88,-35,-90],[-22,-91,-20,-80,-28,-79]],'#ecd2a4',8);
S(c,[[-50,-56],[-50,-76,-44,-86,-36,-87]],wh,2.5);
F(c,[[12,-96],[30,-98,38,-70,32,-30],[22,-36],[20,-60,12,-96]],wh);
F(c,[[8,-46],[8,-24],[10,-2],[20,-2],[20,-30],[22,-46]],LG(c,8,0,22,0,[[0,fd],[1,fur]]));
F(c,[[20,-48],[22,-20],[22,-2],[33,-2],[33,-26],[34,-48]],LG(c,20,0,34,0,[[0,fur],[1,'#e9c995']]));
E(c,15,-2,8,4,wh);E(c,29,-1,9,4.5,wh);
c.strokeStyle=fd;c.lineWidth=1;[26,29,32].forEach(function (k){c.beginPath();c.moveTo(k,-4);c.lineTo(k,1);c.stroke();});
F(c,[[6,-112],[16,-98,34,-100,38,-108],[36,-114],[20,-110,10,-118]],'#b5262a');
E(c,30,-104,3,3.5,'#e2c050');
F(c,[[12,-130],[14,-158],[22,-140]],fd);
E(c,26,-128,22,19,LG(c,6,-150,40,-110,[[0,'#e8c48c'],[1,fur]]));
F(c,[[18,-136],[26,-170],[38,-140]],fur);F(c,[[23,-140],[27,-160],[33,-141]],'#c98f74');
E(c,48,-120,15,10,wh,.12);
F(c,[[30,-140],[36,-130,40,-122,33,-114],[26,-122]],wh);
E(c,62,-122,4.5,3.6,'#1c1512');
c.strokeStyle='#4a3528';c.lineWidth=1.4;c.beginPath();c.moveTo(61,-117);c.quadraticCurveTo(52,-110,44,-112);c.stroke();
E(c,37,-132,3.6,3.2,'#1b120c');E(c,38.2,-133.2,1.1,1.1,'#fff');
c.strokeStyle=fd;c.lineWidth=1.2;c.beginPath();c.moveTo(33,-137);c.quadraticCurveTo(37,-139,41,-136);c.stroke();
c.restore();
}
function kitten(c,x,y,r,body,dark,irisC,tabby){
F(c,[[x-r*.85,y-r*.35],[x-r*.75,y-r*1.35],[x-r*.15,y-r*.8]],body);
F(c,[[x+r*.85,y-r*.35],[x+r*.75,y-r*1.35],[x+r*.15,y-r*.8]],body);
F(c,[[x-r*.68,y-r*.55],[x-r*.66,y-r*1.1],[x-r*.32,y-r*.78]],tabby?'#f0a49a':'#5a3a40');
F(c,[[x+r*.68,y-r*.55],[x+r*.66,y-r*1.1],[x+r*.32,y-r*.78]],tabby?'#f0a49a':'#5a3a40');
E(c,x,y,r,r*.88,RG(c,x-r*.3,y-r*.4,1,r*1.2,[[0,tabby?'#f2a85a':'#3a3a42'],[1,body]]));
if (tabby){
c.strokeStyle=dark;c.lineWidth=r*.09;c.lineCap='round';
[[-.25,-.85,-.18,-.45],[0,-.9,0,-.5],[.25,-.85,.18,-.45],[-.95,-.05,-.65,0],[.95,-.05,.65,0],[-.9,.25,-.62,.22],[.9,.25,.62,.22]].forEach(function (a){c.beginPath();c.moveTo(x+a[0]*r,y+a[1]*r);c.lineTo(x+a[2]*r,y+a[3]*r);c.stroke();});
E(c,x,y+r*.42,r*.5,r*.36,'#fbe9cc');
} else E(c,x,y+r*.42,r*.45,r*.32,'#2a2a30');
[-1,1].forEach(function (s){
var ex=x+s*r*.38,ey=y-r*.05;
E(c,ex,ey,r*.21,r*.23,irisC);E(c,ex,ey,r*.07,r*.19,'#0c0a08');E(c,ex+r*.07,ey-r*.09,r*.06,r*.06,'#fff');
});
F(c,[[x-r*.1,y+r*.22],[x+r*.1,y+r*.22],[x,y+r*.33]],'#e8848a');
c.strokeStyle=tabby?'#7a4a30':'#9a96a0';c.lineWidth=1;c.beginPath();c.moveTo(x,y+r*.33);c.lineTo(x,y+r*.42);c.moveTo(x-r*.15,y+r*.47);c.quadraticCurveTo(x,y+r*.5,x,y+r*.42);c.quadraticCurveTo(x,y+r*.5,x+r*.15,y+r*.47);c.stroke();
c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=.8;
[-1,1].forEach(function (s){for (var k=0;k<3;k++){c.beginPath();c.moveTo(x+s*r*.35,y+r*(.36+k*.08));c.lineTo(x+s*r*1.3,y+r*(.22+k*.17));c.stroke();}});
}
function flag(c,x0,y0,x1,y1,L,cols,seed){
var n=cols.length,R=rng(seed);
for (var i=0;i<n;i++){
var u0=i/n,u1=(i+1)/n,pts=[],k;
for (k=0;k<=10;k++){var s=k/10,ax=x0+(x1-x0)*u0,ay=y0+(y1-y0)*u0;pts.push([ax+Math.sin(s*5+u0*2)*6*s,ay+s*L*(1-u0*.15)]);}
for (k=10;k>=0;k--){var s2=k/10,bx=x0+(x1-x0)*u1,by=y0+(y1-y0)*u1;pts.push([bx+Math.sin(s2*5+u1*2)*6*s2,by+s2*L*(1-u1*.15)]);}
F(c,pts,cols[i]);
c.fillStyle='rgba(0,0,0,'+(.12+.12*Math.sin(i+R()))+')';c.fill();
}
}
return {
wedding: function (c,W,H){
var R=rng(19700411),i;
// ---- Ajuntament façade (out of focus)
c.save();c.filter='blur(1.8px)';
c.fillStyle=LG(c,0,0,0,H,[[0,'#d6cab2'],[1,'#bfb198']]);c.fillRect(0,0,W,H);
c.fillStyle='#9a8c74';c.fillRect(0,0,W,8);
c.fillStyle='#4e463a';c.fillRect(170,0,140,8);
c.fillStyle='#e2d8c4';c.fillRect(0,8,W,4);c.fillRect(0,30,W,5);
for (i=0;i<40;i++){var bx=i*13;E(c,bx+6,21,3.4,8,'#e8dfcc');E(c,bx+7.5,21,1.6,7,'rgba(90,75,55,.4)');}
c.fillStyle='#cfc3ab';c.fillRect(0,35,W,26);
c.fillStyle='rgba(80,65,45,.35)';c.fillRect(0,58,W,4);
for (i=0;i<48;i++) c.fillRect(i*10+2,36,5,6);
c.fillStyle='#6f6452';c.fillRect(0,62,W,H);
c.fillStyle=LG(c,0,62,0,H,[[0,'rgba(40,32,22,.6)'],[1,'rgba(40,32,22,0)']]);c.fillRect(0,62,W,90);
c.fillStyle='#3b3329';c.fillRect(150,110,180,230);
[40,140,340,440,240].forEach(function (x){
c.fillStyle=LG(c,x-17,0,x+17,0,[[0,'#a99c84'],[.35,'#efe6d4'],[.6,'#ddd2bc'],[1,'#8e816b']]);c.fillRect(x-17,72,34,H);
c.strokeStyle='rgba(80,68,50,.35)';c.lineWidth=1;for (var f=-12;f<=12;f+=6){c.beginPath();c.moveTo(x+f,74);c.lineTo(x+f,H);c.stroke();}
c.fillStyle='#e4dac6';c.fillRect(x-24,62,48,6);c.fillRect(x-20,68,40,5);
E(c,x-20,70,6,6,'#d8cdb7');E(c,x+20,70,6,6,'#d8cdb7');E(c,x-20,70,2.5,2.5,'#8a7d66');E(c,x+20,70,2.5,2.5,'#8a7d66');
});
c.fillStyle='#4a7a3a';c.fillRect(0,0,0,0);
/* no flags: under Franco in 1970 the balcony did not fly what a viewer would expect today */
c.restore();
c.fillStyle=RG(c,360,40,10,320,[[0,'rgba(255,244,215,.35)'],[1,'rgba(255,244,215,0)']]);c.fillRect(0,0,W,H);
// ---- far pigeons (soft)
c.save();c.filter='blur(.8px)';
pigeon(c,120,64,.55,1,0);pigeon(c,380,44,.6,0,1);pigeon(c,420,92,.5,1,1);pigeon(c,80,30,.45,0,0);
c.restore();
// ---- Josep
var jx=300;
F(c,[[292,112],[290,162],[308,162],[306,112]],'#c9946e');
F(c,[[246,172],[262,152,296,150,300,150],[304,150,340,152,356,172],[366,220,362,300,364,340],[236,340],[238,290,236,220,246,172]],LG(c,236,0,366,0,[[0,'#3a3d46'],[.45,'#2a2c34'],[1,'#17181d']]));
F(c,[[284,152],[316,152],[300,228]],'#f4f1ea');
F(c,[[296,160],[304,160],[302,168],[298,168]],'#1c1d22');
F(c,[[298,168],[302,168],[305,222],[300,232],[295,222]],'#22232a');
F(c,[[282,150],[270,176],[280,182],[298,240],[300,250],[289,204]],'#3c3f49');
F(c,[[318,150],[330,176],[320,182],[302,240],[300,250],[311,204]],'#30323b');
S(c,[[300,250],[302,300],[301,340]],'rgba(0,0,0,.45)',1.5);
E(c,300,266,3,3,'#0e0e12');E(c,300,300,3,3,'#0e0e12');
F(c,[[322,196],[328,186],[334,184],[330,194]],'#f6f3ec');
F(c,[[247,176],[234,230,236,270,244,300],[262,300],[262,250,262,210,262,186]],'#2c2e36');
F(c,[[353,178],[370,230,368,290,366,318],[350,318],[348,270,346,220,346,190]],'#1b1c22');
E(c,358,322,9,11,'#d7a582');
S(c,[[262,192],[270,240],[274,300]],'rgba(255,255,255,.08)',2);
for (i=0;i<9;i++){var ca=i/9*TAU,cr=6+R()*1.5;E(c,326+Math.cos(ca)*3,188+Math.sin(ca)*3,cr*.6,cr*.45,i % 2?'#fbf9f3':'#e4e0d6',ca);}
E(c,326,188,4,4,'#ffffff');S(c,[[326,194],[324,206]],'#4d6b3a',1.5);
face(c,297,98,31,{
skin: '#e3b58f',shade: '#b07d5c',light: '#f2cfae',hair: '#1d1612',browW: 3.4,turn: -.42,tilt: -.06,eyes: 'laugh',mouth: 'grin',brow: 'up',blush: .18,jaw: .5,
back: function (c,r){F(c,[[-.92*r,.05*r],[-1.02*r,-.95*r,.1*r,-1.25*r,.7*r,-1.0*r],[1.02*r,-.8*r,.98*r,-.2*r,.9*r,.25*r],[.85*r,-.4*r],[-.85*r,-.4*r]],'#1d1612');},
front: function (c,r){
F(c,[[-.9*r,-.05*r],[-.98*r,-.95*r,.0*r,-1.28*r,.75*r,-1.0*r],[1.0*r,-.85*r,.95*r,-.4*r,.9*r,-.05*r],[.82*r,-.45*r,.6*r,-.62*r,.25*r,-.66*r],[-.2*r,-.7*r,-.7*r,-.6*r,-.9*r,-.05*r]],'#1f1813');
c.strokeStyle='rgba(150,130,115,.55)';c.lineWidth=1.4;
for (var k=0;k<4;k++){c.beginPath();c.moveTo(-.6*r+k*.2*r,-.72*r);c.quadraticCurveTo(-.3*r+k*.25*r,-1.15*r,.5*r+k*.1*r,-.98*r);c.stroke();}
}
});
// ---- Popo: veil,dress,arms,head
var veil='rgba(255,255,255,.5)';
F(c,[[176,112],[130,140,112,210,126,270],[150,262,160,230,170,190],[184,150]],veil);
F(c,[[200,108],[228,120,238,160,236,196],[222,186],[212,150]],'rgba(255,255,255,.35)');
F(c,[[186,160],[184,186],[204,186],[202,160]],'#e6b996');
var dress=LG(c,140,0,250,0,[[0,'#d8d3ca'],[.4,'#fbf9f4'],[.75,'#efebe3'],[1,'#c9c3b8']]);
F(c,[[156,194],[170,182,184,180,194,182],[206,180,222,182,234,194],[234,222,226,240,224,252],[236,300,248,330,252,340],[134,340],[140,320,152,290,164,252],[160,236,154,220,156,194]],dress);
F(c,[[180,182],[194,194],[208,182],[204,190,196,198,194,198],[192,198,184,190,180,182]],'#e6b996');
S(c,[[180,182],[194,196],[208,182]],'#cfc9be',2);
F(c,[[164,248],[224,248],[226,258],[162,258]],'#e9e4da');
S(c,[[176,262],[170,300],[162,338]],'rgba(150,140,125,.5)',1.5);S(c,[[214,262],[222,300],[232,338]],'rgba(150,140,125,.5)',1.5);S(c,[[196,262],[196,338]],'rgba(150,140,125,.35)',1.5);
F(c,[[156,194],[146,200,142,214,146,226],[162,224],[164,204]],'#f2efe8');
F(c,[[234,194],[246,198,248,212,246,224],[230,224],[228,204]],'#ebe7df');
var arm='#e8bb98';
F(c,[[148,222],[140,246,148,262,170,268],[180,258],[162,250,158,240,160,222]],arm);
F(c,[[232,222],[244,222],[250,240,256,236,268,232],[270,242],[256,250,240,252,232,222]],arm);
E(c,266,236,8,6,'#ecc19f',-.3);
c.strokeStyle='#b98a6a';c.lineWidth=1;c.beginPath();c.moveTo(262,232);c.lineTo(270,233);c.moveTo(262,236);c.lineTo(271,237);c.stroke();
F(c,[[180,270],[170,300],[178,304],[190,278]],'#f1ede6');F(c,[[190,270],[196,306],[204,302],[196,272]],'#e6e1d8');
for (i=0;i<18;i++){var ba=R()*TAU,bd=R()*15;E(c,186+Math.cos(ba)*bd,262+Math.sin(ba)*bd*.8,5,4.5,i % 3?'#fbfaf6':'#e9e6de');E(c,186+Math.cos(ba)*bd,262+Math.sin(ba)*bd*.8,1.6,1.6,'#d8cf9a');}
for (i=0;i<6;i++){var la=PI*.15+i*.5;E(c,186+Math.cos(la)*19,262+Math.sin(la)*15,6,2.6,'#4f6e3e',la);}
E(c,172,266,6,5,'#efc4a2');E(c,200,270,6,5,'#e8bb98');
face(c,190,138,25,{
skin: '#efc6a2',shade: '#c08d6b',light: '#fbdcc0',hair: '#141010',browW: 2.2,turn: .12,tilt: -.28,up: -.06,eyes: 'laugh',mouth: 'laugh',brow: 'up',blush: .35,jaw: .42,
back: function (c,r){F(c,[[-.98*r,.6*r],[-1.25*r,-.4*r,-.9*r,-1.2*r,.1*r,-1.12*r],[1.0*r,-1.05*r,1.22*r,-.3*r,1.0*r,.65*r],[1.08*r,.9*r],[.7*r,.82*r],[-.7*r,.82*r],[-1.1*r,.9*r]],'#141010');},
front: function (c,r){
F(c,[[-.25*r,-1.08*r],[.5*r,-1.1*r,1.05*r,-.7*r,1.0*r,.1*r],[1.08*r,.6*r,1.0*r,.85*r,1.08*r,.9*r],[.82*r,.6*r,.86*r,.1*r,.82*r,-.2*r],[.6*r,-.55*r,.1*r,-.62*r,-.4*r,-.62*r],[-.25*r,-.85*r]],'#181312');
F(c,[[-.25*r,-1.08*r],[-.8*r,-1.0*r,-1.02*r,-.4*r,-.98*r,.6*r],[-1.1*r,.9*r],[-.86*r,.6*r,-.86*r,.0*r,-.82*r,-.25*r],[-.7*r,-.6*r,-.4*r,-.62*r]],'#181312');
c.strokeStyle='rgba(160,145,135,.55)';c.lineWidth=1.3;
c.beginPath();c.moveTo(-.1*r,-.98*r);c.quadraticCurveTo(.6*r,-.95*r,.85*r,-.3*r);c.stroke();
c.beginPath();c.moveTo(-.4*r,-.95*r);c.quadraticCurveTo(-.85*r,-.7*r,-.9*r,-.1*r);c.stroke();
for (var k=0;k<7;k++){var a=-2.6+k*.32;E(c,Math.cos(a)*.98*r,Math.sin(a)*.98*r-.08*r,3.2,3.2,'#fbfaf5');E(c,Math.cos(a)*.98*r,Math.sin(a)*.98*r-.08*r,1.1,1.1,'#d9cf9e');}
}
});
// ---- guests at the edges (near,out of focus)
c.save();c.filter='blur(3px)';
F(c,[[0,200],[30,190,52,220,58,340],[0,340]],'#2e3038');
F(c,[[0,240],[30,200,52,150,64,120],[76,128],[66,160,46,220,14,270]],'#3a3c45');
E(c,72,116,11,9,'#dcae8a',-.6);
F(c,[[480,170],[452,176,436,220,430,340],[480,340]],'#8d7a8c');
E(c,476,140,26,30,'#2a2220');E(c,470,118,40,9,'#54405a');
F(c,[[440,230],[420,190,408,150,402,124],[412,120],[424,160,438,200,456,222]],'#e0b294');
c.restore();
// ---- rice in the air
for (i=0;i<170;i++){
var side=R()<.5,rx=side?R()*200:280+R()*200,ry=10+R()*260;
if (R()<.35){rx=120+R()*240;ry=10+R()*120;}
var ra=R()*PI;
c.beginPath();c.ellipse(rx,ry,2.2,1.1,ra,0,TAU);c.fillStyle='#fffdf6';c.fill();c.strokeStyle='rgba(70,60,50,.35)';c.lineWidth=.5;c.stroke();
}
// ---- pigeons taking off,near
pigeon(c,70,190,1.0,1,0);pigeon(c,418,250,1.1,0,1);pigeon(c,400,66,.85,1,0);pigeon(c,106,300,.9,1,1);
},
mantou: function (c,W,H){
var R=rng(20190107),i,VX=400,VY=168;
c.fillStyle=LG(c,0,0,0,VY+20,[[0,'#0f1830'],[.6,'#24375e'],[1,'#5a7096']]);c.fillRect(0,0,W,H);
for (i=0;i<25;i++) E(c,300+R()*180,80+R()*70,.7,.7,'rgba(230,235,255,.7)');
c.fillStyle='#121a2a';P(c,[[330,VY+4],[350,150],[370,152],[372,140],[395,142],[398,132],[420,134],[430,146],[460,144],[480,150],[480,VY+10]]);c.fill();
for (i=0;i<14;i++){c.fillStyle=R()<.6?'#f2c76a':'#e9e2c8';c.fillRect(350+R()*125,146+R()*18,2,2);}
E(c,446,160,2.4,2.4,'#e23c3c');glow(c,446,160,9,'rgba(255,80,80,.5)');E(c,468,163,2,2,'#4ce08a');glow(c,468,163,8,'rgba(80,255,150,.4)');
// track bed+rails
F(c,[[VX-6,VY],[VX+6,VY],[480,250],[480,340],[318,340]],'#2c303a');
for (i=1;i<16;i++){var tt=Math.pow(i/16,1.8),yy=VY+(340-VY)*tt,xl=VX+(330-VX)*tt,xr=VX+(540-VX)*tt;c.strokeStyle='rgba(70,58,50,.9)';c.lineWidth=1+7*tt;c.beginPath();c.moveTo(xl+8*tt,yy);c.lineTo(xr-10*tt,yy);c.stroke();}
[[372,'rgba(210,220,240,.9)'],[480,'rgba(240,210,170,.95)'],[392,'rgba(160,170,190,.6)'],[500,'rgba(160,170,190,.6)']].forEach(function (a){c.strokeStyle=a[1];c.lineWidth=2.4;c.beginPath();c.moveTo(VX+1,VY);c.lineTo(a[0],340);c.stroke();});
for (i=0;i<60;i++){var tq=R();E(c,VX+(360+R()*140-VX)*tq,VY+(340-VY)*tq,.9,.6,'rgba(235,240,255,.5)');}
// left wall (station building)
F(c,[[0,120],[VX-30,VY-24],[VX-8,VY],[0,236]],LG(c,0,0,VX,0,[[0,'#3c3e4a'],[1,'#2a2f40']]));
[[20,.05],[130,.33],[230,.6],[300,.78]].forEach(function (a,k){
var t=a[1],x0=t*(VX-10),top=128+(VY-22-128)*t,bot=228+(VY-2-228)*t,w=46*(1-t)+6;
if (k==0) return;
c.fillStyle='#e8b464';c.fillRect(x0,top+14*(1-t),w,(bot-top)*.55);
glow(c,x0+w/2,top+(bot-top)*.3,w*1.4,'rgba(255,190,110,.25)');
c.fillStyle='#5a3a24';c.fillRect(x0+w/2-.6,top+14*(1-t),1.4,(bot-top)*.55);
});
// platform floor
F(c,[[0,236],[VX-8,VY],[VX-2,VY],[324,340],[0,340]],LG(c,0,VY,0,H,[[0,'#4a5060'],[1,'#6a7180']]));
for (i=1;i<12;i++){var tp=Math.pow(i/12,1.7),yp=VY+(340-VY)*tp;c.strokeStyle='rgba(30,34,44,.35)';c.lineWidth=1;c.beginPath();c.moveTo(Math.max(0,(VX-8)-(VX-8)*tp*3.2),yp);c.lineTo(VX-2+(324-VX+2)*tp,yp);c.stroke();}
// frosted edge
F(c,[[VX-3,VY],[VX-1,VY],[326,340],[304,340]],'#c9d3e2');
F(c,[[VX-1,VY],[VX+1,VY+1],[334,340],[326,340]],'#20242e');
for (i=0;i<260;i++){var tf=Math.pow(R(),.7),xe=VX-2+(316-VX)*tf+(R()-.5)*22*tf;E(c,xe-R()*30*tf,VY+(340-VY)*tf-R()*4,.9,.7,'rgba(245,250,255,'+(.5+R()*.5)+')');}
// canopy
F(c,[[0,0],[480,0],[470,26],[VX-2,VY-30],[VX-30,VY-26],[0,112]],'#161c2a');
c.strokeStyle='#2b3346';c.lineWidth=2;
for (i=0;i<7;i++){var sx=i*80-40;c.beginPath();c.moveTo(sx,0);c.lineTo(VX-14,VY-28);c.stroke();}
for (i=1;i<9;i++){var tc=Math.pow(i/9,.8);c.beginPath();c.moveTo((VX-30)*tc,112+(VY-26-112)*tc);c.lineTo(480+(VX-2-480)*tc,26+(VY-30-26)*tc);c.stroke();}
F(c,[[470,26],[480,26],[VX,VY-27],[VX-2,VY-30]],'#3a4560');
// lamps
[[226,92,1],[300,122,.7],[352,142,.45],[380,154,.3]].forEach(function (a){
var s=a[2];c.strokeStyle='#0c0f16';c.lineWidth=1.5*s;c.beginPath();c.moveTo(a[0],a[1]-28*s);c.lineTo(a[0],a[1]-6*s);c.stroke();
F(c,[[a[0]-9*s,a[1]],[a[0]-4*s,a[1]-7*s],[a[0]+4*s,a[1]-7*s],[a[0]+9*s,a[1]]],'#1c2230');
E(c,a[0],a[1]+2*s,5*s,3.5*s,'#fff1c8');
glow(c,a[0],a[1]+3*s,60*s,'rgba(255,205,130,.45)');
var fy=VY+(340-VY)*(1-(a[1]-60)/120)*.7;glow(c,a[0]-30*s,fy,80*s,'rgba(255,190,120,.22)');
});
// Josep's clock
var cx=160,cy=64,cr=42;
c.fillStyle='#0c0f16';c.fillRect(cx-3,0,6,cy-cr);c.fillRect(cx-18,0,36,6);
E(c,cx,cy-cr-2,6,4,'#2b2f38');
glow(c,cx,cy,cr*2.2,'rgba(255,220,160,.35)');
E(c,cx,cy,cr+6,cr+6,LG(c,cx-cr,cy-cr,cx+cr,cy+cr,[[0,'#5a5e68'],[.5,'#24272e'],[1,'#121418']]));
E(c,cx,cy,cr+2,cr+2,'#8a7a50');
E(c,cx,cy,cr,cr,RG(c,cx-8,cy-10,4,cr,[[0,'#fff8e4'],[1,'#e8dcb8']]));
c.strokeStyle='#1a1612';
for (i=0;i<60;i++){var ta=i/60*TAU,big=i % 5==0;c.lineWidth=big?2.6:.8;c.beginPath();c.moveTo(cx+Math.sin(ta)*cr*(big?.78:.88),cy-Math.cos(ta)*cr*(big?.78:.88));c.lineTo(cx+Math.sin(ta)*cr*.94,cy-Math.cos(ta)*cr*.94);c.stroke();}
c.fillStyle='#1a1612';c.font='bold 9px serif';c.textAlign='center';c.textBaseline='middle';
[12,3,6,9].forEach(function (n){var na=n/12*TAU;c.fillText(String(n),cx+Math.sin(na)*cr*.62,cy-Math.cos(na)*cr*.62+.5);});
var ha=(7+40/60)/12*TAU,ma=40/60*TAU;
c.lineCap='round';c.lineWidth=4;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(ha)*cr*.5,cy-Math.cos(ha)*cr*.5);c.stroke();
c.lineWidth=2.6;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(ma)*cr*.8,cy-Math.cos(ma)*cr*.8);c.stroke();
c.strokeStyle='#a52a22';c.lineWidth=1;c.beginPath();c.moveTo(cx-Math.sin(ma)*8,cy+Math.cos(ma)*8);c.lineTo(cx+Math.sin(ma+2.2)*cr*.85,cy-Math.cos(ma+2.2)*cr*.85);c.stroke();
E(c,cx,cy,3,3,'#1a1612');
// light pools by the people
glow(c,190,290,120,'rgba(255,195,120,.18)');
// ---- Popo,crouched
F(c,[[94,230],[80,270,84,300,92,312],[150,314],[150,260]],'#1c2233');
E(c,150,312,46,6,'rgba(10,12,20,.5)');
F(c,[[102,222],[118,204,160,200,180,212],[196,240,200,270,190,296],[118,300],[104,270,98,240,102,222]],LG(c,100,0,200,0,[[0,'#2a3248'],[.5,'#323b54'],[1,'#1c2234']]));
F(c,[[140,206],[158,204],[170,240,172,270,164,296],[140,296],[146,260,142,230,140,206]],LG(c,140,0,172,0,[[0,'#b0262c'],[1,'#d6383c']]));
c.strokeStyle='rgba(90,10,15,.5)';c.lineWidth=1;for (i=0;i<6;i++){c.beginPath();c.moveTo(146+i*3.5,210);c.lineTo(146+i*3.8,294);c.stroke();}
F(c,[[150,262],[196,268,212,282,218,300],[212,312,160,314,140,308]],LG(c,0,260,0,312,[[0,'#353e58'],[1,'#1c2234']]));
F(c,[[118,296],[116,316],[176,318],[180,300]],'#151a26');E(c,128,314,16,6,'#2a2020');E(c,202,312,18,6,'#2a2020');
F(c,[[176,216],[204,222,222,236,236,248],[232,260],[214,252,196,244,172,244]],'#2c344c');
F(c,[[226,244],[236,240],[240,248],[234,258],[226,256]],'#b8262c');
face(c,150,174,25,{
skin: '#ecc3a0',shade: '#b8866a',light: '#f8d8bc',hair: '#9c9a98',browC: '#6c6a68',browW: 2,turn: .38,tilt: .1,eyes: 'open',look: [.6,.7],mouth: 'smile',blush: .28,age: 1,glasses: '#3f8a66',jaw: .42,
neck: function (c,r){F(c,[[-.4*r,.6*r],[-.38*r,1.4*r],[.48*r,1.4*r],[.48*r,.6*r]],'#d9ad8c');F(c,[[-.7*r,1.0*r],[.2*r,1.4*r,.9*r,1.0*r,1.0*r,1.25*r],[.7*r,1.65*r],[-.5*r,1.6*r]],'#7d6a58');},
back: function (c,r){E(c,-.5*r,-.72*r,.42*r,.38*r,'#a9a7a4');c.strokeStyle='#2f7d5a';c.lineWidth=3;c.beginPath();c.moveTo(-1.0*r,-.9*r);c.lineTo(-.05*r,-.55*r);c.stroke();E(c,-1.0*r,-.9*r,3,3,'#3f9a6c');},
front: function (c,r){
F(c,[[-.92*r,.1*r],[-1.0*r,-.85*r,-.2*r,-1.12*r,.3*r,-1.02*r],[.85*r,-.92*r,.98*r,-.4*r,.9*r,.05*r],[.75*r,-.5*r,.3*r,-.66*r,.0*r,-.66*r],[-.5*r,-.66*r,-.85*r,-.4*r,-.92*r,.1*r]],'#b5b3b0');
c.strokeStyle='rgba(110,108,105,.6)';c.lineWidth=1;for (var k=0;k<6;k++){c.beginPath();c.moveTo(-.7*r+k*.28*r,-.66*r);c.quadraticCurveTo(-.6*r+k*.2*r,-1.0*r,-.5*r+k*.05*r,-1.04*r);c.stroke();}
}
});
// ---- Mantou
dog(c,252,304,.95);
// Popo's hand on his back
c.save();c.translate(24,-8);
F(c,[[196,222],[208,210],[226,214],[230,226],[214,234],[198,236]],'#e4b896');
c.strokeStyle='#b08364';c.lineWidth=1;[[206,214,218,222],[212,212,224,220],[204,220,214,228]].forEach(function (a){c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(a[2],a[3]);c.stroke();});
c.restore();
F(c,[[176,216],[204,208],[224,214],[222,232],[178,244]],'#2c344c');
// breath
c.fillStyle='rgba(230,236,250,.18)';E(c,322,182,14,7,'rgba(230,236,250,.22)',-.2);E(c,336,176,10,5,'rgba(230,236,250,.14)',-.2);
// cold cast
c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgba(150,175,225,.55)';c.fillRect(0,0,W,H);c.restore();
c.save();c.globalCompositeOperation='screen';glow(c,160,64,70,'rgba(255,220,150,.35)');glow(c,226,95,50,'rgba(255,200,120,.3)');glow(c,200,230,110,'rgba(255,190,130,.12)');c.restore();
},
kittens: function (c,W,H){
var R=rng(2007),i,j;
// tiled wall
c.fillStyle='#e9ece6';c.fillRect(0,0,W,H);
c.strokeStyle='rgba(140,150,145,.5)';c.lineWidth=1;
for (i=0;i<=W;i+=20){c.beginPath();c.moveTo(i+.5,0);c.lineTo(i+.5,210);c.stroke();}
for (j=0;j<=210;j+=20){c.beginPath();c.moveTo(0,j+.5);c.lineTo(W,j+.5);c.stroke();}
for (i=0;i<40;i++){c.fillStyle='rgba(180,160,110,'+(R()*.12)+')';c.fillRect(Math.floor(R()*24)*20,Math.floor(R()*10)*20,20,20);}
c.fillStyle='#3d7a68';c.fillRect(0,196,W,14);
c.fillStyle='#5a5e64';c.fillRect(0,210,W,H);
c.fillStyle=LG(c,0,210,0,236,[[0,'#d8dde2'],[.3,'#9aa2aa'],[1,'#6c737b']]);c.fillRect(0,210,W,26);
c.fillStyle='rgba(255,248,220,.35)';c.fillRect(0,0,W,6);
c.fillStyle=RG(c,200,0,20,360,[[0,'rgba(255,245,215,.35)'],[1,'rgba(255,245,215,0)']]);c.fillRect(0,0,W,H);
// shelf+jars
c.fillStyle='#7a5434';c.fillRect(0,110,90,6);
[['#c9a24a',10],['#a8402e',34],['#e2d6b0',58]].forEach(function (a){c.fillStyle=a[0];c.fillRect(a[1],84,18,26);c.fillStyle='#3a3a3a';c.fillRect(a[1]-1,80,20,5);c.fillStyle='rgba(255,255,255,.4)';c.fillRect(a[1]+3,88,3,18);});
// rail with ladles,strainers,cleaver
c.fillStyle='#a8adb3';c.fillRect(20,24,330,4);
[[44,'ladle'],[80,'basket'],[118,'ladle'],[150,'cleaver'],[190,'basket'],[236,'ladle'],[268,'spatula'],[304,'basket']].forEach(function (a){
var x=a[0];c.strokeStyle='#7d848c';c.lineWidth=2;c.beginPath();c.arc(x,30,3,0,TAU);c.stroke();
if (a[1]=='ladle'){c.fillStyle=LG(c,x-2,0,x+2,0,[[0,'#9aa1a8'],[1,'#e0e4e8']]);c.fillRect(x-1.5,32,3,44);E(c,x,82,10,7,LG(c,x-10,0,x+10,0,[[0,'#8e959c'],[.4,'#eef1f4'],[1,'#7a8088']]));}
if (a[1]=='basket'){c.fillStyle='#6b4a2a';c.fillRect(x-1.5,32,3,30);E(c,x,74,13,13,'rgba(190,195,200,.6)');c.strokeStyle='#8a9096';c.lineWidth=.7;for (var k=-12;k<=12;k+=3){c.beginPath();c.moveTo(x+k,62);c.lineTo(x+k*.7,86);c.stroke();c.beginPath();c.moveTo(x-12,74+k*.6);c.lineTo(x+12,74+k*.6);c.stroke();}}
if (a[1]=='cleaver'){c.fillStyle='#3a2a1c';c.fillRect(x-2,32,4,18);F(c,[[x-10,50],[x+12,50],[x+12,82],[x-10,78]],LG(c,x-10,0,x+12,0,[[0,'#b8bec4'],[1,'#e8ecef']]));}
if (a[1]=='spatula'){c.fillStyle='#6b4a2a';c.fillRect(x-1.5,32,3,30);F(c,[[x-8,62],[x+8,62],[x+10,84],[x-10,84]],'#c4c9ce');}
});
// stove and pots,steam (behind Popo)
c.fillStyle='#3a3e44';c.fillRect(380,176,100,40);
[[410,140,34,52],[462,150,28,40]].forEach(function (a){
c.fillStyle=LG(c,a[0]-a[2],0,a[0]+a[2],0,[[0,'#7c838a'],[.3,'#e6eaee'],[.55,'#b6bcc2'],[1,'#6a7078']]);c.fillRect(a[0]-a[2],a[1],a[2]*2,a[3]);
E(c,a[0],a[1],a[2],6,'#d8dde2');E(c,a[0],a[1],a[2]-3,4,'#4a4e54');
c.fillStyle='#5a5f66';c.fillRect(a[0]-a[2]-6,a[1]+8,6,4);c.fillRect(a[0]+a[2],a[1]+8,6,4);
});
for (i=0;i<14;i++){var sx=395+R()*80,sy=130-R()*120;E(c,sx+Math.sin(sy/20)*10,sy,14+R()*18,10+R()*12,'rgba(255,255,255,'+(.14+R()*.14)+')');}
// ---- Popo,arms crossed
F(c,[[342,120],[340,150],[362,150],[360,120]],'#d4a582');
F(c,[[300,170],[316,150,340,146,352,146],[368,146,392,152,404,172],[412,230,414,300,416,340],[292,340],[292,300,292,230,300,170]],LG(c,292,0,416,0,[[0,'#a8282c'],[.5,'#c8363a'],[1,'#8e1e22']]));
F(c,[[334,152],[370,152],[378,200],[384,340],[322,340],[326,200]],LG(c,322,0,384,0,[[0,'#d7dce4'],[.5,'#f2f4f7'],[1,'#c6ccd6']]));
c.strokeStyle='rgba(70,100,150,.35)';c.lineWidth=1;for (i=0;i<7;i++){c.beginPath();c.moveTo(322,220+i*18);c.lineTo(384,220+i*18);c.stroke();c.beginPath();c.moveTo(326+i*9,152);c.lineTo(324+i*9.5,340);c.stroke();}
F(c,[[340,150],[352,164],[364,150],[360,158,354,166,352,166],[348,166,342,158,340,150]],'#d4a582');
F(c,[[298,196],[330,186,370,186,406,194],[410,216],[370,226,330,226,296,218]],LG(c,0,186,0,226,[[0,'#d23c40'],[1,'#9a2226']]));
F(c,[[300,208],[330,202,366,204,404,208],[402,226],[366,236,330,236,302,228]],LG(c,0,202,0,236,[[0,'#c4343a'],[1,'#8c1c20']]));
E(c,318,206,10,7,'#e2b18e',-.3);E(c,388,214,9,7,'#dcab88',.3);
c.strokeStyle='rgba(90,10,15,.45)';c.lineWidth=1.2;c.beginPath();c.moveTo(304,212);c.quadraticCurveTo(350,206,402,212);c.stroke();
face(c,352,106,27,{
skin: '#e9bf9b',shade: '#b48262',light: '#f5d4b6',hair: '#4a4644',browC: '#3a3634',browW: 2.6,turn: -.35,tilt: -.08,eyes: 'squint',look: [-.8,.6],mouth: 'twitch',side: -1,brow: 'knit',blush: .22,age: .6,glasses: '#3f8a66',jaw: .42,
back: function (c,r){E(c,.3*r,-.9*r,.42*r,.36*r,'#55504c');c.strokeStyle='#2f7d5a';c.lineWidth=3;c.beginPath();c.moveTo(-.1*r,-1.15*r);c.lineTo(.85*r,-.75*r);c.stroke();},
front: function (c,r){
F(c,[[-.92*r,.05*r],[-1.0*r,-.85*r,-.2*r,-1.1*r,.3*r,-1.0*r],[.85*r,-.92*r,1.0*r,-.4*r,.9*r,.05*r],[.75*r,-.5*r,.3*r,-.64*r,.0*r,-.64*r],[-.5*r,-.64*r,-.85*r,-.4*r,-.92*r,.05*r]],'#4e4a47');
c.strokeStyle='rgba(200,198,195,.7)';c.lineWidth=1.1;for (var k=0;k<7;k++){c.beginPath();c.moveTo(-.7*r+k*.24*r,-.64*r);c.quadraticCurveTo(-.6*r+k*.18*r,-.98*r,-.4*r+k*.06*r,-1.0*r);c.stroke();}
}
});
// ---- Wei (10)
F(c,[[160,136],[158,160],[180,160],[178,136]],'#e2b691');
F(c,[[118,182],[130,160,154,154,168,154],[184,154,210,160,222,182],[230,240,232,300,236,340],[104,340],[106,300,110,240,118,182]],LG(c,104,0,236,0,[[0,'#2f5f9a'],[.5,'#3a74b8'],[1,'#244a7c']]));
c.save();P(c,[[118,182],[130,160,154,154,168,154],[184,154,210,160,222,182],[230,240,232,300,236,340],[104,340],[106,300,110,240,118,182]]);c.clip();
c.fillStyle='rgba(240,244,250,.85)';for (j=168;j<340;j+=16) c.fillRect(90,j,160,5);c.restore();
F(c,[[152,156],[168,166],[184,156],[178,162,172,166,168,166],[164,166,158,162,152,156]],'#e2b691');
F(c,[[118,184],[102,214],[106,226],[126,222]],'#3a74b8');F(c,[[222,184],[238,214],[234,226],[214,222]],'#2c5a94');
// the box
F(c,[[100,196],[80,168],[96,160],[118,190]],'#b88c56');
F(c,[[242,196],[262,166],[246,160],[222,190]],'#a87c48');
F(c,[[104,192],[236,192],[232,196],[108,196]],'#6a4a26');
F(c,[[104,194],[236,194],[232,262],[108,262]],LG(c,104,0,236,0,[[0,'#b08250'],[.5,'#c9995e'],[1,'#9c7040']]));
c.strokeStyle='rgba(80,50,20,.35)';c.lineWidth=2;c.beginPath();c.moveTo(108,228);c.lineTo(232,228);c.stroke();
c.fillStyle='rgba(70,40,20,.55)';c.font='bold 9px sans-serif';c.textAlign='center';c.fillText('\u96de\u86cb  EGGS',170,250);
// kittens peeking
kitten(c,146,178,18,'#222228','#111','#e2b33a',0);
E(c,136,196,7,5,'#2a2a30');E(c,156,196,7,5,'#2a2a30');
kitten(c,196,174,18,'#e08a3c','#a8561e','#7fbf4a',1);
E(c,188,195,7,5,'#f2b06a');E(c,206,195,7,5,'#f2b06a');
c.strokeStyle='#a8561e';c.lineWidth=1;[[186,193],[204,193]].forEach(function (p){c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+1,p[1]+4);c.stroke();});
// hands on the box
E(c,106,222,9,12,'#e8bd99');E(c,234,222,9,12,'#dcb08c');
c.strokeStyle='#b48464';c.lineWidth=1;for (i=0;i<3;i++){c.beginPath();c.moveTo(108,214+i*6);c.lineTo(114,214+i*6);c.stroke();c.beginPath();c.moveTo(226,214+i*6);c.lineTo(232,214+i*6);c.stroke();}
face(c,168,106,31,{
skin: '#ecc29e',shade: '#bd8a66',light: '#f8d9bd',hair: '#151112',browW: 2.6,turn: .18,tilt: .06,eyes: 'open',look: [.6,-.1],mouth: 'grin',brow: 'up',blush: .35,glasses: '#c8862e',jaw: .5,
back: function (c,r){F(c,[[-.95*r,.2*r],[-1.12*r,-.9*r,-.2*r,-1.25*r,.3*r,-1.15*r],[1.1*r,-1.0*r,1.1*r,-.2*r,.95*r,.2*r]],'#151112');},
front: function (c,r){
F(c,[[-.94*r,.05*r],[-1.05*r,-.95*r,-.1*r,-1.22*r,.4*r,-1.08*r],[.95*r,-.95*r,1.02*r,-.4*r,.93*r,.05*r],[.85*r,-.3*r],[.7*r,-.42*r],[.55*r,-.36*r],[.38*r,-.48*r],[.2*r,-.4*r],[.0*r,-.5*r],[-.2*r,-.42*r],[-.42*r,-.5*r],[-.6*r,-.38*r],[-.82*r,-.4*r]],'#171314');
c.strokeStyle='rgba(150,140,140,.5)';c.lineWidth=1.2;c.beginPath();c.moveTo(-.5*r,-.98*r);c.quadraticCurveTo(.2*r,-1.12*r,.7*r,-.85*r);c.stroke();
}
});
}
};
})());