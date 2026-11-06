    /* =====================================================================
       LANGUAGES: en · zh (简体) · tw (繁體/台灣) · yue (粵語) · es · ca
       Strings below are arrays in this fixed order.
       ===================================================================== */
    const LANGS = ['en', 'zh', 'tw', 'yue', 'es', 'ca'];
    const LANG_META = {
      en:  { name: 'English',  short: 'EN', html: 'en' },
      zh:  { name: '简体中文', short: '简', html: 'zh-CN' },
      tw:  { name: '繁體中文', short: '繁', html: 'zh-TW' },
      yue: { name: '粵語',     short: '粵', html: 'zh-HK' },
      es:  { name: 'Español',  short: 'ES', html: 'es' },
      ca:  { name: 'Català',   short: 'CA', html: 'ca' }
    };

    // Turn a 6-item array into a { en, zh, tw, yue, es, ca } object
    function lx(arr) {
      const o = {};
      LANGS.forEach((l, i) => { if (arr[i] != null && arr[i] !== '') o[l] = arr[i]; });
      return o;
    }

    // Simplified → Traditional (Taiwan phrases / HK) fallback, loaded on demand
    const Zh = {
      conv: { tw: null, hk: null },
      cache: { tw: new Map(), hk: new Map() },
      loading: false,
      ensure() {
        if (this.conv.tw || this.loading || typeof document === 'undefined') return;
        this.loading = true;
        const s = document.createElement('script');
        s.src = '/vendor/opencc/cn2t.js';
        s.onload = () => {
          try {
            this.conv.tw = OpenCC.Converter({ from: 'cn', to: 'twp' });
            this.conv.hk = OpenCC.Converter({ from: 'cn', to: 'hk' });
          } catch (e) {}
          this.loading = false;
          if (['tw', 'yue'].includes(AppState.lang)) applyLanguage();
        };
        s.onerror = () => { this.loading = false; };
        document.head.appendChild(s);
      },
      to(kind, text) {
        if (!text) return text;
        const c = this.conv[kind];
        if (!c) return text;
        const m = this.cache[kind];
        if (m.has(text)) return m.get(text);
        let out = text;
        try { out = c(text); } catch (e) {}
        m.set(text, out);
        return out;
      }
    };

    function fillVars(s) {
      if (typeof s !== 'string') return s;
      return s.replace(/\{name\}/g, (typeof Patron !== 'undefined' && Patron.name) ? Patron.name : '');
    }

    // Main lookup for any { en, zh, ... } object. Fallbacks:
    // tw → zh converted to Taiwan Traditional; yue → tw → zh converted to HK; ca → es → en
    function L(obj) {
      if (!obj) return '';
      if (typeof obj === 'string') return fillVars(obj);
      const lg = AppState.lang;
      let s = obj[lg];
      if (!s) {
        if (lg === 'tw') s = obj.zh ? Zh.to('tw', obj.zh) : obj.en;
        else if (lg === 'yue') s = obj.tw || (obj.zh ? Zh.to('hk', obj.zh) : obj.en);
        else if (lg === 'ca') s = obj.es || obj.en;
        else s = obj.en;
      }
      return fillVars(s || obj.en || '');
    }

    function detectBrowserLang() {
      const list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
      for (const raw of list) {
        const l = String(raw).toLowerCase();
        if (l.startsWith('yue') || l === 'zh-hk' || l === 'zh-mo' || l.startsWith('zh-hant-hk') || l.startsWith('zh-hant-mo')) return 'yue';
        if (l === 'zh-tw' || l.startsWith('zh-hant')) return 'tw';
        if (l.startsWith('zh')) return 'zh';
        if (l.startsWith('ca')) return 'ca';
        if (l.startsWith('es') || l.startsWith('gl') || l.startsWith('eu')) return 'es';
        if (l.startsWith('en')) return 'en';
      }
      return 'en';
    }

    /* ---------------- UI dictionary ---------------- */
    const UI_RAW = {
      'brand.bar':        ["NEXT DOOR", "隔壁", "隔壁", "隔籬", "AL LADO", "AL COSTAT"],
      'brand.cafe':       ["NEXT DOOR", "隔壁", "隔壁", "隔籬", "AL LADO", "AL COSTAT"],
      'nd.short':         ["Books next door", "隔壁的旧书", "隔壁的舊書", "隔籬啲舊書", "Libros al lado", "Llibres al costat"],
      'door.nameLabel':   ["What should Wei call you?", "Wei 该怎么称呼你？", "Wei 該怎麼稱呼你？", "Wei 應該點叫你？", "¿Cómo te llama Wei?", "Com t'ha de dir en Wei?"],
      'db.online':        ["Synced", "已同步", "已同步", "已同步", "Sincronizado", "Sincronitzat"],
      'db.local':         ["Saved on this device", "保存在本机", "儲存在本機", "儲咗喺呢部機", "Guardado en este dispositivo", "Desat en aquest dispositiu"],
      'menu.title':       ["Tonight's menu", "今日菜单", "今日菜單", "今日餐牌", "La carta de hoy", "La carta d'avui"],
      'menu.signatures':  ["Signatures", "招牌", "招牌", "招牌", "De la casa", "De la casa"],
      'menu.classics':    ["Classics", "经典", "經典", "經典", "Clásicos", "Clàssics"],
      'menu.tap':         ["On tap 🍺", "生啤 🍺", "生啤 🍺", "生啤 🍺", "De barril 🍺", "De barril 🍺"],
      'menu.tapEmpty':    ["No beers on tap yet. Brew one at Neighbours' Brew.", "还没有生啤。去邻家酿酿一桶吧。", "還沒有生啤。去鄰家釀釀一桶吧。", "仲未有生啤。去鄰家釀釀一桶啦。", "Aún no hay cerveza de barril. Elabora una en Cerveza Vecina.", "Encara no hi ha cervesa de barril. Elabora'n una a Cervesa Veïna."],
      'menu.tapBrew':     ["Brew your own at Neighbours' Brew", "去邻家酿酿你自己的", "去鄰家釀釀你自己的", "去鄰家釀釀你自己嘅", "Elabora la tuya en Cerveza Vecina", "Elabora la teva a Cervesa Veïna"],
      'menu.tapPour':     ["One {b}, brewed by {w}. Slow pour, good head. Cheers!", "一杯 {b}，{w} 酿的。慢慢倒，泡沫刚好。干杯！", "一杯 {b}，{w} 釀的。慢慢倒，泡沫剛好。乾杯！", "一杯 {b}，{w} 釀嘅。慢慢倒，啲泡啱啱好。飲杯！", "Una {b}, de {w}. Tirada despacio, buena espuma. ¡Salud!", "Una {b}, de {w}. Tirada a poc a poc, bona escuma. Salut!"],
      'menu.guest':       ["From the lab", "实验室出品", "實驗室出品", "實驗室出品", "Del laboratorio", "Del laboratori"],
      'menu.hint':        ["Tap any drink and Wei will make it.", "点一杯，Wei 马上做。", "點一杯，Wei 馬上做。", "揀一杯，Wei 即刻整。", "Toca una bebida y Wei la prepara.", "Toca una beguda i en Wei la prepara."],

      // Lab
      'lab.tabMix':       ["Mix", "调一杯", "調一杯", "調一杯", "Mezclar", "Barrejar"],
      'lab.tabBook':      ["House book", "酒谱本", "酒譜本", "酒譜", "Libro de la casa", "Llibre de la casa"],
      'lab.hint':         ["Tap bottles to pour, pick a glass, then mix.", "点酒瓶倒酒，选杯子，再调。", "點酒瓶倒酒，選杯子，再調。", "撳酒樽倒酒，揀杯，再調。", "Toca botellas para servir, elige vaso y mezcla.", "Toca ampolles per servir, tria got i barreja."],
      'lab.glass':        ["Glass", "杯子", "杯子", "杯", "Vaso", "Got"],
      'lab.ice':          ["Ice", "冰", "冰", "冰", "Hielo", "Gel"],
      'lab.method':       ["Method", "手法", "手法", "手法", "Técnica", "Tècnica"],
      'lab.inGlass':      ["In the glass", "杯里有", "杯裡有", "杯入面有", "En el vaso", "Al got"],
      'lab.clear':        ["Empty", "倒掉", "倒掉", "倒咗佢", "Vaciar", "Buidar"],
      'lab.mixBtn':       ["Mix it", "调好它", "調好它", "調好佢", "¡Mézclalo!", "Barreja-ho!"],
      'lab.garnish':      ["Garnish", "装饰", "裝飾", "裝飾", "Decoración", "Decoració"],
      'lab.tasting':      ["Tasting notes", "品鉴", "品鑑", "試飲", "Notas de cata", "Notes de tast"],
      'lab.nameLabel':    ["Name your drink", "给它起个名", "幫它取個名", "改個名", "Ponle nombre", "Posa-li nom"],
      'lab.namePh':       ["e.g. Hutong Midnight", "比如：胡同午夜", "例如：胡同午夜", "例如：胡同半夜", "p. ej. Medianoche en el hutong", "p. ex. Mitjanit al hutong"],
      'lab.notePh':       ["A note for the book (optional)", "写一句备注（可选）", "寫一句備註（可選）", "寫句備註（唔寫都得）", "Una nota para el libro (opcional)", "Una nota per al llibre (opcional)"],
      'lab.serve':        ["Sip at counter", "端到吧台", "端到吧台", "攞去吧枱飲", "Probar en la barra", "Tastar a la barra"],
      'lab.save':         ["Add to book", "收进酒谱", "收進酒譜", "加入酒譜", "Al libro", "Al llibre"],
      'lab.sortNew':      ["Newest", "最新", "最新", "最新", "Recientes", "Recents"],
      'lab.sortLoved':    ["Most loved", "最受欢迎", "最受歡迎", "最多人鍾意", "Favoritos", "Preferits"],
      'lab.sortMine':     ["Mine", "我的", "我的", "我嘅", "Míos", "Meus"],
      'lab.empty':        ["Nothing poured yet.", "还什么都没倒。", "還什麼都沒倒。", "仲未倒嘢。", "Aún no has servido nada.", "Encara no has servit res."],
      'lab.full':         ["The glass is full.", "杯子满了。", "杯子滿了。", "杯滿咗喇。", "El vaso está lleno.", "El got és ple."],
      'lab.needMix':      ["Pour something first.", "先倒点东西。", "先倒點東西。", "倒啲嘢先。", "Sirve algo primero.", "Serveix alguna cosa primer."],
      'lab.needName':     ["Give it a name first.", "先起个名字。", "先取個名字。", "改個名先。", "Ponle nombre primero.", "Posa-li nom primer."],
      'lab.saved':        ["Added to the house book ✓", "已收进酒谱 ✓", "已收進酒譜 ✓", "已加入酒譜 ✓", "Añadido al libro ✓", "Afegit al llibre ✓"],
      'lab.by':           ["by", "作者", "作者", "作者", "de", "de"],
      'lab.order':        ["Order", "点这杯", "點這杯", "叫呢杯", "Pedir", "Demanar"],
      'lab.bookEmpty':    ["The book is empty. Be the first.", "酒谱还是空的，来做第一个吧。", "酒譜還是空的，來當第一個吧。", "酒譜仲係吉嘅，你嚟做第一個啦。", "El libro está vacío. Sé el primero.", "El llibre és buit. Sigues el primer."],
      'lab.challenge':    ["Wei's challenge", "Wei 的挑战", "Wei 的挑戰", "Wei 嘅挑戰", "Reto de Wei", "Repte d'en Wei"],
      'lab.challengeDone':["Challenge complete!", "挑战完成！", "挑戰完成！", "挑戰完成！", "¡Reto superado!", "Repte superat!"],
      'lab.cat.spirit':   ["Spirits", "基酒", "基酒", "基酒", "Destilados", "Destil·lats"],
      'lab.cat.liqueur':  ["Liqueurs", "利口酒", "利口酒", "力嬌酒", "Licores", "Licors"],
      'lab.cat.sweet':    ["Sweet", "甜", "甜", "甜", "Dulce", "Dolç"],
      'lab.cat.sour':     ["Sour", "酸", "酸", "酸", "Ácido", "Àcid"],
      'lab.cat.bitter':   ["Bitters", "苦精", "苦精", "苦精", "Amargos", "Amargs"],
      'lab.cat.top':      ["Top & café", "补满 & 咖啡", "補滿 & 咖啡", "加滿 & 咖啡", "Relleno y café", "Farcit i cafè"],
      'lab.g.coupe':      ["Coupe", "碟形杯", "碟形杯", "碟杯", "Copa coupé", "Copa coupé"],
      'lab.g.rocks':      ["Rocks", "古典杯", "古典杯", "古典杯", "Vaso bajo", "Got baix"],
      'lab.g.highball':   ["Highball", "高球杯", "高球杯", "高身杯", "Vaso alto", "Got alt"],
      'lab.g.nick':       ["Nick & Nora", "尼克诺拉杯", "尼克諾拉杯", "Nick & Nora", "Nick & Nora", "Nick & Nora"],
      'lab.i.none':       ["None", "不加", "不加", "走冰", "Sin", "Sense"],
      'lab.i.cubes':      ["Cubes", "冰块", "冰塊", "冰粒", "Cubitos", "Glaçons"],
      'lab.i.rock':       ["Big rock", "大方冰", "大方冰", "大冰粒", "Bloque", "Bloc"],
      'lab.i.crushed':    ["Crushed", "碎冰", "碎冰", "碎冰", "Picado", "Picat"],
      'lab.m.shake':      ["Shake", "摇", "搖", "搖", "Agitar", "Agitar"],
      'lab.m.stir':       ["Stir", "搅", "攪", "攪", "Remover", "Remenar"],
      'lab.m.build':      ["Build", "直调", "直調", "直接倒", "Directo", "Directe"],
      'lab.b.strength':   ["Strength", "酒感", "酒感", "酒味", "Fuerza", "Força"],
      'lab.b.sweet':      ["Sweet", "甜", "甜", "甜", "Dulce", "Dolç"],
      'lab.b.sour':       ["Sour", "酸", "酸", "酸", "Ácido", "Àcid"],
      'lab.b.bitter':     ["Bitter", "苦", "苦", "苦", "Amargo", "Amarg"],
      'lab.b.aroma':      ["Aroma", "香气", "香氣", "香味", "Aroma", "Aroma"],

      // Studio

      // Wall
      'wall.writeCard':   ["Write a postcard", "写一张明信片", "寫一張明信片", "寫張明信片", "Escribe una postal", "Escriu una postal"],
      'wall.opens':       ["Opens {d}", "{d} 可以拆开", "{d} 可以拆開", "{d} 可以拆", "Se abre el {d}", "S'obre el {d}"],
      'wall.emptyWall':   ["The wall is clean. For now.", "墙还干净着呢。暂时。", "牆還乾淨著。暫時。", "幅牆仲好乾淨。暫時。", "La pared está limpia. Por ahora.", "La paret és neta. De moment."],

      // Arcade

      // Counter chips & misc
      'chat.day':         ["How's my day?", "聊聊今天", "聊聊今天", "傾吓今日", "Mi día", "El meu dia"],
      'chat.fortune':     ["Flip a coaster", "翻个杯垫", "翻個杯墊", "反轉杯墊", "Gira un posavasos", "Gira un sotagot"],
      'chat.gossip':      ["Any news?", "最近有啥新鲜事？", "最近有什麼新鮮事？", "最近有咩新聞？", "¿Qué se cuenta?", "Què es diu?"],
      'chat.challenge':   ["Give me a challenge", "给我个挑战", "給我個挑戰", "俾個挑戰我", "Dame un reto", "Dona'm un repte"],
      'chat.dayIntro':    ["\"So, {name}. How was today, honestly?\"", "\"{name}，说实话，今天过得怎么样？\"", "\"{name}，老實說，今天過得怎樣？\"", "\"{name}，講真，今日點呀？\"", "\"A ver, {name}. ¿Qué tal el día, de verdad?\"", "\"A veure, {name}. Com ha anat el dia, de veritat?\""],
      'common.loading':   ["Loading…", "加载中…", "載入中…", "載入緊…", "Cargando…", "Carregant…"],
    };
    const UI = {};
    Object.entries(UI_RAW).forEach(([k, v]) => { UI[k] = lx(v); });

    function T(key) {
      return UI[key] ? L(UI[key]) : key;
    }

    /* ---------------- Legacy i18n keys for the counter engine ---------------- */
    (function extendLegacyI18n() {
      const rows = {
        sleepHeaderBar:  ["LATE NIGHT", "深夜打烊", "深夜打烊", "夜深收工", "MADRUGADA", "MATINADA"],
        sleepStoryBar:   ["*HONK-shoo…* Wei fell asleep on the bar. His round glasses slid to the tip of his nose.", "*呼——呼噜……* Wei 趴在吧台上睡着了，圆框眼镜滑到了鼻尖。", "*呼——呼嚕……* Wei 趴在吧台上睡著了，圓框眼鏡滑到了鼻尖。", "*呼——呼……* Wei 伏喺吧枱度瞓着咗，副圓框眼鏡跌到去鼻尖。", "*Zzz…* Wei se durmió sobre la barra. Las gafas redondas le resbalan por la nariz.", "*Zzz…* En Wei s'ha adormit a la barra. Les ulleres rodones li rellisquen pel nas."],
        sleepHeaderCafe: ["AFTERNOON SIESTA", "午后小憩", "午後小憩", "瞓晏覺時間", "SIESTA", "MIGDIADA"],
        sleepStoryCafe:  ["*HONK-shoo…* Wei is napping by the espresso machine. Glasses: halfway down his nose.", "*呼——呼噜……* Wei 靠着咖啡机午睡，眼镜滑到一半。", "*呼——呼嚕……* Wei 靠著咖啡機午睡，眼鏡滑到一半。", "*呼——呼……* Wei 挨住咖啡機瞓晏覺，眼鏡跌咗一半。", "*Zzz…* Wei echa la siesta junto a la cafetera. Gafas a media nariz.", "*Zzz…* En Wei fa la migdiada al costat de la cafetera. Ulleres a mig nas."],
        sleepBadge:      ["😴 asleep", "😴 睡着了", "😴 睡著了", "😴 瞓着咗", "😴 dormido", "😴 adormit"],
        sleepBtnWakeBar: ["Clink a glass to wake Wei", "轻碰酒杯叫醒 Wei", "輕碰酒杯叫醒 Wei", "碰吓酒杯叫醒 Wei", "Choca una copa para despertarlo", "Fes dringar una copa per despertar-lo"],
        sleepBtnWakeCafe:["Clink a cup to wake Wei", "轻碰咖啡杯叫醒 Wei", "輕碰咖啡杯叫醒 Wei", "碰吓咖啡杯叫醒 Wei", "Choca una taza para despertarlo", "Fes dringar una tassa per despertar-lo"],
        sleepBtnCats:    ["Let the cats serve", "让猫咪来招待", "讓貓咪來招待", "等兩隻貓招呼你", "Que sirvan los gatos", "Que serveixin els gats"],
        sleepBtnDiy:     ["Sneak behind the counter", "偷偷溜进吧台", "偷偷溜進吧台", "靜靜雞走入吧枱", "Colarse tras la barra", "Colar-se darrere la barra"],
        resBtnReorder:   ["Another ↺", "再来一杯 ↺", "再來一杯 ↺", "再嚟一杯 ↺", "Otra ↺", "Una altra ↺"],
        resBtnCheers:    ["🥂 Cheers", "🥂 干杯", "🥂 乾杯", "🥂 飲勝", "🥂 Salud", "🥂 Salut"],
        modalSubBar:     ["Bar · after 18:00", "酒馆 · 18:00 后", "酒館 · 18:00 後", "酒吧 · 18:00 之後", "Bar · desde las 18:00", "Bar · a partir de les 18:00"],
        modalSubCafe:    ["Café · until 18:00", "咖啡 · 18:00 前", "咖啡 · 18:00 前", "咖啡 · 18:00 之前", "Café · hasta las 18:00", "Cafè · fins a les 18:00"],
        cellarBannerBar: ["THE CELLAR", "酒窖", "酒窖", "酒窖", "LA BODEGA", "EL CELLER"],
        cellarBannerCafe:["THE ROASTERY", "烘焙坊", "烘焙坊", "烘焙房", "EL TOSTADERO", "LA TORREFACTORA"],
        jokeNext:        ["Another ↺", "再来一个 ↺", "再來一個 ↺", "再嚟一個 ↺", "Otro ↺", "Un altre ↺"],
      };
      LANGS.forEach((lg, i) => {
        if (!i18n[lg]) i18n[lg] = Object.assign({}, i18n.en);
        Object.entries(rows).forEach(([k, arr]) => { i18n[lg][k] = arr[i]; });
      });
    })();
  
