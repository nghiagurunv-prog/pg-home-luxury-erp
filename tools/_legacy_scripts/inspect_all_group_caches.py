# -*- coding: utf-8 -*-
import os
import sys
import glob
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

resource_dir = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource"

print(f"Scanning {resource_dir}...")
g_folders = [d for d in os.listdir(resource_dir) if d.startswith('g') and os.path.isdir(os.path.join(resource_dir, d))]
print(f"Total group resource folders found: {len(g_folders)}")

folder_stats = []
for g in g_folders:
    g_path = os.path.join(resource_dir, g)
    files = []
    total_size = 0
    newest = 0
    oldest = 9999999999
    
    for root, _, f_list in os.walk(g_path):
        for f in f_list:
            fp = os.path.join(root, f)
            try:
                st = os.stat(fp)
                files.append((f, st.st_size, st.st_mtime))
                total_size += st.st_size
                if st.st_mtime > newest: newest = st.st_mtime
                if st.st_mtime < oldest: oldest = st.st_mtime
            except:
                pass
                
    if files:
        newest_str = datetime.fromtimestamp(newest).strftime('%Y-%m-%d %H:%M')
        oldest_str = datetime.fromtimestamp(oldest).strftime('%Y-%m-%d %H:%M')
        # Check extensions
        exts = {}
        for f, sz, _ in files:
            ext = os.path.splitext(f)[1].lower()
            exts[ext] = exts.get(ext, 0) + 1
        folder_stats.append({
            'group_id': g,
            'count': len(files),
            'size_mb': round(total_size / (1024*1024), 2),
            'oldest': oldest_str,
            'newest': newest_str,
            'exts': exts,
            'sample_files': [f[0] for f in sorted(files, key=lambda x: x[2], reverse=True)[:5]]
        })

# Sort by newest
folder_stats.sort(key=lambda x: x['newest'], reverse=True)

print(f"\nTop 25 most active group folders in 2026:")
for s in folder_stats[:25]:
    print(f"Folder: {s['group_id']} | Files: {s['count']} ({s['size_mb']} MB) | Range: {s['oldest']} -> {s['newest']}")
    print(f"   Extensions: {s['exts']}")
    print(f"   Recent files: {s['sample_files']}")
    print("-" * 60)

