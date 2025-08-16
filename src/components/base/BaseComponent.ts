import { EventBus } from './EventBus';

export class BaseComponent<T = unknown> {
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

  protected setText(selector: string, value: string): boolean {
    const node = this.el.querySelector<HTMLElement>(selector);
    if (node) {
      node.textContent = value;
      return true;
    }
    return false;
  }

  protected setInputValue(selector: string, value: string): boolean {
    const node = this.el.querySelector<HTMLInputElement>(selector);
    if (node) {
      node.value = value;
      return true;
    }
    return false;
  }

  protected setDisabled(selector: string, disabled: boolean): boolean {
    const node = this.el.querySelector<HTMLButtonElement>(selector);
    if (node) {
      node.disabled = disabled;
      return true;
    }
    return false;
  }

  protected setImage(selector: string, src: string, alt?: string): boolean {
    const node = this.el.querySelector<HTMLImageElement>(selector);
    if (node) {
      node.src = src;
      if (alt) node.alt = alt;
      return true;
    }
    return false;
  }

  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    parent?: HTMLElement
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (parent) parent.appendChild(element);
    return element;
  }

  protected cloneTemplate<T extends HTMLElement>(id: string): T {
  const tpl = document.getElementById(id) as HTMLTemplateElement;
  if (!tpl) {
    throw new Error(`Template with id ${id} not found`);
  }
  return tpl.content.firstElementChild!.cloneNode(true) as T;
  }

}