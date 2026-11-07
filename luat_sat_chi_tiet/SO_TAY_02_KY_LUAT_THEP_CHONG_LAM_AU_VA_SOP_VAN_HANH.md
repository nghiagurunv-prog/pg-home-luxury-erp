# SỔ TAY QUẢN TRỊ 02: KỶ LUẬT THÉP, CHỐNG LÀM ẨU, TỰ ĐỘNG HÓA STEALTH ZALO & MASTER SOP (MỤC 9 - 16)
> [!IMPORTANT]
> **TÀI LIỆU QUY CHUẨN NỘI BỘ TỐI CAO - BỘ QUY TẮC CHI TIẾT DỰ ÁN PG HOME LUXURY (TRÍCH XUẤT 100% NGUYÊN BẢN GỐC).**
> Bao gồm chi tiết: 17 bài học cốt tử chống lười - chống làm láo, điều lệ thép cưỡng chế chat & pre-response hard-lock, pháp lý PG Home, quy tắc clickable link sống, SOP trợ lý AI, Stealth Engine V2.0, 30 cải tiến SOP, Master SOP 4.0.

---

## 9. QUY TẮC CỨNG CHỐNG LƯỜI - CHỐNG LÀM LÁO - CƠ CHẾ SUY NGHĨ ĐA CHIỀU & TỰ ĐỘNG HÓA CHẠY NGẦM KHÔNG ẢNH HƯỞNG HỆ THỐNG
> [!IMPORTANT]
> **CHỈ ĐẠO QUẢN TRỊ ĐẶC BIỆT CỦA GIÁM ĐỐC NGUYỄN VIẾT NGHĨA - BẮT BUỘC TUÂN THỦ 100%:**

### 9.1. NGUYÊN TẮC TỰ ĐỘNG HÓA CHẠY NGẦM VÔ HÌNH (STEALTH BACKGROUND - ZERO DISRUPTION):
1. **Tuyệt đối cấm can thiệp giao diện vật lý:**
   - Cấm sử dụng `mouse_event`, `SetCursorPos`, `pyautogui` hoặc bất kỳ lệnh nào làm di chuyển con trỏ chuột của Giám Đốc.
   - Cấm sử dụng `SendKeys` toàn cục, cấm cướp tiêu điểm cửa sổ (`SetForegroundWindow`, `BringWindowToTop`) làm gián đoạn khi Giám Đốc đang soạn thảo Word, Excel, Zalo, CAD hoặc trình duyệt.
   - Tuyệt đối không để màn hình giật, chớp nháy hoặc nhảy cửa sổ ngoài ý muốn.
2. **Phương thức kỹ thuật chuẩn hóa bắt buộc:**
   - **Win32 Background Session:** Khởi tạo qua Windows Station & Desktop (`OpenWindowStationW("WinSta0")` và `SetThreadDesktop(desk)`) để truy cập ngầm cây tiến trình mà không cần kích hoạt cửa sổ lên màn hình trước.
   - **UIAutomation Ngầm:** Đọc DOM và cuộn dữ liệu hoàn toàn qua mẫu điều khiển `ScrollItemPattern.ScrollIntoView()` hoặc các selector ngầm.
   - **Windows Messaging Đích:** Nếu bắt buộc gửi thông điệp, chỉ sử dụng `PostMessageW` gửi thẳng vào HWND nội bộ của tiến trình đích, không phát sóng toàn hệ thống.

---

### 9.2. CƠ CHẾ SUY NGHĨ ĐA CHIỀU (MULTI-DIMENSIONAL THINKING FRAMEWORK):
Trước khi thực hiện bất kỳ lệnh nào hoặc đưa ra kết luận, Trợ lý AI bắt buộc phải tư duy qua **5 Chiều Quản Trị**:
1. **Chiều 1 - Bản chất Nguồn dữ liệu Gốc (Ground Truth Analysis):**
   - Phải truy tìm đến tận gốc rễ dữ liệu nguyên bản: Tin nhắn Zalo từng giây từng phút, hóa đơn VAT, phiếu xuất kho nhà cung cấp, sao kê ngân hàng.
   - Không được tin tưởng một chiều vào báo cáo do cấp dưới tự lập (như bảng tính Hiệp tự vẽ).
2. **Chiều 2 - Phân tích Động cơ & Ý đồ Tư lợi (Conflict of Interest & Motive Check):**
   - Đặt câu hỏi: "Nhân sự gửi con số này nhằm mục đích gì? Có động cơ khống số liệu để vơ vét tiền vượt mức, lấp liếm giờ làm hay che giấu thất thoát vật tư không?"
3. **Chiều 3 - Tối ưu Hóa Giải pháp Thực thi (Architecture & Failure-Proof):**
   - Lập kế hoạch trước khi chạy script: Thuật toán có tải đủ 100% dữ liệu không? Nếu dữ liệu phân trang (lazy load) bị ngắt quãng thì cơ chế tự động cuộn tiếp thế nào? Có phương án dự phòng nào khác nếu cách 1 bị nghẽn?
4. **Chiều 4 - Đối soát Chéo Độc lập 3 Chiều (Triangulation & Cross-Validation):**
   - Tuyệt đối không kết luận từ 1 manh mối duy nhất.
   - Bắt buộc đối chiếu chéo ít nhất 3 nguồn độc lập: `[Dữ liệu thô Zalo]` $\longleftrightarrow$ `[Ảnh bảng lương Hiệp lập]` $\longleftrightarrow$ `[Quy chế khoán & Hợp đồng thực tế]`.
5. **Chiều 5 - Quyết định Quản trị Sống còn (Executive Impact & Cash Flow Protection):**
   - Mọi kết luận đều phải quy về giá trị tiền mặt và sự sống còn của doanh nghiệp: Giữ vững dòng tiền, bảo vệ lợi nhuận của Giám Đốc, dẹp bỏ các khoản chi ảo.

---

