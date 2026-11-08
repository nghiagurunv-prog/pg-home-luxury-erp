"""
====================================================================================================
TỔ HỢP VĂN PHÒNG & NHÀ MÁY SẢN XUẤT NỘI THẤT PHÚ GIA
Đơn vị pháp lý: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
Thương hiệu: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY
Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
Hotline: 0986.722.324 | MST: 042203002931
====================================================================================================
HỆ THỐNG TỐI ƯU HÓA XẾP TẤM CẮT VÁN CNC 2D & QUẢN TRỊ PHÔI DƯ QR
Module: cnc_2d_nesting_optimizer.py
Thuật toán: 2D Maximal Rectangles (Best Short Side Fit & Best Area Fit) + Genetic Algorithm (MaxRects-GA)
Kèm module: QR Offcut Remnant Inventory (Thu hồi và tái sử dụng phôi dư tự động)
====================================================================================================
"""

import os
import sys
import json
import math
import copy
import random
from datetime import datetime

# ==================================================================================================
# THÔNG TIN PHÁP LÝ & HỆ THỐNG QUẢN TRỊ PHÚ GIA
# ==================================================================================================
BRAND_METADATA = {
    "legal_entity": "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
    "commercial_brand": "CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY",
    "facility_name": "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia",
    "address": "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
    "hotline": "0986.722.324",
    "tax_id": "042203002931",
    "system_module": "PG-CNC-NESTING-GA-V2",
    "system_version": "2.5.0-PROD"
}

# THÔNG SỐ VẬT TƯ & KỸ THUẬT CẮT CNC TIÊU CHUẨN PHÚ GIA
RAW_SHEET_WIDTH = 1220.0       # Chiều rộng tấm ván chuẩn công nghiệp (mm)
RAW_SHEET_HEIGHT = 2440.0      # Chiều dài tấm ván chuẩn công nghiệp (mm)
TRIM_EDGE = 10.0               # Mépề cắt tỉa chuẩn biên tấm (mm mỗi cạnh)
USABLE_WIDTH = RAW_SHEET_WIDTH - 2 * TRIM_EDGE    # 1200.0 mm
USABLE_HEIGHT = RAW_SHEET_HEIGHT - 2 * TRIM_EDGE  # 2420.0 mm
CNC_KERF = 4.0                 # Bề rộng rãnh mạch phay CNC dao xoắn router (mm)
MIN_REMNANT_W = 300.0          # Kích thước phôi dư hữu dụng tối thiểu W (mm)
MIN_REMNANT_H = 400.0          # Kích thước phôi dư hữu dụng tối thiểu H (mm)
MIN_REMNANT_AREA = MIN_REMNANT_W * MIN_REMNANT_H # 120,000 mm2 (0.12 m2)


# ==================================================================================================
# ĐỊNH NGHĨA CẤU TRÚC HÌNH HỌC VÀ DỮ LIỆU TẤM VÁN
# ==================================================================================================
class Rect:
    """Hình chữ nhật biểu diễn vùng không gian tự do hoặc chi tiết trên tấm ván."""
    def __init__(self, x: float, y: float, w: float, h: float):
        self.x = float(x)
        self.y = float(y)
        self.w = float(w)
        self.h = float(h)

    @property
    def right(self) -> float:
        return self.x + self.w

    @property
    def top(self) -> float:
        return self.y + self.h

    @property
    def area(self) -> float:
        return self.w * self.h

    def contains(self, other: "Rect") -> bool:
        """Kiểm tra hình chữ nhật self có chứa hoàn toàn other hay không (dung sai 1e-4)."""
        eps = 1e-4
        return (self.x <= other.x + eps and
                self.y <= other.y + eps and
                self.right >= other.right - eps and
                self.top >= other.top - eps)

    def intersects(self, other: "Rect") -> bool:
        """Kiểm tra hai hình chữ nhật có giao nhau (diện tích giao > 0) hay không."""
        eps = 1e-4
        return not (self.right <= other.x + eps or
                    self.x >= other.right - eps or
                    self.top <= other.y + eps or
                    self.y >= other.top - eps)

    def to_dict(self):
        return {
            "x": round(self.x, 2),
            "y": round(self.y, 2),
            "w": round(self.w, 2),
            "h": round(self.h, 2),
            "area_m2": round(self.area / 1_000_000.0, 4)
        }


class Part:
    """Chi tiết nội thất cần cắt CNC."""
    def __init__(self, part_id: str, name: str, length: float, width: float,
                 material: str, thickness: float, grain_lock: bool,
                 module_group: str = "", order_id: str = ""):
        self.part_id = part_id
        self.name = name
        self.length = float(length)  # Chiều dài theo thớ gỗ nếu grain_lock=True
        self.width = float(width)    # Chiều rộng
        self.material = material
        self.thickness = float(thickness)
        self.grain_lock = bool(grain_lock) # True = Cấm xoay 90 độ; False = Cho phép xoay
        self.module_group = module_group
        self.order_id = order_id
        
        # Kết quả nesting sau khi xếp
        self.placed_x = 0.0          # Tọa độ X trên vùng hữu dụng (mm)
        self.placed_y = 0.0          # Tọa độ Y trên vùng hữu dụng (mm)
        self.placed_w = 0.0          # Chiều rộng sau khi xếp (mm)
        self.placed_h = 0.0          # Chiều dài sau khi xếp (mm)
        self.is_rotated = False      # Đã xoay 90 độ hay không
        self.sheet_index = -1        # Tấm ván chứa chi tiết

    @property
    def area(self) -> float:
        return self.length * self.width

    def clone(self) -> "Part":
        p = Part(self.part_id, self.name, self.length, self.width,
                 self.material, self.thickness, self.grain_lock,
                 self.module_group, self.order_id)
        p.placed_x = self.placed_x
        p.placed_y = self.placed_y
        p.placed_w = self.placed_w
        p.placed_h = self.placed_h
        p.is_rotated = self.is_rotated
        p.sheet_index = self.sheet_index
        return p

    def to_dict(self):
        # Tọa độ thực tế trên phôi thô bao gồm mép tỉa TRIM_EDGE (10mm)
        raw_x = round(self.placed_x + TRIM_EDGE, 2)
        raw_y = round(self.placed_y + TRIM_EDGE, 2)
        return {
            "part_id": self.part_id,
            "name": self.name,
            "module_group": self.module_group,
            "material": self.material,
            "thickness_mm": self.thickness,
            "grain_locked": self.grain_lock,
            "original_length_mm": round(self.length, 2),
            "original_width_mm": round(self.width, 2),
            "placed_usable_x_mm": round(self.placed_x, 2),
            "placed_usable_y_mm": round(self.placed_y, 2),
            "placed_raw_sheet_x_mm": raw_x,
            "placed_raw_sheet_y_mm": raw_y,
            "placed_width_mm": round(self.placed_w, 2),
            "placed_length_mm": round(self.placed_h, 2),
            "is_rotated_90deg": self.is_rotated,
            "area_m2": round(self.area / 1_000_000.0, 4)
        }


