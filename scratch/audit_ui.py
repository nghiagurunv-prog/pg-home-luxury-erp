import re

with open(r'f:\PG Home - Quản trị\web_app\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

ids = {}
for idx, line in enumerate(lines, 1):
    for m in re.finditer(r'\bid=["\']([^"\']+)["\']', line):
        i = m.group(1)
        ids.setdefault(i, []).append(idx)

print('=== DUPLICATE IDS IN INDEX.HTML ===')
for k, v in ids.items():
    if len(v) > 1:
        print(f'  {k}: lines {v}')
print(f'Total unique IDs: {len(ids)}')

