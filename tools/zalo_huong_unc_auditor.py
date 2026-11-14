# -*- coding: utf-8 -*-
"""
Công cụ Đối Soát Chứng Từ UNC, Hóa Đơn & Giao Dịch Chị Hương (Kế toán / Vợ Giám Đốc)
Đơn vị: Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia (PG Home Luxury)
Mã Định Danh:
  - Chị Hương (Kế toán): 1193413708528852811
  - Giám Đốc Nguyễn Viết Nghĩa: 2304805760907141944
Nguồn dữ liệu:
  - Kho Media Zalo: C:\\Users\\Admin\\AppData\\Roaming\\ZaloData\\media\\2304805760907141944\\ZaloDownloads\\resource\\1193413708528852811
  - Cache OCR: f:\\PG Home - Quản trị\\data\\zalo_unc_ocr_cache.json
  - Tệp đầu ra: f:\\PG Home - Quản trị\\data\\zalo_huong_unc_ledger.json

Cải tiến Kiến trúc (v2.0-MULTI-TIER-OCR):
  - Kỷ luật Tàng hình 100%: IDLE_PRIORITY_CLASS, chạy ngầm tĩnh, không cướp focus.
  - Cải tiến 1: Incremental Hash Cache lưu theo SHA-256 để chống phân tích trùng lặp.
  - Cải tiến 2: Bộ Phân Tích Đa Tầng (Multi-Tier UNC Analyzer):
      + Tầng 1: Pillow kích thước, tỷ lệ smartphone dọc 9:16-9:21, bảng màu ngân hàng đặc trưng (VietinBank, VCB, TCB, MB, BIDV, Agri), EXIF metadata.
      + Tầng 2: RapidOCR Onnxruntime & Regex bóc tách cấu trúc số tiền, mã giao dịch, ngân hàng, thời gian, nội dung, người nhận/chuyển.
  - Tương thích ngược 100% với cấu trúc trường JSON cũ của zalo_v6_master_sync.py.
"""

import os
import re
import sys
import time
import json as _stdlib_json
import hashlib
import datetime
import warnings
import unicodedata
from collections import defaultdict

# Drop-in Rust-backed JSON accelerator (orjson 6x-10x faster, 100% backward-compatible with stdlib json)
try:
    import orjson as _orjson

    class _FastJsonAdapter:
        JSONDecodeError = _stdlib_json.JSONDecodeError

        @staticmethod
        def loads(s, *args, **kwargs):
            if not args and not kwargs:
                return _orjson.loads(s)
            return _stdlib_json.loads(s, *args, **kwargs)

        @staticmethod
        def dumps(obj, *args, **kwargs):
            if not args and set(kwargs.keys()) <= {"ensure_ascii", "indent"}:
                opt = _orjson.OPT_INDENT_2 if kwargs.get("indent") else 0
                try:
                    return _orjson.dumps(obj, option=opt).decode("utf-8")
                except Exception:
                    pass
            return _stdlib_json.dumps(obj, *args, **kwargs)

        @staticmethod
        def load(fp, *args, **kwargs):
            if not args and not kwargs:
                try:
                    return _orjson.loads(fp.read())
                except Exception:
                    fp.seek(0)
            return _stdlib_json.load(fp, *args, **kwargs)

        @staticmethod
        def dump(obj, fp, *args, **kwargs):
            if not args and set(kwargs.keys()) <= {"ensure_ascii", "indent"}:
                opt = _orjson.OPT_INDENT_2 if kwargs.get("indent") else 0
                try:
                    fp.write(_orjson.dumps(obj, option=opt).decode("utf-8"))
                    return
                except Exception:
                    pass
            _stdlib_json.dump(obj, fp, *args, **kwargs)

        def __getattr__(self, name):
            return getattr(_stdlib_json, name)

    json = _FastJsonAdapter()
except ImportError:
    json = _stdlib_json

# Tier-1 Ultra-Fast Native 64-bit WinRT OCR (15ms warm / 380ms cold) & Perceptual dHash Duplicate Guard (#23)
_FAST_OCR_ANALYZE = None
check_unc_duplicate_dhash = None
try:
    if r"C:\Users\Admin\.gemini" not in sys.path:
        sys.path.insert(0, r"C:\Users\Admin\.gemini")
    from fast_ocr import analyze_image as _FAST_OCR_ANALYZE
    import pg_fast_io as _pg_fast_io
    check_unc_duplicate_dhash = _pg_fast_io.check_unc_duplicate_dhash
except Exception:
    _FAST_OCR_ANALYZE = None

warnings.filterwarnings("ignore", category=DeprecationWarning)

# ==============================================================================
# HẰNG SỐ CẤU HÌNH & ĐƯỜNG DẪN HỆ THỐNG PHÚ GIA
# ==============================================================================
MEDIA_DIR = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource\1193413708528852811"
BATCH_FILE = r"f:\PG Home - Quản trị\data\zalo_pulled_batches\batch3_family_huong.json"
ENTITIES_FILE = r"f:\PG Home - Quản trị\data\zalo_verified_entities.json"
CACHE_FILE = r"f:\PG Home - Quản trị\data\zalo_unc_ocr_cache.json"
OUTPUT_LEDGER = r"f:\PG Home - Quản trị\data\zalo_huong_unc_ledger.json"