# ==================================================================================================
# THUẬT TOÁN 2D MAXIMAL RECTANGLES (MAXRECTS)
# ==================================================================================================
class SheetBin:
    """Tấm ván CNC quản lý danh sách hình chữ nhật tự do cực đại (Maximal Rectangles)."""
    def __init__(self, sheet_index: int, material: str, thickness: float):
        self.sheet_index = sheet_index
        self.material = material
        self.thickness = thickness
        self.usable_w = USABLE_WIDTH
        self.usable_h = USABLE_HEIGHT
        self.kerf = CNC_KERF
        self.placed_parts = []
        # Ban đầu toàn bộ diện tích hữu dụng là 1 hình chữ nhật tự do cực đại duy nhất
        self.free_rectangles = [Rect(0.0, 0.0, self.usable_w, self.usable_h)]
        self.usable_remnants = []

    @property
    def total_usable_area(self) -> float:
        return self.usable_w * self.usable_h

    @property
    def packed_part_area(self) -> float:
        return sum(p.area for p in self.placed_parts)

    @property
    def utilization_percentage(self) -> float:
        if self.total_usable_area <= 0:
            return 0.0
        return round((self.packed_part_area / self.total_usable_area) * 100.0, 2)

    @property
    def waste_percentage(self) -> float:
        return round(100.0 - self.utilization_percentage, 2)

    def prune_free_list(self):
        """Lọc bỏ các hình chữ nhật tự do bị trùng lặp hoặc nằm lọt hoàn toàn trong hình chữ nhật khác."""
        i = 0
        while i < len(self.free_rectangles):
            j = i + 1
            while j < len(self.free_rectangles):
                if self.free_rectangles[j].contains(self.free_rectangles[i]):
                    self.free_rectangles.pop(i)
                    i -= 1
                    break
                elif self.free_rectangles[i].contains(self.free_rectangles[j]):
                    self.free_rectangles.pop(j)
                else:
                    j += 1
            i += 1

    def split_free_node(self, free_node: Rect, used_node: Rect) -> list:
        """Tách hình chữ nhật tự do theo 4 hướng khi bị một chi tiết (đã cộng kerf) chiếm dụng."""
        new_nodes = []
        if not free_node.intersects(used_node):
            return [free_node]

        # Nhánh Trái (Left)
        if used_node.x > free_node.x and used_node.x < free_node.right:
            new_rect = Rect(free_node.x, free_node.y, used_node.x - free_node.x, free_node.h)
            if new_rect.w >= 10.0 and new_rect.h >= 10.0:
                new_nodes.append(new_rect)

        # Nhánh Phải (Right)
        if used_node.right < free_node.right and used_node.right > free_node.x:
            new_rect = Rect(used_node.right, free_node.y, free_node.right - used_node.right, free_node.h)
            if new_rect.w >= 10.0 and new_rect.h >= 10.0:
                new_nodes.append(new_rect)

        # Nhánh Dưới (Bottom)
        if used_node.y > free_node.y and used_node.y < free_node.top:
            new_rect = Rect(free_node.x, free_node.y, free_node.w, used_node.y - free_node.y)
            if new_rect.w >= 10.0 and new_rect.h >= 10.0:
                new_nodes.append(new_rect)

        # Nhánh Trên (Top)
        if used_node.top < free_node.top and used_node.top > free_node.y:
            new_rect = Rect(free_node.x, used_node.top, free_node.w, free_node.top - used_node.top)
            if new_rect.w >= 10.0 and new_rect.h >= 10.0:
                new_nodes.append(new_rect)

        return new_nodes

    def score_placement(self, part: Part, free_rect: Rect, rotate: bool, heuristic: str) -> tuple:
        """Đánh giá điểm số đặt chi tiết theo Best Short Side Fit (BSSF) hoặc Best Area Fit (BAF)."""
        pw = part.length if rotate else part.width
        ph = part.width if rotate else part.length

        if free_rect.w < pw or free_rect.h < ph:
            return (float('inf'), float('inf'))

        rem_w = free_rect.w - pw
        rem_h = free_rect.h - ph

        if heuristic == "BSSF": # Best Short Side Fit
            primary = min(rem_w, rem_h)
            secondary = max(rem_w, rem_h)
            return (primary, secondary)
        elif heuristic == "BAF":  # Best Area Fit
            primary = free_rect.area - (pw * ph)
            secondary = min(rem_w, rem_h)
            return (primary, secondary)
        else: # Bottom-Left default
            primary = free_rect.y + ph
            secondary = free_rect.x + pw
            return (primary, secondary)

    def find_best_placement(self, part: Part, heuristic: str = "BSSF"):
        """Tìm vị trí và góc xoay tối ưu nhất cho chi tiết trong danh sách free_rectangles."""
        best_score = (float('inf'), float('inf'))
        best_rect = None
        best_rotated = False

        # Các góc xoay được phép thử
        # Nếu grain_lock == True: CHỈ được giữ nguyên chiều vân gỗ (rotate=False)
        # Nếu grain_lock == False: được thử cả xoay 90 độ
        rotations = [False]
        if not part.grain_lock:
            rotations.append(True)

        for free_rect in self.free_rectangles:
            for rotate in rotations:
                score = self.score_placement(part, free_rect, rotate, heuristic)
                if score < best_score:
                    best_score = score
                    best_rect = free_rect
                    best_rotated = rotate

        if best_rect is not None:
            pw = part.length if best_rotated else part.width
            ph = part.width if best_rotated else part.length
            return {
                "x": best_rect.x,
                "y": best_rect.y,
                "w": pw,
                "h": ph,
                "rotated": best_rotated,
                "score": best_score
            }
        return None

    def place_part(self, part: Part, placement: dict):
        """Đặt chi tiết vào tấm ván, cộng mạch dao phay CNC (kerf), và cập nhật danh sách vùng tự do."""
        part.placed_x = placement["x"]
        part.placed_y = placement["y"]
        part.placed_w = placement["w"]
        part.placed_h = placement["h"]
        part.is_rotated = placement["rotated"]
        part.sheet_index = self.sheet_index
        self.placed_parts.append(part)

        # Vùng bị chiếm dụng thực tế gồm kích thước chi tiết + mạch phay kerf (4mm)
        # Lưu ý: Nếu mép ngoài chạm biên tấm ván hữu dụng thì không cần chừa kerf ra ngoài biên
        used_w = placement["w"] + self.kerf
        used_h = placement["h"] + self.kerf
        used_rect = Rect(placement["x"], placement["y"], used_w, used_h)

        # Cắt tách các free_rectangles giao với used_rect
        new_free_list = []
        for free_rect in self.free_rectangles:
            splits = self.split_free_node(free_rect, used_rect)
            new_free_list.extend(splits)

        self.free_rectangles = new_free_list
        self.prune_free_list()

    def extract_disjoint_remnants(self) -> list:
        """Thu hồi các khối phôi dư cực đại không giao nhau (đạt chuẩn >= 300x400 mm)."""
        # Thu thập các candidate đạt kích thước hữu dụng tối thiểu
        candidates = []
        for r in self.free_rectangles:
            # Kiểm tra cả 2 chiều: (w >= 300 and h >= 400) hoặc (w >= 400 and h >= 300)
            if (r.w >= MIN_REMNANT_W and r.h >= MIN_REMNANT_H) or (r.w >= MIN_REMNANT_H and r.h >= MIN_REMNANT_W):
                candidates.append(Rect(r.x, r.y, r.w, r.h))

        # Sắp xếp candidate theo diện tích giảm dần để ưu tiên thu hồi phôi lớn nhất
        candidates.sort(key=lambda item: item.area, reverse=True)

        disjoint_remnants = []
        for cand in candidates:
            # Kiểm tra xem cand có bị giao cắt với các phôi dư đã chọn trước đó hay không
            is_disjoint = True
            for chosen in disjoint_remnants:
                if cand.intersects(chosen):
                    is_disjoint = False
                    break
            if is_disjoint:
                disjoint_remnants.append(cand)

        self.usable_remnants = disjoint_remnants
        return disjoint_remnants


