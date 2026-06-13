import { ClockComponent } from './components/clock.component';

// =============================================================================
// ROOT EXPORTS - API principal (lo más usado por los componentes)
// =============================================================================
export { BaseComponent } from './types';
export type {
  Component,
  ComponentContext,
  ComponentConstructor,
  ComponentFactory,
  ComponentCreator,
  ComponentBinding, 
  BindingResolver, 
  PublishContext, 
  CleanupFn
} from './types';
export { buildAndInterpolate } from './dom';
export { registerComponent, hydrateElement, resolveBindingValue } from './hydrate';
export { pubSub } from './services/pubsub.service';
export { initApp } from './initApp';

// =============================================================================
// NAMESPACES - API agrupada por dominio
// =============================================================================
import * as _dom from './dom';
import * as _hydrate from './hydrate';
import * as _template from './template';
import * as _utils from './utils';
import * as _icons from './icons';
import * as _state from './state.utils';
import { storage } from './storageUtil';
import { RQ } from './services/http-client.service';
import { pubSub } from './services/pubsub.service';

/** DOM utilities: build, buildAndInterpolate, $ */
export const dom = _dom;

/** Hydration: hydrateElement, hydrateComponents, hydrateIcons, etc. */
export const hydrate = _hydrate;

/** Template interpolation engine */
export const template = _template;

/** Utility functions: debounce, clone, getValueByPath, etc. */
export const utils = _utils;

/** Icon registration and creation */
export const icons = _icons;

/** State management: useState, storage */
export const state = { ..._state, storage };

/** HTTP client and PubSub */
export const services = { RQ, pubSub } as { RQ: typeof RQ; pubSub: typeof pubSub };

// =============================================================================
// Components registry (internal components bundled with the lib)
// =============================================================================
export const Components = {
  ClockComponent,
} as const;