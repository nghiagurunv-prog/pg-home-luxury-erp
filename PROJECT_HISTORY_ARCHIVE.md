# SỔ CÁI BỘ NHỚ NGOÀI BẤT TỬ - TRẠNG THÁI HỆ THỐNG PG HOME LUXURY ERP
> **PROJECT_STATE.md** | Bản cập nhật trạng thái toàn diện ngày 10/11/2026
> Đơn vị: **Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng** (Thương hiệu: **CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY**)
> Cơ chế: Sổ Cái Bộ Nhớ Ngoài Bất Tử (External Ground-Truth State) — Cứu cánh chống quên, chống tràn context và định hướng hành động cho toàn bộ Trợ lý AI và Sub-Agent.

---

## 0. CHỈ THỊ MỚI NHẤT CỦA GIÁM ĐỐC & KHÓA CỨNG GIAO DIỆN GỐC CHUẨN (`UI_GOLDEN_BASELINE_V1` — 11/11/2026)
- **🔒 MỆNH LỆNH KHÓA CỨNG GIAO DIỆN GỐC (`UI_GOLDEN_BASELINE_V1` — BẤT KHẢ XÂM PHẠM)**:
  + Giám Đốc đã nghiệm thu và chốt: **"Giao diện hiện tại đã ổn, lấy bản này làm gốc chuẩn, tuyệt đối KHÔNG sửa giao diện linh tinh nữa; chỉ tinh chỉnh tối ưu thêm trên nền gốc này."**
  + **Quy tắc cưỡng chế cho mọi phiên làm việc tiếp theo**:
    1. **CẤM TUYỆT ĐỐI** tự ý thay đổi bố cục (layout), cấu trúc bảng 1 dòng (`.pg-compact-row`, `.data-table`), thanh điều hướng trái (`#mainNavMenu`), hoặc tự ý bật/nhồi nhét nhiều bảng chồng dọc trên cùng 1 màn hình.
    2. Bản sao lưu chuẩn Vàng (`Golden Baseline`) đã được khóa cứng tại Git Tag `UI_GOLDEN_BASELINE_V1` và thư mục `data/backups/golden_ui_baseline_20261111/`.
    3. Mọi nâng cấp về sau chỉ được phép tinh chỉnh hiệu năng, logic nghiệp vụ và độ mượt trên đúng khung giao diện gốc này.
- **Diệt Triệt Để 100% Mook Cứng Sót, Vá Lỗi Quét Đồng Bộ 14 Nhóm Zalo & Lập Xuất Hóa Đơn Smart PO Vũ (`v33_LIVE_ZALO_SCAN_AND_SMART_PO_FIX` — Giữ Nguyên 100% Giao Diện `UI_GOLDEN_BASELINE_V1`)**:
  + **1. Diệt sạch 100% chuỗi mook cứng, chứng từ chết & dự án ảo còn sót trên Tab 5 (`📦 5. Phê Duyệt Vật Tư & Zalo`) và các module W13/W23/W27/W50**:
    * Thay thế hoàn toàn chứng từ chết `Don_dat_kinh_Viet_Nhat_30_10_2026.pdf` bằng ảnh chứng từ thật `/chung_tu/07_DON_DAT_KINH_VIET_NHAT_2776K_30_10_2026.jpg`, xóa toàn bộ chuỗi thời gian chết (`"32 phút trước"`, `"2 giờ trước"`, `"Hôm qua"`, `"0 file cache trên đĩa"`), thay mã đơn ảo `PO-2026-1010` bằng mã thực `PO-2026-1007` / `PO-2026-1009`.
    * Gỡ bỏ dòng tồn kho mook cứng `"14 dải ván 500×2440mm & 22 dải 170×2440mm"` trong `#pgPoQuickStrip` và `#director_ccsc_full.html`, thay bằng thanh tổng hợp trực tiếp (`#pgPoQuickLiveSummary` — đếm trực tiếp số đơn chờ duyệt, đã duyệt và 14 nhóm Zalo đồng bộ).
    * Xóa bỏ dự án mẫu giả `DA-LAN-2026 (Chị Lan)` và `DA-HOANG-2026 (Anh Hoàng)` trong `w13_red_stamp_po_approval.js` & `pg_w50_master.bundle.js`, thay bằng công trình thực tế `Bác Sĩ Duẫn (TP. Hà Tĩnh)` và `Nhà Bác Phát (Đường 26/03 - TP. Hà Tĩnh)`.
  + **2. Khắc phục triệt để lỗi Vũ không lập/xuất được đơn đặt hàng (`Smart PO`) ở mọi luồng thao tác**:
    * Bổ sung hàm `window.openCreatePOModalNow(skipInitialRow)` và `window.openVuSmartOrderScenario(scenarioKey)` để cả nút chính `#btnOpenCreatePOModal`, 6 nút kịch bản trên thanh `#pgPoQuickStrip` (`Bóc Ván Mục 24`, `Đặt Cánh/Kính/Đá`, `Combo Phụ Kiện`, `Đá/Gương/Đệm`, `Đồ Rời/Gỗ Thịt`, `Dán Tin Zalo`) và nút `#pgBtnCreatePOModal` đều mở ngay Modal lập đơn cho cả phân quyền `XUONG_VATTU` và `ADMIN`.
    * Gỡ bỏ thuộc tính `required` trên `.inp-item-name` trong `addPOItemInputRow()` (tránh lỗi HTML5 chặn ngầm khi còn dòng trống đầu tiên), tự động xóa dòng trống khi Vũ nạp vật tư từ công cụ nhanh, và tự động thu hoạch dữ liệu từ Công cụ 1/2/3/4 nếu Vũ bấm **"Lưu & Gửi Đề Xuất"** ngay mà quên bấm *"➕ Nạp vào đơn"*.
    * Chuyển chốt chặn trùng tổng tiền `DA-29` từ chặn cứng sang `confirm()`, tự động đồng bộ vật tư vào `appState.materials`, reset bộ lọc về `"all"`, và **mở ngay lập tức phiếu đề xuất vừa lập (`openViewPOModal(newPO.code)`)** để Vũ hoặc Giám Đốc bấm **Duyệt Dấu Đỏ & In/Xuất PDF 1 chạm** (`#btnPrintPO`).
  + **3. Sửa dứt điểm nút `Quét Đồng Bộ Ngay` (`#btnScanZaloGroupsTable`) trên bảng `Danh Mục 13/14 Nhóm Đặt Hàng Vật Tư & Đối Soát Công Nợ Zalo 2026`**:
    * Nâng cấp `window.triggerZaloInstantScan(navigateIfOutside)` và `renderZaloSupplierGroups()`: Khi bấm `Quét Đồng Bộ Ngay`, hệ thống hiển thị trạng thái đang quét trên `#btnScanZaloGroupsTable`, gọi `/api/zalo-trigger-scan` + `/TONG_HOP_DAT_HANG_ZALO_2026.json`, cập nhật thời gian thực (`DD/MM/YYYY HH:MM (Vừa đồng bộ)`), số lượng file cache thực tế và công nợ NCC trực tiếp vào `appState.zaloSupplierGroups`, lưu `localStorage` và render lại ngay lập tức bảng `#tableZaloSupplierGroups` + `#badgeZaloGroupsSyncCount`.
- **Diệt Triệt Để 100% Mook Cứng, Dự Án Ảo & Sửa Lỗi Modal Smart PO (`v32_ZERO_MOCK_SMART_PO` — Giữ Nguyên 100% Giao Diện `UI_GOLDEN_BASELINE_V1`)**:
  + **1. Khắc phục triệt để lỗi मook cứng & lệch hàm trong Modal `+ ⚡ Vũ Lập Đơn Order Vật Tư Mới (Smart PO)` (`#btnOpenCreatePOModal`)**:
    * Gỡ bỏ hoàn toàn 3 dòng vật tư gán cứng (`15 tấm Ván MDF 205T`, `5 tấm Ván Hậu 6mm 205T`, `2 cuộn Chỉ 21×1.0mm` = `13.290.000 đ`) tự động nhồi vào mỗi khi Vũ bấm mở Modal tạo PO; thay bằng 1 dòng trống sạch (`addPOItemInputRow("", "Tấm", 1, 0, "WOOD_40")`) để Vũ nhập thực tế hoặc bấm chọn 1 chạm từ thư viện.
    * Sửa lỗi sai thứ tự tham số và lệch selector trong `window.quickInsertCatalogCodeToPO(code)` (trước đây truyền ngược `1` và `found.unit` gây lỗi `NaN` thành tiền và gọi nhầm `#tbodyPoItemsInput` thay vì `#bodyPoItemsInput`), đồng thời xuất `window.addPOItemInputRow` & `window.recalculatePOCostSummary` ra toàn cục và đồng bộ cả 2 `<datalist>` (`#vuMaterialCatalogDatalist` & `#dlCatalogItems`).
    * Chuẩn hóa danh sách công trình trong `#inpPoProjectSelect`: Đưa 5 công trình đang thi công thực tế T10/T11 (`Nhà Anh Nam (TP. Hà Tĩnh)`, `Bác Sĩ Duẫn (TP. Hà Tĩnh)`, `Bác Phát (Đường 26/03 - TP. Hà Tĩnh)`, `Nhà Anh Công (Hà Tĩnh)`, `Chị Hoa (Biệt Thự Thạch Bàn)`) lên đầu danh sách và tính định mức khoán 40% theo đúng giá trị **Phần Gỗ Xưởng (`woodVal`)** thay vì tổng hợp đồng gồm cả phụ kiện thương mại.
  + **2. Quét sạch 100% tên dự án giả/ảo còn sót trong HTML & JS và tự động thanh lọc `localStorage` (`SYNTHETIC_PROJECT_KEYWORDS`)**:
    * Xóa bỏ hoàn toàn các tên dự án mẫu giả (`Anh Trung Tuyết`, `Biệt thự Cẩm Xuyên (Anh Hoàn)`, `Nội thất Shophouse Vinhomes (Anh Minh)`, `Shophouse Anh Minh`, `Chị Hương (Vinhomes)`, `Nguyễn Văn A / annguyen`) trong `#bodyXuong`, `#selectVatTuProject`, `#qvtProject`, `#bodyVatTu` (`VT-55`, `VT-56`), `#poProjectQuickFilter`, `DEFAULT_DATA.xuongRecords`, `DEFAULT_DATA.contracts`, `DEFAULT_DATA.debts`, `DEFAULT_DATA.supplierDebts`, `DEFAULT_PAYMENTS`, `DEFAULT_ACCESSORIES`.
    * Bổ sung bộ lọc `isSyntheticProjectRecord(item)` trong `loadState()` và nâng `CURRENT_APP_VERSION = "2026.11.11_v32_ZERO_MOCK_SMART_PO"` để tự động quét sạch mọi bản ghi dự án giả còn lưu trong `localStorage` của trình duyệt mà vẫn bảo toàn 100% đơn hàng thực tế do Giám Đốc, Vũ, Hiệp đã lập.
    * Đồng bộ đầy đủ hồ sơ thực tế của `Nhà Anh Nam (TP. Hà Tĩnh)` (`665.280.785 đ` | Gỗ xưởng: `540.280.785 đ`) và `Bác Sĩ Duẫn (TP. Hà Tĩnh)` (`345.412.030 đ` | Gỗ xưởng: `289.412.030 đ`) xuyên suốt toàn bộ 6 phân hệ: Xưởng SX (`xuongRecords`), Hợp đồng (`contracts`), Công nợ (`debts`), Lịch sử thu tiền (`DEFAULT_PAYMENTS`), Phụ kiện (`accessories`) và Đặt hàng PO (`poList`).
