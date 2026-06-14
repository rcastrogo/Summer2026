import * as VR from '../../dist/types/index';

declare global {
  /** Librería reactiva disponible como global IIFE */
  const VanillaReactive: typeof VR;

  interface Window {
    VanillaReactive: typeof VR;
    lucideIcons?: Record<string, string>;
  }
}
