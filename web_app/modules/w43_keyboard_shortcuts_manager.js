/**
 * ==============================================================================
 * PG HOME LUXURY - QUẢN TRỊ DOANH NGHIỆP 2026
 * Module W43: Keyboard Shortcuts Manager (Quản lý Phím tắt Toàn cục cho Giám Đốc)
 * File: f:\PG Home - Quản trị\web_app\modules\w43_keyboard_shortcuts_manager.js
 * ==============================================================================
 * Phím tắt cốt lõi:
 * - Alt + 1..4: Chuyển nhanh 4 phân hệ quản trị (1: ADMIN, 2: XUONG_VATTU, 3: VANPHONG_SALE, 4: DU_TOAN_SALE)
 * - Ctrl + S: Kích hoạt Lưu Cloud tức thì (Save State to Cloud/Database)
 * - Ctrl + P: Xuất bản in A4 chuẩn công trình / Báo cáo quản trị
 * - Alt + Z: Mở trung tâm đồng bộ ngầm Zalo V6.0
 * ==============================================================================
 */

(function (window) {
  'use strict';

  // Định nghĩa 4 phân hệ cốt lõi theo Hiến pháp PG Home
  var MODULE_ROLES = {
    '1': { code: 'ADMIN', name: 'Phân hệ Giám Đốc (ADMIN)', selector: '[data-role="ADMIN"], #tab-admin, .tab-role-admin' },
    '2': { code: 'XUONG_VATTU', name: 'Kỹ Thuật & Vật Tư Xưởng (Vũ - XUONG_VATTU)', selector: '[data-role="XUONG_VATTU"], #tab-vattu, .tab-role-vattu' },
    '3': { code: 'VANPHONG_SALE', name: 'Sale Admin & Văn Phòng (Hiệp - VANPHONG_SALE)', selector: '[data-role="VANPHONG_SALE"], #tab-sale, .tab-role-sale' },
    '4': { code: 'DU_TOAN_SALE', name: 'Dự Toán Nhà Ở & Báo Giá (Hiệp & Dũng - DU_TOAN_SALE)', selector: '[data-role="DU_TOAN_SALE"], #tab-dutoan, .tab-role-dutoan' }
  };

  var shortcutsRegistry = {};
  var isInitialized = false;

  /**
   * Hiển thị thông báo Toast siêu nhẹ, phong cách PG Home Gold Luxury
   */
  function showToast(message, type) {
    type = type || 'info';
    var toastId = 'pg-w43-toast-container';
    var container = document.getElementById(toastId);
    if (!container) {
      container = document.createElement('div');
      container.id = toastId;
      container.style.position = 'fixed';
      container.style.bottom = '24px';
      container.style.right = '24px';
      container.style.zIndex = '999999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '8px';
      container.style.pointerEvents = 'none';
      container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      document.body.appendChild(container);
    }

    var item = document.createElement('div');
    item.style.padding = '10px 18px';
    item.style.borderRadius = '6px';
    item.style.fontSize = '13px';
    item.style.fontWeight = '600';
    item.style.boxShadow = '0 6px 16px rgba(0,0,0,0.45)';
    item.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    item.style.opacity = '0';
    item.style.transform = 'translateY(10px)';
    item.style.pointerEvents = 'auto';

    if (type === 'success') {
      item.style.background = '#0d2818';
      item.style.border = '1px solid #2d6a4f';
      item.style.color = '#52b788';
    } else if (type === 'warning') {
      item.style.background = '#2b1e06';
      item.style.border = '1px solid #7f5509';
      item.style.color = '#f0c05a';
    } else if (type === 'gold') {
      item.style.background = '#1a1608';
      item.style.border = '1px solid #d4af37';
      item.style.color = '#ffd700';
    } else {
      item.style.background = '#0e1626';
      item.style.border = '1px solid #1f355b';
      item.style.color = '#64b5f6';
    }

    item.innerHTML = '⚡ <strong>[PG Phím Tắt]</strong> ' + message;
    container.appendChild(item);

    requestAnimationFrame(function () {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });

    setTimeout(function () {
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      setTimeout(function () {
        if (item.parentNode) item.parentNode.removeChild(item);
      }, 350);
    }, 2800);
  }

  /**
   * Xử lý chuyển phân hệ Alt + 1..4
   */
  function handleSwitchModule(keyIndex) {
    var target = MODULE_ROLES[keyIndex];
    if (!target) return;

    // 1. Kiểm tra hàm toàn cục switchRole / switchTab / switchModule nếu có
    if (typeof window.switchRole === 'function') {
      window.switchRole(target.code);
    } else if (typeof window.switchModule === 'function') {
      window.switchModule(target.code);
    } else if (typeof window.setActiveTab === 'function') {
      window.setActiveTab(target.code);
    }

    // 2. Tìm click vào nút tương ứng trên DOM
    var elem = document.querySelector(target.selector);
    if (elem && typeof elem.click === 'function') {
      elem.click();
    }

    // 3. Dispatch Custom Event thông báo cho các module khác
    var evt = new CustomEvent('pg:role-switch', {
      detail: { role: target.code, name: target.name }
    });
    window.dispatchEvent(evt);

    showToast('Đã chuyển sang: ' + target.name, 'gold');
  }

  /**
   * Xử lý Lưu Cloud Ngay (Ctrl + S)
   */
  function handleSaveCloud() {
    // Gọi hàm lưu cloud nếu có
    if (typeof window.saveAllDataToCloud === 'function') {
      window.saveAllDataToCloud();
    } else if (typeof window.syncToCloud === 'function') {
      window.syncToCloud();
    } else if (typeof window.saveToCloud === 'function') {
      window.saveToCloud();
    } else if (typeof window.saveState === 'function') {
      window.saveState();
    }

    // Dispatch Event
    var evt = new CustomEvent('pg:save-cloud', {
      detail: { timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(evt);

    showToast('Đang kích hoạt đồng bộ & Lưu Cloud toàn hệ thống...', 'success');
  }

  /**
   * Xử lý In A4 Chuẩn Quản Trị (Ctrl + P)
   */
  function handlePrintA4() {
    // Thêm class print-mode nếu cần
    document.body.classList.add('pg-a4-printing');

    if (typeof window.exportA4Print === 'function') {
      window.exportA4Print();
    } else if (typeof window.printReport === 'function') {
      window.printReport();
    } else {
      window.print();
    }

    window.dispatchEvent(new CustomEvent('pg:print-a4'));
    showToast('Chuẩn bị xuất bản in khổ A4 chuẩn công trình PG Home', 'info');

    setTimeout(function () {
      document.body.classList.remove('pg-a4-printing');
    }, 1500);
  }

  /**
   * Xử lý Mở Hộp Thư Zalo V6.0 (Alt + Z)
   */
  function handleOpenZalo() {
    var zaloModal = document.getElementById('zalo-sync-modal') ||
                    document.getElementById('zalo-stealth-modal') ||
                    document.querySelector('.zalo-center-modal');

    if (zaloModal) {
      zaloModal.style.display = (zaloModal.style.display === 'none' || !zaloModal.style.display) ? 'block' : 'none';
    }

    if (typeof window.openZaloSyncCenter === 'function') {
      window.openZaloSyncCenter();
    } else if (typeof window.toggleZaloModal === 'function') {
      window.toggleZaloModal();
    }

    window.dispatchEvent(new CustomEvent('pg:open-zalo-v6', {
      detail: { source: 'shortcut_alt_z' }
    }));

    showToast('Mở Trung tâm Giám sát Đồng bộ Zalo V6.0 (Stealth)', 'gold');
  }

  /**
   * Bắt sự kiện phím toàn cục
   */
  function onKeyDown(e) {
    // Bỏ qua nếu đang gõ trên input/textarea/contenteditable trừ khi là phím điều hướng hệ thống (Alt+1..4, Ctrl+S)
    var activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    var isEditing = (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable));

    // Ctrl + S (hoặc Cmd + S): Lưu Cloud
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      handleSaveCloud();
      return;
    }

    // Ctrl + P (hoặc Cmd + P): In A4
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      e.stopPropagation();
      handlePrintA4();
      return;
    }

    // Alt + 1..4: Chuyển phân hệ
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        e.stopPropagation();
        handleSwitchModule(e.key);
        return;
      }
    }

    // Alt + Z: Mở hộp thư Zalo V6.0
    if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      e.stopPropagation();
      handleOpenZalo();
      return;
    }

    // Kiểm tra các phím tùy biến trong shortcutsRegistry
    for (var id in shortcutsRegistry) {
      if (shortcutsRegistry.hasOwnProperty(id)) {
        var sc = shortcutsRegistry[id];
        if (sc && sc.condition && sc.condition(e)) {
          if (sc.preventDefault) e.preventDefault();
          if (sc.stopPropagation) e.stopPropagation();
          sc.handler(e);
          return;
        }
      }
    }
  }

  // Khởi tạo Module Object
  var PG_Modules_W43 = {
    version: '6.0.0',
    name: 'PG_Modules_W43_KeyboardShortcutsManager',

    init: function () {
      if (isInitialized) return;
      window.addEventListener('keydown', onKeyDown, true);
      isInitialized = true;
      console.log('✅ [PG_Modules_W43] Keyboard Shortcuts Manager V6.0 đã khởi động.');
    },

    destroy: function () {
      if (!isInitialized) return;
      window.removeEventListener('keydown', onKeyDown, true);
      isInitialized = false;
      console.log('🛑 [PG_Modules_W43] Keyboard Shortcuts Manager đã dừng.');
    },

    registerShortcut: function (id, conditionFn, handlerFn, options) {
      options = options || {};
      shortcutsRegistry[id] = {
        condition: conditionFn,
        handler: handlerFn,
        preventDefault: options.preventDefault !== false,
        stopPropagation: options.stopPropagation !== false,
        description: options.description || ''
      };
    },

    unregisterShortcut: function (id) {
      delete shortcutsRegistry[id];
    },

    triggerAction: function (actionName, payload) {
      switch (actionName) {
        case 'saveCloud':
          handleSaveCloud();
          break;
        case 'printA4':
          handlePrintA4();
          break;
        case 'switchModule':
          handleSwitchModule(payload || '1');
          break;
        case 'openZalo':
          handleOpenZalo();
          break;
        default:
          console.warn('[PG_Modules_W43] Hành động không hợp lệ: ' + actionName);
      }
    },

    getShortcutsGuide: function () {
      return [
        { key: 'Alt + 1', action: 'Chuyển Phân hệ Giám Đốc (ADMIN)' },
        { key: 'Alt + 2', action: 'Chuyển Phân hệ Kỹ Thuật & Vật Tư (XUONG_VATTU)' },
        { key: 'Alt + 3', action: 'Chuyển Phân hệ Sale Admin & Văn Phòng (VANPHONG_SALE)' },
        { key: 'Alt + 4', action: 'Chuyển Phân hệ Dự Toán & Báo Giá (DU_TOAN_SALE)' },
        { key: 'Ctrl + S', action: 'Lưu Cloud / Đồng bộ cơ sở dữ liệu ngay lập tức' },
        { key: 'Ctrl + P', action: 'Xuất bản in A4 chuẩn công trình PG Home' },
        { key: 'Alt + Z', action: 'Mở Trung tâm Giám sát Đồng bộ Zalo V6.0' }
      ];
    },

    showNotification: function (msg, type) {
      showToast(msg, type);
    }
  };

  // Tự động khởi tạo khi DOM ready hoặc nạp file
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      PG_Modules_W43.init();
    });
  } else {
    PG_Modules_W43.init();
  }

  // Export toàn cục
  window.PG_Modules_W43 = PG_Modules_W43;

})(window);
