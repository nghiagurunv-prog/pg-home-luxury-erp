import openpyxl
import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def parse_month(fn, m_name):
    path = f"f:/PG Home - Quản trị/1. Bảng lương 2026/{fn}"
    wb = openpyxl.load_workbook(path, data_only=True)
    
    # Salary sheet
    ws_salary = None
    for s in wb.sheetnames:
        if 'lương thời gian' in s.lower() or ('lương' in s.lower() and 'bảng' in s.lower()):
            ws_salary = wb[s]
            break
            
    # SP sheet
    ws_sp = None
    for s in wb.sheetnames:
        if s.lower() in ['sp', 'bảng chi tiết sản phẩm']:
            ws_sp = wb[s]
            break

    print(f"\n==========================================")
    print(f"THÁNG {m_name} ({fn})")
    print(f"==========================================")
    
    # Extract people salaries
    data = {}
    if ws_salary:
        for r in range(1, min(ws_salary.max_row+1, 35)):
            name = ws_salary.cell(r, 4).value
            code = ws_salary.cell(r, 3).value
            role = ws_salary.cell(r, 5).value
            base = ws_salary.cell(r, 6).value
            days = ws_salary.cell(r, 8).value
            salary_time = ws_salary.cell(r, 9).value
            sales_bonus = ws_salary.cell(r, 14).value
            allowance = ws_salary.cell(r, 15).value
            ot_allowance = ws_salary.cell(r, 16).value
            total_income = ws_salary.cell(r, 17).value
            net = ws_salary.cell(r, 29).value
            
            if name or code:
                data[str(name or code).strip()] = {
                    'code': code, 'role': role, 'base': base, 'days': days,
                    'salary_time': salary_time, 'sales_bonus': sales_bonus,
                    'allowance': allowance, 'ot_allowance': ot_allowance,
                    'total_income': total_income, 'net': net
                }
                
    for k, v in data.items():
        if any(target in k.upper() for target in ['HIỆP', 'THÁI', 'VU', 'VŨ', 'NGHĨA', 'HUONG', 'HƯƠNG', 'DŨNG', 'HOA', 'THOAN', 'HÀO', 'ANH']):
            print(f"  {k:<20s} | Chức danh: {str(v['role']):<6s} | Lương CB: {v['base']} | Lương TG: {v['salary_time']} | Thưởng DS: {v['sales_bonus']} | Phụ cấp: {v['allowance']} | Tổng: {v['total_income']}")

    # Check totals for departments:
    # 1. Ban lãnh đạo (Nghĩa, Hương)
    # 2. Sale Admin (Hiệp)
    # 3. Kinh doanh (Dũng, Hùng, Bình...)
    # 4. Quản lý xưởng (Thái) & Kỹ thuật (Vũ)
    # 5. Thợ trực tiếp (Hoà, Thoan, Hào, Anh, Tuấn Anh...)
    
parse_month("Bảng lương tháng T6_cn.xlsx", "T6")
parse_month("Bảng lương tháng T7.xlsx", "T7")
parse_month("Copy of Bảng lương tháng T8 tạm tính.xlsx", "T8")
parse_month("Bảng lương tháng T9 tạm tính.xlsx", "T9")