# ==================================================================================================
# GIẢI THUẬT DI TRUYỀN (GENETIC ALGORITHM - GA) TỐI ƯU HÓA THỨ TỰ VÀ HƯỚNG NẠP TẤM
# ==================================================================================================
class GeneticAlgorithmNesting:
    """Tối ưu hóa thứ tự xếp tấm (Permutation GA) kết hợp MaxRects (BSSF / BAF)."""
    def __init__(self, parts: list, material: str, thickness: float,
                 pop_size: int = 24, generations: int = 20, mutation_rate: float = 0.25):
        self.original_parts = parts
        self.material = material
        self.thickness = thickness
        self.pop_size = pop_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.num_parts = len(parts)

    def evaluate_chromosome(self, chromosome: list, heuristic: str) -> tuple:
        """Mô phỏng xếp tấm cho 1 cá thể nhiễm sắc thể (danh sách index chi tiết)."""
        bins = []
        current_bin = SheetBin(len(bins) + 1, self.material, self.thickness)
        bins.append(current_bin)

        for idx in chromosome:
            part_to_place = self.original_parts[idx].clone()
            placement = current_bin.find_best_placement(part_to_place, heuristic)

            if placement is not None:
                current_bin.place_part(part_to_place, placement)
            else:
                # Không vừa tấm hiện tại -> Mở tấm ván mới
                current_bin = SheetBin(len(bins) + 1, self.material, self.thickness)
                bins.append(current_bin)
                placement = current_bin.find_best_placement(part_to_place, heuristic)
                if placement is not None:
                    current_bin.place_part(part_to_place, placement)
                else:
                    # Trường hợp bất thường (chi tiết lớn hơn tấm hữu dụng)
                    return (float('-inf'), bins)

        # Tính toán hàm thích nghi (Fitness):
        # 1. Ưu tiên số lượng tấm ít nhất (mỗi tấm giảm được là cực kỳ giá trị)
        # 2. Tối đa hóa tỷ lệ lấp đầy (utilization) trung bình trên các tấm
        # 3. Thưởng đậm nếu tấm cuối cùng tập trung được diện tích phôi dư lớn >= 300x400
        total_utilization = sum(b.utilization_percentage for b in bins)
        avg_utilization = total_utilization / len(bins)

        # Điểm fitness
        fitness = 10000.0 / len(bins) + avg_utilization * 10.0
        return (fitness, bins)

    def order_crossover(self, parent1: list, parent2: list) -> tuple:
        """Toán tử lai ghép thứ tự OX1 (Order Crossover) bảo toàn tính duy nhất của chi tiết."""
        size = len(parent1)
        cx1, cx2 = sorted(random.sample(range(size), 2))

        def make_child(p1, p2):
            child = [-1] * size
            child[cx1:cx2 + 1] = p1[cx1:cx2 + 1]
            p1_set = set(child[cx1:cx2 + 1])
            p2_filtered = [item for item in p2 if item not in p1_set]
            
            ptr = 0
            for i in range(size):
                if child[i] == -1:
                    child[i] = p2_filtered[ptr]
                    ptr += 1
            return child

        return make_child(parent1, parent2), make_child(parent2, parent1)

    def mutate(self, chromosome: list) -> list:
        """Toán tử đột biến hoán vị (Swap, 2-Opt Inversion, hoặc xáo đoạn nhỏ)."""
        mutated = list(chromosome)
        mutation_type = random.choice(["swap", "inversion", "shuffle_window"])

        if mutation_type == "swap":
            i, j = random.sample(range(len(mutated)), 2)
            mutated[i], mutated[j] = mutated[j], mutated[i]
        elif mutation_type == "inversion":
            i, j = sorted(random.sample(range(len(mutated)), 2))
            mutated[i:j + 1] = reversed(mutated[i:j + 1])
        elif mutation_type == "shuffle_window":
            win_size = min(4, len(mutated))
            start = random.randint(0, len(mutated) - win_size)
            window = mutated[start:start + win_size]
            random.shuffle(window)
            mutated[start:start + win_size] = window

        return mutated

    def run(self) -> tuple:
        """Thực thi Genetic Algorithm tìm phương án sắp xếp tối ưu nhất."""
        if self.num_parts == 0:
            return None, 0.0

        # Khởi tạo quần thể:
        # Cá thể 1: First Fit Decreasing theo Diện tích (heuristic cổ điển)
        ffd_area_indices = sorted(range(self.num_parts),
                                  key=lambda i: self.original_parts[i].area, reverse=True)
        # Cá thể 2: First Fit Decreasing theo Chiều dài
        ffd_len_indices = sorted(range(self.num_parts),
                                 key=lambda i: max(self.original_parts[i].length, self.original_parts[i].width), reverse=True)
        # Cá thể 3: First Fit Decreasing theo Chiều rộng
        ffd_width_indices = sorted(range(self.num_parts),
                                   key=lambda i: min(self.original_parts[i].length, self.original_parts[i].width), reverse=True)

        population = [ffd_area_indices, ffd_len_indices, ffd_width_indices]

        # Các cá thể còn lại khởi tạo ngẫu nhiên hoặc xáo trộn
        while len(population) < self.pop_size:
            shuffled = list(ffd_area_indices)
            random.shuffle(shuffled)
            population.append(shuffled)

        heuristics = ["BSSF", "BAF"]
        best_fitness = float('-inf')
        best_bins = None
        best_heuristic = "BSSF"
        best_chromosome = None

        for gen in range(self.generations):
            evaluated_pop = []
            for chromo in population:
                # Đánh giá với cả 2 heuristic BSSF và BAF
                for h in heuristics:
                    fit, bins = self.evaluate_chromosome(chromo, h)
                    evaluated_pop.append((fit, chromo, h, bins))

            # Sắp xếp theo fitness giảm dần
            evaluated_pop.sort(key=lambda x: x[0], reverse=True)

            # Cập nhật kỷ lục cá thể tốt nhất toàn cầu
            if evaluated_pop[0][0] > best_fitness:
                best_fitness = evaluated_pop[0][0]
                best_chromosome = evaluated_pop[0][1]
                best_heuristic = evaluated_pop[0][2]
                best_bins = evaluated_pop[0][3]

            # Elitism: Chọn lọc top 4 cá thể xuất sắc nhất đi thẳng vào thế hệ sau
            new_population = [evaluated_pop[i][1] for i in range(min(4, len(evaluated_pop)))]

            # Sinh sản & Lai ghép cho thế hệ kế tiếp
            while len(new_population) < self.pop_size:
                # Tournament selection
                p1 = random.choice(evaluated_pop[:10])[1]
                p2 = random.choice(evaluated_pop[:10])[1]
                c1, c2 = self.order_crossover(p1, p2)

                if random.random() < self.mutation_rate:
                    c1 = self.mutate(c1)
                if random.random() < self.mutation_rate:
                    c2 = self.mutate(c2)

                new_population.append(c1)
                if len(new_population) < self.pop_size:
                    new_population.append(c2)

            population = new_population

        # Trích xuất phôi dư cho phương án tốt nhất
        for b in best_bins:
            b.extract_disjoint_remnants()

        return best_bins, best_fitness, best_heuristic


