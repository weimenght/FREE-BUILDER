/* ===== The host's own topics (every other tap on the host): Wei keeps his chat, his riddle, his gifts and his usual;
   Mei, Popo, the cats and Mantou have theirs. ===== */
(function () {
  const H = (en, zh, tw, yue, es, ca) => lx([en, zh, tw, yue || tw, es, ca]);
  const TOPICS = {
    mei: {
      intro: [H("*one earbud out* okay, talk. I'm listening. mostly.", "*摘下一只耳机* 好，说吧。我在听。大概。", "*摘下一隻耳機* 好，說吧。我在聽。大概。", "*除低隻耳筒* 好啦，講啦。我有聽。大概啦。", "*se quita un auricular* vale, habla. te escucho. más o menos.", "*es treu un auricular* va, parla. t'escolto. més o menys.")],
      t: [
        { l: H("About you", "说说你", "說說你", "講吓你", "Sobre ti", "Sobre tu"), x: [
          H("sixteen. from Queens. here for the holidays, which turned into longer. I do nails, playlists and coffee. two out of three, I'm great at.", "十六岁。皇后区来的。本来是来过节，结果待久了。我会做指甲、做歌单、做咖啡。三样里有两样我很强。", "十六歲。皇后區來的。本來是來過節，結果待久了。我會做指甲、做歌單、做咖啡。三樣裡有兩樣我很強。", "十六歲。皇后區嚟嘅。本來嚟過節，點知留咗耐咗。我識整指甲、整歌單、沖咖啡。三樣有兩樣我好叻。", "dieciséis. de Queens. vine por las fiestas, que se alargaron. hago uñas, playlists y café. dos de tres, se me dan genial.", "setze. de Queens. vaig venir per les festes, que s'han allargat. faig ungles, playlists i cafè. dues de tres, se'm donen genial."),
          H("I'm not \"helping out\". I'm running the place. Wei's just letting me.", "我不是在“帮忙”。我在管这家店。Wei只是在让我管。", "我不是在「幫忙」。我在管這家店。Wei只是在讓我管。", "我唔係「幫手」。我係睇住間舖。Wei 只係由得我。", "no estoy \"echando una mano\". estoy llevando el sitio. Wei solo me deja.", "no estic \"donant un cop de mà\". porto el local. en Wei només em deixa.")] },
        { l: H("New York", "纽约", "紐約", "紐約", "Nueva York", "Nova York"), x: [
          H("the subway at 2 a.m. smells like pretzels and rain. I miss it so much it's annoying.", "凌晨两点的地铁有椒盐卷饼和雨的味道。我想它想得好烦。", "凌晨兩點的地鐵有蝴蝶餅和雨的味道。我想它想得好煩。", "凌晨兩點嘅地鐵有椒鹽脆餅同落雨嘅味。我掛住到好煩。", "el metro a las 2 de la mañana huele a pretzels y lluvia. lo echo tanto de menos que me molesta.", "el metro a les 2 de la matinada fa olor de pretzels i pluja. el trobo tant a faltar que em molesta."),
          H("my mom calls every Sunday. I pretend I'm busy. I'm never busy. call yours, by the way.", "我妈每个星期天都打来。我装很忙。我从来不忙。对了，打给你妈。", "我媽每個星期天都打來。我裝很忙。我從來不忙。對了，打給你媽。", "我阿媽逢禮拜日打嚟。我扮好忙。我從來唔忙。係呢，打俾你阿媽啦。", "mi madre llama cada domingo. finjo que estoy ocupada. nunca lo estoy. llama a la tuya, por cierto.", "la meva mare truca cada diumenge. faig veure que estic ocupada. no ho estic mai. truca a la teva, per cert.")] },
        { l: H("Your nails", "你的指甲", "你的指甲", "你啲指甲", "Tus uñas", "Les teves ungles"), x: [
          H("*holds them up* glitter, obviously. Popo says they look like fish scales. she means it nicely.", "*举起手* 当然是亮片。婆婆说像鱼鳞。她是夸我。", "*舉起手* 當然是亮片。婆婆說像魚鱗。她是誇我。", "*舉高隻手* 梗係亮片啦。婆婆話好似魚鱗。佢係讚我嘅。", "*las enseña* purpurina, obvio. Popo dice que parecen escamas de pez. lo dice con cariño.", "*les ensenya* purpurina, és clar. la Popo diu que semblen escates de peix. ho diu amb carinyo."),
          H("I painted Miso's claw once. once. she still hasn't forgiven me.", "我给味噌涂过一次爪子。就一次。她到现在都没原谅我。", "我給味噌塗過一次爪子。就一次。她到現在都沒原諒我。", "我同味噌搽過一次爪。得一次。佢到而家都未原諒我。", "le pinté una uña a Miso una vez. una. todavía no me lo perdona.", "li vaig pintar una ungla a la Miso una vegada. una. encara no m'ho ha perdonat.")] },
        { l: H("Your songs", "你的歌", "你的歌", "你啲歌", "Tus canciones", "Les teves cançons"), x: [
          H("two of mine are on the jukebox in Same Song. find them. don't tell me if you like them. okay, tell me.", "我有两首在「同一首歌」的点唱机里。自己找。喜不喜欢别告诉我。好吧，告诉我。", "我有兩首在「同一首歌」的點唱機裡。自己找。喜不喜歡別告訴我。好啦，告訴我。", "我有兩首喺「同一首歌」部點唱機度。自己搵。鍾唔鍾意唔好話我知。好啦，話我知。", "dos mías están en la gramola de La Misma Canción. búscalas. no me digas si te gustan. vale, dímelo.", "dues de meves són a la gramola de La Mateixa Cançó. busca-les. no em diguis si t'agraden. va, digues-m'ho."),
          H("right now? one song on repeat. it's a bolero. Popo's. don't tell anyone.", "现在？一首歌单曲循环。是首波莱罗。婆婆的。别告诉别人。", "現在？一首歌單曲循環。是首波麗露。婆婆的。別告訴別人。", "而家？一首歌單曲循環。係首波麗露。婆婆嗰首。唔好話俾人知。", "¿ahora? una canción en bucle. es un bolero. el de Popo. no se lo digas a nadie.", "ara? una cançó en bucle. és un bolero. el de la Popo. no ho diguis a ningú.")] },
        { l: H("Wei", "Wei", "Wei", "Wei", "Wei", "En Wei"), x: [
          H("he says I'm \"too much\". he puts the tea in alphabetical order. who's too much.", "他说我“太过了”。他把茶按字母排好。到底谁太过。", "他說我「太過了」。他把茶按字母排好。到底誰太過。", "佢話我「太過分」。佢將啲茶按字母排好。邊個先過分。", "dice que soy \"demasiado\". ordena el té alfabéticamente. quién es demasiado.", "diu que sóc \"massa\". ordena el te per ordre alfabètic. qui és massa."),
          H("don't tell him, but his notebook is kind of sweet. I read one page. okay, three.", "别告诉他，他的笔记本其实挺可爱的。我看了一页。好吧，三页。", "別告訴他，他的筆記本其實挺可愛的。我看了一頁。好啦，三頁。", "唔好話佢知，佢本簿其實幾得意。我睇咗一頁。好啦，三頁。", "no se lo digas, pero su libreta es bastante bonita. leí una página. vale, tres.", "no li diguis, però la seva llibreta és bastant bonica. en vaig llegir una pàgina. va, tres.")] }
      ]
    },
    popo: {
      intro: [H("*sits down on the stool, slowly* Talk, talk. I listen. You eat also lah.", "*慢慢坐上高凳* 说吧，说吧。我听。你也要吃东西。", "*慢慢坐上張高凳* 講啦講啦。我聽。你都要食嘢。", "*慢慢坐上張高凳* 講啦講啦。我聽。你都要食嘢。", "*se sienta despacio en el taburete* Habla, habla. Yo escucho. Tú come también.", "*s'asseu a poc a poc al tamboret* Parla, parla. Jo t'escolto. I tu menja.")],
      t: [
        { l: H("About you", "说说您", "講吓你", "講吓你", "Sobre ti", "Sobre vostè"), x: [
          H("Popo. Hong Kong girl. 1968 come Barcelona. Nineteen only. One suitcase, one dictionary.", "婆婆。香港女孩。一九六八年来巴塞罗那。十九岁。一个箱子，一本字典。", "婆婆。香港妹。一九六八年嚟巴塞隆拿。十九歲。一個喼，一本字典。", "婆婆。香港妹。一九六八年嚟巴塞隆拿。十九歲。一個喼，一本字典。", "Popo. Chica de Hong Kong. 1968 vengo Barcelona. Diecinueve. Una maleta, un diccionario.", "La Popo. Una noia de Hong Kong. El 1968 vaig arribar a Barcelona, amb dinou anys. Una maleta i un diccionari."),
          H("Now old lady already. Still cook every day. Who else will?", "现在老太婆咯。还是天天煮饭。不然，谁煮？", "而家老太婆囉。都係日日煮飯。唔係邊個煮？", "而家老太婆囉。都係日日煮飯。唔係邊個煮？", "Ahora señora vieja. Todavía cocino cada día. ¿Quién si no?", "Ara ja soc una vella. Encara cuino cada dia. Qui ho faria, si no?")] },
        { l: H("Josep", "Josep", "Josep", "Josep", "Josep", "En Josep"), x: [
          H("Clock man. He fix my watch, I fix his dinner. Fifty years like this lor.", "修钟的。他修我的表，我煮他的饭。五十年都是这样。", "整鐘嘅。佢整我隻錶，我煮佢餐飯。五十年都係咁。", "整鐘嘅。佢整我隻錶，我煮佢餐飯。五十年都係咁。", "Hombre del reloj. Él arregla mi reloj, yo arreglo su cena. Cincuenta años así.", "El rellotger. Ell m'arreglava el rellotge i jo li feia el sopar. Cinquanta anys així."),
          H("He sing very bad one. I miss it every night.", "他唱歌好难听。我每晚都想念。", "佢唱歌好難聽。我晚晚都掛住。", "佢唱歌好難聽。我晚晚都掛住。", "Él canta muy mal. Lo echo de menos cada noche.", "Cantava molt malament. Ho trobo a faltar cada nit.")] },
        { l: H("What's cooking?", "煮什么呀？", "煮緊乜呀？", "煮緊乜呀？", "¿Qué cocinas?", "Què cuines?"), x: [
          H("Congee. Always congee. Rice, water, time. Like people lor.", "粥。当然是粥啦。米、水、时间。跟人一样。", "粥。梗係粥。米、水、時間。同人一樣。", "粥。梗係粥。米、水、時間。同人一樣。", "Congee. Siempre congee. Arroz, agua, tiempo. Como la gente.", "Congee. Sempre congee. Arròs, aigua i temps. Com les persones."),
          H("Today escudella. Josep's mama teach me. My recipe box is there, take one home lah.", "今天 escudella。Josep 的妈妈教我的。我的食谱盒在那边，拿一张回家。", "今日 escudella。Josep 阿媽教我嘅。我個食譜盒喺嗰度，攞張返屋企。", "今日 escudella。Josep 阿媽教我嘅。我個食譜盒喺嗰度，攞張返屋企。", "Hoy escudella. La mamá de Josep me enseña. Mi caja de recetas está ahí, llévate una.", "Avui escudella. Me la va ensenyar la mare d'en Josep. La capsa de receptes és allà: emporta-te'n una.")] },
        { l: H("Wei and Mei", "Wei 和 Mei", "阿Wei同阿Mei", "阿Wei同阿Mei", "Wei y Mei", "En Wei i la Mei"), x: [
          H("Wei too serious, Mei too loud. Together, perfect. Don't tell them ah.", "阿Wei太认真，阿Mei太吵。放在一起，刚刚好。不要告诉他们。", "阿Wei太認真，阿Mei太嘈。擺埋一齊，啱啱好。唔好話佢哋知。", "阿Wei太認真，阿Mei太嘈。擺埋一齊，啱啱好。唔好話佢哋知。", "Wei muy serio, Mei muy ruidosa. Juntos, perfecto. No les digas.", "En Wei massa seriós, la Mei massa sorollosa. Junts, perfectes. No els ho diguis."),
          H("When small, they fight for the last egg tart. Now they fight for the music. Aiya.", "小时候抢最后一个蛋挞。现在抢放什么歌。", "細個爭最後一個蛋撻。而家爭播咩歌。", "細個爭最後一個蛋撻。而家爭播咩歌。", "De pequeños se pelean por la última tarta de huevo. Ahora por la música.", "De petits es barallaven per l'última tarteta d'ou. Ara, per la música.")] },
        { l: H("Your songs", "您的歌", "你啲歌", "你啲歌", "Tus canciones", "Les seves cançons"), x: [
          H("Same Song got my two. One for after closing, Josep and me. One for congee at six. Go listen lah.", "「同一首歌」有我两首。一首是打烊之后，我和 Josep。一首是六点钟的粥。去听一下。", "「同一首歌」有我兩首。一首係收舖之後，我同 Josep。一首係六點鐘嘅粥。去聽吓。", "「同一首歌」有我兩首。一首係收舖之後，我同 Josep。一首係六點鐘嘅粥。去聽吓。", "La Misma Canción tiene dos mías. Una para después de cerrar, Josep y yo. Una para el congee de las seis. Ve a escuchar.", "A La Mateixa Cançó n'hi ha dues de meves. Una de després de tancar, en Josep i jo. I una del congee de les sis. Ves a escoltar-les.")] }
      ]
    },
    cats: {
      intro: [H("*Miso and Yuzu sit up behind the counter, tails wrapped round their paws* Mrrp.", "*味噌和柚子在吧台后坐直，尾巴绕着爪子* 咪噜。", "*味噌和柚子在吧檯後坐直，尾巴繞著爪子* 咪嚕。", "*味噌同柚子喺吧枱後面坐直，條尾圍住對爪* 咪嚕。", "*Miso y Yuzu se sientan tras la barra, la cola alrededor de las patas* Mrrp.", "*La Miso i la Yuzu seuen darrere la barra, amb la cua al voltant de les potes* Mrrp.")],
      t: [
        { l: H("*slow blink at Miso*", "*对味噌慢慢眨眼*", "*對味噌慢慢眨眼*", "*對住味噌慢慢眨眼*", "*parpadear despacio a Miso*", "*parpellejar a poc a poc a la Miso*"), c: 'miso', x: [
          H("*Miso slow-blinks back. That was a whole conversation.*", "*味噌也慢慢眨了回来。这就是一整场对话了。*", "*味噌也慢慢眨了回來。這就是一整場對話了。*", "*味噌都慢慢眨返你。呢個已經係成場傾偈。*", "*Miso te devuelve el parpadeo lento. Eso ha sido toda una conversación.*", "*La Miso et torna el parpelleig lent. Això ha estat tota una conversa.*")] },
        { l: H("*wiggle a finger*", "*晃一晃手指*", "*晃一晃手指*", "*郁吓隻手指*", "*mover un dedo*", "*bellugar un dit*"), c: 'yuzu', x: [
          H("*Yuzu's pupils go huge. She pounces, misses, and washes her shoulder as if she meant to.*", "*柚子的瞳孔一下放大。她扑过来，扑空，然后舔起肩膀，好像本来就是这个意思。*", "*柚子的瞳孔一下放大。她撲過來，撲空，然後舔起肩膀，好像本來就是這個意思。*", "*柚子對眼即刻放大。佢撲過嚟，撲空，跟住舔吓膊頭，扮本來就係咁。*", "*A Yuzu se le dilatan las pupilas. Salta, falla y se lava el hombro como si fuera a propósito.*", "*A la Yuzu se li dilaten les pupil·les. Salta, falla, i es llepa l'espatlla com si ho hagués fet expressament.*")] },
        { l: H("*ask where they've been*", "*问她们去哪儿了*", "*問她們去哪兒了*", "*問佢哋去咗邊*", "*preguntar dónde han estado*", "*preguntar on han estat*"), x: [
          H("*Yuzu has sand between her toes. Sandy Cove, then. Miso smells faintly of the lake.*", "*柚子脚趾间有沙子。那就是沙湾了。味噌身上有一点湖水的味道。*", "*柚子腳趾間有沙子。那就是沙灣了。味噌身上有一點湖水的味道。*", "*柚子腳趾罅有沙。噉即係去咗沙灣。味噌身上有少少湖水味。*", "*Yuzu tiene arena entre los dedos. La Cala, entonces. Miso huele un poco a lago.*", "*La Yuzu té sorra entre els dits. La Cala, doncs. La Miso fa una mica d'olor de llac.*")] },
        { l: H("*hum a tune*", "*哼一段曲子*", "*哼一段曲子*", "*哼段歌*", "*tararear algo*", "*taral·lejar alguna cosa*"), x: [
          H("*Both ears turn. Yuzu pats the jukebox. Somewhere in Same Song there's a record with her pawprint on it.*", "*两只耳朵都转过来。柚子拍拍点唱机。「同一首歌」里有一张唱片印着她的爪印。*", "*兩隻耳朵都轉過來。柚子拍拍點唱機。「同一首歌」裡有一張唱片印著她的爪印。*", "*兩隻耳仔都轉過嚟。柚子拍吓部點唱機。「同一首歌」入面有張碟印住佢個爪印。*", "*Las dos giran las orejas. Yuzu da una palmadita a la gramola. En La Misma Canción hay un disco con su huella.*", "*Totes dues giren les orelles. La Yuzu dona un copet a la gramola. A La Mateixa Cançó hi ha un disc amb la seva petjada.*")] }
      ]
    },
    mantou: {
      intro: [H("*Mantou sits up tall on his stool and looks at you, ears up.* Woof?", "*馒头在高凳上坐直，竖着耳朵看你。* 汪？", "*饅頭在高凳上坐直，豎著耳朵看你。* 汪？", "*饅頭喺高櫈度坐直，耳仔企企咁望住你。* 汪？", "*Mantou se sienta bien tieso en su taburete y te mira, orejas arriba.* ¿Guau?", "*En Mantou s'asseu ben dret al tamboret i et mira, amb les orelles dretes.* Bup?")],
      t: [
        { l: H("*say his name*", "*叫他的名字*", "*叫他的名字*", "*叫佢個名*", "*decir su nombre*", "*dir el seu nom*"), x: [
          H("*Mantou's whole back half wags.* Woof!", "*馒头整个后半身都在摇。* 汪！", "*饅頭整個後半身都在搖。* 汪！", "*饅頭成個後半身都喺度擰。* 汪！", "*A Mantou le menea toda la mitad de atrás.* ¡Guau!", "*A en Mantou li belluga tota la meitat del darrere.* Bup!")] },
        { l: H("*ask about Josep*", "*问起 Josep*", "*問起 Josep*", "*問起 Josep*", "*preguntar por Josep*", "*preguntar per en Josep*"), x: [
          H("*Mantou looks at the clock over the door and lies down, chin on his paws. Some mornings he still goes to meet the 7:40.*", "*馒头看了看门上的钟，趴下来，下巴搁在爪子上。有些早上他还是会去等七点四十那班车。*", "*饅頭看了看門上的鐘，趴下來，下巴擱在爪子上。有些早上他還是會去等七點四十那班車。*", "*饅頭望一望門頂個鐘，伏低，下巴擱喺對爪度。有啲朝早佢都仲會去等七點四十嗰班車。*", "*Mantou mira el reloj de encima de la puerta y se tumba, la barbilla en las patas. Algunas mañanas todavía va a esperar el de las 7:40.*", "*En Mantou mira el rellotge de sobre la porta i s'estira, amb la barbeta a les potes. Alguns matins encara va a esperar el de les 7:40.*")] },
        { l: H("*ask what he's got*", "*问他叼着什么*", "*問他叼著什麼*", "*問佢咬住乜*", "*preguntar qué lleva*", "*preguntar què porta*"), x: [
          H("*He opens his mouth. A sock. Not yours. Probably Wei's.*", "*他张开嘴。一只袜子。不是你的。大概是 Wei 的。*", "*他張開嘴。一隻襪子。不是你的。大概是 Wei 的。*", "*佢擘大口。一隻襪。唔係你嘅。大概係 Wei 嘅。*", "*Abre la boca. Un calcetín. No es tuyo. Seguramente de Wei.*", "*Obre la boca. Un mitjó. No és teu. Segurament d'en Wei.*")] },
        { l: H("*hum a tune*", "*哼一段曲子*", "*哼一段曲子*", "*哼段歌*", "*tararear algo*", "*taral·lejar alguna cosa*"), x: [
          H("*Mantou tips his head back and howls along, one long note. There's a record in Same Song he barks on.*", "*馒头仰起头跟着嚎，一个长音。「同一首歌」里有一张唱片有他的叫声。*", "*饅頭仰起頭跟著嚎，一個長音。「同一首歌」裡有一張唱片有他的叫聲。*", "*饅頭擰起個頭跟住嗥，一個長音。「同一首歌」入面有張碟有佢把聲。*", "*Mantou echa la cabeza atrás y aúlla contigo, una nota larga. En La Misma Canción hay un disco donde ladra él.*", "*En Mantou tira el cap enrere i udola amb tu, una nota llarga. A La Mateixa Cançó hi ha un disc on borda ell.*")] }
      ]
    }
  };
  const TALK_ME = H("💬 Talk to me", "💬 跟我聊聊", "💬 跟我聊聊", "💬 同我傾吓", "💬 Háblame", "💬 Parla'm");
  const host = () => { try { return (window.NDChat && NDChat.who()) || null; } catch (e) { return null; } };
  const used = {};
  function hostChat(k) {
    const P = TOPICS[k]; if (!P) return;
    const avail = P.t.filter(tp => !tp.c || typeof Cats === 'undefined' || !Cats.here || Cats.here(tp.c));
    const btns = () => avail.map(tp => ({ label: L(tp.l), onClick: () => {
      const i = used[k + L(tp.l)] || 0; used[k + L(tp.l)] = i + 1;
      try { if (k === 'cats') SoundEngine.playMeow(1); else SoundEngine.playClick(); } catch (e) {}
      try { if (k !== 'cats') setExpression('grin', 1400); } catch (e) {}
      renderWei(L(tp.x[i % tp.x.length]), btns(), COMPACT_GRID, 'chat'); } }))
      .concat([{ label: L(TALK_ME), onClick: () => { if (!(window.NDChat && NDChat.now(true))) backToOrder(); } }, { label: L(WeiText.ui.back), onClick: backToOrder }]);
    renderWei(L(P.intro[0]), btns(), COMPACT_GRID, 'chat');
  }
  window.NDTopics = function () { const k = host(); if (!k) return false; try { if (k === 'wei') openChat(); else if (TOPICS[k]) hostChat(k); else return false; return true; } catch (e) { return false; } };
})();
