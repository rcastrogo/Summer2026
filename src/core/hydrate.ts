import { createIcon } from "./icons";
import { buildAndInterpolate } from "./dom";
import { getValue, resolveArgs } from "./template";
import { BaseComponent, type ComponentElement } from "./types";

import type { BindingResolver, ComponentBinding, ComponentContext, ComponentConstructor, ComponentCreator } from "./types";

import { pubSub } from "./services/pubsub.service";

export const UNSET = Symbol('UNSET');

// =======================================================================
// Registro de componentes
// =======================================================================
const componentRegistry = new Map<string, ComponentCreator>();

export function registerComponent(name: string, creator: ComponentCreator) {
  componentRegistry.set(name, creator);
}

export function getComponent(name: string): ComponentCreator | undefined {
  return componentRegistry.get(name);
}

function isConstructor(fn: ComponentCreator): fn is ComponentConstructor {
  return fn.prototype && fn.prototype.constructor === fn;
}


const pendingHydrations = new WeakMap<object, Promise<void>>();

export function trackHydration(ctx: object, promise: Promise<void>) {
  const existing = pendingHydrations.get(ctx);
  pendingHydrations.set(ctx, existing ? existing.then(() => promise) : promise);
}

export function getHydrationPromise(ctx: object): Promise<void> {
  return pendingHydrations.get(ctx) || Promise.resolve();
}

export function hydrateElement(element: HTMLElement, ctx: ComponentContext) {
  hydrateIcons(element);
  hydrateEventListeners(element, ctx);
  hydrateComponents(element, ctx);
  hydrateDirectives(element, ctx)
}

export function hydrateIcons(root: HTMLElement = document.body): HTMLElement {
  const iconPlaceholders = root.querySelectorAll<HTMLElement>('[data-icon]');
  iconPlaceholders.forEach(el => {
    const name = el.dataset.icon!;
    const customClasses = el.className;
    const svg = createIcon(name, customClasses);
    if (svg) el.replaceWith(svg);
  });
  return root;
}

export function hydrateEventListeners(container: HTMLElement, ctx: ComponentContext) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
  let currentNode: Node | null = container;
  // =======================================================================
  // Aseguramos que el componente tenga un array para almacenar las bindings
  // =======================================================================
  if (!ctx.bindings) {
    ctx.bindings = [];
  }
  while (currentNode) {
    const el = currentNode as HTMLElement;
    Array.from(el.attributes).forEach(attr => {
      const attrName = attr.name;
      const attrValue = attr.value;
      // =======================================================================
      // 1. SUSCRIPCIÓN REACTIVA (on-publish)
      // =======================================================================
      if (attrName === 'on-publish') {
        const [topic, scope, action, ...extraArgs] = attrValue.split(':');
        const instanceId = scope === 'local' ? ctx.instanceId : undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unsubscribe = pubSub.subscribe(topic, (payload: any) => {
          const isInternalPublish = payload && typeof payload === 'object' && 'args' in payload;
          const data = isInternalPublish ? payload.args[0] : payload;
          switch ((action || '').toLowerCase()) {
            case 'classname': el.className = data; break;
            case 'html':
            case 'innerhtml': el.innerHTML = data; break;
            case 'json': el.innerHTML = JSON.stringify(getValue(data, ctx), null, 2); break;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            case 'style': (el.style as any)[extraArgs[0] || ''] = data; break;
            case 'toggleclass': el.classList.toggle(extraArgs[0] || ''); break;
            default:
              if (action && typeof ctx[action] === 'function') {
                ctx[action].call(ctx, el, payload, ...extraArgs);
              } else if (action && action.startsWith('attr.')) {
                const attrName = action.split('.')[1];
                const value = data;
                if(attrName) el.setAttribute(attrName, value);
              } else {
                el.innerHTML = getValue(data, ctx);
              }
          }
        }, instanceId);
        if (ctx.component) {
          ctx.component.addCleanup(unsubscribe);
        }
        el.removeAttribute(attrName);
      }
      // // =======================================================================
      // // 2. NAVEGACIÓN (route-to)
      // // =======================================================================
      // else if (attrName === 'route-to') {
      //   el.addEventListener('click', (e) => {
      //     e.preventDefault();
      //     const path = attrValue.startsWith('@') ? getValue(attrValue.slice(1), ctx) : attrValue;
      //     router.navigateTo(path);
      //   });
      //   el.removeAttribute(attrName);
      // }
      // =======================================================================
      // 3. EVENTOS DEL DOM (on-click, on-change, on-input...)
      // =======================================================================
      else if (attrName.startsWith('on-')) {
        const eventName = attrName.replace('on-', '');
        // Caso A: El evento dispara una publicación global
        if (attrValue.startsWith('publish')) {
          const [, topic, scope, ...extraArgs] = attrValue.split(':');
          if (!topic) {
            console.warn('Falta el topic en el publish:', attrValue);
            return;
          }
          const publisherId = scope === 'local' ? ctx.instanceId : undefined;
          el.addEventListener(eventName, (ev) => {
            const params = extraArgs.length > 0 ? resolveArgs(extraArgs, ctx) : [];
            pubSub.publish(topic, {
              event: ev,
              target: el,
              args: params
            }, publisherId);
          });
        }
        // Caso B: El evento dispara un método del componente
        else {
          const [handlerName, ...eventArgs] = attrValue.split(':');
          const handler = ctx[handlerName || ''] || ctx.handlers?.[handlerName || ''];
          if (typeof handler === 'function') {
            const resolvedArgs = resolveArgs(eventArgs, ctx);
            el.addEventListener(eventName, (e) => {
              handler.call(ctx, el, e, ...resolvedArgs);
            });
          }
        }
        el.removeAttribute(attrName);
      }
      else if (attrName === 'data-bind') {
        // Formato: "tipo:path" o "tipo.propiedad:path".
        // Se permiten varios bindings separados por ';'.
        attrValue
          .split(';')
          .map(bindingDef => bindingDef.trim())
          .filter(Boolean)
          .forEach(bindingDef => {
            const [typeAndProp = '', ...pathTokens] = bindingDef.split(':').map(s => s.trim());
            const path = pathTokens.join(':');
            const params = resolveArgs(pathTokens, ctx);
            const [type, prop] = typeAndProp.includes('.')
              ? typeAndProp.split('.')
              : [typeAndProp, null];
            const binding: ComponentBinding = {
              element: el,
              type,
              prop,
              path,
              params,
              lastValue: UNSET,
            };
            // Dependencias explícitas para funciones: si el binding es de tipo 'fn', 
            // buscamos un atributo 'data-deps' que contenga las expresiones de las dependencias 
            // separadas por comas.
            if (type === 'fn') {
              const depsAttr = el.getAttribute('data-deps');
              if (depsAttr)
                binding.depExpressions = depsAttr.split(',').map(d => d.trim()).filter(Boolean);
            }
            ctx.bindings.push(binding);
            resolveBindingValue(binding, ctx);
          });
        el.removeAttribute('data-deps');
        el.removeAttribute(attrName);
      }
    });
    currentNode = walker.nextNode();
  }
  return container;
}

