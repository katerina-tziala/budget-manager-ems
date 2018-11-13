//cache names
const staticCacheName = 'bm_ems-files-v1';
const imagesCacheName = 'bm_ems-images-v1';
const appCaches = [staticCacheName, imagesCacheName];
//files to be cached
const cacheFiles = [
  '/',
  'manifest.json',
  'browserconfig.xml',
  'index.html',
  'account_activation.html',
  'forgot_password.html',
  'reset_password.html',
  'signup.html',
  'contact.html',
  'terms_of_use.html',
  'add_expense.html',
  'budget_and_goals.html',
  'categories.html',
  'expense_details.html',
  'my_expenses.html',
  'profile.html',
  'assets/js/app.min.js',
  'assets/js/account_activation.min.js',
  'assets/js/add_expense.min.js',
  'assets/js/budget_and_goals.min.js',
  'assets/js/categories.min.js',
  'assets/js/contact.min.js',
  'assets/js/expense_details.min.js',
  'assets/js/forgot_password.min.js',
  'assets/js/home.min.js',
  'assets/js/my_expenses.min.js',
  'assets/js/profile.min.js',
  'assets/js/reset_password.min.js',
  'assets/js/signin.min.js',
  'assets/js/signup.min.js',
  'assets/css/critical.min.css',
  'assets/css/account_activation.min.css',
  'assets/css/add_expense.min.css',
  'assets/css/budget_and_goals.min.css',
  'assets/css/categories.min.css',
  'assets/css/contact.min.css',
  'assets/css/expense_details.min.css',
  'assets/css/forgot_password.min.css',
  'assets/css/home.min.css',
  'assets/css/my_expenses.min.css',
  'assets/css/profile.min.css',
  'assets/css/reset_password.min.css',
  'assets/css/signin.min.css',
  'assets/css/signup.min.css',
  'assets/css/terms_of_use.min.css',
  'assets/webfonts/fa-brands-400.eot',
  'assets/webfonts/fa-brands-400.svg',
  'assets/webfonts/fa-brands-400.ttf',
  'assets/webfonts/fa-brands-400.woff',
  'assets/webfonts/fa-brands-400.woff2',
  'assets/webfonts/fa-regular-400.eot',
  'assets/webfonts/fa-regular-400.svg',
  'assets/webfonts/fa-regular-400.ttf',
  'assets/webfonts/fa-regular-400.woff',
  'assets/webfonts/fa-regular-400.woff2',
  'assets/webfonts/fa-solid-900.eot',
  'assets/webfonts/fa-solid-900.svg',
  'assets/webfonts/fa-solid-900.ttf',
  'assets/webfonts/fa-solid-900.woff',
  'assets/webfonts/fa-solid-900.woff2'
];
//images to be cached
const cacheImages = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'mstile-70x70.png',
  'mstile-144x144.png',
  'mstile-150x150.png',
  'mstile-310x150.png',
  'mstile-310x310.png',
  'assets/img/beauty.svg',
  'assets/img/female.svg',
  'assets/img/male.svg',
  'assets/img/lock_refresh.svg',
  'assets/img/minions_stare.gif',
  'assets/img/minions_thumbs.gif',
  'assets/img/minions_what.gif',
  'assets/img/minions_yeah.gif',
  'assets/img/search.svg',
  'assets/img/sendmail.svg',
  'assets/img/user_inside_circle.svg',
  'assets/img/feedback/budget_folder.gif',
  'assets/img/feedback/empty_pockets.gif',
  'assets/img/feedback/empty_wallet.gif',
  'assets/img/feedback/excited.gif',
  'assets/img/feedback/money_girl.gif',
  'assets/img/feedback/money_rain_one.gif',
  'assets/img/feedback/sad.gif',
  'assets/img/feedback/toast.gif',
  'assets/img/logo/android-chrome-36x36.png',
  'assets/img/logo/android-chrome-48x48.png',
  'assets/img/logo/android-chrome-72x72.png',
  'assets/img/logo/android-chrome-96x96.png',
  'assets/img/logo/android-chrome-144x144.png',
  'assets/img/logo/android-chrome-192x192.png',
  'assets/img/logo/android-chrome-256x256.png',
  'assets/img/logo/android-chrome-384x384.png',
  'assets/img/logo/android-chrome-512x512.png',
  'assets/img/logo/apple-touch-icon-57x57.png',
  'assets/img/logo/apple-touch-icon-72x72.png',
  'assets/img/logo/apple-touch-icon-76x76.png',
  'assets/img/logo/apple-touch-icon-120x120.png',
  'assets/img/logo/apple-touch-icon-152x152.png',
  'assets/img/logo/apple-touch-icon.png',
  'assets/img/logo/logo.svg',
  'assets/img/logo/logo128.png',
  'assets/img/logo/logo256.png',
  'assets/img/logo/logo333333.svg',
  'assets/img/logo/logomonocolor.svg',
  'assets/img/logo/safari-pinned-tab.svg'
];
//Install Service Worker and cache files:
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(cacheFiles);
    })
  );
  event.waitUntil(
    caches.open(imagesCacheName).then((cache) => {
      return cache.addAll(cacheImages);
    })
  );
});
//Activate Service Worker and delete old cache(s):
self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('bm_ems-') && !appCaches.includes(cacheName);
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
//Activate a waiting Service Worker:
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
//Respond with a file from cache or add the requested file in cache and then respond:
//Handle API requests as well:
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  const cloneRequest = event.request.clone();
  const requestMethod = event.request.method.toUpperCase();
  const dataManager_php_req = requestUrl.toString().split("action=")[1];
  /* when we request images */
  if (requestUrl.pathname.match('.jpg') || requestUrl.pathname.match('.png') || requestUrl.pathname.match('.svg') || requestUrl.pathname.match('.gif')) {
    event.respondWith(retrieveImage(event.request));
    return;
  }
  //console.log(event.request);
  if (requestMethod==='POST' || requestUrl.pathname.match('dataManager.php')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
    // Cache hit - return response:
    if (response) {
      return response;
    }
    // Not cache hit:
    fetch(cloneRequest).then((response) => {
      if(!response){
        return response;
      }
      const cloneResponse = response.clone();
        caches.open(staticCacheName).then((cache) => {
            cache.put(event.request, cloneResponse);
        return response;
      })
    });
    return fetch(event.request);
    })
  );
});
//Respond with an image from cache or add the requested image in cache and then respond:
self.retrieveImage = (request) =>{
  return caches.open(imagesCacheName).then((cache) => {
    return cache.match(request).then((response) => {
      // Cache hit - return response:
      if (response) {
        return response;
      }
      // Not cache hit:
      return fetch(request).then((networkResponse) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    });
  });
};
