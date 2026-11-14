const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const TMP_DIR = '/tmp/pg_home_data';

// --- BẢO MẬT & PHÂN QUYỀN X-PG-ROLE + CHỐNG GIẢ MẠO CLOUD (W14 & HIẾN PHÁP PHÚ GIA) ---
const BLOCKED_ROLES = new Set(['PENDING', 'LOCKED', 'REJECTED']);
const VALID_STAFF_ROLES = new Set(['XUONG_VATTU', 'VANPHONG_SALE', 'DU_TOAN_SALE', 'STAFF_SYNC']);
const CLOUD_SESSION_SECRET = process.env.PG_SESSION_SECRET || 'PG_HOME_CLOUD_042203002931_STAFF_SYNC_2026';

// SHA-256 của PIN Giám Đốc (0986 / 2026) — tuyệt đối không lưu plaintext PIN trong mã nguồn
const DIRECTOR_PIN_HASHES = [
  '8d73660afe85903005ba1d4388f09d581236df6a04e9af5723cb0b4b51a9247f',
  '158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab'
];

const BLOCKED_CLOUD_DATA_FILES = new Set([
  'zalo_157_private_chats_index.json',
  'zalo_private_chats_vault.json',
  'ccsc_director_vault.json',
  'audit_log.jsonl',
  'audit_log.json'
]);

const ROLE_FORBIDDEN_WRITE_KEYS = {
  XUONG_VATTU: new Set(['ccscMonths', 'contracts', 'users', 'salaryT8', 'salaryT9', 'ccscT8T9']),
  VANPHONG_SALE: new Set(['ccscMonths', 'users', 'salaryT8', 'salaryT9', 'ccscT8T9']),
  DU_TOAN_SALE: new Set(['ccscMonths', 'users', 'salaryT8', 'salaryT9', 'ccscT8T9']),
  STAFF_SYNC: new Set(['ccscMonths', 'users', 'salaryT8', 'salaryT9', 'ccscT8T9'])
};

// In-memory Edge TTL Cache 5s chống bão đọc Cloud KV/Supabase (I30)
let _edgeStateCache = { data: null, expiresAt: 0 };

function verifyDirectorPin(pinInput) {
  if (!pinInput) return false;
  const digest = crypto.createHash('sha256').update(String(pinInput).trim(), 'utf8').digest('hex');
  return DIRECTOR_PIN_HASHES.some(h => {
    try {
      return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(h, 'hex'));
    } catch (e) {
      return false;
    }
  });
}

function signSessionToken(username, role, tsOverride) {
  const ts = tsOverride || new Date().toISOString();
  const sig = crypto.createHmac('sha256', CLOUD_SESSION_SECRET).update(`${username}|${role}|${ts}`).digest('hex');
  return { username, role, issued_at: ts, _sig: `hmac256_${sig}` };
}

function verifySessionToken(tokenHeader) {
  if (!tokenHeader) return null;
  let obj = null;
  const raw = String(tokenHeader).trim();
  if (raw.startsWith('{')) {
    try { obj = JSON.parse(raw); } catch (e) { obj = null; }
  } else if (raw.includes('|hmac256_')) {
    const parts = raw.split('|');
    if (parts.length >= 4) {
      obj = { username: parts[0], role: parts[1], issued_at: parts[2], _sig: parts[3] };
    }
  }
  if (!obj || !obj.username || !obj.role || !obj.issued_at || !obj._sig) return null;
  const expected = signSessionToken(String(obj.username), String(obj.role), String(obj.issued_at))._sig;
  try {
    const a = Buffer.from(String(obj._sig), 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return { username: String(obj.username), role: String(obj.role).toUpperCase() };
    }
  } catch (e) {}
  return null;
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const o = String(origin).toLowerCase();
  return (
    o.startsWith('http://localhost:') ||
    o.startsWith('http://127.0.0.1:') ||
    o === 'https://nghiagurunv-prog.github.io' ||
    o.endsWith('.vercel.app')
  );
}

function getRequestRole(req) {
  return (req.headers['x-pg-role'] || req.headers['x-role'] || '').toString().trim().toUpperCase();
}

