/* Nearby · with a friend
   The one "with a friend" card for every place you can do alone or together: Sandy Cove, Snow Peaks, Mirror Lake,
   Pine Wood, Wildflower Meadow, Hold On, Late Light, Next Door. Same 👥 card everywhere: a four-letter code,
   "Send the link", "or type their code", who is here, "Go alone". Same link: ?with=CODE. Same quiet notes when a friend
   sits down or leaves. You meet on a Supabase Realtime broadcast channel (relay first, then direct, see FBWorld.rtUrl);
   nothing is stored: what you send goes live to your friend only.

   var duo = FBDuo({
     topic: "fbcove",                        // channel prefix, must be allowed by the realtime.messages policy
     name: function () { return "Mia"; },    // optional: your name for your friend ("Mia is here"); default: fb_nick
     legacy: "rope",                         // optional: an older link parameter that still works (?rope=CODE)
     start: { go: [5 langs], wait: [5 langs] }, // optional: a step the host starts ("Tie in & climb"); the guest waits
     onStart: function () {},                // the host pressed it
     onMsg: function (ev, p) {}, onPeer: function (here, name) {}, onState: function ({code, peer}) {}
   });
   duo.send(ev, p)  duo.open()  duo.peer()  duo.peerName()  duo.host()  duo.code()  duo.leave()  duo.ensure(code?)  duo.link()  duo.repaint() */
