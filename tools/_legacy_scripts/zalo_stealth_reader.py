# -*- coding: utf-8 -*-
"""
========================================================================================
HỆ THỐNG ĐỌC DỮ LIỆU ZALO NGẦM TỪ THƯ MỤC Ổ CỨNG (100% PURE DISK READER) - PG HOME LUXURY
========================================================================================
Phiên bản: 6.0 PURE DISK + SQLITE (RO) + FILENOISE ENGINE
Chuẩn chỉ đạo Ban Giám Đốc PG Home Luxury (Nguyễn Viết Nghĩa) - 06/11/2026

NGUYÊN TẮC BẤT DI BẤT DỊCH (100% ĐỌC TRONG THƯ MỤC ZALO - KHÔNG ĐỤNG VÀO APP ZALO):
  1. TUYỆT ĐỐI KHÔNG ĐỤNG VÀO CỬA SỔ ZALO.EXE:
     - 100% Passive Disk & Read-Only SQLite (`mode=ro`). CPU < 0.2% (IDLE priority).
     - CẤM UIAutomation, CẤM SetForegroundWindow, CẤM DWMWA_CLOAK, CẤM SetWindowPos, CẤM PostMessageW.
     - Giám Đốc làm việc, nhắn tin, gọi điện trên Zalo PC hoàn toàn tự do 100% không bị gián đoạn.
  2. KẾT NỐI VÀ ĐỌC TRỰC TIẾP TRÊN Ổ CỨNG:
     - SQLite URI: C:\\Users\\Admin\\AppData\\Roaming\\ZaloData\\Database\\_production\\Storage.db?mode=ro
       * Bảng [info-cache]: Tự động map senderId (UID) sang Tên thật (zName/aliasName) của người gửi.
       * Bảng [db-stchecksum]: Danh sách file báo giá, hợp đồng, bảng kê xác thực mới nhất.
     - Filenoise: C:\\Users\\Admin\\AppData\\Roaming\\ZaloData\\media\\2304805760907141944\\ZaloDownloads\\fileNoise
       * Giải mã XOR 0x93 file PDF / Excel / Word đính kèm.
     - Resource: C:\\Users\\Admin\\AppData\\Roaming\\ZaloData\\media\\2304805760907141944\\ZaloDownloads\\resource
       * Bóc tách luồng media, ảnh hóa đơn, UNC, mẫu thiết kế của 4 nhóm trọng điểm:
         1) g3755853110317591515: Điều Hành Xưởng & Công Trình Trọng Điểm PG Home
         2) g795402381131416269: Nhóm Ghim Ưu Tiên Giám Đốc #1 (1.65 GB)
         3) g1588348021340609742: Nhóm Ghim Ưu Tiên Giám Đốc #2
         4) g2539027971900219384: Nhóm Đặt Hàng Vật Tư & Thanh Toán NCC (Vũ + Chị Hương)
========================================================================================
"""

import os
import sys
import re
import json
import glob
import time
import shutil
import hashlib
import sqlite3
import argparse
import datetime
import ctypes

sys.stdout.reconfigure(encoding='utf-8')

# Giảm priority tiến trình về mức IDLE (0x00000040) để chỉ đọc ổ cứng nhẹ nhàng (CPU < 0.2%)
try:
    ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x00000040)
except Exception:
    pass

ROOT_DIR = r"f:\PG Home - Quản trị"
DATA_DIR = os.path.join(ROOT_DIR, "data")
BATCH_DIR = os.path.join(DATA_DIR, "zalo_pulled_batches")
GROUP_LOGS_DIR = os.path.join(DATA_DIR, "group_logs")
LIVE_INBOX_FILE = os.path.join(DATA_DIR, "zalo_live_inbox.json")

ZALO_APPDATA = os.path.expandvars(r"%APPDATA%\ZaloData")
ZALO_LOCALAPPDATA = os.path.expandvars(r"%LOCALAPPDATA%\ZaloPC")
MEDIA_ACCOUNT = "2304805760907141944"

