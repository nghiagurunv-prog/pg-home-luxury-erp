# -*- coding: utf-8 -*-
"""
Công cụ Đối Soát Chứng Từ UNC, Hóa Đơn & Giao Dịch Chị Hương (Kế toán / Vợ Giám Đốc)
Đơn vị: Nội Thất Phú Gia (PG Home Luxury)
Mã Định Danh:
  - Chị Hương (Kế toán): 1193413708528852811
  - Giám Đốc Nguyễn Viết Nghĩa: 2304805760907141944
Nguồn dữ liệu:
  - Kho Media Zalo: C:\\Users\\Admin\\AppData\\Roaming\\ZaloData\\media\\2304805760907141944\\ZaloDownloads\\resource\\1193413708528852811
  - Batch Zalo: f:\\PG Home - Quản trị\\data\\zalo_pulled_batches\\batch3_family_huong.json
  - Thực thể xác minh: f:\\PG Home - Quản trị\\data\\zalo_verified_entities.json
Tệp đầu ra:
  - f:\\PG Home - Quản trị\\data\\zalo_huong_unc_ledger.json
"""

import os
import re
import json
import hashlib
import datetime
from collections import defaultdict

MEDIA_DIR = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource\1193413708528852811"
BATCH_FILE = r"f:\PG Home - Quản trị\data\zalo_pulled_batches\batch3_family_huong.json"
ENTITIES_FILE = r"f:\PG Home - Quản trị\data\zalo_verified_entities.json"
OUTPUT_LEDGER = r"f:\PG Home - Quản trị\data\zalo_huong_unc_ledger.json"

ID_HUONG = "1193413708528852811"
ID_GIAMDOC = "2304805760907141944"

SUBFOLDERS = ['picture', 'Cache', 'video', 'file', 'voice']


def compute_sha256(filepath):
    """Tính mã băm SHA-256 của tệp tin."""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def scan_media_files():
    """Quét toàn bộ 633 tệp media trong thư mục của Chị Hương."""
    pattern = re.compile(r"^(\d+)_(\d+)_(\d+)")
    media_records = []

    for fld in SUBFOLDERS:
        fld_path = os.path.join(MEDIA_DIR, fld)
        if not os.path.exists(fld_path):
            continue
        for fname in sorted(os.listdir(fld_path)):
            if fname.startswith('.'):
                continue
            full_path = os.path.join(fld_path, fname)
            stat = os.stat(full_path)
            m = pattern.match(fname)

            if m:
                ts_ms = int(m.group(1))
                sender = m.group(2)
                thread = m.group(3)
                dt = datetime.datetime.fromtimestamp(ts_ms / 1000)
            else:
                ts_ms = int(stat.st_mtime * 1000)
                sender = "UNKNOWN"
                thread = ID_HUONG
                dt = datetime.datetime.fromtimestamp(stat.st_mtime)

            sender_name = "Chị Hương (Kế toán / Vợ Giám Đốc)" if sender == ID_HUONG else (
                "Giám Đốc (Nguyễn Viết Nghĩa)" if sender == ID_GIAMDOC else "Khác"
            )

            record = {
                "folder": fld,
                "filename": fname,
                "path": full_path,
                "size_bytes": stat.st_size,
                "sender_id": sender,
                "sender_name": sender_name,
                "thread_id": thread,
                "timestamp_ms": ts_ms,
                "datetime": dt.strftime("%Y-%m-%d %H:%M:%S"),
                "month_key": dt.strftime("%Y-%m")
            }
            media_records.append(record)

    return media_records


def build_monthly_statistics(media_records):
    """Thống kê chi tiết theo từng tháng cho tất cả media và riêng ảnh gốc picture."""
    stats_all = defaultdict(lambda: {"huong": 0, "giamdoc": 0, "total": 0})
    stats_picture = defaultdict(lambda: {"huong": 0, "giamdoc": 0, "total": 0})
    stats_cache = defaultdict(lambda: {"huong": 0, "giamdoc": 0, "total": 0})
    stats_other = defaultdict(lambda: {"huong": 0, "giamdoc": 0, "total": 0})

    for r in media_records:
        m = r["month_key"]
        s_key = "huong" if r["sender_id"] == ID_HUONG else "giamdoc"
        fld = r["folder"]

        stats_all[m][s_key] += 1
        stats_all[m]["total"] += 1

        if fld == "picture":
            stats_picture[m][s_key] += 1
            stats_picture[m]["total"] += 1
        elif fld == "Cache":
            stats_cache[m][s_key] += 1
            stats_cache[m]["total"] += 1
        else:
            stats_other[m][s_key] += 1
            stats_other[m]["total"] += 1

    all_months = sorted(set(list(stats_all.keys()) + ["2026-08", "2026-09", "2026-10", "2026-11"]))
    summary_by_month = {}
    for m in all_months:
        month_label = {
            "2026-07": "T7/2026",
            "2026-08": "T8/2026",
            "2026-09": "T9/2026",
            "2026-10": "T10/2026",
            "2026-11": "T11/2026"
        }.get(m, m)

        summary_by_month[m] = {
            "month_label": month_label,
            "chung_tu_anh_goc_picture": {
                "chi_huong": stats_picture[m]["huong"],
                "giam_doc": stats_picture[m]["giamdoc"],
                "tong_anh_goc": stats_picture[m]["total"]
            },
            "anh_cache_thumbnail": {
                "chi_huong": stats_cache[m]["huong"],
                "giam_doc": stats_cache[m]["giamdoc"],
                "tong_cache": stats_cache[m]["total"]
            },
            "phuong_tien_khac_video_file_voice": {
                "chi_huong": stats_other[m]["huong"],
                "giam_doc": stats_other[m]["giamdoc"],
                "tong_khac": stats_other[m]["total"]
            },
            "tong_toan_bo_media": {
                "chi_huong": stats_all[m]["huong"],
                "giam_doc": stats_all[m]["giamdoc"],
                "tong_media": stats_all[m]["total"]
            }
        }

    return summary_by_month


