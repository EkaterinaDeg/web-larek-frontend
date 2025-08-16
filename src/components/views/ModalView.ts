import { BaseComponent } from '../base/BaseComponent';
import { EventBus } from '../base/EventBus';

export class ModalView extends BaseComponent {
  private contentEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, bus: EventBus) {
    super(container, bus);
    this.el.className = 'modal';

    this.contentEl = this.createElement('div', 'modal__content');
    this.closeBtn = this.createElement('button', 'modal__close');
    this.closeBtn.textContent = 'Закрыть';

    this.el.append(this.contentEl, this.closeBtn);

    this.closeBtn.addEventListener('click', () => this.bus.emit('modal:close', undefined));
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) this.bus.emit('modal:close', undefined);
    });

    this.bus.on('modal:open', ({ content }: { content: HTMLElement }) => {
      this.setContent(content);
      this.show();
    });
    this.bus.on('modal:close', () => this.hide());
  }

  open(content: HTMLElement): void {
  this.el.innerHTML = '';
  this.el.appendChild(content);
  this.el.classList.add('modal--open');
  }

  setContent(content: HTMLElement) {
    this.contentEl.replaceChildren(content);
  }

  show() {
    this.el.classList.add('modal_active');
  }

  hide() {
    this.el.classList.remove('modal_active');
  }
}