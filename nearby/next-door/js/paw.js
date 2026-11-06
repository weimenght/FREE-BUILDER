/* Today's Paw Reading card in the cats' paws (the brief of Nov 6: what people do in the apps shows up in town, never counted).
   If this device drew a card today (fb_paw, shared by the stall in town and the Paw Reading app), whichever cat is on the counter
   keeps it under a paw; a tap says which card it is. Nothing is sent, nobody else sees it. */
(function () {
  var W = { k: ["Today's card, {c}. {n} is keeping it under a paw for you.", "今天的牌，{c}。{n}用爪子替你压着。", "今天的牌，{c}。{n}用爪子替你壓著。", "La carta de hoy, {c}. {n} te la guarda bajo la pata.", "La carta d'avui, {c}. {n} te la guarda sota la pota."],
    miso: ["Miso", "味噌", "味噌", "Miso", "La Miso"], yuzu: ["Yuzu", "柚子", "柚子", "Yuzu", "La Yuzu"], lab: ["Today's card", "今天的牌", "今天的牌", "La carta de hoy", "La carta d'avui"] };
  function li() { var l = (window.FBL && FBL.get && FBL.get()) || "en"; return Math.max(0, ["en", "zh", "zh-Hant", "es", "ca"].indexOf(l)); }
  function day() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function today() { try { var v = JSON.parse(localStorage.getItem("fb_paw") || "null"); return v && v.d === day() && v.i >= 0 && v.i < 54 ? v : null; } catch (e) { return null; } }
  var st = document.createElement("style"); st.textContent = ".nd-paw{position:absolute;left:58%;bottom:1px;width:15px;height:21px;padding:0;margin:0;border:1px solid #000;background:#fbf3e2;box-shadow:1px 1px 0 rgba(0,0,0,.6);transform:rotate(-14deg);z-index:3;cursor:pointer;overflow:hidden}.nd-paw img{display:block;width:100%;height:100%;object-fit:cover;image-rendering:auto}.nd-paw:focus-visible{outline:2px solid #f6b73c;outline-offset:2px}"; document.head.appendChild(st);
  var tag = null, PJS = false;
  function name(v, cb) { if (window.FBPaw) return cb(FBPaw.cardName(FBPaw.cardOf(v.i), li())); if (PJS) return; PJS = true; var sc = document.createElement("script"); sc.src = "/nearby/paw-reading/paw.js"; sc.onload = function () { PJS = false; if (window.FBPaw) cb(FBPaw.cardName(FBPaw.cardOf(v.i), li())); }; document.head.appendChild(sc); }
  function place() {
    var v = today(), who = null;
    if (v) ["yuzu", "miso"].some(function (id) {   /* Yuzu is drawn in front, so her paw first: nothing can cover the card */ var e = document.getElementById("cat-" + id); if (e && e.style.display !== "none" && e.offsetParent) { who = id; return true; } return false; });
    if (!v || !who) { if (tag) { tag.remove(); tag = null; } return; }
    var cat = document.getElementById("cat-" + who);
    if (!tag) { tag = document.createElement("button"); tag.type = "button"; tag.className = "nd-paw"; tag.setAttribute("data-fbt-skip", ""); tag.innerHTML = '<img alt="" src="/nearby/paw-reading/cards/' + (v.i < 10 ? "0" : "") + v.i + '.png">';
      tag.addEventListener("pointerdown", function (e) { e.stopPropagation(); }); tag.addEventListener("click", function (e) { e.stopPropagation(); e.preventDefault(); var w = tag.dataset.who; name(today() || v, function (c) { var tx = (W.k[li()] || W.k[0]).replace("{c}", c).replace("{n}", W[w][li()] || W[w][0]); try { if (window.FBG && FBG.note) FBG.note({ icon: "🔮", text: tx }); } catch (x) {} }); }); }
    tag.dataset.who = who; tag.setAttribute("aria-label", W.lab[li()] || W.lab[0]);
    if (tag.parentNode !== cat) cat.appendChild(tag);
  }
  setTimeout(place, 1200); setInterval(place, 4000); addEventListener("storage", function (e) { if (e.key === "fb_paw") place(); }); addEventListener("fbback", place);
})();
