#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
==============================================================================
HỆ THỐNG QUẢN TRỊ & TỰ ĐỘNG HÓA PHÚ GIA - PG HOME LUXURY
HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG
THƯƠNG HIỆU: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY
MST/ĐKKD: 042203002931 | HOTLINE: 0986.722.324
ĐỊA CHỈ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
==============================================================================
TOOL: build_w50_bundle.py
CÔNG DỤNG:
  - Đóng gói 48 module JavaScript (W01–W40, W43–W50) thành:
    F:\\PG Home - Quản trị\\web_app\\modules\\pg_w50_master.bundle.js
    (đảm bảo module w50_master_hub_loader.js nằm ở vị trí cuối cùng).
  - Đóng gói 2 module CSS (W41, W42) thành:
    F:\\PG Home - Quản trị\\web_app\\modules\\pg_w50_master.bundle.css
  - Tạo header comment phân tách rõ ràng từng module và bảng SHA-256 manifest.
  - Tự động chạy 'node --check' xác thực cú pháp bundle JavaScript.
  - Tuân thủ nghiêm ngặt Hiến Pháp Kỷ Luật Thép (Zero-Trust Audit, Brand Identity, Stealth).
==============================================================================
"""

import os
import sys
import re
import hashlib
import datetime
import subprocess

# Đường dẫn mặc định chuẩn hóa
DEFAULT_MODULES_DIR = r"F:\PG Home - Quản trị\web_app\modules"
DEFAULT_JS_BUNDLE = os.path.join(DEFAULT_MODULES_DIR, "pg_w50_master.bundle.js")
DEFAULT_CSS_BUNDLE = os.path.join(DEFAULT_MODULES_DIR, "pg_w50_master.bundle.css")


def compute_sha256_bytes(data: bytes) -> str:
    """Tính SHA-256 hash của một chuỗi bytes."""
    hasher = hashlib.sha256()
    hasher.update(data)
    return hasher.hexdigest()


def compute_sha256_file(filepath: str) -> str:
    """Tính SHA-256 hash của một file trên đĩa."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def extract_w_number(filename: str) -> int:
    """Trích xuất số thứ tự từ tên file wXX_*.js/css. Đảm bảo w50 luôn xếp cuối cùng."""
    m = re.match(r"^w(\d+)", filename, re.IGNORECASE)
    if not m:
        return 9999
    num = int(m.group(1))
    return 9998 if num == 50 else num


def scan_and_order_files(modules_dir: str):
    """
    Quét danh sách các file wXX trong thư mục modules và phân loại:
      - 55 file JS: w01–w40, w43–w49, w51–w57, và w50 ở cuối cùng.
      - 2 file CSS: w41, w42, sắp xếp theo thứ tự số.
    """
    if not os.path.isdir(modules_dir):
        raise FileNotFoundError(f"Không tìm thấy thư mục modules: {modules_dir}")

    all_entries = os.listdir(modules_dir)

    js_files = []
    css_files = []

    for entry in all_entries:
        if not entry.lower().startswith("w"):
            continue
        full_path = os.path.join(modules_dir, entry)
        if not os.path.isfile(full_path):
            continue

        if entry.lower().endswith(".js"):
            js_files.append(entry)
        elif entry.lower().endswith(".css"):
            css_files.append(entry)

    # Sắp xếp số thứ tự (w50 được đẩy xuống cuối cùng)
    js_files.sort(key=extract_w_number)
    css_files.sort(key=extract_w_number)

    # Kiểm tra số lượng (>= 48 file JS, hiện chuẩn hóa 55 file JS + 2 file CSS = 57 modules)
    if len(js_files) < 48:
        raise ValueError(
            f"Số lượng file JS thiếu (tìm thấy {len(js_files)} file: {js_files})"
        )
    if len(css_files) != 2:
        raise ValueError(
            f"Số lượng file CSS không đúng 2 file (tìm thấy {len(css_files)} file: {css_files})"
        )

    # Đảm bảo w50_master_hub_loader.js nằm cuối cùng
    last_js = js_files[-1]
    if not last_js.startswith("w50_"):
        raise ValueError(
            f"File JS cuối cùng phải là w50_master_hub_loader.js, nhưng hiện tại là: {last_js}"
        )

    return js_files, css_files


