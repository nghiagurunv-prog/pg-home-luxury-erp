# -*- coding: utf-8 -*-
"""
PG HOME LUXURY - ZALO EXCEL DEEP EXTRACTOR V2.0
Khoanh vùng độc lập: Giải mã in-memory trên RAM 166 file Excel (.filenoise)
Bóc tách toàn diện các bảng báo giá, hợp đồng thi công, đơn hàng Acrylic NTD và phụ kiện
Đặc biệt chuẩn hóa số liệu tháng 10 và tháng 11/2026.
"""

import os
import sys
import io
import re
import json
try:
    import pg_fast_io as _pg_fast_io
    json = _pg_fast_io.json
except Exception:
    pass
from datetime import datetime
import openpyxl
import xlrd

INDEX_FILE = r'f:\PG Home - Quản trị\data\zalo_filenoise_index.json'
OUTPUT_FILE = r'f:\PG Home - Quản trị\data\zalo_excel_quotations_audit.json'

# Ánh xạ Zalo ID sang tên nhân sự / nhà cung cấp thực tế đã kiểm chứng
ZALO_ID_MAP = {
    '2304805760907141944': 'Nguyễn Viết Nghĩa (Giám Đốc - Admin)',
    '7617747951538527859': 'Tống Trần Hiệp (Sale Admin)',
    '1266851172782015824': 'Đường Việt Dũng (Sale / Kỹ thuật)',
    '3272002571838670252': 'Lưu Thị Thu Hương (Sale)',
    '2845688247116683961': 'Vũ (Kỹ thuật xưởng PG Home - Bóc tách cắt cánh)',
    '337278748333353578': 'Cty CP NTD Acrylic (Kinh doanh NTD)',
    '5696499100057584074': 'Cty CP NTD Acrylic (Kinh doanh NTD)',
    '7455619656818200755': 'Kế toán NTD Acrylic',
    '3689145980600156662': 'Nhà cung cấp Phụ kiện Cadman / Phụ kiện bếp'
}

GROUP_ID_MAP = {
    'g2539027971900219384': 'Nhóm Zalo Đặt Hàng NTD Acrylic',
    'g2210130381397538159': 'Nhóm Zalo Quản Trị & Sale PG Home',
    'g495486322416346660': 'Nhóm Zalo Nhà Cung Cấp Phụ Kiện Cadman',
    'g6116598459303638566': 'Nhóm Zalo Kế Toán & Đối Soát Công Nợ'
}

def decode_filenoise(file_path):
    """
    Giải mã In-Memory: Cắt 6-byte footer b'\\x07zAlO\\x07' nếu có,
    XOR 100 bytes đầu với 0x93.
    TUYỆT ĐỐI KHÔNG GHI RA ĐĨA, trả về bytes trong RAM.
    """
    with open(file_path, 'rb') as f:
        raw = f.read()
    if raw.endswith(b'\x07zAlO\x07'):
        raw = raw[:-6]
    if len(raw) >= 100:
        head = bytes([b ^ 0x93 for b in raw[:100]])
        return head + raw[100:]
    elif len(raw) > 0:
        head = bytes([b ^ 0x93 for b in raw])
        return head
    return raw

def parse_filename_meta(fid):
    """
    Phân tích tên file theo mẫu: <timestamp_ms>_<sender_id>_<group_or_chat_id>
    """
    parts = fid.split('_')
    meta = {
        'timestamp_ms': None,
        'sender_zalo_id': None,
        'sender_name': None,
        'chat_or_group_id': None,
        'group_name': None
    }
    if len(parts) >= 3 and parts[0].isdigit():
        try:
            meta['timestamp_ms'] = int(parts[0])
            meta['sender_zalo_id'] = parts[1]
            meta['sender_name'] = ZALO_ID_MAP.get(parts[1], f"ZaloID:{parts[1]}")
            meta['chat_or_group_id'] = parts[2]
            meta['group_name'] = GROUP_ID_MAP.get(parts[2], f"GroupID:{parts[2]}")
        except Exception:
            pass
    return meta

