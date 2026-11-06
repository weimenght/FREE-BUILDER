/* ===== A saved seat (?seat=1: the boba on wei-meng.org) =====
   fbl.js has already made it Wei's visit, awake and behind the counter, with no door question. Here he says he kept you a
   seat and makes you Wei's Notebook ("Always a seat for you here."). Once a visit. */
(function () {
  if (!/(^|[?&])seat=1(&|#|$)/.test(location.search)) return;
  try { if (sessionStorage.getItem('nd_seated')) return; } catch (e) {}
  const T = {
    sit: ["Saved you a seat. Sit, sit. I'm making you something.", "给你留了个座。坐，坐。我给你调一杯。", "給你留了個座。坐，坐。我給你調一杯。", "幫你留咗個位。坐，坐。我同你整杯嘢。", "Te guardé un sitio. Siéntate. Te preparo algo.", "T'he guardat un lloc. Seu, seu. Et preparo alguna cosa."],
    here: ["Here. On the house. Welcome in.", "来，这杯我请。欢迎。", "來，這杯我請。歡迎。", "嚟，呢杯我請。歡迎。", "Toma. Invita la casa. Bienvenido.", "Té. Convida la casa. Benvingut."]
  };
  const ok = () => { try { return AppState.weiState === 'awake' && !(window.WeiAway && WeiAway.on()) && window.FBWorld && FBWorld.host().who === 'wei'; } catch (e) { return false; } };
  let tries = 0;
  const t = setInterval(() => {
    if (++tries > 2400) return clearInterval(t);   /* ten minutes at most */
    if (typeof AppState === 'undefined' || !AppState.inSanctuary) return;
    /* a newcomer reads the town's privacy card first: he waits until it's put away */
    try { if (!localStorage.getItem('fb_priv_intro')) return; } catch (e) {}
    clearInterval(t);
    setTimeout(() => {
      if (!ok()) return;
      try { sessionStorage.setItem('nd_seated', '1'); } catch (e) {}
      try { SoundEngine.playShaker(); } catch (e) {}
      try { animateWei('wei-wiggle'); } catch (e) {}
      if (window.NDSay) NDSay(L(lx(T.sit)));
      setTimeout(() => { if (ok()) serveItemByKey('wei_notebook', { line: L(lx(T.here)) }); }, 3400);
    }, 1200);
  }, 250);
})();
