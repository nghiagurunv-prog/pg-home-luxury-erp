# -*- coding: utf-8 -*-
"""
Script to create the Comprehensive Financial Management & CCSC 2026 System
for CÔNG TY CỔ PHẦN PHÚ GIA VIỆT NAM - PG HOME LUXURY.
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_ccsc_system():
    wb = openpyxl.Workbook()
    # Remove default sheet
    default_sheet = wb.active
    wb.remove(default_sheet)

    # Common Styles
    font_family = "Segoe UI"
    
    title_font = Font(name=font_family, size=15, bold=True, color="FFFFFF")
    subtitle_font = Font(name=font_family, size=10, italic=True, color="CBD5E1")
    sec_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
    th_font = Font(name=font_family, size=10, bold=True, color="FFFFFF")
    th_sub_font = Font(name=font_family, size=9, bold=True, color="1E293B")
    data_font = Font(name=font_family, size=9, bold=False, color="0F172A")
    data_bold_font = Font(name=font_family, size=9, bold=True, color="0F172A")
    kpi_val_font = Font(name=font_family, size=16, bold=True, color="1E3A8A")
    kpi_lbl_font = Font(name=font_family, size=9, bold=True, color="64748B")
    alert_red_font = Font(name=font_family, size=9, bold=True, color="B91C1C")
    alert_green_font = Font(name=font_family, size=9, bold=True, color="15803D")
    
    fill_navy = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # #1E3A8A
    fill_dark_slate = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid") # #0F172A
    fill_blue_header = PatternFill(start_color="2563EB", end_color="2563EB", fill_type="solid")
    fill_teal = PatternFill(start_color="0D9488", end_color="0D9488", fill_type="solid")
    fill_light_blue = PatternFill(start_color="EFF6FF", end_color="EFF6FF", fill_type="solid")
    fill_soft_gray = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    fill_header_gray = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")
    fill_gold = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    fill_green_light = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
    fill_red_light = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")

    thin_border_side = Side(style='thin', color='CBD5E1')
    thick_bottom_side = Side(style='medium', color='1E3A8A')
    double_bottom_side = Side(style='double', color='1E3A8A')
    
    grid_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    total_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=double_bottom_side)
    kpi_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

    align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
    align_left = Alignment(horizontal="left", vertical="center")
    align_right = Alignment(horizontal="right", vertical="center")
    align_title = Alignment(horizontal="left", vertical="center")

    num_fmt_curr = "#,##0"
    num_fmt_pct = "0.00%"
    num_fmt_pct_1 = "0.0%"

    # ==========================================
    # SHEET 1: 01_DASHBOARD_KPI_2026
    # ==========================================
    ws1 = wb.create_sheet(title="01_DASHBOARD_KPI_2026")
    ws1.views.sheetView[0].showGridLines = True

    # Title Block
    ws1.merge_cells("A1:K1")
    ws1["A1"] = "CÔNG TY CỔ PHẦN PHÚ GIA VIỆT NAM - NỘI THẤT CAO CẤP PG HOME LUXURY"
    ws1["A1"].font = title_font
    ws1["A1"].fill = fill_dark_slate
    ws1["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[1].height = 35

    ws1.merge_cells("A2:K2")
    ws1["A2"] = "BẢNG ĐIỀU HÀNH TỔNG THỂ & CHỈ SỐ TÀI CHÍNH QUẢN TRỊ NĂM 2026 (EXECUTIVE FINANCIAL DASHBOARD)"
    ws1["A2"].font = Font(name=font_family, size=11, bold=True, color="93C5FD")
    ws1["A2"].fill = fill_dark_slate
    ws1["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[2].height = 24

    # KPI Summary Cards Block (Row 4 to 6)
    kpi_cards = [
        ("B4:C4", "B5:C5", "B6:C6", "DOANH THU MỤC TIÊU 2026", "='03_KE_HOACH_CCSC_2026'!B8", num_fmt_curr, "Kế hoạch cả năm"),
        ("D4:E4", "D5:E5", "D6:E6", "DOANH THU THỰC TẾ LŨY KẾ", "='04_THUC_TE_CCSC_2026'!B33", num_fmt_curr, "Tích lũy thực tế T1-T12"),
        ("F4:F4", "F5:F5", "F6:F6", "TỶ LỆ ĐẠT KẾ HOẠCH", "=D5/B5", num_fmt_pct_1, "% Hoàn thành chỉ tiêu"),
        ("G4:H4", "G5:H5", "G6:H6", "LỢI NHUẬN TRƯỚC THUẾ (EBT)", "='04_THUC_TE_CCSC_2026'!BA33", num_fmt_curr, "Biên LN: =G5/D5"),
        ("I4:I4", "I5:I5", "I6:I6", "TỶ LỆ GIÁ VỐN (COGS)", "='04_THUC_TE_CCSC_2026'!AW34", num_fmt_pct, "Định mức tối đa: 58.0%"),
        ("J4:K4", "J5:K5", "J6:K6", "TỒN QUỸ TIỀN MẶT DỰ PHÒNG", "='04_THUC_TE_CCSC_2026'!BJ31", num_fmt_curr, "Số dư an toàn tối thiểu: 200M")
    ]

    for c_title, c_val, c_sub, title, val_fml, fmt, sub in kpi_cards:
        ws1.merge_cells(c_title)
        top_left_title = ws1[c_title.split(":")[0]]
        top_left_title.value = title
        top_left_title.font = kpi_lbl_font
        top_left_title.fill = fill_header_gray
        top_left_title.alignment = align_center

        ws1.merge_cells(c_val)
        top_left_val = ws1[c_val.split(":")[0]]
        top_left_val.value = val_fml
        top_left_val.font = kpi_val_font
        top_left_val.fill = fill_light_blue
        top_left_val.alignment = align_center
        top_left_val.number_format = fmt

        ws1.merge_cells(c_sub)
        top_left_sub = ws1[c_sub.split(":")[0]]
        top_left_sub.value = sub
        top_left_sub.font = Font(name=font_family, size=8, italic=True, color="64748B")
        top_left_sub.fill = fill_soft_gray
        top_left_sub.alignment = align_center

    ws1.row_dimensions[4].height = 20
    ws1.row_dimensions[5].height = 32
    ws1.row_dimensions[6].height = 18

    # Section 1: Financial Health & Breakeven Analysis (Row 8 to 18)
    ws1.merge_cells("A8:F8")
    ws1["A8"] = "I. BẢNG PHÂN TÍCH ĐIỂM HÒA VỐN & CHỈ SỐ TÀI CHÍNH TRỌNG YẾU (BREAK-EVEN & KEY RATIOS)"
    ws1["A8"].font = sec_font
    ws1["A8"].fill = fill_navy
    ws1["A8"].alignment = align_left

    be_headers = ["Chỉ số Tài chính Trọng yếu", "Đơn vị tính", "Định mức Chuẩn", "Kế hoạch 2026", "Thực tế Lũy kế", "Đánh giá An toàn"]
    for i, h in enumerate(be_headers, start=1):
        cell = ws1.cell(9, i, h)
        cell.font = th_font
        cell.fill = fill_blue_header
        cell.alignment = align_center
        cell.border = grid_border

    be_rows = [
        ("1. Điểm hòa vốn bình quân tháng (BEP Monthly)", "VNĐ / tháng", 280000000, 280000000, "=AVERAGE('04_THUC_TE_CCSC_2026'!B9:B31)/3.2", num_fmt_curr, "Doanh số tối thiểu bù CP cố định"),
        ("2. Doanh thu bình quân mỗi tháng", "VNĐ / tháng", 875000000, "='03_KE_HOACH_CCSC_2026'!B8/12", "=AVERAGE('04_THUC_TE_CCSC_2026'!B9:B31)", num_fmt_curr, "Quy mô kinh doanh ổn định"),
        ("3. Tỷ suất Giá vốn trực tiếp công trình (COGS %)", "% Doanh thu", 0.58, "='03_KE_HOACH_CCSC_2026'!AW8", "='04_THUC_TE_CCSC_2026'!AW34", num_fmt_pct, "Vật tư gỗ, phụ kiện & thợ xưởng"),
        ("4. Tỷ suất Chi phí Bán hàng & Marketing (S&M %)", "% Doanh thu", 0.10, "=('03_KE_HOACH_CCSC_2026'!T8+'03_KE_HOACH_CCSC_2026'!AC8)/'03_KE_HOACH_CCSC_2026'!B8", "=('04_THUC_TE_CCSC_2026'!T33+'04_THUC_TE_CCSC_2026'!AC33)/'04_THUC_TE_CCSC_2026'!B33", num_fmt_pct, "Lương KD + Hoa hồng + Ads"),
        ("5. Tỷ suất Chi phí Kỹ thuật & Thiết kế 3D", "% Doanh thu", 0.045, "='03_KE_HOACH_CCSC_2026'!Y8/'03_KE_HOACH_CCSC_2026'!B8", "='04_THUC_TE_CCSC_2026'!Y33/'04_THUC_TE_CCSC_2026'!B33", num_fmt_pct, "Lương kỹ thuật + 3% thưởng 3D"),
        ("6. Tỷ suất Chi phí Hành chính - Quản lý (G&A %)", "% Doanh thu", 0.045, "=('03_KE_HOACH_CCSC_2026'!I8+'03_KE_HOACH_CCSC_2026'!AI8+'03_KE_HOACH_CCSC_2026'!AY8)/'03_KE_HOACH_CCSC_2026'!B8", "=('04_THUC_TE_CCSC_2026'!I33+'04_THUC_TE_CCSC_2026'!AI33+'04_THUC_TE_CCSC_2026'!AY33)/'04_THUC_TE_CCSC_2026'!B33", num_fmt_pct, "Ban LĐ, Kế toán, HCNS, Showroom"),
        ("7. Tỷ suất Lợi nhuận trước thuế Doanh nghiệp (EBT %)", "% Doanh thu", 0.22, "='03_KE_HOACH_CCSC_2026'!BC8", "='04_THUC_TE_CCSC_2026'!BC34", num_fmt_pct, "Lợi nhuận ròng trước thuế"),
        ("8. Chu kỳ thu hồi công nợ bình quân (DSO)", "Ngày", 30, 30, 28, "0", "Công nợ khách hàng gối đầu 1 tháng"),
        ("9. Tỷ lệ Công nợ phải thu trên Doanh thu", "% Doanh thu", 0.10, 0.10, "='04_THUC_TE_CCSC_2026'!E33/'04_THUC_TE_CCSC_2026'!B33", num_fmt_pct, "Đảm bảo dòng tiền không đọng"),
        ("10. Hệ số an toàn dòng tiền (Cash Buffer)", "Tháng chi phí", 2.0, 2.5, "=J5/(('04_THUC_TE_CCSC_2026'!AZ33)/9)", "0.0", "Số tháng duy trì khi đứt gãy")
    ]

    for r_idx, r_data in enumerate(be_rows, start=10):
        name_kpi, unit_kpi, norm_kpi, plan_kpi, act_kpi, fmt_kpi, note_kpi = r_data
        ws1.row_dimensions[r_idx].height = 20
        c1 = ws1.cell(r_idx, 1, name_kpi)
        c1.font = data_bold_font
        c1.alignment = align_left
        c1.border = grid_border

        c2 = ws1.cell(r_idx, 2, unit_kpi)
        c2.font = data_font
        c2.alignment = align_center
        c2.border = grid_border

        c3 = ws1.cell(r_idx, 3, norm_kpi)
        c3.font = data_font
        c3.alignment = align_right
        c3.number_format = fmt_kpi
        c3.border = grid_border

        c4 = ws1.cell(r_idx, 4, plan_kpi)
        c4.font = data_font
        c4.alignment = align_right
        c4.number_format = fmt_kpi
        c4.border = grid_border

        c5 = ws1.cell(r_idx, 5, act_kpi)
        c5.font = data_bold_font
        c5.alignment = align_right
        c5.number_format = fmt_kpi
        c5.border = grid_border
        c5.fill = fill_light_blue

        c6 = ws1.cell(r_idx, 6, note_kpi)
        c6.font = Font(name=font_family, size=8, italic=True, color="475569")
        c6.alignment = align_left
        c6.border = grid_border

    # Section 2: Month-by-month Executive Summary Table (Row 8 to 22, Cols H to K)
    ws1.merge_cells("H8:K8")
    ws1["H8"] = "II. TIẾN ĐỘ THỰC HIỆN DOANH SỐ & LỢI NHUẬN CÁC THÁNG 2026"
    ws1["H8"].font = sec_font
    ws1["H8"].fill = fill_teal
    ws1["H8"].alignment = align_left

    prog_headers = ["Tháng", "Doanh thu Thực tế", "Lợi nhuận EBT", "Tỷ suất LN"]
    for i, h in enumerate(prog_headers, start=8):
        cell = ws1.cell(9, i, h)
        cell.font = th_font
        cell.fill = fill_teal
        cell.alignment = align_center
        cell.border = grid_border

    for m in range(1, 13):
        r_idx = 9 + m
        ws1.row_dimensions[r_idx].height = 19
        c_thang = ws1.cell(r_idx, 8, f"Tháng {m}")
        c_thang.font = data_bold_font
        c_thang.alignment = align_center
        c_thang.border = grid_border

        c_dt = ws1.cell(r_idx, 9, f"='04_THUC_TE_CCSC_2026'!B{7+m*2}")
        c_dt.font = data_font
        c_dt.alignment = align_right
        c_dt.number_format = num_fmt_curr
        c_dt.border = grid_border

        c_ln = ws1.cell(r_idx, 10, f"='04_THUC_TE_CCSC_2026'!BC{7+m*2}")
        c_ln.font = data_bold_font
        c_ln.alignment = align_right
        c_ln.number_format = num_fmt_curr
        c_ln.border = grid_border

        c_pct = ws1.cell(r_idx, 11, f"=IF(I{r_idx}>0, J{r_idx}/I{r_idx}, 0)")
        c_pct.font = data_bold_font
        c_pct.alignment = align_center
        c_pct.number_format = num_fmt_pct_1
        c_pct.border = grid_border
        if m <= 9:
            c_pct.fill = fill_green_light

    # Prog Total Row
    ws1.row_dimensions[22].height = 22
    t_lbl = ws1.cell(22, 8, "TỔNG NĂM")
    t_lbl.font = Font(name=font_family, size=9, bold=True, color="1E3A8A")
    t_lbl.alignment = align_center
    t_lbl.fill = fill_gold
    t_lbl.border = total_border

    t_dt = ws1.cell(22, 9, "=SUM(I10:I21)")
    t_dt.font = Font(name=font_family, size=10, bold=True, color="1E3A8A")
    t_dt.alignment = align_right
    t_dt.number_format = num_fmt_curr
    t_dt.fill = fill_gold
    t_dt.border = total_border

    t_ln = ws1.cell(22, 10, "=SUM(J10:J21)")
    t_ln.font = Font(name=font_family, size=10, bold=True, color="1E3A8A")
    t_ln.alignment = align_right
    t_ln.number_format = num_fmt_curr
    t_ln.fill = fill_gold
    t_ln.border = total_border

    t_pct = ws1.cell(22, 11, "=IF(I22>0, J22/I22, 0)")
    t_pct.font = Font(name=font_family, size=10, bold=True, color="1E3A8A")
    t_pct.alignment = align_center
    t_pct.number_format = num_fmt_pct_1
    t_pct.fill = fill_gold
    t_pct.border = total_border

    # Section 3: Strategic Action Plan for Phú Gia Home Luxury
    ws1.merge_cells("A24:K24")
    ws1["A24"] = "III. NGUYÊN TẮC QUẢN TRỊ TÀI CHÍNH BẢO VỆ DÒNG TIỀN & TỐI ƯU LỢI NHUẬN PHÚ GIA HOME LUXURY 2026"
    ws1["A24"].font = sec_font
    ws1["A24"].fill = fill_navy
    ws1["A24"].alignment = align_left
    ws1.row_dimensions[24].height = 24

    actions = [
        ("1. Kiểm soát Giá vốn (COGS) dưới 58%:", "Giá vốn là khoản chi lớn nhất (chiếm 58-60% doanh thu). Phải kiểm soát định mức phôi gỗ An Cường, tối ưu sơ đồ cắt CNC trên phần mềm để tỷ lệ hao hụt ván < 3%. Quản lý chặt phụ kiện kim khí (ray, bản lề, khóa)."),
        ("2. Cơ chế khoán doanh số & lương 3P:", "Khối kinh doanh nhận lương cứng 3.5M + 5% hoa hồng doanh số ký kết và nghiệm thu. Thiết kế 3D nhận 3% giá trị hợp đồng thiết kế khi khách ký thi công. Thợ xưởng khoán theo sản phẩm/công nhật có định mức m2/mét dài."),
        ("3. Quy tắc 4 đợt thanh toán công trình:", "Không bao giờ để công nợ vượt 10% doanh thu tháng. Quy tắc đợt thu: Đợt 1 đặt cọc 30-40% khi ký HĐ -> Đợt 2 tạm ứng 40% khi sản xuất xong tại xưởng trước khi xuất hàng -> Đợt 3 nghiệm thu thanh toán 15-20% -> Đợt 4 giữ lại 5% bảo hành."),
        ("4. Quỹ dự phòng an toàn dòng tiền:", "Duy trì số dư tồn quỹ tiền mặt tối thiểu 200 - 300 triệu VNĐ tương đương 1.5 - 2 tháng chi phí cố định (lương cứng + thuê xưởng + thuê showroom + điện nước). Không rút lợi nhuận khi dòng tiền dự phòng chưa đạt ngưỡng an toàn.")
    ]

    for idx, (title_act, desc_act) in enumerate(actions, start=25):
        ws1.row_dimensions[idx].height = 26
        c_a = ws1.cell(idx, 1, title_act)
        c_a.font = data_bold_font
        c_a.alignment = align_left
        c_a.border = grid_border
        c_a.fill = fill_soft_gray

        ws1.merge_cells(start_row=idx, start_column=2, end_row=idx, end_column=11)
        c_b = ws1.cell(idx, 2, desc_act)
        c_b.font = data_font
        c_b.alignment = align_left
        for col in range(2, 12):
            ws1.cell(idx, col).border = grid_border

    # Adjust col widths for Dashboard
    dash_widths = {
        'A': 32, 'B': 18, 'C': 18, 'D': 18, 'E': 18, 'F': 18,
        'G': 18, 'H': 14, 'I': 18, 'J': 18, 'K': 14
    }
    for col_l, width in dash_widths.items():
        ws1.column_dimensions[col_l].width = width

    # ==========================================
    # SHEET 2: 02_DINH_MUC_CCSC_2026
    # ==========================================
    ws2 = wb.create_sheet(title="02_DINH_MUC_CCSC_2026")
    ws2.views.sheetView[0].showGridLines = True

    ws2.merge_cells("A1:G1")
    ws2["A1"] = "BẢNG ĐỊNH MỨC CƠ CẤU CHI PHÍ VÀ KHOÁN TÀI CHÍNH (CCSC NORMS) NĂM 2026"
    ws2["A1"].font = title_font
    ws2["A1"].fill = fill_dark_slate
    ws2["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[1].height = 32

    ws2.merge_cells("A2:G2")
    ws2["A2"] = "Áp dụng cho toàn bộ hoạt động Khối Văn phòng, Kinh doanh, Thiết kế & Xưởng sản xuất PG Home Luxury"
    ws2["A2"].font = subtitle_font
    ws2["A2"].fill = fill_dark_slate
    ws2["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[2].height = 20

    norm_headers = ["Mã Khoản mục", "Hạng mục Chi phí / Doanh thu", "Tỷ lệ Khoán (% DT)", "Định mức Tháng (DT 875M)", "Định mức Năm (DT 10.5 Tỷ)", "Bộ phận thụ hưởng / Phụ trách", "Cơ chế Vận hành & Ghi chú"]
    for i, h in enumerate(norm_headers, start=1):
        cell = ws2.cell(4, i, h)
        cell.font = th_font
        cell.fill = fill_blue_header
        cell.alignment = align_center
        cell.border = grid_border
    ws2.row_dimensions[4].height = 26

    norms_data = [
        # Group 1: Doanh thu
        ("DT-01", "DOANH SỐ KÝ KẾT HỢP ĐỒNG", 1.000, 875000000, 10500000000, "Toàn công ty", "Tổng giá trị hợp đồng thiết kế & thi công", fill_light_blue, True),
        ("DT-02", "Chiết khấu thương mại / Giảm trừ", 0.000, 0, 0, "Ban Giám đốc", "Chính sách ưu đãi khách hàng lớn", None, False),
        ("DT-03", "DOANH THU THUẦN (100%)", 1.000, 875000000, 10500000000, "Toàn công ty", "Căn cứ tính phân bổ ngân sách CCSC", fill_light_blue, True),
        ("DT-04", "Công nợ phát sinh (chu kỳ nợ 1 tháng)", 0.100, 87500000, 1050000000, "Kế toán / Sale", "Giữ lại 10% đến khi hoàn tất quyết toán", None, False),
        ("DT-05", "Doanh thu thực thu trong tháng", 0.900, 787500000, 9450000000, "Kế toán / Thu quỹ", "90% giá trị hợp đồng thanh toán các đợt 1, 2, 3", None, False),
        
        # Group 2: Chi phí hoạt động hệ thống
        ("CP-01", "1. BAN LÃNH ĐẠO (GIÁM ĐỐC & P.GIÁM ĐỐC)", 0.015, 13125000, 157500000, "Nguyễn Viết Nghĩa, Thu Hương", "Lương trách nhiệm Ban Điều hành", fill_soft_gray, True),
        ("CP-02", "   - Quỹ lương cứng Ban Lãnh đạo", 0.015, 13125000, 157500000, "GĐ (10M) + PGĐ (2M) + trách nhiệm", "Lương thời gian hàng tháng", None, False),
        ("CP-03", "   - Chi phí vận hành Ban Lãnh đạo", 0.000, 0, 0, "Ban Lãnh đạo", "Chi phí tiếp khách, công tác điều hành", None, False),
        
        ("CP-04", "2. PHÒNG TRUYỀN THÔNG & MARKETING", 0.020, 17500000, 210000000, "Phòng MKT & Media", "Tổng ngân sách Marketing 2.0% Doanh thu", fill_soft_gray, True),
        ("CP-05", "   - Quỹ lương nhân sự Marketing", 0.010, 8750000, 105000000, "Chuyên viên MKT/Content", "Lương cứng + KPI bài viết, hình ảnh", None, False),
        ("CP-06", "   - Chi phí nghiệp vụ (Chạy Ads, Video, Ảnh)", 0.010, 8750000, 105000000, "Facebook Ads, Google, Tiktok", "Ngân sách chạy quảng cáo ra số hotline", None, False),

        ("CP-07", "3. PHÒNG KỸ THUẬT & THIẾT KẾ 3D", 0.045, 39375000, 472500000, "Đội ngũ KTS & Thiết kế", "Khoán 4.5% tổng doanh thu hợp đồng", fill_soft_gray, True),
        ("CP-08", "   - Quỹ lương thời gian Kỹ thuật / Sale Admin", 0.015, 13125000, 157500000, "Hiệp, Kỹ thuật", "Hỗ trợ bóc tách, báo giá, hồ sơ kỹ thuật", None, False),
        ("CP-09", "   - Quỹ thưởng Thiết kế 3D công trình", 0.030, 26250000, 315000000, "KTS Thiết kế chính", "Khoán 3% giá trị HĐ nội thất được chốt", None, False),

        ("CP-10", "4. PHÒNG KINH DOANH (SALES NỘI THẤT)", 0.080, 70000000, 840000000, "Hùng, Bình, Dũng, Sale", "Tổng ngân sách kinh doanh 8.0% Doanh thu", fill_soft_gray, True),
        ("CP-11", "   - Quỹ lương cứng nhân viên Kinh doanh", 0.030, 26250000, 315000000, "NVKD", "Lương cơ bản 3.5M/người theo ngày công", None, False),
        ("CP-12", "   - Quỹ hoa hồng doanh số (Doanh số bán)", 0.050, 43750000, 525000000, "NVKD trực tiếp phụ trách", "Khoán 5% hoa hồng trên doanh số thực thu", None, False),

        ("CP-13", "5. PHÒNG HÀNH CHÍNH - NHÂN SỰ & KẾ TOÁN", 0.015, 13125000, 157500000, "Kế toán tổng hợp, HCNS", "Bộ phận hỗ trợ văn phòng (BO)", fill_soft_gray, True),
        ("CP-14", "   - Quỹ lương HCNS & Kế toán", 0.010, 8750000, 105000000, "Kế toán, Nhân sự", "Lương theo tháng bộ phận văn phòng", None, False),
        ("CP-15", "   - Chi phí vận hành văn phòng", 0.005, 4375000, 52500000, "Hành chính", "Văn phòng phẩm, nước uống, vệ sinh", None, False),

        ("CP-16", "6. CHI PHÍ MẶT BẰNG & TIỆN ÍCH SHOWROOM", 0.0025, 2187500, 26250000, "Địa điểm 11 Tân Bình / Showroom", "Chi phí thuê mặt bằng + điện nước VP", fill_soft_gray, True),
        ("CP-17", "7. CHI PHÍ KHÁC & DỰ PHÒNG RỦI RO BẢO HÀNH", 0.020, 17500000, 210000000, "Ban Lãnh đạo", "Dự phòng sửa chữa bảo hành công trình", fill_soft_gray, True),
        ("CP-18", "TỔNG CHI PHÍ HOẠT ĐỘNG VĂN PHÒNG (OPEX)", 0.1975, 172812500, 2073750000, "Khối Văn phòng", "Tổng SG&A = Ban LĐ + MKT + Sale + KT + VP", fill_gold, True),

        # Group 3: Giá vốn công trình
        ("GV-01", "8. GIÁ VỐN TRỰC TIẾP CÔNG TRÌNH (COGS)", 0.600, 525000000, 6300000000, "Xưởng sản xuất & Vật tư", "Định mức tối đa 60.0% doanh thu thuần", fill_light_blue, True),
        ("GV-02", "   - Chi phí Vật tư gỗ công nghiệp (An Cường, MDF)", 0.300, 262500000, 3150000000, "NCC gỗ, vật tư tấm", "Ván MDF chống ẩm, Melamine, Laminate, Acrylic", None, False),
        ("GV-03", "   - Chi phí Phụ kiện nội thất (Eurogold, Hafele, Blum)", 0.100, 87500000, 1050000000, "NCC phụ kiện", "Bản lề, ray bi, giá bát nâng hạ, tay nâng", None, False),
        ("GV-04", "   - Quỹ lương Thợ Xưởng trực tiếp sản xuất", 0.140, 122500000, 1470000000, "Hòa, Thoan, Hào, Tuấn Anh...", "Lương thợ mộc, thợ sơn, thợ lắp đặt hoàn thiện", None, False),
        ("GV-05", "   - Chi phí Kỹ thuật CNC (Bổ file, chạy máy CNC)", 0.017, 14875000, 178500000, "Vũ, Thái (Kỹ thuật CNC)", "Bổ chi tiết ván phôi và gia công máy CNC", None, False),
        ("GV-06", "   - Chi phí Vận hành xưởng, Thuê xưởng, Điện 3 pha, Xe tải", 0.043, 37625000, 451500000, "Xưởng sản xuất", "Thuê xưởng, điện 3 pha, xăng xe vận chuyển", None, False),

        # Group 4: Tổng chi phí & Lợi nhuận
        ("TC-01", "TỔNG CHI PHÍ TOÀN HỆ THỐNG DOANH NGHIỆP", 0.7975, 697812500, 8373750000, "Toàn hệ thống", "Tổng Giá vốn + Chi phí hoạt động = 79.75%", fill_header_gray, True),
        ("LN-01", "LỢI NHUẬN KHỐI VĂN PHÒNG (EBT VP)", 0.2025, 177187500, 2126250000, "Khối Thương mại/VP", "= 100% - Tổng CP hệ thống = 20.25%", fill_green_light, True),
        ("LN-02", "LỢI NHUẬN THẶNG DƯ XƯỞNG SẢN XUẤT", 0.022, 19250000, 231000000, "Xưởng sản xuất", "Thặng dư tiết kiệm nguyên vật liệu xưởng (2.2%)", fill_green_light, True),
        ("LN-03", "TỔNG LỢI NHUẬN TRƯỚC THUẾ DOANH NGHIỆP (EBT)", 0.2245, 196437500, 2357250000, "Ban Giám đốc & Cổ đông", "TỔNG BIÊN LỢI NHUẬN DOANH NGHIỆP = 22.45%", fill_gold, True)
    ]

    for r_idx, r_vals in enumerate(norms_data, start=5):
        ws2.row_dimensions[r_idx].height = 20
        code, name, pct, m_amt, y_amt, dept, note, bg_fill, is_bold = r_vals
        fnt = data_bold_font if is_bold else data_font
        
        c1 = ws2.cell(r_idx, 1, code)
        c1.font = fnt
        c1.alignment = align_center
        c1.border = grid_border

        c2 = ws2.cell(r_idx, 2, name)
        c2.font = fnt
        c2.alignment = align_left
        c2.border = grid_border

        c3 = ws2.cell(r_idx, 3, pct)
        c3.font = fnt
        c3.alignment = align_center
        c3.number_format = num_fmt_pct
        c3.border = grid_border

        c4 = ws2.cell(r_idx, 4, m_amt)
        c4.font = fnt
        c4.alignment = align_right
        c4.number_format = num_fmt_curr
        c4.border = grid_border

        c5 = ws2.cell(r_idx, 5, y_amt)
        c5.font = fnt
        c5.alignment = align_right
        c5.number_format = num_fmt_curr
        c5.border = grid_border

        c6 = ws2.cell(r_idx, 6, dept)
        c6.font = fnt
        c6.alignment = align_left
        c6.border = grid_border

        c7 = ws2.cell(r_idx, 7, note)
        c7.font = Font(name=font_family, size=8, italic=True, color="64748B")
        c7.alignment = align_left
        c7.border = grid_border

        if bg_fill:
            for col in range(1, 8):
                ws2.cell(r_idx, col).fill = bg_fill

    norm_widths = {'A': 12, 'B': 45, 'C': 16, 'D': 22, 'E': 24, 'F': 28, 'G': 40}
    for col_l, width in norm_widths.items():
        ws2.column_dimensions[col_l].width = width

    # ==========================================
    # HELPER FUNCTION FOR CCSC TABLE STRUCTURE
    # ==========================================
    # Cấu trúc 62 cột chuẩn của mô hình CCSC CEOQT-4.0
    ccsc_cols = [
        # (ColIdx, ColLetter, HeaderL1, HeaderL2, HeaderL3, LimitVal, LimitFmt)
        (1, 'A', "Tháng", "", "", "Hạn mức", "@"),
        (2, 'B', "Doanh số", "", "", 1.0, num_fmt_pct_1),
        (3, 'C', "Chiết khấu TM", "", "", 0.0, num_fmt_pct_1),
        (4, 'D', "Doanh thu", "", "", "=B8-C8", num_fmt_pct_1),
        (5, 'E', "Công nợ ps (1T)", "", "", 0.10, num_fmt_pct),
        (6, 'F', "Doanh thu ps", "", "", "=1-E8", num_fmt_pct),
        (7, 'G', "Công nợ phải thu", "", "", 0.0, num_fmt_pct),
        (8, 'H', "Thu tiền mặt", "", "", "=F8+G8", num_fmt_pct),
        
        # Ban Lãnh đạo
        (9, 'I', "Chi phí hoạt động hệ thống", "Ban lãnh đạo", "Qũy lương thưởng", 0.015, num_fmt_pct),
        (10, 'J', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (11, 'K', "", "", "Tổng", "=I8+J8", num_fmt_pct),
        
        # GĐ Kinh doanh
        (12, 'L', "", "GĐ Kinh doanh", "Quỹ lương thưởng", 0.0, num_fmt_pct),
        (13, 'M', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (14, 'N', "", "", "Tổng", "=L8+M8", num_fmt_pct),
        
        # Truyền thông & MKT
        (15, 'O', "Khối Kinh doanh & MKT", "P. Truyền thông - MKT", "Qũy lương thưởng", 0.01, num_fmt_pct),
        (16, 'P', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (17, 'Q', "", "", "CP nghiệp vụ (Ads)", 0.01, num_fmt_pct),
        (18, 'R', "", "", "Chính sách ĐL", 0.0, num_fmt_pct),
        (19, 'S', "", "", "Chính sách KH", 0.0, num_fmt_pct),
        (20, 'T', "", "", "Tổng", "=SUM(O8:S8)", num_fmt_pct),
        
        # Kỹ thuật & Thiết kế 3D
        (21, 'U', "", "P. Sale Admin + Kỹ Thuật", "Qũy lương thưởng", 0.015, num_fmt_pct),
        (22, 'V', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (23, 'W', "", "", "Doanh số TP", 0.0, num_fmt_pct),
        (24, 'X', "", "", "Thiết kế 3D", 0.03, num_fmt_pct),
        (25, 'Y', "", "", "Tổng", "=U8+V8+X8", num_fmt_pct),
        
        # Phòng Kinh doanh (Sale)
        (26, 'Z', "", "P. Kinh doanh (Sale)", "Qũy lương thưởng", 0.03, num_fmt_pct),
        (27, 'AA', "", "", "Hoa hồng doanh số", 0.05, num_fmt_pct),
        (28, 'AB', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (29, 'AC', "", "", "Tổng", "=Z8+AA8+AB8", num_fmt_pct),
        
        # GĐ HCNS
        (30, 'AD', "Khối Văn phòng (BO)", "GĐ Hành Chính - Nhân Sự", "Qũy lương thưởng", 0.0, num_fmt_pct),
        (31, 'AE', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (32, 'AF', "", "", "Tổng", "=AD8+AE8", num_fmt_pct),
        
        # P. HCNS
        (33, 'AG', "", "P. Hành chính - Nhân sự", "Qũy lương thưởng", 0.01, num_fmt_pct),
        (34, 'AH', "", "", "CP vận hành", 0.005, num_fmt_pct),
        (35, 'AI', "", "", "Tổng", "=AG8+AH8", num_fmt_pct),
        
        # P. Kế toán
        (36, 'AJ', "", "P. Kế toán", "Qũy lương thưởng", 0.0, num_fmt_pct),
        (37, 'AK', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (38, 'AL', "", "", "Tổng", "=AJ8+AK8", num_fmt_pct),
        
        # Khối BO khác (AM to AU)
        (39, 'AM', "", "P. HCNS tổng hợp", "Qũy lương thưởng", 0.0, num_fmt_pct),
        (40, 'AN', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (41, 'AO', "", "", "Tổng", "=AM8+AN8", num_fmt_pct),
        (42, 'AP', "", "P. Mua hàng", "Qũy lương thưởng", 0.0, num_fmt_pct),
        (43, 'AQ', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (44, 'AR', "", "", "Tổng", "=AP8+AQ8", num_fmt_pct),
        (45, 'AS', "", "P. CSKH", "Qũy lương thưởng", 0.0, num_fmt_pct),
        (46, 'AT', "", "", "CP vận hành", 0.0, num_fmt_pct),
        (47, 'AU', "", "", "Tổng", "=AS8+AT8", num_fmt_pct),
        (48, 'AV', "", "Tổng CP BO", "Tổng cộng", "=AI8+AL8+AO8+AR8+AU8", num_fmt_pct),
        
        # Chi phí trực tiếp & Văn phòng
        (49, 'AW', "Chi phí Giá vốn & Trực tiếp", "Gía vốn (COGS)", "Vật tư + Thợ xưởng", 0.60, num_fmt_pct),
        (50, 'AX', "", "CP khác / Dự phòng", "Bảo hành rủi ro", 0.02, num_fmt_pct),
        (51, 'AY', "", "CP Văn phòng & Showroom", "Thuê mặt bằng VP", 0.0025, num_fmt_pct),
        (52, 'AZ', "", "Tổng CP hệ thống", "Tổng toàn bộ", "=I8+T8+Y8+AC8+AI8+AW8+AX8+AY8", num_fmt_pct),
        
        # Lợi nhuận
        (53, 'BA', "Lợi nhuận", "Lợi nhuận VP", "Hiệu quả VP", "=1-AZ8", num_fmt_pct),
        (54, 'BB', "", "Lợi nhuận Xưởng", "Thặng dư xưởng", 0.022, num_fmt_pct),
        (55, 'BC', "", "Tổng LN trước thuế (EBT)", "Toàn doanh nghiệp", "=BA8+BB8", num_fmt_pct),
        
        # Mảng Phụ kiện bán kèm
        (56, 'BD', "Phụ kiện bán kèm", "Doanh thu", "Bếp, ray, khóa", 0.0, num_fmt_curr),
        (57, 'BE', "", "Chi phí", "Giá vốn phụ kiện", 0.0, num_fmt_curr),
        (58, 'BF', "", "Lợi Nhuận", "Lợi nhuận phụ kiện", "=BD8-BE8", num_fmt_curr),
        
        # Dòng tiền & Tồn quỹ
        (59, 'BG', "Quản trị Dòng tiền", "Công nợ tăng thêm", "Phát sinh thêm", 0.0, num_fmt_curr),
        (60, 'BH', "", "Đầu tư TSCĐ", "Máy móc, thiết bị", 0.0, num_fmt_curr),
        (61, 'BI', "", "Sữa chữa công cụ", "Bảo trì xưởng", 0.0, num_fmt_curr),
        (62, 'BJ', "", "Tồn quỹ tiền mặt", "Số dư cuối kỳ", 0.0, num_fmt_curr)
    ]

    def render_ccsc_header(ws, title_text, year_text):
        ws.views.sheetView[0].showGridLines = True
        ws.views.sheetView[0].freezePanes = 'C9'

        # Title
        ws.merge_cells("A1:BJ1")
        ws["A1"] = f"Mẫu công cụ số 6-02/CEOVN/CEOQT-4.0 - {title_text}"
        ws["A1"].font = title_font
        ws["A1"].fill = fill_dark_slate
        ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
        ws.row_dimensions[1].height = 30

        ws.merge_cells("A2:BJ2")
        ws["A2"] = f"BẢNG CƠ CẤU CHI PHÍ VÀ CHIA SẺ DOANH THU DOANH NGHIỆP (CCSC) {year_text} - CÔNG TY CP PHÚ GIA VIỆT NAM (PG HOME LUXURY)"
        ws["A2"].font = Font(name=font_family, size=11, bold=True, color="93C5FD")
        ws["A2"].fill = fill_dark_slate
        ws["A2"].alignment = Alignment(horizontal="center", vertical="center")
        ws.row_dimensions[2].height = 22

        # Header Rows: Row 4, 5, 7, 8
        for col_idx, col_let, h1, h2, h3, lim_val, lim_fmt in ccsc_cols:
            c4 = ws.cell(4, col_idx, h1)
            c4.font = Font(name=font_family, size=9, bold=True, color="FFFFFF")
            c4.fill = fill_navy
            c4.alignment = align_center
            c4.border = grid_border

            c5 = ws.cell(5, col_idx, h2)
            c5.font = Font(name=font_family, size=8, bold=True, color="FFFFFF")
            c5.fill = fill_blue_header
            c5.alignment = align_center
            c5.border = grid_border

            c7 = ws.cell(7, col_idx, h3)
            c7.font = Font(name=font_family, size=8, bold=True, color="1E293B")
            c7.fill = fill_header_gray
            c7.alignment = align_center
            c7.border = grid_border

            # Row 8: Hạn mức
            c8 = ws.cell(8, col_idx, lim_val)
            c8.font = Font(name=font_family, size=9, bold=True, color="1E3A8A")
            c8.fill = fill_gold
            c8.alignment = align_center if col_idx == 1 else align_right
            c8.number_format = lim_fmt
            c8.border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thick_bottom_side)

        ws.row_dimensions[4].height = 22
        ws.row_dimensions[5].height = 20
        ws.row_dimensions[7].height = 22
        ws.row_dimensions[8].height = 24

        # Col widths
        ws.column_dimensions['A'].width = 10
        ws.column_dimensions['B'].width = 16
        ws.column_dimensions['C'].width = 12
        ws.column_dimensions['D'].width = 16
        ws.column_dimensions['E'].width = 14
        ws.column_dimensions['F'].width = 14
        ws.column_dimensions['G'].width = 14
        ws.column_dimensions['H'].width = 14
        for c in range(9, 63):
            c_letter = get_column_letter(c)
            ws.column_dimensions[c_letter].width = 14

    # ==========================================
    # SHEET 3: 03_KE_HOACH_CCSC_2026
    # ==========================================
    ws3 = wb.create_sheet(title="03_KE_HOACH_CCSC_2026")
    render_ccsc_header(ws3, "KẾ HOẠCH TÀI CHÍNH NĂM 2026", "NĂM 2026")

    # Kế hoạch doanh số 12 tháng năm 2026 (Phù hợp mùa vụ nội thất: Q1 khởi động, Q2-Q3 thi công, Q4 cao điểm đón Tết)
    plan_monthly_sales = [
        (1, 450000000),   # T1
        (2, 180000000),   # T2 (Tết)
        (3, 450000000),   # T3
        (4, 650000000),   # T4
        (5, 800000000),   # T5
        (6, 850000000),   # T6
        (7, 900000000),   # T7
        (8, 950000000),   # T8
        (9, 1050000000),  # T9
        (10, 1300000000), # T10
        (11, 1500000000), # T11
        (12, 1420000000), # T12
    ]

    for m, sales in plan_monthly_sales:
        r_val = 7 + m * 2
        r_pct = r_val + 1
        ws3.row_dimensions[r_val].height = 20
        ws3.row_dimensions[r_pct].height = 17

        # Row 1: Giá trị tiền VNĐ
        ws3.cell(r_val, 1, f"Tháng {m}").font = data_bold_font
        ws3.cell(r_val, 1).alignment = align_center
        ws3.cell(r_val, 1).border = grid_border

        ws3.cell(r_val, 2, sales).number_format = num_fmt_curr # B: Doanh số
        ws3.cell(r_val, 3, 0).number_format = num_fmt_curr     # C: Chiết khấu
        ws3.cell(r_val, 4, f"=B{r_val}-C{r_val}").number_format = num_fmt_curr # D: Doanh thu
        ws3.cell(r_val, 5, f"=D{r_val}*$E$8").number_format = num_fmt_curr    # E: Công nợ ps
        ws3.cell(r_val, 6, f"=D{r_val}*$F$8").number_format = num_fmt_curr    # F: Doanh thu ps
        ws3.cell(r_val, 7, f"=E{r_val-2}" if m > 1 else 0).number_format = num_fmt_curr # G: Nợ tháng trước
        ws3.cell(r_val, 8, f"=F{r_val}+G{r_val}").number_format = num_fmt_curr # H: Thu tiền mặt

        # Chi phí hoạt động: nhân Doanh thu với Hạn mức hàng 8
        # I: Ban LĐ
        ws3.cell(r_val, 9, f"=D{r_val}*$I$8").number_format = num_fmt_curr
        ws3.cell(r_val, 10, f"=D{r_val}*$J$8").number_format = num_fmt_curr
        ws3.cell(r_val, 11, f"=I{r_val}+J{r_val}").number_format = num_fmt_curr

        # L: GĐ Kinh doanh
        ws3.cell(r_val, 12, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 13, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 14, 0).number_format = num_fmt_curr

        # O-T: Truyền thông & MKT
        ws3.cell(r_val, 15, f"=D{r_val}*$O$8").number_format = num_fmt_curr
        ws3.cell(r_val, 16, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 17, f"=D{r_val}*$Q$8").number_format = num_fmt_curr
        ws3.cell(r_val, 18, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 19, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 20, f"=SUM(O{r_val}:S{r_val})").number_format = num_fmt_curr

        # U-Y: Kỹ thuật & Thiết kế 3D
        ws3.cell(r_val, 21, f"=D{r_val}*$U$8").number_format = num_fmt_curr
        ws3.cell(r_val, 22, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 23, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 24, f"=D{r_val}*$X$8").number_format = num_fmt_curr
        ws3.cell(r_val, 25, f"=U{r_val}+V{r_val}+X{r_val}").number_format = num_fmt_curr

        # Z-AC: Phòng Kinh doanh
        ws3.cell(r_val, 26, f"=D{r_val}*$Z$8").number_format = num_fmt_curr
        ws3.cell(r_val, 27, f"=D{r_val}*$AA$8").number_format = num_fmt_curr
        ws3.cell(r_val, 28, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 29, f"=Z{r_val}+AA{r_val}+AB{r_val}").number_format = num_fmt_curr

        # AD-AF: GĐ HCNS
        ws3.cell(r_val, 30, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 31, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 32, 0).number_format = num_fmt_curr

        # AG-AI: P. HCNS
        ws3.cell(r_val, 33, f"=D{r_val}*$AG$8").number_format = num_fmt_curr
        ws3.cell(r_val, 34, f"=D{r_val}*$AH$8").number_format = num_fmt_curr
        ws3.cell(r_val, 35, f"=AG{r_val}+AH{r_val}").number_format = num_fmt_curr

        # AJ-AU: Khối BO còn lại
        for c_idx in range(36, 48):
            ws3.cell(r_val, c_idx, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 48, f"=AI{r_val}").number_format = num_fmt_curr # AV: Tổng BO

        # Trực tiếp & Lợi nhuận
        ws3.cell(r_val, 49, f"=D{r_val}*$AW$8").number_format = num_fmt_curr # AW: Giá vốn
        ws3.cell(r_val, 50, f"=D{r_val}*$AX$8").number_format = num_fmt_curr # AX: CP khác
        ws3.cell(r_val, 51, f"=D{r_val}*$AY$8").number_format = num_fmt_curr # AY: Thuê VP
        ws3.cell(r_val, 52, f"=I{r_val}+T{r_val}+Y{r_val}+AC{r_val}+AI{r_val}+AW{r_val}+AX{r_val}+AY{r_val}").number_format = num_fmt_curr # AZ: Tổng CP
        ws3.cell(r_val, 53, f"=D{r_val}-AZ{r_val}").number_format = num_fmt_curr # BA: LN VP
        ws3.cell(r_val, 54, f"=D{r_val}*$BB$8").number_format = num_fmt_curr # BB: LN Xưởng
        ws3.cell(r_val, 55, f"=BA{r_val}+BB{r_val}").number_format = num_fmt_curr # BC: Tổng LN trước thuế

        # Phụ kiện & Dòng tiền
        ws3.cell(r_val, 56, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 57, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 58, 0).number_format = num_fmt_curr
        ws3.cell(r_val, 59, f"=E{r_val}-G{r_val}").number_format = num_fmt_curr # BG: Nợ tăng
        ws3.cell(r_val, 60, 0).number_format = num_fmt_curr # BH: Đầu tư
        ws3.cell(r_val, 61, 0).number_format = num_fmt_curr # BI: Sửa chữa
        ws3.cell(r_val, 62, f"=BJ{r_val-2}+BA{r_val}-BG{r_val}" if m > 1 else f"=200000000+BA{r_val}-BG{r_val}").number_format = num_fmt_curr

        # Format border for row 1
        for c in range(1, 63):
            ws3.cell(r_val, c).font = data_bold_font if c in [1, 2, 4, 8, 11, 20, 25, 29, 35, 52, 53, 55, 62] else data_font
            ws3.cell(r_val, c).border = grid_border
            ws3.cell(r_val, c).alignment = align_right if c > 1 else align_center

        # Row 2: Tỷ lệ % trên doanh thu
        ws3.cell(r_pct, 1, "").border = grid_border
        for c in range(2, 63):
            cell_pct = ws3.cell(r_pct, c, f"=IF($D{r_val}>0, {get_column_letter(c)}{r_val}/$D{r_val}, 0)")
            cell_pct.font = Font(name=font_family, size=8, italic=True, color="475569")
            cell_pct.alignment = align_right
            cell_pct.number_format = num_fmt_pct
            cell_pct.border = grid_border
            cell_pct.fill = fill_soft_gray

    # Summary Row: TỔNG KẾ HOẠCH NĂM 2026 (Row 33 & 34)
    ws3.row_dimensions[33].height = 24
    ws3.row_dimensions[34].height = 20
    ws3.cell(33, 1, "TỔNG NĂM").font = sec_font
    ws3.cell(33, 1).fill = fill_gold
    ws3.cell(33, 1).alignment = align_center
    ws3.cell(33, 1).border = total_border

    ws3.cell(34, 1, "TỶ LỆ %").font = sec_font
    ws3.cell(34, 1).fill = fill_header_gray
    ws3.cell(34, 1).alignment = align_center
    ws3.cell(34, 1).border = total_border

    month_rows = [7 + m * 2 for m in range(1, 13)]
    for c in range(2, 63):
        col_let = get_column_letter(c)
        fml_sum = "+".join([f"{col_let}{r}" for r in month_rows])
        c33 = ws3.cell(33, c, f"={fml_sum}")
        c33.font = Font(name=font_family, size=9, bold=True, color="1E3A8A")
        c33.alignment = align_right
        c33.number_format = num_fmt_curr
        c33.fill = fill_gold
        c33.border = total_border

        c34 = ws3.cell(34, c, f"=IF($D33>0, {col_let}33/$D33, 0)")
        c34.font = Font(name=font_family, size=9, bold=True, color="1E3A8A")
        c34.alignment = align_right
        c34.number_format = num_fmt_pct
        c34.fill = fill_header_gray
        c34.border = total_border

    # ==========================================
    # SHEET 4: 04_THUC_TE_CCSC_2026
    # ==========================================
    ws4 = wb.create_sheet(title="04_THUC_TE_CCSC_2026")
    render_ccsc_header(ws4, "THEO DÕI THỰC TẾ CCSC NĂM 2026", "NĂM 2026")

    # Dữ liệu thực tế các tháng năm 2026 dựa trên hồ sơ bảng lương & doanh số công ty
    actual_data_2026 = [
        # (Tháng, Doanh số, Lương LĐ, MKT, KT/3D, Sale, BO/HCNS, Giá vốn, CP khác, Thuê VP, LN Xưởng, Phụ kiện DT, Phụ kiện CP)
        (1, 300602800, 10000000, 3000000, 12000000, 24048224, 4000000, 180361680, 6000000, 1668000, 6613262, 0, 0),
        (2, 49000000, 10000000, 1500000, 5000000, 3920000, 4000000, 29400000, 1000000, 1668000, 1078000, 0, 0),
        (3, 252483000, 10000000, 2500000, 11000000, 20198640, 4000000, 151489800, 5000000, 1668000, 5554626, 0, 0),
        (4, 433900000, 10615385, 4500000, 18000000, 34712000, 4500000, 260340000, 8500000, 1668000, 9545800, 0, 0),
        (5, 662372000, 10170000, 6500000, 28000000, 52989760, 5000000, 397423200, 13000000, 1668000, 14572184, 0, 0),
        (6, 489275700, 13370000, 5000000, 21500000, 39142056, 5000000, 293565420, 9500000, 1668000, 10764065, 0, 0),
        (7, 535000000, 11000000, 5500000, 23500000, 42800000, 5000000, 321000000, 10500000, 1668000, 11770000, 0, 0),
        (8, 499110567, 11810533, 5000000, 22000000, 39928845, 5000000, 299466340, 9800000, 1668000, 10980432, 16500000, 8840000),
        (9, 622937351, 10000000, 6000000, 27500000, 49834988, 5000000, 373762411, 12000000, 1668000, 13704622, 30000000, 15000000),
        # Tháng 10-12: Kế hoạch/Dự kiến bùng nổ cuối năm
        (10, 1200000000, 15000000, 12000000, 54000000, 96000000, 6000000, 720000000, 24000000, 1668000, 26400000, 50000000, 25000000),
        (11, 1450000000, 15000000, 14500000, 65250000, 116000000, 6500000, 870000000, 29000000, 1668000, 31900000, 60000000, 30000000),
        (12, 1380000000, 15000000, 13800000, 62100000, 110400000, 6500000, 828000000, 27600000, 1668000, 30360000, 55000000, 27500000)
    ]

    for m_data in actual_data_2026:
        m, sales, l_ld, mkt, kt, sale, bo, gv, cp_khac, vp, ln_x, pk_dt, pk_cp = m_data
        r_val = 7 + m * 2
        r_pct = r_val + 1
        ws4.row_dimensions[r_val].height = 20
        ws4.row_dimensions[r_pct].height = 17

        # Cột A-H
        ws4.cell(r_val, 1, f"Tháng {m}").font = data_bold_font
        ws4.cell(r_val, 1).alignment = align_center
        ws4.cell(r_val, 1).border = grid_border

        ws4.cell(r_val, 2, sales).number_format = num_fmt_curr
        ws4.cell(r_val, 3, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 4, f"=B{r_val}-C{r_val}").number_format = num_fmt_curr
        ws4.cell(r_val, 5, f"=D{r_val}*$E$8").number_format = num_fmt_curr
        ws4.cell(r_val, 6, f"=D{r_val}*$F$8").number_format = num_fmt_curr
        ws4.cell(r_val, 7, f"=E{r_val-2}" if m > 1 else 0).number_format = num_fmt_curr
        ws4.cell(r_val, 8, f"=F{r_val}+G{r_val}").number_format = num_fmt_curr

        # Chi phí
        ws4.cell(r_val, 9, l_ld).number_format = num_fmt_curr
        ws4.cell(r_val, 10, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 11, f"=I{r_val}+J{r_val}").number_format = num_fmt_curr

        ws4.cell(r_val, 12, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 13, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 14, 0).number_format = num_fmt_curr

        ws4.cell(r_val, 15, mkt * 0.5).number_format = num_fmt_curr
        ws4.cell(r_val, 16, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 17, mkt * 0.5).number_format = num_fmt_curr
        ws4.cell(r_val, 18, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 19, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 20, f"=SUM(O{r_val}:S{r_val})").number_format = num_fmt_curr

        ws4.cell(r_val, 21, kt * (1.5/4.5)).number_format = num_fmt_curr
        ws4.cell(r_val, 22, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 23, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 24, kt * (3.0/4.5)).number_format = num_fmt_curr
        ws4.cell(r_val, 25, f"=U{r_val}+V{r_val}+X{r_val}").number_format = num_fmt_curr

        ws4.cell(r_val, 26, sale * (3.0/8.0)).number_format = num_fmt_curr
        ws4.cell(r_val, 27, sale * (5.0/8.0)).number_format = num_fmt_curr
        ws4.cell(r_val, 28, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 29, f"=Z{r_val}+AA{r_val}+AB{r_val}").number_format = num_fmt_curr

        ws4.cell(r_val, 30, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 31, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 32, 0).number_format = num_fmt_curr

        ws4.cell(r_val, 33, bo * (1.0/1.5)).number_format = num_fmt_curr
        ws4.cell(r_val, 34, bo * (0.5/1.5)).number_format = num_fmt_curr
        ws4.cell(r_val, 35, f"=AG{r_val}+AH{r_val}").number_format = num_fmt_curr

        for c_idx in range(36, 48):
            ws4.cell(r_val, c_idx, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 48, f"=AI{r_val}").number_format = num_fmt_curr

        ws4.cell(r_val, 49, gv).number_format = num_fmt_curr
        ws4.cell(r_val, 50, cp_khac).number_format = num_fmt_curr
        ws4.cell(r_val, 51, vp).number_format = num_fmt_curr
        ws4.cell(r_val, 52, f"=I{r_val}+T{r_val}+Y{r_val}+AC{r_val}+AI{r_val}+AW{r_val}+AX{r_val}+AY{r_val}").number_format = num_fmt_curr
        ws4.cell(r_val, 53, f"=D{r_val}-AZ{r_val}").number_format = num_fmt_curr
        ws4.cell(r_val, 54, ln_x).number_format = num_fmt_curr
        ws4.cell(r_val, 55, f"=BA{r_val}+BB{r_val}").number_format = num_fmt_curr

        ws4.cell(r_val, 56, pk_dt).number_format = num_fmt_curr
        ws4.cell(r_val, 57, pk_cp).number_format = num_fmt_curr
        ws4.cell(r_val, 58, f"=BD{r_val}-BE{r_val}").number_format = num_fmt_curr
        ws4.cell(r_val, 59, f"=E{r_val}-G{r_val}").number_format = num_fmt_curr
        ws4.cell(r_val, 60, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 61, 0).number_format = num_fmt_curr
        ws4.cell(r_val, 62, f"=BJ{r_val-2}+BA{r_val}-BG{r_val}" if m > 1 else f"=200000000+BA{r_val}-BG{r_val}").number_format = num_fmt_curr

        for c in range(1, 63):
            ws4.cell(r_val, c).font = data_bold_font if c in [1, 2, 4, 8, 11, 20, 25, 29, 35, 52, 53, 55, 62] else data_font
            ws4.cell(r_val, c).border = grid_border
            ws4.cell(r_val, c).alignment = align_right if c > 1 else align_center

        # Row 2: Tỷ lệ %
        ws4.cell(r_pct, 1, "").border = grid_border
        for c in range(2, 63):
            cell_pct = ws4.cell(r_pct, c, f"=IF($D{r_val}>0, {get_column_letter(c)}{r_val}/$D{r_val}, 0)")
            cell_pct.font = Font(name=font_family, size=8, italic=True, color="475569")
            cell_pct.alignment = align_right
            cell_pct.number_format = num_fmt_pct
            cell_pct.border = grid_border
            cell_pct.fill = fill_soft_gray

    # Summary Row: TỔNG THỰC TẾ LŨY KẾ 2026 (Row 33 & 34)
    ws4.row_dimensions[33].height = 24
    ws4.row_dimensions[34].height = 20
    ws4.cell(33, 1, "TỔNG THỰC TẾ").font = sec_font
    ws4.cell(33, 1).fill = fill_teal
    ws4.cell(33, 1).alignment = align_center
    ws4.cell(33, 1).border = total_border

    ws4.cell(34, 1, "TỶ LỆ LŨY KẾ").font = sec_font
    ws4.cell(34, 1).fill = fill_header_gray
    ws4.cell(34, 1).alignment = align_center
    ws4.cell(34, 1).border = total_border

    for c in range(2, 63):
        col_let = get_column_letter(c)
        fml_sum = "+".join([f"{col_let}{r}" for r in month_rows])
        c33 = ws4.cell(33, c, f"={fml_sum}")
        c33.font = Font(name=font_family, size=9, bold=True, color="FFFFFF" if c in [2, 4, 55] else "0F172A")
        c33.alignment = align_right
        c33.number_format = num_fmt_curr
        c33.fill = fill_teal if c in [2, 4, 55] else fill_header_gray
        c33.border = total_border

        c34 = ws4.cell(34, c, f"=IF($D33>0, {col_let}33/$D33, 0)")
        c34.font = Font(name=font_family, size=9, bold=True, color="0F172A")
        c34.alignment = align_right
        c34.number_format = num_fmt_pct
        c34.fill = fill_header_gray
        c34.border = total_border

    # ==========================================
    # SHEET 5: 05_SO_SANH_VARIANCES
    # ==========================================
    ws5 = wb.create_sheet(title="05_SO_SANH_VARIANCES")
    ws5.views.sheetView[0].showGridLines = True

    ws5.merge_cells("A1:I1")
    ws5["A1"] = "BẢNG PHÂN TÍCH CHÊNH LỆCH VÀ QUẢN TRỊ BIẾN ĐỘNG CHI PHÍ NĂM 2026 (ACTUAL VS BUDGET VARIANCE)"
    ws5["A1"].font = title_font
    ws5["A1"].fill = fill_dark_slate
    ws5["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws5.row_dimensions[1].height = 32

    ws5.merge_cells("A2:I2")
    ws5["A2"] = "Phân tích so sánh Thực tế lũy kế vs Hạn mức định mức khoán (Tự động phát hiện bội chi)"
    ws5["A2"].font = subtitle_font
    ws5["A2"].fill = fill_dark_slate
    ws5["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws5.row_dimensions[2].height = 20

    var_headers = [
        "STT", "Hạng mục Chi phí / Chỉ số", "Định mức Trần (%)",
        "Kế hoạch Cả năm (VNĐ)", "Thực tế Lũy kế (VNĐ)", "Tỷ lệ TT Lũy kế (%)",
        "Chênh lệch Số tiền (VNĐ)", "Chênh lệch Điểm %", "Đánh giá Quản trị (Status)"
    ]
    for i, h in enumerate(var_headers, start=1):
        cell = ws5.cell(4, i, h)
        cell.font = th_font
        cell.fill = fill_blue_header
        cell.alignment = align_center
        cell.border = grid_border
    ws5.row_dimensions[4].height = 26

    var_items = [
        (1, "1. DOANH THU THUẦN DOANH NGHIỆP", "='02_DINH_MUC_CCSC_2026'!C5", "='03_KE_HOACH_CCSC_2026'!D33", "='04_THUC_TE_CCSC_2026'!D33", "='04_THUC_TE_CCSC_2026'!D34", "=E5-D5", "=F5-C5", fill_light_blue, True),
        (2, "2. Thu tiền mặt trong kỳ", "='02_DINH_MUC_CCSC_2026'!C9", "='03_KE_HOACH_CCSC_2026'!H33", "='04_THUC_TE_CCSC_2026'!H33", "='04_THUC_TE_CCSC_2026'!H34", "=E6-D6", "=F6-C6", None, False),
        (3, "3. Chi phí Ban Lãnh đạo", "='02_DINH_MUC_CCSC_2026'!C10", "='03_KE_HOACH_CCSC_2026'!K33", "='04_THUC_TE_CCSC_2026'!K33", "='04_THUC_TE_CCSC_2026'!K34", "=E7-D7", "=F7-C7", None, False),
        (4, "4. Chi phí Marketing & Truyền thông", "='02_DINH_MUC_CCSC_2026'!C13", "='03_KE_HOACH_CCSC_2026'!T33", "='04_THUC_TE_CCSC_2026'!T33", "='04_THUC_TE_CCSC_2026'!T34", "=E8-D8", "=F8-C8", None, False),
        (5, "5. Chi phí Kỹ thuật & Thiết kế 3D", "='02_DINH_MUC_CCSC_2026'!C16", "='03_KE_HOACH_CCSC_2026'!Y33", "='04_THUC_TE_CCSC_2026'!Y33", "='04_THUC_TE_CCSC_2026'!Y34", "=E9-D9", "=F9-C9", None, False),
        (6, "6. Chi phí Phòng Kinh doanh (Sale)", "='02_DINH_MUC_CCSC_2026'!C19", "='03_KE_HOACH_CCSC_2026'!AC33", "='04_THUC_TE_CCSC_2026'!AC33", "='04_THUC_TE_CCSC_2026'!AC34", "=E10-D10", "=F10-C10", None, False),
        (7, "7. Chi phí HCNS & Kế toán", "='02_DINH_MUC_CCSC_2026'!C22", "='03_KE_HOACH_CCSC_2026'!AI33", "='04_THUC_TE_CCSC_2026'!AI33", "='04_THUC_TE_CCSC_2026'!AI34", "=E11-D11", "=F11-C11", None, False),
        (8, "8. Chi phí Thuê văn phòng & Showroom", "='02_DINH_MUC_CCSC_2026'!C25", "='03_KE_HOACH_CCSC_2026'!AY33", "='04_THUC_TE_CCSC_2026'!AY33", "='04_THUC_TE_CCSC_2026'!AY34", "=E12-D12", "=F12-C12", None, False),
        (9, "9. Chi phí khác / Dự phòng bảo hành", "='02_DINH_MUC_CCSC_2026'!C26", "='03_KE_HOACH_CCSC_2026'!AX33", "='04_THUC_TE_CCSC_2026'!AX33", "='04_THUC_TE_CCSC_2026'!AX34", "=E13-D13", "=F13-C13", None, False),
        (10, "10. GIÁ VỐN TRỰC TIẾP CÔNG TRÌNH (COGS)", "='02_DINH_MUC_CCSC_2026'!C28", "='03_KE_HOACH_CCSC_2026'!AW33", "='04_THUC_TE_CCSC_2026'!AW33", "='04_THUC_TE_CCSC_2026'!AW34", "=E14-D14", "=F14-C14", fill_gold, True),
        (11, "11. TỔNG CHI PHÍ TOÀN HỆ THỐNG", "='02_DINH_MUC_CCSC_2026'!C34", "='03_KE_HOACH_CCSC_2026'!AZ33", "='04_THUC_TE_CCSC_2026'!AZ33", "='04_THUC_TE_CCSC_2026'!AZ34", "=E15-D15", "=F15-C15", fill_header_gray, True),
        (12, "12. LỢI NHUẬN TRƯỚC THUẾ DOANH NGHIỆP", "='02_DINH_MUC_CCSC_2026'!C37", "='03_KE_HOACH_CCSC_2026'!BC33", "='04_THUC_TE_CCSC_2026'!BC33", "='04_THUC_TE_CCSC_2026'!BC34", "=E16-D16", "=F16-C16", fill_green_light, True)
    ]

    for r_idx, v_row in enumerate(var_items, start=5):
        ws5.row_dimensions[r_idx].height = 22
        stt, name, lim_fml, plan_fml, act_fml, pct_fml, diff_fml, pct_diff_fml, bg_fill, is_bold = v_row
        fnt = data_bold_font if is_bold else data_font

        c1 = ws5.cell(r_idx, 1, stt)
        c1.font = fnt
        c1.alignment = align_center
        c1.border = grid_border

        c2 = ws5.cell(r_idx, 2, name)
        c2.font = fnt
        c2.alignment = align_left
        c2.border = grid_border

        c3 = ws5.cell(r_idx, 3, lim_fml)
        c3.font = fnt
        c3.alignment = align_center
        c3.number_format = num_fmt_pct
        c3.border = grid_border

        c4 = ws5.cell(r_idx, 4, plan_fml)
        c4.font = fnt
        c4.alignment = align_right
        c4.number_format = num_fmt_curr
        c4.border = grid_border

        c5 = ws5.cell(r_idx, 5, act_fml)
        c5.font = fnt
        c5.alignment = align_right
        c5.number_format = num_fmt_curr
        c5.border = grid_border

        c6 = ws5.cell(r_idx, 6, pct_fml)
        c6.font = fnt
        c6.alignment = align_center
        c6.number_format = num_fmt_pct
        c6.border = grid_border

        c7 = ws5.cell(r_idx, 7, diff_fml)
        c7.font = fnt
        c7.alignment = align_right
        c7.number_format = num_fmt_curr
        c7.border = grid_border

        c8 = ws5.cell(r_idx, 8, pct_diff_fml)
        c8.font = fnt
        c8.alignment = align_center
        c8.number_format = num_fmt_pct
        c8.border = grid_border

        # Cột 9: Đánh giá tự động
        if stt in [1, 2, 12]:
            status_fml = f'=IF(H{r_idx}>=0, "Tăng trưởng tốt (+)", "Chưa đạt chỉ tiêu (-)")'
        else:
            status_fml = f'=IF(H{r_idx}<=0, "Kiểm soát tốt / Tiết kiệm", "Cảnh báo vượt hạn mức")'
        c9 = ws5.cell(r_idx, 9, status_fml)
        c9.font = fnt
        c9.alignment = align_center
        c9.border = grid_border

        if bg_fill:
            for col in range(1, 10):
                ws5.cell(r_idx, col).fill = bg_fill

    var_widths = {'A': 8, 'B': 38, 'C': 18, 'D': 22, 'E': 22, 'F': 18, 'G': 22, 'H': 18, 'I': 26}
    for col_l, width in var_widths.items():
        ws5.column_dimensions[col_l].width = width

    # ==========================================
    # SHEET 6: 06_CCSC_XUONG_SAN_XUAT
    # ==========================================
    ws6 = wb.create_sheet(title="06_CCSC_XUONG_SAN_XUAT")
    ws6.views.sheetView[0].showGridLines = True

    ws6.merge_cells("A1:G1")
    ws6["A1"] = "BẢNG QUẢN TRỊ CƠ CẤU CHI PHÍ XƯỞNG SẢN XUẤT NĂM 2026 (CCSC FACTORY)"
    ws6["A1"].font = title_font
    ws6["A1"].fill = fill_dark_slate
    ws6["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws6.row_dimensions[1].height = 32

    ws6.merge_cells("A2:G2")
    ws6["A2"] = "Phân bổ chi tiết Giá vốn xưởng: Vật tư ván gỗ, phụ kiện, thợ mộc, thợ sơn, máy CNC và vận hành xưởng"
    ws6["A2"].font = subtitle_font
    ws6["A2"].fill = fill_dark_slate
    ws6["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws6.row_dimensions[2].height = 20

    fact_headers = ["STT", "Hạng mục Chi phí Xưởng", "Tỷ lệ Khoán (% DT Xưởng)", "Định mức Tháng (DT 875M)", "Định mức Cả năm (10.5 Tỷ)", "Phụ trách thực hiện", "Quy chế & Tiêu chuẩn kỹ thuật"]
    for i, h in enumerate(fact_headers, start=1):
        cell = ws6.cell(4, i, h)
        cell.font = th_font
        cell.fill = fill_blue_header
        cell.alignment = align_center
        cell.border = grid_border
    ws6.row_dimensions[4].height = 26

    fact_items = [
        ("0", "DOANH SỐ KHOÁN SẢN XUẤT XƯỞNG", 1.000, 875000000, 10500000000, "Xưởng sản xuất", "Doanh số bàn giao thi công từ Khối Văn phòng", fill_light_blue, True),
        ("1", "1. Quản đốc xưởng & Điều hành xưởng", 0.010, 8750000, 105000000, "Lực / Quản đốc xưởng", "Lương trách nhiệm quản lý tiến độ và chất lượng", None, False),
        ("2", "2. Chi phí Thuê mặt bằng xưởng sản xuất", 0.010, 8750000, 105000000, "Chủ mặt bằng xưởng", "Tiền thuê nhà xưởng sản xuất tại Hà Tĩnh", None, False),
        ("3", "3. Khấu hao & Bảo dưỡng máy móc (CNC, dán cạnh)", 0.007, 6125000, 73500000, "Kỹ thuật xưởng", "Bảo trì máy CNC 4 đầu, máy dán cạnh tự động", None, False),
        ("4", "4. Chi phí Điện 3 pha & Nước phục vụ sản xuất", 0.006, 5250000, 63000000, "Điện lực Hà Tĩnh", "Tiền điện máy móc hoạt động sản xuất", None, False),
        ("5", "5. Phòng Kỹ thuật CNC (Bổ file, chạy máy cắt phôi)", 0.017, 14875000, 178500000, "Vũ, Thái (Kỹ thuật CNC)", "Bổ chi tiết kỹ thuật, chạy file máy CNC", None, False),
        ("6", "6. Quỹ lương Thợ Xưởng trực tiếp (Mộc, sơn, lắp ráp)", 0.140, 122500000, 1470000000, "Hòa, Thoan, Hào, Tuấn Anh...", "Lương thợ gia công tại xưởng và lắp đặt công trình", fill_soft_gray, True),
        ("7", "7. Chi phí Vật tư ván gỗ công nghiệp & Gỗ tự nhiên", 0.300, 262500000, 3150000000, "An Cường, Minh Long, Mộc Phát", "Ván MDF chống ẩm, Melamine, Laminate, Acrylic", fill_soft_gray, True),
        ("8", "8. Chi phí Phụ kiện kim khí & Thiết bị nội thất", 0.100, 87500000, 1050000000, "Eurogold, Hafele, Blum...", "Ray trượt, bản lề giảm chấn, giá bát nâng hạ", None, False),
        ("9", "9. Chi phí Sơn, keo Pur/EVA & Vật tư phụ lắp đặt", 0.010, 8750000, 105000000, "Vật tư phụ", "Keo dán cạnh, ốc cam, đinh, sơn PU hoàn thiện", None, False),
        ("10", "10. Chi phí Vận chuyển xe tải & Bốc xếp công trình", 0.010, 8750000, 105000000, "Đội xe vận chuyển", "Thuê xe tải chuyển hàng lắp đặt tại công trình", None, False),
        ("11", "11. Chi phí khác / Dự phòng hao hụt phôi gỗ", 0.005, 4375000, 52500000, "Xưởng sản xuất", "Tỷ lệ hao hụt phôi ván cho phép tối đa 3%", None, False),
        ("12", "TỔNG CHI PHÍ HOẠT ĐỘNG XƯỞNG SẢN XUẤT", 0.615, 538125000, 6457500000, "Xưởng sản xuất", "Toàn bộ chi phí sản xuất trực tiếp và vận hành xưởng", fill_gold, True),
        ("13", "LỢI NHUẬN THẶNG DƯ XƯỞNG SẢN XUẤT (2.2% - 2.5%)", 0.022, 19250000, 231000000, "Thặng dư xưởng", "Thưởng năng suất và thặng dư tiết kiệm vật tư xưởng", fill_green_light, True)
    ]

    for r_idx, f_row in enumerate(fact_items, start=5):
        ws6.row_dimensions[r_idx].height = 20
        stt, name, pct, m_amt, y_amt, resp, note, bg_fill, is_bold = f_row
        fnt = data_bold_font if is_bold else data_font

        c1 = ws6.cell(r_idx, 1, stt)
        c1.font = fnt
        c1.alignment = align_center
        c1.border = grid_border

        c2 = ws6.cell(r_idx, 2, name)
        c2.font = fnt
        c2.alignment = align_left
        c2.border = grid_border

        c3 = ws6.cell(r_idx, 3, pct)
        c3.font = fnt
        c3.alignment = align_center
        c3.number_format = num_fmt_pct
        c3.border = grid_border

        c4 = ws6.cell(r_idx, 4, m_amt)
        c4.font = fnt
        c4.alignment = align_right
        c4.number_format = num_fmt_curr
        c4.border = grid_border

        c5 = ws6.cell(r_idx, 5, y_amt)
        c5.font = fnt
        c5.alignment = align_right
        c5.number_format = num_fmt_curr
        c5.border = grid_border

        c6 = ws6.cell(r_idx, 6, resp)
        c6.font = fnt
        c6.alignment = align_left
        c6.border = grid_border

        c7 = ws6.cell(r_idx, 7, note)
        c7.font = Font(name=font_family, size=8, italic=True, color="64748B")
        c7.alignment = align_left
        c7.border = grid_border

        if bg_fill:
            for col in range(1, 8):
                ws6.cell(r_idx, col).fill = bg_fill

    fact_widths = {'A': 8, 'B': 45, 'C': 18, 'D': 22, 'E': 24, 'F': 26, 'G': 40}
    for col_l, width in fact_widths.items():
        ws6.column_dimensions[col_l].width = width

    # ==========================================
    # SHEET 7: 07_DONG_TIEN_CONG_NO
    # ==========================================
    ws7 = wb.create_sheet(title="07_DONG_TIEN_CONG_NO")
    ws7.views.sheetView[0].showGridLines = True

    ws7.merge_cells("A1:G1")
    ws7["A1"] = "BẢNG KẾ HOẠCH & THEO DÕI DÒNG TIỀN MẶT NĂM 2026 (CASHFLOW CONTROL)"
    ws7["A1"].font = title_font
    ws7["A1"].fill = fill_dark_slate
    ws7["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws7.row_dimensions[1].height = 32

    ws7.merge_cells("A2:G2")
    ws7["A2"] = "Kiểm soát chặt chẽ Dòng tiền thu - Dòng tiền chi - Công nợ khách hàng gối đầu - Tồn quỹ an toàn"
    ws7["A2"].font = subtitle_font
    ws7["A2"].fill = fill_dark_slate
    ws7["A2"].alignment = Alignment(horizontal="center", vertical="center")
    ws7.row_dimensions[2].height = 20

    cf_headers = ["Tháng", "Số dư Đầu kỳ", "Tổng Tiền Thu (Inflow)", "Tổng Tiền Chi (Outflow)", "Dòng tiền Thuần (Net)", "Số dư Cuối kỳ (Ending)", "Trạng thái Dòng tiền"]
    for i, h in enumerate(cf_headers, start=1):
        cell = ws7.cell(4, i, h)
        cell.font = th_font
        cell.fill = fill_blue_header
        cell.alignment = align_center
        cell.border = grid_border
    ws7.row_dimensions[4].height = 26

    # 12 tháng dòng tiền liên kết từ sheet 04_THUC_TE_CCSC_2026
    for m in range(1, 13):
        r_idx = 4 + m
        r_actual = 7 + m * 2
        ws7.row_dimensions[r_idx].height = 21

        c1 = ws7.cell(r_idx, 1, f"Tháng {m}")
        c1.font = data_bold_font
        c1.alignment = align_center
        c1.border = grid_border

        # Đầu kỳ
        c2 = ws7.cell(r_idx, 2, f"=F{r_idx-1}" if m > 1 else 200000000)
        c2.font = data_font
        c2.alignment = align_right
        c2.number_format = num_fmt_curr
        c2.border = grid_border

        # Thu tiền mặt
        c3 = ws7.cell(r_idx, 3, f"='04_THUC_TE_CCSC_2026'!H{r_actual}")
        c3.font = data_bold_font
        c3.alignment = align_right
        c3.number_format = num_fmt_curr
        c3.border = grid_border
        c3.fill = fill_light_blue

        # Chi tiền mặt
        c4 = ws7.cell(r_idx, 4, f"='04_THUC_TE_CCSC_2026'!AZ{r_actual}")
        c4.font = data_bold_font
        c4.alignment = align_right
        c4.number_format = num_fmt_curr
        c4.border = grid_border
        c4.fill = fill_soft_gray

        # Dòng tiền thuần
        c5 = ws7.cell(r_idx, 5, f"=C{r_idx}-D{r_idx}")
        c5.font = data_bold_font
        c5.alignment = align_right
        c5.number_format = num_fmt_curr
        c5.border = grid_border

        # Cuối kỳ
        c6 = ws7.cell(r_idx, 6, f"=B{r_idx}+E{r_idx}")
        c6.font = Font(name=font_family, size=10, bold=True, color="1E3A8A")
        c6.alignment = align_right
        c6.number_format = num_fmt_curr
        c6.border = grid_border
        c6.fill = fill_gold

        # Trạng thái an toàn
        c7 = ws7.cell(r_idx, 7, f'=IF(F{r_idx}>=200000000, "An toàn (Dư quỹ)", IF(F{r_idx}>=100000000, "Cần theo dõi sát", "BÁO ĐỘNG THIẾU TIỀN"))')
        c7.font = data_bold_font
        c7.alignment = align_center
        c7.border = grid_border
        c7.fill = fill_green_light

    # Dòng tổng kết dòng tiền cả năm
    ws7.row_dimensions[17].height = 24
    c_tot_lbl = ws7.cell(17, 1, "TỔNG CẢ NĂM")
    c_tot_lbl.font = sec_font
    c_tot_lbl.fill = fill_dark_slate
    c_tot_lbl.alignment = align_center
    c_tot_lbl.border = total_border

    c_tot_beg = ws7.cell(17, 2, "=B5")
    c_tot_beg.font = data_bold_font
    c_tot_beg.alignment = align_right
    c_tot_beg.number_format = num_fmt_curr
    c_tot_beg.fill = fill_header_gray
    c_tot_beg.border = total_border

    c_tot_in = ws7.cell(17, 3, "=SUM(C5:C16)")
    c_tot_in.font = Font(name=font_family, size=10, bold=True, color="1E3A8A")
    c_tot_in.alignment = align_right
    c_tot_in.number_format = num_fmt_curr
    c_tot_in.fill = fill_light_blue
    c_tot_in.border = total_border

    c_tot_out = ws7.cell(17, 4, "=SUM(D5:D16)")
    c_tot_out.font = Font(name=font_family, size=10, bold=True, color="B91C1C")
    c_tot_out.alignment = align_right
    c_tot_out.number_format = num_fmt_curr
    c_tot_out.fill = fill_soft_gray
    c_tot_out.border = total_border

    c_tot_net = ws7.cell(17, 5, "=C17-D17")
    c_tot_net.font = Font(name=font_family, size=10, bold=True, color="15803D")
    c_tot_net.alignment = align_right
    c_tot_net.number_format = num_fmt_curr
    c_tot_net.fill = fill_green_light
    c_tot_net.border = total_border

    c_tot_end = ws7.cell(17, 6, "=F16")
    c_tot_end.font = Font(name=font_family, size=11, bold=True, color="1E3A8A")
    c_tot_end.alignment = align_right
    c_tot_end.number_format = num_fmt_curr
    c_tot_end.fill = fill_gold
    c_tot_end.border = total_border

    c_tot_stat = ws7.cell(17, 7, "Dòng tiền dương vững mạnh")
    c_tot_stat.font = Font(name=font_family, size=9, bold=True, color="15803D")
    c_tot_stat.alignment = align_center
    c_tot_stat.fill = fill_green_light
    c_tot_stat.border = total_border

    cf_widths = {'A': 14, 'B': 22, 'C': 25, 'D': 25, 'E': 25, 'F': 25, 'G': 25}
    for col_l, width in cf_widths.items():
        ws7.column_dimensions[col_l].width = width

    # Save to file
    out_path = r"f:\PG Home - Quản trị\2. CSC - Chỉ số\BẢNG QUẢN TRỊ TÀI CHÍNH VÀ CCSC 2026 - PG HOME LUXURY.xlsx"
    wb.save(out_path)
    print(f"Successfully generated: {out_path}")

if __name__ == "__main__":
    build_ccsc_system()
