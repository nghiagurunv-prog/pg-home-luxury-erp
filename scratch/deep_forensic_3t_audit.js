// Deep Forensic 3T Runtime & Logic Auditor for PG Home Luxury ERP
const fs = require('fs');
const path = require('path');

const ROOT = 'f:/PG Home - Quản trị';

function runEditionAudit(editionName, htmlRel, jsRel, bundleRel) {
  console.log(`\n==================================================================`);
  console.log(`🔍 AUDITING EDITION: ${editionName}`);
  console.log(`   HTML:   ${htmlRel}`);
  console.log(`   JS:     ${jsRel}`);
  console.log(`   BUNDLE: ${bundleRel}`);
  console.log(`==================================================================`);

  const html = fs.readFileSync(path.join(ROOT, htmlRel), 'utf8');
  const appCode = fs.readFileSync(path.join(ROOT, jsRel), 'utf8');
  const bundleCode = fs.readFileSync(path.join(ROOT, bundleRel), 'utf8');

  // 1. Check all `let ` and `const ` declarations at top-level of appCode
  const letConstRegex = /^(?:let|const)\s+([a-zA-Z0-9_$]+)/gm;
  let match;
  const topLevelVars = [];
  while ((match = letConstRegex.exec(appCode)) !== null) {
    const lineNum = appCode.slice(0, match.index).split('\n').length;
    topLevelVars.push({ name: match[1], line: lineNum });
  }
  console.log(`[1] Top-level let/const declarations in ${jsRel}: ${topLevelVars.length}`);
  if (topLevelVars.length > 0) {
    console.error(`   ❌ TDZ HAZARD: Found ${topLevelVars.length} top-level let/const declarations in ${jsRel}! Must be 0 (all var).`);
  }

  // 2. Check HTML structure: nav items vs tab-content sections
  const navTabMatches = [...html.matchAll(/class="[^"]*nav-item[^"]*"[^>]*data-tab="([^"]+)"/g)];
  const tabContentMatches = [...html.matchAll(/id="(tab-[^"]+)"\s+class="[^"]*tab-content/g)];
  const tabContentMatches2 = [...html.matchAll(/class="[^"]*tab-content[^"]*"\s+id="(tab-[^"]+)"/g)];
  const allTabIds = new Set([
    ...tabContentMatches.map(m => m[1]),
    ...tabContentMatches2.map(m => m[1])
  ]);
  console.log(`[2] Sidebar .nav-item count: ${navTabMatches.length} | .tab-content count: ${allTabIds.size}`);
  for (const m of navTabMatches) {
    const tId = m[1];
    if (!allTabIds.has(tId) && !html.includes(`id="${tId}"`)) {
      console.error(`   ❌ BROKEN NAV ITEM: data-tab="${tId}" has NO matching element id="${tId}" in ${htmlRel}!`);
    }
  }

  // 3. Extract all inline event handlers from HTML (onclick, onchange, oninput)
  const inlineHandlers = [];
  const handlerRegex = /\b(onclick|onchange|oninput)="([^"]+)"/g;
  while ((match = handlerRegex.exec(html)) !== null) {
    inlineHandlers.push({ attr: match[1], code: match[2] });
  }
  console.log(`[3] Inline HTML event handlers found: ${inlineHandlers.length}`);

  // 4. Create realistic DOM simulation to execute appCode + bundleCode + DOMContentLoaded + all renders
  const domListeners = [];
  const winListeners = [];
  const elementsMap = {};

  function createElementMock(id = '', tag = 'DIV') {
    const children = [];
    const attrs = {};
    const classSet = new Set();
    const el = {
      id: id,
      tagName: String(tag || 'DIV').toUpperCase(),
      innerHTML: '',
      outerHTML: '',
      textContent: '',
      innerText: '',
      value: '10',
      checked: false,
      disabled: false,
      dataset: {},
      style: new Proxy({}, {
        set(target, prop, val) { target[prop] = val; return true; },
        get(target, prop) { return target[prop] || ''; }
      }),
      children: children,
      childNodes: children,
      parentNode: null,
      parentElement: null,
      nextElementSibling: null,
      previousElementSibling: null,
      classList: {
        add: (...cls) => cls.forEach(c => classSet.add(c)),
        remove: (...cls) => cls.forEach(c => classSet.delete(c)),
        contains: (c) => classSet.has(c),
        toggle: (c, force) => {
          if (force === true) { classSet.add(c); return true; }
          if (force === false) { classSet.delete(c); return false; }
          if (classSet.has(c)) { classSet.delete(c); return false; }
          classSet.add(c); return true;
        }
      },
      setAttribute: (k, v) => { attrs[k] = String(v); if (k === 'id') el.id = String(v); },
      getAttribute: (k) => attrs[k] !== undefined ? attrs[k] : null,
      hasAttribute: (k) => attrs[k] !== undefined,
      removeAttribute: (k) => { delete attrs[k]; },
      addEventListener: (ev, cb) => {},
      removeEventListener: () => {},
      querySelector: (sel) => {
        if (sel && sel.startsWith('#') && !sel.includes(' ')) {
          return elementsMap[sel.slice(1)] || createElementMock(sel.slice(1));
        }
        return createElementMock('qs_mock');
      },
      querySelectorAll: (sel) => [],
      closest: (sel) => null,
      appendChild: (child) => {
        if (child) {
          child.parentNode = el;
          child.parentElement = el;
          children.push(child);
          if (child.id) elementsMap[child.id] = child;
        }
        return child;
      },
      insertBefore: (newNode, refNode) => {
        if (newNode) {
          newNode.parentNode = el;
          newNode.parentElement = el;
          children.push(newNode);
          if (newNode.id) elementsMap[newNode.id] = newNode;
        }
        return newNode;
      },
      insertAdjacentHTML: () => {},
      insertAdjacentElement: () => {},
      remove: () => {},
      focus: () => {},
      blur: () => {},
      click: () => {},
      scrollIntoView: () => {},
      getBoundingClientRect: () => ({ top: 0, left: 0, right: 240, bottom: 800, width: 240, height: 800 }),
      getContext: () => ({
        createLinearGradient: () => ({ addColorStop: () => {} }),
        clearRect: () => {},
        fillRect: () => {},
        strokeRect: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        fillText: () => {},
        measureText: () => ({ width: 50 }),
        save: () => {},
        restore: () => {},
        translate: () => {},
        scale: () => {},
        setTransform: () => {},
        setLineDash: () => {}
      })
    };
    return el;
  }

  for (const m of html.matchAll(/id="([^"]+)"/g)) {
    elementsMap[m[1]] = createElementMock(m[1]);
  }
  const headEl = createElementMock('head', 'HEAD');
  const bodyEl = createElementMock('body', 'BODY');

  const storageStore = {};
  const sessionStore = {};

  const sandboxWindow = {
    addEventListener: (ev, cb) => { winListeners.push({ ev, cb }); },
    removeEventListener: () => {},
    dispatchEvent: () => {},
    localStorage: {
      getItem: (k) => storageStore[k] !== undefined ? storageStore[k] : null,
      setItem: (k, v) => { storageStore[k] = String(v); },
      removeItem: (k) => { delete storageStore[k]; },
      clear: () => { Object.keys(storageStore).forEach(k => delete storageStore[k]); }
    },
    sessionStorage: {
      getItem: (k) => sessionStore[k] !== undefined ? sessionStore[k] : null,
      setItem: (k, v) => { sessionStore[k] = String(v); },
      removeItem: (k) => { delete sessionStore[k]; },
      clear: () => { Object.keys(sessionStore).forEach(k => delete sessionStore[k]); }
    },
    location: {
      href: 'http://127.0.0.1:8080/director',
      hostname: '127.0.0.1',
      port: '8080',
      pathname: editionName.includes('DIRECTOR') ? '/director' : '/deploy',
      search: '',
      hash: '#dashboard',
      reload: () => {}
    },
    navigator: {
      onLine: true,
      userAgent: 'Mozilla/5.0',
      clipboard: { writeText: () => Promise.resolve() },
      serviceWorker: { register: () => Promise.resolve() }
    },
    crypto: {
      subtle: {
        digest: async () => new Uint8Array(32).buffer
      }
    },
    fetch: async (url) => ({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok', ok: true, groups_count: 16, present: 9, total: 9 }),
      text: async () => '{}'
    }),
    Chart: function() { return { destroy: () => {}, update: () => {}, resize: () => {} }; },
    confirm: () => true,
    alert: () => {},
    prompt: () => '0986',
    print: () => {},
    open: () => ({ document: { write: () => {}, close: () => {} }, focus: () => {}, print: () => {}, close: () => {} }),
    requestAnimationFrame: (cb) => {},
    setTimeout: (cb, ms) => 1,
    clearTimeout: () => {},
    setInterval: (cb, ms) => 1,
    clearInterval: () => {},
    getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', getPropertyValue: () => '' }),
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    BroadcastChannel: function() { return { postMessage: () => {}, close: () => {}, addEventListener: () => {} }; },
    EventSource: function() { return { close: () => {}, addEventListener: () => {} }; }
  };

  const sandboxDoc = {
    readyState: 'complete',
    title: 'PG HOME LUXURY',
    head: headEl,
    body: bodyEl,
    documentElement: createElementMock('html', 'HTML'),
    addEventListener: (ev, cb) => { domListeners.push({ ev, cb }); },
    removeEventListener: () => {},
    getElementById: (id) => {
      if (!elementsMap[id]) elementsMap[id] = createElementMock(id);
      return elementsMap[id];
    },
    querySelector: (sel) => {
      if (sel && sel.startsWith('#') && !sel.includes(' ')) {
        const id = sel.slice(1);
        if (!elementsMap[id]) elementsMap[id] = createElementMock(id);
        return elementsMap[id];
      }
      return createElementMock('qs');
    },
    querySelectorAll: (sel) => [],
    createElement: (tag) => createElementMock('', tag),
    createDocumentFragment: () => createElementMock('frag', 'FRAGMENT')
  };

  sandboxWindow.document = sandboxDoc;
  sandboxWindow.window = sandboxWindow;
  sandboxWindow.globalThis = sandboxWindow;
  sandboxWindow.self = sandboxWindow;
  sandboxWindow.console = console;
  sandboxWindow.Math = Math;
  sandboxWindow.Date = Date;
  sandboxWindow.JSON = JSON;
  sandboxWindow.Object = Object;
  sandboxWindow.Array = Array;
  sandboxWindow.String = String;
  sandboxWindow.Number = Number;
  sandboxWindow.Boolean = Boolean;
  sandboxWindow.RegExp = RegExp;
  sandboxWindow.Map = Map;
  sandboxWindow.Set = Set;
  sandboxWindow.Promise = Promise;
  sandboxWindow.Error = Error;
  sandboxWindow.TypeError = TypeError;
  sandboxWindow.ReferenceError = ReferenceError;
  sandboxWindow.parseInt = parseInt;
  sandboxWindow.parseFloat = parseFloat;
  sandboxWindow.isNaN = isNaN;
  sandboxWindow.isFinite = isFinite;
  sandboxWindow.encodeURIComponent = encodeURIComponent;
  sandboxWindow.decodeURIComponent = decodeURIComponent;
  sandboxWindow.Uint8Array = Uint8Array;
  sandboxWindow.Int32Array = Int32Array;
  sandboxWindow.Float64Array = Float64Array;
  sandboxWindow.URL = URL;
  sandboxWindow.URLSearchParams = URLSearchParams;
  sandboxWindow.Blob = typeof Blob !== 'undefined' ? Blob : function() {};

  sandboxWindow.HTMLElement = function() {};
  sandboxWindow.Element = function() {};
  sandboxWindow.Node = function() {};
  sandboxWindow.Event = function(type) { this.type = type; };
  sandboxWindow.CustomEvent = function(type, opts) { this.type = type; this.detail = opts ? opts.detail : null; };
  sandboxWindow.MutationObserver = function() { return { observe: () => {}, disconnect: () => {} }; };
  sandboxWindow.IntersectionObserver = function() { return { observe: () => {}, disconnect: () => {} }; };
  sandboxWindow.ResizeObserver = function() { return { observe: () => {}, disconnect: () => {} }; };
  sandboxWindow.FileReader = function() { return { readAsDataURL: () => {}, readAsText: () => {} }; };
  sandboxWindow.Image = function() { return {}; };
  sandboxWindow.Audio = function() { return { play: () => Promise.resolve() }; };
  sandboxWindow.performance = { now: () => Date.now() };

  const vm = require('vm');
  let errorCount = topLevelVars.length;
  const ctx = vm.createContext(sandboxWindow);
  try {
    vm.runInContext(appCode, ctx, { filename: jsRel });
    console.log(`   ✅ UNPATCHED Top-level eval of ${jsRel} SUCCEEDED (0 TDZ / ReferenceError).`);
  } catch (err) {
    errorCount++;
    console.error(`   ❌ UNPATCHED Top-level eval ERROR in ${jsRel}: ${err.stack || err.message}`);
  }

  try {
    vm.runInContext(bundleCode, ctx, { filename: bundleRel });
    console.log(`   ✅ Top-level eval of ${bundleRel} SUCCEEDED.`);
  } catch (err) {
    errorCount++;
    console.error(`   ❌ Top-level eval ERROR in ${bundleRel}: ${err.stack || err}`);
  }

  // Trigger DOMContentLoaded listeners
  console.log(`[4] Executing ${domListeners.length} DOMContentLoaded listeners...`);
  for (let i = 0; i < domListeners.length; i++) {
    const l = domListeners[i];
    if (l.ev === 'DOMContentLoaded') {
      try {
        l.cb();
      } catch (err) {
        errorCount++;
        console.error(`   ❌ Error in DOMContentLoaded listener #${i}: ${err.stack || err}`);
      }
    }
  }

  // Also test calling every major render / action function
  const coreFunctionsToTest = [
    'initNavigation', 'renderAll', 'renderDashboard', 'renderCCSCTable',
    'renderCCSCMonthDetail', 'renderAttendanceMatrix', 'renderChamCongTho',
    'renderVatuQuickAdd', 'renderPOList', 'renderHopDong', 'renderCongNo',
    'renderQuotationTable', 'renderMaterialSummary', 'renderDynamicPricingTable',
    'renderCostWatchdog', 'renderZaloSyncStatus', 'renderUserManagementTable',
    'switchDeployDivision', 'syncZaloAttendanceQuick', 'triggerFullProjectZaloScan'
  ];
  console.log(`[5] Testing execution of core functions...`);
  for (const fnName of coreFunctionsToTest) {
    if (typeof sandboxWindow[fnName] === 'function') {
      try {
        sandboxWindow[fnName]();
      } catch (err) {
        errorCount++;
        console.error(`   ❌ Runtime error when calling ${fnName}(): ${err.stack || err}`);
      }
    } else {
      console.log(`   ℹ️ Function ${fnName} not defined in ${editionName}`);
    }
  }

  // Check inline handler functions existence on window/global
  console.log(`[6] Verifying inline HTML event handler function names...`);
  const fnCallRegex = /^([a-zA-Z0-9_$.]+)\s*\(/;
  const missingFns = new Set();
  for (const h of inlineHandlers) {
    const statements = h.code.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      if (stmt.startsWith('if') || stmt.startsWith('window.location') || stmt.startsWith('document.') || stmt.startsWith('this.') || stmt.startsWith('return ') || stmt.startsWith('event.') || stmt.startsWith('let ') || stmt.startsWith('const ')) continue;
      const m = stmt.match(fnCallRegex);
      if (m) {
        const fnPath = m[1];
        const cleanName = fnPath.replace(/^window\./, '');
        const exists = (typeof sandboxWindow[cleanName] === 'function');
        if (!exists && !cleanName.includes('.')) {
          missingFns.add(`${cleanName} (in ${h.attr}="${h.code}")`);
        }
      }
    }
  }
  if (missingFns.size === 0) {
    console.log(`   ✅ All inline HTML handler functions exist!`);
  } else {
    errorCount += missingFns.size;
    console.error(`   ❌ MISSING INLINE HANDLER FUNCTIONS (${missingFns.size}):`);
    missingFns.forEach(f => console.error(`      - ${f}`));
  }
  return errorCount;
}

