    /* DRINK & COFFEE MENU MANIFEST */
    const DrinkManifest = {
      // Cocktails (Bar Mode)
      jasmine_gulou: {
        type: 'bar',
        name: { en: "Gulou Belltower Jasmine G&T", zh: "鼓楼夜钟茉莉金汤力", es: "G&T Jazmín de la Torre Gulou" },
        sub: { en: "Beijing Jasmine Tea • Osmanthus Mist • Crystal Clear Ice", zh: "北京茉莉银针 • 金桂气泡水 • 手凿长冰柱", es: "Té de Jazmín de Pekín • Bruma de Osmanto • Hielo Cristalino" },
        desc: { en: "\"Cold-infused Beijing jasmine green tea with artisan dry gin and effervescent osmanthus soda.\"", zh: "\"冷萃北京茉莉花茶搭配杜松金酒与金桂气泡水，杯沿饰以糖霜山楂片。花香回甘，秋意沉静。\"", es: "\"Gin infusionado con té verde de jazmín, soda de osmanto y espino silvestre.\"" },
        formula: "45ml Jasmine Tea Gin • 120ml Osmanthus Soda • Hawthorn Crisp",
        icon: "🫖"
      },
      catalan: {
        type: 'bar',
        name: { en: "The Catalan Rose & Sea", zh: "加泰罗尼亚玫瑰与海", es: "La Rosa y el Mar Catalán" },
        sub: { en: "Barcelona Botanicals • Sant Jordi Petals • Med Tonic", zh: "巴塞罗那草本 • 圣乔治红玫瑰花瓣 • 地中海汤力", es: "Botánicos de Barcelona • Pétalos de Sant Jordi • Tónica Med" },
        desc: { en: "\"Mediterranean rosemary, arbequina olive notes, and floating Sant Jordi red rose petals.\"", zh: "\"融汇巴塞罗那迷迭香、阿贝金娜橄榄微咸与圣乔治红玫瑰花瓣，回味如同漫步海港薄暮。\"", es: "\"Romero mediterráneo, tónica de alta montaña y pétalos carmesí de Sant Jordi.\"" },
        formula: "45ml Catalan Gin • 120ml Med Tonic • Rose Petals • Bay Leaf",
        icon: "🌹"
      },
      catalan_vermut: {
        type: 'bar',
        name: { en: "Barcelona Gothic House Vermut", zh: "巴塞罗那哥特区家酿苦艾酒", es: "Vermut Artesanal de Barcelona" },
        sub: { en: "Sweet Herbal Vermouth • Stuffed Gordal Olive • Orange Slice", zh: "加泰罗尼亚草本红苦艾 • 戈达尔大橄榄 • 鲜切厚橙片", es: "Vermut Rojo Artesano • Oliva Gordal • Rodaja de Naranja" },
        desc: { en: "\"Rich artisan red vermouth poured over a single clear ice block with an orange wedge and olive spear.\"", zh: "\"浓厚甘冽的红苦艾酒注入大方冰，串起一颗西班牙戈达尔大橄榄与多汁橙角，微甜微苦，海风拂面。\"", es: "\"Vermut rojo artesanal servido sobre roca con aceituna gordal y naranja fresca.\"" },
        formula: "90ml Catalan Red Vermut • Siphon Soda Splash • Gordal Olive • Orange",
        icon: "🍷"
      },
      kyoto: {
        type: 'bar',
        name: { en: "Kyoto Mist Shiso G&T", zh: "京都竹雾紫苏金汤力", es: "Kyoto Mist Shiso G&T" },
        sub: { en: "Ki No Bi Gin • Green Tea & Bamboo • Slapped Shiso", zh: "季之美京都金酒 • 玉露竹林蒸馏 • 紫苏叶与山椒", es: "Gin Ki No Bi • Té Gyokuro y Bambú • Shiso Morado" },
        desc: { en: "\"Purple shiso leaf, green tea distillate, and crushed sansho pepper over crystal ice spear.\"", zh: "\"拍醒的新鲜紫苏叶，交融京都玉露绿茶与竹叶蒸馏液，研磨山椒粉带来一丝清冽微辛。\"", es: "\"Hoja de shiso morado despertada a mano, té verde y pimienta sansho sobre lanza de hielo.\"" },
        formula: "45ml Ki No Bi Gin • 120ml Yuzu Tonic • Shiso • Sansho",
        icon: "🌿"
      },
      oldfashioned: {
        type: 'bar',
        name: { en: "Cask Rye Old Fashioned", zh: "原桶黑麦经典老式", es: "Old Fashioned de Centeno" },
        sub: { en: "Peat Level: Medium • Hand-cut Cube • Flamed Peel", zh: "焦糖甜苦平衡 • 桶陈木质香 • 60mm整块透冰", es: "Centeno Puro • Azúcar Demerara • Hielo Esférico" },
        desc: { en: "\"Heavy lowball with flamed orange peel, demerara syrup, and barrel-aged bitters.\"", zh: "\"选用沉稳重底厚玻璃杯，以火燎香橙皮油喷香，德梅拉拉原蔗糖与桶陈苦精静静交融。\"", es: "\"Vaso bajo con piel de naranja flameada, almíbar demerara y amargos añejados.\"" },
        formula: "60ml Rye • 5ml Demerara • 3 dashes Angostura • Flamed Peel",
        icon: "🥃"
      },
      negroni: {
        type: 'bar',
        name: { en: "Negroni Classico", zh: "经典内格罗尼 1:1:1", es: "Negroni Clásico" },
        sub: { en: "Bittersweet 1:1:1 • Campari & Vermouth", zh: "金巴利苦酒 • 甜味美思 • 伦敦干金 搅拌35次", es: "Agridulce Equilibrado • Campari & Vermouth" },
        desc: { en: "\"Equal parts London dry, Italian bitter aperitif, and sweet vermouth stirred over rock.\"", zh: "\"等比例的英格兰干金、意大利金巴利与都灵甜味美思，在老冰上顺畅旋转35周。\"", es: "\"Partes iguales de gin seco, aperitivo amargo y vermouth dulce removido sobre roca.\"" },
        formula: "30ml Gin • 30ml Campari • 30ml Carpano Antica",
        icon: "🍹"
      },
      paperplane: {
        type: 'bar',
        name: { en: "Paper Plane Nocturne", zh: "夜间纸飞机", es: "Paper Plane Nocturno" },
        sub: { en: "Crisp Acidity • Bourbon & Amaro Nonino", zh: "明亮酸度 • 波本威士忌 • 诺尼诺草本利口", es: "Acidez Viva • Bourbon & Amaro Nonino" },
        desc: { en: "\"Shaken hard in coupe with fresh lemon, Aperol, and velvety herbal Amaro Nonino.\"", zh: "\"猛烈摇荡，鲜柠檬汁中和了草本利口的微苦，轻盈得如同能滑翔破晓。\"", es: "\"Agitado con fuerza en copa coupé con limón fresco, Aperol y Amaro Nonino.\"" },
        formula: "22.5ml Bourbon • 22.5ml Aperol • 22.5ml Nonino • 22.5ml Lemon",
        icon: "✈️"
      },
      smoked_rosemary: {
        type: 'bar',
        name: { en: "Smoked Rosemary Islay Highball", zh: "泥煤烟熏迷迭香高球", es: "Highball de Islay y Romero Ahumado" },
        sub: { en: "Laphroaig 10 • Torched Herb Smoke • Mountain Soda", zh: "拉弗格10年泥煤 • 喷枪炙烤迷迭香 • 高气泡苏打水", es: "Islay Peated Whisky • Romero Tostado • Soda de Alta Presión" },
        desc: { en: "\"Smoky Islay scotch charged with super-carbonated soda and perfumed with charred garden rosemary.\"", zh: "\"重泥煤苏格兰单一麦芽威士忌搭配强气泡苏打，杯口以喷枪炙烤一簇新鲜迷迭香，烟火气十足。\"", es: "\"Scotch ahumado con soda extra burbujeante y una ramita de romero tostada en directo.\"" },
        formula: "45ml Islay Scotch • 135ml High-Pressure Soda • Flamed Rosemary Sprig",
        icon: "🔥"
      },

      sazerac: {
    type: 'bar',
    name: {
      en: "New Orleans Sazerac",
      zh: "新奥尔良萨泽拉克 Sazerac",
      es: "Sazerac de Nueva Orleans"
    },
    sub: {
      en: "Rye Whiskey • Absinthe Wash • Peychaud's • Lemon Twist",
      zh: "黑麦威士忌 • 苦艾酒涮杯 • 裴乔氏苦精 • 柠檬皮油",
      es: "Whisky de Centeno • Lavado de Ajenjo • Peychaud's • Limón"
    },
    desc: {
      en: "\"Chilled rocks glass coated with anise-heavy absinthe, holding stirred rye whiskey and Creole aromatic bitters without ice.\"",
      zh: "\"以绿仙子苦艾酒涮洗冰镇古典杯，注入搅拌至刺骨冰冷的黑麦威士忌与克里奥尔红苦精，不加冰块，纯粹利落。\"",
      es: "\"Vaso bajo escarchado con ajenjo de anís, con centeno puro y amargo criollo Peychaud's servido sin hielo.\""
    },
    formula: "60ml Rye Whiskey • 1 Barspoon Demerara • 4 dashes Peychaud's • Absinthe Rinse • Expressed Lemon Peel",
    icon: "🥃"
  },
      last_word: {
    type: 'bar',
    name: {
      en: "The Last Word",
      zh: "临别赠言 The Last Word",
      es: "La Última Palabra (The Last Word)"
    },
    sub: {
      en: "Equal Parts • Green Chartreuse • Maraschino • Lime",
      zh: "修道院绿查特酒 • 莫利那樱桃利口 • 伦敦干金 • 青柠",
      es: "Partes Iguales • Chartreuse Verde • Marrasquino • Lima"
    },
    desc: {
      en: "\"A prohibition-era masterpiece shaken in equal ratios. Piercing alpine herbal sharpness balanced with sweet cherry stone.\"",
      zh: "\"等比例摇荡的禁酒令经典。130种高山草药的绿查特酒与清冽青柠汁碰撞，酸度凌厉，尾韵深邃如高山松林。\"",
      es: "\"Obra maestra de la Ley Seca a partes iguales. Nitidez herbal alpina y cereza marrasquino con acidez cítrica viva.\""
    },
    formula: "22.5ml London Dry Gin • 22.5ml Green Chartreuse • 22.5ml Maraschino Liqueur • 22.5ml Fresh Lime",
    icon: "🍸"
  },

  penicillin: {
    type: 'bar',
    name: {
      en: "Penicillin Modern Classic",
      zh: "青霉素 Penicillin",
      es: "Penicilina (Penicillin)"
    },
    sub: {
      en: "Blended Scotch • Honey-Ginger Syrup • Smoky Peat Float",
      zh: "调和苏格兰威士忌 • 野生蜂蜜生姜汁 • 艾雷岛泥煤浮顶",
      es: "Scotch Blended • Miel de Jengibre • Flotador de Turba Islay"
    },
    desc: {
      en: "\"Zesty fresh lemon and spicy ginger syrup anchored by smooth malt scotch, crowned with a mist of peaty Islay single malt.\"",
      zh: "\"新鲜辛辣的嫩姜与高山蜂蜜融进苏格兰麦芽威士忌，杯顶轻浮一层重泥煤单一麦芽，宛如深秋壁炉前的慰藉。\"",
      es: "\"Limón fresco y jarabe especiado de jengibre y miel con base de malta, coronado por una capa de Islay ahumado.\""
    },
    formula: "50ml Blended Scotch • 20ml Lemon Juice • 20ml Honey-Ginger Syrup • 10ml Islay Peat Float • Candied Ginger",
    icon: "🍯"
  },

  boulevardier: {
    type: 'bar',
    name: {
      en: "Boulevardier 1927",
      zh: "花花公子 Boulevardier",
      es: "Boulevardier Clásico 1927"
    },
    sub: {
      en: "High Proof Bourbon • Campari • Carpano Antica Formula",
      zh: "高波本威士忌 • 金巴利苦酒 • 顶级都灵甜味美思",
      es: "Bourbon de Alta Graduación • Campari • Vermut Rojo"
    },
    desc: {
      en: "\"The Parisian cousin of the Negroni: replaces gin with rich American oak bourbon for a heavier, caramel-bitter complexity.\"",
      zh: "\"内格罗尼的巴黎亲戚。以饱满浓郁的美国橡木桶波本代替金酒，焦糖、香草与草本苦涩在舌尖层层叠叠绽放。\"",
      es: "\"El primo parisino del Negroni: sustituye el gin por bourbon añejado, logrando complejidad amarga y acaramelada.\""
    },
    formula: "45ml Bourbon • 30ml Campari • 30ml Sweet Red Vermouth • Orange Peel Ribbon",
    icon: "🍹"
  },

  corpse_reviver_2: {
    type: 'bar',
    name: {
      en: "Corpse Reviver No. 2",
      zh: "还魂药二号 Corpse Reviver #2",
      es: "Corpse Reviver Nº 2"
    },
    sub: {
      en: "Gin • Kina Lillet / Cocchi • Cointreau • Lemon • Absinthe",
      zh: "干金酒 • 白利莱酒 • 君度橙酒 • 鲜柠檬 • 滴定苦艾酒",
      es: "Gin • Lillet Blanc • Cointreau • Zumo de Limón • Ajenjo"
    },
    desc: {
      en: "\"Four of these taken in swift succession will unrevive the corpse again. Pale, luminous, botanically electric.\"",
      zh: "\"如萨沃伊鸡尾酒手册所言：连喝四杯能让还魂的人再次躺平。色泽明亮澄澈，柑橘果酸与草本香气直击头顶。\"",
      es: "\"Cuatro de estos seguidos reviven a cualquiera o lo vuelven a noquear. Cítrico, luminoso y botánico.\""
    },
    formula: "22.5ml Dry Gin • 22.5ml Lillet Blanc • 22.5ml Cointreau • 22.5ml Lemon Juice • 1 dash Absinthe",
    icon: "🧪"
  },

  aviation: {
    type: 'bar',
    name: {
      en: "Aviation Cocktail",
      zh: "飞行航空 Aviation",
      es: "Cóctel Aviación (Aviation)"
    },
    sub: {
      en: "Crème de Violette • Maraschino • Dry Gin • Lemon",
      zh: "紫罗兰利口酒 • 莫利那樱桃酒 • 伦敦干金 • 柠檬汁",
      es: "Crema de Violetas • Marrasquino • Gin Seco • Limón"
    },
    desc: {
      en: "\"A faint sky-blue nostalgic coupette born in pre-flight era hotel bars, with floral violet petals and almond undertones.\"",
      zh: "\"诞生于民航黎明时期的天蓝色经典。紫罗兰花香与野生酸樱桃的微苦交织，杯底仿佛悬浮着黎明破晓的晨曦。\"",
      es: "\"Tono azul cielo nostálgico de los hoteles de entreguerras, con pétalos de violeta y matices de cereza amarga.\""
    },
    formula: "45ml London Dry Gin • 15ml Maraschino Liqueur • 7.5ml Crème de Violette • 15ml Fresh Lemon Juice",
    icon: "✈️"
  },

  manhattan_rye: {
    type: 'bar',
    name: {
      en: "Rittenhouse Manhattan",
      zh: "曼哈顿 Manhattan (1874)",
      es: "Manhattan Clásico de Centeno"
    },
    sub: {
      en: "Bonded Rye • Italian Sweet Vermouth • Angostura • Brandied Cherry",
      zh: "保税黑麦威士忌 • 意式甜味美思 • 安哥天娜苦精 • 白兰地酒渍樱桃",
      es: "Centeno 100 Proof • Vermut Dulce Italiano • Amargo Angostura • Cereza"
    },
    desc: {
      en: "\"The queen of stirred cocktails: spicy rye tempered by herbal fortified wine, holding an artisanal Luxardo cherry.\"",
      zh: "\"搅拌类鸡尾酒的无冕女王。高酒度黑麦的辛香被药草加强葡萄酒温柔驯化，沉下一颗纯手工意式黑樱桃。\"",
      es: "\"La reina de los cócteles revueltos: centeno especiado templado por vermut dulce y cereza marrasquino artesanal.\""
    },
    formula: "60ml Rittenhouse Rye 100 Proof • 30ml Carpano Vermouth • 2 dashes Angostura • 1 Luxardo Cherry",
    icon: "🍒"
  },

  clover_club: {
    type: 'bar',
    name: {
      en: "Clover Club 1896",
      zh: "三叶草俱乐部 Clover Club",
      es: "Clover Club de Frambuesa"
    },
    sub: {
      en: "Dry Gin • House Raspberry Syrup • Dry Vermouth • Velvety Egg Foam",
      zh: "杜松干金 • 自熬新鲜覆盆子糖浆 • 干味美思 • 丝滑蛋白乳化雪顶",
      es: "Gin Seco • Jarabe de Frambuesa Casero • Vermut Seco • Espuma Sedosa"
    },
    desc: {
      en: "\"Originating from Philadelphia gentleman clubs: dry gin shaken vigorously with fresh raspberries and silk emulsion foam.\"",
      zh: "\"源自十九世纪末费城绅士俱乐部的粉红佳作。新鲜红树莓酸香与干味美思交融，蛋白带来天鹅绒般的丰密口感。\"",
      es: "\"Clásico de caballeros de Filadelfia: gin seco agitado con frambuesas silvestres y espuma sedosa de clara.\""
    },
    formula: "45ml Gin • 15ml Dry Vermouth • 15ml Fresh Lemon • 20ml Raspberry Syrup • 15ml Egg White (Dry Shaken)",
    icon: "🌸"
  },

      // Specialty Coffee (Cafe Mode)
      gesha_pourover: {
        type: 'cafe',
        name: { en: "Anaerobic Natural Gesha (V60)", zh: "厌氧日晒瑰夏手冲 (V60)", es: "Gesha Natural Anaeróbico (V60)" },
        sub: { en: "Ethiopia Guji • Jasmine Floral • White Peach & Bergamot", zh: "埃塞俄比亚谷吉 • 茉莉花香 • 白桃佛手柑", es: "Etiopía Guji • Floral de Jazmín • Melocotón Blanco" },
        desc: { en: "\"Extracted through Japanese ceramic V60 at 91°C. Silky floral sweetness with crisp stone fruit acidity.\"", zh: "\"选用有田烧陶瓷V60滤杯于91度慢注冲煮。如丝绸般的茉莉花香与白桃多汁感在口腔绽放。\"", es: "\"Extraído en V60 cerámico a 91°C. Dulzura floral y acidez viva de melocotón blanco.\"" },
        formula: "15g Coffee • 240g Water • 91°C • Ratio 1:16 • 2m 15s",
        icon: "☕"
      },
      dirty_espresso: {
        type: 'cafe',
        name: { en: "Beijing Hutong Oat Milk Dirty", zh: "胡同浓郁冷热燕麦 Dirty", es: "Dirty de Avena Hutong" },
        sub: { en: "Yunnan Double Ristretto • Chilled Dense Oat Cream", zh: "云南双份精萃Ristretto • 冰镇醇厚燕麦奶", es: "Ristretto Doble de Yunnan • Leche de Avena Helada" },
        desc: { en: "\"Hot dark chocolate espresso extracted straight over icy dense oat cream. Layers melt together sip by sip.\"", zh: "\"现压滚烫浓缩直落于冰冷厚实燕麦奶层上，一口大口喝下，感受冷与热、苦甜与坚果奶香的奇妙交融。\"", es: "\"Espresso caliente vertido sobre crema densa y fría de avena. Capas contrastantes en cada sorbo.\"" },
        formula: "30ml Double Ristretto • 120ml Chilled Dense Oat Cream • Zero Ice",
        icon: "🥛"
      },
      barceloneta_cortado: {
        type: 'cafe',
        name: { en: "Barceloneta Honey Orange Cortado", zh: "巴塞罗那橙皮蜂蜜考塔朵", es: "Cortado Barceloneta con Miel" },
        sub: { en: "Wildflower Honey • Espresso 1:1 Steamed Milk • Orange Oil", zh: "野花蜂蜜 • 1:1等比微奶泡 • 西班牙甜橙精油", es: "Miel Silvestre • Proporción 1:1 • Aceite de Naranja" },
        desc: { en: "\"Spanish style cortado layered over artisan wildflower honey, expressing bright citrus zest in velvety microfoam.\"", zh: "\"加泰罗尼亚经典考塔朵，底部垫有野花蜂蜜，萃取双份意式浓缩并注入等量微奶泡，刮擦新鲜甜橙皮油。\"", es: "\"Cortado español sobre miel de flores silvestres con microespuma perfumada a naranja fresca.\"" },
        formula: "40ml Espresso • 10ml Raw Honey • 40ml Microfoam • Flamed Orange Peel",
        icon: "🍊"
      },
      yunnan_honey_pour: {
        type: 'cafe',
        name: { en: "Yunnan Baoshan Honey Pour-Over", zh: "云南保山精品黄蜜手冲", es: "Filtro Yunnan Honey de Baoshan" },
        sub: { en: "Baoshan 1800m • Dried Persimmon • Wild Honeycomb & Cacao", zh: "海拔1800米 • 柿饼蜜甜 • 野生蜂巢与生可可", es: "Altitud 1800m • Caqui Dulce • Miel y Cacao Puro" },
        desc: { en: "\"Honey processed specialty lot from Baoshan, Yunnan. Deep lingering sweetness resembling dried persimmons and wild honey.\"", zh: "\"来自云南保山高海拔产区的优质黄蜜微批次。饱满的柿饼与烤坚果香气，尾韵有着绵长的野生蜂蜜甜感。\"", es: "\"Proceso honey de alta montaña en Yunnan. Dulzura prolongada a frutas deshidratadas y miel.\"" },
        formula: "16g Coffee • 250g Water • 92°C • Ratio 1:15.5 • 2m 20s",
        icon: "🫘"
      },
      croissant_combo: {
        type: 'cafe',
        name: { en: "Cultured Butter Croissant & Flat White", zh: "发酵黄油蜂巢可颂配澳白", es: "Croissant de Mantequilla & Flat White" },
        sub: { en: "72 Layers Butter Flake • Velvety Microfoam", zh: "72层蜂巢起酥 • 丝滑微奶泡双份澳白", es: "72 Capas Hojaldradas • Microespuma Aterciopelada" },
        desc: { en: "\"Freshly baked golden French butter croissant served with a velvety, chocolate-toned Flat White.\"", zh: "\"早晨在店里现场烤制的酥脆蜂巢可颂，配上一杯拉花精致、坚果巧克风味的澳白咖啡。\"", es: "\"Croissant francés crujiente servido con un Flat White sedoso de notas a cacao.\"" },
        formula: "Warm Croissant • 180ml Flat White (Double Espresso + Microfoam)",
        icon: "🥐"
      },
      coldbrew_tonic: {
        type: 'cafe',
        name: { en: "Cold Brew Sparkling Citrus Tonic", zh: "柑橘冷萃气泡冰汤力", es: "Cold Brew Tónica con Cítricos" },
        sub: { en: "18-Hour Slow Steep • Yuzu Tonic • Dehydrated Grapefruit", zh: "18小时慢速冷萃 • 日本柚子汤力 • 烘干红柚轮", es: "Maceración Fría 18h • Tónica de Yuzu • Pomelo Seco" },
        desc: { en: "\"18-hour cold brew infused with bubbly yuzu tonic water and charred citrus peel. Incredibly refreshing.\"", zh: "\"经18小时冰滴冷萃的单一产区咖啡，冲入冰凉柚子汤力汽水，气泡滋滋作响，清新醒神。\"", es: "\"Café infusionado en frío durante 18h con tónica de yuzu y cítricos asados.\"" },
        formula: "60ml Cold Brew • 120ml Yuzu Tonic • Ice Spear • Grapefruit Wheel",
        icon: "🧊"
      },
      einspanner: {
        type: 'cafe',
        name: { en: "Vienna Einspänner Caramel Cream", zh: "维也纳焦糖雪顶维也纳咖啡", es: "Einspänner Vienés con Crema" },
        sub: { en: "Deep Americano • Whipped Fresh Vanilla Cream • Raw Sugar", zh: "浓郁美式基底 • 手打香草淡奶油雪顶 • 原蔗糖粒", es: "Americano Intenso • Nata Montada con Vainilla • Azúcar Moreno" },
        desc: { en: "\"Deep dark roast coffee crowned with a cloud of cold hand-whipped vanilla cream and cocoa dust.\"", zh: "\"浓黑醇苦的黑咖啡上方漂浮着一团厚厚的现打香草冷奶油，顶端撒满法芙娜可可粉。\"", es: "\"Café negro coronado con una densa nube de nata fría a la vainilla y cacao.\"" },
        formula: "120ml Long Black • 50ml Whipped Sweet Cream • Cocoa Dust",
        icon: "🍨"
      },
      matcha_cloud: {
        type: 'cafe',
        name: { en: "Uji Ceremonial Cloud Latte", zh: "宇治初摘云朵双层抹茶", es: "Latte de Matcha Ceremonial de Uji" },
        sub: { en: "Stone-milled First Flush Uji • Silky Oat Milk • Bamboo Whisked", zh: "宇治石磨一番茶 • 浓厚燕麦奶 • 茶筅现点手打", es: "Primera Cosecha de Uji • Leche de Avena • Batido con Chasen" },
        desc: { en: "\"First harvest ceremonial green tea hand-whisked into emerald foam, floated over chilled velvety oat milk.\"", zh: "\"选用宇治一番摘顶级石磨抹茶，以百本立竹茶筅现点打出细腻翡翠泡沫，轻柔悬浮于冰燕麦乳之上。\"", es: "\"Matcha ceremonial de Uji batido a mano en espuma esmeralda sobre leche fría de avena.\"" },
        formula: "4g Ceremonial Matcha • 40ml 80°C Water • 140ml Chilled Oat Milk",
        icon: "🍵"
      },

      // Off-menu: unlocked at bond level "Friend". Never listed in the codex.
      wei_notebook: {
        type: 'secret',
        name: { en: "Wei's Notebook (Off-Menu)", zh: "Wei 的笔记本（隐藏款）", es: "El Cuaderno de Wei (Fuera de Carta)" },
        sub: { en: "Jasmine Tea • Osmanthus Honey • Orange Peel • A Folded Note", zh: "茉莉花茶 • 桂花蜜 • 橙皮 • 一张折好的纸条", es: "Té de Jazmín • Miel de Osmanto • Piel de Naranja • Una Nota Doblada" },
        desc: { en: "\"Made only for friends. Under the coaster, a folded note in Wei's handwriting: 'Always a seat for you here.'\"", zh: "\"只做给朋友的一杯。杯垫下压着一张 Wei 手写的小纸条：‘这里永远给你留个座。’\"", es: "\"Solo para amigos. Bajo el posavasos, una nota con la letra de Wei: 'Aquí siempre hay un sitio para ti.'\"" },
        formula: "Jasmine Tea • Osmanthus Honey • Expressed Orange Peel • (Gin after 18:00)",
        icon: "📓"
      }
    };

    /* JOKES REPOSITORY */
    const JokesCollection = [
      {
        en: "Why did the espresso file a police report? ...Because it got mugged in the hutong!",
        zh: "浓缩咖啡为什么跑去胡同派出所报案？……因为他在胡同里被“打劫”（Mugged）了！",
        es: "¿Por qué el espresso fue a la policía? ...¡Porque lo asaltaron (mugged) en el callejón!",
        react: "☕"
      },
      {
        en: "A carbon atom walks into Next Door and asks for a drink. Wei says: 'Are you sure?' The atom says: 'I'm positive!'",
        zh: "一个碳原子走进吧台想要一杯酒。Wei 问：“你确定吗？” 原子答道：“我非常确定（Positive/带正电）！”",
        es: "Un átomo entra al bar y pide un trago. Wei dice: '¿Estás seguro?' El átomo responde: '¡Soy positivo!'",
        react: "⚛️"
      },
      {
        en: "How does Moses make his morning coffee? Hebrews it.",
        zh: "摩西每天早晨是怎么做咖啡的？答案是：他亲手“希伯来”（He-brews/他煮的）！",
        es: "¿Cómo prepara Moisés su café por la mañana? Él lo 'Hebreos' (He brews).",
        react: "📜"
      },
      {
        en: "Why do programmers prefer drinking coffee in the dark? Because light attracts bugs!",
        zh: "为什么程序员喝咖啡喜欢关掉所有的灯？因为有光的地方会招来“Bug”（飞虫/代码错误）！",
        es: "¿Por qué los programadores toman café a oscuras? ¡Porque la luz atrae los bugs!",
        react: "🐛"
      },
      {
        en: "Wei asked the customer: 'How do you like your coffee?' The customer said: 'Like my soul—dark, bitter, and way too hot for comfort.'",
        zh: "Wei 问客人：“你今天想要什么样的咖啡？” 客人说：“就像我的灵魂一样——漆黑、微苦、烫得难以接近。”",
        es: "Wei preguntó al cliente: '¿Cómo le gusta el café?' El cliente dijo: 'Como mi alma: oscura, amarga y demasiado caliente.'",
        react: "🖤"
      },
      {
    en: "A patron asks for a Martini so dry it causes a drought in the Sahara. Wei sets an empty coupe on the counter and whispers 'Vermouth' toward Milan.",
    zh: "客人要求来一杯“干到足以让撒哈拉沙漠大旱”的马天尼。Wei 拿出一只冰镇飞碟杯放在吧台上，然后面朝米兰的方向小声耳语了一句“味美思”。",
    es: "Un cliente pide un Martini tan seco que cause sequía en el Sahara. Wei deja una copa vacía en la barra y susurra 'Vermouth' mirando hacia Milán.",
    react: "🍸"
  },
  {
    en: "Why did the tonic water break up with the London dry gin? It was under too much pressure, and the relationship had turned completely bitter.",
    zh: "为什么汤力水要跟伦敦干金酒分手？因为气压太大，而且整段感情尝起来又苦又涩。",
    es: "¿Por qué la tónica cortó con el gin seco? Había demasiada presión y la relación se volvió amarga.",
    react: "🫧"
  },
  {
    en: "A developer walks into the hutong bar to debug a git merge conflict. Wei slides over a 120-proof cask strength: 'Drink this, it force-pushes everything to oblivion.'",
    zh: "程序员推门走进胡同酒吧想借酒消愁解决代码合并冲突。Wei 倒了一杯60度原桶烈酒：‘干了这杯，万事万物皆可强制覆盖（git push -f）。’",
    es: "Un programador entra al bar para resolver un conflicto de git merge. Wei le sirve whisky de 60 grados: 'Tómate esto, forzará el push hacia el olvido.'",
    react: "💻"
  },
  {
    en: "Wei told the guest: 'Drink enough Green Chartreuse and you will see mountain monks.' The guest said: 'All I see is my pending quarterly OKR.' Wei sighed: 'That's the scariest apparition of all.'",
    zh: "Wei 对客人说：‘绿查特酒喝够三杯就能看见阿尔卑斯山里的修道士。’ 客人叹气道：‘我眼前只有还没交的季度考核指标。’ Wei 点了点头：‘那确实是世上最吓人的幻象。’",
    es: "Wei dijo al cliente: 'Si bebes suficiente Chartreuse verás monjes alpinos.' El cliente dijo: 'Solo veo mis tareas atrasadas de la oficina.' Wei suspiró: 'Ese es el fantasma más aterrador.'",
    react: "📜"
  },
  {
    en: "Why did the Bourbon barrel refuse to make small talk? It had spent seven years in Kentucky maturing and didn't have the patience for corporate synergy.",
    zh: "为什么陈酿波本橡木桶拒绝闲聊客套？因为它在肯塔基仓库里沉睡了七年，实在没有耐心听职场黑话和‘战略闭环’。",
    es: "¿Por qué el barril de bourbon no hace conversación trivial? Pasó siete años madurando en silencio y no tiene paciencia para sinergias corporativas.",
    react: "🪵"
  },
  {
    en: "Why are hand-carved directional ice blocks terrible at modern romance? Because they refuse to be watered down by commitment issues.",
    zh: "为什么手工手凿的定向透明老冰块谈不好快餐恋爱？因为它们无论面对多大的压力，都拒绝被半途稀释。",
    es: "¿Por qué los prismas de hielo puro fracasan en el amor moderno? Porque se niegan a diluirse ante el compromiso.",
    react: "🧊"
  },
  {
    en: "What contains 68 mountain botanicals and never forgives a single mistake? A glass of Campari, and Wei's high school algebra teacher.",
    zh: "有什么东西蕴含68种苦味草药而且从不原谅任何错误？一杯纯饮金巴利，还有 Wei 当年的高三代数老师。",
    es: "¿Qué contiene 68 botánicos amargos y jamás perdona un error? Una copa de Campari y el profesor de matemáticas de Wei.",
    react: "🎯"
  },
  {
    en: "Why did the decaf espresso get kicked out of the bar? It had absolutely no buzz and couldn't pull its own weight.",
    zh: "为什么低因浓缩咖啡被请出了吧台？因为它既没有精神气头，萃取时还一点‘油脂沉淀’（Pull）都带不出来。",
    es: "¿Por qué echaron al café descafeinado del local? No tenía ninguna chispa y no aportaba nada a la barra.",
    react: "☕"
  },
  {
    en: "A guest asked: 'Wei, does this smoky scotch taste like peat moss or burnt ambition?' Wei adjusted his round glasses: 'Depends on what time you set your alarm tomorrow morning.'",
    zh: "客人问：‘Wei，这杯重泥煤威士忌尝起来是泥炭藓味，还是烧焦了的人生抱负？’ Wei 扶了扶圆框眼镜：‘那得看你明天早上的闹钟定在几点。’",
    es: "Un cliente preguntó: 'Wei, ¿este scotch ahumado sabe a turba o a sueños quemados?' Wei se ajustó las gafas: 'Depende de a qué hora tengas puesta la alarma mañana.'",
    react: "👓"
  }
    ];
  