ID_HUONG = "1193413708528852811"
ID_GIAMDOC = "2304805760907141944"

SUBFOLDERS = ['picture', 'Cache', 'video', 'file', 'voice']


# ==============================================================================
# TIỆN ÍCH CHUẨN HÓA TIẾNG VIỆT
# ==============================================================================
def strip_accents(s):
    """Chuẩn hóa chuỗi tiếng Việt về không dấu để so khớp từ khóa chính xác 100%."""
    if not s:
        return ""
    return "".join(
        c for c in unicodedata.normalize("NFD", s)
        if unicodedata.category(c) != "Mn"
    ).replace("đ", "d").replace("Đ", "D")


# ==============================================================================
# KỶ LUẬT TÀNG HÌNH 100% (STEALTH PROTOCOL)
# ==============================================================================
def set_stealth_priority():
    """Thiết lập độ ưu tiên tiến trình xuống IDLE để đảm bảo Kỷ luật Tàng hình 100%."""
    try:
        import psutil
        p = psutil.Process()
        p.nice(psutil.IDLE_PRIORITY_CLASS)
    except Exception:
        try:
            import ctypes
            # 0x00000040 = IDLE_PRIORITY_CLASS
            ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x00000040)
        except Exception:
            pass


# ==============================================================================
# BỘ NHỚ ĐỆM BĂM LŨY TIẾN (INCREMENTAL HASH CACHE)
# ==============================================================================
class IncrementalHashCache:
    """Quản lý cache bóc tách UNC theo mã băm SHA-256 để tối ưu hiệu năng tối đa."""

    def __init__(self, cache_file=CACHE_FILE):
        self.cache_file = cache_file
        self.cache_data = {}
        self.is_dirty = False
        self.load()

    def load(self):
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    self.cache_data = json.load(f)
            except Exception:
                self.cache_data = {}

    def get(self, sha256_hash):
        return self.cache_data.get(sha256_hash)

    def set(self, sha256_hash, analysis_result):
        self.cache_data[sha256_hash] = analysis_result
        self.is_dirty = True

    def save(self):
        if not self.is_dirty:
            return
        try:
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            temp_file = self.cache_file + ".tmp"
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(self.cache_data, f, ensure_ascii=False, indent=2)
            if os.path.exists(self.cache_file):
                os.replace(temp_file, self.cache_file)
            else:
                os.rename(temp_file, self.cache_file)
            self.is_dirty = False
        except Exception as e:
            print(f"    [WARN] Không thể lưu cache: {e}", flush=True)


def compute_sha256(filepath):
    """Tính mã băm SHA-256 của tệp tin."""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


# ==============================================================================
# HÀM TÌM KIẾM ĐƯỜNG DẪN ẢNH ĐỌC ĐƯỢC (IMAGE RESOLVER)
# ==============================================================================
def resolve_image_path(filepath):
    """
    Xác định đường dẫn ảnh đọc được bởi Pillow.
    Nếu file gốc là JXL hoặc không thể mở trực tiếp, tra cứu bản sao JPEG trong thư mục Cache.
    """
    if not os.path.exists(filepath):
        return None

    # Thử mở trực tiếp
    try:
        from PIL import Image
        with Image.open(filepath) as img:
            img.verify()
        return filepath
    except Exception:
        pass

    # Nếu không mở được, tìm trong thư mục Cache
    parent_dir = os.path.dirname(filepath)
    fname = os.path.basename(filepath)
    base_stem = os.path.splitext(fname)[0]

    cache_dir = os.path.join(os.path.dirname(parent_dir), "Cache")
    if os.path.exists(cache_dir):
        # 1. Thử các hậu tố chất lượng cao _h, _n, _t
        candidates = [
            os.path.join(cache_dir, f"{base_stem}_h"),
            os.path.join(cache_dir, f"{base_stem}_n"),
            os.path.join(cache_dir, f"{base_stem}_t"),
            os.path.join(cache_dir, f"{base_stem}_h.jpg"),
            os.path.join(cache_dir, f"{base_stem}_n.jpg"),
            os.path.join(cache_dir, f"{base_stem}_t.jpg")
        ]
        for c in candidates:
            if os.path.exists(c):
                try:
                    from PIL import Image
                    with Image.open(c) as img:
                        img.verify()
                    return c
                except Exception:
                    continue

        # 2. Thử tìm theo timestamp prefix
        m = re.match(r"^(\d+)", base_stem)
        if m:
            prefix = m.group(1)
            for cf in sorted(os.listdir(cache_dir)):
                if cf.startswith(prefix) and (cf.endswith("_h") or cf.endswith("_n") or cf.endswith("_t")):
                    c_path = os.path.join(cache_dir, cf)
                    try:
                        from PIL import Image
                        with Image.open(c_path) as img:
                            img.verify()
                        return c_path
                    except Exception:
                        continue

    return None


