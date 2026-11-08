/**
 * MODULE W55: BẢNG ĐIỀU KHIỂN CHẤM CÔNG AI & HIỆU SUẤT OEE MÁY SẢN XUẤT THỜI GIAN THỰC
 * (WORKSHOP AI ATTENDANCE & CNC OEE LIVE DASHBOARD)
 *
 * ĐƠN VỊ PHÁP LÝ & SỞ HỮU BẢN QUYỀN:
 * Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * Thương hiệu: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY
 * Mã số ĐKKD/HKD & MST: 042203002931
 * Đại diện pháp luật: Nguyễn Trọng Nghĩa
 * Địa chỉ ĐKKD: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh
 * Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * Hotline chuẩn duy nhất: 0986.722.324
 *
 * TUÂN THỦ HIẾN PHÁP KỶ LUẬT THÉP:
 * 1. Kỷ luật Thương hiệu & Pháp lý: Chuẩn chỉ 100% địa chỉ, MST, Hotline, đúng danh xưng Tổ hợp Văn phòng & Nhà máy Sản xuất.
 * 2. Kỷ luật Tàng hình (Stealth Protocol): Không pop up, không cướp focus, hoạt động an toàn nền tảng web.
 * 3. Kỷ luật Chống báo cáo láo (Zero-Trust Audit): Tính toán OEE thực tế = A × P × Q từ tham số đo kiểm.
 * 4. Kỷ luật Bảo vệ Hạ tầng: Tối ưu hiệu năng, không rò rỉ bộ nhớ, giao diện Pure SVG/JS không phụ thuộc thư viện ngoài.
 */

