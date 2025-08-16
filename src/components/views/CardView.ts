import { BaseComponent } from '../base/BaseComponent';
import type { ViewProduct } from '../types/type';
import { EventBus } from '../base/EventBus';

export class CardView extends BaseComponent<ViewProduct> {
  constructor(bus: EventBus) {
    super(document.createElement('div'), bus);
    this.el.className = 'card';
    this.render(); // Инициализируем разметку
  }

  render(data?: ViewProduct) {
    this.el.innerHTML = ''; // Очищаем
    if (!data) return this.el;

    const img = this.createElement('img', 'card__image');
    const title = this.createElement('h3', 'card__title');
    const price = this.createElement('p', 'card__price');
    const button = this.createElement('button', 'card__button');

    img.src = data.image;
    img.alt = data.title;
    title.textContent = data.title;
    price.textContent = `${data.price} синапсов`;
    button.textContent = data.inBasket ? 'Уже в корзине' : 'В корзину';
    button.disabled = data.inBasket;
    button.onclick = () => this.bus.emit('product:add', { id: data.id });

    this.el.append(img, title, price, button);
    return this.el;
  }
}