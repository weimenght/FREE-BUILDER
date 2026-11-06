    /* =====================================================================
       LOCALIZED HUMOR — each language gets its own jokes, not translations.
       ===================================================================== */
    const JOKES_BY_LANG = {
      en: JokesCollection.map(j => ({ t: j.en, r: j.react || '☕' })).concat([
        { t: "I asked Wei for a drink that tastes like Monday. He handed me an empty glass and an email.", r: "📧" },
        { t: "Miso sat on my laptop for an hour. My code has never been more stable. Nothing compiles, but nothing breaks.", r: "🐈‍⬛" }
      ]),

      zh: [
        { t: "冰美式为什么这么受欢迎？因为它跟打工人一样：又冷、又苦、还得撑着。", r: "🧊" },
        { t: "柚子为什么学习不好？因为它是只橘猫——天生“橘”限。", r: "🐈" },
        { t: "我问 Wei：“这咖啡怎么这么苦？” Wei 推了推眼镜：“因为它也在上班。”", r: "☕" },
        { t: "打工人三件宝：咖啡、外卖、和一句“收到”。", r: "📱" },
        { t: "北京大爷指路：“您往前走，看见一个特像鼓楼的楼——那就是鼓楼。”", r: "🏯" },
        { t: "为什么程序员分不清万圣节和圣诞节？因为 Oct 31 = Dec 25。", r: "💻" },
        { t: "客人：“老板，来点不醉的。” Wei：“好的，一杯白开水，加两句人生建议。”", r: "🥛" },
        { t: "“喝了这杯能解压吗？” “能。喝完你会发现钱包也解压了——瘪了。”", r: "👛" },
        { t: "减肥第一天：我只喝了一杯拿铁。配了三块可颂，因为可颂是空气做的。", r: "🥐" },
        { t: "味噌最近在练瑜伽。动作只有一个：猫式。时长：一整天。", r: "🐈‍⬛" }
      ],

      tw: [
        { t: "在台灣點一杯飲料，要回答的問題比面試還多：甜度？冰塊？加料？會員？載具？", r: "🧋" },
        { t: "為什麼珍珠奶茶不能去夜店？因為它怕被吸走。", r: "🧋" },
        { t: "什麼咖啡最冷靜？冷萃。它從來不衝動。", r: "🧊" },
        { t: "超商店員：「需要袋子嗎？」我：「不用，我只是進來吹冷氣的。」", r: "🏪" },
        { t: "颱風天大家最開心，因為放颱風假。Wei：「但我還是要開店。」貓：「那我們放貓假。」", r: "🌀" },
        { t: "熊貓為什麼不喝咖啡？因為牠早就有黑眼圈了。", r: "🐼" },
        { t: "柚子的人生格言：「胖不是我的錯，是罐罐太好吃。」", r: "🐈" },
        { t: "客人：「老闆，微糖去冰。」Wei：「好，那我的冷笑話也幫你去冰。」……現場還是很冷。", r: "🥶" },
        { t: "為什麼雞尾酒叫雞尾酒？因為公雞喝完都會把尾巴翹起來。", r: "🐓" }
      ],

      yue: [
        { t: "鴛鴦點解唔會分手？因為咖啡同奶茶一早溝埋一齊，分唔開㗎啦。", r: "☕" },
        { t: "Wei：「要唔要冰？」客人：「走冰。」Wei：「冰都識行㗎？」", r: "🧊" },
        { t: "柚子唔肯同我玩鋤大D，佢話驚人話佢出貓。", r: "🃏" },
        { t: "點解廣東人飲酒講「飲勝」唔講「飲乾」？因為做生意最忌「乾」——乾塘呀嘛。", r: "🥂" },
        { t: "茶記阿姐：「飲咩？」我：「諗緊……」阿姐：「諗完先講，下一位！」", r: "🫖" },
        { t: "香港人最鍾意嘅運動：追巴士、追地鐵、追 deadline。", r: "🚌" },
        { t: "凍檸茶少甜，係打工仔最後嘅堅持。", r: "🍋" },
        { t: "點解咖啡咁苦？因為佢都要返工。", r: "☕" },
        { t: "味噌話自己減緊肥，所以每餐只食一碗——不過係我個湯碗。", r: "🐈‍⬛" }
      ],

      es: [
        { t: "¿Cuál es el café más peligroso? El ex-preso.", r: "☕" },
        { t: "—Camarero, ¿este café es de Colombia? —No, señor, es de ayer.", r: "🫖" },
        { t: "¿Por qué el vino no va al gimnasio? Porque ya tiene mucho cuerpo.", r: "🍷" },
        { t: "Un gato entra en un bar y pide un miau-jito.", r: "🐈" },
        { t: "—Doctor, me duele aquí cuando tomo café. —Pruebe a sacar la cucharilla de la taza.", r: "🥄" },
        { t: "En España la siesta no es pereza: es mantenimiento preventivo.", r: "😴" },
        { t: "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!", r: "🐝" },
        { t: "—¿Me pones un café solo? —Claro. —Pues que no se sienta solo: ponme otro al lado.", r: "☕" },
        { t: "Mi gata Yuzu hace dieta: solo come entre horas. El problema es que para ella todo es entre horas.", r: "🐈" }
      ],

      ca: [
        { t: "Per què els castellers no prenen mai cafè? Perquè ja van prou carregats.", r: "🏰" },
        { t: "Quin és el cafè més perillós? L'ex-près.", r: "☕" },
        { t: "La Miso i la Yuzu no juguen mai a cartes: sempre hi ha gat amagat.", r: "🃏" },
        { t: "—Cambrer, hi ha una mosca al meu vermut! —No pateixi, senyor, no en beurà gaire.", r: "🪰" },
        { t: "Un ou entra al bar i demana una cervesa. —Aquí no servim ous. —Doncs fes-me una truita!", r: "🥚" },
        { t: "Per què el vi no va al gimnàs? Perquè ja té molt de cos.", r: "🍷" },
        { t: "La migdiada no és mandra: és manteniment preventiu.", r: "😴" },
        { t: "—Wei, aquest gin-tònic està molt fort! —És que l'he fet amb ganes.", r: "🍸" },
        { t: "La Yuzu fa dieta: només menja entre hores. El problema és que per a ella tot són entre hores.", r: "🐈" }
      ]
    };

    function jokesForLang() {
      return JOKES_BY_LANG[AppState.lang] || JOKES_BY_LANG.en;
    }
  
