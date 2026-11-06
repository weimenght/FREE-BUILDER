/* Walk With: works offline once opened. Keeps only what this app needs to draw itself (its own folder, the kit, the fonts),
   always asks the network first and falls back to the copy it kept. Never touches anything off the site; sends nothing. */
var V = "ww-1";
var OWN = /^\/(walk-with|fbkit|fonts)\//;
self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(["./", "./words.js?v=1", "./manifest.webmanifest", "./icon.svg", "./icon-192.png"]); }).catch(function () {}));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf("ww-") === 0 && k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || !OWN.test(u.pathname) || /\/sw\.js$/.test(u.pathname)) return;
  e.respondWith(fetch(r).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(V).then(function (c) { c.put(r, copy); }); }
    return res;
  }).catch(function () { return caches.match(r, { ignoreSearch: r.mode === "navigate" }).then(function (m) { return m || (r.mode === "navigate" ? caches.match("./") : Response.error()); }); }));
});