# Đường dẫn chuẩn hóa V6.0 ngoài ổ cứng
STORAGE_DB_PATH = os.path.join(ZALO_APPDATA, r"Database\_production\Storage.db")
MEDIA_RES_DIR = os.path.join(ZALO_APPDATA, "media", MEDIA_ACCOUNT, r"ZaloDownloads\resource")
FILENOISE_DIR = os.path.join(ZALO_APPDATA, "media", MEDIA_ACCOUNT, r"ZaloDownloads\fileNoise")
FILENOISE_LEGACY_DIR = os.path.join(ZALO_LOCALAPPDATA, MEDIA_ACCOUNT, r"zalo\fileNoise")
LEVELDB_DIR = os.path.join(ZALO_APPDATA, r"Partitions\zalo\Local Storage\leveldb")

# 4 Nhóm trọng điểm PG Home
PRIORITY_GROUPS = {
    "g3755853110317591515": {
        "title": "Điều Hành Xưởng & Công Trình Trọng Điểm PG Home",
        "category": "WORKSHOP_AND_SITE",
        "description": "Chỉ đạo sản xuất xưởng, thi công lắp đặt thực tế công trình"
    },
    "g795402381131416269": {
        "title": "Nhóm Ghim Ưu Tiên Giám Đốc #1 (1.65 GB)",
        "category": "PINNED_VIP_GROUP",
        "description": "Nhóm hội thoại ghim ưu tiên cao nhất của Giám Đốc"
    },
    "g1588348021340609742": {
        "title": "Nhóm Ghim Ưu Tiên Giám Đốc #2",
        "category": "PINNED_VIP_GROUP",
        "description": "Nhóm trao đổi chiến lược & hồ sơ công trình VIP"
    },
    "g2539027971900219384": {
        "title": "Nhóm Đặt Hàng Vật Tư & Thanh Toán NCC (Vũ + Chị Hương)",
        "category": "SUPPLIER_ORDER_UNC",
        "description": "Đề xuất vật tư xưởng, duyệt đơn, ủy nhiệm chi và hóa đơn nhà cung cấp"
    }
}


def get_readonly_sqlite_conn(db_path):
    """
    Kết nối SQLite chế độ Read-Only URI (mode=ro) an toàn 100%,
    không khóa database kể cả khi Zalo PC đang ghi dữ liệu.
    """
    if not os.path.exists(db_path):
        return None
    uri_path = f"file:///{db_path.replace(os.sep, '/')}?mode=ro"
    try:
        conn = sqlite3.connect(uri_path, uri=True, timeout=5.0)
        return conn
    except Exception:
        return None


def load_zalo_contacts_map():
    """
    Kết nối Read-Only SQLite tới Storage.db để lấy bảng [info-cache],
    tự động map senderId (UID) sang Tên thật trên Zalo (zName/aliasName).
    """
    contacts = {}
    conn = get_readonly_sqlite_conn(STORAGE_DB_PATH)
    if not conn:
        return contacts
    try:
        c = conn.cursor()
        c.execute("SELECT key, val FROM [info-cache]")
        rows = c.fetchall()
        for key, val in rows:
            if not val:
                continue
            try:
                data = json.loads(val)
                if isinstance(data, dict):
                    clean_uid = key.replace("0_", "").strip()
                    zname = data.get("zName") or ""
                    alias = data.get("aliasName") or ""
                    display_name = alias if alias else (zname if zname else clean_uid)
                    avatar = data.get("avatar") or ""
                    
                    contact_info = {
                        "uid": clean_uid,
                        "raw_key": key,
                        "zName": zname,
                        "aliasName": alias,
                        "displayName": display_name,
                        "avatar": avatar
                    }
                    contacts[clean_uid] = contact_info
                    contacts[key] = contact_info
            except Exception:
                continue
    except Exception:
        pass
    finally:
        try:
            conn.close()
        except Exception:
            pass
    return contacts


