# 20 ĐIỂM YẾU CẦN KHẮC PHỤC CỦA HỆ THỐNG WEB APP PG HOME LUXURY
## BẢN RÀ SOÁT LỖ HỔNG & TỐI ƯU HÓA ĐỂ SẴN SÀNG TRIỂN KHAI DEPLOY THỰC TẾ

> **Tài liệu Kỹ thuật & Quản trị Trọng yếu**  
> *Ban hành theo chỉ đạo của Giám Đốc Nguyễn Viết Nghĩa | Đánh giá bởi Chuyên gia Kỹ thuật Phần mềm & Trợ lý AI*  
> *Mục tiêu: Chỉ rõ 20 rào cản kỹ thuật và trải nghiệm người dùng, chuẩn bị hệ thống hoàn hảo để đưa vào sử dụng thực tế toàn công ty.*

---

```mermaid
flowchart TD
    subgraph D1["1. DỮ LIỆU & BẢO MẬT (4 Điểm Yếu)"]
        A1["1. LocalStorage đơn lẻ, chưa đồng bộ đa thiết bị"]
        A2["2. Thiếu sao lưu / khôi phục JSON 1 chạm"]
        A3["3. Lộ tỷ lệ khoán nội bộ trong file JS tĩnh"]
        A4["4. Không có nhật ký thao tác người dùng (Audit Log)"]
    end

    subgraph D2["2. TRẢI NGHIỆM THỢ & DI ĐỘNG (5 Điểm Yếu)"]
        B1["5. Bảng chấm công 31 ngày bị tràn màn hình mobile"]
        B2["6. Điểm danh 1 chạm thiếu xác thực GPS xưởng"]
        B3["7. Form nhập liệu quá phức tạp với thợ mộc"]
        B4["8. Thiếu Dark Mode cho môi trường bụi sáng xưởng"]
        B5["9. Ngoại tuyến vỡ icon FontAwesome khi mất mạng"]
    end

    subgraph D3["3. QUY TRÌNH SẢN XUẤT & VẬT TƯ (5 Điểm Yếu)"]
        C1["10. Chưa có nút xuất ảnh / in phiếu PO Dấu Đỏ"]
        C2["11. Chưa hỗ trợ upload trực tiếp ảnh hóa đơn / UNC"]
        C3["12. Thiếu thanh tìm kiếm toàn cầu (Global Search)"]
        C4["13. Chưa có bảng theo dõi Quỹ Thưởng Tết tích lũy"]
        C5["14. Chưa có nút Khóa Sổ bảo vệ T8, T9 trực quan"]
    end

    subgraph D4["4. QUẢN TRỊ ĐIỀU HÀNH & HIỆU SUẤT (6 Điểm Yếu)"]
        D1["15. Thiếu xuất Phiếu Lương Cá Nhân bí mật từng thợ"]
        D2["16. Chưa có Web Push Notification khi có PO mới"]
        D3["17. Bộ lọc tháng bị reset khi chuyển tab"]
        D4["18. Chưa có ký tay điện tử trên màn hình cảm ứng"]
        D5["19. Chạm xem biểu đồ trên mobile bị trượt trang"]
        D6["20. File HTML/JS lớn gây chậm khi dùng 4G xưởng"]
    end

    D1 --> D2
    D2 --> D3
    D3 --> D4
```

---

## CHI TIẾT 20 ĐIỂM YẾU VÀ GIẢI PHÁP KHẮC PHỤC TRIỆT ĐỂ

### 1. Dữ Liệu Phụ Thuộc Hoàn Toàn Vào LocalStorage Trình Duyệt
* **Điểm yếu:** Dữ liệu app hiện lưu trên `localStorage` của trình duyệt máy tính Giám Đốc. Nếu Giám Đốc xóa lịch sử duyệt web hoặc mở trên điện thoại, dữ liệu không tự đồng bộ qua lại.
* **Nguy cơ:** Mất dữ liệu chấm công và PO nếu trình duyệt bị lỗi hoặc cài lại Win.
* **Giải pháp khắc phục:** Xây dựng cơ chế xuất/nhập tệp cơ sở dữ liệu `PG_HOME_DATABASE.json` và kết nối với Endpoint API của máy chủ nội bộ.

