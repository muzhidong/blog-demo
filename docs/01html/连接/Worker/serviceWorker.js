// this/self都是指向同一个对象ServiceWorkerGlobalScope，可以获取以下API：
// NavigationPreloadManager
// PaymentManager
// BackgroundFetchManager
// PeriodicSyncManager（定时同步管理器）
// SyncManager
// CookieStoreManager
// PushManager
// getNotifications() & showNotification()
var that = self;
console.group('ServiceWorkerGlobalScope对象提供如下属性或方法');
for(let key in that){
  console.log(typeof that[key], key, that[key]);
}
console.groupEnd();


var cacheKey = 'resource';
var cacheValue = ['index.html', 'worker.js', 'serviceWorker.js'];
// 注册ServiceWorker时触发（貌似不需要等待注册成功就会触发）
self.addEventListener('install', function (e) {
  console.log(e);
  // 添加资源到缓存
  caches.open(cacheKey).then(function(cache) {
    // Cache对象提供如下API
    // add
    // addAll
    // delete
    // keys
    // match
    // matchAll
    // put
    return cache.addAll(cacheValue);
  })
})

// 访问资源时触发
self.addEventListener('fetch', function(e) {
  console.log(e);
  // 读取缓存
  const { 
    request,
  } = e;
  const p = caches.open(cacheKey).then(cache => cache.match(request)).then(response => {
    if(response) {
      return response;
    }
    return fetch(request);
  })
  // 该方法不是自己的方法，源自其原型，解构是出不来的
  e.respondWith(p);
})


// 同步管理器调用注册方法时触发
self.addEventListener('sync',function(e) {
  console.log(e);
  // 检查同步状态
  console.log('from main thread sync message:', e.tag);
})


// 通知管理器调用相关方法时触发
self.addEventListener('notificationclick', function (e) {
  // 监听通知点击事件
  console.log('notification click', e);
}, false);

self.addEventListener('notificationclose', function (e) {
  // 监听通知关闭事件
  console.log('notification close', e);
},false);