### 9.3. QUY TẮC CỨNG CHỐNG LƯỜI - CHỐNG LÀM QUA LOA - CHỐNG BỊA ĐẶT SỐ LIỆU (17 BÀI HỌC CỐT TỬ):
1. **Bài học 1 (Vụ án Thoan 27 công):** Từng nhân sự là cá thể độc lập. Cấm tuyệt đối lấy số người này áp cho người khác, cấm lấy tháng cũ đắp sang tháng mới. Thoan T10 chỉ làm đúng 7 công (08/10 - 15/10) + 7h OT = 3.740.625 đ.
2. **Bài học 2 (Vụ án 560k của Hòa & 600k của Hào):** Bảng lương xưởng hàng tháng tuyệt đối không cộng 560k hay 600k phụ cấp vào thực lĩnh. Hòa chỉ nhận 530k/ngày + OT (Phụ cấp = 0 đ); Hào chỉ nhận 450k/ngày + OT (Phụ cấp = 0 đ). Mọi cơ chế trách nhiệm dồn cuối năm quyết toán cùng thưởng Tết.
3. **Bài học 3 (Bóc tách gỗ thịt & phụ kiện):** Doanh số xưởng gỗ CN bắt buộc phải trừ gỗ thịt tự nhiên và phụ kiện/thiết bị để tránh làm vống quỹ thợ 15% và định mức vật tư 40%.
4. **Bài học 4 (Tách bạch khoán và thực tế):** Không đưa con số khoán 40% vào danh mục PO đặt hàng vật tư thực tế. Đặt bao nhiêu ghi đúng bấy nhiêu.
5. **Bài học 5 (Lợi nhuận xưởng Col BG = 0 đ):** Xưởng âm quỹ khoán thợ so với định mức 15% thì tuyệt đối không tính lợi nhuận xưởng 2.2%.
6. **Bài học 6 (Bác bỏ 29 công văn phòng của Hiệp):** Chủ Nhật nghỉ. Khối văn phòng chốt đúng định mức khoán 26.0 công.
7. **Bài học 7 (Cấm lười cuộn Zalo):** Phải cuộn DOM nạp đủ 100% tin nhắn từng ngày trong tháng, không được nhìn lướt rồi báo cáo láo 'không có tin nhắn 31/10'.
8. **Bài học 8 (Tàng hình 100%):** Chạy ngầm qua WinSta0 ở mức IDLE_PRIORITY_CLASS, không chạm chuột, không cướp focus bàn phím, không nháy màn hình.
9. **Bài học 9 (Mất ruột tin nhắn do quét nông):** Zalo PC bọc nhiều tầng thẻ DOM (message-frame -> 	ext-mCntr -> mtc). Quét ở maxDepth=6 bị mất nội dung. Bắt buộc quét sâu tới maxDepth=12 để bóc tách 100% text, ảnh, tệp đính kèm và timestamp.
10. **Bài học 10 (Bắt nhầm Handle cửa sổ Toast thông báo 67210 thay vì Main Chat 67098):** Zalo PC duy trì 2 cửa sổ Chrome_WidgetWin_1. Cấm nhận diện cửa sổ chỉ bằng class và title. Bắt buộc kết hợp PID Zalo.exe và kiểm tra bit cờ Win32 Style WS_CAPTION (0x00C00000) để chọn chuẩn xác 100% cửa sổ chat chính.
11. **Bài học 11 (Chromium đình chỉ DOM khi đóng khay SW_HIDE):** Cửa sổ Zalo ẩn khay không nạp DOM. Bắt buộc điều phối tọa độ ảo Off-Screen (-30000, -30000) với kích thước viewport mở rộng 1280x1024 kèm cờ SW_SHOWNOACTIVATE để kích hoạt toàn bộ DOM ngầm mà mắt thường không thấy 1 pixel nào, đọc xong hoàn trả SW_HIDE.
12. **Bài học 12 (Click trượt do Viewport ngầm quá hẹp - Lỗi y=783 > 750):** Viewport ngầm mặc định 750px làm các nhóm ở dưới (như Bảng chấm công tại y=783) tràn ra ngoài khung nhìn khiến click vô hiệu. Bắt buộc mở rộng viewport lên 1280x1024 và gọi ScrollItemPattern.ScrollIntoView() trước khi click.
13. **Bài học 13 (Lệch tên nhóm do ký tự non-breaking space \xa0):** Zalo dùng ký tự khoảng trắng \xa0 trong tiêu đề. So sánh chuỗi thường sẽ bị rớt. Bắt buộc chuẩn hóa 2 chiều .replace('\xa0', ' ').strip().lower() cho cả từ khóa tìm kiếm và chuỗi DOM.
14. **Bài học 14 (Sập EnumWindows do Callback Ctypes bị Garbage Collection):** Không truyền callback nặc danh vào Win32 API. Bắt buộc lưu tham chiếu biến cb_top, cb_child để giữ bộ nhớ và có vòng lặp retry 3 lần.
15. **Bài học 15 (Click ngầm Chromium không ăn do thiếu WM_MOUSEMOVE):** Chromium WebInputEvent yêu cầu hover trước khi click. Bắt buộc gửi chuỗi WM_MOUSEMOVE -> WM_LBUTTONDOWN -> WM_LBUTTONUP tới tọa độ Client chuẩn hóa bằng ScreenToClient.
16. **Bài học 16 (Sự cố kẹt tọa độ cửa sổ Zalo khi chạy ngầm):** Khi đưa Zalo ra tọa độ ảo Off-Screen, trước khi gọi SW_HIDE bắt buộc phải trả lại tọa độ màn hình chuẩn (200, 100, 1200, 800). Cấm tuyệt đối để tọa độ âm hay (0, 0, 0, 0) làm Giám Đốc bấm Zalo không hiện lên được. Nếu Zalo đang mở trên màn hình thì cấm tuyệt đối di chuyển hoặc ẩn cửa sổ.
17. **Bài học 17 (Cấm đối soát bằng mồm hay tin nhắn tranh luận sau chốt công):** Tuyệt đối không được chỉ dựa vào câu chat kết luận của Hiệp hay thợ ('ok hết rồi'). Bắt buộc đối soát độc lập bằng toàn bộ nhật ký tin nhắn check-in báo giờ làm hàng ngày của từng thợ từng ngày trong tháng.
18. **Bài học 18 (Bảo toàn nguyên tử WINDOWPLACEMENT & Focus Guard nhường quyền khi Giám Đốc đang chat):**
    - Windows quản lý trạng thái mở lại của cửa sổ qua cấu trúc `WINDOWPLACEMENT.rcNormalPosition`. Cấm chỉ dùng `SetWindowPos` rồi `SW_HIDE` vì Windows sẽ lưu tọa độ ảo off-screen `(-30000, -30000)` vào `rcNormalPosition` khiến Giám Đốc click Zalo không thể hiện lên. Bắt buộc dùng Win32 `SetWindowPlacement` khôi phục nguyên tử `rcNormalPosition` về vùng màn hình an toàn `(200, 100, 1400, 900)` và đặt đúng `showCmd` gốc (2: Minimized, 0: Hidden).
    - Tích hợp Focus Guard: Khi Giám Đốc đang thao tác trực tiếp trên Zalo (`GetForegroundWindow() == zalo_hwnd`), script tuyệt đối cấm gửi click chuyển hội thoại làm nhảy màn hình chat, tự động trả về `YIELDED_USER_ACTIVE` để nhường quyền 100% cho Giám Đốc.

---

