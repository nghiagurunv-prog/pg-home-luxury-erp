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

print("Clicking 'Phân loại' at (1060, 301)...")
post_click(1060, 301)
time.sleep(0.6)

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')

print("Searching for Đặt Hàng Phú Gia...")
found = []
for s, d in auto.WalkControl(doc, maxDepth=10):
    n = s.Name or ''
    if 'Đặt Hàng' in n or 'Phú Gia' in n:
        found.append((s, d, n, s.BoundingRectangle))
        print(f"Found: depth={d} name='{n}' rect={s.BoundingRectangle} type={s.ControlTypeName}")

if not found:
    print("Not found in doc. Checking desktop windows...")
    def enum_desk_win(hwnd, lparam):
        if user32.IsWindowVisible(hwnd):
            txt = ctypes.create_unicode_buffer(256)
            user32.GetWindowTextW(hwnd, txt, 256)
            cls = ctypes.create_unicode_buffer(256)
            user32.GetClassNameW(hwnd, cls, 256)
            r = wintypes.RECT()
            user32.GetWindowRect(hwnd, ctypes.byref(r))
            w = r.right - r.left
            h = r.bottom - r.top
            if w > 50 and h > 50 and w < 600 and h < 600:
                print(f"Popup window: hwnd={hwnd} title='{txt.value}' cls='{cls.value}' rect=({r.left},{r.top},{r.right},{r.bottom})")
        return True
    user32.EnumWindows(ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(enum_desk_win), 0)

