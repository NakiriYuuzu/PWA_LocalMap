<style scoped>
#mapDiv {
  width: 100vh;
  height: 100vh;
}
</style>

<template>
  <main>
<!--    make a cool button with tailwind css-->
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="getTile()">
      get tile
    </button>
    <div id="mapDiv"></div>
  </main>
</template>

<script setup lang="ts">
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import View from 'ol/View'
import {WMTS} from "ol/source"
import WMTSTileGrid from "ol/tilegrid/WMTS"
import {get as getProjection, useGeographic} from 'ol/proj'
import {getTopLeft, getWidth} from "ol/extent"

import {onMounted, ref} from "vue"

const projection = getProjection('EPSG:3857')!
const projectionExtent = projection.getExtent()
const size = getWidth(projectionExtent) / 256
const resolutions = new Array(19)
const matrixIds = new Array(19)
for (let z = 0; z < 19; ++z) {
  resolutions[z] = size / Math.pow(2, z)
  matrixIds[z] = z
}

const map = ref<null | Map>()

const getTile = () => {
  map.value?.addLayer(new TileLayer({
    opacity: 0.7,
    source: new WMTS({
      url: 'https://wmts.nlsc.gov.tw/wmts/{Layer}/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}',
      layer: 'EMAP5',
      style: 'default',
      wrapX: true,
      format: 'image/jpeg',
      matrixSet: 'GoogleMapsCompatible',
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        matrixIds: matrixIds,
        resolutions: resolutions
      }),
      requestEncoding: 'REST'
    })
  }))
}

onMounted(() => {
  // 使用地理坐標
  useGeographic()

  // 初始化地圖
  map.value = new Map({
    target: 'mapDiv',
    layers: [
      // new TileLayer({
      //   source: new OSM()
      // }),
      // new TileLayer({
      //   opacity: 0.7,
      //   source: new WMTS({
      //     url: 'https://wmts.nlsc.gov.tw/wmts/{Layer}/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}',
      //     layer: 'EMAP5',
      //     style: 'default',
      //     wrapX: true,
      //     format: 'image/jpeg',
      //     matrixSet: 'GoogleMapsCompatible',
      //     tileGrid: new WMTSTileGrid({
      //       origin: getTopLeft(projectionExtent),
      //       matrixIds: matrixIds, 
      //       resolutions: resolutions
      //     }),
      //     requestEncoding: 'REST'
      //   })
      // })
    ],
    view: new View({
      center: [121.2, 23.5],
      zoom: 0,
      minZoom: 0,
      maxZoom: 17,
      zoomFactor: 2
    })
  })
})
</script>