### 2. Thiếu Tính Năng Sao Lưu (Backup) & Khôi Phục (Restore) 1 Chạm
* **Điểm yếu:** Người dùng chưa thể bấm 1 nút để tải toàn bộ dữ liệu app về máy tính lưu trữ an toàn trước khi chỉnh sửa lớn.
* **Nguy cơ:** Khi nhân sự nhập sai hoặc thao tác nhầm, không có nút "Quay lại bản sao lưu hôm qua".
* **Giải pháp khắc phục:** Bổ sung ngay nút **"Sao Lưu Dữ Liệu (.json)"** và **"Khôi Phục Dữ Liệu"** trên thanh Header.

### 3. Rủi Ro Rò Rỉ Tỷ Lệ Khoán Nội Bộ Trong Mã Nguồn Tĩnh (Rule 2)
* **Điểm yếu:** Mặc dù giao diện ẩn cột khoán 55%, vật tư 40%, quỹ thợ 15% đối với role nhân viên, nhưng nếu nhân viên mở Console (F12) vẫn thấy mảng dữ liệu mặc định.
* **Nguy cơ:** Thợ xưởng và nhân viên văn phòng phát hiện tỷ lệ khoán, gây so bì và bất mãn.
* **Giải pháp khắc phục:** Tách dữ liệu nhạy cảm ra khỏi file tĩnh của client, mã hóa Base64/AES các trường nhạy cảm và chỉ giải mã khi role đăng nhập là `ADMIN`.

### 4. Thiếu Nhật Ký Thao Tác Người Dùng (Audit Log History)
* **Điểm yếu:** Không ghi lại lịch sử ai vừa sửa ngày công, ai vừa tạo đơn vật tư, ai đổi trạng thái PO vào thời gian nào.
* **Nguy cơ:** Khi xảy ra tranh chấp công nhật (như vụ Thoan hay Hiệp), không rõ ai đã chỉnh sửa trên máy tính.
* **Giải pháp khắc phục:** Tạo bảng nhật ký hoạt động (Activity History Log) tự động ghi lại: `[Thời gian] - [Tài khoản] - [Thao tác thực hiện]`.

### 5. Bảng Chấm Công 31 Ngày Bị Tràn Màn Hình Điện Thoại Di Động
* **Điểm yếu:** Bảng chấm công ngang 31 cột hiển thị rất đẹp trên màn hình máy tính 24 inch của Giám Đốc nhưng trên màn hình smartphone của thợ và Vũ thì bị co ép hoặc phải cuộn ngang mỏi tay.
* **Nguy cơ:** Thợ khó theo dõi ngày công của mình trên điện thoại cá nhân.
* **Giải pháp khắc phục:** Bổ sung chế độ xem **"Thẻ Nhân Viên (Mobile Card View)"** tự động co giãn theo tuần hoặc hiển thị tổng công + OT tóm tắt trên màn hình nhỏ.

### 6. Nút Điểm Danh Nhanh (Quick Attendance) Chưa Có Rào Chắn Vị Trí Xưởng
* **Điểm yếu:** Người dùng chỉ cần bấm nút là điểm danh xong mà không cần xác nhận đang có mặt ở xưởng hay ở nhà.
* **Nguy cơ:** Nhân sự có thể nhờ người khác đăng nhập bấm điểm danh hộ từ xa.
* **Giải pháp khắc phục:** Tích hợp kiểm tra IP Wifi nội bộ xưởng hoặc định vị GPS bán kính $\le 100\text{m}$ quanh xưởng tại Số 01 Trương Quốc Dụng.

