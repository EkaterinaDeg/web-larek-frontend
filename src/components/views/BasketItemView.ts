import { BaseComponent } from '../base/BaseComponent';
import type { ApiProduct } from '../types/type';
import { EventBus } from '../base/EventBus';

export class BasketItemView extends BaseComponent<{ index: number; product: ApiProduct }> {
  constructor(bus: EventBus) {
    super(document.createElement('li'), bus);
    this.el.className = 'basket__item';
  }

  render(data: { index: number; product: ApiProduct }) {
    this.el.innerHTML = '';
    const index = this.createElement('span', 'basket__item-index');
    const title = this.createElement('h3', 'card__title');
    const price = this.createElement('p', 'card__price');
    const deleteBtn = this.createElement('button', 'basket__item-delete');

    index.textContent = `${data.index}`;
    title.textContent = data.product.title;
    price.textContent = `${data.product.price} синапсов`;
    deleteBtn.textContent = 'Удалить';
    deleteBtn.onclick = () => this.bus.emit('product:remove', { id: data.product.id });

    this.el.append(index, title, price, deleteBtn);
    return this.el;
  }
}