    /* =====================================================================
       NEW WEI + CAT CONTENT  —  order: [en, zh, tw, yue, es, ca]
       Empty tw → converted from zh automatically (Taiwan phrasing).
       ===================================================================== */
    const lxa = rows => rows.map(lx);

    const WEI_SERVE = lxa([   /* Wei, sliding a drink over */
      ["*slides it across on a coaster* There you go.", "*垫着杯垫推过来* 请。", "*墊著杯墊推過來* 請。", "*墊住杯墊推過嚟* 請。", "*te lo acerca sobre un posavasos* Aquí tienes.", "*te l'acosta sobre un sotagot* Aquí el tens."],
      ["*wipes the rim once more* Slowly. It's better slowly.", "*又擦了一下杯沿* 慢慢喝，慢慢喝才好喝。", "*又擦了一下杯沿* 慢慢喝，慢慢喝才好喝。", "*再抹一抹杯邊* 慢慢飲，慢慢飲先好飲。", "*limpia el borde una vez más* Despacio. Despacio sabe mejor.", "*neteja la vora un cop més* A poc a poc. A poc a poc és millor."],
      ["*sets it down and steps back, towel over his shoulder* Tell me.", "*放下杯子，退后一步，抹布搭在肩上* 说说看。", "*放下杯子，退後一步，抹布搭在肩上* 說說看。", "*放低杯，退後一步，條毛巾搭喺膊頭* 講吓。", "*lo deja y da un paso atrás, trapo al hombro* Cuéntame.", "*el deixa i fa un pas enrere, amb el drap a l'espatlla* Explica'm."]
    ]);
    const WEI_WORK = lxa([   /* what he's doing when you walk in: small acts, no words */
      ["*wipes the counter*", "*擦着吧台*", "", "*抹緊吧枱*", "*limpia la barra*", "*neteja la barra*"],
      ["*dries a glass, holds it to the light*", "*擦干一只杯子，对着灯看了看*", "", "*抹乾隻杯，對住燈睇吓*", "*seca un vaso y lo mira a contraluz*", "*eixuga un got i el mira a contrallum*"],
      ["*slices a lemon, very slowly*", "*慢慢地切着柠檬*", "", "*慢慢切緊檸檬*", "*corta un limón, muy despacio*", "*talla una llimona, molt a poc a poc*"],
      ["*sets a coaster down on the counter*", "*在吧台上放下一张杯垫*", "", "*喺吧枱放低張杯墊*", "*deja un posavasos en la barra*", "*deixa un sotagot a la barra*"]
    ]);
    // Name-aware greetings replace the old anonymous ones
    WeiText.greet = {
      first: lxa([
        ["Nice to meet you, {name}. Sit anywhere — except there. That's Yuzu's stool.", "{name}，幸会。随便坐——除了那张，那是柚子的专座。", "", "{name}，幸會。隨便坐——除咗嗰張，嗰張係柚子嘅專座。", "Encantado, {name}. Siéntate donde quieras, menos ahí: es el taburete de Yuzu.", "Encantat, {name}. Seu on vulguis, menys aquí: és el tamboret de la Yuzu."]
      ]),
      back: lxa([
        ["{name}! Miso saved your stool.", "{name}！味噌帮你占着座呢。", "", "{name}！味噌幫你霸咗位。", "¡{name}! Miso te guardó el taburete.", "{name}! La Miso t'ha guardat el tamboret."],
        ["Oh, {name}. Good. The music's better when you're here.", "哦，{name}。挺好，你在的时候音乐都好听些。", "", "哦，{name}。好，你喺度啲歌都好聽啲。", "Ah, {name}. Bien. La música suena mejor contigo.", "Ah, {name}. Bé. La música sona millor amb tu."],
        ["Welcome back, {name}. Wipe your feet — Yuzu just mopped.", "欢迎回来，{name}。擦擦鞋，柚子刚拖完地。", "", "歡迎返嚟，{name}。抹抹對鞋，柚子啱啱拖完地。", "Bienvenido, {name}. Límpiate los pies, Yuzu acaba de fregar.", "Benvingut, {name}. Neteja't els peus, la Yuzu acaba de fregar."]
      ]),
      friend: lxa([
        ["There you are, {name}. I was starting to worry.", "{name}，你可算来了，我都开始担心了。", "", "{name}，你終於嚟喇，我都開始擔心。", "Ahí estás, {name}. Empezaba a preocuparme.", "Ets aquí, {name}. Començava a patir."],
        ["My favorite regular! Don't tell the others, {name}.", "我最喜欢的熟客！{name}，别告诉别人。", "", "我最鍾意嘅熟客！{name}，唔好話俾人知。", "¡Mi cliente favorito! No se lo digas a nadie, {name}.", "El meu client preferit! No ho diguis a ningú, {name}."]
      ])
    };

    WeiText.riddleWrong = lx(["\"Close, but no. It was the {drink}. Want one anyway?\"", "\"差一点，不对。答案是{drink}。要不要来一杯？\"", "", "\"差少少，唔啱。答案係{drink}。照樣嚟一杯？\"", "\"Casi, pero no. Era el {drink}. ¿Lo quieres igual?\"", "\"Gairebé, però no. Era el {drink}. El vols igualment?\""]);

    // New chat topics, handled specially by the counter engine
    WeiText.chatTopics.splice(4, 0,
      { id: 'day',       minLevel: 0, label: UI['chat.day'],       lines: [] },
      { id: 'fortune',   minLevel: 0, label: UI['chat.fortune'],   lines: [] },
      { id: 'gossip',    minLevel: 0, label: UI['chat.gossip'],    lines: [] },
      { id: 'challenge', minLevel: 1, label: UI['chat.challenge'], lines: [] }
    );

    const WeiPlus = {
      // How was your day? [label, reply], with a drink for bar and café
      day: [
        { emoji: '☀️', bar: 'catalan', cafe: 'gesha_pourover', bond: 1, mood: 'baristaJoy',
          label: lx(["Great, actually", "其实挺好的", "", "其實幾好", "Genial, la verdad", "Genial, la veritat"]),
          reply: lx(["\"Good days deserve a toast. Something bright and floral, on me — well, half on me.\"", "\"好日子值得一杯。来点明亮带花香的，算我请——请一半。\"", "", "\"好日子要飲返杯。嚟杯清新花香嘅，我請——請一半。\"", "\"Los días buenos merecen un brindis. Algo floral y luminoso; invito yo… a medias.\"", "\"Els dies bons mereixen un brindis. Alguna cosa floral i lluminosa; convido jo… a mitges.\""]) },
        { emoji: '😮‍💨', bar: 'penicillin', cafe: 'dirty_espresso', bond: 1, mood: 'empath',
          label: lx(["Tired", "累", "", "好攰", "Cansado", "Cansat"]),
          reply: lx(["\"Then sit. No small talk required. Honey, ginger, a little smoke — the drink does the talking.\"", "\"那就坐着，不用寒暄。蜂蜜、姜、一点烟熏——让酒来说话。\"", "", "\"咁就坐低，唔使客套。蜂蜜、薑、少少煙燻——等杯嘢講嘢。\"", "\"Entonces siéntate. No hace falta charlar. Miel, jengibre y un poco de humo: que hable la copa.\"", "\"Doncs seu. No cal xerrar. Mel, gingebre i una mica de fum: que parli la copa.\""]) },
        { emoji: '🌪️', bar: 'negroni', cafe: 'coldbrew_tonic', bond: 1, mood: 'sarcastic',
          label: lx(["Stressed out", "压力山大", "", "壓力爆煲", "Estresado", "Estressat"]),
          reply: lx(["\"Bitter for bitter. Equal parts. You'll feel understood by a glass.\"", "\"以苦攻苦，等比例。你会被一杯酒理解的。\"", "", "\"以苦攻苦，一比一比一。你會俾一杯酒明白晒。\"", "\"Amargo contra amargo, a partes iguales. Te sentirás comprendido por un vaso.\"", "\"Amarg contra amarg, a parts iguals. Et sentiràs comprès per un got.\""]) },
        { emoji: '🌧️', bar: 'jasmine_gulou', cafe: 'matcha_cloud', bond: 2, mood: 'poetic',
          label: lx(["A bit sad", "有点难过", "", "有少少唔開心", "Un poco triste", "Una mica trist"]),
          reply: lx(["\"Then tonight is gentle. Jasmine, osmanthus, slow ice. And Miso is allowed on your lap.\"", "\"那今晚就温柔一点。茉莉、桂花、慢慢化的冰。味噌也可以趴你腿上。\"", "", "\"咁今晚就溫柔啲。茉莉、桂花、慢慢溶嘅冰。味噌都可以伏喺你大髀度。\"", "\"Entonces esta noche será suave. Jazmín, osmanto, hielo lento. Y Miso puede subirse a tu regazo.\"", "\"Doncs aquesta nit serà suau. Gessamí, osmant, gel lent. I la Miso pot pujar-te a la falda.\""]) },
        { emoji: '😐', bar: 'catalan_vermut', cafe: 'croissant_combo', bond: 1, mood: 'nightOwl',
          label: lx(["Meh. Just meh.", "一般般吧", "", "麻麻哋", "Pues… ni fu ni fa", "Doncs… ni fu ni fa"]),
          reply: lx(["\"Meh is underrated. A vermut, an olive, nothing to prove.\"", "\"一般般被低估了。来杯苦艾酒、一颗橄榄，什么都不用证明。\"", "", "\"麻麻哋其實好被低估。一杯苦艾酒、一粒橄欖，乜都唔使證明。\"", "\"El 'ni fu ni fa' está infravalorado. Un vermut, una aceituna, nada que demostrar.\"", "\"El 'ni fu ni fa' està infravalorat. Un vermut, una oliva, res a demostrar.\""]) }
      ],

      fortunes: lxa([
        ["Something you lost will turn up in a coat pocket.", "你丢的东西，会在某件外套口袋里出现。", "", "你唔見咗嘅嘢，會喺某件褸嘅袋度搵返。", "Algo que perdiste aparecerá en el bolsillo de un abrigo.", "Una cosa que vas perdre apareixerà a la butxaca d'un abric."],
        ["A slow week is still a week. Drink water.", "慢的一周也是一周。多喝水。", "", "慢嘅一個禮拜都係一個禮拜。飲多啲水。", "Una semana lenta sigue siendo una semana. Bebe agua.", "Una setmana lenta continua sent una setmana. Beu aigua."],
        ["Say yes to the next small invitation.", "下一个小小的邀约，答应它。", "", "下一個細細嘅邀請，應承佢。", "Di que sí a la próxima pequeña invitación.", "Digues que sí a la propera petita invitació."],
        ["The email you dread is shorter than you think.", "你怕的那封邮件，其实比你想的短。", "", "你驚嗰封 email，其實冇你諗咁長。", "Ese correo que temes es más corto de lo que crees.", "Aquell correu que tems és més curt del que creus."],
        ["Someone is proud of you and hasn't said it yet.", "有人在为你骄傲，只是还没说出口。", "", "有人為你驕傲，只係仲未講出口。", "Alguien está orgulloso de ti y aún no te lo ha dicho.", "Algú està orgullós de tu i encara no t'ho ha dit."],
        ["Buy the good bread this week.", "这周买好一点的面包。", "", "今個禮拜買好啲嘅麵包。", "Esta semana compra el pan bueno.", "Aquesta setmana compra el pa bo."],
        ["A cat will choose you. Accept it.", "会有一只猫选中你。接受吧。", "", "會有隻貓揀中你。接受佢啦。", "Un gato te elegirá. Acéptalo.", "Un gat t'escollirà. Accepta-ho."],
        ["Your next good idea arrives in the shower.", "你的下一个好点子，会在洗澡时出现。", "", "你下一個好主意，會喺沖涼嗰陣出現。", "Tu próxima buena idea llegará en la ducha.", "La teva propera bona idea arribarà a la dutxa."],
        ["Leave ten minutes early. Something nice is on the way.", "早出门十分钟，路上有好事。", "", "早十分鐘出門，路上有好嘢等你。", "Sal diez minutos antes. Hay algo bonito por el camino.", "Surt deu minuts abans. Hi ha alguna cosa bonica pel camí."],
        ["Call the friend you were just thinking about.", "给你刚刚想到的那个朋友打个电话。", "", "打個電話俾你啱啱諗起嗰個朋友。", "Llama al amigo en el que acabas de pensar.", "Truca a l'amic en qui acabes de pensar."],
        ["Rest is also progress.", "休息也是一种进步。", "", "抖吓都係一種進步。", "Descansar también es avanzar.", "Descansar també és avançar."],
        ["Order the dessert.", "点那份甜点吧。", "", "叫埋個甜品啦。", "Pide el postre.", "Demana les postres."]
      ]),
      fortuneIntro: lx(["\"*flips a coaster* It says:\"", "\"*翻开杯垫* 上面写着：\"", "", "\"*反轉杯墊* 上面寫住：\"", "\"*gira un posavasos* Dice:\"", "\"*gira un sotagot* Diu:\""]),

      gossip: {
        cocktail: lx(["\"{who} invented “{text}” in the lab. Brave. I'd try it.\"", "\"{who}在调酒台发明了“{text}”。胆子挺大，我会试试。\"", "", "\"{who}喺調酒枱發明咗「{text}」。好大膽，我會試吓。\"", "\"{who} inventó «{text}» en el laboratorio. Valiente. Lo probaría.\"", "\"{who} ha inventat «{text}» al laboratori. Valent. El tastaria.\""]),
        none: lx(["\"Quiet night. Leave something on the wall and you'll be the gossip.\"", "\"今晚挺安静。去墙上留点什么，你就是新闻。\"", "", "\"今晚好靜。去牆度留低啲嘢，你就係新聞。\"", "\"Noche tranquila. Deja algo en la pared y serás tú el cotilleo.\"", "\"Nit tranquil·la. Deixa alguna cosa a la paret i el xafardeig seràs tu.\""])
      },

      // Lab challenges. check(profile) → bool
      challenges: [
        { id: 'sour', check: p => p.sour >= 12 && p.sweet >= 7 && p.abv >= 10 && p.abv <= 26,
          ask: lx(["Make me a balanced sour: tart, a little sweet, not too strong.", "给我调一杯平衡的酸酒：酸、微甜、别太烈。", "", "整杯平衡嘅酸酒俾我：酸、少少甜、唔好太烈。", "Hazme un sour equilibrado: ácido, algo dulce, no muy fuerte.", "Fes-me un sour equilibrat: àcid, una mica dolç, no gaire fort."]) },
        { id: 'baijiu', check: p => p.has.includes('baijiu') && p.score >= 55,
          ask: lx(["Use baijiu and make it actually drinkable. Good luck.", "用白酒，还要好喝。祝你好运。", "", "用白酒，仲要好飲。祝你好運。", "Usa baijiu y que se pueda beber. Suerte.", "Fes servir baijiu i que es pugui beure. Sort."]) },
        { id: 'low', check: p => p.abv > 0 && p.abv <= 8 && p.score >= 55,
          ask: lx(["Something low-proof for a school night (under 8%).", "来杯低度的，明天还要上班（8%以下）。", "", "嚟杯低酒精嘅，聽日仲要返工（8%以下）。", "Algo suave para un día entre semana (menos del 8%).", "Alguna cosa suau per a un dia feiner (menys del 8%)."]) },
        { id: 'bitter', check: p => p.bitter >= 14 && p.score >= 55,
          ask: lx(["I want bitter. Properly bitter. Like a Monday.", "我要苦的。真正的苦。像周一那样。", "", "我要苦嘅，真係苦嗰種，好似星期一咁。", "Quiero amargo. Amargo de verdad. Como un lunes.", "Vull amarg. Amarg de debò. Com un dilluns."]) },
        { id: 'zero', check: p => p.abv === 0 && p.volume >= 90 && p.score >= 55,
          ask: lx(["A zero-proof drink that doesn't feel like juice.", "一杯无酒精、但不像果汁的饮料。", "", "一杯冇酒精、但又唔似果汁嘅嘢。", "Una bebida sin alcohol que no parezca un zumo.", "Una beguda sense alcohol que no sembli un suc."]) },
        { id: 'coffee', check: p => p.has.some(h => ['espresso', 'coldbrew', 'coffee_liq'].includes(h)) && p.abv > 0 && p.score >= 55,
          ask: lx(["Coffee and booze, one glass, no regrets.", "咖啡加酒，一个杯子，不后悔。", "", "咖啡加酒，一隻杯，唔後悔。", "Café y alcohol, un solo vaso, sin arrepentimientos.", "Cafè i alcohol, un sol got, sense penediments."]) }
      ],
      // today's challenge: a real holiday first, then the day of the week (the visitor's own calendar)
      fizz: { id: 'fizz', check: p => p.has.some(h => ['soda', 'tonic', 'ginger_beer'].includes(h)) && p.abv > 0 && p.score >= 55,
        ask: lx(["Something with bubbles to start the weekend.", "来杯带气泡的，迎接周末。", "來杯帶氣泡的，迎接週末。", "嚟杯有氣嘅，迎接週末。", "Algo con burbujas para empezar el fin de semana.", "Alguna cosa amb bombolles per començar el cap de setmana."]) },
      week: ['zero', 'bitter', 'coffee', 'sour', 'low', 'fizz', 'baijiu'],   // Sunday … Saturday
      dayName: [
        lx(["Sunday", "周日", "週日", "星期日", "Domingo", "Diumenge"]), lx(["Monday", "周一", "週一", "星期一", "Lunes", "Dilluns"]), lx(["Tuesday", "周二", "週二", "星期二", "Martes", "Dimarts"]),
        lx(["Wednesday", "周三", "週三", "星期三", "Miércoles", "Dimecres"]), lx(["Thursday", "周四", "週四", "星期四", "Jueves", "Dijous"]), lx(["Friday", "周五", "週五", "星期五", "Viernes", "Divendres"]), lx(["Saturday", "周六", "週六", "星期六", "Sábado", "Dissabte"])
      ],
      todayIs: lx(["*taps the chalkboard* {d}'s challenge:", "*敲敲小黑板* {d}的挑战：", "*敲敲小黑板* {d}的挑戰：", "*敲敲黑板* {d}嘅挑戰：", "*golpea la pizarra* El reto del {d}:", "*pica la pissarra* El repte de {d}:"]),
      // fixed dates (MM-DD) and the lunar ones for the next years
      holidays: [
        { on: ['01-01'], id: 'h_newyear', check: p => p.abv === 0 && p.volume >= 90 && p.score >= 55,
          ask: lx(["First day of the year. Go gentle: zero proof, full flavour.", "新年第一天。温柔一点：无酒精，但要有滋味。", "新年第一天。溫柔一點：無酒精，但要有滋味。", "新年第一日，溫柔啲：冇酒精，但要有味道。", "Primer día del año. Con calma: sin alcohol, con sabor.", "Primer dia de l'any. Amb calma: sense alcohol, amb gust."]) },
        { on: ['2026-02-17', '2027-02-06', '2028-01-26'], id: 'h_spring', check: p => p.has.includes('hawthorn') && p.score >= 55,
          ask: lx(["Spring Festival! Something red for luck. Hawthorn, please.", "过年啦！来点红色的讨个好彩头。用山楂。", "過年啦！來點紅色的討個好彩頭。用山楂。", "過年喇！嚟啲紅色嘅好意頭。用山楂。", "¡Año Nuevo chino! Algo rojo para la suerte. Con espino.", "Any Nou xinès! Alguna cosa vermella per a la sort. Amb arç."]) },
        { on: ['04-23'], id: 'h_jordi', check: p => p.has.some(h => ['hawthorn', 'peychauds', 'campari'].includes(h)) && p.score >= 55,
          ask: lx(["Sant Jordi: a rose for the one you love. Make it rosy red.", "圣乔治节：送一朵玫瑰给你爱的人。调一杯玫瑰红的。", "聖喬治節：送一朵玫瑰給你愛的人。調一杯玫瑰紅的。", "聖佐治節：送朵玫瑰俾你愛嘅人。整杯玫瑰紅嘅。", "Sant Jordi: una rosa para quien quieres. Que sea rojo rosa.", "Sant Jordi: una rosa per a qui estimes. Que sigui vermell rosa."]) },
        { on: ['2026-06-19', '2027-06-09', '2028-05-28'], id: 'h_boat', check: p => p.has.some(h => ['lime', 'chartreuse', 'jasmine_tea'].includes(h)) && p.score >= 55,
          ask: lx(["Dragon Boat day. Something green and fresh, like the reeds.", "端午节。来杯绿色清爽的，像粽叶一样。", "端午節。來杯綠色清爽的，像粽葉一樣。", "端午節。嚟杯綠色清爽嘅，好似粽葉咁。", "Fiesta del Bote del Dragón. Algo verde y fresco, como los juncos.", "Festa del Vaixell del Drac. Alguna cosa verda i fresca, com els joncs."]) },
        { on: ['06-23'], id: 'h_joan', check: p => p.has.some(h => ['soda', 'tonic', 'ginger_beer'].includes(h)) && p.score >= 55,
          ask: lx(["Sant Joan: bonfires and fireworks. Give me sparks in a glass.", "圣胡安之夜：篝火和烟花。给我一杯冒火花的。", "聖胡安之夜：篝火和煙火。給我一杯冒火花的。", "聖胡安之夜：篝火同煙花。俾杯冒火花嘅我。", "Sant Joan: hogueras y petardos. Dame chispas en un vaso.", "Sant Joan: fogueres i petards. Dona'm guspires en un got."]) },
        { on: ['2026-09-25', '2027-09-15', '2028-10-03'], id: 'h_moon', check: p => p.has.some(h => ['osmanthus_liq', 'osmanthus_syr'].includes(h)) && p.score >= 55,
          ask: lx(["Mid-Autumn. The moon's full; make it smell of osmanthus.", "中秋了。月亮圆了，来杯桂花香的。", "中秋了。月亮圓了，來杯桂花香的。", "中秋喇。月光光，整杯桂花香嘅。", "Medio Otoño. Luna llena: que huela a osmanto.", "Mig Tardor. Lluna plena: que faci olor d'osmant."]) },
        { on: ['10-31'], id: 'h_dark', check: p => p.has.some(h => ['coffee_liq', 'espresso', 'coldbrew', 'demerara'].includes(h)) && p.score >= 55,
          ask: lx(["Halloween. Something dark enough to hide in.", "万圣夜。来杯黑得能藏进去的。", "萬聖夜。來杯黑得能藏進去的。", "萬聖節。整杯黑到可以匿埋嘅。", "Halloween. Algo tan oscuro que te puedas esconder.", "Halloween. Alguna cosa tan fosca que t'hi puguis amagar."]) },
        { on: ['12-24', '12-25'], id: 'h_xmas', check: p => p.has.some(h => ['honey_ginger', 'demerara'].includes(h)) && p.score >= 55,
          ask: lx(["Christmas. Warm and spiced, something to hold with both hands.", "圣诞节。温暖带点香料，能用双手捧着的那种。", "聖誕節。溫暖帶點香料，能用雙手捧著的那種。", "聖誕節。暖暖哋帶啲香料，可以用雙手捧住嗰種。", "Navidad. Algo cálido y especiado, para sujetar con las dos manos.", "Nadal. Alguna cosa càlida i especiada, per agafar amb les dues mans."]) },
        { on: ['12-31'], id: 'h_nye', check: p => p.has.some(h => ['soda', 'tonic', 'ginger_beer'].includes(h)) && p.abv > 0 && p.score >= 55,
          ask: lx(["Last night of the year. Bubbles. Who are you toasting?", "一年的最后一晚。要气泡。你想敬谁？", "一年的最後一晚。要氣泡。你想敬誰？", "一年最後一晚。要有氣。你想敬邊個？", "Última noche del año. Burbujas. ¿Por quién brindas?", "Última nit de l'any. Bombolles. Per qui brindes?"]) }
      ],
      today() {
        const d = new Date(), md = String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), ymd = d.getFullYear() + '-' + md;
        const h = this.holidays.find(x => x.on.includes(md) || x.on.includes(ymd));
        if (h) return { ch: h, intro: null };
        const id = this.week[d.getDay()], ch = id === 'fizz' ? this.fizz : this.challenges.find(c => c.id === id);
        return { ch, intro: L(this.todayIs).replace('{d}', L(this.dayName[d.getDay()])) };
      },
      challengeDone: lx(["\"You actually did it. I'm writing this one down.\"", "\"你还真做到了。我记下来了。\"", "", "\"你真係整到喎。我要記低。\"", "\"Lo has conseguido. Esto me lo apunto.\"", "\"Ho has aconseguit. Això m'ho apunto.\""]),
      challengeGiven: lx(["\"Deal. The Lab's behind the counter. Next time I nod off, it's yours.\"", "\"一言为定。调酒台就在吧台后面。下次我打瞌睡，它就归你了。\"", "", "\"一言為定。調酒枱就喺吧枱後面。下次我瞌眼瞓，就係你嘅。\"", "\"Trato hecho. El laboratorio está detrás de la barra. La próxima vez que me duerma, es tuyo.\"", "\"Tracte fet. El laboratori és darrere la barra. La propera vegada que m'adormi, és teu.\""]),

      cheers: lxa([
        ["To small rooms and long nights.", "敬小小的房间和长长的夜。", "", "敬細細間房同長長嘅夜。", "Por los cuartos pequeños y las noches largas.", "Pels racons petits i les nits llargues."],
        ["To the cats, who run this place.", "敬两只猫，这店其实是它们的。", "", "敬兩隻貓，間舖其實係佢哋嘅。", "Por los gatos, que son los que mandan.", "Pels gats, que són els que manen."],
        ["To {name}. Come back soon.", "敬{name}。常来。", "", "敬{name}。得閒再嚟。", "Por {name}. Vuelve pronto.", "Per {name}. Torna aviat."],
        ["To good ice and honest conversations.", "敬好冰，敬真心话。", "", "敬好冰，敬真心說話。", "Por el buen hielo y las conversaciones sinceras.", "Pel bon gel i les converses sinceres."]
      ]),

      // Wei notices what you made in the Lab
      afterLab: lx(["I saw you in the lab. “{text}”? Bold name.", "我看见你在调酒台了。“{text}”？名字挺大胆。", "", "我見到你喺調酒枱。「{text}」？個名好大膽。", "Te vi en el laboratorio. ¿«{text}»? Nombre valiente.", "T'he vist al laboratori. «{text}»? Nom valent."]),

      // Lab verdicts
      verdict: {
        tiny: lx(["That's a sip, not a drink. Pour a bit more.", "这是一口，不是一杯。再倒点。", "", "呢個係一啖，唔係一杯。倒多啲。", "Eso es un sorbo, no una copa. Sirve un poco más.", "Això és un glop, no una copa. Serveix-ne una mica més."]),
        tooStrong: lx(["Wow. That's mostly courage. Add something sour or long.", "哇，这杯主要成分是勇气。加点酸的或者补点汽水。", "", "嘩，呢杯主要成份係膽量。加啲酸或者加梳打。", "Uf. Eso es casi todo valentía. Añade algo ácido o alárgalo.", "Uf. Això és quasi tot valentia. Afegeix-hi alguna cosa àcida o allarga-ho."]),
        watery: lx(["It's shy. A little more spirit, or less top-up.", "这杯有点害羞。多点基酒，或者少点汽水。", "", "呢杯有啲怕醜。加多啲基酒，或者少啲梳打。", "Es tímido. Un poco más de destilado o menos relleno.", "És tímid. Una mica més de destil·lat o menys farcit."]),
        tooSweet: lx(["Like candy floss at a temple fair. Some citrus would rescue it.", "像庙会的棉花糖。来点柑橘能救回来。", "", "好似年宵嘅棉花糖。加啲檸檬救返佢。", "Como algodón de azúcar de feria. Un cítrico lo salvaría.", "Com cotó de sucre de fira. Un cítric ho salvaria."]),
        tooSour: lx(["My face just folded in half. Needs a touch of sweet.", "我的脸都皱成一团了。需要一点甜。", "", "我塊面縮埋一嚿。要少少甜。", "Se me ha doblado la cara. Le falta un toque dulce.", "Se m'ha doblegat la cara. Li falta un toc dolç."]),
        tooBitter: lx(["Bitter like a Monday morning. Some sweetness for balance?", "苦得像周一早上。加点甜平衡一下？", "", "苦到好似星期一朝早。加啲甜平衡吓？", "Amargo como un lunes por la mañana. ¿Algo dulce para equilibrar?", "Amarg com un dilluns al matí. Una mica de dolç per equilibrar?"]),
        flat: lx(["It's… fine. Nothing argues with anything. Try a bitter or citrus accent.", "嗯……还行。没有什么冲突，也没什么亮点。加点苦精或柑橘。", "", "嗯……都OK。乜都唔嗌交，但都冇乜亮點。加啲苦精或者柑橘。", "Está… bien. Nada choca con nada. Prueba un toque amargo o cítrico.", "Està… bé. Res no xoca amb res. Prova un toc amarg o cítric."]),
        balanced: lx(["Balanced. Sweet and sour shaking hands. I'd serve this.", "平衡。酸和甜握了手。我会拿出去卖。", "", "好平衡，酸同甜握咗手。我會攞出去賣。", "Equilibrado. El dulce y el ácido se dan la mano. Lo serviría.", "Equilibrat. El dolç i l'àcid es donen la mà. El serviria."]),
        great: lx(["*long pause* ...Can I put this on the menu?", "*沉默良久* ……这杯能上我的菜单吗？", "", "*停咗好耐* ……可唔可以放上我個餐牌？", "*pausa larga* ...¿Puedo ponerlo en la carta?", "*pausa llarga* ...El puc posar a la carta?"]),
        mocktail: lx(["Zero proof, full personality. Respect.", "零酒精，满分个性。佩服。", "", "零酒精，滿分性格。佩服。", "Cero alcohol, toda la personalidad. Respeto.", "Zero alcohol, tota la personalitat. Respecte."]),
        baijiu: lx(["Baijiu?! Very Beijing. Very brave.", "白酒？！很北京，很勇。", "", "白酒？！好北京，好勇。", "¿Baijiu? Muy de Pekín. Muy valiente.", "Baijiu? Molt de Pequín. Molt valent."]),
        coffee: lx(["Coffee in a cocktail — the night shift's favorite food group.", "咖啡入酒——夜班人最爱的食物类别。", "", "咖啡溝酒——通頂一族最鍾意嘅食物類別。", "Café en un cóctel: el grupo alimenticio del turno de noche.", "Cafè en un còctel: el grup alimentari del torn de nit."]),
        classic: lx(["Hey — that's basically a {text}. Classic hands.", "嘿——这基本就是一杯{text}。有老派手艺。", "", "喂——呢杯基本上就係{text}。有老師傅手勢。", "Oye, esto es básicamente un {text}. Manos de clásico.", "Ei, això és bàsicament un {text}. Mans de clàssic."])
      },


      catNames: { miso: lx(["Miso", "味噌", "味噌", "味噌", "Miso", "Miso"]), yuzu: lx(["Yuzu", "柚子", "柚子", "柚子", "Yuzu", "Yuzu"]) },

    };
  
