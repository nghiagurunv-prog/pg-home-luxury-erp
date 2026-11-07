# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

app_js_path = r"F:\PG Home - Quản trị\web_app\app.js"

with open(app_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''      costRate: 0.2380,
      status: "PENDING",
      approvedBy: null,
      approvedAt: null,
      note: "File bóc tách Untitled.xlsx (14.42 KB). Đơn giá thương thảo 1.700.000 đ/m2 do Thái trao đổi với Anh Cường Gỗ Thịt."
    }
  ]
};'''

replacement = '''      costRate: 0.2380,
      status: "PENDING",
      approvedBy: null,
      approvedAt: null,
      note: "File bóc tách Untitled.xlsx (14.42 KB). Đơn giá thương thảo 1.700.000 đ/m2 do Thái trao đổi với Anh Cường Gỗ Thịt."
    },
    {
      code: "PO-2026-1005",
      date: "2026-10-29",
      requester: "Hoàng Công Vũ (Kỹ thuật vật tư xưởng)",
      project: "Biệt thự TP Hà Tĩnh - Bàn đảo & Vách tivi",
      contractVal: 88000000,
      supplier: "Hoàng Hà Ceramic PVC (Hưng Yên / Hà Tĩnh)",
      supplierBank: "Nhóm: Đặt hàng Ceramic Hoàng Hà HY (123 file cache)",
      items: [
        { name: "Đá nung kết Ceramic Calacatta Gold 12mm ốp mặt bếp & bàn đảo", unit: "m2", qty: 4.8, price: 1650000, total: 7920000 },
        { name: "Tấm than tre phủ kim loại chống xước vách tivi", unit: "Tấm", qty: 6, price: 680000, total: 4080000 },
        { name: "Nẹp nhôm chữ T mạ vàng PVD", unit: "Cây", qty: 8, price: 95000, total: 760000 }
      ],
      total: 12760000,
      deposit: 5000000,
      remain: 7760000,
      costRate: 0.1450,
      status: "APPROVED",
      approvedBy: "Nguyễn Viết Nghĩa (Giám Đốc)",
      approvedAt: "29/10/2026 14:20:00",
      note: "Đã đối soát qua Zalo PC nhóm 'Đặt hàng Ceramic Hoàng Hà HY'. Đá Ceramic nung kết chịu nhiệt độ cao và chống trầy xước."
    },
    {
      code: "PO-2026-1006",
      date: "2026-10-30",
      requester: "Hoàng Công Vũ (Kỹ thuật vật tư xưởng)",
      project: "Tổng hợp công trình nội thất tháng 10",
      contractVal: 165000000,
      supplier: "LamGiang - Nội Thất Phú Gia (TP Hà Tĩnh)",
      supplierBank: "Ms Hoa Lam Giang - Nhóm LamGiang (198 file cache)",
      items: [
        { name: "Ray trượt âm giảm chấn DTC 450mm mở toàn phần", unit: "Bộ", qty: 35, price: 115000, total: 4025000 },
        { name: "Bản lề giảm chấn inox 304 DTC", unit: "Cái", qty: 120, price: 18000, total: 2160000 },
        { name: "Ván MDF phủ Melamine mã vân gỗ óc chó 17mm", unit: "Tấm", qty: 15, price: 425000, total: 6375000 },
        { name: "Chỉ dán cạnh nẹp PVC đồng màu vân gỗ Lam Giang", unit: "Cuộn", qty: 4, price: 290000, total: 1160000 }
      ],
      total: 13720000,
      deposit: 0,
      remain: 13720000,
      costRate: 0.0832,
      status: "PENDING",
      approvedBy: null,
      approvedAt: null,
      note: "Vũ nhắn Ms Hoa Lam Giang xuất đơn hàng sáng nay (30/10/2026). Công nợ gối đầu 15 ngày."
    },
    {
      code: "PO-2026-1007",
      date: "2026-09-03",
      requester: "Nguyễn Văn Thái (Quản lý xưởng sản xuất)",
      project: "Chốt ván Melamine các căn hộ T9",
      contractVal: 92000000,
      supplier: "Cường Thịnh (Nga Melamine Cường Thịnh)",
      supplierBank: "Nhóm: Chốt màu, đặt hàng Cường Thịnh",
      items: [
        { name: "Ván Melamine Cường Thịnh mã vân sồi tự nhiên 17mm", unit: "Tấm", qty: 22, price: 395000, total: 8690000 },
        { name: "Ván Melamine đơn sắc màu ghi xám chì", unit: "Tấm", qty: 10, price: 385000, total: 3850000 }
      ],
      total: 12540000,
      deposit: 6000000,
      remain: 6540000,
      costRate: 0.1363,
      status: "APPROVED",
      approvedBy: "Nguyễn Viết Nghĩa (Giám Đốc)",
      approvedAt: "03/09/2026 15:10:00",
      note: "Đã chốt bảng màu Melamine thực tế và khớp tiến độ sản xuất tháng 9/2026."
    },
    {
      code: "PO-2026-1008",
      date: "2026-05-14",
      requester: "Nguyễn Văn Thái (Quản lý xưởng sản xuất)",
      project: "Gỗ sồi tự nhiên phòng khách & cầu thang",
      contractVal: 115000000,
      supplier: "Đức Anh - Thu Hương Hà Tĩnh (Vợ Sồi Đức Anh)",
      supplierBank: "Đối soát sổ sách định kỳ",
      items: [
        { name: "Gỗ sồi Mỹ (Oak) xẻ sấy chuẩn FAS loại 1", unit: "m3", qty: 0.85, price: 21500000, total: 18275000 },
        { name: "Mộng ghép & tay vịn cầu thang sồi tự nhiên", unit: "md", qty: 12, price: 450000, total: 5400000 }
      ],
      total: 23675000,
      deposit: 10000000,
      remain: 13675000,
      costRate: 0.2059,
      status: "APPROVED",
      approvedBy: "Nguyễn Viết Nghĩa (Giám Đốc)",
      approvedAt: "14/05/2026 11:30:00",
      note: "Đã gạch sổ đối soát và nghiệm thu vật tư gỗ sồi tự nhiên."
    },
    {
      code: "PO-2026-1009",
      date: "2026-10-15",
      requester: "Hoàng Công Vũ (Kỹ thuật vật tư xưởng)",
      project: "Căn hộ Duplex - Gương bàn phấn & phòng tắm",
      contractVal: 48000000,
      supplier: "Gương Bỉ Theo Yêu Cầu (Phôi AGC Bỉ)",
      supplierBank: "Nhóm: Đặt hàng Gương Bỉ theo yêu cầu",
      items: [
        { name: "Gương Bỉ AGC tráng bạc 8 lớp 5mm mài xiết bóng viền led", unit: "Bộ", qty: 3, price: 1850000, total: 5550000 },
        { name: "Cảm ứng 1 chạm đa năng tích hợp sấy phá sương", unit: "Bộ", qty: 3, price: 420000, total: 1260000 }
      ],
      total: 6810000,
      deposit: 3000000,
      remain: 3810000,
      costRate: 0.1419,
      status: "APPROVED",
      approvedBy: "Nguyễn Viết Nghĩa (Giám Đốc)",
      approvedAt: "15/10/2026 16:45:00",
      note: "Gương Bỉ AGC chính hãng chống ố mốc hơi nước phòng tắm."
    },
    {
      code: "PO-2026-1010",
      date: "2026-09-20",
      requester: "Tống Trần Hiệp (Sale Admin / 3D)",
      project: "Đồ rời bán kèm bàn giao căn hộ Chị Phượng",
      contractVal: 55000000,
      supplier: "Xưởng Sofa & Bàn Ăn Khánh (Hà Nội)",
      supplierBank: "Nhóm: Đặt hàng Khánh (Sofa, Bàn ăn)",
      items: [
        { name: "Sofa bọc nỉ Hàn Quốc cao cấp kiểu chữ L (2m8 x 1m8)", unit: "Bộ", qty: 1, price: 16500000, total: 16500000 },
        { name: "Bàn ăn thông minh kéo dài mặt đá Ceramic 6 ghế Monet", unit: "Bộ", qty: 1, price: 11500000, total: 11500000 }
      ],
      total: 28000000,
      deposit: 12000000,
      remain: 16000000,
      costRate: 0.5091,
      status: "APPROVED",
      approvedBy: "Nguyễn Viết Nghĩa (Giám Đốc)",
      approvedAt: "20/09/2026 10:15:00",
      note: "Mảng Phụ Kiện Bán Kèm & Sofa. Giá bán kèm khách 40M - 55M, lãi gộp 30% hạch toán trực tiếp vào Lợi Nhuận Phụ Kiện CCSC."
    },
    {
      code: "PO-2026-1011",
      date: "2026-10-18",
      requester: "Hoàng Công Vũ (Kỹ thuật vật tư xưởng)",
      project: "Vách ốp đầu giường phòng ngủ Master",
      contractVal: 35000000,
      supplier: "Bọc Đệm Da - Nỉ Hà Tĩnh",
      supplierBank: "Nhóm: Đặt hàng bọc đệm Da - Nỉ - Hà Tĩnh",
      items: [
        { name: "Gia công vách ốp mút D40 da microfiber nẹp inox mạ PVD", unit: "m2", qty: 7.2, price: 950000, total: 6840000 },
        { name: "Đệm tựa đầu giường bọc da cao cấp chống xẹp", unit: "Bộ", qty: 1, price: 1650000, total: 1650000 }
      ],
      total: 8490000,
      deposit: 3500000,
      remain: 4990000,
      costRate: 0.2426,
      status: "APPROVED",
      approvedBy: "Nguyễn Viết Nghĩa (Giám Đốc)",
      approvedAt: "18/10/2026 14:00:00",
      note: "Bọc đệm đầu giường thẩm mỹ, hoàn thiện cùng hệ tủ áo kính."
    }
  ],
  zaloSupplierGroups: [
    {
      id: "g6882545434220944455",
      name: "KÍNH VIỆT NHẬT - PHÚ GIA LUXURY",
      category: "Kính cường lực 8-10mm, Kính màu ốp bếp, Phụ kiện nhôm kính",
      supplier: "Kính Việt Nhật VSG (Thoan VSG)",
      members: 6,
      lastActivity: "30/10/2026 (32 phút trước)",
      status: "Đang sản xuất",
      debt: "Đã cọc 40% (1,110,720 đ) / Tổng đơn 2,776,800 đ",
      doc: "Don_dat_kinh_Viet_Nhat_30_10_2026.pdf",
      cacheCount: 13,
      note: "Vũ nhắn Thoan VSG đẩy tiến độ kính giao lắp hoàn thiện công trình."
    },
    {
      id: "g727862869232620509",
      name: "2026 Đặt hàng anh Cường Hà Nội",
      category: "Gỗ thịt tự nhiên (Gõ đỏ Pachy, Óc chó Bắc Mỹ, Sồi Nga)",
      supplier: "Xưởng Cường Gỗ Thịt (Hà Nội)",
      members: 4,
      lastActivity: "30/10/2026 (2 giờ trước)",
      status: "Gia công & Ghép mộng",
      debt: "Đơn giá 1.700.000 đ/m2 cửa gỗ, cọc theo chuyến xe",
      doc: "Untitled.xlsx (Bóc tách chi tiết)",
      cacheCount: 995,
      note: "Thái QLX phối hợp trực tiếp với Anh Cường. Kho 995 file thiết kế gia công gỗ thịt năm 2026."
    },
    {
      id: "g6116598459303638566",
      name: "LamGiang - NT Phú Gia (TP HT)",
      category: "Ván phủ Melamine, Phụ kiện ray âm bản lề DTC, Chỉ nẹp dán cạnh",
      supplier: "Tổng Kho Lam Giang (TP Hà Tĩnh - Ms Hoa)",
      members: 11,
      lastActivity: "30/10/2026 (2 giờ trước)",
      status: "Cung ứng thường xuyên",
      debt: "Công nợ gối đầu 15 ngày (Quyết toán ngày 15 & 30 hàng tháng)",
      doc: "Bảng xuất kho định kỳ Lam Giang",
      cacheCount: 198,
      note: "Vũ yêu cầu xuất kho phụ kiện DTC & chỉ nẹp gỗ óc chó sáng nay."
    },
    {
      id: "g7737669618333682341",
      name: "Đặt hàng Ceramic Hoàng Hà HY",
      category: "Đá nung kết Ceramic Calacatta, Tấm ốp PVC than tre giả đá",
      supplier: "Hoàng Hà Ceramic PVC (Hưng Yên / Hà Tĩnh)",
      members: 5,
      lastActivity: "29/10/2026 (Hôm qua)",
      status: "Gia công cắt CNC",
      debt: "Cọc 30-50% đơn hàng đá, thanh toán dứt điểm khi giao tấm",
      doc: "Bản vẽ bóc tách mặt đá bàn bếp & bàn đảo",
      cacheCount: 123,
      note: "Đá Ceramic nung kết chống thấm ố, chịu nhiệt cực tốt cho biệt thự TP Hà Tĩnh."
    },
    {
      id: "g8911374775675572335",
      name: "Đặt hàng Phú Gia - NT",
      category: "Ván Plywood E0, MDF chống ẩm cốt xanh, Ván nhựa Picomat",
      supplier: "Gỗ NT Cầu Vượt (Hà Tĩnh - 0979137123)",
      members: 7,
      lastActivity: "23/10/2026",
      status: "Đối soát công nợ",
      debt: "DƯ NỢ HIỆN TẠI: 82,065,300 đ (Đã trừ 1 tấm trả 750,000 đ)",
      doc: "Don_tra_hang_NT_23_10_2026.jpg & Cong_no_NT_23_10_2026.jpg",
      cacheCount: 80,
      note: "NCC cung cấp ván gỗ CN chính của xưởng. Bảng đối soát các đơn DON00216 đến DON00274."
    },
    {
      id: "g4212121922329497264",
      name: "Chốt màu, đặt hàng Cường Thịnh",
      category: "Ván Melamine Cường Thịnh cốt MDF/HMR chống ẩm",
      supplier: "Cường Thịnh (Nga Melamine Cường Thịnh)",
      members: 5,
      lastActivity: "03/09/2026",
      status: "Đã chốt bảng màu",
      debt: "Thanh toán theo từng lô ván xuất xưởng",
      doc: "Bảng mã màu thực tế Melamine",
      cacheCount: 8,
      note: "Chốt tone màu sồi tự nhiên và xám chì đồng bộ với thiết kế 3D của Hiệp."
    },
    {
      id: "g1224067034537716792",
      name: "Đặt hàng gỗ thịt nhà Đức Anh - Thu Hương Hà Tĩnh",
      category: "Gỗ sồi Mỹ (Oak) xẻ sấy chuẩn FAS loại 1, Nan gỗ & Tay vịn",
      supplier: "Sồi Đức Anh - Thu Hương (Hà Tĩnh)",
      members: 5,
      lastActivity: "14/05/2026",
      status: "Đã nghiệm thu gạch sổ",
      debt: "Đã tất toán theo khối lượng nghiệm thu",
      doc: "Sổ gạch đối soát khối lượng m3",
      cacheCount: 0,
      note: "Cung cấp gỗ sồi tự nhiên cho hạng mục cầu thang và chi tiết chạm khắc."
    },
    {
      id: "g8487057108956790028",
      name: "Đặt hàng Kính, Gương Phú Mỹ (Vinh)",
      category: "Kính tôi cường lực, Gương soi nghệ thuật mài vát cạnh",
      supplier: "Kính Gương Phú Mỹ (TP Vinh - Nguyễn Thị Thúy)",
      members: 5,
      lastActivity: "02/12/2025",
      status: "Dự phòng khu vực Bắc",
      debt: "Không có dư nợ quá hạn",
      doc: "Bảng giá gia công kính TP Vinh",
      cacheCount: 0,
      note: "Đơn vị cung cấp kính và gương bổ trợ khi xưởng làm công trình tại Nghi Xuân & Nghệ An."
    },
    {
      id: "g_acrylic_ald",
      name: "Đặt hàng Acrylic ALD",
      category: "Cánh tủ Acrylic bóng gương No-Line công nghệ Đức",
      supplier: "Acrylic ALD Hà Nội",
      members: 5,
      lastActivity: "Theo từng hợp đồng",
      status: "Sẵn sàng nhận bóc tách",
      debt: "Cọc 50% theo kích thước cánh",
      doc: "Bảng báo giá cánh Noline ALD",
      cacheCount: 0,
      note: "Chuyên dụng cho cánh tủ bếp trên và cánh tủ áo cao cấp không thấy đường line dán cạnh."
    },
    {
      id: "g_giada_hoanggia",
      name: "Đặt hàng giả đá PG - Hoàng Gia",
      category: "Tấm nano than tre, Tấm PVC vân đá cẩm thạch Hoàng Gia",
      supplier: "Vật Liệu Hoàng Gia",
      members: 5,
      lastActivity: "Theo từng hợp đồng",
      status: "Sẵn sàng cung ứng",
      debt: "Thanh toán theo khối lượng giao hàng",
      doc: "Catalog tấm PVC vân đá 2026",
      cacheCount: 0,
      note: "Ốp vách trang trí sau sofa và vách tivi phong cách Luxury."
    },
    {
      id: "g_guong_bi",
      name: "Đặt hàng Gương Bỉ theo yêu cầu",
      category: "Gương phôi Bỉ AGC tráng bạc 8 lớp, Đèn led cảm ứng viền",
      supplier: "Xưởng Gương Kính Nghệ Thuật",
      members: 5,
      lastActivity: "15/10/2026",
      status: "Đang đặt hàng",
      debt: "Theo PO-2026-1009 (6,810,000 đ)",
      doc: "Bản vẽ gương bàn phấn & phòng tắm",
      cacheCount: 0,
      note: "Chống ố mép, tráng bạc chống mốc hơi nước bảo hành 5 năm."
    },
    {
      id: "g_khanh_sofa",
      name: "Đặt hàng Khánh ( Sofa, Bàn ăn)",
      category: "Sofa bọc nỉ da góc L, Bàn ăn thông minh mặt đá 6-8 ghế Monet",
      supplier: "Xưởng Đồ Rời Khánh (Hà Nội)",
      members: 5,
      lastActivity: "20/09/2026",
      status: "Đã bàn giao",
      debt: "Theo PO-2026-1010 (28,000,000 đ)",
      doc: "Hình ảnh nghiệm thu sofa & bàn ăn",
      cacheCount: 0,
      note: "Mảng Phụ Kiện Bán Kèm mang lại 11.65M lãi gộp cho BGĐ trong T8 + T9."
    },
    {
      id: "g_bocdem_hatinh",
      name: "Đặt hàng bọc đệm Da - Nỉ - Hà Tĩnh",
      category: "Vách ốp da nẹp PVD mút D40, Đệm đầu giường bọc da microfiber",
      supplier: "Cơ sở Bọc Đệm Da Nỉ Hà Tĩnh",
      members: 5,
      lastActivity: "18/10/2026",
      status: "Đã nghiệm thu",
      debt: "Theo PO-2026-1011 (8,490,000 đ)",
      doc: "Phiếu xuất kho xưởng bọc đệm",
      cacheCount: 0,
      note: "Đệm tựa êm ái tăng độ sang trọng cho phòng ngủ Master biệt thự."
    }
  ]
};'''

# Normalize newlines
c_norm = content.replace('\r\n', '\n')
t_norm = target.replace('\r\n', '\n')
r_norm = replacement.replace('\r\n', '\n')

if t_norm in c_norm:
    new_c = c_norm.replace(t_norm, r_norm, 1)
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(new_c)
    print("SUCCESS: Updated app.js with 7 new POs and 13 Zalo Supplier Groups!")
else:
    print("ERROR: Target string not found in app.js!")

