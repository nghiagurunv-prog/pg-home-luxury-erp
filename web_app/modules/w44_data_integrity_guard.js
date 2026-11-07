/**
 * =========================================================================================
 * PG HOME LUXURY - DATA INTEGRITY GUARD (MODULE W44)
 * =========================================================================================
 * Tên module: window.PG_Modules_W44 (w44_data_integrity_guard.js)
 * Tác giả: Công nhân Flash W44 (Kiểm soát tính toàn vẹn dữ liệu & bảo vệ dòng tiền)
 * Phiên bản: 1.0.0 (Chuẩn hóa ngày 08/11/2026)
 *
 * MỤC TIÊU & NHIỆM VỤ:
 * 1. Chốt chặn trước mọi lệnh gửi tới `/api/save-state`:
 *    - Ngăn chặn triệt để các giá trị `NaN`, `Infinity`, `null`, `undefined` hoặc chuỗi "NaN"
 *      làm hỏng bảng tính CCSC 12 tháng, lương thợ, chi phí quản lý và báo cáo tài chính.
 * 2. Bảo vệ danh sách nhân sự (workers) và dự án (contracts / xuongRecords):
 *    - Tuyệt đối CẤM tình trạng lưu mảng rỗng (wipe-out) làm mất danh sách thợ, tài khoản users,
 *      dự án xưởng hoặc hợp đồng khách hàng.
 * 3. Chuẩn hóa công thức cốt tử PG Home:
 *    - Công thức CCSC: Tổng doanh số = Tiền mặt + Công nợ.
 *    - Công thức bóc tách xưởng: woodVal = contractVal - solidVal - pkVal (loại bỏ đồ gỗ thịt và phụ kiện).
 *    - Công thức lương thợ: Tổng lương = (Lương ngày + OT + Phụ cấp) - Tạm ứng.
 * 4. Tự động hóa & Khả năng can thiệp ngầm (Stealth & Zero-Disruption):
 *    - Cung cấp `attachFetchInterceptor()` để tự động lọc và bảo vệ mọi request `fetch('/api/save-state')`.
 *    - Hỗ trợ cả môi trường Browser (window) và Node.js test runner.
 * =========================================================================================
 */

