/* SUDOMI 1.0 Service Worker
 * Fast, offline-first caching for the Sudoku experience.
 */
const VERSION = '1.0.1';   // los idiomas (lang-en/fr/pt/zh) no van aquí: se descarga solo el que se usa
const CACHE = 'sudomi-v' + VERSION;

const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/main.css',
  'icons/favicon-32.png',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'js/i18n.js',
  'js/lang-v2.js',
  'js/lang-v3.js',
  'js/avatar-art.js',
  'js/theme.js',
  'js/customize.js',
  'js/skins.js',
  'js/no-zoom.js',
  'js/sound.js',
  'js/profile.js',
  'js/smart-hints.js',
  'js/score.js',
  'js/xp.js',
  'js/achievements.js',
  'js/stats.js',
  'js/coach.js',
  'js/splash.js',
  'img/studio/darkangelitox.svg',
  'js/screens.js',
  'js/training.js',
  'js/teacher.js',
  'js/profile-screen.js',
  'js/settings.js',
  'js/a11y.js',
  'js/effects.js',
  'js/daily.js',
  'js/tutorial.js',
  'js/race.js',
  'js/pwa.js',
  'js/install.js',
  'js/result.js',
  'js/shop.js',
  'js/icons.js',
  'js/tabbar.js',
  'js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => Promise.allSettled(SHELL.map(url => cache.add(url))))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('sudomi-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.includes('/api/')) return;
  event.respondWith(serve(req));
});

async function serve(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  } catch (err) {
    if (req.mode === 'navigate') {
      const shell = await cache.match('index.html');
      if (shell) return shell;
    }
    throw err;
  }
}
