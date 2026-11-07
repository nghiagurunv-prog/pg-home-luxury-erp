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

def post_wheel(sx, sy, delta):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    user32.PostMessageW(render_hwnd, 0x020A, (delta & 0xFFFF) << 16, (pt.y << 16) | (pt.x & 0xFFFF))

print("Scrolling down popup menu...")
# Delta negative scrolls down
for _ in range(5):
    post_wheel(1150, 600, -120 * 3)
    time.sleep(0.1)

time.sleep(0.5)

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')

target = None
for s, d in auto.WalkControl(doc, maxDepth=8):
    if s.Name == 'Đặt Hàng Phú Gia':
        print(f"Target found: rect={s.BoundingRectangle}")
        if s.BoundingRectangle.width() > 0:
            target = s
            break

if target:
    r = target.BoundingRectangle
    cx = (r.left + r.right) // 2
    cy = (r.top + r.bottom) // 2
    print(f"Clicking Đặt Hàng Phú Gia at ({cx}, {cy})...")
    post_click(cx, cy)
    time.sleep(1.0)
    print("Clicked successfully!")
else:
    print("Could not get visible rect for Đặt Hàng Phú Gia. Let's see current items:")
    for s, d in auto.WalkControl(doc, maxDepth=8):
        n = s.Name or ''
        r = s.BoundingRectangle
        if r.left >= 1024 and r.right <= 1300 and r.width() > 20 and n:
            print(f"  {n} -> {r}")

