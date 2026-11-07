# -*- coding: utf-8 -*-
import os
import sys
import json
import sqlite3
import datetime
import ctypes

# Set IDLE priority
try:
    ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x00000040)
except Exception as e:
    pass

sys.stdout.reconfigure(encoding='utf-8')

GD_UID = "2304805760907141944"
RESOURCE_DIR = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource"
DB_PATH = r"C:\Users\Admin\AppData\Roaming\ZaloData\Database\_production\Storage.db"
OUTPUT_JSON = r"f:\PG Home - Quản trị\data\zalo_157_private_chats_index.json"

ROLE_FAMILY_FINANCE = "FAMILY_FINANCE"
ROLE_CORE_STAFF = "CORE_STAFF"
ROLE_SUPPLIER = "SUPPLIER"
ROLE_CLIENT = "CLIENT"
ROLE_OTHER = "OTHER"

EXPLICIT_ROLES = {
    # FAMILY_FINANCE
    "1193413708528852811": ROLE_FAMILY_FINANCE, # Thu Hương (Hương) - Kế toán & Quản trị tài chính gia đình
    "3702919538197844135": ROLE_FAMILY_FINANCE, # Thu Hương (acc phụ)

    # CORE_STAFF (Đội ngũ PG Home)
    "7617747951538527859": ROLE_CORE_STAFF, # Hiệp Nội Thất Phu Gia Home Luxury - Sale Admin
    "2845688247116683961": ROLE_CORE_STAFF, # Hoang Cong Vu - Kỹ thuật / CNC xưởng
    "1266851172782015824": ROLE_CORE_STAFF, # Hoàng Thái - Quản lý xưởng
    "2589261669335747882": ROLE_CORE_STAFF, # Dũng Đường Pg - P. Kinh Doanh
    "7938789714221646568": ROLE_CORE_STAFF, # Hoà - Thợ cả nòng cốt
    "1682744722075667870": ROLE_CORE_STAFF, # Hoà - Thợ cả nòng cốt
    "9203999889522672767": ROLE_CORE_STAFF, # Phan Bình - Thợ/Kỹ thuật PG Home Thạch Hà
    "2377730134615187259": ROLE_CORE_STAFF, # Tuyết - Nhân sự/Kế toán PG Home
    "6528687351857791070": ROLE_CORE_STAFF, # Phan Luc - Xưởng PG Home
    "439205509909159644":  ROLE_CORE_STAFF, # Hung Ta Nv Một - Nhân viên kỹ thuật/xưởng

    # SUPPLIER (Vật tư, Phụ kiện, Máy móc, Đối tác thiết kế & gia công)
    "1004254886133359147": ROLE_SUPPLIER, # Trịnh Ngọc Cường (Ván An Cường / Ván gỗ)
    "1145001358742776871": ROLE_SUPPLIER, # Ván Plywood Mộc Dương
    "1176103296335069846": ROLE_SUPPLIER, # Lam Nhôm Phụ Kiện
    "1187496355475155646": ROLE_SUPPLIER, # Cánh Kính Việt Nhật
    "1333559112179094341": ROLE_SUPPLIER, # Sơn Gỗ Cao Cấp
    "1398047861297051042": ROLE_SUPPLIER, # Cung Cấp Ván Công Nghiệp
    "1601412709790691325": ROLE_SUPPLIER, # Phụ Kiện Bếp Thông Minh
    "1703994902754865761": ROLE_SUPPLIER, # Bàn Ghế An Phong
    "2056694284765206094": ROLE_SUPPLIER, # Đèn Led Everest
    "2106213146428549118": ROLE_SUPPLIER, # Xưởng Gỗ Tự Nhiên
    "2212339041934290295": ROLE_SUPPLIER, # Ray Trượt Giảm Chấn
    "2374092881413984822": ROLE_SUPPLIER, # Tổng Kho Nẹp Nhôm Inox
    "2384784777363438044": ROLE_SUPPLIER, # Mặt Đá Nung Kết Cao Cấp
    "2741424550742371791": ROLE_SUPPLIER, # Bản Lề Phụ Kiện Hafele
    "3162509402889963559": ROLE_SUPPLIER, # Phôi Gỗ Thái Lan
    "3195855075181393309": ROLE_SUPPLIER, # Xưởng Cắt CNC Gia Công
    "36677578128720454":   ROLE_SUPPLIER, # Nhà Máy Kính Hải Long
    "3697732967549821844": ROLE_SUPPLIER, # Mút Xốp Bọc Sofa
    "3959084819906414389": ROLE_SUPPLIER, # Gỗ Ghép Thanh Mộc Phát
    "405287335446420059":  ROLE_SUPPLIER, # Cung Cấp Da Bọc Nhập Khẩu
    "4105450660803232061": ROLE_SUPPLIER, # Keo Dán Ván Pur / Eva
    "4182682970228896207": ROLE_SUPPLIER, # Phụ Kiện Tủ Áo Thông Minh
    "4326822144703117263": ROLE_SUPPLIER, # Xưởng Cơ Khí Khung Sắt
    "4351726478449957024": ROLE_SUPPLIER, # Đá Thạch Anh Vicostone
    "4420396972703344028": ROLE_SUPPLIER, # Cánh Nhôm Kính Nội Thất
    "4437304538750888272": ROLE_SUPPLIER, # Máy Chế Biến Gỗ Thượng Hải
    "5158766783970005075": ROLE_SUPPLIER, # Kho Phụ Kiện Eurogold
    "5455267330231369329": ROLE_SUPPLIER, # Ốc Vít & Vật Tư Phụ
    "5456704776920756606": ROLE_SUPPLIER, # Xưởng Đúc Tay Nắm Tủ
    "572625011584136502":  ROLE_SUPPLIER, # Đèn Hắt Cảm Ứng Rạng Đông
    "5735641549887952477": ROLE_SUPPLIER, # Xưởng Sản Xuất Khung Sofa
    "5741420367230853737": ROLE_SUPPLIER, # Chỉ Nẹp Nhựa PVC An Cường
    "5999367947922805126": ROLE_SUPPLIER, # Sơn Pu Oseven
    "6179957903390709255": ROLE_SUPPLIER, # Tấm Nhựa Đặc WPB Chống Nước
    "6221472504989778323": ROLE_SUPPLIER, # Cung Cấp Ray Hộp Blum
    "6241286457645517657": ROLE_SUPPLIER, # Xưởng Sơn Tĩnh Điện
    "6393285904969556349": ROLE_SUPPLIER, # Vải Nỉ Sofa Hàn Quốc
    "6561754646359886804": ROLE_SUPPLIER, # Cắt Mặt Bàn Kính Cường Lực
    "6653948568068590483": ROLE_SUPPLIER, # Băng Dính & Màng Bọc Pe
    "6744300141567133020": ROLE_SUPPLIER, # Bánh Xe Cửa Lùa Tủ Áo
    "6936710920506352768": ROLE_SUPPLIER, # Máy Nén Khí Trục Vít
    "7182883423319018858": ROLE_SUPPLIER, # Thiết Bị Bếp Bosch
    "7354587545482294996": ROLE_SUPPLIER, # Ván Nhựa Picomat
    "7529509781394069178": ROLE_SUPPLIER, # Khóa Cửa Điện Tử Kaadas
    "7562876565549587504": ROLE_SUPPLIER, # Giường Bọc Nỉ Tân Cổ Điển
    "7782547250453147077": ROLE_SUPPLIER, # Đèn Chùm Trang Trí Pha Lê
    "7942437414686873597": ROLE_SUPPLIER, # Ray Trượt Cửa Xếp Trượt
    "8254876676561239371": ROLE_SUPPLIER, # Cung Cấp Ván Mdf Chống Ẩm
    "8289200218557250253": ROLE_SUPPLIER, # Xưởng Đóng Bàn Ăn Gỗ Sồi
    "8459095933671346592": ROLE_SUPPLIER, # Cánh Tủ Acrylic Noline
    "8751655256922033584": ROLE_SUPPLIER, # Xưởng Gia Công Inox Mạ Pvd
    "9021458578885169142": ROLE_SUPPLIER, # Bản Lề Giảm Chấn Dtc
    "5806297548932826192": ROLE_SUPPLIER, # Huy Hieu Thiết kế nhà (Đối tác thiết kế)
    "6352632391013954029": ROLE_SUPPLIER, # Trung Kts Thầy Thành (Kiến trúc sư đối tác)

    # CLIENT (Khách hàng công trình, nhà ở, thẩm mỹ viện)
    "1808004166014308051": ROLE_CLIENT, # Chị Nhung Đức Huế
    "4061248254619542680": ROLE_CLIENT, # Chị Loan Mới
    "4136822812938523052": ROLE_CLIENT, # Phúc Hiền (Bố Già)
    "4400277200941002196": ROLE_CLIENT, # Hùng GĐ
    "6512929946259011750": ROLE_CLIENT, # Cẩm Tú Thẩm Mỹ Viện
    "7452230181593451695": ROLE_CLIENT, # Ts xd. A Thành Kỳ Anh
    "8388008796580060332": ROLE_CLIENT, # Chủ Tịch Dinh
    "8578287649316797384": ROLE_CLIENT, # Dũng Hùng
    "3467604761736097755": ROLE_CLIENT, # Vũ Đình Văn
    "5234194523184491367": ROLE_CLIENT, # Đức Thuận
    "8467794105969931847": ROLE_CLIENT, # Bá Hiếu
    "2408001058752089006": ROLE_CLIENT, # Thuỳ Dương
    "5947718743935998030": ROLE_CLIENT, # Quỳnh Như
    "6628758369099949370": ROLE_CLIENT, # Toàn Thúy (Bình Yên)
    "3794139124494799715": ROLE_CLIENT, # Quang Tru (Nguyễn Thành Quang)
    "3799628397263949438": ROLE_CLIENT, # Hà Huy Trọng
    "4064900486680727981": ROLE_CLIENT, # Nguyễn Hùng
    "4342003087756426629": ROLE_CLIENT, # Vũ Thị Phượng
    "4592385786637223039": ROLE_CLIENT, # Văn Sơn
    "4677275552692545837": ROLE_CLIENT, # Phùng Bình Anh Bình Hà Nội
    "4741049346183629327": ROLE_CLIENT, # Đào Duy
    "49216051873820266":   ROLE_CLIENT, # Văn Lợi
    "5093323482594011499": ROLE_CLIENT, # Anh Kiệt
    "5658798286385825356": ROLE_CLIENT, # Tung Trần
    "5818941347620491525": ROLE_CLIENT, # Hoài Anh
    "7002585693814968298": ROLE_CLIENT, # A Dung Beo
    "7146150412329013224": ROLE_CLIENT, # Kim Tuyến
    "7204534990102108223": ROLE_CLIENT, # Nguyễn Công Đông
    "7513183369256283264": ROLE_CLIENT, # Minh An
    "8485527358172083974": ROLE_CLIENT, # Hoàng Sale Ecopark L
    "8740710494034048137": ROLE_CLIENT, # Nga Nguyễn
    "8809642193493276806": ROLE_CLIENT, # Đức Hải
    "1235768635080423394": ROLE_CLIENT, # Kim Hương
    "1302034878216963029": ROLE_CLIENT, # Ngọc Huỳnh
    "1772676201698132317": ROLE_CLIENT, # Vu Thi Hai Yen
    "1924125654985058679": ROLE_CLIENT, # Đinh Thu Thảo
    "240339647978395281":  ROLE_CLIENT, # Nguyễn Bá An
    "2499070540530617450": ROLE_CLIENT, # Minh Tiến
    "2569429000619985772": ROLE_CLIENT, # Vũ Mạnh Tiến
    "2596171605231707075": ROLE_CLIENT, # Ngọc Diệp
    "2596871012573425101": ROLE_CLIENT, # Lê Thi Lan
    "3186565724448986364": ROLE_CLIENT, # Tuyết Mai
    "326862842685394253":  ROLE_CLIENT, # Trần Hải
    "3318845018620797130": ROLE_CLIENT, # Lê Tuấn
    "3933874567746986323": ROLE_CLIENT, # Trần Hạnh
    "6943209145210157983": ROLE_CLIENT, # Ha Binh An
}

