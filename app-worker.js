const cacheName = "app-" + "9ab7cd477d670d7644f2ab25223dd843ffc3f337";

self.addEventListener("install", event => {
  console.log("installing app worker 9ab7cd477d670d7644f2ab25223dd843ffc3f337");

  event.waitUntil(
    caches.open(cacheName).
      then(cache => {
        return cache.addAll([
          "/",
          "/app.css",
          "/app.js",
          "/manifest.webmanifest",
          "/wasm_exec.js",
          "/web/app.wasm",
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
  console.log("app worker 9ab7cd477d670d7644f2ab25223dd843ffc3f337 is activated");
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
