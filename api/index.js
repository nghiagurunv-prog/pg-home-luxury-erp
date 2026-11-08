const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const TMP_DIR = '/tmp/pg_home_data';

// --- BẢO MẬT & PHÂN QUYỀN X-PG-ROLE (W14 & HIẾN PHÁP PHÚ GIA) ---
const BLOCKED_ROLES = new Set(['PENDING', 'LOCKED', 'REJECTED']);

function getRequestRole(req) {
  return (req.headers['x-pg-role'] || req.headers['x-role'] || '').toString().trim().toUpperCase();
}

function validateRole(req, options = {}) {
  const role = getRequestRole(req);
  if (role) {
    if (BLOCKED_ROLES.has(role)) {
      return {
        allowed: false,
        status: 403,
        error: `Vai trò [${role}] bị khóa hoặc chưa được Giám Đốc phê duyệt.`
      };
    }
    if (options.requireAdmin && role !== 'ADMIN') {
      return {
        allowed: false,
        status: 403,
        error: 'Chỉ Giám Đốc (ADMIN) mới có quyền thực hiện thao tác này.'
      };
    }
  } else if (options.mandatory) {
    return {
      allowed: false,
      status: 401,
      error: 'Thiếu header xác thực quyền X-PG-Role.'
    };
  }
  return { allowed: true, role: role || 'ANONYMOUS' };
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
  // 1. Ưu tiên khôi phục từ Cloud Store (Supabase REST / Vercel KV / Upstash Redis) nếu có
  const provider = getCloudProvider();
  if (provider) {
    const cloudData = await cloudLoadState();
    if (cloudData && typeof cloudData === 'object' && Object.keys(cloudData).length > 0) {
      writeJson('app_state.json', cloudData);
      writeJson('pg_home_live_state.json', cloudData);
      return cloudData;
    }
  }

  // 2. Fallback đọc từ /tmp hoặc data/
  let state = readJson('app_state.json', null);
  if (!state || Object.keys(state).length === 0) {
    state = readJson('pg_home_live_state.json', {});
  }
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
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Actor, X-Role, X-PG-Role, X-PG-Actor');
  res.setHeader('Cache-Control', 'no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  if (req.method === 'GET') {
    if (pathname === '/api/load-state' || pathname === '/api/live-state') {
      const state = await loadCurrentState();
      const provider = getCloudProvider();
      return res.status(200).json({
        status: 'ok',
        data: state,
        state,
        persistenceMode: provider ? 'cloud' : 'ephemeral-tmp',
        source: provider ? 'cloud' : 'disk',
        updatedAt: getStateUpdatedAt(state)
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

    if (pathname === '/api/backups') {
      return res.status(200).json({ status: 'ok', backups: [] });
    }

    if (pathname === '/api/audit-log') {
      return res.status(200).json({ status: 'ok', logs: readJson('audit_log.json', []) });
    }

    if (pathname.startsWith('/data/')) {
      const fname = path.basename(pathname);
      if (fname.endsWith('.json')) {
        return res.status(200).json(readJson(fname, {}));
      }
    }

    return res.status(200).json({ status: 'ok', path: pathname });
  }

  if (req.method === 'POST') {
    const payload = await parseRequestBody(req);

    if (pathname === '/api/save-state') {
      const roleCheck = validateRole(req);
      if (!roleCheck.allowed) {
        return res.status(roleCheck.status).json({
          status: 'error',
          code: 'ROLE_UNAUTHORIZED',
          message: roleCheck.error
        });
      }

      const stateToSave = (payload && typeof payload === 'object' && payload.state) ? payload.state : payload;
      if (!stateToSave || typeof stateToSave !== 'object') {
        return res.status(400).json({ status: 'error', message: 'Payload không hợp lệ.' });
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

      const cloudRes = await cloudSaveState(stateToSave);
      const provider = getCloudProvider();

      return res.status(200).json({
        status: 'ok',
        saved_at: nowIso,
        updatedAt: stateToSave.updatedAt,
        persistenceMode: provider ? 'cloud' : 'ephemeral-tmp',
        cloudSynced: !!cloudRes.success,
        message: 'Đã lưu trạng thái thành công.'
      });
    }

    if (pathname === '/api/patch-state') {
      const roleCheck = validateRole(req);
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

      // Merge nguyên tử từng key
      for (const key of Object.keys(patches)) {
        if (patches[key] !== undefined) {
          baseState[key] = patches[key];
          patchedKeys.push(key);
        }
      }

      baseState.updatedAt = patches.updatedAt || nowIso;
      baseState.last_patch_at = nowIso;
      if (req.headers['x-actor']) {
        baseState.last_patched_by = req.headers['x-actor'];
      }

      writeJson('app_state.json', baseState);
      writeJson('pg_home_live_state.json', baseState);

      const cloudRes = await cloudSaveState(baseState);
      const provider = getCloudProvider();

      return res.status(200).json({
        status: 'ok',
        message: 'Đã patch trạng thái thành công.',
        updatedAt: baseState.updatedAt,
        patchedKeys,
        persistenceMode: provider ? 'cloud' : 'ephemeral-tmp',
        cloudSynced: !!cloudRes.success,
        data: baseState,
        state: baseState
      });
    }

    if (pathname === '/api/zalo-trigger-scan') {
      return res.status(200).json({
        status: 'ok',
        message: 'Đã kích hoạt đồng bộ Zalo V6.0.',
        summary: readJson('zalo_v6_master_summary.json', {})
      });
    }

    if (pathname === '/api/zalo-approve-item') {
      const roleCheck = validateRole(req);
      if (!roleCheck.allowed) {
        return res.status(roleCheck.status).json({
          status: 'error',
          code: 'ROLE_UNAUTHORIZED',
          message: roleCheck.error
        });
      }

      const itemId = payload.id || payload.item_id;
      const action = payload.action || 'APPROVED';
      const staging = readJson('zalo_staging_inbox.json', { items: [] });
      for (const it of (staging.items || [])) {
        if (it.id === itemId || it.sha256 === itemId) {
          it.status = action;
          it.approved_at = new Date().toISOString();
          if (req.headers['x-actor']) {
            it.approved_by = req.headers['x-actor'];
          }
        }
      }
      writeJson('zalo_staging_inbox.json', staging);
      return res.status(200).json({ status: 'ok', id: itemId, action });
    }

    if (pathname === '/api/audit-log') {
      const logs = readJson('audit_log.json', []);
      if (Array.isArray(logs)) {
        logs.unshift({ ...payload, server_ts: new Date().toISOString() });
        writeJson('audit_log.json', logs.slice(0, 500));
      }
      return res.status(200).json({ status: 'ok' });
    }

    return res.status(200).json({ status: 'ok' });
  }

  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
};
