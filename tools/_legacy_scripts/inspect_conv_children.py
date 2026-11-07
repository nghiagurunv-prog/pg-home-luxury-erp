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

# Inspect tag bar pill
tag_pill = sub_pane.GetChildren()[1].GetChildren()[0].GetChildren()[2]
print("Tag pill name/children:")
for s, d in auto.WalkControl(tag_pill):
    print("  "*d, s.ControlTypeName, f"aid='{s.AutomationId}'", f"name='{s.Name}'", s.BoundingRectangle)

# Inspect conversationList
conv_grid = sub_pane.GetChildren()[2]
print("\n=== CONV GRID CHILDREN ===")
for c in conv_grid.GetChildren():
    print(c.ControlTypeName, c.AutomationId, c.BoundingRectangle)
    for c2 in c.GetChildren():
        print("  ", c2.ControlTypeName, c2.AutomationId, c2.BoundingRectangle)
        for c3 in c2.GetChildren():
            names = [s.Name for s, _ in auto.WalkControl(c3) if s.Name]
            print("    ", c3.ControlTypeName, c3.AutomationId, c3.BoundingRectangle, names[:5])

