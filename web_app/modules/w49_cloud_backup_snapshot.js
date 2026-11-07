/**
 * PG HOME LUXURY - MODULE W49: CLOUD BACKUP & SNAPSHOT ENGINE
 * Quản trị & Vận hành: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * MST/ĐKKD: 042203002931 | Hotline: 0986.722.324
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * 
 * Tính năng chính:
 * 1. Tạo và xuất bản chụp dự phòng hệ thống (Snapshot Backup JSON) chuẩn schema 2026.
 * 2. Tải trực tiếp file Snapshot về máy tính Giám Đốc chỉ với 1 chạm.
 * 3. Đồng bộ nạp bản Snapshot lên Cloud Server (/api/save-state) 1 chạm tức thì.
 * 4. Khôi phục toàn vẹn dữ liệu từ file Snapshot với cơ chế kiểm tra tính hợp lệ đa lớp.
 * 5. Giao diện trực quan tích hợp nhanh vào Web App PG Home.
 */

(function (window) {
  'use strict';

  // Thông tin thương hiệu và pháp lý chuẩn Phú Gia
  const BRAND_LEGAL = {
    company: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    business_code: '042203002931',
    representative: 'Nguyễn Trọng Nghĩa',
    director: 'Nguyễn Viết Nghĩa',
    address_office: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    hotline: '0986.722.324',
    email: 'pghomehatinh@gmail.com',
    engine_version: 'W49-Snapshot-V2.6'
  };

  // Helper tính toán checksum đơn giản chống can thiệp file
  function calculateChecksum(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return 'PG_' + Math.abs(hash).toString(16).toUpperCase();
  }

  // Format thời gian hiển thị thân thiện
  function formatTimestamp(isoStr) {
    try {
      const d = isoStr ? new Date(isoStr) : new Date();
      return d.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return isoStr || '';
    }
  }

  // Thông báo toast tiện lợi
  function showToast(message, type = 'info') {
    if (window.PG_Toast && typeof window.PG_Toast.show === 'function') {
      window.PG_Toast.show(message, type);
      return;
    }
    const toastId = 'pg-w49-toast-container';
    let container = document.getElementById(toastId);
    if (!container) {
      container = document.createElement('div');
      container.id = toastId;
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
      success: { bg: '#065F46', border: '#10B981', text: '#ECFDF5', icon: '✅' },
      error: { bg: '#7F1D1D', border: '#EF4444', text: '#FEF2F2', icon: '⚠️' },
      info: { bg: '#1E293B', border: '#38BDF8', text: '#F0F9FF', icon: 'ℹ️' },
      warning: { bg: '#78350F', border: '#F59E0B', text: '#FFFBEB', icon: '⚡' }
    };
    const c = colors[type] || colors.info;

    toast.style.cssText = `
      background: ${c.bg};
      border-left: 4px solid ${c.border};
      color: ${c.text};
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      font-size: 13.5px;
      pointer-events: auto;
      max-width: 420px;
      line-height: 1.4;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    `;
    toast.innerHTML = `<span>${c.icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Lấy dữ liệu hệ thống trực tiếp từ bộ nhớ hoặc cloud
  async function resolveCurrentState(customState = null) {
    if (customState && typeof customState === 'object') {
      return customState;
    }
    if (window.PG_HOME_STATE && typeof window.PG_HOME_STATE === 'object') {
      return JSON.parse(JSON.stringify(window.PG_HOME_STATE));
    }
    if (window.appState && typeof window.appState === 'object') {
      return JSON.parse(JSON.stringify(window.appState));
    }
    if (window.pgState && typeof window.pgState === 'object') {
      return JSON.parse(JSON.stringify(window.pgState));
    }

    // Fallback: Thử tải từ API /api/load-state
    try {
      const resp = await fetch('/api/load-state');
      if (resp.ok) {
        const json = await resp.json();
        return json.data || json.state || {};
      }
    } catch (err) {
      console.warn('[W49] Không thể fetch state từ /api/load-state:', err);
    }
    return {};
  }

  // Định nghĩa Engine Module W49
  const W49 = {
    info: BRAND_LEGAL,

    /**
     * Tạo bản chụp Snapshot JSON hoàn chỉnh
     * @param {Object} [customState] - State tùy chọn nếu không lấy từ bộ nhớ
     * @returns {Promise<Object>} Snapshot Object
     */
    async createSnapshot(customState = null) {
      const stateData = await resolveCurrentState(customState);
      const now = new Date();
      const isoNow = now.toISOString();

      const rawJsonString = JSON.stringify(stateData);
      const snapshot = {
        _schema: 'PG_HOME_LUXURY_SNAPSHOT_V2026',
        _legal: BRAND_LEGAL,
        snapshot_id: 'SNAP_' + now.getTime(),
        created_at: isoNow,
        created_by: 'Giám Đốc Nguyễn Viết Nghĩa',
        data_checksum: calculateChecksum(rawJsonString),
        state_summary: {
          keys_count: Object.keys(stateData).length,
          projects_count: Array.isArray(stateData.projects) ? stateData.projects.length : (stateData.projects ? Object.keys(stateData.projects).length : 0),
          contracts_count: Array.isArray(stateData.contracts) ? stateData.contracts.length : 0,
          attendance_count: Array.isArray(stateData.attendance) ? stateData.attendance.length : 0,
          payload_size_kb: Math.round(rawJsonString.length / 1024 * 10) / 10
        },
        payload: stateData
      };

      return snapshot;
    },

    /**
     * Tải bản Snapshot Backup về máy tính Giám Đốc 1 Chạm
     * @param {Object} [customState] 
     * @returns {Promise<boolean>}
     */
    async downloadSnapshot(customState = null) {
      try {
        showToast('Đang kết xuất bản chụp Snapshot hệ thống...', 'info');
        const snapshot = await this.createSnapshot(customState);
        const jsonString = JSON.stringify(snapshot, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });

        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mi = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const filename = `PG_Home_Snapshot_${yyyy}${mm}${dd}_${hh}${mi}${ss}.json`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        showToast(`Đã tải bản chụp về máy: <strong>${filename}</strong> (${snapshot.state_summary.payload_size_kb} KB)`, 'success');

        // Ghi nhận audit log (nếu có endpoint)
        this.logAudit('DOWNLOAD_SNAPSHOT', { filename, snapshot_id: snapshot.snapshot_id });
        return true;
      } catch (err) {
        console.error('[W49] Lỗi tải Snapshot:', err);
        showToast('Lỗi khi tải bản chụp: ' + (err.message || err), 'error');
        return false;
      }
    },

    /**
     * Nạp Snapshot lên Cloud Server 1 Chạm (/api/save-state)
     * @param {Object} [snapshotData]
     * @returns {Promise<boolean>}
     */
    async uploadSnapshotToCloud(snapshotData = null) {
      try {
        showToast('Đang nạp bản Snapshot lên Cloud Server...', 'info');
        let payloadState;

        if (snapshotData) {
          payloadState = snapshotData.payload ? snapshotData.payload : snapshotData;
        } else {
          payloadState = await resolveCurrentState();
        }

        const resp = await fetch('/api/save-state', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor': 'Director_NguyenVietNghia',
            'X-Role': 'ADMIN'
          },
          body: JSON.stringify({
            state: payloadState,
            _backup_meta: {
              uploaded_at: new Date().toISOString(),
              legal: BRAND_LEGAL.company,
              actor: 'Giám Đốc Nguyễn Viết Nghĩa'
            }
          })
        });

        if (!resp.ok) {
          throw new Error(`Cloud server phản hồi mã HTTP ${resp.status}`);
        }

        const resJson = await resp.json();
        showToast('Đã sao lưu và lưu trữ thành công lên Cloud Server!', 'success');

        // Cập nhật bộ nhớ window nếu khớp
        if (window.PG_HOME_STATE) {
          window.PG_HOME_STATE = payloadState;
        }

        this.logAudit('CLOUD_BACKUP_PUSH', { status: 'SUCCESS', response: resJson });
        return true;
      } catch (err) {
        console.error('[W49] Lỗi nạp Cloud:', err);
        showToast('Lỗi khi nạp Snapshot lên Cloud: ' + (err.message || err), 'error');
        return false;
      }
    },

    /**
     * Đọc file JSON do Giám Đốc chọn và khôi phục dữ liệu
     * @param {File} file 
     * @param {boolean} [autoPushCloud=true] - Tự động đẩy lên Cloud sau khi khôi phục
     * @returns {Promise<Object>}
     */
    async restoreFromFile(file, autoPushCloud = true) {
      if (!file) {
        showToast('Vui lòng chọn một file Snapshot JSON hợp lệ!', 'warning');
        return null;
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target.result;
            const parsed = JSON.parse(content);

            // Kiểm tra tính hợp lệ cơ bản
            const restoredState = parsed.payload ? parsed.payload : parsed;
            if (!restoredState || typeof restoredState !== 'object') {
              throw new Error('Cấu trúc file sao lưu không hợp lệ.');
            }

            // Đồng bộ vào window state
            if (window.PG_HOME_STATE) {
              window.PG_HOME_STATE = restoredState;
            }
            if (window.appState) {
              window.appState = restoredState;
            }

            showToast('Khôi phục dữ liệu bộ nhớ cục bộ thành công!', 'success');

            if (autoPushCloud) {
              await this.uploadSnapshotToCloud(restoredState);
            }

            this.logAudit('RESTORE_FROM_FILE', {
              fileName: file.name,
              fileSize: file.size,
              snapshot_id: parsed.snapshot_id || 'UNKNOWN'
            });

            resolve(restoredState);
          } catch (err) {
            console.error('[W49] Lỗi parse file khôi phục:', err);
            showToast('Lỗi khi đọc file khôi phục: ' + (err.message || err), 'error');
            reject(err);
          }
        };

        reader.onerror = (err) => {
          showToast('Lỗi đọc file từ thiết bị!', 'error');
          reject(err);
        };

        reader.readAsText(file, 'utf-8');
      });
    },

    /**
     * Khôi phục trực tiếp từ Cloud Server (/api/load-state)
     * @returns {Promise<Object|null>}
     */
    async restoreFromCloud() {
      try {
        showToast('Đang tải dữ liệu gốc từ Cloud Server...', 'info');
        const resp = await fetch('/api/load-state');
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        const json = await resp.json();
        const state = json.data || json.state || {};

        if (window.PG_HOME_STATE) window.PG_HOME_STATE = state;
        if (window.appState) window.appState = state;

        showToast('Đã tải và khôi phục dữ liệu từ Cloud thành công!', 'success');
        this.logAudit('RESTORE_FROM_CLOUD', { status: 'SUCCESS' });
        return state;
      } catch (err) {
        console.error('[W49] Lỗi khôi phục từ Cloud:', err);
        showToast('Không thể tải từ Cloud: ' + (err.message || err), 'error');
        return null;
      }
    },

    /**
     * Ghi nhận audit log an toàn
     */
    async logAudit(action, details = {}) {
      try {
        fetch('/api/audit-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module: 'W49_CLOUD_BACKUP',
            action,
            details,
            actor: 'Director_NguyenVietNghia',
            timestamp: new Date().toISOString()
          })
        }).catch(() => {});
      } catch (e) {
        // Silently skip
      }
    },

    /**
     * Tạo Widget Giao Diện 1 Chạm chuẩn PG Home Luxury
     * @param {string|HTMLElement} container
     */
    renderUI(container) {
      const target = typeof container === 'string' ? document.getElementById(container) : container;
      if (!target) {
        console.warn('[W49] Không tìm thấy container để render UI');
        return;
      }

      const widgetHtml = `
        <div class="pg-w49-card" style="
          background: linear-gradient(145deg, #0F172A 0%, #1E293B 100%);
          border: 1px solid rgba(217, 119, 6, 0.35);
          border-radius: 12px;
          padding: 20px;
          color: #F8FAFC;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          max-width: 680px;
          margin: 15px auto;
        ">
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 16px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 22px;">🛡️</span>
                <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #F59E0B; letter-spacing: 0.3px;">
                  BẢN CHỤP DỰ PHÒNG & SAO LƯU CLOUD (1 CHẠM)
                </h3>
              </div>
              <p style="margin: 4px 0 0 30px; font-size: 12px; color: #94A3B8;">
                Phân hệ Giám Đốc | ${BRAND_LEGAL.company} • Hotline: ${BRAND_LEGAL.hotline}
              </p>
            </div>
            <span style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid #10B981; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">
              SẴN SÀNG V2.6
            </span>
          </div>

          <!-- Feature Description -->
          <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5; margin-bottom: 18px;">
            Tạo bản chụp Snapshot tức thời toàn bộ dữ liệu quản trị, dự án, chấm công, bảng lương và CCSC. Tải file an toàn về máy tính Giám Đốc hoặc nạp trực tiếp lên Cloud Server chống rủi ro mất dữ liệu.
          </p>

          <!-- Action Buttons -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 18px;">
            <!-- Download Button -->
            <button id="pg-w49-btn-download" style="
              background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
              color: #FFFFFF;
              border: none;
              padding: 12px 14px;
              border-radius: 8px;
              font-size: 13.5px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
              transition: all 0.2s ease;
            ">
              <span>📸</span> Tải Bản Chụp Về Máy
            </button>

            <!-- Push Cloud Button -->
            <button id="pg-w49-btn-cloud" style="
              background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
              color: #FFFFFF;
              border: none;
              padding: 12px 14px;
              border-radius: 8px;
              font-size: 13.5px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
              transition: all 0.2s ease;
            ">
              <span>☁️</span> Nạp Lên Cloud (1 Chạm)
            </button>

            <!-- Restore from File Button -->
            <label for="pg-w49-file-input" style="
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: #FFFFFF;
              border: none;
              padding: 12px 14px;
              border-radius: 8px;
              font-size: 13.5px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
              transition: all 0.2s ease;
              text-align: center;
            ">
              <span>📥</span> Khôi Phục Từ File
            </label>
            <input type="file" id="pg-w49-file-input" accept=".json" style="display: none;" />
          </div>

          <!-- Footer Info -->
          <div style="background: rgba(0,0,0,0.25); border-radius: 6px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: #94A3B8;">
            <span>📍 Văn phòng: ${BRAND_LEGAL.address_office}</span>
            <span id="pg-w49-last-action">Trạng thái: Đã kết nối Cloud API</span>
          </div>
        </div>
      `;

      target.innerHTML = widgetHtml;

      // Gắn sự kiện click
      const btnDownload = target.querySelector('#pg-w49-btn-download');
      const btnCloud = target.querySelector('#pg-w49-btn-cloud');
      const fileInput = target.querySelector('#pg-w49-file-input');
      const statusLabel = target.querySelector('#pg-w49-last-action');

      if (btnDownload) {
        btnDownload.addEventListener('click', async () => {
          btnDownload.disabled = true;
          btnDownload.style.opacity = '0.7';
          await W49.downloadSnapshot();
          btnDownload.disabled = false;
          btnDownload.style.opacity = '1';
          if (statusLabel) statusLabel.textContent = `Đã tải bản chụp lúc: ${formatTimestamp()}`;
        });
      }

      if (btnCloud) {
        btnCloud.addEventListener('click', async () => {
          btnCloud.disabled = true;
          btnCloud.style.opacity = '0.7';
          await W49.uploadSnapshotToCloud();
          btnCloud.disabled = false;
          btnCloud.style.opacity = '1';
          if (statusLabel) statusLabel.textContent = `Đã lưu Cloud lúc: ${formatTimestamp()}`;
        });
      }

      if (fileInput) {
        fileInput.addEventListener('change', async (ev) => {
          const file = ev.target.files && ev.target.files[0];
          if (!file) return;

          const confirmRestore = window.confirm(
            `XÁC NHẬN KHÔI PHỤC DỮ LIỆU?\n\nBạn đang chuẩn bị khôi phục từ file:\n${file.name}\n\nDữ liệu hiện tại sẽ được ghi đè và nạp lên Cloud Server PG Home.`
          );

          if (!confirmRestore) {
            fileInput.value = '';
            return;
          }

          try {
            await W49.restoreFromFile(file, true);
            if (statusLabel) statusLabel.textContent = `Đã khôi phục từ file lúc: ${formatTimestamp()}`;
          } catch (e) {
            // Error đã toast
          } finally {
            fileInput.value = '';
          }
        });
      }
    }
  };

  // Đăng ký toàn cục
  window.PG_Modules_W49 = W49;

  // Tự động khởi tạo nếu có container chỉ định
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const defaultContainer = document.getElementById('pg-w49-backup-container');
      if (defaultContainer) {
        W49.renderUI(defaultContainer);
      }
    });
  } else {
    const defaultContainer = document.getElementById('pg-w49-backup-container');
    if (defaultContainer) {
      W49.renderUI(defaultContainer);
    }
  }

})(typeof window !== 'undefined' ? window : this);
