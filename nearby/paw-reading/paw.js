/* Paw Reading's deck, shared by the town's stall (/nearby/paw-reading/) and the app (/paw-reading/): window.FBPaw.
   One card a day per device (localStorage fb_paw: { d: "Y-M-D" on the browser's calendar, i: 0–53, f: who drew it for you,
   p: 1 once it's in your pocket }), so a card drawn in town is today's card in the app and the other way round. Nothing here
   is sent anywhere. Each card asks one thing of you, somewhere real (ASK by suit: ♥ together, ♦ make, ♣ the wild, ♠ Popo's
   tin; aces, Mei/Popo/Wei and the jokers have their own), and most carry one way to start it off the screen (GO):
   a line to send someone (`line`), a place to find in your own maps (`maps`), or one minute with the phone face down (`minute`). */
(function () {
  "use strict";
  var SUIT = ["h", "d", "c", "s"], RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  /* what each card asks of you: three asks a suit, the rank picks one (n % 3) */
  var ASK = {
    h: [["Someone you haven't called in a while is thinking of you. Call first.", "有个很久没联系的人正在想你。你先打过去。", "有個很久沒聯絡的人正在想你。你先打過去。", "Alguien a quien hace tiempo que no llamas piensa en ti. Llama tú primero.", "Algú a qui fa temps que no truques pensa en tu. Truca tu primer."],
        ["Cook for two tonight, even if the second one is a neighbour.", "今晚做两人份的饭，哪怕另一份是给邻居的。", "今晚做兩人份的飯，哪怕另一份是給鄰居的。", "Cocina para dos esta noche, aunque la segunda sea una vecina.", "Cuina per a dos aquest vespre, encara que la segona sigui una veïna."],
        ["Say thank you, out loud, to someone who never hears it.", "对一个很少听到谢谢的人，大声说一句谢谢。", "對一個很少聽到謝謝的人，大聲說一句謝謝。", "Da las gracias, en voz alta, a alguien que nunca las oye.", "Dona les gràcies, en veu alta, a algú que no les sent mai."]],
    d: [["Make something small with your hands and give it away.", "亲手做一样小东西，然后送出去。", "親手做一樣小東西，然後送出去。", "Haz algo pequeño con las manos y regálalo.", "Fes alguna cosa petita amb les mans i regala-la."],
        ["Mend one broken thing today. Gold is optional.", "今天修好一样坏掉的东西。金子可有可无。", "今天修好一樣壞掉的東西。金子可有可無。", "Arregla hoy una cosa rota. El oro es opcional.", "Adoba avui una cosa trencada. L'or és opcional."],
        ["Write a few lines to someone, on paper.", "给某个人写几行字，写在纸上。", "給某個人寫幾行字，寫在紙上。", "Escribe unas líneas a alguien, en papel.", "Escriu unes ratlles a algú, en paper."]],
    c: [["Go outside before dark and look up for one whole minute.", "天黑前出门，抬头看整整一分钟。", "天黑前出門，抬頭看整整一分鐘。", "Sal antes de que oscurezca y mira arriba un minuto entero.", "Surt abans que es faci fosc i mira amunt un minut sencer."],
        ["Walk somewhere you've never walked, slowly.", "慢慢走一条你从没走过的路。", "慢慢走一條你從沒走過的路。", "Camina por donde nunca has caminado, despacio.", "Camina per on no has caminat mai, a poc a poc."],
        ["Find a tree you like. Visit it again next week.", "找一棵你喜欢的树，下周再去看它。", "找一棵你喜歡的樹，下週再去看它。", "Busca un árbol que te guste. Vuelve a verlo la semana que viene.", "Busca un arbre que t'agradi. Torna a veure'l la setmana que ve."]],
    s: [["Ask someone older in your family how they met someone.", "问问家里长辈，他们是怎么认识某个人的。", "問問家裡長輩，他們是怎麼認識某個人的。", "Pregúntale a alguien mayor de tu familia cómo conoció a alguien.", "Pregunta a algú gran de la teva família com va conèixer algú."],
        ["Keep one thing from today: a ticket, a leaf, a note.", "从今天留下一样东西：一张票、一片叶子、一张纸条。", "從今天留下一樣東西：一張票、一片葉子、一張紙條。", "Guarda una cosa de hoy: un billete, una hoja, una nota.", "Guarda una cosa d'avui: un bitllet, una fulla, una nota."],
        ["Look at an old photo with someone who's in it.", "和照片里的人一起看一张老照片。", "和照片裡的人一起看一張老照片。", "Mira una foto vieja con alguien que sale en ella.", "Mira una foto vella amb algú que hi surt."]]
  };
  var ACE = ["A new start, close by: say hello to someone on your street.", "新的开始就在身边：跟街上的某个人打声招呼。", "新的開始就在身邊：跟街上的某個人打聲招呼。", "Un comienzo nuevo, cerca: saluda a alguien de tu calle.", "Un començament nou, a prop: saluda algú del teu carrer."];
  var COURT = {
    J: ["Mei says: put the phone down and actually go. (She's on hers.)", "Mei 说：把手机放下，真的出门去。（她自己在玩手机。）", "Mei 說：把手機放下，真的出門去。（她自己在滑手機。）", "Mei dice: deja el móvil y ve de verdad. (Ella está con el suyo.)", "La Mei diu: deixa el mòbil i ves-hi de debò. (Ella és amb el seu.)"],
    Q: ["Popo says: eat something proper. Then call your mama.", "婆婆说：好好吃顿饭。然后给你妈妈打个电话。", "婆婆話：好好食餐飯。然後打個電話俾你阿媽。", "Popo dice: come algo como Dios manda. Luego llama a tu mamá.", "La Popo diu: menja alguna cosa com cal. Després truca a la teva mare."],
    K: ["Wei says: take someone for a drink, and talk until the ice melts.", "Wei 说：约个人去喝一杯，聊到冰块化掉。", "Wei 說：約個人去喝一杯，聊到冰塊化掉。", "Wei dice: invita a alguien a una copa y hablad hasta que se derrita el hielo.", "En Wei diu: convida algú a una copa i parleu fins que es fongui el gel."]
  };
  var JOKER = [["The cats knock the deck off the table. Today: a nap. A real one.", "猫把整副牌推下了桌。今天：睡个午觉，真的睡。", "貓把整副牌推下了桌。今天：睡個午覺，真的睡。", "Los gatos tiran la baraja de la mesa. Hoy: una siesta. De verdad.", "Els gats tiren la baralla de la taula. Avui: una migdiada. De debò."],
    ["Mantou drops his ball at your feet. Go for a walk with someone.", "馒头把球放在你脚边。找个人一起去散步。", "饅頭把球放在你腳邊。找個人一起去散步。", "Mantou deja la pelota a tus pies. Sal a pasear con alguien.", "En Mantou et deixa la pilota als peus. Surt a passejar amb algú."]];

  /* one way to start it, for real. A line is written for the person you send it to; a maps search is in your own language. */
  var L = {
    call: ["Thinking of you. Free for a call later?", "想你了。晚点方便打个电话吗？", "想你了。晚點方便打個電話嗎？", "Pensando en ti. ¿Te llamo luego?", "Pensant en tu. Et truco després?"],
    old: ["Can I call you this week? I want to ask you how you two met.", "这周能给你打个电话吗？想问问你们当年是怎么认识的。", "這週能給你打個電話嗎？想問問你們當年是怎麼認識的。", "¿Te llamo esta semana? Quiero preguntarte cómo os conocisteis.", "Et puc trucar aquesta setmana? Et vull preguntar com us vau conèixer."],
    photo: ["Found an old photo of us. Coffee this week so I can show you?", "翻到一张我们的老照片。这周一起喝杯咖啡，给你看看？", "翻到一張我們的老照片。這週一起喝杯咖啡，給你看看？", "He encontrado una foto vieja nuestra. ¿Un café esta semana y te la enseño?", "He trobat una foto vella nostra. Un cafè aquesta setmana i te l'ensenyo?"],
    mama: ["Just thinking of you, Mum. Call you tonight?", "妈，想你了。今晚给你打电话好吗？", "媽，想你了。今晚給你打電話好嗎？", "Mamá, pensaba en ti. ¿Te llamo esta noche?", "Mama, pensava en tu. Et truco aquest vespre?"],
    drink: ["A drink this week? My treat. No phones.", "这周喝一杯？我请。不看手机。", "這週喝一杯？我請。不看手機。", "¿Una copa esta semana? Invito yo. Sin móviles.", "Una copa aquesta setmana? Convido jo. Sense mòbils."],
    walk: ["Walk later? Just round the block.", "晚点一起散个步？就在附近转一圈。", "晚點一起散個步？就在附近轉一圈。", "¿Un paseo luego? Solo una vuelta a la manzana.", "Una passejada després? Només una volta a l'illa."],
    cook: ["I'm cooking too much tonight. Come and eat?", "我今晚做多了，过来一起吃？", "我今晚煮多了，過來一起吃？", "Esta noche cocino de más. ¿Vienes a cenar?", "Aquest vespre cuino de més. Vens a sopar?"]
  };
  var Q = {
    market: ["market", "菜市场", "菜市場", "mercado", "mercat"],
    craft: ["craft shop", "手工材料店", "手工材料店", "tienda de manualidades", "botiga de manualitats"],
    repair: ["repair café", "维修店", "維修店", "repair café", "repair cafè"],
    post: ["post office", "邮局", "郵局", "correos", "oficina de correus"],
    park: ["park", "公园", "公園", "parque", "parc"],
    garden: ["botanical garden", "植物园", "植物園", "jardín botánico", "jardí botànic"]
  };
  var GO = {
    h: [{ k: "line", l: L.call }, { k: "line", l: L.cook, q: Q.market }, null],
    d: [{ k: "maps", q: Q.craft }, { k: "maps", q: Q.repair }, { k: "maps", q: Q.post }],
    c: [{ k: "minute" }, { k: "maps", q: Q.park }, { k: "maps", q: Q.garden }],
    s: [{ k: "line", l: L.old }, null, { k: "line", l: L.photo }]
  };
  var GO_COURT = { J: null, Q: { k: "line", l: L.mama }, K: { k: "line", l: L.drink } };
  var GO_JOKER = [null, { k: "line", l: L.walk }];

  /* the card's own name, for a line that says what was drawn ("the 7 of hearts") */
  var SN = { h: ["hearts", "红心", "紅心", "corazones", "cors"], d: ["diamonds", "方块", "方塊", "diamantes", "diamants"], c: ["clubs", "梅花", "梅花", "tréboles", "trèvols"], s: ["spades", "黑桃", "黑桃", "picas", "piques"] };
  var RN = { A: ["Ace", "A", "A", "As", "As"], J: ["Jack", "J", "J", "Jota", "Valet"], Q: ["Queen", "Q", "Q", "Reina", "Reina"], K: ["King", "K", "K", "Rey", "Rei"] };
  var JN = [["the Miso & Yuzu joker", "味噌和柚子那张鬼牌", "味噌和柚子那張鬼牌", "el comodín de Miso y Yuzu", "el comodí de la Miso i la Yuzu"],
    ["the Mantou joker", "馒头那张鬼牌", "饅頭那張鬼牌", "el comodín de Mantou", "el comodí d'en Mantou"]];
  function cardName(c, li) {
    if (c.joker != null) return JN[c.joker][li];
    var r = RN[c.r] ? RN[c.r][li] : c.r, s = SN[c.s][li];
    return li === 0 ? "the " + r + " of " + s : li < 3 ? s + r : li === 3 ? "el " + r + " de " + s : (/^[AEIOU]/i.test(r) ? "l'" : "el ") + r + " de " + s;
  }

  function cardOf(i) { var s = Math.floor(i / 13), r = i % 13; return i >= 52 ? { i: i, joker: i - 52 } : { i: i, s: SUIT[s], r: RANKS[r], n: r + 1 }; }
  function askOf(c) { if (c.joker != null) return JOKER[c.joker]; if (c.r === "A") return ACE; if (COURT[c.r]) return COURT[c.r]; return ASK[c.s][c.n % 3]; }
  function goOf(c) { if (c.joker != null) return GO_JOKER[c.joker]; if (c.r === "A") return null; if (c.r in GO_COURT) return GO_COURT[c.r]; return GO[c.s][c.n % 3]; }
  function img(i, base) { return (base || "/nearby/paw-reading/cards/") + (i < 10 ? "0" : "") + i + ".png"; }

  /* the day, on the browser's own calendar (the town's format, kept as it was) */
  function day(d) { d = d || new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function read() { try { var v = JSON.parse(localStorage.getItem("fb_paw") || "null"); return v && typeof v.i === "number" && v.i >= 0 && v.i < 54 ? v : null; } catch (e) { return null; } }
  function today() { var v = read(); return v && v.d === day() ? v : null; }
  function keep(v) { try { localStorage.setItem("fb_paw", JSON.stringify(v)); } catch (e) {} return v; }
  function draw(from) { var t = today(); if (t) return t; return keep({ d: day(), i: (Math.random() * 54) | 0 }); }
  function take(i, from) { var t = today(); if (t) return t; var v = { d: day(), i: i }; if (from) v.f = String(from).slice(0, 24); return keep(v); }
  function pocket(on) { var t = today(); if (!t) return null; if (on) t.p = 1; else delete t.p; return keep(t); }

  /* "Draw with someone": the card and its day travel in the link's #, nothing else (no list, nothing stored anywhere) */
  function pack(v, nick) { var h = "with=" + v.i + "." + v.d; if (nick) h += "&from=" + encodeURIComponent(String(nick).slice(0, 24)); return h; }
  function unpack(hash) {
    var m = /[#&]with=(\d{1,2})\.(\d{4}-\d{1,2}-\d{1,2})/.exec(hash || ""); if (!m) return null;
    var i = +m[1]; if (i < 0 || i > 53) return null;
    var f = /[#&]from=([^&]*)/.exec(hash), from = ""; try { from = f ? decodeURIComponent(f[1]).replace(/[<>]/g, "").slice(0, 24) : ""; } catch (e) {}
    return { i: i, d: m[2], from: from, fresh: m[2] === day() };
  }

  window.FBPaw = { SUIT: SUIT, RANKS: RANKS, ASK: ASK, ACE: ACE, COURT: COURT, JOKER: JOKER, cardOf: cardOf, askOf: askOf, goOf: goOf, cardName: cardName, img: img,
    day: day, read: read, today: today, draw: draw, take: take, pocket: pocket, pack: pack, unpack: unpack };
})();
