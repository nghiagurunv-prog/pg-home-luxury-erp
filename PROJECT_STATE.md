# 🏛️ SỔ CÁI BỘ NHỚ NGOÀI BẤT TỬ — HỆ THỐNG QUẢN TRỊ & TÀI CHÍNH PG HOME LUXURY
> **Cập nhật lần cuối**: 14/11/2026 (`v40_FORENSIC_3T_SECURITY_AND_DEPLOY` — Rà soát pháp y 3T toàn diện, vá lỗ hổng Prototype Pollution & Sanitized-Payload Overwrite trên `api/index.js` + `web_app/server.py`, sửa lỗi đồng bộ chấm công Zalo 31 ngày (`dNum <= 31`), nâng cấp `web_app/sw.js` `v40` định tuyến `/api/` Network-First & sửa 5 tên file precache `w53–w57`, đưa số biến `let`/`const` cấp cao nhất về `0/0` trên cả `web_app/app.js` và `local_admin_vault/director_app_full.js`, đồng bộ `app.js.gz` và Deploy lên GitHub Pages) | **Trạng thái**: 100% PRODUCTION READY (`W01`–`W57`)  
> **Lịch sử chi tiết các đợt cũ**: Xem tại [`PROJECT_HISTORY_ARCHIVE.md`](file:///F:/PG%20Home%20-%20Quản%20trị/PROJECT_HISTORY_ARCHIVE.md) (chỉ tra cứu khi cần đối chiếu lịch sử sâu).

---

## 🎯 1. MỤC TIÊU & CHỈ THỊ TỐI CAO CỦA BỐ
1. **Pháp lý & Thương hiệu Chuẩn Duy Nhất**:
   - **Thương hiệu**: **CÔNG TY CP PHÚ GIA VIỆT NAM** / **PG HOME LUXURY** (`Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng`).
   - **Mã số thuế / ĐKKD**: **`042203002931`** (Đại diện: Nguyễn Trọng Nghĩa).
   - **Địa chỉ chuẩn (Bố chốt 13/11/2026)**:
     + **Xưởng sản xuất Nội thất Phú Gia**: **Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh**
     + **Văn phòng**: **35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh**
     + *(CẤM gọi là `"xưởng mộc"`, CẤM dùng danh xưng `"Tổ hợp"`, CẤM dùng `35 Ngô Đức Kế` hay `Hàm Nghi`)*.
   - **Hotline chuẩn duy nhất**: **`0986.722.324`**.
2. **Kiến trúc 2 Phiên Bản & Khóa Cứng Giao Diện Gốc (`UI_GOLDEN_BASELINE_V1`)**:
   - **Cổng Nội Bộ Giám Đốc (`http://127.0.0.1:8080/director`, `http://127.0.0.1:8080/`)**: Khóa Loopback `127.0.0.1:8080` chỉ mình Bố dùng trên máy này (`local_admin_vault/` — đủ **55 module JS** gồm `w01–w04`, `w38`, `w45`, trọn bộ CCSC 12 tháng, `Col BG`, Quỹ Hòa & Hào `20.000 đ/công`, Thưởng doanh số `> 500M`).
   - **Bản Online Cho Anh Em Công Ty (`web_app/` + `api/index.js` trên Vercel & GitHub Pages)**: Cách ly vật lý **100%** bí mật CCSC/BGĐ (`49 module JS` sạch trong `web_app/modules/`, **0 byte** mã nguồn `w01–w04/w38/w45` & `ccscMonths`), đồng bộ dữ liệu thời gian thực cho Khối Văn Phòng (Hiệp & Dũng) và Khối Xưởng SX (Vũ, Thái & Đội Thợ).
   - **Mã PIN Giám Đốc**: Giữ nguyên mã quen thuộc của Bố (`0986` & `2026`) xác thực qua băm **SHA-256** (`Zero-Plaintext PIN` + `HMAC-SHA256` ký phiên).
   - **Khóa Cứng Giao Diện (`UI_GOLDEN_BASELINE_V1`)**: Giữ nguyên bố cục chuẩn, cấu trúc bảng 1 dòng (`.pg-compact-row`, `.data-table`) và thanh điều hướng `#mainNavMenu`.
3. **Định mức Tài chính & Quản trị Bất biến (`55 / 40 / 15` & Trần Báo Giá `<= 54%`)**:
   - **Cấu trúc giá vốn chuẩn**: Giá vốn tối đa **`55%`** (Chốt chặn xuất báo giá `<= 54%`) | Khoán vật tư xưởng **`40%`** phần gỗ `woodVal` | Khoán công thợ **`15%`**.
   - **Trần chi phí Marketing**: Tối đa **`4%`** doanh thu.

---

## 📊 2. TIẾN ĐỘ THỰC TẾ ĐÃ KIỂM CHỨNG VẬT LÝ TRÊN Ổ CỨNG (`v40_FORENSIC_3T_SECURITY_AND_DEPLOY`)
| Phân hệ | Đường dẫn chính | Trạng thái & Thông số Vật lý Thực tế |
| :--- | :--- | :--- |
| **Cổng Local Giám Đốc (`55 Modules`)** | [`director_ccsc_full.html`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_ccsc_full.html), [`director_app_full.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/local_admin_vault/director_app_full.js) | **100% Loopback `127.0.0.1:8080`** — Đóng gói `local_admin_vault/modules/pg_w50_master.bundle.js` (`2.191 KB` + `.gz`), `0/0` top-level `let`/`const` (Zero-TDZ), tích hợp KPI Ribbon (`w01`), Khóa sổ kỳ kế toán CCSC (`w02`), Quỹ Hòa & Hào động (`w03`), Thưởng `>500M` (`w04`). |
| **Bản Cloud Nhân Viên (`49 Modules`)** | [`web_app/index.html`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/index.html), [`pg_w50_master.bundle.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/modules/pg_w50_master.bundle.js) | **0 Byte Rò Rỉ CCSC** — Đóng gói `web_app/modules/pg_w50_master.bundle.js` (`2.071 KB` + `.gz`) + `web_app/app.js.gz` (`146 KB`), `0/0` top-level `let`/`const` (Zero-TDZ), chống ghi đè dữ liệu CCSC/Admin khi Cloud client lưu state, định tuyến `/api/` Network-First trong `sw.js` (`v40`). |
| **SQLite WAL & Chuỗi Băm Nhật Ký** | [`data/pg_home_state_wal.db`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/data/pg_home_state_wal.db), [`web_app/server.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/web_app/server.py) | **100% WAL + Hash-Chained Audit Log** — Sổ nhật ký bất biến nối chuỗi SHA-256 (`/api/audit-log`), chống Prototype Pollution (`PROTO_KEYS`), sao lưu nóng tự động tại `data/backups/`. |
| **Cổng Kiểm Định Tự Động (`Gatekeeper`)** | [`tools/sop_pre_response_gate.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/sop_pre_response_gate.py) | **7/7 Cổng PASS (`110/110 file .js = 0 SyntaxError`, `0 TDZ/TypeError`, `Exit=0`)** — Kiểm chứng trực tiếp cả 8 URL Localhost `200 OK`, `/data/ccsc_*` `403 Forbidden`, và Cloud GitHub Pages `200 OK`. |

---

## ⛔ 3. CÁC RÀNG BUỘC & LỖI CẤM TÁI PHẠM
- **LUẬT SẮT CHỐNG HỒI QUY (`ZERO-REGRESSION & SURGICAL EDIT HARD-LOCK` — Bố chốt 14/11/2026)**:
  + Khi sửa bất kỳ tính năng nào, chỉ được sửa cô lập đúng phạm vi tính năng đó (`Surgical Edit`); **CẤM TUYỆT ĐỐI** làm ảnh hưởng đến dữ liệu dự án và các chức năng khác liên quan (Menu `#sidebar` 16 mục/5 nhóm, 15 `.tab-content`, Topbar controls, Dashboard, CCSC, Vật tư/PO, Hợp đồng, Công nợ, Dự toán, Chấm công, Zalo Sync).
  + **CẤM** khai báo `let`/`const` ở giữa file cho biến trạng thái được gọi bởi `loadState()` / `DOMContentLoaded` gây lỗi `ReferenceError (TDZ)` làm chết dây chuyền toàn bộ sự kiện click Menu và các bảng khác.
  + Mọi lần sửa đều phải vượt qua **Cổng 5 [`Zero-Regression & Feature Integrity`]** và bộ kiểm thử thực thi [`scratch/deep_forensic_3t_audit.js`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/scratch/deep_forensic_3t_audit.js) tích hợp trong [`tools/sop_pre_response_gate.py`](file:///f:/PG%20Home%20-%20Qu%E1%BA%A3n%20tr%E1%BB%8B/tools/sop_pre_response_gate.py).
- **CẤM** đọc toàn bộ file lớn (`index.html`, `w50_master_hub_loader.js`, `PROJECT_HISTORY_ARCHIVE.md`); bắt buộc chạy `fast_lookup.py` lấy dòng mục tiêu rồi đọc 1 lần (`Single-Pass Read <= 2 lần/file`).
- **CẤM** gọi `Model="pro"` cho Sub-Agent (bắt buộc `100% Model="flash"`) và **CẤM** gọi `schedule` timer để ngồi chờ Sub-Agent.
- **CẤM** kill tiến trình `server.py` đang chạy ngầm phục vụ Bố.
- **CẤM** gọi `read_file` lên ảnh `.png/.jpg`; bắt buộc dùng `python "C:\Users\Admin\.gemini\fast_ocr.py" "<đường_dẫn_ảnh>"`.

---

## 📋 4. VIỆC CẦN LÀM TIẾP THEO (NEXT ACTIONS)
- Duy trì trạng thái `PASS 100%` trên `sop_pre_response_gate.py`.
- Khi Bố yêu cầu tra cứu số liệu tài chính/nhân sự/công nợ: Truy vấn trực tiếp SQLite (`pg_home_state_wal.db` / `pg_knowledge_vault.db`) và trả lời trong `< 15 giây`.
