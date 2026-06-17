var Y = Object.defineProperty, R = (e, t) => {
  let n = {};
  for (var r in e)
    Y(n, r, {
      get: e[r],
      enumerable: !0
    });
  return t || Y(n, Symbol.toStringTag, { value: "Module" }), n;
}, Ce = /* @__PURE__ */ R({
  decodeHTMLEntities: () => se,
  evaluateExpression: () => te,
  getValue: () => C,
  interpolate: () => ee,
  preProcessTemplate: () => U,
  resolveArgs: () => I,
  safeAttribute: () => re,
  safeInnerHTML: () => ne
}), Z = {
  if: (e, t) => e === void 0 ? void 0 : e ? t : "",
  show: (e) => e === void 0 ? void 0 : e ? "" : "display: none",
  hide: (e) => e === void 0 ? void 0 : e ? "display: none" : "",
  iif: (e, t, n) => e == null ? n : !(e === "false" || e === "0") && e ? t : n,
  toString: (e) => e != null ? String(e) : "",
  toJSON: (e) => JSON.stringify(e, null, 2),
  toNumber: (e) => {
    const t = Number(e);
    return isNaN(t) ? 0 : t;
  },
  equal: (e, t) => String(e) === String(t),
  join: (e, t = "") => Array.isArray(e) ? e.join(t) : "",
  upper: (e) => e?.toUpperCase(),
  lower: (e) => e?.toLowerCase(),
  undefined: (e) => e || "valor no definido",
  not: (e) => !e,
  includes: (e, t) => typeof e == "string" || Array.isArray(e) ? e.includes(t) : !1,
  length: (e) => typeof e == "string" || Array.isArray(e) ? e.length : e && typeof e == "object" ? Object.keys(e).length : 0,
  default: (e, t = "") => e == null || e === "" ? t : e,
  replace: (e, t, n = "") => {
    const r = e != null ? String(e) : "";
    return t ? r.split(t).join(n) : r;
  },
  truncate: (e, t = "0", n = "...") => {
    const r = e != null ? String(e) : "", o = Number(t);
    return !Number.isFinite(o) || o <= 0 ? "" : r.length <= o ? r : r.slice(0, o) + n;
  },
  debug: function(e) {
    return console.log("Valor actual:", e), console.log("Scope completo:", this), e;
  },
  safeHTML: function(e) {
    return ne(e);
  },
  safeAttribute: function(e) {
    return re(e);
  }
};
function Se(e, t) {
  try {
    return t && e in t || e in Z || e in self || t && t["#"];
  } catch {
    return !1;
  }
}
function C(e, t) {
  if (!e || e === "this") return t;
  const n = e.split("|").map((a) => a.trim()), r = n.shift() || "", o = n;
  if (r.startsWith("t:")) {
    const [a, ...l] = r.slice(2).split(":");
    return o.unshift("t"), o[0] += ":" + l.join(":"), H(o, a, t);
  }
  if (r.startsWith("'") && r.endsWith("'")) {
    const [a, ...l] = r.slice(1, -1).split(":");
    return o.unshift("t"), o[0] += ":" + l.join(":"), H(o, a, t);
  }
  const s = ((r || "").replace(/{([^{}]+)}/g, (a, l) => C(l.trim(), t)) || "").split(/\.|\[|\]/).filter((a) => a !== "");
  let i = t || self;
  if (Se(s[0] || "", t)) {
    for (const a of s) if (i !== null && typeof i == "object" && a in i) i = i[a];
    else if (i && i["#"]) i = C(a, i["#"]);
    else if (a in self) i = self[a];
    else {
      i = void 0;
      break;
    }
    return H(o, i, t);
  }
}
function Ae(e, t) {
  if (!e.includes("'")) return e.split(t).map((s) => s.trim());
  const n = [];
  let r = "", o = !1;
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    i === "'" ? (o = !o, r += i) : !o && e.startsWith(t, s) ? (n.push(r.trim()), r = "", s += t.length - 1) : r += i;
  }
  return n.push(r.trim()), n;
}
function H(e, t, n) {
  return e.reduce((r, o) => {
    const [s, ...i] = Ae(o, ":"), a = C(s, n) || Z[s || ""];
    if (typeof a == "function") {
      const l = i.map((c) => c.startsWith("'") && c.endsWith("'") ? c.slice(1, -1) : c.startsWith("@") ? C(c.slice(1), n) : c);
      return a.apply(n, [r, ...l]);
    }
    return console.warn(`Filtro "${s}" no encontrado.`), r;
  }, t);
}
function ee(e, t) {
  return U(e, t).replace(/{([^{}]+)}/g, (n, r) => {
    try {
      const o = C(r.trim(), t);
      return typeof o == "function" ? o.apply(t) : o != null ? String(o) : n;
    } catch (o) {
      return console.error(String(o), n), n;
    }
  });
}
function I(e, t) {
  return e.map((n) => {
    if (n.startsWith("$")) {
      const s = n.slice(1);
      return t.state ? C(s, t.state) : void 0;
    }
    if (n.startsWith("@")) return C(n.slice(1), t);
    const r = n.toLowerCase();
    if (r === "true") return !0;
    if (r === "false") return !1;
    if (r === "null") return null;
    if (r === "undefined") return;
    const o = Number(n);
    return n.trim() !== "" && !isNaN(o) ? o : n;
  });
}
function te(e, t) {
  try {
    return new Function("ctx", `
      with(ctx) {
        try {
          return ${e};
        } catch(e) {
          // Si el error es porque la variable no existe, devolvemos un token especial
          if (e instanceof ReferenceError) return "__UNDEFINED__";
          return false;
        }
      }
    `)(t);
  } catch (n) {
    return console.log(n || "evaluateExpression", e, t), !1;
  }
}
function U(e, t) {
  if (!e.includes("@if")) return e;
  let n = 0, r = "";
  for (; n < e.length; ) if (e.startsWith("@if(", n)) {
    const o = n + 3, s = Ne(e, o, "(", ")");
    if (s === -1) {
      r += e[n], n++;
      continue;
    }
    const i = e.slice(o + 1, s), a = s + 1, l = _e(e, a);
    if (l === -1) {
      r += e[n], n++;
      continue;
    }
    const c = e.slice(a, l), u = te(se(i), t);
    u === "__UNDEFINED__" ? r += `@if(${i})${c}@endif` : u && (r += U(c, t)), n = l + 6;
  } else
    r += e[n], n++;
  return r;
}
function _e(e, t) {
  let n = 1, r = t;
  for (; r < e.length; ) {
    if (e.startsWith("@if(", r))
      n++, r += 3;
    else if (e.startsWith("@endif", r)) {
      if (n--, n === 0) return r;
      r += 5;
    }
    r++;
  }
  return -1;
}
function Ne(e, t, n, r) {
  let o = 0;
  for (let s = t; s < e.length; s++)
    if (e[s] === n ? o++ : e[s] === r && o--, o === 0) return s;
  return -1;
}
function ne(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
function re(e) {
  return String(e).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#39;");
}
function se(e) {
  const t = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " "
  };
  return e.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, (n) => t[n || ""] || n);
}
var Le = /* @__PURE__ */ R({
  $: () => Oe,
  build: () => F,
  buildAndInterpolate: () => oe,
  getQueryParams: () => ke,
  initObserver: () => ie,
  setupFocusTrap: () => Pe
});
function F(e, t = {}, n = !1, r) {
  const o = document.createElement(e);
  if (typeof t == "string") {
    if (!t.trim()) return o;
    o.innerHTML = t;
  } else {
    const { className: s, ...i } = t;
    if (Object.assign(o, i), s && (o.className = s), r && "slottedNodes" in r) {
      const a = r.slottedNodes;
      for (const [l, c] of Object.entries(a)) {
        const u = o.querySelector(`slot[name="${l}"]`);
        if (u) {
          const d = u.parentElement;
          for (const h of c) h instanceof Node && d.insertBefore(h, u);
          u.remove();
        }
      }
    }
  }
  return r && x(o, r), z(o), r && ue(r, J(o, r)), r && K(o, r), n && o.firstElementChild || o;
}
function oe(e, t = {}, n = !0, r = {}) {
  const o = ee(e, t);
  return F("div", {
    ...r,
    innerHTML: o
  }, n, t);
}
function Oe(e, t) {
  return {
    one: () => (t || document).querySelector(e),
    all: () => Array.from((t || document).querySelectorAll(e)),
    exists: () => (t || document).querySelector(e) !== null
  };
}
function ke() {
  const e = new URLSearchParams(window.location.search);
  return Object.fromEntries(e.entries());
}
function Pe(e) {
  if (!e) return;
  const t = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    "[contenteditable]",
    "iframe"
  ].join(", "), n = () => {
    const s = e.querySelectorAll(t);
    return Array.from(s).filter((i) => i.offsetWidth > 0 || i.offsetHeight > 0 || i.getClientRects().length > 0);
  }, r = (s) => {
    if (s.key !== "Tab") return;
    const i = n();
    if (i.length === 0) {
      s.preventDefault();
      return;
    }
    const a = i[0], l = i[i.length - 1], c = document.activeElement;
    !s.shiftKey && c === l ? (a?.focus(), s.preventDefault()) : s.shiftKey && (c === a || !e.contains(c)) && (l?.focus(), s.preventDefault());
  }, o = n();
  return o.length > 0 && o[0]?.focus(), window.addEventListener("keydown", r, !0), function() {
    window.removeEventListener("keydown", r, !0);
  };
}
var ie = () => {
  const e = new MutationObserver((t) => {
    t.forEach((n) => {
      n.removedNodes.forEach((r) => {
        if (r instanceof HTMLElement) {
          const o = (s) => {
            s.__componentInstance && !s.__isUpdating && s.__componentInstance.destroy?.(), Array.from(s.children).forEach((i) => o(i));
          };
          o(r);
        }
      });
    });
  });
  if (typeof document < "u") {
    e.observe(document.body, {
      childList: !0,
      subtree: !0
    }), console.log("DOM Observer active");
    return;
  }
  console.log("DOM Observer NOT active");
}, Re = /* @__PURE__ */ R({
  createIcon: () => le,
  registerIcons: () => ce
}), ae = {};
function ce(e) {
  for (const [t, n] of Object.entries(e)) ae[t] = n;
}
function le(e, t = "w-6 h-6") {
  const n = ae[e] || "";
  if (n) {
    const r = document.createElement("div");
    r.innerHTML = n;
    const o = r.firstElementChild;
    if (o)
      return o.setAttribute("class", t), o;
  }
  return e;
}
var Te = class {
  topics = /* @__PURE__ */ new Map();
  GLOBAL_SCOPE = /* @__PURE__ */ Symbol("global");
  getScopeKey(e) {
    return e != null ? String(e) : this.GLOBAL_SCOPE;
  }
  subscribe(e, t, n) {
    if (!e)
      return console.warn("PubSub: No topic provided for subscription."), () => {
      };
    this.topics.has(e) || this.topics.set(e, /* @__PURE__ */ new Map());
    const r = this.topics.get(e), o = this.getScopeKey(n);
    r.has(o) || r.set(o, /* @__PURE__ */ new Set());
    const s = r.get(o);
    return s.add(t), () => {
      s.delete(t), s.size === 0 && r.delete(o), r.size === 0 && this.topics.delete(e);
    };
  }
  publish(e, t, n) {
    const r = this.topics.get(e);
    if (!r) return;
    const o = this.getScopeKey(n);
    queueMicrotask(() => {
      o !== this.GLOBAL_SCOPE ? r.get(o)?.forEach((s) => s(t)) : r.forEach((s) => s.forEach((i) => i(t)));
    });
  }
}, L = new Te(), Ie = /* @__PURE__ */ R({
  getComponent: () => Me,
  getHydrationPromise: () => fe,
  getResolver: () => de,
  hydrateComponents: () => J,
  hydrateDirectives: () => x,
  hydrateElement: () => xe,
  hydrateEventListeners: () => K,
  hydrateIcons: () => z,
  registerComponent: () => $,
  resolveBindingValue: () => M,
  trackHydration: () => ue
}), V = /* @__PURE__ */ new Map();
function $(e, t) {
  V.set(e, t);
}
function Me(e) {
  return V.get(e);
}
function Fe(e) {
  return e.prototype && e.prototype.constructor === e;
}
var B = /* @__PURE__ */ new WeakMap();
function ue(e, t) {
  const n = B.get(e);
  B.set(e, n ? n.then(() => t) : t);
}
function fe(e) {
  return B.get(e) || Promise.resolve();
}
function xe(e, t) {
  z(e), K(e, t), J(e, t), x(e, t);
}
function z(e = document.body) {
  return e.querySelectorAll("[data-icon]").forEach((t) => {
    const n = t.dataset.icon, r = t.className, o = le(n, r);
    o && t.replaceWith(o);
  }), e;
}
function K(e, t) {
  const n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT);
  let r = e;
  for (t.bindings || (t.bindings = []); r; ) {
    const o = r;
    Array.from(o.attributes).forEach((s) => {
      const i = s.name, a = s.value;
      if (i === "on-publish") {
        const [l, c, u, ...d] = a.split(":"), h = c === "local" ? t.instanceId : void 0, p = L.subscribe(l, (y) => {
          const S = y && typeof y == "object" && "args" in y ? y.args[0] : y;
          switch ((u || "").toLowerCase()) {
            case "classname":
              o.className = S;
              break;
            case "html":
            case "innerhtml":
              o.innerHTML = S;
              break;
            case "json":
              o.innerHTML = JSON.stringify(C(S, t), null, 2);
              break;
            case "style":
              o.style[d[0] || ""] = S;
              break;
            case "toggleclass":
              o.classList.toggle(d[0] || "");
              break;
            default:
              if (u && typeof t[u] == "function") t[u].call(t, o, y, ...d);
              else if (u && u.startsWith("attr.")) {
                const w = u.split(".")[1], f = S;
                w && o.setAttribute(w, f);
              } else o.innerHTML = C(S, t);
          }
        }, h);
        t.component && t.component.addCleanup(p), o.removeAttribute(i);
      } else if (i.startsWith("on-")) {
        const l = i.replace("on-", "");
        if (a.startsWith("publish")) {
          const [, c, u, ...d] = a.split(":");
          if (!c) {
            console.warn("Falta el topic en el publish:", a);
            return;
          }
          const h = u === "local" ? t.instanceId : void 0;
          o.addEventListener(l, (p) => {
            const y = d.length > 0 ? I(d, t) : [];
            L.publish(c, {
              event: p,
              target: o,
              args: y
            }, h);
          });
        } else {
          const [c, ...u] = a.split(":"), d = t[c || ""] || t.handlers?.[c || ""];
          if (typeof d == "function") {
            const h = I(u, t);
            o.addEventListener(l, (p) => {
              d.call(t, o, p, ...h);
            });
          }
        }
        o.removeAttribute(i);
      } else i === "data-bind" && (a.split(";").map((l) => l.trim()).filter(Boolean).forEach((l) => {
        const [c = "", ...u] = l.split(":").map((w) => w.trim()), d = u.join(":"), h = I(u, t), [p, y] = c.includes(".") ? c.split(".") : [c, null], S = {
          element: o,
          type: p,
          prop: y,
          path: d,
          params: h
        };
        t.bindings.push(S), M(S, t);
      }), o.removeAttribute(i));
    }), r = n.nextNode();
  }
  return e;
}
async function J(e, t) {
  const n = e.querySelectorAll("[data-component]");
  for (const r of Array.from(n)) {
    const o = r.dataset.component;
    if (!o) continue;
    const s = V.get(o);
    if (!s) {
      console.error(`Componente ${o} no encontrado en el registro.`);
      continue;
    }
    const i = Fe(s) ? new s(t) : s(t);
    r.removeAttribute("data-component");
    const a = r.className.trim();
    i.init?.({ parent: r });
    const l = i.render();
    if (l && (Q.bind(i, l), l.id || l.setAttribute("id", r.id), l.setAttribute(o, ""), a)) {
      const c = a.split(/\s+/).filter((u) => u.length > 0);
      l.classList.add(...c);
    }
    r.replaceWith(l || document.createComment(`Component ${o} rendered an empty element`)), i.mounted?.();
  }
}
function x(e, t) {
  e.querySelectorAll("[data-t]").forEach((n) => {
    const r = n.dataset.t, o = r.startsWith("t:") ? r.slice(2) : r;
    n.setAttribute("data-i18n-key", o);
  }), Array.from(e.querySelectorAll("[data-each]")).filter((n) => !n.parentElement?.closest("[data-each]")).forEach((n) => {
    const [r, , ...o] = n.dataset.each.split(" "), s = o.join(" ").trim();
    let i = [];
    if (s.startsWith("[") && s.endsWith("]")) try {
      i = JSON.parse(s.replace(/'/g, '"'));
    } catch (c) {
      console.error("Error parseando array estático en data-each:", c);
    }
    else i = C(s, t) || [];
    const a = n.innerHTML.replaceAll("~", "|");
    if (n.innerHTML = "", n.removeAttribute("data-each"), i.length === 0) {
      n.appendChild(document.createComment(`anchor:each-${s}`));
      return;
    }
    const l = document.createDocumentFragment();
    i.forEach((c, u) => {
      if (c instanceof Node) {
        l.appendChild(c);
        return;
      }
      const d = Object.create(t);
      d[r || ""] = c, d.index = u, d["#"] = t;
      const h = oe(a, d, !1);
      for (De(h, d), x(h, d); h.firstChild; ) l.appendChild(h.firstChild);
    }), n.appendChild(l);
  });
}
function de(e) {
  const { type: t, prop: n, params: r } = e, o = {
    fn: (s, i) => {
      typeof i == "function" ? i(s, r?.slice(1)) : console.warn(`La función '${e.path}' no se encontró en el contexto.`);
    },
    text: (s, i) => s.innerText = i ?? "",
    html: (s, i) => s.innerHTML = i ?? "",
    value: (s, i) => {
      const a = s.__instance;
      a ? a.setProp?.("value", i) : s.value = i ?? "";
    },
    checked: (s, i) => s.checked = !!i,
    attr: (s, i) => i == null ? s.removeAttribute(n) : s.setAttribute(n, String(i)),
    class: (s, i) => s.className = i ?? "",
    toggle: (s, i) => s.classList.toggle(n, !!i),
    style: (s, i) => s.style[n] = i,
    show: (s, i) => s.style.display = i ? "" : "none",
    hide: (s, i) => s.style.display = i ? "none" : "",
    disabled: (s, i) => s.disabled = !!i
  };
  return o[t] || o.text || (() => {
  });
}
function De(e, t) {
  e.firstElementChild && (e.firstElementChild.__localCtx__ = t);
}
function He(e) {
  let t = e;
  for (; t; ) {
    const n = t.__localCtx__;
    if (n) return n;
    t = t.parentElement;
  }
  return null;
}
function M(e, t) {
  const n = de(e);
  let r = e.path;
  e.type === "fn" && e.params && e.params.length > 0 && (r = e.params[0]);
  const o = C(r, t);
  if (o !== void 0) {
    n(e.element, o);
    return;
  }
  const s = He(e.element), i = C(r, s);
  n(e.element, i);
}
var Q = class W {
  static instance = 0;
  element = null;
  instanceId = 0;
  state = {};
  ctx;
  parent;
  props = {};
  children = [];
  bindings = [];
  cleanups = [];
  isInitializing = !1;
  constructor(t) {
    this.parsePropsAndChildren(t), this.instanceId = ++W.instance, this.bindMethods(), this.ctx = t, this.state = new Proxy({}, { set: (n, r, o) => (n[r] = o, this.isInitializing || this.update(r), !0) });
  }
  setState(t, n = !0) {
    this.isInitializing = !0, Object.assign(this.state, t), this.isInitializing = !1, n && this.update("state");
  }
  publish(t, n) {
    L.publish(t, n, this.instanceId);
  }
  subscribe(t, n) {
    const r = L.subscribe(t, n, this.instanceId);
    this.addCleanup(r);
  }
  addCleanup(t) {
    this.cleanups = this.cleanups.concat(t);
  }
  bindMethods() {
    const t = Object.getPrototypeOf(this);
    Object.getOwnPropertyNames(t).forEach((n) => {
      const r = this[n];
      n !== "constructor" && typeof r == "function" && (this[n] = r.bind(this));
    });
  }
  invalidate() {
    this.update();
  }
  update(t) {
    if (!this.element) return;
    this.element.__isUpdating = !0;
    const n = this.render(t);
    if (!n || n === this.element) {
      this.element.__isUpdating = !1;
      return;
    }
    const r = this.element.querySelector("#router-outlet"), o = n.querySelector("#router-outlet");
    r && o && o.replaceWith(r);
    const s = document.createDocumentFragment();
    for (; n.firstChild; ) s.appendChild(n.firstChild);
    this.element.innerHTML = "", this.element.appendChild(s), this.mounted?.(), Promise.resolve().then(() => {
      this.element && (this.element.__isUpdating = !1);
    });
  }
  updateBindings() {
    this.bindings.forEach((t) => {
      t.element.isConnected ? M(t, this) : M(t, this);
    });
  }
  mounted() {
  }
  init(t) {
    this.parsePropsAndChildren(t);
  }
  setupOutputs(t) {
    if (!t?.parent || !this.ctx) return;
    const n = t.parent, r = this, o = this.ctx;
    Array.from(n.attributes).forEach((s) => {
      if (!s.name.startsWith("(") || !s.name.endsWith(")")) return;
      const i = s.name.slice(1, -1).replace(/-([a-z])/g, (d, h) => h.toUpperCase()), a = s.value.trim(), l = a.match(/^([\w\\.]+)\[(.+)\]$/);
      let c;
      if (l) {
        const [, d, h] = l, p = C(d, o);
        c = {
          Map: () => p.get(h),
          Set: () => Array.from(p)[Number(h)],
          Default: () => p?.[h || ""]
        }[p instanceof Map ? "Map" : p instanceof Set ? "Set" : "Default"]();
      }
      const u = c || o[a] || C(a, o);
      if (typeof u == "function") {
        r[i] = u.bind(this.ctx), this.addCleanup(() => {
          r[i] = void 0;
        });
        return;
      }
      r[i] = u;
    });
  }
  parsePropsAndChildren(t) {
    t && t.parent && (this.parent = t.parent, this.props = { ...t.parent.dataset }, this.children = Array.from(t.parent.childNodes), this.setupOutputs(t), t.parent.__instance = this);
  }
  destroy() {
    this.cleanups.length === 0 && !this.element || (this.cleanups.forEach((t) => t()), this.cleanups = [], this.bindings = []);
  }
  static bind(t, n) {
    const r = n;
    return r && (r.__componentInstance = t, t.element = r), r;
  }
  static renderAndBind(t) {
    const n = t.render();
    return n ? (t.element = n, n.__componentInstance = t, n) : null;
  }
  static getInstance(t, n = document) {
    return n.querySelector(t)?.__componentInstance || null;
  }
  whenChildrenReady() {
    return fe(this);
  }
  bind(t) {
    return W.bind(this, t);
  }
}, je = /* @__PURE__ */ R({ useState: () => he });
function he(e) {
  const t = {}, n = new Proxy(e, {
    get(s, i) {
      return s[i];
    },
    set(s, i, a) {
      const l = i;
      return s[l] === a || (s[l] = a, t[l]?.forEach((c) => c(a))), !0;
    }
  });
  return {
    store: n,
    put: (s, i) => {
      n[s] = i;
    },
    on: (s, i) => (t[s] || (t[s] = []), t[s].push(i), () => {
      t[s] && (t[s] = t[s].filter((a) => a !== i), t[s].length === 0 && delete t[s]);
    })
  };
}
var pe = class extends Q {
  _state = he({
    seconds: 0,
    date: ""
  });
  init() {
    const { put: e } = this._state, t = setInterval(() => {
      e("date", (/* @__PURE__ */ new Date()).toTimeString().split(" ")[0] || "");
    }, 1e3);
    this.addCleanup(() => clearInterval(t));
  }
  render() {
    const { on: e } = this._state, t = F("div", `
      <div class="
        bg-background
        relative flex items-center gap-2 px-3 py-2 rounded-md border
        border-gray-300 dark:border-slate-600
        bg-white dark:bg-gray-800
        text-gray-700 dark:text-gray-200
        transition-colors
        ">
        <div class="flex items-center gap-2">
          <i data-icon="timer" class="size-5 hidden lg:block dark:text-yellow-400 text-indigo-500"></i>
          <span class="font-mono text-sm text-slate-700 dark:text-slate-100" id="date-slot">
            --:--:--
          </span>
        </div>
      </div>
    `, !0);
    return e("date", (n) => {
      t.querySelector("#date-slot").textContent = n;
    }), t;
  }
}, me = class extends Q {
  init(e) {
    super.init(e);
  }
  render() {
    return F("div", `        
      <div class="flex flex-col items-center gap-2 justify-center m-1">
        ${this.props.message || "Loading..."}
        <div class="h-1 w-full overflow-hidden rounded-full bg-gray-400 mb-1">
          <div
            class="h-full w-full origin-left animate-[progress_2.5s_infinite_linear] bg-red-900 dark:bg-blue-800">
          </div>
        </div>
      </div>
    `, !0);
  }
};
function ht(e) {
  const t = () => {
    "lucideIcons" in window && ce(window.lucideIcons), $("clock-component", pe), $("progress-bar-component", me), (e ? Array.isArray(e) ? e : [e] : []).forEach((r) => r()), document.body.style.visibility = "visible", ie();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t, { once: !0 }) : t();
  const n = localStorage.getItem("theme");
  (n === "dark" || !n && window.matchMedia("(prefers-color-scheme: dark)").matches) && document.documentElement.classList.add("dark");
}
var pt = class {
  portalElement;
  triggerElement;
  options;
  rafId = 0;
  isQueued = !1;
  resizeObs;
  associatedElements = /* @__PURE__ */ new Set();
  constructor(e, t, n = {}) {
    this.triggerElement = e, this.portalElement = t, this.options = {
      offset: 4,
      ...n
    }, Object.assign(this.portalElement.style, {
      position: "fixed",
      zIndex: "9999",
      margin: "0"
    }), this.resizeObs = new ResizeObserver(() => this.scheduleUpdate());
  }
  getPortalElement() {
    return this.portalElement;
  }
  open() {
    document.body.appendChild(this.portalElement), this.resizeObs.observe(this.triggerElement), window.addEventListener("resize", this.updateBound), document.addEventListener("scroll", this.updateBound, {
      capture: !0,
      passive: !0
    }), document.addEventListener("click", this.clickOutsideBound, !0), this.scheduleUpdate(), this.options.onOpen?.(this.portalElement);
  }
  close() {
    cancelAnimationFrame(this.rafId), this.resizeObs.disconnect(), this.associatedElements.clear(), window.removeEventListener("resize", this.updateBound), document.removeEventListener("scroll", this.updateBound, !0), document.removeEventListener("click", this.clickOutsideBound, !0), this.portalElement.parentNode === document.body && document.body.removeChild(this.portalElement);
  }
  addAssociatedElement(e) {
    this.associatedElements.add(e);
  }
  removeAssociatedElement(e) {
    this.associatedElements.delete(e);
  }
  scheduleUpdate() {
    this.isQueued || (this.isQueued = !0, this.rafId = requestAnimationFrame(() => {
      this.isQueued = !1, this.updatePosition();
    }));
  }
  updatePosition() {
    if (this.options.type === "tooltip") {
      this.updatePositionTooltip();
      return;
    }
    const e = this.triggerElement.getBoundingClientRect(), t = this.portalElement.offsetHeight, n = this.portalElement.offsetWidth, r = window.innerHeight, o = window.innerWidth, s = this.options.offset, i = this.options.placement ?? "";
    if (i === "right-start" || i === "left-start") {
      this.updatePositionSide(e, n, t, o, r, s, i);
      return;
    }
    const a = r - e.bottom < t && e.top > t;
    this.portalElement.style.minWidth = `${this.triggerElement.offsetWidth}px`;
    let l = i === "top-end" || e.left + n > o && e.right > n ? e.right - n : e.left;
    const c = s, u = Math.max(c, o - n - s);
    l = Math.min(Math.max(l, c), u), this.portalElement.style.left = `${l}px`, a ? (this.portalElement.style.top = `${e.top - t - s}px`, this.portalElement.classList.add("origin-bottom")) : (this.portalElement.style.top = `${e.bottom + s}px`, this.portalElement.classList.remove("origin-bottom"));
  }
  updatePositionSide(e, t, n, r, o, s, i) {
    const a = r - e.right, l = i === "right-start" ? a >= t + s : e.left < t + s;
    let c;
    l ? c = e.right + s : c = e.left - t - s, c = Math.min(Math.max(c, s), r - t - s);
    let u = e.top;
    u + n > o - s && (u = o - n - s), u = Math.max(u, s), this.portalElement.style.left = `${c}px`, this.portalElement.style.top = `${u}px`;
  }
  updatePositionTooltip() {
    const e = this.triggerElement.getBoundingClientRect(), t = this.portalElement.offsetHeight, n = this.portalElement.offsetWidth, r = window.innerHeight, o = window.innerWidth, s = this.options.offset ?? 6, i = this.options.placement ?? "top", a = {
      top: e.top,
      bottom: r - e.bottom,
      left: e.left,
      right: o - e.right
    }, l = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }, c = i.split("-")[0], u = a[c] >= t + s ? c : l[c], d = e.left + e.width / 2 - n / 2, h = e.top + e.height / 2 - t / 2;
    let p, y;
    switch (u) {
      case "top":
        p = e.top - t - s, y = d;
        break;
      case "bottom":
        p = e.bottom + s, y = d;
        break;
      case "left":
        p = h, y = e.left - n - s;
        break;
      case "right":
        p = h, y = e.right + s;
        break;
      default:
        p = e.top - t - s, y = d;
    }
    y = Math.min(Math.max(y, s), o - n - s), p = Math.min(Math.max(p, s), r - t - s), this.portalElement.style.left = `${y}px`, this.portalElement.style.top = `${p}px`, this.portalElement.style.minWidth = "";
  }
  updateBound = () => this.scheduleUpdate();
  clickOutsideBound = (e) => {
    const t = e.target, n = this.triggerElement.contains(t), r = this.portalElement.contains(t);
    if (!n && !r) {
      for (const o of this.associatedElements) if (o.contains(t)) return;
      this.options.onClose?.();
      return;
    }
    r && this.options.onClickInside?.(e);
  };
}, $e = /* @__PURE__ */ R({
  accentNumericComparer: () => Ge,
  buildSorter: () => be,
  clone: () => Ke,
  createMap: () => We,
  debounce: () => Ve,
  formatNumber: () => qe,
  getSafeFormData: () => Be,
  getUniqueValues: () => Ue,
  getUniqueValuesSorted: () => ye,
  getValueByPath: () => ge,
  groupByNested: () => ze,
  hasOwnProperty: () => Je,
  normalizeNFD: () => G,
  toDate: () => Ze,
  toMap: () => Xe,
  toSet: () => Ye,
  where: () => Qe
}), Be = (e) => {
  const t = Array.from(e.entries()).map(([n, r]) => typeof r == "string" ? [n, r.trim()] : [n, r]);
  return Object.fromEntries(t);
};
function We(e, t = "id", n = "name") {
  return Array.isArray(e) ? Object.fromEntries(e.map((r) => [r[t], ge(r, n)])) : {};
}
function ge(e, t) {
  if (!t) return e;
  if (!t.includes(".")) return e?.[t];
  let n = e;
  for (const r of t.split(".")) {
    if (n == null) return;
    n = n[r];
  }
  return n;
}
function Ge(e, t) {
  return e.localeCompare(t, void 0, {
    sensitivity: "accent",
    numeric: !0
  });
}
var G = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), qe = (e, t = "es") => new Intl.NumberFormat(t).format(e);
function Ue(e, t) {
  return [...new Set(e.map((n) => n[t]))];
}
function ye(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) r != null && n.add(r);
  return Array.from(n).sort(t);
}
function Ve(e, t) {
  let n = null;
  return (...r) => {
    n && clearTimeout(n), n = setTimeout(() => e(...r), t);
  };
}
function ze(e, ...t) {
  if (t.length === 0) throw new Error("Debes proporcionar al menos una clave para agrupar.");
  const n = {};
  for (const r of e) {
    let o = n;
    for (let s = 0; s < t.length; s++) {
      const i = t[s], a = String(r[i]);
      s === t.length - 1 ? (o[a] || (o[a] = []), o[a].push(r)) : (o[a] || (o[a] = {}), o = o[a]);
    }
  }
  return n;
}
function be(e, t = "asc") {
  const n = t === "asc" ? 1 : -1, r = (o) => o === void 0 ? 0 : o === null ? 1 : o === "" ? 2 : 3;
  return (o, s) => {
    const i = o[e], a = s[e], l = r(i) - r(a);
    if (l !== 0) return l * n;
    if (typeof i == "boolean" && typeof a == "boolean") return (Number(i) - Number(a)) * n;
    if (typeof i == "number" && typeof a == "number") return (i - a) * n;
    const c = G(String(i)), u = G(String(a));
    return c.localeCompare(u, void 0, {
      sensitivity: "base",
      numeric: !0
    }) * n;
  };
}
function Ke(e) {
  return JSON.parse(JSON.stringify(e));
}
function Je(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function Qe(e, t) {
  if (typeof t == "function") return e.filter(t);
  if (t !== null && typeof t == "object") {
    const n = Object.entries(t);
    return n.length === 0 ? e : e.filter((r) => n.every(([o, s]) => {
      let i = r[o];
      if (typeof i == "function") try {
        i = i.call(r);
      } catch (a) {
        return console.error(`Error al ejecutar la propiedad computada '${o}' en el item:`, r, a), !1;
      }
      return typeof s == "function" ? s(i, r) : s instanceof RegExp ? typeof i == "string" && s.test(i) : Object.is(i, s);
    }));
  }
  return e;
}
function Ye(e, t) {
  return new Set(e.map((n) => t === void 0 ? n : typeof t == "function" ? t(n) : n[t]));
}
function Xe(e, t, n) {
  return new Map(e.map((r) => [typeof t == "function" ? t(r) : r[t], n === void 0 ? r : typeof n == "function" ? n(r) : r[n]]));
}
function Ze(e) {
  if (typeof e == "string" && e.length > 0) {
    const [t, n] = e.trim().split(" ");
    if (!t) return null;
    const [r, o, s] = t.split("/").map(Number);
    if (!r || !o || !s) return null;
    let i = 0, a = 0, l = 0, c = 0;
    if (n) {
      const [d, h, p] = n.split(":");
      if (i = ~~(d || 0), a = ~~(h || 0), p) {
        const y = p.split(".");
        l = ~~(y[0] || 0), c = ~~(y[1] || 0);
      }
    }
    const u = new Date(s, o - 1, r, i, a, l, c);
    return Number.isNaN(u.getTime()) ? null : u;
  }
  return null;
}
var q = "VanillaLib2026:", j = (e) => q + e, et = {
  writeValue: function(e, t) {
    try {
      localStorage.setItem(j(e), JSON.stringify({ value: t }));
    } catch (n) {
      console.error(`StorageUtil.writeValue error [${e}]:`, n);
    }
    return this;
  },
  readValue: function(e, t) {
    try {
      const n = localStorage.getItem(j(e));
      if (n) return JSON.parse(n).value;
    } catch (n) {
      console.error(`StorageUtil.readValue error [${e}]:`, n);
    }
    return t;
  },
  readAll: function() {
    const e = {};
    try {
      for (let n = 0; n < localStorage.length; n++) {
        const r = localStorage.key(n);
        if (r && r.startsWith(q)) {
          const o = localStorage.getItem(r);
          if (o) try {
            const s = JSON.parse(o), i = r.substring(15);
            e[i] = s.value;
          } catch (s) {
            console.warn(`StorageUtil.readAll: Failed to parse item for key ${r}`, s);
          }
        }
      }
    } catch (n) {
      console.error("StorageUtil.readAll error:", n);
    }
    return e;
  },
  removeValue: function(e) {
    try {
      localStorage.removeItem(j(e));
    } catch (t) {
      console.error(`StorageUtil.removeValue error [${e}]:`, t);
    }
    return this;
  },
  clearAppData: function() {
    try {
      const e = [];
      for (let t = 0; t < localStorage.length; t++) {
        const n = localStorage.key(t);
        n && n.startsWith(q) && e.push(n);
      }
      e.forEach((t) => {
        localStorage.removeItem(t);
      });
    } catch (e) {
      console.error("StorageUtil.clearAppData error:", e);
    }
    return this;
  }
};
async function tt(e, t, n, r) {
  try {
    const o = await e();
    if (!o.ok) {
      const l = await o.json().catch(() => null), c = `${o.status} ${o.statusText}${l?.error?.message ? ` - ${l.error.message}` : ""}`;
      return console.error(`[ERROR] ${n ?? "Fetching"}:`, c), "API error: " + c;
    }
    const s = await o.json().catch(() => null);
    let i = s;
    t && i[t] && (i = i[t]);
    const a = r ? r(i) : i;
    return {
      success: !0,
      message: s?.message ?? "Request successful",
      data: a
    };
  } catch (o) {
    if (o instanceof Error) {
      const s = o.name === "SyntaxError" ? "FETCH error: Syntax error" : `API error: ${o.message}`;
      return console.error(`[ERROR] Fetching ${n ?? ""}:`, s), s;
    }
    return console.error(`[ERROR] ${n ?? "Fetching"}:`, o), String(o);
  }
}
function nt(e, t, n = "GET") {
  return console.log(`[FETCH] ${n}:`, e), t !== void 0 && console.log(`[FETCH] ${n} payload:`, t), {
    url: e,
    payload: t,
    method: n
  };
}
function rt() {
  let e, t, n, r, o, s = "GET", i, a;
  const l = {};
  return {
    useBase(c) {
      return e = c, this;
    },
    useProperty(c) {
      return t = c, this;
    },
    useLog(c) {
      return r = c, this;
    },
    usePayload(c) {
      return o = c, this;
    },
    useTransform(c) {
      return i = c, this;
    },
    getFrom(c) {
      return n = c, s = "GET", this;
    },
    postTo(c) {
      return n = c, s = "POST", this;
    },
    putTo(c) {
      return n = c, s = "PUT", this;
    },
    patchTo(c) {
      return n = c, s = "PATCH", this;
    },
    deleteFrom(c) {
      return n = c, s = "DELETE", this;
    },
    useToken(c) {
      return a = c, this;
    },
    withHeader(c, u) {
      return l[c] = u, this;
    },
    async invoke() {
      if (!n) throw new Error("Target endpoint not defined. Use .getFrom(), .postTo(), etc.");
      const { url: c, payload: u, method: d } = nt((e || "") + n, o, s), h = {
        "Content-Type": "application/json",
        ...a ? { Authorization: `Bearer ${a}` } : {},
        ...l
      }, p = u instanceof URLSearchParams || u instanceof FormData ? u : u ? JSON.stringify(u) : void 0;
      return tt(() => fetch(c, {
        method: d,
        headers: h,
        body: p
      }), t, r, i);
    }
  };
}
var st = { create: function() {
  return rt();
} };
function X(e, t) {
  if (!e.length || !t) return {};
  const n = {};
  for (const r in t) {
    const o = t[r];
    if (!o?.length) continue;
    const s = e.map((i) => Number(i[r]) || 0);
    n[r] = {};
    for (const i of o) switch (i) {
      case "values":
        n[r].values = s;
        break;
      case "distinct":
        n[r].distinct = ye(s.map((a) => a));
        break;
      case "sum":
        n[r].sum = s.reduce((a, l) => a + l, 0);
        break;
      case "avg":
        n[r].avg = s.length ? s.reduce((a, l) => a + l, 0) / s.length : 0;
        break;
      case "min":
        n[r].min = Math.min(...s);
        break;
      case "max":
        n[r].max = Math.max(...s);
        break;
      case "median":
        {
          const a = [...s].sort((c, u) => c - u), l = Math.floor(a.length / 2);
          n[r].median = a.length % 2 ? a[l] : (a[l - 1] + a[l]) / 2;
        }
        break;
    }
  }
  return n;
}
function ot(e, t, n) {
  const r = (Array.isArray(t) ? t : t.split(",")).map((o, s) => {
    const [i, a] = o.trim().split(/\s+/);
    return be(i, s === 0 && n ? n : a?.toLowerCase() === "desc" ? "desc" : "asc");
  });
  return [...e].sort((o, s) => {
    for (const i of r) {
      const a = i(o, s);
      if (a !== 0) return a;
    }
    return 0;
  });
}
var it = {};
function at(e) {
  return it[e];
}
var ct = class {
  generateReport(e, t, n) {
    const r = {
      recordCount: 0,
      dataSet: [],
      percent: 0,
      isLastRow: !1,
      isLastRowInGroup: !1,
      grandTotal: {}
    };
    let o = e.parseData ? e.parseData(e, t) : t;
    const s = () => {
      w.forEach((f, m) => {
        if (m < d) return;
        const { id: E, name: g, current: b, definition: v } = f;
        if (v.valueProvider) {
          const O = m == w.length - 1, { key: _ } = v, A = {
            kind: "GroupHeaderRenderContext",
            id: E,
            name: g,
            key: _,
            current: b,
            dataSet: o,
            isLastGroup: O
          };
          n.send(v.valueProvider(A, _));
        }
      });
    }, i = (f) => {
      const m = w.map((E) => E);
      f && m.splice(0, f), m.reverse().forEach((E, g) => {
        const b = g == w.length - 1, { id: v, name: O, current: _, definition: A } = E, { key: k } = A, P = r[O];
        if (A.footerValueProvider) {
          const N = P.all[_];
          if (N) {
            N.summary = X(N.records, h);
            const { records: T, recordCount: D, key: ve, summary: Ee } = N, we = {
              kind: "GroupFooterRenderContext",
              id: v,
              name: O,
              key: k,
              current: _,
              data: {
                records: T,
                recordCount: D,
                key: ve,
                summary: Ee
              },
              dataSet: o,
              isLastGroup: b
            };
            n.send(A.footerValueProvider(we));
          }
        }
      });
    }, a = () => {
      S.forEach((f) => {
        if (f.valueProvider) {
          const { recordCount: m, dataSet: E, isLastRow: g, isLastRowInGroup: b, percent: v, previous: O, data: _ } = r, A = w[w.length - 1], k = A?.name;
          let P = 0;
          k && (P = r[k].all[A?.current || ""]?.recordCount || 0);
          const N = {
            kind: "DetailRenderContext",
            id: f.id,
            data: _,
            previous: O,
            dataSet: E,
            recordCount: m,
            groupRecordCount: P,
            percent: v,
            isLastRow: g,
            isLastRowInGroup: b
          };
          return n.send(f.valueProvider(N));
        }
      });
    }, l = () => {
      y.forEach((f) => {
        if (f.valueProvider) {
          const { id: m } = f, { recordCount: E, dataSet: g, isLastRow: b, isLastRowInGroup: v, percent: O, previous: _, data: A } = r, k = w.reduce((N, T) => {
            const D = T.name;
            return N[T.name] = r[D].all, N;
          }, {}), P = {
            kind: "TotalRenderContext",
            id: m,
            data: A,
            previous: _,
            dataSet: g,
            grandTotal: X(o, h),
            recordCount: E,
            percent: O,
            isLastRow: b,
            isLastRowInGroup: v,
            ...k
          };
          return n.send(f.valueProvider(P));
        }
      });
    }, c = () => {
      p.forEach((f) => {
        if (f.valueProvider) {
          const m = w.length > 0, E = {
            kind: "HeaderRenderContext",
            id: f.id,
            dataSet: o,
            isGroupedReport: m
          };
          return n.send(f.valueProvider(E));
        }
      });
    };
    function u() {
      let f;
      if (!e.summary) f = {};
      else if (typeof e.summary == "string") try {
        f = JSON.parse(e.summary);
      } catch (m) {
        console.warn("Invalid JSON in rd.summary:", m), f = {};
      }
      else typeof e.summary == "object" ? f = e.summary : f = {};
      return typeof e.onInitSummaryObject == "function" ? e.onInitSummaryObject(f) : f;
    }
    let d = -1;
    const h = u(), p = (e.sections || []).filter((f) => f.type == "header"), y = (e.sections || []).filter((f) => f.type == "total"), S = (e.sections || []).filter((f) => f.type == "detail"), w = (e.sections || []).filter((f) => f.type === "group").map((f, m) => {
      const E = (g, b) => g[b];
      return {
        name: "G" + (m + 1),
        id: f.id,
        rd: e,
        definition: f,
        current: "",
        init: function(g) {
          const b = r[this.name].all, v = E(g, this.definition.key);
          b[v] = {
            rows: b[v]?.rows ?? [],
            records: [],
            recordCount: 0,
            key: v,
            summary: {}
          }, b[v].records.push(g), b[v].rows?.push(g), b[v].recordCount = 1;
        },
        sum: function(g) {
          const b = r[this.name].all, v = E(g, this.definition.key);
          b[v] = b[v] || {
            rows: [],
            records: [],
            recordCount: 0,
            key: v
          }, b[v].records.push(g), b[v].rows?.push(g), b[v].recordCount += 1;
        },
        test: function(g) {
          return E(g, this.definition.key) == this.current;
        }
      };
    }) || [];
    e.iteratefn && o.forEach(e.iteratefn), e.orderBy && (o = ot(o, e.orderBy)), r.dataSet = o, r.reportDefinition = e, w.forEach((f) => {
      const m = o[0];
      f.current = o && o[0] && m[f.definition.key] || "";
      const E = f.name;
      r[E] = { all: {} };
    }), e.onStartfn && e.onStartfn(r), c(), o.length > 0 && s(), o.forEach((f) => {
      if (r.recordCount++, r.isLastRow = o.length === r.recordCount, r.isLastRowInGroup = r.isLastRow, r.percent = r.recordCount / o.length * 100, r.previous = r.data || f, r.data = f, e.onRowfn && e.onRowfn(r), w.every((m) => m.test(f)) ? w.forEach((m) => {
        m.sum(f);
      }) : (w.some((m, E) => m.test(f) ? !1 : (d = E, i(d), w.forEach((g, b) => {
        b >= d ? (g.init(f), d = E) : g.sum(f);
      }), !0)), w.forEach((m) => m.current = f[m.definition.key]), e.onGroupChangefn && e.onGroupChangefn(r), s()), w.length && !r.isLastRow) {
        const m = o[r.recordCount];
        r.isLastRowInGroup = !w.every((E) => {
          const g = E.definition.key;
          return m[g] === r.data[g];
        });
      }
      a();
    }), o.length > 0 && (r.previous = r.data, i()), l(), n.flush && n.flush(), e.state = r;
  }
  loadFromText(e) {
    return new Function(e + `
; return reportDefinition;`)();
  }
  async loadExternalReport(e) {
    L.publish("APP_CONFIG.messages.httpClient.loading");
    const t = await (await fetch(e)).text();
    return L.publish("APP_CONFIG.messages.httpClient.loaded"), this.loadFromText(t);
  }
  async loadRegisteredReport(e) {
    const t = at(e);
    if (!t) throw new Error(`Report not found: ${e}`);
    return (await t()).reportDefinition;
  }
}, lt = class {
  createEngine() {
    return new ct();
  }
  generateReport(e, t, n) {
    this.createEngine().generateReport(e, t, n);
  }
  async loadExternalReport(e) {
    return await this.createEngine().loadExternalReport(e);
  }
  async loadRegisteredReport(e) {
    return await this.createEngine().loadRegisteredReport(e);
  }
}, ut = class {
  hasComponents = !1;
  buffer = "";
  documentFragment;
  update = () => "";
  constructor(e) {
    this.hasComponents = !1, this.update = e, this.documentFragment = document.createDocumentFragment();
  }
  send(e) {
    if (Array.isArray(e)) this.buffer += e.join("");
    else if (typeof e == "string") this.buffer += e;
    else if (e.component) {
      this.hasComponents = !0;
      const t = e.component.render?.();
      t && this.documentFragment.appendChild(t), this.buffer += '<div data-replace-locator=""></div>';
    }
  }
  flush() {
    this.update({
      html: this.buffer,
      documentFragment: this.documentFragment,
      hasComponents: this.hasComponents
    });
  }
  clear() {
    this.hasComponents = !1, this.buffer = "", this.documentFragment = document.createDocumentFragment(), this.flush();
  }
  applyResult(e, t, n) {
    e.innerHTML = t.html;
    const r = t.documentFragment;
    if (!(r && r.hasChildNodes())) {
      n?.();
      return;
    }
    if (!t.html) {
      e.append(r);
      return;
    }
    n?.(), e.querySelectorAll("[data-replace-locator]").forEach((o) => {
      const s = r.firstChild;
      s && o.replaceWith(s);
    });
  }
}, ft = class {
  show(e, t, n = "") {
    L.publish("APP_CONFIG.messages.app.showNotification", {
      message: e,
      autoCloseMs: t,
      type: n
    });
  }
  success(e, t = 4e3) {
    this.show(e, t, "success");
  }
  info(e, t = 4e3) {
    this.show(e, t, "info");
  }
  warning(e, t = 6e3) {
    this.show(e, t, "warning");
  }
  error(e, t = 8e3) {
    this.show(e, t, "error");
  }
  close(e) {
    L.publish("APP_CONFIG.messages.app.closeNotification", e);
  }
}, dt = new ft(), mt = Le, gt = Ie, yt = Ce, bt = $e, vt = Re, Et = {
  ...je,
  storage: et
}, wt = {
  RQ: st,
  pubSub: L,
  ReportEngineService: lt,
  DefaultMediator: ut,
  notificationService: dt
}, Ct = {
  ClockComponent: pe,
  ProgressBarComponent: me
};
export {
  Q as BaseComponent,
  Ct as Components,
  pt as FloatingPortal,
  oe as buildAndInterpolate,
  mt as dom,
  gt as hydrate,
  xe as hydrateElement,
  vt as icons,
  ht as initApp,
  L as pubSub,
  $ as registerComponent,
  M as resolveBindingValue,
  wt as services,
  Et as state,
  yt as template,
  bt as utils
};

//# sourceMappingURL=vanilla-reactive.es.js.map