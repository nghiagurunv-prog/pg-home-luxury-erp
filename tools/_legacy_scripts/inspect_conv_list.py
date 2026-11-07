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

# Child 1: tag bar
tag_bar = sub_pane.GetChildren()[1]
print("=== TAG BAR ===")
for sub, depth in auto.WalkControl(tag_bar, maxDepth=4):
    print("  "*depth, sub.ControlTypeName, f"aid='{sub.AutomationId}'", f"name='{sub.Name}'", "rect=", sub.BoundingRectangle)

conv_grid = sub_pane.GetChildren()[2]
print("\n=== CONVERSATION LIST ITEMS ===")
for sub, depth in auto.WalkControl(conv_grid, maxDepth=4):
    r = sub.BoundingRectangle
    if r.height() > 30 and r.top >= 280 and r.bottom <= 950:
        names = [s.Name for s, _ in auto.WalkControl(sub, maxDepth=2) if s.Name]
        if any(names):
            print(f"Depth {depth}: aid='{sub.AutomationId}' rect={r} names={names}")

