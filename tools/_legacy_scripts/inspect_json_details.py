# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'F:\PG Home - Quản trị\web_app\TONG_HOP_DAT_HANG_ZALO_2026.json', encoding='utf-8') as f:
    data = json.load(f)

for g in data:
    msgs = g.get('recent_messages', [])
    non_trivial = [m for m in msgs if len(m.get('content', '')) > 2 or m.get('files')]
    print(f"Group {g['index']} ({g['group_id']}): {len(msgs)} total msgs, {len(non_trivial)} with content")
    for m in non_trivial[:5]:
        print(f"  [{m['date']} {m['time']}] {m['sender']}: {m['content']}")
        if m['files']:
            print(f"     Attached files: {m['files']}")

