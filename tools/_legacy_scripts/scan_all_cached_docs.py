# -*- coding: utf-8 -*-
import os
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

resource_dir = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource"

docs = []
for root, _, files in os.walk(resource_dir):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in ['.pdf', '.xlsx', '.xls', '.docx', '.dwg', '.dxf', '.csv']:
            fp = os.path.join(root, f)
            try:
                st = os.stat(fp)
                mtime_str = datetime.fromtimestamp(st.st_mtime).strftime('%Y-%m-%d %H:%M')
                docs.append({
                    "filename": f,
                    "path": fp,
                    "ext": ext,
                    "size_kb": round(st.st_size / 1024, 1),
                    "mtime": mtime_str,
                    "folder": os.path.basename(root)
                })
            except:
                pass

docs.sort(key=lambda x: x['mtime'], reverse=True)
print(f"Tổng cộng tìm thấy {len(docs)} tài liệu đơn hàng (.pdf, .xlsx, .dwg) trong cache Zalo:")
for d in docs[:35]:
    print(f"- [{d['mtime']}] {d['folder']} | {d['filename']} ({d['size_kb']} KB)")

