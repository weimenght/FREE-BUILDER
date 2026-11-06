/* ===== Next Door, simply (Nov 4, the owner's direction: make the visit intuitive, no complicated choices) =====
   The room is the interface: no tabs, no status bar, no chips. The menu is a chalkboard stand on the counter, the jukebox hangs
   on the wall, the pinned postcards open the Wall, the lamp changes the light. The host starts the talk and brings up the house's
   own things (NDOffer): Wei a guessing game, a classic, the chalkboard of neighbours' picks, a gift; Mei your favourite coffee
   place; Popo a family recipe; the cats and Mantou push a card across; tapping the host brings more. Fiddle with the shelves and
   the host reacts. Waking a host here wakes them in the top bar too (FBWorld.wake), and the snore only plays while someone is shown asleep. */
(function () {
  const H = (en, zh, tw, yue, es, ca) => lx([en, zh, tw, yue || tw, es, ca]);
  const P5 = (en, zh, yue, es, ca) => lx([en, zh, yue, yue, es, ca]);   /* Popo: her zh-Hant is Cantonese */
  const W = window.FBWorld || {};
  const $ = id => document.getElementById(id);
  const one = a => a[(Math.random() * a.length) | 0];
  const away = () => { try { return !!(window.WeiAway && WeiAway.on && WeiAway.on()); } catch (e) { return false; } };
  const hostNow = () => { try { if (W.host) return W.host(); } catch (e) {} return { who: 'wei', asleep: AppState.weiState === 'asleep' }; };
  const catsHere = () => { try { return typeof Cats !== 'undefined' && Cats.here && (Cats.here('miso') || Cats.here('yuzu')); } catch (e) { return false; } };
  const idle = () => { try { resetIdle(); } catch (e) {} };

  /* ---------- the room, without tabs or a status bar ---------- */
  const css = document.createElement('style');
  css.textContent = [
    
    /* a way back to the counter from every other view */
    '.nd-mi{margin-bottom:4px}.nd-near{display:inline-flex;align-items:center;gap:4px;min-height:32px;padding:0 8px;font:400 17px/1 VT323,monospace;color:var(--amber-2);text-decoration:none}.nd-near:hover,.nd-near:focus-visible{text-decoration:underline}',
    '.nd-back{display:inline-flex;align-items:center;gap:6px;margin:0 0 10px;min-height:44px}',
    '#room-studio .room-inner>#nd-back-studio.nd-back{display:inline-flex!important}',   /* the jukebox room hides everything but itself */
    /* things in the room */
    '.nd-thing{position:absolute;padding:0;border:0;background:none;cursor:pointer;image-rendering:pixelated;filter:drop-shadow(2px 2px 0 rgba(0,0,0,.65))}',
    '.nd-thing svg{display:block;width:100%;height:100%}',
    '.nd-thing:hover,.nd-thing:focus-visible{filter:drop-shadow(2px 2px 0 rgba(0,0,0,.65)) drop-shadow(0 0 8px rgba(255,200,120,.55))}',
    '.nd-thing:focus-visible{outline:2px solid var(--amber);outline-offset:2px}',
    '.nd-thing:active{transform:translateY(1px)}',
    '#nd-stand{right:24%;bottom:12px;width:42px;height:50px;z-index:6}',
    '#nd-stand b{position:absolute;left:3px;right:3px;top:9px;font:400 6px/1.2 "Press Start 2P",VT323,monospace;color:#f3ead8;text-align:center;letter-spacing:-.5px;pointer-events:none;white-space:nowrap;overflow:hidden}',
    '#nd-juke{left:12px;top:120px;width:40px;height:50px;z-index:3;transform-origin:50% 0}',
    '#nd-juke i{position:absolute;top:-4px;right:-8px;font:400 15px/1 VT323,monospace;font-style:normal;color:var(--amber-2);opacity:0;pointer-events:none}',
    '#nd-juke.on i{animation:ndNote 2.4s steps(6) infinite}#nd-juke.on i+i{animation-delay:1.2s;right:auto;left:-8px}',
    '@keyframes ndNote{0%{opacity:0;transform:translateY(6px)}20%{opacity:1}100%{opacity:0;transform:translateY(-16px)}}',
    '#nd-juke.on .jl{animation:ndBlink 1s steps(2) infinite}@keyframes ndBlink{50%{opacity:.35}}',
    '#nd-cards{right:12px;top:168px;width:48px;height:42px;z-index:3}',
    '#nd-lamp{left:50%;top:0;width:52px;height:46px;transform:translateX(-50%);z-index:9;filter:none}',
    '#nd-lamp:hover,#nd-lamp:focus-visible{filter:none;background:radial-gradient(ellipse at 50% 70%,rgba(255,210,140,.18),transparent 70%)}',
    '#nd-lamp:active{transform:translateX(-50%) translateY(2px)}',
    '@media (min-width:1024px){#nd-stand{width:54px;height:64px;right:22%}#nd-stand b{font-size:7px;top:12px}#nd-juke{left:4%;top:140px;width:54px;height:68px}#nd-cards{right:20px;top:250px;width:62px;height:54px}}',
    '#stage-counter-box{cursor:default}',
    /* the light: the lamp cycles warm, bright, dim and cool */
    '#nd-light{position:absolute;inset:0;z-index:8;pointer-events:none;transition:background .6s ease,opacity .6s ease;opacity:0}',
    '.stage[data-light="bright"] #nd-light{opacity:1;background:radial-gradient(ellipse 80% 70% at 50% 0%,rgba(255,214,150,.30),rgba(255,214,150,.08) 70%);mix-blend-mode:screen}',
    '.stage[data-light="dim"] #nd-light{opacity:1;background:radial-gradient(ellipse 50% 45% at 50% 6%,rgba(255,160,80,.10),rgba(6,3,1,.58) 75%)}',
    '.stage[data-light="cool"] #nd-light{opacity:1;background:linear-gradient(180deg,rgba(110,150,230,.26),rgba(60,90,170,.18));mix-blend-mode:soft-light}',
    '.stage[data-light="bright"] .lamp::after{box-shadow:0 12px 44px 18px rgba(255,214,150,.45)}',
    '.stage[data-light="dim"] .lamp::after{box-shadow:0 8px 18px 4px rgba(255,150,70,.18)}',
    '.stage[data-light="cool"] .lamp::after{box-shadow:0 10px 34px 12px rgba(150,190,255,.32)}',
    /* the shelves can be fiddled with */
    '.shelf>span:not(#cellar-banner-text),.shelf .fbpx,.shelf .hshelf{pointer-events:auto;cursor:pointer;transform-box:fill-box;transform-origin:50% 100%}.shelf>span{display:inline-block}',
    '.nd-fid{animation:ndFid .55s steps(5)}@keyframes ndFid{20%{transform:rotate(-14deg)}40%{transform:rotate(10deg) translateY(-2px)}60%{transform:rotate(-6deg)}80%{transform:rotate(3deg)}}',
    /* an awake host's panel has no buttons: the menu is the stand, and they talk to you */
    'body.nd-host-up #sleep-mode-screen .opt-btn,body.nd-host-up #sleep-mode-screen .grid,body.cats-nap #sleep-cats{display:none!important}',
    /* Wei's energy shows on his face */
    '#sprite-wei-container.nd-tired{animation-duration:6s!important}'
  ].join('');
  document.head.appendChild(css);

  const BACK = H("‹ Back to the counter", "‹ 回到吧台", "‹ 回到吧檯", "‹ 返去吧枱", "‹ Volver a la barra", "‹ Tornar a la barra");
  [['room-lab', 'nd-back-lab'], ['room-studio', 'nd-back-studio'], ['room-wall', 'nd-back-wall']].forEach(([r, id]) => {
    const room = $(r), inner = room && (room.querySelector('.room-inner') || room); if (!inner) return;
    const b = document.createElement('button'); b.type = 'button'; b.id = id; b.className = 'fbb nd-back';
    b.onclick = () => { go('counter'); };
    inner.insertBefore(b, inner.firstChild);
  });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || typeof currentRoom === 'undefined' || currentRoom === 'counter') return;
    const pv = document.querySelector('.pc-view'); if (pv) { pv.remove(); return; }   /* a postcard open on the Wall closes first */
    if (document.querySelector('#picks-sheet, #nd-friend:not([hidden]), .modal-backdrop:not(.hidden)')) return;
    go('counter');
  });

  /* ---------- the menu stand, the jukebox, the Wall, the lamp ---------- */
  const MENU = H("MENU", "菜单", "菜單", "餐牌", "CARTA", "CARTA");
  const T_STAND = H("Tonight's menu", "今晚的菜单", "今晚的菜單", "今晚餐牌", "La carta de esta noche", "La carta d'aquesta nit");
  const T_JUKE = H("The jukebox", "点唱机", "點唱機", "點唱機", "La gramola", "La gramola");
  const T_WALL = H("The Wall: postcards", "墙：明信片", "牆：明信片", "牆：明信片", "El muro: postales", "El mur: postals");
  const T_LAMP = H("The lamp", "吊灯", "吊燈", "吊燈", "La lámpara", "El llum");
  const STAND = '<svg viewBox="0 0 17 20" shape-rendering="crispEdges" aria-hidden="true"><path fill="#1a1410" d="M2 0h13v1H2zM1 1h1v13H1zM15 1h1v13h-1zM2 14h13v1H2zM3 15h1v5H3zM13 15h1v5h-1z"/><path fill="#7a4a24" d="M2 1h13v1H2zM2 13h13v1H2zM2 2h1v11H2zM14 2h1v11h-1z"/><path fill="#26302a" d="M3 2h11v11H3z"/><path fill="#f3ead8" fill-opacity=".55" d="M4 8h6v1H4zM4 10h8v1H4zM11 8h2v1h-2z"/><path fill="#f2a541" d="M4 12h1v1H4z"/><path fill="#5a3519" d="M4 15h9v1H4z"/></svg><b></b>';
  const JUKE = '<svg viewBox="0 0 16 20" shape-rendering="crispEdges" aria-hidden="true"><path fill="#1a1410" d="M4 0h8v1H4zM2 1h2v1H2zM12 1h2v1h-2zM1 2h1v2H1zM14 2h1v2h-1zM0 4h1v15H0zM15 4h1v15h-1zM1 19h14v1H1z"/><path fill="#8a3a1c" d="M4 1h8v1H4zM2 2h12v2H2zM1 4h14v15H1z"/><path fill="#c2412d" d="M3 3h10v1H3z"/><path class="jl" fill="#f2a541" d="M2 5h1v6H2zM13 5h1v6h-1z"/><path class="jl" fill="#e86a92" d="M4 4h8v1H4z"/><path fill="#1a1410" d="M4 6h8v5H4z"/><path fill="#ffd08a" d="M5 7h6v1H5z"/><path fill="#7db2a8" d="M5 9h6v1H5z"/><path fill="#3a2111" d="M3 12h10v6H3z"/><path fill="#6b4426" d="M4 13h8v1H4zM4 15h8v1H4zM4 17h8v1H4z"/><path fill="#f3ead8" d="M7 11h2v1H7z"/></svg><i aria-hidden="true">♪</i><i aria-hidden="true">♫</i>';
  const CARDS = '<svg viewBox="0 0 24 21" shape-rendering="crispEdges" aria-hidden="true"><path fill="#1a1410" d="M1 3h10v1H1zM0 4h1v8H0zM11 4h1v8h-1zM1 12h10v1H1z"/><path fill="#f6ecd2" d="M1 4h10v8H1z"/><path fill="#7db2a8" d="M2 5h4v4H2z"/><path fill="#b39a7c" d="M7 6h3v1H7zM7 8h3v1H7zM2 10h8v1H2z"/><path fill="#1a1410" d="M12 1h11v1H12zM11 2h1v9h-1zM23 2h1v9h-1zM12 11h11v1H12z"/><path fill="#f3d9a8" d="M12 2h11v9H12z"/><path fill="#e0826a" d="M13 3h5v4h-5z"/><path fill="#b39a7c" d="M19 4h3v1h-3zM19 6h3v1h-3zM13 8h9v1h-9z"/><path fill="#1a1410" d="M6 12h12v1H6zM5 13h1v7H5zM18 13h1v7h-1zM6 20h12v1H6z"/><path fill="#fff6e3" d="M6 13h12v7H6z"/><path fill="#9cc29a" d="M7 14h4v3H7z"/><path fill="#b39a7c" d="M12 15h5v1h-5zM12 17h5v1h-5z"/><path fill="#c2412d" d="M5 2h2v2H5zM17 0h2v2h-2zM11 11h2v2h-2z"/></svg>';
  const stage = $('stage-counter-box');
  function thing(id, html, label, fn) {
    const b = document.createElement('button'); b.type = 'button'; b.id = id; b.className = 'nd-thing'; b.innerHTML = html;
    b.onclick = e => { e.stopPropagation(); idle(); fn(); }; stage.appendChild(b); return b;
  }
  let stand, juke, cards, lampB;
  if (stage) {
    const lt = document.createElement('div'); lt.id = 'nd-light'; lt.setAttribute('aria-hidden', 'true'); stage.appendChild(lt);
    stand = thing('nd-stand', STAND, T_STAND, () => { try { toggleCodexModal(true); } catch (e) {} });
    juke = thing('nd-juke', JUKE, T_JUKE, () => { go('studio'); });
    cards = thing('nd-cards', CARDS, T_WALL, () => { go('wall'); });
    lampB = thing('nd-lamp', '', T_LAMP, lamp);
  }
  function words() {
    [[stand, T_STAND], [juke, T_JUKE], [cards, T_WALL], [lampB, T_LAMP]].forEach(([b, t]) => { if (b) { b.title = L(t); b.setAttribute('aria-label', L(t)); } });
    const sb = stand && stand.querySelector('b'); if (sb) sb.textContent = L(MENU);
    document.querySelectorAll('.nd-back').forEach(b => { b.textContent = L(BACK); });
  }
  words(); addEventListener('fbl:lang', words); setInterval(words, 4000);
  setInterval(() => { try { if (juke) juke.classList.toggle('on', !!(window.JB && JB.listening && JB.listening())); } catch (e) {} }, 1500);

  /* the light, kept on this device */
  const LIGHTS = ['warm', 'bright', 'dim', 'cool'];
  let li = 0; try { li = Math.max(0, LIGHTS.indexOf(localStorage.getItem('nd_light') || 'warm')); } catch (e) {}
  function paintLight() { if (stage) { if (li) stage.dataset.light = LIGHTS[li]; else delete stage.dataset.light; } }
  const LAMPSAY = {
    wei: [H("*squints up at the lamp* Better. Or worse. I'll get used to it.", "*眯眼看了看灯* 好些了。或者更糟。我会习惯的。", "*瞇眼看了看燈* 好些了。或者更糟。我會習慣的。", "*瞇埋眼望吓盞燈* 好啲喇。或者差啲。我會慣㗎。", "*mira la lámpara entornando los ojos* Mejor. O peor. Ya me acostumbraré.", "*mira el llum arrufant els ulls* Millor. O pitjor. Ja m'hi acostumaré.")],
    mei: [H("*looks up from her phone* ooh. moody. keep it.", "*从手机上抬起头* 哦。有氛围。就这样。", "*從手機上抬起頭* 哦。有氛圍。就這樣。", "*擰起頭離開部手機* 哦。好有feel。就咁啦。", "*levanta la vista del móvil* uh. ambiente. déjalo así.", "*aixeca la vista del mòbil* uh. ambient. deixa-ho així.")],
    popo: [P5("Aiya, too dark, you ruin your eyes! …OK lah, OK lah, nice also.", "哎呀，这么暗，眼睛都看坏了！……好啦好啦，也挺靓。", "哎呀，咁暗，眼都盲埋！……好啦好啦，都幾靚。", "¡Ay, muy oscuro, tú rompes los ojos! …Vale, vale, bonito también.", "Ai, massa fosc, que et faràs malbé els ulls! …Bé, bé, també és bonic.")],
    cats: [H("*Yuzu follows the swinging lamp with her whole head.*", "*柚子整个脑袋跟着晃动的吊灯转。*", "*柚子整個腦袋跟著晃動的吊燈轉。*", "*柚子成個頭跟住盞燈擺嚟擺去。*", "*Yuzu sigue la lámpara que se balancea con toda la cabeza.*", "*La Yuzu segueix el llum que es gronxa amb tot el cap.*")],
    mantou: [H("*Mantou barks once at the lamp, to be safe.* Woof.", "*馒头为了保险起见，冲吊灯叫了一声。* 汪。", "*饅頭為了保險起見，衝吊燈叫了一聲。* 汪。", "*饅頭為咗穩陣，對住盞燈吠咗一聲。* 汪。", "*Mantou le ladra una vez a la lámpara, por si acaso.* Guau.", "*En Mantou borda un cop al llum, per si de cas.* Bup.")]
  };
  let lampSaid = false;
  function lamp() {
    li = (li + 1) % LIGHTS.length; paintLight();
    try { localStorage.setItem('nd_light', LIGHTS[li]); } catch (e) {}
    try { SoundEngine.playChiptune(li === 2 ? 330 : li === 3 ? 520 : 440, 'square', 0.04); } catch (e) {}
    if (lampB) { lampB.animate && lampB.animate([{ transform: 'translateX(-50%) rotate(0)' }, { transform: 'translateX(-50%) rotate(6deg)' }, { transform: 'translateX(-50%) rotate(-4deg)' }, { transform: 'translateX(-50%) rotate(0)' }], { duration: 600, easing: 'steps(4)' }); }
    if (!lampSaid && li) { const k = talker(); if (k && LAMPSAY[k]) { lampSaid = true; say(L(one(LAMPSAY[k]))); } }
  }
  paintLight();

  /* who answers right now: the host if they're up, the cats if they're here, else nobody */
  function talker() {
    if (away()) return catsHere() ? 'cats' : null;
    const h = hostNow();
    if (h.who === 'wei') return AppState.weiState === 'awake' ? 'wei' : (catsHere() ? 'cats' : null);
    if (h.asleep) return h.who === 'cats' ? null : (catsHere() ? 'cats' : null);
    return h.who;
  }
  function say(t) { if (window.NDSay) NDSay(t); }

  /* ---------- fiddling with the shelves ---------- */
  const F = {
    weiBar: [H("*catches the bottle before it tips* That one's older than the bar. Gently.", "*在瓶子倒下前一把接住* 这瓶比这家店还老。轻点。", "*在瓶子倒下前一把接住* 這瓶比這家店還老。輕點。", "*喺個樽跌之前一手接住* 呢樽仲老過間舖頭。小心啲。", "*atrapa la botella antes de que caiga* Esa es más vieja que el bar. Con cuidado.", "*agafa l'ampolla abans que caigui* Aquesta és més vella que el bar. Amb compte."),
      H("*turns the label to face you* Vermouth from Reus. Popo's neighbour's cousin makes it.", "*把酒标转向你* 雷乌斯的味美思。婆婆邻居的表哥酿的。", "*把酒標轉向你* 雷烏斯的香艾酒。婆婆鄰居的表哥釀的。", "*將個酒標轉過嚟俾你睇* 雷烏斯嘅苦艾酒。婆婆隔籬屋表哥整嘅。", "*gira la etiqueta hacia ti* Vermut de Reus. Lo hace el primo de la vecina de Popo.", "*gira l'etiqueta cap a tu* Vermut de Reus. El fa el cosí de la veïna de la Popo."),
      H("*taps the bottle you touched* Good eye. I'd pick that one too. Not tonight, though.", "*敲了敲你碰过的那瓶* 眼光不错。我也会挑这瓶。不过不是今晚。", "*敲了敲你碰過的那瓶* 眼光不錯。我也會挑這瓶。不過不是今晚。", "*敲吓你掂過嗰樽* 好眼光。我都會揀呢樽。不過唔係今晚。", "*da un toque a la botella* Buen ojo. Yo también elegiría esa. Pero hoy no.", "*toca l'ampolla* Bon ull. Jo també triaria aquesta. Però avui no."),
      H("*lines the bottles up again, labels out* There. Now they're all looking at you.", "*把瓶子重新排好，酒标朝外* 好了。现在它们都在看着你。", "*把瓶子重新排好，酒標朝外* 好了。現在它們都在看著你。", "*將啲樽排返好，酒標向出* 好喇。而家佢哋全部望住你。", "*vuelve a alinear las botellas, etiquetas fuera* Ya está. Ahora todas te miran.", "*torna a alinear les ampolles, etiquetes enfora* Ja està. Ara totes et miren.")],
    weiCafe: [H("*lifts the lid so you can smell it* Yunnan beans. Honey first, then tobacco. Go on, breathe.", "*掀开盖子让你闻* 云南豆。先是蜂蜜，然后是烟草。来，深吸一口。", "*掀開蓋子讓你聞* 雲南豆。先是蜂蜜，然後是菸草。來，深吸一口。", "*打開個蓋俾你聞* 雲南豆。先係蜜糖，跟住係煙草。嚟，索一啖。", "*levanta la tapa para que huelas* Café de Yunnan. Primero miel, luego tabaco. Respira.", "*aixeca la tapa perquè ho oloris* Cafè de Yunnan. Primer mel, després tabac. Respira."),
      H("*straightens the tin you moved, exactly one centimetre* …Sorry. Habit.", "*把你挪过的罐子摆正，刚好一厘米* ……抱歉。习惯了。", "*把你挪過的罐子擺正，剛好一公分* ……抱歉。習慣了。", "*將你郁過個罐擺返正，啱啱一厘米* ……唔好意思。習慣。", "*endereza la lata que moviste, exactamente un centímetro* …Perdona. Manía.", "*redreça la llauna que has mogut, exactament un centímetre* …Perdona. Mania."),
      H("*hands you a single roasted bean* For your pocket. You'll find it next week and smile.", "*递给你一颗烘好的豆子* 放口袋里。下周你会摸到它，然后笑一下。", "*遞給你一顆烘好的豆子* 放口袋裡。下週你會摸到它，然後笑一下。", "*遞咗粒烘好嘅豆俾你* 放落袋。下個禮拜你會摸到，然後笑一笑。", "*te da un solo grano tostado* Para el bolsillo. Lo encontrarás la semana que viene y sonreirás.", "*et dona un sol gra torrat* Per a la butxaca. El trobaràs la setmana que ve i somriuràs.")],
    weiLow: [H("*watches you pick up the radio* It gets one station. It's enough.", "*看你拿起收音机* 只收得到一个台。够了。", "*看你拿起收音機* 只收得到一個台。夠了。", "*睇住你拎起部收音機* 得一個台收到。夠晒。", "*te ve coger la radio* Solo pilla una emisora. Basta.", "*et veu agafar la ràdio* Només agafa una emissora. N'hi ha prou."),
      H("*nods at the plant* Mei waters it with iced coffee. It's thriving. I don't understand it.", "*朝那盆植物点点头* Mei 用冰咖啡浇它。它长得很好。我不理解。", "*朝那盆植物點點頭* Mei 用冰咖啡澆它。它長得很好。我不理解。", "*向盆植物點一點頭* Mei 用凍咖啡淋佢。佢生得好好。我唔明。", "*señala la planta con la cabeza* Mei la riega con café con hielo. Está espléndida. No lo entiendo.", "*assenyala la planta amb el cap* La Mei la rega amb cafè amb gel. Està esplèndida. No ho entenc."),
      H("*sees you open the book* Page 112. Someone from Borrowed Pages left it. Trust them.", "*看到你翻开那本书* 第 112 页。“借来的书”那边有人留下的。信他们。", "*看到你翻開那本書* 第 112 頁。「借來的書」那邊有人留下的。信他們。", "*見你揭開本書* 第 112 頁。「借來的書」嗰邊有人留低嘅。信佢哋。", "*te ve abrir el libro* Página 112. Lo dejó alguien de Páginas Prestadas. Hazle caso.", "*et veu obrir el llibre* Pàgina 112. Ho va deixar algú de Pàgines Manllevades. Fes-li cas."),
      H("*doesn't stop you. Puts it back exactly where it was, after.*", "*没拦你。等你放下，再把它放回原位。*", "*沒攔你。等你放下，再把它放回原位。*", "*冇阻你。等你放低，再擺返原位。*", "*no te lo impide. Después lo deja exactamente donde estaba.*", "*no t'ho impedeix. Després ho deixa exactament on era.*")],
    weiZ: [H("*Wei, without opening his eyes:* …not the Chartreuse…", "*Wei 眼睛都没睁：* ……别动那瓶查特酒……", "*Wei 眼睛都沒睜：* ……別動那瓶夏翠絲……", "*Wei 眼都冇擘：* ……唔好掂支修道院酒……", "*Wei, sin abrir los ojos:* …la Chartreuse no…", "*En Wei, sense obrir els ulls:* …la Chartreuse no…"),
      H("*Wei mumbles something about ice and turns over.*", "*Wei 嘟囔了一句关于冰块的话，翻了个身。*", "*Wei 嘟囔了一句關於冰塊的話，翻了個身。*", "*Wei 噏咗句關於冰嘅嘢，轉咗個身。*", "*Wei murmura algo sobre el hielo y se da la vuelta.*", "*En Wei murmura alguna cosa sobre el gel i es gira.*")],
    mei: {
      polish: [H("That's 'Subway Pink'. You can't have it. …You can borrow it.", "那是“地铁粉”。不给你。……可以借你。", "那是「地鐵粉」。不給你。……可以借你。", "嗰支係「地鐵粉」。唔俾你。……借你就得。", "Es 'Rosa Metro'. No te lo doy. …Te lo presto.", "És 'Rosa Metro'. No te'l dono. …Te'l deixo.")],
      gloss: [H("*snatches it back* Cherry. Limited edition. Don't.", "*一把抢回来* 樱桃味。限量的。别。", "*一把搶回來* 櫻桃味。限量的。別。", "*一手搶返* 車厘子味。限量㗎。唔好。", "*te lo quita* Cereza. Edición limitada. Ni se te ocurra.", "*te'l pren* Cirera. Edició limitada. Ni t'ho pensis.")],
      compact: [H("*sees you open the compact* You've got something on your face. Kidding. Hi.", "*看见你打开粉饼盒* 你脸上有东西。骗你的。嗨。", "*看見你打開粉餅盒* 你臉上有東西。騙你的。嗨。", "*見你打開粉盒* 你塊面有嘢。呃你㗎。Hi。", "*te ve abrir el espejito* Tienes algo en la cara. Es broma. Hola.", "*et veu obrir el miralet* Tens alguna cosa a la cara. És broma. Hola.")],
      iced: [H("That's my iced coffee from nine a.m. It's fine. It's aged.", "那是我早上九点的冰咖啡。没事。陈酿了。", "那是我早上九點的冰咖啡。沒事。陳釀了。", "嗰杯係我朝早九點嘅凍咖啡。冇事。陳年嘅。", "Es mi café con hielo de las nueve. Está bien. Está añejo.", "És el meu cafè amb gel de les nou. Està bé. Està envellit.")],
      polaroid: [H("*grabs the polaroid* Me and Jess on the 6 train. Don't look at my bangs.", "*一把抓过拍立得* 我和 Jess 在 6 号线上。别看我的刘海。", "*一把抓過拍立得* 我和 Jess 在 6 號線上。別看我的瀏海。", "*一手搶過張即影即有* 我同 Jess 喺 6 號線。唔好睇我個陰。", "*coge la polaroid* Jess y yo en la línea 6. No mires mi flequillo.", "*agafa la polaroid* La Jess i jo a la línia 6. No em miris el serrell.")],
      disco: [H("*spins the disco ball with one finger* Saturdays are mandatory. You're invited.", "*用一根手指转了转迪斯科球* 周六必须来。你被邀请了。", "*用一根手指轉了轉迪斯可球* 週六必須來。你被邀請了。", "*用一隻手指轉吓個迪士高波* 禮拜六一定要嚟。你有份。", "*hace girar la bola de discoteca con un dedo* Los sábados son obligatorios. Estás invitado.", "*fa girar la bola de discoteca amb un dit* Els dissabtes són obligatoris. Estàs convidat.")],
      scrunchie: [H("*holds out her wrist* Take a scrunchie, give a scrunchie. Rules.", "*伸出手腕* 拿一个发圈，就得还一个。规矩。", "*伸出手腕* 拿一個髮圈，就得還一個。規矩。", "*伸隻手腕出嚟* 攞一個髮圈，就要還一個。規矩嚟。", "*te enseña la muñeca* Coges una coletero, dejas un coletero. Normas.", "*t'ensenya el canell* Agafes una goma, en deixes una. Normes.")],
      x: [H("*without turning round* Hands off my shelf.", "*头也不回* 别碰我的架子。", "*頭也不回* 別碰我的架子。", "*頭都唔轉* 唔好掂我個架。", "*sin darse la vuelta* Las manos fuera de mi estante.", "*sense girar-se* Les mans fora del meu prestatge."),
        H("*doesn't look up* I saw that.", "*头也不抬* 我看见了。", "*頭也不抬* 我看見了。", "*頭都唔擰* 我見到喇。", "*sin levantar la vista* Lo he visto.", "*sense aixecar la vista* Ho he vist.")],
      z: [H("*Mei, still asleep:* …don't touch my stuff…", "*Mei 还在睡：* ……别碰我的东西……", "*Mei 還在睡：* ……別碰我的東西……", "*Mei 仲瞓緊：* ……唔好掂我啲嘢……", "*Mei, todavía dormida:* …no toques mis cosas…", "*La Mei, encara adormida:* …no toquis les meves coses…")]
    },
    popo: {
      jar: [P5("Pickles. Nineteen ninety-eight! Still good wor. You take one jar home.", "咸菜。一九九八年的！还能吃。你拿一罐回家。", "鹹菜。一九九八年㗎！仲食得。你攞一樽返屋企。", "Encurtidos. ¡Mil novecientos noventa y ocho! Todavía bueno. Tú llevas un bote a casa.", "Escabetx. Del noranta-vuit! Encara és bo. T'enduus un pot a casa.")],
      steamer: [P5("*lifts the lid, steam everywhere* Char siu bao. Hot ah! Wait two minutes.", "*揭开盖子，满屋蒸汽* 叉烧包。烫呀！等两分钟。", "*揭開個蓋，成屋蒸氣* 叉燒包。熱㗎！等兩分鐘。", "*levanta la tapa, vapor por todas partes* Bollos de cerdo. ¡Caliente! Espera dos minutos.", "*aixeca la tapa, vapor per tot arreu* Panets de porc. Cremen! Espera dos minuts.")],
      orange: [P5("Take, take. Orange is good luck. Two, one for your mama lah.", "拿啦，拿啦。橙子，好兆头。拿两个，一个给你妈妈。", "攞啦攞啦。橙好意頭。攞兩個，一個俾你阿媽。", "Coge, coge. Naranja buena suerte. Dos, una para tu mamá.", "Agafa, agafa. La taronja porta sort. Dues, una per a ta mare.")],
      bowl: [P5("That bowl from the noodle shop. Josep carry the whole box home on the tram, you know.", "这个碗是面店的。Josep 坐电车，整箱抱回家。", "隻碗係麵舖嘅。Josep 坐電車成箱抱返屋企。", "Ese cuenco de la tienda de fideos. Josep lleva la caja entera a casa en tranvía.", "Aquest bol és de la botiga de fideus. En Josep va dur tota la caixa a casa amb el tramvia.")],
      cup: [P5("Hot water. Always I got hot water. You want?", "热水。我随时都有热水。你要不要？", "滾水。我時時都有滾水。你要唔要？", "Agua caliente. Siempre tengo agua caliente. ¿Tú quieres?", "Aigua calenta. Sempre en tinc. En vols?")],
      thermos: [P5("Soup inside. For later. For you, if you sit longer lah.", "里面是汤。等一下喝。你多坐一会儿，就给你。", "入面係湯。留陣間飲。你坐耐啲就俾你。", "Sopa dentro. Para luego. Para ti, si te sientas más.", "Hi ha sopa a dins. Per a després. Per a tu, si et quedes una mica més.")],
      radio: [P5("*turns the dial* Cantonese opera. Josep like the drums, not the singing. Hahaha.", "*扭一下旋钮* 粤剧。Josep 喜欢锣鼓，不喜欢唱。哈哈哈。", "*扭吓個掣* 粵劇。Josep 鍾意啲鑼鼓，唔鍾意唱。哈哈哈。", "*gira el dial* Ópera cantonesa. A Josep le gusta los tambores, no el canto. Jajaja.", "*gira el dial* Òpera cantonesa. A en Josep li agradaven els tambors, no el cant. Ha, ha, ha.")],
      garden: [P5("Baby lemon tree. From the big one. You water it, OK?", "小柠檬树。从那棵大的来的。你浇水，好不好？", "細檸檬樹。由大嗰棵嚟㗎。你淋水，好唔好？", "Limonero bebé. Del grande. Tú riegas, ¿vale?", "Un llimoner petit. Ve del gran. El regues tu, d'acord?")],
      restaurant: [P5("*taps the old shop sign* Thirty years noodle shop. Every day open, you know.", "*拍拍面店的旧招牌* 开了三十年面店。天天开门。", "*拍吓麵舖個舊招牌* 開咗三十年麵舖。日日開門。", "*da golpecitos al letrero viejo* Treinta años tienda de fideos. Todos los días abierta.", "*toca el rètol vell de la botiga* Trenta anys de botiga de fideus. Oberta cada dia.")],
      x: [P5("Aiya, careful! …OK lah, you look. Looking is free.", "哎呀，小心点！……好啦好啦，你看。看不要钱。", "哎呀，小心啲！……好啦好啦，你睇。睇唔使錢。", "¡Ay, cuidado! …Vale, vale, tú mira. Mirar es gratis.", "Ai, compte! …Bé, bé, mira. Mirar no costa res.")],
      z: [P5("*Popo, asleep, pats the blanket twice. The cats look at you.*", "*婆婆睡着，拍了拍毯子两下。猫看着你。*", "*婆婆瞓著，拍咗兩下張氈。啲貓望住你。*", "*Popo, dormida, da dos palmaditas a la manta. Los gatos te miran.*", "*La Popo, adormida, dona dos copets a la manta. Els gats et miren.*")]
    },
    cats: {
      box: [H("*Miso is in the box before you've finished touching it.*", "*你的手还没碰完，味噌已经钻进箱子里了。*", "*你的手還沒碰完，味噌已經鑽進箱子裡了。*", "*你隻手都未掂完，味噌已經鑽咗入個箱。*", "*Miso ya está en la caja antes de que termines de tocarla.*", "*La Miso ja és dins la capsa abans que l'acabis de tocar.*")],
      yarn: [H("*Yuzu's pupils go huge. The yarn is hers now.*", "*柚子的瞳孔一下子变得好大。毛线球归她了。*", "*柚子的瞳孔一下子變得好大。毛線球歸她了。*", "*柚子對瞳孔突然變到好大。個冷球係佢嘅喇。*", "*A Yuzu se le dilatan las pupilas. El ovillo ya es suyo.*", "*A la Yuzu se li dilaten les pupil·les. El cabdell ja és seu.*")],
      feather: [H("*Four eyes follow the feather. Two tails twitch.*", "*四只眼睛跟着羽毛转。两条尾巴一抽一抽。*", "*四隻眼睛跟著羽毛轉。兩條尾巴一抽一抽。*", "*四隻眼跟住條羽毛轉。兩條尾郁吓郁吓。*", "*Cuatro ojos siguen la pluma. Dos colas se agitan.*", "*Quatre ulls segueixen la ploma. Dues cues es belluguen.*")],
      fish: [H("*Miso puts one paw on the fish. This fish is spoken for.*", "*味噌一只爪按住小鱼。这条鱼有主了。*", "*味噌一隻爪按住小魚。這條魚有主了。*", "*味噌一隻爪撳住條魚。呢條魚有主㗎喇。*", "*Miso pone una pata sobre el pescado. Este pez ya tiene dueña.*", "*La Miso posa una pota damunt el peix. Aquest peix ja té mestressa.*")],
      x: [H("*Yuzu knocks the next thing off the shelf, to help.*", "*柚子把旁边那样东西也拍下了架子，帮个忙。*", "*柚子把旁邊那樣東西也拍下了架子，幫個忙。*", "*柚子順手將隔籬嗰樣嘢都撥咗落架，幫吓手。*", "*Yuzu tira lo siguiente del estante, para ayudar.*", "*La Yuzu tira la cosa del costat del prestatge, per ajudar.*"),
        H("*Miso watches your hand from the till, unimpressed.*", "*味噌坐在收银机上看着你的手，不为所动。*", "*味噌坐在收銀機上看著你的手，不為所動。*", "*味噌坐喺收銀機度望住你隻手，一啲都唔感動。*", "*Miso mira tu mano desde la caja, nada impresionada.*", "*La Miso et mira la mà des de la caixa, gens impressionada.*")],
      z: [H("*An ear twitches. That's all.*", "*一只耳朵动了动。就这样。*", "*一隻耳朵動了動。就這樣。*", "*一隻耳仔郁咗一郁。冇喇。*", "*Una oreja se mueve. Nada más.*", "*Una orella es mou. Res més.*")]
    },
    mantou: [H("*Mantou's ears go up at the clink. He thinks it's dinner.* Woof?", "*听到叮当一声，馒头耳朵竖了起来。他以为开饭了。* 汪？", "*聽到叮噹一聲，饅頭耳朵豎了起來。他以為開飯了。* 汪？", "*聽到叮一聲，饅頭對耳仔即刻企起。佢以為開飯。* 汪？", "*Las orejas de Mantou se levantan con el tintineo. Cree que es la cena.* ¿Guau?", "*Les orelles d'en Mantou s'aixequen amb el dring. Es pensa que és l'hora de sopar.* Bup?"),
      H("*Mantou watches your hand very closely, in case it's a ball.*", "*馒头紧紧盯着你的手，万一是个球呢。*", "*饅頭緊緊盯著你的手，萬一是個球呢。*", "*饅頭死死盯住你隻手，萬一係個波呢。*", "*Mantou vigila tu mano muy de cerca, por si es una pelota.*", "*En Mantou et vigila la mà molt de prop, per si és una pilota.*"),
      H("*Mantou sneezes at the dust and looks at you like it was your fault.*", "*馒头被灰呛得打了个喷嚏，看着你，好像是你的错。*", "*饅頭被灰嗆得打了個噴嚏，看著你，好像是你的錯。*", "*饅頭俾啲塵整到乞嚏，望住你，好似係你衰。*", "*Mantou estornuda por el polvo y te mira como si fuera culpa tuya.*", "*En Mantou esternuda per la pols i et mira com si fos culpa teva.*")],
    /* Mantou's own shelf (his lead, ball, bowl, a sock, his toy box, a mantou): each thing first, then his everyday reactions */
    mantouK: {
      rope: [H("*Mantou sees the lead in your hand and is sitting at the door before you've put it down.* Woof! Woof!", "*馒头一看见你手里的牵绳，你还没放下，他已经坐在门口了。* 汪！汪！", "*饅頭一看見你手裡的牽繩，你還沒放下，他已經坐在門口了。* 汪！汪！", "*饅頭一見到你手上條狗帶，你未放低佢已經坐咗喺門口。* 汪！汪！", "*Mantou ve la correa en tu mano y ya está sentado en la puerta antes de que la sueltes.* ¡Guau! ¡Guau!", "*En Mantou veu la corretja a la teva mà i ja seu a la porta abans que la deixis.* Bup! Bup!")],
      coin: [H("*The ball. Mantou freezes, every muscle ready. Throw it. Please throw it.*", "*球。馒头一动不动，全身都准备好了。扔啊。求你扔啊。*", "*球。饅頭一動不動，全身都準備好了。扔啊。求你扔啊。*", "*個波。饅頭定晒格，成身預備好。掟啦。求吓你掟啦。*", "*La pelota. Mantou se queda quieto, cada músculo listo. Tírala. Por favor, tírala.*", "*La pilota. En Mantou es queda immòbil, amb tots els músculs a punt. Llança-la. Si us plau, llança-la.*")],
      bowl: [H("*Mantou noses his water bowl along the shelf towards you. Shared, generously.*", "*馒头用鼻子把水碗沿着架子推到你面前。大方地分给你。*", "*饅頭用鼻子把水碗沿著架子推到你面前。大方地分給你。*", "*饅頭用個鼻將個水兜沿住架推埋嚟俾你。好大方。*", "*Mantou empuja su cuenco de agua por el estante hacia ti con el hocico. Compartido, con generosidad.*", "*En Mantou empeny el seu bol d'aigua pel prestatge cap a tu amb el morro. Compartit, amb generositat.*")],
      yarn: [H("*You pick up the sock. Mantou takes the other end. This is a game now.* Grrr (happy).", "*你拿起袜子。馒头叼住另一头。现在这是游戏了。* 呜呜（开心的）。", "*你拿起襪子。饅頭叼住另一頭。現在這是遊戲了。* 嗚嗚（開心的）。", "*你拎起隻襪。饅頭咬住另一頭。而家變咗遊戲喇。* 嗚嗚（開心嘅）。", "*Coges el calcetín. Mantou coge el otro extremo. Ahora es un juego.* Grrr (contento).", "*Agafes el mitjó. En Mantou n'agafa l'altra punta. Ara és un joc.* Grrr (content).")],
      box: [H("*Mantou noses through his toy box and brings you the best thing in it: a squeaky duck, very loved.*", "*馒头用鼻子翻他的玩具箱，把最好的那样叼给你：一只被他爱得旧旧的吱吱鸭。*", "*饅頭用鼻子翻他的玩具箱，把最好的那樣叼給你：一隻被他愛得舊舊的吱吱鴨。*", "*饅頭用個鼻喺玩具箱度搵嚟搵去，咬咗最好嗰樣俾你：一隻俾佢錫到殘晒嘅吱吱鴨。*", "*Mantou rebusca en su caja de juguetes y te trae lo mejor que hay: un pato que pita, muy querido.*", "*En Mantou remena la seva capsa de joguines i et porta el millor que hi ha: un ànec que xiula, molt estimat.*")],
      dumpling: [H("*Mantou looks at the bun, then at you, then at the bun. He's been very good today.*", "*馒头看看馒头，看看你，又看看馒头。他今天很乖的。*", "*饅頭看看饅頭，看看你，又看看饅頭。他今天很乖的。*", "*饅頭望吓個饅頭，望吓你，又望返個饅頭。佢今日好乖㗎。*", "*Mantou mira el bollo, luego a ti, luego el bollo. Hoy se ha portado muy bien.*", "*En Mantou mira el panet, després a tu, després el panet. Avui s'ha portat molt bé.*")]
    },
    mantouZ: [H("*Mantou's tail thumps once in his sleep.*", "*馒头在睡梦里拍了一下尾巴。*", "*饅頭在睡夢裡拍了一下尾巴。*", "*饅頭瞓夢中拍咗一下條尾。*", "*La cola de Mantou golpea una vez en sueños.*", "*La cua d'en Mantou pica un cop mentre dorm.*")]
  };
  const fidIdx = {};
  function fidLine(list, key) { const i = fidIdx[key] || 0; fidIdx[key] = i + 1; return L(list[i % list.length]); }
  if (stage) stage.addEventListener('click', e => {
    const hit = e.target.closest && e.target.closest('.shelf .hshelf, .shelf svg.fbpx, .shelf > span:not(#cellar-banner-text)'); if (!hit) return;   /* a whole span when its emoji weren't drawn (the animals' language keeps them) */
    e.stopPropagation(); idle();
    const it = hit.closest('.hshelf') || hit, k = it.dataset ? it.dataset.k || '' : '', low = !!it.closest('.shelf') && it.closest('.shelf') === document.querySelectorAll('.shelf')[1];
    it.classList.remove('nd-fid'); void it.getBoundingClientRect(); it.classList.add('nd-fid'); setTimeout(() => it.classList.remove('nd-fid'), 600);
    const h = hostNow(), shelf = document.body.dataset.shelf || 'wei';
    try { if (shelf === 'wei' && !low && AppState.isBarOpen) SoundEngine.playClink(); else SoundEngine.playBlip(0.9 + Math.random() * 0.4); } catch (x) {}
    let line = '';
    if (away()) { if (catsHere()) line = fidLine(F.cats[k] || F.cats.x, 'cx' + k); }
    else if (h.who === 'wei') {
      if (AppState.weiState !== 'awake') line = catsHere() && Math.random() < .5 ? fidLine(F.cats.x, 'cx') : fidLine(F.weiZ, 'wz');
      else line = low ? fidLine(F.weiLow, 'wl') : AppState.isBarOpen ? fidLine(F.weiBar, 'wb') : fidLine(F.weiCafe, 'wc');
    }
    else if (h.who === 'mei') { const mk = F.mei[k] && !fidIdx['m' + k] ? k : 'x'; line = h.asleep ? L(F.mei.z[0]) : fidLine(F.mei[mk], 'm' + mk); }
    else if (h.who === 'popo') line = h.asleep ? L(F.popo.z[0]) : fidLine(F.popo[k] && !fidIdx['p' + k] ? F.popo[k] : (F.popo[k] || []).concat(F.popo.x), 'p' + k);   /* the thing's own line first, then her usual */
    else if (h.who === 'cats') line = h.asleep ? L(F.cats.z[0]) : fidLine(F.cats[k] && !fidIdx['c' + k] ? F.cats[k] : (F.cats[k] || []).concat(F.cats.x), 'c' + k);
    else if (h.who === 'mantou') line = h.asleep ? (catsHere() && Math.random() < .5 ? fidLine(F.cats.x, 'cx') : L(F.mantouZ[0])) : fidLine(F.mantouK[k] && !fidIdx['d' + k] ? F.mantouK[k] : (F.mantouK[k] || []).concat(F.mantou), 'd' + k);
    try { if (line && !/^\*/.test(line) && h.who !== 'cats' && h.who !== 'mantou') setExpression(one(['flat', 'o', 'grin']), 1400); } catch (x) {}
    try { if (h.who === 'cats' && !h.asleep) ['miso', 'yuzu'].forEach(id => Cats.anim && Cats.anim(id, 'hop')); } catch (x) {}
    if (line) say(line);
  }, true);

  /* ---------- the host engages: the house's own things come up in conversation ---------- */
  const SIG = SIGNATURES;
  const mode = () => AppState.isBarOpen ? 'bar' : 'cafe';
  const classics = () => Object.keys(DrinkManifest).filter(k => DrinkManifest[k].type === mode() && SIG[mode()].indexOf(k) < 0);
  const dn = k => L(DrinkManifest[k].name);
  const back = () => ({ label: L(WeiText.ui.back), onClick: backToOrder });
  const reply = t => { try { renderWei(L(t), [back()], COMPACT_GRID, 'chat'); } catch (e) {} };
  const CL = [H("*slides a {d} over* A classic. Some nights don't need inventing.", "*把一杯{d}推过来* 经典款。有些夜晚不需要发明什么。", "*把一杯{d}推過來* 經典款。有些夜晚不需要發明什麼。", "*將一杯{d}推埋嚟* 經典嘢。有啲夜晚唔使發明乜。", "*te desliza un {d}* Un clásico. Hay noches que no necesitan inventos.", "*et llisca un {d}* Un clàssic. Hi ha nits que no necessiten invents."),
    H("*already stirring a {d}* You look like someone who wants a drink that needs no explaining.", "*已经在搅一杯{d}了* 你看起来想要一杯不用解释的酒。", "*已經在攪一杯{d}了* 你看起來想要一杯不用解釋的酒。", "*已經喺度攪緊杯{d}* 你個樣似想要杯唔使解釋嘅嘢。", "*ya está removiendo un {d}* Tienes cara de querer algo que no necesite explicación.", "*ja remena un {d}* Fas cara de voler una cosa que no calgui explicar."),
    H("*sets down a {d} without a word, taps the bar twice*", "*一言不发地放下一杯{d}，在吧台上敲了两下*", "*一言不發地放下一杯{d}，在吧檯上敲了兩下*", "*一聲唔出放低杯{d}，喺吧枱敲咗兩下*", "*deja un {d} sin decir nada y da dos golpecitos en la barra*", "*deixa un {d} sense dir res i dona dos copets a la barra*")];
  const TAKE = H("Yes please", "好，来吧", "好，來吧", "好呀", "Sí, por favor", "Sí, si us plau"), ANOTHER = H("Another classic", "换一杯经典的", "換一杯經典的", "換杯經典嘅", "Otro clásico", "Un altre clàssic");
  function classic(fromChat) {
    const ks = classics(); if (!ks.length) return false; const k = one(ks);
    try { setExpression('grin', 1400); animateWei('wei-wiggle'); } catch (e) {}
    renderWei(L(one(CL)).replace(/\{d\}/g, dn(k)), [{ label: L(TAKE), onClick: () => serveItemByKey(k) }, { label: L(ANOTHER), onClick: () => classic(fromChat) }, fromChat ? { label: L(WeiText.ui.back), onClick: openChat } : back()], COMPACT_GRID, 'chat');
    return true;
  }
  /* Wei's Chat: a classic is one of the things to talk about */
  const CLASSIC_TOPIC = H("🥃 Something classic", "🥃 来点经典的", "🥃 來點經典的", "🥃 嚟啲經典嘢", "🥃 Algo clásico", "🥃 Alguna cosa clàssica");
  if (typeof chatButtons === 'function') { const cb0 = chatButtons; chatButtons = function () { const b = cb0.apply(this, arguments); b.splice(Math.max(0, b.length - 1), 0, { label: L(CLASSIC_TOPIC), onClick: () => classic(true) }); return b; }; }

  const LOOK = H("📖 Look in the box", "📖 翻翻盒子", "📖 翻翻盒子", "📖 睇吓個盒", "📖 Mirar en la caja", "📖 Mirar a la capsa");   /* the box itself: browse it, take yours back */
  const O = {
    wei: [
      { id: 'guess', q: H("*puts a glass behind his back* Guess what I'm pouring and it's on the house.", "*把杯子藏到身后* 猜猜我在倒什么，猜中了算我请。", "*把杯子藏到身後* 猜猜我在倒什麼，猜中了算我請。", "*將隻杯收埋喺背脊後面* 估吓我倒緊乜，估中我請。", "*esconde un vaso a la espalda* Adivina qué estoy sirviendo y te invita la casa.", "*amaga un got darrere l'esquena* Endevina què serveixo i et convida la casa."),
        a: () => [[H("🎲 Go on", "🎲 来吧", "🎲 來吧", "🎲 嚟吖", "🎲 Venga", "🎲 Endavant"), startRiddle], [H("Not now", "下次吧", "下次吧", "下次先", "Ahora no", "Ara no"), backToOrder]] },
      { id: 'classic', q: null, run: () => classic(false) },
      { id: 'picks', q: H("*leans on the bar* What's the best bar where you live? The real one. I'm writing them on the chalkboard.", "*靠在吧台上* 你住的地方最好的酒吧是哪家？真实的那种。我把它们写在黑板上。", "*靠在吧檯上* 你住的地方最好的酒吧是哪家？真實的那種。我把它們寫在黑板上。", "*挨住吧枱* 你住嗰度最好嘅酒吧係邊間？真嘅嗰種。我寫晒落黑板。", "*se apoya en la barra* ¿Cuál es el mejor bar donde vives? El de verdad. Los apunto en la pizarra.", "*es recolza a la barra* Quin és el millor bar d'on vius? El de debò. Els apunto a la pissarra."),
        a: () => [[H("📍 Write it up", "📍 写上去", "📍 寫上去", "📍 寫上去", "📍 Apúntalo", "📍 Apunta-ho"), () => BarPicks.add()], [H("📍 Show me the board", "📍 给我看看黑板", "📍 給我看看黑板", "📍 俾我睇吓塊黑板", "📍 Enséñame la pizarra", "📍 Ensenya'm la pissarra"), () => BarPicks.open()], [H("Later", "等会儿", "等會兒", "遲啲先", "Luego", "Després"), backToOrder]] },
      { id: 'gift', ok: () => Bond.giftsTonight < 3, q: H("*glances at your bag* You didn't bring me anything, did you? …Kidding. Unless?", "*瞄了一眼你的包* 你没给我带东西吧？……开玩笑的。除非？", "*瞄了一眼你的包* 你沒給我帶東西吧？……開玩笑的。除非？", "*睄一睄你個袋* 你冇帶嘢俾我㗎嘛？……講笑。除非？", "*mira tu bolsa* No me habrás traído nada, ¿no? …Es broma. ¿O sí?", "*mira la teva bossa* No m'hauràs portat res, oi? …És broma. O sí?"),
        a: () => [[H("🎁 Actually, I did", "🎁 其实，带了", "🎁 其實，帶了", "🎁 其實，有帶", "🎁 Pues sí", "🎁 Doncs sí"), openGifts], [H("Ha. No.", "哈。没有。", "哈。沒有。", "哈。冇。", "Ja. No.", "Ha. No."), () => reply(H("*laughs, slides a coaster over anyway*", "*笑了，还是推过来一张杯垫*", "*笑了，還是推過來一張杯墊*", "*笑咗出嚟，照樣推張杯墊過嚟*", "*se ríe y te desliza un posavasos igualmente*", "*riu i et llisca un sotagot igualment*"))]] },
      { id: 'usual', ok: () => { const k = Bond.lastOrder && Bond.lastOrder[mode()]; return k && DrinkManifest[k]; }, q: () => L(H("*already reaching for the {d}* The usual?", "*已经伸手去拿{d}了* 老样子？", "*已經伸手去拿{d}了* 老樣子？", "*已經伸手去攞{d}* 照舊？", "*ya va a por el {d}* ¿Lo de siempre?", "*ja va a buscar el {d}* El de sempre?")).replace('{d}', dn(Bond.lastOrder[mode()])),
        a: () => [[H("⭐ The usual", "⭐ 老样子", "⭐ 老樣子", "⭐ 照舊", "⭐ Lo de siempre", "⭐ El de sempre"), orderUsual], [H("Something new", "来点新的", "來點新的", "嚟啲新嘢", "Algo nuevo", "Alguna cosa nova"), () => { try { toggleCodexModal(true); } catch (e) {} }]] },
      { id: 'recipe', q: H("*pulls Popo's recipe box from under the counter* She says I follow the card too closely. Want me to cook you one?", "*从吧台下拿出婆婆的食谱盒* 她说我太照着卡片做了。要我给你做一道吗？", "*從吧檯下拿出婆婆的食譜盒* 她說我太照著卡片做了。要我給你做一道嗎？", "*由吧枱底攞出婆婆個食譜盒* 佢話我太跟張卡做。要唔要我煮一味俾你？", "*saca la caja de recetas de Popo de debajo de la barra* Dice que sigo la ficha demasiado. ¿Te cocino una?", "*treu la capsa de receptes de la Popo de sota la barra* Diu que segueixo massa la fitxa. Te'n cuino una?"),
        a: () => [[H("📖 Yes, cook one", "📖 好，做一道", "📖 好，做一道", "📖 好，煮一味", "📖 Sí, cocina una", "📖 Sí, cuina'n una"), () => PopoRecipes.cook()], [H("I'll leave ours", "我留一道我家的", "我留一道我家的", "我留低我屋企嗰味", "Dejo la nuestra", "Deixo la nostra"), () => PopoRecipes.write()], [LOOK, () => PopoRecipes.open()]] }
    ],
    mei: [
      { id: 'picks', q: H("okay real question. best coffee where you live? I'm making a list for when I visit. for research.", "好，认真问一句。你住的地方哪家咖啡最好？我在列清单，等我去玩用。做研究。", "好，認真問一句。你住的地方哪家咖啡最好？我在列清單，等我去玩用。做研究。", "好，認真問。你住嗰頭邊間咖啡最好？我列緊張清單，等我去玩用。做研究。", "vale, pregunta seria. ¿el mejor café donde vives? hago una lista para cuando vaya. es investigación.", "vale, pregunta seriosa. el millor cafè d'on vius? faig una llista per quan hi vagi. és recerca."),
        a: () => [[H("📍 Tell her", "📍 告诉她", "📍 告訴她", "📍 話俾佢知", "📍 Díselo", "📍 Digues-li-ho"), () => BarPicks.add()], [H("📍 What did people say?", "📍 大家都说了啥？", "📍 大家都說了啥？", "📍 啲人講咗乜？", "📍 ¿Qué ha dicho la gente?", "📍 Què ha dit la gent?"), () => BarPicks.open()], [H("No idea", "不知道", "不知道", "唔知", "Ni idea", "Ni idea"), () => reply(H("*looks at you, slowly puts her phone down* …we have to fix that.", "*看着你，慢慢放下手机* ……这得改。", "*看著你，慢慢放下手機* ……這得改。", "*望住你，慢慢放低部手機* ……呢樣要改。", "*te mira y deja el móvil despacio* …eso hay que arreglarlo.", "*et mira i deixa el mòbil a poc a poc* …això s'ha d'arreglar."))]] },
      { id: 'coffee', q: () => { const ks = Object.keys(DrinkManifest).filter(x => DrinkManifest[x].type === 'cafe'); O.mei.k = one(ks); return L(H("*holds up a cup* I made you a {d}. Don't look at it. Just drink it.", "*举起一个杯子* 我给你做了杯{d}。别看。直接喝。", "*舉起一個杯子* 我給你做了杯{d}。別看。直接喝。", "*舉起隻杯* 我整咗杯{d}俾你。唔好睇。飲咗佢。", "*levanta una taza* Te he hecho un {d}. No lo mires. Bébetelo.", "*aixeca una tassa* T'he fet un {d}. No el miris. Beu-te'l.")).replace('{d}', dn(O.mei.k)); },
        a: () => [[H("☕ Drink it", "☕ 喝了", "☕ 喝了", "☕ 飲咗佢", "☕ Bébetelo", "☕ Beu-te'l"), () => { if (window.NDMeiMake) NDMeiMake(O.mei.k); }], [H("Maybe later", "等会儿吧", "等會兒吧", "陣間先", "Luego quizá", "Potser després"), () => reply(H("rude. accurate, but rude.", "没礼貌。说得对，但没礼貌。", "沒禮貌。說得對，但沒禮貌。", "冇禮貌。講得啱，但冇禮貌。", "qué borde. con razón, pero borde.", "quin mal educat. amb raó, però mal educat."))]] },
      { id: 'recipe', q: H("Popo left her recipe box here. I can cook from it. Sort of. It'll be a bit burnt.", "婆婆把食谱盒留在这儿了。我可以照着做。算是吧。会有点焦。", "婆婆把食譜盒留在這兒了。我可以照著做。算是吧。會有點焦。", "婆婆個食譜盒留咗喺度。我可以跟住煮。算係啦。會有啲燶。", "Popo dejó aquí su caja de recetas. Puedo cocinar algo. Más o menos. Saldrá un poco quemado.", "La Popo ha deixat aquí la capsa de receptes. Puc cuinar alguna cosa. Més o menys. Sortirà una mica cremat."),
        a: () => [[H("📖 Go on then", "📖 那就做吧", "📖 那就做吧", "📖 咁煮啦", "📖 Venga, va", "📖 Som-hi"), () => PopoRecipes.cook()], [H("I'll leave ours", "我留一道我家的", "我留一道我家的", "我留低我屋企嗰味", "Dejo la nuestra", "Deixo la nostra"), () => PopoRecipes.write()], [LOOK, () => PopoRecipes.open()]] }
    ],
    popo: [
      { id: 'recipe', q: P5("Your family, what they cook at home? Popo got a box of recipes from people. I cook one for you, OK?", "你家里，平时煮什么？婆婆有一盒别人家的食谱。我煮一道给你，好不好？", "你屋企平時煮乜？婆婆有一盒人哋嘅食譜。我煮一味俾你，好唔好？", "¿Tu familia, qué cocina en casa? Popo tiene una caja de recetas de la gente. Yo cocino una para ti, ¿vale?", "I a casa teva, què cuineu? La Popo té una capsa de receptes de la gent. Te'n cuino una, d'acord?"),
        a: () => [[P5("📖 Yes please", "📖 好呀", "📖 好呀", "📖 Sí, por favor", "📖 Sí, si us plau"), () => PopoRecipes.cook()], [P5("I'll leave ours", "我留一道我家的", "我留低我屋企嗰味", "Dejo la nuestra", "Deixo la nostra"), () => PopoRecipes.write()], [LOOK, () => PopoRecipes.open()], [P5("Next time", "下次吧", "下次先", "La próxima vez", "La propera vegada"), () => reply(P5("Next time you come, I cook. Promise ah.", "下次你来，我煮。说好了。", "下次你嚟，我煮。講好咗。", "Próxima vez tú vienes, yo cocino. Promesa.", "La propera vegada que vinguis, cuino jo. Promès."))]] },
      { id: 'picks', q: P5("Where you eat near your home? Good place or not? Not expensive? Tell Popo lah.", "你家附近，去哪里吃饭？好不好吃？贵不贵？告诉婆婆。", "你屋企附近喺邊度食飯？好唔好食？貴唔貴？話俾婆婆知。", "¿Dónde comes cerca de tu casa? ¿Sitio bueno? ¿No caro? Dile a Popo.", "On menges a prop de casa? Un bon lloc? No gaire car? Explica-li a la Popo."),
        a: () => [[P5("📍 Tell her", "📍 告诉她", "📍 話俾佢知", "📍 Díselo", "📍 Digues-li-ho"), () => BarPicks.add()], [P5("📍 Where do people eat?", "📍 大家都在哪儿吃？", "📍 啲人喺邊度食？", "📍 ¿Dónde come la gente?", "📍 On menja la gent?"), () => BarPicks.open()]] },
      { id: 'dish', q: () => { const m = window.NDPopoMenu ? NDPopoMenu() : []; O.popo.d = m.length ? one(m.slice(0, 6)) : null; return O.popo.d ? L(P5("*puts down a bowl before you ask* {d}. You eat first. Then you talk.", "*你还没开口就放下一碗* {d}。你先吃。吃完再说。", "*你未開口就擺低一碗* {d}。你食先。食完先講。", "*pone un cuenco antes de que pidas* {d}. Tú comes. Luego hablas.", "*deixa un bol abans que demanis res* {d}. Menja. Després parles.")).replace('{d}', O.popo.d.name) : ''; },
        ok: () => !!window.NDPopoMenu, a: () => [[P5("🥢 Thank you, Popo", "🥢 谢谢婆婆", "🥢 多謝婆婆", "🥢 Gracias, Popo", "🥢 Gràcies, Popo"), () => { if (O.popo.d) O.popo.d.go(); }], [P5("I'm full", "我饱了", "我飽喇", "Estoy lleno", "Estic ple"), () => reply(P5("Full already? You eat like a bird. Half then lah.", "饱？你吃饭像只小鸟。那就半碗。", "飽？你食嘢好似隻雀仔。咁就半碗。", "¿Lleno? Comes como pajarito. Medio, entonces.", "Ple? Menges com un ocellet. Doncs mig bol."))]] }
    ],
    cats: [
      { id: 'recipe', q: H("*Yuzu bats a folded recipe card across the counter with one paw. It stops by your hand.*", "*柚子用一只爪把一张折好的食谱卡拨过吧台，正好停在你手边。*", "*柚子用一隻爪把一張摺好的食譜卡撥過吧檯，正好停在你手邊。*", "*柚子用一隻爪將張摺好嘅食譜卡撥過吧枱，啱啱停喺你隻手隔籬。*", "*Yuzu empuja con la pata una ficha de receta doblada por la barra. Se para junto a tu mano.*", "*La Yuzu empeny amb la pota una fitxa de recepta plegada per la barra. S'atura al costat de la teva mà.*"),
        a: () => [[H("*unfold it*", "*打开它*", "*打開它*", "*打開佢*", "*desdoblarla*", "*desplegar-la*"), () => PopoRecipes.cook()], [H("*scratch her chin*", "*挠挠她的下巴*", "*撓撓她的下巴*", "*搲吓佢個下巴*", "*rascarle la barbilla*", "*gratar-li la barbeta*"), () => reply(H("*Yuzu closes her eyes and leans into it. The card can wait.*", "*柚子闭上眼睛，往你手上靠。卡片可以等等。*", "*柚子閉上眼睛，往你手上靠。卡片可以等等。*", "*柚子瞇埋眼，挨埋嚟你隻手。張卡等陣先。*", "*Yuzu cierra los ojos y se apoya en tu mano. La ficha puede esperar.*", "*La Yuzu tanca els ulls i s'hi recolza. La fitxa pot esperar.*"))]] },
      { id: 'picks', q: H("*Miso sits on a napkin with an address scribbled on it, and won't move.*", "*味噌坐在一张写着地址的餐巾纸上，就是不挪窝。*", "*味噌坐在一張寫著地址的餐巾紙上，就是不挪窩。*", "*味噌坐咗喺張寫住地址嘅紙巾度，點都唔郁。*", "*Miso está sentada sobre una servilleta con una dirección garabateada, y no se mueve.*", "*La Miso seu damunt d'un tovalló amb una adreça gargotejada, i no es mou.*"),
        a: () => [[H("*lift her gently*", "*轻轻把她抱起来*", "*輕輕把她抱起來*", "*輕輕抱起佢*", "*levantarla con cuidado*", "*aixecar-la amb compte*"), () => BarPicks.open()], [H("*let her keep it*", "*让她留着*", "*讓她留著*", "*由佢留住*", "*dejar que se la quede*", "*deixar que se la quedi*"), () => reply(H("*Miso purrs, one slow blink. You've been approved.*", "*味噌呼噜着，慢慢眨了一下眼。你通过了。*", "*味噌呼嚕著，慢慢眨了一下眼。你通過了。*", "*味噌呼嚕呼嚕，慢慢眨咗一下眼。你合格喇。*", "*Miso ronronea y parpadea despacio. Te ha aprobado.*", "*La Miso ronca i parpelleja a poc a poc. T'ha aprovat.*"))]] }
    ],
    mantou: [
      { id: 'picks', q: H("*Mantou drops a crumpled napkin in your lap. There's an address on it, and a little drool.*", "*馒头把一张揉皱的餐巾纸丢到你腿上。上面有个地址，还有一点口水。*", "*饅頭把一張揉皺的餐巾紙丟到你腿上。上面有個地址，還有一點口水。*", "*饅頭將張皺晒嘅紙巾掉落你大髀。上面有個地址，仲有啲口水。*", "*Mantou te deja una servilleta arrugada en el regazo. Tiene una dirección, y un poco de baba.*", "*En Mantou et deixa un tovalló arrugat a la falda. Hi ha una adreça, i una mica de bava.*"),
        a: () => [[H("*unfold it*", "*打开它*", "*打開它*", "*打開佢*", "*desdoblarla*", "*desplegar-lo*"), () => BarPicks.open()], [H("*good boy*", "*好狗狗*", "*好狗狗*", "*乖狗狗*", "*buen chico*", "*bon gos*"), () => reply(H("*Mantou's whole back half wags.* Woof!", "*馒头整个后半身都在摇。* 汪！", "*饅頭整個後半身都在搖。* 汪！", "*饅頭成個後半截都喺度擰。* 汪！", "*A Mantou le menea toda la parte de atrás.* ¡Guau!", "*A en Mantou se li belluga tota la part del darrere.* Bup!"))]] },
      { id: 'recipe', q: H("*Mantou noses Popo's recipe box along the counter towards you.*", "*馒头用鼻子把婆婆的食谱盒沿着吧台拱到你面前。*", "*饅頭用鼻子把婆婆的食譜盒沿著吧檯拱到你面前。*", "*饅頭用個鼻將婆婆個食譜盒沿住吧枱拱過嚟你面前。*", "*Mantou empuja con el hocico la caja de recetas de Popo por la barra hacia ti.*", "*En Mantou empeny amb el morro la capsa de receptes de la Popo per la barra cap a tu.*"),
        a: () => [[H("*open it*", "*打开*", "*打開*", "*打開佢*", "*abrirla*", "*obrir-la*"), () => PopoRecipes.cook()], [H("*look inside*", "*往里看看*", "*往裡看看*", "*睇吓入面*", "*mirar dentro*", "*mirar-hi a dins*"), () => PopoRecipes.open()], [H("*pat him*", "*拍拍他*", "*拍拍他*", "*掃吓佢*", "*acariciarle*", "*acariciar-lo*"), () => reply(H("*Mantou leans his whole weight against your leg.* Hrrmf.", "*馒头把整个身子靠在你腿上。* 呼。", "*饅頭把整個身子靠在你腿上。* 呼。", "*饅頭成個身挨晒落你隻腳度。* 呼。", "*Mantou se apoya con todo su peso en tu pierna.* Hrrmf.", "*En Mantou es recolza amb tot el pes a la teva cama.* Hrrmf."))]] }
    ]
  };
  const usedO = {};
  window.NDOffer = function (k, after) {
    const list = (O[k] || []).filter(o => (!o.ok || o.ok()) && !(after && o.id === 'usual'));
    let free = list.filter(o => !usedO[k + o.id]);
    if (!free.length) { list.forEach(o => { delete usedO[k + o.id]; }); free = list; }
    if (!free.length) return false;
    /* the usual comes first for a regular */
    const o = free.find(x => x.id === 'usual') || one(free); usedO[k + o.id] = 1;
    try { if (o.run) return o.run(); } catch (e) { return false; }
    const q = typeof o.q === 'function' ? o.q() : L(o.q); if (!q) return false;
    try { if (k === 'cats') ['miso', 'yuzu'].forEach(id => Cats.anim && Cats.anim(id, 'hop')); else if (k !== 'mantou') setExpression('grin', 1400); } catch (e) {}
    try { if (k === 'cats') SoundEngine.playMeow(1.1); else SoundEngine.playClick(); } catch (e) {}
    renderWei(q, o.a().map(([label, fn]) => ({ label: L(label), onClick: () => { idle(); try { fn(); } catch (e) { backToOrder(); } } })), COMPACT_GRID, 'chat');
    return true;
  };

  /* ---------- an awake host's panel has no buttons ---------- */
  function tidy() {
    const h = hostNow(), up = h.who !== 'wei' && !h.asleep && !away();
    document.body.classList.toggle('nd-host-up', up);
  }
  setInterval(tidy, 800); tidy();

  /* ---------- waking, sleeping and the snore ---------- */
  /* Wei's energy shows on his face (heavy lids when he's tired); it never sends him to sleep: only the town's hour does */
  const svgAwake = $('avatar-layer-awake');
  if (svgAwake && !$('avatar-lids')) {
    const NS = 'http://www.w3.org/2000/svg', g = document.createElementNS(NS, 'g'); g.id = 'avatar-lids'; g.setAttribute('class', 'hidden');
    [[10, 10, 4, 2, '#e9be78'], [18, 10, 4, 2, '#e9be78'], [10, 12, 4, 1, '#6b3a1b'], [18, 12, 4, 1, '#6b3a1b']].forEach(([x, y, w, hh, f]) => { const r = document.createElementNS(NS, 'rect'); r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', hh); r.setAttribute('fill', f); r.setAttribute('class', 'lid-' + (hh === 2 ? 'skin' : 'lash')); g.appendChild(r); });
    svgAwake.appendChild(g);
  }
  function face() {
    const g = $('avatar-lids'), c = $('sprite-wei-container'), e = AppState.weiEnergy;
    if (g) { g.classList.toggle('hidden', !(e <= 2)); g.querySelectorAll('.lid-skin').forEach(r => r.setAttribute('height', e <= 1 ? 2 : 1)); g.querySelectorAll('.lid-lash').forEach(r => r.setAttribute('y', e <= 1 ? 12 : 11)); }
    if (c) c.classList.toggle('nd-tired', e <= 1);
  }
  const weiWant = () => { const h = hostNow(); if (h.who !== 'wei' || away()) return null; return h.asleep ? 'asleep' : 'awake'; };
  function weiUp() {
    AppState.weiState = 'awake';
    const a = $('avatar-layer-awake'), s = $('avatar-layer-sleeping'), z = $('wei-zzz-particles'), c = $('sprite-wei-container');
    if (a) a.classList.remove('hidden'); if (s) s.classList.add('hidden'); if (z) z.classList.add('hidden');
    if (c) { c.classList.add('sway-idle'); c.classList.remove('sleep-breathing'); }
  }
  const ev0 = window.evaluateWeiState;
  if (ev0) evaluateWeiState = function () {
    const r = ev0.apply(this, arguments);
    if (AppState.weiState === 'asleep' && weiWant() === 'awake') { weiUp(); try { Cats.syncSleep(); } catch (e) {} }
    face(); return r;
  };
  /* waking Wei here doesn't move the town's clock: he's simply up for a while (FBWorld.wake), in the top bar too */
  const wk0 = window.wakeUpBartender;
  if (wk0) wakeUpBartender = function () {
    try { if (W.wake) W.wake(); } catch (e) {}
    const r = wk0.apply(this, arguments);
    try { if (W.hour) { const was = AppState.isBarOpen; updateClockHands(W.hour()); if (was !== AppState.isBarOpen) { AppState.currentTopic = null; } evaluateWeiState(); } } catch (e) {}
    SoundEngine.stopSnore && SoundEngine.stopSnore();
    /* his first word ("…?") stands for a moment, then the question he was about to ask comes back */
    setTimeout(() => { if (AppState.uiMode === 'topic' && AppState.weiState === 'awake') { try { renderCurrentDialogue(); } catch (e) {} } }, 2600);
    return r;
  };
  /* on the cats' own visit the cats are behind the counter: tapping one is tapping the host (a sleeping one wakes, an awake one
     starts something); on anyone else's visit a cat gets a reaction (catTap) */
  if (stage) stage.addEventListener('click', e => {
    const c = e.target.closest && e.target.closest('.cat'); if (!c || e.target.closest('.nd-paw')) return;   /* today's Paw Reading card under a paw answers for itself */
    const h = hostNow(); if (h.who !== 'cats') return;
    e.stopPropagation(); idle(); try { tapBartender(); } catch (x) {}
  }, true);
  /* the top bar and the counter agree: whoever woke Wei (here or in the guide), and when his 15 minutes are up */
  setInterval(() => {
    const want = weiWant(); if (!want || want === AppState.weiState) return;
    if (AppState.uiMode === 'served' && want === 'asleep') return;   /* he finishes pouring first */
    try { evaluateWeiState(); if (AppState.weiState === want) { AppState.currentTopic = null; renderCurrentDialogue(); Cats.syncSleep(); } } catch (e) {}
  }, 2000);
  /* a tired Wei gets his breath back slowly */
  setInterval(() => { if (AppState.weiState === 'awake' && AppState.weiEnergy < 4) { AppState.weiEnergy++; face(); } }, 240000);
  setTimeout(face, 1000);

  /* the snore: only while the one behind the counter is shown asleep, and it stops the moment they wake */
  const SE = SoundEngine;
  function shownAsleep() {
    if (away() || (typeof currentRoom !== 'undefined' && currentRoom !== 'counter')) return false;
    const h = hostNow();
    if (h.who === 'wei') return AppState.weiState === 'asleep';
    return !!h.asleep;
  }
  let zz = [];
  SE.stopSnore = function () { const t = this.ctx ? this.ctx.currentTime : 0; zz.forEach(([o, g]) => { try { g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0.0001, t, 0.03); o.stop(t + 0.12); } catch (e) {} }); zz = []; };
  SE.playSnore = function () {
    if (!shownAsleep()) return;
    this.init(); if (!this.ctx) return;
    const cat = hostNow().who === 'cats', now = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    if (cat) {   /* the cats purr in their sleep */
      o.type = 'sawtooth'; o.frequency.setValueAtTime(26, now);
      g.gain.setValueAtTime(0.0001, now); g.gain.linearRampToValueAtTime(0.03, now + 0.3); g.gain.linearRampToValueAtTime(0.012, now + 0.6); g.gain.linearRampToValueAtTime(0.028, now + 0.9); g.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      o.connect(g); g.connect(this.ctx.destination); o.start(now); o.stop(now + 1.5);
    } else {
      const lo = hostNow().who === 'mantou' ? 0.8 : hostNow().who === 'mei' || hostNow().who === 'popo' ? 1.25 : 1;
      o.type = 'sawtooth'; o.frequency.setValueAtTime(85 * lo, now); o.frequency.linearRampToValueAtTime(130 * lo, now + 0.35); o.frequency.linearRampToValueAtTime(75 * lo, now + 0.7);
      g.gain.setValueAtTime(0.02, now); g.gain.linearRampToValueAtTime(0.045, now + 0.35); g.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      o.connect(g); g.connect(this.ctx.destination); o.start(now); o.stop(now + 0.8);
    }
    zz.push([o, g]); o.onended = () => { zz = zz.filter(x => x[0] !== o); };
  };
  let nextZ = 0, wasZ = false;
  setInterval(() => {
    const z = shownAsleep();
    if (!z) { if (wasZ) SE.stopSnore(); wasZ = false; return; }
    if (!wasZ) { nextZ = Date.now() + 2500; wasZ = true; }
    if (document.hidden || !SE.ctx || SE.ctx.state !== 'running' || Date.now() < nextZ) return;
    nextZ = Date.now() + 6000 + Math.random() * 3000; SE.playSnore();
  }, 500);
  addEventListener('fbhostwake', () => SE.stopSnore());
})();
