# -*- coding: utf-8 -*-
"""
Sanitize Tháng 11/2026 attendance data across all on-disk state files and SQLite WAL DB:
- Ensure days 11..30 (indices 10..29, after HÔM NAY 10/11/2026) are strictly empty ("")
- Recompute hc_tot, ot_tot, totalHC accurately from days 1..10
- Strip any custom_overrides keys > 10 in zalo_live_attendance.json and zaloAttendanceOverrides
"""
import json
import os
import sqlite3

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")

CLEAN_T11 = {
    "month": 11,
    "days": [
        {"day": 1, "dow": "CN"}, {"day": 2, "dow": "T2"}, {"day": 3, "dow": "T3"},
        {"day": 4, "dow": "T4"}, {"day": 5, "dow": "T5"}, {"day": 6, "dow": "T6"},
        {"day": 7, "dow": "T7"}, {"day": 8, "dow": "CN"}, {"day": 9, "dow": "T2"},
        {"day": 10, "dow": "T3"}, {"day": 11, "dow": "T4"}, {"day": 12, "dow": "T5"},
        {"day": 13, "dow": "T6"}, {"day": 14, "dow": "T7"}, {"day": 15, "dow": "CN"},
        {"day": 16, "dow": "T2"}, {"day": 17, "dow": "T3"}, {"day": 18, "dow": "T4"},
        {"day": 19, "dow": "T5"}, {"day": 20, "dow": "T6"}, {"day": 21, "dow": "T7"},
        {"day": 22, "dow": "CN"}, {"day": 23, "dow": "T2"}, {"day": 24, "dow": "T3"},
        {"day": 25, "dow": "T4"}, {"day": 26, "dow": "T5"}, {"day": 27, "dow": "T6"},
        {"day": 28, "dow": "T7"}, {"day": 29, "dow": "CN"}, {"day": 30, "dow": "T2"}
    ],
    "vp": [
        {
            "id": "vp_13_11",
            "name": "Tống Trần Hiệp",
            "dept": "Văn phòng",
            "role": "Sale Admin & Thiết kế 3D",
            "days": ["", 1, 1, 1, 1, 1, 1, "", 1, 1] + [""] * 20,
            "totalHC": 8.0
        },
        {
            "id": "vp_14_11",
            "name": "Đường Việt Dũng",
            "dept": "Văn phòng",
            "role": "Phòng Kinh Doanh",
            "days": ["", 1, 1, 1, 1, 1, 1, "", 1, 1] + [""] * 20,
            "totalHC": 8.0
        }
    ],
    "xuong": [
        {
            "id": "x_2_11",
            "name": "Hà Viết Hòa",
            "dept": "Xưởng",
            "role": "Thợ Cả / Kết cấu",
            "hc": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, "", 1.0, 1.0] + [""] * 20,
            "hc_tot": 9.0,
            "ot": [2.5, 2.0, 2.5, 2.0, 3.0, 2.5, 3.0, "", 2.0, 2.5] + [""] * 20,
            "ot_tot": 22.0
        },
        {
            "id": "x_3_11",
            "name": "Nguyễn Văn Thái",
            "dept": "Xưởng",
            "role": "Quản lý xưởng sản xuất",
            "hc": ["", 1, 1, 1, 1, 1, 1, "", 1, 1] + [""] * 20,
            "hc_tot": 8.0,
            "ot": [""] * 30,
            "ot_tot": 0
        },
        {
            "id": "x_4_11",
            "name": "Lê Văn Thoan",
            "dept": "Xưởng",
            "role": "Thợ chính / Dán cạnh máy",
            "hc": ["", 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, "", 1.0, 1.0] + [""] * 20,
            "hc_tot": 8.0,
            "ot": ["", 1.5, 2.0, "", 2.0, 1.5, 2.0, "", 1.5, 1.5] + [""] * 20,
            "ot_tot": 12.0
        },
        {
            "id": "x_5_11",
            "name": "Hoàng Công Vũ",
            "dept": "Xưởng",
            "role": "Kỹ thuật CNC / Bóc tách vật tư",
            "hc": ["", 1, 1, 1, 1, 1, 1, "", 1, 1] + [""] * 20,
            "hc_tot": 8.0,
            "ot": [""] * 30,
            "ot_tot": 0
        },
        {
            "id": "x_6_11",
            "name": "Lương Thể Hào",
            "dept": "Xưởng",
            "role": "Thợ chính / Lắp ráp",
            "hc": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] + [""] * 20,
            "hc_tot": 10.0,
            "ot": [2.5, 2.0, 2.5, 2.0, 2.5, 2.5, 3.0, 2.0, 2.5, 2.5] + [""] * 20,
            "ot_tot": 24.0
        },
        {
            "id": "x_7_11",
            "name": "Trần Văn Anh",
            "dept": "Xưởng",
            "role": "Thợ lắp đặt & Hoàn thiện",
            "hc": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, "", 1.0, 1.0] + [""] * 20,
            "hc_tot": 9.0,
            "ot": [2.0, 1.5, 2.0, 2.0, 2.5, 2.0, 2.5, "", 2.0, 2.5] + [""] * 20,
            "ot_tot": 19.0
        },
        {
            "id": "x_8_11",
            "name": "Lê Tuấn Anh",
            "dept": "Xưởng",
            "role": "Thợ phụ / Đóng gói",
            "hc": ["", 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, "", 1.0, 1.0] + [""] * 20,
            "hc_tot": 7.5,
            "ot": ["", 1.5, "", 1.5, 2.0, "", 1.5, "", 1.5, ""] + [""] * 20,
            "ot_tot": 8.0
        }
    ]
}

