/* Little Things: only Popo's daily nudge, and Paw Reading's morning card (the same worker, registered by /paw-reading/ at
   its own scope /little-things/paw/ so it has its own subscription). Registered only when the visitor turns one on. It caches
   nothing and never touches the page's requests: it shows the one line the push brings and opens that app when tapped. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var m = {}; try { m = e.data ? e.data.json() : {}; } catch (x) { m = { body: e.data ? e.data.text() : "" }; }
  var icon = /^\/[a-z-]+\/icon-192\.png$/.test(m.icon || "") ? m.icon : "/little-things/icon-192.png";
  e.waitUntil(self.registration.showNotification(m.title || "Popo", {
    body: m.body || "", tag: m.tag || "lt-nudge", renotify: false, silent: false,
    icon: icon, badge: icon, data: { url: /^\/[a-z-]+\/$/.test(m.url || "") ? m.url : "/little-things/" }
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/little-things/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) if (cs[i].url.indexOf(url) >= 0 && "focus" in cs[i]) return cs[i].focus();
    return self.clients.openWindow(url);
  }));
});
