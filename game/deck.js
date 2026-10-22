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

  var css = "" +
    "#deck{position:fixed;inset:0;z-index:50;overflow-y:auto;-webkit-overflow-scrolling:touch;background:radial-gradient(900px 500px at 50% -10%,#3b3426,transparent 70%),linear-gradient(#1b1812,#0f0d09);color:#f3ead6;font:600 15px/1.35 'Figtree',system-ui,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;padding:max(10px,env(safe-area-inset-top)) 14px calc(28px + env(safe-area-inset-bottom))}" +
    "#deck[hidden]{display:none}" +
    ".mx-wrap{max-width:980px;margin:0 auto}" +
    ".mx-top{display:flex;align-items:center;gap:8px;margin:2px 0 12px}" +
    ".mx-brand{white-space:nowrap;font:400 clamp(20px,6vw,26px)/1 'VT323',monospace;letter-spacing:.08em;color:#7dff9a;text-shadow:0 0 8px rgba(125,255,154,.6)}.mx-led{width:9px;height:9px;border-radius:50%;background:#ff5a4a;box-shadow:0 0 8px #ff5a4a;animation:mxBlink 2.4s infinite}" +
    "@keyframes mxBlink{0%,60%{opacity:1}70%,100%{opacity:.35}}.mx-sp{flex:1}" +
    ".mx-btn{min-width:44px;height:44px;padding:0 12px;border-radius:12px;border:1px solid rgba(243,234,214,.22);background:rgba(255,255,255,.05);color:inherit;font:inherit;font-size:18px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}.mx-btn:hover{background:rgba(255,255,255,.1)}" +
    /* the machine */
    ".mx-machine{position:relative;border-radius:18px;padding:14px;background:linear-gradient(#d9cfb6,#bfb396);box-shadow:inset 0 2px 0 #f2ead6,inset 0 -6px 0 #9c9076,0 24px 50px -20px #000;color:#3a3324}" +
    ".mx-machine:before{content:'MEMEX-68';position:absolute;top:6px;right:16px;font:700 10px/1 'Press Start 2P',monospace;letter-spacing:.1em;color:rgba(58,51,36,.55)}" +
    ".mx-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:stretch}" +
    ".mx-crt{position:relative;min-height:150px;border-radius:14px/18px;background:radial-gradient(120% 100% at 50% 40%,#0f2a14,#041006 75%);box-shadow:inset 0 0 0 6px #2a271f,inset 0 0 30px rgba(0,0,0,.9);padding:16px 18px;overflow:hidden;color:#8dffa6;font:400 20px/1.15 'VT323',monospace;text-shadow:0 0 6px rgba(141,255,166,.55)}" +
    ".mx-crt:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 2px,transparent 2px 4px);pointer-events:none}" +
    ".mx-crt b{display:block;font:400 30px/1 'VT323',monospace;letter-spacing:.04em;color:#c9ffd4}.mx-crt i{display:block;font-style:normal;color:#5fd97a;font-size:18px;margin-top:2px}.mx-crt p{margin:8px 0 0;font-size:19px;color:#a8ffbb;max-height:5.8em;overflow:hidden}" +
    ".mx-idle{display:grid;place-items:center;height:100%;min-height:118px;font-size:34px;letter-spacing:.3em;animation:mxBob 1.4s ease-in-out infinite}@keyframes mxBob{50%{transform:translateY(6px)}}" +
    ".mx-load{height:10px;margin-top:10px;border:1px solid #5fd97a;padding:1px}.mx-load span{display:block;height:100%;width:0;background:#8dffa6;box-shadow:0 0 8px #8dffa6}" +
    ".mx-side{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:10px;min-width:120px}" +
    ".mx-slot{position:relative;width:120px;height:74px;border-radius:8px;background:#2a271f;box-shadow:inset 0 3px 8px #000;display:grid;place-items:center;overflow:hidden}" +
    ".mx-slot .reel{width:30px;height:30px;border-radius:50%;margin:0 7px;background:radial-gradient(circle,#2a271f 0 22%,#ddd 24% 30%,#555 32%);box-shadow:0 0 0 2px #888}" +
    ".mx-slot .reels{display:flex}.mx-machine.loaded .reel{animation:mxSpin 1.2s linear infinite}.mx-machine.go .reel{animation-duration:.25s}@keyframes mxSpin{to{transform:rotate(360deg)}}" +
    ".mx-play{width:96px;height:96px;border-radius:50%;border:0;cursor:pointer;background:radial-gradient(circle at 35% 30%,#ffb39f,#e8452c 55%,#9c2414);color:#fff;font-size:38px;box-shadow:0 6px 0 #7a1a0e,0 12px 24px -8px rgba(0,0,0,.6);transition:transform .08s,box-shadow .08s,filter .3s}" +
    ".mx-play:active{transform:translateY(5px);box-shadow:0 1px 0 #7a1a0e,0 4px 10px -4px rgba(0,0,0,.6)}.mx-play:disabled{filter:grayscale(.8) brightness(.8);cursor:default}" +
    ".mx-machine.loaded .mx-play{animation:mxPulse 1.6s ease-in-out infinite}@keyframes mxPulse{50%{box-shadow:0 6px 0 #7a1a0e,0 0 0 10px rgba(232,69,44,.25),0 12px 24px -8px rgba(0,0,0,.6)}}" +
    /* the shelf */
    ".mx-shelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px 14px;margin-top:22px;padding:18px 12px 22px;border-radius:14px;background:linear-gradient(#4a3a26,#3a2c1c);box-shadow:inset 0 -10px 0 #2b2014,inset 0 2px 0 rgba(255,220,170,.15)}" +
    ".mx-tape{position:relative;aspect-ratio:1.55;border:0;padding:0;border-radius:10px;cursor:pointer;background:#2b2b2e;box-shadow:0 8px 0 -2px #19191b,0 12px 20px -8px rgba(0,0,0,.7);color:#2a2418;text-align:left;font:inherit;transition:transform .2s cubic-bezier(.3,1.5,.5,1),opacity .3s}" +
    ".mx-tape:hover{transform:translateY(-4px) rotate(-1deg)}.mx-tape:active{transform:scale(.96)}.mx-tape.in{opacity:.25;transform:translateY(-10px) scale(.95)}" +
    ".mx-tape .lab{position:absolute;left:7%;right:7%;top:9%;height:58%;border-radius:6px;background:var(--l);overflow:hidden;padding:7px 9px 0 42px}" +
    ".mx-tape .lab:before{content:'';position:absolute;left:0;right:0;bottom:0;height:22%;background:var(--s)}" +
    ".mx-tape .pic{position:absolute;left:7px;top:6px;font-size:26px;line-height:1}" +
    ".mx-tape .t{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font:800 14px/1.08 'Figtree',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.01em;overflow:hidden}" +
    ".mx-tape .g{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;font:600 10px/1.2 'Figtree',system-ui,sans-serif;opacity:.75;overflow:hidden;margin-top:2px}" +
    ".mx-tape .win{position:absolute;left:27%;right:27%;bottom:9%;height:22%;border-radius:12px;background:#151517;display:flex;align-items:center;justify-content:space-between;padding:0 10%}" +
    ".mx-tape .win i{width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,#151517 0 25%,#d8d8d8 27% 36%,#6a6a6a 38%)}.mx-tape:hover .win i{animation:mxSpin 1.5s linear infinite}" +
    ".mx-tape .sc{position:absolute;bottom:4%;width:6px;height:6px;border-radius:50%;background:#4a4a4e}.mx-tape .sc.a{left:5%}.mx-tape .sc.b{right:5%}" +
    ".mx-new{position:absolute;top:-8px;right:-6px;padding:2px 7px;border-radius:999px;background:#ffd23f;color:#3a2a00;font:800 10px/1.4 'Figtree',sans-serif;transform:rotate(8deg);box-shadow:0 2px 6px rgba(0,0,0,.4)}" +
    ".mx-fly{position:fixed;z-index:60;pointer-events:none;transition:transform .45s cubic-bezier(.5,0,.4,1),opacity .45s}" +
    ".mx-back{position:fixed;right:14px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:49;width:54px;height:54px;border-radius:16px;border:1px solid currentColor;background:rgba(0,0,0,.6);color:#7dff9a;font-size:26px;cursor:pointer}" +
    "@media (max-width:640px){.mx-row{grid-template-columns:1fr}.mx-side{flex-direction:row;min-width:0}.mx-slot{flex:1;width:auto}.mx-play{width:84px;height:84px;font-size:32px;flex:none}.mx-crt{min-height:128px}.mx-shelf{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 10px;padding:14px 10px 18px}.mx-tape .lab{padding-left:36px}.mx-tape .pic{font-size:22px}.mx-tape .t{font-size:12.5px}.mx-tape .g{font-size:10px}}" +
    "@media (prefers-reduced-motion:reduce){.mx-idle,.mx-led,.mx-machine.loaded .reel,.mx-machine.loaded .mx-play{animation:none}}";
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
