self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const options = {
      body: event.data.body,
      icon: '/favicon.ico',
      vibrate: [200, 100, 200],
      badge: '/favicon.ico',
    }

    self.registration.showNotification('POI Detected', options)
  }
})