# ==============================================================================
# TẦNG 1: BỘ PHÂN TÍCH ĐẶC TRƯNG HÌNH ẢNH (TIER 1 ANALYZER)
# ==============================================================================
def analyze_bank_color_palette(img):
    """
    Phân tích dải màu đặc trưng của các ngân hàng thương mại Việt Nam:
      - VietinBank: Xanh lam đậm (#005A9C) + Đỏ/Cam logo (#ED1C24)
      - Vietcombank: Xanh lục / Xanh lá (#006A38, #118A44)
      - Techcombank: Đỏ tươi (#ED1C24) + Trắng
      - MBBank: Xanh dương hoàng gia (#003399, #002277)
      - BIDV: Xanh ngọc lục bảo / Teal (#00685E, #007D69) + Vàng
      - Agribank: Đỏ bordeaux / Nâu đỏ (#A21C2B) + Vàng
    """
    thumb = img.convert('RGB').resize((120, 240))
    try:
        pixels = list(thumb.getdata())
    except Exception:
        pixels = []
    total_pixels = len(pixels) if pixels else 1

    counts = {
        "VietinBank": 0,
        "Vietcombank": 0,
        "Techcombank": 0,
        "MBBank": 0,
        "BIDV": 0,
        "Agribank": 0
    }

    for r, g, b in pixels:
        # VietinBank: Xanh dương đậm chủ đạo
        if b > 100 and b > r + 30 and 50 <= g <= 190 and r < 100:
            counts["VietinBank"] += 1
        # Vietcombank: Xanh lá cây chủ đạo
        elif g > 110 and g > r + 35 and g > b + 20 and r < 120:
            counts["Vietcombank"] += 1
        # Techcombank: Đỏ tươi chủ đạo
        elif r > 160 and r > g + 60 and r > b + 60:
            counts["Techcombank"] += 1
        # MBBank: Xanh dương đậm sâu
        elif b > 140 and b > r + 60 and g < 100 and r < 80:
            counts["MBBank"] += 1
        # BIDV: Xanh ngọc Teal
        elif g > 90 and b > 90 and abs(g - b) < 40 and r < 70:
            counts["BIDV"] += 1
        # Agribank: Đỏ thẫm Crimson
        elif 100 <= r <= 170 and g < 60 and b < 60:
            counts["Agribank"] += 1

    ratios = {k: round(v / float(total_pixels) * 100, 2) for k, v in counts.items()}

    best_match = None
    max_ratio = 0.0
    for k, r in ratios.items():
        if r > max_ratio and r >= 1.5:
            max_ratio = r
            best_match = k

    return {
        "nhan_dien_ngan_hang_qua_mau": best_match,
        "ty_le_mau_ngan_hang_percent": ratios,
        "do_tin_cay_mau_sac": "CAO" if max_ratio > 8.0 else ("TRUNG_BINH" if max_ratio > 3.0 else "THAP")
    }


def analyze_tier1_image_features(image_path):
    """
    Bóc tách các đặc trưng hình ảnh Tầng 1:
      - Kích thước ảnh (Width x Height)
      - Tỷ lệ khung hình dọc smartphone (0.38 <= aspect_ratio <= 0.70)
      - Phân tích bảng màu đặc trưng ngân hàng
      - Đọc metadata/EXIF (Make, Model, Software, DateTime)
    """
    if not image_path or not os.path.exists(image_path):
        return {
            "trang_thai": "FILE_KHONG_TON_TAI_HOAC_CHUA_RESOLVE",
            "kich_thuoc_px": None,
            "ty_le_khung_hinh": None,
            "la_khung_hinh_smartphone_doc": False,
            "bang_mau_ngan_hang": None,
            "metadata_exif": {}
        }

    try:
        from PIL import Image, ExifTags
        with Image.open(image_path) as img:
            w, h = img.size
            aspect = round(w / float(h), 4) if h > 0 else 0.0
            is_phone_aspect = (0.38 <= aspect <= 0.70) and (h > w)

            color_analysis = analyze_bank_color_palette(img)

            # Đọc EXIF
            exif_dict = {}
            try:
                exif = img.getexif()
                if exif:
                    for tag_id, value in exif.items():
                        tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                        if tag_name in ['Make', 'Model', 'Software', 'DateTime', 'Orientation']:
                            exif_dict[tag_name] = str(value)
            except Exception:
                pass

            return {
                "trang_thai": "THANH_CONG",
                "kich_thuoc_px": f"{w}x{h}",
                "chieu_rong": w,
                "chieu_cao": h,
                "dinh_dang": img.format or "JPEG",
                "ty_le_khung_hinh": aspect,
                "la_khung_hinh_smartphone_doc": is_phone_aspect,
                "bang_mau_ngan_hang": color_analysis,
                "metadata_exif": exif_dict
            }
    except Exception as e:
        return {
            "trang_thai": f"LOI_DOC_ANH: {str(e)}",
            "kich_thuoc_px": None,
            "ty_le_khung_hinh": None,
            "la_khung_hinh_smartphone_doc": False,
            "bang_mau_ngan_hang": None,
            "metadata_exif": {}
        }


