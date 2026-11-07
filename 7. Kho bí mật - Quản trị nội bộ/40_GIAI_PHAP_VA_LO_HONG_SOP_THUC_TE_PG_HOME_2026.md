# BẢN ĐỀ XUẤT 40 GIẢI PHÁP VÁ LỖ HỔNG SOP QUẢN TRỊ THỰC TẾ
## NÓI THẲNG - NÓI THẬT - NÓI DƯỚI SỰ THẬT - BẢO VỆ DÒNG TIỀN CHO GIÁM ĐỐC
### DỰ ÁN QUẢN TRỊ DOANH NGHIỆP PG HOME LUXURY (NĂM 2026)

> **Người thực hiện:** Trợ lý Quản trị Hệ thống  
> **Kính trình:** Giám Đốc Điều Hành (Anh Nguyễn Viết Nghĩa)  
> **Nguyên tắc xuyên suốt:** **Tuyệt đối không bốc phét, không tô hồng sự thật, nói đúng thực trạng phũ phàng, bóc trần mọi lỗ hổng vận hành và đưa ra giải pháp vá dứt điểm.**

---

## LỜI TỰ NHẬN THỨC VÀ BỐI CẢNH THỰC TẾ

Qua quá trình cọ xát với thực tế vận hành tại PG Home Luxury (đối soát 13 nhóm Zalo, cào dữ liệu LevelDB, kiểm tra bảng lương thợ, rà soát sổ nợ Lam Giang, Quốc Tâm, ALD và bóc tách hợp đồng), hệ thống nhận thấy công ty đang vận hành với nhiều **kẽ hở chết người**. 

Doanh nghiệp nội thất quy mô vừa và nhỏ thường chết không phải vì thiếu khách hàng, mà chết vì: **Lợi nhuận trên giấy thì có nhưng két sắt lại rỗng tiền; thợ hưởng lương công nhật an toàn còn rủi ro hỏng hóc đè hết lên vai Giám Đốc; nhà cung cấp đòi nợ gối đầu liên tục; nhân viên cấp dưới tự do đặt hàng và làm báo cáo ảo che mắt lãnh đạo.**

Dưới đây là **40 giải pháp thực chiến**, được chia thành 6 phân hệ cốt lõi để vá triệt để mọi lỗ hổng:

---

### PHÂN HỆ 1: VÁ LỖ HỔNG TÀI CHÍNH KHOÁN & BẢO VỆ LỢI NHUẬN BGĐ (8 GIẢI PHÁP)

#### 1. Lỗ hổng 1: Cào bằng định mức vật tư 40% mà không kiểm soát thực tế từng công trình.
- **Thực trạng phũ phàng:** Do xưởng chưa có thói quen gom hóa đơn theo từng công trình, hệ thống CCSC đang phải tạm tính Col AU $= \text{Doanh số xưởng} \times 40\%$. Nếu thợ cắt sai, làm hỏng nhiều ván Lam Giang, Giám Đốc hoàn toàn không biết công trình đó đang bị âm vốn vật tư.
- **Giải pháp vá:** Bắt buộc áp dụng mã thẻ vật tư: Mỗi công trình khi chốt báo giá phải có 1 mã dự án (ví dụ: `DA-HOA`). Khi Vũ đặt ván Lam Giang hoặc nẹp, tin nhắn Zalo gửi NCC bắt buộc phải kèm mã `DA-HOA`. Cuối tháng, kế toán cộng dồn hóa đơn của mã đó so với định mức 40%. Nếu vượt quá 42%, trừ trực tiếp vào tiền phạt trách nhiệm quản lý xưởng.

#### 2. Lỗ hổng 2: Ảo tưởng lợi nhuận xưởng 2.2% khi xưởng đang âm quỹ khoán.
- **Thực trạng phũ phàng:** Hai tháng T8 và T9 xưởng chi tiền trả thợ thực tế là 85.34M, vượt quá quỹ khoán 15% là -5.86M. Nếu hệ thống tự động nhân 2.2% doanh số sẽ làm lợi nhuận công ty bị tính ảo thêm 11.66M, Giám Đốc tưởng có lãi nhưng thực tế tiền đã chảy vào túi thợ.
- **Giải pháp vá:** Khóa cứng công thức logic: **Nếu Quỹ khoán thợ 15% bị âm $\implies$ Lợi nhuận xưởng (Col BG) = 0 đ tuyệt đối**. Chỉ khi nào xưởng sản xuất vượt năng suất, quỹ thợ dư dương thì Giám Đốc mới trích thưởng 2.2%.

#### 3. Lỗ hổng 3: Lộ bí mật cơ chế khoán 55% - 40% - 15% cho nhân viên.
- **Thực trạng phũ phàng:** Nhân viên văn phòng hoặc thợ nếu nhìn thấy tỷ lệ khoán sẽ so bì: "Tại sao công trình 100 triệu mà xưởng chỉ được 15 triệu tiền công?". Điều này gây bất mãn nội bộ và làm thợ đòi tăng đơn giá công nhật.
- **Giải pháp vá:** Triệt tiêu hoàn toàn các số liệu khoán trên giao diện của nhân viên (Role `XUONG_VATTU` và `VANPHONG_SALE`). Triển khai **Executive Privacy Shield** mặc định làm mờ toàn bộ số tiền lãi, chỉ duy nhất tài khoản ADMIN của Giám Đốc mới có thẩm quyền giải mã bằng phím `P` hoặc nút Mắt.

