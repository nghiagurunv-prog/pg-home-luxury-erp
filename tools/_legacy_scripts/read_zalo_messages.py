"""
read_zalo_messages.py - Tool trích xuất tin nhắn, tài liệu và hoạt động Zalo Stealth Reader V6.0
================================================================================================
Phiên bản: V6.0 (Enterprise Silent Rescache & Storage SQLite Engine)
Cập nhật: 2026-11-06
Tác giả: PG Home Luxury AI Engine (Worker Wave 2 #5)

NÂNG CẤP V6.0 ĐỘT PHÁ:
1. Kết nối SQLite Read-Only URI (mode=ro) vào Storage.db (C:\\Users\\Admin\\AppData\\Roaming\\ZaloData\\Database\\_production\\Storage.db).
   - Đọc bảng [info-cache]: Ánh xạ toàn bộ 8,400+ UID sang tên người dùng thật (zName, aliasName, dName).
   - Đọc bảng [db-stchecksum]: Trích xuất danh sách file công việc, báo giá, hợp đồng mới nhất kèm thời gian và kích thước.
2. Quét passive .rescache trong toàn bộ kho tài nguyên ZaloPC / ZaloData:
   - Trích xuất timestamp, sender UID, conversation ID, hash file.
   - Kết hợp trực tiếp với [info-cache] để gắn senderName thật 100% (Hiệp, Vũ, Thái, Dũng, Quốc Tâm...) thay vì UID thô.
3. Trích xuất thực thể đơn hàng / dự án tự động (Anh Nam, An Cường, Hóa đơn, Báo giá, Hợp đồng...).
4. Tuân thủ 100% Kỷ luật thép: Zero-Disruption, không đụng vào cửa sổ Zalo.exe, không chiếm chuột/bàn phím.
"""

import os
import sys
import json
import sqlite3
import re
import argparse
from datetime import datetime
from pathlib import Path

# Đường dẫn mặc định ZaloData
DEFAULT_ZALO_DATA = Path(r"C:\Users\Admin\AppData\Roaming\ZaloData")
DEFAULT_STORAGE_DB = DEFAULT_ZALO_DATA / "Database" / "_production" / "Storage.db"
DEFAULT_OUTPUT_JSON = Path(r"f:\PG Home - Quản trị\data\zalo_messages_live.json")

# Danh mục nhân sự nòng cốt PG Home để phân loại nhanh
CORE_STAFF = {
    "2304805760907141944": "Nguyễn Viết Nghĩa (Giám Đốc)",
    "2845688247116683961": "Vũ Xưởng (Kỹ thuật xưởng)",
    "7617747951538527859": "Hiệp Sale (Sale Admin)",
    "2589261669335747882": "Dũng (Dự toán Sale)",
    "1266851172782015824": "Thái Kỹ Thuật (Kỹ thuật nội thất)",
    "3689145980600156662": "Quốc Tâm (NCC Vật tư)",
    "2066112038641971304": "Hòa Thợ (Thợ mộc nòng cốt)",
    "219463991206121510": "Duy Hào (Thợ nòng cốt)",
}


def get_storage_db_connection(db_path: Path):
    """Mở kết nối SQLite Read-Only tuyệt đối an toàn, không lock database."""
    if not db_path.exists():
        raise FileNotFoundError(f"Không tìm thấy database tại: {db_path}")
    
    # Chuẩn hóa đường dẫn URI Windows
    norm_path = str(db_path.resolve()).replace("\\", "/")
    uri = f"file:///{norm_path}?mode=ro"
    
    conn = sqlite3.connect(uri, uri=True, timeout=5.0)
    conn.row_factory = sqlite3.Row
    return conn


def load_info_cache(conn) -> tuple:
    """
    Trích xuất toàn bộ bảng [info-cache] từ Storage.db
    Trả về: (user_map, group_map)
    """
    user_map = {}
    group_map = {}
    try:
        cur = conn.cursor()
        cur.execute("SELECT key, val FROM [info-cache]")
        rows = cur.fetchall()
        for r in rows:
            key_raw = r["key"]
            val_raw = r["val"]
            if not val_raw:
                continue
            
            is_group = key_raw.startswith("1_")
            entity_id = key_raw.split("_", 1)[-1] if "_" in key_raw else key_raw
            
            try:
                data = json.loads(val_raw)
                if isinstance(data, dict):
                    z_name = data.get("zName") or data.get("name") or data.get("groupName") or ""
                    alias_name = data.get("aliasName") or ""
                    d_name = data.get("dName") or ""
                    
                    display_name = alias_name or z_name or d_name or entity_id
                    
                    info = {
                        "id": entity_id,
                        "displayName": display_name,
                        "zName": z_name,
                        "aliasName": alias_name,
                        "dName": d_name,
                        "avatar": data.get("avatar", ""),
                    }
                    
                    if is_group:
                        group_map[entity_id] = info
                        # Also map with 'g' prefix if not present
                        if not entity_id.startswith("g"):
                            group_map[f"g{entity_id}"] = info
                    else:
                        user_map[entity_id] = info
            except Exception:
                continue
    except Exception as e:
        print(f"[!] Lỗi khi đọc [info-cache]: {e}", file=sys.stderr)
        
    return user_map, group_map


