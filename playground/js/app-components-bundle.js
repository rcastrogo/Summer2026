// Auto-generated bundle - Do not edit manually
// Generated: 2026-06-15T19:02:29.791Z
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  class CollapsibleComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
    }
    init(ctx) {
      super.init(ctx);
      this.setState({
        expanded: this.props.expanded === "true" || false,
        title: this.props.title || "Texto por defecto"
      });
    }
    toggle() {
      console.log(this.children.length);
      this.state.expanded = !this.state.expanded;
    }
    render(changedProp) {
      if (changedProp && this.element) {
        this.updateBindings();
        return this.element;
      }
      const template = `
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
          <button 
            on-click="toggle"
            class="flex w-full items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-slate-50 focus:outline-none dark:hover:bg-slate-800/50"
          >
            <div class="flex items-center gap-3">            
              <span class="font-semibold text-slate-700 dark:text-slate-200">
                {state.title}
              </span>
            </div>
            <span data-bind="show:state.expanded"><i data-icon="chevron-up" class="size-9"></i></span>
            <span data-bind="hide:state.expanded"><i data-icon="chevron-down" class="size-9"></i></span>
          </button>
          <div 
            data-each="child in children" 
            data-bind="toggle.hidden:state.expanded | not"
            class="animate-fade-in border-t border-slate-100
              bg-slate-50/30 p-4 text-slate-600
              dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
          >
          </div>
          @if(state.expanded)    
          @endif    
          @if(state.expanded === false) 
          @endif    
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  registerComponent("collapsible-component", CollapsibleComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  class HeaderComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
    }
    init(value) {
      super.init(value);
    }
    render() {
      return buildAndInterpolate(`
        <div class="bg-background flex-cols justify-center">
          <a href="index.html">
            <image src="images/logo.png" alt="Logo" class="m-2 w-full object-contain">
          </a>
          <div class="w-full flex items-center gap-2">
            <div class="flex-1">
              <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100">VanillaReactive</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Framework reactivo ligero sin dependencias
              </p>  
            </div>
            <div data-component="clock-component" class=""></div>
            <div data-component="theme-toggle-component" class=""></div> 
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <div 
              on-publish="notification::html"
              class="text-sm text-gray-600 dark:text-gray-300 p-2"
            </div>
          </div>
        </div>
      `, this);
    }
  }
  registerComponent("header-component", HeaderComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  class LanguageSelectorComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.availableLangs = ["es", "en"];
    }
    get _i18n() {
      return window.APP_CONFIG && window.APP_CONFIG.i18n || null;
    }
    get current() {
      const lang = this._i18n ? this._i18n.currentLng : "es";
      return {
        lang,
        label: `language.${lang}`
      };
    }
    toggleMenu() {
      this.state.isMenuOpen = !this.state.isMenuOpen;
    }
    changeLanguage(_el, _e, newLang) {
      if (this._i18n) this._i18n.setLang(newLang);
      this.state.isMenuOpen = false;
    }
    translate(lang) {
      if (this._i18n) return this._i18n.t(`language.${lang}`, {});
      return lang;
    }
    init() {
      if (this._i18n) {
        this.addCleanup(
          this._i18n.changed(() => this.invalidate())
        );
      }
      super.setState({ isMenuOpen: false });
    }
    render() {
      const template = `
        <div class="relative inline-block text-left">
          <button 
            on-click="toggleMenu"
            class="app-button flex items-center gap-2 px-3 py-2 rounded-md transition-colors">
            <span class="size-4 hidden lg:block">
              <i data-icon="globe" class="size-5"></i>
            </span>     
            <span class="text-sm block lg:hidden uppercase">{ current.lang }</span>
            <span class="text-sm hidden lg:block">{ current.label | t }</span>          
            <span class="size-4 opacity-50">
              @if(state.isMenuOpen)<i data-icon="chevron-up" class="size-5"></i>@endif
              @if(!state.isMenuOpen)<i data-icon="chevron-down" class="size-5"></i>@endif
            </span>
          </button>
          @if(state.isMenuOpen)
            <div class="absolute right-0 z-50 mt-2 min-w-30 
              overflow-hidden rounded-md border bg-popover p-1 
              shadow-lg animate-in fade-in zoom-in-95">
              <div 
                data-each="lang in availableLangs" 
                class="pt-1"
              >
                <button 
                  on-click="changeLanguage:{lang}:@lang"
                  class="relative flex w-full cursor-pointer select-none 
                    items-center justify-center rounded-sm px-2 py-1.5 mb-1 text-sm 
                    border-none outline-none focus:ring-2 transition-colors hover:bg-accent 
                    @if(current.lang === lang) bg-accent text-accent-foreground @endif
                  "
                >
                  <span class="text-sm block lg:hidden uppercase">{ lang }</span>
                  <span class="text-sm hidden lg:block">
                    {lang | translate}
                  </span>
                </button>
              </div>
            </div>
          @endif
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  registerComponent("language-selector-component", LanguageSelectorComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    pubSub,
    registerComponent
  } = VanillaReactive;
  class LoaderComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
    }
    init() {
      this.setState({
        showLoader: false,
        message: "Cargando..."
      });
      const msgs = window.APP_CONFIG && window.APP_CONFIG.messages || {};
      const httpClient = msgs.httpClient || {};
      const router = msgs.router || {};
      this.addCleanup([
        pubSub.subscribe(httpClient.loading || "httpClient.loading", () => this.state.showLoader = true),
        pubSub.subscribe(httpClient.loaded || "httpClient.loaded", () => this.state.showLoader = false),
        pubSub.subscribe(router.loading || "router.loading", () => this.state.showLoader = true),
        pubSub.subscribe(router.loaded || "router.loaded", () => this.state.showLoader = false),
        pubSub.subscribe(router.error || "router.error", () => this.state.showLoader = false)
      ]);
    }
    render() {
      const template = `
        @if(showLoader)
          <div class="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-gray-900/60 backdrop-blur-sm">
            <div class="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <span class="mt-4 text-lg font-medium text-white tracking-wide">{message}</span>
          </div>
        @endif
      `;
      return buildAndInterpolate(template, this.state, false);
    }
  }
  registerComponent("loader-component", LoaderComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  class LogoComponent extends BaseComponent {
    init(ctx) {
      super.init(ctx);
    }
    render() {
      const template = `
        <div route-to="/" class="cursor-pointer flex items-center gap-2 text-2xl justify-center">
          <div class="p-2 bg-indigo-500 rounded-lg">
            <i data-icon="zap" class="size-5 text-white"></i>
          </div>
          <div class="flex flex-col items-start gap-0.5">
            <div class="font-black tracking-tighter text-slate-800 dark:text-white">
              VanillaApp<span class="text-indigo-500">2026</span>
            </div>
            @if(children.length)
              <div class="text-xs text-gray-800 dark:text-gray-200">{parent.textContent}</div>          
            @endif
          </div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  registerComponent("logo-component", LogoComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  const { $, setupFocusTrap } = VanillaReactive.dom;
  const { hydrateIcons } = VanillaReactive.hydrate;
  const FloatingPortal = window.FloatingPortal;
  class MenuTriggerComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.items = [];
      this.portal = null;
      this.triggerEl = null;
      this.childEntries = [];
      this.handleTriggerClick = () => this.open();
      this.handleKeyDown = (e) => this.onTriggerKeyDown(e);
    }
    init(ctx) {
      super.init(ctx);
      this.items = this.resolveItems();
      this.setState({ isOpen: false });
    }
    mounted() {
      this.triggerEl = this.element?.querySelector("[data-menu-trigger]") ?? this.element?.firstElementChild ?? null;
      if (!this.triggerEl) return;
      if (!["BUTTON", "A"].includes(this.triggerEl.tagName)) {
        this.triggerEl.setAttribute("tabindex", "0");
        this.triggerEl.setAttribute("role", "button");
      }
      this.triggerEl.addEventListener("click", this.handleTriggerClick);
      this.triggerEl.addEventListener("keydown", this.handleKeyDown);
      this.addCleanup(() => {
        this.triggerEl?.removeEventListener("click", this.handleTriggerClick);
        this.triggerEl?.removeEventListener("keydown", this.handleKeyDown);
      });
    }
    destroy() {
      this.closeAllChildren();
      this.portal?.close();
      super.destroy();
    }
    setItems(items) {
      this.items = items;
    }
    resolveItems() {
      const key = this.props.items;
      if (!key) return [];
      const raw = this.ctx?.[key] ?? window[key];
      return Array.isArray(raw) ? raw : [];
    }
    open() {
      if (this.state.isOpen || !this.triggerEl) return;
      this.state.isOpen = true;
      const menuEl = hydrateIcons(this.buildMenu(this.items));
      this.portal = new FloatingPortal(this.triggerEl, menuEl, {
        onClose: () => this.close()
      });
      this.portal.open();
      requestAnimationFrame(() => {
        menuEl.querySelector('[role="menuitem"]:not([aria-disabled="true"])')?.focus();
      });
    }
    close() {
      if (!this.state.isOpen) return;
      this.state.isOpen = false;
      this.closeAllChildren();
      this.portal?.close();
      this.portal = null;
      this.triggerEl?.focus();
    }
    closeAllChildren() {
      this.closeChildrenFrom(0);
    }
    closeChildrenFrom(startIndex) {
      const toClose = this.childEntries.splice(startIndex);
      for (const { portal, contentEl, anchorEl, cleanup } of toClose) {
        cleanup?.();
        this.portal?.removeAssociatedElement(contentEl);
        for (const entry of this.childEntries) {
          entry.portal.removeAssociatedElement(contentEl);
        }
        anchorEl.setAttribute("aria-expanded", "false");
        portal.close();
      }
    }
    registerChildElement(contentEl) {
      this.portal?.addAssociatedElement(contentEl);
      for (const entry of this.childEntries) {
        entry.portal.addAssociatedElement(contentEl);
      }
    }
    onTriggerKeyDown(e) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        this.open();
      }
    }
    /* ──────────────────────────────── Menu builder ──────────── */
    buildMenu(items) {
      const menuEl = document.createElement("div");
      menuEl.setAttribute("role", "menu");
      menuEl.className = "p-1 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-600 shadow-xl min-w-44";
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.separator) {
          const sep = document.createElement("div");
          sep.className = "my-1 border-t border-slate-200 dark:border-slate-700";
          menuEl.appendChild(sep);
        }
        const btn = document.createElement("button");
        btn.setAttribute("role", "menuitem");
        btn.type = "button";
        btn.dataset.index = String(i);
        const hasSubmenu = !!(item.children && item.children.length);
        const hasPopover = !!item.popover;
        if (item.disabled) {
          btn.disabled = true;
          btn.setAttribute("aria-disabled", "true");
        }
        if (hasSubmenu) {
          btn.setAttribute("aria-haspopup", "true");
          btn.setAttribute("aria-expanded", "false");
        }
        btn.className = [
          "flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded-lg",
          "text-slate-700 dark:text-slate-200",
          item.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-indigo-50 dark:hover:bg-indigo-900/40 cursor-pointer"
        ].join(" ");
        if (item.icon) {
          const icon = document.createElement("i");
          icon.setAttribute("data-icon", item.icon);
          icon.className = "inline-flex size-4 shrink-0";
          btn.appendChild(icon);
        }
        const labelSpan = document.createElement("span");
        labelSpan.className = "flex-1";
        labelSpan.textContent = item.label;
        btn.appendChild(labelSpan);
        if (hasSubmenu) {
          const chevron = document.createElement("i");
          chevron.setAttribute("data-icon", "chevron-right");
          chevron.className = "inline-flex size-3.5 shrink-0 opacity-50";
          btn.appendChild(chevron);
        } else if (hasPopover) {
          const indicator = document.createElement("i");
          indicator.setAttribute("data-icon", "more-horizontal");
          indicator.className = "inline-flex size-3.5 shrink-0 opacity-50";
          btn.appendChild(indicator);
        }
        menuEl.appendChild(btn);
      }
      hydrateIcons(menuEl);
      menuEl.addEventListener("keydown", (e) => this.onMenuKeyDown(e, menuEl, items));
      menuEl.addEventListener("click", (e) => this.onMenuItemClick(e, items));
      return menuEl;
    }
    /* ──────────────────────── Item click / activation ───────── */
    onMenuItemClick(e, items) {
      e.preventDefault();
      const btn = e.target.closest('[role="menuitem"]');
      if (!btn || btn.disabled) return;
      const idx = Number(btn.dataset.index);
      const item = items[idx];
      if (!item) return;
      if (item.children?.length) {
        this.openSubmenu(btn, item.children);
        return;
      }
      if (item.popover) {
        this.openItemPopover(btn, item);
        return;
      }
      item.action?.();
      this.close();
    }
    /* ──────────────────────── Sub-menu logic ────────────────── */
    openSubmenu(anchorBtn, children) {
      const parentIndex = this.childEntries.findIndex(({ contentEl }) => contentEl.contains(anchorBtn));
      this.closeChildrenFrom(parentIndex + 1);
      anchorBtn.setAttribute("aria-expanded", "true");
      const subMenu = this.buildMenu(children);
      this.registerChildElement(subMenu);
      const subPortal = new FloatingPortal(anchorBtn, subMenu, {
        placement: "right-start",
        offset: 2,
        onClose: () => {
          const idx = this.childEntries.findIndex((e) => e.portal === subPortal);
          if (idx !== -1) this.closeChildrenFrom(idx);
        }
      });
      this.childEntries.push({ portal: subPortal, contentEl: subMenu, anchorEl: anchorBtn });
      subPortal.open();
      requestAnimationFrame(() => {
        subMenu.querySelector('[role="menuitem"]:not([aria-disabled="true"])')?.focus();
      });
    }
    /* ──────────────────────── Popover logic ─────────────────── */
    openItemPopover(anchorBtn, item) {
      const parentIndex = this.childEntries.findIndex(({ contentEl }) => contentEl.contains(anchorBtn));
      this.closeChildrenFrom(parentIndex + 1);
      let content;
      if (typeof item.popover === "function") {
        content = item.popover();
      } else {
        const wrapper = document.createElement("div");
        wrapper.className = "p-4 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-2xl min-w-56 max-w-sm";
        wrapper.innerHTML = item.popover;
        content = wrapper;
      }
      this.registerChildElement(content);
      const popPortal = new FloatingPortal(anchorBtn, content, {
        placement: "right-start",
        offset: 4,
        onClose: () => {
          const idx = this.childEntries.findIndex((e) => e.portal === popPortal);
          if (idx !== -1) this.closeChildrenFrom(idx);
        }
      });
      this.childEntries.push({ portal: popPortal, contentEl: content, anchorEl: anchorBtn });
      popPortal.open();
      content.setAttribute("tabindex", "-1");
      const onPopoverKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          const idx = this.childEntries.findIndex((entry) => entry.portal === popPortal);
          if (idx !== -1) {
            const { anchorEl } = this.childEntries[idx];
            this.closeChildrenFrom(idx);
            anchorEl?.focus();
          }
        }
      };
      content.addEventListener("keydown", onPopoverKeyDown);
      requestAnimationFrame(() => {
        const releaseTrap = setupFocusTrap(content);
        if (!content.contains(document.activeElement)) content.focus();
        const entryIdx = this.childEntries.findIndex((entry) => entry.portal === popPortal);
        if (entryIdx !== -1) {
          this.childEntries[entryIdx].cleanup = () => {
            content.removeEventListener("keydown", onPopoverKeyDown);
            releaseTrap?.();
          };
        }
      });
    }
    /* ──────────────────────── Keyboard navigation ──────────── */
    onMenuKeyDown(e, wrapper, items) {
      const focusable = $('[role="menuitem"]:not([aria-disabled="true"])', wrapper).all();
      const current = document.activeElement;
      const idx = focusable.indexOf(current);
      switch (e.key) {
        case "Tab":
          e.preventDefault();
          this.close();
          break;
        case "ArrowDown":
          e.preventDefault();
          focusable[(idx + 1) % focusable.length]?.focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          focusable[(idx - 1 + focusable.length) % focusable.length]?.focus();
          break;
        case "ArrowRight": {
          e.preventDefault();
          const itemIdx = Number(current?.dataset?.index);
          const item = items[itemIdx];
          if (item?.children?.length) this.openSubmenu(current, item.children);
          else if (item?.popover) this.openItemPopover(current, item);
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          const lvl = this.childEntries.findIndex(({ contentEl }) => contentEl === wrapper);
          if (lvl !== -1) {
            const { anchorEl } = this.childEntries[lvl];
            this.closeChildrenFrom(lvl);
            anchorEl?.focus();
          }
          break;
        }
        case "Home":
          e.preventDefault();
          focusable[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          focusable[focusable.length - 1]?.focus();
          break;
        case "Escape": {
          e.preventDefault();
          const escLvl = this.childEntries.findIndex(({ contentEl }) => contentEl === wrapper);
          if (escLvl !== -1) {
            const { anchorEl } = this.childEntries[escLvl];
            this.closeChildrenFrom(escLvl);
            anchorEl?.focus();
          } else {
            this.close();
          }
          break;
        }
      }
    }
    render(changedProp) {
      if (changedProp && this.element) {
        this.updateBindings();
        return this.element;
      }
      const template = `
        <div class="contents">
          <div data-each="child in children"></div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  registerComponent("menu-trigger-component", MenuTriggerComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  const { $ } = VanillaReactive.dom;
  const { pubSub } = VanillaReactive.services;
  const MESSAGES = window.APP_MESSAGES && window.APP_MESSAGES.app || {
    showNotification: "app-show-notification",
    closeNotification: "app-close-notification"
  };
  const POSITION_CLASS_MAP = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2"
  };
  let notificationId = 1;
  class NotificationPanel extends BaseComponent {
    constructor(ctx) {
      super(ctx);
    }
    init(ctx) {
      super.init(ctx);
      this.addCleanup([
        pubSub.subscribe(MESSAGES.showNotification, (payload) => payload && this.show(payload)),
        pubSub.subscribe(MESSAGES.closeNotification, (id) => id && this.close(id))
      ]);
    }
    render() {
      const position = this.props.position || "top-right";
      const positionClass = POSITION_CLASS_MAP[position] || POSITION_CLASS_MAP["top-right"];
      const template = `
        <div data-app-notification-panel="" class="fixed z-9999 w-96 max-w-[95dvw] flex flex-col gap-2 select-none ${positionClass}">
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
    show(payload) {
      let input;
      if (typeof payload === "string") {
        input = { message: payload, type: "" };
      } else if (payload && "message" in payload) {
        input = payload;
      } else if (payload && payload.args) {
        input = {
          type: payload.args[0] || "",
          message: payload.args[1],
          autoCloseMs: payload.args[2]
        };
      } else {
        return;
      }
      const notification = {
        id: notificationId++,
        message: input.message,
        autoCloseMs: input.autoCloseMs ?? 4e3,
        type: input.type || ""
      };
      if ((notification.autoCloseMs || 0) > 0) {
        setTimeout(() => this.close(notification.id), notification.autoCloseMs);
      }
      const instance = new Notification();
      instance.init({ data: notification });
      this.element?.append(instance.render());
    }
    close(id) {
      const toastId = typeof id === "number" ? id : id.args ? id.args[0] : id;
      const toast = $(`#toas-${toastId}`, this.element).one();
      if (toast) {
        toast.classList.add("opacity-0", "transition-opacity", "duration-300", "animate-slide-out-x");
        setTimeout(() => toast.remove(), 400);
      }
    }
  }
  class Notification extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.startX = 0;
      this.currentX = 0;
      this.swiping = false;
      this.notification = null;
    }
    init(ctx) {
      super.init(ctx);
      this.notification = ctx?.data;
    }
    resolveIcon(type) {
      if (type === "error") return "x";
      if (type === "info") return "info";
      if (type === "warning") return "warning";
      if (type === "success") return "check";
      return "";
    }
    render() {
      const icon = this.resolveIcon(this.notification.type || "");
      const template = `
        <div
          id="toas-{notification.id}"
          class="relative bg-white dark:bg-gray-800
                 border border-gray-300 dark:border-gray-700
                 rounded-lg shadow-lg p-4"
          style="touch-action: pan-y"
          on-pointerdown="onPointerDown"
          on-pointermove="onPointerMove"
          on-pointerup="onPointerUp"
          on-pointercancel="onPointerUp"
        >
          <button
            data-close-btn
            on-click="publish:app-close-notification:global:@notification.id"
            class="
              group absolute top-3 right-3 w-8 h-8 flex items-center justify-center
              rounded-md
              text-slate-500 hover:text-slate-900
              hover:bg-slate-100
              dark:text-slate-400 dark:hover:text-white
              dark:hover:bg-slate-900
            "
            aria-label="Close notification"
          >
            <i data-icon="x" class="size-5 shrink-0"></i>
          </button>
          <div class="pr-8 flex items-start gap-3 text-sm text-gray-800 dark:text-gray-200">
            @if(notification.type)
              <i data-icon="${icon}" class="size-6 shrink-0"></i>
            @endif
            <div class="w-full wrap-break-word whitespace-pre-wrap">{notification.message | asParagraph}</div>
          </div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
    onPointerDown(el, ev) {
      if (ev.target instanceof Element && ev.target.closest("[data-close-btn]")) return;
      this.startX = ev.clientX;
      this.swiping = true;
      el.setPointerCapture(ev.pointerId);
    }
    onPointerMove(el, ev) {
      if (!this.swiping) return;
      const delta = ev.clientX - this.startX;
      const offsetX = Math.max(-300, Math.min(300, delta));
      this.currentX = offsetX;
      el.style.transform = `translateX(${offsetX}px)`;
    }
    onPointerUp(el) {
      if (!this.swiping) return;
      this.swiping = false;
      const threshold = 100;
      const abs = Math.abs(this.currentX);
      if (abs > threshold) {
        const direction = this.currentX > 0 ? "right" : "left";
        this.animateSwipeClose(el, direction);
      } else {
        el.style.transition = "transform 0.2s ease";
        el.style.transform = "translateX(0)";
      }
    }
    animateSwipeClose(el, direction) {
      el.style.setProperty("--target", direction === "right" ? "100vw" : "-100vw");
      el.style.setProperty("--offset", `${this.currentX}px`);
      el.classList.add("animate-slide-out-x");
      setTimeout(() => {
        pubSub.publish(MESSAGES.closeNotification, this.notification.id);
      }, 200);
    }
    asParagraph(text) {
      const lines = (text || "").split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
      if (lines.length === 0) return "";
      if (lines.length === 1) return lines[0];
      return lines.map((line) => `<p class="indent-2">${line}</p>`).join("");
    }
  }
  registerComponent("app-notification-panel", NotificationPanel);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const { BaseComponent, buildAndInterpolate, registerComponent } = VanillaReactive;
  const { $ } = VanillaReactive.dom;
  const { getValue } = VanillaReactive.template;
  const FloatingPortal = window.FloatingPortal;
  class OverflowToolbarComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.portal = null;
      this.portalOpen = false;
      this.overflowItems = [];
      this.resizeObserver = null;
      this.rafId = 0;
      this.actions = null;
    }
    init(ctx) {
      super.init(ctx);
      let actions = [];
      try {
        actions = this.actions || this.resolveDataSource() || [];
      } catch {
      }
      this.setState({ actions });
    }
    resolveDataSource() {
      const key = this.props.actions;
      if (!key) return [];
      return getValue(key, this.ctx);
    }
    clickAction(_el, _ev, actionId) {
      const actions = this.state.actions;
      const action = actions.find((a) => a.id === actionId);
      if (!action || action.disabled) return;
      if (this.actionclick) this.actionclick(action);
      if (this.portalOpen) this.closeOverflow();
    }
    toggleOverflow() {
      if (this.portalOpen) {
        this.closeOverflow();
      } else {
        this.openOverflow();
      }
    }
    openOverflow() {
      if (this.portalOpen || !this.overflowItems.length) return;
      const triggerEl = $("[data-overflow-trigger]", this.element).one();
      if (!triggerEl) return;
      const dropdownTemplate = `
        <div class="min-w-40 p-1 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-2xl">
          <div data-each="action in overflowItems" class="contents">
            <button
              title="{action.tooltip | default : @action.label}"
              on-click="clickAction:{action.id}"
              class="flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded-md transition-colors
                     @if(action.disabled) opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-500 @endif
                     @if(!action.disabled) text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer @endif"
            >
              @if(action.icon)
                <i data-icon="{action.icon}" class="size-4 shrink-0"></i>
              @endif
              <span>{action.label}</span>
            </button>
          </div>
        </div>
      `;
      const content = buildAndInterpolate(dropdownTemplate, { ...this, overflowItems: this.overflowItems });
      this.portal = new FloatingPortal(triggerEl, content, { onClose: () => this.closeOverflow() });
      this.portalOpen = true;
      this.portal.open();
    }
    closeOverflow() {
      if (!this.portalOpen) return;
      this.portalOpen = false;
      if (this.portal) {
        this.portal.close();
        this.portal = null;
      }
    }
    updateOverflowLayout() {
      if (!this.element) return;
      this.closeOverflow();
      const actionBtns = $("[data-action-btn]", this.element).all();
      const moreBtn = $("[data-overflow-trigger]", this.element).one();
      actionBtns.forEach((btn) => btn.style.display = "");
      if (moreBtn) moreBtn.style.display = "none";
      const containerWidth = this.element.offsetWidth;
      const totalWidth = actionBtns.reduce((acc, btn) => acc + btn.offsetWidth + 4, 0);
      if (totalWidth <= containerWidth) {
        this.overflowItems = [];
        return;
      }
      if (moreBtn) moreBtn.style.display = "flex";
      const moreBtnWidth = moreBtn ? moreBtn.offsetWidth + 4 : 44;
      if (moreBtn) moreBtn.style.display = "none";
      let usedWidth = moreBtnWidth;
      let visibleCount = 0;
      for (const btn of actionBtns) {
        const btnWidth = btn.offsetWidth + 4;
        if (usedWidth + btnWidth <= containerWidth) {
          usedWidth += btnWidth;
          visibleCount++;
        } else {
          break;
        }
      }
      actionBtns.slice(visibleCount).forEach((btn) => btn.style.display = "none");
      this.overflowItems = this.state.actions.slice(visibleCount);
      if (moreBtn) moreBtn.style.display = "flex";
    }
    mounted() {
      if (!this.element) return;
      if (this.resizeObserver) this.resizeObserver.disconnect();
      this.resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => this.updateOverflowLayout());
      });
      this.resizeObserver.observe(this.element);
      this.addCleanup(() => {
        cancelAnimationFrame(this.rafId);
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
          this.resizeObserver = null;
        }
      });
      requestAnimationFrame(() => this.updateOverflowLayout());
    }
    destroy() {
      this.closeOverflow();
      super.destroy();
    }
    render(changedProp) {
      if (changedProp && this.element) {
        this.updateBindings();
        return this.element;
      }
      const actions = this.state.actions || [];
      const template = `
        <div class="flex items-center gap-1 overflow-hidden w-full">
          <div data-each="action in actions" class="contents">
            <button
              data-action-btn="{action.id}"
              title="{action.tooltip | default : @action.label}"
              on-click="clickAction:{action.id}"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap shrink-0 transition-colors
                     @if(action.disabled)
                       opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-500
                     @endif
                     @if(!action.disabled)
                       text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer
                     @endif"
            >
              @if(action.icon)
                <i data-icon="{action.icon}" class="size-4 shrink-0"></i>
              @endif
              <span>{action.label}</span>
            </button>
          </div>
          <button
            data-overflow-trigger
            title="Más opciones"
            on-click="toggleOverflow"
            style="display: none"
            class="flex items-center justify-center gap-1 px-2 py-1.5 rounded-md shrink-0
                   text-slate-600 dark:text-slate-400
                   hover:bg-slate-100 dark:hover:bg-slate-700
                   transition-colors"
          >
            <i data-icon="more-horizontal" class="size-4"></i>
          </button>
        </div>
      `;
      return buildAndInterpolate(template, { ...this, actions });
    }
  }
  registerComponent("app-overflow-toolbar", OverflowToolbarComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  const { getValue } = VanillaReactive.template;
  const EXAMPLE_CONTEXT = {
    id: 123,
    isActive: true,
    isLoading: false,
    isError: true,
    status: "1",
    statusOff: "0",
    name: "Ana Maria",
    role: "ADMIN",
    city: "Madrid",
    count: 42,
    amount: 1234.56,
    numericText: "0042",
    badNumber: "abc",
    emptyText: "",
    nullText: null,
    htmlInput: `<img src=x onerror=alert('xss')><b>Safe?</b>`,
    phrase: "hola-mundo-desde-vanilla",
    longText: "Este es un texto largo para probar truncate en distintos escenarios de interfaz de usuario.",
    clock: "10:20:30",
    apiUrl: "https://api.example.com:443/v1/users:active",
    list: ["alpha", "beta", "gamma"],
    numbers: [3, 7, 21],
    user: {
      firstName: "Ana",
      lastName: "Maria",
      bio: "Frontend developer enfocada en accesibilidad y performance."
    },
    settings: {
      darkMode: true,
      language: "es",
      density: "compact"
    },
    language: {
      es: "Español",
      en: "English"
    },
    lang: "es",
    i18nKeyLoadCounter: "ui.actions.loadCounter",
    i18nKeyInterpolate: "ui.actions.interpolate"
  };
  const DEFAULT_CONTEXT = JSON.stringify(EXAMPLE_CONTEXT, null, 2);
  const DEFAULT_EXPRESSION = "name | upper";
  const PIPE_EXAMPLES = [
    { id: 1, title: "if: clase cuando true", expression: `isActive | if : 'bg-green-500'`, category: "ui" },
    { id: 2, title: "if: vacio cuando false", expression: `isLoading | if : 'bg-green-500'`, category: "ui" },
    { id: 3, title: "show: visible", expression: "isActive | show", category: "ui" },
    { id: 4, title: "show: oculto", expression: "isLoading | show", category: "ui" },
    { id: 5, title: "hide: oculto cuando true", expression: "isError | hide", category: "ui" },
    { id: 6, title: "hide: visible cuando false", expression: "isLoading | hide", category: "ui" },
    { id: 7, title: "iif: estado activo", expression: `status | iif : 'Activo' : 'Inactivo'`, category: "ui" },
    { id: 8, title: "iif: estado apagado", expression: `statusOff | iif : 'Encendido' : 'Apagado'`, category: "ui" },
    { id: 9, title: "upper", expression: "name | upper", category: "text" },
    { id: 10, title: "lower", expression: "role | lower", category: "text" },
    { id: 11, title: "replace simple", expression: `phrase | replace : '-' : ' '`, category: "text" },
    { id: 12, title: "replace con colon", expression: `clock | replace : ':' : '-'`, category: "text" },
    { id: 13, title: "truncate default", expression: "longText | truncate : 30", category: "text" },
    { id: 14, title: "truncate sufijo custom", expression: `longText | truncate : 45 : '... [ver mas]'`, category: "text" },
    { id: 15, title: "undefined fallback", expression: "missing.path | undefined", category: "text" },
    { id: 16, title: "default por vacio", expression: `emptyText | default : 'Texto por defecto'`, category: "text" },
    { id: 17, title: "default por null", expression: `nullText | default : 'Sin contenido'`, category: "text" },
    { id: 18, title: "safeHTML", expression: "htmlInput | safeHTML", category: "text" },
    { id: 19, title: "cadena upper + truncate", expression: `user.bio | upper | truncate : 36 : '...'`, category: "text" },
    { id: 20, title: "path interpolado", expression: "language.{lang}", category: "text" },
    { id: 21, title: "toString numero", expression: "amount | toString", category: "numbers" },
    { id: 22, title: "toNumber valido", expression: "numericText | toNumber", category: "numbers" },
    { id: 23, title: "toNumber invalido", expression: "badNumber | toNumber", category: "numbers" },
    { id: 24, title: "equal true", expression: `role | equal : 'ADMIN'`, category: "numbers" },
    { id: 25, title: "equal false", expression: `city | equal : 'Barcelona'`, category: "numbers" },
    { id: 26, title: "not true -> false", expression: "isActive | not", category: "numbers" },
    { id: 27, title: "not vacio -> true", expression: "emptyText | not", category: "numbers" },
    { id: 28, title: "join lista con coma", expression: `list | join : ', '`, category: "data" },
    { id: 29, title: "join numeros con barra", expression: `numbers | join : ' | '`, category: "data" },
    { id: 30, title: "includes string true", expression: `phrase | includes : 'mundo'`, category: "data" },
    { id: 31, title: "includes array true", expression: `list | includes : 'beta'`, category: "data" },
    { id: 32, title: "length string", expression: "phrase | length", category: "data" },
    { id: 33, title: "length array", expression: "list | length", category: "data" },
    { id: 34, title: "length object", expression: "settings | length", category: "data" },
    { id: 35, title: "traduccion key dinamica", expression: "i18nKeyLoadCounter | t", category: "debug" },
    { id: 36, title: "traduccion literal", expression: `i18nKeyInterpolate | t : @phrase : Literal 333`, category: "debug" },
    { id: 37, title: "debug (ver consola)", expression: "user | debug", category: "debug" },
    { id: 38, title: "replace URL con colon quoted", expression: `apiUrl | replace : 'https://': 'http://'`, category: "debug" }
  ];
  class PipeTesterComponent extends BaseComponent {
    init(ctx) {
      super.init(ctx);
      this.setState({
        contextText: DEFAULT_CONTEXT,
        expressionText: DEFAULT_EXPRESSION,
        result: "",
        raw: "",
        error: "",
        selectedExampleId: 1
      });
    }
    mounted() {
      this.runTest();
    }
    getContextTextarea() {
      return this.element?.querySelector("[data-ctx-input]") ?? null;
    }
    getExpressionInput() {
      return this.element?.querySelector("[data-expr-input]") ?? null;
    }
    setInputs(contextText, expressionText) {
      const ctx = this.getContextTextarea();
      const expr = this.getExpressionInput();
      if (ctx) ctx.value = contextText;
      if (expr) expr.value = expressionText;
    }
    formatResult(value) {
      if (value === void 0) return "(undefined)";
      if (value === null) return "(null)";
      if (typeof value === "string") return value;
      if (typeof value === "number" || typeof value === "boolean") return String(value);
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    runTest() {
      const ctxRaw = this.getContextTextarea()?.value ?? "{}";
      const expr = this.getExpressionInput()?.value?.trim() ?? "";
      this.state.contextText = ctxRaw;
      this.state.expressionText = expr;
      let ctx;
      try {
        ctx = JSON.parse(ctxRaw);
      } catch {
        this.state.error = "❌ JSON inválido en el contexto";
        this.state.result = "";
        return;
      }
      try {
        const prop = expr.split("|")[0].trim();
        const raw = getValue(prop, ctx);
        const result = getValue(expr, ctx);
        this.state.result = this.formatResult(result);
        this.state.raw = `${prop}: ${this.formatResult(raw)}`;
        this.state.error = "";
      } catch (e) {
        this.state.error = `❌ Error al evaluar: ${String(e)}`;
        this.state.result = "";
      }
    }
    runExample(_el, _e, id) {
      const numericId = Number(id);
      const example = PIPE_EXAMPLES.find((item) => item.id === numericId);
      if (!example) return;
      this.state.selectedExampleId = example.id;
      this.state.contextText = DEFAULT_CONTEXT;
      this.state.expressionText = example.expression;
      this.setInputs(this.state.contextText, this.state.expressionText);
      this.runTest();
    }
    clearAll() {
      this.state.contextText = DEFAULT_CONTEXT;
      this.state.expressionText = DEFAULT_EXPRESSION;
      this.setInputs(this.state.contextText, this.state.expressionText);
      this.state.result = "";
      this.state.raw = "";
      this.state.error = "";
      this.state.selectedExampleId = 1;
      this.runTest();
    }
    render(changedProp) {
      if (changedProp && this.element) {
        this.updateBindings();
        return this.element;
      }
      const template = `
        <div class="flex flex-col gap-3 w-full mx-auto">
          <div class="flex flex-col xl:flex-row gap-3 items-start">
            <div class="w-full xl:w-[62%] flex flex-col gap-4">

              <!-- Contexto JSON -->
              <div class="flex flex-col gap-2 flex-1 min-w-0">
                <div
                  data-component="collapsible-component"
                  data-title="Contexto (JSON)"
                  data-expanded="true"
                >
                  <textarea
                    data-ctx-input
                    rows="10"
                    spellcheck="false"
                    on-input="runTest"
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-600
                          bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
                      font-mono p-3 min-h-65
                          focus:outline-none resize-none focus:ring-2 focus:ring-indigo-400"
                  >{state.contextText}</textarea>                
                </div>
              </div>

              <!-- Expresión + resultado -->
              <div class="flex flex-col gap-3 flex-1 min-w-0 rounded-lg 
                  bg-card
                  border border-slate-200 dark:border-slate-700 p-3">
                <!-- Error -->
                <div
                  class="rounded-lg border border-red-200 dark:border-red-800 px-3 py-2 text-sm
                        text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950"
                  data-bind="show:state.error"
                  style="display:none"
                >
                  <span data-bind="text:state.error">{error}</span>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Expresión getValue()
                  </label>
                  <input
                    data-expr-input
                    type="text"
                    on-input="runTest"
                    spellcheck="false"
                    value="{state.expressionText}"
                    placeholder="ej: name | upper | t"
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-600
                          bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
                          font-mono text-sm px-3 py-2
                          focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <p class="text-xs text-slate-400 dark:text-slate-500">
                    Sintaxis: <code>propiedad | pipe : arg1 : 'arg con colons'</code>
                  </p>
                </div>

                <div class="text-xs text-slate-500 dark:text-slate-400">
                  Ejemplo activo: <span data-bind="text:state.selectedExampleId">1</span>
                </div>

                <!-- Resultado -->
                <div class="flex flex-col gap-1 mt-1">
                  <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Original (sin pipes)
                  </label>
                  <div class="rounded-lg border border-slate-200 dark:border-slate-700
                        bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-sm
                        text-emerald-600 dark:text-emerald-400 break-all">
                    <span data-bind="text:state.raw"></span>
                  </div>

                  <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Resultado
                  </label>
                  <div class="rounded-lg border border-slate-200 dark:border-slate-700
                        bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-sm
                        text-emerald-600 dark:text-emerald-400 break-all">
                    <span data-bind="text:state.result">{result}</span>
                  </div>

                  <!-- Acciones -->
                  <div class="flex gap-2 justify-end mt-2">
                    <button on-click="clearAll" class="app-button">
                      <i data-icon="trash" class="size-5 inline-flex"></i> Limpiar
                    </button>
                    <button on-click="runTest" class="app-button">
                      <i data-icon="zap" class="size-5 inline-flex"></i> Ejecutar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              data-component="collapsible-component"
              data-title="Ejemplos de Pipes"
              data-expanded="true"
              class="w-full xl:w-[38%]"
            >
              <div class="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Ejemplos de Pipes</h3>
                  <span class="text-xs text-slate-500 dark:text-slate-400">${PIPE_EXAMPLES.length} casos</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Pulsa un caso para cargar contexto + expresión y ejecutar la prueba automáticamente.
                </p>
                <div class="max-h-130 overflow-auto pr-1 space-y-2" data-each="example in examples">
                  <button
                    class="w-full text-left rounded-lg border border-slate-200 dark:border-slate-700
                          hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors p-2"
                    on-click="runExample:@example.id"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">#{example.id} {example.title}</span>
                      <span class="text-[10px] uppercase tracking-wide text-indigo-500">{example.category}</span>
                    </div>
                    <code class="block mt-1 text-[11px] text-slate-600 dark:text-slate-300 break-all">{example.expression}</code>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Referencia rápida de pipes -->
          <div
            data-component="collapsible-component"
            data-title="Referencia rápida de Pipes"
            data-expanded="false"
            class="w-full"
          >
            <div data-pipes-documentation class="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
              <div><code class="text-indigo-500">if</code> — CSS class si condición true: <code>active | if : 'bg-blue-500'</code></div>
              <div><code class="text-indigo-500">show</code> — display si true: <code>loading | show</code></div>
              <div><code class="text-indigo-500">hide</code> — display:none si true: <code>error | hide</code></div>
              <div><code class="text-indigo-500">iif</code> — ternario: <code>active | iif : 'Sí' : 'No'</code></div>
              <div><code class="text-indigo-500">toString</code> — convertir a texto: <code>amount | toString</code></div>
              <div><code class="text-indigo-500">toNumber</code> — convertir a número: <code>numericText | toNumber</code></div>
              <div><code class="text-indigo-500">equal</code> — comparar: <code>role | equal : 'ADMIN'</code></div>
              <div><code class="text-indigo-500">join</code> — unir arrays: <code>list | join : ', '</code></div>
              <div><code class="text-indigo-500">upper</code> — mayúsculas: <code>name | upper</code></div>
              <div><code class="text-indigo-500">lower</code> — minúsculas: <code>name | lower</code></div>
              <div><code class="text-indigo-500">undefined</code> — fallback: <code>desc | undefined</code></div>
              <div><code class="text-indigo-500">not</code> — negación booleana: <code>isActive | not</code></div>
              <div><code class="text-indigo-500">includes</code> — contiene valor: <code>list | includes : 'beta'</code></div>
              <div><code class="text-indigo-500">length</code> — longitud: <code>list | length</code></div>
              <div><code class="text-indigo-500">default</code> — fallback configurable: <code>value | default : 'N/A'</code></div>
              <div><code class="text-indigo-500">replace</code> — reemplazo: <code>clock | replace : ':' : '-'</code></div>
              <div><code class="text-indigo-500">truncate</code> — recortar texto: <code>bio | truncate : 30 : '...'</code></div>
              <div><code class="text-indigo-500">t</code> — traducción i18n: <code>'key' | t</code></div>
              <div><code class="text-indigo-500">debug</code> — log consola: <code>data | debug</code></div>
              <div><code class="text-indigo-500">safeHTML</code> — escapar HTML: <code>input | safeHTML</code></div>
              <div><code class="text-indigo-500">toJSON</code> — convertir a JSON: <code>input | toJSON</code></div>
            </div>
          </div>

        </div>
      `;
      return buildAndInterpolate(template, { ...this, examples: PIPE_EXAMPLES });
    }
  }
  registerComponent("pipe-tester-component", PipeTesterComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const { buildAndInterpolate, registerComponent } = VanillaReactive;
  function PolLoaderComponent() {
    return {
      size: "size-6",
      message: "Cargando",
      mode: "overlay",
      // 'inline' o 'overlay'
      init(ctx) {
        const props = ctx.parent?.dataset || {};
        this.message = props.message || "";
        this.mode = props.mode === "inline" ? "inline" : "overlay";
        this.size = props.size || this.size;
      },
      render() {
        const size = this.size;
        const message = this.message;
        const useOverlay = this.mode === "overlay";
        return useOverlay ? renderOverlay(message, size) : renderInline(message, size);
      }
    };
    function renderInline(message, size) {
      const template = `
        <div class="flex font-medium items-center justify-center @if(message.length)gap-2@endif">
          <div class="{size} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <div class="text-sm text-gray-500">{message}</div>
        </div>
      `;
      return buildAndInterpolate(template, { message, size });
    }
    function renderOverlay(message, size) {
      const template = `
        <div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 dark:bg-gray-700/20 backdrop-blur-xs">
          <div class="{size} animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <div class="mt-1 font-medium text-foreground tracking-wide">{message}</div>
        </div>
      `;
      return buildAndInterpolate(template, { message, size });
    }
  }
  registerComponent("app-pol-loader", PolLoaderComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const { buildAndInterpolate, registerComponent } = VanillaReactive;
  const { $ } = VanillaReactive.dom;
  const { storage } = VanillaReactive.state;
  const MIN_SIZE_PX = 80;
  const BASE_BAR_CLASSES = "shrink-0 select-none transition-colors hover:bg-blue-400 dark:hover:bg-blue-400";
  const H_CLASSES = BASE_BAR_CLASSES + " w-1.5 h-full cursor-col-resize border-l border-r border-slate-200 dark:border-slate-700";
  const V_CLASSES = BASE_BAR_CLASSES + " h-1.5 w-full cursor-row-resize border-t border-b border-slate-200 dark:border-slate-700";
  function PolSplitterComponent() {
    let root = null;
    let leftPanel = null;
    let storageKey = "";
    let mode = "horizontal";
    let leftContent = null;
    let rightContent = null;
    let minSize = MIN_SIZE_PX;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    return {
      init(ctx) {
        const props = ctx.parent?.dataset || {};
        storageKey = props.key || "";
        mode = props.mode === "vertical" ? "vertical" : "horizontal";
        minSize = Number(props.minSize) || MIN_SIZE_PX;
        if (ctx.parent) {
          leftContent = $("[data-slot-left]", ctx.parent).one();
          rightContent = $("[data-slot-right]", ctx.parent).one();
        }
      },
      destroy() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      },
      render() {
        const isVertical = mode === "vertical";
        const barClass = isVertical ? V_CLASSES : H_CLASSES;
        const template = `
          <div class="flex w-full overflow-hidden ${isVertical ? "flex-col" : "flex-row"}">
            <div data-splitter-left class="overflow-auto ${isVertical ? "w-full" : "w-2/5"}">
              <slot name="left"></slot>
            </div>
            <div
              data-splitter-bar
              on-dblclick="onDblClick"
              on-mousedown="onMouseDown"
              class="${barClass}">
            </div>
            <div data-splitter-right class="flex-1 overflow-auto">
              <slot name="right"></slot>
            </div>
          </div>
        `;
        root = buildAndInterpolate(
          template,
          {
            onDblClick,
            onMouseDown,
            slottedNodes: {
              right: [rightContent],
              left: [leftContent]
            }
          }
        );
        return root;
      },
      mounted() {
        leftPanel = $("[data-splitter-left]", root).one();
        if (storageKey) restoreState();
      }
    };
    function clamp(value, containerSize) {
      const max = containerSize - minSize;
      return Math.max(minSize, Math.min(value, max));
    }
    function saveState() {
      if (!storageKey) return;
      const size = mode === "vertical" ? leftPanel.style.height : leftPanel.style.width;
      storage.writeValue(`splitter-${storageKey}`, { mode, size });
    }
    function restoreState() {
      const saved = storage.readValue(`splitter-${storageKey}`);
      if (!saved) return;
      const bar = $("[data-splitter-bar]", root).one();
      if (saved.mode !== mode) {
        mode = saved.mode;
        if (mode === "vertical") {
          root.classList.replace("flex-row", "flex-col");
          leftPanel.style.width = "100%";
          if (bar) bar.className = V_CLASSES;
        } else {
          root.classList.replace("flex-col", "flex-row");
          leftPanel.style.height = "";
          if (bar) bar.className = H_CLASSES;
        }
      }
      if (saved.size) {
        if (mode === "vertical") {
          leftPanel.style.height = saved.size;
        } else {
          leftPanel.style.width = saved.size;
        }
      }
    }
    function onDblClick(bar) {
      mode = mode === "horizontal" ? "vertical" : "horizontal";
      if (mode === "vertical") {
        root.classList.replace("flex-row", "flex-col");
        leftPanel.style.width = "100%";
        leftPanel.style.height = "40%";
        bar.className = V_CLASSES;
      } else {
        root.classList.replace("flex-col", "flex-row");
        leftPanel.style.height = "";
        leftPanel.style.width = "40%";
        bar.className = H_CLASSES;
      }
      saveState();
    }
    function onMouseMove(e) {
      e.preventDefault();
      if (mode === "vertical") {
        const containerHeight = root.clientHeight;
        const newHeight = clamp(startHeight + (e.pageY - startY), containerHeight);
        leftPanel.style.height = `${newHeight}px`;
      } else {
        const containerWidth = root.clientWidth;
        const newWidth = clamp(startWidth + (e.pageX - startX), containerWidth);
        leftPanel.style.width = `${newWidth}px`;
      }
    }
    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      root.classList.remove("select-none");
      saveState();
    }
    function onMouseDown(_el, e) {
      startWidth = leftPanel.offsetWidth;
      startHeight = leftPanel.offsetHeight;
      startX = e.pageX;
      startY = e.pageY;
      root.classList.add("select-none");
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  }
  registerComponent("app-pol-splitter", PolSplitterComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  const { $, setupFocusTrap } = VanillaReactive.dom;
  const FloatingPortal = window.FloatingPortal;
  class PopoverTriggerComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.portal = null;
      this.triggerEl = null;
      this.contentEl = null;
      this.portalEl = null;
      this.closeTimeout = null;
      this.releaseFocusTrap = void 0;
      this.handleTriggerClick = () => this.toggle();
      this.handleMouseEnter = () => {
        if (this.closeTimeout) {
          clearTimeout(this.closeTimeout);
          this.closeTimeout = null;
        }
        if (!this.state.isOpen) this.open();
      };
      this.handleMouseLeave = () => this.scheduleClose();
      this.handleKeyDown = (e) => {
        if (e.key === "Escape" && this.state.isOpen) this.close();
      };
      this.clickInside = null;
      this.beforeOpen = null;
    }
    init(ctx) {
      super.init(ctx);
      this.setState({ isOpen: false });
    }
    get openMode() {
      const raw = (this.props.mode || this.props.trigger || "click").toLowerCase();
      return raw === "hover" ? "hover" : "click";
    }
    get isHoverMode() {
      return this.openMode === "hover";
    }
    scheduleClose() {
      if (this.closeTimeout) clearTimeout(this.closeTimeout);
      this.closeTimeout = setTimeout(() => {
        this.close();
      }, 150);
    }
    bindPortalHoverEvents(el) {
      this.portalEl = el;
      el.addEventListener("mouseenter", this.handleMouseEnter);
      el.addEventListener("mouseleave", this.handleMouseLeave);
    }
    unbindPortalHoverEvents() {
      if (!this.portalEl) return;
      this.portalEl.removeEventListener("mouseenter", this.handleMouseEnter);
      this.portalEl.removeEventListener("mouseleave", this.handleMouseLeave);
      this.portalEl = null;
    }
    mounted() {
      if (!this.element) return;
      this.triggerEl = $("[data-popover-trigger]", this.element).one();
      this.contentEl = $("[data-popover-content]", this.element).one();
      if (!this.triggerEl || !this.contentEl) {
        console.warn("PopoverTrigger: Faltan data-popover-trigger o data-popover-content");
        return;
      }
      this.contentEl.style.display = "none";
      if (this.isHoverMode) {
        this.triggerEl.addEventListener("mouseenter", this.handleMouseEnter);
        this.triggerEl.addEventListener("mouseleave", this.handleMouseLeave);
      } else {
        this.triggerEl.addEventListener("click", this.handleTriggerClick);
      }
      document.addEventListener("keydown", this.handleKeyDown);
      this.addCleanup(() => {
        this.triggerEl?.removeEventListener("click", this.handleTriggerClick);
        this.triggerEl?.removeEventListener("mouseenter", this.handleMouseEnter);
        this.triggerEl?.removeEventListener("mouseleave", this.handleMouseLeave);
        this.unbindPortalHoverEvents();
        if (this.closeTimeout) clearTimeout(this.closeTimeout);
        document.removeEventListener("keydown", this.handleKeyDown);
      });
    }
    destroy() {
      this.unbindPortalHoverEvents();
      if (this.closeTimeout) clearTimeout(this.closeTimeout);
      this.portal?.close();
      super.destroy();
    }
    toggle() {
      if (this.state.isOpen) this.close();
      else this.open();
    }
    open() {
      if (this.state.isOpen || !this.triggerEl || !this.contentEl) return;
      const template = `
        <div
          class="p-4 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-2xl">
          <div data-each="child in children"></div>
        </div>
      `;
      this.portal = new FloatingPortal(
        this.triggerEl,
        buildAndInterpolate(template, { children: [this.contentEl] }),
        {
          onClose: () => this.close(),
          onClickInside: (e) => {
            const shouldClose = this.clickInside?.(e);
            if (shouldClose) this.close();
          },
          onOpen: (el) => {
            if (this.isHoverMode) this.bindPortalHoverEvents(el);
            setTimeout(() => {
              this.beforeOpen?.(el);
            }, 0);
          },
          placement: this.props.placement || "",
          offset: this.props.offset ? parseInt(this.props.offset) : 4
        }
      );
      this.contentEl.style.display = "";
      this.state.isOpen = true;
      this.portal.open();
      if (!this.isHoverMode) {
        requestAnimationFrame(() => {
          const portalEl = this.portal?.getPortalElement();
          if (portalEl) this.releaseFocusTrap = setupFocusTrap(portalEl);
        });
      }
    }
    close() {
      if (!this.state.isOpen) return;
      this.releaseFocusTrap?.();
      this.releaseFocusTrap = void 0;
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      this.state.isOpen = false;
      this.unbindPortalHoverEvents();
      this.portal?.close();
      this.portal = null;
      if (!this.isHoverMode) this.triggerEl?.focus();
    }
    render(changedProp) {
      if (changedProp && this.element) {
        this.updateBindings();
        return this.element;
      }
      const template = `
        <div class="contents">
          <div data-each="child in children"></div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  registerComponent("popover-trigger-component", PopoverTriggerComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  class ProgressBarComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.progress = 0;
      this.intervalId = 0;
      this.running = true;
    }
    init(ctx) {
      super.init(ctx);
      this.initTimer();
    }
    initTimer() {
      const timeout = parseInt(this.props.intervalSpeed || "100");
      const increment = parseInt(this.props.increment || "5");
      this.intervalId = setInterval(() => {
        if (!this.running) return;
        if (this.progress >= 100)
          this.progress = 0;
        else
          this.progress = Math.min(100, this.progress + increment);
        if (this.element?.isConnected) this.invalidate();
      }, timeout);
      this.addCleanup(() => clearInterval(this.intervalId));
    }
    stop() {
      this.running = false;
      this.progress = 0;
      this.invalidate();
    }
    start() {
      this.running = true;
    }
    resolveProgressClasses() {
      if (this.props.changeColor !== "true" || this.props.progressBackground) {
        return this.props.progressBackground ?? "bg-blue-700 dark:bg-blue-800";
      }
      if (this.progress < 50) return "bg-green-500 dark:bg-green-500";
      if (this.progress < 80) return "bg-yellow-500 dark:bg-yellow-500";
      return "bg-red-500 dark:bg-red-500";
    }
    render() {
      const showPercentage = this.props.showPercentage === "true";
      const position = this.props.percentagePosition || "center";
      const percentageClasses = "text-[10px] font-light text-gray-700 dark:text-gray-300 whitespace-nowrap";
      const progressClasses = this.resolveProgressClasses();
      const template = `
        <div class="h-1 w-full flex text-center ${position === "center" ? "flex-col" : "items-center"}">     
          @if(${showPercentage && position === "left"})
            <span class="w-10 font-bold ${percentageClasses}">
              {progress}%
            </span>
          @endif
          <div class="flex-1 relative h-full">
            <div class="h-full w-full rounded-full border">
              <div 
                class="h-full rounded-full transition-all duration-100 ease-out ${progressClasses}" 
                style="width: {progress}%;"
              >
              </div>      
            </div>
            @if(${showPercentage && position === "center"})
              <div class="text-center absolute inset-0 flex items-center justify-center">
                <span class="font-bold ${this.progress < 50 ? "" : "text-white"} ${percentageClasses}">
                  {progress}%
                </span>
              </div>
            @endif          
          </div>
          @if(${showPercentage && position === "right"})
            <span class="w-10 font-bold ${percentageClasses}">
              {progress}%
            </span>
          @endif
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  class RedProgressBarComponent extends BaseComponent {
    init(ctx) {
      super.init(ctx);
    }
    render() {
      const message = this.props.message || "Loading...";
      const template = `        
        <div class="flex flex-col items-center gap-2 justify-center m-1">
          ${message}
          <div class="h-1 w-full overflow-hidden rounded-full bg-red-900 mb-1">
            <div
              class="h-full w-full origin-left animate-[progress_2.5s_infinite_linear] bg-gray-400">
            </div>
          </div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  registerComponent("progress-bar-component", ProgressBarComponent);
  registerComponent("red-progress-bar-component", RedProgressBarComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    registerComponent
  } = VanillaReactive;
  const { $, build } = VanillaReactive.dom;
  const { useState } = VanillaReactive.state;
  const VARIANT_STYLES = {
    underline: {
      base: ["border-b-2", "hover:text-indigo-500", "dark:hover:text-indigo-400"],
      active: ["border-indigo-500", "text-indigo-600", "dark:border-indigo-400", "dark:text-indigo-400"],
      inactive: ["border-transparent", "text-slate-400", "dark:text-slate-500"]
    },
    pills: {
      base: ["rounded-full", "border", "border-transparent", "mb-1", "mr-2"],
      active: ["bg-indigo-500", "text-white", "dark:bg-indigo-600"],
      inactive: ["bg-transparent", "text-slate-500", "hover:bg-slate-100", "dark:text-slate-400", "dark:hover:bg-slate-800"]
    },
    segmented: {
      base: ["border", "first:rounded-l-md", "last:rounded-r-md", "mb-1", "-ml-px", "dark:border-slate-700"],
      active: ["bg-blue-500", "text-white", "z-10", "dark:bg-blue-600"],
      inactive: ["bg-white", "text-slate-600", "hover:bg-slate-100", "dark:bg-slate-800", "dark:text-slate-400", "dark:hover:bg-slate-700"]
    },
    boxed: {
      base: ["px-4", "py-2", "text-sm", "font-medium", "border", "border-b-0", "rounded-t-md", "transition-colors"],
      active: ["bg-white", "text-indigo-600", "border-slate-300", "dark:bg-slate-900", "dark:text-indigo-400", "dark:border-slate-700"],
      inactive: ["bg-slate-50", "text-slate-500", "border-transparent", "hover:text-slate-700", "hover:bg-slate-100", "dark:bg-slate-800/50", "dark:text-slate-400", "dark:hover:text-slate-300", "dark:hover:bg-slate-800"]
    },
    lifted: {
      base: ["px-4", "py-2", "text-sm", "font-medium", "rounded-t-lg", "border-b-2", "transition-all"],
      active: ["bg-white", "text-indigo-700", "border-indigo-500", "shadow-sm", "dark:bg-slate-900", "dark:text-indigo-400", "dark:border-indigo-400"],
      inactive: ["bg-transparent", "text-slate-400", "border-transparent", "hover:text-slate-600", "dark:text-slate-500", "dark:hover:text-slate-300"]
    },
    soft: {
      base: ["rounded-lg", "mr-1", "mb-1"],
      active: ["bg-indigo-100", "text-indigo-700", "dark:bg-indigo-900/50", "dark:text-indigo-300"],
      inactive: ["text-slate-500", "hover:bg-slate-100", "hover:text-slate-700", "dark:text-slate-400", "dark:hover:bg-slate-800", "dark:hover:text-slate-300"]
    },
    outline: {
      base: ["rounded-md", "border", "mb-1", "mr-1"],
      active: ["border-indigo-500", "text-indigo-600", "bg-indigo-50", "dark:border-indigo-400", "dark:text-indigo-400", "dark:bg-indigo-900/30"],
      inactive: ["border-slate-200", "text-slate-500", "hover:border-slate-400", "hover:text-slate-700", "dark:border-slate-700", "dark:text-slate-400", "dark:hover:border-slate-500", "dark:hover:text-slate-300"]
    }
  };
  const VARIANTS = Object.keys(VARIANT_STYLES);
  class TabComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.slots = null;
      this.buttons = [];
      this.tabNodes = /* @__PURE__ */ new Map();
      this.setState(
        useState({
          tabs: [],
          activeTabId: "",
          variant: "default"
        })
      );
    }
    getTabDetail(tabId) {
      const tabs = this.state.store.tabs || [];
      const index = tabs.findIndex((tab2) => tab2.id === tabId);
      if (index < 0) return null;
      const tab = tabs[index];
      return { id: tab.id, title: tab.title || tab.alt || tab.id, index };
    }
    raiseTabChange(tabId) {
      const detail = this.getTabDetail(tabId);
      if (!detail) return;
      if (this.tabchange) this.tabchange(detail);
    }
    raiseTabClose(tabId) {
      const detail = this.getTabDetail(tabId);
      if (!detail) return;
      if (this.tabclose) this.tabclose(detail);
    }
    setActiveTab(tabId, emitEvent = true) {
      const nextTabId = tabId || "";
      const currentTabId = this.state.store.activeTabId || "";
      if (currentTabId === nextTabId) return;
      this.state.put("activeTabId", nextTabId);
      if (emitEvent && nextTabId) {
        this.raiseTabChange(nextTabId);
      }
    }
    init(ctx) {
      super.init(ctx);
      const parsedTabs = [];
      const targets = (this.children || []).filter((child) => child instanceof HTMLElement && child.dataset.id);
      targets.forEach((child, index) => {
        const id = child.dataset.id || `tab-${index}`;
        parsedTabs.push({
          id,
          title: child.dataset.title || "",
          icon: child.dataset.iconName || "",
          alt: child.dataset.alt || ""
        });
        this.tabNodes.set(id, child);
      });
      this.addCleanup(
        this.state.on("activeTabId", (newId) => this.updateVisuals(newId))
      );
      this.state.put("tabs", parsedTabs);
      this.state.put("variant", this.props.variant || "default");
      if (parsedTabs.length > 0) {
        this.state.put("activeTabId", this.props.selected || parsedTabs[0].id);
      }
    }
    selectTab(el) {
      this.setActiveTab(el.dataset.targetId || "");
    }
    setVariant(variant) {
      if (!VARIANTS.includes(variant)) return;
      this.state.put("variant", variant);
      this.updateVisuals(this.state.store.activeTabId);
    }
    cycleVariant() {
      const current = this.state.store.variant;
      const idx = VARIANTS.indexOf(current);
      const next = VARIANTS[(idx + 1) % VARIANTS.length];
      this.state.put("variant", next);
      this.updateVisuals(this.state.store.activeTabId);
    }
    addTab(tab, content, activate = true) {
      const tabs = this.state.store.tabs;
      if (tabs.some((t) => t.id === tab.id)) return;
      if (content) this.tabNodes.set(tab.id, content);
      this.slots = this.slots || [];
      const slot = build(
        "div",
        `<div id="tab-content-slot-${tab.id}" class="text-left text-slate-500 hidden"></div>`,
        true
      );
      if (content) slot.appendChild(content);
      const slotsContainer = $(".tabs-container", this.element).one();
      slotsContainer?.appendChild(slot);
      this.slots = [...this.slots, slot];
      const btn = buildAndInterpolate(this.button_template, { ...this, tab });
      const buttonsContainer = $(".butons-container", this.element).one();
      buttonsContainer?.appendChild(btn);
      this.buttons.push(btn);
      this.state.put("tabs", [...tabs, tab]);
      if (activate) this.setActiveTab(tab.id);
    }
    removeTab(tabId) {
      const tabs = this.state.store.tabs;
      const activeTabId = this.state.store.activeTabId;
      const filtered = tabs.filter((t) => t.id !== tabId);
      if (filtered.length === tabs.length) return;
      if (this.slots) {
        const id = `tab-content-slot-${tabId}`;
        const slot = this.slots.find((s) => s.id === id);
        slot?.remove();
        this.slots = this.slots.filter((s) => s.id !== id);
      }
      const btn = this.buttons.find((b) => b.dataset.targetId === tabId);
      btn?.remove();
      this.buttons = this.buttons.filter((b) => b.dataset.targetId !== tabId);
      this.raiseTabClose(tabId);
      this.tabNodes.delete(tabId);
      this.state.put("tabs", filtered);
      if (activeTabId === tabId && filtered.length > 0) {
        this.setActiveTab(filtered[0].id);
      } else if (activeTabId === tabId) {
        this.setActiveTab("", false);
      }
    }
    updateVisuals(activeId) {
      if (!this.element) return;
      const variant = this.state.store.variant || "default";
      const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.underline;
      this.buttons.forEach((btn) => {
        const isSelected = btn.dataset.targetId === activeId;
        btn.className = "flex jj-grow jj-justify-center items-center gap-2 px-3 py-2 text-sm font-semibold outline-none transition-all cursor-pointer";
        btn.classList.add(...styles.base);
        const toAdd = isSelected ? styles.active : styles.inactive;
        const toRemove = isSelected ? styles.inactive : styles.active;
        btn.classList.add(...toAdd);
        btn.classList.remove(...toRemove);
      });
      this.slots?.forEach((slot) => {
        slot.classList.toggle("hidden", slot.id !== `tab-content-slot-${activeId}`);
      });
    }
    get button_template() {
      return `
        <button
          title="{tab.title | iif : @tab.title : @tab.alt}"
          data-target-id="{tab.id}"
          on-click="selectTab:{tab.id}"
          role="tab"
          class=""
        >
          @if(tab.icon)
            <i data-icon="{tab.icon}" class="inline-flex"></i> 
            @if(tab.title)<span class="hidden md:inline truncate">{tab.title}</span>@endif
          @endif
          @if(!tab.icon)
            <span class="truncate">{tab.title}</span>
          @endif
        </button>
      `;
    }
    render() {
      const template = `
        <div class="w-full flex flex-col">
          <div class="flex flex-wrap pl-px border-b w-full" role="tablist">
            <div data-each="tab in state.store.tabs" class="contents butons-container jj-flex w-full">
              ${this.button_template}
            </div>
          </div>
          <div data-each="tab in state.store.tabs" class="contents tabs-container">
            <div id="tab-content-slot-{tab.id}" class="text-left text-slate-500 hidden"></div>
          </div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
    mounted() {
      this.slots = $("[id^=tab-content-slot]", this.element).all();
      this.slots.forEach((slot) => {
        const tab_id = slot.id.replace("tab-content-slot-", "");
        const content = this.tabNodes.get(tab_id);
        if (content) slot.appendChild(content);
      });
      this.buttons = $('button[role="tab"]', this.element).all();
      this.updateVisuals(this.state.store.activeTabId);
    }
  }
  registerComponent("tab-component", TabComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const { BaseComponent, buildAndInterpolate, registerComponent } = VanillaReactive;
  const { $ } = VanillaReactive.dom;
  const { storage } = VanillaReactive.state;
  const { pubSub } = VanillaReactive.services;
  const { accentNumericComparer, debounce, getUniqueValues, toDate } = VanillaReactive.utils;
  const TABLE_ACTIONS = {
    SELECT_ALL: "select-all",
    CLEAR_ALL: "clear-all",
    INVERT_SELECTION: "invert-selection",
    SHOW_ONLY_SELECTED: "show-only-selected"
  };
  const DEFAULT_GROUP_CLASS = "p-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-card border-b border-slate-300 dark:border-slate-600 tracking-wide";
  function numericRangeGrouping(ranges = [
    { max: 10, label: "Menores que 10" },
    { max: 100, label: "Del 11 al 99" }
  ]) {
    return {
      getGroupKey(value, column) {
        const n = Number(value);
        if (Number.isNaN(n)) return column.title + ": N/A";
        for (const range of ranges)
          if (n < range.max) return column.title + ": " + range.label;
        return `${column.title}: Mayores que ${ranges[ranges.length - 1]?.max ?? 0}`;
      }
    };
  }
  function textInitialGrouping() {
    return {
      getGroupKey(value) {
        const str = String(value ?? "").trim();
        return str.length > 0 ? str[0].toUpperCase() : "(vacío)";
      },
      getGroupCaption(value, column, _rows, _data, groupRows) {
        const str = String(value ?? "").trim();
        const displayValue = str.length > 0 ? str[0].toUpperCase() : "(vacío)";
        return {
          text: `${column.title}: ${displayValue} (${groupRows.length} Elementos)`,
          className: DEFAULT_GROUP_CLASS
        };
      }
    };
  }
  function valueGrouping(suffix = "Elemento/s") {
    return {
      getGroupCaption(value, column, _rows, _data, groupRows) {
        return {
          text: `${column.title}: ${value ?? "(vacío)"} (${groupRows.length} ${suffix})`,
          className: DEFAULT_GROUP_CLASS
        };
      }
    };
  }
  function dateRangeGrouping(ranges = [
    { maxDaysAgo: 7, label: "Última semana" },
    { maxDaysAgo: 30, label: "Último mes" },
    { maxDaysAgo: 90, label: "Últimos 3 meses" },
    { maxDaysAgo: 365, label: "Último año" }
  ]) {
    const getLabel = (value) => {
      const str = String(value ?? "").trim();
      if (!str || str === "-") return "Sin fecha";
      const date = toDate(str);
      if (!date) return "Fecha inválida";
      const diffDays = Math.floor((Date.now() - date.getTime()) / (1e3 * 60 * 60 * 24));
      if (diffDays < 0) return "Futuro";
      const matchedRange = ranges.find((r) => diffDays <= r.maxDaysAgo);
      return matchedRange ? matchedRange.label : `Más de ${ranges[ranges.length - 1]?.maxDaysAgo ?? 0} días`;
    };
    return {
      getGroupKey: (value) => getLabel(value),
      getGroupCaption: (value, column, _rows, _data, groupRows) => {
        const suffix = groupRows.length === 1 ? "Elemento" : "Elementos";
        return {
          text: `${column.title}: ${getLabel(value)} (${groupRows.length} ${suffix})`,
          className: DEFAULT_GROUP_CLASS
        };
      }
    };
  }
  class ColumnFilterButtonComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.rendered = false;
      this.uniqueValues = [];
      this.selectedValues = /* @__PURE__ */ new Set();
      this.searchText = "";
      this.column = null;
      this.data = [];
      this.filter = null;
      this.debouncedNotifyFilterChange = debounce((searchText) => {
        this.searchText = searchText;
        this.notifyFilterChange();
      }, 300);
    }
    init(ctx) {
      super.init(ctx);
      if (this.filter) {
        this.selectedValues = new Set(this.filter.selectedValues || []);
        this.searchText = this.filter.searchText || "";
      }
      this.setState({ hasActiveFilter: this.isFilterActive });
    }
    destroy() {
    }
    get shouldShowValueList() {
      return this.column?.options?.shouldShowValueList !== false;
    }
    get isFilterActive() {
      return (this.selectedValues?.size ?? 0) > 0 || (this.searchText?.length ?? 0) > 0;
    }
    clickInside = (e) => {
      const t = e.target;
      if (t instanceof Element && t.closest("[data-btn]")) return true;
      return false;
    };
    onOpenMenu = () => {
      this.uniqueValues = this.shouldShowValueList ? this.getUniqueValues() : [];
      this.updateBindings();
    };
    renderUniqueValueList(el) {
      if (!this.shouldShowValueList) {
        el.innerHTML = "";
        return;
      }
      if (this.uniqueValues.length === 0) {
        el.innerHTML = `<div class="px-2 py-1 text-xs text-slate-600 dark:text-slate-300">No hay valores únicos</div>`;
        return;
      }
      if (this.rendered) return;
      this.rendered = true;
      const template = `
        <div data-each="val in uniqueValues">
          <div
            on-click="handleUniqueValueClick:@val.name"
            class="
              @if(val.isSelected) bg-indigo-100 dark:bg-indigo-900/50 @endif
              px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50
              dark:hover:bg-slate-700/50
              rounded cursor-pointer truncate">
            {val.name}
          </div>
        </div>
      `;
      const list = buildAndInterpolate(template, this);
      el.innerHTML = "";
      while (list.firstChild) el.appendChild(list.firstChild);
    }
    handleMenuClick = (_el, e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    handleSearchInput(el) {
      this.debouncedNotifyFilterChange(el.value);
    }
    handleUniqueValueClick(el, _e, value) {
      if (this.selectedValues.has(value)) {
        this.selectedValues.delete(value);
        el.classList.remove("bg-indigo-100", "dark:bg-indigo-900/50");
      } else {
        this.selectedValues.add(value);
        el.classList.add("bg-indigo-100", "dark:bg-indigo-900/50");
      }
      this.notifyFilterChange();
    }
    notifyFilterChange() {
      if (!this.column) return;
      if (this.filterChanged) this.filterChanged(this.column.key, this.searchText, this.selectedValues);
      this.state.hasActiveFilter = this.isFilterActive;
    }
    getUniqueValues() {
      if (!this.column || !this.data.length) return [];
      let uniqueValues = [];
      if (this.column.resolver && "entries" in this.column.resolver && typeof this.column.resolver.entries === "function") {
        const entries = this.column.resolver.entries();
        uniqueValues = [...new Set(entries.map((item) => item[1]))];
      } else if (typeof this.column.accessor === "function") {
        const fn = this.column.accessor;
        uniqueValues = [...new Set(this.data.map((row) => fn(row)))];
      } else {
        uniqueValues = getUniqueValues(
          this.data,
          typeof this.column.accessor === "string" ? this.column.accessor : this.column.key
        );
      }
      uniqueValues.sort((a, b) => {
        if (a == null && b == null) return 0;
        if (a == null) return -1;
        if (b == null) return 1;
        if (typeof a === "string" && typeof b === "string") return accentNumericComparer(a, b);
        if (typeof a === "number" && typeof b === "number") return a - b;
        return accentNumericComparer(String(a), String(b));
      });
      return uniqueValues.map((val) => ({
        name: String(val),
        value: val,
        isSelected: this.selectedValues.has(String(val))
      }));
    }
    render(changedProp) {
      if (changedProp && this.element) {
        this.updateBindings();
        return this.element;
      }
      const template = `
        <div
          data-component="app-popover-trigger"
          data-placement="top-end"
          (click-inside)="clickInside"
          (before-open)="onOpenMenu"
          class="inline-block">
            <button
              data-popover-trigger
              type="button"
              on-click="handleMenuClick"
              class="app-buton relative flex h-5 w-6 items-center justify-center
              rounded-sm transition-colors hover:bg-slate-300 dark:hover:bg-slate-800">
              <i data-icon="menu" class="size-4"></i>
              <span
                data-bind="show:state.hasActiveFilter"
                class="absolute left-4.5 top-0.5 block h-1.5 w-1.5 rounded-sm bg-yellow-400">
              </span>
            </button>
            <div data-popover-content class="max-w-sm">
              <p class="
                  text-xs font-semibold text-slate-400
                  uppercase tracking-wide pt-1 pb-2 text-center
                  border-b dark:border-slate-700
                ">
                Filtrar: {column.title}
              </p>
              <div class="">
                <input
                  type="text"
                  data-bind="hide:column.options.shouldShowTextBox | equal : false"
                  placeholder="Buscar..."
                  value="{searchText}"
                  on-input="handleSearchInput"
                  class="w-full px-2 py-1.5 text-sm border rounded bg-white dark:bg-slate-700 dark:border-slate-600
                        text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500
                        focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              @if(shouldShowValueList)
                <div class="mt-2">
                  <p class="text-xs text-slate-500 dark:text-slate-400 py-1 text-center">
                    Valores únicos (<span data-bind="text:uniqueValues.length">{uniqueValues.length}</span>):
                  </p>
                  <div class="space-y-0 rounded-sm overflow-hidden border dark:border-slate-700">
                    <div
                      data-bind="fn:renderUniqueValueList"
                      class="max-h-40 overflow-auto space-y-1">
                    </div>
                  </div>
                </div>
              @endif
            </div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  class TableComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.data = [];
      this.actions = [];
      this.columns = [];
      this.tableKey = "table";
      this.sortedData = [];
      this.sortDirty = true;
      this.activeFilters = /* @__PURE__ */ new Map();
      this.isResizing = false;
      this.currentTh = null;
      this.currentResizer = null;
      this.startX = 0;
      this.startWidth = 0;
      this.skipNextSort = false;
      this.ticking = false;
      this.invertResize = false;
      this.handleMouseMove = (e) => {
        if (!this.isResizing || !this.currentTh || this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          const diffX = e.pageX - this.startX;
          const newWidth = this.startWidth + (this.invertResize ? -diffX : diffX);
          if (newWidth > 50 && this.currentTh) {
            this.currentTh.style.width = `${newWidth}px`;
          }
          this.ticking = false;
        });
      };
      this.handleMouseUp = () => {
        if (!this.isResizing) return;
        if (this.currentResizer) this.currentResizer.classList.remove("bg-blue-500/20", "border-r-2", "border-blue-600/20");
        this.isResizing = false;
        this.invertResize = false;
        this.currentTh = null;
        this.currentResizer = null;
        document.body.classList.remove("select-none", "cursor-col-resize");
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        this.skipNextSort = true;
        setTimeout(() => {
          this.skipNextSort = false;
        }, 0);
        this.computeColumnsWidths();
      };
    }
    init(ctx) {
      super.init(ctx);
      this.tableKey = this.props.key || "table";
      this.setState({
        data: this.data || [],
        actions: this.actions || [],
        columns: this.columns || [],
        selected: /* @__PURE__ */ new Set(),
        currentPage: 1,
        pageSize: this.loadPageSize(),
        sortColumn: null,
        sortDirection: null,
        visibleColumns: /* @__PURE__ */ new Set(),
        activeFiltersCount: 0,
        hideRowSelection: this.props.hideRowSelection === "true",
        hideToolbar: this.props.hideToolBar === "true",
        hideStatusbar: this.props.hideStatusbar === "true",
        hideButtons: this.props.hideButtons === "true",
        hideCrudButtons: this.props.hideCrudButtons === "true",
        hidePagination: this.props.hidePagination === "true",
        hideMenuButton: this.props.hideMenuButton === "true",
        hideConfigButton: this.props.hideConfigButton === "true",
        hideMenuSelection: this.props.hideMenuSelection === "true",
        hideMenuColumns: this.props.hideMenuColumns === "true",
        hideMenuPagination: this.props.hideMenuPagination === "true",
        resizeColumns: this.props.resizeColumns === "true"
      }, false);
      this.initColumns();
    }
    initColumns() {
      const columns = this.state.columns;
      const defaultVisible = columns.filter((c) => c.isVisible !== false || c.options?.canBeRemoved === false).map((c) => c.key);
      const savedVisibleColumns = storage.readValue(this.visibleColumnsStorageKey(), defaultVisible);
      const savedColumnsWidths = storage.readValue(this.columnsWidthsStorageKey(), []);
      const visible = new Set(Array.isArray(savedVisibleColumns) ? savedVisibleColumns : defaultVisible);
      columns.filter((col) => col.options?.canBeRemoved === false).forEach((col) => visible.add(col.key));
      this.invalidateSort();
      this.setState({
        visibleColumns: visible,
        columns: columns.map((col) => ({
          ...col,
          isVisible: visible.has(col.key),
          width: savedColumnsWidths.find((cw) => cw.key === col.key)?.width || col.width
        }))
      });
    }
    setColumns(columns) {
      this.setState({ columns }, false);
      this.initColumns();
    }
    setActions(actions) {
      this.setState({ actions }, false);
    }
    showSkeletonRows() {
      if (!this.element) return;
      const template = '<div class="animate-pulse h-5 bg-gray-700/50 rounded-xs"></div>';
      $("tbody td", this.element).all().forEach((td) => td.innerHTML = template);
    }
    setData(rows) {
      this.setState({
        data: rows ?? [],
        selected: /* @__PURE__ */ new Set(),
        currentPage: 1,
        sortColumn: null,
        sortDirection: null,
        activeFiltersCount: 0
      }, false);
      this.activeFilters = /* @__PURE__ */ new Map();
      this.invalidateSort();
      this.firstPage();
    }
    // ─── Toolbar action handlers ──────────────────────────────────
    refreshData() {
      if (this.onRefresh) this.onRefresh(this);
    }
    createRow() {
      if (this.onCreate) {
        this.onCreate(this, (newItem) => {
          const data = this.state.data;
          this.setData([...data, newItem]);
        });
      }
    }
    deleteRows() {
      const ids = Array.from(this.state.selected);
      if (this.onDelete) {
        this.onDelete(this, ids, () => {
          const data = this.state.data;
          this.setData(data.filter((r) => !ids.includes(r.id)));
        });
      }
    }
    editRow() {
      const ids = Array.from(this.state.selected);
      if (ids.length !== 1) return;
      const data = this.state.data;
      const item = data.find((r) => r.id === ids[0]);
      if (!item) return;
      if (this.onEdit) {
        this.onEdit(this, item, (updatedItem) => {
          this.setData(data.map((r) => r.id === updatedItem.id ? updatedItem : r));
        });
      }
    }
    handleMenuAction(action) {
      const data = this.state.data;
      if (action === TABLE_ACTIONS.SELECT_ALL) {
        this.patchSelectedRows(new Set(data.map((r) => r.id)));
        return;
      }
      if (action === TABLE_ACTIONS.CLEAR_ALL) {
        this.patchSelectedRows(/* @__PURE__ */ new Set());
        return;
      }
      if (action === TABLE_ACTIONS.INVERT_SELECTION) {
        const current = this.state.selected;
        const all = data.map((r) => r.id);
        this.patchSelectedRows(new Set(all.filter((id) => !current.has(id))));
        return;
      }
      if (action === TABLE_ACTIONS.SHOW_ONLY_SELECTED) {
        const current = this.state.selected;
        this.invalidateSort();
        this.setState({ data: data.filter((r) => current.has(r.id)), currentPage: 1 });
        return;
      }
      if (action.startsWith("page-size-")) {
        const size = parseInt(action.split("-")[2], 10);
        if (!Number.isNaN(size)) {
          this.setState({ pageSize: size, currentPage: 1 });
          this.savePageSize();
        }
        return;
      }
      if (this.onAction) this.onAction(this, action);
    }
    renderColumnList(el) {
      const columns = this.state.columns;
      if (!columns.length) {
        el.innerHTML = "";
        return;
      }
      const html = columns.map((col) => {
        const checked = col.isVisible ? "checked" : "";
        const disabled = col.options?.canBeRemoved === false ? "disabled" : "";
        return `
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 transition select-none rounded">
            <input type="checkbox" ${checked} ${disabled}
              data-col-key="${col.key}"
              on-change="handleToggleColumn:${col.key}"
              class="w-3 h-3 accent-indigo-500 cursor-pointer shrink-0"
            />
            <span class="text-sm opacity-60">${col.title}</span>
          </label>
        `;
      }).join("");
      const fragment = buildAndInterpolate(`<div>${html}</div>`, this);
      el.innerHTML = "";
      while (fragment.firstChild) el.appendChild(fragment.firstChild);
    }
    handleToggleColumn(_el, _e, colKey) {
      const column = this.state.columns.find((col) => col.key === colKey);
      if (column?.options?.canBeRemoved === false) return;
      const next = new Set(this.state.visibleColumns);
      if (next.has(colKey)) next.delete(colKey);
      else next.add(colKey);
      this.setState({
        visibleColumns: next,
        columns: this.state.columns.map((col) => ({ ...col, isVisible: next.has(col.key) }))
      });
      this.saveVisibleColumns();
    }
    handleAction(_el, _e, actionKey) {
      const actions = this.state.actions;
      const action = actions.find((a) => a.key === actionKey);
      if (action?.onClick) {
        action.onClick();
        return;
      }
      this.handleMenuAction(actionKey);
    }
    handlePageSize(el, _e, pageSize) {
      Array.from(el.parentNode.children).forEach((el2) => {
        el2.classList.remove("bg-slate-200", "dark:bg-slate-600/50");
      });
      el.classList.add("bg-slate-200", "dark:bg-slate-600/50");
      this.handleMenuAction("page-size-" + parseInt(pageSize, 10));
    }
    toggleSort(_el, _e, columnKey) {
      if (this.skipNextSort) return;
      const columns = this.state.columns;
      const col = columns.find((c) => c.key === columnKey);
      if (!col?.sorter) return;
      const current = this.state.sortColumn;
      this.invalidateSort();
      if (current === columnKey) {
        const dir = this.state.sortDirection;
        this.setState({ sortDirection: dir === "asc" ? "desc" : dir === "desc" ? null : "asc", currentPage: 1 });
      } else {
        this.setState({ sortColumn: columnKey, sortDirection: "asc", currentPage: 1 });
      }
    }
    handleRowClick(_el, _e, id) {
      if (this.onRowClick) this.onRowClick(this, id);
    }
    handleGroupClick(el, _e, groupKey) {
      const icons = $("svg", el).all();
      icons.forEach((icon) => icon.classList.remove("hidden"));
      if (el.classList.contains("group-collapsed")) {
        el.classList.remove("group-collapsed");
        icons[0]?.classList.add("hidden");
        $(`[data-group="${groupKey}"]`, this.element).all().forEach((row) => row.classList.remove("hidden"));
      } else {
        el.classList.add("group-collapsed");
        icons[1]?.classList.add("hidden");
        $(`[data-group="${groupKey}"]`, this.element).all().forEach((row) => row.classList.add("hidden"));
      }
    }
    firstPage() {
      this.state.currentPage = 1;
    }
    lastPage() {
      this.state.currentPage = this.getTotalPages();
    }
    prevPage() {
      if (this.state.currentPage > 1) this.state.currentPage = this.state.currentPage - 1;
    }
    nextPage() {
      const total = this.getTotalPages();
      if (this.state.currentPage < total) this.state.currentPage = this.state.currentPage + 1;
    }
    goToPage(el) {
      const value = parseInt(el.value || "1", 10);
      const total = this.getTotalPages();
      if (value >= 1 && value <= total) this.state.currentPage = value;
    }
    setPageSize(el) {
      const value = parseInt(el.value || "10", 10);
      this.setState({ pageSize: Number.isNaN(value) ? 10 : value, currentPage: 1 });
      this.savePageSize();
    }
    toggleRow(_el, _e, id) {
      const next = new Set(this.state.selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      this.patchSelectedRows(next);
    }
    patchSelectedRows(selected) {
      this.setState({ selected }, false);
      const rows = $("[data-row]", this.element).all();
      rows.forEach((row) => {
        const rowId = row.id.replace("row-", "");
        const isSelected = selected.has(rowId) || selected.has(Number(rowId));
        row.classList.remove("bg-blue-50!", "dark:bg-blue-900/20!");
        if (isSelected) row.classList.add("bg-blue-50!", "dark:bg-blue-900/20!");
        const checkbox = $('input[type="checkbox"]', row).one();
        if (checkbox) checkbox.checked = isSelected;
      });
      this.patchStatus();
      this.patchToolbar();
    }
    selectAll(el) {
      const data = this.state.data;
      const next = el.checked ? new Set(data.map((r) => r.id)) : /* @__PURE__ */ new Set();
      this.patchSelectedRows(next);
    }
    toggleColumn(_el, _e, columnKey) {
      const next = new Set(this.state.visibleColumns);
      if (next.has(columnKey)) next.delete(columnKey);
      else next.add(columnKey);
      this.setState({
        visibleColumns: next,
        columns: this.state.columns.map((col) => ({ ...col, isVisible: next.has(col.key) }))
      });
      this.saveVisibleColumns();
    }
    render(changedProp) {
      if (changedProp && this.element) {
        this.patchStatus();
        this.rebuildHeaders();
        this.rebuildRows();
        this.patchToolbar();
        this.updateBindings();
        return this.element;
      }
      return buildAndInterpolate(this.buildTemplate(), this);
    }
    // ─── Incremental DOM patches ──────────────────────────────────
    patchStatus() {
      const el = $("[data-table-status]", this.element || void 0).one();
      if (el) el.innerHTML = this.buildStatusHtml();
    }
    rebuildHeaders() {
      if (!this.element) return;
      const thead = this.element.querySelector("thead");
      if (!thead) return;
      const data = this.state.data;
      const selected = this.state.selected;
      const allChecked = data.length > 0 && selected.size === data.length;
      const newThead = buildAndInterpolate(
        `<table><thead><tr>
          ${this.state.hideRowSelection ? '<th class="px-3 py-2 border-b size-8 max-w-8 min-w-8"></th>' : `
          <th class="px-3 py-2 border-b w-10 max-w-10 min-w-10">
            <input type="checkbox" on-change="selectAll" class="cursor-pointer" ${allChecked ? "checked" : ""} />
          </th>`}
          ${this.buildHeaderHtml()}
        </tr></thead></table>`,
        this
      );
      thead.replaceWith(newThead.querySelector("thead"));
    }
    rebuildRows() {
      if (!this.element) return;
      const tbody = this.element.querySelector("tbody");
      if (!tbody) return;
      const newTable = buildAndInterpolate(`<table><tbody>${this.buildBodyHtml()}</tbody></table>`, this);
      tbody.replaceWith(newTable.querySelector("tbody"));
    }
    patchToolbar() {
      if (!this.element) return;
      const currentPage = this.state.currentPage;
      const totalPages = this.getTotalPages();
      const selected = this.state.selected;
      const isFirst = currentPage === 1;
      const isLast = currentPage === totalPages;
      const btn = (key) => this.element.querySelector(`[data-btn="${key}"]`);
      btn("first")?.toggleAttribute("disabled", isFirst);
      btn("prev")?.toggleAttribute("disabled", isFirst);
      btn("next")?.toggleAttribute("disabled", isLast);
      btn("last")?.toggleAttribute("disabled", isLast);
      btn("edit")?.toggleAttribute("disabled", selected.size !== 1);
      btn("delete")?.toggleAttribute("disabled", selected.size === 0);
      for (const action of this.state.actions) {
        if (action.show === "button" || action.show === "both") {
          btn(action.key)?.toggleAttribute("disabled", action.enabledWhen ? !action.enabledWhen(selected) : false);
        }
      }
      const pageInput = this.element.querySelector("[data-page-input]");
      if (pageInput) pageInput.value = String(currentPage);
      if (this.onUpdateUi) {
        const payload = {
          toolbarContainer: $("[data-table-toolbar]", this.element).one(),
          statusContainer: $("[data-table-status]", this.element).one(),
          buttonsContainer: $("[data-table-buttons]", this.element).one(),
          buttons: {
            crud: $("[data-crud]", this.element).all(),
            custom: $("[data-custom]", this.element).all(),
            pagination: $("[data-pagination]", this.element).all(),
            menu: $(".js-menu", this.element).all()
          },
          status: this.buildStatusHtml()
        };
        this.onUpdateUi(payload);
      }
    }
    clickInside = (e) => {
      const t = e.target;
      if (t instanceof Element && t.closest("[data-btn]")) return true;
      return false;
    };
    onOpenMenu = (el) => {
      const rows = this.state.data;
      const selected = this.state.selected;
      const buttons = $("[data-btn]", el).all();
      const actions = this.state.actions;
      buttons.forEach((btn) => {
        const key = btn.getAttribute("data-btn");
        if (key === "select-all") {
          btn.toggleAttribute("disabled", rows.length === 0 || selected.size === rows.length);
        } else if (key === "clear-all") {
          btn.toggleAttribute("disabled", selected.size === 0);
        } else if (key === "invert-selection") {
          btn.toggleAttribute("disabled", selected.size === 0 || selected.size === rows.length);
        } else if (key === "show-only-selected") {
          btn.toggleAttribute("disabled", selected.size === 0 || selected.size === rows.length);
        } else if (key && key.startsWith("page-size-")) {
          const size = parseInt(key.split("-")[2], 10);
          if (size === this.state.pageSize) btn.classList.add("bg-slate-200", "dark:bg-slate-600/50");
          else btn.classList.remove("bg-slate-200", "dark:bg-slate-600/50");
        } else {
          const action = actions.find((a) => a.key === key);
          if (action) btn.toggleAttribute("disabled", action.enabledWhen ? !action.enabledWhen(selected) : false);
        }
      });
    };
    handleFilterChanged(columnKey, searchText, selectedValues) {
      if (searchText.length === 0 && selectedValues.size === 0) {
        this.activeFilters.delete(columnKey);
      } else {
        this.activeFilters.set(columnKey, { searchText, selectedValues });
      }
      const activeCount = this.activeFilters.size;
      pubSub.publish("app-show-notification", {
        type: "info",
        message: `Filtro(s) activo(s): ${activeCount}${activeCount > 0 ? " | " + Array.from(this.activeFilters.keys()).join(", ") : ""}`
      });
      this.invalidateSort();
      this.setState({ currentPage: 1, activeFiltersCount: activeCount }, false);
      this.rebuildRows();
      this.patchStatus();
      this.patchToolbar();
    }
    // ─── Template builders ────────────────────────────────────────
    buildStatusHtml() {
      const data = this.state.data;
      const filtered = this.getFilteredData();
      const totalRows = filtered.length;
      const selected = this.state.selected;
      const currentPage = this.state.currentPage;
      const totalPages = this.getTotalPages();
      const filterInfo = this.activeFilters.size > 0 ? ` (${filtered.length}/${data.length} filtrados)` : "";
      return `${totalRows} elemento/s${filterInfo}${selected.size ? ` (${selected.size} seleccionado/s)` : ""}<br>Página ${currentPage}/${totalPages}`;
    }
    buildHeaderHtml() {
      const columns = this.state.columns;
      const sortColumn = this.state.sortColumn;
      const sortDirection = this.state.sortDirection;
      return this.visibleColumns.map((col, i) => {
        const index = columns.findIndex((c) => c.key === col.key);
        const shouldShowFilterButton = col.options?.shouldShowFilterButton !== false;
        const sortMarker = sortColumn === col.key && sortDirection ? `<i data-icon="${sortDirection === "asc" ? "chevron-up" : "chevron-down"}" class="size-3 shrink-0 ml-1"></i>` : "";
        const sortableClass = col.sorter ? "cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700" : "";
        const style = col.width ? `width: ${col.width}px;` : "";
        return `
            <th on-click="toggleSort:${col.key}"
              style="${style}"
              class="relative px-2 py-0 text-left text-sm font-semibold border-l border-b ${sortableClass} ${col.className || ""}">
              <div class="flex items-center">
                <span class="flex-1 text-left">${col.title}</span>${sortMarker}
                ${shouldShowFilterButton ? `
                  <span
                    data-component="app-column-filter-button"
                    (filter-changed)="handleFilterChanged"
                    (column)="state.columns[${index}]"
                    (data)="state.data"
                    (filter)="activeFilters[${col.key}]"
                  ></span>
                ` : ""}
                ${this.state.resizeColumns === false || i === this.visibleColumns.length - 1 ? "" : `
                  <div
                    class="absolute top-0 right-0 w-1 cursor-col-resize
                    hover:bg-blue-500/20 hover:border-r-2
                    hover:border-blue-600/20 transition-colors z-10"
                    data-resizer="true"
                    style="height: 10000px;">
                  </div>
                `}
              </div>
            </th>
          `;
      }).join("");
    }
    handleMousedown(_el, e) {
      const target = e.target;
      if (target.dataset && target.dataset.resizer) {
        e.stopPropagation();
        e.preventDefault();
        target.classList.add("bg-blue-500/20", "border-r-2", "border-blue-600/20");
        this.isResizing = true;
        this.currentResizer = target;
        let th = target.closest("th");
        const nextTh = th?.nextElementSibling;
        this.invertResize = !!(nextTh && !nextTh.nextElementSibling);
        if (this.invertResize) th = nextTh;
        this.currentTh = th;
        this.startX = e.pageX;
        this.startWidth = this.currentTh?.offsetWidth || 0;
        document.body.classList.add("select-none", "cursor-col-resize");
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
      }
    }
    computeColumnsWidths() {
      if (!this.element) return;
      const cols = $("thead th.relative", this.element).all();
      const visible = this.visibleColumns;
      const widths = cols.map((col, i) => ({ key: visible[i]?.key, width: col.offsetWidth })).filter((w) => w.key);
      this.saveColumnsWidths(widths);
      const widthMap = new Map(widths.map((w) => [w.key, w.width]));
      this.setState({
        columns: this.state.columns.map(
          (col) => widthMap.has(col.key) ? { ...col, width: widthMap.get(col.key) } : col
        )
      }, false);
    }
    get visibleColumns() {
      if (!this.state.columns || !this.state.visibleColumns) return [];
      const columns = this.state.columns;
      const visibleColumnIds = this.state.visibleColumns;
      return columns.filter((c) => visibleColumnIds.has(c.key));
    }
    buildBodyHtml() {
      const rows = this.getPageRows();
      const data = this.getSortedData();
      const selected = this.state.selected;
      if (!rows.length) {
        return `<tr><td colspan="999" class="px-3 py-8 text-center text-slate-500">Sin registros</td></tr>`;
      }
      const sortColumn = this.state.sortColumn;
      const sortDirection = this.state.sortDirection;
      const columns = this.state.columns;
      const groupColumn = sortColumn && sortDirection ? columns.find((c) => c.key === sortColumn && c.grouping) : null;
      const colSpan = this.visibleColumns.length + 1;
      const groupRowsMap = /* @__PURE__ */ new Map();
      if (groupColumn?.grouping) {
        for (const item of data) {
          const val = this.resolveCellValue(groupColumn, item);
          const key = groupColumn.grouping.getGroupKey?.(val, groupColumn, rows, data) || String(val);
          const arr = groupRowsMap.get(key);
          if (arr) arr.push(item);
          else groupRowsMap.set(key, [item]);
        }
      }
      let lastGroupKey = null;
      let rowIndex = 0;
      return rows.map((row) => {
        let groupRow = "";
        if (groupColumn?.grouping) {
          const value = this.resolveCellValue(groupColumn, row);
          const key = groupColumn.grouping.getGroupKey?.(value, groupColumn, rows, data) || String(value);
          if (key !== lastGroupKey) {
            rowIndex = -1;
            lastGroupKey = key;
            let text = key;
            let className = DEFAULT_GROUP_CLASS;
            if (groupColumn.grouping.getGroupCaption) {
              const caption = groupColumn.grouping.getGroupCaption(value, groupColumn, rows, data, groupRowsMap.get(key) || []);
              if (typeof caption === "string") {
                text = caption;
              } else if (caption && typeof caption === "object" && "text" in caption) {
                text = caption.text;
                className = caption.className || "";
              }
            }
            groupRow = `
              <tr>
                <td colspan="${colSpan}" class="${className}">
                  <div class="flex items-center gap-2">
                    <button class="app-button btn-ghost p-1! shrink-0" on-click="handleGroupClick:${key}">
                       <i data-icon="plus" class="size-3 hidden"></i>
                       <i data-icon="minus" class="size-3"></i>
                    </button>
                    <div class="flex-1">${text}</div>
                  </td>
                </tr>`;
          }
        }
        const isSelected = selected.has(row.id);
        const cells = this.visibleColumns.map((col) => {
          const cell = col.cellRender ? col.cellRender(row, col) : String(this.resolveCellValue(col, row) ?? "");
          return `<td class="px-3 py-2 text-sm border-b ${col.className || ""}">${cell}</td>`;
        }).join("");
        const even = rowIndex++ % 2 === 0;
        const rowClass = even ? "bg-slate-50/50 dark:bg-slate-800/30" : "bg-white dark:bg-transparent";
        return `${groupRow}
          <tr
            id="row-${row.id}"
            on-click="handleRowClick:${row.id}"
            data-row
            data-group="${lastGroupKey || ""}"
            class="${isSelected ? "bg-blue-50! dark:bg-blue-900/20!" : rowClass}
                hover:bg-slate-100 dark:hover:bg-slate-800">
            ${this.state.hideRowSelection ? '<td class="px-3 py-2 border-b border-r w-8"></td>' : `
              <td class="px-3 py-2 border-b w-10 max-w-10 min-w-10">
                <input type="checkbox" on-change="toggleRow:${row.id}" class="cursor-pointer" ${isSelected ? "checked" : ""} />
              </td>`}
            ${cells}
          </tr>
        `;
      }).join("");
    }
    buildTemplate() {
      return `
        <div class="space-y-2" app-table>

          <!-- Toolbar -->
          <div
            data-table-toolbar
            data-bind="hide:state.hideToolbar"
            class="w-full overflow-x-auto">
            <div class="flex items-center gap-1 w-full min-w-max px-1 py-1 rounded border bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
              <!-- Status -->
              @if(!state.hideStatusbar)
                <span
                  data-table-status
                  data-bind="hide:state.hideStatusbar"
                  class="hidden md:block flex-1 text-sm text-slate-600 dark:text-slate-400 px-2 whitespace-nowrap text-left">
                </span>
              @endif
              <!-- Buttons -->
              @if(!state.hideButtons)
                <div
                  data-table-buttons
                  data-bind="hide:state.hideButtons"
                  class="flex items-center gap-1 ml-auto">
                  <button data-bind="hide:state.hideCrudButtons" data-crud data-btn="refresh" on-click="refreshData" class="app-button btn-ghost p-2! shrink-0" title="Refrescar">
                    <i data-icon="refresh-ccw" class="size-4"></i>
                  </button>
                  <button data-bind="hide:state.hideCrudButtons" data-crud data-btn="create" on-click="createRow" class="app-button btn-ghost p-2! shrink-0" title="Nuevo">
                    <i data-icon="plus" class="size-4"></i>
                  </button>
                  <button disabled data-bind="hide:state.hideCrudButtons" data-crud data-btn="delete" on-click="deleteRows" class="app-button btn-ghost p-2! shrink-0" title="Eliminar">
                    <i data-icon="trash-2" class="size-4"></i>
                  </button>
                  <button disabled data-bind="hide:state.hideCrudButtons" data-crud data-btn="edit" on-click="editRow" class="app-button btn-ghost p-2! shrink-0" title="Editar">
                    <i data-icon="edit" class="size-4"></i>
                  </button>
                  <div data-bind="hide:state.hideCrudButtons" data-crud class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0"></div>
                  <div class="contents" data-each="action in state.actions">
                    @if(action.show === 'button' || action.show === 'both')
                      <button disabled data-custom data-btn="{action.key}" on-click="handleAction:@action.key" class="app-button btn-ghost p-2! shrink-0" title="{action.label}">
                        @if(action.icon)<i data-icon="{action.icon}" class="size-4 shrink-0"></i>@endif
                        @if(!action.icon){action.label}@endif
                      </button>
                    @endif
                  </div>
                  @if(state.actions.length > 0)
                    <div data-custom class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0"></div>
                  @endif
                  <button disabled data-bind="hide:state.hidePagination" data-pagination data-btn="first" on-click="firstPage" class="app-button btn-ghost p-2! shrink-0"><i data-icon="chevrons-left" class="size-4"></i></button>
                  <button disabled data-bind="hide:state.hidePagination" data-pagination data-btn="prev" on-click="prevPage" class="app-button btn-ghost p-2! shrink-0"><i data-icon="chevron-left" class="size-4"></i></button>
                  <input data-bind="hide:state.hidePagination" data-pagination data-page-input value="1" on-change="goToPage" class="w-10 h-8 text-center text-sm border rounded dark:bg-slate-700 dark:border-slate-600"/>
                  <button disabled data-bind="hide:state.hidePagination" data-pagination data-btn="next" on-click="nextPage" class="app-button btn-ghost p-2! shrink-0"><i data-icon="chevron-right" class="size-4"></i></button>
                  <button disabled data-bind="hide:state.hidePagination" data-pagination data-btn="last" on-click="lastPage" class="app-button btn-ghost p-2! shrink-0"><i data-icon="chevrons-right" class="size-4"></i></button>
                </div>
              @endif

              <div data-bind="hide:state.hideMenuButton" class="js-menu w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0"></div>
              <div
                data-component="app-popover-trigger"
                data-placement="top-end"
                (click-inside)="clickInside"
                (before-open)="onOpenMenu"
                class="mb-1 js-menu">
                <button data-bind="hide:state.hideMenuButton" data-popover-trigger class="app-button px-2! btn-ghost shrink-0" title="Más opciones">
                  <i data-icon="menu" class="size-4"></i>
                </button>
                <div data-popover-content class="max-w-xs">
                  @if(state.actions.length > 0)
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-1 pb-0.5">Acciones</p>
                  @endif
                  <div class="px-1 contents" data-each="action in state.actions">
                    @if(action.show === 'menu' || action.show === 'both')
                      <button disabled data-btn="{action.key}" on-click="handleAction:@action.key"
                        class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded">
                        @if(action.icon)<i data-icon="{action.icon}" class="size-4 shrink-0"></i>@endif
                        <span>{action.label}</span>
                      </button>
                    @endif
                  </div>
                  @if(!state.hideMenuSelection)
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-1 pb-0.5">Selección</p>
                    <div class="px-1">
                      <button disabled data-btn="select-all" on-click="handleAction:select-all" class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded"><i data-icon="check-square" class="size-4 shrink-0"></i><span>Seleccionar todos</span></button>
                      <button disabled data-btn="clear-all" on-click="handleAction:clear-all" class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded"><i data-icon="square" class="size-4 shrink-0"></i><span>Limpiar selección</span></button>
                      <button disabled data-btn="invert-selection" on-click="handleAction:invert-selection" class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded"><i data-icon="shuffle" class="size-4 shrink-0"></i><span>Invertir selección</span></button>
                      <button disabled data-btn="show-only-selected" on-click="handleAction:show-only-selected" class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition text-left rounded"><i data-icon="filter" class="size-4 shrink-0"></i><span>Mostrar solo seleccionados</span></button>
                    </div>
                    <div data-bind="hide:state.hideMenuSelection" class="border-t my-1 dark:border-slate-700"></div>
                  @endif
                  @if(!state.hideMenuColumns)
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-1 pb-0.5">Columnas</p>
                    <div data-bind="fn:renderColumnList" class="p-1 border rounded-lg h-30 overflow-auto"></div>
                  @endif
                  @if(!state.hideMenuPagination)
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-1 pb-0.5 dark:border-slate-700 border-b">Paginación</p>
                    <div data-each="size in [5, 10, 25, 50, 100]" class="mt-1 flex w-full gap-2">
                      <button data-btn="page-size-{size}"
                        class="flex-1 app-button btn-ghost px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded @if(state.pageSize === size) bg-slate-200 dark:bg-slate-600/50 @endif"
                        on-click="handlePageSize:{size}">{size}</button>
                    </div>
                  @endif
                </div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto overflow-y-clip border rounded-lg dark:border-slate-700">
            <table on-mousedown="handleMousedown" class="w-full border-collapse text-sm">
              <thead class="bg-slate-100 dark:bg-slate-900">
                <tr>
                  <th class="px-3 py-2 border-b border-r w-10">
                    <input type="checkbox" on-change="selectAll" class="cursor-pointer"/>
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      `;
    }
    // ─── Data utilities ───────────────────────────────────────────
    getFilteredData() {
      const data = this.state.data;
      if (this.activeFilters.size === 0) return data;
      const columns = this.state.columns;
      return data.filter((row) => {
        for (const [columnKey, criteria] of this.activeFilters) {
          const column = columns.find((c) => c.key === columnKey);
          if (!column) continue;
          const cellValue = this.resolveCellValue(column, row);
          const cellString = String(cellValue ?? "").toLowerCase();
          if (criteria.searchText.length > 0 && !cellString.includes(criteria.searchText.toLowerCase())) return false;
          if (criteria.selectedValues.size > 0 && !criteria.selectedValues.has(String(cellValue))) return false;
        }
        return true;
      });
    }
    getSortedData() {
      if (!this.sortDirty) return this.sortedData;
      const columns = this.state.columns;
      const rows = [...this.getFilteredData()];
      const sortColumn = this.state.sortColumn;
      const sortDirection = this.state.sortDirection;
      if (!sortColumn || !sortDirection) {
        this.sortedData = rows;
        this.sortDirty = false;
        return this.sortedData;
      }
      const column = columns.find((c) => c.key === sortColumn);
      if (!column?.sorter && !column?.resolver) {
        this.sortedData = rows;
        this.sortDirty = false;
        return this.sortedData;
      }
      this.sortedData = rows.sort((a, b) => {
        let result = 0;
        if (typeof column.sorter === "function") {
          result = column.sorter(a, b);
        } else {
          const va = this.resolveCellValue(column, a);
          const vb = this.resolveCellValue(column, b);
          if (va == null && vb == null) result = 0;
          else if (va == null) result = -1;
          else if (vb == null) result = 1;
          else if (typeof va === "string" && typeof vb === "string") result = accentNumericComparer(va, vb);
          else result = va < vb ? -1 : va > vb ? 1 : 0;
        }
        return sortDirection === "asc" ? result : -result;
      });
      this.sortDirty = false;
      return this.sortedData;
    }
    getTotalPages() {
      return Math.max(1, Math.ceil(this.getSortedData().length / this.state.pageSize));
    }
    getPageRows() {
      const sorted = this.getSortedData();
      const page = this.state.currentPage;
      const size = this.state.pageSize;
      return sorted.slice((page - 1) * size, page * size);
    }
    resolveCellValue(column, item) {
      if (column.accessor && typeof column.accessor === "function") return column.accessor(item);
      if (column.accessor && typeof column.accessor === "string") return item[column.accessor];
      if (column.resolver) return column.resolver.resolve(item, column);
      return item[column.key];
    }
    loadPageSize() {
      if (this.props.pageSize === "none") return Number.POSITIVE_INFINITY;
      const saved = storage.readValue(this.pageSizeStorageKey(), 10);
      return Number.isFinite(saved) ? saved : 10;
    }
    savePageSize() {
      storage.writeValue(this.pageSizeStorageKey(), Number(this.state.pageSize));
    }
    saveVisibleColumns() {
      storage.writeValue(this.visibleColumnsStorageKey(), Array.from(this.state.visibleColumns));
    }
    saveColumnsWidths(widths) {
      storage.writeValue(this.columnsWidthsStorageKey(), widths);
    }
    pageSizeStorageKey() {
      return `app-table-${this.tableKey}-page-size`;
    }
    visibleColumnsStorageKey() {
      return `app-table-${this.tableKey}-visible-columns`;
    }
    columnsWidthsStorageKey() {
      return `app-table-${this.tableKey}-columns-whidths`;
    }
    invalidateSort() {
      this.sortDirty = true;
    }
  }
  window.TableHelpers = {
    TABLE_ACTIONS,
    DEFAULT_GROUP_CLASS,
    numericRangeGrouping,
    textInitialGrouping,
    valueGrouping,
    dateRangeGrouping
  };
  registerComponent("app-column-filter-button", ColumnFilterButtonComponent);
  registerComponent("app-table", TableComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    pubSub,
    registerComponent
  } = VanillaReactive;
  class ThemeToggleComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
    }
    init(value) {
      super.init(value);
      const savedTheme = localStorage.getItem("theme");
      const isDark = savedTheme === "dark" || !savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.setState({ isDarkMode: isDark }, false);
      this.addCleanup([
        pubSub.subscribe("APP_CONFIG.messages.app.themeChanged", (isDarkMode) => {
          this.state.isDarkMode = Boolean(isDarkMode);
          this.invalidate();
        })
      ]);
    }
    toggleTheme() {
      this.state.isDarkMode = !this.state.isDarkMode;
      this.applyTheme(this.state.isDarkMode);
      pubSub.publish("APP_CONFIG.messages.app.themeChanged", this.state.isDarkMode);
    }
    applyTheme(isDark) {
      const root = document.documentElement;
      const css = document.createElement("style");
      css.appendChild(
        document.createTextNode(`* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
        }`)
      );
      document.head.appendChild(css);
      if (isDark) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      window.getComputedStyle(css).opacity;
      document.head.removeChild(css);
    }
    render() {
      return buildAndInterpolate(`
        <div class="flex items-center justify-center">
          <button on-click="toggleTheme" 
            class="
              relative flex items-center gap-2 px-3 py-2 rounded-md border
              border-gray-300 dark:border-slate-600
              bg-white dark:bg-gray-800
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors
              "
            >
          
            @if(state.isDarkMode)
              <i data-icon="sun" class="size-5 text-yellow-400"></i>
              <span class="text-sm hidden lg:block">Claro</span>
            @endif

            @if(!state.isDarkMode)
              <i data-icon="moon" class="size-5 text-indigo-500"></i>
              <span class="text-sm hidden lg:block">Oscuro</span>
            @endif

          </button>
        </div>
      `, this);
    }
  }
  registerComponent("theme-toggle-component", ThemeToggleComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const {
    BaseComponent,
    buildAndInterpolate,
    hydrateElement,
    registerComponent
  } = VanillaReactive;
  class TodoComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
    }
    init(value) {
      super.init(value);
      this.setState({ items: ["Comprar leche", "Pasear al perro", "Estudiar JS"], input: "" }, false);
    }
    addItem() {
      if (!this.state.input.trim()) return;
      this.state.items = [...this.state.items, this.state.input];
      this.state.input = "";
    }
    removeItem(_el, _ev, index) {
      this.state.items = this.state.items.filter((_, i) => i !== Number(index));
    }
    onInput(el) {
      this.setState({ input: el.value }, false);
    }
    render() {
      return buildAndInterpolate(`
          <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-3">
          <h3 class="font-semibold text-gray-700 dark:text-gray-200">Todo List (BaseComponent)</h3>
          <div class="flex gap-2">
              <input
              type="text"
              on-input="onInput"
              data-bind="value:state.input"
              placeholder="Nueva tarea..."
              class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button on-click="addItem" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              <i data-icon="plus" class="size-5"></i>
              </button>
          </div>
          <ul class="space-y-1" data-each="item in state.items">
              <li class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
              <span class="dark:text-gray-200">{item}</span>
              <button on-click="removeItem:{index}" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <i data-icon="x" class="size-4"></i>
              </button>
              </li>
          </ul>
          </div>
      `, this);
    }
  }
  registerComponent("todo-component", TodoComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const { BaseComponent, buildAndInterpolate, registerComponent } = VanillaReactive;
  const { $, build } = VanillaReactive.dom;
  class TreeViewerComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      this.plusIconName = "plus";
      this.minusIconName = "minus";
      this.showCheckbox = false;
      this.showIcons = false;
      this.nodeMap = /* @__PURE__ */ new Map();
      this.root = {
        treeId: "root",
        name: "Root",
        checked: false,
        expanded: true,
        depth: 0,
        children: [
          {
            treeId: "child-1",
            name: "Child 1",
            checked: false,
            depth: 1,
            rows: []
          }
        ]
      };
    }
    init(ctx) {
      super.init(ctx);
      this.plusIconName = this.props.plusIconName ?? this.plusIconName;
      this.minusIconName = this.props.minusIconName ?? this.minusIconName;
      this.showCheckbox = this.props.showCheckbox === "true";
      this.showIcons = this.props.showIcons === "true";
    }
    render(changedProp) {
      if (changedProp && this.element) return this.element;
      if (!this.root) return null;
      const template = `
        <div class="flex flex-col w-full">
          <slot name="root"></slot>
        </div>
      `;
      const slottedNodes = {
        root: [this.buildNodeElement(this.root)]
      };
      return buildAndInterpolate(template, { slottedNodes });
    }
    destroy() {
      this.nodeMap.clear();
      super.destroy();
    }
    buildNodeElement(node) {
      const isOpen = node.expanded ?? false;
      const hasChildren = (node.children?.length ?? 0) > 0;
      const hasRows = (node.rows?.length ?? 0) > 0;
      const isExpandable = hasChildren || hasRows;
      const rowNodes = [];
      const containerNodes = [];
      if (this.nodeRenderer) {
        rowNodes.push(build("div", { innerHTML: this.nodeRenderer(node, isOpen, isExpandable) }, true));
      } else {
        rowNodes.push(this.defaultNodeRenderer(node, isOpen, isExpandable));
      }
      if (hasChildren) {
        for (const child of node.children) {
          child.parent = node;
          containerNodes.push(this.buildNodeElement(child));
        }
      }
      if (hasRows) {
        const leafContainer = this.buildLeafContent(node);
        leafContainer.classList.add("ml-3");
        leafContainer.onclick = (ev) => {
          this.handleNodeClick(leafContainer, ev, node.treeId, true);
        };
        containerNodes.push(leafContainer);
      }
      const wrapperTemplate = `
        <div class="flex flex-col w-full">
          <div
            data-tree-row
            data-node-id="{node.treeId}"
            class="cursor-pointer"
            on-click="handleNodeClick:@node.treeId">
            <slot name="row"></slot>
          </div>
          <div
            data-tree-container
            data-node-id="{node.treeId}"
            class="flex flex-col ml-2.5 overflow-hidden {isOpen | iif : '' : 'hidden'}"
          >
            <slot name="container"></slot>
          </div>
        </div>
      `;
      const wrapper = buildAndInterpolate(
        wrapperTemplate,
        {
          ...this,
          node,
          isOpen,
          slottedNodes: {
            row: rowNodes,
            container: containerNodes
          }
        }
      );
      const iconPlus = $("[data-tree-icon-plus]", wrapper).one();
      const iconMinus = $("[data-tree-icon-minus]", wrapper).one();
      const checkbox = $('input[type="checkbox"]', wrapper).one();
      const container = $("[data-tree-container]", wrapper).one();
      this.nodeMap.set(node.treeId, { container, iconPlus, iconMinus, checkbox, node });
      return wrapper;
    }
    handleNodeClick(_el, ev, treeId, isLeafClick) {
      const entry = this.nodeMap.get(treeId);
      if (!entry) return;
      if (isLeafClick) {
        const target2 = ev.target instanceof Element ? ev.target.closest("[data-tree-leaf-row]") : null;
        if (!target2) return;
        if (this.click) this.click(target2, ev, entry.node);
        return;
      }
      const target = ev.target;
      const { container, iconPlus, iconMinus, checkbox, node } = entry;
      if (target === checkbox || target instanceof Element && target.closest('input[type="checkbox"]')) {
        const checked = checkbox?.checked ?? false;
        this.setChecked(node, checked);
        this.updateAncestors(node);
        if (this.nodeSelect) this.nodeSelect(node, checked);
        return;
      }
      node.expanded = !(node.expanded ?? false);
      container.classList.toggle("hidden", !node.expanded);
      if (iconPlus) iconPlus.style.display = node.expanded ? "none" : "";
      if (iconMinus) iconMinus.style.display = node.expanded ? "" : "none";
      if (this.nodeToggle) this.nodeToggle(node);
    }
    setChecked(node, checked) {
      node.checked = checked;
      node.indeterminate = false;
      this.syncCheckbox(node);
      for (const child of node.children ?? []) {
        this.setChecked(child, checked);
      }
    }
    updateAncestors(node) {
      let current = node.parent;
      while (current) {
        const children = current.children ?? [];
        const allChecked = children.length > 0 && children.every((c) => c.checked && !c.indeterminate);
        const noneChecked = children.every((c) => !c.checked && !c.indeterminate);
        current.checked = allChecked;
        current.indeterminate = !allChecked && !noneChecked;
        this.syncCheckbox(current);
        current = current.parent;
      }
    }
    syncCheckbox(node) {
      const entry = this.nodeMap.get(node.treeId);
      if (!entry?.checkbox) return;
      entry.checkbox.checked = node.checked;
      entry.checkbox.indeterminate = node.indeterminate ?? false;
    }
    expandAll() {
      this.setAllExpanded(true);
    }
    collapseAll() {
      this.setAllExpanded(false);
    }
    setAllExpanded(expanded) {
      for (const [, entry] of this.nodeMap) {
        entry.node.expanded = expanded;
        entry.container.classList.toggle("hidden", !expanded);
        if (entry.iconPlus) entry.iconPlus.style.display = expanded ? "none" : "";
        if (entry.iconMinus) entry.iconMinus.style.display = expanded ? "" : "none";
      }
    }
    defaultNodeRenderer(node, isOpen, hasChildren) {
      const template = `
        <div class="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-slate-800
            rounded-lg transition-all group">
          @if(!hasChildren)
            <span class="size-3.5"></span>
          @endif
          @if(hasChildren)
            <span data-tree-icon-plus style="{isOpen | hide}">
              <i data-icon="{plus}" class="size-3.5"></i>
            </span>
            <span data-tree-icon-minus style="{isOpen | show}">
              <i data-icon="{minus}" class="size-3.5"></i>
            </span>
          @endif
          @if(showIcons)
            <i data-icon="folder" class="size-3.5"></i>
          @endif
          @if(showCheckbox)
            <input type="checkbox" />
          @endif
          <span class="text-sm font-semibold">
            {node.name}
          </span>
          @if(count===0)
            <span class="ml-auto text-xs text-gray-400 text-center min-w-5 h-5">
              -
            </span>
          @endif
          @if(count)
            <span class="ml-auto inline-flex items-center justify-center min-w-5 h-5 text-[11px]
              text-white bg-gray-700 rounded-full px-1">
              {count}
            </span>
          @endif
        </div>
      `;
      return buildAndInterpolate(template, {
        plus: this.plusIconName,
        minus: this.minusIconName,
        showCheckbox: this.showCheckbox ?? true,
        showIcons: this.showIcons ?? true,
        isOpen,
        node,
        hasChildren,
        count: this.countDescendantRows(node)
      }) ?? document.createElement("div");
    }
    buildLeafContent(node) {
      const fragment = document.createElement("div");
      if (this.leafRenderer) {
        const html = this.leafRenderer(node);
        const el = build("div", { innerHTML: html });
        while (el.firstChild) fragment.appendChild(el.firstChild);
        return fragment;
      }
      const rows = node.rows ?? [];
      rows.forEach((row, index) => {
        const data = row;
        const name = String(data.name ?? data.label ?? data.title ?? "");
        const template = `
          <div
            data-tree-leaf-row
            data-row-id="${data.id ?? crypto.randomUUID()}"
            data-row-index="${index}"
            class="text-sm flex items-center gap-2 px-2 py-1.5 mr-8
              rounded ml-2 text-slate-600
              hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <i data-icon="text" class="size-3.5 text-slate-400"></i>
            <span class="font-medium">${name}</span>
          </div>
        `;
        const el = buildAndInterpolate(template, {});
        if (el) fragment.appendChild(el);
      });
      return fragment;
    }
    countDescendantRows(node) {
      if (!node) return 0;
      let count = node.rows?.length ?? 0;
      if (node.children) {
        for (const child of node.children) {
          count += this.countDescendantRows(child);
        }
      }
      return count;
    }
  }
  registerComponent("app-tree-viewer", TreeViewerComponent);
})();
(function() {
  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }
  const { BaseComponent, buildAndInterpolate, registerComponent } = VanillaReactive;
  class UserListComponent extends BaseComponent {
    constructor(ctx) {
      super(ctx);
      super.setState({
        users: [
          { id: 1, name: "Alice Freeman", role: "Admin", initial: "A" },
          { id: 2, name: "Bob Vance", role: "User", initial: "B" },
          { id: 3, name: "Charlie Day", role: "Editor", initial: "C" },
          { id: 4, name: "Diana Prince", role: "Admin", initial: "D" }
        ],
        searchQuery: ""
      });
      setTimeout(() => this.addUser(), 3e3);
    }
    addUser() {
      const names = ["Luis Thompson", "Marta Sánchez", "Kevin Flynn", "Sarah Connor"];
      const roles = ["User", "Editor", "Admin"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const newUser = {
        id: Date.now(),
        name: randomName,
        role: randomRole,
        initial: randomName.charAt(0)
      };
      this.state.users = [...this.state.users, newUser];
    }
    deleteUser(_el, _ev, id) {
      this.state.users = this.state.users.filter((u) => u.id !== Number(id));
    }
    onSearch(el) {
      this.state.searchQuery = el.value.toLowerCase();
    }
    render() {
      this.filteredUsers = this.state.users.filter(
        (u) => this.state.searchQuery.length ? u.name.toLowerCase().includes(this.state.searchQuery) : true
      );
      const template = `
        <div class="max-w-2xl mx-auto my-8 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

          <div class="bg-slate-900 p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-white tracking-tight">Gestión de Equipo</h3>
              <button on-click="addUser"
                class="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2">
                <i data-icon="plus" class="size-8"></i> Añadir
              </button>
            </div>

            <div class="relative">
              <i data-icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 size-5"></i>
              <input type="text"
                id="txt-search-user"
                on-input="onSearch"
                placeholder="Buscar por nombre..."
                value="{state.searchQuery}"
                class="w-full bg-slate-800 border-none rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div class="p-2 min-h-75">
            <ul data-each="user in filteredUsers" class="space-y-1">
              <li class="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black">
                    {user.initial}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-800">{user.name}</p>
                    <p class="text-xs text-slate-400 font-medium tracking-wide uppercase">{user.role}</p>
                  </div>
                </div>
                <button on-click="deleteUser:@user.id"
                  class="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
                  <i data-icon="trash" class="size-6"></i>
                </button>
              </li>
            </ul>
            @if(filteredUsers.length === 0)
              <div class="py-20 text-center text-slate-400">
                <i data-icon="user-minus" class="size-12 mx-auto mb-4 opacity-20"></i>
                <p>No se encontraron usuarios</p>
              </div>
            @endif
          </div>
        </div>
      `;
      return buildAndInterpolate(template, this);
    }
  }
  registerComponent("app-user-list", UserListComponent);
})();
