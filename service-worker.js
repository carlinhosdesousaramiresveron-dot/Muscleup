self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("acdtreino-cache").then((cache) => {
      return cache.addAll([
        "index.html",
        "signup.html",
        "treino.html",
        "manifest.json",
        "icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});