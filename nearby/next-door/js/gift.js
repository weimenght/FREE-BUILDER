/* ===== Buy a friend a drink · a seat at the bar together =====
   🎁 on the served card: the drink waits behind a link (town_bar_gifts, 30 days). The link also saves a seat:
   whoever opens it sits down on fbbar-<seat> with you, if you're still here. Nothing of the seat is stored. */
(function () {
  const X = a => L(lx(a));
  const T = {
    gift: ["For a friend", "请朋友喝", "請朋友喝", "請朋友飲", "Para un amigo", "Per a un amic"],
    from: ["Sign it", "署名", "署名", "署名", "Fírmala", "Signa-la"],
    line: ["A line for them (optional)", "给 TA 的一句话（可不填）", "給 TA 的一句話（可不填）", "俾佢嘅一句說話（可以唔填）", "Una frase para tu amigo (opcional)", "Una frase per al teu amic (opcional)"],
    send: ["↗ Send the drink", "↗ 送出这杯", "↗ 送出這杯", "↗ 送出呢杯", "↗ Envía la copa", "↗ Envia la copa"],
    seat: ["👥 Just save a seat", "👥 只留个座位", "👥 只留個座位", "👥 淨係留個位", "👥 Solo guarda un sitio", "👥 Només guarda un lloc"],
    copied: ["✓ Link copied", "✓ 链接已复制", "✓ 連結已複製", "✓ 連結已複製", "✓ Enlace copiado", "✓ Enllaç copiat"],
    off: ["The line to the street is down. Try in a bit.", "和街上的联系断了，等一会儿再试。", "和街上的聯繫斷了，等一會兒再試。", "同街外嘅聯絡斷咗，等陣再試。", "No hay línea con la calle. Prueba en un rato.", "No hi ha línia amb el carrer. Prova-ho d'aquí a una estona."],
    rest: ["*taps the coaster stack* That's a dozen today. Tomorrow.", "*敲了敲杯垫* 今天已经一打了。明天吧。", "*敲了敲杯墊* 今天已經一打了。明天吧。", "*敲一敲杯墊* 今日已經一打喇。聽日啦。", "*da unos golpecitos a los posavasos* Una docena hoy. Mañana.", "*dona uns copets als sotagots* Una dotzena avui. Demà."],
    wrap: ["*sets a coaster on top, writes a name on it, puts it behind the bar* It'll wait.", "*盖上一张杯垫，写上名字，放到吧台后面* 它会等着的。", "*蓋上一張杯墊，寫上名字，放到吧台後面* 它會等著的。", "*蓋張杯墊，寫個名，放落吧枱後面* 佢會等嘅。", "*le pone un posavasos encima, escribe un nombre y la guarda tras la barra* Esperará.", "*hi posa un sotagot a sobre, hi escriu un nom i la guarda darrere la barra* Esperarà."],
    paid: ["*slides it across* This one's already paid for.", "*把杯子推过来* 这杯已经有人请了。", "*把杯子推過來* 這杯已經有人請了。", "*推杯過嚟* 呢杯有人請咗。", "*te la desliza* Esta ya está pagada.", "*te la fa lliscar* Aquesta ja està pagada."],
    catsPaid: ["🐾 *Yuzu noses a glass across the counter. There's a coaster on it with your name.*", "🐾 *柚子用鼻子把一杯推过吧台，杯垫上写着你的名字。*", "🐾 *柚子用鼻子把一杯推過吧台，杯墊上寫著你的名字。*", "🐾 *柚子用個鼻推杯過吧枱，杯墊寫住你個名。*", "🐾 *Yuzu empuja un vaso con el hocico. En el posavasos pone tu nombre.*", "🐾 *La Yuzu empeny un got amb el morro. Al sotagot hi ha el teu nom.*"],
    fromX: ["From {n}", "{n} 请你的", "{n} 請你的", "{n} 請你嘅", "De parte de {n}", "De part de {n}"],
    fromAnon: ["From a friend", "朋友请你的", "朋友請你的", "朋友請你嘅", "De parte de un amigo", "De part d'un amic"],
    raise: ["🥂 Raise it back", "🥂 举杯回敬", "🥂 舉杯回敬", "🥂 舉杯回敬", "🥂 Brinda de vuelta", "🥂 Brinda de tornada"],
    raised: ["*tips his glass towards the door* They'll know.", "*朝门口举了举杯* TA 会知道的。", "*朝門口舉了舉杯* TA 會知道的。", "*向門口舉一舉杯* 佢會知嘅。", "*inclina su vaso hacia la puerta* Lo sabrá.", "*inclina el got cap a la porta* Ho sabrà."],
    gone: ["*checks under the counter* Nothing with that name. Maybe it waited too long.", "*在吧台下面找了找* 没有这个名字的。也许等得太久了。", "*在吧台下面找了找* 沒有這個名字的。也許等得太久了。", "*喺吧枱底搵咗搵* 冇呢個名喎。可能等得太耐。", "*mira bajo la barra* Nada con ese nombre. Quizá esperó demasiado.", "*mira sota la barra* Res amb aquest nom. Potser va esperar massa."],
    toldRaised: ["*nods at the door* Your {d}: they raised it back.", "*朝门口点点头* 你请的{d}，TA 举杯回敬了。", "*朝門口點點頭* 你請的{d}，TA 舉杯回敬了。", "*向門口點點頭* 你請嘅{d}，佢舉杯回敬咗。", "*señala la puerta con la cabeza* Tu {d}: te han brindado de vuelta.", "*assenyala la porta amb el cap* El teu {d}: t'han brindat de tornada."],
    toldOpened: ["*wipes a coaster* The {d} you left: picked up.", "*擦了擦杯垫* 你留的{d}，有人取走了。", "*擦了擦杯墊* 你留的{d}，有人取走了。", "*抹一抹杯墊* 你留低嘅{d}，有人拎咗。", "*limpia un posavasos* El {d} que dejaste: ya lo recogieron.", "*eixuga un sotagot* El {d} que vas deixar: ja l'han recollit."],
    hi: ["*pulls out the stool next to you* {n}'s here.", "*拉开你旁边的凳子* {n} 来了。", "*拉開你旁邊的凳子* {n} 來了。", "*拉開你隔籬張凳* {n} 嚟咗。", "*saca el taburete de al lado* Ya está {n}.", "*treu el tamboret del costat* Ja és aquí {n}."],
    friend: ["your friend", "你的朋友", "你的朋友", "你個朋友", "tu amigo", "el teu amic"],
    clink: ["*two glasses, one clink*", "*两只杯子，叮的一声*", "*兩隻杯子，叮的一聲*", "*兩隻杯，叮一聲*", "*dos vasos, un solo chin*", "*dos gots, un sol xin*"],
    theyClink: ["{n} raises a glass 🥂", "{n} 举起了杯 🥂", "{n} 舉起了杯 🥂", "{n} 舉起杯 🥂", "{n} levanta el vaso 🥂", "{n} aixeca el got 🥂"],
    yours: ["your drink", "那杯", "那杯", "嗰杯", "tu copa", "la teva copa"]
  };
  /* how the drinks you left went, [picked up, raised back], told by whoever is behind the counter (Popo's zh-Hant is Cantonese) */
  const TOLD = {
    wei: [T.toldOpened, T.toldRaised],
    mei: [["oh, the {d} you left? someone picked it up. cute.", "哦，你留的{d}？有人拿走了。挺可爱。", "哦，你留的{d}？有人拿走了。挺可愛。", "哦，你留低嗰杯{d}？有人攞咗。幾得意。", "oye, el {d} que dejaste: alguien lo recogió. qué mono.", "ei, el {d} que vas deixar: algú l'ha recollit. quina monada."],
      ["your {d}? they raised it back. I saw. very wholesome.", "你请的{d}？对方举杯回敬了。我看见了。好暖。", "你請的{d}？對方舉杯回敬了。我看見了。好暖。", "你請嗰杯{d}？佢舉杯回敬咗。我見到。好暖。", "¿tu {d}? te brindaron de vuelta. lo vi. muy tierno.", "el teu {d}? t'han brindat de tornada. ho he vist. molt tendre."]],
    popo: [["Your {d}, somebody come take it already. Good, good.", "你留下的那杯{d}，有人来拿走了。好，好。", "你留低嗰杯{d}，有人嚟攞咗。好，好。", "你留低嗰杯{d}，有人嚟攞咗。好，好。", "El {d} que dejaste, alguien viene y lo coge. Bien, bien.", "El {d} que vas deixar, algú l'ha vingut a buscar. Molt bé, molt bé."],
      ["Your {d}, they drink and say cheers back wor! Good friend. Keep.", "你请的那杯{d}，人家喝了还回敬你！好朋友。要珍惜呀。", "你請嗰杯{d}，人哋飲咗仲回敬你！好朋友嚟，要珍惜。", "你請嗰杯{d}，人哋飲咗仲回敬你！好朋友嚟，要珍惜。", "Tu {d}, ellos beben y dicen salud de vuelta. Buen amigo. Guarda.", "El teu {d}: se l'han begut i t'han brindat de tornada! Bon amic. Cuida'l."]],
    cats: [["*Yuzu sits on an empty coaster with your name on it, very pleased. Someone came for the {d}.*", "*柚子坐在一张写着你名字的空杯垫上，很得意。有人来取走了那杯{d}。*", "*柚子坐在一張寫著你名字的空杯墊上，很得意。有人來取走了那杯{d}。*", "*柚子坐咗喺一張寫住你個名嘅空杯墊度，好得意。有人嚟攞咗杯{d}。*", "*Yuzu se sienta en un posavasos vacío con tu nombre, muy satisfecha. Alguien vino por el {d}.*", "*La Yuzu s'asseu en un sotagot buit amb el teu nom, molt satisfeta. Algú ha vingut pel {d}.*"],
      ["*Miso pushes an empty glass towards you, then taps it. Your {d} was raised back. Clink.*", "*味噌把一只空杯推到你面前，又碰了碰它。你请的{d}被回敬了。叮。*", "*味噌把一隻空杯推到你面前，又碰了碰它。你請的{d}被回敬了。叮。*", "*味噌推隻空杯埋嚟，再掂一掂佢。你請嗰杯{d}有人回敬咗。叮。*", "*Miso te acerca un vaso vacío y le da un toque. Te devolvieron el brindis por el {d}. Chin.*", "*La Miso t'acosta un got buit i hi dona un copet. T'han tornat el brindis pel {d}. Xin.*"]],
    mantou: [["*Mantou brings you the coaster from your {d}, a little chewed. Someone picked it up.* Woof.", "*馒头把你那杯{d}的杯垫叼过来，有点被咬过。有人来取走了。* 汪。", "*饅頭把你那杯{d}的杯墊叼過來，有點被咬過。有人來取走了。* 汪。", "*饅頭擔咗你杯{d}張杯墊過嚟，有少少咬過。有人嚟攞咗。* 汪。", "*Mantou te trae el posavasos de tu {d}, un poco mordido. Alguien lo recogió.* Guau.", "*En Mantou et porta el sotagot del teu {d}, una mica mossegat. Algú l'ha recollit.* Bup."],
      ["*Mantou's tail goes round and round. Your {d} was raised back.* Woof!", "*馒头的尾巴转个不停。你请的{d}被回敬了。* 汪！", "*饅頭的尾巴轉個不停。你請的{d}被回敬了。* 汪！", "*饅頭條尾轉個不停。你請嗰杯{d}有人回敬咗。* 汪！", "*La cola de Mantou da vueltas y vueltas. Te devolvieron el brindis por el {d}.* ¡Guau!", "*La cua d'en Mantou fa voltes i voltes. T'han tornat el brindis pel {d}.* Bup!"]]
  };
  const q = new URLSearchParams(location.search);
  const GIFT = (q.get('gift') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  let pendingKey = null, lastServed = null, friend = { n: '', i: '' }, myClink = 0, theirClink = 0;
  function myName() { return (typeof Patron !== 'undefined' && Patron.name) || (function () { try { return localStorage.getItem('fb_nick') || ''; } catch (e) { return ''; } })(); }
  function key() { let k = null; try { k = localStorage.getItem('fb_device_key'); } catch (e) {} if (!k) { const a = new Uint8Array(32); crypto.getRandomValues(a); k = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); try { localStorage.setItem('fb_device_key', k); } catch (e) {} } return k; }
  function rpc(fn, args) { if (!DB.sb) return Promise.reject(new Error('offline')); return DB.sb.rpc(fn, args).then(r => { if (r.error) throw r.error; return r.data; }); }
  function drinkName(d) { const m = d && d.k && DrinkManifest[d.k]; return m ? L(m.name) : (d && d.n) || ''; }
  function drinkIcon(d) { const m = d && d.k && DrinkManifest[d.k]; return (m && m.icon) || (d && d.i) || '🍸'; }
  const awake = () => AppState.weiState === 'awake' && !(window.WeiAway && WeiAway.on());

  /* ---- the seat ---- */
  let duo = null;
  duo = window.FBDuo ? FBDuo({
    topic: 'fbbar', name: myName,
    onNote() {},   /* Wei and the stool at the counter say it here */
    onPeer(here) { if (here && duo) { duo.send('me', { n: myName(), i: lastServed ? lastServed.i : '' }); } else friend = { n: '', i: '' }; paintSeat(); },
    onMsg(ev, p) {
      if (ev === 'me') {
        const first = !friend.n && !friend.i; friend = { n: String(p.n || '').slice(0, 24), i: String(p.i || '').slice(0, 8) }; paintSeat();
        if (first) { SoundEngine.playClick(); if (awake()) { showBubble(X(T.hi).replace('{n}', friend.n || X(T.friend))); animateWei('wei-hop'); } }
      } else if (ev === 'clink') {
        theirClink = Date.now(); SoundEngine.playClink(); bump();
        if (Date.now() - myClink < 4000) together(); else showBubble(X(T.theyClink).replace('{n}', friend.n || X(T.friend)), 2600);
      }
    },
    onState() { paintSeat(); }
  }) : null;
  function paintSeat() {
    const el = document.getElementById('friend-seat'); if (!el || !duo) return;
    const code = duo.code(), here = duo.peer();
    el.hidden = !code; el.classList.toggle('on', here);
    el.querySelector('.fs-drink').textContent = here ? (friend.i || '') : '';
    el.querySelector('.fs-name').textContent = here ? (friend.n || '👥') : code;
    el.setAttribute('aria-label', here ? (friend.n || X(T.friend)) : '👥 ' + code);
  }
  function bump() { const el = document.getElementById('friend-seat'); if (!el) return; el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); }
  function together() {
    myClink = theirClink = 0;
    setTimeout(() => SoundEngine.playClink(), 120); setTimeout(() => SoundEngine.playClink(), 260);
    showBubble('🥂 ' + X(T.clink), 3000);
    if (awake()) { setExpression('grin', 2200); animateWei('wei-hop'); }
    const st = document.getElementById('friend-seat'); if (st) { const h = document.createElement('span'); h.className = 'fs-heart'; h.textContent = '♥'; st.appendChild(h); setTimeout(() => h.remove(), 1600); }
  }

  /* ---- remember what was just served; tell the friend at the seat ---- */
  const _serve = serveItemByKey;
  serveItemByKey = function (k, o) { pendingKey = k; try { return _serve.apply(this, arguments); } finally { pendingKey = null; } };
  const _show = showServed;
  showServed = function (o) {
    _show.apply(this, arguments);
    lastServed = { k: pendingKey || null, i: o.icon, n: String(o.name || '').replace(/ 🎁$/, '').slice(0, 60) };
    if (o.pick) lastServed.pk = { s: o.pick.shop, a: o.pick.area, f: o.pick.find || '', m: o.pick.map || '' };   /* a neighbour's pick travels with the gift: where to find the real one */
    const g = document.getElementById('res-btn-gift'); if (g) { g.title = X(T.gift); g.setAttribute('aria-label', X(T.gift)); }
    if (duo && duo.peer()) duo.send('me', { n: myName(), i: o.icon });
    document.getElementById('gift-row') && !o.gift && document.getElementById('gift-row').remove();
  };
  const _cheers = doCheers;
  doCheers = function () {
    _cheers.apply(this, arguments);
    if (duo && duo.peer()) { myClink = Date.now(); duo.send('clink', {}); if (Date.now() - theirClink < 4000) together(); }
  };

  /* ---- the sheet: sign it, a line, send ---- */
  function sheet() {
    let m = document.getElementById('gift-sheet'); if (m) m.remove();
    if (!lastServed) return;
    m = document.createElement('div'); m.id = 'gift-sheet'; m.setAttribute('role', 'dialog');
    m.innerHTML = '<div class="gs-top"><span class="gs-i" aria-hidden="true"></span><b class="gs-n"></b><button type="button" class="gs-x" aria-label="✕">✕</button></div>' +
      '<label class="label"><span class="gs-lf"></span><input class="field gs-from" maxlength="24" autocomplete="nickname"></label>' +
      '<label class="label"><span class="gs-ll"></span><input class="field gs-line" maxlength="80" autocomplete="off"></label>' +
      '<button type="button" class="btn btn-amber gs-send"></button><button type="button" class="opt-btn gs-seat"></button><p class="gs-st" aria-live="polite"></p>';
    document.body.appendChild(m);
    m.querySelector('.gs-i').textContent = lastServed.i; m.querySelector('.gs-n').textContent = lastServed.n;
    m.querySelector('.gs-lf').textContent = X(T.from); m.querySelector('.gs-ll').textContent = X(T.line);
    m.querySelector('.gs-from').value = myName();
    m.querySelector('.gs-send').textContent = X(T.send); m.querySelector('.gs-seat').textContent = X(T.seat);
    m.querySelector('.gs-x').onclick = () => m.remove();
    m.querySelector('.gs-seat').onclick = () => { m.remove(); if (duo) duo.open(); };
    const st = m.querySelector('.gs-st'), btn = m.querySelector('.gs-send');
    btn.onclick = () => {
      btn.disabled = true; st.textContent = '…';
      const from = m.querySelector('.gs-from').value.trim(), line = m.querySelector('.gs-line').value.trim();
      rpc('bar_gift_send', { p_secret: key(), p_drink: lastServed, p_from: from, p_note: line }).then(code => {
        const seat = duo ? duo.ensure() : '';
        const u = location.origin + '/nearby/next-door/?gift=' + code + (seat ? '&with=' + seat : '');
        try { const mine = JSON.parse(localStorage.getItem('fb_gifts_sent') || '[]'); mine.unshift(code); localStorage.setItem('fb_gifts_sent', JSON.stringify(mine.slice(0, 20))); } catch (e) {}
        const done = () => { st.textContent = X(T.copied); setTimeout(() => m.remove(), 1400); };
        if (navigator.share) navigator.share({ title: lastServed.i + ' ' + lastServed.n, url: u }).then(() => m.remove(), () => { if (navigator.clipboard) navigator.clipboard.writeText(u).then(done, () => { st.textContent = u; }); else st.textContent = u; });
        else if (navigator.clipboard) navigator.clipboard.writeText(u).then(done, () => { st.textContent = u; });
        else st.textContent = u;
        if (awake()) { showBubble(X(T.wrap)); animateWei('wei-wiggle'); }
        SoundEngine.playClick();
      }).catch(e => { btn.disabled = false; st.textContent = /rest/.test(String(e && e.message)) ? X(T.rest) : X(T.off); });
    };
    setTimeout(() => m.querySelector('.gs-from').focus(), 50);
  }

  /* ---- arriving with a gift ---- */
  function land() {
    rpc('bar_gift_open', { p_code: GIFT }).then(g => {
      if (!g || !g.drink) { showBubble(X(T.gone), 3600); return; }
      const d = g.drink, m = d.k && DrinkManifest[d.k];
      SoundEngine.playClink();
      showServed({ icon: drinkIcon(d), name: drinkName(d) + ' 🎁', sub: g.from ? X(T.fromX).replace('{n}', g.from) : X(T.fromAnon), desc: g.note ? '"' + g.note + '"' : (m ? L(m.desc) : ''), formula: m ? m.formula : (d.pk ? '📍 ' + d.pk.s + ' · ' + d.pk.a : ''), reactable: false, gift: true, pick: d.pk ? { shop: d.pk.s, area: d.pk.a, find: d.pk.f, map: d.pk.m } : null, real: d.k || null });
      if (awake()) { showBubble(X(T.paid), 3200); animateWei('wei-wiggle'); } else showBubble(X(T.catsPaid), 3600);
      const desc = document.getElementById('res-description');
      const row = document.createElement('div'); row.id = 'gift-row'; row.className = 'flex gap-1.5 mb-2';
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn-amber btn-sm'; b.textContent = X(T.raise);
      if (g.raised) b.disabled = true;
      b.onclick = () => {
        b.disabled = true; doCheers(); rpc('bar_gift_raise', { p_code: GIFT }).catch(() => {});
        setTimeout(() => showBubble(awake() ? X(T.raised) : '🐾 ♥', 3000), 900);
      };
      row.appendChild(b); desc.after(row);
    }).catch(() => showBubble(X(T.off), 3000));
  }
  /* ---- you come back: how did your drinks go? (once each) ---- */
  function report() {
    let sent = []; try { sent = JSON.parse(localStorage.getItem('fb_gifts_sent') || '[]'); } catch (e) {}
    if (!sent.length) return;
    rpc('bar_gift_mine', { p_secret: key() }).then(list => {
      let told = {}; try { told = JSON.parse(localStorage.getItem('fb_gifts_told') || '{}'); } catch (e) {}
      const st = x => x.raised ? 2 : x.opened ? 1 : 0;
      const it = (list || []).find(x => st(x) > (told[x.code] || 0)); if (!it) return;
      /* whoever is behind the counter tells you, in their own way, once the counter is quiet; it's marked told only then */
      let tries = 0;
      const tell = () => {
        const k = window.NDChat ? NDChat.who() : (awake() ? 'wei' : null);
        if (!k) return;   /* nobody to tell you: next visit */
        if (AppState.uiMode !== 'topic' || NDChat.busy()) { if (++tries < 24) setTimeout(tell, 5000); return; }
        const tl = TOLD[k] || TOLD.wei;
        if (!(window.NDSay && NDSay(X(it.raised ? tl[1] : tl[0]).replace('{d}', drinkName(it.drink) || X(T.yours))))) return;
        if (k !== 'cats' && k !== 'mantou') setExpression('grin', 1800);
        (list || []).forEach(x => { if (st(x)) told[x.code] = st(x); });
        try { localStorage.setItem('fb_gifts_told', JSON.stringify(told)); } catch (e) {}
      };
      tell();
    }).catch(() => {});
  }
  function whenIn(f, ms) { const t = setInterval(() => { if (AppState.inSanctuary) { clearInterval(t); setTimeout(f, ms); } }, 300); }
  if (GIFT.length === 6) whenIn(land, 1400); else whenIn(report, 5200);
  window.BarGift = { open: sheet, seat() { if (duo) duo.open(); }, last() { return lastServed; } };
})();
