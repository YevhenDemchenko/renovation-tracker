self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let payload = {
    title: 'Ремонт',
    body: 'Є нове оновлення у витратах',
    url: './'
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: './assets/images/android-icon-144x144.png',
      badge: './assets/images/android-icon-144x144.png',
      data: { url: payload.url || './' },
      tag: payload.tag || 'renovation-tracker',
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || './', self.location.href).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(client => client.url === targetUrl);

    if (existing) {
      await existing.focus();
      return;
    }

    await self.clients.openWindow(targetUrl);
  })());
});
