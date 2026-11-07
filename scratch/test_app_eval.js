// Test executing app.js in a mocked browser environment
const fs = require('fs');

// Mock browser objects
global.window = {
    addEventListener: () => {},
    localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
    },
    location: { hash: '#dashboard' },
    navigator: { serviceWorker: { register: () => Promise.resolve() } },
    document: null
};
global.document = {
    addEventListener: () => {},
    getElementById: (id) => ({
        addEventListener: () => {},
        innerHTML: '',
        textContent: '',
        value: '',
        style: {},
        classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
        setAttribute: () => {},
        getAttribute: () => null,
        querySelectorAll: () => []
    }),
    querySelector: () => ({ addEventListener: () => {}, querySelectorAll: () => [], setAttribute: () => {} }),
    querySelectorAll: () => [],
    createElement: () => ({
        appendChild: () => {},
        setAttribute: () => {},
        classList: { add: () => {}, remove: () => {} },
        style: {}
    })
};
global.window.document = global.document;
global.localStorage = global.window.localStorage;
global.navigator = global.window.navigator;
global.location = global.window.location;

try {
    const code = fs.readFileSync('f:\\PG Home - Quản trị\\web_app\\app.js', 'utf8');
    eval(code);
    console.log("EXECUTION SUCCESS: app.js loaded and evaluated with zero errors!");
    
    // Check if DEFAULT_DATA is valid
    if (typeof DEFAULT_DATA !== 'undefined') {
        console.log("DEFAULT_DATA keys:", Object.keys(DEFAULT_DATA));
        console.log("ccscMonths count:", DEFAULT_DATA.ccscMonths.length);
        console.log("contracts count:", DEFAULT_DATA.contracts.length);
        console.log("materials count:", DEFAULT_DATA.materials.length);
        console.log("debts count:", DEFAULT_DATA.debts.length);
        console.log("poList count:", DEFAULT_DATA.poList.length);
        console.log("supplierDebts count:", DEFAULT_DATA.supplierDebts.length);
    }
} catch (e) {
    console.error("RUNTIME ERROR in app.js:", e);
    process.exit(1);
}
