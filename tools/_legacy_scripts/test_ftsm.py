# -*- coding: utf-8 -*-
import sqlite3
import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

src = r"C:\Users\Admin\AppData\Roaming\ZaloData\ftsm_2304805760907141944.db"
dst = r"C:\Users\Admin\.gemini\antigravity\brain\548cb099-9df8-4d9a-943b-40dc35256196\scratch\ftsm_copy.db"
os.makedirs(os.path.dirname(dst), exist_ok=True)
try:
    shutil.copyfile(src, dst)
    # Also copy wal if exists
    if os.path.exists(src + "-wal"):
        shutil.copyfile(src + "-wal", dst + "-wal")
    if os.path.exists(src + "-shm"):
        shutil.copyfile(src + "-shm", dst + "-shm")
except Exception as e:
    print("Copy error:", e)

try:
    conn = sqlite3.connect(dst)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cur.fetchall()
    print("Tables in FTSM:", tables)
    for t in tables:
        tname = t[0]
        cur.execute(f"PRAGMA table_info({tname});")
        cols = cur.fetchall()
        cur.execute(f"SELECT COUNT(*) FROM {tname};")
        cnt = cur.fetchone()[0]
        print(f"\nTable {tname} ({cnt} rows):")
        print("  Cols:", [c[1] for c in cols])
        cur.execute(f"SELECT * FROM {tname} LIMIT 3;")
        for row in cur.fetchall():
            print("  Sample row:", str(row)[:200])
except Exception as e:
    print("SQLite error:", e)

