/**
 * Cache service using IndexedDB with fallback to localStorage
 */

const DB_NAME = 'equran_cache_db';
const DB_VERSION = 1;
const STORE_NAME = 'api_cache';

interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function getDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB failed to open, falling back to localStorage');
        resolve(null);
      };
    });
  }
  return dbPromise;
}

export async function getCachedData<T>(key: string, maxAgeMs = 7 * 24 * 60 * 60 * 1000): Promise<T | null> {
  try {
    const db = await getDb();
    if (db) {
      return new Promise<T | null>((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          const entry = req.result as CacheEntry<T> | undefined;
          if (entry && (Date.now() - entry.timestamp < maxAgeMs)) {
            resolve(entry.data);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    }

    // LocalStorage fallback
    const raw = localStorage.getItem(`cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw) as CacheEntry<T>;
      if (Date.now() - parsed.timestamp < maxAgeMs) {
        return parsed.data;
      }
    }
  } catch (err) {
    console.warn(`Cache read error for ${key}:`, err);
  }
  return null;
}

export async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = { key, data, timestamp: Date.now() };
    const db = await getDb();
    if (db) {
      return new Promise<void>((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.put(entry);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      });
    }

    // LocalStorage fallback (only if size allows)
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch {
      // quota exceeded, ignore
    }
  } catch (err) {
    console.warn(`Cache write error for ${key}:`, err);
  }
}
