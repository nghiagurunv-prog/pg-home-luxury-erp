# -*- coding: utf-8 -*-
"""
Công cụ phân loại và lập chỉ mục toàn diện 185 file PDF bản vẽ kỹ thuật & báo giá NCC
Nhiệm vụ Flash Worker #05 - PG Home Luxury
"""

import json
try:
    import pg_fast_io as _pg_fast_io
    json = _pg_fast_io.json
except Exception:
    pass
import os
import re
from datetime import datetime

FILENOISE_INDEX_PATH = r"f:\PG Home - Quản trị\data\zalo_filenoise_index.json"
SQLITE_CONTACTS_PATH = r"f:\PG Home - Quản trị\data\zalo_sqlite_contacts_and_files.json"
OUTPUT_AUDIT_PATH = r"f:\PG Home - Quản trị\data\zalo_pdf_drawings_audit.json"

# Bảng tra cứu thực thể chuẩn PG Home
KNOWN_ENTITIES = {
    # 1. Các nhóm công trình Zalo
    "g8149011240458184403": {"name": "Nhóm Công Trình Nhà Bác Phát", "project": "Công trình Nhà Bác Phát", "type": "project"},
    "g104123483123937461": {"name": "Nhóm Chị Hằng - Anh Nam", "project": "Công trình Chị Hằng - Anh Nam", "type": "project"},
    "g6607820046510319735": {"name": "Nhóm Công Trình Bác Hùng", "project": "Công trình Nhà Bác Hùng", "type": "project"},
    "g7736623945291314586": {"name": "Nhóm Công Trình Anh Thắng Hà Tĩnh", "project": "Công trình Anh Thắng Hà Tĩnh", "type": "project"},
    "g9123190609595982424": {"name": "Nhóm Công Trình Quán Coffe PG Home", "project": "Công trình Quán Coffe PG Home", "type": "project"},
    "g4202087807268285076": {"name": "Nhóm Công Trình Anh Hào Kỳ Phương", "project": "Công trình Anh Hào Kỳ Phương", "type": "project"},
    "g3205373573265479615": {"name": "Nhóm Công Trình Phan Hùng Mạnh", "project": "Công trình Phan Hùng Mạnh", "type": "project"},
    "g2478045048939659687": {"name": "Nhóm Công Trình Kệ Tivi Chung Cư", "project": "Công trình Nội Thất Căn Hộ", "type": "project"},
    "g2891523687748176100": {"name": "Nhóm Công Trình Hộp Ôm Tivi", "project": "Công trình Nội Thất Căn Hộ", "type": "project"},
    "g397283759077492295": {"name": "Nhóm Báo Giá Nội Thất Hộp Tivi", "project": "Công trình Nội Thất Dân Dụng", "type": "project"},
    "g3992403089483419811": {"name": "Nhóm Báo Giá Kệ Tivi Thiết Kế", "project": "Công trình Nội Thất Dân Dụng", "type": "project"},
    "g4104006736582396976": {"name": "Nhóm Dự Toán Ốp Nan Plywood", "project": "Công trình Nội Thất Plywood", "type": "project"},
    "g5074905813115513769": {"name": "Nhóm Dự Toán Vách Nan Plywood", "project": "Công trình Nội Thất Plywood", "type": "project"},
    "g5938904221495376303": {"name": "Nhóm Báo Giá Vách Ngăn MDF", "project": "Công trình Nội Thất Vách Ngăn", "type": "project"},
    "g7611226494849501540": {"name": "Nhóm Dự Toán Tủ Áo MDF", "project": "Công trình Nội Thất Tủ Áo", "type": "project"},
    "g7626286516050837266": {"name": "Nhóm Kỹ Thuật Nội Thất PG", "project": "Công trình Kỹ Thuật PG", "type": "project"},
    "g8752341776764473266": {"name": "Nhóm Dự Toán Khung Tủ MDF Cốt Xanh", "project": "Công trình Nội Thất Tủ Gỗ", "type": "project"},

    # 2. Các nhóm nội bộ PG Home
    "g3755853110317591515": {"name": "Nhóm Nội Bộ PG Home (Thưởng Lễ 2/9, Hào Kỳ Phương)", "project": "Nội bộ PG Home Luxury", "type": "internal"},
    "g2210130381397538159": {"name": "Nhóm Nhật Trình Thu Chi Xưởng Sản Xuất", "project": "Xưởng Sản Xuất PG Home", "type": "internal"},
    "g1792366938218612507": {"name": "Nhóm Bảng Chấm Công Thợ PG Home", "project": "Chấm Công Xưởng PG Home", "type": "internal"},

    # 3. Các nhóm / đối tác Nhà Cung Cấp (NCC)
    "g6116598459303638566": {"name": "Nhóm Ms Hoa Lamgiang - Tấm Ốp Lam Giang", "project": "NCC Gỗ Nhựa Than Tre Lam Giang", "type": "vendor"},
    "g495486322416346660": {"name": "Nhóm Tâm Quốc - Phụ Kiện Roxana Quốc Tâm", "project": "NCC Phụ Kiện Roxana Quốc Tâm", "type": "vendor"},
    "g6882545434220944455": {"name": "Nhóm Thoan Vsg - Kính VSG Việt Nhật", "project": "NCC Kính VSG Việt Nhật", "type": "vendor"},
    "1333559112179094341": {"name": "Ái Linh An Cường (AL Sale Minh)", "project": "NCC Gỗ An Cường (Ái Linh)", "type": "vendor"},
    "1398047861297051042": {"name": "Đức Thành Tín (Tấm ốp than tre đá mềm)", "project": "NCC Tấm Ốp Than Tre Thành Tín", "type": "vendor"},
    "4182682970228896207": {"name": "Quế Pl Lighting", "project": "NCC Đèn LED PL Lighting", "type": "vendor"},
    "6179957903390709255": {"name": "Hai Xuan Điện Nước (Đông Hải Hà Tĩnh)", "project": "Nhà Thầu Điện Nước Đông Hải", "type": "vendor"},
    "7947230930659550350": {"name": "Uyên Fastdo (Phần mềm Quản trị Fastdo AI)", "project": "Phần mềm Quản trị Fastdo", "type": "vendor"},

    # 4. Nhân sự PG Home & Khách hàng cá nhân
    "1193413708528852811": {"name": "Hương (Kế toán / Văn phòng PG Home)", "project": "Nội bộ PG Home", "type": "internal"},
    "2845688247116683961": {"name": "Vũ (Phụ trách Kỹ thuật & Vật tư Xưởng)", "project": "Xưởng Sản Xuất PG Home", "type": "internal"},
    "7617747951538527859": {"name": "Phú Gia Hiệp G (Sale / Dự toán PG Home)", "project": "Văn Phòng Sale PG Home", "type": "internal"},
    "2589261669335747882": {"name": "Dũng PG Home (Sale / Dự toán PG Home)", "project": "Văn Phòng Sale PG Home", "type": "internal"},

    # 5. Cơ quan quản lý nhà nước
    "g5791781168560517284": {"name": "Bảo Hiểm Xã Hội Tỉnh Hà Tĩnh", "project": "BHXH Tỉnh Hà Tĩnh", "type": "admin"},
    "g1954826388122811364": {"name": "Phòng Quản Lý XNC (Mẫu TK8 Thông Hành)", "project": "Thủ tục Hành chính Quản lý XNC", "type": "admin"},
    "g795402381131416269": {"name": "Lịch Trình Công Tác & Giấy Mời Cơ Quan Nhà Nước", "project": "Văn phòng Cơ quan Nhà Nước", "type": "admin"},

    # 6. Giáo dục & Hoạt động gia đình / ngoại vi
    "g1023694868405271280": {"name": "Trường Tiểu Học Anber Hà Tĩnh", "project": "Trường Tiểu học Anber", "type": "education"},
    "g3520788964083100696": {"name": "Lớp Học Tiếng Anh Cô Hồ Kiều Trinh", "project": "Lớp Tiếng Anh Hồ Kiều Trinh", "type": "education"},
    "g6547443287129294617": {"name": "Ban Phụ Huynh Học Sinh (Trần Thảo Envy)", "project": "Ban Phụ Huynh Học Sinh", "type": "education"},
}