#### 4. Lỗ hổng 4: Chảy máu tiền mặt do chi thưởng vượt mức doanh số hàng tháng.
- **Thực trạng phũ phàng:** Nếu tháng nào doanh số > 500M mà chi tiền mặt ngay 0.5% cho Thái, 0.3% cho Vũ, 0.5% cho Hiệp thì công ty sẽ cạn sạch tiền lưu động trả tiền ván cho Lam Giang.
- **Giải pháp vá:** Thực hiện nghiêm túc Quy chế C2 của Giám Đốc: **Hàng tháng chỉ ghi nhận sổ sách theo dõi quỹ tích lũy, tuyệt đối cấm xuất quỹ chi tiền mặt**. Toàn bộ tiền thưởng vượt mức dồn đến kỳ quyết toán lương thưởng Tết Nguyên Đán mới chi trả một lần, với điều kiện công nợ khách hàng đã thu hồi $\ge 85\%$.

#### 5. Lỗ hổng 5: Thất thoát tiền mặt khi cộng phụ cấp trách nhiệm vào lương thợ hàng tháng.
- **Thực trạng phũ phàng:** Trước đây bảng lương của Hòa bị cộng thêm 560k (28 công x 20k) và Hào bị cộng 600k (30 công x 20k) vào cột thực lĩnh. Điều này biến khoản tiền thưởng trách nhiệm thành tiền công nhật mặc định, thợ lĩnh xong nếu làm hỏng việc Giám Đốc không có cách nào thu hồi.
- **Giải pháp vá:** Khóa cứng đơn giá thực chi hàng tháng: Hòa đúng 530k/ngày, Hào đúng 450k/ngày + tiền làm thêm OT thực tế. Khoản 20k/công trách nhiệm treo dồn lại cuối năm đánh giá chất lượng sản phẩm mới quyết toán cùng thưởng Tết.

#### 6. Lỗ hổng 6: Báo giá gộp làm vống Doanh số xưởng và đội tiền công thợ.
- **Thực trạng phũ phàng:** Hợp đồng Cậu Chiến 154M có 16.5M cửa gỗ thịt; HĐ Anh Tuấn 111.8M có 14.8M thiết bị bếp Hafele. Nếu không bóc tách, Doanh số xưởng gỗ CN bị đội lên 31.3M, kéo theo quỹ thợ 15% bị chi thừa hơn 4.7 triệu đồng tiền mặt!
- **Giải pháp vá:** Áp dụng công thức bắt buộc khi ký hợp đồng: $\text{Doanh số Xưởng Gỗ CN} = \text{Tổng HĐ} - \text{Gỗ Thịt} - \text{Phụ Kiện Thương Mại}$. Nhân viên kinh doanh lập báo giá phải chia làm 3 bảng riêng biệt, không được viết gộp một cục.

#### 7. Lỗ hổng 7: Ôm nợ thay cho hãng phụ kiện và thiết bị thương mại.
- **Thực trạng phũ phàng:** Khi bán phụ kiện Hafele, Eurogold (lãi 30%), công ty phải bỏ tiền mặt ra nhập hàng trước cho khách, nhưng khách lại giữ nợ tiền công trình. Nếu khách chây ì, khoản lãi 30% chưa thấy đâu mà công ty đã bị chôn vốn hàng chục triệu đồng.
- **Giải pháp vá:** Bắt buộc thu tiền cọc phụ kiện/thiết bị $\ge 70\%$ ngay khi ký phụ lục hợp đồng đồ rời. Tiền tạm ứng của khách về đến đâu mới chuyển tiền đặt hàng đến đó, tuyệt đối không xuất quỹ công ty ra ứng trước cho đại lý.

#### 8. Lỗ hổng 8: Tính chi phí vận tải xe tải và điện nước theo % doanh số ảo.
- **Thực trạng phũ phàng:** CCSC đang tính tạm Xe tải 1.5% và Điện nước 1.5% theo doanh số xưởng. Tháng nào doanh số cao thì chi phí này tự nhiên đội lên dù số chuyến xe chạy không tăng tương ứng.
- **Giải pháp vá:** Lắp công tơ điện 3 pha riêng cho khu vực máy cắt CNC và máy dán cạnh. Xe tải chở hàng phải có sổ nhật trình ghi rõ: Ngày đi, công trình nào, số km khởi hành, số km kết thúc và phiếu mua xăng đính kèm để quyết toán thực tế.

---

### PHÂN HỆ 2: VÁ LỖ HỔNG QUẢN LÝ VẬT TƯ & NHÀ CUNG CẤP (8 GIẢI PHÁP)

