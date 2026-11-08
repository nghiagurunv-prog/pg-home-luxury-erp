/**
 * ============================================================================
 * PG HOME LUXURY - ENTERPRISE SERVICE WORKER (PWA)
 * HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG
 * Mã số HKD: 042203002931 | Hotline: 0986.722.324
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * ============================================================================
 * Phiên bản Cache: pg-home-erp-v2026.11.08
 * Chiến lược:
 *   1. Network-First kèm Cache Fallback: Cho /api/load-state và /data/*.json
 *      -> Luôn lấy state mới nhất khi trực tuyến; ngoại tuyến lấy cache tức thì.
 *   2. Stale-While-Revalidate: Cho file tĩnh (.js, .css, .html, .png, .woff2, ...)
 *      -> Tốc độ phản hồi tức thời từ cache, âm thầm cập nhật bản mới ngầm.
 *   3. Precache an toàn bằng Promise.allSettled:
 *      -> Nạp đủ 50 Module W01 - W50 và giao diện cốt lõi; không gãy SW khi lỗi file lẻ.
 * ============================================================================
 */

const CACHE_NAME = 'pg-home-erp-v2026.11.08';

// Danh mục toàn bộ tài nguyên cốt lõi và 50 Module W01 - W50 cần precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // 50 Module tối ưu thực tế trong /modules/ (W01 - W50)
  '/modules/w01_executive_kpi_bar.js',
  '/modules/w02_ccsc_12months_engine.js',
  '/modules/w03_core_worker_fund_hoa_hao.js',
  '/modules/w04_sales_bonus_500m_lock.js',
  '/modules/w05_attendance_t10_matrix.js',
  '/modules/w06_project_bac_phat_tracker.js',
  '/modules/w07_project_anh_nam_cnc_norm.js',
  '/modules/w08_pricing_3tiers_validator.js',
  '/modules/w09_intersection_deduction_tool.js',
  '/modules/w10_supplier_board_3ncc.js',
  '/modules/w11_supplier_fitting_glass_stone.js',
  '/modules/w12_three_layer_cashflow_guard.js',
  '/modules/w13_red_stamp_po_approval.js',
  '/modules/w14_rbac_4_portals_guard.js',
  '/modules/w15_legal_brand_enforcer.js',
  '/modules/w16_zalo_v6_stealth_cockpit.js',
  '/modules/w17_zalo_175_groups_explorer.js',
  '/modules/w18_filenoise_xor_status.js',
  '/modules/w19_zalo_staging_approval_queue.js',
  '/modules/w20_contracts_docx_vault.js',
  '/modules/w21_quotations_excel_vault.js',
  '/modules/w22_technical_drawings_pdf_vault.js',
  '/modules/w23_po_zalo_2026_analytics.js',
  '/modules/w24_material_catalog_search.js',
  '/modules/w25_lam_giang_debt_reconciler.js',
  '/modules/w26_print_a4_quotation_engine.js',
  '/modules/w27_csv_excel_export_helper.js',
  '/modules/w28_offline_sync_outbox.js',
  '/modules/w29_command_palette_ctrl_k.js',
  '/modules/w30_realtime_health_badge.js',
  '/modules/w31_solid_wood_separator.js',
  '/modules/w32_cnc_8categories_reference.js',
  '/modules/w33_verified_entities_inspector.js',
  '/modules/w34_telemetry_performance_chart.js',
  '/modules/w35_zero_trust_audit_viewer.js',
  '/modules/w36_customer_receivables_aging.js',
  '/modules/w37_workshop_productivity_kpi.js',
  '/modules/w38_management_salary_pool.js',
  '/modules/w39_debt_60min_sla_timer.js',
  '/modules/w40_leveldb_keyword_highlighter.js',
  '/modules/w41_luxury_gold_theme_tokens.css',
  '/modules/w42_print_a4_stylesheet.css',
  '/modules/w43_keyboard_shortcuts_manager.js',
  '/modules/w44_data_integrity_guard.js',
  '/modules/w45_safe_pocket_summary_card.js',
  '/modules/w46_mkt_safety_monitor_widget.js',
  '/modules/w47_audit_trail_timeline.js',
  '/modules/w48_delta_cursor_inspector.js',
  '/modules/w49_cloud_backup_snapshot.js',
  '/modules/w50_master_hub_loader.js',
  // Các đường dẫn tương đối dự phòng bổ trợ
  './modules/w01_executive_kpi_bar.js',
  './modules/w02_ccsc_12months_engine.js',
  './modules/w03_core_worker_fund_hoa_hao.js',
  './modules/w04_sales_bonus_500m_lock.js',
  './modules/w05_attendance_t10_matrix.js',
  './modules/w06_project_bac_phat_tracker.js',
  './modules/w07_project_anh_nam_cnc_norm.js',
  './modules/w08_pricing_3tiers_validator.js',
  './modules/w09_intersection_deduction_tool.js',
  './modules/w10_supplier_board_3ncc.js',
  './modules/w11_supplier_fitting_glass_stone.js',
  './modules/w12_three_layer_cashflow_guard.js',
  './modules/w13_red_stamp_po_approval.js',
  './modules/w14_rbac_4_portals_guard.js',
  './modules/w15_legal_brand_enforcer.js',
  './modules/w16_zalo_v6_stealth_cockpit.js',
  './modules/w17_zalo_175_groups_explorer.js',
  './modules/w18_filenoise_xor_status.js',
  './modules/w19_zalo_staging_approval_queue.js',
  './modules/w20_contracts_docx_vault.js',
  './modules/w21_quotations_excel_vault.js',
  './modules/w22_technical_drawings_pdf_vault.js',
  './modules/w23_po_zalo_2026_analytics.js',
  './modules/w24_material_catalog_search.js',
  './modules/w25_lam_giang_debt_reconciler.js',
  './modules/w26_print_a4_quotation_engine.js',
  './modules/w27_csv_excel_export_helper.js',
  './modules/w28_offline_sync_outbox.js',
  './modules/w29_command_palette_ctrl_k.js',
  './modules/w30_realtime_health_badge.js',
  './modules/w31_solid_wood_separator.js',
  './modules/w32_cnc_8categories_reference.js',
  './modules/w33_verified_entities_inspector.js',
  './modules/w34_telemetry_performance_chart.js',
  './modules/w35_zero_trust_audit_viewer.js',
  './modules/w36_customer_receivables_aging.js',
  './modules/w37_workshop_productivity_kpi.js',
  './modules/w38_management_salary_pool.js',
  './modules/w39_debt_60min_sla_timer.js',
  './modules/w40_leveldb_keyword_highlighter.js',
  './modules/w41_luxury_gold_theme_tokens.css',
  './modules/w42_print_a4_stylesheet.css',
  './modules/w43_keyboard_shortcuts_manager.js',
  './modules/w44_data_integrity_guard.js',
  './modules/w45_safe_pocket_summary_card.js',
  './modules/w46_mkt_safety_monitor_widget.js',
  './modules/w47_audit_trail_timeline.js',
  './modules/w48_delta_cursor_inspector.js',
  './modules/w49_cloud_backup_snapshot.js',
  './modules/w50_master_hub_loader.js'
];

