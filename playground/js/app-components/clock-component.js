// ClockComponent – muestra la hora actual actualizada cada segundo.
(function () {

  if (!VanillaReactive) {
    console.error("VanillaReactive no está definido. Asegúrate de incluir vanilla-reactive.iife.js antes de este script.");
    return;
  }

  const { BaseComponent, registerComponent } = VanillaReactive;
  const { build } = VanillaReactive.dom;
  const { useState } = VanillaReactive.state;

  class ClockComponent extends BaseComponent {

    constructor(ctx) {
      super(ctx);
      this._state = useState({ seconds: 0, date: '' });
    }

    init() {
      const { put: update } = this._state;
      const intervalId = setInterval(() => {
        update('date', new Date().toTimeString().split(' ')[0]);
      }, 1_000);
      this.addCleanup(() => clearInterval(intervalId));
    }

    render() {
      const { on } = this._state;

      const view = build('div', `
        <div class="rounded-lg p-1.5 border bg-background">
          <div class="flex items-center gap-3 mx-1">
            <i data-icon="timer" class="size-6 hidden lg:block"></i>
            <span class="font-mono text-slate-700 dark:text-slate-100" id="date-slot">
              --:--:--
            </span>
          </div>
        </div>
      `, true);

      on('date', value => {
        const slot = view.querySelector('#date-slot');
        if (slot) slot.textContent = value;
      });

      return view;
    }
  }

  registerComponent('app-clock', ClockComponent);

}());
