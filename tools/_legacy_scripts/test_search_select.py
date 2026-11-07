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
    time.sleep(0.04)
    user32.PostMessageW(render_hwnd, 0x0202, 0, (pt.y << 16) | (pt.x & 0xFFFF))

ctrl = auto.ControlFromHandle(329060)
doc = ctrl.DocumentControl(Name='Zalo')
app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
sb = app_page.EditControl(AutomationId='contact-search-input')

print('sb exists:', sb.Exists(2, 0))
vp = sb.GetValuePattern()
print('Setting search to: Kính Việt Nhật')
vp.SetValue('Kính Việt Nhật')
time.sleep(1.0)

srl = app_page.GroupControl(AutomationId='searchResultList')
print('srl exists:', srl.Exists(2, 0))
if srl.Exists(2, 0):
    for sub, depth in auto.WalkControl(srl, maxDepth=6):
        aid = sub.AutomationId or ''
        r = sub.BoundingRectangle
        if aid.startswith('group-item-') and r.width() > 0:
            names = [s.Name for s, _ in auto.WalkControl(sub, maxDepth=2) if s.Name]
            print(f'Found result: aid={aid} names={names} rect={r}')
            cx = (r.left + r.right) // 2
            cy = (r.top + r.bottom) // 2
            print(f'Clicking result at ({cx}, {cy})...')
            post_click(cx, cy)
            break

vp.SetValue('')
time.sleep(1.0)

# Check active chat title
header = app_page.GroupControl(AutomationId='header')
h_names = [sub.Name.strip().replace('\xa0', ' ') for sub, _ in auto.WalkControl(header, maxDepth=3) if sub.Name]
print('Active chat now:', ' | '.join(h_names[:4]))

