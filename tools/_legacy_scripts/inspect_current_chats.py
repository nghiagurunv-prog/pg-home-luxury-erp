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

print("=== SUB_PANE CHILDREN ===")
for i, c in enumerate(sub_pane.GetChildren()):
    print(f"Child {i}: {c.ControlTypeName} aid={c.AutomationId} name={c.Name} rect={c.BoundingRectangle}")

# Inspect conv-list or virtualized list
print("\n=== CONVERSATION ITEMS IN SUB_PANE ===")
for sub, depth in auto.WalkControl(sub_pane, maxDepth=6):
    aid = sub.AutomationId or ''
    if 'conv-item' in aid or 'conversation' in aid.lower() or 'item' in aid.lower():
        names = [s.Name for s, _ in auto.WalkControl(sub, maxDepth=2) if s.Name]
        print(f"Depth {depth}: aid={aid} rect={sub.BoundingRectangle} names={names}")

