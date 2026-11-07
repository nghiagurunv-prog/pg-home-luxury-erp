# -*- coding: utf-8 -*-
import sys
import ctypes
import uiautomation as auto

sys.stdout.reconfigure(encoding='utf-8')
user32 = ctypes.windll.user32
winsta0 = user32.OpenWindowStationW('WinSta0', False, 0x037F)
if winsta0:
    user32.SetProcessWindowStation(winsta0)
    desk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
    if desk:
        user32.SetThreadDesktop(desk)

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')

popup = None
for s, d in auto.WalkControl(doc, maxDepth=5):
    r = s.BoundingRectangle
    if r.left == 1024 and r.top == 322:
        popup = s
        break

if popup:
    print(f"Popup found: {popup.BoundingRectangle}")
    for sub, depth in auto.WalkControl(popup, maxDepth=8):
        n = sub.Name or ''
        r = sub.BoundingRectangle
        if n and r.width() > 0:
            print(f"  {' '*depth} {sub.ControlTypeName} name='{n}' rect={r}")
        elif 'Đặt Hàng' in n:
            print(f"  {' '*depth} [TARGET] {sub.ControlTypeName} name='{n}' rect={r} parent={sub.GetParentControl().BoundingRectangle}")
else:
    print("Popup not found!")