def load_references():
    with open(SQLITE_CONTACTS_PATH, "r", encoding="utf-8") as f:
        sqlite_data = json.load(f)

    uid_map = sqlite_data.get("uid_to_name_map", {})
    key_contacts = sqlite_data.get("key_contacts", {})
    recent_convs = sqlite_data.get("session_and_security", {}).get("recent_conversations_with_names", [])

    name_map = {}
    # Nạp từ uid_to_name_map
    if isinstance(uid_map, dict):
        for uid, val in uid_map.items():
            if isinstance(val, dict):
                name = val.get("displayName") or val.get("aliasName") or val.get("zName") or ""
                if name:
                    name_map[str(uid)] = name
            elif isinstance(val, str) and val:
                name_map[str(uid)] = val

    # Nạp từ key_contacts
    if isinstance(key_contacts, dict):
        for uid, info in key_contacts.items():
            if isinstance(info, dict):
                name = info.get("displayName") or info.get("aliasName") or info.get("name") or ""
                if name:
                    name_map[str(uid)] = name
            elif isinstance(info, str) and info:
                name_map[str(uid)] = info
    elif isinstance(key_contacts, list):
        for item in key_contacts:
            if isinstance(item, dict):
                uid = item.get("uid") or item.get("id") or item.get("userId")
                name = item.get("name") or item.get("displayName") or item.get("zaloName")
                if uid and name:
                    name_map[str(uid)] = name

    # Nạp từ recent_conversations_with_names
    conv_map = {}
    for block in recent_convs:
        if isinstance(block, dict) and "conversations" in block:
            for c in block["conversations"]:
                cid = c.get("conv_id")
                cname = c.get("name")
                if cid and cname and cname != "Chưa rõ danh tính":
                    conv_map[str(cid)] = cname

    return name_map, conv_map


