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

phan_loai = None
for sub, _ in auto.WalkControl(sub_pane, maxDepth=6):
    names = [s.Name for s, _ in auto.WalkControl(sub, maxDepth=1) if s.Name]
    if 'Phân loại' in names and sub.GetPattern(10000):
        phan_loai = sub
        break

if phan_loai:
    phan_loai.GetPattern(10000).Invoke()
    time.sleep(0.6)

    for sub, depth in auto.WalkControl(doc, maxDepth=6):
        name = sub.Name.strip().replace('\xa0', ' ') if sub.Name else ''
        if 'Đặt Hàng' in name:
            p = sub.GetParentControl()
            print('sub:', sub.ControlTypeName, f'name="{name}"', 'rect=', sub.BoundingRectangle)
            print('parent:', p.ControlTypeName, 'rect=', p.BoundingRectangle, 'patterns:', [pat for pat in [10000, 10001, 10002, 10003] if p.GetPattern(pat)])
            print('grandparent:', p.GetParentControl().ControlTypeName, 'rect=', p.GetParentControl().BoundingRectangle)
            break

