// Native IndexedDB Wrapper Emulating Flutter's Hive Box APIs

class HiveBox {
  constructor(manager, storeName) {
    this.manager = manager;
    this.storeName = storeName;
  }

  // Puts an item into the database box mimicking box.put(key, value)
  async put(key, value) {
    return new Promise((resolve, reject) => {
      const db = this.manager.db;
      if (!db) {
        reject(new Error('Database connection is closed'));
        return;
      }
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Gets an item from the database box mimicking box.get(key)
  async get(key, defaultValue = null) {
    return new Promise((resolve, reject) => {
      const db = this.manager.db;
      if (!db) {
        reject(new Error('Database connection is closed'));
        return;
      }
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? request.result : defaultValue);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Deletes an item from the database box mimicking box.delete(key)
  async delete(key) {
    return new Promise((resolve, reject) => {
      const db = this.manager.db;
      if (!db) {
        reject(new Error('Database connection is closed'));
        return;
      }
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Clears the entire database box mimicking box.clear()
  async clear() {
    return new Promise((resolve, reject) => {
      const db = this.manager.db;
      if (!db) {
        reject(new Error('Database connection is closed'));
        return;
      }
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Getter returning array values mimicking box.values
  async values() {
    return new Promise((resolve, reject) => {
      const db = this.manager.db;
      if (!db) {
        reject(new Error('Database connection is closed'));
        return;
      }
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Getter returning all keys inside the box
  async keys() {
    return new Promise((resolve, reject) => {
      const db = this.manager.db;
      if (!db) {
        reject(new Error('Database connection is closed'));
        return;
      }
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }
}

class HiveManager {
  constructor() {
    this.dbName = 'AeroHubDB';
    this.db = null;
    this.boxes = {};
    this.openPromise = null;
  }

  // Opens a Box mimicking Hive.openBox(boxName)
  async openBox(boxName) {
    if (this.boxes[boxName]) {
      return this.boxes[boxName];
    }
    
    await this._ensureStore(boxName);
    
    const box = new HiveBox(this, boxName);
    this.boxes[boxName] = box;
    return box;
  }

  async _ensureStore(storeName) {
    if (!this.db) {
      await this._openDatabase(storeName);
      return;
    }

    if (!this.db.objectStoreNames.contains(storeName)) {
      const nextVersion = this.db.version + 1;
      this.db.close();
      this.db = null;
      await this._openDatabase(storeName, nextVersion);
    }
  }

  async _openDatabase(storeName, version) {
    if (this.openPromise) {
      await this.openPromise;
      if (this.db && this.db.objectStoreNames.contains(storeName)) {
        return;
      }
      return this._ensureStore(storeName);
    }

    this.openPromise = new Promise((resolve, reject) => {
      const request = version ? indexedDB.open(this.dbName, version) : indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        
        // Pre-create our primary boxes on initialization to avoid dynamic upgrades entirely for standard app
        if (!db.objectStoreNames.contains('expenses_box')) {
          db.createObjectStore('expenses_box');
        }
        if (!db.objectStoreNames.contains('settings_box')) {
          db.createObjectStore('settings_box');
        }
        if (!db.objectStoreNames.contains('favorites_box')) {
          db.createObjectStore('favorites_box');
        }

        // Handle dynamic new store if any
        if (storeName && !db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        
        this.db.onversionchange = () => {
          if (this.db) {
            this.db.close();
            this.db = null;
          }
        };

        resolve();
      };

      request.onerror = (e) => {
        reject(e.target.error);
      };
    });

    try {
      await this.openPromise;
    } finally {
      this.openPromise = null;
    }
  }
}

const Hive = new HiveManager();
export default Hive;
export { HiveBox };