## 10. ĐIỀU LỆ THÉP CƯỠNG CHẾ KHÓA CỨNG CHO MỌI ĐOẠN CHAT & PHIÊN LÀM VIỆC VỀ SAU (TUÂN THỦ 1000% LUẬT SẮT)
> [!IMPORTANT]
> **CHỈ ĐẠO CỐT TỬ CỦA GIÁM ĐỐC NGUYỄN VIẾT NGHĨA - KHÓA VĨNH VIỄN KHÔNG ĐƯỢC PHÉP VI PHẠM:**

### 10.1. NGUYÊN TẮC "TRƯỚC KHI GÕ CHAT PHẢI CHẠY CODE ĐỌC FILE THẬT" (PRE-RESPONSE HARD-LOCK):
1. **Cấm tuyệt đối phát ngôn số liệu bằng "trí nhớ tạm" hay "suy diễn":**
   - Trước khi đưa ra bất kỳ con số nào về: **Số ngày công, Giờ OT, Lương thực lĩnh, Phụ cấp, Tạm ứng, Doanh số xưởng, Vật tư, Công nợ nhà cung cấp, Chiết khấu**, Trợ lý AI BẮT BUỘC PHẢI CHẠY CODE PYTHON đọc trực tiếp từng cell/dòng từ file Excel ngoài ổ cứng (`.xlsx`) hoặc cơ sở dữ liệu thật trong chính lượt làm việc đó.
   - Nếu chưa chạy script đọc file trong phiên hiện tại $\implies$ **TUYỆT ĐỐI CẤM PHÁT NGÔN CON SỐ ĐÓ**.
2. **Mọi báo cáo đều phải có Dấu vết Vật lý (Physical Footprint):**
   - Phải dẫn link file thật: `[Tên file](file:///đường_dẫn_tuyệt_đối)`.
   - Phải trích xuất rõ vị trí: Sheet nào, Hàng nào (Row), Cột nào (Col) hoặc Mã đơn thật trên hóa đơn/Zalo.

### 10.2. NGUYÊN TẮC BẢO VỆ KÉT SẮT & DÒNG TIỀN MẶT CỦA GIÁM ĐỐC:
1. **Tuyệt đối cấm tự tiện nhét phụ cấp vào bảng lương chi tiền mặt hàng tháng:**
   - Hà Viết Hòa: Đúng 530.000 đ/công + Giờ OT (Phụ cấp hàng tháng = **0 đ**).
   - Lương Thể Hào: Đúng 450.000 đ/công + Giờ OT (Phụ cấp hàng tháng = **0 đ**).
   - Khoản trách nhiệm 20k/công và các khoản thưởng vượt mức doanh số (Thái 0.5%, Vũ 0.3%, Hiệp 0.5%) **BẮT BUỘC PHẢI TREO LẠI ĐẾN CUỐI NĂM QUYẾT TOÁN CÙNG THƯỞNG TẾT**. Cấm xuất quỹ chi tiền mặt hàng tháng làm thất thoát dòng tiền!
2. **Tách bạch 100% giữa Xưởng gỗ công nghiệp và Gỗ thịt / Phụ kiện:**
   - $\text{Doanh số Xưởng Gỗ CN} = \text{Tổng HĐ} - \text{Gỗ thịt} - \text{Phụ kiện / Thiết bị thương mại}$.
   - Cấm gom gỗ thịt và phụ kiện vào để thổi phồng doanh số xưởng làm tăng ảo Quỹ thợ 15% và Định mức vật tư 40%.
3. **Lợi nhuận xưởng Col BG = 0 đ khi xưởng âm quỹ khoán thợ:**
   - Xưởng chi lương thợ vượt định mức 15% thì Lợi nhuận xưởng Col BG = **0 đ**. Tuyệt đối cấm nhân 2.2% doanh số.

### 10.3. PHONG CÁCH LÀM VIỆC & GIAO TIẾP VỚI GIÁM ĐỐC:
1. **Xưng hô chuẩn mực:** Luôn xưng **"em"** và gọi người dùng là **"Giám Đốc"** hoặc **"Anh"**. Tuyệt đối không xưng "bố - con".
2. **Cấm xả văn bản triết lý 5 chiều ra khung chat:** Khung tư duy 5 chiều là tiến trình chạy ngầm trong não AI. Phản hồi cho Giám Đốc phải ngắn gọn, đanh thép, số liệu bảng biểu rõ ràng, đi thẳng vào bản chất công việc.
3. **Cấm bảo thủ, cấm đôi co:** Khi Giám Đốc chỉ ra sai phạm, phải lập tức nhận khuyết điểm, chạy code kiểm tra đối soát chân lý vật lý ngay và sửa tận gốc rễ trong file và mã nguồn.

---

