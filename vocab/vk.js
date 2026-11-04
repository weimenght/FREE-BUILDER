/* Vocab: what every page of the app shares. Loaded in <head>, right after fb.js.
   - the interface language (five: EN, 简中, 繁中, ES, CA), kept with the sites' own preference (FBL)
   - the language sheet, opened by any [data-vk="lang"] button
   Nothing leaves the device unless you turn on ☁ sync (then: your own words and card progress, under a key made here). */
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
    imp: ["Import a list", "导入词表", "匯入詞表", "Importar una lista", "Importa una llista"],
    syTitle: ["Your words on every device", "你的词，在每台设备上", "你的詞，在每台裝置上", "Tus palabras en todos tus dispositivos", "Les teves paraules a tots els dispositius"],
    syWhat: ["Your own words and how well you know each card, kept under a key made on this device. No name, no email.", "你自己的词，以及你对每张卡片的熟悉程度，保存在这台设备生成的钥匙之下。不需要名字，也不需要邮箱。", "你自己的詞，以及你對每張卡片的熟悉程度，保存在這台裝置產生的鑰匙之下。不需要名字，也不需要電郵。", "Tus propias palabras y lo bien que conoces cada tarjeta, guardadas con una llave creada en este dispositivo. Sin nombre ni correo.", "Les teves paraules i com de bé coneixes cada targeta, desades amb una clau creada en aquest dispositiu. Sense nom ni correu."],
    syOn: ["Keep them in sync", "开始同步", "開始同步", "Sincronizar", "Sincronitza"],
    syOff: ["Stop syncing (they stay here)", "停止同步（词留在这里）", "停止同步（詞留在這裡）", "Dejar de sincronizar (se quedan aquí)", "Deixa de sincronitzar (es queden aquí)"],
    syNow: ["Synced just now", "刚刚同步", "剛剛同步", "Sincronizado ahora", "Sincronitzat ara mateix"],
    syAt: ["Synced at {t}", "{t} 已同步", "{t} 已同步", "Sincronizado a las {t}", "Sincronitzat a les {t}"],
    syIng: ["Syncing…", "正在同步…", "正在同步…", "Sincronizando…", "Sincronitzant…"],
    syErr: ["Can't reach the sync server right now; everything is safe on this device.", "暂时连不上同步服务器；所有内容都安全地留在这台设备上。", "暫時連不上同步伺服器；所有內容都安全地留在這台裝置上。", "Ahora no se puede llegar al servidor; todo está a salvo en este dispositivo.", "Ara no s'arriba al servidor; tot és a recer en aquest dispositiu."],
    syLocal: ["On this device only", "只在这台设备上", "只在這台裝置上", "Solo en este dispositivo", "Només en aquest dispositiu"],
    syTake: ["Take it to another device", "带到另一台设备", "帶到另一台裝置", "Llévalo a otro dispositivo", "Porta-ho a un altre dispositiu"],
    syTakeHow: ["Open this link on your other phone or computer. Anyone with it can see and change your words, so keep it to yourself.", "在你的另一部手机或电脑上打开这个链接。任何拿到它的人都能看到并修改你的词，所以请自己保管。", "在你的另一部手機或電腦上打開這個連結。任何拿到它的人都能看到並修改你的詞，所以請自己保管。", "Abre este enlace en tu otro móvil u ordenador. Quien lo tenga puede ver y cambiar tus palabras, así que guárdalo para ti.", "Obre aquest enllaç a l'altre mòbil o ordinador. Qui el tingui pot veure i canviar les teves paraules, així que guarda'l per a tu."],
    syCopy: ["Copy the link", "复制链接", "複製連結", "Copiar el enlace", "Copia l'enllaç"],
    syCopied: ["Link copied", "链接已复制", "連結已複製", "Enlace copiado", "Enllaç copiat"],
    syForget: ["Delete my words from the server", "从服务器删除我的词", "從伺服器刪除我的詞", "Borrar mis palabras del servidor", "Esborra les meves paraules del servidor"],
    syForgetQ: ["Delete everything kept online under this key? Your words stay on this device.", "删除这把钥匙在网上保存的全部内容？你的词仍留在这台设备上。", "刪除這把鑰匙在網上保存的全部內容？你的詞仍留在這台裝置上。", "¿Borrar todo lo guardado en línea con esta llave? Tus palabras se quedan en este dispositivo.", "Vols esborrar tot el que hi ha en línia amb aquesta clau? Les paraules es queden en aquest dispositiu."],
    syForgot: ["Deleted from the server", "已从服务器删除", "已從伺服器刪除", "Borrado del servidor", "Esborrat del servidor"],
    syAdopted: ["This device now uses your keychain", "这台设备现在用你的钥匙串了", "這台裝置現在用你的鑰匙串了", "Este dispositivo ya usa tu llavero", "Aquest dispositiu ja fa servir el teu clauer"],
    syImp: ["Kept on this device and synced with your other devices.", "保存在这台设备上，并与你的其他设备同步。", "保存在這台裝置上，並與你的其他裝置同步。", "Se guarda en este dispositivo y se sincroniza con tus otros dispositivos.", "Es desa en aquest dispositiu i se sincronitza amb els altres."],
    micT: ["Say it yourself", "你自己说说看", "你自己說說看", "Dilo tú", "Digues-ho tu"],
    micGo: ["Record", "录音", "錄音", "Grabar", "Grava"],
    micStop: ["Stop", "停止", "停止", "Parar", "Para"],
    micYou: ["You", "你的", "你的", "Tú", "Tu"],
    micModel: ["Model", "示范", "示範", "Modelo", "Model"],
    micAgain: ["Again", "再来", "再來", "Otra vez", "Un altre cop"],
    micHow: ["Listen, say it, then hear yourself next to the model. The recording stays in this page and is gone when you close it.", "先听，再说，然后把你的录音和示范放在一起听。录音只留在这个页面里，关掉就没了。", "先聽，再說，然後把你的錄音和示範放在一起聽。錄音只留在這個頁面裡，關掉就沒了。", "Escucha, dilo y luego óyete junto al modelo. La grabación se queda en esta página y desaparece al cerrarla.", "Escolta, digues-ho i després escolta't al costat del model. La gravació es queda en aquesta pàgina i desapareix en tancar-la."],
    micNo: ["This browser can't record here (or the microphone is off).", "这个浏览器在这里无法录音（或麦克风没开）。", "這個瀏覽器在這裡無法錄音（或麥克風沒開）。", "Este navegador no puede grabar aquí (o el micrófono está apagado).", "Aquest navegador no pot gravar aquí (o el micròfon està apagat)."],
    micRec: ["Listening… tap Stop when you're done", "正在听…说完点停止", "正在聽…說完點停止", "Escuchando… pulsa Parar al terminar", "Escoltant… prem Para quan acabis"],
    vApprox: ["≈ approximate voice", "≈ 近似发音", "≈ 近似發音", "≈ voz aproximada", "≈ veu aproximada"]
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
  function note(msg, ms) {
    var el = document.querySelector(".vk-note"); if (!el) { el = document.createElement("div"); el.className = "vk-note"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove("on"); }, ms || 2600);
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
    q(".vk-file span").textContent = t("impFile"); q(".vk-local").textContent = syncing() ? "☁ " + t("syImp") : "🔒 " + t("impLocal"); q(".vk-x").textContent = t("impCancel");
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

  /* ---------- sync: your own words and how well you know each card, on every device ----------
     A key made on this device (vk_key; take it elsewhere with /vocab/#vk=KEY). The server sees only sha256("vocab:" + key).
     A room hands over two collections:  VK.sync({ room, words: () => [{ id, … }], setWords: arr => …, meta: () => ({ key: {…} }), setMeta: obj => …, refresh: () => … })
     Changes are found by comparing each entry with what was last synced (vk_sync_<room>), so the room only has to keep its own store. */
  var API = [ls("vk_api")].filter(function (x) { return /^http:\/\/localhost:\d+$/.test(x || ""); }).concat(["https://vocab.wei-meng.org", "https://vocab-api.enzowmeng.workers.dev"]), A = null;   /* vk_api: a local test server only */
  var KEYA = "abcdefghijkmnpqrstuvwxyz23456789";
  function newKey() { var b = new Uint8Array(26), k = ""; try { crypto.getRandomValues(b); } catch (e) { for (var i = 0; i < 26; i++) b[i] = Math.random() * 256; } for (var j = 0; j < 26; j++) k += KEYA[b[j] % 32]; return k; }
  function vkKey() { var k = ls("vk_key"); if (!k || !/^[a-z2-9]{20,40}$/.test(k)) { k = newKey(); ls("vk_key", k); } return k; }
  function syncing() { return ls("vk_sync") === "1"; }
  var UID = null;
  function uid() {
    if (UID) return Promise.resolve(UID);
    var data = new TextEncoder().encode("vocab:" + vkKey());
    return crypto.subtle.digest("SHA-256", data).then(function (h) { UID = [].map.call(new Uint8Array(h), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); return UID; });
  }
  /* a keychain link: /vocab/#vk=KEY (from ☁ → Take it to another device) */
  (function adopt() {
    var mm = /[#&]vk=([a-z2-9]{20,40})/.exec(location.hash); if (!mm) return;
    var cur = ls("vk_key");
    if (cur !== mm[1]) { if (cur) { var old = []; try { old = JSON.parse(ls("vk_keys_old") || "[]"); } catch (e) {} old.push(cur); ls("vk_keys_old", JSON.stringify(old.slice(-5))); }
      ls("vk_key", mm[1]); ROOMS.forEach(function (r) { try { localStorage.removeItem("vk_sync_" + r); } catch (e) {} }); }
    ls("vk_sync", "1"); ls("vk_adopted", "1");
    try { history.replaceState(history.state, "", location.pathname + location.search + "#all"); } catch (e) {}
  })();
  function hash(x) { var h = 2166136261; for (var i = 0; i < x.length; i++) { h ^= x.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + x.length.toString(36); }
  function post(path, body) {
    var list = A ? [A].concat(API.filter(function (a) { return a !== A; })) : API.slice();
    function tryOne(i) {
      if (i >= list.length) return Promise.reject(new Error("offline"));
      var ctl = window.AbortController ? new AbortController() : null, tm = ctl && setTimeout(function () { ctl.abort(); }, 15000);
      return fetch(list[i] + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl && ctl.signal, credentials: "omit" })
        .then(function (r) { if (tm) clearTimeout(tm); if (!r.ok) throw new Error("http " + r.status); A = list[i]; return r.json(); })
        .catch(function (e) { if (tm) clearTimeout(tm); return tryOne(i + 1); });
    }
    return tryOne(0);
  }
  var SY = null, busy = false, again = false, lastAt = 0, lastErr = false;
  function stateOf(r) { var x = null; try { x = JSON.parse(ls("vk_sync_" + r) || "null"); } catch (e) {} return x && x.h ? x : { since: 0, h: { w: {}, m: {} } }; }
  function diff(cur, seen, out) { var ids = {};
    for (var id in cur) { ids[id] = 1; var j = JSON.stringify(cur[id]), hh = hash(j); if (seen[id] !== hh) out.push({ id: id, d: j, h: hh }); }
    for (var k in seen) if (!ids[k]) out.push({ id: k, d: null, h: null });
    return out; }
  function run() {
    if (!SY || !syncing()) return Promise.resolve();
    if (busy) { again = true; return Promise.resolve(); }
    busy = true; paint();
    var st = stateOf(SY.room), wl = {}, ml = SY.meta ? SY.meta() || {} : {};
    (SY.words ? SY.words() || [] : []).forEach(function (w) { if (w && w.id != null) wl[String(w.id)] = w; });
    var dw = diff(wl, st.h.w, []), dm = diff(ml, st.h.m, []);
    return consent().then(function (yes) { if (!yes) { ls("vk_sync", "0"); throw new Error("no"); } return uid(); }).then(function (u) {
      function round(first) {
        var body = { u: u, r: SY.room, since: st.since, w: first ? dw.map(function (e) { return { id: e.id, d: e.d }; }) : [], m: first ? dm.map(function (e) { return { id: e.id, d: e.d }; }) : [] };
        return post("/v1/sync", body).then(function (res) {
          if (first) { dw.forEach(function (e) { if (e.h) st.h.w[e.id] = e.h; else delete st.h.w[e.id]; }); dm.forEach(function (e) { if (e.h) st.h.m[e.id] = e.h; else delete st.h.m[e.id]; }); }
          var gotW = res.w || [], gotM = res.m || [];
          if (gotW.length && SY.setWords) { gotW.forEach(function (e) { if (e.d == null) { delete wl[e.id]; delete st.h.w[e.id]; } else { try { wl[e.id] = JSON.parse(e.d); st.h.w[e.id] = hash(e.d); } catch (x) {} } });
            SY.setWords(Object.keys(wl).map(function (k) { return wl[k]; })); }
          if (gotM.length && SY.setMeta) { gotM.forEach(function (e) { if (e.d == null) { delete ml[e.id]; delete st.h.m[e.id]; } else { try { ml[e.id] = JSON.parse(e.d); st.h.m[e.id] = hash(e.d); } catch (x) {} } });
            SY.setMeta(ml); }
          st.since = res.now || st.since; ls("vk_sync_" + SY.room, JSON.stringify(st));
          if ((gotW.length || gotM.length) && SY.refresh) try { SY.refresh(); } catch (x) {}
          if (res.more) return round(false);
        });
      }
      return round(true);
    }).then(function () { lastAt = Date.now(); lastErr = false; }, function () { lastErr = true; })
      .then(function () { busy = false; paint(); if (again) { again = false; setTimeout(run, 300); } });
  }
  function startSync(o) {
    SY = o; cloudBtn();
    if (ls("vk_adopted")) { try { localStorage.removeItem("vk_adopted"); } catch (e) {} setTimeout(function () { note(t("syAdopted"), 3200); }, 600); }
    setTimeout(run, 900);
    setInterval(function () { if (!document.hidden) run(); }, 30000);
    document.addEventListener("visibilitychange", function () { if (document.hidden) run(); else setTimeout(run, 400); });
    window.addEventListener("pagehide", function () { run(); });
  }
  function consent() {
    var F = window.FBC, d = F && F.DATA && F.DATA.filter(function (x) { return x.k === "words"; })[0];
    return d && F.ask ? F.ask(d) : Promise.resolve(true);
  }
  var ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H7a5 5 0 1 1 1.6-9.7A6 6 0 0 1 20 11a4 4 0 0 1-2.5 8z"/><path d="M9 14l2 2 4-4"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H7a5 5 0 1 1 1.6-9.7A6 6 0 0 1 20 11a4 4 0 0 1-2.5 8z"/></svg>';
  function cloudBtn() {
    if (document.querySelector("[data-vk=cloud]")) return paint();
    var g = document.querySelector('[data-vk="lang"]'); if (!g) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cloudBtn); return; }
    var b = document.createElement("button"); b.type = "button"; b.className = "icon-btn vk-cloud"; b.setAttribute("data-vk", "cloud");
    g.parentNode.insertBefore(b, g); paint();
  }
  function paint() {
    var b = document.querySelector("[data-vk=cloud]"); if (!b) return;
    var on = syncing(); b.innerHTML = on ? ICON_ON : ICON_OFF; b.classList.toggle("on", on); b.classList.toggle("busy", busy); b.classList.toggle("err", on && lastErr);
    b.title = b.getAttribute("aria-label") || ""; b.setAttribute("aria-label", t("syTitle") + " · " + (on ? (lastErr ? t("syErr") : busy ? t("syIng") : t("syNow")) : t("syLocal")));
    var st = document.querySelector(".vk-sync .vk-st"); if (st) st.textContent = statusText();
  }
  function statusText() {
    if (!syncing()) return t("syLocal"); if (busy) return t("syIng"); if (lastErr) return t("syErr");
    if (!lastAt) return ""; if (Date.now() - lastAt < 60000) return t("syNow");
    var d = new Date(lastAt); return fmt("syAt", { t: ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) });
  }
  function cloudSheet() {
    if (document.querySelector(".vk-dim")) return;
    var opener = document.activeElement;
    var dim = document.createElement("div"); dim.className = "vk-dim"; dim.setAttribute("data-vk-keep", "");
    var s = document.createElement("div"); s.className = "vk-sheet vk-sync"; s.setAttribute("role", "dialog"); s.setAttribute("aria-modal", "true"); s.setAttribute("aria-label", t("syTitle"));
    function draw() {
      var on = syncing();
      s.innerHTML = '<h2></h2><p class="vk-how"></p><p class="vk-st" aria-live="polite"></p><button type="button" class="vk-tog"></button>' +
        (on ? '<details class="vk-take"><summary></summary><p class="vk-how2"></p><div class="vk-row"><input readonly class="vk-link"><button type="button" class="vk-copy"></button></div></details><button type="button" class="vk-forget"></button>' : '') +
        '<button type="button" class="vk-x"></button>';
      var q = function (x) { return s.querySelector(x); };
      q("h2").textContent = t("syTitle"); q(".vk-how").textContent = t("syWhat"); q(".vk-st").textContent = statusText();
      q(".vk-tog").textContent = on ? t("syOff") : "☁ " + t("syOn"); q(".vk-tog").classList.toggle("vk-go", !on);
      q(".vk-x").textContent = t("close"); q(".vk-x").onclick = close;
      q(".vk-tog").onclick = function () {
        if (on) { ls("vk_sync", "0"); paint(); draw(); return; }
        consent().then(function (yes) { if (!yes) return; ls("vk_sync", "1"); paint(); draw(); run().then(draw); });
      };
      if (on) {
        q(".vk-take summary").textContent = t("syTake"); q(".vk-how2").textContent = t("syTakeHow");
        var link = location.origin + "/vocab/#vk=" + vkKey(); q(".vk-link").value = link;
        q(".vk-copy").textContent = t("syCopy");
        q(".vk-copy").onclick = function () { var done = function () { note(t("syCopied")); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, function () { q(".vk-link").select(); }); else { q(".vk-link").select(); try { document.execCommand("copy"); done(); } catch (e) {} } };
        q(".vk-forget").textContent = t("syForget");
        q(".vk-forget").onclick = function () { if (!window.confirm(t("syForgetQ"))) return; uid().then(function (u) { return post("/v1/forget", { u: u }); }).then(function () {
          ls("vk_sync", "0"); ROOMS.forEach(function (r) { try { localStorage.removeItem("vk_sync_" + r); } catch (e) {} }); note(t("syForgot")); paint(); draw(); }, function () { note(t("syErr"), 3600); }); };
      }
    }
    draw();
    function close() { dim.remove(); document.removeEventListener("keydown", key, true); if (opener && opener.focus) opener.focus(); }
    function key(e) { if (e.key === "Escape") { e.preventDefault(); close(); } }
    dim.addEventListener("click", function (e) { if (e.target === dim) close(); });
    document.addEventListener("keydown", key, true);
    dim.appendChild(s); document.body.appendChild(dim); var f = s.querySelector(".vk-tog"); if (f) f.focus();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-vk=cloud]"); if (!b) return; e.preventDefault(); e.stopPropagation(); cloudSheet();
  }, true);

  /* ---------- pronunciation: the device's own voices (works offline when the voice is installed), and record-yourself ----------
     VK.say(text, { lang: "cy", rate, say }) → "native" | "approx" | "none".  Welsh, rarely installed, falls back to a
     Spanish voice reading a Welsh-to-Spanish respelling (pure vowels, ch → j, dd → d, th → z), then to an English voice reading the "say" respelling. */
  function allVoices() { try { return (window.speechSynthesis && speechSynthesis.getVoices()) || []; } catch (e) { return []; } }
  function voiceFor(re) { var vs = allVoices().filter(function (v) { return re.test(v.lang || ""); }); vs.sort(function (a, b) { return (b.localService ? 1 : 0) - (a.localService ? 1 : 0); }); return vs[0] || null; }
  if (window.speechSynthesis) try { speechSynthesis.getVoices(); speechSynthesis.addEventListener("voiceschanged", function () {}); } catch (e) {}
  var VMAP = { "â": "a", "ê": "e", "î": "i", "ô": "o", "û": "i", "ŵ": "w", "ŷ": "i", "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "i", "ẃ": "w", "ý": "i", "ä": "a", "ë": "e", "ï": "i", "ö": "o", "ü": "i", "ẅ": "w", "ÿ": "i" };
  function cyToEs(text) {
    return String(text).toLowerCase().replace(/[’']/g, "").split(/(\s+|[.,!?;:…—–-]+)/).map(function (w) {
      if (!/[a-zâêîôûŵŷ]/.test(w)) return w;
      w = w.replace(/[âêîôûŵŷáéíóúẃýäëïöüẅÿ]/g, function (c) { return VMAP[c] || c; });
      var syl = (w.match(/[aeiouwy]+/g) || []).length;
      w = w.replace(/ll/g, "\u0001").replace(/ch/g, "\u0002").replace(/dd/g, "\u0003").replace(/th/g, "\u0004").replace(/ff/g, "\u0005").replace(/ph/g, "\u0005").replace(/rh/g, "r").replace(/ng/g, "\u0006")
        .replace(/si(?=[aeiouwy])/g, "\u0007")
        .replace(/wy/g, "\u000bi").replace(/aw/g, "a\u000b").replace(/ew/g, "e\u000b").replace(/[iuy]w/g, "i\u000b").replace(/ow/g, "o\u000b")
        .replace(/a[eiu]/g, "ai").replace(/e[iu]/g, "ei").replace(/o[eiu]/g, "oi")
        .replace(/w/g, "\u000b").replace(/u/g, "i")
        .replace(/y/g, function (m, i, all) { return syl > 1 && all.slice(i + 1).match(/[aeiou\u000b]/) ? "e" : "i"; })
        .replace(/j/g, "y").replace(/f/g, "b").replace(/c/g, "k").replace(/g(?=[ei])/g, "gu").replace(/h/g, "")
        .replace(/\u0001/g, "jl").replace(/\u0002/g, "j").replace(/\u0003/g, "d").replace(/\u0004/g, "z").replace(/\u0005/g, "f").replace(/\u0006/g, "ng").replace(/\u0007/g, "ch").replace(/\u000b/g, "u");
      /* Welsh stress is on the last-but-one syllable: Spanish needs an accent when the word ends in a consonant other than n or s */
      var groups = []; w.replace(/([^aeiou]|^)i(?=[aeo])|[aeiou]+/g, function (m, p1, i) { if (typeof p1 === "string") { if (!groups.length) groups.push(i + p1.length); } else groups.push(arguments[arguments.length - 2]); return m; });
      if (groups.length >= 2 && /[^aeiouns]$/.test(w)) { var at = groups[groups.length - 2], ch = at; w = w.slice(0, ch) + ({ a: "á", e: "é", i: "í", o: "ó", u: "ú" })[w[ch]] + w.slice(ch + 1); }
      return w;
    }).join("");
  }
  var LANG_RE = { cy: /^cy/i, ca: /^ca/i, es: /^es/i, yue: /^(zh[-_]HK|yue)/i, zh: /^(zh[-_](CN|Hans|SG)|cmn)/i, "zh-TW": /^zh[-_]TW/i, en: /^en/i };
  function say(text, o) {
    o = o || {}; if (!window.speechSynthesis || !text) return "none";
    var lang = o.lang || "en", v = voiceFor(LANG_RE[lang] || new RegExp("^" + lang, "i")), how = "native", spoken = text;
    if (!v && lang === "cy") { v = voiceFor(/^es[-_]ES/i) || voiceFor(/^es/i); if (v) { spoken = cyToEs(text); how = "approx"; }
      else if (o.say) { v = voiceFor(/^en[-_]GB/i) || voiceFor(/^en/i); if (v) { spoken = String(o.say).replace(/[\/]/g, " ").replace(/-/g, " ").toLowerCase(); how = "approx"; } } }
    if (!v) return "none";
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(spoken); u.voice = v; u.lang = v.lang; u.rate = (o.rate || .9) * (how === "approx" ? .9 : 1); speechSynthesis.speak(u); } catch (e) { return "none"; }
    return how;
  }
  function hasVoice(lang) { return !!voiceFor(LANG_RE[lang] || new RegExp("^" + lang, "i")); }

  /* record yourself: nothing is uploaded; the clip lives in this page until it closes */
  function mic(text, speakFn) {
    if (document.querySelector(".vk-dim")) return;
    var opener = document.activeElement, rec = null, chunks = [], url = null, stream = null, timer = null, audio = null;
    var dim = document.createElement("div"); dim.className = "vk-dim"; dim.setAttribute("data-vk-keep", "");
    var s = document.createElement("div"); s.className = "vk-sheet vk-mic"; s.setAttribute("role", "dialog"); s.setAttribute("aria-modal", "true"); s.setAttribute("aria-label", t("micT"));
    s.innerHTML = '<h2></h2><p class="vk-word"></p><p class="vk-how"></p><div class="vk-row vk-microw"><button type="button" class="vk-model"></button><button type="button" class="vk-rec vk-go"></button><button type="button" class="vk-you" disabled></button></div><p class="vk-st" aria-live="polite"></p><button type="button" class="vk-x"></button>';
    var q = function (x) { return s.querySelector(x); };
    q("h2").textContent = t("micT"); q(".vk-word").textContent = text; q(".vk-how").textContent = t("micHow");
    q(".vk-model").textContent = "🔊 " + t("micModel"); q(".vk-rec").textContent = "🎙 " + t("micGo"); q(".vk-you").textContent = "▶ " + t("micYou"); q(".vk-x").textContent = t("close");
    q(".vk-model").onclick = function () { speakFn(); };
    function stopAll() { clearTimeout(timer); try { if (rec && rec.state === "recording") rec.stop(); } catch (e) {} if (stream) stream.getTracks().forEach(function (tr) { tr.stop(); }); stream = null; }
    q(".vk-rec").onclick = function () {
      if (rec && rec.state === "recording") { stopAll(); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { q(".vk-st").textContent = t("micNo"); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) {
        stream = st; chunks = []; rec = new MediaRecorder(st);
        rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        rec.onstop = function () { if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/webm" })); q(".vk-you").disabled = false; q(".vk-rec").textContent = "🎙 " + t("micAgain"); q(".vk-st").textContent = "";
          playYou(function () { setTimeout(speakFn, 250); }); };
        rec.start(); q(".vk-rec").textContent = "■ " + t("micStop"); q(".vk-st").textContent = t("micRec");
        timer = setTimeout(stopAll, 6000);
      }, function () { q(".vk-st").textContent = t("micNo"); });
    };
    function playYou(then) { if (!url) return; try { if (audio) audio.pause(); audio = new Audio(url); audio.onended = then || null; audio.play(); } catch (e) {} }
    q(".vk-you").onclick = function () { playYou(); };
    function close() { stopAll(); if (audio) try { audio.pause(); } catch (e) {} if (url) URL.revokeObjectURL(url); dim.remove(); document.removeEventListener("keydown", key, true); if (opener && opener.focus) opener.focus(); }
    function key(e) { if (e.key === "Escape") { e.preventDefault(); close(); } }
    q(".vk-x").onclick = close; dim.addEventListener("click", function (e) { if (e.target === dim) close(); });
    document.addEventListener("keydown", key, true);
    dim.appendChild(s); document.body.appendChild(dim); q(".vk-rec").focus();
  }
  /* rooms put <button data-vk="mic"> next to their 🔊 and set VK.micNow = function () { return { text, speak } } */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-vk=mic]"); if (!b || !window.VK || !VK.micNow) return;
    e.preventDefault(); e.stopPropagation(); var x = VK.micNow(); if (x && x.text) mic(x.text, x.speak || function () {});
  }, true);

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

  window.VK = { say: say, hasVoice: hasVoice, cyToEs: cyToEs, mic: mic, sync: startSync, syncNow: function () { return run(); }, syncing: syncing, importList: importList, parseList: parseList, note: note, room: room, LANGS: LANGS, code: code, idx: idx, t: t, W: W, sheet: sheet, ui: ui, tr: tr, locale: locale };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paintButtons); else paintButtons();
})();
