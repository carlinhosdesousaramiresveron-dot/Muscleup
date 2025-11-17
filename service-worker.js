const CACHE_NAME = 'muscleup-cache-v1';
const FILES_TO_CACHE = [
  'index.html','style.css','script.js','manifest.json',
  'icone-192.png','icone-512.png',
  'Avatar.png','treino-braco.png','treino-peito.png','treino-perna.png','treino-costas.png','treino-abdomen.png','treino-aquecimento.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      if(resp) return resp;
      return fetch(event.request).then(fetchResp => {
        // armazenar nova requisição em cache (opcional)
        return fetchResp;
      }).catch(()=> caches.match('index.html'));
    })
  );
});
