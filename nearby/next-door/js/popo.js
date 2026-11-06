/* Popo and the cats behind the counter. Each visit meets one host (FBWorld.host): on Popo's visits Wei's grandmother keeps
   the bar. She knows nothing about coffee or cocktails, she cooks (Cantonese and Catalan home food, her own two languages;
   her English, Spanish and Mandarin are broken on purpose). On the cats' visits nobody stands behind the bar: Miso and Yuzu
   run it and only say meow. Both keep their hours: Popo sleeps 21:00–05:00 in the armchair by the stove, the cats at night. */
(function () {
  var W = window.FBWorld; if (!W || !W.host || !W.drawPopo) return;
  var M = function (en, zh, yue, es, ca) { return lx([en, zh, yue, yue, es, ca]); };
  var who = function () { try { return W.host(); } catch (e) { return { who: "wei" }; } };
  var P = {
    head: M("POPO'S IN THE KITCHEN", "婆婆在厨房", "婆婆喺廚房", "POPO EN LA COCINA", "LA POPO ÉS A LA CUINA"),
    napHead: M("POPO'S ASLEEP", "婆婆睡着了", "婆婆瞓著咗", "POPO DUERME", "LA POPO DORM"),
    hi: [M("*stirring a pot* Ah, you come! Sit. Wei go travelling. Coffee I don't know lor, but I got soup.", "*搅着锅* 啊，你来啦！坐。阿Wei去旅行咯。咖啡我不懂，汤就有。", "*攪緊煲嘢* 啊，你嚟啦！坐低。阿Wei去咗旅行。咖啡我唔識，湯就有。", "*remueve la olla* ¡Ah, tú vienes! Siéntate. Wei de viaje. Café no sé, pero tengo sopa.", "*remena l'olla* Ah, ja ets aquí! Seu. En Wei és de viatge. De cafè no en sé, però tinc sopa."),
      M("*wipes the counter with a tea towel* Sit, sit. You look hungry ah. Popo cooks.", "*用毛巾擦吧台* 坐，坐。你的样子好饿喔。婆婆煮给你食。", "*用條毛巾抹吧枱* 坐啦坐啦。你個樣好肚餓喎。婆婆煮俾你食。", "*limpia la barra con un trapo* Siéntate, siéntate. Pareces hambre. Popo cocina.", "*eixuga la barra amb un drap* Seu, seu. Fas cara de gana. La Popo cuina."),
      M("*tastes from a wooden spoon, nods* Good timing. Everything hot now.", "*用木勺尝一口，点点头* 来得正好。现在样样都热乎乎。", "*用木羹試咗啖，點點頭* 嚟得啱。而家樣樣都熱辣辣。", "*prueba de la cuchara, asiente* Buen momento. Todo caliente ahora.", "*tasta de la cullera de fusta i assenteix* Arribes a temps. Ara tot és calent.")],
    ask: M("Ask Popo what's cooking", "问婆婆煮了什么", "問婆婆煮咗乜", "Pregunta a Popo qué hay", "Pregunta-li a la Popo què hi ha"),
    coffeeNo: M("Coffee? Aiya, too strong lah, bad for the heart. Have soup.", "咖啡？哎呀，太浓咯，对心不好的。喝碗汤啦。", "咖啡？哎呀，太濃喇，傷心㗎。飲碗湯啦。", "¿Café? Ay, muy fuerte, malo para corazón. Toma sopa.", "Cafè? Ai, massa fort, no va bé per al cor. Pren sopa."),
    boozeNo: M("Cocktail? I don't know these things. Wei come back, you ask him lor. Now: eat.", "鸡尾酒？这些我不懂的。阿Wei回来，你问他。现在：吃饭。", "雞尾酒？呢啲嘢我唔識㗎。等阿Wei返嚟你問佢。而家：食飯。", "¿Cóctel? Yo no sabe de esto. Wei vuelve, tú preguntas. Ahora: comer.", "Un còctel? D'això no en sé res. Quan torni en Wei, li ho demanes. Ara: a menjar."),
    served: M("*watches you take the first spoon* Good? Good. Eat slowly ah.", "*看着你吃第一口* 好不好吃？好。慢慢吃。", "*望住你食第一啖* 好唔好食？好。慢慢食。", "*te mira comer la primera cucharada* ¿Bueno? Bueno. Come despacio.", "*et mira menjar la primera cullerada* Bo? Bé. Menja a poc a poc."),
    nap: [M("*Popo asleep in the armchair by the stove, a blanket on her knees, the radio playing Cantonese opera very quietly. A pot is keeping warm.*", "*婆婆在炉边的扶手椅上睡着了，膝上盖着毯子，收音机小声放着粤曲。锅里的汤还温着。*", "*婆婆喺爐邊張梳化椅度瞓著咗，膝頭冚住張氈，收音機細細聲播緊粵曲。煲湯仲溫住。*", "*Popo duerme en el sillón junto a la cocina, con una manta en las rodillas y la radio con ópera cantonesa muy bajita. Una olla se mantiene caliente.*", "*La Popo dorm a la butaca vora els fogons, amb una manta als genolls i la ràdio amb òpera cantonesa molt fluixet. Una olla es manté calenta.*"),
      M("*Popo dozes with her glasses on her head. A note on the counter, in three languages: 'SOUP ON THE STOVE. TAKE.'*", "*婆婆眼镜架在头上打瞌睡。吧台上有张三种文字的纸条：“炉子上有汤。自己拿。”*", "*婆婆副眼鏡擺咗喺頭頂，瞌緊眼瞓。吧枱有張三種文字嘅紙仔：「爐頭有湯。自己攞。」*", "*Popo dormita con las gafas en la cabeza. Una nota en la barra, en tres idiomas: 'SOPA EN EL FUEGO. COGE.'*", "*La Popo fa una becaina amb les ulleres al cap. Una nota a la barra, en tres llengües: 'HI HA SOPA AL FOC. AGAFA'N.'*")]
  };
  var DISH = [
    { k: "congee", ic: "bowl", name: M("Congee with ginger & scallion", "姜葱白粥", "薑蔥白粥", "Congee de jengibre y cebolleta", "Congee amb gingebre i ceba tendra"), sub: M("Rice, slowly, since six this morning", "大米，从早上六点慢慢熬", "由朝早六點慢慢煲", "Arroz, a fuego lento desde las seis", "Arròs a foc lent des de les sis del matí"), desc: M("\"Hot, hot. Blow first lah. Good for the stomach.\"", "\"烫呀，烫呀。先吹一吹。对胃好。\"", "\"熱㗎，熱㗎。吹吓先。對個胃好。\"", "\"Caliente, caliente. Primero soplar. Bueno para estómago.\"", "\"Crema, crema. Bufa primer. Va bé per a l'estómac.\"") },
    { k: "wonton", ic: "bowl", name: M("Wonton noodle soup", "云吞面", "雲吞麵", "Sopa de wonton con fideos", "Sopa de wonton amb fideus"), sub: M("Shrimp wontons, thin egg noodles", "鲜虾云吞，细蛋面", "鮮蝦雲吞，幼蛋麵", "Wontons de gamba, fideos finos de huevo", "Wontons de gamba, fideus fins d'ou"), desc: M("\"Noodles under, wontons on top, so noodles don't go soft. My mother's way one.\"", "\"面在底下，云吞在上面，面才不会软。我妈妈的做法。\"", "\"麵喺底，雲吞喺面，啲麵先唔會腍。我阿媽嘅做法。\"", "\"Fideos abajo, wontons arriba, así fideos no blandos. Manera de mi madre.\"", "\"Els fideus a sota i els wontons a sobre, perquè no s'estovin. Com ho feia ma mare.\"") },
    { k: "pa", ic: "bread", name: M("Pa amb tomàquet", "番茄面包", "番茄麵包", "Pan con tomate", "Pa amb tomàquet"), sub: M("Toasted bread, ripe tomato, olive oil, salt", "烤面包，熟番茄，橄榄油，盐", "烘麵包，熟番茄，橄欖油，鹽", "Pan tostado, tomate maduro, aceite, sal", "Pa torrat, tomàquet madur, oli i sal"), desc: M("\"Rub the tomato hard. Oil, a lot. In Barcelona, everybody know one.\"", "\"番茄要用力擦。油，多一点。在巴塞罗那，个个都知道。\"", "\"番茄要大力擦。油，多啲。喺巴塞隆拿，個個都識。\"", "\"Frota el tomate fuerte. Aceite, mucho. En Barcelona, todos saben.\"", "\"Frega bé el tomàquet. Oli, que no en falti. A Barcelona ho sap tothom.\"") },
    { k: "escudella", ic: "bowl", name: M("Escudella", "加泰罗尼亚杂烩汤", "加泰隆尼亞雜燴湯", "Escudella", "Escudella"), sub: M("Catalan winter stew, pasta shells in the broth", "加泰罗尼亚冬天的炖汤，汤里有贝壳面", "加泰隆尼亞冬天嘅燉湯，湯入面有貝殼粉", "Cocido catalán de invierno, con galets", "Escudella i carn d'olla, amb galets"), desc: M("\"Two days I cook this. Two days ah! You finish it.\"", "\"这个我煮了两天。两天呀！你要吃完。\"", "\"呢個我煲咗兩日。兩日呀！你要食晒。\"", "\"Dos días cocino esto. ¡Dos días! Tú terminas.\"", "\"Dos dies que la cuino. Dos dies! Te l'acabes.\"") },
    { k: "tart", ic: "tart", name: M("Egg tart", "蛋挞", "蛋撻", "Tartaleta de huevo", "Pastisset d'ou"), sub: M("Flaky pastry, still warm", "酥皮的，还是热的", "酥皮嘅，仲係熱嘅", "Hojaldre, todavía caliente", "Full, encara calent"), desc: M("\"Take two lah. One for now, one for later. Nobody counts.\"", "\"拿两个。一个现在吃，一个等一下吃。没人数的。\"", "\"攞兩個。一個而家食，一個陣間食。冇人數㗎。\"", "\"Coge dos. Uno ahora, uno después. Nadie cuenta.\"", "\"Agafa'n dos. Un ara i un per després. Ningú no els compta.\"") },
    { k: "dumplings", ic: "dumpling", name: M("Dumplings, folded this morning", "今早包的饺子", "今朝包嘅餃子", "Dumplings de esta mañana", "Dumplings plegats aquest matí"), sub: M("Pork and cabbage, with black vinegar", "猪肉白菜，配黑醋", "豬肉白菜，點黑醋", "Cerdo y col, con vinagre negro", "Porc i col, amb vinagre negre"), desc: M("\"Next time you come early, you fold with me. I teach you, OK?\"", "\"下次早点来，跟我一起包。我教你。\"", "\"下次早啲嚟，同我一齊包。我教你。\"", "\"Próxima vez tú vienes pronto, doblas conmigo. Yo enseño.\"", "\"La propera vegada vine d'hora i en pleguem junts. T'ensenyo.\"") },
    { k: "water", ic: "cup", name: M("Hot water", "热水", "滾水", "Agua caliente", "Aigua calenta"), sub: M("Good for you", "对身体好", "對身體好", "Buena para ti", "Et fa bé"), desc: M("\"Cold drinks, no good. Hot water. Trust Popo lah.\"", "\"冷的不要喝。喝热水。信婆婆啦。\"", "\"凍嘢唔好飲。飲滾水。信婆婆啦。\"", "\"Bebida fría, no. Agua caliente. Confía en Popo.\"", "\"Res de fred. Aigua calenta. Fes cas de la Popo.\"") }
  ];
  var C = {
    head: M("MISO & YUZU ARE ON", "味噌和柚子值班", "味噌同柚子當值", "MISO Y YUZU DE TURNO", "LA MISO I LA YUZU DE TORN"),
    napHead: M("MISO & YUZU ARE ASLEEP", "味噌和柚子睡着了", "味噌同柚子瞓著咗", "MISO Y YUZU DUERMEN", "LA MISO I LA YUZU DORMEN"),
    hi: [M("*Miso is sitting on the till. Yuzu pushes a coaster toward you with one paw.* Meow.", "*味噌坐在收银机上。柚子用一只爪子把杯垫推向你。* 喵。", "*味噌坐咗喺收銀機度。柚子用一隻爪將個杯墊推埋嚟。* 喵。", "*Miso está sentada en la caja. Yuzu te empuja un posavasos con la pata.* Miau.", "*La Miso seu damunt la caixa. La Yuzu t'empeny un sotagot amb la pota.* Mèu."),
      M("*Yuzu walks the length of the bar, knocking nothing over. Yet.* Mrrp.", "*柚子沿着吧台走了一趟，什么都没碰倒。暂时。* 咕噜。", "*柚子沿住吧枱行咗一轉，乜都冇撞跌。暫時。* 咕嚕。", "*Yuzu recorre la barra sin tirar nada. De momento.* Mrrp.", "*La Yuzu recorre la barra sense tirar res. De moment.* Mrrp."),
      M("*Both cats look at you, then at the menu, then at you.* Meow?", "*两只猫看看你，看看菜单，又看看你。* 喵？", "*兩隻貓望吓你，望吓個餐牌，又望吓你。* 喵？", "*Las dos te miran, miran la carta, te miran otra vez.* ¿Miau?", "*Les dues et miren, miren la carta i et tornen a mirar.* Mèu?")],
    nap: [M("*Miso and Yuzu asleep in one heap on the bar mat, purring in their sleep.* Prrr…", "*味噌和柚子在吧台垫上睡成一团，睡梦里还打着呼噜。* 呼噜……", "*味噌同柚子喺吧枱墊度瞓成一嚿，瞓著都仲呼嚕呼嚕。* 呼嚕……", "*Miso y Yuzu duermen hechas un ovillo sobre la alfombrilla de la barra, ronroneando.* Prrr…", "*La Miso i la Yuzu dormen fetes un cabdell damunt l'estora de la barra, roncant.* Prrr…")],
    ask: M("Ask Miso & Yuzu", "问味噌和柚子", "問味噌同柚子", "Pregunta a Miso y Yuzu", "Pregunta-ho a la Miso i la Yuzu"),
    name: M("Miso & Yuzu", "味噌和柚子", "味噌同柚子", "Miso y Yuzu", "Miso i Yuzu")
  };
  /* Mantou's visits: the dog keeps the counter from his stool. He serves what a dog would bring you. */
  var D = {
    head: M("MANTOU'S ON", "馒头值班", "饅頭當值", "MANTOU DE TURNO", "EN MANTOU DE TORN"),
    napHead: M("MANTOU'S ASLEEP", "馒头睡着了", "饅頭瞓著咗", "MANTOU DUERME", "EN MANTOU DORM"),
    hi: [M("*Mantou sits on his stool behind the counter, very upright, very professional. His tail sweeps a coaster off.* Woof!", "*馒头坐在吧台后面的高凳上，坐得笔直，非常专业。尾巴把一个杯垫扫到地上。* 汪！", "*饅頭坐喺吧枱後面張高櫈度，坐得好直，好專業。條尾掃跌咗個杯墊。* 汪！", "*Mantou está sentado en su taburete detrás de la barra, muy erguido, muy profesional. Su cola tira un posavasos.* ¡Guau!", "*En Mantou seu al seu tamboret darrere la barra, ben dret, molt professional. La cua tira un sotagot.* Bup!"),
      M("*Mantou has a tea towel over one shoulder. Nobody knows how.* Woof.", "*馒头肩膀上搭着一条茶巾。谁也不知道是怎么搭上去的。* 汪。", "*饅頭膊頭搭住條毛巾。冇人知點搭上去。* 汪。", "*Mantou lleva un trapo al hombro. Nadie sabe cómo.* Guau.", "*En Mantou porta un drap a l'espatlla. Ningú sap com.* Bup.")],
    nap: [M("*Mantou asleep across the doorway behind the counter, paws twitching, chasing the 7:40 in a dream.*", "*馒头横躺在吧台后的门口睡着了，爪子一抽一抽，梦里在追七点四十那班车。*", "*饅頭打橫瞓喺吧枱後面門口，對爪郁吓郁吓，夢入面追緊七點四十班車。*", "*Mantou dormido atravesado en la puerta detrás de la barra, moviendo las patas, persiguiendo el tren de las 7:40 en sueños.*", "*En Mantou adormit de través a la porta darrere la barra, movent les potes, perseguint el tren de les 7:40 en somnis.*")],
    ask: M("Ask Mantou", "问馒头", "問饅頭", "Pregunta a Mantou", "Pregunta-ho a en Mantou"),
    served: M("*Mantou drops it on the counter, sits very upright and waits for a 'good boy'.* Woof!", "*馒头把它放在吧台上，坐得笔直，等你夸他。* 汪！", "*饅頭將佢放喺吧枱度，坐得好直，等你讚佢。* 汪！", "*Mantou lo deja en la barra, se sienta muy recto y espera un «buen chico».* ¡Guau!", "*En Mantou ho deixa a la barra, s'asseu ben dret i espera un «bon gos».* Bup!"),
    name: M("Mantou", "馒头", "饅頭", "Mantou", "En Mantou")
  };
  var DOGMENU = [
    { k: "ball", ic: "coin", name: M("His ball", "他的球", "佢個波", "Su pelota", "La seva pilota"), sub: M("Slightly chewed", "有点被啃过", "畀佢咬過少少", "Un poco mordida", "Una mica mossegada"), desc: M("You throw it, he brings it back. You throw it, he brings it back. Forever is a good length for this.", "你扔出去，他叼回来。你扔出去，他叼回来。这件事永远做下去也挺好。", "你掟出去，佢擔返嚟。你掟出去，佢擔返嚟。呢件事做到永遠都幾好。", "Tú la lanzas, él la trae. Tú la lanzas, él la trae. Para siempre es una buena duración.", "Tu la llences, ell la torna. Tu la llences, ell la torna. Per sempre és una bona durada.") },
    { k: "water", ic: "cup", name: M("His water bowl", "他的水碗", "佢個水兜", "Su cuenco de agua", "El seu bol d'aigua"), sub: M("Shared, generously", "大方地分给你", "好大方咁分俾你", "Compartido, con generosidad", "Compartit, amb generositat"), desc: M("He pushes it across the floor to you with his nose. It's the thought that counts. Have a glass of real water too.", "他用鼻子把碗推到你面前。心意最重要。你也喝一杯真正的水吧。", "佢用個鼻將個兜推到你面前。心意最緊要。你都飲杯真嘅水啦。", "Te lo acerca por el suelo con el hocico. Lo que cuenta es la intención. Bebe también un vaso de agua de verdad.", "Te l'acosta per terra amb el morro. El que compta és la intenció. Beu també un got d'aigua de veritat.") },
    { k: "sock", ic: "yarn", name: M("A sock", "一只袜子", "一隻襪", "Un calcetín", "Un mitjó"), sub: M("Someone's. Not yours. Probably Wei's.", "某人的。不是你的。大概是 Wei 的。", "某人嘅。唔係你嘅。應該係阿Wei嘅。", "De alguien. No tuyo. Seguramente de Wei.", "D'algú. No és teu. Segurament d'en Wei."), desc: M("He's very proud of it. Tell him he's a good boy. He knows.", "他非常得意。告诉他他是好狗狗。他知道的。", "佢好得戚。話佢知佢係乖狗狗。佢知㗎。", "Está muy orgulloso. Dile que es un buen chico. Ya lo sabe.", "N'està molt orgullós. Digues-li que és un bon gos. Ja ho sap.") },
    { k: "bun", ic: "dumpling", name: M("A mantou", "一个馒头", "一個饅頭", "Un mantou", "Un mantou"), sub: M("A real steamed bun, from Popo's kitchen", "真的馒头，婆婆厨房里的", "真嘅饅頭，婆婆廚房嘅", "Un panecillo al vapor de verdad, de la cocina de Popo", "Un panet al vapor de veritat, de la cuina de la Popo"), desc: M("He carried it all the way here very gently. One small bite missing. He doesn't know anything about that.", "他一路小心翼翼地叼过来。少了一小口。他对此一无所知。", "佢成程好小心咁擔過嚟。少咗一細啖。佢乜都唔知。", "Lo ha traído con muchísimo cuidado. Le falta un mordisquito. Él no sabe nada de eso.", "L'ha portat amb moltíssima cura. Li falta una mossegadeta. Ell no en sap res.") },
    { k: "lead", ic: "rope", name: M("His lead", "他的牵绳", "佢條狗帶", "Su correa", "La seva corretja"), sub: M("An invitation", "一个邀请", "一個邀請", "Una invitación", "Una invitació"), desc: M("He drops it in your lap and sits by the door. Take him to the Plaza, or High Pasture. Then go for a real walk with someone.", "他把牵绳丢在你腿上，坐到门边。带他去广场，或者高山牧场。然后和谁去真正散个步。", "佢將條狗帶掉落你大髀，坐喺門口。帶佢去廣場，或者高山牧場。跟住同人去真係散吓步。", "Te la deja en el regazo y se sienta junto a la puerta. Llévale a la Plaza o al Pasto Alto. Luego sal a pasear de verdad con alguien.", "Te la deixa a la falda i s'asseu a la porta. Porta'l a la Plaça o a la Pastura Alta. Després surt a passejar de debò amb algú.") }
  ];
  function dogServe(d) {
    try { showServed({ icon: "", name: L(d.name), sub: L(d.sub), desc: L(d.desc), formula: "", reactable: false, food: d.k === "bun" }); } catch (e) { say(L(d.desc)); return; }
    var ic = W.pix ? W.pix(d.ic) : ""; ["res-icon", "served-item-plate"].forEach(function (id) { var el = document.getElementById(id); if (el) el.innerHTML = ic; });
    try { SoundEngine.playClick(); } catch (e) {}
    setTimeout(function () { try { showBubble(L(D.served)); } catch (e) {} }, 900);
    try { DB.log("dog_serve", { k: d.k }); } catch (e) {}
  }
  /* Mantou keeps the counter as a dog: the town's own drawing (FBWorld.petSvg), on all four on a bar stool behind the counter
     (curled up on it when he sleeps), never standing like a person */
  var dcv = document.createElement("div"); dcv.id = "dog-avatar"; dcv.setAttribute("role", "img"); dcv.setAttribute("aria-label", "Mantou");
  var STOOL = '<path fill="#1a1410" d="M3 16h20v3H3zM6 19h2v5H6zM18 19h2v5h-2z"/><path fill="#8a5a2e" d="M4 16h18v1H4z"/><path fill="#5a3519" d="M4 17h18v1H4zM7 19h1v5H7zM19 19h1v5h-1z"/><path fill="#3a2210" d="M8 22h10v1H8z"/>';
  var dogPainted = null;
  function paintDog(asleep) { asleep = !!asleep; if (dogPainted === asleep) return; dogPainted = asleep; dcv.classList.toggle("asleep", asleep);
    dcv.innerHTML = window.NDPetPic ? NDPetPic("dog", { asleep: asleep, vw: 26, vh: 24, dx: 2, under: STOOL }) : ""; }
  var css0 = document.createElement("style");
  css0.textContent = "#dog-avatar{display:none;width:78px;height:72px;image-rendering:pixelated}#dog-avatar svg{display:block;width:100%;height:100%;overflow:visible}@media (min-width:1024px){#dog-avatar{width:109px;height:101px}}body.dog-on #dog-avatar{display:block}body.dog-on #svg-wei-avatar,body.dog-on #mei-avatar,body.dog-on #popo-avatar,body.dog-on #wei-zzz-particles{display:none!important}" +
    "#dog-guest{position:absolute;bottom:0;left:30%;z-index:4;width:78px;height:72px;image-rendering:pixelated;cursor:pointer;transform:translateX(-50%)}#dog-guest svg{display:block;width:100%;height:100%;overflow:visible}@media (min-width:1024px){#dog-guest{width:109px;height:101px}}";
  document.head.appendChild(css0);
  var css = document.createElement("style");
  css.textContent = "#popo-avatar{display:none;width:66px;height:74px;image-rendering:pixelated}body.popo-on #popo-avatar{display:block}body.popo-on #svg-wei-avatar,body.popo-on #mei-avatar,body.popo-on:not(.popo-nap) #wei-zzz-particles,body.cats-on #svg-wei-avatar,body.cats-on #mei-avatar,body.cats-on #wei-zzz-particles{display:none!important}body.popo-on:not(.wei-away) #wei-anchor{visibility:visible!important}body.cats-on #wei-anchor{visibility:hidden!important}@media (min-width:768px){#popo-avatar{width:92px;height:104px}}";
  document.head.appendChild(css);
  var cv = document.createElement("canvas"); cv.id = "popo-avatar"; cv.width = 32; cv.height = 36; cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "Popo");
  var holder = document.getElementById("sprite-wei-container"); if (holder) { holder.appendChild(cv); holder.appendChild(dcv); }
  function paint(asleep) { var g = cv.getContext("2d"); g.clearRect(0, 0, 32, 36); W.drawPopo(g, 0, 3, 1, { asleep: asleep }); }
  function say(t) { try { if (!(window.NDSay && NDSay(t))) setText("sleep-story-text", t); } catch (e) {} }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  var line = { popo: -1, cats: -1 }, said = "";
  var CATS_SERVE = M("Let the cats serve", "让猫来招呼", "等啲貓招呼你", "Que sirvan las gatas", "Que serveixin les gates");
  function btn(label) { setText("sleep-btn-cats", label); }   /* the panel's 🐾 button (askCatToBartend: the menu on the stand) */
  function dress() {
    var h = who(), b = document.body, out = window.WeiAway && WeiAway.on(), P0 = h.who === "popo" && !out, C0 = h.who === "cats", D0 = h.who === "mantou" && !out;
    b.classList.toggle("popo-on", P0); b.classList.toggle("popo-nap", P0 && h.asleep); b.classList.toggle("cats-on", C0); b.classList.toggle("cats-nap", C0 && h.asleep); b.classList.toggle("dog-on", D0);
    try { if (typeof Cats !== "undefined" && Cats.st) { var HM = dress.home || (dress.home = { miso: Cats.st.miso.home.slice(), yuzu: Cats.st.yuzu.home.slice() });
      var mid = C0;   /* the cats' own visit: they sit where the host stands, behind the counter */
      Cats.st.miso.home = mid ? [41, 46] : HM.miso; Cats.st.yuzu.home = mid ? [54, 59] : HM.yuzu;
      if (mid) ["miso", "yuzu"].forEach(function (id) { if (Cats.here(id)) Cats.returnHome(id); }); } } catch (e) {}
    guest();
    if (!P0 && !C0 && !D0) return;
    b.classList.remove("mei-on", "mei-nap");
    var hn = document.getElementById("host-name"), w = document.getElementById("sleep-wake");
    if (w) w.style.display = "none";
    try { setText("sleep-header-badge", ""); } catch (e) {}
    if (D0) {
      paintDog(h.asleep); if (hn) hn.textContent = L(D.name);
      try { setText("sleep-header-title", L(h.asleep ? D.napHead : D.head)); } catch (e) {}
      var kd = h.asleep ? "nap" : "hi"; if (said !== "dog-" + kd) { said = "dog-" + kd; say(L(pick(D[kd]))); }
      btn(L(h.asleep ? CATS_SERVE : D.ask));
      return;
    }
    if (P0) {
      paint(h.asleep); if (hn) hn.textContent = L(M("Popo", "婆婆", "婆婆", "Popo", "Popo"));
      try { setText("sleep-header-title", L(h.asleep ? P.napHead : P.head)); } catch (e) {}
      var key = h.asleep ? "nap" : "hi"; if (said !== "popo-" + key) { said = "popo-" + key; say(L(pick(P[key]))); }
      btn(L(h.asleep ? CATS_SERVE : P.ask));
    } else {
      try { setText("sleep-header-title", L(h.asleep ? C.napHead : C.head)); } catch (e) {}
      var k2 = h.asleep ? "nap" : "hi"; if (said !== "cats-" + k2) { said = "cats-" + k2; say(L(pick(C[k2]))); }
      btn(L(C.ask));
    }
  }
  /* Mantou drops in behind the counter now and then on other hosts' visits (when his walk brings him to Next Door) */
  var GD = [M("*Mantou leans his whole weight against your leg.* Hrrmf.", "*馒头把整个身子靠在你腿上。* 呼。", "*饅頭成個身挨晒落你隻腳度。* 呼。", "*Mantou se apoya con todo su peso en tu pierna.* Hrrmf.", "*En Mantou es recolza amb tot el pes a la teva cama.* Hrrmf."),
    M("*Mantou offers a paw. Then the other one. Then both.* Woof!", "*馒头伸出一只爪子。又伸出另一只。然后两只一起。* 汪！", "*饅頭伸咗隻爪出嚟。又伸另一隻。跟住兩隻一齊。* 汪！", "*Mantou te da la pata. Luego la otra. Luego las dos.* ¡Guau!", "*En Mantou et dona la pota. Després l'altra. Després totes dues.* Bup!"),
    M("*Mantou sneezes, embarrassed, and pretends it was the cats.* …woof.", "*馒头打了个喷嚏，有点不好意思，假装是猫干的。* ……汪。", "*饅頭乞嚏，有啲尷尬，扮係啲貓整嘅。* ……汪。", "*Mantou estornuda, avergonzado, y hace como que fueron las gatas.* …guau.", "*En Mantou esternuda, avergonyit, i fa veure que han estat les gates.* …bup.")];
  var gcv = null;
  function guest() {
    var here = false; try { here = who().who !== "mantou" && W.dog && W.dog() === "bar"; } catch (e) {}
    var stage = document.getElementById("cat-miso"); stage = stage && stage.parentElement;
    if (!here || !stage) { if (gcv) gcv.style.display = "none"; return; }
    if (!gcv) { gcv = document.createElement("div"); gcv.id = "dog-guest"; gcv.setAttribute("role", "img"); gcv.setAttribute("aria-label", "Mantou"); stage.appendChild(gcv);
      gcv.onclick = function (e) { e.stopPropagation(); try { SoundEngine.playClick(); } catch (x) {} if (window.NDSay) NDSay(L(pick(GD))); }; }
    var nap = !!(W.phase && W.phase() === "night");   /* a visiting dog up on a stool behind the counter, on all four (curled up at night), facing into the room */
    if (gcv.dataset.nap !== String(nap)) { gcv.dataset.nap = String(nap); gcv.innerHTML = window.NDPetPic ? NDPetPic("dog", { asleep: nap, vw: 26, vh: 24, dx: 2, under: STOOL }) : ""; }
    gcv.style.display = "";
  }
  /* from Tonight's menu: Popo doesn't make drinks, she cooks you something instead */
  window.NDPopoCook = function (bar) { say(L(bar ? P.boozeNo : P.coffeeNo)); setTimeout(function () { serve(DISH[(Math.random() * DISH.length) | 0]); }, 1400); };
  window.NDPopoMenu = function () { return DISH.map(function (d) { return { ic: W.pix ? W.pix(d.ic) : "", name: L(d.name), desc: L(d.sub), go: function () { serve(d); } }; }).concat([{ ic: W.pix ? W.pix("books") : "", name: L(lx(["Cook me someone's family recipe", "做一道别人家的家传菜给我", "做一道別人家的家傳菜給我", "煮一味人哋屋企嘅家傳菜俾我", "Cocíname la receta de familia de alguien", "Cuina'm la recepta de família d'algú"])), desc: "", go: function () { window.PopoRecipes && PopoRecipes.cook && PopoRecipes.cook(); } },
    { ic: W.pix ? W.pix("pencil") : "", name: L(lx(["Leave a family recipe", "留下一道家传菜", "留下一道家傳菜", "留低一味家傳菜", "Deja una receta de familia", "Deixa una recepta de família"])), desc: "", go: function () { window.PopoRecipes && PopoRecipes.write(); } },
    { ic: W.pix ? W.pix("books") : "", name: L(lx(["Look in the recipe box", "翻翻食谱盒", "翻翻食譜盒", "睇吓個食譜盒", "Mirar en la caja de recetas", "Mirar a la capsa de receptes"])), desc: "", go: function () { window.PopoRecipes && PopoRecipes.open(); } }]); };
  window.NDDogMenu = function () { return DOGMENU.map(function (d) { return { ic: W.pix ? W.pix(d.ic) : "", name: L(d.name), desc: L(d.sub), go: function () { dogServe(d); } }; }); };
  window.NDDogBring = function () { dogServe(DOGMENU[(Math.random() * DOGMENU.length) | 0]); };
  function serve(d) {
    try { showServed({ icon: "", name: L(d.name), sub: L(d.sub), desc: L(d.desc), formula: "", reactable: false, food: d.ic !== "cup" }); } catch (e) { say(L(d.desc)); return; }
    var ic = W.pix ? W.pix(d.ic) : ""; ["res-icon", "served-item-plate"].forEach(function (id) { var el = document.getElementById(id); if (el) el.innerHTML = ic; });
    try { SoundEngine.playClink(); } catch (e) {}
    setTimeout(function () { try { showBubble(L(P.served), 3200); } catch (e) {} }, 900);
    try { DB.log("popo_serve", { k: d.k }); } catch (e) {}
  }
  /* the cats curl up when Wei sleeps; on someone else's visit they follow that host instead (their own hours when they're on) */
  try { var ss0 = Cats.syncSleep; Cats.syncSleep = function () { var h = who(); if (h.who === "wei") return ss0.apply(this, arguments); var asleep = h.who === "cats" && h.asleep, self = this;
    ["miso", "yuzu"].forEach(function (id) { var st = self.st[id]; if (asleep && st.pose !== "loaf") self.setPose(id, "loaf"); if (!asleep && st.pose === "loaf" && st.sleepUntil < Date.now()) self.setPose(id, "sit"); }); }; setTimeout(function () { try { Cats.syncSleep(); } catch (e) {} }, 1200); } catch (e) {}
  /* behind the counter, each host's own things: Mei's shelf is all glitter (nail polish, lip gloss, an iced coffee, polaroids,
     a disco ball), Popo's is a pantry (pickle jars, a bamboo steamer, a thermos, oranges, a mooncake tin, her radio), and on the
     cats' visits the shelves are theirs (a box, yarn, a fish, a feather). Wei's shelves stay as he keeps them. */
  var SHELF = {
    mei: { sign: M("DON'T TOUCH", "别碰", "別碰", "NO TOCAR", "NO TOCAR"), r: [["polish", "gloss", "compact", "iced"], ["polaroid", "disco", "polish", "scrunchie"], ["gloss", "polaroid", "scrunchie"], ["iced", "compact", "polish"]] },
    popo: { sign: M("PANTRY", "婆婆的架子", "婆婆嘅架", "DESPENSA", "REBOST"), r: [["jar", "jar", "steamer", "orange"], ["bowl", "thermos", "orange", "cup"], ["radio", "jar", "garden"], ["steamer", "restaurant", "bowl"]] },   /* her own tin is the one on the lower shelf (#nd-tin): only one */
    cats: { sign: M("MEOW", "喵", "喵", "MIAU", "MÈU"), r: [["box", "yarn"], ["feather", "fish", "yarn"], ["fish"], ["box"]] },
    mantou: { sign: M("WOOF", "汪", "汪", "GUAU", "BUP"), r: [["rope", "coin"], ["bowl", "yarn"], ["box"], ["dumpling", "coin"]] }   /* his lead, his ball, his water bowl, a sock, his toy box, a mantou from Popo's kitchen */
  };
  var shelf0 = null;
  function shelves(w) {
    var sh = document.querySelectorAll(".shelf"); if (sh.length < 2) return;
    var spans = [sh[0].querySelector("#shelf-icon-left"), sh[0].querySelector("#shelf-icon-right"), sh[1].children[0], sh[1].children[1]], sign = document.getElementById("cellar-banner-text");
    if (!shelf0) shelf0 = spans.map(function (e) { return e ? e.innerHTML : ""; });
    var S = SHELF[w];
    if (!S) { if (document.body.dataset.shelf) { spans.forEach(function (e, i) { if (e) e.innerHTML = shelf0[i]; }); delete document.body.dataset.shelf; try { if (window.updateCellarBanner) updateCellarBanner(); } catch (e) {} } return; }
    if (document.body.dataset.shelf !== w || !document.querySelector('.shelf .hshelf[data-h="' + w + '"]') || spans.some(function (e) { return e && [].some.call(e.childNodes, function (n) { return n.nodeType === 3 ? /\S/.test(n.nodeValue) : !(n.classList && n.classList.contains("hshelf") && n.dataset.h === w); }); })) {   /* (a thing moved to another spot along the shelves stays there) */ document.body.dataset.shelf = w; spans.forEach(   /* the town's clock re-stocks Wei's cellar every quarter hour: put the host's things back */function (e, i) { if (e) e.innerHTML = S.r[i].map(function (k) { return '<span class="hshelf" data-h="' + w + '" data-k="' + k + '">' + W.pix(k) + "</span>"; }).join(""); }); }
    if (sign && sign.textContent) sign.textContent = "";   /* the other hosts' shelves carry no sign (the owner, Nov 5) */
  }
  var css2 = document.createElement("style"); css2.textContent = ".hshelf{display:inline-block;width:20px;height:20px;margin:0 1px;vertical-align:bottom}.hshelf .fbpx{width:20px;height:20px}@media (min-width:768px){.hshelf,.hshelf .fbpx{width:26px;height:26px}}"; document.head.appendChild(css2);
  setInterval(function () { shelves(who().who); }, 2000); setTimeout(function () { shelves(who().who); }, 600);
  var tap0 = window.tapBartender;
  window.tapBartender = function () {
    var h = who();
    if (h.who === "popo" && !(window.WeiAway && WeiAway.on())) { say(L(pick(P.nap))); return; }   /* awake, a tap is a conversation (NDChat) */
    if (h.who === "mantou") { say(L(pick(D.nap))); return; }
    if (h.who === "cats") {   /* a tap wakes the cats; Popo is the only one nobody wakes */
      if (h.asleep && W.wake && W.wake()) { said = ""; dress(); try { renderCurrentDialogue(); } catch (e) {} say(L(lx(["*Yuzu opens one eye, stretches the whole length of the bar and sits up. Miso yawns.* Mrrp?", "*柚子睁开一只眼，沿着吧台伸了个长长的懒腰，坐了起来。味噌打了个哈欠。* 咪噜？", "*柚子睜開一隻眼，沿著吧台伸了個長長的懶腰，坐了起來。味噌打了個哈欠。* 咪嚕？", "*柚子擘開一隻眼，沿住吧枱伸咗個長長嘅懶腰，坐返起身。味噌打咗個喊露。* 咪嚕？", "*Yuzu abre un ojo, se estira a lo largo de la barra y se sienta. Miso bosteza.* ¿Mrrp?", "*La Yuzu obre un ull, s'estira tot al llarg de la barra i s'asseu. La Miso badalla.* Mrrp?"]))); try { Cats.syncSleep(); } catch (e) {} }
      return; }
    return tap0.apply(this, arguments);
  };
  var render0 = window.renderCurrentDialogue;
  window.renderCurrentDialogue = function () { var r = render0.apply(this, arguments); said = ""; dress(); return r; };
  setInterval(dress, 5000); setTimeout(function () { dress(); try { var h = who(); if ((h.who === "popo" || h.who === "cats") && AppState.inSanctuary) renderCurrentDialogue(); } catch (e) {} }, 900);
})();
