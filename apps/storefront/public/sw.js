// App shell: minimal offline fallback so the installed app never shows a
// browser error page. Caches the shell at install, serves it when the network
// fails. Network-first for everything else.
// language: JS, target: service worker (public/sw.js)

const CACHE_VERSION = "qf-v1"
const SHELL_CACHE = `${CACHE_VERSION}-shell`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`

// Pages/resources that make up the app shell. Offline navigation resolves to
// the offline page at the end of this list.
const APP_SHELL = [
  "/",
  "/collections/terbaru",
  "/cart",
  "/account",
  "/manifest.webmanifest",
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

// Navigation requests: network-first, fall back to cached page, then offline.
// Same-origin static assets: stale-while-revalidate so the app loads fast and
// still picks up fresh assets.
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== "GET") return
  if (url.origin !== self.location.origin) return

  // Let the Medusa SDK / API calls pass through untouched.
  if (url.pathname.startsWith("/store") || url.pathname.startsWith("/api")) {
    return
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request))
    return
  }

  if (request.destination === "image" || request.destination === "style" || request.destination === "script" || request.destination === "font") {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  event.respondWith(staleWhileRevalidate(request))
})

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(RUNTIME_CACHE)
    cache.put(request, response.clone())
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached

    const offline = await caches.match("/offline.html")
    if (offline) return offline

    return new Response(
      "Koneksi terputus. Buka kembali aplikasi setelah online.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    )
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  const cached = await cache.match(request)

  const fetchAndCache = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)

  return cached || fetchAndCache
}

// Keep the app shell fresh when the user returns.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