## 11. THÔNG TIN PHÁP LÝ CHÍNH THỨC HỘ KINH DOANH NỘI THẤT PHÚ GIA (PG HOME LUXURY)
> [!IMPORTANT]
> **DỮ LIỆU ĐỐI SOÁT GỐC TỪ GIẤY CHỨNG NHẬN ĐĂNG KÝ HỘ KINH DOANH SỐ 042203002931 CẤP NGÀY 22/10/2026:**
- **Cơ quan cấp:** UBND Phường Thành Sen – Phòng Kinh tế, Hạ tầng và Đô thị.
- **Mã số hộ kinh doanh / MST:** **042203002931** (Đăng ký lần đầu: 22/10/2026).
- **Tên hộ kinh doanh:** **HỘ KINH DOANH NỘI THẤT PHÚ GIA** (Thương hiệu: PG HOME LUXURY).
- **Trụ sở chính:** **Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh, Việt Nam**.
- **Điện thoại:** **0911 006 880** | **Email:** `hoangcongvu@gmail.com`.
- **Vốn kinh doanh:** **700.000.000 đồng** (Bảy trăm triệu đồng).
- **Đại diện / Chủ hộ:** **HOÀNG CÔNG VŨ** (Sinh ngày: 27/04/2003, Dân tộc: Kinh, Quốc tịch: Việt Nam).
- **Số định danh cá nhân / CCCD:** **042203002931**.
- **Nơi thường trú:** Thôn Tân Phố, Xã Hương Khê, Tỉnh Hà Tĩnh, Việt Nam.
- **Nơi ở hiện tại:** Số 04, Ngách 02, Ngõ 304, Đường Vũ Quang, Phường Thành Sen, Tỉnh Hà Tĩnh, Việt Nam.
- **Ngành nghề chính:** Mã 3101 - Sản xuất giường, tủ, bàn, ghế bằng gỗ; Mã 4330 - Hoàn thiện công trình xây dựng.
- **Quy định HĐLĐ đóng BHXH tối thiểu:** Mức lương chính ghi trên HĐLĐ đóng BHXH đúng **3.860.000 đ/tháng** (Vùng III). Phụ cấp cố định = 0 đ.
- **Phương thức đóng BHXH:** Đăng ký phương thức đóng định kỳ **03 tháng một lần** (căn cứ cơ chế trả lương theo sản phẩm, theo khoán khối lượng công trình nội thất) để tối ưu và giữ dòng tiền lưu động cho xưởng.
- **Tệp ảnh lưu trữ gốc:** `f:\PG Home - Quản trị\data\GIAY_PHEP_KINH_DOANH_HO_KINH_DOANH_NOI_THAT_PHU_GIA.jpg`.
- **Thư mục lưu trữ bộ hồ sơ chuẩn:** [Hồ sơ pháp lý & BHXH HKD Phú Gia 2026](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/H%E1%BB%93%20s%C6%A1%20ph%C3%A1p%20l%C3%BD%20&%20BHXH%20HKD%20Ph%C3%BA%20Gia%202026)
  * [01_GCN_DANG_KY_HO_KINH_DOANH_042203002931.jpg](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/H%E1%BB%93%20s%C6%A1%20ph%C3%A1p%20l%C3%BD%20&%20BHXH%20HKD%20Ph%C3%BA%20Gia%202026/01_GCN_DANG_KY_HO_KINH_DOANH_042203002931.jpg)
  * [02_HOP_DONG_LAO_DONG_XUONG_DONG_BHXH_TOI_THIEU.docx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/H%E1%BB%93%20s%C6%A1%20ph%C3%A1p%20l%C3%BD%20&%20BHXH%20HKD%20Ph%C3%BA%20Gia%202026/02_HOP_DONG_LAO_DONG_XUONG_DONG_BHXH_TOI_THIEU.docx)
  * [03_MAU_TK3_TS_TO_KHAI_DANG_KY_BHXH_DONG_3_THANG.docx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/H%E1%BB%93%20s%C6%A1%20ph%C3%A1p%20l%C3%BD%20&%20BHXH%20HKD%20Ph%C3%BA%20Gia%202026/03_MAU_TK3_TS_TO_KHAI_DANG_KY_BHXH_DONG_3_THANG.docx)
  * [04_MAU_D02_LT_DANH_SACH_THAM_GIA_BHXH_DONG_3_THANG.docx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/H%E1%BB%93%20s%C6%A1%20ph%C3%A1p%20l%C3%BD%20&%20BHXH%20HKD%20Ph%C3%BA%20Gia%202026/04_MAU_D02_LT_DANH_SACH_THAM_GIA_BHXH_DONG_3_THANG.docx)

---

## 12. QUY TẮC CỐT TỬ: BẮT BUỘC DÙNG LINK SỐNG 1 CHẠM (CLICKABLE LIVE LINKS) MỞ TRỰC TIẾP THƯ MỤC CHA
> [!IMPORTANT]
> **CHỈ ĐẠO CỐT TỬ CỦA GIÁM ĐỐC NGUYỄN VIẾT NGHĨA:**
1. **Tuyệt đối cấm hiển thị đường dẫn dạng raw text hoặc code block chip:**
   - Cấm viết các đường dẫn trơ như `c:\Users\Admin\...` hay `f:\PG Home\...` trong khung code block làm giao diện chat render thành khối text chết không bấm được.
