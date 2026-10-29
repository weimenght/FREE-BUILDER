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
    lang: ["Interface language", "界面语言", "介面語言", "Idioma", "Llengua"],
    impTitle: ["Bring your own words", "导入你自己的词", "匯入你自己的詞", "Trae tus propias palabras", "Porta les teves paraules"],
    impHow: ["One per line: {cols}. Tabs, commas or | between them.", "每行一个：{cols}。用 Tab、逗号或 | 分开。", "每行一個：{cols}。用 Tab、逗號或 | 分開。", "Una por línea: {cols}. Separadas por tabulador, coma o |.", "Una per línia: {cols}. Separades per tabulador, coma o |."],
    impPaste: ["Paste your list here…", "把你的词表粘贴到这里…", "把你的詞表貼到這裡…", "Pega tu lista aquí…", "Enganxa la teva llista aquí…"],
    impFile: ["Choose a file", "选择文件", "選擇檔案", "Elegir un archivo", "Tria un fitxer"],
    impNone: ["Nothing to add yet", "还没有可以添加的词", "還沒有可以加入的詞", "Aún no hay nada que añadir", "Encara no hi ha res per afegir"],
    impFound: ["{n} found, e.g. {ex}", "找到 {n} 个，例如 {ex}", "找到 {n} 個，例如 {ex}", "{n} encontradas, p. ej. {ex}", "{n} trobades, p. ex. {ex}"],
    impAdd: ["Add {n}", "添加 {n} 个", "加入 {n} 個", "Añadir {n}", "Afegeix-ne {n}"],
    impCancel: ["Cancel", "取消", "取消", "Cancelar", "Cancel·la"],
    impLocal: ["Stays on this device. Nothing is sent.", "只留在这台设备上，不会发送到任何地方。", "只留在這台裝置上，不會傳送到任何地方。", "Se queda en este dispositivo. No se envía nada.", "Es queda en aquest dispositiu. No s'envia res."],
    impDone: ["{n} added", "已添加 {n} 个", "已加入 {n} 個", "{n} añadidas", "{n} afegides"],
    impDup: ["{n} added ({d} already there)", "已添加 {n} 个（{d} 个已经有了）", "已加入 {n} 個（{d} 個已經有了）", "{n} añadidas ({d} ya estaban)", "{n} afegides ({d} ja hi eren)"],
    impBad: ["That file can't be read as text", "这个文件读不出文字", "這個檔案讀不出文字", "Ese archivo no se puede leer como texto", "Aquest fitxer no es pot llegir com a text"],
    imp: ["Import a list", "导入词表", "匯入詞表", "Importar una lista", "Importa una llista"]
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
  function skip(el) { return !el || el.closest("script,style,textarea,.fbc,.fbc-intro,.brand-title,[data-vk-keep]" + (CFG.skip ? "," + CFG.skip : "")); }
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

  /* ---------- bring your own words: paste or a file (CSV, TSV, plain lines); parsed here, kept by the room on this device ----------
     VK.importList({ cols: [[en, zh, zh-Hant, es, ca], …], add: function (rows) { return { added: n, dup: d }; } })
     rows: arrays of trimmed cells in the order of cols; a row needs its first cell and one more. */
  function fmt(k, o) { return t(k).replace(/\{(\w+)\}/g, function (m, x) { return o[x] != null ? o[x] : m; }); }
  function cells(line) {
    if (line.indexOf("\t") >= 0) return line.split("\t");
    if (line.indexOf("|") >= 0) return line.split("|");
    if (line.indexOf(";") >= 0 && line.indexOf(",") < 0) return line.split(";");
    var out = [], cur = "", q = false;
    for (var i = 0; i < line.length; i++) { var c = line[i];
      if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"') q = true; else if (c === "," || c === "，") { out.push(cur); cur = ""; } else cur += c; }
    out.push(cur); return out;
  }
  function parseList(txt, n) {
    var rows = [], heads = {};
    String(txt || "").replace(/^﻿/, "").split(/\r?\n/).forEach(function (line, i) {
      if (!line.trim() || /^\s*#/.test(line)) return;
      var c = cells(line).map(function (x) { return x.trim(); }).slice(0, n);
      while (c.length < n) c.push("");
      if (!c[0] || (n > 1 && !c.slice(1).some(Boolean))) return;
      if (rows.length === 0 && /^(word|term|palabra|paraula|词|詞|字|front|cy|welsh|chinese|idiom|成语|成語)$/i.test(c[0])) return;   /* a header row */
      rows.push(c);
    });
    return rows;
  }
  var toastT;
  function note(msg) {
    var el = document.querySelector(".vk-note"); if (!el) { el = document.createElement("div"); el.className = "vk-note"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove("on"); }, 2600);
  }
  function importList(o) {
    if (document.querySelector(".vk-dim")) return;
    var opener = document.activeElement, li = idx(), n = o.cols.length;
    var dim = document.createElement("div"); dim.className = "vk-dim"; dim.setAttribute("data-vk-keep", "");
    var s = document.createElement("div"); s.className = "vk-sheet vk-imp"; s.setAttribute("role", "dialog"); s.setAttribute("aria-modal", "true"); s.setAttribute("aria-label", t("impTitle"));
    var colNames = o.cols.map(function (c) { return c[li] || c[0]; }).join(" | ");
    s.innerHTML = '<h2></h2><p class="vk-how"></p><textarea rows="6" spellcheck="false" autocapitalize="off"></textarea>' +
      '<div class="vk-row"><label class="vk-file"><input type="file" accept=".csv,.tsv,.txt,text/plain,text/csv,text/tab-separated-values" hidden><span></span></label><span class="vk-found" aria-live="polite"></span></div>' +
      '<p class="vk-local"></p><div class="vk-row vk-btns"><button type="button" class="vk-x"></button><button type="button" class="vk-go" disabled></button></div>';
    var q = function (x) { return s.querySelector(x); }, ta = q("textarea"), go = q(".vk-go"), found = q(".vk-found");
    q("h2").textContent = t("impTitle"); q(".vk-how").textContent = fmt("impHow", { cols: colNames }); ta.placeholder = t("impPaste");
    q(".vk-file span").textContent = t("impFile"); q(".vk-local").textContent = "🔒 " + t("impLocal"); q(".vk-x").textContent = t("impCancel");
    var rows = [];
    function look() {
      rows = parseList(ta.value, n);
      go.disabled = !rows.length; go.textContent = fmt("impAdd", { n: rows.length || "" }).trim();
      found.textContent = rows.length ? fmt("impFound", { n: rows.length, ex: rows[0].filter(Boolean).slice(0, 2).join(" · ") }) : (ta.value.trim() ? t("impNone") : "");
    }
    ta.addEventListener("input", look); look();
    q("input[type=file]").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { var v = String(r.result || ""); if (/\u0000/.test(v.slice(0, 2000))) { note(t("impBad")); return; } ta.value = v; look(); };
      r.onerror = function () { note(t("impBad")); }; r.readAsText(f);
    });
    function close() { dim.remove(); document.removeEventListener("keydown", key, true); if (opener && opener.focus) opener.focus(); }
    function key(e) { if (e.key === "Escape") { e.preventDefault(); close(); } }
    q(".vk-x").onclick = close;
    go.onclick = function () { if (!rows.length) return; var r = o.add(rows) || {}; close(); note(r.dup ? fmt("impDup", { n: r.added || 0, d: r.dup }) : fmt("impDone", { n: r.added || 0 })); };
    dim.addEventListener("click", function (e) { if (e.target === dim) close(); });
    document.addEventListener("keydown", key, true);
    dim.appendChild(s); document.body.appendChild(dim); ta.focus();
  }

  function sheet() {
    if (document.querySelector(".vk-dim")) return;
    var opener = document.activeElement;
    var dim = document.createElement("div"); dim.className = "vk-dim"; dim.setAttribute("data-vk-keep", "");
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

  window.VK = { importList: importList, parseList: parseList, note: note, room: room, LANGS: LANGS, code: code, idx: idx, t: t, W: W, sheet: sheet, ui: ui, tr: tr, locale: locale };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paintButtons); else paintButtons();
})();
