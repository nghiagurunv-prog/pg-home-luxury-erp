# QUY TẮC QUẢN TRỊ CỐT LÕI & BẢN ĐIỀU HƯỚNG HỆ THỐNG PG HOME LUXURY

> [!IMPORTANT]
> **TÀI LIỆU QUY CHUẨN NỘI BỘ TỐI CAO - BẮT BUỘC MỌI PHIÊN LÀM VIỆC CỦA TRỢ LÝ AI ĐỀU PHẢI TUÂN THỦ 1000% LUẬT SẮT.**
> Không tự ý thay đổi, không đoán mò, không làm tắt. Mọi số liệu và logic kế thừa từ các quyết định thực tế của Giám Đốc Nguyễn Viết Nghĩa.
> **Khóa cứng trước phản hồi (Pre-Response Hard-Lock):** Trước khi đưa ra bất kỳ con số nào về ngày công, giờ OT, lương, tạm ứng, doanh số, vật tư, công nợ, định mức tấm, AI BẮT BUỘC PHẢI CHẠY CODE PYTHON đọc file thật ngoài ổ cứng. Chưa chạy script đọc file trong phiên hiện tại $\implies$ **TUYỆT ĐỐI CẤM PHÁT NGÔN CON SỐ ĐÓ**.
> **Bắt buộc dùng Link Sống 1 Chạm & Cấm Tuyệt Đối Đưa Link Chết (Zero-Dead-Link Hard-Lock):**
> 1. Trỏ đúng đường dẫn thực tế bằng cú pháp `[Tên hiển thị](file:///đường_dẫn_tuyệt_đối)` hoặc `http://localhost:8080/...` để Giám Đốc bấm mở trực tiếp.
> 2. **CẤM TUYỆT ĐỐI đưa link `http://localhost:8080/...` hoặc `file:///...` khi chưa kiểm tra HTTP 200 OK & tài nguyên tĩnh**: Trước khi gửi bất kỳ đường link nào cho Giám Đốc, AI bắt buộc phải chạy `python tools/sop_pre_response_gate.py` để: (a) Đảm bảo daemon `web_app/server.py` đang chạy sống trên cổng `8080` qua WMI `pythonw.exe` (không bị tắt sau khi chạy lệnh), (b) Xác nhận mọi đường dẫn (`/`, `/director`, `/deploy`, `/local_admin_vault/director_ccsc_full.html`, `/web_app/index.html`, `.js`, `.css`, và Cloud `https://nghiagurunv-prog.github.io/pg-home-luxury-erp/web_app/`) đều trả về `HTTP 200 OK`, và (c) Đảm bảo mở trực tiếp qua `file:///...` cũng nạp đủ 100% CSS/JS không bị lỗi trắng trang hay `ERR_CONNECTION_REFUSED`.
> **Khóa Cứng Giao Diện Gốc Chuẩn (`UI_GOLDEN_BASELINE_V1` — Bất Khả Xâm Phạm):** Giao diện hiện tại đã được Giám Đốc duyệt làm chuẩn gốc. **CẤM TUYỆT ĐỐI** tự ý sửa đổi bố cục, màu sắc, cấu trúc bảng 1 dòng (`.pg-compact-row`, `.data-table`), hay tự ý nhồi nhét nhiều bảng chồng dọc trên cùng 1 màn hình. Mọi nâng cấp về sau chỉ được phép tinh chỉnh tối ưu trên đúng khung giao diện gốc này (đã khóa tại Git Tag `UI_GOLDEN_BASELINE_V1` và `data/backups/golden_ui_baseline_20261111/`).
> **Luật Sắt Sửa Đổi Cô Lập — Cấm Tuyệt Đối Làm Ảnh Hưởng Dự Án & Các Chức Năng Liên Quan (`ZERO-REGRESSION & SURGICAL EDIT HARD-LOCK`):**
> 1. **Sửa đúng điểm (`100% Surgical Edit`)**: Khi Giám Đốc yêu cầu sửa 1 chức năng cụ thể (ví dụ: bảng chấm công, nút quét Zalo, phiếu PO...), AI chỉ được phép sửa đúng hàm/khối dữ liệu của chức năng đó. **CẤM TUYỆT ĐỐI** tự ý thu gọn/ẩn/xóa bất kỳ mục nào trên thanh Menu (`#sidebar` bắt buộc giữ nguyên 5 nhóm / 16 mục ở bản Giám Đốc và 11 mục ở bản Cloud), cấm xóa `.tab-content`, cấm ẩn nút trên Topbar hoặc làm mất dữ liệu các dự án/hợp đồng/vật tư/CCSC đang có.
> 2. **Cấm gây lỗi dây chuyền `TDZ / ReferenceError / TypeError`**: Mọi biến trạng thái toàn cục dùng chung bắt buộc khai báo bằng `var` ở đầu file (`dòng 1–20`), cấm đặt `let`/`const` ở giữa file cho các biến được gọi trong `loadState()` hoặc `DOMContentLoaded`. Mọi hàm tính toán dùng chung giữa bản Giám Đốc và bản Cloud (`calculateMonthCCSC`, `renderDashboard`, `renderCharts`, `renderFundMonitorWidget`...) bắt buộc có chốt chặn kiểm tra `null/undefined` để không bao giờ làm gãy luồng khởi tạo của các phân hệ khác.
> 3. **Cưỡng chế Chốt chặn Chống Hồi Quy (`Cổng 5 - Zero-Regression Gate` trong `tools/sop_pre_response_gate.py`)**: Sau bất kỳ chỉnh sửa nào, bắt buộc chạy `python tools/sop_pre_response_gate.py` để kiểm chứng tự động: (a) Đủ 100% mục Menu & Tab nội dung, (b) Đủ 100% dữ liệu dự án/hợp đồng/nhân sự thật, (c) Chạy giả lập toàn bộ các hàm chức năng liên quan (`Dashboard`, `CCSC`, `Chấm công`, `Vật tư/PO`, `Hợp đồng`, `Công nợ`, `Dự toán`, `Zalo Sync`, `Chuyển Tab`) đạt `0 lỗi Runtime` trước khi báo cáo Giám Đốc.