// function toAttrName(value: string): string {
//   return value
//         .replace(/([A-Z])/g, '-$1')
//         .toLowerCase()
//         .replace(/^-/, '');
// }

export async function hydrateComponents(root: HTMLElement, ctx: ComponentContext): Promise<void> {
  const placeholders = root.querySelectorAll<HTMLElement>('[data-component]');

  for (const el of Array.from(placeholders)) {
    const componentName = el.dataset.component!;
    if (!componentName) continue;
    
    const creator = componentRegistry.get(componentName);
    if (!creator) {
      console.error(`Componente ${componentName} no encontrado en el registro.`);
      continue;
    }

    const component = (isConstructor(creator)
      ? new creator(ctx)
      : creator(ctx)) as BaseComponent;

    el.removeAttribute('data-component');
    const customClasses = el.className.trim();
    component.init?.({ parent: el });
    const element = component.render() as ComponentElement;
    if (element) {
      BaseComponent.bind(component, element);
      if (!element.id) {
        element.setAttribute('id', el.id);
      }
      element.setAttribute(componentName, '');
      if (customClasses) {
        const classesArray = customClasses.split(/\s+/).filter(c => c.length > 0);
        element.classList.add(...classesArray);
      }
    }
    el.replaceWith(
      element || document.createComment(`Component ${componentName} rendered an empty element`)
    );
    component.mounted?.();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hydrateDirectives(container: HTMLElement, ctx: any) {
  // LÓGICA PARA TRADUCCIONES
  container.querySelectorAll<HTMLElement>('[data-t]').forEach(el => {
    const key = el.dataset.t!;
    const cleanKey = key.startsWith('t:') ? key.slice(2) : key;
    // el.textContent = APP_CONFIG.i18n.t(cleanKey, ctx);
    el.setAttribute('data-i18n-key', cleanKey);
  });
  // 1. Buscamos solo los bucles de PRIMER NIVEL (los que no tienen otro data-each encima)
  Array
    .from(container.querySelectorAll<HTMLElement>('[data-each]'))
    .filter(el => !el.parentElement?.closest('[data-each]'))
    .forEach(repeater => {
      const expression = repeater.dataset.each!; // "item in tasks"
      const [itemName, , ...listParts] = expression.split(' ');
      const listExpression = listParts.join(' ').trim();
      let list: unknown[] = [];
      if (listExpression.startsWith('[') && listExpression.endsWith(']')) {
        try {
          list = JSON.parse(listExpression.replace(/'/g, '"'));
        } catch (e) {
          console.error("Error parseando array estático en data-each:", e);
        }
      } else {
        list = getValue(listExpression, ctx) || [];
      }

      const templateHTML = repeater.innerHTML.replaceAll('~', '|');
      repeater.innerHTML = '';
      repeater.removeAttribute('data-each');
      // Si la lista está vacía, dejamos un ancla invisible      
      if (list.length === 0) {
        repeater.appendChild(
          document.createComment(`anchor:each-${listExpression}`)
        );
        return;
      }
      // 1. Creamos el saco virtual fuera del bucle
      const fragment = document.createDocumentFragment();
      list.forEach((item: unknown, index: number) => {
        // Si el item es un elemento del DOM, lo añadimos directamente
        if (item instanceof Node) {
          fragment.appendChild(item);
          return;
        }
        const itemCtx = Object.create(ctx);
        itemCtx[itemName || ''] = item;
        itemCtx.index = index;
        itemCtx['#'] = ctx;
        const instance = buildAndInterpolate(templateHTML, itemCtx, false);

        assingLocalCtxToElement(instance, itemCtx);

        hydrateDirectives(instance, itemCtx);
        while (instance.firstChild) {
          fragment.appendChild(instance.firstChild);
        }
      });
      repeater.appendChild(fragment);
    });
}


export function getResolver(binding: ComponentBinding): BindingResolver {
  const { type, prop, params } = binding;
  const resolvers: Record<string, BindingResolver> = {
    fn: (el, value) => {
      if (typeof value === 'function') {
        value(el, params?.slice(1));
      } else {
        console.warn(`La función '${binding.path}' no se encontró en el contexto.`);
      }
    },
    text: (el, value) => el.innerText = value ?? '',
    html: (el, value) => el.innerHTML = value ?? '',
    value: (el, value) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ref = (el as any).__instance;
      if (ref) 
        ref.setProp?.('value', value);
      else
        (el as HTMLInputElement).value = value ?? '';
    },
    checked: (el, value) => (el as HTMLInputElement).checked = !!value,
    attr: (el, value) => value === null || value === undefined ? el.removeAttribute(prop!) : el.setAttribute(prop!, String(value)),
    class: (el, value) => el.className = value ?? '',
    toggle: (el, value) => el.classList.toggle(prop!, !!value),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style: (el, value) => (el.style as any)[prop!] = value,
    show: (el, value) => el.style.display = value ? '' : 'none',
    hide: (el, value) => el.style.display = value ? 'none' : '',
    disabled: (el, value) => (el as HTMLButtonElement | HTMLInputElement).disabled = !!value
  };
  return resolvers[type] || resolvers.text || (() => {});
}

type ElementWithCtx = HTMLElement & { __localCtx__?: ComponentContext };

function assingLocalCtxToElement(element: HTMLElement, ctx: ComponentContext) {
  if (element.firstElementChild) {
    (element.firstElementChild as ElementWithCtx).__localCtx__ = ctx;
  }
}

function findLocalCtx(element: HTMLElement): ComponentContext | null {
  let current: ElementWithCtx | null = element;
  while (current) {
    const localCtx = current.__localCtx__;
    if (localCtx) return localCtx;
    current = current.parentElement;
  }
  return null;
}

function shallowEqual(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveBindingValue(binding: ComponentBinding, ctx: Record<string, unknown>): any {
  const resolver = getResolver(binding);
  let path = binding.path;
  if(
    binding.type === 'fn' && 
    binding.params && 
    binding.params.length > 0){
    // Si es una función con parámetros, el path real es el primer parámetro
    path = binding.params[0] as string;
  }
  let resolvedValue: unknown;
  const value = getValue(path, ctx);
  if (value !== undefined) {
    resolvedValue = value;
  } else {
    const localCtx = findLocalCtx(binding.element);
    resolvedValue = getValue(path, localCtx);
  }

  // --- fn con deps explícitas: memoización por dependencias ---
  if (binding.type === 'fn' && binding.depExpressions) {
    const currentDeps = binding.depExpressions.map(dep => getValue(dep, ctx));
    if (binding.lastDeps && shallowEqual(currentDeps, binding.lastDeps)) {
      return;
    }
    binding.lastDeps = currentDeps;
    binding.lastValue = resolvedValue;
    resolver(binding.element, resolvedValue);
    return;
  }

  // --- fn sin deps: siempre ejecuta ---
  if (binding.type === 'fn') {
    binding.lastValue = resolvedValue;
    resolver(binding.element, resolvedValue);
    return;
  }

  // --- Resto de tipos: dirty-check por valor ---
  if (binding.lastValue !== UNSET && Object.is(resolvedValue, binding.lastValue)) {
    return;
  }
  binding.lastValue = resolvedValue;
  resolver(binding.element, resolvedValue);
}