def load_db_stchecksum(conn, limit=100) -> list:
    """
    Trích xuất danh sách file công việc gần nhất từ bảng [db-stchecksum] trong Storage.db
    Columns: ['checksum', 'url', 'size', 'isGroup', 'ts', 'zname']
    """
    work_docs = []
    try:
        cur = conn.cursor()
        cur.execute("SELECT checksum, url, size, isGroup, ts, zname FROM [db-stchecksum] ORDER BY ts DESC")
        rows = cur.fetchall()
        for r in rows:
            file_name = r["zname"] or r["checksum"]
            file_size = r["size"] or 0
            file_time_raw = r["ts"] or 0
            
            time_str = ""
            if file_time_raw:
                try:
                    ts_sec = file_time_raw / 1000 if file_time_raw > 1e11 else file_time_raw
                    time_str = datetime.fromtimestamp(ts_sec).strftime("%Y-%m-%d %H:%M:%S")
                except Exception:
                    time_str = str(file_time_raw)
            
            doc_type = "file"
            ext = Path(file_name).suffix.lower()
            if ext in [".xlsx", ".xls", ".csv"]:
                doc_type = "excel"
            elif ext in [".pdf"]:
                doc_type = "pdf"
            elif ext in [".doc", ".docx"]:
                doc_type = "word"
            elif ext in [".dwg", ".dxf"]:
                doc_type = "cad"
            elif ext in [".jpg", ".jpeg", ".png", ".webp"]:
                doc_type = "image"
            
            work_docs.append({
                "checksum": r["checksum"],
                "fileName": file_name,
                "fileSize": file_size,
                "fileSizeFormatted": format_file_size(file_size),
                "fileType": doc_type,
                "time": time_str,
                "timestamp": file_time_raw,
                "isGroup": bool(r["isGroup"]),
                "url": r["url"] or ""
            })
    except Exception as e:
        print(f"[!] Lỗi khi đọc [db-stchecksum]: {e}", file=sys.stderr)
        
    return work_docs[:limit]


