# -*- coding: utf-8 -*-
"""
================================================================================
CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY
HỆ THỐNG QUẢN TRỊ & TỰ ĐỘNG HÓA SẢN XUẤT NỘI THẤT CAO CẤP
================================================================================
Module: material_3d_catalog_builder.py
Mục đích: Xây dựng Danh mục chuẩn hóa PBR Material & 3D Asset Registry (Giai đoạn 2 - R02)
Phục vụ: Kết xuất 3D WebGL (Three.js/Babylon.js), Unreal Engine, và tương tác thực tế ảo AR
         (USDZ iOS QuickLook / GLB Android SceneViewer / WebXR).

ĐƠN VỊ PHÁP LÝ & NHÀ MÁY SẢN XUẤT CHUẨN DUY NHẤT:
- Tên pháp lý: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
- Thương hiệu: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY
- Mã số thuế / ĐKKD: 042203002931 (Đại diện: Nguyễn Trọng Nghĩa)
- Trụ sở ĐKKD: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh
- Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia:
  Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
- Hotline CSKH & Kỹ thuật: 0986.722.324
================================================================================
"""

import os
import sys
import json
from datetime import datetime, timezone

# Thiết lập encoding cho stdout trên Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

CATALOG_OUTPUT_PATH = r"F:\PG Home - Quản trị\data\material_3d_pbr_catalog.json"

BRAND_IDENTITY = {
    "brand_name": "PG HOME LUXURY",
    "company_name": "CÔNG TY CP PHÚ GIA VIỆT NAM",
    "legal_entity": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
    "tax_id": "042203002931",
    "representative": "Nguyễn Trọng Nghĩa",
    "hotline": "0986.722.324",
    "registered_address": "Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh",
    "factory_and_office_address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
    "facility_title": "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia",
    "website": "https://pghome.vn",
    "standard_compliance": "HIẾN PHÁP KỶ LUẬT THÉP PHÚ GIA - ISO/IEC WebGL & glTF 2.0 PBR Standard"
}

