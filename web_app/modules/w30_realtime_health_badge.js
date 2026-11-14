/**
 * ============================================================================
 * PG HOME LUXURY - REALTIME SYSTEM HEALTH & NETWORK SYNC BADGE MODULE (W30)
 * Module: window.PG_Modules_W30 & window.PG_W30
 * File: web_app/modules/w30_realtime_health_badge.js
 * Cải tiến UX & Hạ tầng: #30 (Network Sync Status Pill: Trực Tuyến / Ngoại Tuyến / Đang Đồng Bộ)
 * 
 * Chức năng:
 * - Hiển thị huy hiệu trạng thái Cloud Vercel + Zalo Stealth Daemon + Network Sync.
 * - Tự động ping định kỳ /api/health và /api/zalo-v6-health đo độ trễ ms.
 * - Hiển thị 3 trạng thái đồng bộ:
 *   + 🟢 Trực Tuyến (Đã Lưu)
 *   + 🟡 Ngoại Tuyến (Lưu Tạm)
 *   + 🔵 Đang Đồng Bộ...
 * - Lắng nghe sự kiện online/offline của trình duyệt và các CustomEvent:
 *   'pg:sync-start', 'pg:sync-complete', 'pg:data-pending'.
 * - Giao diện Glassmorphism sang trọng, chuẩn Brand PG Home Luxury.
 * ============================================================================
 */

