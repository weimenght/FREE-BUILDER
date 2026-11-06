    /* COMPREHENSIVE BAR DIALOGUE POOL (8 DIVERSE & WITTY SCENARIOS) */
    const BarTopicPool = [
      {
        id: "gulou_bells",
        mood: "nightOwl",
        text: {
          en: "\"The belltower bells over Gulou just struck midnight into the hutong alleyways. Did you escape the cold wind, or are you chasing night stories?\"",
          zh: "\"鼓楼的夜钟刚敲过子夜，钟声穿过了灰瓦胡同。你是来躲避北风的，还是来打捞今夜的故事？\"",
          es: "\"Las campanas de Gulou acaban de dar la medianoche entre los callejones hutong. ¿Huyes del viento o buscas historias?\""
        },
        options: [
          {
            label: { en: "A sharp Jasmine Tea gin to warm up.", zh: "来一杯带着北京茉莉花茶香的气泡金酒驱驱寒。", es: "Un gin con té de jazmín para entrar en calor." },
            deltaEnergy: -1, drink: "jasmine_gulou", nextMood: "empath"
          },
          {
            label: { en: "Tell me about the stray cats around the Drum Tower.", zh: "跟我讲讲鼓楼附近那几只常来串门的小野猫吧。", es: "Cuéntame de los gatos callejeros de la Torre del Tambor." },
            deltaEnergy: 0, drink: "catalan", nextMood: "sarcastic"
          },
          {
            label: { en: "Just need silence, clear ice, and a stool.", zh: "只要一块老冰、高脚椅和安安静静的五分钟。", es: "Solo necesito hielo puro, una banqueta y silencio." },
            deltaEnergy: -1, drink: "kyoto", nextMood: "poetic"
          }
        ]
      },
      {
        id: "gingko_autumn",
        mood: "poetic",
        text: {
          en: "\"The golden gingko leaves outside are sticking to the damp flagstones. If tonight had an aroma, is it toasted osmanthus or chilled juniper?\"",
          zh: "\"窗外红墙边的银杏叶落得厚厚的。如果今晚你的心境有种香气，是金桂花香还是冰镇杜松？\"",
          es: "\"Las hojas doradas de ginkgo cubren los adoquines húmedos. Si esta noche tuviera un aroma, ¿sería osmanto o enebro frío?\""
        },
        options: [
          {
            label: { en: "Toasted osmanthus and warm autumn spices.", zh: "烤金桂花香，带一点秋天的微甜与麦香。", es: "Osmanto tostado con suaves especias otoñales." },
            deltaEnergy: 0, drink: "jasmine_gulou", nextMood: "empath"
          },
          {
            label: { en: "Give me something rebellious with a smokey bite.", zh: "给我来杯烟熏烈性、能击碎疲惫的特调。", es: "Dame algo rebelde con un toque ahumado." },
            deltaEnergy: -1, drink: "oldfashioned", nextMood: "sarcastic"
          },
          {
            label: { en: "Pour whatever matches this melancholic drizzle.", zh: "随意倒一杯能配上窗外细雨的微苦小酒。", es: "Sirve lo que mejor combine con esta llovizna melancólica." },
            deltaEnergy: -1, drink: "negroni", nextMood: "poetic"
          }
        ]
      },
      {
        id: "line2_last_train",
        mood: "sarcastic",
        text: {
          en: "\"Line 2 subway just sent out its last train announcement. If you're still on this side of the door, either your shift was brutal or your soul refused to go home.\"",
          zh: "\"地铁二号线的末班车刚刚驶过护城河。既然你还留在吧台这头，要么是今天方案改了八遍，要么是灵魂拒绝回家。\"",
          es: "\"El último tren de la Línea 2 acaba de pasar. Si sigues en mi barra, o tu jornada fue brutal o tu alma se negó a ir a casa.\""
        },
        options: [
          {
            label: { en: "My spreadsheet crashed at 21:59. Mercy please.", zh: "晚上九点五十九分表格崩溃了，需要精神急救。", es: "Mi hoja de cálculo se colgó a las 21:59. Piedad." },
            deltaEnergy: -1, drink: "negroni", nextMood: "empath"
          },
          {
            label: { en: "Your round glasses look extra studious tonight, Wei.", zh: "Wei，你这副复古圆框眼镜今晚看起来格外睿智。", es: "Tus gafas redondas se ven muy sabias esta noche, Wei." },
            deltaEnergy: 0, drink: "paperplane", nextMood: "nightOwl", bond: 1
          },
          {
            label: { en: "I missed the subway on purpose. Hit me with high proof.", zh: "我是故意错过末班车的，给我来点够劲的。", es: "Perdí el metro a propósito. Sorpréndeme con alta graduación." },
            deltaEnergy: -1, drink: "smoked_rosemary", nextMood: "sarcastic"
          }
        ]
      },
      {
        id: "barcelona_gothic",
        mood: "empath",
        text: {
          en: "\"A bottle of sweet herbal vermut just reminded me of the Gothic Quarter in Barcelona at 1:00 AM—stone arches, sea breeze, and acoustic guitars. Ever get nostalgic for a city you haven't seen in years?\"",
          zh: "\"这瓶甜草本苦艾酒让我突然想起了巴塞罗那哥特区的深夜一点钟——石砌拱券、地中海的海风与吉他声。你也会怀念遥远异国的某条街巷吗？\"",
          es: "\"El aroma de este vermut artesanal me recordó al Barrio Gótico de Barcelona a la una de la madrugada: arcos de piedra y guitarras. ¿Sientes nostalgia de algún rincón lejano?\""
        },
        options: [
          {
            label: { en: "Pour me a house vermut on the rock with an olive.", zh: "给我来杯老冰加橄榄与橙皮的加泰罗尼亚家常苦艾酒。", es: "Sírveme un vermut de la casa con hielo, naranja y oliva." },
            deltaEnergy: 0, drink: "catalan_vermut", nextMood: "poetic"
          },
          {
            label: { en: "Pair that Catalan nostalgia with Mediterranean gin.", zh: "把这份加泰罗尼亚的乡愁调进地中海玫瑰金酒里。", es: "Combina esa nostalgia con gin mediterráneo y rosas." },
            deltaEnergy: -1, drink: "catalan", nextMood: "empath"
          },
          {
            label: { en: "My only nostalgia tonight is for undisturbed sleep.", zh: "我现在唯独怀念一觉睡到大天亮的安稳觉。", es: "Mi única nostalgia esta noche es dormir sin alarmas." },
            deltaEnergy: -1, drink: "kyoto", nextMood: "nightOwl"
          }
        ]
      },
      {
        id: "ice_carving",
        mood: "poetic",
        text: {
          en: "\"Notice this ice spear? Hand-carved from a 72-hour directional freeze block. Absolutely zero micro-bubbles. Regular cloudy ice melts fast and ruins the drink, like rushed conversations ruin relationships.\"",
          zh: "\"瞧瞧这根手工手凿的长冰柱。72小时定向结晶，里面连一颗气泡都没有。浑浊的快融冰会稀释酒体，就像草率浮躁的谈话会毁掉一段关系。\"",
          es: "\"¿Ves este prisma de hielo puro? Tallado a mano de un bloque de congelación lenta sin burbujas. El hielo turbio arruina el trago como las prisas arruinan las conversaciones.\""
        },
        options: [
          {
            label: { en: "That is surprisingly deep, Wei. Test it with your best cocktail.", zh: "这哲理挺有深度啊 Wei。用你最好的招牌酒来检验这块冰吧。", es: "Profundo, Wei. Pon a prueba ese hielo con tu mejor trago." },
            deltaEnergy: -1, drink: "kyoto", nextMood: "poetic", bond: 1
          },
          {
            label: { en: "Did you just compare ice cubes to my dating life?", zh: "你刚刚是在拿冰块融化来隐喻我的恋爱经历吗？", es: "¿Acabas de comparar un cubo de hielo con mi vida amorosa?" },
            deltaEnergy: 0, drink: "paperplane", nextMood: "sarcastic"
          },
          {
            label: { en: "Chisel another block, let's toast to zero dilution.", zh: "再凿一块，为不被生活稀释的心境干一杯。", es: "Corta otro bloque; brindemos por cero dilución." },
            deltaEnergy: -1, drink: "oldfashioned", nextMood: "nightOwl"
          }
        ]
      },
      {
        id: "corporate_origami",
        mood: "sarcastic",
        text: {
          en: "\"A regular left behind a 40-page corporate synergy deck earlier. I folded half of it into paper planes and Yuzu batted them into the recycling bin. Want a cocktail that dissolves corporate jargon?\"",
          zh: "\"傍晚有个常客落下一份厚厚的‘业务赋能闭环战略方案’。我把前二十页折成了纸飞机，全被柚子一爪子拍进了废纸篓。来杯能洗涤职场黑话的鸡尾酒？\"",
          es: "\"Un cliente olvidó un informe corporativo de sinergias. Doblé la mitad en avioncitos de papel y Yuzu los cazó al vuelo. ¿Quieres un trago para olvidar la jerga de oficina?\""
        },
        options: [
          {
            label: { en: "A Paper Plane cocktail, shaken aggressively.", zh: "来一杯猛烈摇荡的夜间纸飞机特调，把PPT都甩掉。", es: "Un Paper Plane agitado con furia para olvidar los PowerPoints." },
            deltaEnergy: -1, drink: "paperplane", nextMood: "baristaJoy"
          },
          {
            label: { en: "Let Yuzu review my résumé next time.", zh: "下回我也带份简历，让柚子猫总监亲自爪批一下。", es: "La próxima vez traeré mi currículum para que Yuzu lo revise." },
            deltaEnergy: 0, drink: "catalan", nextMood: "sarcastic", bond: 1
          },
          {
            label: { en: "Just a classic Negroni. Equal parts bitter and real.", zh: "来杯经典内格罗尼吧。等比例的苦涩与真实。", es: "Solo un Negroni clásico: partes iguales de amargura y realidad." },
            deltaEnergy: -1, drink: "negroni", nextMood: "empath"
          }
        ]
      },
      {
        id: "vinyl_turntable",
        mood: "nightOwl",
        text: {
          en: "\"Hear that soft 33 RPM crackle under the stylus? That's an analog warmth no digital codec can fake. The needle vibrates, the tube warms up, and midnight suddenly feels three-dimensional.\"",
          zh: "\"听见黑胶唱针压在唱片上的轻微沙沙声了吗？这是任何数字算法都调不出来的模拟温度。电子管一热，整个胡同子夜都变得立体了。\"",
          es: "\"¿Oyes el suave chasquido del vinilo a 33 RPM? Es una calidez analógica irrepetible. La aguja vibra, las válvulas calientan y la noche cobra otra dimensión.\""
        },
        options: [
          {
            label: { en: "Pour an Islay highball with smoked rosemary.", zh: "给我来杯浸透艾雷岛泥煤与烟熏迷迭香的嗨棒。", es: "Un highball con notas ahumadas y romero tostado." },
            deltaEnergy: -1, drink: "smoked_rosemary", nextMood: "poetic"
          },
          {
            label: { en: "Spin something Bossa next when morning comes.", zh: "等破晓天亮，记得换上一张明亮的巴萨诺瓦唱片。", es: "Cuando amanezca, pon un disco alegre de Bossa Nova." },
            deltaEnergy: 0, drink: "jasmine_gulou", nextMood: "baristaJoy"
          },
          {
            label: { en: "Turn the volume up a hair, Wei. It's safe here.", zh: "Wei，把音量拧大半格吧。在这间小酒馆里很安全。", es: "Sube un punto el volumen, Wei. Aquí estamos a salvo del mundo." },
            deltaEnergy: 0, drink: "oldfashioned", nextMood: "empath", bond: 1
          }
        ]
      },
      {
        id: "midnight_confessions",
        mood: "empath",
        text: {
          en: "\"They say bartenders know more secrets than city confessors. Don't worry, Wei's mahogany counter is soundproofed by good gin and discretion. What's weighing on your mind?\"",
          zh: "\"人们常说调酒师听过的秘密比告解室还多。放轻松，这方老红木吧台自带着金酒的宽容与守口如瓶。今晚有什么心事想放下的？\"",
          es: "\"Dicen que los bartenders guardan más secretos que nadie. Tranquilo, esta barra de caoba es discreta y comprensiva. ¿Qué carga llevas en mente?\""
        },
        options: [
          {
            label: { en: "Just tired of being polite to people I don't respect.", zh: "只是讨厌在工作中不得不对不值得尊敬的人假笑。", es: "Cansado de ser cortés con personas que no respeto." },
            deltaEnergy: -1, drink: "oldfashioned", nextMood: "sarcastic"
          },
          {
            label: { en: "Nothing heavy. Just glad this warm light exists.", zh: "倒也没什么沉重的，只是庆幸胡同尽头还有这样一盏灯。", es: "Nada grave. Solo me alegra que este rincón cálido exista." },
            deltaEnergy: 0, drink: "jasmine_gulou", nextMood: "poetic", bond: 2
          },
          {
            label: { en: "I came to pet Miso and drink vermut, not introspect!", zh: "我是来摸小黑猫味噌和喝苦艾酒的，可不是来做心理剖析的！", es: "¡Vine a acariciar a Miso y beber vermut, no a psicoanalizarme!" },
            deltaEnergy: 0, drink: "catalan_vermut", nextMood: "baristaJoy"
          }
        ]
      },
      {
        id: "book_corner_lamp",
        mood: "nightOwl",
        text: {
          en: "\"See the lamp still on over the fence? That's the book corner next door. Some nights people walk in here with a paperback they just found over there and read it at the counter until closing. Best kind of regular.\"",
          zh: "\"看见篱笆那边还亮着的灯吗？那是隔壁的旧书角。有些晚上，客人刚从那边淘到一本书，就过来坐在吧台边一直读到打烊。最好的那种熟客。\"",
          es: "\"¿Ves la lámpara aún encendida al otro lado de la valla? Es el rincón de libros de al lado. Algunas noches la gente entra con un libro que acaba de encontrar allí y lo lee en la barra hasta el cierre. El mejor tipo de cliente.\""
        },
        options: [
          {
            label: { en: "Then pour me something slow enough for a chapter.", zh: "那给我来一杯够慢慢读完一章的酒。", es: "Entonces ponme algo que dure un capítulo." },
            deltaEnergy: -1, drink: "oldfashioned", nextMood: "poetic"
          },
          {
            label: { en: "I'll go find a book and come straight back.", zh: "我去那边挑本书，马上回来。", es: "Voy a buscar un libro y vuelvo enseguida." },
            deltaEnergy: 0, drink: "jasmine_gulou", nextMood: "empath"
          },
          {
            label: { en: "Do Miso and Yuzu have library cards?", zh: "味噌和柚子办借书证了吗？", es: "¿Miso y Yuzu tienen carné de biblioteca?" },
            deltaEnergy: 0, drink: "negroni", nextMood: "sarcastic", bond: 1
          }
        ]
      }
    ];
  