def build_js_bundle(modules_dir: str, js_files: list, output_path: str) -> dict:
    """
    Đóng gói 48 file JS thành pg_w50_master.bundle.js có header comment và SHA-256 build manifest.
    """
    manifest_entries = []
    total_source_bytes = 0

    # Đọc dữ liệu và tính SHA-256 cho từng file
    file_contents = []
    for idx, fname in enumerate(js_files, start=1):
        fpath = os.path.join(modules_dir, fname)
        with open(fpath, "rb") as f:
            raw_bytes = f.read()
        
        file_sha256 = compute_sha256_bytes(raw_bytes)
        file_size = len(raw_bytes)
        total_source_bytes += file_size

        # Giải mã utf-8
        text_content = raw_bytes.decode("utf-8-sig")

        manifest_entries.append({
            "index": idx,
            "filename": fname,
            "size": file_size,
            "sha256": file_sha256,
        })
        file_contents.append((fname, file_size, file_sha256, text_content))

    now_iso = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Tạo Master Header & Manifest Comment
    header_lines = [
        "/**",
        " * ============================================================================",
        " * PG HOME LUXURY - ENTERPRISE OPTIMIZATION ARCHITECTURE",
        " * HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG",
        " * THƯƠNG HIỆU: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY",
        " * MST/ĐKKD: 042203002931 | HOTLINE: 0986.722.324",
        " * ĐỊA CHỈ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
        " * ============================================================================",
        " * MASTER JAVASCRIPT BUNDLE: pg_w50_master.bundle.js",
        f" * BUILD TIMESTAMP: {now_iso}",
        f" * TOTAL MODULES: {len(js_files)} JS Modules (W01–W40, W43–W50)",
        f" * TOTAL SOURCE BYTES: {total_source_bytes:,} bytes",
        " * TARGET: Production Web Application Hub & Offline Runtime",
        " * ============================================================================",
        " * BUILD MANIFEST (SHA-256 INTEGRITY MATRIX):",
    ]

    for item in manifest_entries:
        line = f" * [{item['index']:02d}] {item['filename']:<36} | {item['size']:>8,} B | SHA256: {item['sha256']}"
        header_lines.append(line)

    header_lines.extend([
        " * ============================================================================",
        " */",
        "",
        "// Global bundle namespace initialization & safety gate",
        "if (typeof window !== 'undefined') {",
        "    window.__PG_W50_BUNDLE_INFO__ = Object.freeze({",
        f"        name: 'pg_w50_master.bundle.js',",
        f"        buildDate: '{now_iso}',",
        f"        moduleCount: {len(js_files)},",
        f"        totalSourceBytes: {total_source_bytes},",
        "        brand: 'HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG',",
        "        mst: '042203002931',",
        "        hotline: '0986.722.324',",
        "        address: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh'",
        "    });",
        "}",
        "",
    ])

    bundle_parts = ["\n".join(header_lines)]

    for idx, (fname, fsize, fsha, text) in enumerate(file_contents, start=1):
        separator = [
            "",
            "// ============================================================================",
            f"// [MODULE {idx:02d}/{len(js_files):02d}] {fname}",
            f"// SOURCE SIZE: {fsize:,} bytes | SHA-256: {fsha}",
            "// ============================================================================",
            "",
        ]
        bundle_parts.append("\n".join(separator))
        bundle_parts.append(text)
        # Đảm bảo phân cách an toàn giữa các module bằng semicolon và newline
        if not text.rstrip().endswith(";"):
            bundle_parts.append("\n;\n")
        else:
            bundle_parts.append("\n")

    full_bundle_text = "".join(bundle_parts)

    with open(output_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(full_bundle_text)

    # Pre-compress static gzip bundle (.gz) alongside uncompressed bundle (#11)
    try:
        import gzip
        gz_path = output_path + ".gz"
        with open(gz_path, "wb") as gz_f:
            gz_f.write(gzip.compress(full_bundle_text.encode("utf-8"), compresslevel=6))
    except Exception:
        pass

    bundle_size = os.path.getsize(output_path)
    bundle_sha256 = compute_sha256_file(output_path)

    return {
        "output_path": output_path,
        "bundle_size": bundle_size,
        "bundle_sha256": bundle_sha256,
        "total_source_bytes": total_source_bytes,
        "module_count": len(js_files),
        "manifest": manifest_entries,
    }


def build_css_bundle(modules_dir: str, css_files: list, output_path: str) -> dict:
    """
    Đóng gói 2 file CSS thành pg_w50_master.bundle.css có header comment và SHA-256 build manifest.
    """
    manifest_entries = []
    total_source_bytes = 0

    file_contents = []
    for idx, fname in enumerate(css_files, start=1):
        fpath = os.path.join(modules_dir, fname)
        with open(fpath, "rb") as f:
            raw_bytes = f.read()

        file_sha256 = compute_sha256_bytes(raw_bytes)
        file_size = len(raw_bytes)
        total_source_bytes += file_size

        text_content = raw_bytes.decode("utf-8-sig")

        manifest_entries.append({
            "index": idx,
            "filename": fname,
            "size": file_size,
            "sha256": file_sha256,
        })
        file_contents.append((fname, file_size, file_sha256, text_content))

    now_iso = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    header_lines = [
        "/**",
        " * ============================================================================",
        " * PG HOME LUXURY - ENTERPRISE OPTIMIZATION ARCHITECTURE",
        " * HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG",
        " * THƯƠNG HIỆU: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY",
        " * MST/ĐKKD: 042203002931 | HOTLINE: 0986.722.324",
        " * ĐỊA CHỈ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
        " * ============================================================================",
        " * MASTER STYLESHEET BUNDLE: pg_w50_master.bundle.css",
        f" * BUILD TIMESTAMP: {now_iso}",
        f" * TOTAL MODULES: {len(css_files)} CSS Modules (W41, W42)",
        f" * TOTAL SOURCE BYTES: {total_source_bytes:,} bytes",
        " * ============================================================================",
        " * BUILD MANIFEST (SHA-256 INTEGRITY MATRIX):",
    ]

    for item in manifest_entries:
        line = f" * [{item['index']:02d}] {item['filename']:<36} | {item['size']:>8,} B | SHA256: {item['sha256']}"
        header_lines.append(line)

    header_lines.extend([
        " * ============================================================================",
        " */",
        "",
    ])

    bundle_parts = ["\n".join(header_lines)]

    for idx, (fname, fsize, fsha, text) in enumerate(file_contents, start=1):
        separator = [
            "",
            "/* ============================================================================ */",
            f"/* [MODULE {idx:02d}/{len(css_files):02d}] {fname} */",
            f"/* SOURCE SIZE: {fsize:,} bytes | SHA-256: {fsha} */",
            "/* ============================================================================ */",
            "",
        ]
        bundle_parts.append("\n".join(separator))
        bundle_parts.append(text)
        bundle_parts.append("\n")

    full_bundle_text = "".join(bundle_parts)

    with open(output_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(full_bundle_text)

    # Pre-compress static gzip bundle (.gz) alongside uncompressed bundle (#11)
    try:
        import gzip
        gz_path = output_path + ".gz"
        with open(gz_path, "wb") as gz_f:
            gz_f.write(gzip.compress(full_bundle_text.encode("utf-8"), compresslevel=6))
    except Exception:
        pass

    bundle_size = os.path.getsize(output_path)
    bundle_sha256 = compute_sha256_file(output_path)

    return {
        "output_path": output_path,
        "bundle_size": bundle_size,
        "bundle_sha256": bundle_sha256,
        "total_source_bytes": total_source_bytes,
        "module_count": len(css_files),
        "manifest": manifest_entries,
    }


def run_node_check(js_bundle_path: str) -> tuple[bool, str]:
    """
    Chạy lệnh 'node --check <file>' để kiểm tra cú pháp JS.
    Trả về (is_passed, output_message).
    """
    cmd = ["node", "--check", js_bundle_path]
    try:
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            creationflags=0x08000000 if os.name == "nt" else 0
        )
        if proc.returncode == 0:
            return True, "Node syntax check PASS (exit code 0, no errors)"
        else:
            err = proc.stderr.strip() or proc.stdout.strip()
            return False, f"Node syntax check FAILED (code {proc.returncode}):\n{err}"
    except Exception as ex:
        return False, f"Lỗi thực thi lệnh node: {str(ex)}"


def main():
    print("=" * 80)
    print("PG HOME LUXURY - W50 MODULES BUNDLE BUILDER")
    print("HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG")
    print("MST: 042203002931 | HOTLINE: 0986.722.324")
    print("ĐỊA CHỈ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh")
    print("=" * 80)

    modules_dir = DEFAULT_MODULES_DIR
    js_bundle_path = DEFAULT_JS_BUNDLE
    css_bundle_path = DEFAULT_CSS_BUNDLE

    print(f"[*] Thư mục modules: {modules_dir}")
    print("[*] Đang quét danh sách các file module W01-W50...")

    js_files, css_files = scan_and_order_files(modules_dir)

    print(f"[*] Đã xác định {len(js_files)} file JS (W01–W40, W43–W50).")
    print(f"    - File đầu tiên: {js_files[0]}")
    print(f"    - File cuối cùng: {js_files[-1]} (Đảm bảo w50_master_hub_loader.js ở cuối cùng)")
    print(f"[*] Đã xác định {len(css_files)} file CSS: {', '.join(css_files)}")

    # 1. Đóng gói JS Bundle
    print("\n" + "-" * 80)
    print(f"[*] Bắt đầu đóng gói JS Bundle: {js_bundle_path}")
    js_result = build_js_bundle(modules_dir, js_files, js_bundle_path)
    print(f"[+] Hoàn thành JS Bundle!")
    print(f"    - Dung lượng: {js_result['bundle_size']:,} bytes ({js_result['bundle_size'] / 1024:.2f} KB)")
    print(f"    - SHA-256: {js_result['bundle_sha256']}")

    # 2. Đóng gói CSS Bundle
    print("\n" + "-" * 80)
    print(f"[*] Bắt đầu đóng gói CSS Bundle: {css_bundle_path}")
    css_result = build_css_bundle(modules_dir, css_files, css_bundle_path)
    print(f"[+] Hoàn thành CSS Bundle!")
    print(f"    - Dung lượng: {css_result['bundle_size']:,} bytes ({css_result['bundle_size'] / 1024:.2f} KB)")
    print(f"    - SHA-256: {css_result['bundle_sha256']}")

    # 3. Đồng bộ bản nén tĩnh web_app/app.js.gz để tránh lệch cache gzip với web_app/app.js
    app_js_path = os.path.join(os.path.dirname(modules_dir), "app.js")
    if os.path.isfile(app_js_path):
        try:
            import gzip
            with open(app_js_path, "rb") as f_in:
                raw_app_js = f_in.read()
            with open(app_js_path + ".gz", "wb") as f_out:
                f_out.write(gzip.compress(raw_app_js, compresslevel=6))
            print(f"[+] Đã đồng bộ {app_js_path}.gz ({len(raw_app_js):,} B -> {os.path.getsize(app_js_path + '.gz'):,} B)")
        except Exception as ex:
            print(f"[!] Cảnh báo nén app.js.gz: {ex}")

    # 4. Kiểm tra cú pháp với node --check
    print("\n" + "-" * 80)
    print(f"[*] Chạy kiểm tra cú pháp: node --check \"{js_bundle_path}\"")
    passed, check_msg = run_node_check(js_bundle_path)
    if passed:
        print(f"[SUCCESS] {check_msg}")
    else:
        print(f"[FAILED] {check_msg}")
        sys.exit(1)

    print("\n" + "=" * 80)
    print("[FINAL AUDIT SUMMARY - BÁO CÁO KIỂM TOÁN ZERO-TRUST]")
    print(f"1. JS Bundle:  {js_result['output_path']}")
    print(f"   - Modules:   {js_result['module_count']} files")
    print(f"   - Size:      {js_result['bundle_size']:,} bytes ({js_result['bundle_size'] / 1024:.2f} KB)")
    print(f"   - SHA-256:   {js_result['bundle_sha256']}")
    print(f"   - Syntax:    100% VALID (Node.js syntax check passed)")
    print(f"2. CSS Bundle: {css_result['output_path']}")
    print(f"   - Modules:   {css_result['module_count']} files")
    print(f"   - Size:      {css_result['bundle_size']:,} bytes ({css_result['bundle_size'] / 1024:.2f} KB)")
    print(f"   - SHA-256:   {css_result['bundle_sha256']}")
    print("=" * 80)


if __name__ == "__main__":
    main()
