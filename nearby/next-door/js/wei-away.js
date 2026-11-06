  /* sometimes Wei isn't in: a note on the counter says where he went (one of the other games).
     The cats can serve, or you can help yourself, which opens the lab. ?away=climb forces it. */
  (function () {
    var PLACES = {
      cloud:    { url: "/nearby/lie-back/",       t: ["Gone cloud-watching at Lie Back Park.", "去“看云坡”看云了。", "去「看雲坡」看雲了。", "去咗「看雲坡」睇雲。", "Me fui a ver nubes al Parque Panza Arriba.", "He anat a mirar núvols al Parc Panxa Enlaire."], g: ["Find Wei at Lie Back Park", "去“看云坡”找 Wei", "去「看雲坡」找 Wei", "去「看雲坡」搵 Wei", "Busca a Wei en el Parque Panza Arriba", "Busca en Wei al Parc Panxa Enlaire"] },
      climb:    { url: "/nearby/hold-on/",        t: ["Gone climbing at Hold On.", "去“抓稳”攀岩了。", "去「抓穩」攀岩了。", "去咗「抓穩」攀石。", "Me fui a escalar a Agárrate.", "He anat a escalar a Agafa't."], g: ["Climb with Wei", "和 Wei 一起攀岩", "和 Wei 一起攀岩", "同 Wei 一齊攀石", "Escala con Wei", "Escala amb en Wei"] },
      kintsugi: { url: "/nearby/mended/",         t: ["Mending bowls at Mended.", "在“金缮坊”修碗。", "在「金繕坊」修碗。", "喺「金繕坊」補碗。", "Reparando cuencos en Remendado.", "Reparant bols a Adobat."], g: ["Go to Mended", "去“金缮坊”", "去「金繕坊」", "去「金繕坊」", "Ve a Remendado", "Ves a Adobat"] },
      train:    { url: "/nearby/station/",        t: ["On the slow train. Window seat.", "在慢车上，靠窗。", "在慢車上，靠窗。", "坐緊慢車，揀咗窗口位。", "En el tren lento. Ventanilla.", "Al tren lent. Finestra."], g: ["Catch the train", "去赶火车", "去趕火車", "去搭火車", "Coge el tren", "Agafa el tren"] },
      books:    { url: "/nearby/borrowed-pages/", t: ["At Borrowed Pages, round the corner.", "在街角的“借来的书”。", "在街角的「借來的書」。", "喺街角嘅「借來的書」。", "En Páginas Prestadas, a la vuelta de la esquina.", "A Pàgines Manllevades, a la cantonada."], g: ["Go to Borrowed Pages", "去“借来的书”", "去「借來的書」", "去「借來的書」", "Ve a Páginas Prestadas", "Ves a Pàgines Manllevades"] },
      dj:       { url: "/nearby/late-light/",     t: ["DJing at Late Light tonight.", "今晚在“夜灯”打碟。", "今晚在「夜燈」打碟。", "今晚喺「夜燈」打碟。", "Pinchando en Luz Tardía esta noche.", "Punxant a Llum Tardana aquesta nit."], g: ["Join Wei at Late Light", "去“夜灯”找 Wei", "去「夜燈」找 Wei", "去「夜燈」搵 Wei", "Ve con Wei a Luz Tardía", "Ves amb en Wei a Llum Tardana"] }
    };
    var W = { head: ["BACK SOON", "马上回来", "馬上回來", "好快返", "VUELVO ENSEGUIDA", "TORNO DE SEGUIDA"],
              story: ["A note on the counter. Miso and Yuzu can serve, or slip behind the bar and make your own.", "吧台上留了张字条。可以让味噌和柚子招待，或者溜进吧台自己调一杯。", "吧台上留了張字條。可以讓味噌和柚子招待，或者溜進吧台自己調一杯。", "吧枱有張字條。可以叫味噌同柚子招呼你，或者自己入吧枱調一杯。", "Una nota en la barra. Miso y Yuzu pueden servirte, o pasa detrás de la barra y prepáratelo tú.", "Una nota a la barra. La Miso i la Yuzu et poden servir, o passa darrere la barra i fes-te'l tu."],
              back: ["Wei's back! 👋", "Wei 回来了！👋", "Wei 回來了！👋", "Wei 返嚟喇！👋", "¡Wei ha vuelto! 👋", "En Wei ha tornat! 👋"] };
    var IX = { en: 0, zh: 1, tw: 2, yue: 3, es: 4, ca: 5 };
    function tx(a) { return a[IX[AppState.lang] || 0] || a[0]; }
    var KEY = "weis-away", st = null, MIN = 15 * 60000;
    try {
      var q = new URLSearchParams(location.search).get("away");
      var saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (q && PLACES[q]) st = { p: q, until: Date.now() + MIN };
      else if (saved) st = saved.p ? saved : null;
      else {
        var keys = Object.keys(PLACES);
        st = Math.random() < 0.05 ? { p: keys[Math.floor(Math.random() * keys.length)], until: Date.now() + MIN } : { p: "" };   /* a note behind the counter, one visit in twenty: someone's nearly always here */
        sessionStorage.setItem(KEY, JSON.stringify(st)); if (!st.p) st = null;
      }
    } catch (e) {}
    /* whoever is on steps out (Wei, Mei or Popo; never the cats): the note is theirs, in their words, signed by them */
    function hw() { try { return window.FBWorld && FBWorld.host ? FBWorld.host().who : "wei"; } catch (e) { return "wei"; } }
    var HN = { wei: ["Wei", "Wei", "Wei", "Wei", "Wei", "Wei"], mei: ["Mei", "Mei", "Mei", "Mei", "Mei", "Mei"], popo: ["Popo", "婆婆", "婆婆", "婆婆", "Popo", "Popo"] };
    var CAN = { wei: "en Wei", mei: "la Mei", popo: "la Popo" };
    var HT = { mei: ["At {p}. Back soon-ish.", "在{p}。差不多快回来。", "在{p}。差不多快回來。", "喺{p}。就快返。", "En {p}. Vuelvo prontito.", "Sóc a {p}. Torno aviat, més o menys."],
      popo: ["Gone to {p}. Soup on the stove. Eat lah!", "去{p}了。炉子上有汤。食啦！", "去咗{p}。爐頭有湯。食啦！", "去咗{p}。爐頭有湯。食啦！", "Fui a {p}. Sopa en fuego. ¡Come!", "He anat a {p}. Hi ha sopa al foc. Menja!"] };
    function hostTx(t) { var w = hw(); if (w === "wei" || !HN[w]) return t; var n = tx(HN[w]); return String(t).replace(/\ben Wei\b/g, CAN[w]).replace(/\bWei\b/g, n); }
    function away() { var w = hw(); return w !== "cats" && w !== "mantou" && !!(st && st.p && Date.now() < st.until); }
    window.WeiAway = { on: away, place: function () { return away() ? st.p : null; } };

    var css = document.createElement("style");
    css.textContent = '#wei-note{display:none;position:absolute;left:50%;bottom:6px;transform:translateX(-50%) rotate(-4deg);z-index:4;width:128px;padding:8px 9px 6px;background:#f6ecd2;color:#3a2a1c;border:2px solid #000;box-shadow:3px 3px 0 rgba(0,0,0,.45);font:17px/1.1 Caveat,"Kaiti SC",STKaiti,KaiTi,cursive;text-decoration:none;image-rendering:pixelated}'
      + '#wei-note::before{content:"";position:absolute;top:-7px;left:50%;width:22px;height:10px;margin-left:-11px;background:rgba(242,165,65,.75);border:1px solid #000}'
      + '#wei-note b{display:block;font:15px/1 VT323,"PingFang SC",monospace;letter-spacing:.05em;color:#b4472c;margin-bottom:4px}#wei-note span{display:block;text-decoration:underline;text-decoration-style:dotted}#wei-note i{display:block;text-align:right;font-style:normal;opacity:.7}'
      + '#wei-note:hover,#wei-note:focus-visible{transform:translateX(-50%) rotate(0) scale(1.05)}'
      + 'body.wei-away #wei-note{display:block;animation:noteIn .5s steps(4)}@keyframes noteIn{0%{transform:translateX(-50%) translateY(-30px) rotate(-14deg);opacity:0}}'
      + 'body.wei-away #wei-anchor,body.wei-away #wei-zzz-particles{visibility:hidden}';
    document.head.appendChild(css);

    function paintNote() {
      var p = PLACES[st.p], n = document.getElementById("wei-note"), g = document.getElementById("away-go");
      n.href = g.href = p.url;
      document.getElementById("wei-note-h").textContent = tx(W.head);
      var w = hw(), pn = window.FBWorld && FBWorld.name ? FBWorld.name(st.p) : "";
      document.getElementById("wei-note-t").textContent = HT[w] ? tx(HT[w]).replace("{p}", pn) : tx(p.t);
      var sig = n.querySelector("i"); if (sig) sig.textContent = "— " + (w === "wei" ? "W." : tx(HN[w]));
      n.setAttribute("aria-label", hostTx(tx(p.g)));
      document.getElementById("away-go-lbl").textContent = hostTx(tx(p.g));
    }
    function apply() {
      var on = away(); document.body.classList.toggle("wei-away", on);
      document.getElementById("sleep-wake").style.display = on ? "none" : "";
      document.getElementById("away-go").style.display = on ? "" : "none";
      if (!on) return;
      paintNote();
      var hnm = document.getElementById("host-name"); if (hnm) hnm.textContent = HN[hw()] ? tx(HN[hw()]) : "Wei";
    }

    var eval0 = window.evaluateWeiState;
    window.evaluateWeiState = function () {
      var r = eval0.apply(this, arguments);
      if (away()) { var was = AppState.weiState; AppState.weiState = "asleep"; if (was !== "asleep" && typeof Cats !== "undefined" && Cats.st) try { Cats.syncSleep(); } catch (e) {} }
      apply(); return r;
    };
    var render0 = window.renderCurrentDialogue;
    window.renderCurrentDialogue = function () {
      if (!away()) { apply(); return render0.apply(this, arguments); }
      var snore = SoundEngine.playSnore; SoundEngine.playSnore = function () {};
      try { render0.apply(this, arguments); } finally { SoundEngine.playSnore = snore; }
      setText("sleep-header-title", tx(W.head));
      setText("sleep-header-badge", "✈️");
      setText("sleep-story-text", tx(W.story));
      apply();
    };
    var lang0 = window.setLanguage;
    window.setLanguage = function () { var r = lang0.apply(this, arguments); if (away()) { apply(); if (!document.getElementById("sleep-mode-screen").classList.contains("hidden")) renderCurrentDialogue(); } return r; };

    /* he comes back after a while */
    setInterval(function () {
      if (st && st.p && Date.now() >= st.until) {
        st = null; try { sessionStorage.setItem(KEY, JSON.stringify({ p: "" })); } catch (e) {}
        evaluateWeiState(); AppState.currentTopic = null;
        if (document.getElementById("sleep-mode-screen") && !document.getElementById("sleep-mode-screen").classList.contains("hidden")) renderCurrentDialogue();
        if (AppState.weiState === "awake" || hw() === "mei" || hw() === "popo") try { showToast(hostTx(tx(W.back))); } catch (e) {}
      }
    }, 5000);
    if (away()) { try { evaluateWeiState(); if (AppState.inSanctuary) renderCurrentDialogue(); } catch (e) {} }
  })();
