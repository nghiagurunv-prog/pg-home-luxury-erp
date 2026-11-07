# -*- coding: utf-8 -*-
"""
Script to build the definitive BẢNG CCSC VĂN PHÒNG NĂM 2026
Following 100% CEOVN / Thầy Ngô Minh Tuấn standard template.
Incorporating all requirements from Bố (User):
1. Lương Ban lãnh đạo (Nghĩa 10M, Hương 2M = 12M).
2. Lương Quản lý VP (Hiệp): tính vào Sale Admin (Cột U: 6.5M cố định; Cột W: Thưởng 5% DS riêng; Cột V: Thưởng vượt mức >500M là 0.5% tổng DS theo Cách A).
3. Quản lý xưởng (Thái 12M, Vũ 9M = 21M cố định): tách riêng khỏi 15% lương thợ (Cột AD: 21M; Cột AE: Thưởng vượt mức >500M là 0.8% tổng DS gồm Thái 0.5% + Vũ 0.3%; Cột AF: Tổng QL xưởng).
4. Giá vốn khoán xưởng (Cột AW): 55% DS (gồm 15% lương thợ + 40% vật tư).
5. Chi phí VP & Xưởng: Thuê VP 6M (Cột AY), Thuê xưởng 7M (Cột AZ), Điện xưởng & VP 1.5% DS (Cột BB), Chi phí khác 2% DS (Cột AX).
6. Áp số liệu thực tế T6, T7, T8, T9 chính xác từng đồng từ 4 file bảng lương.
"""

import sys, io
sys.stdout.reconfigure(encoding='utf-8')
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from copy import copy

