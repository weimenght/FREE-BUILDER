/* this app lives on www.after-hours.work: the old worker lets itself go, so nothing here is served from a cache again */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.registration.unregister()); });
