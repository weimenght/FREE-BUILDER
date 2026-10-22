/* MEMEX-68 · the tape deck
   The friendly face of the game repertory: every game is a cassette on a shelf.
   Tap a tape and it drops into the deck; press the big button and you're in. ⌨️ opens the old terminal underneath.
   Reads the live list (GAME_CATALOG, refreshed from game.txt by the terminal) so new games appear by themselves. */
(function () {
  "use strict";
  var CABINET = new URLSearchParams(location.search).has("cabinet");
  var ART = {   /* code -> [picture, label colour, stripe colour] */
    SORA: ["☁️", "#bfe3ff", "#5aa9e6"], TRAIN: ["🚆", "#ffe0a3", "#d9822b"], JUKEBOX: ["🎶", "#ffc6d9", "#e2557a"],
    BAR: ["🍸", "#f7d6a8", "#8a4b2a"], BOOKS: ["📚", "#e6dcc3", "#6b8f5e"], KINTSUGI: ["🏺", "#f3e3b5", "#c6922c"],
    HANDOFF: ["💌", "#ffd1c4", "#d9534f"], DJ: ["🎧", "#d6c8ff", "#6b4fd8"], CLIMB: ["🧗", "#c9f0d4", "#2f8f5b"]
  };
  var FALL = [["📼", "#e8e2d0", "#7a7a7a"], ["🕹️", "#d9f2ff", "#3a7bd5"], ["🎲", "#ffe7c2", "#e08a2b"], ["✨", "#efe0ff", "#8a5cd6"]];
  function art(g, i) { return ART[g.code] || FALL[i % FALL.length]; }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function snd(f) { try { if (window.sound && sound[f]) sound[f](); else if (typeof sound !== "undefined" && sound[f]) sound[f](); } catch (e) {} }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function cat() { try { return GAME_CATALOG; } catch (e) { return []; } }

  var PX = "'Press Start 2P','Pixelify Sans',ui-monospace,monospace", VT = "'VT323','Pixelify Sans',ui-monospace,'PingFang SC','Microsoft YaHei',monospace";
  var NOTCH = "polygon(0 6px,6px 6px,6px 0,calc(100% - 6px) 0,calc(100% - 6px) 6px,100% 6px,100% calc(100% - 6px),calc(100% - 6px) calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,6px calc(100% - 6px),0 calc(100% - 6px))";
  var css = "" +
    "#deck{position:fixed;inset:0;z-index:50;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#14110c;background-image:repeating-conic-gradient(rgba(255,255,255,.025) 0 25%,transparent 0 50%);background-size:4px 4px;color:#f3ead6;font:400 20px/1.1 " + VT + ";padding:max(10px,env(safe-area-inset-top)) 14px calc(28px + env(safe-area-inset-bottom));image-rendering:pixelated}" +
    "#deck[hidden]{display:none}.mx-wrap{max-width:980px;margin:0 auto}" +
    ".mx-top{display:flex;align-items:center;gap:8px;margin:2px 0 14px}" +
    ".mx-brand{white-space:nowrap;font:400 clamp(13px,4vw,18px)/1 " + PX + ";color:#7dff9a;text-shadow:3px 3px 0 #0a3a14}.mx-led{width:10px;height:10px;background:#ff5a4a;box-shadow:0 0 0 2px #000;animation:mxBlink 1.2s steps(2) infinite}" +
    "@keyframes mxBlink{50%{background:#5a1a14}}.mx-sp{flex:1}" +
    ".mx-btn{min-width:44px;height:44px;padding:0 10px;border:3px solid #000;background:#3a3428;color:inherit;font:400 18px/1 " + VT + ";cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;box-shadow:inset -3px -3px 0 rgba(0,0,0,.45),inset 3px 3px 0 rgba(255,255,255,.12),3px 3px 0 #000}.mx-btn:active{transform:translate(2px,2px);box-shadow:inset 3px 3px 0 rgba(0,0,0,.5),1px 1px 0 #000}" +
    /* the machine: a beige 1970s case with notched corners */
    ".mx-machine{position:relative;padding:14px;background:#cfc3a3;color:#3a3324;clip-path:" + NOTCH + ";box-shadow:inset -6px -6px 0 #9c9076,inset 6px 6px 0 #ece3cc}" +
    ".mx-machine:before{content:'MEMEX-68';position:absolute;top:8px;right:18px;font:400 8px/1 " + PX + ";letter-spacing:.1em;color:rgba(58,51,36,.6)}" +
    ".mx-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:stretch}" +
    ".mx-crt{position:relative;min-height:150px;background:#062a10;border:6px solid #2a271f;box-shadow:inset 0 0 0 3px #000;padding:14px 16px;overflow:hidden;color:#8dffa6;font:400 21px/1.05 " + VT + ";text-shadow:2px 0 0 rgba(141,255,166,.35)}" +
    ".mx-crt:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.3) 0 2px,transparent 2px 4px);pointer-events:none}" +
    ".mx-crt b{display:block;font:400 clamp(13px,3.6vw,17px)/1.3 " + PX + ";color:#c9ffd4}.mx-crt i{display:block;font-style:normal;color:#5fd97a;font-size:18px;margin-top:6px}.mx-crt p{margin:8px 0 0;font-size:20px;color:#a8ffbb;max-height:5.3em;overflow:hidden}" +
    ".mx-idle{display:grid;place-items:center;height:100%;min-height:118px;font:400 20px/1 " + PX + ";letter-spacing:.4em;animation:mxBob 1s steps(2) infinite}@keyframes mxBob{50%{transform:translateY(6px)}}" +
    ".mx-load{height:12px;margin-top:10px;border:2px solid #5fd97a;padding:2px}.mx-load span{display:block;height:100%;width:0;background:repeating-linear-gradient(90deg,#8dffa6 0 6px,transparent 6px 8px)}" +
    ".mx-side{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:10px;min-width:120px}" +
    ".mx-slot{position:relative;width:120px;height:72px;background:#2a271f;border:4px solid #000;box-shadow:inset 0 4px 0 #000;display:grid;place-items:center;overflow:hidden}" +
    ".mx-slot .reels{display:flex;gap:14px}.mx-slot .reel{width:24px;height:24px;background:#ddd;border:3px solid #555;position:relative}.mx-slot .reel:after{content:'';position:absolute;inset:6px;background:#2a271f}" +
    ".mx-machine.loaded .reel{animation:mxSpin .8s steps(4) infinite}.mx-machine.go .reel{animation-duration:.2s}@keyframes mxSpin{to{transform:rotate(360deg)}}" +
    ".mx-play{width:92px;height:92px;border:4px solid #000;cursor:pointer;background:#e8452c;color:#fff;font:400 26px/1 " + PX + ";box-shadow:inset -6px -6px 0 #9c2414,inset 6px 6px 0 #ff9a84,0 6px 0 #000;padding:0}" +
    ".mx-play:active{transform:translateY(5px);box-shadow:inset 6px 6px 0 #9c2414,0 1px 0 #000}.mx-play:disabled{filter:grayscale(.85) brightness(.8);cursor:default}" +
    ".mx-machine.loaded .mx-play{animation:mxPulse 1s steps(2) infinite}@keyframes mxPulse{50%{background:#ff6a4a}}" +
    /* the shelf */
    ".mx-shelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:18px 14px;margin-top:22px;padding:18px 12px 22px;background:#5a3a22;border:4px solid #000;box-shadow:inset 0 -10px 0 #3a2414,inset 0 4px 0 #7a5232,6px 6px 0 #000}" +
    ".mx-tape{position:relative;aspect-ratio:1.55;border:3px solid #000;padding:0;cursor:pointer;background:#2b2b2e;box-shadow:inset -4px -4px 0 #18181a,inset 4px 4px 0 #444448,4px 4px 0 #000;color:#2a2418;text-align:left;font:inherit;transition:transform .15s steps(3),opacity .2s steps(2);clip-path:" + NOTCH.replace(/6px/g, "4px") + "}" +
    ".mx-tape:hover{transform:translateY(-4px)}.mx-tape:active{transform:translate(2px,2px)}.mx-tape.in{opacity:.25;transform:translateY(-8px)}" +
    ".mx-tape .lab{position:absolute;left:8%;right:8%;top:10%;height:56%;background:var(--l);overflow:hidden;padding:6px 8px 0 40px;border:2px solid rgba(0,0,0,.35)}" +
    ".mx-tape .lab:before{content:'';position:absolute;left:0;right:0;bottom:0;height:22%;background:var(--s)}" +
    ".mx-tape .pic{position:absolute;left:6px;top:6px;font-size:24px;line-height:1}" +
    ".mx-tape .t{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font:400 9px/1.45 " + PX + ";text-transform:uppercase;overflow:hidden}" +
    ".mx-tape .g{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;font:400 15px/1 " + VT + ";opacity:.8;overflow:hidden;margin-top:2px}" +
    ".mx-tape .win{position:absolute;left:26%;right:26%;bottom:9%;height:22%;background:#151517;border:2px solid #000;display:flex;align-items:center;justify-content:space-between;padding:0 10%}" +
    ".mx-tape .win i{width:12px;height:12px;background:#d8d8d8;border:3px solid #6a6a6a}.mx-tape:hover .win i{animation:mxSpin 1s steps(4) infinite}" +
    ".mx-tape .sc{position:absolute;bottom:6%;width:6px;height:6px;background:#4a4a4e}.mx-tape .sc.a{left:5%}.mx-tape .sc.b{right:5%}" +
    ".mx-new{position:absolute;top:4px;right:4px;padding:3px 5px;background:#ffd23f;color:#3a2a00;font:400 8px/1 " + PX + ";border:2px solid #000;z-index:2;animation:mxBlink2 .8s steps(2) infinite}@keyframes mxBlink2{50%{background:#fff27a}}" +
    ".mx-fly{position:fixed;z-index:60;pointer-events:none;transition:transform .45s steps(6),opacity .45s steps(3)}" +
    ".mx-back{position:fixed;right:14px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:49;width:54px;height:54px;border:3px solid #000;background:#3a3428;color:#7dff9a;font-size:26px;cursor:pointer;box-shadow:4px 4px 0 #000}" +
    "@media (max-width:640px){.mx-row{grid-template-columns:1fr}.mx-side{flex-direction:row;min-width:0}.mx-slot{flex:1;width:auto}.mx-play{width:80px;height:80px;flex:none}.mx-crt{min-height:128px}.mx-shelf{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 12px;padding:14px 10px 18px}.mx-tape .lab{padding-left:34px}.mx-tape .pic{font-size:20px}.mx-tape .t{font-size:8px}}" +
    "@media (prefers-reduced-motion:reduce){.mx-idle,.mx-led,.mx-machine.loaded .reel,.mx-machine.loaded .mx-play,.mx-new{animation:none}}";
  var st = el("style"); st.textContent = css; document.head.appendChild(st);

  var deck = el("div"); deck.id = "deck"; deck.setAttribute("role", "main");
  deck.innerHTML = '<div class="mx-wrap"><div class="mx-top"><span class="mx-led" aria-hidden="true"></span><span class="mx-brand">MEMEX-68</span><span class="mx-sp"></span>' +
    '<button class="mx-btn" type="button" id="mxDice" aria-label="Random tape" title="Random tape">🎲</button>' +
    '<button class="mx-btn" type="button" data-fbl-btn aria-label="Language">🌐</button>' +
    '<button class="mx-btn" type="button" id="mxKeys" aria-label="Terminal" title="Terminal">⌨️</button></div>' +
    '<div class="mx-machine" id="mxM"><div class="mx-row"><div class="mx-crt" id="mxCrt" aria-live="polite"><div class="mx-idle">▼ ▼ ▼</div></div>' +
    '<div class="mx-side"><div class="mx-slot" aria-hidden="true"><div class="reels"><span class="reel"></span><span class="reel"></span></div></div>' +
    '<button class="mx-play" type="button" id="mxPlay" aria-label="Play" disabled>▶</button></div></div></div>' +
    '<div class="mx-shelf" id="mxShelf" role="list"></div></div>';
  var back = el("button", "mx-back", "📼"); back.type = "button"; back.setAttribute("aria-label", "Tapes"); back.hidden = true;

  function mount() {
    document.body.appendChild(deck); document.body.appendChild(back);
    var showTerm = ls("mx_view") === "term";
    view(showTerm ? "term" : "deck");
    shelf(); setInterval(function () { if (sig() !== lastSig) shelf(); }, 2000);
  }
  function view(v) {
    deck.hidden = v === "term"; back.hidden = v !== "term"; ls("mx_view", v);
    if (v === "term") { try { document.getElementById("commandInput").focus({ preventScroll: true }); } catch (e) {} }
  }
  var lastSig = "", sel = null, seen = {};
  try { seen = JSON.parse(ls("mx_seen") || "{}") || {}; } catch (e) { seen = {}; }
  function sig() { return cat().map(function (g) { return g.code + g.title + g.url; }).join("|"); }
  function shelf() {
    var list = cat().filter(function (g) { return g.url && g.url !== "#"; }), sh = deck.querySelector("#mxShelf"), first = !Object.keys(seen).length;
    lastSig = sig(); sh.innerHTML = "";
    list.forEach(function (g, i) {
      var a = art(g, i), b = el("button", "mx-tape");
      b.type = "button"; b.setAttribute("role", "listitem"); b.style.setProperty("--l", a[1]); b.style.setProperty("--s", a[2]);
      b.innerHTML = '<span class="lab"><span class="pic" aria-hidden="true">' + a[0] + '</span><span class="t"></span><span class="g"></span></span><span class="win" aria-hidden="true"><i></i><i></i></span><span class="sc a"></span><span class="sc b"></span>';
      b.querySelector(".t").textContent = g.title; b.querySelector(".g").textContent = String(g.genre || "").toUpperCase();
      b.setAttribute("aria-label", g.title);
      if (!first && !seen[g.code]) b.appendChild(el("span", "mx-new", "NEW"));
      b.addEventListener("click", function () { if (sel && sel.code === g.code) go(); else load(g, b, false, a); });
      b.addEventListener("dblclick", function () { load(g, b, true, a); go(); });
      sh.appendChild(b);
    });
    list.forEach(function (g) { seen[g.code] = 1; }); ls("mx_seen", JSON.stringify(seen));
  }
  function load(g, b, quick, a) {
    sel = g; snd("playTapeMotor");
    deck.querySelectorAll(".mx-tape.in").forEach(function (x) { x.classList.remove("in"); });
    var m = deck.querySelector("#mxM"), slot = deck.querySelector(".mx-slot");
    if (!quick && b) {   /* the tape flies into the deck */
      var r = b.getBoundingClientRect(), s = slot.getBoundingClientRect(), f = b.cloneNode(true);
      f.className = "mx-tape mx-fly"; f.style.left = r.left + "px"; f.style.top = r.top + "px"; f.style.width = r.width + "px"; f.style.height = r.height + "px"; document.body.appendChild(f);
      var k = Math.min(s.width / r.width, s.height / r.height) * .9;
      requestAnimationFrame(function () { f.style.transform = "translate(" + (s.left + s.width / 2 - r.left - r.width / 2) + "px," + (s.top + s.height / 2 - r.top - r.height / 2) + "px) scale(" + k + ")"; f.style.opacity = ".2"; });
      setTimeout(function () { f.remove(); }, 480);
      if (deck.scrollTop > 40) deck.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (b) b.classList.add("in");
    if (a) slot.style.background = "linear-gradient(" + a[1] + " 0 46%," + a[2] + " 46% 60%,#2a271f 60%)";
    m.classList.add("loaded"); m.classList.remove("go");
    var crt = deck.querySelector("#mxCrt"); crt.innerHTML = "<b></b><i></i><p></p>";
    crt.querySelector("b").textContent = g.title; crt.querySelector("i").textContent = String(g.genre || "").toUpperCase(); crt.querySelector("p").textContent = g.desc || "";
    var p = deck.querySelector("#mxPlay"); p.disabled = false; p.setAttribute("aria-label", "Play " + g.title);
    try { if (window.FBT_DICT) { /* translations follow via the kit's observer */ } } catch (e) {}
  }
  function go() {
    if (!sel) return; var g = sel, m = deck.querySelector("#mxM"), crt = deck.querySelector("#mxCrt");
    snd("playBell"); m.classList.add("go");
    var bar = el("div", "mx-load", "<span></span>"); crt.appendChild(bar); var t0 = performance.now();
    (function fill() { var k = Math.min(1, (performance.now() - t0) / 700); bar.firstChild.style.width = (k * 100) + "%"; if (k < 1) requestAnimationFrame(fill); })();
    setTimeout(function () {
      var url = new URL(g.url, location.href).href;
      if (CABINET && window.top !== window) { try { window.top.location.href = url; return; } catch (e) {} }
      location.href = url;
    }, 720);
  }
  deck.querySelector("#mxPlay").addEventListener("click", go);
  deck.querySelector("#mxKeys").addEventListener("click", function () { snd("playKeyClick"); view("term"); });
  back.addEventListener("click", function () { view("deck"); });
  deck.querySelector("#mxDice").addEventListener("click", function () {
    var tapes = deck.querySelectorAll(".mx-tape"); if (!tapes.length) return;
    var i = 0, n = 6 + Math.floor(Math.random() * tapes.length), pick;
    (function hop() { tapes.forEach(function (x) { x.style.transform = ""; }); pick = tapes[i % tapes.length]; pick.style.transform = "translateY(-8px)"; snd("playKeyClick"); if (++i < n) setTimeout(hop, 70 + i * 12); else { pick.style.transform = ""; pick.click(); } })();
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
