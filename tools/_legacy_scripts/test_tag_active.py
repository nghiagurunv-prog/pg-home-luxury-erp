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

# Check if Đặt Hàng Phú Gia is already active in tag_bar
already_active = False
for sub, _ in auto.WalkControl(tag_bar, maxDepth=4):
    if 'Đặt Hàng Phú Gia' in (sub.Name or ''):
        already_active = True
        break

print('Tag Đặt Hàng Phú Gia already active:', already_active)

if not already_active:
    phan_loai = None
    for sub, _ in auto.WalkControl(tag_bar, maxDepth=5):
        if sub.Name == 'Phân loại':
            phan_loai = sub
            break
    if phan_loai:
        print('Invoking Phân loại...')
        phan_loai.GetPattern(auto.PatternId.InvokePattern).Invoke()
        time.sleep(0.6)
        for sub, depth in auto.WalkControl(doc, maxDepth=6):
            name = sub.Name.strip().replace('\xa0', ' ') if sub.Name else ''
            if name == 'Đặt Hàng Phú Gia':
                p = sub.GetParentControl()
                print('Found tag in popup! Invoking parent...')
                p.GetPattern(auto.PatternId.InvokePattern).Invoke()
                break
        time.sleep(1.0)

conv_grid = sidebar.GetChildren()[1].TableControl(AutomationId='conversationList')
row = conv_grid.GetChildren()[0]
cells = row.GetChildren()
print(f'Total groups in conversation list: {len(cells)}')
for i, c in enumerate(cells):
    texts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(c, maxDepth=5) if s.ControlTypeName == 'TextControl' and s.Name]
    r = c.BoundingRectangle
    if r.width() > 0 and texts:
        print(f'Group {i:2d}: {texts[:2]}')

