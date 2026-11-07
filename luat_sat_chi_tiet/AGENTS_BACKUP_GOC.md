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

## 17. QUY CHUẨN PHÂN HỆ DỰ TOÁN NHÀ Ở, KHỞI TẠO DỰ ÁN & QUẢN LÝ TƯ LIỆU BÁO GIÁ CHO SALE (HIỆP & DŨNG)
> [!IMPORTANT]
> **CHỈ ĐẠO CỦA GIÁM ĐỐC: TỰ ĐỘNG HÓA DỰ TOÁN NHÀ Ở, ĐÍNH KÈM TƯ LIỆU 3D VÀ BÓC TÁCH LÀM CĂN CỨ ĐẶT HÀNG CHO XƯỞNG:**
- **Phân Hệ Web App Trực Tuyến:** [Dự Toán & Tạo Dự Án Mới](http://localhost:8080/index.html#du-toan-du-an)
- **File Excel Mẫu Dự Toán Chuẩn Gốc (BS Duẩn 345 Triệu):** [MAU_DU_TOAN_BAO_GIA_NOI_THAT_PHU_GIA.xlsx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/MAU_DU_TOAN_BAO_GIA_NOI_THAT_PHU_GIA.xlsx)
- **Quy Chuẩn 4 Bước Vận Hành Sale & Kỹ Thuật:**
  1. *Khởi tạo dự án & Tải tư liệu:* Tống Trần Hiệp hoặc Đường Việt Dũng khởi tạo dự án nhà mới trên Web App, tải lên file dự toán Excel, ảnh hiện trường/phối cảnh 3D và file bóc tách kỹ thuật CAD/G-Code làm tư liệu số tập trung.
  2. *Bộ tính dự toán nhà ở tự động:* Tích hợp đầy đủ bảng đơn giá chuẩn Phú Gia (Tủ bếp trên Melamine 2.1M, Acrylic No-line 3.05M; Tủ bếp dưới nhựa Picomat 2.5M; Tủ áo 2.0M - 3.7M; Giường 5.5M - 5.7M; Vách nan/CNC 1.3M - 1.5M; Phụ kiện Huge/Eurogold...). Tự động tính khối lượng theo kích thước (Dài x Sâu x Cao).
  3. *Nguyên tắc bóc tách làm căn cứ đặt hàng cho Xưởng (Vũ):*
     $$\mathbf{Doanh\ số\ Xưởng\ Gỗ\ CN\ (woodVal)} = \mathbf{Tổng\ Dự\ Toán} - \mathbf{Phụ\ Kiện\ Thương\ Mại} - \mathbf{Gỗ\ Thịt\ Đồ\ Rời}$$
     $\implies$ Hoàng Công Vũ bắt buộc căn cứ vào con số `woodVal` này để lập đơn PO vật tư: Định mức vật tư xưởng không được vượt quá **$40\%$** và quỹ khoán thợ không vượt quá **$15\%$**.
  4. *Xuất bản báo giá khách hàng:* Tạo báo giá in A4 chuyên nghiệp có pháp nhân PG Home Luxury, hotline 0916 321 186, điều khoản tạm ứng 3 đợt (50% - 40% - 10%) và bảo hành 24 tháng.

---

## 18. 10 QUY CHUẨN TỐI THƯỢNG KÉO DỮ LIỆU ZALO TỰ ĐỘNG & BẢO VỆ DÒNG TIỀN DOANH NGHIỆP
> [!IMPORTANT]
> **CHỈ ĐẠO ĐẶC BIỆT CỦA GIÁM ĐỐC NGUYỄN VIẾT NGHĨA - BẮT BUỘC TUÂN THỦ VĨNH VIỄN 100%:**

1. **Quy chuẩn 1 (Độc quyền Dữ liệu Gốc):** Mọi số liệu chi nợ và lương thợ bắt buộc xuất phát từ bằng chứng Zalo gốc (ảnh hóa đơn bán lẻ, phiếu xuất kho, ủy nhiệm chi ngân hàng). Tuyệt đối cấm dùng báo cáo tự vẽ của cấp dưới.
2. **Quy chuẩn 2 (Đối soát 3 Lớp Chéo):** Hợp lệ = `[Ảnh hóa đơn thật]` + `[Xác nhận trên nhóm Zalo NCC]` + `[Ủy nhiệm chi ngân hàng khớp số tiền]`. Thiếu 1 trong 3 lập tức treo không xuất tiền.
3. **Quy chuẩn 3 (Vận hành Ngầm Zero-Disruption):** Daemon quét Zalo chạy ở độ ưu tiên `IDLE`, CPU < 0.5%, tuyệt đối không cướp chuột, không giật màn hình của Giám Đốc. Tự động Pause khi Giám Đốc trực tiếp mở Zalo và Resume khi thu nhỏ.
4. **Quy chuẩn 4 (Chốt Nợ Tức Thời 60 Phút):** Hóa đơn phát sinh dù nhỏ (như đơn Quốc Tâm 80k ngày 05/11) phải cập nhật vào sổ nợ trong tối đa 60 phút, không dồn cuối tháng.
5. **Quy chuẩn 5 (Bóc tách Tự động woodVal):** Hợp đồng mới phải bóc tách ngay `woodVal` (xưởng gỗ CN) và `pkVal` (phụ kiện). Nghiêm cấm tính khoán 40% vật tư và 15% thợ trên đồ thương mại hay gỗ tự nhiên.
6. **Quy chuẩn 6 (Kiểm soát Tự động Mã QR & STK Ngân Hàng):** Mọi chuyển khoản thanh toán nợ phải khớp đúng STK đã đăng ký (Lam Giang: TCB 10052288; Quốc Tâm: VIB 972672963). Cấm chuyển vào tài khoản cá nhân nhân viên.
7. **Quy chuẩn 7 (Báo Công Voice Note & Khung Giờ Vàng):** Thợ báo công sáng trước 08:00, báo tăng ca OT trước 21:00. Báo trễ 24h không duyệt tính 0 công. Tin nhắn thoại voice note được mô hình Whisper phiên âm tự động.
8. **Quy chuẩn 8 (Đóng băng Khóa Sổ Dữ Liệu Lịch Sử):** Dữ liệu tài chính T8 và T9 đã quyết toán là bất khả xâm phạm (Read-only). Cấm sửa đổi hồi tố.
9. **Quy chuẩn 9 (Treo Quỹ Vượt Mức & Phụ Cấp Cuối Năm):** Phụ cấp trách nhiệm 20k/công của thợ cả Hòa, Hào và thưởng doanh số >500M của Thái, Vũ, Hiệp tuyệt đối không chi tiền mặt hàng tháng, toàn bộ dồn quyết toán lương thưởng Tết Nguyên Đán khi công nợ thu hồi $\ge 85\%$.
10. **Quy chuẩn 10 (Cảnh Báo Đỏ Red Alert Tự Động):** Kích hoạt cảnh báo đỏ trực tiếp tới Giám Đốc khi nợ vượt trần an toàn (Quốc Tâm > 30M, Lam Giang > 180M), phát hiện đơn đặt hàng chưa có dấu đỏ duyệt, hoặc quỹ thợ âm vượt định mức 15%.


---

## 19. 40 QUY CHUẨN THỐNG KÊ CHÍNH XÁC 100% THEO CHỈ ĐẠO CỦA GIÁM ĐỐC
> [!IMPORTANT]
> **CHỈ ĐẠO SỐNG CÒN CỦA GIÁM ĐỐC NGUYỄN VIẾT NGHĨA:**  
> *"Không cần làm những việc xa vời, chỉ cần THỐNG KÊ ĐÚNG CHO TAO LÀ ĐƯỢC - Tìm 40 cải tiến để thống kê chính xác, bổ sung vào và tối ưu SOP."*

### A. Thống kê Vật tư & Công nợ Nhà cung cấp (10 Quy chuẩn):
1. **Lam Giang:** Cuốn chiếu từng đơn: Sổ 31/10 (164.33M) - UNC 02/11 (16.838M) = 147.492.250 đ. Đơn 496k Vũ đã tự CK Techcombank không tính vào nợ gối đầu. Dư nợ chuẩn: **147.492.250 đ**.
2. **Quốc Tâm:** Trích lục sổ tay kế toán T296: Nợ 40.92M - UNC 02/11 (15M) = 25.92M + HĐ 04/11 (170k) + HĐ 05/11 (80k) = **26.170.000 đ** (dưới hạn mức 30M an toàn).
3. **Cánh Acrylic ALD:** Theo kích thước bóc tách: Nhà Chị Hoa (11.1 md x 1.1M = 12.21M) + Vinhomes Anh Minh (18.2 m2 x 1.25M = 22.75M) = **34.960.000 đ**.
4. **Đơn trả hàng:** Gỗ NT Cầu Vượt SON00337 trừ -750k: Dư nợ chuẩn **82.065.300 đ**.
5. **Kính VSG:** Đọc tự động file PDF: Kính sóng 8mm temper 4 tấm tổng 3.77 m2 = **2.776.800 đ**.
6. **Mã màu catalogue:** Thống kê theo mã ván: MS 388 Thái (45 tấm), MS 612 EV Cường Thịnh (28 tấm), DWS 17 2M 201T (1 tấm).
7. **Nẹp chỉ dán cạnh:** Thống kê theo số cuộn và mét dài (cuộn 290k Lam Giang, nẹp đôi DH29767 Anh Công 7 cuộn).
8. **Phụ kiện kim khí:** Thống kê chi tiết từng chiếc bản lề (Hafele 28k, Taura 26k, DTC 18k, QT 10k), ray bi 3 tầng (Hafele 95k, DTC 115k), tay nâng Blum HF25 (3.45M).
9. **Tỷ lệ Cost Vật tư PO:** CostRate = Tổng PO / woodVal công trình (Chị Hiển 14.56%, Anh Tuấn 12.12%, Anh Hào 11.32%).
10. **OCR hóa đơn Zalo:** Tự động đọc ảnh `_n.jpg` bóc tách Tên hàng, Số lượng, Đơn giá, Còn nợ.

### B. Thống kê Chấm công & Quỹ lương thợ (8 Quy chuẩn):
11. **Tách bạch 2 chỉ số:** Công hành chính HC (1, 0.5, P, K) và Giờ tăng ca OT (1h, 1.5h, 2h, 2.5h, 3h). Cấm quy đổi gộp.
12. **Đơn giá công nhật chuẩn:** Hòa 530k/ngày (OT 99.375k/h); Hào 450k/ngày (OT 84.375k/h); Thoan 450k/ngày; Văn Anh 400k/ngày; Tuấn Anh 350k/ngày.
13. **Loại trừ 100% phụ cấp trách nhiệm 20k/công:** Bảng lương thực lĩnh hàng tháng tuyệt đối không cộng 560k của Hòa hay 600k của Hào. Phụ cấp trách nhiệm = 0 đ.
14. **Quỹ lương thợ thực chi (Col AV):** T8 = **41.285.625 đ**; T9 = **44.052.188 đ**; Tổng 2 tháng = **85.337.813 đ**.
15. **Thâm hụt quỹ khoán thợ 15%:** T8 âm -4.98M; T9 âm -0.88M; Lũy kế âm **-5.862.642 đ** $\implies$ Khóa Col BG = 0 đ.
16. **Lương quản lý xưởng thực tế (Col AD):** Thái + Vũ: T8 = **19.615.385 đ**; T9 = **20.250.000 đ**.
17. **Quân số có mặt hôm nay:** Đếm chính xác 7 thợ xưởng + 2 văn phòng (Hiệp, Dũng). Xóa vĩnh viễn 4 người nghỉ (Lực, Hùng, Bình, Tuyết = 0 công).
18. **Vụ án Thoan T10:** Làm đúng 7 công (08/10 - 15/10) + 7h OT = **3.740.625 đ**.

### C. Thống kê Hợp đồng & Doanh số (8 Quy chuẩn):
19. **Bóc tách Doanh số Gỗ CN (woodVal):** Cậu Chiến 137.5M; Thắm Minh 78.59M; Chị Hiển 129.8M; Chị Phượng 42.46M; Anh Tuấn 58.2M (60%); Anh Hào 85.4M. Tổng T8+T9 = **529.834.472 đ**.
20. **Công nợ khách hàng từng đợt:** Chị Hiển nợ 69.8M; Chị Phượng nợ 6.46M; Anh Tuấn nợ quá hạn 61.8M; Anh Hào nợ 0 đ; Chị Hoa nợ 58M; Anh Công nợ 35M.
21. **Tỷ lệ thu hồi công nợ:** Chỉ xét thưởng vượt mức khi tỷ lệ thu hồi tháng $\ge 85\%$.
22. **Hoa hồng thực tế:** Hiệp (Col W: T8 = 9.5M, T9 = 13.5M); Dũng (Col AA: T8 = 10.5M, T9 = 9.87M).
23. **Doanh thu & Lãi phụ kiện (Col BI):** T8 = 8.84M (lãi 30% = 2.652.000 đ); T9 = 30M (lãi 30% = 9.000.000 đ). Tổng lãi phụ kiện = **11.652.000 đ**.
24. **Phân loại 3 nguồn doanh thu:** Xưởng Gỗ CN, Gỗ tự nhiên, Phụ kiện thương mại & Sofa đồ rời.
25. **Thống kê nợ quá hạn (Aging):** Phân loại nợ $\le 15$ ngày, 16-30 ngày, $> 30$ ngày (Anh Tuấn quá hạn 61.8M).
26. **Tiến độ thi công xưởng:** Thống kê % hoàn thành thực tế từng nhà (Hiển 80%, Phượng 95%, Tuấn 60%, Hào 100%, Hoa 40%).

### D. Thống kê Chi phí Vận hành & Dòng tiền (8 Quy chuẩn):
27. **Ban Lãnh Đạo (Col G):** Cố định **12.000.000 đ/tháng**.
28. **Marketing & Ads (Col R):** Cố định **12.000.000 đ/tháng** (Lương MKT 6M + Ads 6M).
29. **BHXH 6 nhân sự (Col BB):** Cố định **6.600.000 đ/tháng** (1.1M/người cho Thái, Vũ, Hiệp, Dũng, Nghĩa, Hào).
30. **Mặt bằng Showroom & Xưởng (Col E):** Cố định **13.000.000 đ/tháng** (Showroom 6M + Xưởng 7M).
31. **Hành chính nhân sự (Col AG):** T8 = 4.000.000 đ; T9 = 4.500.000 đ.
32. **Biến phí xưởng:** Xe tải 1.5% + Điện nước 1.5% + Bảo hành 1.0% theo Doanh số xưởng.
33. **Sao kê VietinBank thanh toán NCC:** Trích lục lệnh CK ngày 02/11: Lam Giang 16.838M + Quốc Tâm 15M = **31.838.000 đ**.
34. **Cân đối dòng tiền hàng ngày:** Tiền mặt tại két + Số dư tài khoản VietinBank/Techcombank = Khớp nhật ký thu chi trong ngày.

### E. Thống kê Báo cáo CCSC & Lợi nhuận Ròng BGĐ (6 Quy chuẩn):
35. **Tổng Chi Phí Hệ Thống (Col BC):** T8 = **235.003.760 đ**; T9 = **262.391.990 đ**; Tổng = **497.395.751 đ**.
36. **Lợi Nhuận Văn Phòng Gỗ (Col BD):** T8 = **7.047.945 đ**; T9 = **25.390.777 đ**; Tổng = **32.438.721 đ**.
37. **Lợi Nhuận Xưởng 2.2% (Col BG):** T8 = **0 đ**; T9 = **0 đ**; Tổng = **0 đ** (Do âm quỹ khoán thợ).
38. **Lợi Nhuận Phụ Kiện (Col BI):** T8 = **2.652.000 đ**; T9 = **9.000.000 đ**; Tổng = **11.652.000 đ**.
39. 💎 **TỔNG LỢI NHUẬN RÒNG BỎ TÚI BGĐ:**
    * Tháng 8/2026: **9.699.945 đ**
    * Tháng 9/2026: **34.390.777 đ**
    * **TỔNG CỘNG 2 THÁNG:** **44.090.721 đ**
40. **Tự động đối soát chéo 3 chiều:** Hệ thống kiểm tra liên tục $\Delta_1$ (Doanh số xưởng), $\Delta_2$ (Công thợ), $\Delta_3$ (Công nợ 3 NCC = 208.622.250 đ). Lệch phát hiện trong 10 giây.


---

## 20. 50 NGUYÊN TẮC KỶ LUẬT THÉP CHỐNG LÀM ẨU - CHỐNG TÔ HỒNG - CHỐNG BỐC PHÉT - CHỐNG CHỐNG CHẾ
> [!IMPORTANT]
> **CHỈ ĐẠO ĐẶC BIỆT CỦA GIÁM ĐỐC NGUYỄN VIẾT NGHĨA - BẮT BUỘC TUÂN THỦ VĨNH VIỄN 100%:**  
> *"Mày làm ẩu đề xuất 50 giải pháp chống làm ẩu, suy nghĩ kỹ trước khi làm, chống tô vẽ tô hồng sự thật, bịa mock bốc phét chống chế,... làm ngay và bổ sung tối ưu SOP."*

1. **Syntax Gate:** Bắt buộc chạy `node -c` kiểm tra cú pháp file JS trước khi báo cáo.
2. **Runtime Test:** Bắt buộc chạy script giả lập `test_all_renders.js` thử nghiệm toàn bộ 17 hàm render.
3. **Zero Blind Regex:** Cấm thay thế chuỗi tự động diện rộng trên file mã nguồn lớn.
4. **DOM-Nav Sync Gate:** Mọi menu nav phải có section tương ứng đúng class `tab-pane`.
5. **HTTP Content Audit:** Kiểm tra HTTP 200 kèm độ dài dữ liệu trả về `Length > 0`.
6. **Auto Cache-Busting:** Sửa code là phải bump `CURRENT_APP_VERSION` và `CACHE_NAME`.
7. **Diff Review Gate:** Rà soát khác biệt mã nguồn trước khi ghi đè file.
8. **Single Source of Truth:** Không tạo biến mảng dữ liệu trùng lặp.
9. **Automated Test Suite:** Chạy lại kịch bản kiểm định 2 vòng trước khi kết luận hoàn thành.
10. **Never Silence Errors:** Cấm dùng khối `try {} catch {}` rỗng nuốt chửng lỗi.
11. **Zero Mock Policy:** Bảng biểu chưa có số liệu thật thì để trạng thái Trống, cấm bịa mock làm đẹp giao diện.
12. **Bằng chứng Hóa đơn là Tối thượng:** Chi phí và nợ phải có chứng từ gốc (ảnh hóa đơn Zalo, UNC).
13. **Bóc tách woodVal từ đầu:** Phải trừ gỗ thịt và phụ kiện thương mại trước khi tính khoán xưởng.
14. **Immutable Past Ledger:** Số liệu T8 và T9 đã quyết toán là bất khả xâm phạm.
15. **Chuẩn xác từng đồng:** Giữ nguyên số lẻ (44.090.721 đ), không làm tròn số tùy tiện.
16. **Khóa 9 nhân sự thực tế:** 7 thợ + 2 văn phòng. 4 người nghỉ (Lực, Hùng, Bình, Tuyết) xóa vĩnh viễn.
17. **Xác thực NCC chuẩn:** Nợ gắn với STK thật (Lam Giang TCB 10052288, Quốc Tâm VIB 972672963).
18. **Từng nhân sự độc lập:** Cấm lấy công người này đắp sang người khác (Thoan T10 đúng 7 công + 7h OT = 3.740.625 đ).
19. **Tách bạch Kế hoạch & Thực tế:** Tháng 10-12 nếu là số kế hoạch phải ghi rõ "Kế hoạch".
20. **Garbage Collection:** Quét dọn tệp rác và biến tạm định kỳ.
21. **Cấm mỹ từ sáo rỗng:** Cấm dùng từ "đẳng cấp thế giới", "đột phá", "ánh kim lộng lẫy".
22. **Nói dưới sự thật:** Báo cáo bằng số liệu thô và bằng chứng, không tô hồng thành tích.
23. **Nhận lỗi ngay trong câu đầu tiên:** Có lỗi phải nhận ngay, giải thích nguyên nhân kỹ thuật và cách sửa trong 1 phút.
24. **No Excuses Policy:** Cấm đổ lỗi cho hoàn cảnh, trình duyệt, hay hệ điều hành.
25. **Báo cáo trung thực âm quỹ & nợ đọng:** Âm -5.86M báo âm, nợ 147.49M báo nợ, quá hạn báo quá hạn.
26. **Xưng hô chuẩn mực:** AI luôn xưng "em" và gọi "Giám Đốc" hoặc "Anh". Cấm xưng "bố - con".
27. **Chuẩn bị sẵn giải pháp:** Phát hiện vấn đề phải chuẩn bị sẵn phương án xử lý trước khi trình.
28. **Độc lập đối soát chéo:** Không tin báo cáo miệng của cấp dưới, đối chiếu lại Zalo và sao kê.
29. **Đi thẳng vào số liệu:** Báo cáo ngắn gọn, súc tích, cắt bỏ mọi lời dạo đầu thừa thãi.
30. **Post-Mortem Record:** Ghi nhận nhật ký sự cố để rút kinh nghiệm vĩnh viễn.
31. **Think Before Execute:** Dừng lại 10 giây tự vấn rủi ro trước khi ghi đè file hệ thống.
32. **Mô hình 5 Chiều Quản trị:** Nguồn gốc $ightarrow$ Động cơ $ightarrow$ Kỹ thuật $ightarrow$ Đối soát chéo $ightarrow$ Dòng tiền BGĐ.
33. **Minimal Blast Radius:** Chỉ sửa đúng vùng mã nguồn cần thiết, không viết lại file lớn.
34. **Red Teaming:** Đóng vai người dùng khó tính nhất để thử nghiệm tình huống biên.
35. **Dependency Tracing:** Sửa 1 hàm phải rà soát toàn bộ các nơi đang gọi hàm đó.
36. **Tách biệt Scratch & Production:** Code thử nghiệm viết trong `scratch/`, test sạch mới đưa vào `web_app/`.
37. **Rollback Plan:** Luôn lưu bản backup trước khi sửa đổi lớn để có thể lùi bước trong 30 giây.
38. **Kiểm tra 3 vai trò:** Test giao diện trên cả ADMIN, XUONG_VATTU, VANPHONG_SALE.
39. **Self-Documenting Code:** Đặt tên biến và hàm tường minh, phản ánh đúng nghiệp vụ.
40. **Self-Audit Gate:** Chạy kiểm định tự động lấy bằng chứng trước khi khẳng định hoàn thành.
41. **Dấu Đỏ Điện Tử:** Chỉ nhập hàng khi phiếu PO có dấu đỏ của Giám Đốc Nghĩa.
42. **3 Đợt Thép thu tiền:** Cọc 40% mới ra ván; Thu tiếp 40% khi hạ hàng tại công trình; Thu nốt 20% sau nghiệm thu.
43. **Treo thưởng Tết:** Thưởng doanh số >500M và 20k/công trách nhiệm dồn về Tết mới quyết toán khi công nợ $\ge 85\%$.
44. **Khóa Col BG = 0:** Quỹ thợ 15% âm thì Lợi nhuận xưởng Col BG = 0 đ tuyệt đối.
45. **Chi tiền có phiếu chi:** Chi từ 20k cũng phải ghi sổ, lệch 1k két sắt cũng phải tìm nguyên nhân.
46. **Biên bản nghiệm thu 10 điểm:** Bàn giao phải ký xác nhận 100% không xước mới hết trách nhiệm bề mặt.
47. **Blacklist nợ xấu:** Nợ quá hạn >30 ngày tự động khóa tạo hợp đồng mới.
48. **Kiểm toán ngày 15 và cuối tháng:** AI và Kế toán đối chiếu `[Sao kê ngân hàng]` $\longleftrightarrow$ `[Sổ nợ NCC]` $\longleftrightarrow$ `[Chấm công thợ]`.
49. **Privacy Shield:** Lợi nhuận mặc định che mờ, phím `P` và nút Mắt độc quyền Giám Đốc.
50. **SOP là Bất Khả Xâm Phạm:** 50 quy chuẩn này là kỷ luật thép vĩnh viễn, vi phạm xử lý ngay.

---

## 21. BẢNG TỔNG KẾT RÀ SOÁT TOÀN BỘ CÁC LỖI LỊCH SỬ & 6 CHỐT CHẶN TỰ ĐỘNG CHỐNG TÁI PHẠM
- **12 Lỗi Cốt Tử Đã Rà Soát & Triệt Tiêu 100%:**
  1. Lỗi đơ app cú pháp tại line 399 `app.js` -> Khôi phục chuẩn, `node -c` mã 0.
  2. Lỗi comment nhầm cấu trúc 4 mảng (`contracts`, `users`, `supplierDebts`, `zaloSupplierGroups`) -> Khôi phục sạch.
  3. Lỗi section sai class `tab-content` -> Chuẩn hóa 100% `tab-pane`.
  4. Lỗi bịa hợp đồng ảo (Trung Tuyết, Cẩm Xuyên, Shophouse Minh) -> Xóa sạch, chỉ giữ 5 HĐ thực tế.
  5. Lỗi 11 mã PO ảo -> Xóa vĩnh viễn, chỉ giữ PO Zalo/hóa đơn thật.
  6. Lỗi mock dự toán 17 món đồ nội thất (BS Duẩn 345M) -> Khởi tạo rỗng `[]`, sẵn sàng bóc tách thực tế.
  7. Lỗi Thoan 27 công T10 -> Khóa cứng 7 công thực tế 3.740.625 đ.
  8. Lỗi 4 nhân sự đã nghỉ việc (Lực, Hùng, Bình, Tuyết) -> Loại trừ vĩnh viễn khỏi toàn hệ thống.
  9. Lỗi rò rỉ phụ cấp 20k/công (Hòa 560k, Hào 600k) vào thực lĩnh hàng tháng -> Khóa cứng = 0 đ, treo dồn về Tết.
  10. Lỗi tính ảo lợi nhuận Col BG 2.2% khi âm quỹ thợ -> Khóa cứng Col BG = 0 đ, lợi nhuận ròng đúng 44.090.721 đ.
  11. Lỗi bốc phét, tô hồng ("đẳng cấp thế giới", "ánh kim lộng lẫy", shimmer) -> Xóa sạch 100%.
  12. Lỗi cache cũ của trình duyệt -> Nâng cấp `CURRENT_APP_VERSION = "2026.11.05_v20_CLEAN_DATA_FIXED"` và SW Cache `pghome-v9-stable-fixed`.
- **6 Cổng Chốt Chặn Bắt Buộc Trước Khi Xuất Báo Cáo:**
  * Cổng 1: `node -c "f:\PG Home - Quản trị\web_app\app.js"` mã 0.
  * Cổng 2: `node "f:\PG Home - Quản trị\scratch\test_all_renders.js"` PASS 17/17.
  * Cổng 3: `python "f:\PG Home - Quản trị\scratch\deep_error_audit.py"` PASS 12/12.
  * Cổng 4: Đồng bộ cache v20 và SW v9.0.
  * Cổng 5: Đối soát chéo 3 chiều Zalo - Sổ sách - Ngân hàng.
  * Cổng 6: Executive Privacy Shield (che giấu tỷ lệ khoán & lợi nhuận) & Stealth Protocol an toàn.

---

## 22. LƯU BỘ NHỚ PHIÊN 06/11/2026: 50 ĐIỂM TỐI ƯU GIAO DIỆN & DANH MỤC LINKS SỐNG TOÀN HỆ THỐNG
- **Phiên bản Web App & Cache:** `CURRENT_APP_VERSION = "2026.11.06_v21_UI_50_OPTIMIZED"`, `CACHE_NAME = "pghome-v10-ui50-optimized"`, CSS/JS `?v=10.0_UI50_OPTIMIZED`.
- **50 Điểm Tối Ưu Giao Diện & Hệ Thống Đã Hoàn Tất & Kiểm Định (`21 PASS / 0 FAIL`):**
  1. **Xóa trùng lặp DOM & HTML rác:** Xóa sạch 9 bản sao thừa của `#compDsXuongVal` (chỉ giữ 1 bản duy nhất tại `#tab-xuong-san-xuat`) và `#bonusPassbookCard` (chỉ giữ 1 bản duy nhất tại `#tab-cham-cong-all`).
  2. **Thu gọn Sổ tay SOP Zalo:** Gỡ bỏ 2 bảng `10 Quy Chuẩn Tối Thượng Kéo Dữ Liệu Zalo` chiếm chỗ tại Dashboard và Phê Duyệt Vật Tư; gom về duy nhất 1 khối `<details>` đóng/mở gọn gàng trong `#tab-sop-quy-trinh` (cân bằng thẻ `8 details = 8 /details`).
  3. **Sửa lỗi lệch cột PO (`#bodyPOList`):** Xóa các dòng HTML tĩnh 8 cột bị lệch với `thead` 7 cột, để `renderPOList()` render chuẩn 7 cột 100%.
  4. **Hệ biến CSS & Tương phản chuẩn Luxury:** Định nghĩa đầy đủ `--gold-main` và `--border-color` cho cả Dark/Light Theme; sửa độ tương phản `.nav-item.active` (chữ `#FCD34D` trên nền tối viền trái `#D4AF37`, loại bỏ lỗi chữ trắng trên nền vàng).
  5. **Thu gọn Sidebar (`74px` Icon-Only) & Topbar Gọn Gàng:** Thêm nút `#sidebarCollapseBtn` lưu trạng thái vào `localStorage` (`pghome_sidebar_collapsed`), gom nhóm nút công cụ vào `.topbar-utility-group`, rút gọn `.zalo-pulse-pill` thành `Zalo v3.0: IDLE`.
  6. **Chuẩn hóa Bảng Số Liệu & In Ấn A4:** Áp dụng `font-variant-numeric: tabular-nums` toàn bộ số tiền/công nợ, ghim cột đầu tiên (`.ccsc-table th:first-child, td:first-child { position: sticky; left: 0 }`), bổ sung `@media print` ẩn toàn bộ thanh điều hướng khi xuất PDF/in A4, và đồng bộ công nợ Quốc Tâm chuẩn `26,170,000 đ` (`26.17M`) tại mọi vị trí.
- **Danh Mục Links Sống Toàn Hệ Thống (Live Links):**
  * **Link Web App Chính (Máy Giám Đốc):** `http://localhost:8080/index.html`
  * **Link Web App Mạng LAN (Điện thoại / iPad cùng Wi-Fi):** `http://192.168.1.3:8080/index.html`
  * **Link Bản In Nội Quy 1 Trang A4 Dán Tường:** `http://localhost:8080/noi_quy_1_trang_a4.html`
  * **Link Tải Trực Tiếp Excel CCSC T8+T9:** `http://localhost:8080/BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx`
  * **Link Tải Trực Tiếp Excel Lương Tháng 10/2026:** `http://localhost:8080/BANG_LUONG_THANG_T10_2026.xlsx`
  * **File Khởi Động Nhanh 1 Chạm (Launcher):** [KHOI_DONG_QUAN_TRI_PG_HOME.bat](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/KHOI_DONG_QUAN_TRI_PG_HOME.bat)

---

## 23. HỆ THỐNG ĐỒNG BỘ NGẦM ZALO V4.0 (STEALTH DELTA-CURSOR & HỘP THƯ DUYỆT NHANH 1 CHẠM)
- **Kiến trúc Stealth Zalo Engine v4.0 ([monitor_all_phu_gia_groups.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/monitor_all_phu_gia_groups.py)):**
  1. **Always-On Passive Disk Read (`0x00000040 IDLE`):** Đọc trực tiếp từ ổ cứng (`%APPDATA%\ZaloData` & `%LOCALAPPDATA%\ZaloPC`) với độ trễ **~100ms - 125ms / chu kỳ 11 nhóm**, hoàn toàn không chiếm chuột, không đụng bàn phím, không giật cửa sổ và **vẫn quét bình thường ngay cả khi Giám Đốc đang mở và gõ phím trên Zalo PC**.
  2. **Cơ chế `Delta-Cursor` ([zalo_seen_cursor.json](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/zalo_seen_cursor.json)):** Lưu danh sách khóa định danh từng tệp (`filename|size|mtime`) để bắt trọn 100% chùm nhiều ảnh hóa đơn gửi cùng lúc, khắc phục triệt để hạn chế chỉ lấy 1 ảnh cuối của phiên bản cũ.
  3. **Băm xác thực `SHA-256` chống trùng lặp:** Mỗi ảnh hóa đơn, ủy nhiệm chi, sổ nợ đều được tính mã băm `SHA-256` 64 ký tự và sao lưu vào `5. Tài liệu\Chứng từ & Hóa đơn Zalo T11-2026\live_cache\` để chặn tuyệt đối việc nhập trùng đơn hàng hoặc tính khống công nợ.
  4. **Độ phủ 11 Nhóm Thực Tế (`588` tệp media, `353` ảnh cache):** Giám sát đồng thời Tổng Kho Ván Lam Giang, Phụ Kiện Quốc Tâm, Xưởng Phú Gia, Gỗ NT Cầu Vượt, Kính Việt Nhật VSG, Ván Cường Thịnh, Xưởng Cường Gỗ Thịt, Hoàng Hà Ceramic, Đá Tấm Than Tre, Kính Gương Phú Gia và Văn Phòng.
  5. **Hộp Thư Duyệt Nhanh 1 Chạm (`#zaloStagingInboxCard`) & 3 API Sống ([server.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/server.py)):**
     - `GET http://localhost:8080/api/zalo-live-inbox`: Trả về trực tiếp danh sách 14 chứng từ Zalo kèm trạng thái chờ duyệt và thông số Telemetry.
     - `POST http://localhost:8080/api/zalo-trigger-scan`: Nút `[⚡ Quét Zalo Ngay (1s)]` trên Web App kích hoạt quét ổ cứng tức thì trong `<150ms`.
     - `POST http://localhost:8080/api/zalo-approve-item`: Nút `[Duyệt & Ghi Sổ]` đóng dấu xác thực của Giám Đốc và ghi vết vào `data/audit_log.jsonl`.

---

## 24. BỘ QUY CHUẨN ĐỊNH MỨC TẤM CẮT CNC & 5 BÀI HỌC XƯƠNG MÁU KHI LÀM BÁO GIÁ - ĐO LƯỜNG (ĐỐI SOÁT TỪ NHÀ ANH NAM 06/11/2026)

### 24.1. BẢNG ĐỊNH MỨC TẤM CẮT CNC CHUẨN THỰC CHIẾN XƯỞNG PG HOME (KHỔ VÁN 1220×2440 = 2.9768 M²/TẤM):
- **1. Tủ bếp dưới (`R09` - Sâu 600 × Cao 860, Thùng cao 740, ĐVT: `Md`):**
  * Định mức chuẩn toàn bộ (Thùng + Hậu + Cánh): **`1.45 tấm / md`** (Nếu tách riêng cánh Acrylic: Thùng + Hậu = **`1.14 tấm/md`** + Cánh = **`0.31 tấm/md`**).
  * Giải thích kỹ thuật: Trừ chân nhựa `100mm` + đá `20mm`, nóc không bịt kín (chỉ đi 2 thanh xà `80mm`), khoang chậu rửa & bếp từ không có đợt ngang. (`3.77 md × 1.45 = 5.47 ≈ 5.5 tấm`).
- **2. Tủ bếp trên (`R08` - Sâu 350 × Cao 750, ĐVT: `Md`):**
  * Định mức: Thùng = **`0.74 tấm / md`** + Cánh = **`0.30 tấm / md`** (Tổng = **`1.04 tấm / md`**) + Hậu 6mm = **`0.28 tấm / md`**.
  * Giải thích kỹ thuật: Sâu `350mm` nên 1 khổ ván rộng `1220mm` xẻ dọc được **3 dải phôi `350mm`** rất lợi ván.
- **3. Tủ bếp kịch trần (`R10` - Sâu 700 × Cao 720, ĐVT: `Md`):**
  * Định mức: Thùng = **`1.15 tấm / md`** + Cánh = **`0.29 tấm / md`** (Tổng = **`1.44 tấm / md`**) + Hậu 6mm = **`0.27 tấm / md`**.
  * Giải thích kỹ thuật: Sâu `700mm` vượt quá nửa khổ ván `610mm`, 1 khổ `1220mm` xẻ được 1 dải `700mm` + 1 dải `500mm` (ghép sang kệ tivi/lavabo).
- **4. Tủ quần áo kịch trần (`R27, R40, R49` - Sâu 600 × Cao 2700, ĐVT: `M²`):**
  * Định mức: **`1.05 tấm ván 17mm / m²`** (Đã gồm Thùng + Đợt + Ngăn kéo + Cánh gỗ) + Hậu 6mm = **`0.36 tấm / m²`**.
  * Lưu ý: 1 khổ ván `1220mm` bổ đôi chuẩn 2 dải `600mm`. Khoang nào lắp **Cánh kính khung nhôm** thì phải trừ ngay **`0.40 tấm ván 17mm / m²` cánh kính**.
- **5. Hộc tủ trang trí nông (`R05` - Sâu 200 × Cao 1850, ĐVT: `M²`):**
  * Định mức: **`0.50 tấm ván 17mm / m²`** + Hậu 6mm = **`0.25 tấm / m²`** (1 tấm `1220mm` xẻ được **6 dải sâu `200mm`**).
- **6. Vách ốp phẳng trang trí (`R06, R23, R25, R34, R43` - Dày 17mm, ĐVT: `M²`):**
  * Định mức: **`0.40 tấm / m²`** (Trừ hao hụt ghép vân & xương lót ~15% còn `2.50 m² thành phẩm / tấm`). Với vách có Lam / Soi huỳnh CNC (`R21, R52`): **`0.52 tấm / m²`**.
- **7. Giường ngủ bo cong không đầu giường (`R33, R42` - 1600×2000 / 1800×2000, ĐVT: `Cái`):**
  * Định mức: **`3.3 – 3.5 tấm / cái`** (Gồm phản giường 2 tấm `1.4 tấm` + 3 vai/đuôi bo cong chập đôi + hệ xương/thang chịu lực `2.0 tấm`).
- **8. Kệ tivi / Bàn học / Bàn phấn treo bo góc (`R04, R24, R36, R39, R46` - Sâu 400–550 × Cao 150–300, ĐVT: `Md`):**
  * Định mức: **`0.55 – 0.65 tấm ván 17mm / md`** + **`0.15 tấm hậu / md`** (đáy ngăn kéo).

### 24.2. NĂM BÀI HỌC XƯƠNG MÁU KHI LÀM BÁO GIÁ, TÍNH ĐỊNH MỨC & ĐO LƯỜNG:
1. **Không bao giờ tính trùng Cánh vào Thùng & không lấy chiều cao phủ bì nhân bừa:** Phải trừ chân nhựa `100mm`, trừ mặt đá, trừ tấm nóc rỗng của tủ bếp dưới, trừ diện tích cánh kính trên tủ áo và khoang rỗng nhét tủ lạnh/máy giặt.
2. **Bắt buộc phân biệt Chiều Sâu (`R`) khi quy đổi từ `M² / Md` sang Số Tấm Ván:** Cùng `1 m²` mặt đứng nhưng `R=17mm` (`0.40 tấm/m²`), `R=200mm` (`0.50 tấm/m²`), `R=350mm` (`0.74 tấm/md`), `R=600mm` (`1.05 tấm/m²`), `R=700mm` (`1.15–1.35 tấm/m²`).
3. **Quy tắc Đo lường "Trừ Giao Cắt & Khấu Trừ Lỗ Mở":** Khi đo mảng tường ốp lớn (`R06`: `15.6 m²`) có gắn đè hệ tủ trang trí (`R05`: `8.51 m²`), hoặc hệ tủ áo lớn (`R27`: `13.82 m²`) có khoét lỗ cửa giấu khuôn (`R29`: `1.61 m²`), khối lượng cột `H` phải trừ phần giao cắt và ghi chú rõ vào cột Quy cách.
4. **Quy tắc Định giá 3 Cấp Vật Liệu (`An Cường` $\leftrightarrow$ `Thái Lan` $\leftrightarrow$ `Plywood A1`):** Giữa An Cường và Thái Lan chỉ chênh tiền phôi ván gỗ `~380.000 đ/tấm`, trong khi Nhựa đặc WPB An Cường (`2.550.000 đ/tấm`), Cánh Acrylic Noline, Phụ kiện, Kính, Da bọc và Công thợ là cố định 100%. Do đó cột Thái Lan chỉ được giảm tương ứng phần chênh phôi ván (`~12%–14%`), không giảm sâu ở các hạng mục có Cánh Acrylic hoặc Nhựa WPB.
5. **Chốt Chặn 54% Trước Khi Xuất Báo Giá:** Lấy `(Tổng Vật Tư Thực Tế + Tổng Công Thợ Dự Kiến) / Tổng Doanh Thu Báo Giá`. Nếu $\le 54\%$ thì chắc chắn đạt **Lợi nhuận ròng `18% – 20%`** bỏ túi Giám Đốc.

---

## 25. QUY CHẾ ĐIỀU HÀNH ĐỘI QUÂN SUB-AGENT (4 KỶ LUẬT THÉP CỦA TỔNG CHỈ HUY - BẮT BUỘC TUÂN THỦ 100%)
Khi TỔNG CHỈ HUY (Kiến trúc sư trưởng & Giám sát nghiệm thu) gọi các Sub-Agent công nhân bằng `invoke_subagent` với `Model="flash"` (Gemini 3.8 Flash), bắt buộc áp dụng 4 kỷ luật thép sau:
1. **KHOANH VÙNG ĐỘC LẬP (1 CÔNG NHÂN = 1 KHOẢNH ĐẤT RIÊNG):**
   - Khi giao việc trong `Prompt` cho từng công nhân Flash, phải chỉ đích danh danh sách file/thư mục nó ĐƯỢC PHÉP đọc và sửa.
   - Ra lệnh rõ cho mỗi công nhân: *"TUYỆT ĐỐI CẤM đọc, sửa, hoặc chạy lệnh chạm vào bất kỳ file nào ngoài danh sách được giao để không giẫm chân công nhân khác."*
   - Nếu công việc chỉ là tìm kiếm, đọc log, tra cứu dữ liệu: Bắt buộc gọi `TypeName="research"` (chế độ Read-Only chỉ đọc, khóa hoàn toàn quyền sửa/xóa file).
2. **CẤM TRANH CHẤP TÀI NGUYÊN SỐNG (DATABASE / CHROME / SERVER / ZALO UI):**
   - Không bao giờ cho 2 công nhân Flash cùng lúc ghi vào 1 file, cùng truy cập 1 Database SQLite, hoặc cùng điều khiển 1 cổng trình duyệt/tiến trình đang chạy (`Zalo.exe`).
   - Các công nhân chỉ được viết kết quả/code ra file riêng hoặc báo cáo về; chỉ DUY NHẤT Tổng chỉ huy (hoặc 1 công nhân được chỉ định độc quyền) được quyền ghép nối và chạy tác động vào hệ thống chính.
3. **TỔNG CHỈ HUY GIÁM SÁT & NGHIỆM THU (ZERO-TRUST AUDIT):**
   - Công nhân Flash làm xong bắt buộc phải nộp bằng chứng (tên file đã sửa, số dòng, kết quả chạy test).
   - Tổng chỉ huy KHÔNG ĐƯỢC tin lời báo cáo miệng của công nhân: Bắt buộc tự đọc kiểm tra lại code/kết quả của từng công nhân.
   - Nếu phát hiện công nhân nào làm thiếu, làm ẩu hoặc lấn sân, Tổng chỉ huy dùng ngay `send_message` yêu cầu đúng công nhân đó sửa lại cho chuẩn 100% trước khi báo cáo cho Giám Đốc.




