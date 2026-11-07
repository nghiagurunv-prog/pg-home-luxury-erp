# -*- coding: utf-8 -*-
"""
HỆ THỐNG QUÉT & TỔNG HỢP TOÀN BỘ 13 NHÓM ĐẶT HÀNG VẬT TƯ NĂM 2026 (ZALO PC)
Chạy ngầm 100% không ảnh hưởng công việc, không cướp chuột/bàn phím.
Xuất kết quả ra file JSON và cập nhật Hệ Thống Quản Trị PG Home.
"""
import os
import sys
import time
import json
import re
from datetime import datetime
import ctypes
from ctypes import wintypes

sys.stdout.reconfigure(encoding='utf-8')

user32 = ctypes.windll.user32

def switch_to_default_desktop():
    try:
        winsta0 = user32.OpenWindowStationW("WinSta0", False, 0x037F)
        if winsta0:
            user32.SetProcessWindowStation(winsta0)
            desk = user32.OpenDesktopW("Default", 0, False, 0x01FF)
            if desk:
                user32.SetThreadDesktop(desk)
                return True
    except Exception:
        pass
    return False

switch_to_default_desktop()

import uiautomation as auto

# 1. Tìm handles Zalo
render_hwnds = []
def enum_child(hwnd, lparam):
    cls = ctypes.create_unicode_buffer(256)
    user32.GetClassNameW(hwnd, cls, 256)
    if cls.value == 'Chrome_RenderWidgetHostHWND':
        render_hwnds.append(hwnd)
    return True

user32.EnumChildWindows(329060, ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(enum_child), 0)
if not render_hwnds:
    print("ERROR: Không tìm thấy Chrome_RenderWidgetHostHWND của Zalo!")
    sys.exit(1)

render_hwnd = render_hwnds[0]

class POINT(ctypes.Structure):
    _fields_ = [('x', ctypes.c_long), ('y', ctypes.c_long)]

def post_click(sx, sy):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    user32.PostMessageW(render_hwnd, 0x0201, 1, (pt.y << 16) | (pt.x & 0xFFFF))
    time.sleep(0.04)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

def post_wheel(sx, sy, delta):
    wParam = (delta & 0xFFFF) << 16
    lParam = (sy << 16) | (sx & 0xFFFF)
    user32.PostMessageW(render_hwnd, 0x020A, wParam, lParam)

# Khởi tạo Zalo root
ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
sidebar = app_page.GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
sub_pane = sidebar.GetChildren()[1]
conv_grid = sub_pane.GetChildren()[2]
cl = conv_grid.GetChildren()[0].GetChildren()[0].GetChildren()[0]
row0 = cl.GetChildren()[0]

group_items = row0.GetChildren()
print(f"Tổng số nhóm tìm thấy trong tab Đặt Hàng Phú Gia: {len(group_items)}")

resource_base = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource"

def extract_entities_from_text(all_text):
    data = {
        "customer_name": None,
        "phone": None,
        "address": None,
        "supplier_bank": None,
        "debt_amount": None,
        "order_codes": [],
        "amounts": []
    }
    # Tên
    name_m = re.search(r'(?:Họ\s*và\s*Tên|Khách\s*hàng|Người\s*nhận|Tên|nhà)\s*[:：]\s*([^\r\n,]+)', all_text, re.IGNORECASE)
    if name_m: 
        c_name = name_m.group(1).strip()
        if len(c_name) < 40 and not any(k in c_name.lower() for k in ['zalo', 'tin nhắn', 'chuyển khoản']):
            data["customer_name"] = c_name
    # SĐT
    phone_m = re.search(r'(?<!\d)(0[35789]\d{8})(?!\d)', all_text)
    if phone_m: data["phone"] = phone_m.group(1)
    # Địa chỉ
    addr_m = re.search(r'(?:Địa\s*chỉ|Đ/c|Đc|Nơi\s*giao)\s*[:：]\s*([^\r\n]+)', all_text, re.IGNORECASE)
    if addr_m: data["address"] = addr_m.group(1).strip()
    # STK
    stk_m = re.search(r'(?:Stk|STK|Số\s*tài\s*khoản)\s*[:：]\s*([0-9]{8,16})', all_text, re.IGNORECASE)
    if stk_m:
        stk_num = stk_m.group(1).strip()
        lines = [l.strip() for l in all_text.split('\n') if any(k in l.lower() for k in ['ngân hàng', 'vietcombank', 'techcombank', 'mbbank', 'chi nhánh', 'agribank', 'acb'])]
        data["supplier_bank"] = {"stk": stk_num, "bank_info": " | ".join(lines[:2]) if lines else stk_num}
    # Công nợ
    debt_m = re.search(r'(?:Nợ\s*hiện\s*tại|công\s*nợ|dư\s*nợ)\s*[:：]?\s*([0-9.,]{5,15})', all_text, re.IGNORECASE)
    if debt_m:
        data["debt_amount"] = debt_m.group(1).strip()
    # Mã đơn hàng (SON..., DON...)
    codes = re.findall(r'\b(?:SON|DON|PO|DH)\d{5,8}\b', all_text)
    data["order_codes"] = list(set(codes))
    
    # Tiền
    amounts = re.findall(r'(?<!\d)([0-9]{1,3}(?:[.,][0-9]{3}){1,3})\s*(?:đ|vnđ|k|tr)?\b', all_text, re.IGNORECASE)
    if amounts:
        data["amounts"] = list(set(amounts[:5]))

    return data