2. **Cơ chế Link Sống 1 Chạm chuẩn Markdown:**
   - Mọi tệp tin, tài liệu khi thông báo cho Giám Đốc **BẮT BUỘC PHẢI KÈM LINK SỐNG DẪN TRỰC TIẾP ĐẾN THƯ MỤC CHỨA FILE (Folder Link)** và **LINK MỞ TRỰC TIẾP FILE** theo chuẩn Markdown `[📁 Tên hiển thị](file:///đường_dẫn_chuẩn)`.
   - Cú pháp chuẩn: tiền tố `file:///`, chuyển toàn bộ gạch chéo ngược `\` thành gạch chéo xuôi `/`, và mã hóa ký tự đặc biệt/dấu cách (`%20`).
   - Mục đích sống còn: Giúp Giám Đốc chỉ cần click 1 chạm là Windows Explorer tự động mở bung ngay thư mục chứa tài liệu trên màn hình, không phải tốn thời gian sao chép hay tìm kiếm.

---

## 13. HỆ THỐNG QUY TRÌNH VẬN HÀNH CHUẨN (SOP) & BẢN TỐI ƯU HÓA 10 LẦN CỦA TRỢ LÝ AI
> [!IMPORTANT]
> **QUY CHUẨN VẬN HÀNH TOÀN DIỆN SAU 10 LẦN TỐI ƯU ĐƯỢC PHÊ DUYỆT BỞI GIÁM ĐỐC NGUYỄN VIẾT NGHĨA:**
- **Văn bản SOP gốc chuẩn:** [QUY_TRINH_VAN_HANH_CHUAN_SOP_QUAN_TRI_PG_HOME_LUXURY_2026.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/QUY_TRINH_VAN_HANH_CHUAN_SOP_QUAN_TRI_PG_HOME_LUXURY_2026.md)
- **Bản Nghiên Cứu & Tối Ưu Hóa 10 Lần:** [NGHIEN_CUU_VA_TOI_UU_SOP_10_LAN_PG_HOME_LUXURY.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/NGHIEN_CUU_VA_TOI_UU_SOP_10_LAN_PG_HOME_LUXURY.md)
- **Bản Khắc Phục 10 Điểm Kẽ Hở Thực Chiến:** [10_DIEM_CAN_KHAC_PHUC_VA_NANG_CAP_SOP_PG_HOME.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/10_DIEM_CAN_KHAC_PHUC_VA_NANG_CAP_SOP_PG_HOME.md)
- **Bản 20 Điểm Cải Tiến Đột Phá Nâng Tầm Năng Suất:** [20_DIEM_CAI_TIEN_TOI_UU_DOT_PHA_SOP_PG_HOME_2026.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/20_DIEM_CAI_TIEN_TOI_UU_DOT_PHA_SOP_PG_HOME_2026.md)
- **10 Kẽ Hở Quản Trị & Giải Pháp Siết Chặt Cấp Độ 10:**
  1. *Chống Chấm Công Ảo:* Điểm danh 07:30, OT báo trước 17:00, kết thúc 21:30 bắt buộc kèm ảnh thành phẩm OT. Không ảnh -> Cắt 100% giờ OT ca đó.
  2. *Khóa Cột Phụ Cấp:* Hòa 530k + OT, Hào 450k + OT. Phụ cấp cố định = 0 đ. Toàn bộ 20k trách nhiệm treo thưởng Tết, trừ đền bù nếu làm hỏng ván.
  3. *Tam Giác Vàng Thưởng Doanh Số > 500M:* Chỉ giải ngân cuối năm khi đạt 3 điều kiện: Chiến đấu hết ngày 28 Tết + Thu hồi nợ >= 85% + Quyết toán lợi nhuận thực. Nghỉ trước Tết -> Hủy 100% quỹ thưởng.
  4. *Kiểm Soát Bóc Tách Ván CNC:* Định mức hao hụt ván <= 8.0%. Bắt buộc đính kèm sơ đồ Nesting CNC cắt tấm. Tận dụng ván thừa >= 600x800mm.
  5. *Cổng Duyệt Vàng PO:* Phiếu PO phải có Dấu Đỏ Điện Tử của Giám Đốc. NCC từ chối đơn chui không dấu đỏ. Vũ tự ý đặt phải tự thanh toán dứt điểm.
  6. *Khóa Trần Nợ NCC:* Quốc Tâm <= 30M (cảnh báo 27M). Đơn phát sinh < 500k phải thanh toán ngay trong ngày, không ghi nợ gối đầu. Lam Giang đối soát ngày 15 & 30 hàng tháng.
  7. *Tách Bạch 100% Doanh Số:* Doanh số xưởng gỗ CN = Tổng HĐ - Gỗ thịt - Phụ kiện/Đồ rời. Cấm tính gộp làm vống quỹ thợ 15% và vật tư 40%.
  8. *Khóa Lợi Nhuận Xưởng Ảo Col BG:* Xưởng chi lương thợ vượt 15% doanh số xưởng -> Khóa Col BG = 0 đ. Toàn bộ lương thợ đưa vào Tổng chi phí hệ thống.
  9. *Khiên Chắn Dòng Tiền 3 Chặng:* Cọc 40-50% mới chạy máy xưởng; Thu đủ 40% Đợt 2 khi xe tải chở ván đến nhà khách mới cho bóc nilong lắp đặt; Bàn giao thu nốt 10-20% trong 48h.
  10. *Hệ Thống AI Giám Sát Ngầm (Zero Disruption):* Vận hành ngầm 100% qua WinSta0 và cache media Zalo, mức ưu tiên IDLE, không chiếm chuột/focus, kích hoạt Red Alert cảnh báo Giám Đốc khi có lệch lạc.

---

## 14. HỆ THỐNG QUÉT NGẦM ZALO & GIÁM SÁT TỰ ĐỘNG THẾ HỆ MỚI (STEALTH ENGINE V2.0) & 20 CẢI TIẾN ĐỘT PHÁ
> [!IMPORTANT]
> **HỆ THỐNG GIÁM SÁT NGẦM VÔ HÌNH 100% VÀ 20 CẢI TIẾN ĐỘT PHÁ BẢO VỆ DÒNG TIỀN DOANH NGHIỆP:**
- **Văn bản 20 Cải Tiến Đột Phá:** [20_CAI_TIEN_QUET_NGAM_ZALO_VA_GIAM_SAT_TU_DONG_2026.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/20_CAI_TIEN_QUET_NGAM_ZALO_VA_GIAM_SAT_TU_DONG_2026.md)
- **Thư mục Tài Liệu Dự Án:** [📁 5. Tài liệu](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u)
- **Script Thực Thi Chạy Ngầm:** [monitor_all_phu_gia_groups.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/monitor_all_phu_gia_groups.py)
- **Kiến trúc 5 Trụ Cột Chiến Lược:**
  1. *Cơ chế Vô hình Tuyệt đối:* Không đụng chuột/phím, không cướp Focus, CPU $\le 0.3\%$, IDLE Priority, đọc qua `.rescache` và LevelDB transaction logs.
  2. *Thị giác Máy tính Chứng từ:* Tự động bóc tách UNC ngân hàng (VietinBank/Techcombank), tự động giảm trừ công nợ tức thời (16.838M, 15M, 496k); số hóa hóa đơn viết tay Quốc Tâm.
  3. *Giám sát Điểm danh & OT:* Đếm quân số thực tế qua ảnh check-in; đối soát OT qua giờ xuất file CNC; khóa cứng ngày nghỉ theo đơn Zalo (Thoan 7 công, Hiệp 26 công); treo 20k trách nhiệm thợ về cuối năm.
  4. *Quản trị Chi phí & Bóc tách:* Áp dụng công thức trừ gỗ thịt/phụ kiện (`woodVal = totalVal - solidWood - accVal`); kiểm soát cánh Acrylic ALD (12.21M, 22.75M); cảnh báo trần nợ NCC (QT 30M, LG 170M).
  5. *Bản đồ Dòng tiền & Cảnh báo Sống:* Đồng bộ Web App thời gian thực; tự động đối soát bảng lương Hiệp nộp; két dữ liệu bất biến SHA-256; bot tóm tắt điều hành 07:30 và 18:30.

---

## 15. HỆ THỐNG 30 CẢI TIẾN TỐI ƯU SOP ĐẲNG CẤP THẾ GIỚI & GIẢI PHÁP CHỐNG LƯỜI - CHỐNG LÀM ẨU
> [!IMPORTANT]
> **QUY CHUẨN ĐẲNG CẤP QUẢN TRỊ THẾ GIỚI - BẢO VỆ PHÁP LÝ HĐLĐ, THUẾ, BẢO HIỂM VÀ DÒNG TIỀN DOANH NGHIỆP:**
- **Văn bản Chiến lược Đỉnh cao:** [30_CAI_TIEN_TOI_UU_SOP_DANG_CAP_THE_GIOI_2026.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/30_CAI_TIEN_TOI_UU_SOP_DANG_CAP_THE_GIOI_2026.md)
- **Văn bản 20 Điểm Cần Hoàn Thiện Master SOP 3.0:** [20_DIEM_CAN_HOAN_THIEN_SOP_PG_HOME_2026.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/20_DIEM_CAN_HOAN_THIEN_SOP_PG_HOME_2026.md)
- **Master SOP 3.0 Tối Hậu:** [QUY_TRINH_VAN_HANH_CHUAN_SOP_QUAN_TRI_PG_HOME_LUXURY_2026.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u/QUY_TRINH_VAN_HANH_CHUAN_SOP_QUAN_TRI_PG_HOME_LUXURY_2026.md)
- **Thư mục Tài Liệu Dự Án:** [📁 5. Tài liệu](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u)
- **Quy tắc Pháp lý HĐLĐ & BHXH Thái Quản lý:**
  1. *Chức danh trên hồ sơ nộp BHXH (Mẫu D02-LT):* Ghi là **"Kỹ thuật viên xưởng"** hoặc **"Nhân viên kỹ thuật nội thất"** (tuyệt đối không ghi "Quản lý / Giám đốc" để tránh BHXH nghi vấn trốn đóng hoặc ép tăng mức đóng).
  2. *Mức lương đóng BHXH:* Đúng mức lương tối thiểu vùng III **3.860.000 đ/tháng** (quỹ trích nộp 1.100.000 đ/tháng).
  3. *An toàn Thuế TNCN:* Thu nhập Thái (< 11 triệu/tháng) nằm dưới ngưỡng giảm trừ gia cảnh $\implies$ Thuế TNCN = 0 đ, an toàn tuyệt đối 100%.
  4. *Cơ cấu Lương HĐLĐ 3 thành phần:* Lương chính vùng III + Phụ cấp không tính BHXH + Thưởng năng suất KPI. Chuẩn chỉ để chuyển đổi lên Công ty TNHH sau này.

---

## 16. QUY CHUẨN MASTER SOP 4.0 - HỆ ĐIỀU HÀNH TƯƠNG TÁC SỐNG & 15 NGUYÊN LÝ TỐI ƯU HÓA ĐẲNG CẤP THẾ GIỚI
> [!IMPORTANT]
> **NÂNG CẤP MASTER SOP LÊN THẾ HỆ 4.0: TRANG BỊ MẠNG LƯỚI HYPER-LINK SỐNG 1 CHẠM VÀ 15 NGUYÊN LÝ TỐI ƯU HÓA LEAN & TOYOTA JIDOKA:**
- **Văn bản Nghiên Cứu Tối Ưu SOP Chuyên Sâu:** [NGHIEN_CUU_TOI_UU_SOP_DANG_CAP_THE_GIOI_PG_HOME_2026.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/7.%20Kho%20b%C3%AD%20m%E1%BA%ADt%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B%20n%E1%BB%99i%20b%E1%BB%99/NGHIEN_CUU_TOI_UU_SOP_DANG_CAP_THE_GIOI_PG_HOME_2026.md)
- **Master SOP 4.0 (Live Hyper-Linked Edition):** [QUY_TRINH_VAN_HANH_CHUAN_SOP_QUAN_TRI_PG_HOME_LUXURY_2026.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/7.%20Kho%20b%C3%AD%20m%E1%BA%ADt%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B%20n%E1%BB%99i%20b%E1%BB%99/QUY_TRINH_VAN_HANH_CHUAN_SOP_QUAN_TRI_PG_HOME_LUXURY_2026.md)
- **Thư mục Kho Bí Mật Quản Trị Nội Bộ:** [📁 7. Kho bí mật - Quản trị nội bộ](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/7.%20Kho%20b%C3%AD%20m%E1%BA%ADt%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B%20n%E1%BB%99i%20b%E1%BB%99)
- **Quy Chuẩn Bắt Buộc Về Liên Kết Sống (Live Links Protocol):**
  1. *Nguyên lý 1 chạm (Single-Click Access):* Mọi điều khoản quy định, bảng tính, mẫu tờ khai đều phải gắn link sống trực tiếp (http://localhost:8080/index.html hoặc ile:///f:/...) để Giám Đốc bấm vào là mở ra ngay lập tức.
  2. *Cưỡng chế kỹ thuật (Jidoka Gate):* Cấm đặt hàng vật tư nếu thiếu con dấu đỏ điện tử trên Web App; cấm chấm bù công nếu quá hạn 08:00 sáng.
  3. *Khóa cứng dòng tiền (Cash Flow Hard Lock):* Phụ cấp trách nhiệm 20k/công và thưởng vượt mức >500M tuyệt đối không chi tiền mặt hàng tháng mà dồn đến cuối năm quyết toán cùng thưởng Tết.
  4. *Giám sát ngầm vô hình (Stealth Zero Disruption):* AI quét dữ liệu ngầm qua WinSta0 Desktop ở độ ưu tiên IDLE, không chiếm chuột, không gây nháy màn hình.

---

## CẬP NHẬT CÔNG NGHỆ ZALO STEALTH ENGINE V6.0 (PURE DISK + SQLITE RO + FILENOISE IN-MEMORY - 06/11/2026)
> [!IMPORTANT]
> **BƯỚC ĐỘT PHÁ CÔNG NGHỆ STEALTH ENGINE V6.0 - CHUẨN HÓA VĨNH VIỄN BẢO VỆ TUYỆT ĐỐI GIAO DIỆN & TRUY XUẤT DỮ LIỆU THẦN TỐC:**
> Kế thừa toàn bộ bài học thực chiến và kỷ luật thép của Giám Đốc Nguyễn Viết Nghĩa, hệ thống nâng cấp toàn diện lên kiến trúc **Pure Disk + SQLite Read-Only + In-Memory Decoder** đạt hiệu năng cực hạn, vô hình tuyệt đối (Zero Disruption) và xóa bỏ 100% rủi ro can thiệp giao diện Zalo của Giám Đốc.

### 4 TRỤ CỘT CÔNG NGHỆ STEALTH ENGINE V6.0:

1. **SQLite Read-Only URI (`Storage.db?mode=ro`):**
   - **Cơ chế hoạt động:** Kết nối trực tiếp vào cơ sở dữ liệu Zalo tại đường dẫn `C:\Users\Admin\AppData\Roaming\ZaloData\Database\_production\Storage.db` thông qua chuỗi kết nối SQLite URI với cờ `mode=ro` (`file:///C:/Users/Admin/AppData/Roaming/ZaloData/Database/_production/Storage.db?mode=ro`).
   - **Số liệu thực tế:** Truy xuất trực tiếp **8,406 hồ sơ người dùng** trong bảng `[info-cache]` và toàn bộ lịch sử truyền nhận file đính kèm trong bảng `[db-stchecksum]`.
   - **Hiệu năng & An toàn:** Cơ chế Read-Only URI đảm bảo **0% database lock contention** (tuyệt đối không khóa file, không gây xung đột tiến trình với Zalo PC đang mở), thời gian đọc sub-millisecond, hoàn toàn độc lập với phiên làm việc của người dùng.

