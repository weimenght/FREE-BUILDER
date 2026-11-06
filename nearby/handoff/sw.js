// Handoff moved to after-hours.work/handoff/ (Nov 6). This worker stays at the old address so a phone that installed Handoff here
// still shows a notification that reaches it, and a tap opens the new address. Pages are left to the network: freebuilder.net's 404 page
// forwards them, with this device's own settings (not the sign-in).
const NEW = 'https://www.after-hours.work/handoff/';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.clients.claim()));
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
    event.waitUntil(self.clients.openWindow(NEW));
});