def main():
    print("=== KHOI DONG TRINH TONG KIEM TOAN 157 HOI THOAI CA NHAN ZALO ===")
    
    # 1. Connect database read-only
    conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True, timeout=5.0)
    cur = conn.cursor()
    cur.execute("SELECT key, val FROM 'info-cache' WHERE key LIKE '0_%'")
    user_cache = {}
    for k, v in cur.fetchall():
        try:
            user_cache[k[2:]] = json.loads(v)
        except:
            pass
    conn.close()
    print(f"Loaded {len(user_cache)} contact profiles from Storage.db [info-cache]")

    # 2. Get 157 numeric directories
    numeric_dirs = sorted([d for d in os.listdir(RESOURCE_DIR) if d.isdigit() and os.path.isdir(os.path.join(RESOURCE_DIR, d))])
    print(f"Discovered {len(numeric_dirs)} numeric UID folders in resource directory")

    records = []
    summary_stats = {
        "total_private_chats": len(numeric_dirs),
        "total_files": 0,
        "files_sent_by_gd": 0,
        "files_sent_by_counterparts": 0,
        "files_sent_by_others": 0,
        "total_bytes": 0,
        "total_mb": 0.0,
        "roles_breakdown": {
            ROLE_FAMILY_FINANCE: 0,
            ROLE_CORE_STAFF: 0,
            ROLE_SUPPLIER: 0,
            ROLE_CLIENT: 0,
            ROLE_OTHER: 0
        }
    }

    for idx, uid in enumerate(numeric_dirs, 1):
        dir_path = os.path.join(RESOURCE_DIR, uid)
        cached_info = user_cache.get(uid, {})
        zName = cached_info.get("zName", "")
        aliasName = cached_info.get("aliasName", "")
        avatar = cached_info.get("avatar", "")
        
        role = EXPLICIT_ROLES.get(uid, ROLE_OTHER)
        summary_stats["roles_breakdown"][role] += 1

        files_sent_gd = 0
        files_sent_cp = 0
        files_sent_ot = 0
        total_files = 0
        total_sz = 0
        latest_ms = 0
        subfolder_counts = {}

        for root, dirs, files in os.walk(dir_path):
            rel_dir = os.path.relpath(root, dir_path)
            sub_name = rel_dir.split(os.sep)[0] if rel_dir != "." else "root"
            
            for f in files:
                if f.startswith('.'):
                    continue
                total_files += 1
                fp = os.path.join(root, f)
                
                # File size
                try:
                    sz = os.path.getsize(fp)
                    total_sz += sz
                except:
                    sz = 0

                # Subfolder count
                subfolder_counts[sub_name] = subfolder_counts.get(sub_name, 0) + 1

                # Timestamp extraction
                file_ms = 0
                parts = f.split('_')
                if len(parts) >= 3 and parts[0].isdigit() and len(parts[0]) >= 12:
                    try:
                        file_ms = int(parts[0])
                    except:
                        pass
                
                if file_ms == 0:
                    try:
                        mtime = os.path.getmtime(fp)
                        file_ms = int(mtime * 1000)
                    except:
                        pass

                if file_ms > latest_ms:
                    latest_ms = file_ms

                # Sender extraction
                # Format: {epoch_ms}_{sender_uid}_{conv_uid}...
                if len(parts) >= 3:
                    sender = parts[1]
                    if sender == GD_UID:
                        files_sent_gd += 1
                    elif sender == uid:
                        files_sent_cp += 1
                    else:
                        files_sent_ot += 1
                else:
                    files_sent_cp += 1

        latest_iso = None
        if latest_ms > 0:
            try:
                # Timestamps around 2026 are valid
                dt = datetime.datetime.fromtimestamp(latest_ms / 1000.0)
                latest_iso = dt.strftime("%Y-%m-%d %H:%M:%S")
            except:
                pass

        total_mb = round(total_sz / (1024 * 1024), 2)

        summary_stats["total_files"] += total_files
        summary_stats["files_sent_by_gd"] += files_sent_gd
        summary_stats["files_sent_by_counterparts"] += files_sent_cp
        summary_stats["files_sent_by_others"] += files_sent_ot
        summary_stats["total_bytes"] += total_sz

        record = {
            "uid": uid,
            "zName": zName,
            "aliasName": aliasName,
            "displayName": aliasName if aliasName else zName,
            "role": role,
            "avatar": avatar,
            "total_files": total_files,
            "files_sent_by_gd": files_sent_gd,
            "files_sent_by_counterpart": files_sent_cp,
            "files_sent_by_other": files_sent_ot,
            "total_bytes": total_sz,
            "total_mb": total_mb,
            "latest_timestamp_ms": latest_ms if latest_ms > 0 else None,
            "latest_interaction": latest_iso,
            "subfolders": subfolder_counts
        }
        records.append(record)

    summary_stats["total_mb"] = round(summary_stats["total_bytes"] / (1024 * 1024), 2)

    # Sort records: primarily by total_files desc, then latest_timestamp_ms desc
    records.sort(key=lambda x: (x["total_files"], x["latest_timestamp_ms"] or 0), reverse=True)

    output_data = {
        "metadata": {
            "title": "BẢN KIỂM TOÁN VÀ ĐỊNH DANH 157 HỘI THOẠI CÁ NHÂN ZALO PG HOME",
            "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "source_resource_dir": RESOURCE_DIR,
            "source_database": DB_PATH,
            "auditor": "Công nhân Flash #02 (Kỹ sư tổng kiểm toán)",
            "priority": "IDLE_PRIORITY_CLASS (0x00000040)"
        },
        "summary": summary_stats,
        "chats": records
    }

    # Ensure parent directory exists
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print("\n=== KET QUA KIEM TOAN HOAN TAT ===")
    print(f"File xuat: {OUTPUT_JSON}")
    print(f"Tong so hoi thoai ca nhan: {summary_stats['total_private_chats']}")
    print(f"Tong so file da kiem ke: {summary_stats['total_files']:,} files ({summary_stats['total_mb']:,} MB)")
    print(f"  - Giám Đốc gửi đi: {summary_stats['files_sent_by_gd']:,} files")
    print(f"  - Đối tác/khách hàng gửi đến: {summary_stats['files_sent_by_counterparts']:,} files")
    print(f"Phan bo vai tro:")
    for r, c in summary_stats["roles_breakdown"].items():
        print(f"  - {r:16}: {c:3d} tai khoan")

if __name__ == "__main__":
    main()



