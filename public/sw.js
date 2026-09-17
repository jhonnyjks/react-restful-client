/* AutoBlaze service worker — installability + Web Push */
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  var data = {
    title: 'AutoBlaze',
    body: 'Próximo sinal em 5 minutos',
    url: '/#/crash',
  };

  try {
    if (event.data) {
      var parsed = event.data.json();
      if (parsed && typeof parsed === 'object') {
        if (parsed.title) data.title = parsed.title;
        if (parsed.body) data.body = parsed.body;
        if (parsed.url) data.url = parsed.url;
      }
    }
  } catch (e) {
    try {
      var text = event.data && event.data.text();
      if (text) data.body = text;
    } catch (e2) {
      /* ignore */
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url },
      vibrate: [200, 100, 200],
      requireInteraction: true,
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url =
    (event.notification.data && event.notification.data.url) || '/#/crash';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if ('focus' in client) {
            if (client.navigate) {
              return client.navigate(url).then(function (c) {
                return c && c.focus ? c.focus() : client.focus();
              });
            }
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});
