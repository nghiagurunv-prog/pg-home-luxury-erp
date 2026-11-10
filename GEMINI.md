# QUY TẮC QUẢN TRỊ CỐT LÕI & BẢN ĐIỀU HƯỚNG HỆ THỐNG PG HOME LUXURY

> [!IMPORTANT]
> **TÀI LIỆU QUY CHUẨN NỘI BỘ TỐI CAO - BẮT BUỘC MỌI PHIÊN LÀM VIỆC CỦA TRỢ LÝ AI ĐỀU PHẢI TUÂN THỦ 1000% LUẬT SẮT.**
> Không tự ý thay đổi, không đoán mò, không làm tắt. Mọi số liệu và logic kế thừa từ các quyết định thực tế của Giám Đốc Nguyễn Viết Nghĩa.
> **Khóa cứng trước phản hồi (Pre-Response Hard-Lock):** Trước khi đưa ra bất kỳ con số nào về ngày công, giờ OT, lương, tạm ứng, doanh số, vật tư, công nợ, định mức tấm, AI BẮT BUỘC PHẢI CHẠY CODE PYTHON đọc file thật ngoài ổ cứng. Chưa chạy script đọc file trong phiên hiện tại $\implies$ **TUYỆT ĐỐI CẤM PHÁT NGÔN CON SỐ ĐÓ**.
> **Bắt buộc dùng Link Sống 1 Chạm & Cấm Tuyệt Đối Đưa Link Chết (Zero-Dead-Link Hard-Lock):**
> 1. Trỏ đúng đường dẫn thực tế bằng cú pháp `[Tên hiển thị](file:///đường_dẫn_tuyệt_đối)` hoặc `http://localhost:8080/...` để Giám Đốc bấm mở trực tiếp.
> 2. **CẤM TUYỆT ĐỐI đưa link `http://localhost:8080/...` hoặc `file:///...` khi chưa kiểm tra HTTP 200 OK & tài nguyên tĩnh**: Trước khi gửi bất kỳ đường link nào cho Giám Đốc, AI bắt buộc phải chạy `python tools/sop_pre_response_gate.py` để: (a) Đảm bảo daemon `web_app/server.py` đang chạy sống trên cổng `8080` qua WMI `pythonw.exe` (không bị tắt sau khi chạy lệnh), (b) Xác nhận mọi đường dẫn (`/`, `/director`, `/deploy`, `/local_admin_vault/director_ccsc_full.html`, `/web_app/index.html`, `.js`, `.css`, và Cloud `https://nghiagurunv-prog.github.io/pg-home-luxury-erp/web_app/`) đều trả về `HTTP 200 OK`, và (c) Đảm bảo mở trực tiếp qua `file:///...` cũng nạp đủ 100% CSS/JS không bị lỗi trắng trang hay `ERR_CONNECTION_REFUSED`.
> **Khóa Cứng Giao Diện Gốc Chuẩn (`UI_GOLDEN_BASELINE_V1` — Bất Khả Xâm Phạm):** Giao diện hiện tại đã được Giám Đốc duyệt làm chuẩn gốc. **CẤM TUYỆT ĐỐI** tự ý sửa đổi bố cục, màu sắc, cấu trúc bảng 1 dòng (`.pg-compact-row`, `.data-table`), hay tự ý nhồi nhét nhiều bảng chồng dọc trên cùng 1 màn hình. Mọi nâng cấp về sau chỉ được phép tinh chỉnh tối ưu trên đúng khung giao diện gốc này (đã khóa tại Git Tag `UI_GOLDEN_BASELINE_V1` và `data/backups/golden_ui_baseline_20261111/`).

---

## 1. BẢNG MỤC LỤC ĐIỀU HƯỚNG HỆ THỐNG SỔ TAY LUẬT SẮT CHI TIẾT
Toàn bộ 25 mục quy chuẩn chi tiết và kinh nghiệm xương máu được lưu trữ tại thư mục: [📁 luat_sat_chi_tiet](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/luat_sat_chi_tiet).
**LỆNH CƯỠNG CHẾ:** Trước khi xử lý chuyên sâu về mảng nào, AI bắt buộc dùng lệnh `read_file` đọc toàn bộ sổ tay tương ứng!