(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (typeof root !== 'undefined') {
    root.PG_W55_WorkshopOeeDashboard = api;
    root.PG_Modules_W55 = api;
  }
  if (typeof window !== 'undefined') {
    window.PG_W55_WorkshopOeeDashboard = api;
    window.PG_Modules_W55 = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var MODULE_ID = 'W55';
  var MODULE_NAME = 'Workshop AI Attendance & CNC OEE Live Dashboard';
  var VERSION = '1.0.0';

  // Thông tin pháp lý & thương hiệu chuẩn
  var LEGAL_INFO = {
    legalEntity: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    brandName: 'CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY',
    taxId: '042203002931',
    representative: 'Nguyễn Trọng Nghĩa',
    registeredOffice: 'Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh',
    factoryComplex: 'Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia',
    tradingAddress: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    hotline: '0986.722.324'
  };

  // Định nghĩa 7 Trạm mã QR tiêu chuẩn trong quy trình sản xuất PG Home Luxury
  var QR_STATIONS_META = [
    { id: 1, code: 'QR-01', name: 'Nhập Kho Phôi & Thẩm Định Ván', note: 'Kiểm tra độ ẩm, quy cách MDF An Cường / Gỗ Óc Chó' },
    { id: 2, code: 'QR-02', name: 'Gia Công Cắt CNC Nesting', note: 'Cắt phôi tự động 4 đầu, phay rãnh & tối ưu sơ đồ cắt' },
    { id: 3, code: 'QR-03', name: 'Dán Cạnh Tự Động Không Đường Line', note: 'Bo nẹp PUR/Hotmelt Noline công nghệ Đức liền mạch' },
    { id: 4, code: 'QR-04', name: 'Khoan Cam Liên Kết CNC 6 Mặt', note: 'Định vị chốt cam âm dương, liên kết chịu lực chuẩn xác' },
    { id: 5, code: 'QR-05', name: 'Mộc Tinh & Sơn Phủ Gỗ Óc Chó', note: 'Xử lý nguội bề mặt & phòng phun sơn áp suất âm 5 lớp' },
    { id: 6, code: 'QR-06', name: 'Lắp Ráp Thử & KCS Nghiệm Thu', note: 'Test phụ kiện ray Blum/Hafele, kiểm định tem đạt chuẩn' },
    { id: 7, code: 'QR-07', name: 'Đóng Gói Tem QR & Xuất Xưởng', note: 'Bọc màng PE chống xước, tem định danh bàn giao công trình' }
  ];

  // Dữ liệu ban đầu của 4 máy sản xuất chính tại Nhà máy Sản xuất Phú Gia
  var MACHINES_DATA = [
    {
      id: 'cnc_nesting',
      code: 'CNC-NST-01',
      name: 'Máy CNC Nesting 4 Đầu Cắt Tự Động',
      type: 'Gia công cắt ván & định hình phôi công nghiệp',
      operator: 'Lương Thể Hào',
      status: 'RUNNING', // RUNNING | STANDBY | MAINTENANCE | ALARM | OFFLINE
      plannedMins: 480,
      operatingMins: 442,
      idealCycleSec: 420, // 7 phút / tấm ván chuẩn 1220x2440mm
      targetOutput: 65,   // Tấm ván định mức / ca
      actualOutput: 62,   // Tấm ván thực tế đã cắt
      defectOutput: 1,    // Tấm lỗi / sứt góc
      specs: {
        spindleSpeed: '18,500 RPM',
        vacuumPressure: '-0.85 Bar',
        toolStation: 'T1-T4 Tự động',
        feedRate: '25 m/phút'
      }
    },
    {
      id: 'edge_banding',
      code: 'EDG-NOL-02',
      name: 'Máy Dán Cạnh Tự Động Không Đường Line',
      type: 'Dán nẹp Pur/Hotmelt Noline cao cấp',
      operator: 'Trần Văn Anh',
      status: 'RUNNING',
      plannedMins: 480,
      operatingMins: 425,
      idealCycleSec: 50,  // ~0.83 phút / mét nẹp
      targetOutput: 520,  // Mét nẹp định mức / ca
      actualOutput: 502,  // Mét nẹp thực tế
      defectOutput: 4,    // Mét nẹp bọt keo/lệch mép
      specs: {
        gluePotTemp: '192°C (Keo PUR)',
        feedSpeed: '18 m/phút',
        trimmerMotor: '12,000 RPM',
        airPressure: '6.5 Bar'
      }
    },
    {
      id: 'cnc_drilling',
      code: 'CAM-DRILL-03',
      name: 'Máy Khoan Cam CNC 6 Mặt',
      type: 'Khoan định vị liên kết chốt cam tự động',
      operator: 'Lê Văn Thoan',
      status: 'STANDBY',
      plannedMins: 480,
      operatingMins: 395,
      idealCycleSec: 65,  // ~1.08 phút / chi tiết thùng tủ
      targetOutput: 380,  // Chi tiết định mức / ca
      actualOutput: 352,  // Chi tiết thực tế
      defectOutput: 2,    // Chi tiết lệch tâm chốt
      specs: {
        drillBank: '18 mũi khoan đứng/ngang',
        positionPrecision: '±0.05 mm',
        workingAir: '6.8 Bar',
        spindleStatus: 'Sẵn sàng cấp phôi'
      }
    },
    {
      id: 'paint_booth',
      code: 'PNT-WALNUT-04',
      name: 'Buồng Sơn Gỗ Óc Chó Áp Suất Âm',
      type: 'Phun sơn hấp sấy mộc tự nhiên Óc Chó Bắc Mỹ',
      operator: 'Nguyễn Văn Tuấn',
      status: 'RUNNING',
      plannedMins: 480,
      operatingMins: 435,
      idealCycleSec: 1100, // ~18.3 phút / bộ chi tiết hoàn thiện 5 lớp
      targetOutput: 24,   // Bộ sản phẩm hoàn thiện / ca
      actualOutput: 23,   // Bộ sản phẩm thực tế
      defectOutput: 0,    // Đạt KCS 100% không bụi sơn
      specs: {
        boothTemp: '34.5°C (Hấp sấy nhiệt)',
        airflowRate: '19,200 m³/h',
        filterPressure: 'Áp suất âm 45 Pa',
        humidity: '52% Chuẩn phòng sạch'
      }
    }
  ];

  // Danh sách chấm công AI Face Attendance thời gian thực
  var ATTENDANCE_DATA = [
    {
      id: 'NV01',
      name: 'Hà Viết Hòa',
      role: 'Thợ Cả / Quản Đốc Sản Xuất',
      group: 'Nòng Cốt Xưởng',
      station: 'Điều hành chung & Giám sát 7 Trạm QR',
      checkInTime: '07:18:24',
      status: 'PRESENT', // PRESENT | OVERTIME | TEMP_OUT | ABSENT
      confidence: 99.6,
      standardHours: 8.0,
      otHours: 2.0,
      terminal: 'Cổng Chính - Ngõ 49 Trương Quốc Dụng',
      avatar: '👨‍🔧'
    },
    {
      id: 'NV02',
      name: 'Lương Thể Hào',
      role: 'Thợ Chính CNC / Vận Hành Cắt',
      group: 'Tổ Gia Công Cơ Giới',
      station: 'Máy CNC Nesting 4 Đầu Cắt Tự Động',
      checkInTime: '07:22:10',
      status: 'PRESENT',
      confidence: 99.4,
      standardHours: 8.0,
      otHours: 1.5,
      terminal: 'Cổng Chính - Ngõ 49 Trương Quốc Dụng',
      avatar: '👨‍💻'
    },
    {
      id: 'NV03',
      name: 'Trần Văn Anh',
      role: 'Thợ Chính / Vận Hành Dán Cạnh',
      group: 'Tổ Gia Công Cơ Giới',
      station: 'Máy Dán Cạnh Tự Động Không Đường Line',
      checkInTime: '07:26:45',
      status: 'PRESENT',
      confidence: 98.9,
      standardHours: 8.0,
      otHours: 1.5,
      terminal: 'Cổng Chính - Ngõ 49 Trương Quốc Dụng',
      avatar: '🧑‍🏭'
    },
    {
      id: 'NV04',
      name: 'Lê Văn Thoan',
      role: 'Thợ Vận Hành Khoan Cam CNC',
      group: 'Tổ Gia Công Cơ Giới',
      station: 'Máy Khoan Cam CNC 6 Mặt',
      checkInTime: '07:29:12',
      status: 'PRESENT',
      confidence: 98.7,
      standardHours: 8.0,
      otHours: 0.5,
      terminal: 'Cổng Chính - Ngõ 49 Trương Quốc Dụng',
      avatar: '👷'
    },
    {
      id: 'NV05',
      name: 'Nguyễn Văn Tuấn',
      role: 'Thợ Sơn Bậc Cao Gỗ Tự Nhiên',
      group: 'Tổ Hoàn Thiện & Sơn Mộc',
      station: 'Buồng Sơn Gỗ Óc Chó Áp Suất Âm',
      checkInTime: '07:15:30',
      status: 'OVERTIME',
      confidence: 99.8,
      standardHours: 8.0,
      otHours: 2.5,
      terminal: 'Cổng Chính - Ngõ 49 Trương Quốc Dụng',
      avatar: '🎨'
    },
    {
      id: 'NV06',
      name: 'Tuấn Anh',
      role: 'Kỹ Thuật Lắp Ráp & KCS',
      group: 'Tổ KCS & Đóng Gói',
      station: 'Trạm 6: Lắp Ráp & Nghiệm Thu KCS',
      checkInTime: '07:33:02',
      status: 'PRESENT',
      confidence: 99.1,
      standardHours: 8.0,
      otHours: 1.0,
      terminal: 'Cổng Chính - Ngõ 49 Trương Quốc Dụng',
      avatar: '🛠️'
    },
    {
      id: 'NV07',
      name: 'Phú Gia Hiệp',
      role: 'Kỹ Thuật Nhà Máy & Điều Độ QR',
      group: 'Khối Quản Lý Dự Án',
      station: 'Trạm 7: Quét Tem QR & Xuất Xưởng',
      checkInTime: '07:20:18',
      status: 'PRESENT',
      confidence: 99.5,
      standardHours: 8.0,
      otHours: 1.5,
      terminal: 'Cổng Chính - Ngõ 49 Trương Quốc Dụng',
      avatar: '📐'
    },
    {
      id: 'NV08',
      name: 'Nguyễn Trọng Nghĩa',
      role: 'Giám Đốc Điều Hành / Tổng Chỉ Huy',
      group: 'Ban Giám Đốc PG Home Luxury',
      station: 'Văn phòng Điều hành & Kiểm duyệt KCS',
      checkInTime: '07:10:05',
      status: 'PRESENT',
      confidence: 99.9,
      standardHours: 8.0,
      otHours: 3.0,
      terminal: 'Văn Phòng Nhà Máy - Ngõ 49 Trương Quốc Dụng',
      avatar: '👔'
    }
  ];

  // Danh sách các đơn hàng dự án đang sản xuất thực tế qua 7 trạm QR
  var PRODUCTION_ORDERS = [
    {
      orderId: 'ORD-NAM-2026',
      customer: 'Biệt Thự Anh Nam - Thạch Hà',
      scope: 'Hệ tủ bếp Acrylic Noline + Tủ áo MDF An Cường phủ Melamine',
      material: 'MDF Chống Ẩm An Cường 17mm + Acrylic Noline',
      totalSheets: 42,
      totalPieces: 186,
      currentStation: 4, // Trạm 4: Khoan cam CNC 6 mặt
      stationProgress: [
        { stationId: 1, status: 'DONE', time: '08:15', note: 'Đã xuất 42 tấm ván MDF chuẩn An Cường' },
        { stationId: 2, status: 'DONE', time: '10:45', note: 'CNC Nesting cắt 62 phôi định hình đạt 100%' },
        { stationId: 3, status: 'DONE', time: '13:20', note: 'Dán cạnh Pur Noline mép chỉ phẳng mịn' },
        { stationId: 4, status: 'PROCESSING', time: '14:30', note: 'Đang khoan chốt cam âm dương 6 mặt' },
        { stationId: 5, status: 'PENDING', time: null, note: 'Chờ chuyển buồng sơn mộc' },
        { stationId: 6, status: 'PENDING', time: null, note: 'Chờ lắp ráp thử phụ kiện Blum' },
        { stationId: 7, status: 'PENDING', time: null, note: 'Chờ đóng gói dán tem định danh xuất kho' }
      ]
    },
    {
      orderId: 'ORD-PHAT-2026',
      customer: 'Nhà Phố Bác Phát - TP. Hà Tĩnh',
      scope: 'Combo Phòng Khách & Phòng Ngủ Master Gỗ Óc Chó Bắc Mỹ',
      material: 'Gỗ Tự Nhiên Óc Chó Nhập Khẩu 100% FAS + MDF Lõi Xanh',
      totalSheets: 28,
      totalPieces: 114,
      currentStation: 5, // Trạm 5: Mộc tinh & Sơn phủ Óc Chó
      stationProgress: [
        { stationId: 1, status: 'DONE', time: '07:45', note: 'Gỗ phôi xẻ sấy độ ẩm chuẩn 10%' },
        { stationId: 2, status: 'DONE', time: '09:30', note: 'Gia công mộng âm dương CNC chính xác' },
        { stationId: 3, status: 'DONE', time: '11:15', note: 'Bo nẹp góc cạnh tinh xảo' },
        { stationId: 4, status: 'DONE', time: '13:40', note: 'Khoan chốt mộng liên kết gỗ hoàn tất' },
        { stationId: 5, status: 'PROCESSING', time: '15:10', note: 'Buồng sơn áp suất âm đang phủ bóng mờ 5 lớp' },
        { stationId: 6, status: 'PENDING', time: null, note: 'Chờ KCS nghiệm thu vân gỗ' },
        { stationId: 7, status: 'PENDING', time: null, note: 'Chờ đóng kiện xốp bọc bảo vệ' }
      ]
    },
    {
      orderId: 'ORD-PENT-2026',
      customer: 'Penthouse D\'Metropole Hà Tĩnh',
      scope: 'Hệ Tủ Áo Cánh Kính Đèn Led & Tủ Rượu Khung Nhôm Slim',
      material: 'Kính Cường Lực Xám Khói + Nhôm Anode + Thùng Melamine Vân Da',
      totalSheets: 34,
      totalPieces: 148,
      currentStation: 6, // Trạm 6: Lắp ráp & KCS
      stationProgress: [
        { stationId: 1, status: 'DONE', time: '08:00', note: 'Nhận kính và nhôm slim định hình' },
        { stationId: 2, status: 'DONE', time: '09:40', note: 'Phay rãnh led nhôm âm thùng tủ' },
        { stationId: 3, status: 'DONE', time: '11:00', note: 'Noline viền chỉ đồng màu' },
        { stationId: 4, status: 'DONE', time: '12:30', note: 'Khoan bản lề cánh kính góc mở 110 độ' },
        { stationId: 5, status: 'DONE', time: '14:00', note: 'Xử lý bề mặt thùng tủ sạch bụi' },
        { stationId: 6, status: 'PROCESSING', time: '15:35', note: 'Đang lắp ráp test ray trượt & đèn cảm biến' },
        { stationId: 7, status: 'PENDING', time: null, note: 'Chờ dán tem KCS Pass xuất kho' }
      ]
    },
    {
      orderId: 'ORD-SHOW-2026',
      customer: 'Showroom Trưng Bày PG Home Luxury',
      scope: 'Bộ Sưu Tập Giường Ngủ Hoàng Gia & Bàn Ghế Ăn Óc Chó',
      material: 'Gỗ Tự Nhiên Óc Chó Bắc Mỹ chọn vân cao cấp',
      totalSheets: 18,
      totalPieces: 64,
      currentStation: 7, // Trạm 7: Đóng gói dán tem xuất xưởng
      stationProgress: [
        { stationId: 1, status: 'DONE', time: 'Hôm qua', note: 'Tuyển chọn phôi gỗ vân núi cuộn sóng' },
        { stationId: 2, status: 'DONE', time: 'Hôm qua', note: 'Gia công đường cong mềm mại 3D CNC' },
        { stationId: 3, status: 'DONE', time: 'Hôm qua', note: 'Vát cạnh thủ công mỹ nghệ' },
        { stationId: 4, status: 'DONE', time: '08:30', note: 'Khoan mộng giấu chốt tinh xảo' },
        { stationId: 5, status: 'DONE', time: '11:45', note: 'Sơn lau dưỡng dầu thực vật cao cấp' },
        { stationId: 6, status: 'DONE', time: '14:15', note: 'KCS nghiệm thu 100/100 điểm thẩm mỹ' },
        { stationId: 7, status: 'PROCESSING', time: '15:50', note: 'Đang bọc màng bảo vệ 3 lớp chuẩn bị bàn giao' }
      ]
    }
  ];

  // Nhật ký hoạt động thời gian thực (Audit Trail Live Stream)
  var REALTIME_ACTIVITY_LOGS = [
    { time: '15:52:10', type: 'AI_FACE', text: 'Nhận diện AI Face Check-in: Hà Viết Hòa (Độ tin cậy: 99.6%) tại Cổng Chính Nhà Máy Ngõ 49 Trương Quốc Dụng.' },
    { time: '15:50:35', type: 'QR_SCAN', text: 'Quét trạm QR-07 Đơn hàng ORD-SHOW-2026: Bắt đầu đóng gói tem định danh xuất xưởng.' },
    { time: '15:46:22', type: 'MACHINE', text: 'Máy CNC Nesting 4 Đầu hoàn thành chu kỳ cắt tấm ván #62/65 đạt chuẩn KCS.' },
    { time: '15:42:15', type: 'OEE_ALERT', text: 'Buồng sơn gỗ Óc Chó duy trì OEE xuất sắc 91.8% (Chất lượng đạt chuẩn tuyệt đối 100%).' },
    { time: '15:38:04', type: 'QR_SCAN', text: 'Quét trạm QR-04 Đơn hàng ORD-NAM-2026: Bàn giao 186 chi tiết khoan liên kết cam.' }
  ];

  /**
   * Tính toán chỉ số OEE chuẩn:
   * Availability (Khả dụng) = Actual Operating Time / Planned Production Time
   * Performance (Hiệu suất) = Actual Output / Target Output
   * Quality (Chất lượng)    = Good Output / Actual Output
   * OEE                     = A × P × Q
   */
  function calculateOee(machine) {
    var planned = Number(machine.plannedMins) || 480;
    var operating = Number(machine.operatingMins) || 0;
    var target = Number(machine.targetOutput) || 1;
    var actual = Number(machine.actualOutput) || 0;
    var defect = Number(machine.defectOutput) || 0;
    var good = Math.max(0, actual - defect);

    // Tính Availability (A)
    var availability = planned > 0 ? (operating / planned) : 0;
    if (availability > 1) availability = 1;

    // Tính Performance (P)
    var performance = target > 0 ? (actual / target) : 0;
    if (performance > 1.2) performance = 1.2; // Giới hạn tối đa hợp lý

    // Tính Quality (Q)
    var quality = actual > 0 ? (good / actual) : 1;
    if (quality > 1) quality = 1;

    // Tính OEE
    var oee = availability * performance * quality;

    return {
      availability: Math.round(availability * 1000) / 10,  // % (ví dụ 92.1)
      performance: Math.round(performance * 1000) / 10,    // % (ví dụ 95.4)
      quality: Math.round(quality * 1000) / 10,            // % (ví dụ 98.4)
      oee: Math.round(oee * 1000) / 10,                    // % (ví dụ 86.4)
      goodOutput: good,
      defectOutput: defect,
      rating: getOeeRating(oee * 100)
    };
  }

  function getOeeRating(oeePercent) {
    if (oeePercent >= 85) {
      return { label: 'Đẳng Cấp Thế Giới (World-Class)', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e' };
    } else if (oeePercent >= 70) {
      return { label: 'Đạt Chuẩn Tốt (Target Met)', color: '#d4af37', bg: 'rgba(212, 175, 55, 0.15)', border: '#d4af37' };
    } else {
      return { label: 'Cần Tối Ưu Hóa (Below Target)', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444' };
    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'RUNNING':
        return { text: 'ĐANG HOẠT ĐỘNG', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', dot: '#22c55e' };
      case 'STANDBY':
        return { text: 'CHỜ CẤP PHÔI', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', dot: '#f59e0b' };
      case 'MAINTENANCE':
        return { text: 'BẢO TRÌ ĐỊNH KỲ', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', dot: '#38bdf8' };
      case 'ALARM':
        return { text: 'CẢNH BÁO SỰ CỐ', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', dot: '#ef4444' };
      case 'OFFLINE':
      default:
        return { text: 'NGHỈ CA / TẮT MÁY', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', dot: '#94a3b8' };
    }
  }

  /**
   * Sinh SVG biểu đồ Gauge OEE bán nguyệt với kim chỉ và dải màu mượt mà
   */
  function generateOeeGaugeSvg(oeePercent, size) {
    size = size || 160;
    var radius = 60;
    var cx = size / 2;
    var cy = size / 2 + 10;
    // Bán nguyệt từ -180 độ đến 0 độ (chiều dài cung = PI * radius)
    var arcLength = Math.PI * radius;
    var clampedOee = Math.max(0, Math.min(100, oeePercent));
    var strokeOffset = arcLength - (arcLength * clampedOee / 100);

    // Xác định màu dải cung theo tỷ lệ OEE
    var strokeColor = '#22c55e';
    if (clampedOee < 70) strokeColor = '#ef4444';
    else if (clampedOee < 85) strokeColor = '#d4af37';

    // Tính góc quay của kim (từ -90 độ đến +90 độ)
    var needleAngle = -90 + (clampedOee * 1.8);

    return '' +
      '<svg width="' + size + '" height="' + (size * 0.72) + '" viewBox="0 0 ' + size + ' ' + (size * 0.72) + '" style="overflow: visible;">' +
      '  <defs>' +
      '    <linearGradient id="oeeGrad_' + size + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
      '      <stop offset="0%" stop-color="#ef4444" />' +
      '      <stop offset="65%" stop-color="#d4af37" />' +
      '      <stop offset="85%" stop-color="#22c55e" />' +
      '      <stop offset="100%" stop-color="#10b981" />' +
      '    </linearGradient>' +
      '    <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">' +
      '      <feGaussianBlur stdDeviation="3" result="blur" />' +
      '      <feComposite in="SourceGraphic" in2="blur" operator="over" />' +
      '    </filter>' +
      '  </defs>' +
      '  <!-- Cung nền xám -->' +
      '  <path d="M ' + (cx - radius) + ' ' + cy + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (cx + radius) + ' ' + cy + '"' +
      '        fill="none" stroke="#1e293b" stroke-width="12" stroke-linecap="round" />' +
      '  <!-- Cung giá trị OEE -->' +
      '  <path d="M ' + (cx - radius) + ' ' + cy + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (cx + radius) + ' ' + cy + '"' +
      '        fill="none" stroke="' + strokeColor + '" stroke-width="12" stroke-linecap="round"' +
      '        stroke-dasharray="' + arcLength + '" stroke-dashoffset="' + strokeOffset + '"' +
      '        style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease;" />' +
      '  <!-- Kim chỉ đo lường -->' +
      '  <g transform="translate(' + cx + ', ' + cy + ') rotate(' + needleAngle + ')">' +
      '    <line x1="0" y1="0" x2="0" y2="' + (-radius + 12) + '" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />' +
      '    <circle cx="0" cy="0" r="5" fill="#d4af37" stroke="#0f172a" stroke-width="2" />' +
      '  </g>' +
      '  <!-- Nhãn số trung tâm -->' +
      '  <text x="' + cx + '" y="' + (cy - 12) + '" text-anchor="middle" fill="#f8fafc" font-size="22" font-weight="800" font-family="system-ui, sans-serif">' +
      '    ' + clampedOee.toFixed(1) + '%' +
      '  </text>' +
      '  <text x="' + cx + '" y="' + (cy + 6) + '" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="600" letter-spacing="1">CHỈ SỐ OEE</text>' +
      '</svg>';
  }

  // Quản lý trạng thái và phương thức công khai
  var dashboardState = {
    machines: JSON.parse(JSON.stringify(MACHINES_DATA)),
    attendance: JSON.parse(JSON.stringify(ATTENDANCE_DATA)),
    orders: JSON.parse(JSON.stringify(PRODUCTION_ORDERS)),
    logs: JSON.parse(JSON.stringify(REALTIME_ACTIVITY_LOGS)),
    selectedMachineId: 'cnc_nesting',
    selectedWorkerId: 'NV02',
    selectedOrderId: 'ORD-NAM-2026'
  };

  /**
   * Cập nhật trạng thái máy và số liệu vận hành
   */
  function updateMachineStatus(machineId, newStatus, metricUpdates) {
    var machine = dashboardState.machines.find(function (m) { return m.id === machineId; });
    if (!machine) return null;

    if (newStatus) {
      machine.status = newStatus;
    }
    if (metricUpdates && typeof metricUpdates === 'object') {
      if (metricUpdates.operatingMins !== undefined) machine.operatingMins = Number(metricUpdates.operatingMins);
      if (metricUpdates.actualOutput !== undefined) machine.actualOutput = Number(metricUpdates.actualOutput);
      if (metricUpdates.defectOutput !== undefined) machine.defectOutput = Number(metricUpdates.defectOutput);
      if (metricUpdates.targetOutput !== undefined) machine.targetOutput = Number(metricUpdates.targetOutput);
    }

    var oeeStats = calculateOee(machine);
    addLog('MACHINE', 'Cập nhật máy ' + machine.name + ' sang trạng thái [' + machine.status + '] - OEE mới: ' + oeeStats.oee + '%');
    return { machine: machine, oee: oeeStats };
  }

  /**
   * Mô phỏng quét mặt nhận diện AI Face Attendance
   */
  function simulateFaceCheckIn(workerId, customOptions) {
    var worker = dashboardState.attendance.find(function (w) { return w.id === workerId; });
    if (!worker) return null;

    var now = new Date();
    var timeStr = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0')
    ].join(':');

    worker.checkInTime = timeStr;
    worker.confidence = Math.round((98.5 + Math.random() * 1.4) * 10) / 10;
    
    // Đảo trạng thái hoặc gán trạng thái mới
    if (customOptions && customOptions.status) {
      worker.status = customOptions.status;
    } else {
      if (worker.status === 'ABSENT' || worker.status === 'TEMP_OUT') {
        worker.status = 'PRESENT';
      } else if (worker.status === 'PRESENT') {
        worker.status = 'OVERTIME';
      } else {
        worker.status = 'PRESENT';
      }
    }

    addLog('AI_FACE', 'AI Face Scanner [Cổng Chính Nhà Máy]: Xác thực thành công ' + worker.name + ' (' + worker.role + ') - Độ tin cậy: ' + worker.confidence + '% lúc ' + timeStr);
    return worker;
  }

  /**
   * Quét QR chuyển trạm sản xuất cho đơn hàng
   */
  function advanceOrderStation(orderId) {
    var order = dashboardState.orders.find(function (o) { return o.orderId === orderId; });
    if (!order) return null;

    var current = order.currentStation;
    if (current >= 7) {
      addLog('QR_SCAN', 'Đơn hàng ' + order.orderId + ' (' + order.customer + ') đã hoàn thành toàn bộ 7/7 Trạm QR xuất xưởng!');
      return order;
    }

    var prevStationMeta = QR_STATIONS_META.find(function (s) { return s.id === current; });
    var next = current + 1;
    var nextStationMeta = QR_STATIONS_META.find(function (s) { return s.id === next; });

    // Cập nhật trạng thái trạm cũ thành DONE
    if (order.stationProgress[current - 1]) {
      order.stationProgress[current - 1].status = 'DONE';
      order.stationProgress[current - 1].time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    // Cập nhật trạm mới thành PROCESSING
    if (order.stationProgress[next - 1]) {
      order.stationProgress[next - 1].status = 'PROCESSING';
      order.stationProgress[next - 1].time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    order.currentStation = next;
    addLog('QR_SCAN', 'Quét mã trạm QR: Đơn hàng ' + order.orderId + ' hoàn tất [' + prevStationMeta.code + '] ➔ Chuyển tiếp sang [' + nextStationMeta.code + ': ' + nextStationMeta.name + ']');
    return order;
  }

  function addLog(type, text) {
    var now = new Date();
    var timeStr = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0')
    ].join(':');

    dashboardState.logs.unshift({
      time: timeStr,
      type: type,
      text: text
    });
    if (dashboardState.logs.length > 50) {
      dashboardState.logs.pop();
    }
  }

  /**
   * Render giao diện hoàn chỉnh của Module W55
   */
  function render(containerIdOrElement) {
    var container = typeof containerIdOrElement === 'string'
      ? document.getElementById(containerIdOrElement)
      : containerIdOrElement;

    if (!container) {
      if (typeof document !== 'undefined') {
        container = document.getElementById('pg-w55-dashboard-root');
      }
      if (!container) {
        return getRenderHtml();
      }
    }

    container.innerHTML = getRenderHtml();
    attachEventListeners(container);
    return container.innerHTML;
  }

  /**
   * Khởi tạo và kích hoạt module
   */
  function init(containerIdOrElement) {
    return render(containerIdOrElement);
  }

  /**
   * Sinh mã HTML toàn bộ Dashboard
   */
  function getRenderHtml() {
    // Tính toán chỉ số tổng hợp
    var totalWorkers = dashboardState.attendance.length;
    var presentCount = dashboardState.attendance.filter(function (w) { return w.status === 'PRESENT' || w.status === 'OVERTIME'; }).length;
    var otCount = dashboardState.attendance.filter(function (w) { return w.status === 'OVERTIME'; }).length;
    var avgConfidence = Math.round(dashboardState.attendance.reduce(function (acc, cur) { return acc + cur.confidence; }, 0) / totalWorkers * 10) / 10;

    var machineOeeList = dashboardState.machines.map(function (m) {
      return {
        machine: m,
        oee: calculateOee(m)
      };
    });

    var overallPlantOee = Math.round(machineOeeList.reduce(function (sum, item) { return sum + item.oee.oee; }, 0) / machineOeeList.length * 10) / 10;
    var plantOeeRating = getOeeRating(overallPlantOee);

    var html = '' +
      '<div class="pg-w55-dashboard" style="background:#090d16; color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; padding:24px; border-radius:16px; border:1px solid #1e293b; box-shadow:0 20px 40px rgba(0,0,0,0.6); max-width:1440px; margin:0 auto; box-sizing:border-box;">' +
      
      // HEADER THƯƠNG HIỆU & PHÁP LÝ CHUẨN MỰC
      '  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1e293b; padding-bottom:20px; margin-bottom:24px; flex-wrap:wrap; gap:16px;">' +
      '    <div>' +
      '      <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">' +
      '        <span style="background:linear-gradient(135deg, #d4af37, #aa771c); color:#000; font-size:11px; font-weight:900; padding:4px 10px; border-radius:6px; letter-spacing:1px; text-transform:uppercase;">PG HOME ERP &bull; W55</span>' +
      '        <span style="background:rgba(34,197,94,0.15); color:#22c55e; border:1px solid rgba(34,197,94,0.3); font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; display:flex; align-items:center; gap:6px;">' +
      '          <span style="width:8px; height:8px; background:#22c55e; border-radius:50%; box-shadow:0 0 8px #22c55e; display:inline-block;"></span>' +
      '          AI & IOT LIVE TELEMETRY' +
      '        </span>' +
      '      </div>' +
      '      <h1 style="margin:0 0 6px 0; font-size:22px; font-weight:800; color:#f8fafc; letter-spacing:-0.5px;">' +
      '        TỔ HỢP VĂN PHÒNG & NHÀ MÁY SẢN XUẤT NỘI THẤT PHÚ GIA' +
      '      </h1>' +
      '      <div style="font-size:12px; color:#94a3b8; display:flex; gap:16px; flex-wrap:wrap;">' +
      '        <span>📍 <strong>' + LEGAL_INFO.tradingAddress + '</strong></span>' +
      '        <span>📞 Hotline: <strong style="color:#d4af37;">' + LEGAL_INFO.hotline + '</strong></span>' +
      '        <span>🏛️ MST: <strong>' + LEGAL_INFO.taxId + '</strong></span>' +
      '        <span>🛡️ Đơn vị: <strong>' + LEGAL_INFO.legalEntity + '</strong></span>' +
      '      </div>' +
      '    </div>' +
      '    <div style="text-align:right; background:#0f172a; padding:12px 18px; border-radius:12px; border:1px solid #1e293b;">' +
      '      <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">OEE TOÀN NHÀ MÁY</div>' +
      '      <div style="font-size:26px; font-weight:900; color:' + plantOeeRating.color + '; line-height:1.2;">' + overallPlantOee + '%</div>' +
      '      <div style="font-size:11px; font-weight:700; color:' + plantOeeRating.color + ';">' + plantOeeRating.label + '</div>' +
      '    </div>' +
      '  </div>' +

      // KPI SUMMARY CARDS
      '  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:24px;">' +
      '    <div style="background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:16px;">' +
      '      <div style="font-size:12px; color:#94a3b8; margin-bottom:6px;">Quân Số Chấm Công AI Face</div>' +
      '      <div style="font-size:24px; font-weight:800; color:#38bdf8;">' + presentCount + ' / ' + totalWorkers + ' <span style="font-size:13px; font-weight:500; color:#94a3b8;">nhân sự</span></div>' +
      '      <div style="font-size:11px; color:#22c55e; margin-top:4px;">✓ ' + Math.round(presentCount / totalWorkers * 100) + '% hiện diện tại Nhà máy</div>' +
      '    </div>' +
      '    <div style="background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:16px;">' +
      '      <div style="font-size:12px; color:#94a3b8; margin-bottom:6px;">Tăng Ca OT Chiều & Tối</div>' +
      '      <div style="font-size:24px; font-weight:800; color:#d4af37;">' + otCount + ' <span style="font-size:13px; font-weight:500; color:#94a3b8;">thợ nòng cốt</span></div>' +
      '      <div style="font-size:11px; color:#fbbf24; margin-top:4px;">⏱️ Đáp ứng tiến độ giao hàng công trình</div>' +
      '    </div>' +
      '    <div style="background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:16px;">' +
      '      <div style="font-size:12px; color:#94a3b8; margin-bottom:6px;">Độ Tin Cậy AI Face Recognition</div>' +
      '      <div style="font-size:24px; font-weight:800; color:#22c55e;">' + avgConfidence + '%</div>' +
      '      <div style="font-size:11px; color:#94a3b8; margin-top:4px;">📷 Camera AI Cổng Chính Ngõ 49 Trương Quốc Dụng</div>' +
      '    </div>' +
      '    <div style="background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:16px;">' +
      '      <div style="font-size:12px; color:#94a3b8; margin-bottom:6px;">Đơn Hàng Sản Xuất Qua 7 Trạm</div>' +
      '      <div style="font-size:24px; font-weight:800; color:#c084fc;">' + dashboardState.orders.length + ' <span style="font-size:13px; font-weight:500; color:#94a3b8;">dự án live</span></div>' +
      '      <div style="font-size:11px; color:#c084fc; margin-top:4px;">📦 Đồng bộ QR Code từng chi tiết phôi ván</div>' +
      '    </div>' +
      '  </div>' +

      // PHẦN 1: BẢNG OEE 4 MÁY SẢN XUẤT CHÍNH (BIỂU ĐỒ GAUGE & THÔNG SỐ A x P x Q)
      '  <div style="margin-bottom:32px;">' +
      '    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
      '      <div style="display:flex; align-items:center; gap:8px;">' +
      '        <span style="font-size:18px;">⚙️</span>' +
      '        <h2 style="margin:0; font-size:16px; font-weight:700; color:#f1f5f9; text-transform:uppercase; letter-spacing:0.5px;">' +
      '          HIỆU SUẤT OEE THỜI GIAN THỰC (OEE = AVAILABILITY × PERFORMANCE × QUALITY)' +
      '        </h2>' +
      '      </div>' +
      '      <span style="font-size:12px; color:#94a3b8;">Cập nhật cảm biến IoT & Điều độ sản xuất</span>' +
      '    </div>' +
      '    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">';

    machineOeeList.forEach(function (item) {
      var m = item.machine;
      var o = item.oee;
      var badge = getStatusBadge(m.status);

      html += '' +
        '      <div style="background:#0f172a; border:1px solid #1e293b; border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;">' +
        '        <div style="border-bottom:1px solid #1e293b; padding-bottom:12px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:flex-start;">' +
        '          <div>' +
        '            <div style="font-size:11px; font-weight:700; color:#d4af37; letter-spacing:0.5px;">' + m.code + '</div>' +
        '            <div style="font-size:15px; font-weight:700; color:#f8fafc; margin-top:2px;">' + m.name + '</div>' +
        '            <div style="font-size:11px; color:#94a3b8;">Thợ vận hành: <strong style="color:#e2e8f0;">' + m.operator + '</strong></div>' +
        '          </div>' +
        '          <span style="background:' + badge.bg + '; color:' + badge.color + '; border:1px solid ' + badge.color + '; font-size:10px; font-weight:700; padding:3px 8px; border-radius:99px; white-space:nowrap;">' +
        '            ' + badge.text +
        '          </span>' +
        '        </div>' +
        
        // Vùng vẽ Gauge và 3 chỉ số A, P, Q
        '        <div style="display:flex; align-items:center; justify-content:space-around; margin:8px 0 16px 0;">' +
        '          <div style="text-align:center;">' +
        '            ' + generateOeeGaugeSvg(o.oee, 150) +
        '            <div style="font-size:11px; font-weight:700; color:' + o.rating.color + '; margin-top:-6px;">' + o.rating.label + '</div>' +
        '          </div>' +
        '          <div style="display:flex; flex-direction:column; gap:8px; min-width:130px;">' +
        '            <div style="background:#1e293b; padding:6px 10px; border-radius:8px;">' +
        '              <div style="font-size:10px; color:#94a3b8; display:flex; justify-content:space-between;">' +
        '                <span>Availability (A)</span><strong style="color:#38bdf8;">' + o.availability + '%</strong>' +
        '              </div>' +
        '              <div style="font-size:10px; color:#64748b;">' + m.operatingMins + 'p / ' + m.plannedMins + 'p ca</div>' +
        '            </div>' +
        '            <div style="background:#1e293b; padding:6px 10px; border-radius:8px;">' +
        '              <div style="font-size:10px; color:#94a3b8; display:flex; justify-content:space-between;">' +
        '                <span>Performance (P)</span><strong style="color:#f59e0b;">' + o.performance + '%</strong>' +
        '              </div>' +
        '              <div style="font-size:10px; color:#64748b;">' + m.actualOutput + ' / ' + m.targetOutput + ' định mức</div>' +
        '            </div>' +
        '            <div style="background:#1e293b; padding:6px 10px; border-radius:8px;">' +
        '              <div style="font-size:10px; color:#94a3b8; display:flex; justify-content:space-between;">' +
        '                <span>Quality (Q)</span><strong style="color:#22c55e;">' + o.quality + '%</strong>' +
        '              </div>' +
        '              <div style="font-size:10px; color:#64748b;">' + o.goodOutput + ' đạt / ' + o.defectOutput + ' lỗi</div>' +
        '            </div>' +
        '          </div>' +
        '        </div>' +

        // Thông số kỹ thuật chuyên sâu của máy
        '        <div style="background:#090d16; border-radius:8px; padding:10px 12px; font-size:11px; color:#94a3b8; display:grid; grid-template-columns:1fr 1fr; gap:6px;">' +
        '          <div>Áp suất/Nhiệt độ: <strong style="color:#cbd5e1;">' + (m.specs.gluePotTemp || m.specs.vacuumPressure || m.specs.workingAir || m.specs.boothTemp) + '</strong></div>' +
        '          <div>Tốc độ/Lưu lượng: <strong style="color:#cbd5e1;">' + (m.specs.spindleSpeed || m.specs.feedSpeed || m.specs.airflowRate || m.specs.positionPrecision) + '</strong></div>' +
        '        </div>' +
        '      </div>';
    });

    html += '' +
      '    </div>' +
      '  </div>' +

      // PHẦN 2 & 3: BẢNG CHẤM CÔNG AI FACE & TIẾN ĐỘ 7 TRẠM QR CỦA ĐƠN HÀNG
      '  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(480px, 1fr)); gap:24px; margin-bottom:32px;">' +

      // BẢNG CHẤM CÔNG AI FACE LIVE MATRIX
      '    <div style="background:#0f172a; border:1px solid #1e293b; border-radius:14px; padding:20px;">' +
      '      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
      '        <div style="display:flex; align-items:center; gap:8px;">' +
      '          <span style="font-size:18px;">👤</span>' +
      '          <h2 style="margin:0; font-size:15px; font-weight:700; color:#f1f5f9; text-transform:uppercase;">' +
      '            QUÂN SỐ CHẤM CÔNG AI FACE THỜI GIAN THỰC' +
      '          </h2>' +
      '        </div>' +
      '        <span style="background:rgba(34,197,94,0.15); color:#22c55e; font-size:11px; font-weight:700; padding:2px 8px; border-radius:6px;">Live 100%</span>' +
      '      </div>' +
      '      <div style="overflow-x:auto;">' +
      '        <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">' +
      '          <thead>' +
      '            <tr style="border-bottom:1px solid #334155; color:#94a3b8; font-size:11px; text-transform:uppercase;">' +
      '              <th style="padding:8px 6px;">Nhân sự</th>' +
      '              <th style="padding:8px 6px;">Vị trí / Trạm máy</th>' +
      '              <th style="padding:8px 6px; text-align:center;">Giờ vào</th>' +
      '              <th style="padding:8px 6px; text-align:center;">AI Match</th>' +
      '              <th style="padding:8px 6px; text-align:right;">Trạng thái</th>' +
      '            </tr>' +
      '          </thead>' +
      '          <tbody>';

    dashboardState.attendance.forEach(function (w) {
      var statusColor = '#22c55e';
      var statusText = 'CÓ MẶT';
      if (w.status === 'OVERTIME') {
        statusColor = '#d4af37';
        statusText = 'TĂNG CA (+' + w.otHours + 'h)';
      } else if (w.status === 'TEMP_OUT') {
        statusColor = '#38bdf8';
        statusText = 'TẠM RA NGOÀI';
      } else if (w.status === 'ABSENT') {
        statusColor = '#94a3b8';
        statusText = 'CHƯA VÀO CA';
      }

      html += '' +
        '            <tr style="border-bottom:1px solid #1e293b;">' +
        '              <td style="padding:10px 6px;">' +
        '                <div style="display:flex; align-items:center; gap:8px;">' +
        '                  <span style="font-size:16px;">' + w.avatar + '</span>' +
        '                  <div>' +
        '                    <div style="font-weight:700; color:#f1f5f9;">' + w.name + '</div>' +
        '                    <div style="font-size:10px; color:#94a3b8;">' + w.role + '</div>' +
        '                  </div>' +
        '                </div>' +
        '              </td>' +
        '              <td style="padding:10px 6px; color:#cbd5e1; font-size:11px;">' + w.station + '</td>' +
        '              <td style="padding:10px 6px; text-align:center; font-family:monospace; color:#38bdf8;">' + w.checkInTime + '</td>' +
        '              <td style="padding:10px 6px; text-align:center;">' +
        '                <span style="background:rgba(34,197,94,0.1); color:#22c55e; padding:2px 6px; border-radius:4px; font-weight:700; font-size:11px;">' +
        '                  ' + w.confidence + '%' +
        '                </span>' +
        '              </td>' +
        '              <td style="padding:10px 6px; text-align:right;">' +
        '                <span style="color:' + statusColor + '; font-weight:700; font-size:11px;">' + statusText + '</span>' +
        '              </td>' +
        '            </tr>';
    });

    html += '' +
      '          </tbody>' +
      '        </table>' +
      '      </div>' +
      '    </div>' +

      // TIẾN ĐỘ 7 TRẠM QR CỦA CÁC ĐƠN HÀNG SẢN XUẤT
      '    <div style="background:#0f172a; border:1px solid #1e293b; border-radius:14px; padding:20px;">' +
      '      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
      '        <div style="display:flex; align-items:center; gap:8px;">' +
      '          <span style="font-size:18px;">📱</span>' +
      '          <h2 style="margin:0; font-size:15px; font-weight:700; color:#f1f5f9; text-transform:uppercase;">' +
      '            TIẾN ĐỘ 7 TRẠM QR ĐƠN HÀNG ĐANG SẢN XUẤT' +
      '          </h2>' +
      '        </div>' +
      '        <span style="font-size:11px; color:#94a3b8;">Định danh từng cấu kiện</span>' +
      '      </div>' +
      '      <div style="display:flex; flex-direction:column; gap:16px;">';

    dashboardState.orders.forEach(function (ord) {
      var completedCount = ord.stationProgress.filter(function (s) { return s.status === 'DONE'; }).length;
      var currentStationInfo = QR_STATIONS_META.find(function (s) { return s.id === ord.currentStation; });
      var progressPercent = Math.round((completedCount + (ord.currentStation <= 7 ? 0.5 : 0)) / 7 * 100);
      if (completedCount === 7) progressPercent = 100;

      html += '' +
        '        <div style="background:#090d16; border:1px solid #1e293b; border-radius:10px; padding:14px;">' +
        '          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">' +
        '            <div>' +
        '              <span style="background:rgba(212,175,55,0.15); color:#d4af37; font-weight:800; font-size:10px; padding:2px 6px; border-radius:4px; margin-right:6px;">' + ord.orderId + '</span>' +
        '              <strong style="font-size:13px; color:#f8fafc;">' + ord.customer + '</strong>' +
        '              <div style="font-size:11px; color:#94a3b8; margin-top:2px;">' + ord.scope + '</div>' +
        '            </div>' +
        '            <div style="text-align:right;">' +
        '              <span style="font-size:12px; font-weight:800; color:#38bdf8;">' + progressPercent + '%</span>' +
        '              <div style="font-size:10px; color:#64748b;">' + ord.totalPieces + ' chi tiết phôi</div>' +
        '            </div>' +
        '          </div>' +

        // Thanh trực quan 7 Trạm QR
        '          <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; margin:10px 0;">';
      
      QR_STATIONS_META.forEach(function (st) {
        var sp = ord.stationProgress.find(function (item) { return item.stationId === st.id; });
        var stStatus = sp ? sp.status : 'PENDING';
        var blockColor = '#1e293b';
        var textColor = '#64748b';
        if (stStatus === 'DONE') {
          blockColor = '#22c55e';
          textColor = '#fff';
        } else if (stStatus === 'PROCESSING') {
          blockColor = '#d4af37';
          textColor = '#000';
        }

        html += '' +
          '            <div title="' + st.code + ': ' + st.name + '" style="background:' + blockColor + '; color:' + textColor + '; font-size:9px; font-weight:700; text-align:center; padding:5px 2px; border-radius:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' +
          '              ' + st.code +
          '            </div>';
      });

      html += '' +
        '          </div>' +
        '          <div style="font-size:11px; color:#cbd5e1; display:flex; justify-content:space-between; align-items:center;">' +
        '            <span>Trạm hiện tại: <strong style="color:#d4af37;">[' + currentStationInfo.code + '] ' + currentStationInfo.name + '</strong></span>' +
        '            <span style="font-size:10px; color:#94a3b8;">' + (ord.stationProgress[ord.currentStation - 1] ? ord.stationProgress[ord.currentStation - 1].note : '') + '</span>' +
        '          </div>' +
        '        </div>';
    });

    html += '' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      // PHẦN 4: BẢNG ĐIỀU KHIỂN MÔ PHỎNG TƯƠNG TÁC (QUÉT MẶT CHẤM CÔNG, ĐỔI TRẠNG THÁI MÁY, QUÉT QR TRẠM)
      '  <div style="background:#0f172a; border:1px solid #1e293b; border-radius:14px; padding:20px; margin-bottom:24px;">' +
      '    <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">' +
      '      <span style="font-size:18px;">⚡</span>' +
      '      <h2 style="margin:0; font-size:15px; font-weight:700; color:#d4af37; text-transform:uppercase; letter-spacing:0.5px;">' +
      '        BẢNG ĐIỀU KHIỂN MÔ PHỎNG QUÉT THẺ AI & CẬP NHẬT TRẠNG THÁI MÁY SẢN XUẤT' +
      '      </h2>' +
      '    </div>' +
      '    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">' +

      // Cụm 1: Mô phỏng AI Face Check-in
      '      <div style="background:#090d16; border:1px solid #1e293b; border-radius:10px; padding:14px;">' +
      '        <div style="font-size:12px; font-weight:700; color:#38bdf8; margin-bottom:10px;">📸 MÔ PHỎNG AI FACE CHECK-IN</div>' +
      '        <div style="margin-bottom:10px;">' +
      '          <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">Chọn nhân sự chấm công:</label>' +
      '          <select id="pg-w55-sim-worker" style="width:100%; background:#1e293b; color:#f8fafc; border:1px solid #334155; border-radius:6px; padding:8px; font-size:12px;">';

    dashboardState.attendance.forEach(function (w) {
      html += '<option value="' + w.id + '">' + w.name + ' - ' + w.role + ' (' + w.status + ')</option>';
    });

    html += '' +
      '          </select>' +
      '        </div>' +
      '        <button id="pg-w55-btn-face-checkin" style="width:100%; background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; border:none; border-radius:6px; padding:9px 12px; font-size:12px; font-weight:700; cursor:pointer; transition:background 0.2s;">' +
      '          Quét Mặt Nhận Diện AI Face Check-in' +
      '        </button>' +
      '      </div>' +

      // Cụm 2: Cập nhật trạng thái máy tức thì
      '      <div style="background:#090d16; border:1px solid #1e293b; border-radius:10px; padding:14px;">' +
      '        <div style="font-size:12px; font-weight:700; color:#22c55e; margin-bottom:10px;">⚙️ CẬP NHẬT TRẠNG THÁI MÁY SẢN XUẤT</div>' +
      '        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">' +
      '          <div>' +
      '            <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">Chọn máy:</label>' +
      '            <select id="pg-w55-sim-machine" style="width:100%; background:#1e293b; color:#f8fafc; border:1px solid #334155; border-radius:6px; padding:8px; font-size:11px;">';

    dashboardState.machines.forEach(function (m) {
      html += '<option value="' + m.id + '">' + m.name + '</option>';
    });

    html += '' +
      '            </select>' +
      '          </div>' +
      '          <div>' +
      '            <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">Trạng thái mới:</label>' +
      '            <select id="pg-w55-sim-machinestatus" style="width:100%; background:#1e293b; color:#f8fafc; border:1px solid #334155; border-radius:6px; padding:8px; font-size:11px;">' +
      '              <option value="RUNNING">RUNNING (Đang Chạy)</option>' +
      '              <option value="STANDBY">STANDBY (Chờ Cấp Phôi)</option>' +
      '              <option value="MAINTENANCE">MAINTENANCE (Bảo Trì)</option>' +
      '              <option value="ALARM">ALARM (Báo Sự Cố)</option>' +
      '              <option value="OFFLINE">OFFLINE (Nghỉ Ca)</option>' +
      '            </select>' +
      '          </div>' +
      '        </div>' +
      '        <button id="pg-w55-btn-update-machine" style="width:100%; background:linear-gradient(135deg, #15803d, #166534); color:#fff; border:none; border-radius:6px; padding:9px 12px; font-size:12px; font-weight:700; cursor:pointer; transition:background 0.2s;">' +
      '          Cập Nhật Trạng Thái & Tính Lại OEE' +
      '        </button>' +
      '      </div>' +

      // Cụm 3: Quét QR chuyển trạm đơn hàng
      '      <div style="background:#090d16; border:1px solid #1e293b; border-radius:10px; padding:14px;">' +
      '        <div style="font-size:12px; font-weight:700; color:#d4af37; margin-bottom:10px;">📦 QUÉT QR CHUYỂN TRẠM ĐƠN HÀNG</div>' +
      '        <div style="margin-bottom:10px;">' +
      '          <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">Chọn dự án đơn hàng:</label>' +
      '          <select id="pg-w55-sim-order" style="width:100%; background:#1e293b; color:#f8fafc; border:1px solid #334155; border-radius:6px; padding:8px; font-size:12px;">';

    dashboardState.orders.forEach(function (ord) {
      html += '<option value="' + ord.orderId + '">' + ord.orderId + ' - ' + ord.customer + ' (Trạm ' + ord.currentStation + ')</option>';
    });

    html += '' +
      '          </select>' +
      '        </div>' +
      '        <button id="pg-w55-btn-advance-station" style="width:100%; background:linear-gradient(135deg, #b45309, #92400e); color:#fff; border:none; border-radius:6px; padding:9px 12px; font-size:12px; font-weight:700; cursor:pointer; transition:background 0.2s;">' +
      '          Quét Mã QR Chuyển Trạm Tiếp Theo' +
      '        </button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      // PHẦN 5: NHẬT KÝ THỜI GIAN THỰC (REALTIME ACTIVITY AUDIT LOG)
      '  <div style="background:#0f172a; border:1px solid #1e293b; border-radius:14px; padding:18px; margin-bottom:20px;">' +
      '    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">' +
      '      <div style="display:flex; align-items:center; gap:8px;">' +
      '        <span style="font-size:16px;">📋</span>' +
      '        <h3 style="margin:0; font-size:14px; font-weight:700; color:#f1f5f9; text-transform:uppercase;">' +
      '          NHẬT KÝ AI FACE & TRẠM QR NHÀ MÁY THỜI GIAN THỰC' +
      '        </h3>' +
      '      </div>' +
      '      <span style="font-size:11px; color:#64748b;">Lưu vết chuẩn Zero-Trust</span>' +
      '    </div>' +
      '    <div style="max-height:160px; overflow-y:auto; font-family:monospace; font-size:11px; display:flex; flex-direction:column; gap:6px; padding-right:6px;">';

    dashboardState.logs.slice(0, 10).forEach(function (log) {
      var badgeColor = '#38bdf8';
      if (log.type === 'AI_FACE') badgeColor = '#22c55e';
      else if (log.type === 'QR_SCAN') badgeColor = '#d4af37';
      else if (log.type === 'OEE_ALERT') badgeColor = '#ec4899';

      html += '' +
        '      <div style="display:flex; gap:10px; align-items:baseline; padding:4px 6px; background:#090d16; border-radius:4px; border-left:3px solid ' + badgeColor + ';">' +
        '        <span style="color:#64748b; white-space:nowrap;">[' + log.time + ']</span>' +
        '        <span style="color:' + badgeColor + '; font-weight:700; white-space:nowrap;">[' + log.type + ']</span>' +
        '        <span style="color:#cbd5e1;">' + log.text + '</span>' +
        '      </div>';
    });

    html += '' +
      '    </div>' +
      '  </div>' +

      // FOOTER CHUẨN THƯƠNG HIỆU & BẢN QUYỀN
      '  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #1e293b; padding-top:14px; font-size:11px; color:#64748b; flex-wrap:wrap; gap:10px;">' +
      '    <div>' +
      '      ' + LEGAL_INFO.brandName + ' &bull; ' + LEGAL_INFO.factoryComplex + ' &bull; Hotline: <strong style="color:#d4af37;">' + LEGAL_INFO.hotline + '</strong>' +
      '    </div>' +
      '    <div>' +
      '      Hệ Thống Quản Trị Web ERP &bull; Module ' + MODULE_ID + ' v' + VERSION +
      '    </div>' +
      '  </div>' +
      '</div>';

    return html;
  }

  /**
   * Đính kèm các sự kiện tương tác DOM
   */
  function attachEventListeners(container) {
    if (!container || typeof container.querySelector !== 'function') return;

    // 1. Nút mô phỏng AI Face Check-in
    var btnFace = container.querySelector('#pg-w55-btn-face-checkin');
    var selectWorker = container.querySelector('#pg-w55-sim-worker');
    if (btnFace && selectWorker) {
      btnFace.addEventListener('click', function () {
        var workerId = selectWorker.value;
        simulateFaceCheckIn(workerId);
        render(container);
      });
    }

    // 2. Nút cập nhật trạng thái máy
    var btnMachine = container.querySelector('#pg-w55-btn-update-machine');
    var selectMachine = container.querySelector('#pg-w55-sim-machine');
    var selectMachineStatus = container.querySelector('#pg-w55-sim-machinestatus');
    if (btnMachine && selectMachine && selectMachineStatus) {
      btnMachine.addEventListener('click', function () {
        var machineId = selectMachine.value;
        var status = selectMachineStatus.value;
        updateMachineStatus(machineId, status);
        render(container);
      });
    }

    // 3. Nút quét QR chuyển trạm đơn hàng
    var btnAdvance = container.querySelector('#pg-w55-btn-advance-station');
    var selectOrder = container.querySelector('#pg-w55-sim-order');
    if (btnAdvance && selectOrder) {
      btnAdvance.addEventListener('click', function () {
        var orderId = selectOrder.value;
        advanceOrderStation(orderId);
        render(container);
      });
    }
  }

  // Tự động khởi tạo nếu tìm thấy element đích sẵn trong trang
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        var rootEl = document.getElementById('pg-w55-dashboard-root');
        if (rootEl) render(rootEl);
      });
    } else {
      var rootEl = document.getElementById('pg-w55-dashboard-root');
      if (rootEl) render(rootEl);
    }
  }

  // Đối tượng API công khai
  var publicApi = {
    moduleId: MODULE_ID,
    moduleName: MODULE_NAME,
    version: VERSION,
    legalInfo: LEGAL_INFO,
    qrStationsMeta: QR_STATIONS_META,
    calculateOee: calculateOee,
    getMachines: function () { return JSON.parse(JSON.stringify(dashboardState.machines)); },
    getAttendanceList: function () { return JSON.parse(JSON.stringify(dashboardState.attendance)); },
    getProductionOrders: function () { return JSON.parse(JSON.stringify(dashboardState.orders)); },
    getRealtimeLogs: function () { return JSON.parse(JSON.stringify(dashboardState.logs)); },
    updateMachineStatus: updateMachineStatus,
    simulateFaceCheckIn: simulateFaceCheckIn,
    advanceOrderStation: advanceOrderStation,
    render: render,
    init: init
  };

  return publicApi;
});
