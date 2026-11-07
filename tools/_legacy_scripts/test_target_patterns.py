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

for s, d in auto.WalkControl(doc, maxDepth=8):
    if s.Name == 'Đặt Hàng Phú Gia':
        print("Found target!", s.ControlTypeName, s.BoundingRectangle)
        parent = s.GetParentControl()
        print("Parent:", parent.ControlTypeName, parent.BoundingRectangle)
        # Check patterns on s and parent
        for pid in [10000, 10002, 10005, 10017, 10018]:
            try:
                p = s.GetPattern(pid)
                print(f"  Target Pattern {pid}: {p}")
            except:
                pass
            try:
                p = parent.GetPattern(pid)
                print(f"  Parent Pattern {pid}: {p}")
            except:
                pass

        # Try ScrollIntoView on target or parent
        try:
            print("Trying ScrollIntoView on target...")
            s.GetPattern(10017).ScrollIntoView()
            print("ScrollIntoView succeeded! New rect:", s.BoundingRectangle)
        except Exception as e:
            print("ScrollIntoView error:", e)

        # Try ScrollIntoView on parent
        try:
            print("Trying ScrollIntoView on parent...")
            parent.GetPattern(10017).ScrollIntoView()
            print("Parent ScrollIntoView succeeded! New rect:", s.BoundingRectangle)
        except Exception as e:
            print("Parent ScrollIntoView error:", e)
        break

