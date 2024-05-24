import { openDB } from 'idb';
import WMTSTileGrid from "ol/tilegrid/WMTS"
import {fromLonLat, get as getProjection} from 'ol/proj'
import {getTopLeft, getWidth} from "ol/extent"

const URL = 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/GoogleMapsCompatible/{TileMatrix}/{TileRow}/{TileCol}'
const DB_NAME = 'WMTS_Tiles';
const STORE_NAME = 'tiles';

export async function initDB() {
    return await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'url' });
            }
        },
    });
}

export async function saveTile(url: string, blob: Blob) {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    await store.put({ url, blob })
    await tx.done
}

export async function getTile(url: string) {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    return await store.get(url)
}

export async function downloadAndSaveTiles(bbox: number[], zoomLevels: number[]) {
    const urls = generateTileUrls(bbox, zoomLevels)
    for (const url of urls) {
        const response = await fetch(url)
        console.log(response)
        const blob = await response.blob()
        await saveTile(url, blob)
    }
}

function generateTileUrls(bbox: number[], zoomLevels: number[]): string[] {
    const projection = getProjection('EPSG:3857')!
    const projectionExtent = projection.getExtent()
    const size = getWidth(projectionExtent) / 256
    const resolutions = new Array(19)
    const matrixIds = new Array(19)
    for (let z = 0; z < 19; ++z) {
        resolutions[z] = size / Math.pow(2, z)
        matrixIds[z] = z
    }

    const tileGrid = new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
    });

    const urls: string[] = [];
    const [minX, minY, maxX, maxY] = bbox
    
    const minCoord = fromLonLat([minX, minY], 'EPSG:3857')
    const maxCoord = fromLonLat([maxX, maxY], 'EPSG:3857')

    for (const z of zoomLevels) {
        const topLeft = [minCoord[0], maxCoord[1]]
        const bottomRight = [maxCoord[0], minCoord[1]]
        
        const topLeftTile = tileGrid.getTileCoordForCoordAndZ(topLeft, z)
        const bottomRightTile = tileGrid.getTileCoordForCoordAndZ(bottomRight, z)

        for (let x = topLeftTile[1]; x <= bottomRightTile[1]; x++) {
            for (let y = topLeftTile[2]; y >= bottomRightTile[2]; y--) {
                const url = URL.replace('{TileMatrix}', String(z))
                                      .replace('{TileRow}', String(y))
                                      .replace('{TileCol}', String(x))
                urls.push(url)
            }
        }
    }

    return urls
}