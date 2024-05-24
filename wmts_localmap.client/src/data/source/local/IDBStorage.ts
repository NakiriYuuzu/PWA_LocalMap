import {openDB, type IDBPDatabase, type DBSchema} from 'idb'

interface MapDB extends DBSchema {
    maps: {
        key: string
        value: {
            name: string,
            image: File
        }
    }
}

const MAP_DB_NAME = 'map-db'
const MAP_DB_STORE = 'maps'

let mapDBPromise: Promise<IDBPDatabase<MapDB>>

export async function initMapDB() {
    mapDBPromise = openDB<MapDB>(MAP_DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(MAP_DB_STORE, {
                keyPath: 'name'
            })
        },
    })
}

export async function addImage(name: string, image: File) {
    const db = await mapDBPromise
    await db.add(MAP_DB_STORE, { name, image })
}

export async function getAllImages() {
    const db = await mapDBPromise
    return db.getAll(MAP_DB_STORE)
}