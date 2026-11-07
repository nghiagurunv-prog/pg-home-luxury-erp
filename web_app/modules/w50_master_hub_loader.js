/**
 * ============================================================================
 * PG HOME LUXURY - ENTERPRISE OPTIMIZATION ARCHITECTURE
 * HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG
 * Mã số HKD: 042203002931 | Hotline: 0986.722.324
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * ============================================================================
 * 
 * MODULE W50: MASTER OPTIMIZATION HUB LOADER
 * Quản trị, điều phối và khởi chạy an toàn 50 module tối ưu W01 - W50
 * Định danh: window.PG_Modules_W50 & window.PG_OptimizationHub
 */

(function (window) {
    'use strict';

    if (window.PG_OptimizationHub) {
        console.warn('[PG_W50] Master Optimization Hub đã được khởi tạo trước đó.');
        return;
    }

    // Danh bạ 50 Module tối ưu theo phân hệ chuẩn PG Home
    const MODULE_REGISTRY = {
        'W01': { name: 'CCSC Core Engine', group: 'FINANCE', desc: 'Động cơ tính toán CCSC 12 tháng & T8-T9' },
        'W02': { name: 'Thợ Nòng Cốt Retention Fund', group: 'FINANCE', desc: 'Quỹ thợ nòng cốt Hòa & Hào 20k/công' },
        'W03': { name: 'Col BG Workshop Profit Guard', group: 'FINANCE', desc: 'Kiểm soát lợi nhuận xưởng Col BG' },
        'W04': { name: 'Solid Wood & Outsource Separator', group: 'FINANCE', desc: 'Bóc tách gỗ thịt & phụ kiện trừ khỏi khoán' },
        'W05': { name: 'Revenue Bonus Over 500M Holdback', group: 'FINANCE', desc: 'Giữ thưởng doanh số > 500M đến tất niên' },
        'W06': { name: 'Daily Attendance Aggregator', group: 'HR', desc: 'Tổng hợp chấm công điểm danh thợ hàng ngày' },
        'W07': { name: 'Overtime & Nightshift Calculator', group: 'HR', desc: 'Tính toán giờ OT & làm đêm chuẩn xác' },
        'W08': { name: 'Advance Payment Tracker', group: 'HR', desc: 'Theo dõi tạm ứng lương thợ và quản lý' },
        'W09': { name: 'Role Permission Hard-Lock', group: 'SECURITY', desc: 'Phân quyền 4 phân hệ Admin/Vật tư/Sale/Dự toán' },
        'W10': { name: 'Electronic Red Stamp Validator', group: 'SECURITY', desc: 'Duyệt và đóng dấu đỏ điện tử phiếu vật tư' },
        'W11': { name: 'CNC Cutting Standard Engine', group: 'ESTIMATE', desc: 'Định mức tấm cắt CNC 1220x2440 thực chiến' },
        'W12': { name: 'Kitchen Base Cabinet Calc (R09)', group: 'ESTIMATE', desc: 'Định mức bếp dưới 1.45 tấm/md' },
        'W13': { name: 'Kitchen Upper Cabinet Calc (R08)', group: 'ESTIMATE', desc: 'Định mức bếp trên 1.04 tấm/md' },
        'W14': { name: 'High Kitchen Cabinet Calc (R10)', group: 'ESTIMATE', desc: 'Định mức bếp kịch trần 1.44 tấm/md' },
        'W15': { name: 'Full Wardrobe Calc (R27/R40/R49)', group: 'ESTIMATE', desc: 'Định mức tủ áo kịch trần 1.05 tấm ván 17mm/m2' },
        'W16': { name: 'Decorative Cabinet Calc (R05)', group: 'ESTIMATE', desc: 'Định mức tủ trang trí nông 0.50 tấm/m2' },
        'W17': { name: 'Wall Paneling Standard (R06/R23)', group: 'ESTIMATE', desc: 'Định mức vách ốp phẳng 0.40 tấm/m2' },
        'W18': { name: 'Curved Bed Engine (R33/R42)', group: 'ESTIMATE', desc: 'Định mức giường ngủ bo cong 3.3-3.5 tấm/cái' },
        'W19': { name: 'Suspended Furniture (R04/R24/R36)', group: 'ESTIMATE', desc: 'Định mức kệ tivi/bàn treo 0.55-0.65 tấm/md' },
        'W20': { name: 'Sale 54% Cost Cap Hard-Lock', group: 'ESTIMATE', desc: 'Chốt chặn cost <= 54% trước khi xuất báo giá' },
        'W21': { name: 'Three-Tier Material Pricing', group: 'ESTIMATE', desc: 'Định giá 3 cấp An Cường - Thái Lan - Plywood A1' },
        'W22': { name: 'Intersection Deduction Engine', group: 'ESTIMATE', desc: 'Khấu trừ giao cắt & trừ lỗ mở tủ áo/vách' },
        'W23': { name: 'Stealth Zalo Disk Monitor', group: 'STEALTH', desc: 'Đọc ngầm LevelDB & .rescache không chiếm chuột' },
        'W24': { name: 'Delta-Cursor Sync Tracker', group: 'STEALTH', desc: 'Lưu vết mtime/size/hash chống trùng ảnh hóa đơn' },
        'W25': { name: 'SHA-256 Invoice Deduplication', group: 'STEALTH', desc: 'Mã băm hóa đơn và ủy nhiệm chi 64 ký tự' },
        'W26': { name: '3-Layer Cross-Audit Reconciler', group: 'STEALTH', desc: 'Đối soát 3 lớp: Hóa đơn + Nhóm NCC + UNC' },
        'W27': { name: 'Real-Time Debt Cap <=60m', group: 'STEALTH', desc: 'Cập nhật công nợ nhà cung cấp tức thời <= 60p' },
        'W28': { name: 'MKT Safety Worker Policy', group: 'MKT', desc: 'Bảo vệ tài khoản MKT Post 8 nick & Care 28 nick' },
        'W29': { name: 'MKT Single-Thread Limiter', group: 'MKT', desc: 'Chạy đơn luồng threads_run=1, delay 25-30s' },
        'W30': { name: 'Zero-Disruption Window Guard', group: 'STEALTH', desc: 'Chặn SetForegroundWindow làm nháy màn hình Bố' },
        'W31': { name: 'Zero-Trust Audit Log Preserver', group: 'AUDIT', desc: 'Bảo toàn log lịch sử lỗi, cấm hardcode PASS' },
        'W32': { name: 'No Duplicate File Cleaner', group: 'AUDIT', desc: 'Ngăn chặn tạo file trùng lặp _v2, _copy, _fix' },
        'W33': { name: 'Clickable Live Link Resolver', group: 'UI', desc: 'Chuẩn hóa link file:/// 1 chạm mở thư mục cha' },
        'W34': { name: 'Pre-Response Hard-Lock Bridge', group: 'UI', desc: 'Cưỡng chế chạy code kiểm chứng số liệu' },
        'W35': { name: 'Sub-Agent Fleet Concurrency', group: 'ORCHESTRATION', desc: 'Điều phối song song 15-55 Worker + Giám sát viên' },
        'W36': { name: 'Supplier Ledger An Cuong', group: 'SUPPLIER', desc: 'Sổ cái công nợ & phiếu đặt vật tư An Cường' },
        'W37': { name: 'Supplier Ledger Hafele & PK', group: 'SUPPLIER', desc: 'Sổ cái phụ kiện Quốc Tâm & Hafele chính hãng' },
        'W38': { name: 'Supplier Ledger Stone & Glass', group: 'SUPPLIER', desc: 'Đối soát đá bàn bếp, kính ốp và khung nhôm' },
        'W39': { name: 'Customer Contract Pipeline', group: 'SALE', desc: 'Tiến độ thu tiền tạm ứng & thanh toán hợp đồng' },
        'W40': { name: 'Cash Flow Real-Time Safe', group: 'FINANCE', desc: 'Bảo vệ dòng tiền két sắt & thanh khoản lưu động' },
        'W41': { name: 'Fast UI DOM Virtualization', group: 'UI', desc: 'Render bảng dự toán hàng nghìn dòng mượt mà' },
        'W42': { name: 'Export Excel & PDF Watermark', group: 'UI', desc: 'Xuất file báo giá đóng dấu thương hiệu Phú Gia' },
        'W43': { name: 'Offline Storage Local Cache', group: 'STORAGE', desc: 'Đồng bộ IndexedDB & LocalStorage tự động' },
        'W44': { name: 'Network Connectivity Watchdog', group: 'NETWORK', desc: 'Tự động bắt kết nối và retry an toàn không giật' },
        'W45': { name: 'Memory Leak & Event Unbinder', group: 'PERFORMANCE', desc: 'Dọn dẹp event listener và giải phóng RAM Web App' },
        'W46': { name: 'Data Schema Migration Auto', group: 'STORAGE', desc: 'Tự nâng cấp cấu trúc dữ liệu dự án tương thích' },
        'W47': { name: 'Session Token & Auto-Lock', group: 'SECURITY', desc: 'Khóa màn hình tự động khi vắng mặt bảo vệ số liệu' },
        'W48': { name: 'Sound & Toast Notification FX', group: 'UI', desc: 'Thông báo trạng thái công việc tinh tế' },
        'W49': { name: 'Analytics & System Telemetry', group: 'TELEMETRY', desc: 'Đo lường thời gian phản hồi và hiệu năng client' },
        'W50': { name: 'Master Optimization Hub', group: 'ORCHESTRATION', desc: 'Tổng chỉ huy kết nối và điều phối 50 module' }
    };

    class OptimizationHub {
        constructor() {
            this.version = '1.0.0';
            this.startTime = Date.now();
            this.modulesState = {};
            this.listeners = [];
            this.isInitialized = false;

            // Khởi tạo trạng thái ban đầu cho toàn bộ 50 module
            for (let i = 1; i <= 50; i++) {
                const code = 'W' + String(i).padStart(2, '0');
                const meta = MODULE_REGISTRY[code] || { name: 'Module ' + code, group: 'CORE', desc: '' };
                this.modulesState[code] = {
                    id: code,
                    name: meta.name,
                    group: meta.group,
                    desc: meta.desc,
                    status: 'PENDING', // PENDING | LOADED | ACTIVE | ERROR
                    instance: null,
                    error: null,
                    initTime: null,
                    lastCheck: null
                };
            }

            // Đánh dấu W50 là ACTIVE ngay khi nạp
            this.modulesState['W50'].status = 'ACTIVE';
            this.modulesState['W50'].instance = this;
            this.modulesState['W50'].initTime = Date.now();
            this.modulesState['W50'].lastCheck = Date.now();
        }

        /**
         * Tìm kiếm instance của module trên window theo quy chuẩn đặt tên
         * Hỗ trợ: window.PG_Modules_W01, window.PG_W01, window.W01_Module
         */
        resolveModuleInstance(code) {
            if (code === 'W50') return this;
            if (code === 'W41' || code === 'W42') {
                return { id: code, type: 'CSS_STYLESHEET', active: true };
            }

            const candidates = [
                'PG_Modules_' + code,
                'PG_Module_' + code,
                'PG_' + code,
                code + '_Module',
                'PG_' + code.toLowerCase()
            ];

            for (const key of candidates) {
                if (window[key] !== undefined && window[key] !== null) {
                    return window[key];
                }
            }
            return null;
        }

        /**
         * Kết nối và kích hoạt an toàn toàn bộ các module W01 -> W49
         */
        init() {
            if (this.isInitialized) {
                console.log('[PG_W50] Hub đã được khởi chạy, quét cập nhật module mới...');
                return this.scanAndAttachAll();
            }

            console.log('[PG_W50] Đang khởi chạy PG Home Master Optimization Hub W50...');
            const results = this.scanAndAttachAll();
            this.isInitialized = true;
            this.emitChange();
            return results;
        }

        /**
         * Quét kết nối và thực thi init an toàn với try...catch
         */
        scanAndAttachAll() {
            const summary = {
                scanned: 50,
                newlyActivated: 0,
                alreadyActive: 0,
                pending: 0,
                errors: 0
            };

            for (let i = 1; i <= 50; i++) {
                const code = 'W' + String(i).padStart(2, '0');
                if (code === 'W50') {
                    summary.alreadyActive++;
                    continue;
                }

                const item = this.modulesState[code];
                item.lastCheck = Date.now();

                const instance = this.resolveModuleInstance(code);

                if (!instance) {
                    if (item.status !== 'ERROR') {
                        item.status = 'PENDING';
                    }
                    summary.pending++;
                    continue;
                }

                item.instance = instance;

                // Nếu module đã ACTIVE thì bỏ qua gọi lại
                if (item.status === 'ACTIVE') {
                    summary.alreadyActive++;
                    continue;
                }

                try {
                    // Thử gọi hàm khởi tạo an toàn nếu module cung cấp
                    if (typeof instance.init === 'function') {
                        instance.init();
                    } else if (typeof instance.bootstrap === 'function') {
                        instance.bootstrap();
                    } else if (typeof instance.start === 'function') {
                        instance.start();
                    }

                    item.status = 'ACTIVE';
                    item.initTime = Date.now();
                    item.error = null;
                    summary.newlyActivated++;
                } catch (err) {
                    console.error(`[PG_W50] Lỗi khi kích hoạt module ${code}:`, err);
                    item.status = 'ERROR';
                    item.error = err && err.message ? err.message : String(err);
                    summary.errors++;
                }
            }

            return summary;
        }

        /**
         * Đăng ký thủ công một module Wxx nếu module được tải bất đồng bộ (async/defer)
         */
        registerModule(code, instance, autoInit = true) {
            const formattedCode = code.toUpperCase();
            if (!this.modulesState[formattedCode]) {
                console.warn(`[PG_W50] Mã module không hợp lệ: ${formattedCode}`);
                return false;
            }

            const item = this.modulesState[formattedCode];
            item.instance = instance;
            item.lastCheck = Date.now();

            if (autoInit && typeof instance.init === 'function' && item.status !== 'ACTIVE') {
                try {
                    instance.init();
                    item.status = 'ACTIVE';
                    item.initTime = Date.now();
                    item.error = null;
                } catch (err) {
                    item.status = 'ERROR';
                    item.error = err && err.message ? err.message : String(err);
                }
            } else {
                item.status = 'LOADED';
            }

            this.emitChange();
            return true;
        }

        /**
         * Thống kê toàn bộ 50 module tối ưu theo yêu cầu đề bài
         * Trả về bảng tổng kết chi tiết cho Web App và Ban Giám Đốc
         */
        getStatus() {
            let activeCount = 0;
            let loadedCount = 0;
            let pendingCount = 0;
            let errorCount = 0;

            const list = [];
            const byGroup = {};

            for (let i = 1; i <= 50; i++) {
                const code = 'W' + String(i).padStart(2, '0');
                const mod = this.modulesState[code];

                // Kiểm tra trực tiếp xem instance có mới xuất hiện không
                if (mod.status === 'PENDING') {
                    const inst = this.resolveModuleInstance(code);
                    if (inst) {
                        mod.instance = inst;
                        mod.status = 'LOADED';
                    }
                }

                if (mod.status === 'ACTIVE') activeCount++;
                else if (mod.status === 'LOADED') loadedCount++;
                else if (mod.status === 'ERROR') errorCount++;
                else pendingCount++;

                list.push({
                    id: mod.id,
                    name: mod.name,
                    group: mod.group,
                    desc: mod.desc,
                    status: mod.status,
                    hasInstance: !!mod.instance,
                    error: mod.error,
                    initTime: mod.initTime
                });

                if (!byGroup[mod.group]) {
                    byGroup[mod.group] = { total: 0, active: 0, pending: 0, error: 0 };
                }
                byGroup[mod.group].total++;
                if (mod.status === 'ACTIVE') byGroup[mod.group].active++;
                else if (mod.status === 'ERROR') byGroup[mod.group].error++;
                else byGroup[mod.group].pending++;
            }

            const total = 50;
            const healthRate = Math.round(((activeCount + loadedCount) / total) * 100);

            return {
                company: 'HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG',
                legalTaxId: '042203002931',
                hotline: '0986.722.324',
                address: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
                system: 'PG Home Luxury Enterprise Web App',
                timestamp: new Date().toISOString(),
                uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
                summary: {
                    totalModules: total,
                    active: activeCount,
                    loaded: loadedCount,
                    pending: pendingCount,
                    error: errorCount,
                    healthRate: `${healthRate}%`
                },
                byGroup: byGroup,
                modules: list
            };
        }

        /**
         * Lấy thông tin và đối tượng của 1 module cụ thể
         */
        getModule(code) {
            const formatted = String(code).toUpperCase();
            return this.modulesState[formatted] || null;
        }

        /**
         * Danh sách ngắn gọn toàn bộ 50 module
         */
        listModules() {
            return Object.values(this.modulesState).map(m => ({
                id: m.id,
                name: m.name,
                group: m.group,
                status: m.status
            }));
        }

        /**
         * Chạy chẩn đoán nhanh toàn bộ hệ thống
         */
        runDiagnostics() {
            const scan = this.scanAndAttachAll();
            const status = this.getStatus();
            return {
                diagnosticsAt: new Date().toISOString(),
                scanResult: scan,
                health: status.summary.healthRate,
                status: status.summary
            };
        }

        /**
         * Đăng ký lắng nghe sự thay đổi trạng thái module
         */
        onChange(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        }

        emitChange() {
            const currentStatus = this.getStatus();
            for (const fn of this.listeners) {
                try {
                    fn(currentStatus);
                } catch (e) {
                    console.error('[PG_W50] Lỗi trong onChange callback:', e);
                }
            }
        }

        /**
         * Tùy chọn render UI Badge hoặc Widget trạng thái nếu được yêu cầu
         */
        renderStatusBadge(domSelector) {
            if (typeof document === 'undefined') return;
            const container = typeof domSelector === 'string' ? document.querySelector(domSelector) : domSelector;
            if (!container) return;

            const st = this.getStatus();
            container.innerHTML = `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-weight: 700; color: #38bdf8; font-size: 13px;">PG HOME OPTIMIZATION HUB (W50)</span>
                        <span style="background: #10b981; color: #022c22; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 9999px;">${st.summary.healthRate} SẴN SÀNG</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; font-size: 11px;">
                        <div style="background: #1e293b; padding: 6px; border-radius: 6px;">
                            <div style="color: #94a3b8;">Tổng module</div>
                            <div style="font-weight: 700; font-size: 14px; color: #f8fafc;">${st.summary.totalModules}</div>
                        </div>
                        <div style="background: #1e293b; padding: 6px; border-radius: 6px;">
                            <div style="color: #4ade80;">Đang chạy</div>
                            <div style="font-weight: 700; font-size: 14px; color: #4ade80;">${st.summary.active}</div>
                        </div>
                        <div style="background: #1e293b; padding: 6px; border-radius: 6px;">
                            <div style="color: #fbbf24;">Chờ nạp</div>
                            <div style="font-weight: 700; font-size: 14px; color: #fbbf24;">${st.summary.pending}</div>
                        </div>
                        <div style="background: #1e293b; padding: 6px; border-radius: 6px;">
                            <div style="color: #f87171;">Lỗi</div>
                            <div style="font-weight: 700; font-size: 14px; color: #f87171;">${st.summary.error}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Khởi tạo Singleton
    const hubInstance = new OptimizationHub();

    // Xuất ra global scope theo đúng yêu cầu đề bài
    window.PG_Modules_W50 = hubInstance;
    window.PG_OptimizationHub = hubInstance;

    // Tự động kết nối an toàn khi tài liệu sẵn sàng
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                hubInstance.init();
            });
        } else {
            // DOM đã sẵn sàng
            setTimeout(() => {
                hubInstance.init();
            }, 0);
        }
    }

    console.log('[PG_W50] Master Optimization Hub đã nạp thành công vào window.PG_Modules_W50 & window.PG_OptimizationHub');

})(typeof window !== 'undefined' ? window : globalThis);
