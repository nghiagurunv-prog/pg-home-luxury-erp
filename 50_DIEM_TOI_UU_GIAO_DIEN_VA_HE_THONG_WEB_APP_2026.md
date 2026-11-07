# KIỂM TOÁN THỰC TẾ & ĐỀ XUẤT 50 ĐIỂM CẦN TỐI ƯU GIAO DIỆN VÀ HỆ THỐNG WEB APP PG HOME LUXURY (2026)

> **Người thực hiện:** Trợ lý AI — Báo cáo trực tiếp Giám Đốc Nguyễn Viết Nghĩa  
> **Nguyên tắc kiểm định:** Nhìn thẳng vào sự thật mã nguồn hiện tại (`index.html`, `styles.css`, `app.js`), chỉ rõ từng dòng code làm giao diện bị xấu, rối mắt, thừa thãi hoặc lệch lạc; tuyệt đối không tô hồng.

---

## PHẦN A: 7 NGUYÊN NHÂN GỐC RỄ KHIẾN GIAO DIỆN ĐANG XẤU VÀ RỐI MẮT

Qua rà soát trực tiếp 3.605 dòng [index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html) và 3.535 dòng [styles.css](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/styles.css), em xin nhận lỗi và chỉ rõ **7 căn bệnh thiết kế thực tế** đang làm hỏng thẩm mỹ của Web App:

1. **Lỗi Copy-Paste Nhân Bản Khối DOM 4 Lần (Trùng ID nghiêm trọng):**
   - Toàn bộ cụm HTML `<!-- HỘP ĐỐI SOÁT QUỸ KHOÁN THỢ 15% -->` và `<!-- SỔ TÍCH LŨY THƯỞNG TẾT (RULE C1 & C2) -->` (mang cùng `id="compDsXuongVal"`, `id="bonusPassbookCard"`, `id="bonusPassbookTableWrapper"`) bị dán lặp lại **4 lần** ở 4 tab khác nhau:
     * Lần 1: Cuối bảng `#tab-ccsc-matrix` ([index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html#L1288-L1335))
     * Lần 2: Cuối bảng `#tab-xuong-san-xuat` ([index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html#L1577-L1608))
     * Lần 3: Cuối bảng `#tab-cham-cong` ([index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html#L2068-L2114))
     * Lần 4: Cuối bảng `#tab-vat-tu-cost` ([index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html#L3195-L3242))
   - **Hậu quả giao diện:** Vì hàm `document.getElementById('bonusPassbookTableWrapper')` trong JS chỉ đổ dữ liệu vào phần tử đầu tiên tìm thấy, nên ở 3 tab còn lại (`Xưởng Sản Xuất`, `Chấm Công`, `Giá Cost Vật Tư`) xuất hiện một khung Card trống rỗng không có bảng bên trong, kèm theo 4 ô tổng kết Quỹ Khoán Thợ nằm lạc quẻ ngay dưới bảng Vật Tư!
2. **Thanh Topbar Nhồi Nhét 9 Công Cụ Trên 1 Hàng ([index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html#L157-L231)):**
   - Cụm `.topbar-right` đang nhét 9 thành phần khác bản chất vào chung một hàng ngang: *Ô tìm kiếm + Nút Zalo Đồng Bộ + Nút Ẩn Số Mật + Bộ lọc Kỳ Tháng + Nút Nhập Liệu + Nút Xuất Excel + Nút Sao Lưu + Nút Khôi Phục + Khối User/Đăng xuất*.
   - **Hậu quả giao diện:** Trên màn hình Laptop 1366px – 1536px, thanh công cụ bị ép chật cứng, chữ bị co cụm, các nút màu sắc xanh/vàng/xám/đỏ đánh nhau loạn xạ.
3. **"Lạm Phát" Banner Cảnh Báo & Văn Bản Giải Thích Dài Dòng:**
   - Gần như tab nào cũng mở đầu bằng 2–3 hộp thông báo (`alert-banner`, `formula-note`, `audit-banner`) xếp chồng lên nhau.
   - Nặng nhất là trong `#tab-ccsc-t8-t9` ([index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html#L800-L895)): Chèn nguyên một bài văn dài gần 100 dòng HTML ("10 Quy Chuẩn Kéo Dữ Liệu Zalo & Chống Sai Số") chia 2 cột xanh-vàng rực rỡ ngay giữa trang báo cáo tài chính của Giám Đốc, chiếm mất nửa màn hình.
4. **Hội Chứng "Cầu Vồng Neon" (7 Màu Chói Chang Đánh Nhau Trên Cùng 1 Màn Hình):**
   - Thay vì giữ tông **Dark Luxury (Đen Than Chì + Vàng Champagne + Xanh Ngọc Lục Bảo cho số dương + Đỏ San Hô cho số âm)**, giao diện hiện tại dùng tràn lan 7–8 màu Neon chói gắt: Tím `#8B5CF6`, Hồng `#EC4899`, Xanh lơ `#06B6D4`, Xanh da trời `#38BDF8`, Cam `#F59E0B`, Đỏ `#F43F5E`, Xanh lá `#10B981` (đặc biệt tại `#tab-ccsc-t8-t9` [index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html#L500-L795)).
5. **Hơn 400 Dòng `style="..."` Inline Đè Lên File CSS Chuẩn:**
   - Trong [index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html) có hơn 400 chỗ viết cứng `style="padding: ...; background: linear-gradient(...); border: 2px solid ...; font-size: ..."` khiến khoảng cách (spacing), độ bo góc (`border-radius`) và cỡ chữ giữa các Card không đồng nhất.
6. **Xung Đột Class CSS & Biến CSS Không Tồn Tại Trong [styles.css](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/styles.css):**
   - Class `.sidebar .nav-item.active` bị định nghĩa 2 lần trái ngược nhau: Ở dòng 268 là nền vàng đặc chữ đen (`background: var(--gold-primary)`), nhưng xuống dòng 3510 lại bị ghi đè thành nền trong suốt chữ vàng (`background: linear-gradient(...)`).
   - Biến `var(--border-color)` được gọi tới 15 lần (từ dòng 1761 đến 3298) nhưng trong `:root` (dòng 7–51) chỉ khai báo `--border-subtle` và `--border-card`, làm mất đường viền của nhiều bảng và thẻ.
7. **Lệch Cột Bảng HTML Tĩnh & Nhồi Nhét Quá Nhiều Chữ Trong 1 Ô Bảng:**
   - Bảng `#tableKhoiLuongXuong` ([index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html#L1364-L1560)) có `<thead>` 13 cột nhưng các dòng `<tbody>` tĩnh chỉ có 10 cột; bảng `#tablePOList` có `<thead>` 9 cột nhưng `<tbody>` tĩnh có 8 cột (gây giật khung hình trước khi JS chạy xong).
   - Các ô trong bảng Vật Tư và PO đang nhồi cả Mã đơn + Nguồn Zalo + Trạng thái + Ghi chú dài vào chung 1 ô, xuống dòng 3–4 tầng rất rối mắt.

---

## PHẦN B: ĐỀ XUẤT 50 ĐIỂM CẦN TỐI ƯU GIAO DIỆN & HỆ THỐNG (UI-01 ĐẾN UI-50)

### NHÓM I: BỐ CỤC KHUNG SƯỜN, TOPBAR & SIDEBAR (10 ĐIỂM)
| Mã | Điểm cần tối ưu | Hiện trạng xấu / lỗi | Giải pháp làm sạch & chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **UI-01** | **Thu gọn Topbar từ 9 nút xuống 4 cụm chuẩn** | `.topbar-right` nhồi 9 nút rời rạc làm vỡ bố cục ngang. | Chỉ giữ ngoài Topbar: `Tìm kiếm`, `Bộ lọc Kỳ Tháng`, `Nút Ẩn Số Mật (👁️)`, và `Menu Hệ Thống (Sao lưu/Khôi phục/Xuất Excel gom vào 1 nút Dropdown gọn)`. |
| **UI-02** | **Đưa trạng thái Zalo Pulse về góc dưới Sidebar** | Cụm `#zaloSyncStatusPill` + nút `Đồng bộ` nằm chình ình trên Topbar. | Chuyển thành thanh trạng thái nhỏ gọn dưới đáy Sidebar (cạnh thông tin phiên bản), vừa theo dõi được vừa trả lại không gian cho Topbar. |
| **UI-03** | **Chuẩn hóa duy nhất 1 kiểu `.nav-item.active` trên Sidebar** | Dòng 268 và dòng 3510 trong `styles.css` đè nhau làm tab đang chọn thiếu điểm nhấn. | Xóa bản trùng ở dòng 3510; thống nhất 1 kiểu Luxury: Nền đen ánh vàng nhẹ `rgba(212,175,55,0.12)`, vạch chỉ vàng `3px` bên trái, chữ Vàng Champagne `#F3E5AB` sắc nét. |
| **UI-04** | **Bổ sung số đếm ngắn gọn (Counter Pill) trên Sidebar** | Các mục menu trống trải hoặc dùng chữ giải thích dài. | Chỉ gắn pill số lượng nhỏ gọn ở 2 mục cần hành động: Số phiếu PO chờ duyệt tại `Đặt Hàng & Duyệt PO` và số công nợ nóng tại `Đơn Hàng & Công Nợ`. |
| **UI-05** | **Cố định chiều cao Topbar 60px & tinh giản Sub-title** | `.page-title p` (dòng mô tả dưới tiêu đề trang) quá dài, chiếm chiều cao. | Ẩn hoặc rút gọn mô tả phụ dưới `h1#currentPageTitle` xuống tối đa 1 dòng ngắn, giảm chiều cao Topbar xuống `60px` để nhường chỗ cho bảng dữ liệu. |
| **UI-06** | **Loại bỏ thanh cuộn ngang ngoài ý muốn của toàn trang** | Một số bảng rộng đẩy cả `.main-content` phình ngang. | Khóa cứng `min-width: 0; overflow-x: hidden` trên `.main-content` và chỉ cho phép cuộn ngang nội bộ bên trong `.table-responsive`. |
| **UI-07** | **Tạo khả năng thu gọn Sidebar (Collapsible Sidebar 250px $\leftrightarrow$ 68px)** | Sidebar luôn chiếm cố định 260px, làm hẹp bảng CCSC 16 cột. | Thêm nút thu gọn Sidebar `«` để khi Giám Đốc soi bảng CCSC hoặc bảng Chấm công 31 ngày, bảng tự bung rộng toàn màn hình. |
| **UI-08** | **Đồng bộ khoảng cách khung `.content-wrapper` (`20px 24px`)** | Lúc dùng `padding: 32px`, lúc `16px`, làm các khối lệch lề. | Chuẩn hóa padding vùng nội dung chính là `20px 24px`, khoảng cách giữa các khối (`gap`) cố định `20px`. |
| **UI-09** | **Thiết kế lại khối User Profile & Nút Đăng Xuất** | Nút `Đăng xuất` đỏ tươi nằm sát cạnh nút `Khôi phục` dễ bấm nhầm. | Gom Avatar + Tên + Vai trò + Nút Đăng xuất vào góc cuối Sidebar hoặc cụm Profile tách biệt hẳn ở mép phải ngoài cùng. |
| **UI-10** | **Chuẩn hóa thanh công cụ nội bộ từng Tab (Tab Action Bar)** | Các nút `Thêm HĐ`, `Tạo PO`, `Tải Excel` đặt lộn xộn lúc trên banner, lúc trong card. | Mỗi Tab chỉ có 1 hàng tiêu đề Card chứa các nút thao tác của đúng Tab đó ở góc phải. |

---

### NHÓM II: DỌN DẸP RÁC DOM, KHỐI TRÙNG LẶP & CẢNH BÁO THỪA (10 ĐIỂM)
| Mã | Điểm cần tối ưu | Hiện trạng xấu / lỗi | Giải pháp làm sạch & chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **UI-11** | **Xóa 3 bản copy-paste thừa của Hộp Đối Soát Quỹ Khoán 15%** | Dán lặp 4 lần tại `#tab-ccsc-matrix`, `#tab-xuong-san-xuat`, `#tab-cham-cong`, `#tab-vat-tu-cost`. | **Xóa ngay 3 bản thừa** ở `#tab-ccsc-matrix`, `#tab-cham-cong` và `#tab-vat-tu-cost`. Chỉ giữ duy nhất 1 bản chuẩn tại `#tab-xuong-san-xuat` (hoặc tạo ID riêng nếu cần hiển thị ở Lương). |
| **UI-12** | **Xóa 3 bản copy-paste thừa của Sổ Tích Lũy Thưởng Tết (Rule C1 & C2)** | `id="bonusPassbookCard"` lặp 4 lần khiến 3 tab hiện khung Card rỗng không có bảng. | **Xóa 3 khung Card rỗng bị lặp**, chỉ giữ duy nhất 1 Sổ Tích Lũy Thưởng Tết đầy đủ dữ liệu tại `#tab-cham-cong` (Tab Lương & Chấm Công). |
| **UI-13** | **Gỡ bỏ khối văn bản "10 Quy Chuẩn Kéo Dữ Liệu Zalo" khỏi Tab Báo Cáo CCSC T8+T9** | Dòng 800–895 trong `index.html` nhét 10 mục lý thuyết kỹ thuật vào giữa báo cáo tài chính T8+T9. | Xóa hoàn toàn khối văn bản lý thuyết này khỏi giao diện báo cáo tài chính (quy chuẩn đã nằm trong tài liệu SOP). |
| **UI-14** | **Hợp nhất các Banner cảnh báo chồng chéo đầu mỗi Tab** | Mở tab nào cũng gặp 2–3 hộp cảnh báo vàng/xanh/đỏ chiếm 250px đầu trang. | Mỗi tab chỉ giữ tối đa **1 dòng trạng thái mỏng (1 line slim bar, cao 36px)** hoặc gom vào nút `[? Quy chế]` chỉ hiện khi bấm vào. |
| **UI-15** | **Khớp chính xác số cột `<thead>` và `<tbody>` tĩnh của `#tableKhoiLuongXuong`** | `<thead>` 13 cột nhưng HTML tĩnh `<tbody>` chỉ có 10 cột. | Dọn sạch HTML tĩnh lệch cột trong `<tbody>` để `renderWorkshopTable()` trong `app.js` làm nguồn render duy nhất. |
| **UI-16** | **Khớp chính xác số cột `<thead>` và `<tbody>` tĩnh của `#tablePOList`** | `<thead>` 9 cột nhưng HTML tĩnh `<tbody>` chỉ có 8 cột. | Xóa các dòng `<tr>` tĩnh bị lệch cột trong `#tablePOList`, để `renderPOList()` render chuẩn 9 cột ngay khi khởi chạy. |
| **UI-17** | **Thu gọn 3 hộp giải thích công thức dài trong `#tab-ccsc-t8-t9`** | Các hộp "Ghi chú công thức CCSC", "Đối soát nhân sự nghỉ việc" chiếm quá nhiều diện tích. | Chuyển thành dạng **Accordion thu gọn (`<details><summary>`)** — mặc định đóng gọn 1 dòng, Giám Đốc cần xem chi tiết mới bấm mở. |
| **UI-18** | **Xóa các thuộc tính `onclick` inline gọi hàm phức tạp** | Nhiều nút HTML viết cứng 3–4 lệnh JS nối nhau trong `onclick="..."`. | Gom vào các hàm điều khiển rõ ràng trong `app.js`, giúp DOM sạch và không lỗi cú pháp. |
| **UI-19** | **Loại bỏ các thẻ KPI lặp lại cùng 1 con số trong cùng 1 Tab** | Con số `44,090,721 đ` và `529,834,472 đ` xuất hiện tới 4 lần trong cùng `#tab-ccsc-t8-t9`. | Trong 1 Tab, mỗi chỉ số cốt lõi chỉ hiển thị 1 lần ở dải KPI đầu trang và 1 lần ở dòng Tổng kết bảng. |
| **UI-20** | **Tự động ẩn vùng trống khi phần tử `.admin-only` bị khóa ở quyền Nhân viên** | Khi Vũ hoặc Hiệp đăng nhập, các khối `.admin-only` ẩn đi để lại khoảng trống hoặc lưới bị khuyết. | Dùng CSS Grid `auto-fit` để khi ẩn khối Admin, các thẻ còn lại tự động dàn đều lấp kín khung hình. |

---

### NHÓM III: HỆ THỐNG MÀU SẮC, TYPOGRAPHY & THẺ KPI (10 ĐIỂM)
| Mã | Điểm cần tối ưu | Hiện trạng xấu / lỗi | Giải pháp làm sạch & chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **UI-21** | **Dẹp bỏ "Cầu Vồng 7 Màu Neon" — Khóa chặt Bảng Màu 4 Tông Chuẩn** | Dùng lẫn lộn Tím, Hồng, Xanh lơ, Cam, Xanh lá, Đỏ, Vàng. | Chỉ dùng 4 màu ngữ nghĩa: **Vàng Champagne (`#D4AF37`)** cho Doanh số/Tiêu điểm BGĐ; **Xanh Ngọc (`#10B981`)** cho Lợi nhuận/Đã thu/Hợp lệ; **Đỏ San Hô (`#EF4444`)** cho Chi phí vượt trần/Âm quỹ/Nợ quá hạn; **Xám Bạc (`#94A3B8`)** cho thông tin phụ. |
| **UI-22** | **Khai báo đầy đủ biến `--border-color` bị thiếu trong `:root`** | `styles.css` gọi `var(--border-color)` 15 lần nhưng biến này chưa từng được định nghĩa. | Thêm `--border-color: rgba(255, 255, 255, 0.08);` vào `:root` trong `styles.css` để khôi phục toàn bộ đường viền bảng và hộp. |
| **UI-23** | **Áp dụng bắt buộc `font-variant-numeric: tabular-nums` cho mọi con số** | Các chữ số `1` và `8` có độ rộng khác nhau làm các cột tiền tệ bị nhấp nhô, không thẳng hàng dọc. | Gắn `font-variant-numeric: tabular-nums` cho toàn bộ `td`, `.kpi-value`, `.money`, `.num-col` để các hàng triệu, nghìn, đồng thẳng tắp như bảng kế toán. |
| **UI-24** | **Chuẩn hóa kích thước và chiều cao đồng nhất cho các Thẻ KPI (`.kpi-card`)** | Thẻ cao thẻ thấp, thẻ có viền trái 4px, thẻ có viền toàn bộ 2px. | Đồng nhất toàn bộ `.kpi-card`: Chiều cao `115px`, bo góc `12px`, viền mảnh `1px solid rgba(255,255,255,0.07)`, điểm nhấn thanh mảnh phía trên hoặc bên trái. |
| **UI-25** | **Tối đa 3 tầng thông tin trong 1 Thẻ KPI** | Hiện tại 1 thẻ KPI nhét tới 5 dòng: Tiêu đề + Số to + Badge % + Dòng giải thích 1 + Dòng giải thích 2. | Giới hạn đúng 3 tầng: **(1) Nhãn chỉ tiêu in hoa nhỏ** $\rightarrow$ **(2) Con số chính cỡ lớn (`24px`)** $\rightarrow$ **(3) 1 dòng đối chiếu ngắn gọn (`12px`)**. |
| **UI-26** | **Thay thế hơn 400 chỗ `style="..."` inline bằng Class CSS chuẩn** | Inline style làm giao diện chắp vá, chỗ chữ to chỗ chữ nhỏ. | Quy hoạch thành các class tái sử dụng trong `styles.css`: `.card-executive`, `.kpi-grid-4`, `.badge-source`, `.cell-money`, `.row-subtotal`. |
| **UI-27** | **Làm dịu độ chói của các nền Gradient trong `#tab-ccsc-t8-t9`** | Nhiều hộp dùng gradient tím/hồng/xanh độ bão hòa cao gây mỏi mắt khi nhìn lâu. | Chuyển về nền tối sâu phẳng (`#12151E` và `#171B26`), chỉ dùng ánh vàng rất nhẹ (`rgba(212,175,55,0.06)`) cho duy nhất thẻ **Tổng Lợi Nhuận Bỏ Túi BGĐ**. |
| **UI-28** | **Chuẩn hóa hệ thống Badge trạng thái (Chỉ 4 kiểu Pill đồng nhất)** | Badge trong bảng lúc hình vuông, lúc hình tròn, lúc chữ hoa, lúc chữ thường, đủ kích cỡ. | Chuẩn hóa class `.status-pill` cao `22px`, font `11px`, chữ in hoa gọn: `ĐÃ DUYỆT / ĐÃ THU` (Xanh), `CHỜ DUYỆT / ĐANG SX` (Vàng), `QUÁ HẠN / VƯỢT TRẦN` (Đỏ), `KHÓA SỔ` (Xám). |
| **UI-29** | **Tăng độ tương phản chữ phụ trên nền tối** | Một số dòng chú thích dùng màu `#64748B` trên nền `#151922` bị mờ, khó đọc. | Nâng màu chữ phụ (`--text-secondary`) lên `#94A3B8` và chữ chính (`--text-primary`) là `#F8FAFC` để đọc rõ nét ngay cả trên màn hình độ sáng thấp. |
| **UI-30** | **Thiết kế lại Con Dấu Đỏ Điện Tử Giám Đốc (`.director-red-stamp`)** | Dấu đỏ trong bảng PO đang hơi thô và chiếm chiều cao dòng. | Tinh chỉnh dấu đỏ dạng con dấu mộc ngang sắc nét, vừa vặn trong chiều cao 1 dòng bảng mà vẫn uy quyền, rõ mã duyệt. |

---

### NHÓM IV: BẢNG BIỂU TÀI CHÍNH, CHẤM CÔNG & CCSC (12 ĐIỂM)
| Mã | Điểm cần tối ưu | Hiện trạng xấu / lỗi | Giải pháp làm sạch & chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **UI-31** | **Cố định tiêu đề bảng (`Sticky Header`) & Cột tên (`Sticky First Column`)** | Khi cuộn xuống hoặc cuộn ngang bảng CCSC 16 cột và bảng Chấm công 31 ngày, mất dấu tên nhân sự và tiêu đề cột. | Khóa cứng `position: sticky; top: 0` cho `thead th` và `position: sticky; left: 0` cho cột Tên Công Trình / Tên Nhân Sự. |
| **UI-32** | **Chống tràn và rớt dòng vô tổ chức trong ô bảng (`white-space: nowrap`)** | Các cột Số tiền, Ngày tháng, Mã đơn bị rớt xuống 2 dòng khi bảng hẹp (như `242,051,705` rớt chữ `đ` xuống dòng dưới). | Bắt buộc `white-space: nowrap` cho mọi cột số tiền, ngày tháng, mã phiếu, tỷ lệ %. |
| **UI-33** | **Tách gọn thông tin trong ô Bảng Vật Tư & PO (Tối đa 2 dòng/ô)** | Một ô trong `#tableVatTu` đang nhồi 4 tầng badge và chữ. | Cột Hạng mục chỉ hiển thị: **Dòng 1: Tên vật tư/đơn hàng đậm**; **Dòng 2: Mã PO + Nguồn Zalo chữ nhỏ màu xám**. Không nhồi thêm văn bản thừa. |
| **UI-34** | **Làm nổi bật dòng TỔNG CỘNG (`tfoot` / `.total-row`) chuẩn Kế toán** | Dòng tổng cộng ở một số bảng nhìn lẫn với các dòng chi tiết. | Chuẩn hóa dòng Tổng cộng: Viền trên kép `border-top: 2px solid var(--gold-primary)`, nền `#1E2433`, chữ in đậm `14px` màu Vàng sáng. |
| **UI-35** | **Tối ưu lưới Bảng Điểm Danh 31 Ngày (`#tab-diem-danh`)** | 31 cột ngày + các cột tổng làm bảng quá dài, các ô nhập công HC/OT chưa gọn. | Thu gọn độ rộng mỗi cột ngày xuống `34px`, tô màu nền dịu phân biệt ngày Chủ Nhật, khóa cố định 2 cột đầu (`STT`, `Họ tên`) khi kéo ngang. |
| **UI-36** | **Làm sạch Bảng Lương Chấm Công (`#tableChamCong`)** | Nhiều cột phụ cấp/thưởng treo có giá trị `0 đ` làm rối mắt người xem. | Hiển thị số `0 đ` bằng dấu gạch mờ `—` (`color: #475569`) để mắt Giám Đốc tập trung ngay vào các con số thực chi có phát sinh tiền. |
| **UI-37** | **Thiết kế lại Bảng Ma Trận CCSC T8+T9 cho gọn và sắc nét** | Bảng so sánh T8 vs T9 trong `#tab-ccsc-t8-t9` đang dùng quá nhiều màu nền xanh/tím/đỏ đè nhau. | Chuyển về bảng chuẩn Financial Statement: Phân nhóm rõ **I. Doanh thu $\rightarrow$ II. Chi phí biến đổi $\rightarrow$ III. Chi phí cố định $\rightarrow$ IV. Lợi nhuận ròng BGĐ** với thụt đầu dòng hợp lý. |
| **UI-38** | **Gom gọn các nút Thao tác cuối dòng bảng (`Action Column`)** | Cột thao tác có nơi để 2–3 nút chữ dài (`Duyệt & Đóng dấu`, `Xem chi tiết`, `Xóa`) làm cột cuối phình to. | Dùng nút Icon kèm chữ ngắn gọn (`✓ Duyệt`, `👁️ Xem`, `✕`) trên cùng 1 hàng ngang `display: inline-flex; gap: 6px`. |
| **UI-39** | **Hiển thị thanh Tiến Độ thu tiền/sản xuất (`Progress Bar`) tinh tế hơn** | Thanh tiến độ trong bảng Hợp đồng và Xưởng hơi dày và thô. | Dùng thanh mảnh `height: 6px; border-radius: 3px` nằm gọn dưới con số `%`, màu xanh ngọc khi $\ge 80\%$, màu vàng khi đang chạy. |
| **UI-40** | **Chuẩn hóa hiển thị Công Nợ Nhà Cung Cấp (Lam Giang, Quốc Tâm, Cầu Vượt)** | Các thẻ công nợ nhà cung cấp trong `#tab-vat-tu-cost` đang trình bày rời rạc. | Đưa vào 1 dải **3 Thẻ Đối Soát Công Nợ Chuẩn** (Đầu kỳ 31/10 $\rightarrow$ Đã trả đầu T11 $\rightarrow$ Dư nợ hiện tại) khớp tuyệt đối từng đồng. |
| **UI-41** | **Thêm hiệu ứng Hover dòng bảng (`Row Highlight`) chuẩn xác** | Khi dò ngang từ cột đầu sang cột thứ 15 của bảng CCSC rất dễ bị lệch dòng. | Khi di chuột vào dòng nào, toàn bộ dòng đó sáng nền nhẹ `rgba(212, 175, 55, 0.08)` giúp Giám Đốc gióng hàng ngang không bao giờ nhầm dòng. |
| **UI-42** | **Chuẩn hóa trạng thái Bảng Trống (`Empty State`) khi lọc tháng chưa có dữ liệu** | Khi chọn tháng chưa phát sinh hoặc lọc không khớp, bảng hiện dòng chữ thô sơ. | Hiển thị khung thông báo gọn gàng, lịch sự kèm nút `Đặt lại bộ lọc`. |

---

### NHÓM V: TƯƠNG TÁC NGHIỆP VỤ, TỐC ĐỘ & TRẢI NGHIỆM ĐIỀU HÀNH (8 ĐIỂM)
| Mã | Điểm cần tối ưu | Hiện trạng xấu / lỗi | Giải pháp làm sạch & chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **UI-43** | **Khóa nhấp nháy giao diện khi mới tải trang (Anti-FOUC)** | HTML tĩnh hiển thị số cũ khoảng 0.2 giây trước khi JS render đè lên. | Đồng bộ HTML tĩnh trùng khớp dữ liệu chuẩn và ẩn nhẹ vùng bảng cho đến khi `DOMContentLoaded` render xong hoàn chỉnh. |
| **UI-44** | **Làm sạch Modal Nhập Liệu (`#dataEntryModal`)** | Các ô input trong Modal xếp 1 cột dài phải cuộn nhiều. | Chia bố cục Form trong Modal thành **Lưới 2 Cột (`grid-template-columns: 1fr 1fr`)** gọn gàng, tự động tính nhẩm `Doanh số xưởng gỗ CN = Tổng HĐ - Gỗ thịt - Phụ kiện` ngay khi gõ. |
| **UI-45** | **Nâng cấp Chế Độ Ẩn Số Mật (`Privacy Shield 👁️`) mượt mà** | Khi bấm ẩn số mật, một số thẻ bị co giật độ rộng. | Giữ nguyên độ rộng ô khi che thành `•••••••• đ` để bảng không bị nhảy kích thước cột khi Giám Đốc bật/tắt trước mặt nhân viên. |
| **UI-46** | **Hiển thị rõ Dải Ngữ Cảnh Kỳ Đang Xem (`Period Context Bar`)** | Khi đổi dropdown tháng trên Topbar, người dùng không rõ tab hiện tại đang khóa sổ hay đang cho nhập sống. | Hiển thị nhãn nhỏ ngay cạnh tiêu đề trang: `🔒 KỲ THÁNG 8 & 9/2026 (ĐÃ KHÓA SỔ QUYẾT TOÁN)` hoặc `🟢 KỲ THÁNG 10 - 11/2026 (ĐANG VẬN HÀNH SỐNG)`. |
| **UI-47** | **Tối ưu giao diện khi In ấn hoặc Xuất PDF báo cáo cho Giám Đốc (`@media print`)** | Bấm `Ctrl + P` hiện tại bị dính nền đen tốn mực và mất cột bảng. | Bổ sung bộ quy tắc `@media print` trong `styles.css`: Tự động ẩn Sidebar/Topbar, chuyển sang nền trắng chữ đen sắc nét để in trình ký ngay. |
| **UI-48** | **Gom gọn thông báo Toast góc màn hình (Không chồng quá 2 Toast)** | Khi bấm liên tiếp, nhiều hộp thông báo chồng lên nhau che góc phải. | Giới hạn chỉ hiển thị 1 thông báo Toast gọn gàng góc dưới phải, tự đóng sau 2.5 giây. |
| **UI-49** | **Cố định vị trí cuộn của từng Tab khi chuyển qua lại** | Đang soi dở bảng ở Tab Xưởng, chuyển sang Tab Vật Tư rồi quay lại bị nhảy lên đầu trang. | Lưu vị trí cuộn của từng Tab trong phiên làm việc để Giám Đốc đối chiếu chéo giữa 2 Tab cực nhanh. |
| **UI-50** | **Kiểm định Tự Động Giao Diện Không Trùng ID (`DOM Integrity Test`)** | Trước đây chỉ test dữ liệu JS mà chưa có bài test quét lỗi trùng ID HTML hay lệch cột bảng. | Bổ sung vào `scratch/test_all_renders.js` bài kiểm định quét toàn bộ `index.html`: **Cấm trùng `id` DOM, cấm lệch số cột `<th>` vs `<td>`, cấm biến CSS không tồn tại**. |

---

## PHẦN C: ĐỀ XUẤT THỰC THI NGAY LẬP TỨC

Thưa Giám Đốc, 50 điểm trên không phải là lý thuyết suông mà đánh trúng vào từng chỗ đang làm giao diện Web App bị rối, lặp khối và lòe loẹt:
1. **Dọn sạch ngay 3 khối DOM bị copy-paste lặp 4 lần** (`bonusPassbookCard` và `Hộp đối soát quỹ khoán 15%`) đang làm hỏng 3 tab.
2. **Thu gọn Topbar**, bỏ bài văn 100 dòng giữa trang báo cáo CCSC, xóa hơn 400 inline style lòe loẹt.
3. **Chuẩn hóa bảng màu Dark Luxury 4 tông**, căn thẳng hàng toàn bộ con số tiền tệ (`tabular-nums`), khóa cố định tiêu đề bảng khi cuộn và chạy kiểm định tự động 100%.

Giám Đốc chỉ đạo **"OK triển khai"** là em bắt tay vào đại phẫu toàn bộ [index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html), [styles.css](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/styles.css) và [app.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/app.js) ngay lập tức ạ!