function validateRole(req, options = {}) {
  const role = getRequestRole(req);
  const origin = (req.headers['origin'] || req.headers['referer'] || '').toString();
  if (role) {
    if (BLOCKED_ROLES.has(role)) {
      return {
        allowed: false,
        status: 403,
        error: `Vai trò [${role}] bị khóa hoặc chưa được Giám Đốc phê duyệt.`
      };
    }
    if (role === 'ADMIN') {
      const pinHeader = (req.headers['x-director-pin'] || '').toString();
      const tokenHeader = (req.headers['x-pg-token'] || '').toString();
      const verifiedTok = verifySessionToken(tokenHeader);
      const hasValidAdminAuth = verifyDirectorPin(pinHeader) || (verifiedTok && verifiedTok.role === 'ADMIN');
      if (options.requireAdmin && !hasValidAdminAuth) {
        return {
          allowed: false,
          status: 403,
          error: 'Yêu cầu xác thực chữ ký phiên HMAC-SHA256 hoặc PIN Giám Đốc hợp lệ.'
        };
      }
      return { allowed: true, role: hasValidAdminAuth ? 'ADMIN' : 'STAFF_SYNC' };
    }
    if (options.requireAdmin) {
      return {
        allowed: false,
        status: 403,
        error: 'Chỉ Giám Đốc (ADMIN) mới có quyền thực hiện thao tác này.'
      };
    }
    return { allowed: true, role: VALID_STAFF_ROLES.has(role) ? role : 'STAFF_SYNC' };
  }
  if (options.mandatory) {
    // Cho phép đồng bộ từ cùng origin Web App của nhân viên công ty dưới quyền hạn giới hạn STAFF_SYNC (cấm sửa CCSC/Users)
    if (origin && isAllowedOrigin(origin) && !options.requireAdmin) {
      return { allowed: true, role: 'STAFF_SYNC' };
    }
    return {
      allowed: false,
      status: 401,
      error: 'Thiếu header xác thực quyền X-PG-Role hoặc nguồn truy cập không hợp lệ.'
    };
  }
  return { allowed: true, role: 'STAFF_SYNC' };
}

// --- CLOUD PERSISTENCE ADAPTER (FETCH NGUYÊN BẢN - KHÔNG CẦN PACKAGE NGOÀI) ---
function createTimeoutSignal(ms = 4000) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  if (timer.unref) timer.unref();
  return controller.signal;
}

function getCloudProvider() {
  const fetchFn = typeof fetch === 'function' ? fetch : (globalThis.fetch || null);
  if (!fetchFn) return null;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (supabaseUrl && supabaseKey) {
    return {
      type: 'supabase',
      url: supabaseUrl.replace(/\/$/, ''),
      key: supabaseKey
    };
  }

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    return {
      type: 'kv',
      url: kvUrl.replace(/\/$/, ''),
      token: kvToken
    };
  }

  return null;
}

