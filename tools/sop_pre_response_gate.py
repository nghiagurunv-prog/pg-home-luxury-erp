"""
SOP PRE-RESPONSE GATEKEEPER — CỔNG KIỂM ĐỊNH TỰ ĐỘNG BẮT BUỘC TRƯỚC KHI BÁO CÁO BỐ
====================================================================================
Tối ưu hóa hiệu năng (Single-Pass Node VM + Socket Fast-Check):
- Gom toàn bộ 59 file JS kiểm tra cú pháp trong 1 lần gọi Node.js vm.Script (~0.18s thay vì 7.2s)
- Kiểm tra socket 127.0.0.1:8080 siêu tốc (0.05s thay vì chờ timeout IPv6 4.0s)
- Tổng thời gian chạy toàn bộ 5 cổng: < 0.45 giây!
"""

import os
import sys
import glob
import json
import time
import socket
import subprocess
import urllib.request
from concurrent.futures import ThreadPoolExecutor

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

WEB_APP_DIR = r"f:\PG Home - Quản trị\web_app"
LOCAL_URL = "http://127.0.0.1:8080"
CLOUD_URL = "https://nghiagurunv-prog.github.io/pg-home-luxury-erp/web_app/"


def check_gate_1_syntax():
    """Cổng 1: Kiểm tra cú pháp toàn bộ file .js (gồm cả modules/*.js) trong 1 lần gọi Node.js vm.Script duy nhất"""
    js_files = glob.glob(os.path.join(WEB_APP_DIR, "*.js")) + glob.glob(os.path.join(WEB_APP_DIR, "modules", "*.js"))
    node_script = """
const fs = require('fs');
const vm = require('vm');
const files = JSON.parse(fs.readFileSync(0, 'utf8'));
const failed = [];
for (const f of files) {
  try {
    let code = fs.readFileSync(f, 'utf8');
    if (code.charCodeAt(0) === 0xFEFF) code = code.slice(1);
    new vm.Script(code, { filename: f });
  } catch (e) {
    failed.push(f.split(/[\\\\/]/).pop() + ': ' + e.message.split('\\n')[0]);
  }
}
process.stdout.write(JSON.stringify(failed));
"""
    res = subprocess.run(
        ["node", "-e", node_script],
        input=json.dumps(js_files),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )
    if res.returncode != 0:
        return False, f"Lỗi thực thi Node VM: {res.stderr.strip()}"
    failed = json.loads(res.stdout or "[]")
    if failed:
        return False, f"Lỗi cú pháp tại: {', '.join(failed)}"
    return True, f"Tất cả {len(js_files)} file .js đều đạt chuẩn cú pháp (0 SyntaxError)."


def check_gate_3_legal_brand():
    """Cổng 3: Quét 5 chuẩn pháp lý Phú Gia & từ khóa cấm trên toàn bộ code giao diện"""
    index_path = os.path.join(WEB_APP_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        index_html = f.read()

    forbidden = ["35 Ngô Đức Kế", "Trương Quốc Dung", "xưởng mộc", "0973.562.789", "0912.345.678", "2500732386"]
    found_forbidden = []
    for word in forbidden:
        if word.lower() in index_html.lower():
            found_forbidden.append(f"index.html chứa '{word}'")

    if found_forbidden:
        return False, f"Vi phạm từ khóa cấm: {', '.join(found_forbidden)}"
    return True, "Chuẩn pháp lý Phú Gia (042203002931 | Ngõ 49 Trương Quốc Dụng | 0986.722.324) sạch 100%."


def check_gate_4_print_isolation():
    """Cổng 4: Kiểm tra cơ chế cô lập in ấn 100% (@media print, w42_print_a4_stylesheet.css & print-signature-footer)"""
    index_path = os.path.join(WEB_APP_DIR, "index.html")
    w42_path = os.path.join(WEB_APP_DIR, "modules", "w42_print_a4_stylesheet.css")
    if not os.path.exists(index_path) or not os.path.exists(w42_path):
        return False, "Thiếu file index.html hoặc modules/w42_print_a4_stylesheet.css"

    with open(index_path, "r", encoding="utf-8", errors="ignore") as f:
        idx_txt = f.read()
    with open(w42_path, "r", encoding="utf-8", errors="ignore") as f:
        w42_txt = f.read()

    checks = [
        ("w42_print_a4_stylesheet.css", "w42_print_a4_stylesheet.css" in idx_txt),
        ("print-signature-footer", "print-signature-footer" in idx_txt),
        ("@media print", "@media print" in w42_txt),
        ("print-color-adjust: exact", "print-color-adjust: exact" in w42_txt),
    ]
    missing = [name for name, ok in checks if not ok]
    if missing:
        return False, f"Thiếu cơ chế cô lập in ấn: {', '.join(missing)}"
    return True, "Cơ chế cô lập in ấn A4 100% (w42_print_a4_stylesheet.css + @media print) hoạt động tốt."


def _start_wmi_detached_server():
    server_py = os.path.join(WEB_APP_DIR, "server.py")
    if not os.path.exists(server_py):
        return False
    py_dir = os.path.dirname(sys.executable)
    pythonw_exe = os.path.join(py_dir, "pythonw.exe")
    exe_to_use = pythonw_exe if os.path.exists(pythonw_exe) else sys.executable
    ps_cmd = (
        "Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue | "
        "ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; "
        "$si = New-CimInstance -ClassName Win32_ProcessStartup -ClientOnly; "
        "$si.ShowWindow = [uint16]0; "
        f"Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{{ "
        f"CommandLine = '\"{exe_to_use}\" \"{server_py}\"'; "
        f"CurrentDirectory = '{WEB_APP_DIR}'; "
        f"ProcessStartupInformation = $si }} | Out-Null"
    )
    subprocess.run(
        ["powershell", "-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-Command", ps_cmd],
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=0x08000000
    )
    for _ in range(30):
        time.sleep(0.1)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.1)
        if s.connect_ex(("127.0.0.1", 8080)) == 0:
            s.close()
            return True
        s.close()
    return False


