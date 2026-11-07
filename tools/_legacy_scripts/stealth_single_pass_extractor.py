# -*- coding: utf-8 -*-
"""
SINGLE-PASS STEALTH ZALO MULTI-BATCH EXTRACTOR (100% ZERO-DISRUPTION, DWM CLOAKED AT (-30000, -30000))
Quét từ đỉnh xuống đáy conversationList trong 1 lượt duy nhất ở tọa độ ảo (-30000, -30000)
kèm DWMWA_CLOAK=1 + Layered Alpha=1 (0% nháy màn hình, 0% nhảy cửa sổ), tự động nhận diện
và kéo dữ liệu tin nhắn của cả 4 Phân Nhóm Chiến Lược:
  1. Nhóm chung công việc nội bộ & Công trình khách hàng
  2. Chat riêng (1-1) Giám Đốc với Nhân sự công ty
  3. Chat riêng với Chị Hương (vợ Giám Đốc) & Gia đình
  4. Nhóm & Chat riêng với Nhà Cung Cấp (NCC)
"""
import os
import sys
import json
import time
import re
import datetime
import ctypes
from ctypes import wintypes

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"f:\PG Home - Quản trị\tools\_legacy_scripts")

import zalo_stealth_reader as zsr
import uiautomation as auto

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

def is_user_actively_typing_or_moving(zalo_hwnd):
    """
    Chỉ coi là tương tác nếu Giám Đốc đang focus Zalo VÀ thực sự có thao tác gõ phím/chuột
    trong 3.5 giây gần nhất (dùng GetLastInputInfo của Windows).
    """
    try:
        fg = user32.GetForegroundWindow()
        if not (fg and (fg == zalo_hwnd or user32.IsChild(zalo_hwnd, fg))):
            return False
        class LASTINPUTINFO(ctypes.Structure):
            _fields_ = [('cbSize', wintypes.UINT), ('dwTime', wintypes.DWORD)]
        lii = LASTINPUTINFO()
        lii.cbSize = ctypes.sizeof(LASTINPUTINFO)
        user32.GetLastInputInfo(ctypes.byref(lii))
        idle_s = (kernel32.GetTickCount() - lii.dwTime) / 1000.0
        return idle_s < 3.5
    except Exception:
        return False

def check_header_match(t_raw, a_raw):
    """So khớp tên hội thoại và active header trong MessageViewContainer"""
    if not t_raw or not a_raw:
        return False
    t_clean = re.sub(r'[\ue000-\uf8ff]', '', t_raw).lower().replace('\xa0', ' ').strip()
    a_clean = re.sub(r'[\ue000-\uf8ff]', '', a_raw).lower().replace('\xa0', ' ').strip()
    if not t_clean or not a_clean:
        return False
    # Khớp chuỗi trực tiếp
    if t_clean in a_clean or a_clean in t_clean:
        return True
    if len(t_clean) >= 6 and (t_clean[:8] in a_clean or a_clean[:8] in t_clean):
        return True
    # Khớp từ khóa
    t_words = [w for w in re.split(r'\W+', t_clean) if len(w) > 1]
    a_words = [w for w in re.split(r'\W+', a_clean) if len(w) > 1]
    if not t_words:
        return t_clean in a_clean
    matched = [w for w in t_words if w in a_words]
    if len(t_words) == 1:
        return len(matched) == 1
    return len(matched) >= min(2, len(t_words))

OUT_DIR = r"f:\PG Home - Quản trị\data\zalo_pulled_batches"
os.makedirs(OUT_DIR, exist_ok=True)

# Định nghĩa bộ phân loại chính xác cho 4 nhóm mục tiêu
INTERNAL_EXACT_OR_SUB = [
    "nhóm văn phòng phú gia", "bảng chấm công xưởng", "bộ phận xưởng sản xuất",
    "quản trị 2026", "2026 bảng lương hàng tháng", "phòng sale- bán hàng",
    "bản cập nhật giá trị cuối cùng", "pg_thị trường tháng", "sơn cnc - cty phu gia",
    "2026 vật tư xưởng", "pg home - bảo hành", "xe chơ hàng", "thi đua báo giá",
    "2025. duyệt báo giá", "pg-phú gia home trao đổi", "thu chi xưởng"
]

