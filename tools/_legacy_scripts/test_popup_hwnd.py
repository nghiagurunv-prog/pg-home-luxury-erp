# -*- coding: utf-8 -*-
import ctypes
from ctypes import wintypes
import time
import uiautomation as auto

user32 = ctypes.windll.user32
winsta0 = user32.OpenWindowStationW('WinSta0', False, 0x037F)
if winsta0:
    user32.SetProcessWindowStation(winsta0)
    desk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
    if desk:
        user32.SetThreadDesktop(desk)

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
sidebar = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
tag_bar = sidebar.GetChildren()[1].GetChildren()[1]

# Click phan_loai
for sub, _ in auto.WalkControl(tag_bar, maxDepth=6):
    if sub.Name == 'Phân loại':
        sub.GetParentControl().GetPattern(10000).Invoke()
        break

time.sleep(0.5)

# Check all top-level windows
def enum_w(h, lp):
    if user32.IsWindowVisible(h):
        cls = ctypes.create_unicode_buffer(256)
        user32.GetClassNameW(h, cls, 256)
        t = ctypes.create_unicode_buffer(512)
        user32.GetWindowTextW(h, t, 512)
        rect = wintypes.RECT()
        user32.GetWindowRect(h, ctypes.byref(rect))
        if 'Chrome' in cls.value and rect.right - rect.left < 500 and rect.bottom - rect.top < 600:
            print(f'Popup candidate: HWND={h} Class={cls.value} Rect=({rect.left},{rect.top},{rect.right},{rect.bottom}) Title="{t.value}"')
    return True

user32.EnumWindows(ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(enum_w), 0)