const err1 = runEditionAudit(
  'LOCAL DIRECTOR VAULT',
  'local_admin_vault/director_ccsc_full.html',
  'local_admin_vault/director_app_full.js',
  'local_admin_vault/modules/pg_w50_master.bundle.js'
);

const err2 = runEditionAudit(
  'CLOUD 2-DIVISION DEPLOY',
  'web_app/index.html',
  'web_app/app.js',
  'web_app/modules/pg_w50_master.bundle.js'
);

// 7. Verify API & Service Worker Security Invariants
let err3 = 0;
const apiCode = fs.readFileSync(path.join(ROOT, 'api/index.js'), 'utf8');
const swCode = fs.readFileSync(path.join(ROOT, 'web_app/sw.js'), 'utf8');
if (!apiCode.includes("PROTO_KEYS") || !apiCode.includes("preservedExec") || !apiCode.includes("dNum <= 31")) {
  console.error("❌ API SECURITY INVARIANT FAILED: Missing PROTO_KEYS / preservedExec / 31-day attendance sync in api/index.js!");
  err3++;
}
if (!swCode.includes("pg-home-erp-v2026.11.14-v40") || !swCode.includes("pathname.startsWith('/api/')")) {
  console.error("❌ SERVICE WORKER INVARIANT FAILED: Missing v40 cache name or /api/ Network-First rule in web_app/sw.js!");
  err3++;
}

if (err1 + err2 + err3 > 0) {
  console.error(`\n❌ AUDIT FAILED WITH ${err1 + err2 + err3} RUNTIME/LOGIC ERROR(S)!`);
  process.exit(1);
} else {
  console.log(`\n✅ ALL EDITIONS PASSED DEEP FORENSIC RUNTIME & LOGIC AUDIT (0 ERRORS)!`);
  process.exit(0);
}