---

## 1. BẢNG MỤC LỤC ĐIỀU HƯỚNG HỆ THỐNG SỔ TAY LUẬT SẮT CHI TIẾT
Toàn bộ 25 mục quy chuẩn chi tiết và kinh nghiệm xương máu được lưu trữ tại thư mục: [📁 luat_sat_chi_tiet](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/luat_sat_chi_tiet).
**LỆNH CƯỠNG CHẾ:** Trước khi xử lý chuyên sâu về mảng nào, AI bắt buộc dùng lệnh `read_file` đọc toàn bộ sổ tay tương ứng!

| Sổ Tay | Tên Chuyên Đề & Phạm Vi Quản Trị | Các Mục Quy Chuẩn Chi Tiết Trực Thuộc | Đường Dẫn File Sống 1 Chạm |
|---|---|---| :--- |
| **Sổ Tay 01** | **Quản Trị Nhân Sự, Tài Chính Thực Tế, CCSC & Bóc Tách Vật Tư** | **Mục 1 đến Mục 8:** Xưng hô chuẩn mực, bảo mật khoán, 3 phân hệ gốc, logic CCSC chi tiết (Vật tư, công thợ, lợi nhuận Col BG, lương quản lý, quỹ thợ nòng cốt Hòa & Hào 20k/công, thưởng doanh số > 500M, phụ kiện/sofa, bảng số liệu bỏ túi BGĐ), danh mục tài nguyên hệ thống, chấm công điểm danh hàng ngày, danh sách nhân sự chuẩn T8-T10, bài học bóc tách gỗ thịt và đối soát 3 NCC 2026. | [SO_TAY_01_QUAN_TRI_TAI_CHINH_CCSC_VA_NHAN_SU.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/luat_sat_chi_tiet/SO_TAY_01_QUAN_TRI_TAI_CHINH_CCSC_VA_NHAN_SU.md) |
| **Sổ Tay 02** | **Kỷ Luật Thép, Chống Làm Ẩu, Tự Động Hóa Stealth Zalo & Master SOP** | **Mục 9 đến Mục 16:** 17 bài học cốt tử chống lười - chống làm láo - suy nghĩ đa chiều, điều lệ thép cưỡng chế chat & pre-response hard-lock, thông tin pháp lý PG Home (Mã số HKD: 042203002931 - TP. Hà Tĩnh), quy tắc link sống 1 chạm mở thư mục cha, hệ thống SOP trợ lý AI, Stealth Engine V2.0 & 20 cải tiến đột phá, 30 cải tiến SOP đẳng cấp thế giới, Master SOP 4.0 & 15 nguyên lý tối ưu hóa. | [SO_TAY_02_KY_LUAT_THEP_CHONG_LAM_AU_VA_SOP_VAN_HANH.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/luat_sat_chi_tiet/SO_TAY_02_KY_LUAT_THEP_CHONG_LAM_AU_VA_SOP_VAN_HANH.md) |
| **Sổ Tay 03** | **Dự Toán Sale, Bảo Vệ Dòng Tiền, Định Mức CNC & Điều Quân Flash** | **Mục 17 đến Mục 25:** Phân hệ dự toán nhà ở cho Sale (Hiệp & Dũng), 10 quy chuẩn tối thượng kéo Zalo tự động & bảo vệ dòng tiền, 40 quy chuẩn thống kê chính xác 100%, 50 nguyên tắc kỷ luật thép chống làm ẩu - chống tô hồng, tổng kết rà soát lỗi lịch sử & 6 chốt chặn tự động, lưu bộ nhớ phiên 06/11, hệ thống đồng bộ ngầm Zalo V4.0 (Delta-Cursor), định mức tấm cắt CNC thực chiến (Mục 24), quy chế điều hành Sub-Agent (Mục 25). | [SO_TAY_03_DU_TOAN_SALE_DINH_MUC_CNC_VA_DIEU_QUAN.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/luat_sat_chi_tiet/SO_TAY_03_DU_TOAN_SALE_DINH_MUC_CNC_VA_DIEU_QUAN.md) |

