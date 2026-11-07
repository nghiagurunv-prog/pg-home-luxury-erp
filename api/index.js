const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const TMP_DIR = '/tmp/pg_home_data';

function readJson(filename, defaultVal = {}) {
  try {
    const tmpPath = path.join(TMP_DIR, filename);
    if (fs.existsSync(tmpPath)) {
      return JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
    }
    const dataPath = path.join(DATA_DIR, filename);
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
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
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Actor, X-Role');
  res.setHeader('Cache-Control', 'no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  if (req.method === 'GET') {
    if (pathname === '/api/load-state' || pathname === '/api/live-state') {
      const state = readJson('pg_home_live_state.json', {});
      return res.status(200).json({ status: 'ok', data: state, state });
    }

    if (pathname === '/api/health') {
      const state = readJson('pg_home_live_state.json', {});
      return res.status(200).json({
        status: 'ok',
        server: 'PG Home Luxury Cloud Server v6.0 (Vercel)',
        company: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
        email: 'pghomehatinh@gmail.com',
        tax_code: '042203002931',
        hotline: '0973.562.789',
        has_state: Object.keys(state).length > 0,
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
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    if (pathname === '/api/save-state') {
      const stateToSave = (payload && typeof payload === 'object' && payload.state) ? payload.state : payload;
      writeJson('pg_home_live_state.json', stateToSave);
      return res.status(200).json({
        status: 'ok',
        saved_at: new Date().toISOString(),
        message: 'Đã lưu trạng thái thành công.'
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
      const itemId = payload.id || payload.item_id;
      const action = payload.action || 'APPROVED';
      const staging = readJson('zalo_staging_inbox.json', { items: [] });
      for (const it of (staging.items || [])) {
        if (it.id === itemId || it.sha256 === itemId) {
          it.status = action;
          it.approved_at = new Date().toISOString();
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

