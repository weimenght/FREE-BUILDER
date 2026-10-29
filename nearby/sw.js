/* Nearby's small helper: keeps what the town is made of close at hand, so walking from place to place is quick and a
   place you've been to still opens on a bad connection. It never touches anything that leaves this site (the database,
   the relay): only the town's own pages, its shared kit, fonts and drawings.
   - versioned kit (/fbkit/…?v=…), fonts, vendor files: kept, served from here (a new version is a new address)
   - pages of the town: not touched (straight to the network)
   - other files of the town (scripts, pictures without a version): served from here, refreshed in the background
   To retire it, ship a version whose activate step unregisters (see OFF). */
const V = 'nearby-2';
const OFF = false;
const KIT = V + '-kit', PAGES = V + '-pages', FILES = V + '-files';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.indexOf('nearby-') === 0 && (OFF || k.indexOf(V + '-') !== 0)).map((k) => caches.delete(k)));
    if (OFF) { await self.registration.unregister(); return; }
    await self.clients.claim();
  })());
});

async function trim(name, max) { const c = await caches.open(name), k = await c.keys(); for (let i = 0; i < k.length - max; i++) await c.delete(k[i]); }

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (OFF || req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return;                         /* the database, the relay, anything elsewhere: untouched */
  if (u.pathname.indexOf('/handoff/') === 0 || u.pathname.indexOf('/nearby/handoff/') === 0 || /\/sw\.js$/.test(u.pathname) || u.pathname === '/config.js') return;
  const page = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') >= 0;
  if (page) return;   /* pages go straight to the network (fast, always fresh); only the kit, fonts and drawings are kept */
  if (false) {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok && res.type === 'basic') { const c = await caches.open(PAGES); c.put(req, res.clone()); trim(PAGES, 60); }
        return res;
      } catch (e) {
        const hit = await caches.match(req, { ignoreSearch: true });
        if (hit) return hit;
        throw e;
      }
    })());
    return;
  }
  const kept = (/^\/(fbkit|fonts|vendor)\//.test(u.pathname) && (u.search.indexOf('v=') >= 0 || /^\/(fonts|vendor)\//.test(u.pathname)));
  if (kept) {
    event.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') { const c = await caches.open(KIT); c.put(req, res.clone()); if (Math.random() < .05) trim(KIT, 150); }
      return res;
    })());
    return;
  }
  if (u.pathname.indexOf('/nearby/') === 0 && /\.(js|css|png|svg|webp|jpg|json|txt|woff2?)$/.test(u.pathname)) {
    event.respondWith((async () => {
      const c = await caches.open(FILES), hit = await c.match(req);
      const fresh = fetch(req).then((res) => { if (res.ok && res.type === 'basic') { c.put(req, res.clone()); if (Math.random() < .05) trim(FILES, 200); } return res; }).catch(() => hit || Response.error());
      return hit || fresh;
    })());
  }
});
