/**
 * PG HOME LUXURY - MODULE W28: OFFLINE SYNC OUTBOX
 * Quản lý hàng đợi lưu trữ Offline (IndexedDB / LocalStorage Outbox)
 * Tự động đồng bộ lên /api/save-state khi có mạng trên Vercel Cloud.
 * 
 * Chuẩn nhận diện: Hộ Kinh Doanh Phú Gia - 042203002931 - TP. Hà Tĩnh
 */

(function (window) {
  'use strict';

  const DB_NAME = 'PGHome_Offline_DB';
  const DB_VERSION = 1;
  const STORE_NAME = 'outbox_queue';
  const LOCAL_STORAGE_KEY = 'PGHome_Outbox_Backup';
  const DEFAULT_SAVE_ENDPOINT = '/api/save-state';
  const MAX_RETRIES = 5;

  let dbInstance = null;
  let isSyncing = false;
  let syncTimer = null;

  // 1. KHỞI TẠO VÀ QUẢN LÝ INDEXEDDB VỚI FALLBACK LOCALSTORAGE
  function openIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return resolve(null); // Fallback to LocalStorage
      }
      if (dbInstance) {
        return resolve(dbInstance);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.warn('[W28 Outbox] Không mở được IndexedDB, chuyển sang LocalStorage fallback:', event.target.error);
        resolve(null);
      };
    });
  }

  // LocalStorage Fallback Helpers
  function getLocalStorageOutbox() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('[W28 Outbox] Lỗi đọc LocalStorage:', e);
      return [];
    }
  }

  function saveLocalStorageOutbox(items) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('[W28 Outbox] Lỗi ghi LocalStorage:', e);
    }
  }

  // 2. CÁC HÀM XỬ LÝ HÀNG ĐỢI (QUEUE OPERATIONS)
  async function enqueue(payload, options = {}) {
    const item = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      endpoint: options.endpoint || DEFAULT_SAVE_ENDPOINT,
      method: options.method || 'POST',
      headers: options.headers || { 'Content-Type': 'application/json' },
      payload: payload,
      timestamp: Date.now(),
      retryCount: 0,
      lastError: null,
      status: 'pending', // 'pending' | 'syncing' | 'failed'
      description: options.description || 'Auto-saved State'
    };

    const db = await openIndexedDB();
    if (db) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.add(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } else {
      const list = getLocalStorageOutbox();
      list.push(item);
      saveLocalStorageOutbox(list);
    }

    notifyEvent('pghome:outbox-enqueued', { item });
    updateBadge();

    // Nếu đang có mạng thì kích hoạt đồng bộ ngay
    if (navigator.onLine) {
      triggerSyncDebounced(1000);
    }

    return item.id;
  }

  async function getAllPending() {
    const db = await openIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const res = req.result || [];
          res.sort((a, b) => a.timestamp - b.timestamp);
          resolve(res);
        };
        req.onerror = () => {
          resolve(getLocalStorageOutbox());
        };
      });
    } else {
      return getLocalStorageOutbox().sort((a, b) => a.timestamp - b.timestamp);
    }
  }

  async function removeItem(id) {
    const db = await openIndexedDB();
    if (db) {
      await new Promise((resolve) => {
        const tx = db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } else {
      const list = getLocalStorageOutbox().filter(x => x.id !== id);
      saveLocalStorageOutbox(list);
    }
    updateBadge();
  }

  async function updateItem(item) {
    const db = await openIndexedDB();
    if (db) {
      await new Promise((resolve) => {
        const tx = db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } else {
      const list = getLocalStorageOutbox();
      const idx = list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        list[idx] = item;
      } else {
        list.push(item);
      }
      saveLocalStorageOutbox(list);
    }
  }

  async function clearAll() {
    const db = await openIndexedDB();
    if (db) {
      await new Promise((resolve) => {
        const tx = db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    }
    saveLocalStorageOutbox([]);
    updateBadge();
  }

  // 3. TIẾN TRÌNH ĐỒNG BỘ LÊN VERCEL CLOUD (/api/save-state)
  async function syncNow() {
    if (isSyncing) {
      console.log('[W28 Outbox] Đang trong tiến trình đồng bộ khác, bỏ qua.');
      return { status: 'busy' };
    }

    if (!navigator.onLine) {
      console.log('[W28 Outbox] Thiết bị đang offline, bảo lưu dữ liệu trong outbox.');
      notifyEvent('pghome:offline-status', { online: false });
      return { status: 'offline' };
    }

    const items = await getAllPending();
    if (!items || items.length === 0) {
      updateBadge();
      return { status: 'empty', synced: 0 };
    }

    isSyncing = true;
    notifyEvent('pghome:sync-started', { count: items.length });
    console.log(`[W28 Outbox] Bắt đầu đồng bộ ${items.length} bản ghi lên Cloud...`);

    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      try {
        const payloadData = typeof item.payload === 'string' ? item.payload : JSON.stringify(item.payload);
        
        const response = await fetch(item.endpoint, {
          method: item.method || 'POST',
          headers: item.headers || { 'Content-Type': 'application/json' },
          body: payloadData,
          cache: 'no-store'
        });

        if (response.ok) {
          console.log(`[W28 Outbox] Đồng bộ thành công ID: ${item.id} -> ${item.endpoint}`);
          await removeItem(item.id);
          successCount++;
          notifyEvent('pghome:sync-item-success', { id: item.id });
        } else {
          const errText = await response.text().catch(() => 'Unknown HTTP Error');
          console.warn(`[W28 Outbox] HTTP Error ${response.status} khi gửi ${item.id}:`, errText);
          item.retryCount = (item.retryCount || 0) + 1;
          item.lastError = `HTTP ${response.status}: ${errText.substring(0, 100)}`;
          
          if (item.retryCount >= MAX_RETRIES) {
            item.status = 'failed';
          }
          await updateItem(item);
          failCount++;
        }
      } catch (networkError) {
        console.warn(`[W28 Outbox] Mất kết nối mạng khi gửi ${item.id}:`, networkError.message);
        item.retryCount = (item.retryCount || 0) + 1;
        item.lastError = networkError.message;
        await updateItem(item);
        failCount++;
        // Gặp lỗi mạng đột ngột thì dừng vòng lặp, chờ kết nối phục hồi
        break;
      }
    }

    isSyncing = false;
    updateBadge();

    notifyEvent('pghome:sync-completed', {
      success: successCount,
      failed: failCount,
      remaining: (await getAllPending()).length
    });

    return {
      status: 'completed',
      success: successCount,
      failed: failCount
    };
  }

  function triggerSyncDebounced(delay = 1500) {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      syncNow();
    }, delay);
  }

  // 4. TIỆN ÍCH LƯU TRỮ VỚI FALLBACK TỰ ĐỘNG (INTEGRATION HELPER)
  /**
   * Cố gắng lưu trực tiếp lên Vercel API. Nếu lỗi mạng hoặc offline,
   * tự động đưa vào Outbox và hoàn tất mượt mà không làm gián đoạn người dùng.
   */
  async function saveStateWithOfflineFallback(stateData, endpoint = DEFAULT_SAVE_ENDPOINT) {
    if (!navigator.onLine) {
      console.log('[W28 Outbox] Phát hiện Offline -> Đưa vào Outbox Queue.');
      const id = await enqueue(stateData, { endpoint, description: 'Lưu ngoại tuyến khi mất mạng' });
      return { success: true, offline: true, queueId: id, message: 'Đã lưu an toàn vào bộ nhớ đệm Offline' };
    }

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof stateData === 'string' ? stateData : JSON.stringify(stateData),
        cache: 'no-store'
      });

      if (!resp.ok) {
        throw new Error(`Server returned ${resp.status}`);
      }

      const resJson = await resp.json().catch(() => ({}));
      return { success: true, offline: false, data: resJson };
    } catch (err) {
      console.warn('[W28 Outbox] Lỗi kết nối API Cloud -> Chuyển hướng lưu vào Offline Outbox:', err.message);
      const id = await enqueue(stateData, { endpoint, description: 'Tự động lưu dự phòng khi Cloud timeout' });
      return { success: true, offline: true, queueId: id, fallback: true, error: err.message };
    }
  }

  // 5. THEO DÕI SỰ KIỆN MẠNG & UI BADGE
  function notifyEvent(eventName, detail) {
    try {
      const evt = new CustomEvent(eventName, { detail: detail });
      window.dispatchEvent(evt);
    } catch (e) {
      // Ignored
    }
  }

  async function updateBadge() {
    const items = await getAllPending();
    const count = items.length;
    const badgeEl = document.getElementById('pghome-offline-badge');
    if (badgeEl) {
      if (count > 0) {
        badgeEl.textContent = count > 99 ? '99+' : count;
        badgeEl.style.display = 'inline-block';
        badgeEl.title = `Có ${count} thay đổi đang lưu Offline chờ đồng bộ`;
      } else {
        badgeEl.style.display = 'none';
      }
    }
  }

  function initNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('[W28 Outbox] Kết nối mạng đã khôi phục! Kích hoạt tự động đồng bộ...');
      notifyEvent('pghome:offline-status', { online: true });
      triggerSyncDebounced(1200);
    });

    window.addEventListener('offline', () => {
      console.log('[W28 Outbox] Thiết bị đã chuyển sang chế độ Offline.');
      notifyEvent('pghome:offline-status', { online: false });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        triggerSyncDebounced(2000);
      }
    });

    // Hỗ trợ Service Worker Background Sync API nếu trình duyệt hỗ trợ
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register('pghome-outbox-sync').catch(() => {});
      }).catch(() => {});
    }
  }

  // Tự động khởi chạy
  initNetworkListeners();
  openIndexedDB().then(() => {
    updateBadge();
    if (navigator.onLine) {
      triggerSyncDebounced(3000);
    }
  });

  // 6. XUẤT MODULE TOÀN CỤC
  const W28Module = {
    version: '1.0.0',
    name: 'PGHome_Offline_Sync_Outbox',
    enqueue,
    getAllPending,
    removeItem,
    clearAll,
    syncNow,
    saveStateWithOfflineFallback,
    isOnline: () => navigator.onLine,
    isSyncing: () => isSyncing,
    getPendingCount: async () => (await getAllPending()).length
  };

  window.PG_Modules_W28 = W28Module;
  window.PG_OfflineSyncOutbox = W28Module;

})(window);