---

## 2. CƠ CẤU 4 PHÂN HỆ QUẢN TRỊ DOANH NGHIỆP PG HOME
1. **Phân hệ Giám Đốc (ADMIN):**
   - Quản trị toàn diện: Xem Dashboard, Báo cáo CCSC 12 tháng, Báo cáo CCSC T8+T9, Chấm công thợ, Giá cost vật tư, Hợp đồng, Dòng tiền công nợ.
   - Thẩm quyền tối cao: **Phê duyệt và đóng dấu đỏ điện tử** cho các Phiếu Đề Xuất Đặt Hàng Vật Tư của xưởng.
   - Trực tiếp phân quyền và kích hoạt tài khoản nhân sự mới đăng ký (tài khoản mới mặc định `PENDING`, Giám Đốc duyệt vào tab "Phân Quyền Nhân Sự" mới chuyển sang `ACTIVE`).
2. **Phân hệ Kỹ Thuật & Vật Tư Xưởng (Vũ - XUONG_VATTU):**
   - Chỉ được lập phiếu đề xuất vật tư theo bóc tách kỹ thuật công trình.
   - **Quy tắc sống còn:** Vũ chỉ được phép gửi đơn cho nhà cung cấp (An Cường, Hafele, Lam Giang, Quốc Tâm...) khi phiếu đã được **GIÁM ĐỐC DUYỆT & ĐÓNG DẤU ĐỎ**. Chưa có dấu duyệt đỏ thì tuyệt đối cấm nhập hàng.
3. **Phân hệ Sale Admin & Văn Phòng (Hiệp - VANPHONG_SALE):**
   - Chỉ xem mảng văn phòng: Hợp đồng công trình, doanh số, tiến độ thu tiền công nợ và tạm ứng khách hàng.
   - Tuyệt đối không can thiệp vào xưởng sản xuất hay số liệu tài chính quản trị cấp cao.
