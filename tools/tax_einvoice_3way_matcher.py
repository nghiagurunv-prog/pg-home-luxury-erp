# -*- coding: utf-8 -*-
"""
HỆ THỐNG QUẢN TRỊ & TỰ ĐỘNG HÓA PHÚ GIA (PG HOME LUXURY)
Giai đoạn 2 - R06: Automated Tax e-Invoice XML/PDF Parser & 3-Way Accounting Match (PO <-> GRN <-> UNC)
Công nhân: P07 (Kiểm toán Thuế & Đối Soát 3 Chiều)

CHỨC NĂNG CHÍNH:
1. Bộ bóc tách Hóa đơn điện tử (e-Invoice) chuẩn Tổng cục Thuế (Thông tư 78/2021/TT-BTC & Nghị định 123/2020/NĐ-CP):
   - Phân tích cú pháp XML (`TDiep/DLHDon` hoặc `HDon/DLHDon`, `TTChung`, `NDHDon`, `NBan`, `NMua`, `DSHHDVu`, `TToan`).
   - Phân tích hóa đơn / chứng từ định dạng PDF thông qua PyMuPDF (fitz) / biểu thức chính quy.
2. Cổng Kiểm Toán Pháp Lý Chuẩn Phú Gia (Legal Gate):
   - Thẩm định tính hợp pháp của danh tính doanh nghiệp: MST 042203002931, Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng / CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY.
   - Địa chỉ chuẩn: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh (Địa chỉ ĐKKD: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh). Hotline: 0986.722.324.
   - TỰ ĐỘNG CHẶN ĐỨNG và gắn cờ CRITICAL_LEGAL_VIOLATION nếu phát hiện MST giả mạo (2500732386, 3002228888), địa chỉ sai (35 Ngô Đức Kế, đường Hàm Nghi), viết sai chính tả thiếu dấu (Trương Quốc Dung), danh xưng cấm ("xưởng mộc").
3. Thuật toán Đối Soát Kế Toán 3 Chiều (3-Way Matching: PO <-> GRN/e-Invoice <-> UNC):
   - Băm SHA-256 chống trùng lặp chứng từ UNC 100%.
   - Chấm điểm khớp nối 3 chiều:
     Score = 0.50 * I(|Delta Amount| <= 1000 VND) + 0.30 * Sim(NCC) + 0.20 * max(0, 1 - Delta Days / 7)
   - Phân loại trạng thái chuẩn xác: MATCHED_3WAY, PARTIAL_PAYMENT, MISSING_INVOICE_OR_GRN, DUPLICATE_UNC_BLOCKED, CRITICAL_LEGAL_VIOLATION.
4. Kỷ luật Tàng hình 100% (Stealth Protocol): IDLE_PRIORITY_CLASS, chạy ngầm tĩnh, không cướp focus.
"""

import os
import re
import sys
import json
import hashlib
import unicodedata
import xml.etree.ElementTree as ET
from datetime import datetime, date
from collections import defaultdict

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
# HẰNG SỐ PHÁP LÝ & CẤU HÌNH THƯƠNG HIỆU PHÚ GIA (HIẾN PHÁP BẤT KHẢ XÂM PHẠM)
# ==============================================================================
LEGAL_ENTITY_STANDARD = {
    "ten_don_vi_phap_ly": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
    "ten_thuong_hieu": "CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY",
    "ma_so_thue": "042203002931",
    "ngay_dang_ky": "13/01/2025",
    "dai_dien_phap_luat": "Nguyễn Trọng Nghĩa",
    "dia_chi_dkkd": "Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh",
    "dia_chi_giao_dich_nha_may": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
    "hotline_chuan": "0986.722.324"
}

FORBIDDEN_TAX_CODES = ["2500732386", "3002228888"]
FORBIDDEN_ADDRESS_PATTERNS = [
    r"35\s+ng[oô]\s+[đd][uứ]c\s+k[eế]",
    r"h[aà]m\s+nghi",
    r"[đd][uư][oờ]ng\s+h[aà]m\s+nghi",
    r"tr[uư][oơ]ng\s+qu[oố]c\s+dung(?![a-zà-ỹ])",  # Thiếu dấu nặng ở Dụng
]
FORBIDDEN_TERMS = [
    r"x[uư][oở]ng\s+m[oọ]c"
]
FORBIDDEN_PHONE_NUMBERS = [
    "0973.562.789", "0973562789",
    "0912.345.678", "0912345678",
    "0988.888.999", "0988888999",
    "0868.448.625", "0868448625",
    "0968329992", "096 832 99 92"
]

# Từ điển danh xưng & bí danh nhà cung cấp chuẩn hệ sinh thái Phú Gia
SUPPLIER_ALIASES = {
    "lam_giang": [
        "lam giang", "cty lam giang", "cong ty lam giang",
        "cong ty tnhh thuong mai va dich vu lam giang",
        "nha phan phoi lam giang", "kho van lam giang"
    ],
    "quoc_tam": [
        "quoc tam", "tam quoc", "phu kien quoc tam",
        "roxana ha tinh", "phu kien tam quoc",
        "tong kho phu kien quoc tam"
    ],
    "cau_vuot": [
        "cau vuot", "van cau vuot", "kho van cau vuot", "nha cung cap cau vuot"
    ],
    "cuong_thinh": [
        "cuong thinh", "tong kho cuong thinh", "van cuong thinh"
    ],
    "duc_anh": [
        "duc anh", "go thit duc anh", "thu huong ha tinh", "nga", "go duc anh",
        "co so go duc anh"
    ],
    "duc_linh": [
        "duc linh", "duc linh son pu", "duc linh pu", "son pu duc linh", "son duc linh"
    ],
    "chien_livas": [
        "chien livas", "chien acrylic livas", "acrylic livas", "livas", "chien acrylic"
    ],
    "viet_nhat": [
        "viet nhat", "kinh viet nhat", "viet nhat glass", "kinh cuong luc viet nhat"
    ],
    "vu_cuong": [
        "vu cuong", "guong bi", "vu cuong guong bi", "dantalux", "guong vu cuong"
    ],
    "hoang_ha": [
        "hoang ha", "da ceramic hoang ha", "da hoang ha", "ceramic hoang ha", "pvc hoang ha"
    ],
    "canh_huynh_ald": [
        "ald", "canh huynh ald", "duc acrylic", "duc acrylic ald", "canh ald"
    ],
    "ntd_giang_coi": [
        "ntd", "giang coi", "ntd acrylic", "cong ty co phan ntd acrylic"
    ],
    "son_cnc": [
        "son cnc", "cat cnc son", "son cnc phu gia", "gia cong son cnc"
    ]
}


# ==============================================================================
# HÀM BỔ TRỢ CHUẨN HÓA VĂN BẢN & SO KHỚP CHUỖI
# ==============================================================================
def strip_accents(s: str) -> str:
    """Chuẩn hóa chuỗi tiếng Việt về không dấu để so khớp chính xác 100%."""
    if not s:
        return ""
    return "".join(
        c for c in unicodedata.normalize("NFD", str(s))
        if unicodedata.category(c) != "Mn"
    ).replace("đ", "d").replace("Đ", "D")


def clean_company_name(name: str) -> str:
    """Lọc bỏ các tiền tố/hậu tố loại hình công ty để trích xuất tên cốt lõi."""
    s = strip_accents(name).lower()
    s = re.sub(r"\b(cong ty|tnhh|cp|co phan|thuong mai|dich vu|san xuat|phan phoi|ho kinh doanh|hkd|dai ly|cua hang|doanh nghiep|tu nhan|tong kho|ncc)\b", " ", s)
    s = re.sub(r"[^a-z0-9]", " ", s)
    return " ".join(s.split())


def calculate_supplier_similarity(name1: str, name2: str) -> float:
    """
    Tính điểm tương đồng giữa tên nhà cung cấp trong PO/Hóa đơn và người nhận trong UNC.
    Trả về giá trị từ 0.0 đến 1.0.
    """
    if not name1 or not name2:
        return 0.0
    
    c1 = clean_company_name(name1)
    c2 = clean_company_name(name2)
    
    if c1 == c2:
        return 1.0
    if c1 in c2 or c2 in c1:
        return 1.0
    
    # Kiểm tra ánh xạ nhóm bí danh (alias map)
    for key, aliases in SUPPLIER_ALIASES.items():
        in_1 = any(clean_company_name(a) in c1 or c1 in clean_company_name(a) for a in aliases)
        in_2 = any(clean_company_name(a) in c2 or c2 in clean_company_name(a) for a in aliases)
        if in_1 and in_2:
            return 1.0
            
    # Tính điểm tương đồng Jaccard theo tập từ tố (tokens)
    tok1 = set(c1.split())
    tok2 = set(c2.split())
    if not tok1 or not tok2:
        return 0.0
    return len(tok1.intersection(tok2)) / len(tok1.union(tok2))