def load_db_stchecksum_files(contacts_map=None):
    """
    Kết nối Read-Only SQLite tới Storage.db để lấy bảng [db-stchecksum],
    đính kèm danh sách các file báo giá, hợp đồng, bảng kê mới nhất.
    """
    records = []
    conn = get_readonly_sqlite_conn(STORAGE_DB_PATH)
    if not conn:
        return records
    try:
        c = conn.cursor()
        c.execute("SELECT checksum, zname, size, isGroup, ts, url FROM [db-stchecksum] ORDER BY ts DESC")
        rows = c.fetchall()
        for checksum, zname, size, isGroup, ts, url in rows:
            time_str = datetime.datetime.fromtimestamp(ts / 1000).strftime("%Y-%m-%d %H:%M:%S") if ts else ""
            
            # Kiểm tra file đã tải về trong FILENOISE_DIR
            local_path = None
            if os.path.exists(FILENOISE_DIR):
                target_fp = os.path.join(FILENOISE_DIR, checksum)
                if os.path.exists(target_fp):
                    local_path = target_fp
                else:
                    sub_target = os.path.join(FILENOISE_DIR, "group", checksum)
                    if os.path.exists(sub_target):
                        local_path = sub_target
            
            # Phân loại tài liệu
            fn_lower = zname.lower()
            doc_type = "OTHER"
            if any(k in fn_lower for k in ["báo giá", "bao gia", "bg"]):
                doc_type = "QUOTE_XLSX"
            elif any(k in fn_lower for k in ["hợp đồng", "hop dong", "hd"]):
                doc_type = "CONTRACT_DOCX"
            elif any(k in fn_lower for k in ["bảng kê", "danh sách", "danh sach", "phiếu", "phieu"]):
                doc_type = "TIMESHEET_OR_SUMMARY"
            elif any(k in fn_lower for k in ["bhxh", "bảo hiểm"]):
                doc_type = "INSURANCE_DOCX"

            records.append({
                "checksum": checksum,
                "file_name": zname,
                "document_type": doc_type,
                "size_bytes": size,
                "is_group": bool(isGroup),
                "timestamp_ms": ts,
                "timestamp_str": time_str,
                "download_url": url,
                "local_noise_path": local_path,
                "is_locally_cached": local_path is not None
            })
    except Exception:
        pass
    finally:
        try:
            conn.close()
        except Exception:
            pass
    return records


def decode_filenoise_bytes(raw_bytes):
    """
    Giải mã định dạng fileNoise độc quyền của Zalo PC:
    - 100 byte đầu tiên bị XOR với 0x93
    - 6 byte cuối cùng được nối thêm chuỗi b'\\x07zAlO\\x07'
    """
    if not raw_bytes or len(raw_bytes) < 16:
        return raw_bytes
    data = bytearray(raw_bytes)
    n = min(100, len(data))
    for i in range(n):
        data[i] ^= 0x93
    if data.endswith(b'\x07zAlO\x07'):
        data = data[:-6]
    return bytes(data)


def scan_filenoise_folder():
    """Quét thụ động thư mục fileNoise trên ổ cứng để lấy danh sách PDF/Excel/Word đã tải về"""
    results = []
    target_dirs = []
    if os.path.exists(FILENOISE_DIR):
        target_dirs.append(FILENOISE_DIR)
    if os.path.exists(FILENOISE_LEGACY_DIR) and FILENOISE_LEGACY_DIR not in target_dirs:
        target_dirs.append(FILENOISE_LEGACY_DIR)

    seen_fns = set()
    for base_dir in target_dirs:
        for root, _, files in os.walk(base_dir):
            for fn in files:
                if fn == ".rescache" or fn in seen_fns:
                    continue
                seen_fns.add(fn)
                fp = os.path.join(root, fn)
                try:
                    st = os.stat(fp)
                    with open(fp, "rb") as f:
                        head = f.read(100)
                    dec_head = bytearray(head)
                    for i in range(len(dec_head)):
                        dec_head[i] ^= 0x93
                    magic = bytes(dec_head[:8])
                    ftype = "PDF" if magic.startswith(b"%PDF") else ("ZIP_XLSX_DOCX" if magic.startswith(b"PK\x03\x04") else "OTHER")
                    results.append({
                        "filename": fn,
                        "folder": os.path.basename(root),
                        "path": fp,
                        "size_bytes": st.st_size,
                        "mtime": datetime.datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                        "decoded_type": ftype
                    })
                except Exception:
                    pass
    results.sort(key=lambda x: x["mtime"], reverse=True)
    return results