### 7. Form Nhập Liệu Hợp Đồng & PO Còn Quá Nhiều Trường Rườm Rà
* **Điểm yếu:** Giao diện tạo PO hoặc công trình có quá nhiều ô nhập kỹ thuật phức tạp đối với thợ sản xuất.
* **Nguy cơ:** Thợ lười nhập hoặc nhập sai định dạng số tiền, bỏ trống trường bắt buộc.
* **Giải pháp khắc phục:** Rút gọn form về chế độ **"Nhập Liệu Nhanh 3 Bước"** cho xưởng: Chọn NCC $\rightarrow$ Điền số lượng tấm ván $\rightarrow$ Bấm gửi duyệt.

### 8. Thiếu Chế Độ Giao Diện Tối (Dark Mode) Cho Môi Trường Xưởng Bụi Sáng
* **Điểm yếu:** Giao diện tông màu trắng xám sáng chói mắt khi thợ nhìn vào điện thoại dưới ánh đèn led công nghiệp hoặc ban đêm.
* **Giải pháp khắc phục:** Thêm nút gạt **Chế Độ Ban Đêm (Dark Mode)** sang trọng với tông màu nền đen than xám `#121824` và chữ vàng ánh kim.

### 9. Service Worker Chưa Lưu Bộ Nhớ Đệm Đầy Đủ FontAwesome Ngoại Tuyến
* **Điểm yếu:** Khi xưởng bị rớt mạng Internet, một số biểu tượng icon FontAwesome bị biến thành ô vuông rỗng.
* **Giải pháp khắc phục:** Nhúng trực tiếp SVG icon hoặc cache toàn bộ gói font trong `sw.js` để app hiển thị sắc nét 100% khi không có mạng.

### 10. Chưa Có Nút Xuất Ảnh / In Phiếu PO Kèm Dấu Đỏ Điện Tử
* **Điểm yếu:** Khi Giám Đốc duyệt xong PO, Vũ chỉ thấy trên màn hình web mà chưa có nút "Xuất ảnh Phiếu PO đóng dấu đỏ" để gửi thẳng vào Zalo nhà cung cấp.
* **Giải pháp khắc phục:** Thêm nút **"In / Tải Ảnh Phiếu PO Dấu Đỏ"** tự động tạo ảnh PNG/PDF sắc nét có mộc đỏ của Giám Đốc Nguyễn Viết Nghĩa.

### 11. Chưa Hỗ Trợ Tải Trực Tiếp Ảnh Chụp Hóa Đơn / UNC Vào Hệ Thống
* **Điểm yếu:** Hóa đơn chủ yếu gửi trên nhóm Zalo, trên web app chưa có nút đính kèm ảnh chụp hóa đơn vào từng đơn đặt hàng.
* **Giải pháp khắc phục:** Thêm trường `<input type="file" capture="camera">` cho phép thợ chụp ảnh hóa đơn từ camera điện thoại tải thẳng lên app.

### 12. Thiếu Thanh Tìm Kiếm Toàn Cầu (Global Search Bar)
* **Điểm yếu:** Muốn tìm một công trình, hóa đơn hoặc nhân sự, người dùng phải bấm vào từng tab rồi cuộn chuột tìm kiếm.
* **Giải pháp khắc phục:** Thêm phím tắt **`Ctrl + K`** hoặc ô tìm kiếm nhanh trên thanh Menu: Gõ "Chị Hoa" ra ngay hợp đồng, PO vật tư và công nợ liên quan.

### 13. Chưa Có Bảng Tổng Hợp Quỹ Thưởng Tết & Trách Nhiệm Tích Lũy
* **Điểm yếu:** Khoản 20k/công trách nhiệm của Hòa, Hào và thưởng >500M của Thái, Vũ, Hiệp bị treo cuối năm nhưng chưa có bảng riêng hiển thị số tiền tích lũy tăng dần.
* **Giải pháp khắc phục:** Tạo tab hoặc widget **"Sổ Tích Lũy Thưởng Tết Bỏ Túi"** để anh em thợ nhìn thấy tiền thưởng Tết của mình tích lũy mỗi ngày, tạo động lực chiến đấu hết mình.