| Sổ Tay | Tên Chuyên Đề & Phạm Vi Quản Trị | Các Mục Quy Chuẩn Chi Tiết Trực Thuộc | Đường Dẫn File Sống 1 Chạm |
| :--- | :--- | :--- | :--- |
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

## 5. KỶ LUẬT PHÂN LOẠI TÁC VỤ, CẮT BỎ TÁC VỤ THỪA & TỔ CHỨC SUB-AGENT (FAST-PATH & ZERO-CEREMONY PROTOCOL)
- **5.1. Phân loại Quy mô Tác vụ — Cấm Phức Tạp Hóa Việc Đơn Giản (`Anti-Overcomplication / Fast-Path`)**:
  - **Tác vụ Nhỏ / Đơn giản (`<= 3 files`, sửa lỗi nhanh, kiểm tra trạng thái, chạy 1 lệnh, trả lời câu hỏi)**: Tổng Chỉ Huy (Main Agent) **LÀM TRỰC TIẾP NGAY LẬP TỨC** trong `1 – 5 bước` (`< 30 giây`). **CẤM TUYỆT ĐỐI** bày vẽ đẻ ra đội quân Sub-Agent, cấm tự vẽ thêm quy trình rườm rà hay viết bộ khung kiểm thử (`verification harness`) cho việc nhỏ.
  - **Tách bạch Tra cứu Nhanh (`Read-Only Query < 15s`) vs Chạy Chiến dịch Thật (`Live Execution`)**: Khi Bố chỉ hỏi thông tin, xem lịch, kiểm tra trạng thái hoặc sửa code nhỏ: Chạy **duy nhất 1 lệnh/script đọc dữ liệu** và trả lời ngay trong `< 15 giây`; **CẤM** chạy các thủ tục tiền kiểm tra 15 cổng (`pre_flight_inspector.py`), cấm quét Fanpage Ưu tiên 0 hay kiểm toán 5 vòng. Chỉ chạy cổng kiểm định khi thực sự kích hoạt chiến dịch chạy thật hoặc xuất bản bàn giao.
  - **Tác vụ Trung bình & Lớn (`>= 4 files` độc lập hoặc chiến dịch hàng loạt)**: Mới chia nhỏ thành các phần độc lập và huy động đội quân Sub-Agent (`Model="flash"`) chạy song song trong cùng 1 lượt.
- **5.2. Kỷ Luật Đọc 1 Lần (`Single-Pass Read <= 2 lần/file`) & Chạy Gatekeeper 1 Lần Cuối (`Single-Run Gatekeeper`)**:
  - **CẤM đọc vụn 1 file hàng chục lần**: Cấm đọc đi đọc lại cùng 1 file `15 – 70 lần` từng khúc nhỏ; chỉ đọc **tối đa `1 – 2 lần`** đúng vùng cần sửa (`150 – 250 dòng`), sửa dứt điểm bằng `edit_file`.
  - **CẤM đẻ script `test_*.py` rác & CẤM chạy Gatekeeper lặp lại sau mỗi dòng sửa**: Gom toàn bộ thay đổi hoàn tất rồi chỉ chạy **duy nhất 1 lần** script Gatekeeper chính thức của dự án (`audit_master_permanent_gatekeeper.py`, `verify_render_gate.py`, `pre_flight_inspector.py`, `sop_pre_response_gate.py`) ở bước nghiệm thu cuối cùng.