(function () {
  "use strict";
  var W = {
    title: ["With a friend", "和朋友一起", "和朋友一起", "Con un amigo", "Amb un amic"],
    send: ["Send the link", "发送链接", "傳送連結", "Envía el enlace", "Envia l'enllaç"],
    copied: ["Link copied", "链接已复制", "連結已複製", "Enlace copiado", "Enllaç copiat"],
    orJoin: ["or type their code", "或者输入对方的代码", "或者輸入對方的代碼", "o escribe su código", "o escriu el seu codi"],
    join: ["Join", "加入", "加入", "Unirse", "Unir-se"],
    wait: ["Waiting for your friend…", "等朋友来……", "等朋友來……", "Esperando a tu amigo…", "Esperant el teu amic…"],
    joining: ["Joining your friend…", "正在找你的朋友……", "正在找你的朋友……", "Uniéndote a tu amigo…", "Unint-te al teu amic…"],
    here: ["Your friend is here", "朋友来了", "朋友來了", "Tu amigo está aquí", "El teu amic és aquí"],
    hereN: ["{n} is here", "{n} 来了", "{n} 來了", "{n} está aquí", "{n} és aquí"],
    left: ["Your friend left", "朋友走了", "朋友走了", "Tu amigo se ha ido", "El teu amic se n'ha anat"],
    leftN: ["{n} left", "{n} 走了", "{n} 走了", "{n} se ha ido", "{n} se n'ha anat"],
    alone: ["Go alone", "一个人去", "一個人去", "Ir solo", "Anar sol"],
    close: ["Close", "关闭", "關閉", "Cerrar", "Tancar"],
    theyStart: ["Your friend starts", "朋友来开始", "朋友來開始", "Empieza tu amigo", "Comença el teu amic"],
    friend: ["Your friend", "朋友", "朋友", "Tu amigo", "El teu amic"],
    lost: ["Reconnecting…", "重新连接中……", "重新連線中……", "Reconectando…", "Tornant a connectar…"]
  };
  function li() { return ({ en: 0, zh: 1, "zh-Hant": 2, es: 3, ca: 4 })[(window.FBL && FBL.get && FBL.get()) || "en"] || 0; }
  function tx(a) { return a[li()] || a[0]; }
  function t(k) { return tx(W[k]); }
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
    ".fbduo-c{position:relative;width:min(340px,100%);padding:18px 18px 14px;background:#2a1d14;color:#fbeedd;border:3px solid #000;box-shadow:6px 6px 0 #000,inset 0 0 0 2px #5a3a22;text-align:center;font:400 20px/1.2 'VT323',ui-monospace,monospace}" +
    ".fbduo-c h2{margin:0 0 10px;font:400 12px/1.4 'Press Start 2P',monospace;color:#ffd166}.fbduo-x{position:absolute;top:6px;right:6px;width:40px;min-width:40px;min-height:40px;height:40px;font-size:20px}" +
    ".fbduo-code{font:400 26px/1 'Press Start 2P',monospace;letter-spacing:.25em;color:#8ee6d4;margin:6px 0 14px}" +
    ".fbduo button.b{min-height:44px;padding:0 14px;font-size:20px}.fbduo button.go{display:flex;width:100%;margin-top:4px}" +
        ".fbduo-or{margin:14px 0 6px;color:#9aa6c2}.fbduo-row{display:flex;gap:8px;justify-content:center}.fbduo-row input{width:120px;min-height:44px;box-shadow:inset 3px 3px 0 rgba(0,0,0,.5);text-align:center;font:400 20px/1 'Press Start 2P',monospace;letter-spacing:.2em;text-transform:uppercase;background:#0e1320;color:#fff;border:3px solid #000}" +
    ".fbduo-st{min-height:1.3em;margin:12px 0 8px;color:#a7f3d0}.fbduo-alone{margin-top:8px}" +
    ".fbduo-toast{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:95;padding:7px 12px;background:rgba(42,29,20,.96);color:#fbeedd;border:3px solid #000;box-shadow:3px 3px 0 #000;font:400 19px/1.1 'VT323',ui-monospace,monospace;pointer-events:none;transition:opacity .6s}";
  var styled = false;
  window.FBDuo = function (o) {
    var D = { code: "", host: false, tx: null, peerSeen: 0, peerName: "", me: Math.random().toString(36).slice(2, 9), net: "" }, sheet = null, beat = null;
    if (!styled) { styled = true; var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); }
    function myName() { try { return String((o.name ? o.name() : localStorage.getItem("fb_nick")) || "").slice(0, 24); } catch (e) { return ""; } }   /* the name you gave anywhere in town, if any */
    function peer() { return Date.now() - D.peerSeen < 12000; }
    function newCode() { var A = "BCDFGHJKLMNPQRSTVWXZ", s = ""; for (var i = 0; i < 4; i++) s += A[(Math.random() * A.length) | 0]; return s; }
    function clean(c) { return String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4); }
    function link() { var u = new URL(location.href); u.search = "?with=" + D.code; u.hash = ""; return u.toString(); }
    function note(k, n) {   /* the town's quiet note when the page has it, a small one of our own otherwise */
      var m = n ? t(k + "N").replace("{n}", n) : t(k);
      if (o.onNote) return o.onNote(m);
      if (window.FBG && FBG.note) return FBG.note({ icon: "👥", text: m, ms: 4200 });
      var d = document.createElement("div"); d.className = "fbduo-toast"; d.setAttribute("role", "status"); d.textContent = "👥 " + m; document.body.appendChild(d);
      setTimeout(function () { d.style.opacity = "0"; setTimeout(function () { d.remove(); }, 700); }, 3600);
    }
    function onMsg(ev, p) {
      if (ev === "_ready") { send("hi", { n: myName() }); return; }
      if (!p || p.by === D.me) return;
      var was = peer(); D.peerSeen = Date.now();
      if ((ev === "hi" || ev === "nm") && p.n) D.peerName = String(p.n).slice(0, 24);
      if (ev === "bye") { D.peerSeen = 0; paint(); if (o.onPeer) o.onPeer(false, D.peerName); note("left", D.peerName); return; }
      if (!was) { if (ev === "hi") send("hi", { n: myName() }); paint(); if (o.onPeer) o.onPeer(true, D.peerName); note("here", D.peerName); if (sheet && !o.start) setTimeout(close, 900); }
      else if (ev === "hi" || ev === "nm") paint();
      if (ev !== "hi" && ev !== "beat" && ev !== "nm" && o.onMsg) o.onMsg(ev, p);
    }
    function send(ev, p) { if (D.tx) { p = p || {}; p.by = D.me; D.tx.send(ev, p); } }
    function join(code, host) {
      if (D.tx) { send("bye", {}); D.tx.close(); D.tx = null; }
      if (peer() && o.onPeer) o.onPeer(false, D.peerName);
      D.code = code; D.host = host; D.peerSeen = 0; D.peerName = ""; D.net = "connecting";
      cfgP.then(function () { if (D.code !== code) return; D.tx = transport(o.topic + "-" + code, onMsg, function (s) { D.net = s; paint(); }, window.FB_SUPABASE || {}); });
      clearInterval(beat); beat = setInterval(function () { send("beat", {}); if (!peer() && D.peerSeen) { D.peerSeen = 0; if (o.onPeer) o.onPeer(false, D.peerName); note("left", D.peerName); paint(); } }, 4000);
      try { history.replaceState(null, "", "?with=" + code + location.hash); } catch (e) {}
      paint();
    }
    function leave() { send("bye", {}); if (D.tx) D.tx.close(); D.tx = null; D.code = ""; var was = peer(); D.peerSeen = 0; clearInterval(beat); try { history.replaceState(null, "", location.pathname + location.hash); } catch (e) {} if (was && o.onPeer) o.onPeer(false, D.peerName); paint(); }
    function close() { if (sheet) { sheet.remove(); sheet = null; } }
    function open() {
      if (!D.code) join(newCode(), true);
      close(); sheet = document.createElement("div"); sheet.className = "fbduo"; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("data-fbt-skip", "");
      sheet.innerHTML = '<div class="fbduo-c"><button type="button" class="fbduo-x fbb fbb-icon">✕</button><h2></h2><div class="fbduo-code"></div>' +
        '<button type="button" class="b fbb fbb-pri fbduo-send"></button><div class="fbduo-or"></div><div class="fbduo-row"><input maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Code"><button type="button" class="b fbb fbduo-join"></button></div>' +
        '<p class="fbduo-st" aria-live="polite"></p><button type="button" class="b go fbb fbb-pri fbduo-go" hidden></button><button type="button" class="b fbb fbduo-alone" hidden></button></div>';
      document.body.appendChild(sheet);
      sheet.querySelector("h2").textContent = "👥 " + t("title");
      sheet.querySelector(".fbduo-x").setAttribute("aria-label", t("close"));
      sheet.querySelector(".fbduo-send").textContent = "↗ " + t("send"); sheet.querySelector(".fbduo-or").textContent = t("orJoin"); sheet.querySelector(".fbduo-join").textContent = t("join"); sheet.querySelector(".fbduo-alone").textContent = t("alone");
      sheet.querySelector(".fbduo-x").onclick = close; sheet.onclick = function (e) { if (e.target === sheet) close(); };
      var inp = sheet.querySelector("input"); inp.oninput = function () { inp.value = clean(inp.value); };
      var doJoin = function () { if (inp.value.length === 4 && inp.value !== D.code) join(inp.value, false); else { inp.focus(); inp.animate && inp.animate([{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 240 }); } };
      sheet.querySelector(".fbduo-join").onclick = doJoin; inp.onkeydown = function (e) { if (e.key === "Enter") doJoin(); };
      sheet.querySelector(".fbduo-send").onclick = function () { var u = link(), b = this, why = o.invite || (window.FBG && FBG.invite ? FBG.invite() : ""); if (navigator.share) navigator.share({ title: document.title, text: why, url: u }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText((why ? why + " " : "") + u).then(function () { b.textContent = "✓ " + t("copied"); }); };
      sheet.querySelector(".fbduo-go").onclick = function () { if (D.host && peer() && o.onStart) { close(); o.onStart(); } };
      sheet.querySelector(".fbduo-alone").onclick = function () { leave(); close(); };
      paint();
    }
    function paint() {
      if (o.onState) o.onState({ code: D.code, peer: peer(), name: D.peerName });
      if (!sheet) return;
      var here = peer();
      sheet.querySelector(".fbduo-code").textContent = D.code;
      sheet.querySelector(".fbduo-st").textContent = here ? "● " + (D.peerName ? t("hereN").replace("{n}", D.peerName) : t("here")) : D.net === "bad" ? t("lost") : D.host ? t("wait") : t("joining");
      var g = sheet.querySelector(".fbduo-go");
      g.hidden = !o.start || !here;
      if (o.start) { g.disabled = !D.host; g.textContent = D.host ? tx(o.start.go) : "⏳ " + (o.start.wait ? tx(o.start.wait).replace("{n}", D.peerName || t("friend")) : t("theyStart")); }
      sheet.querySelector(".fbduo-alone").hidden = !D.code;
    }
    addEventListener("pagehide", function () { send("bye", {}); });
    addEventListener("fbl:lang", function () { if (sheet) { close(); open(); } });
    var qs = new URLSearchParams(location.search), inv = clean(qs.get("with") || (o.legacy && qs.get(o.legacy)) || "");
    if (inv.length === 4) { join(inv, false); if (o.start) setTimeout(open, 300); else note("joining"); }
    function ensure(code) { code = clean(code); if (code.length === 4) { if (code !== D.code) join(code, false); } else if (!D.code) join(newCode(), true); return D.code; }
    return { send: send, open: open, close: close, peer: peer, peerName: function () { return D.peerName; }, leave: leave, ensure: ensure, link: link, repaint: paint, rename: function () { send("nm", { n: myName() }); },
      host: function () { return D.host; }, code: function () { return D.code; } };
  };
})();