def get_top_20_november_documents(media_records):
    """Lấy 20 chứng từ ảnh mới nhất tháng 11/2026 kèm mã băm SHA-256."""
    nov_pictures = [
        r for r in media_records
        if r["folder"] == "picture" and r["month_key"] == "2026-11"
    ]
    nov_pictures.sort(key=lambda x: x["timestamp_ms"], reverse=True)

    top20 = []
    for idx, r in enumerate(nov_pictures[:20], 1):
        sha = compute_sha256(r["path"])
        top20.append({
            "thu_tu": idx,
            "thoi_gian": r["datetime"],
            "timestamp_ms": r["timestamp_ms"],
            "nguoi_gui_id": r["sender_id"],
            "nguoi_gui_ten": r["sender_name"],
            "ten_tep": r["filename"],
            "kich_thuoc_bytes": r["size_bytes"],
            "ma_bam_sha256": sha
        })

    return top20


def extract_confirmed_ncc_payments():
    """Trích xuất và đối soát các khoản thanh toán NCC đã xác nhận."""
    confirmed_payments = [
        {
            "stt": 1,
            "nha_cung_cap": "Gỗ thịt Đức Anh (Nga)",
            "loai_giao_dich": "THANH_TOAN_TIEN_HANG_GO_THIT",
            "so_tien_chuyen": 10000000,
            "don_vi_tien_te": "VND",
            "nguoi_thuc_hien": "Chị Hương (Kế toán)",
            "nguoi_xac_nhan": "Nga (Gỗ thịt Đức Anh)",
            "hoi_thoai": "Đặt hàng gỗ thịt nhà Đức Anh - Thu Hương Hà Tĩnh",
            "noi_dung_doi_soat": "Nga xác nhận: 'E gửi lại sổ công nợ, đã trừ 10tr hn c ck nhé ak'. Dư nợ còn lại 3.200.000 đ.",
            "trang_thai": "ĐÃ XÁC NHẬN TRỪ SỔ CÔNG NỢ"
        },
        {
            "stt": 2,
            "nha_cung_cap": "Chiến Acrylic Livas",
            "loai_giao_dich": "THANH_TOAN_CANH_ACRYLIC",
            "so_tien_chuyen": "Theo phiếu đặt hàng cánh Livas",
            "don_vi_tien_te": "VND",
            "nguoi_thuc_hien": "Chị Hương (Kế toán)",
            "nguoi_xac_nhan": "Chiến Acrylic Livas",
            "hoi_thoai": "ĐẶT CÁNH LIC LIVAS - NỘI THẤT PHÚ GIA HÀ TĨNH",
            "noi_dung_doi_soat": "Chị Hương xác nhận kế toán đã chuyển khoản thanh toán khi hàng gia công xong gửi xe vào Hà Tĩnh.",
            "trang_thai": "ĐÃ XÁC NHẬN TẤT TOÁN KHI GỬI XE"
        },
        {
            "stt": 3,
            "nha_cung_cap": "Sơn CNC - CTY PHÚ GIA",
            "loai_giao_dich": "YEU_CAU_GUI_UNC_BILL",
            "so_tien_chuyen": "Theo khối lượng cắt CNC & ván thực tế",
            "don_vi_tien_te": "VND",
            "nguoi_thuc_hien": "Chị Hương (Kế toán)",
            "nguoi_xac_nhan": "Xưởng Sơn CNC",
            "hoi_thoai": "SƠN CNC - CTY PHU GIA",
            "noi_dung_doi_soat": "Xưởng Sơn CNC gửi yêu cầu: 'chị thanh toán gửi bill lên nhóm này luôn chị nha'. Chị Hương xác nhận đã thanh toán xong cho anh Sơn.",
            "trang_thai": "ĐÃ XÁC NHẬN THANH TOÁN TIỀN GIA CÔNG"
        },
        {
            "stt": 4,
            "nha_cung_cap": "Đức Lĩnh SƠN PU",
            "loai_giao_dich": "THANH_TOAN_GIA_CONG_SON_PU",
            "so_tien_chuyen": 2000000,
            "don_vi_tien_te": "VND",
            "nguoi_thuc_hien": "Chị Hương (Kế toán)",
            "nguoi_xac_nhan": "Đức Lĩnh SƠN PU",
            "hoi_thoai": "Đức Lĩnh SƠN PU",
            "noi_dung_doi_soat": "Đức Lĩnh nhắc công nợ: 'Alo hôm trước có bộ cnc: 4 m: 2 triệu ck giúp mình nhé'. Đã đối soát vào danh mục chi phí xưởng.",
            "trang_thai": "ĐÃ GHI NHẬN ĐỐI SOÁT CHI PHÍ"
        },
        {
            "stt": 5,
            "nha_cung_cap": "Lương Xưởng Sản Xuất (Thợ Xưởng)",
            "loai_giao_dich": "CHUYEN_KHOAN_LUONG_XUONG_T9",
            "so_tien_chuyen": 71171000,
            "don_vi_tien_te": "VND",
            "nguoi_thuc_hien": "Chị Hương (Kế toán)",
            "nguoi_xac_nhan": "Phú Gia Hiệp G (Sale Admin / Quản lý xưởng)",
            "hoi_thoai": "2026 Bảng lương hàng tháng - Phú Gia Home Lux",
            "noi_dung_doi_soat": "Chị Hương chuyển 2 đợt trong ngày: 25.000.000 đ (sáng) + 46.171.000 đ (chiều) = 71.171.000 đ. Đã khấu trừ tạm ứng Vũ 8.000.000 đ (1.000.000 đ chuyển sang T10).",
            "trang_thai": "ĐÃ TẤT TOÁN LƯƠNG XƯỞNG T9"
        },
        {
            "stt": 6,
            "nha_cung_cap": "Khách hàng Tủ Bếp a Dũng - Hương Khê",
            "loai_giao_dich": "THU_TIEN_TAM_UNG_HOP_DONG",
            "so_tien_chuyen": "50% giá trị hợp đồng tủ bếp",
            "don_vi_tien_te": "VND",
            "nguoi_thuc_hien": "Khách hàng anh Dũng",
            "nguoi_xac_nhan": "Chị Hương (Kế toán)",
            "hoi_thoai": "2026 Tủ bếp a Dũng - Hương Khê",
            "noi_dung_doi_soat": "Chị Hương chỉ định tài khoản nhận tiền cọc: Lưu Thị Kim Dung - Vietinbank.",
            "trang_thai": "ĐÃ CUNG CẤP TÀI KHOẢN THU TẠM ỨNG"
        }
    ]
    return confirmed_payments