- **5.3. Kỷ Luật Tốc Độ, Sửa Trực Tiếp File Đích & Cấm Giấy Tờ Trung Gian Trong Sub-Agent (`<= 20 Steps`)**:
  - Mỗi Sub-Agent chỉ làm **đúng 1 việc duy nhất được giao** bằng công cụ trực tiếp (`read_file`, `edit_file`, `write_file`), hoàn tất gọn trong **`5 – 20 steps` (`< 45 giây`)**.
  - **Sửa trực tiếp file đích — CẤM đẻ file báo cáo nháp `scratch/w*_report.md`**: Khi Sub-Agent được giao sửa code/dữ liệu/bài viết, bắt buộc ghi thẳng vào file đích được phân công và trả về 1 dòng JSON; **CẤM TUYỆT ĐỐI** bắt Sub-Agent tạo thêm file `scratch/w*_report.md` rồi bắt Giám sát/Tổng Chỉ Huy đọc lại gây nhân đôi I/O (chỉ ghi file báo cáo khi nhiệm vụ là điều tra/kiểm toán độc lập thuần túy).
  - **CẤM TUYỆT ĐỐI** truyền chuỗi code nhiều dòng qua `python -c "..."` trên PowerShell (nguyên nhân số 1 gây lỗi dấu nháy `SyntaxError` làm Sub-Agent bị kẹt lặp `200–330 bước`). Nếu gặp lỗi quá `2 lần`, Sub-Agent phải dừng ngay và gửi JSON báo `FAIL` về Tổng Chỉ Huy, cấm tự lặp thử sai quá `20 steps`.
- **5.4. Biên chế Chuẩn Khi Chạy Chiến Dịch Lớn (`>= 4 files`) & Thu hồi Quân (`Auto-Reap`)**:
  1. **`5 – 10` Công Nhân Thực Thi (`Worker Sub-Agents`, `Model="flash"`)**: Mỗi công nhân phụ trách độc lập 1 khoảnh (`1 Công nhân = 1 Khoảnh độc lập`), tuyệt đối không chạm chung 1 file. Cấm huy động lạm phát `15 – 50` Sub-Agent hay đẻ Sub-Agent đóng vai giám sát khi đã có script Gatekeeper tự động.
  2. **Cách ly Tài nguyên Sống & Thu hồi Quân**: Cấm 2 Sub-Agent cùng ghi chung 1 DB SQLite, cấm cùng chạy build/chiếm cổng server, tuyệt đối không làm nháy cửa sổ Chrome/Zalo của Bố. Kết thúc mỗi đợt (Wave), bắt buộc dùng `manage_subagents(Action="kill")` hoặc `Action="kill_all"` để thu hồi toàn bộ Sub-Agent.

---

## 6. KỶ LUẬT CHỐNG QUÊN, CHỐNG TRÀN CONTEXT & BỘ NHỚ NGOÀI BẤT TỬ (ANTI-AMNESIA & ZERO-CONTEXT BLEED PROTOCOL)
- **6.1. Giao Thức Báo Cáo Sub-Agent Siêu Gọn (`Minimal JSON Payload <= 3 dòng`)**:
  + Cấm tuyệt đối các Sub-Agent nhả nguyên file code, log dài hoặc báo cáo văn xuôi hàng trăm dòng qua `send_message` về cho Tổng Chỉ Huy (triệt tiêu hiệu ứng tuyết lăn `Context Bloat`).
  + Tin nhắn `send_message` gửi về Tổng Chỉ Huy **chỉ được phép dài tối đa 3 dòng theo chuẩn JSON**: `{"status": "PASS/FAIL", "modified_file": "đường_dẫn_file_đích", "summary": "tóm tắt <= 15 từ"}`.
  + Ngay sau khi nhận đủ báo cáo và kết thúc đợt (Wave), Tổng Chỉ Huy bắt buộc gọi `manage_subagents(Action="kill_all")` xóa sổ ngay lập tức.
- **6.2. Tra Cứu Sổ Tay Đúng Chỗ Khi Cần (`On-Demand Targeted Lookup — Cấm Đọc Mù Toàn Bộ Sổ Tay Đầu Phiên`)**:
  + Mọi dự án có thư mục `luat_sat_chi_tiet/` đều đã có Bảng Mục Lục (`Rule Index`) và bản tóm tắt cốt lõi ngay trong `GEMINI.md` (giữ dung lượng `GEMINI.md < 25 KB`).
  + **CẤM TUYỆT ĐỐI** thói quen máy móc đầu mỗi phiên tự động gọi `read_file` nạp toàn bộ các file sổ tay dài `45 – 85 KB` trong `luat_sat_chi_tiet/` khi chưa cần đến. Chỉ mở đúng đoạn (`StartLine`/`EndLine`) của file sổ tay tương ứng khi gặp ca biên (edge-case) cần tra cứu thông số chi tiết.
