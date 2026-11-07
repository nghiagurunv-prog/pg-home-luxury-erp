# -*- coding: utf-8 -*-
import sys
import ctypes
from ctypes import wintypes
import time
import uiautomation as auto

sys.stdout.reconfigure(encoding='utf-8')
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
user32.EnumChildWindows(329060, ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(enum_child), 0)
render_hwnd = render_hwnds[0]

class POINT(ctypes.Structure):
    _fields_ = [('x', ctypes.c_long), ('y', ctypes.c_long)]

def post_click(sx, sy):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    user32.PostMessageW(render_hwnd, 0x0201, 1, (pt.y << 16) | (pt.x & 0xFFFF))
    time.sleep(0.04)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
sidebar = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
sub_pane = sidebar.GetChildren()[1]

# Find Phân loại
pl_rect = None
for sub, _ in auto.WalkControl(sub_pane, maxDepth=6):
    names = [s.Name for s, _ in auto.WalkControl(sub, maxDepth=1) if s.Name]
    if 'Phân loại' in names:
        pl_rect = sub.BoundingRectangle
        break

print('pl_rect:', pl_rect)
if pl_rect:
    cx = (pl_rect.left + pl_rect.right) // 2
    cy = (pl_rect.top + pl_rect.bottom) // 2
    print(f'Posting click to Phân loại at ({cx}, {cy})...')
    post_click(cx, cy)
    time.sleep(0.8)

    for sub, depth in auto.WalkControl(doc, maxDepth=6):
        name = sub.Name.strip().replace('\xa0', ' ') if sub.Name else ''
        if 'Đặt Hàng' in name:
            r = sub.BoundingRectangle
            print('Found tag in popup:', name, 'rect=', r)
            if r.width() > 0:
                tag_cx = (r.left + r.right) // 2
                tag_cy = (r.top + r.bottom) // 2
                print(f'Posting click to tag at ({tag_cx}, {tag_cy})...')
                post_click(tag_cx, tag_cy)
            break

time.sleep(1.0)
conv_grid = sub_pane.TableControl(AutomationId='conversationList')
row = conv_grid.GetChildren()[0]
cells = row.GetChildren()
print(f'Total groups in conversation list: {len(cells)}')
for i, c in enumerate(cells[:15]):
    texts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(c, maxDepth=5) if s.ControlTypeName == 'TextControl' and s.Name]
    r = c.BoundingRectangle
    if r.width() > 0 and texts:
        print(f'Group {i:2d}: {texts[:2]}')

