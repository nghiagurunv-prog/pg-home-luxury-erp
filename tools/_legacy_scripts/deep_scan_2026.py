# -*- coding: utf-8 -*-
"""
========================================================================================
TOOL: deep_scan_2026.py - PG HOME LUXURY MANAGEMENT SYSTEM
========================================================================================
Quét sâu toàn diện lịch sử tin nhắn năm 2026 của tất cả các nhóm nhà cung cấp vật tư
thuộc tag 'Đặt Hàng Phú Gia' và nhóm Kính Việt Nhật trên Zalo PC.
Chạy ngầm 100% an toàn (Zero-Interference) - Không chạm chuột, không cướp Focus,
không inject phím, không ghi đè clipboard.
========================================================================================
"""

import sys
import os
import re
import json
import time
import ctypes
from ctypes import wintypes
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append('F:/PG Home - Quản trị/tools')
from read_zalo_messages import parse_bubble_content, extract_order_entities

user32 = ctypes.windll.user32
winsta0 = user32.OpenWindowStationW("WinSta0", False, 0x037F)
if winsta0:
    user32.SetProcessWindowStation(winsta0)
    desk = user32.OpenDesktopW("Default", 0, False, 0x01FF)
    if desk:
        user32.SetThreadDesktop(desk)

import uiautomation as auto

class POINT(ctypes.Structure):
    _fields_ = [('x', ctypes.c_long), ('y', ctypes.c_long)]

SW_SHOWNOACTIVATE = 4

def find_zalo():
    zalo_hwnd = 329060
    if not user32.IsWindow(zalo_hwnd):
        def enum_w(h, lp):
            nonlocal zalo_hwnd
            cls = ctypes.create_unicode_buffer(256)
            user32.GetClassNameW(h, cls, 256)
            t = ctypes.create_unicode_buffer(512)
            user32.GetWindowTextW(h, t, 512)
            if cls.value == 'Chrome_WidgetWin_1' and ('zalo' in t.value.lower() or t.value == 'Zalo'):
                zalo_hwnd = h
                return False
            return True
        user32.EnumWindows(ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(enum_w), 0)

    render_hwnd = None
    def enum_c(h, lp):
        nonlocal render_hwnd
        cls = ctypes.create_unicode_buffer(256)
        user32.GetClassNameW(h, cls, 256)
        if cls.value == 'Chrome_RenderWidgetHostHWND':
            render_hwnd = h
            return False
        return True
    user32.EnumChildWindows(zalo_hwnd, ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(enum_c), 0)

    user32.ShowWindow(zalo_hwnd, SW_SHOWNOACTIVATE)
    return zalo_hwnd, render_hwnd

def post_click(render_hwnd, sx, sy):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    user32.PostMessageW(render_hwnd, 0x0201, 1, (pt.y << 16) | (pt.x & 0xFFFF))
    time.sleep(0.04)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

def deep_scroll_history(m_scroll, mvc, render_hwnd, max_scrolls=12):
    """Cuộn ngược để tải lịch sử tin nhắn cũ năm 2026"""
    r = mvc.BoundingRectangle
    cx = (r.left + r.right) // 2
    cy = (r.top + r.bottom) // 2
    lParam = (cy << 16) | (cx & 0xFFFF)
    wParam = ((120 * 8) << 16) & 0xFFFFFFFF

    prev_first_id = None
    no_change = 0

    for step in range(max_scrolls):
        children = m_scroll.GetChildren()
        if not children: break
        first = children[0]
        cur_id = first.AutomationId or (first.Name[:15] if first.Name else str(step))

        if cur_id == prev_first_id:
            no_change += 1
            if no_change >= 2:
                break
        else:
            no_change = 0
            prev_first_id = cur_id

        # Kiểm tra nếu đã chạm tới năm 2025 hoặc đầu 2026
        hit_early = False
        for c in children[:6]:
            n = c.Name or ""
            if any(k in n for k in ["2025", "01/2026", "02/2026", "03/2026", "04/2026"]):
                hit_early = True
                break
        if hit_early:
            break

        # Cuộn bằng ScrollIntoView & WM_MOUSEWHEEL
        p = first.GetPattern(10017)
        if p:
            try: p.ScrollIntoView()
            except Exception: pass

        for _ in range(4):
            user32.PostMessageW(render_hwnd, 0x020A, wParam, lParam)
            time.sleep(0.03)

        time.sleep(0.5)