def resolve_parties(item, name_map, conv_map):
    file_id = item.get("file_id", "")
    source_dir = item.get("source_dir", "")
    
    sender_uid = "UNKNOWN"
    sender_name = "Không xác định"
    target_id = "ROOT_FILE_NOISE"
    target_name = "Root FileNoise (Kho đệm tải về)"

    # Phân tích resource folder nếu có
    if "resource" in source_dir:
        res_folder = os.path.basename(os.path.dirname(source_dir))
        target_id = res_folder

    # Phân tích qua cú pháp file_id: <timestamp>_<sender>_<target>
    parts = file_id.split("_")
    if len(parts) >= 3 and parts[0].isdigit():
        sender_uid = parts[1]
        target_id = parts[2]
    elif len(parts) == 1 and target_id == "ROOT_FILE_NOISE":
        sender_uid = "ROOT_CACHE"

    # Ánh xạ tên người gửi
    if sender_uid in KNOWN_ENTITIES:
        sender_name = KNOWN_ENTITIES[sender_uid]["name"]
    elif sender_uid in name_map:
        sender_name = name_map[sender_uid]
    elif sender_uid == "ROOT_CACHE":
        sender_name = "Zalo Client Cache"

    # Ánh xạ tên nhóm / đối tác nhận
    if target_id in KNOWN_ENTITIES:
        target_name = KNOWN_ENTITIES[target_id]["name"]
    elif target_id in conv_map:
        target_name = conv_map[target_id]
    elif target_id in name_map:
        target_name = name_map[target_id]

    return sender_uid, sender_name, target_id, target_name