(function (global) {
  'use strict';

  // Mã lỗi chuẩn hóa (Audit Error Codes)
  const ERROR_CODES = {
    CORRUPTED_PAYLOAD: 'W44_CORRUPTED_PAYLOAD',
    FATAL_EMPTY_COLLECTION: 'W44_FATAL_EMPTY_COLLECTION',
    NAN_NUMERIC_FIELD: 'W44_NAN_NUMERIC_FIELD',
    FORMULA_MISMATCH: 'W44_FORMULA_MISMATCH',
    MISSING_REQUIRED_ROOT_KEY: 'W44_MISSING_REQUIRED_ROOT_KEY',
    UNAUTHORIZED_USER_MODIFICATION: 'W44_UNAUTHORIZED_USER_MODIFICATION'
  };

  /**
   * Kiểm tra một giá trị có phải là số thực hợp lệ (không phải NaN, Infinity, -Infinity)
   */
  function isCleanNumber(val) {
    if (val === null || val === undefined || val === '') return false;
    const num = Number(val);
    return typeof num === 'number' && !Number.isNaN(num) && Number.isFinite(num);
  }

  /**
   * Chuyển đổi an toàn về số thực, nếu lỗi hoặc NaN thì trả về giá trị mặc định fallback
   */
  function toSafeNumber(val, fallback = 0) {
    if (val === null || val === undefined || val === '') return fallback;
    if (typeof val === 'string' && (val.trim().toLowerCase() === 'nan' || val.trim().toLowerCase() === 'null')) {
      return fallback;
    }
    const num = Number(val);
    return (!Number.isNaN(num) && Number.isFinite(num)) ? num : fallback;
  }

  /**
   * Deep clone an toàn không làm mất kiểu dữ liệu cơ bản
   */
  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    try {
      return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'number' && (Number.isNaN(value) || !Number.isFinite(value))) {
          return 0; // Tự động dọn dẹp NaN thành 0 khi serialize
        }
        return value;
      }));
    } catch (e) {
      console.error('[W44 Data Integrity Guard] Deep clone error:', e);
      return Object.assign({}, obj);
    }
  }

  /**
   * Lớp ngoại lệ khi phát hiện vi phạm tính toàn vẹn dữ liệu nghiêm trọng
   */
  class DataIntegrityViolationError extends Error {
    constructor(message, details = {}) {
      super(message);
      this.name = 'DataIntegrityViolationError';
      this.code = details.code || ERROR_CODES.CORRUPTED_PAYLOAD;
      this.errors = details.errors || [];
      this.warnings = details.warnings || [];
      this.timestamp = new Date().toISOString();
    }
  }

  // =========================================================================================
  // BỘ KIỂM TOÁN VÀ BẢO VỆ TỪNG PHÂN HỆ DỮ LIỆU
  // =========================================================================================

  /**
   * 1. Kiểm tra & chuẩn hóa bảng phân bổ CCSC 12 tháng
   */
  function auditCCSCMonths(months, errors, warnings, options) {
    if (!Array.isArray(months)) {
      errors.push({
        code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
        field: 'ccscMonths',
        message: 'ccscMonths bắt buộc phải là một mảng (Array) gồm 12 tháng.'
      });
      return [];
    }

    if (months.length === 0) {
      errors.push({
        code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
        field: 'ccscMonths',
        message: 'ccscMonths không được để trống (nguy cơ xóa sổ toàn bộ kế hoạch tài chính CCSC).'
      });
      return [];
    }

    const numericFields = ['sales', 'debt', 'cash', 'bld', 'hiep_cb', 'hiep_sale', 'bpkd', 'qlx', 'thue', 'mkt'];

    const sanitizedMonths = months.map((m, idx) => {
      const cleanMonth = Object.assign({}, m);
      const monthLabel = cleanMonth.name || `Tháng ${cleanMonth.m || idx + 1}`;

      numericFields.forEach(field => {
        const val = cleanMonth[field];
        if (val !== undefined) {
          if (!isCleanNumber(val)) {
            warnings.push({
              code: ERROR_CODES.NAN_NUMERIC_FIELD,
              field: `ccscMonths[${idx}].${field}`,
              message: `Phát hiện giá trị hỏng [${val}] tại ${monthLabel} -> ${field}. Đã tự động khôi phục về 0.`
            });
            cleanMonth[field] = 0;
          } else {
            cleanMonth[field] = toSafeNumber(val, 0);
          }
        }
      });

      // Kiểm toán tính tương thích doanh số: sales = cash + debt (nếu có đủ 3 trường)
      if (cleanMonth.sales !== undefined && cleanMonth.cash !== undefined && cleanMonth.debt !== undefined) {
        const expectedSales = cleanMonth.cash + cleanMonth.debt;
        if (Math.abs(cleanMonth.sales - expectedSales) > 1000) { // Chênh lệch lớn hơn 1,000đ
          warnings.push({
            code: ERROR_CODES.FORMULA_MISMATCH,
            field: `ccscMonths[${idx}]`,
            message: `Cảnh báo đối soát CCSC ${monthLabel}: Doanh số (${cleanMonth.sales.toLocaleString('vi-VN')} đ) lệch so với Tiền mặt + Công nợ (${expectedSales.toLocaleString('vi-VN')} đ).`
          });
        }
      }

      return cleanMonth;
    });

    return sanitizedMonths;
  }

  /**
   * 2. Kiểm tra & bảo vệ danh sách nhân sự / thợ xưởng (workers)
   */
  function auditWorkers(workers, errors, warnings, options) {
    if (!Array.isArray(workers)) {
      errors.push({
        code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
        field: 'workers',
        message: 'Danh sách nhân sự (workers) phải là mảng Array hợp lệ.'
      });
      return [];
    }

    // Chốt chặn sống còn: Nghiêm cấm xóa sạch danh sách thợ
    if (workers.length === 0) {
      errors.push({
        code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
        field: 'workers',
        message: 'NGHIÊM CẤM LƯU DANH SÁCH NHÂN SỰ RỖNG (0 thợ). Lệnh lưu bị chặn để bảo vệ dữ liệu chấm công!'
      });
      return [];
    }

    const workerNumericFields = ['base', 'days', 'daySalary', 'ot', 'allowance', 'advance', 'total'];

    const sanitizedWorkers = workers.map((w, idx) => {
      const cleanW = Object.assign({}, w);
      const workerName = cleanW.name || cleanW.code || `Thợ #${idx + 1}`;

      workerNumericFields.forEach(field => {
        const val = cleanW[field];
        if (!isCleanNumber(val)) {
          warnings.push({
            code: ERROR_CODES.NAN_NUMERIC_FIELD,
            field: `workers[${idx}].${field}`,
            message: `Phát hiện lỗi NaN/null tại thợ ${workerName} [${field} = ${val}]. Đã chuẩn hóa về 0.`
          });
          cleanW[field] = 0;
        } else {
          cleanW[field] = toSafeNumber(val, 0);
        }
      });

      // Kiểm toán công thức lương: total = (daySalary + ot + allowance) - advance
      const calculatedTotal = (cleanW.daySalary + cleanW.ot + cleanW.allowance) - cleanW.advance;
      if (Math.abs(cleanW.total - calculatedTotal) > 100) {
        warnings.push({
          code: ERROR_CODES.FORMULA_MISMATCH,
          field: `workers[${idx}].total`,
          message: `Lệch tổng lương thợ ${workerName}: Dữ liệu ghi nhận = ${cleanW.total.toLocaleString('vi-VN')} đ, công thức chuẩn = ${calculatedTotal.toLocaleString('vi-VN')} đ. Đã tự động hiệu chỉnh.`
        });
        cleanW.total = calculatedTotal;
      }

      return cleanW;
    });

    return sanitizedWorkers;
  }

  /**
   * 3. Kiểm tra & bảo vệ hồ sơ công trình xưởng & hợp đồng (xuongRecords & contracts)
   */
  function auditProjects(xuongRecords, contracts, errors, warnings, options) {
    let sanitizedXuong = [];
    let sanitizedContracts = [];

    // Kiểm tra xuongRecords
    if (xuongRecords !== undefined) {
      if (!Array.isArray(xuongRecords)) {
        errors.push({
          code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
          field: 'xuongRecords',
          message: 'xuongRecords bắt buộc phải là mảng dữ liệu.'
        });
      } else if (xuongRecords.length === 0 && options.originalXuongCount > 0) {
        errors.push({
          code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
          field: 'xuongRecords',
          message: 'Phát hiện nguy cơ mất danh sách dự án xưởng (wipe-out). Chặn lưu mảng rỗng!'
        });
      } else {
        const xuongNumericFields = ['contractVal', 'solidVal', 'woodVal', 'pkVal', 'pct', 'actualXuong', 'debt'];
        sanitizedXuong = xuongRecords.map((rec, idx) => {
          const cleanRec = Object.assign({}, rec);
          const clientName = cleanRec.client || `Dự án #${cleanRec.id || idx + 1}`;

          xuongNumericFields.forEach(field => {
            if (!isCleanNumber(cleanRec[field])) {
              warnings.push({
                code: ERROR_CODES.NAN_NUMERIC_FIELD,
                field: `xuongRecords[${idx}].${field}`,
                message: `Phát hiện lỗi NaN/null tại công trình [${clientName}] - trường [${field}]. Đã phục hồi về 0.`
              });
              cleanRec[field] = 0;
            } else {
              cleanRec[field] = toSafeNumber(cleanRec[field], 0);
            }
          });

          // Luật sắt bóc tách gỗ xưởng: woodVal = contractVal - solidVal - pkVal
          const expectedWoodVal = Math.max(0, cleanRec.contractVal - cleanRec.solidVal - cleanRec.pkVal);
          if (cleanRec.woodVal !== 0 && Math.abs(cleanRec.woodVal - expectedWoodVal) > 1000) {
            warnings.push({
              code: ERROR_CODES.FORMULA_MISMATCH,
              field: `xuongRecords[${idx}].woodVal`,
              message: `Cảnh báo bóc tách gỗ xưởng [${clientName}]: woodVal hiện tại (${cleanRec.woodVal.toLocaleString('vi-VN')} đ) lệch so với [Hợp đồng - Gỗ thịt - Phụ kiện] = ${expectedWoodVal.toLocaleString('vi-VN')} đ.`
            });
          }

          // Kiểm tra tỷ lệ hoàn thành pct (nằm trong khoảng 0.0 -> 1.0 hoặc 0 -> 100)
          if (cleanRec.pct > 1.0 && cleanRec.pct <= 100) {
            cleanRec.pct = cleanRec.pct / 100; // Chuẩn hóa về tỷ lệ thập phân 0.0 -> 1.0
          }

          return cleanRec;
        });
      }
    }

    // Kiểm tra contracts
    if (contracts !== undefined) {
      if (!Array.isArray(contracts)) {
        errors.push({
          code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
          field: 'contracts',
          message: 'contracts bắt buộc phải là mảng dữ liệu.'
        });
      } else if (contracts.length === 0 && options.originalContractCount > 0) {
        errors.push({
          code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
          field: 'contracts',
          message: 'Chặn lưu mảng hợp đồng rỗng (contracts) làm mất hợp đồng của khách hàng.'
        });
      } else {
        const contractNumericFields = ['total', 'wood', 'pk', 'comm'];
        sanitizedContracts = contracts.map((c, idx) => {
          const cleanC = Object.assign({}, c);
          contractNumericFields.forEach(field => {
            if (cleanC[field] !== undefined) {
              if (!isCleanNumber(cleanC[field])) {
                warnings.push({
                  code: ERROR_CODES.NAN_NUMERIC_FIELD,
                  field: `contracts[${idx}].${field}`,
                  message: `Phát hiện lỗi NaN/null tại hợp đồng [${cleanC.code || idx}] - trường [${field}]. Đã đưa về 0.`
                });
                cleanC[field] = 0;
              } else {
                cleanC[field] = toSafeNumber(cleanC[field], 0);
              }
            }
          });
          return cleanC;
        });
      }
    }

    return { sanitizedXuong, sanitizedContracts };
  }

  /**
   * 4. Kiểm tra & bảo vệ tài khoản nhân sự và quyền quản trị (users)
   */
  function auditUsers(users, errors, warnings) {
    if (!Array.isArray(users)) {
      errors.push({
        code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
        field: 'users',
        message: 'Danh sách users bắt buộc phải là một mảng.'
      });
      return [];
    }

    if (users.length === 0) {
      errors.push({
        code: ERROR_CODES.FATAL_EMPTY_COLLECTION,
        field: 'users',
        message: 'NGHIÊM CẤM XÓA SỔ DANH SÁCH USERS (Nguy cơ khóa toàn bộ quyền đăng nhập hệ thống)!'
      });
      return [];
    }

    // Bắt buộc phải có ít nhất 1 tài khoản ADMIN hoạt động
    const hasActiveAdmin = users.some(u => (u.role === 'ADMIN' || u.role === 'Admin') && u.status === 'ACTIVE');
    if (!hasActiveAdmin) {
      errors.push({
        code: ERROR_CODES.UNAUTHORIZED_USER_MODIFICATION,
        field: 'users',
        message: 'Danh sách người dùng bắt buộc phải duy trì ít nhất 01 tài khoản ADMIN trạng thái ACTIVE!'
      });
    }

    return users.map(u => Object.assign({}, u));
  }

  /**
   * 5. Kiểm tra vật tư (materials) và công nợ (debts / supplierDebts)
   */
  function auditMaterialsAndDebts(materials, debts, supplierDebts, warnings) {
    let cleanMaterials = [];
    if (Array.isArray(materials)) {
      cleanMaterials = materials.map((m, idx) => {
        const c = Object.assign({}, m);
        ['qty', 'price'].forEach(f => {
          if (!isCleanNumber(c[f])) {
            warnings.push({
              code: ERROR_CODES.NAN_NUMERIC_FIELD,
              field: `materials[${idx}].${f}`,
              message: `Vật tư [${c.code || idx}] bị hỏng trường ${f}. Đã khôi phục về 0.`
            });
            c[f] = 0;
          } else {
            c[f] = toSafeNumber(c[f], 0);
          }
        });
        return c;
      });
    }

    let cleanDebts = [];
    if (Array.isArray(debts)) {
      cleanDebts = debts.map((d, idx) => {
        const c = Object.assign({}, d);
        ['total', 'p1', 'p2', 'p3', 'collected', 'remain'].forEach(f => {
          if (c[f] !== undefined) {
            c[f] = toSafeNumber(c[f], 0);
          }
        });
        return c;
      });
    }

    let cleanSupplierDebts = [];
    if (Array.isArray(supplierDebts)) {
      cleanSupplierDebts = supplierDebts.map((s, idx) => {
        const c = Object.assign({}, s);
        if (c.debt !== undefined) {
          c.debt = toSafeNumber(c.debt, 0);
        }
        return c;
      });
    }

    return { cleanMaterials, cleanDebts, cleanSupplierDebts };
  }

  // =========================================================================================
  // MODULE CỐT LÕI - WINDOW.PG_MODULES_W44
  // =========================================================================================

  const PG_Modules_W44 = {
    moduleName: 'PG_Modules_W44_DataIntegrityGuard',
    version: '1.0.0',
    description: 'Chốt chặn kiểm toán tính toàn vẹn dữ liệu trước mọi lệnh /api/save-state',
    author: 'Công nhân Flash W44',

    /**
     * Hàm kiểm tra một số có hợp lệ hay không
     */
    isCleanNumber: isCleanNumber,

    /**
     * Hàm chuyển đổi an toàn sang số
     */
    toSafeNumber: toSafeNumber,

    /**
     * Đệ quy làm sạch toàn bộ các giá trị NaN trong bất kỳ Object/Array nào
     */
    deepCleanNaN: function (target) {
      if (target === null || target === undefined) return target;
      if (typeof target === 'number') {
        return (Number.isNaN(target) || !Number.isFinite(target)) ? 0 : target;
      }
      if (typeof target === 'string') {
        if (target.trim().toLowerCase() === 'nan') return 0;
        return target;
      }
      if (Array.isArray(target)) {
        return target.map(item => this.deepCleanNaN(item));
      }
      if (typeof target === 'object') {
        const result = {};
        for (const key of Object.keys(target)) {
          result[key] = this.deepCleanNaN(target[key]);
        }
        return result;
      }
      return target;
    },

    /**
     * Kiểm toán và làm sạch toàn diện một state trước khi phát lệnh lưu
     * @param {Object} rawState Đối tượng live state cần lưu
     * @param {Object} options Cấu hình kiểm toán tùy chọn
     * @returns {Object} { isValid, isFatal, errors, warnings, sanitizedState, auditSummary }
     */
    validateState: function (rawState, options = {}) {
      const errors = [];
      const warnings = [];

      if (!rawState || typeof rawState !== 'object') {
        return {
          isValid: false,
          isFatal: true,
          errors: [{
            code: ERROR_CODES.CORRUPTED_PAYLOAD,
            field: 'root',
            message: 'Dữ liệu State rỗng hoặc không phải định dạng Object JSON hợp lệ.'
          }],
          warnings: [],
          sanitizedState: null,
          auditSummary: { status: 'REJECTED_EMPTY_PAYLOAD' }
        };
      }

      // Tạo bản sao làm sạch sâu trước các giá trị NaN
      const cleanState = this.deepCleanNaN(deepClone(rawState));

      // 1. Kiểm toán CCSC 12 tháng
      if (cleanState.ccscMonths) {
        cleanState.ccscMonths = auditCCSCMonths(cleanState.ccscMonths, errors, warnings, options);
      } else {
        warnings.push({
          code: ERROR_CODES.MISSING_REQUIRED_ROOT_KEY,
          field: 'ccscMonths',
          message: 'Khuyến cáo: Thiếu phân hệ ccscMonths trong đối tượng lưu.'
        });
      }

      // 2. Kiểm toán danh sách nhân sự (workers)
      if (cleanState.workers) {
        cleanState.workers = auditWorkers(cleanState.workers, errors, warnings, options);
      } else {
        warnings.push({
          code: ERROR_CODES.MISSING_REQUIRED_ROOT_KEY,
          field: 'workers',
          message: 'Cảnh báo: Không tìm thấy khóa workers trong dữ liệu state.'
        });
      }

      // 3. Kiểm toán dự án & hợp đồng
      const projectAudit = auditProjects(cleanState.xuongRecords, cleanState.contracts, errors, warnings, options);
      if (cleanState.xuongRecords) cleanState.xuongRecords = projectAudit.sanitizedXuong;
      if (cleanState.contracts) cleanState.contracts = projectAudit.sanitizedContracts;

      // 4. Kiểm toán Users
      if (cleanState.users) {
        cleanState.users = auditUsers(cleanState.users, errors, warnings);
      }

      // 5. Kiểm toán vật tư & công nợ
      const matDebtAudit = auditMaterialsAndDebts(cleanState.materials, cleanState.debts, cleanState.supplierDebts, warnings);
      if (cleanState.materials) cleanState.materials = matDebtAudit.cleanMaterials;
      if (cleanState.debts) cleanState.debts = matDebtAudit.cleanDebts;
      if (cleanState.supplierDebts) cleanState.supplierDebts = matDebtAudit.cleanSupplierDebts;

      const isFatal = errors.length > 0;
      const isValid = !isFatal;

      return {
        isValid: isValid,
        isFatal: isFatal,
        errors: errors,
        warnings: warnings,
        sanitizedState: isFatal ? null : cleanState,
        auditSummary: {
          timestamp: new Date().toISOString(),
          errorCount: errors.length,
          warningCount: warnings.length,
          sanitized: true,
          status: isFatal ? 'BLOCKED' : (warnings.length > 0 ? 'PASSED_WITH_WARNINGS' : 'CLEAN_PASS')
        }
      };
    },

    /**
     * Vệ sinh dữ liệu nhanh và ném ngoại lệ nếu vi phạm nghiêm trọng
     * @param {Object} state
     * @returns {Object} sanitizedState
     */
    sanitizeState: function (state) {
      const result = this.validateState(state);
      if (result.isFatal) {
        throw new DataIntegrityViolationError(
          `[W44 Data Integrity Guard] Chặn lưu dữ liệu hỏng: ${result.errors.map(e => e.message).join(' | ')}`,
          { errors: result.errors, warnings: result.warnings }
        );
      }
      return result.sanitizedState;
    },

    /**
     * Guard kiểm tra body của một request trước khi gọi `/api/save-state`
     * @param {string|Object} payload Dữ liệu truyền vào fetch/xhr
     * @returns {string|Object} payload đã được làm sạch và hợp lệ
     */
    guardSavePayload: function (payload) {
      let stateObj = payload;
      let isString = false;

      if (typeof payload === 'string') {
        isString = true;
        try {
          stateObj = JSON.parse(payload);
        } catch (e) {
          throw new DataIntegrityViolationError('Payload không thể parse thành JSON hợp lệ!', {
            code: ERROR_CODES.CORRUPTED_PAYLOAD
          });
        }
      }

      const audit = this.validateState(stateObj);
      if (audit.isFatal) {
        const errorMsg = `[W44 Data Integrity Guard] PHÁT HIỆN LỖI TOÀN VẸN DỮ LIỆU CỐT TỬ - ĐÃ HỦY LỆNH LƯU:\n` +
          audit.errors.map(e => `- [${e.code}] ${e.message}`).join('\n');
        console.error(errorMsg);
        throw new DataIntegrityViolationError(errorMsg, {
          errors: audit.errors,
          warnings: audit.warnings
        });
      }

      if (audit.warnings.length > 0) {
        console.warn(`[W44 Data Integrity Guard] Đã tự động vá ${audit.warnings.length} điểm bất thường trước khi lưu:`, audit.warnings);
      }

      return isString ? JSON.stringify(audit.sanitizedState) : audit.sanitizedState;
    },

    // =======================================================================================
    // TỰ ĐỘNG CAN THIỆP FETCH INTERCEPTOR (ZERO-TOUCH INTEGRATION)
    // =======================================================================================
    _originalFetch: null,

    /**
     * Kích hoạt bộ đánh chặn Fetch: Mọi lệnh gọi fetch tới `/api/save-state`
     * sẽ tự động được kiểm toán và làm sạch dữ liệu trước khi gửi đi.
     */
    attachFetchInterceptor: function () {
      if (typeof global.fetch !== 'function') {
        console.warn('[W44 Data Integrity Guard] global.fetch không tồn tại, bỏ qua attachFetchInterceptor.');
        return false;
      }

      if (this._originalFetch) {
        return true; // Đã kích hoạt trước đó
      }

      this._originalFetch = global.fetch;
      const self = this;

      global.fetch = function (resource, init) {
        try {
          const url = (typeof resource === 'string') ? resource : (resource && resource.url ? resource.url : '');
          const isSaveStateApi = url.includes('/api/save-state') || url.includes('save-state');

          if (isSaveStateApi && init && init.body) {
            // Can thiệp kiểm tra và làm sạch body
            init.body = self.guardSavePayload(init.body);
          }
        } catch (guardErr) {
          console.error('[W44 Fetch Interceptor Blocked Save]:', guardErr.message);
          return Promise.reject(guardErr);
        }

        return self._originalFetch.apply(this, arguments);
      };

      console.log('[W44 Data Integrity Guard] Fetch Interceptor đã được kích hoạt thành công cho /api/save-state.');
      return true;
    },

    /**
     * Hủy bỏ bộ đánh chặn Fetch, khôi phục fetch gốc
     */
    detachFetchInterceptor: function () {
      if (this._originalFetch) {
        global.fetch = this._originalFetch;
        this._originalFetch = null;
        console.log('[W44 Data Integrity Guard] Đã khôi phục fetch gốc.');
        return true;
      }
      return false;
    },

    // =======================================================================================
    // HỆ THỐNG KIỂM THỬ NỘI BỘ (SELF-TEST ZERO-TRUST AUDIT)
    // =======================================================================================
    /**
     * Tự động chạy bộ test suite kiểm tra tất cả các chốt chặn
     */
    runSelfTest: function (sampleState) {
      console.log('[W44 Data Integrity Guard] Bắt đầu chạy Self-Test nội bộ...');
      const tests = [];

      // Test 1: Kiểm tra tính năng toSafeNumber và isCleanNumber
      const test1 = (
        this.isCleanNumber(12500000) === true &&
        this.isCleanNumber(NaN) === false &&
        this.isCleanNumber(null) === false &&
        this.isCleanNumber('NaN') === false &&
        this.toSafeNumber(NaN, 0) === 0 &&
        this.toSafeNumber('15000', 0) === 15000
      );
      tests.push({ name: 'Chốt chặn số học (NaN / null / String NaN detection)', passed: test1 });

      // Test 2: Chặn xóa sạch danh sách nhân sự (workers: [])
      const badStateWorkers = {
        workers: [],
        users: [{ id: 1, role: 'ADMIN', status: 'ACTIVE' }]
      };
      const auditEmptyWorkers = this.validateState(badStateWorkers);
      const test2 = (auditEmptyWorkers.isFatal === true && auditEmptyWorkers.errors.some(e => e.field === 'workers'));
      tests.push({ name: 'Chặn nguy cơ mất danh sách nhân sự (Wipe-out Workers)', passed: test2 });

      // Test 3: Chặn xóa sạch tài khoản quản trị (users: [])
      const badStateUsers = {
        workers: [{ code: 'NV01', name: 'Hà Viết Hoà', daySalary: 1000, total: 1000 }],
        users: []
      };
      const auditEmptyUsers = this.validateState(badStateUsers);
      const test3 = (auditEmptyUsers.isFatal === true && auditEmptyUsers.errors.some(e => e.field === 'users'));
      tests.push({ name: 'Chặn nguy cơ mất quyền Admin (Wipe-out Users)', passed: test3 });

      // Test 4: Tự động phát hiện và vá lỗi NaN trong CCSC
      const stateWithNanCCSC = {
        ccscMonths: [
          { m: 1, name: 'Tháng 1', sales: NaN, debt: null, cash: 10000000 }
        ],
        workers: [{ code: 'NV01', name: 'Hà Viết Hoà', base: 1000, days: 26, daySalary: 1000, ot: 0, allowance: 0, advance: 0, total: 1000 }],
        users: [{ id: 1, role: 'ADMIN', status: 'ACTIVE' }]
      };
      const auditCCSC = this.validateState(stateWithNanCCSC);
      const test4 = (
        auditCCSC.isValid === true &&
        auditCCSC.sanitizedState.ccscMonths[0].sales === 0 &&
        auditCCSC.sanitizedState.ccscMonths[0].debt === 0
      );
      tests.push({ name: 'Tự động vá lỗi NaN/null trong bảng tính CCSC', passed: test4 });

      // Test 5: Tự động hiệu chỉnh tổng lương thợ khi công thức bị lệch do NaN
      const stateWorkerCalc = {
        workers: [
          { code: 'NV01', name: 'Hà Viết Hoà', base: 13000000, days: 26, daySalary: 12000000, ot: 1000000, allowance: 500000, advance: 2000000, total: NaN }
        ],
        users: [{ id: 1, role: 'ADMIN', status: 'ACTIVE' }]
      };
      const auditWorkerCalc = this.validateState(stateWorkerCalc);
      const test5 = (
        auditWorkerCalc.isValid === true &&
        auditWorkerCalc.sanitizedState.workers[0].total === (12000000 + 1000000 + 500000 - 2000000)
      );
      tests.push({ name: 'Tự động tính lại tổng lương thợ chuẩn xác khi total là NaN', passed: test5 });

      // Test 6: Kiểm toán State thực tế từ pg_home_live_state.json nếu được truyền vào
      let test6 = true;
      if (sampleState) {
        const auditLive = this.validateState(sampleState);
        test6 = (auditLive.isValid === true);
      }
      tests.push({ name: 'Kiểm toán tương thích với pg_home_live_state.json thực tế', passed: test6 });

      const allPassed = tests.every(t => t.passed);
      console.log(`[W44 Data Integrity Guard] Kết quả Self-Test: ${allPassed ? 'TẤT CẢ ĐÃ VƯỢT QUA' : 'CÓ BÀI TEST THẤT BẠI'}`, tests);

      return {
        passed: allPassed,
        results: tests
      };
    }
  };

  // Đăng ký toàn cục
  if (typeof global.window !== 'undefined') {
    global.window.PG_Modules_W44 = PG_Modules_W44;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PG_Modules_W44;
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