def extract_rows_from_bytes(file_bytes, fmt):
    """
    Đọc tất cả các sheet và trả về dict {sheet_name: [list of row lists]}
    """
    sheets_data = {}
    if fmt == 'XLSX':
        try:
            wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
            for sname in wb.sheetnames:
                ws = wb[sname]
                rows = []
                for row in ws.iter_rows(values_only=True):
                    if any(c is not None for c in row):
                        rows.append(list(row))
                sheets_data[sname] = rows
        except Exception as e:
            sheets_data['__error__'] = str(e)
    elif fmt == 'XLS':
        try:
            book = xlrd.open_workbook(file_contents=file_bytes)
            for sidx in range(book.nsheets):
                sh = book.sheet_by_index(sidx)
                rows = []
                for r in range(sh.nrows):
                    row = [sh.cell_value(r, c) for c in range(sh.ncols)]
                    if any(c != '' and c is not None for c in row):
                        rows.append(row)
                sheets_data[book.sheet_names()[sidx]] = rows
        except Exception as e:
            sheets_data['__error__'] = str(e)
    return sheets_data

def parse_ntd_acrylic_sheet(rows, sheet_name):
    """
    Bóc tách chuyên sâu mẫu phiếu đơn hàng NTD Acrylic
    """
    info = {
        'type': 'NTD_ACRYLIC_ORDER',
        'sheet_name': sheet_name,
        'order_number': None,
        'order_date': None,
        'customer_name': None,
        'raw_client_string': None,
        'total_amount': 0.0,
        'total_amount_str': None,
        'total_sqm': 0.0,
        'item_count': 0,
        'items_preview': []
    }
    
    for r in rows[:25]:
        row_str = ' '.join([str(c) for c in r if c is not None]).strip()
        
        # Số đơn hàng và ngày
        m_so = re.search(r'Số\s*đơn\s*hàng\s*:\s*([0-9]+)', row_str, re.IGNORECASE)
        if m_so:
            info['order_number'] = m_so.group(1).strip()
            
        m_date = re.search(r'Hà\s*Nội,\s*ngày\s*([0-9\s]+)tháng\s*([0-9\s]+)năm\s*([0-9\s]+)', row_str, re.IGNORECASE)
        if m_date:
            d = m_date.group(1).strip()
            m = m_date.group(2).strip()
            y = m_date.group(3).strip()
            info['order_date'] = f"{d.zfill(2)}/{m.zfill(2)}/{y}"
            
        # Bên A đặt hàng
        if 'Bên A' in row_str or 'đặt hàng' in row_str:
            m_a = re.search(r'Bên\s*A[^:]*:\s*([^\n\r]+)', row_str, re.IGNORECASE)
            if m_a:
                raw_client = m_a.group(1).strip()
                info['raw_client_string'] = raw_client
                # Bóc tách tên khách cụ thể
                # VD: "Phú Gia-Hà Tĩnh-C Hoa" -> "Chị Hoa"
                # "Phú Gia-Hà Tĩnh-Bắc Phát" -> "Bác Phát"
                # "Phú Gia-Hà Tĩnh-A Công" -> "Anh Công"
                client_part = raw_client.split('-')[-1].strip()
                if client_part.lower().startswith('c '):
                    info['customer_name'] = 'Chị ' + client_part[2:].strip().title()
                elif client_part.lower().startswith('a '):
                    info['customer_name'] = 'Anh ' + client_part[2:].strip().title()
                elif 'bắc phát' in client_part.lower() or 'bác phát' in client_part.lower():
                    info['customer_name'] = 'Bác Phát'
                else:
                    info['customer_name'] = client_part.title()

    # Quét cuối bảng lấy tổng số m2 và thành tiền
    for r in rows:
        row_str = ' '.join([str(c) for c in r if c is not None]).strip().lower()
        if 'tổng tiền đơn hàng' in row_str or 'tổng cộng' in row_str:
            nums = [c for c in r if isinstance(c, (int, float)) and c > 0]
            if nums:
                val = nums[-1]
                if val > 1000:
                    info['total_amount'] = float(val)
                    info['total_amount_str'] = f"{val:,.0f} đ"
                if len(nums) >= 2 and nums[-2] < 1000: # thường là số m2
                    info['total_sqm'] = round(float(nums[-2]), 2)
                if len(nums) >= 3 and isinstance(nums[0], (int, float)):
                    info['item_count'] = int(nums[0])
                    
    return info