def generate_pbr_materials():
    """Tạo danh mục PBR Material chi tiết đầy đủ thông số kết xuất quang học thực tế."""
    materials = [
        # -------------------------------------------------------------------------
        # NHÓM 1: GỖ TỰ NHIÊN CAO CẤP (NATURAL HARDWOOD)
        # -------------------------------------------------------------------------
        {
            "material_id": "MAT_WALNUT_US_FAS",
            "material_code": "NAT-WALNUT-FAS-01",
            "name": "Gỗ Óc Chó Bắc Mỹ FAS Tuyển Chọn",
            "category": "Gỗ Tự Nhiên Cao Cấp",
            "subcategory": "Óc Chó Bắc Mỹ (American Black Walnut)",
            "supplier": "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)",
            "unit": "m2 hoàn thiện",
            "standard_price_vnd": 4850000,
            "raw_material_price_vnd_m3": 42000000,
            "humidity_resistance": "Sấy lò chuyên dụng chuẩn Mỹ KD 8-12%, kháng ẩm tự nhiên cấp 1",
            "heat_resistance": "Chịu nhiệt môi trường tới 85°C, chống cong vênh co ngót tối ưu",
            "durability_years": "Trên 35 năm",
            "finish_type": "Sơn PU mờ 70% Inchem cao cấp giữ nguyên thớ nu vân",
            "pbr_parameters": {
                "baseColorHex": "#4A2E1B",
                "roughness": 0.46,
                "metalness": 0.0,
                "clearcoat": 0.15,
                "clearcoatRoughness": 0.25,
                "ior": 1.53,
                "transmission": 0.0,
                "normalScale": [1.0, 1.0],
                "specularIntensity": 0.5,
                "emissiveHex": "#000000",
                "subsurface": 0.08
            },
            "texture_maps": {
                "albedo": "textures/walnut_fas/albedo.webp",
                "normal": "textures/walnut_fas/normal.webp",
                "roughness": "textures/walnut_fas/roughness.webp",
                "ao": "textures/walnut_fas/ambient_occlusion.webp",
                "displacement": "textures/walnut_fas/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_walnut_us_fas.glb",
                "usdz_asset_path": "models/materials/pbr_walnut_us_fas.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "4K (4096x4096px)",
                "tile_size_meters": [1.2, 0.6]
            },
            "application_notes": "Ứng dụng cho mặt bàn sofa, bàn ăn nguyên tấm, vách ốp trang trí nu chun và hệ khung tủ biệt thự sang trọng."
        },
        {
            "material_id": "MAT_OAK_RUSSIAN_FAS",
            "material_code": "NAT-OAK-RUS-02",
            "name": "Gỗ Sồi Nga / Tần Bì Trắng Tuyển Chọn FAS",
            "category": "Gỗ Tự Nhiên Cao Cấp",
            "subcategory": "Sồi Nga / White Ash",
            "supplier": "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)",
            "unit": "m2 hoàn thiện",
            "standard_price_vnd": 2450000,
            "raw_material_price_vnd_m3": 22000000,
            "humidity_resistance": "Khô sấy tiêu chuẩn Châu Âu KD 10-12%, kháng ẩm tốt",
            "heat_resistance": "Chịu nhiệt môi trường tới 80°C",
            "durability_years": "20 - 25 năm",
            "finish_type": "Sơn lau dầu dưỡng gỗ Osmo hoặc PU mờ dưỡng vân sồi",
            "pbr_parameters": {
                "baseColorHex": "#CDB38B",
                "roughness": 0.52,
                "metalness": 0.0,
                "clearcoat": 0.10,
                "clearcoatRoughness": 0.30,
                "ior": 1.52,
                "transmission": 0.0,
                "normalScale": [0.9, 0.9],
                "specularIntensity": 0.45,
                "emissiveHex": "#000000",
                "subsurface": 0.05
            },
            "texture_maps": {
                "albedo": "textures/oak_rus/albedo.webp",
                "normal": "textures/oak_rus/normal.webp",
                "roughness": "textures/oak_rus/roughness.webp",
                "ao": "textures/oak_rus/ambient_occlusion.webp",
                "displacement": "textures/oak_rus/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_oak_russian.glb",
                "usdz_asset_path": "models/materials/pbr_oak_russian.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "4K (4096x4096px)",
                "tile_size_meters": [1.0, 0.5]
            },
            "application_notes": "Sử dụng cho hệ ghế sofa phong cách Scandinavian, bàn trang điểm, nan trang trí tối giản."
        },
        {
            "material_id": "MAT_GO_DO_PACHYLOBA",
            "material_code": "NAT-GODO-PACHY-03",
            "name": "Gỗ Gõ Đỏ Pachyloba Nam Phi Chọn Lọc",
            "category": "Gỗ Tự Nhiên Cao Cấp",
            "subcategory": "Gỗ Gõ Đỏ (Doussie)",
            "supplier": "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)",
            "unit": "m2 hoàn thiện",
            "standard_price_vnd": 4400000,
            "raw_material_price_vnd_m3": 38000000,
            "humidity_resistance": "Tỷ trọng gỗ đanh chắc, chống thấm kháng nước tự nhiên cực cao",
            "heat_resistance": "Không biến dạng dưới nhiệt độ khắc nghiệt và nắng rọi",
            "durability_years": "Trên 40 năm",
            "finish_type": "Sơn PU cao cấp giữ sắc đỏ trầm tự nhiên, chống ngả màu",
            "pbr_parameters": {
                "baseColorHex": "#85371A",
                "roughness": 0.42,
                "metalness": 0.0,
                "clearcoat": 0.20,
                "clearcoatRoughness": 0.20,
                "ior": 1.54,
                "transmission": 0.0,
                "normalScale": [1.0, 1.0],
                "specularIntensity": 0.52,
                "emissiveHex": "#000000",
                "subsurface": 0.04
            },
            "texture_maps": {
                "albedo": "textures/godo_pachy/albedo.webp",
                "normal": "textures/godo_pachy/normal.webp",
                "roughness": "textures/godo_pachy/roughness.webp",
                "ao": "textures/godo_pachy/ambient_occlusion.webp",
                "displacement": "textures/godo_pachy/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_godo_pachyloba.glb",
                "usdz_asset_path": "models/materials/pbr_godo_pachyloba.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "4K (4096x4096px)",
                "tile_size_meters": [1.2, 0.6]
            },
            "application_notes": "Chuyên dụng cho không gian phòng thờ gia tiên, sập thờ chạm khắc, cửa đại sảnh biệt thự."
        },
        {
            "material_id": "MAT_HUONG_DA_GL",
            "material_code": "NAT-HUONGDA-04",
            "name": "Gỗ Hương Đá Tuyển Vân Cao Cấp",
            "category": "Gỗ Tự Nhiên Cao Cấp",
            "subcategory": "Gỗ Hương Đá",
            "supplier": "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)",
            "unit": "m2 hoàn thiện",
            "standard_price_vnd": 5200000,
            "raw_material_price_vnd_m3": 46000000,
            "humidity_resistance": "Gỗ đanh nặng như đá, kháng ẩm tuyệt đối, không mối mọt",
            "heat_resistance": "Độ ổn định cơ lý cao bậc nhất trong các dòng gỗ tự nhiên",
            "durability_years": "Trên 50 năm",
            "finish_type": "Sơn lót dưỡng sâu + phủ mờ PU Đức Lĩnh mờ 70%",
            "pbr_parameters": {
                "baseColorHex": "#7A2616",
                "roughness": 0.38,
                "metalness": 0.0,
                "clearcoat": 0.25,
                "clearcoatRoughness": 0.18,
                "ior": 1.55,
                "transmission": 0.0,
                "normalScale": [0.85, 0.85],
                "specularIntensity": 0.55,
                "emissiveHex": "#000000",
                "subsurface": 0.03
            },
            "texture_maps": {
                "albedo": "textures/huong_da/albedo.webp",
                "normal": "textures/huong_da/normal.webp",
                "roughness": "textures/huong_da/roughness.webp",
                "ao": "textures/huong_da/ambient_occlusion.webp",
                "displacement": "textures/huong_da/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_huong_da.glb",
                "usdz_asset_path": "models/materials/pbr_huong_da.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "4K (4096x4096px)",
                "tile_size_meters": [1.0, 0.5]
            },
            "application_notes": "Chế tác cuốn thư câu đối, hoành phi, bàn thờ án gian phong cách hoàng gia truyền thống."
        },

        # -------------------------------------------------------------------------
        # NHÓM 2: GỖ CÔNG NGHIỆP AN CƯỜNG PHỦ MELAMINE CAO CẤP
        # -------------------------------------------------------------------------
        {
            "material_id": "MAT_AC_MELAMINE_MS440EV",
            "material_code": "AC-MS-440-EV",
            "name": "Melamine An Cường MS 440 EV (Vân Sồi Tự Nhiên Sần EV)",
            "category": "Gỗ Công Nghiệp Phủ Melamine",
            "subcategory": "Cốt MDF Xanh Chống Ẩm V313 An Cường",
            "supplier": "Ván An Cường (Phân phối: Lâm Giang / Cầu Vượt Hà Tĩnh)",
            "unit": "m2 thành phẩm",
            "standard_price_vnd": 1850000,
            "raw_material_price_vnd_sheet": 720000,
            "humidity_resistance": "Cốt xanh chống ẩm V313 tỷ trọng 760-820 kg/m3, độ trương nở < 8%",
            "heat_resistance": "Bề mặt phủ Melamine chịu nhiệt tàn thuốc và ấm trà tới 120°C",
            "durability_years": "15 - 20 năm",
            "finish_type": "Bề mặt EV (Embossed Veneer) mô phỏng vân tom gỗ sồi thật",
            "pbr_parameters": {
                "baseColorHex": "#B89B72",
                "roughness": 0.55,
                "metalness": 0.0,
                "clearcoat": 0.05,
                "clearcoatRoughness": 0.40,
                "ior": 1.50,
                "transmission": 0.0,
                "normalScale": [1.0, 1.0],
                "specularIntensity": 0.40,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/ancuong_ms440ev/albedo.webp",
                "normal": "textures/ancuong_ms440ev/normal.webp",
                "roughness": "textures/ancuong_ms440ev/roughness.webp",
                "ao": "textures/ancuong_ms440ev/ambient_occlusion.webp",
                "displacement": "textures/ancuong_ms440ev/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_ac_ms440ev.glb",
                "usdz_asset_path": "models/materials/pbr_ac_ms440ev.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.22, 2.44]
            },
            "application_notes": "Sử dụng cho thùng tủ bếp, vách ốp đầu giường, bàn học sinh, hệ kệ sách hiện đại."
        },
        {
            "material_id": "MAT_AC_MELAMINE_MS330EV",
            "material_code": "AC-MS-330-EV",
            "name": "Melamine An Cường MS 330 EV (Vân Óc Chó Trầm Ấm)",
            "category": "Gỗ Công Nghiệp Phủ Melamine",
            "subcategory": "Cốt MDF Xanh Chống Ẩm V313 An Cường",
            "supplier": "Ván An Cường (Phân phối: Lâm Giang / Cầu Vượt Hà Tĩnh)",
            "unit": "m2 thành phẩm",
            "standard_price_vnd": 1900000,
            "raw_material_price_vnd_sheet": 750000,
            "humidity_resistance": "Cốt xanh V313 chống ẩm kháng nước đạt chuẩn E1 Quốc tế",
            "heat_resistance": "Bề mặt Melamine chịu nhiệt cao, chống trầy xước cấp AC3",
            "durability_years": "15 - 20 năm",
            "finish_type": "Bề mặt vân sần đồng bộ sắc nét vân gỗ óc chó Châu Âu",
            "pbr_parameters": {
                "baseColorHex": "#5C4033",
                "roughness": 0.52,
                "metalness": 0.0,
                "clearcoat": 0.05,
                "clearcoatRoughness": 0.35,
                "ior": 1.50,
                "transmission": 0.0,
                "normalScale": [1.0, 1.0],
                "specularIntensity": 0.42,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/ancuong_ms330ev/albedo.webp",
                "normal": "textures/ancuong_ms330ev/normal.webp",
                "roughness": "textures/ancuong_ms330ev/roughness.webp",
                "ao": "textures/ancuong_ms330ev/ambient_occlusion.webp",
                "displacement": "textures/ancuong_ms330ev/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_ac_ms330ev.glb",
                "usdz_asset_path": "models/materials/pbr_ac_ms330ev.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.22, 2.44]
            },
            "application_notes": "Sử dụng làm thân tủ quần áo Master, vách ốp sau kệ TV, vách ngăn phòng khách sang trọng."
        },
        {
            "material_id": "MAT_AC_MELAMINE_MS388PL",
            "material_code": "AC-MS-388-PL",
            "name": "Melamine An Cường MS 388 PL (Óc Chó Vân Sần Sâu Sang Trọng)",
            "category": "Gỗ Công Nghiệp Phủ Melamine",
            "subcategory": "Cốt MDF Xanh Chống Ẩm V313 An Cường",
            "supplier": "Ván An Cường (Phân phối: Lâm Giang / Cầu Vượt Hà Tĩnh)",
            "unit": "m2 thành phẩm",
            "standard_price_vnd": 1950000,
            "raw_material_price_vnd_sheet": 780000,
            "humidity_resistance": "Cốt gỗ nén tỷ trọng cao chống ẩm nhiệt đới gió mùa Bắc Trung Bộ",
            "heat_resistance": "Chống bám bẩn, chịu va đập bề mặt và nhiệt độ phòng",
            "durability_years": "15 - 20 năm",
            "finish_type": "Bề mặt PL (Pore Line) có rãnh vân tự nhiên sâu tinh tế",
            "pbr_parameters": {
                "baseColorHex": "#432E22",
                "roughness": 0.62,
                "metalness": 0.0,
                "clearcoat": 0.0,
                "clearcoatRoughness": 0.50,
                "ior": 1.49,
                "transmission": 0.0,
                "normalScale": [1.1, 1.1],
                "specularIntensity": 0.38,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/ancuong_ms388pl/albedo.webp",
                "normal": "textures/ancuong_ms388pl/normal.webp",
                "roughness": "textures/ancuong_ms388pl/roughness.webp",
                "ao": "textures/ancuong_ms388pl/ambient_occlusion.webp",
                "displacement": "textures/ancuong_ms388pl/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_ac_ms388pl.glb",
                "usdz_asset_path": "models/materials/pbr_ac_ms388pl.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.22, 2.44]
            },
            "application_notes": "Sử dụng cho bàn làm việc lãnh đạo, vách ốp phòng họp, tủ tài liệu văn phòng cao cấp."
        },
        {
            "material_id": "MAT_AC_MELAMINE_MS101G",
            "material_code": "AC-MS-101-G",
            "name": "Melamine An Cường MS 101G (Trắng Tinh Khiết Cốt Xanh V313)",
            "category": "Gỗ Công Nghiệp Phủ Melamine",
            "subcategory": "Cốt MDF Xanh Chống Ẩm V313 An Cường",
            "supplier": "Ván An Cường (Phân phối: Lâm Giang / Cầu Vượt Hà Tĩnh)",
            "unit": "m2 thành phẩm",
            "standard_price_vnd": 1750000,
            "raw_material_price_vnd_sheet": 590000,
            "humidity_resistance": "Chuẩn chống ẩm V313 chống mốc cong vênh",
            "heat_resistance": "Chống bám bẩn dầu mỡ, dễ lau chùi",
            "durability_years": "15 năm",
            "finish_type": "Bề mặt G (Glossy mờ nhẹ) dễ dàng làm sạch không lưu vệt",
            "pbr_parameters": {
                "baseColorHex": "#F5F5F7",
                "roughness": 0.35,
                "metalness": 0.0,
                "clearcoat": 0.10,
                "clearcoatRoughness": 0.25,
                "ior": 1.48,
                "transmission": 0.0,
                "normalScale": [0.3, 0.3],
                "specularIntensity": 0.50,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/ancuong_ms101g/albedo.webp",
                "normal": "textures/ancuong_ms101g/normal.webp",
                "roughness": "textures/ancuong_ms101g/roughness.webp",
                "ao": "textures/ancuong_ms101g/ambient_occlusion.webp",
                "displacement": "textures/ancuong_ms101g/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_ac_ms101g.glb",
                "usdz_asset_path": "models/materials/pbr_ac_ms101g.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.22, 2.44]
            },
            "application_notes": "Sử dụng làm thùng tủ bếp chống ẩm, vách ngăn hộc kéo, hậu tủ chống ẩm mốc tường."
        },
        {
            "material_id": "MAT_AC_MELAMINE_MS105T",
            "material_code": "AC-MS-105-T",
            "name": "Melamine An Cường MS 105 T (Ghi Xi Măng Hiện Đại T)",
            "category": "Gỗ Công Nghiệp Phủ Melamine",
            "subcategory": "Cốt MDF Xanh Chống Ẩm V313 An Cường",
            "supplier": "Ván An Cường (Phân phối: Lâm Giang / Cầu Vượt Hà Tĩnh)",
            "unit": "m2 thành phẩm",
            "standard_price_vnd": 1800000,
            "raw_material_price_vnd_sheet": 620000,
            "humidity_resistance": "Kháng ẩm chống nước bề mặt tiêu chuẩn cao",
            "heat_resistance": "Chống cháy lan bề mặt theo tiêu chuẩn nội thất dân dụng",
            "durability_years": "15 năm",
            "finish_type": "Bề mặt T (Texture sần cát) phong cách xi măng xám đô thị",
            "pbr_parameters": {
                "baseColorHex": "#7F8489",
                "roughness": 0.65,
                "metalness": 0.0,
                "clearcoat": 0.0,
                "clearcoatRoughness": 0.50,
                "ior": 1.50,
                "transmission": 0.0,
                "normalScale": [0.9, 0.9],
                "specularIntensity": 0.35,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/ancuong_ms105t/albedo.webp",
                "normal": "textures/ancuong_ms105t/normal.webp",
                "roughness": "textures/ancuong_ms105t/roughness.webp",
                "ao": "textures/ancuong_ms105t/ambient_occlusion.webp",
                "displacement": "textures/ancuong_ms105t/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_ac_ms105t.glb",
                "usdz_asset_path": "models/materials/pbr_ac_ms105t.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.22, 2.44]
            },
            "application_notes": "Sử dụng cho không gian căn hộ hiện đại Industrial, vách trang trí TV, tủ giày thông minh."
        },
        {
            "material_id": "MAT_AC_MELAMINE_MS023T",
            "material_code": "AC-MS-023-T",
            "name": "Melamine An Cường MS 023 T (Đen Mờ Carbon Đẳng Cấp)",
            "category": "Gỗ Công Nghiệp Phủ Melamine",
            "subcategory": "Cốt MDF Xanh Chống Ẩm V313 An Cường",
            "supplier": "Ván An Cường (Phân phối: Lâm Giang / Cầu Vượt Hà Tĩnh)",
            "unit": "m2 thành phẩm",
            "standard_price_vnd": 1820000,
            "raw_material_price_vnd_sheet": 640000,
            "humidity_resistance": "Cốt MDF lõi xanh chống ẩm V313 cao cấp",
            "heat_resistance": "Bề mặt chống bám bụi và chống bạc màu ánh sáng đèn",
            "durability_years": "15 năm",
            "finish_type": "Bề mặt mờ mịn sần nhung carbon chống phản xạ chói lóa",
            "pbr_parameters": {
                "baseColorHex": "#1F2022",
                "roughness": 0.58,
                "metalness": 0.0,
                "clearcoat": 0.0,
                "clearcoatRoughness": 0.50,
                "ior": 1.50,
                "transmission": 0.0,
                "normalScale": [0.6, 0.6],
                "specularIntensity": 0.40,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/ancuong_ms023t/albedo.webp",
                "normal": "textures/ancuong_ms023t/normal.webp",
                "roughness": "textures/ancuong_ms023t/roughness.webp",
                "ao": "textures/ancuong_ms023t/ambient_occlusion.webp",
                "displacement": "textures/ancuong_ms023t/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_ac_ms023t.glb",
                "usdz_asset_path": "models/materials/pbr_ac_ms023t.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.22, 2.44]
            },
            "application_notes": "Sử dụng làm hồi tủ áo cánh kính, đợt kệ trang trí trưng bày rượu vang, vách nền sang trọng."
        },

        # -------------------------------------------------------------------------
        # NHÓM 3: ACRYLIC BÓNG GƯƠNG LIVAS & CÁNH HUỲNH SƠN PU CAO CẤP
        # -------------------------------------------------------------------------
        {
            "material_id": "MAT_LIVAS_ACRYLIC_PARC01",
            "material_code": "LIVAS-PARC-01",
            "name": "Acrylic Bóng Gương Livas PARC 01 (Trắng Sứ NoLine)",
            "category": "Acrylic Bóng Gương Cao Cấp",
            "subcategory": "Cánh Dán Cạnh Không Đường Line Livas",
            "supplier": "Chiến Acrylic Livas (Hà Tĩnh / Nghệ An)",
            "unit": "m2 cánh hoàn thiện",
            "standard_price_vnd": 2750000,
            "raw_material_price_vnd_sheet": 1250000,
            "humidity_resistance": "Lớp phủ Acrylic nhập khẩu bảo vệ 100% cốt lõi xanh, kháng ẩm nước tuyệt đối",
            "heat_resistance": "Chịu nhiệt môi trường bếp nấu tới 140°C, không ố vàng bề mặt",
            "durability_years": "Trên 20 năm",
            "finish_type": "Bóng gương sâu như tráng gương pha lê, công nghệ dán noline chống lọt nước",
            "pbr_parameters": {
                "baseColorHex": "#FBFBFC",
                "roughness": 0.04,
                "metalness": 0.0,
                "clearcoat": 0.95,
                "clearcoatRoughness": 0.05,
                "ior": 1.49,
                "transmission": 0.0,
                "normalScale": [0.1, 0.1],
                "specularIntensity": 0.95,
                "emissiveHex": "#000000",
                "subsurface": 0.02
            },
            "texture_maps": {
                "albedo": "textures/livas_parc01/albedo.webp",
                "normal": "textures/livas_parc01/normal.webp",
                "roughness": "textures/livas_parc01/roughness.webp",
                "ao": "textures/livas_parc01/ambient_occlusion.webp",
                "displacement": "textures/livas_parc01/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_livas_parc01.glb",
                "usdz_asset_path": "models/materials/pbr_livas_parc01.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.0, 1.0]
            },
            "application_notes": "Lựa chọn hàng đầu cho cánh tủ bếp trên phong cách tối giản Modern Minimalist, tạo cảm giác thông thoáng."
        },
        {
            "material_id": "MAT_LIVAS_ACRYLIC_PARC68",
            "material_code": "LIVAS-PARC-68",
            "name": "Acrylic Bóng Gương Livas PARC 68 (Xám Chì Titan Ánh Kim)",
            "category": "Acrylic Bóng Gương Cao Cấp",
            "subcategory": "Cánh Dán Cạnh Không Đường Line Livas",
            "supplier": "Chiến Acrylic Livas (Hà Tĩnh / Nghệ An)",
            "unit": "m2 cánh hoàn thiện",
            "standard_price_vnd": 2850000,
            "raw_material_price_vnd_sheet": 1350000,
            "humidity_resistance": "Kháng nước chống ẩm 100%, bảo vệ tuyệt hảo cho khu vực ẩm ướt",
            "heat_resistance": "Chịu nhiệt cao, bền màu ánh kim trước ánh sáng cường độ mạnh",
            "durability_years": "Trên 20 năm",
            "finish_type": "Bóng gương phủ nhũ titan ánh kim cao cấp, không đường dán cạnh",
            "pbr_parameters": {
                "baseColorHex": "#383A40",
                "roughness": 0.05,
                "metalness": 0.15,
                "clearcoat": 0.98,
                "clearcoatRoughness": 0.04,
                "ior": 1.52,
                "transmission": 0.0,
                "normalScale": [0.1, 0.1],
                "specularIntensity": 0.96,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/livas_parc68/albedo.webp",
                "normal": "textures/livas_parc68/normal.webp",
                "roughness": "textures/livas_parc68/roughness.webp",
                "ao": "textures/livas_parc68/ambient_occlusion.webp",
                "displacement": "textures/livas_parc68/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_livas_parc68.glb",
                "usdz_asset_path": "models/materials/pbr_livas_parc68.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.0, 1.0]
            },
            "application_notes": "Sử dụng cho hệ cánh tủ bếp dưới, cánh tủ lavabo cao cấp và mảng ốp trang trí phản chiếu."
        },
        {
            "material_id": "MAT_LIVAS_ACRYLIC_ARC201",
            "material_code": "LIVAS-ARC-201",
            "name": "Acrylic Livas Matt Silk ARC 201 (Xám Lụa Siêu Mờ Chống Vân Tay)",
            "category": "Acrylic Siêu Mờ Matt Cao Cấp",
            "subcategory": "Cánh Acrylic Kháng Khuẩn Không Bám Vân Tay",
            "supplier": "Chiến Acrylic Livas (Hà Tĩnh / Nghệ An)",
            "unit": "m2 cánh hoàn thiện",
            "standard_price_vnd": 2900000,
            "raw_material_price_vnd_sheet": 1400000,
            "humidity_resistance": "Kháng ẩm chống nấm mốc bề mặt tiêu chuẩn Châu Âu",
            "heat_resistance": "Chịu nhiệt tốt, bề mặt phủ lớp nano chống trầy xước nhẹ",
            "durability_years": "20 năm",
            "finish_type": "Mờ mịn lụa láng êm tay (Silk Touch), triệt tiêu hoàn toàn dấu vân tay",
            "pbr_parameters": {
                "baseColorHex": "#8C8D91",
                "roughness": 0.40,
                "metalness": 0.0,
                "clearcoat": 0.10,
                "clearcoatRoughness": 0.30,
                "ior": 1.48,
                "transmission": 0.0,
                "normalScale": [0.2, 0.2],
                "specularIntensity": 0.45,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/livas_arc201/albedo.webp",
                "normal": "textures/livas_arc201/normal.webp",
                "roughness": "textures/livas_arc201/roughness.webp",
                "ao": "textures/livas_arc201/ambient_occlusion.webp",
                "displacement": "textures/livas_arc201/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_livas_arc201.glb",
                "usdz_asset_path": "models/materials/pbr_livas_arc201.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.0, 1.0]
            },
            "application_notes": "Sử dụng cho cánh tủ áo cao cấp, bàn đảo bếp và tủ trang điểm không để lại vết mồ hôi."
        },
        {
            "material_id": "MAT_ALD_SHAKER_INCHEM",
            "material_code": "ALD-SHAKER-01",
            "name": "Cánh Huỳnh ALD Cốt MDF Sơn Men Inchem PU",
            "category": "Cánh Huỳnh Tân Cổ Điển",
            "subcategory": "Cánh Huỳnh Huỳnh ALD CNC Sơn Men",
            "supplier": "Đức Acrylic - Cánh Huỳnh ALD (Sơn Đức Lĩnh Inchem PU)",
            "unit": "m2 hoàn thiện",
            "standard_price_vnd": 2650000,
            "raw_material_price_vnd_sheet": 980000,
            "humidity_resistance": "Cốt xanh chống ẩm phay huỳnh CNC, sơn 6 lớp chống ẩm toàn diện",
            "heat_resistance": "Chịu nhiệt phòng, màng sơn Inchem chống rạn nứt co ngót",
            "durability_years": "18 năm",
            "finish_type": "Sơn Inchem Mỹ hệ men mờ 50% tinh tế mượt mà từng đường chỉ huỳnh",
            "pbr_parameters": {
                "baseColorHex": "#EFEFEF",
                "roughness": 0.28,
                "metalness": 0.0,
                "clearcoat": 0.40,
                "clearcoatRoughness": 0.20,
                "ior": 1.50,
                "transmission": 0.0,
                "normalScale": [0.5, 0.5],
                "specularIntensity": 0.50,
                "emissiveHex": "#000000",
                "subsurface": 0.01
            },
            "texture_maps": {
                "albedo": "textures/ald_shaker/albedo.webp",
                "normal": "textures/ald_shaker/normal.webp",
                "roughness": "textures/ald_shaker/roughness.webp",
                "ao": "textures/ald_shaker/ambient_occlusion.webp",
                "displacement": "textures/ald_shaker/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_ald_shaker.glb",
                "usdz_asset_path": "models/materials/pbr_ald_shaker.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [0.6, 1.2]
            },
            "application_notes": "Sử dụng cho phong cách Neo-Classic tân cổ điển, tủ bếp quý phái và tủ áo biệt thự."
        },

        # -------------------------------------------------------------------------
        # NHÓM 4: CÁNH KÍNH CƯỜNG LỰC & KHUNG NHÔM ANODE SLIM
        # -------------------------------------------------------------------------
        {
            "material_id": "MAT_GLASS_SMOKE_GREY",
            "material_code": "GLS-SMOKE-5MM",
            "name": "Kính Cường Lực Xám Khói 5mm Cánh Tủ Áo",
            "category": "Kính Cường Lực & Gương Bỉ",
            "subcategory": "Kính Màu Cường Lực Siêu Phẳng",
            "supplier": "Kính Việt Nhật (Gia công cánh kính cao cấp Hà Tĩnh)",
            "unit": "m2 cánh kính",
            "standard_price_vnd": 1850000,
            "raw_material_price_vnd_m2": 650000,
            "humidity_resistance": "Kháng nước và kháng ẩm 100%, không bị oxy hóa hay ố mốc",
            "heat_resistance": "Tôi cường lực nhiệt luyện 700°C, chịu sốc nhiệt và lực va đập gấp 5 lần kính thường",
            "durability_years": "Trọn đời",
            "finish_type": "Mài xiết cạnh bóng gương công nghệ CNC, độ trong quang học hoàn mỹ",
            "pbr_parameters": {
                "baseColorHex": "#2A2E33",
                "roughness": 0.02,
                "metalness": 0.05,
                "clearcoat": 1.0,
                "clearcoatRoughness": 0.02,
                "ior": 1.52,
                "transmission": 0.72,
                "normalScale": [0.0, 0.0],
                "specularIntensity": 1.0,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/glass_smoke/albedo.webp",
                "normal": "textures/glass_smoke/normal.webp",
                "roughness": "textures/glass_smoke/roughness.webp",
                "ao": "textures/glass_smoke/ambient_occlusion.webp",
                "displacement": "textures/glass_smoke/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_glass_smoke.glb",
                "usdz_asset_path": "models/materials/pbr_glass_smoke.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.0, 2.0]
            },
            "application_notes": "Tạo hiệu ứng xuyên sáng huyền ảo khi kết hợp đèn LED thanh nhôm âm tủ áo Master."
        },
        {
            "material_id": "MAT_GLASS_TEA_BROWN",
            "material_code": "GLS-TEA-5MM",
            "name": "Kính Cường Lực Trà Sậm 5mm Cao Cấp",
            "category": "Kính Cường Lực & Gương Bỉ",
            "subcategory": "Kính Màu Cường Lực Tông Trà Ấm",
            "supplier": "Kính Việt Nhật (Gia công cánh kính cao cấp Hà Tĩnh)",
            "unit": "m2 cánh kính",
            "standard_price_vnd": 1950000,
            "raw_material_price_vnd_m2": 720000,
            "humidity_resistance": "Kháng ẩm nước 100%, bề mặt phủ chống bám bụi nano",
            "heat_resistance": "Tôi nhiệt tôi cường độ cao, chịu va chạm cơ học vượt trội",
            "durability_years": "Trọn đời",
            "finish_type": "Sắc nâu trà sang trọng hoàng gia, bóng gương phẳng tuyệt đối",
            "pbr_parameters": {
                "baseColorHex": "#3A2E26",
                "roughness": 0.02,
                "metalness": 0.05,
                "clearcoat": 1.0,
                "clearcoatRoughness": 0.02,
                "ior": 1.52,
                "transmission": 0.68,
                "normalScale": [0.0, 0.0],
                "specularIntensity": 1.0,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/glass_tea/albedo.webp",
                "normal": "textures/glass_tea/normal.webp",
                "roughness": "textures/glass_tea/roughness.webp",
                "ao": "textures/glass_tea/ambient_occlusion.webp",
                "displacement": "textures/glass_tea/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_glass_tea.glb",
                "usdz_asset_path": "models/materials/pbr_glass_tea.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.0, 2.0]
            },
            "application_notes": "Đặc biệt hòa quyện với không gian nội thất Gỗ Óc Chó và tủ trưng bày rượu vang quý."
        },
        {
            "material_id": "MAT_ALU_ANODE_SLIM_BLACK",
            "material_code": "ALU-SLIM-BLK-20",
            "name": "Khung Nhôm Anode Định Hình Slim Đen Mờ Carbon",
            "category": "Kim Loại Anode Định Hình",
            "subcategory": "Hệ Profile Nhôm Slim Nội Thất Cao Cấp",
            "supplier": "Phụ kiện Quốc Tâm (Tâm Quốc - Roxana Hà Tĩnh)",
            "unit": "md thanh định hình",
            "standard_price_vnd": 450000,
            "raw_material_price_vnd_bar": 380000,
            "humidity_resistance": "Công nghệ Anode hóa bề mặt chống oxy hóa muối biển và môi trường ẩm",
            "heat_resistance": "Chịu nhiệt độ kim loại tới 300°C, không phai màu hay bong tróc",
            "durability_years": "Trên 30 năm",
            "finish_type": "Anode hóa mờ xước nhẹ chống trầy xước và bám bẩn vân tay",
            "pbr_parameters": {
                "baseColorHex": "#1E1F21",
                "roughness": 0.32,
                "metalness": 0.88,
                "clearcoat": 0.10,
                "clearcoatRoughness": 0.25,
                "ior": 1.40,
                "transmission": 0.0,
                "normalScale": [0.4, 0.4],
                "specularIntensity": 0.85,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/alu_anode_blk/albedo.webp",
                "normal": "textures/alu_anode_blk/normal.webp",
                "roughness": "textures/alu_anode_blk/roughness.webp",
                "ao": "textures/alu_anode_blk/ambient_occlusion.webp",
                "displacement": "textures/alu_anode_blk/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_alu_slim_blk.glb",
                "usdz_asset_path": "models/materials/pbr_alu_slim_blk.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [0.1, 2.5]
            },
            "application_notes": "Sử dụng cho viền cánh kính tủ áo, cửa lùa slim ngăn phòng không ray dưới tinh tế."
        },
        {
            "material_id": "MAT_ALU_ANODE_CHAMPAGNE",
            "material_code": "ALU-SLIM-CHP-20",
            "name": "Khung Nhôm Anode Champagne Vàng Đồng Xước Mờ",
            "category": "Kim Loại Anode Định Hình",
            "subcategory": "Hệ Profile Nhôm Slim Nội Thất Luxury",
            "supplier": "Phụ kiện Quốc Tâm (Tâm Quốc - Roxana Hà Tĩnh)",
            "unit": "md thanh định hình",
            "standard_price_vnd": 480000,
            "raw_material_price_vnd_bar": 410000,
            "humidity_resistance": "Lớp mạ Anodized bền bỉ vĩnh cửu không rỉ sét",
            "heat_resistance": "Bền bỉ trước mọi điều kiện sốc nhiệt trong nhà",
            "durability_years": "Trên 30 năm",
            "finish_type": "Mạ Anode xước mờ màu vàng Champagne vương giả",
            "pbr_parameters": {
                "baseColorHex": "#A7977E",
                "roughness": 0.30,
                "metalness": 0.85,
                "clearcoat": 0.15,
                "clearcoatRoughness": 0.20,
                "ior": 1.45,
                "transmission": 0.0,
                "normalScale": [0.4, 0.4],
                "specularIntensity": 0.88,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/alu_anode_chp/albedo.webp",
                "normal": "textures/alu_anode_chp/normal.webp",
                "roughness": "textures/alu_anode_chp/roughness.webp",
                "ao": "textures/alu_anode_chp/ambient_occlusion.webp",
                "displacement": "textures/alu_anode_chp/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_alu_slim_champagne.glb",
                "usdz_asset_path": "models/materials/pbr_alu_slim_champagne.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [0.1, 2.5]
            },
            "application_notes": "Tạo điểm nhấn đẳng cấp cho hệ tủ rượu phòng khách, vách kính trang trí biệt thự."
        },
        {
            "material_id": "MAT_MIRROR_BELGIUM_DANTALUX",
            "material_code": "MIR-BELGIUM-DAN",
            "name": "Gương Bỉ Dantalux 5mm Tráng Bạc 8 Lớp Chống Ố",
            "category": "Kính Cường Lực & Gương Bỉ",
            "subcategory": "Gương Bỉ Nhập Khẩu Chính Hãng Dantalux",
            "supplier": "Vũ Cường - Gương Bỉ Dantalux Hà Tĩnh",
            "unit": "m2 hoàn thiện",
            "standard_price_vnd": 1250000,
            "raw_material_price_vnd_m2": 520000,
            "humidity_resistance": "Tráng bạc 8 lớp 100% không pha đồng, kháng muối và kháng ẩm mốc tuyệt đối",
            "heat_resistance": "Chịu nhiệt độ môi trường phòng tắm và đèn sấy",
            "durability_years": "25 năm không méo hình và không ố mép",
            "finish_type": "Hình ảnh phản chiếu chân thực 1:1, bóng gương sắc nét hoàn mỹ",
            "pbr_parameters": {
                "baseColorHex": "#F2F4F7",
                "roughness": 0.01,
                "metalness": 0.98,
                "clearcoat": 1.0,
                "clearcoatRoughness": 0.01,
                "ior": 1.53,
                "transmission": 0.0,
                "normalScale": [0.0, 0.0],
                "specularIntensity": 1.0,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/mirror_dantalux/albedo.webp",
                "normal": "textures/mirror_dantalux/normal.webp",
                "roughness": "textures/mirror_dantalux/roughness.webp",
                "ao": "textures/mirror_dantalux/ambient_occlusion.webp",
                "displacement": "textures/mirror_dantalux/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_mirror_dantalux.glb",
                "usdz_asset_path": "models/materials/pbr_mirror_dantalux.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [1.0, 1.5]
            },
            "application_notes": "Sử dụng cho bàn trang điểm phòng Master, gương soi toàn thân và gương decor mài vát lá hẹ."
        },

        # -------------------------------------------------------------------------
        # NHÓM 5: ĐÁ NUNG KẾT & ĐÁ THẠCH ANH NHÂN TẠO VICOSTONE
        # -------------------------------------------------------------------------
        {
            "material_id": "MAT_SINTERED_CALACATTA_GOLD",
            "material_code": "STN-CALA-GOLD-12",
            "name": "Đá Nung Kết Sintered Stone Calacatta Gold 12mm",
            "category": "Đá Nung Kết & Thạch Anh",
            "subcategory": "Đá Nung Kết Khổ Lớn Kháng Ố",
            "supplier": "Đá / PVC Ceramic Hoàng Hà (Hà Tĩnh)",
            "unit": "md mặt đá hoàn thiện",
            "standard_price_vnd": 3450000,
            "raw_material_price_vnd_slab": 7800000,
            "humidity_resistance": "Độ hút nước < 0.02%, kháng ngấm cà phê, rượu vang và nước tương 100%",
            "heat_resistance": "Nung ép ở nhiệt độ 1200°C và áp suất 30000 tấn, chịu xoong nồi sôi đặt trực tiếp",
            "durability_years": "Trọn đời",
            "finish_type": "Bề mặt bóng lụa Satin hoặc Polish vân mây vàng ánh kim Calacatta sang trọng",
            "pbr_parameters": {
                "baseColorHex": "#F4F2EE",
                "roughness": 0.12,
                "metalness": 0.0,
                "clearcoat": 0.85,
                "clearcoatRoughness": 0.08,
                "ior": 1.54,
                "transmission": 0.0,
                "normalScale": [0.6, 0.6],
                "specularIntensity": 0.85,
                "emissiveHex": "#000000",
                "subsurface": 0.15
            },
            "texture_maps": {
                "albedo": "textures/sintered_calacatta/albedo.webp",
                "normal": "textures/sintered_calacatta/normal.webp",
                "roughness": "textures/sintered_calacatta/roughness.webp",
                "ao": "textures/sintered_calacatta/ambient_occlusion.webp",
                "displacement": "textures/sintered_calacatta/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_sintered_calacatta.glb",
                "usdz_asset_path": "models/materials/pbr_sintered_calacatta.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "4K (4096x4096px)",
                "tile_size_meters": [1.6, 3.2]
            },
            "application_notes": "Sử dụng làm mặt bàn bếp nấu, bàn đảo ăn đảo bếp và lavabo nguyên khối cao cấp."
        },
        {
            "material_id": "MAT_SINTERED_LAURENT_BLACK",
            "material_code": "STN-LAURENT-BLK-12",
            "name": "Đá Nung Kết Laurent Black Marble Vân Vàng Kim",
            "category": "Đá Nung Kết & Thạch Anh",
            "subcategory": "Đá Nung Kết Màu Đen Tia Sét",
            "supplier": "Đá / PVC Ceramic Hoàng Hà (Hà Tĩnh)",
            "unit": "md mặt đá hoàn thiện",
            "standard_price_vnd": 3850000,
            "raw_material_price_vnd_slab": 8500000,
            "humidity_resistance": "Kháng thấm ố tuyệt đối, không phản ứng với hóa chất tẩy rửa",
            "heat_resistance": "Chống cháy lan, chống sốc nhiệt độ tới 1250°C",
            "durability_years": "Trọn đời",
            "finish_type": "Màu đen sâu thẳm kết hợp đường vân tia chớp màu vàng kim gold quyền lực",
            "pbr_parameters": {
                "baseColorHex": "#1B1C1E",
                "roughness": 0.15,
                "metalness": 0.05,
                "clearcoat": 0.80,
                "clearcoatRoughness": 0.10,
                "ior": 1.55,
                "transmission": 0.0,
                "normalScale": [0.7, 0.7],
                "specularIntensity": 0.82,
                "emissiveHex": "#000000",
                "subsurface": 0.05
            },
            "texture_maps": {
                "albedo": "textures/sintered_laurent/albedo.webp",
                "normal": "textures/sintered_laurent/normal.webp",
                "roughness": "textures/sintered_laurent/roughness.webp",
                "ao": "textures/sintered_laurent/ambient_occlusion.webp",
                "displacement": "textures/sintered_laurent/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_sintered_laurent.glb",
                "usdz_asset_path": "models/materials/pbr_sintered_laurent.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "4K (4096x4096px)",
                "tile_size_meters": [1.6, 3.2]
            },
            "application_notes": "Ốp vách thông tầng đối xứng Bookmatch, quầy bar lễ tân và mặt bàn trà phòng khách biệt thự."
        },
        {
            "material_id": "MAT_VICOSTONE_BQ8668",
            "material_code": "VCS-BQ-8668",
            "name": "Đá Thạch Anh Vicostone BQ8668 Statuario Tuyệt Tác",
            "category": "Đá Nung Kết & Thạch Anh",
            "subcategory": "Đá Thạch Anh Cao Cấp Vicostone",
            "supplier": "Vicostone Việt Nam (Hoàng Hà phân phối Hà Tĩnh)",
            "unit": "md mặt đá hoàn thiện",
            "standard_price_vnd": 4100000,
            "raw_material_price_vnd_slab": 9200000,
            "humidity_resistance": "Chứa hơn 90% cốt liệu thạch anh tự nhiên, chống ngấm ố đạt tiêu chuẩn NSF quốc tế an toàn thực phẩm",
            "heat_resistance": "Khả năng chịu nhiệt tuyệt hảo cho bếp gia đình cao cấp",
            "durability_years": "Bảo hành chính hãng 15 năm",
            "finish_type": "Vân đá mô phỏng dòng chảy sông băng trên nền cẩm thạch trắng Carrara",
            "pbr_parameters": {
                "baseColorHex": "#F8F9FA",
                "roughness": 0.08,
                "metalness": 0.0,
                "clearcoat": 0.90,
                "clearcoatRoughness": 0.05,
                "ior": 1.54,
                "transmission": 0.0,
                "normalScale": [0.5, 0.5],
                "specularIntensity": 0.90,
                "emissiveHex": "#000000",
                "subsurface": 0.12
            },
            "texture_maps": {
                "albedo": "textures/vicostone_bq8668/albedo.webp",
                "normal": "textures/vicostone_bq8668/normal.webp",
                "roughness": "textures/vicostone_bq8668/roughness.webp",
                "ao": "textures/vicostone_bq8668/ambient_occlusion.webp",
                "displacement": "textures/vicostone_bq8668/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_vicostone_bq8668.glb",
                "usdz_asset_path": "models/materials/pbr_vicostone_bq8668.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "4K (4096x4096px)",
                "tile_size_meters": [1.44, 3.05]
            },
            "application_notes": "Mặt bàn bếp, đảo bếp và ốp len tường chống bám bẩn cho các biệt thự cao cấp."
        },
        {
            "material_id": "MAT_VICOSTONE_BQ8885",
            "material_code": "VCS-BQ-8885",
            "name": "Đá Thạch Anh Vicostone BQ8885 Elysian Vân Mây Nhẹ",
            "category": "Đá Nung Kết & Thạch Anh",
            "subcategory": "Đá Thạch Anh Cao Cấp Vicostone",
            "supplier": "Vicostone Việt Nam (Hoàng Hà phân phối Hà Tĩnh)",
            "unit": "md mặt đá hoàn thiện",
            "standard_price_vnd": 3650000,
            "raw_material_price_vnd_slab": 8200000,
            "humidity_resistance": "Kháng khuẩn Microban, chống ngấm nước hoàn toàn",
            "heat_resistance": "Chịu lực chống va đập và trầy xước cấp 7 độ Mohs",
            "durability_years": "Bảo hành chính hãng 15 năm",
            "finish_type": "Nền trắng ấm điểm xuyết vân mây ấm áp như sương khói ban mai",
            "pbr_parameters": {
                "baseColorHex": "#ECEEF0",
                "roughness": 0.10,
                "metalness": 0.0,
                "clearcoat": 0.88,
                "clearcoatRoughness": 0.06,
                "ior": 1.54,
                "transmission": 0.0,
                "normalScale": [0.5, 0.5],
                "specularIntensity": 0.88,
                "emissiveHex": "#000000",
                "subsurface": 0.10
            },
            "texture_maps": {
                "albedo": "textures/vicostone_bq8885/albedo.webp",
                "normal": "textures/vicostone_bq8885/normal.webp",
                "roughness": "textures/vicostone_bq8885/roughness.webp",
                "ao": "textures/vicostone_bq8885/ambient_occlusion.webp",
                "displacement": "textures/vicostone_bq8885/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/materials/pbr_vicostone_bq8885.glb",
                "usdz_asset_path": "models/materials/pbr_vicostone_bq8885.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "4K (4096x4096px)",
                "tile_size_meters": [1.44, 3.05]
            },
            "application_notes": "Sử dụng cho mặt bàn ăn, lavabo phòng tắm Master và bệ cửa sổ chống nắng."
        },

        # -------------------------------------------------------------------------
        # NHÓM 6: PHỤ KIỆN KIM KHÍ THÔNG MINH (BLUM, HAFELE, QUỐC TÂM)
        # -------------------------------------------------------------------------
        {
            "material_id": "MAT_FITTING_BLUM_MOTION",
            "material_code": "BLUM-71B3550-SS",
            "name": "Bản Lề Giảm Chấn Blum Clip Top Blumotion Inox 304",
            "category": "Phụ Kiện Kim Khí Thông Minh",
            "subcategory": "Bản Lề Giảm Chấn Thủy Lực Áo Thép",
            "supplier": "Phụ kiện Quốc Tâm (Tâm Quốc - Roxana Hà Tĩnh)",
            "unit": "cái",
            "standard_price_vnd": 85000,
            "raw_material_price_vnd_box": 2100000,
            "humidity_resistance": "Thép mạ Niken & Inox 304 chống rỉ sét trong môi trường ẩm ướt nhiệt đới",
            "heat_resistance": "Piston dầu giảm chấn chịu nhiệt từ -15°C đến 60°C vận hành êm ái",
            "durability_years": "Kiểm nghiệm 200,000 lần đóng mở tương đương 20 năm sử dụng",
            "finish_type": "Mạ Niken bóng mờ ánh bạc sang trọng",
            "pbr_parameters": {
                "baseColorHex": "#D5D7DA",
                "roughness": 0.22,
                "metalness": 0.95,
                "clearcoat": 0.10,
                "clearcoatRoughness": 0.15,
                "ior": 1.65,
                "transmission": 0.0,
                "normalScale": [0.3, 0.3],
                "specularIntensity": 0.92,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/blum_hinge/albedo.webp",
                "normal": "textures/blum_hinge/normal.webp",
                "roughness": "textures/blum_hinge/roughness.webp",
                "ao": "textures/blum_hinge/ambient_occlusion.webp",
                "displacement": "textures/blum_hinge/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/fittings/pbr_blum_cliptop.glb",
                "usdz_asset_path": "models/fittings/pbr_blum_cliptop.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "1K (1024x1024px)",
                "tile_size_meters": [0.1, 0.06]
            },
            "application_notes": "Lắp đặt cho tất cả các cánh tủ bếp, tủ áo, tủ lavabo Phú Gia Home Luxury cam kết đóng êm không tiếng ồn."
        },
        {
            "material_id": "MAT_FITTING_BLUM_AVENTOS_HF",
            "material_code": "BLUM-AVENTOS-HF25",
            "name": "Tay Nâng Đôi Blum Aventos HF 25/28 Tủ Bếp",
            "category": "Phụ Kiện Kim Khí Thông Minh",
            "subcategory": "Cơ Cấu Tay Nâng Cánh Tủ Bếp Đôi",
            "supplier": "Phụ kiện Quốc Tâm (Tâm Quốc - Roxana Hà Tĩnh)",
            "unit": "bộ cơ cấu",
            "standard_price_vnd": 3850000,
            "raw_material_price_vnd_box": 3600000,
            "humidity_resistance": "Vỏ ốp xám bạc kháng ẩm, cơ cấu lò xo thép cường lực không rỉ sét",
            "heat_resistance": "Chịu nhiệt độ khoang bếp nấu trên cao",
            "durability_years": "Bảo hành trọn đời cơ cấu lực",
            "finish_type": "Nắp ốp màu xám tro Silk Grey phối cánh tay thép mạ Crom bóng",
            "pbr_parameters": {
                "baseColorHex": "#E0E2E5",
                "roughness": 0.25,
                "metalness": 0.90,
                "clearcoat": 0.10,
                "clearcoatRoughness": 0.20,
                "ior": 1.60,
                "transmission": 0.0,
                "normalScale": [0.4, 0.4],
                "specularIntensity": 0.90,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/blum_aventos/albedo.webp",
                "normal": "textures/blum_aventos/normal.webp",
                "roughness": "textures/blum_aventos/roughness.webp",
                "ao": "textures/blum_aventos/ambient_occlusion.webp",
                "displacement": "textures/blum_aventos/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/fittings/pbr_blum_aventos_hf.glb",
                "usdz_asset_path": "models/fittings/pbr_blum_aventos_hf.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [0.3, 0.4]
            },
            "application_notes": "Nâng mở cánh khoang bát đĩa tủ trên nhẹ nhàng, dừng ở mọi vị trí theo ý muốn."
        },
        {
            "material_id": "MAT_FITTING_HAFELE_DRAWER",
            "material_code": "HAFELE-ALTO-500",
            "name": "Ray Hộp Giảm Chấn Hafele Alto Drawer Mở Toàn Phần",
            "category": "Phụ Kiện Kim Khí Thông Minh",
            "subcategory": "Hệ Thống Ray Hộp Ngăn Kéo Giảm Chấn",
            "supplier": "Phụ kiện Quốc Tâm (Tâm Quốc - Roxana Hà Tĩnh)",
            "unit": "bộ ray hộp",
            "standard_price_vnd": 680000,
            "raw_material_price_vnd_box": 620000,
            "humidity_resistance": "Thành hộp thép sơn tĩnh điện xám ánh kim, ray con lăn thép mạ kẽm chống ẩm rỉ",
            "heat_resistance": "Chịu tải trọng động 35kg - 50kg vận hành trơn tru",
            "durability_years": "60,000 chu kỳ trượt mở (trên 15 năm)",
            "finish_type": "Sơn tĩnh điện màu xám than mờ Metal Grey hiện đại",
            "pbr_parameters": {
                "baseColorHex": "#CCD0D4",
                "roughness": 0.28,
                "metalness": 0.92,
                "clearcoat": 0.05,
                "clearcoatRoughness": 0.25,
                "ior": 1.62,
                "transmission": 0.0,
                "normalScale": [0.3, 0.3],
                "specularIntensity": 0.88,
                "emissiveHex": "#000000",
                "subsurface": 0.0
            },
            "texture_maps": {
                "albedo": "textures/hafele_drawer/albedo.webp",
                "normal": "textures/hafele_drawer/normal.webp",
                "roughness": "textures/hafele_drawer/roughness.webp",
                "ao": "textures/hafele_drawer/ambient_occlusion.webp",
                "displacement": "textures/hafele_drawer/height.webp"
            },
            "ar_metadata": {
                "glb_asset_path": "models/fittings/pbr_hafele_drawer.glb",
                "usdz_asset_path": "models/fittings/pbr_hafele_drawer.usdz",
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True,
                "texture_resolution": "2K (2048x2048px)",
                "tile_size_meters": [0.5, 0.2]
            },
            "application_notes": "Sử dụng cho toàn bộ ngăn kéo tủ gia vị, khay xoong nồi tủ bếp và hộc kéo tủ áo."
        }
    ]
    return materials


