import { BaseComponent } from '../base/BaseComponent';
import type { ApiProduct } from '../types';
import { EventBus } from '../base/EventBus';
import { BasketItemView } from './BasketItemView';

export class BasketView extends BaseComponent<{ products: ApiProduct[] }> {
  private list!: HTMLElement;
  private totalEl!: HTMLElement;
  private checkoutBtn!: HTMLButtonElement;

  constructor(bus: EventBus) {
    const el = document.createElement('div'); // Создаем элемент div
    super(el, bus, 'basket'); // Передаем его в базовый класс
    this.el = this.cloneTemplate<HTMLElement>('basket'); // Клонируем шаблон
    this.list = this.el.querySelector('.basket__list') as HTMLElement;
    this.totalEl = this.el.querySelector('.basket__price') as HTMLElement;
    this.checkoutBtn = this.el.querySelector('.basket__button') as HTMLButtonElement;
    this.checkoutBtn.addEventListener('click', () => this.bus.emit('order:open', undefined));
  }

  render({ products }: { products: ApiProduct[] }) {
    this.list.replaceChildren();
    products.forEach((p, i) => {
      const item = new BasketItemView(this.bus);
      this.list.append(item.render({ index: i + 1, product: p }));
    });
    return super.render();
  }

  setTotal(total: number) {
    this.totalEl.textContent = `${total} синапсов`; // Используйте шаблонные строки
    this.checkoutBtn.disabled = total === 0;
  }
}