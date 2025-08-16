import { BaseComponent } from '../base/BaseComponent';
import { ApiProduct, ViewProduct } from '../types/type';
import { EventBus } from '../base/EventBus';
import { CardView } from './CardView';

export class PageView extends BaseComponent<HTMLElement[]> {
  constructor(bus: EventBus) {
    super(document.createElement('div'), bus);
    this.el.className = 'catalog';
  }

  renderCatalog(products: ApiProduct[]) {
    const cards: HTMLElement[] = products.map((product) => {
      const viewProduct: ViewProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        inBasket: false, // Синхронизация с BasketModel нужна
      };
      const card = new CardView(this.bus);
      return card.render(viewProduct);
    });
    this.el.replaceChildren(...cards);
    return this.el;
  }

  render(cards: HTMLElement[]) {
    this.el.replaceChildren(...cards);
    return super.render();
  }
}