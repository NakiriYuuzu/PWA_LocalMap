import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

// OpenLayers
import 'ol/ol.css'
import {downloadAndSaveTiles} from "@/data/source/local/tileDownloader";

// 定義台中市的 bbox 和 zoom 級別
const taichungBbox = [120.516, 24.046, 121.002, 24.397]
const zoomLevels = 16

// 下載並儲存瓦片
downloadAndSaveTiles(taichungBbox, zoomLevels).then(() => {
    console.log('Download and save tiles successfully!')
})

createApp(App).mount('#app')