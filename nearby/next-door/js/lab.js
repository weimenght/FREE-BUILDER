    /* ===================== COCKTAIL LAB ===================== */
    // [id, category, color, abv, sweet, sour, bitter, aroma, names(6), step, unit, flags]
    const ING_RAW = [
      ['gin', 'spirit', '#e8f1f2', 0.42, 0, 0, 0.05, 0.6, ['London dry gin', '伦敦干金', '倫敦琴酒', '倫敦氈酒', 'Gin seco', 'Gin sec'], 15],
      ['jasmine_gin', 'spirit', '#f3efd2', 0.40, 0.02, 0, 0.03, 0.9, ['Jasmine tea gin', '茉莉花茶金酒', '茉莉花茶琴酒', '茉莉花茶氈酒', 'Gin de té de jazmín', 'Gin de te de gessamí'], 15],
      ['baijiu', 'spirit', '#f5f5ee', 0.52, 0, 0, 0.05, 1.0, ['Baijiu', '白酒（二锅头）', '白酒（二鍋頭）', '白酒（二鍋頭）', 'Baijiu', 'Baijiu'], 15],
      ['vodka', 'spirit', '#f2f5f7', 0.40, 0, 0, 0, 0.1, ['Vodka', '伏特加', '伏特加', '伏特加', 'Vodka', 'Vodka'], 15],
      ['rye', 'spirit', '#b4621f', 0.45, 0.02, 0, 0.08, 0.7, ['Rye whiskey', '黑麦威士忌', '裸麥威士忌', '黑麥威士忌', 'Whisky de centeno', 'Whisky de sègol'], 15],
      ['bourbon', 'spirit', '#c0702a', 0.45, 0.05, 0, 0.05, 0.6, ['Bourbon', '波本', '波本', '波本', 'Bourbon', 'Bourbon'], 15],
      ['islay', 'spirit', '#a87a2e', 0.43, 0, 0, 0.12, 1.0, ['Smoky Islay scotch', '艾雷岛泥煤威士忌', '艾雷島泥煤威士忌', '艾雷島泥煤威士忌', 'Whisky ahumado de Islay', "Whisky fumat d'Islay"], 10],
      ['rum', 'spirit', '#9a5a24', 0.40, 0.06, 0, 0.02, 0.5, ['Aged rum', '陈年朗姆', '陳年蘭姆酒', '陳年冧酒', 'Ron añejo', 'Rom envellit'], 15],
      ['mezcal', 'spirit', '#eee8d6', 0.42, 0, 0, 0.08, 0.9, ['Mezcal', '梅斯卡尔', '梅斯卡爾', '梅斯卡爾', 'Mezcal', 'Mescal'], 15],

      ['sweet_vermouth', 'liqueur', '#6e1f1a', 0.16, 0.25, 0, 0.12, 0.5, ['Sweet vermouth', '甜味美思', '甜香艾酒', '甜苦艾酒', 'Vermut rojo', 'Vermut negre'], 15],
      ['dry_vermouth', 'liqueur', '#f1ebc6', 0.18, 0.05, 0, 0.08, 0.4, ['Dry vermouth', '干味美思', '不甜香艾酒', '乾苦艾酒', 'Vermut seco', 'Vermut sec'], 15],
      ['campari', 'liqueur', '#d7261e', 0.25, 0.4, 0, 0.55, 0.4, ['Campari', '金巴利', '金巴利', '金巴利', 'Campari', 'Campari'], 15],
      ['aperol', 'liqueur', '#f26b1d', 0.11, 0.45, 0, 0.25, 0.4, ['Aperol', '阿佩罗', '艾普羅', 'Aperol', 'Aperol', 'Aperol'], 15],
      ['cointreau', 'liqueur', '#fff3df', 0.40, 0.55, 0, 0.02, 0.6, ['Orange liqueur', '橙味利口酒', '柑橘香甜酒', '橙酒', 'Licor de naranja', 'Licor de taronja'], 15],
      ['chartreuse', 'liqueur', '#7fae2a', 0.55, 0.4, 0, 0.2, 1.0, ['Green Chartreuse', '绿查特', '綠蕁麻酒', '綠查特', 'Chartreuse verde', 'Chartreuse verd'], 10],
      ['maraschino', 'liqueur', '#f7f3ea', 0.32, 0.5, 0, 0.05, 0.7, ['Maraschino', '黑樱桃利口酒', '黑櫻桃香甜酒', '黑櫻桃酒', 'Marrasquino', 'Marrasquí'], 10],
      ['osmanthus_liq', 'liqueur', '#f2b13a', 0.25, 0.55, 0, 0, 0.9, ['Osmanthus liqueur', '桂花酒', '桂花酒', '桂花酒', 'Licor de osmanto', "Licor d'osmant"], 15],
      ['coffee_liq', 'liqueur', '#3b2416', 0.20, 0.65, 0, 0.1, 0.6, ['Coffee liqueur', '咖啡利口酒', '咖啡香甜酒', '咖啡酒', 'Licor de café', 'Licor de cafè'], 15],

      ['simple', 'sweet', '#fbf8ee', 0, 1.0, 0, 0, 0, ['Simple syrup', '糖浆', '糖漿', '糖水', 'Almíbar', 'Almívar'], 10],
      ['honey_ginger', 'sweet', '#e5a83a', 0, 0.9, 0, 0, 0.5, ['Honey-ginger', '蜂蜜姜汁', '蜂蜜薑汁', '蜜糖薑汁', 'Miel y jengibre', 'Mel i gingebre'], 10],
      ['demerara', 'sweet', '#b77a35', 0, 1.0, 0, 0, 0.2, ['Demerara syrup', '黑糖浆', '黑糖漿', '黃糖漿', 'Almíbar demerara', 'Almívar demerara'], 5],
      ['hawthorn', 'sweet', '#c2283c', 0, 0.8, 0.3, 0, 0.3, ['Hawthorn syrup', '山楂糖浆', '山楂糖漿', '山楂糖漿', 'Jarabe de espino', "Xarop d'arç"], 10],
      ['osmanthus_syr', 'sweet', '#f6c75a', 0, 0.9, 0, 0, 0.7, ['Osmanthus syrup', '桂花糖浆', '桂花糖漿', '桂花糖漿', 'Jarabe de osmanto', "Xarop d'osmant"], 10],

      ['lemon', 'sour', '#f4e36b', 0, 0.05, 1.0, 0, 0.2, ['Lemon', '柠檬汁', '檸檬汁', '檸檬汁', 'Limón', 'Llimona'], 10],
      ['lime', 'sour', '#b9db62', 0, 0.05, 1.0, 0, 0.25, ['Lime', '青柠汁', '萊姆汁', '青檸汁', 'Lima', 'Llima'], 10],
      ['yuzu', 'sour', '#f7d04a', 0, 0.08, 1.1, 0.02, 0.5, ['Yuzu juice', '柚子汁', '柚子汁', '柚子汁', 'Zumo de yuzu', 'Suc de yuzu'], 10],
      ['grapefruit', 'sour', '#f39a8a', 0, 0.15, 0.45, 0.1, 0.2, ['Grapefruit', '西柚汁', '葡萄柚汁', '西柚汁', 'Pomelo', 'Aranja'], 15],
      ['egg_white', 'sour', '#fbf7ee', 0, 0, 0, 0, 0, ['Egg white (foam)', '蛋白（起泡）', '蛋白（起泡）', '蛋白（起泡）', 'Clara (espuma)', "Clara d'ou (escuma)"], 15, 'ml', { foam: true }],

      ['angostura', 'bitter', '#7a2b12', 0.44, 0.1, 0, 3.0, 0.8, ['Angostura', '安格斯特拉', '安格仕苦精', '安格斯特拉', 'Angostura', 'Angostura'], 1, 'dash'],
      ['orange_bitters', 'bitter', '#e0802a', 0.45, 0.05, 0, 2.5, 0.8, ['Orange bitters', '橙味苦精', '柳橙苦精', '橙味苦精', 'Amargo de naranja', 'Amarg de taronja'], 1, 'dash'],
      ['peychauds', 'bitter', '#d22f4a', 0.35, 0.1, 0, 2.2, 0.8, ["Peychaud's", '裴乔氏苦精', '裴喬氏苦精', '裴喬氏苦精', "Peychaud's", "Peychaud's"], 1, 'dash'],
      ['absinthe', 'bitter', '#9fcf6a', 0.65, 0, 0, 0.6, 1.0, ['Absinthe rinse', '苦艾酒涮杯', '苦艾酒潤杯', '苦艾酒涮杯', 'Ajenjo', 'Absenta'], 2, 'dash'],

      ['soda', 'top', '#eaf6fb', 0, 0, 0, 0, 0, ['Soda water', '苏打水', '蘇打水', '梳打水', 'Soda', 'Soda'], 30, 'ml', { fizz: true }],
      ['tonic', 'top', '#eef7f2', 0, 0.35, 0, 0.2, 0.1, ['Tonic', '汤力水', '通寧水', '湯力水', 'Tónica', 'Tònica'], 30, 'ml', { fizz: true }],
      ['ginger_beer', 'top', '#ecd9a0', 0, 0.5, 0.05, 0.05, 0.4, ['Ginger beer', '姜汁啤酒', '薑汁啤酒', '薑啤', 'Ginger beer', 'Ginger beer'], 30, 'ml', { fizz: true }],
      ['jasmine_tea', 'top', '#e8d58a', 0, 0, 0, 0.05, 0.6, ['Cold jasmine tea', '冷泡茉莉花茶', '冷泡茉莉花茶', '凍茉莉花茶', 'Té de jazmín frío', 'Te de gessamí fred'], 30],
      ['espresso', 'top', '#2a160b', 0, 0, 0.05, 0.6, 0.9, ['Espresso', '意式浓缩', '義式濃縮', '特濃咖啡', 'Espresso', 'Espresso'], 30],
      ['coldbrew', 'top', '#3d2414', 0, 0, 0.05, 0.4, 0.7, ['Cold brew', '冷萃咖啡', '冷萃咖啡', '冷萃咖啡', 'Cold brew', 'Cold brew'], 30],
      ['oat_milk', 'top', '#efe4cf', 0, 0.1, 0, 0, 0.1, ['Oat milk', '燕麦奶', '燕麥奶', '燕麥奶', 'Leche de avena', 'Llet de civada'], 30]
    ];
    const ING = {};
    const ING_ORDER = [];
    ING_RAW.forEach(r => {
      const [id, cat, color, abv, sweet, sour, bitter, aroma, names, step, unit, flags] = r;
      ING[id] = Object.assign({ id, cat, color, abv, sweet, sour, bitter, aroma, name: lx(names), step, unit: unit || 'ml' }, flags || {});
      ING_ORDER.push(id);
    });
    const ING_CATS = ['spirit', 'liqueur', 'sweet', 'sour', 'bitter', 'top'];

    const GLASSES = { coupe: { cap: 150 }, nick: { cap: 120 }, rocks: { cap: 220 }, highball: { cap: 330 } };
    const GARNISHES = {
      none: '·', orange: '🍊', lemon: '🍋', cherry: '🍒', olive: '🫒', mint: '🌿', rosemary: '🌱', hawthorn: '🔴', gingko: '🍂', flower: '🌼', bean: '🫘'
    };
    const CLASSICS = {
      negroni:      { name: lx(['Negroni', '内格罗尼', '', '', 'Negroni', 'Negroni']), test: h => h.only(['gin', 'campari', 'sweet_vermouth']) && h.ratio(['gin', 'campari', 'sweet_vermouth'], 0.65) },
      boulevardier: { name: lx(['Boulevardier', '花花公子', '', '', 'Boulevardier', 'Boulevardier']), test: h => (h.has('bourbon') || h.has('rye')) && h.has('campari') && h.has('sweet_vermouth') && h.n <= 4 },
      americano:    { name: lx(['Americano', '美国佬', '', '', 'Americano', 'Americano']), test: h => h.only(['campari', 'sweet_vermouth', 'soda']) },
      daiquiri:     { name: lx(['Daiquiri', '黛琪丽', '', '', 'Daiquiri', 'Daiquiri']), test: h => h.only(['rum', 'lime', 'simple']) },
      gimlet:       { name: lx(['Gimlet', '螺丝锥子', '', '', 'Gimlet', 'Gimlet']), test: h => h.only(['gin', 'lime', 'simple']) },
      oldfashioned: { name: lx(['Old Fashioned', '古典鸡尾酒', '', '', 'Old Fashioned', 'Old Fashioned']), test: h => (h.has('rye') || h.has('bourbon')) && (h.has('demerara') || h.has('simple')) && h.has('angostura') && h.n <= 4 },
      highball:     { name: lx(['Highball', '高球', '', '', 'Highball', 'Highball']), test: h => h.n === 2 && h.has('soda') && (h.has('rye') || h.has('bourbon') || h.has('islay')) },
      gintonic:     { name: lx(['Gin & Tonic', '金汤力', '', '', 'Gin-tonic', 'Gin-tònic']), test: h => h.n === 2 && h.has('tonic') && (h.has('gin') || h.has('jasmine_gin')) },
      espresso:     { name: lx(['Espresso Martini', '浓缩咖啡马天尼', '', '', 'Espresso Martini', 'Espresso Martini']), test: h => h.has('vodka') && h.has('coffee_liq') && h.has('espresso') },
      penicillin:   { name: lx(['Penicillin', '盘尼西林', '', '', 'Penicilina', 'Penicil·lina']), test: h => (h.has('islay') || h.has('rye') || h.has('bourbon')) && h.has('lemon') && h.has('honey_ginger') }
    };

    const Lab = {
      glass: 'coupe',
      ice: 'none',
      method: 'shake',
      garnish: 'none',
      pours: {},
      shelfCat: 'spirit',
      last: null,
      challenge: null,
      bookSort: 'new',

      volume() { return Object.entries(this.pours).reduce((s, [id, n]) => s + n * ING[id].step, 0); },

      init() {
        this.renderControls();
        this.renderShelf();
        this.renderGlass();
        this.renderPours();
      },

      tab(t) {
        document.querySelectorAll('[data-labtab]').forEach(b => b.classList.toggle('active', b.dataset.labtab === t));
        document.getElementById('lab-mix').classList.toggle('hidden', t !== 'mix');
        document.getElementById('lab-book').classList.toggle('hidden', t !== 'book');
        if (t === 'book') this.loadBook(this.bookSort);
        SoundEngine.playClick();
      },

      renderControls() {
        const mk = (wrap, items, cur, onPick) => {
          const el = document.getElementById(wrap);
          el.innerHTML = '';
          items.forEach(([key, label]) => {
            const b = document.createElement('button');
            b.className = 'chip' + (key === cur ? ' active' : '');
            b.textContent = label;
            b.onclick = () => { SoundEngine.playClick(); onPick(key); };
            el.appendChild(b);
          });
        };
        mk('lab-glass-chips', Object.keys(GLASSES).map(k => [k, T('lab.g.' + k)]), this.glass, k => { this.glass = k; this.renderControls(); this.renderGlass(); });
        mk('lab-ice-chips', ['none', 'cubes', 'rock', 'crushed'].map(k => [k, T('lab.i.' + k)]), this.ice, k => { this.ice = k; this.renderControls(); this.renderGlass(); });
        mk('lab-method-chips', ['shake', 'stir', 'build'].map(k => [k, T('lab.m.' + k)]), this.method, k => { this.method = k; this.renderControls(); });
        mk('lab-garnish', Object.entries(GARNISHES).map(([k, e]) => [k, e]), this.garnish, k => { this.garnish = k; this.renderControls(); this.renderGlass(); });

        const tabs = document.getElementById('lab-shelf-tabs');
        tabs.innerHTML = '';
        ING_CATS.forEach(c => {
          const b = document.createElement('button');
          b.className = 'tab' + (c === this.shelfCat ? ' active' : '');
          b.textContent = T('lab.cat.' + c);
          b.onclick = () => { this.shelfCat = c; SoundEngine.playClick(); this.renderControls(); this.renderShelf(); };
          tabs.appendChild(b);
        });
        this.renderChallenge();
      },

      renderShelf() {
        const el = document.getElementById('lab-shelf');
        el.innerHTML = '';
        ING_ORDER.filter(id => ING[id].cat === this.shelfCat).forEach(id => {
          const ing = ING[id];
          const n = this.pours[id] || 0;
          const b = document.createElement('button');
          b.className = 'bottle';
          b.innerHTML = `<span class="swatch" style="background:${ing.color}"></span><span>${esc(L(ing.name))}</span><span class="count">${n ? (ing.unit === 'dash' ? n + '×' : n * ing.step + 'ml') : (ing.unit === 'dash' ? 'dash' : '+' + ing.step)}</span>`;
          b.onclick = () => this.pour(id);
          b.oncontextmenu = (e) => { e.preventDefault(); this.unpour(id); };
          el.appendChild(b);
        });
      },

      pour(id) {
        const ing = ING[id];
        if (this.volume() + ing.step > GLASSES[this.glass].cap) { showToast(T('lab.full')); return; }
        this.pours[id] = (this.pours[id] || 0) + 1;
        SoundEngine.playChiptune(380 + Math.random() * 120, 'sine', 0.06);
        this.renderShelf();
        this.renderPours();
        this.renderGlass();
      },
      unpour(id) {
        if (!this.pours[id]) return;
        this.pours[id]--;
        if (!this.pours[id]) delete this.pours[id];
        this.renderShelf();
        this.renderPours();
        this.renderGlass();
      },
      clear() {
        this.pours = {};
        this.garnish = 'none';
        document.getElementById('lab-result').classList.add('hidden');
        this.renderControls();
        this.renderShelf();
        this.renderPours();
        this.renderGlass();
        SoundEngine.playClick();
      },

      renderPours() {
        const ul = document.getElementById('lab-pours');
        ul.innerHTML = '';
        const entries = Object.entries(this.pours);
        if (!entries.length) {
          ul.innerHTML = `<li class="label">${esc(T('lab.empty'))}</li>`;
        }
        entries.forEach(([id, n]) => {
          const ing = ING[id];
          const li = document.createElement('li');
          li.className = 'flex items-center gap-2';
          li.innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-sm border border-black" style="background:${ing.color}"></span><span class="flex-1 truncate">${esc(L(ing.name))}</span><span class="font-retro text-[15px] text-[var(--amber-2)]">${ing.unit === 'dash' ? n + ' dash' : n * ing.step + ' ml'}</span>`;
          const minus = document.createElement('button');
          minus.className = 'btn-ghost text-[var(--muted)] px-1.5';
          minus.textContent = '−';
          minus.setAttribute('aria-label', 'remove');
          minus.onclick = () => this.unpour(id);
          li.appendChild(minus);
          ul.appendChild(li);
        });
        setText('lab-volume', `${this.volume()} / ${GLASSES[this.glass].cap} ml`);
      },

      mixColor() {
        let r = 0, g = 0, b = 0, w = 0;
        Object.entries(this.pours).forEach(([id, n]) => {
          const ing = ING[id];
          const vol = n * ing.step;
          const hex = ing.color.replace('#', '');
          const cr = parseInt(hex.slice(0, 2), 16), cg = parseInt(hex.slice(2, 4), 16), cb = parseInt(hex.slice(4, 6), 16);
          const light = (cr + cg + cb) / 3;
          const pigment = ing.foam ? 0.05 : (light > 225 ? 0.18 : 1) * (ing.unit === 'dash' ? 4 : 1);
          const ww = vol * pigment;
          r += cr * ww; g += cg * ww; b += cb * ww; w += ww;
        });
        if (!w) return '#d9e6ea';
        const h = v => Math.round(v / w).toString(16).padStart(2, '0');
        return '#' + h(r) + h(g) + h(b);
      },

      renderGlass() {
        const wrap = document.getElementById('lab-glass-wrap');
        const cap = GLASSES[this.glass].cap;
        const vol = this.volume();
        const fill = Math.min(1, vol / cap);
        const color = this.mixColor();
        const fizz = Object.keys(this.pours).some(id => ING[id].fizz);
        const foam = Object.keys(this.pours).some(id => ING[id].foam);
        const g = this.glass;

        // inner (liquid) area box and outline path per glass
        const shapes = {
          coupe:   { path: 'M22 52 Q85 128 148 52', inner: 'M26 54 Q85 124 144 54 Z', box: [26, 54, 144, 118], stem: '<rect x="82" y="118" width="6" height="56" fill="rgba(255,255,255,.35)"/><ellipse cx="85" cy="178" rx="34" ry="6" fill="rgba(255,255,255,.3)"/>', rim: [22, 148, 52] },
          nick:    { path: 'M44 40 Q44 120 85 124 Q126 120 126 40', inner: 'M48 42 Q48 116 85 120 Q122 116 122 42 Z', box: [48, 42, 122, 120], stem: '<rect x="82" y="122" width="6" height="52" fill="rgba(255,255,255,.35)"/><ellipse cx="85" cy="178" rx="30" ry="6" fill="rgba(255,255,255,.3)"/>', rim: [44, 126, 40] },
          rocks:   { path: 'M36 70 L44 180 L126 180 L134 70', inner: 'M40 72 L47 172 L123 172 L130 72 Z', box: [40, 72, 130, 172], stem: '<rect x="44" y="172" width="82" height="10" fill="rgba(255,255,255,.35)"/>', rim: [36, 134, 70] },
          highball:{ path: 'M50 18 L56 186 L114 186 L120 18', inner: 'M54 20 L59 180 L111 180 L116 20 Z', box: [54, 20, 116, 180], stem: '<rect x="56" y="180" width="58" height="8" fill="rgba(255,255,255,.35)"/>', rim: [50, 120, 18] }
        };
        const s = shapes[g];
        const [x1, y1, x2, y2] = s.box;
        const lvl = y2 - (y2 - y1) * fill;
        let ice = '';
        if (vol > 0 || this.ice !== 'none') {
          const ib = [];
          if (this.ice === 'cubes') { for (let i = 0; i < 4; i++) ib.push([x1 + 8 + (i % 2) * 30, y2 - 30 - Math.floor(i / 2) * 26, 24]); }
          if (this.ice === 'rock') ib.push([(x1 + x2) / 2 - 22, y2 - 50, 44]);
          if (this.ice === 'crushed') { for (let i = 0; i < 14; i++) ib.push([x1 + 4 + Math.random() * (x2 - x1 - 16), y1 + 10 + Math.random() * (y2 - y1 - 20), 8]); }
          ice = ib.map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="3" fill="rgba(235,248,255,.45)" stroke="rgba(255,255,255,.7)" stroke-width="1"/>`).join('');
        }
        let bubbles = '';
        if (fizz && vol) {
          for (let i = 0; i < 8; i++) {
            const bx = x1 + 8 + Math.random() * (x2 - x1 - 16);
            const dur = (1.6 + Math.random() * 1.8).toFixed(2);
            bubbles += `<circle cx="${bx}" cy="${y2 - 4}" r="1.6" fill="rgba(255,255,255,.75)"><animate attributeName="cy" from="${y2 - 4}" to="${lvl + 2}" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="${dur}s" repeatCount="indefinite"/></circle>`;
          }
        }
        const foamLayer = (foam && vol) ? `<rect x="${x1 - 10}" y="${lvl - 1}" width="${x2 - x1 + 20}" height="9" fill="#fbf4e6" opacity=".95"/>` : '';
        const garn = this.garnish !== 'none' ? `<text x="${s.rim[1] - 14}" y="${s.rim[2] + 4}" font-size="22">${GARNISHES[this.garnish]}</text>` : '';

        wrap.innerHTML = `
          <svg viewBox="0 0 170 200" width="170" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs><clipPath id="glass-clip"><path d="${s.inner}"/></clipPath>
              <linearGradient id="liq" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".92"/><stop offset="1" stop-color="${color}" stop-opacity="1"/></linearGradient></defs>
            <ellipse cx="85" cy="192" rx="56" ry="6" fill="rgba(0,0,0,.35)"/>
            <g clip-path="url(#glass-clip)">
              ${vol ? `<rect x="0" y="${lvl}" width="170" height="200" fill="url(#liq)"><animate attributeName="y" from="${y2}" to="${lvl}" dur=".35s" fill="freeze"/></rect>` : ''}
              ${foamLayer}${ice}${bubbles}
              <rect x="${x1 + 6}" y="${y1}" width="6" height="${y2 - y1}" fill="rgba(255,255,255,.18)"/>
            </g>
            <path d="${s.path}" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="3" stroke-linejoin="round"/>
            ${s.stem}
            ${garn}
          </svg>`;
      },

      profile() {
        const V = this.volume();
        const dilMethod = { shake: this.ice === 'crushed' ? 0.32 : 0.25, stir: 0.18, build: { none: 0, rock: 0.06, cubes: 0.1, crushed: 0.18 }[this.ice] }[this.method];
        const Vf = V * (1 + dilMethod) || 1;
        let alc = 0, sweet = 0, sour = 0, bitter = 0, aroma = 0;
        const ids = Object.keys(this.pours);
        ids.forEach(id => {
          const ing = ING[id];
          const vol = this.pours[id] * ing.step;
          alc += vol * ing.abv;
          sweet += vol * ing.sweet;
          sour += vol * ing.sour;
          bitter += vol * ing.bitter;
          aroma += vol * ing.aroma;
        });
        const k = 100 / Vf;
        const p = {
          volume: V,
          abv: Math.round(alc / Vf * 1000) / 10,
          sweet: Math.round(sweet * k * 10) / 10,
          sour: Math.round(sour * k * 10) / 10,
          bitter: Math.round(bitter * k * 10) / 10,
          aroma: Math.round(aroma * k * 10) / 10,
          has: ids
        };
        if (alc === 0) p.abv = 0;

        // judgement
        const notes = [];
        let score = 74;
        const citrus = ids.some(id => ING[id].cat === 'sour' && !ING[id].foam);
        const fizz = ids.some(id => ING[id].fizz);
        if (V < 30) { notes.push('tiny'); score = 20; }
        else {
          if (p.abv > 38) { notes.push('tooStrong'); score -= 30; }
          else if (p.abv > 0 && p.abv < 4) { notes.push('watery'); score -= 22; }
          if (p.sweet > 28 && p.sour < p.sweet * 0.5) { notes.push('tooSweet'); score -= 24; }
          if (p.sour > 26 && p.sweet < p.sour * 0.45) { notes.push('tooSour'); score -= 24; }
          if (p.bitter > 32 && p.sweet < 10) { notes.push('tooBitter'); score -= 18; }
          const balanced = p.sour >= 8 && p.sweet >= 6 && p.sour / p.sweet >= 0.7 && p.sour / p.sweet <= 1.9;
          if (balanced) { score += 12; }
          if (!citrus && p.bitter >= 8 && p.sweet >= 6 && p.bitter <= 30) score += 8; // stirred, spirit-forward balance
          if (p.sweet < 5 && p.sour < 5 && p.bitter < 5 && p.aroma < 12 && p.abv < 15) { notes.push('flat'); score -= 12; }
          if (p.aroma >= 14 && p.aroma <= 45) score += 5;
          if (this.garnish !== 'none') score += 3;
          if (citrus && this.method === 'shake') score += 5;
          if (citrus && this.method === 'stir') score -= 6;
          if (!citrus && !fizz && this.method === 'stir') score += 5;
          if (fizz && this.method === 'shake') score -= 10;
          if (ids.includes('egg_white') && this.method === 'shake') score += 4;
          if (ids.length >= 7) score -= 6;
          if (balanced && !notes.length) notes.push('balanced');
        }
        p.score = Math.max(5, Math.min(99, Math.round(score)));
        if (p.score >= 88 && !notes.some(n => n.startsWith('too'))) notes.unshift('great');

        // classic detection
        const h = {
          n: ids.length,
          has: id => ids.includes(id),
          only: list => ids.length === list.length && list.every(x => ids.includes(x)),
          ratio: (list, min) => {
            const v = list.map(x => (this.pours[x] || 0) * ING[x].step);
            return Math.min(...v) / Math.max(...v) >= min;
          }
        };
        p.classic = null;
        for (const [k2, c] of Object.entries(CLASSICS)) { if (c.test(h)) { p.classic = k2; break; } }
        p.notes = notes;
        return p;
      },

      verdictText(p) {
        const V = WeiPlus.verdict;
        const parts = [];
        if (p.notes.includes('tiny')) return L(V.tiny);
        const main = p.notes.find(n => n !== 'balanced' && n !== 'great') || (p.notes.includes('great') ? 'great' : p.notes.includes('balanced') ? 'balanced' : null);
        if (p.abv === 0 && !p.notes.some(n => n.startsWith('too'))) parts.push(L(V.mocktail));
        if (main && V[main]) parts.push(L(V[main]));
        if (p.notes.includes('great') && main !== 'great') parts.push(L(V.great));
        if (p.classic) parts.push(fmt(L(V.classic), { text: L(CLASSICS[p.classic].name) }));
        if (p.has.includes('baijiu')) parts.push(L(V.baijiu));
        if (p.has.some(h => ['espresso', 'coldbrew', 'coffee_liq'].includes(h)) && p.abv > 0) parts.push(L(V.coffee));
        if (!parts.length) parts.push(L(V.balanced));
        return parts.join(' ');
      },

      mix() {
        if (!this.volume()) { showToast(T('lab.needMix')); return; }
        const wrap = document.getElementById('lab-glass-wrap');
        wrap.classList.remove('shaking');
        void wrap.offsetWidth;
        if (this.method === 'shake') { wrap.classList.add('shaking'); SoundEngine.playShaker(); setTimeout(() => SoundEngine.playShaker(), 350); }
        else SoundEngine.playChiptune(520, 'sine', 0.2);
        setTimeout(() => SoundEngine.playClink(), 700);

        const p = this.profile();
        this.last = p;
        const res = document.getElementById('lab-result');
        res.classList.remove('hidden');
        const bars = [
          ['strength', Math.min(100, p.abv / 40 * 100), '#e0826a', p.abv + '%'],
          ['sweet', Math.min(100, p.sweet / 35 * 100), '#ffd08a', Math.round(p.sweet)],
          ['sour', Math.min(100, p.sour / 35 * 100), '#c7d86a', Math.round(p.sour)],
          ['bitter', Math.min(100, p.bitter / 35 * 100), '#b07a55', Math.round(p.bitter)],
          ['aroma', Math.min(100, p.aroma / 60 * 100), '#9cc29a', Math.round(p.aroma)]
        ];
        document.getElementById('lab-bars').innerHTML = bars.map(([k, w, c, v]) =>
          `<div class="bar-row"><span class="text-[var(--muted)]">${esc(T('lab.b.' + k))}</span><span class="bar-track"><span class="bar-fill block" style="width:${w}%;background:${c}"></span></span><span class="text-right text-[var(--amber-2)]">${v}</span></div>`).join('');
        setText('lab-verdict', 'Wei: ' + this.verdictText(p));
        if (window.innerWidth < 1240) setTimeout(() => res.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 250);

        DB.log('lab_mix', { pours: this.pours, glass: this.glass, method: this.method, score: p.score });
        this.checkChallenge(p);
      },

      record() {
        const p = this.last || this.profile();
        return {
          name: Patron.clean(document.getElementById('lab-name').value).slice(0, 40),
          note: String(document.getElementById('lab-note').value || '').trim().slice(0, 120),
          glass: this.glass, ice: this.ice, method: this.method, garnish: this.garnish,
          pours: Object.entries(this.pours).map(([id, n]) => ({ id, ml: n * ING[id].step })),
          color: this.mixColor(),
          profile: { abv: p.abv, sweet: p.sweet, sour: p.sour, bitter: p.bitter, aroma: p.aroma }
        };
      },

      async save() {
        const rec = this.record();
        if (!rec.pours.length) { showToast(T('lab.needMix')); return; }
        if (!rec.name) { showToast(T('lab.needName')); document.getElementById('lab-name').focus(); return; }
        const btn = document.getElementById('lab-save-btn');
        btn.disabled = true;
        const row = await DB.insert('cocktails', Object.assign({ patron: Patron.name, likes: 0, lang: AppState.lang }, rec));
        btn.disabled = false;
        showToast(T('lab.saved'));
        SoundEngine.playSparkle(true);
        WeiMemory.note('lab', rec.name);
        this.lastSaved = row;
      },

      serveHere() {
        const rec = this.record();
        if (!rec.pours.length) { showToast(T('lab.needMix')); return; }
        if (!rec.name) rec.name = T('lab.tabMix');
        Lab.serveRecord(Object.assign({ patron: Patron.name }, rec));
      },

      describe(rec) {
        return rec.pours.map(p => `${ING[p.id] ? (ING[p.id].unit === 'dash' ? Math.round(p.ml / ING[p.id].step) + ' dash ' : p.ml + 'ml ') + L(ING[p.id].name) : p.id}`).join(' • ');
      },

      serveRecord(rec) {
        go('counter');
        const awake = AppState.weiState === 'awake';
        const glassLbl = T('lab.g.' + (rec.glass || 'coupe'));
        showServed({
          icon: GARNISHES[rec.garnish] && rec.garnish !== 'none' ? GARNISHES[rec.garnish] : '🍸',
          name: rec.name,
          sub: `${T('lab.by')} ${rec.patron || '—'} · ${glassLbl} · ${T('lab.m.' + (rec.method || 'shake'))}`,
          desc: rec.note ? `"${rec.note}"` : (rec.profile ? `${rec.profile.abv}%` : ''),
          formula: this.describe(rec),
          reactable: awake
        });
        if (awake) animateWei('wei-wiggle');
        DB.log('order_guest', { name: rec.name, by: rec.patron });
      },

      remix(rec) {
        this.pours = {};
        rec.pours.forEach(p => { if (ING[p.id]) this.pours[p.id] = Math.max(1, Math.round(p.ml / ING[p.id].step)); });
        this.glass = rec.glass || 'coupe'; this.ice = rec.ice || 'none'; this.method = rec.method || 'shake'; this.garnish = rec.garnish || 'none';
        document.getElementById('lab-name').value = '';
        this.tab('mix');
        this.renderControls(); this.renderShelf(); this.renderPours(); this.renderGlass();
      },

      async loadBook(sort) {
        this.bookSort = sort;
        document.querySelectorAll('[data-booksort]').forEach(b => b.classList.toggle('active', b.dataset.booksort === sort));
        const list = document.getElementById('lab-book-list');
        list.innerHTML = `<p class="label">${esc(T('common.loading'))}</p>`;
        let rows = await DB.list('cocktails', sort === 'mine' ? { eq: { patron: Patron.name }, limit: 60 } : { limit: 60 });
        if (!rows.length && sort !== 'mine') rows = SEEDS.cocktails.slice();
        list.innerHTML = '';
        if (!rows.length) { list.innerHTML = `<p class="label">${esc(T('lab.bookEmpty'))}</p>`; return; }
        rows.forEach(rec => list.appendChild(this.bookCard(rec)));
      },

      bookCard(rec) {
        const card = document.createElement('div');
        card.className = 'panel p-3 flex flex-col gap-2';
        const p = rec.profile || {};
        card.innerHTML = `
          <div class="flex items-start gap-3">
            <span class="shrink-0 w-10 h-12 rounded-b-lg rounded-t-sm border-2 border-black" style="background:linear-gradient(180deg,transparent 18%,${esc(rec.color || '#d9e6ea')} 18%)"></span>
            <div class="min-w-0 flex-1">
              <div class="font-semibold text-[var(--amber-2)] truncate">${esc(rec.name)} <span class="text-[16px]">${GARNISHES[rec.garnish] && rec.garnish !== 'none' ? GARNISHES[rec.garnish] : ''}</span></div>
              <div class="label">${esc(T('lab.by'))} ${esc(rec.patron)} · ${esc(timeAgo(rec.created_at))}</div>
              <div class="font-retro text-[15px] text-[#e8d6b4] mt-0.5">${p.abv ?? '?'}% · ${esc(T('lab.b.sweet'))} ${Math.round(p.sweet || 0)} · ${esc(T('lab.b.sour'))} ${Math.round(p.sour || 0)} · ${esc(T('lab.b.bitter'))} ${Math.round(p.bitter || 0)}</div>
            </div>
          </div>
          ${rec.note ? `<p class="text-[13px] italic text-[#e8d6b4]">"${esc(rec.note)}"</p>` : ''}
          <p class="text-[12px] text-[var(--muted)] leading-snug">${esc(this.describe(rec))}</p>`;
        const row = document.createElement('div');
        row.className = 'flex gap-1.5 mt-auto';
        const like = document.createElement('button');
        like.className = 'chip';
        like.innerHTML = '♥';   /* a heart, never a count */
        try { if (localStorage.getItem('weis-liked:' + rec.id)) like.classList.add('active'); } catch (e) {}
        like.onclick = async () => {
          const k = 'weis-liked:' + rec.id;
          try { if (localStorage.getItem(k)) return; localStorage.setItem(k, '1'); } catch (e) {}
          rec.likes = (rec.likes || 0) + 1;
          like.classList.add('active');
          SoundEngine.playSparkle(false);
          DB.bump('cocktails', rec.id, 'likes');
          DB.log('like', { cocktail: rec.name, by: rec.patron });
        };
        const order = document.createElement('button');
        order.className = 'chip';
        order.textContent = '🍸 ' + T('lab.order');
        order.onclick = () => this.serveRecord(rec);
        const remix = document.createElement('button');
        remix.className = 'chip';
        remix.textContent = '🧪 Remix';
        remix.onclick = () => this.remix(rec);
        row.append(like, order, remix);
        card.appendChild(row);
        return card;
      },

      /* Challenges from Wei */
      setChallenge(ch) {
        this.challenge = ch;
        try { localStorage.setItem('weis-challenge:' + Patron.name, ch ? ch.id : ''); } catch (e) {}
        this.renderChallenge();
      },
      loadChallenge() {
        try {
          const id = localStorage.getItem('weis-challenge:' + Patron.name);
          this.challenge = WeiPlus.challenges.concat([WeiPlus.fizz], WeiPlus.holidays).find(c => c.id === id) || null;
        } catch (e) { this.challenge = null; }
        this.renderChallenge();
      },
      renderChallenge() {
        const el = document.getElementById('lab-challenge');
        if (!el) return;
        if (!this.challenge) { el.classList.add('hidden'); return; }
        el.classList.remove('hidden');
        el.innerHTML = `<span class="text-[18px]">🎯</span><span><b>${esc(T('lab.challenge'))}:</b> ${esc(L(this.challenge.ask))}</span>`;
      },
      checkChallenge(p) {
        if (!this.challenge) return;
        if (this.challenge.check(p)) {
          const id = this.challenge.id;
          this.setChallenge(null);
          showToast('🎯 ' + T('lab.challengeDone'));
          SoundEngine.playSparkle(true);
          WeiMemory.note('challenge', id);
          DB.log('challenge_done', { id, score: p.score });
        }
      }
    };
  
