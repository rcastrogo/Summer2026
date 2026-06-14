import { build } from "../dom";
import { useState } from "../state.utils";
import { BaseComponent, type ComponentInitValue } from "../types";

export class ProgressBarComponent extends BaseComponent {

  init(ctx: ComponentInitValue) {
    super.init(ctx);
  }

  render(): HTMLElement {
    const message = this.props.message || 'Loading...';
    const template = `        
      <div class="flex flex-col items-center gap-2 justify-center m-1">
        ${message}
        <div class="h-1 w-full overflow-hidden rounded-full bg-gray-400 mb-1">
          <div
            class="h-full w-full origin-left animate-[progress_2.5s_infinite_linear] bg-red-900 dark:bg-blue-800">
          </div>
        </div>
      </div>
    `;
    return build('div', template, true);
  }

}