def generate_3d_template_spaces():
    """Tạo danh mục 6 không gian mẫu 3D chuẩn hóa phục vụ WebGL và AR Viewer."""
    spaces = [
        # -------------------------------------------------------------------------
        # KHÔNG GIAN 1: PHÒNG KHÁCH BIỆT THỰ GỖ ÓC CHÓ
        # -------------------------------------------------------------------------
        {
            "space_id": "SPACE_3D_LIVING_ROOM_WALNUT",
            "space_code": "SP-01-VILLA-WALNUT",
            "name": "Phòng Khách Biệt Thự Gỗ Óc Chó Bắc Mỹ",
            "space_type": "Phòng Khách Biệt Thự",
            "style": "Modern Luxury High-End",
            "floor_area_m2": 55.0,
            "dimensions": {
                "length_m": 8.5,
                "width_m": 6.5,
                "height_m": 3.6
            },
            "description": "Không gian phòng khách biệt thự bề thế chế tác từ Gỗ Óc Chó Bắc Mỹ FAS tuyển chọn 100%, kết hợp mặt bàn trà Đá Vicostone Statuario, vách trang trí ốp nu óc chó và hệ đèn LED gián tiếp 3000K ấm áp tạo nên vẻ đẹp vương giả, uy nghiêm.",
            "camera_configuration": {
                "fov_degrees": 60,
                "near_clipping": 0.1,
                "far_clipping": 100.0,
                "initial_position": [0.0, 1.45, 4.8],
                "target_look_at": [0.0, 1.1, 0.0],
                "orbit_limits": {
                    "min_distance_m": 1.2,
                    "max_distance_m": 8.0,
                    "max_polar_angle_rad": 1.65
                }
            },
            "lighting_environment": {
                "hdri_environment_map": "environments/luxury_penthouse_warm_4k.hdr",
                "ambient_intensity": 0.35,
                "color_temperature_k": 3200,
                "directional_lights": [
                    {
                        "name": "Sun_Window_Light",
                        "position": [4.5, 6.0, 3.0],
                        "intensity": 2.2,
                        "color_hex": "#FFF5E6",
                        "cast_shadows": True
                    }
                ],
                "point_lights": [
                    {
                        "name": "Chandelier_Center",
                        "position": [0.0, 3.2, 0.0],
                        "intensity": 1.8,
                        "color_hex": "#FFE8CC"
                    },
                    {
                        "name": "LED_Wall_Accent",
                        "position": [-3.8, 2.2, -1.5],
                        "intensity": 0.9,
                        "color_hex": "#FFAA55"
                    }
                ]
            },
            "applied_material_mappings": [
                {
                    "component_name": "Bộ Sofa Chữ U & Bàn Trà Chính",
                    "material_id": "MAT_WALNUT_US_FAS",
                    "surface_area_m2": 18.5,
                    "finish_note": "Sơn PU mờ 70% Inchem phô diễn trọn vẹn tom gỗ tự nhiên"
                },
                {
                    "component_name": "Mặt Bàn Trà Đôi & Mặt Kệ TV",
                    "material_id": "MAT_VICOSTONE_BQ8668",
                    "surface_area_m2": 4.2,
                    "finish_note": "Đá Thạch Anh Vicostone Statuario tia sét trắng sang trọng"
                },
                {
                    "component_name": "Tủ Rượu & Kệ Decor Âm Tường",
                    "material_id": "MAT_GLASS_TEA_BROWN",
                    "surface_area_m2": 8.6,
                    "finish_note": "Kính màu nâu trà cường lực 5mm kết hợp nhôm Slim Champagne"
                },
                {
                    "component_name": "Khung Cánh Tủ Rượu Luxury",
                    "material_id": "MAT_ALU_ANODE_CHAMPAGNE",
                    "surface_area_m2": 3.8,
                    "finish_note": "Profile nhôm Slim mạ Anode xước màu rượu Champagne"
                }
            ],
            "asset_3d_registry": {
                "glb_model_url": "models/spaces/space_01_living_room_walnut.glb",
                "usdz_model_url": "models/spaces/space_01_living_room_walnut.usdz",
                "polygon_count": 348500,
                "vertex_count": 192400,
                "draw_calls": 42,
                "texture_memory_mb": 118,
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True
            },
            "interactive_hotspots": [
                {
                    "hotspot_id": "HOTSPOT_SOFA_WALNUT",
                    "title": "Gỗ Óc Chó Bắc Mỹ FAS",
                    "position": [-0.8, 0.75, 0.3],
                    "camera_focus": [-0.6, 0.9, 1.2],
                    "linked_material_id": "MAT_WALNUT_US_FAS",
                    "description": "Gỗ thịt nhập khẩu tẩm sấy tiêu chuẩn Mỹ KD 8-12%, vân cuộn xoáy 3D tuyệt mỹ được tuyển chọn từng mét gỗ bởi nghệ nhân Phú Gia."
                },
                {
                    "hotspot_id": "HOTSPOT_STONE_TABLE",
                    "title": "Mặt Bàn Vicostone Statuario",
                    "position": [0.0, 0.45, 0.1],
                    "camera_focus": [0.0, 0.7, 0.8],
                    "linked_material_id": "MAT_VICOSTONE_BQ8668",
                    "description": "Đá thạch anh nhân tạo cao cấp Vicostone chống ố tuyệt đối, độ bền cơ học siêu việt, bảo hành 15 năm."
                },
                {
                    "hotspot_id": "HOTSPOT_WINE_CABINET",
                    "title": "Tủ Rượu Cánh Kính Champagne",
                    "position": [3.6, 1.8, -1.2],
                    "camera_focus": [2.8, 1.6, -0.5],
                    "linked_material_id": "MAT_GLASS_TEA_BROWN",
                    "description": "Kính cường lực trà kết hợp khung nhôm Anode Champagne và đèn LED âm đợt nhôm hắt sáng gián tiếp."
                }
            ]
        },

        # -------------------------------------------------------------------------
        # KHÔNG GIAN 2: TỦ BẾP CHỮ L ACRYLIC LIVAS + MELAMINE AN CƯỜNG
        # -------------------------------------------------------------------------
        {
            "space_id": "SPACE_3D_KITCHEN_LIVAS_AC",
            "space_code": "SP-02-KITCHEN-LIVAS-AC",
            "name": "Tủ Bếp Chữ L Acrylic Livas + Melamine An Cường",
            "space_type": "Tủ Bếp Gia Đình Cao Cấp",
            "style": "Modern Minimalist NoLine",
            "floor_area_m2": 24.0,
            "dimensions": {
                "length_m": 5.8,
                "width_m": 4.2,
                "height_m": 2.85
            },
            "description": "Mẫu tủ bếp chữ L hiện đại hoàn hảo: Tủ bếp trên phủ Acrylic Livas PARC 01 trắng bóng gương không đường dán cạnh noline tạo chiều sâu bất tận; Tủ bếp dưới kết hợp Melamine An Cường MS 440 EV vân sồi chống ẩm V313; Mặt bếp Đá Nung Kết Sintered Stone Calacatta Gold 12mm chịu sốc nhiệt tuyệt đối cùng toàn bộ phụ kiện ray trượt bản lề Blum & Hafele.",
            "camera_configuration": {
                "fov_degrees": 55,
                "near_clipping": 0.1,
                "far_clipping": 80.0,
                "initial_position": [2.8, 1.5, 3.2],
                "target_look_at": [0.5, 1.2, -0.4],
                "orbit_limits": {
                    "min_distance_m": 1.0,
                    "max_distance_m": 6.5,
                    "max_polar_angle_rad": 1.60
                }
            },
            "lighting_environment": {
                "hdri_environment_map": "environments/modern_kitchen_studio_4k.hdr",
                "ambient_intensity": 0.40,
                "color_temperature_k": 4000,
                "directional_lights": [
                    {
                        "name": "Kitchen_Ceiling_Spot",
                        "position": [1.5, 4.0, 2.0],
                        "intensity": 2.0,
                        "color_hex": "#FFFFFF",
                        "cast_shadows": True
                    }
                ],
                "point_lights": [
                    {
                        "name": "Under_Cabinet_LED_Bar",
                        "position": [0.8, 1.48, -0.6],
                        "intensity": 1.5,
                        "color_hex": "#FFF6E5"
                    }
                ]
            },
            "applied_material_mappings": [
                {
                    "component_name": "Cánh Tủ Bếp Trên NoLine",
                    "material_id": "MAT_LIVAS_ACRYLIC_PARC01",
                    "surface_area_m2": 9.2,
                    "finish_note": "Acrylic bóng gương Livas dán cạnh Noline tinh xảo tuyệt đối không lộ mép dán"
                },
                {
                    "component_name": "Cánh & Thùng Tủ Bếp Dưới",
                    "material_id": "MAT_AC_MELAMINE_MS440EV",
                    "surface_area_m2": 14.8,
                    "finish_note": "Melamine An Cường vân gỗ sồi cốt xanh chống ẩm V313 tỷ trọng cao"
                },
                {
                    "component_name": "Mặt Bàn Bếp & Ốp Len Tường",
                    "material_id": "MAT_SINTERED_CALACATTA_GOLD",
                    "surface_area_m2": 6.8,
                    "finish_note": "Đá Nung Kết Calacatta Gold 12mm chịu nhiệt 1200°C và không bao giờ ngấm ố"
                },
                {
                    "component_name": "Hệ Cơ Cấu Tay Nâng Khoang Bát",
                    "material_id": "MAT_FITTING_BLUM_AVENTOS_HF",
                    "surface_area_m2": 1.2,
                    "finish_note": "Tay nâng đôi Blum Aventos HF25 nhập khẩu Áo chính hãng"
                },
                {
                    "component_name": "Bản Lề & Hệ Ngăn Kéo Thông Minh",
                    "material_id": "MAT_FITTING_BLUM_MOTION",
                    "surface_area_m2": 2.5,
                    "finish_note": "Bản lề Blum Clip Top Blumotion Inox 304 & Ray hộp Hafele Alto Drawer"
                }
            ],
            "asset_3d_registry": {
                "glb_model_url": "models/spaces/space_02_kitchen_livas_ac.glb",
                "usdz_model_url": "models/spaces/space_02_kitchen_livas_ac.usdz",
                "polygon_count": 284200,
                "vertex_count": 154600,
                "draw_calls": 36,
                "texture_memory_mb": 94,
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True
            },
            "interactive_hotspots": [
                {
                    "hotspot_id": "HOTSPOT_ACRYLIC_UPPER",
                    "title": "Cánh Acrylic Livas Noline",
                    "position": [0.9, 1.85, -0.5],
                    "camera_focus": [1.1, 1.75, 0.2],
                    "linked_material_id": "MAT_LIVAS_ACRYLIC_PARC01",
                    "description": "Công nghệ dán cạnh không đường line công nghiệp độc quyền cho bề mặt bóng gương phẳng như gương pha lê."
                },
                {
                    "hotspot_id": "HOTSPOT_SINTERED_COUNTERTOP",
                    "title": "Mặt Đá Nung Kết 12mm",
                    "position": [1.2, 0.88, -0.4],
                    "camera_focus": [1.2, 1.1, 0.3],
                    "linked_material_id": "MAT_SINTERED_CALACATTA_GOLD",
                    "description": "Chịu xoong chảo sôi lửa trực tiếp lên mặt đá, dao thái cọ sát không trầy xước, sạch khuẩn chuẩn quốc tế."
                },
                {
                    "hotspot_id": "HOTSPOT_BLUM_AVENTOS",
                    "title": "Tay Nâng Đôi Blum Aventos HF",
                    "position": [1.8, 1.9, -0.6],
                    "camera_focus": [1.6, 1.8, 0.1],
                    "linked_material_id": "MAT_FITTING_BLUM_AVENTOS_HF",
                    "description": "Mở cánh nhẹ tựa lông hồng, dừng ở mọi cao độ thao tác, đóng êm ái tích hợp giảm chấn Blumotion."
                }
            ]
        },

        # -------------------------------------------------------------------------
        # KHÔNG GIAN 3: PHÒNG NGỦ MASTER TỦ ÁO CÁNH KÍNH
        # -------------------------------------------------------------------------
        {
            "space_id": "SPACE_3D_MASTER_BEDROOM_GLASS",
            "space_code": "SP-03-BEDROOM-GLASS-WARDROBE",
            "name": "Phòng Ngủ Master Tủ Áo Cánh Kính Khung Nhôm Slim",
            "space_type": "Phòng Ngủ Master",
            "style": "Contemporary Luxury Italian Walk-in Closet",
            "floor_area_m2": 36.0,
            "dimensions": {
                "length_m": 6.8,
                "width_m": 5.3,
                "height_m": 3.0
            },
            "description": "Không gian nghỉ ngơi thư giãn đỉnh cao chuẩn khách sạn 5 sao: Hệ tủ áo Walk-in Closet cánh kính cường lực xám khói khung nhôm Slim Anode đen mờ, tích hợp ray LED cảm ứng thông minh khi mở cánh; Giường ngủ bọc da bò Ý kết hợp vách ốp Melamine An Cường MS 330 EV tông óc chó trầm ấm và bàn phấn gương Bỉ Dantalux mài vát cạnh.",
            "camera_configuration": {
                "fov_degrees": 60,
                "near_clipping": 0.1,
                "far_clipping": 90.0,
                "initial_position": [0.0, 1.4, 3.8],
                "target_look_at": [0.0, 1.2, -0.8],
                "orbit_limits": {
                    "min_distance_m": 1.2,
                    "max_distance_m": 7.0,
                    "max_polar_angle_rad": 1.62
                }
            },
            "lighting_environment": {
                "hdri_environment_map": "environments/luxury_bedroom_dusk_4k.hdr",
                "ambient_intensity": 0.32,
                "color_temperature_k": 3000,
                "directional_lights": [
                    {
                        "name": "Balcony_Moon_Light",
                        "position": [-3.5, 4.0, 2.5],
                        "intensity": 1.4,
                        "color_hex": "#DCE6F5",
                        "cast_shadows": True
                    }
                ],
                "point_lights": [
                    {
                        "name": "Bedside_Pendant_L",
                        "position": [-2.2, 1.6, -1.2],
                        "intensity": 1.2,
                        "color_hex": "#FFDFBA"
                    },
                    {
                        "name": "Closet_Internal_LED_Glow",
                        "position": [2.4, 1.8, -0.5],
                        "intensity": 1.8,
                        "color_hex": "#FFF1D6"
                    }
                ]
            },
            "applied_material_mappings": [
                {
                    "component_name": "Hệ Cánh Kính Cường Lực Tủ Áo",
                    "material_id": "MAT_GLASS_SMOKE_GREY",
                    "surface_area_m2": 15.6,
                    "finish_note": "Kính cường lực xám khói 5mm tôi nhiệt Việt Nhật mài vát bóng"
                },
                {
                    "component_name": "Khung Cánh Nhôm Slim Anode",
                    "material_id": "MAT_ALU_ANODE_SLIM_BLACK",
                    "surface_area_m2": 4.5,
                    "finish_note": "Profile nhôm Slim 20x20mm mạ Anode xước mờ màu đen Carbon"
                },
                {
                    "component_name": "Thùng Tủ Áo & Vách Ốp Đầu Giường",
                    "material_id": "MAT_AC_MELAMINE_MS330EV",
                    "surface_area_m2": 28.0,
                    "finish_note": "Melamine An Cường MS 330 EV vân óc chó sần trầm ấm chống ẩm V313"
                },
                {
                    "component_name": "Gương Trang Điểm Master",
                    "material_id": "MAT_MIRROR_BELGIUM_DANTALUX",
                    "surface_area_m2": 2.2,
                    "finish_note": "Gương Bỉ Dantalux tráng bạc 8 lớp mài xiết bóng không méo quang học"
                }
            ],
            "asset_3d_registry": {
                "glb_model_url": "models/spaces/space_03_master_bedroom_glass.glb",
                "usdz_model_url": "models/spaces/space_03_master_bedroom_glass.usdz",
                "polygon_count": 312000,
                "vertex_count": 178500,
                "draw_calls": 38,
                "texture_memory_mb": 105,
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True
            },
            "interactive_hotspots": [
                {
                    "hotspot_id": "HOTSPOT_SMOKE_GLASS_WARDROBE",
                    "title": "Cánh Kính Xám Khói Slim",
                    "position": [2.4, 1.6, -0.6],
                    "camera_focus": [1.8, 1.5, 0.2],
                    "linked_material_id": "MAT_GLASS_SMOKE_GREY",
                    "description": "Kính màu xám khói sang trọng, nhìn thấu các khoang chứa thời trang lộng lẫy dưới ánh đèn LED âm tủ thông minh."
                },
                {
                    "hotspot_id": "HOTSPOT_SLIM_FRAME",
                    "title": "Khung Nhôm Slim Đen Mờ",
                    "position": [2.1, 1.1, -0.6],
                    "camera_focus": [1.9, 1.2, -0.1],
                    "linked_material_id": "MAT_ALU_ANODE_SLIM_BLACK",
                    "description": "Bản nhôm siêu thanh mảnh 20mm nhập khẩu phụ kiện Quốc Tâm, mạ anode điện phân chống bong tróc trọn đời."
                },
                {
                    "hotspot_id": "HOTSPOT_DANTALUX_MIRROR",
                    "title": "Gương Bỉ Nhập Khẩu Dantalux",
                    "position": [-2.6, 1.4, -0.2],
                    "camera_focus": [-2.0, 1.3, 0.4],
                    "linked_material_id": "MAT_MIRROR_BELGIUM_DANTALUX",
                    "description": "Tráng bạc nguyên chất 8 lớp chống nấm mốc ố mép gương trong khí hậu nóng ẩm Hà Tĩnh."
                }
            ]
        },

        # -------------------------------------------------------------------------
        # KHÔNG GIAN 4: PHÒNG THỜ GỖ TỰ NHIÊN TRANG NGHIÊM
        # -------------------------------------------------------------------------
        {
            "space_id": "SPACE_3D_ALTAR_NATURAL_WOOD",
            "space_code": "SP-04-ANCESTRAL-ALTAR-WOOD",
            "name": "Không Gian Phòng Thờ Gỗ Tự Nhiên Trang Nghiêm",
            "space_type": "Không Gian Tâm Linh Gia Tiên",
            "style": "Traditional Neo-Heritage Vietnam",
            "floor_area_m2": 22.0,
            "dimensions": {
                "length_m": 5.2,
                "width_m": 4.2,
                "height_m": 3.4
            },
            "description": "Không gian thờ tự gia tiên thiêng liêng và tôn nghiêm, chuẩn phong thủy truyền thống Á Đông. Toàn bộ sập thờ án gian, hoành phi câu đối và vách CNC chữ Vạn được đục chạm công phu từ Gỗ Gõ Đỏ Pachyloba Nam Phi kết hợp Gỗ Hương Đá Gia Lai, sơn bóng mờ PU Đức Lĩnh mờ 70% giữ vẹn nguyên tinh hoa vân gỗ thiên nhiên.",
            "camera_configuration": {
                "fov_degrees": 50,
                "near_clipping": 0.1,
                "far_clipping": 70.0,
                "initial_position": [0.0, 1.35, 3.6],
                "target_look_at": [0.0, 1.45, -1.2],
                "orbit_limits": {
                    "min_distance_m": 1.5,
                    "max_distance_m": 5.5,
                    "max_polar_angle_rad": 1.55
                }
            },
            "lighting_environment": {
                "hdri_environment_map": "environments/tranquil_altar_temple_4k.hdr",
                "ambient_intensity": 0.28,
                "color_temperature_k": 2700,
                "directional_lights": [
                    {
                        "name": "Courtyard_Zen_Light",
                        "position": [2.5, 4.5, 3.0],
                        "intensity": 1.2,
                        "color_hex": "#FFE6CC",
                        "cast_shadows": True
                    }
                ],
                "point_lights": [
                    {
                        "name": "Altar_Red_Lantern_1",
                        "position": [-1.2, 2.4, -1.0],
                        "intensity": 1.0,
                        "color_hex": "#FF9933"
                    },
                    {
                        "name": "Altar_Red_Lantern_2",
                        "position": [1.2, 2.4, -1.0],
                        "intensity": 1.0,
                        "color_hex": "#FF9933"
                    }
                ]
            },
            "applied_material_mappings": [
                {
                    "component_name": "Sập Thờ Án Gian & Bàn Cơm",
                    "material_id": "MAT_GO_DO_PACHYLOBA",
                    "surface_area_m2": 12.4,
                    "finish_note": "Gỗ Gõ Đỏ Pachyloba đặc lõi không pha tạp, sơn lót chống nứt và hoàn thiện PU mờ 70%"
                },
                {
                    "component_name": "Hoành Phi - Cuốn Thư - Câu Đối",
                    "material_id": "MAT_HUONG_DA_GL",
                    "surface_area_m2": 6.8,
                    "finish_note": "Gỗ Hương Đá đanh vân tuyển, chạm khắc thếp vàng chữ Nho / chữ Quốc Ngữ truyền thống"
                },
                {
                    "component_name": "Vách Trang Trí CNC Chữ Vạn",
                    "material_id": "MAT_GO_DO_PACHYLOBA",
                    "surface_area_m2": 16.5,
                    "finish_note": "Gỗ Gõ Đỏ nguyên thanh ghép mộng thủ công truyền thống kiên cố"
                }
            ],
            "asset_3d_registry": {
                "glb_model_url": "models/spaces/space_04_altar_natural_wood.glb",
                "usdz_model_url": "models/spaces/space_04_altar_natural_wood.usdz",
                "polygon_count": 395000,
                "vertex_count": 221000,
                "draw_calls": 45,
                "texture_memory_mb": 124,
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True
            },
            "interactive_hotspots": [
                {
                    "hotspot_id": "HOTSPOT_ALTAR_GODO",
                    "title": "Bàn Thờ Gỗ Gõ Đỏ Pachyloba",
                    "position": [0.0, 1.2, -1.2],
                    "camera_focus": [0.0, 1.3, -0.3],
                    "linked_material_id": "MAT_GO_DO_PACHYLOBA",
                    "description": "Gỗ thịt tỷ trọng nặng đanh hạt, chống mối mọt vĩnh viễn, sắc đỏ tài lộc chuẩn thước Lỗ Ban số đẹp."
                },
                {
                    "hotspot_id": "HOTSPOT_HOANH_PHI_HUONG",
                    "title": "Hoành Phi Gỗ Hương Đá",
                    "position": [0.0, 2.5, -1.3],
                    "camera_focus": [0.0, 2.3, -0.2],
                    "linked_material_id": "MAT_HUONG_DA_GL",
                    "description": "Thớ vân xoắn tít dày dặn, tỏa hương thơm thảo mộc tự nhiên dịu nhẹ mang lại vượng khí bình an."
                }
            ]
        },

        # -------------------------------------------------------------------------
        # KHÔNG GIAN 5: VÁCH THÔNG TẦNG BIỆT THỰ PENTHOUSE
        # -------------------------------------------------------------------------
        {
            "space_id": "SPACE_3D_PENTHOUSE_ATRIUM",
            "space_code": "SP-05-PENTHOUSE-ATRIUM-WALL",
            "name": "Đại Cảnh Vách Thông Tầng Biệt Thự Penthouse",
            "space_type": "Vách Trang Trí Đại Thông Tầng",
            "style": "Ultra Luxury Monumental Architecture",
            "floor_area_m2": 42.0,
            "dimensions": {
                "length_m": 7.0,
                "width_m": 6.0,
                "height_m": 6.4
            },
            "description": "Công trình kiến trúc thông tầng hoành tráng cao 6.4m kết nối hai tầng Penthouse: Tâm điểm là mảng Đá Nung Kết Laurent Black Marble vân đối xứng Bookmatch phản chiếu ánh sáng vương giả, hai bên là lam sóng Gỗ Óc Chó tự nhiên uốn lượn kết hợp thanh nẹp nhôm mạ PVD Champagne và đèn chùm pha lê thả tầng ấn tượng.",
            "camera_configuration": {
                "fov_degrees": 65,
                "near_clipping": 0.2,
                "far_clipping": 120.0,
                "initial_position": [0.0, 2.2, 5.8],
                "target_look_at": [0.0, 3.2, -0.5],
                "orbit_limits": {
                    "min_distance_m": 2.0,
                    "max_distance_m": 12.0,
                    "max_polar_angle_rad": 1.70
                }
            },
            "lighting_environment": {
                "hdri_environment_map": "environments/penthouse_atrium_skyline_4k.hdr",
                "ambient_intensity": 0.45,
                "color_temperature_k": 3500,
                "directional_lights": [
                    {
                        "name": "Sky_Atrium_Sun",
                        "position": [0.0, 9.0, 2.0],
                        "intensity": 2.8,
                        "color_hex": "#FFF8F0",
                        "cast_shadows": True
                    }
                ],
                "point_lights": [
                    {
                        "name": "Crystal_Chandelier_Pendant",
                        "position": [0.0, 4.2, 0.5],
                        "intensity": 3.2,
                        "color_hex": "#FFE8CC"
                    },
                    {
                        "name": "Atrium_Base_Uplight",
                        "position": [0.0, 0.2, -0.2],
                        "intensity": 1.8,
                        "color_hex": "#FFAA44"
                    }
                ]
            },
            "applied_material_mappings": [
                {
                    "component_name": "Tâm Vách Đá Đối Xứng Bookmatch 6.4m",
                    "material_id": "MAT_SINTERED_LAURENT_BLACK",
                    "surface_area_m2": 26.5,
                    "finish_note": "Đá Nung Kết Laurent Black Marble vân vàng kim đối xứng ghép mí không lộ ron"
                },
                {
                    "component_name": "Lam Sóng Ốp Hai Bên Vách Thông Tầng",
                    "material_id": "MAT_WALNUT_US_FAS",
                    "surface_area_m2": 22.8,
                    "finish_note": "Gỗ Óc Chó tự nhiên soi rãnh nan sóng uốn lượn âm hưởng thiên nhiên"
                },
                {
                    "component_name": "Nẹp Chỉ Trang Trí & Khung Đỡ Tải Trọng",
                    "material_id": "MAT_ALU_ANODE_CHAMPAGNE",
                    "surface_area_m2": 6.2,
                    "finish_note": "Thanh nẹp kim loại mạ Anode Champagne bảo vệ mép nối và bắt sáng"
                }
            ],
            "asset_3d_registry": {
                "glb_model_url": "models/spaces/space_05_penthouse_atrium.glb",
                "usdz_model_url": "models/spaces/space_05_penthouse_atrium.usdz",
                "polygon_count": 425000,
                "vertex_count": 238000,
                "draw_calls": 48,
                "texture_memory_mb": 142,
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True
            },
            "interactive_hotspots": [
                {
                    "hotspot_id": "HOTSPOT_BOOKMATCH_LAURENT",
                    "title": "Đá Nung Kết Laurent Black 6.4m",
                    "position": [0.0, 3.2, -0.4],
                    "camera_focus": [0.0, 3.0, 1.8],
                    "linked_material_id": "MAT_SINTERED_LAURENT_BLACK",
                    "description": "Kỹ thuật thi công giàn giáo chịu lực cao cấp, căn chỉnh ghép mí vân đá đối xứng chuẩn xác milimet mang tầm vóc dinh thự thế giới."
                },
                {
                    "hotspot_id": "HOTSPOT_WALNUT_WAVE_PANEL",
                    "title": "Lam Sóng Óc Chó Tự Nhiên",
                    "position": [-2.2, 3.0, -0.3],
                    "camera_focus": [-1.6, 2.8, 1.2],
                    "linked_material_id": "MAT_WALNUT_US_FAS",
                    "description": "Gỗ Óc Chó FAS tự nhiên tạo hiệu ứng sóng âm tán xạ âm thanh vòm, chống dội âm cho sảnh thông tầng."
                }
            ]
        },

        # -------------------------------------------------------------------------
        # KHÔNG GIAN 6: VĂN PHÒNG CHỦ TỊCH TẬP ĐOÀN
        # -------------------------------------------------------------------------
        {
            "space_id": "SPACE_3D_CHAIRMAN_OFFICE",
            "space_code": "SP-06-CHAIRMAN-EXECUTIVE-OFFICE",
            "name": "Văn Phòng Làm Việc Chủ Tịch Tập Đoàn",
            "space_type": "Văn Phòng Lãnh Đạo Cao Cấp",
            "style": "Executive Modern Power Luxury",
            "floor_area_m2": 48.0,
            "dimensions": {
                "length_m": 8.0,
                "width_m": 6.0,
                "height_m": 3.3
            },
            "description": "Không gian làm việc lãnh đạo tối thượng toát lên quyền uy, minh triết và đẳng cấp dẫn đầu: Bàn chủ tịch dài 3.2m nguyên khối Gỗ Óc Chó Bắc Mỹ vát cạnh công thái học; Hệ tủ tài liệu phía sau kết hợp cánh kính xám khói, khung nhôm Anode và vách ốp Melamine An Cường MS 388 PL vân sần sâu sang trọng cùng bàn trà tiếp khách nguyên tấm.",
            "camera_configuration": {
                "fov_degrees": 55,
                "near_clipping": 0.1,
                "far_clipping": 85.0,
                "initial_position": [0.0, 1.45, 4.2],
                "target_look_at": [0.0, 1.15, -0.5],
                "orbit_limits": {
                    "min_distance_m": 1.2,
                    "max_distance_m": 7.5,
                    "max_polar_angle_rad": 1.60
                }
            },
            "lighting_environment": {
                "hdri_environment_map": "environments/executive_office_panoramic_4k.hdr",
                "ambient_intensity": 0.38,
                "color_temperature_k": 3800,
                "directional_lights": [
                    {
                        "name": "Office_Panoramic_Window",
                        "position": [4.0, 4.5, 2.0],
                        "intensity": 2.4,
                        "color_hex": "#F4F7FC",
                        "cast_shadows": True
                    }
                ],
                "point_lights": [
                    {
                        "name": "Desk_Linear_Architectural_Light",
                        "position": [0.0, 2.6, -0.3],
                        "intensity": 1.6,
                        "color_hex": "#FFF4E8"
                    },
                    {
                        "name": "Cabinet_Trophy_Spot",
                        "position": [-2.5, 2.2, -1.8],
                        "intensity": 1.2,
                        "color_hex": "#FFE6CC"
                    }
                ]
            },
            "applied_material_mappings": [
                {
                    "component_name": "Bàn Làm Việc Chủ Tịch 3.2m",
                    "material_id": "MAT_WALNUT_US_FAS",
                    "surface_area_m2": 9.5,
                    "finish_note": "Mặt bàn Gỗ Óc Chó FAS chọn chun nu tuyển tráng men sơn mờ cao cấp"
                },
                {
                    "component_name": "Vách Trang Trí Phía Sau Bàn Làm Việc",
                    "material_id": "MAT_AC_MELAMINE_MS388PL",
                    "surface_area_m2": 18.2,
                    "finish_note": "Melamine An Cường MS 388 PL sần sâu sang trọng kết hợp nẹp chỉ kim loại"
                },
                {
                    "component_name": "Hệ Cánh Kính Tủ Hồ Sơ & Trưng Bày Bằng Khen",
                    "material_id": "MAT_GLASS_SMOKE_GREY",
                    "surface_area_m2": 12.0,
                    "finish_note": "Kính cường lực xám khói sang trọng chống chói mắt"
                },
                {
                    "component_name": "Khung Nhôm Slim Định Hình",
                    "material_id": "MAT_ALU_ANODE_SLIM_BLACK",
                    "surface_area_m2": 3.6,
                    "finish_note": "Profile nhôm Slim Anode màu đen Carbon đẳng cấp"
                }
            ],
            "asset_3d_registry": {
                "glb_model_url": "models/spaces/space_06_chairman_office.glb",
                "usdz_model_url": "models/spaces/space_06_chairman_office.usdz",
                "polygon_count": 315000,
                "vertex_count": 172000,
                "draw_calls": 40,
                "texture_memory_mb": 102,
                "ios_quicklook_ready": True,
                "android_sceneviewer_ready": True,
                "webxr_ready": True
            },
            "interactive_hotspots": [
                {
                    "hotspot_id": "HOTSPOT_CHAIRMAN_DESK",
                    "title": "Bàn Chủ Tịch Gỗ Óc Chó Bắc Mỹ",
                    "position": [0.0, 0.78, -0.4],
                    "camera_focus": [0.0, 1.0, 0.6],
                    "linked_material_id": "MAT_WALNUT_US_FAS",
                    "description": "Được đục đẽo và vát cạnh tinh xảo từ thân gỗ Óc Chó nguyên khối, tích hợp sạc không dây và hộp điện âm bàn tiện nghi."
                },
                {
                    "hotspot_id": "HOTSPOT_WALL_MELAMINE_PL",
                    "title": "Vách Ốp Melamine MS 388 PL",
                    "position": [0.0, 2.0, -1.9],
                    "camera_focus": [0.0, 1.8, -0.6],
                    "linked_material_id": "MAT_AC_MELAMINE_MS388PL",
                    "description": "Vân sần sâu mang lại vẻ trầm mặc, đĩnh đạc, chống xước và dễ vệ sinh lau chùi."
                }
            ]
        }
    ]
    return spaces


