import { build } from "./dom";

const icons: Record<string, string> = {};

export function registerIcons(iconMap: Record<string, string>) {
  for (const [name, svg] of Object.entries(iconMap)) {
    icons[name] = svg;
  }
}

export function createIcon(name: string, customClass: string = 'w-6 h-6'): SVGElement | string | undefined {
  const icon = icons[name] || '';
  if (icon) {
    const el = document.createElement('div');
    el.innerHTML = icon;
    const svg = el.firstElementChild as SVGElement | null;
    if (svg) {
      svg.setAttribute('class', customClass);
      return svg as unknown as SVGElement;
    }
  }
  return name;
}
