import { ClockComponent } from './components/clock.component';
import { registerComponent } from './hydrate';
import { registerIcons } from './icons';

type InitCallback = () => void;

export function initApp(callbacks?: InitCallback | InitCallback[]): void {
  const execute = () => {
    // ========================================================================================
    // Register icons if lucideIcons is available in the global scope.
    // This allows users to include lucide icons via CDN and have them registered automatically.
    // ========================================================================================
    if ('lucideIcons' in window) registerIcons(window.lucideIcons as Record<string, string>);
    // ========================================================================================
    // Register internal components. This is where you would register any core components that 
    // are part of the library.
    // ========================================================================================
    registerComponent('clock-component', ClockComponent);

    const fns = callbacks
      ? Array.isArray(callbacks) ? callbacks : [callbacks]
      : [];
    fns.forEach(fn => fn());
    document.body.style.visibility = 'visible';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', execute, { once: true });
  } else {
    execute();
  }
  // ===========================================================================================
  // Set initial theme based on user preference or system settings.
  // This is done immediately to prevent a flash of unstyled content (FOUC) when the page loads.
  // ===========================================================================================
  const theme = localStorage.getItem('theme');
  const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add('dark');
}