#### 9. Lỗ hổng 9: Đặt hàng vật tư qua tin nhắn Zalo phân tán, kỹ thuật tự ý đặt lẻ.
- **Thực trạng phũ phàng:** Xưởng có đến 13 nhóm Zalo đặt hàng. Hoàng Công Vũ hoặc thợ xưởng thường nhắn tin đặt hàng lẻ (như đơn 170k, 80k Quốc Tâm) mà không thông qua Giám Đốc. Cuối tháng gom lại thành một cục nợ khổng lồ.
- **Giải pháp vá:** Gom toàn bộ đầu mối đặt hàng vào 1 nhóm duy nhất: `PG HOME - DUYỆT ĐẶT VẬT TƯ`. Kỹ thuật xưởng muốn đặt bất kỳ thứ gì (dù chỉ là 1 cuộn băng keo) đều phải lập phiếu PO trên phần mềm và được Giám Đốc duyệt điện tử trước khi gửi cho NCC.

#### 10. Lỗ hổng 10: Tình trạng "Sự đã rồi" - Đặt hàng trước, Giám Đốc duyệt sau.
- **Thực trạng phũ phàng:** Vũ thường gọi điện cho Lam Giang chở ván đến xưởng trước với lý do "thợ đang ngồi chờ ván ép tiến độ", sau đó mới gửi phiếu xin Giám Đốc duyệt. Lúc này Giám Đốc buộc phải duyệt vì hàng đã hạ xuống xưởng.
- **Giải pháp vá:** Ra thông báo bằng văn bản gửi đích danh bà chủ kho Lam Giang (Ms Hoa) và chủ tiệm Quốc Tâm: **"PG Home chỉ chấp nhận thanh toán các đơn hàng có Phiếu Đặt Hàng đóng Dấu Đỏ Điện Tử của Giám Đốc Nguyễn Viết Nghĩa. Mọi đơn hàng do nhân viên tự gọi qua điện thoại mà không có dấu đỏ, PG Home không chịu trách nhiệm thanh toán"**. Chỉ cần 1 lần NCC bị từ chối thanh toán, họ sẽ không bao giờ dám giao hàng chui cho thợ.

#### 11. Lỗ hổng 11: Nợ gối đầu Lam Giang quá cao (147.49 triệu), nguy cơ bị cắt nguồn hàng vụ Tết.
- **Thực trạng phũ phàng:** Dù ngày 02/11 đã chuyển trả 16.838M, nhưng dư nợ ván Lam Giang vẫn ở mức rất cao (147.49M). Vào vụ Tết tháng 11-12, nếu nợ chạm trần 200M, Lam Giang sẽ dừng cấp ván cốt xanh, toàn bộ xưởng sẽ tê liệt.
- **Giải pháp vá:** Thiết lập cơ chế thanh toán "cuốn chiếu": Mỗi khi thu được tiền tạm ứng công trình từ khách hàng (như nhà Chị Hoa, Anh Công), trích ngay 40% số tiền đó chuyển khoản thẳng cho Lam Giang để gạch nợ của chính công trình đó, duy trì hạn mức dư nợ luôn dưới 120M an toàn.

#### 12. Lỗ hổng 12: Hóa đơn viết tay Quốc Tâm dễ bị thất lạc và tẩy xóa.
- **Thực trạng phũ phàng:** Quốc Tâm bán hàng kim khí (bản lề, ray bi, ốc vít) toàn xé hóa đơn bán lẻ viết tay bằng giấy than (như số 4/11 và 5/11). Thợ cầm về bỏ túi quần nhàu nát hoặc làm mất, cuối tháng đối soát sổ nợ rất dễ bị kê khống thêm các món thợ không mua.
- **Giải pháp vá:** Quy định thợ mua hàng xong phải đặt hóa đơn lên mặt bàn, dùng điện thoại chụp rõ nét gửi ngay vào nhóm Zalo nội bộ và gắn thẻ kế toán. Ảnh chụp phải lưu trữ tự động vào thư mục máy chủ ngay trong ngày.

#### 13. Lỗ hổng 13: Cánh Acrylic dán No-Line ALD bị trầy xước không được bắt đền kịp thời.
- **Thực trạng phũ phàng:** Cánh Acrylic đặt từ xưởng ALD gửi xe tải về xưởng (như đơn Chị Hoa 12.21M, Anh Minh 22.75M), thợ nhận hàng không lột góc kiểm tra đường dán noline và xước bề mặt mà đã ký nhận của lái xe. Đến khi lắp lên tủ bếp cho khách phát hiện lỗi thì bên ALD từ chối bảo hành.
- **Giải pháp vá:** Biên bản bàn giao 3 bên: Khi nhận cánh Acrylic từ nhà xe, Vũ phải trực tiếp kiểm tra 100% các cạnh dán noline và quay video mở hộp. Nếu phát hiện mẻ góc hoặc xước phim bảo vệ, lập biên bản từ chối nhận hàng và gửi video ngay cho kinh doanh ALD để ép đổi trả tấm mới.

#### 14. Lỗ hổng 14: Bỏ quên đơn trả hàng cho NCC, bị tính nợ oan.
- **Thực trạng phũ phàng:** Ngày 23/10 xưởng trả đơn ván Plywood `SON00337` trị giá 750.000 đ cho Gỗ NT Cầu Vượt. Nếu kế toán không gạch nợ trên phần mềm thì tháng sau nhà cung cấp sẽ lờ đi và vẫn đòi nguyên số nợ cũ (82.81M thay vì 82.06M).
- **Giải pháp vá:** Bổ sung tính năng "Đơn Trả Hàng (Return PO)" trên phần mềm quản trị: Mỗi khi trả lại ván lỗi hay phụ kiện thừa, hệ thống tự động sinh số âm và trừ thẳng vào công nợ NCC tương ứng, bắt buộc NCC phải ký xác nhận cấn trừ công nợ.