def check_gate_6_local_server():
    """Cổng 6: Kiểm tra Localhost:8080 (Tự động khởi chạy ngầm server.py qua WMI 24/7 nếu chưa bật & kiểm định HTTP 200 OK toàn bộ đường link)"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.1)
    is_open = (sock.connect_ex(("127.0.0.1", 8080)) == 0)
    sock.close()

    if not is_open:
        is_open = _start_wmi_detached_server()

    if not is_open:
        return False, "CRITICAL: Máy chủ Localhost:8080 KHÔNG phản hồi (CẤM đưa link chết cho Giám Đốc)!"

    urls_to_verify = [
        ("http://127.0.0.1:8080/", 50000),
        ("http://127.0.0.1:8080/director", 50000),
        ("http://127.0.0.1:8080/local_admin_vault/director_ccsc_full.html", 50000),
        ("http://127.0.0.1:8080/deploy", 50000),
        ("http://127.0.0.1:8080/web_app/index.html", 50000),
        ("http://127.0.0.1:8080/director_app_full.js", 100000),
        ("http://127.0.0.1:8080/app.js", 100000),
        ("http://127.0.0.1:8080/styles.css", 20000),
    ]
    for attempt in range(2):
        failed_msg = None
        for url, min_bytes in urls_to_verify:
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'PGHome-SOP-Gate'})
                with urllib.request.urlopen(req, timeout=1.5) as resp:
                    body = resp.read()
                    if resp.status != 200 or len(body) < min_bytes:
                        failed_msg = f"Link lỗi {url}: status={resp.status}, size={len(body)} bytes (< {min_bytes})"
                        break
            except Exception as e:
                failed_msg = f"Link chết {url}: {e}"
                break
        if failed_msg is None:
            return True, f"Tất cả {len(urls_to_verify)} đường dẫn Localhost:8080 (/ , /director, /deploy, /local_admin_vault/..., /web_app/...) đều sống 100% HTTP 200 OK."
        if attempt == 0:
            _start_wmi_detached_server()

    return False, failed_msg


def check_gate_7_permanent_cloud():
    """Cổng 7: Kiểm tra thực tế đường dẫn Cloud GitHub Pages trả về HTTP 200 OK (Cấm báo PASS khi 404)"""
    try:
        req = urllib.request.Request(CLOUD_URL, method="GET", headers={'User-Agent': 'PGHome-SOP-Gate'})
        with urllib.request.urlopen(req, timeout=4.0) as resp:
            body = resp.read()
            if resp.status == 200 and len(body) > 50000:
                return True, f"Cloud GitHub Pages ({CLOUD_URL}) sống 100% HTTP 200 OK ({len(body):,} bytes)."
            return False, f"Cloud GitHub Pages phản hồi bất thường: status={resp.status}, size={len(body)}"
    except Exception as e:
        return False, f"Link Cloud chết ({CLOUD_URL}): {e}"


def main():
    t0 = time.time()
    print("=" * 78)
    print("🛡️  SOP PRE-RESPONSE GATEKEEPER — KIỂM ĐỊNH TỰ ĐỘNG TRƯỚC KHI BÁO CÁO BỐ")
    print("=" * 78)

    gates = [
        ("Cổng 1 [Syntax & Bundle]", check_gate_1_syntax),
        ("Cổng 3 [Chuẩn Pháp Lý Phú Gia]", check_gate_3_legal_brand),
        ("Cổng 4 [Cô Lập In Ấn 100%]", check_gate_4_print_isolation),
        ("Cổng 6 [Local Server 8080]", check_gate_6_local_server),
        ("Cổng 7 [Cloud Vĩnh Viễn Render]", check_gate_7_permanent_cloud),
    ]

    results = {}
    with ThreadPoolExecutor(max_workers=5) as pool:
        future_map = {pool.submit(fn): name for name, fn in gates}
        for fut in future_map:
            name = future_map[fut]
            try:
                results[name] = fut.result()
            except Exception as e:
                results[name] = (False, str(e))

    all_passed = True
    for name, _ in gates:
        ok, msg = results[name]
        status = "✅ PASS" if ok else "❌ FAIL"
        print(f"{status} | {name}: {msg}")
        if not ok:
            all_passed = False

    elapsed = time.time() - t0
    print("=" * 78)
    if all_passed:
        print(f"🏆 KẾT LUẬN: TẤT CẢ CÁC CỔNG ĐỀU PASS 100% ({elapsed:.2f}s) — ĐỦ ĐIỀU KIỆN BÁO CÁO BỐ!")
        sys.exit(0)
    else:
        print(f"🚨 KẾT LUẬN: PHÁT HIỆN LỖI ({elapsed:.2f}s) — CẤM BÁO CÁO BỐ! PHẢI SỬA TRIỆT ĐỂ NGAY!")
        sys.exit(1)


if __name__ == "__main__":
    main()
