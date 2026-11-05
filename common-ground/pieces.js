/* Common Ground · the pieces. Nearby's places, re-read as the ways a team meets and looks after each other.
   Each: k (the Nearby key: its name and icon come from FBWorld), ic (the pixel icon), th (listen · feedback · trust · together),
   t (the practice, in plain words), d (what it looks like), q (one honest question for the team), tool (a FREE//BUILDER practice
   tool where one fits). Five languages: en · zh · zh-Hant · es · ca. */
window.CG_THEMES = {
  listen: ["Listening", "倾听", "傾聽", "Escuchar", "Escoltar"],
  feedback: ["Feedback", "反馈", "回饋", "Decirse las cosas", "Dir-se les coses"],
  trust: ["Trust", "信任", "信任", "Confianza", "Confiança"],
  together: ["Together", "一起", "一起", "Juntos", "Junts"],
  plain: ["Paths & trees", "路和树", "路和樹", "Caminos y árboles", "Camins i arbres"]
};
window.CG_TOOLS = {
  questions: ["Question Deck", "问题卡组", "問題卡組", "Mazo de Preguntas", "Baralla de Preguntes"],
  listen: ["Listening Duet", "倾听二重奏", "傾聽二重奏", "Dúo de escucha", "Duet d'escolta"],
  room: ["Room Mode", "Room Mode", "Room Mode", "Room Mode", "Room Mode"],
  swap: ["Perspective Swap", "视角互换", "視角互換", "Cambio de Perspectiva", "Canvi de Perspectiva"],
  thanks: ["Specific Thanks", "具体的感谢", "具體的感謝", "Gracias Concretas", "Gràcies Concretes"],
  twotruths: ["Two Truths", "两个真相", "兩個真相", "Dos Verdades", "Dues Veritats"],
  decide: ["Decision Room", "决策室", "決策室", "Sala de Decisiones", "Sala de Decisions"],
  repair: ["Repair Kit", "修复工具包", "修復工具包", "Kit de Reparación", "Kit de Reparació"],
  museum: ["Mistake Museum", "错误博物馆", "錯誤博物館", "Museo de Errores", "Museu dels Errors"],
  manual: ["My User Manual", "我的使用说明书", "我的使用說明書", "Mi Manual de Uso", "El Meu Manual d'Ús"],
  teachback: ["Teach-Back Chain", "教回去链条", "教回去鏈條", "Cadena de Enseñar de Vuelta", "Cadena d'Ensenyar de Tornada"],
  dial: ["Delegation Dial", "授权刻度盘", "授權刻度盤", "Dial de Delegación", "Dial de Delegació"],
  design: ["Design Thinking Odyssey", "设计思维奥德赛", "設計思維奧德賽", "Odisea de Design Thinking", "Odissea de Design Thinking"]
};
window.CG_PRACTICES = [
  /* ---- listening ---- */
  { k: "bar", ic: "bar", th: "listen", tool: "questions",
    t: ["Coffee before the meeting", "会前的一杯咖啡", "會前的一杯咖啡", "El café antes de la reunión", "El cafè abans de la reunió"],
    d: ["A few minutes of small talk before the work starts.", "开工前，先聊几分钟闲话。", "開工前，先聊幾分鐘閒話。", "Unos minutos de charla antes de ponerse a trabajar.", "Uns minuts de xerrada abans de posar-se a treballar."],
    q: ["Who did you last have a coffee with here, just to talk?", "你上一次和这里的谁喝咖啡，只是为了聊聊天？", "你上一次和這裡的誰喝咖啡，只是為了聊聊天？", "¿Con quién de aquí tomaste un café por última vez, solo para hablar?", "Amb qui d'aquí vas fer un cafè per últim cop, només per parlar?"] },
  { k: "restaurant", ic: "restaurant", th: "listen", tool: "listen",
    t: ["One-to-ones", "一对一", "一對一", "Uno a uno", "Un a un"],
    d: ["Two people, half an hour, full attention, and again next week.", "两个人，半小时，全心全意，下周再来。", "兩個人，半小時，全心全意，下週再來。", "Dos personas, media hora, toda la atención, y otra vez la semana que viene.", "Dues persones, mitja hora, tota l'atenció, i un altre cop la setmana que ve."],
    q: ["Who here gets your full attention for half an hour, every week or two?", "这里有谁每一两周能得到你半小时的全部注意力？", "這裡有誰每一兩週能得到你半小時的全部注意力？", "¿Quién de aquí tiene toda tu atención media hora, cada una o dos semanas?", "Qui d'aquí té tota la teva atenció mitja hora, cada una o dues setmanes?"] },
  { k: "plaza", ic: "plaza", th: "listen", tool: "room",
    t: ["The all-hands", "全员会", "全員會", "La reunión de todos", "La reunió de tothom"],
    d: ["Everyone together, and room for every voice.", "所有人聚在一起，每个声音都有位置。", "所有人聚在一起，每個聲音都有位置。", "Todo el equipo junto, y sitio para cada voz.", "Tot l'equip junt, i lloc per a cada veu."],
    q: ["When we're all together, who talks, and who mostly listens?", "大家聚在一起时，谁在说，谁大多在听？", "大家聚在一起時，誰在說，誰大多在聽？", "Cuando estamos todos, ¿quién habla y quién casi siempre escucha?", "Quan som tots, qui parla i qui gairebé sempre escolta?"] },
  { k: "jukebox", ic: "jukebox", th: "listen", tool: "swap",
    t: ["Both halves of the story", "故事的另一半", "故事的另一半", "Las dos mitades de la historia", "Les dues meitats de la història"],
    d: ["Hearing the other side before answering.", "先听完另一边，再回答。", "先聽完另一邊，再回答。", "Escuchar la otra parte antes de responder.", "Escoltar l'altra part abans de respondre."],
    q: ["When we disagree, do we hear the other half of the story before we reply?", "意见不同时，我们会先听完故事的另一半再开口吗？", "意見不同時，我們會先聽完故事的另一半再開口嗎？", "Cuando no estamos de acuerdo, ¿escuchamos la otra mitad de la historia antes de contestar?", "Quan no estem d'acord, escoltem l'altra meitat de la història abans de contestar?"] },
  { k: "train", ic: "train", th: "listen", tool: "",
    t: ["Close from far away", "远也不远", "遠也不遠", "Cerca desde lejos", "A prop des de lluny"],
    d: ["Teammates far away still hear the news, and the jokes.", "离得远的同事，也听得到消息和笑话。", "離得遠的同事，也聽得到消息和笑話。", "Quien trabaja lejos también se entera de las noticias, y de las bromas.", "Qui treballa lluny també s'assabenta de les notícies, i de les bromes."],
    q: ["Who works far from the rest of us, and how do they hear the news?", "谁离我们其他人最远？他们怎么听到消息？", "誰離我們其他人最遠？他們怎麼聽到消息？", "¿Quién trabaja lejos del resto, y cómo se entera de las cosas?", "Qui treballa lluny de la resta, i com s'assabenta de les coses?"] },
  /* ---- feedback ---- */
  { k: "postcard", ic: "postcard", th: "feedback", tool: "thanks",
    t: ["Saying thanks", "说谢谢", "說謝謝", "Dar las gracias", "Donar les gràcies"],
    d: ["Thanks out loud, naming what someone did and what it meant.", "大声说谢谢，说出对方做了什么、对你意味着什么。", "大聲說謝謝，說出對方做了什麼、對你意味著什麼。", "Gracias en voz alta, diciendo qué hizo y qué significó.", "Gràcies en veu alta, dient què va fer i què va significar."],
    q: ["When did someone last say thanks out loud here, and for what?", "这里上一次有人大声说谢谢是什么时候？为了什么？", "這裡上一次有人大聲說謝謝是什麼時候？為了什麼？", "¿Cuándo dio alguien las gracias en voz alta aquí por última vez, y por qué?", "Quan va donar algú les gràcies en veu alta aquí per últim cop, i per què?"] },
  { k: "fortune", ic: "crystal", th: "feedback", tool: "twotruths",
    t: ["How it landed", "坦诚的反馈", "坦誠的回饋", "Cómo te llegó", "Com et va arribar"],
    d: ["Kind and clear: what you saw, and what it did.", "温和又清楚：你看到了什么，它带来了什么。", "溫和又清楚：你看到了什麼，它帶來了什麼。", "Con cariño y claridad: lo que viste y lo que provocó.", "Amb afecte i claredat: el que vas veure i el que va provocar."],
    q: ["When did someone last tell you, kindly and clearly, how something you did landed?", "上一次有人温和又清楚地告诉你，你做的某件事给人什么感受，是什么时候？", "上一次有人溫和又清楚地告訴你，你做的某件事給人什麼感受，是什麼時候？", "¿Cuándo te dijo alguien por última vez, con cariño y claridad, cómo llegó algo que hiciste?", "Quan et va dir algú per últim cop, amb afecte i claredat, com va arribar una cosa que vas fer?"] },
  { k: "hall", ic: "hall", th: "feedback", tool: "decide",
    t: ["The retro", "复盘", "復盤", "La retro", "La retro"],
    d: ["Looking back together, and somewhere for ideas to go.", "一起回头看看，也让想法有个去处。", "一起回頭看看，也讓想法有個去處。", "Mirar atrás juntos, y un sitio adonde van las ideas.", "Mirar enrere junts, i un lloc on van les idees."],
    q: ["When someone here raises an idea, what happens to it next?", "这里有人提出一个想法后，它接下来会怎样？", "這裡有人提出一個想法後，它接下來會怎樣？", "Cuando alguien aquí propone una idea, ¿qué pasa con ella después?", "Quan algú aquí proposa una idea, què en passa després?"] },
  { k: "kintsugi", ic: "kintsugi", th: "feedback", tool: "repair",
    t: ["Mending after a falling-out", "吵完之后的修补", "吵完之後的修補", "Arreglarlo después de un roce", "Adobar-ho després d'un fregament"],
    d: ["Owning it, naming the hurt, repairing forward.", "承认，说出伤到了哪里，再往前修补。", "承認，說出傷到了哪裡，再往前修補。", "Asumirlo, nombrar el daño y reparar hacia delante.", "Assumir-ho, anomenar el mal i reparar endavant."],
    q: ["After a disagreement, how do we find our way back to each other?", "有了分歧之后，我们怎么重新走近彼此？", "有了分歧之後，我們怎麼重新走近彼此？", "Después de un desacuerdo, ¿cómo volvemos a encontrarnos?", "Després d'un desacord, com ens tornem a trobar?"] },
  /* ---- trust ---- */
  { k: "climb", ic: "climb", th: "trust", tool: "museum",
    t: ["Asking for help", "开口求助", "開口求助", "Pedir ayuda", "Demanar ajuda"],
    d: ["Saying “I'm stuck” early, with someone holding the rope.", "早点说“我卡住了”，有人帮你拉住绳子。", "早點說「我卡住了」，有人幫你拉住繩子。", "Decir «me he atascado» a tiempo, con alguien sujetando la cuerda.", "Dir «m'he encallat» a temps, amb algú aguantant la corda."],
    q: ["How easy is it to say “I'm stuck” here, and who do you say it to?", "在这里说“我卡住了”有多容易？你会对谁说？", "在這裡說「我卡住了」有多容易？你會對誰說？", "¿Es fácil decir «me he atascado» aquí? ¿A quién se lo dices?", "És fàcil dir «m'he encallat» aquí? A qui li dius?"] },
  { k: "garden", ic: "garden", th: "trust", tool: "manual",
    t: ["Welcoming someone new", "迎接新同事", "迎接新同事", "Recibir a alguien nuevo", "Rebre algú nou"],
    d: ["A newcomer's first weeks, and who looks after them.", "新人的头几周，以及谁来照顾他们。", "新人的頭幾週，以及誰來照顧他們。", "Las primeras semanas de una persona nueva, y quién la acompaña.", "Les primeres setmanes d'una persona nova, i qui l'acompanya."],
    q: ["Who did the newest person here have lunch with in their first week?", "这里最新来的人，第一周和谁一起吃了午饭？", "這裡最新來的人，第一週和誰一起吃了午飯？", "¿Con quién comió la persona más nueva del equipo en su primera semana?", "Amb qui va dinar la persona més nova de l'equip la primera setmana?"] },
  { k: "books", ic: "books", th: "trust", tool: "teachback",
    t: ["Sharing what you know", "分享你会的", "分享你會的", "Compartir lo que sabes", "Compartir el que saps"],
    d: ["Teaching what only you know, so nobody's alone with it.", "把只有你会的教给别人，谁都不用独自扛着。", "把只有你會的教給別人，誰都不用獨自扛著。", "Enseñar lo que solo tú sabes, para que nadie cargue solo con ello.", "Ensenyar el que només saps tu, perquè ningú no hi carregui sol."],
    q: ["What does only one person here know how to do?", "这里有什么事只有一个人会做？", "這裡有什麼事只有一個人會做？", "¿Qué sabe hacer solo una persona aquí?", "Què sap fer només una persona aquí?"] },
  { k: "tower", ic: "tower", th: "trust", tool: "dial",
    t: ["Who decides what", "谁来决定什么", "誰來決定什麼", "Quién decide qué", "Qui decideix què"],
    d: ["Clear about who decides, before it matters.", "在事情变得要紧之前，先说清楚谁来决定。", "在事情變得要緊之前，先說清楚誰來決定。", "Tener claro quién decide, antes de que importe.", "Tenir clar qui decideix, abans que importi."],
    q: ["Is it clear who decides what here, or do we find out afterwards?", "这里谁决定什么，是清楚的，还是事后才知道？", "這裡誰決定什麼，是清楚的，還是事後才知道？", "¿Está claro quién decide qué aquí, o nos enteramos después?", "Està clar qui decideix què aquí, o ens n'assabentem després?"] },
  { k: "sanctuary", ic: "sanctuary", th: "trust", tool: "",
    t: ["Looking out for each other", "彼此照应", "彼此照應", "Cuidarnos", "Cuidar-nos"],
    d: ["Noticing when someone's having a hard time, and showing up.", "留意谁正过得不容易，然后陪在身边。", "留意誰正過得不容易，然後陪在身邊。", "Darse cuenta de cuándo a alguien le cuesta, y estar ahí.", "Adonar-se de quan a algú li costa, i ser-hi."],
    q: ["If someone here were having a hard month, would we know?", "如果这里有人正熬着艰难的一个月，我们会知道吗？", "如果這裡有人正熬著艱難的一個月，我們會知道嗎？", "Si alguien aquí estuviera pasando un mes difícil, ¿nos daríamos cuenta?", "Si algú aquí passés un mes difícil, ens n'adonaríem?"] },
  /* ---- together ---- */
  { k: "party", ic: "balloon", th: "together", tool: "",
    t: ["Time together outside work", "工作之外的相聚", "工作之外的相聚", "Tiempo juntos fuera del trabajo", "Temps junts fora de la feina"],
    d: ["A meal, a walk, a game: the same people, off the clock.", "一顿饭、一次散步、一局游戏：同一群人，下班以后。", "一頓飯、一次散步、一局遊戲：同一群人，下班以後。", "Una comida, un paseo, una partida: la misma gente, fuera de horario.", "Un dinar, una passejada, una partida: la mateixa gent, fora d'hores."],
    q: ["When did we last do something together that wasn't work?", "我们上一次一起做与工作无关的事，是什么时候？", "我們上一次一起做與工作無關的事，是什麼時候？", "¿Cuándo hicimos juntos algo que no fuera trabajo por última vez?", "Quan vam fer junts una cosa que no fos feina per últim cop?"] },
  { k: "dj", ic: "dj", th: "together", tool: "",
    t: ["Celebrating", "庆祝", "慶祝", "Celebrar", "Celebrar"],
    d: ["Stopping to mark what we finished, and who made it happen.", "停下来，纪念我们完成的事，和让它成真的人。", "停下來，紀念我們完成的事，和讓它成真的人。", "Pararse a celebrar lo que acabamos, y a quien lo hizo posible.", "Aturar-se a celebrar el que hem acabat, i qui ho ha fet possible."],
    q: ["What did we finish lately that nobody stopped to celebrate?", "最近我们完成了什么，却没人停下来庆祝？", "最近我們完成了什麼，卻沒人停下來慶祝？", "¿Qué hemos terminado hace poco sin que nadie se parara a celebrarlo?", "Què hem acabat fa poc sense que ningú s'aturés a celebrar-ho?"] },
  { k: "cinema", ic: "cinema", th: "together", tool: "design",
    t: ["Learning together", "一起学", "一起學", "Aprender juntos", "Aprendre junts"],
    d: ["Trying something new side by side, then talking about it.", "肩并肩试点新东西，然后聊一聊。", "肩並肩試點新東西，然後聊一聊。", "Probar algo nuevo codo con codo, y luego hablarlo.", "Provar una cosa nova colze a colze, i després parlar-ne."],
    q: ["What's the last thing we learned together, in the same room?", "我们上一次在同一个房间里一起学到的是什么？", "我們上一次在同一個房間裡一起學到的是什麼？", "¿Qué fue lo último que aprendimos juntos, en la misma sala?", "Què va ser l'última cosa que vam aprendre junts, a la mateixa sala?"] },
  { k: "stall", ic: "stall", th: "together", tool: "",
    t: ["What we make on the side", "工作外的小天地", "工作外的小天地", "Lo que hacemos por nuestra cuenta", "El que fem pel nostre compte"],
    d: ["Knowing what each other cares about beyond the job.", "知道彼此在工作之外在乎什么。", "知道彼此在工作之外在乎什麼。", "Saber qué le importa a cada cual más allá del trabajo.", "Saber què li importa a cadascú més enllà de la feina."],
    q: ["What is someone here making or learning on the side that we've never asked about?", "这里有人在工作之外做着或学着什么，我们却从没问过？", "這裡有人在工作之外做著或學著什麼，我們卻從沒問過？", "¿Qué está haciendo o aprendiendo alguien aquí por su cuenta, sin que se lo hayamos preguntado nunca?", "Què està fent o aprenent algú aquí pel seu compte, sense que l'hi hàgim preguntat mai?"] },
  { k: "cabin", ic: "cabin", th: "together", tool: "",
    t: ["Room to focus, and to rest", "专注和休息的空间", "專注和休息的空間", "Espacio para concentrarse, y para descansar", "Espai per concentrar-se, i per descansar"],
    d: ["Quiet hours, real breaks, holidays without the laptop.", "安静的时段，真正的休息，不带电脑的假期。", "安靜的時段，真正的休息，不帶電腦的假期。", "Horas tranquilas, pausas de verdad, vacaciones sin portátil.", "Hores tranquil·les, pauses de debò, vacances sense portàtil."],
    q: ["When can someone here close the door and think, without anyone minding?", "这里什么时候可以关上门好好想事情，而没人介意？", "這裡什麼時候可以關上門好好想事情，而沒人介意？", "¿Cuándo puede alguien aquí cerrar la puerta y pensar sin que a nadie le moleste?", "Quan pot algú aquí tancar la porta i pensar sense que a ningú li sàpiga greu?"] }
];
/* the plain pieces: no question, just the town between the places */
window.CG_PLAIN = [
  { k: "road", n: ["Path", "小路", "小路", "Camino", "Camí"] },
  { k: "tree", n: ["Tree", "树", "樹", "Árbol", "Arbre"] },
  { k: "flowers", n: ["Flowers", "花", "花", "Flores", "Flors"] },
  { k: "bench", n: ["Bench", "长椅", "長椅", "Banco", "Banc"] },
  { k: "lamp", n: ["Lamp", "路灯", "路燈", "Farola", "Fanal"] },
  { k: "pond", n: ["Pond", "池塘", "池塘", "Estanque", "Estany"] }
];
/* everyone's own house: one per teammate, put down when they move in */
window.CG_HOUSE = {
  q: ["What helps you do your best work?", "什么能帮你把工作做到最好？", "什麼能幫你把工作做到最好？", "¿Qué te ayuda a hacer tu mejor trabajo?", "Què t'ajuda a fer la teva millor feina?"],
  tool: "manual"
};
