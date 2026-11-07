# SỔ TAY QUẢN TRỊ 01: QUẢN TRỊ NHÂN SỰ, TÀI CHÍNH THỰC TẾ, CCSC & BÓC TÁCH VẬT TƯ (MỤC 1 - 8)
> [!IMPORTANT]
> **TÀI LIỆU QUY CHUẨN NỘI BỘ TỐI CAO - BỘ QUY TẮC CHI TIẾT DỰ ÁN PG HOME LUXURY (TRÍCH XUẤT 100% NGUYÊN BẢN GỐC).**
> Bao gồm chi tiết: Quy chuẩn xưng hô, bảo mật cơ chế khoán, 3 phân hệ gốc, logic CCSC chi tiết (A-E), tài nguyên hệ thống, chấm công điểm danh, danh sách nhân sự chuẩn T8-T10, bóc tách gỗ thịt và đối soát 3 NCC 2026.

---

# QUY TẮC QUẢN TRỊ & KINH NGHIỆM LÀM VIỆC DỰ ÁN PG HOME LUXURY

> **Tài liệu quy chuẩn ghi nhớ vĩnh viễn cho tất cả các phiên làm việc của Trợ lý AI và Hệ thống Quản trị.**  
> *Được cập nhật và đối soát chuẩn xác 100% theo chỉ đạo của Giám Đốc Nguyễn Viết Nghĩa.*

---

## 1. QUY CHUẨN XƯNG HÔ & PHONG CÁCH LÀM VIỆC
- **Người dùng:** Giám Đốc Điều Hành (Anh Nguyễn Viết Nghĩa). Người dùng có phong cách giao tiếp thân mật đời thường và thường xưng "bố".
- **Trợ lý AI / Hệ thống:** Luôn luôn xưng **"em"** và gọi người dùng là **"Giám Đốc"** hoặc **"Anh"**. Tuyệt đối không xưng "bố - con" trong mọi phản hồi và tài liệu giao diện.
- **Phong cách:** Quyết đoán, số liệu chuẩn xác 100%, logic chặt chẽ, tôn trọng quyết định kinh doanh của Giám Đốc.

---

## 2. NGUYÊN TẮC BẢO MẬT CƠ CHẾ KHOÁN
- **Bảo mật tuyệt đối:** Tuyệt đối **KHÔNG ĐƯỢC HIỂN THỊ** các tỷ lệ khoán nội bộ như `% Khoán xưởng 55%`, `% Định mức vật tư 40%`, `% Quỹ khoán thợ 15%`, `% Cost công trình` trên giao diện người dùng của nhân viên xưởng hoặc nhân viên văn phòng.
- **Phân quyền xem:** Chỉ duy nhất tài khoản của **Giám Đốc (ADMIN)** mới có quyền truy cập Bảng Quản Trị CCSC, báo cáo lợi nhuận, chi phí định mức và cơ cấu tài chính.

---

## 3. CƠ CẤU 3 PHÂN HỆ QUẢN TRỊ DOANH NGHIỆP
1. **Phân hệ Giám Đốc (ADMIN):**
   - Quản trị toàn diện: Xem Dashboard, Báo cáo CCSC 12 tháng, Báo cáo CCSC T8+T9, Chấm công thợ, Giá cost vật tư, Hợp đồng, Dòng tiền công nợ.
   - Thẩm quyền cao nhất: **Phê duyệt và đóng dấu đỏ điện tử** cho các Phiếu Đề Xuất Đặt Hàng Vật Tư của xưởng.
   - Trực tiếp phân quyền và kích hoạt tài khoản nhân sự mới đăng ký.
2. **Phân hệ Kỹ Thuật & Vật Tư Xưởng (Vũ - XUONG_VATTU):**
   - Chỉ được lập phiếu đề xuất vật tư theo bóc tách kỹ thuật công trình.
   - **Quy tắc sống còn:** Vũ chỉ được phép gửi đơn cho nhà cung cấp (An Cường, Hafele...) khi phiếu đã được **GIÁM ĐỐC DUYỆT & ĐÓNG DẤU ĐỎ**. Chưa có dấu duyệt đỏ thì tuyệt đối cấm nhập hàng.