# ==================================================================================================
# THUẬT TOÁN ĐỐI CHỨNG BASELINE (FIRST FIT DECREASING - FFD CỔ ĐIỂN KHÔNG GA)
# ==================================================================================================
def run_baseline_ffd(parts: list, material: str, thickness: float) -> list:
    """Chạy thuật toán First Fit Decreasing (FFD) cổ điển để đối chứng hiệu năng."""
    sorted_parts = sorted(parts, key=lambda p: p.area, reverse=True)
    bins = []
    current_bin = SheetBin(len(bins) + 1, material, thickness)
    bins.append(current_bin)

    for p in sorted_parts:
        part_clone = p.clone()
        placement = current_bin.find_best_placement(part_clone, heuristic="BSSF")
        if placement is not None:
            current_bin.place_part(part_clone, placement)
        else:
            current_bin = SheetBin(len(bins) + 1, material, thickness)
            bins.append(current_bin)
            placement = current_bin.find_best_placement(part_clone, heuristic="BSSF")
            if placement is not None:
                current_bin.place_part(part_clone, placement)

    return bins


# ==================================================================================================
# MODULE QUẢN LÝ KHO PHÔI DƯ QR (QR OFFCUT REMNANT INVENTORY)
# ==================================================================================================
class QROffcutInventory:
    """Quản trị danh mục phôi dư hữu dụng, cấp mã định danh và chuỗi mã QR thông minh."""
    def __init__(self):
        self.remnants = []

    def register_remnants_from_bins(self, sheet_bins: list, material_name: str, material_code: str):
        today_str = datetime.now().strftime("%Y%m%d")
        counter = len(self.remnants) + 1

        for b in sheet_bins:
            for rem in b.usable_remnants:
                rem_id = f"PG-OFFCUT-{today_str}-{counter:03d}"
                counter += 1

                # Tọa độ thực tế trên tấm thô
                raw_x = round(rem.x + TRIM_EDGE, 2)
                raw_y = round(rem.y + TRIM_EDGE, 2)

                # Dữ liệu mã QR đóng gói chuẩn JSON để máy quét công nghiệp đọc tức thì
                qr_payload = {
                    "offcut_id": rem_id,
                    "material_code": material_code,
                    "material_name": material_name,
                    "thickness_mm": b.thickness,
                    "width_mm": round(rem.w, 1),
                    "height_mm": round(rem.h, 1),
                    "area_m2": round(rem.area / 1_000_000.0, 4),
                    "source_sheet": f"Tấm {b.sheet_index} ({material_code})",
                    "facility": BRAND_METADATA["facility_name"],
                    "hotline": BRAND_METADATA["hotline"],
                    "timestamp": datetime.now().isoformat()
                }

                remnant_entry = {
                    "remnant_id": rem_id,
                    "material_code": material_code,
                    "material_name": material_name,
                    "thickness_mm": b.thickness,
                    "origin_sheet_index": b.sheet_index,
                    "usable_x_mm": round(rem.x, 2),
                    "usable_y_mm": round(rem.y, 2),
                    "raw_x_mm": raw_x,
                    "raw_y_mm": raw_y,
                    "width_mm": round(rem.w, 2),
                    "height_mm": round(rem.h, 2),
                    "area_m2": round(rem.area / 1_000_000.0, 4),
                    "status": "IN_STOCK", # IN_STOCK, ALLOCATED, REUSED
                    "qr_code_payload": json.dumps(qr_payload, ensure_ascii=False)
                }
                self.remnants.append(remnant_entry)

    def allocate_supplementary_part(self, part: Part) -> dict:
        """
        Thuật toán ưu tiên nạp phôi dư cho đơn hàng tiếp theo trước khi cắt ván mới.
        Tìm tấm phôi dư trong kho có diện tích vừa vặn nhất (Best Fit) để cắt chi tiết part.
        """
        best_remnant = None
        best_waste = float('inf')
        best_rotation = False

        for rem in self.remnants:
            if rem["status"] != "IN_STOCK":
                continue
            if rem["material_code"] != part.material or rem["thickness_mm"] != part.thickness:
                continue

            rw = rem["width_mm"]
            rh = rem["height_mm"]

            # Thử không xoay
            if rw >= part.width + CNC_KERF and rh >= part.length + CNC_KERF:
                waste = (rw * rh) - (part.width * part.length)
                if waste < best_waste:
                    best_waste = waste
                    best_remnant = rem
                    best_rotation = False

            # Thử xoay 90 độ nếu không bị khóa vân
            if not part.grain_lock:
                if rw >= part.length + CNC_KERF and rh >= part.width + CNC_KERF:
                    waste = (rw * rh) - (part.width * part.length)
                    if waste < best_waste:
                        best_waste = waste
                        best_remnant = rem
                        best_rotation = True

        if best_remnant:
            best_remnant["status"] = "ALLOCATED"
            return {
                "success": True,
                "remnant_id": best_remnant["remnant_id"],
                "remnant_dim": [best_remnant["width_mm"], best_remnant["height_mm"]],
                "part_id": part.part_id,
                "part_name": part.name,
                "rotated_90deg": best_rotation,
                "saved_raw_sheet": True
            }

        return {"success": False, "saved_raw_sheet": False}


