# BỘ NHỚ LÀM VIỆC & BÀN GIAO PHIÊN (SESSION MEMORY)
## DỰ ÁN: QUẢN TRỊ TÀI CHÍNH CCSC & VẬN HÀNH DOANH NGHIỆP PG HOME LUXURY
*Thời điểm chốt phiên: 28/10/2026 - Giám Đốc Nguyễn Viết Nghĩa*

---

### 1. TÌNH TRẠNG HIỆN TẠI CỦA DỰ ÁN
1. **Dữ liệu đối soát tài chính T8 & T9:**
   - 100% đồng bộ giữa 3 file Excel:
     * `f:\PG Home - Quản trị\BẢNG QUẢN TRỊ TÀI CHÍNH THỰC TẾ T8 T9 NĂM 2026.xlsx`
     * `f:\PG Home - Quản trị\2. CSC - Chỉ số\BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx`
     * `f:\PG Home - Quản trị\web_app\BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx`
   - Số liệu chốt: Doanh số 529,834,472 đ; Chi phí 497,395,751 đ; Lợi nhuận văn phòng 32,438,721 đ; Lợi nhuận phụ kiện 11,652,000 đ; Lợi nhuận xưởng = 0 đ (do âm quỹ thợ -5.86M); **Tổng lợi nhuận ròng bỏ túi BGĐ = 44,090,721 đ**.

2. **Dọn dẹp nhân sự đã nghỉ việc (Hoàn thành theo lệnh Giám Đốc):**
   - Đã xóa bỏ vĩnh viễn 4 nhân sự đã nghỉ việc (0 ngày công trong bảng lương thực tế):
     * **Phan Thanh Lực** (Bộ phận Xưởng).
     * **Phan Xuân Hùng** (Bộ phận Văn phòng / Kinh doanh).
     * **Phan Văn Bình** (Bộ phận Văn phòng / Kinh doanh).
     * **Dương Thị Tuyết** (Bộ phận Văn phòng / Kế toán).
   - Đã cập nhật bộ lọc tự động trong `loadState()` của `web_app/app.js` để tự động làm sạch `localStorage` trên mọi trình duyệt.
   - Thẻ theo dõi quân số cập nhật chuẩn xác: **9 Người (7 Thợ Xưởng + 2 Văn Phòng)**.

3. **Danh sách 9 nhân sự thực tế đang công tác (Active):**
   - **Xưởng (7 người):**
     1. Hà Viết Hòa – Thợ Cả / Kết cấu (T8: 21 công | T9: 24 công)
     2. Nguyễn Văn Thái – Quản lý xưởng sản xuất (T8: 26 công | T9: 24.5 công)
     3. Lê Văn Thoan – Thợ chính / Dán cạnh máy (T8: 22 công | T9: 20.5 công)
     4. Hoàng Công Vũ – Kỹ thuật bóc tách / CNC (T8: 22 công | T9: 25.5 công)
     5. Lương Thể Hào – Thợ chính / Lắp ráp khung (T8: 22.5 công | T9: 18.5 công)
     6. Trần Văn Anh (Anh Xưởng) – Thợ lắp đặt & Hoàn thiện (T8: 18 công | T9: 18 công)
     7. Tuấn Anh – Thợ phụ lắp ráp & Đóng gói (Vào từ T9: 9.5 công)
   - **Văn phòng (2 người):**
     1. Tống Trần Hiệp – Sale Admin & Thiết kế 3D (T8: 26 công | T9: 26 công)
     2. Đường Việt Dũng – Phòng Kinh Doanh (T8: 26 công | T9: 25 công)

---

### 2. KẾT QUẢ TRIỂN KHAI GIAI ĐOẠN 1 (HOÀN THÀNH 100% 5 TỐI ƯU TRỌNG TÂM)
Thực hiện tuần tự theo lệnh của Giám Đốc:

1. **Tối ưu 2: Cơ chế Khóa sổ tự động & Đồng bộ toàn hệ thống (`globalMonthSelect`):**
   - Đã khóa sổ cứng 100% Tháng 8 & Tháng 9: Hiển thị banner `🔒 KỲ THÁNG ĐÃ KHÓA SỔ QUYẾT TOÁN TÀI CHÍNH (READ-ONLY)`, vô hiệu hóa click sửa đổi công nhật, ẩn các nút chỉnh sửa/thêm nhân sự khi ở T8/T9.
   - Làm sạch toàn bộ dữ liệu mock T10 trong `DEFAULT_TIMESHEETS["10"]`: 7 thợ xưởng và 2 nhân sự văn phòng đều ở trạng thái công rỗng `""` sẵn sàng nhập sống thực tế từ ngày 1/10 đến 31/10.
   - Kết nối sự kiện `change` trên dropdown toàn cục `globalMonthSelect` $\rightarrow$ Tự động chuyển đổi đồng bộ Dashboard, Khối lượng xưởng, Chấm công, Badge menu.

