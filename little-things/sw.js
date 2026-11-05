/* Little Things: only Popo's daily nudge. Registered only when the visitor turns the nudge on. It caches nothing and
   never touches the page's requests: it shows the one line the push brings and opens the app when tapped. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var m = {}; try { m = e.data ? e.data.json() : {}; } catch (x) { m = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(m.title || "Popo", {
    body: m.body || "", tag: m.tag || "lt-nudge", renotify: false, silent: false,
    icon: "/little-things/icon-192.png", badge: "/little-things/icon-192.png", data: { url: m.url || "/little-things/" }
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/little-things/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) if (cs[i].url.indexOf("/little-things/") >= 0 && "focus" in cs[i]) return cs[i].focus();
    return self.clients.openWindow(url);
  }));
});