STAFF_TARGETS = [
    "phú gia hiệp g", "dũng pg home", "hòa pghome", "hoà pghome", "hòa thợ", "hoà thợ",
    "vũ", "thái pg home 2026", "thái pg home", "luu dung vn", "tuyết phú gia home luxury",
    "hùng gđ", "lực xưởng pg home", "bình pg home thạch hà", "bình pg home",
    "nga kế toán pg home", "nga kế toán"
]

HUONG_FAMILY_TARGETS = [
    "hương", "thu hương", "list khách hàng hương", "my family",
    "nguyễn viết nhân, thu hương, nghĩa guru", "nguyễn viết nhân"
]

SUPPLIER_KEYWORDS = [
    "lam giang", "lamgiang", "tâm quốc", "quốc tâm", "cầu vượt", "trần liên gỗ",
    "anh vinh đt cầu vượt", "ái linh an cường", "al sale minh", "cường thinh", "cường thịnh",
    "đặt hàng phú gia - fami", "đặt ván văn nhàn", "hưng giang", "đại lâm mộc",
    "plywood", "sao việt", "công duyên phụ kiện", "đại lý phụ kiện", "aroki",
    "tiến thành", "vương anh phụ kiện", "phụ kiện gia phát", "vua phụ kiện",
    "phúc sơn", "đèn led", "lighting", "led nhôm", "đặt cánh acrylic",
    "cánh huỳnh ald", "đặt cánh lic", "cánh kính", "đặt kính việt nhật",
    "kính gương phú mỹ", "gương led", "gương bỉ dantalux", "đặt gương",
    "ánh gương", "gỗ thịt", "vợ sồi đức anh", "sơn pu", "sơn nội thất",
    "hoàng hà ceramic", "đá mềm đức thành tín", "ốp đá nung kết",
    "cửa composite", "cửa compozit", "bàn ghế", "sofa nam minh"
]

PROJECT_KEYWORDS = [
    "thiết kế nhà", "tk và tc nhà", "tk nhà", "thi công nhà", "2026 nhà",
    "2026 - nhà", "2026. nhà", "3d nhà gì lệ", "tư vấn báo giá nhà",
    "báo giá thi công nhà", "tủ bếp a dũng", "bác giáp nhà trọn gói",
    "thi công quyết toán_hùng", "sx phòng ngủ a hoàng", "vách chị hiền"
]

def classify_title(title):
    t_low = title.lower().strip()
    t_norm = re.sub(r'[\ue000-\uf8ff]', '', t_low).replace('\xa0', ' ').strip()
    
    # 1. Family / Huong
    if t_norm in ("hương", "thu hương", "list khách hàng hương", "my family"):
        return "HUONG_FAMILY"
    if any(h in t_norm for h in ["thu hương", "list khách hàng hương", "my family", "nguyễn viết nhân"]):
        return "HUONG_FAMILY"
    if t_norm == "hương" or t_norm.startswith("hương ") or t_norm.endswith(" hương"):
        if not any(k in t_norm for k in ["hưng", "thương", "hướng"]):
            return "HUONG_FAMILY"

    # 2. Staff (Chat 1-1)
    if t_norm == "vũ" or t_norm.startswith("vũ ") or t_norm.endswith(" vũ"):
        return "STAFF"
    for s in STAFF_TARGETS:
        if s in t_norm:
            return "STAFF"
    if any(k in t_norm for k in ["hòa pghome", "hoà pghome", "hòa thợ", "hoà thợ", "bình pg home", "nga kế toán", "lực xưởng"]):
        return "STAFF"

    # 3. Internal groups
    for k in INTERNAL_EXACT_OR_SUB:
        if k in t_norm:
            return "INTERNAL"

    # 4. Supplier groups / chats
    for k in SUPPLIER_KEYWORDS:
        if k in t_norm:
            return "SUPPLIER"

    # 5. Project groups / chats
    for k in PROJECT_KEYWORDS:
        if k in t_norm:
            return "PROJECT"

    return None

