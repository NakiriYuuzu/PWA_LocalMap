import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

// OpenLayers
import 'ol/ol.css'
import {downloadAndSaveTiles} from "@/data/source/local/tileDownloader";

if ('serviceWorker' in navigator) {
    (window as Window).addEventListener('load', () => {
        (navigator as Navigator).serviceWorker.register('/registerSW.js')
            .then((registration: ServiceWorkerRegistration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error: any) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// 定義台中市的 bbox 和 zoom 級別
const taichungBbox = [120.516, 24.046, 121.002, 24.397];
const zoomLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 下載並儲存瓦片
downloadAndSaveTiles(taichungBbox, zoomLevels).then(() => {
    console.log('Download and save tiles successfully!');
})

createApp(App).mount('#app')