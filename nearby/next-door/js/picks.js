/* ===== Neighbours' picks: real favourites from where people live =====
   A coffee, a beer, a dish someone loves, with the shop, the area and how to find it (town_bar_picks). Order one at the counter
   and the card tells you where to have the real one: 🗺️ opens it in your phone's maps. Wei's own menu points to the real thing
   it is ("find a negroni near you"). Picks are public; hidden after 3 reports; 6 a day. */
(function () {
  const X = a => L(lx(a));
  const KINDS = [['coffee', '☕'], ['tea', '🍵'], ['beer', '🍺'], ['cocktail', '🍸'], ['wine', '🍷'], ['food', '🍜'], ['sweet', '🍰'], ['other', '✨']];
  const T = {
    title: ["Neighbours' picks", "邻居的心头好", "鄰居的心頭好", "鄰居嘅心頭好", "Lo que eligen los vecinos", "El que trien els veïns"],
    where: ["Where? A city or a street", "在哪？城市或街区", "在哪？城市或街區", "喺邊？城市或者街區", "¿Dónde? Una ciudad o un barrio", "On? Una ciutat o un barri"],
    add: ["＋ Add your favourite", "＋ 加上你的心头好", "＋ 加上你的心頭好", "＋ 加你嘅心頭好", "＋ Añade tu favorito", "＋ Afegeix el teu preferit"],
    none: ["Nobody has written one here yet.", "这里还没人写过。", "這裡還沒人寫過。", "呢度仲未有人寫過。", "Aquí aún no ha escrito nadie.", "Aquí encara no hi ha escrit ningú."],
    what: ["What is it?", "是什么？", "是什麼？", "係咩？", "¿Qué es?", "Què és?"],
    shop: ["Where you have it (the shop)", "在哪家店喝到/吃到", "在哪家店喝到／吃到", "喺邊間舖", "Dónde lo tomas (el local)", "On el prens (el local)"],
    area: ["Street, area, city", "街道、街区、城市", "街道、街區、城市", "街、區、城市", "Calle, barrio, ciudad", "Carrer, barri, ciutat"],
    find: ["How to find it (optional)", "怎么找到（可不填）", "怎麼找到（可不填）", "點樣搵（可以唔填）", "Cómo encontrarlo (opcional)", "Com trobar-lo (opcional)"],
    map: ["Map link (optional)", "地图链接（可不填）", "地圖連結（可不填）", "地圖連結（可以唔填）", "Enlace del mapa (opcional)", "Enllaç del mapa (opcional)"],
    sign: ["Sign it (optional)", "署名（可不填）", "署名（可不填）", "署名（可以唔填）", "Fírmalo (opcional)", "Signa'l (opcional)"],
    send: ["✓ Put it on the board", "✓ 写上黑板", "✓ 寫上黑板", "✓ 寫上黑板", "✓ Ponlo en la pizarra", "✓ Posa-ho a la pissarra"],
    chalk: ["*writes it on the chalkboard, slowly, so it's spelled right* Next round, someone orders yours.", "*一笔一划写上黑板，生怕写错* 下一轮，就有人点你这杯了。", "*一筆一劃寫上黑板，生怕寫錯* 下一輪，就有人點你這杯了。", "*一筆一劃寫上黑板，驚寫錯* 下一輪，就有人叫你呢杯喇。", "*lo escribe en la pizarra, despacio, para no equivocarse* La próxima ronda, alguien pide el tuyo.", "*ho escriu a la pissarra, a poc a poc, per no equivocar-se* La propera ronda, algú demana el teu."],
    rest: ["*taps the chalk* Six today. Tomorrow.", "*敲敲粉笔* 今天六个了，明天吧。", "*敲敲粉筆* 今天六個了，明天吧。", "*敲敲粉筆* 今日六個喇，聽日啦。", "*da golpecitos con la tiza* Seis hoy. Mañana.", "*dona copets amb el guix* Sis avui. Demà."],
    off: ["The line to the street is down. Try in a bit.", "和街上的联系断了，等一会儿再试。", "和街上的聯繫斷了，等一會兒再試。", "同街外嘅聯絡斷咗，等陣再試。", "No hay línea con la calle. Prueba en un rato.", "No hi ha línia amb el carrer. Prova-ho d'aquí a una estona."],
    findIt: ["🗺️ Find it", "🗺️去找它", "🗺️去找它", "🗺️去搵佢", "🗺️ Encuéntralo", "🗺️ Troba'l"],
    nearYou: ["🗺️ Find one near you", "🗺️ 找附近的一杯", "🗺️ 找附近的一杯", "🗺️ 搵附近嘅一杯", "🗺️ Busca uno cerca", "🗺️ Busca'n un a prop"],
    by: ["picked by {n}", "{n} 的心头好", "{n} 的心頭好", "{n} 嘅心頭好", "elegido por {n}", "triat per {n}"],
    serve: ["*reads the chalkboard, makes his best guess at it* The real one is in {a}. This is me trying.", "*看了看黑板，尽力还原* 真正的在{a}。这杯是我的尝试。", "*看了看黑板，盡力還原* 真正的在{a}。這杯是我的嘗試。", "*睇一睇黑板，盡力整* 真嘅喺{a}。呢杯係我試吓。", "*lee la pizarra y lo intenta* El de verdad está en {a}. Este es mi intento.", "*llegeix la pissarra i ho intenta* El de veritat és a {a}. Aquest és el meu intent."],
    report: ["Not right", "不妥", "不妥", "唔妥", "No está bien", "No està bé"],
    kind: { coffee: ["Coffee", "咖啡", "咖啡", "咖啡", "Café", "Cafè"], tea: ["Tea", "茶", "茶", "茶", "Té", "Te"], beer: ["Beer", "啤酒", "啤酒", "啤酒", "Cerveza", "Cervesa"], cocktail: ["Cocktail", "鸡尾酒", "雞尾酒", "雞尾酒", "Cóctel", "Còctel"], wine: ["Wine", "葡萄酒", "葡萄酒", "葡萄酒", "Vino", "Vi"], food: ["Food", "吃的", "吃的", "食嘅", "Comida", "Menjar"], sweet: ["Something sweet", "甜点", "甜點", "甜品", "Algo dulce", "Alguna cosa dolça"], other: ["Something else", "别的", "別的", "其他", "Otra cosa", "Una altra cosa"] }
  };
  /* Wei's own menu is made of real things: this is what to look for near you */
  const REAL = {
    jasmine_gulou: ["gin and tonic", "金汤力", "gin tonic", "gintònic"], catalan: ["gin and tonic", "金汤力", "gin tonic", "gintònic"], kyoto: ["gin and tonic", "金汤力", "gin tonic", "gintònic"],
    catalan_vermut: ["vermouth bar", "味美思", "vermutería", "vermuteria"], oldfashioned: ["old fashioned cocktail", "古典鸡尾酒", "old fashioned", "old fashioned"],
    negroni: ["negroni", "尼格罗尼", "negroni", "negroni"], paperplane: ["cocktail bar", "鸡尾酒吧", "coctelería", "cocteleria"], last_word: ["cocktail bar", "鸡尾酒吧", "coctelería", "cocteleria"],
    smoked_rosemary: ["whisky highball", "威士忌嗨棒", "highball de whisky", "highball de whisky"], sazerac: ["sazerac", "萨泽拉克", "sazerac", "sazerac"],
    gesha_pourover: ["specialty coffee pour over", "精品手冲咖啡", "café de especialidad", "cafè d'especialitat"], yunnan_honey_pour: ["specialty coffee pour over", "精品手冲咖啡", "café de especialidad", "cafè d'especialitat"],
    dirty_espresso: ["dirty coffee", "脏脏咖啡", "café dirty", "cafè dirty"], barceloneta_cortado: ["cortado", "可塔朵", "cortado", "tallat"],
    croissant_combo: ["croissant flat white", "可颂 澳白", "cruasán flat white", "croissant flat white"], coldbrew_tonic: ["cold brew tonic", "冷萃汤力", "cold brew tónica", "cold brew tònica"],
    einspanner: ["einspänner coffee", "维也纳咖啡", "café vienés", "cafè vienès"], matcha_cloud: ["matcha latte", "抹茶拿铁", "matcha latte", "matcha latte"], wei_notebook: ["jasmine tea", "茉莉花茶", "té de jazmín", "te de gessamí"]
  };
  function realQ(k) { const r = REAL[k]; if (!r) return ''; const lg = AppState.lang; return lg === 'zh' || lg === 'tw' || lg === 'yue' ? r[1] : lg === 'es' ? r[2] : lg === 'ca' ? r[3] : r[0]; }
  function mapsUrl(q, url) {   /* the visitor's own maps: Apple Maps on Apple devices, the system's map app on Android, OpenStreetMap elsewhere */
    if (url && /^https:\/\//.test(url)) return url;
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|Macintosh/.test(ua) && 'ontouchend' in document || /iPhone|iPad/.test(ua)) return 'https://maps.apple.com/?q=' + encodeURIComponent(q);
    if (/Android/.test(ua)) return 'geo:0,0?q=' + encodeURIComponent(q);
    return 'https://www.openstreetmap.org/search?query=' + encodeURIComponent(q);
  }
  function key() { let k = null; try { k = localStorage.getItem('fb_device_key'); } catch (e) {} if (!k) { const a = new Uint8Array(32); crypto.getRandomValues(a); k = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); try { localStorage.setItem('fb_device_key', k); } catch (e) {} } return k; }
  function rpc(fn, args) { if (!DB.sb) return Promise.reject(new Error('offline')); return DB.sb.rpc(fn, args).then(r => { if (r.error) throw r.error; return r.data; }); }
  const awake = () => AppState.weiState === 'awake' && !(window.WeiAway && WeiAway.on());
  const icon = k => (KINDS.find(x => x[0] === k) || KINDS[7])[1];
  function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  let kind = null, q = '', sheetEl = null, timer = null;
  function close() { document.querySelectorAll('#picks-sheet').forEach(e => e.remove()); sheetEl = null; }
  function open() {
    close(); sheetEl = el('div', ''); sheetEl.id = 'picks-sheet'; sheetEl.setAttribute('role', 'dialog');
    const top = el('div', 'ps-top'); top.appendChild(el('b', '', '📍 ' + X(T.title))); const x = el('button', 'btn ps-x', '✕'); x.type = 'button'; x.setAttribute('aria-label', '✕'); x.onclick = close; top.appendChild(x);
    const chips = el('div', 'ps-kinds'); const all = el('button', 'chip-btn', '✳'); all.type = 'button'; all.setAttribute('aria-pressed', String(!kind)); all.onclick = () => { kind = null; open(); }; chips.appendChild(all);
    KINDS.forEach(([k, ic]) => { const b = el('button', 'chip-btn', ic); b.type = 'button'; b.title = X(T.kind[k]); b.setAttribute('aria-label', b.title); b.setAttribute('aria-pressed', String(kind === k)); b.onclick = () => { kind = k; open(); }; chips.appendChild(b); });
    const where = el('input', 'field ps-q'); where.placeholder = X(T.where); where.value = q; where.setAttribute('aria-label', X(T.where)); where.oninput = () => { q = where.value; clearTimeout(timer); timer = setTimeout(fill, 350); };
    const list = el('div', 'ps-list'); list.setAttribute('aria-live', 'polite');
    const add = el('button', 'btn btn-amber ps-add', X(T.add)); add.type = 'button'; add.onclick = form;
    [top, chips, where, list, add].forEach(n => sheetEl.appendChild(n));
    document.body.appendChild(sheetEl); fill();
    function fill() {
      list.textContent = '…';
      rpc('bar_pick_list', { p_kind: kind, p_q: q.trim() || null, p_limit: 40 }).then(rows => {
        list.innerHTML = '';
        if (!rows || !rows.length) { list.appendChild(el('p', 'ps-none', X(T.none))); return; }
        rows.forEach(r => {
          const b = el('button', 'opt-btn ps-item'); b.type = 'button';
          b.appendChild(el('span', 'ps-i', r.icon || icon(r.kind))); const t = el('span', 'ps-t'); t.appendChild(el('b', '', r.name)); t.appendChild(el('small', '', r.shop + ' · ' + r.area)); b.appendChild(t);
          b.onclick = () => { close(); serve(r); }; list.appendChild(b);
        });
      }).catch(() => { list.textContent = X(T.off); });
    }
  }
  function form() {
    close(); sheetEl = el('form', ''); sheetEl.id = 'picks-sheet'; sheetEl.setAttribute('role', 'dialog');
    let k = kind || 'coffee';
    const top = el('div', 'ps-top'); top.appendChild(el('b', '', X(T.add).replace('＋ ', '📍 '))); const x = el('button', 'btn ps-x', '✕'); x.type = 'button'; x.onclick = open; top.appendChild(x); sheetEl.appendChild(top);
    const chips = el('div', 'ps-kinds'); KINDS.forEach(([kk, ic]) => { const b = el('button', 'chip-btn', ic); b.type = 'button'; b.title = X(T.kind[kk]); b.setAttribute('aria-label', b.title); b.setAttribute('aria-pressed', String(k === kk)); b.onclick = () => { k = kk; chips.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', String(o === b))); }; chips.appendChild(b); }); sheetEl.appendChild(chips);
    const fld = (label, max, req, val, type) => { const l = el('label', 'label ps-f'); l.appendChild(el('span', '', label)); const i = el('input', 'field'); i.maxLength = max; if (req) i.required = true; if (type) i.type = type; if (val) i.value = val; i.autocomplete = 'off'; l.appendChild(i); sheetEl.appendChild(l); return i; };
    const nm = fld(X(T.what), 40, true), sh = fld(X(T.shop), 60, true), ar = fld(X(T.area), 60, true), fd = fld(X(T.find), 140), mp = fld(X(T.map), 300, false, '', 'url');
    const by = fld(X(T.sign), 24, false, (typeof Patron !== 'undefined' && Patron.name) || (function () { try { return localStorage.getItem('fb_nick') || ''; } catch (e) { return ''; } })());
    const go = el('button', 'btn btn-amber ps-add', X(T.send)); go.type = 'submit'; sheetEl.appendChild(go);
    const st = el('p', 'ps-none'); st.setAttribute('aria-live', 'polite'); sheetEl.appendChild(st);
    sheetEl.onsubmit = e => {
      e.preventDefault(); go.disabled = true; st.textContent = '…';
      rpc('bar_pick_add', { p_secret: key(), p_kind: k, p_icon: icon(k), p_name: nm.value, p_shop: sh.value, p_area: ar.value, p_find: fd.value, p_map: mp.value, p_by: by.value })
        .then(() => { SoundEngine.playClick(); if (awake()) { showBubble(X(T.chalk), 4000); animateWei('wei-wiggle'); } kind = k; q = ''; open(); })
        .catch(err => { go.disabled = false; st.textContent = /rest/.test(String(err && err.message)) ? X(T.rest) : X(T.off); });
    };
    document.body.appendChild(sheetEl); setTimeout(() => nm.focus(), 30);
  }
  function serve(r) {
    SoundEngine.playClink();
    showServed({ icon: r.icon || icon(r.kind), name: r.name, sub: '📍 ' + r.shop + ' · ' + r.area, desc: r.find ? '"' + r.find + '"' : '', formula: r.by ? X(T.by).replace('{n}', r.by) : '', reactable: false, pick: r, food: r.kind === 'food' || r.kind === 'sweet' });
    if (awake()) { showBubble(X(T.serve).replace('{a}', r.area)); animateWei('wei-wiggle'); }
  }
  /* every card at the counter gets a way to the real thing */
  const _show = showServed;
  showServed = function (o) {
    _show.apply(this, arguments);
    const old = document.getElementById('pick-row'); if (old) old.remove();
    const p = o.pick;
    let href = '', label = '';
    if (p) { href = mapsUrl(p.shop + ' ' + p.area, p.map); label = X(T.findIt); }
    if (!href) return;
    const row = el('div', 'flex gap-1.5 mb-2 flex-wrap'); row.id = 'pick-row';
    const a = el('a', 'btn btn-sm', label); a.href = href; if (/^https:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } row.appendChild(a);
    if (p && p.id) { const rp = el('button', 'btn btn-sm', '⚑'); rp.type = 'button'; rp.title = X(T.report); rp.setAttribute('aria-label', rp.title); rp.onclick = () => { rp.disabled = true; rpc('bar_pick_report', { p_secret: key(), p_id: p.id }).then(() => { rp.textContent = '✓'; }).catch(() => { rp.disabled = false; }); }; row.appendChild(rp); }
    const desc = document.getElementById('res-description'); (document.getElementById('gift-row') || desc).after(row);
  };
  window.BarPicks = { open, add: form, near: k => REAL[k] ? mapsUrl(realQ(k)) : '', nearLabel: () => X(T.nearYou) };
})();
