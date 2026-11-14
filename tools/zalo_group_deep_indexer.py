# -*- coding: utf-8 -*-
r"""
Deep Indexer for 175 Zalo Groups in Resource Directory.
Runs at IDLE_PRIORITY_CLASS (0x00000040) with Zero-Disruption to user activities.
Connects read-only to Storage.db (info-cache) to resolve sender identities.
Outputs full audit data to: f:\PG Home - Quản trị\data\zalo_175_groups_full_index.json
"""

import os
import sys
import re
import json
try:
    import pg_fast_io as _pg_fast_io
    json = _pg_fast_io.json
except Exception:
    pass
import sqlite3
import datetime
import ctypes

# Set Windows process priority to IDLE (0x00000040)
try:
    kernel32 = ctypes.windll.kernel32
    kernel32.SetPriorityClass(kernel32.GetCurrentProcess(), 0x00000040)
except Exception:
    pass

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"C:\Users\Admin\AppData\Roaming\ZaloData\Database\_production\Storage.db"
RESOURCE_PATH = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource"
OUTPUT_JSON_PATH = r"f:\PG Home - Quản trị\data\zalo_175_groups_full_index.json"

# Connect and get contacts cache from Storage.db (mode=ro)
conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
cur = conn.cursor()
cur.execute("SELECT key, val FROM 'info-cache'")
contacts = {}
for k, v in cur.fetchall():
    uid = k.split("_", 1)[1] if "_" in k else k
    try:
        data = json.loads(v)
        alias = data.get("aliasName")
        zname = data.get("zName")
        disp = data.get("displayName")
        best_name = alias or zname or disp or f"UID_{uid}"
        contacts[uid] = {
            "name": best_name,
            "aliasName": alias,
            "zName": zname,
            "displayName": disp
        }
    except Exception:
        pass
conn.close()

# Ground Truth knowledge for verified PG Home groups
GROUND_TRUTH = {
    "g6116598459303638566": ("Tổng Kho Ván Lam Giang (An Cường & Thái Lan)", "SUPPLIER"),
    "g495486322416346660": ("Tổng Kho Phụ Kiện Quốc Tâm", "SUPPLIER"),
    "g1792366938218612507": ("Xưởng Sản Xuất PG Home (Đội Ngũ Xưởng)", "WORKSHOP"),
    "g8911374775675572335": ("Đặt hàng Phú Gia - NT (Gỗ NT Cầu Vượt)", "SUPPLIER"),
    "g6882545434220944455": ("KÍNH VIỆT NHẬT - PHÚ GIA LUXURY", "SUPPLIER"),
    "g4212121922329497264": ("Chốt màu, đặt hàng Cường Thịnh", "SUPPLIER"),
    "g727862869232620509": ("2026 Đặt hàng anh Cường Hà Nội", "SUPPLIER"),
    "g7737669618333682341": ("Đặt hàng Ceramic Hoàng Hà HY", "SUPPLIER"),
    "g1224067034537716792": ("Đặt hàng gỗ thịt Đức Anh - Thu Hương HT", "SUPPLIER"),
    "g8487057108956790028": ("Đặt hàng Kính, Gương Phú Mỹ (Vinh)", "SUPPLIER"),
    "g8149011240458184403": ("Thiết kế nhà Bác Phát Đường 26/03", "PROJECT"),
    "g3755853110317591515": ("Điều Hành Xưởng & Công Trình Trọng Điểm PG Home", "WORKSHOP"),
    "g795402381131416269": ("Nhóm Ghim Ưu Tiên Giám Đốc #1", "PINNED_VIP"),
    "g1588348021340609742": ("Nhóm Ghim Ưu Tiên Giám Đốc #2", "PINNED_VIP"),
    "g2539027971900219384": ("Nhóm Đặt Hàng Vật Tư & UNC (Vũ - Chị Hương)", "SUPPLIER"),
    "g7736623945291314586": ("Thiết kế nhà Anh Trung Tuyết", "PROJECT"),
}

g_dirs = sorted([d for d in os.listdir(RESOURCE_PATH) if d.startswith("g") and os.path.isdir(os.path.join(RESOURCE_PATH, d))])
fn_pattern = re.compile(r"^(\d{12,14})_(\d+)_g\d+.*$")

all_groups = []
total_all_files = 0
total_all_bytes = 0
category_counts = {"WORKSHOP": 0, "PROJECT": 0, "SUPPLIER": 0, "PINNED_VIP": 0, "OTHER": 0}

