/**
 * ============================================================================
 * HỆ THỐNG QUẢN TRỊ & VẬN HÀNH PG HOME LUXURY 2026
 * MODULE W29: COMMAND PALETTE (CTRL + K) ĐIỀU KHIỂN NHANH 0.1 GIÂY & TIỆN ÍCH UX V30
 * Cải tiến UX: #11, #13, #14 (Bulk Check-in 8h), #16 (Clone Dự Án), #17, #18 (Undo Toast 8s), #19 (Zen Focus Mode), #20 (Mobile Bottom QuickBar)
 * Tác giả: Flash Worker W29 (Kiến trúc phân hệ Web App PG Home)
 * Bản quyền: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * ============================================================================
 */

(function (window, document) {
    'use strict';

    // Danh mục lệnh điều hướng hệ thống gốc (Tabs & Phân hệ)
    const COMMAND_ITEMS = [
        {
            id: 'ccsc',
            title: 'Báo Cáo CCSC 12 Tháng & Dòng Tiền Lợi Nhuận',
            keywords: 'ccsc tai chinh loi nhuan col bg dong tien 12 thang bao cao quy luong',
            category: 'TÀI CHÍNH & CCSC',
            badge: 'BGĐ',
            shortcut: 'G C',
            icon: '📊',
            targetTab: 'tab-ccsc',
            action: () => triggerTabSwitch('ccsc', ['tab-ccsc', 'nav-ccsc', 'menu-ccsc'])
        },
        {
            id: 'cham_cong',
            title: 'Chấm Công Điểm Danh & Quỹ Lương Thợ Nòng Cốt',
            keywords: 'cham cong diem danh tho luong hoa hao 20k cong ot tang ca',
            category: 'XƯỞNG & NHÂN SỰ',
            badge: 'XƯỞNG',
            shortcut: 'G T',
            icon: '⏱️',
            targetTab: 'tab-cham-cong',
            action: () => triggerTabSwitch('cham_cong', ['tab-cham-cong', 'tab-attendance', 'nav-cham-cong'])
        },
        {
            id: 'bac_phat',
            title: 'Dự Án Công Trình: Bác Phát (Đối Soát Thực Tế)',
            keywords: 'bac phat cong trinh du an go thit vat tu tien do quyet toan',
            category: 'CÔNG TRÌNH',
            badge: 'DỰ ÁN',
            shortcut: 'G P',
            icon: '🏡',
            targetTab: 'tab-project-bac-phat',
            action: () => triggerTabSwitch('bac_phat', ['tab-bac-phat', 'project-bac-phat', 'nav-project'])
        },
        {
            id: 'anh_nam',
            title: 'Dự Án Công Trình: Anh Nam (Định Mức CNC 06/11)',
            keywords: 'anh nam dinh muc cnc 06 11 tam cat go thai lan tu bep tu ao wpb',
            category: 'CÔNG TRÌNH',
            badge: 'DỰ ÁN',
            shortcut: 'G N',
            icon: '📐',
            targetTab: 'tab-project-anh-nam',
            action: () => triggerTabSwitch('anh_nam', ['tab-anh-nam', 'project-anh-nam', 'nav-cnc'])
        },
        {
            id: 'lam_giang',
            title: 'Nhà Cung Cấp: Ván Gỗ & Phụ Kiện Lam Giang',
            keywords: 'lam giang nha cung cap ncc van go hoa don doi soat cong no',
            category: 'NHÀ CUNG CẤP',
            badge: 'VẬT TƯ',
            shortcut: 'G L',
            icon: '🪵',
            targetTab: 'tab-ncc-lam-giang',
            action: () => triggerTabSwitch('lam_giang', ['tab-lam-giang', 'ncc-lam-giang', 'nav-suppliers'])
        },
        {
            id: 'duyet_po',
            title: 'Phân Hệ Duyệt PO Đặt Hàng Vật Tư (Đóng Dấu Đỏ)',
            keywords: 'duyet po de xuat vat tu vu an cuong hafele quoc tam dong dau do ban giam doc',
            category: 'PHÊ DUYỆT BGĐ',
            badge: 'ĐÓNG DẤU ĐỎ',
            shortcut: 'G D',
            icon: '🔴',
            targetTab: 'tab-duyet-po',
            action: () => triggerTabSwitch('duyet_po', ['tab-duyet-po', 'tab-po-approval', 'nav-approval'])
        },
        {
            id: 'zalo_v6',
            title: 'Zalo Stealth V6.0 (Giám Sát Ngầm 100% Zero-Disruption)',
            keywords: 'zalo stealth v6 monitor group ncc hoa don unc ngan hang sha256 delta cursor',
            category: 'TỰ ĐỘNG HÓA',
            badge: 'STEALTH',
            shortcut: 'G Z',
            icon: '⚡',
            targetTab: 'tab-zalo-v6',
            action: () => triggerTabSwitch('zalo_v6', ['tab-zalo', 'tab-zalo-monitor', 'nav-zalo'])
        },
        {
            id: 'du_toan',
            title: 'Dự Toán Sale & Báo Giá Nhà Ở (Kiểm Soát Cost <= 54%)',
            keywords: 'du toan sale bao gia hiep dung cost 54 loi nhuan 20 bao ve dong tien',
            category: 'KINH DOANH & SALE',
            badge: 'SALE',
            shortcut: 'G S',
            icon: '📋',
            targetTab: 'tab-du-toan',
            action: () => triggerTabSwitch('du_toan', ['tab-du-toan', 'tab-estimate', 'nav-sales'])
        },
        {
            id: 'phan_quyen',
            title: 'Phân Quyền Nhân Sự (Duyệt Tài Khoản PENDING -> ACTIVE)',
            keywords: 'phan quyen nhan su admin pending active tai khoan phan he',
            category: 'HỆ THỐNG',
            badge: 'ADMIN',
            shortcut: 'G Q',
            icon: '🛡️',
            targetTab: 'tab-phan-quyen',
            action: () => triggerTabSwitch('phan_quyen', ['tab-phan-quyen', 'tab-permissions', 'nav-admin'])
        }
    ];

    // Dữ liệu mẫu thực tế của PG Home khi window.appState chưa kịp nạp
    const FALLBACK_ENTITIES = {
        contracts: [
            { id: 'HD-BACPHAT', title: 'Hợp Đồng: Bác Phát (Đường 26/03 - TP. Hà Tĩnh)', customer: 'Bác Phát', phone: '0986.722.324', value: '182.890.000đ', type: 'Nội thất gỗ công nghiệp & Tủ bếp' },
            { id: 'HD-ANHNAM', title: 'Hợp Đồng: Anh Nam (Thạch Trung - TP. Hà Tĩnh)', customer: 'Anh Nam', phone: '0986.722.324', value: '253.860.000đ', type: 'Full nội thất MDF Thái Lan + WPB' },
            { id: 'HD-BSDUAN', title: 'Hợp Đồng: Bác Sĩ Duẫn (TP. Hà Tĩnh)', customer: 'Bác Sĩ Duẫn', phone: '0986.722.324', value: '250.340.000đ', type: 'Nội thất Full Căn Cao Cấp' },
            { id: 'HD-ANHCONG', title: 'Hợp Đồng: Nhà Anh Công (Hà Tĩnh)', customer: 'Anh Công', phone: '0986.722.324', value: '215.000.000đ', type: 'Combo Phòng Khách & Tủ Bếp' }
        ],
        materials: [
            { code: 'MDF-AC-17', name: 'Ván MDF Chống Ẩm An Cường 17mm', brand: 'An Cường', unit: 'Tấm', cost: '780.000đ', spec: '1220x2440' },
            { code: 'MDF-TL-17', name: 'Ván Gỗ MDF Chống Ẩm Thái Lan 17mm', brand: 'Lam Giang', unit: 'Tấm', cost: '400.000đ', spec: '1220x2440' },
            { code: 'WPB-AC-17', name: 'Tấm Nhựa Đặc WPB An Cường 17mm', brand: 'An Cường', unit: 'Tấm', cost: '2.550.000đ', spec: 'Chống nước 100%' },
            { code: 'PK-HAFELE-BL', name: 'Bản Lề Giảm Chấn Inox 304 Hafele', brand: 'Hafele', unit: 'Bộ', cost: '45.000đ', spec: 'Thép không gỉ' },
            { code: 'PK-HAFELE-RAY', name: 'Ray Trượt Bi 3 Tầng Giảm Chấn Hafele', brand: 'Hafele', unit: 'Bộ', cost: '145.000đ', spec: 'Dài 450mm' },
            { code: 'ACRYLIC-NOLINE', name: 'Cánh Acrylic Noline An Cường', brand: 'An Cường', unit: 'M2', cost: '1.250.000đ', spec: 'Dán cạnh không đường line' },
            { code: 'KINH-NHOM-ANOD', name: 'Cánh Kính Khung Nhôm Anodized Đen Xước', brand: 'Quốc Tâm', unit: 'M2', cost: '1.650.000đ', spec: 'Kính xám khói cường lực 5mm' }
        ],
        staff: [
            { name: 'Nguyễn Văn Hòa', role: 'Thợ Chính Nòng Cốt', unit: 'Xưởng', fund: 'Quỹ thợ 20k/công', status: 'Đang làm việc' },
            { name: 'Trần Văn Hào', role: 'Thợ Phụ Nòng Cốt', unit: 'Xưởng', fund: 'Quỹ thợ 20k/công', status: 'Đang làm việc' },
            { name: 'Hoàng Văn Vũ', role: 'Kỹ Thuật Xưởng & Đề Xuất PO', unit: 'Kỹ thuật', fund: 'Phụ trách duyệt PO vật tư', status: 'Trực xưởng' },
            { name: 'Nguyễn Viết Hiệp', role: 'Sale Admin & Văn Phòng', unit: 'Văn phòng', fund: 'Doanh số & Hợp đồng', status: 'Online' },
            { name: 'Nguyễn Văn Dũng', role: 'Dự Toán Sale & Báo Giá', unit: 'Văn phòng', fund: 'Kiểm soát cost <= 54%', status: 'Online' }
        ]
    };

    /**
     * Tiện ích xóa dấu tiếng Việt phục vụ tìm kiếm đa năng
     */
    function removeAccents(str) {
        if (!str) return '';
        return String(str)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'd');
    }

    /**
     * Lọc danh mục lệnh hệ thống theo phân quyền người dùng
     */
    function getVisibleCommands() {
        const host = (window.location && window.location.hostname) || '';
        const proto = (window.location && window.location.protocol) || '';
        const isLocal = proto === 'file:' || host === '127.0.0.1' || host === 'localhost' || host === '::1';
        let role = 'VANPHONG_SALE';
        try {
            const rawUser = localStorage.getItem('PG_HOME_CURRENT_USER') || localStorage.getItem('PG_HOME_ACTIVE_SESSION_V5');
            if (rawUser) {
                const parsed = JSON.parse(rawUser);
                if (parsed && parsed.role) role = parsed.role;
            }
        } catch (_) {}

        return COMMAND_ITEMS.filter(item => {
            if (item.id === 'ccsc' || item.id === 'phan_quyen') {
                return isLocal && role === 'ADMIN';
            }
            if (role === 'VANPHONG_SALE' || role === 'DU_TOAN_SALE') {
                return ['du_toan', 'bac_phat', 'anh_nam', 'cham_cong'].includes(item.id);
            }
            if (role === 'XUONG_VATTU') {
                return ['cham_cong', 'bac_phat', 'anh_nam', 'lam_giang', 'duyet_po', 'zalo_v6'].includes(item.id);
            }
            return true;
        });
    }

    /**
     * Chuyển Tab an toàn trong hệ thống không phá vỡ UI
     */
    const TAB_KEY_MAP = {
        'ccsc': 'tab-ccsc-matrix',
        'tab-ccsc': 'tab-ccsc-matrix',
        'cham_cong': 'tab-cham-cong-all',
        'tab-cham-cong': 'tab-cham-cong-all',
        'bac_phat': 'tab-xuong-san-xuat',
        'tab-project-bac-phat': 'tab-xuong-san-xuat',
        'anh_nam': 'tab-du-toan-du-an',
        'tab-project-anh-nam': 'tab-du-toan-du-an',
        'lam_giang': 'tab-vat-tu-cost',
        'tab-ncc-lam-giang': 'tab-vat-tu-cost',
        'duyet_po': 'tab-phe-duyet-vat-tu',
        'tab-duyet-po': 'tab-phe-duyet-vat-tu',
        'tab-po-approval': 'tab-phe-duyet-vat-tu',
        'zalo_v6': 'tab-phe-duyet-vat-tu',
        'tab-zalo-v6': 'tab-phe-duyet-vat-tu',
        'du_toan': 'tab-du-toan-du-an',
        'tab-du-toan': 'tab-du-toan-du-an',
        'phan_quyen': 'tab-quan-tri-nhan-su',
        'tab-phan-quyen': 'tab-quan-tri-nhan-su'
    };

    function triggerTabSwitch(tabKey, candidateSelectors = []) {
        const resolvedTab = TAB_KEY_MAP[tabKey] || tabKey;
        if (typeof window.switchTabTo === 'function') {
            try { window.switchTabTo(resolvedTab); return true; } catch (e) { console.warn(e); }
        }
        const navEl = document.querySelector(`.nav-item[data-tab="${resolvedTab}"]`);
        if (navEl) {
            navEl.click();
            return true;
        }
        if (typeof window.switchTab === 'function') {
            try { window.switchTab(tabKey); return true; } catch (e) { console.warn(e); }
        }
        if (typeof window.showTab === 'function') {
            try { window.showTab(tabKey); return true; } catch (e) { console.warn(e); }
        }
        if (typeof window.openTab === 'function') {
            try { window.openTab(tabKey); return true; } catch (e) { console.warn(e); }
        }
        if (typeof window.PG_SwitchTab === 'function') {
            try { window.PG_SwitchTab(tabKey); return true; } catch (e) { console.warn(e); }
        }

        const selectorsToTry = [
            `[data-tab="${tabKey}"]`,
            `#${tabKey}`,
            `#tab-${tabKey}`,
            `[data-target="${tabKey}"]`,
            `button[onclick*="${tabKey}"]`,
            `a[href="#${tabKey}"]`,
            ...candidateSelectors.map(s => `#${s}`),
            ...candidateSelectors.map(s => `.${s}`),
            ...candidateSelectors.map(s => `[data-tab="${s}"]`)
        ];

        for (const sel of selectorsToTry) {
            try {
                const el = document.querySelector(sel);
                if (el) {
                    el.click();
                    if (typeof el.focus === 'function') el.focus();
                    return true;
                }
            } catch (_) {}
        }

        const evt = new CustomEvent('pg:navigate-tab', {
            bubbles: true,
            detail: { tab: tabKey, timestamp: Date.now() }
        });
        window.dispatchEvent(evt);
        document.dispatchEvent(evt);

        try { window.location.hash = `#${tabKey}`; } catch (_) {}
        return true;
    }

    /**
     * TÌM KIẾM ĐA THỰC THỂ (GLOBAL ENTITIES SEARCH)
     * Quét xuyên suốt: Tabs/Chức năng, Khách Hàng / Hợp Đồng, Vật Tư Kho Xưởng, Thợ Xưởng & Nhân Sự
     */
    function searchGlobalEntities(rawQuery) {
        const query = removeAccents((rawQuery || '').trim());
        const words = query.split(/\s+/).filter(Boolean);

        const results = [];

        // 1. Quét Tabs và Menu Lệnh Hệ Thống
        const visibleTabs = getVisibleCommands();
        for (const tab of visibleTabs) {
            const haystack = removeAccents(`${tab.title} ${tab.keywords} ${tab.category} ${tab.badge} ${tab.shortcut}`);
            if (words.length === 0 || words.every(w => haystack.includes(w))) {
                results.push({
                    type: 'command',
                    id: tab.id,
                    title: tab.title,
                    subtitle: `${tab.category} • Phím: ${tab.shortcut}`,
                    category: tab.category,
                    badge: tab.badge,
                    shortcut: tab.shortcut,
                    icon: tab.icon || '⚡',
                    action: tab.action
                });
            }
        }

        // 2. Quét Khách Hàng & Hợp Đồng (window.appState?.contracts hoặc fallback)
        const contracts = (window.appState && Array.isArray(window.appState.contracts) && window.appState.contracts.length > 0)
            ? window.appState.contracts
            : FALLBACK_ENTITIES.contracts;

        for (const item of contracts) {
            const name = item.customer || item.title || item.name || '';
            const desc = item.type || item.spec || item.value || '';
            const code = item.id || item.code || '';
            const haystack = removeAccents(`${name} ${desc} ${code} ${item.phone || ''}`);
            if (words.length > 0 && words.every(w => haystack.includes(w))) {
                results.push({
                    type: 'contract',
                    id: `contract-${code || name}`,
                    title: `Khách Hàng: ${name}`,
                    subtitle: `${desc} • Giá trị: ${item.value || 'Đang thực hiện'}`,
                    category: 'HỢP ĐỒNG & KH',
                    badge: 'HỢP ĐỒNG',
                    shortcut: 'ENTER',
                    icon: '📜',
                    action: () => {
                        triggerTabSwitch('du_toan', ['tab-du-toan', 'tab-contracts']);
                        console.log(`[PG_W29] Đã chọn Hợp Đồng / Khách Hàng: ${name}`);
                    }
                });
            }
        }

        // 3. Quét Vật Tư Kho Xưởng (window.appState?.materials hoặc fallback)
        const materials = (window.appState && Array.isArray(window.appState.materials) && window.appState.materials.length > 0)
            ? window.appState.materials
            : FALLBACK_ENTITIES.materials;

        for (const mat of materials) {
            const name = mat.name || mat.title || '';
            const brand = mat.brand || mat.supplier || '';
            const code = mat.code || '';
            const spec = mat.spec || '';
            const haystack = removeAccents(`${name} ${brand} ${code} ${spec}`);
            if (words.length > 0 && words.every(w => haystack.includes(w))) {
                results.push({
                    type: 'material',
                    id: `mat-${code || name}`,
                    title: `Vật Tư: ${name}`,
                    subtitle: `NCC: ${brand} • Đơn giá cost: ${mat.cost || 'N/A'} • ĐVT: ${mat.unit || 'Tấm'}`,
                    category: 'VẬT TƯ & KHO',
                    badge: brand || 'VẬT TƯ',
                    shortcut: 'ENTER',
                    icon: '📦',
                    action: () => {
                        triggerTabSwitch('duyet_po', ['tab-duyet-po', 'tab-materials', 'tab-ncc-lam-giang']);
                        console.log(`[PG_W29] Đã tra cứu vật tư: ${name} (${brand})`);
                    }
                });
            }
        }

        // 4. Quét Thợ Xưởng & Nhân Sự (Hòa, Hào, Vũ, Hiệp, Dũng)
        const staffList = (window.appState && Array.isArray(window.appState.staff) && window.appState.staff.length > 0)
            ? window.appState.staff
            : FALLBACK_ENTITIES.staff;

        for (const st of staffList) {
            const name = st.name || '';
            const role = st.role || '';
            const unit = st.unit || '';
            const haystack = removeAccents(`${name} ${role} ${unit} ${st.fund || ''}`);
            if (words.length > 0 && words.every(w => haystack.includes(w))) {
                results.push({
                    type: 'staff',
                    id: `staff-${name}`,
                    title: `Nhân Sự: ${name}`,
                    subtitle: `${role} (${unit}) • ${st.fund || ''}`,
                    category: 'THỢ & NHÂN SỰ',
                    badge: unit || 'XƯỞNG',
                    shortcut: 'ENTER',
                    icon: '👷',
                    action: () => {
                        triggerTabSwitch('cham_cong', ['tab-cham-cong', 'tab-attendance']);
                        console.log(`[PG_W29] Đã chọn nhân sự: ${name}`);
                    }
                });
            }
        }

        return results;
    }

    /**
     * LỚP QUẢN TRỊ COMMAND PALETTE MODAL
     */
    class CommandPalette {
        constructor() {
            this.isOpen = false;
            this.selectedIndex = 0;
            this.filteredItems = [];
            this.container = null;
            this.inputEl = null;
            this.listEl = null;
            this.boundKeyHandler = this.handleGlobalKeyDown.bind(this);
        }

        injectStyles() {
            if (document.getElementById('pg-w29-palette-styles')) return;
            const style = document.createElement('style');
            style.id = 'pg-w29-palette-styles';
            style.textContent = `
                .pg-palette-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(8, 12, 21, 0.84);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 999999;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 8vh;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.12s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .pg-palette-backdrop.active {
                    opacity: 1;
                    pointer-events: auto;
                }
                .pg-palette-box {
                    width: 92%;
                    max-width: 720px;
                    background: #0E1424;
                    border: 1px solid rgba(212, 175, 55, 0.45);
                    border-radius: 12px;
                    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.75), 0 0 25px rgba(212, 175, 55, 0.18);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transform: translateY(-10px) scale(0.98);
                    transition: transform 0.14s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }
                .pg-palette-backdrop.active .pg-palette-box {
                    transform: translateY(0) scale(1);
                }
                .pg-palette-header {
                    display: flex;
                    align-items: center;
                    padding: 14px 18px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(255, 255, 255, 0.02);
                }
                .pg-palette-search-icon {
                    font-size: 18px;
                    color: #D4AF37;
                    margin-right: 12px;
                    user-select: none;
                }
                .pg-palette-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 16px;
                    color: #F8FAFC;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }
                .pg-palette-input::placeholder {
                    color: #64748B;
                }
                .pg-palette-shortcut-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 3px 8px;
                    background: rgba(212, 175, 55, 0.15);
                    border: 1px solid rgba(212, 175, 55, 0.35);
                    border-radius: 6px;
                    color: #D4AF37;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    user-select: none;
                }
                .pg-palette-list {
                    max-height: 420px;
                    overflow-y: auto;
                    padding: 8px;
                    margin: 0;
                    list-style: none;
                }
                .pg-palette-list::-webkit-scrollbar {
                    width: 6px;
                }
                .pg-palette-list::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.25);
                    border-radius: 3px;
                }
                .pg-palette-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.08s ease, transform 0.08s ease;
                    color: #E2E8F0;
                }
                .pg-palette-item.selected {
                    background: rgba(212, 175, 55, 0.18);
                    border-left: 3px solid #D4AF37;
                    color: #FFFFFF;
                }
                .pg-palette-item-icon {
                    font-size: 20px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.04);
                    flex-shrink: 0;
                }
                .pg-palette-item-content {
                    flex: 1;
                    min-width: 0;
                }
                .pg-palette-item-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #F1F5F9;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .pg-palette-item-subtitle {
                    font-size: 12px;
                    color: #94A3B8;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-top: 2px;
                }
                .pg-palette-item-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 3px;
                }
                .pg-palette-item-cat {
                    font-size: 11px;
                    color: #94A3B8;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                }
                .pg-palette-item-badge {
                    font-size: 10px;
                    padding: 1px 6px;
                    border-radius: 4px;
                    background: rgba(212, 175, 55, 0.2);
                    color: #E6CA65;
                    font-weight: 600;
                }
                .pg-palette-item-shortcut {
                    font-size: 11px;
                    color: #64748B;
                    padding: 2px 6px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 4px;
                    font-family: monospace;
                    margin-left: 10px;
                    flex-shrink: 0;
                }
                .pg-palette-empty {
                    padding: 28px;
                    text-align: center;
                    color: #64748B;
                    font-size: 13px;
                }
                .pg-palette-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 16px;
                    background: rgba(0, 0, 0, 0.25);
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    font-size: 11px;
                    color: #64748B;
                    user-select: none;
                }
                .pg-palette-footer-keys span {
                    display: inline-block;
                    padding: 1px 5px;
                    background: rgba(255, 255, 255, 0.06);
                    border-radius: 3px;
                    color: #94A3B8;
                    margin: 0 2px;
                    font-family: monospace;
                }

                /* Mobile Bottom QuickBar CSS */
                #pg-mobile-quickbar {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100vw;
                    height: 56px;
                    background: rgba(14, 20, 36, 0.96);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-top: 1px solid rgba(212, 175, 55, 0.35);
                    z-index: 99998;
                    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.5);
                    justify-content: space-around;
                    align-items: center;
                    padding: 0 8px;
                    box-sizing: border-box;
                }
                @media (max-width: 768px) {
                    #pg-mobile-quickbar {
                        display: flex;
                    }
                    body.pg-has-mobile-bar {
                        padding-bottom: 64px !important;
                    }
                }
                .pg-quickbar-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    color: #CBD5E1;
                    font-size: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 4px 10px;
                    border-radius: 6px;
                    transition: color 0.15s, transform 0.1s;
                }
                .pg-quickbar-btn:active {
                    transform: scale(0.95);
                    color: #D4AF37;
                }
                .pg-quickbar-btn span.icon {
                    font-size: 17px;
                    margin-bottom: 2px;
                }

                /* Zen Focus Mode CSS */
                body.pg-zen-mode #mainSidebar,
                body.pg-zen-mode aside,
                body.pg-zen-mode .pg-sidebar {
                    transform: translateX(-100%);
                    transition: transform 0.25s ease;
                    position: absolute !important;
                }
                body.pg-zen-mode main,
                body.pg-zen-mode #mainContent,
                body.pg-zen-mode .pg-main-wrapper {
                    margin-left: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    transition: all 0.25s ease;
                }
                .pg-zen-exit-btn {
                    display: none;
                    position: fixed;
                    top: 12px;
                    right: 18px;
                    z-index: 99999;
                    background: rgba(212, 175, 55, 0.2);
                    border: 1px solid #D4AF37;
                    color: #D4AF37;
                    border-radius: 8px;
                    padding: 6px 14px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                }
                body.pg-zen-mode .pg-zen-exit-btn {
                    display: block;
                }

                /* Undo Toast CSS */
                #pg-undo-toast-container {
                    position: fixed;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000000;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    pointer-events: none;
                }
                .pg-undo-toast {
                    pointer-events: auto;
                    min-width: 320px;
                    max-width: 520px;
                    background: #111827;
                    border: 1px solid rgba(212, 175, 55, 0.5);
                    border-radius: 8px;
                    padding: 10px 16px;
                    color: #F3F4F6;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    animation: pgToastIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                    font-size: 13px;
                }
                .pg-undo-toast-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: #D4AF37;
                    width: 100%;
                    transition: width linear;
                }
                .pg-undo-btn {
                    background: rgba(212, 175, 55, 0.25);
                    border: 1px solid #D4AF37;
                    color: #FBBF24;
                    font-weight: 700;
                    border-radius: 4px;
                    padding: 4px 10px;
                    font-size: 12px;
                    cursor: pointer;
                }
                .pg-undo-btn:hover {
                    background: #D4AF37;
                    color: #111827;
                }
                @keyframes pgToastIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        buildDOM() {
            if (this.container) return;

            const backdrop = document.createElement('div');
            backdrop.className = 'pg-palette-backdrop';
            backdrop.id = 'pg-command-palette-modal';

            backdrop.innerHTML = `
                <div class="pg-palette-box" role="dialog" aria-modal="true" aria-label="Command Palette">
                    <div class="pg-palette-header">
                        <span class="pg-palette-search-icon">⚡</span>
                        <input type="text" class="pg-palette-input" placeholder="Tìm Tab, Khách Hàng (Bác Phát, Anh Nam), Vật Tư (MDF, Hafele), Thợ (Hòa, Hào)..." autocomplete="off" spellcheck="false">
                        <span class="pg-palette-shortcut-badge">ESC để đóng</span>
                    </div>
                    <ul class="pg-palette-list" role="listbox"></ul>
                    <div class="pg-palette-footer">
                        <div><strong>PG Home Command Palette</strong> • Phản hồi: <span style="color:#10B981;">0.1s</span></div>
                        <div class="pg-palette-footer-keys">
                            <span>↑</span> <span>↓</span> di chuyển • <span>ENTER</span> chọn • <span>CTRL+K</span> bật/tắt
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(backdrop);
            this.container = backdrop;
            this.inputEl = backdrop.querySelector('.pg-palette-input');
            this.listEl = backdrop.querySelector('.pg-palette-list');

            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.close();
            });

            this.inputEl.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            this.inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.moveSelection(1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.moveSelection(-1);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeSelected();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.close();
                }
            });
        }

        handleGlobalKeyDown(e) {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                this.toggle();
            }
        }

        handleSearch(rawQuery) {
            this.filteredItems = searchGlobalEntities(rawQuery);
            this.selectedIndex = 0;
            this.renderList();
        }

        renderList() {
            if (!this.listEl) return;

            if (this.filteredItems.length === 0) {
                this.listEl.innerHTML = `
                    <div class="pg-palette-empty">
                        Không tìm thấy lệnh, khách hàng, vật tư hay thợ nào phù hợp. Hãy thử từ khóa khác!
                    </div>
                `;
                return;
            }

            this.listEl.innerHTML = this.filteredItems.map((item, idx) => {
                const isSelected = idx === this.selectedIndex;
                return `
                    <li class="pg-palette-item ${isSelected ? 'selected' : ''}" data-index="${idx}" role="option" aria-selected="${isSelected}">
                        <div class="pg-palette-item-icon">${item.icon}</div>
                        <div class="pg-palette-item-content">
                            <div class="pg-palette-item-title">${item.title}</div>
                            ${item.subtitle ? `<div class="pg-palette-item-subtitle">${item.subtitle}</div>` : ''}
                            <div class="pg-palette-item-meta">
                                <span class="pg-palette-item-cat">${item.category}</span>
                                <span class="pg-palette-item-badge">${item.badge}</span>
                            </div>
                        </div>
                        <div class="pg-palette-item-shortcut">${item.shortcut}</div>
                    </li>
                `;
            }).join('');

            const itemEls = this.listEl.querySelectorAll('.pg-palette-item');
            itemEls.forEach(el => {
                el.addEventListener('click', () => {
                    const idx = parseInt(el.getAttribute('data-index'), 10);
                    this.selectedIndex = idx;
                    this.executeSelected();
                });
                el.addEventListener('mouseenter', () => {
                    const idx = parseInt(el.getAttribute('data-index'), 10);
                    this.setSelectedIndex(idx, false);
                });
            });

            this.scrollSelectedIntoView();
        }

        setSelectedIndex(index, shouldScroll = true) {
            this.selectedIndex = Math.max(0, Math.min(index, this.filteredItems.length - 1));
            const itemEls = this.listEl.querySelectorAll('.pg-palette-item');
            itemEls.forEach((el, idx) => {
                if (idx === this.selectedIndex) {
                    el.classList.add('selected');
                    el.setAttribute('aria-selected', 'true');
                } else {
                    el.classList.remove('selected');
                    el.setAttribute('aria-selected', 'false');
                }
            });
            if (shouldScroll) {
                this.scrollSelectedIntoView();
            }
        }

        moveSelection(delta) {
            if (this.filteredItems.length === 0) return;
            let next = this.selectedIndex + delta;
            if (next < 0) next = this.filteredItems.length - 1;
            if (next >= this.filteredItems.length) next = 0;
            this.setSelectedIndex(next, true);
        }

        scrollSelectedIntoView() {
            const selectedEl = this.listEl.querySelector('.pg-palette-item.selected');
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest', behavior: 'auto' });
            }
        }

        executeSelected() {
            const item = this.filteredItems[this.selectedIndex];
            if (!item) return;

            const t0 = performance.now();
            try {
                if (typeof item.action === 'function') {
                    item.action();
                }
            } catch (err) {
                console.error('[PG_CommandPalette] Lỗi khi thực thi lệnh:', err);
            }
            const t1 = performance.now();
            console.log(`[PG_CommandPalette] Đã nhảy tới [${item.title}] trong ${(t1 - t0).toFixed(2)}ms`);

            this.close();
        }

        open() {
            this.injectStyles();
            this.buildDOM();
            this.isOpen = true;
            this.container.classList.add('active');
            this.inputEl.value = '';
            this.handleSearch('');
            setTimeout(() => {
                this.inputEl.focus();
                this.inputEl.select();
            }, 20);
        }

        close() {
            if (!this.isOpen) return;
            this.isOpen = false;
            if (this.container) {
                this.container.classList.remove('active');
            }
            if (this.inputEl) {
                this.inputEl.blur();
            }
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        init() {
            this.injectStyles();
            this.buildDOM();
            window.removeEventListener('keydown', this.boundKeyHandler);
            window.addEventListener('keydown', this.boundKeyHandler);
            initMobileBottomQuickBar();
            console.log('[PG_Modules_W29] Command Palette (Ctrl+K) đã sẵn sàng hoạt động.');
        }

        registerCommand(command) {
            if (!command || !command.id || !command.title) return;
            COMMAND_ITEMS.push(command);
            if (this.isOpen) {
                this.handleSearch(this.inputEl.value || '');
            }
        }
    }

    /**
     * ========================================================================
     * CÁC HÀM TIỆN ÍCH UX V30 BỔ SUNG GẮN VÀO WINDOW.PG_W29
     * ========================================================================
     */

    /**
     * Cải tiến #16: cloneProjectTemplate(sourceProject)
     * Nhân bản nhanh dự án mẫu (sao chép phòng & hạng mục để lập dự toán mới trong 1 chạm)
     */
    function cloneProjectTemplate(sourceProject) {
        let base = sourceProject;
        if (!base) {
            if (window.appState && window.appState.currentProject) {
                base = window.appState.currentProject;
            } else {
                base = {
                    id: 'DU_AN_MAU_CHUAN',
                    name: 'Dự Án Mẫu Nhà Phố Hiện Đại',
                    customer: 'Khách Hàng Mới',
                    rooms: [
                        { name: 'Phòng Bếp', items: [{ name: 'Tủ Bếp Dưới R09 (Sâu 600)', unit: 'md', qty: 3.8, rate: 1.45 }] },
                        { name: 'Phòng Ngủ Master', items: [{ name: 'Tủ Áo Kịch Trần R27', unit: 'm2', qty: 12.5, rate: 1.05 }] },
                        { name: 'Phòng Khách', items: [{ name: 'Kệ Tivi Treo Bo Góc R04', unit: 'md', qty: 2.4, rate: 0.6 }] }
                    ]
                };
            }
        }

        const cloneId = 'PRJ_' + Date.now().toString(36).toUpperCase();
        const cloned = JSON.parse(JSON.stringify(base));
        cloned.id = cloneId;
        cloned.name = `${cloned.name || 'Dự Án'} (Bản Sao Mới)`;
        cloned.createdAt = new Date().toISOString();
        cloned.clonedFrom = base.id || 'N/A';

        if (window.appState) {
            if (!Array.isArray(window.appState.projects)) {
                window.appState.projects = [];
            }
            window.appState.projects.push(cloned);
            window.appState.currentProject = cloned;
        }

        try {
            localStorage.setItem('PG_HOME_LAST_CLONED_PRJ', JSON.stringify(cloned));
        } catch (_) {}

        const evt = new CustomEvent('pg:project-cloned', {
            bubbles: true,
            detail: { project: cloned, timestamp: Date.now() }
        });
        window.dispatchEvent(evt);

        showUndoToast(`Đã nhân bản mẫu "${cloned.name}" thành công!`, () => {
            if (window.appState && Array.isArray(window.appState.projects)) {
                window.appState.projects = window.appState.projects.filter(p => p.id !== cloneId);
            }
            console.log(`[PG_W29] Đã hoàn tác nhân bản dự án ${cloneId}`);
        }, 8000);

        return cloned;
    }

    /**
     * Cải tiến #14: bulkCheckInWorkshop8h(dateKey)
     * Điểm danh nhanh 1 chạm cả xưởng đủ 8h hành chính
     */
    function bulkCheckInWorkshop8h(dateKey) {
        const todayStr = dateKey || new Date().toISOString().slice(0, 10);
        const workshopStaff = [
            { id: 'NV_HOA', name: 'Nguyễn Văn Hòa', role: 'Thợ Chính', hours: 8, ot: 0, status: 'PRESENT' },
            { id: 'NV_HAO', name: 'Trần Văn Hào', role: 'Thợ Phụ', hours: 8, ot: 0, status: 'PRESENT' },
            { id: 'HV_VU', name: 'Hoàng Văn Vũ', role: 'Kỹ Thuật Xưởng', hours: 8, ot: 0, status: 'PRESENT' }
        ];

        const record = {
            date: todayStr,
            updatedAt: new Date().toISOString(),
            byUser: 'QUAN_LY_XUONG',
            staff: workshopStaff
        };

        if (window.appState) {
            if (!window.appState.attendance) window.appState.attendance = {};
            window.appState.attendance[todayStr] = record;
        }

        try {
            localStorage.setItem(`PG_ATTENDANCE_${todayStr}`, JSON.stringify(record));
        } catch (_) {}

        const evt = new CustomEvent('pg:attendance-updated', {
            bubbles: true,
            detail: { date: todayStr, record: record }
        });
        window.dispatchEvent(evt);

        showUndoToast(`Đã điểm danh 8h cho toàn bộ thợ xưởng (${todayStr})`, () => {
            if (window.appState && window.appState.attendance) {
                delete window.appState.attendance[todayStr];
            }
            localStorage.removeItem(`PG_ATTENDANCE_${todayStr}`);
            console.log(`[PG_W29] Đã hoàn tác điểm danh ngày ${todayStr}`);
        }, 8000);

        return record;
    }

    /**
     * Cải tiến #18: showUndoToast(message, undoCallback, timeoutMs = 8000)
     * Thanh thông báo hoàn tác 8 giây khi xóa dòng/vật tư
     */
    function showUndoToast(message, undoCallback, timeoutMs = 8000) {
        let container = document.getElementById('pg-undo-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'pg-undo-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'pg-undo-toast';
        toast.innerHTML = `
            <span>${message}</span>
            <button type="button" class="pg-undo-btn">Hoàn Tác (8s)</button>
            <div class="pg-undo-toast-progress"></div>
        `;

        container.appendChild(toast);

        const progressBar = toast.querySelector('.pg-undo-toast-progress');
        const undoBtn = toast.querySelector('.pg-undo-btn');

        // Bắt đầu thanh chạy lùi
        setTimeout(() => {
            if (progressBar) {
                progressBar.style.transition = `width ${timeoutMs}ms linear`;
                progressBar.style.width = '0%';
            }
        }, 20);

        let isUndone = false;
        const timer = setTimeout(() => {
            if (!isUndone) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(12px)';
                setTimeout(() => toast.remove(), 200);
            }
        }, timeoutMs);

        undoBtn.addEventListener('click', () => {
            isUndone = true;
            clearTimeout(timer);
            toast.remove();
            if (typeof undoCallback === 'function') {
                try { undoCallback(); } catch (e) { console.error(e); }
            }
        });

        return {
            dismiss: () => {
                clearTimeout(timer);
                toast.remove();
            },
            undo: () => {
                undoBtn.click();
            }
        };
    }

    /**
     * Cải tiến #19: toggleZenFocusMode()
     * Bật/tắt chế độ Zen Focus thu gọn menu bên để mở rộng không gian bảng dự toán
     */
    function toggleZenFocusMode() {
        const isZen = document.body.classList.toggle('pg-zen-mode');

        let exitBtn = document.getElementById('pg-zen-exit-button');
        if (isZen && !exitBtn) {
            exitBtn = document.createElement('button');
            exitBtn.id = 'pg-zen-exit-button';
            exitBtn.className = 'pg-zen-exit-btn';
            exitBtn.innerHTML = '✕ Thoát Zen Focus';
            exitBtn.title = 'Bấm để hiển thị lại thanh điều hướng (hoặc Esc)';
            exitBtn.addEventListener('click', () => toggleZenFocusMode());
            document.body.appendChild(exitBtn);
        }

        const evt = new CustomEvent('pg:zen-mode-changed', {
            bubbles: true,
            detail: { isZen: isZen }
        });
        window.dispatchEvent(evt);

        console.log(`[PG_W29] Chế độ Zen Focus: ${isZen ? 'BẬT' : 'TẮT'}`);
        return isZen;
    }

    /**
     * Cải tiến #20: initMobileBottomQuickBar()
     * Khởi tạo thanh công cụ nhanh dưới đáy màn hình cho điện thoại <= 768px
     */
    function initMobileBottomQuickBar() {
        if (document.getElementById('pg-mobile-quickbar')) return;

        document.body.classList.add('pg-has-mobile-bar');

        const bar = document.createElement('nav');
        bar.id = 'pg-mobile-quickbar';
        bar.setAttribute('aria-label', 'Mobile Quick Navigation');

        bar.innerHTML = `
            <button type="button" class="pg-quickbar-btn" id="pg-mqb-project">
                <span class="icon">📁</span>
                <span>Dự Án</span>
            </button>
            <button type="button" class="pg-quickbar-btn" id="pg-mqb-approval">
                <span class="icon">🔴</span>
                <span>Duyệt PO</span>
            </button>
            <button type="button" class="pg-quickbar-btn" id="pg-mqb-attendance">
                <span class="icon">⏱️</span>
                <span>Chấm Công</span>
            </button>
            <button type="button" class="pg-quickbar-btn" id="pg-mqb-palette">
                <span class="icon">⚡</span>
                <span>Ctrl+K</span>
            </button>
        `;

        document.body.appendChild(bar);

        // Gắn sự kiện chuyển tab
        bar.querySelector('#pg-mqb-project').addEventListener('click', () => triggerTabSwitch('du_toan', ['tab-du-toan', 'nav-sales']));
        bar.querySelector('#pg-mqb-approval').addEventListener('click', () => triggerTabSwitch('duyet_po', ['tab-duyet-po', 'nav-approval']));
        bar.querySelector('#pg-mqb-attendance').addEventListener('click', () => triggerTabSwitch('cham_cong', ['tab-cham-cong', 'nav-cham-cong']));
        bar.querySelector('#pg-mqb-palette').addEventListener('click', () => instance.toggle());
    }

    const instance = new CommandPalette();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => instance.init());
    } else {
        instance.init();
    }

    // ĐỐI TƯỢNG TOÀN CỤC CHÍNH THỨC
    const PG_W29_EXPORT = {
        version: '2.0.0',
        author: 'Flash Worker W29 - PG Home Luxury',
        instance: instance,
        open: () => instance.open(),
        close: () => instance.close(),
        toggle: () => instance.toggle(),
        registerCommand: (cmd) => instance.registerCommand(cmd),
        navigateTab: triggerTabSwitch,
        getCommands: () => [...COMMAND_ITEMS],
        searchGlobalEntities: searchGlobalEntities,
        cloneProjectTemplate: cloneProjectTemplate,
        bulkCheckInWorkshop8h: bulkCheckInWorkshop8h,
        showUndoToast: showUndoToast,
        toggleZenFocusMode: toggleZenFocusMode,
        initMobileBottomQuickBar: initMobileBottomQuickBar
    };

    // Export đồng thời cả PG_Modules_W29 và PG_W29 để tương thích 100%
    window.PG_Modules_W29 = PG_W29_EXPORT;
    window.PG_W29 = PG_W29_EXPORT;

})(window, document);
