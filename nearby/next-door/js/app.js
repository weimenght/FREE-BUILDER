    /* ===================== APP SHELL ===================== */
    let currentRoom = 'counter';

    // Wei remembers what you did elsewhere and mentions it back at the counter
    const WeiMemory = {
      pending: null,
      note(kind, text) { this.pending = { kind, text }; },
      flush() {
        const p = this.pending;
        if (!p || AppState.weiState !== 'awake') return;
        this.pending = null;
        let line = null;
        if (p.kind === 'lab') line = fmt(L(WeiPlus.afterLab), { text: p.text });
        else if (p.kind === 'challenge') { line = L(WeiPlus.challengeDone).replace(/"/g, ''); setExpression('grin', 3000); animateWei('wei-hop'); }
        if (line) setTimeout(() => { if (AppState.uiMode !== 'topic' || (window.NDChat && NDChat.busy())) return; showBubble(line); setExpression('grin', 1800); }, 450);
      }
    };

    /* the rooms: the counter, the Lab (behind it), the jukebox (where the studio was) and the Wall */
    function go(room) {
      if (!document.getElementById('room-' + room)) return;
      /* the Lab is behind the counter: you only get in while nobody's watching and you sneak round (openSneakMixer) */
      if (room === 'lab' && !(AppState.weiState === 'asleep' && document.body.classList.contains('lab-open'))) room = 'counter';
      currentRoom = room;
      document.querySelectorAll('.room').forEach(r => r.classList.toggle('hidden', r.id !== 'room-' + room));
      SoundEngine.playClick();
      if (room === 'counter') { WeiMemory.flush(); Cats.renderAll(); }
      if (room === 'lab') NDLazy.load('lab').then(() => { Lab.renderControls(); Lab.renderShelf(); Lab.renderGlass(); }, () => {});   /* the Lab's script arrives on first use (lazy.js) */
      if (room === 'wall') Wall.onEnter();
      DB.log('room', { room });
      try { history.replaceState(null, '', '#' + room); } catch (e) {}
    }
    function openSneakMixer() { SoundEngine.playClick(); document.body.classList.add('lab-open'); go('lab'); }
    /* whoever was asleep wakes up: back to your side of the counter */
    setInterval(() => {
      if (!document.body.classList.contains('lab-open') || AppState.weiState === 'asleep') return;
      document.body.classList.remove('lab-open');
      if (currentRoom === 'lab') { go('counter'); showToast(L(lx(["Wei woke up — back to your side of the counter!", "Wei 醒了，快回到吧台外面！", "Wei 醒了，快回到吧台外面！", "Wei 醒咗！快啲返出吧枱！", "¡Wei se ha despertado! Vuelve a tu lado de la barra.", "En Wei s'ha despertat! Torna al teu costat de la barra."]))); }
    }, 1000);

    /* ---------------- Language ---------------- */
    function langPref() {
      try { return localStorage.getItem('weis-lang'); } catch (e) { return null; }
    }

    function openLangMenu(anchor) {
      const m = document.getElementById('lang-menu');
      if (!m.classList.contains('hidden')) { m.classList.add('hidden'); return; }
      m.innerHTML = '';
      const auto = document.createElement('button');
      auto.innerHTML = `<span>🌐 Auto · ${esc(LANG_META[detectBrowserLang()].name)}</span><span>${langPref() ? '' : '✓'}</span>`;
      auto.className = langPref() ? '' : 'active';
      auto.onclick = () => { try { localStorage.removeItem('weis-lang'); } catch (e) {} setLanguage(detectBrowserLang()); m.classList.add('hidden'); };
      m.appendChild(auto);
      LANGS.forEach(lg => {
        const b = document.createElement('button');
        b.className = (langPref() === lg) ? 'active' : '';
        b.innerHTML = `<span>${esc(LANG_META[lg].name)}</span><span class="font-retro">${LANG_META[lg].short}</span>`;
        b.onclick = () => { try { localStorage.setItem('weis-lang', lg); } catch (e) {} setLanguage(lg); m.classList.add('hidden'); };
        m.appendChild(b);
      });
      const r = anchor.getBoundingClientRect();
      m.classList.remove('hidden');
      const mw = m.offsetWidth;
      m.style.top = (r.bottom + 6) + 'px';
      m.style.left = Math.max(8, Math.min(window.innerWidth - mw - 8, r.right - mw)) + 'px';
      m.style.position = 'fixed';
    }
    document.addEventListener('click', (e) => {
      const m = document.getElementById('lang-menu');
      if (m && !m.classList.contains('hidden') && !e.target.closest('#lang-menu') && !e.target.closest('[aria-haspopup="menu"]')) m.classList.add('hidden');
    });

    function setLanguage(lg) {
      if (!LANGS.includes(lg)) lg = 'en';
      AppState.lang = lg;
      if (lg === 'tw' || lg === 'yue') Zh.ensure();
      applyLanguage();
      DB.log('lang', { lang: lg });
    }

    function applyLanguage(soft) {
      const lg = AppState.lang;
      document.documentElement.lang = LANG_META[lg].html;
      document.querySelectorAll('.lang-short').forEach(el => { el.textContent = LANG_META[lg].short; });
      document.querySelectorAll('[data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
      document.querySelectorAll('[data-tp]').forEach(el => { el.placeholder = T(el.dataset.tp); });
      document.querySelectorAll('[data-ta]').forEach(el => { el.setAttribute('aria-label', T(el.dataset.ta)); el.title = T(el.dataset.ta); });
      const t = i18n[lg];
      ['resBtnReorder:res-btn-reorder', 'resBtnCheers:res-btn-cheers']
        .forEach(pair => { const [k, id] = pair.split(':'); setText(id, t[k]); });
      DB.badge();
      updateClockHands(AppState.hour);
      Cats.renderAll();
      if (typeof Lab !== 'undefined' && Lab.renderControls) { Lab.renderControls(); Lab.renderShelf(); Lab.renderPours(); }
      if (AppState.inSanctuary && !soft) {
        AppState.currentTopic = AppState.currentTopic || null;
        if (!document.getElementById('rpg-dialogue-screen').classList.contains('hidden') || AppState.weiState === 'asleep') renderCurrentDialogue();
      }
      if (AppState.inSanctuary && currentRoom === 'wall') Wall.onEnter();
    }

    /* ---------------- Walking in (no door: you're in) ---------------- */
    function nickname() {
      const NICK = { en: ['Night Owl', 'Rain Walker', 'Lantern', 'Stray Cat', 'Tea Ghost'], zh: ['夜猫子', '雨中人', '灯笼', '流浪猫', '茶客'], tw: ['夜貓子', '雨中人', '燈籠', '流浪貓', '茶客'], yue: ['夜貓子', '雨中人', '燈籠', '流浪貓', '茶客'], es: ['Búho', 'Paseante', 'Farol', 'Gato callejero', 'Fantasma del té'], ca: ['Mussol', 'Passejant', 'Fanal', 'Gat del carrer', 'Fantasma del te'] };
      const list = NICK[AppState.lang] || NICK.en;
      return list[Math.floor(Math.random() * list.length)] + ' ' + (10 + Math.floor(Math.random() * 90));
    }
    async function enterSanctuary() {
      const name = Patron.clean(Patron.name) || nickname();

      Patron.name = name;
      Bond.load();
      if (typeof Lab !== 'undefined') Lab.loadChallenge();   /* otherwise lazy.js runs it when the Lab arrives */
      /* walk in at once: saying hello to the server happens behind you (it used to hold the door until the network answered) */
      Patron.enter(name).catch(() => {});

      AppState.inSanctuary = true;
      setText('patron-chip-name', name);

      if (window.FBWorld) setWeather(FBWorld.weather(), false);   // Nearby's weather, same in every place

      AppState.weiEnergy = Math.floor(Math.random() * 2) + 3;

      Bond.visits++;
      Bond.giftsTonight = 0;
      Bond.save();

      document.getElementById('view-sanctuary').classList.remove('hidden');

      const hashRoom = (location.hash || '').slice(1).split('-')[0];
      go(['counter', 'studio', 'wall'].includes(hashRoom) ? hashRoom : 'counter');   /* #studio is the jukebox, #wall the postcards */

      evaluateWeiState();
      Cats.syncSleep();
      Cats.renderAll();
      setExpression('smile');
      AppState.currentTopic = null;
      if (AppState.weiState === 'awake') renderWei(L(pick(WEI_WORK)), [], DEFAULT_GRID, 'topic'); else renderCurrentDialogue();
      resetIdle();

      try { if (window.NDJuke) NDJuke.on(); } catch (e) {}   /* the jukebox is the bar's music: it starts when you come in */

      if (AppState.weiState === 'awake') {
        const greetPool = Bond.visits <= 1 ? WeiText.greet.first : WeiText.greet.back.concat(WeiText.greet.friend);
        /* Wei doesn't open with a speech: he goes on with his work, and says hello when you speak to him (tap him) */
        AppState.greetLater = L(pick(greetPool));
      }
    }

    /* no door any more: tap your name to change what Wei calls you */
    function returnToDoor() {
      SoundEngine.playClick();
      let m = document.getElementById('name-sheet'); if (m) { m.remove(); return; }
      m = document.createElement('form'); m.id = 'name-sheet'; m.setAttribute('role', 'dialog');
      m.style.cssText = 'position:fixed;left:50%;top:calc(var(--head-h,0px) + var(--safe-t,0px) + 48px);transform:translateX(-50%);z-index:96;width:min(320px,calc(100vw - 24px));padding:12px;background:#2a1a10;border:3px solid #000;box-shadow:4px 4px 0 #000;display:grid;gap:8px';
      m.innerHTML = '<label class="label"></label><input class="field" maxlength="24" autocomplete="nickname" data-fb-nick-show required><button type="submit" class="btn btn-amber">✓</button>';
      m.querySelector('label').textContent = T('door.nameLabel'); const inp = m.querySelector('input'); inp.value = Patron.name || '';
      m.onsubmit = async (e) => { e.preventDefault(); const n = Patron.clean(inp.value); if (!n) { inp.focus(); return; } Patron.name = n; setText('patron-chip-name', n); m.remove(); try { localStorage.setItem('fb_nick', n); localStorage.setItem('fb_nick_asked', '1'); } catch (x) {} try { await Patron.enter(n); } catch (x) {} };
      document.body.appendChild(m); setTimeout(() => inp.focus(), 30);
    }
    function followTown() {   /* the town's clock moves on while you sit here */
      if (!window.FBWorld || !AppState.inSanctuary) return;
      const wasBar = AppState.isBarOpen; updateClockHands(FBWorld.hour());
      if (FBWorld.weather() !== AppState.weather) setWeather(FBWorld.weather());
      if (wasBar !== AppState.isBarOpen && AppState.uiMode !== 'served') { AppState.currentTopic = null; try { evaluateWeiState(); renderCurrentDialogue(); } catch (e) {} }
    }
    setInterval(followTown, 15000); addEventListener('fbback', followTown);

    function tapLogo() {
      SoundEngine.playClink();
      document.body.style.filter = 'brightness(1.2)';
      setTimeout(() => { document.body.style.filter = ''; }, 120);
    }

    /* ---------------- Menu (codex) ---------------- */
    function toggleCodexModal(show) {
      SoundEngine.playClick();
      document.getElementById('codex-modal').classList.toggle('hidden', !show);
      if (show) { populateCodexContent(); switchAlbumTab('gt'); hostMenu(); }
    }

    function switchAlbumTab(tab) {
      SoundEngine.playClick();
      ['gt', 'guest', 'tap'].forEach(k => {   /* no Classics tab: the classics turn up in conversation instead */
        const pn = document.getElementById('album-pane-' + k), tb = document.getElementById('tab-btn-' + k);
        if (pn) pn.classList.toggle('hidden', k !== tab);
        if (tb) tb.classList.toggle('active', k === tab);
      });
      if (tab === 'guest') loadGuestMenu();
      if (tab === 'tap') loadTapMenu();
    }

    /* Beers brewed by visitors at Neighbours' Brew and shipped to this bar. */
    async function loadTapMenu() {
      const pane = document.getElementById('album-pane-tap');
      pane.innerHTML = `<p class="label">${esc(T('common.loading'))}</p>`;
      let rows = [];
      try {
        const u = SUPABASE_CONFIG.url;
        if (u) { const r = await fetch(u + '/rest/v1/rpc/beer_list?p_venue=bar&p_sort=new', { headers: { apikey: SUPABASE_CONFIG.anonKey, Authorization: 'Bearer ' + SUPABASE_CONFIG.anonKey } }); if (r.ok) rows = await r.json(); }
      } catch (e) {}
      pane.innerHTML = '';
      if (!rows || !rows.length) { pane.innerHTML = `<p class="hint">${esc(T('menu.tapEmpty'))}</p>`; }
      (rows || []).forEach(b => {
        const abv = ((b.recipe && b.recipe.abv) || 5).toFixed(1);
        const el = menuItem('🍺', `${b.name} · ${T('lab.by')} ${b.brewer}`, `${b.style} · ${abv}%`, () => { toggleCodexModal(false); go('counter'); pourBeer(b); });
        const sw = document.createElement('i'); sw.style.cssText = `float:right;width:14px;height:14px;border:2px solid #000;background:${/^#[0-9a-f]{6}$/i.test(b.color) ? b.color : '#e8a030'}`; el.prepend(sw);
        pane.appendChild(el);
      });
      const a = document.createElement('a'); a.href = '/nearby/neighbours-brew/'; a.className = 'opt-btn w-full !block text-center'; a.textContent = '🏭 ' + T('menu.tapBrew'); pane.appendChild(a);
    }
    function pourBeer(b) {
      try { SoundEngine.playClick(); } catch (e) {}
      showBubble(T('menu.tapPour').replace('{b}', b.name).replace('{w}', b.brewer), 3600);
      setTimeout(() => { try { SoundEngine.playClink(); } catch (e) {} }, 900);
      try { const u = SUPABASE_CONFIG.url; if (u) fetch(u + '/rest/v1/rpc/beer_pour', { method: 'POST', headers: { apikey: SUPABASE_CONFIG.anonKey, Authorization: 'Bearer ' + SUPABASE_CONFIG.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_id: b.id }) }).catch(() => {}); } catch (e) {}
    }

    function menuItem(icon, title, desc, onClick) {
      const div = document.createElement('button');
      div.className = 'opt-btn w-full !block';
      div.innerHTML = `<div class="font-semibold text-[var(--amber-2)] text-[14px]">${icon} ${esc(title)}</div><p class="text-[12.5px] text-[#e8d6b4] mt-0.5 leading-snug">${esc(desc)}</p>`;
      div.onclick = onClick;
      return div;
    }

    /* the host makes it their own way: Wei the drink, Mei a (bad) coffee or tea but no cocktails, Popo food instead,
       the cats whatever Miso sits on, Mantou whatever a dog brings */
    /* who is behind the counter right now: the host if they're up, the cats if they keep it for them, or nobody */
    function menuHost() { try { return window.NDChat ? NDChat.who() : (AppState.weiState === 'awake' ? 'wei' : null); } catch (e) { return null; } }
    const MENU_NOBODY = lx(["Nobody's behind the counter right now.", "吧台后面现在没人。", "吧台後面現在沒人。", "吧枱後面而家冇人。", "Ahora no hay nadie detrás de la barra.", "Ara no hi ha ningú darrere la barra."]);
    function hostMakes(key) {
      const h = menuHost(), d = DrinkManifest[key] || {};
      if (!h) return openSneakMixer();
      if (h === 'mei' && window.NDMeiMake) return NDMeiMake(key);
      if (h === 'popo' && window.NDPopoCook) return NDPopoCook(d.type === 'bar');
      if (h === 'mantou' && window.NDDogBring) return NDDogBring();
      if (h === 'cats' && window.NDCatServe) return NDCatServe('pick');
      serveItemByKey(key);
    }
    const MENU_HINT = {
      mei: lx(["Tap a coffee or a tea and Mei will make it. Cocktails wait for Wei.", "点一杯咖啡或茶，Mei 来做。鸡尾酒等 Wei 回来。", "點一杯咖啡或茶，Mei 來做。雞尾酒等 Wei 回來。", "點一杯咖啡或者茶，Mei 嚟整。雞尾酒等 Wei 返嚟。", "Toca un café o un té y Mei lo prepara. Los cócteles esperan a Wei.", "Toca un cafè o un te i la Mei el prepara. Els còctels esperen en Wei."]),
      popo: lx(["Tap a dish and Popo cooks it. Finish your bowl.", "点一道菜，婆婆煮。要吃完呀。", "揀一味，婆婆煮。要食晒呀。", "揀一味，婆婆煮。要食晒呀。", "Toca un plato y Popo lo cocina. Termina tu cuenco.", "Toca un plat i la Popo el cuina. Acaba't el bol."]),
      cats: lx(["Tap one. A cat pushes it across.", "点一样。猫会把它推过来。", "點一樣。貓會把它推過來。", "揀一樣。隻貓會推過嚟。", "Toca uno. Un gato te lo acerca.", "Toca'n un. Un gat te l'acosta."]),
      mantou: lx(["Tap one. Mantou fetches it.", "点一样。馒头去叼来。", "點一樣。饅頭去叼來。", "揀一樣。饅頭去擔嚟。", "Toca uno. Mantou te lo trae.", "Toca'n un. En Mantou te'l porta."])
    };
    /* the menu itself is the host's: Wei's drinks (with the tabs), Mei's coffees and teas, Popo's kitchen, the cats' menu, what Mantou can fetch */
    const MENU_TITLE = {
      mei: lx(["Mei's menu", "Mei 的菜单", "Mei 的菜單", "Mei 嘅餐牌", "La carta de Mei", "La carta de la Mei"]),
      popo: lx(["Popo's kitchen", "婆婆的厨房", "婆婆的廚房", "婆婆嘅廚房", "La cocina de Popo", "La cuina de la Popo"]),
      cats: lx(["The cats' menu", "猫咪菜单", "貓咪菜單", "貓貓餐牌", "La carta de los gatos", "La carta dels gats"]),
      mantou: lx(["What Mantou can fetch", "馒头能叼来的", "饅頭能叼來的", "饅頭擔得嚟嘅", "Lo que Mantou puede traer", "El que en Mantou pot portar"])
    };
    function hostMenu() {
      const h = menuHost(), pane = document.getElementById('album-pane-host'), tabs = document.querySelector('#codex-modal .tabs'), ttl = document.querySelector('#codex-modal [data-t="menu.title"]');
      const src = h ? { mei: window.NDMeiMenu, popo: window.NDPopoMenu, cats: window.NDCatMenu, mantou: window.NDDogMenu }[h]
        : () => [{ ic: '', name: '🤫 ' + i18n[AppState.lang].sleepBtnDiy, desc: '', go: () => openSneakMixer() }];   /* nobody up: never Wei's drinks from an empty bar */
      const own = !!(src && pane);
      if (tabs) tabs.style.display = own ? 'none' : '';
      ['guest', 'gt', 'tap'].forEach(k => { const el = document.getElementById('album-pane-' + k); if (el && own) el.classList.add('hidden'); });
      if (ttl) ttl.textContent = own ? (h ? L(MENU_TITLE[h]) : L(MENU_NOBODY)) : T('menu.title');
      const sub = document.getElementById('modal-sub-title'); if (sub) sub.style.visibility = own ? 'hidden' : '';
      if (!pane) return; pane.classList.toggle('hidden', !own); if (!own) return;
      pane.innerHTML = '';
      src().forEach(it => { let el = menuItem('', it.name, it.desc, () => { toggleCodexModal(false); go('counter'); it.go(); }); const t = el.querySelector('div'); if (t && it.ic) { const sp = document.createElement('span'); sp.setAttribute('aria-hidden', 'true'); sp.style.cssText = 'display:inline-block;width:18px;height:18px;vertical-align:-3px;margin-right:6px'; sp.innerHTML = it.ic; const sv = sp.querySelector('svg'); if (sv) { sv.style.width = '18px'; sv.style.height = '18px'; } t.prepend(sp); } pane.appendChild(it.real ? nearYou(el, it.real) : el); });
    }
    /* every house drink can be had for real: a small 🗺️ under it searches the visitor's own maps (BarPicks.near) */
    function nearYou(el, key) {
      const href = window.BarPicks && BarPicks.near ? BarPicks.near(key) : '';
      if (!href) return el;
      const w = document.createElement('div'); w.className = 'nd-mi'; w.appendChild(el);
      const a = document.createElement('a'); a.className = 'nd-near'; a.href = href; if (/^https:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
      a.textContent = BarPicks.nearLabel ? BarPicks.nearLabel() : '🗺️'; w.appendChild(a); return w;
    }
    /* Wei's house drinks, on the stand (the rest are classics he brings up himself) */
    const SIGNATURES = { bar: ['jasmine_gulou', 'catalan', 'catalan_vermut', 'kyoto', 'smoked_rosemary', 'paperplane'], cafe: ['gesha_pourover', 'dirty_espresso', 'barceloneta_cortado', 'yunnan_honey_pour', 'coldbrew_tonic', 'matcha_cloud'] };
    function populateCodexContent() {
      try { const hn = document.querySelector('[data-t="menu.hint"]'), hh = menuHost(); if (hn) { hn.textContent = MENU_HINT[hh] ? L(MENU_HINT[hh]) : T('menu.hint'); hn.hidden = !hh; } } catch (e) {}
      const isBar = AppState.isBarOpen;
      const t = i18n[AppState.lang];
      setText('modal-sub-title', isBar ? t.modalSubBar : t.modalSubCafe);
      const sig = document.getElementById('album-pane-gt');
      if (!sig) return;
      sig.innerHTML = '';
      const signatureKeys = SIGNATURES[isBar ? 'bar' : 'cafe'];
      Object.entries(DrinkManifest).forEach(([key, d]) => {
        if (d.type !== (isBar ? 'bar' : 'cafe')) return;
        if (!signatureKeys.includes(key)) return;   /* the classics aren't on the menu: the host offers them in conversation */
        const el = menuItem(d.icon, L(d.name), L(d.desc).replace(/^"|"$/g, ''), () => { toggleCodexModal(false); go('counter'); hostMakes(key); });
        sig.appendChild(nearYou(el, key));
      });
      const nb = DrinkManifest.wei_notebook;   /* Wei's notebook: off the menu, on the stand for everyone */
      sig.appendChild(nearYou(menuItem(nb.icon, L(nb.name), L(nb.desc).replace(/^"|"$/g, ''), () => { toggleCodexModal(false); go('counter'); hostMakes('wei_notebook'); }), 'wei_notebook'));
    }

    async function loadGuestMenu() {
      const pane = document.getElementById('album-pane-guest');
      pane.innerHTML = `<p class="label">${esc(T('common.loading'))}</p>`;
      const [mine, loved] = await Promise.all([DB.list('cocktails', { eq: { patron: Patron.name }, limit: 12 }), DB.list('cocktails', { limit: 30 })]);   /* the newest, never ranked */
      const seen = new Set(); let rows = mine.concat(loved).filter(r => { const k = r.id || r.name + r.patron; if (seen.has(k)) return false; seen.add(k); return true; });
      if (!rows.length) rows = SEEDS.cocktails.slice();
      await NDLazy.load('lab').catch(() => {});   /* the garnishes live with the Lab */
      const G = typeof GARNISHES !== 'undefined' ? GARNISHES : {};
      pane.innerHTML = '';
      rows.forEach(r => pane.appendChild(menuItem(G[r.garnish] && r.garnish !== 'none' ? G[r.garnish] : '🍸', `${r.name} · ${T('lab.by')} ${r.patron}`, `${r.profile ? r.profile.abv + '% · ' : ''}${Lab.describe(r)}`, () => { toggleCodexModal(false); Lab.serveRecord(r); })));
    }

    /* ---------------- Counter engine overrides ---------------- */
    /* the name over the words: whoever is talking (Wei, Mei, Popo, Mantou or the cats), no mood label */
    function speakerTag() {
      const k = window.NDChat ? NDChat.who() : 'wei';
      if (k === 'mei') return 'MEI';
      if (k === 'popo') return L(lx(["POPO", "婆婆", "婆婆", "婆婆", "POPO", "LA POPO"]));
      if (k === 'mantou') return L(lx(["MANTOU", "馒头", "饅頭", "饅頭", "MANTOU", "EN MANTOU"]));
      if (k === 'cats') return L(lx(["MISO & YUZU", "味噌和柚子", "味噌和柚子", "味噌同柚子", "MISO Y YUZU", "LA MISO I LA YUZU"]));
      return 'WEI';
    }


    function answerRiddle(choice, answer) {
      const d = DrinkManifest[answer];
      DB.log('riddle', { answer, correct: choice === answer });
      if (choice === answer) {
        SoundEngine.playSparkle(true);
        setExpression('grin', 2500);
        animateWei('wei-hop');
        renderWei(L(pick(WeiText.riddleRight)), [
          { label: `🎁 ${L(d.name)}`, onClick: () => serveItemByKey(answer, { free: true }) },
          { label: L(WeiText.ui.another), onClick: startRiddle }
        ], "grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2", 'riddle');
      } else {
        SoundEngine.playChiptune(220, 'triangle', 0.15);
        setExpression('flat', 2000);
        renderWei(fmt(L(WeiText.riddleWrong), { drink: L(d.name) }), [
          { label: L(WeiText.ui.serveAnyway), onClick: () => serveItemByKey(answer) },
          { label: L(WeiText.ui.another), onClick: startRiddle },
          { label: L(WeiText.ui.back), onClick: backToOrder }
        ], "grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-2", 'riddle');
      }
    }

    function chatAbout(tp) {
      DB.log('chat', { topic: tp.id });
      const special = { day: chatDay, fortune: chatFortune, gossip: chatGossip, challenge: chatChallenge };
      if (special[tp.id]) { special[tp.id](); return; }
      if (tp.id === 'joke') { promptJoke(); return; }
      if (tp.id === 'offmenu') {
        serveItemByKey('wei_notebook', { line: L(WeiText.offmenu) });
        return;
      }
      const idx = Bond.lineIdx[tp.id] || 0;
      const line = tp.lines[idx % tp.lines.length];
      Bond.lineIdx[tp.id] = idx + 1;
      setExpression(tp.id === 'notebook' || tp.id === 'secret' ? 'grin' : pick(['smile', 'grin']), 2200);
      animateWei('wei-wiggle');
      renderWei(L(line), chatButtons(), COMPACT_GRID, 'chat');
    }

    function chatDay() {
      renderWei(T('chat.dayIntro'), WeiPlus.day.map(d => ({
        label: `${d.emoji} ${L(d.label)}`,
        onClick: () => {
          evaluateWeiState();
          setExpression(d.mood === 'empath' || d.mood === 'poetic' ? 'smile' : 'grin', 2400);
          DB.log('day', { mood: d.mood });
          renderWei(L(d.reply), [
            { label: '🍸 ' + L((DrinkManifest[AppState.isBarOpen ? d.bar : d.cafe] || {}).name || { en: 'Drink' }), onClick: () => serveItemByKey(AppState.isBarOpen ? d.bar : d.cafe) },
            { label: L(WeiText.ui.back), onClick: openChat }
          ], "grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2", 'chat');
        }
      })).concat([{ label: L(WeiText.ui.back), onClick: openChat }]), COMPACT_GRID, 'chat');
    }

    function chatFortune() {
      SoundEngine.playChiptune(700, 'triangle', 0.08);
      animateWei('wei-wiggle');
      const f = L(pick(WeiPlus.fortunes));
      renderWei(`${L(WeiPlus.fortuneIntro)} 「${f}」`, [
        { label: '🔮 ' + T('chat.fortune'), onClick: chatFortune },
        { label: L(WeiText.ui.back), onClick: openChat }
      ], "grid grid-cols-2 gap-1.5 mt-2", 'chat');
    }

    async function chatGossip() {
      renderWei('…', [], COMPACT_GRID, 'chat');
      const rows = (await DB.list('cocktails', { limit: 12 })).filter(r => r.patron && r.patron !== Patron.name);
      if (!rows.length && window.townTalk) { townTalk(); return; }   /* nobody's mixed anything lately: the town's news instead */
      const r = rows.length ? pick(rows) : null;
      renderWei(r ? fmt(L(WeiPlus.gossip.cocktail), { who: r.patron, text: r.name }) : L(WeiPlus.gossip.none), [
        { label: '🗞 ' + T('chat.gossip'), onClick: chatGossip },
        { label: L(WeiText.ui.back), onClick: openChat }
      ], COMPACT_GRID, 'chat');
    }

    function chatChallenge() {
      /* the first ask of the day gets today's challenge (a holiday, or the day of the week); asking again, any other */
      const day = new Date().toDateString(), T0 = WeiPlus.today();
      let first = false; try { first = localStorage.getItem('fb_lab_day') !== day; localStorage.setItem('fb_lab_day', day); } catch (e) {}
      const ch = first ? T0.ch : pick(WeiPlus.challenges.filter(c => c.id !== T0.ch.id));
      NDLazy.load('lab').then(() => Lab.setChallenge(ch), () => { try { localStorage.setItem('weis-challenge:' + Patron.name, ch.id); } catch (e) {} });
      setExpression('grin', 2000);
      DB.log('challenge_given', { id: ch.id });
      renderWei(`${first && T0.intro ? T0.intro + ' ' : ''}"${L(ch.ask)}" ${L(WeiPlus.challengeGiven)}`, [
        { label: L(WeiText.ui.back), onClick: openChat }
      ], "grid grid-cols-2 gap-1.5 mt-2", 'chat');
    }

    function doCheers() {
      SoundEngine.playClink();
      setTimeout(() => SoundEngine.playClink(), 160);
      if (AppState.weiState === 'awake') {
        showBubble('🥂 ' + L(pick(WeiPlus.cheers)), 3000);
        setExpression('grin', 2000);
        animateWei('wei-hop');
      }
      DB.log('cheers', {});
    }

    const MOONCAKE = {
      fest: lx(["Ah... a mooncake. It's Mid-Autumn and I already have eleven. ...Thank you. Sincerely.", "啊……月饼。中秋到了，我这儿已经有十一个了。……谢谢，真心的。", "啊……月餅。中秋到了，我這兒已經有十一個了。……謝謝，真心的。", "啊……月餅。中秋到喇，我呢度已經有十一個。……多謝，真心㗎。", "Ah... un pastel de luna. Es el Medio Otoño y ya tengo once. ...Gracias. De verdad.", "Ah... un pastís de lluna. És la festa de la Lluna i ja en tinc onze. ...Gràcies. De debò."]),
      other: lx(["A mooncake? Now? *turns it over* Popo will want to know where you found one. ...Thank you. Sincerely.", "月饼？现在？*翻过来看了看* 婆婆肯定要问你在哪儿找到的。……谢谢，真心的。", "月餅？現在？*翻過來看了看* 婆婆肯定要問你在哪兒找到的。……謝謝，真心的。", "月餅？而家？*反轉睇吓* 婆婆實會問你喺邊度搵到。……多謝，真心㗎。", "¿Un pastel de luna? ¿Ahora? *le da la vuelta* Popo querrá saber dónde lo has encontrado. ...Gracias. De verdad.", "Un pastís de lluna? Ara? *li dona la volta* La Popo voldrà saber on l'has trobat. ...Gràcies. De debò."])
    };
    function giveGift(g) {
      Bond.giftsTonight++;
      animateWei('wei-hop');
      setExpression(g.bond >= 2 ? 'grin' : 'flat', 2200);
      if (g.energy) { AppState.weiEnergy = Math.min(4, AppState.weiEnergy + g.energy); evaluateWeiState(); }
      if (g.cats) {
        ['miso', 'yuzu'].forEach(id => Cats.anim(id, 'hop'));
        SoundEngine.playMeow(0.85);
        setTimeout(() => SoundEngine.playMeow(1.3), 220);
      }
      let line = L(g.line);
      if (g.id === 'mooncake') { let f = null; try { f = window.FBWorld && FBWorld.festival && FBWorld.festival(); } catch (e) {} line = L(f === 'midautumn' ? MOONCAKE.fest : MOONCAKE.other); }
      DB.log('gift', { gift: g.id });
      const buttons = Bond.giftsTonight < 3
        ? [{ label: L(WeiText.ui.gift), onClick: openGifts }, { label: L(WeiText.ui.back), onClick: backToOrder }]
        : [{ label: L(WeiText.ui.back), onClick: backToOrder }];
      renderWei(`"${line}"`, buttons, COMPACT_GRID, 'gift');
    }

    /* Wei asleep or out: the cats run the bar. Ask them and they offer what cats can manage. */
    const CAT_MENU = [
      { k: 'sardine', icon: '🐟', name: ["Sardine Special", "小鱼干特调", "", "魚乾特調", "Especial de sardinas", "Especial de sardines"] },
      { k: 'milk', icon: '🥛', name: ["Warm milk & honey", "热牛奶加蜂蜜", "", "熱奶加蜜糖", "Leche tibia con miel", "Llet tèbia amb mel"] },
      { k: 'pick', icon: '🎲', name: ["Whatever Miso picks", "味噌随便选", "", "味噌揀乜就乜", "Lo que elija Miso", "El que triï la Miso"] },
      { k: 'tea', icon: '🍵', name: ["Tea (mostly in the cup)", "茶（大部分在杯里）", "", "茶（大部分喺杯度）", "Té (casi todo en la taza)", "Te (gairebé tot a la tassa)"] },
      { k: 'nip', icon: '🌿', name: ["Catnip tonic", "猫薄荷汤力", "", "貓草湯力", "Tónica de hierba gatera", "Tònica de nepeta"] },
      { k: 'box', icon: '📦', name: ["The box", "那个纸箱", "", "嗰個紙箱", "La caja", "La caixa"] }
    ];
    function askCatToBartend() {
      SoundEngine.playMeow(1.2); setTimeout(() => SoundEngine.playMeow(0.8), 200);
      Cats.setPose('miso', 'sit'); Cats.setPose('yuzu', 'sit'); Cats.moveTo('miso', 42); Cats.moveTo('yuzu', 58);
      toggleCodexModal(true);   /* the menu on the stand is whoever keeps the counter's: here, the cats' */
    }
    window.NDCatServe = function (k) { catServe(k); };
    window.NDCatMenu = function () { return CAT_MENU.map(it => ({ ic: (window.FBWorld && FBWorld.px) ? FBWorld.px(it.icon) : '', name: L(lx(it.name)), desc: '', go: () => catServe(it.k) })); };
    function catServe(k) {
      setTimeout(() => SoundEngine.playClink(), 400);
      setTimeout(() => { Cats.returnHome('miso'); Cats.returnHome('yuzu'); }, 2500);
      const S6 = a => L(lx(a));
      if (k === 'pick') {   /* Miso walks along the menu and sits on one: a real drink from the menu */
        const keys = Object.keys(DrinkManifest).filter(d => DrinkManifest[d].type === (AppState.isBarOpen ? 'bar' : 'cafe'));
        serveItemByKey(keys[(Math.random() * keys.length) | 0]); setTimeout(() => showBubble(S6(["🐾 *Miso sat on it. That's the order.*", "🐾 *味噌坐在了这一项上。就点它了。*", "", "🐾 *味噌坐咗喺呢樣上面。就要呢樣。*", "🐾 *Miso se sentó encima. Ese es el pedido.*", "🐾 *La Miso s'hi va asseure a sobre. Aquesta és la comanda.*"]), 2800), 600);
        DB.log('cats_serve', { k }); return;
      }
      const D = {
        sardine: { icon: '🐟', name: ["Miso & Yuzu's Sardine Special", "味噌和柚子的小鱼干特调", "", "味噌同柚子嘅魚乾特調", "Especial de sardinas de Miso y Yuzu", "Especial de sardines de la Miso i la Yuzu"], sub: ["Fishiness 100% · paw-approved", "鱼味 100% · 肉垫认证", "", "魚味 100% · 貓爪認證", "Sabor a pescado 100% · aprobado por patitas", "Gust de peix 100% · aprovat per potetes"], desc: ["\"Miso nudged the glass across with one paw. Yuzu balanced a dried sardine on the rim.\"", "\"味噌用肉垫把杯子推了过来，柚子在杯沿放了一条小鱼干。\"", "", "\"味噌用肉墊推杯過嚟，柚子喺杯邊放咗條魚乾。\"", "\"Miso empujó el vaso con una pata. Yuzu equilibró una sardina en el borde.\"", "\"La Miso va empènyer el got amb una pota. La Yuzu va equilibrar una sardina a la vora.\""], f: '🐟 · 🌿 · 🥛' },
        milk: { icon: '🥛', name: ["Warm milk & honey", "热牛奶加蜂蜜", "", "熱奶加蜜糖", "Leche tibia con miel", "Llet tèbia amb mel"], sub: ["Two saucers for them, one cup for you", "两碟给它们，一杯给你", "", "兩碟俾佢哋，一杯俾你", "Dos platitos para ellos, una taza para ti", "Dos platets per a ells, una tassa per a tu"], desc: ["\"Yuzu warmed it by sitting next to the kettle. It counts.\"", "\"柚子坐在水壶旁边把它焐热了。算数的。\"", "", "\"柚子坐喺水煲隔籬焗暖咗佢。計數嘅。\"", "\"Yuzu la calentó sentándose junto al hervidor. Cuenta.\"", "\"La Yuzu la va escalfar asseient-se al costat del bullidor. Compta.\""], f: '🥛 · 🍯' },
        tea: { icon: '🍵', name: ["Tea, mostly in the cup", "茶，大部分在杯里", "", "茶，大部分喺杯度", "Té, casi todo en la taza", "Te, gairebé tot a la tassa"], sub: ["Jasmine · a little on the bar", "茉莉 · 吧台上也有一点", "", "茉莉 · 吧枱都有啲", "Jazmín · un poco en la barra", "Gessamí · una mica a la barra"], desc: ["\"Yuzu pushed the cup to the very edge, looked at you, and stopped. Generous.\"", "\"柚子把杯子推到吧台最边上，看了你一眼，停住了。很大方。\"", "", "\"柚子推杯推到吧枱邊，望一望你，停咗手。好大方。\"", "\"Yuzu empujó la taza hasta el borde, te miró y paró. Generosa.\"", "\"La Yuzu va empènyer la tassa fins a la vora, et va mirar i es va aturar. Generosa.\""], f: '🍵 · 🐾' },
        nip: { icon: '🌿', name: AppState.isBarOpen ? ["Catnip tonic", "猫薄荷汤力", "", "貓草湯力", "Tónica de hierba gatera", "Tònica de nepeta"] : ["Catnip lemonade", "猫薄荷柠檬水", "", "貓草檸檬水", "Limonada de hierba gatera", "Llimonada de nepeta"], sub: ["Garnish chosen by Miso, then eaten by Miso", "装饰是味噌选的，然后被味噌吃了", "", "裝飾係味噌揀嘅，跟住俾味噌食咗", "Adorno elegido por Miso y luego comido por Miso", "Guarnició triada per la Miso i després menjada per la Miso"], desc: ["\"There was a sprig on top. There isn't now.\"", "\"上面原本有一小枝。现在没有了。\"", "", "\"上面本來有一枝。而家冇咗。\"", "\"Había una ramita encima. Ya no.\"", "\"Hi havia una branqueta a sobre. Ja no.\""], f: AppState.isBarOpen ? '🍸 · 🌿' : '🍋 · 🌿' },
        box: { icon: '📦', name: ["The box", "那个纸箱", "", "嗰個紙箱", "La caja", "La caixa"], sub: ["Nothing to drink. Miso is in it.", "没有喝的。味噌在里面。", "", "冇嘢飲。味噌喺入面。", "Nada de beber. Miso está dentro.", "Res per beure. La Miso hi és a dins."], desc: ["\"It's the best seat in the bar and it isn't yours.\"", "\"这是店里最好的座位，但不是你的。\"", "", "\"呢個係成間酒吧最好嘅位，但唔係你嘅。\"", "\"Es el mejor sitio del bar y no es tuyo.\"", "\"És el millor seient del bar i no és teu.\""], f: '📦 · 🐈‍⬛' }
      }[k];
      if (k === 'box') { SoundEngine.playMeow(0.9); }
      showServed({ icon: D.icon, name: S6(D.name), sub: S6(D.sub), desc: S6(D.desc), formula: D.f, reactable: false });
      setTimeout(() => showBubble(S6(["*Yuzu pushes it the last inch with one paw, then sits on the menu.* Meow.", "*柚子用一只爪把它推完最后一寸，然后坐到菜单上。* 喵。", "*柚子用一隻爪把它推完最後一寸，然後坐到菜單上。* 喵。", "*柚子用一隻爪推埋最後嗰吋，跟住坐咗喺餐牌度。* 喵。", "*Yuzu lo empuja el último centímetro con una pata y se sienta en la carta.* Miau.", "*La Yuzu l'empeny l'últim centímetre amb una pota i s'asseu a la carta.* Mèu."])), 900);
      DB.log('cats_serve', { k });
    }



    /* Logging wrappers for the counter */
    (function wrapForLogging() {
      const _serve = serveItemByKey;
      serveItemByKey = function (key, opts) { DB.log('order', { drink: key }); return _serve(key, opts); };
      const _react = reactToDrink;
      reactToDrink = function (kind) { if (!AppState.reacted) DB.log('react', { kind }); return _react(kind); };
      const _poke = tapBartender;
      tapBartender = function () { DB.log('poke', { asleep: AppState.weiState === 'asleep' }); const r = _poke(); setTimeout(() => Cats.syncSleep(), 50); return r; };
      const _wake = wakeUpBartender;
      wakeUpBartender = function (g) { const r = _wake(g); Cats.syncSleep(); return r; };
      const _topic = chooseTopicOption;
      chooseTopicOption = function (opt) { DB.log('topic', { id: AppState.currentTopic && AppState.currentTopic.id }); return _topic(opt); };
      const _eval = evaluateWeiState;
      let lastState = null;
      evaluateWeiState = function () { const r = _eval(); if (lastState !== AppState.weiState) { lastState = AppState.weiState; if (typeof Cats !== 'undefined' && Cats.st) Cats.syncSleep(); } return r; };
    })();

    /* ---------------- Boot ---------------- */
    window.addEventListener('DOMContentLoaded', () => {
      DB.init();
      AppState.lang = langPref() || detectBrowserLang();
      if (AppState.lang === 'tw' || AppState.lang === 'yue') Zh.ensure();
      window.addEventListener('languagechange', () => { if (!langPref()) setLanguage(detectBrowserLang()); });

      Patron.load();

      startIdleLoop();
      initEyeTracking();
      Cats.init();
      applyLanguage(true);
      if (window.FBWorld) { updateClockHands(FBWorld.hour()); setWeather(FBWorld.weather(), false); }   // each visit: the town's hour and sky, shared by the whole neighbourhood
      else { const d = new Date(); updateClockHands(d.getHours() + d.getMinutes() / 60); setWeather('clear', false); }

      /* you walk straight in from Nearby: no door to push. Wei uses the town's name for you (fb_nick),
         or a nickname until you tap your name to change it */
      if (!Patron.name) Patron.name = nickname();
      enterSanctuary();

      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleCodexModal(false); });
    });
  