def parse_ds_xuong_sheet(rows, sheet_name):
    """
    Bóc tách chuyên sâu sheet theo dõi Hợp đồng thi công xưởng T8, T9, T10
    """
    info = {
        'type': 'DS_XUONG_CONTRACT_TRACKING',
        'sheet_name': sheet_name,
        'title': None,
        'month': None,
        'total_sale_revenue': 0.0,
        'total_sale_revenue_str': None,
        'contracts': []
    }
    
    if rows:
        first_line = ' '.join([str(c) for c in rows[0] if c is not None]).strip()
        info['title'] = first_line
        m_month = re.search(r'tháng\s*(\d+)/(\d{4})', first_line, re.IGNORECASE)
        if m_month:
            info['month'] = f"Tháng {m_month.group(1)}/{m_month.group(2)}"

    current_pic = None
    for r in rows[1:]:
        line = ' '.join([str(c) for c in r if c is not None and str(c).strip() != '']).strip()
        if not line:
            continue
            
        # Kiểm tra nhân viên phụ trách
        pic_cand = str(r[1]).strip() if len(r) > 1 and r[1] is not None else ''
        if pic_cand and not any(pic_cand.lower().startswith(x) for x in ['stt', 'tổng', 'nhân viên']):
            current_pic = pic_cand
            
        # Kiểm tra dòng hợp đồng khách hàng
        # Thường có tên khách ở cột 2 hoặc 3, địa chỉ, giá trị hợp đồng
        row_str = ' '.join([str(c) for c in r if c is not None])
        if 'tổng cộng phòng sale' in row_str.lower():
            nums = [float(c) for c in r if isinstance(c, (int, float)) and c > 1000000]
            if nums:
                info['total_sale_revenue'] = nums[0]
                info['total_sale_revenue_str'] = f"{nums[0]:,.0f} đ"
            continue
            
        if 'tổng' in str(r[0]).lower() or (len(r) > 1 and 'tổng' in str(r[1]).lower()) or (len(r) > 2 and 'tổng' in str(r[2]).lower()):
            continue
            
        client_cand = str(r[2]).strip() if len(r) > 2 and r[2] is not None else ''
        addr_cand = str(r[3]).strip() if len(r) > 3 and r[3] is not None else ''
        
        # Nếu cột 2 là số STT thì tên khách có thể ở cột 3
        if not client_cand or client_cand.isdigit():
            client_cand = str(r[3]).strip() if len(r) > 3 and r[3] is not None else ''
            addr_cand = str(r[4]).strip() if len(r) > 4 and r[4] is not None else ''
            
        # Lấy giá trị hợp đồng
        nums = [float(c) for c in r if isinstance(c, (int, float)) and c > 100000]
        if client_cand and len(client_cand) > 1 and nums:
            contract_val = nums[0]
            info['contracts'].append({
                'person_in_charge': current_pic,
                'customer_name': client_cand,
                'address': addr_cand,
                'contract_value': contract_val,
                'contract_value_str': f"{contract_val:,.0f} đ",
                'raw_row': line
            })
            
    return info