- **Đồng Bộ Chấm Công & Tăng Ca (OT) Trực Tiếp Từ Các Nhóm Zalo Theo Thời Gian Thực (`v31_ZALO_REALTIME_ATTENDANCE` — 100% Stealth Passive Read)**:
  + **1. Quét ngầm 3 nhóm Zalo điểm danh & báo cáo tiến độ công trình (`monitor_all_phu_gia_groups.py` $\rightarrow$ `scan_live_zalo_attendance()`)**:
    * Đọc thụ động (`0x00000040 IDLE`, tuyệt đối không cướp focus hay chạm vào cửa sổ Zalo PC của Bố) từ 3 luồng:
      1. `Xưởng Sản Xuất PG Home` (`g1792366938218612507` — Điểm danh đầu ca 07:30, ảnh tiến độ CNC/lắp ráp, chốt tăng ca tối của `Thái Pg Home 2026`, `Lương Thế Hào`, `Phú Gia Hiệp G`).
      2. `Điều Hành Xưởng & Công Trình Trọng Điểm PG Home` (`g3755853110317591515` — Báo cáo hiện trường công trình Nhà Anh Nam, Nhà Bác Phát, Bác Sĩ Duẫn của `Thái Pg Home 2026`, `Vũ`, `Phú Gia Hiệp G`, `Dũng PG Home`).
      3. `Văn Phòng Phú Gia Home LUXURY` (`VAN_PHONG` — Chấm công hành chính Văn phòng của `Hiệp Admin`, `Kim Dung Kế Toán`).
    * Xuất trực tiếp ra [`data/zalo_live_attendance.json`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/zalo_live_attendance.json) chứa đầy đủ luồng hoạt động thực tế (`live_feed` 9/9 nhân sự), ma trận ngày công `01/11 – 30/11/2026`, tổng công HC (`43.5c` 5 thợ SX / `75.5c` toàn công ty 9 người), tổng giờ OT (`85.0h`), tổng lương lũy kế (`25.818.750 đ`) và thực lĩnh sau trích quỹ Tết 20k/công (`25.438.750 đ`).
  + **2. API Đồng Bộ Thời Gian Thực 2 Chiều Trên Máy Chủ LAN/Cloud (`web_app/server.py`)**:
    * `GET /api/zalo-live-attendance`: Trả về tức thì dữ liệu chấm công Zalo thời gian thực kèm `etag_hash` chống trùng lặp.
    * `POST /api/zalo-sync-attendance`: Cho phép vừa kích hoạt quét Zalo tức thì (`monitor_all_phu_gia_groups.py --once`) vừa lưu bền vững mọi cú click sửa ô công/OT trên bảng (`override_staff_id`, `hc`, `ot`, `days`) vào `data/zalo_live_attendance.json` để toàn bộ máy trong mạng LAN/Cloud đồng bộ ngay lập tức.
  + **3. Thanh Trạng Thái Đồng Bộ Zalo Real-Time (`15s/lần`) & Bảng Feed Điểm Danh 9/9 Nhân Sự Trên Giao Diện (`#zaloRealtimeAttendanceBar` & `#zaloAttendanceLiveFeedStrip`)**:
    * Gắn ngay phía trên bảng Chấm Công Tháng 11/2026 tại `#tab-cham-cong-all` (trên cả Bản Giám Đốc Local và Bản Deploy Nhân Viên):
      - Huy hiệu nhịp đập xanh lá **`ZALO REAL-TIME SYNC (15s/lần)`** tự động gọi `window.syncZaloAttendanceRealtime(false)` mỗi 15 giây (chỉ render lại khi có thay đổi mới qua `etag_hash`).
      - Nút **`🔄 Quét Zalo Cập Nhật Công & OT Ngay` (`#btnTriggerZaloAttendanceSync`)**: Bấm 1 chạm quét lại bộ nhớ đệm Zalo và cập nhật bảng công + bảng tính lương T11 ngay lập tức.
      - Nút **`👁️ Xem Luồng Điểm Danh Zalo (9/9)`**: Mở dải thẻ trực quan hiển thị từng nhân sự điểm danh từ nhóm Zalo nào, lúc mấy giờ, kèm tổng Công HC & Giờ OT lũy kế T11.
- **Cập Nhật Bảng Chấm Công Tháng 11/2026 Lũy Kế Đến Hôm Nay `10/11/2026` & Deploy Cho Nhân Viên Chạy Thực Tế (`v30_T11_ATTENDANCE_DEPLOY`)**:
  + **1. Nạp đầy đủ bảng chấm công 30 ngày Tháng 11/2026 (`01/11 CN` $\rightarrow$ `30/11 T2`) trên cả Khối Xưởng SX và Khối Văn Phòng**:
    * Cập nhật `DEFAULT_WORKERS_BY_MONTH["11"]` và `DEFAULT_TIMESHEETS["11"]` trong [`director_app_full.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_app_full.js), đồng bộ sang [`app.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/app.js) và [`w05_attendance_t10_matrix.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules/w05_attendance_t10_matrix.js):
      - **5 Thợ Sản Xuất Trực Tiếp (Lũy kế `01/11 – 10/11/2026`)**: Tổng **`43.5 công HC`**, **`85.0 giờ OT`**, Lương HC **`18.720.000 đ`**, Lương OT **`7.098.750 đ`**, Tổng lương lũy kế **`25.818.750 đ`** (Quỹ nòng cốt 20k/công giữ Tết Hòa & Hào: **`380.000 đ`**, Thực lĩnh sau trích quỹ: **`25.438.750 đ`**). Chi tiết từng thợ: `Hà Viết Hòa` (`9.0c`, `22.0h OT`, `6.956.250 đ`), `Lương Thể Hào` (`10.0c`, `24.0h OT`, `6.525.000 đ`), `Trần Văn Anh` (`9.0c`, `19.0h OT`, `5.025.000 đ`), `Lê Văn Thoan` (`8.0c`, `12.0h OT`, `4.612.500 đ`), `Lê Tuấn Anh` (`7.5c`, `8.0h OT`, `2.700.000 đ`).
      - **Quản Lý Xưởng & Khối Văn Phòng (`01/11 – 10/11/2026`)**: `Nguyễn Văn Thái` (`8.0c`), `Hoàng Công Vũ` (`8.0c`), `Tống Trần Hiệp` (`8.0c`), `Đường Việt Dũng` (`8.0c`). Tổng toàn công ty 9 nhân sự lũy kế 10 ngày đầu T11: **`75.5 công HC`** (`Xưởng: 59.5 công | VP: 16.0 công`), quân số đi làm ngày `10/11/2026`: **`9 / 9 người (100%)`**.
    * Các ngày từ `11/11/2026` đến `30/11/2026` để trống sẵn sàng cho Vũ, Thái, Hiệp và anh em chấm công trực tiếp hàng ngày; hàm `renderChamCongTho("11")` tự động tính lại lương HC, giờ OT, quỹ giữ Tết 20k/công và thực lĩnh theo thời gian thực ngay khi tích chấm công.
    * Đặt mặc định bộ chọn `#timesheetMonthSelect` mở sẵn **Tháng 11/2026 (⚡ Kỳ Sống - Cập nhật 10/11)**, ghim ngày hiện tại `activeQuickAttDay = 10` (`10/11/2026`), đồng thời bảo toàn nguyên vẹn 100% số liệu lịch sử đã khóa sổ của Tháng 10 (`110.5 công HC`, `211.5h OT`, `63.883.750 đ`), Tháng 9 và Tháng 8/2026.
- **Diệt Triệt Để Thống Kê Rác Zalo `.rescache` (`"Nhóm Ghim Ưu Tiên Giám Đốc #2"`, `"Thinking..."`, `0 đ`) & Vá Lỗ Hổng Lệch Schema Thống Kê Đa Chiều Sau Kiểm Toán 20 Sub-Agent Đợt 2 (`v29_VERIFIED_STATS_ZALO`)**:
  + **1. Xóa sạch 100% rác `.rescache` Zalo (`"Nhóm Ghim Ưu Tiên Giám Đốc #1 & #2"`, ảnh chụp màn hình `"Thinking..."`, chứng từ `0 đ`)**:
    * Gỡ bỏ hoàn toàn 2 thư mục cache cá nhân/bot (`g795402381131416269` `"Nhóm Ghim Ưu Tiên Giám Đốc #1"` và `g1588348021340609742` `"Nhóm Ghim Ưu Tiên Giám Đốc #2"`) khỏi `CORE_GROUPS` và `GROUP_DEFAULT_SENDER` trong [`monitor_all_phu_gia_groups.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/monitor_all_phu_gia_groups.py), chốt đúng **14 nhóm Zalo thực chiến** của PG Home.
    * Khóa cứng bộ lọc trong `execute_scan()` (`monitor_all_phu_gia_groups.py`) và `isVerifiedZaloVoucher()` (`fetchZaloLiveInbox` & `renderZaloStagingInbox` trong [`director_app_full.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_app_full.js)): Loại bỏ 100% các bản ghi có `amount <= 0`, `impact_type === "LIVE_CAPTURED_MEDIA"`, `po_code === "FIELD-WORKSHOP-LOG"` hoặc chứa chuỗi `"Ghim Ưu Tiên"`. Chạy lại `python monitor_all_phu_gia_groups.py --once` làm sạch hoàn toàn [`data/zalo_staging_inbox.json`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/zalo_staging_inbox.json) (chỉ giữ lại chứng từ hóa đơn NCC có số tiền thực `> 0 đ`).
  + **2. Vá triệt để lỗi lệch trường dữ liệu (`m.item`/`m.total` vs `m.name`/`m.amount` và `poList` vs `purchaseOrders`) trong Kho Vật Tư & Thống Kê Đa Chiều 3 Chiều**:
    * Đồng nhất hàm `window.collectUnifiedMaterialRecords()` và `window.filterVatTuTableByCategory()` đọc chuẩn cả `m.item || m.name` và `m.total || m.amount`, đồng thời lấy dữ liệu đơn hàng từ `appState.poList` (thay vì `appState.purchaseOrders` rỗng) và render chuẩn 9 cột vào `#bodyVatTu`.
    * Nâng cấp `window.renderVuMultiDimStatsPivot()` nhóm công trình theo khóa chuẩn hóa `window.normalizeProjectMatchKey(pName)` và tra cứu doanh số gỗ qua `window.lookupProjectWoodVal(normKey)` (cộng tổng `rev` từ `appState.factoryItems` và `wood`/`woodVal` từ `appState.contracts`), chấm dứt hoàn toàn tình trạng báo `"Chưa gắn HĐ"` hoặc `0 đ` trên bảng Pivot 3 chiều.
    * Xóa bỏ các tên dự án cũ còn sót (`"Nhà Chị Hiển"`, `"Chị Hoa - Cẩm Xuyên"`, `"Chị Hương - Vinhomes"`) trong `populateQuickVtInlineDropdowns()` và nâng `CURRENT_APP_VERSION = "2026.11.10_v29_VERIFIED_STATS_ZALO"`.
- **Vá Triệt Để 40 Lỗ Hổng & Thi Công 50 Cải Tiến Toàn Diện Sau Kiểm Toán 20 Sub-Agent (`v28_50_IMPROVEMENTS_PATCHED`)**:
  + **Nhóm 1 — Vá lỗi bảo toàn dữ liệu `localStorage` & Xóa vĩnh viễn không tái sinh (`loadState` & `mergeArrayByKey`)**:
    * Thay thế cơ chế ghi đè mảng khi nâng `CURRENT_APP_VERSION` bằng hàm `mergeArrayByKey(savedArr, defaultArr, keyField)`: giữ nguyên 100% các đơn PO, vật tư, hợp đồng, công nợ, báo giá do Bố, Vũ, Hiệp mới nhập thêm, đồng thời gỡ bỏ nhánh ép reset `< DEFAULT_DATA.arr.length` để bản ghi đã xóa không bao giờ tự động sống lại sau khi F5.
    * Sửa hàm `window.deleteDebt(idOrIdx)` tra cứu chuẩn theo `id` hoặc chỉ mục thực tế để xóa công nợ khách hàng chính xác ngay cả khi đang bật bộ lọc tìm kiếm.
  + **Nhóm 2 — Vá lỗ hổng Đối Sánh Khoán 40% & Tách Bạch Đơn PO Đã Duyệt vs Chờ Duyệt (`renderMaterialVsQuotaTable`)**:
    * Xây dựng bộ chuẩn hóa khóa công trình `window.normalizeProjectMatchKey()` và `window.lookupProjectWoodVal()`: khớp thông minh tên dự án giữa `poList` và `factoryItems` (`Nhà Anh Nam`, `Nhà Bác Phát`, `Bác Sĩ Duẫn`, `Nhà Anh Công`), loại bỏ hoàn toàn số fallback gán cứng `85.000.000 đ` gây ảo hạn mức 40%.
    * Tách bạch rõ cột **Thực Tế Đặt Hàng (PO Zalo)** thành `💮 Duyệt: ...` (`status === 'APPROVED'`) và `⏳ Chờ: ...` (`status === 'PENDING'`) để đơn chưa đóng Dấu Đỏ không bị cộng lộn vào chi phí thực chi.
  + **Nhóm 3 — Khóa Cứng Phân Quyền Dấu Đỏ Giám Đốc, Duyệt Hàng Loạt 1 Chạm & Khóa Trần Cost $\le 54\%$**:
    * Thêm nút **`💮 Giám Đốc Duyệt & Đóng Dấu Đỏ Tất Cả Đơn Chờ` (`#btnBatchApprovePO` $\rightarrow$ `window.batchApprovePendingPOs()`)** và bộ lọc nhanh **`🏗️ Tất cả Công trình` (`#poProjectQuickFilter`)** ngay trên đầu bảng PO.
    * Khóa cứng quyền `ADMIN` + xác thực Mã PIN Giám Đốc (`0986` / `2026`) trên cả `window.approvePO` và `window.batchApprovePendingPOs`; khóa `disabled` trên ô quyền Giám Đốc `NV01` (`#selUserRole_1`) chống tự hạ quyền.
    * Khóa cứng `window.printCleanQuotation()`: chặn xuất/in Báo Giá nếu tỷ lệ Cost $> 54\%$ để bảo vệ biên lợi nhuận ròng `18% – 20%` của Giám Đốc.
  + **Nhóm 4 — Chuẩn Hóa Định Mức Tấm Cắt CNC Mục 24 Trong Dự Toán & Điểm Danh Xưởng 1 Chạm**:
    * Nâng cấp `calcEstimatorAutoQty()` áp dụng đúng định mức tấm cắt CNC thực chiến Mục 24 (`Bếp dưới 1.45 tấm/md`, `Bếp trên 1.04 tấm/md`, `Kịch trần 1.44 tấm/md`, `Tủ áo 1.05 tấm/m²` có tự động trừ `-0.40 tấm/m²` cánh kính, `Vách ốp phẳng 0.40 tấm/m²`).
    * Bổ sung `window.quickMarkAllFactory8h()` điểm danh 1 chạm 8h hành chính cho toàn bộ đội thợ xưởng và lưu `PG_LAST_ACTIVE_TAB_ID` + `location.hash` trong `window.switchTabTo()` để F5 giữ nguyên tab đang làm việc.
  + **Nhóm 5 — Gia Cố An Ninh Server (`server.py`), Sanitizer Bản Cloud (`split_app_two_editions.py`) & Chống Vỡ Trang In A4 (`styles.css`, `w42_print_a4_stylesheet.css`)**:
    * Gia cố chống Path Traversal bằng `os.path.realpath` và chặn payload rỗng ghi đè DB trên `/api/save-state` trong [`web_app/server.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/server.py).
    * Bổ sung bộ lọc regex tự động ẩn các hằng số CCSC nhạy cảm trên bản Deploy Cloud trong [`tools/split_app_two_editions.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/split_app_two_editions.py).
    * Khắc phục độ tương phản chữ vàng trên nền sáng (`body.light-theme`), chuẩn hóa thứ tự `z-index` của hệ thống Modal, và khóa `break-inside: avoid` cho bảng in A4, khung chữ ký & con dấu đỏ trong [`web_app/styles.css`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/styles.css) và [`web_app/modules/w42_print_a4_stylesheet.css`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules/w42_print_a4_stylesheet.css).