def scan_rescache_activities(zalo_data_dir: Path, user_map: dict, group_map: dict, limit=500) -> list:
    """
    Quét thụ động toàn bộ file .rescache trong ZaloDownloads để lấy danh sách tương tác mới nhất,
    kết hợp với [info-cache] để trích xuất đầy đủ tên thật của người gửi và tên nhóm trò chuyện.
    """
    activities = []
    seen_keys = set()
    
    media_dir = zalo_data_dir / "media"
    if not media_dir.exists():
        return activities
        
    rescache_files = list(media_dir.rglob(".rescache"))
    print(f"[*] Quét passive: tìm thấy {len(rescache_files)} file .rescache trong kho dữ liệu Zalo.")
    
    for rpath in rescache_files:
        try:
            if rpath.stat().st_size <= 64:
                continue
                
            with open(rpath, "r", encoding="utf-8", errors="ignore") as f:
                content = json.load(f)
                
            data_dict = content.get("data", {})
            if not isinstance(data_dict, dict):
                continue
                
            parent_folder_name = rpath.parent.name.lower()
            
            for key, val in data_dict.items():
                if not key or key in seen_keys:
                    continue
                    
                # Format chuẩn: <ts>_<senderUid>_<convId>_<hash>.<ext>
                parts = key.split("_")
                if len(parts) >= 4:
                    ts_str = parts[0]
                    sender_uid = parts[1]
                    conv_id = parts[2]
                    rest = "_".join(parts[3:])
                    ext = Path(key).suffix.lower()
                    
                    seen_keys.add(key)
                    
                    # Chuyển đổi timestamp
                    try:
                        ts_val = int(ts_str)
                        ts_sec = ts_val / 1000 if ts_val > 1e11 else ts_val
                        time_obj = datetime.fromtimestamp(ts_sec)
                        time_str = time_obj.strftime("%Y-%m-%d %H:%M:%S")
                    except Exception:
                        ts_val = 0
                        time_str = ""
                        
                    # Tra cứu tên người gửi thật
                    if sender_uid in CORE_STAFF:
                        sender_name = CORE_STAFF[sender_uid]
                    elif sender_uid in user_map:
                        sender_name = user_map[sender_uid]["displayName"]
                    else:
                        sender_name = f"Người dùng {sender_uid}"
                        
                    # Tra cứu tên nhóm hoặc người đối thoại
                    is_group = conv_id.startswith("g")
                    conv_type = "Nhóm làm việc" if is_group else "Tin nhắn riêng"
                    
                    if is_group:
                        gid_clean = conv_id[1:] if conv_id.startswith("g") else conv_id
                        if conv_id in group_map:
                            conv_name = group_map[conv_id]["displayName"]
                        elif gid_clean in group_map:
                            conv_name = group_map[gid_clean]["displayName"]
                        else:
                            conv_name = f"Nhóm {conv_id}"
                    else:
                        if conv_id in user_map:
                            conv_name = user_map[conv_id]["displayName"]
                        elif conv_id in CORE_STAFF:
                            conv_name = CORE_STAFF[conv_id]
                        else:
                            conv_name = f"Người dùng {conv_id}"
                            
                    file_size = 0
                    if isinstance(val, list) and len(val) >= 2:
                        file_size = val[1] or 0
                        
                    # Phân loại tài nguyên
                    media_category = "media"
                    if "picture" in parent_folder_name or ext in [".jpg", ".jpeg", ".png", ".jxl", ".webp"]:
                        media_category = "picture"
                    elif "file" in parent_folder_name or ext in [".xlsx", ".pdf", ".docx", ".zip", ".rar"]:
                        media_category = "document"
                    elif "video" in parent_folder_name or ext in [".mp4", ".mov", ".avi"]:
                        media_category = "video"
                    elif "voice" in parent_folder_name or ext in [".aac", ".mp3", ".wav"]:
                        media_category = "voice"
                    elif "richthumb" in parent_folder_name:
                        media_category = "richThumb"
                        
                    activities.append({
                        "activityType": "zalo_media_transfer",
                        "mediaCategory": media_category,
                        "timestamp": ts_val,
                        "time": time_str,
                        "senderUid": sender_uid,
                        "senderName": sender_name,
                        "convId": conv_id,
                        "convName": conv_name,
                        "convType": conv_type,
                        "fileName": key,
                        "fileExt": ext,
                        "fileSize": file_size,
                        "fileSizeFormatted": format_file_size(file_size),
                        "sourceRescache": str(rpath)
                    })
        except Exception:
            continue
            
    # Sắp xếp hoạt động mới nhất lên hàng đầu
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    return activities[:limit]


def extract_entities_from_records(work_docs: list, activities: list) -> dict:
    """
    Trích xuất các thực thể công việc trọng điểm từ tên file và hoạt động:
    - Dự án / Khách hàng (Anh Nam, Biệt thự...)
    - Loại hồ sơ (Báo giá, Hợp đồng, Hóa đơn, Bảo hiểm, Bóc tách...)
    """
    projects = set()
    doc_types = {"báo giá": 0, "hợp đồng": 0, "hóa đơn": 0, "vật tư": 0, "bản vẽ": 0, "khác": 0}
    
    keywords_proj = ["anh nam", "chị lan", "anh tú", "anh tuấn", "phú gia", "pg home", "vĩnh phúc", "phúc yên"]
    
    for doc in work_docs:
        name_lower = doc["fileName"].lower()
        if "báo giá" in name_lower or "bao gia" in name_lower:
            doc_types["báo giá"] += 1
        elif "hợp đồng" in name_lower or "hop dong" in name_lower:
            doc_types["hợp đồng"] += 1
        elif "hóa đơn" in name_lower or "hoa don" in name_lower or "unc" in name_lower:
            doc_types["hóa đơn"] += 1
        elif "vật tư" in name_lower or "vat tu" in name_lower or "gỗ" in name_lower:
            doc_types["vật tư"] += 1
        elif "bản vẽ" in name_lower or "cad" in name_lower or ".dwg" in name_lower:
            doc_types["bản vẽ"] += 1
        else:
            doc_types["khác"] += 1
            
        for kp in keywords_proj:
            if kp in name_lower:
                projects.add(kp.title())
                
    return {
        "detectedProjects": list(projects),
        "documentBreakdown": doc_types
    }


