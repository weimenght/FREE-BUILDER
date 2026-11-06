/* Scripts the room only needs on first use: the Lab (behind the counter) and Popo's recipe box.
   Each is named by a <link rel="nd-lazy" data-nd="…" href="./js/….js"> in the page: browsers don't fetch an unknown rel,
   and the build stamps its href with the file's hash like any script, so a return visit never pairs a new page with an old copy.
   NDLazy.load(name) adds the script once and resolves when it has run. Gift stays a plain script: it wraps showServed,
   serveItemByKey and doCheers and starts the friend seat at load, so it has to be there before the first drink. */
(function () {
  const P = {};
  function load(name) {
    if (P[name]) return P[name];
    P[name] = new Promise(function (ok, no) {
      const l = document.querySelector('link[rel="nd-lazy"][data-nd="' + name + '"]');
      if (!l) { no(new Error('no ' + name)); return; }
      const s = document.createElement('script');
      s.src = l.getAttribute('href');
      s.onload = function () { try { (AFTER[name] || function () {})(); } catch (e) {} ok(); };
      s.onerror = function () { delete P[name]; s.remove(); no(new Error('could not load ' + name)); };
      document.body.appendChild(s);
    });
    return P[name];
  }
  /* what used to run at boot for each, run once it arrives instead */
  const AFTER = {
    lab: function () { Lab.init(); Lab.loadChallenge(); }
  };
  /* until the recipe box arrives, these stand in for it (recipes.js replaces window.PopoRecipes with the real one) */
  function later(m) {
    return function () {
      const a = arguments;
      return load('recipes').then(function () { return window.PopoRecipes[m].apply(window.PopoRecipes, a); }, function () {});
    };
  }
  window.PopoRecipes = { open: later('open'), write: later('write'), cook: later('cook') };
  /* fetch both quietly once the room is up and the visitor is idle, so the first tap rarely waits */
  function idle() {
    const c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;
    const go = function () { load('lab').catch(function () {}); load('recipes').catch(function () {}); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 15000 }); else setTimeout(go, 8000);
  }
  if (document.readyState === 'complete') setTimeout(idle, 6000); else addEventListener('load', function () { setTimeout(idle, 6000); });
  window.NDLazy = { load: load };
})();
