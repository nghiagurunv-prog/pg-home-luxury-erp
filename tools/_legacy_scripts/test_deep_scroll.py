# -*- coding: utf-8 -*-
import sys
import ctypes
from ctypes import wintypes
import time
import re
import json
import uiautomation as auto

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append('F:/PG Home - Quản trị/tools')
from read_zalo_messages import parse_bubble_content, extract_order_entities

user32 = ctypes.windll.user32
winsta0 = user32.OpenWindowStationW('WinSta0', False, 0x037F)
if winsta0:
    user32.SetProcessWindowStation(winsta0)
    desk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
    if desk:
        user32.SetThreadDesktop(desk)

render_hwnds = []
def enum_child(hwnd, lparam):
    cls = ctypes.create_unicode_buffer(256)
    user32.GetClassNameW(hwnd, cls, 256)
    if cls.value == 'Chrome_RenderWidgetHostHWND':
        render_hwnds.append(hwnd)
    return True
WNDENUMPROC = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
user32.EnumChildWindows(329060, WNDENUMPROC(enum_child), 0)
render_hwnd = render_hwnds[0]

def click_cell_background(cell):
    r = cell.BoundingRectangle
    cx = (r.left + r.right) // 2
    cy = (r.top + r.bottom) // 2
    class POINT(ctypes.Structure):
        _fields_ = [('x', ctypes.c_long), ('y', ctypes.c_long)]
    pt = POINT(cx, cy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    WM_LBUTTONDOWN = 0x0201
    WM_LBUTTONUP = 0x0202
    MK_LBUTTON = 0x0001
    lParam = (pt.y << 16) | (pt.x & 0xFFFF)
    user32.PostMessageW(render_hwnd, WM_LBUTTONDOWN, MK_LBUTTON, lParam)
    time.sleep(0.04)
    user32.PostMessageW(render_hwnd, WM_LBUTTONUP, 0, lParam)

def deep_scroll_chat(m_scroll, mvc, max_scrolls=20):
    WM_MOUSEWHEEL = 0x020A
    delta = 120 * 8
    wParam = (delta << 16) & 0xFFFFFFFF
    r = mvc.BoundingRectangle
    cx = (r.left + r.right) // 2
    cy = (r.top + r.bottom) // 2
    lParam = (cy << 16) | (cx & 0xFFFF)

    prev_first_id = None
    no_change_count = 0

    for step in range(max_scrolls):
        children = m_scroll.GetChildren()
        if not children: break
        first = children[0]
        cur_first_id = first.AutomationId or (first.Name[:20] if first.Name else str(step))

        if cur_first_id == prev_first_id:
            no_change_count += 1
            if no_change_count >= 3:
                # Reached top of history
                break
        else:
            no_change_count = 0
            prev_first_id = cur_first_id

        # Check earliest date in children
        for c in children[:5]:
            name = c.Name or ""
            if any(y in name for y in ["2025", "01/2026", "02/2026", "03/2026", "04/2026"]):
                print(f"Reached early 2026/2025 at step {step}: {name}")
                return

        # Attempt UIAutomation ScrollIntoView first
        p = first.GetPattern(10017)
        if p:
            try:
                p.ScrollIntoView()
            except Exception:
                pass

        # Send wheel messages to accelerate scroll
        for _ in range(5):
            user32.PostMessageW(render_hwnd, WM_MOUSEWHEEL, wParam, lParam)
            time.sleep(0.04)

        time.sleep(0.6)

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
sidebar = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')

# Activate tag Đặt Hàng Phú Gia
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
    time.sleep(0.4)
    for sub, _ in auto.WalkControl(doc, maxDepth=6):
        name = sub.Name.strip().replace('\xa0', ' ') if sub.Name else ''
        if name == 'Đặt Hàng Phú Gia':
            p_inv = sub.GetParentControl().GetPattern(auto.PatternId.InvokePattern)
            if p_inv: p_inv.Invoke()
            break
    time.sleep(0.8)

conv_grid = sidebar.GetChildren()[1].TableControl(AutomationId='conversationList')
row = conv_grid.GetChildren()[0]
cells = row.GetChildren()
print(f"Visible groups under tag: {len(cells)}")

app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
mvc = app_page.GroupControl(AutomationId='messageViewContainer')
m_scroll = mvc.GroupControl(AutomationId='messageViewScroll') if mvc.Exists(2, 0) else None

# Test on Cell 1 (2026 Đặt hàng anh Cường Hà Nội)
target_cell = cells[1]
print("Testing deep scroll on Cell 1...")
click_cell_background(target_cell)
time.sleep(1.2)

deep_scroll_chat(m_scroll, mvc, max_scrolls=15)

all_children = m_scroll.GetChildren()
print(f"Total elements after deep scroll: {len(all_children)}")

messages = []
cur_date = "Năm 2026"
all_files = []
for c in all_children:
    aid = c.AutomationId or ''
    if not aid.startswith('bb_msg_id_'):
        t = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(c, maxDepth=2) if s.ControlTypeName == 'TextControl' and s.Name]
        if t: cur_date = ' '.join(t)
    else:
        sender, msg_time, content, files = parse_bubble_content(c)
        if files: all_files.extend(files)
        if content or files:
            messages.append({"date": cur_date, "time": msg_time, "sender": sender, "content": content, "files": files})

print(f"Total messages parsed: {len(messages)}, Total files: {len(all_files)}")
print("Sample parsed messages:")
for m in messages[:10]:
    print(f"[{m['date']} {m['time']}] {m['sender']}: {m['content'][:80]} | Files: {m['files']}")

