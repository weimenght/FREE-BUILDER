/* Popo's recipe box: a family recipe (the dish, whose it is, who you cook it for, how) that Popo cooks for the next person who asks
   (town_bar_recipes via recipe_add/list/get/report/forget). Its key is sha256("recipe:" + fb_device_key), made on the device.
   Public until the writer takes it back; 3 a day; hidden after 3 reports. Served as a plate (another plate, not another glass). */
(function () {
  const X = a => L(lx(a));
  const T = {
    title: ["Popo's recipe box", "婆婆的食谱盒", "婆婆的食譜盒", "婆婆嘅食譜盒", "La caja de recetas de Popo", "La capsa de receptes de la Popo"],
    q: ["Look for a dish", "找一道菜", "找一道菜", "搵一味菜", "Busca un plato", "Busca un plat"],
    add: ["＋ Leave a family recipe", "＋ 留下一道家传菜", "＋ 留下一道家傳菜", "＋ 留低一味家傳菜", "＋ Deja una receta de familia", "＋ Deixa una recepta de família"],
    none: ["The box is empty. Be the first: whose recipe do you keep?", "盒子还是空的。你先来：你留着谁的食谱？", "盒子還是空的。你先來：你留著誰的食譜？", "個盒仲係空嘅。你嚟頭一個：你留住邊個嘅食譜？", "La caja está vacía. Sé el primero: ¿de quién es la receta que guardas?", "La capsa és buida. Sigues el primer: de qui és la recepta que guardes?"],
    dish: ["The dish", "菜名", "菜名", "菜名", "El plato", "El plat"],
    whose: ["Whose recipe? (my grandmother's, my dad's…)", "谁的食谱？（我外婆的、我爸的……）", "誰的食譜？（我外婆的、我爸的……）", "邊個嘅食譜？（我婆婆嘅、我阿爸嘅……）", "¿De quién es? (de mi abuela, de mi padre…)", "De qui és? (de la meva àvia, del meu pare…)"],
    forwho: ["Who do you cook it for? (optional)", "做给谁吃？（可不填）", "做給誰吃？（可不填）", "煮俾邊個食？（可以唔填）", "¿Para quién la cocinas? (opcional)", "Per a qui la cuines? (opcional)"],
    body: ["How to make it", "怎么做", "怎麼做", "點樣煮", "Cómo se hace", "Com es fa"],
    sign: ["Sign it (optional)", "署名（可不填）", "署名（可不填）", "署名（可以唔填）", "Fírmala (opcional)", "Signa-la (opcional)"],
    send: ["✓ Put it in the box", "✓ 放进盒子", "✓ 放進盒子", "✓ 放入盒", "✓ Ponla en la caja", "✓ Posa-la a la capsa"],
    cook: ["🍲 Cook it for me", "🍲 做给我吃", "🍲 做給我吃", "🍲 煮俾我食", "🍲 Cocínamela", "🍲 Cuina-me-la"],
    mineX: ["Take it back", "收回", "收回", "攞返", "Retirarla", "Retirar-la"],
    report: ["Not right", "不妥", "不妥", "唔妥", "No está bien", "No està bé"],
    rest: ["Three today. Tomorrow more.", "今天三道了，明天再来。", "今天三道了，明天再來。", "今日三味喇，聽日再嚟。", "Tres hoy. Mañana más.", "Tres avui. Demà més."],
    off: ["The box is stuck. Try in a bit.", "盒子打不开，等一会儿再试。", "盒子打不開，等一會兒再試。", "個盒打唔開，等陣再試。", "La caja se ha atascado. Prueba en un rato.", "La capsa s'ha encallat. Prova-ho d'aquí a una estona."],
    empty: ["Nobody has left a recipe yet. Leave yours?", "还没人留下食谱。留下你的？", "還沒人留下食譜。留下你的？", "仲未有人留低食譜。留低你嘅？", "Aún nadie ha dejado una receta. ¿Dejas la tuya?", "Encara ningú no hi ha deixat cap recepta. Hi deixes la teva?"],
    by: ["from {n}", "来自 {n}", "來自 {n}", "{n} 留低嘅", "de {n}", "de {n}"],
    forX: ["for {f}", "做给{f}", "做給{f}", "煮俾{f}", "para {f}", "per a {f}"],
    thanks: ["*Popo puts it in the tin box with the others, very carefully* Good. Somebody eat this tomorrow.", "*婆婆很小心地放进铁盒，和其他的放在一起* 好。明天有人食这个。", "*婆婆好小心咁放入鐵盒，同其他嗰啲擺埋一齊* 好。聽日有人食呢個。", "*婆婆好小心咁放入鐵盒，同其他嗰啲擺埋一齊* 好。聽日有人食呢個。", "*Popo la guarda en la caja de lata con las otras, con mucho cuidado* Bien. Mañana alguien come esto.", "*La Popo la desa a la capsa de llauna amb les altres, amb molta cura* Molt bé. Demà algú es menjarà això."],
    served: { popo: ["*reads it twice, rolls up her sleeves* Somebody's family make this. I make it like them. Eat slowly ah.", "*看了两遍，卷起袖子* 人家家里做的菜。我照他们那样煮。慢慢吃。", "*睇咗兩次，捋起衫袖* 人哋屋企煮嘅嘢。我照佢哋咁煮。慢慢食。", "*睇咗兩次，捋起衫袖* 人哋屋企煮嘅嘢。我照佢哋咁煮。慢慢食。", "*la lee dos veces, se arremanga* La familia de alguien hace esto. Yo hago como ellos. Come despacio.", "*la llegeix dues vegades i s'arremanga* Això ho fa la família d'algú. Ho faig com ells. Menja a poc a poc."],
      wei: ["*follows the card to the letter, then tastes it* Someone's family recipe. I hope I did it justice.", "*照着卡片一步不差地做，然后尝了一口* 别人家的家传菜。希望我没做砸。", "*照著卡片一步不差地做，然後嚐了一口* 別人家的家傳菜。希望我沒做砸。", "*照住張卡一步一步咁煮，再試咗一啖* 人哋屋企嘅家傳菜。希望冇煮衰佢。", "*sigue la tarjeta al pie de la letra y lo prueba* La receta de familia de alguien. Espero haberle hecho justicia.", "*segueix la targeta al peu de la lletra i ho tasta* La recepta de família d'algú. Espero haver-li fet justícia."],
      mei: ["*reads it off the card, burns one bit* It's… mostly right? Someone's grandma would fix it.", "*照着卡片念，烧焦了一点* 大概……差不多对？人家外婆会帮我修好的。", "*照著卡片念，燒焦了一點* 大概……差不多對？人家外婆會幫我修好的。", "*照住張卡讀，燶咗少少* 大概……差唔多啱？人哋婆婆會幫我執返好。", "*lo lee de la tarjeta y quema un trozo* ¿Está… casi bien? La abuela de alguien lo arreglaría.", "*ho llegeix de la targeta i en crema un tros* Està… gairebé bé? L'àvia d'algú ho arreglaria."],
      cats: ["*Miso pushes the recipe card across the counter to you. Someone will have to cook this at home.* Meow.", "*味噌把食谱卡推到你面前。得有人回家做这个了。* 喵。", "*味噌把食譜卡推到你面前。得有人回家做這個了。* 喵。", "*味噌將張食譜卡推埋你面前。要有人返屋企煮呢個喇。* 喵。", "*Miso te empuja la tarjeta por la barra. Alguien tendrá que cocinarlo en casa.* Miau.", "*La Miso t'empeny la targeta per la barra. Algú ho haurà de cuinar a casa.* Mèu."],
      mantou: ["*Mantou brings you the recipe card, a little damp at one corner. Someone will have to cook this at home.* Woof.", "*馒头把食谱卡叼给你，一角有点湿。得有人回家做这个了。* 汪。", "*饅頭把食譜卡叼給你，一角有點濕。得有人回家做這個了。* 汪。", "*饅頭擔住張食譜卡過嚟，有隻角濕咗少少。要有人返屋企煮呢個喇。* 汪。", "*Mantou te trae la ficha de la receta, un poco mojada en una esquina. Alguien tendrá que cocinarlo en casa.* Guau.", "*En Mantou et porta la fitxa de la recepta, una mica mullada per una punta. Algú ho haurà de cuinar a casa.* Bup."] }
  };
  function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  let sec = null;
  function secret() {
    if (sec) return sec;
    let k = null; try { k = localStorage.getItem('fb_device_key'); } catch (e) {}
    if (!k) { const a = new Uint8Array(32); crypto.getRandomValues(a); k = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); try { localStorage.setItem('fb_device_key', k); } catch (e) {} }
    return (sec = crypto.subtle.digest('SHA-256', new TextEncoder().encode('recipe:' + k)).then(b => Array.prototype.map.call(new Uint8Array(b), x => ('0' + x.toString(16)).slice(-2)).join('')));
  }
  function rpc(fn, args) { if (!DB.sb) return Promise.reject(new Error('offline')); return DB.sb.rpc(fn, args).then(r => { if (r.error) throw r.error; return r.data; }); }
  const LANG = () => ({ en: 'en', zh: 'zh', tw: 'zh-Hant', yue: 'zh-Hant', es: 'es', ca: 'ca' }[AppState.lang] || 'en');
  /* Popo's own cards, the first in the box: kept on the page, never sent, nothing to report */
  const POPO_RAW = [
    { dish: ["Congee for whoever is sick", "给生病的人煮的粥", "煲俾病咗嘅人食嘅粥", "煲俾病咗嘅人食嘅粥", "Congee para quien esté enfermo", "Congee per a qui estigui malalt"],
      whose: ["Popo's, from her mother in Sham Shui Po", "婆婆的，她妈妈在深水埗教的", "婆婆嘅，佢阿媽喺深水埗教嘅", "婆婆嘅，佢阿媽喺深水埗教嘅", "De Popo, de su madre en Sham Shui Po", "De la Popo, de la seva mare a Sham Shui Po"],
      forwho: ["anyone in bed with a cold", "躺在床上感冒的人", "瞓喺床感冒嗰個", "瞓喺床感冒嗰個", "quien esté en la cama con un resfriado", "qui sigui al llit amb un refredat"],
      body: ["One cup rice, wash two times. Ten cups water. A little oil, a little salt on the rice before. Boil, then small fire, one and a half hour. Stir sometimes, not always. Ginger in thin strips, spring onion at the end. White pepper. Sit with them while they eat lah. That is the medicine part.", "米一杯，洗两次。水十杯。下锅之前，米拌一点点油、一点点盐。大火烧开，转小火，一个半钟头。有时搅一下，不用一直搅。姜切细丝，最后才放葱，白胡椒粉。他们吃的时候，坐在旁边陪着。这个才是药。", "米一杯，洗兩次。水十杯。落鍋之前啲米撈少少油、少少鹽。大火滾起，收細火，一個半鐘。間中攪吓，唔使成日攪。薑切幼絲，最後先落蔥，白胡椒粉。佢食嘅時候坐喺隔籬陪住佢。嗰樣先係藥。", "米一杯，洗兩次。水十杯。落鍋之前啲米撈少少油、少少鹽。大火滾起，收細火，一個半鐘。間中攪吓，唔使成日攪。薑切幼絲，最後先落蔥，白胡椒粉。佢食嘅時候坐喺隔籬陪住佢。嗰樣先係藥。", "Una taza arroz, lavar dos veces. Diez tazas agua. Un poco aceite, un poco sal en el arroz antes. Hervir, luego fuego pequeño, hora y media. Remover a veces, no siempre. Jengibre en tiras finas, cebolleta al final. Pimienta blanca. Siéntate con ellos mientras comen. Esa es la parte medicina.", "Una tassa d'arròs, rentat dues vegades. Deu tasses d'aigua. Abans, una mica d'oli i de sal per sobre l'arròs. Que bulli, després foc baix una hora i mitja. Remena de tant en tant, no tota l'estona. Gingebre a tiretes fines i ceba tendra al final. Pebre blanc. Seu amb ells mentre mengen: aquesta és la part que cura."] },
    { dish: ["Escudella for a cold Sunday", "冷天星期日的 escudella", "凍嘅禮拜日煲嘅 escudella", "凍嘅禮拜日煲嘅 escudella", "Escudella para un domingo frío", "Escudella per a un diumenge de fred"],
      whose: ["Josep's mother's, taught to Popo in 1970", "Josep 妈妈的，1970 年教给婆婆", "Josep 阿媽嘅，1970 年教俾婆婆", "Josep 阿媽嘅，1970 年教俾婆婆", "De la madre de Josep, se la enseñó a Popo en 1970", "De la mare d'en Josep, que la va ensenyar a la Popo el 1970"],
      forwho: ["the whole family round one pot", "围着一锅的全家人", "成家人圍住一煲", "成家人圍住一煲", "toda la familia alrededor de una olla", "tota la família al voltant d'una olla"],
      body: ["Big pot. Chicken, a bone of ham, beef bone, chickpeas from the night before. Cold water, slow, take the foam. Two hours. Then carrot, potato, cabbage, celery. The pilota: minced meat, egg, garlic, parsley, breadcrumb, one big ball. Thirty minutes more. First the soup with big pasta, galets. Then the meat on a plate. Josep always say his mama put more salt. I never put more salt one.", "大锅。鸡、一块火腿骨、牛骨、前一晚泡好的鹰嘴豆。冷水下锅，慢慢煮，撇掉泡沫。两个钟头。然后放胡萝卜、土豆、包菜、芹菜。肉丸 pilota：肉末、鸡蛋、蒜、香芹、面包糠，搓一个大的。再煮三十分钟。先饮汤，汤里放大颗的 galets。肉再装盘。Josep 总是说他妈妈放更多盐。我从来不多放。", "大煲。雞、一嚿火腿骨、牛骨、隔晚浸好嘅雞心豆。凍水落，慢慢煲，撇走啲泡。兩個鐘。之後落紅蘿蔔、薯仔、椰菜、西芹。個肉丸 pilota：免治肉、雞蛋、蒜、番荽、麵包糠，搓一個大嘅。再煲三十分鐘。先飲湯，湯入面落大大粒嘅 galets。啲肉再上碟。Josep 成日話佢阿媽落多啲鹽。我從來唔落多。", "大煲。雞、一嚿火腿骨、牛骨、隔晚浸好嘅雞心豆。凍水落，慢慢煲，撇走啲泡。兩個鐘。之後落紅蘿蔔、薯仔、椰菜、西芹。個肉丸 pilota：免治肉、雞蛋、蒜、番荽、麵包糠，搓一個大嘅。再煲三十分鐘。先飲湯，湯入面落大大粒嘅 galets。啲肉再上碟。Josep 成日話佢阿媽落多啲鹽。我從來唔落多。", "Olla grande. Pollo, un hueso de jamón, hueso de ternera, garbanzos de la noche antes. Agua fría, despacio, quitar espuma. Dos horas. Luego zanahoria, patata, col, apio. La pilota: carne picada, huevo, ajo, perejil, pan rallado, una bola grande. Treinta minutos más. Primero la sopa con pasta grande, galets. Luego la carne en plato. Josep siempre decía su mamá ponía más sal. Yo nunca pongo más sal.", "Olla gran. Pollastre, un os de pernil, os de vedella i els cigrons en remull de la nit abans. Aigua freda, a poc a poc, i treu l'escuma. Dues hores. Després pastanaga, patata, col i api. La pilota: carn picada, ou, all, julivert i pa ratllat, una bola grossa. Mitja hora més. Primer la sopa amb galets, després la carn al plat. En Josep sempre deia que sa mare hi posava més sal. Jo no n'hi poso mai més."] }
  ];
  const POPO = () => POPO_RAW.map(r => ({ host: true, dish: X(r.dish), whose: X(r.whose), forwho: X(r.forwho), body: X(r.body), nick: L(lx(["Popo", "婆婆", "婆婆", "婆婆", "Popo", "la Popo"])) }));
  let sheetEl = null, q = '', timer = null;
  function close() { document.querySelectorAll('#picks-sheet').forEach(e => e.remove()); sheetEl = null; }
  function top(title, back) { const t = el('div', 'ps-top'); t.appendChild(el('b', '', '📖 ' + title)); const x = el('button', 'btn ps-x', '✕'); x.type = 'button'; x.setAttribute('aria-label', '✕'); x.onclick = back || close; t.appendChild(x); return t; }
  function open() {
    close(); sheetEl = el('div', ''); sheetEl.id = 'picks-sheet'; sheetEl.setAttribute('role', 'dialog');
    const s = el('input', 'field ps-q'); s.placeholder = X(T.q); s.value = q; s.setAttribute('aria-label', X(T.q)); s.oninput = () => { q = s.value; clearTimeout(timer); timer = setTimeout(fill, 350); };
    const list = el('div', 'ps-list'); list.setAttribute('aria-live', 'polite');
    const add = el('button', 'btn btn-amber ps-add', X(T.add)); add.type = 'button'; add.onclick = write;
    [top(X(T.title)), s, list, add].forEach(n => sheetEl.appendChild(n));
    document.body.appendChild(sheetEl); fill();
    function fill() {
      list.textContent = '…';
      secret().then(k => rpc('recipe_list', { p_secret: k, p_q: q.trim() || null })).then(rows => {
        list.innerHTML = '';
        const qq = q.trim().toLowerCase(); rows = POPO().filter(r => !qq || (r.dish + ' ' + r.whose + ' ' + r.body).toLowerCase().indexOf(qq) >= 0).concat(rows || []);
        if (!rows || !rows.length) { list.appendChild(el('p', 'ps-none', X(T.none))); return; }
        rows.forEach(r => { const b = el('button', 'opt-btn ps-item'); b.type = 'button'; const t = el('span', 'ps-t'); t.appendChild(el('b', '', r.dish)); t.appendChild(el('small', '', [r.whose, r.forwho ? X(T.forX).replace('{f}', r.forwho) : ''].filter(Boolean).join(' · '))); b.appendChild(t); b.onclick = () => card(r); list.appendChild(b); });
      }).catch(() => { list.innerHTML = ''; POPO().forEach(r => { const b = el('button', 'opt-btn ps-item'); b.type = 'button'; b.appendChild(el('b', '', r.dish)); b.onclick = () => card(r); list.appendChild(b); }); list.appendChild(el('p', 'ps-none', X(T.off))); });
    }
  }
  function card(r) {
    close(); sheetEl = el('div', ''); sheetEl.id = 'picks-sheet'; sheetEl.setAttribute('role', 'dialog');
    sheetEl.appendChild(top(r.dish, open));
    const meta = [r.whose, r.forwho ? X(T.forX).replace('{f}', r.forwho) : '', r.nick ? X(T.by).replace('{n}', r.nick) : ''].filter(Boolean).join(' · ');
    if (meta) sheetEl.appendChild(el('p', 'ps-none', meta));
    const body = el('p', ''); body.style.cssText = 'white-space:pre-wrap;margin:8px 2px 12px;font-size:17px;line-height:1.35'; body.textContent = r.body; sheetEl.appendChild(body);
    const row = el('div', 'flex gap-1.5 flex-wrap');
    const c = el('button', 'btn btn-amber', X(T.cook)); c.type = 'button'; c.onclick = () => { close(); serve(r); }; row.appendChild(c);
    if (r.host) {} else if (r.mine) { const f = el('button', 'btn btn-sm', X(T.mineX)); f.type = 'button'; f.onclick = () => { f.disabled = true; secret().then(k => rpc('recipe_forget', { p_secret: k, p_id: r.id })).then(open).catch(() => { f.disabled = false; }); }; row.appendChild(f); }
    else { const rp = el('button', 'btn btn-sm', '⚑'); rp.type = 'button'; rp.title = X(T.report); rp.setAttribute('aria-label', rp.title); rp.onclick = () => { rp.disabled = true; secret().then(k => rpc('recipe_report', { p_secret: k, p_id: r.id })).then(() => { rp.textContent = '✓'; }).catch(() => { rp.disabled = false; }); }; row.appendChild(rp); }
    sheetEl.appendChild(row); document.body.appendChild(sheetEl);
  }
  function write() {
    close(); sheetEl = el('form', ''); sheetEl.id = 'picks-sheet'; sheetEl.setAttribute('role', 'dialog');
    sheetEl.appendChild(top(X(T.add).replace('＋ ', ''), open));
    const fld = (label, max, req, area, val) => { const l = el('label', 'label ps-f'); l.appendChild(el('span', '', label)); const i = el(area ? 'textarea' : 'input', 'field'); i.maxLength = max; if (req) i.required = true; if (area) { i.rows = 6; i.style.resize = 'vertical'; } if (val) i.value = val; i.autocomplete = 'off'; l.appendChild(i); sheetEl.appendChild(l); return i; };
    const d = fld(X(T.dish), 40, true), w = fld(X(T.whose), 40), f = fld(X(T.forwho), 80), b = fld(X(T.body), 800, true, true);
    const by = fld(X(T.sign), 24, false, false, (function () { try { return localStorage.getItem('fb_nick') || ''; } catch (e) { return ''; } })()); by.setAttribute('data-fb-nick', '');
    const go = el('button', 'btn btn-amber ps-add', X(T.send)); go.type = 'submit'; sheetEl.appendChild(go);
    const st = el('p', 'ps-none'); st.setAttribute('aria-live', 'polite'); sheetEl.appendChild(st);
    sheetEl.onsubmit = e => {
      e.preventDefault(); go.disabled = true; st.textContent = '…';
      secret().then(k => rpc('recipe_add', { p_secret: k, p_dish: d.value, p_whose: w.value, p_for: f.value, p_body: b.value, p_nick: by.value, p_lang: LANG() }))
        .then(() => { try { SoundEngine.playClick(); } catch (e) {} close(); try { showBubble(X(T.thanks), 4200); } catch (e) {} try { if (window.FBG && FBG.made) FBG.made('bar', d.value); } catch (e) {} })
        .catch(err => { go.disabled = false; st.textContent = /rest/.test(String(err && err.message)) ? X(T.rest) : X(T.off); });
    };
    document.body.appendChild(sheetEl); setTimeout(() => d.focus(), 30);
  }
  function serve(r) {
    const who = window.NDChat ? NDChat.who() : 'wei';
    const sub = [r.whose, r.forwho ? X(T.forX).replace('{f}', r.forwho) : ''].filter(Boolean).join(' · ');
    try { showServed({ icon: '', name: r.dish, sub: sub, desc: r.body.length > 220 ? r.body.slice(0, 220) + '…' : r.body, formula: r.nick ? X(T.by).replace('{n}', r.nick) : '', reactable: false, food: true }); } catch (e) { return; }
    const ic = window.FBWorld && FBWorld.pix ? FBWorld.pix('bowl') : ''; ['res-icon', 'served-item-plate'].forEach(id => { const e = document.getElementById(id); if (e) e.innerHTML = ic; });
    try { SoundEngine.playClink(); } catch (e) {}
    if (T.served[who]) setTimeout(() => { try { showBubble(X(T.served[who])); } catch (e) {} }, 800);
  }
  function cook() {
    secret().then(k => rpc('recipe_get', { p_secret: k, p_lang: LANG() })).then(r => { if (Array.isArray(r)) r = r[0]; if (r && r.dish) serve(r); else { const h = POPO(); if (h && h.length) serve(h[(Math.random() * h.length) | 0]); else { try { showBubble(X(T.empty), 3600); } catch (e) {} write(); } } })   /* nobody else's yet: Popo's own cards are always in the box */
      .catch(() => { const h = POPO(); if (h && h.length) serve(h[(Math.random() * h.length) | 0]); else try { showBubble(X(T.off), 3000); } catch (e) {} });   /* offline: Popo's own cards are always in the box */
  }
  window.PopoRecipes = { open, write, cook };
})();