def extract_cell_texts(ctrl, max_depth=4):
    texts = []
    for s, _ in auto.WalkControl(ctrl, maxDepth=max_depth):
        if s.ControlTypeName == 'TextControl' and s.Name:
            t = re.sub(r'[\ue000-\uf8ff]', '', s.Name.strip().replace('\xa0', ' ')).strip()
            if t and t not in texts:
                texts.append(t)
    return texts

def save_batches(batches, visited_titles, start_ts):
    elapsed = round(time.time() - start_ts, 2)
    meta = {
        "extracted_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "elapsed_seconds": elapsed,
        "total_visited_conversations": len(visited_titles),
        "counts": {k: len(v) for k, v in batches.items()}
    }

    f1 = os.path.join(OUT_DIR, "batch1_internal_and_projects.json")
    with open(f1, "w", encoding="utf-8") as f:
        json.dump({"meta": meta, "internal_groups": batches["INTERNAL"], "project_groups": batches["PROJECT"]}, f, ensure_ascii=False, indent=2)

    f2 = os.path.join(OUT_DIR, "batch2_private_staff.json")
    with open(f2, "w", encoding="utf-8") as f:
        json.dump({"meta": meta, "private_staff": batches["STAFF"]}, f, ensure_ascii=False, indent=2)

    f3 = os.path.join(OUT_DIR, "batch3_family_huong.json")
    with open(f3, "w", encoding="utf-8") as f:
        json.dump({"meta": meta, "family_huong": batches["HUONG_FAMILY"]}, f, ensure_ascii=False, indent=2)

    f4 = os.path.join(OUT_DIR, "batch4_suppliers_ncc.json")
    with open(f4, "w", encoding="utf-8") as f:
        json.dump({"meta": meta, "suppliers_ncc": batches["SUPPLIER"]}, f, ensure_ascii=False, indent=2)

    return meta