#### 15. Lỗ hổng 15: Lãng phí ván tấm thừa (vụn ván) chất đống ở xưởng.
- **Thực trạng phũ phàng:** Thợ cắt ván tấm lớn (1.22m x 2.44m), các phần ván thừa khổ 40cm x 1.2m hoặc 60cm x 80cm bị vứt ngổn ngang ở góc xưởng, lâu ngày bụi bẩn và ẩm mốc phải vứt bỏ làm củi vụn, gây thất thoát hàng chục triệu đồng tiền cốt gỗ.
- **Giải pháp vá:** Bắt buộc Vũ chạy phần mềm tối ưu cắt ván (Nesting) trước khi ra lệnh cắt CNC. Các tấm ván thừa diện tích $\ge 0.5\,\text{m}^2$ phải được dán nhãn ghi rõ mã màu (ví dụ: `MS 388 Thái`) và xếp lên giá kệ lưu trữ để tận dụng đóng đợt tủ, hộc kéo cho các công trình nhỏ sau.

#### 16. Lỗ hổng 16: Không kiểm đếm quy cách ván khi xe Lam Giang hạ hàng.
- **Thực trạng phũ phàng:** Lái xe tải Lam Giang chở ván đến lúc xưởng đang làm ồn ào, thợ chỉ đếm số lượng tấm trên xe rồi ký giấy giao nhận mà không kiểm tra độ dày thực tế (17mm hay 15mm, cốt xanh HMR hay MDF thường).
- **Giải pháp vá:** Trang bị thước kẹp cơ khí tử tế tại xưởng. Thợ nhận hàng bắt buộc phải kẹp ngẫu nhiên 3 tấm ở đầu, giữa và cuối lô hàng để kiểm tra độ dày chuẩn và màu cốt gỗ xanh chống ẩm trước khi ký giấy cho xe rời đi.

---

### PHÂN HỆ 3: VÁ LỖ HỔNG CHẤM CÔNG & QUẢN TRỊ THỢ XƯỞNG (8 GIẢI PHÁP)

#### 17. Lỗ hổng 17: Chấm công thủ công qua Zalo, đi muộn về sớm vẫn tính tròn 1 công.
- **Thực trạng phũ phàng:** Hàng ngày Vũ hoặc Thái nhắn tin Zalo: "Hôm nay xưởng đủ 7 người". Không có giờ đến, không có giờ về. Thợ đến muộn 30 phút hay về sớm 15 phút vẫn được chấm tròn 1 ngày công nhật (mất trắng 530k cho Hòa hoặc 450k cho Hào).
- **Giải pháp vá:** Lắp máy chấm công vân tay/khuôn mặt có kết nối Wifi tại cửa xưởng (chi phí chỉ khoảng 1.5 triệu đồng). Đúng 7h30 sáng khóa cửa quét vân tay, chiều 17h30 quét lần 2. Dữ liệu tự động đổ về bảng chấm công trên phần mềm của Giám Đốc, không để con người can thiệp chấm bằng cảm tính.

#### 18. Lỗ hổng 18: Lạm phát giờ tăng ca (OT) làm đội chi phí nhân công.
- **Thực trạng phũ phàng:** Tháng 8 xưởng OT 81 giờ (tiền công thợ lên 41.28M), Tháng 9 OT tiếp 76 giờ (tiền công lên 44.05M). Thợ có tâm lý ban ngày làm tà tà để tối được ở lại làm tăng ca hưởng lương nhân hệ số 1.5.
- **Giải pháp vá:** Siết chặt quy chế làm thêm giờ: **Chỉ được tăng ca khi có Phiếu Đăng Ký OT ghi rõ công việc cụ thể** (ví dụ: "Tối nay dán cạnh hoàn thiện 15 cánh tủ áo nhà Chị Hoa để sáng mai chở đi"). Sáng hôm sau Giám Đốc hoặc quản lý xưởng nghiệm thu khối lượng công việc hoàn thành; nếu không đạt khối lượng, hủy bỏ toàn bộ giờ OT của buổi tối hôm đó.

#### 19. Lỗ hổng 19: Nhân sự đã nghỉ việc vẫn sót lại trên bảng biểu.
- **Thực trạng phũ phàng:** Trước đây 4 nhân sự đã nghỉ việc (Lực, Hùng, Bình, Tuyết) vẫn lặp đi lặp lại trong danh sách chấm công và danh mục nhân sự, làm bảng biểu bị kéo dài lê thê và tiềm ẩn nguy cơ kế toán chuyển nhầm lương.
- **Giải pháp vá:** Khóa cứng danh sách nhân sự hiện tại gồm đúng 9 người đang làm việc thực tế (7 thợ xưởng: Hòa, Thái, Thoan, Vũ, Hào, Trần Văn Anh, Tuấn Anh; 2 văn phòng: Hiệp, Dũng). Xóa vĩnh viễn dữ liệu người đã nghỉ khỏi giao diện nhập liệu hàng ngày.