def run_deep_scan_2026():
    zalo_hwnd, render_hwnd = find_zalo()
    if not zalo_hwnd or not render_hwnd:
        print("Lỗi: Không tìm thấy Zalo.")
        return None

    ctrl = auto.ControlFromHandle(zalo_hwnd)
    doc = ctrl.DocumentControl(Name='Zalo')
    app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
    sidebar = app_page.GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
    conv_grid = sidebar.GetChildren()[1].TableControl(AutomationId='conversationList')
    mvc = app_page.GroupControl(AutomationId='messageViewContainer')
    m_scroll = mvc.GroupControl(AutomationId='messageViewScroll')

    # Bật tag Đặt Hàng Phú Gia
    phan_loai = None
    for sub, _ in auto.WalkControl(sidebar.GetChildren()[1], maxDepth=6):
        r = sub.BoundingRectangle
        if 50 <= r.top <= 100:
            names = [s.Name for s, _ in auto.WalkControl(sub, maxDepth=1) if s.Name]
            if 'Phân loại' in names:
                phan_loai = sub
                break

    if phan_loai:
        inv = phan_loai.GetPattern(auto.PatternId.InvokePattern)
        if inv: inv.Invoke()
        time.sleep(0.3)
        for sub, _ in auto.WalkControl(doc, maxDepth=6):
            name = sub.Name.strip().replace('\xa0', ' ') if sub.Name else ''
            if name == 'Đặt Hàng Phú Gia':
                p_inv = sub.GetParentControl().GetPattern(auto.PatternId.InvokePattern)
                if p_inv: p_inv.Invoke()
                break
        time.sleep(0.8)

    cells = conv_grid.GetChildren()[0].GetChildren()
    print(f"Bắt đầu quét sâu {len(cells)} nhóm vật tư...")

    all_groups_data = []

    for idx, cell in enumerate(cells):
        r = cell.BoundingRectangle
        if r.width() <= 0: continue
        texts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(cell, maxDepth=5) if s.ControlTypeName == 'TextControl' and s.Name]
        if not texts: continue
        group_name = texts[0]

        print(f"\n[{idx+1}/{len(cells)}] Đang mở nhóm: '{group_name}'...")
        cx = (r.left + r.right) // 2
        cy = (r.top + r.bottom) // 2
        post_click(render_hwnd, cx, cy)
        time.sleep(1.0)

        # Cuộn ngược lấy lịch sử 2026
        print(f"  -> Đang cuộn ngược lịch sử năm 2026...")
        deep_scroll_history(m_scroll, mvc, render_hwnd, max_scrolls=12)

        # Đọc tất cả phần tử sau khi cuộn
        children = m_scroll.GetChildren() if m_scroll.Exists(2, 0) else []
        print(f"  -> Đã nạp {len(children)} phần tử tin nhắn.")

        group_msgs = []
        cur_date = "Năm 2026"
        group_files = []
        all_text_lines = []

        for c in children:
            aid = c.AutomationId or ''
            if not aid.startswith('bb_msg_id_'):
                d_texts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(c, maxDepth=2) if s.ControlTypeName == 'TextControl' and s.Name]
                if d_texts:
                    cur_date = ' '.join(d_texts)
            else:
                sender, msg_time, content, files = parse_bubble_content(c)
                if files:
                    group_files.extend(files)
                if content:
                    all_text_lines.append(f"[{cur_date} {msg_time}] {sender}: {content}")
                if content or files:
                    group_msgs.append({
                        "date": cur_date,
                        "time": msg_time,
                        "sender": sender,
                        "content": content,
                        "attachments": files
                    })

        full_corpus = "\n".join(all_text_lines)
        entities = extract_order_entities(full_corpus)

        # Lọc file trùng
        unique_files = []
        seen_fnames = set()
        for f in group_files:
            fn = f["filename"].strip()
            if fn not in seen_fnames and len(fn) > 3:
                seen_fnames.add(fn)
                unique_files.append(f)

        all_groups_data.append({
            "group_name": group_name,
            "total_messages": len(group_msgs),
            "total_files": len(unique_files),
            "files": unique_files,
            "entities": entities,
            "messages": group_msgs
        })

    # Quét thêm nhóm Kính Việt Nhật nếu chưa có
    has_vn = any("kính việt nhật" in g["group_name"].lower() for g in all_groups_data)
    if not has_vn:
        print("\nĐang mở thêm nhóm: 'KÍNH VIỆT NHẬT - PHÚ GIA LUXURY'...")
        # Quay về tab Ưu tiên
        pt = POINT(100, 100)
        user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
        user32.PostMessageW(render_hwnd, 0x0201, 1, (pt.y << 16) | (pt.x & 0xFFFF))
        time.sleep(0.04)
        user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))
        time.sleep(0.8)

        # Tìm cell Kính Việt Nhật
        cells_uu_tien = conv_grid.GetChildren()[0].GetChildren()
        for c in cells_uu_tien:
            c_texts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(c, maxDepth=5) if s.ControlTypeName == 'TextControl' and s.Name]
            if any('kính việt nhật' in t.lower() for t in c_texts):
                cr = c.BoundingRectangle
                post_click(render_hwnd, (cr.left+cr.right)//2, (cr.top+cr.bottom)//2)
                time.sleep(1.0)
                deep_scroll_history(m_scroll, mvc, render_hwnd, max_scrolls=10)
                vn_children = m_scroll.GetChildren()
                vn_msgs = []
                vn_files = []
                cur_d = "Năm 2026"
                vn_texts = []
                for ch in vn_children:
                    aid = ch.AutomationId or ''
                    if not aid.startswith('bb_msg_id_'):
                        dt = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(ch, maxDepth=2) if s.ControlTypeName == 'TextControl' and s.Name]
                        if dt: cur_d = ' '.join(dt)
                    else:
                        sdr, tm, cnt, fls = parse_bubble_content(ch)
                        if fls: vn_files.extend(fls)
                        if cnt: vn_texts.append(f"[{cur_d} {tm}] {sdr}: {cnt}")
                        if cnt or fls:
                            vn_msgs.append({"date": cur_d, "time": tm, "sender": sdr, "content": cnt, "attachments": fls})
                all_groups_data.append({
                    "group_name": "KÍNH VIỆT NHẬT - PHÚ GIA LUXURY",
                    "total_messages": len(vn_msgs),
                    "total_files": len(vn_files),
                    "files": vn_files,
                    "entities": extract_order_entities("\n".join(vn_texts)),
                    "messages": vn_msgs
                })
                break

    # Hoàn trả tab Ưu tiên
    pt = POINT(100, 100)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    user32.PostMessageW(render_hwnd, 0x0201, 1, (pt.y << 16) | (pt.x & 0xFFFF))
    time.sleep(0.04)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

    # Lưu dữ liệu
    out_dir = r"F:\PG Home - Quản trị\6. Quản lý vật tư"
    os.makedirs(out_dir, exist_ok=True)
    out_json = os.path.join(out_dir, "TONG_HOP_VAT_TU_ZALO_2026.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(all_groups_data, f, ensure_ascii=False, indent=2)

    with open(r"F:\PG Home - Quản trị\web_app\TONG_HOP_VAT_TU_ZALO_2026.json", "w", encoding="utf-8") as f:
        json.dump(all_groups_data, f, ensure_ascii=False, indent=2)

    print(f"\n=======================================================")
    print(f"HOÀN THÀNH QUÉT SÂU NĂM 2026 CHO {len(all_groups_data)} NHÓM!")
    print(f"Dữ liệu đã lưu tại: {out_json}")
    print(f"=======================================================")
    return all_groups_data

if __name__ == "__main__":
    run_deep_scan_2026()

