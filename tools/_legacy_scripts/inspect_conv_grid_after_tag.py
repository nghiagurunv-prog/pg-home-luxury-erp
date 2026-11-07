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

# Tag bar status
tag_bar = sub_pane.GetChildren()[1]
print("Tag bar children:")
for s, d in auto.WalkControl(tag_bar, maxDepth=3):
    if s.Name:
        print(f"  {s.Name} ({s.BoundingRectangle})")

conv_grid = sub_pane.GetChildren()[2]
print("\nConv grid children:")
for c in conv_grid.GetChildren()[0].GetChildren()[0].GetChildren():
    names = [s.Name.strip() for s, _ in auto.WalkControl(c, maxDepth=3) if s.Name and s.Name.strip()]
    print(c.ControlTypeName, f"aid='{c.AutomationId}'", c.BoundingRectangle, names[:4])

