/**
 * ============================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI BỘ PG HOME LUXURY - PHÂN HỆ GIÁM ĐỐC & DÒNG TIỀN
 * MODULE W36: PHÂN TÍCH TUỔI NỢ PHẢI THU KHÁCH HÀNG & TIẾN ĐỘ THU TIỀN 3 ĐỢT
 * ============================================================================
 * Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * Mã số ĐKKD/HKD: 042203002931 (Đại diện: Nguyễn Trọng Nghĩa)
 * Xưởng sản xuất: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * Văn phòng: 35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh
 * Hotline duy nhất: 0986.722.324
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var mod = factory();
    root.PG_Modules_W36 = mod;
    if (typeof window !== 'undefined') {
      window.PG_W36 = mod;
    }
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // --- 4 NHÓM TUỔI NỢ CHUẨN KỶ LUẬT THÉP PG HOME ---
  var AGING_BUCKETS = {
    TRONG_HAN: {
      code: 'TRONG_HAN',
      label: 'Trong hạn (<7 ngày)',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
      border: '#10b981',
      actionPrompt: 'Tiến độ bình thường, duy trì liên lạc kỹ thuật.'
    },
    NHAC_THU: {
      code: 'NHAC_THU',
      label: 'Nhắc thu (7–15 ngày)',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: '#f59e0b',
      actionPrompt: 'Gửi tin nhắn Zalo nhắc đợt giải ngân theo khối lượng đã giao hàng.'
    },
    QUA_HAN: {
      code: 'QUA_HAN',
      label: 'Quá hạn (16–30 ngày)',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.15)',
      border: '#f97316',
      actionPrompt: 'Cảnh báo: Sale Admin trực tiếp gọi điện thoại đối soát tiến độ và chốt ngày thanh toán.'
    },
    NO_XAU: {
      code: 'NO_XAU',
      label: 'Nợ xấu (>30 ngày)',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.2)',
      border: '#ef4444',
      actionPrompt: 'KHẨN CẤP: Tạm dừng lắp đặt đợt mới, trình Giám Đốc xử lý thu hồi công nợ quyết liệt.'
    }
  };

  // --- DỮ LIỆU MẶC ĐỊNH CHUẨN HÓA (FALLBACK KHI CHƯA CÓ APPSTATE) ---
  var defaultAgingData = [
    {
      id: 'REC-001',
      customer: 'Nhà Bác Phát',
      contractCode: '01/10/2026/HĐTC-NT',
      contractValue: 225730000,
      collected: 100000000,
      receivable: 125730000,
      progressPct: 95,
      daysOverdue: 22, // 22 ngày => Quá hạn 16-30 ngày
      signDate: '2026-10-01',
      dueDate: '2026-10-23',
      nextMilestoneCall: 80584000,
      finalRetention5Pct: 45146000,
      owner: 'Tống Trần Hiệp & Đường Việt Dũng',
      priority: 'HIGHEST',
      notes: 'Đã hoàn thiện 95% công trình. Đã thu đợt 1 (100tr). Cần thu ngay đợt lắp đặt 80% (80.584.000 đ) + nghiệm thu 5% (45.146.000 đ).'
    },
    {
      id: 'REC-002',
      customer: 'Nhà Anh Nam',
      contractCode: '06/11/2026/HĐTC-ANHNAM',
      contractValue: 295911033,
      collected: 150000000,
      receivable: 145911033,
      progressPct: 85,
      daysOverdue: 8, // 8 ngày => Nhắc thu 7-15 ngày
      signDate: '2026-11-06',
      dueDate: '2026-11-20',
      nextMilestoneCall: 86728826,
      finalRetention5Pct: 59182207,
      owner: 'Đường Việt Dũng',
      priority: 'HIGH',
      notes: 'Đã lắp ráp xong phần thô và thùng ván An Cường. Chuẩn bị nghiệm thu đợt lắp đặt để thu 86.728.826 đ.'
    },
    {
      id: 'REC-003',
      customer: 'Chị Hương (Công trình & Đơn hàng lẻ T10-T11/2026)',
      contractCode: 'HD-2026-HUONG-01',
      contractValue: 810000000,
      collected: 520000000,
      receivable: 290000000,
      progressPct: 70,
      daysOverdue: 4, // 4 ngày => Trong hạn <7 ngày
      signDate: '2026-11-10',
      dueDate: '2026-11-25',
      nextMilestoneCall: 150000000,
      finalRetention5Pct: 140000000,
      owner: 'Phòng Kế Toán & Chị Hương',
      priority: 'MEDIUM',
      notes: 'Hợp đồng các công trình căn hộ và showroom đang thi công, khách thanh toán đúng hạn từng tuần.'
    }
  ];

  /**
   * Định dạng tiền tệ VND chuẩn Việt Nam
   */
  function formatMoney(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '0 đ';
    return Number(amount).toLocaleString('vi-VN') + ' đ';
  }

  /**
   * Phân loại tự động 4 nhóm tuổi nợ
   * @param {number} days - Số ngày quá hạn hoặc số ngày từ hạn chót
   * @param {number} progressPct - Tiến độ thi công thực tế (%)
   */
  function classifyAgingBucket(days, progressPct) {
    var d = Number(days) || 0;
    var pct = Number(progressPct) || 0;

    if (d > 30 || (pct >= 90 && d > 20)) {
      return AGING_BUCKETS.NO_XAU;
    } else if (d >= 16) {
      return AGING_BUCKETS.QUA_HAN;
    } else if (d >= 7) {
      return AGING_BUCKETS.NHAC_THU;
    } else {
      return AGING_BUCKETS.TRONG_HAN;
    }
  }

  /**
   * Lấy danh sách phải thu động (Live Receivables)
   * Tự động đồng bộ từ window.appState (contracts, paymentHistory, debts)
   * Fallback về defaultAgingData nếu chưa có dữ liệu sống
   */
  function getLiveReceivables() {
    var liveList = [];
    var hasAppState = typeof window !== 'undefined' && window.appState;

    if (hasAppState) {
      var contracts = window.appState.contracts || window.appState.hop_dong || [];
      var payments = window.appState.paymentHistory || window.appState.lich_su_thanh_toan || [];
      var debts = window.appState.debts || window.appState.cong_no || [];

      if (Array.isArray(contracts) && contracts.length > 0) {
        for (var i = 0; i < contracts.length; i++) {
          var c = contracts[i];
          var contractVal = Number(c.contractValue || c.value || c.tong_tien || c.totalAmount || 0);
          if (contractVal <= 0) continue;

          // Tìm tiền đã thu từ paymentHistory hoặc trường trong contract
          var collected = Number(c.collected || c.paid || c.da_thanh_toan || 0);
          if (collected === 0 && Array.isArray(payments) && payments.length > 0) {
            for (var p = 0; p < payments.length; p++) {
              var pay = payments[p];
              if (pay.contractId === c.id || pay.contractCode === c.code || pay.customer === c.customer) {
                collected += Number(pay.amount || pay.so_tien || 0);
              }
            }
          }

          var receivable = contractVal - collected;
          if (receivable < 0) receivable = 0;

          var progressPct = Number(c.progressPct || c.tien_do || 50);
          var days = Number(c.daysOverdue || c.so_ngay_qua_han || 0);

          if (!days && c.dueDate) {
            var dueTs = new Date(c.dueDate).getTime();
            var nowTs = Date.now();
            if (!isNaN(dueTs) && nowTs > dueTs) {
              days = Math.floor((nowTs - dueTs) / (1000 * 60 * 60 * 24));
            }
          }

          var bucket = classifyAgingBucket(days, progressPct);

          liveList.push({
            id: c.id || ('REC-LIVE-' + (i + 1)),
            customer: c.customer || c.khach_hang || c.name || ('Khách hàng ' + (i + 1)),
            contractCode: c.contractCode || c.code || c.ma_hd || 'HĐ-CHUA-MA',
            contractValue: contractVal,
            collected: collected,
            receivable: receivable,
            progressPct: progressPct,
            daysOverdue: days,
            signDate: c.signDate || c.ngay_ky || '2026-10-01',
            dueDate: c.dueDate || c.han_chot || '',
            nextMilestoneCall: Math.round(receivable * 0.6),
            finalRetention5Pct: Math.round(contractVal * 0.05),
            owner: c.owner || c.nguoi_phu_trach || 'Tống Trần Hiệp / Đường Việt Dũng',
            priority: bucket.code === 'NO_XAU' || bucket.code === 'QUA_HAN' ? 'HIGHEST' : 'HIGH',
            bucket: bucket,
            notes: c.notes || c.ghi_chu || ''
          });
        }
      }
    }

    // Nếu không có dữ liệu sống từ appState, trả về defaultAgingData đã gắn nhóm
    if (liveList.length === 0) {
      liveList = defaultAgingData.map(function (item) {
        var bucket = classifyAgingBucket(item.daysOverdue, item.progressPct);
        return Object.assign({}, item, { bucket: bucket });
      });
    }

    return liveList;
  }

  /**
   * Hiển thị thanh tiến độ thu tiền 3 giai đoạn đa sắc
   * Giai đoạn 1: 50% Khi Ký Hợp Đồng (#10B981)
   * Giai đoạn 2: 40% Khi Lắp Đặt Tại Công Trình (#F59E0B)
   * Giai đoạn 3: 10% Khi Nghiệm Thu Bàn Giao (#06B6D4)
   * Font chữ định lượng: JetBrains Mono
   */
  function renderThreeStageProgressBar(contractVal, paidVal) {
    var cVal = Number(contractVal) || 0;
    var pVal = Number(paidVal) || 0;
    if (cVal <= 0) return '<div style="color:#64748b;font-size:11px;">Chưa có giá trị HĐ</div>';

    var pct = Math.min(100, Math.round((pVal / cVal) * 100));

    // Tính tỷ lệ lấp đầy trong 3 khúc: [0-50%], [50-90%], [90-100%]
    var fill1 = Math.min(50, pct); // tối đa 50%
    var fill2 = pct > 50 ? Math.min(40, pct - 50) : 0; // tối đa 40%
    var fill3 = pct > 90 ? Math.min(10, pct - 90) : 0; // tối đa 10%

    // Chuyển sang % tương đối trong từng khúc
    var width1 = (fill1 / 50) * 100;
    var width2 = (fill2 / 40) * 100;
    var width3 = (fill3 / 10) * 100;

    var monoFont = "font-family: 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;";

    return '' +
      '<div class="pg-three-stage-progress" style="width: 100%; margin: 6px 0;">' +
        '<div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; ' + monoFont + '">' +
          '<span>Đã thu: <strong style="color: #10b981;">' + formatMoney(pVal) + '</strong> (' + pct + '%)</span>' +
          '<span>Còn lại: <strong style="color: #f87171;">' + formatMoney(cVal - pVal) + '</strong></span>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: 50% 40% 10%; gap: 3px; height: 10px; background: #1e293b; border-radius: 6px; padding: 2px; box-sizing: border-box;">' +
          '<!-- Khúc 1: 50% Ký HĐ -->' +
          '<div style="background: rgba(16, 185, 129, 0.2); border-radius: 4px; overflow: hidden; position: relative;" title="Đợt 1 (50%): Ký HĐ & Đặt cọc">' +
            '<div style="height: 100%; width: ' + width1 + '%; background: #10b981; transition: width 0.3s ease;"></div>' +
          '</div>' +
          '<!-- Khúc 2: 40% Lắp Đặt -->' +
          '<div style="background: rgba(245, 158, 11, 0.2); border-radius: 4px; overflow: hidden; position: relative;" title="Đợt 2 (40%): Tập kết ván & Lắp đặt">' +
            '<div style="height: 100%; width: ' + width2 + '%; background: #f59e0b; transition: width 0.3s ease;"></div>' +
          '</div>' +
          '<!-- Khúc 3: 10% Nghiệm Thu -->' +
          '<div style="background: rgba(6, 182, 212, 0.2); border-radius: 4px; overflow: hidden; position: relative;" title="Đợt 3 (10%): Nghiệm thu bàn giao">' +
            '<div style="height: 100%; width: ' + width3 + '%; background: #06b6d4; transition: width 0.3s ease;"></div>' +
          '</div>' +
        '</div>' +
        '<div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; margin-top: 3px; ' + monoFont + '">' +
          '<span style="color: ' + (pct >= 50 ? '#10b981' : '#64748b') + ';">● Đ1: 50% Ký HĐ</span>' +
          '<span style="color: ' + (pct >= 90 ? '#f59e0b' : '#64748b') + ';">● Đ2: 40% Lắp Đặt</span>' +
          '<span style="color: ' + (pct >= 100 ? '#06b6d4' : '#64748b') + ';">● Đ3: 10% Nghiệm Thu</span>' +
        '</div>' +
      '</div>';
  }

  /**
   * Tạo báo cáo tổng hợp tuổi nợ
   */
  function getAgingReport() {
    var list = getLiveReceivables();
    var totalContractVal = 0;
    var totalCollected = 0;
    var totalReceivables = 0;
    var immediateCallAmount = 0;
    var bucketCounts = {
      TRONG_HAN: 0,
      NHAC_THU: 0,
      QUA_HAN: 0,
      NO_XAU: 0
    };
    var bucketMoneys = {
      TRONG_HAN: 0,
      NHAC_THU: 0,
      QUA_HAN: 0,
      NO_XAU: 0
    };

    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      totalContractVal += it.contractValue;
      totalCollected += it.collected;
      totalReceivables += it.receivable;
      immediateCallAmount += (it.nextMilestoneCall || 0);

      var bCode = it.bucket ? it.bucket.code : 'TRONG_HAN';
      if (bucketCounts[bCode] !== undefined) {
        bucketCounts[bCode]++;
        bucketMoneys[bCode] += it.receivable;
      }
    }

    var bacPhatItem = list.filter(function (x) {
      return x.customer && x.customer.indexOf('Phát') !== -1;
    })[0] || list[0];

    var anhNamItem = list.filter(function (x) {
      return x.customer && x.customer.indexOf('Nam') !== -1;
    })[0] || list[1];

    return {
      totalContractVal: totalContractVal,
      totalCollected: totalCollected,
      totalReceivables: totalReceivables,
      immediateCallAmount: immediateCallAmount,
      bucketCounts: bucketCounts,
      bucketMoneys: bucketMoneys,
      bacPhatHighlight: bacPhatItem,
      anhNamHighlight: anhNamItem,
      items: list,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Render giao diện Dashboard W36
   */
  function render(containerId) {
    if (typeof document === 'undefined') return '';
    var el = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    var report = getAgingReport();

    var html = '' +
      '<div class="pg-w36-aging" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background: #0f172a; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 12px; padding: 20px; color: #f8fafc; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">' +
        '<!-- HEADER -->' +
        '<div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #334155; padding-bottom: 14px; margin-bottom: 16px;">' +
          '<div>' +
            '<div style="display: flex; align-items: center; gap: 8px;">' +
              '<span style="background: #eab308; color: #000; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">PG HOME LUXURY</span>' +
              '<span style="background: #3b82f6; color: #fff; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">MODULE W36: TUỔI NỢ KHÁCH HÀNG</span>' +
            '</div>' +
            '<h2 style="margin: 8px 0 4px 0; font-size: 19px; font-weight: 700; color: #f1f5f9;">💰 PHÂN TÍCH TUỔI NỢ PHẢI THU & LỊCH THU TIỀN THEO TIẾN ĐỘ 3 ĐỢT</h2>' +
            '<p style="margin: 0; font-size: 12px; color: #94a3b8;">Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng | MST: <strong style="color: #cbd5e1;">042203002931</strong> | Hotline: <strong style="color: #eab308;">0986.722.324</strong></p>' +
            '<p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Xưởng SX: Ngõ 49 Trương Quốc Dụng | VP: 35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh</p>' +
          '</div>' +
          '<div style="text-align: right;">' +
            '<div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Tổng Phải Thu Thực Tế</div>' +
            '<div style="font-size: 22px; font-weight: 800; color: #f87171; font-family: monospace;">' + formatMoney(report.totalReceivables) + '</div>' +
          '</div>' +
        '</div>' +

        '<!-- 4 THẺ THỐNG KÊ 4 NHÓM TUỔI NỢ -->' +
        '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 18px;">' +
          '<div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 12px;">' +
            '<div style="font-size: 11px; color: #10b981; font-weight: 700; text-transform: uppercase;">1. Trong Hạn (&lt;7 ngày)</div>' +
            '<div style="font-size: 18px; font-weight: 800; color: #34d399; margin: 4px 0; font-family: monospace;">' + formatMoney(report.bucketMoneys.TRONG_HAN) + '</div>' +
            '<div style="font-size: 11px; color: #94a3b8;">Số lượng: <strong>' + report.bucketCounts.TRONG_HAN + '</strong> HĐ (Tiến độ an toàn)</div>' +
          '</div>' +
          '<div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 12px;">' +
            '<div style="font-size: 11px; color: #f59e0b; font-weight: 700; text-transform: uppercase;">2. Nhắc Thu (7–15 ngày)</div>' +
            '<div style="font-size: 18px; font-weight: 800; color: #fbbf24; margin: 4px 0; font-family: monospace;">' + formatMoney(report.bucketMoneys.NHAC_THU) + '</div>' +
            '<div style="font-size: 11px; color: #94a3b8;">Số lượng: <strong>' + report.bucketCounts.NHAC_THU + '</strong> HĐ (Gửi Zalo nhắc)</div>' +
          '</div>' +
          '<div style="background: rgba(249, 115, 22, 0.1); border: 1px solid #f97316; border-radius: 8px; padding: 12px;">' +
            '<div style="font-size: 11px; color: #f97316; font-weight: 700; text-transform: uppercase;">3. Quá Hạn (16–30 ngày)</div>' +
            '<div style="font-size: 18px; font-weight: 800; color: #fb923c; margin: 4px 0; font-family: monospace;">' + formatMoney(report.bucketMoneys.QUA_HAN) + '</div>' +
            '<div style="font-size: 11px; color: #94a3b8;">Số lượng: <strong>' + report.bucketCounts.QUA_HAN + '</strong> HĐ (Sale gọi chốt ngày)</div>' +
          '</div>' +
          '<div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 12px;">' +
            '<div style="font-size: 11px; color: #ef4444; font-weight: 700; text-transform: uppercase;">4. Nợ Xấu (&gt;30 ngày)</div>' +
            '<div style="font-size: 18px; font-weight: 800; color: #f87171; margin: 4px 0; font-family: monospace;">' + formatMoney(report.bucketMoneys.NO_XAU) + '</div>' +
            '<div style="font-size: 11px; color: #94a3b8;">Số lượng: <strong>' + report.bucketCounts.NO_XAU + '</strong> HĐ (Tạm dừng lắp ráp)</div>' +
          '</div>' +
        '</div>' +

        '<!-- THÔNG BÁO ƯU TIÊN SỐ 1: NHÀ BÁC PHÁT -->' +
        '<div style="background: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444; border-radius: 6px; padding: 12px; margin-bottom: 18px; font-size: 12px; line-height: 1.6;">' +
          '🚨 <strong style="color: #f87171; text-transform: uppercase;">Ưu tiên số 1 - Khẩn Cấp (Nhà Bác Phát - Đã Xong 95%):</strong> ' +
          'HĐ <strong>' + formatMoney(report.bacPhatHighlight.contractValue) + '</strong>, mới thu <strong>' + formatMoney(report.bacPhatHighlight.collected) + '</strong> (44.3%). ' +
          'Đã quá hạn đợt 2: <strong>' + report.bacPhatHighlight.daysOverdue + ' ngày</strong>. ' +
          'Yêu cầu Tống Trần Hiệp & Đường Việt Dũng thu ngay đợt lắp đặt 80%: <strong style="color: #fcd34d;">' + formatMoney(report.bacPhatHighlight.nextMilestoneCall) + '</strong> ' +
          '+ nghiệm thu bàn giao: <strong style="color: #67e8f9;">' + formatMoney(report.bacPhatHighlight.finalRetention5Pct) + '</strong> ' +
          '(Tổng còn phải thu: <strong style="color: #f87171;">' + formatMoney(report.bacPhatHighlight.receivable) + '</strong>).' +
        '</div>' +

        '<!-- BẢNG CHI TIẾT DANH SÁCH KHÁCH HÀNG & TIẾN ĐỘ 3 ĐỢT -->' +
        '<div style="overflow-x: auto; background: #1e293b; border-radius: 8px; border: 1px solid #334155;">' +
          '<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">' +
            '<thead>' +
              '<tr style="background: #0f172a; color: #94a3b8; border-bottom: 2px solid #334155;">' +
                '<th style="padding: 10px 12px;">Khách Hàng / Hợp Đồng</th>' +
                '<th style="padding: 10px 12px; width: 320px;">Tiến Độ Thu Tiền 3 Giai Đoạn (50%-40%-10%)</th>' +
                '<th style="padding: 10px 12px; text-align: center;">Tuổi Nợ</th>' +
                '<th style="padding: 10px 12px;">Đợt Cần Thu Ngay</th>' +
                '<th style="padding: 10px 12px;">Phụ Trách & Chỉ Đạo</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>';

    for (var i = 0; i < report.items.length; i++) {
      var item = report.items[i];
      var bucket = item.bucket || classifyAgingBucket(item.daysOverdue, item.progressPct);
      var rowBg = i % 2 === 0 ? '#1e293b' : '#182234';

      var badgeHtml = '' +
        '<span style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; background: ' + bucket.bg + '; color: ' + bucket.color + '; border: 1px solid ' + bucket.border + ';">' +
          bucket.label +
        '</span>';

      html += '' +
        '<tr style="background: ' + rowBg + '; border-bottom: 1px solid #334155;">' +
          '<td style="padding: 12px;">' +
            '<div style="font-weight: 700; color: #f8fafc; font-size: 13px;">' + item.customer + '</div>' +
            '<div style="font-size: 11px; color: #94a3b8; font-family: monospace;">' + item.contractCode + '</div>' +
            '<div style="font-size: 11px; color: #64748b; margin-top: 2px;">Tiến độ SX: <strong>' + item.progressPct + '%</strong> • Ký: ' + item.signDate + '</div>' +
          '</td>' +
          '<td style="padding: 12px;">' +
            renderThreeStageProgressBar(item.contractValue, item.collected) +
          '</td>' +
          '<td style="padding: 12px; text-align: center;">' +
            badgeHtml +
            '<div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">' + (item.daysOverdue > 0 ? ('Trễ ' + item.daysOverdue + ' ngày') : 'Đúng hạn') + '</div>' +
          '</td>' +
          '<td style="padding: 12px;">' +
            '<div style="color: #fbbf24; font-weight: 700; font-family: monospace;">' + formatMoney(item.nextMilestoneCall) + '</div>' +
            '<div style="font-size: 10px; color: #94a3b8;">Giữ lại 5%: ' + formatMoney(item.finalRetention5Pct) + '</div>' +
          '</td>' +
          '<td style="padding: 12px;">' +
            '<div style="font-weight: 600; color: #38bdf8;">' + item.owner + '</div>' +
            '<div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">' + bucket.actionPrompt + '</div>' +
          '</td>' +
        '</tr>';
    }

    html += '' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div style="margin-top: 12px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between;">' +
          '<span>Kỷ luật Dòng tiền PG Home: Thu đúng 3 đợt (50% - 40% - 10%), bảo vệ tuyệt đối lợi nhuận ròng Giám Đốc.</span>' +
          '<span>Cập nhật lúc: ' + report.generatedAt + '</span>' +
        '</div>' +
      '</div>';

    if (el) el.innerHTML = html;
    return html;
  }

  // --- TRẢ VỀ CÁC HÀM CÔNG KHAI CỦA MODULE W36 ---
  return {
    moduleId: 'W36',
    version: '7.0.0-PRO',
    legalName: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    taxId: '042203002931',
    hotline: '0986.722.324',
    AGING_BUCKETS: AGING_BUCKETS,
    defaultAgingData: defaultAgingData,
    classifyAgingBucket: classifyAgingBucket,
    getLiveReceivables: getLiveReceivables,
    renderThreeStageProgressBar: renderThreeStageProgressBar,
    getAgingReport: getAgingReport,
    render: render
  };
});