def scan_priority_group_events(group_id, meta, contacts_map, limit_events=40):
    """
    Quét thụ động toàn bộ media, ảnh, tài liệu và phân tích luồng gửi của từng nhóm trọng điểm.
    Tự động gắn tên người gửi thực tế từ contacts_map.
    """
    group_dir = os.path.join(MEDIA_RES_DIR, group_id)
    if not os.path.exists(group_dir):
        return {
            "group_id": group_id,
            "title": meta.get("title", group_id),
            "category": meta.get("category", "UNKNOWN"),
            "description": meta.get("description", ""),
            "exists_on_disk": False,
            "total_media_files": 0,
            "active_members": [],
            "recent_events": []
        }

    pat = re.compile(r'^(\d{13})_(\d+)_([a-zA-Z0-9]+)(?:_(.*))?$')
    events = []
    member_counts = {}
    subfolder_stats = {}

    for root, _, files in os.walk(group_dir):
        sub = os.path.basename(root)
        subfolder_stats[sub] = subfolder_stats.get(sub, 0) + len([f for f in files if f != ".rescache"])
        for f in files:
            if f == ".rescache":
                continue
            fp = os.path.join(root, f)
            m = pat.match(f)
            if m:
                ts_ms = int(m.group(1))
                uid = m.group(2)
                contact = contacts_map.get(uid, {})
                sender_name = contact.get("displayName") or contact.get("zName") or uid
                member_counts[sender_name] = member_counts.get(sender_name, 0) + 1
                t_str = datetime.datetime.fromtimestamp(ts_ms / 1000).strftime("%Y-%m-%d %H:%M:%S")

                events.append({
                    "timestamp": t_str,
                    "timestamp_ms": ts_ms,
                    "sender_name": sender_name,
                    "sender_uid": uid,
                    "folder": sub,
                    "file_name": f,
                    "file_path": fp
                })

    events.sort(key=lambda x: x["timestamp_ms"], reverse=True)

    sorted_members = [
        {"name": name, "media_count": cnt}
        for name, cnt in sorted(member_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    return {
        "group_id": group_id,
        "title": meta.get("title", group_id),
        "category": meta.get("category", "UNKNOWN"),
        "description": meta.get("description", ""),
        "exists_on_disk": True,
        "total_media_files": len(events),
        "subfolders": subfolder_stats,
        "active_members": sorted_members[:10],
        "recent_events": events[:limit_events]
    }


def load_cached_conversations():
    """Đọc toàn bộ dữ liệu hội thoại đã lưu từ ổ cứng (data/zalo_pulled_batches & data/group_logs)"""
    conversations = {}
    if os.path.exists(BATCH_DIR):
        for bf in sorted(glob.glob(os.path.join(BATCH_DIR, "*.json"))):
            try:
                with open(bf, "r", encoding="utf-8") as f:
                    data = json.load(f)
                items = data.get("conversations", data.get("results", data if isinstance(data, list) else []))
                if isinstance(items, dict):
                    items = list(items.values())
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    name = item.get("group_name") or item.get("chat_title") or item.get("target") or item.get("name") or ""
                    if name:
                        conversations[name] = {
                            "group_name": name,
                            "source_file": os.path.basename(bf),
                            "messages": item.get("messages", item.get("recent_messages", [])),
                            "files": item.get("files", []),
                            "meta": {k: v for k, v in item.items() if k not in ("messages", "recent_messages")}
                        }
            except Exception:
                pass
    return conversations


def build_zalo_live_inbox(output_file=LIVE_INBOX_FILE):
    """
    Thu thập toàn bộ dữ liệu Zalo thời gian thực từ Storage.db, .rescache và fileNoise,
    tự động cập nhật file zalo_live_inbox.json.
    """
    start_time = time.time()

    # 1. Tải danh bạ tên thật từ SQLite [info-cache]
    contacts_map = load_zalo_contacts_map()

    # 2. Tải danh mục văn bản xác thực từ SQLite [db-stchecksum]
    checksum_docs = load_db_stchecksum_files(contacts_map)

    # 3. Quét thụ động thư mục fileNoise
    filenoise_files = scan_filenoise_folder()

    # 4. Quét 4 nhóm trọng điểm từ thư mục resource
    groups_summary = {}
    total_group_media = 0
    for gid, gmeta in PRIORITY_GROUPS.items():
        gdata = scan_priority_group_events(gid, gmeta, contacts_map, limit_events=30)
        groups_summary[gid] = gdata
        total_group_media += gdata.get("total_media_files", 0)

    # 5. Đọc các batch đã lưu trước đây
    convs = load_cached_conversations()

    # 6. Tổng hợp payload
    live_inbox = {
        "engine_version": "6.0-PURE-DISK-SQLITE-FILENOISE",
        "last_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "scan_duration_sec": round(time.time() - start_time, 3),
        "stealth_mode": "100% PURE DISK (ZERO APP TOUCH, CPU < 0.2% IDLE)",
        "zalo_window_touched": False,
        "metrics": {
            "contacts_mapped_count": len(contacts_map) // 2 if contacts_map else 0,
            "priority_groups_count": len(PRIORITY_GROUPS),
            "priority_media_count": total_group_media,
            "verified_checksum_docs_count": len(checksum_docs),
            "filenoise_files_count": len(filenoise_files),
            "cached_conversations_count": len(convs)
        },
        "verified_documents": checksum_docs,
        "priority_groups": groups_summary,
        "filenoise_recent_files": filenoise_files[:25],
        "cached_conversations": [
            {
                "group_name": cname,
                "source": cval.get("source_file"),
                "message_count": len(cval.get("messages", []))
            }
            for cname, cval in convs.items()
        ]
    }

    # Ghi file an toàn
    if output_file:
        try:
            os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(live_inbox, f, ensure_ascii=False, indent=2)
            live_inbox["saved_path"] = os.path.abspath(output_file)
        except Exception as e:
            live_inbox["save_error"] = str(e)

    return live_inbox


def read_zalo_stealth(target_group=None, limit=20, scroll_history=0, output_file=None):
    """
    Đọc dữ liệu hội thoại từ ổ cứng. Luôn tự động cập nhật zalo_live_inbox.json.
    """
    # Cập nhật live inbox
    inbox = build_zalo_live_inbox(output_file=LIVE_INBOX_FILE)

    convs = load_cached_conversations()
    matched_conv = None

    if target_group:
        t_low = target_group.lower().strip()
        # Tìm trong priority groups trước
        for gid, gdata in inbox.get("priority_groups", {}).items():
            if t_low in gid.lower() or t_low in gdata.get("title", "").lower() or t_low in gdata.get("category", "").lower():
                matched_conv = {
                    "group_name": gdata.get("title"),
                    "group_id": gid,
                    "category": gdata.get("category"),
                    "source_file": "resource/" + gid,
                    "messages": gdata.get("recent_events", [])[:limit],
                    "active_members": gdata.get("active_members", [])
                }
                break

        # Nếu chưa tìm thấy, tìm trong cached batch
        if not matched_conv:
            for name, cdata in convs.items():
                if t_low in name.lower() or name.lower() in t_low:
                    matched_conv = cdata
                    break
    elif inbox.get("priority_groups"):
        # Mặc định lấy nhóm Điều Hành Xưởng
        first_gid = "g3755853110317591515"
        gdata = inbox["priority_groups"].get(first_gid, next(iter(inbox["priority_groups"].values())))
        matched_conv = {
            "group_name": gdata.get("title"),
            "group_id": first_gid,
            "category": gdata.get("category"),
            "source_file": "resource/" + first_gid,
            "messages": gdata.get("recent_events", [])[:limit],
            "active_members": gdata.get("active_members", [])
        }

    msgs = matched_conv.get("messages", [])[:limit] if matched_conv else []
    selected_name = matched_conv.get("group_name") if matched_conv else (target_group or "Toàn bộ kho dữ liệu ZaloData")

    res = {
        "status": "SUCCESS",
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "stealth_mode": "PURE_DISK_SQLITE_FILENOISE_V6",
        "zalo_window_touched": False,
        "selected_group": selected_name,
        "matched_data": matched_conv,
        "total_messages_retrieved": len(msgs),
        "verified_documents_available": len(inbox.get("verified_documents", [])),
        "filenoise_recent_count": len(inbox.get("filenoise_recent_files", [])),
        "live_inbox_updated": LIVE_INBOX_FILE
    }

    if output_file and output_file != LIVE_INBOX_FILE:
        try:
            os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(res, f, ensure_ascii=False, indent=2)
            res["saved_to"] = os.path.abspath(output_file)
        except Exception as e:
            res["save_error"] = str(e)

    return res


def list_visible_groups():
    """Liệt kê toàn bộ các nhóm trọng điểm và hội thoại trên ổ cứng ZaloData"""
    inbox = build_zalo_live_inbox(output_file=LIVE_INBOX_FILE)
    groups = []
    
    # Priority groups
    for gid, gdata in inbox.get("priority_groups", {}).items():
        groups.append({
            "group_id": gid,
            "name": gdata.get("title"),
            "category": gdata.get("category"),
            "type": "PRIORITY_VIP_GROUP",
            "media_count": gdata.get("total_media_files", 0),
            "top_members": [m["name"] for m in gdata.get("active_members", [])[:3]]
        })

    # Cached batch conversations
    convs = load_cached_conversations()
    for name, cdata in convs.items():
        groups.append({
            "group_id": None,
            "name": name,
            "category": "CACHED_CONVERSATION",
            "type": "PULLED_BATCH",
            "message_count": len(cdata.get("messages", []))
        })

    return {
        "status": "SUCCESS",
        "stealth_mode": "PURE_DISK_SQLITE_FILENOISE_V6",
        "zalo_window_touched": False,
        "total_groups": len(groups),
        "groups": groups
    }


def main():
    parser = argparse.ArgumentParser(description="Đọc dữ liệu Zalo V6.0 100% từ thư mục ổ cứng & SQLite (Không can thiệp cửa sổ Zalo PC)")
    parser.add_argument("--group", "-g", default=None, help="Tên hoặc ID nhóm chat cần tra cứu")
    parser.add_argument("--limit", "-l", type=int, default=20, help="Số sự kiện/tin nhắn gần nhất cần lấy")
    parser.add_argument("--scroll", "-s", type=int, default=0, help="Giữ tương thích CLI cũ")
    parser.add_argument("--list-groups", "-L", action="store_true", help="Liệt kê các nhóm trọng điểm & hội thoại")
    parser.add_argument("--output", "-o", default=None, help="Đường dẫn file JSON lưu kết quả")
    parser.add_argument("--sync-inbox", "-S", action="store_true", help="Chạy đồng bộ toàn bộ zalo_live_inbox.json")

    args = parser.parse_args()

    # Mặc định khi chạy không đối số hoặc với --sync-inbox: Tự động cập nhật zalo_live_inbox.json
    if args.list_groups:
        data = list_visible_groups()
        print(json.dumps(data, ensure_ascii=False, indent=2))
    elif args.sync_inbox or (args.group is None and args.output is None):
        inbox = build_zalo_live_inbox(output_file=LIVE_INBOX_FILE)
        summary = {
            "status": "SUCCESS",
            "version": inbox.get("engine_version"),
            "last_updated": inbox.get("last_updated"),
            "stealth_mode": inbox.get("stealth_mode"),
            "metrics": inbox.get("metrics"),
            "verified_documents": [
                {
                    "file_name": doc["file_name"],
                    "document_type": doc["document_type"],
                    "timestamp": doc["timestamp_str"],
                    "size_bytes": doc["size_bytes"]
                }
                for doc in inbox.get("verified_documents", [])
            ],
            "priority_groups": {
                gid: {
                    "title": g["title"],
                    "category": g["category"],
                    "total_media": g["total_media_files"],
                    "top_members": [m["name"] for m in g["active_members"][:3]],
                    "latest_event": g["recent_events"][0]["timestamp"] if g["recent_events"] else None
                }
                for gid, g in inbox.get("priority_groups", {}).items()
            },
            "saved_to": LIVE_INBOX_FILE
        }
        print(json.dumps(summary, ensure_ascii=False, indent=2))
    else:
        data = read_zalo_stealth(
            target_group=args.group,
            limit=args.limit,
            scroll_history=args.scroll,
            output_file=args.output
        )
        print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
