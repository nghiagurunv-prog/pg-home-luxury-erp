// Test headless verification of app.js data structures
const fs = require('fs');
const code = fs.readFileSync('web_app/app.js', 'utf8');

// Mock browser globals
global.window = {
  addEventListener: () => {},
  location: { hash: '' }
};
global.document = {
  getElementById: (id) => ({
    textContent: '',
    value: '',
    innerHTML: '',
    appendChild: () => {},
    classList: { add: () => {}, remove: () => {} }
  }),
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {}
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.console = console;

eval(code);

console.log("DEFAULT_DATA.materials count:", DEFAULT_DATA.materials.length);
console.log("DEFAULT_DATA.poList count:", DEFAULT_DATA.poList.length);
console.log("DEFAULT_DATA.zaloSupplierGroups count:", DEFAULT_DATA.zaloSupplierGroups.length);

const state = loadState();
console.log("Loaded state materials count:", state.materials ? state.materials.length : "UNDEFINED");
console.log("Loaded state PO count:", state.poList ? state.poList.length : "UNDEFINED");
console.log("Loaded state Zalo groups count:", state.zaloSupplierGroups ? state.zaloSupplierGroups.length : "UNDEFINED");

// Test with mock empty saved state
global.localStorage.getItem = () => JSON.stringify({ materials: [] });
const stateFromEmpty = loadState();
console.log("State recovered from empty localStorage materials count:", stateFromEmpty.materials.length);
