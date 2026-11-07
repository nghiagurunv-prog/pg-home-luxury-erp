/**
 * =========================================================================================
 * HỆ THỐNG QUẢN TRỊ & TỰ ĐỘNG HÓA PHÚ GIA - PG HOME LUXURY
 * MODULE W39: ĐỒNG HỒ ĐẾM NGƯỢC SLA "CHỐT NỢ TỨC THỜI <= 60 PHÚT" CHO HÓA ĐƠN VẬT TƯ ZALO
 * =========================================================================================
 * 
 * QUY CHUẨN ĐỐI SOÁT & KỶ LUẬT DÒNG TIỀN (GEMINI.md - MỤC 3 & SỔ TAY 02-03):
 * 1. Chốt nợ tức thời <= 60 phút: Mọi hóa đơn vật tư phát sinh từ Zalo bắt buộc phải được
 *    cập nhật và đối soát vào sổ công nợ trong tối đa 60 phút (3600 giây), không dồn cuối tháng.
 * 2. Cảnh báo cấp 1 (> 45 phút): Đổi sang màu vàng cam (#f59e0b) cảnh báo nhân sự kiểm toán khẩn cấp.
 * 3. Vi phạm SLA (> 60 phút): Đổi sang màu đỏ rực (#ef4444) nhấp nháy báo động vi phạm kỷ luật thép.
 * 4. Quy chuẩn đối soát 3 lớp chéo:
 *    Hợp lệ = [Ảnh hóa đơn thật] + [Xác nhận nhóm Zalo NCC] + [Ủy nhiệm chi ngân hàng khớp số tiền].
 *    Thiếu 1 trong 3 -> Treo ngay, cấm xuất tiền!
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PG_Modules_W39 = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Cấu hình hằng số SLA
    const SLA_CONFIG = {
        SLA_TOTAL_SECONDS: 60 * 60,      // 60 phút = 3600s
        WARNING_SECONDS: 45 * 60,        // 45 phút = 2700s (khi đã trôi qua 45p, tức còn <= 15p)
        STORAGE_KEY: 'PG_HOME_W39_SLA_INVOICES_V1',
        REFRESH_INTERVAL_MS: 1000,
        THEME: {
            SAFE: {
                color: '#10b981',         // Xanh lá (0 - 45 phút)
                bg: 'rgba(16, 185, 129, 0.12)',
                border: '#10b981',
                badgeText: 'AN TOÀN (< 45P)',
                status: 'SAFE'
            },
            WARNING: {
                color: '#f59e0b',      // Cam cảnh báo (> 45 phút đến 60 phút)
                bg: 'rgba(245, 158, 11, 0.15)',
                border: '#f59e0b',
                badgeText: 'CẢNH BÁO (> 45P CHƯA ĐỐI SOÁT)',
                status: 'WARNING'
            },
            BREACHED: {
                color: '#ef4444',     // Đỏ nguy cấp (> 60 phút vi phạm SLA)
                bg: 'rgba(239, 68, 68, 0.2)',
                border: '#ef4444',
                badgeText: 'VI PHẠM SLA (> 60P)',
                status: 'BREACHED'
            },
            VERIFIED: {
                color: '#3b82f6',     // Xanh dương (Đã đối soát đủ 3 lớp chéo)
                bg: 'rgba(59, 130, 246, 0.15)',
                border: '#3b82f6',
                badgeText: 'ĐÃ ĐỐI SOÁT 3 LỚP',
                status: 'VERIFIED'
            },
            BLOCKED: {
                color: '#8b5cf6',      // Tím treo thanh toán khi thiếu lớp kiểm tra
                bg: 'rgba(139, 92, 246, 0.15)',
                border: '#8b5cf6',
                badgeText: 'TREO (THIẾU 3 LỚP)',
                status: 'BLOCKED'
            }
        }
    };

    /**
     * Quản lý trạng thái lưu trữ nội bộ
     */
    let invoices = [];
    let timerInstance = null;
    let registeredListeners = {
        warning: [],
        breached: [],
        verified: [],
        tick: []
    };
    let activeContainer = null;

    /**
     * Tải dữ liệu từ LocalStorage
     */
    function loadStorage() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const raw = window.localStorage.getItem(SLA_CONFIG.STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        invoices = parsed;
                        return;
                    }
                }
            }
        } catch (e) {
            console.warn('[PG_W39] Lỗi khi đọc LocalStorage:', e);
        }

        // Mock dữ liệu mặc định chuẩn thực tế Phú Gia nếu kho trống
        if (!invoices || invoices.length === 0) {
            const now = Date.now();
            invoices = [
                {
                    id: 'INV-ZG-20261108-01',
                    code: 'HĐ-AN-CUONG-8821',
                    supplier: 'Gỗ An Cường Hà Tĩnh',
                    supplierGroup: 'Nhóm Zalo NCC An Cường',
                    amount: 48500000,
                    itemDescription: 'Ván MDF chống ẩm phủ Melamine 17mm (55 tấm) + Hậu 6mm',
                    createdAt: now - (50 * 60 * 1000), // Đã trôi qua 50 phút -> CẢNH BÁO (>45p)
                    verified: false,
                    proofs: {
                        hasBillImage: true,
                        hasZaloConfirm: true,
                        hasBankUnc: false // Thiếu UNC ngân hàng -> Chưa hoàn tất
                    },
                    zaloMessageId: 'zm_an_cuong_9921',
                    notes: 'Hóa đơn giao về công trình nhà anh Nam - 06/11'
                },
                {
                    id: 'INV-ZG-20261108-02',
                    code: 'HĐ-HAFELE-4120',
                    supplier: 'Hafele / Quốc Tâm (56 Ngô Đức Kế)',
                    supplierGroup: 'Nhóm Zalo Phụ Kiện Quốc Tâm',
                    amount: 14200000,
                    itemDescription: 'Ray trượt giảm chấn Hafele 450mm + Bản lề inox 304',
                    createdAt: now - (68 * 60 * 1000), // Đã trôi qua 68 phút -> VI PHẠM SLA (>60p)
                    verified: false,
                    proofs: {
                        hasBillImage: true,
                        hasZaloConfirm: false,
                        hasBankUnc: false
                    },
                    zaloMessageId: 'zm_hafele_7718',
                    notes: 'Đề xuất xưởng Vũ lập - cần Giám Đốc đối soát gấp'
                },
                {
                    id: 'INV-ZG-20261108-03',
                    code: 'HĐ-LAM-GIANG-1092',
                    supplier: 'Lam Giang Gỗ Nhựa WPB',
                    supplierGroup: 'Nhóm Zalo NCC Lam Giang',
                    amount: 9800000,
                    itemDescription: 'Tấm nhựa đặc WPB An Cường chịu nước tủ bếp',
                    createdAt: now - (15 * 60 * 1000), // Mới 15 phút -> AN TOÀN
                    verified: false,
                    proofs: {
                        hasBillImage: true,
                        hasZaloConfirm: true,
                        hasBankUnc: false
                    },
                    zaloMessageId: 'zm_lam_giang_3310',
                    notes: 'Cắt tủ bếp dưới R09 chịu nước'
                }
            ];
            saveStorage();
        }
    }

    /**
     * Lưu dữ liệu vào LocalStorage
     */
    function saveStorage() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(SLA_CONFIG.STORAGE_KEY, JSON.stringify(invoices));
            }
        } catch (e) {
            console.warn('[PG_W39] Lỗi khi lưu LocalStorage:', e);
        }
    }

    /**
     * Tính toán thời gian và trạng thái SLA cho 1 hóa đơn
     */
    function calculateSlaState(invoice, currentTime) {
        const now = currentTime || Date.now();
        const elapsedSeconds = Math.max(0, Math.floor((now - invoice.createdAt) / 1000));
        const remainingSeconds = Math.max(0, SLA_CONFIG.SLA_TOTAL_SECONDS - elapsedSeconds);
        const isOverdue = elapsedSeconds > SLA_CONFIG.SLA_TOTAL_SECONDS;
        const isWarning = elapsedSeconds >= SLA_CONFIG.WARNING_SECONDS && !isOverdue;

        let statusKey = 'SAFE';
        if (invoice.verified) {
            statusKey = 'VERIFIED';
        } else if (isOverdue) {
            statusKey = 'BREACHED';
        } else if (isWarning) {
            statusKey = 'WARNING';
        } else {
            statusKey = 'SAFE';
        }

        const theme = SLA_CONFIG.THEME[statusKey];

        // Format đếm ngược hoặc trễ
        let formattedCountdown = '';
        if (invoice.verified) {
            formattedCountdown = 'ĐÃ CHỐT XONG';
        } else if (isOverdue) {
            const overdueSeconds = elapsedSeconds - SLA_CONFIG.SLA_TOTAL_SECONDS;
            const m = Math.floor(overdueSeconds / 60);
            const s = overdueSeconds % 60;
            formattedCountdown = `+${m}p ${s < 10 ? '0' : ''}${s}s (QUÁ HẠN)`;
        } else {
            const m = Math.floor(remainingSeconds / 60);
            const s = remainingSeconds % 60;
            formattedCountdown = `${m}p ${s < 10 ? '0' : ''}${s}s`;
        }

        const elapsedMinutes = Math.floor(elapsedSeconds / 60);

        return {
            statusKey,
            theme,
            elapsedSeconds,
            elapsedMinutes,
            remainingSeconds,
            isWarning,
            isOverdue,
            formattedCountdown,
            percentageUsed: Math.min(100, Math.round((elapsedSeconds / SLA_CONFIG.SLA_TOTAL_SECONDS) * 100))
        };
    }

    /**
     * Định dạng tiền tệ VNĐ
     */
    function formatVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    }

    /**
     * Định dạng giờ phát sinh
     */
    function formatDateTime(timestamp) {
        const d = new Date(timestamp);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${hh}:${mm}:${ss} - ${day}/${month}`;
    }

    /**
     * Thêm hóa đơn vật tư mới bắt được từ Zalo Stealth Reader
     */
    function addInvoice(data) {
        if (!data || !data.amount) {
            throw new Error('[PG_W39] Dữ liệu hóa đơn không hợp lệ, thiếu số tiền!');
        }

        const newInv = {
            id: data.id || 'INV-ZG-' + Date.now(),
            code: data.code || ('HĐ-ZALO-' + Math.floor(1000 + Math.random() * 9000)),
            supplier: data.supplier || 'Nhà Cung Cấp Mới',
            supplierGroup: data.supplierGroup || 'Nhóm Zalo Vật Tư',
            amount: Number(data.amount) || 0,
            itemDescription: data.itemDescription || 'Vật tư công trình',
            createdAt: data.createdAt || Date.now(),
            verified: false,
            proofs: {
                hasBillImage: !!(data.proofs && data.proofs.hasBillImage),
                hasZaloConfirm: !!(data.proofs && data.proofs.hasZaloConfirm),
                hasBankUnc: !!(data.proofs && data.proofs.hasBankUnc)
            },
            zaloMessageId: data.zaloMessageId || '',
            notes: data.notes || 'Hóa đơn phát sinh tức thời từ Zalo PC'
        };

        // Chống trùng ID
        const existingIdx = invoices.findIndex(i => i.id === newInv.id || i.code === newInv.code);
        if (existingIdx >= 0) {
            invoices[existingIdx] = Object.assign(invoices[existingIdx], newInv);
        } else {
            invoices.unshift(newInv);
        }

        saveStorage();
        renderUI();
        return newInv;
    }

    /**
     * Cập nhật trạng thái đối soát 3 lớp chéo
     */
    function updateProofCheck(invoiceId, proofKey, value) {
        const inv = invoices.find(i => i.id === invoiceId);
        if (!inv) return null;

        if (!inv.proofs) {
            inv.proofs = { hasBillImage: false, hasZaloConfirm: false, hasBankUnc: false };
        }
        inv.proofs[proofKey] = !!value;

        // Tự động kiểm tra: Nếu đủ cả 3 lớp -> chuyển thành Verified
        const allChecked = inv.proofs.hasBillImage && inv.proofs.hasZaloConfirm && inv.proofs.hasBankUnc;
        if (allChecked) {
            inv.verified = true;
            inv.verifiedAt = Date.now();
            triggerEvent('verified', inv);
        } else {
            inv.verified = false;
        }

        saveStorage();
        renderUI();
        return inv;
    }

    /**
     * Phê duyệt nhanh đối soát đầy đủ 3 lớp
     */
    function forceVerifyAll(invoiceId) {
        const inv = invoices.find(i => i.id === invoiceId);
        if (!inv) return null;

        inv.proofs = {
            hasBillImage: true,
            hasZaloConfirm: true,
            hasBankUnc: true
        };
        inv.verified = true;
        inv.verifiedAt = Date.now();

        saveStorage();
        triggerEvent('verified', inv);
        renderUI();
        return inv;
    }

    /**
     * Bắn sự kiện ra ngoài cho hệ thống giám sát
     */
    function triggerEvent(name, payload) {
        if (registeredListeners[name] && Array.isArray(registeredListeners[name])) {
            registeredListeners[name].forEach(fn => {
                try {
                    fn(payload);
                } catch (err) {
                    console.error(`[PG_W39] Lỗi listener '${name}':`, err);
                }
            });
        }
    }

    /**
     * Khởi động vòng lặp đếm ngược 1 giây
     */
    function startTimerLoop() {
        if (timerInstance) clearInterval(timerInstance);

        timerInstance = setInterval(() => {
            const now = Date.now();
            let hasWarning = false;
            let hasBreached = false;

            invoices.forEach(inv => {
                if (!inv.verified) {
                    const sla = calculateSlaState(inv, now);
                    if (sla.isWarning && !inv._warningFired) {
                        inv._warningFired = true;
                        triggerEvent('warning', { invoice: inv, sla });
                    }
                    if (sla.isOverdue && !inv._breachedFired) {
                        inv._breachedFired = true;
                        triggerEvent('breached', { invoice: inv, sla });
                    }
                    if (sla.isWarning) hasWarning = true;
                    if (sla.isOverdue) hasBreached = true;
                }
            });

            triggerEvent('tick', { now, invoicesCount: invoices.length, hasWarning, hasBreached });

            // Tự động cập nhật giao diện nếu đang render trên DOM
            if (activeContainer) {
                renderUI();
            }
        }, SLA_CONFIG.REFRESH_INTERVAL_MS);
    }

    /**
     * Dừng vòng lặp
     */
    function stopTimerLoop() {
        if (timerInstance) {
            clearInterval(timerInstance);
            timerInstance = null;
        }
    }

    /**
     * Đăng ký Event Listener
     */
    function on(eventName, callback) {
        if (registeredListeners[eventName] && typeof callback === 'function') {
            registeredListeners[eventName].push(callback);
        }
    }

    /**
     * Xây dựng HTML/CSS giao diện SLA Timer HUD
     */
    function render(containerIdOrElement) {
        let el = null;
        if (typeof containerIdOrElement === 'string') {
            el = document.getElementById(containerIdOrElement);
        } else if (containerIdOrElement && containerIdOrElement.nodeType) {
            el = containerIdOrElement;
        }

        if (!el) {
            console.error('[PG_W39] Không tìm thấy phần tử DOM để render widget SLA!');
            return;
        }

        activeContainer = el;
        loadStorage();
        renderUI();
        startTimerLoop();
    }

    /**
     * Render trực tiếp ra DOM container
     */
    function renderUI() {
        if (!activeContainer) return;

        const now = Date.now();
        let pendingCount = 0;
        let warningCount = 0;
        let breachedCount = 0;
        let verifiedCount = 0;
        let totalDebtPending = 0;

        const processedList = invoices.map(inv => {
            const sla = calculateSlaState(inv, now);
            if (inv.verified) {
                verifiedCount++;
            } else {
                pendingCount++;
                totalDebtPending += (inv.amount || 0);
                if (sla.isOverdue) breachedCount++;
                else if (sla.isWarning) warningCount++;
            }
            return { invoice: inv, sla };
        });

        // HTML Header thống kê
        let html = `
        <div class="pg-w39-container" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 12px; padding: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
            <!-- HEADER & BADGES -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 16px;">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">⏱️</span>
                        <h2 style="margin: 0; font-size: 17px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">
                            SLA Chốt Nợ Tức Thời &le; 60 Phút
                        </h2>
                        <span style="font-size: 11px; background: #1e293b; color: #94a3b8; padding: 2px 8px; border-radius: 9999px; border: 1px solid #475569;">
                            Kỷ Luật Thép Zalo
                        </span>
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
                        Quy chuẩn đối soát 3 lớp chéo: [Ảnh HĐ] + [Zalo NCC] + [UNC Ngân Hàng]. Quá 45p đổi màu cảnh báo, quá 60p vi phạm.
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Tổng Tiền Treo Chờ Đối Soát</div>
                    <div style="font-size: 18px; font-weight: 800; color: #f59e0b;">${formatVND(totalDebtPending)}</div>
                </div>
            </div>

            <!-- KPI COUNTERS -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;">
                <div style="background: #1e293b; border-radius: 8px; padding: 10px; border-left: 4px solid #10b981;">
                    <div style="font-size: 11px; color: #94a3b8;">Chờ Đối Soát (< 45p)</div>
                    <div style="font-size: 18px; font-weight: 700; color: #10b981;">${pendingCount - warningCount - breachedCount}</div>
                </div>
                <div style="background: #1e293b; border-radius: 8px; padding: 10px; border-left: 4px solid #f59e0b; ${warningCount > 0 ? 'animation: pulseWarning 2s infinite;' : ''}">
                    <div style="font-size: 11px; color: #f59e0b; font-weight: 600;">Cảnh Báo (> 45p)</div>
                    <div style="font-size: 18px; font-weight: 700; color: #f59e0b;">${warningCount}</div>
                </div>
                <div style="background: #1e293b; border-radius: 8px; padding: 10px; border-left: 4px solid #ef4444; ${breachedCount > 0 ? 'animation: pulseAlert 1.5s infinite;' : ''}">
                    <div style="font-size: 11px; color: #ef4444; font-weight: 600;">Vi Phạm SLA (> 60p)</div>
                    <div style="font-size: 18px; font-weight: 700; color: #ef4444;">${breachedCount}</div>
                </div>
                <div style="background: #1e293b; border-radius: 8px; padding: 10px; border-left: 4px solid #3b82f6;">
                    <div style="font-size: 11px; color: #94a3b8;">Đã Chốt Hợp Lệ</div>
                    <div style="font-size: 18px; font-weight: 700; color: #3b82f6;">${verifiedCount}</div>
                </div>
            </div>

            <!-- INVOICE LIST -->
            <div style="display: flex; flex-direction: column; gap: 10px;">
        `;

        if (processedList.length === 0) {
            html += `
                <div style="text-align: center; padding: 30px; color: #64748b; font-size: 13px;">
                    Không có hóa đơn vật tư nào phát sinh trong danh sách theo dõi.
                </div>
            `;
        } else {
            processedList.forEach(item => {
                const inv = item.invoice;
                const sla = item.sla;
                const p = inv.proofs || { hasBillImage: false, hasZaloConfirm: false, hasBankUnc: false };

                // Card background and border based on SLA status
                let borderStyle = `border: 1px solid ${sla.theme.border};`;
                let bgStyle = `background: ${sla.theme.bg};`;
                let pulseClass = '';

                if (!inv.verified && sla.isOverdue) {
                    pulseClass = 'box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);';
                } else if (!inv.verified && sla.isWarning) {
                    pulseClass = 'box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);';
                }

                html += `
                <div class="pg-w39-item" style="border-radius: 8px; padding: 12px 16px; ${borderStyle} ${bgStyle} ${pulseClass} transition: all 0.2s ease;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <strong style="font-size: 14px; color: #f8fafc;">${inv.supplier}</strong>
                                <span style="font-size: 11px; background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #94a3b8; border: 1px solid #334155;">
                                    ${inv.code}
                                </span>
                                <span style="font-size: 11px; background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #38bdf8; border: 1px solid #0369a1;">
                                    💬 ${inv.supplierGroup}
                                </span>
                            </div>
                            <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
                                ${inv.itemDescription}
                            </div>
                        </div>

                        <!-- SLA BADGE & TIMER -->
                        <div style="text-align: right;">
                            <div style="display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: ${sla.theme.color}; color: #0f172a; letter-spacing: 0.3px;">
                                ${sla.theme.badgeText}
                            </div>
                            <div style="font-size: 15px; font-weight: 800; color: ${sla.theme.color}; margin-top: 3px; font-family: monospace;">
                                ${sla.formattedCountdown}
                            </div>
                        </div>
                    </div>

                    <!-- PROGRESS BAR -->
                    ${!inv.verified ? `
                    <div style="width: 100%; height: 5px; background: #334155; border-radius: 3px; overflow: hidden; margin-bottom: 10px;">
                        <div style="width: ${sla.percentageUsed}%; height: 100%; background: ${sla.theme.color}; transition: width 1s linear;"></div>
                    </div>
                    ` : ''}

                    <!-- 3-LAYER CROSS CHECK & ACTIONS -->
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; background: rgba(15, 23, 42, 0.6); padding: 8px 12px; border-radius: 6px;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <span style="color: #94a3b8; font-weight: 600;">ĐỐI SOÁT 3 LỚP:</span>
                            
                            <!-- Lớp 1: Ảnh HĐ -->
                            <label style="cursor: pointer; display: flex; align-items: center; gap: 4px; color: ${p.hasBillImage ? '#10b981' : '#ef4444'}; font-weight: ${p.hasBillImage ? '600' : '400'};">
                                <input type="checkbox" ${p.hasBillImage ? 'checked' : ''} onchange="window.PG_Modules_W39.updateProofCheck('${inv.id}', 'hasBillImage', this.checked)" style="cursor: pointer;" />
                                1. [Ảnh HĐ thật]
                            </label>

                            <!-- Lớp 2: Zalo NCC -->
                            <label style="cursor: pointer; display: flex; align-items: center; gap: 4px; color: ${p.hasZaloConfirm ? '#10b981' : '#ef4444'}; font-weight: ${p.hasZaloConfirm ? '600' : '400'};">
                                <input type="checkbox" ${p.hasZaloConfirm ? 'checked' : ''} onchange="window.PG_Modules_W39.updateProofCheck('${inv.id}', 'hasZaloConfirm', this.checked)" style="cursor: pointer;" />
                                2. [Zalo NCC]
                            </label>

                            <!-- Lớp 3: UNC Ngân hàng -->
                            <label style="cursor: pointer; display: flex; align-items: center; gap: 4px; color: ${p.hasBankUnc ? '#10b981' : '#ef4444'}; font-weight: ${p.hasBankUnc ? '600' : '400'};">
                                <input type="checkbox" ${p.hasBankUnc ? 'checked' : ''} onchange="window.PG_Modules_W39.updateProofCheck('${inv.id}', 'hasBankUnc', this.checked)" style="cursor: pointer;" />
                                3. [UNC Khớp Tiền]
                            </label>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-weight: 700; font-size: 13px; color: #f8fafc;">
                                ${formatVND(inv.amount)}
                            </span>
                            ${!inv.verified ? `
                            <button onclick="window.PG_Modules_W39.forceVerifyAll('${inv.id}')" style="background: #2563eb; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
                                ✓ Duyệt 3 Lớp Ngay
                            </button>
                            ` : `
                            <span style="color: #10b981; font-weight: 700;">✓ ĐÃ CHỐT SỔ NỢ</span>
                            `}
                        </div>
                    </div>

                    <div style="font-size: 10px; color: #64748b; margin-top: 6px; display: flex; justify-content: space-between;">
                        <span>Phát sinh: ${formatDateTime(inv.createdAt)}</span>
                        <span>${inv.notes}</span>
                    </div>
                </div>
                `;
            });
        }

        html += `
            </div>
            <!-- FOOTER INFO -->
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #1e293b; display: flex; justify-content: space-between; font-size: 11px; color: #64748b;">
                <span>Hộ Kinh Doanh Phú Gia - Hotline: 0973.562.789 - Ngõ 49 Trương Quốc Dụng, TP. Hà Tĩnh</span>
                <span>Module W39 SLA Engine - Chốt Nợ Tức Thời &le; 60 Phút Active</span>
            </div>
        </div>
        `;

        activeContainer.innerHTML = html;
    }

    /**
     * Lấy danh sách hóa đơn quá hạn hoặc cảnh báo
     */
    function getAlertInvoices() {
        const now = Date.now();
        return invoices
            .filter(i => !i.verified)
            .map(i => ({ invoice: i, sla: calculateSlaState(i, now) }))
            .filter(item => item.sla.isWarning || item.sla.isOverdue);
    }

    /**
     * Xuất dữ liệu đối soát ra báo cáo JSON
     */
    function exportAuditReport() {
        const now = Date.now();
        return {
            system: 'PHU_GIA_HOME_W39_SLA_REPORT',
            exportedAt: new Date(now).toISOString(),
            slaLimitMinutes: 60,
            warningThresholdMinutes: 45,
            legalEntity: {
                name: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
                taxCode: '042203002931',
                address: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
                hotline: '0973.562.789'
            },
            summary: {
                totalInvoices: invoices.length,
                pendingCount: invoices.filter(i => !i.verified).length,
                verifiedCount: invoices.filter(i => i.verified).length,
                warningCount: invoices.filter(i => !i.verified && calculateSlaState(i, now).isWarning).length,
                breachedCount: invoices.filter(i => !i.verified && calculateSlaState(i, now).isOverdue).length
            },
            invoices: invoices.map(i => {
                const sla = calculateSlaState(i, now);
                return {
                    id: i.id,
                    code: i.code,
                    supplier: i.supplier,
                    supplierGroup: i.supplierGroup,
                    amount: i.amount,
                    createdAt: new Date(i.createdAt).toISOString(),
                    elapsedMinutes: sla.elapsedMinutes,
                    slaStatus: sla.statusKey,
                    isVerified: i.verified,
                    proofsChecklist: i.proofs,
                    notes: i.notes
                };
            })
        };
    }

    // Public API
    return {
        // Cấu hình & Trạng thái
        config: SLA_CONFIG,
        
        // Khởi tạo & Vòng lặp
        init: function (containerIdOrElement) {
            loadStorage();
            if (containerIdOrElement) {
                render(containerIdOrElement);
            } else {
                startTimerLoop();
            }
            return this;
        },
        startTimer: startTimerLoop,
        stopTimer: stopTimerLoop,
        
        // Render giao diện
        render: render,
        renderUI: renderUI,

        // Thao tác dữ liệu hóa đơn
        addInvoice: addInvoice,
        updateProofCheck: updateProofCheck,
        forceVerifyAll: forceVerifyAll,
        getInvoices: function () { return invoices; },
        getPendingInvoices: function () { return invoices.filter(i => !i.verified); },
        getAlertInvoices: getAlertInvoices,
        
        // Tính toán trạng thái SLA
        calculateSlaState: calculateSlaState,
        
        // Sự kiện & Báo cáo
        on: on,
        exportAuditReport: exportAuditReport,
        formatVND: formatVND,
        formatDateTime: formatDateTime
    };
}));
