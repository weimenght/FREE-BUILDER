/* Vocab: what every page of the app shares. Loaded at the end of each page.
   - the interface language (five: EN, 简中, 繁中, ES, CA), kept with the sites' own preference (FBL)
   - the language sheet, opened by any [data-vk="lang"] button
   Nothing here leaves the device. */
(function () {
  "use strict";
  var LANGS = ["en", "zh", "zh-Hant", "es", "ca"];
  var NAMES = ["English", "简体中文", "繁體中文", "Español", "Català"];
  var SHORT = ["EN", "简", "繁", "ES", "CA"];
  var W = {
    title: ["Interface language", "界面语言", "介面語言", "Idioma de la interfaz", "Llengua de la interfície"],
    close: ["Close", "关闭", "關閉", "Cerrar", "Tanca"],
    lang: ["Interface language", "界面语言", "介面語言", "Idioma", "Llengua"]
  };
  function code() { var l = null; try { l = window.FBL && FBL.get(); } catch (e) {} return LANGS.indexOf(l) >= 0 ? l : "en"; }
  function idx() { return LANGS.indexOf(code()); }
  function t(k) { var w = W[k]; return w ? w[idx()] || w[0] : k; }

  function sheet() {
    if (document.querySelector(".vk-dim")) return;
    var opener = document.activeElement;
    var dim = document.createElement("div"); dim.className = "vk-dim";
    var s = document.createElement("div"); s.className = "vk-sheet"; s.setAttribute("role", "dialog"); s.setAttribute("aria-modal", "true"); s.setAttribute("aria-label", t("title"));
    var h = document.createElement("h2"); h.textContent = t("title"); s.appendChild(h);
    var cur = code();
    LANGS.forEach(function (l, i) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "menuitemradio"); b.setAttribute("lang", l); b.setAttribute("aria-checked", String(l === cur));
      b.innerHTML = "<span></span><small></small>"; b.firstChild.textContent = NAMES[i]; b.lastChild.textContent = SHORT[i];
      b.onclick = function () { if (l !== cur) { try { FBL.set(l); } catch (e) {} setTimeout(function () { location.reload(); }, 30); } else close(); };
      s.appendChild(b);
    });
    var x = document.createElement("button"); x.type = "button"; x.className = "vk-x"; x.textContent = t("close"); x.onclick = close; s.appendChild(x);
    dim.appendChild(s); document.body.appendChild(dim);
    function close() { dim.remove(); document.removeEventListener("keydown", key, true); if (opener && opener.focus) opener.focus(); }
    function key(e) { if (e.key === "Escape") { e.preventDefault(); close(); } }
    dim.addEventListener("click", function (e) { if (e.target === dim) close(); });
    document.addEventListener("keydown", key, true);
    var on = s.querySelector('[aria-checked="true"]'); if (on) on.focus();
  }

  function paintButtons() {
    [].forEach.call(document.querySelectorAll('[data-vk="lang"]'), function (b) {
      b.setAttribute("aria-label", t("lang")); b.title = t("lang");
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest('[data-vk="lang"]'); if (!b) return;
    e.preventDefault(); e.stopPropagation(); sheet();
  }, true);

  window.VK = { LANGS: LANGS, code: code, idx: idx, t: t, W: W, sheet: sheet };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paintButtons); else paintButtons();
})();
