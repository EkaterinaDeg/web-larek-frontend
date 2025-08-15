import { BaseComponent } from '../base/BaseComponent';
import { ApiProduct } from '../types';

export class PageView extends BaseComponent<HTMLElement[]> {
  renderCatalog(products: ApiProduct[]) {
    throw new Error('Method not implemented.');
  }
  render(cards: HTMLElement[]) {
    this.el.replaceChildren(...cards);
    return super.render();
  }
}