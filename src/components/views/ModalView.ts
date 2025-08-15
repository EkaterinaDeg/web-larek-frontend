import { BaseComponent } from '../base/BaseComponent';
import { EventBus } from '../base/EventBus';

export class ModalView extends BaseComponent {
  private contentEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, bus: EventBus) {
    super(container, bus);
    this.contentEl = container.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = container.querySelector('.modal__close') as HTMLButtonElement;
    this.closeBtn.addEventListener('click', () => this.bus.emit('modal:close', undefined));
    container.addEventListener('click', (e) => {
      if (e.target === container) this.bus.emit('modal:close', undefined);
    });

    this.bus.on('modal:open', ({ content }) => {
      this.setContent(content);
      this.show();
    });
    this.bus.on('modal:close', () => this.hide());
  }

  setContent(content: HTMLElement) {
    this.contentEl.replaceChildren(content);
  }

  show() { this.el.classList.add('modal_active'); }
  hide() { this.el.classList.remove('modal_active'); }
}