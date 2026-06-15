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