NEW_VERSION = "2026.11.14_v36_TIMESHEET_ZALO_CLEAN"


def clean_overrides(ov_dict):
    if not isinstance(ov_dict, dict):
        return {}
    cleaned = {}
    for sid, entry in ov_dict.items():
        if not isinstance(entry, dict):
            continue
        new_entry = {}
        for key in ("hc", "ot", "days"):
            if isinstance(entry.get(key), dict):
                sub = {}
                for d_str, val in entry[key].items():
                    try:
                        d_int = int(d_str)
                        if 1 <= d_int <= 10:
                            sub[str(d_int)] = val
                    except ValueError:
                        pass
                if sub:
                    new_entry[key] = sub
        if new_entry:
            cleaned[sid] = new_entry
    return cleaned


def sanitize_state_obj(state):
    if not isinstance(state, dict):
        return state
    state["appVersion"] = NEW_VERSION
    if not isinstance(state.get("timesheets"), dict):
        state["timesheets"] = {}
    state["timesheets"]["11"] = json.loads(json.dumps(CLEAN_T11))
    if "zaloAttendanceOverrides" in state:
        state["zaloAttendanceOverrides"] = clean_overrides(state.get("zaloAttendanceOverrides"))
    return state


def main():
    for fname in ("app_state.json", "pg_home_live_state.json", "app_state_live.json"):
        fpath = os.path.join(DATA_DIR, fname)
        if os.path.exists(fpath):
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    st = json.load(f)
                st = sanitize_state_obj(st)
                with open(fpath, "w", encoding="utf-8") as f:
                    json.dump(st, f, ensure_ascii=False, indent=2)
                print(f"[CLEANED] {fname}")
            except Exception as exc:
                print(f"[WARN] {fname}: {exc}")

    zalo_att_path = os.path.join(DATA_DIR, "zalo_live_attendance.json")
    if os.path.exists(zalo_att_path):
        try:
            with open(zalo_att_path, "r", encoding="utf-8") as f:
                att = json.load(f)
            if isinstance(att, dict):
                att["custom_overrides"] = clean_overrides(att.get("custom_overrides", {}))
                with open(zalo_att_path, "w", encoding="utf-8") as f:
                    json.dump(att, f, ensure_ascii=False, indent=2)
                print("[CLEANED] zalo_live_attendance.json")
        except Exception as exc:
            print(f"[WARN] zalo_live_attendance.json: {exc}")

    wal_db = os.path.join(DATA_DIR, "pg_home_state_wal.db")
    if os.path.exists(wal_db):
        try:
            conn = sqlite3.connect(wal_db)
            cur = conn.cursor()
            cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [r[0] for r in cur.fetchall()]
            for tbl in tables:
                cur.execute(f"PRAGMA table_info({tbl})")
                cols = [r[1] for r in cur.fetchall()]
                if "state_json" in cols:
                    cur.execute(f"SELECT rowid, state_json FROM {tbl}")
                    for rowid, sjson in cur.fetchall():
                        if sjson:
                            try:
                                parsed = json.loads(sjson)
                                parsed = sanitize_state_obj(parsed)
                                cur.execute(
                                    f"UPDATE {tbl} SET state_json = ? WHERE rowid = ?",
                                    (json.dumps(parsed, ensure_ascii=False), rowid)
                                )
                            except Exception:
                                pass
                elif "v" in cols and "k" in cols:
                    cur.execute(f"SELECT k, v FROM {tbl}")
                    for k, v in cur.fetchall():
                        if v and ("timesheets" in v or k == "app_state"):
                            try:
                                parsed = json.loads(v)
                                parsed = sanitize_state_obj(parsed)
                                cur.execute(
                                    f"UPDATE {tbl} SET v = ? WHERE k = ?",
                                    (json.dumps(parsed, ensure_ascii=False), k)
                                )
                            except Exception:
                                pass
            conn.commit()
            conn.close()
            print(f"[CLEANED] pg_home_state_wal.db (tables: {tables})")
        except Exception as exc:
            print(f"[WARN] pg_home_state_wal.db: {exc}")


if __name__ == "__main__":
    main()

