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

def post_click(sx, sy):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    user32.PostMessageW(render_hwnd, 0x0201, 1, (pt.y << 16) | (pt.x & 0xFFFF))
    time.sleep(0.05)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

def post_wheel(sx, sy, delta):
    # In Windows WM_MOUSEWHEEL wParam high word is delta, lParam is screen coords!
    wParam = (delta & 0xFFFF) << 16
    lParam = (sy << 16) | (sx & 0xFFFF)
    user32.PostMessageW(render_hwnd, 0x020A, wParam, lParam)

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
sidebar = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
sub_pane = sidebar.GetChildren()[1]
conv_grid = sub_pane.GetChildren()[2]
cl = conv_grid.GetChildren()[0].GetChildren()[0].GetChildren()[0]
row0 = cl.GetChildren()[0]

# Select Group 0: KÍNH VIỆT NHẬT - PHÚ GIA LUXURY
g0 = row0.GetChildren()[0]
print("Selecting Group 0...")
g0.GetPattern(10017).ScrollIntoView()
time.sleep(0.2)
r = g0.BoundingRectangle
post_click((r.left + r.right) // 2, (r.top + r.bottom) // 2)
time.sleep(1.0)

app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
mvc = app_page.GroupControl(AutomationId='messageViewContainer')
m_scroll = mvc.GroupControl(AutomationId='messageViewScroll')

mr = m_scroll.BoundingRectangle
mcx = (mr.left + mr.right) // 2
mcy = (mr.top + mr.bottom) // 2

print(f"Group 0 opened. Testing deep scroll up in chat pane at ({mcx}, {mcy})...")

for step in range(8):
    # Scroll up with mouse wheel
    for _ in range(5):
        post_wheel(mcx, mcy, 120 * 6)
        time.sleep(0.1)
    time.sleep(0.5)

    # Check earliest date in visible items
    dates = []
    for c in m_scroll.GetChildren():
        txts = [s.Name.strip() for s, _ in auto.WalkControl(c, maxDepth=3) if s.Name]
        for t in txts:
            if re.search(r'\d{1,2}/\d{1,2}/202\d', t):
                dates.append(t)
    print(f"Step {step}: Total child elements={len(m_scroll.GetChildren())}, Sample dates found={dates[:3]}")