3. **Phân hệ Sale Admin & Văn Phòng (Hiệp - VANPHONG_SALE):**
   - Chỉ xem mảng văn phòng: Hợp đồng công trình, doanh số, tiến độ thu tiền công nợ và tạm ứng khách hàng.
   - Không được can thiệp vào xưởng sản xuất hay số liệu tài chính quản trị cấp cao.
4. **Cơ chế duyệt tài khoản mới:**
   - Nhân viên đăng ký tài khoản mới mặc định ở trạng thái `PENDING`.
   - Giám Đốc vào tab "Phân Quyền Nhân Sự" để cấp vai trò và kích hoạt `ACTIVE`.

---

## 4. LOGIC TÍNH TOÁN CCSC & KINH NGHIỆM ĐỐI SOÁT TÀI CHÍNH THỰC TẾ

### A. Vật tư và Công thợ xưởng:
- **Vật tư xưởng (Col AU):** Do xưởng chưa thống kê chi tiết theo từng hóa đơn công trình $\rightarrow$ Cố định tính đúng **40.0% Doanh số xưởng theo định mức** (`=Doanh_số_xưởng * 40%`).
  - Tháng 8/2026: 242,051,705 đ × 40% = **96,820,682 đ**
  - Tháng 9/2026: 287,782,767 đ × 40% = **115,113,107 đ**
- **Công thợ xưởng (Col AV):** Lấy theo **con số thực tế chi trả từ bảng lương chấm công thợ**:
  - Tháng 8/2026: **41,285,625 đ** (chiếm 17.06% Doanh số xưởng).
  - Tháng 9/2026: **44,052,188 đ** (chiếm 15.31% Doanh số xưởng).
  - Tổng 2 tháng: **85,337,813 đ** (chiếm 16.11% Doanh số xưởng).

### B. QUY TẮC CỐT LÕI: LỢI NHUẬN XƯỞNG (Col BG)
> [!IMPORTANT]
> **XƯỞNG ÂM QUỸ KHOÁN SO VỚI ĐỊNH MỨC 15% THÌ TUYỆT ĐỐI KHÔNG TÍNH LỢI NHUẬN XƯỞNG 2.2%!**
- Quỹ khoán thợ 15% T8: 36.31M | Thực tế chi trả: 41.29M $\rightarrow$ Âm: -4.98M.
- Quỹ khoán thợ 15% T9: 43.17M | Thực tế chi trả: 44.05M $\rightarrow$ Âm: -0.88M.
- Tổng 2 tháng xưởng âm quỹ thợ: **-5,862,642 đ**.
- **Hạch toán:** **Lợi nhuận xưởng (Col BG) = 0 đ**. Không được tự động nhân 2.2% doanh số vì sẽ làm lợi nhuận công ty bị tính ảo thêm 11.66M. Toàn bộ tiền trả thợ thực tế đã được đưa vào Tổng chi phí hệ thống (Col BC).

### C. Lương cán bộ quản lý & % Sản phẩm:
- **Ban Lãnh Đạo (Giám Đốc Nghĩa):** Cố định **12,000,000 đ/tháng** (Col G).
- **Quản lý xưởng (Thái + Vũ):** Định mức 21M/tháng. Thực tế chấm công: T8 = **19,615,385 đ**; T9 = **20,250,000 đ** (Col AD).
- **P. Sale Admin & 3D (Hiệp):** Lương cứng 6.5M + % SP Chị Phượng (T8: 3M, T9: 7M) $\implies$ Thực chi: T8 = **9,500,000 đ**; T9 = **13,500,000 đ** (Col W).
- **P. Kinh Doanh (Dũng):** Lương thời gian theo công + % SP Anh Hoàn (T8: 6.5M, T9: 6.0M) + Phụ cấp 500k $\implies$ Thực chi: T8 = **10,500,000 đ**; T9 = **9,865,385 đ** (Col AA).
- **Marketing (Chỉ đạo mới):** Cố định **12,000,000 đ/tháng** (1 nhân sự lương 6M + 6M ngân sách quảng cáo Ads) (Col R).
- **BHXH (Chỉ đạo mới):** Đóng **1,100,000 đ/người/tháng cho 6 nhân sự: Thái, Vũ, Hiệp, Dũng, Nghĩa, Hào** (Tổng = **6,600,000 đ/tháng**) (Col BB).
- **Hành chính nhân sự & VPP (Col AG):** T8 = 4,000,000 đ; T9 = 4,500,000 đ.
- **Mặt bằng Showroom & Xưởng:** Cố định 13,000,000 đ/tháng (Showroom 6M + Xưởng 7M).
- **Chi phí biến đổi khác:** Xe tải 1.5% + Điện nước 1.5% + Bảo hành/khác 1.0% theo doanh số xưởng.

