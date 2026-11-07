const fs = require('fs');

global.Chart = function() {
    return { destroy: () => {}, update: () => {} };
};

const html = fs.readFileSync('f:/PG Home - Quản trị/web_app/index.html', 'utf8');

function createElementMock(id, tag = 'div') {
    return {
        id: id,
        tagName: tag.toUpperCase(),
        innerHTML: '',
        textContent: '',
        value: '10',
        style: {},
        classList: {
            add: function() {},
            remove: function() {},
            contains: function() { return false; },
            toggle: function() {}
        },
        setAttribute: function() {},
        getAttribute: function() { return null; },
        addEventListener: function() {},
        querySelector: function() { return null; },
        querySelectorAll: function() { return []; },
        closest: function() { return null; },
        appendChild: function() {},
        getContext: function() {
            return {
                createLinearGradient: function() {
                    return { addColorStop: function() {} };
                }
            };
        }
    };
}

const elementsMap = {};
const idMatches = html.matchAll(/id="([^"]+)"/g);
for (const match of idMatches) {
    elementsMap[match[1]] = createElementMock(match[1]);
}

global.window = {
    addEventListener: () => {},
    localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
    },
    location: { hash: '#dashboard' },
    navigator: { serviceWorker: { register: () => Promise.resolve() } }
};

global.document = {
    addEventListener: (ev, cb) => {},
    getElementById: (id) => elementsMap[id] || createElementMock(id),
    querySelector: (sel) => {
        if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || createElementMock(sel.slice(1));
        return createElementMock('mock');
    },
    querySelectorAll: (sel) => [],
    createElement: (tag) => createElementMock('created', tag),
    body: createElementMock('body')
};

global.localStorage = global.window.localStorage;
global.window.document = global.document;

const appCode = fs.readFileSync('f:/PG Home - Quản trị/web_app/app.js', 'utf8');

try {
    eval(appCode + `
    console.log("PASS: app.js evaluated.");

    const renderFuncs = [
        ["renderDashboard", () => renderDashboard(10)],
        ["renderCCSCTable", () => renderCCSCTable()],
        ["renderKhoiLuongXuong", () => renderKhoiLuongXuong("10")],
        ["renderChamCongTho", () => renderChamCongTho()],
        ["renderVatTu", () => renderVatTu()],
        ["renderPOList", () => renderPOList("all")],
        ["renderZaloSupplierGroups", () => renderZaloSupplierGroups()],
        ["renderHopDong", () => renderHopDong()],
        ["renderCongNo", () => renderCongNo()],
        ["renderDebtRadar", () => renderDebtRadar()],
        ["renderSupplierDebts", () => renderSupplierDebts()],
        ["renderPhuKienSofaTable", () => renderPhuKienSofaTable()],
        ["renderExpensesTable", () => renderExpensesTable("10")],
        ["renderUsersTable", () => renderUsersTable()],
        ["applyUserRole", () => applyUserRole(currentUser)],
        ["initEstimatorModule", () => initEstimatorModule()],
        ["applyPrivacyShieldState", () => applyPrivacyShieldState()],
        ["renderMaterialVsQuotaTable", () => window.renderMaterialVsQuotaTable()]
    ];

    for (const [name, fn] of renderFuncs) {
        try {
            fn();
            console.log("PASS:", name);
        } catch (err) {
            console.error("FAIL in function:", name, err);
        }
    }
    `);
} catch (e) {
    console.error("TOP LEVEL ERROR:", e);
    process.exit(1);
}
process.exit(0);
