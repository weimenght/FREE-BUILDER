    /* ===== What Wei remembers about you, on this device: your usual and how often you come (no points, no levels) ===== */
    const Bond = {
      visits: 0,
      lastOrder: { bar: null, cafe: null },
      giftsTonight: 0,
      lineIdx: {},
      sleepPokes: 0,
      load() {
        this.visits = 0; this.lastOrder = { bar: null, cafe: null };
        try {
          const s = JSON.parse(localStorage.getItem('weis-bond:' + Patron.name) || 'null');
          if (s) { this.visits = s.visits || 0; this.lastOrder = Object.assign({ bar: null, cafe: null }, s.lastOrder || {}); }
        } catch (e) {}
      },
      save() {
        try { localStorage.setItem('weis-bond:' + Patron.name, JSON.stringify({ visits: this.visits, lastOrder: this.lastOrder })); } catch (e) {}
      }
    };

    /* a reminder or a notice: the town's quiet note (one at a time, small, at the bottom) */
    function showToast(msg) {
      try { if (window.FBG && FBG.note) { FBG.note({ text: msg }); return; } } catch (e) {}
      try { if (parent !== window && parent.FBG && parent.FBG.note) parent.FBG.note({ text: msg }); } catch (e) {}
    }

    /* ===== WEI'S FACE, BUBBLE & BODY LANGUAGE ===== */
    function showBubble(text) { return window.NDSay ? NDSay(text) : false; }   /* a line from the host: in the panel (NDSay, below) */

    let exprTimer = null;
    function setExpression(kind = 'smile', ms = 1600) {
      const ids = { smile: 'mouth-smile', grin: 'mouth-grin', flat: 'mouth-flat', o: 'mouth-o' };
      Object.entries(ids).forEach(([k, id]) => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', k !== kind);
      });
      const blush = document.getElementById('avatar-blush');
      if (blush) blush.classList.toggle('hidden', kind !== 'grin');
      clearTimeout(exprTimer);
      if (kind !== 'smile') exprTimer = setTimeout(() => setExpression('smile'), ms);
    }

    function animateWei(cls) {
      const svg = document.getElementById('svg-wei-avatar');
      if (!svg) return;
      svg.classList.remove('wei-wiggle', 'wei-shake', 'wei-hop');
      svg.getBoundingClientRect();
      svg.classList.add(cls);
    }

    /* Typewriter with RPG voice blips */
    const Typer = {
      timer: null, el: null, full: '',
      run(el, text) {
        this.stop();
        this.el = el;
        this.full = text;
        el.textContent = '';
        el.classList.add('typing-cursor');
        const pitch = AppState.isBarOpen ? 0.85 : 1.15;
        let i = 0, ticks = 0;
        this.timer = setInterval(() => {
          i += 2;
          ticks++;
          el.textContent = text.slice(0, i);
          if (ticks % 3 === 0) SoundEngine.playBlip(pitch);
          if (i >= text.length) this.finish();
        }, 22);
      },
      finish() {
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
        if (this.el) {
          this.el.textContent = this.full;
          this.el.classList.remove('typing-cursor');
        }
      },
      stop() {
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
      },
      skip() {
        if (this.timer) this.finish();
      }
    };

    /* ===== DIALOGUE & RPG ENGINE ===== */
    const DEFAULT_GRID = "grid grid-cols-1 gap-1.5 mt-2";
    const COMPACT_GRID = "grid grid-cols-2 gap-1.5 mt-2";
    const GIFT_GRID = "grid grid-cols-3 gap-1.5 mt-2";

    function showScreen(id) {
      ['rpg-dialogue-screen', 'sleep-mode-screen', 'served-result-screen'].forEach(s => {
        document.getElementById(s).classList.toggle('hidden', s !== id);
      });
    }


    function getNextUniqueTopic() {
      /* the morning talk (sparrows, rush hour, morning shadows) only before 11 on the town's clock */
      const MORNING = ['gesha_morning', 'courtyard_sparrows', 'gaudi_courtyard', 'corporate_refuge', 'microfoam_theology'];
      const LATE = ['gulou_bells', 'line2_last_train'];   /* midnight bells and the last train: only from 22:00 */
      const th = (window.FBWorld && FBWorld.hour) ? FBWorld.hour() % 24 : 9;
      let season = ''; try { season = FBWorld.season(); } catch (e) {}
      const pool = (AppState.isBarOpen ? BarTopicPool : CafeTopicPool).filter(t => (th < 11 || !MORNING.includes(t.id)) && (th >= 22 || th < 6 || !LATE.includes(t.id)) && (t.id !== 'gingko_autumn' || season === 'autumn'));
      let candidates = pool.filter(t => !AppState.usedTopicIds.has(t.id));
      if (candidates.length === 0) {
        AppState.usedTopicIds.clear();
        candidates = pool;
      }
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      AppState.usedTopicIds.add(chosen.id);
      AppState.currentTopic = chosen;
      return chosen;
    }

    // Generic "Wei says X, here are your replies" renderer used by every mode
    function renderWei(text, buttons, gridClass = DEFAULT_GRID, mode = 'topic') {
      showScreen('rpg-dialogue-screen');
      AppState.uiMode = mode;
      setText('dialogue-speaker-tag', speakerTag());
      setText('dialogue-skip-hint', L(WeiText.ui.tapSkip));
      Typer.run(document.getElementById('dialogue-speech-text'), text);

      const grid = document.getElementById('rpg-options-grid');
      grid.className = gridClass;
      grid.innerHTML = '';
      const compact = gridClass !== DEFAULT_GRID;

      buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = "opt-btn" + (compact ? " text-[12.5px]" : "");
        const label = document.createElement('span');
        label.textContent = b.locked ? `🔒 ${b.label}` : b.label;
        btn.appendChild(label);

        if (b.locked) {
          btn.disabled = true;
          btn.classList.add('opacity-40', 'cursor-not-allowed');
        } else {
          if (!compact) {
            const arrow = document.createElement('span');
            arrow.className = "text-[9px] font-retro text-amber-500 ml-1";
            arrow.textContent = '→';
            btn.appendChild(arrow);
          }
          btn.onclick = () => {
            resetIdle();
            SoundEngine.playClick();
            b.onClick();
          };
        }
        grid.appendChild(btn);
      });
    }

    function renderCurrentDialogue() {
      const t = i18n[AppState.lang];

      if (AppState.weiState === 'asleep') {
        Typer.stop();
        showScreen('sleep-mode-screen');

        // Bar hours (18-06) get the bar text, cafe hours the siesta text
        const isBarNight = AppState.isBarOpen;
        setText('sleep-header-title', isBarNight ? t.sleepHeaderBar : t.sleepHeaderCafe);
        setText('sleep-story-text', isBarNight ? t.sleepStoryBar : t.sleepStoryCafe);
        setText('sleep-btn-wake', isBarNight ? t.sleepBtnWakeBar : t.sleepBtnWakeCafe);
        setText('sleep-btn-cats', t.sleepBtnCats);
        setText('sleep-btn-diy', t.sleepBtnDiy);
        setText('sleep-header-badge', t.sleepBadge);

        SoundEngine.playSnore();
        return;
      }

      const topic = AppState.currentTopic || getNextUniqueTopic();
      renderWei(
        L(topic.text),
        topic.options.map(opt => ({ label: L(opt.label), onClick: () => chooseTopicOption(opt) })),
        DEFAULT_GRID,
        'topic'
      );
    }

    function chooseTopicOption(opt) {
      if (typeof opt.deltaEnergy === 'number') {
        AppState.weiEnergy = Math.max(0, Math.min(4, AppState.weiEnergy + opt.deltaEnergy));
      }

      evaluateWeiState();

      if (AppState.weiState === 'asleep') {
        renderCurrentDialogue();
      } else if (opt.drink) {
        serveItemByKey(opt.drink);
      } else {
        AppState.currentTopic = null;
        renderCurrentDialogue();
      }
    }

    function backToOrder() {
      AppState.currentTopic = null;
      renderCurrentDialogue();
    }

    /* ----- Served card + drink reactions ----- */
    function showServed(o) {
      Typer.stop();
      showScreen('served-result-screen');
      AppState.uiMode = 'served';
      setText('res-icon', o.icon);
      setText('res-name', o.name);
      setText('res-subtitle', o.sub);
      setText('res-description', o.desc);
      setText('res-formula', o.formula);
      /* food (Popo's kitchen, a neighbour's pick that's something to eat) asks for another plate, not another glass */
      AppState.lastFood = !!o.food;
      const rb = document.getElementById('res-btn-reorder');
      if (rb) rb.textContent = L(lx(o.food ? ["Another plate ↺", "再来一份 ↺", "再來一份 ↺", "再嚟一份 ↺", "Otro plato ↺", "Un altre plat ↺"] : ["Another ↺", "再来一杯 ↺", "再來一杯 ↺", "再嚟一杯 ↺", "Otra ↺", "Una altra ↺"]));

      const plate = document.getElementById('served-item-plate');
      plate.textContent = o.icon;
      plate.classList.remove('hidden');

      setText('res-react-label', L(WeiText.ui.tellWei));
      setText('react-love', L(WeiText.ui.love));
      setText('react-meh', L(WeiText.ui.meh));
      setText('react-strong', L(WeiText.ui.strong));
      document.getElementById('res-react-row').classList.toggle('hidden', !o.reactable);
      document.getElementById('res-wei-reply').classList.add('hidden');
      AppState.reacted = false;
    }

    function serveItemByKey(key, opts = {}) {
      if (AppState.isBarOpen) {
        SoundEngine.playShaker();
        setTimeout(() => SoundEngine.playClink(), 500);
      } else {
        SoundEngine.playCoffeeGrinder();
        setTimeout(() => SoundEngine.playClink(), 600);
      }

      const d = DrinkManifest[key] || DrinkManifest.jasmine_gulou;
      const mode = AppState.isBarOpen ? 'bar' : 'cafe';
      if (d.type === mode) {
        Bond.lastOrder[mode] = key;
        Bond.save();
      }
      const awake = AppState.weiState === 'awake';

      showServed({
        icon: d.icon,
        name: L(d.name) + (opts.free ? ' 🎁' : ''),
        sub: L(d.sub),
        desc: L(d.desc),
        formula: d.formula,
        reactable: awake
      });

      if (awake) {
        animateWei('wei-wiggle');
        showBubble(opts.line || L(pick(WEI_SERVE)));
      }
      if (awake && window.weiFollowUp) weiFollowUp(11000);
    }

    function reactToDrink(kind) {
      if (AppState.reacted) return;
      AppState.reacted = true;
      resetIdle();
      SoundEngine.playClick();

      if (window.weiFollowUp) weiFollowUp(3200);
      const line = L(pick(WeiText.reactions[kind]));
      document.getElementById('res-react-row').classList.add('hidden');
      const reply = document.getElementById('res-wei-reply');
      reply.textContent = `Wei: "${line}"`;
      reply.classList.remove('hidden');

      if (kind === 'love') {
        setExpression('grin', 2500);
        animateWei('wei-hop');
      } else if (kind === 'meh') {
        setExpression('flat', 2000);
      } else {
        setExpression('o', 1800);
        animateWei('wei-shake');
      }
    }

    function resetRpgConversation() {
      SoundEngine.playClick();
      AppState.currentTopic = null;
      document.getElementById('served-item-plate').classList.add('hidden');
      renderCurrentDialogue();
    }

    /* ----- Small talk ----- */
    function chatButtons() {
      return WeiText.chatTopics.map(tp => ({ label: L(tp.label), onClick: () => chatAbout(tp) }))
        .concat([{ label: L(WeiText.ui.back), onClick: backToOrder }]);
    }

    function openChat() {
      renderWei(L(pick(WeiText.chatIntro)), chatButtons(), COMPACT_GRID, 'chat');
    }

    /* ----- Guess-the-drink riddle ----- */
    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function startRiddle() {
      const mode = AppState.isBarOpen ? 'bar' : 'cafe';
      const keys = Object.keys(DrinkManifest).filter(k => DrinkManifest[k].type === mode);
      const answer = pick(keys);
      const choices = shuffle([answer, ...shuffle(keys.filter(k => k !== answer)).slice(0, 2)]);
      const d = DrinkManifest[answer];
      const text = `${L(pick(WeiText.riddleIntro))} “${L(d.sub)}”`;
      renderWei(
        text,
        choices.map(k => ({ label: L(DrinkManifest[k].name), onClick: () => answerRiddle(k, answer) }))
          .concat([{ label: L(WeiText.ui.back), onClick: backToOrder }]),
        COMPACT_GRID,
        'riddle'
      );
    }

    /* ----- Gifts ----- */
    function giftButtons() {
      return WeiText.gifts.map(g => ({ label: `${g.icon} ${L(g.label)}`, onClick: () => giveGift(g) }))
        .concat([{ label: L(WeiText.ui.back), onClick: backToOrder }]);
    }

    function openGifts() {
      if (Bond.giftsTonight >= 3) {
        setExpression('grin', 1500);
        renderWei(L(WeiText.giftLimit), [{ label: L(WeiText.ui.back), onClick: backToOrder }], COMPACT_GRID, 'gift');
        return;
      }
      renderWei(L(WeiText.giftIntro), giftButtons(), GIFT_GRID, 'gift');
    }


    function orderUsual() {
      const mode = AppState.isBarOpen ? 'bar' : 'cafe';
      const key = Bond.lastOrder[mode];
      if (!key) return;
      serveItemByKey(key, { line: L(WeiText.usual) });
    }

    /* ----- Poking Wei ----- */
    function tapBartender() {
      resetIdle();

      if (AppState.weiState === 'asleep') {
        Bond.sleepPokes++;
        SoundEngine.playSnore();
        if (Bond.sleepPokes >= 3) {
          Bond.sleepPokes = 0;
          wakeUpBartender(true);
        } else {
          showBubble(L(WeiText.sleepPokes[Bond.sleepPokes - 1]), 2400);
        }
        return;
      }

      if (AppState.greetLater) {   /* the first word is yours: now he looks up and says hello */
        const g = AppState.greetLater; AppState.greetLater = null;
        SoundEngine.playBlip(1.3); setTimeout(() => SoundEngine.playBlip(1.6), 70);
        renderWei(g, [], DEFAULT_GRID, 'topic'); setExpression('grin', 1800); animateWei('wei-hop');
      }
    }

    function wakeUpBartender(grumpy = false) {
      SoundEngine.playClink();
      Bond.sleepPokes = 0;
      AppState.weiState = 'awake';
      AppState.weiEnergy = grumpy ? 2 : 4;
      evaluateWeiState();
      AppState.currentTopic = null;
      renderCurrentDialogue();
      if (grumpy) {
        showBubble(L(WeiText.grumpyWake), 3200);
        setExpression('flat', 2800);
        animateWei('wei-shake');
      } else {
        showBubble('…☕?', 1600);
        setExpression('o', 1200);
      }
    }

    /* ----- Jokes: told at the counter, in the panel ----- */
    function promptJoke() {
      SoundEngine.playClick();
      const pool = jokesForLang();
      let i;
      do { i = Math.floor(Math.random() * pool.length); } while (pool.length > 1 && i === AppState.currentJokeIndex);
      AppState.currentJokeIndex = i;
      SoundEngine.playChiptune(580, 'sine', 0.08);
      setExpression('grin', 1600);
      renderWei(pool[i].t, [
        { label: L(WeiText.ui.laugh), onClick: () => rateJoke('laugh') },
        { label: L(WeiText.ui.groan), onClick: () => rateJoke('groan') },
        { label: i18n[AppState.lang].jokeNext, onClick: promptJoke },
        { label: L(WeiText.ui.back), onClick: backToOrder }
      ], COMPACT_GRID, 'chat');
    }

    function rateJoke(kind) {
      setExpression('grin', 2200);
      animateWei(kind === 'laugh' ? 'wei-hop' : 'wei-wiggle');
      renderWei(L(WeiText.jokeRate[kind]), [
        { label: i18n[AppState.lang].jokeNext, onClick: promptJoke },
        { label: L(WeiText.ui.back), onClick: backToOrder }
      ], COMPACT_GRID, 'chat');
    }

    /* ----- Blinking & eyes that follow you ----- */
    const Idle = { last: Date.now() };
    function resetIdle() { Idle.last = Date.now(); }

    function startIdleLoop() {
      document.addEventListener('pointerdown', resetIdle, true);
      // Blink every few seconds
      setInterval(() => {
        if (AppState.weiState !== 'awake' || Math.random() < 0.35) return;
        const pupils = document.querySelectorAll('.wei-pupil');
        pupils.forEach(p => p.setAttribute('height', '0'));
        setTimeout(() => pupils.forEach(p => p.setAttribute('height', '2')), 130);
      }, 3200);
    }

    function initEyeTracking() {
      let pending = false, lastX = 0, lastY = 0;
      window.addEventListener('pointermove', (e) => {
        lastX = e.clientX; lastY = e.clientY;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          const svg = document.getElementById('svg-wei-avatar');
          if (!svg || !AppState.inSanctuary) return;
          const r = svg.getBoundingClientRect();
          if (!r.width) return;
          const dx = lastX - (r.left + r.width / 2);
          const dy = lastY - (r.top + r.height * 0.35);
          const ox = Math.abs(dx) < 30 ? 0 : (dx > 0 ? 1 : -1);
          const oy = dy < -30 ? -1 : 0;
          const pupils = document.querySelectorAll('.wei-pupil');
          if (pupils[0]) { pupils[0].setAttribute('x', 12 + ox); pupils[0].setAttribute('y', 12 + oy); }
          if (pupils[1]) { pupils[1].setAttribute('x', 20 + ox); pupils[1].setAttribute('y', 12 + oy); }
        });
      }, { passive: true });
    }
  