/**
 * 1. SỰ KIỆN CÀI ĐẶT (INSTALL)
 * Áp dụng Promise.allSettled để đảm bảo nếu 1 file lẻ không tải được thì Service Worker
 * vẫn cài đặt thành công, không bao giờ làm đứt gãy hệ thống offline của Bố.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log(`[PWA] Đang kích hoạt precache an toàn cho PG Home ERP (${CACHE_NAME})...`);
      
      const uniqueTargets = Array.from(new Set(PRECACHE_ASSETS));
      const precachePromises = uniqueTargets.map(async (url) => {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(url, response);
            return { url, status: 'ok' };
          } else {
            console.warn(`[PWA] Bỏ qua precache ${url} (HTTP ${response ? response.status : 'n/a'})`);
            return { url, status: 'warn' };
          }
        } catch (fetchErr) {
          console.warn(`[PWA] Lỗi mạng khi precache ${url}:`, fetchErr.message);
          return { url, status: 'error' };
        }
      });

      const settlement = await Promise.allSettled(precachePromises);
      const successCount = settlement.filter(
        (r) => r.status === 'fulfilled' && r.value.status === 'ok'
      ).length;
      console.log(`[PWA] Hoàn tất nạp precache: ${successCount}/${uniqueTargets.length} mục thành công.`);
    }).then(() => self.skipWaiting())
  );
});

/**
 * 2. SỰ KIỆN KÍCH HOẠT (ACTIVATE)
 * Tự động dọn dẹp các cache phiên bản cũ và chiếm quyền kiểm soát ngay lập tức
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log(`[PWA] Dọn dẹp cache cũ không còn sử dụng: ${k}`);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * KIỂM TRA ĐIỀU KIỆN NETWORK-FIRST
 * Áp dụng cho:
 * - /api/load-state, /api/live-state
 * - /data/*.json
 * - Các file dữ liệu JSON thực tế (ngoại trừ manifest.json)
 */