2. **Giải mã In-Memory `fileNoise` ([zalo_filenoise_decoder.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/zalo_filenoise_decoder.py)):**
   - **Cơ chế hoạt động:** Giải mã tức thời **459 files** (tổng dung lượng **1.54 GB** gồm 185 PDF, 156 XLSX, 40 DOCX, v.v.) nằm trong các thư mục cache `ZaloDownloads\fileNoise` và `resource\*\fileNoise`.
   - **Thuật toán giải mã chuẩn:**
     * Cắt bỏ 6-byte footer nhận dạng của Zalo: `\x07zAlO\x07` ở cuối file.
     * Thực hiện phép đảo bit XOR trên 100 bytes đầu tiên của tệp tin với khóa bí mật `0x93` (`byte ^ 0x93`).
     * Xử lý 100% In-Memory (trên RAM), không sinh bất kỳ tệp tin tạm rác nào ra ổ cứng.
     * Tự động tính toán mã băm `SHA-256` 64 ký tự chống trùng lặp dữ liệu và bảo đảm tính toàn vẹn vật lý của từng hóa đơn, UNC ngân hàng và hồ sơ kỹ thuật.

3. **Quét nhị phân LevelDB & `.rescache` siêu tốc ([zalo_leveldb_scanner.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/zalo_leveldb_scanner.py)):**
   - **Tốc độ kỷ lục:** Quét nhị phân toàn bộ cơ sở dữ liệu LevelDB dung lượng **1.39 MB** chỉ trong **`33.45 ms`**.
   - **Quy mô xử lý:** Rà soát xuyên suốt **332 thư mục `resource`** chứa **20,519 files** với tổng dung lượng **11.89 GB**, bóc tách toàn bộ hình ảnh hóa đơn, ảnh nghiệm thu xưởng và biên bản giao hàng.
   - **Mức ưu tiên hệ thống:** Luôn chạy ở mức độ ưu tiên nhàn rỗi tuyệt đối `IDLE_PRIORITY_CLASS` (`0x00000040`), mức sử dụng CPU $\le 0.3\%$, hoàn toàn vô hình và không gây độ trễ cho máy trạm của Giám Đốc.