results = []

# Viewport của Message List: center (1450, 500)
VIEWPORT_X = 1450
VIEWPORT_Y = 500

for idx, g_elem in enumerate(group_items):
    try:
        # 1. Cuộn danh sách nhóm bên trái để item hiển thị
        if g_elem.BoundingRectangle.width() == 0:
            g_elem.GetPattern(10017).ScrollIntoView()
            time.sleep(0.2)
        
        rect = g_elem.BoundingRectangle
        if rect.width() == 0:
            print(f"[{idx+1}/{len(group_items)}] Không thể hiển thị nhóm {idx}, bỏ qua.")
            continue
            
        cx = (rect.left + rect.right) // 2
        cy = (rect.top + rect.bottom) // 2
        
        # Click chọn nhóm
        post_click(cx, cy)
        time.sleep(0.8)
        
        # Đọc Header nhóm
        header = app_page.GroupControl(AutomationId='header')
        h_names = [sub.Name.strip().replace('\xa0', ' ') for sub, _ in auto.WalkControl(header, maxDepth=3) if sub.Name and sub.Name.strip()]
        group_title = h_names[0] if h_names else f"Nhóm_{idx+1}"
        member_count_str = h_names[1] if len(h_names) > 1 else ""
        
        print(f"\n=======================================================")
        print(f"[{idx+1}/{len(group_items)}] Đang xử lý nhóm: {group_title} ({member_count_str})")
        print(f"=======================================================")
        
        # Đọc Message List Container
        mvc = app_page.GroupControl(AutomationId='messageViewContainer')
        m_scroll = mvc.GroupControl(AutomationId='messageViewScroll')
        
        # Cuộn ngược thời gian trong năm 2026
        # Nhóm quan trọng cuộn 8-12 lần, nhóm ít cuộn 4 lần
        scroll_rounds = 10 if idx in [0, 1, 2, 3, 4, 5, 6, 7] else 5
        print(f"-> Cuộn ngược dòng tin nhắn ({scroll_rounds} đợt)...")
        for sr in range(scroll_rounds):
            for _ in range(6):
                post_wheel(VIEWPORT_X, VIEWPORT_Y, 120 * 6)
                time.sleep(0.06)
            time.sleep(0.3)
            
        # Thu thập toàn bộ tin nhắn đã nạp trong bộ nhớ DOM
        raw_children = m_scroll.GetChildren()
        print(f"-> Tổng số phần tử tin nhắn nạp được: {len(raw_children)}")
        
        group_id = None
        messages = []
        all_text_concat = []
        files_mentioned = []
        image_ids = []
        current_date = "N/A"
        
        for c in raw_children:
            aid = c.AutomationId or ''
            # Kiểm tra date divider
            all_c_txts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(c, maxDepth=4) if s.Name and s.Name.strip()]
            for t in all_c_txts:
                if re.search(r'\b(?:T[2-7]|CN|\d{1,2}/\d{1,2}/202\d|Hôm qua|Hôm nay)\b', t):
                    current_date = t
                    
            if aid.startswith('bb_msg_id_'):
                # Trích xuất sender, time, texts, files
                msg_texts = []
                time_str = ""
                bubble_files = []
                
                for sub, _ in auto.WalkControl(c, maxDepth=6):
                    sub_aid = sub.AutomationId or ''
                    nm = sub.Name.strip().replace('\xa0', ' ') if sub.Name else ""
                    
                    # Tìm Group ID từ automationId của ảnh/file
                    # ví dụ: image-mCntr_...-g8911374775675572335
                    if not group_id and '-g' in sub_aid:
                        m_gid = re.search(r'-g(\d+)', sub_aid)
                        if m_gid:
                            group_id = f"g{m_gid.group(1)}"
                            
                    if '-g' in sub_aid:
                        image_ids.append(sub_aid)
                        
                    if any(ext in nm.lower() for ext in ['.pdf', '.xlsx', '.xls', '.dwg', '.dxf', '.docx', '.zip']):
                        bubble_files.append(nm)
                        files_mentioned.append(nm)
                        
                    if sub.ControlTypeName == 'TextControl':
                        if re.match(r'^\d{1,2}:\d{2}$', nm):
                            time_str = nm
                        elif nm and nm not in ['1', '2', '3', '4', '5', 'Thêm', 'Trả lời']:
                            msg_texts.append(nm)
                            
                content = " | ".join(msg_texts)
                if content or bubble_files:
                    sender = msg_texts[0] if (len(msg_texts) > 1 and len(msg_texts[0]) < 30) else "Tôi/Hệ thống"
                    msg_body = " | ".join(msg_texts[1:]) if sender != "Tôi/Hệ thống" else content
                    all_text_concat.append(f"{sender}: {msg_body}")
                    messages.append({
                        "msg_id": aid,
                        "date": current_date,
                        "time": time_str,
                        "sender": sender,
                        "content": msg_body,
                        "files": bubble_files
                    })
                    
        full_text = "\n".join(all_text_concat)
        entities = extract_entities_from_text(full_text)
        
        # Kiểm tra file trong cache đĩa resource nếu có group_id
        cached_disk_files = []
        if group_id:
            g_folder = os.path.join(resource_base, group_id)
            if os.path.exists(g_folder):
                for rf, _, flist in os.walk(g_folder):
                    for f in flist:
                        if not f.startswith('.'):
                            cached_disk_files.append(f)
                            
        group_summary = {
            "index": idx + 1,
            "title": group_title,
            "member_count": member_count_str,
            "group_id": group_id,
            "total_messages_loaded": len(messages),
            "date_range": {
                "oldest": messages[0]["date"] if messages else "N/A",
                "newest": messages[-1]["date"] if messages else "N/A"
            },
            "entities": entities,
            "attached_files_count": len(files_mentioned),
            "attached_files": list(set(files_mentioned)),
            "cached_disk_files_count": len(cached_disk_files),
            "recent_messages": messages[-15:] if len(messages) > 15 else messages
        }
        
        results.append(group_summary)
        print(f"-> Hoàn tất nhóm: {group_title} | ID: {group_id} | Tin: {len(messages)} | File: {len(files_mentioned)} | Cache: {len(cached_disk_files)}")
        
    except Exception as e:
        print(f"Lỗi khi xử lý nhóm {idx}: {e}")

# Lưu kết quả tổng hợp ra file JSON
output_path1 = r"F:\PG Home - Quản trị\6. Quản lý vật tư\TONG_HOP_DAT_HANG_ZALO_2026.json"
output_path2 = r"F:\PG Home - Quản trị\web_app\TONG_HOP_DAT_HANG_ZALO_2026.json"

os.makedirs(os.path.dirname(output_path1), exist_ok=True)
os.makedirs(os.path.dirname(output_path2), exist_ok=True)

with open(output_path1, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

with open(output_path2, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\n" + "="*60)
print(f"ĐÃ LƯU THÀNH CÔNG DỮ LIỆU TỔNG HỢP 13 NHÓM VÀO:")
print(f"1. {output_path1}")
print(f"2. {output_path2}")
print("="*60)

