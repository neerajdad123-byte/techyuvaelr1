const CACHE = 'techyuva-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  clients.claim();
  clients.matchAll().then(ws => ws.forEach(w => w.postMessage('update')));
});

self.addEventListener('message', e => {
  if (e.data === 'reload') {
    clients.matchAll().then(ws => ws.forEach(w => w.navigate(w.url)));
  }
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      var clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
