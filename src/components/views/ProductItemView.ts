import { BaseComponent } from '../base/BaseComponent';
import type { ViewProduct } from '../types';
import { EventBus } from '../base/EventBus';

export class CardView extends BaseComponent<ViewProduct> {
  private data!: ViewProduct;

  constructor(bus: EventBus) {
    const el = new BaseComponent(document.createElement('div'), bus).cloneTemplate<HTMLElement>('card-preview');
    super(el, bus);
  }

  render(data: ViewProduct) {
    this.data = data;
    this.setImage('.card__image', data.image, data.title);
    this.setText('.card__title', data.title);
    this.setText('.card__price', `${data.price} синапсов`);
    const btn = this.el.querySelector<HTMLButtonElement>('.card__button')!;
    btn.textContent = data.inBasket ? 'Уже в корзине' : 'В корзину';
    btn.disabled = data.inBasket;
    btn.onclick = () => this.bus.emit('product:add', { id: data.id });
    return super.render();
  }
}