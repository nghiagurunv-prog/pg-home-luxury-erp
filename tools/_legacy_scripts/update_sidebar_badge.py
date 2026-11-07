# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('web_app/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = """        <a href="#vat-tu-cost" class="nav-item" data-tab="tab-vat-tu-cost" data-role-group="xuong">
          <i class="fa-solid fa-cubes-stacked"></i>
          <span>Vật Tư & Giá Cost</span>
          
        </a>"""

replacement = """        <a href="#vat-tu-cost" class="nav-item" data-tab="tab-vat-tu-cost" data-role-group="xuong">
          <i class="fa-solid fa-cubes-stacked"></i>
          <span>Vật Tư & Giá Cost</span>
          <span class="badge accent" id="badgeSidebarVatTu">41 Đã Đặt</span>
        </a>"""

c_norm = c.replace('\r\n', '\n')
t_norm = target.replace('\r\n', '\n')
r_norm = replacement.replace('\r\n', '\n')

if t_norm in c_norm:
    c_new = c_norm.replace(t_norm, r_norm, 1)
    with open('web_app/index.html', 'w', encoding='utf-8') as f:
        f.write(c_new)
    print("SUCCESS: Updated sidebar badge for Vat Tu & Gia Cost!")
else:
    print("ERROR: Target not found in index.html!")