def parse_standard_quotation_sheet(rows, sheet_name, file_id=""):
    """
    Bóc tách bảng báo giá / dự toán nội thất chuẩn của PG Home Luxury
    """
    info = {
        'type': 'STANDARD_QUOTATION',
        'sheet_name': sheet_name,
        'title': None,
        'customer_name': None,
        'project_name': None,
        'address': None,
        'date_text': None,
        'company_branch': 'Nội Thất Phú Gia - PG Home Luxury',
        'grand_total': 0.0,
        'grand_total_str': None,
        'material_tier_totals': {},
        'garis_hardware_total': None,
        'led_accessories_total': None,
        'detected_rooms': [],
        'items_count': 0
    }
    
    # 1. Tìm tiêu đề
    for r in rows[:15]:
        line = ' '.join([str(c) for c in r if c is not None]).strip()
        if not info['title']:
            u = line.upper()
            if any(k in u for k in ['BẢNG BÁO GIÁ THI CÔNG', 'BẢNG BÁO GIÁ NỘI THẤT', 'BẢNG BÁO GIÁ PHỤ KIỆN', 'BẢNG DỰ TOÁN', 'DỰ TOÁN KHỐI LƯỢNG']):
                info['title'] = line
                
    # 2. Tìm Customer, Project, Address, Date trong 30 dòng đầu
    for r in rows[:30]:
        for cell in r:
            if cell is None:
                continue
            scell = str(cell).strip()
            if not scell:
                continue
            
            # CĐT / Khách hàng
            if not info['customer_name']:
                m = re.search(r'(?:chủ\s*đầu\s*tư|khách\s*hàng|tên\s*khách\s*hàng|cđt)\s*[:;]\s*([^\n\r]+)', scell, re.IGNORECASE)
                if m:
                    cand = m.group(1).strip()
                    if cand and not any(cand.lower().startswith(x) for x in ['quý khách', 'cty', 'công ty']):
                        info['customer_name'] = cand
                        
            # Công trình
            if not info['project_name']:
                m = re.search(r'(?:công\s*trình)\s*[:;]\s*([^\n\r]+)', scell, re.IGNORECASE)
                if m:
                    info['project_name'] = m.group(1).strip()
                    
            # Hạng mục
            if not info['project_name']:
                m = re.search(r'(?:hạng\s*mục)\s*[:;]\s*([^\n\r]+)', scell, re.IGNORECASE)
                if m:
                    cand_hm = m.group(1).strip()
                    if len(cand_hm) > 3 and not cand_hm.lower().startswith('stt'):
                        info['project_name'] = cand_hm

            # Địa chỉ
            if not info['address']:
                m = re.search(r'(?:địa\s*chỉ|đ\/c)\s*[:;]\s*([^\n\r]+)', scell, re.IGNORECASE)
                if m:
                    info['address'] = m.group(1).strip()

            # Ngày lập
            if not info['date_text']:
                m = re.search(r'(?:hà\s*tĩnh,?\s*)?(?:ngày\s*\d+\s*tháng\s*\d+\s*năm\s*\d{4})', scell, re.IGNORECASE)
                if m:
                    info['date_text'] = m.group(0).strip()

    # Nhận diện đặc biệt Báo Giá Nhà Anh Nam (Mục 24 GEMINI.md)
    # File fa552d1e7b482a374cab2d4d5e450f81 hoặc 1793933002496 hoặc 4de4b56a5d28798b24f27e910e90dd73
    full_sheet_str = ' '.join([' '.join([str(c) for c in r if c is not None]) for r in rows[:25]])
    if '3770' in full_sheet_str and 'pitech thebest' in full_sheet_str.lower() and 'kệ tivi bo cong' in full_sheet_str.lower():
        info['customer_name'] = 'Anh Nam'
        info['project_name'] = 'Biệt thự / Nhà ở tư nhân nhà anh Nam (Chuẩn hóa Mục 24 GEMINI.md)'
        if not info['title']:
            info['title'] = 'BẢNG BÁO GIÁ THI CÔNG NỘI THẤT CAO CẤP - NHÀ ANH NAM'

    # 3. Quét danh sách các phòng
    room_patterns = [
        re.compile(r'^(?:[I|V|X|0-9]+[\.\-\–\s]+)?(phòng\s+khách)', re.IGNORECASE),
        re.compile(r'^(?:[I|V|X|0-9]+[\.\-\–\s]+)?(phòng\s+bếp)', re.IGNORECASE),
        re.compile(r'^(?:[I|V|X|0-9]+[\.\-\–\s]+)?(phòng\s+ngủ[^\n\r]*)', re.IGNORECASE),
        re.compile(r'^(?:[I|V|X|0-9]+[\.\-\–\s]+)?(phòng\s+thờ)', re.IGNORECASE),
        re.compile(r'^(?:[I|V|X|0-9]+[\.\-\–\s]+)?(phòng\s+giặt[^\n\r]*)', re.IGNORECASE),
        re.compile(r'^(?:[I|V|X|0-9]+[\.\-\–\s]+)?(phòng\s+wc[^\n\r]*|wc[0-9]*)', re.IGNORECASE),
        re.compile(r'^(?:[I|V|X|0-9]+[\.\-\–\s]+)?(phụ\s+kiện\s+bếp|phụ\s+kiện\s+đèn\s+led)', re.IGNORECASE)
    ]
    for r in rows:
        line = ' '.join([str(c) for c in r if c is not None]).strip()
        for rp in room_patterns:
            m = rp.search(line)
            if m:
                rm = m.group(0).strip()
                if len(rm) < 60 and rm not in info['detected_rooms']:
                    info['detected_rooms'].append(rm)
                break
                
    # 4. Quét tổng tiền và các phân cấp vật liệu
    for r in rows:
        line = ' '.join([str(c) for c in r if c is not None]).strip()
        l_line = line.lower()
        
        # Báo giá nhà anh Nam có 2 cột MDF An Cường & Thái Lan: R57: Tổng cộng phần nội thất | 314797000 | 284360000
        if 'tổng cộng phần nội thất' in l_line:
            nums = [float(c) for c in r if isinstance(c, (int, float)) and c > 1000000]
            if nums:
                info['material_tier_totals']['MDF_An_Cuong'] = nums[0]
                info['material_tier_totals']['MDF_An_Cuong_str'] = f"{nums[0]:,.0f} đ"
                info['grand_total'] = nums[0]
                info['grand_total_str'] = f"{nums[0]:,.0f} đ"
                if len(nums) > 1:
                    info['material_tier_totals']['Thai_Lan'] = nums[1]
                    info['material_tier_totals']['Thai_Lan_str'] = f"{nums[1]:,.0f} đ"
                    
        elif 'tổng cộng' in l_line or 'tổng giá trị' in l_line or 'tổng thành tiền' in l_line:
            nums = [float(c) for c in r if isinstance(c, (int, float)) and c > 1000000]
            if nums and info['grand_total'] == 0:
                info['grand_total'] = nums[0]
                info['grand_total_str'] = f"{nums[0]:,.0f} đ"
                if len(nums) > 1:
                    info['material_tier_totals']['Cấp 2'] = nums[1]
                    info['material_tier_totals']['Cấp 2_str'] = f"{nums[1]:,.0f} đ"
                    
    # Nếu chưa có grand_total, thử tìm dòng 'Tổng:' cuối cùng
    if info['grand_total'] == 0:
        for r in reversed(rows):
            line = ' '.join([str(c) for c in r if c is not None]).strip().lower()
            if line.startswith('tổng:') or line.startswith('tổng :'):
                nums = [float(c) for c in r if isinstance(c, (int, float)) and c > 1000000]
                if nums:
                    info['grand_total'] = nums[0]
                    info['grand_total_str'] = f"{nums[0]:,.0f} đ"
                    break

    info['items_count'] = len(rows)
    return info