- **6.3. Sổ Cái Bộ Nhớ Ngoài Bất Tử (`PROJECT_STATE.md`)**:
  + Mỗi dự án bắt buộc duy trì file `PROJECT_STATE.md` tại thư mục gốc để lưu: (1) Mục tiêu & Chỉ thị mới nhất của Bố, (2) Tiến độ thực tế từng hạng mục đã kiểm chứng trên ổ cứng, (3) Các ràng buộc/lỗi cấm tái phạm, (4) Việc cần làm tiếp theo.
  + Trước và sau mỗi đợt tác vụ hoặc ngay khi hệ thống vừa nén lịch sử (`<CONTEXT_SUMMARY>`), Tổng Chỉ Huy bắt buộc đọc/cập nhật `PROJECT_STATE.md`.
- **6.4. Giao Thức Chống Mù Ảnh Sau Khi Nén (`Anti-Image Blindness`)**:
  + Khi lịch sử xuất hiện dòng `[file "...png/jpg" was omitted...]` sau khi nén (`Compaction`), AI bắt buộc gọi `read_file` mở lại đường dẫn ảnh gốc khi cần đối chiếu trực quan, tuyệt đối cấm đoán mò nội dung ảnh từ trí nhớ.
- **6.5. Vệ Sinh Đọc File (`Pagination Hygiene`) & Cổng Nghiệm Thu Vật Lý (`Physical Disk Gate`)**:
  + Cấm đọc nguyên file HTML/JSON/log lớn (`> 200 dòng`) vào context; bắt buộc dùng `StartLine`/`EndLine` hoặc script lọc tóm tắt.
  + Cấm báo cáo `PASS` khi mới tạo xong file code/dàn ý (`.html`, `.json`, `.py`); bắt buộc kiểm tra sản phẩm vật lý thật trên đĩa (ảnh `.png/.jpg > 50 KB`, video `.mp4 > 500 KB`, DB SQLite có bản ghi thật).
- **6.6. Ngưỡng Xoay Vòng Phiên Chat (`Session Rotation Threshold`)**:
  + Khi file DB phiên chat (`<id>.db`) vượt `40 MB` hoặc vượt `3.000 steps`, AI chủ động ghi toàn bộ trạng thái vào `PROJECT_STATE.md` và nhắc Bố dùng `/compact` hoặc mở phiên chat mới để tránh chạm trần bộ nhớ `2.8 GB Heap` gây `server restart`.

---

## 🧭 VII. BẢN ĐỒ TỌA ĐỘ DÒNG (`CODEBASE LINE-MAP INDEX` — ĐỌC 1 LẦN TRÚNG ĐÍCH)
> **Kỷ luật Single-Pass Read (`<= 2 lần/file`)**: Dùng bảng tọa độ dưới đây để nhảy thẳng tới vùng code cần sửa bằng `StartLine`/`EndLine` (`150–250 dòng`), cấm đọc mù từng khúc nhỏ:
- **`web_app/index.html` (`6.704` dòng)**:
  + `Dòng 1 – 660`: Khối `<head>`, biến CSS Root Luxury & hệ thống `@media print` cô lập in ấn (`pghome-print-isolated`).
  + `Dòng 661 – 1150`: Khung Layout chính, Sidebar điều hướng phân hệ & Header trạng thái đồng bộ.
  + `Dòng 1151 – 2850`: Các View Quản trị Doanh nghiệp, Báo giá, Hợp đồng, Công nợ & Tài chính 55/40/15.
  + `Dòng 2851 – 4800`: Hệ thống 57 Modules (`W01`–`W57`), Nhân sự, Bảng lương, KPI & Phê duyệt chi phí.
  + `Dòng 4801 – 6704`: Vùng `printCleanArea`, Modal chi tiết chứng từ, Script khởi tạo & nạp các module `w01`–`w57`.
- **`web_app/app.js` & `web_app/w01_*.js` .. `w57_*.js`**:
  + Logic mỗi phân hệ nằm độc lập tại file `wXX_*.js` tương ứng; khi sửa phân hệ nào chỉ đọc đúng file `wXX_*.js` đó.
- **`tools/sop_pre_response_gate.py`**: Cổng kiểm định 1 lần cuối ca (`Single-Run Gatekeeper < 1.2s`).
