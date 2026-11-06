    /* =====================================================================
       Catalan + Cantonese for the existing dialogue, drinks and Wei lines.
       繁體 (Taiwan) is converted from 简体 at runtime unless given here.
       Drinks in 粵語 use written Chinese (as on Hong Kong menus).
       ===================================================================== */

    // [text, option1, option2, option3]
    const TOPIC_PATCH = {
      gulou_bells: {
        ca: ["\"Les campanes de Gulou acaben de tocar mitjanit pels carrerons del hutong. Fuges del vent fred o vens a caçar històries?\"", "Un gin amb te de gessamí per escalfar-me.", "Explica'm els gats de carrer de la Torre del Tambor.", "Només vull silenci, gel clar i un tamboret."],
        yue: ["\"鼓樓嗰邊啱啱敲咗十二點，鐘聲成條胡同都聽到。你係嚟避北風，定係嚟搵故仔聽？\"", "嚟杯茉莉花茶金酒暖吓身。", "講吓鼓樓附近嗰幾隻流浪貓聽吓。", "我淨係想要一舊靚冰、一張櫈，同埋靜。"]
      },
      gingko_autumn: {
        ca: ["\"Les fulles daurades de ginkgo s'enganxen a les lloses molles. Si aquesta nit tingués aroma, seria osmant torrat o ginebre fred?\"", "Osmant torrat i espècies de tardor.", "Dona'm alguna cosa rebel i fumada.", "Posa el que vagi bé amb aquest plugim melangiós."],
        yue: ["\"出面啲銀杏葉黐晒落濕石板度。如果今晚有種味道，你覺得係焗桂花，定係凍杜松子？\"", "焗桂花，加少少秋天香料。", "俾杯有煙燻味、夠反叛嘅嘢我。", "隨便啦，配得起出面啲毛毛雨就得。"]
      },
      line2_last_train: {
        ca: ["\"L'última de la línia 2 acaba de passar. Si encara ets a la meva barra, o el dia ha estat brutal o la teva ànima no vol tornar a casa.\"", "El full de càlcul s'ha penjat a les 21:59. Pietat.", "Aquestes ulleres rodones et fan molt savi avui, Wei.", "He perdut el metro expressament. Alguna cosa forta."],
        yue: ["\"二號綫尾班車啱啱開走。你仲坐喺我吧枱，一係今日返工返到癲，一係個靈魂唔肯返屋企。\"", "我份 Excel 九點五十九分死咗機，救命。", "Wei，你副圓框眼鏡今晚特別有書卷味喎。", "我係特登唔搭尾班車㗎，嚟杯勁嘅。"]
      },
      barcelona_gothic: {
        ca: ["\"Aquest vermut m'ha recordat el Barri Gòtic a la una de la matinada: arcs de pedra, marinada i guitarres. Mai has enyorat una ciutat que fa anys que no veus?\"", "Posa'm un vermut de la casa amb gel i oliva.", "Barreja aquesta enyorança amb gin mediterrani.", "Ara mateix només enyoro dormir sense despertador."],
        yue: ["\"呢枝甜苦艾酒令我諗起巴塞隆拿哥德區凌晨一點：石拱門、海風、結他聲。你有冇試過掛住一個好耐冇返去嘅城市？\"", "嚟杯自家苦艾酒，加冰加橄欖。", "將呢份鄉愁撈落地中海金酒度。", "我而家淨係掛住瞓一覺好嘅。"]
      },
      ice_carving: {
        ca: ["\"Veus aquesta llança de gel? Tallada a mà d'un bloc congelat 72 hores. Ni una bombolla. El gel tèrbol es fon de pressa i espatlla la copa, com les converses amb presses espatllen les relacions.\"", "Molt profund, Wei. Posa-ho a prova amb el teu millor còctel.", "Acabes de comparar un glaçó amb la meva vida amorosa?", "Talla'n un altre: brindem per zero dilució."],
        yue: ["\"睇吓呢條手鑿冰柱，七十二個鐘慢慢結，入面一粒氣泡都冇。啲濁冰溶得快，會整淡杯酒，就好似傾偈太求其會整散段關係咁。\"", "Wei，咁有哲理？用你最好嗰杯嚟試吓呢舊冰。", "你係咪攞冰粒嚟比喻我段感情？", "再鑿多舊，為唔俾生活溝淡飲一杯。"]
      },
      corporate_origami: {
        ca: ["\"Un client s'ha deixat un dossier de 40 pàgines sobre «sinergies». N'he fet avions de paper i la Yuzu els ha enviat a la paperera. Vols un còctel que dissolgui l'argot d'oficina?\"", "Un Paper Plane, agitat amb ràbia.", "La propera vegada que la Yuzu em revisi el currículum.", "Un Negroni clàssic. A parts iguals, amarg i real."],
        yue: ["\"頭先有個熟客留低咗份四十頁嘅「協同賦能」簡報。我摺咗一半做紙飛機，柚子一爪拍晒入廢紙箱。想唔想要杯可以溶走公司術語嘅酒？\"", "Paper Plane，搖到佢震。", "下次帶埋份 CV，等柚子總監批吓。", "經典 Negroni，苦同真各佔一份。"]
      },
      vinyl_turntable: {
        ca: ["\"Sents aquest cruixit suau a 33 rpm? És una calidesa analògica que cap còdec digital pot imitar. L'agulla vibra, la vàlvula s'escalfa i la mitjanit de sobte té tres dimensions.\"", "Un highball d'Islay amb romaní fumat.", "Quan surti el sol, posa una bossa nova.", "Puja una mica el volum, Wei. Aquí estem segurs."],
        yue: ["\"聽唔聽到唱針嗰種沙沙聲？三十三轉，咩數碼都整唔到呢種溫度。唱針一震，膽機一熱，成個半夜都立體晒。\"", "嚟杯艾雷島威士忌 Highball，加煙燻迷迭香。", "天光嗰陣記得轉張 Bossa Nova。", "Wei，大聲少少啦，呢度好安全。"]
      },
      midnight_confessions: {
        ca: ["\"Diuen que els bàrmans saben més secrets que els confessors. Tranquil: aquesta barra de caoba és discreta. Què et pesa avui?\"", "Estic cansat de ser amable amb gent que no respecto.", "Res greu. Només m'alegro que aquest racó existeixi.", "He vingut a acaronar la Miso i beure vermut, no a fer teràpia!"],
        yue: ["\"人哋話調酒師聽過嘅秘密多過神父。放心，呢張酸枝吧枱好密實。今晚有咩心事？\"", "我好攰，成日要對住啲唔值得尊重嘅人扮笑。", "冇乜大不了，只係慶幸條巷尾仲有呢盞燈。", "我嚟係摸味噌同飲苦艾酒，唔係嚟做心理輔導㗎！"]
      },
      gesha_morning: {
        ca: ["\"Bon dia! El sol entra per la parra del pati. Acabo de calibrar un Gesha natural anaeròbic: préssec blanc i bergamota. Te'n faig una tassa?\"", "Sí, si us plau! Extracció lleugera, que surtin les flors.", "Necessito cafeïna de debò: un Dirty amb civada.", "Acompanya-ho amb un croissant acabat de fer."],
        yue: ["\"早晨！太陽啱啱穿過個葡萄棚。我頭先調好咗支厭氧日曬瑰夏，有白桃同佛手柑味。沖杯俾你？\"", "好呀！淺啲萃取，等啲花香出嚟。", "我要勁啲咖啡因：燕麥 Dirty。", "再配個啱啱焗好嘅牛角包。"]
      },
      courtyard_sparrows: {
        ca: ["\"Escolta els pardals a les teules grises. Els matins al hutong són l'únic moment en què la ciutat respira. A quin ritme vols començar?\"", "Lent i contemplatiu: cold brew amb tònica i cítrics.", "Ràpid i intens: doble espresso de Yunnan.", "Wei, la Miso i la Yuzu han tornat a robar grans?"],
        yue: ["\"聽吓瓦頂啲麻雀仔。胡同朝早係成個城市唯一抖到氣嘅時間。你想今日用咩速度開始？\"", "慢慢嚟：冷萃湯力加橙皮。", "快靚正：雲南雙份 espresso 一啖過。", "Wei，味噌同柚子係咪又偷咖啡豆？"]
      },
      ek43_hyperfixation: {
        ca: ["\"He passat dues hores abans de l'alba alineant les mòles de titani a 15 micres. Els amics diuen que necessito teràpia; jo dic que el seu cafè està subextret. Qui té raó?\"", "Tu, sens dubte. Posa'm un filtre de Baoshan.", "Les dues coses poden ser certes, Wei. Beu aigua.", "Tanta física fa que la crema sàpiga a caramel?"],
        yue: ["\"我天未光就用咗兩個鐘校磨豆機嘅鈦刀盤，準到十五微米。朋友話我要睇醫生；我話佢哋啲咖啡萃取不足。你話邊個啱？\"", "梗係你啱！嚟杯保山手沖。", "兩樣都啱嘅，Wei。飲啖水先啦。", "咁多微米物理，啲 crema 會唔會變焦糖味？"]
      },
      microfoam_theology: {
        ca: ["\"Mira aquesta llet: brillant com pintura fresca, microescuma de vellut sense ni una bombolla grossa. Pura física amb paciència matinal.\"", "Posa aquesta escuma en un tallat Barceloneta.", "Fes latte art! Una tulipa o una poteta de gat?", "Millor un Einspänner amb nata muntada a mà."],
        yue: ["\"睇吓呢啲打好嘅奶：滑到好似啱啱油完嘅白漆，一粒粗泡都冇。打奶係物理學加朝早嘅耐性。\"", "將呢啲奶泡倒落一杯巴塞隆拿 Cortado。", "拉個花睇吓！鬱金香定貓爪？", "不如整杯維也納咖啡，加手打忌廉。"]
      },
      gaudi_courtyard: {
        ca: ["\"Les ombres del matí a les rajoles del pati semblen el trencadís del Park Güell. Avui hi ha una calidesa ben catalana.\"", "Un tallat Barceloneta amb mel i pell de taronja.", "Un Gesha floral per acompanyar el mosaic.", "Deixa que la Yuzu dormi a la pedra més assolellada."],
        yue: ["\"朝早啲樹影照落院子地磚，好似巴塞隆拿桂爾公園啲馬賽克。今日個院子有陣地中海陽光味。\"", "嚟杯橙皮蜂蜜 Cortado。", "沖杯花香瑰夏，襯吓呢片陽光。", "等柚子霸住最暖嗰級石階瞓覺啦。"]
      },
      book_corner_lamp: {
        ca: ["\"Veus el llum encara encès a l'altra banda de la tanca? És el racó de llibres del costat. Algunes nits la gent entra amb un llibre que acaba de trobar allà i el llegeix a la barra fins que tanquem. El millor tipus de client.\"", "Llavors posa'm alguna cosa que duri un capítol.", "Vaig a buscar un llibre i torno de seguida.", "La Miso i la Yuzu tenen carnet de biblioteca?"],
        yue: ["\"見唔見籬笆嗰邊盞燈仲著住？嗰度係隔籬嘅二手書角。有啲夜晚，啲人啱啱喺嗰邊執到本書，就過嚟坐喺吧枱一路睇到收舖。呢種熟客最正。\"", "噉就俾杯夠我慢慢睇完一章嘅酒。", "我過去揀本書，即刻返嚟。", "味噌同柚子有冇借書證㗎？"]
      },
      book_corner_next_door: {
        ca: ["\"Ja has anat a la casa del costat? Pàgines Manllevades, els llibres de segona mà. Quatre estancetes de les golfes al soterrani, i cada llibre porta una nota a dins. La Yuzu salta la tanca del jardí gairebé cada tarda i s'adorm sobre la poesia.\"", "Després d'aquest cafè hi passo a canviar un llibre.", "Tornaré la Yuzu, amb un cafè de filtre com a rescat.", "Wei, quin llibre deixaries tu als seus prestatges?"],
        yue: ["\"去過隔籬未？借來的書，賣二手書嘅。由閣樓到地庫一共四間細房，每本書入面都夾住張字條。柚子差唔多每日下晝都跳過花園牆走過去，瞓喺啲詩集上面。\"", "飲完呢杯就過去換本書。", "我去帶柚子返嚟，順手拎杯手沖做贖金。", "Wei，你會留邊本書喺佢哋個書架？"]
      },
      cat_burlap_inspection: {
        ca: ["\"A les set ha arribat un sac de cafè rentat de Huila, Colòmbia. La Miso s'hi ha adormida a sobre i la Yuzu ha olorat cada racó. Control de qualitat felí certificat!\"", "Fes el gra que els gats hagin aprovat.", "Dona un premi a la Miso i la Yuzu per la feina.", "Un Einspänner mentre els gats dormen."],
        yue: ["\"七點啱啱送到一包哥倫比亞水洗生豆。味噌即刻瞓咗上去，柚子就逐個角落索晒。正宗貓爪品質檢定！\"", "沖杯兩位貓主管批准咗嘅豆。", "俾啲零食兩位辛苦嘅貓員工。", "趁佢哋瞓緊，嚟杯維也納咖啡。"]
      },
      corporate_refuge: {
        ca: ["\"Són les 8:45. A fora, la gent corre cap al metro amb cara de dilluns. Pren-te el teu temps darrere aquesta porta: la feina pot esperar quinze minuts.\"", "Gràcies, Wei. Un Dirty de civada per començar.", "Un croissant tebi i matcha cerimonial.", "Poso l'estat a Slack: «Meditant al hutong»."],
        yue: ["\"而家八點三個字。出面大街啲人衝去搭地鐵，個樣好似返緊刑場。喺呢度坐多陣啦，份工可以等十五分鐘㗎。\"", "多謝 Wei。燕麥 Dirty 穩住先。", "暖暖地個牛角包，加碗抹茶。", "我將 Slack 狀態改做「胡同冥想中」。"]
      },
      yunnan_honey_roast: {
        ca: ["\"Aquest lot honey de Baoshan, Yunnan, es va torrar fa quatre dies. Té una dolçor de caqui sec, mel silvestre i fum de muntanya. Vols ensumar el cafè mòlt?\"", "Sí! Mol-lo i fes-lo al V60 de ceràmica.", "En podem fer un cold brew amb tònica?", "Posa'm una llauna de gra per emportar."],
        yue: ["\"呢批雲南保山蜜處理豆四日前啱啱焙好，有柿餅、野蜂蜜同山木煙味。聞吓啲粉先？\"", "好香！用陶瓷 V60 沖。", "可唔可以整杯有氣嘅柑橘冷萃？", "幫我磅一罐原豆帶走。"]
      }
    };

    // [name, sub, desc]
    const DRINK_CA = {
      jasmine_gulou: ["G&T de gessamí de la Torre Gulou", "Te de gessamí de Pequín • Boira d'osmant • Gel cristal·lí", "\"Gin amb te verd de gessamí infusionat en fred, soda d'osmant i un cruixent d'arç.\""],
      catalan: ["La Rosa i el Mar", "Botànics de Barcelona • Pètals de Sant Jordi • Tònica mediterrània", "\"Romaní mediterrani, notes d'oliva arbequina i pètals de rosa de Sant Jordi surant.\""],
      catalan_vermut: ["Vermut de la casa del Gòtic", "Vermut negre d'herbes • Oliva gordal • Rodanxa de taronja", "\"Vermut negre artesà sobre un bloc de gel, amb un tall de taronja i una oliva.\""],
      kyoto: ["G&T Boira de Kyoto amb shiso", "Gin Ki No Bi • Te verd i bambú • Shiso picat a mà", "\"Fulla de shiso, destil·lat de te verd i pebre sansho sobre una llança de gel.\""],
      oldfashioned: ["Old Fashioned de sègol", "Sègol • Sucre demerara • Pell flamejada", "\"Got baix amb pell de taronja flamejada, xarop demerara i amargs envellits.\""],
      negroni: ["Negroni clàssic", "Agredolç 1:1:1 • Campari i vermut", "\"Parts iguals de gin sec, aperitiu amarg italià i vermut dolç, remenat amb gel.\""],
      paperplane: ["Paper Plane nocturn", "Acidesa viva • Bourbon i Amaro Nonino", "\"Agitat amb força en copa coupé, amb llimona, Aperol i Amaro Nonino.\""],
      smoked_rosemary: ["Highball d'Islay amb romaní fumat", "Whisky torbat • Romaní torrat • Soda a pressió", "\"Whisky fumat d'Islay amb soda molt gasosa i una branqueta de romaní cremada al moment.\""],
      sazerac: ["Sazerac de Nova Orleans", "Sègol • Esbandida d'absenta • Peychaud's • Llimona", "\"Got baix glaçat i perfumat amb absenta, sègol remenat i amargs criolls, sense gel.\""],
      last_word: ["L'Última Paraula", "Parts iguals • Chartreuse verd • Marrasquí • Llima", "\"Un clàssic de la Llei Seca a parts iguals: herbes alpines punyents i cirera.\""],
      penicillin: ["Penicil·lina", "Scotch de mescla • Mel i gingebre • Capa de torba", "\"Llimona, xarop de mel i gingebre i whisky suau, coronat amb un vel d'Islay fumat.\""],
      boulevardier: ["Boulevardier 1927", "Bourbon • Campari • Vermut dolç", "\"El cosí parisenc del Negroni: bourbon en lloc de gin, més rodó i acaramelat.\""],
      corpse_reviver_2: ["Corpse Reviver núm. 2", "Gin • Lillet Blanc • Cointreau • Llimona • Absenta", "\"Quatre seguits tornen a matar el difunt. Pàl·lid, lluminós i elèctric.\""],
      aviation: ["Aviation", "Crema de violeta • Marrasquí • Gin • Llimona", "\"Un blau cel nostàlgic dels hotels d'abans de la guerra, amb violeta i cirera.\""],
      manhattan_rye: ["Manhattan de sègol", "Sègol 100 proof • Vermut dolç • Angostura • Cirera", "\"La reina dels remenats: sègol especiat, vermut d'herbes i una cirera Luxardo.\""],
      clover_club: ["Clover Club 1896", "Gin • Xarop de gerds • Vermut sec • Escuma sedosa", "\"Un clàssic dels clubs de Filadèlfia: gin agitat amb gerds i clara d'ou.\""],
      gesha_pourover: ["Gesha natural anaeròbic (V60)", "Etiòpia Guji • Floral de gessamí • Préssec blanc", "\"Extret en V60 de ceràmica a 91 °C. Dolçor floral i acidesa de fruita de pinyol.\""],
      dirty_espresso: ["Dirty de civada del hutong", "Ristretto doble de Yunnan • Crema de civada freda", "\"Espresso calent directament sobre crema de civada gelada. Les capes es fonen glop a glop.\""],
      barceloneta_cortado: ["Tallat Barceloneta de mel i taronja", "Mel de flors • Espresso i llet 1:1 • Oli de taronja", "\"Tallat sobre mel de flors, amb microescuma perfumada de pell de taronja.\""],
      yunnan_honey_pour: ["Filtre honey de Baoshan, Yunnan", "1800 m • Caqui sec • Bresca i cacau", "\"Lot honey d'alta muntanya. Dolçor llarga de caqui sec i mel silvestre.\""],
      croissant_combo: ["Croissant de mantega i flat white", "72 capes de full • Microescuma de vellut", "\"Croissant francès acabat de fer amb un flat white sedós de notes de cacau.\""],
      coldbrew_tonic: ["Cold brew amb tònica i cítrics", "Infusió freda de 18 h • Tònica de yuzu • Aranja seca", "\"Cafè infusionat en fred 18 hores amb tònica de yuzu. Refrescant de veritat.\""],
      einspanner: ["Einspänner vienès", "Americano intens • Nata de vainilla • Sucre morè", "\"Cafè fosc coronat amb un núvol de nata freda a la vainilla i cacau.\""],
      matcha_cloud: ["Latte núvol de matcha d'Uji", "Primera collita d'Uji • Llet de civada • Batut amb chasen", "\"Matcha cerimonial batut a mà en escuma maragda, sobre llet de civada freda.\""],
      wei_notebook: ["La llibreta d'en Wei (fora de carta)", "Te de gessamí • Mel d'osmant • Pell de taronja • Una nota doblegada", "\"Només per als amics. Sota el sotagot, una nota amb la lletra d'en Wei: «Aquí sempre tens lloc.»\""]
    };

    // Same shape as WeiText; strings slot in as the language's value.
    const WEI_PATCH = {
      ca: {
        ui: {
          gift: "🎁 Regal", 
          back: "← Tornar", another: "🎲 Una altra endevinalla", serveAnyway: "Posa-me-la igualment", tellWei: "DIGUES-LI:",
          love: "😍 Perfecte", meh: "🤔 Curiós…", strong: "🥵 Massa fort!", tapSkip: "▸ toca per saltar", 
          laugh: "😂 Ha!", groan: "🙄 Uf"
        },
        chatIntro: ["\"Pregunta. Tinc un drap, un got per polir i tot el temps del món.\"", "\"La conversa és la millor guarnició. Què vols saber?\""],
        chatTopics: [
          { label: "Sobre tu", lines: ["\"Jo? Vaig estudiar dinàmica de fluids tres anys. Ara només l'aplico a l'escuma de llet i al gel. El meu professor ploraria.\"", "\"Faig dos torns: cafè de dia, còctels de nit. Dormo als forats, normalment sobre aquesta barra.\"", "\"La meva beguda preferida? Un te de gessamí a les cinc del matí, després de tancar. No ho diguis als habituals.\""] },
          { label: "Els gats", lines: ["\"Algú va deixar una caixa a la porta de la botiga de la Popo: «MISO / YUZU, pots de conserva, fràgil», amb dues gatetes a dins. Jo tenia deu anys i els vaig posar els noms de l'etiqueta. Des d'aleshores manen elles.\"", "\"La Yuzu és la cap de seguretat. Els seus mètodes: seure sobre la carta i jutjar-te.\"", "\"La Miso només ha tirat una ampolla de l'estant. La més barata. Sospito que té bon gust.\""] },
          { label: "Les teves ulleres", lines: ["\"Mercat de Panjiayuan. Vint iuans. Han sobreviscut al vapor, a la coctelera i a un gat massa entusiasta.\"", "\"Sí, s'entelen cada cop que escalfo llet. No, no em posaré lents. El baf forma part de l'ofici.\"", "\"Les ulleres rodones fan que tothom sembli de fiar. El truc més vell del gremi.\""] },
          { label: "Pequín", lines: ["\"Pequín a l'octubre és la seva millor versió. Cel blau, ginkgos daurats i el del jianbing del carreró de bon humor.\"", "\"La meva família és a Barcelona: la Popo, la meva mare i mig barri de clients de l'antiga botiga de fideus. Encara poso pell de taronja a tot. És una condició.\"", "\"Camina cap al nord a trenc d'alba i sentiràs els avis amb les gàbies d'ocells a la Torre del Tambor. El millor concert gratuït de la ciutat.\""] },
          { label: "Explica'm un acudit" },
          { label: "Els teus secrets", lines: ["\"Com que ets habitual: el gel «tallat a mà»? La Miso el supervisa. Aquest mes ha rebutjat quatre blocs.\"", "\"Gairebé no obro aquest local. La nit abans de signar el lloguer, la Miso i la Yuzu es van ficar a la seva vella caixa de MISO / YUZU i s'hi van adormir. M'ho vaig prendre com un senyal.\"", "\"Escric una línia en una llibreta per cada habitual. La teva diu... no. Encara no.\""] },
          { label: "Alguna cosa fora de carta" },
          { label: "Què vas escriure sobre mi?", lines: ["\"*obre la llibreta gastada* «Va entrar fugint del fred. Es va quedar per la conversa. Mima els gats. Bona persona.» ...No ho facis estrany.\""] }
        ],
        sleepPokes: ["*ronc* ...cinc minuts més, Miso...", "*murmura* ...el gel... seixanta mil·límetres..."],
        grumpyWake: "Ah! Ja estic despert! Només... descansava la vista. Professionalment.",
        reactions: {
          love: ["*somriure d'orgull* Per aquesta cara treballo.", "Perfecte, eh? No ho diguis als gats, que demanaran un augment.", "Ho apunto: «té un gust excel·lent»."],
          meh: ["«Curiós.» La paraula més perillosa de l'hostaleria. La propera vegada ajusto la proporció.", "Hm. Sinceritat. La ciència és iterativa."],
          strong: ["Massa fort? *t'acosta aigua* La hidratació és la veritable guarnició.", "Se m'ha escapat la mà. O el cor. Té, una galeta."]
        },
        jokeRate: { laugh: "Per fi, un públic que m'aprecia.", groan: "El sospir vol dir que ha funcionat." },
        riddleIntro: ["\"Hora d'endevinalles. Jo dic què porta i tu em dius la copa. Si l'encertes, convida la casa:\"", "\"Posem a prova el teu paladar. Què faig amb això?\""],
        riddleRight: ["\"Correcte! Algú s'ha llegit la carta. Aquesta convida la casa.\"", "\"Ha! Exacte. Yuzu, toca la campaneta.\""],
        gifts: [
          { label: "Vinil", line: "Una primera edició?! Això sona ara mateix. *canvia el disc*" },
          { label: "Osmant", line: "Osmant! Va directe a l'almívar d'avui. Olora això." },
          { label: "Cafè en gra", line: "*inspira fons* ...Torno a estar viu. Energia recuperada." },
          { label: "Premis gatuns", line: "Per a les caps? La Miso i la Yuzu t'ho agraeixen. Jo només sóc el personal." },
          { label: "Mandarina", line: "Mira: la pelo en una espiral perfecta. ...Fet." },
          { label: "Pastís de lluna", line: "Ah... un pastís de lluna. La festa de la Lluna va ser fa setmanes. En tinc onze. ...Gràcies. De debò." }
        ],
        giftIntro: "\"Un regal? Per a mi? No calia. ...Què és?\"",
        giftLimit: "\"Avui ja m'has mimat prou. Guarda una mica de generositat per a la propera.\"",
        usual: "El de sempre? Marxant.",
        offmenu: "\"*abaixa la veu* D'acord. Només per a tu. No ho diguis a la Yuzu.\""
      },

      yue: {
        ui: {
          gift: "🎁 送禮", 
          back: "← 返轉頭", another: "🎲 再估過", serveAnyway: "照樣嚟一杯", tellWei: "同 Wei 講：",
          love: "😍 正", meh: "🤔 幾特別…", strong: "🥵 好勁！", tapSkip: "▸ 撳一下跳過", 
          laugh: "😂 哈！", groan: "🙄 好凍"
        },
        chatIntro: ["\"問啦。我有條毛巾、一隻杯要抹，同埋大把時間。\"", "\"傾偈係最好嘅裝飾。想知咩？\""],
        chatTopics: [
          { label: "講吓你", lines: ["\"我？讀咗三年流體力學，而家淨係用嚟研究奶泡同冰溶得幾快。我教授知道實喊。\"", "\"我返兩份工：日頭咖啡，夜晚調酒。瞓覺就塞喺罅隙度，通常喺呢張吧枱。\"", "\"最鍾意飲咩？講真，收工之後凌晨五點嗰杯茉莉花茶。唔好話俾啲熟客知。\""] },
          { label: "兩隻貓", lines: ["\"有人喺婆婆間舖門口放低個箱：「MISO / YUZU，醃菜樽，小心輕放」，入面有兩隻細貓。嗰年我十歲，就跟住張標籤改咗名。之後成間舖都係佢哋話事。\"", "\"柚子係保安主管。佢嘅做法包括坐喺餐牌上面，用眼神審判你。\"", "\"味噌淨係推跌過一枝酒，仲要係最平嗰枝。我懷疑佢好識貨。\""] },
          { label: "你副眼鏡", lines: ["\"潘家園舊貨市場買嘅，二十蚊。捱過蒸氣棒、雪克杯，仲有一隻過份熱情嘅貓。\"", "\"係，打奶嗰陣成日起霧。唔會，我唔會轉戴隱形。起霧都係手藝嘅一部份。\"", "\"圓框眼鏡令人睇落好可靠。調酒界最老嘅招數。\""] },
          { label: "北京", lines: ["\"十月嘅北京係佢最好嘅樣：藍天、銀杏黃，巷口賣煎餅嘅大叔心情都特別好。\"", "\"我屋企人都喺巴塞隆拿：婆婆、我阿媽，仲有半條街以前麵舖嘅老街坊。而家咩都想加啲橙皮。後遺症嚟㗎。\"", "\"天光往北行，鼓樓旁邊有班阿伯遛雀，嗰度係全城最好嘅免費音樂會。\""] },
          { label: "講個笑話" },
          { label: "你嘅秘密", lines: ["\"既然你係熟客：嗰啲「手鑿冰」？係味噌監工嘅，今個月佢已經彈咗四舊。\"", "\"我差啲冇開呢間舖。簽租約前一晚，味噌同柚子鑽咗入佢哋個寫住 MISO / YUZU 嘅舊箱度瞓著咗，我當佢係個兆頭。\"", "\"每個熟客我都喺本簿度寫一句。你嗰句係……唔得，未講得住。\""] },
          { label: "嚟杯餐牌冇嘅" },
          { label: "你喺簿度寫咗我咩？", lines: ["\"*揭開本殘殘舊舊嘅簿* 「由寒風入面行入嚟，為咗傾偈留低，會請貓食嘢。好人。」……唔好搞到咁肉麻。\""] }
        ],
        sleepPokes: ["*鼻鼾* ……多五分鐘，味噌……", "*喃喃自語* ……啲冰……要六十毫米……"],
        grumpyWake: "嘩！醒咗醒咗！我只係……專業咁閉目養神。",
        reactions: {
          love: ["*有啲驕傲咁笑* 我就係為咗你呢個表情開工。", "正？唔好話俾兩隻貓知，佢哋會要求加人工。", "記低咗：「好有品味」。"],
          meh: ["「幾特別」——飲食業最危險嘅三個字。下次我調返個比例。", "嗯，好坦白。科學就係要不斷改良。"],
          strong: ["太勁？*推杯水過嚟* 飲水先係最好嘅裝飾。", "手快咗，又或者心軟咗。嚟，食塊梳打餅。"]
        },
        jokeRate: { laugh: "終於有個識欣賞我嘅觀眾。", groan: "你嘆氣即係個笑話成功咗。" },
        riddleIntro: ["\"估吓先。我講材料，你講酒名。估中呢杯我請：\"", "\"考吓你條脷。我用呢啲整緊咩？\""],
        riddleRight: ["\"啱晒！有人偷偷背咗我個餐牌。呢杯我請。\"", "\"哈！完全正確。柚子，搖吓個鈴。\""],
        gifts: [
          { label: "黑膠", line: "初版黑膠？！即刻播。*換碟*" },
          { label: "桂花", line: "桂花！今晚就煲落糖漿度。你聞吓。" },
          { label: "咖啡豆", line: "*深深吸一啖* ……我返魂喇。精神恢復。" },
          { label: "貓零食", line: "俾兩位老細嘅？味噌同柚子多謝你。我只係打工仔。" },
          { label: "砂糖橘", line: "睇住：我一圈剝晒佢。……完美。" },
          { label: "月餅", line: "啊……月餅。中秋過咗幾個禮拜，我仲有十一個。……多謝，真心嘅。" }
        ],
        giftIntro: "\"送嘢俾我？唔使咁客氣……係咩嚟㗎？\"",
        giftLimit: "\"今日你已經寵夠我喇，留返啲下次先。\"",
        usual: "照舊？即刻嚟。",
        offmenu: "\"*壓低聲* 好啦，淨係整俾你。唔好話俾柚子知。\""
      }
    };

    /* ---------------- apply patches ---------------- */
    function isLangObj(o) { return o && typeof o === 'object' && !Array.isArray(o) && typeof o.en === 'string'; }
    function mergeLang(target, patch, lang) {
      if (patch == null || target == null) return;
      if (typeof patch === 'string') { if (isLangObj(target)) target[lang] = patch; return; }
      if (Array.isArray(patch)) { patch.forEach((p, i) => mergeLang(target[i], p, lang)); return; }
      Object.keys(patch).forEach(k => {
        const p = patch[k];
        if (typeof p === 'string' && isLangObj(target[k])) target[k][lang] = p;
        else if (typeof p === 'string' && target[k] == null) { /* nothing to attach to */ }
        else mergeLang(target[k], p, lang);
      });
    }

    (function applyContentPatches() {
      [...BarTopicPool, ...CafeTopicPool].forEach(t => {
        const p = TOPIC_PATCH[t.id];
        if (!p) return;
        Object.entries(p).forEach(([lang, arr]) => {
          t.text[lang] = arr[0];
          t.options.forEach((o, i) => { if (arr[i + 1]) o.label[lang] = arr[i + 1]; });
        });
      });
      Object.entries(DRINK_CA).forEach(([k, arr]) => {
        const d = DrinkManifest[k];
        if (!d) return;
        d.name.ca = arr[0]; d.sub.ca = arr[1]; d.desc.ca = arr[2];
      });
      Object.entries(WEI_PATCH).forEach(([lang, patch]) => mergeLang(WeiText, patch, lang));
    })();
  
