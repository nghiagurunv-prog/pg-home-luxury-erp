# -*- coding: utf-8 -*-
"""
================================================================================
ZALO LEVELDB & INDEXEDDB ULTRA-FAST PASSIVE SCANNER
Module: zalo_leveldb_scanner.py
Phạm vi: Đọc thụ động LevelDB & IndexedDB của Zalo PC (Zero-Disruption, IDLE Priority)
Tốc độ mục tiêu: < 100ms
================================================================================
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
import re
from collections import Counter
from datetime import datetime


# Pre-initialize ctypes for instant priority setting
_KERNEL32 = None
if sys.platform == "win32":
    try:
        import ctypes
        from ctypes import wintypes
        _KERNEL32 = ctypes.WinDLL("kernel32", use_last_error=True)
        _KERNEL32.GetCurrentProcess.restype = wintypes.HANDLE
        _KERNEL32.SetPriorityClass.argtypes = [wintypes.HANDLE, wintypes.DWORD]
        _KERNEL32.SetPriorityClass.restype = wintypes.BOOL
    except Exception:
        _KERNEL32 = None


def set_idle_priority():
    """Thiết lập độ ưu tiên tiến trình IDLE (0x00000040) để không làm ảnh hưởng ngoại vi."""
    try:
        if _KERNEL32:
            h = _KERNEL32.GetCurrentProcess()
            # IDLE_PRIORITY_CLASS = 0x00000040
            if _KERNEL32.SetPriorityClass(h, 0x00000040):
                return True
    except Exception:
        pass
    try:
        import psutil
        psutil.Process().nice(psutil.IDLE_PRIORITY_CLASS)
        return True
    except Exception:
        return False


LEVELDB_PATH = os.path.expandvars(r"%APPDATA%\ZaloData\Partitions\zalo\Local Storage\leveldb")
INDEXEDDB_PATH = os.path.expandvars(r"%APPDATA%\ZaloData\Partitions\zalo\IndexedDB")
OUTPUT_JSON_PATH = r"f:\PG Home - Quản trị\data\zalo_leveldb_intel.json"

# Biên dịch trước các regex tốc độ cao (không dùng cờ (?i) chậm trên bytes)
# 1. Group IDs: g\d{15,22}
RE_G8 = re.compile(rb"g\d{15,22}")
RE_G16 = re.compile(rb"g\x00(?:\d\x00){15,22}")

# 2. Orders: SON\d+, DH\d+, PO[-0-9]+ (Tách riêng tiền tố cố định để Python SRE tối ưu Boyer-Moore < 0.6ms)
RE_ORDERS_8 = [
    re.compile(rb"SON\d+"),
    re.compile(rb"son\d+"),
    re.compile(rb"DH\d+"),
    re.compile(rb"dh\d+"),
    re.compile(rb"PO[-0-9]+"),
    re.compile(rb"po[-0-9]+")
]

RE_ORDERS_16 = [
    re.compile(rb"S\x00O\x00N\x00(?:\d\x00)+"),
    re.compile(rb"s\x00o\x00n\x00(?:\d\x00)+"),
    re.compile(rb"D\x00H\x00(?:\d\x00)+"),
    re.compile(rb"d\x00h\x00(?:\d\x00)+"),
    re.compile(rb"P\x00O\x00(?:[-0-9]\x00)+"),
    re.compile(rb"p\x00o\x00(?:[-0-9]\x00)+")
]

# 3. Phones: 0[35789]\d{8}
RE_PHONE8 = re.compile(rb"0[35789]\d{8}")
RE_PHONE16 = re.compile(rb"0\x00[35789]\x00(?:\d\x00){8}")

# 4. Bank Transactions: FT\d+, ICBVC\w+ (Tách riêng tiền tố cố định)
RE_BANKS_8 = [
    re.compile(rb"FT\d+"),
    re.compile(rb"ft\d+"),
    re.compile(rb"ICBVC[A-Za-z0-9]+"),
    re.compile(rb"icbvc[A-Za-z0-9]+")
]

RE_BANKS_16 = [
    re.compile(rb"F\x00T\x00(?:\d\x00)+"),
    re.compile(rb"f\x00t\x00(?:\d\x00)+"),
    re.compile(rb"I\x00C\x00B\x00V\x00C\x00(?:[A-Za-z0-9]\x00)+"),
    re.compile(rb"i\x00c\x00b\x00v\x00c\x00(?:[A-Za-z0-9]\x00)+")
]

# 5. Session Patterns
RE_APP_VER1 = re.compile(rb"pp_ver[^\d]*(\d+\.\d+\.\d+)")
RE_APP_VER2 = re.compile(rb"ZaloM[^\"]*-(\d+\.\d+\.\d+(?:_Full-[A-Za-z0-9]+)?)")
RE_LAST_RECEIVE_TS = re.compile(rb"0_([a-zA-Z0-9_\-]+)_lastReceiveTs\x01(\d+)")
RE_Z_ML = re.compile(rb"0_z_ml_([a-zA-Z0-9_\-]+)")
RE_USER_IDS = re.compile(rb"user_ids[^\d]*(\d{15,22})")


def collect_target_files():
    """Thu thập danh sách file .ldb và .log từ LevelDB & IndexedDB."""
    target_files = []
    for bp in [LEVELDB_PATH, INDEXEDDB_PATH]:
        if not os.path.exists(bp):
            continue
        if os.path.isfile(bp):
            if bp.lower().endswith((".ldb", ".log")):
                try:
                    target_files.append((bp, os.path.getsize(bp), os.path.getmtime(bp)))
                except OSError:
                    pass
        elif os.path.isdir(bp):
            for root, _, files in os.walk(bp):
                for f in files:
                    if f.lower().endswith((".ldb", ".log")):
                        fp = os.path.join(root, f)
                        try:
                            target_files.append((fp, os.path.getsize(fp), os.path.getmtime(fp)))
                        except OSError:
                            pass
    return target_files


def scan_leveldb_and_indexeddb(verbose_timing=False):
    """Hàm quét siêu tốc LevelDB & IndexedDB (< 100ms)."""
    t_start = time.perf_counter()
    timings = {}

    # 1. Đặt độ ưu tiên IDLE
    idle_set = set_idle_priority()
    timings["idle_priority"] = (time.perf_counter() - t_start) * 1000

    # 2. Tìm danh sách file
    t_files = time.perf_counter()
    target_files = collect_target_files()
    timings["collect_files"] = (time.perf_counter() - t_files) * 1000

    # Xác định file log mới nhất
    leveldb_logs = [f for f in target_files if f[0].lower().endswith(".log") and "local storage" in f[0].lower()]
    latest_log_path = max(leveldb_logs, key=lambda x: x[2])[0] if leveldb_logs else None

    # 3. Đọc dữ liệu thụ động (Read-Only)
    t_read = time.perf_counter()
    file_buffers = []
    scanned_files = 0
    skipped_files = 0
    total_bytes = 0
    indexeddb_count = 0
    leveldb_count = 0

    for fp, sz, mt in target_files:
        try:
            with open(fp, "rb") as f:
                content = f.read()
                is_latest = (fp == latest_log_path)
                is_idb = "indexeddb" in fp.lower()
                if is_idb:
                    indexeddb_count += 1
                else:
                    leveldb_count += 1
                total_bytes += len(content)
                scanned_files += 1
                file_buffers.append((fp, content, is_latest, is_idb))
        except (PermissionError, OSError, IOError):
            skipped_files += 1

    # Nối buffer cho toàn bộ & riêng cho latest log
    all_bytes = b"".join([b[1] for b in file_buffers])
    latest_bytes = b"".join([b[1] for b in file_buffers if b[2]])
    timings["read_files"] = (time.perf_counter() - t_read) * 1000

    # 4. Trích xuất nhóm (Groups)
    t_groups = time.perf_counter()
    group_counts = Counter()
    for m in RE_G8.findall(all_bytes):
        group_counts[m.decode("ascii")] += 1
    for m in RE_G16.findall(all_bytes):
        try:
            group_counts[m.decode("utf-16le")] += 1
        except Exception:
            pass

    latest_group_counts = Counter()
    if latest_bytes:
        for m in RE_G8.findall(latest_bytes):
            latest_group_counts[m.decode("ascii")] += 1
        for m in RE_G16.findall(latest_bytes):
            try:
                latest_group_counts[m.decode("utf-16le")] += 1
            except Exception:
                pass
    timings["extract_groups"] = (time.perf_counter() - t_groups) * 1000

    # 5. Trích xuất đơn hàng (Orders) - Dùng SRE Boyer-Moore tối ưu với tiền tố cố định
    t_orders = time.perf_counter()
    orders_set = set()
    for rg in RE_ORDERS_8:
        for m in rg.findall(all_bytes):
            orders_set.add(m.decode("ascii", errors="ignore").upper())
    for rg in RE_ORDERS_16:
        for m in rg.findall(all_bytes):
            try:
                orders_set.add(m.decode("utf-16le").upper())
            except Exception:
                pass
    timings["extract_orders"] = (time.perf_counter() - t_orders) * 1000

    # 6. Trích xuất số điện thoại (Phone Numbers) với kiểm tra ranh giới chữ số
    t_phones = time.perf_counter()
    phones_set = set()
    for m in RE_PHONE8.finditer(all_bytes):
        s, e = m.start(), m.end()
        if s > 0 and 48 <= all_bytes[s - 1] <= 57:
            continue
        if e < len(all_bytes) and 48 <= all_bytes[e] <= 57:
            continue
        phones_set.add(m.group(0).decode("ascii"))

    for m in RE_PHONE16.finditer(all_bytes):
        s, e = m.start(), m.end()
        if s >= 2 and all_bytes[s - 1:s] == b"\x00" and 48 <= all_bytes[s - 2] <= 57:
            continue
        if e + 1 < len(all_bytes) and all_bytes[e + 1:e + 2] == b"\x00" and 48 <= all_bytes[e] <= 57:
            continue
        try:
            phones_set.add(m.group(0).decode("utf-16le"))
        except Exception:
            pass
    timings["extract_phones"] = (time.perf_counter() - t_phones) * 1000

    # 7. Trích xuất giao dịch ngân hàng (Bank Transactions) - Dùng SRE Boyer-Moore tối ưu
    t_banks = time.perf_counter()
    bank_tx_set = set()
    for rg in RE_BANKS_8:
        for m in rg.findall(all_bytes):
            bank_tx_set.add(m.decode("ascii", errors="ignore").upper())
    for rg in RE_BANKS_16:
        for m in rg.findall(all_bytes):
            try:
                bank_tx_set.add(m.decode("utf-16le").upper())
            except Exception:
                pass
    timings["extract_banks"] = (time.perf_counter() - t_banks) * 1000

    # 8. Cấu hình phiên Zalo (Session Intel)
    t_session = time.perf_counter()
    app_versions = set()
    if b"pp_ver" in all_bytes:
        for m in RE_APP_VER1.findall(all_bytes):
            app_versions.add(m.decode("ascii", errors="ignore"))
    if b"ZaloM" in all_bytes:
        for m in RE_APP_VER2.findall(all_bytes):
            app_versions.add(m.decode("ascii", errors="ignore"))

    zadn_hosts_set = set()
    needle = b".zadn.vn"
    idx = 0
    while True:
        pos = all_bytes.find(needle, idx)
        if pos == -1:
            break
        start = pos
        while start > 0 and (all_bytes[start - 1:start].isalnum() or all_bytes[start - 1:start] in b".-"):
            start -= 1
        host = all_bytes[start:pos + len(needle)].decode("ascii", errors="ignore")
        if host.startswith("."):
            host = host.lstrip(".")
        if host:
            zadn_hosts_set.add(host)
        idx = pos + len(needle)
    zadn_hosts = sorted(list(zadn_hosts_set))

    user_ids = []
    if b"user_ids" in all_bytes:
        user_ids = sorted(list(set(m.decode("ascii", errors="ignore") for m in RE_USER_IDS.findall(all_bytes))))

    recent_ts = {}
    if b"_lastReceiveTs" in all_bytes:
        for cid_b, ts_b in RE_LAST_RECEIVE_TS.findall(all_bytes):
            try:
                cid = cid_b.decode("ascii", errors="ignore")
                ts = int(ts_b.decode("ascii"))
                if cid not in recent_ts or ts > recent_ts[cid]:
                    recent_ts[cid] = ts
            except Exception:
                pass

    active_ml = []
    if b"0_z_ml_" in all_bytes:
        active_ml = sorted(list(set(m.decode("ascii", errors="ignore") for m in RE_Z_ML.findall(all_bytes))))[:30]
    timings["extract_session"] = (time.perf_counter() - t_session) * 1000

    # Tổ chức danh sách nhóm kèm tần suất
    groups_list = []
    for gid, count in group_counts.most_common():
        groups_list.append({
            "group_id": gid,
            "total_occurrences": count,
            "in_latest_log": latest_group_counts.get(gid, 0)
        })

    t_end = time.perf_counter()
    duration_ms = round((t_end - t_start) * 1000, 2)

    result = {
        "metadata": {
            "scanner_version": "2.0.0-ultra-fast",
            "scan_timestamp": datetime.now().isoformat(),
            "execution_time_ms": duration_ms,
            "target_sla_ms": 100,
            "sla_met": duration_ms < 100,
            "process_priority_idle": idle_set,
            "total_files_scanned": scanned_files,
            "total_files_skipped": skipped_files,
            "total_bytes_scanned": total_bytes,
            "latest_log_scanned": latest_log_path
        },
        "summary": {
            "total_unique_groups": len(group_counts),
            "groups_in_latest_log": len(latest_group_counts),
            "total_order_codes": len(orders_set),
            "total_phone_numbers": len(phones_set),
            "total_bank_transactions": len(bank_tx_set)
        },
        "extracted_entities": {
            "groups": groups_list,
            "order_codes": sorted(list(orders_set)),
            "phone_numbers": sorted(list(phones_set)),
            "bank_transactions": sorted(list(bank_tx_set))
        },
        "session_intel": {
            "app_versions": sorted(list(app_versions)),
            "user_ids": user_ids,
            "active_message_lists_sample": active_ml,
            "recent_last_receive_timestamps_count": len(recent_ts),
            "recent_last_receive_timestamps_sample": dict(list(recent_ts.items())[:10]),
            "zadn_hosts_count": len(zadn_hosts),
            "zadn_hosts_sample": zadn_hosts[:10],
            "leveldb_files_count": leveldb_count,
            "indexeddb_files_count": indexeddb_count
        },
        "step_timings_ms": {k: round(v, 2) for k, v in timings.items()}
    }

    # Xuất file JSON
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    return result


if __name__ == "__main__":
    res = scan_leveldb_and_indexeddb()
    meta = res["metadata"]
    sm = res["summary"]
    si = res["session_intel"]
    print("=" * 70)
    print("ZALO LEVELDB & INDEXEDDB ULTRA-FAST SCANNER - KẾT QUẢ KIỂM THỬ")
    print(f"Thời gian thực thi   : {meta['execution_time_ms']} ms (SLA < 100ms: {meta['sla_met']})")
    print(f"Step timings         : {res.get('step_timings_ms')}")
    print(f"Độ ưu tiên tiến trình: IDLE ({meta['process_priority_idle']})")
    print(f"Tổng tệp đã quét     : {meta['total_files_scanned']} ({meta['total_bytes_scanned']:,} bytes)")
    print(f"File log mới nhất    : {meta['latest_log_scanned']}")
    print("-" * 70)
    print(f"Mã nhóm trích xuất   : {sm['total_unique_groups']} nhóm (trong log mới nhất: {sm['groups_in_latest_log']})")
    print(f"Mã đơn hàng          : {sm['total_order_codes']} ({res['extracted_entities']['order_codes'][:5]})")
    print(f"Số điện thoại        : {sm['total_phone_numbers']} số")
    print(f"Giao dịch ngân hàng  : {sm['total_bank_transactions']} mã ({res['extracted_entities']['bank_transactions'][:5]})")
    print(f"Phiên bản Zalo       : {si['app_versions']}")
    print(f"Tài khoản User ID    : {si['user_ids']}")
    print(f"File kết quả JSON    : {OUTPUT_JSON_PATH}")
    print("=" * 70)