# ==============================================================================
# TẦNG 2: BỘ NHẬN DIỆN VÀ BÓC TÁCH OCR (TIER 2 ANALYZER)
# ==============================================================================
_GLOBAL_OCR_ENGINE = None

def get_ocr_engine():
    """Khởi tạo singleton RapidOCR engine."""
    global _GLOBAL_OCR_ENGINE
    if _GLOBAL_OCR_ENGINE is None:
        try:
            from rapidocr_onnxruntime import RapidOCR
            _GLOBAL_OCR_ENGINE = RapidOCR()
        except Exception:
            _GLOBAL_OCR_ENGINE = False
    return _GLOBAL_OCR_ENGINE


def parse_ocr_text_to_bill_data(lines_with_boxes):
    """
    Bóc tách cấu trúc nội dung biên lai chuyển tiền UNC từ kết quả OCR:
      - Chuẩn hóa text tiếng Việt không dấu để so khớp từ khóa siêu bền vững
      - Nhận diện ngân hàng phát hành (VietinBank, VCB, TCB, MB, BIDV, Agribank, ACB...)
      - Bóc tách số tiền chuyển (VND)
      - Bóc tách mã giao dịch (FT / Reference ID / Trace)
      - Bóc tách ngày giờ giao dịch
      - Bóc tách nội dung chuyển khoản
      - Bóc tách người nhận / tài khoản nhận / ngân hàng nhận
      - Bóc tách người chuyển / tài khoản nguồn
    """
    lines = [l[1].strip() for l in lines_with_boxes if l[1].strip()]
    full_text = "\n".join(lines)
    full_text_norm = strip_accents(full_text).lower()

    # 1. Xác định đây có phải là Bill/UNC chuyển tiền thành công không
    unc_core_indicators = [
        "chuyen tien thanh cong", "giao dich thanh cong", "chuyen khoan thanh cong",
        "thanh toan thanh cong", "chuyen nhanh napas", "lenh chuyen tien",
        "bien lai chuyen tien", "giay bao no", "uy nhiem chi", "chung tu giao dich"
    ]
    has_unc_core = any(ind in full_text_norm for ind in unc_core_indicators)

    # Loại trừ mã QR thanh toán (chưa chuyển tiền)
    is_qr_only = ("quet ma de chuyen tien" in full_text_norm or "vietqr" in full_text_norm) and not has_unc_core

    is_bill_unc = False
    if has_unc_core and not is_qr_only:
        is_bill_unc = True
    elif not is_qr_only:
        # Nếu có số tiền VND và từ khóa ngân hàng hoặc giao dịch
        has_vnd = bool(re.search(r"\b\d{1,3}(?:[.,]\d{3})+\s*(?:vnd|d)\b", full_text_norm))
        has_bank = any(b in full_text_norm for b in ["vietinbank", "ipay", "vietcombank", "vcb", "techcombank", "mbbank", "bidv", "agribank", "napas", "acb"])
        has_action = any(a in full_text_norm for a in ["chuyen", "thanh toan", "so tien", "tai khoan", "ma giao dich"])
        if has_vnd and has_bank and has_action:
            is_bill_unc = True

    if not is_bill_unc:
        return {
            "la_bien_lai_unc": False,
            "ngan_hang": None,
            "so_tien_vnd": 0,
            "ma_giao_dich_ft": None,
            "ngay_gio_gd": None,
            "noi_dung_ck": None,
            "nguoi_nhan": None,
            "tai_khoan_nhan": None,
            "ngan_hang_nhan": None,
            "nguoi_chuyen": None,
            "raw_text_preview": full_text[:200].replace("\n", " | ")
        }

    # 2. Xác định ngân hàng phát hành (Ứng dụng Banking)
    ngan_hang = "Ngân hàng khác"
    if "vietinbank" in full_text_norm or "ipay" in full_text_norm or "icb" in full_text_norm:
        ngan_hang = "VietinBank"
    elif "vietcombank" in full_text_norm or "vcb" in full_text_norm or "digibank" in full_text_norm:
        ngan_hang = "Vietcombank"
    elif "techcombank" in full_text_norm or "tcb" in full_text_norm:
        ngan_hang = "Techcombank"
    elif "mbbank" in full_text_norm or "mb bank" in full_text_norm or "quan doi" in full_text_norm:
        ngan_hang = "MBBank"
    elif "bidv" in full_text_norm or "smartbanking" in full_text_norm:
        ngan_hang = "BIDV"
    elif "agribank" in full_text_norm or "nong nghiep" in full_text_norm:
        ngan_hang = "Agribank"
    elif "tpbank" in full_text_norm:
        ngan_hang = "TPBank"
    elif "vpbank" in full_text_norm:
        ngan_hang = "VPBank"
    elif "acb" in full_text_norm:
        ngan_hang = "ACB"
    elif "sacombank" in full_text_norm:
        ngan_hang = "Sacombank"

    # 3. Bóc tách số tiền giao dịch (VND)
    so_tien_vnd = 0
    # Thử tìm các số tiền có đuôi VND hoặc đ
    for line in lines:
        line_norm = strip_accents(line).lower()
        m = re.search(r"(\d{1,3}(?:[.,]\d{3})+)\s*(?:vnd|d)?\b", line_norm)
        if m:
            num_str = m.group(1).replace(".", "").replace(",", "")
            try:
                val = int(num_str)
                if val >= 10000:
                    so_tien_vnd = val
                    break
            except ValueError:
                pass

    # Nếu chưa thấy, tìm dòng lân cận "Số tiền"
    if so_tien_vnd == 0:
        for i, line in enumerate(lines):
            line_norm = strip_accents(line).lower()
            if any(kw in line_norm for kw in ["so tien", "amount"]):
                m = re.search(r"(\d{1,3}(?:[.,]\d{3})+)", line)
                if m:
                    try:
                        so_tien_vnd = int(m.group(1).replace(".", "").replace(",", ""))
                        break
                    except ValueError:
                        pass
                for next_line in lines[i+1:i+3]:
                    m = re.search(r"(\d{1,3}(?:[.,]\d{3})+)", next_line)
                    if m:
                        try:
                            so_tien_vnd = int(m.group(1).replace(".", "").replace(",", ""))
                            break
                        except ValueError:
                            pass
                if so_tien_vnd > 0:
                    break

    # 4. Bóc tách mã giao dịch và thời gian giao dịch
    ma_giao_dich = None
    ngay_gio_gd = None

    # Tìm dòng VietinBank đặc trưng: "28/07/202620:38430C60728LG53ZE5" hoặc "10/08/202616:50·430C608106ZMNVKJ"
    for line in lines:
        m_combo = re.search(r"(\d{1,2}/\d{1,2}/\d{4})\s*(\d{1,2}:\d{1,2})[^\w]*([A-Z0-9]{12,25})", line)
        if m_combo:
            ngay_gio_gd = f"{m_combo.group(1)} {m_combo.group(2)}"
            ma_giao_dich = m_combo.group(3)
            break

    # Nếu chưa tìm được mã giao dịch
    if not ma_giao_dich:
        for i, line in enumerate(lines):
            line_norm = strip_accents(line).lower()
            if any(kw in line_norm for kw in ["ma giao dich", "ma tham chieu", "ma gd", "so gd", "trace", "ref no"]):
                m = re.search(r"([A-Za-z0-9_-]{8,30})", line)
                if m and not any(w in strip_accents(m.group(1)).lower() for w in ["giao", "dich", "tham", "chieu", "thanh", "cong"]):
                    ma_giao_dich = m.group(1)
                    break
                if i + 1 < len(lines):
                    next_line = lines[i+1].strip()
                    m = re.search(r"^([A-Za-z0-9_-]{8,30})$", next_line)
                    if m:
                        ma_giao_dich = m.group(1)
                        break

    if not ma_giao_dich:
        for line in lines:
            m = re.search(r"\b([0-9]{3,4}[A-Z0-9]{10,20})\b", line)
            if m:
                ma_giao_dich = m.group(1)
                break

    # Nếu chưa tìm được ngày giờ
    if not ngay_gio_gd:
        dt_patterns = [
            r"(\d{1,2}[/-]\d{1,2}[/-]\d{4}\s+\d{1,2}:\d{1,2}(?::\d{1,2})?)",
            r"(\d{1,2}:\d{1,2}(?::\d{1,2})?\s+\d{1,2}[/-]\d{1,2}[/-]\d{4})",
            r"(\d{1,2}[/-]\d{1,2}[/-]\d{4})"
        ]
        for line in lines:
            for pat in dt_patterns:
                m = re.search(pat, line)
                if m:
                    ngay_gio_gd = m.group(1)
                    break
            if ngay_gio_gd:
                break

    # 5. Bóc tách Người nhận, Tài khoản nhận, Ngân hàng nhận, Nội dung, Người chuyển
    nguoi_nhan = None
    tai_khoan_nhan = None
    ngan_hang_nhan = None
    noi_dung_ck = None
    nguoi_chuyen = None

    for i, line in enumerate(lines):
        line_norm = strip_accents(line).lower()

        # Dòng VietinBank i-Pay thường có người nhận viết HOA dưới dòng ngày/mã giao dịch
        if re.match(r"^[A-Z\s]{4,35}$", line) and not any(w in line_norm for w in ["vietinbank", "chuyen tien", "thanh cong", "noi dung", "vnd"]):
            if not nguoi_nhan and i >= 2:
                nguoi_nhan = line.strip()

        # Dòng số tài khoản và ngân hàng nhận kết hợp: "9868888688.Techcombank_Ngan" hoặc "50348237·ACB_NganhangAChau"
        m_acc_bank = re.search(r"(\d{6,20})[.\s·_-]*([A-Za-z0-9_ ]+)", line)
        if m_acc_bank and not tai_khoan_nhan:
            tai_khoan_nhan = m_acc_bank.group(1)
            raw_bank_part = m_acc_bank.group(2).strip()
            bank_norm = strip_accents(raw_bank_part).lower()
            if any(b in bank_norm for b in ["techcombank", "acb", "vietinbank", "vietcombank", "mbbank", "bidv", "agribank", "vpbank", "tpbank", "shb", "sacombank"]):
                ngan_hang_nhan = raw_bank_part.split("_")[0]

        # Nội dung chuyển tiền: dòng sau "Noi dung" hoặc "Nội dung"
        if any(kw in line_norm for kw in ["noi dung", "loi nhan"]):
            content_parts = []
            for next_idx in range(i+1, min(i+4, len(lines))):
                nxt = lines[next_idx].strip()
                nxt_norm = strip_accents(nxt).lower()
                if any(k in nxt_norm for k in ["chia se", "thuc hien", "ma giao dich", "vietinbank", "he sinh thai", "bat dong san"]):
                    break
                content_parts.append(nxt)
            if content_parts:
                noi_dung_ck = " ".join(content_parts)
                # Thử trích xuất người chuyển từ nội dung (ví dụ: LUU THI KIM DUNG chuyen tien)
                m_sender = re.search(r"([A-Z\s]{4,30})\s*(?:chuyen|ck|thanh toan)", strip_accents(noi_dung_ck), re.IGNORECASE)
                if m_sender:
                    nguoi_chuyen = m_sender.group(1).strip()

    return {
        "la_bien_lai_unc": is_bill_unc,
        "ngan_hang": ngan_hang,
        "so_tien_vnd": so_tien_vnd,
        "ma_giao_dich_ft": ma_giao_dich,
        "ngay_gio_gd": ngay_gio_gd,
        "noi_dung_ck": noi_dung_ck,
        "nguoi_nhan": nguoi_nhan,
        "tai_khoan_nhan": tai_khoan_nhan,
        "ngan_hang_nhan": ngan_hang_nhan,
        "nguoi_chuyen": nguoi_chuyen,
        "tong_so_dong_ocr": len(lines),
        "raw_text_preview": full_text[:250].replace("\n", " | ")
    }