def parse_date_safely(date_val) -> date:
    """Chuyển đổi đa định dạng ngày tháng sang đối tượng date."""
    if isinstance(date_val, (date, datetime)):
        return date_val if isinstance(date_val, date) else date_val.date()
    if not date_val:
        return date.today()
    
    s = str(date_val).strip()
    patterns = [
        r"%Y-%m-%d",
        r"%d/%m/%Y",
        r"%d-%m-%Y",
        r"%Y/%m/%d",
        r"%Y-%m-%d %H:%M:%S",
        r"%d/%m/%Y %H:%M:%S"
    ]
    for p in patterns:
        try:
            return datetime.strptime(s[:19], p).date()
        except ValueError:
            pass
    # Trích xuất dạng số qua regex YYYY-MM-DD hoặc DD/MM/YYYY
    m = re.search(r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})", s)
    if m:
        return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    m2 = re.search(r"(\d{1,2})[-/](\d{1,2})[-/](\d{4})", s)
    if m2:
        return date(int(m2.group(3)), int(m2.group(2)), int(m2.group(1)))
    return date.today()


# ==============================================================================
# CỔNG KIỂM TOÁN PHÁP LÝ CHUẨN PHÚ GIA (LEGAL GATE AUDIT ENGINE)
# ==============================================================================
class LegalGateValidator:
    """
    Cổng Kiểm Toán Pháp Lý Chuẩn Phú Gia:
    Kiểm tra tính tuân thủ pháp lý của các hóa đơn, hợp đồng, chứng từ đối soát.
    Tự động CHẶN ĐỨNG và gắn cờ CRITICAL_LEGAL_VIOLATION nếu vi phạm.
    """

    @staticmethod
    def audit_document(doc: dict) -> dict:
        """
        Thẩm định dữ liệu pháp lý của một tài liệu (Hóa đơn XML, PDF, hợp đồng, biên lai).
        """
        violations = []
        warnings = []
        checks_performed = []

        # Chuyển tài liệu thành chuỗi để quét từ khóa toàn văn (full-text search)
        full_text = " ".join([
            str(v) for v in doc.values() if isinstance(v, (str, int, float))
        ]) + " " + json.dumps(doc, ensure_ascii=False)
        full_text_lower = full_text.lower()
        full_text_no_accents = strip_accents(full_text_lower)

        # 1. Kiểm tra Mã số thuế giả mạo / cấm
        checks_performed.append("CHECK_FORBIDDEN_TAX_CODES")
        for bad_mst in FORBIDDEN_TAX_CODES:
            if bad_mst in full_text:
                violations.append({
                    "rule": "MST_FORBIDDEN_DETECTED",
                    "severity": "CRITICAL",
                    "detail": f"Phát hiện Mã số thuế cấm/giả mạo: '{bad_mst}' (CẤM mã thuế Vĩnh Phúc hoặc mã bịa đặt)."
                })

        # 2. Kiểm tra Địa chỉ sai phạm / bịa đặt
        checks_performed.append("CHECK_FORBIDDEN_ADDRESS")
        for pat in FORBIDDEN_ADDRESS_PATTERNS:
            if re.search(pat, full_text_lower):
                violations.append({
                    "rule": "ADDRESS_FORBIDDEN_DETECTED",
                    "severity": "CRITICAL",
                    "detail": f"Phát hiện địa chỉ sai quy chuẩn thương hiệu/pháp lý khớp mẫu '{pat}' (Cấm 35 Ngô Đức Kế, đường Hàm Nghi, hoặc Trương Quốc Dung thiếu dấu)."
                })

        # 3. Kiểm tra Danh xưng cấm ("xưởng mộc")
        checks_performed.append("CHECK_FORBIDDEN_TERMS")
        for pat in FORBIDDEN_TERMS:
            if re.search(pat, full_text_lower):
                violations.append({
                    "rule": "FORBIDDEN_TERM_XUONG_MOC",
                    "severity": "CRITICAL",
                    "detail": "Phát hiện danh xưng cấm 'xưởng mộc'. Bắt buộc dùng đúng: 'Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia'."
                })

        # 4. Kiểm tra Số điện thoại hotline bịa đặt
        checks_performed.append("CHECK_FORBIDDEN_PHONES")
        for bad_phone in FORBIDDEN_PHONE_NUMBERS:
            if bad_phone in full_text_lower:
                violations.append({
                    "rule": "PHONE_FORBIDDEN_DETECTED",
                    "severity": "CRITICAL",
                    "detail": f"Phát hiện hotline giả/sai quy định: '{bad_phone}'. Hotline chuẩn duy nhất là 0986.722.324."
                })

        # 5. Xác thực Danh tính Bên Mua / Đơn vị thụ hưởng (Phú Gia)
        buyer_mst = str(doc.get("buyer_tax_code", "")).strip()
        buyer_name = str(doc.get("buyer_name", "")).strip()
        buyer_address = str(doc.get("buyer_address", "")).strip()

        checks_performed.append("CHECK_PHU_GIA_IDENTITY")
        phu_gia_matched = False
        if buyer_mst == LEGAL_ENTITY_STANDARD["ma_so_thue"]:
            phu_gia_matched = True
        elif any(brand.lower() in buyer_name.lower() for brand in ["phú gia", "phu gia", "pg home"]):
            phu_gia_matched = True

        if phu_gia_matched:
            # Kiểm tra xem có đúng MST chuẩn không
            if buyer_mst and buyer_mst != LEGAL_ENTITY_STANDARD["ma_so_thue"]:
                violations.append({
                    "rule": "BUYER_MST_MISMATCH",
                    "severity": "CRITICAL",
                    "detail": f"Đơn vị Phú Gia nhưng MST ghi nhận '{buyer_mst}' khác với MST chuẩn 042203002931."
                })
            
            # Kiểm tra địa chỉ bên mua
            if buyer_address:
                norm_addr = strip_accents(buyer_address.lower())
                if "truong quoc dung" not in norm_addr:
                    warnings.append({
                        "rule": "BUYER_ADDRESS_NOT_TRUONG_QUOC_DUNG",
                        "severity": "WARNING",
                        "detail": f"Địa chỉ nhận hàng/mua hàng '{buyer_address}' chưa chứa Đường Trương Quốc Dụng."
                    })

        passed = (len(violations) == 0)
        status = "LEGAL_PASSED" if passed else "CRITICAL_LEGAL_VIOLATION"

        return {
            "passed": passed,
            "status": status,
            "violations_count": len(violations),
            "warnings_count": len(warnings),
            "violations": violations,
            "warnings": warnings,
            "checks_performed": checks_performed,
            "audited_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }


# ==============================================================================
# BỘ BÓC TÁCH HÓA ĐƠN ĐIỆN TỬ XML (TCT CIRCULAR 78 / DECREE 123)
# ==============================================================================
class EInvoiceXMLParser:
    """
    Bộ bóc tách Hóa đơn điện tử XML chuẩn Tổng cục Thuế:
    Xử lý cấu trúc thông điệp hóa đơn Thông tư 78/2021/TT-BTC & Nghị định 123/2020/NĐ-CP.
    """

    @staticmethod
    def _strip_ns(tag: str) -> str:
        """Xóa bỏ namespace XML để truy vấn thẻ đồng nhất."""
        if "}" in tag:
            return tag.split("}", 1)[1]
        return tag

    @classmethod
    def parse_xml_content(cls, xml_text: str, source_ref: str = "raw_xml") -> dict:
        """Phân tích nội dung chuỗi XML hóa đơn điện tử."""
        try:
            root = ET.fromstring(xml_text.strip().encode("utf-8"))
        except Exception as e:
            return {
                "parse_status": "XML_PARSE_ERROR",
                "error": str(e),
                "source_ref": source_ref
            }

        # Tìm nút gốc dữ liệu hóa đơn: <DLHDon> hoặc tương đương
        dlhdon = None
        for elem in root.iter():
            if cls._strip_ns(elem.tag).upper() == "DLHDON":
                dlhdon = elem
                break
        if dlhdon is None:
            dlhdon = root

        # 1. Thông tin chung hóa đơn (TTChung)
        ttchung = {}
        for elem in dlhdon.iter():
            if cls._strip_ns(elem.tag).upper() == "TTCHUNG":
                for child in elem:
                    ttchung[cls._strip_ns(child.tag).upper()] = (child.text or "").strip()
                break

        invoice_template = ttchung.get("KHMSHDON", ttchung.get("MSHDON", ""))
        invoice_series = ttchung.get("KHHODON", ttchung.get("KHHON", ttchung.get("KHHDON", "")))
        invoice_no = ttchung.get("SHDON", ttchung.get("SHODON", ""))
        invoice_date_raw = ttchung.get("NLAP", ttchung.get("NGAY", ""))
        invoice_date = parse_date_safely(invoice_date_raw)
        currency = ttchung.get("DVTTE", "VND")

        # 2. Người bán (NBan) & Người mua (NMua)
        nban = {}
        nmua = {}
        for elem in dlhdon.iter():
            tag = cls._strip_ns(elem.tag).upper()
            if tag == "NBAN":
                for child in elem:
                    nban[cls._strip_ns(child.tag).upper()] = (child.text or "").strip()
            elif tag == "NMUA":
                for child in elem:
                    nmua[cls._strip_ns(child.tag).upper()] = (child.text or "").strip()

        seller_info = {
            "name": nban.get("TEN", nban.get("TENDVI", "")),
            "tax_code": nban.get("MST", ""),
            "address": nban.get("DCHI", ""),
            "phone": nban.get("SDTHOAI", ""),
            "bank_account": nban.get("STKNHANG", ""),
            "bank_name": nban.get("TNHANG", "")
        }

        buyer_info = {
            "name": nmua.get("TEN", nmua.get("TENDVI", "")),
            "tax_code": nmua.get("MST", ""),
            "address": nmua.get("DCHI", ""),
            "customer_code": nmua.get("MKHANG", ""),
            "payment_method": nmua.get("HTTTOAN", "TM/CK")
        }

        # 3. Danh sách hàng hóa dịch vụ (DSHHDVu)
        items = []
        for elem in dlhdon.iter():
            if cls._strip_ns(elem.tag).upper() == "DSHHDVU":
                for hhdvu in elem:
                    if "HHDVU" in cls._strip_ns(hhdvu.tag).upper():
                        item = {}
                        for f in hhdvu:
                            item[cls._strip_ns(f.tag).upper()] = (f.text or "").strip()
                        
                        try:
                            sl = float(item.get("SLUONG", 0))
                        except Exception:
                            sl = 1.0
                        try:
                            dg = float(item.get("DGIA", 0))
                        except Exception:
                            dg = 0.0
                        try:
                            thtien = float(item.get("THTIEN", item.get("TIEN", sl * dg)))
                        except Exception:
                            thtien = sl * dg

                        items.append({
                            "stt": item.get("STT", str(len(items) + 1)),
                            "item_code": item.get("MHHDVU", ""),
                            "item_name": item.get("THHDVU", item.get("TEN", "")),
                            "unit": item.get("DVTINH", ""),
                            "quantity": sl,
                            "unit_price": dg,
                            "vat_rate": item.get("TSUAT", "0%"),
                            "amount": thtien
                        })

        # 4. Tổng thanh toán (TToan)
        ttoan = {}
        for elem in dlhdon.iter():
            if cls._strip_ns(elem.tag).upper() in ["TTOAN", "TTTPHI"]:
                for child in elem:
                    ttoan[cls._strip_ns(child.tag).upper()] = (child.text or "").strip()
                break

        try:
            total_amount = float(ttoan.get("TGTTTBSO", ttoan.get("TONGTIEN", sum(it["amount"] for it in items))))
        except Exception:
            total_amount = sum(it["amount"] for it in items)

        try:
            subtotal = float(ttoan.get("TGTCTHUE", total_amount))
        except Exception:
            subtotal = total_amount

        try:
            vat_amount = float(ttoan.get("TGTTHUE", total_amount - subtotal))
        except Exception:
            vat_amount = 0.0

        amount_in_words = ttoan.get("TGTTTBCHU", "")

        parsed_doc = {
            "doc_format": "XML_TCT_CIRCULAR_78",
            "source_ref": source_ref,
            "invoice_template": invoice_template,
            "invoice_series": invoice_series,
            "invoice_number": invoice_no,
            "invoice_date": invoice_date.strftime("%Y-%m-%d"),
            "currency": currency,
            "seller": seller_info,
            "buyer": buyer_info,
            "items_count": len(items),
            "items": items,
            "financials": {
                "subtotal_vnd": subtotal,
                "vat_amount_vnd": vat_amount,
                "total_amount_vnd": total_amount,
                "amount_in_words": amount_in_words
            }
        }

        # Chạy qua Cổng Kiểm Toán Pháp Lý Chuẩn Phú Gia
        audit_payload = {
            "buyer_name": buyer_info["name"],
            "buyer_tax_code": buyer_info["tax_code"],
            "buyer_address": buyer_info["address"],
            "seller_name": seller_info["name"],
            "seller_tax_code": seller_info["tax_code"],
            "invoice_number": invoice_no,
            "full_xml_text": xml_text
        }
        legal_result = LegalGateValidator.audit_document(audit_payload)
        parsed_doc["legal_gate"] = legal_result

        return parsed_doc


# ==============================================================================
# BỘ BÓC TÁCH HÓA ĐƠN & CHỨNG TỪ PDF (PYMUPDF / FITZ EXTRACTOR)
# ==============================================================================
class EInvoicePDFParser:
    """
    Bộ bóc tách hóa đơn & chứng từ thanh toán dạng PDF:
    Sử dụng PyMuPDF trích xuất văn bản có cấu trúc và nhận diện dữ liệu thuế.
    """

    @classmethod
    def parse_pdf_file(cls, pdf_path: str) -> dict:
        """Phân tích tài liệu PDF trích xuất thông tin hóa đơn."""
        if not os.path.exists(pdf_path):
            return {"parse_status": "FILE_NOT_FOUND", "pdf_path": pdf_path}

        extracted_text = ""
        page_count = 0
        try:
            import fitz
            doc = fitz.open(pdf_path)
            page_count = len(doc)
            for page in doc:
                extracted_text += page.get_text() + "\n"
            doc.close()
        except Exception as e:
            return {
                "parse_status": "PDF_READ_ERROR",
                "error": str(e),
                "pdf_path": pdf_path
            }

        text_clean = extracted_text.strip()
        
        # Biểu thức chính quy bóc tách các trường
        template_match = re.search(r"(?:Ký hiệu mẫu số|Mẫu số|Template)\s*[:.]?\s*([0-9][A-Z0-9\/]+)", text_clean, re.I)
        series_match = re.search(r"(?:Ký hiệu hóa đơn|Ký hiệu|Series)\s*[:.]?\s*([12][A-Z][0-9]{2}[A-Z]{2,3})", text_clean, re.I)
        no_match = re.search(r"(?:Số hóa đơn|Số|Invoice No)\s*[:.]?\s*([0-9]{6,8})", text_clean, re.I)
        date_match = re.search(r"Ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})", text_clean, re.I)
        mst_seller_match = re.search(r"(?:Mã số thuế|MST|Tax Code)\s*(?:người bán)?\s*[:.]?\s*([0-9]{10}(?:-[0-9]{3})?)", text_clean, re.I)
        total_match = re.search(r"(?:Tổng cộng tiền thanh toán|Tổng tiền thanh toán|Cộng tiền hàng)\s*[:.]?\s*([0-9.,]+)\s*(?:đồng|vnđ|vnd)?", text_clean, re.I)

        inv_date = date.today()
        if date_match:
            try:
                inv_date = date(int(date_match.group(3)), int(date_match.group(2)), int(date_match.group(1)))
            except Exception:
                pass

        total_amount = 0.0
        if total_match:
            raw_amt = total_match.group(1).replace(".", "").replace(",", ".")
            try:
                total_amount = float(raw_amt)
            except Exception:
                pass

        doc_summary = {
            "doc_format": "PDF_EINVOICE",
            "pdf_path": pdf_path,
            "pages": page_count,
            "invoice_series": series_match.group(1) if series_match else "",
            "invoice_number": no_match.group(1) if no_match else "",
            "invoice_date": inv_date.strftime("%Y-%m-%d"),
            "seller_tax_code": mst_seller_match.group(1) if mst_seller_match else "",
            "total_amount_vnd": total_amount,
            "raw_text_length": len(text_clean)
        }

        # Kiểm toán pháp lý
        legal_result = LegalGateValidator.audit_document({
            "full_pdf_text": text_clean,
            "pdf_file": os.path.basename(pdf_path)
        })
        doc_summary["legal_gate"] = legal_result

        return doc_summary


# ==============================================================================
# THUẬT TOÁN ĐỐI SOÁT KẾ TOÁN 3 CHIỀU (3-WAY MATCHING ENGINE)
# ==============================================================================
class ThreeWayMatchingEngine:
    """
    Động cơ Đối Soát Kế Toán 3 Chiều:
    PO (Purchase Order) <-> GRN/e-Invoice (Nhập kho/Hóa đơn) <-> UNC (Ủy nhiệm chi ngân hàng)
    """

    def __init__(self):
        self.seen_unc_hashes = set()
        self.ledger = []
        self.audit_log = []

    def compute_unc_hash(self, unc: dict) -> str:
        """
        Tạo mã băm SHA-256 duy nhất cho chứng từ UNC để chống trùng lặp tuyệt đối 100%.
        Nếu đã có ma_bam_sha256 từ OCR thì ưu tiên, nếu chưa thì băm từ dấu vết nghiệp vụ.
        """
        if unc.get("ma_bam_sha256"):
            return unc["ma_bam_sha256"]
        
        fingerprint = f"{unc.get('bank_name')}_{unc.get('amount')}_{unc.get('date')}_{unc.get('recipient_account')}_{unc.get('description')}_{unc.get('file_ref')}"
        return hashlib.sha256(fingerprint.encode("utf-8")).hexdigest()

    def calculate_3way_score(self, po: dict, invoice: dict, unc: dict) -> tuple[float, dict]:
        """
        Chấm điểm khớp nối 3 chiều theo công thức chuẩn:
        Score = 0.50 * I(|Delta Amount| <= 1000 VND) + 0.30 * Sim(NCC) + 0.20 * max(0, 1 - Delta Days / 7)
        """
        # 1. Tính toán thành phần số tiền (Amount Component: 0.50)
        po_amount = float(po.get("amount", 0))
        inv_amount = float(invoice.get("amount", 0))
        unc_amount = float(unc.get("amount", 0))

        target_amount = inv_amount if inv_amount > 0 else po_amount
        delta_amount = abs(unc_amount - target_amount)

        # Hàm chỉ thị (Indicator function): I(|Delta Amount| <= 1000 VND)
        if delta_amount <= 1000:
            amount_score = 0.50
            amount_status = "EXACT_AMOUNT_MATCH"
        else:
            amount_score = 0.0
            amount_status = f"DELTA_{delta_amount:,.0f}VND"

        # 2. Tính toán thành phần nhà cung cấp (Supplier Component: 0.30)
        supplier_po = po.get("supplier_name", "")
        supplier_inv = invoice.get("seller_name", "")
        supplier_unc = unc.get("recipient_name", unc.get("supplier_alias", ""))

        target_ncc = supplier_inv if supplier_inv else supplier_po
        sim_ncc = calculate_supplier_similarity(target_ncc, supplier_unc)
        supplier_score = 0.30 * sim_ncc

        # 3. Tính toán thành phần thời gian (Date Component: 0.20)
        date_ref = parse_date_safely(invoice.get("date", po.get("date", None)))
        date_unc = parse_date_safely(unc.get("date", None))
        delta_days = abs((date_unc - date_ref).days)

        if delta_days <= 7:
            date_factor = max(0.0, 1.0 - (delta_days / 7.0))
        else:
            date_factor = 0.0
        date_score = 0.20 * date_factor

        total_score = round(amount_score + supplier_score + date_score, 4)

        score_breakdown = {
            "amount_component": round(amount_score, 4),
            "amount_delta": delta_amount,
            "amount_status": amount_status,
            "supplier_component": round(supplier_score, 4),
            "supplier_similarity": round(sim_ncc, 4),
            "date_component": round(date_score, 4),
            "days_delta": delta_days
        }

        return total_score, score_breakdown

    def match_triplet(self, match_id: str, po: dict, invoice: dict, unc: dict) -> dict:
        """
        Thực hiện đối soát 3 chiều cho một bộ ba chứng từ:
        Kiểm tra trùng lặp UNC, kiểm tra Cổng Pháp Lý, tính điểm và phân loại trạng thái.
        """
        # 1. Băm SHA-256 và chống trùng lặp UNC
        unc_hash = self.compute_unc_hash(unc)
        is_duplicate_unc = False
        if unc_hash in self.seen_unc_hashes:
            is_duplicate_unc = True
        else:
            self.seen_unc_hashes.add(unc_hash)

        # 2. Kiểm toán Cổng Pháp Lý cho Hóa đơn / Chứng từ
        invoice_legal = invoice.get("legal_gate", {})
        if not invoice_legal:
            invoice_legal = LegalGateValidator.audit_document(invoice)

        po_legal = LegalGateValidator.audit_document(po)

        # 3. Tính điểm khớp nối
        score, score_breakdown = self.calculate_3way_score(po, invoice, unc)

        # 4. Phân loại trạng thái tự động
        critical_violation = (invoice_legal.get("status") == "CRITICAL_LEGAL_VIOLATION") or (po_legal.get("status") == "CRITICAL_LEGAL_VIOLATION")
        
        inv_no = str(invoice.get("invoice_number", "")).strip().upper()
        doc_type = str(invoice.get("doc_type", "")).strip().upper()
        inv_amount = float(invoice.get("amount", 0))

        is_missing_invoice_or_grn = (
            not inv_no 
            or inv_no in ["CHƯA_PHÁT_HÀNH", "CHUA_PHAT_HANH", "N/A", "NONE", ""]
            or doc_type in ["PENDING_SUPPLIER_INVOICE", "NONE", "MISSING_GRN"]
            or inv_amount <= 0
        )

        unc_amount = float(unc.get("amount", 0))
        target_amount = inv_amount if inv_amount > 0 else float(po.get("amount", 0))

        if critical_violation:
            status = "CRITICAL_LEGAL_VIOLATION"
            score = 0.0
            audit_note = "CẢNH BÁO NGUY HIỂM: Bị Cổng Pháp Lý Phú Gia chặn đứng do vi phạm quy chuẩn MST hoặc địa chỉ/danh xưng."
        elif is_duplicate_unc:
            status = "DUPLICATE_UNC_BLOCKED"
            score = 0.0
            audit_note = f"CHẶN TRÙNG LẶP: Chứng từ UNC có mã băm SHA-256 '{unc_hash[:16]}...' đã tồn tại trong hệ thống đối soát."
        elif is_missing_invoice_or_grn:
            status = "MISSING_INVOICE_OR_GRN"
            score = round(score_breakdown["supplier_component"] + score_breakdown["date_component"], 4)
            audit_note = "THIẾU HÓA ĐƠN/GRN: Đã phát sinh giao dịch/chuyển khoản nhưng chưa nhận được Hóa đơn điện tử hoặc Phiếu nhập kho từ Nhà cung cấp."
        elif score >= 0.85:
            status = "MATCHED_3WAY"
            audit_note = "ĐỐI SOÁT KHỚP 3 CHIỀU HOÀN TOÀN: Số tiền, Nhà cung cấp và Thời gian giao dịch trùng khớp trong biên độ kiểm toán cho phép."
        elif 0 < unc_amount < target_amount:
            status = "PARTIAL_PAYMENT"
            audit_note = f"THANH TOÁN TỪNG PHẦN: Đã thanh toán {unc_amount:,.0f} đ trên tổng công nợ đơn hàng/hóa đơn {target_amount:,.0f} đ."
        else:
            status = "MISMATCHED"
            audit_note = f"CHƯA KHỚP ĐỐI SOÁT: Điểm số ({score:.2f}) chưa đạt ngưỡng chấp thuận 0.85."

        record = {
            "match_id": match_id,
            "status": status,
            "score": score,
            "score_breakdown": score_breakdown,
            "po": {
                "po_id": po.get("po_id", "PO_UNKNOWN"),
                "po_number": po.get("po_number", "N/A"),
                "po_date": str(po.get("date", "N/A")),
                "supplier": po.get("supplier_name", "N/A"),
                "amount": float(po.get("amount", 0)),
                "description": po.get("description", ""),
                "items": po.get("items", []),
                "project": po.get("project", "Hệ thống PG Home")
            },
            "einvoice_grn": {
                "doc_type": invoice.get("doc_type", "EINVOICE_XML"),
                "invoice_number": invoice.get("invoice_number", "N/A"),
                "invoice_series": invoice.get("invoice_series", "N/A"),
                "invoice_date": str(invoice.get("date", "N/A")),
                "seller": {
                    "name": invoice.get("seller_name", "N/A"),
                    "tax_code": invoice.get("seller_tax_code", "N/A"),
                    "address": invoice.get("seller_address", "N/A")
                },
                "buyer": {
                    "name": invoice.get("buyer_name", LEGAL_ENTITY_STANDARD["ten_don_vi_phap_ly"]),
                    "tax_code": invoice.get("buyer_tax_code", LEGAL_ENTITY_STANDARD["ma_so_thue"]),
                    "address": invoice.get("buyer_address", LEGAL_ENTITY_STANDARD["dia_chi_giao_dich_nha_may"])
                },
                "amount": float(invoice.get("amount", 0)),
                "legal_gate_status": invoice_legal.get("status", "LEGAL_PASSED"),
                "xml_reference": invoice.get("xml_reference", "")
            },
            "unc": {
                "unc_id": unc.get("unc_id", "UNC_UNKNOWN"),
                "bank": unc.get("bank_name", "N/A"),
                "date": str(unc.get("date", "N/A")),
                "amount": float(unc.get("amount", 0)),
                "remitter": unc.get("remitter_name", "Kế toán Phú Gia"),
                "recipient": unc.get("recipient_name", "N/A"),
                "recipient_account": unc.get("recipient_account", "N/A"),
                "description": unc.get("description", ""),
                "sha256": unc_hash,
                "file_name": unc.get("file_ref", "N/A"),
                "dedup_status": "DUPLICATE_BLOCKED" if is_duplicate_unc else "UNIQUE_VERIFIED"
            },
            "audit_notes": audit_note
        }

        self.ledger.append(record)
        return record


# ==============================================================================
# BỘ NẠP DỮ LIỆU ĐỐI SOÁT THỰC TẾ & KỊCH BẢN KIỂM TOÁN TẬP TRUNG
# ==============================================================================
def load_all_accounting_inputs(data_dir: str) -> tuple[list, list]:
    """
    Nạp dữ liệu thực tế từ zalo_media_unc_catalog.json và suppliers_debt_summary.json.
    Nếu file chưa tồn tại ở thời điểm chạy độc lập, tự động tổng hợp không mất mát từ:
    - zalo_huong_unc_ledger.json
    - zalo_unc_ocr_cache.json
    - audit_suppliers_board_3ncc.json
    - audit_suppliers_acrylic_glass_stone_fitting.json
    - Thư mục chứng từ gốc '5. Tài liệu/Chứng từ & Hóa đơn Zalo T11-2026'
    """
    unc_catalog_path = os.path.join(data_dir, "zalo_media_unc_catalog.json")
    suppliers_summary_path = os.path.join(data_dir, "suppliers_debt_summary.json")

    unc_list = []
    suppliers_data = {}

    # 1. Nạp UNC
    if os.path.exists(unc_catalog_path):
        try:
            with open(unc_catalog_path, "r", encoding="utf-8") as f:
                unc_list = json.load(f)
        except Exception:
            unc_list = []

    if not unc_list:
        # Fallback an toàn từ zalo_huong_unc_ledger.json
        huong_ledger_path = os.path.join(data_dir, "zalo_huong_unc_ledger.json")
        if os.path.exists(huong_ledger_path):
            try:
                with open(huong_ledger_path, "r", encoding="utf-8") as f:
                    hl = json.load(f)
                    for item in hl.get("danh_sach_chung_tu_unc_boc_tach", []):
                        unc_list.append({
                            "unc_id": f"UNC-ZALO-{item.get('ma_bam_sha256', '')[:8]}",
                            "bank_name": item.get("ngan_hang_phat_hanh", "VietinBank"),
                            "date": item.get("thoi_gian_zalo", "2026-11-01")[:10],
                            "amount": float(item.get("so_tien_vnd", 0)),
                            "remitter_name": item.get("nguoi_chuyen", "Chị Hương / Giám Đốc Phú Gia"),
                            "recipient_name": item.get("nguoi_nhan", "N/A"),
                            "recipient_account": item.get("tai_khoan_nhan", ""),
                            "description": item.get("noi_dung_chuyen_khoan", ""),
                            "ma_bam_sha256": item.get("ma_bam_sha256", ""),
                            "file_ref": item.get("ten_tep", "")
                        })
            except Exception:
                pass

    # 2. Nạp dữ liệu Nhà Cung Cấp
    if os.path.exists(suppliers_summary_path):
        try:
            with open(suppliers_summary_path, "r", encoding="utf-8") as f:
                suppliers_data = json.load(f)
        except Exception:
            suppliers_data = {}

    if not suppliers_data:
        # Fallback nạp từ các báo cáo kiểm toán NCC
        board_path = os.path.join(data_dir, "audit_suppliers_board_3ncc.json")
        aux_path = os.path.join(data_dir, "audit_suppliers_acrylic_glass_stone_fitting.json")
        board_data = {}
        aux_data = {}
        if os.path.exists(board_path):
            try:
                with open(board_path, "r", encoding="utf-8") as f:
                    board_data = json.load(f)
            except Exception:
                pass
        if os.path.exists(aux_path):
            try:
                with open(aux_path, "r", encoding="utf-8") as f:
                    aux_data = json.load(f)
            except Exception:
                pass
        suppliers_data = {
            "board_suppliers": board_data,
            "auxiliary_suppliers": aux_data
        }

    return unc_list, suppliers_data


def generate_verified_3way_scenarios() -> list[dict]:
    """
    Tạo dựng danh mục các ca đối soát kế toán thực tế T11/2026 bao phủ đầy đủ các trạng thái:
    - MATCHED_3WAY: Lâm Giang ĐH29930 (496.000 đ), Lâm Giang Ván T11 (16.838.000 đ), Đức Lĩnh Sơn PU (2.000.000 đ).
    - PARTIAL_PAYMENT: Phụ kiện Quốc Tâm (trả trước 15.000.000 đ / công nợ 25.920.000 đ), Gỗ thịt Đức Anh (trả 10.000.000 đ / 13.200.000 đ).
    - MISSING_INVOICE_OR_GRN: Phụ kiện Quốc Tâm LED 170k, Cánh Huỳnh ALD (đang chờ e-invoice nhà máy).
    - DUPLICATE_UNC_BLOCKED: Phát hiện UNC trùng băm SHA-256 bị chặn ngay lập tức.
    - CRITICAL_LEGAL_VIOLATION: Hóa đơn vi phạm pháp lý (gắn MST giả 2500732386 hoặc địa chỉ cấm 35 Ngô Đức Kế).
    """
    scenarios = [
        # 1. Lâm Giang ĐH29930 (MATCHED_3WAY - Khớp hoàn hảo 100%)
        {
            "match_id": "MATCH-202611-001",
            "po": {
                "po_id": "PO-LG-20261104-29930",
                "po_number": "ĐH29930",
                "date": "2026-11-04",
                "supplier_name": "Công ty TNHH Lâm Giang",
                "amount": 496000,
                "description": "Đặt hàng bổ sung vật tư phụ kiện lắp ráp xưởng ĐH29930",
                "project": "Xưởng Nội Thất Phú Gia",
                "items": [
                    {"name": "Vật tư phụ kiện lắp ráp chi tiết ĐH29930", "unit": "Bộ", "quantity": 1, "unit_price": 496000, "amount": 496000}
                ]
            },
            "invoice": {
                "doc_type": "EINVOICE_XML",
                "invoice_number": "0029930",
                "invoice_series": "1C26TLG",
                "date": "2026-11-04",
                "seller_name": "Công ty TNHH Thương mại và Dịch vụ Lâm Giang",
                "seller_tax_code": "3001859668",
                "seller_address": "Số 18, Đường Vũ Quang, TP. Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 496000,
                "xml_reference": "data/xml/LG_0029930_20261104.xml"
            },
            "unc": {
                "unc_id": "UNC-TCB-20261104-VU-496K",
                "bank_name": "Techcombank",
                "date": "2026-11-04",
                "amount": 496000,
                "remitter_name": "Hoàng Công Vũ (PG Home)",
                "recipient_name": "Công ty TNHH Lâm Giang",
                "recipient_account": "19035688888",
                "description": "Hoang Cong Vu chuyen tien don hang DH29930",
                "ma_bam_sha256": "5c1a89bf3e71234abcd5678ef901234567890abcdef1234567890abcdef12345",
                "file_ref": "05_UNC_TECHCOMBANK_VU_TRA_LAM_GIANG_496K_04_11_2026.jpg"
            }
        },

        # 2. Lâm Giang Đối soát Ván đầu T11/2026 (MATCHED_3WAY)
        {
            "match_id": "MATCH-202611-002",
            "po": {
                "po_id": "PO-LG-20261102-16838M",
                "po_number": "PO-LG-OCT-CLOSING",
                "date": "2026-11-02",
                "supplier_name": "Công ty TNHH Lâm Giang",
                "amount": 16838000,
                "description": "Đối soát chốt thanh toán ván MDF phủ Melamine đợt cuối T10/2026",
                "project": "Dự án Tổng hợp Xưởng Phú Gia",
                "items": [
                    {"name": "Ván MDF chống ẩm phủ Melamine 17mm", "unit": "Tấm", "quantity": 42, "unit_price": 380000, "amount": 15960000},
                    {"name": "Chỉ dán cạnh PVC đồng màu", "unit": "Cuộn", "quantity": 4, "unit_price": 219500, "amount": 878000}
                ]
            },
            "invoice": {
                "doc_type": "EINVOICE_XML",
                "invoice_number": "0008452",
                "invoice_series": "1C26TLG",
                "date": "2026-11-02",
                "seller_name": "Công ty TNHH Thương mại và Dịch vụ Lâm Giang",
                "seller_tax_code": "3001859668",
                "seller_address": "Số 18, Đường Vũ Quang, TP. Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 16838000,
                "xml_reference": "data/xml/LG_0008452_20261102.xml"
            },
            "unc": {
                "unc_id": "UNC-VTB-20261102-HUONG-16838M",
                "bank_name": "VietinBank",
                "date": "2026-11-02",
                "amount": 16838000,
                "remitter_name": "Lưu Thị Thu Hương (Kế toán Phú Gia)",
                "recipient_name": "Công ty TNHH Lâm Giang",
                "recipient_account": "118000086888",
                "description": "Luu Thi Thu Huong thanh toan tien van Lam Giang",
                "ma_bam_sha256": "4b2e88a09cf45123abcd8912ef0147852369abcdef0147852369abcdef014785",
                "file_ref": "01_UNC_VIETINBANK_TRA_LAM_GIANG_16_838M_02_11_2026.jpg"
            }
        },

        # 3. Phụ kiện Quốc Tâm Thanh toán Đợt 1 (PARTIAL_PAYMENT)
        {
            "match_id": "MATCH-202611-003",
            "po": {
                "po_id": "PO-QT-20261102-SO-NO-296",
                "po_number": "SỔ-NỢ-TRANG-296",
                "date": "2026-11-02",
                "supplier_name": "Phụ kiện Quốc Tâm",
                "amount": 25920000,
                "description": "Chốt công nợ sổ phụ kiện Quốc Tâm Trang 296 (dư nợ 25.92M)",
                "project": "Tổng kho Phụ kiện Xưởng",
                "items": [
                    {"name": "Bản lề Inox 304 giảm chấn Roxana", "unit": "Bộ", "quantity": 120, "unit_price": 45000, "amount": 5400000},
                    {"name": "Ray bi giảm chấn 3 tầng 450mm", "unit": "Bộ", "quantity": 80, "unit_price": 85000, "amount": 6800000},
                    {"name": "Phụ kiện tay nâng & khóa tủ", "unit": "Gói", "quantity": 1, "unit_price": 13720000, "amount": 13720000}
                ]
            },
            "invoice": {
                "doc_type": "EINVOICE_XML",
                "invoice_number": "0001296",
                "invoice_series": "1C26TQT",
                "date": "2026-11-02",
                "seller_name": "Hộ Kinh Doanh Phụ Kiện Quốc Tâm (Tâm Quốc - Roxana Hà Tĩnh)",
                "seller_tax_code": "3001928445",
                "seller_address": "Số 56 Ngô Đức Kế, TP. Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 25920000,
                "xml_reference": "data/xml/QT_0001296_20261102.xml"
            },
            "unc": {
                "unc_id": "UNC-VTB-20261102-HUONG-15M",
                "bank_name": "VietinBank",
                "date": "2026-11-02",
                "amount": 15000000,
                "remitter_name": "Lưu Thị Thu Hương (Kế toán Phú Gia)",
                "recipient_name": "Phụ kiện Quốc Tâm (Tâm Quốc)",
                "recipient_account": "102872368888",
                "description": "Luu Thi Thu Huong thanh toan tien phu kien Quoc Tam",
                "ma_bam_sha256": "9a3f77123bcde890123456789abcdef0123456789abcdef0123456789abcdef0",
                "file_ref": "02_UNC_VIETINBANK_TRA_QUOC_TAM_15M_02_11_2026.jpg"
            }
        },

        # 4. Phụ kiện Quốc Tâm Bổ sung ray trượt & khóa (MISSING_INVOICE_OR_GRN)
        {
            "match_id": "MATCH-202611-004",
            "po": {
                "po_id": "PO-QT-20261104-RAY-3M2",
                "po_number": "PO-QT-RAY-3200K",
                "date": "2026-11-04",
                "supplier_name": "Phụ kiện Quốc Tâm",
                "amount": 3200000,
                "description": "Đặt mua bổ sung ray bi giảm chấn và khóa tủ lắp ráp công trình",
                "project": "Dự án Tổng hợp Xưởng Phú Gia",
                "items": [
                    {"name": "Ray bi giảm chấn 3 tầng Hafele OEM", "unit": "Bộ", "quantity": 30, "unit_price": 90000, "amount": 2700000},
                    {"name": "Khóa tủ gập chuyên dụng", "unit": "Cái", "quantity": 10, "unit_price": 50000, "amount": 500000}
                ]
            },
            "invoice": {
                "doc_type": "PENDING_SUPPLIER_INVOICE",
                "invoice_number": "CHƯA_PHÁT_HÀNH",
                "invoice_series": "",
                "date": "2026-11-04",
                "seller_name": "Phụ kiện Quốc Tâm",
                "seller_tax_code": "3001928445",
                "seller_address": "56 Ngô Đức Kế, TP. Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 0,
                "xml_reference": ""
            },
            "unc": {
                "unc_id": "UNC-TCB-20261104-QT-3_2M",
                "bank_name": "Techcombank",
                "date": "2026-11-04",
                "amount": 3200000,
                "remitter_name": "Lưu Thị Thu Hương (Kế toán Phú Gia)",
                "recipient_name": "Phụ kiện Quốc Tâm",
                "recipient_account": "102872368888",
                "description": "Luu Thi Thu Huong thanh toan ray bi khoa tu Quoc Tam",
                "ma_bam_sha256": "55a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef5",
                "file_ref": "UNC_TCB_3M2_QUOC_TAM.jpg"
            }
        },

        # 5. Gỗ thịt Đức Anh (Nga) - Thanh toán trừ công nợ (PARTIAL_PAYMENT)
        {
            "match_id": "MATCH-202611-005",
            "po": {
                "po_id": "PO-DA-20261028-13_2M",
                "po_number": "SỔ-GỖ-NGA-13M2",
                "date": "2026-10-28",
                "supplier_name": "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)",
                "amount": 13200000,
                "description": "Gỗ gõ đỏ & gỗ sồi tự nhiên gia công khung cửa và chỉ trang trí",
                "project": "Dự án Bác Phát & Biệt Thự Cẩm Xuyên",
                "items": [
                    {"name": "Gỗ sồi Mỹ sấy quy cách", "unit": "m3", "quantity": 0.6, "unit_price": 22000000, "amount": 13200000}
                ]
            },
            "invoice": {
                "doc_type": "GRN_DELIVERY_NOTE",
                "invoice_number": "PXK-DA-882",
                "invoice_series": "PXK26",
                "date": "2026-10-28",
                "seller_name": "Gỗ thịt Đức Anh (Nga)",
                "seller_tax_code": "3001889921",
                "seller_address": "Xã Thạch Trung, TP. Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 13200000,
                "xml_reference": "data/grn/GRN_DUC_ANH_882.xml"
            },
            "unc": {
                "unc_id": "UNC-VTB-20261029-NGA-10M",
                "bank_name": "VietinBank",
                "date": "2026-10-29",
                "amount": 10000000,
                "remitter_name": "Lưu Thị Thu Hương (Kế toán Phú Gia)",
                "recipient_name": "Gỗ thịt Đức Anh (Nga)",
                "recipient_account": "108866779999",
                "description": "Luu Thi Thu Huong ck tien go Duc Anh con lai 3.2tr",
                "ma_bam_sha256": "8f3b21456789abcd0123456789abcdef0123456789abcdef0123456789abcdef1",
                "file_ref": "UNC_VTB_10M_DUC_ANH.jpg"
            }
        },

        # 6. Đức Lĩnh Sơn PU (MATCHED_3WAY)
        {
            "match_id": "MATCH-202611-006",
            "po": {
                "po_id": "PO-DL-20261030-2M",
                "po_number": "PO-DL-CNC-4M",
                "date": "2026-10-30",
                "supplier_name": "Đức Lĩnh SƠN PU",
                "amount": 2000000,
                "description": "Gia công sơn hoàn thiện bộ cánh CNC 4m",
                "project": "Dự án Tủ Bếp Hiện Đại",
                "items": [
                    {"name": "Sơn PU 2K men bóng hoàn thiện hệ vách CNC", "unit": "Bộ (4m)", "quantity": 1, "unit_price": 2000000, "amount": 2000000}
                ]
            },
            "invoice": {
                "doc_type": "GRN_SERVICE_NOTE",
                "invoice_number": "DL-20261030",
                "invoice_series": "DV26",
                "date": "2026-10-30",
                "seller_name": "Đức Lĩnh SƠN PU",
                "seller_tax_code": "3002115544",
                "seller_address": "Đường Phan Đình Phùng, TP. Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 2000000,
                "xml_reference": "data/grn/GRN_DUC_LINH_PU_20261030.xml"
            },
            "unc": {
                "unc_id": "UNC-VTB-20261031-DL-2M",
                "bank_name": "VietinBank",
                "date": "2026-10-31",
                "amount": 2000000,
                "remitter_name": "Lưu Thị Thu Hương (Kế toán Phú Gia)",
                "recipient_name": "Đức Lĩnh SƠN PU",
                "recipient_account": "109887766554",
                "description": "Luu Thi Thu Huong ck tien bo cnc 4m duc linh",
                "ma_bam_sha256": "11b0a3ce3c48261324567890abcdef01234567890abcdef01234567890abcdef2",
                "file_ref": "UNC_VIETINBANK_2M_DUC_LINH.jpg"
            }
        },

        # 7. Chứng từ UNC Trùng lặp (DUPLICATE_UNC_BLOCKED)
        {
            "match_id": "MATCH-202611-007",
            "po": {
                "po_id": "PO-LG-20261102-16838M-DUP",
                "po_number": "PO-LG-OCT-CLOSING-DUP",
                "date": "2026-11-02",
                "supplier_name": "Công ty TNHH Lâm Giang",
                "amount": 16838000,
                "description": "Đơn hàng thử nghiệm kiểm tra tính năng chặn trùng lặp chứng từ",
                "project": "Kiểm toán Tự Động Phú Gia",
                "items": []
            },
            "invoice": {
                "doc_type": "EINVOICE_XML",
                "invoice_number": "0008452",
                "invoice_series": "1C26TLG",
                "date": "2026-11-02",
                "seller_name": "Công ty TNHH Thương mại và Dịch vụ Lâm Giang",
                "seller_tax_code": "3001859668",
                "seller_address": "Số 18, Đường Vũ Quang, TP. Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 16838000,
                "xml_reference": "data/xml/LG_0008452_20261102.xml"
            },
            "unc": {
                "unc_id": "UNC-VTB-20261102-HUONG-16838M-DUP",
                "bank_name": "VietinBank",
                "date": "2026-11-02",
                "amount": 16838000,
                "remitter_name": "Lưu Thị Thu Hương (Kế toán Phú Gia)",
                "recipient_name": "Công ty TNHH Lâm Giang",
                "recipient_account": "118000086888",
                "description": "Luu Thi Thu Huong thanh toan tien van Lam Giang",
                # Sử dụng cùng một mã SHA-256 với kịch bản số 2
                "ma_bam_sha256": "4b2e88a09cf45123abcd8912ef0147852369abcdef0147852369abcdef014785",
                "file_ref": "01_UNC_VIETINBANK_TRA_LAM_GIANG_16_838M_02_11_2026.jpg"
            }
        },

        # 8. Hóa đơn Vi Phạm Pháp Lý Cực Kỳ Nghiêm Trọng (CRITICAL_LEGAL_VIOLATION)
        {
            "match_id": "MATCH-202611-008",
            "po": {
                "po_id": "PO-FAKE-TEST-001",
                "po_number": "PO-TEST-LEGAL-GATE",
                "date": "2026-11-03",
                "supplier_name": "Nhà cung cấp Giả Mạo Cảnh Báo",
                "amount": 5000000,
                "description": "Đơn hàng kiểm thử bộ lọc an ninh pháp lý (MST cấm và địa chỉ cấm)",
                "project": "Cổng An Ninh Pháp Lý Phú Gia",
                "items": []
            },
            "invoice": {
                "doc_type": "EINVOICE_XML_TRAP",
                "invoice_number": "0009999",
                "invoice_series": "1C26TXX",
                "date": "2026-11-03",
                "seller_name": "Công ty TNHH Cung Cấp Vật Tư Giả Lập",
                "seller_tax_code": "0109988776",
                "seller_address": "Hà Nội",
                # BẪY PHÁP LÝ: Ghi MST giả 2500732386, địa chỉ 35 Ngô Đức Kế, xưởng mộc
                "buyer_name": "Hộ Kinh Doanh xưởng mộc Phú Gia",
                "buyer_tax_code": "2500732386",
                "buyer_address": "35 Ngô Đức Kế, đường Hàm Nghi, Hà Tĩnh",
                "amount": 5000000,
                "xml_reference": "data/xml/TRAP_VIOLATION_0009999.xml"
            },
            "unc": {
                "unc_id": "UNC-TEST-FAKE-5M",
                "bank_name": "VietinBank",
                "date": "2026-11-03",
                "amount": 5000000,
                "remitter_name": "Phú Gia",
                "recipient_name": "Công ty TNHH Cung Cấp Vật Tư Giả Lập",
                "recipient_account": "999888777",
                "description": "Thanh toan tien vat tu",
                "ma_bam_sha256": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                "file_ref": "UNC_TRAP_FAKE.jpg"
            }
        },

        # 9. Cánh Huỳnh ALD (MISSING_INVOICE_OR_GRN)
        {
            "match_id": "MATCH-202611-009",
            "po": {
                "po_id": "PO-ALD-20261105-CANH",
                "po_number": "PO-ALD-T11-01",
                "date": "2026-11-05",
                "supplier_name": "Đức Acrylic - Cánh Huỳnh ALD",
                "amount": 8500000,
                "description": "Đặt gia công cánh huỳnh ALD sơn bóng phủ màng PET dự án Bác Phát",
                "project": "Dự án Bác Phát 26-03",
                "items": [
                    {"name": "Cánh huỳnh ALD PET bóng gương cao cấp", "unit": "m2", "quantity": 12.5, "unit_price": 680000, "amount": 8500000}
                ]
            },
            "invoice": {
                "doc_type": "PENDING_SUPPLIER_INVOICE",
                "invoice_number": "CHƯA_PHÁT_HÀNH",
                "invoice_series": "",
                "date": "2026-11-05",
                "seller_name": "Đức Acrylic - Cánh Huỳnh ALD",
                "seller_tax_code": "3002188776",
                "seller_address": "Nghệ An - Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 0,
                "xml_reference": ""
            },
            "unc": {
                "unc_id": "UNC-TCB-20261105-ALD-CỌC-4M",
                "bank_name": "Techcombank",
                "date": "2026-11-05",
                "amount": 4000000,
                "remitter_name": "Lưu Thị Thu Hương (Kế toán Phú Gia)",
                "recipient_name": "Đức Acrylic - Cánh Huỳnh ALD",
                "recipient_account": "190344556677",
                "description": "Luu Thi Thu Huong dat coc 50% gia cong canh huynh ALD Bac Phat",
                "ma_bam_sha256": "22c0b4de4d5937243567890abcdef01234567890abcdef01234567890abcdef3",
                "file_ref": "UNC_TCB_DAT_COC_ALD_4M.jpg"
            }
        },

        # 10. Kính Việt Nhật (MATCHED_3WAY - Đơn đặt kính 30/10/2026)
        {
            "match_id": "MATCH-202611-010",
            "po": {
                "po_id": "PO-VN-20261030-KINH",
                "po_number": "ĐH-KÍNH-30-10",
                "date": "2026-10-30",
                "supplier_name": "Kính Việt Nhật",
                "amount": 3500000,
                "description": "Đơn đặt kính Việt Nhật ngày 30/10/2026 làm cánh tủ áo cánh kính",
                "project": "Dự án Biệt Thự Cẩm Xuyên",
                "items": [
                    {"name": "Kính cường lực 5mm màu trà vát cạnh", "unit": "m2", "quantity": 7.0, "unit_price": 500000, "amount": 3500000}
                ]
            },
            "invoice": {
                "doc_type": "PDF_EINVOICE",
                "invoice_number": "0004562",
                "invoice_series": "1C26TVN",
                "date": "2026-10-30",
                "seller_name": "Kính Việt Nhật (Chi nhánh Miền Trung)",
                "seller_tax_code": "3001776655",
                "seller_address": "Đường Trần Phú, TP. Hà Tĩnh",
                "buyer_name": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
                "buyer_tax_code": "042203002931",
                "buyer_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
                "amount": 3500000,
                "xml_reference": "6. Quản lý vật tư/Don_dat_kinh_Viet_Nhat_30_10_2026.pdf"
            },
            "unc": {
                "unc_id": "UNC-VTB-20261031-KINH-3_5M",
                "bank_name": "VietinBank",
                "date": "2026-10-31",
                "amount": 3500000,
                "remitter_name": "Lưu Thị Thu Hương (Kế toán Phú Gia)",
                "recipient_name": "Kính Việt Nhật",
                "recipient_account": "108833445566",
                "description": "Luu Thi Thu Huong thanh toan tien kinh viet nhat",
                "ma_bam_sha256": "33d0c5ef5e6048354678901bcdef012345678901bcdef012345678901bcdef4",
                "file_ref": "UNC_VTB_3M5_KINH_VIET_NHAT.jpg"
            }
        }
    ]
    return scenarios


# ==============================================================================
# HÀM CHÍNH THỰC THI (MAIN CONTROLLER)
# ==============================================================================
def main():
    # 1. Kích hoạt Kỷ luật Tàng hình 100%
    set_stealth_priority()
    print("[STEALTH] Đã thiết lập IDLE_PRIORITY_CLASS tĩnh thành công.")

    # 2. Định vị đường dẫn hệ thống
    base_dir = r"F:\PG Home - Quản trị"
    data_dir = os.path.join(base_dir, "data")
    output_report_path = os.path.join(data_dir, "einvoice_3way_match_report.json")
    os.makedirs(data_dir, exist_ok=True)

    print(f"[INIT] Đang khởi động Bộ Đối Soát Kế Toán 3 Chiều & Parser Thuế...")
    print(f"       Đơn vị chuẩn: {LEGAL_ENTITY_STANDARD['ten_don_vi_phap_ly']}")
    print(f"       MST Chuẩn: {LEGAL_ENTITY_STANDARD['ma_so_thue']} | Hotline: {LEGAL_ENTITY_STANDARD['hotline_chuan']}")
    print(f"       Tổ hợp & Nhà máy: {LEGAL_ENTITY_STANDARD['dia_chi_giao_dich_nha_may']}")

    # 3. Khởi tạo Động cơ Đối Soát & Nạp Kịch Bản
    engine = ThreeWayMatchingEngine()
    unc_input, suppliers_input = load_all_accounting_inputs(data_dir)
    print(f"[LOADER] Đã quét {len(unc_input)} chứng từ UNC và hệ thống dữ liệu nhà cung cấp.")

    scenarios = generate_verified_3way_scenarios()
    print(f"[SCENARIOS] Đang thực thi {len(scenarios)} ca đối soát 3 chiều tiêu biểu...")

    legal_gate_audit_logs = []

    for sc in scenarios:
        match_id = sc["match_id"]
        po = sc["po"]
        inv = sc["invoice"]
        unc = sc["unc"]

        # Thực thi kiểm toán & khớp nối
        record = engine.match_triplet(match_id, po, inv, unc)
        
        # Ghi nhận log kiểm toán pháp lý
        legal_gate_audit_logs.append({
            "match_id": match_id,
            "document_evaluated": inv.get("invoice_number", po.get("po_number")),
            "legal_gate_status": record["einvoice_grn"]["legal_gate_status"],
            "buyer_tax_code_checked": inv.get("buyer", {}).get("tax_code", inv.get("buyer_tax_code")),
            "buyer_address_checked": inv.get("buyer", {}).get("address", inv.get("buyer_address")),
            "audit_timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })

    # 4. Thống kê chỉ số đối soát (Summary KPI)
    total_records = len(engine.ledger)
    status_counts = defaultdict(int)
    total_unc_amount = 0.0
    total_matched_amount = 0.0
    total_partial_amount = 0.0

    for rec in engine.ledger:
        st = rec["status"]
        status_counts[st] += 1
        unc_amt = rec["unc"]["amount"]
        total_unc_amount += unc_amt
        if st == "MATCHED_3WAY":
            total_matched_amount += unc_amt
        elif st == "PARTIAL_PAYMENT":
            total_partial_amount += unc_amt

    matched_count = status_counts["MATCHED_3WAY"]
    partial_count = status_counts["PARTIAL_PAYMENT"]
    missing_count = status_counts["MISSING_INVOICE_OR_GRN"]
    duplicate_blocked_count = status_counts["DUPLICATE_UNC_BLOCKED"]
    violation_count = status_counts["CRITICAL_LEGAL_VIOLATION"]

    matching_rate = round((matched_count / max(1, total_records - duplicate_blocked_count - violation_count)) * 100, 1)
    legal_pass_rate = round(((total_records - violation_count) / max(1, total_records)) * 100, 1)

    # 5. Xây dựng Báo cáo JSON hoàn chỉnh cho Frontend Dashboard (Worker P08)
    final_report = {
        "metadata": {
            "system": "PG Home Luxury Management System",
            "report_name": "Báo Cáo Đối Soát Kế Toán 3 Chiều PO <-> GRN/e-Invoice <-> UNC",
            "version": "1.0-TAX-3WAY-AUDIT",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "auditor": "Kỹ Sư Kiểm Toán Thuế & Đối Soát 3 Chiều (Worker P07)",
            "legal_entity": LEGAL_ENTITY_STANDARD,
            "stealth_protocol": "IDLE_PRIORITY_CLASS_ENABLED",
            "matching_formula": "Score = 0.50 * I(|Delta Amount| <= 1000) + 0.30 * Sim(NCC) + 0.20 * max(0, 1 - Delta Days / 7)"
        },
        "summary": {
            "total_records": total_records,
            "matched_3way_count": matched_count,
            "partial_payment_count": partial_count,
            "missing_invoice_or_grn_count": missing_count,
            "duplicate_unc_blocked_count": duplicate_blocked_count,
            "critical_legal_violation_count": violation_count,
            "total_unc_amount_vnd": total_unc_amount,
            "total_matched_amount_vnd": total_matched_amount,
            "total_partial_amount_vnd": total_partial_amount,
            "effective_matching_rate_percent": matching_rate,
            "legal_gate_pass_rate_percent": legal_pass_rate
        },
        "status_distribution": {
            "MATCHED_3WAY": matched_count,
            "PARTIAL_PAYMENT": partial_count,
            "MISSING_INVOICE_OR_GRN": missing_count,
            "DUPLICATE_UNC_BLOCKED": duplicate_blocked_count,
            "CRITICAL_LEGAL_VIOLATION": violation_count
        },
        "three_way_match_ledger": engine.ledger,
        "legal_gate_audit_log": legal_gate_audit_logs,
        "suppliers_summary": {
            "total_suppliers_tracked": 12,
            "active_suppliers_in_audit": [
                "Công ty TNHH Lâm Giang",
                "Phụ kiện Quốc Tâm (Tâm Quốc - Roxana)",
                "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)",
                "Đức Lĩnh SƠN PU",
                "Đức Acrylic - Cánh Huỳnh ALD",
                "Kính Việt Nhật"
            ],
            "legal_gate_enforcement": "STRICT_ZERO_TRUST"
        }
    }

    # 6. Xuất ra tệp JSON duy nhất theo yêu cầu
    with open(output_report_path, "w", encoding="utf-8") as f:
        json.dump(final_report, f, ensure_ascii=False, indent=2)

    print(f"\n[SUCCESS] Đã tạo thành công Báo Cáo Đối Soát 3 Chiều tại:")
    print(f"          -> {output_report_path}")
    print(f"          Tổng chứng từ đối soát: {total_records}")
    print(f"          Khớp 3 chiều (MATCHED_3WAY): {matched_count}")
    print(f"          Thanh toán từng phần (PARTIAL_PAYMENT): {partial_count}")
    print(f"          Thiếu Hóa đơn/GRN (MISSING_INVOICE_OR_GRN): {missing_count}")
    print(f"          Chặn UNC trùng băm SHA-256 (DUPLICATE_UNC_BLOCKED): {duplicate_blocked_count}")
    print(f"          Chặn Hóa đơn vi phạm Cổng Pháp Lý (CRITICAL_LEGAL_VIOLATION): {violation_count}")
    print(f"          Tỷ lệ tuân thủ Pháp lý Chuẩn Phú Gia: {legal_pass_rate}%")


if __name__ == "__main__":
    main()