def main():
    batches = {
        "INTERNAL": {},
        "PROJECT": {},
        "STAFF": {},
        "HUONG_FAMILY": {},
        "SUPPLIER": {}
    }
    visited_titles = set()
    start_ts = time.time()

    with zsr.stealth_zalo_session() as (zalo_hwnd, render_hwnd, doc, app_page, was_visible):
        conv_list = doc.TableControl(AutomationId="conversationList")
        if not conv_list.Exists(2.5, 0):
            print("ERROR: conversationList not found")
            return

        r_rect = zsr.RECT()
        user32.GetWindowRect(render_hwnd, ctypes.byref(r_rect))
        win_top = r_rect.top
        win_bottom = r_rect.bottom
        win_left = r_rect.left
        win_right = r_rect.right

        visible_top = win_top + 60
        visible_bottom = win_bottom - 15

        # Tọa độ X, Y trung tâm danh sách hội thoại
        list_cx = win_left + 236
        list_cy = (win_top + win_bottom) // 2

        try:
            init_children = conv_list.GetChildren()
            if init_children:
                row0 = init_children[0]
                cells = row0.GetChildren()
                for c in cells:
                    rc0 = c.BoundingRectangle
                    if rc0.right > rc0.left:
                        list_cx = (rc0.left + rc0.right) // 2
                        break
        except Exception as e:
            print("Notice on list_cx calc:", e)

        print(f"[Init] Cloaked Window: ({win_left}, {win_top}) - ({win_right}, {win_bottom}), list_cx={list_cx}, list_cy={list_cy}")

        # Đưa danh sách về đỉnh ban đầu hoàn toàn bằng WM_MOUSEWHEEL ngầm (không dùng ScrollIntoView gây nhảy vị trí)
        for _ in range(18):
            zsr.post_scroll_background(render_hwnd, list_cx, list_cy, steps_up=20)
        time.sleep(0.25)

        zero_new_streak = 0
        step = 0
        max_steps = 80

        while step < max_steps:
            if is_user_actively_typing_or_moving(zalo_hwnd):
                print(f"[Step {step}] Giám Đốc đang thao tác Zalo, tạm dừng 2.5s...")
                time.sleep(2.5)
                continue

            children = conv_list.GetChildren()
            if not children:
                break
            row0 = children[0]
            cells = row0.GetChildren()
            new_in_step = 0

            for cell in cells:
                texts = extract_cell_texts(cell, max_depth=4)
                if not texts:
                    continue
                title = texts[0]
                if title in visited_titles:
                    continue

                cat = classify_title(title)
                if not cat:
                    visited_titles.add(title)
                    new_in_step += 1
                    continue

                # Kiểm tra tọa độ hiển thị thực tế của cell trong vùng nhìn thấy
                rc = cell.BoundingRectangle
                if rc.right <= rc.left or rc.bottom <= rc.top or rc.top < visible_top or rc.bottom > visible_bottom:
                    # Cell bị khuất một phần ở mép trên hoặc dưới, đợi step cuộn tiếp theo
                    continue

                # Đối với PROJECT cũ (sau khi đủ 22 project mới nhất), chỉ lấy preview để cực nhanh
                if cat == "PROJECT" and len(batches["PROJECT"]) >= 22:
                    visited_titles.add(title)
                    new_in_step += 1
                    batches[cat][title] = {
                        "title": title,
                        "active_header": title + " (Preview Indexed)",
                        "header_verified": True,
                        "category": cat,
                        "preview": texts[1:5],
                        "scroll_step": step,
                        "messages_pulled": 0,
                        "messages": [],
                        "note": "Preview indexed (Historical project)"
                    }
                    continue

                visited_titles.add(title)
                new_in_step += 1

                cx = (rc.left + rc.right) // 2
                cy = (rc.top + rc.bottom) // 2

                zsr.post_click_background(render_hwnd, cx, cy)
                time.sleep(0.50)

                active_hdr = zsr.get_active_conversation_title(doc)
                header_ok = check_header_match(title, active_hdr)

                if not header_ok:
                    time.sleep(0.20)
                    rc2 = cell.BoundingRectangle
                    if rc2.right > rc2.left and rc2.top >= visible_top and rc2.bottom <= visible_bottom:
                        cx2 = (rc2.left + rc2.right) // 2
                        cy2 = (rc2.top + rc2.bottom) // 2
                        zsr.post_click_background(render_hwnd, cx2, cy2)
                        time.sleep(0.55)
                    else:
                        zsr.post_click_background(render_hwnd, cx, cy)
                        time.sleep(0.55)
                    active_hdr = zsr.get_active_conversation_title(doc)
                    header_ok = check_header_match(title, active_hdr)

                # Số lần scroll tùy mức độ quan trọng
                scroll_up = 1 if (header_ok and cat in ("INTERNAL", "STAFF", "HUONG_FAMILY", "SUPPLIER") and step < 30) else 0
                msgs = zsr.read_active_messages(app_page, limit=35, scroll_up_times=scroll_up, render_hwnd=render_hwnd) if header_ok else []

                batches[cat][title] = {
                    "title": title,
                    "active_header": active_hdr,
                    "header_verified": header_ok,
                    "category": cat,
                    "preview": texts[1:5],
                    "scroll_step": step,
                    "messages_pulled": len(msgs),
                    "messages": msgs
                }
                print(f"[{cat}] Pulled '{title}' -> Header='{active_hdr[:30]}' (verified={header_ok}, {len(msgs)} msgs) at step {step}", flush=True)

            # Lưu định kỳ mỗi 10 bước
            if step % 10 == 0:
                save_batches(batches, visited_titles, start_ts)

            # Cuộn xuống danh sách hội thoại hoàn toàn bằng WM_MOUSEWHEEL ngầm
            zsr.post_scroll_background(render_hwnd, list_cx, list_cy, steps_up=-5)
            time.sleep(0.10)

            if new_in_step == 0:
                zero_new_streak += 1
                if zero_new_streak >= 7 and step > 25:
                    print(f"Reached end of conversation list at step {step} (zero_new_streak={zero_new_streak})", flush=True)
                    break
            else:
                zero_new_streak = 0

            step += 1

        # Trả danh sách về đầu trang bằng WM_MOUSEWHEEL ngầm
        for _ in range(18):
            zsr.post_scroll_background(render_hwnd, list_cx, list_cy, steps_up=20)

    meta = save_batches(batches, visited_titles, start_ts)
    print("COMPLETED ALL 4 BATCHES:", json.dumps(meta, ensure_ascii=False), flush=True)

if __name__ == "__main__":
    main()