### C1. QUY CHẾ TRÁCH NHIỆM THỢ NÒNG CỐT (HÒA & HÀO) & NGUYÊN TẮC CHI TIỀN MẶT HÀNG THÁNG:
> [!IMPORTANT]
> **NGUYÊN TẮC SỐNG CÒN: BẢNG LƯƠNG HÀNG THÁNG TUYỆT ĐỐI KHÔNG CỘNG 560K / 600K PHỤ CẤP VÀO THỰC LĨNH!**
- **Đơn giá công nhật thực chi hàng tháng:**
  * **Hà Viết Hòa:** Đúng **530,000 đ / ngày công** + Tiền làm thêm giờ OT. Phụ cấp trách nhiệm hàng tháng = **0 đ**.
  * **Lương Thể Hào:** Đúng **450,000 đ / ngày công** + Tiền làm thêm giờ OT. Phụ cấp trách nhiệm hàng tháng = **0 đ**.
- **Khoản 20k/công trách nhiệm:** Nếu có áp dụng đánh giá, toàn bộ phải **TREO DỒN LẠI CUỐI NĂM QUYẾT TOÁN CÙNG THƯỞNG TẾT (như quy chế C2)**. TUYỆT ĐỐI CẤM tự ý đưa 560k của Hòa hay 600k của Hào vào cột phụ cấp để xuất quỹ chi tiền mặt hàng tháng làm thất thoát tiền của Giám Đốc!

### C2. QUY CHẾ THƯỞNG VƯỢT MỨC DOANH SỐ > 500 TRIỆU (CUỐI NĂM MỚI LẤY):
> [!IMPORTANT]
> **CHỈ ĐẠO MỚI CỦA GIÁM ĐỐC: CÁC CƠ CHẾ VƯỢT MỨC > 500 TRIỆU ĐỀU TREO LẠI, ĐẾN CUỐI NĂM MỚI QUYẾT TOÁN CHI TRẢ!**
- **Đối tượng:** Thái (0.5% DS), Vũ (0.3% DS), Hiệp (0.5% DS).
- **Quy tắc giải ngân tiền mặt:**
  1. Hàng tháng, hệ thống và kế toán chỉ ghi nhận trên sổ sách báo cáo quản trị để theo dõi quỹ tích lũy, **TUYỆT ĐỐI KHÔNG XUẤT QUỸ CHI TIỀN MẶT HÀNG THÁNG**.
  2. Toàn bộ tiền thưởng vượt mức sẽ **dồn lại đến kỳ quyết toán lương thưởng Tết Nguyên Đán (cuối năm) mới chi trả 1 lần**.
  3. **Mục đích quản trị sống còn:** Giữ chân nhân sự nòng cốt chiến đấu hết mình qua vụ Tết, bảo toàn dòng tiền lưu động nhập hàng (An Cường, Hafele), và chỉ chi trả khi công nợ khách hàng đã được đối soát thu hồi $\ge 85\%$.

### D. Mảng Phụ Kiện Bán Kèm & Sofa (Sheet riêng):
- Doanh thu T8: 8,840,000 đ $\rightarrow$ Lợi nhuận gộp (30%): **2,652,000 đ**.
- Doanh thu T9: 30,000,000 đ $\rightarrow$ Lợi nhuận gộp (30%): **9,000,000 đ**.
- Tổng lãi gộp 2 tháng: **11,652,000 đ**.

