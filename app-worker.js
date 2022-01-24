const cacheName = "app-" + "92567311a6ea63cf1e5089c853d2a1f603ae1b4c";

self.addEventListener("install", event => {
  console.log("installing app worker 92567311a6ea63cf1e5089c853d2a1f603ae1b4c");

  event.waitUntil(
    caches.open(cacheName).
      then(cache => {
        return cache.addAll([
          "/chwevans/diary-static",
          "/chwevans/diary-static/app.css",
          "/chwevans/diary-static/app.js",
          "/chwevans/diary-static/manifest.webmanifest",
          "/chwevans/diary-static/wasm_exec.js",
          "/chwevans/diary-static/web/app.wasm",
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
  console.log("app worker 92567311a6ea63cf1e5089c853d2a1f603ae1b4c is activated");
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
