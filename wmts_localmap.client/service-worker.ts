import {precacheAndRoute} from 'workbox-precaching'
import {registerRoute} from 'workbox-routing'
import {NetworkFirst, CacheFirst, StaleWhileRevalidate} from 'workbox-strategies'
import {ExpirationPlugin} from 'workbox-expiration'

declare let self: ServiceWorkerGlobalScope

// 載入預緩存清單
self.__WB_MANIFEST = [].concat(self.__WB_MANIFEST || [])
precacheAndRoute(self.__WB_MANIFEST)

// Cache 所有的 HTML
registerRoute(
    ({request}) => request.mode === 'navigate',
    new NetworkFirst({
        cacheName: 'html-cache',
    })
)

// Cache 所有的 CSS 和 JS
registerRoute(
    ({request}) => request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
    new StaleWhileRevalidate({
        cacheName: 'asset-cache'
    })
)

// Cache 所有的圖片
registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 10000, // 設置較高的緩存條目限制
                maxAgeSeconds: 60 * 60 * 24 * 365, // 一年
            }),
        ],
    })
)