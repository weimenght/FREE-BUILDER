/* Nearby · with a friend
   One small "invite a friend" sheet for the places you can do alone or together (Sandy Cove, Snow Peaks).
   A four-letter code and a link; the two of you meet on a Supabase Realtime broadcast channel (through the
   relay or directly, see FBWorld.rtUrl). Nothing is stored: what you send goes live to your friend only.

   var duo = FBDuo({ topic: "fbcove", onMsg: function (ev, p) {}, onPeer: function (here) {} });
   duo.send("pos", {...});  duo.open();  duo.peer();  */
(function () {
  "use strict";
  var W = {
    title: ["With a friend", "和朋友一起", "和朋友一起", "Con un amigo", "Amb un amic"],
    send: ["Send the link", "发送链接", "傳送連結", "Envía el enlace", "Envia l'enllaç"],
    copied: ["Link copied", "链接已复制", "連結已複製", "Enlace copiado", "Enllaç copiat"],
    orJoin: ["or type their code", "或者输入对方的代码", "或者輸入對方的代碼", "o escribe su código", "o escriu el seu codi"],
    join: ["Join", "加入", "加入", "Unirse", "Unir-se"],
    wait: ["Waiting for your friend…", "等朋友来……", "等朋友來……", "Esperando a tu amigo…", "Esperant el teu amic…"],
    here: ["Your friend is here", "朋友来了", "朋友來了", "Tu amigo está aquí", "El teu amic és aquí"],
    left: ["Your friend left", "朋友走了", "朋友走了", "Tu amigo se ha ido", "El teu amic se n'ha anat"],
    alone: ["Go alone", "一个人去", "一個人去", "Ir solo", "Anar sol"],
    lost: ["Reconnecting…", "重新连接中……", "重新連線中……", "Reconectando…", "Tornant a connectar…"]
  };
  function li() { return ({ en: 0, zh: 1, "zh-Hant": 2, es: 3, ca: 4 })[(window.FBL && FBL.get && FBL.get()) || "en"] || 0; }
  function t(k) { return W[k][li()] || W[k][0]; }
  var cfgP = new Promise(function (res) {
    if (window.FB_SUPABASE && FB_SUPABASE.url) return res(FB_SUPABASE);
    var sc = document.createElement("script"); sc.src = "/config.js"; sc.onload = sc.onerror = function () { res(window.FB_SUPABASE || {}); }; document.head.appendChild(sc);
  });
  function transport(topicName, onMsg, onStatus, cfg) {
    var topic = "realtime:" + topicName;
    if (!cfg.url) {   /* no keys (offline preview): tabs on this device find each other */
      var bc = null; try { bc = new BroadcastChannel("fb_" + topicName); bc.onmessage = function (e) { onMsg(e.data.event, e.data.payload); }; } catch (e) {}
      setTimeout(function () { onStatus("ok"); onMsg("_ready", {}); }, 0);
      return { send: function (ev, p) { try { bc && bc.postMessage({ event: ev, payload: p }); } catch (e) {} }, close: function () { try { bc && bc.close(); } catch (e) {} } };
    }
    var ws = null, ref = 0, hb = null, closed = false, tries = 0, att = 0, joined = false, url = "";
    var raw = function (m) { try { ws && ws.readyState === 1 && ws.send(JSON.stringify(m)); } catch (e) {} };
    var c = { url: cfg.url, key: cfg.anonKey, rt: cfg.realtimeUrl };
    function connect() {
      onStatus("connecting");
      url = FBWorld.rtUrl(c, att++);
      try { ws = new WebSocket(url); } catch (e) { return retry(); }
      ws.onopen = function () { tries = 0; raw({ topic: topic, event: "phx_join", ref: String(++ref), payload: { config: { broadcast: { self: false, ack: false }, presence: { key: "" }, private: FBWorld.rtPriv() }, access_token: c.key } }); clearInterval(hb); hb = setInterval(function () { raw({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++ref) }); }, 25000); };
      ws.onmessage = function (e) {
        var m; try { m = JSON.parse(e.data); } catch (_) { return; }
        if (m.event === "phx_reply" && m.topic === topic && m.payload && m.payload.status === "ok" && !joined) { joined = true; FBWorld.rtGood(url); onStatus("ok"); onMsg("_ready", {}); }
        else if (m.event === "phx_reply" && m.topic === topic && m.payload && m.payload.status === "error" && !joined) { FBWorld.rtPriv(true); att--; try { ws.close(); } catch (_) {} }
        else if (m.event === "broadcast" && m.payload) onMsg(m.payload.event, m.payload.payload);
      };
      ws.onclose = function () { joined = false; clearInterval(hb); if (!closed) retry(); };
      ws.onerror = function () { try { ws.close(); } catch (_) {} };
    }
    function retry() { onStatus("bad"); setTimeout(function () { if (!closed) connect(); }, Math.min(15000, 800 * Math.pow(2, tries++))); }
    connect();
    return { send: function (ev, p) { if (joined) raw({ topic: topic, event: "broadcast", ref: String(++ref), payload: { type: "broadcast", event: ev, payload: p } }); }, close: function () { closed = true; clearInterval(hb); try { ws && ws.close(); } catch (e) {} } };
  }
  var css = ".fbduo{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:16px;background:rgba(6,8,16,.72)}" +
    ".fbduo-c{position:relative;width:min(340px,100%);padding:18px 18px 14px;background:#1d2433;color:#eef2ff;border:3px solid #000;box-shadow:5px 5px 0 #000;text-align:center;font:400 20px/1.2 'VT323',ui-monospace,monospace}" +
    ".fbduo-c h2{margin:0 0 10px;font:400 12px/1.4 'Press Start 2P',monospace;color:#ffd166}.fbduo-x{position:absolute;top:6px;right:8px;background:none;border:0;color:#eef2ff;font-size:20px;cursor:pointer}" +
    ".fbduo-code{font:400 26px/1 'Press Start 2P',monospace;letter-spacing:.25em;color:#8ee6d4;margin:6px 0 14px}" +
    ".fbduo button.b{min-height:44px;padding:0 14px;border:3px solid #000;background:#ffd166;color:#1d130d;font:400 11px/1 'Press Start 2P',monospace;cursor:pointer;box-shadow:3px 3px 0 #000}.fbduo button.b2{background:#3a4560;color:#eef2ff}" +
    ".fbduo-or{margin:14px 0 6px;color:#9aa6c2}.fbduo-row{display:flex;gap:8px;justify-content:center}.fbduo-row input{width:120px;min-height:44px;text-align:center;font:400 20px/1 'Press Start 2P',monospace;letter-spacing:.2em;text-transform:uppercase;background:#0e1320;color:#fff;border:3px solid #000}" +
    ".fbduo-st{min-height:1.3em;margin:12px 0 4px;color:#a7f3d0}";
  window.FBDuo = function (o) {
    var D = { code: "", host: false, tx: null, peerSeen: 0, me: Math.random().toString(36).slice(2, 9), net: "" }, sheet = null, beat = null;
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    function peer() { return Date.now() - D.peerSeen < 12000; }
    function newCode() { var A = "BCDFGHJKLMNPQRSTVWXZ", s = ""; for (var i = 0; i < 4; i++) s += A[(Math.random() * A.length) | 0]; return s; }
    function link() { var u = new URL(location.href); u.search = "?with=" + D.code; u.hash = ""; return u.toString(); }
    function onMsg(ev, p) {
      if (ev === "_ready") { send("hi", {}); return; }
      if (!p || p.by === D.me) return;
      var was = peer(); D.peerSeen = Date.now();
      if (ev === "bye") { D.peerSeen = 0; paint(); if (o.onPeer) o.onPeer(false); note(t("left")); return; }
      if (!was) { paint(); if (o.onPeer) o.onPeer(true); if (ev === "hi") send("hi", {}); note(t("here")); if (D.host && sheet) setTimeout(close, 900); }
      if (ev !== "hi" && ev !== "beat" && o.onMsg) o.onMsg(ev, p);
    }
    function send(ev, p) { if (D.tx) { p = p || {}; p.by = D.me; D.tx.send(ev, p); } }
    function join(code, host) {
      if (D.tx) { send("bye", {}); D.tx.close(); }
      D.code = code; D.host = host; D.peerSeen = 0;
      cfgP.then(function (cfg) { D.tx = transport(o.topic + "-" + code, onMsg, function (s) { D.net = s; paint(); }, cfg); });
      clearInterval(beat); beat = setInterval(function () { send("beat", {}); if (!peer() && D.peerSeen && o.onPeer) { D.peerSeen = 0; o.onPeer(false); paint(); } }, 4000);
      try { history.replaceState(null, "", "?with=" + code); } catch (e) {}
      paint();
    }
    function leave() { send("bye", {}); if (D.tx) D.tx.close(); D.tx = null; D.code = ""; D.peerSeen = 0; clearInterval(beat); try { history.replaceState(null, "", location.pathname); } catch (e) {} if (o.onPeer) o.onPeer(false); paint(); }
    function note(m) { if (o.onNote) o.onNote(m); }
    function close() { if (sheet) { sheet.remove(); sheet = null; } }
    function open() {
      if (!D.code) join(newCode(), true);
      close(); sheet = document.createElement("div"); sheet.className = "fbduo"; sheet.setAttribute("role", "dialog");
      sheet.innerHTML = '<div class="fbduo-c"><button type="button" class="fbduo-x" aria-label="✕">✕</button><h2></h2><div class="fbduo-code"></div>' +
        '<button type="button" class="b fbduo-send"></button><div class="fbduo-or"></div><div class="fbduo-row"><input maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Code"><button type="button" class="b b2 fbduo-join"></button></div>' +
        '<p class="fbduo-st"></p><button type="button" class="b b2 fbduo-alone" hidden></button></div>';
      document.body.appendChild(sheet);
      sheet.querySelector("h2").textContent = "👥 " + t("title");
      sheet.querySelector(".fbduo-send").textContent = "↗ " + t("send"); sheet.querySelector(".fbduo-or").textContent = t("orJoin"); sheet.querySelector(".fbduo-join").textContent = t("join"); sheet.querySelector(".fbduo-alone").textContent = t("alone");
      sheet.querySelector(".fbduo-x").onclick = close; sheet.onclick = function (e) { if (e.target === sheet) close(); };
      var inp = sheet.querySelector("input"); inp.oninput = function () { inp.value = inp.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4); };
      sheet.querySelector(".fbduo-join").onclick = function () { if (inp.value.length === 4 && inp.value !== D.code) { join(inp.value, false); } };
      sheet.querySelector(".fbduo-send").onclick = function () { var u = link(), b = this; if (navigator.share) navigator.share({ title: document.title, url: u }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { b.textContent = "✓ " + t("copied"); }); };
      sheet.querySelector(".fbduo-alone").onclick = function () { leave(); close(); };
      paint();
    }
    function paint() {
      if (o.onState) o.onState({ code: D.code, peer: peer() });
      if (!sheet) return;
      sheet.querySelector(".fbduo-code").textContent = D.code;
      sheet.querySelector(".fbduo-st").textContent = peer() ? "● " + t("here") : D.net === "bad" ? t("lost") : t("wait");
      sheet.querySelector(".fbduo-alone").hidden = !D.code;
    }
    addEventListener("pagehide", function () { send("bye", {}); });
    var inv = (new URLSearchParams(location.search).get("with") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    if (inv.length === 4) join(inv, false);
    return { send: send, open: open, peer: peer, leave: leave, host: function () { return D.host; }, code: function () { return D.code; } };
  };
})();
