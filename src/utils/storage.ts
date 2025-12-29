import { StateStorage } from 'zustand/middleware';

/**
 * A lightweight IndexedDB wrapper for Zustand persistence
 * Handles large datasets that exceed localStorage limits (5MB)
 */

const DB_NAME = 'ai-vibe-db';
const STORE_NAME = 'key-val-store';
const DB_VERSION = 1;

class IndexedDBStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
        this.dbPromise = this.openDB();
    }
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.dbPromise) return localStorage.getItem(key);

    try {
      const db = await this.dbPromise;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB Read Error:', error);
      return localStorage.getItem(key); // Fallback
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.dbPromise) {
        localStorage.setItem(key, value);
        return;
    }

    try {
      const db = await this.dbPromise;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('IndexedDB Write Error, falling back to LocalStorage:', error);
      // Fallback to localStorage if IDB fails
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('LocalStorage is also full or unavailable:', e);
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.dbPromise) {
        localStorage.removeItem(key);
        return;
    }

    try {
      const db = await this.dbPromise;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB Delete Error:', error);
      localStorage.removeItem(key);
    }
  }
}

export const indexedDBStorage = new IndexedDBStorage();
