/**
 * ==============================================================================================
 * HỆ THỐNG QUẢN TRỊ & DỰ TOÁN SẢN XUẤT PG HOME LUXURY - PHÚ GIA NỘI THẤT
 * MODULE W32: BẢNG TRA CỨU ĐỊNH MỨC TẤM CẮT CNC THỰC CHIẾN (8 HẠNG MỤC CHUẨN MỤC 24 GEMINI.MD)
 * ==============================================================================================
 * Chuẩn hóa vĩnh viễn theo chỉ đạo của Giám Đốc Nguyễn Viết Nghĩa (Từ công trình thực tế Nhà Anh Nam 06/11/2026).
 * Quy cách khổ ván chuẩn: 1220mm x 2440mm = 2.9768 m2 / tấm.
 * Đơn vị pháp lý: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931).
 * Tổ hợp VP & Xưởng: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh. Hotline: 0986.722.324.
 * ==============================================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PG_Modules_W32 = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // THÔNG SỐ VÁN TIÊU CHUẨN
    const SHEET_SPECS = {
        WIDTH_MM: 1220,
        LENGTH_MM: 2440,
        AREA_M2: 2.9768, // 1.22 * 2.44
        STANDARD_THICKNESS_MM: 17,
        BACKING_THICKNESS_MM: 6
    };

    // 8 HẠNG MỤC ĐỊNH MỨC CẮT CNC THỰC CHIẾN TẠI XƯỞNG PG HOME
    const CNC_CATEGORIES = [
        {
            id: 'R09',
            stt: 1,
            name: 'Tủ bếp dưới',
            relatedCodes: ['R09'],
            dimensions: 'Sâu 600mm × Cao 860mm (Thùng cao 740mm)',
            unit: 'Md',
            normTotal: 1.45, // tấm / md
            normBreakdown: {
                carcassAndBacking: 1.14, // Thùng + Hậu (ván 17mm + hậu)
                acrylicDoors: 0.31,      // Cánh Acrylic riêng (nếu bóc tách)
                backing6mm: 0.0          // Thường dùng chung kết cấu hoặc ván chống ẩm
            },
            techExplanation: 'Trừ chân nhựa 100mm + mặt đá 20mm; nóc không bịt kín (chỉ đi 2 thanh xà 80mm giằng); khoang chậu rửa & bếp từ không đi đợt ngang.',
            bossFormulaNote: '3.77 md × 1.45 = 5.47 ≈ 5.5 tấm. NGHIÊM CẤM BÁO CÁO NHẦM THÀNH 2.70 tấm/md!',
            tags: ['tủ bếp', 'bếp dưới', 'acrylic', 'r09']
        },
        {
            id: 'R08',
            stt: 2,
            name: 'Tủ bếp trên',
            relatedCodes: ['R08'],
            dimensions: 'Sâu 350mm × Cao 750mm',
            unit: 'Md',
            normTotal: 1.04, // tấm ván 17mm / md (Thùng + Cánh)
            normBreakdown: {
                carcass: 0.74,     // Thùng (ván 17mm)
                doors: 0.30,       // Cánh (ván 17mm)
                backing6mm: 0.28   // Hậu 6mm riêng
            },
            techExplanation: 'Sâu 350mm nên 1 khổ ván rộng 1220mm xẻ dọc được 3 dải phôi 350mm (350 × 3 = 1050mm + mạch cưa) rất lợi ván.',
            bossFormulaNote: 'Tổng ván 17mm = 1.04 tấm/md + Hậu 6mm = 0.28 tấm/md.',
            tags: ['tủ bếp', 'bếp trên', 'r08']
        },
        {
            id: 'R10',
            stt: 3,
            name: 'Tủ bếp kịch trần',
            relatedCodes: ['R10'],
            dimensions: 'Sâu 700mm × Cao 720mm',
            unit: 'Md',
            normTotal: 1.44, // tấm ván 17mm / md (Thùng + Cánh)
            normBreakdown: {
                carcass: 1.15,     // Thùng (ván 17mm)
                doors: 0.29,       // Cánh (ván 17mm)
                backing6mm: 0.27   // Hậu 6mm riêng
            },
            techExplanation: 'Sâu 700mm vượt quá nửa khổ ván 610mm; 1 khổ 1220mm xẻ được 1 dải 700mm + 1 dải thừa ~500mm (ghép sang hồi/đợt kệ tivi hoặc lavabo).',
            bossFormulaNote: 'Tổng ván 17mm = 1.44 tấm/md + Hậu 6mm = 0.27 tấm/md.',
            tags: ['tủ bếp', 'kịch trần', 'r10']
        },
        {
            id: 'R27',
            stt: 4,
            name: 'Tủ quần áo kịch trần',
            relatedCodes: ['R27', 'R40', 'R49'],
            dimensions: 'Sâu 600mm × Cao 2700mm',
            unit: 'M²',
            normTotal: 1.05, // tấm ván 17mm / m2
            normBreakdown: {
                fullSystem17mm: 1.05, // Đã gồm Thùng + Đợt + Ngăn kéo + Cánh gỗ
                backing6mm: 0.36,     // Hậu 6mm
                glassDoorDeduction: 0.40 // Trừ 0.40 tấm/m2 nếu lắp Cánh kính khung nhôm
            },
            techExplanation: '1 khổ ván 1220mm bổ đôi chuẩn 2 dải 600mm. Khoang nào lắp Cánh kính khung nhôm thì phải trừ ngay 0.40 tấm ván 17mm / m² cánh kính.',
            bossFormulaNote: 'Định mức 1.05 tấm 17mm / m² + 0.36 tấm hậu 6mm / m². Có cánh kính: chỉ còn 0.65 tấm 17mm / m².',
            tags: ['tủ áo', 'phòng ngủ', 'cánh kính', 'r27', 'r40', 'r49']
        },
        {
            id: 'R05',
            stt: 5,
            name: 'Hộc tủ trang trí nông',
            relatedCodes: ['R05'],
            dimensions: 'Sâu 200mm × Cao 1850mm',
            unit: 'M²',
            normTotal: 0.50, // tấm ván 17mm / m2
            normBreakdown: {
                carcassAndShelves: 0.50,
                backing6mm: 0.25
            },
            techExplanation: '1 tấm khổ 1220mm xẻ được 6 dải sâu 200mm (200 × 6 = 1200mm) cực kỳ tối ưu diện tích ván.',
            bossFormulaNote: 'Định mức: 0.50 tấm ván 17mm / m² + Hậu 6mm = 0.25 tấm / m².',
            tags: ['hộc trang trí', 'tủ rượu', 'tủ giày', 'r05']
        },
        {
            id: 'R06',
            stt: 6,
            name: 'Vách ốp phẳng trang trí',
            relatedCodes: ['R06', 'R23', 'R25', 'R34', 'R43', 'R21', 'R52'],
            dimensions: 'Độ dày 17mm (Ốp tường, vách đầu giường, vách nan)',
            unit: 'M²',
            normTotal: 0.40, // tấm / m2 phẳng
            normBreakdown: {
                flatWallPanel: 0.40,  // Vách phẳng: trừ hao hụt ghép vân & xương lót ~15% còn 2.50 m² thành phẩm / tấm
                flutedCncPanel: 0.52  // Vách có Lam / Soi huỳnh CNC (R21, R52): 0.52 tấm / m²
            },
            techExplanation: 'Vách phẳng cần 0.40 tấm/m² (tương đương 1 tấm làm được 2.5 m² thành phẩm sau khi trừ xương giằng âm và ghép tiếp vân). Với vách có Lam / Soi CNC tốn phôi hơn: 0.52 tấm/m².',
            bossFormulaNote: 'Vách phẳng: 0.40 tấm/m². Vách soi huỳnh / lam sóng (R21, R52): 0.52 tấm/m².',
            tags: ['vách ốp', 'vách nan', 'đầu giường', 'vách tivi', 'r06', 'r23', 'r25']
        },
        {
            id: 'R33',
            stt: 7,
            name: 'Giường ngủ bo cong không đầu giường',
            relatedCodes: ['R33', 'R42'],
            dimensions: '1600mm × 2000mm hoặc 1800mm × 2000mm',
            unit: 'Cái',
            normTotal: 3.40, // chuẩn trung bình 3.3 - 3.5 tấm / cái
            normBreakdown: {
                bedPlatform: 1.40,    // Phản giường 2 tấm ghép
                frameAndCurves: 2.00  // 3 vai/đuôi bo cong chập đôi + hệ xương/thang chịu lực
            },
            techExplanation: 'Gồm phản giường 2 tấm (1.4 tấm) + 3 vai/đuôi bo cong chập đôi + hệ xương/thang chịu lực gia cố âm (2.0 tấm). Dao động 3.3 – 3.5 tấm/cái.',
            bossFormulaNote: 'Chuẩn Giám Đốc: 3.40 tấm / cái (Dải an toàn 3.3 – 3.5 tấm).',
            tags: ['giường ngủ', 'bo cong', 'phản giường', 'r33', 'r42']
        },
        {
            id: 'R04',
            stt: 8,
            name: 'Kệ tivi / Bàn học / Bàn phấn treo bo góc',
            relatedCodes: ['R04', 'R24', 'R36', 'R39', 'R46'],
            dimensions: 'Sâu 400–550mm × Cao 150–300mm',
            unit: 'Md',
            normTotal: 0.60, // chuẩn trung bình 0.55 - 0.65 tấm ván 17mm / md
            normBreakdown: {
                carcassAndFront17mm: 0.60, // Khung hộp + cánh/mặt ngăn kéo bo góc
                drawerBottom6mm: 0.15      // Đáy ngăn kéo hậu 6mm
            },
            techExplanation: 'Khổ ván xẻ được nhiều dải thấp 150–300mm. Dao động 0.55 – 0.65 tấm ván 17mm / md + 0.15 tấm hậu / md.',
            bossFormulaNote: 'Chuẩn Giám Đốc: 0.60 tấm 17mm / md + 0.15 tấm hậu 6mm / md.',
            tags: ['kệ tivi', 'bàn học', 'bàn phấn', 'r04', 'r24', 'r36', 'r39', 'r46']
        }
    ];

    // 5 BÀI HỌC XƯƠNG MÁU KHI LÀM BÁO GIÁ, TÍNH ĐỊNH MỨC & ĐO LƯỜNG (MỤC 4.2 GEMINI.MD)
    const GOLDEN_RULES = [
        {
            ruleIndex: 1,
            title: 'Không bao giờ tính trùng Cánh vào Thùng & không lấy chiều cao phủ bì nhân bừa',
            content: 'Phải trừ chân nhựa 100mm, trừ mặt đá, trừ tấm nóc rỗng của tủ bếp dưới, trừ diện tích cánh kính trên tủ áo và khoang rỗng nhét tủ lạnh/máy giặt.'
        },
        {
            ruleIndex: 2,
            title: 'Bắt buộc phân biệt Chiều Sâu (R) khi quy đổi từ M² / Md sang Số Tấm Ván',
            content: 'Cùng 1 m² mặt đứng nhưng R=17mm (0.40 tấm/m²), R=200mm (0.50 tấm/m²), R=350mm (0.74 tấm/md), R=600mm (1.05 tấm/m²), R=700mm (1.15–1.35 tấm/md).'
        },
        {
            ruleIndex: 3,
            title: 'Quy tắc Đo lường "Trừ Giao Cắt & Khấu Trừ Lỗ Mở"',
            content: 'Khi đo mảng tường ốp lớn (R06: 15.6 m²) có gắn đè hệ tủ trang trí (R05: 8.51 m²), hoặc hệ tủ áo lớn (R27: 13.82 m²) có khoét lỗ cửa giấu khuôn (R29: 1.61 m²), khối lượng cột H phải trừ phần giao cắt và ghi chú rõ vào cột Quy cách.'
        },
        {
            ruleIndex: 4,
            title: 'Quy tắc Định giá 3 Cấp Vật Liệu (An Cường ↔ Thái Lan ↔ Plywood A1)',
            content: 'Giữa An Cường và Thái Lan chỉ chênh tiền phôi ván gỗ ~380.000 đ/tấm, trong khi Nhựa đặc WPB An Cường (2.550.000 đ/tấm), Cánh Acrylic Noline, Phụ kiện, Kính, Da bọc và Công thợ là cố định 100%. Do đó cột Thái Lan chỉ được giảm tương ứng phần chênh phôi ván (~12%–14%), không giảm sâu ở các hạng mục có Cánh Acrylic hoặc Nhựa WPB.'
        },
        {
            ruleIndex: 5,
            title: 'Chốt Chặn 54% Trước Khi Xuất Báo Giá',
            content: 'Lấy (Tổng Vật Tư Thực Tế + Tổng Công Thợ Dự Kiến) / Tổng Doanh Thu Báo Giá. Nếu <= 54% thì chắc chắn đạt Lợi nhuận ròng 18% – 20% bỏ túi Giám Đốc.'
        }
    ];

    /**
     * Tra cứu hạng mục theo mã hoặc từ khóa tìm kiếm
     * @param {string} query Ví dụ: 'R09', 'bếp dưới', 'R27', 'giường'
     * @returns {Object|null}
     */
    function lookup(query) {
        if (!query || typeof query !== 'string') return null;
        const q = query.trim().toUpperCase();
        return CNC_CATEGORIES.find(cat => 
            cat.id.toUpperCase() === q ||
            cat.relatedCodes.some(code => code.toUpperCase() === q) ||
            cat.name.toUpperCase().includes(q) ||
            cat.tags.some(tag => tag.toUpperCase().includes(q))
        ) || null;
    }

    /**
     * Tính toán số lượng tấm ván cắt CNC theo mã hạng mục và kích thước thực tế
     * @param {string} code Mã hạng mục (R09, R08, R10, R27, R05, R06, R33, R04...)
     * @param {number} quantity Số lượng (md, m2, hoặc cái)
     * @param {Object} options Tùy chọn nâng cao:
     *        - hasGlassDoor: boolean (Nếu tủ áo có cánh kính -> trừ 0.40 tấm/m2)
     *        - isFluted: boolean (Nếu vách soi nan/huỳnh R21/R52 -> 0.52 tấm/m2)
     *        - separateAcrylic: boolean (Nếu tủ bếp dưới bóc riêng cánh Acrylic)
     * @returns {Object} Chi tiết số tấm ván 17mm, hậu 6mm và diễn giải
     */
    function calculateSheets(code, quantity, options = {}) {
        const item = lookup(code);
        if (!item) {
            return {
                success: false,
                error: `Không tìm thấy hạng mục với mã "${code}". Vui lòng kiểm tra lại.`
            };
        }

        const qty = parseFloat(quantity);
        if (isNaN(qty) || qty <= 0) {
            return {
                success: false,
                error: `Khối lượng không hợp lệ: ${quantity}. Phải là số dương.`
            };
        }

        let rate17 = item.normTotal;
        let rate6 = 0;
        let notes = [];

        // Xử lý các trường hợp đặc biệt theo luật sắt
        if (item.id === 'R27') {
            rate6 = item.normBreakdown.backing6mm; // 0.36 tấm/m2
            if (options.hasGlassDoor) {
                rate17 = item.normTotal - item.normBreakdown.glassDoorDeduction; // 1.05 - 0.40 = 0.65
                notes.push('Đã trừ 0.40 tấm 17mm/m² do sử dụng Cánh Kính Khung Nhôm.');
            }
        } else if (item.id === 'R08') {
            rate17 = item.normTotal; // 1.04
            rate6 = item.normBreakdown.backing6mm; // 0.28
        } else if (item.id === 'R10') {
            rate17 = item.normTotal; // 1.44
            rate6 = item.normBreakdown.backing6mm; // 0.27
        } else if (item.id === 'R05') {
            rate17 = item.normTotal; // 0.50
            rate6 = item.normBreakdown.backing6mm; // 0.25
        } else if (item.id === 'R06') {
            if (options.isFluted || code.toUpperCase() === 'R21' || code.toUpperCase() === 'R52') {
                rate17 = item.normBreakdown.flutedCncPanel; // 0.52
                notes.push('Áp dụng định mức vách Lam sóng / Soi huỳnh CNC: 0.52 tấm/m².');
            } else {
                rate17 = item.normBreakdown.flatWallPanel; // 0.40
                notes.push('Áp dụng định mức vách phẳng: 0.40 tấm/m².');
            }
        } else if (item.id === 'R04') {
            rate17 = item.normTotal; // 0.60
            rate6 = item.normBreakdown.drawerBottom6mm; // 0.15
        } else if (item.id === 'R09') {
            if (options.separateAcrylic) {
                rate17 = item.normBreakdown.carcassAndBacking; // 1.14
                notes.push(`Thùng + Hậu: ${(qty * item.normBreakdown.carcassAndBacking).toFixed(2)} tấm. Cánh Acrylic riêng: ${(qty * item.normBreakdown.acrylicDoors).toFixed(2)} tấm.`);
            } else {
                rate17 = item.normTotal; // 1.45
            }
        }

        const sheets17Raw = qty * rate17;
        const sheets6Raw = qty * rate6;

        return {
            success: true,
            item: item,
            inputQuantity: qty,
            unit: item.unit,
            rate17mm: rate17,
            sheets17mmExact: Number(sheets17Raw.toFixed(2)),
            sheets17mmRounded: Math.ceil(sheets17Raw * 10) / 10,
            rate6mm: rate6,
            sheets6mmExact: Number(sheets6Raw.toFixed(2)),
            sheets6mmRounded: Math.ceil(sheets6Raw * 10) / 10,
            totalSheetsEstimated: Number((sheets17Raw + sheets6Raw).toFixed(2)),
            notes: notes.join(' | ') || item.techExplanation
        };
    }

    /**
     * Xuất HTML bảng đối soát 8 hạng mục CNC phục vụ nhúng vào Web App Quản Trị PG Home
     */
    function renderTableHTML() {
        let rows = CNC_CATEGORIES.map(cat => `
            <tr style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td style="padding: 10px 12px; font-weight: bold; color: #1e293b; text-align: center;">${cat.stt}</td>
                <td style="padding: 10px 12px; font-weight: bold; color: #0284c7;">
                    ${cat.id}
                    <span style="font-size: 11px; color: #64748b; font-weight: normal; display: block;">${cat.relatedCodes.join(', ')}</span>
                </td>
                <td style="padding: 10px 12px; font-weight: 600; color: #0f172a;">
                    ${cat.name}
                    <div style="font-size: 12px; color: #64748b; font-weight: normal;">${cat.dimensions}</div>
                </td>
                <td style="padding: 10px 12px; text-align: center; font-weight: 600; color: #475569;">${cat.unit}</td>
                <td style="padding: 10px 12px; text-align: right; font-weight: bold; color: #b91c1c; font-size: 14px;">
                    ${cat.normTotal.toFixed(2)}
                    <span style="font-size: 11px; color: #64748b; font-weight: normal;"> tấm/${cat.unit}</span>
                </td>
                <td style="padding: 10px 12px; font-size: 12px; color: #334155; line-height: 1.4;">
                    ${cat.techExplanation}
                    <div style="margin-top: 4px; color: #0369a1; font-style: italic; font-weight: 500;">
                        💡 ${cat.bossFormulaNote}
                    </div>
                </td>
            </tr>
        `).join('');

        return `
            <div style="background: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">BẢNG TRA CỨU ĐỊNH MỨC CẮT CNC THỰC CHIẾN XƯỞNG PG HOME</h3>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Khổ ván tiêu chuẩn 1220 × 2440mm = 2.9768 m²/tấm | Chuẩn hóa Giám Đốc (06/11/2026)</p>
                    </div>
                    <div style="background: #0284c7; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 4px;">
                        MỤC 24 LUẬT SẮT
                    </div>
                </div>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
                        <thead>
                            <tr style="background: #f1f5f9; color: #475569; border-bottom: 2px solid #cbd5e1;">
                                <th style="padding: 10px 12px; text-align: center; width: 45px;">STT</th>
                                <th style="padding: 10px 12px; width: 80px;">Mã</th>
                                <th style="padding: 10px 12px;">Tên Hạng Mục & Kích Thước</th>
                                <th style="padding: 10px 12px; text-align: center; width: 60px;">ĐVT</th>
                                <th style="padding: 10px 12px; text-align: right; width: 130px;">Định Mức Chuẩn</th>
                                <th style="padding: 10px 12px;">Giải Thích Kỹ Thuật & Công Thức Bỏ Túi BGĐ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Xuất HTML 5 bài học xương máu (Mục 4.2 GEMINI.md)
     */
    function renderGoldenRulesHTML() {
        let rulesHtml = GOLDEN_RULES.map(r => `
            <div style="margin-bottom: 12px; padding: 12px 14px; background: #fff; border-left: 4px solid #0284c7; border-radius: 0 6px 6px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="font-weight: bold; color: #0f172a; font-size: 13px; margin-bottom: 4px;">
                    ${r.ruleIndex}. ${r.title}
                </div>
                <div style="font-size: 12px; color: #475569; line-height: 1.5;">
                    ${r.content}
                </div>
            </div>
        `).join('');

        return `
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #b91c1c; text-transform: uppercase; font-weight: bold; display: flex; align-items: center; gap: 6px;">
                    ⚠️ 5 BÀI HỌC XƯƠNG MÁU BÁO GIÁ & ĐO LƯỜNG (CHỐT CHẶN AN TOÀN BGĐ)
                </h4>
                ${rulesHtml}
            </div>
        `;
    }

    /**
     * Kiểm thử tự động để bảo đảm tính toàn vẹn 100% của Module W32
     */
    function test() {
        const tests = [
            { code: 'R09', qty: 3.77, expected17Min: 5.4, expected17Max: 5.5, label: 'Tủ bếp dưới nhà anh Nam 3.77md' },
            { code: 'R08', qty: 3.77, expected17Min: 3.9, expected17Max: 4.0, label: 'Tủ bếp trên 3.77md' },
            { code: 'R10', qty: 3.77, expected17Min: 5.4, expected17Max: 5.5, label: 'Tủ bếp kịch trần 3.77md' },
            { code: 'R27', qty: 10.0, expected17Min: 10.5, expected17Max: 10.5, label: 'Tủ áo kịch trần 10m2' },
            { code: 'R05', qty: 10.0, expected17Min: 5.0, expected17Max: 5.0, label: 'Hộc trang trí nông 10m2' },
            { code: 'R06', qty: 10.0, expected17Min: 4.0, expected17Max: 4.0, label: 'Vách phẳng 10m2' },
            { code: 'R33', qty: 1.0, expected17Min: 3.3, expected17Max: 3.5, label: 'Giường bo cong 1 cái' },
            { code: 'R04', qty: 3.0, expected17Min: 1.6, expected17Max: 1.9, label: 'Kệ tivi bo góc 3md' }
        ];

        let passed = 0;
        let details = [];

        tests.forEach(t => {
            const res = calculateSheets(t.code, t.qty);
            if (res.success && res.sheets17mmExact >= t.expected17Min && res.sheets17mmExact <= t.expected17Max) {
                passed++;
                details.push(`[PASS] ${t.label}: ${res.sheets17mmExact} tấm (Kỳ vọng: ${t.expected17Min}-${t.expected17Max})`);
            } else {
                details.push(`[FAIL] ${t.label}: ${res.sheets17mmExact} (Ngoài dải ${t.expected17Min}-${t.expected17Max})`);
            }
        });

        return {
            total: tests.length,
            passed: passed,
            isAllPassed: passed === tests.length,
            details: details
        };
    }

    // EXPORT PUBLIC INTERFACE
    return {
        MODULE_ID: 'W32_CNC_8CATEGORIES_REFERENCE',
        VERSION: '1.0.0',
        DATE_STANDARDIZED: '2026-11-06',
        LEGAL_HKD: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)',
        SHEET_SPECS: SHEET_SPECS,
        CNC_CATEGORIES: CNC_CATEGORIES,
        GOLDEN_RULES: GOLDEN_RULES,
        lookup: lookup,
        calculateSheets: calculateSheets,
        getAllCategories: () => CNC_CATEGORIES,
        getGoldenRules: () => GOLDEN_RULES,
        renderTableHTML: renderTableHTML,
        renderGoldenRulesHTML: renderGoldenRulesHTML,
        test: test
    };
}));