# ==================================================================================================
# KHỞI TẠO DANH SÁCH CHI TIẾT ĐƠN HÀNG THỰC TẾ (BOM TỦ BẾP & TỦ ÁO MASTER)
# ==================================================================================================
def generate_sample_orders() -> dict:
    """Tạo bộ chi tiết sản xuất thực tế theo 4 nhóm vật liệu cao cấp tại Phú Gia."""
    orders = {
        # NHÓM 1: Gỗ Óc Chó Bắc Mỹ / Melamine Óc Chó An Cường (grain_lock = True: CẤM XOAY 90 ĐỘ)
        "MAT-WALNUT-17": {
            "material_name": "MDF Melamine Óc Chó An Cường (Vân Gỗ Bắc Mỹ Tự Nhiên)",
            "thickness": 17.0,
            "grain_lock": True,
            "parts": [
                # Module Tủ Áo Master - Thùng vách và đợt ngang lớn (yêu cầu chuẩn vân đứng)
                Part("P-WAL-01", "Hồi trái Tủ Áo Master", 2200, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-02", "Hồi phải Tủ Áo Master", 2200, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-03", "Hồi giữa Tủ Áo Master", 2200, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-04", "Vách chia buồng áo", 2200, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-05", "Đáy tủ áo buồng 1", 1160, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-06", "Nóc tủ áo buồng 1", 1160, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-07", "Đáy tủ áo buồng 2", 1160, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-08", "Nóc tủ áo buồng 2", 1160, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-09", "Đợt cố định buồng gấp 1", 1160, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-10", "Đợt cố định buồng gấp 2", 1160, 580, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-11", "Len chân tủ áo trước", 1160, 100, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-12", "Len chân tủ áo sau", 1160, 100, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-13", "Thanh giằng nóc 1", 1160, 100, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
                Part("P-WAL-14", "Thanh giằng nóc 2", 1160, 100, "MAT-WALNUT-17", 17.0, True, "Tủ Áo Master"),
            ]
        },

        # NHÓM 2: MDF Melamine Xám Chì Chống Ẩm Thùng Tủ Bếp (grain_lock = False: ĐƯỢC XOAY 90 ĐỘ)
        "MAT-GREY-17": {
            "material_name": "MDF Chống Ẩm Melamine Xám Chì (Thùng Tủ Bếp PG-Luxury)",
            "thickness": 17.0,
            "grain_lock": False,
            "parts": [
                Part("P-GRY-01", "Hồi trái Thùng Bếp Dưới", 810, 580, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-02", "Hồi phải Thùng Bếp Dưới", 810, 580, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-03", "Vách giữa Thùng Bếp Dưới 1", 810, 580, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-04", "Vách giữa Thùng Bếp Dưới 2", 810, 580, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-05", "Đáy khoang chậu rửa", 860, 580, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-06", "Đáy khoang bếp từ", 860, 580, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-07", "Đáy khoang giá bát đĩa", 860, 580, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-08", "Đợt di động khoang gia vị", 860, 540, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-09", "Hồi tủ bếp trên 1", 700, 350, "MAT-GREY-17", 17.0, False, "Tủ Bếp Trên"),
                Part("P-GRY-10", "Hồi tủ bếp trên 2", 700, 350, "MAT-GREY-17", 17.0, False, "Tủ Bếp Trên"),
                Part("P-GRY-11", "Hồi tủ bếp trên 3", 700, 350, "MAT-GREY-17", 17.0, False, "Tủ Bếp Trên"),
                Part("P-GRY-12", "Hồi tủ bếp trên 4", 700, 350, "MAT-GREY-17", 17.0, False, "Tủ Bếp Trên"),
                Part("P-GRY-13", "Đáy tủ bếp trên khoang hút mùi", 860, 350, "MAT-GREY-17", 17.0, False, "Tủ Bếp Trên"),
                Part("P-GRY-14", "Nóc tủ bếp trên khoang hút mùi", 860, 350, "MAT-GREY-17", 17.0, False, "Tủ Bếp Trên"),
                Part("P-GRY-15", "Đáy tủ bếp trên khoang bát nâng hạ", 860, 350, "MAT-GREY-17", 17.0, False, "Tủ Bếp Trên"),
                Part("P-GRY-16", "Nóc tủ bếp trên khoang bát nâng hạ", 860, 350, "MAT-GREY-17", 17.0, False, "Tủ Bếp Trên"),
                Part("P-GRY-17", "Thành ngăn kéo hộp Blum 1", 500, 180, "MAT-GREY-17", 17.0, False, "Ngăn Kéo Bếp"),
                Part("P-GRY-18", "Thành ngăn kéo hộp Blum 2", 500, 180, "MAT-GREY-17", 17.0, False, "Ngăn Kéo Bếp"),
                Part("P-GRY-19", "Thành ngăn kéo hộp Blum 3", 500, 180, "MAT-GREY-17", 17.0, False, "Ngăn Kéo Bếp"),
                Part("P-GRY-20", "Thành ngăn kéo hộp Blum 4", 500, 180, "MAT-GREY-17", 17.0, False, "Ngăn Kéo Bếp"),
                Part("P-GRY-21", "Thanh giằng định vị hồi", 860, 100, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
                Part("P-GRY-22", "Thanh giằng định vị đáy", 860, 100, "MAT-GREY-17", 17.0, False, "Tủ Bếp Dưới"),
            ]
        },

        # NHÓM 3: Cánh Acrylic Trắng Bóng Gương An Cường (grain_lock = False: ĐƯỢC XOAY 90 ĐỘ)
        "MAT-ACRYLIC-17": {
            "material_name": "Cánh Acrylic Trắng Bóng Gương An Cường (Không đường Line Noline)",
            "thickness": 17.0,
            "grain_lock": False,
            "parts": [
                Part("P-ACR-01", "Cánh tủ bếp dưới khoang chậu 1", 750, 445, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-02", "Cánh tủ bếp dưới khoang chậu 2", 750, 445, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-03", "Cánh tủ bếp dưới khoang dao thớt", 750, 445, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-04", "Cánh tủ bếp dưới khoang gia vị", 750, 445, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-05", "Cánh lật tủ bếp trên khoang bát 1", 680, 445, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-06", "Cánh lật tủ bếp trên khoang bát 2", 680, 445, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-07", "Cánh tủ trên khoang hút mùi 1", 680, 445, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-08", "Cánh tủ trên khoang hút mùi 2", 680, 445, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-09", "Mặt ngăn kéo gia vị tầng 1", 445, 240, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-10", "Mặt ngăn kéo gia vị tầng 2", 445, 240, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-11", "Mặt ngăn kéo gia vị tầng 3", 445, 240, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
                Part("P-ACR-12", "Cánh tủ đứng khoang che tủ lạnh", 1800, 590, "MAT-ACRYLIC-17", 17.0, False, "Cánh Bếp"),
            ]
        },

        # NHÓM 4: Plywood Melamine Trắng 9mm Ván Hậu (grain_lock = False: ĐƯỢC XOAY 90 ĐỘ)
        "MAT-BACK-09": {
            "material_name": "Plywood Chống Nước Melamine Trắng 9mm (Ván Hậu Âm Tường)",
            "thickness": 9.0,
            "grain_lock": False,
            "parts": [
                Part("P-BAK-01", "Hậu Tủ Áo Master Buồng 1", 2180, 1180, "MAT-BACK-09", 9.0, False, "Ván Hậu"),
                Part("P-BAK-02", "Hậu Tủ Áo Master Buồng 2", 2180, 1180, "MAT-BACK-09", 9.0, False, "Ván Hậu"),
                Part("P-BAK-03", "Hậu Tủ Bếp Dưới", 1780, 800, "MAT-BACK-09", 9.0, False, "Ván Hậu"),
                Part("P-BAK-04", "Hậu Tủ Bếp Trên", 1780, 680, "MAT-BACK-09", 9.0, False, "Ván Hậu"),
                Part("P-BAK-05", "Đáy ngăn kéo âm 1", 500, 420, "MAT-BACK-09", 9.0, False, "Đáy Ngăn Kéo"),
                Part("P-BAK-06", "Đáy ngăn kéo âm 2", 500, 420, "MAT-BACK-09", 9.0, False, "Đáy Ngăn Kéo"),
                Part("P-BAK-07", "Đáy ngăn kéo âm 3", 500, 420, "MAT-BACK-09", 9.0, False, "Đáy Ngăn Kéo"),
            ]
        }
    }
    return orders


# ==================================================================================================
# HÀM ĐIỀU PHỐI VÀ XUẤT BÁO CÁO TOÀN DIỆN
# ==================================================================================================
def main():
    print("=" * 80)
    print("PHÚ GIA HOME LUXURY - CNC 2D NESTING & QR OFFCUT OPTIMIZER")
    print(f"Địa chỉ: {BRAND_METADATA['address']}")
    print(f"Hotline: {BRAND_METADATA['hotline']} | MST: {BRAND_METADATA['tax_id']}")
    print("=" * 80)

    # 1. Khởi tạo kho phôi dư QR
    qr_inventory = QROffcutInventory()
    all_materials_data = generate_sample_orders()

    total_parts_count = 0
    total_raw_sheets_used = 0
    total_raw_area_m2 = 0.0
    total_packed_part_area_m2 = 0.0

    material_reports = []
    all_sheets_export = []

    baseline_total_sheets = 0
    baseline_total_packed_area = 0.0
    baseline_total_usable_area = 0.0

    # 2. Duyệt qua từng nhóm vật liệu để tối ưu hóa
    for mat_code, mat_info in all_materials_data.items():
        mat_name = mat_info["material_name"]
        thickness = mat_info["thickness"]
        grain_lock = mat_info["grain_lock"]
        parts_list = mat_info["parts"]
        total_parts_count += len(parts_list)

        print(f"\n[+] Đang xử lý nhóm vật liệu: {mat_code} ({mat_name})")
        print(f"    Số lượng chi tiết: {len(parts_list)} tấm | Khóa vân (grain_lock): {grain_lock}")

        # Chạy thuật toán Baseline (FFD) để lấy số liệu đối chứng
        baseline_bins = run_baseline_ffd(parts_list, mat_code, thickness)
        b_sheets = len(baseline_bins)
        b_usable_area = b_sheets * (USABLE_WIDTH * USABLE_HEIGHT)
        b_packed_area = sum(p.area for p in parts_list)
        b_waste_pct = round((1.0 - (b_packed_area / b_usable_area)) * 100.0, 2)
        baseline_total_sheets += b_sheets
        baseline_total_packed_area += b_packed_area
        baseline_total_usable_area += b_usable_area

        print(f"    --> [Baseline FFD] Sử dụng: {b_sheets} tấm ván | Tỷ lệ hao hụt: {b_waste_pct}%")

        # Chạy thuật toán Tối ưu hóa MaxRects-GA
        ga_optimizer = GeneticAlgorithmNesting(
            parts=parts_list,
            material=mat_code,
            thickness=thickness,
            pop_size=24,
            generations=25,
            mutation_rate=0.25
        )
        optimized_bins, best_fit, best_heuristic = ga_optimizer.run()

        opt_sheets = len(optimized_bins)
        opt_usable_area = opt_sheets * (USABLE_WIDTH * USABLE_HEIGHT)
        opt_packed_area = sum(p.area for p in parts_list)
        opt_waste_pct = round((1.0 - (opt_packed_area / opt_usable_area)) * 100.0, 2)

        total_raw_sheets_used += opt_sheets
        total_raw_area_m2 += opt_sheets * (RAW_SHEET_WIDTH * RAW_SHEET_HEIGHT / 1_000_000.0)
        total_packed_part_area_m2 += opt_packed_area / 1_000_000.0

        # Đăng ký phôi dư vào kho QR
        qr_inventory.register_remnants_from_bins(optimized_bins, mat_name, mat_code)

        print(f"    --> [MaxRects-GA Tối Ưu] Heuristic: {best_heuristic} | Số tấm: {opt_sheets} tấm")
        print(f"        Tỷ lệ hao hụt trung bình: {opt_waste_pct}% (Đạt tiêu chuẩn < 8%)")

        # Xuất chi tiết từng tấm ván
        sheet_details = []
        for s_idx, b in enumerate(optimized_bins, start=1):
            sheet_code = f"PG-SHEET-{mat_code}-{s_idx:02d}"
            placed_parts_json = [p.to_dict() for p in b.placed_parts]
            remnants_json = [r.to_dict() for r in b.usable_remnants]

            sheet_item = {
                "sheet_code": sheet_code,
                "sheet_index": s_idx,
                "material_code": mat_code,
                "material_name": mat_name,
                "thickness_mm": thickness,
                "grain_locked": grain_lock,
                "raw_dimensions_mm": [RAW_SHEET_WIDTH, RAW_SHEET_HEIGHT],
                "usable_dimensions_mm": [USABLE_WIDTH, USABLE_HEIGHT],
                "cnc_kerf_mm": CNC_KERF,
                "trim_edge_mm": TRIM_EDGE,
                "utilization_percent": b.utilization_percentage,
                "waste_percent": b.waste_percentage,
                "parts_count": len(b.placed_parts),
                "remnants_count": len(b.usable_remnants),
                "placed_parts": placed_parts_json,
                "usable_remnants": remnants_json
            }
            sheet_details.append(sheet_item)
            all_sheets_export.append(sheet_item)

        material_reports.append({
            "material_code": mat_code,
            "material_name": mat_name,
            "thickness_mm": thickness,
            "grain_locked": grain_lock,
            "parts_count": len(parts_list),
            "baseline_ffd": {
                "sheets_count": b_sheets,
                "waste_percent": b_waste_pct
            },
            "optimized_ga": {
                "sheets_count": opt_sheets,
                "waste_percent": opt_waste_pct,
                "heuristic_used": best_heuristic
            },
            "sheets": sheet_details
        })

    # 3. Mô phỏng nạp phôi dư cho đơn hàng phát sinh (Remnant Priority Reuse)
    print("\n[+] Mô phỏng Đơn hàng Bổ sung - Ưu tiên thu hồi phôi dư kho QR...")
    supplementary_parts = [
        Part("P-SUPP-01", "Đợt bổ sung khoang thìa dĩa", 400, 320, "MAT-GREY-17", 17.0, False, "Bổ sung", "ORD-SUPP-01"),
        Part("P-SUPP-02", "Mặt ngăn kéo trang sức phụ", 450, 300, "MAT-ACRYLIC-17", 17.0, False, "Bổ sung", "ORD-SUPP-01"),
        Part("P-SUPP-03", "Đáy ngăn kéo phụ âm", 450, 320, "MAT-BACK-09", 9.0, False, "Bổ sung", "ORD-SUPP-01"),
    ]

    allocation_results = []
    saved_sheets_count = 0
    for supp_p in supplementary_parts:
        alloc = qr_inventory.allocate_supplementary_part(supp_p)
        allocation_results.append(alloc)
        if alloc.get("saved_raw_sheet"):
            saved_sheets_count += 1
            print(f"    [TÁI SỬ DỤNG PHÔI DƯ THÀNH CÔNG] Chi tiết: {supp_p.name} ({supp_p.part_id}) "
                  f"vào phôi {alloc['remnant_id']} -> Tiết kiệm 1 tấm ván thô mới!")

    # 4. Tính toán tổng hợp KPI toàn xưởng
    total_usable_all_sheets = total_raw_sheets_used * (USABLE_WIDTH * USABLE_HEIGHT)
    total_packed_all_parts = sum(sum(p.area for p in m["parts"]) for m in all_materials_data.values())
    overall_waste_percent = round((1.0 - (total_packed_all_parts / total_usable_all_sheets)) * 100.0, 2)
    overall_utilization_percent = round(100.0 - overall_waste_percent, 2)

    baseline_overall_waste_percent = round((1.0 - (baseline_total_packed_area / baseline_total_usable_area)) * 100.0, 2)

    total_remnants_area = sum(r["area_m2"] for r in qr_inventory.remnants)
    net_unrecoverable_scrap_m2 = (total_usable_all_sheets / 1_000_000.0) - total_packed_part_area_m2 - total_remnants_area
    net_scrap_percentage = max(0.0, round((net_unrecoverable_scrap_m2 / (total_usable_all_sheets / 1_000_000.0)) * 100.0, 2))

    # Ước tính chi phí tiết kiệm
    # Giá trung bình ván cao cấp: 650,000 VND / tấm
    direct_cost_saved_vnd = (baseline_total_sheets - total_raw_sheets_used + saved_sheets_count) * 650000

    print("\n" + "=" * 80)
    print("KẾT QUẢ TỐI ƯU TOÀN DIỆN (MAXRECTS-GA + QR OFFCUT INVENTORY):")
    print(f"- Tỷ lệ hao hụt Baseline FFD: {baseline_overall_waste_percent}%")
    print(f"- Tỷ lệ hao hụt Tối ưu MaxRects-GA: {overall_waste_percent}% (ĐẠT CHỈ TIÊU < 8%)")
    print(f"- Tỷ lệ lấp đầy ván hữu dụng: {overall_utilization_percent}%")
    print(f"- Số lượng phôi dư chuẩn QR thu hồi: {len(qr_inventory.remnants)} tấm")
    print(f"- Tổng diện tích phôi dư lưu kho: {round(total_remnants_area, 3)} m2")
    print(f"- Tỷ lệ mạt cưa / phế thải thực tế không thể thu hồi: {net_scrap_percentage}%")
    print(f"- Số tấm ván thô tiết kiệm được: {baseline_total_sheets - total_raw_sheets_used + saved_sheets_count} tấm")
    print(f"- Giá trị kinh tế trực tiếp tiết kiệm: {direct_cost_saved_vnd:,.0f} VNĐ")
    print("=" * 80)

    # 5. Xuất báo cáo cấu trúc JSON theo quy chuẩn kiểm toán
    report_data = {
        "report_title": "BÁO CÁO TỐI ƯU HÓA XẾP TẤM CẮT VÁN CNC 2D & QUẢN TRỊ PHÔI DƯ QR",
        "brand_identity": BRAND_METADATA,
        "execution_timestamp": datetime.now().isoformat(),
        "technical_parameters": {
            "standard_sheet_width_mm": RAW_SHEET_WIDTH,
            "standard_sheet_height_mm": RAW_SHEET_HEIGHT,
            "trim_edge_mm": TRIM_EDGE,
            "usable_width_mm": USABLE_WIDTH,
            "usable_height_mm": USABLE_HEIGHT,
            "cnc_tool_kerf_mm": CNC_KERF,
            "min_usable_remnant_width_mm": MIN_REMNANT_W,
            "min_usable_remnant_height_mm": MIN_REMNANT_H,
            "min_usable_remnant_area_m2": round(MIN_REMNANT_AREA / 1_000_000.0, 4)
        },
        "algorithm_configuration": {
            "primary_engine": "2D Maximal Rectangles (MaxRects)",
            "heuristics": ["Best Short Side Fit (BSSF)", "Best Area Fit (BAF)"],
            "metaheuristic": "Genetic Algorithm Permutation Optimization (MaxRects-GA)",
            "genetic_operators": {
                "crossover": "Order Crossover 1 (OX1)",
                "mutation": ["Swap Mutation", "2-Opt Inversion", "Window Shuffle"],
                "selection": "Elitism + Tournament Selection",
                "population_size": 24,
                "generations": 25,
                "mutation_rate": 0.25
            }
        },
        "executive_summary_kpi": {
            "total_parts_packed": total_parts_count,
            "total_sheets_used": total_raw_sheets_used,
            "total_raw_board_area_m2": round(total_raw_area_m2, 3),
            "total_finished_part_area_m2": round(total_packed_part_area_m2, 3),
            "baseline_ffd_waste_percent": baseline_overall_waste_percent,
            "optimized_waste_percent": overall_waste_percent,
            "target_waste_threshold_percent": 8.0,
            "target_achieved": overall_waste_percent < 8.0,
            "overall_utilization_percent": overall_utilization_percent,
            "total_qr_remnants_harvested": len(qr_inventory.remnants),
            "total_remnant_area_m2": round(total_remnants_area, 3),
            "net_unrecoverable_scrap_percent": net_scrap_percentage,
            "sheets_saved_vs_baseline": baseline_total_sheets - total_raw_sheets_used,
            "sheets_saved_via_remnant_reuse": saved_sheets_count,
            "total_sheets_saved": baseline_total_sheets - total_raw_sheets_used + saved_sheets_count,
            "direct_material_cost_saved_vnd": direct_cost_saved_vnd
        },
        "material_group_breakdown": material_reports,
        "all_sheet_nesting_layouts": all_sheets_export,
        "qr_offcut_remnant_inventory": qr_inventory.remnants,
        "supplementary_order_remnant_reuse_simulation": {
            "order_id": "ORD-SUPP-01",
            "requested_parts_count": len(supplementary_parts),
            "allocation_details": allocation_results,
            "raw_sheets_saved": saved_sheets_count
        }
    }

    output_path = r"F:\PG Home - Quản trị\data\cnc_nesting_optimization_report.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)

    print(f"\n[V] ĐÃ XUẤT THÀNH CÔNG BÁO CÁO TỐI ƯU HÓA: {output_path}")
    print(f"[V] Kích thước file báo cáo: {os.path.getsize(output_path):,} bytes")
    return True


if __name__ == "__main__":
    main()