def build_full_catalog():
    """Tổng hợp toàn bộ Danh mục chuẩn hóa PBR Material & 3D Asset Registry."""
    materials = generate_pbr_materials()
    spaces = generate_3d_template_spaces()

    # Thống kê tổng hợp
    categories_count = {}
    for mat in materials:
        cat = mat["category"]
        categories_count[cat] = categories_count.get(cat, 0) + 1

    catalog = {
        "metadata": {
            "catalog_title": "DANH MỤC CHUẨN HÓA PBR MATERIAL & 3D ASSET REGISTRY - PHÚ GIA HOME LUXURY",
            "phase": "Giai đoạn 2 - R02: PBR Material Catalog & 3D Asset Registry",
            "schema_version": "2.0.0",
            "standard": "glTF 2.0 PBR Metallic-Roughness Extension (KHR_materials_clearcoat, KHR_materials_ior, KHR_materials_transmission)",
            "ar_ecosystem": {
                "ios_quicklook": ".usdz (Universal Scene Description)",
                "android_sceneviewer": ".glb (glTF Binary Scene)",
                "webxr": "Three.js / Babylon.js WebGL/WebGPU Rendering Engine"
            },
            "brand_identity": BRAND_IDENTITY,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "generator_script": "tools/material_3d_catalog_builder.py"
        },
        "summary": {
            "total_pbr_materials": len(materials),
            "material_categories_breakdown": categories_count,
            "total_3d_template_spaces": len(spaces),
            "spaces_list": [s["name"] for s in spaces],
            "primary_suppliers": [
                "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)",
                "Ván An Cường (Phân phối: Lâm Giang / Cầu Vượt Hà Tĩnh)",
                "Chiến Acrylic Livas (Hà Tĩnh / Nghệ An)",
                "Đức Acrylic - Cánh Huỳnh ALD (Sơn Đức Lĩnh Inchem PU)",
                "Kính Việt Nhật (Hà Tĩnh)",
                "Vũ Cường - Gương Bỉ Dantalux Hà Tĩnh",
                "Đá / PVC Ceramic Hoàng Hà (Hà Tĩnh)",
                "Vicostone Việt Nam",
                "Phụ kiện Quốc Tâm (Tâm Quốc - Roxana Hà Tĩnh / Hafele / Blum)"
            ]
        },
        "pbr_materials": materials,
        "spaces_3d_registry": spaces
    }
    return catalog