def process_file_deep(item):
    """
    Xử lý giải mã và bóc tách sâu một file Excel
    """
    fid = item['file_id']
    fmt = item['format']
    path = item['source_path']
    mtime = item.get('mtime', 0)
    dt_str = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
    meta = item.get('metadata', {})
    fn_meta = parse_filename_meta(fid)

    res = {
        'file_id': fid,
        'source_path': path,
        'format': fmt,
        'mtime': mtime,
        'datetime': dt_str,
        'sender_zalo_id': fn_meta['sender_zalo_id'],
        'sender_name': fn_meta['sender_name'],
        'chat_or_group_id': fn_meta['chat_or_group_id'],
        'group_name': fn_meta['group_name'],
        'creator': meta.get('creator', ''),
        'last_modified_by': meta.get('lastModifiedBy', ''),
        'doc_created': meta.get('created', ''),
        'doc_modified': meta.get('modified', ''),
        'category': 'OTHER',
        'key_customer': None,
        'key_project': None,
        'key_total_amount': 0.0,
        'key_total_formatted': None,
        'sheets_analyzed': []
    }

    try:
        dec = decode_filenoise(path)
        sheets_data = extract_rows_from_bytes(dec, fmt)
        if '__error__' in sheets_data:
            res['error'] = sheets_data['__error__']
            return res

        for sname, rows in sheets_data.items():
            s_text = ' '.join([' '.join([str(c) for c in r if c is not None]) for r in rows[:15]]).lower()
            
            if 'bảng thông tin các khách hàng nội thất đã ký hợp đồng' in s_text or 'ds xưởng' in sname.lower():
                s_info = parse_ds_xuong_sheet(rows, sname)
                res['sheets_analyzed'].append(s_info)
                res['category'] = 'DS_XUONG_CONTRACT_TRACKING'
                if s_info['total_sale_revenue'] > res['key_total_amount']:
                    res['key_total_amount'] = s_info['total_sale_revenue']
                    res['key_total_formatted'] = s_info['total_sale_revenue_str']
                    res['key_project'] = s_info['title']
                    res['key_customer'] = f"Nhiều khách hàng ({len(s_info['contracts'])} HĐ: {', '.join([c['customer_name'] for c in s_info['contracts'][:4]])}...)"

            elif 'ntd acrylic' in s_text or 'đơn hàng kiêm phiếu xuất kho' in s_text:
                s_info = parse_ntd_acrylic_sheet(rows, sname)
                res['sheets_analyzed'].append(s_info)
                res['category'] = 'NTD_ACRYLIC_ORDER'
                if s_info['total_amount'] > res['key_total_amount']:
                    res['key_total_amount'] = s_info['total_amount']
                    res['key_total_formatted'] = s_info['total_amount_str']
                    res['key_customer'] = s_info['customer_name']
                    res['key_project'] = f"Đơn hàng Acrylic NTD #{s_info['order_number']} (Cắt dán cánh thành phẩm)"

            elif 'phụ kiện inox cao cấp cadman' in s_text:
                res['category'] = 'CADMAN_ACCESSORIES_CATALOG'
                res['key_project'] = 'Bảng Báo Giá Phụ Kiện Inox Cao Cấp Cadman'
                res['key_customer'] = 'Nội Thất Phú Gia'
                res['sheets_analyzed'].append({'sheet_name': sname, 'type': 'CADMAN_CATALOG', 'rows': len(rows)})

            else:
                s_info = parse_standard_quotation_sheet(rows, sname, file_id=fid)
                res['sheets_analyzed'].append(s_info)
                if s_info['grand_total'] > 0 or s_info['customer_name']:
                    res['category'] = 'QUOTATION'
                    if s_info['grand_total'] > res['key_total_amount']:
                        res['key_total_amount'] = s_info['grand_total']
                        res['key_total_formatted'] = s_info['grand_total_str']
                    if s_info['customer_name'] and not res['key_customer']:
                        res['key_customer'] = s_info['customer_name']
                    if s_info['project_name'] and not res['key_project']:
                        res['key_project'] = s_info['project_name']

        # Nếu chưa tìm thấy customer trong sheet chuẩn, kiểm tra lại
        if not res['key_customer']:
            for s in res['sheets_analyzed']:
                if s.get('customer_name'):
                    res['key_customer'] = s['customer_name']
                    break

    except Exception as e:
        res['error'] = str(e)

    return res

