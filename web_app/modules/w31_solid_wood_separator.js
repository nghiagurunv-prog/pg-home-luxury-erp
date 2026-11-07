/**
 * PHU GIA LUXURY INTERIOR - QUY CHUẨN QUẢN TRỊ CCSC & BÓC TÁCH VẬT TƯ
 * MODULE W31: BỘ LỌC BÓC TÁCH TỰ ĐỘNG GỖ TỰ NHIÊN (GỖ THỊT) & SOFA / ĐỒ MUA NGOÀI
 * 
 * Pháp lý: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * Mã số HKD: 042203002931 | Hotline: 0986.722.324
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * 
 * KỶ LUẬT THÉP BẢO VỆ DÒNG TIỀN VÀ QUỸ KHOÁN XƯỞNG:
 * - woodVal = totalVal - solidWood - accVal - commercialVal
 * - Định mức khoán xưởng CHỈ TÍNH TRÊN DOANH SỐ VÁN CÔNG NGHIỆP (woodVal):
 *   + Quỹ vật tư xưởng: 40% * woodVal
 *   + Quỹ công thợ xưởng: 15% * woodVal
 * - NGHIÊM CẤM gom Gỗ tự nhiên (gỗ thịt), Đồ mua ngoài/Sofa, Mặt đá, Kính cường lực,
 *   Phụ kiện kim khí vào để thổi phồng doanh số ván công nghiệp của xưởng.
 * - Lợi nhuận xưởng (Col BG): Do chính thợ và máy xưởng làm ra. Cấm lấy tiền mảng thương mại,
 *   đá, kính bù vào xưởng. Nếu xưởng chi lương thợ vượt 15% làm âm quỹ khoán thì Col BG = 0 đ.
 */

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PG_Modules_W31 = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // 1. TỪ ĐIỂN TỪ KHÓA BÓC TÁCH CHUẨN XƯỞNG PHÚ GIA
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

        // Phụ kiện kim khí & Thiết bị gia dụng mua ngoài
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

    // 2. CHUẨN HÓA CHUỖI TÌM KIẾM
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

    // 3. ĐỊNH DẠNG TIỀN VNĐ
    function formatVND(amount) {
        var num = Number(amount) || 0;
        return num.toLocaleString('vi-VN') + ' đ';
    }

    // 4. PHÂN LOẠI HẠNG MỤC CÔNG VIỆC DỰA TRÊN TỪ KHÓA & THUỘC TÍNH
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
                    quotaEligible: false,
                    confidence: 0.95,
                    matchedKeyword: kw,
                    reason: 'Phát hiện gỗ tự nhiên: "' + kw + '". Bóc tách khỏi khoán xưởng ván CN.'
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
                    quotaEligible: false,
                    confidence: 0.95,
                    matchedKeyword: cKw,
                    reason: 'Phát hiện đồ mua ngoài/sofa: "' + cKw + '". Bóc tách 100% khỏi xưởng ván CN.'
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
                    quotaEligible: false,
                    confidence: 0.90,
                    matchedKeyword: aKw,
                    reason: 'Phát hiện phụ kiện/thiết bị: "' + aKw + '". Không được tính khoán xưởng.'
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
                    quotaEligible: true,
                    confidence: 0.95,
                    matchedKeyword: wKw,
                    reason: 'Sản phẩm ván công nghiệp cắt CNC xưởng Phú Gia: "' + wKw + '". Áp dụng khoán 40% vật tư & 15% thợ.'
                };
            }
        }

        // Mặc định: Phân loại theo cờ tự chọn nếu có, hoặc coi là mộc xưởng nếu không thuộc nhóm loại trừ
        var isForcedWorkshop = Boolean(item.isWorkshop || item.isIndustrialWood);
        return {
            category: isForcedWorkshop ? 'INDUSTRIAL_WOOD' : 'GENERAL_WOOD',
            categoryName: isForcedWorkshop ? 'Ván công nghiệp xưởng' : 'Hạng mục nội thất chung',
            isWorkshopWood: isForcedWorkshop,
            quotaEligible: isForcedWorkshop,
            confidence: 0.70,
            matchedKeyword: '',
            reason: isForcedWorkshop ? 'Được đánh dấu là hàng ván CN xưởng.' : 'Không khớp từ khóa loại trừ, cần giám sát kiểm tra lại.'
        };
    }

    // 5. BÓC TÁCH TOÀN BỘ DANH SÁCH HẠNG MỤC CÔNG TRÌNH
    function separateContractItems(items) {
        if (!Array.isArray(items)) {
            items = [];
        }

        var totalVal = 0;
        var woodVal = 0;           // Ván công nghiệp xưởng (Đủ điều kiện tính khoán 40% & 15%)
        var solidWoodVal = 0;      // Gỗ thịt / tự nhiên
        var commercialVal = 0;     // Sofa / đồ mua ngoài
        var accessoryVal = 0;      // Phụ kiện kim khí / thiết bị
        var stoneGlassVal = 0;     // Đá / kính
        var otherVal = 0;          // Hạng mục khác chưa rõ

        var separatedItems = [];

        for (var idx = 0; idx < items.length; idx++) {
            var rawItem = items[idx];
            var qty = Number(rawItem.quantity || rawItem.soLuong || rawItem.qty || 1);
            var unitPrice = Number(rawItem.unitPrice || rawItem.donGia || rawItem.price || 0);
            var itemTotal = Number(rawItem.totalPrice || rawItem.thanhTien || (qty * unitPrice));

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
                classification: classification
            });
        }

        // TÍNH TOÁN QUỸ KHOÁN XƯỞNG CHUẨN KỶ LUẬT THÉP (CHỈ TRÊN woodVal)
        var materialQuotaRate = 0.40; // 40% Vật tư ván CN
        var workerQuotaRate = 0.15;   // 15% Công thợ xưởng
        var materialFund = Math.round(woodVal * materialQuotaRate);
        var workerFund = Math.round(woodVal * workerQuotaRate);
        var totalWorkshopQuota = materialFund + workerFund;

        // Tỷ lệ kiểm soát an toàn chi phí cost <= 54%
        var workshopCostRatio = totalVal > 0 ? ((totalWorkshopQuota / totalVal) * 100).toFixed(2) : '0.00';

        return {
            summary: {
                totalVal: totalVal,
                woodVal: woodVal,                     // Doanh số ván công nghiệp thực tế
                solidWoodVal: solidWoodVal,           // Gỗ tự nhiên (bóc tách ra)
                commercialVal: commercialVal,         // Sofa & đồ mua ngoài (bóc tách ra)
                accessoryVal: accessoryVal,           // Phụ kiện & thiết bị (bóc tách ra)
                stoneGlassVal: stoneGlassVal,         // Đá & kính (bóc tách ra)
                otherVal: otherVal,
                excludedVal: solidWoodVal + commercialVal + accessoryVal + stoneGlassVal + otherVal
            },
            quota: {
                materialQuotaRate: materialQuotaRate,
                workerQuotaRate: workerQuotaRate,
                materialFund: materialFund,
                workerFund: workerFund,
                totalWorkshopQuota: totalWorkshopQuota,
                workshopCostRatio: workshopCostRatio
            },
            items: separatedItems,
            auditTimestamp: new Date().toISOString()
        };
    }

    // 6. TÍNH TOÁN LỢI NHUẬN XƯỞNG (COL BG) VÀ KIỂM SOÁT THÂM HỤT LƯƠNG THỢ
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

    // 7. KIỂM TOÁN ZERO-TRUST ĐỐI SOÁT BÁO CÁO (CHỐNG LÀM LÁO, CHỐNG TỔNG HỢP VƠ VÀO)
    function auditContractQuotas(contractData) {
        if (!contractData) return { isValid: false, errors: ['Dữ liệu kiểm toán rỗng'] };

        var errors = [];
        var warnings = [];

        var totalVal = Number(contractData.totalVal || 0);
        var declaredWoodVal = Number(contractData.woodVal || 0);
        var solidWoodVal = Number(contractData.solidWoodVal || 0);
        var commercialVal = Number(contractData.commercialVal || 0);
        var accessoryVal = Number(contractData.accessoryVal || 0);
        var stoneGlassVal = Number(contractData.stoneGlassVal || 0);

        var declaredMaterialFund = Number(contractData.materialFund || 0);
        var declaredWorkerFund = Number(contractData.workerFund || 0);

        // Quy tắc 1: Doanh số ván không được vượt quá (Tổng giá trị - Các mảng bóc tách)
        var maxPossibleWoodVal = totalVal - (solidWoodVal + commercialVal + accessoryVal + stoneGlassVal);
        if (declaredWoodVal > maxPossibleWoodVal + 100) { // Sai số làm tròn 100đ
            errors.push('LỖI KỶ LUẬT THÉP: Doanh số ván CN khai báo (' + formatVND(declaredWoodVal) + 
                        ') lớn hơn mức tối đa cho phép sau bóc tách (' + formatVND(maxPossibleWoodVal) + 
                        '). Đang có hiện tượng gom gỗ thịt/thương mại vào xưởng!');
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

        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            auditedWoodVal: declaredWoodVal,
            expectedQuotas: {
                material40: expectedMaterialFund,
                worker15: expectedWorkerFund
            }
        };
    }

    // 8. RENDER GIAO DIỆN BẢNG BÓC TÁCH HTML (DÙNG TRỰC TIẾP TRÊN WEB APP)
    function renderBreakdownHtml(separationResult) {
        if (!separationResult || !separationResult.summary) {
            return '<div class="alert alert-warning">Chưa có dữ liệu bóc tách.</div>';
        }

        var s = separationResult.summary;
        var q = separationResult.quota;

        var html = '<div class="pg-w31-container" style="font-family: Arial, sans-serif; border: 1px solid #c8d6e5; border-radius: 8px; padding: 16px; background: #ffffff;">';
        
        // Header
        html += '  <div style="border-bottom: 2px solid #2e86de; padding-bottom: 8px; margin-bottom: 12px;">';
        html += '    <h3 style="margin: 0; color: #10ac84; font-size: 16px; text-transform: uppercase;">' +
                '      BẢNG BÓC TÁCH GỖ THỊT & ĐỒ MUA NGOÀI - PHÚ GIA (MODULE W31)' +
                '    </h3>';
        html += '    <div style="font-size: 11px; color: #576574; margin-top: 4px;">' +
                '      Kỷ luật thép: woodVal = totalVal - solidWood - accVal - commercialVal | Hotline: 0986.722.324' +
                '    </div>';
        html += '  </div>';

        // Summary Cards Grid
        html += '  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 16px;">';
        
        // Tổng giá trị
        html += '    <div style="background: #f1f2f6; border-left: 4px solid #747d8c; padding: 8px; border-radius: 4px;">';
        html += '      <div style="font-size: 11px; color: #576574;">Tổng giá trị công trình</div>';
        html += '      <div style="font-size: 14px; font-weight: bold; color: #2f3542;">' + formatVND(s.totalVal) + '</div>';
        html += '    </div>';

        // Doanh số ván CN xưởng (Quan trọng nhất)
        html += '    <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 8px; border-radius: 4px;">';
        html += '      <div style="font-size: 11px; color: #0d47a1; font-weight: bold;">Doanh số Ván CN (woodVal)</div>';
        html += '      <div style="font-size: 15px; font-weight: bold; color: #1565c0;">' + formatVND(s.woodVal) + '</div>';
        html += '      <div style="font-size: 10px; color: #1e88e5;">Trọng tâm tính khoán 40% & 15%</div>';
        html += '    </div>';

        // Gỗ tự nhiên bóc tách
        html += '    <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 8px; border-radius: 4px;">';
        html += '      <div style="font-size: 11px; color: #e65100;">Gỗ tự nhiên (Gỗ thịt)</div>';
        html += '      <div style="font-size: 14px; font-weight: bold; color: #ef6c00;">' + formatVND(s.solidWoodVal) + '</div>';
        html += '      <div style="font-size: 10px; color: #f57c00;">[Đã trừ khỏi khoán xưởng]</div>';
        html += '    </div>';

        // Sofa / Mua ngoài bóc tách
        html += '    <div style="background: #fce4ec; border-left: 4px solid #e91e63; padding: 8px; border-radius: 4px;">';
        html += '      <div style="font-size: 11px; color: #880e4f;">Sofa / Đồ thương mại</div>';
        html += '      <div style="font-size: 14px; font-weight: bold; color: #c2185b;">' + formatVND(s.commercialVal) + '</div>';
        html += '      <div style="font-size: 10px; color: #d81b60;">[Đã trừ khỏi khoán xưởng]</div>';
        html += '    </div>';

        // Phụ kiện & Đá kính
        html += '    <div style="background: #ede7f6; border-left: 4px solid #673ab7; padding: 8px; border-radius: 4px;">';
        html += '      <div style="font-size: 11px; color: #311b92;">Phụ kiện, Đá & Kính</div>';
        html += '      <div style="font-size: 14px; font-weight: bold; color: #512da8;">' + formatVND(s.accessoryVal + s.stoneGlassVal) + '</div>';
        html += '      <div style="font-size: 10px; color: #5e35b1;">[Đã trừ khỏi khoán xưởng]</div>';
        html += '    </div>';

        html += '  </div>';

        // Box Định mức Quỹ khoán xưởng
        html += '  <div style="background: #f8fafc; border: 1px dashed #64748b; border-radius: 6px; padding: 12px; margin-bottom: 14px;">';
        html += '    <div style="font-weight: bold; color: #1e293b; font-size: 13px; margin-bottom: 8px;">QUỸ KHOÁN XƯỞNG SẢN XUẤT (TÍNH THEO DOANH SỐ VÁN ' + formatVND(s.woodVal) + '):</div>';
        html += '    <div style="display: flex; gap: 20px; flex-wrap: wrap; font-size: 12px;">';
        html += '      <div>• <strong>Quỹ Vật tư (40%):</strong> <span style="color: #0284c7; font-weight: bold;">' + formatVND(q.materialFund) + '</span></div>';
        html += '      <div>• <strong>Quỹ Lương thợ (15%):</strong> <span style="color: #16a34a; font-weight: bold;">' + formatVND(q.workerFund) + '</span></div>';
        html += '      <div>• <strong>Tổng Quỹ Khoán (55%):</strong> <span style="color: #d97706; font-weight: bold;">' + formatVND(q.totalWorkshopQuota) + '</span></div>';
        html += '    </div>';
        html += '  </div>';

        // Bảng chi tiết hạng mục
        if (separationResult.items && separationResult.items.length > 0) {
            html += '  <div style="overflow-x: auto;">';
            html += '    <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">';
            html += '      <thead>';
            html += '        <tr style="background: #2f3542; color: #ffffff;">';
            html += '          <th style="padding: 6px 8px; border: 1px solid #ced6e0;">#</th>';
            html += '          <th style="padding: 6px 8px; border: 1px solid #ced6e0;">Tên Hạng Mục</th>';
            html += '          <th style="padding: 6px 8px; border: 1px solid #ced6e0; text-align: right;">SL</th>';
            html += '          <th style="padding: 6px 8px; border: 1px solid #ced6e0; text-align: right;">Thành Tiền</th>';
            html += '          <th style="padding: 6px 8px; border: 1px solid #ced6e0;">Phân Loại</th>';
            html += '          <th style="padding: 6px 8px; border: 1px solid #ced6e0; text-align: center;">Khoán Xưởng?</th>';
            html += '        </tr>';
            html += '      </thead>';
            html += '      <tbody>';

            for (var r = 0; r < separationResult.items.length; r++) {
                var itm = separationResult.items[r];
                var isWood = itm.classification.isWorkshopWood;
                var rowBg = isWood ? '#ffffff' : '#fbfbfb';
                var badge = isWood 
                    ? '<span style="background: #2ed573; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">CÓ (40%+15%)</span>'
                    : '<span style="background: #ff4757; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">TRỪ BÓC TÁCH</span>';

                html += '      <tr style="background: ' + rowBg + ';">';
                html += '        <td style="padding: 6px 8px; border: 1px solid #ced6e0;">' + itm.index + '</td>';
                html += '        <td style="padding: 6px 8px; border: 1px solid #ced6e0;"><strong>' + itm.name + '</strong></td>';
                html += '        <td style="padding: 6px 8px; border: 1px solid #ced6e0; text-align: right;">' + itm.quantity + ' ' + itm.unit + '</td>';
                html += '        <td style="padding: 6px 8px; border: 1px solid #ced6e0; text-align: right; font-weight: bold;">' + formatVND(itm.totalPrice) + '</td>';
                html += '        <td style="padding: 6px 8px; border: 1px solid #ced6e0; color: #2f3542;">' + itm.classification.categoryName + '</td>';
                html += '        <td style="padding: 6px 8px; border: 1px solid #ced6e0; text-align: center;">' + badge + '</td>';
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
        version: '1.0.0',
        author: 'Phu Gia Luxury - Automation Flash Worker W31',
        legalIdentity: {
            unitName: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
            licenseNumber: '042203002931',
            address: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
            hotline: '0986.722.324'
        },
        keywords: KEYWORDS,
        classifyItem: classifyItem,
        separateContractItems: separateContractItems,
        calculateColBG: calculateColBG,
        auditContractQuotas: auditContractQuotas,
        renderBreakdownHtml: renderBreakdownHtml,
        formatVND: formatVND
    });
}));
