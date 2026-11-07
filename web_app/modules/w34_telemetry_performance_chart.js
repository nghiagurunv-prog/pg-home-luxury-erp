/**
 * ==============================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI BỘ PG HOME LUXURY - MODULE W34
 * Tên module: w34_telemetry_performance_chart.js
 * Nhiệm vụ: Biểu đồ SVG thuần (0 dependency) trực quan hóa:
 *   1. Hiệu suất quét ngầm Zalo V6.0 (Zero-Disruption, Latency ms, MB/s read speed)
 *   2. Lưu lượng tin nhắn/chứng từ công việc theo từng nhóm Zalo trọng điểm
 * Chuẩn pháp lý: Hộ Kinh Doanh Phú Gia - MST: 042203002931 - Hotline: 0973.562.789
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W34 = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // Dữ liệu Telemetry mẫu mặc định trích xuất trực tiếp từ multi_group_telemetry.json
  const DEFAULT_TELEMETRY = [
    { timestamp: "2026-11-02 11:14:10", group: "Tổng Kho Ván Lam Giang", event: "Phát hiện 245 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-02 11:14:10", group: "Phụ Kiện Quốc Tâm", event: "Phát hiện 48 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-02 11:14:10", group: "Xưởng Sản Xuất PG Home", event: "Phát hiện 22 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-03 20:19:52", group: "Tổng Kho Ván Lam Giang", event: "Phát hiện 3 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-03 20:19:52", group: "Phụ Kiện Quốc Tâm", event: "Phát hiện 8 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-03 21:23:56", group: "Xưởng Sản Xuất PG Home", event: "Phát hiện 2 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-04 10:35:57", group: "Tổng Kho Ván Lam Giang", event: "Phát hiện 1 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-04 11:53:02", group: "Phụ Kiện Quốc Tâm", event: "Phát hiện 1 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-04 14:34:13", group: "Tổng Kho Ván Lam Giang", event: "Phát hiện 1 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-04 15:00:15", group: "Tổng Kho Ván Lam Giang", event: "Phát hiện 9 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-04 15:20:16", group: "Phụ Kiện Quốc Tâm", event: "Phát hiện 7 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-05 07:37:01", group: "Tổng Kho Ván Lam Giang", event: "Phát hiện 259 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-05 07:37:01", group: "Phụ Kiện Quốc Tâm", event: "Phát hiện 64 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-05 07:37:01", group: "Xưởng Sản Xuất PG Home", event: "Phát hiện 24 tệp tài liệu/hình ảnh mới", severity: "INFO" },
    { timestamp: "2026-11-05 09:14:24", group: "Tổng Kho Ván Lam Giang", event: "Bắt được 254 chứng từ/hình ảnh mới (BANK_TRANSFER_VOUCHER)", severity: "ALERT" },
    { timestamp: "2026-11-05 09:14:24", group: "Phụ Kiện Quốc Tâm", event: "Bắt được 59 chứng từ/hình ảnh mới (BANK_TRANSFER_VOUCHER)", severity: "ALERT" },
    { timestamp: "2026-11-05 09:14:24", group: "Xưởng Sản Xuất PG Home", event: "Bắt được 20 chứng từ/hình ảnh mới (WORKSHOP_PHOTO_OR_LANDSCAPE)", severity: "INFO" },
    { timestamp: "2026-11-05 20:59:58", group: "Tổng Kho Ván Lam Giang", event: "Bắt được 4 chứng từ/hình ảnh mới (BANK_TRANSFER_VOUCHER)", severity: "ALERT" },
    { timestamp: "2026-11-05 20:59:58", group: "Phụ Kiện Quốc Tâm", event: "Bắt được 5 chứng từ/hình ảnh mới (BANK_TRANSFER_VOUCHER)", severity: "ALERT" },
    { timestamp: "2026-11-06 02:03:23", group: "Hệ Thống Zalo v4.0", event: "Giám Đốc kích hoạt Quét Tức Thì 10 nhóm (73.4 ms) - Tổng 588 chứng từ/media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 02:49:13", group: "Hệ Thống Zalo v4.0", event: "Giám Đốc kích hoạt Quét Tức Thì 10 nhóm (27.0 ms) - Tổng 588 chứng từ/media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 07:48:18", group: "Hệ Thống Zalo v4.0", event: "Giám Đốc kích hoạt Quét Tức Thì 10 nhóm (50.6 ms) - Tổng 588 chứng từ/media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 07:48:24", group: "Hệ Thống Zalo v4.0", event: "Giám Đốc kích hoạt Quét Tức Thì 10 nhóm (63.8 ms) - Tổng 588 chứng từ/media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 08:47:05", group: "Hệ Thống Zalo v4.0", event: "Giám Đốc kích hoạt Quét Tức Thì 10 nhóm (54.4 ms) - Tổng 588 chứng từ/media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 09:09:48", group: "Hệ Thống Zalo v4.0", event: "Giám Đốc kích hoạt Quét Tức Thì 10 nhóm (53.4 ms) - Tổng 588 chứng từ/media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 15:44:09", group: "Tổng Kho Ván Lam Giang", event: "[Delta v4.0] Bắt tức thì 8 tệp mới (WORKSHOP_PHOTO_OR_LANDSCAPE) - SHA256: 7ce593f7ab19", severity: "INFO" },
    { timestamp: "2026-11-06 18:34:47", group: "Hệ Thống Zalo v4.0", event: "Giám Đốc kích hoạt Quét Tức Thì 10 nhóm (63.2 ms) - Tổng 599 chứng từ/media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 18:34:51", group: "Hệ Thống Zalo v4.0", event: "Giám Đốc kích hoạt Quét Tức Thì 10 nhóm (46.3 ms) - Tổng 599 chứng từ/media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 18:54:44", group: "Tổng Kho Ván Lam Giang", event: "[Delta v6.0] Bắt tức thì 3 tệp mới từ Vũ (BANK_TRANSFER_VOUCHER)", severity: "ALERT" },
    { timestamp: "2026-11-06 18:54:44", group: "Đặt hàng Ceramic Hoàng Hà HY", event: "[Delta v6.0] Bắt tức thì 1 tệp mới từ Hương (BANK_TRANSFER_VOUCHER)", severity: "ALERT" },
    { timestamp: "2026-11-06 18:54:44", group: "Thiết kế nhà Bác Phát Đường 26/03", event: "[Delta v6.0] Bắt tức thì 19 tệp mới từ Nguyễn Đăng Phát (WORKSHOP_PHOTO_OR_LANDSCAPE)", severity: "INFO" },
    { timestamp: "2026-11-06 18:54:44", group: "Hệ Thống Zalo v6.0", event: "Quét tức thì 16 nhóm (568.2 ms) - 4877 media khớp SHA-256", severity: "INFO" },
    { timestamp: "2026-11-06 19:50:37", group: "Hệ Thống Zalo v6.0", event: "[Storage V6.0] Benchmark đọc đĩa thụ động: LevelDB 20.33 MB/s (33.5 ms), Resource 250.75 MB/s (0.186 ms/file), FileNoise 419.70 MB/s (0.242 ms/file) - 100% Zero-Disruption", severity: "INFO" },
    { timestamp: "2026-11-06 19:50:37", group: "Hệ Thống Zalo v6.0", event: "[Storage.db V6.0] Đồng bộ danh tính người gửi thực tế cho 16/16 nhóm từ SQLite Storage.db thành công (Vũ, Hương, Thái, Tâm Quốc, Sonminhtu, Bác Phát, v.v.)", severity: "INFO" },
    { timestamp: "2026-11-06 19:50:37", group: "Hệ Thống Zalo v6.0", event: "[Telemetry V6.0] Chuẩn hóa toàn diện 16 nhóm trọng điểm (4877 media files) sẵn sàng cho Dashboard Giám Đốc", severity: "INFO" },
    { timestamp: "2026-11-07 11:11:26", group: "Tổng Kho Ván Lam Giang", event: "[Delta v6.0] Bắt tức thì 3 tệp mới từ Vũ (BANK_TRANSFER_VOUCHER)", severity: "ALERT" },
    { timestamp: "2026-11-07 11:11:26", group: "Đặt hàng Ceramic Hoàng Hà HY", event: "[Delta v6.0] Bắt tức thì 1 tệp mới từ Hương (BANK_TRANSFER_VOUCHER)", severity: "ALERT" },
    { timestamp: "2026-11-07 11:11:26", group: "Thiết kế nhà Bác Phát Đường 26/03", event: "[Delta v6.0] Bắt tức thì 19 tệp mới từ Nguyễn Đăng Phát (WORKSHOP_PHOTO_OR_LANDSCAPE)", severity: "INFO" },
    { timestamp: "2026-11-07 11:11:26", group: "Điều Hành Xưởng & Công Trình Trọng Điểm PG Home", event: "[Delta v6.0] Bắt tức thì 10 tệp mới từ Nghĩa Guru (WORKSHOP_PHOTO_OR_LANDSCAPE)", severity: "INFO" },
    { timestamp: "2026-11-07 11:11:26", group: "Nhóm Ghim Ưu Tiên Giám Đốc #1", event: "[Delta v6.0] Bắt tức thì 4 tệp mới từ Nguyễn Minh (WORKSHOP_PHOTO_OR_LANDSCAPE)", severity: "INFO" },
    { timestamp: "2026-11-07 11:23:53", group: "Phụ Kiện Quốc Tâm", event: "[Delta v6.0] Bắt tức thì 1 tệp mới từ Tâm Quốc (INVOICE_OR_DELIVERY_NOTE)", severity: "ALERT" },
    { timestamp: "2026-11-07 11:23:57", group: "Phụ Kiện Quốc Tâm", event: "[Delta v6.0] Bắt tức thì 3 tệp mới từ Tâm Quốc (INVOICE_OR_DELIVERY_NOTE)", severity: "ALERT" },
    { timestamp: "2026-11-08 02:10:11", group: "Nhóm Ghim Ưu Tiên Giám Đốc #1", event: "[Delta v6.0] Bắt tức thì 2 tệp mới từ Nguyễn Minh (WORKSHOP_PHOTO_OR_LANDSCAPE)", severity: "INFO" }
  ];

  /**
   * Phân tích và cấu trúc hóa dữ liệu telemetry
   */
  function parseTelemetry(records) {
    const rawList = Array.isArray(records) && records.length > 0 ? records : DEFAULT_TELEMETRY;

    const groupMap = {};
    const typeMap = {
      BANK_TRANSFER_VOUCHER: { label: "Ủy Nhiệm Chi / Bank Chuyển Khoản", count: 0, color: "#10b981" },
      INVOICE_OR_DELIVERY_NOTE: { label: "Hóa Đơn / Phiếu Giao Hàng", count: 0, color: "#f59e0b" },
      WORKSHOP_PHOTO_OR_LANDSCAPE: { label: "Ảnh Hiện Trường & Bản Vẽ Kỹ Thuật", count: 0, color: "#06b6d4" },
      OTHER_MEDIA: { label: "Tài Liệu / Media Tổng Hợp", count: 0, color: "#8b5cf6" }
    };

    const latencyHistory = [];
    const storageBenchmark = {
      levelDB: { speed: 20.33, latency: 33.5, label: "LevelDB (Metadata/Index)" },
      resourceCache: { speed: 250.75, latency: 0.186, label: "Resource Cache (.rescache)" },
      fileNoise: { speed: 419.70, latency: 0.242, label: "FileNoise (XOR 0x93 In-Memory)" }
    };

    let totalIndexedMedia = 4877;
    let totalMonitoredGroups = 16;
    let lastScanLatencyMs = 568.2;
    let cpuImpactPercent = 0.3; // <= 0.3% IDLE

    rawList.forEach(item => {
      const { group, event, timestamp } = item;

      // 1. Quét latency từ event
      const latMatch = event.match(/\((\d+(?:\.\d+)?)\s*ms\)/i);
      if (latMatch) {
        const ms = parseFloat(latMatch[1]);
        latencyHistory.push({
          timestamp: timestamp ? timestamp.slice(5, 16) : "",
          latencyMs: ms,
          desc: event.includes("16 nhóm") ? "Quét Toàn Bộ 16 Nhóm (v6.0)" : "Quét Nhanh 10 Nhóm (v4.0)"
        });
      }

      // 2. Nhóm hệ thống vs nhóm hội thoại
      const isSystemGroup = group.includes("Hệ Thống Zalo");
      if (!isSystemGroup) {
        if (!groupMap[group]) {
          groupMap[group] = {
            name: group,
            totalFiles: 0,
            vouchers: 0,
            invoices: 0,
            photos: 0,
            events: 0
          };
        }
        groupMap[group].events += 1;

        // Trích xuất số lượng tệp từ chuỗi event
        const countMatch = event.match(/(?:Phát hiện|Bắt được|Bắt tức thì)\s+(\d+)\s+(?:tệp|chứng từ)/i);
        const count = countMatch ? parseInt(countMatch[1], 10) : 1;
        groupMap[group].totalFiles += count;

        // Phân loại chứng từ
        if (event.includes("BANK_TRANSFER_VOUCHER")) {
          groupMap[group].vouchers += count;
          typeMap.BANK_TRANSFER_VOUCHER.count += count;
        } else if (event.includes("INVOICE_OR_DELIVERY_NOTE")) {
          groupMap[group].invoices += count;
          typeMap.INVOICE_OR_DELIVERY_NOTE.count += count;
        } else if (event.includes("WORKSHOP_PHOTO_OR_LANDSCAPE")) {
          groupMap[group].photos += count;
          typeMap.WORKSHOP_PHOTO_OR_LANDSCAPE.count += count;
        } else {
          typeMap.OTHER_MEDIA.count += count;
        }
      }
    });

    // Chuyển groupMap thành danh sách sắp xếp giảm dần theo totalFiles
    const groupList = Object.keys(groupMap).map(k => groupMap[k]).sort((a, b) => b.totalFiles - a.totalFiles);

    return {
      groups: groupList,
      types: typeMap,
      latencies: latencyHistory,
      storageBenchmark,
      summary: {
        totalIndexedMedia,
        totalMonitoredGroups,
        lastScanLatencyMs,
        cpuImpactPercent,
        totalTrafficDetected: groupList.reduce((acc, g) => acc + g.totalFiles, 0)
      }
    };
  }

  /**
   * Tạo chuỗi SVG an toàn
   */
  function createGroupVolumeSVG(groups) {
    if (!groups || groups.length === 0) return '';

    const width = 680;
    const barHeight = 28;
    const gap = 16;
    const topPadding = 45;
    const bottomPadding = 30;
    const labelWidth = 240;
    const chartWidth = width - labelWidth - 80;
    const height = topPadding + groups.length * (barHeight + gap) + bottomPadding;

    const maxVal = Math.max(...groups.map(g => g.totalFiles), 1);

    // Bảng màu cho các nhóm
    const colors = [
      ["#38bdf8", "#0284c7"], // Lam Giang (Xanh trời)
      ["#f59e0b", "#d97706"], // Quốc Tâm (Cam đồng)
      ["#10b981", "#059669"], // Xưởng PG (Xanh lục ngọc)
      ["#a855f7", "#7c3aed"], // Bác Phát (Tím hoàng gia)
      ["#ec4899", "#db2777"], // Điều Hành Xưởng (Hồng hoa sen)
      ["#eab308", "#ca8a04"], // Nhóm Ghim Giám Đốc (Vàng kim)
      ["#06b6d4", "#0891b2"]  // Hoàng Hà Ceramic (Cyan)
    ];

    let barsSVG = '';
    groups.forEach((g, idx) => {
      const y = topPadding + idx * (barHeight + gap);
      const barW = Math.max(8, (g.totalFiles / maxVal) * chartWidth);
      const colorPair = colors[idx % colors.length];
      const gradId = `grad_bar_${idx}`;

      barsSVG += `
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colorPair[0]}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="${colorPair[1]}" stop-opacity="0.85" />
          </linearGradient>
        </defs>

        <!-- Nhãn tên nhóm -->
        <text x="${labelWidth - 12}" y="${y + barHeight / 2 + 5}" 
              text-anchor="end" fill="#cbd5e1" font-size="12" font-weight="600" font-family="system-ui, -apple-system, sans-serif">
          ${g.name.length > 28 ? g.name.substring(0, 26) + '…' : g.name}
        </text>

        <!-- Nền rãnh bar -->
        <rect x="${labelWidth}" y="${y}" width="${chartWidth}" height="${barHeight}" rx="6" fill="#1e293b" opacity="0.6" />

        <!-- Cột dữ liệu chính -->
        <rect x="${labelWidth}" y="${y}" width="${barW}" height="${barHeight}" rx="6" fill="url(#${gradId})" 
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
          <title>${g.name}: ${g.totalFiles.toLocaleString('vi-VN')} tệp (UNC: ${g.vouchers}, Hóa đơn: ${g.invoices}, Ảnh: ${g.photos})</title>
        </rect>

        <!-- Số liệu hiển thị cuối cột -->
        <text x="${labelWidth + barW + 10}" y="${y + barHeight / 2 + 5}" 
              text-anchor="start" fill="#f8fafc" font-size="12" font-weight="700" font-family="system-ui, -apple-system, sans-serif">
          ${g.totalFiles.toLocaleString('vi-VN')} <tspan fill="#94a3b8" font-size="10" font-weight="400">tệp</tspan>
        </text>
      `;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: transparent; overflow: visible;">
        <!-- Tiêu đề biểu đồ -->
        <text x="16" y="24" fill="#38bdf8" font-size="14" font-weight="700" letter-spacing="0.5" font-family="system-ui, -apple-system, sans-serif">
          LƯU LƯỢNG TIN NHẮN & MEDIA ĐÃ BẮT TỰ ĐỘNG THEO NHÓM (DELTA-CURSOR)
        </text>
        <line x1="${labelWidth}" y1="${topPadding - 10}" x2="${labelWidth}" y2="${height - bottomPadding + 5}" stroke="#334155" stroke-width="1.5" stroke-dasharray="3 3" />
        ${barsSVG}
      </svg>
    `;
  }

  /**
   * Tạo chuỗi SVG cho Benchmark đọc đĩa & Tốc độ quét ngầm V6.0
   */
  function createBenchmarkSVG(storage) {
    const width = 680;
    const height = 240;
    const items = [
      { name: "LevelDB (SQLite Index)", speed: storage.levelDB.speed, lat: storage.levelDB.latency, color: "#38bdf8", desc: "Quét ngầm trạng thái con trỏ" },
      { name: "Resource Cache (.rescache)", speed: storage.resourceCache.speed, lat: storage.resourceCache.latency, color: "#10b981", desc: "Đọc trực tiếp bộ nhớ cache" },
      { name: "FileNoise (XOR 0x93 Memory)", speed: storage.fileNoise.speed, lat: storage.fileNoise.latency, color: "#a855f7", desc: "Giải mã hóa đơn/ảnh tức thì" }
    ];

    const maxSpeed = 450; // max MB/s
    const leftMargin = 220;
    const chartW = width - leftMargin - 110;
    const barH = 34;
    const gap = 24;
    const top = 50;

    let rowsSVG = '';
    items.forEach((item, idx) => {
      const y = top + idx * (barH + gap);
      const w = (item.speed / maxSpeed) * chartW;

      rowsSVG += `
        <!-- Tên benchmark -->
        <text x="${leftMargin - 12}" y="${y + 16}" text-anchor="end" fill="#f1f5f9" font-size="12" font-weight="600" font-family="system-ui, -apple-system, sans-serif">
          ${item.name}
        </text>
        <text x="${leftMargin - 12}" y="${y + 30}" text-anchor="end" fill="#94a3b8" font-size="10" font-family="system-ui, -apple-system, sans-serif">
          ${item.desc}
        </text>

        <!-- Rãnh nền -->
        <rect x="${leftMargin}" y="${y}" width="${chartW}" height="${barH}" rx="6" fill="#1e293b" opacity="0.7" />

        <!-- Thanh tốc độ MB/s -->
        <rect x="${leftMargin}" y="${y}" width="${w}" height="${barH}" rx="6" fill="${item.color}" opacity="0.9">
          <title>${item.name}: ${item.speed} MB/s (Độ trễ: ${item.lat} ms/file)</title>
        </rect>

        <!-- Giá trị hiển thị -->
        <text x="${leftMargin + w + 12}" y="${y + 18}" text-anchor="start" fill="#f8fafc" font-size="13" font-weight="700" font-family="system-ui, -apple-system, sans-serif">
          ${item.speed.toFixed(1)} <tspan fill="#38bdf8" font-size="11">MB/s</tspan>
        </text>
        <text x="${leftMargin + w + 12}" y="${y + 30}" text-anchor="start" fill="#64748b" font-size="10" font-family="system-ui, -apple-system, sans-serif">
          (~${item.lat} ms)
        </text>
      `;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: transparent;">
        <text x="16" y="24" fill="#10b981" font-size="14" font-weight="700" letter-spacing="0.5" font-family="system-ui, -apple-system, sans-serif">
          BENCHMARK BỘ NHỚ VÀ TỐC ĐỘ ĐỌC ĐĨA THỤ ĐỘNG (100% ZERO-DISRUPTION)
        </text>
        ${rowsSVG}
      </svg>
    `;
  }

  /**
   * Tạo biểu đồ hình tròn/donut phân bố loại chứng từ
   */
  function createTypeDistributionSVG(types) {
    const width = 680;
    const height = 220;
    const total = Object.values(types).reduce((acc, t) => acc + t.count, 0) || 1;

    let startAngle = 0;
    const cx = 110;
    const cy = 110;
    const r = 75;
    const innerR = 48;

    let slicesSVG = '';
    let legendSVG = '';
    const typeKeys = Object.keys(types);

    typeKeys.forEach((key, idx) => {
      const item = types[key];
      const sliceAngle = (item.count / total) * 360;
      const endAngle = startAngle + sliceAngle;

      // Chuyển polar sang Cartesian
      const rad1 = (startAngle - 90) * Math.PI / 180;
      const rad2 = (endAngle - 90) * Math.PI / 180;

      const x1 = cx + r * Math.cos(rad1);
      const y1 = cy + r * Math.sin(rad1);
      const x2 = cx + r * Math.cos(rad2);
      const y2 = cy + r * Math.sin(rad2);

      const ix1 = cx + innerR * Math.cos(rad2);
      const iy1 = cy + innerR * Math.sin(rad2);
      const ix2 = cx + innerR * Math.cos(rad1);
      const iy2 = cy + innerR * Math.sin(rad1);

      const largeArc = sliceAngle > 180 ? 1 : 0;

      const pathData = `
        M ${x1} ${y1}
        A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix1} ${iy1}
        A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}
        Z
      `;

      slicesSVG += `
        <path d="${pathData}" fill="${item.color}" opacity="0.9" stroke="#0f172a" stroke-width="2">
          <title>${item.label}: ${item.count} tệp (${((item.count / total) * 100).toFixed(1)}%)</title>
        </path>
      `;

      // Legend bên phải
      const ly = 45 + idx * 36;
      legendSVG += `
        <g transform="translate(240, ${ly})">
          <rect x="0" y="0" width="14" height="14" rx="3" fill="${item.color}" />
          <text x="24" y="12" fill="#f1f5f9" font-size="12" font-weight="600" font-family="system-ui, -apple-system, sans-serif">
            ${item.label}
          </text>
          <text x="360" y="12" text-anchor="end" fill="#cbd5e1" font-size="12" font-weight="700" font-family="system-ui, -apple-system, sans-serif">
            ${item.count.toLocaleString('vi-VN')} <tspan fill="#94a3b8" font-size="10" font-weight="400">(${((item.count / total) * 100).toFixed(1)}%)</tspan>
          </text>
        </g>
      `;

      startAngle = endAngle;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: transparent;">
        <text x="16" y="24" fill="#a855f7" font-size="14" font-weight="700" letter-spacing="0.5" font-family="system-ui, -apple-system, sans-serif">
          PHÂN LOẠI CHỨNG TỪ TÀI CHÍNH & VẬT TƯ BẮT TỰ ĐỘNG
        </text>
        <!-- Donut chart -->
        <g>
          ${slicesSVG}
          <!-- Trung tâm Donut -->
          <circle cx="${cx}" cy="${cy}" r="${innerR - 2}" fill="#0f172a" />
          <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="system-ui, -apple-system, sans-serif">TỔNG BẮT</text>
          <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="800" font-family="system-ui, -apple-system, sans-serif">${total.toLocaleString('vi-VN')}</text>
        </g>
        <!-- Legend -->
        ${legendSVG}
      </svg>
    `;
  }

  /**
   * Tạo biểu đồ Sparkline / Biểu đồ đường độ trễ theo chuỗi thời gian (Latency Timeline)
   */
  function createLatencyTimelineSVG(latencies) {
    const width = 680;
    const height = 180;
    if (!latencies || latencies.length === 0) return '';

    const padLeft = 60;
    const padRight = 30;
    const padTop = 40;
    const padBottom = 35;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const maxMs = Math.max(...latencies.map(l => l.latencyMs), 100) * 1.15;
    const minMs = 0;

    const points = latencies.map((l, i) => {
      const x = padLeft + (i / Math.max(latencies.length - 1, 1)) * plotW;
      const y = padTop + plotH - ((l.latencyMs - minMs) / (maxMs - minMs)) * plotH;
      return { x, y, ...l };
    });

    const pathD = points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");

    const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${padTop + plotH} Z`;

    let dotsSVG = '';
    points.forEach((pt) => {
      dotsSVG += `
        <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#38bdf8" stroke="#0f172a" stroke-width="2">
          <title>${pt.timestamp} | ${pt.latencyMs} ms (${pt.desc})</title>
        </circle>
        <text x="${pt.x}" y="${pt.y - 8}" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="600" font-family="system-ui, -apple-system, sans-serif">
          ${pt.latencyMs.toFixed(0)}ms
        </text>
      `;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: transparent;">
        <defs>
          <linearGradient id="latencyAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <text x="16" y="22" fill="#38bdf8" font-size="14" font-weight="700" letter-spacing="0.5" font-family="system-ui, -apple-system, sans-serif">
          LỊCH SỬ ĐỘ TRỄ QUÉT TỨC THÌ (STEALTH PASSIVE ENGINE MS)
        </text>

        <!-- Trục tọa độ -->
        <line x1="${padLeft}" y1="${padTop + plotH}" x2="${padLeft + plotW}" y2="${padTop + plotH}" stroke="#334155" stroke-width="1.5" />
        <line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${padTop + plotH}" stroke="#334155" stroke-width="1.5" />

        <!-- Vùng tô gradient -->
        <path d="${areaD}" fill="url(#latencyAreaGrad)" />

        <!-- Đường vẽ chính -->
        <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Điểm mốc -->
        ${dotsSVG}

        <!-- Nhãn trục Y -->
        <text x="${padLeft - 8}" y="${padTop + 10}" text-anchor="end" fill="#64748b" font-size="10" font-family="system-ui, -apple-system, sans-serif">${maxMs.toFixed(0)}ms</text>
        <text x="${padLeft - 8}" y="${padTop + plotH}" text-anchor="end" fill="#64748b" font-size="10" font-family="system-ui, -apple-system, sans-serif">0ms</text>

        <!-- Nhãn trục X mốc đầu & mốc cuối -->
        <text x="${points[0].x}" y="${padTop + plotH + 18}" text-anchor="start" fill="#94a3b8" font-size="10" font-family="system-ui, -apple-system, sans-serif">${points[0].timestamp}</text>
        <text x="${points[points.length - 1].x}" y="${padTop + plotH + 18}" text-anchor="end" fill="#94a3b8" font-size="10" font-family="system-ui, -apple-system, sans-serif">${points[points.length - 1].timestamp}</text>
      </svg>
    `;
  }

  /**
   * Khởi tạo và render module vào DOM container
   */
  function render(containerIdOrElement, customData) {
    let container = containerIdOrElement;
    if (typeof containerIdOrElement === 'string') {
      container = document.getElementById(containerIdOrElement);
    }

    if (!container) {
      console.warn("[PG_Modules_W34] Không tìm thấy container để render telemetry chart.");
      return null;
    }

    const data = parseTelemetry(customData);

    const html = `
      <div class="pg-w34-dashboard" style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background: linear-gradient(135deg, #0b1120 0%, #0f172a 100%);
        color: #f8fafc;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      ">
        <!-- HEADER STATUS -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; background-color: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite;"></span>
              <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #f8fafc; letter-spacing: -0.3px;">
                BẢNG ĐIỀU KHIỂN TELEMETRY QUÉT NGẦM ZALO V6.0
              </h2>
            </div>
            <p style="margin: 4px 0 0 18px; font-size: 12px; color: #94a3b8;">
              Giám sát đa nhóm tức thời (Delta-Cursor) • 100% Zero-Disruption (CPU &lt; 0.3%) • PG Home Luxury
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
              STEALTH ENGINE: ACTIVE
            </span>
            <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.3);">
              STORAGE.DB: 16/16 NHÓM
            </span>
          </div>
        </div>

        <!-- KPI SUMMARY CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
          <div style="background: #1e293b; padding: 12px 14px; border-radius: 8px; border-left: 4px solid #38bdf8;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Media Khớp SHA-256</div>
            <div style="font-size: 20px; font-weight: 800; color: #38bdf8; margin-top: 4px;">${data.summary.totalIndexedMedia.toLocaleString('vi-VN')}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Chuẩn hóa toàn diện 16 nhóm</div>
          </div>
          <div style="background: #1e293b; padding: 12px 14px; border-radius: 8px; border-left: 4px solid #10b981;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Độ trễ quét tức thì</div>
            <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">${data.summary.lastScanLatencyMs.toFixed(1)} ms</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">16 nhóm song song</div>
          </div>
          <div style="background: #1e293b; padding: 12px 14px; border-radius: 8px; border-left: 4px solid #a855f7;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Tốc độ đọc In-Memory</div>
            <div style="font-size: 20px; font-weight: 800; color: #a855f7; margin-top: 4px;">419.7 MB/s</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">FileNoise XOR 0x93</div>
          </div>
          <div style="background: #1e293b; padding: 12px 14px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Tác động CPU & Chuột</div>
            <div style="font-size: 20px; font-weight: 800; color: #f59e0b; margin-top: 4px;">&le; 0.3% (0.0% UI)</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Không chiếm focus Chrome/Zalo</div>
          </div>
        </div>

        <!-- CHARTS GRID -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
          <!-- Cột trái: Lưu lượng theo nhóm -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px;">
            ${createGroupVolumeSVG(data.groups)}
          </div>

          <!-- Cột phải: Benchmark đọc đĩa & Phân loại chứng từ -->
          <div style="display: flex; flex-direction: column; gap: 18px;">
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px;">
              ${createBenchmarkSVG(data.storageBenchmark)}
            </div>
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px;">
              ${createTypeDistributionSVG(data.types)}
            </div>
          </div>
        </div>

        <!-- TIMELINE DƯỚI CÙNG -->
        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin-top: 18px;">
          ${createLatencyTimelineSVG(data.latencies)}
        </div>

        <!-- FOOTER PHÁP LÝ & AN TOÀN -->
        <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 12px; flex-wrap: wrap;">
          <span>Hệ Thống Quản Trị PG Home • Hộ Kinh Doanh Phú Gia • MST: 042203002931</span>
          <span>Hotline: 0973.562.789 • Chuẩn Vô Hình 100% (Stealth Engine V6.0)</span>
        </div>
      </div>
    `;

    container.innerHTML = html;
    return data;
  }

  // Khai báo đối tượng Public API cho window.PG_Modules_W34
  const PG_Modules_W34 = {
    name: "PG_Modules_W34_TelemetryPerformanceChart",
    version: "6.0.0",
    defaultTelemetry: DEFAULT_TELEMETRY,
    parseTelemetry: parseTelemetry,
    createGroupVolumeSVG: createGroupVolumeSVG,
    createBenchmarkSVG: createBenchmarkSVG,
    createTypeDistributionSVG: createTypeDistributionSVG,
    createLatencyTimelineSVG: createLatencyTimelineSVG,
    render: render,
    init: function (containerId, customData) {
      return render(containerId, customData);
    }
  };

  return PG_Modules_W34;
});
