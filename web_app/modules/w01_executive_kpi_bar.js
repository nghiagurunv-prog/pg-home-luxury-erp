/**
 * ==============================================================================
 * PHÂN HỆ QUẢN TRỊ GIÁM ĐỐC (ADMIN) - PG HOME LUXURY
 * MODULE W01: THANH KPI THƯỢNG ĐỈNH (EXECUTIVE KPI BAR & SAFETY GUARDRAIL)
 * ==============================================================================
 * File: f:\PG Home - Quản trị\web_app\modules\w01_executive_kpi_bar.js
 * 
 * CHỨC NĂNG CỐT LÕI:
 * 1. Hiển thị 7 chỉ số tài chính sống chuẩn xác 100%:
 *    - Doanh thu năm (Tổng kế hoạch 12 tháng & Lũy kế thực tế)
 *    - Thực thu (Dòng tiền về két & Tỷ lệ thu hồi tiền mặt)
 *    - Công nợ phải thu (Kế hoạch năm & Danh sách nợ hợp đồng thực tế)
 *    - Quỹ lương xưởng 15% (Định mức khoán thợ nghiêm ngặt)
 *    - Chi phí vật tư 40% (Hạn mức nhập ván & vật liệu chính)
 *    - Lợi nhuận ròng Col BG (Lợi nhuận xưởng độc lập bỏ túi BGĐ)
 *    - Cảnh báo chốt chặn 54% (Thước đo an toàn chi phí sản xuất VT + Thợ <= 54%)
 * 2. Hỗ trợ chuyển đổi mượt mà giữa 2 góc nhìn:
 *    - Kế Hoạch Cả Năm (12 Tháng)
 *    - Lũy Kế Thực Tế (T6 - T9)
 * 3. Tương thích độc lập: Tự động inject CSS scoped, không phụ thuộc thư viện ngoài.
 * ==============================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PG_Modules_W01 = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var VERSION = '1.0.0';
    var STYLES_INJECTED = false;

    // Helper: Định dạng tiền tệ VNĐ chuẩn mực
    function formatMoney(amount) {
        if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
        return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
    }

    // Helper: Rút gọn số tiền lớn (Tỷ / Triệu)
    function formatCompactMoney(amount) {
        if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
        var absVal = Math.abs(amount);
        var sign = amount < 0 ? '-' : '';
        if (absVal >= 1000000000) {
            return sign + (absVal / 1000000000).toFixed(2).replace(/\.00$/, '') + ' Tỷ';
        }
        if (absVal >= 1000000) {
            return sign + (absVal / 1000000).toFixed(2).replace(/\.00$/, '') + ' Tr';
        }
        if (absVal >= 1000) {
            return sign + (absVal / 1000).toFixed(0) + ' k';
        }
        return sign + absVal.toString() + ' đ';
    }

    // Helper: Định dạng phần trăm
    function formatPercent(value, decimals) {
        decimals = decimals !== undefined ? decimals : 1;
        if (value === undefined || value === null || isNaN(value)) return '0.0%';
        return value.toFixed(decimals) + '%';
    }

    // Inject CSS Scoped duy nhất 1 lần
    function injectStyles() {
        if (STYLES_INJECTED) return;
        var styleId = 'pg-w01-executive-kpi-styles';
        if (document.getElementById(styleId)) {
            STYLES_INJECTED = true;
            return;
        }

        var css = `
            .pg-w01-kpi-wrapper {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #f8fafc;
                border-radius: 14px;
                padding: 20px 24px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 215, 0, 0.2);
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
            }
            .pg-w01-kpi-wrapper::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #d97706, #fbbf24, #f59e0b, #10b981);
            }
            .pg-w01-header {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: 14px;
                margin-bottom: 20px;
                padding-bottom: 14px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }
            .pg-w01-title-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .pg-w01-badge-crown {
                background: linear-gradient(135deg, #d97706, #b45309);
                color: #fff;
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                box-shadow: 0 2px 6px rgba(217, 119, 6, 0.4);
            }
            .pg-w01-title {
                margin: 0;
                font-size: 18px;
                font-weight: 800;
                color: #f8fafc;
                letter-spacing: -0.3px;
            }
            .pg-w01-subtitle {
                margin: 2px 0 0 0;
                font-size: 12px;
                color: #94a3b8;
            }
            .pg-w01-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .pg-w01-tab-btn {
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: #94a3b8;
                padding: 6px 14px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .pg-w01-tab-btn:hover {
                background: rgba(255, 255, 255, 0.12);
                color: #f8fafc;
            }
            .pg-w01-tab-btn.active {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                border-color: #f59e0b;
                color: #0f172a;
                font-weight: 700;
                box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
            }
            .pg-w01-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 14px;
                margin-bottom: 18px;
            }
            @media (min-width: 1200px) {
                .pg-w01-grid {
                    grid-template-columns: repeat(6, 1fr);
                }
            }
            .pg-w01-card {
                background: rgba(30, 41, 59, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 10px;
                padding: 14px;
                position: relative;
                transition: transform 0.2s ease, border-color 0.2s ease;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .pg-w01-card:hover {
                transform: translateY(-2px);
                border-color: rgba(245, 158, 11, 0.4);
                background: rgba(30, 41, 59, 0.95);
            }
            .pg-w01-card-label {
                font-size: 11px;
                font-weight: 600;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 6px;
            }
            .pg-w01-card-icon {
                font-size: 14px;
                opacity: 0.8;
            }
            .pg-w01-card-val {
                font-size: 19px;
                font-weight: 800;
                color: #f8fafc;
                line-height: 1.2;
                margin-bottom: 6px;
                font-feature-settings: "tnum";
            }
            .pg-w01-card-val.gold { color: #fbbf24; }
            .pg-w01-card-val.green { color: #34d399; }
            .pg-w01-card-val.blue { color: #60a5fa; }
            .pg-w01-card-val.purple { color: #c084fc; }
            .pg-w01-card-val.orange { color: #fb923c; }
            .pg-w01-card-val.red { color: #f87171; }
            .pg-w01-card-sub {
                font-size: 11px;
                color: #64748b;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .pg-w01-progress {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                margin-top: 6px;
            }
            .pg-w01-progress-bar {
                height: 100%;
                border-radius: 2px;
                transition: width 0.4s ease;
            }
            .pg-w01-guardrail-banner {
                background: rgba(15, 23, 42, 0.85);
                border: 1px solid rgba(245, 158, 11, 0.35);
                border-radius: 10px;
                padding: 14px 18px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 14px;
            }
            .pg-w01-guardrail-banner.safe {
                border-color: rgba(52, 211, 153, 0.4);
                background: linear-gradient(90deg, rgba(6, 78, 59, 0.25) 0%, rgba(15, 23, 42, 0.85) 100%);
            }
            .pg-w01-guardrail-banner.warning {
                border-color: rgba(245, 158, 11, 0.5);
                background: linear-gradient(90deg, rgba(120, 53, 15, 0.25) 0%, rgba(15, 23, 42, 0.85) 100%);
            }
            .pg-w01-guardrail-banner.danger {
                border-color: rgba(239, 68, 68, 0.5);
                background: linear-gradient(90deg, rgba(127, 29, 29, 0.3) 0%, rgba(15, 23, 42, 0.85) 100%);
            }
            .pg-w01-gr-left {
                display: flex;
                align-items: center;
                gap: 14px;
                flex: 1 1 300px;
            }
            .pg-w01-gr-icon {
                font-size: 26px;
                line-height: 1;
            }
            .pg-w01-gr-title {
                font-size: 13px;
                font-weight: 700;
                color: #f8fafc;
                margin-bottom: 2px;
            }
            .pg-w01-gr-desc {
                font-size: 11px;
                color: #94a3b8;
                line-height: 1.4;
            }
            .pg-w01-gr-stats {
                display: flex;
                align-items: center;
                gap: 20px;
                flex-wrap: wrap;
            }
            .pg-w01-gr-metric {
                text-align: right;
            }
            .pg-w01-gr-m-label {
                font-size: 10px;
                text-transform: uppercase;
                color: #64748b;
                letter-spacing: 0.5px;
            }
            .pg-w01-gr-m-val {
                font-size: 15px;
                font-weight: 800;
                font-feature-settings: "tnum";
            }
            .pg-w01-meter-wrap {
                width: 140px;
            }
            .pg-w01-meter-bar {
                height: 8px;
                background: #334155;
                border-radius: 4px;
                position: relative;
                overflow: visible;
                margin-top: 4px;
            }
            .pg-w01-meter-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            .pg-w01-meter-target {
                position: absolute;
                top: -3px;
                bottom: -3px;
                width: 2px;
                background: #fbbf24;
                box-shadow: 0 0 6px #fbbf24;
            }
        `;

        var styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.type = 'text/css';
        styleEl.appendChild(document.createTextNode(css));
        document.head.appendChild(styleEl);
        STYLES_INJECTED = true;
    }

    /**
     * Bóc tách và tính toán các chỉ số tài chính từ live state
     * Tuân thủ 100% Luật Sắt Quản Trị & Quy Tắc Chốt Chặn 54%
     */
    function calculate(state) {
        state = state || {};
        var ccscMonths = state.ccscMonths || [];
        var debts = state.debts || [];
        var contracts = state.contracts || [];

        // Khởi tạo các biến tích lũy cả năm (12 Tháng)
        var annual = {
            sales: 0,
            cash: 0,
            vtCost: 0,
            laborCost: 0,
            fixedExp: 0,
            colBG: 0,
            debt: 0,
            monthCount: ccscMonths.length
        };

        // Khởi tạo các biến lũy kế thực tế (T6 - T9 hoặc các tháng ACTUAL)
        var actual = {
            sales: 0,
            cash: 0,
            vtCost: 0,
            laborCost: 0,
            fixedExp: 0,
            colBG: 0,
            debt: 0,
            monthCount: 0
        };

        // Quét từng tháng trong ccscMonths
        for (var i = 0; i < ccscMonths.length; i++) {
            var m = ccscMonths[i];
            var mSales = m.sales || m.doanhThu || 0;
            var mCash = m.cash || m.thucThu || 0;
            var mVt = m.vtCost !== undefined ? m.vtCost : (mSales * 0.40);
            var mLabor = m.laborCost !== undefined ? m.laborCost : (mSales * 0.15);
            var mFixed = m.fixedExp || 0;
            var mColBG = m.colBG !== undefined ? m.colBG : (mSales - mVt - mLabor - mFixed);
            var mDebt = m.debt !== undefined ? m.debt : Math.max(0, mSales - mCash);

            // Cộng dồn kế hoạch cả năm
            annual.sales += mSales;
            annual.cash += mCash;
            annual.vtCost += mVt;
            annual.laborCost += mLabor;
            annual.fixedExp += mFixed;
            annual.colBG += mColBG;
            annual.debt += mDebt;

            // Kiểm tra tháng thực tế
            var isActual = m.status === 'ACTUAL' || (m.month >= 6 && m.month <= 9);
            if (isActual) {
                actual.sales += mSales;
                actual.cash += mCash;
                actual.vtCost += mVt;
                actual.laborCost += mLabor;
                actual.fixedExp += mFixed;
                actual.colBG += mColBG;
                actual.debt += mDebt;
                actual.monthCount++;
            }
        }

        // Tính công nợ hợp đồng thực tế từ contracts/debts
        var totalContractDebt = 0;
        var topDebtors = [];
        if (contracts && contracts.length > 0) {
            for (var c = 0; c < contracts.length; c++) {
                var item = contracts[c];
                var cDebt = item.debt || 0;
                if (cDebt > 0) {
                    totalContractDebt += cDebt;
                    topDebtors.push({
                        name: item.customer || item.code || 'Khách hàng',
                        debt: cDebt,
                        paid: item.paid || 0,
                        total: item.value || 0
                    });
                }
            }
            topDebtors.sort(function (a, b) { return b.debt - a.debt; });
        } else if (debts && debts.length > 0) {
            for (var d = 0; d < debts.length; d++) {
                var dItem = debts[d];
                var dVal = dItem.debt || dItem.amount || 0;
                totalContractDebt += dVal;
                topDebtors.push({
                    name: dItem.customer || dItem.ncc || 'Đối tác',
                    debt: dVal
                });
            }
            topDebtors.sort(function (a, b) { return b.debt - a.debt; });
        }

        // Helper tính toán các chỉ số phái sinh
        function buildMetrics(base, label) {
            var sales = base.sales;
            var cash = base.cash;
            var debt = base.debt;
            var vtCost = base.vtCost;
            var laborCost = base.laborCost;
            var colBG = base.colBG;

            var cashRate = sales > 0 ? (cash / sales) * 100 : 0;
            var debtRate = sales > 0 ? (debt / sales) * 100 : 0;
            var vtRate = sales > 0 ? (vtCost / sales) * 100 : 40.0;
            var laborRate = sales > 0 ? (laborCost / sales) * 100 : 15.0;
            var colBgRate = sales > 0 ? (colBG / sales) * 100 : 0;

            // Tổng chi phí sản xuất định mức (VT + Thợ)
            var prodCost = vtCost + laborCost;
            var prodCostRate = sales > 0 ? (prodCost / sales) * 100 : 55.0;

            // Mức trần an toàn 54% theo Luật Sắt
            var safeCeiling54 = sales * 0.54;
            var delta54 = prodCost - safeCeiling54; // > 0: vượt mốc trần; <= 0: đạt chuẩn an toàn

            // Đánh giá trạng thái Guardrail 54%
            var guardrailStatus = 'safe'; // 'safe' (<=54%), 'warning' (54% - 55%), 'danger' (>55%)
            var statusText = 'AN TOÀN TUYỆT ĐỐI (≤ 54%)';
            var statusDesc = 'Chi phí sản xuất tối ưu, bảo toàn lợi nhuận ròng 18% - 20% bỏ túi Giám Đốc.';

            if (prodCostRate > 55.0) {
                guardrailStatus = 'danger';
                statusText = 'BÁO ĐỘNG VƯỢT NGƯỠNG (> 55%)';
                statusDesc = 'Tổng chi phí sản xuất đã vượt 55%, nguy cơ thâm hụt quỹ quản lý xưởng!';
            } else if (prodCostRate > 54.0) {
                guardrailStatus = 'warning';
                statusText = 'CẢNH BÁO CHỐT CHẶN (54.0% - 55.0%)';
                statusDesc = 'Đang chạm ngưỡng trần 55%. Cần tối ưu ' + (prodCostRate - 54.0).toFixed(1) + '% (~' + formatCompactMoney(delta54) + ') chi phí ván/phụ kiện để đưa về ≤ 54%.';
            }

            return {
                label: label,
                sales: sales,
                cash: cash,
                cashRate: cashRate,
                debt: debt,
                debtRate: debtRate,
                vtCost: vtCost,
                vtRate: vtRate,
                laborCost: laborCost,
                laborRate: laborRate,
                colBG: colBG,
                colBgRate: colBgRate,
                prodCost: prodCost,
                prodCostRate: prodCostRate,
                safeCeiling54: safeCeiling54,
                delta54: delta54,
                guardrailStatus: guardrailStatus,
                statusText: statusText,
                statusDesc: statusDesc
            };
        }

        return {
            annual: buildMetrics(annual, 'Kế Hoạch Cả Năm (12 Tháng)'),
            actual: buildMetrics(actual, 'Lũy Kế Thực Tế (T6 - T9)'),
            topDebtors: topDebtors,
            totalContractDebt: totalContractDebt
        };
    }

    /**
     * Tạo chuỗi HTML render cho toàn bộ widget
     */
    function getHtml(data, activeView) {
        activeView = activeView || 'annual'; // 'annual' hoặc 'actual'
        var current = activeView === 'actual' ? data.actual : data.annual;
        var isAnnual = activeView === 'annual';

        var statusClass = current.guardrailStatus;
        var statusColor = statusClass === 'safe' ? '#34d399' : (statusClass === 'warning' ? '#fbbf24' : '#f87171');
        var statusIcon = statusClass === 'safe' ? '🛡️' : (statusClass === 'warning' ? '⚠️' : '🚨');

        // Render danh sách công nợ ngắn gọn (tooltip/modal sẵn sàng)
        var debtorNote = '';
        if (data.topDebtors && data.topDebtors.length > 0) {
            debtorNote = 'Gồm: ' + data.topDebtors.slice(0, 3).map(function (d) {
                return d.name + ' (' + formatCompactMoney(d.debt) + ')';
            }).join(', ');
            if (data.topDebtors.length > 3) {
                debtorNote += '...';
            }
        }

        return `
            <div class="pg-w01-kpi-wrapper" id="pg-w01-container">
                <!-- Header & Thanh điều khiển chế độ -->
                <div class="pg-w01-header">
                    <div class="pg-w01-title-group">
                        <span class="pg-w01-badge-crown">👑 ADMIN EXECUTIVE</span>
                        <div>
                            <h2 class="pg-w01-title">THANH KPI THƯỢNG ĐỈNH & BẢO VỆ DÒNG TIỀN</h2>
                            <p class="pg-w01-subtitle">Bản đồ tài chính sống 2026 • Hệ thống Luật Sắt CCSC Phú Gia Home Luxury</p>
                        </div>
                    </div>
                    <div class="pg-w01-controls">
                        <button type="button" class="pg-w01-tab-btn ${isAnnual ? 'active' : ''}" data-view="annual" title="Xem tổng kế hoạch 12 tháng năm 2026">
                            📅 Cả Năm 2026
                        </button>
                        <button type="button" class="pg-w01-tab-btn ${!isAnnual ? 'active' : ''}" data-view="actual" title="Xem lũy kế thực tế T6 - T9">
                            ⚡ Thực Tế (T6-T9)
                        </button>
                    </div>
                </div>

                <!-- Grid 6 Card KPI chính -->
                <div class="pg-w01-grid">
                    <!-- 1. Doanh thu năm -->
                    <div class="pg-w01-card">
                        <div>
                            <div class="pg-w01-card-label">
                                <span>Doanh Thu ${isAnnual ? 'Năm' : 'Kỳ'}</span>
                                <span class="pg-w01-card-icon">💰</span>
                            </div>
                            <div class="pg-w01-card-val gold" title="${formatMoney(current.sales)}">
                                ${formatCompactMoney(current.sales)}
                            </div>
                        </div>
                        <div>
                            <div class="pg-w01-card-sub">
                                <span>Chỉ tiêu:</span>
                                <strong>${isAnnual ? '12 Tháng' : '4 Tháng (T6-T9)'}</strong>
                            </div>
                            <div class="pg-w01-progress">
                                <div class="pg-w01-progress-bar" style="width: 100%; background: #f59e0b;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Thực thu (Tiền mặt vào két) -->
                    <div class="pg-w01-card">
                        <div>
                            <div class="pg-w01-card-label">
                                <span>Thực Thu Về Két</span>
                                <span class="pg-w01-card-icon">📥</span>
                            </div>
                            <div class="pg-w01-card-val green" title="${formatMoney(current.cash)}">
                                ${formatCompactMoney(current.cash)}
                            </div>
                        </div>
                        <div>
                            <div class="pg-w01-card-sub">
                                <span>Tỷ lệ thu:</span>
                                <strong>${formatPercent(current.cashRate)}</strong>
                            </div>
                            <div class="pg-w01-progress">
                                <div class="pg-w01-progress-bar" style="width: ${Math.min(100, current.cashRate)}%; background: #10b981;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Công nợ phải thu -->
                    <div class="pg-w01-card">
                        <div>
                            <div class="pg-w01-card-label">
                                <span>Công Nợ Phải Thu</span>
                                <span class="pg-w01-card-icon">⏳</span>
                            </div>
                            <div class="pg-w01-card-val orange" title="${formatMoney(current.debt)}">
                                ${formatCompactMoney(current.debt)}
                            </div>
                        </div>
                        <div>
                            <div class="pg-w01-card-sub" title="${debtorNote}">
                                <span>Tỷ lệ nợ:</span>
                                <strong>${formatPercent(current.debtRate)}</strong>
                            </div>
                            <div class="pg-w01-progress">
                                <div class="pg-w01-progress-bar" style="width: ${Math.min(100, current.debtRate)}%; background: #f97316;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. Quỹ lương xưởng 15% -->
                    <div class="pg-w01-card">
                        <div>
                            <div class="pg-w01-card-label">
                                <span>Quỹ Lương Xưởng</span>
                                <span class="pg-w01-card-icon">🔨</span>
                            </div>
                            <div class="pg-w01-card-val blue" title="${formatMoney(current.laborCost)}">
                                ${formatCompactMoney(current.laborCost)}
                            </div>
                        </div>
                        <div>
                            <div class="pg-w01-card-sub">
                                <span>Định mức khoán:</span>
                                <strong>15.0% (${formatCompactMoney(current.laborCost)})</strong>
                            </div>
                            <div class="pg-w01-progress">
                                <div class="pg-w01-progress-bar" style="width: 15%; background: #3b82f6;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 5. Chi phí vật tư 40% -->
                    <div class="pg-w01-card">
                        <div>
                            <div class="pg-w01-card-label">
                                <span>Hạn Mức Vật Tư</span>
                                <span class="pg-w01-card-icon">📦</span>
                            </div>
                            <div class="pg-w01-card-val purple" title="${formatMoney(current.vtCost)}">
                                ${formatCompactMoney(current.vtCost)}
                            </div>
                        </div>
                        <div>
                            <div class="pg-w01-card-sub">
                                <span>Định mức ván:</span>
                                <strong>40.0% (${formatCompactMoney(current.vtCost)})</strong>
                            </div>
                            <div class="pg-w01-progress">
                                <div class="pg-w01-progress-bar" style="width: 40%; background: #8b5cf6;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 6. Lợi nhuận ròng Col BG -->
                    <div class="pg-w01-card">
                        <div>
                            <div class="pg-w01-card-label">
                                <span>LN Ròng Col BG</span>
                                <span class="pg-w01-card-icon">💎</span>
                            </div>
                            <div class="pg-w01-card-val gold" title="${formatMoney(current.colBG)}">
                                ${formatCompactMoney(current.colBG)}
                            </div>
                        </div>
                        <div>
                            <div class="pg-w01-card-sub">
                                <span>Tỷ suất ròng:</span>
                                <strong style="color: #fbbf24;">${formatPercent(current.colBgRate)}</strong>
                            </div>
                            <div class="pg-w01-progress">
                                <div class="pg-w01-progress-bar" style="width: ${Math.min(100, current.colBgRate * 3)}%; background: #f59e0b;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 7. Banner Cảnh báo chốt chặn 54% (Safety Guardrail) -->
                <div class="pg-w01-guardrail-banner ${statusClass}">
                    <div class="pg-w01-gr-left">
                        <div class="pg-w01-gr-icon">${statusIcon}</div>
                        <div>
                            <div class="pg-w01-gr-title" style="color: ${statusColor};">
                                ${current.statusText}
                            </div>
                            <div class="pg-w01-gr-desc">
                                ${current.statusDesc}
                            </div>
                        </div>
                    </div>

                    <div class="pg-w01-gr-stats">
                        <div class="pg-w01-gr-metric">
                            <div class="pg-w01-gr-m-label">Tổng Cost (VT 40% + Thợ 15%)</div>
                            <div class="pg-w01-gr-m-val" style="color: ${statusColor};">
                                ${formatPercent(current.prodCostRate)} (${formatCompactMoney(current.prodCost)})
                            </div>
                        </div>

                        <div class="pg-w01-gr-metric">
                            <div class="pg-w01-gr-m-label">Trần Chốt Chặn 54%</div>
                            <div class="pg-w01-gr-m-val" style="color: #94a3b8;">
                                54.0% (${formatCompactMoney(current.safeCeiling54)})
                            </div>
                        </div>

                        <div class="pg-w01-meter-wrap">
                            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
                                <span>0%</span>
                                <span style="color: #fbbf24; font-weight: 700;">54%</span>
                                <span>60%</span>
                            </div>
                            <div class="pg-w01-meter-bar">
                                <div class="pg-w01-meter-fill" style="width: ${Math.min(100, (current.prodCostRate / 60) * 100)}%; background: ${statusColor};"></div>
                                <div class="pg-w01-meter-target" style="left: 90%;" title="Mốc trần an toàn 54%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render widget vào container mục tiêu
     * @param {string|HTMLElement} containerOrId - DOM Element hoặc ID của container
     * @param {Object} state - Dữ liệu live state (pg_home_live_state)
     * @param {Object} options - Tùy chọn mở rộng
     */
    function render(containerOrId, state, options) {
        injectStyles();
        options = options || {};
        var activeView = options.activeView || 'annual';

        var container = typeof containerOrId === 'string' 
            ? document.getElementById(containerOrId) 
            : containerOrId;

        if (!container) {
            console.error('[PG_Modules_W01] Không tìm thấy DOM container:', containerOrId);
            return null;
        }

        var data = calculate(state);

        function updateView(view) {
            activeView = view;
            container.innerHTML = getHtml(data, activeView);

            // Gắn event listener cho nút bấm tab
            var tabBtns = container.querySelectorAll('.pg-w01-tab-btn');
            for (var i = 0; i < tabBtns.length; i++) {
                tabBtns[i].addEventListener('click', function (e) {
                    var targetView = this.getAttribute('data-view');
                    if (targetView && targetView !== activeView) {
                        updateView(targetView);
                    }
                });
            }
        }

        updateView(activeView);

        return {
            update: function (newState, newOptions) {
                if (newState) data = calculate(newState);
                if (newOptions && newOptions.activeView) activeView = newOptions.activeView;
                updateView(activeView);
            },
            getData: function () {
                return data;
            },
            getView: function () {
                return activeView;
            }
        };
    }

    return {
        version: VERSION,
        calculate: calculate,
        getHtml: getHtml,
        render: render,
        formatMoney: formatMoney,
        formatCompactMoney: formatCompactMoney,
        formatPercent: formatPercent
    };
}));
