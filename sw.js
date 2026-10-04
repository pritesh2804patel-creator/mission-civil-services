const CACHE_NAME = "mission-civil-services-v6";
const APP_FILES = [
    "./",
    "./index.html",
    "./style.css?v=20261004-4",
    "./app.js?v=20261004-6",
    "./manifest.webmanifest",
    "./data/upsc.json",
    "./data/cgpsc.json",
    "./data/lessons.json?v=20261004-2",
    "./assets/icon.svg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                }
                return response;
            })
            .catch(() => caches.match(event.request).then((cached) => {
                if (cached) return cached;
                if (event.request.mode === "navigate") return caches.match("./index.html");
                return Response.error();
            }))
    );
});