### 14. Chưa Có Nút Khóa Sổ Tháng Trực Quan (Month Lock Toggle)
* **Điểm yếu:** Tháng 8 và Tháng 9 đã quyết toán nhưng chưa có biểu tượng "Khóa Sổ Vàng" hiển thị rõ ở đầu bảng để báo hiệu đây là dữ liệu lịch sử bất biến.
* **Giải pháp khắc phục:** Thêm badge **"ĐÃ KHÓA SỔ BẢO MẬT"** kèm ổ khóa vàng trên các kỳ tháng đã quyết toán.

### 15. Thiếu Tính Năng Xuất Phiếu Lương Riêng (Salary Slip) Từng Nhân Sự
* **Điểm yếu:** Cuối tháng Kế toán muốn gửi phiếu lương bí mật cho từng người ký nhận thì phải copy cắt ảnh thủ công, dễ lộ thông tin người khác.
* **Giải pháp khắc phục:** Thêm nút **"Xuất Phiếu Lương Cá Nhân"** cạnh tên từng thợ, xuất ra phiếu lương đẹp mắt định dạng ảnh/PDF để gửi Zalo riêng.

### 16. Chưa Có Web Push Notification Khi Có Đơn Đặt Hàng Mới
* **Điểm yếu:** Khi Vũ tạo PO mới, Giám Đốc không có chuông báo hiệu trên trình duyệt.
* **Giải pháp khắc phục:** Tích hợp Web Notification API để phát chuông và hiện thông báo góc màn hình: *"Phiếu PO mới cần duyệt: Vũ vừa lập đơn ván Lam Giang 11.9M"*.

### 17. Bộ Lọc Tháng Bị Reset Khi Chuyển Tab (Filter Persistence)
* **Điểm yếu:** Người dùng đang chọn xem Tháng 10 ở tab Xưởng, khi bấm sang tab Chấm công lại bị nhảy về Tháng 9 hoặc mặc định.
* **Giải pháp khắc phục:** Lưu bộ lọc tháng đang chọn vào `sessionStorage` để đồng bộ trạng thái tháng trên toàn bộ các tab.

### 18. Chưa Có Tính Năng Ký Tay Điện Tử Trực Tiếp Trên Màn Hình Cảm Ứng
* **Điểm yếu:** Giám Đốc duyệt PO bằng nút bấm nhưng chưa có khung vẽ chữ ký tay bằng ngón tay/bút cảm ứng trên iPad/điện thoại.
* **Giải pháp khắc phục:** Tích hợp Canvas Signature Pad cho phép Giám Đốc ký tay chữ ký tươi trực tiếp lên phiếu PO.

### 19. Thao Tác Chạm Xem Biểu Đồ Trên Điện Thoại Dễ Bị Trượt Trang
* **Điểm yếu:** Khi lướt ngón tay qua biểu đồ doanh thu trên mobile, trang web bị giật hoặc biểu đồ hiển thị tooltip che mất số liệu.
* **Giải pháp khắc phục:** Tối ưu cấu hình Chart.js với `interaction: { mode: 'index', intersect: false }` và khóa kéo trang khi đang tương tác biểu đồ.

### 20. Dung Lượng Mã Nguồn Ban Đầu Cần Tối Ưu Hóa (Asset Minification)
* **Điểm yếu:** Các file JavaScript và CSS chưa được nén gọn, khi mạng 3G/4G yếu ở xưởng có thể mất 2-3 giây tải ban đầu.
* **Giải pháp khắc phục:** Bật nén Gzip trên máy chủ web server local và dọn dẹp các đoạn mã CSS thừa, bảo đảm thời gian tải app $\le 0.8$ giây.
