#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Module: zalo_filenoise_decoder.py
Chức năng: Giải mã siêu tốc các file bị Zalo làm nhiễu (fileNoise) trong bộ nhớ,
nhận diện định dạng tệp thực tế (PDF, XLSX, DOCX, ZIP, JPG, PNG, DWG, RAR,...),
trích xuất siêu dữ liệu thông minh và lập chỉ mục SHA-256.

Đặc tả kỹ thuật:
- Độ ưu tiên tiến trình: IDLE (0x00000040) để không gián đoạn hệ thống.
- Thuật toán giải mã: XOR 0x93 cho 100 byte đầu tiên, cắt hậu tố b'\x07zAlO\x07' (6 byte).
- 100% chạy trên bộ nhớ (In-Memory Processing), tuyệt đối không sửa đổi file gốc.
"""

import os
import sys
import io
import time
import json
import glob
import hashlib
import re
import zipfile
import xml.etree.ElementTree as ET
from typing import Dict, Any, List, Optional, Tuple

# Thiết lập ưu tiên IDLE ngay khi khởi động
def set_idle_priority():
    """Thiết lập độ ưu tiên tiến trình IDLE (0x00000040)"""
    try:
        import psutil
        p = psutil.Process()
        p.nice(psutil.IDLE_PRIORITY_CLASS)
    except Exception:
        try:
            import ctypes
            kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
            kernel32.SetPriorityClass(kernel32.GetCurrentProcess(), 0x00000040)
        except Exception:
            pass

set_idle_priority()

# Nhập PyMuPDF nếu có sẵn để trích xuất PDF chuyên sâu
HAVE_PYMUPDF = False
try:
    import pymupdf as fitz
    HAVE_PYMUPDF = True
except ImportError:
    try:
        import fitz
        HAVE_PYMUPDF = True
    except ImportError:
        HAVE_PYMUPDF = False

# Hậu tố nhiễu của Zalo
ZALO_NOISE_SUFFIX = b'\x07zAlO\x07'
ZALO_XOR_KEY = 0x93
ZALO_XOR_LEN = 100

# Các đường dẫn mặc định của Zalo
DEFAULT_SEARCH_PATHS = [
    r"C:\Users\Admin\AppData\Local\ZaloPC\2304805760907141944\ZaloDownloads\fileNoise",
    r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\fileNoise"
]
DEFAULT_ZALO_MEDIA_DIR = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads"
DEFAULT_OUTPUT_INDEX = r"F:\PG Home - Quản trị\data\zalo_filenoise_index.json"


def decode_zalo_filenoise_bytes(raw_bytes: bytes) -> Tuple[bytes, bool]:
    """
    Giải mã mảng byte bị Zalo làm nhiễu trên bộ nhớ.
    1. XOR 0x93 cho 100 byte đầu tiên (hoặc toàn bộ nếu file < 100 bytes).
    2. Cắt bỏ hậu tố b'\\x07zAlO\\x07' (6 bytes cuối) nếu tồn tại.
    """
    if not raw_bytes:
        return b"", False
    
    prefix_len = min(ZALO_XOR_LEN, len(raw_bytes))
    prefix = bytes([b ^ ZALO_XOR_KEY for b in raw_bytes[:prefix_len]])
    decoded = prefix + raw_bytes[prefix_len:]
    
    has_suffix = decoded.endswith(ZALO_NOISE_SUFFIX)
    if has_suffix:
        decoded = decoded[:-len(ZALO_NOISE_SUFFIX)]
        
    return decoded, has_suffix


def inspect_zip_based_document(decoded_bytes: bytes) -> Dict[str, Any]:
    """
    Phân tích định dạng tệp nén ZIP / Office OpenXML (XLSX, DOCX, PPTX, ZIP).
    Trích xuất tên Sheet, văn bản sharedStrings hoặc tiêu đề DOCX.
    """
    info: Dict[str, Any] = {
        "format": "ZIP",
        "extension": ".zip",
        "mime_type": "application/zip",
        "meta": {}
    }
    try:
        with zipfile.ZipFile(io.BytesIO(decoded_bytes)) as zf:
            namelist = set(zf.namelist())
            
            # 1. Tệp Microsoft Excel (.xlsx)
            if "xl/workbook.xml" in namelist:
                info["format"] = "XLSX"
                info["extension"] = ".xlsx"
                info["mime_type"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                
                # Trích xuất danh sách sheet
                sheets = []
                try:
                    wb_xml = zf.read("xl/workbook.xml")
                    wb_root = ET.fromstring(wb_xml)
                    for elem in wb_root.iter():
                        if elem.tag.endswith("sheet"):
                            s_name = elem.attrib.get("name")
                            if s_name:
                                sheets.append(s_name)
                except Exception:
                    pass
                info["meta"]["sheets"] = sheets
                
                # Trích xuất các chuỗi tiêu đề từ sharedStrings
                sample_strings = []
                if "xl/sharedStrings.xml" in namelist:
                    try:
                        ss_xml = zf.read("xl/sharedStrings.xml")
                        ss_root = ET.fromstring(ss_xml)
                        for elem in ss_root.iter():
                            if elem.tag.endswith("t") and elem.text:
                                t = elem.text.strip()
                                if t and t not in sample_strings:
                                    sample_strings.append(t)
                                    if len(sample_strings) >= 30:
                                        break
                    except Exception:
                        pass
                info["meta"]["sample_strings"] = sample_strings
                
            # 2. Tệp Microsoft Word (.docx)
            elif "word/document.xml" in namelist:
                info["format"] = "DOCX"
                info["extension"] = ".docx"
                info["mime_type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                
                texts = []
                try:
                    doc_xml = zf.read("word/document.xml")
                    doc_root = ET.fromstring(doc_xml)
                    for elem in doc_root.iter():
                        if elem.tag.endswith("t") and elem.text:
                            txt = elem.text.strip()
                            if txt:
                                texts.append(txt)
                except Exception:
                    pass
                info["meta"]["word_count"] = len(texts)
                info["meta"]["text_preview"] = " ".join(texts[:40]) if texts else ""
                
            # 3. Tệp PowerPoint (.pptx)
            elif "ppt/presentation.xml" in namelist:
                info["format"] = "PPTX"
                info["extension"] = ".pptx"
                info["mime_type"] = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                
            # 4. Tệp nén ZIP thông thường
            else:
                info["meta"]["archive_entries"] = list(namelist)[:25]
                info["meta"]["total_files_in_zip"] = len(namelist)
                
            # Đọc metadata chung từ docProps/core.xml nếu có
            if "docProps/core.xml" in namelist:
                try:
                    core_xml = zf.read("docProps/core.xml")
                    core_root = ET.fromstring(core_xml)
                    for elem in core_root.iter():
                        tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
                        if tag in ["title", "creator", "lastModifiedBy", "created", "modified"] and elem.text:
                            info["meta"][tag] = elem.text.strip()
                except Exception:
                    pass
                    
    except zipfile.BadZipFile:
        info["format"] = "CORRUPTED_ZIP"
        info["meta"]["error"] = "BadZipFile"
    except Exception as e:
        info["format"] = "ZIP_READ_ERROR"
        info["meta"]["error"] = str(e)
        
    return info


def inspect_pdf_document(decoded_bytes: bytes) -> Dict[str, Any]:
    """
    Trích xuất siêu dữ liệu và tóm tắt nội dung PDF trực tiếp trên bộ nhớ.
    """
    info: Dict[str, Any] = {
        "format": "PDF",
        "extension": ".pdf",
        "mime_type": "application/pdf",
        "meta": {}
    }
    
    # 1. Thử dùng PyMuPDF nếu có
    if HAVE_PYMUPDF:
        try:
            doc = fitz.open(stream=decoded_bytes, filetype="pdf")
            info["meta"]["pages"] = doc.page_count
            meta = doc.metadata or {}
            for k in ["title", "author", "creator", "producer", "creationDate"]:
                if meta.get(k):
                    info["meta"][k] = meta[k]
                    
            if doc.page_count > 0:
                p1_text = doc[0].get_text().strip()
                # Lấy 300 ký tự đầu tiên
                clean_preview = re.sub(r"\s+", " ", p1_text)[:300]
                info["meta"]["text_preview"] = clean_preview
            doc.close()
            return info
        except Exception as e:
            info["meta"]["pymupdf_error"] = str(e)

    # 2. Phương thức fallback dựa trên biểu thức chính quy (Regex)
    head_bytes = decoded_bytes[:4096]
    tail_bytes = decoded_bytes[-4096:] if len(decoded_bytes) > 4096 else b""
    sample_bytes = head_bytes + tail_bytes
    
    title_m = re.search(rb'/Title\s*\((.*?)\)', sample_bytes)
    if title_m:
        try:
            info["meta"]["title"] = title_m.group(1).decode("utf-8", errors="ignore")
        except Exception:
            pass
            
    author_m = re.search(rb'/Author\s*\((.*?)\)', sample_bytes)
    if author_m:
        try:
            info["meta"]["author"] = author_m.group(1).decode("utf-8", errors="ignore")
        except Exception:
            pass
            
    pages_count = len(re.findall(rb'/Type\s*/Page\b', decoded_bytes))
    if pages_count > 0:
        info["meta"]["estimated_pages"] = pages_count
        
    return info


def detect_file_format(decoded_bytes: bytes) -> Dict[str, Any]:
    """
    Nhận diện định dạng tệp thực tế dựa vào Magic Bytes và cấu trúc nhị phân.
    """
    if not decoded_bytes:
        return {"format": "EMPTY", "extension": ".bin", "mime_type": "application/octet-stream", "meta": {}}
        
    # Chuẩn hóa nếu có byte rỗng/dòng mới trước định dạng
    stripped_prefix = decoded_bytes[:64].lstrip(b"\r\n\x00 ")
    
    # 1. PDF
    if decoded_bytes.startswith(b"%PDF") or stripped_prefix.startswith(b"%PDF"):
        return inspect_pdf_document(decoded_bytes)
        
    # 2. PK (ZIP, XLSX, DOCX, PPTX)
    if decoded_bytes.startswith(b"PK\x03\x04"):
        return inspect_zip_based_document(decoded_bytes)
        
    # 3. JPEG
    if decoded_bytes.startswith(b"\xff\xd8\xff"):
        return {
            "format": "JPG",
            "extension": ".jpg",
            "mime_type": "image/jpeg",
            "meta": {}
        }
        
    # 4. PNG
    if decoded_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return {
            "format": "PNG",
            "extension": ".png",
            "mime_type": "image/png",
            "meta": {}
        }
        
    # 5. AutoCAD DWG
    if decoded_bytes.startswith(b"AC10"):
        ver = decoded_bytes[:6].decode("ascii", errors="ignore")
        return {
            "format": "DWG",
            "extension": ".dwg",
            "mime_type": "application/acad",
            "meta": {"dwg_version": ver}
        }
        
    # 6. RAR
    if decoded_bytes.startswith(b"Rar!\x1a\x07"):
        return {
            "format": "RAR",
            "extension": ".rar",
            "mime_type": "application/x-rar-compressed",
            "meta": {}
        }
        
    # 7. 7-Zip
    if decoded_bytes.startswith(b"7z\xbc\xaf\x27\x1c"):
        return {
            "format": "7Z",
            "extension": ".7z",
            "mime_type": "application/x-7z-compressed",
            "meta": {}
        }
        
    # 8. OLE2 Compound Document (.xls / .doc cũ)
    if decoded_bytes.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"):
        meta: Dict[str, Any] = {}
        if b"W\x00o\x00r\x00k\x00b\x00o\x00o\x00k\x00" in decoded_bytes or b"B\x00o\x00o\x00k\x00" in decoded_bytes or b"Workbook" in decoded_bytes:
            fmt = "XLS"
            ext = ".xls"
            mime = "application/vnd.ms-excel"
        elif b"W\x00o\x00r\x00d\x00D\x00o\x00c\x00u\x00m\x00e\x00n\x00t" in decoded_bytes or b"WordDocument" in decoded_bytes:
            fmt = "DOC"
            ext = ".doc"
            mime = "application/msword"
        else:
            fmt = "OLE_OFFICE"
            ext = ".ole"
            mime = "application/x-ole-storage"
        return {"format": fmt, "extension": ext, "mime_type": mime, "meta": meta}
        
    # 9. RTF
    if decoded_bytes.startswith(b"{\\rtf"):
        return {
            "format": "RTF",
            "extension": ".rtf",
            "mime_type": "application/rtf",
            "meta": {}
        }
        
    # 10. MP4 Video / Audio container
    if len(decoded_bytes) >= 12 and decoded_bytes[4:8] == b"ftyp":
        brand = decoded_bytes[8:12].decode("ascii", errors="ignore")
        return {
            "format": "MP4",
            "extension": ".mp4",
            "mime_type": "video/mp4",
            "meta": {"major_brand": brand}
        }
        
    # 11. MP3 Audio
    if decoded_bytes.startswith(b"ID3") or decoded_bytes.startswith(b"\xff\xfb"):
        return {
            "format": "MP3",
            "extension": ".mp3",
            "mime_type": "audio/mpeg",
            "meta": {}
        }
        
    # 12. Kiểm tra văn bản thuần túy (Text/JSON/XML/CSV)
    try:
        sample_str = decoded_bytes[:2048].decode("utf-8")
        if sample_str.startswith("{") or sample_str.startswith("["):
            return {"format": "JSON", "extension": ".json", "mime_type": "application/json", "meta": {}}
        if sample_str.startswith("<?xml") or sample_str.startswith("<html"):
            return {"format": "XML", "extension": ".xml", "mime_type": "text/xml", "meta": {}}
        return {"format": "TEXT", "extension": ".txt", "mime_type": "text/plain", "meta": {"preview": sample_str[:150]}}
    except UnicodeDecodeError:
        pass
        
    # Mặc định file nhị phân không rõ
    hex_sig = decoded_bytes[:8].hex()
    return {
        "format": "BINARY",
        "extension": ".bin",
        "mime_type": "application/octet-stream",
        "meta": {"header_hex": hex_sig}
    }


def scan_and_decode_filenoise(
    target_dirs: Optional[List[str]] = None,
    include_resources: bool = True,
    output_json: Optional[str] = None
) -> Dict[str, Any]:
    """
    Quét toàn bộ thư mục chỉ định, giải mã và lập chỉ mục SHA-256.
    """
    t_start = time.time()
    
    # 1. Tập hợp các thư mục cần quét
    search_dirs: List[str] = []
    if target_dirs:
        for d in target_dirs:
            if os.path.exists(d) and d not in search_dirs:
                search_dirs.append(d)
    else:
        for d in DEFAULT_SEARCH_PATHS:
            if os.path.exists(d) and d not in search_dirs:
                search_dirs.append(d)
                
    # Nếu bật include_resources, tìm kiếm thêm các thư mục fileNoise lồng trong ZaloDownloads/resource/*
    if include_resources and os.path.exists(DEFAULT_ZALO_MEDIA_DIR):
        pattern = os.path.join(DEFAULT_ZALO_MEDIA_DIR, "**", "fileNoise")
        for nested in glob.glob(pattern, recursive=True):
            if os.path.isdir(nested) and nested not in search_dirs:
                search_dirs.append(nested)

    all_files: List[Tuple[str, str]] = []  # (dir_path, filename)
    for s_dir in search_dirs:
        try:
            entries = os.listdir(s_dir)
            for fname in entries:
                f_path = os.path.join(s_dir, fname)
                if os.path.isfile(f_path):
                    # Bỏ qua tệp hệ thống .rescache
                    if fname == ".rescache":
                        continue
                    all_files.append((s_dir, fname))
        except Exception:
            pass

    records: List[Dict[str, Any]] = []
    format_counts: Dict[str, int] = {}
    total_raw_bytes = 0
    total_decoded_bytes = 0

    for s_dir, fname in all_files:
        f_path = os.path.join(s_dir, fname)
        try:
            stat = os.stat(f_path)
            raw_size = stat.st_size
            total_raw_bytes += raw_size
            
            with open(f_path, "rb") as fp:
                raw_bytes = fp.read()
                
            # Giải mã trên bộ nhớ
            decoded_bytes, has_suffix = decode_zalo_filenoise_bytes(raw_bytes)
            dec_size = len(decoded_bytes)
            total_decoded_bytes += dec_size
            
            # Tính mã băm SHA-256 của nội dung giải mã
            sha256_hash = hashlib.sha256(decoded_bytes).hexdigest()
            
            # Nhận diện định dạng tệp
            det = detect_file_format(decoded_bytes)
            fmt = det["format"]
            format_counts[fmt] = format_counts.get(fmt, 0) + 1
            
            record = {
                "file_id": fname,
                "source_path": f_path,
                "source_dir": s_dir,
                "original_size": raw_size,
                "decoded_size": dec_size,
                "sha256": sha256_hash,
                "has_zalo_noise_suffix": has_suffix,
                "format": fmt,
                "extension": det["extension"],
                "mime_type": det["mime_type"],
                "metadata": det["meta"],
                "mtime": stat.st_mtime
            }
            records.append(record)
        except Exception as e:
            records.append({
                "file_id": fname,
                "source_path": f_path,
                "error": str(e)
            })

    t_end = time.time()
    elapsed_ms = (t_end - t_start) * 1000.0

    result = {
        "status": "SUCCESS",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "elapsed_ms": round(elapsed_ms, 2),
        "total_files_scanned": len(records),
        "total_raw_bytes": total_raw_bytes,
        "total_decoded_bytes": total_decoded_bytes,
        "format_summary": format_counts,
        "scanned_directories_count": len(search_dirs),
        "scanned_directories": search_dirs,
        "items": records
    }

    # Ghi ra file JSON kết quả
    out_path = output_json or DEFAULT_OUTPUT_INDEX
    out_dir = os.path.dirname(out_path)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir, exist_ok=True)

    with open(out_path, "w", encoding="utf-8") as f_out:
        json.dump(result, f_out, ensure_ascii=False, indent=2)

    return result


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Zalo fileNoise In-Memory Decoder & Fast Indexer")
    parser.add_argument("--dir", action="append", help="Thư mục fileNoise cần quét (có thể chỉ định nhiều lần)")
    parser.add_argument("--no-resources", action="store_true", help="Không quét sâu vào ZaloDownloads/resource/*/fileNoise")
    parser.add_argument("--output", default=DEFAULT_OUTPUT_INDEX, help="Đường dẫn file JSON đầu ra")
    args = parser.parse_args()

    print("[*] Đang khởi chạy Zalo FileNoise Decoder với mức ưu tiên IDLE (0x00000040)...")
    res = scan_and_decode_filenoise(
        target_dirs=args.dir,
        include_resources=not args.no_resources,
        output_json=args.output
    )
    
    print(f"[+] Hoàn tất giải mã & lập chỉ mục:")
    print(f"    - Thời gian thực thi: {res['elapsed_ms']} ms")
    print(f"    - Tổng số file quét: {res['total_files_scanned']}")
    print(f"    - Tổng dung lượng giải mã: {res['total_decoded_bytes'] / (1024*1024):.2f} MB")
    print(f"    - Phân bổ định dạng: {res['format_summary']}")
    print(f"    - File kết quả: {args.output}")
