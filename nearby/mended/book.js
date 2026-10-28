/* Kintsugi Studio — the Book.
   Every visitor's mended piece, with the name they sign it with, in one book anyone can leaf through.
   No account: this device keeps a random key (shared by all FREE//BUILDER games on this site); the database keeps
   only a one-way fingerprint of it, which lets you take your own page out again.
   The name comes from the nickname you've used in any game here, and is remembered for the next one. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var cfg = { url: "", key: "" }, mine = {}, pages = [], done = false, loading = false, at = 0;
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function key(create) {
    var k = ls("fb_device_key");
    if (!k && create) { var a = new Uint8Array(32); crypto.getRandomValues(a); k = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); ls("fb_device_key", k); }
    return k;
  }
  function nick() { return (ls("fb_nick") || "").trim(); }
  window.KS_MAKER = function () { var i = $("#ksName"); return (i && i.value.trim()) || nick(); };
  function rest(path, opt) {
    opt = opt || {};
    return fetch(cfg.url + "/rest/v1/" + path, { method: opt.method || "GET", headers: { apikey: cfg.key, Authorization: "Bearer " + cfg.key, "Content-Type": "application/json" }, body: opt.body ? JSON.stringify(opt.body) : undefined })
      .then(function (r) { return r.text().then(function (x) { var j = null; try { j = x ? JSON.parse(x) : null; } catch (e) {} if (!r.ok) throw new Error((j && (j.message || j.hint)) || ("HTTP " + r.status)); return j; }); });
  }
  function rpc(fn, args) { return rest("rpc/" + fn, { method: "POST", body: args }); }

  /* ---------- look ---------- */
  var css = ".ks-sign{display:flex;align-items:center;gap:8px;margin-top:8px}.ks-sign input{flex:1;min-width:0;background:#1f150e;border:1px solid #5a4330;border-radius:8px;padding:6px 10px;color:#f3e6cf;font:600 13px 'Plus Jakarta Sans',system-ui,sans-serif}" +
    ".ks-sign input:focus{outline:none;border-color:#e6b23a}.ks-add{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;border:1px solid #fef08a;background:linear-gradient(135deg,#f5d682,#c6922c 50%,#fbe49e);color:#1c1108;font:700 12px 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer;white-space:nowrap}.ks-add:disabled{opacity:.6}" +
    ".ks-open{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:12px;border:1px solid rgba(230,178,58,.5);background:#2a1c12;color:#f3e6cf;font:600 12px 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer}" +
    ".ks-book{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:16px;background:rgba(8,5,3,.86);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}" +
    ".ks-spread{position:relative;display:grid;grid-template-columns:1fr 1fr;width:min(980px,100%);aspect-ratio:1.5;max-height:86vh;background:#3a2414;border-radius:10px;padding:12px;box-shadow:0 40px 100px -30px #000}" +
    ".ks-page{position:relative;background:linear-gradient(90deg,#efe4cc,#f7efdd 12%,#f7efdd 88%,#eadcc0);padding:5% 6% 4%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;overflow:hidden;color:#2a1a10}" +
    ".ks-page:first-child{border-radius:4px 0 0 4px;box-shadow:inset -18px 0 24px -18px rgba(0,0,0,.4)}.ks-page:last-child{border-radius:0 4px 4px 0;box-shadow:inset 18px 0 24px -18px rgba(0,0,0,.4)}" +
    ".ks-page img{max-width:100%;max-height:72%;object-fit:contain;border-radius:3px;box-shadow:0 10px 24px -14px rgba(0,0,0,.6)}" +
    ".ks-page b{font:600 clamp(15px,2.2vw,22px)/1.2 'Cormorant Garamond',Georgia,'Songti SC',serif;text-align:center}.ks-page i{font:italic 500 clamp(13px,1.8vw,17px)/1.2 'Cormorant Garamond',Georgia,serif;color:#6b4426}.ks-page small{font:11px 'JetBrains Mono',monospace;color:#8a6a48}" +
    ".ks-page .blank{font:400 64px 'Noto Serif JP','Songti SC',serif;color:rgba(160,120,60,.18)}.ks-page .n{position:absolute;bottom:10px;font:11px 'JetBrains Mono',monospace;color:#a08060}" +
    ".ks-page .rm{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;border:1px solid rgba(42,26,16,.25);background:rgba(255,255,255,.4);color:#7a2a1a;cursor:pointer}" +
    ".ks-nav{position:absolute;top:50%;width:48px;height:48px;margin-top:-24px;border-radius:50%;border:1px solid rgba(230,178,58,.5);background:#1f150e;color:#f5d682;font-size:20px;cursor:pointer}.ks-nav:disabled{opacity:.25;cursor:default}.ks-prev{left:-24px}.ks-next{right:-24px}" +
    ".ks-x{position:absolute;top:-14px;right:-14px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(230,178,58,.5);background:#1f150e;color:#f3e6cf;font-size:20px;cursor:pointer;z-index:2}" +
    ".ks-turn{animation:ksTurn .45s ease}@keyframes ksTurn{from{opacity:.2;transform:perspective(900px) rotateY(-8deg)}}" +
    "@media (max-width:700px){.ks-spread{grid-template-columns:1fr;aspect-ratio:.72}.ks-page:last-child{display:none}.ks-page:first-child{border-radius:4px}.ks-prev{left:4px}.ks-next{right:4px}.ks-nav{top:auto;bottom:-60px}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- the signature and the button, on the finished piece ---------- */
  function mount() {
    var ov = $("#inspectionOverlay"), ti = $("#customPieceTitleInput");
    if (ov && ti && !$("#ksName")) {
      var row = document.createElement("div"); row.className = "ks-sign";
      row.innerHTML = '<input id="ksName" maxlength="32" autocomplete="nickname" aria-label="Your name" placeholder="Your name"><button type="button" class="ks-add" id="ksAdd"><span aria-hidden="true">📖</span><span>Add to the book</span></button>';
      ti.closest(".flex").parentNode.appendChild(row);
      $("#ksName").value = nick();
      $("#ksName").addEventListener("change", function () { var v = this.value.trim(); if (v) ls("fb_nick", v.slice(0, 32)); });
      $("#ksAdd").addEventListener("click", add);
    }
    var shelf = document.querySelector('[onclick="openTeaRoomModal()"]');
    if (shelf && !$("#ksOpen")) { var b = document.createElement("button"); b.type = "button"; b.id = "ksOpen"; b.className = "ks-open"; b.innerHTML = '<span aria-hidden="true">📖</span><span>The Book</span>'; shelf.parentNode.insertBefore(b, shelf.nextSibling); b.addEventListener("click", function () { open(0); }); }
  }

  /* ---------- adding a page ---------- */
  function shrink(dataUrl) {
    return new Promise(function (res) {
      var im = new Image(); im.onload = function () {
        var w = 440, h = Math.round(im.height * w / im.width), c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(im, 0, 0, w, h);
        var q = 0.82, out = c.toDataURL("image/webp", q); if (out.indexOf("data:image/webp") !== 0) out = c.toDataURL("image/jpeg", 0.85);
        while (out.length > 150000 && q > 0.4) { q -= 0.1; out = c.toDataURL(out.indexOf("webp") > 0 ? "image/webp" : "image/jpeg", q); }
        res(out);
      }; im.src = dataUrl;
    });
  }
  function add() {
    var btn = $("#ksAdd"), name = $("#ksName").value.trim();
    if (!name) { $("#ksName").focus(); $("#ksName").style.borderColor = "#e0623a"; return; }
    if (!cfg.url) { flash("The book is out of reach right now."); return; }
    ls("fb_nick", name.slice(0, 32)); btn.disabled = true;
    try { if (!state.hankoStamped) stampHankoSeal(); } catch (e) {}
    var title = ($("#customPieceTitleInput").value || "").trim() || state.restoredTitle || "", vessel = state.currentVessel ? state.currentVessel.name : "", metal = "";
    try { metal = METAL_PALETTES[state.metalType].name; } catch (e) {}
    shrink(generateKeepsakeCardDataURL()).then(function (img) {
      return rpc("kintsugi_add", { p_secret: key(true), p_name: name, p_title: title, p_vessel: vessel, p_metal: metal, p_img: img });
    }).then(function (id) { try { window.dispatchEvent(new Event("ksbooked")); } catch (e) {} mine[id] = 1; pages = []; done = false; btn.disabled = false; btn.lastChild.textContent = "In the book ✓"; setTimeout(function () { btn.lastChild.textContent = "Add to the book"; }, 4000); open(0); })
      .catch(function (e) { btn.disabled = false; flash(/kept on this device/.test(String(e.message)) ? "You chose to keep things on this device." : /too many/.test(String(e.message)) ? "That's plenty for this hour." : "The book is out of reach right now."); });
  }
  function flash(m) { try { showToast(m); } catch (e) {} }

  /* ---------- reading ---------- */
  function more() {
    if (done || loading || !cfg.url) return Promise.resolve();
    loading = true;
    return rest("town_mended_book?select=id,name,title,vessel,metal,img,created_at&order=created_at.desc&limit=8&offset=" + pages.length)
      .then(function (rows) { rows = rows || []; pages = pages.concat(rows); if (rows.length < 8) done = true; loading = false; })
      .catch(function () { loading = false; done = true; });
  }
  function mineIds() { var k = key(false); if (!k || !cfg.url) return Promise.resolve(); return rpc("kintsugi_mine", { p_secret: k }).then(function (ids) { (ids || []).forEach(function (r) { mine[typeof r === "string" ? r : r.kintsugi_mine] = 1; }); }).catch(function () {}); }
  var box = null;
  function open(start) {
    at = start || 0; close();
    box = document.createElement("div"); box.className = "ks-book"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "The Book");
    box.innerHTML = '<div class="ks-spread"><button class="ks-x" type="button" aria-label="Close">×</button><div class="ks-page"></div><div class="ks-page"></div><button class="ks-nav ks-prev" type="button" aria-label="Previous">←</button><button class="ks-nav ks-next" type="button" aria-label="Next">→</button></div>';
    document.body.appendChild(box);
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.closest(".ks-x")) return close();
      if (e.target.closest(".ks-prev")) turn(-1); if (e.target.closest(".ks-next")) turn(1);
      var rm = e.target.closest(".rm"); if (rm) { if (!rm.dataset.armed) { rm.dataset.armed = 1; rm.textContent = "?"; return; } rpc("kintsugi_hide", { p_secret: key(false), p_id: rm.dataset.id }).then(function () { pages = pages.filter(function (p) { return p.id !== rm.dataset.id; }); paint(); }).catch(function () {}); }
    });
    var sx = null; box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true }); box.addEventListener("touchend", function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1); sx = null; });
    paint(); Promise.all([more(), mineIds()]).then(paint);
  }
  function per() { return innerWidth <= 700 ? 1 : 2; }
  function turn(d) { var n = per(), next = at + d * n; if (next < 0) return; if (next >= pages.length && done) return; at = next; if (at + n * 2 > pages.length) more().then(paint); paint(true); }
  function page(el, p, i) {
    if (!p) { el.innerHTML = '<span class="blank" aria-hidden="true">金</span>' + (i === 0 && !pages.length ? '<i>' + (loading ? "…" : "") + "</i>" : ""); return; }
    var d = ""; try { d = new Date(p.created_at).toLocaleDateString(document.documentElement.lang || undefined, { year: "numeric", month: "short", day: "numeric" }); } catch (e) {}
    el.innerHTML = (mine[p.id] ? '<button class="rm" type="button" data-id="' + esc(p.id) + '" aria-label="Take my page out">×</button>' : "") + '<img alt="' + esc(p.title || "") + '" src="' + esc(p.img) + '"><b>' + esc(p.title ? "“" + p.title + "”" : "") + "</b><i>— " + esc(p.name) + '</i><small>' + esc(d) + '</small><span class="n">' + (i + 1) + "</span>";
  }
  function paint(anim) {
    if (!box) return; var ps = box.querySelectorAll(".ks-page"), n = per();
    for (var k = 0; k < ps.length; k++) { page(ps[k], pages[at + k], at + k); if (anim) { ps[k].classList.remove("ks-turn"); void ps[k].offsetWidth; ps[k].classList.add("ks-turn"); } }
    box.querySelector(".ks-prev").disabled = at === 0; box.querySelector(".ks-next").disabled = done && at + n >= pages.length;
  }
  function close() { if (box) box.remove(); box = null; }
  addEventListener("keydown", function (e) { if (!box) return; if (e.key === "Escape") close(); if (e.key === "ArrowRight") turn(1); if (e.key === "ArrowLeft") turn(-1); });

  /* ---------- start ---------- */
  var sc = document.createElement("script"); sc.src = "/config.js"; sc.onload = function () { var c = window.FB_SUPABASE || {}; cfg.url = c.url || ""; cfg.key = c.anonKey || ""; }; document.head.appendChild(sc);
  if (document.readyState === "complete") mount(); else addEventListener("load", mount);
})();
