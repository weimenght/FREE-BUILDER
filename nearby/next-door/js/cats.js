    /* ===================== THE CATS: MISO & YUZU ===================== */
    /* Miso & Yuzu at the counter are the town's own drawing (FBWorld.petSvg, palette FBWorld.PETS): on all four, side on;
       'loaf' is curled up asleep (legs tucked), 'play' a mid-step stride; a blink shuts the eyes for a beat */
    function petPic(k, o) {
      o = o || {}; const W = window.FBWorld, dog = k === 'dog', w = dog ? 22 : 18, h = dog ? 16 : 14;
      if (!W || !W.petSvg) return '';
      let s = W.petSvg(k, { asleep: o.asleep, tail: 'pt-tail', legs: 'pt-legs', legs2: 'pt-legs pt-l2' });
      const P = (W.PETS || {})[k];
      if (o.blink && P && P.e) s = s.split('fill="' + P.e + '"').join('fill="' + (P.d || P.b) + '"');
      s = s.replace('<svg ', '<svg x="' + (o.dx || 0) + '" y="' + ((o.dy || 0) + (o.asleep ? (dog ? 4 : 3) : 0)) + '" width="' + w + '" height="' + h + '" ');
      const vw = o.vw || w, vh = o.vh || h;
      return '<svg class="' + (o.cls || '') + (o.stride ? ' pt-stride' : '') + '" viewBox="0 0 ' + vw + ' ' + vh + '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">' + (o.under || '') + s + '</svg>';
    }
    window.NDPetPic = petPic;
    function catSVG(id, pose, blink) {
      return petPic(id, { cls: 'cat-sprite', asleep: pose === 'loaf', stride: pose === 'play', blink: blink && pose !== 'loaf' });
    }

    const Cats = {
      st: {
        miso: { x: 16, pose: 'sit', sleepUntil: 0, home: [8, 36] },
        yuzu: { x: 82, pose: 'sit', sleepUntil: 0, home: [64, 92] }
      },

      name(id) { return L(WeiPlus.catNames[id]); },
      el(id) { return document.getElementById('cat-' + id); },

      render(id, blink = false) {
        const s = this.st[id], el = this.el(id);
        if (!el) return;
        el.innerHTML = catSVG(id, s.pose, blink) + `<div class="cat-name">${esc(this.name(id))}</div>`;
        el.style.left = s.x + '%';
        el.classList.toggle('sleeping', s.pose === 'loaf');
        if (!el.dataset.faced) { el.dataset.faced = '1'; el.classList.toggle('flip', s.x > 50); }   /* side on, looking into the room */
      },
      renderAll() { this.render('miso'); this.render('yuzu'); },

      anim(id, cls) {
        const el = this.el(id);
        if (!el) return;
        el.classList.remove('hop', 'wiggle', 'pounce');
        void el.offsetWidth;
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 900);
      },
      moveTo(id, x, fast = false) {
        const s = this.st[id], el = this.el(id);
        if (!el) return;
        el.classList.toggle('fast', fast);
        el.classList.toggle('flip', x < s.x);
        s.x = Math.max(5, Math.min(95, x));
        el.style.left = s.x + '%';
        clearTimeout(el._face); el._face = setTimeout(() => { if (!el.classList.contains('fast')) el.classList.toggle('flip', s.x > 50); }, fast ? 900 : 1800);   /* once there, turn to face the room */
      },
      setPose(id, pose) { this.st[id].pose = pose; this.render(id); },
      returnHome(id) {
        const s = this.st[id], [a, b] = s.home;
        if (s.x < a || s.x > b) this.moveTo(id, a + Math.random() * (b - a));
      },
      /* a tap on a cat: a reaction in the panel (NDCatTap, below); on the cats' own visit the stage takes it as tapping the host */
      open(id) { if (window.NDCatTap) NDCatTap(id); },
      dropItem(emoji, xPct) {
        const floor = document.getElementById('stage-floor'), d = document.createElement('div');
        d.className = 'falling'; d.textContent = emoji; d.style.left = xPct + '%'; d.style.top = '-40px';
        floor.appendChild(d);
        setTimeout(() => d.remove(), 950);
      },

      /* ---------- life on the counter ---------- */
      syncSleep() {
        const asleep = AppState.weiState === 'asleep';
        ['miso', 'yuzu'].forEach(id => {
          const s = this.st[id];
          if (asleep && s.pose !== 'loaf' && Math.random() < 0.8) this.setPose(id, 'loaf');
          if (!asleep && s.pose === 'loaf' && s.sleepUntil < Date.now()) this.setPose(id, 'sit');
        });
      },
      /* every so often a cat does something by itself (no words: the room shows it) */
      event() {
        if (!AppState.inSanctuary || currentRoom !== 'counter' || document.hidden) return;
        const here = ['miso', 'yuzu'].filter(k => this.here(k)); if (!here.length) return;
        const id = here[Math.floor(Math.random() * here.length)], other = id === 'miso' ? 'yuzu' : 'miso', s = this.st[id];
        if (s.pose === 'loaf' && Math.random() < 0.7) return;
        const plateUp = !document.getElementById('served-item-plate').classList.contains('hidden');
        const roll = Math.random();
        if (plateUp && roll < 0.25) {   /* stares at your drink */
          this.moveTo(id, id === 'miso' ? 42 : 58);
          setTimeout(() => this.returnHome(id), 3500);
        } else if (roll < 0.36 && AppState.weiState === 'awake') {   /* knocks something off the shelf */
          this.moveTo(id, id === 'miso' ? 30 : 70);
          setTimeout(() => {
            this.anim(id, 'pounce');
            this.dropItem(pick(['🥃', '🍸', '🫙', '🍋']), this.st[id].x);
            SoundEngine.playClink();
            setTimeout(() => { setExpression('o', 1500); animateWei('wei-shake'); }, 500);
            setTimeout(() => this.returnHome(id), 1400);
          }, 1700);
        } else if (roll < 0.5) {   /* grooms */
          this.anim(id, 'wiggle');
        } else if (roll < 0.62) {   /* zoomies across the counter */
          this.moveTo(id, s.x < 50 ? 90 : 10, true);
          setTimeout(() => this.moveTo(id, s.x < 50 ? 85 : 15, true), 420);
          setTimeout(() => { this.el(id).classList.remove('fast'); this.returnHome(id); }, 1200);
          SoundEngine.playMeow(1.6);
        } else if (roll < 0.72) {   /* a nap in a warm spot */
          this.setPose(id, 'loaf');
          s.sleepUntil = Date.now() + 20000;
          setTimeout(() => { if (AppState.weiState === 'awake' && s.pose === 'loaf') this.setPose(id, 'sit'); }, 20000);
        } else if (roll < 0.8 && plateUp) {   /* steals a garnish */
          this.moveTo(id, 50, true);
          setTimeout(() => { this.el(id).classList.remove('fast'); this.returnHome(id); }, 700);
        } else if (roll < 0.9 && this.here(other)) {   /* the two cats meet */
          this.moveTo(id, id === 'miso' ? 34 : 66);
          this.moveTo(other, other === 'miso' ? 30 : 70);
          setTimeout(() => { this.returnHome(id); this.returnHome(other); }, 4500);
        } else {
          const [a, b] = s.home;
          this.moveTo(id, a + Math.random() * (b - a));
        }
      },
      blinkLoop() {
        ['miso', 'yuzu'].forEach(id => {
          if (this.st[id].pose === 'loaf' || Math.random() < 0.5) return;
          this.render(id, true);
          setTimeout(() => this.render(id, false), 160);
        });
      },

      /* each cat is in one place at a time (FBWorld.cats): at Next Door, home, or out in town */
      here(id) { try { const c = window.FBWorld && FBWorld.cats && FBWorld.cats(); return !c || c[id] === 'bar'; } catch (e) { return true; } },
      syncHere() {
        ['miso', 'yuzu'].forEach(id => { const el = this.el(id); if (el) el.style.display = this.here(id) ? '' : 'none'; });
        const any = this.here('miso') || this.here('yuzu'), b = document.getElementById('sleep-cats'); if (b) b.style.display = any ? '' : 'none';
      },
      init() {
        /* an absent cat isn't drawn and does nothing */
        ['anim', 'moveTo', 'setPose', 'returnHome', 'open'].forEach(m => { const o = this[m]; this[m] = function (id, ...a) { return this.here(id) ? o.call(this, id, ...a) : undefined; }; });
        this.syncHere(); setInterval(() => this.syncHere(), 20000);
        ['miso', 'yuzu'].forEach(id => this.el(id).addEventListener('click', (e) => { e.stopPropagation(); this.open(id); }));
        this.renderAll();
        setInterval(() => this.event(), 11000);
        setInterval(() => this.blinkLoop(), 3600);
      }
    };
  
