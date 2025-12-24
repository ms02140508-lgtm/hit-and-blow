const CACHE_NAME = 'hit-and-blow-cache-v1';
const FILES_TO_CACHE = [
  './',                 // index.html
  './index.html',
  './manifest.json',
  './sw.js',
  // CSSやJS、音声ファイルも追加
  './style.css',        // CSSを分けている場合
  './hit_and_blow.js',  // ゲーム本体JSを外部にしている場合
  'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'
];

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching files');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

