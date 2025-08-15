import { EventBus } from './EventBus';

export abstract class BaseComponent<T = unknown> {
  protected el: HTMLElement;
  protected bus: EventBus;

  constructor(container: HTMLElement, bus: EventBus) {
    this.el = container;
    this.bus = bus;
  }

  render(_: T | void): HTMLElement {
    return this.el;
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }

  protected setText(selector: string, value: string) {
    const n = this.el.querySelector<HTMLElement>(selector);
    if (n) n.textContent = value;
  }

  protected setInputValue(selector: string, value: string) {
    const n = this.el.querySelector<HTMLInputElement>(selector);
    if (n) n.value = value;
  }

  protected setDisabled(selector: string, disabled: boolean) {
    const n = this.el.querySelector<HTMLButtonElement>(selector);
    if (n) n.disabled = disabled;
  }

  protected setImage(selector: string, src: string, alt?: string) {
    const n = this.el.querySelector<HTMLImageElement>(selector);
    if (n) {
      n.src = src;
      if (alt) n.alt = alt;
    }
  }

  // Удобный доступ к шаблонам из HTML
  protected cloneTemplate<T extends HTMLElement = HTMLElement>(id: string): T {
    const tpl = document.getElementById(id) as HTMLTemplateElement | null;
    if (!tpl) throw new Error(`Template #${id} not found`);
    return tpl.content.firstElementChild!.cloneNode(true) as T;
  }
}

