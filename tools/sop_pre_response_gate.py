# -*- coding: utf-8 -*-
"""
PG HOME LUXURY - CHỐT CHẶN KIỂM ĐỊNH TỰ ĐỘNG 7 LỚP (JIDOKA PRE-RESPONSE GATE V7.0)
Bắt buộc chạy và đạt 100% PASS (Exit Code 0) trước khi bất kỳ AI Agent nào được phép gửi báo cáo hoặc link cho Giám Đốc.
"""
import os
import sys
import glob
import subprocess
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = r"f:\PG Home - Quản trị"
WEB_DIR = os.path.join(ROOT_DIR, "web_app")

def check_gate_1_syntax():
    print("[Chốt 1/7] Kiểm tra cú pháp JavaScript (app.js + 50 modules w01..w50)...")
    js_files = [os.path.join(WEB_DIR, "app.js"), os.path.join(WEB_DIR, "sw.js")]
    js_files.extend(sorted(glob.glob(os.path.join(WEB_DIR, "modules", "*.js"))))
    for f in js_files:
        res = subprocess.run(["node", "-c", f], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"  -> THẤT BẠI tại {f}: {res.stderr}")
            return False
    print(f"  -> ĐẠT 100% ({len(js_files)} file JS sạch lỗi cú pháp).")
    return True

def check_gate_2_dom_isolation():
    print("[Chốt 2/7] Kiểm tra cô lập DOM (Cấm document.body.innerHTML ghi đè toàn trang)...")
    mod_files = sorted(glob.glob(os.path.join(WEB_DIR, "modules", "*.js")))
    for f in mod_files:
        txt = open(f, "r", encoding="utf-8").read()
        if "document.body.innerHTML =" in txt or "document.body.innerHTML=" in txt:
            print(f"  -> THẤT BẠI: Phát hiện document.body.innerHTML ghi đè tại {os.path.basename(f)}")
            return False
    print(f"  -> ĐẠT 100% (Toàn bộ {len(mod_files)} modules cô lập vùng chứa an toàn).")
    return True

def check_gate_3_render_simulation():
    print("[Chốt 3/7] Kiểm tra giả lập 18 hàm Render UI (test_all_renders.js)...")
    res = subprocess.run(["node", os.path.join(ROOT_DIR, "scratch", "test_all_renders.js")], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if res.returncode != 0 or "FAIL in function:" in res.stdout or "FAIL in function:" in res.stderr:
        print(f"  -> THẤT BẠI:\n{res.stdout}\n{res.stderr}")
        return False
    pass_count = res.stdout.count("PASS:")
    print(f"  -> ĐẠT 100% ({pass_count} điểm kiểm tra Render UI chạy mượt không lỗi).")
    return True

def check_gate_4_deep_audit():
    print("[Chốt 4/7] Kiểm định 12 lỗi lịch sử cốt tử (deep_error_audit.py)...")
    res = subprocess.run(["python", os.path.join(ROOT_DIR, "scratch", "deep_error_audit.py")], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if "12/12 ĐẠT CHUẨN" not in res.stdout:
        print(f"  -> THẤT BẠI:\n{res.stdout}")
        return False
    print("  -> ĐẠT 100% (12/12 hạng mục lịch sử & tài chính CCSC chuẩn xác tuyệt đối).")
    return True

def check_gate_5_brand_phone():
    print("[Chốt 5/7] Rà soát chống số điện thoại bịa đặt 0973.562.789 trên Web App...")
    for fn in ["index.html", "app.js", "styles.css"]:
        fp = os.path.join(WEB_DIR, fn)
        txt = open(fp, "r", encoding="utf-8").read()
        if "0973.562.789" in txt or "0973562789" in txt:
            print(f"  -> THẤT BẠI: Còn sót số điện thoại giả trong {fn}!")
            return False
        if fn in ("index.html", "app.js") and "0986.722.324" not in txt:
            print(f"  -> THẤT BẠI: Thiếu số Hotline chuẩn 0986.722.324 trong {fn}!")
            return False
    print("  -> ĐẠT 100% (Hotline chuẩn 0986.722.324, sạch 100% số giả).")
    return True

def check_gate_6_local_server():
    print("[Chốt 6/7] Kiểm tra máy chủ Localhost cổng 8080 (Giao diện + Live API)...")
    try:
        req1 = urllib.request.urlopen("http://localhost:8080/index.html", timeout=5)
        body1 = req1.read().decode("utf-8", errors="replace")
        req2 = urllib.request.urlopen("http://localhost:8080/api/zalo-live-inbox", timeout=5)
        body2 = req2.read().decode("utf-8", errors="replace")
        if req1.status != 200 or len(body1) < 400000 or "sidebar-nav" not in body1:
            print(f"  -> THẤT BẠI: http://localhost:8080/index.html status={req1.status}, len={len(body1)}")
            return False
        if req2.status != 200 or '"ok": true' not in body2.lower():
            print(f"  -> THẤT BẠI: API /api/zalo-live-inbox không phản hồi chuẩn!")
            return False
        print(f"  -> ĐẠT 100% (Localhost 8080 HTTP 200 OK, {len(body1):,} bytes + API Zalo Live sẵn sàng).")
        return True
    except Exception as e:
        print(f"  -> THẤT BẠI kết nối Localhost 8080: {e}")
        return False

def check_gate_7_permanent_cloud():
    print("[Chốt 7/7] Kiểm tra Link Cloud Vĩnh Viễn (Cấm tuyệt đối link .tmp.now tự hủy sau 60 phút)...")
    cloud_url = "https://nghiagurunv-prog.github.io/pg-home-luxury-erp/web_app/index.html"
    try:
        req = urllib.request.urlopen(cloud_url, timeout=10)
        body = req.read().decode("utf-8", errors="replace")
        if req.status != 200 or len(body) < 400000 or "sidebar-nav" not in body:
            print(f"  -> THẤT BẠI: {cloud_url} status={req.status}, len={len(body)}")
            return False
        print(f"  -> ĐẠT 100% (Cloud Vĩnh Viễn HTTP 200 OK, {len(body):,} bytes, KHÔNG BAO GIỜ HẾT HẠN).")
        return True
    except Exception as e:
        print(f"  -> THẤT BẠI kết nối Cloud Vĩnh Viễn: {e}")
        return False

if __name__ == "__main__":
    print("=" * 82)
    print("  HỆ THỐNG KIỂM ĐỊNH 7 CHỐT CHẶN TỰ ĐỘNG (SOP PRE-RESPONSE HARD-LOCK V7.0)")
    print("=" * 82)
    gates = [
        check_gate_1_syntax(),
        check_gate_2_dom_isolation(),
        check_gate_3_render_simulation(),
        check_gate_4_deep_audit(),
        check_gate_5_brand_phone(),
        check_gate_6_local_server(),
        check_gate_7_permanent_cloud(),
    ]
    passed = sum(1 for g in gates if g)
    print("=" * 82)
    print(f"  KẾT QUẢ NGHIỆM THU TỔNG THỂ: {passed}/7 CHỐT CHẶN ĐẠT CHUẨN 100%")
    print("=" * 82)
    sys.exit(0 if passed == 7 else 1)
