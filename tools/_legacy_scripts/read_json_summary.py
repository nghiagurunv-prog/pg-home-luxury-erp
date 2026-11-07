# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'F:\PG Home - Quản trị\web_app\TONG_HOP_DAT_HANG_ZALO_2026.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total groups parsed: {len(data)}")
for g in data:
    ent = g.get('entities', {})
    print("-----------------------------------------")
    print(f"[{g.get('index')}] Group ID: {g.get('group_id')} | Title: {g.get('title')} ({g.get('member_count')})")
    print(f"     Messages: {g.get('total_messages_loaded')} | Date range: {g.get('date_range')}")
    print(f"     Entities: Cust={ent.get('customer_name')} | Phone={ent.get('phone')} | Debt={ent.get('debt_amount')} | Bank={ent.get('supplier_bank')}")
    print(f"     Amounts: {ent.get('amounts')} | Codes: {ent.get('order_codes')}")
    recents = g.get('recent_messages', [])
    if recents:
        last = recents[-1]
        print(f"     Sample recent: {last.get('sender')}: {last.get('content')[:120]}...")

