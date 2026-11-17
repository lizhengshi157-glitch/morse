// 和文モールス：オフライン用 Service Worker（自動生成）
const CACHE = 'morse-1c81c4401d';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('morse-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// キャッシュにあればそれをすぐ返し、つながっていれば裏で最新版を取り込む（次に開いたとき新しくなる）
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = (await cache.match(e.request, { ignoreSearch: true })) || (e.request.mode === 'navigate' ? await cache.match('./index.html') : undefined);
    const update = fetch(e.request).then((r) => { if (r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(update); return hit; }
    return (await update) || Response.error();
  })());
});
