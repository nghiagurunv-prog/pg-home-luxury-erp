# -*- coding: utf-8 -*-
import ctypes
from ctypes import wintypes
import time

user32 = ctypes.windll.user32
winsta0 = user32.OpenWindowStationW('WinSta0', False, 0x037F)
if winsta0:
    user32.SetProcessWindowStation(winsta0)
    desk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
    if desk:
        user32.SetThreadDesktop(desk)

orig_fg = user32.GetForegroundWindow()

# Restore Zalo
SW_RESTORE = 9
user32.ShowWindow(329060, SW_RESTORE)
time.sleep(0.1)

# Immediately restore user foreground window
if orig_fg:
    user32.SetForegroundWindow(orig_fg)

rect = wintypes.RECT()
user32.GetWindowRect(329060, ctypes.byref(rect))
print(f'Zalo rect after restore: ({rect.left}, {rect.top}, {rect.right}, {rect.bottom})')
print(f'User foreground preserved: {user32.GetForegroundWindow() == orig_fg}')