#### 20. Lỗ hổng 20: Thợ làm sai sản phẩm nhưng công sửa lỗi lại tính vào công nhật công ty trả.
- **Thực trạng phũ phàng:** Thợ khoan nhầm cam chốt, cắt hụt kích thước ván tủ bếp, phải tháo ra cạo keo làm lại mất 2 ngày công. Công ty vừa mất ván mới để đền, vừa phải trả 2 ngày lương công nhật cho thợ ngồi sửa lại chính lỗi của mình!
- **Giải pháp vá:** Áp dụng chế tài phạt lỗi tay nghề: **Lỗi do đọc sai bản vẽ hoặc gia công ẩu thì thợ phải làm lại ngoài giờ không tính công (OT = 0h)**. Nếu làm hỏng ván tấm lớn, trừ 30% giá trị tấm ván vào tiền thưởng trách nhiệm cuối năm của thợ đó.

#### 21. Lỗ hổng 21: Nguy cơ cháy nổ xưởng gỗ thiêu rụi tài sản hàng tỷ đồng.
- **Thực trạng phũ phàng:** Xưởng sản xuất đầy mùn cưa mịn và keo dán dính, nhưng thợ vẫn có thói quen hút thuốc lá lén lút ở góc xưởng và dây điện máy cầm tay kéo lê dưới sàn nhà ẩm ướt.
- **Giải pháp vá:** Ban hành lệnh cấm hút thuốc tuyệt đối trong khuôn viên xưởng (vi phạm phạt ngay 500k/lần và đình chỉ công tác 3 ngày). Hàng ngày đúng 17h30, Tuấn Anh (thợ đóng gói) có trách nhiệm quét dọn sạch toàn bộ mùn cưa và ngắt cầu dao tổng điện máy trước khi khóa cửa xưởng.

#### 22. Lỗ hổng 22: Rủi ro pháp lý và an toàn lao động của thợ thời vụ.
- **Thực trạng phũ phàng:** Hiện công ty chỉ đóng BHXH tối thiểu cho 6 nhân sự nòng cốt (1.1M/người/tháng). Thợ phụ và thợ lắp đặt không có bảo hiểm, nếu trèo thang khoan lắp tủ áo bị ngã tai nạn thì Giám Đốc sẽ phải gánh chịu toàn bộ chi phí y tế và trách nhiệm pháp luật.
- **Giải pháp vá:** Mua ngay gói **Bảo hiểm Tai Nạn Con Người 24/24** cho toàn bộ 7 thợ xưởng (phí bảo hiểm chỉ khoảng 300.000 đ/người/năm, bồi thường lên đến 50 triệu đồng/vụ). Đồng thời trang bị bắt buộc: Giày bảo hộ mũi sắt, kính chống bụi và dây đai an toàn khi đi công trình.

#### 23. Lỗ hổng 23: Thợ dán cạnh dán keo không đều làm bong nẹp sau 1 tháng bàn giao.
- **Thực trạng phũ phàng:** Thoan đứng máy dán cạnh tự động nhưng không kiểm tra nhiệt độ nồi keo dán nhiệt Jowat (đạt chuẩn phải 180°C - 200°C). Keo chưa đủ nhiệt đã đẩy ván vào dán, nhìn bên ngoài tưởng dính nhưng giao đến nhà khách dùng máy lạnh 1 tháng là nẹp tự bong ra.
- **Giải pháp vá:** Quy định kiểm tra nhiệt độ máy dán cạnh: Đầu giờ sáng, Thoan phải chạy thử 1 thanh ván phế phẩm, dùng tay bóc thử nẹp; nếu keo ăn chết vào cốt gỗ không bóc được mới cho phép dán ván của công trình.

#### 24. Lỗ hổng 24: Thiếu hụt thợ lắp đặt hoàn thiện vào ngày cao điểm bàn giao.
- **Thực trạng phũ phàng:** Khi có 2 công trình bàn giao cùng lúc (như nhà Chị Hoa và Anh Tuấn), thợ xưởng phải bỏ dở việc cắt ván ở xưởng để đi lắp đặt công trình, làm xưởng bị đình trệ sản xuất các đơn hàng tiếp theo.
- **Giải pháp vá:** Phân tách rõ ràng: Trần Văn Anh và Lương Thể Hào chuyên trách mũi nhọn lắp đặt công trình ngoài; nhóm ở xưởng (Hòa, Thoan, Tuấn Anh) tiếp tục duy trì sản xuất liên tục tại máy. Không điều động ồ ạt cả xưởng đi công trình làm đứt gãy chuỗi sản xuất.

---

### PHÂN HỆ 4: VÁ LỖ HỔNG KINH DOANH, DỰ TOÁN & THU TIỀN (8 GIẢI PHÁP)

#### 25. Lỗ hổng 25: Tự ý chiết khấu giảm giá làm teo tóp lợi nhuận công ty.
- **Thực trạng phũ phàng:** Hiệp hoặc Dũng khi gặp khách hàng khó tính thường tự ý giảm giá 5% - 10% hoặc hứa hẹn tặng thêm phụ kiện đắt tiền để chốt được hợp đồng lấy hoa hồng cá nhân, nhưng phần chi phí giảm đó lại trừ thẳng vào lợi nhuận của Giám Đốc.
- **Giải pháp vá:** Ban hành khung chính sách giá cố định: **Nhân viên kinh doanh tuyệt đối không có quyền tự ý giảm 1 đồng trên đơn giá chuẩn**. Mọi yêu cầu chiết khấu hoặc tặng quà trị giá trên 1 triệu đồng bắt buộc phải trình Giám Đốc phê duyệt bằng văn bản.

