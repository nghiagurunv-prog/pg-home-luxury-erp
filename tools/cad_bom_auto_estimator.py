"""
===================================================================================
HỆ THỐNG QUẢN TRỊ & TỰ ĐỘNG HÓA SẢN XUẤT NỘI THẤT PHÚ GIA (PG HOME LUXURY)
MODULE: CAD BOM AUTO ESTIMATOR & 3-TIER INSTANT QUOTATION ENGINE (GIAI ĐOẠN 2 - R03)
===================================================================================
Quy chuẩn pháp lý & Thương hiệu:
- Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
  (Thương hiệu: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY)
- Địa chỉ ĐKKD: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh
- Tổ hợp Văn phòng & Nhà máy Sản xuất: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
- Mã số thuế / MST: 042203002931 | Hotline: 0986.722.324
===================================================================================
Chức năng kỹ thuật:
1. Parser AutoCAD .dxf ASCII thuần (tương thích cả ezdxf nếu có) hỗ trợ đọc các thực thể:
   LWPOLYLINE, POLYLINE, INSERT, TEXT, MTEXT theo các Layer chuẩn:
   - PG_VACH: Vách thùng, hồi tủ, đợt, nóc, đáy, vách trang trí
   - PG_CANH: Cánh tủ, mặt ngăn kéo
   - PG_HAU:  Hậu tủ (6mm, 9mm)
   - PG_PK:   Phụ kiện cơ khí, bản lề, ray trượt, tay nâng, tay nắm
2. Parser file xuất Bazis Mebelshik (.xml và .csv).
3. Thuật toán kỹ thuật chuẩn sản xuất:
   - Diện tích tấm (m2), số tấm tiêu chuẩn (1220 x 2440 mm = 2.9768 m2), hao hụt cắt CNC Nesting.
   - Chiều dài chỉ dán cạnh PVC (md, tự động cộng hao hụt 12%).
   - Công thức nội suy phụ kiện bản lề giảm chấn theo chiều cao cánh H:
     * H <= 900 mm       -> 2 bản lề/cánh
     * 900 < H <= 1600 mm -> 3 bản lề/cánh
     * 1600 < H <= 2200 mm-> 4 bản lề/cánh
     * H > 2200 mm       -> 5 bản lề/cánh
4. Tự động sinh Báo giá 3 Phương án (3-Tier Instant Quote) trong < 3 giây:
   - Phương án 1 (Standard): MDF Lõi Xanh Chống Ẩm Phủ Melamine An Cường.
   - Phương án 2 (Luxury Modern): Thùng MDF Chống Ẩm An Cường + Cánh Acrylic No-line Livas / Cánh Kính Khung Nhôm Anode.
   - Phương án 3 (Bespoke Signature): Gỗ Óc Chó Bắc Mỹ FAS (Walnut) + Phụ kiện Blum/Hafele cao cấp.
5. Self-test trên 3 bản vẽ mẫu thực tế:
   - Dự án 1: Tủ bếp chữ L (L-Shaped Kitchen Cabinet)
   - Dự án 2: Tủ áo cánh kính kịch trần (Full-height Glass Wardrobe)
   - Dự án 3: Hệ vách Tivi phòng khách & Tủ rượu (Living Room Feature TV Wall & Wine Cabinet)
===================================================================================
"""

import os
import sys
import json
try:
    import pg_fast_io as _pg_fast_io
    json = _pg_fast_io.json
except Exception:
    pass
import math
import time
import re
from typing import List, Dict, Any, Tuple, Optional

# Thử import ezdxf nếu môi trường có sẵn, nếu không sẽ dùng Pure DXF ASCII Parser tích hợp
try:
    import ezdxf
    HAS_EZDXF = True
except ImportError:
    HAS_EZDXF = False

# Hằng số chuẩn kỹ thuật Phú Gia
SHEET_WIDTH_MM = 1220.0
SHEET_LENGTH_MM = 2440.0
SHEET_AREA_M2 = 2.9768  # 1.22 * 2.44 m2
PVC_WASTAGE_RATE = 0.12  # Hao hụt nẹp chỉ dán cạnh PVC 12%
CNC_NESTING_WASTAGE_RATE = 0.15  # Hao hụt cắt ván công nghiệp 15%
BACKING_WASTAGE_RATE = 0.10  # Hao hụt ván hậu 10%

# Thông tin pháp lý & thương hiệu chuẩn duy nhất Phú Gia
LEGAL_BRAND_INFO = {
    "don_vi_phap_ly": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
    "thuong_hieu_cong_ty": "CÔNG TY CP PHÚ GIA VIỆT NAM",
    "thuong_hieu_thuong_mai": "PG HOME LUXURY",
    "ma_so_thue_mst": "042203002931",
    "ma_so_dkkd": "042203002931",
    "ngay_dang_ky_lan_dau": "13/01/2025",
    "dai_dien_phap_luat": "Nguyễn Trọng Nghĩa",
    "dia_chi_dkkd": "Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh",
    "to_hop_van_phong_nha_may": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
    "danh_xung_san_xuat": "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia",
    "hotline": "0986.722.324"
}

# Layers chuẩn AutoCAD Phú Gia
RECOGNIZED_LAYERS = {
    "PG_VACH": "Vách thùng, hồi tủ, đợt, nóc, đáy, vách trang trí",
    "PG_CANH": "Cánh tủ, mặt ngăn kéo",
    "PG_HAU": "Hậu tủ 6mm / 9mm",
    "PG_PK": "Phụ kiện cơ khí, bản lề, ray trượt, tay nâng, tay nắm"
}


# ===================================================================================
# 1. PURE ASCII DXF PARSER (KHÔNG PHỤ THUỘC THƯ VIỆN BÊN NGOÀI)
# ===================================================================================

