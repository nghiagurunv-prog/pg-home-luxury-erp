# -*- coding: utf-8 -*-
import sys
import ctypes
from ctypes import wintypes
import time
import re
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

def post_wheel(sx, sy, delta):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    # In Windows WM_MOUSEWHEEL wParam high word is delta, lParam is screen coords!
    wParam = (delta & 0xFFFF) << 16
    lParam = (sy << 16) | (sx & 0xFFFF)
    user32.PostMessageW(render_hwnd, 0x020A, wParam, lParam)

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
mvc = app_page.GroupControl(AutomationId='messageViewContainer')
m_scroll = mvc.GroupControl(AutomationId='messageViewScroll')

print("m_scroll rect:", m_scroll.BoundingRectangle)
r = m_scroll.BoundingRectangle
cx = (r.left + r.right) // 2
cy = (r.top + r.bottom) // 2

children = [c for c in m_scroll.GetChildren() if (c.AutomationId or '').startswith('bb_msg_id_')]
print(f"Initial messages count: {len(children)}")
if children:
    c0 = children[0]
    names0 = [s.Name.strip() for s, _ in auto.WalkControl(c0, maxDepth=4) if s.Name]
    print("Top visible message:", names0[:4])

print("Scrolling up 10 times to load older messages...")
for i in range(10):
    post_wheel(cx, cy, 120 * 6)
    time.sleep(0.3)

time.sleep(1.0)
children2 = [c for c in m_scroll.GetChildren() if (c.AutomationId or '').startswith('bb_msg_id_')]
print(f"Messages count after scroll: {len(children2)}")
if children2:
    c0 = children2[0]
    names0 = [s.Name.strip() for s, _ in auto.WalkControl(c0, maxDepth=4) if s.Name]
    print("New top message:", names0[:4])

