# HƯỚNG DẪN SỬ DỤNG TOOL ĐỌC TIN NHẮN ZALO NGẦM VÔ HÌNH (PG HOME LUXURY)

> **File thực thi:** [tools/zalo_stealth_reader.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/zalo_stealth_reader.py)  
> **Phiên bản:** `4.0-ULTRA-STEALTH-MASTER`  
> **Tuân thủ:** Tuyệt đối WCS-UL10 & Rule 9 của Giám Đốc Nguyễn Viết Nghĩa.

---

## 1. NGUYÊN TẮC AN TOÀN VẬT LÝ SỐNG CÒN (ZERO DISRUPTION & KHÔNG CẦN MỞ ZALO)
1. **Hoạt động khi Zalo đóng khay hệ thống (vis=0):** Dù Zalo đang ẩn, thu nhỏ hay tắt cửa sổ, script tự động điều phối tọa độ ảo Off-Screen `(-30000, -30000)` kích thước `1280x1024` để Chromium render toàn bộ cây DOM mà không có một pixel nào xuất hiện trên màn hình Giám Đốc. Đọc xong tự động hoàn trả Zalo về khay (`SW_HIDE`).
2. **Tuyệt đối cấm di chuyển chuột:** Cấm `SetCursorPos`, `mouse_event`, `pyautogui`. Mọi thao tác click và cuộn đều gửi ngầm qua Win32 `PostMessageW(render_hwnd)` với mã hóa `WM_MOUSEMOVE` + `WM_LBUTTONDOWN` + `WM_LBUTTONUP`.
3. **Tuyệt đối không cướp Focus:** Không dùng `SetForegroundWindow`, không làm mất ký tự khi Giám Đốc đang soạn thảo Word, CAD, Excel hoặc lướt web.
4. **Không ghi đè Clipboard:** Không can thiệp vào bộ nhớ tạm.
5. **Độ sâu quét Depth 12:** Nhận diện 100% bóng tin nhắn, phân loại `INCOMING` / `OUTGOING`, bóc tách công thợ, giờ OT, mã đơn hàng (`PO/SON/DH`), công nợ và số tài khoản ngân hàng.

---

## 2. CÁC LỆNH SỬ DỤNG CHÍNH

### A. Đọc ngay hội thoại/nhóm đang mở hiện tại (Siêu nhanh - Zero click):
```powershell
python tools/zalo_stealth_reader.py
```
*(Mặc định lấy 15 tin nhắn mới nhất, tự động nhận diện người gửi INCOMING / OUTGOING và bóc tách thực thể nghiệp vụ).*

### B. Chỉ định đọc 1 nhóm cụ thể:
```powershell
python tools/zalo_stealth_reader.py --group "Bảng chấm công" --limit 20
```

### C. Liệt kê danh sách các nhóm đang hiển thị trong Zalo:
```powershell
python tools/zalo_stealth_reader.py --list-groups
```

### D. Cuộn ngược lên để nạp thêm tin nhắn cũ trong quá khứ:
```powershell
python tools/zalo_stealth_reader.py --group "Bảng chấm công" --scroll 3 --limit 30
```

### E. Xuất kết quả ra file JSON:
```powershell
python tools/zalo_stealth_reader.py --output "data/tin_nhan_moi.json"
```

### F. Chế độ Daemon giám sát liên tục chạy ngầm (tự động ghi log tin nhắn mới):
```powershell
python tools/zalo_stealth_reader.py --watch --interval 10 --output "data/zalo_stream_log.jsonl"
```

