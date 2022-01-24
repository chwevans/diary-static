const cacheName = "app-" + "bba552bd3dd2ea10441b4733783a52244c1a4aa6";

self.addEventListener("install", event => {
  console.log("installing app worker bba552bd3dd2ea10441b4733783a52244c1a4aa6");

  event.waitUntil(
    caches.open(cacheName).
      then(cache => {
        return cache.addAll([
          "/diary-static",
          "/diary-static/app.css",
          "/diary-static/app.js",
          "/diary-static/manifest.webmanifest",
          "/diary-static/wasm_exec.js",
          "/diary-static/web/app.wasm",
          "https://cdn.jsdelivr.net/npm/charts.css/dist/charts.min.css",
          "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
          "https://fonts.googleapis.com/icon?family=Material+Icons",
          "https://storage.googleapis.com/murlok-github/icon-192.png",
          "https://storage.googleapis.com/murlok-github/icon-512.png",
          
        ]);
      }).
      then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  console.log("app worker bba552bd3dd2ea10441b4733783a52244c1a4aa6 is activated");
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
