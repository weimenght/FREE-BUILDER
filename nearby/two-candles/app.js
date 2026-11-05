/* Two Candles, the standalone app (freebuilder.net/two-candles/ → this page with ?solo=1&app=1).
   The town's table is the one source of truth: its line between two tables (relay topic fbtable-<code> through
   FBWorld.rtUrl/rtGood/rtPriv), its recipes, its cards and its candlelit picture (window.FBTable in index.html).
   This file draws the app around it: book a day that each of you sees in your own time, a .ics for each of you
   (made on the device), the same recipe with a shopping list each of you ticks alone, the table itself
   (candles that catch together, cooking step by step, a glass, cards, a napkin; the screen stays on), and after dinner
   "Book the next one" and one line that sends you off the screen. Nothing is counted and nothing is kept on a server:
   a booking travels only inside its link (after the #), and everything else stays on this device. In town (no app=1)
   this file is never loaded. */
(function () {
  "use strict";
  if (!/[?&]app=1/.test(location.search) || !window.FBTable) return;
  var T = window.FBTable, de = document.documentElement;
  de.classList.add("tc-app");

  /* the address bar belongs to the app page around this frame (freebuilder.net/two-candles/) */
  var HOST = window; try { if (window.parent !== window && window.parent.location.pathname) HOST = window.parent; } catch (e) {}
  var BASE = location.origin + "/two-candles/";

  /* ---------- words, five languages: en, 简, 繁, es, ca ---------- */
  var LI = { en: 0, zh: 1, "zh-Hant": 2, es: 3, ca: 4 }, LOC = ["en-GB", "zh-CN", "zh-TW", "es-ES", "ca-ES"], LANG = ["en", "zh-Hans", "zh-Hant", "es", "ca"];
  function li() { var l = (window.FBL && FBL.get && FBL.get()) || "en"; return LI[l] || 0; }
  function w(k, v) { var a = W[k]; var s = a ? (a[li()] || a[0]) : k; if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]); return s; }
  var W = {
    app: ["Two Candles", "双烛小馆", "雙燭小館", "Dos Velas", "Dues Espelmes"],
    lede: ["Dinner for two, however far apart.", "两个人的晚饭，再远也一起吃。", "兩個人的晚飯，再遠也一起吃。", "Una cena para dos, por lejos que estéis.", "Un sopar per a dos, per lluny que sigueu."],
    lede2: ["Pick a day, shop for the same dinner, then sit down together from wherever you are. It ends with the candles out and the phone down.", "约一个日子，买同一顿饭的菜，然后各自在自己的地方一起坐下。最后吹灭蜡烛，放下手机。", "約一個日子，買同一頓飯的菜，然後各自在自己的地方一起坐下。最後吹熄蠟燭，放下手機。", "Elegid un día, comprad para la misma cena y sentaos juntos desde donde estéis. Termina con las velas apagadas y el móvil en la mesa.", "Trieu un dia, compreu per al mateix sopar i seieu junts des d'on sigueu. Acaba amb les espelmes apagades i el mòbil a la taula."],
    book: ["Book a table", "订一张桌子", "訂一張桌子", "Reserva una mesa", "Reserva una taula"],
    yourName: ["Your name", "你的名字", "你的名字", "Tu nombre", "El teu nom"],
    day: ["Day", "日子", "日子", "Día", "Dia"], time: ["Time, yours", "时间（你那边）", "時間（你那邊）", "Hora, la tuya", "Hora, la teva"],
    dinner: ["What you'll both cook", "你们俩要做的菜", "你們倆要做的菜", "Qué cocinaréis los dos", "Què cuinareu tots dos"],
    theirTime: ["They'll see it in their own time.", "对方会看到自己那边的时间。", "對方會看到自己那邊的時間。", "Lo verán en su propia hora.", "Ho veuran a la seva pròpia hora."],
    forThem: ["For {p}: {t}.", "{p}那边：{t}。", "{p}那邊：{t}。", "Para {p}: {t}.", "Per a {p}: {t}."],
    bookIt: ["Book the table", "订下这张桌子", "訂下這張桌子", "Reservar la mesa", "Reservar la taula"],
    now: ["Or sit down right now", "或者现在就坐下", "或者現在就坐下", "O sentaos ahora mismo", "O seieu ara mateix"],
    today: ["Today", "今天", "今天", "Hoy", "Avui"], tomorrow: ["Tomorrow", "明天", "明天", "Mañana", "Demà"],
    tables: ["Your tables", "你的桌子", "你的桌子", "Tus mesas", "Les teves taules"],
    open: ["Open", "打开", "打開", "Abrir", "Obrir"],
    haveLink: ["Got an invitation? Paste the link here.", "收到邀请了？把链接贴在这里。", "收到邀請了？把連結貼在這裡。", "¿Te han invitado? Pega el enlace aquí.", "T'han convidat? Enganxa l'enllaç aquí."],
    badLink: ["That doesn't look like a table's link.", "这看起来不像桌子的链接。", "這看起來不像桌子的連結。", "Eso no parece el enlace de una mesa.", "Això no sembla l'enllaç d'una taula."],
    kTable: ["A table for two", "双人桌", "雙人桌", "Mesa para dos", "Taula per a dos"],
    yourTime: ["your time", "你那边的时间", "你那邊的時間", "tu hora", "la teva hora"],
    bookedBy: ["{p} booked you a table.", "{p}给你订了一张桌子。", "{p}給你訂了一張桌子。", "{p} te ha reservado mesa.", "{p} t'ha reservat taula."],
    youBooked: ["You booked it. Send them the invitation.", "你订好了。把邀请发给对方吧。", "你訂好了。把邀請傳給對方吧。", "Ya está reservada. Mándale la invitación.", "Ja està reservada. Envia-li la invitació."],
    invite: ["Send the invitation", "发送邀请", "傳送邀請", "Enviar la invitación", "Enviar la invitació"],
    inviteText: ["I booked us a table at Two Candles: {when} your time. We'll both cook {dish}.", "我在双烛小馆给我们订了桌子：你那边 {when}。我们都做{dish}。", "我在雙燭小館給我們訂了桌子：你那邊 {when}。我們都做{dish}。", "Nos he reservado mesa en Dos Velas: {when}, tu hora. Cocinaremos {dish} los dos.", "Ens he reservat taula a Dues Espelmes: {when}, la teva hora. Cuinarem {dish} tots dos."],
    inviteNow: ["Come and sit at my table at Two Candles. Same dinner, two kitchens.", "来双烛小馆，坐到我这张桌子上。同一顿饭，两个厨房。", "來雙燭小館，坐到我這張桌子上。同一頓飯，兩個廚房。", "Ven a sentarte a mi mesa en Dos Velas. La misma cena, dos cocinas.", "Vine a seure a la meva taula a Dues Espelmes. El mateix sopar, dues cuines."],
    copied: ["Link copied", "链接已复制", "連結已複製", "Enlace copiado", "Enllaç copiat"],
    ics: ["Add to my calendar", "加到我的日历", "加到我的行事曆", "Añadir a mi calendario", "Afegir al meu calendari"],
    icsNote: ["Made on this device, in your own time.", "在这台设备上生成，按你的时间。", "在這台裝置上產生，按你的時間。", "Hecho en este dispositivo, en tu hora.", "Fet en aquest dispositiu, a la teva hora."],
    icsTitle: ["Two Candles · dinner with {p}", "双烛小馆 · 和{p}吃晚饭", "雙燭小館 · 和{p}吃晚飯", "Dos Velas · cena con {p}", "Dues Espelmes · sopar amb {p}"],
    icsTitle0: ["Two Candles · dinner for two", "双烛小馆 · 双人晚饭", "雙燭小館 · 雙人晚飯", "Dos Velas · cena para dos", "Dues Espelmes · sopar per a dos"],
    icsDesc: ["We'll both cook {dish}. Our table: {u}", "我们都做{dish}。我们的桌子：{u}", "我們都做{dish}。我們的桌子：{u}", "Cocinaremos {dish} los dos. Nuestra mesa: {u}", "Cuinarem {dish} tots dos. La nostra taula: {u}"],
    icsAlarm: ["Two Candles in half an hour. Light a candle.", "半小时后双烛小馆见。点一支蜡烛吧。", "半小時後雙燭小館見。點一支蠟燭吧。", "Dos Velas en media hora. Enciende una vela.", "Dues Espelmes d'aquí a mitja hora. Encén una espelma."],
    shop: ["Before dinner: the shopping", "饭前：买菜", "飯前：買菜", "Antes de cenar: la compra", "Abans de sopar: la compra"],
    shopNote: ["Tick it off on your own. Nothing is shared: they have the same list in their kitchen.", "自己勾自己的。什么都不共享：对方厨房里有同一张单子。", "自己勾自己的。什麼都不共享：對方廚房裡有同一張單子。", "Táchalo a tu aire. No se comparte nada: tienen la misma lista en su cocina.", "Ratlla-ho al teu aire. No es comparteix res: tenen la mateixa llista a la seva cuina."],
    other: ["Cook something else", "换一道菜", "換一道菜", "Cocinar otra cosa", "Cuinar una altra cosa"],
    resend: ["New dish: send them the new invitation so you shop for the same dinner.", "换了菜：把新的邀请发给对方，好买同一顿饭的菜。", "換了菜：把新的邀請傳給對方，好買同一頓飯的菜。", "Plato nuevo: mándale la nueva invitación para comprar lo mismo.", "Plat nou: envia-li la nova invitació per comprar el mateix."],
    sit: ["Sit down at the table", "入座", "入座", "Sentarse a la mesa", "Seure a la taula"],
    notThis: ["Take it off this device", "从这台设备上删掉", "從這台裝置上刪掉", "Quitarla de este dispositivo", "Treure-la d'aquest dispositiu"],
    passed: ["This one has been and gone. Sit down anyway, or book the next.", "这一桌的时间已经过了。照样可以坐下，或者订下一次。", "這一桌的時間已經過了。照樣可以坐下，或者訂下一次。", "Esta ya pasó. Sentaos igualmente o reservad la próxima.", "Aquesta ja ha passat. Seieu igualment o reserveu la propera."],
    empty: ["empty chair", "空椅子", "空椅子", "silla vacía", "cadira buida"], you: ["You", "你", "你", "Tú", "Tu"], date: ["Your date", "你的约会对象", "你的約會對象", "Tu cita", "La teva cita"],
    waiting: ["Waiting for {p}. Their candle is on the table.", "等{p}。对方的蜡烛已经摆好了。", "等{p}。對方的蠟燭已經擺好了。", "Esperando a {p}. Su vela ya está en la mesa.", "Esperant {p}. La seva espelma ja és a la taula."],
    waiting0: ["Send the link. Their candle is on the table.", "把链接发过去。对方的蜡烛已经摆好了。", "把連結傳過去。對方的蠟燭已經擺好了。", "Manda el enlace. Su vela ya está en la mesa.", "Envia l'enllaç. La seva espelma ja és a la taula."],
    light: ["Light your candle", "点亮你的蜡烛", "點亮你的蠟燭", "Enciende tu vela", "Encén la teva espelma"],
    lightNote: ["They catch when you've both struck a match.", "两个人都划了火柴，蜡烛才会一起亮。", "兩個人都劃了火柴，蠟燭才會一起亮。", "Prenden cuando los dos hayáis encendido la cerilla.", "S'encenen quan tots dos hàgiu encès el llumí."],
    lightWait: ["Your match is struck. Waiting for {p}.", "你的火柴划好了。等{p}。", "你的火柴劃好了。等{p}。", "Tu cerilla está encendida. Esperando a {p}.", "El teu llumí és encès. Esperant {p}."],
    theyLit: ["{p} struck a match. Light yours.", "{p}划了火柴。点亮你的吧。", "{p}劃了火柴。點亮你的吧。", "{p} ha encendido la cerilla. Enciende la tuya.", "{p} ha encès el llumí. Encén el teu."],
    lit: ["Both candles are lit.", "两支蜡烛都亮了。", "兩支蠟燭都亮了。", "Las dos velas encendidas.", "Les dues espelmes enceses."],
    sat: ["{p} sat down.", "{p}坐下了。", "{p}坐下了。", "{p} se ha sentado.", "{p} s'ha assegut."],
    left: ["{p} stepped away.", "{p}暂时离开了。", "{p}暫時離開了。", "{p} se ha levantado.", "{p} s'ha aixecat."],
    tCook: ["Cook", "做饭", "做飯", "Cocinar", "Cuinar"], tGlass: ["A glass", "举杯", "舉杯", "Brindar", "Brindar"], tTalk: ["Talk", "聊天", "聊天", "Hablar", "Parlar"], tNote: ["Napkin", "餐巾", "餐巾", "Servilleta", "Tovalló"], tRoom: ["Room", "房间", "房間", "Sala", "Sala"], tEnd: ["Goodnight", "晚安", "晚安", "Buenas noches", "Bona nit"],
    pick: ["Pick the dinner you'll both cook.", "挑一道你们俩都要做的菜。", "挑一道你們倆都要做的菜。", "Elegid la cena que cocinaréis los dos.", "Trieu el sopar que cuinareu tots dos."],
    need: ["What you need", "要准备的", "要準備的", "Lo que necesitas", "El que necessites"],
    done: ["Done", "做好了", "做好了", "Hecho", "Fet"], waitP: ["waiting for {p}", "等{p}", "等{p}", "esperando a {p}", "esperant {p}"],
    serve: ["Dinner is served. Eat together, slowly.", "开饭了。一起慢慢吃。", "開飯了。一起慢慢吃。", "La cena está servida. Comed juntos, sin prisa.", "El sopar és a taula. Mengeu junts, sense pressa."],
    raise: ["Raise your glass", "举起你的杯子", "舉起你的杯子", "Levanta tu copa", "Aixeca la copa"],
    raised: ["You raised your glass.", "你举起了杯子。", "你舉起了杯子。", "Has levantado la copa.", "Has aixecat la copa."],
    theyRaised: ["{p} raised a glass to you.", "{p}向你举杯。", "{p}向你舉杯。", "{p} brinda por ti.", "{p} brinda per tu."],
    clinked: ["Clink.", "叮。", "叮。", "Chin chin.", "Txin-txin."],
    another: ["Another card", "再抽一张", "再抽一張", "Otra carta", "Una altra carta"],
    napkin: ["Write on a napkin", "在餐巾上写几个字", "在餐巾上寫幾個字", "Escribe en una servilleta", "Escriu en un tovalló"],
    slide: ["Slide it across", "推到对面", "推到對面", "Pásala al otro lado", "Passa-la a l'altre costat"],
    slid: ["Slid across the table.", "已经推到对面了。", "已經推到對面了。", "Ya está al otro lado.", "Ja és a l'altre costat."],
    from: ["from {p}", "来自{p}", "來自{p}", "de {p}", "de {p}"], keep: ["Keep it", "收好", "收好", "Guardarla", "Guardar-lo"],
    view: ["Through the window", "窗外", "窗外", "Por la ventana", "Per la finestra"], music: ["Music box", "音乐盒", "音樂盒", "Caja de música", "Capsa de música"],
    on: ["On", "开", "開", "Sí", "Sí"], off: ["Off", "关", "關", "No", "No"],
    endText: ["Blow out both candles together.", "一起吹灭两支蜡烛。", "一起吹熄兩支蠟燭。", "Apagad las dos velas juntos.", "Bufeu les dues espelmes junts."],
    blow: ["Blow out the candles", "吹灭蜡烛", "吹熄蠟燭", "Apagar las velas", "Bufar les espelmes"],
    blowWait: ["Waiting for {p} to blow too.", "等{p}也一起吹。", "等{p}也一起吹。", "Esperando a que {p} sople también.", "Esperant que {p} bufi també."],
    blowAsk: ["{p} is ready to say goodnight.", "{p}准备说晚安了。", "{p}準備說晚安了。", "{p} quiere dar las buenas noches.", "{p} vol dir bona nit."],
    gn: ["Goodnight.", "晚安。", "晚安。", "Buenas noches.", "Bona nit."],
    gnWith: ["Dinner with {p}, two kitchens apart.", "和{p}的一顿晚饭，隔着两个厨房。", "和{p}的一頓晚飯，隔著兩個廚房。", "Una cena con {p}, a dos cocinas de distancia.", "Un sopar amb {p}, a dues cuines de distància."],
    nextOne: ["Book the next one", "订下一次", "訂下一次", "Reservar la próxima", "Reservar la propera"],
    bookedNext: ["Booked. {p} will see it in their own time.", "订好了。{p}会看到自己那边的时间。", "訂好了。{p}會看到自己那邊的時間。", "Reservada. {p} la verá en su hora.", "Reservada. {p} la veurà a la seva hora."],
    theyBooked: ["{p} booked the next one: {when}, your time.", "{p}订了下一次：你那边 {when}。", "{p}訂了下一次：你那邊 {when}。", "{p} ha reservado la próxima: {when}, tu hora.", "{p} ha reservat la propera: {when}, la teva hora."],
    see: ["See it", "看看", "看看", "Verla", "Veure-la"],
    start: ["Back to the start", "回到开头", "回到開頭", "Volver al inicio", "Tornar a l'inici"],
    handoff: ["Between dinners: Handoff", "两顿饭之间：Handoff", "兩頓飯之間：Handoff", "Entre cenas: Handoff", "Entre sopars: Handoff"],
    device: ["Kept on this device", "只留在这台设备上", "只留在這台裝置上", "Se queda en este dispositivo", "Es queda en aquest dispositiu"],
    ah: ["After hours", "下班以后", "下班以後", "Fuera de horario", "Fora d'hores"],
    lang: ["Language", "语言", "語言", "Idioma", "Idioma"],
    netBad: ["The line to their table is down. Trying again…", "和对方桌子的线断了，正在重连…", "和對方桌子的線斷了，正在重連…", "Se ha cortado la línea con su mesa. Reintentando…", "S'ha tallat la línia amb la seva taula. Tornant-ho a provar…"],
    leave: ["Leave the table", "离开桌子", "離開桌子", "Dejar la mesa", "Deixar la taula"],
    out: [
      ["Phone down now. Wash up slowly, the way you would if they were drying.", "现在放下手机吧。慢慢洗碗，就像对方在旁边擦干一样。", "現在放下手機吧。慢慢洗碗，就像對方在旁邊擦乾一樣。", "Deja ya el móvil. Friega despacio, como si estuviera secando a tu lado.", "Deixa ja el mòbil. Renta els plats a poc a poc, com si eixugués al teu costat."],
      ["Before you sleep, write one thing from tonight on paper. Keep it for when you're in the same room.", "睡前在纸上写下今晚的一件事，留到你们在同一个房间的时候。", "睡前在紙上寫下今晚的一件事，留到你們在同一個房間的時候。", "Antes de dormir, escribe en un papel una cosa de esta noche. Guárdala para cuando estéis en la misma habitación.", "Abans de dormir, escriu en un paper una cosa d'aquesta nit. Guarda-la per quan sigueu a la mateixa habitació."],
      ["Step outside for a minute. It's the same sky, a few hours apart.", "出门站一分钟吧。同一片天空，只差几个小时。", "出門站一分鐘吧。同一片天空，只差幾個小時。", "Sal un minuto. Es el mismo cielo, a unas horas de distancia.", "Surt un minut. És el mateix cel, a unes hores de distància."],
      ["This week, cook this dinner for someone who lives close by.", "这周把这顿饭做给住在附近的某个人吃。", "這週把這頓飯做給住在附近的某個人吃。", "Esta semana, cocina esta cena para alguien que viva cerca.", "Aquesta setmana, cuina aquest sopar per a algú que visqui a prop."],
      ["Leave the plate in the sink till morning. Go and sit somewhere without a screen for a bit.", "盘子留到明天早上再洗。去一个没有屏幕的地方坐一会儿。", "盤子留到明天早上再洗。去一個沒有螢幕的地方坐一會兒。", "Deja el plato en el fregadero hasta mañana. Ve a sentarte un rato donde no haya pantallas.", "Deixa el plat a l'aigüera fins demà. Vés a seure una estona on no hi hagi pantalles."]
    ]
  };


  var css = [
  ":root{--tc-bg:#f6eee2;--tc-card:#fffaf3;--tc-ink:#2b1d18;--tc-mut:#7a6558;--tc-line:rgba(43,29,24,.12);--tc-amber:#b8711a;--tc-amb2:#f2b54a;--tc-rose:#b9475f;--tc-sky:#3f6fa6;--tc-pri:#2b1d18;--tc-on:#fff6e8;--tc-shadow:0 1px 0 rgba(43,29,24,.06),0 10px 30px -18px rgba(43,29,24,.35)}",
  "@media (prefers-color-scheme:dark){:root{--tc-bg:#150d13;--tc-card:#22161e;--tc-ink:#f6eadb;--tc-mut:#b9a395;--tc-line:rgba(246,234,219,.12);--tc-amber:#f2b54a;--tc-rose:#e8809a;--tc-sky:#8ab8f0;--tc-pri:#f2b54a;--tc-on:#1d130d;--tc-shadow:0 1px 0 rgba(0,0,0,.3),0 14px 34px -18px rgba(0,0,0,.8)}}",
  "html.tc-app,html.tc-app body{background:var(--tc-bg)!important;color:var(--tc-ink);color-scheme:light dark;font:400 16px/1.5 'Figtree',system-ui,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;min-height:100%}",
  "html.tc-app body{background-image:none!important;min-height:100dvh}",
  "html.tc-app body>header.top,html.tc-app body>main,html.tc-app #toast{display:none!important}",
  ".tc .tc-main{max-width:none;margin:0;padding:0}.tc-col{display:flex;flex-direction:column;gap:14px;min-width:0}",
  ".tc-roombtn{position:absolute;top:10px;right:10px;width:40px;height:40px;display:grid;place-items:center;border-radius:12px;border:0;background:rgba(20,12,18,.55);color:#fbf1de;cursor:pointer;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}.tc-roombtn[aria-pressed=true]{background:#f2b54a;color:#1d130d}",
  ".tc{max-width:1100px;margin:0 auto;padding:0 16px calc(28px + env(safe-area-inset-bottom));box-sizing:border-box}.tc *{box-sizing:border-box}",
  ".tc-ic{width:20px;height:20px;flex:none}",
  ".tc-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:max(12px,env(safe-area-inset-top)) 0 10px}",
  ".tc-brand{display:inline-flex;align-items:center;gap:8px;color:var(--tc-ink);text-decoration:none}.tc-brand .tc-ic{color:var(--tc-amber);width:24px;height:24px}.tc-brand b{font:600 19px/1 'Fraunces',Georgia,serif;letter-spacing:-.01em}",
  ".tc-lang{display:inline-flex;align-items:center;gap:6px;height:40px;min-width:44px;padding:0 12px;border-radius:999px;border:1px solid var(--tc-line);background:transparent;color:var(--tc-ink);font:600 13px 'Figtree',sans-serif;cursor:pointer}",
  ".tc-main{display:flex;flex-direction:column;gap:14px}",
  ".tc-hero{position:relative;border-radius:20px;overflow:hidden;background:#000;box-shadow:var(--tc-shadow)}.tc-hero .tc-stage{border:0!important;box-shadow:none!important;margin:0!important}.tc-hero canvas{display:block;width:100%;height:auto;aspect-ratio:160/96;image-rendering:pixelated}",
  ".tc-hero.sm{max-width:560px;width:100%;margin:0 auto}",
  ".tc-intro{padding:4px 2px}.tc-h1{margin:6px 0 6px;font:500 clamp(1.7rem,5.4vw,2.6rem)/1.08 'Fraunces',Georgia,serif;letter-spacing:-.015em}",
  "html:lang(zh-Hans) .tc-h1,html:lang(zh-Hant) .tc-h1,html:lang(zh-Hans) .tc-when,html:lang(zh-Hant) .tc-when,html:lang(zh-Hans) .tc-h2,html:lang(zh-Hant) .tc-h2{font-family:'Songti SC','Noto Serif SC','Noto Serif CJK SC',serif;font-weight:700;letter-spacing:0}",
  ".tc-p{margin:0;color:var(--tc-mut);max-width:40rem}",
  ".tc-card{background:var(--tc-card);border:1px solid var(--tc-line);border-radius:18px;padding:16px;box-shadow:var(--tc-shadow);display:flex;flex-direction:column;gap:10px}.tc-card.quiet{background:transparent;box-shadow:none}",
  ".tc-h2{margin:0;font:600 1.2rem/1.2 'Fraunces',Georgia,serif}",
  ".tc-lab{margin:4px 0 0;font:600 12px/1.3 'Figtree',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--tc-mut)}",
  ".tc-hint,.tc-sub{margin:0;font-size:14px;color:var(--tc-mut)}.tc-wait{margin:0;font-style:italic;color:var(--tc-mut)}",
  ".tc-in{width:100%;min-height:46px;padding:10px 12px;border-radius:12px;border:1px solid var(--tc-line);background:var(--tc-bg);color:var(--tc-ink);font:16px 'Figtree',sans-serif}.tc-in:focus{outline:2px solid var(--tc-amber);outline-offset:1px}.tc-in.want{outline:2px solid var(--tc-rose)}",
  ".tc-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.tc-time{width:auto;min-width:120px}",
  ".tc-days{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;scroll-snap-type:x proximity;scrollbar-width:thin}",
  ".tc-day{flex:none;scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;gap:0;width:64px;padding:8px 4px;border-radius:14px;border:1px solid var(--tc-line);background:var(--tc-bg);color:var(--tc-ink);cursor:pointer;font:inherit}",
  ".tc-day small{font-size:11px;color:var(--tc-mut);white-space:nowrap}.tc-day b{font:600 20px/1.2 'Fraunces',serif}.tc-day[aria-pressed=true]{background:var(--tc-pri);border-color:var(--tc-pri);color:var(--tc-on)}.tc-day[aria-pressed=true] small{color:inherit;opacity:.8}",
  ".tc-chips{display:flex;flex-wrap:wrap;gap:8px}.tc-chip{min-height:40px;padding:6px 14px;border-radius:999px;border:1px solid var(--tc-line);background:var(--tc-bg);color:var(--tc-ink);font:500 15px 'Figtree',sans-serif;cursor:pointer}.tc-chip[aria-pressed=true]{background:var(--tc-pri);border-color:var(--tc-pri);color:var(--tc-on)}",
  ".tc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:10px 18px;border-radius:999px;border:1px solid var(--tc-line);background:var(--tc-bg);color:var(--tc-ink);font:600 16px 'Figtree',sans-serif;cursor:pointer;text-decoration:none}",
  ".tc-btn.pri{background:var(--tc-pri);border-color:var(--tc-pri);color:var(--tc-on)}.tc-btn.big{width:100%;min-height:54px;font-size:17px}.tc-btn.sm{min-height:40px;padding:6px 14px;font-size:14px}.tc-btn.ghost{background:transparent;border-color:transparent;color:var(--tc-mut)}.tc-btn:disabled{opacity:.55;cursor:default}",
  ".tc-btn:focus-visible,.tc-chip:focus-visible,.tc-day:focus-visible,.tc-tab:focus-visible,.tc-lang:focus-visible{outline:2px solid var(--tc-amber);outline-offset:2px}",
  ".tc-card>.tc-btn.pri:not(.sm){align-self:stretch}.tc-acts{display:flex;flex-wrap:wrap;gap:8px}.tc-acts .tc-btn{flex:1 1 200px}",
  ".tc-list{list-style:none;margin:0;padding:0}.tc-list li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-top:1px solid var(--tc-line)}.tc-list li:first-child{border-top:0}.tc-list b{display:block;font-weight:600}.tc-list small{display:block;color:var(--tc-mut)}",
  ".tc-paste{display:flex;gap:8px}.tc-paste .tc-in{flex:1;min-width:0}",
  ".tc-k{margin:0;font:600 12px 'Figtree',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--tc-amber)}.tc-when{margin:0;font:500 clamp(1.6rem,5vw,2.3rem)/1.1 'Fraunces',Georgia,serif}.tc-other{margin:0;padding:8px 12px;border-radius:12px;background:var(--tc-bg)}.tc-who{margin:4px 0 0;font-weight:600}",
  ".tc-dish{margin:0;font:600 1.05rem 'Fraunces',serif;color:var(--tc-amber)}",
  ".tc-shop{list-style:none;margin:0;padding:0}.tc-shop li{border-top:1px dashed var(--tc-line);padding:2px 0}.tc-shop li:first-child{border-top:0}.tc-shop label{display:flex;align-items:center;gap:12px;min-height:44px;cursor:pointer}.tc-shop input{width:22px;height:22px;accent-color:var(--tc-amber);flex:none}.tc-shop input:checked+span{text-decoration:line-through;color:var(--tc-mut)}",
  ".tc-more summary{cursor:pointer;color:var(--tc-mut);font-weight:600;min-height:40px;display:flex;align-items:center}.tc-more .tc-chips{margin-top:6px}.tc-more .tc-shop li{padding:8px 0}",
  ".tc-seats{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tc-seat{padding:10px 12px;border-radius:14px;background:var(--tc-card);border:1px solid var(--tc-line);min-width:0}.tc-seat.me{box-shadow:inset 4px 0 0 var(--tc-rose)}.tc-seat.them{box-shadow:inset 4px 0 0 var(--tc-sky)}.tc-seat.away{opacity:.7}",
  ".tc-seat b{display:block;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tc-clock{display:block;font:500 24px/1.1 'Fraunces',serif;font-variant-numeric:tabular-nums}.tc-seat small{display:block;color:var(--tc-mut);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".tc-side{display:flex;flex-direction:column;gap:12px}.tc-lightbox:empty,.tc-invite:empty{display:none}.tc-lightbox,.tc-invite{display:flex;flex-direction:column;gap:6px}.tc-invite{flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between}",
  ".tc-dock{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.tc-tab{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:60px;padding:6px 2px;border-radius:14px;border:1px solid var(--tc-line);background:var(--tc-card);color:var(--tc-ink);font:600 12px/1.1 'Figtree',sans-serif;cursor:pointer}.tc-tab[aria-pressed=true]{background:var(--tc-pri);border-color:var(--tc-pri);color:var(--tc-on)}.tc-tab span{max-width:100%;text-align:center;overflow-wrap:anywhere;hyphens:auto}",
  ".tc-panel{background:var(--tc-card);border:1px solid var(--tc-line);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:10px}",
  ".tc-dishhead{display:flex;align-items:center;justify-content:space-between;gap:10px}.tc-dishhead b{font:600 1.1rem 'Fraunces',serif}.tc-dots{display:flex;gap:5px}.tc-dots i{width:9px;height:9px;border-radius:50%;background:var(--tc-line)}.tc-dots i.on{background:var(--tc-amber)}.tc-dots i.now{background:transparent;box-shadow:inset 0 0 0 2px var(--tc-amber)}",
  ".tc-step{padding:14px;border-radius:14px;background:var(--tc-bg);font-size:17px;line-height:1.5}.tc-step.served{font:500 1.2rem/1.4 'Fraunces',serif;text-align:center}",
  ".tc-timer{margin:0;text-align:center;font:500 34px/1 'Fraunces',serif;font-variant-numeric:tabular-nums;color:var(--tc-amber)}.tc-timer.rang{animation:tcRing 1s ease-in-out 3}@keyframes tcRing{50%{opacity:.35}}",
  ".tc-ticks{display:flex;justify-content:center;gap:18px;margin:0;color:var(--tc-mut)}.tc-ticks .on{color:var(--tc-ink);font-weight:600}",
  ".tc-q{min-height:120px;display:grid;place-items:center;text-align:center;padding:18px;border-radius:14px;background:var(--tc-bg);font:500 1.2rem/1.45 'Fraunces',Georgia,serif}",
  ".tc-napin{font-family:'Caveat',cursive;font-size:24px;line-height:1.2}",
  ".tc-napkin{position:fixed;inset:0;z-index:9000;display:grid;place-items:center;padding:20px;background:rgba(10,6,8,.45)}.tc-nap{width:min(340px,90vw);padding:24px 20px 16px;background:#fbfaf4;color:#2a1d14;border-radius:4px;transform:rotate(-2.5deg);box-shadow:0 18px 50px rgba(0,0,0,.45);background-image:repeating-linear-gradient(45deg,transparent 0 10px,rgba(0,0,0,.03) 10px 11px);animation:tcSlide .5s ease-out}",
  ".tc-nap p{margin:0;font:400 28px/1.2 'Caveat',cursive;white-space:pre-wrap;overflow-wrap:anywhere}.tc-nap small{display:block;margin:10px 0 12px;color:#8a7a62;font-size:14px}.tc-nap .tc-btn{width:100%;background:#fff;color:#2a1d14;border-color:#d8d0c0}",
  "@keyframes tcSlide{from{transform:translateX(40vw) rotate(4deg);opacity:0}}",
  ".tc-live{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));z-index:8000;max-width:calc(100vw - 32px);margin:0;padding:10px 16px;border-radius:999px;background:var(--tc-ink);color:var(--tc-bg);font-weight:600;font-size:15px;text-align:center;transform:translate(-50%,20px);opacity:0;transition:.25s;pointer-events:none}.tc-live.on{opacity:1;transform:translate(-50%,0)}",
  ".tc-out{margin:6px 0 0;padding:14px 16px;border-left:3px solid var(--tc-amber);font:500 1.15rem/1.45 'Fraunces',Georgia,serif}",
  ".tc-booked-note{padding:14px;border-radius:16px;background:var(--tc-card);border:1px solid var(--tc-amber);display:flex;flex-direction:column;gap:8px}.tc-booked-note p{margin:0;font-weight:600}",
  ".tc-foot{margin-top:28px;padding-top:14px;border-top:1px solid var(--tc-line);font-size:13px;color:var(--tc-mut)}.tc-ho{margin:0 0 10px;text-align:center}.tc-ho a{display:inline-flex;align-items:center;gap:4px;color:var(--tc-ink);font-weight:600;text-decoration:none;border-bottom:1px solid var(--tc-line)}.tc-ho .tc-ic{width:14px;height:14px}",
  ".tc-foot .fbf-x{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 14px;margin-top:6px}.tc-foot .fbf-x a{display:inline-flex;align-items:center;gap:4px}.tc-foot .fbf-x .tc-ic{width:13px;height:13px;color:#E2553F}",
  "html[data-tc=table] .tc-foot{display:none}",
  "@media (min-width:900px){html[data-tc=table] .tc-main{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(340px,1fr);grid-template-areas:'seats seats' 'stage side';align-items:start;gap:16px}html[data-tc=table] .tc-seats{grid-area:seats}html[data-tc=table] #tcStage{grid-area:stage;position:sticky;top:12px}html[data-tc=table] .tc-side{grid-area:side}",
  "html[data-tc=home] .tc-main{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(360px,1fr);gap:20px;align-items:start}html[data-tc=home] .tc-col:first-child{position:sticky;top:12px}}",
  "@media (min-width:900px){html[data-tc=booked] .tc-main,html[data-tc=after] .tc-main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}html[data-tc=booked] .tc-hero,html[data-tc=after] .tc-hero{grid-column:1 / -1}}",
  "@media (max-width:380px){.tc-tab{font-size:11px}.tc-tab .tc-ic{width:18px;height:18px}.tc-clock{font-size:21px}}",
  "@media (prefers-reduced-motion:reduce){.tc *,.tc-live{animation:none!important;transition:none!important}}"
  ].join("");
  var st0 = document.createElement("style"); st0.textContent = css; document.head.appendChild(st0);

  /* ---------- small things ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var ICON = {   /* line icons (the town's pixel converter leaves svg alone) */
    candle: '<path d="M9 11v9M15 11v9M6.5 20h11"/><path d="M9 4.5c1 1.2 1 2.4 0 3.5-1-1.1-1-2.3 0-3.5zM15 4.5c1 1.2 1 2.4 0 3.5-1-1.1-1-2.3 0-3.5z"/>',
    cal: '<rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    share: '<path d="M12 15V4m0 0-4 4m4-4 4 4"/><path d="M6 12v6.5h12V12"/>',
    pot: '<path d="M4 10h16v3.5a5.5 5.5 0 0 1-5.5 5.5h-5A5.5 5.5 0 0 1 4 13.5z"/><path d="M2.5 10h19M9 7c0-1.5 1-2 1-3.5M14 7c0-1.5 1-2 1-3.5"/>',
    glass: '<path d="M7 3.5h10l-1 6.5a4 4 0 0 1-8 0z"/><path d="M12 14v6M8.5 20.5h7"/>',
    cards: '<rect x="4" y="6" width="11" height="15" rx="1.5" transform="rotate(-8 9.5 13.5)"/><rect x="9" y="3.5" width="11" height="15" rx="1.5"/>',
    napkin: '<path d="M4 6.5 12 4l8 2.5v11L12 20l-8-2.5z"/><path d="M8 10h8M8 13.5h5"/>',
    room: '<rect x="4" y="4" width="16" height="13" rx="1.5"/><path d="M12 4v13M4 10.5h16M7 20.5h10"/>',
    moon: '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/>',
    check: '<path d="M5 12.5 10 17 19 7"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
    arrow: '<path d="M7 17 17 7M9 7h8v8"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    heart: '<path d="M12 19.5s-7-4.3-7-9.5A3.8 3.8 0 0 1 12 7.6 3.8 3.8 0 0 1 19 10c0 5.2-7 9.5-7 9.5z"/>',
    music: '<path d="M9 17.5V5.5l10-2v12"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>'
  };
  function ic(k) { return '<svg class="tc-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + "</svg>"; }
  function btn(cls, icon, label, fn) { var b = el("button", cls); b.type = "button"; b.innerHTML = (icon ? ic(icon) : "") + "<span>" + esc(label) + "</span>"; if (fn) b.onclick = fn; return b; }
  function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { return ""; } }
  function fmt(ms, zone, o) { o = Object.assign({}, o || { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }); if (zone) o.timeZone = zone; try { return new Intl.DateTimeFormat(LOC[li()], o).format(new Date(ms)); } catch (e) { delete o.timeZone; return new Intl.DateTimeFormat(LOC[li()], o).format(new Date(ms)); } }
  function city(zone) { return zone ? zone.split("/").pop().replace(/_/g, " ") : ""; }
  function dishName(k) { var d = T.DISH[k]; return d ? T.tr(d.n) : ""; }
  function dishLower(k) { var n = dishName(k); return li() === 0 || li() >= 3 ? n.charAt(0).toLowerCase() + n.slice(1) : n; }
  function newCode() { var a = new Uint8Array(6); crypto.getRandomValues(a); return Array.from(a).map(function (x) { return "abcdefghjkmnpqrstuvwxyz23456789"[x % 31]; }).join(""); }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- bookings: in the link and on this device, nowhere else ---------- */
  /* a booking: { c: code, w: minutes since 1970 (0 = no day), z: the booker's time zone, n: the booker's name, d: dish,
     by: 1 if I booked it, o: the other person's name, oz: their time zone (learned at the table) } */
  function tables() { try { var a = JSON.parse(ls("tc_tables") || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function keep(b) { var a = tables().filter(function (x) { return x.c !== b.c; }); a.unshift(b); ls("tc_tables", JSON.stringify(a.slice(0, 12))); return b; }
  function drop(c) { ls("tc_tables", JSON.stringify(tables().filter(function (x) { return x.c !== c; }))); ls("tc_shop_" + c, null); }
  function find(c) { return tables().filter(function (x) { return x.c === c; })[0] || null; }
  function link(b) { var h = []; if (b.w) h.push("w=" + b.w); if (b.z) h.push("z=" + encodeURIComponent(b.z)); if (b.n) h.push("n=" + encodeURIComponent(b.n)); if (b.d) h.push("d=" + b.d); return BASE + "?t=" + b.c + (h.length ? "#" + h.join("&") : ""); }
  function parse(str) {   /* a link from the app or from the town (freebuilder.net/nearby/two-candles/?t=…), or just the code */
    str = String(str || "").trim(); var m = /[?&]t=([a-z0-9]{6,24})/.exec(str) || /^([a-z0-9]{6,24})$/.exec(str); if (!m) return null;
    var b = { c: m[1], w: 0, z: "", n: "", d: "" }, hs = str.indexOf("#") >= 0 ? str.slice(str.indexOf("#") + 1) : "";
    hs.split("&").forEach(function (kv) { var i = kv.indexOf("="); if (i < 0) return; var k = kv.slice(0, i), v = ""; try { v = decodeURIComponent(kv.slice(i + 1)); } catch (e) { return; }
      if (k === "w" && /^\d{6,9}$/.test(v)) b.w = +v; else if (k === "z" && /^[A-Za-z_+\-\/0-9]{1,48}$/.test(v)) b.z = v; else if (k === "n") b.n = v.slice(0, 20); else if (k === "d" && T.DISH[v]) b.d = v; });
    return b;
  }
  function address(b) { if (HOST === window) return; try { HOST.history.replaceState(null, "", b ? link(b).replace(location.origin, "") : "/two-candles/"); } catch (e) {} }
  function when(b) { return b.w * 60000; }

  /* the calendar file: made here, in UTC, so every calendar shows it in its owner's own time */
  function ics(b) {
    var st = when(b), en = st + 2 * 3600000, z = function (ms) { return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""); };
    var e = function (s) { return String(s).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1"); };
    var who = b.by ? b.o : b.n, u = link(b);
    var L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FREE//BUILDER//Two Candles//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      "UID:tc-" + b.c + "-" + b.w + "@freebuilder.net", "DTSTAMP:" + z(Date.now()), "DTSTART:" + z(st), "DTEND:" + z(en),
      "SUMMARY:" + e(who ? w("icsTitle", { p: who }) : w("icsTitle0")), "DESCRIPTION:" + e(w("icsDesc", { dish: dishLower(b.d || "pasta"), u: u })), "URL:" + u,
      "BEGIN:VALARM", "ACTION:DISPLAY", "TRIGGER:-PT30M", "DESCRIPTION:" + e(w("icsAlarm")), "END:VALARM", "END:VEVENT", "END:VCALENDAR"];
    var out = L.map(function (l) { var r = [], s = l; while (s.length > 74) { r.push(s.slice(0, 74)); s = " " + s.slice(74); } r.push(s); return r.join("\r\n"); }).join("\r\n") + "\r\n";
    var a = document.createElement("a"); a.download = "two-candles-" + new Date(st).toISOString().slice(0, 10) + ".ics";
    try { a.href = URL.createObjectURL(new Blob([out], { type: "text/calendar;charset=utf-8" })); } catch (x) { a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(out); }
    document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); try { URL.revokeObjectURL(a.href); } catch (x) {} }, 1500);
    window.__tcIcs = out;   /* the tests read what was made */
  }
  function share(b, now) {
    var u = link(b), txt = b.w && !now ? w("inviteText", { when: fmt(when(b), b.z || tz()), dish: dishLower(b.d || "pasta") }) : w("inviteNow");
    if (navigator.share) { navigator.share({ title: w("app"), text: txt, url: u }).catch(function () {}); return; }
    try { navigator.clipboard.writeText(txt + " " + u).then(function () { say(w("copied")); }, function () { prompt("", u); }); } catch (e) { prompt("", u); }
  }

  /* ---------- the page ---------- */
  var root = el("div", "tc"); root.id = "tc"; root.setAttribute("data-fbt-skip", "");
  root.innerHTML = '<header class="tc-top"><a class="tc-brand" href="/two-candles/" target="_top">' + ic("candle") + '<b id="tcName"></b></a>' +
    '<button type="button" class="tc-lang" data-fbl-btn id="tcLang">' + ic("globe") + '<span data-fbl-label>EN</span></button></header>' +
    '<main class="tc-main" id="tcMain"></main><p class="tc-live" id="tcLive" role="status" aria-live="polite"></p>' +
    '<footer class="tc-foot" id="tcFoot"><p class="tc-ho" id="tcHo"></p><div id="tcFbf"></div></footer>';
  document.body.appendChild(root);
  var stage = T.stage; stage.classList.add("tc-stage");
  var cur = "", B = null, panel = "", lastLive = 0;

  function say(m) { var e = $("tcLive"); e.textContent = m; e.classList.add("on"); lastLive = Date.now(); clearTimeout(say._t); say._t = setTimeout(function () { e.classList.remove("on"); }, 4200); }
  function chrome() {
    var i = li(); de.lang = LANG[i]; $("tcName").textContent = w("app"); document.title = w("app"); try { if (HOST !== window) HOST.document.title = w("app"); } catch (e) {}
    $("tcLang").setAttribute("aria-label", w("lang"));
    var ho = $("tcHo"); ho.innerHTML = ""; var a = el("a"); a.href = "/handoff/"; a.target = "_top"; a.innerHTML = esc(T.W.hoff ? T.t("hoff").replace(/\s*↗\s*$/, "") : w("handoff")) + " " + ic("arrow");   /* the town page's own words for it, one source */ ho.appendChild(a);
    var x = "<span>" + esc(w("device")) + '</span><a href="https://www.wei-meng.org/after-hours/?fbl=' + ["en", "zh", "zh-Hant", "es", "ca"][i] + '" target="_blank" rel="noopener">' + ic("heart") + " " + esc(w("ah")) + "</a>";
    if (window.FBC && FBC.foot) FBC.foot($("tcFbf"), { extra: x });
  }
  function show(name, fn) {
    cur = name; de.setAttribute("data-tc", name); var m = $("tcMain"); m.innerHTML = ""; fn(m); awake(name === "table");
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function card(m, cls) { var c = el("section", "tc-card" + (cls ? " " + cls : "")); m.appendChild(c); return c; }
  function hero(m, small) { var h = el("div", "tc-hero" + (small ? " sm" : "")); h.appendChild(stage); m.appendChild(h); return h; }

  /* ---------- a day and a time ---------- */
  function picker(c, pre, other) {
    var now = new Date(), b = { day: 0, hm: "20:00", d: "pasta" };
    if (pre) { var p = new Date(when(pre)); b.hm = ("0" + p.getHours()).slice(-2) + ":" + ("0" + p.getMinutes()).slice(-2); b.d = pre.d || b.d; var d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()), d1 = new Date(p.getFullYear(), p.getMonth(), p.getDate() + 7); b.day = Math.max(1, Math.min(13, Math.round((d1 - d0) / 864e5))); }
    else if (now.getHours() >= 19) b.day = 1;
    var days = el("div", "tc-days"); days.setAttribute("role", "group"); days.setAttribute("aria-label", w("day"));
    for (var i = 0; i < 14; i++) (function (i) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i), x = el("button", "tc-day"); x.type = "button";
      x.innerHTML = "<small>" + esc(i === 0 ? w("today") : i === 1 ? w("tomorrow") : fmt(d, null, { weekday: "short" })) + "</small><b>" + esc(fmt(d, null, { day: "numeric" })) + "</b><small>" + esc(fmt(d, null, { month: "short" })) + "</small>";
      x.setAttribute("aria-pressed", i === b.day); x.onclick = function () { b.day = i; days.querySelectorAll(".tc-day").forEach(function (y, j) { y.setAttribute("aria-pressed", j === i); }); upd(); };
      days.appendChild(x);
    })(i);
    var lab1 = el("p", "tc-lab", w("day")); c.appendChild(lab1); c.appendChild(days);
    setTimeout(function () { var on = days.querySelector('[aria-pressed="true"]'); if (on) days.scrollLeft = Math.max(0, on.getBoundingClientRect().left - days.getBoundingClientRect().left + days.scrollLeft - 8); }, 0);
    var row = el("label", "tc-row"); row.appendChild(el("span", "tc-lab", w("time"))); var tm = el("input", "tc-in tc-time"); tm.type = "time"; tm.value = b.hm; tm.step = 300; tm.oninput = function () { b.hm = tm.value || "20:00"; upd(); }; row.appendChild(tm); c.appendChild(row);
    var hint = el("p", "tc-hint"); c.appendChild(hint);
    c.appendChild(el("p", "tc-lab", w("dinner"))); var ds = el("div", "tc-chips"); c.appendChild(ds);
    Object.keys(T.DISH).forEach(function (k) { var x = el("button", "tc-chip", dishName(k)); x.type = "button"; x.setAttribute("aria-pressed", k === b.d); x.onclick = function () { b.d = k; ds.querySelectorAll(".tc-chip").forEach(function (y) { y.setAttribute("aria-pressed", y === x); }); }; ds.appendChild(x); });
    function at() { var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + b.day), hm = (b.hm || "20:00").split(":"); d.setHours(+hm[0] || 0, +hm[1] || 0, 0, 0); return d.getTime(); }
    function upd() { hint.textContent = other && other.oz && other.oz !== tz() ? w("forThem", { t: fmt(at(), other.oz, { weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), p: other.o || w("date") }) : w("theirTime"); }
    upd();
    return { at: at, dish: function () { return b.d; } };
  }

  /* ---------- home: book a table ---------- */
  function home() {
    T.leave(); B = null; address(null);
    show("home", function (m0) {
      var lf = el("div", "tc-col"), m = el("div", "tc-col"); m0.appendChild(lf); m0.appendChild(m);
      hero(lf);
      var h = el("div", "tc-intro"); h.appendChild(el("h1", "tc-h1", w("lede"))); h.appendChild(el("p", "tc-p", w("lede2"))); lf.appendChild(h);
      var c = card(m); c.appendChild(el("h2", "tc-h2", w("book")));
      var nm = nameField(c);
      var pk = picker(c);
      var go = btn("tc-btn pri", "candle", w("bookIt"), function () {
        if (!setName(nm)) return;
        var b = keep({ c: newCode(), w: Math.round(pk.at() / 60000), z: tz(), n: T.me.name, d: pk.dish(), by: 1, o: "", oz: "" });
        booked(b, true);
      }); c.appendChild(go);
      var nw = btn("tc-btn ghost", null, w("now"), function () { if (!setName(nm)) return; var b = keep({ c: newCode(), w: 0, z: tz(), n: T.me.name, d: "", by: 1, o: "", oz: "" }); table(b); }); c.appendChild(nw);
      var up = tables().filter(function (x) { return !x.w || when(x) > Date.now() - 4 * 3600000; }).sort(function (a, b) { return (a.w || 9e9) - (b.w || 9e9); });
      if (up.length) {
        var t2 = card(m); t2.appendChild(el("h2", "tc-h2", w("tables"))); var ul = el("ul", "tc-list"); t2.appendChild(ul);
        up.slice(0, 6).forEach(function (x) { var li0 = el("li"), who = x.by ? x.o : x.n, tx = el("span"); tx.appendChild(el("b", "", x.w ? fmt(when(x), null, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) : "·")); tx.appendChild(el("small", "", [who, dishName(x.d)].filter(Boolean).join(" · ")));
          li0.appendChild(tx); li0.appendChild(btn("tc-btn sm", null, w("open"), function () { x.w ? booked(x) : table(x); })); ul.appendChild(li0); });
      }
      var t3 = card(m, "quiet"); t3.appendChild(el("p", "tc-lab", w("haveLink"))); var r = el("div", "tc-paste"), inp = el("input", "tc-in"); inp.type = "url"; inp.placeholder = "freebuilder.net/…?t=…"; inp.setAttribute("aria-label", w("haveLink")); r.appendChild(inp);
      r.appendChild(btn("tc-btn sm", null, w("open"), function () { var b = parse(inp.value); if (!b) { say(w("badLink")); inp.focus(); return; } arrive(b); })); t3.appendChild(r);
    });
  }
  function nameField(c) { var nm = el("input", "tc-in"); nm.maxLength = 20; nm.autocomplete = "nickname"; nm.placeholder = w("yourName"); nm.setAttribute("aria-label", w("yourName")); nm.value = T.me.name || ""; c.appendChild(nm); return nm; }
  function setName(nm) { var v = nm.value.trim().slice(0, 20); if (!v) { nm.focus(); nm.classList.add("want"); setTimeout(function () { nm.classList.remove("want"); }, 900); return false; } T.name(v); return true; }

  /* someone opened a link: a booking with a day goes to "before dinner", one without straight to the table */
  function arrive(b) { var old = find(b.c); if (old) { if (b.w && b.w !== old.w) { old.w = b.w; old.z = b.z || old.z; old.d = b.d || old.d; keep(old); } b = old; } else { b.by = 0; b.o = b.n; b.oz = b.z; keep(b); } b.w ? booked(b) : table(b); }

  /* ---------- before dinner ---------- */
  function booked(b, fresh) {
    T.leave(); B = b; address(b);
    show("booked", function (m) {
      hero(m, true);
      var c = card(m, "when"); c.appendChild(el("p", "tc-k", w("kTable")));
      c.appendChild(el("h1", "tc-when", fmt(when(b), null)));
      c.appendChild(el("p", "tc-sub", w("yourTime") + (tz() ? " · " + city(tz()) : "")));
      var oz = b.by ? b.oz : b.z, op = b.by ? b.o : b.n;
      if (oz && oz !== tz()) c.appendChild(el("p", "tc-other", w("forThem", { t: fmt(when(b), oz, { weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) + " · " + city(oz), p: op || w("date") })));
      if (when(b) < Date.now() - 3 * 3600000) c.appendChild(el("p", "tc-hint", w("passed")));
      c.appendChild(el("p", "tc-who", b.by ? w("youBooked") : w("bookedBy", { p: b.n || w("date") })));
      var acts = el("div", "tc-acts");
      if (b.by) acts.appendChild(btn("tc-btn pri", "share", w("invite"), function () { share(b); }));
      acts.appendChild(btn("tc-btn", "cal", w("ics"), function () { ics(b); })); c.appendChild(acts);
      c.appendChild(el("p", "tc-hint", w("icsNote")));
      shopping(m, b);
      var s = card(m, "sit"); var nm = T.me.name ? null : nameField(s);
      s.appendChild(btn("tc-btn pri big", "candle", w("sit"), function () { if (nm && !setName(nm)) return; table(b); }));
      s.appendChild(btn("tc-btn ghost sm", null, w("notThis"), function () { drop(b.c); home(); }));
      s.appendChild(btn("tc-btn ghost sm", "back", w("start"), home));
      if (fresh && b.by) setTimeout(function () { say(w("youBooked")); }, 300);
    });
  }
  function shopping(m, b) {
    var c = card(m, "shop"); c.appendChild(el("h2", "tc-h2", w("shop")));
    var dk = b.d || "pasta", d = T.DISH[dk]; c.appendChild(el("p", "tc-dish", dishName(dk)));
    var key = "tc_shop_" + b.c, got = {}; try { got = JSON.parse(ls(key) || "{}") || {}; } catch (e) {}
    var ul = el("ul", "tc-shop"); (d.i || []).forEach(function (it, i) {
      var li0 = el("li"), lab = el("label"), cb = el("input"); cb.type = "checkbox"; cb.checked = !!got[dk + i];
      cb.onchange = function () { if (cb.checked) got[dk + i] = 1; else delete got[dk + i]; ls(key, JSON.stringify(got)); };
      lab.appendChild(cb); lab.appendChild(el("span", "", T.tr(it))); li0.appendChild(lab); ul.appendChild(li0); });
    c.appendChild(ul); c.appendChild(el("p", "tc-hint", w("shopNote")));
    var more = el("details", "tc-more"), sm = el("summary", "", w("other")); more.appendChild(sm); var ch = el("div", "tc-chips"); more.appendChild(ch); c.appendChild(more);
    Object.keys(T.DISH).forEach(function (k) { var x = el("button", "tc-chip", dishName(k)); x.type = "button"; x.setAttribute("aria-pressed", k === dk); x.onclick = function () { b.d = k; keep(b); booked(b); setTimeout(function () { say(w("resend")); var s2 = document.querySelector(".tc-card.shop"); if (s2 && s2.scrollIntoView) s2.scrollIntoView({ block: "start" }); }, 50); }; ch.appendChild(x); });
  }

  /* ---------- at the table ---------- */
  function table(b) {
    B = b; address(b); panel = b.d ? "cook" : "";
    if (!T.me.name) { show("name", function (m) { hero(m, true); var c = card(m); c.appendChild(el("h2", "tc-h2", w("kTable"))); var nm = nameField(c); c.appendChild(btn("tc-btn pri big", "candle", w("sit"), function () { if (setName(nm)) table(b); })); }); return; }
    T.sit(b.c); if (b.d) T.dish(b.d);
    show("table", function (m) {
      var top = el("div", "tc-seats"); top.id = "tcSeats"; m.appendChild(top);
      var hz = hero(m); hz.id = "tcStage";
      var side = el("div", "tc-side"); m.appendChild(side);
      var lt = el("div", "tc-lightbox"); lt.id = "tcLight"; side.appendChild(lt);
      var inv = el("div", "tc-invite"); inv.id = "tcInvite"; side.appendChild(inv);
      var dock = el("nav", "tc-dock"); dock.id = "tcDock"; dock.setAttribute("aria-label", w("kTable")); side.appendChild(dock);
      var rb = el("button", "tc-roombtn"); rb.type = "button"; rb.innerHTML = ic("room"); rb.setAttribute("aria-label", w("tRoom")); rb.setAttribute("data-p", "room"); rb.onclick = function () { panel = panel === "room" ? "" : "room"; paint(); }; hz.appendChild(rb);
      [["cook", "pot", "tCook"], ["glass", "glass", "tGlass"], ["talk", "cards", "tTalk"], ["note", "napkin", "tNote"], ["end", "moon", "tEnd"]].forEach(function (d) {
        var x = btn("tc-tab", d[1], w(d[2]), function () { if (d[0] === "glass") { T.clink(); say(w("raised")); return; } panel = panel === d[0] ? "" : d[0]; if (panel === "talk" && T.st().S.k < 0) T.card(); paint(); });
        x.setAttribute("data-p", d[0]); dock.appendChild(x); });
      var pn = el("div", "tc-panel"); pn.id = "tcPanel"; side.appendChild(pn);
      paint();
    });
  }
  function other() { var s = T.st(); return s.here ? s.them.name : (B && (B.by ? B.o : B.n)) || w("date"); }
  function seats() {
    var box = $("tcSeats"); if (!box) return; var s = T.st(), me = T.me;
    var clock = function (z) { return fmt(Date.now(), z || null, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }); };
    var oz = s.here ? s.them.tz : B && (B.by ? B.oz : B.z);
    box.innerHTML = '<div class="tc-seat me"><b></b><span class="tc-clock"></span><small></small></div><div class="tc-seat them' + (s.here ? "" : " away") + '"><b></b><span class="tc-clock"></span><small></small></div>';
    var a = box.children[0], c = box.children[1];
    a.children[0].textContent = me.name || w("you"); a.children[1].textContent = clock(me.tz); a.children[2].textContent = city(me.tz);
    c.children[0].textContent = other(); c.children[1].textContent = oz ? clock(oz) : "—"; c.children[2].textContent = s.here ? (s.them.city || city(s.them.tz)) : w("empty");
  }
  function paint() {
    if (cur !== "table") return; seats();
    var s = T.st(), S = s.S, them = other();
    /* the candles */
    var lb = $("tcLight"); lb.innerHTML = "";
    if (!(s.lit.me && s.lit.them)) {
      if (!s.lit.me) { lb.appendChild(btn("tc-btn pri big", "candle", w("light"), function () { T.light(); paint(); })); lb.appendChild(el("p", "tc-hint", s.lit.them ? w("theyLit", { p: them }) : w("lightNote"))); }
      else lb.appendChild(el("p", "tc-wait", w("lightWait", { p: them })));
    }
    /* the empty chair */
    var iv = $("tcInvite"); iv.innerHTML = "";
    if (!s.here) { iv.appendChild(el("p", "tc-hint", B && B.by ? w("waiting0") : w("waiting", { p: them }))); if (B && B.by) iv.appendChild(btn("tc-btn sm", "share", w("invite"), function () { share(B, !B.w || when(B) < Date.now() + 3600000); })); }
    document.querySelectorAll(".tc-tab,.tc-roombtn").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-p") === panel); });
    var pn = $("tcPanel"); pn.innerHTML = ""; pn.hidden = !panel;
    if (panel === "cook") cookPanel(pn, s, S, them);
    else if (panel === "talk") { var q = el("div", "tc-q", S.k >= 0 ? T.tr(T.Q[S.k % T.Q.length]) : "…"); pn.appendChild(q); pn.appendChild(btn("tc-btn", "cards", w("another"), function () { T.card(); })); }
    else if (panel === "note") { pn.appendChild(el("p", "tc-lab", w("napkin"))); var ta = el("textarea", "tc-in tc-napin"); ta.rows = 3; ta.maxLength = 160; ta.id = "tcNapIn"; ta.value = paint._draft || ""; ta.oninput = function () { paint._draft = ta.value; }; pn.appendChild(ta);
      pn.appendChild(btn("tc-btn pri", "napkin", w("slide"), function () { if (T.note(ta.value)) { paint._draft = ""; ta.value = ""; say(w("slid")); } else ta.focus(); })); }
    else if (panel === "room") { pn.appendChild(el("p", "tc-lab", w("view"))); var vc = el("div", "tc-chips"); Object.keys(T.VIEWS).forEach(function (k) { var x = el("button", "tc-chip", T.tr(T.VIEWS[k])); x.type = "button"; x.setAttribute("aria-pressed", S.v === k); x.onclick = function () { T.view(k); }; vc.appendChild(x); }); pn.appendChild(vc);
      pn.appendChild(el("p", "tc-lab", w("music"))); var mc = el("div", "tc-chips"); [[1, "on"], [0, "off"]].forEach(function (o) { var x = el("button", "tc-chip", w(o[1])); x.type = "button"; x.setAttribute("aria-pressed", !!S.m === !!o[0]); x.onclick = function () { T.music(o[0]); }; mc.appendChild(x); }); pn.appendChild(mc); }
    else if (panel === "end") { pn.appendChild(el("p", "tc-p", w("endText"))); var bw = btn("tc-btn pri", "moon", w("blow"), function () { T.blow(); paint(); }); if (s.blowMe) { bw.disabled = true; pn.appendChild(bw); pn.appendChild(el("p", "tc-wait", w("blowWait", { p: them }))); } else { pn.appendChild(bw); if (s.blowThem) pn.appendChild(el("p", "tc-hint", w("blowAsk", { p: them }))); } }
  }
  function cookPanel(pn, s, S, them) {
    var d = T.DISH[S.d];
    if (!d) { pn.appendChild(el("p", "tc-p", w("pick"))); var ch = el("div", "tc-chips"); Object.keys(T.DISH).forEach(function (k) { var x = el("button", "tc-chip", dishName(k)); x.type = "button"; x.onclick = function () { T.dish(k); if (B) { B.d = k; keep(B); } }; ch.appendChild(x); }); pn.appendChild(ch); return; }
    var head = el("div", "tc-dishhead"); head.appendChild(el("b", "", dishName(S.d))); var dots = el("span", "tc-dots"); dots.setAttribute("aria-hidden", "true");
    d.s.forEach(function (_, i) { dots.appendChild(el("i", i < S.s ? "on" : i === S.s ? "now" : "")); }); head.appendChild(dots); pn.appendChild(head);
    if (S.s >= d.s.length) { pn.appendChild(el("div", "tc-step served", w("serve"))); pn.appendChild(btn("tc-btn", "glass", w("raise"), function () { T.clink(); say(w("raised")); })); return; }
    pn.appendChild(el("div", "tc-step", T.tr(d.s[S.s][0])));
    var tm = el("p", "tc-timer"); tm.id = "tcTimer"; tm.hidden = T.left() < 0; pn.appendChild(tm); tick();
    var tk = el("p", "tc-ticks"); var mine = s.doneMe === S.s, theirs = s.doneThem === S.s;
    tk.appendChild(el("span", mine ? "on" : "", (mine ? "✓ " : "· ") + (T.me.name || w("you")))); tk.appendChild(el("span", theirs ? "on" : "", (theirs ? "✓ " : "· ") + them)); pn.appendChild(tk);
    var db = btn("tc-btn pri", "check", mine ? w("waitP", { p: them }) : w("done"), function () { T.done(); }); db.disabled = mine; pn.appendChild(db);
    var more = el("details", "tc-more"); more.appendChild(el("summary", "", w("need"))); var ul = el("ul", "tc-shop"); (d.i || []).forEach(function (it) { ul.appendChild(el("li", "", T.tr(it))); }); more.appendChild(ul); pn.appendChild(more);
  }
  function tick() { var e = $("tcTimer"); if (!e) return; var l = T.left(); e.hidden = l < 0; if (l >= 0) { e.textContent = Math.floor(l / 60) + ":" + ("0" + (l % 60)).slice(-2); e.classList.toggle("rang", !l); } }
  setInterval(function () { if (cur === "table") { tick(); seats(); } }, 1000);

  /* the napkin that comes across */
  function napkin(text, from) {
    var o = el("div", "tc-napkin"); o.setAttribute("role", "dialog"); o.setAttribute("aria-label", w("napkin"));
    var n = el("div", "tc-nap"); n.appendChild(el("p", "", text)); n.appendChild(el("small", "", "— " + w("from", { p: from }))); var k = btn("tc-btn", null, w("keep"), function () { o.remove(); }); n.appendChild(k); o.appendChild(n);
    o.onclick = function (e) { if (e.target === o) o.remove(); }; root.appendChild(o); setTimeout(function () { try { k.focus(); } catch (e) {} }, 60);
  }

  /* ---------- after dinner ---------- */
  function after(info) {
    var b0 = B; awake(false);
    show("after", function (m) {
      hero(m, true);
      var c = card(m, "gn"); c.appendChild(el("h1", "tc-h1", w("gn"))); if (info && info.with) c.appendChild(el("p", "tc-p", w("gnWith", { p: info.with })));
      var outs = W.out, pickd = outs[(Math.random() * outs.length) | 0]; c.appendChild(el("p", "tc-out", pickd[li()] || pickd[0]));
      var n = card(m); n.appendChild(el("h2", "tc-h2", w("nextOne"))); var o = b0 ? { o: (info && info.with) || (b0.by ? b0.o : b0.n), oz: b0.by ? b0.oz : b0.z } : null;
      var pk = picker(n, b0 && b0.w ? b0 : { w: Math.round(Date.now() / 60000), d: b0 && b0.d }, o);
      var res = el("div", "tc-acts"); n.appendChild(btn("tc-btn pri", "cal", w("nextOne"), function () {
        var nb = keep({ c: b0 ? b0.c : newCode(), w: Math.round(pk.at() / 60000), z: tz(), n: T.me.name, d: pk.dish(), by: 1, o: o && o.o || "", oz: o && o.oz || "" });
        B = nb; address(nb); T.send("book", { w: nb.w, z: nb.z, n: nb.n, d: nb.d });
        res.innerHTML = ""; res.appendChild(el("p", "tc-who", w("bookedNext", { p: nb.o || w("date") }))); res.appendChild(btn("tc-btn pri", "share", w("invite"), function () { share(nb); })); res.appendChild(btn("tc-btn", "cal", w("ics"), function () { ics(nb); }));
      })); n.appendChild(res);
      var back = card(m, "quiet"); back.appendChild(btn("tc-btn ghost", "back", w("start"), home));
    });
  }
  /* the other side booked the next one while you were still at the table, or after */
  function theirBooking(p) {
    if (!p || !/^\d{6,9}$/.test(String(p.w)) || !B) return;
    var nb = keep({ c: B.c, w: +p.w, z: String(p.z || "").slice(0, 48), n: String(p.n || "").slice(0, 20), d: T.DISH[p.d] ? p.d : (B.d || ""), by: 0, o: String(p.n || "").slice(0, 20), oz: String(p.z || "").slice(0, 48) });
    var bx = el("div", "tc-booked-note"); bx.appendChild(el("p", "", w("theyBooked", { p: nb.n || w("date"), when: fmt(when(nb), null) })));
    var r = el("div", "tc-acts"); r.appendChild(btn("tc-btn sm", "cal", w("ics"), function () { ics(nb); })); r.appendChild(btn("tc-btn sm ghost", null, w("see"), function () { T.leave(); booked(nb); })); bx.appendChild(r);
    var m = $("tcMain"); m.insertBefore(bx, m.firstChild); try { bx.scrollIntoView({ block: "nearest" }); } catch (e) {}
  }

  /* ---------- the screen stays on while you sit at the table ---------- */
  var lock = null, want = false;
  function awake(on) {
    want = on;
    if (!on) { if (lock) { try { lock.release(); } catch (e) {} lock = null; } return; }
    if (lock || document.visibilityState !== "visible" || !("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then(function (l) { if (!want) { l.release(); return; } lock = l; window.__tcWake = 1; l.addEventListener("release", function () { lock = null; window.__tcWake = 0; }); }, function () {});
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && want) awake(true); });
  addEventListener("pointerdown", function () { if (want && !lock) awake(true); });

  /* ---------- what happens at the table ---------- */
  T.on(function (ev, d) {
    if (ev === "toast") return;   /* the app says things its own way, below */
    if (cur !== "table" && cur !== "after") return;
    var them = other();
    if (ev === "hi") { var s = T.st(), fresh = !seen[s.them.id] || Date.now() - seen[s.them.id] > 50000; seen[s.them.id] = Date.now(); if (B && s.them) { var ch = false; if (B.by && (!B.o || !B.oz || B.oz !== s.them.tz)) { B.o = s.them.name; B.oz = s.them.tz; ch = true; } if (!B.by && s.them.tz && B.z !== s.them.tz) { B.oz = s.them.tz; ch = true; } if (ch) keep(B); } if (fresh) say(w("sat", { p: them })); }
    else if (ev === "bye") { say(w("left", { p: them })); }
    else if (ev === "light") say(w("theyLit", { p: them }));
    else if (ev === "lit") say(w("lit"));
    else if (ev === "clink" && !d.mine) { say(Date.now() - mineAt < 4000 ? w("clinked") : w("theyRaised", { p: them })); theirAt = Date.now(); }
    else if (ev === "clink" && d.mine) { mineAt = Date.now(); if (mineAt - theirAt < 4000) setTimeout(function () { say(w("clinked")); }, 60); }
    else if (ev === "note") napkin(d.text, d.from || them);
    else if (ev === "blow") say(w("blowAsk", { p: them }));
    else if (ev === "goodnight") { after(d); return; }
    else if (ev === "msg" && d && d.ev === "book") { theirBooking(d.p); return; }
    else if (ev === "net" && d === "bad") { if (Date.now() - lastLive > 6000) say(w("netBad")); }
    if (cur === "table" && (ev === "state" || ev === "seats" || ev === "hi" || ev === "bye" || ev === "light" || ev === "lit" || ev === "blow")) {
      var ae = document.activeElement; if (ae && ae.id === "tcNapIn") { seats(); return; }   /* don't pull the napkin from under someone writing */
      paint();
    }
  });
  var mineAt = 0, theirAt = 0, seen = {};

  /* ---------- language ---------- */
  var prevSet = window.FBL_SET;
  window.FBL_SET = function (l) { if (prevSet) prevSet(l); else if (window.FBL) FBL.set(l); chrome(); redraw(); };
  function redraw() { if (cur === "home") home(); else if (cur === "booked" && B) booked(B); else if (cur === "table") paint(); else if (cur === "after") { /* keep the line they're reading */ } }

  /* ---------- start ---------- */
  chrome();
  T.me.tz = T.me.tz || tz();
  var src = ""; try { src = HOST.location.search + HOST.location.hash; } catch (e) {}
  var inv = parse(src);
  if (inv) arrive(inv); else home();
  window.FBTwoCandles = { home: home, booked: booked, table: table, after: after, tables: tables, parse: parse, link: link, ics: ics, B: function () { return B; } };   /* test hook */
})();