2. **Tối ưu 5: Cảnh báo tự động trần định mức vật tư 40% (Material Over-Budget Alert):**
   - Tích hợp thanh đo trực quan `po-budget-meter-box` vào Form đề xuất PO của Vũ:
     * Tỷ lệ $\le 40\%$: Thanh xanh ngọc `#10B981` (An toàn - Đủ điều kiện duyệt).
     * Tỷ lệ $> 40\%$: Thanh đỏ cảnh báo `#EF4444` nhấp nháy, hiển thị rõ số tiền vượt trần để Giám Đốc chất vấn kỹ thuật trước khi ký duyệt.

3. **Tối ưu 6: Xuất Phiếu PO có Dấu Mộc Đỏ & Chữ Ký Điện Tử (In A4 & Tải Ảnh Zalo):**
   - Bổ sung nút **"📱 Tải Ảnh Đơn Hàng Gửi Zalo"** (`downloadPOAsImage`): Dùng HTML5 Canvas tự động kết xuất ảnh đơn hàng chuẩn nét khổ lớn (800x1350px) có đầy đủ con dấu mộc tròn đỏ của PG Home Luxury, chữ ký Giám Đốc và thông tin đơn hàng để Vũ gửi Zalo cho An Cường, Hafele nhận hàng ngay.
   - Nút In A4 chuẩn hóa CSS `@media print`.

4. **Tối ưu 9: Giao diện Điểm danh Siêu tốc trên di động (Mobile Quick Attendance):**
   - Tích hợp nút 1 chạm **"⚡ Đánh Dấu Tất Cả Đi Đủ (1)"**.
   - Bổ sung các chip chọn giờ tăng ca OT nhanh 1 chạm: `[+1h]`, `[+1.5h]`, `[+2h]`, `[+2.5h]`, `[+3h]` giúp Vũ không cần mở bàn phím số khi chấm trên điện thoại.
   - Tự động bắt ngày hiện tại theo lịch thực tế của máy tính (`new Date().getDate()`).

5. **Tối ưu 10: Đồng hồ Giám sát Quỹ khoán thợ 15% Real-time:**
   - Tích hợp Widget `fundMonitorWidget` ngay trên đầu Tab Chấm Công và Tab Khối Lượng Xưởng:
     * Đo Doanh số xưởng vs Quỹ khoán 15% vs Tiền công thợ thực tế.
     * Cảnh báo âm quỹ đỏ nhấp nháy: Ghi rõ quy tắc cốt lõi **"Lợi nhuận xưởng 2.2% bị hủy = 0 đ để bù chi phí thợ"**.
     * Cảnh báo xanh an toàn khi thợ trong hạn mức 15%: Giữ trọn 2.2% Lợi nhuận xưởng.

---

### 3. KẾT QUẢ TRIỂN KHAI GIAI ĐOẠN 2 (HOÀN THÀNH 100% 5 TỐI ƯU TRỌNG TÂM)
Đã hoàn thành tiếp 5 tối ưu theo lệnh của Giám Đốc:

1. **Tối ưu 13: Radar Cảnh báo Hạn thu nợ & Phân loại rủi ro (Debt Collection Radar):**
   - Tích hợp Khối Radar phân tích công nợ trên đầu Tab Dòng Tiền & Công Nợ:
     * Quét hạn thanh toán theo thời gian thực: Phát hiện 3 khoản nợ quá hạn (Chị Hiển 69.8M, Chị Phượng 6.46M, Anh Tuấn 61.8M = **138,066,647 đ**).
     * Bật cảnh báo nhấp nháy đỏ trên bảng và gắn huy hiệu `3 Quá Hạn` trên menu sidebar để nhắc nhở Hiệp bám sát thu tiền.
     * Tự động tính số ngày quá hạn (ví dụ: `🔴 Quá hạn 28 ngày!`).