async function cloudSaveState(state) {
  const provider = getCloudProvider();
  if (!provider) return { success: false, reason: 'no_provider' };

  try {
    if (provider.type === 'kv') {
      const res = await fetch(provider.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${provider.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', 'pg_home_app_state', JSON.stringify(state)]),
        signal: createTimeoutSignal(4000)
      });
      return { success: res.ok, provider: 'kv' };
    }

    if (provider.type === 'supabase') {
      // 1. Thử ghi vào Table PostgREST app_state
      try {
        const tableRes = await fetch(`${provider.url}/rest/v1/app_state`, {
          method: 'POST',
          headers: {
            apikey: provider.key,
            Authorization: `Bearer ${provider.key}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            key: 'pg_home_app_state',
            value: state,
            updated_at: new Date().toISOString()
          }),
          signal: createTimeoutSignal(4000)
        });
        if (tableRes.ok) return { success: true, provider: 'supabase_table' };
      } catch (e) {
        // Fallback sang storage
      }

      // 2. Thử ghi vào Supabase Storage bucket pg_home_data
      const storageRes = await fetch(`${provider.url}/storage/v1/object/pg_home_data/app_state.json`, {
        method: 'POST',
        headers: {
          apikey: provider.key,
          Authorization: `Bearer ${provider.key}`,
          'Content-Type': 'application/json',
          'x-upsert': 'true'
        },
        body: JSON.stringify(state),
        signal: createTimeoutSignal(4000)
      });
      return { success: storageRes.ok, provider: 'supabase_storage' };
    }
  } catch (err) {
    console.error('[CloudSaveState] Error:', err.message);
    return { success: false, error: err.message };
  }

  return { success: false };
}

async function cloudLoadState() {
  const provider = getCloudProvider();
  if (!provider) return null;

  try {
    if (provider.type === 'kv') {
      const res = await fetch(`${provider.url}/get/pg_home_app_state`, {
        headers: { Authorization: `Bearer ${provider.token}` },
        signal: createTimeoutSignal(4000)
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.result) {
          return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
        }
      }
    }

    if (provider.type === 'supabase') {
      // 1. Thử đọc từ Table app_state
      try {
        const tableRes = await fetch(`${provider.url}/rest/v1/app_state?key=eq.pg_home_app_state&select=value`, {
          headers: {
            apikey: provider.key,
            Authorization: `Bearer ${provider.key}`
          },
          signal: createTimeoutSignal(4000)
        });
        if (tableRes.ok) {
          const rows = await tableRes.json();
          if (Array.isArray(rows) && rows.length > 0 && rows[0].value) {
            return rows[0].value;
          }
        }
      } catch (e) {
        // Fallback sang storage
      }

      // 2. Thử đọc từ Storage bucket pg_home_data
      const storageRes = await fetch(`${provider.url}/storage/v1/object/authenticated/pg_home_data/app_state.json`, {
        headers: {
          apikey: provider.key,
          Authorization: `Bearer ${provider.key}`
        },
        signal: createTimeoutSignal(4000)
      });
      if (storageRes.ok) {
        return await storageRes.json();
      }
    }
  } catch (err) {
    console.error('[CloudLoadState] Error:', err.message);
  }

  return null;
}

// --- FILE SYSTEM HELPERS (LOCAL DISK & /tmp) ---
function readJson(filename, defaultVal = {}) {
  try {
    const tmpPath = path.join(TMP_DIR, filename);
    if (fs.existsSync(tmpPath)) {
      return JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
    }

    // Alias fallback giữa app_state.json và pg_home_live_state.json
    if (filename === 'pg_home_live_state.json') {
      const aliasTmp = path.join(TMP_DIR, 'app_state.json');
      if (fs.existsSync(aliasTmp)) {
        return JSON.parse(fs.readFileSync(aliasTmp, 'utf8'));
      }
    } else if (filename === 'app_state.json') {
      const aliasTmp = path.join(TMP_DIR, 'pg_home_live_state.json');
      if (fs.existsSync(aliasTmp)) {
        return JSON.parse(fs.readFileSync(aliasTmp, 'utf8'));
      }
    }

    const dataPath = path.join(DATA_DIR, filename);
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    if (filename === 'app_state.json') {
      const aliasData = path.join(DATA_DIR, 'pg_home_live_state.json');
      if (fs.existsSync(aliasData)) {
        return JSON.parse(fs.readFileSync(aliasData, 'utf8'));
      }
    }
  } catch (e) {
    // Fallback to defaultVal
  }
  return defaultVal;
}

function writeJson(filename, payload) {
  try {
    fs.mkdirSync(TMP_DIR, { recursive: true });
    const tmpPath = path.join(TMP_DIR, filename);
    fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2), 'utf8');

    // Đồng bộ đồng thời cả 2 tên file app_state.json và pg_home_live_state.json
    if (filename === 'pg_home_live_state.json') {
      fs.writeFileSync(path.join(TMP_DIR, 'app_state.json'), JSON.stringify(payload, null, 2), 'utf8');
    } else if (filename === 'app_state.json') {
      fs.writeFileSync(path.join(TMP_DIR, 'pg_home_live_state.json'), JSON.stringify(payload, null, 2), 'utf8');
    }
    return true;
  } catch (e) {
    return false;
  }
}

async function loadCurrentState() {
  const now = Date.now();
  if (_edgeStateCache.data && now < _edgeStateCache.expiresAt) {
    return _edgeStateCache.data;
  }

  // 1. Ưu tiên khôi phục từ Cloud Store (Supabase REST / Vercel KV / Upstash Redis) nếu có
  const provider = getCloudProvider();
  if (provider) {
    const cloudData = await cloudLoadState();
    if (cloudData && typeof cloudData === 'object' && Object.keys(cloudData).length > 0) {
      writeJson('app_state.json', cloudData);
      writeJson('pg_home_live_state.json', cloudData);
      _edgeStateCache = { data: cloudData, expiresAt: now + 5000 };
      return cloudData;
    }
  }

  // 2. Fallback đọc từ /tmp hoặc data/
  let state = readJson('app_state.json', null);
  if (!state || Object.keys(state).length === 0) {
    state = readJson('pg_home_live_state.json', {});
  }
  _edgeStateCache = { data: state, expiresAt: now + 5000 };
  return state;
}

function getStateUpdatedAt(state) {
  if (state && typeof state === 'object') {
    if (state.updatedAt) return state.updatedAt;
    if (state._updatedAt) return state._updatedAt;
    if (state.saved_at) return state.saved_at;
  }
  try {
    const tmpApp = path.join(TMP_DIR, 'app_state.json');
    if (fs.existsSync(tmpApp)) return fs.statSync(tmpApp).mtime.toISOString();
    const tmpLive = path.join(TMP_DIR, 'pg_home_live_state.json');
    if (fs.existsSync(tmpLive)) return fs.statSync(tmpLive).mtime.toISOString();
    const dataPath = path.join(DATA_DIR, 'pg_home_live_state.json');
    if (fs.existsSync(dataPath)) return fs.statSync(dataPath).mtime.toISOString();
  } catch (e) {}
  return null;
}

// --- CÔ LẬP DỮ LIỆU TRÊN BẢN DEPLOY (CHỈ GIỮ VĂN PHÒNG & XƯỞNG, CẮT BỎ CCSC & GIÁM ĐỐC) ---
function sanitizeStateForDeploy(rawState) {
  if (!rawState || typeof rawState !== 'object') return {};
  const clean = { ...rawState };
  // Tuyệt đối không trả dữ liệu CCSC 12 tháng, lợi nhuận bỏ túi BGĐ hoặc lương BLĐ lên Cloud Deploy
  clean.ccscMonths = [];
  delete clean.ccscT8T9;
  delete clean.salaryT8;
  delete clean.salaryT9;
  delete clean.directorVault;
  delete clean.ccsc_director_vault;
  if (Array.isArray(clean.expenses)) {
    clean.expenses = clean.expenses.filter(item => item && item.id !== 'CP-03' && !String(item.name || '').includes('Ban Lãnh Đạo'));
  }
  if (Array.isArray(clean.users)) {
    clean.users = clean.users.filter(u => u && u.username !== 'giamdoc' && u.role !== 'ADMIN');
  }
  if (Array.isArray(clean.accessories)) {
    clean.accessories = clean.accessories.map(acc => {
      if (!acc || typeof acc !== 'object') return acc;
      const copy = { ...acc };
      delete copy.profit;
      return copy;
    });
  }
  return clean;
}

const MAX_CLOUD_BODY_BYTES = 10 * 1024 * 1024;

async function parseRequestBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string' && req.body.trim()) {
      try {
        return JSON.parse(req.body);
      } catch (e) {
        return {};
      }
    }
  }
  if (!req || typeof req.on !== 'function') {
    return {};
  }
  return new Promise((resolve) => {
    let body = '';
    let received = 0;
    let aborted = false;
    req.on('data', chunk => {
      if (aborted) return;
      received += chunk.length || 0;
      if (received > MAX_CLOUD_BODY_BYTES) {
        aborted = true;
        resolve({});
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      if (aborted) return;
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async (req, res) => {
  const reqOrigin = (req.headers['origin'] || '').toString().trim();
  const corsOrigin = isAllowedOrigin(reqOrigin) && reqOrigin ? reqOrigin : 'https://nghiagurunv-prog.github.io';
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Actor, X-Role, X-PG-Role, X-PG-Actor, X-PG-Token, X-Director-PIN');
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  if (req.method === 'GET') {
    if (pathname === '/api/local-ccsc-vault' || pathname.startsWith('/local-admin-assets')) {
      return res.status(403).json({
        status: 'error',
        code: 'LOCAL_DIRECTOR_ONLY',
        message: 'Phân hệ CCSC & Giám Đốc chỉ chạy nội bộ trên máy tính Giám Đốc (127.0.0.1:8080).'
      });
    }

    if (pathname === '/api/load-state' || pathname === '/api/live-state') {
      const rawState = await loadCurrentState();
      const state = sanitizeStateForDeploy(rawState);
      const provider = getCloudProvider();
      return res.status(200).json({
        status: 'ok',
        edition: 'DEPLOY_OFFICE_WORKSHOP_ONLY',
        data: state,
        state,
        persistenceMode: provider ? 'cloud' : 'ephemeral-tmp',
        source: provider ? 'cloud' : 'disk',
        updatedAt: getStateUpdatedAt(rawState)
      });
    }

    if (pathname === '/api/health') {
      const state = await loadCurrentState();
      const provider = getCloudProvider();
      const persistenceMode = provider ? 'cloud' : 'ephemeral-tmp';
      const stateUpdatedAt = getStateUpdatedAt(state);

      return res.status(200).json({
        status: 'ok',
        server: 'PG Home Luxury Cloud Server v6.0 (Vercel)',
        company: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
        address: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
        hotline: '0986.722.324',
        tax_code: '042203002931',
        email: 'pghomehatinh@gmail.com',
        persistenceMode,
        cloudProvider: provider ? provider.type : null,
        has_state: Object.keys(state).length > 0,
        stateUpdatedAt,
        timestamp: new Date().toISOString()
      });
    }

    if (pathname === '/api/zalo-live-inbox') {
      const monitor = readJson('all_groups_monitor_state.json', {});
      const staging = readJson('zalo_staging_inbox.json', { items: [] });
      const telemetry = readJson('multi_group_telemetry.json', {});
      return res.status(200).json({
        status: 'ok',
        monitor_state: monitor,
        staging_inbox: staging,
        telemetry,
        items: staging.items || []
      });
    }

    if (pathname === '/api/zalo-v6-intel') {
      return res.status(200).json({
        status: 'ok',
        verified_entities: readJson('zalo_verified_entities.json', {}),
        filenoise_index: readJson('zalo_filenoise_index.json', {}),
        leveldb_intel: readJson('zalo_leveldb_intel.json', {}),
        master_summary: readJson('zalo_v6_master_summary.json', {})
      });
    }

    if (pathname === '/api/zalo-v6-health') {
      return res.status(200).json({
        status: 'ok',
        health: readJson('zalo_health_report.json', {}),
        telemetry: readJson('multi_group_telemetry.json', {})
      });
    }

    if (pathname === '/api/zalo-live-attendance') {
      const diskAtt = readJson('zalo_live_attendance.json', {});
      const state = await loadCurrentState();
      const cloudOverrides = (state && state.zaloAttendanceOverrides && typeof state.zaloAttendanceOverrides === 'object')
        ? state.zaloAttendanceOverrides
        : {};
      const merged = {
        ...diskAtt,
        custom_overrides: {
          ...((diskAtt && diskAtt.custom_overrides) || {}),
          ...cloudOverrides
        }
      };
      return res.status(200).json(merged);
    }

    if (pathname === '/api/mkt-telemetry') {
      return res.status(200).json({
        status: 'ok',
        mode: 'CLOUD_READONLY_POLICY',
        mkt_post_procs: 0,
        mkt_care_procs: 0,
        total_mkt_procs: 0,
        max_procs_cap: 4,
        threads_run: 1,
        delay_range_sec: '25-30s',
        ip_cooldown_hours: 24,
        checked_at: new Date().toISOString()
      });
    }

    if (pathname === '/api/backups') {
      return res.status(200).json({ status: 'ok', backups: [] });
    }

    if (pathname === '/api/audit-log') {
      return res.status(200).json({ status: 'ok', logs: readJson('audit_log.json', []) });
    }

    if (pathname.startsWith('/data/')) {
      const fname = path.basename(pathname);
      if (BLOCKED_CLOUD_DATA_FILES.has(fname) || fname.startsWith('ccsc_') || !fname.endsWith('.json')) {
        return res.status(403).json({ status: 'forbidden', message: 'Access to internal vault file denied.' });
      }
      if (fname === 'app_state.json' || fname === 'pg_home_live_state.json') {
        const raw = await loadCurrentState();
        return res.status(200).json(sanitizeStateForDeploy(raw));
      }
      return res.status(200).json(readJson(fname, {}));
    }

    return res.status(200).json({ status: 'ok', path: pathname });
  }

  if (req.method === 'POST') {
    const payload = await parseRequestBody(req);

    if (pathname === '/api/verify-director-pin') {
      const pinVal = (payload && (payload.pin || payload.director_pin)) || req.headers['x-director-pin'] || '';
      if (!verifyDirectorPin(pinVal)) {
        return res.status(403).json({ status: 'invalid_pin', verified: false, message: 'Mã PIN Giám Đốc không chính xác.' });
      }
      const signed = signSessionToken('giamdoc', 'ADMIN');
      return res.status(200).json({ status: 'ok', verified: true, session: signed });
    }

    if (pathname === '/api/auth-sign-session') {
      const roleReq = String((payload && payload.role) || 'STAFF_SYNC').toUpperCase();
      const userReq = String((payload && payload.username) || 'staff');
      if (roleReq === 'ADMIN' && !verifyDirectorPin((payload && payload.pin) || req.headers['x-director-pin'] || '')) {
        return res.status(403).json({ status: 'forbidden', message: 'Cần xác thực PIN Giám Đốc để ký phiên ADMIN.' });
      }
      return res.status(200).json({ status: 'ok', session: signSessionToken(userReq, roleReq) });
    }

    if (pathname === '/api/save-state') {
      const roleCheck = validateRole(req, { mandatory: true });
      if (!roleCheck.allowed) {
        return res.status(roleCheck.status).json({
          status: 'error',
          code: 'ROLE_UNAUTHORIZED',
          message: roleCheck.error
        });
      }

      const incoming = (payload && typeof payload === 'object' && payload.state) ? payload.state : payload;
      if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
        return res.status(400).json({ status: 'error', message: 'Payload không hợp lệ.' });
      }

      const PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
      for (const pk of PROTO_KEYS) {
        if (Object.prototype.hasOwnProperty.call(incoming, pk)) {
          delete incoming[pk];
        }
      }

      // Field-Level ACL & Sanitized-Payload Guard: Bảo toàn CCSC / CP-03 / ADMIN / Accessories.profit
      const existingState = await loadCurrentState();
      const stateToSave = { ...(existingState || {}), ...incoming };
      const forbiddenSet = ROLE_FORBIDDEN_WRITE_KEYS[roleCheck.role];
      if (forbiddenSet && existingState && typeof existingState === 'object') {
        for (const fKey of forbiddenSet) {
          if (existingState[fKey] !== undefined) {
            stateToSave[fKey] = existingState[fKey];
          } else {
            delete stateToSave[fKey];
          }
        }
      }

      if (existingState && typeof existingState === 'object') {
        if (Array.isArray(existingState.ccscMonths) && existingState.ccscMonths.length > 0 &&
            (!Array.isArray(stateToSave.ccscMonths) || stateToSave.ccscMonths.length === 0)) {
          stateToSave.ccscMonths = existingState.ccscMonths;
        }
        if (Array.isArray(existingState.expenses) && Array.isArray(stateToSave.expenses)) {
          const preservedExec = existingState.expenses.filter(
            (e) => e && (e.id === 'CP-03' || String(e.category || '').includes('Ban Lãnh Đạo'))
          );
          for (const execItem of preservedExec) {
            if (!stateToSave.expenses.some((x) => x && x.id === execItem.id)) {
              stateToSave.expenses.push(execItem);
            }
          }
        }
        if (Array.isArray(existingState.users) && Array.isArray(stateToSave.users)) {
          const preservedAdmins = existingState.users.filter(
            (u) => u && (u.username === 'giamdoc' || u.role === 'ADMIN')
          );
          for (const adm of preservedAdmins) {
            if (!stateToSave.users.some((u) => u && u.username === adm.username)) {
              stateToSave.users.unshift(adm);
            }
          }
        }
        if (Array.isArray(existingState.accessories) && Array.isArray(stateToSave.accessories)) {
          const prevAccMap = new Map();
          for (const acc of existingState.accessories) {
            if (acc && (acc.id || acc.name)) prevAccMap.set(acc.id || acc.name, acc);
          }
          stateToSave.accessories = stateToSave.accessories.map((acc) => {
            if (!acc || typeof acc !== 'object') return acc;
            const prev = prevAccMap.get(acc.id || acc.name);
            if (acc.profit === undefined && prev && prev.profit !== undefined) {
              return { ...acc, profit: prev.profit };
            }
            return acc;
          });
        }
      }

      const nowIso = new Date().toISOString();
      if (!stateToSave.updatedAt) {
        stateToSave.updatedAt = nowIso;
      }
      stateToSave.saved_at = nowIso;
      if (req.headers['x-actor']) {
        stateToSave.saved_by = req.headers['x-actor'];
      }

      writeJson('app_state.json', stateToSave);
      writeJson('pg_home_live_state.json', stateToSave);
      _edgeStateCache = { data: stateToSave, expiresAt: Date.now() + 5000 };

      const cloudRes = await cloudSaveState(stateToSave);
      const provider = getCloudProvider();

      return res.status(200).json({
        status: 'ok',
        saved_at: nowIso,
        updatedAt: stateToSave.updatedAt,
        persistenceMode: provider ? 'cloud' : 'ephemeral-tmp',
        cloudSynced: !!cloudRes.success,
        message: 'Đã lưu trạng thái đồng bộ thành công.'
      });
    }

    if (pathname === '/api/patch-state') {
      const roleCheck = validateRole(req, { mandatory: true });
      if (!roleCheck.allowed) {
        return res.status(roleCheck.status).json({
          status: 'error',
          code: 'ROLE_UNAUTHORIZED',
          message: roleCheck.error
        });
      }

      let patches = null;
      if (payload && typeof payload === 'object') {
        if (payload.patches && typeof payload.patches === 'object' && !Array.isArray(payload.patches)) {
          patches = payload.patches;
        } else if (payload.delta && typeof payload.delta === 'object' && !Array.isArray(payload.delta)) {
          patches = payload.delta;
        } else if (payload.state && typeof payload.state === 'object' && !Array.isArray(payload.state)) {
          patches = payload.state;
        } else {
          patches = payload;
        }
      }

      if (!patches || typeof patches !== 'object' || Array.isArray(patches)) {
        return res.status(400).json({
          status: 'error',
          message: 'Dữ liệu patch không hợp lệ. Cần truyền object delta hoặc { patches: {...} }.'
        });
      }

      const currentState = await loadCurrentState();
      const baseState = (currentState && typeof currentState === 'object' && !Array.isArray(currentState))
        ? { ...currentState }
        : {};

      const nowIso = new Date().toISOString();
      const patchedKeys = [];
      const forbiddenSet = ROLE_FORBIDDEN_WRITE_KEYS[roleCheck.role];
      const PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

      // Merge nguyên tử từng key tuân thủ Field-Level ACL & Prototype Guard
      for (const key of Object.keys(patches)) {
        if (PROTO_KEYS.has(key)) continue;
        if (forbiddenSet && forbiddenSet.has(key)) continue;
        if (patches[key] !== undefined) {
          baseState[key] = patches[key];
          patchedKeys.push(key);
        }
      }

      if (currentState && typeof currentState === 'object') {
        if (Array.isArray(currentState.ccscMonths) && currentState.ccscMonths.length > 0 &&
            (!Array.isArray(baseState.ccscMonths) || baseState.ccscMonths.length === 0)) {
          baseState.ccscMonths = currentState.ccscMonths;
        }
        if (Array.isArray(currentState.expenses) && Array.isArray(baseState.expenses)) {
          const preservedExec = currentState.expenses.filter(
            (e) => e && (e.id === 'CP-03' || String(e.category || '').includes('Ban Lãnh Đạo'))
          );
          for (const execItem of preservedExec) {
            if (!baseState.expenses.some((x) => x && x.id === execItem.id)) {
              baseState.expenses.push(execItem);
            }
          }
        }
        if (Array.isArray(currentState.users) && Array.isArray(baseState.users)) {
          const preservedAdmins = currentState.users.filter(
            (u) => u && (u.username === 'giamdoc' || u.role === 'ADMIN')
          );
          for (const adm of preservedAdmins) {
            if (!baseState.users.some((u) => u && u.username === adm.username)) {
              baseState.users.unshift(adm);
            }
          }
        }
        if (Array.isArray(currentState.accessories) && Array.isArray(baseState.accessories)) {
          const prevAccMap = new Map();
          for (const acc of currentState.accessories) {
            if (acc && (acc.id || acc.name)) prevAccMap.set(acc.id || acc.name, acc);
          }
          baseState.accessories = baseState.accessories.map((acc) => {
            if (!acc || typeof acc !== 'object') return acc;
            const prev = prevAccMap.get(acc.id || acc.name);
            if (acc.profit === undefined && prev && prev.profit !== undefined) {
              return { ...acc, profit: prev.profit };
            }
            return acc;
          });
        }
      }

      baseState.updatedAt = patches.updatedAt || nowIso;
      baseState.last_patch_at = nowIso;
      if (req.headers['x-actor']) {
        baseState.last_patched_by = req.headers['x-actor'];
      }

      writeJson('app_state.json', baseState);
      writeJson('pg_home_live_state.json', baseState);
      _edgeStateCache = { data: baseState, expiresAt: Date.now() + 5000 };

      const cloudRes = await cloudSaveState(baseState);
      const provider = getCloudProvider();
      const cleanState = sanitizeStateForDeploy(baseState);

      return res.status(200).json({
        status: 'ok',
        message: 'Đã patch trạng thái thành công.',
        updatedAt: baseState.updatedAt,
        patchedKeys,
        persistenceMode: provider ? 'cloud' : 'ephemeral-tmp',
        cloudSynced: !!cloudRes.success,
        data: cleanState,
        state: cleanState
      });
    }

    if (pathname === '/api/zalo-trigger-scan') {
      return res.status(200).json({
        status: 'ok',
        message: 'Đã kích hoạt đồng bộ Zalo V6.0.',
        summary: readJson('zalo_v6_master_summary.json', {})
      });
    }

    if (pathname === '/api/zalo-sync-attendance') {
      const roleCheck = validateRole(req, { mandatory: true });
      if (!roleCheck.allowed) {
        return res.status(roleCheck.status).json({
          status: 'error',
          code: 'ROLE_UNAUTHORIZED',
          message: roleCheck.error
        });
      }
      const diskAtt = readJson('zalo_live_attendance.json', {});
      const curState = await loadCurrentState();
      const baseState = (curState && typeof curState === 'object') ? { ...curState } : {};
      const overrides = (baseState.zaloAttendanceOverrides && typeof baseState.zaloAttendanceOverrides === 'object')
        ? { ...baseState.zaloAttendanceOverrides }
        : { ...((diskAtt && diskAtt.custom_overrides) || {}) };

      if (payload && payload.override_staff_id) {
        const sid = String(payload.override_staff_id);
        overrides[sid] = overrides[sid] || {};
        const filterValidDays = (obj) => {
          const res = {};
          Object.entries(obj || {}).forEach(([k, v]) => {
            const dNum = parseInt(k, 10);
            if (!isNaN(dNum) && dNum >= 1 && dNum <= 31) res[k] = v;
          });
          return res;
        };
        if (payload.hc) overrides[sid].hc = { ...filterValidDays(overrides[sid].hc), ...filterValidDays(payload.hc) };
        if (payload.ot) overrides[sid].ot = { ...filterValidDays(overrides[sid].ot), ...filterValidDays(payload.ot) };
        if (payload.days) overrides[sid].days = { ...filterValidDays(overrides[sid].days), ...filterValidDays(payload.days) };
        baseState.zaloAttendanceOverrides = overrides;
        baseState.updatedAt = new Date().toISOString();
        writeJson('app_state.json', baseState);
        writeJson('pg_home_live_state.json', baseState);
        _edgeStateCache = { data: baseState, expiresAt: Date.now() + 5000 };
        await cloudSaveState(baseState);
      }

      const outAtt = { ...diskAtt, custom_overrides: overrides, synced_at: new Date().toISOString() };
      writeJson('zalo_live_attendance.json', outAtt);
      return res.status(200).json(outAtt);
    }

    if (pathname === '/api/zalo-approve-item') {
      const roleCheck = validateRole(req, { mandatory: true, requireAdmin: true });
      if (!roleCheck.allowed) {
        return res.status(roleCheck.status).json({
          status: 'error',
          code: 'ROLE_UNAUTHORIZED',
          message: roleCheck.error
        });
      }

      const itemId = payload.id || payload.item_id;
      const rawAct = String(payload.review_status || payload.action || 'APPROVED').toUpperCase();
      const normStatus = (rawAct === 'APPROVE' || rawAct === 'APPROVED') ? 'APPROVED'
        : ((rawAct === 'REJECT' || rawAct === 'REJECTED') ? 'REJECTED' : rawAct);
      const staging = readJson('zalo_staging_inbox.json', []);
      const list = Array.isArray(staging) ? staging : (staging.items || []);
      for (const it of list) {
        if (it.id === itemId || it.sha256 === itemId) {
          it.review_status = normStatus;
          it.status = normStatus;
          it.approved_at = new Date().toISOString();
          if (req.headers['x-actor']) {
            it.approved_by = req.headers['x-actor'];
          }
        }
      }
      writeJson('zalo_staging_inbox.json', Array.isArray(staging) ? list : { ...staging, items: list });
      return res.status(200).json({ status: 'ok', id: itemId, review_status: normStatus });
    }

    if (pathname === '/api/audit-log' || pathname === '/api/save-audit-log') {
      const logs = readJson('audit_log.json', []);
      if (Array.isArray(logs)) {
        const prevHash = (logs[0] && logs[0].hash) ? logs[0].hash : '0'.repeat(64);
        const serverTs = new Date().toISOString();
        const rawChain = `${prevHash}|${serverTs}|${payload.user || payload.actor || 'staff'}|${payload.action || 'EVENT'}|${payload.detail || ''}`;
        const curHash = crypto.createHash('sha256').update(rawChain, 'utf8').digest('hex');
        logs.unshift({ ...payload, server_ts: serverTs, prev_hash: prevHash, hash: curHash });
        writeJson('audit_log.json', logs.slice(0, 500));
      }
      return res.status(200).json({ status: 'ok' });
    }

    return res.status(200).json({ status: 'ok' });
  }

  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
};
