import { BaseComponent } from '../base/BaseComponent';
import type { ApiProduct } from '../types';
import { EventBus } from '../base/EventBus';

export class BasketItemView extends BaseComponent<{ index: number; product: ApiProduct }> {
  constructor(bus: EventBus) {
    super(document.createElement('div'), bus, 'card-basket');
  }

  render({ index, product }: { index: number; product: ApiProduct }) {
    this.setText('.basket__item-index', String(index));
    this.setText('.card__title', product.title);
    this.setText('.card__price', `${product.price ?? 0} синапсов`);

    this.el.querySelector<HTMLButtonElement>('.basket__item-delete')!
      .addEventListener('click', () => this.bus.emit('product:remove', { id: product.id }));

    return super.render(); // Можно оставить так
    // Или так, если хотите явно указать, что не передаете аргументы
    // return super.render(undefined);
  }
}