def run_deep_extraction():
    print("=== BẮT ĐẦU GIẢI MÃ IN-MEMORY & BÓC TÁCH SÂU 166 FILE EXCEL FILENOISE ===")
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        index_data = json.load(f)

    items = [it for it in index_data.get('items', []) if it.get('format') in ['XLSX', 'XLS']]
    # Sắp xếp mtime giảm dần
    items.sort(key=lambda x: x.get('mtime', 0), reverse=True)

    extracted_records = []
    quotations_summary = []
    ntd_orders_summary = []
    contract_tracking_summary = []

    for idx, it in enumerate(items):
        rec = process_file_deep(it)
        extracted_records.append(rec)
        
        # Phân loại vào summary
        if rec['category'] == 'QUOTATION' and (rec['key_customer'] or rec['key_total_amount'] > 0):
            quotations_summary.append({
                'file_id': rec['file_id'],
                'datetime': rec['datetime'],
                'customer': rec['key_customer'],
                'project': rec['key_project'],
                'total_amount': rec['key_total_amount'],
                'total_formatted': rec['key_total_formatted'],
                'sender': rec['sender_name'] or rec['creator'] or rec['last_modified_by'],
                'doc_modified': rec['doc_modified']
            })
        elif rec['category'] == 'NTD_ACRYLIC_ORDER':
            ntd_orders_summary.append({
                'file_id': rec['file_id'],
                'datetime': rec['datetime'],
                'customer': rec['key_customer'],
                'project': rec['key_project'],
                'total_amount': rec['key_total_amount'],
                'total_formatted': rec['key_total_formatted'],
                'sender': rec['sender_name'],
                'group': rec['group_name']
            })
        elif rec['category'] == 'DS_XUONG_CONTRACT_TRACKING':
            contract_tracking_summary.append({
                'file_id': rec['file_id'],
                'datetime': rec['datetime'],
                'title': rec['key_project'],
                'total_amount': rec['key_total_amount'],
                'total_formatted': rec['key_total_formatted'],
                'sender': rec['sender_name'],
                'sheets_count': len(rec['sheets_analyzed'])
            })

        if (idx + 1) % 25 == 0 or (idx + 1) == len(items):
            print(f"Đã xử lý {idx + 1}/{len(items)} file...")

    payload = {
        'status': 'SUCCESS',
        'generated_at': datetime.now().isoformat(),
        'total_excel_files_scanned': len(items),
        'summary': {
            'total_quotations': len(quotations_summary),
            'total_ntd_acrylic_orders': len(ntd_orders_summary),
            'total_contract_tracking_files': len(contract_tracking_summary)
        },
        'quotations': quotations_summary,
        'ntd_acrylic_orders': ntd_orders_summary,
        'contract_tracking': contract_tracking_summary,
        'all_files_detail': extracted_records
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"\n [HOÀN TẤT] Đã xuất kết quả kiểm toán sâu ra file: {OUTPUT_FILE}")
    print(f" - Báo giá thi công nội thất: {len(quotations_summary)} file")
    print(f" - Đơn hàng cắt cánh Acrylic NTD: {len(ntd_orders_summary)} file")
    print(f" - File theo dõi hợp đồng thi công xưởng: {len(contract_tracking_summary)} file")

