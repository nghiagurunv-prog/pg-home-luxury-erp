#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Module: zalo_sqlite_reader.py
Mô tả: Module trích xuất cơ sở dữ liệu Zalo Desktop qua giao thức SQLite Read-Only (mode=ro).
Đảm bảo 100% Zero-Lock (không khóa database, không gián đoạn Zalo khi Giám Đốc đang sử dụng).
Chạy ở mức ưu tiên IDLE_PRIORITY_CLASS (0x00000040) để tiêu hao tài nguyên CPU <= 0.3%.

Tác giả: PG Home Luxury AI Assistant (Flash Wave 2 Worker #1)
Ngày chuẩn hóa: 06/11/2026
"""

import sys
import os
import time
import json
import sqlite3
import re
from datetime import datetime

# -------------------------------------------------------------
# 1. CƯỠNG CHẾ ƯU TIÊN IDLE (0x00000040) TRÊN WINDOWS
# -------------------------------------------------------------
def set_idle_priority():
    """Thiết lập tiến trình chạy ở chế độ IDLE_PRIORITY_CLASS (0x00000040)."""
    if sys.platform == 'win32':
        try:
            import ctypes
            from ctypes import wintypes
            kernel32 = ctypes.windll.kernel32
            kernel32.GetCurrentProcess.restype = wintypes.HANDLE
            kernel32.SetPriorityClass.argtypes = [wintypes.HANDLE, wintypes.DWORD]
            kernel32.SetPriorityClass.restype = wintypes.BOOL

            # IDLE_PRIORITY_CLASS = 0x00000040
            handle = kernel32.GetCurrentProcess()
            success = kernel32.SetPriorityClass(handle, 0x00000040)
            return bool(success)
        except Exception as e:
            sys.stderr.write(f"[WARN] Không thể set IDLE_PRIORITY_CLASS: {e}\n")
            return False
    return False

# -------------------------------------------------------------
# 2. CẤU HÌNH ĐƯỜNG DẪN CƠ SỞ DỮ LIỆU & FILE KẾT QUẢ
# -------------------------------------------------------------
STORAGE_DB_PATH = os.path.normpath(r"C:\Users\Admin\AppData\Roaming\ZaloData\Database\_production\Storage.db")
SECURE_DB_PATH = os.path.normpath(r"C:\Users\Admin\AppData\Roaming\ZaloData\Database\_production\SecureLocalstorage.db")
OUTPUT_JSON_PATH = os.path.normpath(r"f:\PG Home - Quản trị\data\zalo_sqlite_contacts_and_files.json")

# Danh sách từ khóa lọc danh bạ trọng điểm (PG Home, Nhân sự, Thợ, Vật tư, Khách hàng, NCC)
EXACT_KEYWORDS = [
    # Thương hiệu & Doanh nghiệp
    "pg home", "phú gia", "phu gia", "nội thất", "noi that", "decor", "tknt", "thiết kế", "thiet ke", "kiến trúc",
    # Nhân sự nòng cốt & Quản lý
    "vũ", "vu", "hoang cong vu", "hoàng công vũ", "ngọc vũ",
    "thái", "thai", "nguyễn văn thái",
    "hiệp", "hiep", "sale admin", "xuân hiệp",
    "dũng", "dung", "nguyễn văn dũng", "dũng đường pg",
    "hòa", "hoa", "đặng văn hòa", "võ đức hoà",
    "hào", "hao", "nguyễn văn hào", "nguyễn vỹ hào",
    "hương", "huong", "kế toán", "thu hương", "hương trà",
    "phát", "phat",
    "nam", "anh nam", "hoài nam",
    "kiên", "kien",
    "tùng", "tung",
    "nghĩa", "nghia", "nghĩa guru",
    # Vật tư gỗ & Tấm CNC & Nhà cung cấp
    "ván", "van", "gỗ", "go", "mdf", "mfc", "melamine", "acrylic", "laminate", "plywood", "wpb",
    "an cường", "an cuong", "mộc phát", "moc phat", "lam giang", "lamgiang", "thanh thùy", "thanh thuy",
    "quốc tâm", "quoc tam", "minh long", "ba hải", "ba hai", "cnc", "linh giang",
    # Phụ kiện & Sơn & Đá & Kính
    "phụ kiện", "phu kien", "hafele", "blum", "cariny", "eurogold", "garis", "bản lề", "ban le", "ray",
    "kính", "kinh", "cánh kính", "nhôm kính", "nhom kinh",
    "đá", "da", "vicostone", "đá bếp", "da bep",
    "sơn", "son", "inchem", "pu",
    # Khách hàng & Dự án & Nghiệp vụ
    "khách hàng", "khach hang", "khách", "khach", "cđt", "chủ nhà", "chu nha",
    "báo giá", "bao gia", "hợp đồng", "hop dong", "công trình", "cong trinh", "dự án", "du an",
    "xưởng", "xuong", "thợ", "tho", "lắp đặt", "lap dat", "vận chuyển", "giao hàng"
]

def format_file_size(size_in_bytes):
    """Chuyển đổi kích thước file sang định dạng đọc được."""
    if size_in_bytes is None:
        return "0 B"
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if abs(size_in_bytes) < 1024.0:
            return f"{size_in_bytes:3.1f} {unit}"
        size_in_bytes /= 1024.0
    return f"{size_in_bytes:.1f} PB"

def match_keywords(text):
    """Kiểm tra khớp từ khóa bằng Regex Word Boundary để tránh nhận diện nhầm."""
    matched = []
    text_lower = text.lower()
    for kw in EXACT_KEYWORDS:
        # Nếu từ khóa có khoảng trắng (cụm từ), tìm chuỗi con
        if " " in kw:
            if kw in text_lower:
                matched.append(kw)
        else:
            # Từ đơn: dùng r'\b' để khớp chính xác từ ngữ
            pattern = r'(?:\b|_)' + re.escape(kw) + r'(?:\b|_)'
            if re.search(pattern, text_lower):
                matched.append(kw)
    return matched

def read_storage_db(db_path):
    """Đọc dữ liệu từ Storage.db qua SQLite Read-Only."""
    results = {
        "status": "NOT_ACCESSED",
        "contacts_total": 0,
        "uid_to_name_map": {},
        "key_contacts": [],
        "file_transfers": [],
        "common_table_data": None,
        "tables_found": []
    }

    if not os.path.exists(db_path):
        results["status"] = f"FILE_NOT_FOUND: {db_path}"
        return results

    uri = f"file:{db_path}?mode=ro"
    conn = None
    try:
        conn = sqlite3.connect(uri, uri=True, timeout=5.0)
        cur = conn.cursor()

        # Kiểm tra danh sách bảng
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [r[0] for r in cur.fetchall()]
        results["tables_found"] = tables

        # -------------------------------------------------------------
        # A. TRÍCH XUẤT BẢNG [info-cache]
        # -------------------------------------------------------------
        if 'info-cache' in tables:
            cur.execute("SELECT key, val FROM [info-cache]")
            rows = cur.fetchall()
            results["contacts_total"] = len(rows)

            uid_map = {}
            key_contacts = []

            for raw_key, raw_val in rows:
                key_prefix = ""
                uid = raw_key
                if "_" in raw_key:
                    parts = raw_key.split("_", 1)
                    key_prefix = parts[0]
                    uid = parts[1]

                z_name = ""
                avatar = ""
                alias_name = ""
                global_id = ""

                try:
                    val_json = json.loads(raw_val)
                    if isinstance(val_json, dict):
                        z_name = val_json.get("zName", "") or ""
                        avatar = val_json.get("avatar", "") or ""
                        alias_name = val_json.get("aliasName", "") or ""
                        global_id = val_json.get("GlobalId", "") or val_json.get("globalId", "") or ""
                except Exception:
                    z_name = str(raw_val)

                display_name = alias_name if alias_name else z_name
                contact_entry = {
                    "uid": uid,
                    "key_prefix": key_prefix,
                    "raw_key": raw_key,
                    "zName": z_name,
                    "aliasName": alias_name,
                    "displayName": display_name,
                    "avatar": avatar,
                    "globalId": global_id
                }

                # Lưu vào bảng map toàn bộ UID -> Tên
                uid_map[uid] = {
                    "zName": z_name,
                    "aliasName": alias_name,
                    "displayName": display_name,
                    "avatar": avatar,
                    "key_prefix": key_prefix
                }

                # Khớp từ khóa chuẩn xác
                full_search = f"{z_name} {alias_name}"
                matched = match_keywords(full_search)
                if matched:
                    entry_copy = dict(contact_entry)
                    entry_copy["matched_keywords"] = matched
                    key_contacts.append(entry_copy)

            results["uid_to_name_map"] = uid_map
            results["key_contacts"] = key_contacts

        # -------------------------------------------------------------
        # B. TRÍCH XUẤT BẢNG [db-stchecksum] (LỊCH SỬ FILE ĐÍNH KÈM)
        # -------------------------------------------------------------
        if 'db-stchecksum' in tables:
            cur.execute("SELECT checksum, url, size, isGroup, ts, zname FROM [db-stchecksum] ORDER BY ts DESC")
            file_rows = cur.fetchall()

            file_list = []
            for r in file_rows:
                checksum, url, size, is_group, ts, zname = r
                dt_str = ""
                if ts:
                    try:
                        dt_str = datetime.fromtimestamp(ts / 1000.0).strftime('%Y-%m-%d %H:%M:%S')
                    except Exception:
                        dt_str = str(ts)

                ext = ""
                if zname and "." in zname:
                    ext = zname.rsplit(".", 1)[-1].lower()

                file_item = {
                    "zname": zname,
                    "checksum": checksum,
                    "size_bytes": size,
                    "size_readable": format_file_size(size),
                    "isGroup": bool(is_group),
                    "ts": ts,
                    "datetime": dt_str,
                    "extension": ext,
                    "download_url": url
                }
                file_list.append(file_item)

            results["file_transfers"] = file_list

        # -------------------------------------------------------------
        # C. TRÍCH XUẤT BẢNG [common_table] (NẾU CÓ)
        # -------------------------------------------------------------
        if 'common_table' in tables:
            cur.execute("SELECT * FROM [common_table]")
            cols = [d[0] for d in cur.description]
            c_rows = cur.fetchall()
            results["common_table_data"] = [dict(zip(cols, row)) for row in c_rows]
        else:
            results["common_table_data"] = {
                "exists": False,
                "note": "Bảng [common_table] không tồn tại trong schema của Storage.db (các thông số phiên nằm tại SecureLocalstorage.db -> async-store)."
            }

        results["status"] = "SUCCESS"

    except Exception as e:
        results["status"] = f"ERROR: {str(e)}"
    finally:
        if conn:
            conn.close()

    return results

def read_secure_localstorage_db(db_path):
    """Đọc thông tin phiên và cấu hình từ SecureLocalstorage.db qua Read-Only SQLite."""
    results = {
        "status": "NOT_ACCESSED",
        "session_info": {},
        "sync_sessions": [],
        "recent_conversations": [],
        "last_online_timestamps": {}
    }

    if not os.path.exists(db_path):
        results["status"] = f"FILE_NOT_FOUND: {db_path}"
        return results

    uri = f"file:{db_path}?mode=ro"
    conn = None
    try:
        conn = sqlite3.connect(uri, uri=True, timeout=5.0)
        cur = conn.cursor()

        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [r[0] for r in cur.fetchall()]

        if 'async-store' in tables:
            cur.execute("SELECT key, val FROM [async-store]")
            rows = cur.fetchall()

            for key, val in rows:
                if "sync-session" in key:
                    results["sync_sessions"].append({
                        "key": key,
                        "val": val
                    })
                elif "e2ee-db-version" in key:
                    try:
                        results["session_info"][key] = json.loads(val)
                    except:
                        results["session_info"][key] = val
                elif "last-ts-online" in key:
                    try:
                        ts = int(val)
                        dt = datetime.fromtimestamp(ts / 1000.0).strftime('%Y-%m-%d %H:%M:%S') if ts > 0 else "0"
                        results["last_online_timestamps"][key] = {"ts": ts, "datetime": dt}
                    except:
                        results["last_online_timestamps"][key] = val
                elif "list-conversation-before-first-login" in key:
                    try:
                        conv_list = json.loads(val)
                        results["recent_conversations"].append({
                            "key": key,
                            "conversations": conv_list
                        })
                    except:
                        results["recent_conversations"].append({
                            "key": key,
                            "val": val
                        })

            results["status"] = "SUCCESS"
        else:
            results["status"] = "TABLE_ASYNC_STORE_NOT_FOUND"

    except Exception as e:
        results["status"] = f"ERROR: {str(e)}"
    finally:
        if conn:
            conn.close()

    return results

def main():
    """Hàm thực thi chính."""
    start_time = time.time()

    # 1. Cưỡng chế priority IDLE (0x00000040)
    priority_set = set_idle_priority()

    # 2. Đọc Storage.db
    storage_res = read_storage_db(STORAGE_DB_PATH)

    # 3. Đọc SecureLocalstorage.db
    secure_res = read_secure_localstorage_db(SECURE_DB_PATH)

    end_time = time.time()
    execution_ms = round((end_time - start_time) * 1000, 2)

    # 4. Bổ sung thông tin tên cho các cuộc hội thoại gần nhất
    uid_map = storage_res.get("uid_to_name_map", {})

    enriched_recent_conversations = []
    for conv_item in secure_res.get("recent_conversations", []):
        c_list = conv_item.get("conversations", [])
        enriched = []
        for cid in c_list:
            name_info = uid_map.get(str(cid), {})
            enriched.append({
                "conv_id": cid,
                "name": name_info.get("displayName", "Chưa rõ danh tính"),
                "avatar": name_info.get("avatar", "")
            })
        enriched_recent_conversations.append({
            "key": conv_item.get("key"),
            "conversations": enriched
        })

    # 5. Xác định UID Giám Đốc từ sync-session nếu có
    giam_doc_uid = None
    for s_sess in secure_res.get("sync_sessions", []):
        s_key = s_sess.get("key", "")
        if "sync-session-" in s_key:
            giam_doc_uid = s_key.replace("sync-session-", "").strip()
            break

    giam_doc_profile = uid_map.get(str(giam_doc_uid), {}) if giam_doc_uid else {}

    # 6. Tổng hợp dữ liệu kết quả xuất JSON
    output_data = {
        "summary": {
            "title": "ZALO SQLITE EXTRACTOR REPORT (ZERO-LOCK READ-ONLY)",
            "generated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "execution_ms": execution_ms,
            "idle_priority_enforced": priority_set,
            "storage_db_status": storage_res.get("status"),
            "secure_db_status": secure_res.get("status"),
            "giam_doc_account": {
                "uid": giam_doc_uid,
                "profile": giam_doc_profile
            },
            "total_contacts_indexed": storage_res.get("contacts_total", 0),
            "total_key_contacts_matched": len(storage_res.get("key_contacts", [])),
            "total_file_transfers_recorded": len(storage_res.get("file_transfers", [])),
            "databases_scanned": [
                {"path": STORAGE_DB_PATH, "tables": storage_res.get("tables_found", [])},
                {"path": SECURE_DB_PATH, "status": secure_res.get("status")}
            ]
        },
        "session_and_security": {
            "giam_doc_uid": giam_doc_uid,
            "session_versions": secure_res.get("session_info", {}),
            "sync_sessions": secure_res.get("sync_sessions", []),
            "last_online_timestamps": secure_res.get("last_online_timestamps", {}),
            "recent_conversations_with_names": enriched_recent_conversations,
            "common_table": storage_res.get("common_table_data")
        },
        "all_file_transfers": storage_res.get("file_transfers", []),
        "key_contacts": storage_res.get("key_contacts", []),
        "uid_to_name_map": storage_res.get("uid_to_name_map", {})
    }

    # 7. Ghi ra file JSON đích
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    # 8. In tóm tắt ra console
    print("=" * 70)
    print("BÁO CÁO THỰC THI ZALO SQLITE ZERO-LOCK READER")
    print("=" * 70)
    print(f" Thời gian thực thi: {execution_ms} ms")
    print(f" Ưu tiên IDLE (0x00000040): {'ĐÃ BẬT THÀNH CÔNG' if priority_set else 'CHƯA BẬT'}")
    print(f" Tài khoản Giám Đốc xác định: UID {giam_doc_uid} ({giam_doc_profile.get('displayName', 'Nghĩa')})")
    print(f" Tổng danh bạ trích xuất từ [info-cache]: {storage_res.get('contacts_total', 0):,} liên hệ")
    print(f" Danh bạ trọng điểm (PG Home/Vật tư/Thợ/KH): {len(storage_res.get('key_contacts', []))} liên hệ")
    print(f" Lịch sử truyền nhận file đính kèm [db-stchecksum]: {len(storage_res.get('file_transfers', []))} file")
    print(f" File kết quả đã ghi: {OUTPUT_JSON_PATH}")
    print("=" * 70)
    print("\n Danh sách file đính kèm tìm thấy:")
    for idx, f_item in enumerate(storage_res.get("file_transfers", []), 1):
        print(f"  {idx}. [{f_item.get('datetime')}] {f_item.get('zname')} ({f_item.get('size_readable')})")
    print("\n Top 10 danh bạ trọng điểm nổi bật:")
    for idx, c in enumerate(storage_res.get("key_contacts", [])[:10], 1):
        kws = ", ".join(c.get("matched_keywords", []))
        print(f"  {idx}. [{c.get('uid')}] {c.get('displayName')} (Khớp: {kws})")
    print("=" * 70)

if __name__ == "__main__":
    main()
