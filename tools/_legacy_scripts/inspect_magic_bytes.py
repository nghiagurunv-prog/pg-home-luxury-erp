# -*- coding: utf-8 -*-
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

resource_dir = r"C:\Users\Admin\AppData\Roaming\ZaloData\media\2304805760907141944\ZaloDownloads\resource"

magic_stats = {}
pdf_files = []
zip_files = []
image_files = []

count = 0
for root, _, files in os.walk(resource_dir):
    for f in files:
        if f.startswith('.'): continue
        fp = os.path.join(root, f)
        try:
            with open(fp, 'rb') as fp_in:
                head = fp_in.read(16)
            if head.startswith(b'%PDF'):
                magic = 'PDF'
                pdf_files.append((fp, os.path.getsize(fp)))
            elif head.startswith(b'PK\x03\x04'):
                magic = 'ZIP/Office (docx/xlsx)'
                zip_files.append((fp, os.path.getsize(fp)))
            elif head.startswith(b'\xff\xd8\xff'):
                magic = 'JPEG'
            elif head.startswith(b'\x89PNG'):
                magic = 'PNG'
            elif head.startswith(b'\x00\x00\x00\x0cJXL'):
                magic = 'JPEG XL'
            elif head.startswith(b'AC10'):
                magic = 'AutoCAD DWG'
            else:
                magic = f'Unknown ({head[:4]})'
            magic_stats[magic] = magic_stats.get(magic, 0) + 1
            count += 1
            if count > 2000: break
        except:
            pass
    if count > 2000: break

print("Magic stats across 2,000 files:")
for k, v in sorted(magic_stats.items(), key=lambda x: x[1], reverse=True):
    print(f"  {k}: {v}")

print(f"\nPDFs found: {len(pdf_files)}")
for p, sz in pdf_files[:10]:
    print(f"  {p} ({round(sz/1024, 1)} KB)")

print(f"\nZIP/Office files found: {len(zip_files)}")
for z, sz in zip_files[:10]:
    print(f"  {z} ({round(sz/1024, 1)} KB)")

