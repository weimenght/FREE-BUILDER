// Handoff moved to /handoff/ (its own app). This worker stays at the old address so phones that installed Handoff
// here keep getting their notifications; any page it controls is sent on to the new address.
const NEW = '/handoff/';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || req.mode !== 'navigate') return;
    const u = new URL(req.url), rest = u.pathname.replace(/^\/(nearby\/handoff|game\/love)\/?/, '');
    event.respondWith(Response.redirect(new URL(NEW + rest + u.search + u.hash, u.origin).href, 302));
});

self.addEventListener('push', (event) => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch (e) { data = { title: 'Handoff', body: event.data ? event.data.text() : '' }; }
    event.waitUntil(self.registration.showNotification(data.title || 'Handoff', {
        body: data.body || '', tag: data.tag || 'handoff', renotify: true,
        icon: NEW + 'icon-192.png', badge: NEW + 'icon-192.png', data: { url: NEW }
    }));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil((async () => {
        const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const c of all) { if (new URL(c.url).pathname.indexOf(NEW) === 0) { await c.focus(); return; } }
        await self.clients.openWindow(NEW);
    })());
});
