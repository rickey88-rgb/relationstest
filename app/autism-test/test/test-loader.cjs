/* eslint-disable @typescript-eslint/no-require-imports -- Executable Node CommonJS test harness. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
module.exports = function createLoader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const loadedModule = { exports: {} }; cache.set(file, loadedModule);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    new Function('require', 'module', 'exports', code)(name => {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      return name.startsWith('.') ? load(path.resolve(path.dirname(file), name + '.ts')) : require(name);
    }, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return load;
};