4. **Phân hệ Dự Toán Nhà Ở & Khởi Tạo Dự Án Báo Giá (Hiệp & Dũng - DU_TOAN_SALE / Web App Dự Toán):**
   - Quản lý khởi tạo dự án công trình mới, bóc tách khối lượng dự toán sơ bộ theo thư viện đơn giá niêm yết chuẩn.
   - Kiểm soát chặt chẽ tỷ lệ chi phí cost $\le 54\%$ trước khi xuất báo giá gửi khách hàng.
   - Không có quyền can thiệp vào bảng tính lương thợ hoặc cơ chế chia thưởng nội bộ của Ban Giám Đốc.

---

## 3. KỶ LUẬT CHẠY NGẦM ZALO STEALTH READER (100% ZERO-DISRUPTION)
> [!IMPORTANT]
> **NGUYÊN TẮC VÔ HÌNH TUYỆT ĐỐI - KHÔNG CAN THIỆP GIAO DIỆN VẬT LÝ:**

1. **Tuyệt đối không đụng vào ngoại vi của Giám Đốc:**
   - Cấm sử dụng `mouse_event`, `SetCursorPos`, `pyautogui` hoặc bất kỳ lệnh nào làm di chuyển con trỏ chuột của Giám Đốc.
   - Cấm sử dụng `SendKeys` toàn cục, cấm cướp tiêu điểm cửa sổ (`SetForegroundWindow`, `BringWindowToTop`) làm gián đoạn khi Giám Đốc đang soạn thảo Word, Excel, Zalo, CAD hoặc duyệt web.
   - Tuyệt đối không để màn hình giật, chớp nháy hoặc nhảy cửa sổ ngoài ý muốn.
2. **Phương thức kỹ thuật ngầm chuẩn hóa:**
   - **Win32 Background Session:** Khởi tạo qua Windows Station & Desktop (`OpenWindowStationW("WinSta0")` và `SetThreadDesktop(desk)`) để truy cập ngầm cây tiến trình mà không cần kích hoạt cửa sổ lên màn hình trước.
   - **Always-On Passive Disk Read (`0x00000040 IDLE`):** Đọc trực tiếp từ LevelDB và `.rescache` (`%APPDATA%\ZaloData` & `%LOCALAPPDATA%\ZaloPC`) với CPU $\le 0.3\%$. Vẫn quét bình thường ngay cả khi Giám Đốc đang mở và gõ phím trên Zalo PC.
   - **Cơ chế `Delta-Cursor` ([zalo_seen_cursor.json](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/zalo_seen_cursor.json)):** Lưu khóa định danh `filename|size|mtime` để bắt trọn 100% chùm nhiều ảnh hóa đơn gửi cùng lúc.
   - **Băm `SHA-256` chống trùng lặp:** Mỗi ảnh hóa đơn, UNC ngân hàng đều tính mã băm 64 ký tự chống nhập trùng dữ liệu.
   - **Script Giám Sát Chạy Ngầm:** [monitor_all_phu_gia_groups.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/monitor_all_phu_gia_groups.py).
3. **Quy chuẩn đối soát dòng tiền 3 lớp chéo:**
   - Hợp lệ = `[Ảnh hóa đơn thật]` + `[Xác nhận trên nhóm Zalo NCC]` + `[Ủy nhiệm chi ngân hàng khớp số tiền]`. Thiếu 1 trong 3 lập tức treo không xuất tiền.
   - **Chốt nợ tức thời $\le 60$ phút:** Cập nhật công nợ phát sinh trong tối đa 60 phút, không dồn cuối tháng.
   - **Bóc tách tự động `woodVal` và `pkVal`:** Nghiêm cấm tính khoán 40% vật tư và 15% thợ trên đồ thương mại hay gỗ tự nhiên.

---

## 4. MỤC 24: BÀI HỌC ĐỊNH MỨC TẤM CNC & ĐO LƯỜNG BÁO GIÁ THỰC TẾ (CHUẨN HÓA TỪ NHÀ ANH NAM 06/11/2026)
*(Bài học thực chiến đối soát từ nhà anh Nam ngày 06/11/2026 - Giám Đốc chuẩn hóa vĩnh viễn)*

