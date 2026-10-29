/* Vocab: what every page of the app shares. Loaded in <head>, right after fb.js.
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


  /* ---------- the language you're learning: the last room you opened, opened straight away next time ---------- */
  var ROOMS = ["cat", "es", "yue", "chengyu", "cymraeg"];
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var path = location.pathname, m = /\/vocab\/([a-z]+)\/(index\.html)?$/.exec(path), here = m && ROOMS.indexOf(m[1]) >= 0 ? m[1] : null;
  if (here) ls("vk_room", here);
  else if (/\/vocab\/(index\.html)?$/.test(path)) {
    var mine = ls("vk_room");
    if (mine && ROOMS.indexOf(mine) >= 0 && !location.hash && !/[?&]all\b/.test(location.search)) { location.replace(path.replace(/index\.html$/, "") + mine + "/"); }
  }
  function room() { var r = ls("vk_room"); return ROOMS.indexOf(r) >= 0 ? r : null; }

  /* ---------- the rooms' own words in the interface language ----------
     VK.ui({ src: "ca", skip: ".term,.meaning", d: { "Targetes": ["Cards", "卡片", "卡片", "Tarjetas", "Targetes"], ... } })
     A key may hold # (any number or a level code like A1, kept as it is) and * (any text);
     the translation puts them back in order, or by {1} {2} … when the order changes. */
  var TOK = /\d+(?:[.,]\d+)*|\b[ABC][12]\b/g;
  var ex = {}, wild = [], CFG = null, done = new WeakMap(), on = false;
  function esc(x) { return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function fill(out, got) {
    if (/\{\d\}/.test(out)) return out.replace(/\{(\d)\}/g, function (m, n) { return got[n - 1] != null ? got[n - 1] : m; });
    var i = 0; return out.replace(/[#*]/g, function (m) { return i < got.length ? got[i++] : m; });
  }
  function tr(str) {
    if (!on || str == null) return str;
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(String(str)), core = m[2]; if (!core) return str;
    var got = [], key = core.replace(TOK, function (t) { got.push(t); return "#"; }), a = ex[key], out = null;
    if (a) out = fill(a, got);
    else if (ex[core]) out = ex[core];
    else for (var i = 0; i < wild.length; i++) { var r = wild[i][0].exec(core); if (r) { out = fill(wild[i][1], r.slice(1)); break; } }
    return out == null ? str : m[1] + out + m[3];
  }
  var ATTR = ["placeholder", "aria-label", "title"];
  function skip(el) { return !el || el.closest("script,style,textarea,.fbc,.fbc-intro,[data-vk-keep]" + (CFG.skip ? "," + CFG.skip : "")); }
  function text(n) { if (done.get(n) === n.nodeValue || skip(n.parentElement)) return; var v = tr(n.nodeValue); if (v !== n.nodeValue) { n.nodeValue = v; } done.set(n, n.nodeValue); }
  function attrs(el) { if (!el || (el.tagName !== "TEXTAREA" && skip(el)) || (el.tagName === "TEXTAREA" && el.parentElement && skip(el.parentElement))) return; for (var i = 0; i < ATTR.length; i++) { var v = el.getAttribute(ATTR[i]); if (v) { var w = tr(v); if (w !== v) el.setAttribute(ATTR[i], w); } } }
  function walk(root) {
    if (root.nodeType === 3) return text(root);
    if (root.nodeType !== 1) return;
    attrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) text(n); else attrs(n); }
  }
  function ui(cfg) {
    var nat = [].concat(cfg.src); if (nat.indexOf(code()) >= 0) return;
    CFG = cfg; on = true; var li = idx();
    for (var k in cfg.d) { var a = cfg.d[k], v = a[li]; if (v == null || v === "") continue;
      var key = k.replace(TOK, "#");
      if (k.indexOf("*") >= 0) wild.push([new RegExp("^" + esc(key).replace(/\\\*/g, "([\\s\\S]+?)").replace(/#/g, "(\\d+(?:[.,]\\d+)*|[ABC][12])") + "$"), v]);
      else ex[key] = v; }
    var oc = window.confirm, oa = window.alert, op = window.prompt;
    window.confirm = function (m) { return oc.call(window, tr(m)); };
    window.alert = function (m) { return oa.call(window, tr(m)); };
    if (op) window.prompt = function (m, d) { return op.call(window, tr(m), d); };
    function start() {
      walk(document.body);
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) { var r = ms[i];
          if (r.type === "childList") for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]);
          else if (r.type === "characterData") text(r.target);
          else if (r.type === "attributes") attrs(r.target); }
      }).observe(document.body, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ATTR });
    }
    if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
  }
  var LOC = ["en-GB", "zh-CN", "zh-TW", "es-ES", "ca-ES"];
  function locale(def) { return on ? LOC[idx()] : def; }

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

  window.VK = { room: room, LANGS: LANGS, code: code, idx: idx, t: t, W: W, sheet: sheet, ui: ui, tr: tr, locale: locale };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paintButtons); else paintButtons();
})();