4. **Lá chắn an toàn cửa sổ ([zalo_health_shield.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/zalo_health_shield.py)):**
   - **Kiểm toán tĩnh tự động (Static Audit):** Sử dụng AST và Regular Expressions phân tích liên tục toàn bộ script chạy ngầm nhằm ngăn chặn từ trong trứng nước mọi đoạn mã nguy hiểm.
   - **Khóa cứng tuyệt đối:** Khóa 100% các lệnh có nguy cơ tác động vào giao diện Zalo: `uiautomation`, `DWMWA_CLOAK`, `SetForegroundWindow`, `BringWindowToTop`, `mouse_event`, `SetCursorPos`, `PostMessageW` (gửi phím/chuột mù).
   - **Bảo vệ màn hình Giám Đốc:** Đảm bảo 100% cửa sổ Zalo của Giám Đốc không bị giật lag, không chớp nháy, không bị chiếm tiêu điểm (Focus Guard), tuân thủ tuyệt đối chuẩn mực Pure Stealth Zero-Disruption.

---

## MỤC 16B: 25 CẢI TIẾN QUY TRÌNH LÀM VIỆC TỰ ĐỘNG HÓA 100% — KHÔNG SAI VẶT GIÁM ĐỐC (ĐỘI GIÁM SÁT VIÊN S01–S05 BAN HÀNH 08/11/2026)

> [!IMPORTANT]
> **HIẾN PHÁP TỰ ĐỘNG HÓA TỐI CAO:** Tổng Chỉ Huy và đội quân 50 Công Nhân Flash (`W01`–`W50`) + 5 Giám Sát Viên (`S01`–`S05`) bắt buộc tự chủ hoàn toàn 100% từ khâu đọc dữ liệu, sửa code, kiểm toán chéo, đồng bộ Git đến triển khai Vercel Cloud — **TUYỆT ĐỐI KHÔNG BAO GIỜ SAI VẶT GIÁM ĐỐC THAO TÁC TAY**.

### I. 5 Cải Tiến Quy Trình Kiểm Soát Tài Chính & CCSC (Giám Sát Viên S01)
1. **Khóa tự động `Col BG = MAX(0, Quỹ Khoán 15% - Lương Thợ Thực Chi)`:** Tự động đóng băng lợi nhuận xưởng về `0 đ` ngay khi tổng lương thợ vượt định mức `15%` doanh số sản xuất (`woodVal`), ngăn chặn 100% hành vi lấy lãi thương mại/phụ kiện bù lỗ cho xưởng.
2. **Đồng bộ Sổ Quỹ Thợ Nòng Cốt Hòa & Hào (`20.000 đ/công`) Trực Tiếp Từ Bảng Chấm Công Sống:** Mọi khoản trích lập quỹ giữ chân thợ nòng cốt phải tự động nhân từ số ngày công thực tế (`T8: Hòa 21 công, Hào 22.5 công`; `T9: Hòa 24 công, Hào 18.5 công`; `T10: Hòa 28 công, Hào 30 công` $\rightarrow$ Tổng giữ lại `2.880.000 đ`), hàng tháng phụ cấp = `0 đ`.
3. **Bóc Tách Tự Động `woodVal = totalVal - solidWood - accVal` Trước Khi Tính Khoán:** Mọi đơn hàng có gỗ tự nhiên (gỗ thịt) hoặc phụ kiện/đá/kính mua ngoài đều bị tách khỏi mẫu số tính định mức 40% vật tư và 15% công thợ.
4. **Cơ Chế Phong Tỏa Thưởng Doanh Số `> 500 Triệu` Đến Tất Niên:** Quỹ thưởng vượt ngưỡng 500M của Thái (`0.5%`), Vũ (`0.3%`), Hiệp (`0.5%`) chỉ giải ngân cuối năm khi tỷ lệ thu hồi công nợ đạt $\ge 85\%$.
5. **Đối Soát Khớp Lệnh 3 Chiều Lương Thực Chi (`app.js` $\leftrightarrow$ `verified_entities.json` $\leftrightarrow$ `CCSC Col AV`):** Chặn mọi sai lệch dù chỉ `1 đồng` giữa bảng lương chi tiết và bảng tổng hợp CCSC bỏ túi Ban Giám Đốc.