### E. Bảng Số Liệu Tổng Hợp Cuối Cùng Bỏ Túi BGĐ:
| Chỉ tiêu | Tháng 8/2026 | Tháng 9/2026 | TỔNG CỘNG 2 THÁNG |
| :--- | :---: | :---: | :---: |
| **Doanh số xưởng gỗ CN (Col D)** | **242,051,705 đ** | **287,782,767 đ** | **529,834,472 đ** |
| **Tổng Chi Phí Hệ Thống (Col BC)** | **235,003,760 đ** | **262,391,990 đ** | **497,395,751 đ** |
| **Lợi Nhuận Văn Phòng (Gỗ) (Col BD)** | **7,047,945 đ** | **25,390,777 đ** | **32,438,721 đ** |
| **Lợi Nhuận Xưởng 2.2% (Col BG)** | **0 đ** | **0 đ** | **0 đ** |
| **Lợi Nhuận Phụ Kiện (Col BI)** | **2,652,000 đ** | **9,000,000 đ** | **11,652,000 đ** |
| 💎 **TỔNG LỢI NHUẬN RÒNG BỎ TÚI BGĐ** | **9,699,945 đ** | **34,390,777 đ** | **44,090,721 đ** |

---

## 5. DANH MỤC TÀI NGUYÊN HỆ THỐNG
1. **File Excel Chuẩn:**
   - [BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/2.%20CSC%20-%20Ch%E1%BB%89%20s%E1%BB%91/BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx) (Thư mục CSC)
   - [BẢNG QUẢN TRỊ TÀI CHÍNH THỰC TẾ T8 T9 NĂM 2026.xlsx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/B%E1%BA%A3ng%20QU%E1%BA%A2N%20TR%E1%BB%8A%20T%C3%80I%20CH%C3%8DNH%20TH%E1%BB%B0C%20T%E1%BA%BE%20T8%20T9%20N%C4%82M%202026.xlsx) (Thư mục gốc)
   - [BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx) (Dành cho nút Tải file trên Web App)
2. **Web App Quản Trị:**
   - Thư mục: `f:\PG Home - Quản trị\web_app`
   - File chính: `index.html`, `app.js`, `styles.css`
   - Server Local: `http://localhost:8080/index.html` (Task daemon đang chạy)
   - Tab Quản Trị Giám Đốc: **Báo Cáo CCSC T8+T9** (`#ccsc-t8-t9`), có nút tải file Excel trực tiếp.


## 6. QUY CHUẨN BẢNG CHẤM CÔNG & ĐIỂM DANH HÀNG NGÀY
- **Cơ chế 2 bộ phận:**
  * **Bộ phận Xưởng:** Gồm 2 chỉ tiêu mỗi ngày: Hành chính (HC: 1, 0.5, P, K) và Giờ làm thêm ngoài giờ (Tăng ca OT: 1, 1.5, 2, 2.5, 3h). Do Vũ và Thái quản lý, điểm danh hàng ngày.
  * **Bộ phận Văn phòng:** Chấm ngày công hành chính (1, 0.5, P, K) do Hiệp quản lý và điểm danh.
  * **Giám Đốc (ADMIN):** Toàn quyền kiểm tra, theo dõi quân số có mặt hôm nay, đối soát ngày công thực tế với bảng lương chi trả.
- **Tính năng trên Web App:** Tích hợp bộ lọc kỳ tháng (T8, T9, T10), lọc bộ phận, điểm danh nhanh 1 chạm hôm nay (Quick Attendance), thêm nhân sự mới và lưu bền vững vào hệ thống.

---

## 7. QUY CHUẨN DANH SÁCH NHÂN SỰ CHUẨN & CHU TRÌNH VẬN HÀNH T8, T9, T10
- **Nhân sự đã nghỉ việc (Đã xóa vĩnh viễn):**
  * Xưởng: Phan Thanh Lực (0 ngày công).
  * Văn phòng: Phan Xuân Hùng, Phan Văn Bình, Dương Thị Tuyết (đều 0 ngày công).
  * Tuyệt đối không đưa 4 nhân sự này vào bảng chấm công hay danh mục kinh doanh.
