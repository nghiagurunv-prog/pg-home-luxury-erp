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
app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
mvc = app_page.GroupControl(AutomationId='messageViewContainer')
m_scroll = mvc.GroupControl(AutomationId='messageViewScroll')

for i, c in enumerate(m_scroll.GetChildren()):
    aid = c.AutomationId or ''
    # Inspect all text children
    all_txt = []
    for s, _ in auto.WalkControl(c, maxDepth=5):
        if s.Name and s.Name.strip():
            all_txt.append(s.Name.strip())
    print(f"Child {i}: aid={aid} rect={c.BoundingRectangle} txts={all_txt}")

