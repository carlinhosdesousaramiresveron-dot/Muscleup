self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("muscleup-v1").then(cache => {
      return cache.addAll([
        "index.html",
        "style.css",
        "script.js",
        "icone-192.png",
        "icone-512.png",
        "avatar.png",
        "treino-braco.png",
        "treino-peito.png",
        "treino-perna.png",
        "treino-costas.png",
        "treino-abdomen.png",
        "treino-aquecimento.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
