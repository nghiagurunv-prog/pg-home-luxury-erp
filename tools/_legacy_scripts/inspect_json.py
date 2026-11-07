# -*- coding: utf-8 -*-
import json

with open('F:/PG Home - Quản trị/6. Quản lý vật tư/TONG_HOP_VAT_TU_ZALO_2026.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total groups: {len(data)}")
for i, g in enumerate(data):
    name = g.get('group_name', 'Unknown')
    msgs = g.get('total_messages', 0)
    files = len(g.get('files', []))
    ent = g.get('entities', {})
    print(f"[{i+1}] {name}: {msgs} msgs, {files} files | Entities: {ent}")