def classify_single_pdf(item, sender_uid, sender_name, target_id, target_name):
    meta = item.get("metadata", {})
    title = (meta.get("title") or "").strip()
    creator = (meta.get("creator") or "").strip()
    producer = (meta.get("producer") or "").strip()
    pages = meta.get("pages") or 0
    preview = (meta.get("text_preview") or "").strip()
    
    file_id = item.get("file_id", "")
    source_path = item.get("source_path", "")

    blob = f"{title.upper()} {preview.upper()} {creator.upper()} {producer.upper()} {target_name.upper()} {sender_name.upper()} {target_id.upper()}"

    category = "CHUA_PHAN_LOAI"
    category_label = "Chưa phân loại"
    subcategory = "Khác"
    project_or_partner = "Khác"

    # 1. BẢN VẼ KỸ THUẬT & KIẾN TRÚC CÔNG TRÌNH
    # Điều kiện: Xuất từ AutoCAD, pdfFactory, PDF24, có chữ Model, Layout, BVTC, KT MB, P1233...
    is_drawing = False
    if any(k in blob for k in [
        "AUTOCAD", "MODEL (1)", "MODEL", "LAYOUT1", "BVTC-KT", "KT MB", "PDFACTORY",
        "P1233 NHA BAC HU", "KC NHA B HUNG", "2 KT CHI HANG", "PHAN HUNG MANH 23.05.2026",
        "COFFE MODEL", "MR THACH MODEL"
    ]):
        is_drawing = True
    elif "PDF24" in producer.upper() and ("BVTC" in blob or "MODEL" in blob or "THANG" in blob):
        is_drawing = True
    elif any(k in title.upper() for k in ["MODEL", "LAYOUT", "KT NHA", "KC NHA", "BVTC-KT", "KT MB"]):
        is_drawing = True

    # 2. BẢNG GIÁ & CATALOG NHÀ CUNG CẤP (NCC)
    is_vendor = False
    if any(k in blob for k in [
        "THÀNH TÍN", "THANH TIN", "ÁI LINH", "AI LINH", "AN CƯỜNG", "AN CUONG",
        "LAM GIANG", "LAMGIANG", "ROXANA", "QUỐC TÂM", "QUOC TAM", "LAMINATE KINGDOM",
        "PL LIGHTING", "KÍNH VSG", "KINH VSG", "VIỆT NHẬT", "FASTDO", "ĐÔNG HẢI",
        "POB - UD00", "MELAMINE-00", "UD00_VER01", "CATALOG TẤM ỐP", "BẢNG BÁO GIÁ SP THÀNH TÍN",
        "THAN TRE 5MM", "CTY PHÚ GIA HOME LUXURY"
    ]) or sender_uid in ["1333559112179094341", "1398047861297051042", "4182682970228896207", "6179957903390709255", "7947230930659550350"] \
       or target_id in ["g6116598459303638566", "g495486322416346660", "g6882545434220944455"]:
        # Tránh nhầm với bản vẽ
        if not is_drawing:
            is_vendor = True

    # 3. CHỨNG TỪ, HÓA ĐƠN & QUẢN TRỊ NỘI BỘ
    is_internal_admin = False
    if any(k in blob for k in [
        "BẢO HIỂM XÃ HỘI", "BHXH", "TÊN NHÂN VIÊN 1 2 3", "THỜI GIAN LÀM VIỆC", "TIỀN ĂN THỢ",
        "3 MÁY ĐO", "TIỀN DƯ", "THƯỞNG 2/9", "TIỀN LỄ 2/9", "TỐNG TRẦN HIỆP", "38A 094.63",
        "GARA", "MẪU TK8", "QUẢN LÝ XNC", "PHÓ THỦ TƯỚNG", "LỘ TRÌNH CÔNG TÁC", "GIAY-MOI",
        "THỦ TỤC HÀNH CHÍNH"
    ]) or target_id in ["g1792366938218612507", "g1954826388122811364", "g2210130381397538159", "g5791781168560517284", "g795402381131416269"]:
        # Tránh nhầm nếu là báo giá công trình
        if not is_drawing and not is_vendor:
            is_internal_admin = True

    # 4. HỒ SƠ ỨNG VIÊN, GIÁO DỤC & NGOẠI VI
    is_external_edu = False
    if any(k in blob for k in [
        "CURRICULUM VITAE", "CV", "ỨNG TUYỂN", "TRƯỜNG TIỂU HỌC ANBER", "ANBER",
        "PHÂN LUỒNG", "TIÊU CHÍ XẾP LỚP", "ĐĂNG KÝ HỌC", "PREPARE A2", "EXAM BOOSTER",
        "PHONETICS", "CAMBRIDGE UNIVERSITY PRESS", "LỚP 6", "LŨY THỪA", "LỦY THỪA",
        "TRẦN THẢO ENVY", "HỒ KIỀU TRINH", "Ý KIẾN PHỤ HUYNH"
    ]) or target_id in ["g1023694868405271280", "g3520788964083100696", "g6547443287129294617"]:
        if not is_drawing and not is_vendor and not is_internal_admin:
            is_external_edu = True

    # 5. DỰ TOÁN & BÁO GIÁ CÔNG TRÌNH NỘI THẤT
    # (Tủ bếp, tủ áo, vách lam, vách tivi, giường, MDF Thái Lan, Plywood...)
    is_project_quote = False
    if not is_drawing and not is_vendor and not is_internal_admin and not is_external_edu:
        if any(k in blob for k in [
            "DÀI SÂU CAO", "ĐƠN GIÁ THÀNH TIỀN", "BÁO GIÁ", "DỰ TOÁN", "VÁN MDF", "PLYWOOD",
            "ỐP PHẲNG", "ỐP NAN", "VÁCH NGĂN", "KỆ TIVI", "TỦ ÁO", "TỦ RƯỢU", "TỦ BẾP",
            "ANH HÀO", "KỲ PHƯƠNG", "CHI HANG", "BÁC PHÁT", "BAC PHAT", "ANH TUẤN", "LÊ KHÁNH",
            "A QUẾ", "HIÊN ĐÀI", "MR.THANG", "PHAN HUNG MANH"
        ]) or any(target_id == k for k in [
            "g8149011240458184403", "g104123483123937461", "g4202087807268285076",
            "g2478045048939659687", "g2891523687748176100", "g397283759077492295",
            "g3992403089483419811", "g4104006736582396976", "g5074905813115513769",
            "g5938904221495376303", "g7611226494849501540", "g8752341776764473266"
        ]) or sender_uid in ["7617747951538527859", "2589261669335747882"]:
            is_project_quote = True

    # ==================== GÁN NHÃN CHI TIẾT TỪNG NHÓM ====================
    if is_drawing:
        category = "BAN_VE_KY_THUAT_CONG_TRINH"
        category_label = "Bản vẽ kỹ thuật & Kiến trúc công trình"
        if "B HUNG" in blob or target_id == "g6607820046510319735":
            project_or_partner = "Công trình Nhà Bác Hùng"
            subcategory = f"Bản vẽ kiến trúc/kết cấu AutoCAD ({pages} trang)"
        elif "CHI HANG" in blob or target_id == "g104123483123937461":
            project_or_partner = "Công trình Chị Hằng - Anh Nam"
            subcategory = "Bản vẽ kỹ thuật nội thất 2D/3D (Model)"
        elif "BAC PHAT" in blob or target_id == "g8149011240458184403":
            project_or_partner = "Công trình Nhà Bác Phát"
            subcategory = "Bản vẽ thi công nội thất (Hiệp G)"
        elif "THANG" in blob or target_id == "g7736623945291314586" or "MR.THANG" in blob:
            project_or_partner = "Công trình Anh Thắng Hà Tĩnh"
            subcategory = f"Bản vẽ thi công AutoCAD PDF24 ({pages} trang)"
        elif "COFFE" in blob or target_id == "g9123190609595982424":
            project_or_partner = "Công trình Quán Coffe PG Home"
            subcategory = "Bản vẽ kỹ thuật kiến trúc quán Coffe"
        elif "PHAN HUNG MANH" in blob or target_id == "g3205373573265479615":
            project_or_partner = "Công trình Phan Hùng Mạnh"
            subcategory = "Bản vẽ kỹ thuật AutoCAD"
        elif "MR THACH" in blob:
            project_or_partner = "Công trình Mr. Thạch"
            subcategory = "Bản vẽ kỹ thuật nội thất"
        elif "KT MB" in blob or "MẶT BẰNG" in blob:
            project_or_partner = "Công trình Tổng Thể PG Home"
            subcategory = f"Bản vẽ mặt bằng kiến trúc pdfFactory ({pages} trang)"
        else:
            project_or_partner = "Công trình Nội Thất Dự Án"
            subcategory = "Bản vẽ thiết kế kỹ thuật AutoCAD / Layout"

    elif is_project_quote:
        category = "DU_TOAN_BAO_GIA_CONG_TRINH"
        category_label = "Dự toán & Báo giá công trình nội thất"
        if "BAC PHAT" in blob or target_id == "g8149011240458184403":
            project_or_partner = "Công trình Nhà Bác Phát"
            subcategory = "Báo giá chi tiết vách nan, tủ bếp MDF Thái Lan (Hiệp G)"
        elif "CHI HANG" in blob or "ANH NAM" in blob or target_id == "g104123483123937461":
            project_or_partner = "Công trình Chị Hằng - Anh Nam"
            subcategory = "Báo giá tủ rượu, vách lam, vách ngăn (Dũng PG Home)"
        elif "ANH HAO" in blob or "KY PHUONG" in blob or target_id in ["g4202087807268285076", "g3755853110317591515"]:
            project_or_partner = "Công trình Anh Hào Kỳ Phương"
            subcategory = "Báo giá khối lượng nội thất vách ngăn phòng khách"
        elif "TUAN" in blob or "MAI THUC LOAN" in blob or target_id == "2589261669335747882":
            project_or_partner = "Công trình Anh Tuấn Mai Thúc Loan"
            subcategory = "Báo giá Plywood ốp tivi, nội thất cao cấp"
        elif "LE KHANH" in blob or "LOC HA" in blob:
            project_or_partner = "Công trình Mr. Lê Khánh Lộc Hà"
            subcategory = "Báo giá vách ốp phẳng & nội thất Plywood"
        elif "A QUE" in blob or "HO DEN" in blob:
            project_or_partner = "Công trình Nhà Anh Quế Hồ Đền"
            subcategory = "Dự toán khối lượng nội thất hoàn thiện"
        elif "HIEN DAI" in blob or "EM HIEN" in blob:
            project_or_partner = "Công trình Em Hiên Đài"
            subcategory = "Báo giá nội thất gỗ MDF chống ẩm"
        elif "THANG" in blob or target_id == "g7736623945291314586":
            project_or_partner = "Công trình Anh Thắng Hà Tĩnh"
            subcategory = "Báo giá vách nan & nội thất gỗ"
        elif target_id == "g2478045048939659687":
            project_or_partner = "Công trình Kệ Tivi Căn Hộ"
            subcategory = "Báo giá kệ tivi MDF Thái Lan cốt xanh"
        elif target_id == "g2891523687748176100":
            project_or_partner = "Công trình Hộp Tivi Căn Hộ"
            subcategory = "Báo giá hộp ôm tivi MDF cốt xanh chống ẩm"
        elif target_id in ["g4104006736582396976", "g5074905813115513769"]:
            project_or_partner = "Công trình Vách Nan Plywood"
            subcategory = "Báo giá phần ốp phẳng và vách nan Plywood"
        elif target_id == "g5938904221495376303":
            project_or_partner = "Công trình Vách Ngăn MDF"
            subcategory = "Báo giá vách ngăn phòng khách gỗ MDF"
        elif target_id == "g7611226494849501540":
            project_or_partner = "Công trình Tủ Áo MDF"
            subcategory = "Báo giá tủ quần áo ván MDF phủ melamine"
        elif target_id == "g8752341776764473266":
            project_or_partner = "Công trình Khung Tủ MDF Cốt Xanh"
            subcategory = "Báo giá khung tủ ván MDF dày chống ẩm"
        elif sender_uid == "7617747951538527859":
            project_or_partner = "Dự án Báo Giá Hiệp G"
            subcategory = "Báo giá chi tiết hạng mục nội thất gỗ"
        elif sender_uid == "2589261669335747882":
            project_or_partner = "Dự án Báo Giá Dũng PG Home"
            subcategory = "Báo giá kết hợp tủ rượu, vách lam Plywood/MDF"
        else:
            project_or_partner = "Dự toán Công trình PG Home"
            subcategory = "Bảng khối lượng dự toán thi công"

    elif is_vendor:
        category = "BANG_GIA_CATALOG_NHA_CUNG_CAP"
        category_label = "Bảng giá & Catalog Nhà cung cấp (NCC)"
        if "THANH TIN" in blob or target_id == "1398047861297051042":
            project_or_partner = "NCC Tấm Ốp Than Tre Thành Tín"
            subcategory = f"Bảng báo giá & Catalog tấm ốp than tre đá mềm ({pages} trang)"
        elif "AI LINH" in blob or "AN CUONG" in blob or target_id == "1333559112179094341":
            if "LAMINATE KINGDOM" in blob:
                project_or_partner = "NCC Ván Phủ Laminate Kingdom"
                subcategory = "Bảng giá ván ép phủ Laminate Kingdom 2026"
            else:
                project_or_partner = "NCC Gỗ An Cường (Ái Linh)"
                subcategory = "Bảng mã màu ván POB/Melamine An Cường"
        elif "LAM GIANG" in blob or "LAMGIANG" in blob or target_id == "g6116598459303638566":
            project_or_partner = "NCC Gỗ Nhựa Than Tre Lam Giang"
            subcategory = "Báo giá kho tấm ốp than tre 5mm & 8mm Lam Giang"
        elif "ROXANA" in blob or "QUOC TAM" in blob or target_id == "g495486322416346660":
            project_or_partner = "NCC Phụ Kiện Roxana Quốc Tâm"
            subcategory = "Báo giá phụ kiện tủ bếp cao cấp Roxana"
        elif "LAMINATE KINGDOM" in blob or "KINGDOM" in blob:
            project_or_partner = "NCC Ván Phủ Laminate Kingdom"
            subcategory = "Bảng giá ván ép phủ Laminate Kingdom 2026"
        elif "PL LIGHTING" in blob or target_id == "4182682970228896207":
            project_or_partner = "NCC Đèn LED PL Lighting"
            subcategory = "Báo giá thanh nhôm định hình & Đèn LED PL Lighting"
        elif "VSG" in blob or "VIỆT NHẬT" in blob or target_id == "g6882545434220944455":
            project_or_partner = "NCC Kính VSG Việt Nhật"
            subcategory = "Báo giá kính cường lực, kính an toàn VSG Việt Nhật"
        elif "DONG HAI" in blob or "ĐÔNG HẢI" in blob or target_id == "6179957903390709255":
            project_or_partner = "Nhà Thầu Cơ Điện Đông Hải"
            subcategory = f"Hồ sơ năng lực & Báo giá điện nước Đông Hải ({pages} trang)"
        elif "FASTDO" in blob or target_id == "7947230930659550350":
            project_or_partner = "Phần mềm Quản trị Fastdo"
            subcategory = "Báo giá phần mềm quản trị số Fastdo AI"
        else:
            project_or_partner = "Nhà Cung Cấp Vật Tư"
            subcategory = "Báo giá / Catalog vật tư phụ kiện"

    elif is_internal_admin:
        category = "CHUNG_TU_HOA_DON_QUAN_TRI_NOI_BO"
        category_label = "Chứng từ, Hóa đơn & Quản trị nội bộ PG Home"
        if "BHXH" in blob or "BẢO HIỂM" in blob or target_id == "g5791781168560517284":
            project_or_partner = "BHXH Tỉnh Hà Tĩnh"
            subcategory = "Công văn hướng dẫn chính sách Bảo hiểm xã hội"
        elif "TÊN NHÂN VIÊN 1 2 3" in blob or target_id == "g1792366938218612507" or "CHẤM CÔNG" in blob:
            project_or_partner = "Xưởng PG Home"
            subcategory = "Bảng chấm công thợ theo dõi thời gian làm việc"
        elif "TIỀN ĂN THỢ" in blob or "3 MÁY ĐO" in blob or target_id == "g2210130381397538159":
            project_or_partner = "Xưởng PG Home"
            subcategory = "Sổ nhật trình theo dõi chi tiêu và tiền ăn thợ xưởng"
        elif "THƯỞNG 2/9" in blob or "TIỀN LỄ 2/9" in blob:
            project_or_partner = "Văn Phòng & Xưởng PG Home"
            subcategory = "Danh sách chi thưởng lễ Quốc Khánh 2/9"
        elif "38A 094.63" in blob or "GARA" in blob or "SỬA CHỮA XE" in blob:
            project_or_partner = "Xe Ô Tô Chị Hương (BKS 38A 094.63)"
            subcategory = "Phiếu báo giá & Hóa đơn sửa chữa gara ô tô"
        elif "MẪU TK8" in blob or target_id == "g1954826388122811364":
            project_or_partner = "Thủ tục Quản lý XNC"
            subcategory = "Tờ khai Mẫu TK8 đề nghị cấp giấy thông hành"
        elif "PHÓ THỦ TƯỚNG" in blob or "GIAY-MOI" in blob or target_id == "g795402381131416269":
            project_or_partner = "Cơ Quan Nhà Nước"
            subcategory = "Giấy mời và lộ trình công tác đoàn lãnh đạo"
        else:
            project_or_partner = "Quản trị nội bộ PG Home"
            subcategory = "Chứng từ thanh toán & Quản trị"

    elif is_external_edu:
        category = "HO_SO_UNG_VIEN_VA_NGOAI_VI"
        category_label = "Hồ sơ ứng viên, Giáo dục & Ngoại vi"
        if "CV" in blob or "CURRICULUM" in blob or "ỨNG TUYỂN" in blob:
            project_or_partner = "Tuyển Dụng Nhân Sự PG Home"
            subcategory = "CV ứng viên Marketing, KTS, Thiết kế nội thất"
        elif "ANBER" in blob or target_id == "g1023694868405271280":
            project_or_partner = "Trường Tiểu Học Anber Hà Tĩnh"
            subcategory = "Thông báo phân luồng, tiêu chí xếp lớp 6 & biểu mẫu"
        elif "PREPARE" in blob or "EXAM BOOSTER" in blob or target_id == "g3520788964083100696":
            project_or_partner = "Lớp Học Tiếng Anh Hồ Kiều Trinh"
            subcategory = "Tài liệu học tập & Đề luyện thi tiếng Anh Prepare A2"
        elif "TRẦN THẢO ENVY" in blob or target_id == "g6547443287129294617":
            project_or_partner = "Ban Phụ Huynh Học Sinh"
            subcategory = "Văn bản tiếp nhận & Phản hồi ý kiến phụ huynh"
        elif "LŨY THỪA" in blob or "LỦY THỪA" in blob or "TOÁN" in blob:
            project_or_partner = "Học Tập Gia Đình"
            subcategory = "Bài tập toán học và ôn tập kiến thức lớp 6"
        else:
            project_or_partner = "Tài liệu Ngoại Vi"
            subcategory = "Tài liệu giáo dục & Học tập"

    else:
        # Fallback an toàn
        if any(c in creator.upper() for c in ["EXCEL", "SPREADSHEET"]):
            category = "DU_TOAN_BAO_GIA_CONG_TRINH"
            category_label = "Dự toán & Báo giá công trình nội thất"
            project_or_partner = "Dự toán Công trình PG Home"
            subcategory = "Bảng tính dự toán Excel xuất PDF"
        elif any(c in creator.upper() for c in ["AUTOCAD", "REVIT"]):
            category = "BAN_VE_KY_THUAT_CONG_TRINH"
            category_label = "Bản vẽ kỹ thuật & Kiến trúc công trình"
            project_or_partner = "Bản vẽ kỹ thuật dự án"
            subcategory = "Bản vẽ AutoCAD"
        else:
            category = "HO_SO_UNG_VIEN_VA_NGOAI_VI"
            category_label = "Hồ sơ ứng viên, Giáo dục & Ngoại vi"
            project_or_partner = "Tài liệu tham khảo khác"
            subcategory = "Tài liệu ngoại vi"

    return category, category_label, subcategory, project_or_partner


