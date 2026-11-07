/**
 * ==============================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI THẤT & XÂY DỰNG PHÚ GIA (PG HOME LUXURY)
 * MODULE W13: CƠ CHẾ PHÊ DUYỆT & ĐÓNG DẤU ĐỎ ĐIỆN TỬ BAN GIÁM ĐỐC (ADMIN)
 * CHO PHIẾU ĐỀ XUẤT ĐẶT HÀNG VẬT TƯ XƯỞNG (XUONG_VATTU - VŨ)
 * ==============================================================================
 * KỶ LUẬT SẮT THEO GEMINI.md (MỤC 2):
 * - Phân hệ Xưởng/Vật tư (Vũ): Chỉ được lập phiếu đề xuất vật tư theo bóc tách kỹ thuật.
 * - Quy tắc sống còn: Vũ CHỈ ĐƯỢC PHÉP gửi đơn cho NCC (An Cường, Hafele, Lam Giang,
 *   Quốc Tâm...) KHI VÀ CHỈ KHI phiếu đã được GIÁM ĐỐC DUYỆT & ĐÓNG DẤU ĐỎ ĐIỆN TỬ.
 * - CHƯA CÓ DẤU DUYỆT ĐỎ THÌ TUYỆT ĐỐI CẤM NHẬP HÀNG & KHÓA CỨNG MỌI THAO TÁC XUẤT/GỬI.
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W13 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // 1. CHUẨN THƯƠNG HIỆU & PHÁP LÝ CHÍNH THỨC PHÚ GIA (BẤT KHẢ XÂM PHẠM)
  const BRAND_LEGAL = Object.freeze({
    entityName: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    bizLicenseNumber: '042203002931',
    regDate: '13/01/2025',
    legalRep: 'Nguyễn Trọng Nghĩa',
    directorName: 'Nguyễn Viết Nghĩa',
    taxCode: '042203002931',
    addressDKKD: 'Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh',
    officeAndFactory: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    hotline: '0973.562.789',
    brandBadge: 'PG HOME LUXURY'
  });

  // 2. DANH MỤC TRẠNG THÁI VÀ MÃ LỖI
  const APPROVAL_STATUS = Object.freeze({
    DRAFT: 'DRAFT',                       // Vũ mới lập nháp
    PENDING_APPROVAL: 'PENDING_APPROVAL', // Đã gửi Giám Đốc, chờ duyệt
    ADMIN_APPROVED: 'ADMIN_APPROVED',     // Giám Đốc ĐÃ DUYỆT & ĐÓNG DẤU ĐỎ
    REJECTED: 'REJECTED'                  // Giám Đốc từ chối (yêu cầu sửa bóc tách)
  });

  const STORAGE_KEY = 'PG_HOME_PO_LIST_W13';

  // Helper tính mã băm giả lập SHA-256 nội bộ nhanh trên chuỗi
  function generateVerificationHash(poId, approver, timestamp, totalAmount) {
    const raw = `${poId}|${approver}|${timestamp}|${totalAmount}|${BRAND_LEGAL.taxCode}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    return `PG-STAMP-${hex}-${randomHex}`;
  }

  // 3. TẠO CON DẤU ĐỎ ĐIỆN TỬ SVG CHUẨN ĐỒ HỌA
  function generateRedStampSVG(po) {
    const stampDate = po.approvedAt ? new Date(po.approvedAt) : new Date();
    const dateStr = `NGÀY ${String(stampDate.getDate()).padStart(2, '0')}/${String(stampDate.getMonth() + 1).padStart(2, '0')}/${stampDate.getFullYear()}`;
    const timeStr = `${String(stampDate.getHours()).padStart(2, '0')}:${String(stampDate.getMinutes()).padStart(2, '0')}`;
    const approver = po.approvedBy || BRAND_LEGAL.directorName;
    const certHash = po.approvalHash || 'PG-VERIFIED';

    return `
      <div class="pg-red-stamp-wrapper" style="position: relative; display: inline-block; transform: rotate(-8deg); user-select: none;">
        <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(211, 47, 47, 0.3));">
          <!-- Vành tròn ngoài đôi nét đỏ -->
          <circle cx="110" cy="110" r="102" fill="none" stroke="#D32F2F" stroke-width="4.5" stroke-dasharray="1000" />
          <circle cx="110" cy="110" r="95" fill="none" stroke="#D32F2F" stroke-width="1.8" />

          <!-- Đường dẫn chữ cong tròn vòng ngoài -->
          <path id="circlePathW13" d="M 22,110 A 88,88 0 1,1 198,110 A 88,88 0 1,1 22,110" fill="none" />
          
          <text fill="#D32F2F" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9.5" font-weight="900" letter-spacing="1.5">
            <textPath href="#circlePathW13" startOffset="50%" text-anchor="middle">
              HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG
            </textPath>
          </text>

          <text fill="#D32F2F" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="8.5" font-weight="800" letter-spacing="1">
            <textPath href="#circlePathW13" startOffset="0%" text-anchor="middle">
              ★ MST: 042203002931 ★
            </textPath>
          </text>

          <!-- Vùng tâm con dấu: Ngôi sao & ĐÃ DUYỆT -->
          <g transform="translate(110, 110)">
            <!-- Ngôi sao đỏ ở giữa -->
            <polygon points="0,-32 9,-12 30,-12 13,1 19,22 0,9 -19,22 -13,1 -30,-12 -9,-12" fill="rgba(211,47,47,0.15)" stroke="#D32F2F" stroke-width="1.2" />
            
            <!-- Chữ ĐÃ PHÊ DUYỆT nổi bật -->
            <rect x="-70" y="-12" width="140" height="24" fill="#D32F2F" rx="3" />
            <text x="0" y="4" text-anchor="middle" fill="#FFFFFF" font-family="'Segoe UI', Arial, sans-serif" font-size="12" font-weight="900" letter-spacing="1.8">
              ĐÃ PHÊ DUYỆT
            </text>

            <!-- Chức danh & Người ký -->
            <text x="0" y="27" text-anchor="middle" fill="#B71C1C" font-family="'Segoe UI', Arial, sans-serif" font-size="9.5" font-weight="800">
              GIÁM ĐỐC
            </text>
            <text x="0" y="40" text-anchor="middle" fill="#D32F2F" font-family="'Segoe UI', Arial, sans-serif" font-size="10.5" font-weight="900">
              ${approver.toUpperCase()}
            </text>

            <!-- Ngày giờ & Mã Hash kiểm định -->
            <text x="0" y="54" text-anchor="middle" fill="#C62828" font-family="'Segoe UI', Arial, sans-serif" font-size="7.5" font-weight="700">
              ${dateStr} • ${timeStr}
            </text>
            <text x="0" y="65" text-anchor="middle" fill="#E53935" font-family="'Consolas', monospace" font-size="6.5" font-weight="600">
              [${certHash}]
            </text>
          </g>
        </svg>
      </div>
    `;
  }

  // 4. QUẢN LÝ DỮ LIỆU LOCALSTORAGE
  function loadPOList() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return getInitialMockPOs();
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('[W13] Lỗi đọc dữ liệu localStorage, dùng dữ liệu mặc định:', e);
      return getInitialMockPOs();
    }
  }

  function savePOList(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('[W13] Không thể lưu danh sách PO vào localStorage:', e);
    }
  }

  function getInitialMockPOs() {
    return [
      {
        id: 'PO-2026-001',
        projectCode: 'DA-NAM-2026',
        projectName: 'Biệt Thự Anh Nam - Hà Tĩnh',
        supplier: 'An Cường',
        creator: 'Vũ - XUONG_VATTU',
        createdAt: '2026-11-06T08:30:00Z',
        status: APPROVAL_STATUS.ADMIN_APPROVED,
        items: [
          { name: 'Gỗ MDF Lõi Xanh Chống Ẩm An Cường 17mm (MS 388EV)', unit: 'Tấm', qty: 28, unitPrice: 420000, total: 11760000 },
          { name: 'Tấm Hậu MDF Chống Ẩm 6mm (MS 388EV)', unit: 'Tấm', qty: 10, unitPrice: 220000, total: 2200000 },
          { name: 'Chỉ Nẹp Đồng Màu An Cường 21x1mm', unit: 'Cuộn (100m)', qty: 3, unitPrice: 350000, total: 1050000 }
        ],
        totalAmount: 15010000,
        notes: 'Bóc tách tủ áo + tủ bếp theo định mức 1.45 tấm/md tủ bếp và 1.05 tấm/m2 tủ áo',
        approvedBy: 'Nguyễn Viết Nghĩa',
        approvedAt: '2026-11-06T10:15:00Z',
        approvalHash: 'PG-STAMP-7B4F9A-AC2026',
        adminComment: 'Bóc tách chuẩn theo định mức Mục 24. Đồng ý cho đặt hàng.'
      },
      {
        id: 'PO-2026-002',
        projectCode: 'DA-LAN-2026',
        projectName: 'Chị Lan - Liền kề D’Metropole Hà Tĩnh',
        supplier: 'Hafele',
        creator: 'Vũ - XUONG_VATTU',
        createdAt: '2026-11-07T14:00:00Z',
        status: APPROVAL_STATUS.PENDING_APPROVAL,
        items: [
          { name: 'Bản Lề Giảm Chấn Hafele Inox 304', unit: 'Bộ', qty: 64, unitPrice: 45000, total: 2880000 },
          { name: 'Ray Trượt Bi 3 Tầng Hafele 450mm', unit: 'Bộ', qty: 12, unitPrice: 110000, total: 1320000 },
          { name: 'Tay Nâng Đôi Blum/Hafele HF25', unit: 'Bộ', qty: 1, unitPrice: 2850000, total: 2850000 }
        ],
        totalAmount: 7050000,
        notes: 'Phụ kiện cao cấp lắp ráp xưởng Phú Gia',
        approvedBy: null,
        approvedAt: null,
        approvalHash: null,
        adminComment: null
      },
      {
        id: 'PO-2026-003',
        projectCode: 'DA-HOANG-2026',
        projectName: 'Nhà Phố Anh Hoàng - Thạch Hà',
        supplier: 'Quốc Tâm',
        creator: 'Vũ - XUONG_VATTU',
        createdAt: '2026-11-07T16:20:00Z',
        status: APPROVAL_STATUS.DRAFT,
        items: [
          { name: 'Ốc Cam Liên Kết + Chốt Đợt Xưởng', unit: 'Hộp', qty: 5, unitPrice: 180000, total: 900000 },
          { name: 'Ke Góc Chữ L Thép Mạ Kẽm', unit: 'Túi (100c)', qty: 4, unitPrice: 120000, total: 480000 }
        ],
        totalAmount: 1380000,
        notes: 'Vật tư phụ ngũ kim xưởng',
        approvedBy: null,
        approvedAt: null,
        approvalHash: null,
        adminComment: null
      }
    ];
  }

  // 5. CÁC API NGHIỆP VỤ CỐT LÕI (CORE BUSINESS LOGIC)

  /**
   * Tạo mới Phiếu đề xuất vật tư xưởng (bởi Vũ)
   */
  function createPurchaseOrder(poData) {
    if (!poData || !poData.projectName || !poData.supplier) {
      throw new Error('Dữ liệu phiếu đề xuất không hợp lệ! Bắt buộc có Tên Dự Án và Nhà Cung Cấp.');
    }

    const list = loadPOList();
    const newId = `PO-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, '0')}`;
    
    let total = 0;
    const items = (poData.items || []).map(it => {
      const lineTotal = (it.qty || 0) * (it.unitPrice || 0);
      total += lineTotal;
      return {
        name: it.name || 'Vật tư',
        unit: it.unit || 'Cái',
        qty: Number(it.qty) || 0,
        unitPrice: Number(it.unitPrice) || 0,
        total: lineTotal
      };
    });

    const newPO = {
      id: newId,
      projectCode: poData.projectCode || `DA-PG-${Date.now().toString().slice(-4)}`,
      projectName: poData.projectName,
      supplier: poData.supplier,
      creator: 'Vũ - XUONG_VATTU',
      createdAt: new Date().toISOString(),
      status: APPROVAL_STATUS.DRAFT,
      items: items,
      totalAmount: total,
      notes: poData.notes || '',
      approvedBy: null,
      approvedAt: null,
      approvalHash: null,
      adminComment: null
    };

    list.unshift(newPO);
    savePOList(list);
    return newPO;
  }

  /**
   * Vũ gửi phiếu đề xuất lên Ban Giám Đốc chờ duyệt
   */
  function submitForApproval(poId) {
    const list = loadPOList();
    const po = list.find(p => p.id === poId);
    if (!po) throw new Error(`Không tìm thấy mã phiếu ${poId}`);

    if (po.status === APPROVAL_STATUS.ADMIN_APPROVED) {
      throw new Error(`Phiếu ${poId} đã được Giám Đốc duyệt rồi!`);
    }

    po.status = APPROVAL_STATUS.PENDING_APPROVAL;
    savePOList(list);
    return { success: true, message: `Đã chuyển phiếu ${poId} sang trạng thái Chờ Giám Đốc Phê Duyệt!`, po };
  }

  /**
   * GIÁM ĐỐC (ADMIN) PHÊ DUYỆT & ĐÓNG DẤU ĐỎ ĐIỆN TỬ
   * Thẩm quyền tối cao: Chỉ tài khoản ADMIN / Giám Đốc mới được gọi hàm này
   */
  function adminApproveOrder(poId, approverName = BRAND_LEGAL.directorName, comment = 'Đã kiểm tra bóc tách. Duyệt đặt hàng.') {
    const list = loadPOList();
    const po = list.find(p => p.id === poId);
    if (!po) throw new Error(`Không tìm thấy mã phiếu ${poId}`);

    const now = new Date().toISOString();
    const hash = generateVerificationHash(po.id, approverName, now, po.totalAmount);

    po.status = APPROVAL_STATUS.ADMIN_APPROVED;
    po.approvedBy = approverName || BRAND_LEGAL.directorName;
    po.approvedAt = now;
    po.approvalHash = hash;
    po.adminComment = comment;

    savePOList(list);
    return {
      success: true,
      message: `Giám Đốc đã phê duyệt và đóng Dấu Đỏ Điện Tử cho phiếu ${poId}!`,
      po: po
    };
  }

  /**
   * GIÁM ĐỐC TỪ CHỐI DUYỆT (Yêu cầu Vũ bóc tách lại)
   */
  function adminRejectOrder(poId, reason) {
    const list = loadPOList();
    const po = list.find(p => p.id === poId);
    if (!po) throw new Error(`Không tìm thấy mã phiếu ${poId}`);

    po.status = APPROVAL_STATUS.REJECTED;
    po.approvedBy = null;
    po.approvedAt = null;
    po.approvalHash = null;
    po.adminComment = `TỪ CHỐI: ${reason || 'Bóc tách sai định mức kỹ thuật hoặc giá cost vượt quy định.'}`;

    savePOList(list);
    return {
      success: true,
      message: `Đã từ chối phiếu ${poId}. Trả lại cho Vũ xử lý.`,
      po: po
    };
  }

  /**
   * KHÓA CỨNG: KIỂM TRA ĐIỀU KIỆN XUẤT ĐƠN / GỬI ĐƠN CHO NHÀ CUNG CẤP
   * @returns {boolean}
   */
  function canExportOrSendToSupplier(po) {
    if (!po) return false;
    // BẮT BUỘC TRẠNG THÁI PHẢI LÀ ADMIN_APPROVED VÀ CÓ HASH XÁC THỰC
    return po.status === APPROVAL_STATUS.ADMIN_APPROVED && Boolean(po.approvalHash);
  }

  /**
   * HÀM XUẤT / GỬI ĐƠN HÀNG CHO NCC
   * Nếu chưa có dấu đỏ: Ném ngoại lệ cưỡng chế chặn đứng ngay lập tức!
   */
  function exportOrSendOrderToSupplier(poId) {
    const list = loadPOList();
    const po = list.find(p => p.id === poId);
    if (!po) {
      throw new Error(`[LỖI] Không tìm thấy phiếu đề xuất ${poId}`);
    }

    // CHỐT CHẶN BẢO VỆ BẤT KHẢ XÂM PHẠM:
    if (!canExportOrSendToSupplier(po)) {
      const errMsg = `[KỶ LUẬT THÉP BỊ VI PHẠM] Phiếu ${po.id} CHƯA ĐƯỢC GIÁM ĐỐC DUYỆT & ĐÓNG DẤU ĐỎ ĐIỆN TỬ!\n` +
                     `Trạng thái hiện tại: [${po.status}].\n` +
                     `Quy tắc sống còn: Kỹ thuật vật tư Vũ tuyệt đối CẤM gửi đơn cho nhà cung cấp (${po.supplier}) khi chưa có dấu duyệt đỏ!`;
      console.error(errMsg);
      alert(errMsg);
      throw new Error(errMsg);
    }

    // Nếu đã có dấu đỏ: Cho phép xuất đơn thành công kèm mã xác nhận pháp lý
    const exportResult = {
      success: true,
      poId: po.id,
      supplier: po.supplier,
      totalAmount: po.totalAmount,
      approvedBy: po.approvedBy,
      approvedAt: po.approvedAt,
      verificationHash: po.approvalHash,
      companyLegal: BRAND_LEGAL.entityName,
      mst: BRAND_LEGAL.taxCode,
      hotline: BRAND_LEGAL.hotline,
      dispatchedAt: new Date().toISOString(),
      message: `Đơn đặt hàng ${po.id} đã được gửi thành công đến NCC ${po.supplier} kèm Dấu Đỏ Điện Tử của Giám Đốc!`
    };

    return exportResult;
  }

  // 6. RENDER GIAO DIỆN NGƯỜI DÙNG (UI COMPONENTS & CSS INJECTION)
  function injectStylesOnce() {
    if (document.getElementById('pg-w13-styles')) return;
    const style = document.createElement('style');
    style.id = 'pg-w13-styles';
    style.innerHTML = `
      .pg-w13-container {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #1e293b;
        background: #f8fafc;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        max-width: 1280px;
        margin: 20px auto;
      }
      .pg-w13-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 16px;
        margin-bottom: 24px;
      }
      .pg-w13-title {
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .pg-w13-legal-badge {
        background: #fee2e2;
        color: #991b1b;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 20px;
        border: 1px solid #f87171;
      }
      .pg-w13-role-switch {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #ffffff;
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid #cbd5e1;
      }
      .pg-w13-role-label {
        font-size: 13px;
        font-weight: 600;
      }
      .pg-w13-role-select {
        font-size: 13px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #94a3b8;
        background: #f1f5f9;
        cursor: pointer;
      }
      .pg-w13-table {
        width: 100%;
        border-collapse: collapse;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      .pg-w13-table th {
        background: #0f172a;
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 12px 14px;
        text-align: left;
        letter-spacing: 0.5px;
      }
      .pg-w13-table td {
        padding: 14px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 13px;
        vertical-align: middle;
      }
      .pg-w13-table tr:hover {
        background: #f8fafc;
      }
      .pg-badge-status {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 800;
        text-align: center;
      }
      .pg-badge-draft { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
      .pg-badge-pending { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
      .pg-badge-approved { background: #fee2e2; color: #b91c1c; border: 1px solid #f87171; }
      .pg-badge-rejected { background: #f3f4f6; color: #6b7280; border: 1px solid #d1d5db; text-decoration: line-through; }
      
      .pg-btn {
        padding: 7px 14px;
        font-size: 12px;
        font-weight: 700;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .pg-btn-admin-stamp {
        background: #dc2626;
        color: #ffffff;
        box-shadow: 0 2px 6px rgba(220,38,38,0.3);
      }
      .pg-btn-admin-stamp:hover {
        background: #b91c1c;
      }
      .pg-btn-send-ncc {
        background: #0284c7;
        color: #ffffff;
      }
      .pg-btn-send-ncc:hover {
        background: #0369a1;
      }
      .pg-btn-locked {
        background: #e2e8f0 !important;
        color: #94a3b8 !important;
        cursor: not-allowed !important;
        box-shadow: none !important;
        border: 1px dashed #cbd5e1 !important;
      }
      .pg-btn-submit {
        background: #059669;
        color: #ffffff;
      }
      .pg-btn-submit:hover {
        background: #047857;
      }
      .pg-modal-backdrop {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
      }
      .pg-modal-content {
        background: #ffffff;
        border-radius: 14px;
        width: 850px;
        max-width: 95%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        position: relative;
      }
      .pg-modal-close {
        position: absolute;
        top: 16px;
        right: 18px;
        background: none;
        border: none;
        font-size: 22px;
        font-weight: bold;
        color: #64748b;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Khởi tạo giao diện ứng dụng quản lý PO và đóng dấu đỏ vào container
   */
  function initUI(containerId, currentRole = 'ADMIN') {
    injectStylesOnce();
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) {
      console.warn(`[W13] Không tìm thấy phần tử HTML container: ${containerId}`);
      return;
    }

    let roleState = currentRole; // 'ADMIN' hoặc 'XUONG_VATTU'

    function render() {
      const list = loadPOList();

      container.innerHTML = `
        <div class="pg-w13-container">
          <div class="pg-w13-header">
            <div>
              <h2 class="pg-w13-title">
                🏢 PHÂN HỆ QUẢN LÝ & DUYỆT ĐƠN ĐẶT HÀNG VẬT TƯ XƯỞNG
              </h2>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                ${BRAND_LEGAL.entityName} • Hotline: <b>${BRAND_LEGAL.hotline}</b> • Nhà máy: <b>${BRAND_LEGAL.officeAndFactory}</b>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <span class="pg-w13-legal-badge">🔒 KHÓA CỨNG: CẤM GỬI NCC NẾU CHƯA CÓ DẤU ĐỎ</span>
              <div class="pg-w13-role-switch">
                <span class="pg-w13-role-label">Phân Hệ:</span>
                <select class="pg-w13-role-select" id="pgW13RoleSelect">
                  <option value="ADMIN" ${roleState === 'ADMIN' ? 'selected' : ''}>⭐ Giám Đốc (ADMIN) - Quyền Đóng Dấu Đỏ</option>
                  <option value="XUONG_VATTU" ${roleState === 'XUONG_VATTU' ? 'selected' : ''}>🔨 Vũ (XUONG_VATTU) - Kỹ Thuật Vật Tư</option>
                </select>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="font-size: 14px; font-weight: 700; color: #334155;">
              Danh Sách Đề Xuất Đặt Hàng Vật Tư Gần Đây (${list.length} phiếu):
            </div>
            ${roleState === 'XUONG_VATTU' ? `
              <button class="pg-btn pg-btn-submit" id="pgBtnCreatePOModal">
                ➕ Vũ Lập Phiếu Đề Xuất Mới
              </button>
            ` : ''}
          </div>

          <table class="pg-w13-table">
            <thead>
              <tr>
                <th style="width: 110px;">Mã Phiếu</th>
                <th>Dự Án / Công Trình</th>
                <th>Nhà Cung Cấp</th>
                <th>Người Lập</th>
                <th style="text-align: right;">Tổng Tiền</th>
                <th style="text-align: center;">Trạng Thái & Dấu Đỏ</th>
                <th style="text-align: center; width: 220px;">Thao Tác Thực Thi</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(po => {
                const isApproved = po.status === APPROVAL_STATUS.ADMIN_APPROVED;
                const isPending = po.status === APPROVAL_STATUS.PENDING_APPROVAL;
                const isDraft = po.status === APPROVAL_STATUS.DRAFT;
                const isRejected = po.status === APPROVAL_STATUS.REJECTED;

                let statusBadge = '';
                if (isApproved) {
                  statusBadge = `<span class="pg-badge-status pg-badge-approved">🔴 ĐÃ ĐÓNG DẤU ĐỎ (${po.approvalHash ? po.approvalHash.slice(0, 16) + '...' : 'APPROVED'})</span>`;
                } else if (isPending) {
                  statusBadge = `<span class="pg-badge-status pg-badge-pending">⏳ CHỜ GIÁM ĐỐC DUYỆT</span>`;
                } else if (isRejected) {
                  statusBadge = `<span class="pg-badge-status pg-badge-rejected">❌ TỪ CHỐI</span>`;
                } else {
                  statusBadge = `<span class="pg-badge-status pg-badge-draft">📝 NHÁP (VŨ)</span>`;
                }

                return `
                  <tr>
                    <td style="font-weight: 700; color: #0284c7;">${po.id}</td>
                    <td>
                      <div style="font-weight: 700; color: #0f172a;">${po.projectName}</div>
                      <div style="font-size: 11px; color: #64748b;">Mã DA: ${po.projectCode}</div>
                    </td>
                    <td><span style="font-weight: 700; color: #4338ca;">${po.supplier}</span></td>
                    <td>${po.creator}</td>
                    <td style="text-align: right; font-weight: 800; color: #047857;">
                      ${(po.totalAmount || 0).toLocaleString('vi-VN')} đ
                    </td>
                    <td style="text-align: center;">
                      ${statusBadge}
                      ${po.approvedAt ? `<div style="font-size: 10px; color: #dc2626; margin-top: 2px;">Bởi: ${po.approvedBy}</div>` : ''}
                    </td>
                    <td style="text-align: center;">
                      <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
                        <!-- Xem chi tiết -->
                        <button class="pg-btn" style="background: #e2e8f0; color: #334155;" onclick="window.PG_Modules_W13.openDetailModal('${po.id}')">
                          🔍 Xem
                        </button>

                        <!-- Quyền của ADMIN (Giám Đốc) -->
                        ${roleState === 'ADMIN' && !isApproved ? `
                          <button class="pg-btn pg-btn-admin-stamp" onclick="window.PG_Modules_W13.triggerAdminApprove('${po.id}')">
                            🔴 Ký & Đóng Dấu Đỏ
                          </button>
                        ` : ''}

                        <!-- Quyền của Vũ (XUONG_VATTU) -->
                        ${roleState === 'XUONG_VATTU' && isDraft ? `
                          <button class="pg-btn pg-btn-submit" onclick="window.PG_Modules_W13.triggerSubmitApproval('${po.id}')">
                            📤 Trình Giám Đốc
                          </button>
                        ` : ''}

                        <!-- NÚT GỬI ĐƠN CHO NCC - KHÓA CỨNG NẾU CHƯA CÓ DẤU ĐỎ -->
                        ${isApproved ? `
                          <button class="pg-btn pg-btn-send-ncc" onclick="window.PG_Modules_W13.triggerSendToSupplier('${po.id}')" title="Đã có dấu đỏ, được phép gửi đơn">
                            🚀 Gửi NCC
                          </button>
                        ` : `
                          <button class="pg-btn pg-btn-locked" disabled title="KHÓA CỨNG: Chưa có dấu đỏ Giám Đốc, cấm gửi đơn cho NCC!">
                            🔒 Khóa Gửi NCC
                          </button>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;

      // Event listener chuyển đổi vai trò
      const roleSelect = document.getElementById('pgW13RoleSelect');
      if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
          roleState = e.target.value;
          render();
        });
      }

      // Event listener tạo phiếu mới
      const btnCreate = document.getElementById('pgBtnCreatePOModal');
      if (btnCreate) {
        btnCreate.addEventListener('click', () => {
          openCreateModal();
        });
      }
    }

    render();

    // Lưu lại hàm re-render nội bộ
    window.PG_Modules_W13._internalReRender = render;
  }

  /**
   * Modal xem chi tiết phiếu và hiển thị con dấu đỏ thực tế
   */
  function openDetailModal(poId) {
    injectStylesOnce();
    const list = loadPOList();
    const po = list.find(p => p.id === poId);
    if (!po) return alert('Không tìm thấy phiếu đề xuất!');

    const isApproved = po.status === APPROVAL_STATUS.ADMIN_APPROVED;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'pg-modal-backdrop';
    modalBackdrop.id = 'pg-w13-detail-modal';

    modalBackdrop.innerHTML = `
      <div class="pg-modal-content">
        <button class="pg-modal-close" onclick="document.getElementById('pg-w13-detail-modal').remove()">×</button>
        
        <div style="border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 800; color: #dc2626; letter-spacing: 1px;">
            ${BRAND_LEGAL.entityName.toUpperCase()}
          </div>
          <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #0f172a;">
            PHIẾU ĐỀ XUẤT ĐẶT HÀNG VẬT TƯ SẢN XUẤT (${po.id})
          </h2>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
            Dự Án: <b>${po.projectName}</b> (${po.projectCode}) • Nhà Cung Cấp: <b style="color: #4338ca;">${po.supplier}</b>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">Chi Tiết Vật Tư Yêu Cầu Đặt Hàng:</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #e2e8f0; color: #334155; text-align: left;">
                <th style="padding: 8px 12px;">STT</th>
                <th style="padding: 8px 12px;">Tên Quy Cách Vật Tư</th>
                <th style="padding: 8px 12px;">ĐVT</th>
                <th style="padding: 8px 12px; text-align: right;">Số Lượng</th>
                <th style="padding: 8px 12px; text-align: right;">Đơn Giá Dự Kiến</th>
                <th style="padding: 8px 12px; text-align: right;">Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              ${(po.items || []).map((it, idx) => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px 12px;">${idx + 1}</td>
                  <td style="padding: 8px 12px; font-weight: 600;">${it.name}</td>
                  <td style="padding: 8px 12px;">${it.unit}</td>
                  <td style="padding: 8px 12px; text-align: right; font-weight: 700;">${it.qty}</td>
                  <td style="padding: 8px 12px; text-align: right;">${Number(it.unitPrice).toLocaleString('vi-VN')} đ</td>
                  <td style="padding: 8px 12px; text-align: right; font-weight: 700; color: #047857;">${Number(it.total).toLocaleString('vi-VN')} đ</td>
                </tr>
              `).join('')}
              <tr style="background: #f1f5f9; font-weight: 800; font-size: 13px;">
                <td colspan="5" style="padding: 10px 12px; text-align: right;">TỔNG CỘNG TIỀN VẬT TƯ:</td>
                <td style="padding: 10px 12px; text-align: right; color: #b91c1c;">${Number(po.totalAmount).toLocaleString('vi-VN')} đ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px; font-size: 12px; margin-bottom: 20px;">
          <b>Ghi chú bóc tách của Vũ:</b> ${po.notes || 'Không có ghi chú thêm.'}
        </div>

        <!-- KHU VỰC DẤU ĐỎ ĐIỆN TỬ BAN GIÁM ĐỐC -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
          <div style="font-size: 12px; color: #64748b;">
            <div>Người lập phiếu: <b>${po.creator}</b></div>
            <div>Thời gian lập: ${new Date(po.createdAt).toLocaleString('vi-VN')}</div>
            <div style="margin-top: 8px; font-style: italic; color: #b91c1c;">
              ${!isApproved ? '⚠️ CẢNH BÁO: Phiếu chưa có dấu đỏ. Tuyệt đối không gửi cho NCC!' : '✅ Phiếu đã được bảo chứng pháp lý điện tử.'}
            </div>
          </div>

          <div style="text-align: center;">
            <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 6px; text-transform: uppercase;">
              BAN GIÁM ĐỐC PHÊ DUYỆT
            </div>
            ${isApproved ? generateRedStampSVG(po) : `
              <div style="width: 200px; height: 140px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 12px; font-weight: bold; background: #f8fafc;">
                [CHƯA ĐÓNG DẤU ĐỎ]
              </div>
            `}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          ${!isApproved ? `
            <button class="pg-btn pg-btn-admin-stamp" onclick="window.PG_Modules_W13.triggerAdminApprove('${po.id}', true)">
              🔴 Giám Đốc Phê Duyệt & Đóng Dấu Đỏ Ngay
            </button>
          ` : `
            <button class="pg-btn pg-btn-send-ncc" onclick="window.PG_Modules_W13.triggerSendToSupplier('${po.id}')">
              🚀 Xuất File & Gửi NCC ${po.supplier}
            </button>
          `}
          <button class="pg-btn" style="background: #94a3b8; color: #fff;" onclick="document.getElementById('pg-w13-detail-modal').remove()">
            Đóng
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);
  }

  /**
   * Modal tạo phiếu đề xuất mới cho Vũ
   */
  function openCreateModal() {
    injectStylesOnce();
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'pg-modal-backdrop';
    modalBackdrop.id = 'pg-w13-create-modal';

    modalBackdrop.innerHTML = `
      <div class="pg-modal-content" style="width: 650px;">
        <button class="pg-modal-close" onclick="document.getElementById('pg-w13-create-modal').remove()">×</button>
        
        <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #0f172a;">
          🔨 Vũ Lập Phiếu Đề Xuất Đặt Hàng Vật Tư Mới
        </h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: bold;">Tên Công Trình / Khách Hàng:</label>
            <input type="text" id="w13NewProject" placeholder="Ví dụ: Căn Hộ Anh Hải - Vinhome" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
          </div>
          <div>
            <label style="font-size: 12px; font-weight: bold;">Nhà Cung Cấp:</label>
            <select id="w13NewSupplier" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
              <option value="An Cường">An Cường (Gỗ công nghiệp MDF/MFC/Acrylic)</option>
              <option value="Hafele">Hafele (Phụ kiện ngũ kim cao cấp)</option>
              <option value="Lam Giang">Lam Giang (Ván gỗ công nghiệp & gia công dán cạnh)</option>
              <option value="Quốc Tâm">Quốc Tâm (Phụ kiện phụ trợ xưởng)</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: bold;">Tên Vật Tư & Quy Cách (Dòng 1):</label>
          <input type="text" id="w13ItemName" placeholder="Ví dụ: Ván MDF Chống Ẩm 17mm Phủ Melamine" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; margin-bottom: 6px;" />
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-size: 11px;">ĐVT:</label>
              <input type="text" id="w13ItemUnit" value="Tấm" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
            </div>
            <div>
              <label style="font-size: 11px;">Số Lượng (Định mức Mục 24):</label>
              <input type="number" id="w13ItemQty" value="10" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
            </div>
            <div>
              <label style="font-size: 11px;">Đơn Giá (VNĐ):</label>
              <input type="number" id="w13ItemPrice" value="420000" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
            </div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="font-size: 12px; font-weight: bold;">Ghi Chú Kỹ Thuật:</label>
          <textarea id="w13NewNotes" rows="2" placeholder="Ghi rõ diện tích và định mức bóc tách..." style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;"></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="pg-btn pg-btn-submit" id="w13BtnSavePO">
            💾 Tạo Phiếu Đề Xuất
          </button>
          <button class="pg-btn" style="background: #94a3b8; color: #fff;" onclick="document.getElementById('pg-w13-create-modal').remove()">
            Hủy
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    document.getElementById('w13BtnSavePO').addEventListener('click', () => {
      const proj = document.getElementById('w13NewProject').value.trim();
      const supp = document.getElementById('w13NewSupplier').value;
      const itName = document.getElementById('w13ItemName').value.trim() || 'Vật tư gỗ';
      const itUnit = document.getElementById('w13ItemUnit').value.trim() || 'Tấm';
      const itQty = parseFloat(document.getElementById('w13ItemQty').value) || 1;
      const itPrice = parseFloat(document.getElementById('w13ItemPrice').value) || 0;
      const notes = document.getElementById('w13NewNotes').value.trim();

      if (!proj) return alert('Vui lòng nhập Tên Công Trình!');

      createPurchaseOrder({
        projectName: proj,
        supplier: supp,
        notes: notes,
        items: [
          { name: itName, unit: itUnit, qty: itQty, unitPrice: itPrice }
        ]
      });

      document.getElementById('pg-w13-create-modal').remove();
      if (window.PG_Modules_W13._internalReRender) {
        window.PG_Modules_W13._internalReRender();
      }
      alert('Đã tạo thành công Phiếu Đề Xuất Đặt Hàng Vật Tư!');
    });
  }

  // 7. CÁC HÀM TRIGGER TƯƠNG TÁC
  function triggerAdminApprove(poId, closeDetailModalAfter = false) {
    const comment = prompt('Nhập ý kiến phê duyệt của Giám Đốc:', 'Đã kiểm tra bóc tách kỹ thuật. Đạt định mức. Duyệt đóng dấu đỏ.');
    if (comment === null) return;

    try {
      const res = adminApproveOrder(poId, BRAND_LEGAL.directorName, comment);
      alert(`[THÀNH CÔNG] ${res.message}\nMã Dấu Đỏ: ${res.po.approvalHash}`);
      if (closeDetailModalAfter) {
        const detailModal = document.getElementById('pg-w13-detail-modal');
        if (detailModal) detailModal.remove();
      }
      if (window.PG_Modules_W13._internalReRender) {
        window.PG_Modules_W13._internalReRender();
      }
    } catch (err) {
      alert(`Lỗi phê duyệt: ${err.message}`);
    }
  }

  function triggerSubmitApproval(poId) {
    if (!confirm(`Xác nhận gửi phiếu ${poId} lên Giám Đốc phê duyệt?`)) return;
    try {
      submitForApproval(poId);
      if (window.PG_Modules_W13._internalReRender) {
        window.PG_Modules_W13._internalReRender();
      }
      alert('Đã gửi phiếu lên Ban Giám Đốc.');
    } catch (e) {
      alert(e.message);
    }
  }

  function triggerSendToSupplier(poId) {
    try {
      const res = exportOrSendOrderToSupplier(poId);
      alert(`🎉 [GỬI THÀNH CÔNG CHO NCC ${res.supplier}]\n` +
            `Đơn hàng: ${res.poId}\n` +
            `Tổng tiền: ${res.totalAmount.toLocaleString('vi-VN')} đ\n` +
            `Dấu Đỏ Điện Tử Bảo Chứng: ${res.verificationHash}\n` +
            `Người duyệt: ${res.approvedBy}\n` +
            `Đơn vị: ${res.companyLegal}`);
      if (window.PG_Modules_W13._internalReRender) {
        window.PG_Modules_W13._internalReRender();
      }
    } catch (err) {
      // Hàm exportOrSendOrderToSupplier đã xử lý cảnh báo alert
    }
  }

  // 8. PUBLIC EXPORT
  return {
    version: '1.0.0',
    moduleName: 'W13_RedStampPOApproval',
    legalInfo: BRAND_LEGAL,
    statusEnum: APPROVAL_STATUS,

    // Core Business Logic
    loadPOList: loadPOList,
    savePOList: savePOList,
    createPurchaseOrder: createPurchaseOrder,
    submitForApproval: submitForApproval,
    adminApproveOrder: adminApproveOrder,
    adminRejectOrder: adminRejectOrder,
    canExportOrSendToSupplier: canExportOrSendToSupplier,
    exportOrSendOrderToSupplier: exportOrSendOrderToSupplier,

    // UI & Graphics
    generateRedStampSVG: generateRedStampSVG,
    initUI: initUI,
    openDetailModal: openDetailModal,
    openCreateModal: openCreateModal,
    triggerAdminApprove: triggerAdminApprove,
    triggerSubmitApproval: triggerSubmitApproval,
    triggerSendToSupplier: triggerSendToSupplier,
    _internalReRender: null
  };
});
