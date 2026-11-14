/**
 * ==============================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI THẤT & XÂY DỰNG PHÚ GIA (PG HOME LUXURY)
 * MODULE W31: BỘ LỌC BÓC TÁCH TỰ ĐỘNG GỖ TỰ NHIÊN (GỖ THỊT) & SOFA / ĐỒ MUA NGOÀI
 * CẢI TIẾN #3: BÓC TÁCH RẠCH RÒI woodVal & pkVal KHI BÀN GIAO DỰ ÁN SANG XƯỞNG
 * ==============================================================================
 * PHÁP LÝ & THƯƠNG HIỆU CHÍNH THỨC:
 * - Đơn vị pháp lý: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * - Thương hiệu công ty: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY
 * - Mã số HKD / MST: 042203002931 (ĐKKD lần đầu 13/01/2025 - Đại diện: Nguyễn Trọng Nghĩa)
 * - Xưởng sản xuất Nội thất Phú Gia: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * - Văn phòng: 35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh
 * - Hotline duy nhất: 0986.722.324 | Giám Đốc: Nguyễn Viết Nghĩa
 * ==============================================================================
 * KỶ LUẬT THÉP BẢO VỆ DÒNG TIỀN VÀ QUỸ KHOÁN XƯỞNG (SO_TAY_01 & GEMINI.md):
 * - woodVal = totalVal - solidWoodVal - accessoryVal - stoneGlassVal - commercialVal (pkVal)
 * - Định mức khoán xưởng CHỈ ĐƯỢC TÍNH TRÊN DOANH SỐ VÁN CÔNG NGHIỆP (woodVal):
 *   + Quỹ trần vật tư xưởng: 40% * woodVal
 *   + Quỹ lương thợ xưởng: 15% * woodVal
 * - NGHIÊM CẤM TUYỆT ĐỐI tính quỹ khoán 15% thợ và 40% vật tư trên phần pkVal (Phụ kiện
 *   Hafele, Eurogold, đá Vicostone, kính, Sofa rời, gỗ thịt tự nhiên). pkVal = 0% khoán xưởng!
 * - Lợi nhuận xưởng (Col BG): Do chính thợ và máy xưởng làm ra. Cấm lấy tiền mảng thương mại,
 *   đá, kính bù vào xưởng. Nếu xưởng chi lương thợ vượt 15% làm âm quỹ khoán thì Col BG = 0 đ.
 * ==============================================================================
 */

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        var mod = factory();
        root.PG_Modules_W31 = mod;
        root.PG_W31 = mod; // Tương thích ngược 100%
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // 1. CHUẨN THƯƠNG HIỆU & PHÁP LÝ BẤT KHẢ XÂM PHẠM
    var BRAND_LEGAL = Object.freeze({
        entityName: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
        companyName: 'CÔNG TY CP PHÚ GIA VIỆT NAM',
        brandBadge: 'PG HOME LUXURY',
        licenseNumber: '042203002931',
        taxCode: '042203002931',
        legalRep: 'Nguyễn Trọng Nghĩa',
        directorName: 'Nguyễn Viết Nghĩa',
        factoryAddress: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
        officeAddress: '35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh',
        hotline: '0986.722.324'
    });

    // 2. TỪ ĐIỂN TỪ KHÓA BÓC TÁCH CHUẨN XƯỞNG PHÚ GIA
    var KEYWORDS = {
        // Gỗ tự nhiên / Gỗ thịt (Cấm tính vào khoán xưởng ván công nghiệp)
        SOLID_WOOD: [
            'gỗ thịt', 'gỗ tự nhiên', 'go thit', 'go tu nhien',
            'sồi', 'soi', 'sồi nga', 'sồi mỹ', 'soi nga', 'soi my', 'oak',
            'óc chó', 'oc cho', 'walnut',
            'gõ đỏ', 'go do', 'gõ', 'go pachy',
            'lim', 'lim xẹt', 'lim lào', 'lim nam phi',
            'căm xe', 'cam xe',
            'tần bì', 'tan bi', 'ash',
            'xoan đào', 'xoan dao',
            'dổi', 'doi', 'hương đá', 'huong da', 'gỗ hương',
            'mun', 'trắc', 'cẩm lai', 'thông ghép thanh', 'keo tràm'
        ],

        // Đồ mua ngoài / Thương mại / Sofa / Bàn ghế rời
        COMMERCIAL_OUTSOURCED: [
            'sofa', 'sofa góc', 'sofa văng', 'sofa đơn', 'đôn sofa',
            'đệm', 'nệm', 'mút inoac', 'da bò', 'da ý', 'da carola', 'da napa', 'nỉ hàn quốc',
            'bàn ăn nhập', 'ghế ăn nhập', 'bàn ăn thông minh', 'ghế monaco', 'ghế nelson',
            'rèm', 'rèm vải', 'rèm cầu vồng', 'rèm cuốn',
            'thảm', 'thảm trải sàn', 'thảm sofa',
            'giấy dán tường', 'tranh tráng gương', 'đèn chùm', 'đèn thả trần',
            'nẹp inox trang trí mua ngoài', 'gương bỉ nhập'
        ],

        // Phụ kiện kim khí & Thiết bị gia dụng mua ngoài (Hafele, Eurogold, Quốc Tâm...)
        ACCESSORY_HARDWARE: [
            'phụ kiện', 'phu kien', 'bản lề', 'ban le', 'ray trượt', 'ray truot', 'ray giảm chấn',
            'tay nâng', 'tay nang blum', 'giá bát đĩa', 'giá xoong nồi', 'giá dao thớt',
            'thùng rác âm', 'thùng gạo âm', 'giá liên hoàn', 'mâm xoay',
            'hafele', 'quốc tâm', 'eurogold', 'garis', 'cariny', 'higold', 'blum',
            'bếp từ', 'hút mùi', 'chậu rửa', 'vòi rửa', 'lò vi sóng', 'lò nướng',
            'máy rửa bát', 'tủ lạnh', 'khóa điện tử'
        ],

        // Đá & Kính gia công ngoài
        STONE_GLASS: [
            'đá vicostone', 'vicostone', 'đá granite', 'đá marble', 'đá thạch anh',
            'đá nhân tạo', 'đá trắng ý', 'đá kim sa', 'mặt đá bếp', 'đá lavabo',
            'kính bếp', 'kính màu', 'kính cường lực', 'kính ốp bếp 8mm',
            'cánh kính khung nhôm', 'cánh kính tủ áo', 'cánh nhôm slim', 'khung nhôm định hình'
        ],

        // Ván công nghiệp trực tiếp sản xuất tại máy CNC & xưởng nội thất Phú Gia
        INDUSTRIAL_WOOD: [
            'mdf', 'mfc', 'hdf', 'melamine', 'laminate', 'acrylic', 'noline',
            'an cường', 'an cuong', 'ba thanh', 'mộc phát', 'thái lan', 'chống ẩm',
            'picomat', 'wpb', 'nhựa đặc wpb', 'plywood a1', 'phủ melamine',
            'tủ bếp trên', 'tủ bếp dưới', 'tủ bếp kịch trần', 'tủ áo', 'tủ áo kịch trần',
            'kệ tivi', 'bàn học', 'bàn làm việc', 'giường ngủ mdf', 'vách ốp mdf',
            'lam sóng mdf', 'hộc tủ trang trí'
        ]
    };

    // 3. CHUẨN HÓA CHUỖI TÌM KIẾM
    function normalizeStr(text) {
        if (!text || typeof text !== 'string') return '';
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // 4. ĐỊNH DẠNG TIỀN VNĐ
    function formatVND(amount) {
        var num = Number(amount) || 0;
        return num.toLocaleString('vi-VN') + ' đ';
    }

    // 5. PHÂN LOẠI HẠNG MỤC CÔNG VIỆC DỰA TRÊN TỪ KHÓA & THUỘC TÍNH
    function classifyItem(item) {
        if (!item || typeof item !== 'object') {
            return {
                category: 'UNKNOWN',
                isWorkshopWood: false,
                confidence: 0,
                matchedKeyword: '',
                reason: 'Hạng mục không hợp lệ'
            };
        }

        var name = item.name || item.itemName || item.tenHangMuc || '';
        var spec = item.spec || item.quyCach || item.description || '';
        var material = item.material || item.chatLieu || '';
        var note = item.note || item.ghiChu || '';
        var rawSupplier = item.supplier || item.ncc || '';

        var rawCombined = (name + ' ' + spec + ' ' + material + ' ' + note + ' ' + rawSupplier).toLowerCase();
        var normCombined = normalizeStr(rawCombined);

        // Chốt chặn 1: Kiểm tra Gỗ thịt / Gỗ tự nhiên
        for (var i = 0; i < KEYWORDS.SOLID_WOOD.length; i++) {
            var kw = KEYWORDS.SOLID_WOOD[i];
            var normKw = normalizeStr(kw);
            if (rawCombined.indexOf(kw) !== -1 || (normKw && normCombined.indexOf(normKw) !== -1)) {
                return {
                    category: 'SOLID_WOOD',
                    categoryName: 'Gỗ tự nhiên (Gỗ thịt)',
                    isWorkshopWood: false,
                    isPkVal: true,
                    quotaEligible: false,
                    confidence: 0.95,
                    matchedKeyword: kw,
                    reason: 'Phát hiện gỗ tự nhiên: "' + kw + '". Bóc tách khỏi khoán xưởng ván CN (0% khoán thợ & 0% vật tư).'
                };
            }
        }

        // Chốt chặn 2: Kiểm tra Đồ mua ngoài / Sofa / Bàn ghế rời
        for (var j = 0; j < KEYWORDS.COMMERCIAL_OUTSOURCED.length; j++) {
            var cKw = KEYWORDS.COMMERCIAL_OUTSOURCED[j];
            var normCKw = normalizeStr(cKw);
            if (rawCombined.indexOf(cKw) !== -1 || (normCKw && normCombined.indexOf(normCKw) !== -1)) {
                return {
                    category: 'COMMERCIAL_OUTSOURCED',
                    categoryName: 'Sofa / Đồ thương mại mua ngoài',
                    isWorkshopWood: false,
                    isPkVal: true,
                    quotaEligible: false,
                    confidence: 0.95,
                    matchedKeyword: cKw,
                    reason: 'Phát hiện đồ mua ngoài/sofa: "' + cKw + '". Bóc tách 100% khỏi khoán xưởng ván CN.'
                };
            }
        }

        // Chốt chặn 3: Kiểm tra Đá / Kính
        for (var k = 0; k < KEYWORDS.STONE_GLASS.length; k++) {
            var sKw = KEYWORDS.STONE_GLASS[k];
            var normSKw = normalizeStr(sKw);
            if (rawCombined.indexOf(sKw) !== -1 || (normSKw && normCombined.indexOf(normSKw) !== -1)) {
                return {
                    category: 'STONE_GLASS',
                    categoryName: 'Đá / Kính cường lực / Cánh kính',
                    isWorkshopWood: false,
                    isPkVal: true,
                    quotaEligible: false,
                    confidence: 0.92,
                    matchedKeyword: sKw,
                    reason: 'Phát hiện mảng đá/kính gia công ngoài: "' + sKw + '". Không tính khoán xưởng.'
                };
            }
        }

        // Chốt chặn 4: Kiểm tra Phụ kiện kim khí & Thiết bị
        for (var m = 0; m < KEYWORDS.ACCESSORY_HARDWARE.length; m++) {
            var aKw = KEYWORDS.ACCESSORY_HARDWARE[m];
            var normAKw = normalizeStr(aKw);
            if (rawCombined.indexOf(aKw) !== -1 || (normAKw && normCombined.indexOf(normAKw) !== -1)) {
                return {
                    category: 'ACCESSORY_HARDWARE',
                    categoryName: 'Phụ kiện kim khí / Thiết bị bếp',
                    isWorkshopWood: false,
                    isPkVal: true,
                    quotaEligible: false,
                    confidence: 0.90,
                    matchedKeyword: aKw,
                    reason: 'Phát hiện phụ kiện/thiết bị: "' + aKw + '". Không được tính khoán xưởng (thuộc pkVal thương mại).'
                };
            }
        }

        // Chốt chặn 5: Kiểm tra Ván công nghiệp (Xưởng máy CNC Phú Gia)
        for (var n = 0; n < KEYWORDS.INDUSTRIAL_WOOD.length; n++) {
            var wKw = KEYWORDS.INDUSTRIAL_WOOD[n];
            var normWKw = normalizeStr(wKw);
            if (rawCombined.indexOf(wKw) !== -1 || (normWKw && normCombined.indexOf(normWKw) !== -1)) {
                return {
                    category: 'INDUSTRIAL_WOOD',
                    categoryName: 'Ván công nghiệp (Sản xuất trực tiếp tại Xưởng)',
                    isWorkshopWood: true,
                    isPkVal: false,
                    quotaEligible: true,
                    confidence: 0.95,
                    matchedKeyword: wKw,
                    reason: 'Sản phẩm ván công nghiệp cắt CNC xưởng Phú Gia: "' + wKw + '". Áp dụng khoán 40% vật tư & 15% thợ.'
                };
            }
        }

        // Mặc định: Phân loại theo cờ tự chọn nếu có
        var isForcedWorkshop = Boolean(item.isWorkshop || item.isIndustrialWood);
        return {
            category: isForcedWorkshop ? 'INDUSTRIAL_WOOD' : 'GENERAL_WOOD',
            categoryName: isForcedWorkshop ? 'Ván công nghiệp xưởng' : 'Hạng mục nội thất chung',
            isWorkshopWood: isForcedWorkshop,
            isPkVal: !isForcedWorkshop,
            quotaEligible: isForcedWorkshop,
            confidence: 0.70,
            matchedKeyword: '',
            reason: isForcedWorkshop ? 'Được đánh dấu là hàng ván CN xưởng.' : 'Không khớp từ khóa loại trừ, cần giám sát kiểm tra lại.'
        };
    }

    // 6. CẢI TIẾN #3: BÓC TÁCH RẠCH RÒI woodVal & pkVal NGAY KHI BÀN GIAO DỰ ÁN SANG XƯỞNG
    /**
     * Bóc tách rạch ròi:
     * - woodVal: Vật tư ván công nghiệp tính trần khoán 40% vật tư và 15% lương thợ xưởng
     * - pkVal: Phụ kiện thương mại Hafele, Eurogold, đá, kính, Sofa rời, gỗ thịt tự nhiên (0% khoán xưởng)
     * @param {Array|Object} itemsOrProject Danh sách hạng mục hoặc đối tượng dự án
     * @returns {Object} Kết quả bóc tách rạch ròi kèm cảnh báo kỷ luật thép
     */
    function separateProjectContractValues(itemsOrProject) {
        var rawItems = [];
        if (Array.isArray(itemsOrProject)) {
            rawItems = itemsOrProject;
        } else if (itemsOrProject && Array.isArray(itemsOrProject.items)) {
            rawItems = itemsOrProject.items;
        } else if (itemsOrProject && Array.isArray(itemsOrProject.hangMuc)) {
            rawItems = itemsOrProject.hangMuc;
        }

        var totalVal = 0;
        var woodVal = 0;           // Ván công nghiệp xưởng (Đủ điều kiện tính khoán 40% vật tư & 15% thợ)
        var solidWoodVal = 0;      // Gỗ thịt / tự nhiên (0% khoán xưởng)
        var commercialVal = 0;     // Sofa / đồ mua ngoài (0% khoán xưởng)
        var accessoryVal = 0;      // Phụ kiện kim khí Hafele, Eurogold, Quốc Tâm (0% khoán xưởng)
        var stoneGlassVal = 0;     // Đá Vicostone & kính cường lực (0% khoán xưởng)
        var otherVal = 0;          // Hạng mục thương mại/gia công ngoài khác

        var separatedItems = [];

        for (var idx = 0; idx < rawItems.length; idx++) {
            var rawItem = rawItems[idx];
            var qty = Number(rawItem.quantity || rawItem.soLuong || rawItem.qty || 1);
            var unitPrice = Number(rawItem.unitPrice || rawItem.donGia || rawItem.price || 0);
            var itemTotal = Number(rawItem.totalPrice || rawItem.thanhTien || rawItem.total || rawItem.amount || rawItem.giaTri || (qty * unitPrice) || unitPrice || 0);

            var classification = classifyItem(rawItem);
            totalVal += itemTotal;

            switch (classification.category) {
                case 'INDUSTRIAL_WOOD':
                    woodVal += itemTotal;
                    break;
                case 'SOLID_WOOD':
                    solidWoodVal += itemTotal;
                    break;
                case 'COMMERCIAL_OUTSOURCED':
                    commercialVal += itemTotal;
                    break;
                case 'ACCESSORY_HARDWARE':
                    accessoryVal += itemTotal;
                    break;
                case 'STONE_GLASS':
                    stoneGlassVal += itemTotal;
                    break;
                default:
                    if (classification.isWorkshopWood) {
                        woodVal += itemTotal;
                    } else {
                        otherVal += itemTotal;
                    }
                    break;
            }

            separatedItems.push({
                index: idx + 1,
                id: rawItem.id || ('ITEM_' + (idx + 1)),
                name: rawItem.name || rawItem.itemName || rawItem.tenHangMuc || 'Hạng mục #' + (idx + 1),
                quantity: qty,
                unit: rawItem.unit || rawItem.donVi || 'bộ',
                unitPrice: unitPrice,
                totalPrice: itemTotal,
                classification: classification,
                isWorkshopWood: classification.isWorkshopWood,
                isPkVal: !classification.isWorkshopWood
            });
        }

        // TỔNG GIÁ TRỊ PHỤ KIỆN & THƯƠNG MẠI NGOÀI (pkVal)
        var pkVal = solidWoodVal + commercialVal + accessoryVal + stoneGlassVal + otherVal;

        // TÍNH TOÁN QUỸ KHOÁN XƯỞNG CHUẨN KỶ LUẬT THÉP (CHỈ TÍNH TRÊN woodVal)
        var materialQuotaRate = 0.40; // 40% Vật tư ván CN xưởng
        var workerQuotaRate = 0.15;   // 15% Công thợ xưởng
        var materialFund = Math.round(woodVal * materialQuotaRate);
        var workerFund = Math.round(woodVal * workerQuotaRate);
        var totalWorkshopQuota = materialFund + workerFund;

        // CẢNH BÁO CHỐNG TÍNH NHẦM QUỸ KHOÁN THỢ VÀ VẬT TƯ TRÊN pkVal
        var forbiddenWorkerQuotaIfWrong = Math.round(pkVal * 0.15);
        var forbiddenMaterialQuotaIfWrong = Math.round(pkVal * 0.40);
        
        var warningNotice = '⚠️ KỶ LUẬT THÉP BẢO VỆ DÒNG TIỀN: CẤM TUYỆT ĐỐI tính quỹ khoán 15% thợ xưởng (' +
            formatVND(forbiddenWorkerQuotaIfWrong) + ') và 40% vật tư (' + formatVND(forbiddenMaterialQuotaIfWrong) +
            ') trên phần pkVal (' + formatVND(pkVal) + ') gồm Phụ kiện Hafele, Eurogold, Đá, Kính, Sofa và Gỗ thịt tự nhiên! ' +
            'Quỹ khoán xưởng CHỈ ĐƯỢC PHÉP tính trên woodVal ván CN (' + formatVND(woodVal) + ').';

        var workshopCostRatio = totalVal > 0 ? ((totalWorkshopQuota / totalVal) * 100).toFixed(2) : '0.00';

        return {
            woodVal: woodVal,                         // Thuận tiện truy cập trực tiếp
            pkVal: pkVal,                             // Thuận tiện truy cập trực tiếp
            totalVal: totalVal,                       // Thuận tiện truy cập trực tiếp
            summary: {
                totalVal: totalVal,
                woodVal: woodVal,                     // Doanh số ván công nghiệp thực tế tính khoán
                pkVal: pkVal,                         // Toàn bộ phụ kiện, đá, kính, sofa, gỗ thịt (0% khoán)
                solidWoodVal: solidWoodVal,           // Gỗ tự nhiên (bóc tách ra)
                commercialVal: commercialVal,         // Sofa & đồ mua ngoài (bóc tách ra)
                accessoryVal: accessoryVal,           // Phụ kiện kim khí Hafele, Eurogold... (bóc tách ra)
                stoneGlassVal: stoneGlassVal,         // Đá & kính cường lực (bóc tách ra)
                otherVal: otherVal,                   // Hạng mục thương mại khác (bóc tách ra)
                excludedVal: pkVal                    // Tương thích ngược
            },
            quota: {
                materialQuotaRate: materialQuotaRate,
                workerQuotaRate: workerQuotaRate,
                materialFund: materialFund,
                workerFund: workerFund,
                totalWorkshopQuota: totalWorkshopQuota,
                workshopCostRatio: workshopCostRatio,
                pkLaborQuota: 0,                      // 0% lương thợ trên pkVal
                pkMaterialQuota: 0                    // 0% khoán vật tư xưởng trên pkVal
            },
            warningNotice: warningNotice,
            antiConfusionWarning: {
                hasWarning: pkVal > 0,
                message: warningNotice,
                pkVal: pkVal,
                woodVal: woodVal,
                forbiddenWorkerQuotaIfWrong: forbiddenWorkerQuotaIfWrong,
                forbiddenMaterialQuotaIfWrong: forbiddenMaterialQuotaIfWrong,
                ruleReference: 'SO_TAY_01 & GEMINI.md Mục 2: woodVal = totalVal - solidWood - accVal - commercialVal'
            },
            items: separatedItems,
            auditTimestamp: new Date().toISOString()
        };
    }

    // 7. BÓC TÁCH TOÀN BỘ DANH SÁCH HẠNG MỤC CÔNG TRÌNH (TƯƠNG THÍCH NGƯỢC 100%)
    function separateContractItems(items) {
        return separateProjectContractValues(items);
    }

    // 8. TÍNH TOÁN LỢI NHUẬN XƯỞNG (COL BG) VÀ KIỂM SOÁT THÂM HỤT LƯƠNG THỢ
    function calculateColBG(woodVal, actualWorkerSalary, actualMaterialCost) {
        woodVal = Number(woodVal) || 0;
        actualWorkerSalary = Number(actualWorkerSalary) || 0;
        actualMaterialCost = Number(actualMaterialCost) || 0;

        var workerQuota15 = Math.round(woodVal * 0.15);
        var materialQuota40 = Math.round(woodVal * 0.40);

        // Chênh lệch quỹ thợ: Nếu lương thợ thực tế chi vượt quá 15% thì âm quỹ
        var workerVariance = workerQuota15 - actualWorkerSalary;
        
        // LUẬT SẮT: Col BG là tiền do chính thợ và máy xưởng làm ra.
        // Cấm tuyệt đối lấy tiền mảng thương mại, đá, kính bù vào xưởng.
        // Nếu chi lương thợ vượt 15% làm âm quỹ khoán thì Col BG = 0 đ!
        var colBG = 0;
        var isNegative = false;
        var warningMsg = '';

        if (workerVariance <= 0) {
            colBG = 0;
            isNegative = true;
            warningMsg = 'CẢNH BÁO: Lương thợ xưởng (' + formatVND(actualWorkerSalary) + 
                         ') vượt quá định mức 15% (' + formatVND(workerQuota15) + 
                         '). Bội chi ' + formatVND(Math.abs(workerVariance)) + 
                         '. KHÓA CỨNG COL BG = 0 đ!';
        } else {
            colBG = workerVariance;
            warningMsg = 'Quỹ lương thợ thặng dư ' + formatVND(workerVariance) + '. Đủ điều kiện ghi nhận Col BG.';
        }

        return {
            woodVal: woodVal,
            workerQuota15: workerQuota15,
            materialQuota40: materialQuota40,
            actualWorkerSalary: actualWorkerSalary,
            actualMaterialCost: actualMaterialCost,
            workerVariance: workerVariance,
            colBG: colBG,
            isNegative: isNegative,
            warningMsg: warningMsg
        };
    }

    // 9. KIỂM TOÁN ZERO-TRUST ĐỐI SOÁT BÁO CÁO (CHỐNG LÀM LÁO, CHỐNG TỔNG HỢP VƠ VÀO)
    function auditContractQuotas(contractData) {
        if (!contractData) return { isValid: false, errors: ['Dữ liệu kiểm toán rỗng'] };

        var errors = [];
        var warnings = [];

        var totalVal = Number(contractData.totalVal || 0);
        var declaredWoodVal = Number(contractData.woodVal || 0);
        var declaredPkVal = Number(contractData.pkVal || (contractData.solidWoodVal + contractData.commercialVal + contractData.accessoryVal + contractData.stoneGlassVal) || 0);
        var solidWoodVal = Number(contractData.solidWoodVal || 0);
        var commercialVal = Number(contractData.commercialVal || 0);
        var accessoryVal = Number(contractData.accessoryVal || 0);
        var stoneGlassVal = Number(contractData.stoneGlassVal || 0);

        var declaredMaterialFund = Number(contractData.materialFund || 0);
        var declaredWorkerFund = Number(contractData.workerFund || 0);

        // Quy tắc 1: Doanh số ván không được vượt quá (Tổng giá trị - Các mảng bóc tách pkVal)
        var maxPossibleWoodVal = totalVal - (solidWoodVal + commercialVal + accessoryVal + stoneGlassVal);
        if (declaredWoodVal > maxPossibleWoodVal + 100) { // Sai số làm tròn 100đ
            errors.push('LỖI KỶ LUẬT THÉP: Doanh số ván CN khai báo (' + formatVND(declaredWoodVal) + 
                        ') lớn hơn mức tối đa cho phép sau bóc tách (' + formatVND(maxPossibleWoodVal) + 
                        '). Đang có hiện tượng gom gỗ thịt/thương mại/phụ kiện vào xưởng!');
        }

        // Quy tắc 2: Quỹ vật tư 40% chỉ được nhân với woodVal chuẩn
        var expectedMaterialFund = Math.round(declaredWoodVal * 0.40);
        if (Math.abs(declaredMaterialFund - expectedMaterialFund) > 1000) {
            errors.push('LỖI ĐỊNH MỨC: Quỹ vật tư khai báo (' + formatVND(declaredMaterialFund) + 
                        ') lệch so với 40% * woodVal (' + formatVND(expectedMaterialFund) + ')');
        }

        // Quy tắc 3: Quỹ thợ 15% chỉ được nhân với woodVal chuẩn
        var expectedWorkerFund = Math.round(declaredWoodVal * 0.15);
        if (Math.abs(declaredWorkerFund - expectedWorkerFund) > 1000) {
            errors.push('LỖI ĐỊNH MỨC: Quỹ thợ khai báo (' + formatVND(declaredWorkerFund) + 
                        ') lệch so với 15% * woodVal (' + formatVND(expectedWorkerFund) + ')');
        }

        // Cảnh báo nếu phát hiện pkVal có phát sinh lương thợ
        if (declaredPkVal > 0) {
            warnings.push('ĐÃ BÓC TÁCH pkVal = ' + formatVND(declaredPkVal) + ' (Phụ kiện, đá, kính, sofa, gỗ thịt). Xác nhận 0% khoán thợ & 0% vật tư xưởng.');
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            auditedWoodVal: declaredWoodVal,
            auditedPkVal: declaredPkVal,
            expectedQuotas: {
                material40: expectedMaterialFund,
                worker15: expectedWorkerFund
            }
        };
    }

    // 10. RENDER GIAO DIỆN BẢNG BÓC TÁCH HTML (DÙNG TRỰC TIẾP TRÊN WEB APP)
    function renderBreakdownHtml(separationResult) {
        if (!separationResult || !separationResult.summary) {
            return '<div class="alert alert-warning">Chưa có dữ liệu bóc tách.</div>';
        }

        var s = separationResult.summary;
        var q = separationResult.quota;
        var pkVal = s.pkVal || s.excludedVal || 0;

        var html = '<div class="pg-w31-container" style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px; background: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.04);">';
        
        // Header
        html += '  <div style="border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">';
        html += '    <div>';
        html += '      <h3 style="margin: 0; color: #0369a1; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">' +
                '        BẢNG BÓC TÁCH RẠCH RÒI woodVal & pkVal BÀN GIAO XƯỞNG (MODULE W31)' +
                '      </h3>';
        html += '      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">' +
                '        ' + BRAND_LEGAL.entityName + ' • Xưởng: ' + BRAND_LEGAL.factoryAddress + ' • Hotline: ' + BRAND_LEGAL.hotline +
                '      </div>';
        html += '    </div>';
        html += '    <div style="background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #bae6fd;">' +
                '      MST: ' + BRAND_LEGAL.taxCode + '' +
                '    </div>';
        html += '  </div>';

        // CẢNH BÁO KỶ LUẬT THÉP CHỐNG TÍNH NHẦM KHOÁN TRÊN pkVal
        if (pkVal > 0) {
            var wrongLabor = Math.round(pkVal * 0.15);
            var wrongMaterial = Math.round(pkVal * 0.40);
            html += '  <div style="background: #fff1f2; border: 1.5px solid #f43f5e; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px;">';
            html += '    <div style="display: flex; align-items: center; gap: 8px; color: #be123c; font-weight: 800; font-size: 13px;">';
            html += '      <span>⚠️ CẢNH BÁO KỶ LUẬT THÉP - CHỐNG TÍNH NHẦM KHOÁN XƯỞNG:</span>';
            html += '    </div>';
            html += '    <div style="font-size: 12px; color: #9f1239; margin-top: 6px; line-height: 1.5;">';
            html += '      Phần <strong>pkVal: ' + formatVND(pkVal) + '</strong> (Phụ kiện Hafele, Eurogold, Đá Vicostone, Kính, Sofa rời, Gỗ thịt tự nhiên) có <strong>0% khoán vật tư & 0% lương thợ xưởng</strong>.<br>';
            html += '      <strong>NGHIÊM CẤM</strong> tính 15% thợ (tiết kiệm nguy cơ thất thoát: <span style="background: #ffe4e6; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #e11d48;">' + formatVND(wrongLabor) + '</span>) hoặc 40% vật tư (<span style="background: #ffe4e6; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #e11d48;">' + formatVND(wrongMaterial) + '</span>) lên phần này!';
            html += '    </div>';
            html += '  </div>';
        }

        // Summary Cards Grid
        html += '  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px;">';
        
        // Tổng giá trị
        html += '    <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 10px 12px; border-radius: 6px;">';
        html += '      <div style="font-size: 11px; color: #64748b; font-weight: 600;">Tổng giá trị hợp đồng</div>';
        html += '      <div style="font-size: 15px; font-weight: 800; color: #1e293b; margin-top: 2px;">' + formatVND(s.totalVal) + '</div>';
        html += '      <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Toàn bộ dự án</div>';
        html += '    </div>';

        // Doanh số ván CN xưởng (woodVal)
        html += '    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 10px 12px; border-radius: 6px;">';
        html += '      <div style="font-size: 11px; color: #1d4ed8; font-weight: 700;">Doanh số Ván CN (woodVal)</div>';
        html += '      <div style="font-size: 16px; font-weight: 900; color: #1d4ed8; margin-top: 2px;">' + formatVND(s.woodVal) + '</div>';
        html += '      <div style="font-size: 10px; color: #2563eb; margin-top: 2px; font-weight: 600;">Áp dụng khoán: 40% VT & 15% Thợ</div>';
        html += '    </div>';

        // Phụ kiện & Thương mại ngoài (pkVal)
        html += '    <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 10px 12px; border-radius: 6px;">';
        html += '      <div style="font-size: 11px; color: #be185d; font-weight: 700;">Phụ kiện & Thương mại (pkVal)</div>';
        html += '      <div style="font-size: 16px; font-weight: 900; color: #be185d; margin-top: 2px;">' + formatVND(pkVal) + '</div>';
        html += '      <div style="font-size: 10px; color: #db2777; margin-top: 2px; font-weight: 700;">[0% KHOÁN XƯỞNG - BÓC TÁCH RIÊNG]</div>';
        html += '    </div>';

        // Gỗ thịt tự nhiên
        html += '    <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 10px 12px; border-radius: 6px;">';
        html += '      <div style="font-size: 11px; color: #b45309; font-weight: 600;">Gỗ tự nhiên (Gỗ thịt)</div>';
        html += '      <div style="font-size: 14px; font-weight: 800; color: #b45309; margin-top: 2px;">' + formatVND(s.solidWoodVal) + '</div>';
        html += '      <div style="font-size: 10px; color: #d97706; margin-top: 2px;">Đã tách khỏi khoán ván CN</div>';
        html += '    </div>';

        html += '  </div>';

        // Box Định mức Quỹ khoán xưởng
        html += '  <div style="background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 8px; padding: 14px; margin-bottom: 16px;">';
        html += '    <div style="font-weight: 800; color: #0f172a; font-size: 13px; margin-bottom: 8px;">QUỸ KHOÁN XƯỞNG SẢN XUẤT (TÍNH THEO DOANH SỐ VÁN woodVal ' + formatVND(s.woodVal) + '):</div>';
        html += '    <div style="display: flex; gap: 24px; flex-wrap: wrap; font-size: 12px;">';
        html += '      <div>• <strong>Trần Vật tư xưởng (40%):</strong> <span style="color: #0284c7; font-weight: 800;">' + formatVND(q.materialFund) + '</span></div>';
        html += '      <div>• <strong>Quỹ Lương thợ (15%):</strong> <span style="color: #16a34a; font-weight: 800;">' + formatVND(q.workerFund) + '</span></div>';
        html += '      <div>• <strong>Tổng Quỹ Khoán (55%):</strong> <span style="color: #d97706; font-weight: 800;">' + formatVND(q.totalWorkshopQuota) + '</span></div>';
        html += '      <div>• <strong>Tỷ lệ Cost/Doanh thu:</strong> <span style="color: #475569; font-weight: 700;">' + q.workshopCostRatio + '%</span> (Chuẩn <= 54%)</div>';
        html += '    </div>';
        html += '  </div>';

        // Bảng chi tiết hạng mục
        if (separationResult.items && separationResult.items.length > 0) {
            html += '  <div style="overflow-x: auto;">';
            html += '    <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">';
            html += '      <thead>';
            html += '        <tr style="background: #0f172a; color: #ffffff;">';
            html += '          <th style="padding: 8px 10px; border: 1px solid #334155;">#</th>';
            html += '          <th style="padding: 8px 10px; border: 1px solid #334155;">Tên Hạng Mục</th>';
            html += '          <th style="padding: 8px 10px; border: 1px solid #334155; text-align: right;">SL</th>';
            html += '          <th style="padding: 8px 10px; border: 1px solid #334155; text-align: right;">Thành Tiền</th>';
            html += '          <th style="padding: 8px 10px; border: 1px solid #334155;">Phân Loại</th>';
            html += '          <th style="padding: 8px 10px; border: 1px solid #334155; text-align: center;">Bàn Giao Xưởng?</th>';
            html += '        </tr>';
            html += '      </thead>';
            html += '      <tbody>';

            for (var r = 0; r < separationResult.items.length; r++) {
                var itm = separationResult.items[r];
                var isWood = itm.classification.isWorkshopWood;
                var rowBg = isWood ? '#ffffff' : '#fdf2f8';
                var badge = isWood 
                    ? '<span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">woodVal (40%+15%)</span>'
                    : '<span style="background: #ec4899; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">pkVal (0% Khoán)</span>';

                html += '      <tr style="background: ' + rowBg + '; border-bottom: 1px solid #e2e8f0;">';
                html += '        <td style="padding: 6px 10px; border: 1px solid #e2e8f0;">' + itm.index + '</td>';
                html += '        <td style="padding: 6px 10px; border: 1px solid #e2e8f0;"><strong>' + itm.name + '</strong></td>';
                html += '        <td style="padding: 6px 10px; border: 1px solid #e2e8f0; text-align: right;">' + itm.quantity + ' ' + itm.unit + '</td>';
                html += '        <td style="padding: 6px 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">' + formatVND(itm.totalPrice) + '</td>';
                html += '        <td style="padding: 6px 10px; border: 1px solid #e2e8f0; color: #334155;">' + itm.classification.categoryName + '</td>';
                html += '        <td style="padding: 6px 10px; border: 1px solid #e2e8f0; text-align: center;">' + badge + '</td>';
                html += '      </tr>';
            }

            html += '      </tbody>';
            html += '    </table>';
            html += '  </div>';
        }

        html += '</div>';
        return html;
    }

    // EXPORT MODULE W31
    return Object.freeze({
        version: '2.0.0',
        author: 'Phu Gia Luxury - Automation Flash Worker W31',
        legalIdentity: BRAND_LEGAL,
        keywords: KEYWORDS,
        classifyItem: classifyItem,
        separateProjectContractValues: separateProjectContractValues, // CẢI TIẾN #3 CHÍNH
        separateContractItems: separateContractItems,                 // Tương thích ngược
        calculateColBG: calculateColBG,
        auditContractQuotas: auditContractQuotas,
        renderBreakdownHtml: renderBreakdownHtml,
        formatVND: formatVND
    });
}));