# HƯỚNG DẪN SỬ DỤNG TOOL ĐỌC TIN NHẮN ZALO AN TOÀN (PG HOME LUXURY)

> **Vị trí file:** `tools/read_zalo_messages.py`  
> **Tác giả:** Trợ lý AI Antigravity & BGĐ PG Home Luxury  
> **Mục tiêu:** Tự động kết nối Zalo PC để bóc tách thông tin khách hàng, đơn hàng, tệp đính kèm vật tư từ các nhóm chat (Ví dụ: nhóm `KÍNH VIỆT NHẬT - PHÚ GIA LUXURY`).

---

## 1. NGUYÊN TẮC AN TOÀN TUYỆT ĐỐI
- **Không can thiệp tiến trình:** Tuyệt đối không kill hay restart tiến trình `Zalo.exe` hoặc `chrome.exe`.
- **Không treo Terminal:** Script chạy theo cơ chế Single-shot (quét 1 lần) kèm cơ chế ngắt Timeout chủ động (mặc định 25 giây), tự động giải phóng tài nguyên và thoát sạch với mã `exit 0`.
- **Bảo toàn trạng thái người dùng:** Sau khi tìm kiếm nhóm chat, script tự động gửi lệnh `Esc` để đóng thanh tìm kiếm và trả giao diện Zalo về trạng thái sạch ban đầu.
- **Tương thích môi trường ảo hóa / Sandbox:** Tự động chuyển đổi sang WindowStation `WinSta0\\Default` bằng Windows API Ctypes để truy xuất chính xác cây DOM Electron của Zalo PC.

---

## 2. CÁCH SỬ DỤNG QUA TERMINAL / DÒNG LỆNH

### A. Quét nhóm Kính Việt Nhật mặc định:
```powershell
python -X utf8 "tools/read_zalo_messages.py"
```

### B. Chỉ định nhóm chat khác và số lượng tin nhắn:
```powershell
python -X utf8 "tools/read_zalo_messages.py" --group "TÊN_NHÓM_ZALO" --limit 30
```

### C. Xuất kết quả trực tiếp ra file JSON:
```powershell
python -X utf8 "tools/read_zalo_messages.py" --group "KÍNH VIỆT NHẬT - PHÚ GIA LUXURY" --output "don_hang_kinh.json"
```

---

## 3. CẤU TRÚC KẾT QUẢ ĐẦU RA (JSON)
Kết quả in trực tiếp ra Standard Output (`stdout`) dưới dạng JSON chuẩn UTF-8:
```json
{
  "status": "SUCCESS",
  "timestamp": "2026-10-30T10:29:14.967427",
  "group_name": "KÍNH VIỆT NHẬT - PHÚ GIA LUXURY",
  "summary": {
    "total_messages_read": 10,
    "total_files_detected": 1,
    "has_order_info": true,
    "execution_duration_sec": 7.85
  },
  "order_data": {
    "customer_name": "Hoàng Công Vũ",
    "phone": null,
    "address": "53 Trương Quốc Dụng - P.Thành Sen-TP Hà Tĩnh",
    "supplier_bank": {
      "stk": "1026642626",
      "raw_info": "Stk: 1026642626 | Công ty Cổ phần Kính An Toàn Việt Nhật | Tk Vietcombank - chi nhánh Hoàn Kiếm"
    },
    "attached_files": [
      {
        "filename": "cty Phú Gia Home Luxury.pdf",
        "size": "269.51 KB",
        "extension": "pdf"
      }
    ]
  },
  "messages": [
    {
      "msg_id": "bb_msg_id_1793328530397",
      "sender": "cty",
      "time": "09:48",
      "date": "09:31 Hôm nay",
      "content": "Em gửi đơn tạm tính ạ, phiếu chuẩn bên kế toán gửi sau ạ",
      "attachments": [
        {
          "filename": "cty Phú Gia Home Luxury.pdf",
          "size": "269.51 KB",
          "extension": "pdf"
        }
      ]
    },
    {
      "msg_id": "bb_msg_id_1793328789814",
      "sender": "Vũ",
      "time": "09:53",
      "date": "09:31 Hôm nay",
      "content": "Họ và Tên: Hoàng Công Vũ\nSĐT: ...\nĐịa Chỉ: 53 Trương Quốc Dụng - P.Thành Sen-TP Hà Tĩnh",
      "attachments": []
    },
    {
      "msg_id": "bb_msg_id_1793329488815",
      "sender": "Thoan Vsg",
      "time": "",
      "date": "09:31 Hôm nay",
      "content": "Stk: 1026642626\nCông ty Cổ phần Kính An Toàn Việt Nhật\nTk Vietcombank - chi nhánh Hoàn Kiếm",
      "attachments": []
    }
  ]
}
```

---

## 4. TÍCH HỢP TỰ ĐỘNG VÀO HỆ THỐNG QUẢN TRỊ VẬT TƯ
- **Phân hệ Vũ (Kỹ thuật/Vật tư xưởng):** Khi Vũ hoặc xưởng trao đổi đặt kính/gỗ/phụ kiện trên Zalo, tool tự động gom file báo giá tạm tính (PDF/Excel), địa chỉ công trình và STK nhà cung cấp vào hệ thống.
- **Đóng dấu duyệt đỏ:** Kết hợp với quy trình ký duyệt PO điện tử của Giám Đốc trước khi chuyển khoản tiền cọc kính cho Việt Nhật.