def print_audit_report():
    with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("================================================================================")
    print("      BÁO CÁO KIỂM TOÁN SÂU 166 FILE EXCEL FILENOISE - PG HOME LUXURY           ")
    print("================================================================================")
    print(f"Thời gian tạo: {data['generated_at']}")
    print(f"Tổng số file Excel (.filenoise) quét: {data['total_excel_files_scanned']}")
    print(f"1. Báo giá dự toán nội thất: {data['summary']['total_quotations']} file")
    print(f"2. Đơn hàng gia công cắt cánh Acrylic NTD: {data['summary']['total_ntd_acrylic_orders']} file")
    print(f"3. Sổ theo dõi ký hợp đồng & xưởng sản xuất: {data['summary']['total_contract_tracking_files']} file")
    
    print("\n--------------------------------------------------------------------------------")
    print("I. CÁC BÁO GIÁ THI CÔNG NỘI THẤT MỚI NHẤT (THÁNG 10 & 11/2026)")
    print("--------------------------------------------------------------------------------")
    for q in data['quotations'][:15]:
        dt = q['datetime']
        c = q['customer'] or 'Chưa xác định'
        p = q['project'] or 'Nhà ở tư nhân'
        val = q['total_formatted'] or '0 đ'
        s = q['sender'] or 'Hệ thống'
        print(f"[{dt}] CĐT: {c:<25} | Giá trị: {val:<16} | Người gửi: {s}")

    print("\n--------------------------------------------------------------------------------")
    print("II. CÁC ĐƠN HÀNG GIA CÔNG CÁNH ACRYLIC NTD (GỬI QUA NHÓM ZALO NTD ACRYLIC)")
    print("--------------------------------------------------------------------------------")
    for o in data['ntd_acrylic_orders'][:10]:
        dt = o['datetime']
        c = o['customer'] or 'Bổ sung'
        val = o['total_formatted'] or '0 đ'
        p = o['project']
        print(f"[{dt}] Đơn: {c:<20} | Thành tiền: {val:<16} | {p}")

    print("\n--------------------------------------------------------------------------------")
    print("III. DANH SÁCH KHÁCH HÀNG KÝ HỢP ĐỒNG & SẢN XUẤT XƯỞNG (THÁNG 8, 9, 10/2026)")
    print("--------------------------------------------------------------------------------")
    for rec in data['all_files_detail']:
        if rec['category'] == 'DS_XUONG_CONTRACT_TRACKING':
            for s in rec['sheets_analyzed']:
                if s.get('type') == 'DS_XUONG_CONTRACT_TRACKING':
                    print(f"\n>> {s.get('title')} (Tổng doanh số sale: {s.get('total_sale_revenue_str')}):")
                    for ct in s.get('contracts', []):
                        pic = ct.get('person_in_charge') or 'Sale'
                        cust = ct.get('customer_name')
                        val = ct.get('contract_value_str')
                        addr = ct.get('address')
                        print(f"   * {pic:<20} | CĐT: {cust:<20} | Đ/C: {addr:<15} | HĐ: {val}")
            break

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--report':
        print_audit_report()
    else:
        run_deep_extraction()
        print_audit_report()
