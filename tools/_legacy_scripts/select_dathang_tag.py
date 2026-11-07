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
    time.sleep(0.05)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')

for s, d in auto.WalkControl(doc, maxDepth=8):
    if s.Name == 'Đặt Hàng Phú Gia':
        s.GetPattern(10017).ScrollIntoView()
        time.sleep(0.2)
        r = s.BoundingRectangle
        cx = (r.left + r.right) // 2
        cy = (r.top + r.bottom) // 2
        print(f"Clicking at ({cx}, {cy})...")
        post_click(cx, cy)
        time.sleep(1.0)
        break

# Now inspect conversation list
sidebar = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
sub_pane = sidebar.GetChildren()[1]
conv_grid = sub_pane.GetChildren()[2]

print("=== CONVERSATIONS IN TAG ĐẶT HÀNG PHÚ GIA ===")
items = []
for sub, depth in auto.WalkControl(conv_grid, maxDepth=8):
    aid = sub.AutomationId or ''
    if aid.startswith('conv-item-') or 'conv-item' in aid:
        names = [s.Name.strip() for s, _ in auto.WalkControl(sub, maxDepth=3) if s.Name and s.Name.strip()]
        r = sub.BoundingRectangle
        items.append((aid, r, names))

for aid, r, names in items:
    print(f"Item {aid} rect={r}: {names[:3]}")