(function (window, document) {
  'use strict';

  const CONFIG = {
    badgeId: 'pg-w30-health-badge',
    styleId: 'pg-w30-health-style',
    pingIntervalMs: 20000, // 20s mặc định
    requestTimeoutMs: 6000,
    endpoints: {
      vercel: '/api/health',
      zalo: '/api/zalo-v6-health'
    }
  };

  const state = {
    isExpanded: false,
    timer: null,
    isPinging: false,
    lastChecked: null,
    sync: {
      status: navigator.onLine ? 'saved' : 'pending', // 'saved', 'pending', 'syncing'
      statusText: navigator.onLine ? '🟢 Trực Tuyến (Đã Lưu)' : '🟡 Ngoại Tuyến (Lưu Tạm)',
      pendingCount: 0,
      lastSyncTime: new Date()
    },
    vercel: {
      status: 'pending', // 'healthy', 'degraded', 'offline', 'pending'
      latencyMs: 0,
      code: null,
      message: 'Chờ kiểm tra...',
      data: null
    },
    zalo: {
      status: 'pending', // 'healthy', 'warning', 'offline', 'pending'
      latencyMs: 0,
      code: null,
      sentinelStatus: 'Đang kết nối...',
      storageStatus: 'Chờ quét...',
      details: null
    }
  };

  /**
   * Tạo Style CSS tự động (Tự chứa 100% không cần CSS ngoài)
   */
  function injectStyles() {
    if (document.getElementById(CONFIG.styleId)) return;

    const css = `
      #pg-w30-health-badge {
        position: fixed;
        bottom: 18px;
        right: 18px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        user-select: none;
        color: #e2e8f0;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .pg-w30-pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 7px 14px;
        background: rgba(15, 23, 42, 0.88);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(212, 175, 55, 0.35); /* Vàng Luxury */
        border-radius: 9999px;
        box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: transform 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .pg-w30-pill:hover {
        transform: translateY(-2px);
        border-color: rgba(212, 175, 55, 0.65);
        box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.6);
      }

      .pg-w30-service {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .pg-w30-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        flex-shrink: 0;
        position: relative;
      }
      .pg-w30-dot-healthy,
      .pg-w30-dot-saved {
        background-color: #10b981;
        box-shadow: 0 0 8px #10b981;
      }
      .pg-w30-dot-healthy::after,
      .pg-w30-dot-saved::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #10b981;
        opacity: 0.6;
        animation: pg-w30-pulse 2s infinite ease-out;
      }
      .pg-w30-dot-warning,
      .pg-w30-dot-pending {
        background-color: #f59e0b;
        box-shadow: 0 0 8px #f59e0b;
      }
      .pg-w30-dot-offline {
        background-color: #ef4444;
        box-shadow: 0 0 8px #ef4444;
      }
      .pg-w30-dot-syncing {
        background-color: #3b82f6;
        box-shadow: 0 0 8px #3b82f6;
        animation: pg-w30-pulse 1s infinite ease-out;
      }

      @keyframes pg-w30-pulse {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.6); opacity: 0; }
      }

      .pg-w30-divider {
        width: 1px;
        height: 14px;
        background: rgba(255, 255, 255, 0.15);
      }

      .pg-w30-label {
        font-weight: 600;
        letter-spacing: 0.3px;
        color: #f8fafc;
      }
      .pg-w30-ms {
        font-size: 11px;
        color: #94a3b8;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }

      /* Popover Card Chi Tiết */
      .pg-w30-card {
        display: none;
        position: absolute;
        bottom: calc(100% + 12px);
        right: 0;
        width: 330px;
        background: rgba(15, 23, 42, 0.94);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(212, 175, 55, 0.4);
        border-radius: 14px;
        padding: 14px 16px;
        box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.7);
        animation: pg-w30-slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .pg-w30-card.is-open {
        display: block;
      }

      @keyframes pg-w30-slide-up {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .pg-w30-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 10px;
        margin-bottom: 12px;
      }
      .pg-w30-brand-title {
        font-size: 13px;
        font-weight: 700;
        color: #d4af37; /* Gold */
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .pg-w30-btn-refresh {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #cbd5e1;
        border-radius: 6px;
        padding: 3px 8px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .pg-w30-btn-refresh:hover {
        background: rgba(212, 175, 55, 0.2);
        color: #fff;
        border-color: #d4af37;
      }

      .pg-w30-item {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        padding: 8px 10px;
        margin-bottom: 8px;
      }
      .pg-w30-item-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }
      .pg-w30-item-title {
        font-weight: 600;
        font-size: 12px;
      }
      .pg-w30-item-body {
        font-size: 11px;
        color: #94a3b8;
      }
      .pg-w30-tag {
        display: inline-block;
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
      }
      .pg-w30-tag-healthy, .pg-w30-tag-saved { background: rgba(16, 185, 129, 0.2); color: #34d399; }
      .pg-w30-tag-warning, .pg-w30-tag-pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
      .pg-w30-tag-offline { background: rgba(239, 68, 68, 0.2); color: #f87171; }
      .pg-w30-tag-syncing { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }

      .pg-w30-footer {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #64748b;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = CONFIG.styleId;
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  /**
   * Tạo cấu trúc HTML cho Badge
   */
  function createBadgeDom() {
    let container = document.getElementById(CONFIG.badgeId);
    if (container) return container;

    container = document.createElement('div');
    container.id = CONFIG.badgeId;

    container.innerHTML = `
      <div class="pg-w30-card" id="pg-w30-popover">
        <div class="pg-w30-card-header">
          <div class="pg-w30-brand-title">PG HOME LIVE HEALTH & SYNC</div>
          <button type="button" class="pg-w30-btn-refresh" id="pg-w30-refresh-btn">Ping ngay</button>
        </div>

        <div class="pg-w30-item">
          <div class="pg-w30-item-head">
            <span class="pg-w30-item-title">Đồng Bộ Dữ Liệu (Sync Pill)</span>
            <span class="pg-w30-tag pg-w30-tag-saved" id="pg-w30-card-sync-tag">ONLINE</span>
          </div>
          <div class="pg-w30-item-body" id="pg-w30-card-sync-body">Trạng thái: 🟢 Trực Tuyến (Đã Lưu)</div>
        </div>

        <div class="pg-w30-item">
          <div class="pg-w30-item-head">
            <span class="pg-w30-item-title">Cloud Server (Vercel)</span>
            <span class="pg-w30-tag pg-w30-tag-pending" id="pg-w30-card-vercel-tag">Pending</span>
          </div>
          <div class="pg-w30-item-body" id="pg-w30-card-vercel-body">Đang đo độ trễ...</div>
        </div>

        <div class="pg-w30-item">
          <div class="pg-w30-item-head">
            <span class="pg-w30-item-title">Zalo Stealth Daemon</span>
            <span class="pg-w30-tag pg-w30-tag-pending" id="pg-w30-card-zalo-tag">Pending</span>
          </div>
          <div class="pg-w30-item-body" id="pg-w30-card-zalo-body">
            <div>Chế độ: 100% Zero-Disruption</div>
            <div id="pg-w30-card-zalo-storage">Storage: Đang kiểm tra...</div>
          </div>
        </div>

        <div class="pg-w30-footer">
          <span id="pg-w30-last-time">Cập nhật: Chưa có</span>
          <span>SOP W30 Sentinel</span>
        </div>
      </div>

      <div class="pg-w30-pill" id="pg-w30-pill-btn" title="Bấm để xem chi tiết sức khỏe hệ thống & trạng thái đồng bộ PG Home">
        <div class="pg-w30-service" id="pg-w30-service-sync">
          <span class="pg-w30-dot pg-w30-dot-saved" id="pg-w30-dot-sync"></span>
          <span class="pg-w30-label" id="pg-w30-label-sync">Đã Lưu</span>
        </div>

        <div class="pg-w30-divider"></div>

        <div class="pg-w30-service">
          <span class="pg-w30-dot pg-w30-dot-pending" id="pg-w30-dot-vercel"></span>
          <span class="pg-w30-label">Cloud</span>
          <span class="pg-w30-ms" id="pg-w30-ms-vercel">--ms</span>
        </div>

        <div class="pg-w30-divider"></div>

        <div class="pg-w30-service">
          <span class="pg-w30-dot pg-w30-dot-pending" id="pg-w30-dot-zalo"></span>
          <span class="pg-w30-label">Zalo</span>
          <span class="pg-w30-ms" id="pg-w30-ms-zalo">--ms</span>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    const pillBtn = container.querySelector('#pg-w30-pill-btn');
    pillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.PG_Modules_W30.toggleExpand();
    });

    const refreshBtn = container.querySelector('#pg-w30-refresh-btn');
    refreshBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.PG_Modules_W30.pingAll();
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target) && state.isExpanded) {
        window.PG_Modules_W30.toggleExpand(false);
      }
    });

    return container;
  }

  /**
   * Helper đo độ trễ request với AbortController
   */
  async function timedFetch(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const start = performance.now();

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      const latencyMs = Math.round(performance.now() - start);
      clearTimeout(timer);

      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        data = null;
      }

      return {
        ok: res.ok,
        status: res.status,
        latencyMs: latencyMs,
        data: data
      };
    } catch (err) {
      clearTimeout(timer);
      const latencyMs = Math.round(performance.now() - start);
      return {
        ok: false,
        status: 0,
        latencyMs: latencyMs,
        error: err.name === 'AbortError' ? 'Timeout (> ' + timeoutMs + 'ms)' : err.message
      };
    }
  }

  /**
   * Cải tiến #30: getNetworkSyncBadgeState()
   * Lấy snapshot trạng thái mạng và tiến trình đồng bộ thời gian thực
   */
  function getNetworkSyncBadgeState() {
    return {
      online: navigator.onLine,
      syncState: state.sync.status, // 'saved', 'pending', 'syncing'
      statusText: state.sync.statusText,
      pendingCount: state.sync.pendingCount,
      lastSyncTime: state.sync.lastSyncTime,
      vercel: { ...state.vercel },
      zalo: { ...state.zalo }
    };
  }

  /**
   * Cải tiến #30: renderSyncStatusPill()
   * Render huy hiệu 3 trạng thái:
   * 🟢 Trực Tuyến (Đã Lưu) | 🟡 Ngoại Tuyến (Lưu Tạm) | 🔵 Đang Đồng Bộ...
   */
  function renderSyncStatusPill() {
    const dotSync = document.getElementById('pg-w30-dot-sync');
    const labelSync = document.getElementById('pg-w30-label-sync');
    const cardSyncTag = document.getElementById('pg-w30-card-sync-tag');
    const cardSyncBody = document.getElementById('pg-w30-card-sync-body');

    if (!dotSync || !labelSync) return;

    if (state.sync.status === 'syncing') {
      dotSync.className = 'pg-w30-dot pg-w30-dot-syncing';
      labelSync.textContent = 'Đang Đồng Bộ...';
      if (cardSyncTag) {
        cardSyncTag.className = 'pg-w30-tag pg-w30-tag-syncing';
        cardSyncTag.textContent = 'SYNCING';
      }
      if (cardSyncBody) {
        cardSyncBody.textContent = `Trạng thái: 🔵 Đang Đồng Bộ... (${state.sync.pendingCount} gói)`;
      }
    } else if (state.sync.status === 'pending' || !navigator.onLine) {
      dotSync.className = 'pg-w30-dot pg-w30-dot-pending';
      labelSync.textContent = 'Ngoại Tuyến (Lưu Tạm)';
      if (cardSyncTag) {
        cardSyncTag.className = 'pg-w30-tag pg-w30-tag-warning';
        cardSyncTag.textContent = 'OFFLINE';
      }
      if (cardSyncBody) {
        cardSyncBody.textContent = `Trạng thái: 🟡 Ngoại Tuyến (Lưu Tạm ${state.sync.pendingCount > 0 ? state.sync.pendingCount + ' bản ghi' : 'an toàn'})`;
      }
    } else {
      // Saved / Online
      dotSync.className = 'pg-w30-dot pg-w30-dot-saved';
      labelSync.textContent = 'Đã Lưu';
      if (cardSyncTag) {
        cardSyncTag.className = 'pg-w30-tag pg-w30-tag-saved';
        cardSyncTag.textContent = 'ONLINE';
      }
      if (cardSyncBody) {
        const timeStr = state.sync.lastSyncTime ? state.sync.lastSyncTime.toLocaleTimeString('vi-VN') : 'Mới';
        cardSyncBody.textContent = `Trạng thái: 🟢 Trực Tuyến (Đã Lưu lúc ${timeStr})`;
      }
    }
  }

  /**
   * Cập nhật UI theo State hiện tại
   */
  function renderUI() {
    renderSyncStatusPill();

    // 1. Vercel Pill elements
    const dotVercel = document.getElementById('pg-w30-dot-vercel');
    const msVercel = document.getElementById('pg-w30-ms-vercel');
    if (dotVercel && msVercel) {
      dotVercel.className = 'pg-w30-dot pg-w30-dot-' + state.vercel.status;
      msVercel.textContent = state.vercel.latencyMs > 0 ? `${state.vercel.latencyMs}ms` : '--';
    }

    // 2. Zalo Pill elements
    const dotZalo = document.getElementById('pg-w30-dot-zalo');
    const msZalo = document.getElementById('pg-w30-ms-zalo');
    if (dotZalo && msZalo) {
      dotZalo.className = 'pg-w30-dot pg-w30-dot-' + state.zalo.status;
      msZalo.textContent = state.zalo.latencyMs > 0 ? `${state.zalo.latencyMs}ms` : '--';
    }

    // 3. Card Elements
    const cardVercelTag = document.getElementById('pg-w30-card-vercel-tag');
    const cardVercelBody = document.getElementById('pg-w30-card-vercel-body');
    if (cardVercelTag && cardVercelBody) {
      cardVercelTag.className = 'pg-w30-tag pg-w30-tag-' + state.vercel.status;
      cardVercelTag.textContent = state.vercel.status.toUpperCase();
      cardVercelBody.textContent = `HTTP ${state.vercel.code || 'N/A'} • ${state.vercel.latencyMs}ms • ${state.vercel.message}`;
    }

    const cardZaloTag = document.getElementById('pg-w30-card-zalo-tag');
    const cardZaloBody = document.getElementById('pg-w30-card-zalo-body');
    const cardZaloStorage = document.getElementById('pg-w30-card-zalo-storage');
    if (cardZaloTag && cardZaloBody) {
      cardZaloTag.className = 'pg-w30-tag pg-w30-tag-' + state.zalo.status;
      cardZaloTag.textContent = state.zalo.status.toUpperCase();
      if (cardZaloStorage) {
        cardZaloStorage.textContent = `Storage: ${state.zalo.storageStatus} (${state.zalo.sentinelStatus})`;
      }
    }

    const lastTimeEl = document.getElementById('pg-w30-last-time');
    if (lastTimeEl && state.lastChecked) {
      const nowStr = state.lastChecked.toLocaleTimeString('vi-VN');
      lastTimeEl.textContent = `Cập nhật: ${nowStr}`;
    }

    // Popover visibility
    const popover = document.getElementById('pg-w30-popover');
    if (popover) {
      if (state.isExpanded) {
        popover.classList.add('is-open');
      } else {
        popover.classList.remove('is-open');
      }
    }
  }

  /**
   * Ping Vercel Cloud Server
   */
  async function pingVercel() {
    const res = await timedFetch(CONFIG.endpoints.vercel, CONFIG.requestTimeoutMs);
    state.vercel.latencyMs = res.latencyMs;
    state.vercel.code = res.status;

    if (res.ok) {
      state.vercel.status = 'healthy';
      state.vercel.message = 'Sẵn sàng kết nối';
      state.vercel.data = res.data;
    } else {
      state.vercel.status = res.status === 404 ? 'warning' : 'offline';
      state.vercel.message = res.error || `Lỗi status ${res.status}`;
    }
  }

  /**
   * Ping Zalo Stealth Daemon
   */
  async function pingZalo() {
    const res = await timedFetch(CONFIG.endpoints.zalo, CONFIG.requestTimeoutMs);
    state.zalo.latencyMs = res.latencyMs;
    state.zalo.code = res.status;

    if (res.ok && res.data) {
      state.zalo.status = 'healthy';
      state.zalo.sentinelStatus = res.data.sentinel || 'OPERATIONAL_HEALTHY';
      state.zalo.storageStatus = res.data.storage || 'Accessible (LevelDB/Noise)';
      state.zalo.details = res.data;
    } else {
      state.zalo.status = res.status === 404 ? 'warning' : 'offline';
      state.zalo.sentinelStatus = res.status === 404 ? 'API 404 (Chế độ Local Standby)' : 'Chưa kết nối Daemon';
      state.zalo.storageStatus = 'Kiểm tra Daemon nền';
    }
  }

  /**
   * Cập nhật trạng thái đồng bộ dữ liệu
   */
  function setSyncState(status, text, pendingCount = 0) {
    state.sync.status = status;
    state.sync.statusText = text || (status === 'saved' ? '🟢 Trực Tuyến (Đã Lưu)' : (status === 'syncing' ? '🔵 Đang Đồng Bộ...' : '🟡 Ngoại Tuyến (Lưu Tạm)'));
    if (typeof pendingCount === 'number') {
      state.sync.pendingCount = pendingCount;
    }
    if (status === 'saved') {
      state.sync.lastSyncTime = new Date();
    }
    renderUI();
  }

  /**
   * Lắng nghe sự kiện Online / Offline & Custom Sync Events
   */
  function bindNetworkEvents() {
    window.addEventListener('online', () => {
      console.log('[PG_W30] Kết nối Internet đã khôi phục. Đang tự động đồng bộ...');
      setSyncState('syncing', '🔵 Đang Đồng Bộ...', state.sync.pendingCount);
      window.PG_Modules_W30.pingAll().then(() => {
        setTimeout(() => {
          setSyncState('saved', '🟢 Trực Tuyến (Đã Lưu)', 0);
        }, 800);
      });
    });

    window.addEventListener('offline', () => {
      console.warn('[PG_W30] Mất kết nối Internet. Chuyển sang chế độ Ngoại Tuyến (Lưu Tạm).');
      setSyncState('pending', '🟡 Ngoại Tuyến (Lưu Tạm)', state.sync.pendingCount);
    });

    window.addEventListener('pg:sync-start', (e) => {
      const count = (e.detail && e.detail.count) || 1;
      setSyncState('syncing', '🔵 Đang Đồng Bộ...', count);
    });

    window.addEventListener('pg:sync-complete', () => {
      setSyncState('saved', '🟢 Trực Tuyến (Đã Lưu)', 0);
    });

    window.addEventListener('pg:data-pending', (e) => {
      const count = (e.detail && e.detail.pendingCount) || (state.sync.pendingCount + 1);
      setSyncState('pending', '🟡 Ngoại Tuyến (Lưu Tạm)', count);
    });
  }

  /**
   * ĐỐI TƯỢNG MODULE API CHÍNH THỨC
   */
  const PG_W30_EXPORT = {
    version: '2.0.0',
    name: 'W30 Realtime Health & Network Sync Badge',

    init: function (opts) {
      if (opts) {
        if (opts.pingIntervalMs) CONFIG.pingIntervalMs = opts.pingIntervalMs;
        if (opts.endpoints) Object.assign(CONFIG.endpoints, opts.endpoints);
      }

      injectStyles();
      createBadgeDom();
      bindNetworkEvents();
      renderUI();

      this.pingAll();
      this.startPolling();
      return this;
    },

    toggleExpand: function (forceState) {
      if (typeof forceState === 'boolean') {
        state.isExpanded = forceState;
      } else {
        state.isExpanded = !state.isExpanded;
      }
      renderUI();
    },

    pingAll: async function () {
      if (state.isPinging) return;
      state.isPinging = true;

      const refreshBtn = document.getElementById('pg-w30-refresh-btn');
      if (refreshBtn) refreshBtn.textContent = 'Đang ping...';

      try {
        await Promise.allSettled([pingVercel(), pingZalo()]);
        state.lastChecked = new Date();
      } finally {
        state.isPinging = false;
        if (refreshBtn) refreshBtn.textContent = 'Ping ngay';
        renderUI();
      }
    },

    startPolling: function () {
      this.stopPolling();
      state.timer = setInterval(() => {
        this.pingAll();
      }, CONFIG.pingIntervalMs);
    },

    stopPolling: function () {
      if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
      }
    },

    getState: function () {
      return JSON.parse(JSON.stringify(state));
    },

    getNetworkSyncBadgeState: getNetworkSyncBadgeState,
    renderSyncStatusPill: renderSyncStatusPill,
    setSyncState: setSyncState,

    destroy: function () {
      this.stopPolling();
      const el = document.getElementById(CONFIG.badgeId);
      if (el) el.remove();
      const style = document.getElementById(CONFIG.styleId);
      if (style) style.remove();
    }
  };

  // Export đồng thời cả PG_Modules_W30 và PG_W30 để tương thích 100%
  window.PG_Modules_W30 = PG_W30_EXPORT;
  window.PG_W30 = PG_W30_EXPORT;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PG_Modules_W30.init());
  } else {
    window.PG_Modules_W30.init();
  }

})(window, document);