def build_ccsc_van_phong_2026():
    file_path = r"f:\PG Home - Quản trị\2. CSC - Chỉ số\Bảng CCSC Văn Phòng.xlsx"
    wb = openpyxl.load_workbook(file_path)

    if "NĂM 2026" in wb.sheetnames:
        del wb["NĂM 2026"]

    source = wb["NĂM 2023"]
    ws = wb.copy_worksheet(source)
    ws.title = "NĂM 2026"
    ws.freeze_panes = "E9"

    # Helper: copy style
    def copy_cell_style(src_cell, dst_cell):
        if src_cell.has_style:
            dst_cell.font = copy(src_cell.font)
            dst_cell.border = copy(src_cell.border)
            dst_cell.fill = copy(src_cell.fill)
            dst_cell.number_format = copy(src_cell.number_format)
            dst_cell.alignment = copy(src_cell.alignment)

    # 1. TIÊU ĐỀ CHÍNH & HEADERS
    ws["A1"] = "Mẫu công cụ số 6-02/CEOVN/CEOQT-4.0"
    ws["A2"] = "BẢNG CCSC VĂN PHÒNG NĂM 2026 - PG HOME LUXURY"
    ws["B4"] = "Doanh số 2026"

    # Header Cột U - Y: P. Sale Admin + Kỹ Thuật (Hiệp) & Thiết kế 3D
    ws["U5"] = "P. Sale Admin + Thiết kế"
    ws["U6"] = "P. Sale Admin (Hiệp)"
    ws["U7"] = "Lương CB\n(6.5tr/tháng)"
    ws["V6"] = "Thưởng vượt DS >500M"
    ws["V7"] = "Hiệp (+0.5% DS)"
    ws["W6"] = "Doanh số riêng của Hiệp"
    ws["W7"] = "Hoa hồng (5% DS riêng)"
    ws["X6"] = "Thiết kế 3D"
    ws["X7"] = "Thưởng 3D (3% DS)"
    ws["Y7"] = "Tổng Sale Admin & 3D"

    # Header Cột Z - AC: Phòng Kinh Doanh (BPKD)
    ws["Z5"] = "Phòng Kinh Doanh"
    ws["Z6"] = "P. Kinh doanh"
    ws["Z7"] = "Lương cứng BPKD"
    ws["AA6"] = "Doanh số BPKD"
    ws["AA7"] = "Hoa hồng doanh số"
    ws["AB6"] = "CP vận hành"
    ws["AB7"] = "Công tác phí"
    ws["AC7"] = "Tổng BPKD"

    # Header Cột AD - AF: BỘ PHẬN QUẢN LÝ & KỸ THUẬT XƯỞNG (THÁI, VŨ)
    ws["AD4"] = "Chi phí Bộ Phận Quản Lý & Kỹ Thuật Xưởng"
    ws["AD5"] = "Bộ Phận Quản Lý Xưởng"
    ws["AD6"] = "Lương cứng QL Xưởng\n(Thái 12tr + Vũ 9tr)"
    ws["AD7"] = "Cố định (21tr/tháng)"
    ws["AE6"] = "Thưởng vượt DS xưởng >500M"
    ws["AE7"] = "Thái 0.5% + Vũ 0.3% (=0.8% DS)"
    ws["AF7"] = "Tổng Quản lý Xưởng"

    # Header Cột AG - AI: Hành Chính Nhân Sự & Vận Hành VP
    ws["AG4"] = "Chi phí Bộ Phận Văn Phòng"
    ws["AG5"] = "Hành Chính - Nhân Sự"
    ws["AG6"] = "Lương HCNS / Kế toán"
    ws["AG7"] = "Qũy lương thưởng"
    ws["AH6"] = "CP vận hành VP"
    ws["AH7"] = "Văn phòng phẩm, tiếp khách"
    ws["AI7"] = "Tổng HCNS"

    # Header Cột AW - BC: KHOÁN XƯỞNG & CHI PHÍ MẶT BẰNG, ĐIỆN NƯỚC
    ws["AW5"] = "Gía vốn khoán xưởng\n(40% VT + 15% Thợ)"
    ws["AW6"] = "Khoán xưởng (55%)"
    ws["AW7"] = "VT 40% + Thợ 15%"
    ws["AX6"] = "CP khác / Bảo hành"
    ws["AX7"] = "Dự phòng 2% DS"
    ws["AY5"] = "CHI PHÍ THUÊ & ĐIỆN NƯỚC"
    ws["AY6"] = "Thuê Showroom & VP"
    ws["AY7"] = "Cố định 6tr/tháng"
    ws["AZ6"] = "Thuê Xưởng sản xuất"
    ws["AZ7"] = "Cố định 7tr/tháng"
    ws["BA6"] = "Phương tiện / Vận chuyển"
    ws["BA7"] = "Theo thực tế phát sinh"
    ws["BB6"] = "Điện nước xưởng & VP"
    ws["BB7"] = "Định mức 1.5% DS"
    ws["BC6"] = "Bảo hiểm"
    ws["BC7"] = "BHXH & BHYT"

    # 2. DÒNG 8: HẠN MỨC ĐỊNH MỨC KHOÁN (ROW 8)
    ws["B8"] = 1.0         # Doanh số
    ws["C8"] = 0.0         # Chiết khấu
    ws["E8"] = 0.10        # Tỷ lệ công nợ (10%)
    ws["F8"] = "=1-E8"     # Thu tiền mặt phát sinh trong tháng (90%)
    ws["I8"] = 0.03        # Ban Lãnh đạo định mức (~3%)
    ws["O8"] = 0.01        # Lương MKT (1%)
    ws["Q8"] = 0.01        # Ads MKT (1%)
    ws["T8"] = "=O8+Q8"    # Tổng MKT (2%)
    ws["U8"] = 0.018       # Lương Sale Admin (Hiệp)
    ws["V8"] = 0.005       # Vượt mức Hiệp (>500M là 0.5%)
    ws["W8"] = 0.015       # Thưởng DS riêng Hiệp (5% DS riêng)
    ws["X8"] = 0.03        # Thưởng Thiết kế 3D (3%)
    ws["Y8"] = "=U8+V8+W8+X8" # Tổng Sale Admin & 3D (~6.3%)
    ws["Z8"] = 0.03        # Lương cứng BPKD (~3%)
    ws["AA8"] = 0.05       # Hoa hồng BPKD (5%)
    ws["AC8"] = "=Z8+AA8"  # Tổng BPKD (8%)
    ws["AD8"] = 0.055      # Lương cứng QL Xưởng Thái + Vũ (21M ~ 5.5% trên DS 380M)
    ws["AE8"] = 0.008      # Vượt mức xưởng >500M (Thái 0.5% + Vũ 0.3% = 0.8%)
    ws["AF8"] = "=AD8+AE8" # Tổng QL Xưởng
    ws["AG8"] = 0.01       # Lương HCNS (1%)
    ws["AH8"] = 0.005      # CP Vận hành VP (0.5%)
    ws["AI8"] = "=AG8+AH8" # Tổng HCNS (1.5%)
    ws["AW8"] = 0.55       # Giá vốn khoán xưởng (40% VT + 15% Thợ)
    ws["AX8"] = 0.02       # Chi phí khác (2%)
    ws["AY8"] = 6000000    # Thuê VP (6tr/tháng)
    ws["AZ8"] = 7000000    # Thuê xưởng (7tr/tháng)
    ws["BB8"] = 0.015      # Điện xưởng & VP (1.5% DS)
    
    # Tổng chi phí hệ thống định mức biến phí
    ws["BD8"] = "=AW8+AX8+BB8+AI8+AF8+AC8+Y8+T8+I8"
    ws["BE8"] = "=1-BD8"   # Lợi nhuận VP định mức
    ws["BF8"] = 0.022      # Thặng dư xưởng chuyển giao
    ws["BG8"] = "=+BF8+BE8"# Tổng lợi nhuận trước thuế

    # 3. DỮ LIỆU CHI TIẾT 12 THÁNG NĂM 2026
    # Trong đó:
    # - T6, T7, T8, T9: SỐ LIỆU THỰC TẾ 100% TỪ BẢNG LƯƠNG
    # - T1-T5: Ước tính đầu năm bám sát thực tế
    # - T10-T12: Kế hoạch cao điểm đón Tết (T11: 580M, T12: 520M vượt 500M -> có thưởng vượt mức Cách A!)
    # Cấu trúc tuple:
    # (DoanhSo, CongNo, ThucThu, BanLD, MKT_Luong, MKT_Ads, 
    #  Hiep_CB, Hiep_SaleRieng, Tke3D_pct,
    #  BPKD_CB, BPKD_HH,
    #  QLXuong_CB, 
    #  HCNS, ThueVP, ThueXuong, PK_DT, PK_CP)
    
    monthly_data = {
        1: (250000000, 25000000,  225000000, 12000000, 2500000, 2500000, 6500000, 3000000, 0.03, 10000000, 5000000,  21000000, 3500000, 6000000, 7000000, 0, 0),
        2: (80000000,  8000000,   72000000,  12000000, 1000000, 1000000, 6500000, 1000000, 0.03, 6000000,  1500000,  21000000, 3000000, 6000000, 7000000, 0, 0),
        3: (220000000, 22000000,  198000000, 12000000, 2200000, 2200000, 6500000, 3000000, 0.03, 10000000, 4500000,  21000000, 3500000, 6000000, 7000000, 0, 0),
        4: (300000000, 30000000,  270000000, 12000000, 3000000, 3000000, 6500000, 4000000, 0.03, 12000000, 6000000,  21000000, 4000000, 6000000, 7000000, 0, 0),
        5: (350000000, 35000000,  315000000, 12000000, 3500000, 3500000, 6500000, 4500000, 0.03, 12000000, 7000000,  21000000, 4000000, 6000000, 7000000, 0, 0),
        
        # THÁNG 6 (THỰC TẾ):
        # DS: 289,578,000 | Cọc: 49,578,000 | Nợ: 240,000,000
        # Ban LĐ: Nghĩa 10M + Hương 2M = 12M
        # Hiệp: CB 3.5M (thời điểm T6) + Thưởng DS riêng 1,978,900 = 5,478,900
        # BPKD: Dũng (CB 3.5M + HH 1M = 4.5M) + Bình 2.83M + Hùng 9.60M = 16.92M
        # QL Xưởng: Thái 5,769,231 + Vũ 6,192,308 = 11,961,539 (nửa tháng do công)
        # Thợ trực tiếp xưởng (khoán 15% là 43.44M): Thực tế chi 31,759,304 -> Dôi dư 11.68M!
        6: (289578000, 240000000, 49578000,  12000000, 0,       0,       3500000, 1978900, 0.03, 9423077,  7499999,  11961539, 4000000, 6000000, 7000000, 0, 0),
        
        # THÁNG 7 (THỰC TẾ):
        # DS: 450,000,000 | Nợ: 67,500,000 | Thực thu: 382,500,000
        # Ban LĐ: Nghĩa 10M + Hương 2M + Thưởng Hương 7.97M = 19,970,529
        # Hiệp: CB 6.5M + Thưởng DS riêng 5M = 11,500,000
        # BPKD: Dũng (CB 3.5M + HH 3M = 6.5M) + Bình 1.21M + Hùng 3.48M = 11.69M
        # QL Xưởng: Thái 13.5M (10M + 1.5M thưởng + 2M PC) + Vũ 9M = 22,500,000
        # Thợ trực tiếp xưởng (khoán 15% là 67.5M): Thực tế chi 58,889,062 -> Dôi dư 8.61M!
        7: (450000000, 67500000,  382500000, 19970529, 0,       0,       6500000, 5000000, 0.03, 4711538,  6980000,  22500000, 4500000, 6000000, 7000000, 0, 0),
        
        # THÁNG 8 (THỰC TẾ THEO BẢNG KHỐI LƯỢNG SẢN XUẤT XƯỞNG):
        # Doanh số thực trong tháng của xưởng: 242,051,705 đ | Dư nợ: 69,803,651 đ | Thực thu: 172,248,054 đ
        # Ban LĐ: Nghĩa 10M + Hương 2M = 12M
        # Hiệp: CB 6.5M + Thưởng DS riêng 3M = 9,500,000
        # BPKD: Dũng 10.5M (CB 3.5M + HH 6.5M)
        # QL Xưởng: Thái 12M (10M + 2M PC) + Vũ 7.62M = 19,615,385
        # Thợ trực tiếp xưởng: Thực tế chi 41,285,625 | Khoán 15% DS xưởng: 36,307,756
        # Phụ kiện: Doanh thu 8,840,000, Giá vốn chi phí 6,188,000 (Lãi: 2,652,000)
        8: (242051705, 69803651,  172248054, 12000000, 0,       0,       6500000, 3000000, 0.03, 3500000,  7000000,  19615385, 4000000, 6000000, 7000000, 8840000, 6188000),
        
        # THÁNG 9 (THỰC TẾ THEO BẢNG KHỐI LƯỢNG SẢN XUẤT XƯỞNG):
        # Khối lượng sx trong tháng của xưởng: 287,782,767 đ | Dư nợ: 138,066,647 đ | Thực thu: 149,716,120 đ
        # Ban LĐ: Nghĩa 10M + Hương 2M = 12M
        # Hiệp: CB 6.5M + Thưởng DS riêng 7M = 13,500,000
        # BPKD: Dũng 9,865,385 (CB 3.37M + HH 6M)
        # QL Xưởng: Thái 11.42M + Vũ 8.83M = 20,250,000
        # Thợ trực tiếp xưởng: Thực tế chi 44,052,188 | Khoán 15% DS xưởng: 43,167,415
        # Phụ kiện: Doanh thu 30,000,000, Giá vốn chi phí 21,000,000 (Lãi: 9,000,000)
        9: (287782767, 138066647, 149716120, 12000000, 0,       0,       6500000, 7000000, 0.03, 3365385,  6500000,  20250000, 4500000, 6000000, 7000000, 30000000, 21000000),
        
        # THÁNG 10 (KẾ HOẠCH BẮT ĐẦU VÀO MÙA):
        10: (480000000, 48000000,  432000000, 12000000, 3000000, 3000000, 6500000, 6000000, 0.03, 10000000, 8000000,  21000000, 4500000, 6000000, 7000000, 35000000, 24500000),
        
        # THÁNG 11 (CAO ĐIỂM ĐÓN TẾT - DS: 580M > 500M -> VƯỢT MỨC!):
        # Hiệp vượt mức 0.5% = 2.9M | Thái vượt mức 0.5% = 2.9M | Vũ vượt mức 0.3% = 1.74M
        11: (580000000, 58000000,  522000000, 12000000, 3500000, 3500000, 6500000, 8000000, 0.03, 12000000, 10000000, 21000000, 5000000, 6000000, 7000000, 45000000, 31500000),
        
        # THÁNG 12 (CAO ĐIỂM ĐÓN TẾT - DS: 520M > 500M -> VƯỢT MỨC!):
        # Hiệp vượt mức 0.5% = 2.6M | Thái vượt mức 0.5% = 2.6M | Vũ vượt mức 0.3% = 1.56M
        12: (520000000, 52000000,  468000000, 12000000, 3000000, 3000000, 6500000, 7000000, 0.03, 11000000, 9000000,  21000000, 5000000, 6000000, 7000000, 40000000, 28000000)
    }

    # Format cells & write formulas
    for m in range(1, 13):
        r = 7 + m * 2      # Row giá trị (9, 11, 13, ..., 31)
        r_pct = r + 1      # Row % (10, 12, 14, ..., 32)
        d = monthly_data[m]
        (sales, debt, cash, l_ld, mkt_l, mkt_ads, 
         hiep_cb, hiep_sale, tk3d_p,
         bpkd_cb, bpkd_hh,
         qlx_cb, 
         hcns_val, thue_vp, thue_x, pk_rev, pk_cost) = d

        # Copy style from row 9 & 10
        if r > 11:
            for c in range(1, 67):
                copy_cell_style(source.cell(9, c), ws.cell(r, c))
                copy_cell_style(source.cell(10, c), ws.cell(r_pct, c))

        # A-H: DOANH SỐ & DÒNG TIỀN THỰC THU
        ws[f"A{r}"] = float(m)
        ws[f"B{r}"] = float(sales)
        ws[f"C{r}"] = 0.0
        ws[f"D{r}"] = f"=B{r}-C{r}"
        ws[f"E{r}"] = float(debt)
        ws[f"F{r}"] = f"=D{r}-E{r}"
        ws[f"G{r}"] = f"=E{r-2}" if m > 1 else 0.0
        ws[f"H{r}"] = f"=F{r}+G{r}"

        # I-K: BAN LÃNH ĐẠO (GĐ NGHĨA 10M, PGĐ HƯƠNG 2M)
        ws[f"I{r}"] = float(l_ld)
        ws[f"J{r}"] = 0.0
        ws[f"K{r}"] = f"=I{r}+J{r}"

        # L-N: GĐ KINH DOANH (0)
        ws[f"L{r}"] = 0.0
        ws[f"M{r}"] = 0.0
        ws[f"N{r}"] = f"=L{r}+M{r}"

        # O-T: MARKETING & TRUYỀN THÔNG
        ws[f"O{r}"] = float(mkt_l) if mkt_l > 0 else f"=D{r}*O$8"
        ws[f"P{r}"] = 0.0
        ws[f"Q{r}"] = float(mkt_ads) if mkt_ads > 0 else f"=D{r}*Q$8"
        ws[f"R{r}"] = 0.0
        ws[f"S{r}"] = 0.0
        ws[f"T{r}"] = f"=O{r}+Q{r}"

        # U-Y: P. SALE ADMIN (HIỆP) & THIẾT KẾ 3D
        # U: Lương cứng Sale Admin Hiệp (6.5M/tháng)
        ws[f"U{r}"] = float(hiep_cb)
        # V: Thưởng vượt mức nếu Doanh số xưởng > 500M (Hiệp +0.5% theo Cách A)
        ws[f"V{r}"] = f"=IF(D{r}>500000000, D{r}*0.005, 0)"
        # W: Thưởng hoa hồng Doanh số riêng của Hiệp (5% DS riêng)
        ws[f"W{r}"] = float(hiep_sale)
        # X: Thưởng Thiết kế 3D (3% Doanh thu)
        ws[f"X{r}"] = f"=D{r}*X$8"
        # Y: Tổng Bộ phận Sale Admin & 3D
        ws[f"Y{r}"] = f"=U{r}+V{r}+W{r}+X{r}"

        # Z-AC: PHÒNG KINH DOANH (BPKD)
        # Z: Lương cứng BPKD
        ws[f"Z{r}"] = float(bpkd_cb)
        # AA: Hoa hồng doanh số BPKD
        ws[f"AA{r}"] = float(bpkd_hh)
        # AB: CP Vận hành
        ws[f"AB{r}"] = 0.0
        # AC: Tổng BPKD
        ws[f"AC{r}"] = f"=Z{r}+AA{r}+AB{r}"

        # AD-AF: BỘ PHẬN QUẢN LÝ & KỸ THUẬT XƯỞNG (THÁI 12M, VŨ 9M)
        # AD: Lương cứng Quản lý xưởng Thái + Kỹ thuật Vũ (Cố định 21M/tháng)
        ws[f"AD{r}"] = float(qlx_cb)
        # AE: Thưởng vượt mức xưởng > 500M: Thái 0.5% + Vũ 0.3% = 0.8% tổng Doanh thu theo Cách A
        ws[f"AE{r}"] = f"=IF(D{r}>500000000, D{r}*0.008, 0)"
        # AF: Tổng Quản lý xưởng
        ws[f"AF{r}"] = f"=AD{r}+AE{r}"

        # AG-AI: HÀNH CHÍNH NHÂN SỰ & VẬN HÀNH VP
        ws[f"AG{r}"] = float(hcns_val * 0.7) if hcns_val > 0 else f"=D{r}*AG$8"
        ws[f"AH{r}"] = float(hcns_val * 0.3) if hcns_val > 0 else f"=D{r}*AH$8"
        ws[f"AI{r}"] = f"=AG{r}+AH{r}"

        # AJ-AU: CÁC PHÒNG BAN KHÁC (0)
        for c_idx in range(36, 48):
            c_let = openpyxl.utils.get_column_letter(c_idx)
            ws[f"{c_let}{r}"] = 0.0
        ws[f"AV{r}"] = 0.0

        # AW-BC: KHOÁN XƯỞNG & CHI PHÍ MẶT BẰNG, ĐIỆN NƯỚC
        # AW: Giá vốn khoán xưởng = 55% DS (40% Vật tư + 15% Lương thợ)
        ws[f"AW{r}"] = f"=D{r}*AW$8"
        # AX: Chi phí khác / Dự phòng bảo hành = 2% DS
        ws[f"AX{r}"] = f"=D{r}*AX$8"
        # AY: Tiền thuê Showroom & VP = Cố định 6,000,000 đ/tháng
        ws[f"AY{r}"] = float(thue_vp)
        # AZ: Tiền thuê Xưởng sản xuất = Cố định 7,000,000 đ/tháng
        ws[f"AZ{r}"] = float(thue_x)
        # BA: Phương tiện / Vận chuyển = 0
        ws[f"BA{r}"] = 0.0
        # BB: Tiền điện xưởng và VP = 1.5% doanh số xưởng
        ws[f"BB{r}"] = f"=D{r}*BB$8"
        # BC: Bảo hiểm = 0
        ws[f"BC{r}"] = 0.0

        # BD: TỔNG CHI PHÍ HỆ THỐNG
        # Gồm: Khoán xưởng(AW) + Khác(AX) + Thuê VP(AY) + Thuê Xưởng(AZ) + Phương tiện(BA) + Điện(BB) + BH(BC) 
        #      + HCNS(AI) + QL Xưởng(AF) + BPKD(AC) + SaleAdmin&3D(Y) + MKT(T) + Ban LĐ(I)
        ws[f"BD{r}"] = f"=AW{r}+AX{r}+AY{r}+AZ{r}+BA{r}+BB{r}+BC{r}+AI{r}+AF{r}+AC{r}+Y{r}+T{r}+I{r}"

        # BE: LỢI NHUẬN VĂN PHÒNG
        ws[f"BE{r}"] = f"=D{r}-BD{r}"

        # BF: LỢI NHUẬN THẶNG DƯ XƯỞNG (Định mức 2.2%)
        ws[f"BF{r}"] = f"=D{r}*BF$8"

        # BG: TỔNG CỘNG LỢI NHUẬN TRƯỚC THUẾ
        ws[f"BG{r}"] = f"=+BF{r}+BE{r}"

        # BH-BJ: PHỤ KIỆN BÁN KÈM
        ws[f"BH{r}"] = float(pk_rev)
        ws[f"BI{r}"] = float(pk_cost)
        ws[f"BJ{r}"] = f"=BH{r}-BI{r}"

        # BK-BN: DÒNG TIỀN VÀ TỒN QUỸ
        ws[f"BK{r}"] = f"=E{r}-G{r}"
        ws[f"BL{r}"] = 0.0
        ws[f"BM{r}"] = 0.0
        ws[f"BN{r}"] = f"=BN{r-2}+BE{r}-BK{r}-BL{r}" if m > 1 else f"=200000000+BE{r}-BK{r}-BL{r}"

        # DÒNG TỶ LỆ % (ROW_PCT)
        pct_cols = [
            (9, 'I'), (10, 'J'), (12, 'L'), (13, 'M'), (14, 'N'),
            (15, 'O'), (16, 'P'), (17, 'Q'), (18, 'R'), (19, 'S'), (20, 'T'),
            (21, 'U'), (22, 'V'), (23, 'W'), (24, 'X'), (25, 'Y'),
            (26, 'Z'), (27, 'AA'), (28, 'AB'), (29, 'AC'),
            (30, 'AD'), (31, 'AE'), (32, 'AF'),
            (33, 'AG'), (34, 'AH'), (35, 'AI'),
            (49, 'AW'), (50, 'AX'), (51, 'AY'), (52, 'AZ'), (54, 'BB'),
            (56, 'BD'), (57, 'BE'), (58, 'BF'), (59, 'BG'),
            (60, 'BH'), (61, 'BI'), (62, 'BJ')
        ]
        for col_idx, col_let in pct_cols:
            ws.cell(r_pct, col_idx).value = f"=+{col_let}{r}/$D{r}%"

    # 4. ROW 33: TỔNG NĂM 2026
    for c in range(1, 67):
        copy_cell_style(source.cell(30, c), ws.cell(33, c))
        copy_cell_style(source.cell(31, c), ws.cell(34, c))
        copy_cell_style(source.cell(32, c), ws.cell(35, c))

    value_rows = [7 + m * 2 for m in range(1, 13)] # 9, 11, ..., 31
    ws["A33"] = "Tổng"
    sum_cols = [
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65
    ]
    for c_idx in sum_cols:
        col_let = openpyxl.utils.get_column_letter(c_idx)
        sum_cells = ",".join([f"{col_let}{r}" for r in value_rows])
        ws.cell(33, c_idx).value = f"=SUM({sum_cells})"

    # Row 34: Tỷ lệ % Tổng cả năm
    for c_idx in sum_cols:
        col_let = openpyxl.utils.get_column_letter(c_idx)
        if c_idx not in [1, 2, 3, 4]:
            ws.cell(34, c_idx).value = f"=+{col_let}33/$D33%"

    # Row 35: Bình quân tháng
    ws["B35"] = "=B33/12"
    ws["D35"] = "=D33/12"
    ws["H35"] = "SL Nhân sự"
    ws["I35"] = 2   # GĐ + PGĐ
    ws["U35"] = 1   # Hiệp (Sale Admin)
    ws["Z35"] = 3   # NVKD
    ws["AD35"] = 2  # Quản lý Xưởng: Thái + Kỹ thuật Vũ

    wb.save(file_path)
    print("SUCCESS: Hoàn thiện 100% sheet NĂM 2026 trong Bảng CCSC Văn Phòng.xlsx!")

if __name__ == "__main__":
    build_ccsc_van_phong_2026()
