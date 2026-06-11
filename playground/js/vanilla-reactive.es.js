var _ = {};
function H(e) {
  for (const [t, n] of Object.entries(e)) _[t] = n;
}
function q(e, t = "w-6 h-6") {
  const n = _[e] || "";
  if (n) {
    const r = document.createElement("div");
    r.innerHTML = n;
    const s = r.firstElementChild;
    if (s)
      return s.setAttribute("class", t), s;
  }
  return e;
}
var I = {
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
    return J(e);
  },
  safeAttribute: function(e) {
    return G(e);
  }
};
function R(e, t) {
  try {
    return t && e in t || e in I || e in self || t && t["#"];
  } catch {
    return !1;
  }
}
function p(e, t) {
  if (!e || e === "this") return t;
  const n = e.split("|").map((a) => a.trim()), r = n.shift() || "", s = n;
  if (r.startsWith("t:")) {
    const [a, ...c] = r.slice(2).split(":");
    return s.unshift("t"), s[0] += ":" + c.join(":"), v(s, a, t);
  }
  if (r.startsWith("'") && r.endsWith("'")) {
    const [a, ...c] = r.slice(1, -1).split(":");
    return s.unshift("t"), s[0] += ":" + c.join(":"), v(s, a, t);
  }
  const o = ((r || "").replace(/{([^{}]+)}/g, (a, c) => p(c.trim(), t)) || "").split(/\.|\[|\]/).filter((a) => a !== "");
  let i = t || self;
  if (R(o[0] || "", t)) {
    for (const a of o) if (i !== null && typeof i == "object" && a in i) i = i[a];
    else if (i && i["#"]) i = p(a, i["#"]);
    else if (a in self) i = self[a];
    else {
      i = void 0;
      break;
    }
    return v(s, i, t);
  }
}
function B(e, t) {
  if (!e.includes("'")) return e.split(t).map((o) => o.trim());
  const n = [];
  let r = "", s = !1;
  for (let o = 0; o < e.length; o++) {
    const i = e[o];
    i === "'" ? (s = !s, r += i) : !s && e.startsWith(t, o) ? (n.push(r.trim()), r = "", o += t.length - 1) : r += i;
  }
  return n.push(r.trim()), n;
}
function v(e, t, n) {
  return e.reduce((r, s) => {
    const [o, ...i] = B(s, ":"), a = p(o, n) || I[o || ""];
    if (typeof a == "function") {
      const c = i.map((l) => l.startsWith("'") && l.endsWith("'") ? l.slice(1, -1) : l.startsWith("@") ? p(l.slice(1), n) : l);
      return a.apply(n, [r, ...c]);
    }
    return console.warn(`Filtro "${o}" no encontrado.`), r;
  }, t);
}
function U(e, t) {
  return P(e, t).replace(/{([^{}]+)}/g, (n, r) => {
    try {
      const s = p(r.trim(), t);
      return typeof s == "function" ? s.apply(t) : s != null ? String(s) : n;
    } catch (s) {
      return console.error(String(s), n), n;
    }
  });
}
function S(e, t) {
  return e.map((n) => {
    if (n.startsWith("$")) {
      const o = n.slice(1);
      return t.state ? p(o, t.state) : void 0;
    }
    if (n.startsWith("@")) return p(n.slice(1), t);
    const r = n.toLowerCase();
    if (r === "true") return !0;
    if (r === "false") return !1;
    if (r === "null") return null;
    if (r === "undefined") return;
    const s = Number(n);
    return n.trim() !== "" && !isNaN(s) ? s : n;
  });
}
function V(e, t) {
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
function P(e, t) {
  if (!e.includes("@if")) return e;
  let n = 0, r = "";
  for (; n < e.length; ) if (e.startsWith("@if(", n)) {
    const s = n + 3, o = K(e, s, "(", ")");
    if (o === -1) {
      r += e[n], n++;
      continue;
    }
    const i = e.slice(s + 1, o), a = o + 1, c = z(e, a);
    if (c === -1) {
      r += e[n], n++;
      continue;
    }
    const l = e.slice(a, c), u = V(Q(i), t);
    u === "__UNDEFINED__" ? r += `@if(${i})${l}@endif` : u && (r += P(l, t)), n = c + 6;
  } else
    r += e[n], n++;
  return r;
}
function z(e, t) {
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
function K(e, t, n, r) {
  let s = 0;
  for (let o = t; o < e.length; o++)
    if (e[o] === n ? s++ : e[o] === r && s--, s === 0) return o;
  return -1;
}
function J(e) {
  const t = document.createElement("div");
  return t.textContent = e, t.innerHTML;
}
function G(e) {
  return String(e).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#39;");
}
function Q(e) {
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
var X = class {
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
}, b = new X(), M = class w {
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
    this.parsePropsAndChildren(t), this.instanceId = ++w.instance, this.bindMethods(), this.ctx = t, this.state = new Proxy({}, { set: (n, r, s) => (n[r] = s, this.isInitializing || this.update(r), !0) });
  }
  setState(t, n = !0) {
    this.isInitializing = !0, Object.assign(this.state, t), this.isInitializing = !1, n && this.update("state");
  }
  publish(t, n) {
    b.publish(t, n, this.instanceId);
  }
  subscribe(t, n) {
    const r = b.subscribe(t, n, this.instanceId);
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
      t.element.isConnected ? C(t, this) : C(t, this);
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
      const i = o.name.slice(1, -1).replace(/-([a-z])/g, (f, d) => d.toUpperCase()), a = o.value.trim(), c = a.match(/^([\w\\.]+)\[(.+)\]$/);
      let l;
      if (c) {
        const [, f, d] = c, h = p(f, s);
        l = {
          Map: () => h.get(d),
          Set: () => Array.from(h)[Number(d)],
          Default: () => h?.[d || ""]
        }[h instanceof Map ? "Map" : h instanceof Set ? "Set" : "Default"]();
      }
      const u = l || s[a] || p(a, s);
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
    return ee(this);
  }
  bind(t) {
    return w.bind(this, t);
  }
}, T = /* @__PURE__ */ new Map();
function Y(e, t) {
  T.set(e, t);
}
function ue(e) {
  return T.get(e);
}
function Z(e) {
  return e.prototype && e.prototype.constructor === e;
}
var A = /* @__PURE__ */ new WeakMap();
function x(e, t) {
  const n = A.get(e);
  A.set(e, n ? n.then(() => t) : t);
}
function ee(e) {
  return A.get(e) || Promise.resolve();
}
function fe(e, t) {
  j(e), k(e, t), W(e, t), L(e, t);
}
function j(e = document.body) {
  return e.querySelectorAll("[data-icon]").forEach((t) => {
    const n = t.dataset.icon, r = t.className, s = q(n, r);
    s && t.replaceWith(s);
  }), e;
}
function k(e, t) {
  const n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT);
  let r = e;
  for (t.bindings || (t.bindings = []); r; ) {
    const s = r;
    Array.from(s.attributes).forEach((o) => {
      const i = o.name, a = o.value;
      if (i === "on-publish") {
        const [c, l, u, ...f] = a.split(":"), d = l === "local" ? t.instanceId : void 0, h = b.subscribe(c, (m) => {
          const g = m && typeof m == "object" && "args" in m ? m.args[0] : m;
          switch ((u || "").toLowerCase()) {
            case "classname":
              s.className = g;
              break;
            case "html":
            case "innerhtml":
              s.innerHTML = g;
              break;
            case "json":
              s.innerHTML = JSON.stringify(p(g, t), null, 2);
              break;
            case "style":
              s.style[f[0] || ""] = g;
              break;
            case "toggleclass":
              s.classList.toggle(f[0] || "");
              break;
            default:
              if (u && typeof t[u] == "function") t[u].call(t, s, m, ...f);
              else if (u && u.startsWith("attr.")) {
                const y = u.split(".")[1], D = g;
                y && s.setAttribute(y, D);
              } else s.innerHTML = p(g, t);
          }
        }, d);
        t.component && t.component.addCleanup(h), s.removeAttribute(i);
      } else if (i.startsWith("on-")) {
        const c = i.replace("on-", "");
        if (a.startsWith("publish")) {
          const [, l, u, ...f] = a.split(":");
          if (!l) {
            console.warn("Falta el topic en el publish:", a);
            return;
          }
          const d = u === "local" ? t.instanceId : void 0;
          s.addEventListener(c, (h) => {
            const m = f.length > 0 ? S(f, t) : [];
            b.publish(l, {
              event: h,
              target: s,
              args: m
            }, d);
          });
        } else {
          const [l, ...u] = a.split(":"), f = t[l || ""] || t.handlers?.[l || ""];
          if (typeof f == "function") {
            const d = S(u, t);
            s.addEventListener(c, (h) => {
              f.call(t, s, h, ...d);
            });
          }
        }
        s.removeAttribute(i);
      } else i === "data-bind" && (a.split(";").map((c) => c.trim()).filter(Boolean).forEach((c) => {
        const [l = "", ...u] = c.split(":").map((y) => y.trim()), f = u.join(":"), d = S(u, t), [h, m] = l.includes(".") ? l.split(".") : [l, null], g = {
          element: s,
          type: h,
          prop: m,
          path: f,
          params: d
        };
        t.bindings.push(g), C(g, t);
      }), s.removeAttribute(i));
    }), r = n.nextNode();
  }
  return e;
}
async function W(e, t) {
  const n = e.querySelectorAll("[data-component]");
  for (const r of Array.from(n)) {
    const s = r.dataset.component;
    if (!s) continue;
    const o = T.get(s);
    if (!o) {
      console.error(`Componente ${s} no encontrado en el registro.`);
      continue;
    }
    const i = Z(o) ? new o(t) : o(t);
    r.removeAttribute("data-component");
    const a = r.className.trim();
    i.init?.({ parent: r });
    const c = i.render();
    if (c && (M.bind(i, c), c.id || c.setAttribute("id", r.id), c.setAttribute(s, ""), a)) {
      const l = a.split(/\s+/).filter((u) => u.length > 0);
      c.classList.add(...l);
    }
    r.replaceWith(c || document.createComment(`Component ${s} rendered an empty element`)), i.mounted?.();
  }
}
function L(e, t) {
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
    else i = p(o, t) || [];
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
      const f = Object.create(t);
      f[r || ""] = l, f.index = u, f["#"] = t;
      const d = se(a, f, !1);
      for (ne(d, f), L(d, f); d.firstChild; ) c.appendChild(d.firstChild);
    }), n.appendChild(c);
  });
}
function te(e) {
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
function ne(e, t) {
  e.firstElementChild && (e.firstElementChild.__localCtx__ = t);
}
function re(e) {
  let t = e;
  for (; t; ) {
    const n = t.__localCtx__;
    if (n) return n;
    t = t.parentElement;
  }
  return null;
}
function C(e, t) {
  const n = te(e);
  let r = e.path;
  e.type === "fn" && e.params && e.params.length > 0 && (r = e.params[0]);
  const s = p(r, t);
  if (s !== void 0) {
    n(e.element, s);
    return;
  }
  const o = re(e.element), i = p(r, o);
  n(e.element, i);
}
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
          const f = u.parentElement;
          for (const d of l) d instanceof Node && f.insertBefore(d, u);
          u.remove();
        }
      }
    }
  }
  return r && L(s, r), j(s), r && x(r, W(s, r)), r && k(s, r), n && s.firstElementChild || s;
}
function se(e, t = {}, n = !0, r = {}) {
  const s = U(e, t);
  return F("div", {
    ...r,
    innerHTML: s
  }, n, t);
}
function de(e, t) {
  return {
    one: () => (t || document).querySelector(e),
    all: () => Array.from((t || document).querySelectorAll(e)),
    exists: () => (t || document).querySelector(e) !== null
  };
}
function he() {
  const e = new URLSearchParams(window.location.search);
  return Object.fromEntries(e.entries());
}
function pe(e) {
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
function oe(e) {
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
var $ = class extends M {
  _state = oe({
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
      <div class="rounded-lg p-1.5 border bg-background">
        <div class="flex items-center gap-3 mx-1">
          <i data-icon="timer" class="size-6 hidden lg:block"></i>
          <span class="font-mono text-slate-700 dark:text-slate-100" id="date-slot">
            --:--:--
          </span>
        </div>
      </div>
    `, !0);
    return e("date", (n) => {
      t.querySelector("#date-slot").textContent = n;
    }), t;
  }
}, me = (e) => {
  const t = Array.from(e.entries()).map(([n, r]) => typeof r == "string" ? [n, r.trim()] : [n, r]);
  return Object.fromEntries(t);
};
function ge(e, t = "id", n = "name") {
  return Array.isArray(e) ? Object.fromEntries(e.map((r) => [r[t], ie(r, n)])) : {};
}
function ie(e, t) {
  if (!t) return e;
  if (!t.includes(".")) return e?.[t];
  let n = e;
  for (const r of t.split(".")) {
    if (n == null) return;
    n = n[r];
  }
  return n;
}
function ye(e, t) {
  return e.localeCompare(t, void 0, {
    sensitivity: "accent",
    numeric: !0
  });
}
var O = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), be = (e, t = "es") => new Intl.NumberFormat(t).format(e);
function ve(e, t) {
  return [...new Set(e.map((n) => n[t]))];
}
function Se(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) r != null && n.add(r);
  return Array.from(n).sort(t);
}
function Ee(e, t) {
  let n = null;
  return (...r) => {
    n && clearTimeout(n), n = setTimeout(() => e(...r), t);
  };
}
function we(e, ...t) {
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
function Ae(e, t = "asc") {
  const n = t === "asc" ? 1 : -1, r = (s) => s === void 0 ? 0 : s === null ? 1 : s === "" ? 2 : 3;
  return (s, o) => {
    const i = s[e], a = o[e], c = r(i) - r(a);
    if (c !== 0) return c * n;
    if (typeof i == "boolean" && typeof a == "boolean") return (Number(i) - Number(a)) * n;
    if (typeof i == "number" && typeof a == "number") return (i - a) * n;
    const l = O(String(i)), u = O(String(a));
    return l.localeCompare(u, void 0, {
      sensitivity: "base",
      numeric: !0
    }) * n;
  };
}
function Ce(e) {
  return JSON.parse(JSON.stringify(e));
}
function Ne(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function Te(e, t) {
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
function Le(e, t) {
  return new Set(e.map((n) => t === void 0 ? n : typeof t == "function" ? t(n) : n[t]));
}
function Oe(e, t, n) {
  return new Map(e.map((r) => [typeof t == "function" ? t(r) : r[t], n === void 0 ? r : typeof n == "function" ? n(r) : r[n]]));
}
function _e(e) {
  if (typeof e == "string" && e.length > 0) {
    const [t, n] = e.trim().split(" ");
    if (!t) return null;
    const [r, s, o] = t.split("/").map(Number);
    if (!r || !s || !o) return null;
    let i = 0, a = 0, c = 0, l = 0;
    if (n) {
      const [f, d, h] = n.split(":");
      if (i = ~~(f || 0), a = ~~(d || 0), h) {
        const m = h.split(".");
        c = ~~(m[0] || 0), l = ~~(m[1] || 0);
      }
    }
    const u = new Date(o, s - 1, r, i, a, c, l);
    return Number.isNaN(u.getTime()) ? null : u;
  }
  return null;
}
var N = "VanillaLib2026:", E = (e) => N + e, Ie = {
  writeValue: function(e, t) {
    try {
      localStorage.setItem(E(e), JSON.stringify({ value: t }));
    } catch (n) {
      console.error(`StorageUtil.writeValue error [${e}]:`, n);
    }
    return this;
  },
  readValue: function(e, t) {
    try {
      const n = localStorage.getItem(E(e));
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
        if (r && r.startsWith(N)) {
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
      localStorage.removeItem(E(e));
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
        n && n.startsWith(N) && e.push(n);
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
async function ae(e, t, n, r) {
  try {
    const s = await e();
    if (!s.ok) {
      const c = await s.json().catch(() => null), l = `${s.status} ${s.statusText}${c?.error?.message ? ` - ${c.error.message}` : ""}`;
      return console.error(`[ERROR] ${n ?? "Fetching"}:`, l), "API error: " + l;
    }
    const o = await s.json().catch(() => null);
    let i = o;
    t && i[t] && (i = i[t]);
    const a = r ? r(i) : i;
    return {
      success: !0,
      message: o?.message ?? "Request successful",
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
function le(e, t, n = "GET") {
  return console.log(`[FETCH] ${n}:`, e), t !== void 0 && console.log(`[FETCH] ${n} payload:`, t), {
    url: e,
    payload: t,
    method: n
  };
}
function ce() {
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
      const { url: l, payload: u, method: f } = le((e || "") + n, s, o), d = {
        "Content-Type": "application/json",
        ...a ? { Authorization: `Bearer ${a}` } : {},
        ...c
      }, h = u instanceof URLSearchParams || u instanceof FormData ? u : u ? JSON.stringify(u) : void 0;
      return ae(() => fetch(l, {
        method: f,
        headers: d,
        body: h
      }), t, r, i);
    }
  };
}
var Pe = { create: function() {
  return ce();
} };
function Me(e) {
  const t = () => {
    "lucideIcons" in window && H(window.lucideIcons), Y("clock-component", $), (e ? Array.isArray(e) ? e : [e] : []).forEach((r) => r()), document.body.style.visibility = "visible";
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t, { once: !0 }) : t();
  const n = localStorage.getItem("theme");
  (n === "dark" || !n && window.matchMedia("(prefers-color-scheme: dark)").matches) && document.documentElement.classList.add("dark");
}
var je = { ClockComponent: $ };
export {
  de as $,
  M as BaseComponent,
  je as Components,
  Pe as RQ,
  ye as accentNumericComparer,
  F as build,
  se as buildAndInterpolate,
  Ae as buildSorter,
  Ce as clone,
  q as createIcon,
  ge as createMap,
  Ee as debounce,
  be as formatNumber,
  ue as getComponent,
  he as getQueryParams,
  me as getSafeFormData,
  ve as getUniqueValues,
  Se as getUniqueValuesSorted,
  ie as getValueByPath,
  we as groupByNested,
  Ne as hasOwnProperty,
  fe as hydrateElement,
  Me as initApp,
  O as normalizeNFD,
  b as pubSub,
  Y as registerComponent,
  H as registerIcons,
  C as resolveBindingValue,
  pe as setupFocusTrap,
  Ie as storage,
  _e as toDate,
  Oe as toMap,
  Le as toSet,
  oe as useState,
  Te as where
};

//# sourceMappingURL=vanilla-reactive.es.js.map