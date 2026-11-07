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

def post_wheel(sx, sy, delta):
    wParam = (delta & 0xFFFF) << 16
    lParam = (sy << 16) | (sx & 0xFFFF)
    user32.PostMessageW(render_hwnd, 0x020A, wParam, lParam)

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
mvc = app_page.GroupControl(AutomationId='messageViewContainer')
m_scroll = mvc.GroupControl(AutomationId='messageViewScroll')

print("Initial children in m_scroll:", len(m_scroll.GetChildren()))

# Viewport is (1160, 220, 1750, 750). Center is (1450, 500)
for i in range(5):
    print(f"Wheeling at (1450, 500) - step {i}...")
    for _ in range(8):
        post_wheel(1450, 500, 120 * 6)
        time.sleep(0.08)
    time.sleep(0.6)
    print("Children now:", len(m_scroll.GetChildren()))

print("\n--- SAMPLE TEXTS IN LOADED MESSAGES ---")
for c in m_scroll.GetChildren()[:15]:
    txts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(c, maxDepth=4) if s.Name and s.Name.strip()]
    if txts:
        print(f"Child {c.AutomationId}: {txts[:4]}")