### 4.1. BẢNG ĐỊNH MỨC TẤM CẮT CNC CHUẨN THỰC CHIẾN XƯỞNG PG HOME (KHỔ VÁN 1220×2440 = 2.9768 M²/TẤM):
- **1. Tủ bếp dưới (`R09` - Sâu 600 × Cao 860, Thùng cao 740, ĐVT: `Md`):**
  * Định mức chuẩn toàn bộ (Thùng + Hậu + Cánh): **`1.45 tấm / md`** (Nếu tách riêng cánh Acrylic: Thùng + Hậu = **`1.14 tấm/md`** + Cánh = **`0.31 tấm/md`**).
  * Giải thích kỹ thuật: Trừ chân nhựa `100mm` + đá `20mm`, nóc không bịt kín (chỉ đi 2 thanh xà `80mm`), khoang chậu rửa & bếp từ không có đợt ngang.
  * **CÔNG THỨC CHUẨN CỦA GIÁM ĐỐC:** `3.77 md × 1.45 = 5.47 ≈ 5.5 tấm`. **NGHIÊM CẤM BÁO CÁO NHẦM THÀNH `2.70 tấm/md`!**
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

### 4.2. NĂM BÀI HỌC XƯƠNG MÁU KHI LÀM BÁO GIÁ, TÍNH ĐỊNH MỨC & ĐO LƯỜNG:
1. **Không bao giờ tính trùng Cánh vào Thùng & không lấy chiều cao phủ bì nhân bừa:** Phải trừ chân nhựa `100mm`, trừ mặt đá, trừ tấm nóc rỗng của tủ bếp dưới, trừ diện tích cánh kính trên tủ áo và khoang rỗng nhét tủ lạnh/máy giặt.
2. **Bắt buộc phân biệt Chiều Sâu (`R`) khi quy đổi từ `M² / Md` sang Số Tấm Ván:** Cùng `1 m²` mặt đứng nhưng `R=17mm` (`0.40 tấm/m²`), `R=200mm` (`0.50 tấm/m²`), `R=350mm` (`0.74 tấm/md`), `R=600mm` (`1.05 tấm/m²`), `R=700mm` (`1.15–1.35 tấm/md`).
3. **Quy tắc Đo lường "Trừ Giao Cắt & Khấu Trừ Lỗ Mở":** Khi đo mảng tường ốp lớn (`R06`: `15.6 m²`) có gắn đè hệ tủ trang trí (`R05`: `8.51 m²`), hoặc hệ tủ áo lớn (`R27`: `13.82 m²`) có khoét lỗ cửa giấu khuôn (`R29`: `1.61 m²`), khối lượng cột `H` phải trừ phần giao cắt và ghi chú rõ vào cột Quy cách.
4. **Quy tắc Định giá 3 Cấp Vật Liệu (`An Cường` $\leftrightarrow$ `Thái Lan` $\leftrightarrow$ `Plywood A1`):** Giữa An Cường và Thái Lan chỉ chênh tiền phôi ván gỗ `~380.000 đ/tấm`, trong khi Nhựa đặc WPB An Cường (`2.550.000 đ/tấm`), Cánh Acrylic Noline, Phụ kiện, Kính, Da bọc và Công thợ là cố định 100%. Do đó cột Thái Lan chỉ được giảm tương ứng phần chênh phôi ván (`~12%–14%`), không giảm sâu ở các hạng mục có Cánh Acrylic hoặc Nhựa WPB.
5. **Chốt Chặn 54% Trước Khi Xuất Báo Giá:** Lấy `(Tổng Vật Tư Thực Tế + Tổng Công Thợ Dự Kiến) / Tổng Doanh Thu Báo Giá`. Nếu $\le 54\%$ thì chắc chắn đạt **Lợi nhuận ròng `18% – 20%`** bỏ túi Giám Đốc.

---

