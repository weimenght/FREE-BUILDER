/* Crag Master · Rope team
   Invite a friend and climb a multi-pitch route together. One of you leads a pitch while the other belays:
   the belayer watches the leader move live, feeds slack for every clip, catches the falls and shouts "Allez!".
   At each anchor you swap leads. Both phones build the same route from one seed on a 360-wide wall.
   Moves travel over FREE//BUILDER's realtime relay; nothing is stored. Uses the game's own globals. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var R = { code: "", host: false, tx: null, peer: null, role: null, active: false, me: "", led: { me: 0, them: 0 }, soft: false, slack: false, lastPose: null, cheerAt: 0 };
  var W_LOGICAL = 360;
  var cfg = { url: "", key: "", rt: "" };
  (function keys() { var sc = document.createElement("script"); sc.src = "/config.js"; sc.onload = sc.onerror = function () { var c = window.FB_SUPABASE || {}; cfg.url = c.url || ""; cfg.key = c.anonKey || ""; cfg.rt = c.realtimeUrl || ""; cfg.done = true; }; document.head.appendChild(sc); })();

  /* ---------- look ---------- */
  var css = "" +
    ".rp-btn{width:100%;min-height:44px;display:flex;align-items:center;justify-content:center;gap:6px;background:#0f172a;color:#fde68a;border:2px solid #f59e0b;font:10px/1.4 'Press Start 2P',monospace;cursor:pointer;box-shadow:3px 3px 0 #000}" +
    ".rp-btn{text-transform:uppercase}.rp-btn.on{background:#1f6f62;border-color:#8ee6d4;color:#eef2ff}.rp-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #000}" +
    ".rp-sheet{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:16px;background:rgba(2,6,23,.86)}" +
    ".rp-sheet{width:100vw;height:100vh;height:100dvh}.rp-card{width:min(420px,calc(100vw - 32px));background:#0b1220;border:3px solid #22d3ee;box-shadow:6px 6px 0 #000;padding:16px;color:#e2e8f0;font:16px/1.35 system-ui,sans-serif}" +
    ".rp-card h3{margin:0 0 10px;font:12px/1.5 'Press Start 2P',monospace;color:#67e8f9}" +
    ".rp-code{font:28px/1 'Press Start 2P',monospace;letter-spacing:.2em;color:#fde68a;text-align:center;margin:10px 0;padding:12px;border:2px dashed #f59e0b}" +
    ".rp-row{display:flex;gap:8px;margin-top:10px}.rp-row input{flex:1;min-width:0;background:#020617;color:#fde68a;border:2px solid #334155;padding:10px;font:18px/1 'Press Start 2P',monospace;text-transform:uppercase;letter-spacing:.15em}" +
    ".rp-row button,.rp-go{background:#22d3ee;color:#04121a;border:2px solid #fff;font:10px/1.4 'Press Start 2P',monospace;padding:10px 12px;cursor:pointer;box-shadow:3px 3px 0 #000}" +
    ".rp-go{width:100%;margin-top:12px;min-height:48px;background:#fde047}.rp-go:disabled{opacity:.4;cursor:default}" +
    ".rp-st{margin-top:10px;font-size:14px;color:#94a3b8;text-align:center;min-height:20px}.rp-st b{color:#fde68a}" +
    ".rp-x{float:right;background:none;border:0;color:#94a3b8;font-size:22px;cursor:pointer;line-height:1}" +
    ".rp-or{margin:14px 0 4px;font-size:12px;color:#64748b;text-align:center}" +
    "#rpBelay{display:none;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding:6px 6px max(6px,env(safe-area-inset-bottom));background:#090e1a;border-top:2px solid #f59e0b;position:relative;z-index:25}" +
    "body.rp-belaying #rpBelay{display:grid}body.rp-belaying #inGameFooterBar{display:none!important}" +
    "#rpBelay button{min-height:56px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#111827;color:#e2e8f0;border:2px solid #334155;font:8px/1.3 'Press Start 2P',monospace;cursor:pointer}" +
    "#rpBelay button span:first-child{font-size:20px}#rpBelay button.hot{border-color:#fde047;background:#3f2d00;animation:rpHot .4s steps(2) infinite}#rpBelay button:disabled{opacity:.35}" +
    "@keyframes rpHot{50%{background:#7c5800}}" +
    "#rpTag{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:30;padding:5px 9px;background:rgba(2,6,23,.85);border:2px solid #f59e0b;color:#fde68a;font:8px/1.4 'Press Start 2P',monospace;white-space:nowrap;pointer-events:none;display:none}" +
    "body.rp-on #rpTag{display:block}" +
    "#rpShout{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:31;font:14px/1.4 'Press Start 2P',monospace;color:#fde047;text-shadow:3px 3px 0 #000;pointer-events:none;opacity:0;transition:opacity .2s;text-align:center}#rpShout.show{opacity:1}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- with a friend: the town's one card (/nearby/duo.js), channel fbclimb-<code>; old ?rope= links still work ---------- */
  var duo = null;
  var TX = {
    btn: ["With a friend", "和朋友一起", "和朋友一起", "Con un amigo", "Amb un amic"],
    go: ["🧗 Tie in & climb", "🧗 系好绳，出发", "🧗 繫好繩，出發", "🧗 Encordaos y a escalar", "🧗 Encordeu-vos i a escalar"],
    wait: ["{n} ties you in", "{n} 来系绳", "{n} 來繫繩", "{n} te encuerda", "{n} t'encorda"],
    partner: ["your partner", "搭档", "搭檔", "tu compañero", "el teu company"]
  };
  function tl(a) { var i = ({ en: 0, zh: 1, "zh-Hant": 2, es: 3, ca: 4 })[(window.FBL && FBL.get && FBL.get()) || "en"] || 0; return a[i] || a[0]; }
  function send(ev, p) { if (duo) duo.send(ev, p || {}); }
  function myName() { var v = ($("callsignInput") && $("callsignInput").value.trim()) || (typeof callsign !== "undefined" && callsign) || ""; try { v = v || localStorage.getItem("fb_nick") || ""; } catch (e) {} return v.slice(0, 16); }
  function hostNow() { return !!(duo && duo.host()); }
  function startDuo() {
    if (duo || !window.FBDuo) return;
    duo = FBDuo({ topic: "fbclimb", legacy: "rope", name: myName,
      start: { go: TX.go, wait: TX.wait.map(function (w) { return w; }) }, onStart: goClimb,
      onPeer: function (here, n) {
        if (here) { R.peer = { n: n || tl(TX.partner), c: 0 }; send("me", { n: myName(), c: charIdx() }); }
        else { var was = R.active; R.peer = null; if (was) { R.active = false; setRole("lead"); document.body.classList.remove("rp-on"); } }
        paintBtn();
      },
      onMsg: onMsg, onState: paintBtn });
  }
  function onMsg(ev, p) {
    if (ev === "me") { R.peer = { n: String(p.n || (R.peer && R.peer.n) || tl(TX.partner)).slice(0, 16), c: p.c | 0 }; paintBtn(); return; }
    if (ev === "start") return startRope(p, "belay");
    if (!R.active) return;
    if (ev === "pose") { R.lastPose = p; if (R.role === "belay") applyBolts(p.k); return; }
    if (ev === "clip" && R.role === "belay") { hot("rpSlack", true); return; }
    if (ev === "fall" && R.role === "belay") { hot("rpCatch", true); hot("rpSlack", false); R.fallAt = Date.now(); return; }
    if (ev === "slack" && R.role === "lead") { R.slack = true; if (climber.clipTimer > 0) climber.clipTimer = Math.min(climber.clipTimer, 8); shout("🪢 " + R.peer.n + ": slack!"); return; }
    if (ev === "catch" && R.role === "lead") { R.soft = !!p.soft; return; }
    if (ev === "cheer" && R.role === "lead") { climber.grip = Math.min(climber.maxGrip, climber.grip + 6); shout("💪 " + R.peer.n + ": ALLEZ!"); return; }
    if (ev === "anchor" && R.role === "belay") { R.led.them++; takeOver(p); return; }
    if (ev === "end" && R.role === "belay") { endTogether(p); return; }
  }
  function charIdx() { try { return typeof charIndex === "number" ? charIndex : 0; } catch (e) { return 0; } }
  function openSheet() { startDuo(); if (duo) duo.open(); }
  function closeSheet() { if (duo) duo.close(); }
  function paintBtn() {   /* the title-screen button: 👥 With a friend, teal once your friend is here */
    var b = $("rpBtn"); if (!b) return; var here = !!(duo && duo.peer());
    b.classList.toggle("on", here); b.lastElementChild.textContent = tl(TX.btn) + (here && R.peer ? " · " + R.peer.n : "");
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- starting together ---------- */
  function goClimb() {
    if (!R.peer || !hostNow()) return;
    var ci = $("callsignInput"); if (ci && !ci.value.trim() && myName()) ci.value = myName();   /* the name you gave in town is your callsign */
    if (!validateCallsign()) { closeSheet(); return; }
    var p = { seed: (Math.random() * 1e9) | 0, crag: currentCrag.id, t: TIMES.indexOf(currentTime), w: WEATHERS.indexOf(currentWeather), n: myName(), c: charIdx() };
    send("start", p); startRope(p, "lead");
  }
  function startRope(p, role) {
    closeSheet();
    var input = $("callsignInput"); if (input && !input.value.trim()) input.value = (lsGetSafe("fb_nick") || "Climber").slice(0, 16);
    try { selectCragById(p.crag); } catch (e) {}
    if (p.t >= 0) currentTime = TIMES[p.t]; if (p.w >= 0) currentWeather = WEATHERS[p.w];
    try { updateAtmosphereUI(); } catch (e) {}
    routeSeed = p.seed; routeAttempts = 0;
    R.active = true; R.led = { me: 0, them: 0 }; R.myChar = charIdx(); R.lastPose = null;
    fixWidth();
    startDirectClimb();
    if (gameState !== STATES.PLAYING) { R.active = false; return; }
    document.body.classList.add("rp-on");
    send("me", { n: myName(), c: charIdx() });
    setRole(role);
    toast(role === "lead" ? "🧗 You lead pitch 1 — " + R.peer.n + " has you on belay." : "🪢 " + R.peer.n + " leads pitch 1. Feed slack, catch falls!");
  }
  function lsGetSafe(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* the same wall on every phone: a 360-wide route, scaled to fit */
  function fixWidth() {
    var w = $("canvasWrapper"); if (!w) return;
    canvas.width = W_LOGICAL; canvas.height = Math.round(w.clientHeight * W_LOGICAL / Math.max(1, w.clientWidth));
  }
  addEventListener("resize", function () { if (R.active) fixWidth(); });
  window.closestHold = function (clientX, clientY, maxDist) {
    var rect = canvas.getBoundingClientRect(), sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    var wx = (clientX - rect.left) * sx, wy = (canvas.height - (clientY - rect.top) * sy) + cameraY, best = null, min = maxDist * sx;
    rockHolds.forEach(function (h) { if (h.crumbled) return; var d = Math.hypot(h.x - wx, h.y - wy); if (d < min) { min = d; best = h; } });
    return best;
  };

  /* ---------- roles ---------- */
  function setRole(role) {
    R.role = role;
    document.body.classList.toggle("rp-belaying", role === "belay" && R.active);
    if (role === "belay") { var c = R.peer ? R.peer.c : 0; try { charIndex = c; currentChar = CHARACTERS[c] || currentChar; } catch (e) {} }
    else { try { charIndex = R.myChar; currentChar = CHARACTERS[R.myChar] || currentChar; } catch (e) {} }
    hot("rpSlack", false); hot("rpCatch", false);
    var tag = $("rpTag"); if (tag) tag.textContent = role === "lead" ? "🧗 LEADING · " + (R.peer ? R.peer.n.toUpperCase() : "") + " ON BELAY" : "🪢 BELAYING " + (R.peer ? R.peer.n.toUpperCase() : "");
  }
  function hot(id, on) { var b = $(id); if (b) { b.classList.toggle("hot", !!on); } }

  /* leader → partner, ten times a second */
  function pose() {
    var L = climber.leftHand, Rh = climber.rightHand;
    return { x: Math.round(climber.x), y: Math.round(climber.y), lx: Math.round(L.x), ly: Math.round(L.y), rx: Math.round(Rh.x), ry: Math.round(Rh.y), lh: L.hold ? L.hold.id : null, rh: Rh.hold ? Rh.hold.id : null,
      fx: Math.round(climber.leftFoot.x), fy: Math.round(climber.leftFoot.y), gx: Math.round(climber.rightFoot.x), gy: Math.round(climber.rightFoot.y),
      g: Math.round(climber.grip), f: climber.falling ? 1 : 0, hg: climber.hanging ? 1 : 0, a: +climber.altitude.toFixed(1), s: climber.score,
      k: bolts.map(function (b, i) { return b.clipped ? i : -1; }).filter(function (i) { return i >= 0; }), lc: lastClipY, pb: pitchBaseY, pi: currentPitchIndex };
  }
  setInterval(function () { if (R.active && R.role === "lead" && gameState === STATES.PLAYING) send("pose", pose()); }, 100);
  function applyBolts(k) { (k || []).forEach(function (i) { if (bolts[i]) bolts[i].clipped = true; }); }

  /* the belayer's screen follows the leader instead of running its own climber */
  var physics = window.updatePhysics;
  window.updatePhysics = function () {
    if (!(R.active && R.role === "belay" && gameState === STATES.PLAYING)) return physics.apply(this, arguments);
    var p = R.lastPose; if (p) {
      var k = 0.35, L = climber.leftHand, Rh = climber.rightHand;
      climber.x += (p.x - climber.x) * k; climber.y += (p.y - climber.y) * k; climber.targetX = p.x; climber.targetY = p.y;
      L.x += (p.lx - L.x) * k; L.y += (p.ly - L.y) * k; Rh.x += (p.rx - Rh.x) * k; Rh.y += (p.ry - Rh.y) * k;
      L.hold = p.lh != null ? holdMap.get(p.lh) || null : null; Rh.hold = p.rh != null ? holdMap.get(p.rh) || null : null;
      climber.leftFoot.x += (p.fx - climber.leftFoot.x) * k; climber.leftFoot.y += (p.fy - climber.leftFoot.y) * k;
      climber.rightFoot.x += (p.gx - climber.rightFoot.x) * k; climber.rightFoot.y += (p.gy - climber.rightFoot.y) * k;
      climber.grip = p.g; climber.falling = !!p.f; climber.hanging = !!p.hg; climber.altitude = p.a; climber.score = p.s;
      lastClipY = p.lc; pitchBaseY = p.pb;
      if (!p.f && !p.hg) hot("rpCatch", false);
    }
    climber.animTick = (climber.animTick || 0) + 1; if (climber.bounce > 0) climber.bounce *= 0.9;
    targetCameraY = Math.max(0, climber.y - canvas.height * 0.40);
    cameraY += (targetCameraY - cameraY) * 0.14;
    while (highestHoldY - cameraY < canvas.height + 200) spawnProgressiveHoldBand();
    for (var i = rockParticles.length - 1; i >= 0; i--) { var q = rockParticles[i]; q.x += q.vx; q.y += q.vy; q.life -= q.decay; if (q.life <= 0) rockParticles.splice(i, 1); }
  };
  /* a belayer's hands are on the rope, not the rock */
  ["attemptGrabHold", "clipBolt", "useShakeoutAction", "useChalkPowder", "useTryHard"].forEach(function (fn) {
    var f = window[fn]; if (typeof f !== "function") return;
    window[fn] = function () { if (R.active && R.role === "belay") return; return f.apply(this, arguments); };
  });

  /* ---------- the leader's side ---------- */
  var clip0 = window.clipBolt;
  window.clipBolt = function () {
    if (R.active && R.role === "belay") return;
    var before = climber.clipTimer, r = clip0.apply(this, arguments);
    if (R.active && R.role === "lead" && climber.clipTimer > 0 && before === 0) {
      R.slack = false; send("clip");
      setTimeout(function () { if (R.active && !R.slack && climber.clipTimer > 0) { climber.clipTimer += 25; shout("🪢 SHORT-ROPED!"); } }, 1300);
    }
    return r;
  };
  var fall0 = window.startFall;
  window.startFall = function (reason) {
    var was = climber.falling || climber.hanging, r = fall0.apply(this, arguments);
    if (R.active && R.role === "lead" && !was && climber.falling) { R.soft = false; R.fallStart = Date.now(); send("fall", { r: reason }); }
    return r;
  };
  var caught0 = window.onCaught;
  window.onCaught = function () {
    var r = caught0.apply(this, arguments);
    if (R.active && R.role === "lead" && R.peer) {
      /* give the belayer's catch a moment to arrive over the network before judging it */
      var wait = Math.max(0, (R.fallStart || 0) + 1000 - Date.now());
      setTimeout(function () {
        var d = $("catchDetail");
        if (R.soft) { climber.grip = Math.min(climber.maxGrip, climber.grip + 8); if (d) d.innerText += "\n🫶 Soft catch by " + R.peer.n + " (+8% grip)."; }
        else { climber.grip = Math.max(5, climber.grip - 5); if (d) d.innerText += "\n😬 Hard catch — " + R.peer.n + " was a beat late (-5% grip)."; }
      }, wait);
    }
    return r;
  };
  var anchor0 = window.reachAnchor;
  window.reachAnchor = function (pitch, hold) {
    var r = anchor0.apply(this, arguments);
    if (R.active && R.role === "lead" && R.peer) {
      R.led.me++;
      var p = pose(); p.pi = pitch.index; p.n = myName();
      send("anchor", p);
      shout("⚓ ANCHOR! " + R.peer.n.toUpperCase() + " LEADS NEXT");
      setTimeout(function () { if (R.active) { R.lastPose = p; setRole("belay"); } }, 1400);
    }
    return r;
  };
  /* the partner takes over at the anchor: same stance, same holds, fresh arms */
  function takeOver(p) {
    shout("⚓ YOUR LEAD!");
    setTimeout(function () {
      if (!R.active) return;
      setRole("lead");
      var lh = holdMap.get(p.lh), rh = holdMap.get(p.rh);
      if (lh && rh) { setHandOnHold(climber.leftHand, lh); setHandOnHold(climber.rightHand, rh); setBodyTargetFromHands(); climber.x = climber.targetX; climber.y = climber.targetY; }
      else { climber.x = climber.targetX = p.x; climber.y = climber.targetY = p.y; }
      applyBolts(p.k); lastClipY = p.lc; pitchBaseY = p.pb; currentPitchIndex = p.pi; climber.altitude = p.a;
      climber.falling = false; climber.hanging = false; climber.isSlipping = false; climber.moveTimer = 0;
      climber.grip = climber.maxGrip; climber.stillFrames = 0;
      try { updateFootPlacement(); updateHandIndicatorUI(); } catch (e) {}
      toast("🧗 Your lead! " + R.peer.n + " has you on belay.");
    }, 1400);
  }

  /* ---------- the end of the day ---------- */
  var conclude0 = window.concludeClimb, save0 = window.saveAscentRecord, quiet = false;
  window.saveAscentRecord = function () { if (quiet) return; return save0.apply(this, arguments); };
  window.concludeClimb = function (reason) {
    var team = R.active && R.peer, wasLead = R.role === "lead";
    if (team && wasLead) send("end", { reason: reason, a: climber.altitude, s: climber.score, st: climber.style, fl: climber.fallLen, n: myName() });
    var r = conclude0.apply(this, arguments);
    if (team) { teamLine(); ropeLog(R.peer.n); } R.active = false; document.body.classList.remove("rp-on", "rp-belaying"); R.role = null;
    try { charIndex = R.myChar; currentChar = CHARACTERS[R.myChar] || currentChar; } catch (e) {}
    return r;
  };
  function endTogether(p) {
    climber.altitude = p.a; climber.score = p.s; climber.style = p.st || climber.style; climber.fallLen = p.fl || 0;
    quiet = true; try { window.concludeClimb(p.reason === "GROUND" ? "GROUND" : "LOWER"); } finally { quiet = false; }
  }
  function teamLine() {
    var sub = $("gameOverSub"); if (!sub || !R.peer) return;
    var me = myName(), them = R.peer.n, n = R.led.me + R.led.them;
    sub.innerText += "\n🪢 " + me + " & " + them + " · " + n + " pitch" + (n === 1 ? "" : "es") + " swapped · " + me + " led " + (R.led.me + (R.role === "lead" ? 1 : 0)) + ", " + them + " led " + (R.led.them + (R.role === "belay" ? 1 : 0)) + ".";
  }

  /* ---------- belay controls & little shouts ---------- */
  function toast(t) { try { showHoldFeedbackToast(t); } catch (e) {} }
  var shoutT = null;
  function shout(t) { var s = $("rpShout"); if (!s) return; s.textContent = t; s.classList.add("show"); clearTimeout(shoutT); shoutT = setTimeout(function () { s.classList.remove("show"); }, 1600); }

  /* ---------- the rope log: who you've climbed with (no ranking, no scores) ---------- */
  function devKey() { var k = lsGetSafe("fb_device_key"); if (!k) { var a = new Uint8Array(32); crypto.getRandomValues(a); k = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); try { localStorage.setItem("fb_device_key", k); } catch (e) {} } return k; }
  function rpc(fn, body) {
    if (!cfg.url) return Promise.reject(new Error("offline"));
    return fetch(cfg.url + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: cfg.key, Authorization: "Bearer " + cfg.key, "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ p_secret: devKey() }, body || {})) })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); }).then(function (t) { return t ? JSON.parse(t) : null; });
  }
  var logged = {};
  function ropeLog(partner) {
    var crag = ""; try { crag = String(currentCrag.name || "").split(" (")[0]; } catch (e) {}
    var key = partner + "|" + crag + "|" + Math.floor(Date.now() / 60000); if (logged[key]) return; logged[key] = 1;
    rpc("rope_add", { p_partner: String(partner).slice(0, 24), p_crag: crag.slice(0, 40) }).then(function () { setTimeout(function () { toast("🪢 Added to your rope log."); }, 1600); }).catch(function () {});
  }
  var logSheet = null;
  function openLog() {
    if (logSheet) logSheet.remove();
    logSheet = document.createElement("div"); logSheet.className = "rp-sheet"; logSheet.setAttribute("role", "dialog");
    logSheet.innerHTML = '<div class="rp-card"><h3>🪢 ROPE LOG</h3><div style="font-size:14px;color:#94a3b8;margin-bottom:10px">Everyone you have finished a climb with, tied in on the same rope. No ranking, just the people.</div><div id="rlList" style="max-height:46vh;overflow:auto;display:grid;gap:8px"><div style="color:#94a3b8">…</div></div><div style="font-size:12px;color:#64748b;margin:10px 0">Only you can see your rope log.</div><div class="rp-row" style="display:flex;gap:8px"><button type="button" data-a="clear" class="rp-btn" style="flex:1;color:#fca5a5;border-color:#f87171">CLEAR MY LOG</button><button type="button" data-a="close" class="rp-btn" style="flex:1">CLOSE</button></div></div>';
    document.body.appendChild(logSheet);
    logSheet.addEventListener("click", function (e) {
      if (e.target === logSheet) { logSheet.remove(); logSheet = null; return; }
      var a = e.target.closest && e.target.closest("[data-a]"); a = a && a.getAttribute("data-a");
      if (a === "close") { logSheet.remove(); logSheet = null; }
      if (a === "clear") { var b = e.target.closest("button"); if (b.getAttribute("data-sure")) rpc("rope_clear").then(fill).catch(fail); else { b.setAttribute("data-sure", "1"); b.textContent = "TAP AGAIN TO CLEAR"; } }
    });
    function fail() { var L = $("rlList"); if (L) L.innerHTML = '<div style="color:#fca5a5">The rope log can\'t be reached right now.</div>'; }
    function fill() {
      rpc("rope_list").then(function (rows) {
        var L = $("rlList"); if (!L) return; rows = rows || [];
        if (!rows.length) { L.innerHTML = '<div style="color:#94a3b8">No rope partners yet. Tap CLIMB WITH A FRIEND to tie in with someone.</div>'; return; }
        var by = {}, order = [];   /* grouped by partner, most recent first: never sorted by how many */
        rows.forEach(function (r) { var k = r.partner.toLowerCase(); if (!by[k]) { by[k] = { n: r.partner, list: [] }; order.push(k); } by[k].list.push(r); });
        L.innerHTML = "";
        order.forEach(function (k) {
          var g = by[k], d = document.createElement("div"); d.style.cssText = "padding:8px 10px;background:#111a2e;border-left:3px solid #22d3ee";
          var nm = document.createElement("b"); nm.style.color = "#fde68a"; nm.textContent = "🧗 " + g.n; d.appendChild(nm);
          var ul = document.createElement("div"); ul.style.cssText = "font-size:13px;color:#cbd5e1;margin-top:3px";
          ul.textContent = g.list.slice(0, 4).map(function (r) { return (r.crag ? r.crag + " · " : "") + new Date(r.at).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }); }).join("  ·  ") + (g.list.length > 4 ? "  …" : "");
          d.appendChild(ul); L.appendChild(d);
        });
      }).catch(fail);
    }
    fill();
  }
  function logButton(id) {
    var old = $(id); if (!old) return; var b = old.cloneNode(false); b.hidden = false; b.removeAttribute("hidden");
    b.innerHTML = "🪢 ROPE LOG"; old.parentNode.replaceChild(b, old); b.onclick = function () { try { sound.playGrabStone(); } catch (e) {} openLog(); };
  }
  function mount() {
    var wrap = $("canvasWrapper"); if (!wrap) return;
    var tag = document.createElement("div"); tag.id = "rpTag"; wrap.appendChild(tag);
    var sh = document.createElement("div"); sh.id = "rpShout"; sh.setAttribute("aria-live", "polite"); wrap.appendChild(sh);
    var bar = document.createElement("div"); bar.id = "rpBelay";
    bar.innerHTML = '<button id="rpSlack" type="button"><span>🪢</span><span>FEED SLACK</span></button><button id="rpCatch" type="button"><span>✊</span><span>CATCH!</span></button><button id="rpCheer" type="button"><span>💪</span><span>ALLEZ!</span></button>';
    var foot = $("inGameFooterBar"); if (foot && foot.parentNode) foot.parentNode.insertBefore(bar, foot.nextSibling);
    $("rpSlack").onclick = function () { if (!R.active || R.role !== "belay") return; send("slack"); hot("rpSlack", false); shout("🪢 SLACK OUT"); try { sound.playGrabStone(); } catch (e) {} };
    $("rpCatch").onclick = function () { if (!R.active || R.role !== "belay") return; var soft = R.fallAt && Date.now() - R.fallAt < 900; send("catch", { soft: soft }); hot("rpCatch", false); shout(soft ? "🫶 SOFT CATCH" : "😬 LATE CATCH"); try { sound.playCatchSave(); } catch (e) {} };
    $("rpCheer").onclick = function () { if (!R.active || R.role !== "belay") return; var now = Date.now(); if (now - R.cheerAt < 15000) return; R.cheerAt = now; send("cheer"); shout("💪 ALLEZ!"); var b = this; b.disabled = true; setTimeout(function () { b.disabled = false; }, 15000); };
    /* the button on the title screen */
    var lb = $("showLeaderboardBtn");
    if (lb && lb.parentNode) { var b = document.createElement("button"); b.id = "rpBtn"; b.type = "button"; b.className = "rp-btn"; b.innerHTML = '<span aria-hidden="true">👥</span><span></span>'; b.setAttribute("data-fbt-skip", ""); lb.parentNode.insertBefore(b, lb); b.onclick = function () { try { sound.init(); } catch (e) {} openSheet(); }; }
    logButton("showLeaderboardBtn"); logButton("gameOverLbBtn");
    startDuo(); paintBtn();   /* an invite link (?with= or the old ?rope=) sits you down and shows the card */
    addEventListener("fbl:lang", paintBtn);
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", mount); else mount();
  window.FBRope = R;
})();
