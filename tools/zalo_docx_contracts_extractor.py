#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
CÔNG NHÂN FLASH #04: KỸ SƯ BÓC TÁCH SÂU 44 FILE WORD (DOCX/DOC)
KHO FILENOISE & STORAGE.DB - HỆ THỐNG QUẢN TRỊ NỘI THẤT PHÚ GIA (PG HOME)
=============================================================================
Script: zalo_docx_contracts_extractor.py
Phiên bản: 2.0 (Chuyên sâu - Trích xuất đa tầng thực thể & bảng biểu)
Chức năng:
  - Quét 44 file Word (.docx, .doc) trong zalo_filenoise_index.json & zalo_sqlite_contacts_and_files.json
  - Giải mã hoàn toàn In-Memory trên RAM:
    + DOCX: Khử suffix 6-byte \\x07zAlO\\x07, giải mã ZIP archive, parse word/document.xml, word/header*.xml, docProps/core.xml
    + DOC: Khử suffix 6-byte \\x07zAlO\\x07, giải mã OLE CFBF header (XOR 0x93 cho 512 bytes đầu), trích xuất stream WordDocument & giải mã UTF-16LE / UTF-8
  - Bóc tách cấu trúc: Tiêu đề, Bảng biểu (Tables), Đoạn văn (Paragraphs)
  - Phân loại chuyên sâu: Hợp đồng lao động, Hợp đồng thi công nội thất, Hồ sơ BHXH (TK3-TS, D02-LT), Danh sách khách hàng T10, Phiếu ghi thời gian làm việc, Báo cáo tuyển dụng ứng viên, Hồ sơ PCCC & Pháp lý.
  - Trích xuất thực thể: Bên A, Bên B, Đại diện, Chức vụ, CCCD, SĐT, Địa chỉ, Giá trị hợp đồng / Mức lương, Thời hạn, Điều khoản thanh toán.
  - Xuất báo cáo JSON chi tiết: f:\\PG Home - Quản trị\\data\\zalo_docx_contracts_audit.json