2. **Tối ưu 14: Quản lý Lịch sử các Đợt thu tiền & Xuất Biên lai điện tử:**
   - Quản lý mảng dữ liệu `paymentHistory` lưu vết từng đợt nộp tiền chi tiết của khách hàng.
   - Bổ sung nút **"🧾 Biên Lai"** trên từng dòng công trình: Mở Modal Biên lai xác nhận thu tiền điện tử chính thức của PG Home Luxury.
   - Nút **"📱 Tải Ảnh Biên Lai Gửi Khách (Zalo)"** (`downloadReceiptAsImage`): Dùng Canvas kết xuất ảnh Biên lai thu tiền màu vàng kim sang trọng (900x1150px) có dấu mộc tròn đỏ của công ty để gửi Zalo cho khách hàng ngay lập tức.

3. **Tối ưu 15: Tách biệt & Tối ưu Mảng Phụ Kiện Bán Kèm & Sofa (Lãi gộp 30%):**
   - Xây dựng riêng Tab **"Phụ Kiện & Sofa (Lãi 30%)"** (`#phu-kien-sofa`) trên menu:
     * Tổng doanh thu phụ kiện 2 tháng: **38,840,000 đ** (T8: 8.84M, T9: 30.00M).
     * Tổng lợi nhuận gộp 30% bỏ túi BGĐ: **11,652,000 đ** (T8: 2.652M, T9: 9.0M). Khớp 100% số liệu Báo cáo CCSC.
     * Bảng danh mục đơn hàng phụ kiện chi tiết và nút "+ Thêm Đơn Hàng Phụ Kiện / Sofa".

4. **Tối ưu 17: Cài đặt App lên Điện thoại như Ứng dụng Di động (PWA - Progressive Web App):**
   - Khởi tạo file `manifest.json` và `sw.js` (Service Worker) hỗ trợ chạy Offline-first.
   - Tạo bộ Icon ứng dụng PG Home Luxury chuẩn kích thước `icon-192.png` và `icon-512.png`.
   - Bổ sung nút **"📱 Cài Đặt App Di Động"** ở chân thanh menu sidebar, hướng dẫn cài ra màn hình chính điện thoại (iPhone Safari & Android Chrome) chỉ với 1 chạm.

5. **Tối ưu 20: Chuẩn hóa Khổ in A4 Báo Cáo CCSC Giám Đốc chuyên nghiệp:**
   - Bổ sung nút **"🖨️ In Báo Cáo A4 Chuẩn BGĐ"** (`printCCSCReport`) trên Tab Báo Cáo CCSC T8+T9.
   - Thiết lập CSS `@page { size: A4 landscape; }` tự động căn chuẩn khổ giấy ngang A4, chèn sẵn Khung 3 chữ ký trang trọng ở chân báo cáo: *Người lập biểu (Hiệp Sale) | Quản lý xưởng (Thái/Vũ) | Giám Đốc Điều Hành (Nguyễn Viết Nghĩa) có dấu duyệt*.

---

### 4. KẾ HOẠCH CHO GIAI ĐOẠN 3 (NÂNG CAO & BỀN VỮNG)
Tiếp tục theo lộ trình:
- **Tối ưu 1:** Đồng bộ dữ liệu tập trung nhiều thiết bị (Multi-device Sync).
- **Tối ưu 3:** Sao lưu dự phòng & Khôi phục 1 chạm (One-click Backup & Restore).
- **Tối ưu 4:** Nhật ký thao tác & Chống gian lận số liệu (Audit Log History).
- **Tối ưu 7:** Quản lý Danh mục NCC & Đối soát Công nợ Vật tư Nhà xưởng.
- **Tối ưu 8:** Thư viện Ảnh tiến độ & Nghiệm thu chất lượng công trình xưởng.
- **Tối ưu 11:** Trích xuất Phiếu Lương Cá Nhân bảo mật (Private Payslip Generator).
- **Tối ưu 12:** Quản lý Tạm Ứng Lương & Tự động cấn trừ cuối tháng.
- **Tối ưu 16:** Tự động tính Thưởng / % Sản phẩm cho Sale & Thiết kế.
- **Tối ưu 18:** Bộ tìm kiếm nhanh toàn hệ thống (`Ctrl + K`).
- **Tối ưu 19:** Dashboard Biểu đồ Phân tích Đa chiều (Charts & Visual Analytics).

---

### 5. HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG
- Khởi động server nội bộ: Chạy file [`Chay_He_Thong_Quan_Tri.bat`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/Chay_He_Thong_Quan_Tri.bat)
- Truy cập trình duyệt: `http://localhost:8080/index.html` hoặc mở trực tiếp `file:///f:/PG Home - Quản trị/web_app/index.html`.


