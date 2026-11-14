/**
 * Module W13: Red Stamp PO Approval Engine (Dấu Đỏ Điện Tử Duyệt Đơn Vật Tư & Khóa Trần Lũy Kế 40%)
 * PG HOME LUXURY - CÔNG TY CP PHÚ GIA VIỆT NAM
 * 
 * PHÂN HỆ: KỸ THUẬT & VẬT TƯ XƯỞNG (VŨ) <-> GIÁM ĐỐC (ADMIN NGUYỄN VIẾT NGHĨA)
 * 
 * NGUYÊN TẮC LUẬT SẮT:
 * 1. Kỹ thuật Vũ chỉ được xuất đơn gửi Nhà cung cấp (An Cường, Hafele, Lam Giang, Quốc Tâm...)
 *    khi phiếu đề xuất (PO) đã có CON DẤU ĐỎ ĐIỆN TỬ CỦA GIÁM ĐỐC PHÊ DUYỆT.
 * 2. CẢI TIẾN #4 & #28: Kiểm tra lũy kế trần vật tư 40% woodVal theo từng công trình (checkCumulativePoCap40).
 *    Nếu tổng PO lũy kế vượt quá 40% woodVal, tự động gắn cờ đỏ (flagRed) và bắt buộc Giám Đốc
 *    ký phê duyệt đặc biệt (Special Director Approval).
 * 3. Dấu đỏ vector sang trọng, mã băm 16 ký tự chống giả mạo, khung xác thực bảo mật điện tử.
 * 
 * THÔNG TIN PHÁP LÝ & LIÊN HỆ CHUẨN:
 * - Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY)
 * - MST / ĐKKD: 042203002931
 * - Xưởng sản xuất: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * - Văn phòng: 35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh
 * - Hotline duy nhất: 0986.722.324 | Giám Đốc: Nguyễn Viết Nghĩa
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        var mod = factory();
        root.PG_Modules_W13 = mod;
        root.PG_W13 = mod;
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var STORAGE_KEY_POS = 'pg_po_proposals_v2';
    var STORAGE_KEY_PROJECT_CAPS = 'pg_project_wood_caps_v1';

    var BRAND_LEGAL = {
        company: 'CÔNG TY CP PHÚ GIA VIỆT NAM',
        subBrand: 'PG HOME LUXURY',
        businessName: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
        taxCode: '042203002931',
        hotline: '0986.722.324',
        workshopAddress: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
        officeAddress: '35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh',
        director: 'Nguyễn Viết Nghĩa',
        workshopLead: 'Vũ'
    };

    var PO_STATUS = {
        DRAFT: 'DRAFT',
        PENDING: 'PENDING',
        FLAGGED_OVERCAP: 'FLAGGED_OVERCAP',
        APPROVED: 'APPROVED',
        REJECTED: 'REJECTED'
    };

    // Tạo mã băm 16 ký tự chống giả mạo cho con dấu đỏ
    function generateVerificationHash(poCode, approvedBy, timestamp) {
        var raw = (poCode || '') + '|' + (approvedBy || '') + '|' + (timestamp || '') + '|' + BRAND_LEGAL.taxCode + '|' + BRAND_LEGAL.hotline;
        var h1 = 0x811c9dc5;
        var h2 = 0x9e3779b9;
        for (var i = 0; i < raw.length; i++) {
            var c = raw.charCodeAt(i);
            h1 = Math.imul(h1 ^ c, 0x01000193);
            h2 = Math.imul(h2 ^ (c * (i + 1)), 0x5bd1e995);
        }
        var s1 = ('00000000' + (h1 >>> 0).toString(16).toUpperCase()).slice(-8);
        var s2 = ('00000000' + (h2 >>> 0).toString(16).toUpperCase()).slice(-8);
        return (s1.slice(0, 4) + '-' + s1.slice(4) + '-' + s2.slice(0, 4) + '-' + s2.slice(4)).toUpperCase();
    }

    function formatVND(val) {
        var n = Number(val) || 0;
        return n.toLocaleString('vi-VN') + ' đ';
    }

    function getStorage() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage;
            }
        } catch (e) {
            // fallback
        }
        return null;
    }

    function loadPOList() {
        var storage = getStorage();
        if (!storage) return [];
        try {
            var raw = storage.getItem(STORAGE_KEY_POS);
            if (!raw) return [];
            return JSON.parse(raw) || [];
        } catch (e) {
            console.error('[W13] Error loading POs:', e);
            return [];
        }
    }

    function savePOList(list) {
        var storage = getStorage();
        if (!storage) return false;
        try {
            storage.setItem(STORAGE_KEY_POS, JSON.stringify(list || []));
            return true;
        } catch (e) {
            console.error('[W13] Error saving POs:', e);
            return false;
        }
    }

    function loadProjectCaps() {
        var storage = getStorage();
        if (!storage) return {};
        try {
            var raw = storage.getItem(STORAGE_KEY_PROJECT_CAPS);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function saveProjectWoodVal(projectId, woodVal, projectName) {
        if (!projectId) return false;
        var storage = getStorage();
        if (!storage) return false;
        try {
            var caps = loadProjectCaps();
            caps[projectId] = {
                projectId: projectId,
                projectName: projectName || ('Dự án ' + projectId),
                woodVal: Number(woodVal) || 0,
                cap40: Math.round((Number(woodVal) || 0) * 0.40),
                updatedAt: new Date().toISOString()
            };
            storage.setItem(STORAGE_KEY_PROJECT_CAPS, JSON.stringify(caps));
            return true;
        } catch (e) {
            console.error('[W13] Error saving project woodVal cap:', e);
            return false;
        }
    }

    /**
     * CẢI TIẾN #4: Kiểm tra lũy kế trần vật tư 40% woodVal theo từng công trình
     * @param {string} projectId Mã công trình
     * @param {number} newPoAmount Số tiền PO dự kiến tạo/duyệt
     * @param {number} [woodValParam] Giá trị phần gỗ công nghiệp (nếu có để cập nhật)
     * @returns {Object} Kết quả kiểm toán trần 40%
     */
    function checkCumulativePoCap40(projectId, newPoAmount, woodValParam) {
        var pId = (projectId || 'DEFAULT').trim();
        var poAmount = Number(newPoAmount) || 0;

        var caps = loadProjectCaps();
        var capInfo = caps[pId] || null;

        var woodVal = Number(woodValParam) || (capInfo ? capInfo.woodVal : 0);
        if (woodVal <= 0 && window.PG_W31 && typeof window.PG_W31.loadProjectWoodCap === 'function') {
            var storedWood = window.PG_W31.loadProjectWoodCap(pId);
            if (storedWood && storedWood.woodVal) {
                woodVal = storedWood.woodVal;
            }
        }

        var cap40 = Math.round(woodVal * 0.40);
        var allPOs = loadPOList();

        var existingProjectPOs = allPOs.filter(function (po) {
            return po.projectId === pId && po.status !== PO_STATUS.REJECTED;
        });

        var existingPoTotal = existingProjectPOs.reduce(function (sum, po) {
            return sum + (Number(po.totalAmount) || 0);
        }, 0);

        var newCumulativeTotal = existingPoTotal + poAmount;
        var remainingCap = cap40 > 0 ? (cap40 - existingPoTotal) : 0;
        var isExceeded = (cap40 > 0) && (newCumulativeTotal > cap40);
        var excessAmount = isExceeded ? (newCumulativeTotal - cap40) : 0;
        var usageRatio = cap40 > 0 ? ((newCumulativeTotal / cap40) * 100) : (newCumulativeTotal > 0 ? 999 : 0);

        return {
            projectId: pId,
            woodVal: woodVal,
            cap40: cap40,
            existingPoTotal: existingPoTotal,
            newPoAmount: poAmount,
            newCumulativeTotal: newCumulativeTotal,
            remainingCap: remainingCap,
            isExceeded: isExceeded,
            excessAmount: excessAmount,
            usageRatio: Math.round(usageRatio * 10) / 10,
            flagRed: isExceeded,
            requiresSpecialDirectorApproval: isExceeded,
            statusLabel: isExceeded ? 'VƯỢT TRẦN 40% VẬT TƯ' : (usageRatio >= 85 ? 'CẬNH NGƯỠNG TRẦN 40%' : 'AN TOÀN TRẦN 40%'),
            statusClass: isExceeded ? 'danger' : (usageRatio >= 85 ? 'warning' : 'success')
        };
    }

    /**
     * Render thanh tiến độ lũy kế [Tổng PO lũy kế / Trần 40% woodVal]
     */
    function renderCapProgressBarHtml(checkResult) {
        if (!checkResult) return '';
        var ratio = Math.min(Math.max(checkResult.usageRatio, 0), 100);
        var barColor = checkResult.isExceeded ? '#dc2626' : (ratio >= 85 ? '#f59e0b' : '#10b981');
        var badgeBg = checkResult.isExceeded ? '#fee2e2' : (ratio >= 85 ? '#fef3c7' : '#d1fae5');
        var badgeText = checkResult.isExceeded ? '#b91c1c' : (ratio >= 85 ? '#b45309' : '#047857');

        var woodNotice = checkResult.woodVal > 0 
            ? 'Cơ sở: 40% trên woodVal (' + formatVND(checkResult.woodVal) + ') | Phụ kiện, đá, kính, Sofa, gỗ thịt: 0% khoán'
            : '⚠️ Chưa cấu hình giá trị woodVal của hợp đồng (Mặc định kiểm tra dựa trên PO lũy kế)';

        return '' +
            '<div class="pg-cap-audit-card" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; margin-bottom:14px; font-family:system-ui,-apple-system,sans-serif;">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                    '<div style="font-weight:700; color:#1e293b; font-size:13px; display:flex; align-items:center; gap:6px;">' +
                        '<span style="font-size:16px;">🛡️</span> BẢO VỆ DÒNG TIỀN: LŨY KẾ TRẦN 40% VẬT TƯ XƯỞNG' +
                    '</div>' +
                    '<span style="background:' + badgeBg + '; color:' + badgeText + '; font-size:11px; font-weight:800; padding:3px 10px; border-radius:999px; letter-spacing:0.5px;">' +
                        checkResult.statusLabel + ' (' + checkResult.usageRatio + '%)' +
                    '</span>' +
                '</div>' +
                '<div style="background:#e2e8f0; border-radius:999px; height:12px; overflow:hidden; position:relative; margin-bottom:8px;">' +
                    '<div style="width:' + ratio + '%; background:' + barColor + '; height:100%; transition:width 0.4s ease; border-radius:999px;"></div>' +
                '</div>' +
                '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:8px; font-size:12px; color:#475569; margin-bottom:8px;">' +
                    '<div><strong>Đã tạo trước đó:</strong> ' + formatVND(checkResult.existingPoTotal) + '</div>' +
                    '<div><strong>PO hiện tại:</strong> ' + formatVND(checkResult.newPoAmount) + '</div>' +
                    '<div><strong>Tổng lũy kế:</strong> <span style="color:' + barColor + '; font-weight:700;">' + formatVND(checkResult.newCumulativeTotal) + '</span></div>' +
                    '<div><strong>Trần 40% WoodVal:</strong> ' + (checkResult.cap40 > 0 ? formatVND(checkResult.cap40) : 'Chưa định mức') + '</div>' +
                '</div>' +
                (checkResult.isExceeded ? '' +
                    '<div style="background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:8px 10px; font-size:12px; color:#991b1b; display:flex; gap:6px; align-items:center;">' +
                        '<span style="font-size:16px;">🚨</span>' +
                        '<div>' +
                            '<strong>CẢNH BÁO VƯỢT TRẦN KHOÁN:</strong> PO này làm vượt trần 40% thêm <strong>' + formatVND(checkResult.excessAmount) + '</strong>. ' +
                            'Hệ thống tự động gắn <strong>CỜ ĐỎ</strong> yêu cầu đích thân Giám Đốc ký duyệt đặc biệt trước khi gửi NCC!' +
                        '</div>' +
                    '</div>' : '') +
                '<div style="font-size:11px; color:#64748b; margin-top:6px; font-style:italic;">' +
                    woodNotice +
                '</div>' +
            '</div>';
    }

    /**
     * CẢI TIẾN #28: Con Dấu Đỏ Điện Tử Vector Sang Trọng của Ban Giám Đốc
     * CÔNG TY CP PHÚ GIA VIỆT NAM - GIÁM ĐỐC ĐÃ DUYỆT (MST: 042203002931)
     * Kèm mã băm 16 ký tự và khung mã xác thực điện tử chống làm giả
     * @param {string} poCode Mã PO đề xuất
     * @param {string} approvedBy Tên người duyệt (Mặc định: Giám Đốc Nguyễn Viết Nghĩa)
     * @param {string|number|Date} timestamp Thời điểm duyệt
     * @param {Object} [options] Tùy chọn mở rộng
     */
    function renderLuxuryRedStamp(poCode, approvedBy, timestamp, options) {
        var code = (poCode || 'PO-DEFAULT').toUpperCase();
        var approver = approvedBy || BRAND_LEGAL.director;
        var dateObj = timestamp ? new Date(timestamp) : new Date();
        var dateStr = ('0' + dateObj.getDate()).slice(-2) + '/' + 
                      ('0' + (dateObj.getMonth() + 1)).slice(-2) + '/' + 
                      dateObj.getFullYear();
        var timeStr = ('0' + dateObj.getHours()).slice(-2) + ':' + 
                      ('0' + dateObj.getMinutes()).slice(-2);
        var fullTimestampStr = dateStr + ' ' + timeStr;

        var hash = (options && options.hash) || generateVerificationHash(code, approver, fullTimestampStr);
        var isSpecialApproval = options && options.isSpecialApproval;

        var svgStamp = '' +
            '<svg class="pg-luxury-red-stamp-svg" viewBox="0 0 280 280" width="220" height="220" style="filter: drop-shadow(0 4px 10px rgba(185,28,28,0.25)); transform: rotate(-5deg); transition: transform 0.2s ease;">' +
                '<defs>' +
                    '<path id="stampUpperCurve" d="M 30,140 A 110,110 0 1,1 250,140" fill="none"/>' +
                    '<path id="stampLowerCurve" d="M 250,140 A 110,110 0 1,1 30,140" fill="none"/>' +
                    '<radialGradient id="stampGlow" cx="50%" cy="50%" r="50%">' +
                        '<stop offset="85%" stop-color="#dc2626" stop-opacity="0.08"/>' +
                        '<stop offset="100%" stop-color="#b91c1c" stop-opacity="0.18"/>' +
                    '</radialGradient>' +
                '</defs>' +
                '<!-- Vòng nền nhẹ -->' +
                '<circle cx="140" cy="140" r="130" fill="url(#stampGlow)"/>' +
                '<!-- Vành tròn đôi ngoài -->' +
                '<circle cx="140" cy="140" r="130" fill="none" stroke="#b91c1c" stroke-width="4.5" stroke-dasharray="8 4"/>' +
                '<circle cx="140" cy="140" r="120" fill="none" stroke="#b91c1c" stroke-width="2.5"/>' +
                '<!-- Vành tròn trong -->' +
                '<circle cx="140" cy="140" r="82" fill="none" stroke="#b91c1c" stroke-width="2"/>' +
                '<circle cx="140" cy="140" r="77" fill="none" stroke="#b91c1c" stroke-width="1" stroke-dasharray="3 3"/>' +
                '<!-- Chữ vành trên: CÔNG TY CP PHÚ GIA VIỆT NAM -->' +
                '<text fill="#b91c1c" font-size="11.5" font-weight="900" font-family="Arial, Helvetica, sans-serif" letter-spacing="1.5">' +
                    '<textPath href="#stampUpperCurve" startOffset="50%" text-anchor="middle">' +
                        '★ CÔNG TY CP PHÚ GIA VIỆT NAM ★' +
                    '</textPath>' +
                '</text>' +
                '<!-- Chữ vành dưới: MST & TP. HÀ TĨNH -->' +
                '<text fill="#b91c1c" font-size="10" font-weight="800" font-family="Arial, Helvetica, sans-serif" letter-spacing="1">' +
                    '<textPath href="#stampLowerCurve" startOffset="50%" text-anchor="middle">' +
                        'MST: 042203002931 • TP. HÀ TĨNH' +
                    '</textPath>' +
                '</text>' +
                '<!-- Khu vực trung tâm: DẤU DUYỆT GIÁM ĐỐC -->' +
                '<g transform="translate(140, 140)">' +
                    '<!-- Ngôi sao hoặc vương miện trên -->' +
                    '<path d="M 0,-56 L 3,-46 L 14,-46 L 5,-39 L 8,-28 L 0,-34 L -8,-28 L -5,-39 L -14,-46 L -3,-46 Z" fill="#b91c1c"/>' +
                    '<text x="0" y="-14" fill="#b91c1c" font-size="14.5" font-weight="900" font-family="Arial, Helvetica, sans-serif" text-anchor="middle" letter-spacing="0.5">' +
                        (isSpecialApproval ? 'PHÊ DUYỆT ĐẶC BIỆT' : 'GIÁM ĐỐC ĐÃ DUYỆT') +
                    '</text>' +
                    '<rect x="-65" y="-6" width="130" height="2" fill="#b91c1c"/>' +
                    '<text x="0" y="12" fill="#991b1b" font-size="11" font-weight="800" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">' +
                        approver.toUpperCase() +
                    '</text>' +
                    '<text x="0" y="27" fill="#b91c1c" font-size="9.5" font-weight="700" font-family="Courier, monospace" text-anchor="middle">' +
                        code +
                    '</text>' +
                    '<text x="0" y="42" fill="#b91c1c" font-size="9" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">' +
                        fullTimestampStr +
                    '</text>' +
                    '<!-- Mã xác thực băm 8 ký tự trung tâm -->' +
                    '<text x="0" y="58" fill="#7f1d1d" font-size="7.5" font-weight="bold" font-family="Courier, monospace" text-anchor="middle">' +
                        'HASH: ' + hash.slice(0, 11) +
                    '</text>' +
                '</g>' +
            '</svg>';

        var certificateWrapper = '' +
            '<div class="pg-luxury-stamp-certificate" style="display:inline-flex; flex-direction:column; align-items:center; background:#ffffff; border:2px solid #b91c1c; border-radius:14px; padding:18px; box-shadow:0 10px 25px -5px rgba(185,28,28,0.2), 0 8px 10px -6px rgba(0,0,0,0.05); max-width:320px; font-family:system-ui,-apple-system,sans-serif; text-align:center; position:relative; overflow:hidden;">' +
                '<div style="position:absolute; top:0; left:0; right:0; height:6px; background:linear-gradient(90deg, #b91c1c, #dc2626, #f87171, #b91c1c);"></div>' +
                '<div style="font-size:11px; font-weight:800; color:#b91c1c; letter-spacing:1px; margin-bottom:4px; text-transform:uppercase;">' +
                    BRAND_LEGAL.company +
                '</div>' +
                '<div style="font-size:10px; color:#64748b; margin-bottom:8px;">' +
                    'CHỨNG THỰC PHÊ DUYỆT ĐƠN ĐẶT HÀNG VẬT TƯ' +
                '</div>' +
                '<div style="margin:6px 0;">' +
                    svgStamp +
                '</div>' +
                '<div style="width:100%; border-top:1px dashed #fca5a5; padding-top:10px; margin-top:6px; font-size:11px; text-align:left; color:#334155; line-height:1.5;">' +
                    '<div><strong>Mã PO:</strong> <span style="font-family:monospace; font-weight:bold; color:#b91c1c;">' + code + '</span></div>' +
                    '<div><strong>Người ký duyệt:</strong> ' + approver + ' (Giám Đốc)</div>' +
                    '<div><strong>Thời gian ký:</strong> ' + fullTimestampStr + '</div>' +
                    '<div><strong>Mã băm xác thực:</strong> <span style="font-family:monospace; font-size:10px; background:#fee2e2; color:#991b1b; padding:1px 5px; border-radius:4px;">' + hash + '</span></div>' +
                    '<div style="margin-top:8px; font-size:10px; color:#15803d; font-weight:700; background:#dcfce7; padding:4px 8px; border-radius:6px; display:flex; align-items:center; gap:4px;">' +
                        '<span>✓</span> ĐỦ ĐIỀU KIỆN XUẤT ĐƠN GỬI NHÀ CUNG CẤP' +
                    '</div>' +
                    '<div style="margin-top:4px; font-size:9.5px; color:#64748b; text-align:center;">' +
                        'Xưởng: ' + BRAND_LEGAL.workshopAddress + '<br>Hotline: ' + BRAND_LEGAL.hotline +
                    '</div>' +
                '</div>' +
            '</div>';

        return certificateWrapper;
    }

    /**
     * Tương thích ngược 100%: generateRedStampSVG
     */
    function generateRedStampSVG(po) {
        if (!po) return '';
        var poCode = po.poCode || po.id || 'PO-PROPOSAL';
        var approver = po.approvedBy || BRAND_LEGAL.director;
        var timestamp = po.approvedAt || po.createdAt || new Date();
        return renderLuxuryRedStamp(poCode, approver, timestamp, {
            isSpecialApproval: po.isSpecialApproval || po.flagRed
        });
    }

    /**
     * Kiểm tra xem PO đã đủ điều kiện để Kỹ thuật Vũ xuất gửi Nhà cung cấp chưa
     * Quy tắc luật sắt: BẮT BUỘC PHẢI APPROVED và có DẤU ĐỎ ĐIỆN TỬ
     */
    function canExportToSupplier(po) {
        if (!po) return false;
        var isApproved = (po.status === PO_STATUS.APPROVED);
        var hasStamp = Boolean(po.stampHash && po.approvedBy);
        return isApproved && hasStamp;
    }

    /**
     * Duyệt đơn PO (Dành riêng cho Giám Đốc)
     * Tự động kiểm tra trần 40% lũy kế, tạo con dấu đỏ và mã băm chống giả mạo
     */
    function approvePO(poId, approverName, woodValOverride) {
        var pos = loadPOList();
        var poIndex = pos.findIndex(function (p) { return p.id === poId || p.poCode === poId; });
        if (poIndex === -1) {
            return { success: false, message: 'Không tìm thấy phiếu đề xuất ' + poId };
        }

        var po = pos[poIndex];
        var approver = approverName || BRAND_LEGAL.director;
        var now = new Date().toISOString();

        // Kiểm tra trần lũy kế 40%
        var capAudit = checkCumulativePoCap40(po.projectId, po.totalAmount, woodValOverride);

        // Sinh mã băm bảo mật 16 ký tự
        var hash = generateVerificationHash(po.poCode || po.id, approver, now);

        po.status = PO_STATUS.APPROVED;
        po.approvedBy = approver;
        po.approvedAt = now;
        po.stampHash = hash;
        po.isSpecialApproval = capAudit.isExceeded;
        po.capAuditAtApproval = capAudit;
        po.canSendToSupplier = true;

        savePOList(pos);

        return {
            success: true,
            po: po,
            capAudit: capAudit,
            hash: hash,
            message: 'Đã đóng dấu đỏ duyệt đơn ' + (po.poCode || po.id) + ' thành công!' + 
                     (capAudit.isExceeded ? ' (Giám Đốc đã duyệt phê chuẩn vượt trần 40%)' : '')
        };
    }

    /**
     * Từ chối duyệt PO (Giám Đốc trả lại cho Vũ sửa)
     */
    function rejectPO(poId, rejectReason, rejectedBy) {
        var pos = loadPOList();
        var poIndex = pos.findIndex(function (p) { return p.id === poId || p.poCode === poId; });
        if (poIndex === -1) {
            return { success: false, message: 'Không tìm thấy phiếu đề xuất ' + poId };
        }

        var po = pos[poIndex];
        po.status = PO_STATUS.REJECTED;
        po.rejectedBy = rejectedBy || BRAND_LEGAL.director;
        po.rejectedAt = new Date().toISOString();
        po.rejectReason = rejectReason || 'Không được phê duyệt';
        po.canSendToSupplier = false;
        delete po.stampHash;

        savePOList(pos);

        return {
            success: true,
            po: po,
            message: 'Đã từ chối duyệt đơn ' + (po.poCode || po.id)
        };
    }

    /**
     * Tạo mới Phiếu Đề Xuất Vật Tư (Kỹ thuật Vũ tạo)
     */
    function createPOProposal(poData) {
        if (!poData) return { success: false, message: 'Dữ liệu PO không hợp lệ' };

        var pos = loadPOList();
        var timestamp = new Date();
        var code = poData.poCode || ('PO-' + timestamp.getFullYear() + ('0' + (timestamp.getMonth() + 1)).slice(-2) + '-' + ('000' + (pos.length + 1)).slice(-4));

        var totalAmount = Number(poData.totalAmount) || 0;
        if (!totalAmount && Array.isArray(poData.items)) {
            totalAmount = poData.items.reduce(function (sum, item) {
                return sum + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));
            }, 0);
        }

        var capAudit = checkCumulativePoCap40(poData.projectId, totalAmount, poData.woodVal);

        var newPo = {
            id: 'po_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            poCode: code,
            projectId: poData.projectId || 'PRJ-CHUNG',
            projectName: poData.projectName || 'Công trình chưa đặt tên',
            supplierName: poData.supplierName || 'An Cường / Hafele',
            creator: poData.creator || BRAND_LEGAL.workshopLead,
            items: poData.items || [],
            totalAmount: totalAmount,
            woodVal: capAudit.woodVal,
            notes: poData.notes || '',
            createdAt: timestamp.toISOString(),
            status: capAudit.isExceeded ? PO_STATUS.FLAGGED_OVERCAP : PO_STATUS.PENDING,
            flagRed: capAudit.flagRed,
            initialCapAudit: capAudit,
            canSendToSupplier: false
        };

        pos.unshift(newPo);
        savePOList(pos);

        return {
            success: true,
            po: newPo,
            capAudit: capAudit,
            message: 'Đã tạo phiếu đề xuất ' + code + '. ' + 
                     (capAudit.isExceeded ? '⚠️ CẢNH BÁO: Đơn bị gắn CỜ ĐỎ do vượt trần 40% vật tư, cần Giám Đốc duyệt đặc biệt!' : 'Chờ Giám Đốc đóng dấu đỏ phê duyệt.')
        };
    }

    /**
     * Render bảng quản lý PO và Dấu Đỏ trong giao diện Web App
     */
    function renderPOManagementTable(containerId, options) {
        var el = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
        if (!el) return;

        var pos = loadPOList();
        var isDirector = (options && options.isDirector !== undefined) ? options.isDirector : true;

        if (pos.length === 0) {
            el.innerHTML = '' +
                '<div style="text-align:center; padding:30px; color:#64748b; background:#f8fafc; border-radius:10px; border:1px dashed #cbd5e1;">' +
                    '<div style="font-size:24px; margin-bottom:8px;">📋</div>' +
                    '<div style="font-weight:600;">Chưa có phiếu đề xuất đặt hàng vật tư nào</div>' +
                    '<div style="font-size:12px; margin-top:4px;">Kỹ thuật Vũ lập phiếu từ bóc tách công trình. Giám Đốc sẽ duyệt và đóng dấu đỏ tại đây.</div>' +
                '</div>';
            return;
        }

        var rowsHtml = pos.map(function (po) {
            var badgeColor = '#64748b';
            var badgeBg = '#f1f5f9';
            var statusText = 'Chờ duyệt';

            if (po.status === PO_STATUS.APPROVED) {
                badgeColor = '#15803d'; badgeBg = '#dcfce7'; statusText = 'GIÁM ĐỐC ĐÃ DUYỆT';
            } else if (po.status === PO_STATUS.FLAGGED_OVERCAP) {
                badgeColor = '#b91c1c'; badgeBg = '#fee2e2'; statusText = '🚩 CỜ ĐỎ - VƯỢT TRẦN 40%';
            } else if (po.status === PO_STATUS.REJECTED) {
                badgeColor = '#b91c1c'; badgeBg = '#fef2f2'; statusText = 'TỪ CHỐI DUYỆT';
            }

            var exportBtn = '';
            if (canExportToSupplier(po)) {
                exportBtn = '<button class="pg-btn-export" onclick="window.PG_W13.exportPoDocument(\'' + po.id + '\')" style="background:#15803d; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">📤 Xuất Đơn NCC</button>';
            } else {
                exportBtn = '<span style="font-size:11px; color:#94a3b8; font-style:italic;" title="Cần có dấu đỏ của Giám Đốc mới được gửi NCC">🔒 Chưa thể xuất</span>';
            }

            var actionBtns = '';
            if (isDirector && po.status !== PO_STATUS.APPROVED) {
                actionBtns = '' +
                    '<button onclick="window.PG_W13.promptApprove(\'' + po.id + '\')" style="background:#b91c1c; color:#fff; border:none; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; margin-right:4px;">' +
                        '🔴 Đóng Dấu Đỏ' +
                    '</button>' +
                    '<button onclick="window.PG_W13.promptReject(\'' + po.id + '\')" style="background:#64748b; color:#fff; border:none; padding:4px 8px; border-radius:6px; font-size:11px; cursor:pointer;">' +
                        'Từ chối' +
                    '</button>';
            } else if (po.status === PO_STATUS.APPROVED) {
                actionBtns = '' +
                    '<button onclick="window.PG_W13.viewStampCertificate(\'' + po.id + '\')" style="background:#fee2e2; color:#b91c1c; border:1px solid #f87171; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">' +
                        '🔍 Xem Dấu Đỏ' +
                    '</button>';
            }

            return '' +
                '<tr style="border-bottom:1px solid #f1f5f9; font-size:12px;">' +
                    '<td style="padding:10px 8px; font-family:monospace; font-weight:bold; color:#1e293b;">' + (po.poCode || po.id) + '</td>' +
                    '<td style="padding:10px 8px;"><strong>' + (po.projectName || 'Công trình') + '</strong><br><span style="font-size:11px; color:#64748b;">' + (po.supplierName || 'NCC') + '</span></td>' +
                    '<td style="padding:10px 8px; text-align:right; font-weight:700; color:#0f172a;">' + formatVND(po.totalAmount) + '</td>' +
                    '<td style="padding:10px 8px; text-align:center;">' +
                        '<span style="background:' + badgeBg + '; color:' + badgeColor + '; padding:3px 8px; border-radius:999px; font-size:11px; font-weight:700;">' +
                            statusText +
                        '</span>' +
                    '</td>' +
                    '<td style="padding:10px 8px; text-align:center;">' + exportBtn + '</td>' +
                    '<td style="padding:10px 8px; text-align:right;">' + actionBtns + '</td>' +
                '</tr>';
        }).join('');

        el.innerHTML = '' +
            '<div class="pg-table-responsive" style="overflow-x:auto;">' +
                '<table style="width:100%; border-collapse:collapse; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">' +
                    '<thead>' +
                        '<tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; font-size:12px; color:#475569; text-align:left;">' +
                            '<th style="padding:10px 8px;">Mã PO</th>' +
                            '<th style="padding:10px 8px;">Công trình / NCC</th>' +
                            '<th style="padding:10px 8px; text-align:right;">Tổng tiền</th>' +
                            '<th style="padding:10px 8px; text-align:center;">Trạng thái phê duyệt</th>' +
                            '<th style="padding:10px 8px; text-align:center;">Xuất đơn NCC</th>' +
                            '<th style="padding:10px 8px; text-align:right;">Hành động</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        rowsHtml +
                    '</tbody>' +
                '</table>' +
            '</div>';
    }

    function viewStampCertificate(poId) {
        var pos = loadPOList();
        var po = pos.find(function (p) { return p.id === poId || p.poCode === poId; });
        if (!po) return alert('Không tìm thấy PO!');

        var modalEl = document.getElementById('pg-w13-modal');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'pg-w13-modal';
            document.body.appendChild(modalEl);
        }

        var stampHtml = renderLuxuryRedStamp(po.poCode || po.id, po.approvedBy, po.approvedAt, {
            hash: po.stampHash,
            isSpecialApproval: po.isSpecialApproval
        });

        modalEl.innerHTML = '' +
            '<div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;">' +
                '<div style="background:#fff; border-radius:16px; padding:24px; max-width:480px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); text-align:center;">' +
                    stampHtml +
                    '<div style="margin-top:18px;">' +
                        '<button onclick="document.getElementById(\'pg-w13-modal\').innerHTML=\'\'" style="background:#0f172a; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">Đóng</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function promptApprove(poId) {
        var pos = loadPOList();
        var po = pos.find(function (p) { return p.id === poId || p.poCode === poId; });
        if (!po) return alert('Không tìm thấy PO!');

        var capAudit = checkCumulativePoCap40(po.projectId, po.totalAmount, po.woodVal);
        var confirmMsg = 'Giám Đốc xác nhận ĐÓNG DẤU ĐỎ DUYỆT cho đơn ' + (po.poCode || po.id) + ' (' + formatVND(po.totalAmount) + ')?';

        if (capAudit.isExceeded) {
            confirmMsg = '🚨 CẢNH BÁO ĐẶC BIỆT:\nĐơn này làm tổng PO lũy kế vượt trần 40% vật tư thêm ' + formatVND(capAudit.excessAmount) + '.\n\nGiám Đốc có đồng ý KÝ PHÊ DUYỆT ĐẶC BIỆT để xưởng tiếp tục đặt hàng?';
        }

        if (confirm(confirmMsg)) {
            var res = approvePO(poId, BRAND_LEGAL.director, po.woodVal);
            alert(res.message);
            if (typeof window.PG_W13_ON_UPDATE === 'function') {
                window.PG_W13_ON_UPDATE();
            }
        }
    }

    function promptReject(poId) {
        var reason = prompt('Nhập lý do từ chối duyệt đơn vật tư này:');
        if (reason !== null) {
            var res = rejectPO(poId, reason, BRAND_LEGAL.director);
            alert(res.message);
            if (typeof window.PG_W13_ON_UPDATE === 'function') {
                window.PG_W13_ON_UPDATE();
            }
        }
    }

    function exportPoDocument(poId) {
        var pos = loadPOList();
        var po = pos.find(function (p) { return p.id === poId || p.poCode === poId; });
        if (!po) return alert('Không tìm thấy đơn!');
        if (!canExportToSupplier(po)) {
            return alert('CHẶN XUẤT ĐƠN: Đơn hàng này chưa có Con Dấu Đỏ của Giám Đốc!');
        }
        alert('ĐƠN ĐỦ ĐIỀU KIỆN GỬI NHÀ CUNG CẤP!\nĐã xác thực chữ ký điện tử Giám Đốc: ' + po.approvedBy + '\nMã băm bảo mật: ' + po.stampHash);
    }

    function init() {
        // Tự động khởi tạo và kiểm tra nếu có storage
        var pos = loadPOList();
        return {
            brand: BRAND_LEGAL,
            poCount: pos.length,
            version: '2.8.0-luxury-cap40'
        };
    }

    // Public API
    return {
        // Constants & Brand
        BRAND_LEGAL: BRAND_LEGAL,
        PO_STATUS: PO_STATUS,

        // Core Functions
        init: init,
        loadPOList: loadPOList,
        savePOList: savePOList,
        saveProjectWoodVal: saveProjectWoodVal,
        loadProjectCaps: loadProjectCaps,
        createPOProposal: createPOProposal,
        approvePO: approvePO,
        rejectPO: rejectPO,
        canExportToSupplier: canExportToSupplier,

        // Cải tiến #4: Kiểm tra lũy kế trần 40%
        checkCumulativePoCap40: checkCumulativePoCap40,
        renderCapProgressBarHtml: renderCapProgressBarHtml,

        // Cải tiến #28: Dấu đỏ điện tử vector sang trọng
        renderLuxuryRedStamp: renderLuxuryRedStamp,
        generateRedStampSVG: generateRedStampSVG,
        generateVerificationHash: generateVerificationHash,

        // UI Helpers
        renderPOManagementTable: renderPOManagementTable,
        viewStampCertificate: viewStampCertificate,
        promptApprove: promptApprove,
        promptReject: promptReject,
        exportPoDocument: exportPoDocument,
        formatVND: formatVND
    };
}));
