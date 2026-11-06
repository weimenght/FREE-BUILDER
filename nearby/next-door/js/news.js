/* Wei knows everywhere and everything in town, and always shares: live news from every place, plus where to go next. */
(function () {
  /* Fallback names only: the real names come from FBWorld.PLACES (build/fbl.js). [EN, 简中, ES, CA, url] */
  const P = {
    bar: ["Next Door", "隔壁", "Al Lado", "Al Costat", "/nearby/next-door/"], books: ["Borrowed Pages", "借来的书", "Páginas Prestadas", "Pàgines Manllevades", "/nearby/borrowed-pages/"],
    jukebox: ["Same Song", "同一首歌", "La Misma Canción", "La Mateixa Cançó", "/nearby/same-song/"], postcard: ["Say Hello", "问个好", "Di Hola", "Digues Hola", "/nearby/say-hello/"], kintsugi: ["Mended", "金缮坊", "Remendado", "Adobat", "/nearby/mended/"],
    tower: ["Slow Clock", "慢钟", "Reloj Lento", "Rellotge Lent", "/nearby/slow-clock/"], train: ["Nearby Station", "近邻站", "Estación Cerca", "Estació A Prop", "/nearby/station/"], dj: ["Late Light", "夜灯", "Luz Tardía", "Llum Tardana", "/nearby/late-light/"],
    climb: ["Hold On", "抓稳", "Agárrate", "Agafa't", "/nearby/hold-on/"], cloud: ["Lie Back Park", "看云坡", "Parque Panza Arriba", "Parc Panxa Enlaire", "/nearby/lie-back/"], nest: ["Miso & Yuzu's", "味噌和柚子家", "Casa de Miso y Yuzu", "Cal Miso i la Yuzu", "/nearby/miso-and-yuzu/"],
    garden: ["Plant a Friend", "种个朋友", "Planta un Amigo", "Planta un Amic", "/nearby/plant-a-friend/"], sanctuary: ["Come Home", "回家吧", "Vuelve a Casa", "Torna a Casa", "/nearby/come-home/"], brewery: ["Neighbours' Brew", "邻家酿", "Cerveza Vecina", "Cervesa Veïna", "/nearby/neighbours-brew/"],
    restaurant: ["Two Candles", "双烛小馆", "Dos Velas", "Dues Espelmes", "/nearby/two-candles/"], cabin: ["No Hurry", "不急", "Sin Prisa", "Sense Pressa", "/nearby/no-hurry/"], meadow: ["Wildflower Meadow", "野花草甸", "Prado de Flores", "Prat de Flors", "/nearby/lie-back/?place=meadow"],
    lake: ["Mirror Lake", "镜湖", "Lago Espejo", "Llac Mirall", "/nearby/lie-back/?place=lake"], sea: ["Sandy Cove", "沙湾", "Cala de Arena", "Cala de Sorra", "/nearby/lie-back/?place=sea"], forest: ["Pine Wood", "松林", "Pinar", "Pineda", "/nearby/lie-back/?place=forest"],
    pasture: ["High Pasture", "高山牧场", "Pasto Alto", "Pastura Alta", "/nearby/lie-back/?place=mountain"], peaks: ["Snow Peaks", "雪峰", "Picos Nevados", "Cims Nevats", "/nearby/lie-back/?place=snow"]
  };
  const pn = k => (window.FBWorld && FBWorld.name && FBWorld.PLACES[k]) ? FBWorld.name(k, { en: 'en', zh: 'zh', tw: 'zh-Hant', yue: 'zh-Hant', es: 'es', ca: 'ca' }[AppState.lang] || 'en') : L(lx([P[k][0], P[k][1], '', '', P[k][2], P[k][3]]));
  const S = (en, zh, es, ca) => lx([en, zh, '', '', es, ca]);
  const fill = (o, v) => L(o).replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? v[k] : m);
  const UI = { go: S("Take me there →", "带我去 →", "Llévame →", "Porta-m'hi →"), more: S("And what else?", "还有呢？", "¿Y qué más?", "I què més?"), back: S("← Back", "← 返回", "← Volver", "← Tornar") };
  const LINE = {
    cats: S("\"Miso's at {a} today and Yuzu's at {b}. They'll be back for dinner. They always are.\"", "\"今天味噌在{a}，柚子在{b}。晚饭前会回来的，每次都是。\"", "\"Hoy Miso está en {a} y Yuzu en {b}. Volverán para cenar. Siempre vuelven.\"", "\"Avui la Miso és a {a} i la Yuzu a {b}. Tornaran per sopar. Sempre tornen.\""),
    catsTogether: S("\"Miso and Yuzu wandered off to {a} together. Go and say hi.\"", "\"味噌和柚子一起溜去{a}了。去打个招呼吧。\"", "\"Miso y Yuzu se fueron juntas a {a}. Ve a saludarlas.\"", "\"La Miso i la Yuzu han marxat juntes a {a}. Ves a saludar-les.\""),
    dog: S("\"Mantou's at {a}. Bring a ball. He'll pretend he doesn't want it.\"", "\"馒头在{a}。带个球去，它会假装不想玩。\"", "\"Mantou está en {a}. Llévale una pelota. Fingirá que no la quiere.\"", "\"En Mantou és a {a}. Porta-li una pilota. Farà veure que no la vol.\""),
    beerNew: S("\"{b} just brewed {n}, a fresh {s}. {w}\"", "\"{b} 刚酿了一款叫{n}的{s}。{w}\"", "\"{b} acaba de elaborar {n}, una {s} recién hecha. {w}\"", "\"{b} acaba d'elaborar {n}, una {s} acabada de fer. {w}\""),
    beerHere: S("I've got it on tap.", "我这儿就有。", "La tengo de barril.", "La tinc de barril."), beerClub: S("Late Light has it.", "“夜灯”那边有。", "La tienen en Luz Tardía.", "La tenen a Llum Tardana."), beerNone: S("Nobody's pouring it yet.", "还没地方卖。", "Aún nadie la sirve.", "Encara ningú la serveix."),
    noBeer: S("\"The kettles at Neighbours' Brew are cold. Nobody has brewed a beer yet. Be the first; I'll put it on tap.\"", "\"“邻家酿”的锅还是凉的，还没人酿过。你来当第一个吧，我给你上架。\"", "\"Las ollas de Cerveza Vecina están frías. Nadie ha elaborado aún. Sé el primero; la pongo de barril.\"", "\"Les olles de Cervesa Veïna són fredes. Encara ningú n'ha elaborat. Sigues el primer; la poso de barril.\""),
    garden: S("\"Things are growing at Plant a Friend. Somebody planted near the edge this morning.\"", "\"“种个朋友”里长着好些东西。今早还有人在边上种了新的。\"", "\"Crecen cosas en Planta un Amigo. Esta mañana alguien plantó cerca del borde.\"", "\"Creixen coses a Planta un Amic. Aquest matí algú ha plantat a prop de la vora.\""),
    gardenNone: S("\"Plant a Friend is still bare soil. One seed and it starts.\"", "\"“种个朋友”还是一片空地。种下一颗种子，它就开始了。\"", "\"Planta un Amigo aún es tierra. Una semilla y empieza.\"", "\"Planta un Amic encara és terra. Una llavor i comença.\""),
    sanctuary: S("\"Animals waiting for a home at Come Home: {n}. Real ones. Have a look.\"", "\"“回家吧”有 {n} 只动物在等一个家，都是真的。去看看吧。\"", "\"Animales esperando hogar en Vuelve a Casa: {n}. De verdad. Echa un vistazo.\"", "\"Animals esperant llar a Torna a Casa: {n}. De debò. Fes-hi un cop d'ull.\""),
    sanctuaryNone: S("\"The adoption board at Come Home is empty today. That's good news, mostly.\"", "\"今天“回家吧”的领养板是空的。多半是好消息。\"", "\"El tablón de adopciones de Vuelve a Casa está vacío hoy. Buena señal, casi siempre.\"", "\"El tauler d'adopcions de Torna a Casa és buit avui. Bon senyal, gairebé sempre.\""),
    wall: S("\"There are postcards on our Wall. One of them made me laugh.\"", "\"我们墙上挂着明信片，有一张把我逗笑了。\"", "\"Hay postales en nuestro muro. Una me hizo reír.\"", "\"Hi ha postals al nostre mur. Una m'ha fet riure.\""),
    wallNone: S("\"Our Wall's waiting for its first postcard. Say Hello can seal one until any day you like.\"", "\"墙上还在等第一张明信片。“问个好”可以帮你封存到任何一天。\"", "\"Nuestro muro espera su primera postal. En Di Hola te la sellan hasta el día que quieras.\"", "\"El nostre mur espera la primera postal. A Digues Hola te la segellen fins al dia que vulguis.\""),
    weather: S("\"It's {w} out there tonight. Don't like it? Slow Clock can change the sky.\"", "\"今晚外面{w}。不喜欢？“慢钟”可以换天。\"", "\"Esta noche está {w}. ¿No te gusta? El Reloj Lento cambia el cielo.\"", "\"Aquesta nit fa {w}. No t'agrada? El Rellotge Lent canvia el cel.\"")
  };
  const WX = { clear: S("clear", "晴", "despejado", "serè"), cloudy: S("cloudy", "多云", "nublado", "ennuvolat"), rain: S("raining", "下雨", "lloviendo", "plovent"), storm: S("stormy", "有雷雨", "tormentoso", "tempestuós"), snow: S("snowing", "下雪", "nevando", "nevant"), fog: S("foggy", "起雾", "con niebla", "boirós") };
  const TIPS = [
    ["restaurant", S("\"Got someone far away? Two Candles by the lake keeps a table for two. You both sit down from wherever you are and cook the same dinner.\"", "\"有人在远方？湖边的“双烛小馆”有双人桌。你们各自坐下，一起做同一顿饭。\"", "\"¿Alguien lejos? Dos Velas, junto al lago, guarda mesa para dos. Os sentáis cada uno desde donde estéis y cocináis la misma cena.\"", "\"Algú lluny? Dues Espelmes, vora el llac, guarda taula per a dos. Seieu cadascú des d'on sigueu i cuineu el mateix sopar.\"")],
    ["brewery", S("\"Neighbours' Brew, up the street, lets you make your own beer. Osmanthus IPA, anyone? Ship it here and I'll pour it.\"", "\"街上的“邻家酿”可以自己酿酒。来一桶桂花 IPA？送过来我就给你倒。\"", "\"En Cerveza Vecina, calle arriba, puedes hacer tu propia cerveza. ¿IPA de osmanto? Mándamela y la sirvo.\"", "\"A Cervesa Veïna, carrer amunt, pots fer la teva pròpia cervesa. IPA d'osmant? Envia-me-la i la serveixo.\"")],
    ["books", S("\"Borrowed Pages, across the lane, gets quiet after nine. Best time to find something you weren't looking for.\"", "\"巷子对面的“借来的书”九点以后就安静了，最适合找到你没在找的书。\"", "\"Páginas Prestadas, enfrente, se queda tranquila después de las nueve. El mejor momento para encontrar lo que no buscabas.\"", "\"Pàgines Manllevades, al davant, es queda tranquil·la després de les nou. El millor moment per trobar el que no buscaves.\"")],
    ["kintsugi", S("\"Broke something? Mended puts it back together with gold. Works on bad days too.\"", "\"打碎了什么？“金缮坊”会用金子补好。坏日子也一样。\"", "\"¿Rompiste algo? En Remendado lo reparan con oro. También sirve para los días malos.\"", "\"Has trencat alguna cosa? A Adobat la reparen amb or. També serveix per als dies dolents.\"")],
    ["train", S("\"The night train leaves Nearby Station at the bottom of the hill. Hong Kong, Wales, wherever. Share a sleeper cabin if you're brave.\"", "\"夜车从山脚的“近邻站”出发，香港、威尔士，哪儿都去。胆子大就和人拼个卧铺。\"", "\"El tren nocturno sale de la Estación Cerca, al pie de la colina. Hong Kong, Gales, donde sea. Comparte litera si te atreves.\"", "\"El tren de nit surt de l'Estació A Prop, al peu del turó. Hong Kong, Gal·les, on sigui. Comparteix llitera si t'atreveixes.\"")],
    ["jukebox", S("\"Two doors down, Same Song takes requests from everyone in town. Pick something before someone picks bossa nova again.\"", "\"隔两间的“同一首歌”，全镇的人都能点歌。趁别人还没又点波萨诺瓦，快去选一首。\"", "\"A dos puertas, La Misma Canción acepta peticiones de todo el pueblo. Elige algo antes de que vuelvan a poner bossa nova.\"", "\"A dues portes, La Mateixa Cançó accepta peticions de tot el poble. Tria alguna cosa abans que tornin a posar bossa nova.\"")],
    ["dj", S("\"Late Light opens when I close. Ask the DJ for the forbidden riff. Or don't. I didn't tell you.\"", "\"我打烊的时候“夜灯”才开门。问 DJ 要那段禁忌旋律。或者别问。我可没说过。\"", "\"Luz Tardía abre cuando yo cierro. Pide al DJ el riff prohibido. O no. Yo no te he dicho nada.\"", "\"Llum Tardana obre quan jo tanco. Demana al DJ el riff prohibit. O no. Jo no t'he dit res.\"")],
    ["climb", S("\"Someone fell off the wall at Hold On again today. Laughing, though. Chalk's free.\"", "\"今天又有人在“抓稳”从岩壁上掉下来了，不过是笑着的。镁粉免费。\"", "\"Hoy alguien se ha vuelto a caer de la pared de Agárrate. Riéndose, eso sí. La magnesia es gratis.\"", "\"Avui algú ha tornat a caure de la paret d'Agafa't. Rient, això sí. El magnesi és gratis.\"")],
    ["cloud", S("\"Up in Lie Back Park you can ride a cloud anywhere the wind goes. The lake at dusk is my favourite.\"", "\"在“看云坡”可以乘着云去风去的任何地方。我最喜欢黄昏的湖。\"", "\"En el Parque Panza Arriba puedes montar en una nube adonde vaya el viento. El lago al atardecer es mi favorito.\"", "\"Al Parc Panxa Enlaire pots pujar en un núvol allà on vagi el vent. El llac al capvespre és el meu preferit.\"")],
    ["cabin", S("\"When it all gets loud, No Hurry is a cabin up on the pasture with a big window. The kettle's always on. I leave a candle.\"", "\"太吵的时候，牧场上有间小屋叫“不急”，有扇大窗。水壶一直烧着，我留了一支蜡烛。\"", "\"Cuando todo hace ruido, Sin Prisa es una cabaña en el prado con una ventana grande. La tetera siempre está al fuego. Yo dejo una vela.\"", "\"Quan tot fa soroll, Sense Pressa és una cabana a la pastura amb una finestra gran. La tetera sempre és al foc. Jo hi deixo una espelma.\"")]
  ];
  let news = null;
  function get(fn, q) { const u = SUPABASE_CONFIG.url; if (!u) return Promise.resolve(null); return fetch(u + '/rest/v1/rpc/' + fn + (q ? '?' + q : ''), { headers: { apikey: SUPABASE_CONFIG.anonKey, Authorization: 'Bearer ' + SUPABASE_CONFIG.anonKey } }).then(r => r.ok ? r.json() : null).catch(() => null); }
  function gather() {
    if (news) return news;
    return news = Promise.all([get('beer_list', 'p_sort=new'), Promise.resolve(null), get('garden_stats'), get('sanctuary_list'), get('postcard_wall', 'p_limit=40')]).then(([bn, bl, gs, sl, pw]) => {
      const out = [], W = window.FBWorld;
      try { const c = W && W.cats && W.cats(); if (c && P[c.miso] && P[c.yuzu]) out.push(c.miso === c.yuzu ? [() => fill(LINE.catsTogether, { a: pn(c.miso) }), c.miso] : [() => fill(LINE.cats, { a: pn(c.miso), b: pn(c.yuzu) }), c.miso === 'bar' ? c.yuzu : c.miso]); } catch (e) {}
      try { const d = W && W.dog && W.dog(); if (d && P[d]) out.push([() => fill(LINE.dog, { a: pn(d) }), d]); } catch (e) {}
      if (Array.isArray(bn) && bn.length) { const b = bn[0]; out.push([() => fill(LINE.beerNew, { b: b.brewer, n: b.name, s: b.style, w: L(b.bar ? LINE.beerHere : b.club ? LINE.beerClub : LINE.beerNone) }), b.bar ? 'menu' : 'brewery']); }
      else if (bn) out.push([() => L(LINE.noBeer), 'brewery']);
      if (gs && typeof gs.count === 'number') out.push([() => fill(gs.count ? LINE.garden : LINE.gardenNone, { n: gs.count }), 'garden']);
      if (Array.isArray(sl)) out.push([() => fill(sl.length ? LINE.sanctuary : LINE.sanctuaryNone, { n: sl.length }), 'sanctuary']);
      if (Array.isArray(pw)) out.push([() => fill(pw.length ? LINE.wall : LINE.wallNone, { n: pw.length }), pw.length ? 'wall' : 'postcard']);
      try { const w = W && W.weather && W.weather(); if (w && WX[w]) out.push([() => fill(LINE.weather, { w: L(WX[w]) }), 'tower']); } catch (e) {}
      TIPS.slice().sort(() => Math.random() - .5).forEach(t => out.push([() => L(t[1]), t[0]]));
      return out;
    });
  }
  let i = 0;
  const W0 = window.FBWorld || {};
  function say(list) {
    const item = list[i++ % list.length], where = item[1];
    const btns = [];
    if (where === 'menu') btns.push({ label: '🍺 ' + L(lx(["On tap", "生啤", "", "", "De barril", "De barril"])), onClick: () => { toggleCodexModal(true); switchAlbumTab('tap'); } });
    else if (where === 'wall') btns.push({ label: '🧱 ' + L(lx(["The Wall", "留言墙", "", "", "El muro", "El mur"])), onClick: () => go('wall') });
    else if (P[where] && where !== 'bar' && !(W0.state && W0.state(where) === 'shut')) btns.push({ label: L(UI.go).replace('→', '· ' + pn(where) + ' →'), onClick: () => { const u = W0.url ? W0.url(where) : P[where][4]; try { if (window.parent !== window && window.parent.FBShell) return window.parent.FBShell.open(u); } catch (e) {} location.href = u; } });   /* never to a shut place; through the town */
    btns.push({ label: L(UI.more), onClick: () => say(list) }, { label: L(UI.back), onClick: backToOrder });
    try { setExpression('grin', 1800); } catch (e) {}
    renderWei(item[0](), btns, "grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-2", 'town');
  }
  window.townTalk = function () { renderWei(L(lx(["\"Let me think…\"", "\"我想想…\"", "", "\"諗吓先…\"", "\"Déjame pensar…\"", "\"Deixa'm pensar…\""])), [], "grid grid-cols-1 gap-1.5 mt-2", 'town'); gather().then(say); };
})();
