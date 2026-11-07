# SỔ TAY QUẢN TRỊ 03: DỰ TOÁN SALE, BẢO VỆ DÒNG TIỀN, ĐỊNH MỨC TẤM CẮT CNC & ĐIỀU QUAN (MỤC 17 - 25)
> [!IMPORTANT]
> **TÀI LIỆU QUY CHUẨN NỘI BỘ TỐI CAO - BỘ QUY TẮC CHI TIẾT DỰ ÁN PG HOME LUXURY (TRÍCH XUẤT 100% NGUYÊN BẢN GỐC).**
> Bao gồm chi tiết: Phân hệ dự toán Sale, 10 quy chuẩn kéo Zalo tự động, 40 quy chuẩn thống kê, 50 nguyên tắc kỷ luật thép, tổng kết lỗi lịch sử & 6 chốt chặn, lưu bộ nhớ 06/11, đồng bộ ngầm Zalo V4.0, định mức tấm CNC thực tế (Mục 24), quy chế điều hành Sub-Agent (Mục 25).

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
32. **Mô hình 5 Chiều Quản trị:** Nguồn gốc $
ightarrow$ Động cơ $
ightarrow$ Kỹ thuật $
ightarrow$ Đối soát chéo $
ightarrow$ Dòng tiền BGĐ.
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
  * **File Khởi Động Nhanh 1 Chạm (Launcher):** [KHOI_DONG_QUAN_TRI_PG_HOME.bat](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%E1%BB%8B/KHOI_DONG_QUAN_TRI_PG_HOME.bat)

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

---

## MỤC 25 (BỔ SUNG NÂNG CẤP 07/11/2026): QUY CHẾ ĐIỀU HÀNH ĐỘI QUÂN 15–55 SUB-AGENT FLASH SONG SONG & ĐỘI ĐẶC NHIỆM GIÁM SÁT LIÊN TỤC (3–5 SUPERVISORS)

> [!IMPORTANT]
> **QUY CHUẨN ĐIỀU HÀNH TÁC CHIẾN ĐỈNH CAO: BUNG ĐỒNG LOẠT 15–55 CÔNG NHÂN FLASH KẾT HỢP ĐỘI ĐẶC NHIỆM KIỂM TOÁN ĐỘC LẬP (3–5 SUPERVISORS)**  
> Chuẩn hóa ngày 07/11/2026 bởi Giám Đốc Nguyễn Viết Nghĩa: Đảm bảo hiệu suất tối đa, thời gian hoàn thành siêu tốc mà không gây xung đột tài nguyên hay vi phạm kỷ luật thép.

### 25.1. CƠ CHẾ CHIA 15–55 KHOẢNH ĐẤT ĐỘC LẬP (`1 CÔNG NHÂN = 1 FILE/THƯ MỤC RIÊNG`):
1. **Phân Vùng Độc Lập Tuyệt Đối (Blast Radius = Zero):**
   - Mỗi công nhân Flash (`Model="flash"`) khi được bung ra qua `invoke_subagent` chỉ được giao duy nhất 1 tệp tin hoặc 1 thư mục riêng biệt.
   - Cấm tuyệt đối công nhân lấn sân, đọc trộm, sửa chéo vào file của công nhân khác hoặc file mã nguồn dùng chung khi chưa được Tổng Chỉ Huy cấp phép.
2. **Kỷ Luật Không Tranh Chấp Tài Nguyên Sống (Zero Resource Lock):**
   - Tuyệt đối cấm nhiều công nhân cùng ghi đè 1 cơ sở dữ liệu SQLite, cùng mở ghi 1 file JSON/Excel, hoặc cùng điều khiển tiến trình hệ thống.
   - Mọi kết quả xử lý của công nhân phải xuất ra file báo cáo riêng hoặc gửi nguyên trạng bằng chứng qua `send_message` về Tổng Chỉ Huy.
3. **Thu Hồi & Dọn Dẹp Sạch Sẽ (Garbage Collection):**
   - Sau khi hoàn tất mỗi đợt tác chiến song song (Wave), Tổng Chỉ Huy chủ động gọi `manage_subagents(Action="kill")` hoặc `Action="kill_all"` để thu hồi triệt để tài nguyên, tránh rò rỉ tiến trình nền.