### II. 5 Cải Tiến Quy Trình Định Mức CNC & Chống Thất Thoát Vật Tư Xưởng (Giám Sát Viên S02)
6. **Cổng Kiểm Soát Tự Động 8 Định Mức CNC Thực Chiến (Nhà Anh Nam):** Khóa cứng định mức chuẩn khổ ván `1220x2440` (`R09` Bếp dưới `1.45 tấm/md`, `R08` Bếp trên `1.04 tấm/md`, `R10` Kịch trần `1.44 tấm/md`, `R27/R40/R49` Tủ áo `1.05 tấm/m²` trừ `0.40 tấm/m²` cánh kính, `R05` Tủ nông `0.50 tấm/m²`, `R06` Vách phẳng `0.40 tấm/m²`, `R33/R42` Giường bo cong `3.3–3.5 tấm/cái`, `R04/R24` Kệ treo `0.55–0.65 tấm/md`).
7. **Thuật Toán Khấu Trừ Giao Cắt & Trừ Lỗ Mở Bắt Buộc (`Intersection Deduction`):** Tự động trừ diện tích giao cắt khi tủ trang trí đè lên vách ốp (`R06` trừ `R05`) hoặc tủ áo khoét lỗ cửa giấu khuôn (`R27` trừ `R29`).
8. **Ma Trận Ghép Phôi Xuyên Hạng Mục (`Nesting Optimization`):** Tự động ghép dải phôi dư `500mm` từ tủ bếp kịch trần sâu `700mm` (`R10`) sang kệ tivi/lavabo sâu `400–500mm`, giảm hao hụt ván xuống dưới `4.5%`.
9. **Khóa Định Giá 3 Cấp Vật Liệu (`An Cường` $\leftrightarrow$ `Thái Lan` $\leftrightarrow$ `Plywood A1`):** Cố định 100% chi phí Nhựa WPB (`2.550.000 đ/tấm`), Cánh Acrylic Noline, Phụ kiện và Công thợ; cột Thái Lan chỉ giảm đúng phần chênh phôi ván `~380.000 đ/tấm` (`12%–14%`).
10. **Chốt Chặn `Cost <= 54%` Trước Khi In/Xuất Báo Giá PDF A4:** Hệ thống tự động khóa nút xuất báo giá nếu `(Tổng Vật Tư + Công Thợ) / Doanh Thu > 54%`, bảo vệ biên lợi nhuận ròng `18%–20%` của Giám Đốc.

### III. 5 Cải Tiến Quy Trình Đồng Bộ Ngầm Zalo V6.0 Pure Disk (Giám Sát Viên S03)
11. **Quét Không Giới Hạn Chùm Ảnh Hóa Đơn (`No-Slice Delta-Cursor`):** Bỏ giới hạn cắt mảng `[-15:]` trong [monitor_all_phu_gia_groups.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/monitor_all_phu_gia_groups.py#L647), đảm bảo bắt trọn 100% đợt gửi hàng chục ảnh hóa đơn/phiếu xuất kho cùng lúc.
12. **Nén Cửa Sổ Trượt `seen_keys` Kèm Lưu Trữ Băm `SHA-256` Vĩnh Viễn:** Giữ tệp con trỏ [zalo_seen_cursor.json](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/zalo_seen_cursor.json) luôn gọn nhẹ, nạp RAM dưới `5 ms` mà không bao giờ quét trùng ảnh cũ.
13. **Kết Nối SQLite URI Read-Only + Immutable (`?mode=ro`):** Đọc trực tiếp `Storage.db` ở chế độ chỉ đọc tuyệt đối, không tạo khóa WAL/SHM, cho phép Giám Đốc sử dụng Zalo PC song song 24/7.
14. **Giải Mã `fileNoise` (`XOR 0x93`) Phân Tầng Theo Chữ Ký Magic-Bytes:** Chỉ giải mã 100 bytes đầu trên RAM để định danh PDF/XLSX/DOCX trước khi bóc tách toàn văn những chứng từ tài chính mới.
15. **Lá Chắn Kiểm Toán Tĩnh Pre-Run (`Zalo Health Shield`):** Tự động quét AST mọi script trước khi chạy Daemon, chặn tuyệt đối mọi hàm Win32 UI có nguy cơ làm nháy cửa sổ.

### IV. 5 Cải Tiến Quy Trình Cloud, PWA & Triển Khai Vercel Tự Động (Giám Sát Viên S04)
16. **Bộ Lọc `.vercelignore` Tinh Gọn Payload `< 5 MB`:** Loại bỏ toàn bộ tệp dump Zalo thô hàng chục MB khỏi gói Serverless Function, giữ tốc độ Cold-Start API trên Vercel dưới `80 ms`.
17. **Chiến Lược Cache Hybrid (`stale-while-revalidate` Cho Assets + `no-store` Cho API):** Tối ưu tốc độ mở giao diện Web App tức thì (`< 0.2s`) đồng thời đảm bảo số liệu tài chính luôn mới nhất 100%.
18. **Tự Động Bơm Shim Windows Junction Khi Deploy Vercel CLI:** Khắc phục triệt để lỗi `EPERM: symlink` trên Windows thông qua `NODE_OPTIONS="--require .../win_junction_shim.js"`, triển khai hoàn toàn tự động không cần hỏi Giám Đốc.
19. **Đồng Bộ Offline Outbox (`IndexedDB / LocalStorage Queue`):** Khi mất mạng tạm thời tại xưởng hoặc công trình, mọi thao tác duyệt phiếu/chấm công được lưu vào hàng đợi và tự động đẩy lên Cloud ngay khi có mạng.
20. **Kiểm Tra Hậu Kiểm `HTTP 200` Đa Điểm Cuối Sau Mỗi Lần Deploy:** Tự động xác thực `/`, `/api/health`, `/api/state`, `/modules/w50_master_hub_loader.js` đạt `200 OK` trước khi báo cáo hoàn tất.

### V. 5 Cải Tiến Quy Trình Điều Quân 50 Công Nhân + 5 Giám Sát Viên (Giám Sát Viên S05)
21. **Kỷ Luật "Zero-Bothering" (Cấm Sai Vặt Giám Đốc 100%):** Mọi công việc kỹ thuật, cấu hình Git, đẩy code, tạo dự án, sửa lỗi, kiểm thử đều do Tổng Chỉ Huy và đội công nhân tự giải quyết từ A–Z.
22. **Phân Vùng Độc Lập Tuyệt Đối (`1 Công Nhân = 1 Module Riêng`):** Chia nhỏ dự án thành 50 module độc lập (`w01`–`w50`) nạp qua `PG_OptimizationHub` (`W50`), xóa bỏ 100% xung đột ghi đè file khi 50 công nhân chạy song song.
23. **Chuẩn Hóa Pháp Lý & Thương Hiệu Phú Gia Tự Động (`W15 Enforcer`):** Tự động rà soát và khóa cứng thông tin pháp lý trên toàn bộ biểu mẫu in ấn: `Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng`, MST/ĐKKD `042203002931`, `Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh`, Hotline `0986.722.324`.
24. **Kiểm Toán Chéo Độc Lập Bởi 5 Giám Sát Viên (`TypeName="research"`):** Luôn tách biệt đội thi công (`W01`–`W50`) và đội thanh tra độc lập (`S01`–`S05`) để phát hiện và sửa ngay mọi sai số trước khi nghiệm thu.
25. **Thu Hồi Quân Sạch Sẽ (`kill_all`) Sau Mỗi Chiến Dịch:** Giải phóng 100% bộ nhớ và tiến trình con ngay sau khi thu hoạch đủ báo cáo, giữ máy trạm của Giám Đốc luôn nhẹ và mượt tuyệt đối.


