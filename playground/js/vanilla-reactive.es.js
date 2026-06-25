var X = Object.defineProperty, P = (e, t) => {
  let n = {};
  for (var r in e)
    X(n, r, {
      get: e[r],
      enumerable: !0
    });
  return t || X(n, Symbol.toStringTag, { value: "Module" }), n;
}, Se = /* @__PURE__ */ P({
  decodeHTMLEntities: () => oe,
  evaluateExpression: () => ne,
  getValue: () => C,
  interpolate: () => te,
  preProcessTemplate: () => q,
  resolveArgs: () => I,
  safeAttribute: () => se,
  safeInnerHTML: () => re
}), ee = {
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
    const r = e != null ? String(e) : "", s = Number(t);
    return !Number.isFinite(s) || s <= 0 ? "" : r.length <= s ? r : r.slice(0, s) + n;
  },
  debug: function(e) {
    return console.log("Valor actual:", e), console.log("Scope completo:", this), e;
  },
  safeHTML: function(e) {
    return re(e);
  },
  safeAttribute: function(e) {
    return se(e);
  }
};
function Ae(e, t) {
  try {
    return t && e in t || e in ee || e in self || t && t["#"];
  } catch {
    return !1;
  }
}
function C(e, t) {
  if (!e || e === "this") return t;
  const n = e.split("|").map((a) => a.trim()), r = n.shift() || "", s = n;
  if (r.startsWith("t:")) {
    const [a, ...c] = r.slice(2).split(":");
    return s.unshift("t"), s[0] += ":" + c.join(":"), j(s, a, t);
  }
  if (r.startsWith("'") && r.endsWith("'")) {
    const [a, ...c] = r.slice(1, -1).split(":");
    return s.unshift("t"), s[0] += ":" + c.join(":"), j(s, a, t);
  }
  const o = ((r || "").replace(/{([^{}]+)}/g, (a, c) => C(c.trim(), t)) || "").split(/\.|\[|\]/).filter((a) => a !== "");
  let i = t || self;
  if (Ae(o[0] || "", t)) {
    for (const a of o) if (i !== null && typeof i == "object" && a in i) i = i[a];
    else if (i && i["#"]) i = C(a, i["#"]);
    else if (a in self) i = self[a];
    else {
      i = void 0;
      break;
    }
    return j(s, i, t);
  }
}
function _e(e, t) {
  if (!e.includes("'")) return e.split(t).map((o) => o.trim());
  const n = [];
  let r = "", s = !1;
  for (let o = 0; o < e.length; o++) {
    const i = e[o];
    i === "'" ? (s = !s, r += i) : !s && e.startsWith(t, o) ? (n.push(r.trim()), r = "", o += t.length - 1) : r += i;
  }
  return n.push(r.trim()), n;
}
function j(e, t, n) {
  return e.reduce((r, s) => {
    const [o, ...i] = _e(s, ":"), a = C(o, n) || ee[o || ""];
    if (typeof a == "function") {
      const c = i.map((l) => l.startsWith("'") && l.endsWith("'") ? l.slice(1, -1) : l.startsWith("@") ? C(l.slice(1), n) : l);
      return a.apply(n, [r, ...c]);
    }
    return console.warn(`Filtro "${o}" no encontrado.`), r;
  }, t);
}
function te(e, t) {
  return q(e, t).replace(/{([^{}]+)}/g, (n, r) => {
    try {
      const s = C(r.trim(), t);
      return typeof s == "function" ? s.apply(t) : s != null ? String(s) : n;
    } catch (s) {
      return console.error(String(s), n), n;
    }
  });
}
function I(e, t) {
  return e.map((n) => {
    if (n.startsWith("$")) {
      const o = n.slice(1);
      return t.state ? C(o, t.state) : void 0;
    }
    if (n.startsWith("@")) return C(n.slice(1), t);
    const r = n.toLowerCase();
    if (r === "true") return !0;
    if (r === "false") return !1;
    if (r === "null") return null;
    if (r === "undefined") return;
    const s = Number(n);
    return n.trim() !== "" && !isNaN(s) ? s : n;
  });
}
function ne(e, t) {
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
function q(e, t) {
  if (!e.includes("@if")) return e;
  let n = 0, r = "";
  for (; n < e.length; ) if (e.startsWith("@if(", n)) {
    const s = n + 3, o = Le(e, s, "(", ")");
    if (o === -1) {
      r += e[n], n++;
      continue;
    }
    const i = e.slice(s + 1, o), a = o + 1, c = Ne(e, a);
    if (c === -1) {
      r += e[n], n++;
      continue;
    }
    const l = e.slice(a, c), u = ne(oe(i), t);
    u === "__UNDEFINED__" ? r += `@if(${i})${l}@endif` : u && (r += q(l, t)), n = c + 6;
  } else
    r += e[n], n++;
  return r;
}
function Ne(e, t) {
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
function Le(e, t, n, r) {
  let s = 0;
  for (let o = t; o < e.length; o++)
    if (e[o] === n ? s++ : e[o] === r && s--, s === 0) return o;
  return -1;
}
function re(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
function se(e) {
  return String(e).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#39;");
}
function oe(e) {
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
var Oe = /* @__PURE__ */ P({
  $: () => ke,
  build: () => F,
  buildAndInterpolate: () => ie,
  getQueryParams: () => Te,
  initObserver: () => ae,
  setupFocusTrap: () => Pe
});
function F(e, t = {}, n = !1, r) {
  const s = document.createElement(e);
  if (typeof t == "string") {
    if (!t.trim()) return s;
    s.innerHTML = t;
  } else {
    const { className: o, ...i } = t;
    if (Object.assign(s, i), o && (s.className = o), r && "slottedNodes" in r) {
      const a = r.slottedNodes;
      for (const [c, l] of Object.entries(a)) {
        const u = s.querySelector(`slot[name="${c}"]`);
        if (u) {
          const d = u.parentElement;
          for (const p of l) p instanceof Node && d.insertBefore(p, u);
          u.remove();
        }
      }
    }
  }
  return r && x(s, r), K(s), r && fe(r, Q(s, r)), r && J(s, r), n && s.firstElementChild || s;
}
function ie(e, t = {}, n = !0, r = {}) {
  const s = te(e, t);
  return F("div", {
    ...r,
    innerHTML: s
  }, n, t);
}
function ke(e, t) {
  return {
    one: () => (t || document).querySelector(e),
    all: () => Array.from((t || document).querySelectorAll(e)),
    exists: () => (t || document).querySelector(e) !== null
  };
}
function Te() {
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
    const o = e.querySelectorAll(t);
    return Array.from(o).filter((i) => i.offsetWidth > 0 || i.offsetHeight > 0 || i.getClientRects().length > 0);
  }, r = (o) => {
    if (o.key !== "Tab") return;
    const i = n();
    if (i.length === 0) {
      o.preventDefault();
      return;
    }
    const a = i[0], c = i[i.length - 1], l = document.activeElement;
    !o.shiftKey && l === c ? (a?.focus(), o.preventDefault()) : o.shiftKey && (l === a || !e.contains(l)) && (c?.focus(), o.preventDefault());
  }, s = n();
  return s.length > 0 && s[0]?.focus(), window.addEventListener("keydown", r, !0), function() {
    window.removeEventListener("keydown", r, !0);
  };
}
var ae = () => {
  const e = new MutationObserver((t) => {
    t.forEach((n) => {
      n.removedNodes.forEach((r) => {
        if (r instanceof HTMLElement) {
          const s = (o) => {
            o.__componentInstance && !o.__isUpdating && o.__componentInstance.destroy?.(), Array.from(o.children).forEach((i) => s(i));
          };
          s(r);
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
}, Re = /* @__PURE__ */ P({
  createIcon: () => ue,
  registerIcons: () => ce
}), le = {};
function ce(e) {
  for (const [t, n] of Object.entries(e)) le[t] = n;
}
function ue(e, t = "w-6 h-6") {
  const n = le[e] || "";
  if (n) {
    const r = document.createElement("div");
    r.innerHTML = n;
    const s = r.firstElementChild;
    if (s)
      return s.setAttribute("class", t), s;
  }
  return e;
}
var Ie = class {
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
    const r = this.topics.get(e), s = this.getScopeKey(n);
    r.has(s) || r.set(s, /* @__PURE__ */ new Set());
    const o = r.get(s);
    return o.add(t), () => {
      o.delete(t), o.size === 0 && r.delete(s), r.size === 0 && this.topics.delete(e);
    };
  }
  publish(e, t, n) {
    const r = this.topics.get(e);
    if (!r) return;
    const s = this.getScopeKey(n);
    queueMicrotask(() => {
      s !== this.GLOBAL_SCOPE ? r.get(s)?.forEach((o) => o(t)) : r.forEach((o) => o.forEach((i) => i(t)));
    });
  }
}, L = new Ie(), Me = /* @__PURE__ */ P({
  UNSET: () => G,
  getComponent: () => Fe,
  getHydrationPromise: () => de,
  getResolver: () => pe,
  hydrateComponents: () => Q,
  hydrateDirectives: () => x,
  hydrateElement: () => De,
  hydrateEventListeners: () => J,
  hydrateIcons: () => K,
  registerComponent: () => $,
  resolveBindingValue: () => M,
  trackHydration: () => fe
}), G = /* @__PURE__ */ Symbol("UNSET"), z = /* @__PURE__ */ new Map();
function $(e, t) {
  z.set(e, t);
}
function Fe(e) {
  return z.get(e);
}
function xe(e) {
  return e.prototype && e.prototype.constructor === e;
}
var B = /* @__PURE__ */ new WeakMap();
function fe(e, t) {
  const n = B.get(e);
  B.set(e, n ? n.then(() => t) : t);
}
function de(e) {
  return B.get(e) || Promise.resolve();
}
function De(e, t) {
  K(e), J(e, t), Q(e, t), x(e, t);
}
function K(e = document.body) {
  return e.querySelectorAll("[data-icon]").forEach((t) => {
    const n = t.dataset.icon, r = t.className, s = ue(n, r);
    s && t.replaceWith(s);
  }), e;
}
function J(e, t) {
  const n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT);
  let r = e;
  for (t.bindings || (t.bindings = []); r; ) {
    const s = r;
    Array.from(s.attributes).forEach((o) => {
      const i = o.name, a = o.value;
      if (i === "on-publish") {
        const [c, l, u, ...d] = a.split(":"), p = l === "local" ? t.instanceId : void 0, h = L.subscribe(c, (y) => {
          const S = y && typeof y == "object" && "args" in y ? y.args[0] : y;
          switch ((u || "").toLowerCase()) {
            case "classname":
              s.className = S;
              break;
            case "html":
            case "innerhtml":
              s.innerHTML = S;
              break;
            case "json":
              s.innerHTML = JSON.stringify(C(S, t), null, 2);
              break;
            case "style":
              s.style[d[0] || ""] = S;
              break;
            case "toggleclass":
              s.classList.toggle(d[0] || "");
              break;
            default:
              if (u && typeof t[u] == "function") t[u].call(t, s, y, ...d);
              else if (u && u.startsWith("attr.")) {
                const b = u.split(".")[1], f = S;
                b && s.setAttribute(b, f);
              } else s.innerHTML = C(S, t);
          }
        }, p);
        t.component && t.component.addCleanup(h), s.removeAttribute(i);
      } else if (i.startsWith("on-")) {
        const c = i.replace("on-", "");
        if (a.startsWith("publish")) {
          const [, l, u, ...d] = a.split(":");
          if (!l) {
            console.warn("Falta el topic en el publish:", a);
            return;
          }
          const p = u === "local" ? t.instanceId : void 0;
          s.addEventListener(c, (h) => {
            const y = d.length > 0 ? I(d, t) : [];
            L.publish(l, {
              event: h,
              target: s,
              args: y
            }, p);
          });
        } else {
          const [l, ...u] = a.split(":"), d = t[l || ""] || t.handlers?.[l || ""];
          if (typeof d == "function") {
            const p = I(u, t);
            s.addEventListener(c, (h) => {
              d.call(t, s, h, ...p);
            });
          }
        }
        s.removeAttribute(i);
      } else i === "data-bind" && (a.split(";").map((c) => c.trim()).filter(Boolean).forEach((c) => {
        const [l = "", ...u] = c.split(":").map((b) => b.trim()), d = u.join(":"), p = I(u, t), [h, y] = l.includes(".") ? l.split(".") : [l, null], S = {
          element: s,
          type: h,
          prop: y,
          path: d,
          params: p,
          lastValue: G
        };
        if (h === "fn") {
          const b = s.getAttribute("data-deps");
          b && (S.depExpressions = b.split(",").map((f) => f.trim()).filter(Boolean));
        }
        t.bindings.push(S), M(S, t);
      }), s.removeAttribute("data-deps"), s.removeAttribute(i));
    }), r = n.nextNode();
  }
  return e;
}
async function Q(e, t) {
  const n = e.querySelectorAll("[data-component]");
  for (const r of Array.from(n)) {
    const s = r.dataset.component;
    if (!s) continue;
    const o = z.get(s);
    if (!o) {
      console.error(`Componente ${s} no encontrado en el registro.`);
      continue;
    }
    const i = xe(o) ? new o(t) : o(t);
    r.removeAttribute("data-component");
    const a = r.className.trim();
    i.init?.({ parent: r });
    const c = i.render();
    if (c && (Y.bind(i, c), c.id || c.setAttribute("id", r.id), c.setAttribute(s, ""), a)) {
      const l = a.split(/\s+/).filter((u) => u.length > 0);
      c.classList.add(...l);
    }
    r.replaceWith(c || document.createComment(`Component ${s} rendered an empty element`)), i.mounted?.();
  }
}
function x(e, t) {
  e.querySelectorAll("[data-t]").forEach((n) => {
    const r = n.dataset.t, s = r.startsWith("t:") ? r.slice(2) : r;
    n.setAttribute("data-i18n-key", s);
  }), Array.from(e.querySelectorAll("[data-each]")).filter((n) => !n.parentElement?.closest("[data-each]")).forEach((n) => {
    const [r, , ...s] = n.dataset.each.split(" "), o = s.join(" ").trim();
    let i = [];
    if (o.startsWith("[") && o.endsWith("]")) try {
      i = JSON.parse(o.replace(/'/g, '"'));
    } catch (l) {
      console.error("Error parseando array estático en data-each:", l);
    }
    else i = C(o, t) || [];
    const a = n.innerHTML.replaceAll("~", "|");
    if (n.innerHTML = "", n.removeAttribute("data-each"), i.length === 0) {
      n.appendChild(document.createComment(`anchor:each-${o}`));
      return;
    }
    const c = document.createDocumentFragment();
    i.forEach((l, u) => {
      if (l instanceof Node) {
        c.appendChild(l);
        return;
      }
      const d = Object.create(t);
      d[r || ""] = l, d.index = u, d["#"] = t;
      const p = ie(a, d, !1);
      for (je(p, d), x(p, d); p.firstChild; ) c.appendChild(p.firstChild);
    }), n.appendChild(c);
  });
}
function pe(e) {
  const { type: t, prop: n, params: r } = e, s = {
    fn: (o, i) => {
      typeof i == "function" ? i(o, r?.slice(1)) : console.warn(`La función '${e.path}' no se encontró en el contexto.`);
    },
    text: (o, i) => o.innerText = i ?? "",
    html: (o, i) => o.innerHTML = i ?? "",
    value: (o, i) => {
      const a = o.__instance;
      a ? a.setProp?.("value", i) : o.value = i ?? "";
    },
    checked: (o, i) => o.checked = !!i,
    attr: (o, i) => i == null ? o.removeAttribute(n) : o.setAttribute(n, String(i)),
    class: (o, i) => o.className = i ?? "",
    toggle: (o, i) => o.classList.toggle(n, !!i),
    style: (o, i) => o.style[n] = i,
    show: (o, i) => o.style.display = i ? "" : "none",
    hide: (o, i) => o.style.display = i ? "none" : "",
    disabled: (o, i) => o.disabled = !!i
  };
  return s[t] || s.text || (() => {
  });
}
function je(e, t) {
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
function $e(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; n++) if (!Object.is(e[n], t[n])) return !1;
  return !0;
}
function M(e, t) {
  const n = pe(e);
  let r = e.path;
  e.type === "fn" && e.params && e.params.length > 0 && (r = e.params[0]);
  let s;
  const o = C(r, t);
  if (o !== void 0) s = o;
  else {
    const i = He(e.element);
    s = C(r, i);
  }
  if (e.type === "fn" && e.depExpressions) {
    const i = e.depExpressions.map((a) => C(a, t));
    if (e.lastDeps && $e(i, e.lastDeps)) return;
    e.lastDeps = i, e.lastValue = s, n(e.element, s);
    return;
  }
  if (e.type === "fn") {
    e.lastValue = s, n(e.element, s);
    return;
  }
  e.lastValue !== G && Object.is(s, e.lastValue) || (e.lastValue = s, n(e.element, s));
}
var Y = class W {
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
    this.parsePropsAndChildren(t), this.instanceId = ++W.instance, this.bindMethods(), this.ctx = t, this.state = new Proxy({}, { set: (n, r, s) => (n[r] = s, this.isInitializing || this.update(r), !0) });
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
    const r = this.element.querySelector("#router-outlet"), s = n.querySelector("#router-outlet");
    r && s && s.replaceWith(r);
    const o = document.createDocumentFragment();
    for (; n.firstChild; ) o.appendChild(n.firstChild);
    this.element.innerHTML = "", this.element.appendChild(o), this.mounted?.(), Promise.resolve().then(() => {
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
    const n = t.parent, r = this, s = this.ctx;
    Array.from(n.attributes).forEach((o) => {
      if (!o.name.startsWith("(") || !o.name.endsWith(")")) return;
      const i = o.name.slice(1, -1).replace(/-([a-z])/g, (d, p) => p.toUpperCase()), a = o.value.trim(), c = a.match(/^([\w\\.]+)\[(.+)\]$/);
      let l;
      if (c) {
        const [, d, p] = c, h = C(d, s);
        l = {
          Map: () => h.get(p),
          Set: () => Array.from(h)[Number(p)],
          Default: () => h?.[p || ""]
        }[h instanceof Map ? "Map" : h instanceof Set ? "Set" : "Default"]();
      }
      const u = l || s[a] || C(a, s);
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
    return de(this);
  }
  bind(t) {
    return W.bind(this, t);
  }
}, Be = /* @__PURE__ */ P({ useState: () => he });
function he(e) {
  const t = {}, n = new Proxy(e, {
    get(o, i) {
      return o[i];
    },
    set(o, i, a) {
      const c = i;
      return o[c] === a || (o[c] = a, t[c]?.forEach((l) => l(a))), !0;
    }
  });
  return {
    store: n,
    put: (o, i) => {
      n[o] = i;
    },
    on: (o, i) => (t[o] || (t[o] = []), t[o].push(i), () => {
      t[o] && (t[o] = t[o].filter((a) => a !== i), t[o].length === 0 && delete t[o]);
    })
  };
}
var me = class extends Y {
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
}, ge = class extends Y {
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
function mt(e) {
  const t = () => {
    "lucideIcons" in window && ce(window.lucideIcons), $("clock-component", me), $("progress-bar-component", ge), (e ? Array.isArray(e) ? e : [e] : []).forEach((r) => r()), document.body.style.visibility = "visible", ae();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t, { once: !0 }) : t();
  const n = localStorage.getItem("theme");
  (n === "dark" || !n && window.matchMedia("(prefers-color-scheme: dark)").matches) && document.documentElement.classList.add("dark");
}
var gt = class {
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
    const e = this.triggerElement.getBoundingClientRect(), t = this.portalElement.offsetHeight, n = this.portalElement.offsetWidth, r = window.innerHeight, s = window.innerWidth, o = this.options.offset, i = this.options.placement ?? "";
    if (i === "right-start" || i === "left-start") {
      this.updatePositionSide(e, n, t, s, r, o, i);
      return;
    }
    const a = r - e.bottom < t && e.top > t;
    this.portalElement.style.minWidth = `${this.triggerElement.offsetWidth}px`;
    let c = i === "top-end" || e.left + n > s && e.right > n ? e.right - n : e.left;
    const l = o, u = Math.max(l, s - n - o);
    c = Math.min(Math.max(c, l), u), this.portalElement.style.left = `${c}px`, a ? (this.portalElement.style.top = `${e.top - t - o}px`, this.portalElement.classList.add("origin-bottom")) : (this.portalElement.style.top = `${e.bottom + o}px`, this.portalElement.classList.remove("origin-bottom"));
  }
  updatePositionSide(e, t, n, r, s, o, i) {
    const a = r - e.right, c = i === "right-start" ? a >= t + o : e.left < t + o;
    let l;
    c ? l = e.right + o : l = e.left - t - o, l = Math.min(Math.max(l, o), r - t - o);
    let u = e.top;
    u + n > s - o && (u = s - n - o), u = Math.max(u, o), this.portalElement.style.left = `${l}px`, this.portalElement.style.top = `${u}px`;
  }
  updatePositionTooltip() {
    const e = this.triggerElement.getBoundingClientRect(), t = this.portalElement.offsetHeight, n = this.portalElement.offsetWidth, r = window.innerHeight, s = window.innerWidth, o = this.options.offset ?? 6, i = this.options.placement ?? "top", a = {
      top: e.top,
      bottom: r - e.bottom,
      left: e.left,
      right: s - e.right
    }, c = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }, l = i.split("-")[0], u = a[l] >= t + o ? l : c[l], d = e.left + e.width / 2 - n / 2, p = e.top + e.height / 2 - t / 2;
    let h, y;
    switch (u) {
      case "top":
        h = e.top - t - o, y = d;
        break;
      case "bottom":
        h = e.bottom + o, y = d;
        break;
      case "left":
        h = p, y = e.left - n - o;
        break;
      case "right":
        h = p, y = e.right + o;
        break;
      default:
        h = e.top - t - o, y = d;
    }
    y = Math.min(Math.max(y, o), s - n - o), h = Math.min(Math.max(h, o), r - t - o), this.portalElement.style.left = `${y}px`, this.portalElement.style.top = `${h}px`, this.portalElement.style.minWidth = "";
  }
  updateBound = () => this.scheduleUpdate();
  clickOutsideBound = (e) => {
    const t = e.target, n = this.triggerElement.contains(t), r = this.portalElement.contains(t);
    if (!n && !r) {
      for (const s of this.associatedElements) if (s.contains(t)) return;
      this.options.onClose?.();
      return;
    }
    r && this.options.onClickInside?.(e);
  };
}, We = /* @__PURE__ */ P({
  accentNumericComparer: () => qe,
  buildSorter: () => ve,
  clone: () => Qe,
  createMap: () => Ue,
  debounce: () => Ke,
  formatNumber: () => Ge,
  getSafeFormData: () => Ve,
  getUniqueValues: () => ze,
  getUniqueValuesSorted: () => be,
  getValueByPath: () => ye,
  groupByNested: () => Je,
  hasOwnProperty: () => Ye,
  normalizeNFD: () => V,
  toDate: () => tt,
  toMap: () => et,
  toSet: () => Ze,
  where: () => Xe
}), Ve = (e) => {
  const t = Array.from(e.entries()).map(([n, r]) => typeof r == "string" ? [n, r.trim()] : [n, r]);
  return Object.fromEntries(t);
};
function Ue(e, t = "id", n = "name") {
  return Array.isArray(e) ? Object.fromEntries(e.map((r) => [r[t], ye(r, n)])) : {};
}
function ye(e, t) {
  if (!t) return e;
  if (!t.includes(".")) return e?.[t];
  let n = e;
  for (const r of t.split(".")) {
    if (n == null) return;
    n = n[r];
  }
  return n;
}
function qe(e, t) {
  return e.localeCompare(t, void 0, {
    sensitivity: "accent",
    numeric: !0
  });
}
var V = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), Ge = (e, t = "es") => new Intl.NumberFormat(t).format(e);
function ze(e, t) {
  return [...new Set(e.map((n) => n[t]))];
}
function be(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) r != null && n.add(r);
  return Array.from(n).sort(t);
}
function Ke(e, t) {
  let n = null;
  return (...r) => {
    n && clearTimeout(n), n = setTimeout(() => e(...r), t);
  };
}
function Je(e, ...t) {
  if (t.length === 0) throw new Error("Debes proporcionar al menos una clave para agrupar.");
  const n = {};
  for (const r of e) {
    let s = n;
    for (let o = 0; o < t.length; o++) {
      const i = t[o], a = String(r[i]);
      o === t.length - 1 ? (s[a] || (s[a] = []), s[a].push(r)) : (s[a] || (s[a] = {}), s = s[a]);
    }
  }
  return n;
}
function ve(e, t = "asc") {
  const n = t === "asc" ? 1 : -1, r = (s) => s === void 0 ? 0 : s === null ? 1 : s === "" ? 2 : 3;
  return (s, o) => {
    const i = s[e], a = o[e], c = r(i) - r(a);
    if (c !== 0) return c * n;
    if (typeof i == "boolean" && typeof a == "boolean") return (Number(i) - Number(a)) * n;
    if (typeof i == "number" && typeof a == "number") return (i - a) * n;
    const l = V(String(i)), u = V(String(a));
    return l.localeCompare(u, void 0, {
      sensitivity: "base",
      numeric: !0
    }) * n;
  };
}
function Qe(e) {
  return JSON.parse(JSON.stringify(e));
}
function Ye(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function Xe(e, t) {
  if (typeof t == "function") return e.filter(t);
  if (t !== null && typeof t == "object") {
    const n = Object.entries(t);
    return n.length === 0 ? e : e.filter((r) => n.every(([s, o]) => {
      let i = r[s];
      if (typeof i == "function") try {
        i = i.call(r);
      } catch (a) {
        return console.error(`Error al ejecutar la propiedad computada '${s}' en el item:`, r, a), !1;
      }
      return typeof o == "function" ? o(i, r) : o instanceof RegExp ? typeof i == "string" && o.test(i) : Object.is(i, o);
    }));
  }
  return e;
}
function Ze(e, t) {
  return new Set(e.map((n) => t === void 0 ? n : typeof t == "function" ? t(n) : n[t]));
}
function et(e, t, n) {
  return new Map(e.map((r) => [typeof t == "function" ? t(r) : r[t], n === void 0 ? r : typeof n == "function" ? n(r) : r[n]]));
}
function tt(e) {
  if (typeof e == "string" && e.length > 0) {
    const [t, n] = e.trim().split(" ");
    if (!t) return null;
    const [r, s, o] = t.split("/").map(Number);
    if (!r || !s || !o) return null;
    let i = 0, a = 0, c = 0, l = 0;
    if (n) {
      const [d, p, h] = n.split(":");
      if (i = ~~(d || 0), a = ~~(p || 0), h) {
        const y = h.split(".");
        c = ~~(y[0] || 0), l = ~~(y[1] || 0);
      }
    }
    const u = new Date(o, s - 1, r, i, a, c, l);
    return Number.isNaN(u.getTime()) ? null : u;
  }
  return null;
}
var U = "VanillaLib2026:", H = (e) => U + e, nt = {
  writeValue: function(e, t) {
    try {
      localStorage.setItem(H(e), JSON.stringify({ value: t }));
    } catch (n) {
      console.error(`StorageUtil.writeValue error [${e}]:`, n);
    }
    return this;
  },
  readValue: function(e, t) {
    try {
      const n = localStorage.getItem(H(e));
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
        if (r && r.startsWith(U)) {
          const s = localStorage.getItem(r);
          if (s) try {
            const o = JSON.parse(s), i = r.substring(15);
            e[i] = o.value;
          } catch (o) {
            console.warn(`StorageUtil.readAll: Failed to parse item for key ${r}`, o);
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
      localStorage.removeItem(H(e));
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
        n && n.startsWith(U) && e.push(n);
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
async function rt(e, t, n, r) {
  try {
    const s = await e();
    if (!s.ok) {
      const c = await s.json().catch(() => null), l = `${s.status} ${s.statusText}${c?.error?.message ? ` - ${c.error.message}` : ""}`;
      return console.error(`[ERROR] ${n ?? "Fetching"}:`, l), "API error: " + l;
    }
    const o = s.headers.get("content-type");
    let i;
    o && o.includes("application/json") ? i = await s.json().catch(() => null) : i = await s.text(), t && i && typeof i == "object" && i[t] && (i = i[t]);
    const a = r ? r(i) : i;
    return {
      success: !0,
      message: typeof i == "object" && i?.message ? i.message : "Request successful",
      data: a
    };
  } catch (s) {
    if (s instanceof Error) {
      const o = s.name === "SyntaxError" ? "FETCH error: Syntax error" : `API error: ${s.message}`;
      return console.error(`[ERROR] Fetching ${n ?? ""}:`, o), o;
    }
    return console.error(`[ERROR] ${n ?? "Fetching"}:`, s), String(s);
  }
}
function st(e, t, n = "GET") {
  return console.log(`[FETCH] ${n}:`, e), t !== void 0 && console.log(`[FETCH] ${n} payload:`, t), {
    url: e,
    payload: t,
    method: n
  };
}
function ot() {
  let e, t, n, r, s, o = "GET", i, a;
  const c = {};
  return {
    useBase(l) {
      return e = l, this;
    },
    useProperty(l) {
      return t = l, this;
    },
    useLog(l) {
      return r = l, this;
    },
    usePayload(l) {
      return s = l, this;
    },
    useTransform(l) {
      return i = l, this;
    },
    getFrom(l) {
      return n = l, o = "GET", this;
    },
    postTo(l) {
      return n = l, o = "POST", this;
    },
    putTo(l) {
      return n = l, o = "PUT", this;
    },
    patchTo(l) {
      return n = l, o = "PATCH", this;
    },
    deleteFrom(l) {
      return n = l, o = "DELETE", this;
    },
    useToken(l) {
      return a = l, this;
    },
    withHeader(l, u) {
      return c[l] = u, this;
    },
    async invoke() {
      if (!n) throw new Error("Target endpoint not defined. Use .getFrom(), .postTo(), etc.");
      const { url: l, payload: u, method: d } = st((e || "") + n, s, o), p = {
        "Content-Type": "application/json",
        ...a ? { Authorization: `Bearer ${a}` } : {},
        ...c
      }, h = u instanceof URLSearchParams || u instanceof FormData ? u : u ? JSON.stringify(u) : void 0;
      return rt(() => fetch(l, {
        method: d,
        headers: p,
        body: h
      }), t, r, i);
    }
  };
}
var it = { create: function() {
  return ot();
} };
function Z(e, t) {
  if (!e.length || !t) return {};
  const n = {};
  for (const r in t) {
    const s = t[r];
    if (!s?.length) continue;
    const o = e.map((i) => Number(i[r]) || 0);
    n[r] = {};
    for (const i of s) switch (i) {
      case "values":
        n[r].values = o;
        break;
      case "distinct":
        n[r].distinct = be(o.map((a) => a));
        break;
      case "sum":
        n[r].sum = o.reduce((a, c) => a + c, 0);
        break;
      case "avg":
        n[r].avg = o.length ? o.reduce((a, c) => a + c, 0) / o.length : 0;
        break;
      case "min":
        n[r].min = Math.min(...o);
        break;
      case "max":
        n[r].max = Math.max(...o);
        break;
      case "median":
        {
          const a = [...o].sort((l, u) => l - u), c = Math.floor(a.length / 2);
          n[r].median = a.length % 2 ? a[c] : (a[c - 1] + a[c]) / 2;
        }
        break;
    }
  }
  return n;
}
function at(e, t, n) {
  const r = (Array.isArray(t) ? t : t.split(",")).map((s, o) => {
    const [i, a] = s.trim().split(/\s+/);
    return ve(i, o === 0 && n ? n : a?.toLowerCase() === "desc" ? "desc" : "asc");
  });
  return [...e].sort((s, o) => {
    for (const i of r) {
      const a = i(s, o);
      if (a !== 0) return a;
    }
    return 0;
  });
}
var lt = {};
function ct(e) {
  return lt[e];
}
var ut = class {
  generateReport(e, t, n) {
    const r = {
      recordCount: 0,
      dataSet: [],
      percent: 0,
      isLastRow: !1,
      isLastRowInGroup: !1,
      grandTotal: {}
    };
    let s = e.parseData ? e.parseData(e, t) : t;
    const o = () => {
      b.forEach((f, m) => {
        if (m < d) return;
        const { id: w, name: g, current: v, definition: E } = f;
        if (E.valueProvider) {
          const O = m == b.length - 1, { key: _ } = E, A = {
            kind: "GroupHeaderRenderContext",
            id: w,
            name: g,
            key: _,
            current: v,
            dataSet: s,
            isLastGroup: O
          };
          n.send(E.valueProvider(A, _));
        }
      });
    }, i = (f) => {
      const m = b.map((w) => w);
      f && m.splice(0, f), m.reverse().forEach((w, g) => {
        const v = g == b.length - 1, { id: E, name: O, current: _, definition: A } = w, { key: k } = A, T = r[O];
        if (A.footerValueProvider) {
          const N = T.all[_];
          if (N) {
            N.summary = Z(N.records, p);
            const { records: R, recordCount: D, key: Ee, summary: we } = N, Ce = {
              kind: "GroupFooterRenderContext",
              id: E,
              name: O,
              key: k,
              current: _,
              data: {
                records: R,
                recordCount: D,
                key: Ee,
                summary: we
              },
              dataSet: s,
              isLastGroup: v
            };
            n.send(A.footerValueProvider(Ce));
          }
        }
      });
    }, a = () => {
      S.forEach((f) => {
        if (f.valueProvider) {
          const { recordCount: m, dataSet: w, isLastRow: g, isLastRowInGroup: v, percent: E, previous: O, data: _ } = r, A = b[b.length - 1], k = A?.name;
          let T = 0;
          k && (T = r[k].all[A?.current || ""]?.recordCount || 0);
          const N = {
            kind: "DetailRenderContext",
            id: f.id,
            data: _,
            previous: O,
            dataSet: w,
            recordCount: m,
            groupRecordCount: T,
            percent: E,
            isLastRow: g,
            isLastRowInGroup: v
          };
          return n.send(f.valueProvider(N));
        }
      });
    }, c = () => {
      y.forEach((f) => {
        if (f.valueProvider) {
          const { id: m } = f, { recordCount: w, dataSet: g, isLastRow: v, isLastRowInGroup: E, percent: O, previous: _, data: A } = r, k = b.reduce((N, R) => {
            const D = R.name;
            return N[R.name] = r[D].all, N;
          }, {}), T = {
            kind: "TotalRenderContext",
            id: m,
            data: A,
            previous: _,
            dataSet: g,
            grandTotal: Z(s, p),
            recordCount: w,
            percent: O,
            isLastRow: v,
            isLastRowInGroup: E,
            ...k
          };
          return n.send(f.valueProvider(T));
        }
      });
    }, l = () => {
      h.forEach((f) => {
        if (f.valueProvider) {
          const m = b.length > 0, w = {
            kind: "HeaderRenderContext",
            id: f.id,
            dataSet: s,
            isGroupedReport: m
          };
          return n.send(f.valueProvider(w));
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
    const p = u(), h = (e.sections || []).filter((f) => f.type == "header"), y = (e.sections || []).filter((f) => f.type == "total"), S = (e.sections || []).filter((f) => f.type == "detail"), b = (e.sections || []).filter((f) => f.type === "group").map((f, m) => {
      const w = (g, v) => g[v];
      return {
        name: "G" + (m + 1),
        id: f.id,
        rd: e,
        definition: f,
        current: "",
        init: function(g) {
          const v = r[this.name].all, E = w(g, this.definition.key);
          v[E] = {
            rows: v[E]?.rows ?? [],
            records: [],
            recordCount: 0,
            key: E,
            summary: {}
          }, v[E].records.push(g), v[E].rows?.push(g), v[E].recordCount = 1;
        },
        sum: function(g) {
          const v = r[this.name].all, E = w(g, this.definition.key);
          v[E] = v[E] || {
            rows: [],
            records: [],
            recordCount: 0,
            key: E
          }, v[E].records.push(g), v[E].rows?.push(g), v[E].recordCount += 1;
        },
        test: function(g) {
          return w(g, this.definition.key) == this.current;
        }
      };
    }) || [];
    e.iteratefn && s.forEach(e.iteratefn), e.orderBy && (s = at(s, e.orderBy)), r.dataSet = s, r.reportDefinition = e, b.forEach((f) => {
      const m = s[0];
      f.current = s && s[0] && m[f.definition.key] || "";
      const w = f.name;
      r[w] = { all: {} };
    }), e.onStartfn && e.onStartfn(r), l(), s.length > 0 && o(), s.forEach((f) => {
      if (r.recordCount++, r.isLastRow = s.length === r.recordCount, r.isLastRowInGroup = r.isLastRow, r.percent = r.recordCount / s.length * 100, r.previous = r.data || f, r.data = f, e.onRowfn && e.onRowfn(r), b.every((m) => m.test(f)) ? b.forEach((m) => {
        m.sum(f);
      }) : (b.some((m, w) => m.test(f) ? !1 : (d = w, i(d), b.forEach((g, v) => {
        v >= d ? (g.init(f), d = w) : g.sum(f);
      }), !0)), b.forEach((m) => m.current = f[m.definition.key]), e.onGroupChangefn && e.onGroupChangefn(r), o()), b.length && !r.isLastRow) {
        const m = s[r.recordCount];
        r.isLastRowInGroup = !b.every((w) => {
          const g = w.definition.key;
          return m[g] === r.data[g];
        });
      }
      a();
    }), s.length > 0 && (r.previous = r.data, i()), c(), n.flush && n.flush(), e.state = r;
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
    const t = ct(e);
    if (!t) throw new Error(`Report not found: ${e}`);
    return (await t()).reportDefinition;
  }
}, ft = class {
  createEngine() {
    return new ut();
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
}, dt = class {
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
    n?.(), e.querySelectorAll("[data-replace-locator]").forEach((s) => {
      const o = r.firstChild;
      o && s.replaceWith(o);
    });
  }
}, pt = class {
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
}, ht = new pt(), yt = Oe, bt = Me, vt = Se, Et = We, wt = Re, Ct = {
  ...Be,
  storage: nt
}, St = {
  RQ: it,
  pubSub: L,
  ReportEngineService: ft,
  DefaultMediator: dt,
  notificationService: ht
}, At = {
  ClockComponent: me,
  ProgressBarComponent: ge
};
export {
  Y as BaseComponent,
  At as Components,
  gt as FloatingPortal,
  ie as buildAndInterpolate,
  yt as dom,
  bt as hydrate,
  De as hydrateElement,
  wt as icons,
  mt as initApp,
  L as pubSub,
  $ as registerComponent,
  M as resolveBindingValue,
  St as services,
  Ct as state,
  vt as template,
  Et as utils
};

//# sourceMappingURL=vanilla-reactive.es.js.map