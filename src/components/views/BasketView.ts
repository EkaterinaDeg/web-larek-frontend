import { BaseComponent } from '../base/BaseComponent';
import type { ApiProduct } from '../types/type';
import { EventBus } from '../base/EventBus';
import { BasketItemView } from './BasketItemView';

export class BasketView extends BaseComponent<{ items: { product: ApiProduct; quantity: number }[] }> {
  private list: HTMLElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;

  constructor(bus: EventBus) {
    super(document.createElement('div'), bus);
    this.el.className = 'basket';

    this.list = this.createElement('ul', 'basket__list');
    this.totalEl = this.createElement('p', 'basket__price');
    this.checkoutBtn = this.createElement('button', 'basket__button');
    this.checkoutBtn.textContent = 'Оформить';
    this.checkoutBtn.disabled = true;

    this.checkoutBtn.addEventListener('click', () => this.bus.emit('order:open', undefined));
    this.el.append(this.list, this.totalEl, this.checkoutBtn);
  }

  render(items?: { items: { product: ApiProduct; quantity: number }[] }): HTMLElement {
    if (!items) return this.el;
    this.list.innerHTML = '';
    items.items.forEach(({ product, quantity }, i) => {
      const item = new BasketItemView(this.bus);
      this.list.append(item.render({ index: i + 1, product }));
    });
    const total = items.items.reduce((sum, { product, quantity }) => sum + (product.price ?? 0) * quantity, 0);
    this.setTotal(total);
    return this.el;
  }

  setTotal(total: number) {
    this.totalEl.textContent = `${total} синапсов`;
    this.checkoutBtn.disabled = total === 0;
  }
}