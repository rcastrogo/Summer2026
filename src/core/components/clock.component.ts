
import { build } from "../dom";
import { useState } from "../state.utils";
import { BaseComponent } from "../types";

export class ClockComponent extends BaseComponent {

  private _state = useState({ seconds: 0, date: '' });

  init(): void {
    const { put : update } = this._state;
    const intervalId = setInterval(() => {
      update('date', new Date().toTimeString().split(' ')[0] || '');
    }, 1_000);
    this.addCleanup(() => clearInterval(intervalId));
  }

  render(): HTMLElement {

    const { on } = this._state;

    const view = build('div', `
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
    `, true);

    on(
      'date', 
      value => {
        view.querySelector('#date-slot')!.textContent = value;
      });

    return view;
  }

}