- **Danh sách 9 nhân sự thực tế đang công tác (Active):**
  * **Bộ phận Xưởng (7 người):** Hà Viết Hòa (Thợ cả), Nguyễn Văn Thái (Quản lý xưởng), Lê Văn Thoan (Thợ dán cạnh), Hoàng Công Vũ (Kỹ thuật/CNC), Lương Thể Hào (Thợ lắp ráp), Trần Văn Anh (Thợ lắp đặt), Tuấn Anh (Thợ đóng gói - từ T9).
  * **Bộ phận Văn phòng (2 người):** Tống Trần Hiệp (Sale Admin/3D), Đường Việt Dũng (Phòng Kinh Doanh).
- **Nguyên tắc chu trình dữ liệu:**
  * **Tháng 8 & Tháng 9:** Dữ liệu thực tế lịch sử đã quyết toán xong $\rightarrow$ Fix cứng 100% (Khóa sổ - Read only).
  * **Từ Tháng 10:** Bắt đầu nhập liệu sống hàng ngày (Điểm danh thực tế, PO vật tư mới, Công trình xưởng T10, Hợp đồng & Thu tiền mới). Không dùng mock data giả lập bừa bãi.


---

---

## 8. BÀI HỌC QUẢN TRỊ RÚT KINH NGHIỆM: BÓC TÁCH GỖ THỊT & TÁCH BẠCH DỮ LIỆU THỰC TẾ VỚI XƯỞNG KHOÁN
> [!IMPORTANT]
> **ĐÂY LÀ CHỈ ĐẠO SỐNG CÒN CỦA GIÁM ĐỐC NGUYỄN VIẾT NGHĨA:**

### 8.1. NGUYÊN TẮC BÓC TÁCH GỖ THỊT & PHỤ KIỆN BÁN KÈM:
- **Bản chất hoạt động xưởng:** PG Home chỉ vận hành **XƯỞNG SẢN XUẤT GỖ CÔNG NGHIỆP**.
- **CÔNG THỨC BẮT BUỘC TÍNH DOANH SỐ XƯỞNG GỖ CN (`woodVal`):**
  $$\text{Doanh số Xưởng Gỗ CN} = \text{Tổng Giá Trị Hợp Đồng} - \text{Gỗ Thịt (Tự nhiên)} - \text{Phụ Kiện / Thiết Bị Thương Mại}$$
- **Mục đích:** Không bóc tách sẽ làm vống Doanh số xưởng lên ảo $\rightarrow$ Quỹ khoán thợ 15% bị chi thừa và định mức vật tư 40% bị tính vống lên, gây thất thoát tiền mặt của Giám Đốc!
  * **Cậu Chiến (Hương Khê):** HĐ 154M $\rightarrow$ Bỏ Cửa & Bàn ghế gỗ thịt 16.5M $\implies$ Doanh số Xưởng Gỗ CN: **137.5M**.
  * **Thắm Minh (Thạch Hưng):** HĐ 87.43M $\rightarrow$ Bỏ Phụ kiện thương mại 8.84M $\implies$ Doanh số Xưởng Gỗ CN: **78.59M**.
  * **Anh Tuấn (TP Hà Tĩnh):** HĐ 111.8M $\rightarrow$ Bỏ Thiết bị bếp Hafele 14.8M $\implies$ Doanh số Xưởng Gỗ CN: **97.0M** (T9 tiến độ 60% = **58.2M**).
  * **Anh Hào (Kỳ Anh):** HĐ 100.6M $\rightarrow$ Bỏ Phụ kiện Eurogold 15.2M $\implies$ Doanh số Xưởng Gỗ CN: **85.4M** (100% trong T9).
  * **Nhà Chị Hoa (Thạch Bàn):** Báo giá 227.77M $\rightarrow$ Bỏ Giường ngủ sồi Nga 1m8 (22M) + Bỏ Thiết bị Grandx (16.85M) & PK Huge (12.39M) $\implies$ Doanh số Xưởng Gỗ CN: **176.54M** (HĐ Đợt 1 ký 145M: Xưởng gỗ CN 115M, Phụ kiện 30M).