#### 26. Lỗ hổng 26: Bóc tách dự toán 3D thiếu hạng mục, xưởng phải gánh chi phí phát sinh.
- **Thực trạng phũ phàng:** Hiệp vẽ 3D và bóc dự toán sơ sài, bỏ quên chiều dài led cảm ứng, quên phụ kiện tay nâng cánh đôi tủ bếp. Đến khi ký hợp đồng xong chuyển xuống xưởng, Vũ phát hiện thiếu phải mua thêm, dẫn đến công trình bị đội chi phí ngoài kế hoạch.
- **Giải pháp vá:** Quy trình duyệt chéo kỹ thuật: Bản vẽ 3D và bảng dự toán trước khi gửi khách ký bắt buộc phải có chữ ký xác nhận của Vũ (Kỹ thuật bóc tách xưởng). Vũ kiểm tra nếu thấy thiếu khối lượng thì bắt Hiệp sửa lại ngay. Nếu công trình phát sinh do lỗi bóc tách của ai thì người đó bị trừ vào tiền % sản phẩm.

#### 27. Lỗ hổng 27: Tiến độ thu tiền công nợ lỏng lẻo, bị khách giữ nợ kéo dài (Anh Tuấn nợ quá hạn 61.8M).
- **Thực trạng phũ phàng:** HĐ Anh Tuấn 111.8M mới thu được 50M, còn nợ đến 61.8M quá hạn từ 15/10/2026 nhưng vẫn chưa thu được. Thợ vẫn đến lắp đặt hoàn thiện khiến khách hàng nắm đằng chuôi, chây ì không trả tiền.
- **Giải pháp vá:** Áp dụng nguyên tắc thu tiền "3 Đợt Thép":
  * **Đợt 1:** Tạm ứng 40% ngay khi ký hợp đồng (tiền về mới mua ván sản xuất).
  * **Đợt 2:** Tạm ứng tiếp 40% ngay khi xe tải chở đồ gỗ hạ hàng tại chân công trình (khách chuyển khoản xong thợ mới bóc bọc nilong ra lắp ráp).
  * **Đợt 3:** Thu nốt 20% còn lại trong vòng 3 ngày sau khi ký biên bản nghiệm thu bàn giao. Tuyệt đối không cho nợ lại quá 5% tiền bảo hành.

#### 28. Lỗ hổng 28: Tranh chấp hoa hồng nội bộ giữa thiết kế 3D và tìm kiếm khách hàng.
- **Thực trạng phũ phàng:** Hiệp vừa làm 3D vừa nhận công trình riêng (như Chị Phượng 42.46M hưởng 7M tiền sản phẩm). Dũng tìm khách thì Hiệp lại vẽ 3D. Nếu không phân định rõ tỷ lệ % đóng góp thì hai bộ phận này sẽ ngấm ngầm cãi cọ, đổ lỗi cho nhau khi công trình chậm tiến độ.
- **Giải pháp vá:** Quy chế hoa hồng minh bạch:
  * Khách do công ty cấp (Fanpage, Giám Đốc giao): Người chốt khách hưởng 2.5%, người vẽ 3D hưởng 1.5% doanh số xưởng.
  * Khách do nhân viên tự tìm kiếm từ mối quan hệ cá nhân: Hưởng đúng 5% doanh số xưởng (tự vẽ và tự chăm sóc trọn gói đến khi nghiệm thu).

#### 29. Lỗ hổng 29: Rò rỉ bản vẽ 3D và bảng bóc tách kỹ thuật cho xưởng cỏ bên ngoài.
- **Thực trạng phũ phàng:** Khách hàng đến PG Home yêu cầu lên phương án 3D và bóc dự toán chi tiết. Sau khi nhận file CAD và ảnh 3D đẹp đẽ, khách mang thẳng sang xưởng gia công rẻ tiền khác ở Thạch Trung để thuê đóng với giá thấp hơn, công ty mất trắng công sức thiết kế.
- **Giải pháp vá:** Quy định bản quyền thiết kế: **Chỉ xuất file 3D góc phối cảnh chất lượng thấp có gắn Logo chìm PG Home Luxury**. Tuyệt đối không cung cấp file kích thước chi tiết hoặc file CAD bóc tách khi khách hàng chưa ký hợp đồng thi công và chưa nộp tiền đặt cọc thiết kế tối thiểu 10.000.000 đ.

#### 30. Lỗ hổng 30: Bàn giao công trình bằng miệng, không có biên bản nghiệm thu pháp lý.
- **Thực trạng phũ phàng:** Thợ lắp xong tủ bếp, chủ nhà khen đẹp bằng miệng, thợ dọn đồ ra về. Hai tuần sau chủ nhà gọi điện báo cánh tủ bị xước bắt thay mới và từ chối thanh toán số tiền còn lại.
- **Giải pháp vá:** Sử dụng **Biên Bản Nghiệm Thu & Bàn Giao 10 Điểm**: Bắt buộc chủ nhà đi kiểm tra từng ngăn kéo, bề mặt cánh, ổ khóa cùng nhân viên kinh doanh. Ký vào biên bản ghi rõ: "Sản phẩm đạt chuẩn 100%, không trầy xước, các phụ kiện hoạt động trơn tru". Ký xong là hết trách nhiệm đổi trả bề mặt, chuyển sang chế độ bảo hành định kỳ.

