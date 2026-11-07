# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

app_js_path = r"F:\PG Home - Quản trị\web_app\app.js"

with open(app_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

target = "      // Luôn đồng bộ danh sách 12 tháng CCSC từ DEFAULT_DATA để nhận các chỉ tiêu mới nhất của T8 & T9\n      data.ccscMonths = JSON.parse(JSON.stringify(DEFAULT_DATA.ccscMonths));"

replacement = "      // Luôn đồng bộ danh sách 12 tháng CCSC và 13 nhóm Zalo từ DEFAULT_DATA\n      data.ccscMonths = JSON.parse(JSON.stringify(DEFAULT_DATA.ccscMonths));\n      data.zaloSupplierGroups = JSON.parse(JSON.stringify(DEFAULT_DATA.zaloSupplierGroups));"

js_norm = js_content.replace('\r\n', '\n')
t_norm = target.replace('\r\n', '\n')
r_norm = replacement.replace('\r\n', '\n')

if t_norm in js_norm:
    new_js = js_norm.replace(t_norm, r_norm, 1)
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(new_js)
    print("SUCCESS: Updated loadState in app.js!")
else:
    print("ERROR: Target string not found in app.js!")

