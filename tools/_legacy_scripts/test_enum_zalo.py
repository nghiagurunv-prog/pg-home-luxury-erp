# -*- coding: utf-8 -*-
import ctypes
from ctypes import wintypes

user32 = ctypes.windll.user32
winsta0 = user32.OpenWindowStationW('WinSta0', False, 0x037F)
if winsta0:
    user32.SetProcessWindowStation(winsta0)
    desk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
    if desk:
        user32.SetThreadDesktop(desk)

def enum_w(h, lp):
    if user32.IsWindowVisible(h):
        cls = ctypes.create_unicode_buffer(256)
        user32.GetClassNameW(h, cls, 256)
        t = ctypes.create_unicode_buffer(512)
        user32.GetWindowTextW(h, t, 512)
        if cls.value == 'Chrome_WidgetWin_1':
            rect = wintypes.RECT()
            user32.GetWindowRect(h, ctypes.byref(rect))
            print(f'HWND: {h}, Title: "{t.value}", Rect: ({rect.left}, {rect.top}, {rect.right}, {rect.bottom})')
    return True

user32.EnumWindows(ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(enum_w), 0)
