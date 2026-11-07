# -*- coding: utf-8 -*-
import sys
import ctypes
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

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
sidebar = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
sub_pane = sidebar.GetChildren()[1]

# Find Phân loại
pl = None
for sub, _ in auto.WalkControl(sub_pane, maxDepth=6):
    if sub.Name == 'Phân loại':
        pl = sub.GetParentControl().GetParentControl()
        break

if pl:
    print('Invoking Phân loại...')
    pl.GetPattern(10000).Invoke()
    time.sleep(0.5)

    print('--- All elements in doc with Đặt Hàng ---')
    for sub, depth in auto.WalkControl(doc, maxDepth=8):
        n = sub.Name if sub.Name else ""
        if 'Đặt Hàng' in n:
            print('  '*depth, sub.ControlTypeName, f'name="{n}"', 'rect=', sub.BoundingRectangle, 'inv=', sub.GetPattern(10000) is not None)

