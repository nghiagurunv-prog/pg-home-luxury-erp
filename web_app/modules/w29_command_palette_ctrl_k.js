/**
 * ============================================================================
 * HỆ THỐNG QUẢN TRỊ & VẬN HÀNH PG HOME LUXURY 2026
 * MODULE W29: COMMAND PALETTE (CTRL + K) ĐIỀU KHIỂN NHANH 0.1 GIÂY
 * Tác giả: Công nhân Flash W29 (Kiến trúc phân hệ Web App PG Home)
 * Bản quyền: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * ============================================================================
 */

(function (window, document) {
    'use strict';

    if (window.PG_Modules_W29) {
        return; // Đã khởi tạo trước đó
    }

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

    function removeAccents(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'd');
    }

    function triggerTabSwitch(tabKey, candidateSelectors) {
        // 1. Thử gọi hàm toàn cục nếu có sẵn
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

        // 2. Tìm selector trên DOM theo data-tab, id hoặc class
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
            } catch (err) {
                // bỏ qua selector không hợp lệ
            }
        }

        // 3. Dispatch Custom Event để các module khác đón nhận
        const evt = new CustomEvent('pg:navigate-tab', {
            bubbles: true,
            detail: { tab: tabKey, timestamp: Date.now() }
        });
        window.dispatchEvent(evt);
        document.dispatchEvent(evt);

        // 4. Cập nhật hash url
        try {
            window.location.hash = `#${tabKey}`;
        } catch (_) {}

        return true;
    }

    class CommandPalette {
        constructor() {
            this.isOpen = false;
            this.selectedIndex = 0;
            this.filteredItems = [...COMMAND_ITEMS];
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
                    background: rgba(8, 12, 21, 0.82);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 999999;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 10vh;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.1s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .pg-palette-backdrop.active {
                    opacity: 1;
                    pointer-events: auto;
                }
                .pg-palette-box {
                    width: 90%;
                    max-width: 680px;
                    background: #0E1424;
                    border: 1px solid rgba(212, 175, 55, 0.45);
                    border-radius: 12px;
                    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 175, 55, 0.15);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transform: translateY(-8px) scale(0.98);
                    transition: transform 0.12s cubic-bezier(0.16, 1, 0.3, 1);
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
                    max-height: 380px;
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
                    background: rgba(212, 175, 55, 0.16);
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
                        <input type="text" class="pg-palette-input" placeholder="Gõ lệnh hoặc chọn tab cần nhảy tức thời..." autocomplete="off" spellcheck="false">
                        <span class="pg-palette-shortcut-badge">ESC để đóng</span>
                    </div>
                    <ul class="pg-palette-list" role="listbox"></ul>
                    <div class="pg-palette-footer">
                        <div><strong>PG Home Command Palette</strong> • Tốc độ: <span style="color:#10B981;">0.1s</span></div>
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

            // Event Listeners bên trong modal
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.close();
                }
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
            // Hỗ trợ cả Ctrl+K lẫn Cmd+K (macOS)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                this.toggle();
            }
        }

        handleSearch(rawQuery) {
            const query = removeAccents(rawQuery.trim());
            if (!query) {
                this.filteredItems = [...COMMAND_ITEMS];
            } else {
                const words = query.split(/\s+/).filter(Boolean);
                this.filteredItems = COMMAND_ITEMS.filter(item => {
                    const haystack = removeAccents(`${item.title} ${item.keywords} ${item.category} ${item.badge} ${item.shortcut}`);
                    return words.every(word => haystack.includes(word));
                });
            }
            this.selectedIndex = 0;
            this.renderList();
        }

        renderList() {
            if (!this.listEl) return;

            if (this.filteredItems.length === 0) {
                this.listEl.innerHTML = `
                    <div class="pg-palette-empty">
                        Không tìm thấy tab hoặc lệnh nào phù hợp. Hãy thử từ khóa khác!
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
                            <div class="pg-palette-item-meta">
                                <span class="pg-palette-item-cat">${item.category}</span>
                                <span class="pg-palette-item-badge">${item.badge}</span>
                            </div>
                        </div>
                        <div class="pg-palette-item-shortcut">${item.shortcut}</div>
                    </li>
                `;
            }).join('');

            // Click vào từng item
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

    const instance = new CommandPalette();

    // Tự động khởi tạo khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => instance.init());
    } else {
        instance.init();
    }

    // Đăng ký toàn cục
    window.PG_Modules_W29 = {
        version: '1.0.0',
        author: 'Flash Worker W29 - PG Home Luxury',
        instance: instance,
        open: () => instance.open(),
        close: () => instance.close(),
        toggle: () => instance.toggle(),
        registerCommand: (cmd) => instance.registerCommand(cmd),
        navigateTab: triggerTabSwitch,
        getCommands: () => [...COMMAND_ITEMS]
    };

})(window, document);