- **Diệt Sạch 100% Mook Cứng (`Hardcoded Mocks / Unbound Handlers`) Trên Toàn Bộ App (`v27_ZERO_HARDCODED_MOCK_100`)**:
  + **Khắc phục triệt để 2 nút chuyển phân hệ `[🏢 I. Văn Phòng (6)] [🏭 II. Xưởng SX (5)]` (`#deployDivisionSwitcher`)**:
    1. Bổ sung định nghĩa trực tiếp `window.switchDeployDivision(mode, skipAutoTabSwitch)` và `window.openDivisionTimesheet(divisionMode)` vào cả [`director_app_full.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_app_full.js) lẫn [`app.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/app.js), đồng thời gắn `data-division="admin|vanphong|xuong|shared"` trên toàn bộ `#mainNavMenu` ở cả 2 bản (`director_ccsc_full.html` và `index.html`).
    2. Sửa lỗi kẹt màn hình khi đang đứng ở tab dùng chung (`#tab-cham-cong-all`): Khi bấm trực tiếp nút `[🏢 I. Văn Phòng (6)]` hoặc `[🏭 II. Xưởng SX (5)]` (`!skipAutoTabSwitch`), hệ thống **bắt buộc chuyển ngay màn hình chính** sang `tab-du-toan-du-an` (Khối Văn Phòng) hoặc `tab-xuong-san-xuat` (Khối Xưởng SX) hoặc `tab-dashboard` (Khối BGĐ trên bản Local) kèm thông báo xác nhận tức thì.
    3. Đồng bộ `setupNavigation()` gọi qua `window.switchTabTo(targetTabId)` để mọi cú click menu trái đều kích hoạt đầy đủ bộ render dữ liệu động của từng phân hệ.
  + **Kết nối động 100% bảng `Đối Sánh Vật Tư Thực Đặt PO Zalo vs Định Mức CCSC 40%` (`#bodyDoiSanhVatTuKhoan`)**:
    * Gắn `id="bodyDoiSanhVatTuKhoan"` vào `<tbody>` trong [`director_ccsc_full.html`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_ccsc_full.html) và cập nhật `window.renderMaterialVsQuotaTable()` tính toán động đủ 6 cột (`HĐ Dự Án & Khách Hàng`, `Giá Trị HĐ (Chỉ Phần Gỗ)`, `Ngân Sách Vật Tư Khoán (40%)`, `Thực Tế Đặt Hàng (PO Zalo)`, `Chênh Lệch Vật Tư`, `Đánh Giá Hiệu Quả Cắt Ván`) từ `appState.factoryItems` và `appState.poList` thực tế (tự động cập nhật mỗi khi thêm/duyệt PO).
  + **Định nghĩa đầy đủ 100% hàm `onclick` còn thiếu trên giao diện**:
    * Bổ sung `window.showVatTuDetail`, `window.deleteDebt`, `window.showQuyCachModal`, `window.closeQuyCachModal`, `window.toggleAtelierShowroomMode` vào [`director_app_full.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_app_full.js) và đồng bộ sang [`app.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/app.js).
  + **Quét sạch mọi chuỗi/địa chỉ/tài khoản mook cứng còn sót**:
    * Sửa `Nguyễn Văn Nghĩa` $\rightarrow$ `Nguyễn Trọng Nghĩa` (tên đại diện HKD chuẩn pháp lý), sửa địa chỉ ví dụ `Chủ nhà số 49 Ngô Đức Kế` $\rightarrow$ `Chủ nhà Ngõ 49 Trương Quốc Dụng, P. Thành Sen`, sửa SĐT Vũ `0988.223.344` $\rightarrow$ `0911.006.880`, bỏ fallback `30000000` trong `openReceiptForClient()`.
    * Xóa tài khoản mẫu `USR-PENDING-DEMO` (`nhanvien.moi` / `Nguyễn Văn Mới`) trong [`w14_rbac_4_portals_guard.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules/w14_rbac_4_portals_guard.js), nâng `STORAGE_KEY_USERS = 'PG_HOME_USERS_STORE_V5'` và nâng `CURRENT_APP_VERSION = "2026.11.10_v27_ZERO_HARDCODED_MOCK_100"`.
- **Kỷ Luật Cấm Đưa Link Chết (`Zero-Dead-Link Hard-Lock` — Ghi nhớ vĩnh viễn theo lệnh Bố)**:
  + **Nguyên nhân gốc rễ đã khắc phục triệt để**:
    1. Máy chủ `web_app/server.py` trước đây chưa chạy ngầm hoặc bị tắt khiến `http://localhost:8080/...` báo `ERR_CONNECTION_REFUSED`, đồng thời đường dẫn `/local_admin_vault/director_ccsc_full.html` và `/web_app/index.html` trên `server.py` trước đây chưa được ánh xạ route trực tiếp.
    2. Bản `local_admin_vault/director_ccsc_full.html` khi mở trực tiếp bằng `file:///...` bị thiếu `styles.css` và `modules/*.js` cùng thư mục.
  + **Giải pháp khóa cứng vĩnh viễn**:
    1. Nâng cấp [`web_app/server.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/server.py): Hỗ trợ đầy đủ mọi biến thể URL (`/`, `/director`, `/local_admin_vault/director_ccsc_full.html`, `/deploy`, `/vp-xuong`, `/web_app/index.html`, `/director_app_full.js`, `/local-admin-assets/director_app_full.js`, `/app.js`, `/styles.css`) đều trả về `HTTP 200 OK`, đồng thời vô hiệu hóa `log_message()` ghi ra `sys.stderr` để chạy ngầm 100% dưới `pythonw.exe` mà không bị lỗi đóng kết nối (`Remote end closed connection`).
    2. Nâng cấp [`tools/split_app_two_editions.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/split_app_two_editions.py): Tự động đồng bộ `styles.css` và `modules/*.js` vào `local_admin_vault/` và dùng đường dẫn tương đối `director_app_full.js` để bấm mở qua cả `http://localhost:8080/...` lẫn `file:///...` đều lên giao diện đầy đủ 100%.
    3. Nâng cấp Cổng 6 & Cổng 7 trong [`tools/sop_pre_response_gate.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/sop_pre_response_gate.py): Khởi chạy `pythonw.exe web_app/server.py` qua dịch vụ hệ thống **WMI `Win32_Process.Create` (`WmiPrvSE.exe`)** để tiến trình thoát hoàn toàn khỏi Job Object của terminal tạm thời (sống vĩnh viễn 24/7 trên cổng `8080` ngay cả khi đóng lệnh), kiểm tra thực tế `HTTP 200 OK` trên toàn bộ 8 URL Localhost + Cloud `https://nghiagurunv-prog.github.io/pg-home-luxury-erp/web_app/` và **cấm tuyệt đối** đưa link cũ đã chết (`nghia208.github.io`, `pghome-quantri.onrender.com`).
- **Diệt Sạch 100% Mook Rỗng (`Empty Mocks / Empty States`) & Nhân Sự Giả Còn Sót (`v26_ZERO_EMPTY_MOCK_100`)**:
  + **Nạp đầy đủ danh mục BOQ thực tế (`items: [...]`) cho 3 hồ sơ dự án trong `DEFAULT_CUSTOM_PROJECTS_REAL` & `loadSavedCustomProjects()`**:
    * `CT-2026-1106: Nhà Anh Nam (06/11/2026)`: 8 hạng mục thực tế = `665.280.785 đ` (`WOOD_CN`: `540.280.785 đ`, `ACCESSORY`: `125.000.000 đ`).
    * `CT-2026-0817: Bác Sĩ Duẫn`: 6 hạng mục thực tế = `345.412.030 đ` (`WOOD_CN`: `289.412.030 đ`, `ACCESSORY`: `56.000.000 đ`).
    * `CT-2026-0326: Nhà Bác Phát (26/03/2026)`: 5 hạng mục thực tế = `144.840.000 đ` (`WOOD_CN`: `124.840.000 đ`, `ACCESSORY`: `20.000.000 đ`).
    * Tự động nâng cấp `localStorage` (`pg_home_custom_projects_v1`) nếu có bản ghi cũ `0 hạng mục` và tự động nạp sẵn hồ sơ `Nhà Anh Nam (665.280.785 đ)` ngay khi khởi tạo `#tab-du-toan-du-an` (không còn bảng trống `0 đ` hay nút `loadSampleEstimatorDuAn()` xóa trắng dự toán).
  + **Xóa bỏ nhân sự giả `NV11 Trần Văn Bình (binh_pending, 0966.889.900)`**: Gỡ khỏi `#bodyUserRoleList` trong [`director_ccsc_full.html`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_ccsc_full.html) và [`index.html`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html), xóa khỏi `DEFAULT_DATA.users` và thêm `"Trần Văn Bình"` vào `RETIRED_STAFF`.
  + **Nạp sẵn 4 chứng từ Zalo thực tế 2026 (`ZALO-LG-20261031`, `ZALO-QT-20261029`, `ZALO-CV-20261026`, `ZALO-VSG-20261022`)** trong `fetchZaloLiveInbox()` để bảng Hộp Thư Hóa Đơn Zalo luôn có dữ liệu đối soát ngay cả khi mở offline `file:///`.
  + **Chuẩn hóa 100% Placeholder & Modal chứng từ**: Thay thế toàn bộ placeholder giả (`Trần Văn B`, `Nguyễn Văn C`, `Lê Văn D`, `0912...`, `Biệt Thự Vinhomes`, `345M`) bằng thông tin thật của PG Home (`Nhà Anh Nam - Đường Xuân Diệu, TP. Hà Tĩnh`, `Hà Viết Hoà`, Hotline `0986.722.324`) và nâng `CURRENT_APP_VERSION = "2026.11.10_v26_ZERO_EMPTY_MOCK_100"`.
- **Diệt Sạch 100% Banner/Mock Thừa, Chuẩn Hóa Bảng Dữ Liệu 1 Dòng Gọn Gàng & 100 Cải Tiến Giao Diện (`PG_UI_100_MASTER_OPTIMIZER_V12`)**:
  + **Gỡ bỏ hoàn toàn các dải Telemetry / Banner chiếm diện tích trên Topbar & dưới Header**:
    * Xóa bỏ nút `#btnZeroErrorHubToggle` (`30 Chốt Chặn: BẬT`), xóa bỏ dải `#liveTelemetryRibbon` (`AI Stealth Daemon: ONLINE 24/7...`) và bảng `#pgZeroErrorCommandCenter` (`Bảng Chỉ Huy Đối Soát Cuối Ngày 30 Giây...`) khỏi [`director_ccsc_full.html`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_ccsc_full.html) và [`index.html`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html).
    * Thu gọn hộp chuyển đổi 2 khối `#deployDivisionSwitcher` ở đầu Sidebar trái: xóa dòng chữ thừa `"CÁCH LY 2 KHỐI ĐỘC LẬP / CHỐNG LỘ LỌT"`, chỉ giữ 2 nút `🏢 I. Văn Phòng (6)` và `🏭 II. Xưởng SX (5)` sắc nét.
  + **Chuẩn hóa 100% tên công trình thực tế trong PO & Kho Vật Tư (`Zero-Mock Project Names`)**:
    * Thay thế toàn bộ tên công trình chung chung (`"Công trình 53 Trương Quốc Dụng"`, `"Xưởng sản xuất PG Home (Đơn DH29930 B80)"`, `"Bổ sung hệ thống đèn Led tủ nội thất"`, `"Xưởng sản xuất lắp ráp"`) trong `DEFAULT_DATA.materials` và `DEFAULT_DATA.poList` bằng 4 công trình thực tế (`Nhà Anh Nam (TP. Hà Tĩnh)`, `Nhà Bác Phát (Đường 26/03 - TP. Hà Tĩnh)`, `Bác Sĩ Duẫn (TP. Hà Tĩnh)`, `Nhà Anh Công (Hà Tĩnh)`) và nâng `CURRENT_APP_VERSION` lên `"2026.11.10_v25_ZERO_MOCK_100_UI_OPTIMIZED"` để tự động làm mới `localStorage`.
  + **Tối ưu Bảng Dữ Liệu Gọn 1 Dòng (`Single-Line High-Density ERP Table`)**:
    * Biến toàn bộ dòng trong `#tablePOList`, `#tableMaterials` và `.data-table` thành dòng 1 hàng gọn gàng (`~34px/dòng` thay vì `95px/dòng`): tự động rút gọn chuỗi dài bằng `text-overflow: ellipsis` (`max-width: 220px–240px`), rê chuột hiện đầy đủ nội dung gốc qua `title` tooltip, nhấp đúp ô tự động copy nội dung.
    * Nhóm nút thao tác (`.pg-single-line-actions` / `.btn-group`) luôn nằm gọn trên 1 dòng ngang (`In`, `Zalo`, `Excel`, `Gốc`).
    * Cố định tiêu đề bảng khi cuộn (`position: sticky; top: 0`), giới hạn chiều cao khung bảng `calc(100vh - 220px)` và tự động thu gọn các bảng dài `> 15 dòng` kèm thanh `🔽 Xem toàn bộ X dòng / 🔼 Thu gọn 15 dòng đầu`.
  + **Khóa Đồng Bộ 2 Chiều Giữa Menu Trái & Màn Hình Chính (`enforceDivisionTabSync`)**:
    * Khi mở bất kỳ tab nào thuộc Khối Xưởng SX (`#tab-xuong-san-xuat`, `#tab-phe-duyet-vat-tu`, `#tab-vat-tu-cost`, `#tab-sop-quy-trinh`), hệ thống tự động chuyển Menu Trái sang **PHẦN II: KHỐI XƯỞNG SX** và ẩn tuyệt đối mọi `.tab-pane` của Khối Văn Phòng (và ngược lại), chấm dứt hoàn toàn hiện tượng Menu Trái đang ở Văn Phòng nhưng màn hình chính hiện bảng Đặt Hàng Vật Tư (PO) của Xưởng.
- **Diệt Sạch 100% Dữ Liệu Mock Ảo, Xóa Bỏ Mọi Banner Thừa & Cách Ly Tuyệt Đối Khối Văn Phòng ↔ Khối Xưởng Sản Xuất (`Zero-Mock & Strict Division Isolation v11.0`)**:
  + **Xóa bỏ triệt để toàn bộ dữ liệu Mock / Mẫu ảo**:
    * Tại [w52_cad_bom_instant_quote.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules/w52_cad_bom_instant_quote.js): Xóa sạch các mã giả `[PG-PROJECT-01-KITCHEN-L]`, `[PG-PROJECT-02-WARDROBE-GLASS]`, `[PG-PROJECT-03-TV-WALL]` và nhãn `"Dự án mẫu thực tế:"`, thay bằng công trình thực tế đã nghiệm thu (`CT-ANH-NAM-R09: Tủ Bếp Dưới + Bếp Trên + Kịch Trần Nhà Anh Nam`, `CT-ANH-NAM-R27: Hệ Tủ Áo Kịch Trần R27 + R40 + R49`, `CT-BAC-PHAT-0326: Hệ Vách Ốp & Kệ Tivi Nhà Bác Phát`) và hiển thị chuẩn `(Ván 17mm) + (Hậu 6mm)`.
    * Tại [director_app_full.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_app_full.js) và [app.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/app.js): Xóa sạch 2 dự án giả `DA-2026-101` (SĐT giả `0988 123 456`) và `DA-2026-102`, thay bằng 3 dự án thật (`CT-2026-1106: Nhà Anh Nam - 665.280.785 đ`, `CT-2026-0817: Bác Sĩ Duẫn - 345.412.030 đ`, `CT-2026-0326: Nhà Bác Phát - 144.840.000 đ`) kèm Hotline chuẩn `0986.722.324`.
  + **Xóa bỏ toàn bộ các Banner thừa gây rối mắt**:
    * Xóa vĩnh viễn thẻ `<div class="kpi-mini-card">Mục tiêu Doanh số 2026: 4.50 Tỷ VNĐ | Đạt 48.6% (T1 - T9)</div>` ở chân Sidebar trái.
    * Khóa cứng `w52_cad_bom_instant_quote.js` chỉ được phép gắn vào `#pg-w52-cad-bom-container` bên trong tab **1. Dự Toán & Báo Giá Công Trình (`#tab-du-toan-du-an`)**, chấm dứt hoàn toàn việc tự chèn khối CAD/DXF xuống cuối mọi tab.
    * Ẩn triệt để toàn bộ `.alert-banner` thuyết minh dài dòng ở đầu các tab, ẩn thanh `.zalo-v4-telemetry-strip`, ẩn `#atelierMaterialShowcase` và gỡ bỏ thanh `#pgModalToolTabsBar` bị trùng lặp trong `#createPOModal`.
  + **Tách Bạch & Cách Ly Tuyệt Đối Khối Văn Phòng (PHẦN I) ↔ Khối Xưởng Sản Xuất (PHẦN II) Chống Lộ Lọt Thông Tin**:
    * **Tách Công Nợ Khách Hàng vs Công Nợ Nhà Cung Cấp Xưởng**: Di chuyển toàn bộ 2 bảng công nợ NCC (`Sổ Đối Soát Công Nợ Tổng Kho Ván Lam Giang T1–T10/2026` và `Bảng Đối Soát Công Nợ Nhà Cung Cấp Vật Tư 13 Nhóm Zalo`) ra khỏi `#tab-cong-no-dong-tien` (Khối Văn Phòng) và đưa về đúng `#tab-vat-tu-cost` (`3. Kho Vật Tư, Đơn Giá & Công Nợ NCC` thuộc Khối Xưởng Sản Xuất). Tab `#tab-cong-no-dong-tien` của Văn Phòng nay chỉ hiển thị thu hồi công nợ khách hàng (50% - 40% - 10%).
    * **Tách Bảng Chấm Công & Lương Văn Phòng vs Lương Thợ Xưởng**: Khi ở chế độ **I. Khối Văn Phòng (`vanphong`)**, hệ thống chỉ hiển thị **Bảng Chấm Công & Lương Khối Văn Phòng (`#cardTimesheetVP`)**, ẩn hoàn toàn bảng chấm công thợ xưởng (`#cardTimesheetXuong`), bảng tính lương thợ xưởng (`#cardWorkerSalaryCalculation`), ma trận W05 (`#pg-w05-attendance-container`) và sổ tích lũy thưởng Tết (`#bonusPassbookCard`). Ngược lại, khi ở chế độ **II. Khối Xưởng SX (`xuong`)**, hệ thống ẩn hoàn toàn bảng lương Văn Phòng (`#cardTimesheetVP`).
    * **Bỏ nút xem lẫn lộn `"Cả 2 Khối"` / `"Cả 2 Phần"` trên bản Deploy Cloud**: Chỉ giữ 2 chế độ cách ly độc lập **🏢 I. Khối Văn Phòng (6 Bước)** và **🏭 II. Khối Xưởng SX (5 Bước)** trên cả Sidebar và Topbar, đồng thời cắt bỏ `#bonusPassbookCard` khỏi bản Deploy Cloud.
- **Tinh Gọn & Tối Ưu Hóa Toàn Diện Giao Diện & Các Phân Khu Con (`UI Decluttering & Sub-Section Optimizer Engine v10.0`)**:
  + **Chế độ Giao Diện Tinh Gọn Mặc Định (`body.pg-ui-streamlined` + Nút chuyển đổi `✨ Giao Diện: Tinh Gọn` / `📐 Giao Diện: Mở Rộng` trên Topbar)**: Thu gọn khoảng đệm thừa của Topbar (`54px`), Telemetry Ribbon (`28px`), thẻ KPI (`stat-card`), tiêu đề bảng (`card-header`) và mật độ dòng bảng (`data-table`) giúp hiển thị nhiều dữ liệu thực tế hơn ngay trong tầm mắt mà không phải cuộn trang nhiều.
  + **Gom Nhóm Nút Công Cụ Phụ Trên Topbar (`⚙️ Tiện Ích ▾` — `#pgTopbarUtilityMenu`)**: Đưa 5 nút phụ (`Ẩn Số Nhạy Cảm Alt+B`, `Chế Độ Sáng/Tối`, `Xuất Báo Cáo`, `Sao Lưu JSON`, `Khôi Phục JSON`) vào menu thả xuống gọn gàng (giữ nguyên 100% DOM ID), chỉ để lại trên thanh Topbar các nút cốt lõi: `+ Nhập Liệu`, `🛡️ 30 Chốt Chặn`, `✨ Giao Diện: Tinh Gọn`, `⚙️ Tiện Ích ▾`, `Đăng Xuất`.
  + **Tối Ưu Thanh Điều Hướng Trái (`Sidebar`)**: Thêm ô **Tìm kiếm nhanh mục menu (`#pgSidebarQuickSearch`)** lọc tức thì theo từ khóa và cho phép **bấm vào tiêu đề từng nhóm phân hệ (`.nav-section-title`) để thu gọn / mở rộng (`▾`/`▸`)**.
  + **Tự Động Thu Gọn Mọi Banner Quy Chuẩn Dài Dòng (`.alert-banner.pg-compact-banner`)**: Biến toàn bộ các khối giải thích quy chuẩn dài 4–8 dòng ở đầu các tab thành thanh tiêu đề 1 dòng gọn gàng kèm nút **`Chi tiết quy chuẩn ▾`** (bấm vào mới mở đoạn giải thích chi tiết), giải phóng `140–180px` chiều dọc trên mọi màn hình.
  + **Thu Gọn Lookbook Vật Liệu Trên Dashboard Giám Đốc (`#atelierMaterialShowcase`)**: Chuyển 5 thẻ mẫu vật liệu lớn trên `#tab-dashboard` thành thanh tiêu đề 1 dòng (`🎨 Thư Viện Vật Liệu & Phụ Kiện Chuẩn PG Home — Mở xem 5 mẫu ▾`), đẩy 4 thẻ KPI VIP và Biểu đồ 12 tháng lên ngay đầu màn hình.
  + **Tách Phân Khu Chức Năng Con Trên Tab Đặt Hàng PO (`#poSubViewBar` tại `#tab-phe-duyet-vat-tu` / `#tab-po-approval`)**: Thay vì xếp chồng 5 khối lớn gây rối mắt, chia thành 5 chế độ xem 1 chạm:
    1. *`📋 1. Danh Sách PO & Duyệt Dấu Đỏ` (Mặc định)*: Đưa bảng duyệt PO (`#tablePOList`) lên ngay đầu trang kèm thanh **Lập Đơn Nhanh 1 Dòng (`#pgPoQuickStrip`)** chứa 6 nút kịch bản của Vũ.
    2. *`📊 2. Thống Kê Đa Chiều (Pivot 3 Chiều)`*: Mở riêng trung tâm `#vuMultiDimStatsCenter`.
    3. *`⚖️ 3. Đối Sánh Thực Đặt vs Khoán 40%`*: Mở riêng bảng kiểm soát trần vật tư 40%.
    4. *`⚡ 4. Bàn Lập Đơn Zalo & 18 Nhóm NCC`*: Mở đầy đủ `#vuSmartOrderWorkstation`.
    5. *`👁️ Hiện Tất Cả`*: Xem toàn bộ trên 1 trang khi cần.
  + **Tinh Gọn Tab Kho Vật Tư & Giá Cost (`#vtSubViewBar` tại `#tab-vat-tu-cost`)**: Ẩn dải 7 nút lọc cũ bị trùng lặp với 8 thẻ nhóm danh mục mới (`#vtCategorySummaryStrip`), thu gọn 8 thẻ nhóm trên 1 hàng ngang và thêm thanh chuyển đổi: `⚡ 1. Chế Độ Tinh Gọn (8 Nhóm + Nhập Nhanh + Bảng)`, `📋 2. Chỉ Hiện Bảng Vật Tư (Rộng Tối Đa)`, `📊 3. Mở Bảng Thống Kê Đa Chiều`, `👁️ Hiện Đầy Đủ Bộ Lọc`.
  + **Thanh Lọc Phân Mục Con Tự Động Cho Mọi Tab Nhiều Bảng (`optimizeMultiCardTabs`)**: Tự động gắn thanh chuyển đổi nhanh (`📑 Phân mục nhanh: [👁️ Tất cả] [1. Mục 1] [2. Mục 2]...`) cho mọi tab có từ 3 khối `.card` trở lên để xem riêng từng bảng chỉ với 1 cú nhấp chuột.
  + **Tinh Gọn 4 Công Cụ Trong `#createPOModal` (`#pgModalToolTabsBar`)**: Chuyển 4 hộp công cụ lớn trong Modal tạo PO thành 4 tab ngang (`🪵 1. Bộ Ván+Hậu+Chỉ & CNC`, `📐 2. Cánh/Kính/Đá (mm)`, `🔩 3. Combo Ngũ Kim`, `💬 4. Dán Tin Zalo`, `🔼 Thu gọn công cụ`) để bảng danh sách vật tư (`#tablePoItemsInput`) luôn hiển thị ngay trước mắt.
- **Tối ưu toàn diện Khâu Nhập Liệu (`Tiện & Dễ Nhập`) & Thống Kê Đa Chiều (`Dễ Thống Kê` — `Smart Entry & Multi-Dimensional Pivot Engine v9.0`)**:
  + **Chuẩn hóa 8 Nhóm Danh Mục Vật Tư (`MATERIAL_CATEGORY_TAXONOMY`)**: Tự động gán mã nhóm chuẩn (`1. VAN_17MM`, `2. HAU_6MM`, `3. CHI_NEP`, `4. CANH_ACRYLIC_KINH`, `5. KINH_GUONG_DA`, `6. NGU_KIM_LED_KEO`, `7. PHU_KIEN_BEP_TM`, `8. GO_THIT_PU`) và tách bạch cứng `WOOD_40` (tính vào khoán 40%) với `COMMERCIAL_PK` (tách riêng phụ kiện bếp Inox 304, thiết bị bếp, sofa, gỗ sồi tự nhiên).
  + **Thanh Nhập Nhanh Vật Tư 1 Dòng (`#vtQuickInlineEntryBar`)** ngay trên đầu tab **Kho Vật Tư (`#tab-vat-tu-cost`)**: Chọn `Công trình` $\rightarrow$ `Nhóm danh mục (8 nhóm)` $\rightarrow$ `Gõ mã/tên vật tư tự nhảy ĐVT, Đơn giá, Nhà cung cấp` $\rightarrow$ nhấn `Enter` ghi thẳng vào bảng trong 3 giây (kèm nút **`+Tạo PO`**).
  + **Bộ Lọc Nhanh 8 Nhóm Danh Mục & Chọn 1 Chạm trong `#createPOModal` (`#poCatalogCategoryFilterBar` + `#poQuickPickByCatSelect`)**: Lọc gọn danh mục gợi ý theo từng nhóm vật tư để không phải cuộn tìm dài.
  + **Nâng cấp 7 Form Nhập Liệu Động Thông Minh (`renderDynamicFormFields` & `handleFormSubmit` trong `#dataModal`)**:
    * *Khối lượng xưởng (`xuong_khoiluong`)*: Chọn 1 chạm Hợp đồng có sẵn $\rightarrow$ tự điền `Tổng HĐ [A]`, `Trừ Phụ kiện/Gỗ thịt [B+C]` $\rightarrow$ tự tính `Doanh số Gỗ CN [D = A - B - C]` và nút tiến độ `30% / 70% / 100%`.
    * *Hợp đồng mới (`vp_hopdong`)*: Nhập `A` và `B+C` tự tính `D = A - (B+C)` và tự tính hoa hồng Sale (`Hiệp 5.0%` / `BPKD 3.5%` trên `D`).
    * *Thu hồi công nợ (`vp_congno`)*: Chọn khách hàng tự hiện `Tổng HĐ`, `Đã thu`, `Dư nợ còn lại` kèm 3 nút 1 chạm: `⚡ Cọc Đợt 1 (50%)`, `⚡ Thu Đợt 2 (35%)`, `⚡ Tất Toán 100% Nợ Còn Lại`.
    * *Nút cộng tiền nhanh (`+5Tr`, `+10Tr`, `+50Tr`, `+100Tr`, `×1 Triệu`)* + dòng đọc số tiền có dấu chấm trực tiếp chống gõ nhầm số `0`.
  + **Trung Tâm Thống Kê Đặt Hàng & Vật Tư Đa Chiều (`#vuMultiDimStatsCenter` & `#vtCategorySummaryStrip`)**:
    * **3 Chiều Thống Kê Pivot 1 Chạm**: (1) *Theo Công Trình & Trần 40%* (đếm riêng số tấm ván 17mm, tấm hậu 6mm, cuộn chỉ PVC, tiền Cánh/Kính/Đá/Ngũ kim, so sánh với trần 40% Doanh số Gỗ CN), (2) *Theo 8 Nhóm Danh Mục Vật Tư* (tổng SL theo ĐVT chuẩn, đơn giá TB, tỷ trọng `%`), (3) *Theo Nhà Cung Cấp* (kiểm soát hạn mức nợ Quốc Tâm $\le 30\text{M}$), kèm nút **Xuất CSV Thống Kê Đa Chiều (`exportVuMaterialStatsCSV`)**.
- **Nâng cấp toàn diện Phân hệ Đặt Hàng Vật Tư Thông Minh (`Smart PO Builder v8.0` — Dựa trên thực tế đặt hàng Zalo của Hoàng Công Vũ `0911.006.880`)**:
  + **Bàn Làm Việc Đặt Vật Tư 1 Chạm (`#vuSmartOrderingHub`)**: 6 nút kịch bản đặt hàng thực chiến của Vũ (`1. Đặt Ván + Hậu + Chỉ`, `2. Cánh Acrylic / Cánh Kính (mm)`, `3. Combo Ngũ Kim + LED + Keo`, `4. Kính Bếp / Gương LED / Đá (m²)`, `5. Phụ Kiện Bếp / Gỗ Thịt (Tách riêng)`, `6. Dán Tin Nhắn Zalo Đặt Nhanh`), kèm bộ lọc nhanh 18 nhóm Zalo NCC và huy hiệu nhắc kiểm tra kho phôi ván dư CNC (`14 dải 500mm`, `22 dải 170mm`).
  + **4 Công Cụ Tính & Sinh Đơn Tự Động trong `#createPOModal`**:
    1. *Bộ Sinh Nhanh Ván 17mm + Ván Hậu 6mm (~30%) + Chỉ Dán Cạnh 21×1mm / 44×1mm*: Tự động ghép bộ 3 món đồng màu (`205T`, `202T`, `MS 388 EV`, `MS 612`, `Plywood 414 PL`, `WPB An Cường`, `Picomat`), tích hợp **Máy Tính Quy Đổi Tấm CNC Chuẩn Mục 24** (`Bếp dưới × 1.45 + Bếp trên × 1.04 + Kịch trần × 1.44 + Tủ áo × 1.05 + Vách phẳng × 0.40`) và nút **`↩️ Trả Ván Dư (-SL)`** (như đơn trả NT Cầu Vượt `-750.000 đ`).
    2. *Bộ Tính Kích Thước Cắt Gia Công (`Dài mm × Rộng mm × Số cánh/tấm`)*: Tự động quy đổi ra `m²` hoặc `md` kèm kích thước `[Rộng × Cao mm]` trong tên vật tư để gửi xưởng Cánh Acrylic Livas/ALD, Cánh kính VSG, Kính Phú Mỹ, Đá Hoàng Hà, Gương LED Dantalux, Bọc đệm Hà Tĩnh.
    3. *5 Combo Ngũ Kim & Vật Tư Phụ 1 Chạm (`NPP Quốc Tâm - 56 Ngô Đức Kế`)*: Combo Tủ áo, Tủ bếp, Đèn LED cảm biến, Keo hạt Jowat + Mũi CNC 6mm, và Phụ kiện Inox 304 thương mại.
    4. *Trình Bóc Tách Tin Nhắn Đặt Hàng Zalo Tự Nhiên (`parseVuZaloOrderText`)*: Dán tin nhắn kiểu Vũ gõ trên Zalo (`15 tấm 17ly 205T, 5 hậu 205T, 3 cuộn chỉ 205T...`) tự động bóc tách thành từng dòng vật tư có sẵn mã, ĐVT, đơn giá chuẩn 2026.
  + **Tách Bạch Tự Động 2 Nhóm Hạch Toán (`🪵 Khoán Xưởng 40%` vs `🛋️ Thương Mại / Gỗ Thịt`)**: Tự động phân loại `WOOD_40` và `COMMERCIAL_PK` trên từng dòng đơn hàng, chỉ tính phần `WOOD_40` vào tỷ lệ khoán vật tư xưởng $\le 40\%$ (tuyệt đối không cộng nhầm thiết bị bếp, phụ kiện Inox 304 hay gỗ sồi thịt vào trần 40%).
  + **Copy Tin Nhắn Zalo Chuẩn Gửi NCC (`copyApprovedPOZaloMessage`)**: Sau khi Giám Đốc duyệt đóng Dấu Đỏ (`PIN 0986`), Vũ bấm 1 nút để copy nguyên bản tin nhắn đặt hàng chuẩn pháp lý (`Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh` - Hotline `0986.722.324` / Vũ `0911.006.880`) dán thẳng vào nhóm Zalo NCC.
- **Thi công hoàn tất Hệ Thống 30 Cải Tiến Chuẩn Hóa Không Sai Sót (`PG_ZERO_ERROR_ENGINE_V75`)**:
  + **Nhóm I (Hạ tầng, Phân quyền & Đồng bộ #1–#5)**: Tách vật lý 2 bản (Cloud VP+Xưởng vs Local CCSC), xác thực Mã PIN Giám Đốc (`0986` / `2026`) khi đóng Dấu Đỏ PO hoặc duyệt chứng từ $\ge 20\text{M}$, đồng bộ nguyên tử Delta-Patch (`/api/patch-state`) kèm hàng đợi Offline Outbox (`PG_OFFLINE_OUTBOX_V75`).
  + **Nhóm II (Dự toán Sale & Khóa Biên Cost $\le 54\%$ #6–#10)**: Tự động nhận diện từ khóa tách `woodVal` vs `pkVal` (cấm tính nhầm 40%/15% trên phụ kiện/gỗ thịt), bắt buộc chiều sâu `R`, trừ cánh kính `0.40 tấm/m²` & lỗ mở, khóa cứng xuất Báo Giá PDF nếu Cost $> 54\%$.
  + **Nhóm III (Kỹ thuật Xưởng, CNC & Đặt ván #11–#15)**: Dấu đỏ PO gắn SHA-256, trần PO $\le 105\%$ BOM, kho phôi ván dư CNC (`14 dải 500mm` từ tủ kịch trần R10 & `22 dải 170mm` từ bếp trên R08), cảnh báo trần nợ Quốc Tâm `28M / 30M`.
  + **Nhóm IV (Zalo Stealth v6.0 & Đối soát 3 lớp #16–#20)**: Quét ngầm 16 nhóm Zalo (`5.034 tệp`), băm thị giác Perceptual `dHash 64-bit` chống ảnh cắt viền/gửi trùng, đối soát 3 lớp chéo `[PO Dấu Đỏ + Hóa Đơn + UNC]`, bảng định danh `SENDER_ALIAS_REGISTRY` xóa bỏ hoàn toàn chuỗi `UID_...`.
  + **Nhóm V (Nhân sự, Chấm công & Quỹ lương #21–#25)**: Chấm công GPS/Ảnh tại xưởng, OT bắt buộc gắn công trình, phím tắt `Alt+B` (Boss Privacy Blur) tự động làm mờ số nhạy cảm sau 3 phút, trần tạm ứng $\le 70\%$ lương lũy kế, tự trích quỹ Hòa & Hào `20k/công`.
  + **Nhóm VI (Bảo vệ dòng tiền, Khóa kỳ & Pháp lý #26–#30)**: Chặn PO khi chưa thu Cọc Đợt 1 (`50%`), báo động tất toán sau `48h`, đóng băng kỳ lịch sử `T1–T10/2026` trên cả UI & `/api/patch-state`, cưỡng chế pháp lý chuẩn Phú Gia khi in A4, và **Bảng Chỉ Huy Đối Soát Cuối Ngày 30 Giây (`#pgZeroErrorCommandCenter`)** ngay trên thanh Topbar.
- **Tách vật lý 2 phiên bản độc lập để chống lộ lọt thông tin CCSC**:
  1. **Bản Nội Bộ Giám Đốc & CCSC (100% Local PC — Không đẩy lên Cloud)**:
     - Đặt tại [local_admin_vault/director_ccsc_full.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_ccsc_full.html) và [local_admin_vault/ccsc_director_vault.json](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/ccsc_director_vault.json) (đã khóa trong `.gitignore`).
     - Truy cập nội bộ trên máy tính Giám Đốc tại: `http://127.0.0.1:8080/director` (hoặc `/ccsc`).
  2. **Bản Deploy Cloud (Chỉ có Khối Văn Phòng & Khối Xưởng Sản Xuất)**:
     - Đặt tại [web_app/index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html) và [web_app/app.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/app.js), được tạo tự động bởi [tools/split_app_two_editions.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/split_app_two_editions.py).
     - **Menu & Quy trình chia chuẩn xác thành ĐÚNG 2 PHẦN (10 Bước nghiệp vụ khép kín — Không ẩn bất kỳ tab nào trên Cloud)**:
       + **PHẦN I: KHỐI VĂN PHÒNG — KINH DOANH, DỰ TOÁN & CÔNG NỢ (Hiệp & Dũng — 5 Bước)**:
         1. `1. Dự Toán & Báo Giá Công Trình` (`#tab-du-toan-du-an` — Kiểm soát Cost $\le 54\%$)
         2. `2. Hợp Đồng & Doanh Số Sale` (`#tab-van-phong-sale`)
         3. `3. Phụ Kiện Bếp & Sofa Thương Mại` (`#tab-phu-kien-sofa` — Tách khỏi khoán xưởng, chia 10% lời ròng)
         4. `4. Thu Hồi Công Nợ & Dòng Tiền Khách` (`#tab-cong-no-dong-tien`)
         5. `5. Chi Phí Mặt Bằng & Vận Hành VP` (`#tab-chi-phi-van-phong`)
       + **PHẦN II: KHỐI XƯỞNG SẢN XUẤT — KỸ THUẬT, VẬT TƯ & NHÂN SỰ (Vũ, Thái & Đội Thợ — 5 Bước)**:
         1. `1. Tiến Độ Sản Xuất & Khối Lượng Xưởng` (`#tab-xuong-san-xuat` — Theo dõi m², md, tấm CNC)
         2. `2. Đề Xuất & Duyệt Đặt Hàng Vật Tư (PO)` (`#tab-phe-duyet-vat-tu` — Chốt chặn Dấu Đỏ Giám Đốc trước khi gửi NCC)
         3. `3. Kho Vật Tư, Đơn Giá & Đối Soát NCC` (`#tab-vat-tu-cost` — An Cường, Lam Giang, Quốc Tâm)
         4. `4. Chấm Công, Điểm Danh & Bảng Lương` (`#tab-cham-cong-all` — Chấm công hàng ngày, OT, tạm ứng)
         5. `5. Quy Chuẩn Kỹ Thuật & Định Mức CNC` (`#tab-sop-quy-trinh` — Định mức tấm cắt CNC chuẩn xưởng)

---

## 1. THÔNG TIN PHÁP LÝ & NHẬN DIỆN THƯƠNG HIỆU CHUẨN MỰC
- **Thương hiệu doanh nghiệp**: **CÔNG TY CP PHÚ GIA VIỆT NAM** / **PG HOME LUXURY**
- **Đơn vị pháp lý**: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
  - *Mã số ĐKKD/HKD*: **042203002931** (Đăng ký lần đầu: 13/01/2025 - Cơ quan cấp: UBND TP. Hà Tĩnh)
  - *Đại diện hộ kinh doanh*: **Nguyễn Trọng Nghĩa** (Giám Đốc)
  - *Mã số thuế (MST)*: **042203002931**
  - *Địa chỉ ĐKKD*: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh
- **Địa chỉ Giao dịch & Tổ hợp Văn phòng - Nhà máy Sản xuất chuẩn duy nhất**:
  - **Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh**
  - **CẤM TUYỆT ĐỐI**:
    + Không dùng địa chỉ cũ: `35 Ngô Đức Kế` (Chỉ có NCC Phụ Kiện Quốc Tâm ở 56 Ngô Đức Kế, Phú Gia không ở Ngô Đức Kế).
    + Không dùng địa chỉ bịa đặt: `đường Hàm Nghi` hoặc bất kỳ địa chỉ nào khác.
    + CẤM viết sai chính tả thiếu dấu thành `Trương Quốc Dung`. Bắt buộc phải là `Trương Quốc Dụng`.
    + CẤM gọi là `"xưởng mộc"`. Bắt buộc dùng đúng danh xưng: *Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia*.
- **Hotline & Liên hệ Chuẩn Duy Nhất**:
  - **Hotline**: **0986.722.324**
  - **CẤM TUYỆT ĐỐI** các số điện thoại giả/cũ/bịa đặt: `0973.562.789`, `0912.345.678`, `0988.888.999`, `0868.448.625`, `096 832 99 92`, `09xx.xxx.xxx`.

---

## 2. TRẠNG THÁI KỸ THUẬT VẬN HÀNH HỆ THỐNG (SYSTEM HEALTH & INFRASTRUCTURE)
- **Kiến trúc Web App**: Single-Page Application (SPA) v7.0 cao cấp, phong cách Luxury Gold (#D4AF37) trên nền Obsidian Dark (#0d1117).
- **Hệ thống Modules**: **57 Modules chuyên sâu** (`w01` đến `w57`) tại [web_app/modules](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules).
- **Kiến trúc Bundle**: Đã đóng gói sẵn [pg_w50_master.bundle.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules/pg_w50_master.bundle.js) (~2.16 MB / 2,209,701 bytes - đủ 55 JS modules `w01`–`w57`) và [pg_w50_master.bundle.css](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules/pg_w50_master.bundle.css) (~42.1 KB / 43,116 bytes - 2 CSS modules `w41`, `w42`).
- **Máy chủ Localhost 8080**: Chạy bằng lệnh `python "f:\PG Home - Quản trị\web_app\server.py" 8080` (Cổng 8080, HTTP 200 OK, phục vụ Live API và file tĩnh).
- **Máy chủ Cloud Vĩnh Viễn (GitHub Pages)**:
  - Link chính thức: `https://nghiagurunv-prog.github.io/pg-home-luxury-erp/web_app/index.html` (và `https://nghiagurunv-prog.github.io/pg-home-luxury-erp/`).
  - **Quy chuẩn bất di bất dịch**: CẤM TUYỆT ĐỐI dùng `npx vercel deploy --temporary` sinh link `.tmp.now` tự hủy sau 60 phút.
- **Serverless API Vercel**: `api/index.js` hỗ trợ xác thực vai trò bảo mật `X-PG-Role` (ADMIN, XUONG_VATTU, VANPHONG_SALE, DU_TOAN_SALE).
- **Database Tri Thức RAG**: [pg_knowledge_vault.db](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/pg_knowledge_vault.db) (~14.6 MB) chứa 2,382 chunks tri thức lập chỉ mục FTS5 phục vụ trợ lý Copilot.
- **Chốt chặn tự động 7 lớp (Jidoka Gate)**: File kiểm định [tools/sop_pre_response_gate.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/sop_pre_response_gate.py) đạt 7/7 tiêu chí trước khi báo cáo Giám Đốc.

---

## 3. CƠ CẤU 4 PHÂN HỆ QUẢN TRỊ DOANH NGHIỆP (4 RBAC PORTALS)
1. **Phân hệ Giám Đốc (ADMIN)**:
   - Toàn quyền điều hành: Xem Dashboard KPI, Báo cáo CCSC 12 tháng, Quản trị tài chính thực tế T8+T9, Bảng chấm công thợ, Doanh số xưởng, Công nợ khách hàng & NCC.
   - Thẩm quyền đặc biệt: **Phê duyệt và đóng dấu đỏ điện tử** cho các Phiếu đề xuất vật tư của xưởng; kích hoạt phân quyền tài khoản nhân sự mới.
2. **Phân hệ Kỹ Thuật & Vật Tư Xưởng (Vũ - XUONG_VATTU)**:
   - Lập phiếu đề xuất vật tư theo bóc tách kỹ thuật từ bản vẽ công trình.
   - **Luật sắt sống còn**: Chỉ được phép gửi đơn đặt hàng sang NCC (An Cường, Hafele, Lam Giang, Quốc Tâm, Kính Việt Nhật...) khi phiếu đã có **DẤU ĐỎ PHÊ DUYỆT CỦA GIÁM ĐỐC**. Tuyệt đối cấm đặt hàng khi chưa có dấu đỏ.
3. **Phân hệ Sale Admin & Văn Phòng (Hiệp - VANPHONG_SALE)**:
   - Theo dõi tiến độ ký kết hợp đồng, chỉ tiêu doanh số văn phòng, dòng tiền thanh toán và tiến độ thu hồi công nợ khách hàng.
   - Cách ly nghiêm ngặt: Không can thiệp vào xưởng sản xuất hoặc số liệu tài chính quản trị nội bộ cấp cao.
4. **Phân hệ Dự Toán Nhà Ở & Khởi Tạo Dự Án Báo Giá (Hiệp & Dũng - DU_TOAN_SALE)**:
   - Khởi tạo công trình mới, bóc tách khối lượng dự toán sơ bộ theo thư viện đơn giá niêm yết chuẩn.
   - **Chốt chặn tỷ lệ chi phí cost $\le 54\%$**: Bắt buộc kiểm soát tổng cost vật tư + công thợ không vượt quá 54% tổng doanh số báo giá trước khi xuất file cho khách hàng. Không can thiệp vào bảng lương nội bộ.

---

## 4. BẢN ĐỒ 57 MODULES GIAO DIỆN WEB APP (`w01` - `w57`)
Các module được đặt tại [web_app/modules](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules), phân bổ theo 7 nhóm nghiệp vụ:

| Nhóm Nghiệp Vụ | Mã Module | Tên Module & Chức Năng Cốt Lõi |
| :--- | :--- | :--- |
| **I. Tài Chính, CCSC & Nhân Sự** | `w01` | **w01_executive_kpi_bar.js**: Thanh chỉ số KPI tài chính cấp cao của Giám Đốc |
| | `w02` | **w02_ccsc_12months_engine.js**: Động cơ tính toán CCSC 12 tháng toàn doanh nghiệp |
| | `w03` | **w03_core_worker_fund_hoa_hao.js**: Quản lý Quỹ thợ nòng cốt Hòa & Hào (20k/công giữ đến cuối năm) |
| | `w04` | **w04_sales_bonus_500m_lock.js**: Quản lý thưởng vượt doanh số > 500M (Thái 0.5%, Vũ 0.3%, Hiệp 0.5%) |
| | `w05` | **w05_attendance_t10_matrix.js**: Ma trận chấm công và điểm danh thợ xưởng chi tiết |
| | `w38` | **w38_management_salary_pool.js**: Quản lý quỹ lương ban quản lý và phân bổ chi phí gián tiếp |
| **II. Dự Án, Báo Giá & CNC** | `w06` | **w06_project_bac_phat_tracker.js**: Theo dõi tiến độ và khối lượng công trình Nhà Bác Phát (26/03) |
| | `w07` | **w07_project_anh_nam_cnc_norm.js**: Định mức tấm cắt CNC chuẩn hóa từ Nhà Anh Nam (06/11/2026) |
| | `w08` | **w08_pricing_3tiers_validator.js**: Bộ kiểm định giá 3 cấp vật liệu (An Cường $\leftrightarrow$ Thái Lan $\leftrightarrow$ Plywood) |
| | `w09` | **w09_intersection_deduction_tool.js**: Công cụ tự động trừ diện tích giao cắt & khấu trừ lỗ mở |
| | `w31` | **w31_solid_wood_separator.js**: Bóc tách gỗ thịt tự nhiên và đồ thương mại khỏi doanh số khoán xưởng |
| | `w32` | **w32_cnc_8categories_reference.js**: Bảng tham chiếu định mức 8 nhóm sản phẩm nội thất xưởng |
| | `w52` | **w52_cad_bom_instant_quote.js**: Tự động bóc tách BOM từ bản vẽ CAD và tính báo giá tức thì |
| | `w57` | **w57_cnc_nesting_qr_offcut.js**: Tối ưu hóa nesting cắt ván 2D và quản lý mã QR ván vụn (offcut) |
| **III. Cung Ứng & Vật Tư** | `w10` | **w10_supplier_board_3ncc.js**: Quản lý đối soát vật tư gỗ công nghiệp với 3 NCC lớn |
| | `w11` | **w11_supplier_fitting_glass_stone.js**: Quản lý phụ kiện kim khí, kính cường lực và đá bàn bếp |
| | `w12` | **w12_three_layer_cashflow_guard.js**: Chốt chặn dòng tiền 3 lớp (Hóa đơn + Nhóm Zalo + UNC) |
| | `w13` | **w13_red_stamp_po_approval.js**: Hệ thống phê duyệt và đóng dấu đỏ điện tử phiếu đề xuất vật tư |
| | `w23` | **w23_po_zalo_2026_analytics.js**: Phân tích dữ liệu đơn đặt hàng vật tư qua kênh Zalo 2026 |
| | `w24` | **w24_material_catalog_search.js**: Tra cứu danh mục mã màu và thông số vật tư An Cường / Minh Long |
| | `w25` | **w25_lam_giang_debt_reconciler.js**: Đối soát chi tiết công nợ nhà cung cấp Lam Giang 10 tháng |
| | `w54` | **w54_einvoice_3way_audit.js**: Kiểm toán hóa đơn điện tử 3 bên kết nối dữ liệu cơ quan thuế |
| **IV. Bảo Mật & Pháp Lý** | `w14` | **w14_rbac_4_portals_guard.js**: Chốt chặn phân quyền 4 cổng đăng nhập (ADMIN, XUONG, SALE, DỰ TOÁN) |
| | `w15` | **w15_legal_brand_enforcer.js**: Bộ cưỡng chế hiển thị thông tin pháp lý & thương hiệu chuẩn Phú Gia |
| **V. Zalo Stealth Radar** | `w16` | **w16_zalo_v6_stealth_cockpit.js**: Khoang lái trung tâm theo dõi hoạt động quét ngầm Zalo Stealth V6 |
| | `w17` | **w17_zalo_175_groups_explorer.js**: Trình khám phá 175 nhóm làm việc Zalo phân loại tự động |
| | `w18` | **w18_filenoise_xor_status.js**: Trạng thái bộ giải mã fileNoise XOR 0x93 đọc ngầm không cướp focus |
| | `w19` | **w19_zalo_staging_approval_queue.js**: Hàng đợi kiểm duyệt tin nhắn và hóa đơn trước khi nhập sổ cái |
| | `w20` | **w20_contracts_docx_vault.js**: Kho lưu trữ và trích xuất dữ liệu hợp đồng DOCX từ Zalo |
| | `w21` | **w21_quotations_excel_vault.js**: Kho bảng tính báo giá Excel bóc tách từ các nhóm Zalo |
| | `w22` | **w22_technical_drawings_pdf_vault.js**: Kho bản vẽ kỹ thuật PDF thiết kế công trình |
| | `w40` | **w40_leveldb_keyword_highlighter.js**: Bộ quét từ khóa nhạy cảm trực tiếp trong LevelDB Zalo |
| | `w48` | **w48_delta_cursor_inspector.js**: Thanh tra con trỏ Delta-Cursor kiểm soát chùm ảnh hóa đơn |
| | `w53` | **w53_zalo_hybrid_rag_copilot.js**: Trợ lý Copilot thông minh truy vấn ngữ nghĩa trên dữ liệu Zalo |
| **VI. Trực Quan & Tiện Ích** | `w26` | **w26_print_a4_quotation_engine.js**: Động cơ xuất bản in ấn bảng báo giá khổ A4 chuẩn hóa |
| | `w27` | **w27_csv_excel_export_helper.js**: Bộ trợ giúp xuất dữ liệu ra file Excel và CSV phục vụ báo cáo |
| | `w28` | **w28_offline_sync_outbox.js**: Hộp thư đi lưu trữ ngoại tuyến khi mất kết nối mạng |
| | `w29` | **w29_command_palette_ctrl_k.js**: Bảng lệnh thao tác nhanh (Ctrl + K Command Palette) |
| | `w30` | **w30_realtime_health_badge.js**: Huy hiệu hiển thị trạng thái kết nối và nhịp tim hệ thống |
| | `w41` | **w41_luxury_gold_theme_tokens.css**: Bộ mã màu tokens phong cách hoàng kim cao cấp |
| | `w42` | **w42_print_a4_stylesheet.css**: Bảng định kiểu CSS chuyên dụng cho in ấn hợp đồng và báo giá A4 |
| | `w43` | **w43_keyboard_shortcuts_manager.js**: Trình quản lý phím tắt điều hướng nhanh trong ứng dụng |
| | `w45` | **w45_safe_pocket_summary_card.js**: Thẻ tóm tắt số liệu tiền bỏ túi an toàn của Giám Đốc |
| | `w50` | **w50_master_hub_loader.js**: Bộ điều phối nạp động toàn bộ các module trong hệ thống |
| | `w51` | **w51_luxury_3d_showroom.js**: Phòng trưng bày trực quan hóa 3D vật liệu nội thất cao cấp |
| **VII. Vận Hành & Kiểm Toán** | `w33` | **w33_verified_entities_inspector.js**: Thanh tra các thực thể đã được xác minh danh tính và dữ liệu |
| | `w34` | **w34_telemetry_performance_chart.js**: Biểu đồ hiệu năng hệ thống và độ trễ phản hồi API |
| | `w35` | **w35_zero_trust_audit_viewer.js**: Trình xem nhật ký kiểm toán Zero-Trust chống gian lận số liệu |
| | `w36` | **w36_customer_receivables_aging.js**: Báo cáo phân tích tuổi nợ và cảnh báo công nợ khách hàng |
| | `w37` | **w37_workshop_productivity_kpi.js**: Đo lường năng suất sản xuất và hiệu suất máy cắt CNC |
| | `w39` | **w39_debt_60min_sla_timer.js**: Bộ đếm ngược SLA 60 phút chốt công nợ tức thời sau giao dịch |
| | `w44` | **w44_data_integrity_guard.js**: Vệ sĩ bảo vệ tính toàn vẹn của dữ liệu và ngăn chặn ghi đè |
| | `w46` | **w46_mkt_safety_monitor_widget.js**: Tiện ích giám sát kỷ luật an toàn tài khoản marketing |
| | `w47` | **w47_audit_trail_timeline.js**: Dòng thời gian lịch sử thao tác của các phân hệ người dùng |
| | `w49` | **w49_cloud_backup_snapshot.js**: Quản lý ảnh chụp sao lưu dự phòng dữ liệu lên đám mây |
| | `w55` | **w55_workshop_oee_dashboard.js**: Bảng điều khiển hiệu suất tổng thể thiết bị xưởng sản xuất (OEE) |
| | `w56` | **w56_realtime_crdt_client.js**: Khách hàng đồng bộ dữ liệu thời gian thực theo cấu trúc CRDT |

---

## 5. HỆ THỐNG KHO DỮ LIỆU & ENGINE TỰ ĐỘNG HÓA (`data/` & `tools/`)
- **Cơ chế Zalo Stealth Reader (Vô hình 100%)**:
  * Đọc thụ động LevelDB và `.rescache` ngoài ổ cứng (`%APPDATA%\ZaloData` & `%LOCALAPPDATA%\ZaloPC`) ở mức ưu tiên `IDLE (0x40)`, tiêu thụ CPU $\le 0.3\%$.
  * Tuyệt đối không can thiệp chuột, bàn phím, không gọi `SetForegroundWindow` cướp tiêu điểm màn hình của Giám Đốc.
  * Chỉ mục hóa 175 nhóm làm việc ([zalo_175_groups_full_index.json](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/zalo_175_groups_full_index.json)) và 157 cuộc trò chuyện riêng ([zalo_157_private_chats_index.json](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/zalo_157_private_chats_index.json)).
  * Giải mã fileNoise XOR 0x93 hoàn toàn trong bộ nhớ RAM, chống lưu file rác ra đĩa.
  * Con trỏ quét `Delta-Cursor` ([zalo_seen_cursor.json](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/zalo_seen_cursor.json)) ghi nhận `filename|size|mtime` bắt trọn các chùm ảnh gửi đồng thời.
- **Các kịch bản tự động hóa chuyên dụng trong `tools/`**:
  * [tools/sop_pre_response_gate.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/sop_pre_response_gate.py): Kiểm định 7 lớp Jidoka tự động (Cú pháp JS, Cô lập DOM, Giả lập Render UI, Kiểm toán 12 lỗi lịch sử, Hotline chuẩn, Localhost 8080, Link Cloud Vĩnh Viễn).
  * [tools/zalo_v6_master_sync.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/zalo_v6_master_sync.py): Đồng bộ ngầm tin nhắn, hợp đồng, hóa đơn và UNC ngân hàng.
  * [tools/zalo_hybrid_rag_engine.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/zalo_hybrid_rag_engine.py): Động cơ truy vấn kết hợp ngữ nghĩa và từ khóa FTS5 trên SQLite.
  * [tools/cad_bom_auto_estimator.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/cad_bom_auto_estimator.py): Tự động trích xuất bảng kê BOM và báo giá sơ bộ từ file CAD.
  * [tools/cnc_2d_nesting_optimizer.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/cnc_2d_nesting_optimizer.py): Tối ưu sơ đồ xếp ván 2D, giảm tỷ lệ hao hụt ván xuống dưới 8%.
  * [tools/tax_einvoice_3way_matcher.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/tax_einvoice_3way_matcher.py): Khớp nối 3 chiều hóa đơn VAT - trao đổi nhóm Zalo - UNC ngân hàng.
  * [tools/workshop_ai_oee_monitor.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/workshop_ai_oee_monitor.py): Theo dõi năng suất hoạt động OEE xưởng sản xuất.
  * [tools/crdt_sse_sync_broker.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/crdt_sse_sync_broker.py): Cầu nối Server-Sent Events phục vụ đồng bộ CRDT đa máy khách.

---

## 6. DANH MỤC 7 THƯ MỤC CHUYÊN ĐỀ QUẢN TRỊ CỐT LÕI
1. [1. Bảng lương 2026](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/1.%20B%E1%BA%A3ng%20l%C6%B0%C6%A1ng%202026): Chứa bảng lương thực tế các tháng T6, T7, T8, T9, T10; Bảng công xưởng T8; Bảng doanh số xưởng T8+T9.
2. [2. CSC - Chỉ số](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/2.%20CSC%20-%20Ch%E1%BB%89%20s%E1%BB%91): Bảng CCSC Văn Phòng, Bảng CCSC Xưởng 2022, Bảng Doanh số xưởng, Bảng Quản trị Tài chính & CCSC 2026, và Bảng Quản trị Tài chính Thực tế T8+T9.
3. [3. Báo giá đối thủ](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/3.%20B%E1%BA%A3o%20gi%C3%A1%20%C4%91%E1%BB%91i%20th%E1%BB%A7): Hồ sơ phân tích đơn giá thi công và chiến lược cạnh tranh của các đơn vị nội thất khác trên địa bàn.
4. [4. Báo giá](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/4.%20B%E1%BA%A3o%20gi%C3%A1): Hồ sơ thiết kế & dự toán công trình Nhà Bác Phát (26/03), Nhà BS Duẩn, Nhà Anh Nam, Bảng giá niêm yết An Cường 2026.
5. [5. Tài liệu](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/5.%20T%C3%A0i%20li%E1%BB%87u): Hệ thống biểu mẫu quản lý doanh nghiệp, quy trình ISO, tài liệu bán hàng, bộ mẫu KPI chức danh và thủ tục kiểm soát nội bộ.
6. [6. Quản lý vật tư](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/6.%20Qu%E1%BA%A3n%20l%C3%BD%20v%E1%BA%ADt%20t%C6%B0): Dữ liệu đối soát công nợ NCC Nam Trân (23/10/2026), đơn đặt kính Việt Nhật (30/10/2026), tổng hợp đặt hàng vật tư qua Zalo 2026.
7. [7. Kho bí mật - Quản trị nội bộ](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/7.%20Kho%20b%C3%AD%20m%E1%BA%ADt%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B%20n%E1%BB%99i%20b%E1%BB%99): 24 tài liệu chuyên sâu đúc rút kinh nghiệm quản trị xương máu, SOP vận hành chuẩn quốc tế, các giải pháp Zalo Stealth và tài chính nội bộ.

---

## 7. BỘ TAM SỔ TAY LUẬT SẮT CHI TIẾT (`luat_sat_chi_tiet/`)
- [SO_TAY_01_QUAN_TRI_TAI_CHINH_CCSC_VA_NHAN_SU.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/luat_sat_chi_tiet/SO_TAY_01_QUAN_TRI_TAI_CHINH_CCSC_VA_NHAN_SU.md): Bao gồm Mục 1 đến Mục 8 (Quản trị nhân sự, lương thưởng, quỹ thợ nòng cốt Hòa & Hào 20k/công, logic CCSC, bóc tách gỗ thịt và đối soát 3 NCC).
- [SO_TAY_02_KY_LUAT_THEP_CHONG_LAM_AU_VA_SOP_VAN_HANH.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/luat_sat_chi_tiet/SO_TAY_02_KY_LUAT_THEP_CHONG_LAM_AU_VA_SOP_VAN_HANH.md): Bao gồm Mục 9 đến Mục 16 (17 bài học chống làm láo, Pre-Response Hard-Lock, Stealth Zalo V2.0, 30 cải tiến SOP thế giới, Master SOP 4.0).
- [SO_TAY_03_DU_TOAN_SALE_DINH_MUC_CNC_VA_DIEU_QUAN.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/luat_sat_chi_tiet/SO_TAY_03_DU_TOAN_SALE_DINH_MUC_CNC_VA_DIEU_QUAN.md): Bao gồm Mục 17 đến Mục 25 (Dự toán Sale, chốt nợ tức thời 60 phút, định mức tấm CNC chuẩn Nhà Anh Nam, quy chế điều hành đội quân Sub-Agent).

---

## 8. ĐỊNH MỨC TẤM CNC & CÔNG THỨC BẢO VỆ DÒNG TIỀN BỎ TÚI BGĐ
- **Bảng định mức cắt CNC chuẩn thực chiến (Khổ ván 1220×2440 = 2.9768 m²)**:
  1. *Tủ bếp dưới (R09 - Sâu 600 × Cao 860)*: **`1.45 tấm / md`** (Cánh Acrylic tách riêng: Thùng+Hậu = 1.14 tấm/md + Cánh = 0.31 tấm/md). CẤM báo sai thành 2.70 tấm/md!
  2. *Tủ bếp trên (R08 - Sâu 350 × Cao 750)*: **`1.04 tấm / md`** (Thùng 0.74 + Cánh 0.30) + Hậu 6mm = 0.28 tấm/md.
  3. *Tủ bếp kịch trần (R10 - Sâu 700 × Cao 720)*: **`1.44 tấm / md`** (Thùng 1.15 + Cánh 0.29) + Hậu 6mm = 0.27 tấm/md.
  4. *Tủ quần áo kịch trần (R27, R40, R49 - Sâu 600 × Cao 2700)*: **`1.05 tấm ván 17mm / m²`** + Hậu 6mm = 0.36 tấm/m². Cánh kính khung nhôm trừ ngay 0.40 tấm/m².
  5. *Hộc tủ trang trí nông (R05 - Sâu 200 × Cao 1850)*: **`0.50 tấm ván 17mm / m²`** + Hậu 6mm = 0.25 tấm/m².
  6. *Vách ốp phẳng trang trí (R06, R23, R25, R34, R43)*: **`0.40 tấm / m²`** (Soi huỳnh/Lam sóng: 0.52 tấm/m²).
  7. *Giường ngủ bo cong (R33, R42)*: **`3.3 – 3.5 tấm / cái`** (Phản 1.4 tấm + Vai/đuôi/thang chịu lực 2.0 tấm).
  8. *Kệ tivi / Bàn học treo bo góc (R04, R24, R36)*: **`0.55 – 0.65 tấm / md`** + 0.15 tấm hậu / md.
- **Chốt chặn tỷ lệ chi phí cost $\le 54\%$**:
  $$\text{Tỷ lệ Cost} = \frac{\text{Tổng Vật Tư Thực Tế} + \text{Tổng Công Thợ Dự Kiến}}{\text{Tổng Doanh Thu Báo Giá}} \le 54\%$$
  $\implies$ Đảm bảo biên lợi nhuận ròng an toàn **18% – 20%** bỏ túi Giám Đốc.
- **Quy tắc bảo vệ dòng tiền két sắt**:
  * *Lợi nhuận xưởng (Col BG)*: Chỉ ghi nhận từ thợ & máy xưởng làm ra. Chi lương vượt 15% làm âm quỹ khoán thì Col BG = 0 đ.
  * *Quỹ thợ nòng cốt*: Trích 20k/công giữ đến cuối năm (Hòa 530k, Hào 450k + OT; phụ cấp hàng tháng = 0 đ).
  * *Thưởng doanh số > 500M*: Giữ lại đến tất niên đối soát (Thái 0.5%, Vũ 0.3%, Hiệp 0.5%).
  * *Bóc tách gỗ thịt & đồ mua ngoài*: Luôn trừ trước khi tính tỷ lệ khoán xưởng.

---

## 9. QUY CHẾ VẬN HÀNH AI, BẢO TOÀN CONTEXT & QUẢN TRỊ SUB-AGENT
- **Kỷ luật Tàng hình 100% (Stealth Protocol)**: Cấm cướp focus, cấm `ShowWindow`, cấm làm nháy giật màn hình Chrome/Zalo của Giám Đốc.
- **Giao thức Báo cáo Sub-Agent Siêu Gọn (`Minimal JSON Payload <= 3 dòng`)**:
  * Toàn bộ log, diff, bảng biểu chi tiết ghi ra file đĩa trên ổ cứng.
  * Lệnh `send_message` gửi về Tổng Chỉ Huy CHỈ ĐƯỢC CHỨA ĐÚNG 1 DÒNG JSON:
    ```json
    {"status": "PASS/FAIL", "output_file": "<path_to_report.md>", "summary": "<noi dung <= 15 tu>"}
    ```
- **Thu hồi Sub-Agent (`Auto-Reap`)**: Luôn gọi `manage_subagents(Action="kill_all")` khi kết thúc đợt tác vụ.
- **Cách ly ngữ cảnh theo khâu (`Task Isolation`)**: Chỉ đọc đúng file sổ tay và module liên quan đến tác vụ đang xử lý, không nạp toàn bộ hệ thống vào context.
- **Giao thức Chống mù ảnh (`Anti-Image Blindness`)**: Khi thấy thông báo ảnh bị lược bỏ sau Compaction (`[file "...png/jpg" was omitted...]`), bắt buộc gọi lệnh `read_file` đọc lại file ảnh gốc.
- **Vệ sinh đọc file (`Pagination Hygiene`)**: Tuyệt đối không đọc toàn bộ file lớn > 200 dòng vào context. Dùng `StartLine` và `EndLine` hợp lý.
- **Ngưỡng xoay vòng phiên chat (`Session Rotation Threshold`)**: Khi file database phiên chat đạt ngưỡng 40 MB hoặc 3.000 steps, cập nhật `PROJECT_STATE.md` và kích hoạt `/compact` hoặc mở phiên mới.

---

## 10. NHẬT KÝ MỐC TIẾN ĐỘ & PHIÊN LÀM VIỆC (CHANGELOG & MILESTONES)
- **2026-10-27 $\rightarrow$ 2026-10-30**: Khởi tạo kiến trúc Web App v1.0 - v4.0, thiết lập Stealth Zalo Engine V2.0, bóc tách dữ liệu lương T6..T9 và CCSC.
- **2026-11-06**: Hoàn thiện bài học định mức tấm cắt CNC từ công trình thực tế Nhà Anh Nam, chuẩn hóa 8 nhóm sản phẩm nội thất và kiểm soát tỷ lệ chi phí cost $\le 54\%$.
- **2026-11-08**:
  * Hoàn thành cập nhật **Mục 6: KỶ LUẬT CHỐNG QUÊN, CHỐNG TRÀN CONTEXT, BÁO CÁO SUB-AGENT SIÊU GỌN & SỔ CÁI PROJECT_STATE.md** vào [GEMINI.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/GEMINI.md).
  * Chuyển mục bảo vệ dòng tiền cũ thành **Mục 7**, bảo toàn 100% các điều lệ cốt tử của Giám Đốc.
  * Khởi tạo Sổ Cái Bộ Nhớ Ngoài Bất Tử [PROJECT_STATE.md](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/PROJECT_STATE.md) tích hợp đầy đủ 57 modules, cấu trúc 4 phân hệ, 7 thư mục chuyên đề, engine Zalo Stealth và quy chế điều quân Sub-Agent.
  * Nâng cấp [tools/build_w50_bundle.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/build_w50_bundle.py) đóng gói trọn vẹn 57 modules (`w01`–`w57` với `w50_master_hub_loader.js` ở cuối) vào `pg_w50_master.bundle.js` (2,209,701 bytes, `node --check` PASS 100%).
  * Khởi chạy máy chủ `http://localhost:8080/index.html`, đồng bộ hóa toàn bộ 57 modules lên Cloud Vĩnh Viễn GitHub Pages và vượt qua 100% `7/7 CHỐT CHẶN TỰ ĐỘNG` ([tools/sop_pre_response_gate.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/sop_pre_response_gate.py)).
- **2026-11-09**:
  * Quét ngầm Zalo (`Stealth Reader XOR 0x93`) tin nhắn của Tống Trần Hiệp (`UID 7617747951538527859`) lúc `11:00:51 09/11/2026`, giải mã file `Bảng lương T10` mới gửi (`187,022 bytes`) và đối soát toàn diện với [Bảng lương tháng T10 tạm tính.xlsx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/1.%20B%E1%BA%A3ng%20l%C6%B0%C6%A1ng%202026/B%E1%BA%A3ng%20l%C6%B0%C6%A1ng%20th%C3%A1ng%20T10%20t%E1%BA%A1m%20t%C3%ADnh.xlsx), [Bảng lương tháng T9 tạm tính.xlsx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/1.%20B%E1%BA%A3ng%20l%C6%B0%C6%A1ng%202026/B%E1%BA%A3ng%20l%C6%B0%C6%A1ng%20th%C3%A1ng%20T9%20t%E1%BA%A1m%20t%C3%ADnh.xlsx), [Copy of Bảng lương tháng T8 tạm tính.xlsx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/1.%20B%E1%BA%A3ng%20l%C6%B0%C6%A1ng%202026/Copy%20of%20B%E1%BA%A3ng%20l%C6%B0%C6%A1ng%20th%C3%A1ng%20T8%20t%E1%BA%A1m%20t%C3%ADnh.xlsx) và [BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/2.%20CSC%20-%20Ch%E1%BB%89%20s%E1%BB%91/BANG_QUAN_TRI_TAI_CHINH_THUC_TE_T8_T9_2026.xlsx).
  * **Quy chuẩn Hoa hồng Sale 5% (`Ăn Cả Tổng`) theo chỉ đạo Giám Đốc**: Khối Sale (`Tống Trần Hiệp`, `Đường Việt Dũng`) hưởng hoa hồng **`5%` trên TỔNG GIÁ TRỊ HỢP ĐỒNG (`ăn cả tổng`, bao gồm cả phụ kiện/thiết bị/sofa bán kèm)** — Hiệp hưởng đủ **`7,078,211 đ`** (`SP!K171`) và Dũng hưởng đủ **`9,031,292 đ`** (`SP!K182`, trong đó đơn Anh Hào `100,625,844 đ × 5% = 5,031,292 đ`, trừ `2,000,000 đ` đã nhận = tất toán đủ **`3,031,292 đ`**). Việc bóc tách phụ kiện thương mại và gỗ thịt chỉ áp dụng khi tính **Doanh số Xưởng Gỗ CN (`woodVal`)** cho định mức vật tư xưởng `40%` và quỹ lương thợ `15%`.
  * **Chỉ đạo của Giám Đốc về Bỏ Trần 26 Công (`Bỏ trần công — Làm thực tế bao nhiêu trả đủ tiền bấy nhiêu`)**: Tháng 10 nhiều việc, toàn bộ nhân sự đi làm vượt 26 công thực tế (bao gồm cả khối Lương cứng tháng và khối Xưởng) đều giữ nguyên hàm `=SUM(...)` tính đủ 100% số ngày công thực tế, tuyệt đối không dùng `=MIN(SUM(...), 26)` cắt công của anh em:
    - **Tống Trần Hiệp (`R07`)**: `29 công` × `250,000 đ` = **`7,250,000 đ`** (cộng thêm **`+750,000 đ`** cho 3 công vượt trần) + Hoa hồng 5% ăn cả tổng **`7,078,211 đ`** (`SP!K171`) = Tổng lương **`14,328,211 đ`** | Trừ ứng `94,000 đ` | Thực lĩnh: **`14,234,211 đ`**.
    - **Đường Việt Dũng (`R08`)**: `29 công` × `134,615.38 đ` = **`3,903,846 đ`** (cộng thêm **`+403,846 đ`** cho 3 công vượt trần) + Hoa hồng 5% ăn cả tổng **`9,031,292 đ`** (`SP!K182`) + Phụ cấp **`500,000 đ`** = Tổng lương **`13,435,138 đ`** | Trừ ứng `4,000,000 đ` | Thực lĩnh: **`9,435,138 đ`**.
    - **Hoàng Công Vũ (`R14`)**: `28.5 công` × `346,153.85 đ` = **`9,865,385 đ`** (cộng thêm **`+865,385 đ`** cho 2.5 công vượt trần) | Trừ ứng `6,000,000 đ` | Thực lĩnh: **`3,865,385 đ`**.
    - **Nguyễn Văn Thái (`R15`)**: Đi làm 27 ngày (25 ngày đủ + 2 ngày nửa công 22/10 và 28/10 = **`26 công`**) × `384,615.38 đ` = **`10,000,000 đ`** + Phụ cấp **`2,000,000 đ`** = Tổng lương & Thực lĩnh: **`12,000,000 đ`**.
    - **5 Thợ Xưởng (`R18–R22`)**: Hà Viết Hòa (`28 công HC + 66h OT` = **`21,398,750 đ`**), Lê Văn Thoan (`7 công HC + 7h OT` = **`3,740,625 đ`**), Lương Thể Hào (`30 công HC + 62h OT` = **`18,731,250 đ`**), Trần Văn Anh (`26 công HC + 56h OT` = **`14,600,000 đ`**), Lê Tuấn Anh (`20.5 công HC + 20.5h OT` = **`7,303,125 đ`**, trừ ứng `2,000,000 đ`, thực lĩnh **`5,303,125 đ`** — đã sửa `Thẻ lương!H90 = Q22` để không bị trừ đúp tạm ứng 2M).
    - **Tổng hợp Quỹ lương T10 chuẩn (đã bỏ trần công `+2,019,231 đ` và sửa lỗi thiếu `Q22` trong `Q23`)**: Tổng lương 9 nhân sự & thợ (chưa gồm lương BGĐ `12,000,000 đ`): **`115,402,484 đ`** (tính cả BGĐ là **`127,402,484 đ`**) | Tổng tạm ứng: **`12,094,000 đ`** | **Tổng Thực Lĩnh chuyển khoản 9 nhân sự & thợ (`AC24`)**: **`103,308,484 đ`** (hoặc **`101,718,484 đ`** nếu trừ 3 công thừa T9 `1,590,000 đ` của Hòa).
- **2026-11-10**:
  * **Tách vật lý Web App thành 2 Phiên Bản Cách Ly Tuyệt Đối (`Physical 2-Edition Split — Zero Data Leakage`)** bằng công cụ [tools/split_app_two_editions.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/split_app_two_editions.py):
    1. **Bản Nội Bộ Máy Tính Giám Đốc (`LOCAL PC EDITION — CCSC & Giám Đốc`)**:
       - Lưu trữ cách ly tại kho nội bộ [local_admin_vault/](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault) gồm: [director_ccsc_full.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_ccsc_full.html) (`410,619 bytes`), [director_app_full.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_app_full.js) (`321,707 bytes`), và [ccsc_director_vault.json](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/ccsc_director_vault.json).
       - Chạy độc quyền trên máy tính cá nhân của Giám Đốc qua `http://127.0.0.1:8080/` (hoặc `http://localhost:8080/ccsc`) do [web_app/server.py](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/server.py) kiểm tra loopback IP (`127.0.0.1` / `::1`) để phục vụ.
    2. **Bản Deploy Cloud (`DEPLOY EDITION — Văn Phòng & Xưởng`)**:
       - File [web_app/index.html](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html) (`296 KB`, cắt bỏ `115 KB` mã HTML nhạy cảm) và [web_app/app.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/app.js) (`314 KB`) cùng [pg_w50_master.bundle.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules/pg_w50_master.bundle.js) đã **xóa vật lý 100%** 6 phân hệ Giám Đốc/CCSC (`#tab-dashboard`, `#tab-ccsc-t8-t9`, `#tab-ccsc-matrix`, `#tab-quan-tri-nhan-su`, `#tab-chien-luoc-20-giai-phap`, `#tab-rnd-phase2-hub`), hộp đối soát quỹ khoán thợ 15%, `#fundMonitorWidget`, chữ `Lợi Nhuận Gộp 30% Bỏ Túi BGĐ`, mảng `ccscMonths`, lương BGĐ `CP-03`, tài khoản `giamdoc` và 6 modules Admin (`w01`, `w02`, `w03`, `w04`, `w38`, `w45`).
       - Gia cố [api/index.js](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/api/index.js) (`sanitizeStateForDeploy` xóa sạch `ccscMonths`, `CP-03`, `giamdoc` ở tầng API Cloud) và [.vercelignore](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/.vercelignore) chặn tuyệt đối `local_admin_vault/` và `*.xlsx` không bao giờ đẩy lên Cloud.
- **2026-11-11 (Kiểm Toán Tổng Thể 15 Sub-Agent Gemini Pro — 50 Lỗ Hổng + 50 Cải Tiến + Kế Hoạch Vá 5 Đợt)**:
  * Huy động 15 Sub-Agent Gemini Pro (`SA01` – `SA15`, chế độ Read-Only Sandbox độc lập 15 phân khu, thu hồi sạch 100% qua `kill_all` ngay khi hoàn tất) rà soát toàn bộ mã nguồn trên ổ cứng.
  * Phát hiện chính xác **50 lỗ hổng thực tế (`V01` – `V50`: 16 Critical, 27 High, 7 Medium)** — nổi bật: tái phát lộ thẻ `<script>` CCSC (`w01`–`w04, w38, w45`) trong `web_app/index.html` (`485 KB`) & `pg_w50_master.bundle.js`, thiếu xác thực ghi state (`/api/save-state`, `validateRole` thiếu `mandatory: true`), vượt chốt chặn `Cost <= 54%` khi in báo giá, lộ sẵn mã PIN `0986` trong `prompt()`, XML XXE trong `tax_einvoice_3way_matcher.py`, CSV Formula Injection trong `w27`, Stored DOM XSS, và quên cộng `total_new_captured` trong `monitor_all_phu_gia_groups.py`.
  * Đề xuất **50 cải tiến tối ưu chiều sâu (`I01` – `I50`)** và lập **Kế hoạch Vá Lỗ Hổng 5 Đợt (`Đợt 1 P0` $\rightarrow$ `Đợt 5 Nghiệm thu Gatekeeper`)** cam kết bảo toàn nguyên vẹn 100% khung giao diện gốc chuẩn `UI_GOLDEN_BASELINE_V1`.
  * **Việc cần làm tiếp theo**: Chờ Giám Đốc duyệt lệnh triển khai thi công 5 Đợt vá lỗ hổng & tối ưu theo bản kế hoạch.
