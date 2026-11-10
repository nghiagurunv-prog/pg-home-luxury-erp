# SỔ CÁI BỘ NHỚ NGOÀI BẤT TỬ - TRẠNG THÁI HỆ THỐNG PG HOME LUXURY ERP
> **PROJECT_STATE.md** | Bản cập nhật trạng thái toàn diện ngày 08/11/2026
> Đơn vị: **Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng** (Thương hiệu: **CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY**)
> Cơ chế: Sổ Cái Bộ Nhớ Ngoài Bất Tử (External Ground-Truth State) — Cứu cánh chống quên, chống tràn context và định hướng hành động cho toàn bộ Trợ lý AI và Sub-Agent.

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