def self_verify_catalog(catalog_data):
    """Kiểm tra tính toàn vẹn và tuân thủ kỷ luật thép của dữ liệu."""
    errors = []

    # 1. Kiểm tra Thương hiệu & Pháp lý Phú Gia
    brand = catalog_data.get("metadata", {}).get("brand_identity", {})
    if brand.get("hotline") != "0986.722.324":
        errors.append(f"SAI HOTLINE: {brand.get('hotline')}")
    if brand.get("tax_id") != "042203002931":
        errors.append(f"SAI MST: {brand.get('tax_id')}")
    if "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh" not in brand.get("factory_and_office_address", ""):
        errors.append(f"SAI ĐỊA CHỈ NHÀ MÁY: {brand.get('factory_and_office_address')}")
    if brand.get("facility_title") != "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia":
        errors.append(f"SAI DANH XƯNG NHÀ MÁY: {brand.get('facility_title')}")

    # Kiểm tra cấm các từ khóa vi phạm
    json_str = json.dumps(catalog_data, ensure_ascii=False)
    forbidden_terms = [
        "35 Ngô Đức Kế",
        "Hàm Nghi",
        "Trương Quốc Dung",  # Thiếu dấu
        "xưởng mộc",
        "0973.562.789",
        "0912.345.678",
        "0988.888.999",
        "0868.448.625",
        "096 832 99 92",
        "2500732386",
        "3002228888"
    ]
    for term in forbidden_terms:
        if term in json_str:
            errors.append(f"VI PHẠM KỶ LUẬT THÉP: Chứa từ khóa cấm '{term}'")

    # 2. Kiểm tra số lượng vật liệu và thông số PBR
    materials = catalog_data.get("pbr_materials", [])
    if len(materials) < 15:
        errors.append(f"Thiếu số lượng vật liệu: Hiện có {len(materials)} (yêu cầu >= 15)")

    required_pbr_keys = ["baseColorHex", "roughness", "metalness", "clearcoat", "ior", "normalScale"]
    for idx, mat in enumerate(materials):
        pbr = mat.get("pbr_parameters", {})
        for k in required_pbr_keys:
            if k not in pbr:
                errors.append(f"Vật liệu {mat.get('material_id')} thiếu trường PBR '{k}'")
        if not mat.get("standard_price_vnd") or mat["standard_price_vnd"] <= 0:
            errors.append(f"Vật liệu {mat.get('material_id')} thiếu hoặc sai đơn giá standard_price_vnd")
        if not mat.get("ar_metadata", {}).get("glb_asset_path"):
            errors.append(f"Vật liệu {mat.get('material_id')} thiếu glb_asset_path")

    # 3. Kiểm tra danh mục 6 không gian mẫu 3D
    spaces = catalog_data.get("spaces_3d_registry", [])
    if len(spaces) != 6:
        errors.append(f"Sai số lượng không gian 3D: Hiện có {len(spaces)} (yêu cầu đúng 6 không gian)")

    expected_space_ids = [
        "SPACE_3D_LIVING_ROOM_WALNUT",
        "SPACE_3D_KITCHEN_LIVAS_AC",
        "SPACE_3D_MASTER_BEDROOM_GLASS",
        "SPACE_3D_ALTAR_NATURAL_WOOD",
        "SPACE_3D_PENTHOUSE_ATRIUM",
        "SPACE_3D_CHAIRMAN_OFFICE"
    ]
    actual_space_ids = [s.get("space_id") for s in spaces]
    for expected_id in expected_space_ids:
        if expected_id not in actual_space_ids:
            errors.append(f"Thiếu không gian mẫu bắt buộc: {expected_id}")

    for sp in spaces:
        if not sp.get("camera_configuration"):
            errors.append(f"Không gian {sp.get('space_id')} thiếu camera_configuration")
        if not sp.get("lighting_environment"):
            errors.append(f"Không gian {sp.get('space_id')} thiếu lighting_environment")
        if len(sp.get("applied_material_mappings", [])) < 3:
            errors.append(f"Không gian {sp.get('space_id')} có ít hơn 3 vật liệu mapping")
        if len(sp.get("interactive_hotspots", [])) < 2:
            errors.append(f"Không gian {sp.get('space_id')} có ít hơn 2 hotspots")

    return errors


