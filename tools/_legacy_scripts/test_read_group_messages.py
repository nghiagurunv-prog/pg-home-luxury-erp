# -*- coding: utf-8 -*-
import sys
import ctypes
from ctypes import wintypes
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

render_hwnds = []
def enum_child(hwnd, lparam):
    cls = ctypes.create_unicode_buffer(256)
    user32.GetClassNameW(hwnd, cls, 256)
    if cls.value == 'Chrome_RenderWidgetHostHWND':
        render_hwnds.append(hwnd)
    return True
user32.EnumChildWindows(329060, ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(enum_child), 0)
render_hwnd = render_hwnds[0]

class POINT(ctypes.Structure):
    _fields_ = [('x', ctypes.c_long), ('y', ctypes.c_long)]

def post_click(sx, sy):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    user32.PostMessageW(render_hwnd, 0x0201, 1, (pt.y << 16) | (pt.x & 0xFFFF))
    time.sleep(0.05)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

def post_wheel(sx, sy, delta):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    user32.PostMessageW(render_hwnd, 0x020A, (delta & 0xFFFF) << 16, (pt.y << 16) | (pt.x & 0xFFFF))

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
sidebar = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='container').GroupControl(AutomationId='sidebarNav')
sub_pane = sidebar.GetChildren()[1]
conv_grid = sub_pane.GetChildren()[2]
cl = conv_grid.GetChildren()[0].GetChildren()[0].GetChildren()[0]
row0 = cl.GetChildren()[0]

# Select Child 4: Đặt hàng Phú Gia - NT
c4 = row0.GetChildren()[4]
print("Selecting Child 4:", c4.Name)
c4.GetPattern(10017).ScrollIntoView()
time.sleep(0.3)
r = c4.BoundingRectangle
print("Child 4 rect after scroll:", r)
cx = (r.left + r.right) // 2
cy = (r.top + r.bottom) // 2
post_click(cx, cy)
time.sleep(1.0)

# Check active chat title
header = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page').GroupControl(AutomationId='header')
h_names = [sub.Name.strip().replace('\xa0', ' ') for sub, _ in auto.WalkControl(header, maxDepth=3) if sub.Name]
print("Active chat title:", " | ".join(h_names[:3]))

# Find message list
msg_list = None
for s, d in auto.WalkControl(doc, maxDepth=8):
    aid = s.AutomationId or ''
    if aid == 'chat-message-list':
        msg_list = s
        break

if msg_list:
    print(f"Found chat-message-list: rect={msg_list.BoundingRectangle}")
    print(f"Total message items visible: {len(msg_list.GetChildren())}")
    for i, m in enumerate(msg_list.GetChildren()[:10]):
        txts = [s.Name.strip().replace('\xa0', ' ') for s, _ in auto.WalkControl(m, maxDepth=6) if s.Name and s.Name.strip()]
        print(f"  Msg {i}: rect={m.BoundingRectangle} txts={txts[:5]}")
else:
    print("chat-message-list not found!")