## 5. KỶ LUẬT PHÂN LOẠI TÁC VỤ, CẮT BỎ TÁC VỤ THỪA & TỔ CHỨC SUB-AGENT V30 (FAST-PATH & ZERO-CEREMONY PROTOCOL)
- **5.1. Phân loại Quy mô Tác vụ (`Anti-Overcomplication / Fast-Path`)**:
  - **Tác vụ Nhỏ (`<= 3 files`, sửa lỗi nhanh, tra cứu trạng thái)**: Tổng Chỉ Huy **LÀM TRỰC TIẾP** trong `1 – 5 bước` (`< 30s`), **CẤM** đẻ Sub-Agent.
  - **Tách bạch Tra cứu Nhanh (`< 15s`) vs Chạy Chiến dịch Thật**: Khi chỉ hỏi thông tin/xem lịch, chạy **duy nhất 1 lệnh đọc dữ liệu** (tra lịch Task Scheduler dùng `schtasks /query /fo CSV`, cấm `Get-ScheduledTask` trơn).
  - **Tác vụ Lớn (`>= 4 files` độc lập)**: Chia nhỏ huy động Sub-Agent (`100% Model="flash"`) chạy song song (`1 Công nhân = 1 File độc lập`), cấm gọi `schedule` timer chờ Sub-Agent, thu hồi bằng `manage_subagents(Action="kill_all")`.
- **5.2. Kỷ Luật Đọc 1 Lần Bằng `fast_lookup.py` (`<= 2 lần/file`) & Chạy Gatekeeper 1 Lần Cuối**:
  - Trước khi mở file `> 200 dòng`, bắt buộc chạy `python "C:\Users\Admin\.gemini\fast_lookup.py" "<file>" "<query>"` (`< 15ms`) lấy `StartLine–EndLine`, chỉ gọi `read_file` tối đa `1 – 2 lần` và sửa dứt điểm bằng `edit_file`.
  - Gom toàn bộ thay đổi rồi chỉ chạy **duy nhất 1 lần** script Gatekeeper chính thức ở bước nghiệm thu cuối cùng.
- **5.3. Kỷ Luật Tốc Độ & Sửa Trực Tiếp File Đích Trong Sub-Agent (`<= 20 Steps`)**:
  - Sub-Agent ghi thẳng vào file đích, cấm đẻ `scratch/w*_report.md`, cấm truyền code nhiều dòng qua `python -c "..."`.
- **5.4. Cơ Chế Tự Động Sang Số 3 Tầng (`Auto-Tiering` Qua 9Router `:20128`)**:
  - **Cấp `1T` (`gemini-3.8-flash-high`, `< 30s`, 0 Sub-Agent)**: Tra cứu, sửa lỗi nhỏ `<= 3 files`.
  - **Cấp `2T` (`gpt-oss-120b-medium` + `3.8 Flash`)**: Viết/sửa tính năng mới `>= 4 files`.
  - **Cấp `3T` (`claude-sonnet-4-6` Carbon -> Argon -> Flash)**: Pháp y toàn diện dự án, tìm 20–50 điểm cải tiến, thiết kế hệ thống mới.

---