### 8.2. NGUYÊN TẮC SỐNG CÒN: TÁCH BẠCH "XƯỞNG KHOÁN" VÀ "DỮ LIỆU VẬT TƯ THỰC TẾ":
> [!WARNING]
> **TUYỆT ĐỐI KHÔNG ĐƯA CON SỐ "KHOÁN 40%" VÀO DANH MỤC VẬT TƯ ĐẶT HÀNG THỰC TẾ!**
1. **Cơ chế khoán 40% (CCSC):**
   - Chỉ dùng trên Báo Cáo Tài Chính Quản Trị CCSC để tính chi phí định mức AU ($=\text{Doanh số xưởng} \times 40%$) nhằm quản trị lợi nhuận của BGĐ.
2. **Dữ liệu Đặt Hàng Vật Tư Thực Tế (PO / Zalo):**
   - Giám Đốc cần **DỮ LIỆU ĐẶT HÀNG THỰC TẾ TỪ CÁC NHÀ CUNG CẤP** (Lam Giang, Cường Thịnh, Hafele, Kính Việt Nhật, Gỗ NT Cầu Vượt, ALD...).
   - Đặt bao nhiêu thì ghi đúng bấy nhiêu theo hóa đơn / tin nhắn Zalo:
     * **Chị Hiển:** Phiếu đặt thực tế `PO-2026-0801` gồm 45 tấm ván HMR Thái Lan MS 388 Lam Giang: **18,900,000 đ**.
     * **Chị Phượng:** Đơn đặt thực tế ván Lam Giang + Phụ kiện Hafele/Eurogold/Blum: **21,559,000 đ**.
     * **Anh Tuấn:** Phiếu đặt thực tế `PO-2026-0902` gồm 28 tấm ván Melamine Cường Thịnh: **11,760,000 đ**.
     * **Anh Hào:** Phiếu đặt thực tế trên Zalo: Nẹp Lam Giang + Bản lề Taura + Thùng gạo + Giá xoong nồi Eurogold: **9,670,000 đ**.
     * **Nhà Anh Công:** Đơn đặt ván & nẹp Lam Giang ngày 30/10/2026 (`DH29767`): **11,935,000 đ**.
     * **Gỗ NT Cầu Vượt:** Đơn trả hàng `SON00337` ngày 23/10: **-750,000 đ** (Công nợ hiện tại: 82.065.000 đ).
   - Công trình nào trong quá khứ đã quyết toán xong từ tháng 8 mà không có đơn trên Zalo (như Cậu Chiến, Thắm Minh), tuyệt đối **KHÔNG ĐƯỢC TỰ BỊA RA MÃ ĐƠN ẢO TỪ CON SỐ KHOÁN 40%**!


### 8.3. BẢN ĐỐI SOÁT CHI TIẾT 3 NHÀ CUNG CẤP VẬT TƯ NĂM 2026 (CẬP NHẬT ĐẾN 04/11/2026):
> [!IMPORTANT]
> **DỮ LIỆU ĐỐI SOÁT CHUẨN XÁC 100% TỪ HỆ THỐNG ZALO PC, SỔ NỢ KẾ TOÁN & ỦY NHIỆM CHI NGÂN HÀNG:**

