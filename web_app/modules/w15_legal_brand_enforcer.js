/**
 * =========================================================================================
 * MODULE W15: PG HOME LEGAL & BRAND DISCIPLINE ENFORCER (BẢO VỆ PHÁP LÝ & THƯƠNG HIỆU)
 * HỆ THỐNG QUẢN TRỊ NỘI THẤT & XÂY DỰNG PHÚ GIA - PG HOME LUXURY
 * =========================================================================================
 * Tuân thủ Hiến pháp Kỷ luật Thép & Luật Sắt Nội bộ PG Home.
 * Tự động quét, cưỡng chế và làm sạch 100% dữ liệu pháp lý & thương hiệu trên DOM,
 * Hợp đồng, Báo giá, In ấn (Print/PDF) và các biểu mẫu xuất bản.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PG_Modules_W15 = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // 1. CHUẨN PHÁP LÝ & THƯƠNG HIỆU PHÚ GIA (BẤT KHẢ XÂM PHẠM)
    const LEGAL_STANDARD = Object.freeze({
        ENTITY_NAME: "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
        BRAND_COMPANY_NAME: "CÔNG TY CP PHÚ GIA VIỆT NAM",
        OFFICIAL_TRADE_NAME: "PG HOME LUXURY",
        BUSINESS_CODE: "042203002931",
        TAX_CODE: "042203002931",
        REGISTRATION_DATE: "13/01/2025",
        LEGAL_REPRESENTATIVE: "Nguyễn Trọng Nghĩa",
        REGISTERED_ADDRESS: "Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh",
        TRADE_ADDRESS: "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
        FACTORY_FACILITY_TITLE: "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia",
        HOTLINE: "0986.722.324",
        HOTLINE_NUMERIC: "0986722324",
        EMAIL_OFFICIAL: "noithatphugiahatinh@gmail.com"
    });

    // 2. DANH MỤC CÁC MẪU DỮ LIỆU SAI LỆCH / VI PHẠM CẦN TRIỆT TIÊU
    const VIOLATIONS_CONFIG = [
        // Địa chỉ sai, địa chỉ cũ, địa chỉ bịa đặt
        {
            name: "Địa chỉ cũ Ngô Đức Kế",
            regex: /(?:Số\s*)?35\s*(?:đường\s*)?Ngô\s*Đức\s*Kế(?:[,\s\w\.\-]+Hà\s*Tĩnh)?/gi,
            replacement: LEGAL_STANDARD.TRADE_ADDRESS
        },
        {
            name: "Địa chỉ bịa đặt đường Hàm Nghi",
            regex: /(?:đường|phố|ngõ)\s*Hàm\s*Nghi(?:[,\s\w\.\-]+Hà\s*Tĩnh)?/gi,
            replacement: LEGAL_STANDARD.TRADE_ADDRESS
        },
        {
            name: "Lỗi chính tả Trương Quốc Dung (thiếu dấu Ứ)",
            regex: /Trương\s*Quốc\s*Dung/gi,
            replacement: "Trương Quốc Dụng"
        },
        // Danh xưng cấm "xưởng mộc"
        {
            name: "Danh xưng hạ cấp Xưởng mộc",
            regex: /(?:xưởng\s*mộc\s*Phú\s*Gia|xưởng\s*mộc)/gi,
            replacement: LEGAL_STANDARD.FACTORY_FACILITY_TITLE
        },
        // Số điện thoại rác / sai / cũ / bịa đặt
        {
            name: "Hotline rác 0912.345.678",
            regex: /0912[\.\s\-]?345[\.\s\-]?678/g,
            replacement: LEGAL_STANDARD.HOTLINE
        },
        {
            name: "Hotline rác 0988.888.999",
            regex: /0988[\.\s\-]?888[\.\s\-]?999/g,
            replacement: LEGAL_STANDARD.HOTLINE
        },
        {
            name: "Hotline bịa đặt 0973.562.789",
            regex: /0973[\.\s\-]?562[\.\s\-]?789/g,
            replacement: LEGAL_STANDARD.HOTLINE
        },
        {
            name: "Hotline rác 0868.448.625",
            regex: /0868[\.\s\-]?448[\.\s\-]?625/g,
            replacement: LEGAL_STANDARD.HOTLINE
        },
        {
            name: "Hotline rác 096 832 99 92",
            regex: /096[\.\s\-]?832[\.\s\-]?99[\.\s\-]?92/g,
            replacement: LEGAL_STANDARD.HOTLINE
        },
        {
            name: "Hotline rác 09xx.xxx.xxx",
            regex: /09[xX]{2}[\.\s\-]?[xX]{3}[\.\s\-]?[xX]{3}/g,
            replacement: LEGAL_STANDARD.HOTLINE
        },
        // Mã số thuế giả
        {
            name: "Mã số thuế giả Vĩnh Phúc 2500732386",
            regex: /2500732386/g,
            replacement: LEGAL_STANDARD.TAX_CODE
        },
        {
            name: "Mã số thuế giả 3002228888",
            regex: /3002228888/g,
            replacement: LEGAL_STANDARD.TAX_CODE
        }
    ];

    /**
     * Hàm làm sạch chuỗi văn bản thuần
     * @param {string} text 
     * @returns {string} Text sau khi cưỡng chế chuẩn
     */
    function cleanseText(text) {
        if (typeof text !== 'string' || !text) return text;
        let result = text;
        for (let i = 0; i < VIOLATIONS_CONFIG.length; i++) {
            const rule = VIOLATIONS_CONFIG[i];
            result = result.replace(rule.regex, rule.replacement);
        }
        return result;
    }

    /**
     * Kiểm toán (Audit) văn bản hoặc node
     * @param {string|Node} input 
     * @returns {Array<object>} Danh sách các điểm vi phạm phát hiện
     */
    function audit(input) {
        let content = "";
        if (typeof input === 'string') {
            content = input;
        } else if (input && input.innerText) {
            content = input.innerText;
        } else if (typeof document !== 'undefined') {
            content = document.body ? document.body.innerText : "";
        }

        const violations = [];
        for (let i = 0; i < VIOLATIONS_CONFIG.length; i++) {
            const rule = VIOLATIONS_CONFIG[i];
            const matches = content.match(rule.regex);
            if (matches && matches.length > 0) {
                violations.push({
                    rule: rule.name,
                    count: matches.length,
                    samples: matches.slice(0, 3)
                });
            }
        }
        return violations;
    }

    /**
     * Cưỡng chế chuẩn hóa trên một Node DOM (đệ quy các Text Nodes & Form Controls)
     * @param {Node} rootNode 
     */
    function enforceDOM(rootNode) {
        const target = rootNode || (typeof document !== 'undefined' ? document.body : null);
        if (!target) return;

        // 1. Quét các thẻ Form Input & Textarea
        if (target.querySelectorAll) {
            const inputs = target.querySelectorAll('input[type="text"], textarea');
            inputs.forEach(input => {
                if (input.value) {
                    const cleaned = cleanseText(input.value);
                    if (cleaned !== input.value) {
                        input.value = cleaned;
                    }
                }
            });
        }

        // 2. Quét TreeWalker duyệt Text Nodes
        if (typeof document !== 'undefined' && document.createTreeWalker) {
            const walker = document.createTreeWalker(
                target,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        if (!node.nodeValue || !node.nodeValue.trim()) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        const parent = node.parentElement;
                        if (parent) {
                            const tag = parent.tagName;
                            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
                                return NodeFilter.FILTER_REJECT;
                            }
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );

            let currentNode;
            const nodesToUpdate = [];
            while (currentNode = walker.nextNode()) {
                nodesToUpdate.push(currentNode);
            }

            for (let i = 0; i < nodesToUpdate.length; i++) {
                const node = nodesToUpdate[i];
                const original = node.nodeValue;
                const cleaned = cleanseText(original);
                if (cleaned !== original) {
                    node.nodeValue = cleaned;
                }
            }
        }
    }

    /**
     * Chuẩn hóa khung in Báo Giá / Hợp Đồng trước khi Export PDF hoặc Print
     * @param {HTMLElement} containerElement 
     */
    function enforcePrintContract(containerElement) {
        const container = containerElement || (typeof document !== 'undefined' ? document.querySelector('.print-area, .contract-print-area, #printSection, body') : null);
        if (!container) return;

        // Cưỡng chế nội dung văn bản bên trong
        enforceDOM(container);

        // Khóa chặt các block metadata đại diện pháp nhân
        const legalHeaders = container.querySelectorAll('.legal-company-name, [data-legal="entity_name"]');
        legalHeaders.forEach(el => { el.textContent = LEGAL_STANDARD.ENTITY_NAME; });

        const mstElements = container.querySelectorAll('.legal-tax-code, [data-legal="tax_code"]');
        mstElements.forEach(el => { el.textContent = LEGAL_STANDARD.TAX_CODE; });

        const addressElements = container.querySelectorAll('.legal-address, [data-legal="trade_address"]');
        addressElements.forEach(el => { el.textContent = LEGAL_STANDARD.TRADE_ADDRESS; });

        const hotlineElements = container.querySelectorAll('.legal-hotline, [data-legal="hotline"]');
        hotlineElements.forEach(el => { el.textContent = LEGAL_STANDARD.HOTLINE; });

        const repElements = container.querySelectorAll('.legal-rep, [data-legal="representative"]');
        repElements.forEach(el => { el.textContent = LEGAL_STANDARD.LEGAL_REPRESENTATIVE; });
    }

    /**
     * Thiết lập MutationObserver để tự động bảo vệ thời gian thực
     */
    let observerInstance = null;
    function initAutoObserver() {
        if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return;
        if (observerInstance) return; // Đã chạy

        let debounceTimer = null;
        observerInstance = new MutationObserver(function (mutations) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                enforceDOM(document.body);
            }, 100);
        });

        if (document.body) {
            observerInstance.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
            // Chạy quét ngay lần đầu
            enforceDOM(document.body);
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                initAutoObserver();
            });
        }
    }

    /**
     * Chặn và bảo vệ sự kiện in trình duyệt (window.print)
     */
    function interceptWindowPrint() {
        if (typeof window === 'undefined') return;
        const originalPrint = window.print;
        window.print = function () {
            try {
                enforceDOM(document.body);
                enforcePrintContract(document.body);
            } catch (e) {
                console.error("[PG_Modules_W15] Pre-print enforcement error:", e);
            }
            return originalPrint.apply(window, arguments);
        };
        window.addEventListener('beforeprint', function () {
            enforceDOM(document.body);
            enforcePrintContract(document.body);
        });
    }

    // Tự động kích hoạt khi được nạp vào trình duyệt
    if (typeof window !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                enforceDOM(document.body);
                interceptWindowPrint();
                initAutoObserver();
            });
        } else {
            enforceDOM(document.body);
            interceptWindowPrint();
            initAutoObserver();
        }
    }

    // Public API
    return {
        LEGAL_STANDARD: LEGAL_STANDARD,
        cleanseText: cleanseText,
        audit: audit,
        enforceDOM: enforceDOM,
        enforcePrintContract: enforcePrintContract,
        initAutoObserver: initAutoObserver,
        interceptWindowPrint: interceptWindowPrint
    };
}));