def analyze_tier2_ocr(image_path):
    """Thực thi nhận diện chữ viết: Ưu tiên Tầng 1 Native WinRT 64-bit OCR (fast_ocr V29) -> Fallback Tầng 2 RapidOCR."""
    if not image_path or not os.path.exists(image_path):
        return {
            "trang_thai": "FILE_KHONG_TON_TAI_HOAC_CHUA_RESOLVE",
            "ocr_engine": None,
            "la_bien_lai_unc": False,
            "du_lieu_boc_tach": None
        }

    # 1. Thử Tầng 1: Native 64-bit WinRT OCR + Incremental Cache (15ms - 380ms)
    if _FAST_OCR_ANALYZE is not None:
        try:
            t0 = time.perf_counter()
            fast_res = _FAST_OCR_ANALYZE(image_path, do_ocr=True, use_cache=True)
            fast_elapsed = round(time.perf_counter() - t0, 3)
            raw_text = (fast_res.get("ocr_text") or "").strip()
            if raw_text:
                synthetic_boxes = [([], ln.strip(), 0.99) for ln in raw_text.splitlines() if ln.strip()]
                parsed_fast = parse_ocr_text_to_bill_data(synthetic_boxes)
                # Nếu nhận diện đầy đủ Bill UNC có số tiền hợp lệ thì trả về ngay lập tức (nhanh gấp 10x)
                if parsed_fast.get("la_bien_lai_unc") and parsed_fast.get("so_tien_vnd"):
                    return {
                        "trang_thai": "THANH_CONG",
                        "ocr_engine": "fast_winrt_ocr_v29",
                        "thoi_gian_ocr_giay": fast_elapsed,
                        "la_bien_lai_unc": True,
                        "du_lieu_boc_tach": parsed_fast
                    }
        except Exception:
            pass

    # 2. Tầng 2 Fallback: RapidOCR ONNX Runtime (cho ảnh chụp nghiêng/mờ hoặc cần đối chiếu sâu)
    engine = get_ocr_engine()
    if not engine:
        return {
            "trang_thai": "OCR_ENGINE_NOT_AVAILABLE",
            "ocr_engine": None,
            "la_bien_lai_unc": False,
            "du_lieu_boc_tach": None
        }

    try:
        results, elapse = engine(image_path)
        if not results:
            return {
                "trang_thai": "KHONG_PHAT_HIEN_CHU",
                "ocr_engine": "rapidocr_onnxruntime",
                "thoi_gian_ocr_giay": round(sum(elapse) if isinstance(elapse, (list, tuple)) else float(elapse), 3),
                "la_bien_lai_unc": False,
                "du_lieu_boc_tach": None
            }

        parsed = parse_ocr_text_to_bill_data(results)
        return {
            "trang_thai": "THANH_CONG",
            "ocr_engine": "rapidocr_onnxruntime",
            "thoi_gian_ocr_giay": round(sum(elapse) if isinstance(elapse, (list, tuple)) else float(elapse), 3),
            "la_bien_lai_unc": parsed["la_bien_lai_unc"],
            "du_lieu_boc_tach": parsed
        }
    except Exception as e:
        return {
            "trang_thai": f"LOI_OCR: {str(e)}",
            "ocr_engine": "rapidocr_onnxruntime",
            "la_bien_lai_unc": False,
            "du_lieu_boc_tach": None
        }


