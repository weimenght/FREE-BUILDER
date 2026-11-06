/* One panel for every voice: the hosts' words, Wei's jokes, Mei's complaints, Popo's nagging and the animals all appear in the panel
   under the counter, never in speech bubbles or pop-ups. Tapping whoever is behind the counter starts a new little conversation
   (Wei asleep is the one exception: poking him three times still wakes him). Tapping a cat gets a reaction, in the panel. */
(function () {
  const S = (en, zh, tw, es, ca) => lx([en, zh, tw, tw, es, ca]);
  function vis(id) { const e = document.getElementById(id); return e && !e.classList.contains('hidden') && e.getClientRects().length; }
  /* one place for a line: on the served card it's the reply under the dish; at the counter it replaces what's there and the
     old answers go with it (a question never stays up under a line that isn't its own); on a host's own panel, its story line */
  function panelSay(t) {
    if (!t) return false;
    if (vis('served-result-screen')) { const r = document.getElementById('res-wei-reply'); if (r) { r.textContent = t; r.classList.remove('hidden'); } return true; }
    if (vis('rpg-dialogue-screen')) {
      try { Typer.run(document.getElementById('dialogue-speech-text'), t); } catch (e) { setText('dialogue-speech-text', t); }
      const g = document.getElementById('rpg-options-grid'); if (g && g.children.length) { g.innerHTML = ''; AppState.uiMode = 'topic'; }
      try { setText('dialogue-speaker-tag', speakerTag()); } catch (e) {}
      return true;
    }
    if (vis('sleep-mode-screen')) { setText('sleep-story-text', t); return true; }
    return false;
  }
  window.NDSay = panelSay;
  /* the host: each tap a new conversation */
  const tap0 = window.tapBartender;
  let taps = 0, phoned = false;
  window.tapBartender = function () {
    let h = null; try { h = FBWorld.host(); } catch (e) {}
    const k = window.NDChat ? NDChat.who() : null, out = !!(window.WeiAway && WeiAway.on());
    /* their own ways first: Wei's hello, poking a sleeping Wei awake, Mei's grumpy second tap, waking the cats,
       Popo's and Mantou's naps (nobody wakes them; the cats answer if they're here) */
    if (!k || out || (k === 'wei' && AppState.greetLater) || (h && h.asleep && h.who !== 'popo' && h.who !== 'mantou')) return tap0 && tap0();
    if (k === 'mei' && !phoned && Math.random() < .3) { phoned = true; return tap0 && tap0(); }   /* 3 in 10: she's on her phone for a beat first (never twice running) */
    phoned = false;
    try { resetIdle(); } catch (e) {}
    /* no Chat button: taps take turns between a fresh conversation and the host's own topics */
    taps++;
    if (taps % 2 === 0 && window.NDTopics && NDTopics()) return;
    if (window.NDChat && NDChat.now(true)) return;
    if (window.NDTopics && NDTopics()) return;
  };
  /* the cats at Next Door: no card, no bubbles; a tap gets a reaction in the panel */
  const CR = {
    miso: [S("*Miso looks at your hand, then at you, then allows it.*", "*味噌看看你的手，又看看你，然后勉强同意了。*", "*味噌看看你的手，又看看你，然後勉強同意了。*", "*Miso mira tu mano, luego a ti, y lo permite.*", "*La Miso et mira la mà, després a tu, i ho permet.*"),
      S("*Miso slow-blinks at you. In cat, that's a lot.*", "*味噌对你慢慢眨了眨眼。在猫的语言里，这很多了。*", "*味噌對你慢慢眨了眨眼。在貓的語言裡，這很多了。*", "*Miso te parpadea despacio. En gato, eso es mucho.*", "*La Miso et fa l'ullet a poc a poc. En gat, això és molt.*"),
      S("*Miso pushes a coaster off the counter. Then looks at you. Your fault now.*", "*味噌把一个杯垫推下吧台，然后看着你。现在是你的错了。*", "*味噌把一個杯墊推下吧台，然後看著你。現在是你的錯了。*", "*Miso tira un posavasos de la barra. Luego te mira. Ahora es culpa tuya.*", "*La Miso tira un sotagot de la barra. Després et mira. Ara és culpa teva.*"),
      S("*Miso yawns, all teeth, and goes back to being a loaf.*", "*味噌打了个满嘴尖牙的哈欠，又缩回成一条面包。*", "*味噌打了個滿嘴尖牙的哈欠，又縮回成一條麵包。*", "*Miso bosteza, todo dientes, y vuelve a ser una barra de pan.*", "*La Miso badalla, tota dents, i torna a fer de barra de pa.*")],
    yuzu: [S("*Yuzu headbutts your hand. Purring like a small engine.*", "*柚子用头顶了顶你的手，呼噜声像个小马达。*", "*柚子用頭頂了頂你的手，呼嚕聲像個小馬達。*", "*Yuzu te da un cabezazo en la mano. Ronronea como un motor pequeño.*", "*La Yuzu et dona un cop de cap a la mà. Ronca com un motor petit.*"),
      S("*Yuzu rolls over. It's a trap. You know it's a trap.*", "*柚子翻了个肚皮。是陷阱。你知道是陷阱。*", "*柚子翻了個肚皮。是陷阱。你知道是陷阱。*", "*Yuzu se pone panza arriba. Es una trampa. Sabes que es una trampa.*", "*La Yuzu es posa panxa enlaire. És una trampa. Ja saps que és una trampa.*"),
      S("*Yuzu chirps at a fly only she can see.*", "*柚子对着一只只有她看得见的苍蝇咔咔叫。*", "*柚子對著一隻只有她看得見的蒼蠅咔咔叫。*", "*Yuzu le hace ruiditos a una mosca que solo ve ella.*", "*La Yuzu fa sorollets a una mosca que només veu ella.*"),
      S("*Yuzu sits on your coaster, very pleased with herself.*", "*柚子坐在你的杯垫上，很得意。*", "*柚子坐在你的杯墊上，很得意。*", "*Yuzu se sienta en tu posavasos, muy satisfecha.*", "*La Yuzu s'asseu al teu sotagot, molt satisfeta.*")]
  };
  function catTap(id) { try { SoundEngine.playMeow(id === 'miso' ? .9 : 1.3); } catch (e) {} try { Cats.anim(id, 'wiggle'); } catch (e) {} const l = CR[id]; panelSay(L(l[Math.floor(Math.random() * l.length)])); }
  window.NDCatTap = catTap;
})();