#### 31. Lỗ hổng 31: Ký hợp đồng phát sinh ngoài hợp đồng chính không có giấy tờ xác nhận.
- **Thực trạng phũ phàng:** Khi lắp đặt tại công trình, chủ nhà hay bảo thợ: "Đóng thêm cho anh cái đợt tủ giày, làm thêm cho chị cái giá để lò vi sóng". Thợ xưởng nể khách cứ tự ý làm, cuối cùng công ty tốn thêm ván và công mà không thu thêm được 1 đồng nào từ khách.
- **Giải pháp vá:** Lệnh cấm thi công phát sinh miệng: Mọi hạng mục phát sinh ngoài hợp đồng (dù giá trị chỉ 500k) đều phải lập **Phụ lục hợp đồng phát sinh** có chữ ký chủ nhà đồng ý đơn giá trước khi xưởng tiến hành cắt ván.

#### 32. Lỗ hổng 32: Bỏ quên khách hàng cũ sau khi bàn giao, mất nguồn khách giới thiệu.
- **Thực trạng phũ phàng:** Bàn giao xong nhà Cậu Chiến, Thắm Minh, Chị Phượng là nhân viên kinh doanh cắt đứt liên lạc, không chăm sóc lại. Trong khi ngành nội thất cao cấp, 60% doanh số mới đến từ việc khách cũ giới thiệu bạn bè, người thân.
- **Giải pháp vá:** Quy trình chăm sóc hậu mãi tự động: Đúng 30 ngày sau bàn giao, hệ thống nhắc Giám Đốc hoặc Hiệp gọi điện thoại thăm hỏi trải nghiệm sử dụng đồ gỗ; đúng 6 tháng cử thợ đến căn chỉnh lại bản lề và tra dầu mỡ bảo dưỡng miễn phí.

---

### PHÂN HỆ 5: VÁ LỖ HỔNG HỆ THỐNG DỮ LIỆU & BẢO MẬT PHẦN MỀM (4 GIẢI PHÁP)

#### 33. Lỗ hổng 33: Tự ý nhồi dữ liệu giả lập (Mock data) làm bẩn cơ sở dữ liệu quản trị.
- **Thực trạng phũ phàng:** Quá trình thi công vừa qua đã để lọt 11 PO ảo, 3 Hợp đồng ảo (Anh Trung Tuyết, Anh Hoàn, Anh Minh) và 17 món dự toán mẫu. Điều này làm Giám Đốc mất niềm tin vào hệ thống vì nhìn đâu cũng thấy số liệu bịa đặt.
- **Giải pháp vá:** **Thanh lọc 100% Mock data khỏi hệ thống mã nguồn**. Thiết lập quy tắc lập trình bất di bất dịch: Bảng biểu nào chưa có dữ liệu thực tế phát sinh thì để trạng thái trống (Empty State) với nút "Thêm mới", tuyệt đối không tự động sinh dữ liệu ảo để làm đẹp giao diện.