# ==============================================================================
# QUÉT DỮ LIỆU MEDIA & THỐNG KÊ (GIỮ NGUYÊN 100% CẤU TRÚC GỐC)
# ==============================================================================
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


def analyze_single_image(filepath, cache, force_refresh=False):
    """
    Phân tích một ảnh đơn lẻ qua 2 tầng (kèm tra cứu và cập nhật cache theo SHA-256).
    """
    sha = compute_sha256(filepath)
    if not force_refresh:
        cached = cache.get(sha)
        if cached and "phan_tich_tang_2_ocr" in cached:
            # Nếu cache cũ nhận diện sai do lỗi dấu tiếng Việt thì phân tích lại
            t2 = cached.get("phan_tich_tang_2_ocr", {})
            raw_prev = t2.get("du_lieu_boc_tach", {}).get("raw_text_preview", "") if t2.get("du_lieu_boc_tach") else ""
            if "chuyen tien thanh cong" in raw_prev.lower() and not cached.get("la_bien_lai_unc"):
                pass  # Cần phân tích lại
            else:
                return sha, cached

    # Tìm đường dẫn ảnh đọc được (tra cứu Cache nếu là JXL)
    readable_path = resolve_image_path(filepath)

    # Tầng 1: Phân tích hình ảnh
    tier1 = analyze_tier1_image_features(readable_path)

    # Tầng 2: OCR & Regex bóc tách
    tier2 = analyze_tier2_ocr(readable_path)

    is_unc = False
    if tier2 and tier2.get("la_bien_lai_unc"):
        is_unc = True
    elif tier1 and tier1.get("la_khung_hinh_smartphone_doc") and tier1.get("bang_mau_ngan_hang", {}).get("nhan_dien_ngan_hang_qua_mau"):
        is_unc = True

    analysis_result = {
        "sha256": sha,
        "thoi_gian_phan_tich": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "duong_dan_goc": filepath,
        "duong_dan_doc_duoc": readable_path,
        "la_bien_lai_unc": is_unc,
        "phan_tich_tang_1_hinh_anh": tier1,
        "phan_tich_tang_2_ocr": tier2
    }

    cache.set(sha, analysis_result)
    return sha, analysis_result


