# -*- coding: utf-8 -*-
import sys, os, ctypes, time, json, re

sys.stdout.reconfigure(encoding='utf-8')
user32 = ctypes.windll.user32
winsta0 = user32.OpenWindowStationW('WinSta0', False, 0x037F)
user32.SetProcessWindowStation(winsta0)
desk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
user32.SetThreadDesktop(desk)

import uiautomation as auto

zalo_hwnd = 67036
render_hwnd = 67200
was_visible = user32.IsWindowVisible(zalo_hwnd)
user32.ShowWindow(zalo_hwnd, 4)
time.sleep(0.3)

class POINT(ctypes.Structure):
    _fields_ = [('x', ctypes.c_long), ('y', ctypes.c_long)]

def post_click(sx, sy):
    pt = POINT(sx, sy)
    user32.ScreenToClient(render_hwnd, ctypes.byref(pt))
    lparam = (pt.y << 16) | (pt.x & 0xFFFF)
    user32.PostMessageW(render_hwnd, 0x0200, 0, lparam)
    time.sleep(0.05)
    user32.PostMessageW(render_hwnd, 0x0201, 1, lparam)
    time.sleep(0.05)
    user32.PostMessageW(render_hwnd, 0x0202, 0, lparam)

def post_wheel(sx, sy, delta):
    wParam = (delta & 0xFFFF) << 16
    lParam = (sy << 16) | (sx & 0xFFFF)
    user32.PostMessageW(render_hwnd, 0x020A, wParam, lParam)

try:
    ctrl = auto.ControlFromHandle(zalo_hwnd)
    doc = ctrl.DocumentControl(Name='Zalo')
    app_page = doc.GroupControl(AutomationId='app').GroupControl(AutomationId='app-page')
    conv_list_id = app_page.GroupControl(AutomationId='conversationListId')
    conv_grid = conv_list_id.TableControl(AutomationId='conversationList')
    row0 = conv_grid.GetChildren()[0]
    cells = row0.GetChildren()
    for i, c in enumerate(cells):
        txts = [x.Name.strip() for x, _ in auto.WalkControl(c, maxDepth=4) if x.Name and x.Name.strip()]
        print(f"Cell [{i}] rect={c.BoundingRectangle}: {txts}")

    # Click Cell [1] (Bảng chấm công văn phòng)
    if len(cells) > 1:
        r = cells[1].BoundingRectangle
        cx = (r.left + r.right) // 2
        cy = (r.top + r.bottom) // 2
        print(f"Clicking Cell [1] at ({cx}, {cy})...")
        post_click(cx, cy)
        time.sleep(1.2)

        mvc = app_page.GroupControl(AutomationId='messageViewContainer')
        m_scroll = mvc.GroupControl(AutomationId='messageViewScroll')
        mr = mvc.BoundingRectangle
        mcx = (mr.left + mr.right) // 2
        mcy = (mr.top + mr.bottom) // 2

        all_msgs = {}
        gid = None
        def harvest():
            global gid
            children = m_scroll.GetChildren()
            cur_date = "N/A"
            for ch in children:
                aid = ch.AutomationId or ''
                for s, _ in auto.WalkControl(ch, maxDepth=4):
                    n = s.Name.strip().replace('\xa0', ' ') if s.Name else ''
                    if n and re.search(r'(\bT[2-7]\b|\bCN\b|\d{1,2}/\d{1,2}/202\d|Hôm qua|Hôm nay)', n):
                        if len(n) < 35:
                            cur_date = n
                            break
                if not aid.startswith('bb_msg_id_'):
                    continue
                if aid in all_msgs:
                    if all_msgs[aid]['date'] == 'N/A' and cur_date != 'N/A':
                        all_msgs[aid]['date'] = cur_date
                    continue
                texts = []
                t_str = ""
                for s, _ in auto.WalkControl(ch, maxDepth=12):
                    n = s.Name.strip().replace('\xa0', ' ') if s.Name else ''
                    sa = s.AutomationId or ''
                    if '-g' in sa and not gid:
                        m = re.search(r'-g(\d+)', sa)
                        if m:
                            gid = f"g{m.group(1)}"
                    if s.ControlTypeName == 'TextControl' and re.match(r'^\d{1,2}:\d{2}$', n):
                        t_str = n
                    elif s.ControlTypeName in ['TextControl', 'HyperlinkControl'] and n and n != 'a':
                        if n not in texts:
                            texts.append(n)
                all_msgs[aid] = {'aid': aid, 'date': cur_date, 'time': t_str, 'texts': texts}

        harvest()
        for _ in range(12):
            for _ in range(8):
                post_wheel(mcx, mcy, 600)
                time.sleep(0.01)
            time.sleep(0.2)
            harvest()

        sorted_m = sorted(all_msgs.values(), key=lambda x: int(x['aid'].replace('bb_msg_id_', '')) if x['aid'].replace('bb_msg_id_', '').isdigit() else 0)
        print(f"VP Group ID: {gid} | Total messages: {len(sorted_m)}")
        with open('f:/PG Home - Quản trị/scratch/CHAM_CONG_VP_T10_FULL.json', 'w', encoding='utf-8') as f:
            json.dump({'group_id': gid, 'total_messages': len(sorted_m), 'messages': sorted_m}, f, ensure_ascii=False, indent=2)
        for m in sorted_m:
            print(f"[{m['aid']}] [{m['date']}] ({m['time']}) {' | '.join(m['texts'])}")
finally:
    if not was_visible:
        user32.ShowWindow(zalo_hwnd, 0)
