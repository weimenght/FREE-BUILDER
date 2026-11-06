/* Nearby Station, the standalone app (freebuilder.net/station/ → this page with ?solo=1&app=1).
   The same train as in town, plus what a long ride has: change the record, a drink from the trolley on the sill,
   get off at a stop and walk the platform (a kiosk, a bench, the departures board), catch another train,
   and at the town's wild places a path straight into Nearby. In town (no app=1) none of this runs. */
(function () {
  "use strict";
  if (!/[?&]app=1/.test(location.search)) return;
  var de = document.documentElement; de.classList.add("cb-app");
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pick = function (a) { return a[(Math.random() * a.length) | 0]; };

  /* ---------- words, five languages: en, 简, 繁, es, ca ---------- */
  function li() { var l = (window.FBL && FBL.get && FBL.get()) || "en"; return { en: 0, zh: 1, "zh-Hant": 2, es: 3, ca: 4 }[l] || 0; }
  var W = {
    app: ["Nearby Station", "近邻站", "近鄰站", "Estación Cerca", "Estació A Prop"],
    lead: ["A window seat, a cup of something warm, and the world going by. Get off wherever you like.", "靠窗的座位，一杯热饮，窗外世界慢慢经过。想在哪站下车都可以。", "靠窗的座位，一杯熱飲，窗外世界慢慢經過。想在哪站下車都可以。", "Un asiento junto a la ventana, algo caliente para beber y el mundo pasando. Bájate donde quieras.", "Un seient a la finestra, alguna cosa calenta per beure i el món passant. Baixa on vulguis."],
    car: ["Car No. {c}", "{c} 号车厢", "{c} 號車廂", "Coche n.º {c}", "Cotxe núm. {c}"],
    big: ["Bigger window", "放大窗口", "放大窗口", "Ventana más grande", "Finestra més gran"],
    ctl: ["Show the controls", "显示控制按钮", "顯示控制按鈕", "Muestra los controles", "Mostra els controls"],
    u_music: ["Music", "音乐", "音樂", "Música", "Música"], u_drink: ["Drink", "喝点什么", "喝點什麼", "Bebida", "Beguda"], u_sky: ["Sky", "天色", "天色", "Cielo", "Cel"],
    u_else: ["Elsewhere", "换个地方", "換個地方", "Otro lugar", "Un altre lloc"], u_friend: ["Friend", "朋友", "朋友", "Amigo", "Amic"],
    help: ["How it works", "怎么玩", "怎麼玩", "Cómo funciona", "Com funciona"], full: ["Full screen", "全屏", "全螢幕", "Pantalla completa", "Pantalla completa"], unfullL: ["Exit full screen", "退出全屏", "退出全螢幕", "Salir de pantalla completa", "Surt de la pantalla completa"],
    nextOnly: ["Next stop", "下一站", "下一站", "Próxima parada", "Propera parada"], arrivingOnly: ["Arriving", "即将到站", "即將到站", "Llegando", "Arribant"],
    atPf: ["At the platform", "停靠站台", "停靠月台", "En el andén", "A l'andana"], offShort: ["Get off", "下车", "下車", "Bajar", "Baixar"],
    play: ["Play", "播放", "播放", "Reproducir", "Reprodueix"], pause: ["Pause", "暂停", "暫停", "Pausa", "Pausa"],
    skyT: ["The sky", "窗外天色", "窗外天色", "El cielo", "El cel"], skyLead: ["The light and the weather outside.", "窗外的光线和天气。", "窗外的光線和天氣。", "La luz y el tiempo de fuera.", "La llum i el temps de fora."],
    timeL: ["Light", "光线", "光線", "Luz", "Llum"], wxL: ["Weather", "天气", "天氣", "Tiempo", "Temps"],
    tDawn: ["Dawn", "清晨", "清晨", "Amanecer", "Alba"], tDay: ["Day", "白天", "白天", "Día", "Dia"], tSunset: ["Sunset", "黄昏", "黃昏", "Atardecer", "Capvespre"], tNight: ["Night", "夜晚", "夜晚", "Noche", "Nit"],
    wClear: ["Clear", "晴", "晴", "Despejado", "Serè"], wRain: ["Rain", "雨", "雨", "Lluvia", "Pluja"], wFog: ["Fog", "雾", "霧", "Niebla", "Boira"], wSnow: ["Snow", "雪", "雪", "Nieve", "Neu"], wStorm: ["Storm", "雷雨", "雷雨", "Tormenta", "Tempesta"],
    winOpen: ["Open the window a crack", "把车窗推开一点", "把車窗推開一點", "Abre un poco la ventana", "Obre una mica la finestra"], winShut: ["Close the window", "关上车窗", "關上車窗", "Cierra la ventana", "Tanca la finestra"],
    o1T: ["Your window", "你的车窗", "你的車窗", "Tu ventana", "La teva finestra"],
    o1D: ["Drag to wipe the mist. Hold to write on the glass. Double-tap to knock.", "拖动擦掉雾气，按住在玻璃上写字，双击敲敲窗。", "拖動擦掉霧氣，按住在玻璃上寫字，雙擊敲敲窗。", "Arrastra para limpiar el vaho. Mantén pulsado para escribir en el cristal. Toca dos veces para llamar.", "Arrossega per netejar el baf. Mantén premut per escriure al vidre. Toca dos cops per trucar."],
    o2T: ["Make it yours", "随你喜欢", "隨你喜歡", "A tu gusto", "Al teu gust"],
    o2D: ["Pick a record, get a drink from the trolley, change the sky outside.", "挑一张唱片，从小推车拿杯喝的，换换窗外的天色。", "挑一張唱片，從小推車拿杯喝的，換換窗外的天色。", "Elige un disco, pide algo al carrito, cambia el cielo de fuera.", "Tria un disc, demana alguna cosa al carretó, canvia el cel de fora."],
    o3T: ["Get off anywhere", "随处下车", "隨處下車", "Bájate donde quieras", "Baixa on vulguis"],
    o3D: ["Tap Stop here, then Get off. Walk the platform and catch another train. Some stops lead into Nearby.", "点「这站停」，再点「下车」。在站台上走走，换一班车。有几站下去就是近邻。", "點「這站停」，再點「下車」。在月台上走走，換一班車。有幾站下去就是近鄰。", "Toca Para aquí y luego Bajar. Pasea por el andén y coge otro tren. Algunas paradas llevan a Cerca.", "Toca Para aquí i després Baixar. Passeja per l'andana i agafa un altre tren. Algunes parades porten a A Prop."],
    o4T: ["Ride together", "一起坐", "一起坐", "Viajad juntos", "Viatgeu junts"],
    o4D: ["Send someone the link: they sit in your car and see the same window. Elsewhere takes you both somewhere new.", "把链接发给朋友，他们会坐进你的车厢，看到同一扇窗。「换个地方」带你们一起去新的地方。", "把連結傳給朋友，他們會坐進你的車廂，看到同一扇窗。「換個地方」帶你們一起去新的地方。", "Envía el enlace a alguien: se sienta en tu coche y ve la misma ventana. Otro lugar os lleva a los dos a un sitio nuevo.", "Envia l'enllaç a algú: seu al teu cotxe i veu la mateixa finestra. Un altre lloc us porta tots dos a un lloc nou."],
    nextBtn: ["Next", "下一步", "下一步", "Siguiente", "Següent"], skip: ["Skip", "跳过", "跳過", "Saltar", "Omet"], go: ["Let's go", "出发", "出發", "Vamos", "Som-hi"],
    music: ["Change the record", "换一张唱片", "換一張唱片", "Cambia el disco", "Canvia el disc"],
    records: ["Records", "唱片", "唱片", "Discos", "Discos"],
    recLead: ["The little player by the window. Pick one.", "窗边的小唱机，挑一张吧。", "窗邊的小唱機，挑一張吧。", "El tocadiscos junto a la ventana. Elige uno.", "El tocadiscos de la finestra. Tria'n un."],
    drink: ["Something to drink", "来点喝的", "來點喝的", "Algo de beber", "Alguna cosa per beure"],
    trolley: ["The trolley", "小推车", "小推車", "El carrito", "El carretó"],
    trolleyLead: ["It comes rattling down the aisle.", "小推车咔哒咔哒地从过道过来了。", "小推車咔噠咔噠地從走道過來了。", "Llega traqueteando por el pasillo.", "Arriba trontollant pel passadís."],
    kiosk: ["Kiosk", "小卖部", "小賣部", "Quiosco", "Quiosc"],
    kioskLead: ["Something for the next train.", "带一杯上下一班车。", "帶一杯上下一班車。", "Algo para el próximo tren.", "Alguna cosa per al pròxim tren."],
    here: ["from here", "本地", "本地", "de aquí", "d'aquí"],
    close: ["Close", "关闭", "關閉", "Cerrar", "Tanca"],
    next: ["Next · {s}", "下一站 · {s}", "下一站 · {s}", "Próxima · {s}", "Propera · {s}"],
    stop: ["Stop here", "这站停", "這站停", "Para aquí", "Para aquí"],
    arriving: ["Arriving · {s}", "即将到站 · {s}", "即將到站 · {s}", "Llegando · {s}", "Arribant · {s}"],
    off: ["Get off at {s}", "在{s}下车", "在{s}下車", "Bájate en {s}", "Baixa a {s}"],
    leaving: ["Leaving the platform", "列车驶离站台", "列車駛離月台", "Saliendo del andén", "Sortint de l'andana"],
    tunnel: ["In a tunnel", "隧道中", "隧道中", "En un túnel", "En un túnel"],
    aboard: ["Back aboard", "回到车上", "回到車上", "Volver a bordo", "Tornar a bord"],
    soon: ["Your train leaves soon", "你的车快开了", "你的車快開了", "Tu tren sale pronto", "El teu tren surt aviat"],
    gone: ["Your train has gone. The board has others.", "你的车开走了。看看发车牌，还有别的车。", "你的車開走了。看看發車牌，還有別的車。", "Tu tren se ha ido. En el panel hay otros.", "El teu tren se n'ha anat. Al panell n'hi ha d'altres."],
    departures: ["Departures", "发车信息", "發車資訊", "Salidas", "Sortides"],
    boardLead: ["Pick a train. It pulls in at platform 1.", "选一班车，会停在 1 号站台。", "選一班車，會停在 1 號月台。", "Elige un tren. Entra por el andén 1.", "Tria un tren. Entra per l'andana 1."],
    to: ["To", "开往", "開往", "Destino", "Destinació"],
    via: ["Train", "车型", "車型", "Tren", "Tren"],
    pf: ["Pl.", "站台", "月台", "And.", "And."],
    take: ["Take this one", "坐这班", "坐這班", "Coger este", "Agafar aquest"],
    boardTo: ["Board · to {s}", "上车 · 开往{s}", "上車 · 開往{s}", "Subir · a {s}", "Pujar · a {s}"],
    pulling: ["Pulling in…", "列车进站中…", "列車進站中…", "Entrando…", "Entrant…"],
    bound: ["Bound for {s}", "开往{s}", "開往{s}", "Destino {s}", "Destinació {s}"],
    readBoard: ["Read the departures", "看发车牌", "看發車牌", "Mira las salidas", "Mira les sortides"],
    sit: ["Sit a while", "坐一会儿", "坐一會兒", "Siéntate un rato", "Seu una estona"],
    stand: ["Stand up", "站起来", "站起來", "Levántate", "Aixeca't"],
    walkTo: ["Walk to {p}", "走去{p}", "走去{p}", "Camina hasta {p}", "Camina fins a {p}"],
    walk: ["‹ walk ›", "‹ 走走 ›", "‹ 走走 ›", "‹ pasea ›", "‹ passeja ›"],
    left: ["Walk left", "向左走", "向左走", "Camina a la izquierda", "Camina a l'esquerra"],
    right: ["Walk right", "向右走", "向右走", "Camina a la derecha", "Camina a la dreta"],
    platform: ["Platform 1", "1 号站台", "1 號月台", "Andén 1", "Andana 1"],
    friends: ["Your friends ride on in the car.", "朋友们继续坐在车厢里。", "朋友們繼續坐在車廂裡。", "Tus amigos siguen en el coche.", "Els teus amics continuen al cotxe."],
    sleeper: ["Sleeper", "卧铺", "臥鋪", "Coche cama", "Cotxe llit"],
    commuter: ["Commuter", "通勤车", "通勤車", "Cercanías", "Rodalies"],
    mountain: ["Mountain railway", "山区小火车", "山區小火車", "Tren de montaña", "Tren de muntanya"],
    tram: ["Seaside tram", "海边电车", "海邊電車", "Tranvía costero", "Tramvia de la costa"]
  };
  function w(k, v) { var a = W[k] || [k], s = a[li()] || a[0]; if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]); return s; }

  /* ---------- drinks: the trolley's, and one from each country at its kiosks ---------- */
  var DR = {
    jasmine: { n: ["Jasmine tea", "茉莉花茶", "茉莉花茶", "Té de jazmín", "Te de gessamí"], cup: "tea", c: "#d6b456", hot: 1 },
    milktea: { n: ["Hong Kong milk tea", "港式奶茶", "港式奶茶", "Té con leche de Hong Kong", "Te amb llet de Hong Kong"], cup: "mug", c: "#b07a4a", hot: 1 },
    coffee: { n: ["Café con leche", "牛奶咖啡", "牛奶咖啡", "Café con leche", "Cafè amb llet"], cup: "mug", c: "#9a653a", hot: 1 },
    cocoa: { n: ["Hot chocolate", "热可可", "熱可可", "Chocolate caliente", "Xocolata calenta"], cup: "mug", c: "#5e341e", hot: 1 },
    orxata: { n: ["Orxata, cold", "冰油莎豆奶", "冰油莎豆奶", "Horchata fría", "Orxata freda"], cup: "glass", c: "#efe4cc" },
    lemonade: { n: ["Lemonade", "柠檬水", "檸檬水", "Limonada", "Llimonada"], cup: "glass", c: "#f1df74" },
    water: { n: ["A glass of water", "一杯水", "一杯水", "Un vaso de agua", "Un got d'aigua"], cup: "glass", c: "#d4ecf2" },
    creme: { n: ["Café crème", "奶油咖啡", "奶油咖啡", "Café crème", "Café crème"], cup: "tea", c: "#a87446", hot: 1 },
    schorle: { n: ["Apfelschorle", "苹果气泡水", "蘋果氣泡水", "Apfelschorle", "Apfelschorle"], cup: "glass", c: "#e8b84a" },
    espresso: { n: ["Espresso", "意式浓缩", "意式濃縮", "Café solo", "Cafè sol"], cup: "tiny", c: "#2b160c", hot: 1 },
    matcha: { n: ["Matcha", "抹茶", "抹茶", "Matcha", "Matxa"], cup: "bowl", c: "#6e9a46", hot: 1 },
    brew: { n: ["Tea with milk", "英式奶茶", "英式奶茶", "Té con leche", "Te amb llet"], cup: "mug", c: "#c08a5c", hot: 1 },
    diner: { n: ["Diner coffee", "美式咖啡", "美式咖啡", "Café americano", "Cafè americà"], cup: "mug", c: "#3a2214", hot: 1 },
    chai: { n: ["Spiced chai", "印度奶茶", "印度奶茶", "Chai especiado", "Txai especiat"], cup: "tiny", c: "#b8865a", hot: 1 }
  };
  var TROLLEY = ["jasmine", "milktea", "coffee", "cocoa", "orxata", "lemonade", "water"];
  var LOCAL = { fr: "creme", de: "schorle", ch: "cocoa", it: "espresso", es: "coffee", ca: "orxata", uk: "brew", cy: "brew", us: "diner", cn: "jasmine", hk: "milktea", jp: "matcha" };
  function localOf(st) { if (!st) return null; return LOCAL[st.tongue] || LOCAL[st.look] || ({ desert: "chai", hutong: "jasmine" })[st.biome] || null; }

  /* ---------- the drink on the sill: tap to sip; hot ones stop steaming after a while ---------- */
  var drink = null;   /* { k, lv: 0..1, t0 } */
  function cupSvg(d) {
    var D = DR[d.k], lv = Math.max(0, Math.min(1, d.lv)), c = D.c, hot = D.hot && lv > 0 && Date.now() - d.t0 < 8 * 60e3, s = "";
    var steam = hot ? '<g class="jn-steam" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1" stroke-linecap="round"><path d="M10 6c-1.5-1.5 1.5-2.5 0-4"/><path d="M13 7c-1.5-1.5 1.5-2.5 0-4"/><path d="M16 6c-1.5-1.5 1.5-2.5 0-4"/></g>' : "";
    if (D.cup === "mug") { var y = 21 - lv * 11; s = '<path d="M18 11h2.5a3 3 0 0 1 0 6H18" fill="none" stroke="#e9dfcc" stroke-width="2"/><rect x="5" y="9" width="13" height="13" rx="2" fill="#efe6d4"/><clipPath id="jnc"><rect x="6" y="10" width="11" height="11" rx="1"/></clipPath><rect clip-path="url(#jnc)" x="6" y="' + y + '" width="11" height="12" fill="' + c + '"/><rect x="5" y="9" width="13" height="2" fill="#fff" opacity=".35"/>'; }
    else if (D.cup === "tea") { var y2 = 18 - lv * 6; s = '<ellipse cx="12" cy="21.5" rx="9" ry="1.8" fill="#f2ead8"/><path d="M5 12h14c0 4-3 8-7 8s-7-4-7-8z" fill="#f6efe0"/><clipPath id="jnc"><path d="M6 12.6h12c0 3.6-2.6 6.8-6 6.8s-6-3.2-6-6.8z"/></clipPath><rect clip-path="url(#jnc)" x="5" y="' + y2 + '" width="14" height="9" fill="' + c + '"/><path d="M19 13.5a2 2 0 0 1 0 3.5" fill="none" stroke="#f6efe0" stroke-width="1.6"/>'; }
    else if (D.cup === "tiny") { var y3 = 20 - lv * 5; s = '<ellipse cx="12" cy="21.6" rx="6.5" ry="1.4" fill="#f2ead8"/><path d="M7.5 14h9v4.5a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3z" fill="#f6efe0"/><clipPath id="jnc"><path d="M8.3 14.8h7.4v3.8a2.3 2.3 0 0 1-2.3 2.3h-2.8a2.3 2.3 0 0 1-2.3-2.3z"/></clipPath><rect clip-path="url(#jnc)" x="8" y="' + y3 + '" width="8" height="7" fill="' + c + '"/><path d="M16.5 15.5a1.6 1.6 0 0 1 0 3" fill="none" stroke="#f6efe0" stroke-width="1.3"/>'; }
    else if (D.cup === "bowl") { var y4 = 19.5 - lv * 5; s = '<path d="M4 14h16c0 4.5-3.6 7.5-8 7.5S4 18.5 4 14z" fill="#3d4a3a"/><clipPath id="jnc"><path d="M5 14.6h14c0 3.8-3 6.4-7 6.4s-7-2.6-7-6.4z"/></clipPath><rect clip-path="url(#jnc)" x="4" y="' + y4 + '" width="16" height="8" fill="' + c + '"/><path d="M4 14h16" stroke="#596b52" stroke-width="1"/>'; }
    else { var y5 = 22 - lv * 14; s = '<path d="M7 6h10l-1.2 16H8.2z" fill="rgba(220,235,245,.28)" stroke="rgba(255,255,255,.7)" stroke-width=".8"/><clipPath id="jnc"><path d="M7.4 6.4h9.2L15.5 21.6H8.5z"/></clipPath><rect clip-path="url(#jnc)" x="7" y="' + y5 + '" width="10" height="17" fill="' + c + '" opacity=".92"/>' + (lv > 0.15 ? '<rect x="9" y="' + (y5 + 1.5) + '" width="2.6" height="2.6" fill="rgba(255,255,255,.6)" transform="rotate(12 10 ' + (y5 + 3) + ')"/><rect x="12.4" y="' + (y5 + 2.6) + '" width="2.4" height="2.4" fill="rgba(255,255,255,.5)"/>' : "") + '<path d="M14 2.5l-1.4 13" stroke="#e05a4a" stroke-width="1.1"/>'; }
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + steam + s + "</svg>";
  }
  function cupEl() {
    var el = $("jnCup"), bz = document.querySelector(".window-bezel"); if (!bz) return null;
    if (!el) { el = document.createElement("button"); el.type = "button"; el.id = "jnCup"; el.setAttribute("data-fbt-skip", ""); bz.appendChild(el);
      el.addEventListener("click", function () { if (!drink || drink.lv <= 0.02) return trolley(false); drink.lv = Math.max(0, drink.lv - 0.2); el.classList.remove("sip"); void el.offsetWidth; el.classList.add("sip"); paintCup(); }); }
    return el;
  }
  function paintCup() { var el = cupEl(); if (!el) return; el.hidden = !drink; if (!drink) return; el.innerHTML = cupSvg(drink); el.setAttribute("aria-label", w2(DR[drink.k].n)); el.title = w2(DR[drink.k].n); }
  function playing() { try { return typeof isAudioPlaying !== "undefined" && !!isAudioPlaying; } catch (e) { return false; } }
  function w2(a) { return a[li()] || a[0]; }
  function pour(k) { drink = { k: k, lv: 1, t0: Date.now() }; try { sessionStorage.setItem("jn_drink", JSON.stringify(drink)); } catch (e) {} paintCup(); }
  setInterval(function () { if (drink) { try { sessionStorage.setItem("jn_drink", JSON.stringify(drink)); } catch (e) {} paintCup(); } }, 30e3);
  try { var dd = JSON.parse(sessionStorage.getItem("jn_drink") || "null"); if (dd && DR[dd.k]) drink = dd; } catch (e) {}

  /* ---------- small sheets (the cabin's card style) ---------- */
  function sheet(html, cls) {
    var s = document.createElement("div"); s.className = "cb-sheet jn-sheet " + (cls || ""); s.innerHTML = '<div class="cb-card" role="dialog" aria-modal="true">' + html + "</div>";
    document.body.appendChild(s);
    s.addEventListener("click", function (e) { if (e.target === s || e.target.closest("[data-x]")) s.remove(); });
    var esc = function (e) { if (e.key === "Escape") { s.remove(); removeEventListener("keydown", esc); } }; addEventListener("keydown", esc);
    setTimeout(function () { var f = s.querySelector("button:not([data-x]),a"); if (f) f.focus(); }, 30);
    return s;
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function trolley(atKiosk) {
    var st = state.station, loc = atKiosk ? localOf(st) : null, list = TROLLEY.slice();
    if (loc) { list = list.filter(function (k) { return k !== loc; }); list.unshift(loc); }
    var rows = list.map(function (k) { var D = DR[k]; return '<button type="button" class="jn-dr" data-k="' + k + '"><span class="jn-dc">' + cupSvg({ k: k, lv: 0.85, t0: 0 }) + '</span><span>' + esc(w2(D.n)) + (k === loc ? ' <em>' + w("here") + "</em>" : "") + "</span></button>"; }).join("");
    var s = sheet('<small class="cb-stn">' + (atKiosk ? esc(st.name) + " · " + w("kiosk") : w("trolley")) + '</small><p class="jn-lead">' + (atKiosk ? w("kioskLead") : w("trolleyLead")) + '</p><div class="jn-drs">' + rows + '</div><div class="row"><button type="button" data-x>' + w("close") + "</button></div>");
    s.addEventListener("click", function (e) { var b = e.target.closest(".jn-dr"); if (!b) return; pour(b.dataset.k); s.remove(); if (P.on) P.say("☕"); });
  }
  function records() {
    var cur = state.trackIndex;
    var rows = RADIO_TRACKS.map(function (t, i) { return '<button type="button" class="jn-rec' + (i === cur && playing() ? " on" : "") + '" data-i="' + i + '"><b aria-hidden="true">' + (i === cur && playing() ? "▶" : "♪") + '</b><span>' + esc(t.title.replace(/^\d+\.\s*/, "")) + '</span><small>' + esc(t.code.split("•")[0].trim()) + "</small></button>"; }).join("");
    var pl = playing();
    var s = sheet('<small class="cb-stn">' + w("records") + '</small><p class="jn-lead">' + w("recLead") + '</p><button type="button" class="jn-wide" data-pp>' + (pl ? "⏸ " + w("pause") : "▶ " + w("play")) + '</button><div class="jn-recs">' + rows + '</div><div class="row"><button type="button" data-x>' + w("close") + "</button></div>");
    s.addEventListener("click", function (e) {
      if (e.target.closest("[data-pp]")) { try { FBCabin.unlockAudio(); toggleAudioEngine(); if (typeof audioCtx !== "undefined" && audioCtx && audioCtx.resume) audioCtx.resume(); } catch (x) {} s.remove(); return; }
      var b = e.target.closest(".jn-rec"); if (!b) return; var i = +b.dataset.i;
      try { if (FBCabin.unlockAudio) FBCabin.unlockAudio(); } catch (x) {}
      try {
        state.trackIndex = (i - 1 + RADIO_TRACKS.length) % RADIO_TRACKS.length; cycleMusicTrack();   /* cycle moves it on by one: lands on i */
        if (!playing()) toggleAudioEngine(); else if (typeof startLofiSequencer === "function") startLofiSequencer();
        if (typeof audioCtx !== "undefined" && audioCtx && audioCtx.resume) audioCtx.resume();
      } catch (x) {}
      try { FBCabin.paintDock(); FBCabin.toast("♪ " + RADIO_TRACKS[i].title.replace(/^\d+\.\s*/, "")); } catch (x) {}
      s.remove();
    });
  }

  /* ---------- the app's own frame: one bar up top (where you are, what you can do now), one bar below (what you can change) ---------- */
  var UI = null;
  var SV = function (d) { return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; };
  var ICON = {   /* one set of line icons for the app's own bars and cards (the town's pixel converter leaves svg alone) */
    music: SV('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
    drink: SV('<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3c-1 1.2 1 2 0 3.5M12 3c-1 1.2 1 2 0 3.5"/>'),
    sky: SV('<circle cx="8" cy="8" r="3"/><path d="M8 1.8v1.4M2 8h1.4M3.8 3.8l1 1M12.2 3.8l-1 1"/><path d="M7 20h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.6A3.2 3.2 0 0 0 7 20z"/>'),
    "else": SV('<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
    friend: SV('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5.4 6-5.4s5.4 2 6 5.4"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.6c2.4.2 4 1.9 4.5 5.4"/>'),
    full: SV('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    unfull: SV('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'),
    window: SV('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 3v18M3 12h18"/><path d="M6 7.5l2-2M15 16.5l2-2" opacity=".6"/>'),
    door: SV('<path d="M5 21V4a1 1 0 0 1 1-1h9v18"/><path d="M15 3l4 1.5V21"/><path d="M3 21h18"/><circle cx="12" cy="12.5" r=".9" fill="currentColor"/>')
  };
  function fullOk() { var d = document.documentElement; try { return !!(d.requestFullscreen || d.webkitRequestFullscreen) && window.top === window ? true : !!(window.top.document.documentElement.requestFullscreen); } catch (e) { return false; } }
  function paintFull() {
    var f = UI && UI.top.querySelector('[data-u="full"]'); if (!f) return;
    var on = false; try { var td = window.top.document; on = !!(td.fullscreenElement || td.webkitFullscreenElement); } catch (e) {}
    if (f._on === on) return; f._on = on; f.innerHTML = on ? ICON.unfull : ICON.full;
    var k = on ? "unfullL" : "full"; f.setAttribute("aria-label", w(k)); f.title = w(k);
  }
  function toggleFull() {
    try { var td = window.top.document, el = td.documentElement, on = td.fullscreenElement || td.webkitFullscreenElement;
      if (on) (td.exitFullscreen || td.webkitExitFullscreen).call(td); else (el.requestFullscreen || el.webkitRequestFullscreen).call(el); } catch (e) {}
  }
  function buildUI() {
    if (UI) return UI;
    var top = document.createElement("div"); top.className = "jn-topbar";
    top.innerHTML = '<div class="jn-where"><b class="jn-stn"></b><small class="jn-status" aria-live="polite"></small></div><span class="jn-seats"></span><button type="button" class="jn-do" hidden></button>' +
      '<button type="button" class="jn-ic" data-u="help"></button>' + (fullOk() ? '<button type="button" class="jn-ic" data-u="full">' + ICON.full + '</button>' : "");
    var dock = document.createElement("nav"); dock.className = "jn-dock";
    dock.innerHTML = ["music", "drink", "sky", "else", "friend"].map(function (k) { return '<button type="button" data-u="' + k + '"><i aria-hidden="true">' + ICON[k] + '</i><span></span></button>'; }).join("");
    document.body.appendChild(top); document.body.appendChild(dock);
    var seats = document.querySelector(".cb-seats"); if (seats) top.querySelector(".jn-seats").appendChild(seats);   /* friends aboard, as dots */
    function click(e) {
      var b = e.target.closest("button"); if (!b) return; var u = b.dataset.u;
      if (b.classList.contains("jn-do")) { if (b.dataset.a === "stop" && state.trainState === "CRUISING" && !state.inTunnel) { try { triggerStationStopOrDepart(); FBCabin.director.next.depart = Date.now() + 90e3; } catch (x) {} } else if (b.dataset.a === "off") getOff(); return; }
      if (u === "help") intro(true); if (u === "full") toggleFull();
      if (u === "music") records(); if (u === "drink") trolley(false); if (u === "sky") sky();
      if (u === "else") { try { FBCabin.somewhereElse(); } catch (x) {} }
      if (u === "friend") { try { FBCabin.share(); } catch (x) {} }
    }
    top.addEventListener("click", click); dock.addEventListener("click", click);
    UI = { top: top, dock: dock }; words(); return UI;
  }
  function words() {
    if (!UI) return;
    UI.dock.querySelectorAll("button").forEach(function (b) { var k = "u_" + b.dataset.u; b.querySelector("span").textContent = w(k); b.setAttribute("aria-label", w(k)); });
    var h = UI.top.querySelector('[data-u="help"]'); h.textContent = "?"; h.setAttribute("aria-label", w("help")); h.title = w("help");
    paintFull();
  }
  function paintUI() {
    if (!UI) return;
    var on = FBCabin.S.boarded && !P.on; UI.top.hidden = UI.dock.hidden = !on; if (!on) return;
    var st = state.station || {}, ts = state.trainState, n = st.name || "", line = "", act = null;
    if (state.inTunnel) line = "🚇 " + w("tunnel");
    else if (ts === "CRUISING") { line = w("nextOnly"); act = ["stop", w("stop")]; }
    else if (ts === "BRAKING") line = "🔔 " + w("arrivingOnly");
    else if (ts === "STOPPED") { line = w("atPf"); act = ["off", w("offShort") + " →"]; }
    else line = w("leaving");
    var sub = [st.sub || st.jp, st.region].filter(Boolean).filter(function (x) { return x !== n; })[0] || "";
    var stn = UI.top.querySelector(".jn-stn"), stat = UI.top.querySelector(".jn-status");
    if (stn.textContent !== n) stn.textContent = n;
    var sl = line + (sub && ts !== "BRAKING" ? " · " + sub : ""); if (stat.textContent !== sl) stat.textContent = sl;
    var b = UI.top.querySelector(".jn-do");
    if (act) { b.hidden = false; if (b.dataset.a !== act[0] || b._l !== act[1]) { b.dataset.a = act[0]; b._l = act[1]; b.textContent = act[1]; } b.classList.toggle("pri", act[0] === "off"); } else b.hidden = true;
    if (ts === "STOPPED") { try { var dn = FBCabin.director.next; if (dn.depart && dn.depart - Date.now() < 35e3) dn.depart = Date.now() + 35e3; } catch (x) {} }   /* time to decide */
    var tH = UI.top.offsetHeight, bH = UI.dock.offsetHeight, r = de.style;
    if (r.getPropertyValue("--jnT") !== tH + "px" || r.getPropertyValue("--jnB") !== bH + "px") { r.setProperty("--jnT", tH + "px"); r.setProperty("--jnB", bH + "px"); try { FBCabin.fit(); } catch (x) {} }
    if (li() !== paintUI.l) { paintUI.l = li(); words(); var ff = UI.top.querySelector('[data-u="full"]'); if (ff) ff._on = null; }
    paintFull();
  }
  function reserve() { return (UI && FBCabin.S.boarded ? UI.top.offsetHeight + UI.dock.offsetHeight : 0) + 28; }

  /* ---------- the sky sheet: the light, the weather, the window ---------- */
  function sky() {
    var TI = [["dawn", "tDawn", "🌅"], ["afternoon", "tDay", "☀️"], ["sunset", "tSunset", "🌇"], ["night", "tNight", "🌙"]],
        WX = [["clear", "wClear", "✨"], ["rain", "wRain", "🌧"], ["fog", "wFog", "🌫"], ["snow", "wSnow", "❄️"], ["storm", "wStorm", "⛈"]];
    function chips(list, cur, k) { return list.map(function (c) { return '<button type="button" class="jn-chip' + (c[0] === cur ? " on" : "") + '" data-' + k + '="' + c[0] + '" aria-pressed="' + (c[0] === cur) + '">' + w(c[1]) + "</button>"; }).join(""); }
    var aj = !!state.windowAjar;
    var s = sheet('<small class="cb-stn">' + w("skyT") + '</small><p class="jn-lead">' + w("skyLead") + '</p><h3 class="jn-h">' + w("timeL") + '</h3><div class="jn-chips">' + chips(TI, state.timeOfDay, "t") + '</div><h3 class="jn-h">' + w("wxL") + '</h3><div class="jn-chips">' + chips(WX, state.weather, "w") + '</div>' +
      '<button type="button" class="jn-wide" data-aj>' + w(aj ? "winShut" : "winOpen") + '</button><div class="row"><button type="button" data-x>' + w("close") + "</button></div>");
    s.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.t) { try { setTimeOfDay(b.dataset.t); } catch (x) {} }
      if (b.dataset.w) { try { setWeather(b.dataset.w); } catch (x) {} }
      if (b.hasAttribute("data-aj")) { try { toggleWindowAjar(); } catch (x) {} b.textContent = w(state.windowAjar ? "winShut" : "winOpen"); }
      if (b.dataset.t || b.dataset.w) { var grp = b.parentNode; grp.querySelectorAll(".jn-chip").forEach(function (c) { var o = c === b; c.classList.toggle("on", o); c.setAttribute("aria-pressed", o); }); try { FBCabin.director.next.time = Date.now() + 300e3; FBCabin.director.next.weather = Date.now() + 300e3; FBCabin.sync(); } catch (x) {} }
    });
  }

  /* ---------- orientation: four short cards, each lighting up what it's about ---------- */
  var STEPS = [["window", "o1T", "o1D", ["#windowViewport"]], ["music", "o2T", "o2D", ['.jn-dock [data-u="music"]', '.jn-dock [data-u="drink"]', '.jn-dock [data-u="sky"]']], ["door", "o3T", "o3D", [".jn-do", ".jn-where"]], ["friend", "o4T", "o4D", ['.jn-dock [data-u="friend"]', '.jn-dock [data-u="else"]']]];
  function intro(again) {
    if (document.querySelector(".jn-intro")) return;
    if (!again) { try { if (localStorage.getItem("jn_intro")) return; } catch (e) {} }
    var i = 0, el = document.createElement("div"); el.className = "jn-intro"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    document.body.appendChild(el);
    function lit(on) { document.querySelectorAll(".jn-hl").forEach(function (x) { x.classList.remove("jn-hl"); }); if (on) STEPS[i][3].forEach(function (q) { var x = document.querySelector(q); if (x && !x.hidden) x.classList.add("jn-hl"); }); }
    function done() { lit(false); el.remove(); try { localStorage.setItem("jn_intro", "1"); } catch (e) {} }
    function show() {
      var st = STEPS[i], last = i === STEPS.length - 1;
      el.innerHTML = '<div class="jn-icard"><div class="jn-ib" aria-hidden="true">' + ICON[st[0]] + '</div><h2>' + w(st[1]) + '</h2><p>' + w(st[2]) + '</p><div class="jn-dots" aria-hidden="true">' + STEPS.map(function (x, k) { return "<i" + (k === i ? ' class="on"' : "") + "></i>"; }).join("") + '</div>' +
        '<div class="jn-irow">' + (last ? "" : '<button type="button" data-k="skip">' + w("skip") + "</button>") + '<button type="button" class="pri" data-k="next">' + (last ? w("go") : w("nextBtn") + " ›") + "</button></div></div>";
      el.setAttribute("aria-label", w(st[1])); lit(true); var nb = el.querySelector('[data-k="next"]'); if (nb) nb.focus();
    }
    el.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.k === "skip") return done(); if (b.dataset.k === "next") { if (i < STEPS.length - 1) { i++; show(); } else done(); } });
    el.addEventListener("keydown", function (e) { if (e.key === "Escape") done(); if (e.key === "ArrowRight") { if (i < STEPS.length - 1) { i++; show(); } else done(); } if (e.key === "ArrowLeft" && i > 0) { i--; show(); } });
    show();
  }

  /* ============================================================================================
     The platform: a pixel side view of the stop. Walk along it; your train waits a little, then goes.
     ============================================================================================ */
  var COACHES = {
    sleeper: { body: "#2f4a3a", stripe: "#c9a35a", roof: "#1b2a21", win: "#f6d48a" },
    commuter: { body: "#c4ccd3", stripe: "#2b5fa8", roof: "#7d8790", win: "#fff1c2" },
    mountain: { body: "#9b2f2a", stripe: "#ead6a2", roof: "#4a1d1a", win: "#f8d68e" },
    tram: { body: "#eadbab", stripe: "#2c8a7a", roof: "#6f6247", win: "#fde9b0" }
  };
  var COACH_OF = { metropolis: "commuter", alpine: "mountain", coastal: "tram" };
  var WILDSTOP = { lake: "lake", snow: "peaks", alpine: "pasture", coastal: "sea", forest: "forest", countryside: "meadow" };
  function placeOk(k) { try { return !!(FBWorld.PLACES && FBWorld.PLACES[k]); } catch (e) { return false; } }
  function exitsFor(st) {
    if (!st) return [];
    if (st.biome === "hutong") return ["bar", "books"].filter(placeOk);
    var k = WILDSTOP[st.biome]; return k && placeOk(k) ? [k] : [];
  }
  function pname(k) { try { return FBWorld.name(k); } catch (e) { return k; } }
  function picon(k) { try { return FBWorld.icon(k); } catch (e) { return "🌿"; } }
  function seed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }
  function curCoach() { var m = /cb-coach-(\w+)/.exec(document.body.className); return (m && COACHES[m[1]]) ? m[1] : "sleeper"; }
  function setCoach(k) { document.body.className = document.body.className.replace(/\bcb-coach-\w+/g, "").trim(); document.body.classList.add("cb-coach-" + k); }

  var P = { on: false };
  function getOff() {
    if (P.on || state.trainState !== "STOPPED") return;
    var C = window.FBCabin; if (!C) return;
    if (C.S.code) { try { C.toast(w("friends")); C.leave(); } catch (e) {} }
    try { C.director.stop(); } catch (e) {}
    openPlatform();
  }
  function musicLow(on) {
    try { if (typeof masterMusicGain !== "undefined" && masterMusicGain && audioCtx) masterMusicGain.gain.setTargetAtTime((typeof volumes !== "undefined" ? volumes.music : 0.7) * 0.45 * (on ? 0.3 : 1), audioCtx.currentTime, 0.6); } catch (e) {}
  }
  function chime() { try { if (typeof playStationArrivalChime === "function") playStationArrivalChime(); } catch (e) {} }
  function ding() { try { var a = window.__jnA = window.__jnA || new (window.AudioContext || window.webkitAudioContext)(), t0 = a.currentTime; [988, 784].forEach(function (f, i) { var o = a.createOscillator(), g = a.createGain(); o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0 + i * 0.35); g.gain.exponentialRampToValueAtTime(0.05, t0 + i * 0.35 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.35 + 1.1); o.connect(g); g.connect(a.destination); o.start(t0 + i * 0.35); o.stop(t0 + i * 0.35 + 1.2); }); } catch (e) {} }

  /* who's on the platform: you, a few travellers (dresses, skirts, coats; some with a case), a cat or Mantou if they're at the station */
  var SKIN = ["#f1c9a5", "#e0ac83", "#c68c62", "#8d5a3b", "#5e3b26", "#f5d6bd"], HAIR = ["#2a1d16", "#4a2e1d", "#8a5a2b", "#c9a15a", "#1a1a1a", "#6b6b6b", "#b8452d"],
      TOP = ["#c8452e", "#2c6e8a", "#3f7a4a", "#e0a43a", "#6a4a8a", "#2a2a34", "#d98aa0", "#e8e0cc", "#3a5a8c"], BOTTOM = ["#2a2a34", "#3d4a6a", "#5a4632", "#7a2e3a", "#2f5a4a", "#c9b48a"];
  function folk(r) { return { skin: pick(SKIN), hair: pick(HAIR), top: pick(TOP), bot: pick(BOTTOM), skirt: Math.random() < 0.45, long: Math.random() < 0.4, bag: r && Math.random() < 0.5 ? pick(["#7a4a2a", "#3a3a48", "#8a2e2e", "#2e5a6a"]) : null }; }
  var me = folk(false); me.bag = null;

  function openPlatform() {
    var st = state.station; if (!st) return;
    var R = seed(st.name), coach = curCoach(), ncoach = 6, CL = 150, GAP = 5, TL = ncoach * (CL + GAP);
    var ex = exitsFor(st), WW = ex.length ? 2420 : 2240;
    var mine = (window.FB_CAR || 1) % ncoach;
    var trainX = 180, doorX = trainX + mine * (CL + GAP) + CL - 22;
    P = {
      on: true, st: st, W: WW, x: doorX, vx: 0, face: 1, step: 0, sit: null, t0: Date.now(), leaveAt: Date.now() + 80e3, warned: false,
      train: { k: coach, x: trainX, v: 0, mode: "stopped", mine: true, len: TL, to: null },
      next: null, R: R, ex: ex, CL: CL, GAP: GAP, nc: ncoach,
      folks: [0, 1, 2, 3].slice(0, 2 + ((R() * 3) | 0)).map(function (i) { return { f: folk(true), x: 300 + R() * (WW - 600), face: R() < 0.5 ? -1 : 1, t: R() * 9 }; }),
      say: function (t) { var b = el.querySelector(".jn-say"); b.textContent = t; b.classList.remove("on"); void b.offsetWidth; b.classList.add("on"); }
    };
    var items = [
      { k: "sign", x: 300 }, { k: "bench", x: 520, cat: 1 }, { k: "clock", x: 800 }, { k: "kiosk", x: 1080 }, { k: "sign", x: 1380 },
      { k: "board", x: 1640 }, { k: "bench", x: 1890, dog: 1 }, { k: "plant", x: 2080 }
    ];
    if (ex.length) items.push({ k: "exit", x: 2290, ex: ex });
    P.items = items;
    var cats = {}, dog = "";
    try { cats = FBWorld.cats ? FBWorld.cats() : {}; dog = FBWorld.dog ? FBWorld.dog() : ""; } catch (e) {}
    P.cat = cats.yuzu === "train" ? "yuzu" : cats.miso === "train" ? "miso" : null; P.dog = dog === "train";

    var el = document.createElement("div"); el.className = "jn-plat"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", st.name + " · " + w("platform"));
    el.innerHTML = '<canvas aria-hidden="true"></canvas><div class="jn-top"><span class="jn-chip"><b></b><small></small></span><button type="button" class="jn-back"></button></div>' +
      '<div class="jn-say" aria-live="polite"></div><div class="jn-ctl"><button type="button" class="jn-arr" data-d="-1">‹</button><button type="button" class="jn-act" hidden></button><button type="button" class="jn-arr" data-d="1">›</button></div><div class="jn-hint"></div>';
    document.body.appendChild(el); P.el = el;
    el.querySelector(".jn-chip b").textContent = st.name; el.querySelector(".jn-chip small").textContent = [st.sub || st.jp, st.region].filter(Boolean).join(" · ");
    el.querySelector(".jn-arr[data-d='-1']").setAttribute("aria-label", w("left")); el.querySelector(".jn-arr[data-d='1']").setAttribute("aria-label", w("right"));
    el.querySelector(".jn-hint").textContent = w("walk");
    var back = el.querySelector(".jn-back"); back.textContent = "🚃 " + w("aboard"); back.onclick = function () { reboard(); };
    var cv = el.querySelector("canvas"), ctx = cv.getContext("2d");
    musicLow(true);
    requestAnimationFrame(function () { el.classList.add("on"); });
    setTimeout(function () { el.querySelector(".jn-hint").classList.add("off"); }, 5000);

    /* walking: hold a side of the screen or an arrow, or the keyboard */
    var hold = 0;
    function dirAt(cx) { var r = cv.getBoundingClientRect(), f = (cx - r.left) / r.width; return f < 0.4 ? -1 : f > 0.6 ? 1 : 0; }
    cv.addEventListener("pointerdown", function (e) { hold = dirAt(e.clientX); if (P.sit && hold) stand(); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
    cv.addEventListener("pointermove", function (e) { if (e.buttons || e.pointerType === "touch") { if (hold) hold = dirAt(e.clientX) || hold; } });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { cv.addEventListener(ev, function () { hold = 0; }); });
    el.querySelectorAll(".jn-arr").forEach(function (b) {
      b.addEventListener("pointerdown", function (e) { e.preventDefault(); hold = +b.dataset.d; if (P.sit) stand(); try { b.setPointerCapture(e.pointerId); } catch (x) {} });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { b.addEventListener(ev, function () { hold = 0; }); });
      b.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); P.x = Math.max(20, Math.min(P.W - 20, P.x + 40 * +b.dataset.d)); P.face = +b.dataset.d; } });
    });
    var keys = {};
    function kd(e) { if (!P.on || document.querySelector(".jn-sheet")) return; if (e.key === "ArrowLeft" || e.key === "a") { keys.l = 1; if (P.sit) stand(); } if (e.key === "ArrowRight" || e.key === "d") { keys.r = 1; if (P.sit) stand(); } if ((e.key === "Enter" || e.key === " ") && document.activeElement === document.body) { e.preventDefault(); act(); } }
    function ku(e) { if (e.key === "ArrowLeft" || e.key === "a") keys.l = 0; if (e.key === "ArrowRight" || e.key === "d") keys.r = 0; }
    addEventListener("keydown", kd); addEventListener("keyup", ku);
    var actBtn = el.querySelector(".jn-act"); actBtn.onclick = function () { act(); };
    P.cleanup = function () { removeEventListener("keydown", kd); removeEventListener("keyup", ku); };

    function near(x, r) { return Math.abs(P.x - x) < (r || 46); }
    function trainAt(T) { return T && T.mode === "stopped" && P.x > T.x + 10 && P.x < T.x + T.len - 10; }
    var cur = null;
    function nearest() {
      var T = P.train;
      for (var i = 0; i < items.length; i++) { var it = items[i];
        if (it.k === "board" && near(it.x)) return { a: "board-read", label: "📋 " + w("readBoard") };
        if (it.k === "kiosk" && near(it.x)) return { a: "kiosk", label: "☕ " + w("kiosk") };
        if (it.k === "bench" && near(it.x, 34)) return { a: "sit", it: it, label: P.sit ? "🧍 " + w("stand") : "🪑 " + w("sit") };
        if (it.k === "exit" && near(it.x, 70)) return { a: "exit", ex: it.ex, label: it.ex.map(function (k) { return picon(k) + " " + w("walkTo", { p: pname(k) }); }).join("  ·  "), pri: 1 };
      }
      if (trainAt(T)) { if (!T.mine) return { a: "board", label: "🚃 " + w("boardTo", { s: T.to.name }), pri: 1 };
        var door = T.x + ((window.FB_CAR || 1) % P.nc) * (P.CL + P.GAP) + P.CL - 22; if (near(door, 30)) return { a: "aboard", label: "🚃 " + w("aboard") }; }
      return null;
    }
    function act() {
      var n = cur; if (!n) return;
      if (n.a === "aboard") reboard();
      else if (n.a === "board") boardNew(P.train);
      else if (n.a === "board-read") departures();
      else if (n.a === "kiosk") trolley(true);
      else if (n.a === "sit") { if (P.sit) stand(); else { P.sit = n.it; P.x = n.it.x + (P.cat && n.it.cat || P.dog && n.it.dog ? -8 : 0); if ((P.cat && n.it.cat) || (P.dog && n.it.dog)) setTimeout(function () { P.heart = Date.now(); }, 1600); } }
      else if (n.a === "exit") exitTo(n.ex);
    }
    function stand() { P.sit = null; }
    function exitTo(ex) {
      if (ex.length === 1) return go(ex[0]);
      var s = sheet('<small class="cb-stn">' + esc(st.name) + '</small><div class="cb-doors">' + ex.map(function (k) { return '<a class="cb-door" href="#" data-k="' + k + '"><b aria-hidden="true">' + picon(k) + "</b><span>" + esc(pname(k)) + '</span><small>' + w("walkTo", { p: "" }).trim() + ' →</small></a>'; }).join("") + '</div><div class="row"><button type="button" data-x>' + w("close") + "</button></div>");
      s.addEventListener("click", function (e) { var a = e.target.closest("[data-k]"); if (!a) return; e.preventDefault(); go(a.dataset.k); });
    }
    function go(k) {
      var url = "/nearby/"; try { url = FBWorld.url(k); } catch (e) {}
      var to = "/nearby/?at=" + encodeURIComponent(url);
      el.classList.add("fade"); setTimeout(function () { try { (window.top || window).location.href = to; } catch (e) { location.href = to; } }, 500);
    }
    function departures() {
      if (!P.list) {
        var seen = {}, pool = STATION_CATALOG.filter(function (s) { return s !== st; }), list = [];
        var wild = pool.filter(function (s) { return exitsFor(s).length; }), rest = pool;
        [wild, rest, rest, rest].forEach(function (src) {
          for (var g = 0; g < 30 && list.length < 4; g++) { var s = pick(src); if (!seen[s.name] && !list.some(function (x) { return x.st.biome === s.biome; })) { seen[s.name] = 1; list.push({ st: s, k: COACH_OF[s.biome] || "sleeper" }); break; } }
        });
        P.list = list;
      }
      var rows = P.list.map(function (t, i) { var e = exitsFor(t.st); return '<button type="button" class="jn-dep" data-i="' + i + '"><span class="jn-to">' + esc(t.st.name) + (e.length ? ' <i>' + e.map(picon).join("") + "</i>" : "") + '</span><span class="jn-via">' + w(t.k) + '</span><span class="jn-pf">1</span></button>'; }).join("");
      var s = sheet('<div class="jn-brd"><div class="jn-bh"><b>' + w("departures") + '</b><span>' + esc(st.name) + '</span></div><div class="jn-bc"><span>' + w("to") + "</span><span>" + w("via") + "</span><span>" + w("pf") + "</span></div>" + rows + '</div><p class="jn-lead">' + w("boardLead") + '</p><div class="row"><button type="button" data-x>' + w("close") + "</button></div>", "jn-dsheet");
      s.addEventListener("click", function (e) { var b = e.target.closest(".jn-dep"); if (!b) return; var t = P.list[+b.dataset.i]; s.remove(); callTrain(t); });
    }
    function callTrain(t) {
      P.say(w("pulling"));
      var T = P.train;
      if (T.mine && T.mode === "stopped") { T.mode = "out"; ding(); }
      P.queue = t; P.list = null;
    }
    function arrive(t) {
      /* the new train stops with a door near you */
      var len = P.nc * (P.CL + P.GAP), stopX = Math.max(60, Math.min(P.W - len - 60, P.x - (2 * (P.CL + P.GAP) + P.CL - 22)));
      P.train = { k: t.k, x: stopX - 1400, stop: stopX, v: 9, mode: "in", mine: false, len: len, to: t.st };
    }

    /* ---------- drawing ---------- */
    var Wc = 0, Hc = 0, px = 2, oy = 0;
    function size() {
      var vw = innerWidth, vh = innerHeight; px = Math.max(2, Math.min(6, Math.floor(Math.min(vw / 120, vh / 200))));   /* tall phones get bigger pixels: a closer, fuller platform */
      Wc = Math.ceil(vw / px); Hc = Math.ceil(vh / px); cv.width = Wc; cv.height = Hc; oy = Math.max(0, Math.round((Hc - 184) * 0.55));
      ctx.imageSmoothingEnabled = false;
    }
    size(); P.resize = function () { size(); }; addEventListener("resize", P.resize);

    var tod = state.timeOfDay, wx = state.weather, night = tod === "night", dusk = tod === "sunset";
    var SKY = { dawn: ["#e9a58f", "#f9dcbb"], afternoon: ["#77ade0", "#cfe5f4"], sunset: ["#4a3a70", "#f2995a"], night: ["#0b1022", "#253150"] }[tod] || ["#77ade0", "#cfe5f4"];
    var grey = wx === "rain" || wx === "storm" || wx === "fog";
    var stars = []; for (var i = 0; i < 40; i++) stars.push([R() * 2000, R() * 90]);
    var drops = []; for (i = 0; i < 90; i++) drops.push([Math.random(), Math.random(), 0.5 + Math.random()]);
    function rect(c, x, y, w0, h0) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w0), Math.round(h0)); }
    function mix(a, b, t) { var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); var r = (pa >> 16) * (1 - t) + (pb >> 16) * t, g = (pa >> 8 & 255) * (1 - t) + (pb >> 8 & 255) * t, bl = (pa & 255) * (1 - t) + (pb & 255) * t; return "rgb(" + (r | 0) + "," + (g | 0) + "," + (bl | 0) + ")"; }
    function far(cam) {
      var b = st.biome, base = oy + 104, sc = cam * 0.25, r2 = seed(st.name + b), k, x, h;
      var fade = function (c) { return grey ? mix(c, "#8a929c", 0.35) : night ? mix(c, "#0e1424", 0.55) : dusk ? mix(c, "#3a2840", 0.25) : c; };
      if (b === "metropolis" || b === "hutong") {
        for (k = -2; k < 60; k++) { x = k * 26 - (sc % 26); var hh = b === "hutong" ? 14 + r2() * 8 : 24 + r2() * 58, ww = b === "hutong" ? 26 : 18 + r2() * 8;
          if (b === "hutong") { rect(fade("#7d7a76"), x, base - hh, ww, hh); rect(fade("#4a4a50"), x - 3, base - hh - 4, ww + 6, 4); rect(fade("#4a4a50"), x - 5, base - hh - 2, 3, 2); rect(fade("#4a4a50"), x + ww + 2, base - hh - 2, 3, 2); if ((k % 3) === 0) rect(night || dusk ? "#ff5a3a" : "#c83a2a", x + ww / 2 - 1, base - hh + 3, 3, 4); }
          else { rect(fade(pick(["#5a6170", "#6b6f7c", "#4f5666", "#777b86"])), x, base - hh, ww - 2, hh); for (var yy = base - hh + 4; yy < base - 4; yy += 6) for (var xx = x + 3; xx < x + ww - 5; xx += 5) if (r2() < (night ? 0.45 : dusk ? 0.3 : 0.12)) rect(night || dusk ? "#ffd98a" : "#c9d6e2", xx, yy, 2, 3); } }
      } else if (b === "coastal" || b === "lake") {
        rect(fade(b === "coastal" ? "#3f7fae" : "#4a86a0"), 0, base - 18, Wc, 18);
        for (k = 0; k < 30; k++) rect("rgba(255,255,255,.25)", ((k * 53 - sc * 0.6) % Wc + Wc) % Wc, base - 16 + (k * 7 % 14), 6, 1);
        if (b === "lake") for (k = -1; k < 12; k++) { x = k * 120 - (sc % 120); tri(fade("#5f7a6e"), x, base - 18, 140, 22); }
        else { x = 900 - sc; rect(fade("#e8e2d4"), x, base - 46, 6, 28); rect(fade("#c8302a"), x, base - 40, 6, 4); rect(night ? "#fff2a8" : fade("#3a3a3a"), x - 1, base - 50, 8, 4); }
      } else if (b === "alpine" || b === "snow") {
        for (k = -1; k < 14; k++) { x = k * 150 - (sc % 150) - 40; tri(fade(b === "snow" ? "#c9d2de" : "#6b7f96"), x, base, 200, 66 + (k % 3) * 12); tri(fade("#f4f6fa"), x + 70, base - 50 - (k % 3) * 12, 60, 18 + (k % 3) * 4); }
        for (k = -1; k < 60; k++) { x = k * 20 - ((cam * 0.5) % 20); tri(fade(b === "snow" ? "#5d7466" : "#2f5a3a"), x, base, 12, 16 + (k * 7 % 9)); }
      } else if (b === "forest") {
        for (var lay = 0; lay < 2; lay++) for (k = -1; k < 80; k++) { x = k * (14 - lay * 3) - ((cam * (0.25 + lay * 0.2)) % (14 - lay * 3)); tri(fade(lay ? "#24452c" : "#3d6a46"), x, base, 14, 26 + (k * 11 % 14) + lay * 6); }
      } else if (b === "desert") {
        for (k = -1; k < 10; k++) { x = k * 200 - (sc % 200); rect(fade("#c46a3a"), x + 30, base - 34 - (k % 2) * 10, 70, 34 + (k % 2) * 10); rect(fade("#a8552c"), x + 26, base - 36 - (k % 2) * 10, 78, 4); rect(fade("#3f6a3a"), x + 150, base - 12, 3, 12); rect(fade("#3f6a3a"), x + 146, base - 9, 3, 5); }
      } else {
        for (k = -1; k < 12; k++) { x = k * 160 - (sc % 160); ctx.fillStyle = fade("#6f9a52"); ctx.beginPath(); ctx.ellipse(x + 80, base, 110, 22 + (k % 2) * 8, 0, Math.PI, 0); ctx.fill(); }
        x = 700 - sc; rect(fade("#e8dcc0"), x, base - 30, 6, 22); ctx.save(); ctx.translate(Math.round(x + 3), Math.round(base - 30)); ctx.rotate(Date.now() / 1600); rect(fade("#5a4632"), -1, -12, 2, 24); rect(fade("#5a4632"), -12, -1, 24, 2); ctx.restore();
      }
      if (wx === "fog") { ctx.fillStyle = "rgba(225,230,236,.45)"; ctx.fillRect(0, oy, Wc, 110); }
    }
    function tri(c, x, base, w0, h0) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(Math.round(x), base); ctx.lineTo(Math.round(x + w0 / 2), Math.round(base - h0)); ctx.lineTo(Math.round(x + w0), base); ctx.fill(); }
    function drawTrain(T, cam) {
      if (!T) return; var C = COACHES[T.k], y = oy + 60, lit = night || dusk || wx === "storm";
      for (var c = 0; c < P.nc; c++) {
        var x = T.x + c * (P.CL + P.GAP) - cam; if (x > Wc + 10 || x + P.CL < -10) continue;
        rect(C.roof, x + 2, y - 4, P.CL - 4, 5); rect(C.body, x, y, P.CL, 52); rect(C.stripe, x, y + 36, P.CL, 4);
        if (T.k === "tram") rect(C.stripe, x, y + 40, P.CL, 12);
        for (var wv = 0; wv < 5; wv++) { var wxp = x + 14 + wv * 20; rect("#1d2228", wxp - 1, y + 9, 15, 15); rect(lit ? C.win : "#9fb6c6", wxp, y + 10, 13, 13); if (!lit) rect("rgba(255,255,255,.35)", wxp + 1, y + 11, 4, 2); }
        rect("#1d2228", x + P.CL - 30, y + 6, 18, 44); rect(T.mine && c === ((window.FB_CAR || 1) % P.nc) && T.mode === "stopped" ? "#3a2a1a" : C.body, x + P.CL - 29, y + 7, 8, 42); rect(C.body, x + P.CL - 21, y + 7, 8, 42);
        rect("#f2eadc", x + 6, y + 27, 9, 6); ctx.fillStyle = "#1d2228"; ctx.font = "6px monospace"; ctx.fillText(String(c + 1), x + 8, y + 32);
        rect("#20201f", x + 14, y + 52, 18, 4); rect("#20201f", x + P.CL - 32, y + 52, 18, 4);
      }
      var head = T.x - cam;
      if (head + 8 > 0 && head < Wc) { rect(C.roof, head - 8, y + 6, 10, 46); rect(night ? "#fff6c8" : "#e8e0c8", head - 7, y + 40, 4, 4); }
    }
    function person(f, x, y, frame, face, sit) {
      x = Math.round(x); y = Math.round(y); ctx.save(); if (face < 0) { ctx.translate(x * 2, 0); ctx.scale(-1, 1); }
      var lg = frame ? 1 : 0;
      if (sit) { rect(f.bot, x - 3, y - 9, 8, 3); rect(f.skin, x + 4, y - 9, 2, 7); rect("#2a2420", x + 4, y - 2, 3, 2); }
      else if (f.skirt) { rect(f.bot, x - 4, y - 8, 8, 4); rect(f.bot, x - 3, y - 9, 6, 1); rect(f.skin, x - 2 - lg, y - 4, 2, 3); rect(f.skin, x + 1 + lg, y - 4, 2, 3); rect("#2a2420", x - 2 - lg, y - 1, 2, 1); rect("#2a2420", x + 1 + lg, y - 1, 2, 1); }
      else { rect(f.bot, x - 3, y - 9, 6, 3); rect(f.bot, x - 3 - lg, y - 6, 2, 5); rect(f.bot, x + 1 + lg, y - 6, 2, 5); rect("#2a2420", x - 3 - lg, y - 1, 3, 1); rect("#2a2420", x + 1 + lg, y - 1, 3, 1); }
      rect(f.top, x - 3, y - 15, 6, 7); rect(f.skin, x - 4, y - 13 + (frame && !sit ? 0 : 1), 1, 4); rect(f.skin, x + 3, y - 13, 1, 4);
      rect(f.skin, x - 2, y - 19, 4, 4); rect(f.hair, x - 2, y - 20, 4, 2); rect(f.hair, x - 3, y - 19, 1, f.long ? 6 : 2);
      rect("#20160f", x + 1, y - 18, 1, 1);
      if (f.bag) rect(f.bag, x + 4, y - 7, 5, 6);
      ctx.restore();
    }
    function draw() {
      var cam = Math.max(0, Math.min(P.W - Wc, P.x - Wc / 2)); if (P.W < Wc) cam = (P.W - Wc) / 2;
      var g = ctx.createLinearGradient(0, 0, 0, oy + 110); g.addColorStop(0, grey ? mix(SKY[0], "#6c7480", 0.55) : SKY[0]); g.addColorStop(1, grey ? mix(SKY[1], "#9aa2ac", 0.5) : SKY[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, Wc, Hc);
      if (night && !grey) stars.forEach(function (s) { var sx = ((s[0] - cam * 0.05) % Wc + Wc) % Wc; rect(Math.random() < 0.02 ? "#fff" : "#cfd8f0", sx, oy + s[1] - 40, 1, 1); });
      if (!grey && (tod === "afternoon" || tod === "dawn")) { ctx.fillStyle = tod === "dawn" ? "#ffe2b0" : "#fff6d8"; ctx.beginPath(); ctx.arc(Wc * 0.75 - cam * 0.02, oy + (tod === "dawn" ? 70 : 24), 9, 0, 7); ctx.fill(); }
      if (night && !grey) { ctx.fillStyle = "#f4efd8"; ctx.beginPath(); ctx.arc(Wc * 0.8 - cam * 0.02, oy + 20, 7, 0, 7); ctx.fill(); ctx.fillStyle = SKY[0]; ctx.beginPath(); ctx.arc(Wc * 0.8 - cam * 0.02 + 3, oy + 18, 6, 0, 7); ctx.fill(); }
      far(cam);
      var gnd = { snow: "#e8eef2", desert: "#d8a26a", coastal: "#d9c9a0", metropolis: "#6a6e74", hutong: "#7a746a" }[st.biome] || "#6f8f4a";
      rect(night ? mix(gnd, "#0e1424", 0.55) : gnd, 0, oy + 104, Wc, 12);
      rect("#4a4440", 0, oy + 112, Wc, 6); rect("#9a948c", 0, oy + 112, Wc, 1); rect("#9a948c", 0, oy + 116, Wc, 1);
      drawTrain(P.train, cam);
      /* weather in the open, over the track */
      if (wx === "rain" || wx === "storm" || wx === "snow") {
        var t = Date.now() / 1000;
        drops.forEach(function (d) { var x = ((d[0] * Wc + (wx === "snow" ? Math.sin(t + d[1] * 9) * 6 : -t * 30 * d[2])) % Wc + Wc) % Wc, y = oy + 16 + ((d[1] * 100 + t * (wx === "snow" ? 14 : 140) * d[2]) % 102);
          if (wx === "snow") rect("rgba(255,255,255,.9)", x, y, 1, 1); else rect("rgba(200,215,230,.55)", x, y, 1, 3); });
        if (wx === "storm" && Math.random() < 0.004) P.flash = Date.now();
      }
      /* platform */
      rect("#d8c24a", 0, oy + 118, Wc, 3); for (var q = -(cam % 6); q < Wc; q += 6) rect("#b9a33a", q, oy + 119, 2, 1);
      var fl = night ? "#5c5a58" : "#8f8b84"; rect(fl, 0, oy + 121, Wc, Hc - oy - 121);
      for (q = -(cam % 28); q < Wc; q += 28) rect("rgba(0,0,0,.08)", q, oy + 121, 1, Hc - oy - 121);
      rect("rgba(0,0,0,.08)", 0, oy + 150, Wc, 1);
      /* canopy: posts, roof, lamps */
      var ink = st.ink || "#3a3a48";
      for (var k = Math.floor(cam / 200) - 1; k < Math.floor((cam + Wc) / 200) + 2; k++) {
        var x0 = k * 200 - cam; if (k * 200 < -40 || k * 200 > P.W + 40) continue;
        rect("#3a3a40", x0, oy + 14, 3, 136); rect("#2a2a30", x0 - 2, oy + 147, 7, 3);
        var lx = x0 + 100; rect("#2a2a30", lx, oy + 14, 1, 10); rect(night || dusk || grey ? "#ffe6a0" : "#d8d4c8", lx - 3, oy + 24, 7, 3);
        if (night || dusk) { ctx.fillStyle = "rgba(255,220,140,.10)"; ctx.beginPath(); ctx.moveTo(lx - 3, oy + 27); ctx.lineTo(lx - 28, oy + 150); ctx.lineTo(lx + 31, oy + 150); ctx.lineTo(lx + 4, oy + 27); ctx.fill(); }
      }
      rect("#2b2b31", 0, oy + 4, Wc, 10); rect(ink, 0, oy + 12, Wc, 3); rect("rgba(255,255,255,.12)", 0, oy + 4, Wc, 1);
      /* things on the platform */
      P.items.forEach(function (it) {
        var x = it.x - cam; if (x < -80 || x > Wc + 80) return;
        if (it.k === "sign") { rect("#2a2a30", x - 1, oy + 15, 1, 6); rect("#2a2a30", x + 41, oy + 15, 1, 6); rect(ink, x - 6, oy + 21, 54, 14); rect("rgba(255,255,255,.2)", x - 6, oy + 21, 54, 1);
          ctx.fillStyle = "#fff"; ctx.font = "9px VT323, monospace"; ctx.textAlign = "center"; ctx.fillText(st.name.length > 16 ? st.name.slice(0, 15) + "…" : st.name, x + 21, oy + 31); ctx.textAlign = "left"; }
        else if (it.k === "clock") { rect("#2a2a30", x, oy + 15, 1, 6); ctx.fillStyle = "#f4efe2"; ctx.beginPath(); ctx.arc(x + 0.5, oy + 29, 8, 0, 7); ctx.fill(); ctx.strokeStyle = "#2a2a30"; ctx.lineWidth = 1; ctx.stroke();
          var hm = clockHM(), a1 = (hm[0] % 12 + hm[1] / 60) / 12 * Math.PI * 2, a2 = hm[1] / 60 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(x + 0.5, oy + 29); ctx.lineTo(x + 0.5 + Math.sin(a1) * 4, oy + 29 - Math.cos(a1) * 4); ctx.moveTo(x + 0.5, oy + 29); ctx.lineTo(x + 0.5 + Math.sin(a2) * 6, oy + 29 - Math.cos(a2) * 6); ctx.stroke(); }
        else if (it.k === "bench") { rect("#5a3a22", x - 16, oy + 138, 32, 3); rect("#6e4a2c", x - 16, oy + 132, 32, 2); rect("#3a2a1c", x - 14, oy + 141, 2, 7); rect("#3a2a1c", x + 12, oy + 141, 2, 7);
          if (it.cat && P.cat && window.FBWorld && FBWorld.drawPet) FBWorld.drawPet(ctx, P.cat, x + 4, oy + 138, 1, { asleep: !P.sit });
          if (it.dog && P.dog && window.FBWorld && FBWorld.drawPet) FBWorld.drawPet(ctx, "mantou", x + 14, oy + 150, 1, {}); }
        else if (it.k === "kiosk") { rect("#6e4a2c", x - 24, oy + 106, 48, 42); rect("#2a1d14", x - 18, oy + 112, 36, 18); rect(night || dusk ? "#ffd98a" : "#f1e2c2", x - 17, oy + 113, 34, 16);
          for (var s2 = 0; s2 < 8; s2++) rect(s2 % 2 ? "#f4efe2" : "#c8452e", x - 26 + s2 * 6.5, oy + 100, 6.5, 6);
          rect("#5a3a22", x - 12, oy + 115, 3, 1); rect("#5a3a22", x + 8, oy + 115, 4, 1); rect("#7a5a3a", x - 13, oy + 116, 26, 1);   /* a shelf of cups behind */
          person({ skin: "#e0ac83", hair: "#2a1d16", top: "#3f7a4a", bot: "#2a2a34" }, x + 2, oy + 137, 0, 1, false);   /* the keeper, behind the counter */
          rect("#5a3a22", x - 24, oy + 129, 48, 3); rect("#6e4a2c", x - 24, oy + 132, 48, 16); rect("#5a3a22", x - 20, oy + 136, 40, 1);
          rect("#f4efe2", x - 15, oy + 125, 4, 4); rect("#8a5a34", x - 15, oy + 125, 4, 1); rect("#f4efe2", x - 11, oy + 126, 1, 2);   /* a cup on the counter */
          rect("#f4efe2", x - 5, oy + 108, 9, 1); rect("#f4efe2", x - 4, oy + 109, 7, 1); }
        else if (it.k === "board") { rect("#2a2a30", x - 18, oy + 128, 2, 20); rect("#2a2a30", x + 16, oy + 128, 2, 20); rect("#141418", x - 24, oy + 100, 48, 30); rect("#2a2a30", x - 24, oy + 100, 48, 2);
          for (var r = 0; r < 4; r++) for (var cx = 0; cx < 9; cx++) if ((cx * 7 + r * 3 + ((Date.now() / 700) | 0)) % 5) rect(r === 0 ? "#ffd27a" : "#e8a838", x - 20 + cx * 4.6, oy + 105 + r * 6, 3, 2); }
        else if (it.k === "plant") { rect("#7a5a3a", x - 10, oy + 138, 20, 10); var fc = ["#e85a6a", "#f2c94c", "#f4efe2", "#a86ad8"]; for (var p = 0; p < 7; p++) { rect("#3f7a4a", x - 8 + p * 2.6, oy + 131 + (p % 2) * 2, 1, 7); rect(fc[p % 4], x - 9 + p * 2.6, oy + 129 + (p % 2) * 2, 3, 3); } }
        else if (it.k === "exit") {   /* a green sign and stairs down to the path */
          var lbl = it.ex.map(pname).join(" · "); ctx.font = "9px VT323, monospace"; var tw = Math.max(44, Math.ceil(ctx.measureText(lbl).width) + 18);
          rect("#3a3a40", x - 1, oy + 96, 3, 52); rect("#2e6a4a", x - tw / 2, oy + 94, tw, 16); rect("rgba(255,255,255,.22)", x - tw / 2, oy + 94, tw, 1);
          ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(lbl + " ›", x, oy + 105); ctx.textAlign = "left";
          rect("#3a3632", x + 26, oy + 126, 44, 22); for (var sx = 0; sx < 5; sx++) { rect("#7a766f", x + 28 + sx * 8, oy + 128 + sx * 4, 40 - sx * 8, 1); rect("#57524c", x + 28 + sx * 8, oy + 129 + sx * 4, 40 - sx * 8, 3); }
          rect("#c9b48a", x + 24, oy + 118, 2, 30); rect("#c9b48a", x + 24, oy + 118, 46, 1); rect("#c9b48a", x + 68, oy + 118, 2, 30); }
      });
      /* travellers */
      P.folks.forEach(function (f) { var x = f.x - cam; if (x > -20 && x < Wc + 20) person(f.f, x, oy + 150, 0, ((Date.now() / 1000 + f.t) % 11) < 1.2 ? -f.face : f.face, false); });
      /* you */
      var yx = P.x - cam, sitting = !!P.sit;
      person(me, yx, oy + (sitting ? 147 : 162), P.vx ? ((P.step / 6) | 0) % 2 : 0, P.face, sitting);
      if (drink && drink.lv > 0 && !sitting) rect(DR[drink.k].c, yx + (P.face > 0 ? 4 : -6), oy + 149, 2, 3);
      if (P.heart && Date.now() - P.heart < 1600) { var hy = oy + 128 - (Date.now() - P.heart) / 60; ctx.fillStyle = "#ff8fa0"; ctx.font = "8px VT323, monospace"; ctx.fillText("♥", yx + 6, hy); }
      if (P.flash && Date.now() - P.flash < 120) { ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(0, 0, Wc, Hc); }
    }
    function clockHM() {
      var base = { dawn: [5, 48], afternoon: [14, 15], sunset: [17, 42], night: [2, 14] }[tod] || [17, 42], m = base[1] + Math.floor((Date.now() - P.t0) / 60000);
      return [base[0] + Math.floor(m / 60), m % 60];
    }

    /* ---------- the loop ---------- */
    var last = performance.now();
    function frame(now) {
      if (!P.on || P.el !== el) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var d = hold || (keys.r ? 1 : keys.l ? -1 : 0);
      if (P.sit) d = 0;
      P.vx = d * 64; if (d) { P.face = d; P.step += dt * 60; }
      P.x = Math.max(16, Math.min(P.W - 16, P.x + P.vx * dt));
      P.folks.forEach(function (f) { if (Math.random() < 0.002) f.face = -f.face; });
      /* trains */
      var T = P.train;
      if (T) {
        if (T.mode === "stopped" && T.mine) {
          var left = P.leaveAt - Date.now();
          if (left < 15e3 && !P.warned) { P.warned = true; ding(); P.say(w("soon")); }
          if (left <= 0) { T.mode = "out"; }
        }
        if (T.mode === "out") { T.v = Math.min(260, (T.v || 0) + 60 * dt); T.x += T.v * dt;
          if (T.x > P.W + 40) { var wasMine = T.mine; P.train = null; if (wasMine) { back.hidden = true; if (!P.queue) P.say(w("gone")); } if (P.queue) { var q = P.queue; P.queue = null; setTimeout(function () { arrive(q); }, reduce ? 300 : 1800); } } }
        else if (T.mode === "in") { var dist = T.stop - T.x; T.v = Math.max(14, Math.min(320, dist * 1.4)); T.x = Math.min(T.stop, T.x + T.v * dt); if (T.stop - T.x < 0.5) { T.x = T.stop; T.mode = "stopped"; chime(); P.say("🚃 " + w("bound", { s: T.to.name })); } }
      } else if (P.queue) { var q2 = P.queue; P.queue = null; arrive(q2); }
      cur = nearest();
      back.hidden = !(P.train && P.train.mine && P.train.mode === "stopped") || (cur && cur.a === "aboard");
      if (cur) { if (actBtn._l !== cur.label) { actBtn._l = cur.label; actBtn.textContent = cur.label; } actBtn.hidden = false; actBtn.classList.toggle("pri", !!cur.pri); }
      else actBtn.hidden = true;
      draw();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function closePlatform(then) {
    var el = P.el; if (!el) return; P.on = false; try { P.cleanup(); removeEventListener("resize", P.resize); } catch (e) {}
    document.querySelectorAll(".jn-sheet").forEach(function (s) { s.remove(); });
    el.classList.remove("on"); el.classList.add("fade"); musicLow(false);
    setTimeout(function () { el.remove(); }, 600); if (then) setTimeout(then, 250);
  }
  function reboard() {
    closePlatform(function () { var d = FBCabin.director; try { d.start(); d.next.depart = Date.now() + 5000; } catch (e) {} });
  }
  function boardNew(T) {
    var to = T.to, k = T.k;
    closePlatform(function () {
      var C = window.FBCabin;
      try { C.seat(1 + Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 40)); } catch (e) {}
      setCoach(k);
      try {
        if (state.inTunnel) toggleMountainTunnel();
        state.station = to; setBiome(to.biome, false);
        state.trainState = "CRUISING"; state.speed = 1; state.stationScrollOffset = -cw * 6;
        syncHUDAndButtons(); if (typeof updateTrainStateHUD === "function") updateTrainStateHUD();
        var cab = $("cabinContainer"); if (cab) cab.classList.remove("cabin-stopped");
      } catch (e) {}
      try { var d = C.director; d.start(); d.next.station = Date.now() + 45e3 + Math.random() * 35e3; d.next.depart = 0; } catch (e) {}
      try { C.toast("🚃 " + w("bound", { s: to.name })); } catch (e) {}
      paintCup();
    });
  }

  /* ---------- the ticket says where you are ---------- */
  function ticket() {
    var t = document.querySelector(".cb-ticket"); if (!t || t._jn) return; t._jn = 1;
    var sm = t.querySelector("small"), h = t.querySelector("h1");
    if (sm) sm.textContent = w("car", { c: String(window.FB_CAR || 1).padStart(2, "0") });
    if (h && !/🎟/.test(h.textContent)) h.textContent = w("app");
    var p = document.createElement("p"); p.className = "jn-tlead"; p.textContent = w("lead"); if (h) h.after(p);
  }

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent =
    "html.cb-app #cbCord{display:none!important}" +
    ".jn-tlead{max-width:20rem;margin:2px auto 14px!important;font:15px/1.5 Georgia,'Songti SC',serif;opacity:.75;color:#2a1a10}" +
    "#jnCup{position:absolute;z-index:44;left:6%;bottom:2px;width:clamp(40px,6.5vw,70px);height:clamp(40px,6.5vw,70px);padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(0 3px 3px rgba(0,0,0,.45));transform-origin:50% 100%}" +
    "#jnCup[hidden]{display:none}#jnCup svg{width:100%;height:100%;overflow:visible}#jnCup.sip{animation:jnSip .7s ease}@keyframes jnSip{40%{transform:translateY(-14%) rotate(-12deg)}}" +
    ".jn-steam path{animation:jnSteam 3s ease-in-out infinite;opacity:0}.jn-steam path:nth-child(2){animation-delay:1s}.jn-steam path:nth-child(3){animation-delay:2s}@keyframes jnSteam{0%{opacity:0;transform:translateY(2px)}40%{opacity:1}100%{opacity:0;transform:translateY(-4px)}}" +
    "#jnCup:focus-visible{outline:2px solid #f6b73c;outline-offset:2px;border-radius:8px}" +
    /* the app's frame: the station's old header, panels, pills and dock give way to one top bar and one bottom bar */
    "html.cb-app body.cb-on .cb-dock,html.cb-app body.cb-on .cb-tip,html.cb-app #glassWipePill,html.cb-app #windowLatchBtn,html.cb-app #zenFloatingControls,html.cb-app #portraitBanner{display:none!important}" +
    "html.cb-app body.cb-on #cabinContainer{padding-top:calc(var(--jnT,64px) + 10px)!important;padding-bottom:calc(var(--jnB,72px) + 10px)!important}" +
    ".jn-topbar,.jn-dock{position:fixed;left:50%;transform:translateX(-50%);z-index:70;width:min(760px,calc(100vw - 16px));box-sizing:border-box;color:#f5e6c8;background:rgba(24,17,13,.86);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,230,190,.14);font-family:system-ui,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif}" +
    ".jn-topbar[hidden],.jn-dock[hidden]{display:none}" +
    ".jn-topbar{top:max(8px,env(safe-area-inset-top));display:flex;align-items:center;gap:8px;padding:8px 8px 8px 16px;border-radius:18px}" +
    ".jn-where{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}.jn-stn{font:400 20px/1.15 Georgia,'Songti SC','Noto Serif CJK SC',serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".jn-status{font-size:12.5px;line-height:1.3;opacity:.72;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".jn-seats .cb-seats{padding:0 4px}.jn-seats:empty{display:none}" +
    ".jn-do{flex:none;min-height:40px;padding:0 16px;border-radius:999px;border:1px solid rgba(245,230,200,.45);background:transparent;color:inherit;font:600 14px/1 system-ui,-apple-system,sans-serif;cursor:pointer;white-space:nowrap}.jn-do[hidden]{display:none}" +
    ".jn-do.pri{background:#f5c27a;border-color:#f5c27a;color:#2a1a10;animation:jnGlow 2.4s ease-in-out infinite}@keyframes jnGlow{50%{box-shadow:0 0 0 6px rgba(245,194,122,.2)}}" +
    ".jn-ic{flex:none;display:grid;place-items:center;width:40px;height:40px;padding:0;box-sizing:border-box;border-radius:50%;border:1px solid rgba(245,230,200,.25);background:transparent;color:inherit;font:600 16px/1 system-ui,sans-serif;cursor:pointer}.jn-ic svg{display:block;margin:0}" +
    ".jn-do:hover,.jn-ic:hover,.jn-do:focus-visible,.jn-ic:focus-visible{border-color:#f5e6c8;outline:none}" +
    ".jn-dock{bottom:max(8px,env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(5,1fr);gap:2px;padding:6px;border-radius:20px}" +
    ".jn-dock button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:54px;padding:4px 2px;border:0;border-radius:14px;background:transparent;color:inherit;cursor:pointer;font:500 12px/1.15 system-ui,-apple-system,'PingFang SC',sans-serif;min-width:0}" +
    ".jn-dock button i{font-style:normal;line-height:0}.jn-dock button svg{width:22px;height:22px}.jn-ic svg{width:18px;height:18px}.jn-ib svg{width:38px;height:38px}.jn-dock button span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85}" +
    ".jn-dock button:hover,.jn-dock button:focus-visible{background:rgba(255,230,190,.12);outline:none}" +
    ".jn-hl{box-shadow:0 0 0 3px #f5c27a,0 0 22px rgba(245,194,122,.55)!important;border-radius:14px;position:relative;z-index:2}#windowViewport.jn-hl{border-radius:inherit}" +
    ".jn-intro{position:fixed;inset:0;z-index:110;display:grid;place-items:center;padding:calc(var(--jnT,64px) + 16px) 16px calc(var(--jnB,72px) + 16px);pointer-events:none}" +
    ".jn-icard{pointer-events:auto;width:min(22rem,calc(100vw - 32px));box-sizing:border-box;padding:20px 20px 16px;border-radius:20px;background:#f8efe0;color:#2a1a10;text-align:center;box-shadow:0 24px 70px -20px #000;font:15px/1.5 system-ui,-apple-system,sans-serif}" +
    ".jn-icard h2{margin:6px 0 4px;font:400 22px/1.2 Georgia,'Songti SC',serif}.jn-icard p{margin:0 0 12px;opacity:.82}.jn-ib{display:flex;justify-content:center;line-height:0;color:#8a5a2b}" +
    ".jn-dots{display:flex;justify-content:center;gap:6px;margin:0 0 12px}.jn-dots i{width:7px;height:7px;border-radius:50%;background:rgba(42,26,16,.22)}.jn-dots i.on{background:#2a1a10}" +
    ".jn-irow{display:flex;gap:8px}.jn-irow button{flex:1;min-height:44px;border-radius:999px;border:1.5px solid #2a1a10;background:transparent;color:inherit;font:600 14px system-ui,sans-serif;cursor:pointer}.jn-irow button.pri{background:#2a1a10;color:#f8efe0}" +
    ".jn-h{margin:12px 0 6px;font:600 11px/1.2 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;opacity:.6}" +
    ".jn-chips{display:flex;flex-wrap:wrap;gap:6px}.jn-chip{flex:none!important;min-height:38px!important;padding:0 14px!important;display:inline-flex!important;align-items:center!important;justify-content:center;line-height:1!important;gap:6px;border-radius:999px!important;border:1.5px solid rgba(42,26,16,.2)!important;font:500 14px system-ui,sans-serif!important}" +
    ".jn-chip i{font-style:normal}.jn-chip.on{background:#2a1a10!important;color:#f8efe0!important;border-color:#2a1a10!important}" +
    ".jn-wide{display:block;width:100%;min-height:44px;margin:12px 0 4px;border-radius:999px;border:1.5px solid rgba(42,26,16,.35);background:transparent;font:600 14px system-ui,sans-serif;color:inherit;cursor:pointer}" +
    "@media (max-width:380px){.jn-stn{font-size:18px}.jn-do{padding:0 12px;font-size:13px}.jn-dock button{font-size:11px}.jn-topbar{padding-left:12px}}" +
    "@media (max-height:500px){.jn-topbar{padding:5px 6px 5px 14px}.jn-stn{font-size:17px}.jn-status{font-size:11.5px}.jn-dock button{min-height:42px;flex-direction:row;gap:6px}.jn-dock button svg{width:19px;height:19px}.jn-dock{padding:4px}}" +
    "@media (prefers-color-scheme:dark){.jn-icard{background:#1f1915;color:#f2e8d8}.jn-irow button{border-color:#f2e8d8}.jn-irow button.pri{background:#f2e8d8;color:#1f1915}.jn-dots i{background:rgba(242,232,216,.25)}.jn-dots i.on{background:#f2e8d8}.jn-chip.on{background:#f2e8d8!important;color:#1f1915!important;border-color:#f2e8d8!important}.jn-chip,.jn-wide{border-color:rgba(242,232,216,.3)!important}}" +
    ".jn-sheet{z-index:120}.jn-lead{margin:0 0 12px;opacity:.75;text-align:center}" +
    ".jn-drs,.jn-recs{display:grid;gap:6px;max-height:52vh;overflow:auto}" +
    ".jn-dr,.jn-rec{display:flex!important;align-items:center;gap:12px;width:100%;min-height:48px!important;padding:6px 14px!important;border-radius:14px!important;text-align:left;border:1.5px solid rgba(42,26,16,.18)!important;font:500 15px/1.25 system-ui,-apple-system,sans-serif!important}" +
    ".jn-dr:hover,.jn-rec:hover,.jn-dr:focus-visible,.jn-rec:focus-visible{border-color:currentColor!important;outline:none}" +
    ".jn-dc{width:34px;height:34px;flex:none;background:#3a2a20;border-radius:10px;display:grid;place-items:center}.jn-dc svg{width:30px;height:30px}.jn-dr em{font:600 11px system-ui;font-style:normal;padding:1px 7px;border-radius:999px;background:#f5c27a;color:#2a1a10;margin-left:4px}" +
    ".jn-rec b{width:20px;text-align:center;opacity:.7}.jn-rec span{flex:1}.jn-rec small{font:11px ui-monospace,Menlo,monospace;opacity:.55}.jn-rec.on{background:rgba(245,194,122,.25)!important}" +
    ".jn-plat{position:fixed;inset:0;z-index:95;background:#0b0b0e;opacity:0;transition:opacity .6s;touch-action:none;overscroll-behavior:none;user-select:none;-webkit-user-select:none}.jn-plat.on{opacity:1}.jn-plat.fade{opacity:0}" +
    ".jn-plat canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;cursor:pointer}" +
    ".jn-top{position:absolute;top:max(10px,env(safe-area-inset-top));left:max(10px,env(safe-area-inset-left));right:max(10px,env(safe-area-inset-right));display:flex;justify-content:space-between;align-items:flex-start;gap:8px;pointer-events:none}" +
    ".jn-chip{display:flex;flex-direction:column;padding:6px 12px;border-radius:12px;background:rgba(20,16,14,.6);color:#f5e6c8;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);max-width:60vw}.jn-chip b{font:400 20px/1.1 VT323,Georgia,serif}.jn-chip small{font:13px/1.2 VT323,ui-monospace,monospace;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".jn-back{pointer-events:auto;min-height:40px;padding:0 14px;border-radius:999px;border:1px solid rgba(245,230,200,.35);background:rgba(20,16,14,.6);color:#f5e6c8;font:600 14px system-ui,-apple-system,sans-serif;cursor:pointer}.jn-back[hidden]{display:none}" +
    ".jn-ctl{position:absolute;left:0;right:0;bottom:max(14px,env(safe-area-inset-bottom));display:flex;justify-content:space-between;align-items:center;gap:10px;padding:0 max(12px,env(safe-area-inset-left));pointer-events:none}" +
    ".jn-arr{pointer-events:auto;width:54px;height:54px;flex:none;border-radius:50%;border:2px solid rgba(245,230,200,.35);background:rgba(20,16,14,.45);color:#f5e6c8;font:400 30px/1 system-ui;cursor:pointer;touch-action:none}" +
    ".jn-act{pointer-events:auto;min-height:48px;max-width:calc(100vw - 150px);padding:0 20px;border-radius:999px;border:2px solid #f5e6c8;background:rgba(248,239,224,.95);color:#2a1a10;font:600 15px/1.2 system-ui,-apple-system,sans-serif;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 8px 24px -8px #000}" +
    ".jn-act.pri{background:#f5c27a;border-color:#f5c27a}.jn-act[hidden]{visibility:hidden;display:block}" +
    ".jn-say{position:absolute;left:50%;top:max(70px,calc(env(safe-area-inset-top) + 64px));transform:translateX(-50%);max-width:min(86vw,520px);padding:6px 14px;border-radius:12px;background:rgba(20,16,14,.65);color:#f5e6c8;font:18px/1.3 VT323,ui-monospace,monospace;text-align:center;opacity:0;pointer-events:none}.jn-say.on{animation:jnSay 4.5s ease forwards}@keyframes jnSay{8%,80%{opacity:1}100%{opacity:0}}" +
    ".jn-hint{position:absolute;left:50%;bottom:calc(max(14px,env(safe-area-inset-bottom)) + 62px);transform:translateX(-50%);color:#f5e6c8;font:18px VT323,monospace;opacity:.8;transition:opacity 1s;pointer-events:none;text-shadow:0 1px 4px #000}.jn-hint.off{opacity:0}" +
    ".jn-dsheet .cb-card{background:#141418;color:#f2c56a}.jn-dsheet .cb-card button[data-x]{border-color:#f2c56a;color:#f2c56a}.jn-dsheet .jn-lead{color:#f5e6c8;margin-top:12px}" +
    ".jn-brd{font:20px/1.1 VT323,ui-monospace,monospace;letter-spacing:.02em}.jn-bh{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding-bottom:6px;border-bottom:1px solid rgba(242,197,106,.3);margin-bottom:6px}.jn-bh b{font:400 13px 'Press Start 2P',VT323,monospace;color:#ffd27a}.jn-bh span{font-size:16px;opacity:.7;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".jn-bc,.jn-dep{display:grid!important;grid-template-columns:1fr auto 34px;gap:10px;align-items:center}.jn-bc{font-size:14px;opacity:.55;padding:0 10px 4px}" +
    ".jn-dep{width:100%;min-height:46px!important;padding:6px 10px!important;margin:3px 0;border-radius:6px!important;border:1px solid rgba(242,197,106,.22)!important;background:#1c1c22!important;color:#f2c56a!important;font:20px/1.1 VT323,ui-monospace,monospace!important;text-align:left}" +
    ".jn-dep:hover,.jn-dep:focus-visible{background:#2a2418!important;border-color:#f2c56a!important;outline:none}.jn-to{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.jn-to i{font-style:normal}.jn-via{font-size:15px;opacity:.75}.jn-pf{text-align:center;border:1px solid rgba(242,197,106,.5);border-radius:4px}" +
    "@media (orientation:portrait){.jn-act{font-size:14px;padding:0 14px}.jn-arr{width:48px;height:48px}}" +
    "@media (prefers-color-scheme:dark){.jn-dr,.jn-rec{border-color:rgba(242,232,216,.2)!important}.jn-tlead{color:#2a1a10}}" +
    "@media (prefers-reduced-motion:reduce){.jn-do.pri,.jn-steam path{animation:none}.jn-steam path{opacity:.6}}";
  document.head.appendChild(css);

  /* ---------- wire up ---------- */
  addEventListener("load", function () {
    try { if (!state.zenMode) toggleZenMode(); } catch (e) {}   /* the clean window from the start: the app draws its own bars */
    setTimeout(ticket, 0);
    setInterval(function () {
      if (!window.FBCabin) return;
      if (FBCabin.S.boarded) { buildUI(); paintCup(); if (!intro.t) intro.t = setTimeout(function () { intro(false); }, 1200); }
      paintUI();
    }, 400);
  });
  window.FBJourney = { getOff: getOff, trolley: trolley, records: records, sky: sky, intro: intro, pour: pour, reserve: reserve, platform: function () { return P; } };   /* also a test hook */
})();
