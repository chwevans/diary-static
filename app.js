// -----------------------------------------------------------------------------
// Init service worker
// -----------------------------------------------------------------------------
var goappOnUpdate = function () { };

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/chwevans/diary-static/app-worker.js")
    .then(reg => {
      console.log("registering app service worker");

      reg.onupdatefound = function () {
        const installingWorker = reg.installing;
        installingWorker.onstatechange = function () {
          if (installingWorker.state == "installed") {
            if (navigator.serviceWorker.controller) {
              goappOnUpdate();
            }
          }
        };
      }
    })
    .catch(err => {
      console.error("offline service worker registration failed", err);
    });
}

// -----------------------------------------------------------------------------
// Env
// -----------------------------------------------------------------------------
const goappEnv = {"GOAPP_INTERNAL_URLS":"null","GOAPP_ROOT_PREFIX":"/chwevans/diary-static","GOAPP_STATIC_RESOURCES_URL":"/chwevans/diary-static","GOAPP_VERSION":"92567311a6ea63cf1e5089c853d2a1f603ae1b4c"};

function goappGetenv(k) {
  return goappEnv[k];
}

// -----------------------------------------------------------------------------
// App install
// -----------------------------------------------------------------------------
let deferredPrompt = null;
var goappOnAppInstallChange = function () { };

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  goappOnAppInstallChange();
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  goappOnAppInstallChange();
});

function goappIsAppInstallable() {
  return !goappIsAppInstalled() && deferredPrompt != null;
}

function goappIsAppInstalled() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  return isStandalone || navigator.standalone;
}

async function goappShowInstallPrompt() {
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
}

// -----------------------------------------------------------------------------
// Keep body clean
// -----------------------------------------------------------------------------
function goappKeepBodyClean() {
  const body = document.body;
  const bodyChildrenCount = body.children.length;

  const mutationObserver = new MutationObserver(function (mutationList) {
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case 'childList':
          while (body.children.length > bodyChildrenCount) {
            body.removeChild(body.lastChild);
          }
          break;
      }
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
  });

  return () => mutationObserver.disconnect();
}

// -----------------------------------------------------------------------------
// Init Web Assembly
// -----------------------------------------------------------------------------
if (!/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
  if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer();
      return await WebAssembly.instantiate(source, importObject);
    };
  }

  const go = new Go();

  WebAssembly.instantiateStreaming(fetch("/chwevans/diary-static/web/app.wasm"), go.importObject)
    .then(result => {
      const loaderIcon = document.getElementById("app-wasm-loader-icon");
      loaderIcon.className = "goapp-logo";

      go.run(result.instance);
    })
    .catch(err => {
      const loaderIcon = document.getElementById("app-wasm-loader-icon");
      loaderIcon.className = "goapp-logo";

      const loaderLabel = document.getElementById("app-wasm-loader-label");
      loaderLabel.innerText = err;

      console.error("loading wasm failed: " + err);
    });
} else {
  document.getElementById('app-wasm-loader').style.display = "none";
}