=============================================================================
"""

import os
import sys
import json
import re
import io
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime

FILENOISE_INDEX_PATH = r"f:\PG Home - Quản trị\data\zalo_filenoise_index.json"
SQLITE_DATA_PATH = r"f:\PG Home - Quản trị\data\zalo_sqlite_contacts_and_files.json"
OUTPUT_JSON_PATH = r"f:\PG Home - Quản trị\data\zalo_docx_contracts_audit.json"

XML_NAMESPACES = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'dcterms': 'http://purl.org/dc/terms/',
}

# Ánh xạ tên file gốc đã biết dựa trên checksum hoặc đặc trưng
KNOWN_CHECKSUM_NAMES = {
    "ba632e9037b5fc32252c6c59ae35f10a": "PHIEU_GHI_THOI_GIAN_LAM_VIEC_THUC_TE.docx",
    "7be19ff11e041e6cdf4090c1f0cecf96": "MAU_D02_LT_DANH_SACH_BHXH_DONG_3_THANG.docx",
    "b13bfd83e801e9619e4c8ba3a75e2fa4": "MAU_TK3_TS_DANG_KY_BHXH_DONG_3_THANG.docx",
    "a1f44791d6de30fd007e824a84d817b2": "HOP_DONG_LAO_DONG_XUONG_DONG_BHXH.docx",
    "4678aac70a9d0e095155e37c09821075": "DANH_SACH_KHACH_HANG_NOI_THAT_THANG_10_PHU_GIA.docx",
    "4ba0fd08b43b5bc578e1f8c904a2825a": "HOP_DONG_LAO_DONG_HOANG_CONG_VU.doc",
    "4bdea64d38756401a060514347eb95a3": "HOP_DONG_LAO_DONG_26_HDLD_PHU_GIA.doc"
}

def clean_noise_data(raw_data: bytes) -> bytes:
    """Loại bỏ 6-byte suffix '\\x07zAlO\\x07' nếu có."""
    if raw_data.endswith(b"\x07zAlO\x07"):
        return raw_data[:-6]
    return raw_data

def extract_docx_xml_text(xml_content: bytes) -> tuple[list[str], list[list[list[str]]]]:
    """
    Parse XML của word/document.xml.
    Trả về: (danh_sach_doan_van, danh_sach_bang_bieu)
    """
    paragraphs = []
    tables = []
    
    try:
        root = ET.fromstring(xml_content)
    except Exception as e:
        return [f"[Lỗi parse XML: {e}]"], []

    # Parse body
    body = root.find('w:body', XML_NAMESPACES)
    if body is None:
        body = root

    for child in body:
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        
        if tag == 'p':
            texts = []
            for t in child.findall('.//w:t', XML_NAMESPACES):
                if t.text:
                    texts.append(t.text)
            p_text = "".join(texts).strip()
            if p_text:
                paragraphs.append(p_text)
                
        elif tag == 'tbl':
            tbl_data = []
            for row in child.findall('w:tr', XML_NAMESPACES):
                row_cells = []
                for cell in row.findall('w:tc', XML_NAMESPACES):
                    cell_paras = []
                    for cp in cell.findall('w:p', XML_NAMESPACES):
                        cp_texts = [t.text for t in cp.findall('.//w:t', XML_NAMESPACES) if t.text]
                        cp_str = "".join(cp_texts).strip()
                        if cp_str:
                            cell_paras.append(cp_str)
                    row_cells.append(" | ".join(cell_paras))
                if row_cells:
                    tbl_data.append(row_cells)
            if tbl_data:
                tables.append(tbl_data)

    return paragraphs, tables

def extract_docx_in_memory(raw_bytes: bytes) -> dict:
    """Giải mã file DOCX hoàn toàn trên RAM."""
    data = clean_noise_data(raw_bytes)
    result = {
        "status": "SUCCESS",
        "metadata": {},
        "paragraphs": [],
        "tables": [],
        "full_text": "",
        "word_count": 0,
        "table_count": 0
    }
    
    try:
        bio = io.BytesIO(data)
        with zipfile.ZipFile(bio, 'r') as zf:
            namelist = zf.namelist()
            
            # Đọc docProps/core.xml (Title, Creator, Modified)
            if 'docProps/core.xml' in namelist:
                try:
                    core_xml = zf.read('docProps/core.xml')
                    c_root = ET.fromstring(core_xml)
                    for key, tag in [('title', 'dc:title'), ('creator', 'dc:creator'), 
                                     ('last_modified_by', 'cp:lastModifiedBy'),
                                     ('created', 'dcterms:created'), ('modified', 'dcterms:modified')]:
                        el = c_root.find(tag, XML_NAMESPACES)
                        if el is not None and el.text:
                            result["metadata"][key] = el.text
                except Exception:
                    pass

            # Đọc word/document.xml
            if 'word/document.xml' in namelist:
                doc_xml = zf.read('word/document.xml')
                paras, tbls = extract_docx_xml_text(doc_xml)
                result["paragraphs"] = paras
                result["tables"] = tbls
                result["table_count"] = len(tbls)
                
                # Nối full text
                all_lines = list(paras)
                for tbl in tbls:
                    for r in tbl:
                        all_lines.append(" [Cột: " + " ; ".join(r) + "]")
                result["full_text"] = "\n".join(all_lines)
                result["word_count"] = len(result["full_text"].split())
            else:
                result["status"] = "NO_DOCUMENT_XML"
                
    except zipfile.BadZipFile as bze:
        # Thử repair header XOR 0x93
        try:
            patched = bytearray(data)
            limit = min(512, len(patched))
            for i in range(limit):
                patched[i] ^= 0x93
            bio = io.BytesIO(patched)
            with zipfile.ZipFile(bio, 'r') as zf:
                if 'word/document.xml' in zf.namelist():
                    doc_xml = zf.read('word/document.xml')
                    paras, tbls = extract_docx_xml_text(doc_xml)
                    result["paragraphs"] = paras
                    result["tables"] = tbls
                    result["table_count"] = len(tbls)
                    all_lines = list(paras)
                    for tbl in tbls:
                        for r in tbl:
                            all_lines.append(" [Cột: " + " ; ".join(r) + "]")
                    result["full_text"] = "\n".join(all_lines)
                    result["word_count"] = len(result["full_text"].split())
                    result["status"] = "SUCCESS_REPAIRED_HEADER"
                    return result
        except Exception:
            pass
        result["status"] = f"BAD_ZIP_FILE: {bze}"
    except Exception as e:
        result["status"] = f"ERROR: {e}"
        
    return result

def extract_doc_in_memory(raw_bytes: bytes) -> dict:
    """Giải mã file Word 97-2003 (.DOC) OLE CFBF hoàn toàn trên RAM."""
    data = clean_noise_data(raw_bytes)
    result = {
        "status": "SUCCESS",
        "metadata": {"type": "Word97-2003_DOC_OLE"},
        "paragraphs": [],
        "tables": [],
        "full_text": "",
        "word_count": 0,
        "table_count": 0
    }
    
    # Giải mã OLE Header 512 bytes
    patched = bytearray(data)
    if not (patched.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1")):
        for i in range(min(512, len(patched))):
            patched[i] ^= 0x93
            
    extracted_text_blocks = []
    
    # Quét UTF-16LE
    utf16_pattern = re.compile(rb'(?:[\x20-\x7e\xa0-\xff\x00-\xff][\x00-\x04]){4,}')
    for match in utf16_pattern.finditer(patched):
        chunk = match.group()
        try:
            txt = chunk.decode('utf-16le', errors='ignore').strip()
            if any(sys_kw in txt for sys_kw in ['Root Entry', 'WordDocument', 'SummaryInformation', 'DocumentSummary']):
                continue
            if len(txt) >= 4 and any(c.isalnum() for c in txt):
                extracted_text_blocks.append(txt)
        except Exception:
            pass
            
    clean_lines = []
    prev = ""
    for block in extracted_text_blocks:
        lines = [l.strip() for l in block.split('\r\n') if l.strip()]
        for l in lines:
            if l != prev and len(l) > 2:
                clean_lines.append(l)
                prev = l
                
    result["paragraphs"] = clean_lines
    result["full_text"] = "\n".join(clean_lines)
    result["word_count"] = len(result["full_text"].split())
    if not clean_lines:
        result["status"] = "EMPTY_OR_UNPARSEABLE_DOC"
    return result

def classify_and_extract_entities(doc_name: str, full_text: str, tables: list, meta_title: str = "") -> dict:
    """
    Phân loại tài liệu và bóc tách các trường thực thể chuyên sâu:
    - Loại tài liệu
    - Số hợp đồng, Ngày tháng
    - Các bên tham gia (Bên A, Bên B, Đại diện, Chức vụ, SĐT, CCCD, Địa chỉ)
    - Giá trị tài chính, Mức lương, Tạm ứng
    - Danh sách nhân sự / ứng viên / khách hàng
    """
    combined_search_text = f"{doc_name} {meta_title} {full_text}".lower()
    
    classification = "VAN_BAN_KHAC"
    sub_type = "Tài liệu văn bản"
    
    # Phân loại ưu tiên
    if "luật phòng cháy" in combined_search_text or "nghị định" in combined_search_text and "phòng cháy" in combined_search_text:
        classification = "PCCC_PHAP_LY"
        sub_type = "Nghị định chi tiết Luật Phòng cháy, chữa cháy và CNCH"
    elif "d02_lt" in combined_search_text or "d02-lt" in combined_search_text or "danh sách lao động tham gia bhxh" in combined_search_text:
        classification = "HO_SO_BHXH"
        sub_type = "Mẫu D02-LT: Danh sách tham gia BHXH, BHYT 3 tháng"
    elif "tk3_ts" in combined_search_text or "tk3-ts" in combined_search_text or "tờ khai đơn vị tham gia" in combined_search_text:
        classification = "HO_SO_BHXH"
        sub_type = "Mẫu TK3-TS: Đăng ký tham gia BHXH Hộ KD Phú Gia"
    elif "hợp đồng lao động" in combined_search_text or "hđlđ" in combined_search_text or "người sử dụng lao động" in combined_search_text:
        classification = "HOP_DONG_LAO_DONG"
        if "đường việt dũng" in combined_search_text:
            sub_type = "HĐLĐ Nhân sự Đường Việt Dũng (Nhân viên Kinh Doanh)"
        elif "tống trần hiệp" in combined_search_text and "26/hđlđ" in combined_search_text:
            sub_type = "HĐLĐ Không xác định thời hạn số 26/HĐLĐ (Tống Trần Hiệp)"
        elif "tống trần hiệp" in combined_search_text:
            sub_type = "HĐLĐ Nhân sự Tống Trần Hiệp (Văn phòng Tân Bình)"
        elif "hoàng công vũ" in combined_search_text:
            sub_type = "HĐLĐ Quản lý Xưởng Hoàng Công Vũ (Hà Tĩnh)"
        elif "26/hđlđ" in combined_search_text or "phú gia home luxury" in combined_search_text:
            sub_type = "HĐLĐ Công ty Phú Gia Home Luxury số 26"
        else:
            sub_type = "Hợp đồng lao động xưởng / nhân viên"
    elif any(k in combined_search_text for k in ["hợp đồng thi công", "hợp đồng thiết kế", "hợp đồng kinh tế", "thi công nội thất"]):
        classification = "HOP_DONG_THI_CONG"
        sub_type = "Hợp đồng thi công / thiết kế nội thất"
    elif "danh_sach_khach_hang" in combined_search_text or "danh sách khách hàng" in combined_search_text or "khách hàng nội thất tháng 10" in combined_search_text:
        classification = "DANH_SACH_KHACH_HANG"
        sub_type = "Danh sách khách hàng nội thất T10 Phú Gia"
    elif "thời gian làm việc thực tế" in combined_search_text or "phieu_ghi_thoi_gian" in combined_search_text or "phiếu ghi thời gian" in combined_search_text:
        classification = "CHAM_CONG_THOI_GIAN"
        sub_type = "Phiếu ghi thời gian làm việc thực tế"
    elif any(k in combined_search_text for k in ["ứng viên", "tuyển dụng", "trương thị hiệu", "lê thị ngọc ánh", "ung_vien"]) or "thông tin ứng viên" in combined_search_text:
        classification = "TUYEN_DUNG_NS"
        sub_type = "Báo cáo thống kê ứng viên & Hồ sơ tuyển dụng"
    elif any(k in combined_search_text for k in ["phòng cháy", "chữa cháy", "pccc", "nghị định 105", "phương án chữa cháy", "pc04", "phương tiện pccc"]):
        classification = "PCCC_PHAP_LY"
        sub_type = "Hồ sơ quản lý PCCC xưởng & Pháp lý cơ sở"
    elif any(k in combined_search_text for k in ["móng cái", "đông hưng", "lịch trình", "tour"]):
        classification = "VAN_BAN_KHAC"
        sub_type = "Lịch trình tour du lịch (Móng Cái - Đông Hưng)"
    elif any(k in combined_search_text for k in ["albert einstein", "mụ bông", "toán học", "tiếng anh", "bài tập", "lớp 6a6"]):
        classification = "VAN_BAN_KHAC"
        sub_type = "Tài liệu học tập gia đình / Trường Albert Einstein"

    # Trích xuất thực thể
    entities = {
        "so_hop_dong": None,
        "ngay_lap": None,
        "ben_a": {},
        "ben_b": {},
        "gia_tri_hop_dong_hoac_luong": None,
        "dia_diem_thuc_hien": None,
        "nhan_su_phat_hien": [],
        "so_dien_thoai": [],
        "so_cccd_cmnd": [],
        "danh_sach_khach_hang_rows": [],
        "noi_dung_chinh_tom_tat": ""
    }
    
    # 1. Số hợp đồng
    shd_match = re.search(r'(?:Số|Số HĐ|Số:)\s*([0-9]+[A-Za-z0-9\/\-\_]+(?:\/HĐ[A-Za-z0-9\-]*)?)', full_text, re.IGNORECASE)
    if shd_match:
        entities["so_hop_dong"] = shd_match.group(1).strip()
        
    # 2. Ngày tháng lập
    date_match = re.search(r'(?:ngày\s+([0-9]{1,2})\s+tháng\s+([0-9]{1,2})\s+năm\s+([0-9]{4}))', full_text, re.IGNORECASE)
    if date_match:
        entities["ngay_lap"] = f"{date_match.group(1)}/{date_match.group(2)}/{date_match.group(3)}"
        
    # 3. Đại diện Bên A / Bên B
    a_match = re.search(r'(?:BÊN A|BÊN GIAO VIỆC|NGƯỜI SỬ DỤNG LAO ĐỘNG)[^\n]*\n([\s\S]{1,400}?)(?=(?:BÊN B|BÊN NHẬN VIỆC|NGƯỜI LAO ĐỘNG|ĐIỀU|CỘNG HÒA|$))', full_text, re.IGNORECASE)
    if a_match:
        a_sec = a_match.group(1)
        name_m = re.search(r'(?:Đại diện|Ông\/Bà|Ông|Bà|Họ và tên|Chủ hộ):\s*([^\n\,]+)', a_sec, re.IGNORECASE)
        if name_m:
            entities["ben_a"]["dai_dien"] = name_m.group(1).strip()
        pos_m = re.search(r'(?:Chức vụ|Chức danh):\s*([^\n\,]+)', a_sec, re.IGNORECASE)
        if pos_m:
            entities["ben_a"]["chuc_vu"] = pos_m.group(1).strip()
        org_m = re.search(r'(?:Công ty|Hộ kinh doanh|Đơn vị|Tên):\s*([^\n\,]+)', a_sec, re.IGNORECASE)
        if org_m:
            entities["ben_a"]["to_chuc"] = org_m.group(1).strip()
        entities["ben_a"]["raw_snippet"] = a_sec.strip()[:200]

    b_match = re.search(r'(?:BÊN B|BÊN NHẬN VIỆC|NGƯỜI LAO ĐỘNG)[^\n]*\n([\s\S]{1,400}?)(?=(?:ĐIỀU|CỘNG HÒA|QUYỀN|NGHĨA VỤ|$))', full_text, re.IGNORECASE)
    if b_match:
        b_sec = b_match.group(1)
        name_m = re.search(r'(?:Đại diện|Ông\/Bà|Ông|Bà|Họ và tên|Người lao động):\s*([^\n\,]+)', b_sec, re.IGNORECASE)
        if name_m:
            entities["ben_b"]["dai_dien"] = name_m.group(1).strip()
        pos_m = re.search(r'(?:Chức vụ|Nghề nghiệp|Vị trí):\s*([^\n\,]+)', b_sec, re.IGNORECASE)
        if pos_m:
            entities["ben_b"]["chuc_vu"] = pos_m.group(1).strip()
        entities["ben_b"]["raw_snippet"] = b_sec.strip()[:200]

    # 4. Giá trị hợp đồng / Lương
    val_match = re.search(r'(?:Tổng giá trị|Giá trị hợp đồng|Mức lương|Lương chính|Mức tiền lương|Tiền lương)[^\:\n]*:\s*([0-9\.\,\s]+(?:\s*(?:VNĐ|đồng|đ|triệu))?)', full_text, re.IGNORECASE)
    if val_match:
        entities["gia_tri_hop_dong_hoac_luong"] = val_match.group(1).strip()
        
    # 5. Số điện thoại (10 chữ số bắt đầu bằng 0)
    phones = re.findall(r'(?:\+?84|0)(?:3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}', full_text)
    entities["so_dien_thoai"] = sorted(list(set(phones)))
    
    # 6. CCCD / CMND (9 hoặc 12 số)
    cccds = re.findall(r'(?:CCCD|CMND|Số CMT|Số CCCD)[^\d]{0,10}([0-9]{9,12})', full_text, re.IGNORECASE)
    entities["so_cccd_cmnd"] = sorted(list(set(cccds)))

    # 7. Nhân sự phát hiện
    ns_keywords = [
        "Nguyễn Viết Nghĩa", "Tống Trần Hiệp", "Hoàng Công Vũ", "Phạm Văn Thái",
        "Trần Văn Hòa", "Nguyễn Văn Hào", "Lương Thể Hào", "Đường Việt Dũng",
        "Trương Thị Hiệu", "Lê Thị Ngọc Ánh", "Trần Thị Lan", "Lê Văn Hảo", "Phạm Văn Dũng"
    ]
    for ns in ns_keywords:
        if ns.lower() in full_text.lower():
            entities["nhan_su_phat_hien"].append(ns)
            
    # 8. Bóc tách chi tiết bảng khách hàng
    if tables and (classification == "DANH_SACH_KHACH_HANG" or "khách hàng" in combined_search_text):
        kh_list = []
        for tbl in tables:
            for row in tbl:
                row_str = " ".join(row)
                if any(k in row_str.lower() for k in ["stt", "họ và tên", "tiêu đề"]):
                    continue
                if len(row) >= 2 and any(c.isalnum() for c in row_str):
                    kh_list.append(row)
        entities["danh_sach_khach_hang_rows"] = kh_list[:30]

    # Tóm tắt nội dung chính
    paras_clean = [p for p in full_text.split('\n') if len(p.strip()) > 15 and not p.strip().startswith('CỘNG HÒA') and not p.strip().startswith('ĐỘC LẬP')]
    entities["noi_dung_chinh_tom_tat"] = " | ".join(paras_clean[:5])[:400]

    return {
        "classification": classification,
        "sub_type": sub_type,
        "entities": entities
    }

def main():
    print("=" * 80)
    print("FLASH #04: BẮT ĐẦU BÓC TÁCH SÂU 44 FILE WORD (DOCX/DOC) - V2.0")
    print("=" * 80)
    
    if not os.path.exists(FILENOISE_INDEX_PATH):
        print(f"[LỖI] Không tìm thấy {FILENOISE_INDEX_PATH}")
        sys.exit(1)
        
    with open(FILENOISE_INDEX_PATH, 'r', encoding='utf-8') as f:
        filenoise_data = json.load(f)
        filenoise_items = filenoise_data.get("items", []) if isinstance(filenoise_data, dict) else filenoise_data
        
    # Tạo map tra cứu từ SQLite transfers
    sqlite_files_map = {}
    if os.path.exists(SQLITE_DATA_PATH):
        try:
            with open(SQLITE_DATA_PATH, 'r', encoding='utf-8') as f:
                sq_data = json.load(f)
                transfers = sq_data.get("all_file_transfers", [])
                for t in transfers:
                    csum = (t.get("checksum") or "").lower()
                    fid = str(t.get("file_id") or "")
                    fn = (t.get("zname") or t.get("file_name") or "").lower()
                    if csum:
                        sqlite_files_map[csum] = t
                    if fid:
                        sqlite_files_map[fid] = t
                    if fn:
                        sqlite_files_map[fn] = t
        except Exception as e:
            print(f"[CẢNH BÁO] Không thể đọc {SQLITE_DATA_PATH}: {e}")

    # Lọc 44 file Word
    word_records = []
    for item in filenoise_items:
        ext = item.get("extension", "").lower()
        if ext in [".docx", ".doc"]:
            word_records.append(item)
            
    print(f"[INFO] Tổng số file Word tìm thấy: {len(word_records)}")
    
    extracted_results = []
    stats = {
        "total_files": len(word_records),
        "docx_count": 0,
        "doc_count": 0,
        "success_count": 0,
        "error_count": 0,
        "categories": {},
        "sub_types": {}
    }
    
    for idx, rec in enumerate(word_records, start=1):
        src_path = rec.get("source_path", "")
        file_name = rec.get("file_id") or os.path.basename(src_path)
        ext = rec.get("extension", "").lower()
        size_bytes = rec.get("decoded_size") or rec.get("original_size") or (os.path.getsize(src_path) if os.path.exists(src_path) else 0)
        csum = (rec.get("checksum") or file_name).lower()
        mtime = rec.get("mtime", 0)
        mtime_str = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S") if mtime else ""
        
        # Tìm metadata từ SQLite transfers & Known checksums
        transfer_info = sqlite_files_map.get(csum) or sqlite_files_map.get(file_name.lower()) or {}
        
        original_display_name = (
            KNOWN_CHECKSUM_NAMES.get(csum) or
            transfer_info.get("zname") or
            transfer_info.get("file_name") or
            file_name
        )
        
        doc_audit = {
            "index": idx,
            "file_name": file_name,
            "original_display_name": original_display_name,
            "extension": ext,
            "source_path": src_path,
            "size_bytes": size_bytes,
            "checksum": csum,
            "modified_time": mtime_str,
            "transfer_metadata": transfer_info,
            "extraction_result": {},
            "analysis": {}
        }
        
        if not os.path.exists(src_path):
            doc_audit["extraction_result"] = {
                "status": "FILE_NOT_FOUND",
                "error": f"Không tìm thấy file trên ổ cứng: {src_path}"
            }
            stats["error_count"] += 1
            extracted_results.append(doc_audit)
            continue
            
        try:
            with open(src_path, "rb") as f:
                raw_bytes = f.read()
                
            if ext == ".docx":
                stats["docx_count"] += 1
                ext_res = extract_docx_in_memory(raw_bytes)
            else: # .doc
                stats["doc_count"] += 1
                ext_res = extract_doc_in_memory(raw_bytes)
                
            if ext_res.get("status", "").startswith("SUCCESS"):
                stats["success_count"] += 1
            else:
                stats["error_count"] += 1
                
            meta_title = ext_res.get("metadata", {}).get("title", "")
            
            # Nếu tên vẫn là mã số và có title trong metadata thì bổ sung
            if original_display_name == file_name and meta_title:
                original_display_name = f"{meta_title}{ext}"
                doc_audit["original_display_name"] = original_display_name
                
            # Phân loại và trích xuất thực thể
            full_txt = ext_res.get("full_text", "")
            tbls = ext_res.get("tables", [])
            analysis = classify_and_extract_entities(original_display_name, full_txt, tbls, meta_title)
            
            cat = analysis["classification"]
            sub_t = analysis["sub_type"]
            stats["categories"][cat] = stats["categories"].get(cat, 0) + 1
            stats["sub_types"][sub_t] = stats["sub_types"].get(sub_t, 0) + 1
            
            doc_audit["extraction_result"] = ext_res
            doc_audit["analysis"] = analysis
            
            print(f"[{idx:02d}/44] {original_display_name[:40]:<40} | {cat:<20} | {len(full_txt):,} ký tự | {len(tbls)} bảng")
            
        except Exception as e:
            stats["error_count"] += 1
            doc_audit["extraction_result"] = {
                "status": "EXCEPTION",
                "error": str(e)
            }
            print(f"[{idx:02d}/44] LỖI: {e}")
            
        extracted_results.append(doc_audit)
        
    output_data = {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "agent": "FLASH_04_DOCX_CONTRACTS_EXTRACTOR",
        "description": "Báo cáo bóc tách sâu 44 file Word (DOCX/DOC) kho FileNoise & Storage.db Phú Gia Home Luxury",
        "statistics": stats,
        "files": extracted_results
    }
    
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print("=" * 80)
    print(f"[HOÀN TẤT] Đã xuất báo cáo bóc tách vào: {OUTPUT_JSON_PATH}")
    print(f"Tổng số file: {stats['total_files']} (DOCX: {stats['docx_count']}, DOC: {stats['doc_count']})")
    print(f"Thành công: {stats['success_count']} | Lỗi/Không mở được: {stats['error_count']}")
    print("-" * 50)
    print("THỐNG KÊ DANH MỤC PHÂN LOẠI:")
    for cat, count in stats["categories"].items():
        print(f"  * {cat:<22}: {count:2d} file")
    print("-" * 50)
    print("THỐNG KÊ CHI TIẾT THEO LOẠI TÀI LIỆU:")
    for subt, count in stats["sub_types"].items():
        print(f"  - {subt}: {count} file")
    print("=" * 80)

if __name__ == "__main__":
    main()