def get_top_20_november_documents(media_records, cache):
    """
    Lấy 20 chứng từ ảnh mới nhất tháng 11/2026.
    GIỮ NGUYÊN 100% 8 TRƯỜNG CŨ để tương thích tuyệt đối với zalo_v6_master_sync.py,
    đồng thời bổ sung các trường phân tích Tầng 1 & Tầng 2 mới.
    """
    nov_pictures = [
        r for r in media_records
        if r["folder"] == "picture" and r["month_key"] == "2026-11"
    ]
    nov_pictures.sort(key=lambda x: x["timestamp_ms"], reverse=True)

    top20 = []
    for idx, r in enumerate(nov_pictures[:20], 1):
        sha, analysis = analyze_single_image(r["path"], cache)

        # 8 trường JSON gốc bất khả xâm phạm
        item = {
            "thu_tu": idx,
            "thoi_gian": r["datetime"],
            "timestamp_ms": r["timestamp_ms"],
            "nguoi_gui_id": r["sender_id"],
            "nguoi_gui_ten": r["sender_name"],
            "ten_tep": r["filename"],
            "kich_thuoc_bytes": r["size_bytes"],
            "ma_bam_sha256": sha,
            # Bổ sung các trường nâng cấp mới
            "la_bien_lai_unc": analysis.get("la_bien_lai_unc", False),
            "phan_tich_tang_1_hinh_anh": analysis.get("phan_tich_tang_1_hinh_anh"),
            "phan_tich_tang_2_ocr": analysis.get("phan_tich_tang_2_ocr")
        }
        top20.append(item)

    return top20


def extract_confirmed_ncc_payments():
    """Trích xuất và đối soát các khoản thanh toán NCC đã xác nhận (giữ nguyên 100%)."""
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