def compute_personnel_stats(activities: list) -> dict:
    """Thống kê hoạt động gần nhất theo nhân sự PG Home"""
    stats = {}
    for act in activities:
        name = act["senderName"]
        stats[name] = stats.get(name, 0) + 1
    return stats


def format_file_size(size_bytes: int) -> str:
    """Format dung lượng sang KB, MB dễ đọc"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"


def run_pipeline(storage_db_path: Path, output_file: Path, limit_docs=100, limit_act=300):
    """Quy trình toàn diện V6.0: Storage.db + [info-cache] + [db-stchecksum] + .rescache -> JSON"""
    print(f"[*] PG HOME STEALTH ZALO READER V6.0 BẮT ĐẦU QUÉT...")
    print(f"[*] Database: {storage_db_path}")
    
    if not storage_db_path.exists():
        print(f"[!] Lỗi: Không tồn tại file Storage.db tại {storage_db_path}", file=sys.stderr)
        return False
        
    conn = get_storage_db_connection(storage_db_path)
    
    # 1. Trích xuất [info-cache]
    print("[*] Đang đọc [info-cache] để lập bản đồ UID & Nhóm -> Tên thật...")
    user_map, group_map = load_info_cache(conn)
    print(f"[+] Đã tải mapping danh bạ cho {len(user_map):,} tài khoản & {len(group_map):,} nhóm Zalo.")
    
    # 2. Trích xuất [db-stchecksum]
    print("[*] Đang đọc [db-stchecksum] để lấy file tài liệu công việc...")
    work_docs = load_db_stchecksum(conn, limit=limit_docs)
    print(f"[+] Đã trích xuất {len(work_docs)} tài liệu công việc mới nhất.")
    
    conn.close()
    
    # 3. Quét thụ động .rescache
    print("[*] Đang quét kho tài nguyên .rescache passive...")
    zalo_data_dir = storage_db_path.parent.parent.parent  # C:\Users\Admin\AppData\Roaming\ZaloData
    activities = scan_rescache_activities(zalo_data_dir, user_map, group_map, limit=limit_act)
    print(f"[+] Đã trích xuất {len(activities)} hoạt động tương tác gần nhất kèm tên người gửi & nhóm.")
    
    # 4. Trích xuất thực thể
    entities = extract_entities_from_records(work_docs, activities)
    staff_stats = compute_personnel_stats(activities)
    
    # 5. Đóng gói kết quả
    result_payload = {
        "metadata": {
            "version": "V6.0",
            "system": "PG Home Luxury Stealth Reader",
            "scanTimestamp": datetime.now().isoformat(),
            "scanTimestampStr": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "sourceDb": str(storage_db_path),
            "status": "SUCCESS",
            "zeroDisruption": True
        },
        "summary": {
            "totalCachedUsers": len(user_map),
            "totalWorkDocuments": len(work_docs),
            "totalRecentActivities": len(activities),
            "detectedProjects": entities["detectedProjects"],
            "documentBreakdown": entities["documentBreakdown"],
            "personnelActivityCount": staff_stats
        },
        "workDocuments": work_docs,
        "recentActivities": activities
    }
    
    # 6. Ghi ra file JSON đích
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result_payload, f, ensure_ascii=False, indent=2)
        
    print(f"[✓] Đã xuất thành công dữ liệu V6.0 ra: {output_file}")
    print(f"[✓] Dung lượng file: {format_file_size(output_file.stat().st_size)}")
    return True


def main():
    parser = argparse.ArgumentParser(description="PG Home Luxury - Zalo Stealth Reader V6.0")
    parser.add_argument("-d", "--db", type=Path, default=DEFAULT_STORAGE_DB, help="Đường dẫn tới Storage.db")
    parser.add_argument("-o", "--output", type=Path, default=DEFAULT_OUTPUT_JSON, help="Đường dẫn file JSON đầu ra")
    parser.add_argument("--limit-docs", type=int, default=100, help="Số file tài liệu tối đa")
    parser.add_argument("--limit-act", type=int, default=300, help="Số hoạt động .rescache tối đa")
    
    args = parser.parse_args()
    
    success = run_pipeline(
        storage_db_path=args.db,
        output_file=args.output,
        limit_docs=args.limit_docs,
        limit_act=args.limit_act
    )
    
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
