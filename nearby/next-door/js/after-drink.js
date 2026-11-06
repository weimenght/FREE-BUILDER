/* After a drink, Wei doesn't wait to be asked: he starts something. Small acts, not explanations. */
(function () {
  const S = (en, zh, es, ca) => lx([en, zh, '', '', es, ca]);
  const W = window.FBWorld || {};
  const pn = k => (W.name ? W.name(k, { en: 'en', zh: 'zh', tw: 'zh-Hant', yue: 'zh-Hant', es: 'es', ca: 'ca' }[AppState.lang] || 'en') : k);
  const go = (k, q) => { const u = (W.url ? W.url(k) : '/nearby/') + (q || ''); try { if (window.parent && window.parent.FBShell) return window.parent.FBShell.open(u); } catch (e) {} location.href = u; };
  const round = S("🍸 Another round", "🍸 再来一杯", "🍸 Otra ronda", "🍸 Una altra ronda");
  const roundFood = lx(["🍲 Another plate", "🍲 再来一份", "🍲 再來一份", "🍲 再嚟一份", "🍲 Otro plato", "🍲 Un altre plat"]);
  const B = (label, fn) => ({ label: L(label), onClick: fn });
  const again = () => B(AppState.lastFood ? roundFood : round, backToOrder);
  const say = (line, btns) => { try { setExpression('grin', 1600); } catch (e) {} renderWei(L(line), btns, COMPACT_GRID, 'follow'); };
  const DRINKS = () => Object.keys(DrinkManifest).filter(k => DrinkManifest[k].type === (AppState.isBarOpen ? 'bar' : 'cafe'));
  const BITS = [
    function coin() {
      say(S("*flips a bottle cap and slaps it on the bar* Heads or tails? Call it right and the next one's on the house.", "*把瓶盖一弹，啪地按在吧台上* 正面还是反面？猜对了，下一杯我请。", "*lanza una chapa y la tapa con la mano* ¿Cara o cruz? Si aciertas, la próxima invita la casa.", "*llança una xapa i la tapa amb la mà* Cara o creu? Si l'encertes, la propera convida la casa."),
        [B(S("Heads", "正面", "Cara", "Cara"), () => flip(true)), B(S("Tails", "反面", "Cruz", "Creu"), () => flip(false)), again()]);
      function flip(h) { const win = (Math.random() < .5) === h; try { SoundEngine.playClink(); } catch (e) {}
        if (win) { say(S("*lifts his hand, raises an eyebrow* …Fine. You win. *already reaching for a glass*", "*抬起手，挑了挑眉* ……行吧，你赢了。*已经伸手去拿杯子了*", "*levanta la mano, alza una ceja* …Vale. Ganas tú. *ya va a por un vaso*", "*aixeca la mà, arqueja una cella* …D'acord. Guanyes. *ja va a buscar un got*"),
            [B(S("🎁 Pour it", "🎁 倒上", "🎁 Sírvela", "🎁 Serveix-la"), () => serveItemByKey(pick(DRINKS()), { free: true })), again()]); }
        else say(S("*peeks under his hand, slides the cap into his pocket* House wins. It always does. Again sometime.", "*偷看一眼，把瓶盖塞进口袋* 庄家赢。一向如此。下次再来。", "*mira bajo la mano y se guarda la chapa* Gana la casa. Siempre gana. Otra vez será.", "*mira sota la mà i es guarda la xapa* Guanya la casa. Sempre guanya. Una altra vegada serà."), [again()]); }
    },
    function cherry() {
      say(S("*hides both hands behind his back* There's a cherry in one of them. Which?", "*两只手背到身后* 有一只手里藏着樱桃。哪只？", "*esconde las dos manos a la espalda* Hay una cereza en una de ellas. ¿Cuál?", "*amaga les dues mans a l'esquena* Hi ha una cirera en una. Quina?"),
        [B(S("👈 Left", "👈 左手", "👈 Izquierda", "👈 Esquerra"), () => open()), B(S("Right 👉", "右手 👉", "Derecha 👉", "Dreta 👉"), () => open()), again()]);
      function open() { const got = Math.random() < .5;
        say(got ? S("*opens his hand* 🍒 For your glass. Don't tell Yuzu, she steals them.", "*摊开手* 🍒 放你杯里。别告诉柚子，她会偷。", "*abre la mano* 🍒 Para tu vaso. No se lo digas a Yuzu, que las roba.", "*obre la mà* 🍒 Per al teu got. No ho diguis a la Yuzu, que les roba.")
                : S("*opens an empty hand, then the other, also empty* …Miso. MISO.", "*摊开一只空手，又摊开另一只，也是空的* ……味噌。味噌！", "*abre una mano vacía, luego la otra, también vacía* …Miso. ¡MISO!", "*obre una mà buida, després l'altra, també buida* …Miso. MISO!"), [again()]); }
    },
    function who() {
      say(S("*leans on the bar, chin in hand* If you could bring one person in here tonight, who'd it be?", "*胳膊撑在吧台上，托着下巴* 如果今晚能带一个人来这儿，你会带谁？", "*se apoya en la barra, barbilla en la mano* Si pudieras traer a alguien esta noche, ¿a quién?", "*recolzat a la barra, amb la barbeta a la mà* Si poguessis portar algú aquesta nit, a qui?"),
        [B(S("Someone far away", "远方的人", "Alguien lejos", "Algú lluny"), () => say(S("*sets two candles on a tray* Then don't wait for a plane. Two Candles keeps a table for two, however far apart.", "*把两支蜡烛放上托盘* 那就别等飞机了。“双烛小馆”留着一张双人桌，隔多远都行。", "*pone dos velas en una bandeja* Entonces no esperes un avión. Dos Velas guarda una mesa para dos, estéis donde estéis.", "*posa dues espelmes en una safata* Doncs no esperis un avió. Dues Espelmes guarda una taula per a dos, siguis on siguis."), [B(S("🕯️ Take me there", "🕯️ 带我去", "🕯️ Llévame", "🕯️ Porta-m'hi"), () => go('restaurant')), again()])),
         B(S("An old friend", "老朋友", "Un viejo amigo", "Un vell amic"), () => say(S("*hands you a pen* Write to them. Say Hello can seal a card until the day you choose.", "*递给你一支笔* 给他写点什么吧。“问个好”能把明信片封存到你选的那天。", "*te pasa un boli* Escríbele. Di Hola sella una postal hasta el día que elijas.", "*et dona un boli* Escriu-li. Digues Hola segella una postal fins al dia que triïs."), [...((W.state && W.state('postcard') === 'shut') ? [] : [B(S("✉️ Take me there", "✉️ 带我去", "✉️ Llévame", "✉️ Porta-m'hi"), () => go('postcard'))]), again()])),
         B(S("Nobody. I like the quiet", "谁也不带，我喜欢安静", "Nadie. Me gusta la calma", "Ningú. M'agrada la calma"), () => say(S("*nods, turns the music down a notch* Then finish that and go lie in the grass for ten minutes.", "*点点头，把音乐调小一格* 那就喝完这杯，去草地上躺十分钟。", "*asiente y baja un poco la música* Pues acaba eso y ve a tumbarte en la hierba diez minutos.", "*assenteix i abaixa una mica la música* Doncs acaba això i ves a estirar-te a l'herba deu minuts."), [B(S("☁️ Take me there", "☁️ 带我去", "☁️ Llévame", "☁️ Porta-m'hi"), () => go('cloud')), again()]))]);
    },
    function cats() {
      let c = null; try { c = W.cats && W.cats(); } catch (e) {}
      const k = c && c.yuzu && c.yuzu !== 'bar' ? c.yuzu : null;
      if (!k) return BITS[0]();
      say(S("*nods at the door* Yuzu just came back from {p} with something stuck in her fur. Petal? Sawdust? I'm not asking.".replace('{p}', pn(k)), "*朝门口一点头* 柚子刚从{p}回来，毛里粘着什么东西。花瓣？木屑？我不问。".replace('{p}', pn(k)), "*señala la puerta* Yuzu acaba de volver de {p} con algo enganchado al pelo. ¿Un pétalo? ¿Serrín? No pregunto.".replace('{p}', pn(k)), "*assenyala la porta* La Yuzu acaba de tornar de {p} amb alguna cosa enganxada al pèl. Un pètal? Serradures? No pregunto.".replace('{p}', pn(k))),
        [B(S("🐾 Go and see", "🐾 去看看", "🐾 Ve a ver", "🐾 Ves a veure"), () => go(k)), again()]);
    },
    function window_() {
      const ph = W.phase ? W.phase() : 'day', spot = ph === 'dusk' ? ['lake', '?place=lake'] : ph === 'night' ? ['tower', ''] : ph === 'dawn' ? ['cloud', '?place=meadow'] : ['books', ''];
      const line = {
        lake: S("*glances out the window, stops polishing* The lake's doing that thing with the light. Five minutes, tops. Go.", "*往窗外看了一眼，停下擦杯子的手* 湖面又在反光了，最多五分钟。快去。", "*mira por la ventana y deja de sacar brillo* El lago está haciendo eso con la luz. Cinco minutos, como mucho. Ve.", "*mira per la finestra i deixa d'eixugar* El llac fa allò amb la llum. Cinc minuts, com a molt. Ves-hi."),
        tower: S("*points his towel at the ceiling* Clear night. From Slow Clock you can count them. I got to forty once.", "*用抹布指指天花板* 晴夜。在“慢钟”上能数星星。我数到过四十颗。", "*señala el techo con el trapo* Noche clara. Desde el Reloj Lento se pueden contar. Una vez llegué a cuarenta.", "*assenyala el sostre amb el drap* Nit clara. Des del Rellotge Lent es poden comptar. Una vegada en vaig comptar quaranta."),
        cloud: S("*opens the window a crack* Smell that? Dew on the meadow. Nobody's up yet. Best time.", "*把窗推开一条缝* 闻到了吗？草甸上的露水。还没人起来，正是时候。", "*abre un poco la ventana* ¿Lo hueles? Rocío en el prado. Aún no se ha levantado nadie. El mejor momento.", "*obre una mica la finestra* Ho olores? Rosada al prat. Encara no s'ha llevat ningú. El millor moment."),
        books: S("*slides a bookmark under your glass* Someone left this at Borrowed Pages. Says 'page 112, trust me'.", "*把一张书签塞到你杯子下* 有人落在“借来的书”的。上面写着：“第 112 页，信我。”", "*desliza un marcapáginas bajo tu vaso* Alguien lo dejó en Páginas Prestadas. Dice 'página 112, créeme'.", "*fa lliscar un punt de llibre sota el teu got* Algú el va deixar a Pàgines Manllevades. Diu 'pàgina 112, fes-me cas'.")
      }[spot[0]];
      say(line, [B(S("→ Take me there", "→ 带我去", "→ Llévame", "→ Porta-m'hi"), () => go(spot[0], spot[1])), again()]);
    },
    function joke() {
      say(S("*polishes a glass, pauses, looks at you* Want to hear the worst joke I know?", "*擦着杯子，停下来，看着你* 想听我知道的最烂的笑话吗？", "*saca brillo a un vaso, se detiene, te mira* ¿Quieres oír el peor chiste que sé?", "*eixuga un got, s'atura, et mira* Vols sentir el pitjor acudit que sé?"),
        [B(S("Go on then", "说吧", "Venga", "Endavant"), () => { try { promptJoke(); } catch (e) { backToOrder(); } }),
         B(S("Please don't", "千万别", "Por favor, no", "Si us plau, no"), () => say(S("*puts the glass down slowly, wounded* …It was about a cat. It was good.", "*慢慢放下杯子，受伤的样子* ……是关于猫的。挺好笑的。", "*deja el vaso despacio, dolido* …Era de un gato. Era bueno.", "*deixa el got a poc a poc, ferit* …Era d'un gat. Era bo."), [again()]))]);
    },
    function news() { if (window.townTalk) window.townTalk(); else BITS[0](); },
    /* the house's own things come up after a drink too: a guessing game, a classic, the chalkboard of neighbours' picks, a gift */
    function house() { if (!(window.NDOffer && NDOffer('wei', true))) BITS[0](); },
    function house2() { if (!(window.NDOffer && NDOffer('wei', true))) BITS[1](); }
  ];
  /* a fish you sent from Mirror Lake: Wei cooks it the next time you sit down */
  function fish() {
    let f = null; try { f = JSON.parse(localStorage.getItem('fb_fish_for_wei') || 'null'); localStorage.removeItem('fb_fish_for_wei'); } catch (e) {}
    if (!f || !f.n) return false;
    const n = f.n;
    say(S("*lifts a lid: a {f}, grilled with salt and lemon* Someone caught this at Mirror Lake. Looks a lot like you. Eat.".replace('{f}', n[0]), "*掀开盖子：一条{f}，撒了盐，挤了柠檬* 有人在镜湖钓的。长得挺像你的。吃吧。".replace('{f}', n[1]), "*levanta una tapa: un {f} a la brasa con sal y limón* Alguien lo pescó en Lago Espejo. Se parece mucho a ti. Come.".replace('{f}', n[3]), "*aixeca una tapa: un {f} a la brasa amb sal i llimona* Algú el va pescar al Llac Mirall. S'assembla molt a tu. Menja.".replace('{f}', n[4])),
      [B(S("🎣 Catch another", "🎣 再去钓一条", "🎣 Pesca otro", "🎣 Pesca'n un altre"), () => go('lake')), again()]);
    return true;
  }
  let bag = [];
  function next() { if (!bag.length) bag = BITS.map((f, i) => i).sort(() => Math.random() - .5); return BITS[bag.pop()]; }   /* every bit once before any repeats */
  let timer = null;
  window.weiFollowUp = function (delay) {
    clearTimeout(timer);
    timer = setTimeout(() => { if (AppState.uiMode !== 'served' || AppState.weiState !== 'awake' || (window.NDChat && NDChat.busy())) return; if (fish()) return; next()(); }, delay);
  };
})();