1. **Tổng Kho Ván Lam Giang (Lam Giang - Group `g6116598459303638566`):**
   - **Chốt công nợ đến 31/10/2026:** **164,330,250 đ** (Khớp chính xác dòng 509 file Excel đối soát T1-T10).
   - **Đợt thanh toán ngày 02/11/2026:** Chị Lưu Thị Kim Dung xuất quỹ VietinBank chuyển khoản trả Lam Giang: **-16,838,000 đ** (Lúc 16:35, STK TCB 10052288, Mã GD: `6306ICBVC2RYWMIZ`).
     $\\rightarrow$ Dư nợ sau ngày 02/11: **147,492,250 đ**.
   - **Phát sinh ngày 04/11/2026 (Hôm nay):** 
     * Đơn đặt hàng `DH29930` (B80): 1 tấm ván HMR DWS 17 2M 201T (446k) + cước xe (50k) = **496,000 đ**.
     * Hoàng Công Vũ đã tự chuyển khoản Techcombank thanh toán dứt điểm lúc 14:33: **-496,000 đ** (Mã GD: `FT26308882300013`). Đơn này không tăng nợ gối đầu!
   - $\\implies$ 💎 **TỔNG CÔNG NỢ LAM GIANG HIỆN TẠI (04/11/2026):** **147,492,250 đ** (Đã giảm 16.838M so với 31/10).

2. **Phụ Kiện Quốc Tâm (Tâm Quốc - Group `g495486322416346660` | ĐC: 56 Ngô Đức Kế, TP Hà Tĩnh):**
   - **Trích lục Sổ tay nợ viết tay kế toán Quốc Tâm (Trang 295 & 296):**
     * Dư nợ cũ ngày 29/10: 35,485,000 đ.
     * Phát sinh 31/10 & 02/11: +770k (HĐ 006535) + 125k + 3.15M + 1.39M = +5,435,000 đ $\\implies$ Tổng nợ chạm đỉnh: **40,920,000 đ**.
     * **Đợt thanh toán ngày 02/11/2026:** Chị Lưu Thị Kim Dung chuyển khoản VietinBank trả chủ tiệm Phan Thị Lan (STK VIB 972672963): **-15,000,000 đ** (Lúc 16:37, Mã GD: `6306ICBVC2RYWUKN`).
     $\\implies$ Dư nợ chốt ngày 02/11: **25,920,000 đ** (Khớp đúng dòng chữ tay "Còn nợ: 25.920" trên trang 296).
   - **Phát sinh ngày 04/11 & 05/11/2026:**
     * Ngày 04/11: Hóa đơn bán lẻ viết tay (số 4/11): Mua 2 cuộn Led 10m TT (85k/cuộn) = **+170,000 đ**.
     * Ngày 05/11: Hóa đơn bán lẻ viết tay (ngày 5/11): Mua 5 Khóa sập (50k) + 1 Ray 2m (30k) = **+80,000 đ** (Người bán ký: Hảo).
   - $\\implies$ 💎 **TỔNG CÔNG NỢ QUỐC TÂM HIỆN TẠI (05/11/2026):** **26,170,000 đ** (An toàn dưới hạn mức 30M).

3. **Đặt Cánh Acrylic NTD / ALD (Cánh phủ Acrylic bóng gương dán No-Line):**
   - **Nhà Chị Hoa (VT-16, PO-1002):** 11.1 md cánh noline tủ bếp trên & dưới x 1.1M = **12,210,000 đ** (Đã xuất xưởng).
   - **Shophouse Vinhomes Anh Minh (VT-55, PO-1015):** 18.2 m2 cánh noline trắng sứ chống trầy x 1.25M = **22,750,000 đ** (Đang chờ giao).
   - $\\implies$ 💎 **Tổng giá trị đặt cánh Acrylic NTD/ALD:** **34,960,000 đ**.

4. **Tổng hợp giải ngân thanh toán vật tư đợt đầu tháng 11/2026 (01/11 - 04/11):**
   - Ngày 02/11: Dung xuất quỹ trả Lam Giang: **16,838,000 đ** (VietinBank).
   - Ngày 02/11: Dung xuất quỹ trả Quốc Tâm: **15,000,000 đ** (VietinBank).
   - Ngày 04/11: Hoàng Công Vũ tự CK trả Lam Giang: **496,000 đ** (Techcombank).
   - $\\implies$ **Tổng số tiền đã trả nhà cung cấp:** **32,334,000 đ** (Giúp giảm mạnh tổng dư nợ 3 NCC từ 235.54M xuống còn 208.54M).

---