def extract_all_unc_bills(media_records, cache):
    """
    Quét và trích xuất danh sách tất cả các biên lai UNC thực tế bóc tách được từ kho ảnh.
    Ưu tiên toàn bộ các file JPG và các file có thể đọc được.
    """
    pic_records = [r for r in media_records if r["folder"] == "picture"]
    pic_records.sort(key=lambda x: (not x["filename"].endswith(".jpg"), -x["timestamp_ms"]))

    extracted_unc_list = []
    # Phân tích sâu các ứng viên (ưu tiên các file JPG)
    candidates = pic_records[:45]

    for r in candidates:
        sha, analysis = analyze_single_image(r["path"], cache)
        if analysis.get("la_bien_lai_unc"):
            tier2 = analysis.get("phan_tich_tang_2_ocr", {})
            parsed = tier2.get("du_lieu_boc_tach") if tier2 else None

            so_tien = parsed.get("so_tien_vnd", 0) if parsed else 0
            ma_gd = parsed.get("ma_giao_dich_ft") if parsed else None
            ngan_hang = parsed.get("ngan_hang") if parsed else "Khác"
            ngay_gio = parsed.get("ngay_gio_gd") if parsed else r["datetime"]
            noi_dung = parsed.get("noi_dung_ck") if parsed else None
            nguoi_nhan = parsed.get("nguoi_nhan") if parsed else None
            tai_khoan_nhan = parsed.get("tai_khoan_nhan") if parsed else None
            nguoi_chuyen = parsed.get("nguoi_chuyen") if parsed else r["sender_name"]

            unc_entry = {
                "ten_tep": r["filename"],
                "thoi_gian_zalo": r["datetime"],
                "nguoi_gui_zalo": r["sender_name"],
                "ma_bam_sha256": sha,
                "ngan_hang_phat_hanh": ngan_hang,
                "so_tien_vnd": so_tien,
                "ma_giao_dich": ma_gd,
                "thoi_gian_giao_dich": ngay_gio,
                "noi_dung_chuyen_khoan": noi_dung,
                "nguoi_nhan": nguoi_nhan,
                "tai_khoan_nhan": tai_khoan_nhan,
                "nguoi_chuyen": nguoi_chuyen,
                "raw_text_preview": parsed.get("raw_text_preview") if parsed else None
            }
            extracted_unc_list.append(unc_entry)

    return extracted_unc_list


# ==============================================================================
# HÀM ĐIỀU PHỐI CHÍNH (MAIN AUDIT RUNNER)
# ==============================================================================
def run_audit():
    # 1. Kỷ luật tàng hình
    set_stealth_priority()
    print("[1/5] Thiết lập IDLE Priority Class thành công (Kỷ luật Tàng hình 100%).", flush=True)

    # Khởi tạo Incremental Cache
    cache = IncrementalHashCache(CACHE_FILE)
    print(f"      -> Đã nạp cache từ: {CACHE_FILE} ({len(cache.cache_data)} mục có sẵn)", flush=True)

    print("[2/5] Đang quét toàn bộ kho media Chị Hương...", flush=True)
    records = scan_media_files()
    print(f"      -> Tổng cộng phát hiện: {len(records)} media files", flush=True)

    print("[3/5] Đang tổng hợp thống kê theo tháng và người gửi...", flush=True)
    monthly_stats = build_monthly_statistics(records)

    print("[4/5] Đang phân tích Tầng 1 (Hình ảnh) & Tầng 2 (RapidOCR) cho 20 ảnh mới nhất T11/2026...", flush=True)
    top20_nov = get_top_20_november_documents(records, cache)

    print("[5/5] Đang trích xuất đối soát các khoản thanh toán NCC & biên lai UNC phát hiện...", flush=True)
    ncc_payments = extract_confirmed_ncc_payments()
    unc_bills_detected = extract_all_unc_bills(records, cache)

    # Lưu cache xuống đĩa
    cache.save()
    print(f"      -> Đã lưu cập nhật {len(cache.cache_data)} bản ghi vào cache: {CACHE_FILE}", flush=True)

    # Tổng giá trị ước tính
    total_val = sum(b.get("so_tien_vnd", 0) for b in unc_bills_detected)

    # Tạo sổ cái toàn diện
    ledger_data = {
        "metadata": {
            "he_thong": "PG Home Luxury Management System",
            "chuyen_de": "Sổ Cái Đối Soát Chứng Từ UNC, Hóa Đơn & Thanh Toán NCC Chị Hương",
            "phien_ban": "2.0-MULTI-TIER-OCR",
            "ngay_lap_so": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "nguoi_kiem_soat": "Kỹ Sư Đối Soát Chứng Từ UNC Chị Hương (W10)",
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
            },
            "tong_so_anh_da_phan_tich_ocr": len(cache.cache_data),
            "tong_so_bien_lai_unc_phat_hien": len(unc_bills_detected),
            "tong_gia_tri_unc_uoc_tinh_vnd": total_val,
            "duong_dan_cache": CACHE_FILE
        },
        "thong_ke_theo_thang": monthly_stats,
        "top_20_chung_tu_anh_moi_nhat_thang_11_2026": top20_nov,
        "cac_khoan_thanh_toan_ncc_da_xac_nhan": ncc_payments,
        "danh_sach_chung_tu_unc_boc_tach": unc_bills_detected
    }

    # Ghi tệp JSON
    os.makedirs(os.path.dirname(OUTPUT_LEDGER), exist_ok=True)
    with open(OUTPUT_LEDGER, "w", encoding="utf-8") as f:
        json.dump(ledger_data, f, ensure_ascii=False, indent=2)

    print(f"\n[HOÀN TẤT] Đã xuất sổ cái ra: {OUTPUT_LEDGER}", flush=True)
    print(f"           Kích thước file: {os.path.getsize(OUTPUT_LEDGER):,} bytes", flush=True)
    print(f"           Phát hiện {len(unc_bills_detected)} biên lai UNC thật với tổng tiền: {total_val:,.0f} VND", flush=True)
    return ledger_data


if __name__ == "__main__":
    run_audit()
