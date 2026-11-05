/* Home Ground · the pieces. Nearby's places, re-read as the ways a family, or a group of friends, look after each other.
   Each: k (the piece's own key; also the Nearby key unless pl says otherwise), pl (the Nearby place it stands for, if not k),
   ic (the pixel icon), th (show · say · care · fun), t (the piece, in plain words), d (what it looks like), q (one honest
   question for everyone), go (where one fits: a Nearby place, or Little Things, that does it for real).
   Five languages: en · zh · zh-Hant · es · ca. */
window.HG_THEMES = {
  show: ["Showing up", "常来常往", "常來常往", "Estar ahí", "Ser-hi"],
  say: ["Saying it", "说出口", "說出口", "Decirlo", "Dir-ho"],
  care: ["Looking after", "照顾彼此", "照顧彼此", "Cuidarnos", "Cuidar-nos"],
  fun: ["Having fun", "一起开心", "一起開心", "Pasarlo bien", "Passar-ho bé"],
  plain: ["Paths & trees", "路和树", "路和樹", "Caminos y árboles", "Camins i arbres"]
};
/* where a piece can be done for real: a Nearby place key (opened in the town) or "lt" (Little Things) */
window.HG_GO = {
  lt: { href: "/little-things/", n: ["Little Things", "小事", "小事", "Cosas pequeñas", "Petites coses"] }
};
window.HG_PIECES = [
  /* ---- showing up ---- */
  { k: "bar", ic: "bar", th: "show",
    t: ["The Sunday catch-up", "周日的家常", "週日的家常", "La charla del domingo", "La xerrada del diumenge"],
    d: ["A regular call, or coffee at the kitchen table: nobody needs a reason to drop in.", "固定的一通电话，或厨房桌边的一杯咖啡：来串门不需要理由。", "固定的一通電話，或廚房桌邊的一杯咖啡：來串門不需要理由。", "Una llamada fija, o un café en la mesa de la cocina: nadie necesita excusa para pasarse.", "Una trucada fixa, o un cafè a la taula de la cuina: ningú no necessita excusa per passar-hi."],
    q: ["Who can we drop in on without calling first, and who could drop in on us?", "我们可以不打招呼就去谁家坐坐？谁又能这样来我们家？", "我們可以不打招呼就去誰家坐坐？誰又能這樣來我們家？", "¿A casa de quién podemos pasarnos sin avisar, y quién podría pasarse por la nuestra?", "A casa de qui podem passar sense avisar, i qui podria passar per la nostra?"] },
  { k: "restaurant", ic: "restaurant", th: "show", go: "restaurant",
    t: ["Dinner, just the two of you", "两个人的晚饭", "兩個人的晚飯", "Una cena, solo vosotros dos", "Un sopar, només vosaltres dos"],
    d: ["Your mum, your sister, an old friend: two at a table, phones face down.", "妈妈、姐姐、老朋友：两个人一张桌，手机扣在桌上。", "媽媽、姐姐、老朋友：兩個人一張桌，手機扣在桌上。", "Tu madre, tu hermana, una vieja amiga: dos en una mesa, el móvil boca abajo.", "La teva mare, la teva germana, una vella amiga: dos a una taula, el mòbil de cap per avall."],
    q: ["Who haven't you had dinner with, just the two of you, in far too long?", "你已经太久没和谁单独吃过一顿饭了？", "你已經太久沒和誰單獨吃過一頓飯了？", "¿Con quién hace demasiado que no cenas, solo vosotros dos?", "Amb qui fa massa temps que no sopes, només vosaltres dos?"] },
  { k: "party", ic: "balloon", th: "show", go: "party",
    t: ["The get-together that actually happens", "真的会兑现的聚会", "真的會兌現的聚會", "La quedada que se hace de verdad", "La trobada que es fa de debò"],
    d: ["A date, a host, someone bringing dessert. Not just “we should meet up soon”.", "有日子、有人做东、有人带甜点。不只是一句“改天聚聚”。", "有日子、有人作東、有人帶甜點。不只是一句「改天聚聚」。", "Una fecha, alguien que invita, alguien que trae el postre. No solo «a ver si quedamos».", "Una data, algú que convida, algú que porta les postres. No només «a veure si quedem»."],
    q: ["The last time we said “we should all get together”, what happened?", "上一次我们说“改天大家聚聚”，后来呢？", "上一次我們說「改天大家聚聚」，後來呢？", "La última vez que dijimos «a ver si quedamos todos», ¿qué pasó?", "L'última vegada que vam dir «a veure si quedem tots», què va passar?"] },
  { k: "train", ic: "train", th: "show", go: "restaurant",
    t: ["The one who lives far away", "住得最远的那个人", "住得最遠的那個人", "Quien vive lejos", "Qui viu lluny"],
    d: ["The cousin in another city, the friend who moved abroad: still in on the jokes.", "在另一座城市的表姐，搬到国外的朋友：家里的笑话，他们也听得懂。", "在另一座城市的表姐，搬到國外的朋友：家裡的笑話，他們也聽得懂。", "La prima de otra ciudad, la amiga que se fue al extranjero: siguen pillando las bromas.", "La cosina d'una altra ciutat, l'amiga que se'n va anar a l'estranger: encara entenen les bromes."],
    q: ["Who lives furthest from the rest of us, and what news never reaches them?", "我们之中谁住得最远？有哪些消息总是传不到他们那里？", "我們之中誰住得最遠？有哪些消息總是傳不到他們那裡？", "¿Quién vive más lejos del resto, y qué noticias nunca le llegan?", "Qui viu més lluny de la resta, i quines notícies no li arriben mai?"] },
  { k: "plaza", ic: "plaza", th: "show",
    t: ["Everyone at the big table", "一大桌人", "一大桌人", "Todos en la mesa grande", "Tots a la taula gran"],
    d: ["The holidays, the long lunch: room for Grandma's stories, and the quiet cousin's too.", "过节、长长的午饭：外婆的故事有位置，安静表弟的话也有。", "過節、長長的午飯：外婆的故事有位置，安靜表弟的話也有。", "Las fiestas, la comida larga: sitio para las historias de la abuela, y para las del primo callado.", "Les festes, el dinar llarg: lloc per a les històries de l'àvia, i per a les del cosí callat."],
    q: ["At the big table, who does all the talking, and who never gets a word in?", "一大桌人吃饭时，谁一直在说？谁总插不上话？", "一大桌人吃飯時，誰一直在說？誰總插不上話？", "En la mesa grande, ¿quién habla todo el rato y quién nunca consigue meter baza?", "A la taula gran, qui parla tota l'estona i qui no aconsegueix mai dir-hi la seva?"] },
  /* ---- saying it ---- */
  { k: "postcard", ic: "postcard", th: "say", go: "postcard",
    t: ["The birthday nobody forgets", "没人会忘的生日", "沒人會忘的生日", "El cumpleaños que nadie olvida", "L'aniversari que ningú no oblida"],
    d: ["A card, a call, a voice note: someone remembers, every single year.", "一张卡片、一通电话、一段语音：每年都有人记得。", "一張卡片、一通電話、一段語音：每年都有人記得。", "Una tarjeta, una llamada, un audio: alguien se acuerda, todos los años.", "Una postal, una trucada, un àudio: algú se'n recorda, cada any."],
    q: ["Whose birthday did we nearly miss this year, and who always remembers ours?", "今年我们差点忘了谁的生日？又是谁总记得我们的？", "今年我們差點忘了誰的生日？又是誰總記得我們的？", "¿De quién casi se nos pasa el cumpleaños este año, y quién se acuerda siempre del nuestro?", "De qui gairebé se'ns passa l'aniversari aquest any, i qui se'n recorda sempre del nostre?"] },
  { k: "kintsugi", ic: "kintsugi", th: "say",
    t: ["Making up after a row", "吵完架之后和好", "吵完架之後和好", "Hacer las paces después de una bronca", "Fer les paus després d'una baralla"],
    d: ["Saying sorry, saying what hurt, and still coming to Sunday lunch.", "说声对不起，说出哪里受伤了，周日的饭照样来吃。", "說聲對不起，說出哪裡受傷了，週日的飯照樣來吃。", "Pedir perdón, decir qué dolió, y venir igualmente a comer el domingo.", "Demanar perdó, dir què va fer mal, i venir igualment a dinar diumenge."],
    q: ["Is there a row among us that nobody has mended yet?", "我们之间，有没有一场架到现在还没人去补？", "我們之間，有沒有一場架到現在還沒人去補？", "¿Hay alguna bronca entre nosotros que nadie ha arreglado todavía?", "Hi ha alguna baralla entre nosaltres que ningú no ha adobat encara?"] },
  { k: "jukebox", ic: "jukebox", th: "say",
    t: ["Letting each other finish", "让对方把话说完", "讓對方把話說完", "Dejar que el otro termine", "Deixar que l'altre acabi"],
    d: ["Hearing Dad's story to the end before correcting it. Again.", "爸爸讲故事时，先听他讲完，再去纠正他。又一次。", "爸爸講故事時，先聽他講完，再去糾正他。又一次。", "Escuchar la historia de papá hasta el final antes de corregirla. Otra vez.", "Escoltar la història del pare fins al final abans de corregir-la. Un altre cop."],
    q: ["When we disagree, do we hear the other half of the story before we answer?", "意见不合时，我们会先听完另一半的故事再开口吗？", "意見不合時，我們會先聽完另一半的故事再開口嗎？", "Cuando no estamos de acuerdo, ¿escuchamos la otra mitad de la historia antes de contestar?", "Quan no estem d'acord, escoltem l'altra meitat de la història abans de contestar?"] },
  { k: "brewery", ic: "brewery", th: "say",
    t: ["Raising a glass to someone", "为一个人举杯", "為一個人舉杯", "Brindar por alguien", "Brindar per algú"],
    d: ["Thanks out loud, at the table, to whoever quietly keeps us all going.", "在饭桌上，大声谢谢那个默默撑着大家的人。", "在飯桌上，大聲謝謝那個默默撐著大家的人。", "Dar las gracias en voz alta, en la mesa, a quien nos sostiene a todos sin decir nada.", "Donar les gràcies en veu alta, a taula, a qui ens sosté a tots sense dir res."],
    q: ["Who looks after all of us, and when did anyone last raise a glass to her?", "谁在照顾我们所有人？上一次有人为她举杯，是什么时候？", "誰在照顧我們所有人？上一次有人為她舉杯，是什麼時候？", "¿Quién nos cuida a todos, y cuándo brindó alguien por ella por última vez?", "Qui ens cuida a tots, i quan va brindar algú per ella per últim cop?"] },
  { k: "hall", ic: "hall", th: "say",
    t: ["The family news", "家里的消息", "家裡的消息", "Las noticias de casa", "Les notícies de casa"],
    d: ["The good news and the hard news both get told, and to everyone.", "好消息和难过的消息都会说出来，而且每个人都知道。", "好消息和難過的消息都會說出來，而且每個人都知道。", "Las buenas noticias y las difíciles se cuentan, y a todos.", "Les bones notícies i les difícils s'expliquen, i a tothom."],
    q: ["Who always hears our news last, and who never tells anyone theirs?", "谁总是最后一个知道我们的消息？谁从不说自己的事？", "誰總是最後一個知道我們的消息？誰從不說自己的事？", "¿A quién le llegan siempre tarde nuestras noticias, y quién no cuenta nunca las suyas?", "A qui li arriben sempre tard les nostres notícies, i qui no explica mai les seves?"] },
  /* ---- looking after ---- */
  { k: "climb", ic: "climb", th: "care",
    t: ["Who you call at 3 a.m.", "凌晨三点打给谁", "凌晨三點打給誰", "A quién llamas a las tres de la mañana", "A qui truques a les tres de la matinada"],
    d: ["Someone who picks up whatever the hour, and holds the rope.", "不管几点都会接电话、帮你拉住绳子的人。", "不管幾點都會接電話、幫你拉住繩子的人。", "Alguien que contesta a cualquier hora y te sujeta la cuerda.", "Algú que contesta a qualsevol hora i t'aguanta la corda."],
    q: ["Who would you call at 3 a.m., and do they know it's them?", "凌晨三点你会打给谁？他们知道是自己吗？", "凌晨三點你會打給誰？他們知道是自己嗎？", "¿A quién llamarías a las tres de la mañana? ¿Lo sabe?", "A qui trucaries a les tres de la matinada? Ho sap?"] },
  { k: "sanctuary", ic: "sanctuary", th: "care", go: "lt",
    t: ["Looking out for the older ones", "照看家里的老人", "照看家裡的長輩", "Cuidar de los mayores", "Cuidar els grans"],
    d: ["Grandma's shopping, a lift to the doctor, the call she waits for on Sundays.", "帮外婆买菜，陪她去看医生，还有她每个周日都在等的那通电话。", "幫外婆買菜，陪她去看醫生，還有她每個週日都在等的那通電話。", "La compra de la abuela, llevarla al médico, la llamada que espera cada domingo.", "La compra de l'àvia, acompanyar-la al metge, la trucada que espera cada diumenge."],
    q: ["Who's getting older among us, and who's quietly doing all the looking after?", "我们之中谁在慢慢变老？又是谁在默默照顾着？", "我們之中誰在慢慢變老？又是誰在默默照顧著？", "¿Quién se está haciendo mayor, y quién se está encargando de todo sin decir nada?", "Qui s'està fent gran, i qui se n'està encarregant de tot sense dir res?"] },
  { k: "garden", ic: "garden", th: "care",
    t: ["Welcoming someone new", "欢迎新的家人", "歡迎新的家人", "Recibir a alguien nuevo", "Rebre algú nou"],
    d: ["A partner, a baby, a new flatmate: a seat at the table and someone to show them round.", "新的另一半、刚出生的宝宝、新室友：饭桌上有个位子，也有人带着熟悉。", "新的另一半、剛出生的寶寶、新室友：飯桌上有個位子，也有人帶著熟悉。", "Una pareja, un bebé, una compañera de piso nueva: un sitio en la mesa y alguien que le enseñe todo.", "Una parella, un nadó, una companya de pis nova: un lloc a taula i algú que li ensenyi tot."],
    q: ["Who joined us lately, and do they feel like one of us yet?", "最近谁加入了我们？他们觉得自己是自家人了吗？", "最近誰加入了我們？他們覺得自己是自家人了嗎？", "¿Quién ha llegado hace poco, y se siente ya uno de los nuestros?", "Qui ha arribat fa poc, i ja se sent un dels nostres?"] },
  { k: "books", ic: "books", th: "care",
    t: ["Passing things down", "把东西传下去", "把東西傳下去", "Lo que pasa de mano en mano", "El que passa de mà en mà"],
    d: ["Grandma's stories, Dad's toolbox, how your aunt folds the dumplings: kept before they're lost.", "外婆的故事、爸爸的工具箱、阿姨包饺子的手法：在失传之前留下来。", "外婆的故事、爸爸的工具箱、阿姨包餃子的手法：在失傳之前留下來。", "Las historias de la abuela, la caja de herramientas de papá, cómo cierra la tía las empanadillas: guardadas antes de que se pierdan.", "Les històries de l'àvia, la caixa d'eines del pare, com tanca la tieta les empanades: guardades abans que es perdin."],
    q: ["What does only one of us know, that nobody has written down?", "有什么事只有我们中的一个人知道，却没人写下来？", "有什麼事只有我們中的一個人知道，卻沒人寫下來？", "¿Qué sabe solo una persona de nosotros, sin que nadie lo haya apuntado?", "Què sap només una persona de nosaltres, sense que ningú ho hagi apuntat?"] },
  { k: "recipe", pl: "bar", ic: "steamer", th: "care", go: "bar",
    t: ["The family recipe", "家传的那道菜", "家傳的那道菜", "La receta de la familia", "La recepta de la família"],
    d: ["The dish that tastes like home, and someone who still cooks it for the rest of us.", "一道有家的味道的菜，还有一个仍在为大家做它的人。", "一道有家的味道的菜，還有一個仍在為大家做它的人。", "El plato que sabe a casa, y alguien que todavía lo cocina para los demás.", "El plat que té gust de casa, i algú que encara el cuina per als altres."],
    q: ["Whose recipe would we lose if nobody learned it this year?", "如果今年没人去学，我们会失去谁的拿手菜？", "如果今年沒人去學，我們會失去誰的拿手菜？", "¿La receta de quién perderíamos si nadie la aprende este año?", "La recepta de qui perdríem si ningú no l'aprèn aquest any?"] },
  /* ---- having fun ---- */
  { k: "dj", ic: "dj", th: "fun",
    t: ["The party", "派对", "派對", "La fiesta", "La festa"],
    d: ["Dancing at the wedding, your aunt on the karaoke, a cake with too many candles.", "婚礼上跳舞、阿姨抢着唱卡拉OK、插了太多蜡烛的蛋糕。", "婚禮上跳舞、阿姨搶著唱卡拉OK、插了太多蠟燭的蛋糕。", "Bailar en la boda, la tía en el karaoke, una tarta con demasiadas velas.", "Ballar al casament, la tieta al karaoke, un pastís amb massa espelmes."],
    q: ["What did we last celebrate together, and what are we forgetting to?", "我们上一次一起庆祝了什么？又忘了庆祝什么？", "我們上一次一起慶祝了什麼？又忘了慶祝什麼？", "¿Qué celebramos juntos por última vez, y qué se nos está olvidando celebrar?", "Què vam celebrar junts per últim cop, i què se'ns està oblidant de celebrar?"] },
  { k: "cinema", ic: "cinema", th: "fun",
    t: ["Film night on the sofa", "沙发上的电影夜", "沙發上的電影夜", "Noche de peli en el sofá", "Nit de peli al sofà"],
    d: ["One sofa, one blanket too few, and twenty minutes choosing what to watch.", "一张沙发、少一条毯子，再花二十分钟挑片。", "一張沙發、少一條毯子，再花二十分鐘挑片。", "Un sofá, una manta de menos y veinte minutos eligiendo qué ver.", "Un sofà, una manta de menys i vint minuts triant què mirar."],
    q: ["What's the film we all know by heart, and when did we last watch it together?", "哪部电影我们都能背出台词？上一次一起看是什么时候？", "哪部電影我們都能背出台詞？上一次一起看是什麼時候？", "¿Qué peli nos sabemos todos de memoria, y cuándo la vimos juntos por última vez?", "Quina peli ens sabem tots de memòria, i quan la vam veure junts per últim cop?"] },
  { k: "forest", ic: "forest", th: "fun",
    t: ["The walk after lunch", "饭后散步", "飯後散步", "El paseo después de comer", "La passejada després de dinar"],
    d: ["Arm in arm with your grandmother, the slow way round the block.", "挽着外婆的手臂，慢慢绕着街区走一圈。", "挽著外婆的手臂，慢慢繞著街區走一圈。", "Del brazo de tu abuela, dando la vuelta a la manzana sin prisa.", "Del braç de la teva àvia, fent la volta a l'illa sense pressa."],
    q: ["Who used to go walking with us, and when did we stop?", "以前谁常和我们一起散步？我们是从什么时候不走了的？", "以前誰常和我們一起散步？我們是從什麼時候不走了的？", "¿Con quién salíamos a pasear antes, y cuándo dejamos de hacerlo?", "Amb qui sortíem a passejar abans, i quan ho vam deixar de fer?"] },
  { k: "cabin", ic: "cabin", th: "fun",
    t: ["Doing nothing, together", "一起什么都不做", "一起什麼都不做", "No hacer nada, juntos", "No fer res, junts"],
    d: ["A slow afternoon, nobody on their phone, nowhere to be.", "慢悠悠的下午，没人看手机，哪儿也不用去。", "慢悠悠的下午，沒人看手機，哪兒也不用去。", "Una tarde lenta, nadie con el móvil, ningún sitio adonde ir.", "Una tarda lenta, ningú amb el mòbil, cap lloc on anar."],
    q: ["When did we last spend a whole afternoon together with no plan at all?", "我们上一次毫无计划地一起待上整个下午，是什么时候？", "我們上一次毫無計劃地一起待上整個下午，是什麼時候？", "¿Cuándo fue la última vez que pasamos juntos una tarde entera sin ningún plan?", "Quan va ser l'última vegada que vam passar junts una tarda sencera sense cap pla?"] },
  { k: "nest", ic: "nest", th: "fun",
    t: ["The animals", "家里的小动物", "家裡的小動物", "Los animales", "Els animals"],
    d: ["The dog everyone walks, the cat who chose Grandma: family too.", "大家轮流遛的狗，挑中了外婆的猫：它们也是家人。", "大家輪流遛的狗，挑中了外婆的貓：牠們也是家人。", "El perro que pasea todo el mundo, la gata que eligió a la abuela: también son familia.", "El gos que passeja tothom, la gata que va triar l'àvia: també són família."],
    q: ["Who feeds the animals when we're away, and who do they love best?", "我们不在时谁喂小动物？它们最爱谁？", "我們不在時誰餵小動物？牠們最愛誰？", "¿Quién da de comer a los animales cuando no estamos, y a quién quieren más?", "Qui dona de menjar als animals quan no hi som, i a qui estimen més?"] },
  { k: "stall", ic: "stall", th: "fun",
    t: ["What each of us is into", "各自在忙的爱好", "各自在忙的愛好", "Lo que le gusta a cada uno", "El que li agrada a cadascú"],
    d: ["Knowing what your brother's making these days, and asking him about it.", "知道哥哥最近在捣鼓什么，还会问他一句。", "知道哥哥最近在搗鼓什麼，還會問他一句。", "Saber qué anda haciendo tu hermano estos días, y preguntárselo.", "Saber què fa el teu germà aquests dies, i preguntar-li."],
    q: ["What is one of us making or learning that the rest have never asked about?", "我们之中有人在做或在学什么，其他人却从没问过？", "我們之中有人在做或在學什麼，其他人卻從沒問過？", "¿Qué está haciendo o aprendiendo alguno de nosotros sin que los demás se lo hayamos preguntado nunca?", "Què està fent o aprenent algú de nosaltres sense que els altres li hàgim preguntat mai?"] }
];
/* the plain pieces: no question, just the town between the places */
window.HG_PLAIN = [
  { k: "road", n: ["Path", "小路", "小路", "Camino", "Camí"] },
  { k: "tree", n: ["Tree", "树", "樹", "Árbol", "Arbre"] },
  { k: "flowers", n: ["Flowers", "花", "花", "Flores", "Flors"] },
  { k: "bench", n: ["Bench", "长椅", "長椅", "Banco", "Banc"] },
  { k: "lamp", n: ["Lamp", "路灯", "路燈", "Farola", "Fanal"] },
  { k: "pond", n: ["Pond", "池塘", "池塘", "Estanque", "Estany"] }
];
/* everyone's own house: one each, put down when they move in */
window.HG_HOUSE = {
  q: ["What makes you feel at home?", "什么让你觉得像回到了家？", "什麼讓你覺得像回到了家？", "¿Qué te hace sentir en casa?", "Què et fa sentir a casa?"],
  go: ""
};
