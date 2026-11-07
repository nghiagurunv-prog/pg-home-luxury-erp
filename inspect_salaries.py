import openpyxl
import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

files = [
    "Bảng lương tháng T6_cn.xlsx",
    "Bảng lương tháng T7.xlsx",
    "Copy of Bảng lương tháng T8 tạm tính.xlsx",
    "Bảng lương tháng T9 tạm tính.xlsx"
]

for fn in files:
    path = f"f:/PG Home - Quản trị/1. Bảng lương 2026/{fn}"
    print(f"\n==========================================")
    print(f"FILE: {fn}")
    print(f"==========================================")
    try:
        wb = openpyxl.load_workbook(path, data_only=True)
        print("Sheets:", wb.sheetnames)
        
        # Check salary sheet
        salary_sheet = None
        for s in wb.sheetnames:
            if 'lương' in s.lower() and 'bảng' in s.lower():
                salary_sheet = s
                break
        if not salary_sheet:
            for s in wb.sheetnames:
                if 'lương' in s.lower():
                    salary_sheet = s
                    break
                    
        if salary_sheet:
            ws = wb[salary_sheet]
            print(f"\n--- SHEET: {salary_sheet} ---")
            for r in range(1, min(ws.max_row + 1, 35)):
                row_vals = [ws.cell(r, c).value for c in range(1, min(ws.max_column + 1, 35))]
                # If row contains names
                name_cell = str(row_vals[3]) if len(row_vals) > 3 else ""
                dept_cell = str(row_vals[0]) if len(row_vals) > 0 else ""
                
                # Check important rows
                if any(k in str(row_vals) for k in ["NGHĨA", "HIỆP", "THÁI", "VU", "VŨ", "DŨNG", "HOA", "THOAN", "HÀO", "ANH", "Cộng", "Tổng", "BPKD", "BPQLDN"]):
                    non_empty = [(c, ws.cell(2, c).value, val) for c, val in enumerate(row_vals, 1) if val not in [None, 0, '0', 'None']]
                    summary = [f"C{c}({val})" for c, col_name, val in non_empty[:10]]
                    print(f"Row {r:2d} | {name_cell or dept_cell}: {' | '.join(summary)}")
                    
        # Check SP sheet for revenue/sales
        for s in wb.sheetnames:
            if s.lower() in ['sp', 'bảng chi tiết sản phẩm']:
                ws = wb[s]
                print(f"\n--- SHEET SP / DOANH SỐ: {s} ---")
                for r in range(1, min(ws.max_row + 1, 200)):
                    row_vals = [str(ws.cell(r, c).value) for c in range(1, 15) if ws.cell(r, c).value is not None]
                    row_text = " ".join(row_vals)
                    if any(k in row_text for k in ["Tống Trần Hiệp", "Đường Việt Dũng", "Tổng", "Cộng", "Doanh số", "Kế toán"]):
                        print(f"SP Row {r:3d}: {' | '.join(row_vals[:6])}")
    except Exception as e:
        print(f"Error {fn}: {e}")