def main():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Khởi động Indexer 185 file PDF...")
    
    with open(FILENOISE_INDEX_PATH, "r", encoding="utf-8") as f:
        filenoise_data = json.load(f)

    name_map, conv_map = load_references()
    print(f"Đã nạp {len(name_map)} danh bạ/nhân sự và {len(conv_map)} tên hội thoại Zalo.")

    all_items = filenoise_data.get("items", [])
    # Lọc chuẩn đúng 185 file PDF theo format hoặc extension
    pdf_items = [it for it in all_items if it.get("format") == "PDF" or it.get("extension", "").lower() == ".pdf"]
    print(f"Tổng số file PDF trích xuất thành công: {len(pdf_items)} file.")

    audit_records = []
    cat_counts = {
        "BAN_VE_KY_THUAT_CONG_TRINH": 0,
        "DU_TOAN_BAO_GIA_CONG_TRINH": 0,
        "BANG_GIA_CATALOG_NHA_CUNG_CAP": 0,
        "CHUNG_TU_HOA_DON_QUAN_TRI_NOI_BO": 0,
        "HO_SO_UNG_VIEN_VA_NGOAI_VI": 0
    }
    project_counts = {}

    for idx, it in enumerate(pdf_items, start=1):
        file_id = it.get("file_id", "")
        sender_uid, sender_name, target_id, target_name = resolve_parties(it, name_map, conv_map)
        category, category_label, subcategory, project_or_partner = classify_single_pdf(
            it, sender_uid, sender_name, target_id, target_name
        )

        cat_counts[category] = cat_counts.get(category, 0) + 1
        project_counts[project_or_partner] = project_counts.get(project_or_partner, 0) + 1

        meta = it.get("metadata", {})
        title = (meta.get("title") or "").strip()
        preview = (meta.get("text_preview") or "").strip()
        
        record = {
            "index": idx,
            "file_id": file_id,
            "category": category,
            "category_label": category_label,
            "subcategory": subcategory,
            "project_or_partner": project_or_partner,
            "sender_uid": sender_uid,
            "sender_name": sender_name,
            "target_id": target_id,
            "target_name": target_name,
            "title": title,
            "pages": meta.get("pages") or 0,
            "original_size_bytes": it.get("original_size") or 0,
            "decoded_size_bytes": it.get("decoded_size") or 0,
            "creator": meta.get("creator") or "",
            "producer": meta.get("producer") or "",
            "creation_date": meta.get("creationDate") or "",
            "sha256": it.get("sha256") or "",
            "source_path": it.get("source_path") or "",
            "text_preview_snippet": preview[:250].replace("\n", " ").strip()
        }
        audit_records.append(record)

    output_payload = {
        "audit_metadata": {
            "title": "BẢNG KIỂM KÊ VÀ PHÂN LOẠI 185 FILE PDF BẢN VẼ KỸ THUẬT & BÁO GIÁ NCC (FILENOISE)",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_pdf_files": len(audit_records),
            "status": "SUCCESS"
        },
        "category_summary": {
            "BAN_VE_KY_THUAT_CONG_TRINH": {
                "label": "Bản vẽ kỹ thuật & Kiến trúc công trình",
                "count": cat_counts.get("BAN_VE_KY_THUAT_CONG_TRINH", 0)
            },
            "DU_TOAN_BAO_GIA_CONG_TRINH": {
                "label": "Dự toán & Báo giá công trình nội thất",
                "count": cat_counts.get("DU_TOAN_BAO_GIA_CONG_TRINH", 0)
            },
            "BANG_GIA_CATALOG_NHA_CUNG_CAP": {
                "label": "Bảng giá & Catalog Nhà cung cấp (NCC)",
                "count": cat_counts.get("BANG_GIA_CATALOG_NHA_CUNG_CAP", 0)
            },
            "CHUNG_TU_HOA_DON_QUAN_TRI_NOI_BO": {
                "label": "Chứng từ, Hóa đơn & Quản trị nội bộ PG Home",
                "count": cat_counts.get("CHUNG_TU_HOA_DON_QUAN_TRI_NOI_BO", 0)
            },
            "HO_SO_UNG_VIEN_VA_NGOAI_VI": {
                "label": "Hồ sơ ứng viên, Giáo dục & Ngoại vi",
                "count": cat_counts.get("HO_SO_UNG_VIEN_VA_NGOAI_VI", 0)
            }
        },
        "project_partner_summary": project_counts,
        "files": audit_records
    }

    os.makedirs(os.path.dirname(OUTPUT_AUDIT_PATH), exist_ok=True)
    with open(OUTPUT_AUDIT_PATH, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, ensure_ascii=False, indent=2)

    print("\n========== KẾT QUẢ KIỂM TOÁN VÀ PHÂN LOẠI 185 FILE PDF ==========")
    for k, v in output_payload["category_summary"].items():
        print(f"[{k}] {v['label']}: {v['count']} files")
    print(f"Tổng số dự án / đối tác phát hiện: {len(project_counts)}")
    print(f"Đã xuất dữ liệu ra file: {OUTPUT_AUDIT_PATH}")


if __name__ == "__main__":
    main()
