    /* ===== WEI'S PERSONALITY: LINES, BOND LEVELS, GIFTS ===== */
    const WeiText = {
      ui: {
        gift:      { en: "🎁 Gift", zh: "🎁 送礼", es: "🎁 Regalo" },
        back:      { en: "← Back", zh: "← 返回", es: "← Volver" },
        another:   { en: "🎲 Another riddle", zh: "🎲 再来一题", es: "🎲 Otra adivinanza" },
        serveAnyway: { en: "Pour it anyway", zh: "那就来一杯吧", es: "Sírvelo igual" },
        tellWei:   { en: "TELL WEI:", zh: "告诉 Wei：", es: "DILE A WEI:" },
        love:      { en: "😍 Perfect", zh: "😍 完美", es: "😍 Perfecto" },
        meh:       { en: "🤔 Interesting…", zh: "🤔 挺特别…", es: "🤔 Interesante…" },
        strong:    { en: "🥵 Too strong!", zh: "🥵 太烈了！", es: "🥵 ¡Muy fuerte!" },
        tapSkip:   { en: "▸ tap to skip", zh: "▸ 点击跳过", es: "▸ toca para saltar" },
        laugh:     { en: "😂 Ha!", zh: "😂 哈！", es: "😂 ¡Ja!" },
        groan:     { en: "🙄 Groan", zh: "🙄 好冷", es: "🙄 Buf" },
      },

      greet: {
        first: [
          { en: "First time? Sit anywhere. Except there — that's Yuzu's stool.", zh: "第一次来？随便坐。除了那张——那是柚子的专座。", es: "¿Primera vez? Siéntate donde quieras. Menos ahí: es el taburete de Yuzu." }
        ],
        back: [
          { en: "Back again! Miso saved your stool.", zh: "又来啦！味噌帮你占着座呢。", es: "¡Otra vez por aquí! Miso te guardó el taburete." },
          { en: "Oh, it's you. Good. The music's better when you're here.", zh: "哦，是你。挺好，你在的时候音乐都好听些。", es: "Ah, eres tú. Bien. La música suena mejor contigo aquí." },
          { en: "Welcome back. Wipe your feet, Yuzu just cleaned.", zh: "欢迎回来。擦擦鞋，柚子刚打扫过。", es: "Bienvenido. Límpiate los pies, Yuzu acaba de limpiar." }
        ],
        friend: [
          { en: "There you are. I was starting to worry.", zh: "你可算来了。我都开始担心了。", es: "Ahí estás. Empezaba a preocuparme." },
          { en: "My favorite regular! Don't tell the others.", zh: "我最喜欢的熟客！别告诉别人。", es: "¡Mi habitual favorito! No se lo digas a los demás." }
        ]
      },

      chatIntro: [
        { en: "\"Ask away. I've got a towel, a glass to polish and all the time in the world.\"", zh: "\"问吧。我手里有块抹布、一只要擦的杯子，还有大把时间。\"", es: "\"Pregunta. Tengo un trapo, un vaso que pulir y todo el tiempo del mundo.\"" },
        { en: "\"Conversation is the best garnish. What do you want to know?\"", zh: "\"聊天才是最好的装饰物。想知道什么？\"", es: "\"La conversación es la mejor guarnición. ¿Qué quieres saber?\"" }
      ],

      chatTopics: [
        { id: "me", minLevel: 0, label: { en: "About you", zh: "聊聊你", es: "Sobre ti" }, lines: [
          { en: "\"Me? I studied fluid dynamics for three years. Now I apply it exclusively to milk foam and ice dilution. My professor would weep.\"", zh: "\"我？读了三年流体力学，现在只用它来研究奶泡和冰块稀释率。我导师知道了大概会哭。\"", es: "\"¿Yo? Estudié dinámica de fluidos tres años. Ahora solo la aplico a la espuma de leche y al hielo. Mi profesor lloraría.\"" },
          { en: "\"I work two shifts: coffee by day, cocktails by night. Sleep happens in the gaps, usually on this counter.\"", zh: "\"我上两个班：白天咖啡，晚上调酒。睡觉就塞在缝隙里，通常就在这张吧台上。\"", es: "\"Hago dos turnos: café de día, cócteles de noche. Duermo en los huecos, normalmente sobre esta barra.\"" },
          { en: "\"Favorite drink? Honestly, plain jasmine tea at 5 AM after closing. Don't tell the regulars.\"", zh: "\"最爱喝什么？说实话，是打烊后凌晨五点的一杯茉莉花茶。别告诉熟客们。\"", es: "\"¿Mi bebida favorita? Un té de jazmín simple a las 5 AM tras cerrar. No se lo digas a los habituales.\"" }
        ]},
        { id: "cats", minLevel: 0, label: { en: "The cats", zh: "两只猫", es: "Los gatos" }, lines: [
          { en: "\"Someone left a box at Popo's shop door: 'MISO / YUZU, preserving jars, fragile', with two kittens inside. I was ten. I named them after the label. They've run the place ever since.\"", zh: "\"有人在婆婆店门口放了一个箱子：‘MISO / YUZU，腌菜罐，易碎’，里面是两只小猫。那年我十岁，就照着标签给她们起了名。从那以后店就归她们管了。\"", es: "\"Alguien dejó una caja en la puerta de la tienda de Popo: «MISO / YUZU, tarros de conserva, frágil», con dos gatitas dentro. Yo tenía diez años y les puse los nombres de la etiqueta. Desde entonces mandan ellas.\"" },
          { en: "\"Yuzu is head of security. Her methods include sitting on the menu and judging you.\"", zh: "\"柚子是安保主管。她的工作方式包括坐在菜单上，然后用眼神审判你。\"", es: "\"Yuzu es la jefa de seguridad. Sus métodos: sentarse sobre la carta y juzgarte.\"" },
          { en: "\"Miso has knocked exactly one bottle off the shelf. The cheapest one. I suspect she has taste.\"", zh: "\"味噌这辈子只从架子上推下来过一瓶酒，偏偏是最便宜的那瓶。我怀疑她很有品味。\"", es: "\"Miso ha tirado exactamente una botella del estante. La más barata. Sospecho que tiene buen gusto.\"" }
        ]},
        { id: "glasses", minLevel: 0, label: { en: "Your glasses", zh: "你的眼镜", es: "Tus gafas" }, lines: [
          { en: "\"Flea market at Panjiayuan. Twenty yuan. They've survived steam wands, shakers and one very enthusiastic cat.\"", zh: "\"潘家园旧货市场淘的，二十块。扛过了蒸汽棒、雪克壶，还有一只热情过头的猫。\"", es: "\"Mercadillo de Panjiayuan. Veinte yuanes. Han sobrevivido al vapor, la coctelera y un gato muy entusiasta.\"" },
          { en: "\"Yes, they fog up every time I steam milk. No, I won't switch to contacts. The fog is part of the craft.\"", zh: "\"对，每次打奶泡镜片都会起雾。不，我不会换隐形眼镜。起雾也是手艺的一部分。\"", es: "\"Sí, se empañan cada vez que caliento leche. No, no usaré lentillas. El vaho es parte del oficio.\"" },
          { en: "\"Round lenses make anyone look trustworthy. Oldest bartender trick in the book.\"", zh: "\"圆框眼镜让人看起来特别可靠。这是调酒界最古老的小把戏。\"", es: "\"Las lentes redondas hacen que cualquiera parezca de fiar. El truco más viejo del oficio.\"" }
        ]},
        { id: "city", minLevel: 0, label: { en: "Beijing", zh: "北京", es: "Pekín" }, lines: [
          { en: "\"Beijing in October is the best version of itself. Blue sky, gingko gold, and the jianbing guy down the alley is in a great mood.\"", zh: "\"十月的北京是它最好的样子。蓝天、银杏黄，巷口摊煎饼的大爷心情也特别好。\"", es: "\"Pekín en octubre es su mejor versión. Cielo azul, ginkgos dorados y el del jianbing de la esquina de buen humor.\"" },
          { en: "\"My family's in Barcelona: Popo, my mum, half the old noodle shop's regulars. I still put orange peel in everything. It's a condition.\"", zh: "\"我家人都在巴塞罗那：婆婆、我妈，还有老面馆一半的熟客。现在我什么都想放点橙皮。这算是后遗症。\"", es: "\"Mi familia está en Barcelona: Popo, mi madre y medio barrio de clientes de la vieja tienda de fideos. Todavía le pongo piel de naranja a todo. Es una condición.\"" },
          { en: "\"Walk north at dawn and you'll hear the old men with their caged birds by the Drum Tower. Best free concert in town.\"", zh: "\"清晨往北走，鼓楼边上能听到遛鸟大爷们的鸟叫。城里最好的免费音乐会。\"", es: "\"Camina al norte al amanecer y oirás a los abuelos con sus pájaros junto a la Torre del Tambor. El mejor concierto gratis.\"" }
        ]},
        { id: "joke", minLevel: 0, label: { en: "Tell me a joke", zh: "讲个笑话", es: "Cuéntame un chiste" }, lines: [] },
        { id: "secret", minLevel: 2, label: { en: "Your secrets", zh: "你的小秘密", es: "Tus secretos" }, lines: [
          { en: "\"Since you're a regular: the 'hand-carved' ice? Miso supervises. She has rejected four blocks this month.\"", zh: "\"既然你是熟客：那些'手凿冰'？味噌负责监工。这个月她已经否决了四块。\"", es: "\"Como eres habitual: ¿el hielo tallado a mano? Miso supervisa. Ha rechazado cuatro bloques este mes.\"" },
          { en: "\"I almost didn't open this place. The night before signing the lease, Miso and Yuzu climbed into their old MISO / YUZU box and fell asleep in it. I took it as a sign.\"", zh: "\"我差点就没开这家店。签租约的前一晚，味噌和柚子钻进她们那个写着 MISO / YUZU 的旧箱子里睡着了。我把它当成了一个信号。\"", es: "\"Casi no abro este local. La noche antes de firmar, Miso y Yuzu se metieron en su vieja caja de MISO / YUZU y se durmieron dentro. Lo tomé como una señal.\"" },
          { en: "\"I write one line in a notebook for every regular. Yours says... no. Not yet.\"", zh: "\"每个熟客我都会在本子上写一句话。你的那句是……不行，还不能说。\"", es: "\"Escribo una línea en un cuaderno por cada habitual. La tuya dice... no. Todavía no.\"" }
        ]},
        { id: "offmenu", minLevel: 3, label: { en: "Something off-menu", zh: "来杯菜单上没有的", es: "Algo fuera de carta" }, lines: [] },
        { id: "notebook", minLevel: 4, label: { en: "What did you write about me?", zh: "你在本子上写了我什么？", es: "¿Qué escribiste sobre mí?" }, lines: [
          { en: "\"*opens the worn notebook* 'Came in from the cold. Stayed for the conversation. Tips the cats. Good human.' ...Don't make it weird.\"", zh: "\"*翻开那本旧笔记本* '从寒风里进来，为了聊天留下。会给猫加餐。是个好人。'……别搞得这么肉麻。\"", es: "\"*abre el cuaderno gastado* 'Entró huyendo del frío. Se quedó por la charla. Mima a los gatos. Buena persona.' ...No lo hagas raro.\"" }
        ]}
      ],

      sleepPokes: [
        { en: "*snore* ...five more minutes, Miso...", zh: "*呼噜* ……再睡五分钟，味噌……", es: "*ronquido* ...cinco minutos más, Miso..." },
        { en: "*mumbles* ...the ice is... sixty millimetres...", zh: "*嘟囔* ……冰块要……六十毫米……", es: "*murmura* ...el hielo... sesenta milímetros..." }
      ],
      grumpyWake: { en: "Gah! I'm up! I was just... resting my eyes. Professionally.", zh: "啊！醒了醒了！我只是……专业地闭目养神。", es: "¡Ah! ¡Despierto! Solo estaba... descansando la vista. Profesionalmente." },

      reactions: {
        love: [
          { en: "*small proud smile* That's the face I work for.", zh: "*骄傲地微微一笑* 我就是为了这个表情在干活。", es: "*sonrisa orgullosa* Esa cara es por la que trabajo." },
          { en: "Perfect, huh? Don't tell the cats. They'll want a raise.", zh: "完美？别告诉猫，她们会要求加薪的。", es: "¿Perfecto? No se lo digas a los gatos. Pedirán aumento." },
          { en: "Writing it down: 'has excellent taste.'", zh: "记下来了：'品味极佳'。", es: "Lo apunto: 'tiene un gusto excelente.'" }
        ],
        meh: [
          { en: "'Interesting.' The most dangerous word in hospitality. I'll tweak the ratio next time.", zh: "'挺特别'——服务业最危险的词。下次我调一下比例。", es: "'Interesante.' La palabra más peligrosa de la hostelería. Ajustaré la proporción." },
          { en: "Hm. Honest feedback. Science is iterative.", zh: "嗯，诚实的反馈。科学就是不断迭代。", es: "Hm. Opinión sincera. La ciencia es iterativa." }
        ],
        strong: [
          { en: "Too strong? *slides over water* Hydration is the true garnish.", zh: "太烈了？*推过来一杯水* 补水才是真正的装饰。", es: "¿Muy fuerte? *te acerca agua* La hidratación es la verdadera guarnición." },
          { en: "My hand slipped. Or my heart did. Here, have a cracker.", zh: "手滑了。也可能是心软了。来，吃块饼干。", es: "Se me fue la mano. O el corazón. Toma, una galleta." }
        ]
      },

      jokeRate: {
        laugh: { en: "Finally, an audience that appreciates me.", zh: "终于有懂我的观众了。", es: "Por fin, un público que me aprecia." },
        groan: { en: "The groan means it worked.", zh: "叹气说明这个笑话成功了。", es: "El quejido significa que funcionó." }
      },

      riddleIntro: [
        { en: "\"Riddle time. I'll name what's in it, you name the drink. Get it right and it's on the house:\"", zh: "\"猜谜时间。我说配料，你说酒名。猜对了这杯我请：\"", es: "\"Hora de adivinanzas. Yo digo lo que lleva, tú dices el trago. Si aciertas, invita la casa:\"" },
        { en: "\"Let's test your palate. What am I making with this?\"", zh: "\"考考你的味觉。我用这些在做什么？\"", es: "\"Probemos tu paladar. ¿Qué preparo con esto?\"" }
      ],
      riddleRight: [
        { en: "\"Correct! Somebody's been reading my menu. This one's on the house.\"", zh: "\"答对了！有人偷偷背过我的菜单。这杯我请。\"", es: "\"¡Correcto! Alguien ha leído mi carta. Esta invita la casa.\"" },
        { en: "\"Ha! Exactly right. Yuzu, ring the little bell.\"", zh: "\"哈！完全正确。柚子，摇一下小铃铛。\"", es: "\"¡Ja! Exacto. Yuzu, toca la campanita.\"" }
      ],
      riddleWrong: { en: "\"Close, but no. It was the {name}. Want one anyway?\"", zh: "\"差一点，不对。答案是{name}。要不要来一杯？\"", es: "\"Casi, pero no. Era el {name}. ¿Lo quieres igual?\"" },

      gifts: [
        { id: "vinyl",    icon: "💿", label: { en: "Vinyl", zh: "黑胶", es: "Vinilo" }, bond: 4, line: { en: "A first pressing?! Okay, this goes on right now. *swaps the record*", zh: "初版黑胶？！好，现在就放。*换上唱片*", es: "¿¡Una primera edición!? Esto suena ya mismo. *cambia el disco*" }, emote: "😍" },
        { id: "osmanthus",icon: "🌼", label: { en: "Osmanthus", zh: "桂花枝", es: "Osmanto" }, bond: 3, line: { en: "Osmanthus! It's going into tonight's syrup. Smell that.", zh: "桂花！今晚就熬进糖浆里。你闻闻。", es: "¡Osmanto! Va directo al almíbar de hoy. Huele eso." }, emote: "🥰" },
        { id: "beans",    icon: "🫘", label: { en: "Coffee beans", zh: "咖啡豆", es: "Café en grano" }, bond: 2, energy: 2, line: { en: "*sniffs deeply* ...I feel alive again. Energy restored.", zh: "*深吸一口* ……我又活过来了。精力恢复。", es: "*inspira hondo* ...Vuelvo a sentirme vivo. Energía recuperada." }, emote: "⚡" },
        { id: "treats",   icon: "🐟", label: { en: "Cat treats", zh: "猫零食", es: "Premios gatunos" }, bond: 2, cats: true, line: { en: "For the bosses? Miso and Yuzu thank you. I'm just staff here.", zh: "给老板们的？味噌和柚子谢谢你。我只是个打工的。", es: "¿Para las jefas? Miso y Yuzu te lo agradecen. Yo solo soy personal." }, emote: "😹" },
        { id: "mandarin", icon: "🍊", label: { en: "Mandarin", zh: "砂糖橘", es: "Mandarina" }, bond: 2, line: { en: "Watch: I'll peel it in one perfect spiral. ...Nailed it.", zh: "看好了：我一圈剥到底。……完美。", es: "Mira: la pelo en una espiral perfecta. ...Hecho." }, emote: "😎" },
        { id: "mooncake", icon: "🥮", label: { en: "Mooncake", zh: "月饼", es: "Pastel de luna" }, bond: 1, line: { en: "Ah... a mooncake. Mid-Autumn was weeks ago. I have eleven. ...Thank you. Sincerely.", zh: "啊……月饼。中秋都过去好几周了，我这儿还有十一个。……谢谢，真心的。", es: "Ah... un pastel de luna. El Medio Otoño fue hace semanas. Tengo once. ...Gracias. De verdad." }, emote: "😅" }
      ],
      giftIntro: { en: "\"A gift? For me? You didn't have to. ...What is it?\"", zh: "\"送我礼物？不用这么客气的……是什么呀？\"", es: "\"¿Un regalo? ¿Para mí? No hacía falta. ...¿Qué es?\"" },
      giftLimit: { en: "\"You've spoiled me enough tonight. Save some generosity for next time.\"", zh: "\"今天你已经够宠我了。留点心意下次吧。\"", es: "\"Ya me has mimado bastante hoy. Guarda algo de generosidad para la próxima.\"" },

      usual: { en: "The usual? Coming right up.", zh: "老样子？马上来。", es: "¿Lo de siempre? Marchando." },
      offmenu: { en: "\"*lowers voice* Okay. Just for you. Don't tell Yuzu.\"", zh: "\"*压低声音* 好吧。只给你做。别告诉柚子。\"", es: "\"*baja la voz* Vale. Solo para ti. No se lo digas a Yuzu.\"" }
    };

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    function setText(id, txt) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    }
  
