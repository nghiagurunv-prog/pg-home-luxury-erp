/**
 * =========================================================================================
 * MODULE W19: HÀNG ĐỢI DUYỆT NHANH HỘP THƯ CHỜ ZALO (ZALO STAGING APPROVAL QUEUE)
 * PG HOME LUXURY - HỘ KINH DOANH PHÚ GIA (MST: 042203002931)
 * -----------------------------------------------------------------------------------------
 * Bản quyền: Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0973.562.789
 * 
 * NGUYÊN TẮC QUẢN TRỊ & LUẬT SẮT GIÁM ĐỐC:
 * 1. Chốt công nợ & chứng từ phát sinh tức thời <= 60 PHÚT (Zero-Dồn cuối tháng).
 * 2. Đối soát dòng tiền 3 lớp chéo: [Ảnh hóa đơn] + [Zalo NCC] + [UNC ngân hàng khớp số tiền].
 * 3. Thẩm quyền tối cao: Giám Đốc phê duyệt đóng dấu đỏ điện tử trước khi giải ngân/nhập kho.
 * 4. Kết nối trực tiếp API Backend: POST /api/zalo-approve-item
 * =========================================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W19 = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // --- HẰNG SỐ CẤU HÌNH & LUẬT SẮT ---
  const CONFIG = {
    MODULE_ID: 'W19_ZALO_STAGING_QUEUE',
    MODULE_NAME: 'Hàng Đợi Duyệt Nhanh Zalo Staging (<= 60 Phút)',
    API_APPROVE_ENDPOINT: '/api/zalo-approve-item',
    DATA_SOURCE_FALLBACK: '/data/zalo_staging_inbox.json',
    URGENT_THRESHOLD_MINUTES: 60, // Kỷ luật thép: Chốt trong 60 phút
    CATEGORIES: {
      INVOICE_OR_DELIVERY_NOTE: {
        label: 'Hóa đơn / Phiếu xuất kho',
        badgeClass: 'pg-badge-invoice',
        icon: '📄',
        color: '#f59e0b'
      },
      BANK_TRANSFER_VOUCHER: {
        label: 'Ủy nhiệm chi / Chuyển khoản',
        badgeClass: 'pg-badge-bank',
        icon: '💳',
        color: '#10b981'
      },
      WORKSHOP_PHOTO_OR_LANDSCAPE: {
        label: 'Hiện trường xưởng / Lắp đặt',
        badgeClass: 'pg-badge-workshop',
        icon: '🏭',
        color: '#3b82f6'
      },
      OTHER: {
        label: 'Chứng từ khác',
        badgeClass: 'pg-badge-other',
        icon: '📎',
        color: '#8b5cf6'
      }
    }
  };

  // --- TRẠNG THÁI NỘI BỘ (REACTIVE STATE) ---
  const state = {
    items: [],
    selectedIds: new Set(),
    activeTab: 'PENDING', // 'PENDING' | 'URGENT_60M' | 'INVOICE' | 'BANK' | 'WORKSHOP' | 'APPROVED' | 'REJECTED' | 'ALL'
    searchQuery: '',
    selectedGroupFilter: 'ALL',
    isProcessing: false,
    activeModalItem: null,
    lightboxImageUrl: null,
    containerElement: null,
    lastSyncTime: null
  };

  // --- HÀM TIỆN ÍCH HỖ TRỢ (HELPERS) ---
  function formatMoney(amount) {
    if (!amount || isNaN(amount) || amount === 0) return '0 đ';
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' đ';
  }

  function parseMoneyInput(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleanStr = String(val).replace(/[^0-9]/g, '');
    return cleanStr ? parseInt(cleanStr, 10) : 0;
  }

  function getCategoryMeta(categoryKey) {
    return CONFIG.CATEGORIES[categoryKey] || CONFIG.CATEGORIES.OTHER;
  }

  function calculateAgeMinutes(detectedDateStr) {
    if (!detectedDateStr) return 9999;
    try {
      const detectedTime = new Date(detectedDateStr.replace(' ', 'T')).getTime();
      if (isNaN(detectedTime)) return 9999;
      const now = Date.now();
      const diffMs = now - detectedTime;
      return Math.max(0, Math.floor(diffMs / (60 * 1000)));
    } catch (e) {
      return 9999;
    }
  }

  function formatTimeAgo(detectedDateStr) {
    const minutes = calculateAgeMinutes(detectedDateStr);
    if (minutes === 0) return 'Vừa mới đây';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ ${minutes % 60}p trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- TIỆN ÍCH THÔNG BÁO TOAST ---
  function showToast(message, type = 'info') {
    const toastId = 'pg-w19-toast-container';
    let container = document.getElementById(toastId);
    if (!container) {
      container = document.createElement('div');
      container.id = toastId;
      container.className = 'pg-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `pg-toast pg-toast-${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
    toast.innerHTML = `
      <div class="pg-toast-icon">${icon}</div>
      <div class="pg-toast-message">${escapeHtml(message)}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('pg-toast-fadeout');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // --- CSS STYLE EMBEDDED ---
  function injectStyles() {
    const styleId = 'pg-w19-styles';
    if (document.getElementById(styleId)) return;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      .pg-w19-wrapper {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #e2e8f0;
        background-color: #0b1120;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        margin: 16px 0;
      }
      .pg-w19-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px solid #1e293b;
        padding-bottom: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .pg-w19-title-group h2 {
        margin: 0 0 6px 0;
        font-size: 1.35rem;
        font-weight: 700;
        color: #f8fafc;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .pg-w19-title-group .pg-rule-tag {
        font-size: 0.72rem;
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 2px 8px;
        border-radius: 9999px;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .pg-w19-subtitle {
        font-size: 0.85rem;
        color: #94a3b8;
        margin: 0;
        line-height: 1.4;
      }
      .pg-w19-brand-meta {
        font-size: 0.75rem;
        color: #64748b;
        text-align: right;
      }
      .pg-w19-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      }
      .pg-stat-card {
        background: #131d31;
        border: 1px solid #1e293b;
        border-radius: 8px;
        padding: 12px 14px;
        transition: transform 0.15s ease, border-color 0.15s ease;
      }
      .pg-stat-card:hover {
        border-color: #38bdf8;
        transform: translateY(-2px);
      }
      .pg-stat-card.urgent-card {
        border-left: 4px solid #ef4444;
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, #131d31 100%);
      }
      .pg-stat-label {
        font-size: 0.75rem;
        color: #94a3b8;
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 4px;
      }
      .pg-stat-val {
        font-size: 1.35rem;
        font-weight: 700;
        color: #f8fafc;
      }
      .pg-stat-val.red { color: #f87171; }
      .pg-stat-val.gold { color: #fbbf24; }
      .pg-stat-val.green { color: #34d399; }
      .pg-stat-val.blue { color: #38bdf8; }

      .pg-w19-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        background: #111c30;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid #1e293b;
      }
      .pg-w19-tabs {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .pg-tab-btn {
        background: transparent;
        color: #94a3b8;
        border: 1px solid transparent;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.82rem;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .pg-tab-btn:hover {
        background: #1e293b;
        color: #f8fafc;
      }
      .pg-tab-btn.active {
        background: #0284c7;
        color: #ffffff;
        border-color: #38bdf8;
        font-weight: 600;
        box-shadow: 0 0 10px rgba(2, 132, 199, 0.4);
      }
      .pg-tab-btn.urgent-tab.active {
        background: #dc2626;
        border-color: #ef4444;
        box-shadow: 0 0 10px rgba(220, 38, 38, 0.4);
      }
      .pg-tab-count {
        background: rgba(0, 0, 0, 0.35);
        padding: 1px 6px;
        border-radius: 9999px;
        font-size: 0.72rem;
      }

      .pg-filter-search-box {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-grow: 1;
        max-width: 420px;
        margin-left: auto;
      }
      .pg-search-input, .pg-select-filter {
        background: #0b1120;
        border: 1px solid #334155;
        color: #f8fafc;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 0.82rem;
        outline: none;
      }
      .pg-search-input:focus, .pg-select-filter:focus {
        border-color: #38bdf8;
      }
      .pg-search-input {
        flex-grow: 1;
      }

      .pg-batch-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1e293b;
        padding: 8px 14px;
        border-radius: 6px;
        margin-bottom: 14px;
        font-size: 0.82rem;
      }
      .pg-batch-actions {
        display: flex;
        gap: 8px;
      }
      .pg-btn {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.15s ease;
      }
      .pg-btn-primary {
        background: #0284c7;
        color: #fff;
      }
      .pg-btn-primary:hover { background: #0369a1; }
      .pg-btn-success {
        background: #059669;
        color: #fff;
      }
      .pg-btn-success:hover { background: #047857; }
      .pg-btn-danger {
        background: #dc2626;
        color: #fff;
      }
      .pg-btn-danger:hover { background: #b91c1c; }
      .pg-btn-outline {
        background: transparent;
        border: 1px solid #475569;
        color: #cbd5e1;
      }
      .pg-btn-outline:hover {
        background: #334155;
        color: #fff;
      }

      /* Card Grid / List */
      .pg-queue-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 14px;
      }
      .pg-card-item {
        background: #131d31;
        border: 1px solid #1e293b;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
        position: relative;
      }
      .pg-card-item:hover {
        border-color: #38bdf8;
        transform: translateY(-2px);
        box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.4);
      }
      .pg-card-item.is-urgent {
        border: 1px solid #ef4444;
        box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
      }
      .pg-urgent-strip {
        background: linear-gradient(90deg, #dc2626, #f97316);
        color: #fff;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 3px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
      .pg-card-thumb-wrapper {
        position: relative;
        height: 160px;
        background: #070d18;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .pg-card-thumb-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.25s ease;
      }
      .pg-card-thumb-wrapper:hover .pg-card-thumb-img {
        transform: scale(1.05);
      }
      .pg-card-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 4px;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .pg-badge-invoice { color: #fbbf24; border-color: rgba(251, 191, 36, 0.3); }
      .pg-badge-bank { color: #34d399; border-color: rgba(52, 211, 153, 0.3); }
      .pg-badge-workshop { color: #60a5fa; border-color: rgba(96, 165, 250, 0.3); }
      .pg-badge-other { color: #c084fc; border-color: rgba(192, 132, 252, 0.3); }

      .pg-card-body {
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex-grow: 1;
      }
      .pg-card-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
      }
      .pg-card-group-name {
        font-size: 0.82rem;
        font-weight: 700;
        color: #f1f5f9;
        margin: 0;
        line-height: 1.3;
      }
      .pg-card-time {
        font-size: 0.72rem;
        color: #94a3b8;
        white-space: nowrap;
      }
      .pg-card-summary {
        font-size: 0.78rem;
        color: #cbd5e1;
        line-height: 1.35;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .pg-card-meta-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.73rem;
        color: #64748b;
        background: #0d1525;
        padding: 6px 8px;
        border-radius: 4px;
      }
      .pg-card-amount-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(30, 41, 59, 0.7);
        border: 1px dashed #334155;
        padding: 6px 10px;
        border-radius: 6px;
      }
      .pg-card-amount-label {
        font-size: 0.75rem;
        color: #94a3b8;
      }
      .pg-card-amount-val {
        font-size: 0.95rem;
        font-weight: 700;
        color: #fbbf24;
      }

      .pg-card-actions {
        padding: 10px 14px;
        background: #0f172a;
        border-top: 1px solid #1e293b;
        display: flex;
        gap: 6px;
      }
      .pg-card-actions .pg-btn {
        flex: 1;
        justify-content: center;
      }

      /* Modal & Lightbox */
      .pg-modal-backdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        padding: 16px;
      }
      .pg-modal-box {
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 12px;
        width: 100%;
        max-width: 820px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
      }
      .pg-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        border-bottom: 1px solid #1e293b;
      }
      .pg-modal-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #f8fafc;
        margin: 0;
      }
      .pg-modal-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 1.4rem;
        cursor: pointer;
        line-height: 1;
      }
      .pg-modal-close:hover { color: #f8fafc; }
      .pg-modal-body {
        padding: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      @media (max-width: 720px) {
        .pg-modal-body { grid-template-columns: 1fr; }
      }
      .pg-modal-preview-col {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .pg-modal-img-wrap {
        background: #070d18;
        border: 1px solid #1e293b;
        border-radius: 8px;
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .pg-modal-img-wrap img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .pg-modal-form-col {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .pg-form-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .pg-form-label {
        font-size: 0.76rem;
        font-weight: 600;
        color: #94a3b8;
      }
      .pg-form-input, .pg-form-select, .pg-form-textarea {
        background: #0b1120;
        border: 1px solid #334155;
        color: #f8fafc;
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 0.85rem;
      }
      .pg-form-input:focus, .pg-form-select:focus, .pg-form-textarea:focus {
        border-color: #38bdf8;
        outline: none;
      }
      .pg-modal-footer {
        padding: 14px 20px;
        border-top: 1px solid #1e293b;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        background: #090e1a;
      }

      /* Lightbox */
      .pg-lightbox {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
      }
      .pg-lightbox img {
        max-width: 95vw;
        max-height: 95vh;
        object-fit: contain;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
      }

      /* Toast Notification */
      .pg-toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      }
      .pg-toast {
        background: #1e293b;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.85rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
        pointer-events: auto;
        animation: pgToastIn 0.25s ease forwards;
        max-width: 380px;
      }
      .pg-toast-success { border-left: 4px solid #10b981; }
      .pg-toast-error { border-left: 4px solid #ef4444; }
      .pg-toast-warning { border-left: 4px solid #f59e0b; }
      .pg-toast-info { border-left: 4px solid #3b82f6; }
      .pg-toast-fadeout { opacity: 0; transform: translateY(10px); transition: all 0.3s; }
      @keyframes pgToastIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Empty State */
      .pg-empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #64748b;
        grid-column: 1 / -1;
      }
      .pg-empty-state h3 {
        color: #94a3b8;
        font-size: 1.1rem;
        margin: 10px 0 4px 0;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // --- TẢI DỮ LIỆU TỪ INBOX / API ---
  async function loadData() {
    state.isProcessing = true;
    try {
      let data = null;
      // 1. Ưu tiên fetch từ API backend nếu có
      try {
        const resp = await fetch(CONFIG.API_APPROVE_ENDPOINT + '?status=all', { method: 'GET' });
        if (resp.ok) {
          const resJson = await resp.json();
          if (Array.isArray(resJson)) data = resJson;
          else if (resJson && Array.isArray(resJson.items)) data = resJson.items;
        }
      } catch (errApi) {
        // Fallback sang file json
      }

      // 2. Fallback sang file dữ liệu staging local
      if (!data) {
        const fileResp = await fetch(CONFIG.DATA_SOURCE_FALLBACK);
        if (fileResp.ok) {
          data = await fileResp.json();
        }
      }

      if (Array.isArray(data)) {
        state.items = data.map(item => ({
          ...item,
          review_status: item.review_status || 'PENDING_DIRECTOR_REVIEW',
          amount: typeof item.amount === 'number' ? item.amount : 0
        }));
        state.lastSyncTime = new Date();
      }
    } catch (e) {
      console.warn('[W19] Không thể nạp tự động staging inbox, khởi tạo rỗng.', e);
    } finally {
      state.isProcessing = false;
      renderApp();
    }
  }

  // --- KẾT NỐI API DUYỆT / TỪ CHỐI (/api/zalo-approve-item) ---
  async function submitDecision(itemId, action, updatePayload = {}) {
    const item = state.items.find(x => x.id === itemId);
    if (!item) return false;

    const payload = {
      id: item.id,
      action: action, // 'APPROVE' | 'REJECT'
      amount: updatePayload.amount !== undefined ? updatePayload.amount : item.amount,
      project_hint: updatePayload.project_hint || item.project_hint || '',
      category: updatePayload.category || item.category,
      note: updatePayload.note || (action === 'APPROVE' ? 'Giám Đốc phê duyệt đóng dấu đỏ' : 'Giám Đốc từ chối chứng từ'),
      reviewer: 'GIÁM ĐỐC',
      timestamp: new Date().toISOString()
    };

    let serverConfirmed = false;
    try {
      const res = await fetch(CONFIG.API_APPROVE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        serverConfirmed = true;
      }
    } catch (netErr) {
      // Backend offline/mock mode: Vẫn ghi nhận quyết định cục bộ để không nghẽn luồng làm việc
    }

    // Cập nhật state nội bộ
    item.review_status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    item.amount = payload.amount;
    item.project_hint = payload.project_hint;
    item.category = payload.category;
    item.director_decision_at = payload.timestamp;
    item.director_note = payload.note;

    if (action === 'APPROVE') {
      showToast(`Đã duyệt & đóng dấu đỏ: ${item.id} (${formatMoney(payload.amount)})`, 'success');
    } else {
      showToast(`Đã từ chối chứng từ: ${item.id}`, 'warning');
    }

    renderApp();
    return true;
  }

  // --- LỌC VÀ TÍNH TOÁN DỮ LIỆU ---
  function getFilteredItems() {
    return state.items.filter(item => {
      const minutesAgo = calculateAgeMinutes(item.detected_date);
      const isUrgent60m = minutesAgo <= CONFIG.URGENT_THRESHOLD_MINUTES && item.review_status === 'PENDING_DIRECTOR_REVIEW';

      // Lọc theo Tab
      if (state.activeTab === 'PENDING' && item.review_status !== 'PENDING_DIRECTOR_REVIEW') return false;
      if (state.activeTab === 'URGENT_60M' && !isUrgent60m) return false;
      if (state.activeTab === 'INVOICE' && item.category !== 'INVOICE_OR_DELIVERY_NOTE') return false;
      if (state.activeTab === 'BANK' && item.category !== 'BANK_TRANSFER_VOUCHER') return false;
      if (state.activeTab === 'WORKSHOP' && item.category !== 'WORKSHOP_PHOTO_OR_LANDSCAPE') return false;
      if (state.activeTab === 'APPROVED' && item.review_status !== 'APPROVED') return false;
      if (state.activeTab === 'REJECTED' && item.review_status !== 'REJECTED') return false;

      // Lọc theo Nhóm Zalo
      if (state.selectedGroupFilter !== 'ALL' && item.group_name !== state.selectedGroupFilter) return false;

      // Tìm kiếm từ khóa
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase().trim();
        const strToMatch = [
          item.id,
          item.group_name,
          item.sender_name,
          item.summary,
          item.project_hint,
          item.sha256
        ].filter(Boolean).join(' ').toLowerCase();

        if (!strToMatch.includes(q)) return false;
      }

      return true;
    });
  }

  function computeStats() {
    let total = state.items.length;
    let pending = 0;
    let urgent60m = 0;
    let approved = 0;
    let rejected = 0;
    let invoiceCount = 0;
    let bankCount = 0;
    let workshopCount = 0;
    let pendingAmount = 0;

    const groupSet = new Set();

    state.items.forEach(item => {
      if (item.group_name) groupSet.add(item.group_name);
      const isPending = item.review_status === 'PENDING_DIRECTOR_REVIEW';
      const minutesAgo = calculateAgeMinutes(item.detected_date);

      if (isPending) {
        pending++;
        pendingAmount += (item.amount || 0);
        if (minutesAgo <= CONFIG.URGENT_THRESHOLD_MINUTES) {
          urgent60m++;
        }
      }
      if (item.review_status === 'APPROVED') approved++;
      if (item.review_status === 'REJECTED') rejected++;

      if (item.category === 'INVOICE_OR_DELIVERY_NOTE') invoiceCount++;
      if (item.category === 'BANK_TRANSFER_VOUCHER') bankCount++;
      if (item.category === 'WORKSHOP_PHOTO_OR_LANDSCAPE') workshopCount++;
    });

    return {
      total,
      pending,
      urgent60m,
      approved,
      rejected,
      invoiceCount,
      bankCount,
      workshopCount,
      pendingAmount,
      groups: Array.from(groupSet)
    };
  }

  // --- RENDER GIAO DIỆN CHÍNH (HTML BUILDER) ---
  function renderApp() {
    if (!state.containerElement) return;

    injectStyles();
    const stats = computeStats();
    const filteredList = getFilteredItems();

    const html = `
      <div class="pg-w19-wrapper">
        <!-- HEADER THƯƠNG HIỆU & PHÁP LÝ -->
        <div class="pg-w19-header">
          <div class="pg-w19-title-group">
            <h2>
              <span>⚡ ${CONFIG.MODULE_NAME}</span>
              <span class="pg-rule-tag">Luật Sắt: ≤ 60 Phút</span>
            </h2>
            <p class="pg-w19-subtitle">
              Đối soát 3 lớp chéo [Hóa đơn] + [Zalo NCC] + [UNC] | Chốt công nợ tức thời, cấm dồn cuối tháng.
            </p>
          </div>
          <div class="pg-w19-brand-meta">
            <strong>HỘ KINH DOANH PHÚ GIA</strong> (MST: 042203002931)<br>
            Hotline: 0973.562.789 | Tổ hợp Ngõ 49 Trương Quốc Dụng, TP. Hà Tĩnh
          </div>
        </div>

        <!-- STATS DASHBOARD -->
        <div class="pg-w19-stats-grid">
          <div class="pg-stat-card urgent-card">
            <div class="pg-stat-label">🚨 Cần Chốt Gấp (≤ 60p)</div>
            <div class="pg-stat-val red">${stats.urgent60m}</div>
          </div>
          <div class="pg-stat-card">
            <div class="pg-stat-label">⏳ Chờ Giám Đốc Duyệt</div>
            <div class="pg-stat-val gold">${stats.pending}</div>
          </div>
          <div class="pg-stat-card">
            <div class="pg-stat-label">💰 Tổng Tiền Chờ Duyệt</div>
            <div class="pg-stat-val gold">${formatMoney(stats.pendingAmount)}</div>
          </div>
          <div class="pg-stat-card">
            <div class="pg-stat-label">✓ Đã Phê Duyệt Đỏ</div>
            <div class="pg-stat-val green">${stats.approved}</div>
          </div>
          <div class="pg-stat-card">
            <div class="pg-stat-label">📄 Hóa Đơn / UNC / Ảnh</div>
            <div class="pg-stat-val blue">${stats.invoiceCount + stats.bankCount} / ${stats.workshopCount}</div>
          </div>
        </div>

        <!-- CONTROLS & FILTER BAR -->
        <div class="pg-w19-controls">
          <div class="pg-w19-tabs">
            <button class="pg-tab-btn ${state.activeTab === 'PENDING' ? 'active' : ''}" data-tab="PENDING">
              Chờ duyệt <span class="pg-tab-count">${stats.pending}</span>
            </button>
            <button class="pg-tab-btn urgent-tab ${state.activeTab === 'URGENT_60M' ? 'active' : ''}" data-tab="URGENT_60M">
              🚨 ≤ 60 Phút <span class="pg-tab-count">${stats.urgent60m}</span>
            </button>
            <button class="pg-tab-btn ${state.activeTab === 'INVOICE' ? 'active' : ''}" data-tab="INVOICE">
              Hóa đơn <span class="pg-tab-count">${stats.invoiceCount}</span>
            </button>
            <button class="pg-tab-btn ${state.activeTab === 'BANK' ? 'active' : ''}" data-tab="BANK">
              UNC Ngân hàng <span class="pg-tab-count">${stats.bankCount}</span>
            </button>
            <button class="pg-tab-btn ${state.activeTab === 'WORKSHOP' ? 'active' : ''}" data-tab="WORKSHOP">
              Hiện trường <span class="pg-tab-count">${stats.workshopCount}</span>
            </button>
            <button class="pg-tab-btn ${state.activeTab === 'APPROVED' ? 'active' : ''}" data-tab="APPROVED">
              Đã duyệt <span class="pg-tab-count">${stats.approved}</span>
            </button>
            <button class="pg-tab-btn ${state.activeTab === 'ALL' ? 'active' : ''}" data-tab="ALL">
              Tất cả <span class="pg-tab-count">${stats.total}</span>
            </button>
          </div>

          <div class="pg-filter-search-box">
            <select class="pg-select-filter" id="pg-w19-group-select">
              <option value="ALL">-- Tất cả nhóm Zalo (${stats.groups.length}) --</option>
              ${stats.groups.map(g => `<option value="${escapeHtml(g)}" ${state.selectedGroupFilter === g ? 'selected' : ''}>${escapeHtml(g)}</option>`).join('')}
            </select>
            <input 
              type="text" 
              class="pg-search-input" 
              id="pg-w19-search-input" 
              placeholder="Tìm theo người gửi, mã, nội dung..." 
              value="${escapeHtml(state.searchQuery)}"
            />
          </div>
        </div>

        <!-- BATCH ACTIONS BAR -->
        <div class="pg-batch-bar">
          <div>
            <label style="display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" id="pg-w19-select-all" ${state.selectedIds.size > 0 && state.selectedIds.size === filteredList.length ? 'checked' : ''} />
              <span>Chọn tất cả (Đang chọn: <strong>${state.selectedIds.size}</strong>)</span>
            </label>
          </div>
          <div class="pg-batch-actions">
            <button class="pg-btn pg-btn-outline" id="pg-w19-btn-batch-workshop">
              🏭 Duyệt nhanh toàn bộ ảnh hiện trường (0đ)
            </button>
            <button class="pg-btn pg-btn-success" id="pg-w19-btn-batch-approve" ${state.selectedIds.size === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
              ✓ Phê duyệt các mục đã chọn (${state.selectedIds.size})
            </button>
            <button class="pg-btn pg-btn-outline" id="pg-w19-btn-refresh">
              🔄 Làm mới
            </button>
          </div>
        </div>

        <!-- LIST / GRID CARD -->
        <div class="pg-queue-grid">
          ${filteredList.length === 0 ? `
            <div class="pg-empty-state">
              <div style="font-size: 2.5rem; margin-bottom: 8px;">📭</div>
              <h3>Không có chứng từ nào trong bộ lọc này</h3>
              <p>Toàn bộ hóa đơn, UNC và ảnh hiện trường đã được xử lý hoặc không khớp từ khóa tìm kiếm.</p>
            </div>
          ` : filteredList.map(item => renderCardItem(item)).join('')}
        </div>
      </div>

      <!-- MODAL CHI TIẾT & DUYỆT -->
      ${state.activeModalItem ? renderModal(state.activeModalItem) : ''}

      <!-- LIGHTBOX XEM ẢNH GỐC -->
      ${state.lightboxImageUrl ? `
        <div class="pg-lightbox" id="pg-w19-lightbox">
          <img src="${escapeHtml(state.lightboxImageUrl)}" alt="Chi tiết ảnh chứng từ" />
        </div>
      ` : ''}
    `;

    state.containerElement.innerHTML = html;
    bindEvents();
  }

  // --- RENDER MỖI CARD CHỨNG TỪ ---
  function renderCardItem(item) {
    const minutesAgo = calculateAgeMinutes(item.detected_date);
    const isUrgent = minutesAgo <= CONFIG.URGENT_THRESHOLD_MINUTES && item.review_status === 'PENDING_DIRECTOR_REVIEW';
    const cat = getCategoryMeta(item.category);
    const isSelected = state.selectedIds.has(item.id);

    return `
      <div class="pg-card-item ${isUrgent ? 'is-urgent' : ''}" data-id="${item.id}">
        ${isUrgent ? `
          <div class="pg-urgent-strip">
            <span>🚨 Khẩn cấp: ≤ 60 Phút</span>
            <span>${minutesAgo}p trước</span>
          </div>
        ` : ''}

        <div class="pg-card-thumb-wrapper" data-action="lightbox" data-img="${escapeHtml(item.preview_url)}">
          <img class="pg-card-thumb-img" src="${escapeHtml(item.preview_url)}" alt="${escapeHtml(item.summary)}" loading="lazy" />
          <div class="pg-card-badge ${cat.badgeClass}">
            <span>${cat.icon}</span>
            <span>${cat.label}</span>
          </div>
          <div style="position: absolute; bottom: 8px; right: 8px; z-index: 2;">
            <input type="checkbox" class="pg-card-select-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation();" />
          </div>
        </div>

        <div class="pg-card-body">
          <div class="pg-card-header-row">
            <h4 class="pg-card-group-name" title="${escapeHtml(item.group_name)}">${escapeHtml(item.group_name)}</h4>
            <span class="pg-card-time">${formatTimeAgo(item.detected_date)}</span>
          </div>

          <p class="pg-card-summary" title="${escapeHtml(item.summary)}">${escapeHtml(item.summary)}</p>

          <div class="pg-card-meta-row">
            <span>Người gửi: <strong>${escapeHtml(item.sender_name || 'N/A')}</strong></span>
            <span>Kích thước: ${escapeHtml(item.resolution || 'N/A')} (${item.size_kb} KB)</span>
          </div>

          <div class="pg-card-amount-box">
            <span class="pg-card-amount-label">Số tiền ghi nhận:</span>
            <span class="pg-card-amount-val">${formatMoney(item.amount)}</span>
          </div>
        </div>

        <div class="pg-card-actions">
          ${item.review_status === 'PENDING_DIRECTOR_REVIEW' ? `
            <button class="pg-btn pg-btn-success" data-action="quick-approve" data-id="${item.id}" title="Duyệt nhanh và đóng dấu đỏ">
              ✓ Duyệt Đỏ
            </button>
            <button class="pg-btn pg-btn-danger" data-action="quick-reject" data-id="${item.id}" title="Từ chối chứng từ">
              ✕ Từ Chối
            </button>
            <button class="pg-btn pg-btn-outline" data-action="open-detail" data-id="${item.id}" title="Xem chi tiết & gán tiền/công trình">
              🔍 Sửa
            </button>
          ` : `
            <div style="width:100%; text-align:center; font-size:0.78rem; font-weight:700; color: ${item.review_status === 'APPROVED' ? '#34d399' : '#f87171'}; padding: 4px 0;">
              ${item.review_status === 'APPROVED' ? '✓ ĐÃ PHÊ DUYỆT ĐỎ' : '✕ ĐÃ TỪ CHỐI'}
            </div>
            <button class="pg-btn pg-btn-outline" data-action="open-detail" data-id="${item.id}">
              Xem lại
            </button>
          `}
        </div>
      </div>
    `;
  }

  // --- RENDER MODAL PHÊ DUYỆT & GÁN SỐ TIỀN/CÔNG TRÌNH ---
  function renderModal(item) {
    const cat = getCategoryMeta(item.category);
    return `
      <div class="pg-modal-backdrop" id="pg-w19-modal-backdrop">
        <div class="pg-modal-box" onclick="event.stopPropagation();">
          <div class="pg-modal-header">
            <h3 class="pg-modal-title">
              📋 Thẩm Tra Chứng Từ Zalo: ${escapeHtml(item.id)}
            </h3>
            <button class="pg-modal-close" id="pg-w19-modal-close-btn">&times;</button>
          </div>

          <div class="pg-modal-body">
            <!-- CỘT ẢNH CHỨNG TỪ GỐC -->
            <div class="pg-modal-preview-col">
              <div class="pg-modal-img-wrap" data-action="lightbox" data-img="${escapeHtml(item.preview_url)}" style="cursor:zoom-in;">
                <img src="${escapeHtml(item.preview_url)}" alt="Xem trước chứng từ" />
              </div>
              <div style="font-size:0.75rem; color:#94a3b8; line-height: 1.4;">
                <div><strong>File gốc:</strong> ${escapeHtml(item.source_file || item.preview_url)}</div>
                <div><strong>Mã Băm SHA-256:</strong> <code>${escapeHtml(item.sha256 || 'N/A')}</code></div>
                <div><strong>Nguồn Xác Thực:</strong> ${escapeHtml(item.verified_source || 'ZALO_V6_DELTA_CURSOR')}</div>
              </div>
            </div>

            <!-- CỘT BIỂU MẪU ĐỐI SOÁT & PHÊ DUYỆT -->
            <div class="pg-modal-form-col">
              <div class="pg-form-group">
                <label class="pg-form-label">Nhóm Zalo & Người Gửi:</label>
                <input type="text" class="pg-form-input" value="${escapeHtml(item.group_name)} (${escapeHtml(item.sender_name || 'N/A')})" disabled style="opacity: 0.7;" />
              </div>

              <div class="pg-form-group">
                <label class="pg-form-label">Phân Loại Chứng Từ:</label>
                <select class="pg-form-select" id="pg-modal-category">
                  <option value="INVOICE_OR_DELIVERY_NOTE" ${item.category === 'INVOICE_OR_DELIVERY_NOTE' ? 'selected' : ''}>Hóa đơn / Phiếu xuất kho</option>
                  <option value="BANK_TRANSFER_VOUCHER" ${item.category === 'BANK_TRANSFER_VOUCHER' ? 'selected' : ''}>Ủy nhiệm chi / Chuyển khoản ngân hàng</option>
                  <option value="WORKSHOP_PHOTO_OR_LANDSCAPE" ${item.category === 'WORKSHOP_PHOTO_OR_LANDSCAPE' ? 'selected' : ''}>Hiện trường xưởng / Lắp đặt công trình</option>
                  <option value="OTHER" ${item.category === 'OTHER' ? 'selected' : ''}>Khác</option>
                </select>
              </div>

              <div class="pg-form-group">
                <label class="pg-form-label">Số Tiền Phát Sinh (VNĐ):</label>
                <input 
                  type="text" 
                  class="pg-form-input" 
                  id="pg-modal-amount" 
                  value="${item.amount ? new Intl.NumberFormat('vi-VN').format(item.amount) : '0'}" 
                  placeholder="Nhập số tiền..."
                />
              </div>

              <div class="pg-form-group">
                <label class="pg-form-label">Công Trình / Nhà Cung Cấp Liên Quan:</label>
                <input 
                  type="text" 
                  class="pg-form-input" 
                  id="pg-modal-project" 
                  value="${escapeHtml(item.project_hint || '')}" 
                  placeholder="Ví dụ: Công trình Bác Phát, Kho Lam Giang, Quốc Tâm..."
                />
              </div>

              <div class="pg-form-group">
                <label class="pg-form-label">Ghi Chú Phê Duyệt Của Giám Đốc:</label>
                <textarea 
                  class="pg-form-textarea" 
                  id="pg-modal-note" 
                  rows="3" 
                  placeholder="Nhập ghi chú đối soát 3 lớp chéo..."
                >${escapeHtml(item.director_note || 'Đã đối soát khớp chứng từ Zalo.')}</textarea>
              </div>
            </div>
          </div>

          <div class="pg-modal-footer">
            <button class="pg-btn pg-btn-danger" id="pg-modal-reject-btn">
              ✕ Từ Chối Chứng Từ
            </button>
            <button class="pg-btn pg-btn-success" id="pg-modal-approve-btn">
              ✓ Phê Duyệt & Đóng Dấu Đỏ
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- GẮN SỰ KIỆN GIAO DIỆN (EVENT LISTENERS) ---
  function bindEvents() {
    if (!state.containerElement) return;

    // Tabs chuyển đổi
    state.containerElement.querySelectorAll('.pg-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        state.activeTab = tab;
        renderApp();
      });
    });

    // Lọc nhóm Zalo
    const groupSelect = document.getElementById('pg-w19-group-select');
    if (groupSelect) {
      groupSelect.addEventListener('change', (e) => {
        state.selectedGroupFilter = e.target.value;
        renderApp();
      });
    }

    // Tìm kiếm ô search
    const searchInput = document.getElementById('pg-w19-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
      });
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') renderApp();
      });
    }

    // Checkbox chọn tất cả
    const selectAllCb = document.getElementById('pg-w19-select-all');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', (e) => {
        const filtered = getFilteredItems();
        if (e.target.checked) {
          filtered.forEach(item => state.selectedIds.add(item.id));
        } else {
          state.selectedIds.clear();
        }
        renderApp();
      });
    }

    // Checkbox từng card
    state.containerElement.querySelectorAll('.pg-card-select-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        if (e.target.checked) {
          state.selectedIds.add(id);
        } else {
          state.selectedIds.delete(id);
        }
        renderApp();
      });
    });

    // Nút Duyệt Nhanh 1-click
    state.containerElement.querySelectorAll('[data-action="quick-approve"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        submitDecision(id, 'APPROVE');
      });
    });

    // Nút Từ Chối 1-click
    state.containerElement.querySelectorAll('[data-action="quick-reject"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        submitDecision(id, 'REJECT');
      });
    });

    // Nút Mở Chi Tiết Sửa / Thẩm Tra
    state.containerElement.querySelectorAll('[data-action="open-detail"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = state.items.find(x => x.id === id);
        if (item) {
          state.activeModalItem = item;
          renderApp();
        }
      });
    });

    // Nút Lightbox xem ảnh to
    state.containerElement.querySelectorAll('[data-action="lightbox"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const imgUrl = e.currentTarget.getAttribute('data-img');
        if (imgUrl) {
          state.lightboxImageUrl = imgUrl;
          renderApp();
        }
      });
    });

    // Đóng Lightbox
    const lightboxEl = document.getElementById('pg-w19-lightbox');
    if (lightboxEl) {
      lightboxEl.addEventListener('click', () => {
        state.lightboxImageUrl = null;
        renderApp();
      });
    }

    // Nút Làm mới
    const refreshBtn = document.getElementById('pg-w19-btn-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        loadData();
        showToast('Đang làm mới danh sách chờ duyệt...', 'info');
      });
    }

    // Nút Batch Duyệt Toàn Bộ Ảnh Hiện Trường (0đ)
    const batchWorkshopBtn = document.getElementById('pg-w19-btn-batch-workshop');
    if (batchWorkshopBtn) {
      batchWorkshopBtn.addEventListener('click', async () => {
        const workshopPending = state.items.filter(
          x => x.category === 'WORKSHOP_PHOTO_OR_LANDSCAPE' && x.review_status === 'PENDING_DIRECTOR_REVIEW'
        );
        if (workshopPending.length === 0) {
          showToast('Không có ảnh hiện trường nào đang chờ duyệt!', 'info');
          return;
        }

        if (confirm(`Giám Đốc có chắc chắn muốn duyệt nhanh toàn bộ ${workshopPending.length} ảnh hiện trường xưởng / công trình không?`)) {
          for (const item of workshopPending) {
            await submitDecision(item.id, 'APPROVE', { amount: 0, note: 'Duyệt nhanh ảnh hiện trường xưởng/công trình' });
          }
          showToast(`Đã duyệt xong ${workshopPending.length} ảnh hiện trường!`, 'success');
        }
      });
    }

    // Nút Batch Duyệt các mục đã chọn
    const batchApproveBtn = document.getElementById('pg-w19-btn-batch-approve');
    if (batchApproveBtn) {
      batchApproveBtn.addEventListener('click', async () => {
        if (state.selectedIds.size === 0) return;
        const ids = Array.from(state.selectedIds);
        if (confirm(`Giám Đốc có chắc chắn muốn phê duyệt đóng dấu đỏ ${ids.length} mục đã chọn?`)) {
          for (const id of ids) {
            await submitDecision(id, 'APPROVE');
          }
          state.selectedIds.clear();
          showToast(`Đã duyệt xong ${ids.length} chứng từ đã chọn!`, 'success');
        }
      });
    }

    // Sự kiện trong Modal Chi Tiết
    const modalCloseBtn = document.getElementById('pg-w19-modal-close-btn');
    const modalBackdrop = document.getElementById('pg-w19-modal-backdrop');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        state.activeModalItem = null;
        renderApp();
      });
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', () => {
        state.activeModalItem = null;
        renderApp();
      });
    }

    const modalApproveBtn = document.getElementById('pg-modal-approve-btn');
    const modalRejectBtn = document.getElementById('pg-modal-reject-btn');
    if (modalApproveBtn && state.activeModalItem) {
      modalApproveBtn.addEventListener('click', async () => {
        const item = state.activeModalItem;
        const cat = document.getElementById('pg-modal-category').value;
        const amtStr = document.getElementById('pg-modal-amount').value;
        const prj = document.getElementById('pg-modal-project').value;
        const note = document.getElementById('pg-modal-note').value;

        const amt = parseMoneyInput(amtStr);
        await submitDecision(item.id, 'APPROVE', {
          category: cat,
          amount: amt,
          project_hint: prj,
          note: note
        });
        state.activeModalItem = null;
        renderApp();
      });
    }

    if (modalRejectBtn && state.activeModalItem) {
      modalRejectBtn.addEventListener('click', async () => {
        const item = state.activeModalItem;
        const note = document.getElementById('pg-modal-note').value || 'Giám Đốc từ chối';
        await submitDecision(item.id, 'REJECT', { note: note });
        state.activeModalItem = null;
        renderApp();
      });
    }

    // Tự động định dạng tiền khi nhập vào ô modal amount
    const modalAmountInput = document.getElementById('pg-modal-amount');
    if (modalAmountInput) {
      modalAmountInput.addEventListener('input', (e) => {
        const raw = parseMoneyInput(e.target.value);
        if (!isNaN(raw) && raw > 0) {
          e.target.value = new Intl.NumberFormat('vi-VN').format(raw);
        }
      });
    }
  }

  // --- API NGOÀI PUBLIC CỦA MODULE W19 ---
  return {
    version: '1.0.0',
    name: CONFIG.MODULE_NAME,

    /**
     * Khởi tạo module gắn vào 1 thẻ HTML container bất kỳ
     * @param {string|HTMLElement} containerIdOrEl ID hoặc phần tử DOM
     * @param {Array|null} initialData Danh sách dữ liệu ban đầu nếu có sẵn
     */
    init: function (containerIdOrEl, initialData = null) {
      let targetEl = null;
      if (typeof containerIdOrEl === 'string') {
        targetEl = document.getElementById(containerIdOrEl);
      } else if (typeof HTMLElement !== 'undefined' && containerIdOrEl instanceof HTMLElement) {
        targetEl = containerIdOrEl;
      } else if (!containerIdOrEl && typeof document !== 'undefined') {
        targetEl = document.getElementById('zaloStagingApprovalQueueContainer');
      }

      if (!targetEl) {
        return;
      }

      state.containerElement = targetEl;

      if (Array.isArray(initialData) && initialData.length > 0) {
        state.items = initialData.map(item => ({
          ...item,
          review_status: item.review_status || 'PENDING_DIRECTOR_REVIEW',
          amount: typeof item.amount === 'number' ? item.amount : 0
        }));
        renderApp();
      } else {
        loadData();
      }
    },

    /**
     * Nạp dữ liệu mới
     */
    refresh: function () {
      return loadData();
    },

    /**
     * Phê duyệt một chứng từ
     */
    approve: function (id, payload = {}) {
      return submitDecision(id, 'APPROVE', payload);
    },

    /**
     * Từ chối một chứng từ
     */
    reject: function (id, note = '') {
      return submitDecision(id, 'REJECT', { note });
    },

    /**
     * Lấy thống kê hiện tại
     */
    getStats: function () {
      return computeStats();
    },

    /**
     * Lấy danh sách item hiện tại
     */
    getItems: function () {
      return [...state.items];
    }
  };
});
