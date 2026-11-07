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
tag_bar = sidebar.GetChildren()[1].GetChildren()[1]

# Find Phân loại
phan_loai = None
for sub, _ in auto.WalkControl(tag_bar, maxDepth=6):
    if sub.Name == 'Phân loại':
        phan_loai = sub.GetParentControl().GetParentControl()
        break

print('Found phan_loai control:', phan_loai)
if phan_loai:
    inv = phan_loai.GetPattern(10000)
    print('Invoking phan_loai...')
    inv.Invoke()
    time.sleep(0.5)

    # Search for Đặt Hàng Phú Gia
    target = None
    for sub, depth in auto.WalkControl(doc, maxDepth=6):
        n = sub.Name.strip().replace('\xa0', ' ') if sub.Name else ""
        if 'Đặt Hàng' in n:
            print(f'Found: {n} rect={sub.BoundingRectangle}')
            target = sub
            break

    if target:
        p_inv = target.GetParentControl().GetPattern(10000)
        print('Invoking Đặt Hàng Phú Gia...')
        p_inv.Invoke()
        time.sleep(1.0)

        # Check conversation list now!
        conv_grid = sidebar.GetChildren()[1].TableControl(AutomationId='conversationList')
        row = conv_grid.GetChildren()[0]
        print('\n--- Conversation list under Đặt Hàng Phú Gia ---')
        for i, c in enumerate(row.GetChildren()[:15]):
            texts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(c, maxDepth=5) if s.ControlTypeName == 'TextControl' and s.Name]
            if texts:
                print(f'Cell {i:2d}: {texts[0]}')

