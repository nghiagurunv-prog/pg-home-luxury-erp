# -*- coding: utf-8 -*-
import sys
import os
import re
import ctypes
from ctypes import wintypes
import time
from datetime import datetime
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
    user32.PostMessageW(render_hwnd, 0x0201, 1, (pt.y << 16) | (pt.x & 0xFFFF))
    time.sleep(0.04)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

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
    time.sleep(0.3)
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
print(f"Total groups under tag Đặt Hàng Phú Gia: {len(cells)}")

app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
mvc = app_page.GroupControl(AutomationId='messageViewContainer')
m_scroll = mvc.GroupControl(AutomationId='messageViewScroll')

group_catalog = []

for idx, cell in enumerate(cells):
    r = cell.BoundingRectangle
    if r.width() <= 0: continue
    texts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(cell, maxDepth=5) if s.ControlTypeName == 'TextControl' and s.Name]
    if not texts: continue
    group_name = texts[0]
    
    click_cell_background(cell)
    time.sleep(0.8)
    
    # Extract group_id from messageViewScroll
    gid = None
    all_msgs = []
    files_in_chat = []
    
    children = m_scroll.GetChildren() if m_scroll.Exists(2, 0) else []
    for c in children:
        aid = c.AutomationId or ''
        m_gid = re.search(r'g\d+', aid)
        if m_gid and not gid:
            gid = m_gid.group(0)
        if aid.startswith('bb_msg_id_'):
            sender, msg_time, content, files = parse_bubble_content(c)
            if files: files_in_chat.extend(files)
            if content: all_msgs.append(f"{sender}: {content}")
            
    # Check disk folder
    resource_base = r'C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource'
    disk_files_2026 = []
    if gid:
        gpath = os.path.join(resource_base, gid)
        if os.path.exists(gpath):
            for rk, dk, fk in os.walk(gpath):
                for f in fk:
                    fp = os.path.join(rk, f)
                    st = os.stat(fp)
                    mtime = datetime.fromtimestamp(st.st_mtime)
                    if mtime.year == 2026 and st.st_size > 5000:
                        disk_files_2026.append({
                            "name": f,
                            "path": fp,
                            "size": st.st_size,
                            "mtime": mtime.strftime('%Y-%m-%d %H:%M')
                        })

    group_catalog.append({
        "index": idx,
        "name": group_name,
        "group_id": gid,
        "total_chat_elements": len(children),
        "total_files_in_chat": len(files_in_chat),
        "total_disk_cached_files_2026": len(disk_files_2026),
        "sample_files": disk_files_2026[:3],
        "full_text_sample": "\n".join(all_msgs[:5])
    })
    print(f"[{idx}] {group_name} -> GID: {gid} | Chat elements: {len(children)} | Cached 2026 files: {len(disk_files_2026)}")

# Return tag to Ưu tiên
pt = (100, 100)
# Click Ưu tiên
r_pt = POINT(100, 100)
user32.ScreenToClient(render_hwnd, ctypes.byref(r_pt))
user32.PostMessageW(render_hwnd, 0x0201, 1, (r_pt.y << 16) | (r_pt.x & 0xFFFF))
time.sleep(0.04)
user32.PostMessageW(render_hwnd, 0x0202, 0, (r_pt.y << 16) | (r_pt.x & 0xFFFF))

with open('scratch/zalo_group_catalog_2026.json', 'w', encoding='utf-8') as f:
    json.dump(group_catalog, f, ensure_ascii=False, indent=2)

print("\nFinished mapping all groups! Saved to scratch/zalo_group_catalog_2026.json")

