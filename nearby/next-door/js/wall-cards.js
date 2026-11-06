  /* the Wall's postcards: drawn with Say Hello's own scenes, and opened one at a time to read */
  (function () {
    var css = document.createElement("style");
    css.textContent = '.pcm{position:relative;display:block;width:100%;padding:0;border:3px solid #000;background:#000;box-shadow:3px 3px 0 rgba(0,0,0,.5);cursor:pointer;transform:rotate(var(--r));transition:transform .15s}'
      + '.pcm:hover,.pcm:focus-visible{transform:rotate(0) scale(1.04);z-index:2}'
      + '.pcm canvas{display:block;width:100%;aspect-ratio:16/11;image-rendering:pixelated}'
      + '.pcm::before{content:"";position:absolute;top:-8px;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff8a7a,#b3261e);border:2px solid #000;z-index:2}'
      + '.pcm .cap{position:absolute;left:0;right:0;bottom:0;padding:3px 6px;background:rgba(0,0,0,.6);color:#fff3c0;font-size:15px;line-height:1.1;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '.pcm.sealed canvas{filter:sepia(.6) brightness(.55)}.pcm.sealed .lock{position:absolute;inset:0;display:grid;place-items:center;font-size:30px;text-shadow:2px 2px 0 #000}'
      + '.pcv{background:#f6ecd2;color:var(--pc-ink,#2c4a86);border:3px solid #000;display:grid;grid-template-columns:1.4fr 1fr;min-height:220px}.pcv .m{padding:12px;font:600 22px/26px Caveat,"Kaiti SC",STKaiti,cursive;white-space:pre-wrap;word-break:break-word;border-right:2px solid rgba(60,40,20,.35);background:repeating-linear-gradient(transparent 0 25px,rgba(60,90,140,.22) 25px 26px)}'
      + '.pcv .s{padding:10px;display:flex;flex-direction:column;gap:6px;font:600 21px/1.1 Caveat,"Kaiti SC",STKaiti,cursive}.pcv .st{align-self:flex-end;width:50px;height:60px;display:grid;place-items:center;font-size:24px;border:4px dotted #fffaf0;outline:2px solid rgba(0,0,0,.2)}.pcv .s small{font:15px VT323,monospace;color:rgba(60,40,20,.65);text-transform:uppercase}';
    document.head.appendChild(css);

    var PC = null;
    function scenes() {
      if (window.PCScenes) return Promise.resolve(window.PCScenes);
      if (PC) return PC;
      PC = fetch("/nearby/say-hello/").then(function (r) { return r.text(); }).then(function (h) {
        var m = /<script id="pc-scenes">([\s\S]*?)<\/script>/.exec(h); if (m) (0, eval)(m[1]); return window.PCScenes;
      }).catch(function () { PC = null; return null; });
      return PC;
    }
    var LOC = { en: "en-GB", zh: "zh-CN", tw: "zh-TW", yue: "zh-HK", es: "es-ES", ca: "ca-ES" };
    function when(d) { try { return new Intl.DateTimeFormat(LOC[AppState.lang] || "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(d)); } catch (e) { return new Date(d).toLocaleString(); } }
    function rot(id) { var h = 0; for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return ((h % 9) - 4) * .9 + "deg"; }
    function show(c, P) {
      var st = (P && P.STAMPS[c.stamp]) || ["✉️", "#c8402a"], ink = (P && P.INK[c.ink]) || "#2c4a86";
      var m = document.createElement("div"); m.className = "modal-backdrop pc-view";
      m.innerHTML = '<div class="modal panel" style="max-width:520px"><div class="pcv" style="--pc-ink:' + ink + '"><div class="m"></div><div class="s"><span class="st" style="background:' + st[1] + '">' + st[0] + '</span><span style="margin-top:auto"></span></div></div>'
        + '<div class="flex gap-2 mt-3"><a class="btn btn-amber flex-1" href="/nearby/say-hello/?to=' + encodeURIComponent(c.from) + "&scene=" + encodeURIComponent(c.scene) + '">✍️ ' + esc(T("wall.writeCard")) + '</a><button class="btn" type="button">✕</button></div></div>';
      m.querySelector(".m").textContent = c.sealed ? "🔒 " + T("wall.opens").replace("{d}", when(c.open_at)) : (c.msg || "");
      var s = m.querySelector(".s span:last-child"); s.innerHTML = ""; s.appendChild(document.createTextNode("— " + c.from + (c.place ? ", " + c.place : "")));
      m.onclick = function (e) { if (e.target === m || e.target.closest("button.btn")) m.remove(); };
      document.body.appendChild(m);
    }
    window.WallCards = { scenes: scenes, show: show, rot: rot, when: when };
  })();