def main():
    print("================================================================================")
    print("KHỞI TẠO TIẾN TRÌNH: MATERIAL 3D & PBR CATALOG BUILDER")
    print("ĐƠN VỊ: PG HOME LUXURY — CÔNG TY CP PHÚ GIA VIỆT NAM")
    print("NHÀ MÁY: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh")
    print("HOTLINE: 0986.722.324 | MST: 042203002931")
    print("================================================================================")

    # 1. Tạo catalog dữ liệu
    catalog = build_full_catalog()

    # 2. Tự kiểm toán (Self-Audit & Verification)
    verification_errors = self_verify_catalog(catalog)
    if verification_errors:
        print("[LỖI KIỂM TOÁN DỮ LIỆU]:")
        for err in verification_errors:
            print(f" - {err}")
        sys.exit(1)

    print("[KIỂM TOÁN CHUẨN THƯƠNG HIỆU & PBR METADATA]: ĐẠT 100% TIÊU CHUẨN KỶ LUẬT THÉP")

    # 3. Ghi file JSON output
    os.makedirs(os.path.dirname(CATALOG_OUTPUT_PATH), exist_ok=True)
    with open(CATALOG_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    file_size_kb = os.path.getsize(CATALOG_OUTPUT_PATH) / 1024
    print(f"[XUẤT BẢN THÀNH CÔNG]: {CATALOG_OUTPUT_PATH}")
    print(f" - Kích thước file: {file_size_kb:.2f} KB")
    print(f" - Tổng số vật liệu PBR chi tiết: {len(catalog['pbr_materials'])}")
    print(f" - Tổng số không gian 3D mẫu: {len(catalog['spaces_3d_registry'])}")
    print(" - Phân loại vật liệu:")
    for cat, count in catalog["summary"]["material_categories_breakdown"].items():
        print(f"   + {cat}: {count} vật liệu")
    print(" - Danh sách 6 không gian mẫu 3D:")
    for idx, name in enumerate(catalog["summary"]["spaces_list"], 1):
        print(f"   {idx}. {name}")
    print("================================================================================")

if __name__ == "__main__":
    main()
