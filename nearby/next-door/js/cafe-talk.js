    /* COMPREHENSIVE CAFE DIALOGUE POOL (8 DIVERSE & WITTY SCENARIOS) */
    const CafeTopicPool = [
      {
        id: "gesha_morning",
        mood: "baristaJoy",
        text: {
          en: "\"Good morning! The sun is spilling through the courtyard trellis. I just dialed in an anaerobic natural Gesha with notes of white peach and bergamot. Pour you a cup?\"",
          zh: "\"早晨好！晨光正好透过四合院的葡萄架。我刚校准完一款厌氧日晒瑰夏，有着白桃与佛手柑的明亮花果香。给你手冲一杯？\"",
          es: "\"¡Buenos días! El sol entra por el patio del hutong. Acabo de calibrar un Gesha natural con notas de melocotón blanco y bergamota. ¿Te sirvo una taza?\""
        },
        options: [
          {
            label: { en: "Yes please! Light extraction, bring out the flowers.", zh: "太好了！轻度萃取，多保留些花香与果酸。", es: "¡Sí, por favor! Extracción ligera para resaltar las flores." },
            deltaEnergy: 1, drink: "gesha_pourover", nextMood: "baristaJoy", bond: 1
          },
          {
            label: { en: "I need dense caffeine: make it an Oat Milk Dirty.", zh: "我需要重度清醒：来一杯浓厚冰博克燕麦Dirty。", es: "Necesito cafeína pura: prepárame un Dirty con avena." },
            deltaEnergy: 0, drink: "dirty_espresso", nextMood: "poetic"
          },
          {
            label: { en: "Pair it with one of your freshly baked croissants.", zh: "再配上一只刚出炉、黄油酥脆的可颂可好？", es: "Acompáñalo con uno de tus croissants recién horneados." },
            deltaEnergy: 1, drink: "croissant_combo", nextMood: "empath"
          }
        ]
      },
      {
        id: "courtyard_sparrows",
        mood: "poetic",
        text: {
          en: "\"Listen to the sparrows chirping on the grey roof tiles. Hutong mornings are the only time the city truly inhales. What speed do you want your morning to take?\"",
          zh: "\"听听灰瓦屋檐上麻雀的清脆叫声。北京胡同的清晨是这座城市唯一定下心来呼吸的时刻。今天想以怎样的节奏开启？\"",
          es: "\"Escucha a los gorriones en las tejas grises. Las mañanas en el hutong son el único momento en que la ciudad respira en paz. ¿A qué ritmo quieres empezar?\""
        },
        options: [
          {
            label: { en: "Slow and contemplative: Cold brew tonic with citrus.", zh: "慢节奏：来一杯冰爽提神的冷萃汤力配鲜橙皮。", es: "Lento y contemplativo: Cold brew con tónica y cítricos." },
            deltaEnergy: 0, drink: "coldbrew_tonic", nextMood: "poetic"
          },
          {
            label: { en: "Fast and fiery: Double Yunnan espresso straight up.", zh: "极速唤醒：双份云南水洗浓缩，一饮而尽。", es: "Rápido e intenso: Doble espresso de Yunnan directo." },
            deltaEnergy: 1, drink: "dirty_espresso", nextMood: "baristaJoy"
          },
          {
            label: { en: "Wei, did Miso and Yuzu steal coffee beans again?", zh: "Wei，味噌和柚子刚才是不是又想扒拉咖啡生豆麻袋？", es: "Wei, ¿Miso y Yuzu volvieron a jugar con los sacos de café?" },
            deltaEnergy: 0, drink: "einspanner", nextMood: "baristaJoy", bond: 1
          }
        ]
      },
      {
        id: "ek43_hyperfixation",
        mood: "sarcastic",
        text: {
          en: "\"I spent two hours before dawn aligning the titanium burrs on my grinder down to 15 microns. My friends say I need therapy; I say their extraction yield is sub-optimal. Who is right?\"",
          zh: "\"凌晨五点我花了整整两小时校准这台磨豆机的钛金刀盘间隙，精确到15微米。朋友说我需要看心理医生；我说他们的萃取率不及格。你评评理？\"",
          es: "\"Pasé dos horas alineando las muelas de titanio del molino a 15 micras exactas. Mis amigos dicen que necesito terapia; yo digo que su café está sub-extraído. ¿Quién tiene razón?\""
        },
        options: [
          {
            label: { en: "You are absolutely right. Give me a Baoshan honey pour-over.", zh: "你绝对是对的！给我来杯高萃取率的云南保山日晒手冲。", es: "Tienes toda la razón. Sírveme un café de filtro de Baoshan." },
            deltaEnergy: 1, drink: "yunnan_honey_pour", nextMood: "baristaJoy", bond: 1
          },
          {
            label: { en: "Both things can be true, Wei. Drink some water.", zh: "这两件事并不冲突，Wei。你也该喝口温水了。", es: "Ambas cosas pueden ser ciertas, Wei. Bebe un vaso de agua." },
            deltaEnergy: 0, drink: "croissant_combo", nextMood: "empath", bond: 1
          },
          {
            label: { en: "Does all that math make the crema taste like caramel?", zh: "那么复杂的微米物理学，能让咖啡油脂尝起来像焦糖吗？", es: "¿Tanta física hace que la crema sepa a caramelo?" },
            deltaEnergy: 0, drink: "dirty_espresso", nextMood: "poetic"
          }
        ]
      },
      {
        id: "microfoam_theology",
        mood: "poetic",
        text: {
          en: "\"Watch this steamed milk: glossy like wet white paint, velvety microfoam with zero coarse bubbles. Milk steaming is pure physics meeting morning patience.\"",
          zh: "\"看这打发好的奶泡：像湿润的白油漆一样反光，细密如绸缎，没有半颗粗气泡。蒸汽打奶泡是流体力学与清晨耐心的完美融合。\"",
          es: "\"Observa esta leche emulsionada: brillante como pintura fresca, microespuma sedosa sin burbujas. Es física pura combinada con paciencia matutina.\""
        },
        options: [
          {
            label: { en: "Pour that velvet foam into a Barceloneta cortado.", zh: "把这份丝滑奶泡注入一杯巴塞罗那式橙花蜂蜜考塔朵。", es: "Vierte esa microespuma en un cortado con miel y azahar." },
            deltaEnergy: 1, drink: "barceloneta_cortado", nextMood: "baristaJoy"
          },
          {
            label: { en: "Show off some latte art! A tulip or a cat paw?", zh: "秀一手拉花吧！是九层郁金香还是小猫肉垫？", es: "¡Luce tu latte art! ¿Un tulipán o una patita de gato?" },
            deltaEnergy: 1, drink: "croissant_combo", nextMood: "empath", bond: 1
          },
          {
            label: { en: "Crown an iced Einspänner with hand-whipped cream instead.", zh: "不如在冰美式上打一朵香草维也纳厚奶油雪顶。", es: "Prefiero una nube de nata montada sobre un Einspänner." },
            deltaEnergy: 0, drink: "einspanner", nextMood: "poetic"
          }
        ]
      },
      {
        id: "gaudi_courtyard",
        mood: "baristaJoy",
        text: {
          en: "\"The morning shadows across our hutong courtyard tiles resemble the mosaic trencadís of Park Güell in Barcelona. There's a sunny Catalan warmth in the air today.\"",
          zh: "\"清晨斜照在院子地砖上的树影，倒真有点像巴塞罗那奎尔公园里的彩色马赛克拼贴。今天四合院里有种地中海阳光般的明媚感。\"",
          es: "\"Las sombras matutinas en el patio parecen el trencadís de Gaudí en Barcelona. Hay una calidez luminosa y mediterránea en el ambiente hoy.\""
        },
        options: [
          {
            label: { en: "A Barceloneta Honey Cortado with orange zest.", zh: "来一杯带着鲜橙皮油香气的巴塞罗那蜂蜜考塔朵。", es: "Un Cortado Barceloneta con ralladura de naranja y miel." },
            deltaEnergy: 1, drink: "barceloneta_cortado", nextMood: "baristaJoy"
          },
          {
            label: { en: "A floral Gesha to match the Gaudí mosaic vibes.", zh: "手冲一杯花香四溢的瑰夏，正配这份斑斓朝阳。", es: "Un Gesha floral para armonizar con ese mosaico de sol." },
            deltaEnergy: 1, drink: "gesha_pourover", nextMood: "poetic"
          },
          {
            label: { en: "Let Yuzu nap on the sunniest courtyard stone.", zh: "让大橘猫柚子独占院子里那块晒得最暖和的石阶吧。", es: "Deja que Yuzu duerma en la piedra más soleada del patio." },
            deltaEnergy: 0, drink: "croissant_combo", nextMood: "empath", bond: 1
          }
        ]
      },
      {
        id: "cat_burlap_inspection",
        mood: "sarcastic",
        text: {
          en: "\"A fresh shipment of Huila Colombia washed beans arrived at 7 AM. Miso immediately slept on top of the burlap sack, while Yuzu inspected every corner. Certified quality control!\"",
          zh: "\"清晨七点刚运到一麻袋哥伦比亚蕙兰水洗咖啡生豆。味噌立马盘踞在麻袋上补觉，柚子则仔细把生豆嗅了一遍。真正的‘猫爪质检’！\"",
          es: "\"A las siete llegó un saco de café de Huila, Colombia. Miso se acostó de inmediato encima y Yuzu olió cada grano. ¡Control de calidad certificado por felinos!\""
        },
        options: [
          {
            label: { en: "Brew whatever bean the cats gave their blessing to.", zh: "冲一杯猫咪质检员盖章认证的单一产区手冲。", es: "Prepara el grano que los gatos hayan aprobado." },
            deltaEnergy: 1, drink: "yunnan_honey_pour", nextMood: "baristaJoy"
          },
          {
            label: { en: "Feed Miso and Yuzu some treats for their hard work.", zh: "替这两位辛勤巡检的猫咪员工加一勺冻干小零食。", es: "Premia a Miso y Yuzu por su duro trabajo de inspección." },
            deltaEnergy: 0, drink: "coldbrew_tonic", nextMood: "empath", bond: 1
          },
          {
            label: { en: "I'll take a Vienna Einspänner while the cats sleep.", zh: "趁小猫在生豆上打呼噜，给我上一杯焦糖维也纳咖啡吧。", es: "Tomaré un Einspänner mientras los gatos descansan." },
            deltaEnergy: 0, drink: "einspanner", nextMood: "poetic"
          }
        ]
      },
      {
        id: "corporate_refuge",
        mood: "empath",
        text: {
          en: "\"Rush hour. Out on the main road, commuters are sprinting toward the subway with dread in their eyes. Take your time behind this wooden door—work can wait fifteen minutes.\"",
          zh: "\"正是早高峰。外头大街上赶地铁的人脚步匆匆、眼神紧绷。在这扇木门后多坐一会儿吧——工作总能等个十五分钟的。\"",
          es: "\"Hora punta. Fuera, la gente corre al metro con prisa y estrés. Tómate tu tiempo aquí detrás de la madera: el trabajo puede esperar quince minutos.\""
        },
        options: [
          {
            label: { en: "Thank you, Wei. An Oat Dirty to anchor my morning.", zh: "谢谢你 Wei。来一杯浓醇燕麦Dirty稳住心神。", es: "Gracias, Wei. Un Dirty de avena para anclar mi mañana." },
            deltaEnergy: 0, drink: "dirty_espresso", nextMood: "empath", bond: 1
          },
          {
            label: { en: "A warm butter croissant and ceremonial matcha.", zh: "一只温热蜂巢可颂，配上一碗现点宇治云朵抹茶。", es: "Un croissant tibio de mantequilla y matcha ceremonial." },
            deltaEnergy: 1, drink: "matcha_cloud", nextMood: "poetic"
          },
          {
            label: { en: "I'm setting my Slack status to 'In Hutong Meditation'.", zh: "我先把工作状态改成‘胡同深度冥想中’再说。", es: "Pondré mi estado de Slack en 'Meditando en el Hutong'." },
            deltaEnergy: 0, drink: "gesha_pourover", nextMood: "sarcastic"
          }
        ]
      },
      {
        id: "yunnan_honey_roast",
        mood: "baristaJoy",
        text: {
          en: "\"This Yunnan Baoshan Honey lot was roasted just four days ago. It has this incredible sweetness like dried persimmon, wild honey, and mountain wood smoke. Want to smell the dry grounds?\"",
          zh: "\"这批云南保山日晒黄蜜处理是四天前刚烘好的。干香带着极其惊艳的柿饼甜香、野山蜂蜜与高山木质香。要先闻闻干香气吗？\"",
          es: "\"Este lote honey de Baoshan, Yunnan, se tostó hace apenas cuatro días. Tiene una dulzura fantástica a caqui seco, miel silvestre y notas amaderadas. ¿Quieres oler la molienda?\""
        },
        options: [
          {
            label: { en: "Yes! Grind and brew it in the ceramic V60.", zh: "太香了！用有田烧陶瓷滤杯冲出它的层次感吧。", es: "¡Sí! Muélelo y extráelo en el V60 cerámico." },
            deltaEnergy: 1, drink: "yunnan_honey_pour", nextMood: "baristaJoy", bond: 1
          },
          {
            label: { en: "Can we make a sparkling citrus cold brew with it?", zh: "能用它调制一杯带气泡的清爽柑橘冰汤力吗？", es: "¿Podemos hacer un cold brew tónica cítrico con ese café?" },
            deltaEnergy: 0, drink: "coldbrew_tonic", nextMood: "poetic"
          },
          {
            label: { en: "Pack a tin of whole beans for me to take home.", zh: "给我称一罐新鲜烘焙的整颗咖啡豆带走。", es: "Empácame una lata de granos enteros para llevar a casa." },
            deltaEnergy: 1, drink: "croissant_combo", nextMood: "empath"
          }
        ]
      },
      {
        id: "book_corner_next_door",
        mood: "poetic",
        text: {
          en: "\"Have you been next door yet? Borrowed Pages, the second-hand book place. Four little rooms from the attic down to the basement, and every book has a note tucked inside. Yuzu hops the garden wall most afternoons and naps on the poetry.\"",
          zh: "\"去过隔壁了吗？借来的书，卖旧书的。从阁楼到地下室一共四个小房间，每本书里都夹着一张字条。柚子几乎每天下午都翻过花园墙溜过去，睡在诗集上。\"",
          es: "\"¿Ya has ido a la casa de al lado? Páginas Prestadas, los libros de segunda mano. Cuatro cuartitos del desván al sótano, y cada libro lleva una nota dentro. Yuzu salta la tapia del jardín casi cada tarde y se duerme sobre la poesía.\""
        },
        options: [
          {
            label: { en: "I'll swap a book over there after this coffee.", zh: "喝完这杯就过去换本书。", es: "Después de este café me paso a cambiar un libro." },
            deltaEnergy: 1, drink: "barceloneta_cortado", nextMood: "poetic"
          },
          {
            label: { en: "I'll bring Yuzu back, with a pour-over as the ransom.", zh: "我去把柚子领回来，带杯手冲当赎金。", es: "Traeré a Yuzu de vuelta, con un café de filtro como rescate." },
            deltaEnergy: 0, drink: "gesha_pourover", nextMood: "empath", bond: 1
          },
          {
            label: { en: "Which book would you leave on their shelves, Wei?", zh: "Wei，你会在那边的书架上留哪本书？", es: "Wei, ¿qué libro dejarías tú en sus estantes?" },
            deltaEnergy: 0, drink: "yunnan_honey_pour", nextMood: "poetic"
          }
        ]
      }
    ];
  