#### 34. Lỗ hổng 34: Nguy cơ mất dữ liệu khi lưu trữ cục bộ trên trình duyệt (LocalStorage).
- **Thực trạng phũ phàng:** Nếu chỉ lưu trên LocalStorage, khi Giám Đốc đổi sang máy tính xách tay khác hoặc lỡ tay bấm "Xóa lịch sử duyệt web" trên Chrome thì toàn bộ số liệu chấm công và đơn đặt hàng mới nhập sẽ bị biến mất sạch sẽ.
- **Giải pháp vá:** Xây dựng cơ chế **Tự động sao lưu dữ liệu kép (Auto Double Backup)**: Mỗi khi có thao tác nhập liệu mới (chấm công, tạo PO), hệ thống tự động ghi 1 bản vào file JSON trên ổ cứng (`f:\PG Home - Quản trị\data_backup\`) và cập nhật vào bảng tính Excel quản trị.

#### 35. Lỗ hổng 35: Bot cào Zalo ngầm bị ngắt quãng khi Zalo PC cập nhật phiên bản mới.
- **Thực trạng phũ phàng:** Zalo PC cập nhật phiên bản thường xuyên và tự động khóa file nhật ký WAL LevelDB khi đang đồng bộ tin nhắn dung lượng lớn, có thể khiến script quét ngầm bị treo mà người quản trị không biết.
- **Giải pháp vá:** Tích hợp cơ chế **Tự phục hồi thông minh (Self-Healing Daemon)**: Kiểm tra file `000xxx.log` mỗi 15 giây. Nếu tiến trình bị nghẽn quá 30 giây, bot tự động giải phóng bộ nhớ đệm, quét tệp ảnh mới trong thư mục `.rescache` và gửi thông báo nhịp tim `Pulse Pill` trên thanh Topbar của Giám Đốc để báo cáo tình trạng sống còn của hệ thống.

#### 36. Lỗ hổng 36: Ảnh hóa đơn, chứng từ trên Zalo bị xóa sau 30 ngày.
- **Thực trạng phũ phàng:** Zalo có chính sách tự dọn dẹp các tệp ảnh và hóa đơn gửi qua nhóm chat sau một thời gian để tiết kiệm dung lượng cloud. Nếu không tải về, khi quyết toán thuế hoặc đối soát công nợ cuối năm mở lại sẽ chỉ thấy biểu tượng "Ảnh không tồn tại".
- **Giải pháp vá:** Thiết lập thư mục lưu trữ vĩnh viễn trên ổ cứng máy chủ: `f:\PG Home - Quản trị\4. Hóa đơn chứng từ Zalo\`. Mọi tệp ảnh gửi trong 13 nhóm Zalo được bot tải ngay lập tức trong vòng 5 giây về lưu trữ theo từng thư mục ngày/tháng, đảm bảo chứng từ gốc không bao giờ bị mất.

---

### PHÂN HỆ 6: VÁ LỖ HỔNG VẬN HÀNH & KIỂM SOÁT THỰC ĐỊA (4 GIẢI PHÁP)

#### 37. Lỗ hổng 37: Xuất quỹ tiền mặt không có phiếu chi có chữ ký của Giám Đốc.
- **Thực trạng phũ phàng:** Dung (kế toán) hoặc Giám Đốc hay rút tiền túi đưa cho thợ vài trăm nghìn đi mua keo, mua xăng, ăn trưa lúc tăng ca mà không viết phiếu chi. Cuối tháng cộng lại thấy hụt quỹ hàng chục triệu đồng mà không nhớ đã tiêu vào việc gì.
- **Giải pháp vá:** Quy tắc chi tiền mặt bất di bất dịch: **"Có phiếu chi mới xuất tiền - Có hóa đơn mới quyết toán"**. Kể cả khoản chi 20.000 đ gửi xe cũng phải ghi vào sổ quỹ tiền mặt hàng ngày. Cuối ngày kế toán phải cân đối số dư tiền mặt thực tế trong két so với sổ sách, lệch 1.000 đ cũng phải tìm ra nguyên nhân.

#### 38. Lỗ hổng 38: Không có quỹ dự phòng rủi ro bảo hành công trình đồ gỗ.
- **Thực trạng phũ phàng:** Đồ gỗ công nghiệp và đá nung kết bàn bếp trong năm đầu tiên sử dụng rất hay phát sinh lỗi (ngấm nước chân bồn rửa, kẹt ray trượt, bản lề bị xệ cánh do khách treo đồ nặng). Nếu không có quỹ dự phòng, mỗi lần đi bảo hành lại phải xuất tiền túi công ty ra bù lỗ.
- **Giải pháp vá:** Trích lập **Quỹ Dự Phòng Bảo Hành 3% Doanh Số Xưởng** từ mỗi công trình ký kết. Khoản tiền này hạch toán riêng trên sổ sách để phục vụ mua vật tư thay thế và trả công thợ đi bảo dưỡng định kỳ, không làm xáo trộn dòng tiền hoạt động chính.

#### 39. Lỗ hổng 39: Quản lý khách hàng nợ xấu lỏng lẻo, vẫn nhận thêm việc của người đang nợ tiền.
- **Thực trạng phũ phàng:** Khách hàng nợ dây dưa hợp đồng cũ (như trường hợp nợ quá hạn), nhưng khi họ gọi điện nhờ làm thêm hạng mục mới hoặc giới thiệu công trình mới, kinh doanh vì hám doanh số vẫn sốt sắng nhận lời mà không ép khách thanh toán dứt điểm cục nợ cũ.
- **Giải pháp vá:** Kích hoạt tính năng **Khóa Cảnh Báo Nợ Xấu (Blacklist Alert)** trên phần mềm: Khách hàng nào có khoản nợ quá hạn trên 30 ngày, hệ thống tự động khóa tính năng khởi tạo dự án mới cho khách hàng đó. Giám Đốc ra chỉ thị: "Thanh toán dứt điểm nợ cũ mới bàn thảo hợp đồng mới".

#### 40. Lỗ hổng 40: Thiếu cơ chế kiểm toán chéo độc lập định kỳ 15 ngày/lần.
- **Thực trạng phũ phàng:** Giám Đốc quá bận rộn đối ngoại, giám sát công trình và tiếp khách, chỉ nghe cấp dưới báo cáo miệng định kỳ. Kế toán và kỹ thuật làm việc theo thói quen, số liệu lệch dần theo thời gian mà không ai phát hiện ra cho đến khi nhà cung cấp gửi giấy đòi nợ dồn dập.
- **Giải pháp vá:** Thiết lập lịch **Kiểm toán chéo cố định vào ngày 15 và ngày cuối cùng hàng tháng**:
  * Trợ lý AI và Kế toán xuất sao kê ngân hàng VietinBank/Techcombank.
  * Đối chiếu 3 chiều độc lập: `[Sao kê ngân hàng]` $\longleftrightarrow$ `[Sổ nợ nhà cung cấp]` $\longleftrightarrow$ `[Bảng chấm công thợ xưởng]`.
  * Xuất Báo Cáo Đối Soát Độc Lập gửi thẳng vào mắt Giám Đốc để phát hiện sai lệch ngay trong vòng 24 giờ.

