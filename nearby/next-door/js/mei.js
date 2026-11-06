/* Mei behind the counter: Wei's cousin from New York, about sixteen. When Wei is travelling, asleep or out in town and she's up
   (12:00–02:00 town time, FBWorld.host), she keeps the bar: coffee, tea and things without alcohol (the cocktails wait for
   Wei), and sometimes she's on her phone and you wait a beat. */
(function () {
  var W = window.FBWorld; if (!W || !W.host || !W.drawMei) return;
  var M = function (en, zh, tw, es, ca) { return lx([en, zh, tw, tw, es, ca]); };
  var T = {
    head: M("MEI'S ON", "MEI 值班", "MEI 值班", "MEI DE TURNO", "LA MEI DE TORN"),
    hi: [M("*one earbud out* Hey. Wei's off. Coffee? Tea? Something without? I don't do cocktails, I'm sixteen.", "*摘下一只耳机* 嘿。Wei 不在。咖啡？茶？无酒精的？鸡尾酒我不调，我才十六。", "*摘下一隻耳機* 嘿。Wei 不在。咖啡？茶？無酒精的？雞尾酒我不調，我才十六。", "*se quita un auricular* Ey. Wei no está. ¿Café? ¿Té? ¿Algo sin alcohol? Cócteles no, tengo dieciséis.", "*es treu un auricular* Ei. En Wei no hi és. Cafè? Te? Alguna cosa sense alcohol? Còctels no, tinc setze anys."),
      M("*spins on the stool* Mei's on. Lucky you. What can I get you that isn't booze?", "*在高脚凳上转了一圈* Mei 值班。算你走运。除了酒，想喝什么？", "*在高腳凳上轉了一圈* Mei 值班。算你走運。除了酒，想喝什麼？", "*gira en el taburete* Turno de Mei. Qué suerte. ¿Qué te pongo que no lleve alcohol?", "*fa una volta al tamboret* Torn de la Mei. Quina sort. Què et poso que no porti alcohol?"),
      M("*wipes the counter, badly* Wei says wipe in circles. I say the counter's clean. What'll it be?", "*胡乱擦着吧台* Wei 说要画圈擦。我说吧台已经干净了。喝点什么？", "*胡亂擦著吧台* Wei 說要畫圈擦。我說吧台已經乾淨了。喝點什麼？", "*limpia la barra, fatal* Wei dice que en círculos. Yo digo que ya está limpia. ¿Qué va a ser?", "*neteja la barra, fatal* En Wei diu que en cercles. Jo dic que ja és neta. Què serà?")],
    woke: M("*lifts her head, an earbud falls out* …ugh. Fine. I'm up. What do you want?", "*抬起头，一只耳机掉了出来* ……烦。行吧，我醒了。要什么？", "*抬起頭，一隻耳機掉了出來* ……煩。好啦，我醒了。要什麼？", "*levanta la cabeza, se le cae un auricular* …uf. Vale. Ya estoy. ¿Qué quieres?", "*aixeca el cap, li cau un auricular* …uf. Vale. Ja estic. Què vols?"),
    scroll: M("*doesn't look up from her phone* …one sec. Literally one.", "*头也不抬地刷着手机* ……等一下。真的就一下。", "*頭也不抬地滑著手機* ……等一下。真的就一下。", "*no levanta la vista del móvil* …un segundo. Literalmente uno.", "*no aixeca la vista del mòbil* …un segon. Literalment un."),
    sorry: M("*phone face down* Okay. Sorry. I'm here. What do you want?", "*把手机扣下* 好，抱歉，我在。要什么？", "*把手機扣下* 好，抱歉，我在。要什麼？", "*móvil boca abajo* Vale. Perdón. Aquí estoy. ¿Qué quieres?", "*mòbil cap per avall* D'acord. Perdó. Sóc aquí. Què vols?"),
    ask: M("Ask Mei for something", "找 Mei 要点喝的", "找 Mei 要點喝的", "Pídele algo a Mei", "Demana-li alguna cosa a la Mei"),
    booze: M("A cocktail", "来杯鸡尾酒", "來杯雞尾酒", "Un cóctel", "Un còctel"),
    noBooze: M("Wei pours those. I'm sixteen, not stupid. Coffee, tea, or something without?", "那些得 Wei 来调。我十六岁，又不傻。咖啡、茶，还是无酒精的？", "那些得 Wei 來調。我十六歲，又不傻。咖啡、茶，還是無酒精的？", "Eso lo sirve Wei. Tengo dieciséis, no soy tonta. ¿Café, té o algo sin alcohol?", "Això ho serveix en Wei. Tinc setze anys, no sóc tonta. Cafè, te o alguna cosa sense alcohol?"),
    nap: [M("*Mei, asleep on the counter, one earbud still in. Her phone buzzes face down beside her. Miso is asleep on her sleeve.*", "*Mei 趴在吧台上睡着了，一只耳机还戴着。手机扣在旁边嗡嗡震。Miso 枕着她的袖子睡着了。*", "*Mei 趴在吧台上睡著了，一隻耳機還戴著。手機扣在旁邊嗡嗡震。Miso 枕著她的袖子睡著了。*", "*Mei, dormida sobre la barra, con un auricular puesto. El móvil vibra boca abajo a su lado. Miso duerme sobre su manga.*", "*La Mei, adormida damunt la barra, amb un auricular posat. El mòbil vibra cap per avall al seu costat. En Miso dorm damunt la seva màniga.*"),
      M("*Mei's asleep with her cheek on the bar and a note taped to the till: 'WEI'S AWAY. BACK AT NOON. DON'T.'*", "*Mei 脸贴着吧台睡着了，收银机上贴着纸条：“WEI 出门了。中午回来。别吵。”*", "*Mei 臉貼著吧台睡著了，收銀機上貼著紙條：「WEI 出門了。中午回來。別吵。」*", "*Mei duerme con la mejilla en la barra y una nota en la caja: 'WEI DE VIAJE. VUELVO A MEDIODÍA. NI LO INTENTES.'*", "*La Mei dorm amb la galta a la barra i una nota a la caixa: 'EN WEI ÉS FORA. TORNO A MIGDIA. NI HO PROVIS.'*")],
    napHead: M("MEI'S ASLEEP", "MEI 睡着了", "MEI 睡著了", "MEI DUERME", "LA MEI DORM"),
  };
  function on() {
    var d = W.host();
    return d.who === "mei" && !d.asleep && !(window.WeiAway && WeiAway.on());   /* she's here only on her visits (FBWorld.host: one host per visit), and not while she's out */
  }
  /* Wei's travelling and it's Mei's night (02:00–12:00): the top bar shows her asleep, so the bar does too: head on the counter */
  function napping() { try { var d = W.host(); return d.who === "mei" && d.asleep && !(window.WeiAway && WeiAway.on()); } catch (e) { return false; } }
  var css = document.createElement("style");
  css.textContent = "#mei-avatar{display:none;width:66px;height:74px;image-rendering:pixelated}body.mei-on #mei-avatar{display:block}body.mei-on #svg-wei-avatar,body.mei-on:not(.mei-nap) #wei-zzz-particles{display:none!important}body.mei-on:not(.wei-away) #wei-anchor{visibility:visible!important}@media (min-width:768px){#mei-avatar{width:92px;height:104px}}";
  document.head.appendChild(css);
  var cv = document.createElement("canvas"); cv.id = "mei-avatar"; cv.width = 32; cv.height = 36; cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "Mei");
  var holder = document.getElementById("sprite-wei-container"); if (holder) holder.appendChild(cv);
  var phoneUntil = 0;
  function paint() { var g = cv.getContext("2d"); g.clearRect(0, 0, 32, 36); W.drawMei(g, 0, 3, 1, { phone: Date.now() < phoneUntil, asleep: document.body.classList.contains("mei-nap") }); }
  function say(t) { try { if (!(window.NDSay && NDSay(t))) setText("sleep-story-text", t); } catch (e) {} }
  var napT = -1, napShown = -2;
  function dress() {
    var z = !on() && napping(); document.body.classList.toggle("mei-nap", z);
    if (z) { document.body.classList.add("mei-on"); paint(); var hn0 = document.getElementById("host-name"); if (hn0) hn0.textContent = "Mei";
      try { setText("sleep-header-title", L(T.napHead)); setText("sleep-header-badge", ""); var w0 = document.getElementById("sleep-wake"); if (w0) w0.style.display = "none"; if (napT < 0) napT = (Math.random() * T.nap.length) | 0; if (napShown !== napT) { napShown = napT; setText("sleep-story-text", L(T.nap[napT])); } } catch (e) {}
      return; }
    var x = on(); document.body.classList.toggle("mei-on", x); var hn = document.getElementById("host-name"); if (hn && (x || W.host().who === "wei")) hn.textContent = x ? "Mei" : "Wei"; if (!x) return;
    paint();
    try { setText("sleep-header-title", L(T.head)); setText("sleep-header-badge", ""); var w = document.getElementById("sleep-wake"); if (w) w.style.display = "none";
      setText("sleep-btn-cats", L(T.ask)); } catch (e) {}
  }
  /* Mei makes the coffee herself, and her coffee is very bad: the card says what actually arrived */
  T.tried = M("Mei's attempt: ", "Mei 尝试的", "Mei 嘗試的", "Intento de Mei: ", "Intent de la Mei: ");
  T.bad = [M("\"It's lukewarm, somehow also burnt, and there's a pink hair tie in the saucer.\"", "\"温吞吞的，却又有股焦味，碟子里还躺着一根粉色发圈。\"", "\"溫吞吞的，卻又有股焦味，碟子裡還躺著一根粉紅色髮圈。\"", "\"Está tibio, de algún modo también quemado, y hay una goma de pelo rosa en el platito.\"", "\"És tebi, i d'alguna manera també cremat, i hi ha una goma de cabell rosa al platet.\""),
    M("\"The foam was supposed to be a heart. It is a potato.\"", "\"奶泡本来要拉成一颗心。结果是个土豆。\"", "\"奶泡本來要拉成一顆心。結果是個馬鈴薯。\"", "\"La espuma debía ser un corazón. Es una patata.\"", "\"L'escuma havia de ser un cor. És una patata.\""),
    M("\"Three sugars. You didn't ask for sugar.\"", "\"放了三块糖。你没要糖。\"", "\"放了三顆糖。你沒要糖。\"", "\"Tres azúcares. No pediste azúcar.\"", "\"Tres sucres. No n'has demanat.\""),
    M("\"It tastes like the bottom of the machine. Mei is watching your face.\"", "\"喝起来像咖啡机的底。Mei 正盯着你的表情。\"", "\"喝起來像咖啡機的底。Mei 正盯著你的表情。\"", "\"Sabe al fondo de la máquina. Mei te mira la cara.\"", "\"Té gust del fons de la màquina. La Mei t'observa la cara.\""),
    M("\"Mostly ice. She says that's how they do it in New York.\"", "\"大部分是冰。她说纽约都是这么做的。\"", "\"大部分是冰。她說紐約都是這樣做的。\"", "\"Casi todo hielo. Dice que así se hace en Nueva York.\"", "\"Gairebé tot gel. Diu que a Nova York es fa així.\""),
    M("\"The tea bag is still in. So is the label. So is, briefly, her phone.\"", "\"茶包还在里面。标签也在。她的手机也短暂地掉进去过。\"", "\"茶包還在裡面。標籤也在。她的手機也短暫地掉進去過。\"", "\"La bolsita sigue dentro. La etiqueta también. Su móvil, por un momento, también.\"", "\"La bossa de te encara hi és. L'etiqueta també. El seu mòbil, per un moment, també.\"")];
  T.served = M("*slides it over and watches you* …Well? Be nice. Wei makes it look easy.", "*把杯子推过来，盯着你* ……怎样？说点好听的。Wei 做起来看着很简单。", "*把杯子推過來，盯著你* ……怎樣？說點好聽的。Wei 做起來看著很簡單。", "*te lo desliza y te mira* …¿Y bien? Sé amable. Wei hace que parezca fácil.", "*te'l llisca i et mira* …I bé? Sigues amable. En Wei fa que sembli fàcil.");
  window.NDMeiMenu = function () { return Object.keys(DrinkManifest).filter(function (k) { return DrinkManifest[k].type === "cafe"; }).map(function (k) { var d = DrinkManifest[k]; return { ic: d.icon || "", name: L(d.name), desc: L(d.desc).replace(/^"|"$/g, ""), real: k, go: function () { NDMeiMake(k); } }; }).concat([{ ic: "", name: L(T.booze), desc: "", go: function () { say(L(T.noBooze)); } }]); };
  window.NDMeiMake = function (k) { var d = DrinkManifest[k]; if (!d || d.type === "bar") { say(L(T.noBooze)); return; } serveItemByKey(k); badCoffee(); setTimeout(function () { say(L(T.served)); }, 900); };
  function badCoffee() { try { var n = document.getElementById("res-name"), d = document.getElementById("res-description"); if (n && n.textContent.indexOf(L(T.tried)) !== 0) n.textContent = L(T.tried) + n.textContent; if (d) d.textContent = L(T.bad[(Math.random() * T.bad.length) | 0]); } catch (e) {} }
  /* tap her: hello, or (sometimes) she's on her phone and you wait a beat */
  var tap0 = window.tapBartender;
  window.tapBartender = function () {
    if (napping() && !on()) {   /* the second tap wakes her (grumpily); she stays up a while, like Wei */
      if (napT >= 0 && W.wake && W.wake()) { dress(); try { renderCurrentDialogue(); } catch (e) {} say(L(T.woke)); return; }
      napShown = napT = (napT + 1) % T.nap.length; say(L(T.nap[napT])); return; }
    if (!on()) return tap0.apply(this, arguments);
    phoneUntil = Date.now() + 2600; paint(); say(L(T.scroll)); setTimeout(function () { phoneUntil = 0; paint(); say(L(T.sorry)); }, 2600);
  };
  /* Wei travelling (FBWorld.host says Mei's day): behind the counter it's as if he were out, whatever the hour */
  T.trav = M("WEI'S TRAVELLING", "WEI 出门旅行了", "WEI 出門旅行了", "WEI ESTÁ DE VIAJE", "EN WEI ÉS DE VIATGE");
  var eval1 = window.evaluateWeiState;
  window.evaluateWeiState = function () { var r = eval1.apply(this, arguments); try { if (W.weiTravelling() && AppState.weiState !== "asleep") { AppState.weiState = "asleep"; if (typeof Cats !== "undefined" && Cats.st) Cats.syncSleep(); } } catch (e) {} return r; };
  try { if (W.weiTravelling()) evaluateWeiState(); } catch (e) {}
  var render0 = window.renderCurrentDialogue;
  window.renderCurrentDialogue = function () { var r = render0.apply(this, arguments); if (!on() && W.weiTravelling() && !(window.WeiAway && WeiAway.on())) { try { setText("sleep-header-title", L(T.trav)); setText("sleep-header-badge", ""); } catch (e) {} } if (on()) { dress(); say(L(T.hi[(Math.random() * T.hi.length) | 0])); } else if (napping()) { napShown = -2; dress(); } return r; };
  /* now and then, between visitors, she checks her phone */
  setInterval(function () { if (!on() || document.hidden) return; if (Math.random() < .25) { phoneUntil = Date.now() + 5000 + Math.random() * 6000; paint(); setTimeout(paint, phoneUntil - Date.now() + 50); } }, 15000);
  setInterval(dress, 5000); setTimeout(function () { dress(); try { if (on() && AppState.inSanctuary) renderCurrentDialogue(); } catch (e) {} }, 800);
})();
