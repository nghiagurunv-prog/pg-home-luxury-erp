# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

index_html_path = r"F:\PG Home - Quản trị\web_app\index.html"
app_js_path = r"F:\PG Home - Quản trị\web_app\app.js"

# 1. Update index.html
with open(index_html_path, 'r', encoding='utf-8') as f:
    idx_content = f.read()

target_html = '''              <tbody id="bodyPOList">
                <!-- Dynamically populated via JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>'''

replacement_html = '''              <tbody id="bodyPOList">
                <!-- Dynamically populated via JS -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- BẢNG TỔNG HỢP 13 NHÓM ĐẶT HÀNG VẬT TƯ & CÔNG NỢ NĂM 2026 TỪ ZALO PC -->
        <div class="card table-card gold-glow" style="margin-top: 1.5rem;">
          <div class="card-header">
            <div>
              <h3 style="color: #F59E0B;"><i class="fa-solid fa-satellite-dish"></i> Danh Mục 13 Nhóm Đặt Hàng Vật Tư & Đối Soát Công Nợ Zalo 2026</h3>
              <p class="card-subtitle">Trích xuất tự động qua công nghệ quét ngầm từ Tag 'Đặt Hàng Phú Gia' trên Zalo PC của Giám Đốc</p>
            </div>
            <div class="btn-group">
              <span class="badge live" style="background:#10B981; color:#000; font-weight:800;">13 NHÓM ĐỒNG BỘ</span>
              <a href="TONG_HOP_DAT_HANG_ZALO_2026.json" target="_blank" class="btn btn-outline btn-sm">
                <i class="fa-solid fa-file-code"></i> Tải Dữ Liệu JSON
              </a>
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table" id="tableZaloSupplierGroups">
              <thead>
                <tr>
                  <th style="width: 50px;">STT</th>
                  <th>Tên Nhóm Zalo & ID</th>
                  <th>Chủng Loại Vật Tư Cung Ứng</th>
                  <th>Đơn Vị Cung Cấp & Liên Hệ</th>
                  <th>Tương Tác & Cache 2026</th>
                  <th>Dư Nợ & Quy Chế Thanh Toán</th>
                  <th>Chứng Từ Đi Kèm</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody id="bodyZaloSupplierGroups">
                <!-- Dynamically populated via renderZaloSupplierGroups() -->
              </tbody>
            </table>
          </div>
        </div>
      </section>'''

idx_norm = idx_content.replace('\r\n', '\n')
t_html_norm = target_html.replace('\r\n', '\n')
r_html_norm = replacement_html.replace('\r\n', '\n')

if t_html_norm in idx_norm:
    new_idx = idx_norm.replace(t_html_norm, r_html_norm, 1)
    with open(index_html_path, 'w', encoding='utf-8') as f:
        f.write(new_idx)
    print("SUCCESS: Updated index.html with 13 Zalo Supplier Groups table!")
else:
    print("ERROR: Target HTML not found in index.html!")

# 2. Add renderZaloSupplierGroups function in app.js
with open(app_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

zalo_render_func = '''
function renderZaloSupplierGroups() {
  const tbody = document.getElementById("bodyZaloSupplierGroups");
  if (!tbody) return;

  const groups = appState.zaloSupplierGroups || DEFAULT_DATA.zaloSupplierGroups || [];
  if (groups.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">Đang đồng bộ dữ liệu nhóm Zalo...</td></tr>`;
    return;
  }

  tbody.innerHTML = groups.map((g, idx) => {
    const isHighDebt = (g.debt && g.debt.includes("82,065,300"));
    const debtClass = isHighDebt ? "text-danger fw-bold" : "text-gold";
    const statusBadge = g.status.includes("sản xuất") ? "badge-info" : (g.status.includes("nghiệm thu") || g.status.includes("bàn giao") ? "badge-success" : "badge-warning");

    let docHtml = `<span class="text-muted"><i class="fa-regular fa-file"></i> ${g.doc || "Hồ sơ công trình"}</span>`;
    if (g.doc && g.doc.endsWith(".pdf")) {
      docHtml = `<a href="${g.doc}" target="_blank" class="badge positive" style="text-decoration:none;"><i class="fa-solid fa-file-pdf"></i> ${g.doc}</a>`;
    } else if (g.doc && g.doc.endsWith(".jpg")) {
      docHtml = `<a href="${g.doc}" target="_blank" class="badge warning" style="text-decoration:none;"><i class="fa-solid fa-image"></i> ${g.doc}</a>`;
    }

    return `
      <tr>
        <td class="text-center font-monospace">${idx + 1}</td>
        <td>
          <div class="fw-bold text-light">${g.name}</div>
          <div class="text-muted small font-monospace">${g.id || "N/A"} (${g.members} TV)</div>
        </td>
        <td>
          <span class="text-cyan small">${g.category}</span>
        </td>
        <td>
          <div class="text-light">${g.supplier}</div>
          <div class="text-muted small">${g.note || ""}</div>
        </td>
        <td>
          <div class="text-emerald small"><i class="fa-solid fa-clock-rotate-left"></i> ${g.lastActivity}</div>
          <div class="text-muted small font-monospace">${g.cacheCount || 0} file cache trên đĩa</div>
        </td>
        <td>
          <div class="${debtClass}">${g.debt}</div>
        </td>
        <td>
          ${docHtml}
        </td>
        <td>
          <span class="badge ${statusBadge}">${g.status}</span>
        </td>
      </tr>
    `;
  }).join("");
}
'''

# Find a good place to insert renderZaloSupplierGroups and call it
if "function renderZaloSupplierGroups" not in js_content:
    # Insert right after renderPOList
    target_js = "function renderPOList(filter = \"all\") {"
    if target_js in js_content:
        # We can append the function at the end or near renderPOList
        js_content = js_content + "\n" + zalo_render_func
        # Also in initUI or renderDashboard or switchTab, make sure it is called
        call_hook = "renderPOList();"
        if call_hook in js_content:
            js_content = js_content.replace(call_hook, "renderPOList();\n  renderZaloSupplierGroups();", 1)
        with open(app_js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print("SUCCESS: Added renderZaloSupplierGroups() and hook into app.js!")
    else:
        print("ERROR: Target function renderPOList not found in app.js!")
else:
    print("renderZaloSupplierGroups already exists in app.js")