## 6. KỶ LUẬT CHỐNG QUÊN, CHỐNG TRÀN CONTEXT & BỘ NHỚ NGOÀI BẤT TỬ V30
- **6.1. Báo Cáo Sub-Agent Siêu Gọn (`<= 3 dòng JSON`)**: `{"status": "PASS/FAIL", "modified_file": "...", "summary": "<= 15 từ"}`, xong gọi `manage_subagents(Action="kill_all")`.
- **6.2. Tra Cứu Sổ Tay Đúng Chỗ (`On-Demand Lookup`)**: Giữ `GEMINI.md < 25 KB`; **CẤM** tự động `read_file` toàn bộ `luat_sat_chi_tiet/` đầu phiên, chỉ tra bằng `fast_lookup.py` khi cần.
- **6.3. Sổ Cái Tinh Gọn (`PROJECT_STATE.md < 10 KB`)**: Lưu Mục tiêu, Tiến độ thật, Lỗi cấm tái phạm & Việc tiếp theo; lịch sử cũ chuyển sang `PROJECT_HISTORY_ARCHIVE.md`.
- **6.4. Chống Mù Ảnh (`fast_ocr.py < 0.015s–0.38s`)**: **CẤM** gọi `read_file` lên ảnh `.png/.jpg`. Dùng `python "C:\Users\Admin\.gemini\fast_ocr.py" "<ảnh>"`, `--vision-only "<thư_mục>"` (16 luồng), `--find-duplicates "<thư_mục>"`.
- **6.5. Vệ Sinh Đọc File & Cổng Nghiệm Thu Vật Lý (`Physical Disk Gate`)**: Kiểm tra file thật trên đĩa (ảnh `> 50 KB`, video `> 500 KB`, SQLite có bản ghi thật).
- **6.6. Ngưỡng Xoay Vòng Phiên Chat**: Khi DB phiên chat `> 40 MB` hoặc `> 3.000 steps`, lưu `PROJECT_STATE.md` và nhắc Bố `/compact`.
- **6.7. KỶ LUẬT ĐỊNH TUYẾN ĐÍCH, SOI KỸ QUY TRÌNH SOP TRƯỚC KHI THỰC HIỆN & BƠM LỆNH TRỰC TIẾP VÀO ĐÚNG DỰ ÁN (`Universal Direct-Injection & Pre-Execution SOP Audit`)**:
  + **3 BƯỚC CƯỠNG CHẾ BẤT KHẢ XÂM PHẠM**: Dù Bố mở phiên chat ở bất kỳ đâu (như `d:\Cài đặt các phần mềm`), hễ Bố yêu cầu rà soát/tối ưu/vận hành dự án nào trong **15 Phân Khu Dự Án Phú Gia**, AI bắt buộc thực hiện:
    1. **BƯỚC 1 — SOI KỸ QUY TRÌNH SOP DỰ ÁN ĐÍCH TRƯỚC KHI LÀM**: Đọc ngay `<Dự_Án_Đích>\GEMINI.md` + `PROJECT_STATE.md` (và tra mục lục `luat_sat_chi_tiet/` bằng `fast_lookup.py` nếu có) trước khi chạm vào code/dữ liệu.
    2. **BƯỚC 2 — BƠM LỆNH / CODE / CẢI TIẾN TRỰC TIẾP VÀO THƯ MỤC GỐC DỰ ÁN ĐÍCH**: Ghi thẳng 100% code (`.py`/`.js`), sổ cái (`.json`), SQLite và quy trình (`GEMINI.md`, `PROJECT_STATE.md`) vào thư mục vật lý của dự án đích; **CẤM TUYỆT ĐỐI** chỉ trả lời lý thuyết trên chat hoặc ghi nhầm vào workspace đang mở (`d:\Cài đặt các phần mềm`).
    3. **BƯỚC 3 — CHẠY GATEKEEPER CỦA ĐÚNG DỰ ÁN ĐÍCH ĐẠT `EXIT=0`**:
       - `01_ROOT_CMD` (`d:\Cài đặt các phần mềm`) & `14_DIEU_PHOI_AI` (`f:\Điều Phối AI`): `python "d:\Cài đặt các phần mềm\unified_health_doctor.py"` (`12/12 PASS`)
       - `02_PG_HOME_QUAN_TRI` (`f:\PG Home - Quản trị`): `python "d:\Cài đặt các phần mềm\unified_health_doctor.py"` (Cổng 04 & 05 `PASS`)
       - `03_PHAN_MEM_MKT` (`f:\Phần mềm MKT`): `python "f:\Phần mềm MKT\pre_flight_inspector.py" --sop-status` (`<2s`) / `--passive-proxy` (`15/15 PASS`)
       - `04A_VIDEO_AUTOMATION` (`d:\VideoAutomation`) & `04B_VIDEO_STUDIO` (`d:\PhuGiaHome_VideoStudio`): `python "d:\VideoAutomation\zero_trust_auditor.py"` (`5/5 PASS`)
       - `05_TK_NHA` (`01_THIẾT KẾ NHÀ`): `audit_zero_trust_gatekeeper.py` | `06_TK_NOI_THAT` (`02_THIẾT KẾ NỘI THẤT`): `verify_render_gate.py`
       - `07`–`11_MARKETING` (`f:\MARKETING\...`): `python "f:\MARKETING\MARKETING\audit_master_permanent_gatekeeper.py"` (`Exit=0`)
       - `12_MKT_2026` (`d:\MKT 2026`): `fast_ocr.py --vision-only` | `13A_SAT_WEB` (`f:\SAT_Web`) & `13B_SAT_NGHIAGURU`: Gatekeeper học liệu SAT.
