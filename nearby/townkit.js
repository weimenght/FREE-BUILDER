/* A few things the newer places share (Front Row, Town Hall, Come Over): the language, the town's database through its
   functions, the device key hashed with the place (so nothing here links to what the device made elsewhere), the visitor's
   one name, a share sheet, the visitor's own maps, and the town's quiet notes. */
(function () {
  "use strict";
  var LI = { en: 0, zh: 1, "zh-Hant": 2, es: 3, ca: 4 };
  function lang() { return (window.FBL && FBL.get && FBL.get()) || "en"; }
  function L() { return LI[lang()] || 0; }
  function t(a, v) { var s = (a && (a[L()] || a[0])) || ""; if (v) for (var k in v) s = s.split("{" + k + "}").join(v[k]); return s; }
  function sb() { return new Promise(function (res) { if (window.FB_SUPABASE && FB_SUPABASE.url) return res(FB_SUPABASE); var sc = document.createElement("script"); sc.src = "/config.js"; sc.onload = sc.onerror = function () { res(window.FB_SUPABASE || {}); }; document.head.appendChild(sc); }); }
  function rpc(fn, body) {
    return sb().then(function (c) {
      if (!c.url) throw new Error("offline");
      return fetch(c.url + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: c.anonKey, Authorization: "Bearer " + c.anonKey, "Content-Type": "application/json" }, body: JSON.stringify(body || {}) })
        .then(function (r) { return r.text().then(function (x) { var j = null; try { j = x ? JSON.parse(x) : null; } catch (e) {} if (!r.ok) { var er = new Error((j && j.message) || "error"); er.rest = /rest:/.test((j && j.message) || ""); throw er; } return j; }); });
    });
  }
  var secrets = {};
  function secret(place) {
    if (secrets[place]) return secrets[place];
    var k = null; try { k = localStorage.getItem("fb_device_key"); } catch (e) {}
    if (!k) { var a = new Uint8Array(32); crypto.getRandomValues(a); k = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); try { localStorage.setItem("fb_device_key", k); } catch (e) {} }
    return (secrets[place] = crypto.subtle.digest("SHA-256", new TextEncoder().encode(place + ":" + k)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); }));
  }
  function nick() { try { return localStorage.getItem("fb_nick") || ""; } catch (e) { return ""; } }
  function setNick(n) { try { if (n && !localStorage.getItem("fb_nick")) localStorage.setItem("fb_nick", n.slice(0, 24)); } catch (e) {} }
  function note(text, icon) { try { if (window.FBG && FBG.note) { FBG.note({ icon: icon || "✦", text: text, now: true }); return; } } catch (e) {} }
  var COPIED = ["Link copied. Send it to them.", "链接已复制，发给 TA 吧。", "連結已複製，傳給 TA 吧。", "Enlace copiado. Envíaselo.", "Enllaç copiat. Envia-l'hi."];
  function share(title, text, url) {
    if (navigator.share) return navigator.share({ title: title, text: text, url: url }).catch(function () {});
    if (navigator.clipboard) return navigator.clipboard.writeText(text + " " + url).then(function () { note(t(COPIED), "↗"); }).catch(function () {});
  }
  function mapsUrl(q) {
    var ua = navigator.userAgent || "";
    if (/iPhone|iPad/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document)) return "https://maps.apple.com/?q=" + encodeURIComponent(q);
    if (/Android/.test(ua)) return "geo:0,0?q=" + encodeURIComponent(q);
    return "https://www.openstreetmap.org/search?query=" + encodeURIComponent(q);
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function placeName(k) { try { return window.FBWorld && FBWorld.name ? FBWorld.name(k) : k; } catch (e) { return k; } }
  function goPlace(k) { try { if (parent !== window && parent.FBShell) { parent.FBShell.open(FBWorld.url(k)); return; } } catch (e) {} location.href = FBWorld.url(k); }
  window.FBTown = { L: L, lang: lang, t: t, rpc: rpc, secret: secret, nick: nick, setNick: setNick, note: note, share: share, mapsUrl: mapsUrl, el: el, placeName: placeName, goPlace: goPlace };
})();