### 25.2. ĐỘI ĐẶC NHIỆM GIÁM SÁT VIÊN ĐỘC LẬP LIÊN TỤC (3–5 SUPERVISORS):
Để duy trì nguyên tắc Zero-Trust Audit, Tổng Chỉ Huy luôn duy trì 3–5 Giám sát viên độc lập (`TypeName="research"`, Read-Only) giám sát chéo toàn diện 4 trụ cột an toàn:
1. **Chốt chặn 1 - An Toàn Ngoại Vi & Cửa Sổ (`UI/Hardware Zero-Disruption`):**
   - Giám sát nghiêm ngặt: Tuyệt đối không để bất kỳ script hay công nhân nào can thiệp chuột, bàn phím, hay cướp tiêu điểm cửa sổ (`SetForegroundWindow`, `BringWindowToTop`) khi Giám Đốc đang làm việc trên máy tính. Cấm làm nhấp nháy hay gián đoạn ứng dụng Zalo PC của Giám Đốc.
2. **Chốt chặn 2 - Không Tranh Chấp Tài Nguyên Sống (`Lock & Concurrency Audit`):**
   - Giám sát xung đột: Kiểm tra khóa file, tiến trình chạy song song, đảm bảo không có xung đột ghi trên cơ sở dữ liệu và file hệ thống.
3. **Chốt chặn 3 - Tính Chuẩn Xác Số Liệu Tài Chính & Định Mức CNC (`Financial & CNC Accuracy`):**
   - Kiểm toán số liệu: Đối soát 100% dữ liệu số trước khi công bố (đúng công thức định mức tấm CNC Mục 24, đúng đơn giá công nhật Hòa 530k, Hào 450k, không làm tròn số lẻ, đúng 3 cấp vật liệu An Cường - Thái Lan - Plywood).
4. **Chốt chặn 4 - Kiểm Soát Tuân Thủ Quy Trình Master SOP (`SOP Compliance Gate`):**
   - Kiểm tra cú pháp (`node -c`), kiểm thử render (`test_all_renders.js`), đảm bảo không có code lỗi, không mock ảo, tuân thủ nghiêm ngặt 50 nguyên tắc chống làm ẩu.

### 25.3. KIẾN TRÚC ĐỒNG BỘ ZALO STEALTH V6.0 (SIÊU TỐC & VÔ HÌNH TUYỆT ĐỐI):
Nâng cấp toàn diện cơ chế đọc dữ liệu ngầm từ Zalo PC mà không làm ảnh hưởng đến Giám Đốc:
1. **SQLite Read-Only Direct Engine (`mode=ro`):**
   - Kết nối trực tiếp vào cơ sở dữ liệu SQLite của Zalo ở chế độ chỉ đọc (`file:...sqlite?mode=ro`), không tạo lock, không gây xung đột ghi với Zalo.exe.
2. **In-Memory Decryption `fileNoise` XOR `0x93`:**
   - Xử lý giải mã ảnh/media Zalo ngay trong bộ nhớ RAM qua phép toán XOR `0x93` mà không cần ghi file tạm ra đĩa, giảm tải 100% I/O ổ cứng và tăng tốc xử lý.
3. **Phân Nhóm Giám Sát 16 Nhóm Core Thực Tế:**
   - Mở rộng độ phủ lên 16 nhóm nhà cung cấp, xưởng sản xuất, đá, kính, phụ kiện và văn phòng trọng điểm, đồng bộ hóa hóa đơn và biên bản trong thời gian thực.
4. **Bộ Đệm Thời Gian Biến Đổi Siêu Tốc (MTime Cache `< 1ms`):**
   - Ứng dụng cache `mtime` và kích thước file để bỏ qua ngay các tệp không đổi trong `< 1ms`, giảm mức tiêu hao CPU nền xuống $\le 0.1\%$, mang lại trải nghiệm êm mượt tuyệt đối cho Giám Đốc.
