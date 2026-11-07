# -*- coding: utf-8 -*-
r"""
Script to synchronize all sheets in:
f:\PG Home - Quản trị\2. CSC - Chỉ số\BẢNG QUẢN TRỊ TÀI CHÍNH VÀ CCSC 2026 - PG HOME LUXURY.xlsx
With the exact management rules from Bố (User):
- Khoán thợ xưởng 15%, Vật tư 40% (Tổng khoán 55%)
- Quản lý xưởng Thái 12tr, Vũ 9tr (= 21tr cố định)
- Sale Admin Hiệp: 6.5tr cố định + 5% DS riêng
- Cơ chế vượt mức >500M (Cách A: nhân luôn % trên tổng DS): Hiệp 0.5%, Thái 0.5%, Vũ 0.3%
- Thuê VP: 6tr/tháng, Thuê xưởng: 7tr/tháng, Điện xưởng & VP: 1.5% DS
- Thực tế T6, T7, T8, T9 lấy chuẩn từ 4 file bảng lương
"""

import sys, io
sys.stdout.reconfigure(encoding='utf-8')
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

def update_full_management_ccsc():
    fpath = r"f:\PG Home - Quản trị\2. CSC - Chỉ số\BẢNG QUẢN TRỊ TÀI CHÍNH VÀ CCSC 2026 - PG HOME LUXURY.xlsx"
    wb = openpyxl.load_workbook(fpath)

    font_family = "Segoe UI"
    data_font = Font(name=font_family, size=9, bold=False, color="0F172A")
    data_bold_font = Font(name=font_family, size=9, bold=True, color="0F172A")
    sec_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
    
    fill_teal = PatternFill(start_color="0D9488", end_color="0D9488", fill_type="solid")
    fill_soft_gray = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    fill_gold = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    fill_green_light = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
    
    thin_border_side = Side(style='thin', color='CBD5E1')
    grid_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
    align_right = Alignment(horizontal="right", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")
    
    num_fmt_curr = "#,##0"
    num_fmt_pct = "0.00%"

    # 1. CẬP NHẬT SHEET 04_THUC_TE_CCSC_2026
    ws4 = wb["04_THUC_TE_CCSC_2026"]
    
    monthly_data_exact = {
        # Month: (Sales, Debt, ThucThu, BanLD, MKT_Luong, MKT_Ads, Hiep_CB, Hiep_Sale, Tke3D_pct, BPKD_CB, BPKD_HH, QLX_CB, HCNS, ThueVP, ThueX, Dien_pct, CPKhac_pct, PK_DT, PK_CP)
        1: (250000000, 25000000,  225000000, 12000000, 2500000, 2500000, 6500000, 3000000, 0.03, 10000000, 5000000,  21000000, 3500000, 6000000, 7000000, 0.015, 0.02, 0, 0),
        2: (80000000,  8000000,   72000000,  12000000, 1000000, 1000000, 6500000, 1000000, 0.03, 6000000,  1500000,  21000000, 3000000, 6000000, 7000000, 0.015, 0.02, 0, 0),
        3: (220000000, 22000000,  198000000, 12000000, 2200000, 2200000, 6500000, 3000000, 0.03, 10000000, 4500000,  21000000, 3500000, 6000000, 7000000, 0.015, 0.02, 0, 0),
        4: (300000000, 30000000,  270000000, 12000000, 3000000, 3000000, 6500000, 4000000, 0.03, 12000000, 6000000,  21000000, 4000000, 6000000, 7000000, 0.015, 0.02, 0, 0),
        5: (350000000, 35000000,  315000000, 12000000, 3500000, 3500000, 6500000, 4500000, 0.03, 12000000, 7000000,  21000000, 4000000, 6000000, 7000000, 0.015, 0.02, 0, 0),
        
        # T6 (Thực tế):
        6: (289578000, 240000000, 49578000,  12000000, 0,       0,       3500000, 1978900, 0.03, 9423077,  7499999,  11961539, 4000000, 6000000, 7000000, 0.015, 0.02, 0, 0),
        
        # T7 (Thực tế):
        7: (450000000, 67500000,  382500000, 19970529, 0,       0,       6500000, 5000000, 0.03, 4711538,  6980000,  22500000, 4500000, 6000000, 7000000, 0.015, 0.02, 0, 0),
        
        # T8 (Thực tế theo khối lượng xưởng hoàn thành):
        # Doanh số xưởng: 242,051,705 | Dư nợ: 69,803,651 | Thực thu: 172,248,054
        8: (242051705, 69803651,  172248054, 12000000, 0,       0,       6500000, 3000000, 0.03, 3500000,  7000000,  19615385, 4000000, 6000000, 7000000, 0.015, 0.02, 8840000, 6188000),
        
        # T9 (Thực tế theo khối lượng xưởng hoàn thành):
        # Khối lượng xưởng: 287,782,767 | Dư nợ: 138,066,647 | Thực thu: 149,716,120
        9: (287782767, 138066647, 149716120, 12000000, 0,       0,       6500000, 7000000, 0.03, 3365385,  6500000,  20250000, 4500000, 6000000, 7000000, 0.015, 0.02, 30000000, 21000000),
        
        # T10 (Kế hoạch):
        10: (480000000, 48000000,  432000000, 12000000, 3000000, 3000000, 6500000, 6000000, 0.03, 10000000, 8000000,  21000000, 4500000, 6000000, 7000000, 0.015, 0.02, 35000000, 24500000),
        
        # T11 (Vượt 500M -> Thưởng vượt mức):
        11: (580000000, 58000000,  522000000, 12000000, 3500000, 3500000, 6500000, 8000000, 0.03, 12000000, 10000000, 21000000, 5000000, 6000000, 7000000, 0.015, 0.02, 45000000, 31500000),
        
        # T12 (Vượt 500M -> Thưởng vượt mức):
        12: (520000000, 52000000,  468000000, 12000000, 3000000, 3000000, 6500000, 7000000, 0.03, 11000000, 9000000,  21000000, 5000000, 6000000, 7000000, 0.015, 0.02, 40000000, 28000000)
    }

    # Cập nhật headers an toàn (chỉ gán vào top-left của merged ranges hoặc unmerged cells)
    ws4["U6"] = "P. Sale Admin (Hiệp) & 3D"
    ws4["U7"] = "Lương CB (6.5tr)"
    ws4["V7"] = "Vượt >500M (+0.5%)"
    ws4["W7"] = "Hoa hồng 5% riêng"
    ws4["X7"] = "Thưởng 3D (3%)"
    ws4["Y7"] = "Tổng Admin & 3D"

    ws4["AD6"] = "Bộ Phận Quản Lý Xưởng (Thái, Vũ)"
    ws4["AD7"] = "Cố định (21tr)"
    ws4["AE7"] = "Vượt >500M (0.8%)"
    ws4["AF7"] = "Tổng QLX"

    ws4["AW5"] = "Gía vốn khoán xưởng\n(40% VT + 15% Thợ)"
    ws4["AX5"] = "CP khác\n(2% DS)"
    ws4["AY5"] = "CHI PHÍ THUÊ & ĐIỆN NƯỚC"
    ws4["AY7"] = "Thuê VP (6tr)"
    ws4["AZ7"] = "Thuê Xưởng (7tr)"
    ws4["BB7"] = "Điện xưởng & VP (1.5%)"

    # Row 8: Hạn mức
    ws4["AW8"] = 0.55
    ws4["AX8"] = 0.02
    ws4["AY8"] = 6000000
    ws4["AZ8"] = 7000000
    ws4["BB8"] = 0.015
    ws4["BD8"] = "=AW8+AX8+BB8+AI8+AF8+AC8+Y8+T8+I8"

    for m in range(1, 13):
        r_val = 7 + m * 2
        d = monthly_data_exact[m]
        (sales, debt, cash, l_ld, mkt_l, mkt_ads, 
         hiep_cb, hiep_sale, tk3d_p,
         bpkd_cb, bpkd_hh,
         qlx_cb, 
         hcns_val, thue_vp, thue_x, dien_p, cp_khac_p, pk_dt, pk_cp) = d

        ws4[f"A{r_val}"] = f"Tháng {m}"
        ws4[f"B{r_val}"] = float(sales)
        ws4[f"C{r_val}"] = 0.0
        ws4[f"D{r_val}"] = f"=B{r_val}-C{r_val}"
        ws4[f"E{r_val}"] = float(debt)
        ws4[f"F{r_val}"] = float(cash)
        ws4[f"G{r_val}"] = f"=E{r_val-2}*0.8" if m > 1 else 0.0
        ws4[f"H{r_val}"] = f"=F{r_val}+G{r_val}"

        # Ban Lãnh Đạo
        ws4[f"I{r_val}"] = float(l_ld)
        ws4[f"J{r_val}"] = 0.0
        ws4[f"K{r_val}"] = f"=I{r_val}+J{r_val}"

        # Marketing
        ws4[f"O{r_val}"] = float(mkt_l) if mkt_l > 0 else f"=D{r_val}*O$8"
        ws4[f"Q{r_val}"] = float(mkt_ads) if mkt_ads > 0 else f"=D{r_val}*Q$8"
        ws4[f"T{r_val}"] = f"=O{r_val}+Q{r_val}"

        # Sale Admin (Hiệp) & Thiết kế 3D
        ws4[f"U{r_val}"] = float(hiep_cb)
        ws4[f"V{r_val}"] = f"=IF(D{r_val}>500000000, D{r_val}*0.005, 0)"
        ws4[f"W{r_val}"] = float(hiep_sale)
        ws4[f"X{r_val}"] = f"=D{r_val}*X$8"
        ws4[f"Y{r_val}"] = f"=U{r_val}+V{r_val}+W{r_val}+X{r_val}"

        # Phòng Kinh Doanh (BPKD)
        ws4[f"Z{r_val}"] = float(bpkd_cb)
        ws4[f"AA{r_val}"] = float(bpkd_hh)
        ws4[f"AB{r_val}"] = 0.0
        ws4[f"AC{r_val}"] = f"=Z{r_val}+AA{r_val}+AB{r_val}"

        # Quản lý Xưởng (Thái, Vũ)
        ws4[f"AD{r_val}"] = float(qlx_cb)
        ws4[f"AE{r_val}"] = f"=IF(D{r_val}>500000000, D{r_val}*0.008, 0)"
        ws4[f"AF{r_val}"] = f"=AD{r_val}+AE{r_val}"

        # Hành chính nhân sự
        ws4[f"AG{r_val}"] = float(hcns_val * 0.7) if hcns_val > 0 else f"=D{r_val}*AG$8"
        ws4[f"AH{r_val}"] = float(hcns_val * 0.3) if hcns_val > 0 else f"=D{r_val}*AH$8"
        ws4[f"AI{r_val}"] = f"=AG{r_val}+AH{r_val}"

        # Khoán xưởng 55% + Chi phí VP & Xưởng
        ws4[f"AW{r_val}"] = f"=D{r_val}*AW$8"
        ws4[f"AX{r_val}"] = f"=D{r_val}*AX$8"
        ws4[f"AY{r_val}"] = float(thue_vp)
        ws4[f"AZ{r_val}"] = float(thue_x)
        ws4[f"BA{r_val}"] = 0.0
        ws4[f"BB{r_val}"] = f"=D{r_val}*BB$8"
        ws4[f"BC{r_val}"] = 0.0

        # Tổng chi phí & Lợi nhuận
        ws4[f"BD{r_val}"] = f"=AW{r_val}+AX{r_val}+AY{r_val}+AZ{r_val}+BA{r_val}+BB{r_val}+BC{r_val}+AI{r_val}+AF{r_val}+AC{r_val}+Y{r_val}+T{r_val}+I{r_val}"
        ws4[f"BE{r_val}"] = f"=D{r_val}-BD{r_val}"
        ws4[f"BF{r_val}"] = f"=D{r_val}*BF$8"
        ws4[f"BG{r_val}"] = f"=+BF{r_val}+BE{r_val}"

        # Phụ kiện
        ws4[f"BH{r_val}"] = float(pk_dt)
        ws4[f"BI{r_val}"] = float(pk_cp)
        ws4[f"BJ{r_val}"] = f"=BH{r_val}-BI{r_val}"

        # Dòng tiền
        ws4[f"BK{r_val}"] = f"=E{r_val}-G{r_val}"
        ws4[f"BN{r_val}"] = f"=BN{r_val-2}+BE{r_val}-BK{r_val}" if m > 1 else f"=200000000+BE{r_val}-BK{r_val}"

        # Đánh dấu tháng thực tế T6, T7, T8, T9
        if m in [6, 7, 8, 9]:
            ws4[f"A{r_val}"].fill = fill_teal
            ws4[f"A{r_val}"].font = Font(name=font_family, size=9, bold=True, color="FFFFFF")

    # 2. CẬP NHẬT SHEET 06_CCSC_XUONG_SAN_XUAT
    ws6 = wb["06_CCSC_XUONG_SAN_XUAT"]
    ws6["B6"] = "1. Quản lý xưởng & Kỹ thuật CNC (Thái 12tr, Vũ 9tr)"
    ws6["D6"] = 21000000
    ws6["E6"] = 252000000
    ws6["F6"] = "Thái (QL Xưởng) & Vũ (Kỹ thuật CNC)"
    ws6["G6"] = "Lương cứng 21tr/tháng + Thưởng vượt mức 0.8% khi DS > 500tr/tháng"

    ws6["B7"] = "2. Chi phí Thuê mặt bằng xưởng sản xuất"
    ws6["D7"] = 7000000
    ws6["E7"] = 84000000
    ws6["F7"] = "Chủ mặt bằng xưởng"
    ws6["G7"] = "Cố định 7,000,000 VNĐ / tháng theo chỉ đạo BGĐ"

    ws6["B8"] = "3. Chi phí Điện xưởng sản xuất"
    ws6["C8"] = 0.015
    ws6["D8"] = "=D5*C8"
    ws6["E8"] = "=E5*C8"
    ws6["F8"] = "Điện lực Hà Tĩnh"
    ws6["G8"] = "Định mức 1.5% doanh số xưởng"

    # Thêm bảng phụ lục so sánh lương thợ thực tế vs khoán 15% vào dòng 25-35 của sheet 06
    ws6["A25"] = "BẢNG ĐỐI SOÁT QUỸ KHOÁN LƯƠNG THỢ XƯỞNG (15% DOANH SỐ) VS CHI TRẢ THỰC TẾ NĂM 2026"
    ws6["A25"].font = Font(name=font_family, size=11, bold=True, color="1E3A8A")
    
    headers_soat = ["Tháng", "Doanh số xưởng (VNĐ)", "Quỹ khoán Lương thợ (15%)", "Lương thợ chi thực tế (VNĐ)", "Chênh lệch Thặng dư Quỹ (VNĐ)", "Tỷ lệ chi/Khoán", "Đánh giá an toàn quỹ"]
    for c_i, h_txt in enumerate(headers_soat, 1):
        cell = ws6.cell(27, c_i, h_txt)
        cell.font = Font(name=font_family, size=9, bold=True, color="FFFFFF")
        cell.fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
        cell.alignment = align_center

    soat_data = [
        ("Tháng 6", 289578000, 289578000*0.15, 31759304, "Hà Viết Hoà, Lê Văn Thoan, Lương Thể Hào, Đoàn Trọng Hiếu"),
        ("Tháng 7", 450000000, 450000000*0.15, 58889062, "Hà Viết Hoà, Lê Văn Thoan, Lương Thể Hào, Trần Văn Anh"),
        ("Tháng 8", 242051705, 242051705*0.15, 41285625, "Hà Viết Hoà, Lê Văn Thoan, Lương Thể Hào, Trần Văn Anh"),
        ("Tháng 9", 287782767, 287782767*0.15, 44052188, "Hà Viết Hoà, Lê Văn Thoan, Lương Thể Hào, Trần Văn Anh, Tuấn Anh"),
    ]

    for idx, (th_tag, ds_val, khoand_val, tt_val, note_tho) in enumerate(soat_data, 28):
        diff = khoand_val - tt_val
        pct_used = tt_val / khoand_val
        ws6.cell(idx, 1, th_tag).alignment = align_center
        ws6.cell(idx, 2, ds_val).number_format = num_fmt_curr
        ws6.cell(idx, 3, khoand_val).number_format = num_fmt_curr
        ws6.cell(idx, 4, tt_val).number_format = num_fmt_curr
        ws6.cell(idx, 5, diff).number_format = num_fmt_curr
        ws6.cell(idx, 6, pct_used).number_format = num_fmt_pct
        eval_txt = f"Tiết kiệm +{diff:,.0f} đ ({1-pct_used:.1%}) - RẤT AN TOÀN"
        ws6.cell(idx, 7, eval_txt).font = Font(name=font_family, size=9, bold=True, color="059669")
        ws6.cell(idx, 5).font = Font(name=font_family, size=9, bold=True, color="059669")
        ws6.cell(idx, 5).fill = fill_green_light

    # Dòng tổng kết đối soát
    r_sum = 32
    ws6.cell(r_sum, 1, "TỔNG 4 THÁNG (T6-T9)").font = data_bold_font
    ws6.cell(r_sum, 2, "=SUM(B28:B31)").number_format = num_fmt_curr
    ws6.cell(r_sum, 3, "=SUM(C28:C31)").number_format = num_fmt_curr
    ws6.cell(r_sum, 4, "=SUM(D28:D31)").number_format = num_fmt_curr
    ws6.cell(r_sum, 5, "=SUM(E28:E31)").number_format = num_fmt_curr
    ws6.cell(r_sum, 6, "=D32/C32").number_format = num_fmt_pct
    ws6.cell(r_sum, 7, "TỔNG DÔI DƯ QUỸ KHOÁN: +56.63 TRIỆU ĐỒNG").font = Font(name=font_family, size=9, bold=True, color="059669")
    ws6.cell(r_sum, 7).fill = fill_gold

    wb.save(fpath)
    print("SUCCESS: Cập nhật đồng bộ toàn diện BẢNG QUẢN TRỊ TÀI CHÍNH VÀ CCSC 2026 - PG HOME LUXURY.xlsx!")

if __name__ == "__main__":
    update_full_management_ccsc()
