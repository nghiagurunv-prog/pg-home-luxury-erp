/**
 * =================================================================================================
 * HỆ THỐNG QUẢN TRỊ & TỰ ĐỘNG HÓA PG HOME LUXURY - PHÚ GIA
 * MODULE W14: RBAC 4 PORTALS GUARD & USER APPROVAL LIFECYCLE (WINDOW.PG_MODULES_W14)
 * =================================================================================================
 * Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * Mã số HKD / MST: 042203002931 | ĐKKD: 13/01/2025 | Đại diện: Nguyễn Trọng Nghĩa
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, Phường Thành Sen, TP. Hà Tĩnh
 * Hotline: 0986.722.324
 *
 * TUÂN THỦ NGHIÊM NGẶT QUY TẮC QUẢN TRỊ CỐT LÕI (GEMINI.md - MỤC 2):
 * 1. Phân hệ Giám Đốc (ADMIN): Quản trị toàn diện, Đóng dấu đỏ điện tử duyệt vật tư, Duyệt PENDING -> ACTIVE.
 * 2. Phân hệ Kỹ Thuật & Vật Tư Xưởng (Vũ - XUONG_VATTU): Lập phiếu đề xuất; CẤM gửi NCC khi chưa có dấu đỏ.
 * 3. Phân hệ Sale Admin & Văn Phòng (Hiệp - VANPHONG_SALE): Hợp đồng, doanh số, công nợ văn phòng; CẤM xưởng & CCSC.
 * 4. Phân hệ Dự Toán Nhà Ở & Báo Giá (Hiệp & Dũng - DU_TOAN_SALE): Bóc tách sơ bộ, chốt chặn cost <= 54% xuất báo giá.
 * =================================================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W14 = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // --- HỆ THỐNG HẰNG SỐ QUẢN TRỊ BẤT BIẾN ---
  const LEGAL_INFO = Object.freeze({
    companyName: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    taxCode: '042203002931',
    representative: 'Nguyễn Trọng Nghĩa',
    director: 'Nguyễn Viết Nghĩa',
    address: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    hotline: '0986.722.324'
  });

  const ROLES = Object.freeze({
    ADMIN: 'ADMIN',                     // 1. Giám Đốc (Nguyễn Viết Nghĩa / Nguyễn Trọng Nghĩa)
    XUONG_VATTU: 'XUONG_VATTU',         // 2. Kỹ Thuật & Vật Tư Xưởng (Vũ)
    VANPHONG_SALE: 'VANPHONG_SALE',     // 3. Sale Admin & Văn Phòng (Hiệp)
    DU_TOAN_SALE: 'DU_TOAN_SALE'        // 4. Dự Toán Nhà Ở & Khởi Tạo Dự Án Báo Giá (Hiệp & Dũng)
  });

  const ACCOUNT_STATUS = Object.freeze({
    PENDING: 'PENDING',                 // Mặc định cho mọi tài khoản mới đăng ký
    ACTIVE: 'ACTIVE',                   // Đã được Giám Đốc duyệt trong tab "Phân Quyền Nhân Sự"
    LOCKED: 'LOCKED',                   // Tạm ngưng hoạt động / Khóa khẩn cấp
    REJECTED: 'REJECTED'                // Từ chối phê duyệt
  });

  const PORTAL_KEYS = Object.freeze({
    PORTAL_ADMIN: 'PORTAL_ADMIN',
    PORTAL_XUONG_VATTU: 'PORTAL_XUONG_VATTU',
    PORTAL_VANPHONG_SALE: 'PORTAL_VANPHONG_SALE',
    PORTAL_DU_TOAN_SALE: 'PORTAL_DU_TOAN_SALE'
  });

  // ĐỊNH NGHĨA CHI TIẾT 4 PHÂN HỆ VÀ RANH GIỚI BẢO MẬT
  const PORTAL_DEFINITIONS = Object.freeze({
    [PORTAL_KEYS.PORTAL_ADMIN]: {
      id: PORTAL_KEYS.PORTAL_ADMIN,
      code: 'ADMIN',
      name: 'Phân Hệ Giám Đốc (ADMIN)',
      roleRequired: ROLES.ADMIN,
      subtitle: 'Trung Tâm Chỉ Huy Quản Trị Toàn Diện & Phê Duyệt Tối Cao',
      description: 'Xem Dashboard, Báo cáo CCSC 12 tháng, Báo cáo CCSC T8+T9, Chấm công thợ, Giá cost vật tư, Hợp đồng, Dòng tiền công nợ. Duyệt & đóng dấu đỏ điện tử đơn vật tư. Phân quyền và kích hoạt tài khoản.',
      badgeColor: '#b91c1c', // Đỏ đô sang trọng
      icon: 'crown',
      allowedFeatures: [
        'DASHBOARD_FULL',
        'CCSC_12_MONTHS',
        'CCSC_T8_T9',
        'CHAM_CONG_THO',
        'GIA_COST_VAT_TU',
        'HOP_DONG_ALL',
        'DONG_TIEN_CONG_NO',
        'PHIEU_VAT_TU_APPROVE_STAMP',
        'PHAN_QUYEN_NHAN_SU',
        'LUONG_QUAN_LY_VIEW',
        'COL_BG_VIEW',
        'QUY_HOA_HAO_VIEW',
        'THUONG_DOANH_SO_MANAGE'
      ]
    },
    [PORTAL_KEYS.PORTAL_XUONG_VATTU]: {
      id: PORTAL_KEYS.PORTAL_XUONG_VATTU,
      code: 'XUONG_VATTU',
      name: 'Phân Hệ Kỹ Thuật & Vật Tư Xưởng (Vũ)',
      roleRequired: ROLES.XUONG_VATTU,
      subtitle: 'Bóc Tách Kỹ Thuật, Đề Xuất Vật Tư & Theo Dõi Tiến Độ Gia Công',
      description: 'Chỉ được lập phiếu đề xuất vật tư theo bóc tách kỹ thuật công trình. BẮT BUỘC chỉ được gửi đơn cho NCC (An Cường, Hafele, Lam Giang, Quốc Tâm...) khi đã có DẤU ĐỎ ĐIỆN TỬ của Giám Đốc.',
      badgeColor: '#1d4ed8', // Xanh dương kỹ thuật
      icon: 'hammer',
      allowedFeatures: [
        'PHIEU_VAT_TU_CREATE',
        'PHIEU_VAT_TU_VIEW_OWN',
        'BOC_TACH_VAN_GO_17MM',
        'THEO_DOI_TIEN_DO_SAN_XUAT',
        'SEND_PO_NCC_STAMPED_ONLY'
      ],
      forbiddenFeatures: [
        'LUONG_THO_VIEW',
        'LUONG_QUAN_LY_VIEW',
        'CCSC_VIEW',
        'COL_BG_VIEW',
        'DONG_TIEN_CONG_NO_VIEW',
        'PHAN_QUYEN_NHAN_SU',
        'SEND_PO_WITHOUT_STAMP'
      ]
    },
    [PORTAL_KEYS.PORTAL_VANPHONG_SALE]: {
      id: PORTAL_KEYS.PORTAL_VANPHONG_SALE,
      code: 'VANPHONG_SALE',
      name: 'Phân Hệ Sale Admin & Văn Phòng (Hiệp)',
      roleRequired: ROLES.VANPHONG_SALE,
      subtitle: 'Quản Lý Hợp Đồng, Doanh Số Khách Hàng & Thu Hồi Công Nợ',
      description: 'Chỉ xem mảng văn phòng: Hợp đồng công trình, doanh số, tiến độ thu tiền công nợ và tạm ứng khách hàng. Tuyệt đối không can thiệp vào xưởng sản xuất hay số liệu tài chính quản trị cấp cao.',
      badgeColor: '#047857', // Xanh lá ngọc
      icon: 'briefcase',
      allowedFeatures: [
        'HOP_DONG_VIEW',
        'DOANH_SO_SALE_VIEW',
        'TIEN_DO_THU_TIEN',
        'TAM_UNG_KH_VIEW',
        'CUSTOMER_CRM_VIEW'
      ],
      forbiddenFeatures: [
        'XUONG_SAN_XUAT_EDIT',
        'TAI_CHINH_CAP_CAO_VIEW',
        'CCSC_VIEW',
        'LUONG_THO_VIEW',
        'COL_BG_VIEW',
        'GIA_COST_GOC_VIEW',
        'PHAN_QUYEN_NHAN_SU'
      ]
    },
    [PORTAL_KEYS.PORTAL_DU_TOAN_SALE]: {
      id: PORTAL_KEYS.PORTAL_DU_TOAN_SALE,
      code: 'DU_TOAN_SALE',
      name: 'Phân Hệ Dự Toán Nhà Ở & Khởi Tạo Dự Án (Hiệp & Dũng)',
      roleRequired: ROLES.DU_TOAN_SALE,
      subtitle: 'Khởi Tạo Dự Án, Bóc Tách Dự Toán & Chốt Chặn Giá Cost <= 54%',
      description: 'Quản lý khởi tạo dự án công trình mới, bóc tách khối lượng dự toán sơ bộ theo thư viện đơn giá niêm yết chuẩn. Kiểm soát chặt chẽ tỷ lệ chi phí cost <= 54% trước khi xuất báo giá gửi khách.',
      badgeColor: '#d97706', // Vàng hổ phách
      icon: 'calculator',
      allowedFeatures: [
        'DU_TOAN_CREATE',
        'DU_TOAN_VIEW',
        'KHOI_TAO_DU_AN',
        'DON_GIA_NIEM_YET_VIEW',
        'DINH_MUC_CNC_LOOKUP',
        'EXPORT_BAO_GIA_CHECK_54'
      ],
      forbiddenFeatures: [
        'BANG_LUONG_THO_VIEW',
        'CHIA_THUONG_BGD_VIEW',
        'COL_BG_VIEW',
        'CCSC_12_MONTHS',
        'EXPORT_BAO_GIA_OVER_54_WITHOUT_ADMIN'
      ]
    }
  });

  const STORAGE_KEY_USERS = 'PG_HOME_USERS_STORE_V5';
  const STORAGE_KEY_SESSION = 'PG_HOME_ACTIVE_SESSION_V5';
  const STORAGE_KEY_PO_STAMPS = 'PG_HOME_PO_RED_STAMPS_V5';

  // DANH SÁCH TÀI KHOẢN KHỞI TẠO BAN ĐẦU CHUẨN DOANH NGHIỆP (KHÔNG DÙNG MOCK ẢO)
  const INITIAL_USERS = [
    {
      id: 'USR-ADMIN-01',
      username: 'giamdoc.nghia',
      fullName: 'Nguyễn Viết Nghĩa',
      email: 'nghia.giamdoc@pghome.vn',
      phone: '0986.722.324',
      role: ROLES.ADMIN,
      status: ACCOUNT_STATUS.ACTIVE,
      title: 'Giám Đốc Điều Hành (Ban Giám Đốc)',
      registeredAt: '2025-01-13T08:00:00Z',
      approvedAt: '2025-01-13T08:00:00Z',
      approvedBy: 'SYSTEM_ROOT',
      notes: 'Thẩm quyền tối cao: Phê duyệt con dấu đỏ & phân quyền toàn hệ thống.'
    },
    {
      id: 'USR-XUONG-01',
      username: 'kythuat.vu',
      fullName: 'Hoàng Công Vũ',
      email: 'vu.xuong@pghome.vn',
      phone: '0911.006.880',
      role: ROLES.XUONG_VATTU,
      status: ACCOUNT_STATUS.ACTIVE,
      title: 'Kỹ Thuật & Vật Tư Xưởng',
      registeredAt: '2025-02-01T08:30:00Z',
      approvedAt: '2025-02-01T09:00:00Z',
      approvedBy: 'USR-ADMIN-01',
      notes: 'Lập phiếu đề xuất vật tư. Chỉ gửi NCC khi phiếu có dấu đỏ duyệt của Giám Đốc.'
    },
    {
      id: 'USR-SALE-01',
      username: 'sale.hiep',
      fullName: 'Tống Trần Hiệp',
      email: 'hiep.sale@pghome.vn',
      phone: '0944.556.789',
      role: ROLES.VANPHONG_SALE,
      status: ACCOUNT_STATUS.ACTIVE,
      title: 'Sale Admin & Quản Trị Văn Phòng',
      registeredAt: '2025-02-01T08:45:00Z',
      approvedAt: '2025-02-01T09:05:00Z',
      approvedBy: 'USR-ADMIN-01',
      notes: 'Quản lý hợp đồng, công nợ văn phòng. Tuyệt đối không can thiệp xưởng sản xuất.'
    },
    {
      id: 'USR-DUTOAN-01',
      username: 'dutoan.dung',
      fullName: 'Đường Việt Dũng',
      email: 'dung.dutoan@pghome.vn',
      phone: '0933.778.899',
      role: ROLES.DU_TOAN_SALE,
      status: ACCOUNT_STATUS.ACTIVE,
      title: 'Chuyên Viên Dự Toán & Bóc Tách Báo Giá',
      registeredAt: '2025-02-10T10:00:00Z',
      approvedAt: '2025-02-10T10:30:00Z',
      approvedBy: 'USR-ADMIN-01',
      notes: 'Khởi tạo dự án, kiểm soát cost <= 54% trước khi xuất báo giá.'
    }
  ];

  // --- TRẠNG THÁI RUNTIME (STATE) ---
  let _users = [];
  let _currentUser = null;
  let _listeners = {
    authChange: [],
    userApproved: [],
    securityAlert: []
  };

  // --- HÀM HỖ TRỢ LƯU TRỮ VÀ LOCALSTORAGE ---
  function _loadUsersFromStorage() {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY_USERS);
      if (dataStr) {
        _users = JSON.parse(dataStr);
      } else {
        _users = JSON.parse(JSON.stringify(INITIAL_USERS));
        _saveUsersToStorage();
      }
    } catch (e) {
      console.warn('[W14 RBAC] Không thể đọc localStorage, sử dụng memory:', e);
      _users = JSON.parse(JSON.stringify(INITIAL_USERS));
    }
  }

  function _saveUsersToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(_users));
    } catch (e) {
      console.error('[W14 RBAC] Lỗi lưu người dùng vào localStorage:', e);
    }
  }

  function loadUsers() {
    _loadUsersFromStorage();
    return _users;
  }

  // --- HÀM TÍNH CHỮ KÝ KIỂM TRA TOÀN VẸN SESSION CHỐNG GIẢ MẠO DEVTOOLS ---
  function computeSessionSig(u) {
    if (!u) return '';
    const raw = (u.id || '') + '|' + (u.username || '') + '|' + (u.role || '') + '|PG_RBAC_V5_SALT';
    let h = 0;
    for (let i = 0; i < raw.length; i++) {
      h = Math.imul(31, h) + raw.charCodeAt(i) | 0;
    }
    return 'SIG_V5_' + (h >>> 0).toString(16);
  }

  function saveCurrentSession(user) {
    try {
      const u = user || _currentUser;
      if (u) {
        const sessObj = {
          id: u.id,
          username: u.username,
          fullName: u.fullName,
          role: u.role,
          status: u.status
        };
        sessObj._sig = computeSessionSig(sessObj);
        u._sig = sessObj._sig;
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessObj));
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch (e) {
      console.error('[W14 RBAC] Lỗi lưu session:', e);
    }
  }

  function getCurrentSession() {
    try {
      const sessStr = localStorage.getItem(STORAGE_KEY_SESSION);
      if (!sessStr) return null;
      const parsed = JSON.parse(sessStr);
      const userList = loadUsers();
      const origUser = userList.find(u => (parsed.id && u.id === parsed.id) || (parsed.username && u.username === parsed.username));

      // Kiểm tra chữ ký chống giả mạo session qua DevTools
      if (parsed._sig && parsed._sig !== computeSessionSig(parsed)) {
        console.warn('[W14 RBAC HARD-LOCK] CẢNH BÁO: Phát hiện session bị chỉnh sửa trái phép qua DevTools! Đang tự động khôi phục role gốc...');
        if (origUser) {
          parsed.role = origUser.role;
          parsed.status = origUser.status;
          parsed._sig = computeSessionSig(parsed);
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(parsed));
        }
      }
      return parsed;
    } catch (e) {
      console.error('[W14 RBAC] Lỗi getCurrentSession:', e);
      return null;
    }
  }

  function _loadSessionFromStorage() {
    try {
      const sessionUser = getCurrentSession();
      if (sessionUser) {
        // Cập nhật lại từ danh sách mới nhất để đảm bảo status/role đồng bộ
        const found = _users.find(u => u.id === sessionUser.id || u.username === sessionUser.username);
        _currentUser = found || null;
      } else {
        // Mặc định đăng nhập Giám Đốc ADMIN để sẵn sàng điều hành
        _currentUser = _users.find(u => u.role === ROLES.ADMIN) || null;
      }
    } catch (e) {
      _currentUser = _users.find(u => u.role === ROLES.ADMIN) || null;
    }
  }

  function _saveSessionToStorage() {
    saveCurrentSession(_currentUser);
  }

  function _notifyAuthChange() {
    _saveSessionToStorage();
    _listeners.authChange.forEach(fn => {
      try { fn(_currentUser); } catch (err) { console.error(err); }
    });
  }

  function _triggerSecurityAlert(title, message, details) {
    const alertData = {
      timestamp: new Date().toISOString(),
      title: title,
      message: message,
      details: details || {},
      currentUser: _currentUser ? { username: _currentUser.username, role: _currentUser.role } : null
    };
    console.warn('[W14 SECURITY HARD-LOCK ALERT]', alertData);
    _listeners.securityAlert.forEach(fn => {
      try { fn(alertData); } catch (err) { console.error(err); }
    });
  }

  // --- LOGIC PHÂN QUYỀN VÀ BẢO MẬT CỐT LÕI (RBAC HARD-LOCK) ---

  /**
   * Kiểm tra người dùng hiện tại có được đăng nhập hay bị chặn do trạng thái tài khoản
   */
  function isUserActive(user) {
    const u = user || _currentUser;
    return !!(u && u.status === ACCOUNT_STATUS.ACTIVE);
  }

  /**
   * Kiểm tra quyền truy cập vào 1 trong 4 Phân hệ
   */
  function canAccessPortal(portalKey, user) {
    const u = user || _currentUser;
    if (!u) {
      return { allowed: false, reason: 'Chưa đăng nhập. Vui lòng đăng nhập hệ thống PG Home.' };
    }

    if (u.status === ACCOUNT_STATUS.PENDING) {
      return {
        allowed: false,
        reason: 'Tài khoản của bạn đang ở trạng thái CHỜ PHÊ DUYỆT (PENDING). Vui lòng đợi Giám Đốc Nguyễn Viết Nghĩa kích hoạt tại tab "Phân Quyền Nhân Sự".',
        isPending: true
      };
    }

    if (u.status === ACCOUNT_STATUS.LOCKED || u.status === ACCOUNT_STATUS.REJECTED) {
      return {
        allowed: false,
        reason: `Tài khoản của bạn đang ở trạng thái ${u.status}. Quyền truy cập bị từ chối.`,
        isLocked: true
      };
    }

    // Giám Đốc ADMIN có thẩm quyền tối cao xem toàn bộ các phân hệ
    if (u.role === ROLES.ADMIN) {
      return { allowed: true, reason: 'Thẩm quyền Giám Đốc ADMIN: Toàn quyền truy cập.' };
    }

    const portal = PORTAL_DEFINITIONS[portalKey];
    if (!portal) {
      return { allowed: false, reason: `Phân hệ '${portalKey}' không tồn tại trong hệ thống.` };
    }

    // Kiểm tra đúng vai trò được phép
    if (u.role === portal.roleRequired) {
      return { allowed: true, reason: 'Hợp lệ: Người dùng đúng vai trò phân hệ.' };
    }

    // Đối với người dùng phân hệ Dự toán, cho phép dùng cả tài khoản Sale nếu được ủy quyền
    if (portalKey === PORTAL_KEYS.PORTAL_DU_TOAN_SALE && (u.role === ROLES.VANPHONG_SALE || u.role === ROLES.DU_TOAN_SALE)) {
      return { allowed: true, reason: 'Hợp lệ: Bộ phận Sale & Dự toán được cấp quyền phối hợp.' };
    }

    return {
      allowed: false,
      reason: `VI PHẠM RANH GIỚI BẢO MẬT: Bạn thuộc vai trò [${u.role}], không được phép can thiệp vào [${portal.name}].`
    };
  }

  /**
   * Kiểm tra quyền thực hiện một tính năng cụ thể
   */
  function canAccessFeature(featureKey, user) {
    const u = user || _currentUser;
    if (!u) return { allowed: false, reason: 'Chưa đăng nhập.' };

    if (u.status !== ACCOUNT_STATUS.ACTIVE) {
      return { allowed: false, reason: 'Tài khoản chưa được Giám Đốc kích hoạt ACTIVE.' };
    }

    // Giám Đốc ADMIN có quyền toàn bộ
    if (u.role === ROLES.ADMIN) {
      return { allowed: true, reason: 'Quyền ADMIN tối cao.' };
    }

    // Tìm portal của role hiện tại
    let userPortal = null;
    for (const key in PORTAL_DEFINITIONS) {
      if (PORTAL_DEFINITIONS[key].roleRequired === u.role) {
        userPortal = PORTAL_DEFINITIONS[key];
        break;
      }
    }

    if (!userPortal) {
      return { allowed: false, reason: `Không xác định được phân hệ cho vai trò [${u.role}].` };
    }

    // Kiểm tra danh sách cấm tuyệt đối (Strictly Forbidden)
    if (userPortal.forbiddenFeatures && userPortal.forbiddenFeatures.includes(featureKey)) {
      _triggerSecurityAlert('CẢNH BÁO XÂM PHẠM VÙNG CẤM', `Người dùng ${u.username} (${u.role}) cố tình truy cập tính năng bị cấm: ${featureKey}`, { featureKey });
      return {
        allowed: false,
        isForbidden: true,
        reason: `LUẬT SẮT PG HOME: Phân hệ [${u.role}] TUYỆT ĐỐI CẤM can thiệp vào tính năng '${featureKey}'!`
      };
    }

    // Kiểm tra danh sách được phép
    if (userPortal.allowedFeatures && userPortal.allowedFeatures.includes(featureKey)) {
      return { allowed: true, reason: 'Tính năng nằm trong phạm vi cấp phép.' };
    }

    return {
      allowed: false,
      reason: `Tính năng '${featureKey}' không thuộc phân quyền của vai trò [${u.role}].`
    };
  }

  // --- QUY TRÌNH DUYỆT TÀI KHOẢN MỚI TỪ PENDING SANG ACTIVE ---

  /**
   * Đăng ký tài khoản nhân sự mới (Mặc định trạng thái PENDING)
   */
  function registerNewUser(formData) {
    if (!formData.username || !formData.fullName) {
      return { success: false, error: 'Thiếu thông tin bắt buộc (Username, Họ tên).' };
    }

    // Kiểm tra trùng username
    const cleanUsername = formData.username.trim().toLowerCase();
    const existing = _users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      return { success: false, error: `Tên đăng nhập '${cleanUsername}' đã tồn tại trong hệ thống!` };
    }

    const newUser = {
      id: 'USR-' + Date.now().toString(36).toUpperCase(),
      username: cleanUsername,
      fullName: formData.fullName.trim(),
      email: formData.email ? formData.email.trim() : '',
      phone: formData.phone ? formData.phone.trim() : LEGAL_INFO.hotline,
      role: null,                               // Bắt buộc Giám Đốc chỉ định khi duyệt
      requestedRole: formData.requestedRole || ROLES.VANPHONG_SALE, // Vai trò mong muốn đăng ký
      status: ACCOUNT_STATUS.PENDING,          // BẮT BUỘC: Mặc định luôn là PENDING
      title: formData.title || 'Nhân sự mới',
      registeredAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      notes: formData.notes || 'Chờ Giám Đốc phân quyền và phê duyệt kích hoạt.'
    };

    _users.push(newUser);
    _saveUsersToStorage();

    return {
      success: true,
      user: newUser,
      message: 'Đăng ký thành công! Tài khoản đang ở trạng thái PENDING và cần Giám Đốc Nguyễn Viết Nghĩa duyệt kích hoạt tại tab "Phân Quyền Nhân Sự".'
    };
  }

  /**
   * GIÁM ĐỐC DUYỆT TÀI KHOẢN: Chuyển từ PENDING sang ACTIVE và phân bổ Phân hệ (Role)
   */
  function approveUserAccount(targetUserId, assignedRole, adminPinOrToken) {
    // Chốt chặn kiểm tra: Người thực hiện BẮT BUỘC là Giám Đốc ADMIN
    if (!_currentUser || _currentUser.role !== ROLES.ADMIN) {
      _triggerSecurityAlert('VI PHẠM QUYỀN DUYỆT NHÂN SỰ', 'Tài khoản không phải Giám Đốc ADMIN đang cố phê duyệt nhân sự.', { targetUserId });
      return {
        success: false,
        error: 'THẨM QUYỀN TỐI CAO: Chỉ có Giám Đốc Nguyễn Viết Nghĩa (ADMIN) mới có quyền duyệt và kích hoạt nhân sự!'
      };
    }

    // Kiểm tra vai trò hợp lệ
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(assignedRole)) {
      return { success: false, error: `Vai trò phân hệ '${assignedRole}' không hợp lệ!` };
    }

    const targetUser = _users.find(u => u.id === targetUserId);
    if (!targetUser) {
      return { success: false, error: `Không tìm thấy nhân sự có ID '${targetUserId}'.` };
    }

    // Cập nhật trạng thái sang ACTIVE
    const previousStatus = targetUser.status;
    targetUser.status = ACCOUNT_STATUS.ACTIVE;
    targetUser.role = assignedRole;
    targetUser.approvedAt = new Date().toISOString();
    targetUser.approvedBy = `${_currentUser.fullName} (${_currentUser.username})`;
    targetUser.notes = `Đã duyệt kích hoạt vào ${PORTAL_DEFINITIONS['PORTAL_' + assignedRole]?.name || assignedRole}. Ngày duyệt: ${new Date().toLocaleDateString('vi-VN')}`;

    _saveUsersToStorage();

    // Bắn sự kiện thông báo
    const eventPayload = {
      user: targetUser,
      previousStatus: previousStatus,
      assignedRole: assignedRole,
      approvedBy: _currentUser
    };
    _listeners.userApproved.forEach(fn => {
      try { fn(eventPayload); } catch (e) { console.error(e); }
    });

    return {
      success: true,
      user: targetUser,
      message: `ĐÃ DUYỆT THÀNH CÔNG! Tài khoản [${targetUser.fullName}] đã chuyển sang ACTIVE với vai trò [${assignedRole}].`
    };
  }

  /**
   * Giám Đốc từ chối hoặc khóa tài khoản
   */
  function changeUserStatus(targetUserId, newStatus, reason) {
    if (!_currentUser || _currentUser.role !== ROLES.ADMIN) {
      return { success: false, error: 'Chỉ Giám Đốc ADMIN mới có thẩm quyền thay đổi trạng thái tài khoản!' };
    }

    const targetUser = _users.find(u => u.id === targetUserId);
    if (!targetUser) {
      return { success: false, error: 'Không tìm thấy người dùng.' };
    }

    if (targetUser.role === ROLES.ADMIN && targetUser.id === _currentUser.id) {
      return { success: false, error: 'Không thể tự khóa hoặc từ chối tài khoản Giám Đốc gốc!' };
    }

    targetUser.status = newStatus;
    targetUser.statusUpdatedAt = new Date().toISOString();
    targetUser.statusUpdatedBy = _currentUser.username;
    targetUser.statusReason = reason || 'Giám Đốc điều chỉnh trạng thái.';

    _saveUsersToStorage();
    return {
      success: true,
      user: targetUser,
      message: `Đã chuyển tài khoản [${targetUser.fullName}] sang trạng thái ${newStatus}.`
    };
  }

  // --- CÁC CHỐT CHẶN NGHIỆP VỤ ĐẶC THÙ THEO GEMINI.MD ---

  /**
   * CHỐT CHẶN VẬT TƯ XƯỞNG (Vũ - XUONG_VATTU):
   * Quy tắc sống còn: Vũ chỉ được phép gửi đơn cho NCC khi phiếu đã được GIÁM ĐỐC DUYỆT & ĐÓNG DẤU ĐỎ ĐIỆN TỬ.
   */
  function guardSendMaterialOrderToNCC(purchaseOrder, currentUser) {
    const u = currentUser || _currentUser;

    if (!u) {
      return { allowed: false, error: 'Chưa xác thực người dùng.' };
    }

    // Nếu phiếu chưa được duyệt và chưa có dấu đỏ
    if (!purchaseOrder || !purchaseOrder.isApprovedByAdmin || !purchaseOrder.redStampSignature) {
      _triggerSecurityAlert(
        'CHỐT CHẶN SỐNG CÒN VI PHẠM',
        `Kỹ thuật xưởng cố tình gửi đơn đặt vật tư khi CHƯA CÓ DẤU ĐỎ DUYỆT của Giám Đốc!`,
        { poId: purchaseOrder?.id, user: u.username }
      );
      return {
        allowed: false,
        error: 'QUY TẮC SỐNG CÒN: Vũ chỉ được phép gửi đơn cho nhà cung cấp (An Cường, Hafele, Lam Giang, Quốc Tâm...) khi phiếu đã được GIÁM ĐỐC DUYỆT & ĐÓNG DẤU ĐỎ. Chưa có dấu duyệt đỏ thì TUYỆT ĐỐI CẤM NHẬP HÀNG!'
      };
    }

    return {
      allowed: true,
      message: 'Hợp lệ: Phiếu đề xuất vật tư đã có Dấu Đỏ Điện Tử của Giám Đốc Nguyễn Viết Nghĩa. Được phép gửi NCC.'
    };
  }

  /**
   * GIÁM ĐỐC ĐÓNG DẤU ĐỎ ĐIỆN TỬ DUYỆT PHIẾU VẬT TƯ
   */
  function adminSignAndStampOrder(orderId, orderDetails) {
    if (!_currentUser || _currentUser.role !== ROLES.ADMIN) {
      return {
        success: false,
        error: 'THẨM QUYỀN TỐI CAO: Chỉ có Giám Đốc ADMIN mới có quyền phê duyệt và đóng dấu đỏ điện tử!'
      };
    }

    const stampToken = 'PG-STAMP-RED-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now();
    const stampData = {
      orderId: orderId,
      stampedBy: `${_currentUser.fullName} (${_currentUser.title})`,
      stampedAt: new Date().toISOString(),
      stampToken: stampToken,
      legalEntity: LEGAL_INFO.companyName,
      taxCode: LEGAL_INFO.taxCode,
      digitalStampText: 'ĐÃ DUYỆT - BAN GIÁM ĐỐC PHÚ GIA',
      status: 'APPROVED_STAMPED'
    };

    // Lưu vào kho dấu đỏ
    try {
      const allStamps = JSON.parse(localStorage.getItem(STORAGE_KEY_PO_STAMPS) || '{}');
      allStamps[orderId] = stampData;
      localStorage.setItem(STORAGE_KEY_PO_STAMPS, JSON.stringify(allStamps));
    } catch (e) {
      console.warn('Lỗi lưu dấu đỏ:', e);
    }

    return {
      success: true,
      stamp: stampData,
      message: `Đã phê duyệt và đóng DẤU ĐỎ ĐIỆN TỬ cho Phiếu vật tư [${orderId}]. Xưởng Vũ đã có thể gửi đơn NCC!`
    };
  }

  /**
   * CHỐT CHẶN 54% DỰ TOÁN BÁO GIÁ (Hiệp & Dũng - DU_TOAN_SALE):
   * Kiểm soát chặt chẽ tỷ lệ chi phí cost <= 54% trước khi xuất báo giá gửi khách hàng.
   * Lợi nhuận ròng phải đạt 18% - 20% bỏ túi Giám Đốc.
   */
  function validateEstimateCostRatio(estimateData) {
    const totalCost = Number(estimateData.totalCost || (estimateData.materialCost || 0) + (estimateData.laborCost || 0));
    const totalRevenue = Number(estimateData.totalRevenue || estimateData.totalQuotationPrice || 0);

    if (totalRevenue <= 0) {
      return {
        valid: false,
        ratio: 0,
        error: 'Tổng giá trị doanh thu báo giá không hợp lệ (phải > 0).'
      };
    }

    const costRatio = totalCost / totalRevenue;
    const ratioPercent = (costRatio * 100).toFixed(2);

    if (costRatio > 0.54) {
      // Nếu là Giám Đốc ADMIN thì được quyền ký duyệt ngoại lệ
      const isAdminApproved = _currentUser && _currentUser.role === ROLES.ADMIN && estimateData.adminOverride;

      if (!isAdminApproved) {
        return {
          valid: false,
          costRatio: costRatio,
          ratioPercent: `${ratioPercent}%`,
          threshold: '54.00%',
          error: `CHỐT CHẶN 54%: Tỷ lệ cost (${ratioPercent}%) vượt ngưỡng trần 54%! Không đảm bảo Lợi nhuận ròng 18% - 20% bỏ túi Giám Đốc. BẮT BUỘC phải tối ưu vật tư/công thợ hoặc cần Giám Đốc phê duyệt ngoại lệ trước khi xuất báo giá gửi khách!`
        };
      }
    }

    return {
      valid: true,
      costRatio: costRatio,
      ratioPercent: `${ratioPercent}%`,
      estimatedNetProfitRatio: `${((1 - costRatio - 0.26) * 100).toFixed(1)}%`, // Ước tính sau chi phí vận hành
      message: `HỢP LỆ AN TOÀN: Tỷ lệ chi phí cost đạt ${ratioPercent}% (<= 54%). Đảm bảo biên lợi nhuận ròng Giám Đốc.`
    };
  }

  // --- QUẢN LÝ ĐĂNG NHẬP / PHIÊN LÀM VIỆC ---
  function login(username) {
    _loadUsersFromStorage();
    const user = _users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return { success: false, error: `Không tìm thấy tài khoản '${username}'.` };
    }

    _currentUser = user;
    _notifyAuthChange();

    if (user.status === ACCOUNT_STATUS.PENDING) {
      return {
        success: true,
        user: user,
        isPending: true,
        warning: 'Tài khoản đang chờ Giám Đốc phê duyệt. Bạn chỉ có thể xem màn hình chờ kích hoạt.'
      };
    }

    if (user.status !== ACCOUNT_STATUS.ACTIVE) {
      return {
        success: false,
        user: user,
        error: `Tài khoản của bạn đang ở trạng thái ${user.status}. Vui lòng liên hệ Giám Đốc 0986.722.324.`
      };
    }

    return {
      success: true,
      user: user,
      message: `Đăng nhập thành công: ${user.fullName} [${user.role}]`
    };
  }

  function logout() {
    _currentUser = null;
    _notifyAuthChange();
    return { success: true, message: 'Đã đăng xuất an toàn.' };
  }

  function switchUserByRole(role) {
    _loadUsersFromStorage();
    const user = _users.find(u => u.role === role && u.status === ACCOUNT_STATUS.ACTIVE);
    if (user) {
      _currentUser = user;
      _notifyAuthChange();
      return { success: true, user: user };
    }
    return { success: false, error: `Không tìm thấy tài khoản ACTIVE nào với vai trò ${role}` };
  }

  // --- GIAO DIỆN & TRÌNH BÀY (UI COMPONENTS & DOM SECURITY GUARDS) ---

  /**
   * Tạo phần HTML bảng điều khiển Phân Quyền Nhân Sự dành riêng cho Giám Đốc (ADMIN)
   */
  function renderAdminUserManagementHtml() {
    _loadUsersFromStorage();
    const pendingUsers = _users.filter(u => u.status === ACCOUNT_STATUS.PENDING);
    const activeUsers = _users.filter(u => u.status === ACCOUNT_STATUS.ACTIVE);
    const otherUsers = _users.filter(u => u.status !== ACCOUNT_STATUS.PENDING && u.status !== ACCOUNT_STATUS.ACTIVE);

    return `
      <div class="pg-rbac-admin-container" style="background:#0f172a; color:#f8fafc; border-radius:12px; padding:24px; font-family:'Segoe UI',sans-serif; border:1px solid #334155; box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);">
        <!-- Header Ban Giám Đốc -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #b91c1c; padding-bottom:16px; margin-bottom:20px;">
          <div>
            <h2 style="margin:0; font-size:22px; color:#ef4444; display:flex; align-items:center; gap:8px;">
              <span>🛡️</span> TAB PHÂN QUYỀN NHÂN SỰ & DUYỆT TÀI KHOẢN (BAN GIÁM ĐỐC)
            </h2>
            <div style="font-size:13px; color:#94a3b8; margin-top:4px;">
              Đơn vị: <b>${LEGAL_INFO.companyName}</b> | MST: <b>${LEGAL_INFO.taxCode}</b> | Hotline: <b>${LEGAL_INFO.hotline}</b>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="background:#b91c1c; color:#fff; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:20px; text-transform:uppercase;">
              Thẩm Quyền Tối Cao: Giám Đốc Nguyễn Viết Nghĩa
            </span>
          </div>
        </div>

        <!-- PHẦN 1: TÀI KHOẢN MỚI CHỜ DUYỆT (PENDING) -->
        <div style="margin-bottom:30px; background:#1e293b; border-radius:8px; border:1px solid #eab308; padding:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="margin:0; font-size:16px; color:#facc15; display:flex; align-items:center; gap:8px;">
              <span>⏳</span> DANH SÁCH NHÂN SỰ CHỜ DUYỆT (PENDING)
              <span style="background:#ca8a04; color:#fff; font-size:12px; padding:2px 8px; border-radius:10px;">${pendingUsers.length}</span>
            </h3>
            <span style="font-size:12px; color:#cbd5e1; font-style:italic;">
              *Tài khoản mới bắt buộc Giám Đốc chọn phân hệ và bấm Duyệt mới được phép hoạt động.
            </span>
          </div>

          ${pendingUsers.length === 0 ? `
            <div style="padding:20px; text-align:center; color:#94a3b8; background:#0f172a; border-radius:6px;">
              Hiện không có tài khoản nào đang chờ phê duyệt. Toàn bộ nhân sự đã được kiểm soát an toàn.
            </div>
          ` : `
            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
                <thead>
                  <tr style="background:#334155; color:#f8fafc;">
                    <th style="padding:10px;">Họ Và Tên</th>
                    <th style="padding:10px;">Tài Khoản / SĐT</th>
                    <th style="padding:10px;">Ngày Đăng Ký</th>
                    <th style="padding:10px; min-width:200px;">Chỉ Định Phân Hệ Cấp Quyền</th>
                    <th style="padding:10px; text-align:center;">Thao Tác Duyệt Của Giám Đốc</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendingUsers.map(u => `
                    <tr style="border-bottom:1px solid #334155;">
                      <td style="padding:12px 10px; font-weight:600; color:#f8fafc;">
                        ${u.fullName}
                        <div style="font-size:11px; color:#94a3b8; font-weight:normal;">${u.email || 'Chưa có email'}</div>
                      </td>
                      <td style="padding:12px 10px;">
                        <code style="background:#0f172a; padding:2px 6px; border-radius:4px; color:#38bdf8;">${u.username}</code>
                        <div style="font-size:11px; color:#94a3b8;">${u.phone}</div>
                      </td>
                      <td style="padding:12px 10px; color:#cbd5e1;">
                        ${new Date(u.registeredAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td style="padding:12px 10px;">
                        <select id="role_assign_${u.id}" style="width:100%; padding:6px 10px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:6px; font-size:13px;">
                          <option value="${ROLES.XUONG_VATTU}">2. Kỹ Thuật & Vật Tư Xưởng (Vũ)</option>
                          <option value="${ROLES.VANPHONG_SALE}">3. Sale Admin & Văn Phòng (Hiệp)</option>
                          <option value="${ROLES.DU_TOAN_SALE}">4. Dự Toán Nhà Ở & Báo Giá (Dũng)</option>
                          <option value="${ROLES.ADMIN}">1. Ban Giám Đốc (ADMIN)</option>
                        </select>
                      </td>
                      <td style="padding:12px 10px; text-align:center;">
                        <button onclick="window.PG_Modules_W14.uiActions.approve('${u.id}')" style="background:#16a34a; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-weight:bold; cursor:pointer; margin-right:6px;">
                          ✓ KÍCH HOẠT (ACTIVE)
                        </button>
                        <button onclick="window.PG_Modules_W14.uiActions.reject('${u.id}')" style="background:#dc2626; color:#fff; border:none; padding:7px 10px; border-radius:6px; font-size:12px; cursor:pointer;">
                          ✕ Từ Chối
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- PHẦN 2: DANH SÁCH 4 PHÂN HỆ ĐÃ KÍCH HOẠT (ACTIVE) -->
        <div style="background:#1e293b; border-radius:8px; border:1px solid #334155; padding:18px;">
          <h3 style="margin:0 0 14px 0; font-size:16px; color:#38bdf8; display:flex; align-items:center; gap:8px;">
            <span>👥</span> DANH SÁCH NHÂN SỰ ĐANG HOẠT ĐỘNG (ACTIVE - 4 PHÂN HỆ)
          </h3>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
              <thead>
                <tr style="background:#334155; color:#f8fafc;">
                  <th style="padding:10px;">Họ Và Tên</th>
                  <th style="padding:10px;">Username</th>
                  <th style="padding:10px;">Phân Hệ Phụ Trách</th>
                  <th style="padding:10px;">Trạng Thái</th>
                  <th style="padding:10px;">Người Duyệt</th>
                  <th style="padding:10px; text-align:center;">Điều Chỉnh Quyền</th>
                </tr>
              </thead>
              <tbody>
                ${activeUsers.map(u => `
                  <tr style="border-bottom:1px solid #334155;">
                    <td style="padding:10px; font-weight:600; color:#f8fafc;">${u.fullName}</td>
                    <td style="padding:10px;"><code>${u.username}</code></td>
                    <td style="padding:10px;">
                      <span style="display:inline-block; padding:3px 8px; border-radius:4px; font-weight:bold; font-size:11px; background:${PORTAL_DEFINITIONS['PORTAL_' + u.role]?.badgeColor || '#475569'}; color:#fff;">
                        ${PORTAL_DEFINITIONS['PORTAL_' + u.role]?.name || u.role}
                      </span>
                    </td>
                    <td style="padding:10px;">
                      <span style="color:#4ade80; font-weight:bold;">● ACTIVE</span>
                    </td>
                    <td style="padding:10px; color:#94a3b8; font-size:12px;">${u.approvedBy || 'Hệ thống'}</td>
                    <td style="padding:10px; text-align:center;">
                      ${u.role !== ROLES.ADMIN ? `
                        <button onclick="window.PG_Modules_W14.uiActions.lock('${u.id}')" style="background:#475569; color:#f8fafc; border:none; padding:5px 10px; border-radius:4px; font-size:11px; cursor:pointer;">
                          🔒 Khóa Quyền
                        </button>
                      ` : `
                        <span style="color:#ef4444; font-size:11px; font-weight:bold;">GỐC TỐI CAO</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Tạo HTML hiển thị thanh điều hướng 4 phân hệ (Portal Navigation Bar)
   */
  function renderPortalNavigationBarHtml() {
    const user = _currentUser;
    return `
      <div class="pg-portals-nav" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-bottom:20px; font-family:'Segoe UI',sans-serif;">
        ${Object.values(PORTAL_DEFINITIONS).map(portal => {
          const access = canAccessPortal(portal.id, user);
          const isCurrentActive = user && (user.role === portal.roleRequired || (user.role === ROLES.ADMIN && portal.id === PORTAL_KEYS.PORTAL_ADMIN));
          const opacity = access.allowed ? '1' : '0.45';
          const borderColor = isCurrentActive ? portal.badgeColor : '#334155';

          return `
            <div class="pg-portal-card" data-portal-id="${portal.id}" style="background:#1e293b; border:2px solid ${borderColor}; border-radius:10px; padding:14px; opacity:${opacity}; transition:all 0.2s; position:relative; overflow:hidden;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <span style="font-size:11px; font-weight:bold; color:#fff; background:${portal.badgeColor}; padding:2px 8px; border-radius:12px; text-transform:uppercase;">
                  ${portal.code}
                </span>
                ${access.allowed ? `
                  <span style="color:#22c55e; font-size:11px; font-weight:bold;">✓ Có Quyền</span>
                ` : `
                  <span style="color:#ef4444; font-size:11px; font-weight:bold;">🔒 Khóa</span>
                `}
              </div>
              <h4 style="margin:0 0 6px 0; color:#f8fafc; font-size:14px;">${portal.name}</h4>
              <p style="margin:0; font-size:12px; color:#94a3b8; line-height:1.4;">${portal.subtitle}</p>
              ${!access.allowed ? `
                <div style="font-size:11px; color:#f87171; margin-top:8px; border-top:1px dashed #475569; padding-top:6px;">
                  ${access.reason}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Tự động quét và khóa các phần tử DOM có gắn data-rbac
   */
  function applyDomSecurityGuards() {
    if (typeof document === 'undefined') return;

    // Quét các element có thuộc tính data-portal-guard
    const portalElements = document.querySelectorAll('[data-portal-guard]');
    portalElements.forEach(el => {
      const portalKey = el.getAttribute('data-portal-guard');
      const access = canAccessPortal(portalKey);
      if (!access.allowed) {
        el.style.display = 'none';
        el.setAttribute('data-rbac-hidden', 'true');
      } else {
        if (el.getAttribute('data-rbac-hidden') === 'true') {
          el.style.display = '';
          el.removeAttribute('data-rbac-hidden');
        }
      }
    });

    // Quét các element có thuộc tính data-feature-guard
    const featureElements = document.querySelectorAll('[data-feature-guard]');
    featureElements.forEach(el => {
      const featureKey = el.getAttribute('data-feature-guard');
      const access = canAccessFeature(featureKey);
      if (!access.allowed) {
        el.style.display = 'none';
        el.setAttribute('data-rbac-hidden', 'true');
      } else {
        if (el.getAttribute('data-rbac-hidden') === 'true') {
          el.style.display = '';
          el.removeAttribute('data-rbac-hidden');
        }
      }
    });

    // Khóa các nút gửi vật tư cho NCC nếu chưa có dấu đỏ
    const sendPoButtons = document.querySelectorAll('[data-action-send-po]');
    sendPoButtons.forEach(btn => {
      const isStamped = btn.getAttribute('data-stamped') === 'true';
      if (!isStamped && _currentUser && _currentUser.role !== ROLES.ADMIN) {
        btn.setAttribute('disabled', 'disabled');
        btn.style.opacity = '0.5';
        btn.title = 'CHỐT CHẶN: Chỉ gửi được cho NCC khi Giám Đốc đã duyệt và đóng dấu đỏ!';
      }
    });
  }

  // Khởi tạo ngay khi nạp module
  _loadUsersFromStorage();
  _loadSessionFromStorage();

  // --- API XUẤT RA TOÀN CỤC (PUBLIC INTERFACE) ---
  const publicApi = {
    // Thông tin & Pháp lý chuẩn PG Home
    version: '4.0.0-PROD',
    legalInfo: LEGAL_INFO,
    roles: ROLES,
    status: ACCOUNT_STATUS,
    portals: PORTAL_KEYS,
    portalDefinitions: PORTAL_DEFINITIONS,

    // Quản lý Phiên & Người Dùng
    getCurrentUser: function () {
      return _currentUser ? Object.assign({}, _currentUser) : null;
    },
    getAllUsers: function () {
      _loadUsersFromStorage();
      return _users.map(u => Object.assign({}, u));
    },
    getPendingUsers: function () {
      _loadUsersFromStorage();
      return _users.filter(u => u.status === ACCOUNT_STATUS.PENDING);
    },
    login: login,
    logout: logout,
    switchUserByRole: switchUserByRole,

    // Quy trình Duyệt & Kích Hoạt Nhân Sự Mới (PENDING -> ACTIVE)
    registerNewUser: registerNewUser,
    approveUserAccount: approveUserAccount,
    changeUserStatus: changeUserStatus,

    // Ranh Giới Kiểm Soát & Bảo Mật 4 Phân Hệ (RBAC Guard)
    canAccessPortal: canAccessPortal,
    canAccessFeature: canAccessFeature,
    isUserActive: isUserActive,

    // Chốt Chặn Nghiệp Vụ Cốt Tử
    guardSendMaterialOrderToNCC: guardSendMaterialOrderToNCC,
    adminSignAndStampOrder: adminSignAndStampOrder,
    validateEstimateCostRatio: validateEstimateCostRatio,

    // Trình Diễn UI & DOM Guard
    renderAdminUserManagementHtml: renderAdminUserManagementHtml,
    renderPortalNavigationBarHtml: renderPortalNavigationBarHtml,
    applyDomSecurityGuards: applyDomSecurityGuards,

    // Cơ chế Lắng Nghe Sự Kiện (Events)
    onAuthChange: function (callback) {
      if (typeof callback === 'function') _listeners.authChange.push(callback);
    },
    onUserApproved: function (callback) {
      if (typeof callback === 'function') _listeners.userApproved.push(callback);
    },
    onSecurityAlert: function (callback) {
      if (typeof callback === 'function') _listeners.securityAlert.push(callback);
    },

    // Các hàm tương tác trực tiếp từ HTML UI buttons
    uiActions: {
      approve: function (userId) {
        const selectEl = document.getElementById('role_assign_' + userId);
        const assignedRole = selectEl ? selectEl.value : ROLES.VANPHONG_SALE;
        const res = approveUserAccount(userId, assignedRole);
        alert(res.message || res.error);
        if (typeof document !== 'undefined') {
          const container = document.querySelector('.pg-rbac-admin-container');
          if (container && container.parentElement) {
            container.parentElement.innerHTML = renderAdminUserManagementHtml();
          }
        }
      },
      reject: function (userId) {
        const reason = prompt('Nhập lý do từ chối tài khoản:') || 'Giám Đốc không phê duyệt.';
        const res = changeUserStatus(userId, ACCOUNT_STATUS.REJECTED, reason);
        alert(res.message || res.error);
        if (typeof document !== 'undefined') {
          const container = document.querySelector('.pg-rbac-admin-container');
          if (container && container.parentElement) {
            container.parentElement.innerHTML = renderAdminUserManagementHtml();
          }
        }
      },
      lock: function (userId) {
        if (!confirm('Bạn có chắc chắn muốn KHÓA tài khoản này?')) return;
        const res = changeUserStatus(userId, ACCOUNT_STATUS.LOCKED, 'Giám Đốc khóa khẩn cấp.');
        alert(res.message || res.error);
        if (typeof document !== 'undefined') {
          const container = document.querySelector('.pg-rbac-admin-container');
          if (container && container.parentElement) {
            container.parentElement.innerHTML = renderAdminUserManagementHtml();
          }
        }
      }
    }
  };

  return publicApi;
});
