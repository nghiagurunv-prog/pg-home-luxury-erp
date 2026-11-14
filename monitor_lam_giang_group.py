# -*- coding: utf-8 -*-
"""
HỆ THỐNG GIÁM SÁT NGẦM NHÓM ZALO TỔNG KHO VÁN LAM GIANG (STEALTH MONITOR)
------------------------------------------------------------------------
Quy chuẩn nghiêm ngặt WCS-UL10 & Rule 9 của Giám Đốc Nguyễn Viết Nghĩa:
1. Chạy hoàn toàn dưới nền (Zero-Disruption).
2. Không cướp Focus, không di chuyển chuột, không nháy màn hình.
3. Tự động quét và phát hiện ảnh hóa đơn/phiếu xuất kho/file Excel mới gửi từ Lam Giang.
4. Ghi nhật ký viễn trắc telemetry minh bạch.
"""

import os
import sys
import time
import json
try:
    import pg_fast_io as _pg_fast_io
    json = _pg_fast_io.json
except Exception:
    pass
import datetime
import ctypes

# Đảm bảo UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Đặt priority tiến trình ở mức IDLE để không ảnh hưởng đến bất kỳ tác vụ nào khác của Giám Đốc
try:
    kernel32 = ctypes.windll.kernel32
    # IDLE_PRIORITY_CLASS = 0x00000040
    kernel32.SetPriorityClass(kernel32.GetCurrentProcess(), 0x00000040)
except Exception:
    pass

MEDIA_DIR = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource\g6116598459303638566"
DATA_DIR = r"f:\PG Home - Quản trị\data"
STATE_FILE = os.path.join(DATA_DIR, "lam_giang_monitor_state.json")
LOG_FILE = os.path.join(DATA_DIR, "lam_giang_activity_log.json")
MASTER_STATEMENT = r"f:\PG Home - Quản trị\PHÚ GIA T1-T10-2026.xlsx"

os.makedirs(DATA_DIR, exist_ok=True)

def load_json(p, default):
    if os.path.exists(p):
        try:
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default
    return default

def save_json(p, data):
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def scan_lam_giang_activity():
    state = load_json(STATE_FILE, {"known_files": {}, "last_scan": None, "current_debt": 164330250})
    logs = load_json(LOG_FILE, [])
    
    known = state.get("known_files", {})
    new_items = []
    
    # Scan media directory
    if os.path.exists(MEDIA_DIR):
        for root, dirs, files in os.walk(MEDIA_DIR):
            for fn in files:
                fp = os.path.join(root, fn)
                try:
                    mtime = os.path.getmtime(fp)
                    sz = os.path.getsize(fp)
                except OSError:
                    continue
                
                # Check if new or modified
                file_id = f"{fn}_{sz}"
                if file_id not in known:
                    dt_str = datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")
                    item = {
                        "filename": fn,
                        "path": fp,
                        "size_bytes": sz,
                        "mtime": dt_str,
                        "detected_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "type": "EXCEL" if fn.endswith(".xlsx") else ("IMAGE" if any(fn.endswith(ext) for ext in [".jpg", ".png", ".jxl"]) or "_n" in fn or "_t" in fn else "DOC")
                    }
                    known[file_id] = dt_str
                    new_items.append(item)
    
    # Check master statement timestamp
    if os.path.exists(MASTER_STATEMENT):
        stmt_mtime = os.path.getmtime(MASTER_STATEMENT)
        stmt_dt = datetime.datetime.fromtimestamp(stmt_mtime).strftime("%Y-%m-%d %H:%M:%S")
        state["master_statement_last_modified"] = stmt_dt
    
    if new_items:
        # Prepend new items to log
        logs = new_items + logs
        logs = logs[:200] # keep last 200 items
        save_json(LOG_FILE, logs)
        print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Phát hiện {len(new_items)} tài liệu/hình ảnh mới từ nhóm Zalo Lam Giang.")
    
    state["last_scan"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    state["known_files"] = known
    save_json(STATE_FILE, state)
    
    return {
        "status": "HEALTHY",
        "total_tracked": len(known),
        "new_detected": len(new_items),
        "current_debt": state.get("current_debt", 164330250),
        "last_scan": state["last_scan"]
    }

def run_loop():
    print(f"=== KHỞI CHẠY TIẾN TRÌNH GIÁM SÁT NGẦM ZALO LAM GIANG ===")
    print(f"Thư mục media: {MEDIA_DIR}")
    print(f"Chu kỳ quét: 60 giây / lần • Độ ưu tiên: IDLE (Không chiếm dụng tài nguyên)")
    while True:
        try:
            scan_lam_giang_activity()
        except Exception as e:
            print("Lỗi quét ngầm:", e)
        time.sleep(60)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--daemon":
        run_loop()
    else:
        res = scan_lam_giang_activity()
        print("Kết quả quét tức thời:", json.dumps(res, ensure_ascii=False, indent=2))
