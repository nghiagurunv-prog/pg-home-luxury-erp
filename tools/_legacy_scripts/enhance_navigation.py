# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

app_js_path = r"F:\PG Home - Quản trị\web_app\app.js"

with open(app_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

target_switch = """function switchTabTo(tabId) {
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-tab") === tabId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  document.querySelectorAll(".tab-pane").forEach(pane => {
    if (pane.id === tabId) {
      pane.classList.add("active");
    } else {
      pane.classList.remove("active");
    }
  });
}"""

replacement_switch = """function switchTabTo(tabId) {
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-tab") === tabId) {
      item.classList.add("active");
      const span = item.querySelector("span");
      if (span) {
        const topBread = document.getElementById("currentBreadcrumb");
        if (topBread) topBread.textContent = span.textContent;
      }
    } else {
      item.classList.remove("active");
    }
  });

  document.querySelectorAll(".tab-pane").forEach(pane => {
    if (pane.id === tabId) {
      pane.classList.add("active");
    } else {
      pane.classList.remove("active");
    }
  });

  // Gọi ngay hàm render chuyên biệt để bảng luôn luôn đầy đủ dữ liệu
  if (tabId === "tab-vat-tu-cost") {
    renderVatTu();
  } else if (tabId === "tab-phe-duyet-vat-tu") {
    renderPOList();
    renderZaloSupplierGroups();
  } else if (tabId === "tab-van-phong-sale") {
    renderHopDong();
  } else if (tabId === "tab-xuong-san-xuat") {
    renderKhoiLuongXuong("9");
  } else if (tabId === "tab-ccsc-matrix") {
    renderCCSCTable();
  } else if (tabId === "tab-cong-no-dong-tien") {
    renderCongNo();
  }
}

// Lắng nghe URL Hash để chuyển tab và nạp dữ liệu tức thì
function handleHashNavigation() {
  const hash = window.location.hash;
  if (!hash) return;
  const clean = hash.replace("#", "");
  const targetItem = document.querySelector(`.nav-item[href='#${clean}']`);
  if (targetItem) {
    const dataTab = targetItem.getAttribute("data-tab");
    if (dataTab) {
      switchTabTo(dataTab);
    }
  }
}
window.addEventListener("hashchange", handleHashNavigation);"""

js_norm = js_content.replace('\r\n', '\n')
t_norm = target_switch.replace('\r\n', '\n')
r_norm = replacement_switch.replace('\r\n', '\n')

if t_norm in js_norm:
    new_js = js_norm.replace(t_norm, r_norm, 1)
    
    # Also add handleHashNavigation() call in DOMContentLoaded
    target_dcl = 'console.log("PG HOME LUXURY CCSC App Initialized Successfully with RBAC.");'
    replacement_dcl = 'console.log("PG HOME LUXURY CCSC App Initialized Successfully with RBAC.");\n  handleHashNavigation();'
    new_js = new_js.replace(target_dcl, replacement_dcl, 1)

    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(new_js)
    print("SUCCESS: Enhanced switchTabTo and added hashchange listener!")
else:
    print("ERROR: target_switch not found in app.js!")