for gid in g_dirs:
    grp_path = os.path.join(RESOURCE_PATH, gid)
    file_count = 0
    size_bytes = 0
    latest_ts_ms = 0
    latest_mtime = 0
    sender_counts = {}
    
    subdirs = ["Cache", "picture", "fileNoise", "video", "voice", "richThumb"]
    for sub in subdirs:
        sub_p = os.path.join(grp_path, sub)
        if not os.path.exists(sub_p):
            continue
        try:
            entries = os.scandir(sub_p)
        except Exception:
            continue
            
        for entry in entries:
            if entry.name == ".rescache" or not entry.is_file():
                continue
            file_count += 1
            try:
                st = entry.stat()
                size_bytes += st.st_size
                if st.st_mtime > latest_mtime:
                    latest_mtime = st.st_mtime
            except Exception:
                pass
                
            m = fn_pattern.match(entry.name)
            if m:
                ts_ms = int(m.group(1))
                uid = m.group(2)
                if ts_ms > latest_ts_ms:
                    latest_ts_ms = ts_ms
                sender_counts[uid] = sender_counts.get(uid, 0) + 1
            else:
                parts = entry.name.split("_")
                if len(parts) >= 2 and parts[0].isdigit() and parts[1].isdigit():
                    ts_ms = int(parts[0])
                    uid = parts[1]
                    if ts_ms > latest_ts_ms:
                        latest_ts_ms = ts_ms
                    sender_counts[uid] = sender_counts.get(uid, 0) + 1
                    
    top_senders_sorted = sorted(sender_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    top_senders = []
    sender_names_list = []
    has_workshop_worker = False
    has_pg_staff = False
    has_supplier_keyword = False
    
    for uid, cnt in top_senders_sorted:
        c_info = contacts.get(uid, {})
        name = c_info.get("name", f"UID_{uid}")
        top_senders.append({
            "uid": uid,
            "name": name,
            "aliasName": c_info.get("aliasName"),
            "zName": c_info.get("zName"),
            "file_count": cnt
        })
        sender_names_list.append(name)
        
        name_lower = name.lower()
        if any(w in name_lower for w in ["hào", "hòa pghome", "thoan thợ", "lực xưởng", "đức lành"]):
            has_workshop_worker = True
        if any(w in name_lower for w in ["phú gia", "pghome", "pg home", "thái pg", "nghĩa guru", "vũ", "dũng pg"]):
            has_pg_staff = True
        if any(w in name_lower for w in ["lam giang", "lamgiang", "quốc tâm", "cầu vượt", "vsg", "kính", "cường thịnh", "đức anh", "hoàng hà", "phú mỹ", "sơn pu", "thạch cao", "cửa"]):
            has_supplier_keyword = True
            
    best_ts = max(latest_ts_ms / 1000.0 if latest_ts_ms > 0 else 0, latest_mtime)
    latest_iso = datetime.datetime.fromtimestamp(best_ts).strftime("%Y-%m-%d %H:%M:%S") if best_ts > 0 else None
    
    # Classification & Name Resolution
    group_name = None
    category = "OTHER"
    
    if gid in GROUND_TRUTH:
        group_name, category = GROUND_TRUTH[gid]
    elif gid == "g7081961912632715916":
        group_name = "Tổ Thợ Xưởng Sản Xuất PG Home (Hào, Hòa, Thoan)"
        category = "WORKSHOP"
    elif gid == "g3139659005682825558":
        group_name = "Tổ Lắp Ráp & Thi Công Xưởng (Hòa, Thái, Dũng)"
        category = "WORKSHOP"
    elif gid == "g4513975030953450080":
        group_name = "Tổ Xưởng Sản Xuất (Lực Xưởng PG Home)"
        category = "WORKSHOP"
    elif has_workshop_worker and has_pg_staff:
        group_name = f"Nhóm Xưởng Thi Công ({', '.join(sender_names_list[:2])})"
        category = "WORKSHOP"
    elif has_pg_staff and has_supplier_keyword:
        group_name = f"Nhóm Đặt Hàng & Vật Tư ({', '.join(sender_names_list[:2])})"
        category = "SUPPLIER"
    elif has_pg_staff and len(top_senders) >= 2:
        client_names = [s["name"] for s in top_senders if not any(w in s["name"].lower() for w in ["phú gia", "pghome", "pg home", "nghĩa guru"])]
        if client_names:
            group_name = f"Công trình / Thiết kế ({client_names[0]})"
            category = "PROJECT"
        else:
            group_name = f"Nhóm Nội Bộ PG Home ({', '.join(sender_names_list[:2])})"
            category = "PROJECT"
    elif has_pg_staff:
        group_name = f"Trao đổi PG Home ({sender_names_list[0]})"
        category = "PROJECT"
    else:
        if has_supplier_keyword:
            group_name = f"Nhóm NCC / Đối tác ({sender_names_list[0]})"
            category = "SUPPLIER"
        elif sender_names_list:
            group_name = f"Nhóm ({sender_names_list[0]})"
            category = "OTHER"
        else:
            group_name = f"Nhóm {gid}"
            category = "OTHER"
            
    group_data = {
        "group_id": gid,
        "group_name": group_name,
        "category": category,
        "total_media_files": file_count,
        "size_mb": round(size_bytes / (1024 * 1024), 2),
        "latest_mtime_iso": latest_iso,
        "top_senders": top_senders
    }
    
    all_groups.append(group_data)
    total_all_files += file_count
    total_all_bytes += size_bytes
    category_counts[category] = category_counts.get(category, 0) + 1

# Sort groups: primary by category order (WORKSHOP, SUPPLIER, PINNED_VIP, PROJECT, OTHER), then by size_mb descending
cat_order = {"WORKSHOP": 1, "SUPPLIER": 2, "PINNED_VIP": 3, "PROJECT": 4, "OTHER": 5}
all_groups.sort(key=lambda g: (cat_order.get(g["category"], 99), -g["size_mb"]))

full_index = {
    "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "total_groups_scanned": len(all_groups),
    "total_media_files": total_all_files,
    "total_size_mb": round(total_all_bytes / (1024 * 1024), 2),
    "category_summary": category_counts,
    "groups": all_groups
}

# Write output file
os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(full_index, f, ensure_ascii=False, indent=2)

print(f"DONE! Scanned {len(all_groups)} groups.")
print(f"Total media files: {total_all_files}")
print(f"Total size: {round(total_all_bytes / (1024 * 1024), 2)} MB")
print(f"Categories: {category_counts}")
print(f"Saved to: {OUTPUT_JSON_PATH}")