class DxfAsciiParser:
    """Parser DXF định dạng ASCII thuần túy đọc các đối tượng trong SECTION ENTITIES."""

    def __init__(self):
        self.entities = []

    def parse_string(self, dxf_content: str) -> List[Dict[str, Any]]:
        """Phân tích nội dung DXF từ chuỗi văn bản."""
        lines = [line.strip() for line in dxf_content.splitlines()]
        return self._parse_lines(lines)

    def parse_file(self, file_path: str) -> List[Dict[str, Any]]:
        """Phân tích file DXF từ đường dẫn đĩa cứng."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Không tìm thấy file DXF: {file_path}")
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = [line.strip() for line in f.readlines()]
        return self._parse_lines(lines)

    def _parse_lines(self, lines: List[str]) -> List[Dict[str, Any]]:
        # Chuyển đổi lines thành danh sách các cặp (code, value)
        pairs: List[Tuple[int, str]] = []
        i = 0
        n = len(lines)
        while i < n - 1:
            try:
                code = int(lines[i])
                val = lines[i + 1]
                pairs.append((code, val))
                i += 2
            except ValueError:
                i += 1

        # Tìm phạm vi SECTION ENTITIES
        in_entities = False
        parsed_entities = []
        current_entity: Optional[Dict[str, Any]] = None

        idx = 0
        total_pairs = len(pairs)

        while idx < total_pairs:
            code, val = pairs[idx]

            if code == 0 and val.upper() == "SECTION":
                if idx + 1 < total_pairs and pairs[idx + 1][0] == 2 and pairs[idx + 1][1].upper() == "ENTITIES":
                    in_entities = True
                    idx += 2
                    continue

            if in_entities and code == 0 and val.upper() == "ENDSEC":
                if current_entity:
                    parsed_entities.append(current_entity)
                    current_entity = None
                in_entities = False
                break

            if in_entities:
                if code == 0:
                    if current_entity:
                        parsed_entities.append(current_entity)
                    current_entity = {
                        "type": val.upper(),
                        "layer": "0",
                        "points": [],
                        "properties": {},
                        "text": "",
                        "block_name": ""
                    }
                elif current_entity is not None:
                    ent_type = current_entity["type"]

                    if code == 8:
                        current_entity["layer"] = val
                    elif code == 2:
                        current_entity["block_name"] = val
                        current_entity["properties"]["name"] = val
                    elif code in (1, 3):
                        if ent_type in ("TEXT", "MTEXT"):
                            current_entity["text"] += val
                    elif code == 70:
                        try:
                            current_entity["properties"]["flags"] = int(val)
                        except ValueError:
                            pass
                    elif code == 10:
                        try:
                            x_val = float(val)
                            # Kiểm tra xem cặp tiếp theo có phải code 20 không
                            y_val = 0.0
                            if idx + 1 < total_pairs and pairs[idx + 1][0] == 20:
                                y_val = float(pairs[idx + 1][1])
                            current_entity["points"].append((x_val, y_val))
                        except ValueError:
                            pass
                    elif code == 41:
                        try:
                            current_entity["properties"]["scale_x"] = float(val)
                        except ValueError:
                            pass
                    elif code == 42:
                        try:
                            current_entity["properties"]["scale_y"] = float(val)
                        except ValueError:
                            pass
                    elif code == 50:
                        try:
                            current_entity["properties"]["rotation"] = float(val)
                        except ValueError:
                            pass

            idx += 1

        if current_entity:
            parsed_entities.append(current_entity)

        self.entities = parsed_entities
        return parsed_entities


# ===================================================================================
# 2. BAZIS MEBELSHIK PARSER (.XML & .CSV)
# ===================================================================================

class BazisParser:
    """Parser file dữ liệu bóc tách từ phần mềm chuyên ngành nội thất Bazis Mebelshik."""

    @staticmethod
    def parse_csv(csv_content: str) -> List[Dict[str, Any]]:
        """Phân tích file CSV xuất từ Bazis."""
        lines = [line.strip() for line in csv_content.splitlines() if line.strip()]
        if not lines:
            return []

        # Tách header
        delimiter = ";" if ";" in lines[0] else ","
        headers = [h.strip().lower() for h in lines[0].split(delimiter)]

        parts = []
        for line in lines[1:]:
            cols = [c.strip() for c in line.split(delimiter)]
            if len(cols) < 3:
                continue
            row = dict(zip(headers, cols))

            # Trích xuất kích thước và số lượng
            name = row.get("tên", row.get("ten", row.get("name", row.get("chi tiết", "Chi tiết"))))
            length = BazisParser._to_float(row.get("dài", row.get("dai", row.get("length", "0"))))
            width = BazisParser._to_float(row.get("rộng", row.get("rong", row.get("width", "0"))))
            thickness = BazisParser._to_float(row.get("dày", row.get("day", row.get("thickness", "17.5"))))
            qty = int(BazisParser._to_float(row.get("số lượng", row.get("so luong", row.get("count", row.get("qty", "1"))))))
            material = row.get("vật liệu", row.get("vat lieu", row.get("material", "MDF Chống Ẩm An Cường")))

            layer = BazisParser._detect_layer(name)

            parts.append({
                "name": name,
                "layer": layer,
                "length": max(length, width),
                "width": min(length, width),
                "thickness": thickness if thickness > 0 else 17.5,
                "quantity": max(1, qty),
                "material": material
            })

        return parts

    @staticmethod
    def parse_xml(xml_content: str) -> List[Dict[str, Any]]:
        """Phân tích file XML xuất từ Bazis Mebelshik dạng cây thư mục."""
        parts = []
        # Regex trích xuất các khối thẻ <Panel>, <Part>, hoặc <Detail>
        item_blocks = re.findall(r"<(Panel|Part|Detail|Item)[\s>](.*?)</\1>", xml_content, re.DOTALL | re.IGNORECASE)

        for _, block in item_blocks:
            name = BazisParser._extract_xml_tag(block, "Name") or BazisParser._extract_xml_tag(block, "Title") or "Chi tiết"
            length = BazisParser._to_float(BazisParser._extract_xml_tag(block, "Length") or BazisParser._extract_xml_tag(block, "LengthX") or "0")
            width = BazisParser._to_float(BazisParser._extract_xml_tag(block, "Width") or BazisParser._extract_xml_tag(block, "WidthY") or "0")
            thickness = BazisParser._to_float(BazisParser._extract_xml_tag(block, "Thickness") or BazisParser._extract_xml_tag(block, "ThicknessZ") or "17.5")
            qty = int(BazisParser._to_float(BazisParser._extract_xml_tag(block, "Quantity") or BazisParser._extract_xml_tag(block, "Count") or "1"))
            material = BazisParser._extract_xml_tag(block, "Material") or "MDF Chống Ẩm An Cường"

            layer = BazisParser._detect_layer(name)

            parts.append({
                "name": name,
                "layer": layer,
                "length": max(length, width),
                "width": min(length, width),
                "thickness": thickness if thickness > 0 else 17.5,
                "quantity": max(1, qty),
                "material": material
            })

        return parts

    @staticmethod
    def _extract_xml_tag(block: str, tag: str) -> Optional[str]:
        match = re.search(rf"<{tag}>(.*?)</{tag}>", block, re.IGNORECASE | re.DOTALL)
        return match.group(1).strip() if match else None

    @staticmethod
    def _to_float(val: str) -> float:
        try:
            val_clean = re.sub(r"[^\d.]", "", val.replace(",", "."))
            return float(val_clean) if val_clean else 0.0
        except ValueError:
            return 0.0

    @staticmethod
    def _detect_layer(name: str) -> str:
        name_lower = name.lower()
        if any(w in name_lower for w in ["cánh", "canh", "door", "front", "mặt ngăn kéo"]):
            return "PG_CANH"
        elif any(w in name_lower for w in ["hậu", "hau", "back", "đáy ngăn kéo"]):
            return "PG_HAU"
        elif any(w in name_lower for w in ["bản lề", "ban le", "ray", "tay nắm", "tay nang", "khớp"]):
            return "PG_PK"
        else:
            return "PG_VACH"


# ===================================================================================
# 3. THUẬT TOÁN KỸ THUẬT NỘI SUY BẢN LỀ & BÓC TÁCH VẬT TƯ (BOM ENGINE)
# ===================================================================================

class CadBomEstimator:
    """Engine bóc tách khối lượng (BOM) & dự toán kỹ thuật đa tầng."""

    @staticmethod
    def calculate_hinges_for_door(height_mm: float) -> int:
        """
        Công thức nội suy bản lề giảm chấn tự động chuẩn Phú Gia theo chiều cao cánh H:
        - H <= 900 mm:        2 bản lề/cánh
        - 900 < H <= 1600 mm: 3 bản lề/cánh
        - 1600 < H <= 2200 mm:4 bản lề/cánh
        - H > 2200 mm:        5 bản lề/cánh
        """
        if height_mm <= 900.0:
            return 2
        elif height_mm <= 1600.0:
            return 3
        elif height_mm <= 2200.0:
            return 4
        else:
            return 5

    @classmethod
    def process_cad_entities(cls, entities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Xử lý danh sách entities từ CAD thành danh sách chi tiết có đầy đủ thông số kỹ thuật."""
        panels = []
        hardware_items = []

        for ent in entities:
            layer = ent.get("layer", "0")
            ent_type = ent.get("type", "")

            # Chuẩn hóa layer
            matched_layer = "PG_VACH"
            for k in RECOGNIZED_LAYERS.keys():
                if k.lower() in layer.lower():
                    matched_layer = k
                    break

            if ent_type in ("LWPOLYLINE", "POLYLINE"):
                pts = ent.get("points", [])
                if len(pts) >= 2:
                    xs = [p[0] for p in pts]
                    ys = [p[1] for p in pts]
                    dx = max(xs) - min(xs)
                    dy = max(ys) - min(ys)
                    length = max(dx, dy)
                    width = min(dx, dy)

                    # Bỏ qua đối tượng quá nhỏ (nhiễu điểm)
                    if length < 50.0 or width < 50.0:
                        continue

                    # Tính chu vi dán nẹp cơ sở (mm)
                    # Cánh dán 4 cạnh, vách thùng dán 2 cạnh lộ hoặc chu vi
                    if matched_layer == "PG_CANH":
                        base_perimeter_mm = 2.0 * (length + width)
                    elif matched_layer == "PG_VACH":
                        base_perimeter_mm = 2.0 * length + width  # 1 cạnh dài + 2 cạnh rộng dán nẹp
                    else:  # PG_HAU thường không dán nẹp hoặc chỉ dán mép lộ
                        base_perimeter_mm = 0.0

                    base_pvc_md = base_perimeter_mm / 1000.0
                    pvc_with_wastage = base_pvc_md * (1.0 + PVC_WASTAGE_RATE)

                    area_single_m2 = (length * width) / 1_000_000.0

                    hinges_per_piece = 0
                    if matched_layer == "PG_CANH":
                        hinges_per_piece = cls.calculate_hinges_for_door(length)

                    panels.append({
                        "name": f"Tấm {matched_layer} ({int(length)}x{int(width)}mm)",
                        "layer": matched_layer,
                        "length_mm": round(length, 1),
                        "width_mm": round(width, 1),
                        "thickness_mm": 17.5 if matched_layer != "PG_HAU" else 9.0,
                        "quantity": 1,
                        "area_m2_single": round(area_single_m2, 4),
                        "area_m2_total": round(area_single_m2, 4),
                        "pvc_edge_base_md": round(base_pvc_md, 3),
                        "pvc_edge_final_md": round(pvc_with_wastage, 3),
                        "hinges_per_piece": hinges_per_piece,
                        "hinges_total": hinges_per_piece
                    })

            elif ent_type == "INSERT":
                blk = ent.get("block_name", "").upper()
                name_clean = ent.get("properties", {}).get("name", blk)
                hardware_items.append({
                    "block_name": blk,
                    "name": name_clean or "Phụ kiện cơ khí",
                    "layer": matched_layer,
                    "quantity": 1
                })

            elif ent_type in ("TEXT", "MTEXT"):
                txt = ent.get("text", "").strip()
                # Phân tích text nếu chứa kích thước dạng 800x600 hoặc phụ kiện
                dim_match = re.search(r"(\d{2,4})\s*[xX*]\s*(\d{2,4})", txt)
                if dim_match:
                    dim1 = float(dim_match.group(1))
                    dim2 = float(dim_match.group(2))
                    length = max(dim1, dim2)
                    width = min(dim1, dim2)
                    area_m2 = (length * width) / 1_000_000.0

                    hinges = cls.calculate_hinges_for_door(length) if matched_layer == "PG_CANH" else 0
                    base_pvc = (2 * (length + width) / 1000.0) if matched_layer == "PG_CANH" else (length / 1000.0)

                    panels.append({
                        "name": f"Text: {txt}",
                        "layer": matched_layer,
                        "length_mm": round(length, 1),
                        "width_mm": round(width, 1),
                        "thickness_mm": 17.5 if matched_layer != "PG_HAU" else 9.0,
                        "quantity": 1,
                        "area_m2_single": round(area_m2, 4),
                        "area_m2_total": round(area_m2, 4),
                        "pvc_edge_base_md": round(base_pvc, 3),
                        "pvc_edge_final_md": round(base_pvc * (1 + PVC_WASTAGE_RATE), 3),
                        "hinges_per_piece": hinges,
                        "hinges_total": hinges
                    })

        return cls.summarize_bom(panels, hardware_items)

    @classmethod
    def summarize_bom(cls, panels: List[Dict[str, Any]], extra_hardware: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Tổng hợp toàn bộ chỉ số vật tư từ danh sách tấm và phụ kiện."""
        if extra_hardware is None:
            extra_hardware = []

        # Phân loại diện tích theo Layer
        carcass_panels = [p for p in panels if p["layer"] == "PG_VACH"]
        door_panels = [p for p in panels if p["layer"] == "PG_CANH"]
        back_panels = [p for p in panels if p["layer"] == "PG_HAU"]

        carcass_area = sum(p["area_m2_total"] for p in carcass_panels)
        door_area = sum(p["area_m2_total"] for p in door_panels)
        back_area = sum(p["area_m2_total"] for p in back_panels)
        total_panel_area = carcass_area + door_area + back_area

        # Tổng mét dài chỉ dán cạnh PVC (đã gồm 12% hao hụt)
        total_pvc_base_md = sum(p["pvc_edge_base_md"] for p in panels)
        total_pvc_final_md = sum(p["pvc_edge_final_md"] for p in panels)

        # Tính toán số tấm tiêu chuẩn (1220 x 2440 mm = 2.9768 m2)
        # 17.5mm / 18mm: Thùng + Cánh
        structural_area_gross = (carcass_area + door_area) * (1.0 + CNC_NESTING_WASTAGE_RATE)
        sheets_18mm_exact = structural_area_gross / SHEET_AREA_M2
        sheets_18mm_ordered = math.ceil(sheets_18mm_exact)

        # 6mm / 9mm: Hậu tủ
        back_area_gross = back_area * (1.0 + BACKING_WASTAGE_RATE)
        sheets_9mm_exact = back_area_gross / SHEET_AREA_M2
        sheets_9mm_ordered = math.ceil(sheets_9mm_exact) if back_area > 0 else 0

        # Tổng hợp bản lề giảm chấn theo nội suy chiều cao cánh
        total_hinges = sum(p["hinges_total"] for p in door_panels)

        # Tổng hợp phụ kiện bổ trợ
        hardware_summary = {
            "ban_le_giam_chan_tong": total_hinges,
            "ray_truot_giam_chan_bo": 0,
            "tay_nang_blum_bo": 0,
            "tay_nam_cai": len(door_panels),
            "den_led_profile_md": round(total_pvc_final_md * 0.15, 1)  # Ước tính chiều dài LED trang trí
        }

        for hw in extra_hardware:
            bname = hw.get("block_name", "").upper()
            if "RAY" in bname:
                hardware_summary["ray_truot_giam_chan_bo"] += hw.get("quantity", 1)
            elif "TAY_NANG" in bname or "BLUM" in bname:
                hardware_summary["tay_nang_blum_bo"] += hw.get("quantity", 1)
            elif "BAN_LE" in bname:
                hardware_summary["ban_le_giam_chan_tong"] += hw.get("quantity", 1)

        return {
            "panels_count": len(panels),
            "panels_detail": panels,
            "metrics": {
                "carcass_area_m2": round(carcass_area, 3),
                "door_area_m2": round(door_area, 3),
                "back_area_m2": round(back_area, 3),
                "total_panel_area_m2": round(total_panel_area, 3),
                "pvc_edge_base_md": round(total_pvc_base_md, 2),
                "pvc_edge_with_12pct_wastage_md": round(total_pvc_final_md, 2),
                "standard_sheets": {
                    "sheet_dimension_mm": "1220 x 2440",
                    "sheet_area_m2": SHEET_AREA_M2,
                    "board_18mm_carcass_doors": {
                        "net_area_m2": round(carcass_area + door_area, 3),
                        "cnc_loss_pct": round(CNC_NESTING_WASTAGE_RATE * 100, 1),
                        "sheets_exact": round(sheets_18mm_exact, 2),
                        "sheets_ordered": sheets_18mm_ordered
                    },
                    "board_9mm_backing": {
                        "net_area_m2": round(back_area, 3),
                        "loss_pct": round(BACKING_WASTAGE_RATE * 100, 1),
                        "sheets_exact": round(sheets_9mm_exact, 2),
                        "sheets_ordered": sheets_9mm_ordered
                    }
                },
                "hardware": hardware_summary
            }
        }


# ===================================================================================
# 4. 3-TIER INSTANT QUOTATION ENGINE (< 3 GIÂY)
# ===================================================================================

class ThreeTierQuoteEngine:
    """Tự động lập dự toán báo giá 3 phương án vật tư từ BOM."""

    @staticmethod
    def generate_quote(project_name: str, bom: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.perf_counter()
        metrics = bom["metrics"]

        carcass_m2 = metrics["carcass_area_m2"]
        door_m2 = metrics["door_area_m2"]
        back_m2 = metrics["back_area_m2"]
        pvc_md = metrics["pvc_edge_with_12pct_wastage_md"]
        hinges = metrics["hardware"]["ban_le_giam_chan_tong"]
        drawers = max(2, metrics["hardware"]["ray_truot_giam_chan_bo"])
        blum_lifts = metrics["hardware"]["tay_nang_blum_bo"]
        led_md = metrics["hardware"]["den_led_profile_md"]

        # -------------------------------------------------------------
        # TIER 1: STANDARD
        # Thùng + Cánh: MDF Lõi Xanh Chống Ẩm Phủ Melamine An Cường
        # Phụ kiện: Bản lề giảm chấn Inox 304 tiêu chuẩn Ivan/DTC
        # -------------------------------------------------------------
        t1_carcass = carcass_m2 * 390_000
        t1_doors = door_m2 * 430_000
        t1_back = back_m2 * 220_000
        t1_pvc = pvc_md * 8_500
        t1_hinges = hinges * 35_000  # Bản lề Inox 304 Ivan/DTC
        t1_drawers = drawers * 110_000  # Ray bi 3 tầng giảm chấn
        t1_labor_cnc = (carcass_m2 + door_m2 + back_m2) * 180_000  # Cắt CNC Nesting & dán cạnh PUR
        t1_assembly_install = (carcass_m2 + door_m2) * 160_000  # Bọc PE foam, vận chuyển, lắp dựng

        tier1_total = (t1_carcass + t1_doors + t1_back + t1_pvc +
                       t1_hinges + t1_drawers + t1_labor_cnc + t1_assembly_install)

        tier1_breakdown = {
            "tier_id": "TIER_1_STANDARD",
            "tier_name": "Phương án 1 (Standard) - MDF Lõi Xanh Chống Ẩm Phủ Melamine An Cường",
            "vat_lieu_thung": "Gỗ MDF lõi xanh chống ẩm An Cường 17.5mm phủ Melamine 2 mặt chống ẩm",
            "vat_lieu_canh": "Gỗ MDF lõi xanh chống ẩm An Cường phủ Melamine đồng màu, nẹp chỉ dán cạnh máy tự động",
            "vat_lieu_hau": "MDF lõi xanh chống ẩm 6mm/9mm phủ Melamine 2 mặt",
            "phu_kien_co_khi": "Bản lề giảm chấn Inox 304 tiêu chuẩn Ivan/DTC, ray bi giảm chấn 3 tầng sơn tĩnh điện",
            "chi_tiet_chi_phi": {
                "go_thung_mdf_an_cuong_vnd": round(t1_carcass),
                "go_canh_mdf_an_cuong_vnd": round(t1_doors),
                "van_hau_mdf_vnd": round(t1_back),
                "chi_nep_pvc_dast_canh_vnd": round(t1_pvc),
                "ban_le_giam_chan_vnd": round(t1_hinges),
                "ray_truot_ngan_keo_vnd": round(t1_drawers),
                "gia_cong_cnc_dan_canh_vnd": round(t1_labor_cnc),
                "van_chuyen_lap_dat_vnd": round(t1_assembly_install)
            },
            "tong_gia_tri_chua_vat_vnd": round(tier1_total),
            "thoi_gian_bao_hanh": "24 tháng bảo hành chính hãng xưởng Phú Gia"
        }

        # -------------------------------------------------------------
        # TIER 2: LUXURY MODERN
        # Thùng: MDF Lõi Xanh Chống Ẩm An Cường
        # Cánh: Cánh Acrylic Bóng Gương Không Đường Line Livas / Cánh Kính Khung Nhôm Anode
        # Phụ kiện: Bản lề giảm chấn Hafele/Eurogold, ray âm giảm chấn, LED định hình
        # -------------------------------------------------------------
        t2_carcass = carcass_m2 * 450_000
        t2_doors = door_m2 * 1_450_000  # Cánh Acrylic No-line Livas / Cánh kính nhôm Anode nhập khẩu
        t2_back = back_m2 * 280_000  # Hậu Alu Alcorest 3mm hoặc MDF 9mm 2 mặt
        t2_pvc = pvc_md * 12_000  # Nẹp Acrylic / viền Anode
        t2_hinges = hinges * 95_000  # Bản lề Hafele Metalla / Eurogold
        t2_drawers = drawers * 320_000  # Ray âm giảm chấn mở toàn phần Hafele
        t2_led = led_md * 220_000  # Đèn LED thanh nhôm profile cảm ứng rãnh âm 12V
        t2_labor_cnc = (carcass_m2 + door_m2 + back_m2) * 260_000
        t2_assembly_install = (carcass_m2 + door_m2) * 240_000

        tier2_total = (t2_carcass + t2_doors + t2_back + t2_pvc +
                       t2_hinges + t2_drawers + t2_led + t2_labor_cnc + t2_assembly_install)

        tier2_breakdown = {
            "tier_id": "TIER_2_LUXURY_MODERN",
            "tier_name": "Phương án 2 (Luxury Modern) - Thùng MDF An Cường + Cánh Acrylic No-line Livas / Cánh Kính Khung Nhôm Anode",
            "vat_lieu_thung": "Gỗ MDF lõi xanh chống ẩm An Cường 17.5mm phủ Melamine cao cấp chống trầy",
            "vat_lieu_canh": "Cánh Acrylic bóng gương không đường line (Livas No-line edge) kết hợp Cánh kính khung nhôm Anode mạ điện phân cao cấp",
            "vat_lieu_hau": "Alu Alcorest chống ẩm tuyệt đối hoặc MDF lõi xanh 9mm Melamine 2 mặt",
            "phu_kien_co_khi": "Bản lề giảm chấn Hafele Metalla / Eurogold Inox 304, ray trượt âm mở toàn phần giảm chấn Hafele, đèn LED cảm ứng vẫy tay",
            "chi_tiet_chi_phi": {
                "go_thung_mdf_an_cuong_vnd": round(t2_carcass),
                "canh_acrylic_noline_kinh_anode_vnd": round(t2_doors),
                "van_hau_alu_mdf9mm_vnd": round(t2_back),
                "chi_nep_va_khung_vien_vnd": round(t2_pvc),
                "ban_le_giam_chan_hafele_vnd": round(t2_hinges),
                "ray_am_giam_chan_hafele_vnd": round(t2_drawers),
                "he_thong_led_thanh_nhom_vnd": round(t2_led),
                "gia_cong_cnc_chuyen_dung_vnd": round(t2_labor_cnc),
                "van_chuyen_lap_dat_tinh_chinh_vnd": round(t2_assembly_install)
            },
            "tong_gia_tri_chua_vat_vnd": round(tier2_total),
            "thoi_gian_bao_hanh": "36 tháng bảo hành & bảo trì trọn đời"
        }

        # -------------------------------------------------------------
        # TIER 3: BESPOKE SIGNATURE
        # Thùng + Cánh: Gỗ Óc Chó Bắc Mỹ FAS (North American Walnut) tự nhiên + Plywood Veneer Óc Chó
        # Phụ kiện: Blum (Áo) & Hafele (Đức) cao cấp (Blum Clip Top Blumotion, Blum Aventos HF, Blum Tandembox)
        # -------------------------------------------------------------
        t3_carcass = carcass_m2 * 2_800_000  # Plywood phủ Veneer Óc Chó tự nhiên ghép vân đối xứng
        t3_doors = door_m2 * 4_200_000  # Gỗ Óc Chó Bắc Mỹ FAS tuyển chọn nguyên khối kết hợp kính xám khói
        t3_back = back_m2 * 680_000  # Plywood chống nước phủ veneer óc chó 9mm 2 mặt
        t3_pvc = pvc_md * 35_000  # Nẹp gỗ tự nhiên óc chó sơn hoàn thiện Inchem
        t3_hinges = hinges * 175_000  # Bản lề Blum Clip Top Blumotion tích hợp giảm chấn (Made in Austria)
        t3_drawers = drawers * 1_250_000  # Hệ ray hộp Blum Tandembox / Legrabox tải trọng lớn
        t3_blum_lift = max(1, blum_lifts) * 4_200_000  # Tay nâng đôi Blum Aventos HF chính hãng
        t3_led = led_md * 420_000  # Hệ thống LED Hafele Loox5 cảm biến thông minh
        t3_labor_bespoke = (carcass_m2 + door_m2 + back_m2) * 850_000  # Gia công mộc thủ công, sơn Inchem 7 lớp
        t3_assembly_install = (carcass_m2 + door_m2) * 550_000

        tier3_total = (t3_carcass + t3_doors + t3_back + t3_pvc +
                       t3_hinges + t3_drawers + t3_blum_lift + t3_led +
                       t3_labor_bespoke + t3_assembly_install)

        tier3_breakdown = {
            "tier_id": "TIER_3_BESPOKE_SIGNATURE",
            "tier_name": "Phương án 3 (Bespoke Signature) - Gỗ Óc Chó Bắc Mỹ FAS (Walnut) + Phụ kiện Blum/Hafele Nhập Khẩu",
            "vat_lieu_thung": "Plywood chống nước phủ Veneer Óc Chó Bắc Mỹ tự nhiên ghép vân kỹ thuật Book-matched",
            "vat_lieu_canh": "Gỗ Óc Chó Bắc Mỹ (North American Walnut FAS 1 Com) tuyển chọn vân cuộn, sơn Inchem Mỹ 7 lớp kết hợp kính xám khói cường lực",
            "vat_lieu_hau": "Plywood chống nước phủ Veneer Óc Chó 9mm 2 mặt sơn PU bảo vệ",
            "phu_kien_co_khi": "Toàn bộ phụ kiện Blum (Áo) chính hãng: Bản lề Blum Clip Top Blumotion, tay nâng đôi Blum Aventos HF, ray hộp Blum Tandembox, LED Hafele Loox5",
            "chi_tiet_chi_phi": {
                "go_thung_plywood_veneer_oc_cho_vnd": round(t3_carcass),
                "canh_go_oc_cho_fas_son_inchem_vnd": round(t3_doors),
                "van_hau_plywood_veneer_vnd": round(t3_back),
                "chi_nep_go_oc_cho_tu_nhien_vnd": round(t3_pvc),
                "ban_le_blum_clip_top_blumotion_vnd": round(t3_hinges),
                "ray_hop_blum_tandembox_vnd": round(t3_drawers),
                "tay_nang_doi_blum_aventos_hf_vnd": round(t3_blum_lift),
                "he_thong_led_hafele_loox5_vnd": round(t3_led),
                "gia_cong_thu_cong_son_inchem_7_lop_vnd": round(t3_labor_bespoke),
                "van_chuyen_lap_dat_cao_cap_vnd": round(t3_assembly_install)
            },
            "tong_gia_tri_chua_vat_vnd": round(tier3_total),
            "thoi_gian_bao_hanh": "60 tháng bảo hành kết cấu & bảo dưỡng định kỳ 6 tháng/lần"
        }

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        return {
            "du_an": project_name,
            "thoi_gian_tinh_toan_ms": round(elapsed_ms, 2),
            "dat_chuan_duoi_3_giay": elapsed_ms < 3000.0,
            "khoi_luong_tong_hop": {
                "dien_tich_thung_m2": carcass_m2,
                "dien_tich_canh_m2": door_m2,
                "dien_tich_hau_m2": back_m2,
                "tong_dien_tich_m2": metrics["total_panel_area_m2"],
                "chi_dan_canh_pvc_md": pvc_md,
                "so_tam_18mm_quy_doi": metrics["standard_sheets"]["board_18mm_carcass_doors"]["sheets_ordered"],
                "so_tam_9mm_quy_doi": metrics["standard_sheets"]["board_9mm_backing"]["sheets_ordered"],
                "so_ban_le_noi_suy_tong": hinges
            },
            "phuong_an_bao_gia": [
                tier1_breakdown,
                tier2_breakdown,
                tier3_breakdown
            ]
        }


# ===================================================================================
# 5. BỘ DỮ LIỆU BẢN VẼ MẪU THỰC TẾ (DXF & BAZIS XML/CSV GENERATOR)
# ===================================================================================

class SampleDrawingData:
    """Bộ tạo dữ liệu mẫu thực tế chuẩn AutoCAD DXF ASCII & Bazis phục vụ kiểm thử hệ thống."""

    @staticmethod
    def get_kitchen_cabinet_dxf_ascii() -> str:
        """
        Bản vẽ Tủ bếp chữ L (L-Shaped Kitchen Cabinet) thực tế:
        - Tủ dưới: 3200mm x 1800mm, cao 810mm, sâu 600mm
        - Tủ trên: 3200mm x 1800mm, cao 750mm, sâu 350mm
        - Gồm các tấm Vách hồi, Đáy, Nóc, Cánh tủ (cao 750mm, H <= 900 -> 2 bản lề/cánh), Hậu tủ, Phụ kiện ray, bản lề.
        """
        lines = [
            "0", "SECTION",
            "2", "ENTITIES"
        ]

        # 1. CÁNH TỦ DƯỚI (8 cánh kích thước 400x750mm -> H=750mm -> 2 bản lề/cánh)
        for i in range(8):
            x0 = i * 420.0
            y0 = 0.0
            x1 = x0 + 400.0
            y1 = y0 + 750.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_CANH",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        # 2. CÁNH TỦ TRÊN (8 cánh kích thước 400x700mm -> H=700mm -> 2 bản lề/cánh)
        for i in range(8):
            x0 = i * 420.0
            y0 = 1000.0
            x1 = x0 + 400.0
            y1 = y0 + 700.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_CANH",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        # 3. VÁCH HỒI & ĐỢT TỦ BẾP (PG_VACH: 10 tấm kích thước 810x580mm, 600x580mm)
        for i in range(10):
            x0 = 3600.0 + (i % 5) * 650.0
            y0 = (i // 5) * 900.0
            x1 = x0 + 810.0
            y1 = y0 + 580.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_VACH",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        # 4. HẬU TỦ BẾP (PG_HAU: 4 tấm hậu kích thước 800x750mm)
        for i in range(4):
            x0 = i * 850.0
            y0 = 2000.0
            x1 = x0 + 800.0
            y1 = y0 + 750.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_HAU",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        # 5. PHỤ KIỆN (PG_PK: Ray trượt ray âm, Tay nâng Blum)
        lines.extend([
            "0", "INSERT",
            "8", "PG_PK",
            "2", "RAY_TRUOT_GIAM_CHAN",
            "10", "100.0", "20", "100.0",
            "0", "INSERT",
            "8", "PG_PK",
            "2", "RAY_TRUOT_GIAM_CHAN",
            "10", "100.0", "20", "200.0",
            "0", "INSERT",
            "8", "PG_PK",
            "2", "TAY_NANG_BLUM_AVENTOS",
            "10", "500.0", "20", "1200.0"
        ])

        lines.extend(["0", "ENDSEC", "0", "EOF"])
        return "\n".join(lines)

    @staticmethod
    def get_wardrobe_dxf_ascii() -> str:
        """
        Bản vẽ Tủ áo cánh kính kịch trần (Full-height Glass Wardrobe):
        - Kích thước: Rộng 2600mm x Cao 2700mm x Sâu 600mm
        - 4 Cánh kính chính cao 2400mm x 600mm (H = 2400mm > 2200mm -> 5 bản lề/cánh)
        - 4 Cánh nóc cao 300mm x 600mm (H = 300mm <= 900mm -> 2 bản lề/cánh)
        - Vách hồi kịch trần 2700x600mm, các đợt chia khoang, hậu tủ.
        """
        lines = [
            "0", "SECTION",
            "2", "ENTITIES"
        ]

        # 1. CÁNH KÍNH CHÍNH (4 cánh: 2400mm x 600mm -> H=2400 > 2200 -> 5 BẢN LỀ/CÁNH)
        for i in range(4):
            x0 = i * 650.0
            y0 = 0.0
            x1 = x0 + 600.0
            y1 = y0 + 2400.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_CANH",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        # 2. CÁNH NÓC TRÊN (4 cánh: 300mm x 600mm -> H=600 <= 900 -> 2 BẢN LỀ/CÁNH)
        for i in range(4):
            x0 = i * 650.0
            y0 = 2500.0
            x1 = x0 + 600.0
            y1 = y0 + 300.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_CANH",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        # 3. VÁCH HỒI VÀ ĐỢT TỦ ÁO (PG_VACH: 3 vách hồi 2700x600mm, 8 đợt 620x580mm)
        for i in range(3):
            x0 = 3000.0 + i * 650.0
            y0 = 0.0
            x1 = x0 + 600.0
            y1 = y0 + 2700.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_VACH",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        for i in range(8):
            x0 = 5000.0 + (i % 4) * 650.0
            y0 = (i // 4) * 700.0
            x1 = x0 + 620.0
            y1 = y0 + 580.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_VACH",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        # 4. HẬU TỦ ÁO (PG_HAU: 4 tấm hậu 2700x650mm)
        for i in range(4):
            x0 = 8000.0 + i * 700.0
            y0 = 0.0
            x1 = x0 + 650.0
            y1 = y0 + 2700.0
            lines.extend([
                "0", "LWPOLYLINE",
                "8", "PG_HAU",
                "90", "4",
                "70", "1",
                "10", str(x0), "20", str(y0),
                "10", str(x1), "20", str(y0),
                "10", str(x1), "20", str(y1),
                "10", str(x0), "20", str(y1),
            ])

        # 5. PHỤ KIỆN TỦ ÁO (Ngăn kéo để đồ trang sức / ray âm)
        lines.extend([
            "0", "INSERT",
            "8", "PG_PK",
            "2", "RAY_AM_GIAM_CHAN_HAFELE",
            "10", "150.0", "20", "400.0",
            "0", "INSERT",
            "8", "PG_PK",
            "2", "RAY_AM_GIAM_CHAN_HAFELE",
            "10", "150.0", "20", "600.0",
            "0", "INSERT",
            "8", "PG_PK",
            "2", "RAY_AM_GIAM_CHAN_HAFELE",
            "10", "150.0", "20", "800.0"
        ])

        lines.extend(["0", "ENDSEC", "0", "EOF"])
        return "\n".join(lines)

    @staticmethod
    def get_tv_wall_bazis_xml() -> str:
        """
        Dữ liệu Bazis XML Hệ vách Tivi phòng khách & Tủ rượu (Living Room Feature TV Wall & Wine Cabinet):
        - Kích thước vách chính: 3600mm x 2700mm
        - Kệ tivi treo: 2800 x 400 x 350mm
        - Tủ rượu cánh kính cao 2700mm (2 cánh kính cao 2100mm -> 1600 < H <= 2200 -> 4 bản lề/cánh, 2 cánh nóc cao 600mm -> 2 bản lề/cánh)
        - Vách ốp lam sóng/than tre và hộp kỹ thuật LED âm.
        """
        xml_parts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<BazisModel Version="11.0">',
            '  <ProjectInfo Name="He_Vach_Tivi_Phong_Khach" Customer="PG_HOME_CLIENT" />',
            '  <Panels>'
        ]

        # 1. CÁNH TỦ RƯỢU CAO (2 cánh: 2100mm x 450mm -> 1600 < H <= 2200 -> 4 bản lề/cánh)
        for i in range(2):
            xml_parts.append(f"""    <Panel>
      <Name>Cánh kính tủ rượu tầng chính {i+1}</Name>
      <Length>2100.0</Length>
      <Width>450.0</Width>
      <Thickness>17.5</Thickness>
      <Quantity>1</Quantity>
      <Material>Cánh kính khung nhôm Anode Champagne</Material>
    </Panel>""")

        # 2. CÁNH NÓC TỦ RƯỢU (2 cánh: 600mm x 450mm -> H <= 900 -> 2 bản lề/cánh)
        for i in range(2):
            xml_parts.append(f"""    <Panel>
      <Name>Cánh nóc tủ rượu tầng trên {i+1}</Name>
      <Length>600.0</Length>
      <Width>450.0</Width>
      <Thickness>17.5</Thickness>
      <Quantity>1</Quantity>
      <Material>MDF Lõi Xanh An Cường Melamine</Material>
    </Panel>""")

        # 3. MẶT NGĂN KÉO KỆ TIVI (3 ngăn kéo: 800mm x 200mm -> H=800 -> 2 bản lề/ray)
        for i in range(3):
            xml_parts.append(f"""    <Panel>
      <Name>Mặt ngăn kéo kệ tivi {i+1}</Name>
      <Length>800.0</Length>
      <Width>200.0</Width>
      <Thickness>17.5</Thickness>
      <Quantity>1</Quantity>
      <Material>MDF Lõi Xanh An Cường Melamine</Material>
    </Panel>""")

        # 4. HỆ VÁCH ỐP TRANG TRÍ & THÙNG KỆ TIVI (PG_VACH: 6 tấm lớn)
        vach_sizes = [
            ("Vách ốp trang trí trung tâm lam sóng", 2700.0, 1200.0),
            ("Vách ốp trang trí cánh tả vân đá", 2700.0, 1200.0),
            ("Vách ốp trang trí cánh hữu tủ rượu", 2700.0, 1200.0),
            ("Mặt nóc kệ tivi treo dài", 2800.0, 350.0),
            ("Đáy kệ tivi treo dài", 2800.0, 350.0),
            ("Hồi kệ tivi treo", 400.0, 350.0)
        ]
        for name, l, w in vach_sizes:
            xml_parts.append(f"""    <Panel>
      <Name>{name}</Name>
      <Length>{l}</Length>
      <Width>{w}</Width>
      <Thickness>17.5</Thickness>
      <Quantity>1</Quantity>
      <Material>MDF Lõi Xanh Phủ Veneer/Melamine</Material>
    </Panel>""")

        # 5. HẬU TỦ RƯỢU & VÁCH HẬU KỸ THUẬT (PG_HAU: 2 tấm 2700x900mm)
        for i in range(2):
            xml_parts.append(f"""    <Panel>
      <Name>Tấm hậu tủ rượu tiêu chuẩn {i+1}</Name>
      <Length>2700.0</Length>
      <Width>900.0</Width>
      <Thickness>9.0</Thickness>
      <Quantity>1</Quantity>
      <Material>MDF Lõi Xanh 9mm Melamine 2 mặt</Material>
    </Panel>""")

        xml_parts.extend(['  </Panels>', '</BazisModel>'])
        return "\n".join(xml_parts)


# ===================================================================================
# 6. SELF-TEST RUNNER & XUẤT BÁO CÁO JSON HOÀN TOÀN TỰ ĐỘNG
# ===================================================================================

def run_self_test_and_export_quotes() -> Dict[str, Any]:
    """
    Thực hiện kiểm thử thực tế trên 3 dự án điển hình và xuất file JSON:
    F:\\PG Home - Quản trị\\data\\cad_bom_instant_quotes.json
    Tuân thủ kỷ luật: Zero-trust audit (kiểm tra tính toán động, không hardcode PASS),
    thời gian xử lý < 3 giây, đầy đủ pháp lý Phú Gia.
    """
    global_start = time.perf_counter()

    dxf_parser = DxfAsciiParser()
    bazis_parser = BazisParser()
    projects_results = []

    # -------------------------------------------------------------------------------
    # DỰ ÁN 1: TỦ BẾP CHỮ L (L-Shaped Kitchen Cabinet) - Parse từ DXF ASCII
    # -------------------------------------------------------------------------------
    kitchen_dxf_str = SampleDrawingData.get_kitchen_cabinet_dxf_ascii()
    kitchen_entities = dxf_parser.parse_string(kitchen_dxf_str)
    kitchen_bom = CadBomEstimator.process_cad_entities(kitchen_entities)
    kitchen_quote = ThreeTierQuoteEngine.generate_quote("Tủ Bếp Chữ L Hiện Đại (L-Shaped Kitchen)", kitchen_bom)
    projects_results.append({
        "ma_du_an": "PG-PROJECT-01-KITCHEN-L",
        "ten_hang_muc": "Tủ Bếp Chữ L Hiện Đại Tủ Trên + Tủ Dưới",
        "dinh_dang_dau_vao": "AutoCAD .DXF ASCII (Pure Parser)",
        "so_luong_entities_cad": len(kitchen_entities),
        "bom_boc_tach": kitchen_bom,
        "du_toan_3_phuong_an": kitchen_quote
    })

    # -------------------------------------------------------------------------------
    # DỰ ÁN 2: TỦ ÁO CÁNH KÍNH KỊCH TRẦN (Full-height Glass Wardrobe) - Parse từ DXF ASCII
    # Kiểm chứng nội suy cánh cao 2400mm -> 5 bản lề/cánh
    # -------------------------------------------------------------------------------
    wardrobe_dxf_str = SampleDrawingData.get_wardrobe_dxf_ascii()
    wardrobe_entities = dxf_parser.parse_string(wardrobe_dxf_str)
    wardrobe_bom = CadBomEstimator.process_cad_entities(wardrobe_entities)
    wardrobe_quote = ThreeTierQuoteEngine.generate_quote("Tủ Áo Cánh Kính Kịch Trần (Full-Height Wardrobe)", wardrobe_bom)

    # Kiểm tra tính chuẩn xác của công thức nội suy bản lề cánh cao 2400mm
    canh_2400 = [p for p in wardrobe_bom["panels_detail"] if p["layer"] == "PG_CANH" and p["length_mm"] == 2400.0]
    hinges_per_canh_2400 = canh_2400[0]["hinges_per_piece"] if canh_2400 else 0
    assert hinges_per_canh_2400 == 5, f"Lỗi nội suy bản lề cánh H=2400mm: thực tế {hinges_per_canh_2400} != 5"

    projects_results.append({
        "ma_du_an": "PG-PROJECT-02-WARDROBE-GLASS",
        "ten_hang_muc": "Tủ Áo Cánh Kính Kịch Trần Hợp Kim Nhôm Anode",
        "dinh_dang_dau_vao": "AutoCAD .DXF ASCII (Pure Parser)",
        "so_luong_entities_cad": len(wardrobe_entities),
        "kiem_chung_noi_suy_canh_2400mm": {
            "chieu_cao_canh_mm": 2400,
            "so_ban_le_mot_canh": hinges_per_canh_2400,
            "quy_tac_ap_dung": "H > 2200mm -> 5 ban le/canh",
            "tinh_toan_chinh_xac": True
        },
        "bom_boc_tach": wardrobe_bom,
        "du_toan_3_phuong_an": wardrobe_quote
    })

    # -------------------------------------------------------------------------------
    # DỰ ÁN 3: HỆ VÁCH TIVI PHÒNG KHÁCH & TỦ RƯỢU - Parse từ Bazis XML
    # -------------------------------------------------------------------------------
    tv_bazis_xml_str = SampleDrawingData.get_tv_wall_bazis_xml()
    tv_parts = bazis_parser.parse_xml(tv_bazis_xml_str)

    # Chuyển đổi parts từ Bazis sang định dạng panels chuẩn
    tv_panels = []
    for pt in tv_parts:
        l = pt["length"]
        w = pt["width"]
        q = pt["quantity"]
        layer = pt["layer"]
        area_s = (l * w) / 1_000_000.0

        if layer == "PG_CANH":
            base_pvc = 2.0 * (l + w) / 1000.0
            hinges_pc = CadBomEstimator.calculate_hinges_for_door(l)
        elif layer == "PG_VACH":
            base_pvc = (2.0 * l + w) / 1000.0
            hinges_pc = 0
        else:
            base_pvc = 0.0
            hinges_pc = 0

        pvc_loss = base_pvc * (1.0 + PVC_WASTAGE_RATE)

        tv_panels.append({
            "name": pt["name"],
            "layer": layer,
            "length_mm": round(l, 1),
            "width_mm": round(w, 1),
            "thickness_mm": pt["thickness"],
            "quantity": q,
            "area_m2_single": round(area_s, 4),
            "area_m2_total": round(area_s * q, 4),
            "pvc_edge_base_md": round(base_pvc * q, 3),
            "pvc_edge_final_md": round(pvc_loss * q, 3),
            "hinges_per_piece": hinges_pc,
            "hinges_total": hinges_pc * q
        })

    tv_bom = CadBomEstimator.summarize_bom(tv_panels)
    tv_quote = ThreeTierQuoteEngine.generate_quote("Hệ Vách Tivi Phòng Khách & Tủ Rượu (Living Room Feature Wall)", tv_bom)

    projects_results.append({
        "ma_du_an": "PG-PROJECT-03-TV-WALL",
        "ten_hang_muc": "Hệ Vách Tivi Lam Sóng Trang Trí & Tủ Rượu Cánh Kính",
        "dinh_dang_dau_vao": "Bazis Mebelshik .XML Model Export",
        "so_luong_chi_tiet_bazis": len(tv_parts),
        "bom_boc_tach": tv_bom,
        "du_toan_3_phuong_an": tv_quote
    })

    global_elapsed_ms = (time.perf_counter() - global_start) * 1000.0

    # Tổng kết dữ liệu xuất JSON
    output_data = {
        "he_thong": "PG HOME LUXURY CAD/BAZIS AUTOMATED BOM & 3-TIER QUOTATION ENGINE",
        "phien_ban": "2.0.0 (Release R03 - Production Ready)",
        "ngay_xuat_bao_cao": time.strftime("%Y-%m-%d %H:%M:%S"),
        "thong_tin_phap_ly_va_thuong_hieu": LEGAL_BRAND_INFO,
        "quy_chuan_ky_thuat": {
            "kich_thuoc_tam_tieu_chuan_mm": f"{int(SHEET_WIDTH_MM)} x {int(SHEET_LENGTH_MM)}",
            "dien_tich_tam_tieu_chuan_m2": SHEET_AREA_M2,
            "ty_le_hao_hut_nep_pvc": f"{int(PVC_WASTAGE_RATE * 100)}%",
            "ty_le_hao_hut_cnc_nesting": f"{int(CNC_NESTING_WASTAGE_RATE * 100)}%",
            "cong_thuc_noi_suy_ban_le": {
                "H <= 900mm": "2 bản lề/cánh",
                "900mm < H <= 1600mm": "3 bản lề/cánh",
                "1600mm < H <= 2200mm": "4 bản lề/cánh",
                "H > 2200mm": "5 bản lề/cánh"
            }
        },
        "hieu_nang_he_thong": {
            "tong_thoi_gian_xu_ly_3_du_an_ms": round(global_elapsed_ms, 2),
            "dat_muc_tieu_duoi_3_giay": global_elapsed_ms < 3000.0,
            "so_du_an_kiem_thu": len(projects_results)
        },
        "danh_sach_du_an_boc_tach_va_bao_gia": projects_results
    }

    # Xuất ra file JSON đích
    output_path = r"F:\PG Home - Quản trị\data\cad_bom_instant_quotes.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    return output_data


# ===================================================================================
# ENTRY POINT
# ===================================================================================

if __name__ == "__main__":
    print("=" * 80)
    print("PG HOME LUXURY - KHỞI CHẠY CAD/BAZIS BOM & 3-TIER INSTANT QUOTATION ENGINE")
    print("Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (PG HOME LUXURY)")
    print("Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0986.722.324")
    print("=" * 80)

    try:
        report = run_self_test_and_export_quotes()
        perf = report["hieu_nang_he_thong"]
        print(f"\n[HOÀN TẤT XUẤT SẮC]")
        print(f"- Số dự án kiểm thử: {perf['so_du_an_kiem_thu']}")
        print(f"- Tổng thời gian bóc tách & lập 3 phương án báo giá: {perf['tong_thoi_gian_xu_ly_3_du_an_ms']} ms")
        print(f"- Đạt chuẩn hiệu năng < 3 giây: {'ĐẠT' if perf['dat_muc_tieu_duoi_3_giay'] else 'KHÔNG ĐẠT'}")

        for p in report["danh_sach_du_an_boc_tach_va_bao_gia"]:
            print(f"\n>>> DỰ ÁN: {p['ten_hang_muc']}")
            quotes = p["du_toan_3_phuong_an"]["phuong_an_bao_gia"]
            for q in quotes:
                print(f"  * {q['tier_name']}: {q['tong_gia_tri_chua_vat_vnd']:,} VNĐ")

        print(f"\n[LƯU FILE THÀNH CÔNG]: F:\\PG Home - Quản trị\\data\\cad_bom_instant_quotes.json")
    except Exception as e:
        print(f"\n[LỖI]: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