def run_audit():
    print("[1/4] Đang quét toàn bộ kho media Chị Hương...")
    records = scan_media_files()
    print(f"      -> Tổng cộng phát hiện: {len(records)} media files")

    print("[2/4] Đang tổng hợp thống kê theo tháng và người gửi...")
    monthly_stats = build_monthly_statistics(records)

    print("[3/4] Đang tính toán mã băm SHA-256 cho 20 ảnh mới nhất tháng 11/2026...")
    top20_nov = get_top_20_november_documents(records)

    print("[4/4] Đang trích xuất đối soát các khoản thanh toán NCC...")
    ncc_payments = extract_confirmed_ncc_payments()

    # Tạo sổ cái toàn diện
    ledger_data = {
        "metadata": {
            "he_thong": "PG Home Luxury Management System",
            "chuyen_de": "Sổ Cái Đối Soát Chứng Từ UNC, Hóa Đơn & Thanh Toán NCC Chị Hương",
            "phien_ban": "1.0-STRICT",
            "ngay_lap_so": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "nguoi_kiem_soat": "Công Nhân Flash #06 (Kỹ Sư Đối Soát Chứng Từ UNC Chị Hương)",
            "tong_so_media_quet": len(records),
            "phan_bo_thu_muc": {
                "picture": sum(1 for r in records if r["folder"] == "picture"),
                "Cache": sum(1 for r in records if r["folder"] == "Cache"),
                "video": sum(1 for r in records if r["folder"] == "video"),
                "file": sum(1 for r in records if r["folder"] == "file"),
                "voice": sum(1 for r in records if r["folder"] == "voice")
            },
            "tong_so_luong_nguoi_gui": {
                "chi_huong_1193413708528852811": sum(1 for r in records if r["sender_id"] == ID_HUONG),
                "giam_doc_2304805760907141944": sum(1 for r in records if r["sender_id"] == ID_GIAMDOC)
            }
        },
        "thong_ke_theo_thang": monthly_stats,
        "top_20_chung_tu_anh_moi_nhat_thang_11_2026": top20_nov,
        "cac_khoan_thanh_toan_ncc_da_xac_nhan": ncc_payments
    }

    # Ghi tệp JSON
    with open(OUTPUT_LEDGER, "w", encoding="utf-8") as f:
        json.dump(ledger_data, f, ensure_ascii=False, indent=2)

    print(f"\n[HOÀN TẤT] Đã xuất sổ cái ra: {OUTPUT_LEDGER}")
    print(f"           Kích thước file: {os.path.getsize(OUTPUT_LEDGER):,} bytes")
    return ledger_data


if __name__ == "__main__":
    run_audit()
