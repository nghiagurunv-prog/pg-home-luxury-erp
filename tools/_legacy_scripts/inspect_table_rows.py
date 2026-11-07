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
sidebar = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
sub_pane = sidebar.GetChildren()[1]
conv_grid = sub_pane.GetChildren()[2]
cl = conv_grid.GetChildren()[0].GetChildren()[0].GetChildren()[0]

print("cl is:", cl.ControlTypeName, cl.AutomationId, len(cl.GetChildren()))
for i, row in enumerate(cl.GetChildren()):
    txts = [s.Name.strip() for s, _ in auto.WalkControl(row, maxDepth=4) if s.Name and s.Name.strip()]
    r = row.BoundingRectangle
    print(f"Row {i}: rect={r} texts={txts}")

