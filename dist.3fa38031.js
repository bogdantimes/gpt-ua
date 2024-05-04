// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"5r9Qo":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "6ccf3b423fa38031";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws;
    try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        if (e.message) console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"dUFLt":[function(require,module,exports) {
// src/parse-path.ts
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Path2D", ()=>Path2D);
parcelHelpers.export(exports, "applyPath2DToCanvasRenderingContext", ()=>applyPath2DToCanvasRenderingContext);
parcelHelpers.export(exports, "applyRoundRectToCanvasRenderingContext2D", ()=>applyRoundRectToCanvasRenderingContext2D);
parcelHelpers.export(exports, "applyRoundRectToPath2D", ()=>applyRoundRectToPath2D);
parcelHelpers.export(exports, "buildPath", ()=>buildPath);
parcelHelpers.export(exports, "parsePath", ()=>parsePath);
parcelHelpers.export(exports, "roundRect", ()=>roundRect);
var ARG_LENGTH = {
    a: 7,
    c: 6,
    h: 1,
    l: 2,
    m: 2,
    q: 4,
    s: 4,
    t: 2,
    v: 1,
    z: 0
};
var SEGMENT_PATTERN = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
var NUMBER = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;
function parseValues(args) {
    const numbers = args.match(NUMBER);
    return numbers ? numbers.map(Number) : [];
}
function parsePath(path) {
    const data = [];
    const p = String(path).trim();
    if (p[0] !== "M" && p[0] !== "m") return data;
    p.replace(SEGMENT_PATTERN, (_, command, args)=>{
        const theArgs = parseValues(args);
        let type = command.toLowerCase();
        let theCommand = command;
        if (type === "m" && theArgs.length > 2) {
            data.push([
                theCommand,
                ...theArgs.splice(0, 2)
            ]);
            type = "l";
            theCommand = theCommand === "m" ? "l" : "L";
        }
        if (theArgs.length < ARG_LENGTH[type]) return "";
        data.push([
            theCommand,
            ...theArgs.splice(0, ARG_LENGTH[type])
        ]);
        while(theArgs.length >= ARG_LENGTH[type] && theArgs.length && ARG_LENGTH[type])data.push([
            theCommand,
            ...theArgs.splice(0, ARG_LENGTH[type])
        ]);
        return "";
    });
    return data;
}
// src/path2d.ts
function rotatePoint(point, angle) {
    const nx = point.x * Math.cos(angle) - point.y * Math.sin(angle);
    const ny = point.y * Math.cos(angle) + point.x * Math.sin(angle);
    point.x = nx;
    point.y = ny;
}
function translatePoint(point, dx, dy) {
    point.x += dx;
    point.y += dy;
}
function scalePoint(point, s) {
    point.x *= s;
    point.y *= s;
}
var Path2D = class _Path2D {
    constructor(path){
        this.commands = [];
        if (path && path instanceof _Path2D) this.commands.push(...path.commands);
        else if (path) this.commands = parsePath(path);
    }
    addPath(path) {
        if (path && path instanceof _Path2D) this.commands.push(...path.commands);
    }
    moveTo(x, y) {
        this.commands.push([
            "M",
            x,
            y
        ]);
    }
    lineTo(x, y) {
        this.commands.push([
            "L",
            x,
            y
        ]);
    }
    arc(x, y, r, start, end, ccw) {
        this.commands.push([
            "AC",
            x,
            y,
            r,
            start,
            end,
            !!ccw
        ]);
    }
    arcTo(x1, y1, x2, y2, r) {
        this.commands.push([
            "AT",
            x1,
            y1,
            x2,
            y2,
            r
        ]);
    }
    ellipse(x, y, rx, ry, angle, start, end, ccw) {
        this.commands.push([
            "E",
            x,
            y,
            rx,
            ry,
            angle,
            start,
            end,
            !!ccw
        ]);
    }
    closePath() {
        this.commands.push([
            "Z"
        ]);
    }
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        this.commands.push([
            "C",
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            x,
            y
        ]);
    }
    quadraticCurveTo(cpx, cpy, x, y) {
        this.commands.push([
            "Q",
            cpx,
            cpy,
            x,
            y
        ]);
    }
    rect(x, y, width, height) {
        this.commands.push([
            "R",
            x,
            y,
            width,
            height
        ]);
    }
    roundRect(x, y, width, height, radii) {
        if (typeof radii === "undefined") this.commands.push([
            "RR",
            x,
            y,
            width,
            height,
            0
        ]);
        else this.commands.push([
            "RR",
            x,
            y,
            width,
            height,
            radii
        ]);
    }
};
function buildPath(ctx, commands) {
    let x = 0;
    let y = 0;
    let endAngle;
    let startAngle;
    let largeArcFlag;
    let sweepFlag;
    let endPoint;
    let midPoint;
    let angle;
    let lambda;
    let t1;
    let t2;
    let x1;
    let y1;
    let r;
    let rx;
    let ry;
    let w;
    let h;
    let pathType;
    let centerPoint;
    let ccw;
    let radii;
    let cpx = null;
    let cpy = null;
    let qcpx = null;
    let qcpy = null;
    let startPoint = null;
    let currentPoint = null;
    ctx.beginPath();
    for(let i = 0; i < commands.length; ++i){
        pathType = commands[i][0];
        if (pathType !== "S" && pathType !== "s" && pathType !== "C" && pathType !== "c") {
            cpx = null;
            cpy = null;
        }
        if (pathType !== "T" && pathType !== "t" && pathType !== "Q" && pathType !== "q") {
            qcpx = null;
            qcpy = null;
        }
        let c;
        switch(pathType){
            case "m":
            case "M":
                c = commands[i];
                if (pathType === "m") {
                    x += c[1];
                    y += c[2];
                } else {
                    x = c[1];
                    y = c[2];
                }
                if (pathType === "M" || !startPoint) startPoint = {
                    x,
                    y
                };
                ctx.moveTo(x, y);
                break;
            case "l":
                c = commands[i];
                x += c[1];
                y += c[2];
                ctx.lineTo(x, y);
                break;
            case "L":
                c = commands[i];
                x = c[1];
                y = c[2];
                ctx.lineTo(x, y);
                break;
            case "H":
                c = commands[i];
                x = c[1];
                ctx.lineTo(x, y);
                break;
            case "h":
                c = commands[i];
                x += c[1];
                ctx.lineTo(x, y);
                break;
            case "V":
                c = commands[i];
                y = c[1];
                ctx.lineTo(x, y);
                break;
            case "v":
                c = commands[i];
                y += c[1];
                ctx.lineTo(x, y);
                break;
            case "a":
            case "A":
                c = commands[i];
                if (currentPoint === null) throw new Error("This should never happen");
                if (pathType === "a") {
                    x += c[6];
                    y += c[7];
                } else {
                    x = c[6];
                    y = c[7];
                }
                rx = c[1];
                ry = c[2];
                angle = c[3] * Math.PI / 180;
                largeArcFlag = !!c[4];
                sweepFlag = !!c[5];
                endPoint = {
                    x,
                    y
                };
                midPoint = {
                    x: (currentPoint.x - endPoint.x) / 2,
                    y: (currentPoint.y - endPoint.y) / 2
                };
                rotatePoint(midPoint, -angle);
                lambda = midPoint.x * midPoint.x / (rx * rx) + midPoint.y * midPoint.y / (ry * ry);
                if (lambda > 1) {
                    lambda = Math.sqrt(lambda);
                    rx *= lambda;
                    ry *= lambda;
                }
                centerPoint = {
                    x: rx * midPoint.y / ry,
                    y: -(ry * midPoint.x) / rx
                };
                t1 = rx * rx * ry * ry;
                t2 = rx * rx * midPoint.y * midPoint.y + ry * ry * midPoint.x * midPoint.x;
                if (sweepFlag !== largeArcFlag) scalePoint(centerPoint, Math.sqrt((t1 - t2) / t2) || 0);
                else scalePoint(centerPoint, -Math.sqrt((t1 - t2) / t2) || 0);
                startAngle = Math.atan2((midPoint.y - centerPoint.y) / ry, (midPoint.x - centerPoint.x) / rx);
                endAngle = Math.atan2(-(midPoint.y + centerPoint.y) / ry, -(midPoint.x + centerPoint.x) / rx);
                rotatePoint(centerPoint, angle);
                translatePoint(centerPoint, (endPoint.x + currentPoint.x) / 2, (endPoint.y + currentPoint.y) / 2);
                ctx.save();
                ctx.translate(centerPoint.x, centerPoint.y);
                ctx.rotate(angle);
                ctx.scale(rx, ry);
                ctx.arc(0, 0, 1, startAngle, endAngle, !sweepFlag);
                ctx.restore();
                break;
            case "C":
                c = commands[i];
                cpx = c[3];
                cpy = c[4];
                x = c[5];
                y = c[6];
                ctx.bezierCurveTo(c[1], c[2], cpx, cpy, x, y);
                break;
            case "c":
                c = commands[i];
                ctx.bezierCurveTo(c[1] + x, c[2] + y, c[3] + x, c[4] + y, c[5] + x, c[6] + y);
                cpx = c[3] + x;
                cpy = c[4] + y;
                x += c[5];
                y += c[6];
                break;
            case "S":
                c = commands[i];
                if (cpx === null || cpy === null) {
                    cpx = x;
                    cpy = y;
                }
                ctx.bezierCurveTo(2 * x - cpx, 2 * y - cpy, c[1], c[2], c[3], c[4]);
                cpx = c[1];
                cpy = c[2];
                x = c[3];
                y = c[4];
                break;
            case "s":
                c = commands[i];
                if (cpx === null || cpy === null) {
                    cpx = x;
                    cpy = y;
                }
                ctx.bezierCurveTo(2 * x - cpx, 2 * y - cpy, c[1] + x, c[2] + y, c[3] + x, c[4] + y);
                cpx = c[1] + x;
                cpy = c[2] + y;
                x += c[3];
                y += c[4];
                break;
            case "Q":
                c = commands[i];
                qcpx = c[1];
                qcpy = c[2];
                x = c[3];
                y = c[4];
                ctx.quadraticCurveTo(qcpx, qcpy, x, y);
                break;
            case "q":
                c = commands[i];
                qcpx = c[1] + x;
                qcpy = c[2] + y;
                x += c[3];
                y += c[4];
                ctx.quadraticCurveTo(qcpx, qcpy, x, y);
                break;
            case "T":
                c = commands[i];
                if (qcpx === null || qcpy === null) {
                    qcpx = x;
                    qcpy = y;
                }
                qcpx = 2 * x - qcpx;
                qcpy = 2 * y - qcpy;
                x = c[1];
                y = c[2];
                ctx.quadraticCurveTo(qcpx, qcpy, x, y);
                break;
            case "t":
                c = commands[i];
                if (qcpx === null || qcpy === null) {
                    qcpx = x;
                    qcpy = y;
                }
                qcpx = 2 * x - qcpx;
                qcpy = 2 * y - qcpy;
                x += c[1];
                y += c[2];
                ctx.quadraticCurveTo(qcpx, qcpy, x, y);
                break;
            case "z":
            case "Z":
                if (startPoint) {
                    x = startPoint.x;
                    y = startPoint.y;
                }
                startPoint = null;
                ctx.closePath();
                break;
            case "AC":
                c = commands[i];
                x = c[1];
                y = c[2];
                r = c[3];
                startAngle = c[4];
                endAngle = c[5];
                ccw = c[6];
                ctx.arc(x, y, r, startAngle, endAngle, ccw);
                break;
            case "AT":
                c = commands[i];
                x1 = c[1];
                y1 = c[2];
                x = c[3];
                y = c[4];
                r = c[5];
                ctx.arcTo(x1, y1, x, y, r);
                break;
            case "E":
                c = commands[i];
                x = c[1];
                y = c[2];
                rx = c[3];
                ry = c[4];
                angle = c[5];
                startAngle = c[6];
                endAngle = c[7];
                ccw = c[8];
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.scale(rx, ry);
                ctx.arc(0, 0, 1, startAngle, endAngle, ccw);
                ctx.restore();
                break;
            case "R":
                c = commands[i];
                x = c[1];
                y = c[2];
                w = c[3];
                h = c[4];
                startPoint = {
                    x,
                    y
                };
                ctx.rect(x, y, w, h);
                break;
            case "RR":
                c = commands[i];
                x = c[1];
                y = c[2];
                w = c[3];
                h = c[4];
                radii = c[5];
                startPoint = {
                    x,
                    y
                };
                ctx.roundRect(x, y, w, h, radii);
                break;
            default:
                throw new Error(`Invalid path command: ${pathType}`);
        }
        if (!currentPoint) currentPoint = {
            x,
            y
        };
        else {
            currentPoint.x = x;
            currentPoint.y = y;
        }
    }
}
// src/round-rect.ts
function roundRect(x, y, width, height, radii = 0) {
    if (typeof radii === "number") radii = [
        radii
    ];
    if (Array.isArray(radii)) {
        if (radii.length === 0 || radii.length > 4) throw new RangeError(`Failed to execute 'roundRect' on '${this.constructor.name}': ${radii.length} radii provided. Between one and four radii are necessary.`);
        radii.forEach((v)=>{
            if (v < 0) throw new RangeError(`Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${v} is negative.`);
        });
    } else return;
    if (radii.length === 1 && radii[0] === 0) {
        this.rect(x, y, width, height);
        return;
    }
    const minRadius = Math.min(width, height) / 2;
    const tl = Math.min(minRadius, radii[0]);
    let tr = tl;
    let br = tl;
    let bl = tl;
    if (radii.length === 2) {
        tr = Math.min(minRadius, radii[1]);
        bl = tr;
    }
    if (radii.length === 3) {
        tr = Math.min(minRadius, radii[1]);
        bl = tr;
        br = Math.min(minRadius, radii[2]);
    }
    if (radii.length === 4) {
        tr = Math.min(minRadius, radii[1]);
        br = Math.min(minRadius, radii[2]);
        bl = Math.min(minRadius, radii[3]);
    }
    this.moveTo(x, y + height - bl);
    this.arcTo(x, y, x + tl, y, tl);
    this.arcTo(x + width, y, x + width, y + tr, tr);
    this.arcTo(x + width, y + height, x + width - br, y + height, br);
    this.arcTo(x, y + height, x, y + height - bl, bl);
    this.moveTo(x, y);
}
// src/apply.ts
function applyPath2DToCanvasRenderingContext(CanvasRenderingContext2D) {
    if (!CanvasRenderingContext2D) return;
    const cClip = CanvasRenderingContext2D.prototype.clip;
    const cFill = CanvasRenderingContext2D.prototype.fill;
    const cStroke = CanvasRenderingContext2D.prototype.stroke;
    const cIsPointInPath = CanvasRenderingContext2D.prototype.isPointInPath;
    CanvasRenderingContext2D.prototype.clip = function clip(...args) {
        if (args[0] instanceof Path2D) {
            const path = args[0];
            const fillRule2 = args[1] || "nonzero";
            buildPath(this, path.commands);
            return cClip.apply(this, [
                fillRule2
            ]);
        }
        const fillRule = args[0] || "nonzero";
        return cClip.apply(this, [
            fillRule
        ]);
    };
    CanvasRenderingContext2D.prototype.fill = function fill(...args) {
        if (args[0] instanceof Path2D) {
            const path = args[0];
            const fillRule2 = args[1] || "nonzero";
            buildPath(this, path.commands);
            return cFill.apply(this, [
                fillRule2
            ]);
        }
        const fillRule = args[0] || "nonzero";
        return cFill.apply(this, [
            fillRule
        ]);
    };
    CanvasRenderingContext2D.prototype.stroke = function stroke(path) {
        if (path) buildPath(this, path.commands);
        cStroke.apply(this);
    };
    CanvasRenderingContext2D.prototype.isPointInPath = function isPointInPath(...args) {
        if (args[0] instanceof Path2D) {
            const path = args[0];
            const x = args[1];
            const y = args[2];
            const fillRule = args[3] || "nonzero";
            buildPath(this, path.commands);
            return cIsPointInPath.apply(this, [
                x,
                y,
                fillRule
            ]);
        }
        return cIsPointInPath.apply(this, args);
    };
}
function applyRoundRectToCanvasRenderingContext2D(CanvasRenderingContext2D) {
    if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) CanvasRenderingContext2D.prototype.roundRect = roundRect;
}
function applyRoundRectToPath2D(P2D) {
    if (P2D && !P2D.prototype.roundRect) P2D.prototype.roundRect = roundRect;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["5r9Qo"], null, "parcelRequirea9ad")

//# sourceMappingURL=dist.3fa38031.js.map