function isNetworkFirstRequest(pathname) {
  if (pathname.includes('/api/load-state') || pathname.includes('/api/live-state')) {
    return true;
  }
  if (pathname.includes('/data/')) {
    return true;
  }
  if (pathname.endsWith('.json') && !pathname.endsWith('manifest.json')) {
    return true;
  }
  return false;
}

/**
 * CHIẾN LƯỢC: NETWORK-FIRST KÈM CACHE FALLBACK
 * Khi có mạng: Lấy dữ liệu mới nhất từ máy chủ và đồng bộ ngay vào cache.
 * Khi mất mạng (Bố đi công trình): Trả ngay bản lưu trong cache, chống màn hình trắng 100%.
 */
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn(`[PWA] Mất kết nối mạng tại công trình, kích hoạt Cache Fallback cho: ${request.url}`);
    
    // Tìm trong cache (bỏ qua query string để luôn khớp bản ghi gần nhất)
    const cachedResponse = await caches.match(request, { ignoreSearch: true });
    if (cachedResponse) {
      return cachedResponse;
    }

    // Dự phòng tìm theo đường dẫn URL pathname
    const url = new URL(request.url);
    const pathnameFallback = await caches.match(url.pathname);
    if (pathnameFallback) {
      return pathnameFallback;
    }

    // Nếu là API load-state mà chưa từng được cache trực tiếp, thử lấy bản fallback mặc định
    if (url.pathname.includes('/api/load-state')) {
      const liveStateFallback = await caches.match('/api/load-state');
      if (liveStateFallback) return liveStateFallback;
    }

    throw error;
  }
}

/**
 * CHIẾN LƯỢC: STALE-WHILE-REVALIDATE
 * Phục vụ các file tĩnh (.js, .css, .html, .png, .woff2, ...)
 * Trả ngay nội dung từ cache để giao diện bật lên tức thì (0ms latency),
 * đồng thời âm thầm gửi request lên mạng để cập nhật bản mới vào cache.
 */
async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request, { ignoreSearch: true });

  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
      try {
        await cache.put(request, networkResponse.clone());
      } catch (cacheErr) {
        // Bỏ qua lỗi với một số request đặc biệt không thể lưu trữ
      }
    }
    return networkResponse;
  }).catch(() => {
    // Mất mạng ngầm khi revalidate: Không gây gián đoạn phiên làm việc
    return null;
  });

  // Nếu đã có sẵn trong cache -> Phục vụ ngay lập tức
  if (cachedResponse) {
    return cachedResponse;
  }

  // Nếu chưa có trong cache -> Chờ network response
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }

  // Fallback an toàn: Nếu đang mở trang chính mà offline và cache miss, trả về index.html
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    const fallbackHtml = await cache.match('./index.html') || await cache.match('/index.html') || await cache.match('/');
    if (fallbackHtml) {
      return fallbackHtml;
    }
  }

  throw new Error(`[PWA] Ngoại tuyến: Không tìm thấy tài nguyên trong cache: ${request.url}`);
}

/**
 * 3. SỰ KIỆN ĐIỀU PHỐI MẠNG (FETCH)
 */
self.addEventListener('fetch', (event) => {
  // Chỉ xử lý các yêu cầu HTTP GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Bỏ qua các kiểm tra cache đặc thù từ extension trình duyệt
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  const url = new URL(event.request.url);

  if (isNetworkFirstRequest(url.pathname)) {
    event.respondWith(handleNetworkFirst(event.request));
  } else {
    event.respondWith(handleStaleWhileRevalidate(event.request));
  }
});
